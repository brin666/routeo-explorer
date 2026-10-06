# Routeo visual contract

## Screen job

Help someone scan travel routes, filter to a place or experience, save a promising route, and open a full-screen map story.

## Hierarchy and composition

- Warm ivory canvas, a quiet desktop navigation rail, and a compact search/filter bar.
- One vertical feed of wide, shallow route cards. The card is the navigation target; it has no secondary “enter” button.
- Each card keeps country/region, title, trip length, and two or three experience tags at the left. A custom route map occupies most of the horizontal area. Small stop snapshots remain secondary.
- Target desktop proportions follow the reference: roughly 160 px rail, about 210 px card height, 16 px between cards, and 18–22 px card corners at a 1536 px viewport.
- On mobile the rail disappears, the same single-column cards become taller for legibility, and the map keeps its full-width route view. Reduce secondary labels and snapshots.
- Route detail replaces the feed shell with a full-screen custom map illustration. The opening title fades in over the left side; a translucent itinerary curtain unfolds down from the top, then retracts upward while illustrated route points and animation remain on the map.

## Visual language

Use muted cream surfaces, charcoal/forest map overlays, restrained translucency, soft offset shadows, and a clear editorial title voice. Route stories use the Suzhou illustration or locally drawn SVG terrain and route geometry over a softened destination image.

## Components

- RouteMapPreview renders the local SVG terrain and route geometry used by route cards and non-Suzhou route stories.
- `RouteCard(route)` owns the click target, essential metadata, tags, saved state, and a small secondary stop-preview strip.
- RouteOpening handles the timed title and trip summary; RouteCurtain and RouteTimelineItem stage the route details; HoverImagePreview follows the active stop; RouteMap owns the illustration, interactive stop markers, and journey timing; RouteStoryController coordinates their state.

## Interaction and states

- Search and filter controls update the route feed; saved routes persist locally.
- Hover slightly lifts a card and draws a subtle route highlight over 3.8 seconds. It stops when the pointer leaves. Keyboard focus receives equivalent feedback.
- Card activation opens its map story. Story back uses browser history; selecting a map point opens the curtain at its matching stop.
- Empty results have a clear reset action. Settings expose a reduced-motion toggle.
- Honor `prefers-reduced-motion` and preserve functional controls when JavaScript is unavailable only as static content.
- `RouteStoryController.setNarrativeProgress(progress)` is the future scroll-story interface: it updates illustration progress and active stop data for normalized `0..1` progress.

## Avoid

Three-column grids, square dashboard cards, heavy borders, excess copy, route-entry buttons inside cards, and using the reference image as a background. Route-detail stop coordinates and connectors are illustrative, not verified navigation directions.
