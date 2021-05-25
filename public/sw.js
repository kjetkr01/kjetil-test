const cacheName = 'js13kPWA-v23';

const contentToCache = [
    '/account.html',
    '/images/appIcon.png',
    '/images/trash.svg',
    '/images/arrow-down-trainingsplit.svg',
    '/images/arrow-up-trainingsplit.svg',
    '/images/subscribe-trainingsplit.svg',
    '/images/subscribed-trainingsplit.svg',
    '/images/copy-trainingsplit.svg',
    '/images/settings.svg',
    '/index.html',
    '/leaderboards.html',
    '/manifest.json',
    '/scripts/account/account.js',
    '/scripts/account/editInformation.js',
    '/scripts/appInfo.js',
    '/scripts/badges/ownerBadges.js',
    '/scripts/badges/userBadges.js',
    '/scripts/global.js',
    '/scripts/index/index.js',
    '/scripts/index/script.js',
    '/scripts/leaderboards/leaderboards.js',
    '/scripts/overlay/overlay.js',
    '/scripts/settings/loadFunctions.js',
    '/scripts/settings/saveSettings.js',
    '/scripts/settings/settings.js',
    '/scripts/settings/templateFunctions.js',
    '/scripts/user/editInformation.js',
    '/scripts/user/user.js',
    '/scripts/trainingsplit/trainingsplit.js',
    '/settings.html',
    '/styles/account/common.css',
    '/styles/account/desktop.css',
    '/styles/account/mobile.css',
    '/styles/account/overlay.css',
    '/styles/badges/badgeColors.css',
    '/styles/badges/badges.css',
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
    '/styles/themes/globalThemeValues.css',
    '/styles/themes/themes.css',
    '/styles/user/common.css',
    '/styles/user/desktop.css',
    '/styles/user/mobile.css',
    '/styles/user/overlay.css',
    '/styles/userAndAccount/userGrid.css',
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