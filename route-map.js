import { RouteMapPreview } from "./route-map-preview.js";

const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));
const SVG_NS = "http://www.w3.org/2000/svg";
let routeMotionRuntimePromise = null;

function loadRouteMotionRuntime() {
  if (window.RouteoRemotion?.mountRoutePathMotion) return Promise.resolve(window.RouteoRemotion);
  if (!routeMotionRuntimePromise) {
    routeMotionRuntimePromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = new URL("./assets/routeo-remotion.js", import.meta.url).href;
      script.async = true;
      script.onload = () => window.RouteoRemotion?.mountRoutePathMotion
        ? resolve(window.RouteoRemotion)
        : reject(new Error("REMOTION_RUNTIME_UNAVAILABLE"));
      script.onerror = () => reject(new Error("REMOTION_RUNTIME_UNAVAILABLE"));
      document.head.append(script);
    }).catch((error) => {
      routeMotionRuntimePromise = null;
      throw error;
    });
  }
  return routeMotionRuntimePromise;
}

function curveThroughPoints(points) {
  if (points.length < 2) return "";
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const before = points[index - 1] || start;
    const after = points[index + 2] || end;
    const control1 = {
      x: start.x + (end.x - before.x) / 6,
      y: start.y + (end.y - before.y) / 6
    };
    const control2 = {
      x: end.x - (after.x - start.x) / 6,
      y: end.y - (after.y - start.y) / 6
    };
    path += ` C ${control1.x} ${control1.y} ${control2.x} ${control2.y} ${end.x} ${end.y}`;
  }
  return path;
}

function evenlySampleSvgPath(rootSvg, pathElement, sampleCount = 260) {
  try {
    const totalLength = pathElement.getTotalLength();
    const pathMatrix = pathElement.getScreenCTM();
    const rootMatrix = rootSvg.getScreenCTM();
    if (!totalLength || !pathMatrix || !rootMatrix) return [];
    const screenToRoot = rootMatrix.inverse();
    const rawCount = Math.max(120, Math.min(720, Math.ceil(totalLength / 3)));
    const raw = [];

    for (let index = 0; index <= rawCount; index += 1) {
      const localPoint = pathElement.getPointAtLength(totalLength * index / rawCount);
      const point = rootSvg.createSVGPoint();
      point.x = localPoint.x;
      point.y = localPoint.y;
      const rootPoint = point.matrixTransform(pathMatrix).matrixTransform(screenToRoot);
      raw.push({ x: rootPoint.x, y: rootPoint.y });
    }

    const cumulative = [0];
    for (let index = 1; index < raw.length; index += 1) {
      cumulative.push(cumulative[index - 1] + Math.hypot(raw[index].x - raw[index - 1].x, raw[index].y - raw[index - 1].y));
    }
    const rootLength = cumulative[cumulative.length - 1];
    if (!rootLength) return [];

    const samples = [];
    let cursor = 0;
    for (let index = 0; index <= sampleCount; index += 1) {
      const target = rootLength * index / sampleCount;
      while (cursor < cumulative.length - 2 && cumulative[cursor + 1] < target) cursor += 1;
      const span = cumulative[cursor + 1] - cumulative[cursor] || 1;
      const progress = (target - cumulative[cursor]) / span;
      samples.push({
        x: raw[cursor].x + (raw[cursor + 1].x - raw[cursor].x) * progress,
        y: raw[cursor].y + (raw[cursor + 1].y - raw[cursor].y) * progress
      });
    }
    return samples;
  } catch {
    return [];
  }
}

