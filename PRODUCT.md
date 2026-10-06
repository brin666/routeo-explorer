# Product

<!-- uizze:product-schema 1 -->

## Platform

web

## Stack

Standalone HTML, CSS, and JavaScript for the site shell, with a bundled Remotion Player composition for route-story motion.

## Users

Assumption: travelers who want to browse short, themed routes before deciding where to go.

## Product Purpose

Help visitors discover travel routes, save the ones they like, and open a full-screen map story.

## Positioning

No market position is confirmed. This prototype makes the route itself the main browsing surface, as requested.

## Operating Context

Visitors search by place or theme, narrow the feed by one of five Chinese cities or an experience, then open a full-screen map story. Its opening introduces the trip; a right-side route curtain reveals stops in sequence, then remains available from a persistent edge button so visitors can reopen it in later story beats.

## Capabilities and Constraints

- The prototype has five city guides (Suzhou, Hangzhou, Nanjing, Chengdu, and Beijing), search, city and experience filters, saved routes, and full-screen route stories.
- Route cards use destination illustrations with schematic SVG route geometry. Route stories use five custom full-bleed city map illustrations with interactive pins; the first two acts keep the map clean, then a thin dashed Remotion route appears in the third act. Wheel/pinch zoom and drag pan stay within the map bounds; manual gestures take over the camera while the route animation continues. Opening or closing the itinerary overlay preserves the current view. Zoom controls stay hidden, with a contextual “看全程” action after the view moves.
- The route curtain keeps its active tab, selected stop, and per-tab scroll position when it closes and reopens. Official venue links appear in each guide's practical information.
- The application does not request AMap services or tiles. Hangzhou POI reference coordinates have been recorded for calibration, but walking-route nodes are still pending; the displayed stop placement and route lines are illustrative and are not turn-by-turn navigation.
- The details and route suggestions are illustrative sample content.

## Brand Commitments

“Routeo” is a provisional product name taken from the supplied visual reference.

## Evidence on Hand

The user supplied a Routeo route-discovery UI screenshot. The route panoramas and story maps are generated illustrations. Hangzhou has saved POI reference coordinates, but no city has archived walking-route nodes for these story paths; destination photography is not used as route geometry.

## Product Principles

- Let the route remain the main focus, using custom illustrations, sequential stop reveal, and a retractable timeline with a persistent reopen control.
- Keep browsing focused on a small set of route facts.
- Let a route card itself open the route story.
- Mark sample route information as illustrative in the interface.

## Accessibility & Inclusion

Support keyboard operation, visible focus, readable contrast, and reduced-motion preferences.
