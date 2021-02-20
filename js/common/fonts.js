const LS_FONT_CHOICE_NAME = `${DOMAIN}font-choice`;
const MY_MAIN_FONT_VAR = '--my-main-font';
const DEFAULT_FONT_CHOICE = 'mdj';
let ligatures = false;

function toggleLigatures() {
    let body = document.body;
    if (!ligatures)
        body.style['font-variant'] = 'common-ligatures';
    else
        body.style['font-variant'] = '';
    ligatures = !ligatures;
}


const fontDataForChoice = {
    // fonts that cannot be loaded from Google Fonts are considered to
    // be loaded by default since they only work if they are local font files
    'dflt-s': { familyName: "serif", loaded: true, loaderObject: null },
    'dflt-ss': { familyName: "sans-serif", loaded: true, loaderObject: null },
    'dflt-m': { familyName: "monospace", loaded: true, loaderObject: null },
    'c': { familyName: "Consolas", loaded: true, loaderObject: null },
    'mon': { familyName: "Monaco", loaded: true, loaderObject: null },

    // mononoki is bundled as an asset as well
    'mnki': { familyName: "mononoki", loaded: true, loaderObject: null },

    // djv sans mono is distributed with the site so no extra loading is required.
    'mdj': { familyName: `"Menlo", "DejaVu Sans Mono"`, loaded: true, loaderObject: null },

    // these fonts must be loaded from the Google fonts API if the user wishes to use them
    // They are loaded with the Google and TypeKit WebFontLoader by calling WebFont.load(.loaderObject)
    'um': { familyName: "Ubuntu Mono", loaded: false, loaderObject: { google: { families: ['Ubuntu Mono:400,400i,700,700i'] } } },
    'scp': { familyName: "Source Code Pro", loaded: false, loaderObject: { google: { families: ['Source Code Pro:400,400i,700,700i'] } } },
    'sm': { familyName: "Space Mono", loaded: false, loaderObject: { google: { families: ['Space Mono:400,400i,700,700i'] } } },
    'i': { familyName: "Inconsolata", loaded: false, loaderObject: { google: { families: ['Inconsolata:400,400i,700,700i'] } } },
    'crpr': { familyName: "Courier Prime", loaded: false, loaderObject: { google: { families: ['Courier Prime:400,400i,700,700i'] } } },
    'fs': { familyName: "Fontdiner Swanky", loaded: false, loaderObject: { google: { families: ['Fontdiner Swanky:400,400i,700,700i'] } } },
    'ua': { familyName: "Uncial Antiqua", loaded: false, loaderObject: { google: { families: ['Uncial Antiqua:400,400i,700,700i'] } } },
    'samt': { familyName: "Sacramento", loaded: false, loaderObject: { google: { families: ['Sacramento:400,400i,700,700i'] } } },
    'se': { familyName: "Special Elite", loaded: false, loaderObject: { google: { families: ['Special Elite:400,400i,700,700i'] } } }
};

function setCustomFontDev(choice) {
    if (!choice) return;
    localStorage.setItem(LS_FONT_CHOICE_NAME, choice);
    changeMainFontFamily(choice);
}

function setFontFromChoice(choice) {
    if (!choice) { return false; }

    if (choice === "reset") {
        setFontFromChoice(DEFAULT_FONT_CHOICE);
        localStorage.removeItem(LS_FONT_CHOICE_NAME);
        return true;
    }

    let fontObject = fontDataForChoice[choice];
    if (!fontObject) { return false; }

    localStorage.setItem(LS_FONT_CHOICE_NAME, choice);

    // this check prevents loading the fonts multiple
    // times while the user reamins on the same page,
    // specifically because it is required to load the
    // font from Google Fonts on each page load, but
    // if the user switches back and forth multiple times
    // on only one page, we only wanna load the font the
    // first time
    if (!fontObject.loaded) {
        WebFont.load(fontObject.loaderObject);
        fontObject.loaded = true;
    }

    changeMainFontFamily(fontObject.familyName);
    return true;
}

function changeMainFontFamily(toFamily) {
    let root = document.documentElement;
    root.style.setProperty(MY_MAIN_FONT_VAR, toFamily);
}


function reloadFontChoice() {
    let choice = localStorage.getItem(LS_FONT_CHOICE_NAME);
    if (choice) {
        let result = setFontFromChoice(choice)
        if (!result) {
            // attempt to set font-family name directly
            changeMainFontFamily(choice);
        }
    }
}

