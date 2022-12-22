/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by nathan, 2022
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */

/* global Element, hh, SVG */


(function (root) {

    function SMDUIBatProgCard(el, conf) {
        this.conf = conf || {};
        this.serial = conf.serial || null;
        this.fields = {};
        this.card = hh.validateDomEl(el);
        if (this.card === null) {
            console.warn('Invalid element');
            return;
        }
        init.call(this, el);
    }

    function init(element) {
        let f = this.fields;
        let cont = this.container = hh.div(element, "batCardWrapper");
        cont.style = "margin: 10px";
        f.relayState = hh.span(cont, 'relayState', "state-item");
        f.name = hh.span(cont, "CC", "stepName-item");
        f.stepIndex = hh.span(cont, "Step 0/6", "stepIndex");
        f.settingsBtn = hh.button(cont, "...", "grid-area: optionBtn");
        if (this.conf.onclick) {
            f.settingsBtn.onclick = this.conf.onclick.bind(null, this);
        }

        f.svgItem = hh.div(cont, "svg-item");
        let svgTest = document.querySelector('.svgBatIcon');

        try {
            f.svg = document.createElement("object");
            f.svg.innerHTML = svgTest.innerHTML;
            f.svg.width = "100px";
            f.svg.height = "100px";

        } catch (e) {

        }

        f.svg.data = svgTest.firstChild;
        f.svg.data = "batProg.svg";
        f.svgItem.appendChild(f.svg);
        f.bmsPackVoltageV = hh.span(cont, '---V', "grid-area: voltageV");
        f.minCellVoltageV = hh.span(cont, '---mV', "grid-area: minCellVoltage");
        f.maxCellVoltageV = hh.span(cont, '---mV', "grid-area: maxCellVoltage");
        f.maxCellVoltageDiff = hh.span(cont, "---mV", "grid-area: maxCellVoltageDiff");
        f.bmsCurrentA = hh.span(cont, '--A', "grid-area: currentA");
        f.batCapP = hh.span(cont, "00%", "grid-area: svg; display: flex; justifyContent: center");
        f.bmsserial = hh.span(cont, this.serial, "sn-item");
        f.invCurrentA = hh.span(cont, "---A", "grid-area:inverterCurrent");
        f.invPackVoltageV = hh.span(cont,'---V', "grid-area:inverterDcCurrent");
        f.stateWrapper = hh.div(cont, "sa");
        f.statePuls = hh.div(f.stateWrapper, "sa-waiting");
        f.stateIcon = hh.div(f.statePuls, "fa fa-solid fa-gear activeICon");
        f.stateLbl = hh.div(cont, "currentStateLbl-item-waiting");
        f.stateLbl.innerHTML = "Active";
        f.dialog = new SMDUIDialog({
            heading: this.serial
        });

    }

    SMDUIBatProgCard.prototype.updateValues = function (ob, stepIdx, totalSteps) {
        if (stepIdx > totalSteps) {
            stepIdx = totalSteps;
        }
        
        this.fields["stepIndex"].innerHTML = "Step " + stepIdx + "/" + totalSteps;
        if (typeof (ob) === 'object') {

            let step = ob.serialProdStepActionList[stepIdx];
            let resultData = step.resultData;
            for (var fieldName in resultData) {
                let fName = fieldNameDict[fieldName] || fieldName;
                if (this.fields[fName]) {
                    this.fields[fName].innerHTML = formatValue(fName, resultData
                    [fieldName]);
                } else {
                }
            }
            if (this.fields["relayState"].innerHTML === "false") {
                this.fields["relayState"].innerHTML = "Off";

            } else {
//                hide.call(this);
                this.fields["relayState"].innerHTML = "On";

            }



            this.fields["name"].innerHTML = getAbrFromClassName(ob.serialProdStepActionList[stepIdx].name);

            if (!ob.isComplete && ob.waiting && !ob.error) {

                this.fields.statePuls.className = "";
                this.fields.stateIcon.className = "";
                this.fields.stateLbl.className = "";
                this.fields.stateLbl.innerHTML = "Waiting";
                hh.addClass(this.fields.stateLbl, ["currentStateLbl-item-waiting"]);
                hh.addClass(this.fields.statePuls, ["sa-waiting"]);
                hh.addClass(this.fields.stateIcon, ["fa", "fa-solid", "fa-gear", "waitingIcon"]);
                hh.addClass(this.container, ["waiting"]);
                this.container.classList.remove("complete");
                this.container.classList.remove("error");
                this.container.classList.remove("active");

            } else if (!ob.isComplete && ob.error) {

                this.fields.statePuls.className = "";
                this.fields.stateIcon.className = "";
                this.fields.stateLbl.className = "";
                this.fields.stateLbl.innerHTML = "Error";
                hh.addClass(this.fields.stateLbl, ["currentStateLbl-item-error"]);
                hh.addClass(this.fields.statePuls, ["sa-warning"]);
                hh.addClass(this.fields.stateIcon, ["fa", "fa-solid", "fa-exclamation", "errorIcon"]);
                hh.addClass(this.container, ["error"]);
                this.container.classList.remove("complete");
                this.container.classList.remove("waiting");
                this.container.classList.remove("active");

            } else if (ob.isComplete && !ob.waiting && !ob.error) {

                this.fields.statePuls.className = "";
                this.fields.stateIcon.className = "";
                this.fields.stateLbl.className = "";
                this.fields.stateLbl.innerHTML = "Complete";
                hh.addClass(this.fields.stateLbl, ["currentStateLbl-item-complete"]);
                hh.addClass(this.fields.statePuls, ["sa-complete"]);
                hh.addClass(this.fields.stateIcon, ["fa", "fa-solid", "fa-check", "completeIcon"]);
                hh.addClass(this.container, ["complete"]);
                this.container.classList.remove("error");
                this.container.classList.remove("waiting");
                this.container.classList.remove("active");

            } else {

                this.fields.statePuls.className = "";
                this.fields.stateIcon.className = "";
                this.fields.stateLbl.className = "";
                this.fields.stateLbl.innerHTML = "Active";
                hh.addClass(this.fields.stateLbl, ["currentStateLbl-item-waiting"]);
                hh.addClass(this.fields.statePuls, ["sa-waiting"]);
                hh.addClass(this.fields.stateIcon, ["fa", "fa-solid", "fa-gear", "activeICon"]);
                hh.addClass(this.container, ["active"]);
                this.container.classList.remove("complete");
                this.container.classList.remove("error");
                this.container.classList.remove("waiting");
            }

        } else {
            console.warn('Not a object dude!');
        }
    };
    root.SMDUIBatProgCard = SMDUIBatProgCard;

    var fieldNameDict = {minCellV: 'minCellVCustom'};

    function getAbrFromClassName(name) {
        switch (name) {
            case "BatProdStepWait":
                return "TW";
            case "BatProdStepDchV":
                return "DV";
            case "BatProdStepChCap":
                return "CC";
            case "BatProdStepDchCap":
                return "DC";
            case "BatProdStepChV":
                return "CV";
            default:
                return "NA";
        }
    }

    function formatValue(fieldName, value) {
        switch (fieldName) {
            case "bmsPackVoltageV":
                return value.toFixed(2) + ' V';
            case "minCellVoltageV":
                return (value * 1000).toFixed(0) + ' mV';
            case "maxCellVoltageV":
                return (value * 1000).toFixed(0) + ' mV';
            case "maxCellVoltageDiff":
                return (value * 1000).toFixed(0) + ' mV';
            case "bmsCurrentA":
                return value.toFixed(2) + ' A';
            case "invCurrentA":
                return value.toFixed(2) + ' A';
            case "invPackVoltageV":
                return value.toFixed(2) + ' V';
            case "batCapP":
                return value.toFixed(0) + ' %';
            default:
                return value;
        }
    }

})(window);

