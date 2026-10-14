import { loadPhotoDeckRuntime } from "./photo-deck-loader.js";
import { DiningGallery } from "./dining-gallery.js";
import { photoReferencesForPlace, referenceUrl } from "./photo-references.js";

const html = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[char]);

function buildPhotoSequence(stops, photoCandidates = {}) {
  const photos = [];
  const placeOffsets = new Map();
  stops.forEach((stop, placeIndex) => {
    const candidates = photoCandidates[stop.name] || [];
    if (candidates.length) placeOffsets.set(placeIndex, photos.length);
    candidates.forEach((photo, localIndex) => photos.push({ photo, stop, placeIndex, localIndex }));
  });
  return { photos, placeOffsets };
}

function buildRouteAgentPrompt(route, story, stops, selectedModes = []) {
  const stopLines = stops.map((stop, index) => {
    const lines = [`${index + 1}. ${stop.time}｜${stop.name}`];
    const title = route.story?.[index]?.title;
    if (title && title !== stop.name) lines.push(`   路线备注：${title}`);
    if (stop.body) lines.push(`   参考安排：${stop.body}`);
    if (stop.tags?.length) lines.push(`   关键词：${stop.tags.join("、")}`);
    if (stop.access) lines.push(`   门票与预约：${stop.access}`);
    const facts = story.stopFacts?.[stop.name];
    if (facts) {
      for (const field of facts.fields || []) {
        if (!field.displayEligible || !field.displayValue) continue;
        lines.push(`   ${field.label}来源记录：${field.displayValue}；常规来源参考，临时调整与当日余量另核`);
        const sourceUrls = [...new Set((field.evidence || []).filter((entry) => entry.literalVerified).map((entry) => entry.url).filter(Boolean))];
        if (sourceUrls.length) lines.push(`     核对来源：${sourceUrls.join("；")}`);
      }
      if (facts.unverified?.length) lines.push(`   仍需核对：${facts.unverified.join("；")}`);
    }
    const timeRecord = story.collectionContext?.timeRecords?.[index];
    if (timeRecord) {
      lines.push(`   时刻性质：${timeRecord.timeSource === "author" ? "来源作者的参考时段，仍需按出行日调整" : "本站建议时刻，不代表作者实际抵达时间"}`);
      if (timeRecord.authorTime) lines.push(`   原作者时段记录：${timeRecord.authorTime}`);
    }
    const notes = photoReferencesForPlace(story, stop.name);
    if (notes.length) lines.push(`   图文参考：${notes.map((note) => `${note.title}${note.author ? `（${note.author}）` : ""} ${note.url}`).join("；")}`);
    const leg = story.legs?.[index];
    if (leg) {
      if (leg.straightLineDistance) lines.push(`   到下一站直线距离：${leg.straightLineDistance}；交通耗时按实际道路计算`);
      lines.push(`   到下一站推荐：${leg.options?.[selectedModes[index]]?.label || leg.recommendedMode || "待选"}（${leg.recommendation || ""}）`);
      Object.values(leg.options || {}).forEach((option) => {
        lines.push(`   交通备选：${option.label}，${option.duration}，${option.distance}${option.detail ? `；${option.detail}` : ""}`);
      });
    }
    return lines.join("\n");
  });
  const practicalLines = story.practical?.map(([term, value]) => `- ${term}：${value}`) || [];
  const diningLines = story.dining?.map((restaurant) => [
    `- ${restaurant.name}（${restaurant.area}）：${restaurant.dishes}；${restaurant.price}。`,
    ...(restaurant.address ? [`  门店地址线索：${restaurant.address}`] : []),
    ...(restaurant.perPerson?.checkedAt ? [`  消费来源核对日期：${restaurant.perPerson.checkedAt}`] : []),
    ...(restaurant.note ? [`  记录与待核项：${restaurant.note}`] : []),
    ...(restaurant.materialNotes?.length ? [`  增补来源说明：${restaurant.materialNotes.join("；")}`] : []),
    ...(restaurant.photos?.length ? [`  餐品图与菜单：${restaurant.photos.map((photo) => `${photo.title}（${photo.source}）${photo.url}`).join("；")}`] : []),
    `  来源：${restaurant.url}`
  ].join("\n")) || [];
  const sourceLines = story.sources?.map((source) => `- ${source.label}：${source.url}`) || [];
  const context = story.collectionContext;
  const provenance = context ? [
    `路线依据：${context.routeKind === "researcher_subset" ? "根据作者路线保序删减的候选安排；不是作者完整原线" : "来源图文中的同日路线或日段；不代表本站已实测"}`,
    ...(context.routeWarnings || []).filter((line) => !/许可|转载|本地网页配图|文件建议时刻/.test(line)).map((line) => `- ${line}`)
  ] : [];

  return [
    "你是我的旅行规划 Agent。请把下面这份路线完善成可执行、节奏合理的旅行攻略。",
    "",
    "【当前行程】",
    `目的地：${route.city || route.place}`,
    `主题：${route.title}`,
    `天数：${route.days} 天`,
    `路线距离参考：${story.distance || "未提供"}；请按实际地图路线核对`,
    `路线想法：${route.intro}`,
    `风格标签：${route.tags?.join("、") || "未提供"}`,
    "",
    "【景点顺序与参考时间】",
    ...stopLines,
    "",
    ...(practicalLines.length ? ["【现有实用信息】", ...practicalLines, ""] : []),
    ...(diningLines.length ? ["【沿线餐饮参考】", ...diningLines, ""] : []),
    ...(sourceLines.length ? ["【资料来源与核对入口】", ...sourceLines, ""] : []),
    ...(provenance.length ? ["【路线依据与待核事项】", ...provenance, ""] : []),
    "【请协助完善】",
    "1. 保留当前城市和景点顺序，先检查这些点是否适合按计划串联；如建议调整顺序，请说明原因。",
    "2. 输出按时间排列的行程表，补全每站建议停留时间、站间交通方式与耗时，并留出用餐、休息和排队缓冲。",
    "3. 核对景点开放时间、预约、门票和交通信息，以及餐饮门牌、现行菜单与营业；区分历史单品价格、游客消费记录和当前人均。优先使用官方来源和地图路线，并附链接与查询日期。无法核实的内容请明确标注。",
    "4. 指出路线距离、时间安排或换乘上的风险，并给出轻松版调整建议。",
    "5. 目前没有提供出行日期、人数、预算和出发地点。请先列出会影响方案的必要问题；同时可基于明确假设给出初稿，不要虚构个人偏好。"
  ].join("\n");
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {}
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  Object.assign(textarea.style, { position: "fixed", inset: "0 auto auto -9999px", opacity: "0" });
  document.body.append(textarea);
  textarea.focus({ preventScroll: true });
  textarea.select();
  const copied = document.execCommand?.("copy");
  textarea.remove();
  if (!copied) throw new Error("CLIPBOARD_UNAVAILABLE");
}

