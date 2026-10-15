import { RouteMapPreview } from "./route-map-preview.js";
import { FeedTimelinePreview, routeTimelineStops } from "./feed-timeline.js";
import { ROUTES, JOURNEYS, ROUTE_LOADERS } from "./feed-data.js";

const routeFeed = document.querySelector("#route-feed");
const storyView = document.querySelector("#story-view");
const exploreView = document.querySelector("#explore-view");
const searchInput = document.querySelector("#route-search");
const searchClear = document.querySelector("#search-clear");
const feedCount = document.querySelector("#feed-count");
const emptyState = document.querySelector("#empty-state");
const toast = document.querySelector("#toast");
const settingsPopover = document.querySelector("#settings-popover");
const reduceMotionToggle = document.querySelector("#reduce-motion");
const cityDialog = document.querySelector("#city-dialog");
const itineraryDialog = document.querySelector("#itinerary-dialog");
const cityPicker = document.querySelector("#city-picker-toggle");
const featuredCities = ["广州", "成都", "南京"].filter((city) => ROUTES.some((route) => route.city === city));
const cities = [...new Set(ROUTES.map((route) => route.city))];
const feedTimelinePreview = new FeedTimelinePreview(routeFeed, ROUTES, JOURNEYS);

const SAVED_KEY = "routeo:saved-routes:v1";
const MOTION_KEY = "routeo:reduce-motion:v1";
const savedRoutes = readSavedRoutes();
let activeFilter = { type: "all", value: "all" };
let activeView = "explore";
let activeRouteStoryController = null;
let feedScrollY = 0;
let toastTimer = 0;
let storyRequest = 0;
let cardImageObserver;
const journeyRequests = new Map();

function readSavedRoutes() {
  try {
    const value = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
    const normalized = Array.isArray(value)
      ? value.map((id) => id === "kyoto-autumn-walk" ? "suzhou-garden-walk" : id)
      : [];
    return new Set(normalized.filter((id) => ROUTES.some((route) => route.id === id)));
  } catch {
    return new Set();
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}


function clockIcon() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg>';
}

function heartIcon() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.3 8.8c0 5.1-8.3 11-8.3 11s-8.3-5.9-8.3-11a4.4 4.4 0 0 1 8.3-2 4.4 4.4 0 0 1 8.3 2Z"/></svg>';
}

function arrowLeftIcon() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>';
}

function routeCard(route, index) {
  const isSaved = savedRoutes.has(route.id);
  const stops = routeTimelineStops(route, JOURNEYS[route.id]);
  const timelineDescription = stops.map((stop) => `${stop.time} ${stop.name}`).join("，");
  const names = stops.map((stop) => stop.name);
  const itinerary = names.length > 4 ? `${names.slice(0, 3).join(" → ")} … ${names.at(-1)}` : names.join(" → ");
  return `<article class="route-card route-card--${route.theme}" data-route-card="${route.id}">
    <div class="route-card__map" aria-hidden="true">${RouteMapPreview(route, { priority: index === 0, deferred: index > 2 })}</div>
    <div class="route-card__scrim" aria-hidden="true"></div>
    <a class="route-card__link" href="#/route/${route.id}" aria-label="打开路线故事：${escapeHtml(route.place)}，${escapeHtml(route.title)}，${route.days}日行程" aria-describedby="route-itinerary-${route.id}">
      <span class="sr-only">查看${escapeHtml(route.title)}路线故事</span>
    </a>
    <span class="sr-only" id="route-itinerary-${route.id}">${escapeHtml(timelineDescription)}</span>
    <div class="route-card__timeline" data-feed-timeline aria-hidden="true"></div>
    <div class="route-card__meta">
      <div class="route-card__eyebrow"><span class="place-badge">${escapeHtml(route.city)}</span><p class="trip-length">${clockIcon()}<span>${route.days}日 · ${stops.length}站</span></p></div>
      <h2 class="route-title">${escapeHtml(route.title)}</h2>
      <p class="route-card__itinerary">${escapeHtml(itinerary)}</p>
      <div class="route-card__footer">
        <div class="tag-list" aria-label="体验标签">${route.tags.slice(0, 2).map((tag) => `<span class="route-tag">${escapeHtml(tag)}</span>`).join("")}</div>
        <button class="route-card__preview" type="button" data-preview-route="${route.id}" aria-haspopup="dialog" aria-controls="itinerary-dialog" aria-label="预览${escapeHtml(route.title)}行程">行程预览<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m8 5 5 5-5 5"/></svg></button>
      </div>
    </div>
    <button class="favorite-button${isSaved ? " is-saved" : ""}" type="button" data-save="${route.id}" aria-label="${isSaved ? "取消收藏" : "收藏"}${escapeHtml(route.title)}" aria-pressed="${isSaved}">${heartIcon()}</button>
  </article>`;
}

