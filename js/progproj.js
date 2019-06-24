window.onload = () => {
  run_common();
  typeText('Programming Projects', '#mainHeader', () => {
    buttonFade();

    let progproj = document.querySelector('.progPageDescription');
    progproj.style.opacity = 1;
    let projects = document.querySelectorAll('.projectContainer');
    let step = 1;
    for (let proj of projects) {
      setTimeout(() => {
        proj.style.opacity = 1;
      }, step++ * 80);
    }
  });
}


