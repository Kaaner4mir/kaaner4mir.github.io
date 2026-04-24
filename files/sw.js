const CACHE_NAME = 'kaan-bio-v3';
const STATIC_ASSETS = [
    '/',
    'index.html',
    'style.css',
    'script.js',
    'manifest.json',
    'Images/app.png',
    'Images/background.webp',
    'Images/github_banner.webp',
    'Images/gmail_banner.webp',
    'Images/instagram_banner.webp',
    'Images/linkedin_banner.webp'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Dis API isteklerini network-only
    if (url.origin !== location.origin) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return new Response(JSON.stringify({ error: 'offline' }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );
        return;
    }

    // Cache-first + stale-while-revalidate
    event.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            const cached = await cache.match(event.request);
            const fetchPromise = fetch(event.request).then((res) => {
                if (res && res.status === 200) cache.put(event.request, res.clone());
                return res;
            }).catch(() => null);
            return cached || fetchPromise;
        })
    );
});

self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') self.skipWaiting();
});