function searchableText(route) {
  return [route.city, route.place, route.region, route.title, route.intro, ...route.tags, ...route.map.points.map((point) => point.name)].join(" ").toLocaleLowerCase("zh-CN");
}

function filteredRoutes() {
  const query = searchInput.value.trim().toLocaleLowerCase("zh-CN");
  return ROUTES.filter((route) => {
    if (activeView === "saved" && !savedRoutes.has(route.id)) return false;
    if (activeFilter.type === "city" && route.city !== activeFilter.value) return false;
    if (activeFilter.type === "tag" && !route.tags.includes(activeFilter.value)) return false;
    if (query && !searchableText(route).includes(query)) return false;
    return true;
  });
}

function updateSavedCounts() {
  const count = savedRoutes.size;
  const mobileCount = document.querySelector("#mobile-saved-count");
  mobileCount.textContent = String(count);
  mobileCount.hidden = count === 0;
  document.querySelector("#mobile-saved").setAttribute("aria-label", activeView === "saved" ? "返回全部路线" : `查看收藏路线，${count} 条`);
}

function updateNavigation() {
  document.querySelectorAll("[data-nav]").forEach((item) => {
    const isActive = item.dataset.nav === activeView;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
    if (isActive) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });
}

function updateFilterButtons() {
  document.querySelectorAll(".filter-chip").forEach((button) => {
    if (button.dataset.filter === "tag") {
      button.hidden = !ROUTES.some((route) => route.tags.includes(button.dataset.value));
    }
    const matches = activeFilter.type === button.dataset.filter && activeFilter.value === button.dataset.value;
    button.classList.toggle("is-active", matches);
    button.setAttribute("aria-pressed", String(matches));
  });
  document.querySelectorAll("[data-city]").forEach((button) => {
    const selected = activeFilter.value === button.dataset.city;
    button.setAttribute("aria-pressed", String(selected));
    button.classList.toggle("is-selected", selected);
  });
  const pickedCity = activeFilter.type === "city" && !featuredCities.includes(activeFilter.value);
  cityPicker.classList.toggle("is-active", pickedCity);
  document.querySelector("#city-picker-label").textContent = pickedCity ? activeFilter.value : "所有城市";
  cityPicker.setAttribute("aria-label", activeFilter.type === "city" ? `已选择${activeFilter.value}，选择其他城市` : "选择城市");
}

function populateCityFilters() {
  const bar = document.querySelector("#filter-bar");
  const fragment = document.createDocumentFragment();
  for (const city of featuredCities) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-chip";
    button.dataset.filter = "city";
    button.dataset.value = city;
    button.setAttribute("aria-pressed", "false");
    button.textContent = city;
    fragment.append(button);
  }
  bar.append(fragment);
  document.querySelector("#city-grid").innerHTML = [{ city: "all", label: "全部城市", count: ROUTES.length }, ...cities.map((city) => ({ city, label: city, count: ROUTES.filter((route) => route.city === city).length }))].map(({ city, label, count }) =>
    `<button class="city-option" type="button" data-city="${escapeHtml(city)}" aria-pressed="false"><strong>${escapeHtml(label)}</strong><span>${count}条路线</span></button>`
  ).join("");
}

