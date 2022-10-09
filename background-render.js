let body = document.body;
let html = document.documentElement;

function skipper() {
    window.location = './#main';
    var main = document.getElementsByTagName('main')[0];
    main.setAttribute('tabindex', '0');
    main.focus();
}

function fillBackground(then) {
    try {
        var skipper = document.createElement('a');
        skipper.textContent = 'Skip Navigation';
        skipper.classList.add('skip-nav');
        skipper.setAttribute('tabindex', '1');
        skipper.href = 'javascript:skipper()'
        document.body.prepend(skipper);

        var remover = document.createElement('button');
        remover.innerHTML = '<span>Remove Background</span>'
        remover.id = 'remove-button';
        remover.onclick = event => (document.body.style.background = "var(--page-background-color)") && document.body.removeChild(remover);
        document.body.appendChild(remover)
    } catch (err) {
        console.error("Failed to load background:")
        console.error(err);
        return;
    }
    then();
}

fillBackground(() => console.log("Backgrounded"));

