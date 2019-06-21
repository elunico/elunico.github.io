
function typeText(text, selector, then, timeout) {
  let index = 0;
  let elt = document.querySelector(selector);
  let interval = setInterval(() => {
    elt.innerHTML = text.substring(0, index++) + '<span id="cursor">&#x258A;</span>'
    if (index > text.length) {
      setTimeout(() => {
        clearInterval(interval);
        then();
      }, 60);
    }
  }, timeout || 60);
}

setInterval(() => {
  let cursor = document.querySelector('#cursor');
  cursor.style.opacity = 1 - Number(cursor.style.opacity);
}, 750);

function buttonFade() {
  let buttons = document.querySelectorAll('.button');
  console.log(buttons);
  for (let b of buttons) {
    b.style.opacity = 1.0;
  }
}
