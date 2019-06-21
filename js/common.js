
function typeText(text, selector, then, timeout) {
  let index = 0;
  let elt = document.querySelector(selector);
  let interval = setInterval(() => {
    elt.innerHTML = text.substring(0, index++) + '<span class="cursor">&#x258A;</span>'
    if (index > text.length) {
      setTimeout(() => {
        clearInterval(interval);
        then();
      }, 60);
    }
  }, timeout || 60);
}

setInterval(() => {
  let cursors = document.querySelectorAll('.cursor');
  for (let cursor of cursors) {
    cursor.style.opacity = 1 - Number(cursor.style.opacity);
  }
}, 750);

function buttonFade() {
  let buttons = document.querySelectorAll('.button');
  console.log(buttons);
  for (let b of buttons) {
    b.style.opacity = 1.0;
  }
}

// VIMPLEMENTATION

const sectionSize = 1000;
const pageSize = 100000;

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

function executeAction() {
  let p = document.querySelector('#vim');
  let char = p.textContent.substring(0, p.textContent.length - 1);
  console.log(char);
  switch (char) {
    case ']]':
      window.scrollBy(0, sectionSize);
      return true;
    case '[[':
      window.scrollBy(0, -sectionSize);
      return true;
    case 'G':
      window.scrollBy(0, pageSize);
      return true;
    case 'gg':
      window.scrollBy(0, -pageSize);
      return true;
    case ':q':
      commandError(char, 'file not saved!');
      return false;
    case ':q!':
      window.location = 'http://google.com';
      return true;
    default:
      commandError(char, 'UNKNOWN COMMAND!');
      return false;
  }
}

let listening = false;

let bodies = document.getElementsByTagName('body');
for (let body of bodies) {
  body.onkeydown = function (event) {
    // console.log(event);
    console.log(listening);
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
        if (executeAction()) {
          let p = document.querySelector('#vim');
          p.textContent = '';
        }
      } else if (event.keyCode == 8) {
        let p = document.querySelector('#vim');
        p.textContent = p.textContent.substring(0, p.textContent.length - 2);
        p.innerHTML += '<span class="cursor">&#x258A;</span>';
      } else {
        if (event.key.length != 1) {
          return;
        }
        let p = document.querySelector('#vim');
        console.log(p.textContent);
        p.textContent = p.textContent.substring(0, p.textContent.length - 1) + event.key;
        p.innerHTML = p.innerHTML + '<span class="cursor">&#x258A;</span>';
      }
    }
  }
}
