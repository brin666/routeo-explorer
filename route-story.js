import { RouteMap } from "./route-map.js";
import { HoverImagePreview, RouteCurtain, RouteOpening } from "./route-components.js";
import { JOURNEYS } from "./routes-data.js";

const INTRO_SPEED = 1.2;

export class RouteStoryController {
  constructor(host) {
    this.host = host;
    this.state = { phase: "idle", panelOpen: false, overviewAvailable: false, activeStop: -1, progress: 0 };
    this.timers = new Set();
    this.destroyed = false;
  }

  async mount(route, allRoutes) {
    this.destroyed = false;
    this.currentRoute = route;
    this.host.replaceChildren();
    const story = JOURNEYS[route.id];
    if (!story) {
      this.host.innerHTML = `<div class="story-missing"><h1>这条路线暂时还没有地图数据</h1><a href="#/explore">返回路线探索</a></div>`;
      return;
    }

    this.host.className = "story-view route-story-view";
    this.host.classList.toggle("route-story-view--illustrated", Boolean(route.storyArtwork));
    this.host.setAttribute("aria-label", "路线地图与行程故事");
    this.root = document.createElement("div");
    this.root.className = "route-story-root";
    this.root.dataset.phase = "map-loading";
    const mapAriaLabel = route.place + "路线插画地图";
    this.root.innerHTML = `
      <div class="route-map-stage" role="region" aria-label="${mapAriaLabel}"><div class="route-map-stage__map"></div></div>
      <header class="route-story-nav"><a class="route-story-nav__brand" href="#/explore" aria-label="Routeo，返回首页"><svg viewBox="0 0 42 34" aria-hidden="true"><path d="M3 27.5 14.2 8.8c.6-1 2.1-1 2.7 0l5.2 8.5 3.8-6.2c.7-1.1 2.2-1.1 2.9 0l10.2 16.4H3Z" fill="currentColor"/><path d="m9.3 27.5 8.2-13.4 8.2 13.4H9.3Z" fill="#27322d" opacity=".94"/><circle cx="32.1" cy="8.8" r="2.1" fill="currentColor"/></svg><span>Routeo</span></a><a class="route-story-nav__back" href="#/explore" aria-label="返回首页"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7 7-7-7 7-7"/></svg><span>返回首页</span></a></header>
      <p class="route-map-status" role="status" aria-live="polite" hidden></p>`;
    this.host.append(this.root);

    this.points = route.story.map((item, index) => ({
      index,
      name: route.map.points[index]?.name || item.title.split(" · ")[0],
      time: story.stopTimes?.[index] || item.time,
      body: item.body,
      color: route.storyArtwork?.markers[index]?.color || route.map.points[index]?.color || route.accent,
      labelPlacement: route.storyArtwork?.markers[index]?.labelPlacement || story.labelPlacements?.[index],
      tags: story.stopTags[index] || route.tags.slice(0, 3),
      previewImage: story.previewImages?.[index] || route.image,
      previewPosition: story.previewPositions?.[index] || "50%"
    }));
    this.opening = new RouteOpening(route, story);
    this.root.append(this.opening.element);
    this.preview = new HoverImagePreview(this.root, route.image);
    this.curtain = new RouteCurtain(route, story, this.points, allRoutes, {
      onPreview: (index, event) => this.onPreview(index, event),
      onPreviewEnd: () => this.onPreview(-1),
      onSelect: (index) => this.selectStop(index),
      onTogglePanel: (open, options) => this.togglePanel(open, options)
    });
    this.root.append(this.curtain.root);
    this.map = new RouteMap(
      this.root.querySelector(".route-map-stage__map"),
      route,
      this.points,
      (index, event) => this.onPreview(index, event),
      (index) => this.selectStop(index),
      (index) => this.onJourneyStep(index)
    );

    try {
      await this.map.mount();
      if (this.destroyed) return;
      this.runOpeningSequence();
    } catch (error) {
      if (this.destroyed) return;
      this.root.dataset.phase = "map-error";
      const status = this.root.querySelector(".route-map-status");
      status.hidden = false;
      status.textContent = error.message === "ROUTE_ARTWORK_UNAVAILABLE"
        ? "路线插画暂时无法加载，请刷新页面重试。"
        : "路线插画暂时无法显示，请刷新页面重试。";
      this.opening.reveal();
    }
  }

  delay(milliseconds) {
    if (this.destroyed) return Promise.resolve(false);
    return new Promise((resolve) => {
      const timer = window.setTimeout(() => {
        this.timers.delete(timer);
        resolve(!this.destroyed);
      }, milliseconds);
      this.timers.add(timer);
    });
  }

