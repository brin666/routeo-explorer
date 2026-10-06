const html = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[char]);

function buildRouteAgentPrompt(route, story, stops) {
  const stopLines = stops.map((stop, index) => {
    const lines = [`${index + 1}. ${stop.time}｜${stop.name}`];
    const title = route.story?.[index]?.title;
    if (title && title !== stop.name) lines.push(`   路线备注：${title}`);
    if (stop.body) lines.push(`   参考安排：${stop.body}`);
    if (stop.tags?.length) lines.push(`   关键词：${stop.tags.join("、")}`);
    const leg = story.legs?.[index];
    if (leg) lines.push(`   到下一站参考：${leg.mode}，${leg.duration}，${leg.distance}`);
    return lines.join("\n");
  });
  const practicalLines = story.practical?.map(([term, value]) => `- ${term}：${value}`) || [];
  const sourceLines = story.sources?.map((source) => `- ${source.label}：${source.url}`) || [];

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
    ...(sourceLines.length ? ["【可参考的官方资料】", ...sourceLines, ""] : []),
    "【请协助完善】",
    "1. 保留当前城市和景点顺序，先检查这些点是否适合按计划串联；如建议调整顺序，请说明原因。",
    "2. 输出按时间排列的行程表，补全每站建议停留时间、站间交通方式与耗时，并留出用餐、休息和排队缓冲。",
    "3. 核对景点开放时间、预约、门票和交通信息；优先使用官方来源和地图路线，并附链接与查询日期。无法核实的内容请明确标注。",
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
    this.promptText = buildRouteAgentPrompt(route, story, stops);
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
          <button type="button" data-curtain-tab="info" aria-pressed="false">实用信息</button>
          <button type="button" data-curtain-tab="related" aria-pressed="false">相关推荐</button>
        </nav>
        <div class="route-curtain__scroll">
          <section class="route-curtain__pane is-active" data-curtain-pane="route" aria-label="行程路线">
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
            <p class="route-curtain__note">路线与距离为行程示意，出发前请按当地地图和开放信息确认。</p>
          </section>
          <section class="route-curtain__pane route-practical" data-curtain-pane="info" aria-label="实用信息" hidden>
            <p class="route-practical__eyebrow">A GENTLER WAY TO GO</p>
            <h2>${html(route.title)}</h2>
            <p>${html(route.intro)}</p>
            <dl>${story.practical.map(([term, value]) => `<div><dt>${html(term)}</dt><dd>${html(value)}</dd></div>`).join("")}</dl>
            ${story.sources?.length ? `<div class="route-practical__sources"><span>官方信息</span>${story.sources.map((source) => `<a href="${html(source.url)}" target="_blank" rel="noopener noreferrer">${html(source.label)}<b aria-hidden="true">↗</b></a>`).join("")}</div>` : ""}
            <p class="route-curtain__note">景点开放时间、交通安排及季节情况可能变化，行前请以官方信息为准。</p>
          </section>
          <section class="route-curtain__pane route-related" data-curtain-pane="related" aria-label="相关路线" hidden>
            <p class="route-practical__eyebrow">KEEP WANDERING</p>
            <h2>也许你会喜欢</h2>
            ${allRoutes.filter((item) => item.id !== route.id).slice(0, 3).map((item) => `<a class="route-related__card" href="#/route/${encodeURIComponent(item.id)}"><img src="${html(item.image)}" alt="" loading="lazy" /><span><small>${html(item.place)}</small><strong>${html(item.title)}</strong><i>${html(item.days)} 日行程 · ${html(item.tags.slice(0, 2).join(" · "))}</i></span><b aria-hidden="true">↗</b></a>`).join("")}
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
        leg.className = "route-timeline-leg";
        leg.innerHTML = `<span class="route-timeline-leg__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 4v3m5-3v3m5-3v3M7 9h10l-1.5 6.5h-7L7 9Zm2.2 8.2-1 2.1m7.6-2.1 1 2.1M10 12l1 1m3-1-1 1"/></svg></span><span>${html(story.legs[index].mode)} ${html(story.legs[index].duration)}</span><i>${html(story.legs[index].distance)}</i>`;
        this.timeline.append(leg);
      }
    });

    this.launcher.addEventListener("click", () => handlers.onTogglePanel(true, { focusPanel: true }));
    this.closeButton.addEventListener("click", () => handlers.onTogglePanel(false, { returnFocus: true }));
    this.copyButton.addEventListener("click", () => this.copyPromptToClipboard());
    this.panel.addEventListener("keydown", (event) => {
      if (event.key === "Escape") handlers.onTogglePanel(false, { returnFocus: true });
    });
    this.root.querySelector(".route-curtain__tabs").addEventListener("click", (event) => {
      const tab = event.target.closest("[data-curtain-tab]");
      if (!tab) return;
      this.setActiveTab(tab.dataset.curtainTab);
    });
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
    this.root.classList.toggle("is-open", open);
    this.root.classList.toggle("skip-open-motion", !animate);
    this.panel.inert = !open;
    this.panel.setAttribute("aria-hidden", String(!open));
    this.launcher.setAttribute("aria-expanded", String(open));
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
    window.clearTimeout(this.copyResetTimer);
    this.root.remove();
  }
}

export class HoverImagePreview {
  constructor(host, initialImage) {
    this.element = document.createElement("div");
    this.element.className = "hover-image-preview";
    this.element.setAttribute("aria-hidden", "true");
    this.element.innerHTML = `<img src="${html(initialImage)}" alt="" decoding="async" /><span class="hover-image-preview__caption"></span><span class="hover-image-preview__source">ROUTEO · 场景氛围预览</span>`;
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
