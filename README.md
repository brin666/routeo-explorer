# Routeo

A standalone travel-route discovery prototype built from the supplied UI reference.

## Online demo and GitHub Pages

The public demo is hosted at [brin666.github.io/routeo-explorer](https://brin666.github.io/routeo-explorer/).

Pushing to `main` runs `.github/workflows/pages.yml` and publishes the static release from `dist/pages`. Hash routes work under the repository's URL, including direct links to individual guides. The release includes the browser modules, prebuilt photo/Remotion bundles, maps and selected photographs used by the active routes; it excludes collection logs, raw drafts, credentials and local tools. No server or API key is needed for the hosted demo. Original photo sources and existing permission metadata are preserved; publication does not change their stated license status.

When adding reviewed route assets, run:

```cmd
npm run build:pages
npm run stage:pages-assets
```

The second command stages only runtime assets referenced by the active site, including selected photos in otherwise ignored research folders. Review and commit those files together with your code/data changes, then push. Unused local research copies remain ignored. If a React/Remotion source changes, run its corresponding `build:photos` or `build:motion` command first; Pages publishes the committed browser bundles. `dist/pages/release-manifest.json` records the packaged files and their hashes.

## Run locally

From this folder run:

```cmd
node server.mjs
```

Then open `http://127.0.0.1:8000`. The local Node server only serves the static project files; the site does not need map API credentials.

The active route feed preserves Guangzhou Xiguan Walk, Chengdu CD-01, Nanjing NJ-01 and Xi'an XA-01, and adds the 2026-10-13 city batch through `assets/routes/batch20-data.js`. The five early demo routes are excluded from the active registry. All route stories share one Remotion composition: the dashed route appears in the third act and draws through the stops in order. Map gestures control the view without cancelling the route animation. See [`ROUTE-MAP-SOP.md`](./ROUTE-MAP-SOP.md) for the reusable map-sketch, image, coordinate, and animation workflow. When changing the Remotion composition, run `npm run build:motion`; the bundle is written to `assets/routeo-remotion.js` and loaded only on route-story pages.

Each city story now uses a versioned illustrated map background with separate route and stop-marker coordinates. Source PNGs, generated display WebPs, structure sketches, and reusable prompt records are stored under `assets/routes/`.

## 2026-10-13 city batch

The batch covers twenty cities and ninety-six itinerary stops. Each illustration is generated independently from its geographic sketch using the existing Guangzhou illustration style; the generated PNG, original-size WebP and per-landmark visual calibration are archived under `assets/routes/batch20/`. Separate AMap records hold real POI coordinates and station-to-station route results. Unconfirmed entrances, current prices, bookings and restaurant details remain explicit gaps.

The feed's city buttons come from the active routes. On narrow screens, the new batch begins near the first landmark while keeping the artwork full-bleed; dragging and zooming use the shared map controller. Empty photo routes display a pending state plus reference notes, and unknown shop details do not become invented restaurants.

See the [per-landmark collection handoff](./handoffs/2026-10-13-batch20-missing-materials.md) and [adoption index](./assets/routes/batch20-adoption-index.json). The importer [`scripts/import-20261013-city-batch.mjs`](./scripts/import-20261013-city-batch.mjs) consumes locally reviewed plans and finished calibrations; it does not scrape sources or generate the artwork itself. Photo research folders are ignored by default; the selected photographs used by the public demo are staged explicitly through `stage:pages-assets`.

## Real-photo deck

### 2026-10-13 replenishment batch 01

The approved material batch is integrated through `assets/routes/batch01-updates.js`. It supplements the base routes after existing photo and dining updates, so reimporting the original city batch does not remove the reviewed additions. The twenty new routes now contain 114 scene-reference photographs across 95 of 96 stops, seventeen restaurant references, and field-level opening/booking sources. Kunming's previously missing stop uses the explicitly named south-gate result from AMap Geocoder; actual public access remains a separate check.

To regenerate the reviewed replenishment and its current handoff, run these in the project directory:

```cmd
node scripts/import-20261013-batch01-dining.mjs
node scripts/import-20261013-batch01-materials.mjs
node scripts/report-20261013-batch01-adoption.mjs
```

These scripts read the reviewed local batch at `D:\小红书数据采集\Routeo补齐_20261013_批次01`; `--materials` selects another matching copy. The material importer also reads the local Kunming query archive when it exists. Generated source modules contain safe public links and provenance; raw collection logs and access parameters are not copied. Unused local research copies remain ignored; selected runtime photographs are included in the public demo. See [current adopted materials and remaining gaps](./handoffs/2026-10-13-batch01-remaining-materials.md), its [per-stop CSV](./handoffs/2026-10-13-batch01-remaining-materials.csv), and the [update log](./handoffs/2026-10-13-batch01-update-log.md).

The real-photos pane uses the reusable React/TSX component [`components/ui/card-deck-carousel.tsx`](./components/ui/card-deck-carousel.tsx), adapted from the supplied stacked-card reference. All available photos form one collection in itinerary order. Dragging, arrows, and autoplay advance from the last photo of one stop to the first photo of the next; stops with no photos are skipped. Place pills and thumbnails can jump into the same collection. Selecting an empty stop shows a pending state with a button to continue. Photo sources and credits follow the active image; clicking opens the original-size view. Autoplay pauses while interacting, when the pane is closed, and when reduced motion is enabled.

The existing page remains an ES-module application. The deck and feed timeline share one React island bundle, loaded on the first card preview or when the real-photos tab opens; their scoped CSS lives in `styles.css`. These components use no shadcn or Tailwind APIs, so those packages are not required. Vite transpiles the TSX sources into the local browser bundle; this is not a TypeScript type-checking setup.

Below the photographs, a per-place reference list shows original note titles and authors, deduplicated by source URL. The note containing the current photograph is highlighted; other notes are labeled as travel references. Authors and original links stay on the photo caption and enlarged view, while usage/permission metadata stays in the data records. Reading or focusing the reference list pauses autoplay without changing the user's play/pause setting. Local note metadata and additional photographs are in `assets/routes/photo-notes-data.js`.

After changing the deck, run `npm run build:photos` (or `node node_modules/vite/bin/vite.js build --config vite.photos.config.js`). The bundle is saved to `assets/routeo-photo-deck.js`; it does not rebuild the Remotion map animation.

The 2026-10-13 replenishment adds fifteen scene photographs to Chengdu CD-01, bringing all five stops to twenty-five photographs. Three menu/price-card photographs were also added. See the [adoption record and remaining collection tasks](./handoffs/2026-10-13-replenishment-adoption.md) for unresolved current prices, access rules, and exact-branch menus.

## Dining photos and spend references

Restaurant cards emphasize per-person spend with a link to the named source. Collection dates and historical notes remain in `assets/routes/dining-data.js` and in the copied Agent prompt; the visible cards use only the product-facing summary. Heming's conflicting tea-price records are labeled per cup, separately from meal averages.

Hovering over a restaurant previews its first photo; clicking opens a native photo dialog. Menu/price-card photographs appear first, then dishes, surroundings, and reference collages. Photos keep their source links and watermarks. The viewer supports thumbnails, arrow keys, rotation, and close/Escape. The twenty-four active guides contain thirty restaurant references and 103 locally stored dining photographs. Unused local research copies remain ignored; only selected runtime photos are staged for the demo. Unverified prices have a pending label without an invented source badge. Heming's two same-product price cards show ¥20 and ¥25 per cup as conflicting records, without selecting one as the current tea price.

## Card timeline previews

On desktop, hovering over a route card draws a compact horizontal timeline with alternating stops. Its time labels and place names come from the same route data as the detail page. Keyboard focus reveals the full itinerary immediately; Escape dismisses the preview. Touch users can still tap straight into the route. Filtering, saving, and leaving the feed dispose of or deactivate previews so no hidden animations continue.

Card backgrounds use the generated `storyArtwork.image` directly. The homepage does not draw SVG route lines, pins, or place labels on those images; the hover timeline is a separate web layer.

The reusable component is `components/ui/timeline.tsx`, adapted from the supplied timeline reference. The original full-page ScrollTrigger sequence is replaced by hover-controlled CSS transitions: no pinned page, unrelated milestones, or GSAP dependency. Rebuild with `npm run build:photos` after changing either React component.

The page uses original local illustrations and schematic route overlays; it does not load AMap JSAPI, map tiles, or location services. Route connectors, distances, and durations are illustrative itinerary data, not turn-by-turn navigation. Current opening and booking details should be confirmed through the official links in each guide.
