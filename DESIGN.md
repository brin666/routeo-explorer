# Routeo visual contract

## Screen job

Help someone scan illustrated travel routes, search or choose a city, save a promising route, and open its full-screen map story.

## Hierarchy and composition

- Warm ivory canvas and a compact top header with logo, search, saved routes and preferences. The navigation rail has been removed on desktop and mobile.
- One vertical feed of wide, shallow route cards. The card is the navigation target; it has no secondary “enter” button.
- Desktop cards keep city, readable route title, day/stop count and the actual ordered stops at the left; the illustrated map occupies the remaining area. The cards are 272 px tall in a single-column feed capped at 1504 px including page gutters.
- Mobile cards put the unshaded map above a compact information block. Titles wrap, itinerary names are visible, and a dedicated tap target opens an itinerary preview. Keep map artwork, typography and colors consistent with the existing product.
- City navigation shows all routes and three common cities; a native modal contains the full city list and actual route counts. Topic labels remain on cards and searchable, rather than occupying the top navigation.
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
- Empty search and empty saved states explain the next action. Settings live under the header's more button; reduced motion follows the system until a local preference is saved.
- On mobile and coarse pointers, the itinerary preview is an explicit button and native modal. It uses feed summaries and does not request detail chunks or the React animation bundle. Dialogs support Escape, backdrop dismissal and safe-area padding.
- Mobile detail text and common controls use larger type and touch targets. The prompt action is labeled “复制给 AI”; its copied content is unchanged.
- Honor `prefers-reduced-motion` and preserve functional controls when JavaScript is unavailable only as static content.
- `RouteStoryController.setNarrativeProgress(progress)` is the future scroll-story interface: it updates illustration progress and active stop data for normalized `0..1` progress.

## Avoid

Three-column grids, square dashboard cards, heavy borders, excess copy, route-entry buttons inside cards, and using the reference image as a background. Route-detail stop coordinates and connectors are illustrative, not verified navigation directions.
