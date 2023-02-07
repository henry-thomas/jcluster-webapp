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



/* global HTMLElement, hh, moment */

function InputText(el, conf) {
    if (!hh.isElement(el)) {
        console.warn("Not valid HTML Element", el);
    }
    this.el = el;

    this.conf = conf || {};
    this.val = this.conf.val || "";

    this.onValueChangeArr = [];


    this.container = document.createElement('div');
//        hh.addClass(this.container, 'smdui-inputTextHidden-wraper');
    hh.addClass(this.container, this.conf.containerClass);

    this.el.appendChild(this.container);

    if (typeof (this.conf.onValueChange) === 'function') {
        this.onValueChangeArr.push(this.conf.onValueChange);
    }

    this.inputHideValue = document.createElement('input');
    this.inputHideValue.style.maxWidth = "110px";
    this.inputHideValue.style.display = "none";
    this.inputHideValue.value = "N/A";
    this.inputHideValue.disabled = true;
//    this.inputHideValue.textContent = "N/A";
    this.container.appendChild(this.inputHideValue);
    hh.addClass(this.inputHideValue, 'ui-inputfield');

    this.input = document.createElement('input');
    this.input.style.maxWidth = "110px";
    this.container.appendChild(this.input);

    if (this.conf.type) {
        this.input.type = this.conf.type;
    } else {
        this.input.type = 'text';
    }

    if (this.input.type === 'number') {

        if (this.conf.length) {
            this.input.length = this.conf.length;
        }

    }
    this.input.value = this.val || '';
    if (this.input.type === 'datetime-local') {
        this.input.value = new Date(this.val);
    }

    hh.addClass(this.input, this.conf.inputClass);
    hh.addClass(this.input, 'ui-inputfield');


    this.input.oninput = function () {
        this.val = this.input.value;
//            this.updateLabel();

    }.bind(this);

    this.input.onchange = function () {
        this.val = this.input.value;
        if (this.conf.max) {
            if (Number(this.input.value) > Number(this.conf.max)) {
                this.input.value = this.conf.max;
                console.warn('value (' + this.val + ') exceeds max (' + this.conf.max + ')');
                this.val = this.input.val;
            }
        }

        if (this.conf.min) {
            if (Number(this.input.value) < Number(this.conf.min)) {
                this.input.value = this.conf.min;
                console.warn('value (' + this.val + ') less than min (' + this.conf.min + ')');
                this.val = this.input.val;
            }
        }

        if (this.onValueChangeArr.length > 0) {
            for (var item in this.onValueChangeArr) {
//                    this.onValueChangeArr[item](this, this.val); changed to get it work with Param
                this.onValueChangeArr[item](this.val, this);
            }
        }

        if (this.conf.decimals) {
            this.input.value = Number(this.input.value).toFixed(this.conf.decimals);
        }

    }.bind(this);

    this.updateLabel();
}



InputText.prototype.updateLabel = function () {
//    if (this.input) {
//        let label = this.val;
//        if (typeof (this.conf.labelFormatter) === 'function') {
//            label = this.conf.labelFormatter(label);
//        }
//
//        if (!isNaN(Number(label)) && this.conf.decimals) {
////            label = Number(label).toFixed(this.conf.decimals);
//
//        }
//
//        this.input.value = label;
//    }
};


InputText.prototype.hideValue = function () {
    this.input.style.display = 'none';
    this.inputHideValue.style.display = 'block';
};

InputText.prototype.showValue = function () {
    this.input.style.display = 'block';
    this.inputHideValue.style.display = 'none';
};

InputText.prototype.hide = function () {
    this.container.style.display = 'none';
};

InputText.prototype.show = function () {
    this.container.style.display = 'block';
};

InputText.prototype.getValue = function () {
    if (this.input.type === 'datetime-local') {
//        return this.input.valueAsNumber;
        return new Date(moment(this.input.valueAsNumber).subtract(2, 'hours')).getTime();
    } else if (this.conf.getterFormatter) {
        return this.conf.getterFormatter(this.input.value);
    } else {
        return this.input.value;
    }
};

InputText.prototype.setValue = function (val) {
    if (this.input.type === 'datetime-local') {
        this.input.value = moment(Number(val)).format('YYYY-MM-DDTHH:mm');
        console.log(this.input.value);
    } else if (this.conf.setterFormatter) {
        this.input.value = this.conf.setterFormatter(val);
    } else {
        this.input.value = val;
    }
    this.input.oninput();
    this.input.onchange();
};

