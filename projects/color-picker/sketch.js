let brightnessSlider;
let redSlider;
let blueSlider;
let greenSlider;

let clr;
let img;
let dotPlace;

let resultDiv;
let resultCob;
let resultCow;
let resultWoc;
let resultBoc;

let hexResult;
let threeResult;

let startedInCanvas = false;

const pangrams = [
  "Jived fox nymph grabs quick waltz.",
  "Glib jocks quiz nymph to vex dwarf.",
  "Sphinx of black quartz, judge my vow.",
  "How vexingly quick daft zebras jump!",
  "The five boxing wizards jump quickly.",
  "Pack my box with five dozen liquor jugs."
];

function setUpInputEventHandlers() {

  function updateGUIFromRGB(r, g, b) {
    /**
     * Given some r, g, b (0-255) this function
     * updates all 4 sliders and the dot on the canvas
     * as well as tinting the image for brightness.
     * It does NOT update the hex result or rgb result
     * input since those two cannot be circular they must
     * be handled separated.
     */
    colorMode(RGB);
    clr = color(r, g, b);
    redSlider.value(r);
    greenSlider.value(g);
    blueSlider.value(b);
    colorMode(HSB);
    brightnessSlider.value(brightness(clr));
    let h = hue(clr);
    let s = saturation(clr);
    let br = brightness(clr);
    tint(brightness(clr));
    dotPlace = createVector(hue(clr), saturation(clr));
  }

  function updateGUIFromHSB(h, s, b) {
    /**
     * Given some h, s, b (0-255, 0-100, 0-100) this function
     * updates all 4 sliders and the dot on the canvas
     * as well as tinting the image for brightness.
     * It does NOT update the hex result or rgb result
     * input since those two cannot be circular they must
     * be handled separated.
     */
    colorMode(HSB);
    clr = color(h, s, b);
    tint(b);
    colorMode(RGB);
    redSlider.value(red(clr));
    greenSlider.value(green(clr));
    blueSlider.value(blue(clr));
    dotPlace = createVector(h, s);
  }

  function rgbSliderOnInput() {
    /**
     * Callback for the `input` event of all 3 RGB sliders
     */
    updateGUIFromRGB(redSlider.value(), greenSlider.value(), blueSlider.value());
    colorMode(RGB);
    threeResult.value(`rgb(${nf(red(clr), 1, 0)}, ${nf(green(clr), 1, 0)}, ${nf(blue(clr), 1, 0)})`);
    hexResult.value(`#${nf(floor(red(clr)).toString(16), 2, 0)}${nf(floor(green(clr)).toString(16), 2, 0)}${nf(floor(blue(clr)).toString(16), 2, 0)}`);
  }

  hexResult.input(() => {
    // we support both #abc 3 digit and #aabbcc 6 digit colors
    let s = hexResult.value();
    if (s.length !== 4 && s.length !== 7) {
      return;
    }

    var r, g, b;
    if (s.length == 7) {
      r = s.substring(1, 3);
      g = s.substring(3, 5);
      b = s.substring(5, 7);
    } else if (s.length == 4) {
      r = s.charAt(1);
      g = s.charAt(2);
      b = s.charAt(3);
    }
    r = parseInt(r, 16);
    g = parseInt(g, 16);
    b = parseInt(b, 16);

    if (s.length == 4) {
      r = (r << 4) | r;
      g = (g << 4) | g;
      b = (b << 4) | b;
    }

    updateGUIFromRGB(r, g, b);
    colorMode(RGB);
    threeResult.value(`rgb(${nf(red(clr), 1, 0)}, ${nf(green(clr), 1, 0)}, ${nf(blue(clr), 1, 0)})`);
  });

  threeResult.input(() => {
    // supports any deliminated list of 3 colors but always outputs in the form rgb(r, g, b)
    let s = threeResult.value();
    let parts = s.split(/(\d+)/g).filter(s => /\d+/.test(s)).map(s => Number(s));
    if (parts.length != 3) {
      return;
    }

    let [r, g, b] = parts;

    updateGUIFromRGB(r, g, b);
    colorMode(RGB);
    hexResult.value(`#${nf(floor(red(clr)).toString(16), 2, 0)}${nf(floor(green(clr)).toString(16), 2, 0)}${nf(floor(blue(clr)).toString(16), 2, 0)}`);
  });

  brightnessSlider.input(() => {
    colorMode(HSB);
    updateGUIFromHSB(hue(clr), saturation(clr), brightnessSlider.value());
    colorMode(RGB);
    threeResult.value(`rgb(${nf(red(clr), 1, 0)}, ${nf(green(clr), 1, 0)}, ${nf(blue(clr), 1, 0)})`);
    hexResult.value(`#${nf(floor(red(clr)).toString(16), 2, 0)}${nf(floor(green(clr)).toString(16), 2, 0)}${nf(floor(blue(clr)).toString(16), 2, 0)}`);
  });

  redSlider.input(rgbSliderOnInput);
  greenSlider.input(rgbSliderOnInput);
  blueSlider.input(rgbSliderOnInput);
}

