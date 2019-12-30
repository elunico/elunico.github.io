function typeText(text, selector, then, period) {
  period = period || 2;
  let index = 0;
  let elt = document.querySelector(selector);

  // no need to watch. Function is only called on page load
  // if match changes between page loads, it has no effect
  // until next page load
  let match = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (match.matches) {
    elt.innerHTML = text + '<span class="cursor">&#x258A;</span>';
    then();
    return;
  }

  function animateText(active, elt, text, index) {
    if (active % period == 0)
      elt.innerHTML = text.substring(0, index++) + '<span class="cursor">&#x258A;</span>'
    if (index > text.length) {
      then();
    } else {
      requestAnimationFrame(() => animateText(++active, elt, text, index));
    }

  }

  requestAnimationFrame(() => animateText(1, elt, text, index));
}

// called on every scroll
function fade() {
  let elts = document.querySelectorAll('.fadesIn');
  let bottomY = window.innerHeight;
  for (let elt of elts) {
    let top = elt.getBoundingClientRect().top;
    let bottom = elt.getBoundingClientRect().bottom;
    if (top + 25 < bottomY) {
      // appear
      // elt.style.opacity = 1.0;
      // elt.style.transform = 'scale(1)';
      elt.classList.add('fadesOnScreen');
      elt.classList.remove('fadesOffscreen');
    } else {
      // not visible ever
      elt.classList.remove('fadesOnScreen');
      elt.classList.add('fadesOffscreen');
    }
    if (bottom < 0) {
      // scrolling past the top
      elt.classList.add('fadesOffscreen');
      elt.classList.remove('fadesOnScreen');

    }
  }
}

window.onscroll = fade;

function cursorFade() {
  console.trace('Calling cursor fade');
  setInterval(() => {
    let cursors = document.querySelectorAll('.cursor');
    for (let cursor of cursors) {
      cursor.style.opacity = 1 - Number(cursor.style.opacity);
    }
  }, 750);
}

// VIMPLEMENTATION

const sectionSize = 600;
const pageSize = 10000;

function commandError(cmd, reason) {
  let p = document.querySelector('#vim');
  p.style.color = 'red';
  p.textContent = `Error!: ${cmd}: ${reason}`;
  setTimeout(() => {
    p.style.color = '';
    if (!listening) {
      p.textContent = '';
    }
  }, 2500);
}

function commandSucceed(msg) {
  let p = document.querySelector('#vim');
  p.textContent = `Success: ${msg}`;
  setTimeout(() => {
    if (!listening) {
      p.textContent = '';
    }
  }, 1500);
}

function executeAction() {
  let p = document.querySelector('#vim');
  let char = p.textContent.substring(0, p.textContent.length - 1);
  switch (char) {
    case '?':
      commandSucceed('Going to help');
      window.location = '/vimhelp.html';
      return true;
    case '->p':
      commandSucceed('Going to programming!');
      window.location = "/progproj.html";
      return true;
    case '->i':
      commandSucceed('Going to info');
      window.location = '/info.html';
      return true;
    case '->h':
      commandSucceed('Going to home');
      window.location = '/';
      return true;
    case '->l':
      commandSucceed('Going to linguistics');
      window.location = '/langproj.html';
      return true;
    case '!!':
      commandError(char, 'Turning off fade not yet supported');
      return false;
    case ']]':
      window.scrollBy(0, sectionSize);
      commandSucceed('Next section');
      return true;
    case '[[':
      window.scrollBy(0, -sectionSize);
      commandSucceed('Previous section');
      return true;
    case 'G':
      window.scrollBy(0, pageSize);
      commandSucceed('go to end of file');
      return true;
    case 'gg':
      window.scrollBy(0, -pageSize);
      commandSucceed('go to beginning of file');
      return true;
    case ':q':
      commandError(char, 'file not saved!');
      return false;
    case ':q!':
      window.location = 'http://google.com';
      commandSucceed('exiting...');
      return true;
    default:
      commandError(char, 'UNKNOWN COMMAND! try using `?`');
      return false;
  }
}

let listening = false;

function vimHandle() {

  let bodies = document.getElementsByTagName('body');
  for (let body of bodies) {
    body.onkeydown = function (event) {
      if (event.keyCode === 27) {
        listening = !listening;
        let p = document.querySelector('#vim');
        if (listening) {
          p.innerHTML = '<span class="cursor">&#x258A;</span>';
        } else {
          p.innerHTML = '';
        }
      } else if (listening) {
        if (event.keyCode === 13) {
          listening = false;
          executeAction();
        } else if (event.keyCode == 8) {
          let p = document.querySelector('#vim');
          p.textContent = p.textContent.substring(0, p.textContent.length - 2);
          p.innerHTML += '<span class="cursor">&#x258A;</span>';
        } else {
          if (event.key.length != 1) {
            return;
          }
          let p = document.querySelector('#vim');
          p.textContent = p.textContent.substring(0, p.textContent.length - 1) + event.key;
          p.innerHTML = p.innerHTML + '<span class="cursor">&#x258A;</span>';
        }
        event.preventDefault();
      }
    }
  }
}


function run_common() {
  cursorFade();
  vimHandle();
}