const flagEmoji = { cn: "🇨🇳", jp: "🇯🇵", au: "🇦🇺", sg: "🇸🇬", fr: "🇫🇷" };
const flagSvg = {
  cn: '<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" fill="#d80027"/><path d="m5 2 .8 2.1 2.3.1-1.8 1.4.6 2.2L5 6.6 3.1 7.8l.6-2.2L2 4.2l2.3-.1L5 2Zm5 3.8.3.7.8.1-.6.5.2.8-.7-.4-.7.4.2-.8-.6-.5.8-.1.3-.7Zm2.1 2.2.3.7.8.1-.6.5.2.8-.7-.4-.7.4.2-.8-.6-.5.8-.1.3-.7Zm0 3 .3.7.8.1-.6.5.2.8-.7-.4-.7.4.2-.8-.6-.5.8-.1.3-.7Zm-2.1 2.2.3.7.8.1-.6.5.2.8-.7-.4-.7.4.2-.8-.6-.5.8-.1.3-.7Z" fill="#ffde00"/></svg>'
};

export class RouteOpening {
  constructor(route, story) {
    this.element = document.createElement("section");
    this.element.className = "route-opening";
    this.element.setAttribute("aria-label", "路线开场介绍");
    this.element.setAttribute("aria-hidden", "true");
    this.element.innerHTML = `
      <div class="route-opening__place" data-intro="place"><span class="route-opening__flag">${flagSvg[route.flag] || flagEmoji[route.flag] || ""}</span><span>${html(route.place)}</span><i aria-hidden="true"></i><span class="route-opening__season">${html(story.eyebrow)}</span></div>
      <h1 class="route-opening__title" data-intro="title">${html(route.title)}</h1>
      <div class="route-opening__details" data-intro="details">
        <div class="route-opening__facts">
          <span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.2 2"/></svg><strong>${html(story.duration.replace(/\s/g, ""))}行程</strong></span>
          <b aria-hidden="true"></b>
          <span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="18" r="2.2"/><circle cx="19" cy="6" r="2.2"/><path d="M7.2 18c6 0 4-12 9.6-12"/></svg><strong>${html(story.distance.replace(/\s/g, ""))}</strong></span>
        </div>
        <div class="route-opening__tags">${route.tags.map((tag) => `<span>${html(tag)}</span>`).join("")}</div>
      </div>
      <p class="route-opening__summary" data-intro="summary">${html(route.quote || route.intro)}</p>
    `;
  }

  reveal() {
    this.element.removeAttribute("aria-hidden");
    this.element.classList.add("is-visible");
  }
  revealPart(name) { this.element.querySelector(`[data-intro="${name}"]`)?.classList.add("is-revealed"); }
  dismiss() {
    this.element.setAttribute("aria-hidden", "true");
    this.element.classList.add("is-leaving");
  }
  destroy() { this.element.remove(); }
}

export class RouteTimelineItem {
  constructor(stop, index, handlers) {
    this.element = document.createElement("button");
    this.element.type = "button";
    this.element.className = "route-timeline-item";
    this.element.disabled = true;
    this.element.dataset.stopIndex = String(index);
    this.element.style.setProperty("--stop-order", String(index));
    this.element.setAttribute("aria-label", `${stop.time} ${stop.name}，${stop.body}`);
    this.element.innerHTML = `
      <span class="route-timeline-item__pin" style="--point-color:${html(stop.color)}" aria-hidden="true"><i></i></span>
      <span class="route-timeline-item__content">
        <span class="route-timeline-item__heading"><time>${html(stop.time)}</time><strong>${html(stop.name)}</strong><i aria-hidden="true"></i></span>
        <span class="route-timeline-item__detail">
          <span class="route-timeline-item__copy"><span>${html(stop.body)}</span><span class="route-timeline-item__tags">${stop.tags.map((tag) => `<i>${html(tag)}</i>`).join("")}</span></span>
          ${stop.access ? `<span class="route-stop-access"><b>${html(stop.accessLabel || "门票与预约")}</b><span>${html(stop.access)}</span></span>` : ""}
        </span>
      </span>`;
    this.element.addEventListener("pointerenter", (event) => handlers.onPreview(index, event));
    this.element.addEventListener("pointermove", (event) => handlers.onPreview(index, event));
    this.element.addEventListener("pointerleave", () => handlers.onPreviewEnd());
    this.element.addEventListener("focus", (event) => handlers.onPreview(index, event));
    this.element.addEventListener("blur", () => handlers.onPreviewEnd());
    this.element.addEventListener("click", () => handlers.onSelect(index));
  }

  reveal() {
    this.element.disabled = false;
    this.element.classList.add("is-revealing");
  }
  setActive(active) { this.element.classList.toggle("is-active", active); }
}

