import { createRouteStoryController } from "./route-story.js";
import { RouteMapPreview } from "./route-map-preview.js";
import { ROUTES } from "./routes-data.js";

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

const SAVED_KEY = "routeo:saved-routes:v1";
const MOTION_KEY = "routeo:reduce-motion:v1";
const savedRoutes = readSavedRoutes();
let activeFilter = { type: "all", value: "all" };
let activeView = "explore";
let activeRouteStoryController = null;
let feedScrollY = 0;
let toastTimer = 0;

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

function flagMark(code) {
  const flags = {
    cn: '<svg class="flag-mark" viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" fill="#d9484b"/><path d="m5 2 .8 2.1 2.3.1-1.8 1.4.6 2.2L5 6.6 3.1 7.8l.6-2.2L2 4.2l2.3-.1L5 2Zm5 3.8.3.7.8.1-.6.5.2.8-.7-.4-.7.4.2-.8-.6-.5.8-.1.3-.7Zm2.1 2.2.3.7.8.1-.6.5.2.8-.7-.4-.7.4.2-.8-.6-.5.8-.1.3-.7Zm0 3 .3.7.8.1-.6.5.2.8-.7-.4-.7.4.2-.8-.6-.5.8-.1.3-.7Zm-2.1 2.2.3.7.8.1-.6.5.2.8-.7-.4-.7.4.2-.8-.6-.5.8-.1.3-.7Z" fill="#ffd35c"/></svg>',
    jp: '<svg class="flag-mark" viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" fill="#fff"/><circle cx="12" cy="8" r="4.1" fill="#bc3c47"/></svg>',
    au: '<svg class="flag-mark" viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" fill="#1e3a72"/><path d="M1 1h9v6H1z" fill="#fff"/><path d="M1 1 10 7M10 1 1 7" stroke="#bf3945" stroke-width="1.4"/><path d="M1 1 10 7M10 1 1 7" stroke="#fff" stroke-width=".55"/><path d="m17 2 .7 1.5 1.6.2-1.2 1.1.3 1.6L17 5.6l-1.4.8.3-1.6-1.2-1.1 1.6-.2L17 2Zm3.1 7 .5 1.1 1.2.1-.9.8.2 1.2-1-.6-1 .6.2-1.2-.9-.8 1.2-.1.5-1.1Zm-6.7 2.4.5 1.1 1.2.1-.9.8.2 1.2-1-.6-1 .6.2-1.2-.9-.8 1.2-.1.5-1.1Z" fill="#fff"/></svg>',
    sg: '<svg class="flag-mark" viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="8" fill="#d9484b"/><rect y="8" width="24" height="8" fill="#fff"/><circle cx="7.1" cy="4.1" r="2.3" fill="#fff"/><circle cx="7.8" cy="3.6" r="1.8" fill="#d9484b"/><path d="m11 2 .45 1 1.1.1-.8.7.2 1.1-1-.55-1 .55.2-1.1-.8-.7 1.1-.1.55-1Z" fill="#fff"/></svg>',
    fr: '<svg class="flag-mark" viewBox="0 0 24 16" aria-hidden="true"><rect width="8" height="16" fill="#435f9c"/><rect x="8" width="8" height="16" fill="#fff"/><rect x="16" width="8" height="16" fill="#d7534b"/></svg>'
  };
  return flags[code] || flags.jp;
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

function snapshotStrip(route) {
  return `<div class="route-card__snapshots" aria-hidden="true">${route.snapshots.map((scene, index) => `<div class="route-snapshot route-snapshot--${scene}" style="--snapshot-image:url('${escapeHtml(route.image)}');--snapshot-position:${index === 0 ? "22%" : "78%"}"></div>`).join("")}</div>`;
}

function routeCard(route) {
  const isSaved = savedRoutes.has(route.id);
  return `<article class="route-card route-card--${route.theme}" data-route-card="${route.id}">
    <div class="route-card__map" aria-hidden="true">${RouteMapPreview(route)}</div>
    <div class="route-card__scrim" aria-hidden="true"></div>
    <a class="route-card__link" href="#/route/${route.id}" aria-label="打开路线故事：${escapeHtml(route.place)}，${escapeHtml(route.title)}，${route.days}日行程">
      <span class="sr-only">查看${escapeHtml(route.title)}路线故事</span>
    </a>
    <div class="route-card__meta">
      <span class="place-badge">${flagMark(route.flag)}<span>${escapeHtml(route.place)}</span></span>
      <h2 class="route-title">${escapeHtml(route.title)}</h2>
      <p class="trip-length">${clockIcon()}<span>${route.days}日行程</span></p>
      <div class="tag-list" aria-label="体验标签">${route.tags.map((tag) => `<span class="route-tag">${escapeHtml(tag)}</span>`).join("")}</div>
    </div>
    ${snapshotStrip(route)}
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
  const sideCount = document.querySelector("#saved-count");
  const mobileCount = document.querySelector("#mobile-saved-count");
  sideCount.textContent = String(count);
  sideCount.classList.toggle("is-visible", count > 0);
  mobileCount.textContent = String(count);
  document.querySelector("#mobile-saved").setAttribute("aria-label", `查看收藏路线，${count} 条`);
}

function updateNavigation() {
  document.querySelectorAll("[data-nav]").forEach((item) => {
    const isActive = item.dataset.nav === activeView;
    item.classList.toggle("is-active", isActive);
    if (isActive) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });
}

function updateFilterButtons() {
  document.querySelectorAll(".filter-chip").forEach((button) => {
    const matches = activeFilter.type === button.dataset.filter && activeFilter.value === button.dataset.value;
    button.classList.toggle("is-active", matches);
    button.setAttribute("aria-pressed", String(matches));
  });
}

function renderFeed() {
  const matches = filteredRoutes();
  const title = document.querySelector("#feed-title");
  if (activeView === "saved") title.textContent = "收藏的旅行路线";
  else if (activeView === "destinations") title.textContent = "按目的地探索旅行路线";
  else title.textContent = "旅行路线探索";

  feedCount.textContent = `${String(matches.length).padStart(2, "0")} 条路线`;
  routeFeed.innerHTML = matches.map(routeCard).join("");
  routeFeed.hidden = matches.length === 0;
  emptyState.hidden = matches.length !== 0;
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

function renderStory(route) {
  activeRouteStoryController?.unmount();
  activeRouteStoryController = null;
  if (!route) {
    storyView.innerHTML = `<div class="story-missing"><h1>这条路线暂时不在这里</h1><a href="#/explore">返回路线探索</a></div>`;
    return;
  }
  activeRouteStoryController = createRouteStoryController(storyView);
  void activeRouteStoryController.mount(route, ROUTES);
}

function setSettingsOpen(open, sourceButton) {
  settingsPopover.hidden = !open;
  document.querySelectorAll("#settings-toggle, #mobile-settings-toggle").forEach((button) => button.setAttribute("aria-expanded", String(open)));
  if (open && sourceButton) sourceButton.setAttribute("aria-expanded", "true");
}

function syncMotionPreference() {
  let stored = false;
  try { stored = localStorage.getItem(MOTION_KEY) === "true"; } catch { /* storage can be unavailable */ }
  reduceMotionToggle.checked = stored;
  document.body.classList.toggle("reduce-motion", stored);
}

function renderApp({ restoreFeed = false } = {}) {
  const routeMatch = location.hash.match(/^#\/route\/([^/]+)$/);
  if (routeMatch) {
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
  const previousView = activeView;
  const hash = location.hash.replace(/^#\/?/, "");
  activeView = hash === "saved" ? "saved" : hash === "destinations" ? "destinations" : "explore";
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

document.querySelector("#search-form").addEventListener("submit", (event) => event.preventDefault());
searchInput.addEventListener("input", renderFeed);
searchClear.addEventListener("click", () => { searchInput.value = ""; searchInput.focus(); renderFeed(); });

document.querySelector("#filter-bar").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = { type: button.dataset.filter, value: button.dataset.value };
  renderFeed();
});

document.addEventListener("click", (event) => {
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
    location.hash = "#/saved";
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
  if (event.key === "Escape" && !settingsPopover.hidden) setSettingsOpen(false);
});

window.addEventListener("hashchange", () => renderApp({ restoreFeed: true }));

syncMotionPreference();
renderApp();