$(document).ready(function () {
});

(function (root) {
    function PanelManeger(el) {
        this.container = el;
        this.panelList = {};

    }
    let pro = PanelManeger.prototype;

    function getPosition(el) {
        var _x = 0;
        var _y = 0;
        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return {top: _y, left: _x};
    }

    function onPanelCardClick(panelCard, ev) {
        let dialog = panelCard.fields["dialog"];
        dialog.open();
    }

    pro.updateCard = function (batDataObj) {
        if (!batDataObj || !batDataObj.serial) {
            console.warn('Invalid Object or missing serial');
            return;
        }
        let ser = batDataObj.serial;

        let p = this.panelList[ser];
        if (!p) {
            p = this.panelList[ser] = new SMDUIBatProgCard(this.container, {
                onclick: onPanelCardClick,
                serial: ser
            });
        }
        let rList = batDataObj.serialProdStepActionList[batDataObj.currStep];
        let stepInd = batDataObj.currStep + 1;
//        debugger;

        p.updateValues(batDataObj, stepInd, batDataObj.serialProdStepActionList.length - 1); //-1 because last step is hidden, save to DB

    };
    root.PanelManeger = PanelManeger;


})(window);




//let batDataObj2 = {
//    "serialProdStepActionList": [
//        {
//            "name": "BatProdStepWait",
//            "bmsSerial": "999999999",
//            "actionParam": {
//                "minCellVoltageV": 2.8,
//                "maxCellVoltageV": 3.6,
//                "maxTotalCurrentA": 0,
//                "relayState": true,
//                "monitorCellDiff": false,
//                "inverterVoltageDiff": 0,
//                "maxCellVoltageDiff": 0,
//                "waitDuration": 5000,
//                "name": "StepActionParamWait"
//            },
//            "startTime": 1660639010576,
//            "resultData": {
//                "state": false,
//                "bmsCurrentA": -0.034,
//                "invCurrentA": 0.13,
//                "multiple": false,
//                "minCellVoltageV": 3.265,
//                "maxCellVoltageV": 3.266,
//                "relayState": true,
//                "maxCellVoltageDiff": 0.0009999999999998899,
//                "bmsPackVoltageV": 52.253,
//                "batCapP": 35.803293402777776,
//                "batCapAh": 51.556,
//                "invPackVoltageV": 41.58,
//                "remainingDuration": 0,
//                "name": "StepActionDataWait"
//            }
//        },
//        {
//            "name": "BatProdStepChCap",
//            "bmsSerial": "999999999",
//            "actionParam": {
//                "minCellVoltageV": 0,
//                "maxCellVoltageV": 0,
//                "maxTotalCurrentA": 10,
//                "relayState": true,
//                "monitorCellDiff": false,
//                "inverterVoltageDiff": 0,
//                "maxCellVoltageDiff": 0,
//                "targetCapacityPerc": 35,
//                "name": "StepActionParamChCap"
//            },
//            "startTime": 1660639015686,
//            "ssgtInstSent": false,
//            "resultData": {
//                "state": false,
//                "bmsCurrentA": -0.034,
//                "invCurrentA": 0.13,
//                "multiple": false,
//                "minCellVoltageV": 3.265,
//                "maxCellVoltageV": 3.266,
//                "relayState": true,
//                "maxCellVoltageDiff": 0.0009999999999998899,
//                "bmsPackVoltageV": 52.253,
//                "batCapP": 35.803293402777776,
//                "batCapAh": 51.556,
//                "invPackVoltageV": 41.58,
//                "actualCapacityPerc": 35.83639718364198,
//                "name": "StepActionDataChCap"
//            }
//        },
//        {
//            "name": "BatProdStepChV",
//            "bmsSerial": "999999999",
//            "actionParam": {
//                "minCellVoltageV": 2.8,
//                "maxCellVoltageV": 3.3,
//                "maxTotalCurrentA": 25,
//                "relayState": true,
//                "monitorCellDiff": false,
//                "inverterVoltageDiff": 0,
//                "maxCellVoltageDiff": 0,
//                "name": "StepActionParamChV"
//            },
//            "startTime": 1660639016471,
//            "ssgtInstSent": false,
//            "resultData": {
//                "state": false,
//                "bmsCurrentA": -0.034,
//                "invCurrentA": 0.13,
//                "multiple": false,
//                "minCellVoltageV": 3.265,
//                "maxCellVoltageV": 3.266,
//                "relayState": true,
//                "maxCellVoltageDiff": 0.0009999999999998899,
//                "bmsPackVoltageV": 52.253,
//                "batCapP": 35.803293402777776,
//                "batCapAh": 51.556,
//                "invPackVoltageV": 41.58,
//                "name": "StepActionDataChV"
//            }
//        }
//    ],
//    "currStep": 2,
//    "isComplete": true,
//    "serial": "983929199",
//    "error": false,
//    "waiting": false
//};
//let batDataObj3 = {
//    "serialProdStepActionList": [
//        {
//            "name": "BatProdStepWait",
//            "bmsSerial": "999999999",
//            "actionParam": {
//                "minCellVoltageV": 2.8,
//                "maxCellVoltageV": 3.6,
//                "maxTotalCurrentA": 0,
//                "relayState": false,
//                "monitorCellDiff": false,
//                "inverterVoltageDiff": 0,
//                "maxCellVoltageDiff": 0,
//                "waitDuration": 5000,
//                "name": "StepActionParamWait"
//            },
//            "startTime": 1660639010576,
//            "resultData": {
//                "state": false,
//                "bmsCurrentA": -0.034,
//                "invCurrentA": 0.13,
//                "multiple": false,
//                "minCellVoltageV": 3.265,
//                "maxCellVoltageV": 3.266,
//                "relayState": false,
//                "maxCellVoltageDiff": 0.0009999999999998899,
//                "bmsPackVoltageV": 52.253,
//                "batCapP": 35.803293402777776,
//                "batCapAh": 51.556,
//                "invPackVoltageV": 41.58,
//                "remainingDuration": 0,
//                "name": "StepActionDataWait"
//            }
//        },
//        {
//            "name": "BatProdStepChCap",
//            "bmsSerial": "999999999",
//            "actionParam": {
//                "minCellVoltageV": 0,
//                "maxCellVoltageV": 0,
//                "maxTotalCurrentA": 10,
//                "relayState": false,
//                "monitorCellDiff": false,
//                "inverterVoltageDiff": 0,
//                "maxCellVoltageDiff": 0,
//                "targetCapacityPerc": 35,
//                "name": "StepActionParamChCap"
//            },
//            "startTime": 1660639015686,
//            "ssgtInstSent": false,
//            "resultData": {
//                "state": false,
//                "bmsCurrentA": -0.034,
//                "invCurrentA": 0.13,
//                "multiple": false,
//                "minCellVoltageV": 3.265,
//                "maxCellVoltageV": 3.266,
//                "relayState": false,
//                "maxCellVoltageDiff": 0.0009999999999998899,
//                "bmsPackVoltageV": 52.253,
//                "batCapP": 35.803293402777776,
//                "batCapAh": 51.556,
//                "invPackVoltageV": 41.58,
//                "actualCapacityPerc": 35.83639718364198,
//                "name": "StepActionDataChCap"
//            }
//        },
//        {
//            "name": "BatProdStepChV",
//            "bmsSerial": "999999999",
//            "actionParam": {
//                "minCellVoltageV": 2.8,
//                "maxCellVoltageV": 3.3,
//                "maxTotalCurrentA": 25,
//                "relayState": false,
//                "monitorCellDiff": false,
//                "inverterVoltageDiff": 0,
//                "maxCellVoltageDiff": 0,
//                "name": "StepActionParamChV"
//            },
//            "startTime": 1660639016471,
//            "ssgtInstSent": false,
//            "resultData": {
//                "state": false,
//                "bmsCurrentA": -0.034,
//                "invCurrentA": 0.13,
//                "multiple": false,
//                "minCellVoltageV": 3.265,
//                "maxCellVoltageV": 3.266,
//                "relayState": false,
//                "maxCellVoltageDiff": 0.0009999999999998899,
//                "bmsPackVoltageV": 52.253,
//                "batCapP": 35.803293402777776,
//                "batCapAh": 51.556,
//                "invPackVoltageV": 41.58,
//                "name": "StepActionDataChV"
//            }
//        }
//    ],
//    "currStep": 2,
//    "isComplete": false,
//    "serial": "993949199",
//    "error": true,
//    "waiting": false
//};
//let batDataObj1 = {
//    "serialProdStepActionList": [
//        {
//            "name": "BatProdStepWait",
//            "bmsSerial": "999999999",
//            "actionParam": {
//                "minCellVoltageV": 2.8,
//                "maxCellVoltageV": 3.6,
//                "maxTotalCurrentA": 0,
//                "relayState": false,
//                "monitorCellDiff": false,
//                "inverterVoltageDiff": 0,
//                "maxCellVoltageDiff": 0,
//                "waitDuration": 5000,
//                "name": "StepActionParamWait"
//            },
//            "startTime": 1660639010576,
//            "resultData": {
//                "state": false,
//                "bmsCurrentA": -0.034,
//                "invCurrentA": 0.13,
//                "multiple": false,
//                "minCellVoltageV": 3.265,
//                "maxCellVoltageV": 3.266,
//                "relayState": false,
//                "maxCellVoltageDiff": 0.0009999999999998899,
//                "bmsPackVoltageV": 52.253,
//                "batCapP": 35.803293402777776,
//                "batCapAh": 51.556,
//                "invPackVoltageV": 41.58,
//                "remainingDuration": 0,
//                "name": "StepActionDataWait"
//            }
//        },
//        {
//            "name": "BatProdStepChCap",
//            "bmsSerial": "999999999",
//            "actionParam": {
//                "minCellVoltageV": 0,
//                "maxCellVoltageV": 0,
//                "maxTotalCurrentA": 10,
//                "relayState": false,
//                "monitorCellDiff": false,
//                "inverterVoltageDiff": 0,
//                "maxCellVoltageDiff": 0,
//                "targetCapacityPerc": 35,
//                "name": "StepActionParamChCap"
//            },
//            "startTime": 1660639015686,
//            "ssgtInstSent": false,
//            "resultData": {
//                "state": false,
//                "bmsCurrentA": -0.034,
//                "invCurrentA": 0.13,
//                "multiple": false,
//                "minCellVoltageV": 3.265,
//                "maxCellVoltageV": 3.266,
//                "relayState": false,
//                "maxCellVoltageDiff": 0.0009999999999998899,
//                "bmsPackVoltageV": 52.253,
//                "batCapP": 35.803293402777776,
//                "batCapAh": 51.556,
//                "invPackVoltageV": 41.58,
//                "actualCapacityPerc": 35.83639718364198,
//                "name": "StepActionDataChCap"
//            }
//        },
//        {
//            "name": "BatProdStepChV",
//            "bmsSerial": "999999999",
//            "actionParam": {
//                "minCellVoltageV": 2.8,
//                "maxCellVoltageV": 3.3,
//                "maxTotalCurrentA": 25,
//                "relayState": false,
//                "monitorCellDiff": false,
//                "inverterVoltageDiff": 0,
//                "maxCellVoltageDiff": 0,
//                "name": "StepActionParamChV"
//            },
//            "startTime": 1660639016471,
//            "ssgtInstSent": false,
//            "resultData": {
//                "state": false,
//                "bmsCurrentA": -0.034,
//                "invCurrentA": 0.13,
//                "multiple": false,
//                "minCellVoltageV": 3.265,
//                "maxCellVoltageV": 3.266,
//                "relayState": false,
//                "maxCellVoltageDiff": 0.0009999999999998899,
//                "bmsPackVoltageV": 52.253,
//                "batCapP": 35.803293402777776,
//                "batCapAh": 51.556,
//                "invPackVoltageV": 41.58,
//                "name": "StepActionDataChV"
//            }
//        }
//    ],
//    "currStep": 1,
//    "isComplete": false,
//    "serial": "923959699",
//    "error": false,
//    "waiting": false
//};
//let batDataObj4 = {
//    "serialProdStepActionList": [
//        {
//            "name": "BatProdStepWait",
//            "bmsSerial": "999999999",
//            "actionParam": {
//                "minCellVoltageV": 2.8,
//                "maxCellVoltageV": 3.6,
//                "maxTotalCurrentA": 0,
//                "relayState": false,
//                "monitorCellDiff": false,
//                "inverterVoltageDiff": 0,
//                "maxCellVoltageDiff": 0,
//                "waitDuration": 5000,
//                "name": "StepActionParamWait"
//            },
//            "startTime": 1660639010576,
//            "resultData": {
//                "state": false,
//                "bmsCurrentA": -0.034,
//                "invCurrentA": 0.13,
//                "multiple": false,
//                "minCellVoltageV": 3.265,
//                "maxCellVoltageV": 3.266,
//                "relayState": false,
//                "maxCellVoltageDiff": 0.0009999999999998899,
//                "bmsPackVoltageV": 52.253,
//                "batCapP": 35.803293402777776,
//                "batCapAh": 51.556,
//                "invPackVoltageV": 41.58,
//                "remainingDuration": 0,
//                "name": "StepActionDataWait"
//            }
//        },
//        {
//            "name": "BatProdStepChCap",
//            "bmsSerial": "999999999",
//            "actionParam": {
//                "minCellVoltageV": 0,
//                "maxCellVoltageV": 0,
//                "maxTotalCurrentA": 10,
//                "relayState": false,
//                "monitorCellDiff": false,
//                "inverterVoltageDiff": 0,
//                "maxCellVoltageDiff": 0,
//                "targetCapacityPerc": 35,
//                "name": "StepActionParamChCap"
//            },
//            "startTime": 1660639015686,
//            "ssgtInstSent": false,
//            "resultData": {
//                "state": false,
//                "bmsCurrentA": -0.034,
//                "invCurrentA": 0.13,
//                "multiple": false,
//                "minCellVoltageV": 3.265,
//                "maxCellVoltageV": 3.266,
//                "relayState": false,
//                "maxCellVoltageDiff": 0.0009999999999998899,
//                "bmsPackVoltageV": 52.253,
//                "batCapP": 35.803293402777776,
//                "batCapAh": 51.556,
//                "invPackVoltageV": 41.58,
//                "actualCapacityPerc": 35.83639718364198,
//                "name": "StepActionDataChCap"
//            }
//        },
//        {
//            "name": "BatProdStepChV",
//            "bmsSerial": "999999999",
//            "actionParam": {
//                "minCellVoltageV": 2.8,
//                "maxCellVoltageV": 3.3,
//                "maxTotalCurrentA": 25,
//                "relayState": false,
//                "monitorCellDiff": false,
//                "inverterVoltageDiff": 0,
//                "maxCellVoltageDiff": 0,
//                "name": "StepActionParamChV"
//            },
//            "startTime": 1660639016471,
//            "ssgtInstSent": false,
//            "resultData": {
//                "state": false,
//                "bmsCurrentA": -0.034,
//                "invCurrentA": 0.13,
//                "multiple": false,
//                "minCellVoltageV": 3.265,
//                "maxCellVoltageV": 3.266,
//                "relayState": false,
//                "maxCellVoltageDiff": 0.0009999999999998899,
//                "bmsPackVoltageV": 52.253,
//                "batCapP": 35.803293402777776,
//                "batCapAh": 51.556,
//                "invPackVoltageV": 41.58,
//                "name": "StepActionDataChV"
//            }
//        }
//    ],
//    "currStep": 1,
//    "isComplete": false,
//    "serial": "923959629",
//    "error": false,
//    "waiting": true
//};
//$(document).ready(function () {
//    let target = document.querySelector(".testCardDiv");
//    let cardManeger = new PanelManeger(target);
//
////cardManeger.updateCard(batDataObj);
//    cardManeger.updateCard(batDataObj1);
//    cardManeger.updateCard(batDataObj2);
//    cardManeger.updateCard(batDataObj3);
//    cardManeger.updateCard(batDataObj4);
//});
