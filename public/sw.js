const cacheName = 'js13kPWA-v28';

const contentToCache = [
    '/account.html',
    '/images/appIcon.png',
    '/images/trash.svg',
    '/index.html',
    '/leaderboards.html',
    '/manifest.json',
    '/scripts/account/account.js',
    '/scripts/account/editInformation.js',
    '/scripts/appInfo.js',
    '/scripts/shared/badges.js',
    '/scripts/global.js',
    '/scripts/index/index.js',
    '/scripts/index/script.js',
    '/scripts/leaderboards/leaderboards.js',
    '/scripts/shared/overlay.js',
    '/scripts/settings/loadFunctions.js',
    '/scripts/settings/saveSettings.js',
    '/scripts/settings/settings.js',
    '/scripts/settings/templateFunctions.js',
    '/scripts/user/editInformation.js',
    '/scripts/user/user.js',
    '/scripts/shared/trainingsplit.js',
    '/settings.html',
    '/styles/account/common.css',
    '/styles/account/desktop.css',
    '/styles/account/mobile.css',
    '/styles/shared/badgeColors.css',
    '/styles/shared/badges.css',
    '/styles/global/global.css',
    '/styles/global/globalClasses.css',
    '/styles/global/globalVariables.css',
    '/styles/index/common.css',
    '/styles/index/desktop.css',
    '/styles/index/mobile.css',
    '/styles/leaderboards/board.css',
    '/styles/leaderboards/common.css',
    '/styles/leaderboards/desktop.css',
    '/styles/leaderboards/mobile.css',
    '/styles/settings/common.css',
    '/styles/settings/desktop.css',
    '/styles/settings/mobile.css',
    '/styles/settings/settingsGrid.css',
    '/styles/global/themes.css',
    '/styles/user/common.css',
    '/styles/user/desktop.css',
    '/styles/user/mobile.css',
    '/styles/shared/userGrid.css',
    '/ts_application.js',
    '/user.html',
]

self.addEventListener('install', (e) => {
    self.skipWaiting();
    console.log(`[Service Worker] Install - ${cacheName}`);
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        console.log('[Service Worker] Caching all: app shell and content');
        await cache.addAll(contentToCache);
        console.log('[Service Worker] Downloaded: app shell and content');
    })());
});

self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
        const r = await caches.match(e.request, { ignoreSearch: true });
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