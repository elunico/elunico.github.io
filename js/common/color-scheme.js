const LS_DARK_SET = `${DOMAIN}-set-dark`;
const LS_MAIN_COLOR = `${DOMAIN}-main-color`;
const LS_TEXT_COLOR = `${DOMAIN}-text-color`;
const LS_ACCENT_COLOR = `${DOMAIN}-accent-color`;
const LS_STATUS_TIMEOUT = `${DOMAIN}-status-timeout`;

let lsd = localStorage.getItem(LS_DARK_SET);
let savedDark = lsd === 'true';


function loadDarkModeDefaults() {
    let codes = document.getElementsByClassName('my-code');

    cssSetVar("--my-green-color", "#24292E");
    cssSetVar("--my-dark-accent-color", "darkgreen");
    cssSetVar("--my-link-visited-color", "#2E8B57");
    cssSetVar("--my-link-hover-color", "#e2e2e2");
    cssSetVar("--button-background-color", "#24292E");
    cssSetVar("--progPage-color", "white");
    cssSetVar("--projectContainer-color", "white");
    cssSetVar("--my-background-color", "#24292E");
    cssSetVar("--my-caption-background-color", "rgb(48, 48, 48)");
    for (let code of codes) {
        code.style.setProperty('background-color', 'rgb(51, 51, 51)');
    }
}

function loadLightModeDefaults() {
    let codes = document.getElementsByClassName('my-code');

    cssSetVar("--my-green-color", "rgb(47, 163, 47)");
    cssSetVar("--my-dark-accent-color", "darkgreen");
    cssSetVar("--my-link-visited-color", "#2E8B57");
    cssSetVar("--my-link-hover-color", "#00ff00");
    cssSetVar("--button-background-color", "rgb(240, 238, 238)");
    cssSetVar("--progPage-color", "black");
    cssSetVar("--projectContainer-color", "black");
    cssSetVar("--my-background-color", "#fefefe");
    cssSetVar("--my-caption-background-color", "#f3f3f3");
    for (let code of codes) {
        code.style.setProperty('background-color', 'rgb(230, 230, 230)');
    }
}

function resetColorScheme() {
    let query = '(prefers-color-scheme: dark)';
    let matches = matchMedia(query).matches;
    localStorage.setItem(LS_DARK_SET, matches);
    if (matches) {
        loadDarkModeDefaults();
        localStorage.setItem(LS_ACCENT_COLOR, "darkgreen");
        changeImageColor("32CD32")
        localStorage.setItem(LS_MAIN_COLOR, "#24292E");
        localStorage.setItem(LS_TEXT_COLOR, 'white');
    } else {
        loadLightModeDefaults();
        localStorage.setItem(LS_MAIN_COLOR, "#2fa32f");
        changeImageColor("2fa32f")
        localStorage.setItem(LS_ACCENT_COLOR, "darkgreen");
        localStorage.setItem(LS_TEXT_COLOR, 'black');
    }
    savedDark = matches;
    return true;
}


function changeColorScheme() {
    // // if no preference for color scheme exists, we are using
    // // media query so default to that
    if (lsd === null) {
        savedDark = matchMedia('(prefers-color-scheme: dark)').matches;
        lsd = savedDark;
    }

    if (!savedDark) {
        // dark properties
        loadDarkModeDefaults();
        let main = localStorage.getItem(LS_MAIN_COLOR);
        let accent = localStorage.getItem(LS_ACCENT_COLOR);
        let text = localStorage.getItem(LS_TEXT_COLOR);
        if (!text || text == '#000') {
            text = '#fff';
            localStorage.setItem(LS_TEXT_COLOR, text);
        }
        cssSetVar('--my-green-color', main);
        cssSetVar('--my-dark-accent-color', accent);
        cssSetVar('--progPage-color', text);
    } else {
        // light properties
        loadLightModeDefaults();
        let main = localStorage.getItem(LS_MAIN_COLOR);
        let accent = localStorage.getItem(LS_ACCENT_COLOR);
        let text = localStorage.getItem(LS_TEXT_COLOR);
        if (!text || text == '#fff') {
            text = '#000';
            localStorage.setItem(LS_TEXT_COLOR, text);
        }
        cssSetVar('--my-green-color', main);
        cssSetVar('--my-dark-accent-color', accent);
        cssSetVar('--progPage-color', text);
    }
    savedDark = !savedDark;
    localStorage.setItem(LS_DARK_SET, savedDark);
}


function loadCustomColors() {
    let main = localStorage.getItem(LS_MAIN_COLOR);
    let accent = localStorage.getItem(LS_ACCENT_COLOR);
    let text = localStorage.getItem(LS_TEXT_COLOR);
    console.log(text);
    cssSetVar('--my-green-color', main);
    cssSetVar('--my-accent-color', accent);
    cssSetVar('--progPage-color', text);
    changeImageColor(main);
}

function loadBrightnessPreference() {
    const mediaMatchesDark = matchMedia('(prefers-color-scheme: dark)').matches;
    // lsd checks to see if anything is set in localStorage
    // if no preference is recorded don't change the color scheme, since
    // the page is already responding to (prefers-color-scheme: )
    // only if there is an explicit override AND it does not match the media query
    // should we change
    if (!lsd) return;
    if (savedDark) {
        loadDarkModeDefaults();
    } else {
        loadLightModeDefaults();
    }
}