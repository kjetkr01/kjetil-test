const cacheName = 'TS-PWA-v34';

const contentToCache = [
    '/registerSW.js',
    '/account.html',
    '/images/appIcon.png',
    '/images/trash.svg',
    '/index.html',
    '/leaderboards.html',
    '/manifest.json',
    '/scripts/account/account.js',
    '/scripts/shared/editInformation.js',
    '/scripts/global/appInfo.js',
    '/scripts/shared/badges.js',
    '/scripts/global/global.js',
    '/scripts/index/index.js',
    '/scripts/leaderboards/leaderboards.js',
    '/scripts/shared/overlay.js',
    '/styles/shared/overlay.css',
    '/scripts/settings/loadFunctions.js',
    '/scripts/settings/saveSettings.js',
    '/scripts/settings/settings.js',
    '/scripts/settings/templateFunctions.js',
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
    '/login.html',
    '/styles/login/desktop.css',
    '/styles/login/mobile.css',
    '/styles/login/common.css',
    '/access.html',
    '/styles/access/desktop.css',
    '/styles/access/mobile.css',
    '/styles/access/common.css',
    '/scripts/validate/validateInfo.js',
]

self.addEventListener('install', (e) => {
    console.log(`[Service Worker] Install - ${cacheName}`);
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        console.log('[Service Worker] Caching all: app shell and content');
        await cache.addAll(contentToCache);
        console.log('[Service Worker] Downloaded: app shell and content');
    })());
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    console.log(`[Service Worker] ${cacheName} now ready to handle fetches!`);
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