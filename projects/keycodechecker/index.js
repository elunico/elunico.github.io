/* global bg, color */

const animationTransform = 'scale(1.05)';

function randomInt(start, end) {
  return Math.round(((Math.random()) * (end - start)) + start);
}

function makeCheckImage() {
  let elem = document.createElement('img');
  elem.setAttribute('src', 'check.png');
  elem.setAttribute('height', '20');
  elem.setAttribute('width', '20');
  elem.setAttribute('alt', 'Check box indicated the property is set');
  return elem;
}

// eslint-disable-next-line no-unused-vars
function removeMoreTranform() {
  let d = document.querySelector('#keyCode');
  let e = document.querySelector('#key');
  let f = document.querySelector('#code');

  d.style.transform = '';
  e.style.transform = '';
  f.style.transform = '';
}

function resetStatus(elt) {
  elt.style.color = color;
  elt.style['background-color'] = bg;
}

function animateSetText(selector, text) {
  let elt = document.querySelector(selector);
  elt.textContent = text;
  elt.style.transform = animationTransform;
}

// eslint-disable-next-line no-unused-vars
function getMoreKeyCode(event) {
  event.preventDefault();

  let shiftT = document.querySelector('#shiftDown');
  let ctrlT = document.querySelector('#ctrlDown');
  let altT = document.querySelector('#altDown');
  let metaT = document.querySelector('#metaDown');

  resetStatus(shiftT);
  resetStatus(ctrlT);
  resetStatus(altT);
  resetStatus(metaT);

  animateSetText('#keyCode', event.keyCode);
  animateSetText('#key', event.key);
  animateSetText('#code', event.code);

  if (event.shiftKey || event.keyCode == 16) {
    shiftT.style.color = bg;
    shiftT.style['background-color'] = color;
  }

  if (event.ctrlKey || event.keyCode == 17) {
    ctrlT.style.color = bg;
    ctrlT.style['background-color'] = color;
  }

  if (event.altKey || event.keyCode == 18) {
    altT.style.color = bg;
    altT.style['background-color'] = color;
  }

  if (event.metaKey) {
    metaT.style.color = bg;
    metaT.style['background-color'] = color;
  }
}

// eslint-disable-next-line no-unused-vars
function removeTransform() {
  let d = document.querySelector('#key');
  d.style.transform = '';
}

let oldSize;
// eslint-disable-next-line no-unused-vars
function getKeyCode(event) {
  event.preventDefault();

  let d = document.querySelector('#key');
  d.textContent = event.key;
  console.log(event.key);
  if (event.key == ' ') {
    if (!oldSize) oldSize = getComputedStyle(d)['font-size'];
    d.style['opacity'] = 0.75;
    d.style['font-size'] = '8vw';
    d.style['font-style'] = 'italic';
    d.textContent = '<space character>';
  } else if (event.key.length > 1) {
    if (!oldSize) oldSize = getComputedStyle(d)['font-size'];
    d.style['opacity'] = 1;
    d.style['font-size'] = '9vw';
    d.style['font-style'] = 'normal';
  } else {
    d.style['opacity'] = 1;
    d.style['font-style'] = 'normal';
    d.style['font-size'] = oldSize;
  }
  d.style.transform = 'scale(1.1)';
}

// eslint-disable-next-line no-unused-vars
function randomStyle() {
  const h = randomInt(0, 255);
  const s = 100;
  const l = 95;
  const offset = 75;

  const media = matchMedia('(prefers-color-scheme: dark)');

  if (media.matches) {
    return {
      'color': `hsl(${h}, ${s}%, ${l}%)`,
      'bg': `hsl(${h}, ${s}%, ${l - offset}%)`
    };
  } else {
    return {
      'bg': `hsl(${h}, ${s}%, ${l}%)`,
      'color': `hsl(${h}, ${s}%, ${l - offset}%)`
    };
  }
}
