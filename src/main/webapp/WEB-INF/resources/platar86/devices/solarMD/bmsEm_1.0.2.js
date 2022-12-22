/* global logCon, PF, mainUtils, moment, devManager, bmsRelay */


var em = {
    devData: {},
    warnErrDialogSerial: false,
    colorPickerInit: false,
    capacityAhParamInit: false
};

em.initBmsUpdateRestart = function () {
    devManager.sendDevMessage(
            {
                instrExt: 'executeUpdateRestart',
                instrData: '1',
                instrDataExt: '1'
            },
            function (message, data) { //success
                mainUtils.showInfoMessage()(data, "Restart  success: " + data);
            },
            function (message, error) { //Error
                mainUtils.showErrorMessage(error, "Can not mark BMSEM prod Complete. Reason: " + error);
            },
            function () { //Timeout
                mainUtils.showErrorMessage("Can not mark BMSEM prod Complete. Reason: TIMEOUT");
            });
};
em.initBmsUpdate = function () {
    devManager.sendDevMessage(
            {
                instrExt: 'updateBegin',
                instrData: '4098',
                instrDataExt: '0'
            },
            function (message, data) { //success
                mainUtils.showInfoMessage(data, "Update init success: " + data);
            },
            function (message, error) { //Error
                mainUtils.showErrorMessage(error, "Can not mark BMSEM prod Complete. Reason: " + error);
            },
            function () { //Timeout
                mainUtils.showErrorMessage("Can not mark BMSEM prod Complete. Reason: TIMEOUT");
            });
};

em.updateData = function (dev, data) {
    try {
        if (data.updateProgress === 101) {
            mainUtils.setHtmlText('updateProgress', 'Ready');
        } else {
            mainUtils.setHtmlText('updateProgress', data.updateProgress + '%');
        }
        PF('pbBmsEmUpdate').setValue(data.updateProgress);
    } catch (e) {
    }

    var ratedVoltageV = dev.getParam().ratedVoltageV || 0;
    var ratedDischargeCurrentC = dev.getParam().ratedDischargeCurrentC || 0;
    var ratedChargeCurrentC = dev.getParam().ratedChargeCurrentC || 0;
    var ratedCapacityAh = dev.getParam().ratedCapacityAh || 0;

    //console.log(data);
    var state = em.getProtStateText(data.mainProtectionStatus);
    if (data.balansingStatus > 0) {
        setText('balancingStat', 'Cell: ' + ((data.balansingStatus & 0x7F) + 1));
    } else {
        setText('balancingStat', "Not active");
    }

    setText('chargeCtrl', data.chargeControl);
    setText('dischargeCtrl', data.dischargeControl);
    setText('state', state);
    setText('voltageV', data.voltageV.toFixed(3));
    setText('currentA', data.currentA.toFixed(2));
    if (data.currentA > 0) {
        if (data.remChargeTime !== 0) {
            setText('remTime', moment.duration(data.remChargeTime, "seconds").humanize(true));
        } else {
            setText('remTime', '---');
        }
        setText('remainingTimeLable', 'Complete charge:');
        setText('powerW', ((data.voltageV * data.currentA) / 1000).toFixed(2) + ' / '
                + ((ratedVoltageV * (ratedCapacityAh * ratedChargeCurrentC)) / 1000).toFixed(2));
    } else {
        if (data.remDischargeTime !== 0) {
            setText('remTime', moment.duration(data.remDischargeTime * 1, "seconds").humanize(true));
        } else {
            setText('remTime', '---');
        }
        setText('remainingTimeLable', 'Complete discharge:');
        setText('powerW', ((data.voltageV * data.currentA) / 1000).toFixed(2) + 'kW /'
                + ((ratedVoltageV * (ratedCapacityAh * ratedDischargeCurrentC)) / 1000).toFixed(2) + 'kW');
    }
    setText('capacityP', data.capacityP.toFixed(0));
    setText('capacityAhData', data.capacityAh.toFixed(2));
    setText('energyWh', ((data.capacityAh * ratedVoltageV) / 1000).toFixed(3) + ' / '
            + ((ratedCapacityAh * ratedVoltageV) / 1000).toFixed(3));

    setText('relayStatus', data.mainRelayStatus === 0 ? 'Off' : 'On');
    setText('tempGlobal', data.temp0);
    if (data.chargeCounter > 0 && data.dischargeCounter > 0) {
        setText('cycle', (((data.chargeCounter + data.dischargeCounter) / 2) / ratedCapacityAh).toFixed(1));
    } else {
        setText('cycle', '0');
    }

    setText('tempGlobal', data.temp0 + '°C');
    setText('minCellV', (data.minCellValue / 1000).toFixed(3) + 'V @ cell'
            + (data.minCellNumber + 1));
    setText('maxCellV', (data.maxCellValue / 1000).toFixed(3) + 'V @ cell'
            + (data.maxCellNumber + 1));
    setText('cellVoltageDiff', (data.maxCellValue - data.minCellValue) + 'mV');

    for (var i = 0; i < data.cellVoltageVArr.length; i++) {
        setText('cellVoltageVArr' + (i + 1), data.cellVoltageVArr[i].toFixed(3));
    }

    setText('maxChargeCurrent', (data.maxChargeCurrent / 1000).toFixed(2));
    setText('maxDischargeCurrent', (data.maxDischargeCurrent / 1000).toFixed(2));
    setText('maxChargeCurrentDuration', data.maxChargeCurrentDuration);
    setText('maxDischargeCurrentDuration', data.maxDischargeCurrentDuration);

    if (dev.paramLoaded === true) {
        if (dev.capacityAhInit === undefined) {
            dev.capacityAhInit = true;
            mainUtils.setWidgetValue("capacityAh", data.capacityAh);
            devManager.onParamChange('capacityAh');
        }
    }
};

