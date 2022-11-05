let lightToggle = document.querySelector('[data-mode="light"]');
let darkToggle = document.querySelector('[data-mode="dark"]');

lightToggle.addEventListener('click', event => {
  document.body.setAttribute('data-mode', 'dark');
  localStorage.setItem('data-mode', 'dark');

});

darkToggle.addEventListener('click', event => {
  document.body.setAttribute('data-mode', 'light');
  localStorage.setItem('data-mode', 'light');

});

window.addEventListener('load', event => {
  let item = localStorage.getItem('data-mode');
  if (!item) return;



  document.body.setAttribute('data-mode', item);

  requestAnimationFrame(() => {
    document.body.style.setProperty('transition', 'var(--transition-var)');

  });

});
