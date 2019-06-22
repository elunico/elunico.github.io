typeText('Information &amp; Contact', '#mainHeader', () => {
  let content = document.querySelector('#content');
  content.style.opacity = 1;
  let progproj = document.querySelector('.progPageDescription');
  progproj.style.opacity = 1;
  let projects = document.querySelectorAll('.projectContainer');
  let step = 1;
  for (let proj of projects) {
    proj.style.opacity = 1;
  }
  buttonFade();
})



// TODO: why does this need timeout
// setTimeout(() => buttonFade(), 60);
