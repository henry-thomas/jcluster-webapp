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

/* global bcGui, devManager, hh, mainUtils, mu, wsm, bc, bmsexProd, dm */

//var bc = {
//
//};
var bcProd = {
    flags: {
        initCounter: 0,
        msgDialogOpen: false,
        inProgress: false
    },
    dialogCont: {

    },
    comp: {

    }
};

bc.updateData = function (dev, data) {

    let bmsData = data.bmsDataMap[data.targetDevSerialNumber];
    if (bmsData) {
        bc.updateCellVoltageTable(data, bmsData);
        hh.updateAdfFromObject(bcGui.dataComp, data);
        bcGui.dataComp.bmsCurrentA.value = data.bmsDataMap[data.targetDevSerialNumber].currentA + '/' + data.bmsDataMap[data.calibDevSerialNumber].currentA;
        bcGui.dataComp.currentDiff.value = data.bmsDataMap[data.targetDevSerialNumber].currentA - data.bmsDataMap[data.calibDevSerialNumber].currentA;
        
//        bcGui.dataComp.calibBmsCurrent.value = data.bmsDataMap[data.calibDevSerialNumber].currentA;
    }


    if (data.serialStateModelParamWrite[data.targetDevSerialNumber] === undefined) {
        bcGui.dataComp.paramWrite.value = '';
    } else {
        let batTestPass = data.serialStateModelParamWrite[data.targetDevSerialNumber];
        bcGui.dataComp.paramWrite.value = batTestPass ? 'Pass' : 'Fail';
    }

    if (data.serialStateBalMap[data.targetDevSerialNumber] === undefined) {
        bcGui.dataComp.balTest.value = '';
    } else {
        let batTestPass = data.serialStateBalMap[data.targetDevSerialNumber];
        bcGui.dataComp.balTest.value = batTestPass ? 'Pass' : 'Fail';
    }

    if (data.serialStateBalTempSensorMap[data.targetDevSerialNumber] === undefined) {
        bcGui.dataComp.balTempTest.value = '';
    } else {
        let batTestPass = data.serialStateBalTempSensorMap[data.targetDevSerialNumber];
        bcGui.dataComp.balTempTest.value = batTestPass ? 'Pass' : 'Fail';
    }

    if (data.serialStateCellVCalibMap[data.targetDevSerialNumber] === undefined) {
        bcGui.dataComp.cellVCalib.value = '';
    } else {
        let batTestPass = data.serialStateCellVCalibMap[data.targetDevSerialNumber];
        bcGui.dataComp.cellVCalib.value = batTestPass ? 'Pass' : 'Fail';
    }
    if (data.serialStateCanTest[data.targetDevSerialNumber] === undefined) {
        bcGui.dataComp.canTest.value = '';
    } else {
        let batTestPass = data.serialStateCanTest[data.targetDevSerialNumber];
        bcGui.dataComp.canTest.value = batTestPass ? 'Pass' : 'Fail';
    }
    if (data.serialStateCurrMeasTest[data.targetDevSerialNumber] === undefined) {
        bcGui.dataComp.inaTest.value = '';
    } else {
        let batTestPass = data.serialStateCurrMeasTest[data.targetDevSerialNumber];
        bcGui.dataComp.inaTest.value = batTestPass ? 'Pass' : 'Fail';
    }

//    bcGui.calibFailMessage.value = data.calibFailMessage;
//    bcGui.running.value = data.running;

    if (data.allTestsCompleteSuccess && bc.isAllowedToPrint) {
        mu.download("batserial_" + data.targetDevSerialNumber + '.txt', data.targetDevSerialNumber);
        wsm.sendDevMsgExecWithJsonInst({instrExt: "onDevSerialPrint",
            showMessage: true
        });
        bc.onSuccess(data);
    }

    bcProd.checkAutoBatSelectionState(dev, data);
    if (bcProd.flags.inProgress) {
        if (data.targetBmsCalEnvTestsPassed) {
            bcProd.flags.inProgress = false;
            bcProd.comp.onCompleteSuccessMessageDialog.open();
//            bcProd.comp.onProgressFailDialog.close();
        } else if (bcProd.checkForFailedSteps(data)) {
            bcProd.flags.inProgress = false;
//            bcProd.comp.onCompleteSuccessMessageDialog.close();
            bcProd.comp.onProgressFailDialog.open();
            bcProd.comp.failMessageSpan.textContent = data.calibFailMessage;
        }


    }

};

//bcProd.checkBatCalComplete = function (dev, data) {
//    let success = data.targetBmsCalEnvTestsPassed;
//    let containsFail = bcProd.checkForFailedSteps(data);
//
//    let dialog;
//    if (!bcProd.comp.onCompleteMessageDialog) {
//        bcProd.comp.onCompleteMessageDialog = bcProd.createMessageDialog();
//    }
//    dialog = bcProd.comp.onCompleteMessageDialog;
//    if (success) {
//        dialog.open(hh.div(null));
//        let content = hh.div(dialog.contentDiv);
//        content.textContent = "👍";
//        content.style.fontSize = 'xxx-large';
//    } else if (containsFail && Object.keys(data.alertMap).length === 0 && !bcProd.flags.msgDialogOpen) {
//        bcProd.flags.msgDialogOpen = true;
//        let content = hh.div(null, "failBatCalWrapper");
//        content.textContent = "Failed: " + data.calibFailMessage;
//        dialog.open(content);
//    }
//
//};

