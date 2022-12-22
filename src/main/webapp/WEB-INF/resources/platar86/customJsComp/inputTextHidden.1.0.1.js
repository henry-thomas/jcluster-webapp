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

function HidInText(el, conf) {
    if (!hh.isElement(el)) {
        console.warn("Not valid HTML Element", el);
    }
    this.el = el;

    this.conf = conf || {};
    this.val = this.conf.val || 1;

    this.onValueChangeArr = [];

    this.init();
}



HidInText.prototype.updateLabel = function () {
    if (this.label) {
        let label = this.val;
        if (typeof (this.labelFormatter) === 'function') {
            label = this.labelFormatter(label);
        }
        this.label.textContent = label;
    }
};

HidInText.prototype.init = function () {
    if (!this.label) { //to avoid reinit
        this.container = document.createElement('div');
        hh.addClass(this.container, 'smdui-inputTextHidden-wraper');
        hh.addClass(this.container, this.conf.containerClass);

        this.el.appendChild(this.container);

        this.label = document.createElement('span');
        hh.addClass(this.label, this.conf.labelClass);
        this.label.style.setProperty('postition', 'relative');

        if (typeof (this.conf.onValueChange) === 'function') {
            this.onValueChangeArr.push(this.conf.onValueChange);
        }

        this.container.appendChild(this.label);

        if (typeof (this.conf.onInitComplete) === 'function') {
            this.onInitComplete(this.conf.val, this.label.textContent, this);
        }

        this.updateLabel();
        this.label.onclick = this.showSlider.bind(this);

        this.dialog = document.createElement('div');
        hh.addClass(this.dialog, this.conf.dialogClass);

        hh.addClass(this.dialog, 'smdui-inputTextHidden-dialog');

        this.container.appendChild(this.dialog);

        this.dialog.style.setProperty('z-index', '1001');

        this.input = document.createElement('input');
        this.input.type = 'text';

        this.input.value = this.val || '';


        hh.addClass(this.input, this.conf.inputClass);
        hh.addClass(this.input, 'smdui-inputTextHidden-input');


        if (!this.conf.inputClas) {
            this.input.style.setProperty('width', this.conf.inputWidth || '50px');
        }

        this.input.oninput = function () {
            this.val = this.input.value;
            this.updateLabel();
            if (typeof (this.conf.onSlide) === 'function') {
                this.onSlide(this.val, this.label.textContent, this);
            }
        }.bind(this);

        this.input.onchange = function () {
            this.val = this.input.value;
            if (this.onValueChangeArr.length > 0) {
                for (var item in this.onValueChangeArr) {
                    this.onValueChangeArr[item](this.val, this.label.textContent, this);
                }
            }

            if (this.conf.hideOnChange) {
                this.hideSlider();
            }
        }.bind(this);

        this.input.addEventListener('focusout', this.hideSlider.bind(this));

        this.dialog.appendChild(this.input);

    }
};

HidInText.prototype.getValue = function () {
    return this.input.value;
};
HidInText.prototype.setValue = function (val) {
    this.input.value = val;
    this.input.oninput();
};

HidInText.prototype.showSlider = function () {
    $(this.dialog).show();
    $(this.label).hide();
    this.input.focus();
    if (this.input.select) {
        this.input.select();
    } else if (this.input.setSelectionRange) {
        this.input.setSelectionRange(0, this.input.value.length);
    }
};

HidInText.prototype.hideSlider = function () {
    if (this.getValue() !== '') {
        if (this.val !== ('' || null || undefined)) {
            $(this.dialog).hide();
            $(this.label).show();
        }
    }
};