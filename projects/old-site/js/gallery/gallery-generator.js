let _gallery_count = 1;

// local closure over index didn't work
function createThumbnailOnclick(obj, index) {
  return function (event) {
    obj.currentSlide(index);
  }
}

// Sorry Sandi!
class Gallery {
  static _next_gallery() {
    return _gallery_count++;
  }

  /**
   * construct an image gallery based on W3Schools example gallery.
   * Pass images (and optional alt text) and the gallery will be
   * stored in the desired node of the document
   *
   * If you pass true for `video` the gallery will display an HTML5 video
   * element. When passing the url OMIT the extension and ensure that the path
   * given includes the name of the file without an extension. Ensure that
   * there is one file with the name and an mp4 extension and 1 file with the
   * name and a webm extension.
   *
   * @param {string} parent_id the id of the node that will contain the gallery. NOT a selector! Do not use #
   * @param {string[] | Object.<string, string>} urls a list of urls to images that will be used in the gallery, or an object of image urls to their respective alt text which will be used in the gallery
   * @param {boolean} video whether the gallery is going to hold videos or not
   */
  constructor(parent_id, urls, video) {
    this._pid = parent_id;
    if (urls instanceof Array) {
      this.urls = urls;
      this.alts = new Array(urls.length).fill("");
    } else {
      this.urls = Object.keys(urls);
      this.alts = Object.values(urls);
    }
    this.slideIndex = 1;
    this.id = Gallery._next_gallery();

    let place = document.querySelector(`#${parent_id}`);
    if (!place) {
      throw new TypeError(`Gallery passed parent_id="${parent_id}" but that id was not found in the document`);
    }

    this.hasVideo = video || false;
    this.tagName = this.hasVideo ? 'video' : 'img';

    this.init();
    this.clearCoordinates();
  }

  length() { return this.urls.length; }

  static setSource(content, url, hasVideo) {
    if (!hasVideo) {
      content.src = url;
    } else {
      content.setAttribute('data-video-src', url);
      for (let ext of ['.mp4', '.webm']) {
        let sourceElt = document.createElement('source');
        sourceElt.src = `${url}${ext}`;
        content.appendChild(sourceElt);
      }
    }
  }

  init() {

    document.body.addEventListener('keydown', () => {
      if (event.keyCode == 27) { // escape
        this.closeModal();
      }
    });

    // modal for popup images, hidden at first.
    let modal = document.createElement('div');
    modal.onkeydown = (event) => {
      let slide = this.keyPressed(event);
      if (!slide) return;
      let content = slide.getElementsByTagName(this.tagName)[0];
      requestAnimationFrame(() => {
        this.clearModalContents();
        this.addModalContent(Gallery.getContentSource(content, this.hasVideo));
      });
    };

    modal.ontouchstart = (event) => this.touchStart(event);
    modal.ontouchmove = (event) => this.touchMove(event);
    modal.ontouchend = (event) => {
      let slide = this.touchEnd(event);
      if (!slide) {
        this.touchCancel();
        return;
      }
      let content = slide.getElementsByTagName(this.tagName)[0];
      requestAnimationFrame(() => {
        this.clearModalContents();
        this.addModalContent(Gallery.getContentSource(content, this.hasVideo));
      });
    };

    modal.tabIndex = '0';
    modal.className = 'modal';
    modal.id = `myModal_${this._pid}`;

    // <span class="close cursor" onclick="closeModal()">&times;</span>
    let closeCursor = document.createElement('span');
    closeCursor.className = 'close img-cursor'
    closeCursor.onclick = () => this.closeModal();
    closeCursor.innerHTML = '&times;';

    modal.appendChild(closeCursor);

    let modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.id = `modal-content_${this._pid}`;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // entire gallery lives inside of container
    let container = document.createElement('div')
    container.className = `container`;

    container.onkeydown = (event) => this.keyPressed(event);
    container.tabIndex = 0;

    // create all full sized images
    let currentNumber = 1;
    let lastNumber = this.length();
    for (let url of this.urls) {
      let mySlides = document.createElement('div')
      mySlides.className = `mySlides slides_gallery${this.id}`;

      if (!this.hasVideo) {
        let numbertext = document.createElement('div');
        numbertext.className = `numbertext`;
        numbertext.innerHTML = `${currentNumber} / ${lastNumber}`;
        mySlides.appendChild(numbertext);
      }

      let content = document.createElement(this.tagName);
      Gallery.setSource(content, url, this.hasVideo);
      content.style.width = '100%';
      if (!this.hasVideo) {
        content.ontouchstart = (event) => this.touchStart(event);
        content.ontouchmove = (event) => this.touchMove(event);
        content.ontouchend = (event) => this.touchEnd(event);
        content.ontouchcancel = (event) => this.touchCancel(event);
        content.onmouseup = (event) => this.imageClicked(event, this.hasVideo);
      }
      if (this.hasVideo) {
        Gallery.attributeVideo(content);
      }

      // link.appendChild(img);

      mySlides.appendChild(content);
      container.appendChild(mySlides);

    }

    // create previous and next buttons for moving through images
    let prevButton = document.createElement('a');
    prevButton.className = 'prev';
    prevButton.onclick = () => this.plusSlides(-1);
    prevButton.innerHTML = '&#10094;'

    let nextButton = document.createElement('a');
    nextButton.className = 'next';
    nextButton.onclick = () => this.plusSlides(1);
    nextButton.innerHTML = '&#10095;'

    container.appendChild(prevButton);
    container.appendChild(nextButton);

    // create caption area
    let caption_container = document.createElement('div');
    caption_container.className = `caption-container`;

    let caption = document.createElement('p');
    caption.id = `caption_gallery${this.id}`;

    caption_container.appendChild(caption);

    container.appendChild(caption_container);

    // create and add thumbnails

    let row = document.createElement('div');
    row.className = `row`;

    let index = 1;
    for (let url of this.urls) {
      let col = document.createElement('div');
      col.className = `column`;
      let content = document.createElement(this.tagName);
      Gallery.setSource(content, url, this.hasVideo)
      content.style.width = '100%';
      content.alt = this.alts[index - 1];
      content.className = `demo demo_gallery${this.id} img-cursor`;
      content.onclick = createThumbnailOnclick(this, index);
      if (this.hasVideo) {
        Gallery.attributeVideo(content);
      }
      col.appendChild(content);
      row.appendChild(col);
      index++;
    }

    container.appendChild(row);

    // add container to parent
    document.querySelector(`#${this._pid}`).appendChild(container);

    this.currentSlide(1);
  }

