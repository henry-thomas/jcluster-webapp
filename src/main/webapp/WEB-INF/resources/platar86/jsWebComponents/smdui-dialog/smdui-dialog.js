/* global customElements */

class Dialog extends HTMLElement {
    constructor() {
        super();
        this.init();
        this.isOpen = false;
        this.isFullscreen = false;
        this.maxWidth = window.matchMedia("(max-width: 640px)");
        this.onWidthChange(this.maxWidth);
        this.maxWidth.addListener(this.onWidthChange.bind(this));
        this.wrapper.onmousedown = this.handleActiveDialog.bind(this);
        this.wrapper.ontouchstart = this.handleActiveDialog.bind(this);
        window.onmousedown = function (ev) {
            if (this.contains(ev.target)) {
                this.wrapper.classList.add('smdui-dialog-wrapper-active');
            } else {
                this.wrapper.classList.remove('smdui-dialog-wrapper-active');
            }
        }.bind(this);
        window.ontouchstart = function (ev) {
            if (this.contains(ev.target)) {
                this.wrapper.classList.add('smdui-dialog-wrapper-active');
            } else {
                this.wrapper.classList.remove('smdui-dialog-wrapper-active');
            }
        }.bind(this);
    }

    init() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('smdui-dialog-wrapper');
        this.wrapper.classList.add('ui-widget-content');
        this.wrapper.classList.add('ui-corner-all');
        this.headerDiv = document.createElement('div');
        this.headerDiv.classList.add('smdui-dialog-header');
        this.headerDiv.classList.add('ui-widget-header');
        this.contentDiv = document.createElement('div');
//        this.contentDiv.classList.add('smdui-dialog-content');
//        this.contentDiv.classList.add('ui-widget-content');
        this.createDialogControls();
        this.wrapper.appendChild(this.headerDiv);
        this.wrapper.appendChild(this.contentDiv);

    }

    connectedCallback() {
//        this.allowFullscreen = false;
        this.appendChild(this.wrapper);
        this.dragElement(this.wrapper);
    }

    set heading(text) {
        this.setAttribute('heading', text);
    }

    get heading() {
        return this.getAttribute('heading');
    }

    set allowFullscreen(allowFullscreen) {
//        if (allowFullscreen !== undefined) {
        if (!allowFullscreen) {
            this.fullscreenToggleButton.style.display = 'none';
        } else {
            this.fullscreenToggleButton.style.display = 'block';
        }
//        } 
    }

    set content(content) {
        this.setContent(content);
    }

    get content() {
        return this.contentDiv.firstChild;
    }

    createDialogControls() {
        this.fullscreenToggleButton = document.createElement('span');
        this.fullscreenToggleButton.classList.add('fas');
        this.fullscreenToggleButton.classList.add('fa-expand');
        this.headerDiv.appendChild(this.fullscreenToggleButton);
        this.fullscreenToggleButton.classList.add('smdui-dialog-control-button');
        this.fullscreenToggleButton.addEventListener('click', this.onFullscreenRequested.bind(this));

        this.closeButton = document.createElement('span');
        this.closeButton.classList.add('far');
        this.closeButton.classList.add('fa-window-close');
        this.closeButton.classList.add('smdui-dialog-control-button');
        this.closeButton.addEventListener('click', this.close.bind(this));
        this.closeButton.addEventListener('touchstart', this.close.bind(this));

        this.headerDiv.appendChild(this.closeButton);
    }

    onFullscreenRequested() {
        if (!this.isFullscreen) {
            this.isFullscreen = true;
            this.wrapper.style.width = '100vw';
            this.wrapper.style.height = '100vh';
            this.contentDiv.style.height = '100%';
            this.contentDiv.style.display = 'grid';
            this.contentDiv.style.alignItems = 'center';
            this.wrapper.style.maxHeight = '100%';
            this.wrapper.style.left = "0px";
            this.wrapper.style.top = "0px";
            this.wrapper.style.transform = "";

        } else {
            this.contentDiv.style = '';
            this.isFullscreen = false;
            this.wrapper.style.width = '';
            this.wrapper.style.height = '';
            this.contentDiv.style.display = 'block';
            if (this.wrapper.lastTransform) {
                this.wrapper.style.transform = this.wrapper.lastTransform;
            }
        }
        this.open();
    }

    open() {
        this.wrapper.classList.add('smdui-dialog-open');
        this.isOpen = true;
        if (!this.isFullscreen) {
            this.wrapper.style.left = (innerWidth - (this.wrapper.clientWidth + innerWidth) / 2).toString() + "px";
            this.wrapper.style.top = (innerHeight - (this.wrapper.clientHeight + innerHeight) / 2).toString() + "px";
        }
    }

    close() {
        this.wrapper.classList.remove('smdui-dialog-open');
        this.isOpen = false;
//        this.wrapper.style = '';
        this.remove();
    }

    setContent(el) {
        try {
            if (this.contentDiv.lastChild) {
                this.contentDiv.removeChild(this.contentDiv.lastChild);
            }
            this.contentDiv.appendChild(el);
            el.classList.add('smdui-dialog-content');
        } catch (e) {
            console.log(e + '- Dialog content should be an element with one parent, but can have nested elements');
        }
    }

    onWidthChange(maxWidth) {

        if (this.isFullscreen) {
            this.wrapper.style.maxHeight = '100%';
            this.wrapper.style.left = "0px";
            this.wrapper.style.top = "0px";
            this.dragElement(this.wrapper);
            return;
        }

        if (maxWidth.matches) {
            this.wrapper.style = '';
            this.wrapper.style.width = '350px';
            this.wrapper.style.left = (innerWidth - (this.wrapper.clientWidth + innerWidth) / 2).toString() + "px";
            this.wrapper.style.top = (innerHeight - (this.wrapper.clientHeight + innerHeight) / 2).toString() + "px";
        } else {
            this.wrapper.style = '';
            this.wrapper.style.width = '450px';
            this.wrapper.style.left = (innerWidth - (this.wrapper.clientWidth + innerWidth) / 2).toString() + "px";
            this.wrapper.style.top = (innerHeight - (this.wrapper.clientHeight + innerHeight) / 2).toString() + "px";
            this.dragElement(this.wrapper);
        }
    }
    onHeightChange(maxHeight) {
        if (maxHeight.matches) {
            this.wrapper.style.height = innerHeight * 0.4 + 'px';
        } else {
            this.wrapper.style.height = 'min-content';
        }
    }

    //if there is more than one dialog on screen, increase the z-index of the clicked one.
    handleActiveDialog() {
        this.wrapper.classList.add('smdui-dialog-wrapper-active');
    }

    dragElement(el) {
        let draggable = !this.isFullscreen;
        let dragItem = this.headerDiv;
        let wrapper = this.wrapper;

        if (draggable) {
            dragItem.onmousedown = dragStart;
            dragItem.addEventListener('touchstart', dragStart, false);
            dragItem.addEventListener('touchend', dragEnd, false);
            dragItem.addEventListener('touchmove', drag, false);
        } else {
            dragItem.onmousedown = null;
            dragItem.addEventListener('touchstart', null);
            dragItem.addEventListener('touchend', null);
            dragItem.addEventListener('touchmove', null);
            el.style.transform = '';
        }

        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        let active = false;

        function dragStart(e) {
            if (e.type === 'touchstart') {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }

            if (e.target === dragItem) {
                active = true;
            }
            document.onmouseup = dragEnd;
            document.onmousemove = drag;
        }

        function drag(e) {
            if (active) {

                e.preventDefault();
                if (e.type === 'touchmove') {

                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                } else {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                }
                xOffset = currentX;
                yOffset = currentY;

                let topOffsetHeight;
                if (window.matchMedia("(max-width: 1000px)").matches) {
                    topOffsetHeight = 65;
                } else {
                    topOffsetHeight = 0;
                }
                ;
                let leftLimitBool = (innerWidth / 2 - wrapper.clientWidth / 2 > -currentX);
                let topLimitBool = (innerHeight / 2 - wrapper.clientHeight / 2 - topOffsetHeight > -currentY);
                let rightLimitBool = (-(wrapper.clientWidth / 2 - innerWidth / 2) > currentX);
                let bottomLimitBool = (-(wrapper.clientHeight / 2 - (innerHeight) / 2) + topOffsetHeight > currentY);

                if (!topLimitBool || !bottomLimitBool) {
                    if (!topLimitBool) {
                        currentY = -(innerHeight / 2 - wrapper.clientHeight / 2) + topOffsetHeight;
                    }
                    if (!bottomLimitBool) {
                        currentY = (innerHeight / 2 - wrapper.clientHeight / 2) + topOffsetHeight;
                    }
                    yOffset = currentY;
                }

                if (!leftLimitBool || !rightLimitBool) {
                    if (!leftLimitBool) {
                        currentX = -(innerWidth / 2 - wrapper.clientWidth / 2);
                    }

                    if (!rightLimitBool) {
                        currentX = (innerWidth / 2 - wrapper.clientWidth / 2);
                    }
                    xOffset = currentX;
                }
                setTranslate((currentX), (currentY));

            }

            function setTranslate(xPos, yPos) {
                el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
                el.lastTransform = el.style.transform;
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            active = false;
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    static get observedAttributes() {
        return ['heading'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'heading') {
            if (!this.headingSpan) {
                this.headingSpan = document.createElement('span');
                this.headingSpan.classList.add('smdui-dialog-heading');
                this.headerDiv.prepend(this.headingSpan);
            }
            this.headingSpan.innerHTML = this.heading;
        }
    }

    disconnectedCallback() {
        this.wrapper.style.transfrom = '';
    }
}

customElements.define('smdui-dialog', Dialog);