bcProd.checkForFailedSteps = function (data) {

    let serial = data.targetDevSerialNumber;
    let containsFail = false;

    if (data.serialStateBalMap[serial] === false) {
        containsFail = true;
    }
    if (data.serialStateBalTempSensorMap[serial] === false) {
        containsFail = true;
    }
    if (data.serialStateCanTest[serial] === false) {
        containsFail = true;
    }
    if (data.serialStateCellVCalibMap[serial] === false) {
        containsFail = true;
    }
    if (data.serialStateCurrMeasTest[serial] === false) {
        containsFail = true;
    }
    if (data.serialStateModelParamWrite[serial] === false) {
        containsFail = true;
    }

    return containsFail;

};

bcProd.checkForSuccess = function (data) {
    let serial = data.targetDevSerialNumber;
    let success = true;
    if (!data.serialStateBalMap[serial]) {
        success = false;
    }
    if (!data.serialStateBalTempSensorMap[serial]) {
        success = false;
    }
    if (!data.serialStateCanTest[serial]) {
        success = false;
    }
    if (!data.serialStateCellVCalibMap[serial]) {
        success = false;
    }
    if (!data.serialStateCurrMeasTest[serial]) {
        success = false;
    }
    if (!data.serialStateModelParamWrite[serial]) {
        success = false;
    }
    return success;
};

bcProd.resetAutoDialog = function () {
    bcProd.flags.initCounter = 0;
    bcProd.flags.dialogDisplayed = 0;
};

bcProd.createMessageDialog = function () {
    bcProd.comp.onCompleteSuccessMessageDialog = new SMDUIDialog({
        modal: true,
        heading: 'Battery calibration success',
        draggable: true,
        onCloseButton: bcProd.resetAutoDialog
    });

    ;
    hh.span(bcProd.comp.onCompleteSuccessMessageDialog.contentDiv, "Calibration completed scuccessfully", "font-size: large");

    bcProd.comp.onProgressFailDialog = new SMDUIDialog({
        modal: true,
        heading: 'Battery calibration failed',
        draggable: true,
        onCloseButton: bcProd.resetAutoDialog

    });
    bcProd.comp.failMessageSpan = hh.span(bcProd.comp.onProgressFailDialog.contentDiv, "", "font-size: large");
};



bcProd.createBatSelectorDialog = function () {
    let dialog = new SMDUIDialog({
        modal: true,
        heading: 'Please select battery.',
        draggable: true,
        onInitComplete: function (cont, footer, dialog) {
//            dialog.open();
        }
    });
    let cont = hh.div(dialog.contentDiv, "batSelectorWraper");
    if (dm.selected.param.bmsModelParamMap) {
        for (let model in dm.selected.param.bmsModelParamMap) {
//            let modelId = model;
            let buttonDiv = hh.div(cont, "batSelectorButton");

            let headerDiv = hh.div(buttonDiv, 'batSelectorBtnHeader');
            headerDiv.innerHTML = model;

            let imgFolderPath = mu.getContextPath() + '/defaultImages';
            let devImg = document.createElement('img');
            hh.addClass(devImg, ["devButtonImg"]);
            let subModelID = dm.selected.param.bmsModelParamMap[model].subModelID;
            devImg.setAttribute('src', imgFolderPath + "\\devIcon_" + "23" + "_" + subModelID + ".png");
            devImg.setAttribute('alt', '');
            buttonDiv.appendChild(devImg);

            buttonDiv.onclick = function () {
                wsm.sendDevMsgExecWithJsonInst({instrExt: "initTestWithModel",
                    showMessage: true,
                    model: model
                }, function () {
                    bcProd.comp.progressDialog.open();
                    bcProd.flags.inProgress = true;
                    bcProd.comp.batSelectorDialog.close();
//                    bcProd.comp.onCompleteSuccessMessageDialog.close();
//                    bcProd.comp.onProgressFailDialog.close();
                });
                console.log(model);
            };

        }
//    hh.addCssToDom('width: auto; height: 550px; overflow: auto;', bmsex.dataComp.fw.dialog.contentDiv);
//    bmsex.dataComp.fw.cont = hh.div(bmsex.dataComp.fw.dialog.contentDiv, 'devParamPanelWrapper', 'width: 450px;');
        return dialog;
    }
};

bcProd.checkAutoBatSelectionState = function (dev, data) {
    if (Object.keys(dev.alert).length === 0) {//if there is no alerts

        if (data.currentTest === 'TEST_NONE' && !data.targetBmsCalEnvTestsPassed) {
            bcProd.flags.initCounter++;
            if (!bcProd.flags.dialogDisplayed && bcProd.flags.initCounter > 3) {
                bcProd.flags.dialogDisplayed = 1;
//                debugger;
                if (!bcProd.comp.batSelectorDialog) {
                    bcProd.comp.batSelectorDialog = bcProd.createBatSelectorDialog();
                }
                bcProd.comp.batSelectorDialog.show();
            }
        } else {
            bcProd.flags.initCounter = 0;
        }
    } else {
        bcProd.flags.initCounter = 0;
        bcProd.flags.dialogDisplayed = 0;
    }
};

bc.onSuccess = function (data) {
};

devManager.onSelectedDataReceived(bc.updateData);

//devManager.onSelectedParamInit(bc.updateParam);

devManager.onParamReceived(function (dev, param) {
    param.subModelID = dev.subModelID;
});

//
//$(document).ready(function () {
//    bcGui.initGUI();
//});

bc.getProtStateText = function (state) {
    if (state === undefined) {
        return "N/A";
    }
    switch (state) {
        case 0:
            return "Normal";
        case 1:
            return "Sleep High";
        case 2:
            return "Sleep Low";
        case 3:
            return "Awake Low";
        case 4:
            return "Override On";
        case 5:
            return "Override Off";
        case 6:
            return "Emergency Off";
        case 7:
            return "Init";
        case 8:
            return "Awake High";
    }

    return "Unknown: " + state;
};

var bmsexProd = {

};
