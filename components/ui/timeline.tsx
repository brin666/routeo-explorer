import * as React from "react";

export type TimelineStop = {
  id: string;
  time: string;
  name: string;
  color?: string;
};

export type TimelineProps = {
  stops: TimelineStop[];
  active: boolean;
  reducedMotion?: boolean;
  label?: string;
};

const DEFAULT_LABEL = "沿途行程";

/**
 * A compact route timeline. `--stop-delay` values are milliseconds so CSS can
 * stagger each stop's copy, stem, and dot in chronological order.
 */
export default function Timeline({
  stops,
  active,
  reducedMotion = false,
  label,
}: TimelineProps) {
  const count = stops.length;
  const stopCountStyle = { "--stop-count": count } as React.CSSProperties;
  const firstTime = stops[0]?.time;
  const lastTime = stops[count - 1]?.time;
  const timeRange = firstTime && lastTime ? `${firstTime}—${lastTime}` : null;

  return (
    <div
      className="feed-timeline"
      data-active={active ? "1" : "0"}
      data-reduced-motion={reducedMotion ? "1" : "0"}
      style={stopCountStyle}
    >
      {count > 0 ? (
        <>
          <div className="feed-timeline__heading">
            <span className="feed-timeline__label">{label || DEFAULT_LABEL}</span>
            {timeRange ? (
              <span className="feed-timeline__range">{timeRange}</span>
            ) : null}
          </div>
          <div className="feed-timeline__track" style={stopCountStyle}>
            <div className="feed-timeline__axis" aria-hidden="true">
              <span className="feed-timeline__axis-base" />
              <span className="feed-timeline__axis-progress" />
            </div>
            <ol className="feed-timeline__stops" aria-label={label || DEFAULT_LABEL}>
              {stops.map((stop, index) => {
                const delay = `${(index * 880) / Math.max(1, count - 1)}ms`;
                const stopStyle = {
                  "--stop-delay": delay,
                  ...(stop.color ? { "--stop-color": stop.color } : {}),
                } as React.CSSProperties;

                return (
                  <li
                    className="feed-timeline__stop"
                    data-side={index % 2 === 0 ? "top" : "bottom"}
                    key={stop.id}
                    style={stopStyle}
                  >
                    <span className="feed-timeline__copy">
                      <span className="feed-timeline__time">{stop.time}</span>
                      <span className="feed-timeline__name">{stop.name}</span>
                    </span>
                    <span className="feed-timeline__stem" aria-hidden="true" />
                    <span className="feed-timeline__dot" aria-hidden="true" />
                  </li>
                );
              })}
            </ol>
          </div>
        </>
      ) : null}
    </div>
  );
}
