const LS_FONT_CHOICE_NAME = 'font-choice';
const MY_MAIN_FONT_VAR = '--my-main-font';
const DEFAULT_FONT_CHOICE = 'mdj';

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
      // scroll into view from bottom
      elt.classList.add('fadesOnScreen');
      elt.classList.remove('fadesOffscreen');
    } else {
      // below visible area
      elt.classList.add('fadesOffscreen');
      elt.classList.remove('fadesOnScreen');
    }
    if (bottom < 0) {
      // past the top
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
  let input = p.textContent.substring(0, p.textContent.length - 1);
  input = input.trim();
  if (input.charAt(0) == 'f') {
    let fontChoice = input.split(/\s+/g)[1];
    let result = setFontFromChoice(fontChoice);
    if (!result) {
      commandError(`Invalid choice for font: ${fontChoice}`);
    } else {
      commandSucceed('Successfully updated font preference');
    }
    return result;
  }
  switch (input) {
    case 'cls':
      commandSucceed('Cleared localStorage');
      localStorage.clear();
      return true;
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
      commandError(input, 'Turning off fade not yet supported');
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
      commandError(input, 'file not saved!');
      return false;
    case ':q!':
      window.location = 'http://google.com';
      commandSucceed('exiting...');
      return true;
    default:
      commandError(input, 'UNKNOWN COMMAND! try using `?`');
      return false;
  }
}

const fontDataForChoice = {
  // fonts that cannot be loaded from Google Fonts are considered to
  // be loaded by default since they only work if they are local font files
  'dflt-s': { familyName: "serif", loaded: true, loaderObject: null },
  'dflt-ss': { familyName: "sans-serif", loaded: true, loaderObject: null },
  'dflt-m': { familyName: "monospace", loaded: true, loaderObject: null },
  'c': { familyName: "Consolas", loaded: true, loaderObject: null },
  'mon': { familyName: "Monaco", loaded: true, loaderObject: null },

  // djv sans mono is distributed with the site so no extra loading is required.
  'mdj': { familyName: `"Menlo", "DejaVu Sans Mono"`, loaded: true, loaderObject: null },

  // these fonts must be loaded from the Google fonts API if the user wishes to use them
  // They are loaded with the Google and TypeScript WebFontLoader by calling WebFont.load(.loaderObject)
  'um': { familyName: "Ubuntu Mono", loaded: false, loaderObject: { google: { families: ['Ubuntu Mono:400,400i,700,700i'] } } },
  'scp': { familyName: "Source Code Pro", loaded: false, loaderObject: { google: { families: ['Source Code Pro:400,400i,700,700i'] } } },
  'sm': { familyName: "Space Mono", loaded: false, loaderObject: { google: { families: ['Space Mono:400,400i,700,700i'] } } },
  'i': { familyName: "Inconsolata", loaded: false, loaderObject: { google: { families: ['Inconsolata:400,400i,700,700i'] } } },
  'crpr': { familyName: "Courier Prime", loaded: false, loaderObject: { google: { families: ['Courier Prime:400,400i,700,700i'] } } },
};

function setFontFromChoice(choice) {
  if (!choice) { return false; }

  if (choice === "reset") {
    setFontFromChoice(DEFAULT_FONT_CHOICE);
    localStorage.removeItem(LS_FONT_CHOICE_NAME);
    return true;
  }

  let fontObject = fontDataForChoice[choice];
  if (!fontObject) { return false; }

  localStorage.setItem(LS_FONT_CHOICE_NAME, choice);

  // this check prevents loading the fonts multiple
  // times while the user reamins on the same page,
  // specifically because it is required to load the
  // font from Google Fonts on each page load, but
  // if the user switches back and forth multiple times
  // on only one page, we only wanna load the font the
  // first time
  if (!fontObject.loaded) {
    WebFont.load(fontObject.loaderObject);
    fontObject.loaded = true;
  }

  let familyName = fontObject.familyName;
  let root = document.documentElement;
  root.style.setProperty(MY_MAIN_FONT_VAR, familyName);
  return true;
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

function reloadFontChoice() {
  let choice = localStorage.getItem(LS_FONT_CHOICE_NAME);
  if (choice) {
    setFontFromChoice(choice)
  }
}

function run_common() {
  fade();
  cursorFade();
  vimHandle();
}
