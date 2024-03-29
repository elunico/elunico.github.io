let body = document.body;
let html = document.documentElement;

function skipper() {
    window.location = './#main';
    const main = document.getElementsByTagName('main')[0];
    main.setAttribute('tabindex', '0');
    main.focus();
}

async function fillBackground() {
    const skipper = document.createElement('a');
    skipper.textContent = 'Skip Navigation';
    skipper.classList.add('skip-nav');
    skipper.setAttribute('tabindex', '1');
    skipper.href = 'javascript:skipper()';
    document.body.insertBefore(skipper, document.body.firstElementChild);

    // var remover = document.createElement('button');
    // remover.innerHTML = '<span>Remove Background</span>'
    // remover.id = 'remove-button';
    // remover.onclick = event => (document.body.style.background = "var(--page-background-color)") && document.body.removeChild(remover);
    // document.body.appendChild(remover);
}

fillBackground().then(() => console.log("Background Loaded.")).catch(err => console.error(`Failed to load background: ${err}`));


