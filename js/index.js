function startFade() {
  let elt = document.querySelector('#welcome');
  elt.style.opacity = 0.95;

  buttonFade();

  let links = document.querySelector('#medialinks');
  links.style.opacity = 1.0;
}

typeText('Thomas Povinelli', '#mainTitle', () => {
  startFade();
}, 75);