function getWaypointProgress(samples, waypoints) {
  if (samples.length < 2 || waypoints.length < 2) return [];

  let minimumIndex = 0;
  return waypoints.map((waypoint, waypointIndex) => {
    if (waypointIndex === 0) return 0;
    if (waypointIndex === waypoints.length - 1) return 1;

    const maximumIndex = samples.length - (waypoints.length - waypointIndex);
    let closestIndex = minimumIndex;
    let closestDistance = Number.POSITIVE_INFINITY;
    for (let index = minimumIndex; index <= maximumIndex; index += 1) {
      const sample = samples[index];
      const distance = (sample.x - waypoint.x) ** 2 + (sample.y - waypoint.y) ** 2;
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    }
    minimumIndex = closestIndex;
    return closestIndex / (samples.length - 1);
  });
}

function escapeText(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

export class RouteMap {
  constructor(host, route, points, onPointHover, onPointSelect, onJourneyStep = () => {}) {
    this.host = host;
    this.route = route;
    this.points = points;
    this.onPointHover = onPointHover;
    this.onPointSelect = onPointSelect;
    this.onJourneyStep = onJourneyStep;
    this.markerContent = [];
    this.markers = this.markerContent;
    this.revealedPoints = new Set();
    this.completedSegments = new Set();
    this.animationFrames = new Set();
    this.destroyed = false;
    this.panelOpen = false;
    this.isArtwork = Boolean(route.storyArtwork);
    this.isStoryMap = Boolean(route.map?.storyMap);
    this.frame = null;
    this.routeMotion = null;
    this.motionReady = Promise.resolve(null);
    this.userTookControl = false;
    this.layoutObserver = null;
    this.zoomLevel = 1;
    this.minZoom = 1;
    this.maxZoom = route.map?.maxZoom ?? 2.6;
    this.panX = 0;
    this.panY = 0;
    this.activePointers = new Map();
    this.dragOrigin = null;
    this.pinchDistance = 0;
    this.panHint = null;
    this.panHintTimer = null;
    this.baseSize = this.isArtwork
      ? { width: route.storyArtwork.width, height: route.storyArtwork.height }
      : { width: 1200, height: 675 };
  }

  async mount() {
    this.host.classList.add("route-map-stage__map--illustration");
    this.host.classList.add(this.isArtwork ? "route-map-stage__map--bitmap" : "route-map-stage__map--schematic");
    this.host.classList.add("route-map-stage__map--interactive");
    this.host.tabIndex = 0;
    this.host.setAttribute("aria-label", "路线插画地图，可滚轮或双指缩放、拖动平移；键盘可用加减键和方向键操作，按 Home 回到全图");
    this.host.setAttribute("aria-keyshortcuts", "Equal Shift+Equal - Home ArrowLeft ArrowRight ArrowUp ArrowDown");

    const frame = document.createElement("div");
    frame.className = this.isArtwork ? "route-map-artwork-frame" : "route-map-artwork-frame route-map-schematic-frame";
    frame.style.width = `${this.baseSize.width}px`;
    frame.style.height = `${this.baseSize.height}px`;

    if (this.isArtwork) {
      const image = document.createElement("img");
      image.className = "route-map-artwork-image";
      image.alt = "";
      image.draggable = false;
      image.src = this.route.storyArtwork.image;
      frame.append(image);
      this.artworkImage = image;
    } else {
      frame.innerHTML = RouteMapPreview(this.route, { story: true });
      this.svg = frame.querySelector("svg");
    }

    this.motionLayer = document.createElement("div");
    this.motionLayer.className = "route-map-motion-layer";
    this.motionLayer.setAttribute("aria-hidden", "true");
    frame.append(this.motionLayer);

    this.host.replaceChildren(frame);
    this.frame = frame;
    this.addPins();
    this.createMapAffordances();
    this.attachInteractions();

    if (this.isArtwork) {
      try {
        await this.artworkImage.decode();
      } catch {
        throw new Error("ROUTE_ARTWORK_UNAVAILABLE");
      }
      if (this.destroyed) return null;
    }

    this.layoutObserver = new ResizeObserver(() => this.updateLayout());
    this.layoutObserver.observe(this.host);
    this.updateLayout();
    this.motionReady = this.mountRouteMotion().catch(() => null);
    return null;
  }

  async mountRouteMotion() {
    let rootSvg = this.svg;
    let routeElement = rootSvg?.querySelector(".route-map__route");
    let temporarySource = null;

    if (this.isArtwork) {
      const artwork = this.route.storyArtwork;
      const anchors = artwork?.markers || [];
      const pathData = artwork?.route || curveThroughPoints(anchors);
      if (!pathData) return null;

      temporarySource = document.createElementNS(SVG_NS, "svg");
      temporarySource.setAttribute("viewBox", `0 0 ${this.baseSize.width} ${this.baseSize.height}`);
      temporarySource.setAttribute("width", String(this.baseSize.width));
      temporarySource.setAttribute("height", String(this.baseSize.height));
      Object.assign(temporarySource.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        opacity: "0",
        pointerEvents: "none"
      });
      routeElement = document.createElementNS(SVG_NS, "path");
      routeElement.setAttribute("d", pathData);
      temporarySource.append(routeElement);
      this.frame.insertBefore(temporarySource, this.motionLayer);
      rootSvg = temporarySource;
    }

    const samples = rootSvg && routeElement ? evenlySampleSvgPath(rootSvg, routeElement) : [];
    temporarySource?.remove();
    if (this.destroyed || samples.length < 2) return null;
    const waypointGeometry = this.getGeometryPoints().map((point) => this.getCanvasPosition(point));
    const waypointProgress = getWaypointProgress(samples, waypointGeometry);

    const runtime = await loadRouteMotionRuntime();
    if (this.destroyed) return null;
    const reducedMotion = document.body.classList.contains("reduce-motion")
      || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const durationInFrames = Math.max(1, (this.points.length - 1) * 30);

    const routeMotion = runtime.mountRoutePathMotion(this.motionLayer, {
      samples,
      waypointProgress,
      width: this.baseSize.width,
      height: this.baseSize.height,
      accent: this.route.accent,
      durationInFrames,
      reducedMotion
    });
    this.routeMotion = routeMotion;
    await routeMotion.ready;
    if (this.destroyed) return null;
    this.frame.classList.add("has-remotion-route");
    return routeMotion;
  }

  takeManualControl() {
    this.userTookControl = true;
  }

  addPins() {
    const artworkMarkers = this.route.storyArtwork?.markers || [];
    const mapMarkers = this.getGeometryPoints();
    this.markerContent = this.points.map((point, index) => {
      const geometry = artworkMarkers[index] || mapMarkers[index];
      const placement = artworkMarkers[index]?.labelPlacement || this.getLabelPlacement(mapMarkers[index]);
      const pin = document.createElement("button");
      pin.type = "button";
      pin.className = `route-map-pin route-map-pin--artwork${placement ? ` route-map-pin--${placement}` : ""}`;
      pin.disabled = true;
      pin.setAttribute("aria-label", `${point.time} ${point.name}，插画地图中的示意位置`);
      pin.style.setProperty("--point-color", point.color);
      pin.innerHTML = `<span class="route-map-pin__dot"><i></i></span><span class="route-map-pin__label"><small>${escapeText(point.time)}</small><strong>${escapeText(point.name)}</strong></span>`;
      pin.addEventListener("pointerenter", (event) => this.onPointHover(index, event));
      pin.addEventListener("pointermove", (event) => this.onPointHover(index, event));
      pin.addEventListener("pointerleave", () => this.onPointHover(-1));
      pin.addEventListener("focus", (event) => this.onPointHover(index, event));
      pin.addEventListener("blur", () => this.onPointHover(-1));
      pin.addEventListener("click", () => this.onPointSelect(index));
      pin.dataset.mapX = String(geometry?.x ?? 0);
      pin.dataset.mapY = String(geometry?.y ?? 0);
      this.host.append(pin);
      return pin;
    });
    this.markers = this.markerContent;
  }

  getLabelPlacement(point) {
    if (!point) return "below-right";
    if (point.labelSide === "left") return point.labelY === "above" ? "above-left" : "below-left";
    return point.labelY === "above" ? "above-right" : "below-right";
  }

  getGeometryPoints() {
    if (this.isArtwork) return this.route.storyArtwork?.markers || [];
    return this.route.map?.storyMap?.points || this.route.map?.points || [];
  }

  getCanvasPosition(point) {
    if (this.isArtwork) return { x: point.x, y: point.y };
    const canvas = this.isStoryMap
      ? this.route.map.storyMap.viewBox || this.baseSize
      : { width: 1200, height: 360 };
    return {
      x: point.x / canvas.width * this.baseSize.width,
      y: point.y / canvas.height * this.baseSize.height
    };
  }

  getLayout() {
    const width = Math.max(1, this.host.clientWidth);
    const height = Math.max(1, this.host.clientHeight);
    // The map remains full-bleed while the itinerary curtain overlays it.
    // A tiny overscan guards against sub-pixel seams during pan and resize.
    const scale = Math.max(width / this.baseSize.width, height / this.baseSize.height) * 1.003;
    const frameWidth = this.baseSize.width;
    const frameHeight = this.baseSize.height;
    return {
      width,
      height,
      visibleWidth: width,
      frameWidth,
      frameHeight,
      baseScale: scale,
      left: (width - frameWidth * scale) / 2,
      top: (height - frameHeight * scale) / 2
    };
  }

  applyLayout(layout, { animate = false, duration = 760 } = {}) {
    if (!this.frame) return;
    this.zoomLevel = Math.min(this.zoomLevel, this.maxZoom);
    const scale = layout.baseScale * this.zoomLevel;
    this.constrainPan(layout, scale);
    this.frame.style.transition = animate
      ? `transform ${duration}ms cubic-bezier(.2,.75,.23,1)`
      : "none";
    this.frame.style.width = `${layout.frameWidth}px`;
    this.frame.style.height = `${layout.frameHeight}px`;
    this.frame.style.transform = `translate3d(${layout.left + this.panX}px, ${layout.top + this.panY}px, 0) scale(${scale})`;
    this.updateMapAffordances();

    if (this.svg) {
      this.svg.style.width = "100%";
      this.svg.style.height = "100%";
    }

    this.markerContent.forEach((pin) => {
      const rawX = Number(pin.dataset.mapX);
      const rawY = Number(pin.dataset.mapY);
      const canvasPosition = this.getCanvasPosition({ x: rawX, y: rawY });
      const position = {
        x: canvasPosition.x / this.baseSize.width * layout.frameWidth,
        y: canvasPosition.y / this.baseSize.height * layout.frameHeight
      };
      pin.style.transitionProperty = animate ? "opacity, transform, left, top" : "";
      pin.style.transitionDuration = animate ? `${duration}ms` : "";
      pin.style.transitionTimingFunction = animate ? "ease, var(--story-ease), var(--story-ease), var(--story-ease)" : "";
      pin.style.left = `${layout.left + this.panX + position.x * scale}px`;
      pin.style.top = `${layout.top + this.panY + position.y * scale}px`;
    });
  }

  createMapAffordances() {
    const hint = document.createElement("span");
    hint.className = "route-map-pan-hint";
    hint.setAttribute("aria-hidden", "true");
    hint.textContent = window.matchMedia("(pointer: coarse)").matches
      ? "双指缩放 · 拖动查看"
      : "滚轮缩放 · 拖动查看";
    this.panHint = hint;
    const fitButton = document.createElement("button");
    fitButton.type = "button";
    fitButton.className = "route-map-fit-button";
    fitButton.setAttribute("aria-label", "回到全图视野");
    fitButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4H4v4M16 4h4v4M4 16v4h4m12-4v4h-4M4.8 4.8l5 5m9.4-5-5 5m-9.4 9.4 5-5m9.4 5-5-5"/></svg><span>看全程</span>';
    fitButton.hidden = true;
    fitButton.addEventListener("click", () => {
      this.takeManualControl();
      this.hidePanHint();
      this.resetView();
    });
    this.fitButton = fitButton;
    this.host.append(hint, fitButton);
    this.panHintTimer = window.setTimeout(() => this.hidePanHint(), 5200);
  }

  hidePanHint() {
    if (this.panHintTimer) window.clearTimeout(this.panHintTimer);
    this.panHintTimer = null;
    this.panHint?.classList.add("is-hidden");
  }

  attachInteractions() {
    this.handleWheel = (event) => {
      event.preventDefault();
      this.takeManualControl();
      this.hidePanHint();
      const rect = this.host.getBoundingClientRect();
      this.zoomAround(this.zoomLevel * Math.exp(-event.deltaY * 0.001), event.clientX - rect.left, event.clientY - rect.top);
    };
    this.handlePointerDown = (event) => this.onPointerDown(event);
    this.handlePointerMove = (event) => this.onPointerMove(event);
    this.handlePointerUp = (event) => this.onPointerUp(event);
    this.handleKeyDown = (event) => this.onMapKeyDown(event);
    this.host.addEventListener("wheel", this.handleWheel, { passive: false });
    this.host.addEventListener("pointerdown", this.handlePointerDown);
    this.host.addEventListener("pointermove", this.handlePointerMove);
    this.host.addEventListener("pointerup", this.handlePointerUp);
    this.host.addEventListener("pointercancel", this.handlePointerUp);
    this.host.addEventListener("lostpointercapture", this.handlePointerUp);
    this.host.addEventListener("keydown", this.handleKeyDown);
  }

  onPointerDown(event) {
    if (event.target.closest?.(".route-map-pin, .route-map-fit-button")) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    this.takeManualControl();
    this.hidePanHint();
    this.activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    try { this.host.setPointerCapture(event.pointerId); } catch {}
    if (this.activePointers.size === 1) {
      this.dragOrigin = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        panX: this.panX,
        panY: this.panY
      };
      return;
    }
    if (this.activePointers.size === 2) {
      const [first, second] = [...this.activePointers.values()];
      this.pinchDistance = Math.max(1, Math.hypot(second.x - first.x, second.y - first.y));
      this.dragOrigin = null;
    }
  }

  onPointerMove(event) {
    if (!this.activePointers.has(event.pointerId)) return;
    this.activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (this.activePointers.size >= 2) {
      const [first, second] = [...this.activePointers.values()];
      const distance = Math.max(1, Math.hypot(second.x - first.x, second.y - first.y));
      const rect = this.host.getBoundingClientRect();
      const centerX = (first.x + second.x) / 2 - rect.left;
      const centerY = (first.y + second.y) / 2 - rect.top;
      if (this.pinchDistance > 0) this.zoomAround(this.zoomLevel * distance / this.pinchDistance, centerX, centerY);
      this.pinchDistance = distance;
      this.host.classList.add("is-panning");
      return;
    }

    if (!this.dragOrigin || this.dragOrigin.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - this.dragOrigin.x;
    const deltaY = event.clientY - this.dragOrigin.y;
    if (Math.hypot(deltaX, deltaY) > 3) this.host.classList.add("is-panning");
    this.panX = this.dragOrigin.panX + deltaX;
    this.panY = this.dragOrigin.panY + deltaY;
    this.updateLayout();
  }

  onPointerUp(event) {
    this.activePointers.delete(event.pointerId);
    if (this.activePointers.size === 1) {
      const [pointerId, point] = [...this.activePointers.entries()][0];
      this.dragOrigin = { pointerId, x: point.x, y: point.y, panX: this.panX, panY: this.panY };
      this.pinchDistance = 0;
      return;
    }
    if (this.activePointers.size === 0) {
      this.dragOrigin = null;
      this.pinchDistance = 0;
      this.host.classList.remove("is-panning");
    }
  }

  onMapKeyDown(event) {
    if (event.key === "+" || event.key === "=" || event.key === "-" || event.key === "_" || event.key === "Home" || event.key.startsWith("Arrow")) {
      this.takeManualControl();
    }
    if (event.key === "+" || event.key === "=") this.zoomBy(1.25);
    else if (event.key === "-" || event.key === "_") this.zoomBy(0.8);
    else if (event.key === "Home") this.resetView();
    else if (event.key.startsWith("Arrow")) {
      const amount = event.shiftKey ? 90 : 42;
      if (event.key === "ArrowLeft") this.panX += amount;
      if (event.key === "ArrowRight") this.panX -= amount;
      if (event.key === "ArrowUp") this.panY += amount;
      if (event.key === "ArrowDown") this.panY -= amount;
      this.updateLayout();
    } else return;
    event.preventDefault();
  }

  constrainPan(layout, scale) {
    const renderedWidth = layout.frameWidth * scale;
    const renderedHeight = layout.frameHeight * scale;
    const originX = layout.left + this.panX;
    const originY = layout.top + this.panY;
    const nextX = renderedWidth <= layout.visibleWidth
      ? (layout.visibleWidth - renderedWidth) / 2
      : Math.max(layout.visibleWidth - renderedWidth, Math.min(0, originX));
    const nextY = renderedHeight <= layout.height
      ? (layout.height - renderedHeight) / 2
      : Math.max(layout.height - renderedHeight, Math.min(0, originY));
    this.panX = nextX - layout.left;
    this.panY = nextY - layout.top;
  }

  zoomAround(nextZoom, x, y) {
    const layout = this.getLayout();
    const zoom = Math.max(this.minZoom, Math.min(this.maxZoom, nextZoom));
    if (Math.abs(zoom - this.zoomLevel) < 0.001) return;
    const previousScale = layout.baseScale * this.zoomLevel;
    const nextScale = layout.baseScale * zoom;
    const mapX = (x - layout.left - this.panX) / previousScale;
    const mapY = (y - layout.top - this.panY) / previousScale;
    this.zoomLevel = zoom;
    this.panX = x - layout.left - mapX * nextScale;
    this.panY = y - layout.top - mapY * nextScale;
    this.updateLayout();
  }

  zoomBy(factor) {
    const layout = this.getLayout();
    this.zoomAround(this.zoomLevel * factor, layout.visibleWidth / 2, layout.height / 2);
  }

  resetView() {
    this.zoomLevel = 1;
    this.panX = 0;
    this.panY = 0;
    this.updateLayout({ animate: true, duration: 420 });
  }

  updateMapAffordances() {
    if (!this.fitButton) return;
    const atOverview = this.zoomLevel <= this.minZoom + 0.01
      && Math.abs(this.panX) < 3
      && Math.abs(this.panY) < 3;
    this.fitButton.hidden = atOverview;
  }

  updateLayout({ animate = false, duration = 760 } = {}) {
    if (this.destroyed) return;
    this.applyLayout(this.getLayout(), { animate, duration });
  }

  setPanelOpen(open, { animate = true } = {}) {
    if (this.destroyed) return;
    this.panelOpen = Boolean(open);
    this.updateLayout({ animate, duration: 780 });
  }

  zoomToRoute({ duration = 2600 } = {}) {
    if (this.userTookControl) return Promise.resolve();
    this.updateLayout({ animate: duration > 0, duration });
    return duration > 0 ? wait(duration + 60) : Promise.resolve();
  }

  fitRoute({ duration = 900 } = {}) {
    if (this.userTookControl) return Promise.resolve();
    this.updateLayout({ animate: duration > 0, duration });
    return duration > 0 ? wait(duration + 60) : Promise.resolve();
  }

  revealPoint(index, { duration = 760, connect = true } = {}) {
    if (this.destroyed) return Promise.resolve();
    const pin = this.markerContent[index];
    if (pin && !this.revealedPoints.has(index)) {
      this.revealedPoints.add(index);
      pin.disabled = false;
      requestAnimationFrame(() => pin.classList.add("is-visible"));
    }
    if (connect && index > 0 && !this.completedSegments.has(index - 1)) {
      return this.drawSegment(index - 1, duration);
    }
    return Promise.resolve();
  }

  drawSegment(index, duration = 760, onProgress = () => {}) {
    if (this.destroyed || index < 0 || index >= this.points.length - 1) return Promise.resolve();
    this.setActiveSegment(index);
    const geometryPoints = this.getGeometryPoints();
    const start = geometryPoints[index];
    const end = geometryPoints[index + 1];
    return new Promise((resolve) => {
      const started = performance.now();
      let frameId = 0;
      const step = (now) => {
        this.animationFrames.delete(frameId);
        if (this.destroyed) return resolve();
        const progress = duration <= 0 ? 1 : Math.min(1, (now - started) / duration);
        if (start && end) {
          onProgress(progress, [
            start.x + (end.x - start.x) * progress,
            start.y + (end.y - start.y) * progress
          ]);
        }
        if (progress >= 1) {
          this.completedSegments.add(index);
          return resolve();
        }
        frameId = requestAnimationFrame(step);
        this.animationFrames.add(frameId);
      };
      frameId = requestAnimationFrame(step);
      this.animationFrames.add(frameId);
    });
  }

  setActiveSegment(index) {
    if (this.destroyed) return;
    const validIndex = index >= 0 && index < this.points.length - 1 ? index : -1;
    this.markerContent.forEach((pin, itemIndex) => {
      pin.classList.toggle("is-segment-active", validIndex >= 0 && (itemIndex === validIndex || itemIndex === validIndex + 1));
    });
  }

  setFocusedPoint(index) {
    this.markerContent.forEach((pin, itemIndex) => pin.classList.toggle("is-focused", itemIndex === index));
  }

  focusPoint(index, { animate = true } = {}) {
    if (this.destroyed || !this.points[index]) return;
    this.setFocusedPoint(index);
    this.setActiveSegment(index > 0 ? index - 1 : -1);
    const marker = this.getGeometryPoints()[index];
    if (!marker) return;
    const position = this.getCanvasPosition(marker);
    const layout = this.getLayout();
    this.zoomLevel = Math.min(this.maxZoom, Math.max(this.zoomLevel, Math.min(1.45, this.maxZoom)));
    const targetX = this.panelOpen && window.innerWidth > 760 ? layout.width * 0.4 : layout.width * 0.5;
    void this.moveCameraTo(position, { duration: animate ? 640 : 0, targetX, targetY: layout.height * 0.5 });
  }

  moveCameraTo(position, { duration = 0, targetX, targetY } = {}) {
    if (this.destroyed) return Promise.resolve();
    if (!position) return duration > 0 ? wait(duration + 60) : Promise.resolve();
    const layout = this.getLayout();
    const scale = layout.baseScale * this.zoomLevel;
    this.panX = (targetX ?? layout.width / 2) - layout.left - position.x * scale;
    this.panY = (targetY ?? layout.height / 2) - layout.top - position.y * scale;
    this.updateLayout({ animate: duration > 0, duration });
    return duration > 0 ? wait(duration + 60) : Promise.resolve();
  }

  followJourneyPosition() {}

  setJourneyProgress(progress) {
    if (this.destroyed || !this.points.length) return null;
    const numericProgress = Number(progress);
    const bounded = Number.isFinite(numericProgress) ? Math.max(0, Math.min(1, numericProgress)) : 0;
    const positionOnRoute = bounded * (this.points.length - 1);
    const segmentIndex = Math.min(this.points.length - 2, Math.floor(positionOnRoute));
    const segmentProgress = bounded >= 1 ? 1 : positionOnRoute - segmentIndex;
    const lastVisiblePoint = Math.min(this.points.length - 1, Math.ceil(positionOnRoute));
    const activeStopIndex = bounded >= 1 ? this.points.length - 1 : Math.min(this.points.length - 1, Math.floor(positionOnRoute));

    this.markerContent.forEach((pin, index) => {
      const visible = index <= lastVisiblePoint;
      pin.disabled = !visible;
      pin.classList.toggle("is-visible", visible);
      if (visible) this.revealedPoints.add(index);
      else {
        this.revealedPoints.delete(index);
        pin.classList.remove("is-focused");
      }
    });

    this.setFocusedPoint(activeStopIndex);
    this.setActiveSegment(segmentIndex);
    const geometryPoints = this.getGeometryPoints();
    const mapPosition = geometryPoints[segmentIndex] || { x: 0, y: 0 };
    const nextPosition = geometryPoints[Math.min(this.points.length - 1, segmentIndex + 1)] || mapPosition;
    return {
      progress: bounded,
      activeStopIndex,
      segmentIndex,
      segmentProgress,
      position: [
        mapPosition.x + (nextPosition.x - mapPosition.x) * segmentProgress,
        mapPosition.y + (nextPosition.y - mapPosition.y) * segmentProgress
      ]
    };
  }

  async playJourney({ durationPerStop = 1100 } = {}) {
    if (!this.points.length || this.destroyed) return;
    if (!this.revealedPoints.has(0)) await this.revealPoint(0, { duration: 0, connect: false });
    if (this.destroyed) return;
    this.onJourneyStep(0);
    this.setFocusedPoint(0);
    if (!this.userTookControl) {
      await this.moveCameraTo(null, { duration: durationPerStop >= 800 ? 260 : durationPerStop * 0.35 });
    }
    if (this.destroyed) return;

    await this.motionReady;
    if (this.destroyed) return;
    this.frame?.classList.add("is-route-motion-visible");
    this.host.classList.add("is-route-motion-visible");
    this.routeMotion?.seekTo(durationPerStop <= 0 ? this.routeMotion.durationInFrames - 1 : 0);

    for (let index = 0; index < this.points.length - 1; index += 1) {
      if (this.destroyed) return;
      if (!this.revealedPoints.has(index + 1)) await this.revealPoint(index + 1, { duration: 0, connect: false });
      await wait(durationPerStop * 0.22);
      if (this.destroyed) return;
      await this.drawSegment(index, durationPerStop * 0.78, (progress) => {
        if (!this.routeMotion) return;
        const routeProgress = (index + 0.22 + progress * 0.78) / (this.points.length - 1);
        const routeFrame = routeProgress * (this.routeMotion.durationInFrames - 1);
        this.routeMotion?.seekTo(Math.round(routeFrame));
      });
      if (this.destroyed) return;
      this.onJourneyStep(index + 1);
      this.setFocusedPoint(index + 1);
    }
    await wait(durationPerStop * 0.32);
    this.setActiveSegment(-1);
  }

  destroy() {
    this.destroyed = true;
    this.routeMotion?.destroy();
    this.routeMotion = null;
    this.motionLayer = null;
    if (this.panHintTimer) window.clearTimeout(this.panHintTimer);
    this.layoutObserver?.disconnect();
    this.layoutObserver = null;
    this.host.removeEventListener("wheel", this.handleWheel);
    this.host.removeEventListener("pointerdown", this.handlePointerDown);
    this.host.removeEventListener("pointermove", this.handlePointerMove);
    this.host.removeEventListener("pointerup", this.handlePointerUp);
    this.host.removeEventListener("pointercancel", this.handlePointerUp);
    this.host.removeEventListener("lostpointercapture", this.handlePointerUp);
    this.host.removeEventListener("keydown", this.handleKeyDown);
    this.animationFrames.forEach((frame) => cancelAnimationFrame(frame));
    this.animationFrames.clear();
    this.host.replaceChildren();
  }
}
