let life;
const cols = 50;
const rows = 50;

let wscl;
let hscl;

let toggleOnButton;
let stepButton;
let clearButton;
let saveInitialButton;
let stateInput;

let running = false;
let initialState = [];

function setup() {
  createCanvas(Math.min(windowWidth - 100, windowHeight - 200), Math.min(windowWidth - 100, windowHeight - 200));
  life = new Life(cols, rows, true);
  wscl = width/cols;
  hscl = height/rows;

  for (let i = 0; i < cols; i++) {
    initialState[i] = [];
    for (let j = 0; j < rows; j++) {
      if (random() < 0.25) {
        initialState[i][j] = 1;
        life.biofy(i, j);
      } else {
        initialState[i][j] = 0;
      }
    }
  }

  toggleOnButton = createButton('Start');
  toggleOnButton.mousePressed(() => {
    running = !running;
    if (running) {
      toggleOnButton.html('Stop');
      stepButton.elt.setAttribute('disabled', 'true');
    } else {
      toggleOnButton.html('Start');
      stepButton.elt.removeAttribute('disabled');
    }
  });

  stepButton = createButton("Step");
  stepButton.mousePressed(() => {
    life.step();
    redraw();
  });

  clearButton = createButton('Clear');
  clearButton.mousePressed(() => {
    life.clear();
  });

  saveInitialButton = createButton('Save Initial State');
  saveInitialButton.mousePressed(() => {
    save(initialState, 'init-state.json');
  });

  let p = createP("Load Initial State &nbsp;");

  stateInput = createFileInput(loadState);
  stateInput.parent(p);
}

function loadState(file) {
  print(file.data)
  life.setState(file.data);
}

function mousePressed() {
  let i = Math.floor(mouseX / wscl);
  let j = Math.floor(mouseY / hscl);

  life.toggle(i, j);
}


function draw() {
  if (running) {
    life.step();
  }

  if (mouseIsPressed) {
    let i = Math.floor(mouseX / wscl);
    let j = Math.floor(mouseY / hscl);

    let pi = Math.floor(pmouseX / wscl);
    let pj = Math.floor(pmouseY / hscl);

    if (!(pi == i && pj == j)) {
      life.toggle(i, j);
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (life.get(i, j)) {
        fill(0);
      } else {
        fill(255);
      }
      rect(i * wscl, j * hscl, wscl, hscl);
    }
  }

}
