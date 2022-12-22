/* global logCon, PF, mainUtils, moment, devManager, bmsRelay */


var oasis = {
    devData: {},
    warnErrDialogSerial: false,
    colorPickerInit: false,
    capacityAhParamInit: false
};


oasis.updateData = function (dev, data) {
    setText('batStatus', (data.batStatus ).toFixed(2));
    setText('batteryCurrent', (data.batCurrent ).toFixed(2));
    setText('batteryVoltage', (data.batVoltage ).toFixed(2));
    setText('batReceivedChCurrentA', (data.batReceivedChCurrentA ).toFixed(2));
    setText('batReceivedChVoltageV', (data.batReceivedChVoltageV ).toFixed(2));
    setText('batReceivedDischCurrentA', (data.batReceivedDischCurrentA ).toFixed(2));
    setText('batReceivedDischVoltageV', (data.batReceivedDischVoltageV ).toFixed(2));
    setText('batReceivedSoc', (data.batReceivedSoc ).toFixed(2));
    setText('batReceivedVoltage', (data.batReceivedVoltage ).toFixed(2));
    
    //grid
    setText('extSourcePower', (data.gridInPower.powerW /1000).toFixed(2));
    setText('extSourcePowerVA', (data.gridInPower.apparentPowerVA /1000).toFixed(2));
    setText('gridVoltage', (data.gridInPower.voltageV ).toFixed(2));
    setText('gridCurrent', (data.gridInPower.currentA ).toFixed(2));
    setText('gridEnergy', (data.gridInPower.energyWh /1000).toFixed(2));
    //load
    setText('acOutputActivePower', (data.loadPower.powerW /1000).toFixed(2));
    setText('acOutputAparentPower', (data.loadPower.apparentPowerVA /1000).toFixed(2));
    setText('outputVoltage', (data.loadPower.voltageV ).toFixed(2));
    setText('outputCurrent', (data.loadPower.currentA ).toFixed(2));
    setText('outputTotalEnergy', (data.loadPower.energyWh / 1000).toFixed(2));
    
};

oasis.updateParam = function (dev, param) {

//    if (oasis.colorPickerInit === false) {
//        oasis.colorPickerInit = true;
//        mainUtils.addColorpickerCallback('ledButtonStaticValue', oasis.onColorPickerChange);
//    }
//    if (param === undefined) {
//        return;
//    }
//    mainUtils.setHtmlText("firmware", dev.fwVer);
//    mainUtils.setHtmlText("batName", dev.deviceName);
//    mainUtils.setHtmlText("batModel", oasis.subModelName(dev.subModelID));

    dev.paramLoaded = true;
};


devManager.onSelectedDataReceived(oasis.updateData);

devManager.onSelectedParamInit(oasis.updateParam);

devManager.onSelectedChange(function (sDev) {

    oasis.updateParam(sDev, sDev.getParam());
    if (sDev.connected) {
        oasis.updateData(sDev, sDev.getData());
        oasis.updateParam(sDev, sDev.getParam());
    } else {
        setText('dataValues');
    }
});

devManager.onSelectedStatusChange(function (dev, state) {
    if (state && dev.getData() !== undefined) {
        oasis.updateData(dev, dev.getData());
        oasis.updateParam(dev, dev.getParam());
    } else {
        setText('dataValues');
    }
});



$(document).ready(function () {

});

var setText = function (className, val) {
    if (val) {
        $('.' + className).text(val);
    } else {
        $('.' + className).text('N/A');
    }
};

oasis.getProtStateText = function (state) {
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

oasis.loadConfigSet = function (name) {

};

oasis.subModelName = function (id) {
    if (id === undefined) {
        return "UNKNOWN NULL";
    }
    switch (id) {
        case 20205:
        case 407401 & 0xFFFF:
        {
            return 'SS4074-02';
        }
        case 403701:
        case 403701 & 0xFFFF:
        {
            return 'SS4037-02';
        }
    }
    return "UNKNOWN " + id;
};