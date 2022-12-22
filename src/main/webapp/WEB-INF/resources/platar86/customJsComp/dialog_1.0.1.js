/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */
/* global hh, init */

(function (root) {
    var globOb = {dialogArr: []};

    let SMDUIDialog = function (conf) {
        this.parentEl = document.querySelector('body');
        this.conf = conf || {};
        this.conf.draggable = this.conf.draggable || true;
        init.call(this);
        if (this.conf.open) {
            this.show();
        } else {
            this.hide();
        }
        globOb.dialogArr.push(this);
    };

    let prot = SMDUIDialog.prototype;

    prot.getZIndex = function () {
        return this.container.style.zIndex;
    };
    prot.setZIndex = function (zIndex) {
        if (!isNaN(zIndex)) {
            this.container.style.zIndex = zIndex;
        }
    };

    prot.open = function (contentEl) {

        if (contentEl && hh.isElement(contentEl)) {
            this.contentDiv.innerHTML = contentEl.innerHTML;
        }

        this.container.style.display = 'block';

        if (this.conf.modal) {
            this.backdrop.style.display = 'block';
        }

        if (!this.inited && !this.conf.isFullscreen && !this.conf.position && !this.isFullscreen) {
            this.container.style.left = "0px";
            this.container.style.top = "0px";
            let xPos;
            let yPos;

            if (this.conf.position) {
                if (this.conf.position.x) {
                    xPos = this.conf.position.x;
                }
                if (this.conf.position.y) {
                    yPos = this.conf.position.y;
                }
            } else {
                xPos = (innerWidth - (this.container.clientWidth + innerWidth) / 2);
                yPos = (innerHeight - (this.container.clientHeight + innerHeight) / 2);
            }


            if (this.conf.draggable) {
                dragElement.call(this, this.container, xPos, yPos);
            }

            this.container.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
            this.container.lastTransform = this.container.style.transform;
            this.inited = true;
        }
        if (typeof (this.conf.onshow) === 'function') {
            this.conf.onshow(this);
        }

        if (this.conf.css) {
            hh.addCssToDom(this.conf.css, this.container);
        }

        //put in front
        if (this.getZIndex() !== '502') {
            window.setTimeout(function () {
                for (var i = 0; i < globOb.dialogArr.length; i++) {
                    globOb.dialogArr[i].setZIndex(501);
                }
                //wait for JS task queue to complete
//                console.log('on dialog open ' + this.headerDiv.headingpan.innerHTML);
                this.setZIndex(502);
            }.bind(this), 10);
        }

        return this;
    };
    prot.show = prot.open;


    prot.setBarTitle = function (title) {
        this.headerDiv.headingpan.innerHTML = title;
    };

    //single is used to keep last position of dialog
    prot.move = function (x, y, single) {
        if (single) {
            if (this.firstMove) {
                return;
            }
            this.firstMove = true;
        }
        this.container.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
        this.container.lastTransform = this.container.style.transform;
        dragElement.call(this, this.container, x, y);
    };

//    prot.move = function (x, y) {
//        this.container.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
//         this.container.lastTransform = this.container.style.transform;
//    };

    function onWindowCloseBtn() {
        if (this.conf.onCloseButton) { //To differentiate between click and internal js call
            if (typeof (this.conf.onCloseButton) === 'function') {
                this.conf.onCloseButton(this);
            }
        }
        this.close();
    }
    prot.close = function () {

        this.container.style.display = 'none';
        if (this.conf.modal) {
            this.backdrop.style.display = 'none';
        }
        if (this.conf.onClose) {
            if (typeof (this.conf.onClose) === 'function') {
                this.conf.onClose(this);
            }
        }
    };
    prot.hide = prot.close;

    root.SMDUIDialog = SMDUIDialog;

//////////////Internal functionality////////////////////

    function init() {

        this.container = document.createElement('div');
        this.container.onclick = function () {
            if (this.getZIndex() !== '502') {
                for (var i = 0; i < globOb.dialogArr.length; i++) {
                    globOb.dialogArr[i].setZIndex(501);
                }
//                console.log('onMosueClick ' + this.headerDiv.headingpan.innerHTML);
                this.setZIndex(502);
            }
        }.bind(this);

        this.container.style.zIndex = '501';
        this.container.style.boxShadow = "rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px";
//        box-shadow: ;

        hh.addClass(this.container, ['smdui-dialog', 'ui-corner-all']);

        this.headerDiv = document.createElement('div');
        this.headerDiv.dialogInstance = this;
        this.headerDiv.style.minHeight = '25px';
        hh.addClass(this.headerDiv, ['smdui-dialog-titlebar']);
        this.headerDiv.style.borderTopLeftRadius = "5px";
        this.headerDiv.style.borderTopRightRadius = "5px";

        this.container.appendChild(this.headerDiv);

        this.headerDiv.headingpan = document.createElement('span');
        hh.addClass(this.headerDiv.headingpan, 'ui-dialog-title');
        this.headerDiv.appendChild(this.headerDiv.headingpan);
        this.headerDiv.headingpan.style.paddingLeft = '5px';
        this.headerDiv.headingpan.style.pointerEvents = 'none';
        this.headerDiv.headingpan.style.color = 'white';

        if (this.conf.heading) {
            this.headerDiv.headingpan.innerHTML = this.conf.heading;
        }

        this.headerDiv.controlsDiv = document.createElement('div');
        this.headerDiv.controlsDiv.style.display = 'flex';
//        this.headerDiv.controlsDiv.style.float = 'right';
//        this.headerDiv.controlsDiv.style.float = 'right';
//        this.headerDiv.controlsDiv.style.position = 'relative'; //KP added to fix resize on window
//        this.headerDiv.controlsDiv.style.width = '50px'; //KP added to fix resize on window
        hh.addClass(this.headerDiv.controlsDiv, ['ui-corner-all']);

        this.headerDiv.controlsDiv.fullscreenButton = document.createElement('span');
//        this.headerDiv.controlsDiv.fullscreenButton.style.position = 'absolute'; //KP added to fix resize on window
//        this.headerDiv.controlsDiv.fullscreenButton.style.right = '25px'; //KP added to fix resize on window
        hh.addClass(this.headerDiv.controlsDiv.fullscreenButton, ['fa', 'fa-expand', 'smdui-dialog-titlebar-icon']);
        this.headerDiv.controlsDiv.appendChild(this.headerDiv.controlsDiv.fullscreenButton);
        this.headerDiv.controlsDiv.fullscreenButton.style.color = "white";
        this.headerDiv.appendChild(this.headerDiv.controlsDiv);

        this.headerDiv.controlsDiv.closeButton = document.createElement('span');
//        this.headerDiv.controlsDiv.closeButton.style.position = 'absolute'; //KP added to fix resize on window
//        this.headerDiv.controlsDiv.closeButton.style.right = '5px'; //KP added to fix resize on window
        hh.addClass(this.headerDiv.controlsDiv.closeButton, ['fa', 'fa-window-close', 'smdui-dialog-titlebar-icon']);
        this.headerDiv.controlsDiv.appendChild(this.headerDiv.controlsDiv.closeButton);
        this.headerDiv.controlsDiv.closeButton.style.color = 'white';
        this.headerDiv.controlsDiv.closeButton.onclick = onWindowCloseBtn.bind(this);

        this.contentDiv = document.createElement('div');
        this.contentDiv.style.width = 'auto';
        hh.addClass(this.contentDiv, ['smdui-dialog-content']);
        this.container.appendChild(this.contentDiv);
        this.headerDiv.controlsDiv.fullscreenButton.onclick = onFullscreenClick.bind(this);


        this.footerDiv = hh.div(this.container.appendChild,
                'display: flex; justifyContent: space-evenly;', );
        hh.addClass(this.footerDiv, ['smdui-dialog-footer']);
        this.footerDiv.style.borderBottomLeftRadius = "5px";
        this.footerDiv.style.borderBottomRightRadius = "5px";
//        this.footerDiv = document.createElement('div');
//        this.footerDiv.style.display = 'flex';
//        this.footerDiv.style.justifyContent = 'space-evenly';
//        hh.addClass(this.footerDiv, ['ui-dialog-footer', 'ui-widget-footer']);

        this.container.appendChild(this.footerDiv);

        if (typeof (this.parentEl) === 'string') {
            let pe = document.getElementById(this.parentEl);
            if (pe) {
                pe.appendChild(this.container);
            }
        } else if (typeof (this.parentEl) === 'object') {
            try {
                this.parentEl.appendChild(this.container);
            } catch (e) {
                console.warn(e);
            }
        }


        if (this.conf.modal) {
            //modal functionality
            this.backdrop = hh.div(this.parentEl, 'ui-widget-overlay', 'display: none; zIndex: 500');
//            this.backdrop = document.createElement('div');
//            this.backdrop.classList.add('ui-widget-overlay');
//            this.backdrop.style.display = 'none';
//            this.backdrop.style.zIndex = 500;
//            this.parentEl.appendChild(this.backdrop);
        }

        if (this.conf.onInitComplete) {
            this.conf.onInitComplete(this.contentDiv, this.footerDiv, this);
        }
//
        this.resizeObserver = new ResizeObserver((entries) => {
//            console.log(entries);
        });

        this.resizeObserver.observe(this.container);


        let intersectionOptions = {
            rootMargin: '0px',
            threshold: 1.0
        };

        this.intersectionObserver = new IntersectionObserver(entries => {
            this.container.intersectionRatio = entries[0].intersectionRatio;

        }, intersectionOptions);

        this.intersectionObserver.observe(this.container);

        window.onresize = function () {
        };

    }

    function onFullscreenClick() {
        if (!this.isFullscreen) {
            this.isFullscreen = true;

            this.container.style.width = '100vw';
            this.container.style.height = '100vh';
            this.contentDiv.style.height = '90%';
//            this.contentDiv.style.display = 'grid';
            this.contentDiv.style.alignItems = 'center';
            this.contentDiv.style.justifyContent = 'center';
            this.container.style.maxHeight = '100%';
            this.container.style.left = "0px";
            this.container.style.top = "50px";
            this.container.style.transform = "";

        } else {
            this.contentDiv.style = '';
            this.isFullscreen = false;
            this.container.style.width = 'auto';
            this.container.style.height = '';
            this.container.style.top = "0";
            this.contentDiv.style.display = 'block';
            if (this.container.lastTransform) {
                this.container.style.transform = this.container.lastTransform;
                console.log(this.container.lastTransform);
            }
        }
        this.open();

//        if (!this.isFullscreen) {
//            this.isFullscreen = true;
//            this.container.style.width = '100vw';
//            this.container.style.height = '100vh';
//            this.contentDiv.style.height = '100%';
//            this.contentDiv.style.display = 'grid';
//            this.contentDiv.style.alignItems = 'center';
//            this.container.style.maxHeight = '100%';
//            this.container.style.left = "0px";
//            this.container.style.top = "0px";
//            this.container.style.transform = "";
//
//        } else {
//            this.contentDiv.style = '';
//            this.isFullscreen = false;
//            this.container.style.width = '';
//            this.container.style.height = '';
//            this.contentDiv.style.display = 'block';
//            if (this.container.lastTransform) {
//                this.container.style.transform = this.container.lastTransform;
//            }
//        }
//        this.open();
    }

    function  dragElement(el, xpos, ypos) {
        let draggable = true;
        let dragItem = this.headerDiv;
        let wrapper = this.container;

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

        let dragBeginX;
        let dragBeginY;

        let active = false;

        let x = xpos || 0; //passed when calling dragElement. 
        let y = ypos || 0;

        prot.positionCenter = function () {
            x = (innerWidth - (this.container.clientWidth + innerWidth) / 2);
            y = (innerHeight - (this.container.clientHeight + innerHeight) / 2);
            this.container.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
        };

        function dragStart(e) {
            //put in front if not
//            if (this.getZIndex !== '502') {
//                for (var i = 0; i < globOb.dialogArr.length; i++) {
//                    globOb.dialogArr[i].setZIndex(501);
//                }
//                this.setZIndex(502);
//            }

            if (e.type === 'touchstart') {
                dragBeginX = e.touches[0].clientX - x;
                dragBeginY = e.touches[0].clientY - y;
            } else {
                dragBeginX = e.clientX - x;
                dragBeginY = e.clientY - y;
            }

            if (e.target === dragItem) {
                active = true;
            }
            document.onmouseup = dragEnd.bind(this);
            document.onmousemove = drag;
            this.dialogInstance.container.style.opacity = 0.4;

        }

        function drag(e) {
            if (active) {
                e.preventDefault();
                let dx = 0;
                let dy = 0;

                if (e.type === 'touchmove') {
                    dx = e.touches[0].clientX - dragBeginX - x;
                    dy = e.touches[0].clientY - dragBeginY - y;
                } else {
                    dx = e.clientX - dragBeginX - x;
                    dy = e.clientY - dragBeginY - y;
                }

                if (x + dx < 0) {//check if out of boundry  left
                    x = 0;
                } else if (x + dx > (innerWidth - wrapper.clientWidth)) {//check if out of boundry right
                    x = innerWidth - wrapper.clientWidth;
                } else {
                    x += dx;
                }

                if (y + dy < 50) {//check if out of boundry  top
                    y = 50;
                } else if (y + dy > (innerHeight - wrapper.clientHeight)) {//check if out of boundry bottom
                    y = innerHeight - wrapper.clientHeight;
                } else {
                    y += dy;
                }

//                console.log('xy[%d %d]    dxy[%d %d]  e.client[x:%d y:%d]   dragBegin[x:%d y:%d]   clientWidth[%f]  innerWidth[%f]',
//                        x, y, dx, dy, e.clientX, e.clientY, dragBeginX, dragBeginY, wrapper.clientWidth, innerWidth);

                setTranslate((x), (y));
            }

        }
        function setTranslate(xPos, yPos) {
            el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
            el.lastTransform = el.style.transform;
        }

        function dragEnd() {
            active = false;
            document.onmouseup = null;
            document.onmousemove = null;
            this.dialogInstance.container.style.opacity = 1;
        }
    }



    /////////////////////////////////////////////////////

}(window));

