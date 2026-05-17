// Bump CACHE on every release so old shells don't survive a deploy.
const CACHE = "athleteos-v2";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(["./index.html", "./manifest.json"]).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first for navigations/HTML so the app shell always reflects the
// latest deploy when online; cache is only a fallback when offline.
// Cache-first for everything else (CDN libs, fonts, icons) — they're stable.
function isHTML(req) {
  return req.mode === "navigate"
      || (req.headers.get("accept") || "").includes("text/html");
}

self.addEventListener("fetch", e => {
  const req = e.request;

  if (isHTML(req)) {
    e.respondWith(
      fetch(req).then(resp => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
        }
        return resp;
      }).catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(resp => {
        if (!resp || resp.status !== 200 || resp.type === "opaque") return resp;
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(req, clone));
        return resp;
      }).catch(() => cached);
    })
  );
});