function preload() {
  img = loadImage('all-colors.png');
}

function setup() {
  // selecting necessary elements
  let container = select('#canvas-container');
  canvas = createCanvas(365, 165);
  canvas.parent(container);

  brightnessSlider = select('#brightness-input');
  redSlider = select('#red-input');
  greenSlider = select('#green-input');
  blueSlider = select('#blue-input');

  hexResult = select('#hex-result');
  threeResult = select('#3-result');

  // create handlers for updating GUI
  setUpInputEventHandlers();

  // simplifies pixel calculations
  pixelDensity(1);

  // get the initial color from the state of the sliders.
  colorMode(HSB);
  clr = color(redSlider.value(), greenSlider.value(), blueSlider.value());
  brightnessSlider.value(brightness(clr));
  dotPlace = createVector(hue(clr), saturation(clr));

  // update entire gui by firing a single input event on any elt
  blueSlider.elt.dispatchEvent(new Event('input', {
    bubbles: true,
    cancelable: true,
  }));

  // resulting color will be displayed here
  resultDiv = select('#colorDiv');
  resultCob = select('#color-on-black');
  resultCow = select('#color-on-white');
  resultWoc = select('#white-on-color');
  resultBoc = select('#black-on-color');

  // choose a pangram for sample text
  let pangram = random(pangrams);
  let samples = selectAll('.sample');
  for (let sample of samples) {
    sample.html(pangram);
  }

  select('#colorDiv').html('&nbsp;');
}

function idx(x, y) {
  /**
   * Given some x, y in pixel space, return the index
   * into the pixels array of the r value.
   * The pixel array is 4 * width * height because
   * it stores one pixel as rgba values across 4 indices
   */
  return (x + y * width) * 4;
}

function mouseDragged() {
  if (startedInCanvas) {
    // prevent dragging into the canvas from changing the color
    mousePressed();
  }
}

function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY > height || mouseY < 0) {
    startedInCanvas = false;
    return;
  }
  startedInCanvas = true;
  dotPlace = createVector(mouseX, mouseY);
  colorMode(HSB);
  clr = color(mouseX, mouseY, brightnessSlider.value());
  brightnessSlider.value(brightness(clr));
  colorMode(RGB)
  redSlider.value(red(clr));
  greenSlider.value(green(clr));
  blueSlider.value(blue(clr));
  threeResult.value(`rgb(${nf(red(clr), 1, 0)}, ${nf(green(clr), 1, 0)}, ${nf(blue(clr), 1, 0)})`);
  hexResult.value(`#${nf(floor(red(clr)).toString(16), 2, 0)}${nf(floor(green(clr)).toString(16), 2, 0)}${nf(floor(blue(clr)).toString(16), 2, 0)}`);

}

function draw() {
  image(img, 0, 0);

  // This code builds the background image
  // but is very slow so we use the image instead.
  // colorMode(HSB);
  // loadPixels();
  // for (let y = 0; y < height; y++) {
  //   for (let x = 0; x < width; x++) {
  //     let i = idx(x, y);
  //     let c = color(x, y, 255);
  //     pixels[i] = red(c);
  //     pixels[i + 1] = green(c);
  //     pixels[i + 2] = blue(c);
  //     pixels[i + 3] = 255;
  //   }
  // }
  // updatePixels();
  // save('all-colors.png');
  // noLoop();

  stroke(0);
  strokeWeight(2);
  fill(255);
  ellipse(dotPlace.x, dotPlace.y, 4, 4);

  resultDiv.style('background-color', `rgb(${red(clr)}, ${green(clr)}, ${blue(clr)})`);

  resultCob.style('background-color', `#000`);
  resultCob.style('color', `rgb(${red(clr)}, ${green(clr)}, ${blue(clr)})`);

  resultCow.style('background-color', `#fff`);
  resultCow.style('color', `rgb(${red(clr)}, ${green(clr)}, ${blue(clr)})`);

  resultWoc.style('background-color', `rgb(${red(clr)}, ${green(clr)}, ${blue(clr)})`);
  resultWoc.style('color', `#fff`);

  resultBoc.style('background-color', `rgb(${red(clr)}, ${green(clr)}, ${blue(clr)})`);
  resultBoc.style('color', `#000`);

}
