export function referenceUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    const note = url.hostname.replace(/^www\./, '') === 'xiaohongshu.com' && url.pathname.match(/\/(?:explore|discovery\/item)\/([0-9a-f]+)/);
    return note ? `https://www.xiaohongshu.com/explore/${note[1]}` : url.href;
  } catch { return ''; }
}

export function photoReferencesForPlace(story, name) {
  const byUrl = new Map();
  const references = story.photoReferences?.[name] || [];
  for (const reference of references) {
    const url = referenceUrl(reference.url);
    if (!url || byUrl.has(url)) continue;
    byUrl.set(url, { ...reference, url, kind: /xiaohongshu\.com\/explore\//.test(url) ? 'note' : 'photo', photoCount: 0 });
  }
  for (const photo of story.photoCandidates?.[name] || []) {
    const url = referenceUrl(photo.source);
    if (!url) continue;
    let reference = byUrl.get(url);
    if (!reference) {
      const isNote = /xiaohongshu\.com\/explore\//.test(url);
      reference = { url, kind: isNote ? 'note' : 'photo', author: photo.artist || '', title: isNote ? `${photo.artist || name}的实景记录` : String(photo.title || `${name}实景`).replace(/\.[^.]+$/, ''), photoCount: 0 };
      byUrl.set(url, reference);
    }
    reference.photoCount += 1;
    if (!reference.author && photo.artist) reference.author = photo.artist;
  }
  return [...byUrl.values()];
}