function openDiscoveryDialog(dialog) {
  setSettingsOpen(false);
  feedTimelinePreview.suspend();
  dialog.showModal();
  if (dialog === cityDialog) cityPicker.setAttribute("aria-expanded", "true");
  document.body.classList.add("has-discovery-dialog");
}

function showItineraryPreview(id) {
  const route = ROUTES.find((item) => item.id === id);
  if (!route) return;
  const stops = routeTimelineStops(route, JOURNEYS[id]);
  document.querySelector("#itinerary-dialog-city").textContent = `${route.city} · ${route.days}日 · ${stops.length}站`;
  document.querySelector("#itinerary-dialog-title").textContent = route.title;
  document.querySelector("#itinerary-preview").innerHTML = stops.map((stop) =>
    `<li style="--stop-color:${escapeHtml(stop.color || route.accent)}"><span class="itinerary-preview__dot" aria-hidden="true"></span><time>${escapeHtml(stop.time)}</time><strong>${escapeHtml(stop.name)}</strong></li>`
  ).join("");
  document.querySelector("#itinerary-dialog-open").href = `#/route/${route.id}`;
  openDiscoveryDialog(itineraryDialog);
}

function resetDiscoveryFilters() {
  activeFilter = { type: "all", value: "all" };
  searchInput.value = "";
  renderFeed();
}

function renderFeed() {
  const matches = filteredRoutes();
  const title = document.querySelector("#feed-title");
  if (activeView === "saved") title.textContent = "收藏的路线";
  else if (searchInput.value.trim()) title.textContent = "搜索结果";
  else if (activeFilter.type === "city") title.textContent = `${activeFilter.value}的路线`;
  else title.textContent = "发现一条好路线";

  feedCount.textContent = `${matches.length} 条路线`;
  feedTimelinePreview.reset();
  routeFeed.innerHTML = matches.map(routeCard).join("");
  observeCardImages();
  routeFeed.hidden = matches.length === 0;
  emptyState.hidden = matches.length !== 0;
  const savedEmpty = activeView === "saved" && savedRoutes.size === 0;
  document.querySelector("#empty-title").textContent = savedEmpty ? "把想去的路线留在这里" : "没有找到匹配的路线";
  document.querySelector("#empty-description").textContent = savedEmpty ? "点击路线卡片上的爱心，下次就能在这里找到。" : "试试其他城市或景点，也可以清除筛选重新浏览。";
  document.querySelector("#clear-selection").hidden = activeFilter.type === "all" && !searchInput.value.trim();
  document.querySelector("#reset-filters").textContent = activeView === "saved" ? "回到路线探索" : "查看全部路线";
  searchClear.hidden = searchInput.value.length === 0;
  routeFeed.setAttribute("aria-busy", "false");
  updateSavedCounts();
  updateNavigation();
  updateFilterButtons();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function toggleSaved(routeId) {
  const route = ROUTES.find((item) => item.id === routeId);
  if (!route) return;
  const willSave = !savedRoutes.has(routeId);
  if (willSave) savedRoutes.add(routeId);
  else savedRoutes.delete(routeId);
  try { localStorage.setItem(SAVED_KEY, JSON.stringify([...savedRoutes])); } catch { /* storage can be unavailable in private browsing */ }
  showToast(willSave ? `已收藏「${route.title}」` : `已取消收藏「${route.title}」`);
  const storyMatch = location.hash.match(/^#\/route\/([^/]+)$/);
  if (storyMatch) renderStory(ROUTES.find((item) => item.id === storyMatch[1]));
  else renderFeed();
}

function observeCardImages() {
  cardImageObserver?.disconnect();
  const images = routeFeed.querySelectorAll("[data-card-src]");
  const activate = (image) => {
    if (image.dataset.cardSrcset) image.srcset = image.dataset.cardSrcset;
    image.src = image.dataset.cardSrc;
    delete image.dataset.cardSrc;
    delete image.dataset.cardSrcset;
  };
  if (!("IntersectionObserver" in window)) { images.forEach(activate); return; }
  cardImageObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      activate(target);
      cardImageObserver.unobserve(target);
    });
  }, { rootMargin: "400px 0px" });
  images.forEach((image) => cardImageObserver.observe(image));
}

