let life;
const cols = 50;
const rows = 50;

let wscl;
let hscl;

let toggleOnButton;
let stepButton;
let clearButton;
let saveInitialButton;
let saveCurrentButton;
let stateInput;
let loadGliderButton;
let darkMode = false;
let live = darkMode ? 255 : 0;
let dead = darkMode ? 0 : 255;

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
      initialState = JSON.parse(JSON.stringify(life.board));
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

  saveInitialButton = createButton('Save Last Start State');
  saveInitialButton.mousePressed(() => {
    save(initialState, 'init-state.json');
  });

  saveCurrentButton = createButton('Save Current State');
  saveCurrentButton.mousePressed(() => {
    save(life.board, 'life-state.json');
  });

  loadGliderButton = createButton('Load Glider State');
  loadGliderButton.mousePressed(() => {
    loadJSON('glider.json', function(data) {
      life.setState(data);
    });
  });

  let p = createP("Load State from JSON &nbsp;");

  stateInput = createFileInput(loadState);
  stateInput.parent(p);
}

function loadState(file) {
  life.setState(file.data);
  stateInput.elt.value = '';
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
        fill(live);
      } else {
        fill(dead);
      }
      rect(i * wscl, j * hscl, wscl, hscl);
    }
  }

}
