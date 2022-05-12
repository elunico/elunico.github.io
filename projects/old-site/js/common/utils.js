const DOMAIN = 'io.github.elunico-';

function cssGetVar(v) {
    let root = document.documentElement;
    let value = getComputedStyle(root).getPropertyValue(v);
    return value;
}

function cssSetVar(k, v) {
    let root = document.documentElement;
    root.style.setProperty(k, v);
}

function trimCursorText(text) {
    return text.replace('\u258A', '');
}

function hexstringToRGBColor(string) {
    if (string.startsWith('#')) {
        string = string.substring(1);
    }
    if (string.length == 3) {
        return {
            red: parseInt(string.charAt(0) + string.charAt(0), 16),
            green: parseInt(string.charAt(1) + string.charAt(1), 16),
            blue: parseInt(string.charAt(2) + string.charAt(2), 16)
        }
    } else if (string.length == 6) {
        return {
            red: parseInt(string.substring(0, 2), 16),
            green: parseInt(string.substring(2, 4), 16),
            blue: parseInt(string.substring(4, 6), 16)
        }
    } else {
        throw new Error(`Invalid hexstring: ${string}`);
    }
}

function normalizeRGBColor({ red, green, blue }) {
    return { red: red / 255, blue: blue / 255, green: green / 255 }
}

function constrain(x, lower, higher) {
  return x < lower ? lower : (x > higher ? higher : x)
}

function rgbColorToHSBColor({ red, green, blue }) {
    /*
     * Formulas for this conversion were taken from the Wikipedia
     * Page https://en.wikipedia.org/wiki/HSL_and_HSV
     */

    let normalized = normalizeRGBColor({ red, green, blue });
    red = normalized.red;
    green = normalized.green;
    blue = normalized.blue;

    let M = Math.max(red, green, blue);
    let m = Math.min(red, green, blue);

    let C = M - m;

    let h;
    if (C == 0) {
        h = 0;
    } else if (M == red) {
        h = ((green - blue) / C) % 6;
    } else if (M == green) {
        h = ((blue - red) / C) + 2;
    } else if (M == blue) {
        h = ((red - green) / C) + 4;
    }
    h = 60 * h;

    let l = (M + m) / 2;
    let b = M;
    let s = (l == 0 || l == 1) ? 0 : (C / (1 - Math.abs(2 * l - 1)))

    return { hue: h, saturation: s, brightness: b };
}
