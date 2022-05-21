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
  `Nymphs blitz quick vex dwarf jog.`,
  `DJs flock by when MTV ax quiz prog`,
  `Big fjords vex quick waltz nymph`,
  `Bawds jog, flick quartz, vex nymph`,
  `Waltz job vexed quick frog nymphs`,
  `Junk MTV quiz graced by fox whelps`,
  `Bawds jog, flick quartz, vex nymphs`,
  `Waltz, bad nymph, for quick jigs vex`,
  `Waltz, nymph, for quick jigs vex Bud`,
  `Fox nymphs grab quick-jived waltz`,
  `Brick quiz whangs jumpy veldt fox`,
  `Glib jocks quiz nymph to vex dwarf`,
  `Bright vixens jump; dozy fowl quack`,
  `Vexed nymphs go for quick waltz job`,
  `Quick wafting zephyrs vex bold Jim`,
  `Quick zephyrs blow, vexing daft Jim`,
  `Quick blowing zephyrs vex daft Jim`,
  `Sex-charged fop blew my junk TV quiz`,
  `Both fickle dwarves jinx my pig quiz`,
  `Fat hag dwarves quickly zap jinx mob`,
  `Hick dwarves jam blitzing foxy quip`,
  `Fox dwarves chop my talking quiz job`,
  `Public junk dwarves quiz mighty fox`,
  `Jack fox bids ivy-strewn phlegm quiz`,
  `How quickly daft jumping zebras vex`,
  `Two driven jocks help fax my big quiz`,
  `Jack, love my big wad of sphinx quartz`,
  `Do wafting zephyrs quickly vex Jumbo`,
  `Go, lazy fat vixen; be shrewd, jump quick`,
  `Fickle jinx bog dwarves spy math quiz`,
  `Big dwarves heckle my top quiz of jinx`,
  `Fickle bog dwarves jinx empathy quiz`,
  `Public junk dwarves hug my quartz fox`,
  `Jumping hay dwarves flock quartz box`,
  `Five jumping wizards hex bolty quick`,
  `Five hexing wizard bots jump quickly`,
  `Quick fox jumps nightly above wizard`,
  `Vamp fox held quartz duck just by wing`,
  `Show mangled quartz flip vibe exactly`,
  `My jocks box, get hard, unzip, quiver, flow`,
  `My ex pub quiz crowd gave joyful thanks`,
  `Cozy sphinx waves quart jug of bad milk`,
  `A very bad quack might jinx zippy fowls`,
  `Few quips galvanized the mock jury box`,
  `Quick brown fox jumps over the lazy dog`,
  `Quilt frenzy jackdaw gave them best pox`,
  `Jumpy halfling dwarves pick quartz box`,
  `Vex quest wizard, judge my backflop hand`,
  `The jay, pig, fox, zebra and my wolves quack`,
  `Blowzy red vixens fight for a quick jump`,
  `Sex prof gives back no quiz with mild joy`,
  `The quick brown fox jumps over a lazy dog`,
  `A quick brown fox jumps over the lazy dog`,
  `Quest judge wizard bonks foxy chimp love`,
  `Boxers had zap of gay jock love, quit women`,
  `Joaquin Phoenix was gazed by MTV for luck`,
  `JCVD might pique a sleazy boxer with funk`,
  `Quizzical twins proved my hijack-bug fix`,
  `Fix problem quickly with galvanized jets`,
  `The quick brown fox jumps over the lazy dogdating back to 1888`,
  `Waxy and quivering, jocks fumble the pizza`,
  `When zombies arrive, quickly fax judge Pat`,
  `Heavy boxes perform quick waltzes and jigs`,
  `A wizard’s job is to vex chumps quickly in fog`,
  `Sympathizing would fix Quaker objectives`,
  `Pack my red box with five dozen quality jugs`,
  `BlewJ’s computer quiz favored proxy hacking`,
  `Quads of blowzy fjord ignite map vex’d chicks`,
  `Fake bugs put in wax jonquils drive him crazy`,
  `GQ jock wears vinyl tuxedo for showbiz promo`,
  `The quick brown fox jumped over the lazy dogs`,
  `Who packed five dozen old quart jugs in my box`,
  `Brawny gods just flocked up to quiz and vex him`,
  `Twelve ziggurats quickly jumped a finch box`,
  `Prating jokers quizzically vexed me with fibs`,
  `My faxed joke won a pager in the cable TV quiz show`,
  `The lazy major was fixing Cupid’s broken quiver`,
  `Amazingly few discotheques provide jukeboxes`,
  `Jacky can now give six big tips from the old quiz`,
  `Lovak won the squad prize cup for sixty big jumps`,
  `Foxy diva Jennifer Lopez wasn’t baking my quiche`,
  `By Jove, my quick study of lexicography won a prize`,
  `Levi Lentz packed my bag with six quarts of juice`,
  `Painful zombies quickly watch a jinxed graveyard`,
  `Fax back Jim’s Gwyneth Paltrow video quiz`,
  `As quirky joke, chefs won’t pay devil magic zebra tax`,
  `My girl wove six dozen plaid jackets before she quit`,
  `Then a cop quizzed Mick Jagger’s ex-wives briefly`,
  `Six big devils from Japan quickly forgot how to waltz`,
  `Why shouldn’t a quixotic Kazakh vampire jog barefoot?`,
  `Grumpy wizards make a toxic brew for the jovial queen`,
  `Sixty zips were quickly picked from the woven jute bag`,
  `Big July earthquakes confound zany experimental vow`,
  `Foxy parsons quiz and cajole the lovably dim wiki-girl`,
  `Cute, kind, jovial, foxy physique, amazing beauty`,
  `Have a pick: twenty-six letters — no forcing a jumbled quiz`,
  `A very big box sailed up then whizzed quickly from Japan`,
  `Battle of Thermopylae: Quick javelin grazed wry Xerxes`,
  `Jack quietly moved up front and seized the big ball of wax`,
  `Few black taxis drive up major roads on quiet hazy nights`,
  `Just poets wax boldly as kings and queens march over fuzz`,
  `Quincy Pondexter blocked five jams against the Wizards`,
  `Crazy Frederick bought many very exquisite opal jewels`,
  `A quivering Texas zombie fought republic linked jewelry`,
  `The job of waxing linoleum frequently peeves chintzy kids`,
  `Back in June we delivered oxygen equipment of the same size`,
  `A quick movement of the enemy will jeopardize six gunboats`,
  `All questions asked by five watched experts amaze the judge`,
  `Bobby Klun awarded Jayme sixth place for her very high quiz`,
  `The wizard quickly jinxed the gnomes before they vaporized`,
  `Zelda might fix the job growth plans very quickly on Monday`,
  `Zack Gappow saved the job requirement list for the six boys`,
  `Jackie will budget for the most expensive zoology equipment`,
  `Quirky spud boys can jam after zapping five worthy Polysixes`,
  `Jim quickly realized that the beautiful gowns are expensive`,
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

  for (let event of ['touchstart', 'touchmove', 'touchend']) {
    canvas.elt.addEventListener(event, (e) => {
      e.preventDefault();
    });
  }

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
  colorMode(RGB);
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

};
