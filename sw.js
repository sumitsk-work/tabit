// sw.js
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('focus-task-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/app.js',
                '/manifest.json',
            ]);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((cacheRes) => {
            return cacheRes || fetch(e.request);
        })
    );
});
