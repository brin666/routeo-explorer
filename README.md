# Routeo

A standalone travel-route discovery prototype built from the supplied UI reference.

## Run locally

From this folder run:

```cmd
node server.mjs
```

Then open `http://127.0.0.1:8000`. The local Node server only serves the static project files; the site does not need map API credentials.

The route feed contains guides for Suzhou, Hangzhou, Nanjing, Chengdu, and Beijing. All five route stories share one Remotion composition: the dashed route appears in the third act and draws through the stops in order. Map gestures control the view without cancelling the route animation. See [`ROUTE-MAP-SOP.md`](./ROUTE-MAP-SOP.md) for the reusable map-sketch, image, coordinate, and animation workflow. When changing the Remotion composition, run `npm run build:motion`; the bundle is written to `assets/routeo-remotion.js` and loaded only on route-story pages.

Each city story now uses a versioned illustrated map background with separate route and stop-marker coordinates. Source PNGs, generated display WebPs, structure sketches, and reusable prompt records are stored under `assets/routes/`.

The page uses original local illustrations and schematic route overlays; it does not load AMap JSAPI, map tiles, or location services. Route connectors, distances, and durations are illustrative itinerary data, not turn-by-turn navigation. Current opening and booking details should be confirmed through the official links in each guide.
