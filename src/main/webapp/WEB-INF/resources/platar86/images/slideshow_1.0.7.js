/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by brais, 2019
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 Sout Africa
 *  Phone: 021 555 2181
 *  
 */

/* global Element, mu */

/**
 * Image Slide Show Manager
 * @param {type} e : DOM element itself, or its ID or its class;
 * @param {type} config
 * @returns {SlideshowManager}
 */
function SlideshowManager(e, config) {
    this.slideIndex = 1;

    /**
     * This container reference is required for managing also the Slideshow
     * inside the Google Map info view
     */
    this.container = document;
    // DOM element that will contain the whole slideshow
    this.slideShow = null;
    this.deleteButton = false;
    this.extraButtons = false;

    // Class name for referencing the slides container
    this.slides_pic = 'slides_pic';
    // Class name for referencing the slides
    this.slides = 'slides';
    this.image_slide = 'image_slide';
    // Class name for referencing the slides controls (prev, dots, next)
    this.controls = 'controls';
    this.dots = 'dots';
    this.dot = 'dot';
    this.prev = 'prev';
    this.next = 'next';
    this.delete_icon = 'delete_icon';
    this.extra_icon = 'extra_icon';
    this.header_pic = 'header_pic';
    this.images = [];

    if (!this.create(e, config))
        return;

    this.init();
}
;

SlideshowManager.prototype.setConfig = function (config) {
    if (!config)
        return;

    this.slides_pic = config.slides_pic || 'slides_pic';
    this.slides = config.slides || 'slides';
    this.image_slide = config.image_slide || 'image_slide';
    this.controls = config.controls || 'controls';
    this.dots = config.dots || 'dots';
    this.dot = config.dot || 'dot';
    this.prev = config.prev || 'prev';
    this.next = config.next || 'next';
    this.delete_icon = config.delete_icon || 'delete_icon';
    this.extra_icon = config.extra_icon || 'extra_icon';
    this.header_pic = config.header_pic || 'header_pic';
};

SlideshowManager.prototype.init = function () {
    this.populateControls();
    this.displayControls();
    this.populateDots();
    this.showSlides(this.slideIndex);
};

/**
 * Creating the required DOM elements for the Image Slideshow
 * @param {type} e : DOM element itself, or its ID or its class;
 * @param {type} config
 * @returns {Boolean}
 */
SlideshowManager.prototype.create = function (e, config) {
    if (!e)
        return false;

    if (config) {
        this.setConfig(config);
        this.setContainer(config.container);
    }

    // Main SlideShow Component
    // Checking if we are passing the DOM element itself
    if (e instanceof Element)
        this.slideShow = e;
    // Checking if we are passing the ID of the DOM element
    if (!this.slideShow) {
        this.slideShow = this.container.querySelector('#' + e);
    }
    // Checking if we are passing the (unique) class of the DOM element
    if (!this.slideShow) {
        this.slideShow = this.container.querySelector('.' + e);
    }
    if (!this.slideShow)
        return;

    this.slideShow.style.display = 'flex';
    this.slideShow.style.flexDirection = 'column';

    let slidePics = document.createElement('div');
    slidePics.classList.add(this.slides_pic);
    this.slideShow.appendChild(slidePics);

    let controls = document.createElement('div');
    controls.classList.add(this.controls);
    controls.style.display = 'none';
    this.slideShow.appendChild(controls);

    if (config) {

        this.addImages(config.images);
        if (config.extraBtns) {
            this.addExtraButtons(config.extraBtns);
        }
        if (config.deleteBtn) {
            this.addDeleteButton(config.deleteBtn);
        }
    }

    return true;
};

SlideshowManager.prototype.addImages = function (images) {
    if (!images || !images.length)
        return;

    for (let i = 0; i < images.length; i++) {
        this.addImage(images[i]);
    }
    if (images.length > 0)
        this.slideShow.querySelector('.' + this.slides).style.display = 'flex';
};

SlideshowManager.prototype.updateImages = function (images) {
    if (!images && !images.length)
        return;

    this.clearImages();
    this.addImages(images);
    this.init();
};

SlideshowManager.prototype.getCurrentImagePath = function () {
    return  this.images[this.slideIndex - 1];
};

SlideshowManager.prototype.addImage = function (image) {
    let slidePics = this.slideShow.querySelector('.' + this.slides_pic);
    this.images.push(image);

    let slide = document.createElement('div');
    slide.classList.add(this.slides);
    slide.classList.add('fade');
    slide.style.display = 'none';
    slidePics.appendChild(slide);

    let imageSlide = document.createElement('img');
    imageSlide.classList.add(this.image_slide);
    imageSlide.classList.add('fade');
    imageSlide.src = mu.getContextPath() + image;
    imageSlide.alt = mu.getContextPath() + '/resources/ultima-layout/images/logo.svg';
    slide.appendChild(imageSlide);
    this.updateDeleteButton(true);
};

SlideshowManager.prototype.addImageAndRefresh = function (image) {
    this.addImage(image);
    this.reloadControls();
};

