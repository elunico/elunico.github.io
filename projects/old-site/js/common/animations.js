async function typeText(text, selector, period) {
  return new Promise((resolve, reject) => {

    const CURSOR_SPAN = '<span class="cursor">&#x258A;</span>';

    period = period || 2;
    let index = 0;
    let elt = document.querySelector(selector);

    // no need to watch. Function is only called on page load
    // if match changes between page loads, it has no effect
    // until next page load
    let match = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (match.matches) {
      elt.innerHTML = text + CURSOR_SPAN;
      resolve();
      return;
    }

    function animateText(active, elt, text, index) {
      if (active % period == 0)
        elt.innerHTML = text.substring(0, index++) + CURSOR_SPAN;
      if (index > text.length) {
        // running the callback in the same animation frame as the last character
        // causes it to not appear before the callback ends
        // delaying the callback to the next frame ensures the entire text is typed out before
        // the callback runs
        requestAnimationFrame(() => resolve());
      } else {
        requestAnimationFrame(() => animateText(++active, elt, text, index));
      }

    }

    requestAnimationFrame(() => animateText(1, elt, text, index));
  });

}

// called on every scroll
function fade() {
  let elts = document.querySelectorAll('.fadesIn');
  let bottomY = window.innerHeight;
  for (let elt of elts) {
    // let top = elt.getBoundingClientRect()
    //   .top;
    // let bottom = elt.getBoundingClientRect()
    //   .bottom;
    // if (top + 25 < bottomY) {
      // scroll into view from bottom
      elt.classList.add('fadesOnScreen');
      elt.classList.remove('fadesOffscreen');
    // } else {
    //   below visible area
      // elt.classList.add('fadesOffscreen');
      // elt.classList.remove('fadesOnScreen');
    // }
    // if (bottom < 0) {
    //   past the top
      // elt.classList.add('fadesOffscreen');
      // elt.classList.remove('fadesOnScreen');
    // }
  }
}

// window.onscroll = fade;


function cursorFade() {
  setInterval(() => {
    let cursors = document.querySelectorAll('.cursor');
    for (let cursor of cursors) {
      cursor.style.opacity = 1 - Number(cursor.style.opacity);
    }
  }, 750);
}

function changeImageColor(hexColor) {
  if (!hexColor) { return; }
  const imageH = 120;
  let { hue: h, saturation: s, brightness: b } = rgbColorToHSBColor(hexstringToRGBColor(hexColor));
  let images = document.getElementsByTagName('img');
  for (let image of images) {
    let filterString = `hue-rotate(${h - imageH}deg) saturate(${s}) brightness(${b})`;
    image.style.setProperty('filter', filterString);
  }
}

let hr = 0;

function doColorWheel(elt) {
  if (!elt.wheel) {
    return;
  }
  elt.style.filter = `hue-rotate(${hr}deg)`;
  hr = ((hr += 3) % 360);
  requestAnimationFrame(() => doColorWheel(elt));
}

function setDateBasedClass() {
  let query = matchMedia('(prefers-reduced-motion: reduce)');
  if (query.matches) {
    return;
  }

  if ((new Date()).getMonth() == 5) {
    let buttons = document.querySelectorAll('.button');
    for (let button of buttons) {
      button.onmouseenter = () => {
        button.wheel = true;
        doColorWheel(button);
      };
      button.onmouseout = () => {
        button.wheel = false;
        button.style.filter = '';
      };
    }
  }
}
