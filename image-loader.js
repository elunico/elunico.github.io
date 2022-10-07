function loadImages() {
  let images = document.querySelectorAll('img');


  function modeMatches(dataMode, isDark) {
    return ((dataMode == 'dark' && isDark) || (dataMode == 'light' && !isDark));
  }

  const observer = new IntersectionObserver((entries, observer) => {
    let darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    console.log("Calling back");
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let elt = entry.target;

        if (
          (elt.getAttribute('data-mode') === 'all' ||
            modeMatches(elt.getAttribute('data-mode'), darkMode)) &&
          elt.getAttribute('data-loaded') !== 'true'
        ) {
          elt.src = elt.getAttribute('data-src');
          elt.setAttribute('data-loaded', true);
          // observer.unobserve(elt);
        }


      }
    });
  });

  console.log(images);
  images.forEach(img => observer.observe(img));
}

loadImages();
