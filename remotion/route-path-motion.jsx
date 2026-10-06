import React from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@remotion/player";
import { interpolate, useCurrentFrame } from "remotion";

const FRAME_RATE = 30;

function getPointAtProgress(samples, progress) {
  if (!samples.length) return { x: 0, y: 0 };
  if (samples.length === 1) return samples[0];

  const scaled = Math.max(0, Math.min(1, progress)) * (samples.length - 1);
  const index = Math.min(samples.length - 2, Math.floor(scaled));
  const remainder = scaled - index;
  const start = samples[index];
  const end = samples[index + 1];
  return {
    x: start.x + (end.x - start.x) * remainder,
    y: start.y + (end.y - start.y) * remainder
  };
}

function getTrailPath(samples, progress) {
  if (samples.length < 2 || progress <= 0) return "";

  const startProgress = Math.max(0, progress - 0.018);
  const first = Math.floor(startProgress * (samples.length - 1));
  const last = Math.floor(progress * (samples.length - 1));
  const coordinates = [getPointAtProgress(samples, startProgress)];

  for (let index = first + 1; index <= last; index += 1) {
    coordinates.push(samples[index]);
  }
  coordinates.push(getPointAtProgress(samples, progress));

  return `M ${coordinates.map((point) => `${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" L ")}`;
}

function getRevealedRoutePath(samples, progress) {
  if (samples.length < 2) return "";

  const bounded = Math.max(0, Math.min(1, progress));
  const lastIndex = Math.floor(bounded * (samples.length - 1));
  const coordinates = samples.slice(0, lastIndex + 1);
  if (lastIndex < samples.length - 1) coordinates.push(getPointAtProgress(samples, bounded));
  if (coordinates.length < 2) coordinates.push(coordinates[0]);

  return `M ${coordinates.map((point) => `${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" L ")}`;
}

function getSegmentedProgress(frame, durationInFrames, waypointProgress) {
  if (waypointProgress.length < 2) {
    return interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], { extrapolateRight: "clamp" });
  }

  const segmentCount = waypointProgress.length - 1;
  const timelineProgress = durationInFrames <= 1
    ? 1
    : Math.max(0, Math.min(1, frame / (durationInFrames - 1)));
  const segmentPosition = timelineProgress * segmentCount;
  const segmentIndex = Math.min(segmentCount - 1, Math.floor(segmentPosition));
  const withinSegment = Math.max(0, Math.min(1, segmentPosition - segmentIndex));
  const drawProgress = Math.max(0, Math.min(1, (withinSegment - 0.22) / 0.78));
  const start = waypointProgress[segmentIndex];
  const end = waypointProgress[segmentIndex + 1];

  return start + (end - start) * drawProgress;
}

export function RoutePathMotion({
  samples = [],
  width = 1200,
  height = 675,
  accent = "#e7a65c",
  durationInFrames = 120,
  waypointProgress = [],
  reducedMotion = false
}) {
  const frame = useCurrentFrame();
  const progress = reducedMotion
    ? 1
    : getSegmentedProgress(frame, durationInFrames, waypointProgress);
  const current = getPointAtProgress(samples, progress);
  const trail = getTrailPath(samples, progress);
  const revealedRoute = getRevealedRoutePath(samples, progress);
  const dashOffset = reducedMotion ? 0 : -(frame * 0.16);

  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: `0 0 ${width} ${height}`,
      preserveAspectRatio: "none",
      width: "100%",
      height: "100%",
      "aria-hidden": "true",
      style: { display: "block", overflow: "visible" }
    },
    [
      React.createElement("path", {
        key: "route-underlay",
        d: revealedRoute,
        fill: "none",
        stroke: "rgba(19, 31, 27, .82)",
        strokeWidth: 5.6,
        strokeDasharray: "2 5.8",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        vectorEffect: "non-scaling-stroke"
      }),
      React.createElement("path", {
        key: "route-base",
        d: revealedRoute,
        fill: "none",
        stroke: "rgba(255, 249, 232, .99)",
        strokeWidth: 2.4,
        strokeDasharray: "1.7 5.8",
        strokeDashoffset: dashOffset,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        vectorEffect: "non-scaling-stroke"
      }),
      trail && !reducedMotion
        ? React.createElement("path", {
            key: "route-progress",
            d: trail,
            fill: "none",
            stroke: accent,
            strokeWidth: 3.2,
            strokeDasharray: "2.8 5.8",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            opacity: 1,
            vectorEffect: "non-scaling-stroke"
          })
        : null,
      !reducedMotion
        ? React.createElement("circle", {
            key: "route-traveler",
            cx: current.x,
            cy: current.y,
            r: 4.6,
            fill: accent,
            stroke: "rgba(255, 253, 246, .94)",
            strokeWidth: 1.7,
            vectorEffect: "non-scaling-stroke"
          })
        : null
    ]
  );
}

export function mountRoutePathMotion(host, inputProps) {
  const root = createRoot(host);
  const playerRef = React.createRef();
  let resolveReady;
  const ready = new Promise((resolve) => {
    resolveReady = resolve;
  });
  const attachPlayer = (player) => {
    playerRef.current = player;
    if (player) resolveReady(player);
  };
  const durationInFrames = inputProps.durationInFrames || 120;

  root.render(
    React.createElement(Player, {
      ref: attachPlayer,
      component: RoutePathMotion,
      inputProps,
      durationInFrames,
      compositionWidth: inputProps.width,
      compositionHeight: inputProps.height,
      fps: FRAME_RATE,
      loop: false,
      autoPlay: false,
      controls: false,
      clickToPlay: false,
      moveToBeginningWhenEnded: false,
      style: { position: "absolute", inset: 0, width: "100%", height: "100%" }
    })
  );

  return {
    ready,
    durationInFrames,
    play() { playerRef.current?.play(); },
    pause() { playerRef.current?.pause(); },
    seekTo(frame) { playerRef.current?.seekTo(Math.max(0, Math.min(durationInFrames - 1, frame))); },
    destroy() {
      resolveReady(null);
      playerRef.current?.pause();
      root.unmount();
      host.replaceChildren();
    }
  };
}
