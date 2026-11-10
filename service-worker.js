const CACHE_NAME = "welding-guide-411-v31";
const CACHE_PREFIX = "welding-guide-411-";
const APP_ROOT = new URL("./", self.location.href);
const CORE_ASSETS = [
  "./css/pwa-update.css?v=1",
  "./js/pwa-update.js?v=1",
  "./css/mobile-header.css?v=2",
  "./js/system-time.js?v=1",
  "./",
  "./index.html",
  "./css/home-link.css?v=5",
  "./css/style.css",
  "./css/style.css?v=10",
  "./js/app.js",
  "./js/app.js?v=11",
  "./js/update-state.js?v=2",
  "./data/manual.json",
  "./manifest.json",
  "./assets/icons/icon.svg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/images/procedures/glass-cleaning-mobile-01.webp",
  "./assets/images/procedures/glass-cleaning-mobile-02.webp",
  "./assets/images/procedures/glass-cleaning-mobile-03.webp",
  "./assets/images/procedures/glass-cleaning-mobile-04.webp",
  "./assets/images/procedures/glass-cleaning-mobile-05.webp",
  "./assets/images/procedures/glass-cleaning-mobile-06.webp",
  "./assets/images/procedures/glass-cleaning-mobile-07.webp",
  "./assets/images/procedures/glass-cleaning-mobile-08.webp",
  "./assets/images/procedures/rofin-clean-01.webp",
  "./assets/images/procedures/rofin-clean-02.webp",
  "./assets/images/procedures/rofin-clean-03.webp",
  "./assets/images/procedures/rofin-clean-04.webp",
  "./assets/images/procedures/rofin-clean-05.webp",
  "./assets/images/procedures/rofin-clean-06.webp",
  "./assets/images/procedures/rofin-clean-07.webp",
  "./assets/images/procedures/rofin-clean-08.webp",
  "./assets/images/procedures/rofin-clean-09.webp",
  "./assets/images/procedures/rofin-clean-10.webp",
  "./assets/images/procedures/rofin-clean-11.webp",
  "./assets/images/procedures/width-alarm-check-mobile-01.webp",
  "./assets/images/procedures/width-alarm-check-mobile-02.webp",
  "./assets/images/procedures/laser-alarm-history-mobile-01.webp",
  "./assets/images/procedures/laser-alarm-history-mobile-02.webp",
  "./assets/images/procedures/laser-alarm-history-mobile-03.webp",
  "./assets/images/procedures/laser-alarm-history-corrected-04.webp",
  "./assets/images/procedures/laser-alarm-history-corrected-05.webp",
  "./assets/images/procedures/qcds-sensor-parameters-mobile-01.webp",
  "./assets/images/procedures/qcds-sensor-parameters-mobile-02.webp",
  "./assets/images/procedures/qcds-sensor-parameters-mobile-03.webp",
  "./assets/images/procedures/qcds-sensor-parameters-mobile-04.webp",
  "./assets/images/procedures/qcds-sensor-parameters-mobile-05.webp",
  "./assets/images/procedures/qcds-parameters-clear-06.webp",
  "./assets/images/procedures/qcds-camera-change-mobile-01.webp",
  "./assets/images/procedures/qcds-camera-change-mobile-02.webp",
  "./assets/images/procedures/qcds-camera-change-mobile-03.webp",
  "./assets/images/procedures/qcds-camera-change-mobile-04.webp",
  "./assets/images/procedures/qcds-camera-change-mobile-05.webp",
  "./assets/images/procedures/qcds-camera-change-mobile-06.webp",
  "./assets/images/procedures/tia-program-download-mobile-01.webp",
  "./assets/images/procedures/tia-program-download-mobile-02.webp",
  "./assets/images/procedures/tia-program-download-mobile-03.webp",
  "./assets/images/procedures/tia-program-download-corrected-04.webp",
  "./assets/images/procedures/tia-program-download-corrected-05.webp",
  "./assets/images/procedures/tia-program-download-mobile-06.webp",
  "./assets/images/procedures/tia-program-download-corrected-07.webp",
  "./assets/images/procedures/guide-wheel-height-mobile-01.webp",
  "./assets/images/procedures/guide-wheel-height-mobile-02.webp",
  "./assets/images/procedures/inspection-encoder-mobile-notes-02.webp",
  "./assets/images/procedures/inspection-encoder-mobile-notes-03.webp",
  "./assets/images/procedures/inspection-encoder-mobile-notes-04.webp",
  "./assets/images/procedures/inspection-wheel-mobile-notes-01.webp",
  "./assets/images/procedures/inspection-displacement-mobile-notes-01.webp",
  "./assets/images/procedures/inspection-displacement-mobile-notes-02.webp",
  "./assets/images/procedures/inspection-displacement-mobile-notes-03.webp",
  "./assets/images/procedures/inspection-displacement-mobile-notes-04.webp",
  "./assets/images/procedures/inspection-displacement-mobile-notes-06.webp",
  "./assets/images/procedures/inspection-displacement-mobile-notes-07.webp",
  "./assets/images/procedures/inspection-optics-mobile-notes-01.webp",
  "./assets/images/procedures/inspection-optics-mobile-notes-02.webp",
  "./assets/images/procedures/inspection-optics-mobile-notes-03.webp",
  "./assets/images/procedures/inspection-optics-mobile-notes-04.webp",
  "./assets/images/procedures/inspection-optics-mobile-notes-05.webp",
  "./assets/images/procedures/inspection-optics-mobile-notes-06.webp",
  "./assets/images/procedures/inspection-optics-mobile-notes-07.webp",
  "./assets/images/procedures/inspection-optics-mobile-notes-08.webp",
  "./assets/images/procedures/inspection-encoder-corrected-01.webp",
  "./assets/images/procedures/inspection-wheel-corrected-02.webp",
  "./assets/images/procedures/inspection-displacement-corrected-05.webp",
  "./assets/images/procedures/inspection-optics-corrected-09.webp"
].map(function (path) { return new URL(path, APP_ROOT).toString(); });

function isCacheable(response) {
  return response && response.ok && response.type !== "opaque";
}

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(CORE_ASSETS); }));
});

self.addEventListener("activate", function (event) {
  event.waitUntil(Promise.all([
    self.clients.claim(),
    caches.keys().then(function (names) {
      return Promise.all(names.filter(function (name) {
        return name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME;
      }).map(function (name) { return caches.delete(name); }));
    })
  ]));
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (isCacheable(response)) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await (await caches.open(CACHE_NAME)).match(request);
    if (cached) return cached;
    if (request.mode === "navigate") return (await caches.open(CACHE_NAME)).match(new URL("./index.html", APP_ROOT).toString());
    throw error;
  }
}

async function cacheFirst(request) {
  const cached = await (await caches.open(CACHE_NAME)).match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (isCacheable(response)) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", function (event) {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || !url.pathname.startsWith(APP_ROOT.pathname)) return;
  if (request.mode === "navigate" || ["document", "script", "style", "manifest"].includes(request.destination) || url.pathname.endsWith("/data/manual.json")) {
    event.respondWith(networkFirst(request));
    return;
  }
  if (["image", "font", "video", "audio"].includes(request.destination)) event.respondWith(cacheFirst(request));
});

self.addEventListener("message", function (event) {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});
