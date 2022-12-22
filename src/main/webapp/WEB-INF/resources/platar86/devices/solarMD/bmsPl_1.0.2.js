/* global logCon, PF, mainUtils, moment, devManager, bmsRelay */


var bmsPl = {
    retedValueSet: false,
    retedValueParamSet: false,
    updateParam: function (dev, param) {
        console.log(param);
        if (!bmsPl.retedValueParamSet) {
            bmsPl.retedValueParamSet = true;



        }
    },
    updateData: function (dev, data) {


        var ratedVoltageV = data.ratedVoltageV;
        if (dev.getParam() !== undefined) {
            var ratedDischargeCurrentC = dev.getParam().ratedDischargeCurrentC || 0;
            var ratedChargeCurrentC = dev.getParam().ratedChargeCurrentC || 0;
        }
        var ratedCapacityAh = data.ratedCapacityAh || 0;

        var state = getOperationMode(data.state);
        mainUtils.setHtmlText('state', state);
//        if (data.balansingStatus > 0) {
//            mainUtils.setHtmlText('balancingStat', 'Cell: ' + ((data.balansingStatus & 0x7F) + 1));
//        } else {
//            mainUtils.setHtmlText('balancingStat', "Not active");
//        }

        mainUtils.setHtmlText('chargeCtrl', data.chargeControl);
        mainUtils.setHtmlText('dischargeCtrl', data.dischargeControl);
        mainUtils.setHtmlText('voltageV', data.voltageV.toFixed(3));
        mainUtils.setHtmlText('currentA', data.currentA.toFixed(2));

        if (data.currentA > 0) {
            if (data.remChargeTime !== 0) {
//                mainUtils.setHtmlText('remTime', moment.duration(data.remChargeTime, "seconds").humanize(true));
            } else {
//                mainUtils.setHtmlText('remTime', '---');
            }
//            mainUtils.setHtmlText('remainingTimeLable', 'Complete charge:');
            mainUtils.setHtmlText('powerW', ((data.voltageV * data.currentA) / 1000).toFixed(2) + ' / '
                    + ((ratedVoltageV * (ratedCapacityAh * ratedChargeCurrentC)) / 1000).toFixed(2));
        } else {
            if (data.remDischargeTime !== 0) {
//                mainUtils.setHtmlText('remTime', moment.duration(data.remDischargeTime * 1, "seconds").humanize(true));
            } else {
//                mainUtils.setHtmlText('remTime', '---');
            }
//            mainUtils.setHtmlText('remainingTimeLable', 'Complete discharge:');
            mainUtils.setHtmlText('powerW', ((data.voltageV * data.currentA) / 1000).toFixed(2) + 'kW /'
                    + ((ratedVoltageV * (ratedCapacityAh * ratedDischargeCurrentC)) / 1000).toFixed(2) + 'kW');
        }
        mainUtils.setHtmlText('capacityP', data.capacityP.toFixed(0));
        mainUtils.setHtmlText('capacityAhData', data.capacityAh.toFixed(2));
        mainUtils.setHtmlText('energyWh', ((data.capacityAh * ratedVoltageV) / 1000).toFixed(3) + ' / '
                + ((ratedCapacityAh * ratedVoltageV) / 1000).toFixed(3));

        mainUtils.setHtmlText('relayStatus', data.mainRelayStatus === 0 ? 'Off' : 'On');
        mainUtils.setHtmlText('tempGlobal', data.temp0);
        if (data.chargeCounter > 0 && data.dischargeCounter > 0) {
            mainUtils.setHtmlText('cycle', (((data.chargeCounter + data.dischargeCounter) / 2) / ratedCapacityAh).toFixed(1));
        } else {
            mainUtils.setHtmlText('cycle', '0');
        }

        mainUtils.setHtmlText('tempGlobal', (data.tempGlobal / 10).toFixed(1));

        let minCellVal = 0xFFFF;
        let minCellNum = -1;
        let maxCellVal = 0;
        let maxCellNum = -1;

        for (var i = 0; i < data.cellVoltageVArr.length; i++) {
            if (minCellVal > data.cellVoltageVArr[i]) {
                minCellVal = data.cellVoltageVArr[i];
                minCellNum = i;
            }
            if (maxCellVal < data.cellVoltageVArr[i]) {
                maxCellVal = data.cellVoltageVArr[i];
                maxCellNum = i;
            }


            mainUtils.setHtmlText('cellVoltageVArr' + (i + 1), data.cellVoltageVArr[i].toFixed(3));
        }
        mainUtils.setHtmlText('minCellV', (minCellVal).toFixed(3) + 'V @ cell'
                + (minCellNum + 1));
        mainUtils.setHtmlText('maxCellV', (maxCellVal).toFixed(3) + 'V @ cell'
                + (maxCellNum + 1));
        mainUtils.setHtmlText('cellVoltageDiff', (maxCellVal - minCellVal), 3);

        mainUtils.setHtmlText('maxChargeCurrent', (data.maxChargeCurrent / 1000).toFixed(2));
        mainUtils.setHtmlText('maxDischargeCurrent', (data.maxDischargeCurrent / 1000).toFixed(2));
        mainUtils.setHtmlText('maxChargeCurrentDuration', data.maxChargeCurrentDuration);
        mainUtils.setHtmlText('maxDischargeCurrentDuration', data.maxDischargeCurrentDuration);

        if (!bmsPl.retedValueSet) {
            if (dev.getParam()) {
                bmsPl.retedValueSet = true;
//                dev.getParam().ratedDischargeCurrentC
//                dev.getParam().ratedChargeCurrentC
                let ratedCharge = data.ratedCapacityAh * dev.getParam().ratedChargeCurrentC;
                let ratedDischarge = data.ratedCapacityAh * dev.getParam().ratedChargeCurrentC;
                mainUtils.setHtmlText('ratedChargeLabel', (ratedCharge).toFixed(0)
                        + ' / ' + (ratedCharge * data.ratedVoltageV).toFixed(0));
                mainUtils.setHtmlText('ratedDischargeLabel', (ratedDischarge).toFixed(0)
                        + ' / ' + (ratedDischarge * data.ratedVoltageV).toFixed(0));
            }

            mainUtils.setHtmlText('storageNameLabel', data.storageName);
            mainUtils.setHtmlText('ratedCapacityLabel', data.ratedCapacityAh + ' / '
                    + (data.ratedVoltageV * data.ratedCapacityAh).toFixed(1) + '');
            mainUtils.setHtmlText('ratedVoltageVLabel', data.ratedVoltageV);

        }

        mainUtils.setHtmlText('chargeControl', data.chargeControl);
        mainUtils.setHtmlText('dischargeControl', data.dischargeControl);
//        if (dev.paramLoaded === true) {
//            if (dev.capacityAhInit === undefined) {
//                dev.capacityAhInit = true;
//                mainUtils.setWidgetValue("capacityAh", data.capacityAh);
//                devManager.onParamChange('capacityAh');
//            }
//        }
    }
};

