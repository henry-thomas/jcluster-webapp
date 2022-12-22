/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2022
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */


/* global hhContentBuilder, hh, mainUtils, pm, molEm, dm, molEmGUI, mu, wsm */

(function (root) {
    function MolEm() {
        console.log(this);
        this.dataFields = {};
        this.powerNames = [];
    }

    function _populateData(dev, data) {

        if (dev.subModelID === 6041) { //Single phase model
            populatePowers(data, false);
        } else {
            populatePowers(data, true);
        }

        for (let prop in data) {
            if (molEmGUI.dataFields[prop]) {
                if (typeof (data[prop]) === "object") {
                    populateNestedObject(prop, data[prop]);
                } else {
                    molEmGUI.dataFields[prop].value = data[prop];
                }
            }
        }

        for (let prop in dev) {
            if (molEmGUI.generalInfo[prop]) {
                molEmGUI.generalInfo[prop].value = dev[prop];
            }
        }

        let param = dev.param;

        for (var prop in param) {
            if (molEmGUI.paramData[prop]) {
                molEmGUI.paramData[prop].value = param[prop];
            }
        }
    }

    function populatePowers(data, isThreePhase) {
        //Will hide and show cards based on power values

        if (data.pha1ExportPower.powerW > 0) {
            molEmGUI.dataFields['pha1ExportPower'].card.style.display = 'block';
            molEmGUI.dataFields['pha1ImportPower'].card.style.display = 'none';
        } else {
            molEmGUI.dataFields['pha1ExportPower'].card.style.display = 'none';
            molEmGUI.dataFields['pha1ImportPower'].card.style.display = 'block';
        }

        if (isThreePhase) {
            if (data.pha2ExportPower.powerW > 0) {
                molEmGUI.dataFields['pha2ExportPower'].card.style.display = 'block';
                molEmGUI.dataFields['pha2ImportPower'].card.style.display = 'none';
            } else {
                molEmGUI.dataFields['pha2ExportPower'].card.style.display = 'none';
                molEmGUI.dataFields['pha2ImportPower'].card.style.display = 'block';
            }

            if (data.pha3ExportPower.powerW > 0) {
                molEmGUI.dataFields['pha3ExportPower'].card.style.display = 'block';
                molEmGUI.dataFields['pha3ImportPower'].card.style.display = 'none';
            } else {
                molEmGUI.dataFields['pha3ExportPower'].card.style.display = 'none';
                molEmGUI.dataFields['pha3ImportPower'].card.style.display = 'block';
            }

            if (data.sumExportPower.powerW > 0) {
                molEmGUI.dataFields['sumExportPower'].card.style.display = 'block';
                molEmGUI.dataFields['sumImportPower'].card.style.display = 'none';
                molEmGUI.dataFields['voltagePh12Exp'].value = data.voltagePh12; 
                molEmGUI.dataFields['voltagePh23Exp'].value = data.voltagePh23; 
                molEmGUI.dataFields['voltagePh31Exp'].value = data.voltagePh31; 
                molEmGUI.dataFields['phaseAngle12Exp'].value = data.phaseAngle12; 
                molEmGUI.dataFields['phaseAngle23Exp'].value = data.phaseAngle23; 
                molEmGUI.dataFields['phaseAngle31Exp'].value = data.phaseAngle31; 
            } else {
                molEmGUI.dataFields['sumExportPower'].card.style.display = 'none';
                molEmGUI.dataFields['sumImportPower'].card.style.display = 'block';
                molEmGUI.dataFields['voltagePh12Imp'].value = data.voltagePh12; 
                molEmGUI.dataFields['voltagePh23Imp'].value = data.voltagePh23; 
                molEmGUI.dataFields['voltagePh31Imp'].value = data.voltagePh31; 
                molEmGUI.dataFields['phaseAngle12Imp'].value = data.phaseAngle12; 
                molEmGUI.dataFields['phaseAngle23Imp'].value = data.phaseAngle23; 
                molEmGUI.dataFields['phaseAngle31Imp'].value = data.phaseAngle31; 
            }
        }
    }

    function populateNestedObject(nestedObName, data) {
        for (let prop in data) {
            if (molEmGUI.dataFields[nestedObName][prop]) {
                molEmGUI.dataFields[nestedObName][prop].value = data[prop];
            }
        }
    }

    function _populateParam(dev, param) {
        if (!molEm.paramInit) {
//            console.log(param);
//            let sCont = deviceGUI.otherInfoContent;
//            for (var item in param) {
//                if (deviceGUI.params[item] === undefined) {
//                    deviceGUI.params[item] = new ParamSetting(sCont, item, {type: 'inputNumber', title: item, ctrlInfo: ""});
//                }
//            }
            molEm.paramInit = true;


        }

    }

    MolEm.prototype.sendInst = function (instr, val) {
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
    };

    root.molEm = new MolEm();
    $(document).ready(function () {
        dm.onSelectedDataReceived(_populateData);
        dm.onSelectedParamReceived(_populateParam);
    });
}(window));
