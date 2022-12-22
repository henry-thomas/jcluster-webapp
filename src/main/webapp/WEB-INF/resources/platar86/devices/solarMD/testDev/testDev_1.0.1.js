/* global logCon, PF, mainUtils, moment, dm, bmsRelay, hh, bmsexDM, tDevGUI, tDevDataMap, pm */

var tDev = {
    devData: {},
    warnErrDialogSerial: false,
    colorPickerInit: false,
    capacityAhParamInit: false,
    moduleParamInfoTabPannel: null,
    moduleDataInfoTabPannel: null,
    moduleParamInfoTabSelected: 0,
    moduleDataInfoTabSelected: 0
};

tDev.init = function () {
    tDevGUI.createGui(dgm.contentPanel, testDevPage);
};

tDev.updateData = function (dev, data) {

};

tDev.updateParam = function (dev, param) {
  
};

tDev.updateDataProgress = function (dev, prog) {
//    console.log(prog);
};

dm.onSelectedDataReceived(tDev.updateData);
dm.onSelectedParamInit(tDev.updateParam);

dm.onSelectedChange(function (dev) {
    if (dev.connected) {
        if (dev.data) {
            tDev.updateData(dev, dev.getData());
        }
        if (dev.param) {
            tDev.updateParam(dev, dev.getParam());
        }

    } else {
        mainUtils.setHtmlText('dataValues');
    }
});

dm.onSelectedStatusChange(function (dev, state) {
    if (state && dev.getData() !== undefined) {
        if (dev.getData() !== undefined) {
            tDev.updateData(dev, dev.getData());
        }
        if (dev.getData() !== undefined) {
            tDev.updateParam(dev, dev.getParam());
        }
    } else {
        tDevGUI.setModuleCount(0);
        mainUtils.setHtmlText('dataValues');
    }
});

dm.onParamReceived(function (dev, param) {
    param.subModelID = dev.subModelID;
});


$(document).ready(function () {
    console.log('%c SolarMD TestDev JS ver:1.0.1 ', 'font-size: 18px; -webkit-box-shadow: 0 1px 3px 0 rgb(0 0 0 / 33%), 0 5px 1px 0 rgb(0 0 0 / 14%), 0 4px 19px -1px rgb(0 0 0 / 59%)');
    tDev.init();
});
