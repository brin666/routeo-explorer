function escapeMapText(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

export function RouteMapPreview(route, { story = false } = {}) {
  const map = route.map;
  const geometry = story ? (map.storyMap || map) : map;
  const viewId = `map-${route.id}-${story ? "story" : "card"}`;
  const roads = (map.roads || []).map((path, index) => `<path class="route-map__road${index > 1 ? " route-map__road--small" : ""}" d="${path}"/>`).join("");
  const contours = (map.contours || []).map((path) => `<path class="route-map__contour" d="${path}"/>`).join("");
  const blocks = (map.blocks || []).map((block) => `<rect class="route-map__block" x="${block.x}" y="${block.y}" width="${block.w}" height="${block.h}" rx="3" transform="rotate(${block.rotate} ${block.x + block.w / 2} ${block.y + block.h / 2})"/>`).join("");
  const parks = (map.parks || []).map((path) => `<path d="${path}" fill="rgba(114,153,115,.42)"/>`).join("");
  const fields = (map.fields || []).map((path, index) => `<path d="${path}" fill="none" stroke="${index % 2 ? "rgba(240,219,163,.44)" : "rgba(158,154,100,.32)"}" stroke-width="${index % 2 ? 18 : 10}" stroke-linecap="round"/>`).join("");
  const routeLine = `<path class="route-map__route-halo" d="${geometry.route}"/><path class="route-map__route-casing" d="${geometry.route}"/><path class="route-map__route" d="${geometry.route}" style="--route-color:${route.accent}"/><path class="route-map__trace" d="${geometry.route}"/>`;
  const pointMarkup = geometry.points.map((point) => {
    const label = escapeMapText(point.name);
    const labelWidth = Math.min(176, Math.max(74, Array.from(point.name).length * 15 + 25));
    const labelX = point.labelSide === "left" ? point.x - labelWidth - 16 : point.x + 15;
    const unclampedY = point.labelY === "below" ? point.y + 13 : point.y - 45;
    const labelY = Math.max(100, Math.min(317, unclampedY));
    const pointRadius = point.role ? 12 : 9;
    const labelClasses = [
      "route-map__point-label-group",
      point.role === "start" ? "route-map__point-label-group--start" : "",
      point.role === "end" ? "route-map__point-label-group--end" : ""
    ].filter(Boolean).join(" ");
    const labelMarkup = story ? "" : `<g class="${labelClasses}"${point.mobileHide ? ' data-mobile-hide="true"' : ""}>
        <rect class="route-map__point-label-bg" x="${labelX}" y="${labelY}" width="${labelWidth}" height="31" rx="15.5"/>
        <text class="route-map__point-label" x="${labelX + labelWidth / 2}" y="${labelY + 20.5}" text-anchor="middle">${label}</text>
      </g>`;
    return `<g class="route-map__point-group" data-point="${label}">
      <circle class="route-map__point-ring" cx="${point.x}" cy="${point.y}" r="${pointRadius + 5}"/>
      <circle class="route-map__point-shell" cx="${point.x}" cy="${point.y}" r="${pointRadius + 2}"/>
      <circle class="route-map__point" cx="${point.x}" cy="${point.y}" r="${pointRadius}" style="--point-color:${point.color || route.accent}"/>
      <circle class="route-map__point-center" cx="${point.x}" cy="${point.y}" r="${point.role ? 3.3 : 2.7}"/>
      ${labelMarkup}
    </g>`;
  }).join("");

  let terrain = "";
  if (map.kind === "coast" || map.kind === "coastal-road") {
    const land = map.kind === "coast" ? "#788d79" : "#899176";
    const sea = map.kind === "coast" ? "#327c82" : "#397e83";
    terrain = `<rect width="1200" height="360" fill="${land}"/><path d="${map.water}" fill="${sea}"/><path class="route-map__shoreline" d="${map.shoreline}"/>`;
  } else if (map.kind === "city-garden") {
    terrain = `<rect width="1200" height="360" fill="#768c79"/><path d="M0 177 C158 136 237 184 372 166 S566 116 684 151 S879 213 1023 172 S1138 154 1200 167 V213 C1085 194 1013 228 896 238 S690 198 585 221 S388 270 274 236 S103 218 0 246Z" fill="#387d82" opacity=".72"/>${parks}`;
  } else if (map.kind === "fields") {
    terrain = `<rect width="1200" height="360" fill="#928c67"/><path d="M0 0H1200V360H0Z" fill="rgba(207,185,127,.2)"/>${fields}<path d="M0 282 C175 257 300 300 424 270 S658 240 773 273 S1017 307 1200 253V360H0Z" fill="rgba(79,103,69,.46)"/>`;
  } else {
    terrain = `<rect width="1200" height="360" fill="#7d9278"/><path d="M0 272 C168 237 236 282 365 256 S558 201 681 225 S877 281 1002 244 S1126 222 1200 239V360H0Z" fill="rgba(49,93,72,.36)"/><path d="M0 0H1200V84 C1030 112 911 66 763 86 S519 129 393 97 S127 55 0 104Z" fill="rgba(178,154,92,.25)"/>`;
  }

  const photoSource = story ? (map.storyImage || route.image) : route.image;
  const photoMarkup = `<image class="route-map__photo" href="${escapeMapText(photoSource)}" x="0" y="0" width="1200" height="${story ? 675 : 360}" preserveAspectRatio="xMidYMid slice"/>`;
  const aspect = story ? "none" : "xMidYMid slice";
  const storyScale = story && !map.storyMap ? ' transform="scale(1 1.875)"' : "";
  const storyGeometry = story && map.storyMap ? `<g class="route-map__story-geometry">${routeLine}${pointMarkup}</g>` : "";
  return `<svg class="route-map-preview${story ? " route-map-preview--story" : ""}" viewBox="${story ? "0 0 1200 675" : "0 0 1200 360"}" preserveAspectRatio="${aspect}" role="img" aria-label="${escapeMapText(route.place)}路线地图，经过${map.points.map((point) => escapeMapText(point.name)).join("、")}">
    <defs>
      <linearGradient id="${viewId}-tone" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="rgba(239,228,187,.22)"/><stop offset="1" stop-color="rgba(24,54,46,.18)"/></linearGradient>
      <pattern id="${viewId}-grain" width="80" height="80" patternUnits="userSpaceOnUse"><circle cx="8" cy="16" r="1" fill="rgba(255,255,255,.13)"/><circle cx="46" cy="55" r=".8" fill="rgba(18,39,32,.13)"/><circle cx="71" cy="23" r=".7" fill="rgba(255,255,255,.12)"/></pattern>
    </defs>
    ${story ? photoMarkup : ""}
    ${story ? '<rect width="1200" height="675" fill="rgba(20,31,27,.12)"/>' : ""}
    <g class="route-map__terrain"${storyScale}>
      ${story ? "" : terrain}
      ${story ? "" : photoMarkup}
      ${map.storyMap ? (story ? "" : `${contours}${roads}${blocks}`) : `${contours}${roads}${blocks}`}
      ${story && map.storyMap ? "" : `<path d="M0 0H1200V360H0Z" fill="url(#${viewId}-tone)"/><path d="M0 0H1200V360H0Z" fill="url(#${viewId}-grain)" opacity=".58"/>${routeLine}${pointMarkup}`}
    </g>
    ${storyGeometry}
  </svg>`;
}