devManager.onSelectedChange(function (sDev) {
//    var image1 = document.querySelector('.devTbPanel-' + sDev.serialNumber + ' img');
//    mainUtils.initCanvas('bmsEmInfoIcon', image1, 280, 280);
    bmsPl.retedValueSet = false;

    if (sDev.connected) {
        bmsPl.updateData(sDev, sDev.getData());
        bmsPl.updateParam(sDev, sDev.getParam());
    } else {
        mainUtils.setHtmlText('dataValues');
    }
});

devManager.onSelectedStatusChange(function (dev, state) {
    bmsPl.retedValueSet = false;
    if (state && dev.getData() !== undefined) {
        bmsPl.updateData(dev, dev.getData());
        bmsPl.updateParam(dev, dev.getParam());
    } else {
        mainUtils.setHtmlText('dataValues');
    }
});
devManager.onSelectedParamInit(function (dev, param) {
    bmsPl.updateParam(dev, param);
});
devManager.onSelectedDataReceived(function (dev, data) {
    bmsPl.updateData(dev, data);
});

function getOperationMode(mode) {
    switch (mode) {
        case 0:
            return 'Auto';
        case 4:
            return 'Auto';
    }
    return "unknown";
}
function getRelayStatus(mode) {
    switch (mode) {
        case 0:
            return '1 OFF 2 OFF';
        case 1:
            return '1 ON  2 OFF';
        case 2:
            return '1 OFF  2 ON';
        case 3:
            return '1 ON  2 ON';
    }
    return "unknown";
}
function getMessageObject(javaClassName) {
    switch (javaClassName) {
        case "com.platar86.myPowerLogger.subDevEntity.bmsPl.BmsEmData":
            return 'data';
        case "com.platar86.myPowerLogger.subDevEntity.bmsPl.BmsEmParam":
            return 'Param';
    }
    return "unknown";
}


$(document).ready(function () {

});