self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('food-finder-cache').then(function(cache) {
        return cache.addAll([
          './',
          './index.html',
          './styles.css',
          './app.js',
          './icons/icon-192x192.png',
          './icons/icon-512x512.png'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  