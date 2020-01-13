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

  hexResult = select('#hex-result');
  threeResult = select('#3-result');

  hexResult.input(() => {
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

    colorMode(RGB);
    clr = color(r, g, b);
    threeResult.value(`rgb(${nf(red(clr), 1, 0)}, ${nf(green(clr), 1, 0)}, ${nf(blue(clr), 1, 0)})`);
    redSlider.value(r);
    greenSlider.value(g);
    blueSlider.value(b);
    colorMode(HSB);
    brightnessSlider.value(brightness(clr));
    tint(brightness(clr));
    dotPlace = createVector(hue(clr), saturation(clr));
  });

  threeResult.input(() => {
    let s = threeResult.value();
    let parts = s.split(/(\d+)/g).filter(s => /\d+/.test(s)).map(s => Number(s));
    if (parts.length != 3) {
      return;
    }

    let [r, g, b] = parts;
    colorMode(RGB);
    clr = color(r, g, b);
    hexResult.value(`#${nf(floor(red(clr)).toString(16), 2, 0)}${nf(floor(green(clr)).toString(16), 2, 0)}${nf(floor(blue(clr)).toString(16), 2, 0)}`);
    redSlider.value(r);
    greenSlider.value(g);
    blueSlider.value(b);
    colorMode(HSB);
    brightnessSlider.value(brightness(clr));
    tint(brightness(clr));
    dotPlace = createVector(hue(clr), saturation(clr));

  })

  brightnessSlider.input(() => {
    colorMode(HSB);
    clr = color(hue(clr), saturation(clr), brightnessSlider.value());
    tint(brightnessSlider.value());
    colorMode(RGB);
    threeResult.value(`rgb(${nf(red(clr), 1, 0)}, ${nf(green(clr), 1, 0)}, ${nf(blue(clr), 1, 0)})`);
    hexResult.value(`#${nf(floor(red(clr)).toString(16), 2, 0)}${nf(floor(green(clr)).toString(16), 2, 0)}${nf(floor(blue(clr)).toString(16), 2, 0)}`);
    redSlider.value(red(clr));
    greenSlider.value(green(clr));
    blueSlider.value(blue(clr));
    dotPlace = createVector(hue(clr), saturation(clr));
  });
  redSlider.input(() => {
    colorMode(RGB);
    clr = color(redSlider.value(), greenSlider.value(), blueSlider.value());
    threeResult.value(`rgb(${nf(red(clr), 1, 0)}, ${nf(green(clr), 1, 0)}, ${nf(blue(clr), 1, 0)})`);
    hexResult.value(`#${nf(floor(red(clr)).toString(16), 2, 0)}${nf(floor(green(clr)).toString(16), 2, 0)}${nf(floor(blue(clr)).toString(16), 2, 0)}`);
    colorMode(HSB);
    brightnessSlider.value(brightness(clr));
    tint(brightness(clr));
    dotPlace = createVector(hue(clr), saturation(clr));
  });
  greenSlider.input(() => {
    colorMode(RGB);
    clr = color(redSlider.value(), greenSlider.value(), blueSlider.value());
    threeResult.value(`rgb(${nf(red(clr), 1, 0)}, ${nf(green(clr), 1, 0)}, ${nf(blue(clr), 1, 0)})`);
    hexResult.value(`#${nf(floor(red(clr)).toString(16), 2, 0)}${nf(floor(green(clr)).toString(16), 2, 0)}${nf(floor(blue(clr)).toString(16), 2, 0)}`);
    colorMode(HSB);
    brightnessSlider.value(brightness(clr));
    tint(brightness(clr));
    dotPlace = createVector(hue(clr), saturation(clr));
  });
  blueSlider.input(() => {
    colorMode(RGB);
    clr = color(redSlider.value(), greenSlider.value(), blueSlider.value());
    threeResult.value(`rgb(${nf(red(clr), 1, 0)}, ${nf(green(clr), 1, 0)}, ${nf(blue(clr), 1, 0)})`);
    hexResult.value(`#${nf(floor(red(clr)).toString(16), 2, 0)}${nf(floor(green(clr)).toString(16), 2, 0)}${nf(floor(blue(clr)).toString(16), 2, 0)}`);
    colorMode(HSB);
    brightnessSlider.value(brightness(clr));
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
  if (startedInCanvas) {
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

}