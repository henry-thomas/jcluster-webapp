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


/* global pm, mu, ParamSetting, hh */

(function (root) {
    let ParamManager = function () {
        this.elements = {};
        this.changedParams = [];
        this.currentDevSNumber = null;
        this.flags = {
            warningMisingParamCompDisplayedArr: []
        };
    };

    var onParamMising = function (pName) {
        if (!this.flags.warningMisingParamCompDisplayedComplete) {

            if (pName !== 'sniu' || pName !== 'deviceID' || pName !== 'serialNumber') {
                //show warning with arr ones only
                if (!this.flags.warningMisingParamCompDisplayed) {
                    this.flags.warningMisingParamCompDisplayed = window.setTimeout(function () {
                        console.log("%c Param Manager: Param Control Missing %d for: %O", 'background: yellow', this.flags.warningMisingParamCompDisplayedArr.length, this.flags.warningMisingParamCompDisplayedArr);
                        this.flags.warningMisingParamCompDisplayedComplete = true;

                    }.bind(this), 500);
                }
                this.flags.warningMisingParamCompDisplayedArr.push(pName);
            }
        }
    };

    var restorePreservedValues = function (ob, serNum) {

        try {
            for (var paramName in ob) {
                let ps = ob[paramName];
                if (ps instanceof ParamSetting) {
                    ps.restorePreserveUnsaveValues(serNum);
                } else if (typeof (ps) === 'object') {
                    restorePreservedValues(ps, serNum);
                }
            }
        } catch (e) {
            console.log(e);
        }
//        console.log('restoring preserved serial settings for:', serNum);
    };

    var preserveAllParam = function (ob, prevSerialNumber) {
        try {
            for (var paramName in ob) {
                let ps = ob[paramName];
                if (ps instanceof ParamSetting) {
                    ps.preserveUnsaveValues(prevSerialNumber);
                } else if (typeof (ps) === 'object') {
                    preserveAllParam(ps, prevSerialNumber);
                }
            }
        } catch (e) {
            console.log(e);

        }

    };

    ParamManager.prototype.clearAllDeviceParam = function (ob) {
//        console.log('clear all values');
        try {
            for (var paramName in ob) {
                let ps = ob[paramName];
                if (ps instanceof ParamSetting) {
                    ps.hideValue();
                } else if (typeof (ps) === 'object') {
                    this.clearAllDeviceParam(ps);
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    ParamManager.prototype.getParamByName = function (name) {
        let splitStr = name.split('.');
        let currentElOb = this.elements;
        let paramPath = {
            name: name
        };

        if (splitStr.length > 1) {
            for (var i = 0; i < splitStr.length - 1; i++) {
                if (paramPath.parrentOb === undefined) {
                    paramPath.parrentOb = [];
                }
                paramPath.parrentOb.push(splitStr[i]);
                if (currentElOb[splitStr[i]] === undefined) {
                    currentElOb[splitStr[i]] = {};
                }
                currentElOb = currentElOb[splitStr[i]];
            }
            paramPath.name = splitStr[splitStr.length - 1];
        }
        if (paramPath.name.indexOf('[') > 0 && paramPath.name.indexOf(']') > paramPath.name.indexOf('[')) {
            paramPath.index = paramPath.name.substring(paramPath.name.indexOf('[') + 1, paramPath.name.indexOf(']'));
            paramPath.name = paramPath.name.substring(0, paramPath.name.indexOf('['));
            if (!Array.isArray(currentElOb[paramPath.name])) {
                currentElOb[paramPath.name] = [];
            }

            if (currentElOb[paramPath.name][paramPath.index]) {
                return      currentElOb[paramPath.name][paramPath.index];

            }

        } else {
            if (currentElOb[paramPath.name]) {
                return  currentElOb[paramPath.name];
            }
        }
        return null;
    };

    var updateParam = function (dataOb, container) {
        for (var pName in dataOb) {
            let pValue = dataOb[pName];
            try {
                if (Array.isArray(pValue)) {
                    if (Array.isArray(container[pName])) {
                        updateParam.call(this, pValue, container[pName]);
                    }
                } else if (typeof (pValue) === 'object') {
                    if (typeof (container[pName]) === 'object') {
                        updateParam.call(this, pValue, container[pName]);
                    }
                } else {
                    if (container[pName]) {
                        container[pName].setValue(pValue);
                    } else {
                        onParamMising.call(this, pName);
                    }
                }
            } catch (e) {
                console.log(e);
//                    debugger;
            }
        }
    };

    //called from DeviceManager=>SubDevice when param message received
    ParamManager.prototype.onParamReceived = function (dev, param) {
//        console.log('PM on ParamReceived');
        if (this.currentDevSNumber !== null) {
//            console.log('preserveAllParam  values', this.currentDevSNumber );
            preserveAllParam.call(this, this.elements, this.currentDevSNumber);
        }

        this.clearAllDeviceParam(this.elements);

        this.currentDevSNumber = dev.serialNumber;
        if (dev.param) {
            let param = dev.param;
            updateParam.call(this, param, this.elements);

//            console.trace('restorePreservedValues ', this.currentDevSNumber );
            restorePreservedValues(this.elements, this.currentDevSNumber);
        }
    };

    ParamManager.prototype.logParamChange = function (element, newVal, oldVal, ser) {
        this.changedParams.push({
            elName: element.paramName,
            el: element,
            newValue: newVal,
            oldValue: oldVal,
            serial: ser
        });
    };

    ParamManager.prototype.addElementOrig = function (name, element) {
        let splitStr = name.split('.');
        let currentElOb = this.elements;
        let paramPath = {
            name: name
        };

        if (splitStr.length > 1) {
            for (var i = 0; i < splitStr.length - 1; i++) {
                if (paramPath.parrentOb === undefined) {
                    paramPath.parrentOb = [];
                }

                paramPath.parrentOb.push(splitStr[i]);
                if (currentElOb[splitStr[i]] === undefined) {
                    currentElOb[splitStr[i]] = {};
                }
                currentElOb = currentElOb[splitStr[i]];
            }
            paramPath.name = splitStr[splitStr.length - 1];
        }

        if (paramPath.name.indexOf('[') > 0 && paramPath.name.indexOf(']') > paramPath.name.indexOf('[')) {
            paramPath.index = paramPath.name.substring(paramPath.name.indexOf('[') + 1, paramPath.name.indexOf(']'));
            paramPath.name = paramPath.name.substring(0, paramPath.name.indexOf('['));
            if (!Array.isArray(currentElOb[paramPath.name])) {
                currentElOb[paramPath.name] = [];
            }

            if (!currentElOb[paramPath.name][paramPath.index]) {
                currentElOb[paramPath.name][paramPath.index] = element;
            } else {
                if (typeof (currentElOb[paramPath.name][paramPath.index].paramPath) === 'object' && JSON.stringify(paramPath) === JSON.stringify(currentElOb[paramPath.name][paramPath.index].paramPath)) {
                    paramPath.found = currentElOb[paramPath.name][paramPath.index];
                    // console.error("Duplicate Parameter found! ", paramPath.name, element);
                }
            }

        } else {
            if (!currentElOb[paramPath.name]) {
                currentElOb[paramPath.name] = element;
            } else {
                if (typeof (currentElOb[paramPath.name].paramPath) === 'object' && JSON.stringify(paramPath) === JSON.stringify(currentElOb[paramPath.name].paramPath)) {
                    paramPath.found = currentElOb[paramPath.name];
                    // console.error("Duplicate Parameter found! ", paramPath.name, element);
                }
            }
        }
        return paramPath;
    };

    ParamManager.prototype.addElement = function (name, element) {
        let splitStr = name.split('.');
        let currentElOb = this.elements;
        let paramPath = {
            name: name,
            location: []
        };

        paramPath.parrentOb = [];
        for (var i = 0; i < splitStr.length; i++) {
            let compName = splitStr[i];
            let loc = paramPath.location[i] = {};

            //check if this object is an Array
            if (compName.indexOf('[') > 0 && compName.indexOf(']') > compName.indexOf('[') && compName.indexOf(']') === (compName.length - 1)) {
                let arrName = loc.name = compName.substring(0, compName.indexOf('['));
                let arrIdx = loc.idx = Number(compName.substring(compName.indexOf('[') + 1, compName.indexOf(']')));
                if (i === 0) {
                    paramPath.nameFirstChild = arrName;
                }
                loc.objType = 'array';
                if (isNaN(arrIdx)) {
                    console.warn('Invalid array IDX. Supported idx must be number only.');
                }

                if (currentElOb[arrName] === undefined) {
                    currentElOb[arrName] = [];
                } else if (!Array.isArray(currentElOb[arrName])) {
                    console.warn("Component descgnator parent type Error. Param with Path [" + name + '] has different parrent type!');
                }
                if (i < splitStr.length - 1) {
                    if (currentElOb[arrName][arrIdx] === undefined) {
                        currentElOb[arrName][arrIdx] = {};
                    }
                    currentElOb = currentElOb[arrName][arrIdx];
                } else if (currentElOb[arrName][arrIdx] !== undefined) {
                    console.warn("Duplicate Param founf for Param setting [" + name + '].');
                } else {
                    currentElOb[arrName][arrIdx] = element;
                }

            } else {
                loc.objType = 'object';
                loc.name = compName;
                if (i === 0) {
                    paramPath.nameFirstChild = compName;
                }

                if (i < splitStr.length - 1) {
                    if (currentElOb[compName] === undefined) {
                        currentElOb[compName] = {};
                    }
                    currentElOb = currentElOb[compName];
                } else if (currentElOb[compName] !== undefined) {
                    console.warn("Duplicate Param founf for Param setting [" + name + '].');
                } else {
                    currentElOb[compName] = element;

                }
            }
        }
        return paramPath;
    };

    ParamManager.prototype.getParamValue = function (paramName, parent) {
        if (typeof (parent) === 'string') {
            if (this.elements[parent] !== undefined && typeof (paramName) === 'string' && this.elements[paramName]) {
                return this.elements[parent][paramName].getValue();
            }
        } else {
            if (typeof (paramName) === 'string' && this.elements[paramName]) {
                return this.elements[paramName].getValue();
            }
        }
        return null;
    };

    ParamManager.prototype.loadParamDesc = function (paramDesc) {
//        console.clear();
        console.table(paramDesc);
        for (var desc in paramDesc) {
            if (paramDesc[desc].paramDesc && paramDesc[desc].paramDesc !== '') {
                this.elements[desc].setInfoText(paramDesc[desc].paramDesc);
            }
            if (paramDesc[desc].paramName && paramDesc[desc].paramName !== '') {
                this.elements[desc].setLabelText(paramDesc[desc].paramName);
            }
            if (paramDesc[desc].unit && paramDesc[desc].unit !== '') {
                this.elements[desc].setUnitText(paramDesc[desc].unit);
            }
        }
    };

    ParamManager.prototype.loadParamDescriptor = function (paramDesc, parentEl) {
//        console.clear();
        if (!hh.isElement(parentEl)) {
            throw Error("Parent is not a valid element!");
        }
        console.table(paramDesc);
        let accordion = new SMDUIAccordianPanel(parentEl, {
            tabs: [],
            multiple: false
        });

        let container;

        for (var desc in paramDesc) {
            //If not exist, create new paramSetting
            if (paramDesc[desc].group && paramDesc[desc].group !== "" && !accordion.tabs[paramDesc[desc].group]) {
                accordion.addTab({label: paramDesc[desc].group, id: paramDesc[desc].group});
            }

            container = accordion.getTabById(paramDesc[desc].group)?.tabContentDiv;

            if (!this.elements[desc]) {
                if (paramDesc[desc].title === "") {
                    paramDesc[desc].title = desc;
                }

                new ParamSetting(container ? container : parentEl, desc, {
                    type: paramDesc[desc].type,
                    title: paramDesc[desc].title,
                    ctrlInfo: paramDesc[desc].paramDesc,
                    dropDownConf: {options: paramDesc[desc].options}
                });
            }
        }
    };

    root.pm = new ParamManager();
//    console.log('smdui-components init');

}(window));