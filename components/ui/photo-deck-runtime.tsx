import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
export { mountRouteTimeline } from "./timeline-runtime";
import CardDeckCarousel, {
  type CardDeckCarouselProps,
  type CardDeckHandle,
} from "./card-deck-carousel";

export type PhotoDeckRuntime = {
  /** Resolves when the component handle has mounted, or if destroyed first. */
  ready: Promise<void>;
  update(props: CardDeckCarouselProps): void;
  setActive(active: boolean): void;
  select(index: number): void;
  next(): void;
  previous(): void;
  destroy(): void;
};

export function mountPhotoDeck(
  host: HTMLElement,
  initialProps: CardDeckCarouselProps,
): PhotoDeckRuntime {
  let props = initialProps;
  let destroyed = false;
  let readySettled = false;
  let root: Root;
  let handle: CardDeckHandle | null = null;
  let resolveReady!: () => void;
  const pendingOperations: Array<(mounted: CardDeckHandle) => void> = [];

  const ready = new Promise<void>((resolve) => {
    resolveReady = resolve;
  });

  const captureHandle = (mounted: CardDeckHandle | null) => {
    handle = mounted;
    if (!mounted || destroyed) return;
    if (!readySettled) {
      readySettled = true;
      resolveReady();
    }
    while (pendingOperations.length) {
      pendingOperations.shift()?.(mounted);
    }
  };

  const render = () => {
    if (destroyed) return;
    root.render(<CardDeckCarousel ref={captureHandle} {...props} />);
  };

  root = createRoot(host);
  render();

  const invoke = (operation: (mounted: CardDeckHandle) => void) => {
    if (destroyed) return;
    if (handle) operation(handle);
    else pendingOperations.push(operation);
  };

  return {
    ready,
    update(nextProps) {
      if (destroyed) return;
      if (nextProps.collectionKey !== props.collectionKey) pendingOperations.length = 0;
      props = nextProps;
      render();
    },
    setActive(active) {
      if (destroyed) return;
      props = { ...props, active };
      render();
    },
    select(index) {
      invoke((mounted) => mounted.select(index));
    },
    next() {
      invoke((mounted) => mounted.next());
    },
    previous() {
      invoke((mounted) => mounted.previous());
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      pendingOperations.length = 0;
      handle = null;
      root.unmount();
      if (!readySettled) {
        readySettled = true;
        resolveReady();
      }
    },
  };
}

export default mountPhotoDeck;

