/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by platar86, 2019
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 Sout Africa
 *  Phone: 021 555 2181
 *  
 */



/* global HTMLElement, hh */

function HidSlider(el, conf, name) {
    if (!hh.isElement(el)) {
        console.warn("Not valid HTML Element", el);
    }
    this.el = el;
    if (name) {
        this.name = name;
    }

    this.conf = conf || {};
    this.val = this.conf.val || 0;//Changed from 1 to 0

    this.onValueChangeArr = [];
    this.onChange = null;

    this.init();
}



HidSlider.prototype.updateLabel = function () {
    if (this.label) {
        let label = this.val;
//        console.log(this.val);
        if (typeof (this.conf.labelFormatter) === 'function') {
            label = this.conf.labelFormatter(label);
        }
        this.label.textContent = label;
    }
};

HidSlider.prototype.init = function () {
    if (!this.label) { //to avoid reinit
        this.container = document.createElement('div');
//        this.container.style.setProperty('margin', 'auto');
        hh.addClass(this.container, 'smdui-sliderHidden-wraper');
        hh.addClass(this.container, this.conf.containerClass);


        this.el.appendChild(this.container);

        this.label = document.createElement('span');
        hh.addClass(this.label, this.conf.labelClass);
        this.label.style.setProperty('postition', 'relative');

        if (typeof (this.conf.onValueChange) === 'function') {
//            this.onValueChangeArr.push(this.conf.onValueChange);
            this.onChange = this.conf.onValueChange;
        }

        this.container.appendChild(this.label);

        if (typeof (this.conf.onInitComplete) === 'function') {
            this.onInitComplete(this.conf.val, this.label.textContent, this);
        }

        this.updateLabel();
        this.label.onclick = this.showSlider.bind(this);

        this.dialog = document.createElement('div');
        hh.addClass(this.dialog, this.conf.dialogClass);
        hh.addClass(this.dialog, 'smdui-sliderHidden-dialog');

        this.container.appendChild(this.dialog);

        this.dialog.style.setProperty('z-index', '1001');

        this.input = document.createElement('input');
        this.input.type = 'range';

        this.input.step = isNaN(this.conf.step) ? 1 : this.conf.step;
        this.input.min = isNaN(this.conf.minVal) ? 1 : this.conf.minVal;
        this.input.max = isNaN(this.conf.maxVal) ? 100 : this.conf.maxVal;

        this.input.value = this.val || 1;

        hh.addClass(this.input, this.conf.inputClass);
        hh.addClass(this.input, 'smdui-sliderHidden-input');

        this.input.oninput = function () {
            this.val = Number(this.input.value);
            this.updateLabel();
            if (typeof (this.conf.onSlide) === 'function') {
                this.onSlide(this.val, this.label.textContent, this);
            }
        }.bind(this);

        this.input.onchange = function () {
            this.val = Number(this.input.value);

            if (typeof (this.onChange) === 'function') {
                this.onChange(this.val, this.label.textContent, this);
            }

            if (this.conf.hideOnChange) {
                this.hideSlider();
            }
        }.bind(this);

        this.input.addEventListener('focusout', this.hideSlider.bind(this));

        this.dialog.appendChild(this.input);
    }
};

HidSlider.prototype.setValue = function (val) {
    this.input.value = Number(val);
    this.input.onchange();

};

HidSlider.prototype.setMax = function (val) {
    this.input.max = Number(val);
    this.input.onchange();

};

HidSlider.prototype.showSlider = function () {
    let pos = hh.getCoords(this.container);
    this.dialog.style.setProperty("display", 'block');
    this.dialog.style.setProperty("position", 'absolute');
    this.dialog.style.setProperty('left', '2 px');
    this.dialog.style.setProperty('top', '21 px');

    this.input.focus();

};

HidSlider.prototype.hideSlider = function () {
    this.dialog.style.setProperty("display", 'none');
};
