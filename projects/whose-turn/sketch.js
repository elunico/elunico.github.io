
class Confetti {
  constructor(x, y, vx, vy, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.r1 = random(5, 10);
    this.r2 = random(5, 10);
  }

  update() {

    this.vy += 0.1;
    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.r1, this.r2);
  }
}

let confetti = [];
let fanfare;
let millisStart = null;
let shown = false;
let count;

function preload() {
  fanfare = loadSound('fanfare.mp3');
}

function mousePressed() {
  if (millisStart) { return; }
  millisStart = millis();
  fanfare.play();

  const message = document.querySelector('h2');
  message.style.display = 'none';
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < 700; i++) {
    confetti.push(
      new Confetti(
        random(0, width),
        random(height, height + 2),
        random(-3, 3),
        random(-15, -10),
        color(random(255), random(255), random(255))
      )
    );
  }

  const beginningOfTime = new Date(2022, 2, 17, 11, 59, 59).getTime();
  const players = ['Potato', 'Tomato'];
  const icons = ['🥔', '🍅'];

  const elapsed = new Date().getTime() - beginningOfTime;
  const daysPassed = Math.floor(elapsed / (1000 * 60 * 60 * 24));
  console.log(daysPassed);

  const icon = icons[daysPassed % players.length];
  const whoSpan = document.getElementById('who');
  whoSpan.textContent = `${icon}'s`;


}

function draw() {
  clear();


  if (!millisStart || millis() < millisStart + 7700) {
    return;
  } else if (!shown) {
    shown = true;
    document.querySelector('h1').style.opacity = 1;
  }


  for (let i = confetti.length - 1; i >= 0; i--) {
    confetti[i].update();
    confetti[i].draw();

    if (confetti[i].y > height * 1.5) {
      confetti.splice(i, 1);
    }
  }

}
