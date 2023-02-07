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

//MUST CHANGE VERSION!!!

/* global HTMLElement, hh */

function SMDUIDropDown(el, conf, name) {
    if (!hh.isElement(el)) {
        console.warn("Not valid HTML Element", el);
    }
    if (name) {
        this.name = name;
    }

    this.el = el;
    this.conf = conf || {};
    this.val = this.conf.val || "";
    this.optionsElArr = [];

    this.init();
}


SMDUIDropDown.prototype.getItemArr = function () {
    return clone(this.conf.options);
};

SMDUIDropDown.prototype.hide = function () {
    $(this.container).hide();
};
SMDUIDropDown.prototype.show = function () {
    $(this.container).show();
};


SMDUIDropDown.prototype.hideValue = function () {
    this.label.style.display = 'none';
    this.inputHideValue.style.display = 'flex';
};

SMDUIDropDown.prototype.showValue = function () {
    this.label.style.display = 'flex';
    this.inputHideValue.style.display = 'none';
};

SMDUIDropDown.prototype.init = function () {
    if (!this.label) { //to avoid reinit
        this.container = document.createElement('div');
        hh.addClass(this.container, 'smdui-dropdown-wraper');
        hh.addClass(this.container, this.conf.containerClass);
        this.el.appendChild(this.container);

        if (this.conf.hidden) {
            this.hide();
        }

        this.screenFilter = document.createElement('div');
        hh.addClass(this.screenFilter, 'smdui-dropdown-screenFilter');
        this.screenFilter.onclick = function () {
            $(this.dialog).hide();
            $(this.screenFilter).hide();
        }.bind(this);

        this.container.appendChild(this.screenFilter);

        this.inputHideValue = document.createElement('input');
        this.inputHideValue.style.maxWidth = "110px";
        this.inputHideValue.style.display = "none";
        this.inputHideValue.value = "N/A";
        this.inputHideValue.disabled = true;
        hh.addClass(this.inputHideValue, 'ui-inputfield');
        this.container.appendChild(this.inputHideValue);

        this.label = document.createElement('span');
        hh.addClass(this.label, this.conf.labelClass);
        hh.addClass(this.label, 'smdui-dropdown-label');
        hh.addClass(this.label, 'ui-inputfield');
//        this.label.style.padding = 'inherit';
//        this.label.style.width = 'auto';


        this.container.appendChild(this.label);

        this.dialog = document.createElement('div');
        hh.addClass(this.dialog, 'smdui-dropdown-content');
        hh.addClass(this.dialog, this.conf.containerClass);
        this.container.appendChild(this.dialog);

        this.initItems();

        if (typeof (this.conf.onInitComplete) === 'function') {
            this.onInitComplete(this.conf.val, this.label.textContent, this);
        }

        this.label.onclick = function () {
            if (!event.target.matches('.sui-dropdown-wrapper')) {
                if (!event.target.matches('.smdui-dropdown-content')) {
                    $('.smdui-dropdown-content').hide();
                    $('.smdui-dropdown-screenFilter').hide();
                    let labels = $('.smdui-dropdown-label').get();
                    for (let i in labels) {
                        labels[i].isopen = false;
                    }
                }
            }

            if (!this.label.isopen) {
                this.open();
            } else {
                this.close();
            }

        }.bind(this);

//*The following event listener hides the dropdown menus*// 
        //******after an away click********//
        window.addEventListener("click", function (event) {
            if (!event.target.matches('.smdui-dropdown-label')) {
                $('.smdui-dropdown-content').hide();
                $('.smdui-dropdown-screenFilter').hide();
                let labels = $('.smdui-dropdown-label').get();
                for (let i in labels) {
                    labels[i].isopen = false;
                }

            }
        }.bind(this));
    }
//    console.log('item');
};

SMDUIDropDown.prototype.open = function () {
    $(this.screenFilter).show();
    $(this.dialog).show();
    this.label.isopen = true;
};

SMDUIDropDown.prototype.close = function () {
    $(this.screenFilter).hide();
    $(this.dialog).hide();
    this.label.isopen = false;
};

SMDUIDropDown.prototype.reloadItem = function (options, selection) {
    hh.removeAllChilds(this.dialog);
    this.optionsElArr.length = 0;
    this.conf.options = options;
    this.conf.val = selection;
    this.initItems();
};

