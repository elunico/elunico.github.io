function loadImages() {
    let images = document.querySelectorAll('img');


    function modeMatches(dataMode, isDark) {
        return ((dataMode == 'dark' && isDark) || (dataMode == 'light' && !isDark));
    }

    if (window.IntersectionObserver) {
        const observer = new IntersectionObserver((entries, observer) => {
            let darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches || document.body.getAttribute('data-mode') == 'dark';

            console.log("Calling back");
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let elt = entry.target;

                    if (
                        (elt.getAttribute('data-mode') === 'all' ||
                            modeMatches(elt.getAttribute('data-mode'), darkMode)) &&
                        elt.getAttribute('data-loaded') !== 'true' &&
                        elt.getAttribute('data-src')
                    ) {
                        elt.src = elt.getAttribute('data-src');
                        elt.setAttribute('data-loaded', true);
                        // observer.unobserve(elt);
                    }


                }
            });
        });
        images.forEach(img => observer.observe(img));
    } else {
        function loadVisibleImages() {
            for (var i = 0; i < images.length; i++) {
                if (!images[i].hasAttribute('data-src')) continue;

                var rect = images[i].getBoundingClientRect();
                console.log(rect.x, window.scrollX, rect.y, window.scrollY, innerWidth, innerHeight);
                if (rect.x < (window.scrollX + innerWidth) && rect.y < (window.scrollY + innerHeight)) {
                    images[i].src = images[i].getAttribute('data-src');
                }
            }
        }

        window.addEventListener('scroll', event => {
            loadVisibleImages();
        });
        // once before scrolling
        loadVisibleImages();
    }

}

loadImages();