em.updateParam = function (dev, param) {

    if (em.colorPickerInit === false) {
        em.colorPickerInit = true;
        mainUtils.addColorpickerCallback('ledButtonStaticValue', em.onColorPickerChange);
    }
    if (param === undefined) {
        return;
    }
    mainUtils.setHtmlText("firmware", dev.fwVer);
    mainUtils.setHtmlText("batName", dev.deviceName);
    mainUtils.setHtmlText("batModel", em.subModelName(dev.subModelID));

//    console.log(param);
    setText('cellModelLabel', param.cellModel);
    setText('cellManufacturerLabel', param.cellManufacturer);
    setText('manufacturingDateLabel', moment(param.manufacturingDate).format('DD-MM-YYYY hh:mm'));
    setText('storageNameLabel ', param.storageName);
    setText('ratedCapacityLabel ', (param.ratedCapacityAh).toFixed(1) + 'Ah / ' + (param.ratedVoltageV * param.ratedCapacityAh).toFixed(1) + 'Wh');
    setText('ratedVoltageVLabel ', (param.ratedVoltageV).toFixed(1) + 'V');

    var ratedChargeCurrent = ((param.ratedChargeCurrentC * param.ratedCapacityAh)).toFixed(0);
    var ratedChargePower = ((param.ratedVoltageV * Number(ratedChargeCurrent)) / 1000).toFixed(2);
    setText('ratedChargeLabel ', ratedChargePower + 'kW / '
            + ratedChargeCurrent + 'A ('
            + param.ratedChargeCurrentC.toFixed(2) + 'C)');

    var ratedDischargeCurrent = ((param.ratedDischargeCurrentC * param.ratedCapacityAh)).toFixed(0);
    var ratedDischargePower = ((param.ratedVoltageV * Number(ratedDischargeCurrent)) / 1000).toFixed(2);
    setText('ratedDischargeLabel ', ratedDischargePower + 'kW / '
            + ratedDischargeCurrent + 'A ('
            + param.ratedDischargeCurrentC.toFixed(2) + 'C)');

    dev.paramLoaded = true;
};


em.onColorPickerChange = function (value, intVal, widget) {
    devManager.onParamChange(widget);
};

devManager.onSelectedDataReceived(em.updateData);

devManager.onSelectedParamInit(em.updateParam);

devManager.onSelectedChange(function (sDev) {
    var image1 = document.querySelector('.devTbPanel-' + sDev.serialNumber + ' img');
    mainUtils.initCanvas('bmsEmInfoIcon', image1, 280, 280);

    em.updateParam(sDev, sDev.getParam());
    if (sDev.connected) {
        em.updateData(sDev, sDev.getData());
        em.updateParam(sDev, sDev.getParam());
    } else {
        setText('dataValues');
    }
});

devManager.onSelectedStatusChange(function (dev, state) {
    if (state && dev.getData() !== undefined) {
        em.updateData(dev, dev.getData());
        em.updateParam(dev, dev.getParam());
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

em.getProtStateText = function (state) {
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

em.loadConfigSet = function (name) {

};

em.subModelName = function (id) {
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