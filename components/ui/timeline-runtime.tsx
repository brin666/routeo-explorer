import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import Timeline, { type TimelineProps } from "./timeline";

export type RouteTimelineRuntime = {
  ready: Promise<void>;
  update(nextProps: TimelineProps): void;
  destroy(): void;
};

type TimelineMountProps = {
  props: TimelineProps;
  onReady(): void;
};

function TimelineMount({ props, onReady }: TimelineMountProps) {
  React.useLayoutEffect(() => {
    onReady();
  }, [onReady]);

  return <Timeline {...props} />;
}

export function mountRouteTimeline(
  host: HTMLElement,
  initialProps: TimelineProps,
): RouteTimelineRuntime {
  let props = initialProps;
  let destroyed = false;
  let readySettled = false;
  let root: Root;
  let resolveReady!: () => void;

  const ready = new Promise<void>((resolve) => {
    resolveReady = resolve;
  });

  const settleReady = () => {
    if (readySettled) return;
    readySettled = true;
    resolveReady();
  };

  const render = () => {
    if (destroyed) return;
    root.render(<TimelineMount props={props} onReady={settleReady} />);
  };

  root = createRoot(host);
  render();

  return {
    ready,
    update(nextProps) {
      if (destroyed) return;
      props = nextProps;
      render();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      root.unmount();
      settleReady();
    },
  };
}

export default mountRouteTimeline;
