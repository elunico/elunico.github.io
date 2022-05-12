window.onload = () => {
  const done = '<a class="headerLink" href="#information">Information</a> ' +
    '&amp; <a class="headerLink" href="#content">Contact</a>';

  run_common_before_type();
  typeText('Information &amp; Contact', '#mainHeader')
    .then(() => {
      run_common_after_type();
      let m = document.querySelector('#mainHeader');
      m.innerHTML = done;
    });
};


window.onload = () => {;




// TODO: why does this need timeout
// setTimeout(() => buttonFade(), 60);
