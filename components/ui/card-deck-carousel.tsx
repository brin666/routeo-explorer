import * as React from "react";

export type Slide = {
  image?: string;
  title?: string;
  caption?: string;
  alt?: string;
};

export type CardDeckCarouselProps = {
  slides: Slide[];
  collectionKey: string;
  initialIndex?: number;
  active: boolean;
  autoplay?: number;
  pauseAutoplay?: boolean;
  scatter?: number;
  reducedMotion?: boolean;
  emptyMessage?: string;
  ariaLabel?: string;
  onChange?: (index: number) => void;
  onOpen?: (index: number) => void;
};

export type CardDeckHandle = {
  select(index: number): void;
  next(): void;
  previous(): void;
  cancel(): void;
  getIndex(): number;
};

type Motion = {
  index: number;
  x: number;
  y: number;
  rotation: number;
  mode: "drag" | "fly" | "snap";
};

type Drag = {
  pointerId: number;
  x: number;
  y: number;
  lastX: number;
  lastY: number;
  lastTime: number;
  velocityX: number;
  velocityY: number;
  moved: boolean;
};

const wrap = (index: number, length: number) =>
  length ? ((index % length) + length) % length : 0;

const deckPose = (depth: number, tilt: number, reducedMotion: boolean) => {
  const visibleDepth = Math.min(depth, 3);
  return {
    y: visibleDepth ? -visibleDepth * 15 : 0,
    scale: 1 - visibleDepth * 0.055,
    rotation: depth === 0 || reducedMotion ? 0 : tilt,
    opacity: depth > 3 ? 0 : 1,
    brightness: 1 - visibleDepth * 0.065,
  };
};

const tiltFor = (index: number, max: number) => {
  const value = (((index + 1) * 2654435761) >>> 0) / 4294967296;
  return (value * 2 - 1) * max;
};

const normalizeIndex = (index: number, length: number) =>
  length ? wrap(Number.isFinite(index) ? Math.trunc(index) : 0, length) : 0;

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    if (query.addEventListener) query.addEventListener("change", update);
    else query.addListener?.(update);
    return () => {
      if (query.removeEventListener) query.removeEventListener("change", update);
      else query.removeListener?.(update);
    };
  }, []);

  return reduced;
}

export const CardDeckCarousel = React.forwardRef<
  CardDeckHandle,
  CardDeckCarouselProps
