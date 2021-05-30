if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(function (registration) {
            console.log(`[Service Worker] Registration successful, scope is: ${registration.scope}`);
        })
        .catch(function (error) {
            console.log(`[Service Worker] Registration failed, error: ${error}`);
        });
}