function loadJourney(id) {
  if (!journeyRequests.has(id)) {
    const pending = ROUTE_LOADERS[id]().then((module) => module.default).catch((error) => {
      journeyRequests.delete(id);
      throw error;
    });
    journeyRequests.set(id, pending);
  }
  return journeyRequests.get(id);
}

async function renderStory(route) {
  const request = ++storyRequest;
  activeRouteStoryController?.unmount();
  activeRouteStoryController = null;
  if (!route) {
    storyView.innerHTML = `<div class="story-missing"><h1>这条路线暂时不在这里</h1><a href="#/explore">返回路线探索</a></div>`;
    return;
  }
  storyView.className = "story-view route-story-view route-story-view--illustrated";
  storyView.innerHTML = `<div class="route-story-root"><div class="route-map-stage"><img class="route-story-loading-image" src="${escapeHtml(route.cardArtwork.image)}" alt="${escapeHtml(route.place)}插画地图" decoding="async" fetchpriority="high"/></div><header class="route-story-nav"><a class="route-story-nav__back" href="#/explore">← 返回首页</a></header><p class="route-map-status" role="status">正在加载这条路线…</p></div>`;
  try {
    const [runtime, detail] = await Promise.all([import("./route-story.js"), loadJourney(route.id)]);
    if (request !== storyRequest) return;
    activeRouteStoryController = runtime.createRouteStoryController(storyView);
    void activeRouteStoryController.mount(detail.route, ROUTES, detail.journey);
  } catch {
    if (request !== storyRequest) return;
    storyView.querySelector(".route-map-status").textContent = "路线资料暂时无法加载，请刷新重试或返回首页。";
  }
}

function setSettingsOpen(open, sourceButton) {
  settingsPopover.hidden = !open;
  document.querySelectorAll("#settings-toggle, #mobile-settings-toggle").forEach((button) => button.setAttribute("aria-expanded", String(open)));
  if (open && sourceButton) sourceButton.setAttribute("aria-expanded", "true");
}

function syncMotionPreference() {
  let stored = null;
  try { stored = localStorage.getItem(MOTION_KEY); } catch { /* storage can be unavailable */ }
  const reduce = stored === null ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : stored === "true";
  reduceMotionToggle.checked = reduce;
  document.body.classList.toggle("reduce-motion", reduce);
}

function renderApp({ restoreFeed = false } = {}) {
  setSettingsOpen(false);
  [cityDialog, itineraryDialog].forEach((dialog) => { if (dialog.open) dialog.close(); });
  const routeMatch = location.hash.match(/^#\/route\/([^/]+)$/);
  if (routeMatch) {
    feedTimelinePreview.suspend();
    const requestedId = decodeURIComponent(routeMatch[1]);
    const routeId = requestedId === "kyoto-autumn-walk" ? "suzhou-garden-walk" : requestedId;
    if (routeId !== requestedId) history.replaceState(null, "", `#/route/${routeId}`);
    activeView = "story";
    exploreView.hidden = true;
    storyView.hidden = false;
    document.body.classList.add("is-story");
    renderStory(ROUTES.find((route) => route.id === routeId));
    updateNavigation();
    return;
  }

  activeRouteStoryController?.unmount();
  activeRouteStoryController = null;
  storyRequest += 1;
  const previousView = activeView;
  const hash = location.hash.replace(/^#\/?/, "");
  activeView = hash === "saved" ? "saved" : hash === "destinations" ? "destinations" : "explore";
  if (activeView === "saved" && previousView !== "saved" && previousView !== "story") {
    activeFilter = { type: "all", value: "all" };
    searchInput.value = "";
  }
  if (activeView === "destinations" && previousView !== "destinations") {
    activeFilter = { type: "all", value: "all" };
    searchInput.value = "";
  }
  if (activeView === "explore" && previousView === "story") {
    // Returning from a route restores the discovery context and feed position.
  }
  storyView.hidden = true;
  exploreView.hidden = false;
  document.body.classList.remove("is-story");
  renderFeed();
  if (restoreFeed || previousView === "story") requestAnimationFrame(() => window.scrollTo({ top: feedScrollY, behavior: "auto" }));
}

document.querySelector("#search-form").addEventListener("submit", (event) => { event.preventDefault(); searchInput.blur(); });
searchInput.addEventListener("input", renderFeed);
searchClear.addEventListener("click", () => { searchInput.value = ""; searchInput.focus(); renderFeed(); });

document.querySelector("#filter-bar").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = { type: button.dataset.filter, value: button.dataset.value };
  renderFeed();
  window.scrollTo({ top: 0, behavior: "auto" });
});

