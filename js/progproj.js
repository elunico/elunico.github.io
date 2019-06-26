window.onload = () => {
  run_common();
  typeText('Programming Projects', '#mainHeader', () => {
    fade();
  });

  let images = document.querySelectorAll('img');
  for (let image of images) {
    image.onclick = function () {
      if (this.style.width == '50%' || !this.style.width) {
        this.style.width = '100%';
      } else if (this.style.width == '100%') {
        this.style.width = '150%';
      }
    }
  }
}


