window.onload = () => {
  run_common_before_type();
  typeText('Programming Projects', '#mainHeader')
    .then(() => {
      run_common_after_type();
    });

  let jpeditGallery = new Gallery('jpedit-gallery', {
    "assets/projects/programming/jpedit_head1.png": "A screenshot an empty JPEdit Window with the file menu open.",
    "assets/projects/programming/jpedit_head2.png": "A screenshot a JPEdit Window with text and the Time and Date Prompt open."
  });

  // video gallery!
  let lifeGallery = new Gallery('life-gallery', {
    "assets/projects/programming/game-of-life": "A video showing an example game of life running and a person interacting with the start buttons, canvas cells, and save and load feature.",
  }, true);

  // cheat to make the gif smaller
  // let lgal = document.querySelector('#life-gallery div div div img');
  // lgal.style.width = '95%';

  let socdrawGallery = new Gallery('socdraw-gallery', {
    "assets/projects/programming/SocDraw_head1.png": "A screenshot of the main page of SocDraw showing create room and join room options.",
    "assets/projects/programming/SocDraw_head2.png": "A screenshot of SocDraw showing an open room and a canvas with drawing.",
    "assets/projects/programming/SocDraw_head3.png": "A screenshot showing SocDraw in a room with a drawing and another window with the main page open.",
    "assets/projects/programming/SocDraw_head4.png": "A screenshot showing two clients in the same SocDraw room displaying the same drawing."
  });

  let cysGallery = new Gallery('cys-gallery', {
    "assets/projects/programming/cys-browser-action.png": "A screenshot of the browser action popup window for Custom YouTube Speed"
  });

  let redistricerGallery = new Gallery('redistricter-gallery', {
    "assets/projects/programming/redistricter_head.jpg": "A screenshot of the Redistricter application with a state in view and sidebar open."
  });

  let clipboardManagerGallery = new Gallery('clipboardmanager-gallery', {
    "assets/projects/programming/ClipboardManager_head.png": "A screenshot of the clipboard manager program with 2 entries in the table."
  });

  let duplicateFileManagerGallery = new Gallery('duplicatefilemanager-gallery', {
    "assets/projects/programming/DuplicateFileManager_head1.png": "A screenshot of the duplicate file manager program.",
    "assets/projects/programming/DuplicateFileManager_head2.png": "Another screenshot of the duplicate file manager program."
  });

  /* replacing with gallery
  let images = document.querySelectorAll('img');
  for (let image of images) {
    image.onclick = function () {
      if (this.style.width == '50%' || !this.style.width) {
        this.style.width = '100%';
      } else if (this.style.width == '100%') {
        this.style.width = '50%';
      }
    }
  }
  */
};
