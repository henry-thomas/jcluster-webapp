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


/* global hhContentBuilder, hh, mainUtils, pm, atessHps, dm, atessHpsGUI, mu, wsm */

(function (root) {
    function AtessHps() {
        console.log(this);
        this.dataFields = {};

    }

    function _populateData(dev, data) {
        if (!atessHps.init) {
            let card = hh.createActDataPanelCard('Data');
            for (let prop in data) {
                if (atessHpsGUI.dataFields[prop] === undefined) {
                    atessHpsGUI.dataFields[prop] = hh.adf(card, prop, "", {});
                }
            }
            atessHpsGUI.dataContent.appendChild(card);
            atessHps.init = true;
        }

        for (let prop in data) {
            if (atessHpsGUI.dataFields[prop]) {
                if (typeof (data[prop]) === "object") {
                    populateNestedObject(prop, data[prop]);
                } else {
                    atessHpsGUI.dataFields[prop].value = data[prop];
                }
            }
        }

        for (let prop in dev) {
            if (atessHpsGUI.generalInfo[prop]) {
                atessHpsGUI.generalInfo[prop].value = dev[prop];
            }
        }

        let param = dev.param;

        for (var prop in param) {
            if (atessHpsGUI.paramData[prop]) {
                atessHpsGUI.paramData[prop].value = param[prop];
            }
        }
//        atessHpsGUI.dataFields["batChargePower"].value = data.batChargePower.powerW;
//        atessHpsGUI.dataFields["batDischargePower"].value = data.batDischargePower.powerW;


    }

    function populateNestedObject(nestedObName, data) {
        for (let prop in data) {
            if (atessHpsGUI.dataFields[nestedObName][prop]) {
                atessHpsGUI.dataFields[nestedObName][prop].value = data[prop];
            }
        }
    }

    function _populateParam(dev, param) {
//        debugger;
        if (!atessHps.paramInit) {
            console.log(param);
            let sCont = atessHpsGUI.otherInfoContent;
            for (var item in param) {
                if (atessHpsGUI.params[item] === undefined) {
                    atessHpsGUI.params[item] = new ParamSetting(sCont, item, {type: 'inputNumber', title: item, ctrlInfo: ""});
                }
            }
            atessHps.paramInit = true;

        }

    }

    AtessHps.prototype.sendInst = function (instr, val) {
        let msg = {instrExt: instr};
        msg[instr] = val.toString() || "";
        wsm.sendDevMsgExecWithJsonInst(
                msg,
                function (message, response) {
                    console.log("Result: ", response);
                    mu.showInfoMessage(response, 'Success setting: ' + message.instrExt);
                },
                function (message, err) {
                    mu.showErrorMessage(err, 'Error setting: ' + message.instrExt);
                },
                3000);
//    console.log("send object request");
    };

    root.atessHps = new AtessHps();
    $(document).ready(function () {
        dm.onSelectedDataReceived(_populateData);
        dm.onSelectedParamReceived(_populateParam);
    });
}(window));
