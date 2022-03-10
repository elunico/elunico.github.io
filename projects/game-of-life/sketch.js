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
let chanceSlider;
let compressOpt;
let chanceSpan;
let darkMode = false;
let live = darkMode ? 255 : 0;
let dead = darkMode ? 0 : 255;

let running = false;
let initialState = [];

function tableToRawString(data) {
  let s = ''
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      s += data[i][j];
    }
  }
  return s;
}

function doSaveTransform(data) {
  if (compressOpt && !compressOpt.checked()) {
    console.info("User opted for no compression.");
    let s = tableToRawString(data);
    return 'r\n' + s;
  } else {
    let transformed = compress_board(data);
    console.log(`new-compress.js: new length ${transformed.length}; ratio: ${Math.floor(100 - (transformed.length/25))}%`); /// transformed.length / 2500 * 100
    return 'n\n' + transformed;
  }
}

function doLoadTransform(ind) {
  let [format, ...data] = ind.split("\n");
  if (data.length === 1) {
    alert("Sorry! Old-style save files are no longer supported :(");
    return null;
  }
  if (format === 'r') {
    data = data.join('');
    let result = [];
    for (let i = 0; i < 50; i++) {
      let col = [];
      for (let j = 0; j < 50; j++) {
        col.push(Number(data[j + i * 50]));
      }
      result.push(col);
    }
    return result;
  } else {
    let a = decompress_board(data.join('\n'));
    console.log(a);
    return a;
  }
}

function newRandomState() {
  for (let i = 0; i < cols; i++) {
    initialState[i] = [];
    for (let j = 0; j < rows; j++) {
      if (random() < Number(chanceSlider && chanceSlider.value() || 0.25)) {
        initialState[i][j] = 1;
        life.biofy(i, j);
      } else {
        initialState[i][j] = 0;
        life.kill(i, j);
      }
    }
  }
}

function setup() {
  let canvas = createCanvas(Math.min(windowWidth - 100, windowHeight - 200), Math.min(windowWidth - 100, windowHeight - 200));
  canvas.parent(canvas_container);
  life = new Life(cols, rows, true);
  wscl = width / cols;
  hscl = height / rows;

  newRandomState();

  let controls = select("#controls");

  toggleOnButton = createButton('Start');
  toggleOnButton.parent(controls);
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
  stepButton.parent(controls);
  stepButton.mousePressed(() => {
    life.step();
    redraw();
  });

  clearButton = createButton('Clear');
  clearButton.parent(board_change);
  clearButton.mousePressed(() => {
    life.clear();
  });

  randomizeButton = createButton('Randomize');
  randomizeButton.parent(board_change);
  randomizeButton.mousePressed(() => {
    newRandomState();
  });

  chanceSpan = createSpan('Chance of living cell');
  chanceSpan.parent(board_change);


  chanceSlider = createSlider(0, 1, 0.25, 0.01);
  chanceSlider.parent(chanceSpan);
  chanceSlider.input(() => {
    newRandomState();
  })

  compressOpt = createCheckbox("Compress?");
  compressOpt.checked(true);
  compressOpt.parent(save_states);

  saveInitialButton = createButton('Save Last Start State');
  saveInitialButton.parent(save_states);
  saveInitialButton.mousePressed(() => {
    // the way `save` works in p5 requires us to pass the string in an array
    save([doSaveTransform(initialState)], 'init-state.txt');
  });

  saveCurrentButton = createButton('Save Current State');
  saveCurrentButton.parent(save_states);
  saveCurrentButton.mousePressed(() => {
    // the way `save` works in p5 requires us to pass the string in an array

    save([doSaveTransform(life.board)], 'life-state.txt');
  });



  loadGliderButton = createButton('Load Glider State');
  loadGliderButton.parent(save_states);
  loadGliderButton.mousePressed(() => {
    loadJSON('glider.json', function (data) {
      life.setState(data);
    });
  });

  let p = createP("Load State from JSON &nbsp;");
  p.parent(save_states)

  stateInput = createFileInput(loadState);
  stateInput.parent(p);
}

function loadState(file) {
  try {
    let loaded = doLoadTransform(file.data)
    if (loaded !== null)
      life.setState(loaded);
  } catch (e) {
    alert(`Sorry, that save file could not be read: ${e}`);
  }
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
