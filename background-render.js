let body = document.body;
let html = document.documentElement;

// let pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
let pageHeight = window.innerHeight;

async function randomBinaryString() {
  return Array(12000).fill().map(() => (Math.random() < 0.55) ? '0' : '1').join('');
}

async function fillBackground() {
  return randomBinaryString().then(text => {
    const background = document.querySelector('.bg');
    background.textContent = text;

    let count = 0;
    while (true) {
      let rects = background.getClientRects();
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