>(function CardDeckCarousel(
  {
    slides,
    collectionKey,
    initialIndex = 0,
    active,
    autoplay = 0,
    pauseAutoplay = false,
    scatter = 7,
    reducedMotion: reducedMotionSetting = false,
    emptyMessage = "当前相册暂无照片",
    ariaLabel = "旅行照片",
    onChange,
    onOpen,
  },
  forwardedRef,
) {
  const count = slides.length;
  const [index, setIndex] = React.useState(() =>
    normalizeIndex(initialIndex, count),
  );
  const [motion, setMotion] = React.useState<Motion | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [documentVisible, setDocumentVisible] = React.useState(
    () => typeof document === "undefined" || !document.hidden,
  );
  const [intersecting, setIntersecting] = React.useState(true);
  const [autoRequested, setAutoRequested] = React.useState(autoplay > 0);
  const [scheduleRevision, setScheduleRevision] = React.useState(0);
  const [failedImages, setFailedImages] = React.useState<Record<number, string>>(
    {},
  );

  const rootRef = React.useRef<HTMLDivElement>(null);
  const deckRef = React.useRef<HTMLDivElement>(null);
  const indexRef = React.useRef(index);
  const countRef = React.useRef(count);
  const motionRef = React.useRef<Motion | null>(null);
  const busyRef = React.useRef(busy);
  const draggingRef = React.useRef(false);
  const dragRef = React.useRef<Drag | null>(null);
  const suppressClickRef = React.useRef(false);
  const collectionKeyRef = React.useRef(collectionKey);
  const timeoutsRef = React.useRef(new Set<number>());
  const animationFramesRef = React.useRef(new Set<number>());
  const onChangeRef = React.useRef(onChange);
  const onOpenRef = React.useRef(onOpen);
  const reportedCollectionKeyRef = React.useRef(collectionKey);
  const reducedMotion = useReducedMotion() || reducedMotionSetting;

  indexRef.current = index;
  countRef.current = count;
  motionRef.current = motion;
  busyRef.current = busy;
  onChangeRef.current = onChange;
  onOpenRef.current = onOpen;

  const updateMotion = React.useCallback((next: Motion | null) => {
    motionRef.current = next;
    setMotion(next);
  }, []);

  const updateBusy = React.useCallback((next: boolean) => {
    busyRef.current = next;
    setBusy(next);
  }, []);

  const updateDragging = React.useCallback((next: boolean) => {
    draggingRef.current = next;
    setDragging(next);
  }, []);

  const schedule = React.useCallback((callback: () => void, delay: number) => {
    const timeout = window.setTimeout(() => {
      timeoutsRef.current.delete(timeout);
      callback();
    }, delay);
    timeoutsRef.current.add(timeout);
    return timeout;
  }, []);

  const clearTimeoutById = React.useCallback((timeout: number) => {
    window.clearTimeout(timeout);
    timeoutsRef.current.delete(timeout);
  }, []);

  const clearAllScheduled = React.useCallback(() => {
    for (const timeout of timeoutsRef.current) window.clearTimeout(timeout);
    timeoutsRef.current.clear();
    for (const frame of animationFramesRef.current) {
      window.cancelAnimationFrame(frame);
    }
    animationFramesRef.current.clear();
  }, []);

  const requestFrame = React.useCallback((callback: () => void) => {
    const frame = window.requestAnimationFrame(() => {
      animationFramesRef.current.delete(frame);
      callback();
    });
    animationFramesRef.current.add(frame);
    return frame;
  }, []);

  const setIndexSafely = React.useCallback((next: number) => {
    const safeIndex = normalizeIndex(next, countRef.current);
    indexRef.current = safeIndex;
    setIndex(safeIndex);
  }, []);

  const cancelDrag = React.useCallback(() => {
    dragRef.current = null;
    updateDragging(false);
    if (!busyRef.current) updateMotion(null);
  }, [updateDragging, updateMotion]);

  const cancel = React.useCallback(() => {
    clearAllScheduled();
    dragRef.current = null;
    suppressClickRef.current = false;
    updateDragging(false);
    updateBusy(false);
    updateMotion(null);
    setScheduleRevision((revision) => revision + 1);
  }, [clearAllScheduled, updateBusy, updateDragging, updateMotion]);

  const finishThrow = React.useCallback(
    (startX = 0, startY = 0, directionX = 1, directionY = 0) => {
      const length = countRef.current;
      if (!active || busyRef.current || draggingRef.current || length < 2) return;

      updateBusy(true);
      const current = indexRef.current;
      const width = deckRef.current?.clientWidth || 320;
      const height = deckRef.current?.clientHeight || width * 1.25;
      const magnitude = Math.hypot(directionX, directionY) || 1;
      const unitX = directionX / magnitude;
      const unitY = directionY / magnitude;
      const distance = Math.max(width, height) * 1.45;
      const rotation = Math.abs(unitX) >= Math.abs(unitY)
        ? Math.sign(unitX || 1) * 17
        : Math.sign(unitY || 1) * 13;

      updateMotion({
        index: current,
        x: startX + unitX * distance,
        y: startY + unitY * distance,
        rotation,
        mode: "fly",
      });

      schedule(() => {
        updateMotion(null);
        setIndexSafely(current + 1);
        updateBusy(false);
      }, reducedMotion ? 180 : 440);
    }, [active, reducedMotion, schedule, setIndexSafely, updateBusy, updateMotion],
  );

  const next = React.useCallback(() => {
    finishThrow();
  }, [finishThrow]);

  const previous = React.useCallback(() => {
    const length = countRef.current;
    if (!active || busyRef.current || draggingRef.current || length < 2) return;

    updateBusy(true);
    const target = wrap(indexRef.current - 1, length);
    const width = deckRef.current?.clientWidth || 320;
    const height = deckRef.current?.clientHeight || width * 1.25;
    updateMotion({
      index: target,
      x: -width * 1.35,
      y: -height * 0.06,
      rotation: -16,
      mode: "snap",
    });

    requestFrame(() => {
      requestFrame(() => {
        updateMotion({
          index: target,
          x: 0,
          y: 0,
          rotation: 0,
          mode: "fly",
        });
        schedule(() => {
          updateMotion(null);
          setIndexSafely(target);
          updateBusy(false);
        }, reducedMotion ? 180 : 460);
      });
    });
  }, [
    active,
    reducedMotion,
    requestFrame,
    schedule,
    setIndexSafely,
    updateBusy,
    updateMotion,
  ]);

  const select = React.useCallback(
    (requestedIndex: number) => {
      clearAllScheduled();
      dragRef.current = null;
      suppressClickRef.current = false;
      updateDragging(false);
      updateMotion(null);
      updateBusy(false);
      setIndexSafely(requestedIndex);
      setScheduleRevision((revision) => revision + 1);
    }, [
      clearAllScheduled,
      setIndexSafely,
      updateBusy,
      updateDragging,
      updateMotion,
    ],
  );

  React.useImperativeHandle(
    forwardedRef,
    () => ({ select, next, previous, cancel, getIndex: () => indexRef.current }),
    [cancel, next, previous, select],
  );

  React.useEffect(() => {
    const resetIndex = normalizeIndex(initialIndex, count);
    if (reportedCollectionKeyRef.current !== collectionKey) {
      reportedCollectionKeyRef.current = collectionKey;
      if (index !== resetIndex) return;
    }
    if (count > 0) onChangeRef.current?.(index);
  }, [index, collectionKey, initialIndex, count]);

  React.useEffect(() => {
    if (collectionKeyRef.current === collectionKey) return;
    collectionKeyRef.current = collectionKey;
    clearAllScheduled();
    dragRef.current = null;
    suppressClickRef.current = false;
    updateDragging(false);
    updateBusy(false);
    updateMotion(null);
    setFailedImages({});
    setIndexSafely(initialIndex);
  }, [
    collectionKey,
    initialIndex,
    clearAllScheduled,
    setIndexSafely,
    updateBusy,
    updateDragging,
    updateMotion,
  ]);

  React.useEffect(() => {
    if (!count) {
      setIndexSafely(0);
      return;
    }
    if (indexRef.current >= count) setIndexSafely(count - 1);
  }, [count, setIndexSafely]);

  React.useEffect(() => {
    setAutoRequested(autoplay > 0);
  }, [autoplay]);

  React.useEffect(() => {
    const updateVisibility = () => setDocumentVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(Boolean(entry?.isIntersecting));
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (active) return;
    cancel();
  }, [active, cancel]);

  React.useEffect(
    () => () => {
      clearAllScheduled();
      dragRef.current = null;
    },
    [clearAllScheduled],
  );

  const autoplayEnabled =
    autoRequested &&
    autoplay > 0 &&
    !pauseAutoplay &&
    count > 1 &&
    active &&
    !reducedMotion &&
    documentVisible &&
    intersecting &&
    !hovered &&
    !focused &&
    !dragging &&
    !busy;

  React.useEffect(() => {
    if (!autoplayEnabled) return;
    const timeout = schedule(() => finishThrow(), autoplay);
    return () => clearTimeoutById(timeout);
  }, [autoplayEnabled, autoplay, index, collectionKey, scheduleRevision, schedule, clearTimeoutById, finishThrow]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      busyRef.current ||
      !active ||
      !event.isPrimary ||
      (event.pointerType === "mouse" && event.button !== 0)
    ) return;

    const target = event.currentTarget;
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: event.timeStamp,
      velocityX: 0,
      velocityY: 0,
      moved: false,
    };
    suppressClickRef.current = false;
    updateDragging(true);
    try {
      target.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture can fail if the browser has already canceled the pointer.
      cancelDrag();
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const elapsed = Math.max(1, event.timeStamp - drag.lastTime);
    const stepX = event.clientX - drag.lastX;
    const stepY = event.clientY - drag.lastY;
    drag.velocityX = 0.78 * (stepX / elapsed) + 0.22 * drag.velocityX;
    drag.velocityY = 0.78 * (stepY / elapsed) + 0.22 * drag.velocityY;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    drag.lastTime = event.timeStamp;

    const deltaX = event.clientX - drag.x;
    const deltaY = event.clientY - drag.y;
    if (Math.hypot(deltaX, deltaY) > 6) drag.moved = true;
    updateMotion({
      index: indexRef.current,
      x: deltaX,
      y: deltaY,
      rotation: reducedMotion ? 0 : Math.max(-20, Math.min(20, deltaX * 0.045)),
      mode: "drag",
    });
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    updateDragging(false);

    const deltaX = event.clientX - drag.x;
    const deltaY = event.clientY - drag.y;
    if (drag.moved) {
      suppressClickRef.current = true;
      requestFrame(() => {
        suppressClickRef.current = false;
      });
    }

    const width = deckRef.current?.clientWidth || 320;
    const height = deckRef.current?.clientHeight || width * 1.25;
    const distance = Math.hypot(deltaX, deltaY);
    const speed = Math.hypot(drag.velocityX, drag.velocityY);
    const thrown =
      distance > Math.min(width, height) * 0.24 ||
      (speed > 0.55 && distance > 24);

    if (thrown && countRef.current > 1) {
      finishThrow(deltaX, deltaY, deltaX || drag.velocityX, deltaY || drag.velocityY);
    } else {
      updateMotion(null);
    }
  };

  const onPointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) cancelDrag();
  };

  const onLostPointerCapture = (event: React.PointerEvent<HTMLDivElement>) => {
    // A normal pointerup clears dragRef first. A lost capture without pointerup
    // is a cancellation (often the browser handing a vertical gesture to scroll).
    if (dragRef.current?.pointerId === event.pointerId) cancelDrag();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      previous();
    }
  };

  const currentSlide = slides[index];
  const countLabel = count ? `${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}` : "";
  const announcement = count
    ? `第 ${index + 1} 张，共 ${count} 张${currentSlide?.title ? `：${currentSlide.title}` : ""}`
    : emptyMessage;

  const onCardClick = (cardIndex: number) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    const source = slides[cardIndex]?.image?.trim() || "";
    const imageAvailable = source && failedImages[cardIndex] !== source;
    if (cardIndex === index && imageAvailable) onOpenRef.current?.(cardIndex);
  };

  return (
    <div
      ref={rootRef}
      className="cd-root"
      data-empty={count === 0 ? "true" : "false"}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocused(false);
        }
      }}
    >
      <div ref={deckRef} className="cd-deck">
        {count === 0 ? (
          <div className="cd-card__empty" role="status">{emptyMessage}</div>
        ) : slides.map((slide, cardIndex) => {
          const depth = wrap(cardIndex - index, count);
          const pose = deckPose(depth, tiltFor(cardIndex, scatter), reducedMotion);
          const override = motion?.index === cardIndex ? motion : null;
          if (depth > 3 && !override) return null;
          const isTop = depth === 0;
          const transform = override
            ? `translate(${override.x}px, ${override.y}px) rotate(${override.rotation}deg)`
            : `translateY(${pose.y}px) scale(${pose.scale}) rotate(${pose.rotation.toFixed(2)}deg)`;
          const imageSrc = slide.image?.trim() || "";
          const imageFailed = Boolean(imageSrc && failedImages[cardIndex] === imageSrc);
          const buttonLabel = imageFailed
            ? `${slide.title || `第 ${cardIndex + 1} 张照片`}：照片加载失败`
            : imageSrc
              ? slide.title
                ? `打开照片：${slide.title}`
                : `打开第 ${cardIndex + 1} 张照片`
              : `${slide.title || `第 ${cardIndex + 1} 张照片`}：暂无照片`;

          return (
            <div
              key={`${collectionKey}:${cardIndex}`}
              className="cd-card"
              data-top={isTop ? "1" : "0"}
              data-drag={override?.mode === "drag" ? "1" : "0"}
              data-fly={override?.mode === "fly" ? "1" : "0"}
              data-snap={override?.mode === "snap" ? "1" : "0"}
              style={{
                transform,
                zIndex: override ? count + 1 : count - depth,
                opacity: override ? 1 : pose.opacity,
                filter: override || isTop ? "none" : `brightness(${pose.brightness})`,
              }}
              aria-hidden={isTop ? undefined : true}
              onPointerDown={isTop ? onPointerDown : undefined}
              onPointerMove={isTop ? onPointerMove : undefined}
              onPointerUp={isTop ? onPointerUp : undefined}
              onPointerCancel={isTop ? onPointerCancel : undefined}
              onLostPointerCapture={isTop ? onLostPointerCapture : undefined}
              onClick={() => onCardClick(cardIndex)}
            >
              <button
                type="button"
                className="cd-open"
                tabIndex={isTop ? 0 : -1}
                aria-label={buttonLabel}
              >
                {imageSrc && !imageFailed ? (
                  <img
                    src={imageSrc}
                    alt={isTop ? slide.alt || slide.title || "旅行照片" : ""}
                    draggable={false}
                    onError={() => {
                      setFailedImages((current) => ({
                        ...current,
                        [cardIndex]: imageSrc,
                      }));
                    }}
                  />
                ) : (
                  <span className="cd-card__empty" role="img" aria-label={imageFailed ? "照片加载失败" : "暂无照片"}>
                    {imageFailed ? "照片暂时无法加载" : "暂无可显示的照片"}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="cd-meta">
        <button
          type="button"
          className="cd-btn"
          aria-label="上一张照片"
          onClick={previous}
          disabled={count < 2 || busy}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>

        <div className="cd-meta__copy" aria-hidden="true">
          {currentSlide?.title ? <span>{currentSlide.title}</span> : null}
          {currentSlide?.caption ? <span>{currentSlide.caption}</span> : null}
        </div>

        {count > 0 ? <span className="cd-count" aria-hidden="true">{countLabel}</span> : null}

        {autoplay > 0 ? (
          <button
            type="button"
            className="cd-autoplay"
            aria-pressed={autoRequested}
            aria-label={autoRequested ? "暂停自动播放" : "开始自动播放"}
            onClick={() => setAutoRequested((playing) => !playing)}
            disabled={count < 2}
          >
            {autoRequested ? "暂停自动播放" : "开始自动播放"}
          </button>
        ) : null}

        <button
          type="button"
          className="cd-btn"
          aria-label="下一张照片"
          onClick={next}
          disabled={count < 2 || busy}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      <p className="cd-help">{count > 1 ? "拖动相片翻页 · 点击照片放大" : "点击照片放大查看"}</p>
      <div className="cd-sr" aria-live={autoplayEnabled ? "off" : "polite"} aria-atomic="true">
        {announcement}
      </div>
    </div>
  );
});

CardDeckCarousel.displayName = "CardDeckCarousel";

export default CardDeckCarousel;

