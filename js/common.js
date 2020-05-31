const DOMAIN = 'io.github.elunico-';

const LS_FONT_CHOICE_NAME = `${DOMAIN}font-choice`;
const LS_DARK_SET = `${DOMAIN}-set-dark`;
const LS_MAIN_COLOR = `${DOMAIN}-main-color`;
const LS_TEXT_COLOR = `${DOMAIN}-text-color`;
const LS_ACCENT_COLOR = `${DOMAIN}-accent-color`;
const LS_STATUS_TIMEOUT = `${DOMAIN}-status-timeout`;
const MY_MAIN_FONT_VAR = '--my-main-font';
const DEFAULT_FONT_CHOICE = 'mdj';
const CURSOR_SPAN = '<span class="cursor">&#x258A;</span>';

let status_timeout = 3500;

// TODO: persist between pages?
class CommandHistory {
  constructor() {
    this.backLog = [];
    this.foreLog = [];
    this.currentCommand = null;
  }

  pushCommand(input) {
    this.backLog.push(input);
  }

  previousCommand() {
    let c = this.backLog.pop();
    if (c) {
      this.foreLog.push(this.currentCommand);
      this.currentCommand = c;
    }
    return c;
  }

  nextCommand() {
    let c = this.foreLog.pop();
    if (c) {
      this.backLog.push(this.currentCommand);
      this.currentCommand = c;
    }
    return c;
  }

  resetPosition() {
    if (this.currentCommand) {
      this.backLog.push(this.currentCommand);
      this.currentCommand = null;
    }
    // FIXME: this should definitely be an index and a single list
    // because as the history grows, this will get unsustainable
    while (this.foreLog.length > 0) {
      this.backLog.push(this.foreLog.pop());
    }
  }
}

const commandHistory = new CommandHistory();
let lsd = localStorage.getItem(LS_DARK_SET);
let savedDark = lsd === 'true';


