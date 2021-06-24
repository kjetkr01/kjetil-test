const cacheName = 'TS-PWA-v53';
const swName = '[Service Worker]';

const contentToCache = [

    /* MAIN */

    '/',
    'sw.js',
    'ts_application.js',
    'manifest.json',

    'login.html',
    'access.html',
    'index.html',
    'explore.html',
    'leaderboards.html',
    'trainingsplits.html',
    'users.html',
    'account.html',
    'settings.html',
    'user.html',
    'trainingsplit.html',

    /* IMAGES */

    'images/placeholder_logo_icon.png',
    'images/placeholder_logo.svg',
    'images/trash.svg',

    /* SCRIPTS */

    'scripts/global/appInfo.js',
    'scripts/global/global.js',
    'scripts/global/user.js',
    'scripts/global/functions.js',

    'scripts/shared/editInformation.js',
    'scripts/shared/badges.js',
    'scripts/shared/trainingsplit.js',
    'scripts/shared/overlay.js',
    'scripts/shared/pushToArr.js',

    'scripts/validate/validateInfo.js',
    'scripts/index/index.js',

    'scripts/leaderboards/leaderboards.js',

    'scripts/account/account.js',

    'scripts/settings/loadFunctions.js',
    'scripts/settings/saveSettings.js',
    'scripts/settings/settings.js',
    'scripts/settings/templateFunctions.js',
    'scripts/user/user.js',

    /* STYLES */

    'styles/global/global.css',
    'styles/global/globalClasses.css',
    'styles/global/globalVariables.css',
    'styles/global/themes.css',

    'styles/shared/badgeColors.css',
    'styles/shared/badges.css',
    'styles/shared/userGrid.css',
    'styles/shared/overlay.css',
    'styles/shared/footer.css',
    'styles/shared/exploreDefault.css',

    'styles/login/grid.css',
    'styles/login/values.css',

    'styles/access/grid.css',
    'styles/access/values.css',

    'styles/index/grid.css',
    'styles/index/values.css',

    'styles/account/grid.css',
    'styles/account/values.css',

    'styles/explore/exploreBadge.css',
    'styles/explore/grid.css',
    'styles/explore/values.css',

    'styles/leaderboards/board.css',
    'styles/leaderboards/grid.css',
    'styles/leaderboards/values.css',

    'styles/trainingsplits/board.css',

    'styles/users/board.css',

    'styles/settings/grid.css',
    'styles/settings/values.css',
    'styles/settings/settingsGrid.css',

    'styles/user/grid.css',
    'styles/user/values.css',

    'styles/trainingsplit/grid.css',
    'styles/trainingsplit/values.css',
];

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(function (registration) {
            console.log(`${swName} Registration successful, scope is: ${registration.scope}`);
        })
        .catch(function (error) {
            console.log(`${swName} Registration failed, error: ${error}`);
        });
}

self.addEventListener('install', (e) => {
    self.skipWaiting();
    console.log(`${swName} Install - ${cacheName}`);
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        console.log(`${swName} Caching all: app shell and content`);
        await cache.addAll(contentToCache);
        console.log(`${swName} Downloaded: app shell and content`);
    })());
});

self.addEventListener('activate', (e) => {
    console.log(`${swName} ${cacheName} now ready to handle fetches!`);
});

self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
        const r = await caches.match(e.request, { ignoreSearch: true });
        //console.log(`${swName} Fetching resource: ${e.request.url}`);
        if (r) { return r; }
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        if (e.request.method !== "POST") {
            //console.log(`${swName} Caching new resource: ${e.request.url}`);
            cache.put(e.request, response.clone());
        }
        return response;
    })());
});