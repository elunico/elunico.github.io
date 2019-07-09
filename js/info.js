window.onload = () => {
  const done = '<a class="headerLink" href="#information">Information</a> ' +
    '&amp; <a class="headerLink" href="#content">Contact</a>';

  typeText('Information &amp; Contact', '#mainHeader', () => {
    fade();
    run_common();
    let m = document.querySelector('#mainHeader');
    m.innerHTML = done;
  });
};



// TODO: why does this need timeout
// setTimeout(() => buttonFade(), 60);