/**
 * Once is inside DOM elements like the Google Marker Info Window is no longer in the main DOM document element
 * @param {type} container
 * @returns {undefined}
 */
SlideshowManager.prototype.setContainer = function (container) {
    this.container = container || document;
};

SlideshowManager.prototype.plusSlides = function (n) {
    this.showSlides(this.slideIndex += n);
};

SlideshowManager.prototype.currentSlide = function (n) {
    this.showSlides(this.slideIndex = n);
};

SlideshowManager.prototype.populateControls = function () {
    /**
     * The Image navigation controls have been populated previously
     * There is no need for populating them again
     */
    if (this.slideShow.querySelector('.' + this.dots))
        return;

    let slides = this.slideShow.querySelectorAll('.' + this.slides);
    if (!slides || !slides.length)
        return;

    let slideshowManager = this;
    let controls = this.slideShow.querySelector('.' + this.controls);
    if (!controls)
        return;

    let prevDiv = document.createElement('div');
    let prevLink = document.createElement('a');
    prevLink.classList.add(this.prev);
    prevLink.innerHTML = '&#10094;';
    prevLink.addEventListener('click', function () {
        slideshowManager.plusSlides(-1);
    });
    prevDiv.appendChild(prevLink);
    controls.appendChild(prevDiv);

    let dotsDiv = document.createElement('div');
    dotsDiv.classList.add(this.dots);
    controls.appendChild(dotsDiv);

    let nextDiv = document.createElement('div');
    let nextLink = document.createElement('a');
    nextLink.classList.add(this.next);
    nextLink.innerHTML = '&#10095;';
    nextLink.addEventListener('click', function () {
        slideshowManager.plusSlides(1);
    });
    nextDiv.appendChild(nextLink);
    controls.appendChild(nextDiv);
};

SlideshowManager.prototype.displayControls = function () {
    let controls = this.slideShow.querySelector('.' + this.controls);
    if (!controls)
        return;

    let slides = this.slideShow.querySelectorAll('.' + this.slides);
    if (!slides || !slides.length)
        controls.style.display = 'none';
    else
        controls.style.display = 'flex';
};

SlideshowManager.prototype.populateDots = function () {
    let slideshowManager = this;

    let slides = this.slideShow.querySelectorAll('.' + this.slides);
    if (!slides || !slides.length)
        return;

    let dots = this.slideShow.querySelector('.' + this.dots);

    if (!dots)
        return;
    for (let i = 0; i < slides.length; i++) {
        let dot = document.createElement('span');
        dot.classList.add(this.dot);
        dot.addEventListener('click', function () {
            slideshowManager.currentSlide(i + 1);
        });
        dots.appendChild(dot);
    }
};

SlideshowManager.prototype.removeDots = function () {
    let dots = this.slideShow.querySelector('.' + this.dots);
    if (!dots)
        return;
    while (dots.firstChild) {
        dots.removeChild(dots.firstChild);
    }
    dots.innerHTML = '';
};

SlideshowManager.prototype.reloadControls = function (n) {
    this.populateControls();
    this.displayControls();
    this.removeDots();
    this.populateDots();

    if (n) {
        this.currentSlide(n);
        return;
    }
    let dots = this.slideShow.querySelectorAll('.' + this.dot);
    this.currentSlide(dots.length);
};

SlideshowManager.prototype.showSlides = function (n) {
    let i;

    let slides = this.slideShow.querySelectorAll('.' + this.slides);
    if (!slides || !slides.length)
        return;

    let dots = this.slideShow.querySelectorAll('.' + this.dot);
    if (!dots || !dots.length)
        return;

    if (n > slides.length) {
        this.slideIndex = 1;
    }
    if (n < 1) {
        this.slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }
    slides[this.slideIndex - 1].style.display = 'flex';
    dots[this.slideIndex - 1].classList.add('active');
};

/**
 * Creating the DOM element (header) that will contain the delete button and the extra added buttons
 *
 */
SlideshowManager.prototype.createHeader = function () {
    let headerDiv = this.slideShow.querySelector('.' + this.header_pic);
    if (!headerDiv) {
        let slides_pic = this.slideShow.querySelector('.' + this.slides_pic);
        if (!slides_pic)
            return null;

        headerDiv = document.createElement('div');
        headerDiv.classList.add(this.header_pic);
        slides_pic.parentNode.insertBefore(headerDiv, slides_pic);
    }

    headerDiv.style.display = this.extraButtons || this.slideShow.querySelector('.' + this.slides) ? 'flex' : 'none';
    headerDiv.style.justifyContent = this.extraButtons ? 'space-between' : 'flex-end';
    return headerDiv;
};

/**
 * Adding the list of provided extra buttons
 * @param {type} btns : list of DOM elements, ids or unique classes of the mentioned extra buttons
 */
