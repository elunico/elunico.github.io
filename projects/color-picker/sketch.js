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

const pangrams = [
  "Jived fox nymph grabs quick waltz.",
  "Glib jocks quiz nymph to vex dwarf.",
  "Sphinx of black quartz, judge my vow.",
  "How vexingly quick daft zebras jump!",
  "The five boxing wizards jump quickly.",
  "Pack my box with five dozen liquor jugs."
];

function preload() {
  img = loadImage('all-colors.png');
}

function setup() {
  let container = select('#canvas-container');
  canvas = createCanvas(375, 300);
  canvas.parent(container);

  brightnessSlider = select('#brightness-input');
  redSlider = select('#red-input');
  greenSlider = select('#green-input');
  blueSlider = select('#blue-input');

  brightnessSlider.input(() => {
    colorMode(HSB);
    clr = color(hue(clr), saturation(clr), brightnessSlider.value());
    redSlider.value(red(clr));
    greenSlider.value(green(clr));
    blueSlider.value(blue(clr));
    tint(brightnessSlider.value());
    dotPlace = createVector(hue(clr), saturation(clr));
  });
  redSlider.input(() => {
    colorMode(RGB);
    clr = color(redSlider.value(), greenSlider.value(), blueSlider.value());
    colorMode(HSB);
    brightnessSlider.value(floor((brightness(clr) / 100) * 100));
    tint(brightness(clr));
    dotPlace = createVector(hue(clr), saturation(clr));
  });
  greenSlider.input(() => {
    colorMode(RGB);
    clr = color(redSlider.value(), greenSlider.value(), blueSlider.value());
    colorMode(HSB);
    brightnessSlider.value(floor((brightness(clr) / 100) * 100));
    tint(brightness(clr));
    dotPlace = createVector(hue(clr), saturation(clr));
  });
  blueSlider.input(() => {
    colorMode(RGB);
    clr = color(redSlider.value(), greenSlider.value(), blueSlider.value());
    colorMode(HSB);
    brightnessSlider.value(floor((brightness(clr) / 100) * 100));
    tint(brightness(clr));
    dotPlace = createVector(hue(clr), saturation(clr));
  });

  pixelDensity(1);
  clr = color(255, 0, 100);
  colorMode(HSB);

  clr = color(redSlider.value(), greenSlider.value(), blueSlider.value());
  brightnessSlider.value(brightness(clr));
  dotPlace = createVector(hue(clr), saturation(clr));

  resultDiv = select('#colorDiv');
  resultCob = select('#color-on-black');
  resultCow = select('#color-on-white');
  resultWoc = select('#white-on-color');
  resultBoc = select('#black-on-color');

  hexResult = select('#hex-result');
  threeResult = select('#3-result');

  blueSlider.elt.dispatchEvent(new Event('input', {
    bubbles: true,
    cancelable: true,
  }));

  let pangram = random(pangrams);
  let samples = selectAll('.sample');
  for (let sample of samples) {
    sample.html(pangram);
  }

  select('#colorDiv').html('&nbsp;');

}

function idx(x, y) {
  return (x + y * width) * 4;
}

function mouseDragged() {
  mousePressed();
}

function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY > height || mouseY < 0) {
    return;
  }
  dotPlace = createVector(mouseX, mouseY);
  colorMode(HSB);
  clr = color(mouseX, mouseY, brightnessSlider.value());
  redSlider.value(red(clr));
  greenSlider.value(green(clr));
  blueSlider.value(blue(clr));
  brightnessSlider.value(brightness(clr));
}

function draw() {
  image(img, 0, 0);

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

  threeResult.html(`rgb(${nf(red(clr), 1, 0)}, ${nf(green(clr), 1, 0)}, ${nf(blue(clr), 1, 0)})`);
  hexResult.html(`#${nf(floor(red(clr)).toString(16), 2, 0)}${nf(floor(green(clr)).toString(16), 2, 0)}${nf(floor(blue(clr)).toString(16), 2, 0)}`);
}