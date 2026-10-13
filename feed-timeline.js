import { loadPhotoDeckRuntime } from "./photo-deck-loader.js";

export function routeTimelineStops(route, journey = {}) {
  return route.story.map((stop, index) => ({
    id: `${route.id}-${index}`,
    time: journey.stopTimes?.[index] || stop.time || "",
    name: route.map.points[index]?.name || stop.title.split(" · ")[0],
    color: route.map.points[index]?.color || route.accent
  }));
}

/** Owns hover/focus previews without adding another click target to a card. */
export class FeedTimelinePreview {
  constructor(feed, routes, journeys) {
    this.feed = feed;
    this.routes = new Map(routes.map((route) => [route.id, route]));
    this.journeys = journeys;
    this.records = new Map();
    this.enabled = true;
    this.hovered = null;
    this.focused = null;
    this.current = null;
    this.dismissed = null;
    this.desktop = window.matchMedia("(min-width: 761px)");
    this.pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    this.motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    feed.addEventListener("pointerover", (event) => {
      if (event.pointerType !== "mouse" || !this.pointer.matches) return;
      const card = event.target.closest("[data-route-card]");
      if (!card || card.contains(event.relatedTarget)) return;
      this.hovered = card;
      this.reconcile();
    });
    feed.addEventListener("pointerout", (event) => {
      const card = event.target.closest("[data-route-card]");
      if (!card || card.contains(event.relatedTarget)) return;
      if (this.hovered === card) this.hovered = null;
      if (this.dismissed === card && this.focused !== card) this.dismissed = null;
      this.reconcile();
    });
    feed.addEventListener("focusin", (event) => {
      const link = event.target.closest(".route-card__link");
      if (!link || !link.matches(":focus-visible")) return;
      this.focused = link.closest("[data-route-card]");
      this.reconcile();
    });
    feed.addEventListener("focusout", (event) => {
      if (!event.target.matches(".route-card__link")) return;
      const previous = this.focused;
      this.focused = null;
      if (this.dismissed === previous && this.hovered !== previous) this.dismissed = null;
      this.reconcile();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !this.current) return;
      this.dismissed = this.current;
      this.reconcile();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.hovered = this.focused = null;
      this.reconcile();
    });
    this.desktop.addEventListener("change", () => this.reconcile());
    this.pointer.addEventListener("change", () => {
      if (!this.pointer.matches) this.hovered = null;
      this.reconcile();
    });
    this.motion.addEventListener("change", () => this.reconcile());
    this.motionObserver = new MutationObserver(() => this.reconcile());
    this.motionObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }

  reset() {
    this.suspend();
    this.records.forEach((record) => {
      record.disposed = true;
      cancelAnimationFrame(record.frame || 0);
      record.runtime?.destroy();
    });
    this.records.clear();
    this.enabled = true;
  }

  suspend() {
    this.enabled = false;
    this.hovered = this.focused = this.dismissed = null;
    this.reconcile();
  }

  props(record, active) {
    return {
      stops: record.stops,
      label: "沿途行程",
      active,
      reducedMotion: this.focused === record.card || this.motion.matches || document.body.classList.contains("reduce-motion")
    };
  }

  reconcile() {
    const next = this.enabled && this.desktop.matches && !document.hidden
      ? this.focused || this.hovered : null;
    const card = next !== this.dismissed && next?.isConnected ? next : null;
    if (this.current && this.current !== card) {
      const previous = this.records.get(this.current);
      this.current.classList.remove("has-timeline-preview");
      previous?.runtime?.update(this.props(previous, false));
    }
    this.current = card;
    if (!card) return;
    const record = this.records.get(card);
    if (!record) {
      void this.prepare(card);
      return;
    }
    if (!record.ready) return;
    card.dataset.timelineInstant = this.props(record, true).reducedMotion ? "true" : "false";
    card.classList.add("has-timeline-preview");
    record.runtime.update(this.props(record, true));
  }

  async prepare(card) {
    const route = this.routes.get(card.dataset.routeCard);
    const host = card.querySelector("[data-feed-timeline]");
    if (!route || !host) return;
    const record = { card, stops: routeTimelineStops(route, this.journeys[route.id]), ready: false, disposed: false, frame: 0, runtime: null };
    this.records.set(card, record);
    try {
      const runtime = await loadPhotoDeckRuntime();
      if (record.disposed || !card.isConnected) return;
      if (!runtime.mountRouteTimeline) throw new Error("TIMELINE_UNAVAILABLE");
      record.runtime = runtime.mountRouteTimeline(host, this.props(record, false));
      await record.runtime.ready;
      if (record.disposed || !card.isConnected) return;
      // Paint the inactive pose before starting the first reveal.
      record.frame = requestAnimationFrame(() => {
        record.frame = requestAnimationFrame(() => {
          record.frame = 0;
          if (record.disposed || !card.isConnected) return;
          record.ready = true;
          this.reconcile();
        });
      });
    } catch {
      if (record.disposed || !card.isConnected) return;
      // Keep the original clickable map card if the optional bundle fails.
      record.runtime?.destroy();
      this.records.delete(card);
    }
  }
}
