window.onload = () => {
  typeText('Programming Projects', '#mainHeader', () => {
    fade();
    run_common();
  });

  let jpeditGallery = new Gallery('jpedit-gallery', {
    "/assets/projects/programming/jpedit_head1.png": "A screenshot an empty JPEdit Window with the file menu open.",
    "/assets/projects/programming/jpedit_head2.png": "A screenshot a JPEdit Window with text and the Time and Date Prompt open."
  });

  let socdrawGallery = new Gallery('socdraw-gallery', {
    "/assets/projects/programming/SocDraw_head1.png": "A screenshot of the duplicate file manager program.",
    "/assets/projects/programming/SocDraw_head2.png": "Another screenshot of the duplicate file manager program.",
    "/assets/projects/programming/SocDraw_head3.png": "Another screenshot of the duplicate file manager program.",
    "/assets/projects/programming/SocDraw_head4.png": "A 4th screenshot of the duplicate file manager program."
  });

  let redistricerGallery = new Gallery('redistricter-gallery', {
    "/assets/projects/programming/redistricter_head.jpg": "A screenshot of the Redistricter application with a state in view and sidebar open."
  });

  let clipboardManagerGallery = new Gallery('clipboardmanager-gallery', {
    "/assets/projects/programming/ClipboardManager_head.png": "A screenshot of the clipboard manager program with 2 entries in the table."
  });

  let duplicateFileManagerGallery = new Gallery('duplicatefilemanager-gallery', {
    "/assets/projects/programming/DuplicateFileManager_head1.png": "A screenshot of the duplicate file manager program.",
    "/assets/projects/programming/DuplicateFileManager_head2.png": "Another screenshot of the duplicate file manager program."
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
}
