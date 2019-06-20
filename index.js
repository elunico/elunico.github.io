function startFade() {
  let elt = document.querySelector('#welcome');
  elt.style.opacity = 0.95;

  let buttons = document.querySelectorAll('.button');
  console.log(buttons);
  for (let b of buttons) {
    b.style.opacity = 1.0;
  }

  let links = document.querySelector('#medialinks');
  links.style.opacity = 1.0;
}



const text = 'Thomas Povinelli';
let index = 0;
let elt = document.querySelector('#mainTitle');
let interval = setInterval(() => {
  elt.innerHTML = text.substring(0, index++) + '<span id="cursor">&#x258A;</span>'
  if (index > text.length) {
    setTimeout(() => {
      clearInterval(interval);
      startFade();
    }, 60);
  }
}, 75);

setInterval(() => {
  let cursor = document.querySelector('#cursor');
  cursor.style.opacity = 1 - Number(cursor.style.opacity);
}, 750);
