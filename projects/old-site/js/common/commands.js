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
    let _p = document.querySelector('#vim');
    let _input = _p.textContent.substring(0, _p.textContent.length - 1);
    _input = _input.trim();
    let _parts = _input.split(/\s+/g);
    let command = _parts[0];
    let args = _parts.slice(1);
    commandHistory.pushCommand(_input);
    /**
     * command contains the first "word" of the input
     * args contains the REST of the words not including command
     * *********************************************************
     * ALL CASES (COMMANDS) MUST CALL EITHER commandError or
     * commandSucess AND RETURN true IF THEY SUCCEED OR
     * false IF THEY FAIL
     * https://github.com/python/cpython/blob/079f0dd7191fbadd4c3a5899b6af12492e84d2b4/Python/ceval.c#L1830
     * *********************************************************
     */
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
                    return commandError('Provide a color that is `#RGB` or `#RRGGBB`');
                }
                cssSetVar('--progPage-color', color);
                localStorage.setItem(LS_TEXT_COLOR, color);
                return commandSucceed(`Set text color to ${color}`);
            }
        case 'smc':
            {
                let color = args[0];
                if (!color.startsWith('#') || (color.length != 4 && color.length != 7)) {
                    return commandError('Provide a color that is `#RGB` or `#RRGGBB`');
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
                    return commandError('Provide a color that is `#RGB` or `#RRGGBB`');
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
            window.location = 'vimhelp.html';
            return true;
        case '->c':
            commandSucceed('Going to color picker');
            window.location = 'projects/color-picker/';
            return true;
        case '->p':
            commandSucceed('Going to programming!');
            window.location = "progproj.html";
            return true;
        case '->i':
            commandSucceed('Going to info');
            window.location = 'info.html';
            return true;
        case '->h':
            commandSucceed('Going to home');
            window.location = '/';
            return true;
        case '->l':
            commandSucceed('Going to linguistics');
            window.location = 'langproj.html';
            return true;
        case '!!':
            commandError(_input, 'Turning off fade not yet supported');
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
            commandError(_input, 'file not saved!');
            return false;
        case ':q!':
            window.location = 'http://google.com';
            commandSucceed('exiting...');
            return true;
        case '10PRINT':
            {
                let stop = false;
                let printArea = document.querySelector('#ten-print');
                printArea.style.display = 'block';
                document.body.onkeydown = (event) => {
                    printArea.innerHTML = '';
                    stop = true;
                    printArea.style.display = 'none';
                    document.body.onkeydown = vimHandle;
                };
                function tenPrint() {
                    printArea.innerHTML += ((Math.random() < 0.5 ? '\\' : '/'));
                    if (!stop) requestAnimationFrame(tenPrint);
                }
                tenPrint();
                commandSucceed('GOTO 10');
                return true;
            }
        case 'rm': {
            if (args[0] === 'zsh_history') {
                commandHistory.clear();
                commandSucceed('Cleared command history!');
                return true;
            }
            commandError('Command missing zsh_history argument! NO action taken');
            return false;
        }
        default:
            commandError(_input, 'UNKNOWN COMMAND! try using `?`');
            return false;
    }
}


function vimHandle() {
    const CURSOR_SPAN = '<span class="cursor">&#x258A;</span>';
    let bodies = document.getElementsByTagName('body');
    for (let body of bodies) {
        body.onkeydown = function (event) {
            if (window.location.host.includes('localhost')) console.log(event);
            let p = document.querySelector('#vim');
            if (event.code === 'Escape' || (!listening && event.code == 'KeyT') ||
                (!listening && event.code == 'Slash')) {
                listening = !listening;
                commandHistory.resetPosition();
                if (listening) {
                    p.innerHTML = CURSOR_SPAN;
                } else {
                    p.innerHTML = '';
                }
            } else if (listening) {
                if (event.code === 'KeyV' && (event.ctrlKey || event.metaKey)) {
                    navigator.clipboard.readText().then((text) => {
                        p.innerHTML = `${trimCursorText(p.textContent)}${text}${CURSOR_SPAN}`;
                    });
                } else if (event.code === 'Enter') {
                    listening = false;
                    commandHistory.resetPosition();
                    executeAction();
                } else if (event.code == 'Backspace') {
                    p.textContent = p.textContent.substring(0, p.textContent.length - 2);
                    p.innerHTML += CURSOR_SPAN;
                } else if (event.code == 'ArrowUp') {
                    let cmd = commandHistory.previousCommand();
                    if (cmd != null)
                        p.innerHTML = `${cmd}${CURSOR_SPAN}`;
                } else if (event.code == 'ArrowDown') {
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
        };
    }
}
