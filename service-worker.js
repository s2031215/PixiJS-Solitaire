

const filesToCache = [
    '/',
    '/images/icons-192.png',
    '/images/pokersheet.png',
    '/images/pokersheet.json',
    '/images/reset.png',
    '/favicon.ico',
    '/index.html',
    '/scripts/hitTestRectangle.js',
    '/scripts/tink.js',
    '/scripts/pixi.min.js',
    '/manifest.json',
    '/service-worker.js'

];

const cacheName = 'offline-21-7-2020';
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

