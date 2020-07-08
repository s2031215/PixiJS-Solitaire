self.addEventListener('install', function(event) {
  self.skipWaiting();
  
  var offlinePage = new Request('offline.html');
  event.waitUntil(
  fetch(offlinePage).then(function(response) {
    return caches.open('offline2').then(function(cache) {
      return cache.put(offlinePage, response);
    });
  }));
}); self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function(error) {
        return caches.open('offline2').then(function(cache) {
          return cache.match('offline.html');
      });
    }));
}); self.addEventListener('refreshOffline', function(response) {
  return caches.open('offline2').then(function(cache) {
    return cache.put(offlinePage, response);
  });
}); self.addEventListener('push', function (event) {
  var data = event.data.json();   var opts = {
    body: data.body,
    icon: data.icon,
    data: {
      url: data.url
    }
  };
  event.waitUntil(self.registration.showNotification(data.title, opts));
}); self.addEventListener('notificationclick', function(event) {
  var data = event.notification.data;   event.notification.close();   event.waitUntil(
    clients.openWindow(data.url)
  );
});