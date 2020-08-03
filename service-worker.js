

const filesToCache = [
    '/PixiJS-Solitaire/',
    '/PixiJS-Solitaire/images/icons-192.png',
    '/PixiJS-Solitaire/images/pokersheet.png',
    '/PixiJS-Solitaire/images/pokersheet.json',
    '/PixiJS-Solitaire/images/reset.png',
    '/PixiJS-Solitaire/favicon.ico',
    '/PixiJS-Solitaire/index.html',
    '/PixiJS-Solitaire/scripts/hitTestRectangle.js',
    '/PixiJS-Solitaire/scripts/tink.js',
    '/PixiJS-Solitaire/scripts/pixi.min.js',
    '/PixiJS-Solitaire/manifest.json',
    '/PixiJS-Solitaire/service-worker.js'

];

const cacheName = 'offline-3-8-2020';
const dataCacheName = 'offline-data';

// install
self.addEventListener('install', event => {
    console.log('installing…');
    self.skipWaiting();
    event.waitUntil(
            caches.open(cacheName).then(cache => {
        console.log('Caching app ok');
        return cache.addAll(filesToCache);
    })
            );
});

// activate
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys()
    .then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// fetch
self.addEventListener('fetch', event => {
    console.log('now fetch!');
    event.respondWith(
            caches.match(event.request).then(function (response) {
        return response || fetch(event.request).then(res =>
            caches.open(dataCacheName)
                    .then(function (cache) {
                        cache.put(event.request, res.clone());
                        return res;
                    })
        );
    })
            );
})