SMDUIDropDown.prototype.initItems = function () {
    if (this.conf.options && (Array.isArray(this.conf.options) || typeof (this.conf.options) === 'object')) {
        for (let i in this.conf.options) {
            let opt = this.conf.options[i];
            if (opt.label === undefined || opt.value === undefined) {
                continue;
            }

            let item = document.createElement('span');
            hh.addClass(item, this.conf.labelClass);
            for (var field in opt) {
//                    item['data-' + field] = opt[field];
                item.dataset[field] = opt[field];
            }
            item.textContent = opt.label || "";
            this.optionsElArr.push(item);
            this.dialog.appendChild(item);

            item.onclick = this.onItemClick.bind(this, item);

            if (opt.value === this.conf.val) {

                this.selectedVal = opt.value; //to ignore change on init
                this.setValue(opt.value);
            }




        }
        if (this.getSelected() === null) {
//            if(Object.keys(this.conf.options).length > 0){
            for (let i in this.conf.options) {
                let opt = this.conf.options[i];
                this.selectedVal = opt.value;
                this.setValue(opt.value);
                break;
            }
        }
    }

};
SMDUIDropDown.prototype.getValue = function () {
    return  this.selectedVal;
};

SMDUIDropDown.prototype.getLabelFromItemValue = function (val) {
    for (var idx in this.conf.options) {
        if (this.conf.options[idx].value.toString() === val.toString()) {
            return this.conf.options[idx].label;
        }
    }
    return "_unknown";
};

SMDUIDropDown.prototype.getLabel = function () {
    if (this.getSelected().label) {
        return this.getSelected().label;
    }
    return null;
};

SMDUIDropDown.prototype.getSelected = function () {
    for (let i in this.conf.options) {
        if ((this.conf.useStrictCompare && this.conf.options[i].value === this.selectedVal)
                || (!this.conf.useStrictCompare && this.parseNotStrict(this.conf.options[i].value, this.selectedVal))) {
            return this.conf.options[i];
        }
    }
    return null;
};

SMDUIDropDown.prototype.update = function () {
    for (let i in this.conf.options) {
        if (this.conf.options[i].value === this.selectedVal) {
            this.conf.onValueChange(this.selectedVal, this);
        }
    }
};
//use this function for item with string containing escape charachters and others
//remove special charchter then parse, enable by default 
SMDUIDropDown.prototype.parseNotStrict = function (a, b) {
    try {
        if (String(a) === String(b)) {
            return true;
        } else {
            return a
                    .replace(/\n/g, "")
                    .replace(/\r/g, "")
                    .replace(/\t/g, "")
                    .replace("\\n", "")
                    .replace("\\t", "")
                    .replace("\\r", "")
                    === b
                    .replace(/\n/g, "")
                    .replace(/\r/g, "")
                    .replace(/\t/g, "")
                    .replace("\\n", "")
                    .replace("\\t", "")
                    .replace("\\r", "");
        }
    } catch (e) {

    }
    return false;
};
SMDUIDropDown.prototype.setValue = function (val) {
    for (var i = 0; i < this.optionsElArr.length; i++) {
        let itemData = this.optionsElArr[i].dataset;
        if (itemData && (
                (this.conf.useStrictCompare && itemData.value === val)
                || (!this.conf.useStrictCompare && this.parseNotStrict(itemData.value, val))
                )) {
            let oldVal = this.selectedVal;
            this.selectedVal = itemData.value;
            this.label.textContent = itemData.label;

            this.label.icon = document.createElement('span');
            hh.addClass(this.label.icon, 'ui-icon');
            hh.addClass(this.label.icon, 'ui-icon-triangle-1-s');
            this.label.appendChild(this.label.icon);

            if (!this.conf.ignorePreviousValueSame) {
                if (this.selectedVal !== oldVal) {
                    if (typeof (this.conf.onValueChange) === 'function') {
                        this.conf.onValueChange(this.selectedVal, this);
                    }
                }
            } else {
                if (typeof (this.conf.onValueChange) === 'function') {
                    this.conf.onValueChange(this.selectedVal, this);
                }
            }
            return;
        }
    }

    for (var i = 0; i < this.optionsElArr.length; i++) {
        let itemData = this.optionsElArr[i].dataset;
        if (itemData && itemData.label === val) {
            let oldVal = this.selectedVal;
            this.selectedVal = itemData.value;
            this.label.textContent = itemData.label;
            if (this.selectedVal !== oldVal) {
                if (typeof (this.conf.onValueChange) === 'function') {
                    this.conf.onValueChange(this.selectedVal, this);
                }
            }


            return;
        }
    }
    console.warn('Dropdown selcting unknown value!', val);

    if (!this.conf.noDefault && this.optionsElArr.length > 0) {
        let oldVal = this.selectedVal;
        let itemData = this.optionsElArr[0].dataset;
        this.selectedVal = itemData.value;
        this.label.textContent = itemData.label;
        if (this.selectedVal !== oldVal) {
            if (typeof (this.conf.onValueChange) === 'function') {
                this.conf.onValueChange(this.selectedVal, this);
            }
        }
    }
};

SMDUIDropDown.prototype.onItemClick = function (el) {
    this.setValue(el.dataset.value);
//    if (typeof (el.dataset.cb) === 'function') {
//        el.dataset.cb();
//    }
    $(this.dialog).hide();
    $(this.screenFilter).hide();
};
