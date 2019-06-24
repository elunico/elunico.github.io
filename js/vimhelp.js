window.onload = () => {
  run_common();
  typeText('VIM-like Commands', '#mainHeader', () => {
    buttonFade();
    let d = document.querySelectorAll('.progPageDescription');
    for (let prog of d) { prog.style.opacity = 1; }

    let projects = document.querySelectorAll('.projectContainer');
    for (let project of projects) {
      setTimeout(() => {
        project.style.opacity = 1;
      }, 75);
    }
  });
};
