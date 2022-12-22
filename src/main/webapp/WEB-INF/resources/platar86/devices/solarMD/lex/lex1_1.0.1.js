/* global logCon, PF, mainUtils, moment, dm, bmsRelay, hh, bmsexDM, lexGUI, bmuH8DataMap, pm, wsm, mu */

var lex = {
    devData: {},
    warnErrDialogSerial: false,
    colorPickerInit: false,
    capacityAhParamInit: false,
    moduleParamInfoTabPannel: null,
    moduleDataInfoTabPannel: null,
    moduleParamInfoTabSelected: 0,
    moduleDataInfoTabSelected: 0
};

lex.init = function () {
    lexGUI.initGUI();
};

lex.updateData = function (dev, data) {
//    debugger;
    for (var i = 0; i < 6; i++) {
        lexGUI.compData['input' + i].value = data.inputArr[i].state;
    }
    for (var i = 0; i < 8; i++) {
        lexGUI.compData['output' + i].value = data.outputRelayArr[i].state;
        if (!lex.outputsInit) {
            lexGUI.comp.outputToggle[i].setValue(dev.data.outputRelayArr[i].state);
        }
    }
    lex.outputsInit = true;
};

lex.updateParam = function (dev, param) {
//    debugger;

    lexGUI.compParam.serialNumber.value = dev.serialNumber;
    lexGUI.compParam.deviceName.value = dev.deviceName;
    lexGUI.compParam.hwVer.value = dev.hwVer;
    lexGUI.compParam.fwVer.value = dev.fwVer;
    lexGUI.compParam.installedDate.value = dev.installedDate;
    lexGUI.compParam.manufacturer.value = dev.manufacturer;
};

dm.onSelectedDataReceived(lex.updateData);

dm.onProgressData('LV-Ex Update', lexGUI.updateProgLexFw);

dm.onSelectedParamInit(lex.updateParam);

dm.onSelectedChange(function (dev) {
    lex.outputsInit = false;
    lex.updateParam(dev, dev.getParam());
    if (dev.connected) {
        if (dev.data) {
            lex.updateData(dev, dev.getData());
        }
        if (dev.param) {
            lex.updateParam(dev, dev.getParam());
        }

    } else {
        mainUtils.setHtmlText('dataValues');
    }
});

dm.onSelectedStatusChange(function (dev, state) {
    lex.outputsInit = false;
    if (state && dev.getData() !== undefined) {
        if (dev.getData() !== undefined) {
            lex.updateData(dev, dev.getData());
        }
        if (dev.getData() !== undefined) {
            lex.updateParam(dev, dev.getParam());
        }
    } else {
        mainUtils.setHtmlText('dataValues');
    }
});

function sendInst(instr, val) {
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
}

document.addEventListener("DOMContentLoaded", function (event) {
    console.log('%c LoggerV Extender JS ver:1.0.1 ', 'font-size: 18px; -webkit-box-shadow: 0 1px 3px 0 rgb(0 0 0 / 33%), 0 5px 1px 0 rgb(0 0 0 / 14%), 0 4px 19px -1px rgb(0 0 0 / 59%)');
    lex.init();
});

//$(document).ready(function () {
//});
