function sendAnalytics() {
    let arrivalTime = Date.now();
    document.addEventListener('visibilitychange', function logData() {
        if (document.visibilityState === 'hidden') {
            navigator.sendBeacon('https://analytics.eluni.co/visit', JSON.stringify({
                elapsed: Date.now() - arrivalTime,
                source: window.location.pathname,
                hostname: window.location.hostname
            }));
        }
    });
}

sendAnalytics();
