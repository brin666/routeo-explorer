let runtimePromise;

export function loadPhotoDeckRuntime() {
  if (window.RouteoPhotoDeck?.mountPhotoDeck) return Promise.resolve(window.RouteoPhotoDeck);
  if (!runtimePromise) {
    runtimePromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = new URL("./assets/routeo-photo-deck.js", import.meta.url).href;
      script.async = true;
      script.onload = () => {
        if (window.RouteoPhotoDeck?.mountPhotoDeck) resolve(window.RouteoPhotoDeck);
        else { script.remove(); reject(new Error("PHOTO_DECK_UNAVAILABLE")); }
      };
      script.onerror = () => { script.remove(); reject(new Error("PHOTO_DECK_UNAVAILABLE")); };
      document.head.append(script);
    }).catch((error) => { runtimePromise = null; throw error; });
  }
  return runtimePromise;
}
