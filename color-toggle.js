let lightToggle = document.querySelector('img[data-mode="light"]');
let darkToggle = document.querySelector('img[data-mode="dark"]');
let container = document.querySelector('#theme-toggle');

lightToggle.addEventListener('click', event => {
  document.body.setAttribute('data-mode', 'dark');
  localStorage.setItem('data-mode', 'dark');

});

darkToggle.addEventListener('click', event => {
  document.body.setAttribute('data-mode', 'light');
  localStorage.setItem('data-mode', 'light');

});

window.addEventListener('load', event => {
  console.log(navigator.userAgent);
  if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
    document.body.removeChild(container);
    return;
  }


  let item = localStorage.getItem('data-mode');
  if (!item) return;



  document.body.setAttribute('data-mode', item);

  requestAnimationFrame(() => {
    document.body.style.transition = 'var(--transition-var)';
  });

});