export class RouteCurtain {
  constructor(route, story, stops, allRoutes, handlers) {
    this.route = route;
    this.story = story;
    this.stops = stops;
    this.handlers = handlers;
    this.destroyed = false;
    this.isOpen = false;
    this.photoImagesActivated = false;
    this.photoDeck = null;
    this.onPhotoDeckChange = (index) => {
      if (this.destroyed || this.photoSelectionMode !== "sequence") return;
      this.syncPhotoDeckSelection(index);
    };
    this.onPhotoDeckOpen = (index) => {
      if (this.destroyed || this.photoSelectionMode !== "sequence") return;
      this.syncPhotoDeckSelection(index);
      this.openPhotoLightbox();
    };
    this.selectedModes = story.legs.map((leg) => leg.recommendedMode || "walk");
    this.promptText = buildRouteAgentPrompt(route, story, stops, this.selectedModes);
    this.root = document.createElement("aside");
    this.root.className = "route-curtain-shell";
    this.root.innerHTML = `
      <button class="route-curtain-launcher" type="button" aria-label="打开行程一览" aria-expanded="false" hidden>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6.5h14M5 12h14M5 17.5h9"/><circle cx="3.5" cy="6.5" r=".7"/><circle cx="3.5" cy="12" r=".7"/><circle cx="3.5" cy="17.5" r=".7"/></svg>
        <span>行程一览</span>
      </button>
      <section class="route-curtain" id="route-overview-${html(route.id)}" aria-label="路线行程详情" aria-hidden="true" inert>
        <header class="route-curtain__topline"><span class="route-curtain__grab" aria-hidden="true"></span><button class="route-curtain__close" type="button" aria-label="收起行程"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></header>
        <nav class="route-curtain__tabs" aria-label="路线详情分类">
          <button type="button" class="is-active" data-curtain-tab="route" aria-pressed="true">行程路线</button>
          <button type="button" data-curtain-tab="photos" aria-pressed="false">实景照片</button>
          <button type="button" data-curtain-tab="dining" aria-pressed="false">餐饮推荐</button>
        </nav>
        <div class="route-curtain__scroll">
          <section class="route-curtain__pane is-active" data-curtain-pane="route" aria-label="行程路线">
            ${story.routeBasisNote ? `<p class="route-curtain__note">${html(story.routeBasisNote)}</p>` : ""}
            <div class="route-agent-prompt">
              <div class="route-agent-prompt__top">
                <div class="route-agent-prompt__intro">
                  <span class="route-agent-prompt__eyebrow">TRIP PLANNER</span>
                  <strong>把这趟行程交给 Agent</strong>
                  <p>复制景点顺序和参考信息，让 Agent 接着完善攻略。</p>
                </div>
                <button class="route-agent-prompt__copy" type="button" aria-label="复制行程提示词给 Agent">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="7" width="11" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2"/></svg>
                  <span>复制提示词</span>
                </button>
              </div>
              <details class="route-agent-prompt__preview">
                <summary>预览发送给 Agent 的内容</summary>
                <textarea readonly rows="9" aria-label="发送给旅行 Agent 的提示词">${html(this.promptText)}</textarea>
              </details>
              <p class="route-agent-prompt__status" role="status" aria-live="polite"></p>
            </div>
            <div class="route-timeline"></div>
            ${story.practical?.length ? `<section class="route-itinerary-notes"><h3>行前提示</h3><dl>${story.practical.map(([term, value]) => `<div><dt>${html(term)}</dt><dd>${html(value)}</dd></div>`).join("")}</dl></section>` : ""}
            ${story.sources?.length ? `<div class="route-practical__sources"><span>行前核对来源</span>${story.sources.map((source) => `<a href="${html(source.url)}" target="_blank" rel="noopener noreferrer">${html(source.label)}<b aria-hidden="true">↗</b></a>`).join("")}</div>` : ""}
            <p class="route-curtain__note">路线与距离为行程示意，出发前请按当地地图和开放信息确认。</p>
          </section>
          <section class="route-curtain__pane route-photo-pane" data-curtain-pane="photos" aria-label="沿途实景照片" hidden>
            <h2>${html(route.city)}沿途实景</h2>
            <p class="route-photo-pane__intro">${html(story.photoIntro || "切换地点，拖动相片翻看实景；点击照片可放大。")}</p>
            <div class="route-photo-gallery">
              <nav class="route-photo-gallery__places" aria-label="选择照片地点">
                ${stops.map((stop, index) => `<button type="button" data-photo-place="${index}" aria-pressed="${index === 0}"><span>0${index + 1}</span>${html(stop.name)}</button>`).join("")}
              </nav>
              <div class="route-photo-deck-host" data-photo-deck aria-label="实景相片卡片堆">
                <button class="route-photo-deck-fallback" type="button" data-photo-open aria-label="放大当前照片"><img data-photo-fallback alt="" decoding="async" loading="lazy" /></button>
              </div>
              <p class="route-photo-deck-empty" data-photo-empty hidden></p>
              <button class="route-photo-gallery__continue" type="button" data-photo-continue hidden>继续看下一站照片</button>
              <p class="route-photo-deck-status" data-photo-deck-status role="status" hidden></p>
              <div class="route-photo-caption"><span data-photo-count></span><strong data-photo-title></strong><span data-photo-credit></span><a data-photo-source target="_blank" rel="noopener noreferrer">查看照片来源 ↗</a></div>
              <div class="route-photo-gallery__grid" role="group" aria-label="选择候选照片"></div>
              <section class="route-photo-references" aria-label="当前景点的参考笔记" data-photo-references hidden></section>
              <dialog class="route-photo-lightbox" aria-label="照片放大预览"><button type="button" data-photo-close aria-label="关闭放大照片">×</button><img alt="" /><p></p><a target="_blank" rel="noopener noreferrer">查看原始来源 ↗</a></dialog>
            </div>
          </section>
          <section class="route-curtain__pane route-dining-pane" data-curtain-pane="dining" aria-label="沿线餐饮推荐" hidden>
            <h2>沿线找点好吃的</h2>
            <p class="route-dining-pane__intro">${story.dining?.length ? "悬停预览，点击店铺看餐品；有菜单的店会优先展示菜单。人均旁边可查看价格来源。" : "用餐可以安排在沿途商圈；确认具体分店与消费来源后，会在这里补上推荐。"}</p>
            <div class="route-dining-list" data-dining-gallery></div>
            <p class="route-curtain__note">人均与茶饮按所标来源分别参考，实际消费随点单、茶位和服务费用变化；菜单以门店当天为准。</p>
          </section>
        </div>
      </section>`;

    this.panel = this.root.querySelector(".route-curtain");
    this.launcher = this.root.querySelector(".route-curtain-launcher");
    this.closeButton = this.root.querySelector(".route-curtain__close");
    this.copyButton = this.root.querySelector(".route-agent-prompt__copy");
    this.promptPreview = this.root.querySelector(".route-agent-prompt__preview");
    this.promptTextarea = this.promptPreview.querySelector("textarea");
    this.promptStatus = this.root.querySelector(".route-agent-prompt__status");
    this.launcher.setAttribute("aria-controls", this.panel.id);
    this.scroll = this.root.querySelector(".route-curtain__scroll");
    this.activeTab = "route";
    this.tabScrollPositions = new Map();
    this.timeline = this.root.querySelector(".route-timeline");
    this.items = stops.map((stop, index) => new RouteTimelineItem(stop, index, handlers));
    this.items.forEach((item, index) => {
      this.timeline.append(item.element);
      if (index < story.legs.length) {
        const leg = document.createElement("div");
        leg.className = "route-timeline-leg route-timeline-leg--selectable";
        const legData = story.legs[index];
        leg.dataset.legIndex = String(index);
        const optionMarkup = ["walk", "transit", "cycle"].map((mode) => {
          const option = legData.options?.[mode];
          if (!option) return "";
          const selected = this.selectedModes[index] === mode;
          return `<button type="button" class="route-mode-option${selected ? " is-selected" : ""}" data-leg-mode="${mode}" data-leg-index="${index}" aria-pressed="${selected}" aria-label="选择${html(legData.from)}到${html(legData.to)}的${html(option.label)}方案"><span>${html(option.label)}</span><strong>${html(option.duration)}</strong><small>${html(option.distance)}</small></button>`;
        }).join("");
        leg.innerHTML = `<div class="route-timeline-leg__label"><span class="route-timeline-leg__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 4v3m5-3v3m5-3v3M7 9h10l-1.5 6.5h-7L7 9Zm2.2 8.2-1 2.1m7.6-2.1 1 2.1M10 12l1 1m3-1-1 1"/></svg></span><span>${html(legData.from)} → ${html(legData.to)}${legData.straightLineDistance ? ` · 直线${html(legData.straightLineDistance)}` : ""}</span></div><div class="route-mode-options" role="group" aria-label="选择站间交通方式">${optionMarkup}</div><small class="route-timeline-leg__recommendation">推荐：${html(legData.recommendation || "步行")}</small>`;
        this.timeline.append(leg);
      }
    });

    this.timeline.addEventListener("click", (event) => {
      const option = event.target.closest("[data-leg-mode]");
      if (!option) return;
      const index = Number(option.dataset.legIndex);
      const mode = option.dataset.legMode;
      if (!Number.isInteger(index) || !story.legs[index]?.options?.[mode]) return;
      this.setLegMode(index, mode);
      handlers.onLegModeSelect?.(index, mode);
    });

    this.photoPane = this.root.querySelector("[data-curtain-pane='photos']");
    const referencePanel = this.photoPane.querySelector("[data-photo-references]");
    referencePanel.addEventListener("pointerenter", () => { this.referenceHovered = true; this.updatePhotoDeckActivity(); });
    referencePanel.addEventListener("pointerleave", () => { this.referenceHovered = false; this.updatePhotoDeckActivity(); });
    referencePanel.addEventListener("focusin", () => { this.referenceFocused = true; this.updatePhotoDeckActivity(); });
    referencePanel.addEventListener("focusout", (event) => {
      if (event.relatedTarget && referencePanel.contains(event.relatedTarget)) return;
      this.referenceFocused = false;
      this.updatePhotoDeckActivity();
    });
    if (typeof IntersectionObserver === "function") {
      this.referenceVisibilityObserver = new IntersectionObserver(([entry]) => {
        this.referencesVisible = entry.isIntersecting;
        this.updatePhotoDeckActivity();
      }, { root: this.scroll, threshold: 0 });
      this.referenceVisibilityObserver.observe(referencePanel);
    }
    this.photoSequence = buildPhotoSequence(stops, story.photoCandidates);
    this.photoSequenceKey = `${this.route.id}:route-photos:${this.photoSequence.photos.map(({ photo }) => photo.image).join("|")}`;
    this.photoDeckCollectionKey = null;
    this.photoDeckInitialIndex = 0;
    this.galleryPlaceIndex = this.photoSequence.photos[0]?.placeIndex ?? 0;
    this.galleryPhotoIndex = this.photoSequence.photos.length ? 0 : -1;
    this.photoSelectionMode = this.photoSequence.photos.length ? "sequence" : "empty";
    this.renderPhotoSelection();
    this.photoPane.addEventListener("click", (event) => this.handlePhotoGalleryClick(event));
    this.photoPane.querySelector(".route-photo-lightbox").addEventListener("close", () => this.updatePhotoDeckActivity());
    this.photoMotionObserver = new MutationObserver(() => this.updatePhotoDeckActivity());
    this.photoMotionObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    this.diningGallery = new DiningGallery(this.root.querySelector("[data-dining-gallery]"), story.dining || []);
    this.updateDiningActivity();

    this.launcher.addEventListener("click", () => handlers.onTogglePanel(true, { focusPanel: true }));
    this.closeButton.addEventListener("click", () => handlers.onTogglePanel(false, { returnFocus: true }));
    this.copyButton.addEventListener("click", () => this.copyPromptToClipboard());
    this.panel.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !this.photoPane.querySelector(".route-photo-lightbox").open) handlers.onTogglePanel(false, { returnFocus: true });
    });
    this.root.querySelector(".route-curtain__tabs").addEventListener("click", (event) => {
      const tab = event.target.closest("[data-curtain-tab]");
      if (!tab) return;
      this.setActiveTab(tab.dataset.curtainTab);
    });
  }

  setLegMode(index, mode) {
    this.selectedModes[index] = mode;
    this.root.querySelectorAll(`[data-leg-index="${index}"][data-leg-mode]`).forEach((button) => {
      const selected = button.dataset.legMode === mode;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    const leg = this.story.legs[index];
    const recommendation = this.timeline.querySelector(`[data-leg-index="${index}"].route-timeline-leg .route-timeline-leg__recommendation`);
    if (recommendation) recommendation.textContent = `已选：${leg.options[mode].label} · ${leg.options[mode].duration}；${leg.recommendation || ""}`;
    this.promptText = buildRouteAgentPrompt(this.route, this.story, this.stops, this.selectedModes);
    this.promptTextarea.value = this.promptText;
  }

  renderPhotoSelection({ updateDeck = true, updateActivity = true } = {}) {
    if (!this.photoPane) return;
    const stop = this.stops[this.galleryPlaceIndex];
    const photo = this.currentPhoto();
    const fallback = this.photoPane.querySelector("[data-photo-fallback]");
    const empty = this.photoPane.querySelector("[data-photo-empty]");
    if (fallback) {
      fallback.parentElement.hidden = !photo;
      if (photo) {
        const image = photo.displayImage || photo.image;
        if (this.photoImagesActivated) fallback.src = image;
        else fallback.removeAttribute("src");
        fallback.alt = `${stop.name}：${photo.title || "实景照片"}`;
      } else fallback.removeAttribute("src");
    }
    if (empty) {
      empty.hidden = Boolean(photo) || Boolean(this.photoDeck);
      empty.textContent = this.photoSelectionMode === "empty" ? `${stop.name}的实景照片待补充` : this.story.photoEmptyText || "这个地点的实景照片待补充";
    }
    const gallery = this.photoPane.querySelector(".route-photo-gallery");
    gallery.classList.toggle("is-empty-selection", this.photoSelectionMode === "empty");
    const continueButton = this.photoPane.querySelector("[data-photo-continue]");
    continueButton.hidden = this.photoSelectionMode !== "empty" || !this.photoSequence.photos.length;
    continueButton.textContent = this.hasLaterPhotoPlace() ? "继续看下一站照片" : "继续看沿途照片";
    this.renderPhotoNavigation();
    this.renderPhotoMetadata();
    if (updateActivity) this.updatePhotoDeckActivity();
    else if (updateDeck && this.photoDeck) this.syncPhotoDeckProps();
  }

  currentPhotos() {
    return this.story.photoCandidates?.[this.stops[this.galleryPlaceIndex]?.name] || [];
  }

  currentPhotoEntry() {
    if (this.photoSelectionMode !== "sequence") return null;
    return this.photoSequence.photos[this.galleryPhotoIndex] || null;
  }

  currentPhoto() {
    return this.currentPhotoEntry()?.photo || null;
  }

  renderPhotoNavigation() {
    const stop = this.stops[this.galleryPlaceIndex];
    const selectedEntry = this.currentPhotoEntry();
    const photos = this.currentPhotos();
    const grid = this.photoPane.querySelector(".route-photo-gallery__grid");
    if (grid.dataset.photoPlaceKey !== String(this.galleryPlaceIndex)) {
      grid.innerHTML = photos.map((candidate, index) => {
        const selected = selectedEntry?.placeIndex === this.galleryPlaceIndex && selectedEntry.localIndex === index;
        const thumbnail = candidate.thumbnailImage || candidate.image;
        const sourceAttribute = this.photoImagesActivated ? "src" : "data-photo-image-src";
        return `<button type="button" class="route-photo-thumb${selected ? " is-selected" : ""}" data-photo-index="${index}" aria-pressed="${selected}" aria-label="查看${html(stop.name)}照片 ${index + 1}"><img ${sourceAttribute}="${html(thumbnail)}" alt="" loading="lazy" decoding="async" /><span>${String(index + 1).padStart(2, "0")}</span></button>`;
      }).join("");
      grid.dataset.photoPlaceKey = String(this.galleryPlaceIndex);
    }
    grid.hidden = !photos.length;
    this.photoPane.querySelectorAll("[data-photo-place]").forEach((button) => {
      const selected = Number(button.dataset.photoPlace) === this.galleryPlaceIndex;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
      button.dataset.photoPlaceEmpty = String(!(this.story.photoCandidates?.[this.stops[Number(button.dataset.photoPlace)]?.name] || []).length);
    });
  }

  syncPhotoDeckSelection(index) {
    const entry = this.photoSequence.photos[index];
    if (!entry) return;
    this.galleryPlaceIndex = entry.placeIndex;
    this.galleryPhotoIndex = index;
    this.photoSelectionMode = "sequence";
    this.renderPhotoSelection({ updateDeck: false, updateActivity: false });
  }

  hasLaterPhotoPlace() {
    return this.photoSequence.photos.some((entry) => entry.placeIndex > this.galleryPlaceIndex);
  }

  continuePhotoSequence() {
    if (!this.photoSequence.photos.length) return;
    const nextEntry = this.photoSequence.photos.find((entry) => entry.placeIndex > this.galleryPlaceIndex);
    this.selectSequencePhoto(nextEntry ? this.photoSequence.photos.indexOf(nextEntry) : 0);
  }

  selectSequencePhoto(index) {
    const entry = this.photoSequence.photos[index];
    if (!entry) return;
    this.galleryPlaceIndex = entry.placeIndex;
    this.galleryPhotoIndex = index;
    this.photoSelectionMode = "sequence";
    this.renderPhotoSelection({ updateDeck: false, updateActivity: false });
    if (this.photoDeck && this.photoDeckCollectionKey === this.photoSequenceKey) this.photoDeck.select(index);
    else this.updatePhotoDeckActivity();
  }

  renderPhotoMetadata() {
    const photos = this.currentPhotos();
    const photo = this.currentPhoto();
    const entry = this.currentPhotoEntry();
    const stop = this.stops[this.galleryPlaceIndex];
    const authors = new Set(photos.map((candidate) => candidate.artist).filter(Boolean));
    this.photoPane.querySelector("[data-photo-count]").textContent = photos.length ? `${stop.name} · ${photos.length} 张实景${authors.size ? ` · ${authors.size} 位作者` : ""}` : stop.name;
    this.photoPane.querySelector("[data-photo-title]").textContent = photo ? String(photo.title || stop.name).replace(/\.[^.]+$/, "") : "";
    this.photoPane.querySelector("[data-photo-credit]").textContent = photo ? `${photo.creditLabel || "作者"}：${photo.artist || "未注明"}` : "";
    const source = this.photoPane.querySelector("[data-photo-source]");
    const originalUrl = referenceUrl(photo?.source);
    source.hidden = !originalUrl;
    if (originalUrl) source.href = originalUrl;
    else source.removeAttribute("href");
    source.textContent = referenceUrl(photo?.source).includes("xiaohongshu.com/explore/") ? "查看原笔记 ↗" : "查看照片来源 ↗";
    this.renderPhotoReferences();
    this.photoPane.querySelectorAll("[data-photo-index]").forEach((button) => {
      const selected = entry?.placeIndex === this.galleryPlaceIndex && Number(button.dataset.photoIndex) === entry.localIndex;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  renderPhotoReferences() {
    const panel = this.photoPane.querySelector("[data-photo-references]");
    const stop = this.stops[this.galleryPlaceIndex];
    const key = String(this.galleryPlaceIndex);
    if (panel.dataset.placeKey !== key) {
      const references = photoReferencesForPlace(this.story, stop.name);
      panel.hidden = !references.length;
      panel.dataset.placeKey = key;
      const noteOnly = references.every((reference) => reference.kind === "note");
      const row = (reference) => `<a class="route-photo-reference" href="${html(reference.url)}" data-reference-url="${html(reference.url)}" target="_blank" rel="noopener noreferrer"><span class="route-photo-reference__body"><strong>${html(reference.title)}</strong><small>${html(reference.author || "原始来源")}${reference.photoCount ? ` · 已选 ${reference.photoCount} 张照片` : " · 游玩参考"}<em data-reference-current hidden>当前照片</em></small></span><span class="route-photo-reference__arrow" aria-hidden="true">↗</span></a>`;
      panel.innerHTML = `<header><h3>${noteOnly ? "参考笔记" : "参考笔记与图片来源"}</h3><span>${references.length} ${noteOnly ? "篇" : "条"}</span></header><div class="route-photo-references__list">${references.slice(0, 3).map(row).join("")}</div>${references.length > 3 ? `<details class="route-photo-references__more"><summary>更多${noteOnly ? "笔记" : "来源"}（${references.length - 3}）</summary><div class="route-photo-references__list">${references.slice(3).map(row).join("")}</div></details>` : ""}`;
    }
    const activeUrl = referenceUrl(this.currentPhoto()?.source);
    panel.querySelectorAll("[data-reference-url]").forEach((link) => {
      const active = Boolean(activeUrl) && link.dataset.referenceUrl === activeUrl;
      link.classList.toggle("is-current", active);
      link.querySelector("[data-reference-current]").hidden = !active;
    });
  }

  photoDeckActive() {
    return this.isOpen && this.activeTab === "photos" && !this.photoPane.querySelector(".route-photo-lightbox").open;
  }

  photoDeckProps() {
    const stop = this.stops[this.galleryPlaceIndex];
    const isEmptySelection = this.photoSelectionMode === "empty";
    const slides = isEmptySelection ? [] : this.photoSequence.photos.map(({ photo, stop: photoStop }) => ({ image: photo.displayImage || photo.image, title: photo.title, alt: `${photoStop.name}：${photo.title || "实景照片"}` }));
    const collectionKey = isEmptySelection ? `${this.route.id}:empty-place:${this.galleryPlaceIndex}` : this.photoSequenceKey;
    return {
      slides,
      collectionKey,
      initialIndex: isEmptySelection ? 0 : Math.max(0, this.galleryPhotoIndex),
      active: this.photoDeckActive(),
      reducedMotion: document.body.classList.contains("reduce-motion"),
      autoplay: 5200,
      pauseAutoplay: Boolean(this.referenceHovered || this.referenceFocused || (this.referencesVisible && window.matchMedia("(hover: none), (pointer: coarse)").matches)),
      scatter: 7,
      ariaLabel: isEmptySelection ? `${stop.name}实景照片` : `${this.route.city}沿途实景照片`,
      emptyMessage: isEmptySelection ? `${stop.name}的实景照片待补充` : this.story.photoEmptyText || "这个地点的实景照片待补充",
      onChange: this.onPhotoDeckChange,
      onOpen: this.onPhotoDeckOpen
    };
  }

  syncPhotoDeckProps() {
    if (!this.photoDeck) return;
    const props = this.photoDeckProps();
    if (props.collectionKey !== this.photoDeckCollectionKey) {
      this.photoDeckCollectionKey = props.collectionKey;
      this.photoDeckInitialIndex = props.initialIndex;
    } else props.initialIndex = this.photoDeckInitialIndex;
    this.photoDeck.update(props);
  }

  ensurePhotoDeck() {
    if (this.photoDeck || this.photoDeckLoading || this.destroyed) return;
    this.photoDeckLoading = loadPhotoDeckRuntime().then((runtime) => {
      if (this.destroyed || !this.photoPane.isConnected) return;
      const props = this.photoDeckProps();
      this.photoDeckCollectionKey = props.collectionKey;
      this.photoDeckInitialIndex = props.initialIndex;
      this.photoDeck = runtime.mountPhotoDeck(this.photoPane.querySelector("[data-photo-deck]"), props);
      this.renderPhotoSelection({ updateDeck: false, updateActivity: false });
      const status = this.photoPane.querySelector("[data-photo-deck-status]");
      status.hidden = true;
      return this.photoDeck.ready;
    }).catch(() => {
      if (this.destroyed) return;
      const status = this.photoPane.querySelector("[data-photo-deck-status]");
      status.hidden = false;
      status.textContent = "相片交互暂时无法加载，仍可点击照片放大查看。";
    }).finally(() => { this.photoDeckLoading = null; });
  }

  updatePhotoDeckActivity() {
    if (this.destroyed || !this.photoPane) return;
    if (this.photoDeck) this.syncPhotoDeckProps();
    else if (this.photoDeckActive()) this.ensurePhotoDeck();
  }

  openPhotoLightbox() {
    const photo = this.currentPhoto();
    const lightbox = this.photoPane.querySelector(".route-photo-lightbox");
    if (!photo || lightbox.open) return;
    const image = lightbox.querySelector("img");
    image.src = photo.image;
    image.alt = photo.title || this.stops[this.galleryPlaceIndex].name;
    lightbox.querySelector("p").textContent = `${photo.title || "实景照片"} · ${photo.creditLabel || "作者"}：${photo.artist || "未注明"}`;
    const source = lightbox.querySelector("a");
    const originalUrl = referenceUrl(photo.source);
    source.hidden = !originalUrl;
    if (originalUrl) source.href = originalUrl;
    else source.removeAttribute("href");
    lightbox.showModal();
    this.updatePhotoDeckActivity();
  }

  handlePhotoGalleryClick(event) {
    const place = event.target.closest("[data-photo-place]");
    if (place) {
      const placeIndex = Number(place.dataset.photoPlace);
      if (!Number.isInteger(placeIndex) || !this.stops[placeIndex]) return;
      const firstPhotoIndex = this.photoSequence.placeOffsets.get(placeIndex);
      if (firstPhotoIndex !== undefined) {
        this.selectSequencePhoto(firstPhotoIndex);
      } else {
        this.galleryPlaceIndex = placeIndex;
        this.galleryPhotoIndex = -1;
        this.photoSelectionMode = "empty";
        this.renderPhotoSelection();
      }
      return;
    }
    const thumb = event.target.closest("[data-photo-index]");
    if (thumb) {
      const localIndex = Number(thumb.dataset.photoIndex);
      const firstPhotoIndex = this.photoSequence.placeOffsets.get(this.galleryPlaceIndex);
      if (firstPhotoIndex === undefined || !Number.isInteger(localIndex)) return;
      this.selectSequencePhoto(firstPhotoIndex + localIndex);
      return;
    }
    if (event.target.closest("[data-photo-continue]")) {
      this.continuePhotoSequence();
      return;
    }
    const close = event.target.closest("[data-photo-close]");
    const lightbox = this.photoPane.querySelector(".route-photo-lightbox");
    if (close) { lightbox.close(); return; }
    if (event.target === lightbox) { lightbox.close(); return; }
    if (event.target.closest("[data-photo-open]")) this.openPhotoLightbox();
  }

  setActiveTab(name) {
    const selected = this.root.querySelector(`[data-curtain-tab="${name}"]`);
    if (!selected) return;
    const tabChanged = this.activeTab !== name;
    if (tabChanged) this.tabScrollPositions.set(this.activeTab, this.scroll.scrollTop);
    this.root.querySelectorAll("[data-curtain-tab]").forEach((tab) => {
      const active = tab === selected;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-pressed", String(active));
    });
    this.root.querySelectorAll("[data-curtain-pane]").forEach((pane) => {
      const active = pane.dataset.curtainPane === name;
      pane.hidden = !active;
      pane.classList.toggle("is-active", active);
    });
    if (tabChanged) {
      this.activeTab = name;
      this.scroll.scrollTop = this.tabScrollPositions.get(name) || 0;
    }
    this.root.classList.toggle("is-photos", name === "photos");
    if (name === "photos" && this.isOpen) this.activatePhotoImages();
    this.updatePhotoDeckActivity();
    this.updateDiningActivity();
  }

  activatePhotoImages() {
    if (this.photoImagesActivated || !this.photoPane) return;
    this.photoImagesActivated = true;
    const photo = this.currentPhoto();
    const fallback = this.photoPane.querySelector("[data-photo-fallback]");
    if (photo && fallback) fallback.src = photo.displayImage || photo.image;
    this.photoPane.querySelectorAll("[data-photo-image-src]").forEach((image) => {
      image.src = image.dataset.photoImageSrc;
      image.removeAttribute("data-photo-image-src");
    });
  }

  updateDiningActivity() {
    this.diningGallery?.setActive(this.isOpen && this.activeTab === "dining");
  }

  async copyPromptToClipboard() {
    this.copyButton.disabled = true;
    try {
      await copyTextToClipboard(this.promptText);
      this.copyButton.classList.add("is-copied");
      this.copyButton.querySelector("span").textContent = "已复制";
      this.promptStatus.textContent = "行程提示词已复制，粘贴到你的 Agent 即可继续规划。";
      window.clearTimeout(this.copyResetTimer);
      this.copyResetTimer = window.setTimeout(() => {
        this.copyButton.classList.remove("is-copied");
        this.copyButton.querySelector("span").textContent = "复制提示词";
      }, 2200);
    } catch {
      this.promptPreview.open = true;
      this.promptTextarea.focus({ preventScroll: true });
      this.promptTextarea.select();
      this.promptStatus.textContent = "自动复制不可用，提示词已展开并选中，可手动复制。";
    } finally {
      this.copyButton.disabled = false;
    }
  }

  revealStop(index) {
    this.items[index]?.reveal();
    this.setActiveStop(index);
  }

  setActiveStop(index) {
    this.items.forEach((item, itemIndex) => item.setActive(itemIndex === index));
  }

  scrollStopIntoView(index) {
    if (this.activeTab !== "route") return;
    const item = this.items[index]?.element;
    if (!item || !this.scroll) return;
    const scrollTop = this.scroll.scrollTop;
    const scrollBottom = scrollTop + this.scroll.clientHeight;
    const containerTop = this.scroll.getBoundingClientRect().top;
    const itemRect = item.getBoundingClientRect();
    const itemTop = itemRect.top - containerTop + scrollTop;
    const itemBottom = itemTop + itemRect.height;
    const nextScrollTop = itemTop < scrollTop
      ? itemTop
      : itemBottom > scrollBottom
        ? itemBottom - this.scroll.clientHeight
        : scrollTop;
    if (Math.abs(nextScrollTop - scrollTop) > 1) {
      this.tabScrollPositions.set("route", Math.max(0, nextScrollTop));
      this.scroll.scrollTo({
        top: Math.max(0, nextScrollTop),
        behavior: document.body.classList.contains("reduce-motion") ? "auto" : "smooth"
      });
    }
  }

  setOpen(open, { animate = true } = {}) {
    this.isOpen = open;
    if (open && this.activeTab === "photos") this.activatePhotoImages();
    this.root.classList.toggle("is-open", open);
    this.root.classList.toggle("skip-open-motion", !animate);
    this.panel.inert = !open;
    this.panel.setAttribute("aria-hidden", String(!open));
    this.launcher.setAttribute("aria-expanded", String(open));
    this.updatePhotoDeckActivity();
    this.updateDiningActivity();
    if (!animate) requestAnimationFrame(() => this.root.classList.remove("skip-open-motion"));
  }

  setLauncherAvailable(available) {
    this.launcher.hidden = !available;
  }

  focusCloseButton() {
    this.closeButton.focus({ preventScroll: true });
  }

  focusLauncher() {
    if (!this.launcher.hidden) this.launcher.focus({ preventScroll: true });
  }

  destroy() {
    this.destroyed = true;
    window.clearTimeout(this.copyResetTimer);
    this.photoMotionObserver?.disconnect();
    this.referenceVisibilityObserver?.disconnect();
    this.photoDeck?.destroy();
    this.diningGallery?.destroy();
    this.photoPane?.querySelector(".route-photo-lightbox")?.close();
    this.root.remove();
  }
}

export class HoverImagePreview {
  constructor(host) {
    this.element = document.createElement("div");
    this.element.className = "hover-image-preview";
    this.element.setAttribute("aria-hidden", "true");
    this.element.innerHTML = `<img alt="" decoding="async" /><span class="hover-image-preview__caption"></span><span class="hover-image-preview__source">ROUTEO · 场景氛围预览</span>`;
    this.image = this.element.querySelector("img");
    this.caption = this.element.querySelector(".hover-image-preview__caption");
    this.target = { x: 0, y: 0 };
    this.position = { x: 0, y: 0 };
    this.frame = 0;
    this.visible = false;
    this.host = host;
    host.append(this.element);
  }

  show(stop, imageUrl, event) {
    this.visible = true;
    if (this.image.getAttribute("src") !== imageUrl) this.image.src = imageUrl;
    this.image.style.setProperty("--photo-x", stop.previewPosition || "50%");
    this.caption.textContent = stop.name;
    this.element.classList.add("is-visible");
    this.move(event);
  }

  move(event) {
    const compact = window.innerWidth <= 760;
    const width = compact ? 188 : 220;
    const height = compact ? 128 : 150;
    const gap = 22;
    const hasPointer = event && typeof event.clientX === "number";
    const rect = !hasPointer ? event?.currentTarget?.getBoundingClientRect() : null;
    if (!hasPointer && !rect) return;
    const anchorX = hasPointer ? event.clientX : rect.right;
    const anchorY = hasPointer ? event.clientY : rect.top + 22;
    let x = anchorX + gap;
    let y = hasPointer ? anchorY - height - 16 : anchorY - height * 0.4;
    if (x + width > window.innerWidth - 14) x = anchorX - width - gap;
    if (y < 12) y = anchorY + gap;

    const openCurtain = this.host.querySelector(".route-curtain-shell.is-open");
    const curtainRect = openCurtain?.getBoundingClientRect();
    const hoveringCurtain = Boolean(event.currentTarget?.closest?.(".route-curtain-shell"));
    if (curtainRect && hoveringCurtain) {
      x = curtainRect.left - width - gap;
      y = anchorY - height / 2;
    } else if (curtainRect) {
      const overlapsCurtain = x < curtainRect.right && x + width > curtainRect.left && y < curtainRect.bottom && y + height > curtainRect.top;
      if (overlapsCurtain) {
        const left = curtainRect.left - width - gap;
        const right = curtainRect.right + gap;
        if (left >= 12) x = left;
        else if (right + width <= window.innerWidth - 12) x = right;
        else {
          const above = curtainRect.top - height - gap;
          const below = curtainRect.bottom + gap;
          if (above >= 12) y = above;
          else if (below + height <= window.innerHeight - 12) y = below;
          else {
            this.hide();
            return;
          }
        }
      }
    }
    this.target = { x: Math.max(12, Math.min(window.innerWidth - width - 12, x)), y: Math.max(12, Math.min(window.innerHeight - height - 12, y)) };
    if (!this.frame) this.tick();
  }

  tick = () => {
    this.position.x += (this.target.x - this.position.x) * 0.24;
    this.position.y += (this.target.y - this.position.y) * 0.24;
    this.element.style.transform = `translate3d(${this.position.x}px,${this.position.y}px,0) scale(${this.visible ? 1 : .96})`;
    if (Math.abs(this.position.x - this.target.x) > 0.4 || Math.abs(this.position.y - this.target.y) > 0.4) this.frame = requestAnimationFrame(this.tick);
    else this.frame = 0;
  };

  hide() {
    this.visible = false;
    this.element.classList.remove("is-visible");
  }

  destroy() {
    cancelAnimationFrame(this.frame);
    this.element.remove();
  }
}
