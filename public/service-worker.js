const cacheName = 'js13kPWA-v7';
const appShellFiles = [
    'index.html',
    'service-worker.js',
    'styles/themes/themes.css',
    'styles/themes/globalThemeValues.css',
    'styles/index/desktop.css',
    'styles/index/mobile.css',
    'styles/index/common.css',
    'styles/account/overlay.css',
    'styles/badges/badges.css',
    'styles/badges/badgeColors.css',
    'scripts/appInfo.js',
    'scripts/index/script.js',
    'scripts/index/index.js',
    'scripts/badges/ownerBadges.js',
    'scripts/account/editInformation.js',
    'scripts/overlay/overlay.js'
];


const contentToCache = appShellFiles;

self.addEventListener('install', (e) => {
    self.skipWaiting();
    console.log(`[Service Worker] Install - ${cacheName}`);
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        console.log('[Service Worker] Caching all: app shell and content');
        await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {

        const r = await caches.match(e.request);
        //console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) { return r; }
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);

        if (e.request.method !== "POST") {
            //console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
            cache.put(e.request, response.clone());
        }
        return response;
    })());
});
