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


/* global hhContentBuilder, hh, mainUtils, pm, atessPbd, dm, atessPbdGUI, mu, wsm */

(function (root) {
    function AtessPbd() {
        console.log(this);
        this.dataFields = {};

    }

    function _populateData(dev, data) {
        if (!atessPbd.init) {
            let card = hh.createActDataPanelCard('Data');
            for (let prop in data) {
                if (atessPbdGUI.dataFields[prop] === undefined) {
                    atessPbdGUI.dataFields[prop] = hh.adf(card, prop, "", {});
                }
            }
            atessPbdGUI.dataContent.appendChild(card);
//            atessPbdGUI.
            atessPbd.init = true;
        }

        for (let prop in data) {
            if (atessPbdGUI.dataFields[prop]) {
                if (typeof (data[prop]) === "object") {
                    populateNestedObject(prop, data[prop]);
                } else {
                    atessPbdGUI.dataFields[prop].value = data[prop];
                }
            }
        }

        for (let prop in dev) {
            if (atessPbdGUI.generalInfo[prop]) {
                atessPbdGUI.generalInfo[prop].value = dev[prop];
            }
        }

        let param = dev.param;

        for (var prop in param) {
            if (atessPbdGUI.paramData[prop]) {
                atessPbdGUI.paramData[prop].value = param[prop];
            }
        }
//        atessHpsGUI.dataFields["batChargePower"].value = data.batChargePower.powerW;
//        atessHpsGUI.dataFields["batDischargePower"].value = data.batDischargePower.powerW;


    }

    function populateNestedObject(nestedObName, data) {
        for (let prop in data) {
            if (atessPbdGUI.dataFields[nestedObName][prop]) {
                atessPbdGUI.dataFields[nestedObName][prop].value = data[prop];
            }
        }
    }

    function _populateParam(dev, param) {
        if (!atessPbd.paramInit) {
            console.log(param);
            let sCont = atessPbdGUI.otherInfoContent;
//            for (var item in param) {
//                if (atessPbdGUI.params[item] === undefined) {
//                    atessPbdGUI.params[item] = new ParamSetting(sCont, item, {type: 'inputNumber', title: item, ctrlInfo: ""});
//                }
//            }
            atessPbd.paramInit = true;

        }

    }

    AtessPbd.prototype.sendInst = function (instr, val) {
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

    root.atessPbd = new AtessPbd();
    $(document).ready(function () {
        dm.onSelectedDataReceived(_populateData);
        dm.onSelectedParamReceived(_populateParam);
    });
}(window));