function typeText(text, selector, then, period) {
  period = period || 2;
  let index = 0;
  let elt = document.querySelector(selector);

  // no need to watch. Function is only called on page load
  // if match changes between page loads, it has no effect
  // until next page load
  let match = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (match.matches) {
    elt.innerHTML = text + CURSOR_SPAN;
    then();
    return;
  }

  function animateText(active, elt, text, index) {
    if (active % period == 0)
      elt.innerHTML = text.substring(0, index++) + CURSOR_SPAN
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

function commandStatus(text, color) {
  let p = document.querySelector('#vim');
  p.style.color = color;
  p.style['background-color'] = cssGetVar('--my-background-color');
  p.textContent = text;
  setTimeout(() => {
    p.style.color = '';
    if (!listening) {
      p.textContent = '';
      p.style.removeProperty('background-color');
    }
  }, status_timeout);
}

function commandError(cmd, reason) {
  commandStatus(`Error!: ${cmd}: ${reason}`, '#f00');
  return false;
}

function commandSucceed(msg) {
  commandStatus(`Success: ${msg}`, cssGetVar('--my-green-color'));
  return true;
}

function loadDarkModeDefaults() {
  let codes = document.getElementsByClassName('my-code');

  cssSetVar("--my-green-color", "#32CD32");
  cssSetVar("--my-dark-accent-color", "darkgreen");
  cssSetVar("--my-link-visited-color", "#2E8B57");
  cssSetVar("--my-link-hover-color", "#e2e2e2");
  cssSetVar("--button-background-color", "rgb(24, 24, 24)");
  cssSetVar("--progPage-color", "white");
  cssSetVar("--projectContainer-color", "white");
  cssSetVar("--my-background-color", "rgb(24, 24, 24)");
  cssSetVar("--my-caption-background-color", "rgb(48, 48, 48)");
  for (let code of codes) {
    code.style.setProperty('background-color', 'rgb(51, 51, 51)');
  }
}

function loadLightModeDefaults() {
  let codes = document.getElementsByClassName('my-code');

  cssSetVar("--my-green-color", "rgb(47, 163, 47)");
  cssSetVar("--my-dark-accent-color", "darkgreen");
  cssSetVar("--my-link-visited-color", "#2E8B57");
  cssSetVar("--my-link-hover-color", "#00ff00");
  cssSetVar("--button-background-color", "rgb(240, 238, 238)");
  cssSetVar("--progPage-color", "black");
  cssSetVar("--projectContainer-color", "black");
  cssSetVar("--my-background-color", "#fefefe");
  cssSetVar("--my-caption-background-color", "#f3f3f3");
  for (let code of codes) {
    code.style.setProperty('background-color', 'rgb(230, 230, 230)');
  }
}

function resetColorScheme() {
  let query = '(prefers-color-scheme: dark)';
  let matches = matchMedia(query).matches;
  localStorage.setItem(LS_DARK_SET, matches);
  if (matches) {
    loadDarkModeDefaults();
    localStorage.setItem(LS_ACCENT_COLOR, "darkgreen");
    changeImageColor("32CD32")
    localStorage.setItem(LS_MAIN_COLOR, "#32CD32");
    localStorage.setItem(LS_TEXT_COLOR, 'white');
  } else {
    loadLightModeDefaults();
    localStorage.setItem(LS_MAIN_COLOR, "#2fa32f");
    changeImageColor("2fa32f")
    localStorage.setItem(LS_ACCENT_COLOR, "darkgreen");
    localStorage.setItem(LS_TEXT_COLOR, 'black');
  }
  savedDark = matches;
  return true;
}


function changeColorScheme() {
  // // if no preference for color scheme exists, we are using
  // // media query so default to that
  if (lsd === null) {
    savedDark = matchMedia('(prefers-color-scheme: dark)').matches;
    lsd = savedDark;
  }

  if (!savedDark) {
    // dark properties
    loadDarkModeDefaults();
    let main = localStorage.getItem(LS_MAIN_COLOR);
    let accent = localStorage.getItem(LS_ACCENT_COLOR);
    let text = localStorage.getItem(LS_TEXT_COLOR);
    if (!text || text == '#000') {
      text = '#fff';
      localStorage.setItem(LS_TEXT_COLOR, text);
    }
    cssSetVar('--my-green-color', main);
    cssSetVar('--my-dark-accent-color', accent);
    cssSetVar('--progPage-color', text);
  } else {
    // light properties
    loadLightModeDefaults();
    let main = localStorage.getItem(LS_MAIN_COLOR);
    let accent = localStorage.getItem(LS_ACCENT_COLOR);
    let text = localStorage.getItem(LS_TEXT_COLOR);
    if (!text || text == '#fff') {
      text = '#000';
      localStorage.setItem(LS_TEXT_COLOR, text);
    }
    cssSetVar('--my-green-color', main);
    cssSetVar('--my-dark-accent-color', accent);
    cssSetVar('--progPage-color', text);
  }
  savedDark = !savedDark;
  localStorage.setItem(LS_DARK_SET, savedDark);
}

function cssGetVar(v) {
  let root = document.documentElement;
  let value = getComputedStyle(root).getPropertyValue(v);
  return value;
}

function cssSetVar(k, v) {
  let root = document.documentElement;
  root.style.setProperty(k, v);
}

function toggleLigatures() {
  let body = document.body;
  if (!ligatures)
    body.style['font-variant'] = 'common-ligatures';
  else
    body.style['font-variant'] = '';
  ligatures = !ligatures;
}

function executeAction() {
  let p = document.querySelector('#vim');
  let input = p.textContent.substring(0, p.textContent.length - 1);
  input = input.trim();
  let parts = input.split(/\s+/g);
  let command = parts[0];
  let args = parts.slice(1);
  commandHistory.pushCommand(input);
  switch (command) {
    case 'lt': {
      toggleLigatures();
      return commandSucceed('Toggled Ligatures!');
    }
    case 'gsto':
      return commandSucceed(`Status timeout is ${status_timeout / 1000} seconds`);
    case 'gtc':
      return commandSucceed(`Text color is ${cssGetVar('--progPage-color')}`);
    case 'gmc':
      return commandSucceed(`Main color is ${cssGetVar('--my-green-color')}`);
    case 'gac':
      return commandSucceed(`Accent color is ${cssGetVar('--my-dark-accent-color')}`);
    case 'ssto': {
      let timeoutInput = args[0];
      let timeout = Number(timeoutInput);
      if (isNaN(timeout) || timeout < 1 || timeout > 120000) {
        return commandError(`Timeout value ${timeoutInput} is invalid. Enter a number between 1 and 120000`);
      }
      status_timeout = timeout * 1000;
      localStorage.setItem(LS_STATUS_TIMEOUT, status_timeout);
      return commandSucceed(`Timeout set to ${timeout} seconds`);
    }
    case 'stc': {
      let color = args[0];
      if (!color.startsWith('#') || (color.length != 4 && color.length != 7)) {
        return commandError('Provide a color that is `#RGB` or `#RRGGBB`')
      }
      cssSetVar('--progPage-color', color);
      localStorage.setItem(LS_TEXT_COLOR, color);
      return commandSucceed(`Set text color to ${color}`);
    }
    case 'smc': {
      let color = args[0];
      if (!color.startsWith('#') || (color.length != 4 && color.length != 7)) {
        return commandError('Provide a color that is `#RGB` or `#RRGGBB`')
      }
      cssSetVar('--my-green-color', color);
      changeImageColor(color);
      localStorage.setItem(LS_MAIN_COLOR, color);
      return commandSucceed(`Set main color to ${color}`);
    }
    case 'sac': {
      let color = args[0];
      if (!color.startsWith('#') || (color.length != 4 && color.length != 7)) {
        return commandError('Provide a color that is `#RGB` or `#RRGGBB`')
      }
      cssSetVar('--my-dark-accent-color', color);
      localStorage.setItem(LS_ACCENT_COLOR, color);
      return commandSucceed(`Set accent color to ${color}`);
    }
    case 'cf': {
      let choice = args.join(" ");
      setCustomFontDev(choice);
      commandSucceed(`Attempted to update font family to ${choice}.`);
      return true;
    }
    case 'f': {
      let result = setFontFromChoice(args[0]);
      if (!result) {
        commandError(`Invalid choice for font: ${args[0]}`);
      } else {
        commandSucceed('Successfully updated font preference');
      }
      return result;
    }
    case 'tdm':
      changeColorScheme();
      commandSucceed('Changed color scheme');
      return true;
    case 'rcs':
      resetColorScheme();
      commandSucceed(`Reset color scheme default colors and mode`);
      return true;
    case 'cls':
      commandSucceed('Cleared localStorage');
      localStorage.clear();
      return true;
    case '?':
      commandSucceed('Going to help');
      window.location = '/vimhelp.html';
      return true;
    case '->c':
      commandSucceed('Going to color picker');
      window.location = '/projects/color-picker/'
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
  // They are loaded with the Google and TypeKit WebFontLoader by calling WebFont.load(.loaderObject)
  'um': { familyName: "Ubuntu Mono", loaded: false, loaderObject: { google: { families: ['Ubuntu Mono:400,400i,700,700i'] } } },
  'scp': { familyName: "Source Code Pro", loaded: false, loaderObject: { google: { families: ['Source Code Pro:400,400i,700,700i'] } } },
  'sm': { familyName: "Space Mono", loaded: false, loaderObject: { google: { families: ['Space Mono:400,400i,700,700i'] } } },
  'i': { familyName: "Inconsolata", loaded: false, loaderObject: { google: { families: ['Inconsolata:400,400i,700,700i'] } } },
  'crpr': { familyName: "Courier Prime", loaded: false, loaderObject: { google: { families: ['Courier Prime:400,400i,700,700i'] } } },
  'fs': { familyName: "Fontdiner Swanky", loaded: false, loaderObject: { google: { families: ['Fontdiner Swanky:400,400i,700,700i'] } } },
  'ua': { familyName: "Uncial Antiqua", loaded: false, loaderObject: { google: { families: ['Uncial Antiqua:400,400i,700,700i'] } } },
  'samt': { familyName: "Sacramento", loaded: false, loaderObject: { google: { families: ['Sacramento:400,400i,700,700i'] } } },
  'se': { familyName: "Special Elite", loaded: false, loaderObject: { google: { families: ['Special Elite:400,400i,700,700i'] } } }
};

function setCustomFontDev(choice) {
  if (!choice) return;
  localStorage.setItem(LS_FONT_CHOICE_NAME, choice);
  changeMainFontFamily(choice);
}

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

  changeMainFontFamily(fontObject.familyName);
  return true;
}

function changeMainFontFamily(toFamily) {
  let root = document.documentElement;
  root.style.setProperty(MY_MAIN_FONT_VAR, toFamily);
}

let listening = false;

function trimCursorText(text) {
  return text.replace('\u258A', '');
}

function vimHandle() {
  let bodies = document.getElementsByTagName('body');
  for (let body of bodies) {
    body.onkeydown = function (event) {
      let p = document.querySelector('#vim');
      if (event.keyCode === 27 || (!listening && event.keyCode == 84) ||
        (!listening && event.keyCode == 191)) {
        listening = !listening;
        commandHistory.resetPosition();
        if (listening) {
          p.innerHTML = CURSOR_SPAN;
        } else {
          p.innerHTML = '';
        }
      } else if (listening) {
        if (event.keyCode === 86 && event.ctrlKey) {
          navigator.clipboard.readText().then((text) => {
            p.innerHTML = `${trimCursorText(p.textContent)}${text}${CURSOR_SPAN}`;
          });
        } else if (event.keyCode === 13) {
          listening = false;
          commandHistory.resetPosition();
          executeAction();
        } else if (event.keyCode == 8) {
          p.textContent = p.textContent.substring(0, p.textContent.length - 2);
          p.innerHTML += CURSOR_SPAN;
        } else if (event.keyCode == 38) {
          let cmd = commandHistory.previousCommand();
          if (cmd != null)
            p.innerHTML = `${cmd}${CURSOR_SPAN}`;
        } else if (event.keyCode == 40) {
          let cmd = commandHistory.nextCommand();
          if (cmd != null)
            p.innerHTML = `${cmd}${CURSOR_SPAN}`;
        }
        else {
          if (event.key.length != 1) {
            return;
          }
          let p = document.querySelector('#vim');
          p.textContent = p.textContent.substring(0, p.textContent.length - 1) + event.key;
          p.innerHTML = p.innerHTML + CURSOR_SPAN;
        }
        event.preventDefault();
      }
    }
  }
}

function reloadFontChoice() {
  let choice = localStorage.getItem(LS_FONT_CHOICE_NAME);
  if (choice) {
    let result = setFontFromChoice(choice)
    if (!result) {
      // attempt to set font-family name directly
      changeMainFontFamily(choice);
    }
  }
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

function loadCustomColors() {
  let main = localStorage.getItem(LS_MAIN_COLOR);
  let accent = localStorage.getItem(LS_ACCENT_COLOR);
  let text = localStorage.getItem(LS_TEXT_COLOR);
  console.log(text);
  cssSetVar('--my-green-color', main);
  cssSetVar('--my-accent-color', accent);
  cssSetVar('--progPage-color', text);
  changeImageColor(main);
}

function loadBrightnessPreference() {
  const mediaMatchesDark = matchMedia('(prefers-color-scheme: dark)').matches;
  // lsd checks to see if anything is set in localStorage
  // if no preference is recorded don't change the color scheme, since
  // the page is already responding to (prefers-color-scheme: )
  // only if there is an explicit override AND it does not match the media query
  // should we change
  if (!lsd) return;
  if (savedDark) {
    loadDarkModeDefaults();
  } else {
    loadLightModeDefaults();
  }
}

function hexstringToRGBColor(string) {
  if (string.startsWith('#')) {
    string = string.substring(1);
  }
  if (string.length == 3) {
    return {
      red: parseInt(string.charAt(0) + string.charAt(0), 16),
      green: parseInt(string.charAt(1) + string.charAt(1), 16),
      blue: parseInt(string.charAt(2) + string.charAt(2), 16)
    }
  } else if (string.length == 6) {
    return {
      red: parseInt(string.substring(0, 2), 16),
      green: parseInt(string.substring(2, 4), 16),
      blue: parseInt(string.substring(4, 6), 16)
    }
  } else {
    throw new Error(`Invalid hexstring: ${string}`);
  }
}

function normalizeRGBColor({ red, green, blue }) {
  return { red: red / 255, blue: blue / 255, green: green / 255 }
}

function rgbColorToHSBColor({ red, green, blue }) {
  /*
   * Formulas for this conversion were taken from the Wikipedia
   * Page https://en.wikipedia.org/wiki/HSL_and_HSV
   */

  let normalized = normalizeRGBColor({ red, green, blue });
  red = normalized.red;
  green = normalized.green;
  blue = normalized.blue;

  let M = Math.max(red, green, blue);
  let m = Math.min(red, green, blue);

  let C = M - m;

  let h;
  if (C == 0) {
    h = 0;
  } else if (M == red) {
    h = ((green - blue) / C) % 6;
  } else if (M == green) {
    h = ((blue - red) / C) + 2;
  } else if (M == blue) {
    h = ((red - green) / C) + 4;
  }
  h = 60 * h;

  let l = (M + m) / 2;
  let b = M;
  let s = (l == 0 || l == 1) ? 0 : (C / (1 - Math.abs(2 * l - 1)))

  return { hue: h, saturation: s, brightness: b };
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
      button.onmouseenter = () => { button.wheel = true; doColorWheel(button); }
      button.onmouseout = () => { button.wheel = false; button.style.filter = ''; }
    }
  }
}

function run_common_before_type() {
  reloadFontChoice();
  loadBrightnessPreference();
  loadCustomColors();
  setDateBasedClass();
  status_timeout = Number(localStorage.getItem(LS_STATUS_TIMEOUT)) || 3500;
  window.onorientationchange = function (event) {
    console.log(event);
    alert("motion");
  };
}

function run_common_after_type() {
  fade();
  cursorFade();
  vimHandle();
}
