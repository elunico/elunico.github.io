typeText('Language Projects', '#mainHeader', () => {
  buttonFade();
  let d = document.querySelectorAll('.progPageDescription');
  for (let prog of d) { prog.style.opacity = 1; }

  let projects = document.querySelectorAll('.projectContainer');
  console.log(projects);
  for (let project of projects) {
    setTimeout(() => {
      project.style.opacity = 1;
    }, 75);
  }
});