  async runOpeningSequence() {
    const reduced = this.reduceMotionEnabled();
    this.setPhase("camera-zoom");
    await this.map.zoomToRoute({ duration: reduced ? 0 : 620 });
    if (this.destroyed) return;
    for (let index = 0; index < this.points.length; index += 1) {
      await this.map.revealPoint(index, { duration: 0, connect: false });
    }

    this.setPhase("opening");
    if (!await this.delay(reduced ? 10 : 120)) return;
    this.opening.reveal();
    const revealSteps = [["place", 260], ["title", 320], ["details", 320], ["summary", 420]];
    for (const [part, pause] of revealSteps) {
      if (this.destroyed) return;
      this.opening.revealPart(part);
      if (!await this.delay(reduced ? 55 : pause / INTRO_SPEED)) return;
    }
    if (!await this.delay(reduced ? 150 : 3200)) return;
    this.opening.dismiss();
    if (!await this.delay(reduced ? 50 : 900)) return;

    this.setPhase("curtain-reveal");
    this.togglePanel(true, { animate: !reduced });
    this.state.overviewAvailable = true;
    this.curtain.setLauncherAvailable(true);
    if (!await this.delay(reduced ? 40 : 620)) return;
    for (let index = 0; index < this.points.length; index += 1) {
      if (this.destroyed) return;
      this.state.activeStop = index;
      this.state.progress = index / Math.max(1, this.points.length - 1);
      this.curtain.revealStop(index);
      await this.map.revealPoint(index, { duration: 0, connect: false });
      if (!await this.delay(reduced ? 60 : 240)) return;
    }

    if (!await this.delay(reduced ? 50 : 900)) return;
    this.togglePanel(false, { animate: !reduced });
    this.setPhase("map-only");
    if (!await this.delay(reduced ? 40 : 780)) return;
    await this.map.playJourney({ durationPerStop: reduced ? 0 : 980 });
    if (this.destroyed) return;
    await this.map.fitRoute({ duration: reduced ? 0 : 900 });
    if (this.destroyed) return;
    this.state.progress = 1;
    this.setPhase("journey-complete");
  }

  setPhase(phase) {
    this.state.phase = phase;
    if (this.root) this.root.dataset.phase = phase;
  }

  togglePanel(open = !this.state.panelOpen, { animate = true, focusPanel = false, returnFocus = false } = {}) {
    this.state.panelOpen = Boolean(open);
    this.curtain?.setOpen(this.state.panelOpen, { animate });
    this.map?.setPanelOpen(this.state.panelOpen, { animate });
    this.root?.classList.toggle("is-map-only", !this.state.panelOpen);
    if (focusPanel) this.curtain?.focusCloseButton();
    if (returnFocus) this.curtain?.focusLauncher();
  }

  onPreview(index, event) {
    if (index < 0 || !this.points[index]) {
      this.preview?.hide();
      const selectedStop = this.state.activeStop;
      this.curtain?.setActiveStop(selectedStop);
      this.map?.setFocusedPoint(selectedStop);
      this.map?.setActiveSegment(selectedStop > 0 ? selectedStop - 1 : -1);
      return;
    }
    const stop = this.points[index];
    this.preview?.show(stop, stop.previewImage, event);
    this.curtain?.setActiveStop(index);
    this.map?.setFocusedPoint(index);
    this.map?.setActiveSegment(index === 0 ? -1 : index - 1);
  }

  selectStop(index) {
    if (!this.points[index]) return;
    this.map?.takeManualControl();
    this.curtain?.setActiveTab("route");
    if (!this.state.panelOpen) this.togglePanel(true);
    this.state.activeStop = index;
    this.map?.revealPoint(index, { duration: 0 });
    this.map?.focusPoint(index, { animate: !this.reduceMotionEnabled() });
    this.curtain?.revealStop(index);
    this.curtain?.scrollStopIntoView(index);
    this.setPhase("stop-focused");
  }

  onJourneyStep(index) {
    this.state.activeStop = index;
    this.state.progress = index / Math.max(1, this.points.length - 1);
    this.curtain?.setActiveStop(index);
    this.map?.setFocusedPoint(index);
    this.setPhase("journey");
  }

  reduceMotionEnabled() {
    return document.body.classList.contains("reduce-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  setNarrativeProgress(progress) {
    if (!this.points?.length) return null;
    const numericProgress = Number(progress);
    const bounded = Number.isFinite(numericProgress) ? Math.max(0, Math.min(1, numericProgress)) : 0;
    const frame = this.map?.setJourneyProgress(bounded);
    const index = frame?.activeStopIndex ?? Math.min(this.points.length - 1, Math.floor(bounded * this.points.length));
    this.state.progress = bounded;
    this.state.activeStop = index;
    this.curtain?.setActiveStop(index);
    this.map?.setFocusedPoint(index);
    this.setPhase("journey");
    return { progress: bounded, activeStopIndex: index, stop: this.points[index] || null };
  }

  unmount() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers.clear();
    this.preview?.destroy();
    this.map?.destroy();
    this.opening?.destroy();
    this.curtain?.destroy();
    this.host.replaceChildren();
  }
}

export function createRouteStoryController(host) {
  return new RouteStoryController(host);
}
