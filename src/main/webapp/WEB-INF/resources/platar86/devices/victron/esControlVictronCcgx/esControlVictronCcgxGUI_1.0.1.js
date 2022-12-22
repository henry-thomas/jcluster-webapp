/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, hh, escCDevGui */


var escCVCcgxGui = {
    paramComp: {

    },
    dataComp: {
        esc: {}
    }
};

//escCVCcgxGui.initSettingsBasicComp = function () {
//    let cont = escCDevGui.paramComp.accordianPanel.getTabById('basic').content;
//    new ParamSetting(cont, 'chargeCtrlSetpointImmedFirst', {type: 'inputNumber', title: 'Setpoint Immedeately Charge I:', unit: '%CC',
//        ctrlInfo: 'If Bit 5 data (level 1 forced charging) function is turned on, the maximum charging current allowed for level 1 force charging needs to be controlled;'
//    });
//    new ParamSetting(cont, 'chargeCtrlSetpointImmedSecond', {type: 'inputNumber', title: 'Setpoint Immedeately Charge II:', unit: '%CC',
//        ctrlInfo: 'The Bit4 (level 2 forced charging) function is turned on, the maximum charging current allowed for level 2 forced charging needs to be controlled.'
//    });
//////    new ParamSetting(cont, 'displayName', {type: 'inputText', title: 'Display name at CCGX:', unit: '',
//////        ctrlInfo: 'This name will be desplay as battery name at CCGX.'
//////    });
////
//};

escCVCcgxGui.initSettingsComp = function () {

//    escCVCcgxGui.initSettingsBasicComp();
};

escCVCcgxGui.initDataComp = function () {
    let card = escCDevGui.dataPanel.sendToDev;
    escCDevGui.dataComp.deviceVisible = hh.adf(card, 'CCGX Detected:');

};

escCVCcgxGui.init = function () {
    escCDevGui.init();

//    let dataContainer = escCDevGui.dataComp.mainTabPanel.getItemContentById('actualData');
//    escCVCcgxGui.initDataComp(dataContainer);

//    let settings = escCVCcgxGui.dataComp.mainTabPanel.getItemContentById('settings');
    escCVCcgxGui.initSettingsComp();
};