cityPicker.addEventListener("click", () => openDiscoveryDialog(cityDialog));
document.querySelector("#city-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-city]");
  if (!button) return;
  activeFilter = button.dataset.city === "all" ? { type: "all", value: "all" } : { type: "city", value: button.dataset.city };
  cityDialog.close();
  renderFeed();
  window.scrollTo({ top: 0, behavior: "auto" });
});
[cityDialog, itineraryDialog].forEach((dialog) => {
  dialog.addEventListener("close", () => {
    if (dialog === cityDialog) cityPicker.setAttribute("aria-expanded", "false");
    if (!cityDialog.open && !itineraryDialog.open) document.body.classList.remove("has-discovery-dialog");
    if (!document.body.classList.contains("is-story")) feedTimelinePreview.resume();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest("#settings-popover, #mobile-settings-toggle")) setSettingsOpen(false);
  const skipLink = event.target.closest(".skip-link");
  if (skipLink) { event.preventDefault(); document.querySelector("#main-content").focus(); return; }
  const closeDialog = event.target.closest("[data-close-dialog]");
  if (closeDialog) { document.getElementById(closeDialog.dataset.closeDialog).close(); return; }
  const previewButton = event.target.closest("[data-preview-route]");
  if (previewButton) { event.preventDefault(); showItineraryPreview(previewButton.dataset.previewRoute); return; }
  if (event.target.closest("#clear-selection")) { resetDiscoveryFilters(); return; }
  if (event.target.closest("#itinerary-dialog-open")) { feedScrollY = window.scrollY; itineraryDialog.close(); }
  const saveButton = event.target.closest("[data-save]");
  if (saveButton) {
    event.preventDefault();
    event.stopPropagation();
    toggleSaved(saveButton.dataset.save);
    return;
  }

  const routeLink = event.target.closest(".route-card__link");
  if (routeLink) feedScrollY = window.scrollY;

  const settingButton = event.target.closest("#settings-toggle, #mobile-settings-toggle");
  if (settingButton) {
    const open = settingsPopover.hidden;
    setSettingsOpen(open, settingButton);
    return;
  }

  if (event.target.closest("#mobile-saved")) {
    location.hash = activeView === "saved" ? "#/explore" : "#/saved";
    return;
  }

  if (event.target.closest("#reset-filters")) {
    activeFilter = { type: "all", value: "all" };
    searchInput.value = "";
    if (activeView === "saved") location.hash = "#/explore";
    else renderFeed();
    return;
  }

  if (!event.target.closest("#settings-popover")) setSettingsOpen(false);
});

reduceMotionToggle.addEventListener("change", () => {
  document.body.classList.toggle("reduce-motion", reduceMotionToggle.checked);
  try { localStorage.setItem(MOTION_KEY, String(reduceMotionToggle.checked)); } catch { /* storage can be unavailable */ }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !settingsPopover.hidden) {
    setSettingsOpen(false);
    document.querySelector("#mobile-settings-toggle").focus();
  }
});
window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", syncMotionPreference);

window.addEventListener("hashchange", () => renderApp({ restoreFeed: true }));

populateCityFilters();
syncMotionPreference();
renderApp();