SlideshowManager.prototype.addExtraButtons = function (btns) {
    if (!btns || !Array.isArray(btns))
        return;

    this.extraButtons = true;
    let headerDiv = this.createHeader();
    if (!headerDiv)
        return;

    for (let i = 0; i < btns.length; i++) {
        let btn = null;

        // Checking if we are passing the DOM element itself
        if (btns[i] instanceof Element)
            btn = btns[i];
        // Checking if we are passing the ID of the DOM element
        if (!btn)
            btn = document.querySelector('#' + btns[i]);
        // Checking if we are passing the (unique) class of the DOM element
        if (!btn)
            btn = this.container.querySelector('.' + btns[i]);
        if (!btn)
            continue;

        btn.parentNode.removeChild(btn);
        headerDiv.appendChild(btn);
        btn.classList.add(this.extra_icon);
    }
};

/**
 * Adding the a delete button in order to delete images from the Slideshow
 * @param fns : names of the external functions that will be executed after triggering the delete button, 
 *              this value could be just true for having the default behaviour 
 */
SlideshowManager.prototype.addDeleteButton = function (fns) {
    this.deleteButton = true;

    let headerDiv = this.createHeader();
    if (!headerDiv)
        return;
    let deleteIcon = document.createElement('span');
    headerDiv.appendChild(deleteIcon);
    deleteIcon.classList.add(this.delete_icon);
    deleteIcon.classList.add('fa');
    deleteIcon.classList.add('fa-trash');
    if (this.extraButtons)
        deleteIcon.style.display = this.slideShow.querySelector('.' + this.slides) ? 'block' : 'none';

    let slideshowManager = this;
    deleteIcon.addEventListener('click', function () {
        let index = slideshowManager.slideIndex;
        slideshowManager.deleteImage(index);
        if (fns && Array.isArray(fns))
            for (let i = 0; i < fns.length; i++) {
                if (typeof fns[i] === 'function') {
                    fns[i]([{name: 'slideIndex', value: index}]);
                }
            }
    });
};

SlideshowManager.prototype.updateDeleteButton = function (visible) {
    if (!this.deleteButton)
        return;

    if (!this.extraButtons)
        this.slideShow.querySelector('.' + this.header_pic).style.display = visible ? 'flex' : 'none';
    else
        this.slideShow.querySelector('.' + this.delete_icon).style.display = visible ? 'block' : 'none';
};

SlideshowManager.prototype.deleteImage = function (index) {
    if (!index)
        index = this.slideIndex;

    let slides = this.slideShow.querySelectorAll('.' + this.slides);
    if (!slides || !slides.length)
        return;

    if (index > slides.length || index < 1)
        return;

    slides[index - 1].parentNode.removeChild(slides[index - 1]);
    this.reloadControls(index);
    if (slides.length === 1) {
        this.updateDeleteButton(false);
    }
};

SlideshowManager.prototype.clearImages = function () {
    let slidePics = this.slideShow.querySelector('.' + this.slides_pic);
    if (slidePics)
        slidePics.innerHTML = '';
    let controls = this.slideShow.querySelector('.' + this.controls);
    if (!controls)
        return;
    controls.style.display = 'none';
    controls.innerHTML = '';
};

// Exporting Symbols for Closure
// If we are not going to compile with closure then we can remove the code below.
window['SlideshowManager'] = SlideshowManager;

SlideshowManager.prototype['setConfig'] = SlideshowManager.prototype.setConfig;
SlideshowManager.prototype['init'] = SlideshowManager.prototype.init;
SlideshowManager.prototype['create'] = SlideshowManager.prototype.create;
SlideshowManager.prototype['addImages'] = SlideshowManager.prototype.addImages;
SlideshowManager.prototype['updateImages'] = SlideshowManager.prototype.updateImages;
SlideshowManager.prototype['addImage'] = SlideshowManager.prototype.addImage;
SlideshowManager.prototype['addImageAndRefresh'] = SlideshowManager.prototype.addImageAndRefresh;
SlideshowManager.prototype['setContainer'] = SlideshowManager.prototype.setContainer;
SlideshowManager.prototype['plusSlides'] = SlideshowManager.prototype.plusSlides;
SlideshowManager.prototype['currentSlide'] = SlideshowManager.prototype.currentSlide;
SlideshowManager.prototype['populateControls'] = SlideshowManager.prototype.populateControls;
SlideshowManager.prototype['displayControls'] = SlideshowManager.prototype.displayControls;
SlideshowManager.prototype['populateDots'] = SlideshowManager.prototype.populateDots;
SlideshowManager.prototype['removeDots'] = SlideshowManager.prototype.removeDots;
SlideshowManager.prototype['reloadControls'] = SlideshowManager.prototype.reloadControls;
SlideshowManager.prototype['showSlides'] = SlideshowManager.prototype.showSlides;
SlideshowManager.prototype['createHeader'] = SlideshowManager.prototype.createHeader;
SlideshowManager.prototype['addExtraButtons'] = SlideshowManager.prototype.addExtraButtons;
SlideshowManager.prototype['addDeleteButton'] = SlideshowManager.prototype.addDeleteButton;
SlideshowManager.prototype['updateDeleteButton'] = SlideshowManager.prototype.updateDeleteButton;
SlideshowManager.prototype['deleteImage'] = SlideshowManager.prototype.deleteImage;
SlideshowManager.prototype['clearImages'] = SlideshowManager.prototype.clearImages;