  static attributeVideo(videoElt) {
    videoElt.setAttribute('controls', '');
    videoElt.setAttribute('autoplay', '');
    videoElt.setAttribute('loop', '');
    videoElt.setAttribute('muted', '');
    videoElt.setAttribute('playsinline', '');
  }

  addModalContent(contentURL) {
    let modalContent = document.querySelector(`#modal-content_${this._pid}`);

    let src = contentURL;
    let content = document.createElement(this.tagName);
    Gallery.setSource(content, contentURL, this.hasVideo);
    content.style.maxWidth = '100%';
    content.style.maxHeight = '80vh';
    if (this.hasVideo) {
      Gallery.attributeVideo(content);
    }
    modalContent.style.display = 'grid';
    modalContent.style.alignContent = 'center';
    modalContent.style.justifyContent = 'center';

    let slide = document.createElement('div');
    slide.style.display = 'block';
    slide.appendChild(content);

    modalContent.appendChild(slide);

    let modal = document.querySelector(`#myModal_${this._pid}`);
    if (!modal.onclick) {
      modal.onclick = (event) => {
        if (event.target.tagName.toLowerCase() != 'img') {
          this.closeModal();
        }
      };
    }
  }

  static getContentSource(contentElt, hasVideo) {
    if (hasVideo) {
      return contentElt.getAttribute('data-video-src');
    } else {
      return contentElt.src;
    }
  }

  imageClicked(event, hasVideo) {
    let url = Gallery.getContentSource(event.currentTarget, hasVideo);
    console.log(url);
    this.addModalContent(url);
    this.openModal();
  }

  openModal() {
    let modal = document.getElementById(`myModal_${this._pid}`);
    modal.style.display = "block";
    modal.focus();
  }

  clearModalContents() {
    let modalContent = document.getElementById(`modal-content_${this._pid}`);
    // clear children
    modalContent.innerHTML = ' ';
  }

  // Close the Modal
  closeModal() {
    let modal = document.getElementById(`myModal_${this._pid}`);
    modal.style.display = "none";
    this.clearModalContents();
  }

  clearCoordinates() {
    this.beganX = null;
    this.beganY = null;
    this.lastX = null;
    this.lastY = null;
  }

  keyPressed(event) {
    if (event.keyCode == 37) { // left
      let newSlide = this.plusSlides(-1);
      event.currentTarget.focus();
      event.preventDefault();
      return newSlide;
    } else if (event.keyCode == 39) { //right
      let newSlide = this.plusSlides(1);
      event.currentTarget.focus();
      event.preventDefault();
      return newSlide;
    }
  }

  touchStart(event) {
    this.beganX = event.touches[0].clientX;
    this.beganY = event.touches[0].clientY;
    this.changing = true;
  }

  touchMove(event) {
    let x = event.touches[0].clientX;
    let y = event.touches[0].clientY;
    let dx = x - this.beganX;
    let dy = y - this.beganY;
    if (dy / dx > 1.5) {
      this.clearCoordinates();
      this.changing = false;
    } else {
      this.lastX = x;
      this.lastY = y;
      event.preventDefault();
    }
  }

  touchEnd(event) {
    if (this.changing && this.lastX == null) {
      // event.target.parentNode.click();
      return;
    }
    let dx = this.beganX - this.lastX;
    let result = this.plusSlides(dx > 0 ? 1 : -1);
    this.clearCoordinates();
    this.changing = false;
    return result;
  }

  touchCancel(event) {
    this.clearCoordinates()
    this.changing = false;
  }

  // Next/previous controls
  // returns the new current div 'mySlide'
  plusSlides(n) {
    return this.showSlides(this.slideIndex += n);
  }

  // Thumbnail image controls
  // returns the new current div 'mySlide'
  currentSlide(n) {
    return this.showSlides(this.slideIndex = n);
  }

  showSlides(n) {
    let i;
    let slides = document.getElementsByClassName(`slides_gallery${this.id}`);
    if (slides.length == 0) {
      return;
    }
    let dots = document.getElementsByClassName(`demo_gallery${this.id}`);
    let captionText = document.getElementById(`caption_gallery${this.id}`);
    if (n > slides.length) { this.slideIndex = 1 }
    if (n < 1) { this.slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = `none`;
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(` active`, "");
    }
    slides[this.slideIndex - 1].style.display = "block";
    dots[this.slideIndex - 1].className += ` active`;
    captionText.innerHTML = dots[this.slideIndex - 1].alt;
    return slides[this.slideIndex - 1];
  }


}
