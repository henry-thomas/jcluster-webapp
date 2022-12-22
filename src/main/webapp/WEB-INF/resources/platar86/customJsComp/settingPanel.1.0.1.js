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



/* global HTMLElement, hh, this, sui */

function SettingPanel(el, conf) {
    if (!hh.isElement(el)) {
        console.warn("Not valid HTML Element", el);
    }
    this.el = el;

    this.conf = conf || {};


    this.init();
    if (typeof (this.conf.onInitComplete) === 'function') {
        this.conf.onInitComplete(this);
    }
}


SettingPanel.prototype.hide = function () {
    $(this.container).hide();
};

SettingPanel.prototype.show = function () {
    $(this.container).show();
};


SettingPanel.prototype.init = function () {
    if (!this.isInitComplete) { //to avoid reinit
        this.isInitComplete = true;
        let conf = this.conf;

        let container = document.createElement('div');
        container.classList.add('smdui-setPanel-container');
        this.el.appendChild(container);
        this.container = container;

        if (this.conf.hidden) {
            this.hide();
        }

        let label = document.createElement('span');
        label.textContent = conf.title || "";
        label.classList.add('smdui-setPanel-label');
        container.appendChild(label);

        switch (conf.type) {
            case 'switch':
                this.createSwitch();
                break;
            case 'sliderHidden':
                this.createSliderHidden();
                break;
            case 'inputText':
                this.createInputText();
                break;
            case 'inputColor':
                this.createInputColor();
                break;
            case 'dropDown':
                this.createDropDown();
                break;
            case 'dropDownButton':
                this.createDropDownButton();
                break;
            case 'button':
                this.createButton();
                break;
            default:
                console.warn('Unknow Setting Panel type' + conf.type);
                break;
        }

        if (conf.toolTip) {
            container.classList.add('smdui-tooltip');
            let tooltip = sui.addTooltip(container, conf.toolTip);
//            tooltip.style.maxWidth = '300px';
//            let toolTip = document.createElement('span');
//            toolTip.classList.add('smdui-tooltip-text');
//            toolTip.textContent = conf.toolTip;
//            container.classList.add('smdui-tooltip');
//            container.appendChild(toolTip);
        }
    }

};

SettingPanel.prototype.getArgs = function () {
    return this.conf.args;
};

SettingPanel.prototype.getValue = function () {
    switch (this.conf.type) {
        case 'switch':
            return this.inputEl.checked;
            break;
        case 'sliderHidden':
            return this.sliderHidden.val;
            break;
        case 'inputText':
            return  this.textHidden.getValue();
            break;
        case 'inputColor':
            if (this.coloPicker.valueSet === false) {
                return null;
            }
            return  '#' + this.coloPicker.toString();
            break;
        case 'dropDown':
            return    this.dropDown.getValue();
            break;
        case 'button':
            return    true;
            break;
        default:
            console.warn('Unknow Setting Panel type' + this.conf.type);
            break;
    }
};

SettingPanel.prototype.onChangeCb = function () {
    if (typeof (this.conf.onChange) === 'function') {
        if (this.getValue !== undefined && this.getValue() !== null) {
            this.conf.onChange(this.getValue(), this.conf.args || null, this);
        }
    }
};

SettingPanel.prototype.setValue = function (value) {
    switch (this.conf.type) {
        case 'switch':
            this.inputEl.checked = value ? true : false;
            break;
        case 'sliderHidden':
            this.sliderHidden.setValue(value);
            break;
        case 'inputText':
            this.textHidden.setValue(value);
            break;
        case 'inputColor':
            if (value && value.toString().charAt(0) === '#') {
                this.coloPicker.valueSet = true;
                value = value.substr(1, value.length);
                this.coloPicker.fromString(value);
            }
            break;
        case 'dropDown':
            this.dropDown.setValue(value);
            break;
        case 'button':

            break;
        default:
            console.warn('Unknow Setting Panel type' + this.conf.type);
            break;
    }
};

SettingPanel.prototype.createButton = function () {
    this.button = document.createElement('span');
    this.container.appendChild(this.button);
    this.button.classList.add('smdui-button');
    this.button.textContent = this.conf.label || '';
    this.button.onclick = this.onChangeCb.bind(this);

};

SettingPanel.prototype.createDropDownButton = function () {
    let div = document.createElement('div');
    this.container.appendChild(div);
    if (!this.conf.dropDownConf) {
        this.conf.dropDownConf = {};
    }
    this.dropDown = hh.dropdown();
    this.dropDown.text = this.conf.dropDownConf.text;
    this.dropDown.items = this.conf.dropDownConf.items;
    div.appendChild(this.dropDown);
};

SettingPanel.prototype.createDropDown = function () {
    let div = document.createElement('div');
    this.container.appendChild(div);
    if (!this.conf.dropDownConf) {
        this.conf.dropDownConf = {};
    }
    this.conf.dropDownConf.onValueChange = this.onChangeCb.bind(this);
    this.dropDown = new SMDUIDropDown(div, this.conf.dropDownConf);

};

SettingPanel.prototype.createInputColor = function () {
    let div = document.createElement('div');
    this.container.appendChild(div);
    this.container.classList.add('smdui-colorPicker-container');

    if (!this.conf.inputColorConf) {
        this.conf.inputColorConf = {};
    }

    var input = document.createElement('INPUT');
    input.classList.add('smdui-colorPicker-input');

    var picker = new jscolor(input);
//    picker.fromHSV(360 / 100 * 2, 100, 100);
    picker.valueSet = false;
    this.coloPicker = picker;
    document.cp = picker;
    picker.onFineChange = function () {
//        console.log('asdfs');
        picker.valueSet = true;
        if (this.coloPicker.targetElement.select) {
            this.coloPicker.targetElement.select();
        } else if (this.coloPicker.targetElement.setSelectionRange) {
            this.coloPicker.targetElement.setSelectionRange(0, this.input.value.length);
        }

        this.onChangeCb.bind(this)();
    }.bind(this);
//    picker.onFineChange = this.onChangeCb.bind(this);
    if (this.conf.inputColorConf.val) {
        picker.fromString(this.conf.inputColorConf.val);
    }
    div.appendChild(input);
};

SettingPanel.prototype.createInputText = function () {
    let div = document.createElement('div');
    this.container.appendChild(div);
    if (!this.conf.sliderHiddenConf) {
        this.conf.sliderHiddenConf = {};
    }
    this.conf.inputHiddenConf.onValueChange = this.onChangeCb.bind(this);
    this.textHidden = new HidInText(div, this.conf.inputHiddenConf);
};

SettingPanel.prototype.createSliderHidden = function () {
    let div = document.createElement('div');
    this.container.appendChild(div);
    if (!this.conf.sliderHiddenConf) {
        this.conf.sliderHiddenConf = {};
    }
    this.conf.sliderHiddenConf.onValueChange = this.onChangeCb.bind(this);
    this.sliderHidden = new HidSlider(div, this.conf.sliderHiddenConf);

};

SettingPanel.prototype.createSwitch = function () {
    let swLabel = document.createElement('label');
    swLabel.classList.add('smdui-switchLabel');
    let swInput = document.createElement('input');
    swInput.type = 'checkbox';
    this.inputEl = swInput;

    let swSpan = document.createElement('span');
    swSpan.classList.add('smdui-switchSlider');
    if (this.conf.typeStyle === 'sliderRound') {
        swSpan.classList.add('smdui-switchSliderRound');
    }

    swLabel.appendChild(swInput);
    swLabel.appendChild(swSpan);
    this.container.appendChild(swLabel);

    this.inputEl.onchange = this.onChangeCb.bind(this);
};
