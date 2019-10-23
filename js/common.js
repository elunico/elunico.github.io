function typeText(text, selector, then, period) {
  period = period || 2;
  let index = 0;
  let elt = document.querySelector(selector);

  // place tmux on screen first
  tmuxStart();

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

function fade() {
  let elts = document.querySelectorAll('.fadesIn');
  for (let elt of elts) {
    elt.style.opacity = 1.0;
  }
}

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
let ctrlPushed = false;
let tmuxEscape = false;
function vimHandle() {

  let bodies = document.getElementsByTagName('body');
  for (let body of bodies) {
    body.onkeydown = function (event) {
      if (event.keyCode === 17) {
        ctrlPushed = true;
      } else if (ctrlPushed) {
        if (event.keyCode === 66) {
          tmuxEscape = true;
        } else if (tmuxEscape) {
          if (event.keyCode - 49 >= 0 && event.keyCode - 49 < 5) {
            console.log('shortcut activated');
            let page = Object.keys(pages)[event.keyCode - 49];
            console.log(`Going to ${page}`);
            window.location = page;
          } else if (event.keyCode === 67) {
            window.open('https://github.com/tmux/tmux');
          }
        } else {
          tmuxEscape = false;
          ctrlPushed = false;
        }

      } else {
        ctrlPushed = false;
      }
      if (ctrlPushed) {
        if (event.keyCode - 49 >= 0 && event.keyCode - 49 < 5) {
          console.log('shortcut activated');
          let page = Object.keys(pages)[event.keyCode - 49];
          console.log(`Going to ${page}`);
          window.location = page;
        }
      }
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
      }
    }
  }
}

const pages = {
  '/': '1:Home',
  '/progproj.html': '2:Programming',
  '/langproj.html': '3:Linguistics',
  '/info.html': '4:Info &amp; Contact',
  '/vimhelp.html': '5:VIM Info'
};


function tmuxStart() {

  time = new Date().toLocaleTimeString();

  const names = [
    '1:Home',
    '2:Programming',
    '3:Linguistics',
    '4:Info &amp; Contact',
    '5:VIM Info'
  ];


  let rightSpan = `<span id="tmux-span-right">(ctrl, b) | ${time} </span>`
  let openTabs = '';
  let path = window.location.pathname;
  let pageNo = 0;
  for (let i = 0; i < names.length; i++) {
    let name = names[i];
    if (pages[path] == name) {
      pageNo = i + 1;
    }
    openTabs += `&nbsp;${name}&nbsp;`

  }

  document.querySelector('#tmux').innerHTML = `<span id="tmux-span-left">[${pageNo}]&nbsp;${openTabs} </span>${rightSpan}`;

  requestAnimationFrame(() => {
    tmuxStart();
  });

}


function run_common() {
  cursorFade();
  vimHandle();
}
