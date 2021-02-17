let listening = false;
const sectionSize = 600;
const pageSize = 10000;
const commandHistory = new CommandHistory();

let status_timeout = 3500;


function commandStatus(text, color) {
    let p = document.querySelector('#vim');
    p.style.color = color;
    p.style['background-color'] = cssGetVar('--my-background-color');
    p.textContent = text;
    setTimeout(() => {
        p.style.color = '';
        if (!listening) {
            p.textContent = '';
            p.style.removeProperty('background-color');
        }
    }, status_timeout);
}

function commandError(cmd, reason) {
    commandStatus(`Error!: ${cmd}: ${reason}`, '#f00');
    return false;
}

function commandSucceed(msg) {
    commandStatus(`Success: ${msg}`, cssGetVar('--my-green-color'));
    return true;
}


function executeAction() {
    let p = document.querySelector('#vim');
    let input = p.textContent.substring(0, p.textContent.length - 1);
    input = input.trim();
    let parts = input.split(/\s+/g);
    let command = parts[0];
    let args = parts.slice(1);
    commandHistory.pushCommand(input);
    switch (command) {
        case 'lt':
            {
                toggleLigatures();
                return commandSucceed('Toggled Ligatures!');
            }
        case 'gsto':
            return commandSucceed(`Status timeout is ${status_timeout / 1000} seconds`);
        case 'gtc':
            return commandSucceed(`Text color is ${cssGetVar('--progPage-color')}`);
        case 'gmc':
            return commandSucceed(`Main color is ${cssGetVar('--my-green-color')}`);
        case 'gac':
            return commandSucceed(`Accent color is ${cssGetVar('--my-dark-accent-color')}`);
        case 'ssto':
            {
                let timeoutInput = args[0];
                let timeout = Number(timeoutInput);
                if (isNaN(timeout) || timeout < 1 || timeout > 120000) {
                    return commandError(`Timeout value ${timeoutInput} is invalid. Enter a number between 1 and 120000`);
                }
                status_timeout = timeout * 1000;
                localStorage.setItem(LS_STATUS_TIMEOUT, status_timeout);
                return commandSucceed(`Timeout set to ${timeout} seconds`);
            }
        case 'stc':
            {
                let color = args[0];
                if (!color.startsWith('#') || (color.length != 4 && color.length != 7)) {
                    return commandError('Provide a color that is `#RGB` or `#RRGGBB`')
                }
                cssSetVar('--progPage-color', color);
                localStorage.setItem(LS_TEXT_COLOR, color);
                return commandSucceed(`Set text color to ${color}`);
            }
        case 'smc':
            {
                let color = args[0];
                if (!color.startsWith('#') || (color.length != 4 && color.length != 7)) {
                    return commandError('Provide a color that is `#RGB` or `#RRGGBB`')
                }
                cssSetVar('--my-green-color', color);
                changeImageColor(color);
                localStorage.setItem(LS_MAIN_COLOR, color);
                return commandSucceed(`Set main color to ${color}`);
            }
        case 'sac':
            {
                let color = args[0];
                if (!color.startsWith('#') || (color.length != 4 && color.length != 7)) {
                    return commandError('Provide a color that is `#RGB` or `#RRGGBB`')
                }
                cssSetVar('--my-dark-accent-color', color);
                localStorage.setItem(LS_ACCENT_COLOR, color);
                return commandSucceed(`Set accent color to ${color}`);
            }
        case 'cf':
            {
                let choice = args.join(" ");
                setCustomFontDev(choice);
                commandSucceed(`Attempted to update font family to ${choice}.`);
                return true;
            }
        case 'f':
            {
                let result = setFontFromChoice(args[0]);
                if (!result) {
                    commandError(`Invalid choice for font: ${args[0]}`);
                } else {
                    commandSucceed('Successfully updated font preference');
                }
                return result;
            }
        case 'tdm':
            changeColorScheme();
            commandSucceed('Changed color scheme');
            return true;
        case 'rcs':
            resetColorScheme();
            commandSucceed(`Reset color scheme default colors and mode`);
            return true;
        case 'cls':
            commandSucceed('Cleared localStorage');
            localStorage.clear();
            return true;
        case '?':
            commandSucceed('Going to help');
            window.location = '/vimhelp.html';
            return true;
        case '->c':
            commandSucceed('Going to color picker');
            window.location = '/projects/color-picker/'
            return true;
        case '->p':
            commandSucceed('Going to programming!');
            window.location = "/progproj.html";
            return true;
        case '->i':
            commandSucceed('Going to info');
            window.location = '/info.html';
            return true;
        case '->h':
            commandSucceed('Going to home');
            window.location = '/';
            return true;
        case '->l':
            commandSucceed('Going to linguistics');
            window.location = '/langproj.html';
            return true;
        case '!!':
            commandError(input, 'Turning off fade not yet supported');
            return false;
        case ']]':
            window.scrollBy(0, sectionSize);
            commandSucceed('Next section');
            return true;
        case '[[':
            window.scrollBy(0, -sectionSize);
            commandSucceed('Previous section');
            return true;
        case 'G':
            window.scrollBy(0, pageSize);
            commandSucceed('go to end of file');
            return true;
        case 'gg':
            window.scrollBy(0, -pageSize);
            commandSucceed('go to beginning of file');
            return true;
        case ':q':
            commandError(input, 'file not saved!');
            return false;
        case ':q!':
            window.location = 'http://google.com';
            commandSucceed('exiting...');
            return true;
        default:
            commandError(input, 'UNKNOWN COMMAND! try using `?`');
            return false;
    }
}


function vimHandle() {
    let bodies = document.getElementsByTagName('body');
    for (let body of bodies) {
        body.onkeydown = function (event) {
            let p = document.querySelector('#vim');
            if (event.keyCode === 27 || (!listening && event.keyCode == 84) ||
                (!listening && event.keyCode == 191)) {
                listening = !listening;
                commandHistory.resetPosition();
                if (listening) {
                    p.innerHTML = CURSOR_SPAN;
                } else {
                    p.innerHTML = '';
                }
            } else if (listening) {
                if (event.keyCode === 86 && event.ctrlKey) {
                    navigator.clipboard.readText().then((text) => {
                        p.innerHTML = `${trimCursorText(p.textContent)}${text}${CURSOR_SPAN}`;
                    });
                } else if (event.keyCode === 13) {
                    listening = false;
                    commandHistory.resetPosition();
                    executeAction();
                } else if (event.keyCode == 8) {
                    p.textContent = p.textContent.substring(0, p.textContent.length - 2);
                    p.innerHTML += CURSOR_SPAN;
                } else if (event.keyCode == 38) {
                    let cmd = commandHistory.previousCommand();
                    if (cmd != null)
                        p.innerHTML = `${cmd}${CURSOR_SPAN}`;
                } else if (event.keyCode == 40) {
                    let cmd = commandHistory.nextCommand();
                    if (cmd != null)
                        p.innerHTML = `${cmd}${CURSOR_SPAN}`;
                } else {
                    if (event.key.length != 1) {
                        return;
                    }
                    let p = document.querySelector('#vim');
                    p.textContent = p.textContent.substring(0, p.textContent.length - 1) + event.key;
                    p.innerHTML = p.innerHTML + CURSOR_SPAN;
                }
                event.preventDefault();
            }
        }
    }
}
