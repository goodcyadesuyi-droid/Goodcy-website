const CACHE_NAME = "mamba-fx-shell-v1";
const APP_SHELL = ["/", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Never cache sign-in, callback, sign-out, dashboard, API, or other private routes.
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/callback") ||
    url.pathname.startsWith("/sign-out") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next")
  ) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match("/");
        return cached || Response.error();
      })
    );
    return;
  }

  if (request.destination === "image" && url.pathname === "/icon.svg") {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
  }
});
