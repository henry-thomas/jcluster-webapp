/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, hh, escCDevGui */


var escCSunSynkGui = {
    paramComp: {

    },
    dataComp: {
        esc: {}
    }
};

escCSunSynkGui.initSettingsBasicComp = function () {
    let cont = escCDevGui.paramComp.accordianPanel.getTabById('basic').content;
    new ParamSetting(cont, 'chargeCtrlSetpointImmedFirst', {type: 'inputNumber', title: 'Setpoint Immedeately Charge I:', unit: '%CC',
        ctrlInfo: 'If Bit 5 data (level 1 forced charging) function is turned on, the maximum charging current allowed for level 1 force charging needs to be controlled;'
    });
    new ParamSetting(cont, 'chargeCtrlSetpointImmedSecond', {type: 'inputNumber', title: 'Setpoint Immedeately Charge II:', unit: '%CC',
        ctrlInfo: 'The Bit4 (level 2 forced charging) function is turned on, the maximum charging current allowed for level 2 forced charging needs to be controlled.'
    });
////    new ParamSetting(cont, 'displayName', {type: 'inputText', title: 'Display name at CCGX:', unit: '',
////        ctrlInfo: 'This name will be desplay as battery name at CCGX.'
////    });
//
};

escCSunSynkGui.initSettingsComp = function () {

    escCSunSynkGui.initSettingsBasicComp();
};

escCSunSynkGui.initDataComp = function (container) {
    let card = escCDevGui.dataPanel.sendToDev;
    escCDevGui.dataComp.ctrlChargeEnable = hh.adf(card, 'Charging Enable:');
    escCDevGui.dataComp.ctrlDischargeEnable = hh.adf(card, 'Discharging Enable:');
    escCDevGui.dataComp.ctrlChargeImmedFirst = hh.adf(card, 'Charging Immediately I:');
    escCDevGui.dataComp.ctrlChargeImmedSecond = hh.adf(card, 'Charging Immediately II:');
    escCDevGui.dataComp.warningChargeToHigh = hh.adf(card, 'Alarm Charge High:');
    escCDevGui.dataComp.warningDischargeToHigh = hh.adf(card, 'Alarm Discharge High:', '', {true: 'Active', false: 'Not Active'});

    let panel = hh.div(container, 'actDataContainer');

    card = hh.createActDataPanelCard("Received From Device", null, panel);
    escCDevGui.dataComp.missedHearbeats = hh.adf(card, 'Missed  ping counter:');
    escCDevGui.dataComp.receivedBatPower = hh.adf(card, 'Received Bat Power:');
    escCDevGui.dataComp.receivedDeviceStatus = hh.adf(card, 'Received Status:');

};

escCSunSynkGui.init = function () {
    escCDevGui.init();

    let dataContainer = escCDevGui.dataComp.mainTabPanel.getItemContentById('actualData');
    escCSunSynkGui.initDataComp(dataContainer);

//    let settings = escCSunSynkGui.dataComp.mainTabPanel.getItemContentById('settings');
    escCSunSynkGui.initSettingsComp();
};
