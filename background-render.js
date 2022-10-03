let body = document.body;
let html = document.documentElement;

// let pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
let pageHeight = window.innerHeight;

async function randomBinaryString() {
  return Array(12000).fill().map(() => (Math.random() < 0.55) ? '0' : '1').join('');
}

function skipper() {
  let background = document.getElementsByClassName('bg')[0];
  console.log(background);
  if (background) {
    document.body.removeChild(background);
  }
  window.location = '/#main'
}

async function fillBackground() {
  return randomBinaryString().then(text => {
    const skipper = document.createElement('a');
    skipper.textContent = 'Skip Navigation';
    skipper.classList.add('skip-nav');
    skipper.setAttribute('tabindex', '1');
    skipper.href = 'javascript:skipper()'
    document.body.prepend(skipper);

    const background = document.createElement('div');
    background.setAttribute('aria-hidden', "true");
    background.classList.add('bg');
    background.textContent = text;
    document.body.appendChild(background);

    let count = 0;
    while (true) {
      let rects = background.getClientRects();
      console.log(rects);
      if (rects.length <= 0) {
        break;
      }
      let rect = rects[0];
      let height = rect.height;
      if (height >= pageHeight) {
        break;
      }
      if (count === 10) {
        // too much text, but don't leave it incomplete
        background.textContent = '';
        break;
      }
      console.log("Adding more!");
      background.textContent += text;
      count++;
    }

    const remover = document.createElement('button');
    remover.innerHTML = '<span>Remove Background</span>'
    remover.id = 'remove-button';
    remover.onclick = event => document.body.removeChild(background) && document.body.removeChild(remover);
    document.body.appendChild(remover)
  });
}

fillBackground().then(() => console.log("Backgrounded"));

let currentHeight = window.innerHeight;
let currentWidth = window.innerWidth;
let eventRunning = false;

window.addEventListener('resize', event => {
  if (eventRunning) return;

  if ((window.innerHeight * window.innerWidth) > (currentHeight * currentWidth)) {
    eventRunning = true;
    currentHeight = window.innerHeight;
    currentWidth = window.innerWidth;
    fillBackground().then(() => {
      console.log("Backgrounded");
      eventRunning = false;
    });
  }
});
