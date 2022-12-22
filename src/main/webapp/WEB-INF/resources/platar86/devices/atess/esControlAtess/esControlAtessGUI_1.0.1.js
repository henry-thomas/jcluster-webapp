/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, hh, escCDevGui */


var escCAtessGui = {
    paramComp: {

    },
    dataComp: {
        esc: {}
    }
};

escCAtessGui.initSettingsBasicComp = function () {
    let cont = escCDevGui.paramComp.accordianPanel.getTabById('basic');
//    new ParamSetting(cont, 'busName', {type: 'inputText', title: 'ES Bus Name:', unit: '',
//        ctrlInfo: 'Actual DC BUS at LoggerV2 used for control calculations.'
//    });
////    new ParamSetting(cont, 'displayName', {type: 'inputText', title: 'Display name at CCGX:', unit: '',
////        ctrlInfo: 'This name will be desplay as battery name at CCGX.'
////    });
//
};

escCAtessGui.initSettingsComp = function () {

    escCAtessGui.initSettingsBasicComp();
};

escCAtessGui.initDataComp = function (container) {
    let panel = hh.div(container, 'actDataContainer');

    card = hh.createActDataPanelCard("Received From Device", null, panel);
    escCDevGui.dataComp.missedHearbeats = hh.adf(card, 'Missed  ping counter:');
    escCDevGui.dataComp.receivedBatPower = hh.adf(card, 'Received Bat Power:');
    escCDevGui.dataComp.receivedDeviceStatus = hh.adf(card, 'Received Status:');

};

escCAtessGui.init = function () {
    escCDevGui.init();


    let dataContainer = escCDevGui.dataComp.mainTabPanel.getItemContentById('actualData');
    escCAtessGui.initDataComp(dataContainer);

//    let settings = escCAtessGui.dataComp.mainTabPanel.getItemContentById('settings');
    escCAtessGui.initSettingsComp();
};
