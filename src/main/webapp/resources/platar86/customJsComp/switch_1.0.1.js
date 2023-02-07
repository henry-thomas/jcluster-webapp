/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by maria, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */
/* global hh, init */

(function (root) {
    let SMDUISwitch = function (el, conf) {
        if (!hh.isElement(el)) {
            console.warn("Not valid HTML Element", el);
        }
        this.el = el;

        this.conf = conf || {};

        init.call(this);
    };

    let prot = SMDUISwitch.prototype;

    prot.hide = function () {
        this.container.style.display = "none";
    };

    prot.show = function () {
        this.container.style.display = "block";
    };


    function init() {

        this.val = this.conf.val || false;

        if (!this.label) {
            this.container = document.createElement('div');
            hh.addClass(this.container, 'smdui-switch-wraper');
            hh.addClass(this.container, this.conf.containerClass);

            this.el.appendChild(this.container);

            this.label = document.createElement('span');
            hh.addClass(this.label, this.conf.labelClass);
            hh.addClass(this.label, "smdui-switchLabel");
        }

        let swLabel = document.createElement('label');
        swLabel.classList.add('smdui-switchLabel');

        let swInput = document.createElement('input');
        swInput.type = 'checkbox';

        if (this.val) {
            swInput.checked = true;
        }

        this.inputEl = swInput;

        let swSpan = document.createElement('span');
        swSpan.classList.add('smdui-switchSlider');

        if (this.conf.typeStyle === 'sliderRound') {
            swSpan.classList.add('smdui-switchSliderRound');
        }

        swLabel.appendChild(swInput);
        swLabel.appendChild(swSpan);
        this.container.appendChild(swLabel);

        if (typeof (this.conf.onChange) === 'function') {
            this.inputEl.onchange = function () {
                this.val = !this.val;
                this.conf.onChange(this, this.val);
            }.bind(this);

            this.conf.onChange(this, this.val);
        }
    }




    root.SMDUISwitch = SMDUISwitch;

}(window));