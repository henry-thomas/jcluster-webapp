/* global logCon, PF, mainUtils, moment, devManager, bmsRelay */


var mppt = {
    warnErrDialogSerial: false,
    colorPickerInit: false,
    capacityAhParamInit: false,
    bmsData: []
};

mppt.updateData = function (dev, data) {
//    console.log(data);
    mainUtils.setHtmlText('energyWh', (data.mpptPower.energyWh / 1000).toFixed(2));
    mainUtils.setHtmlText('inputVoltageV', data.mpptPower.inputVoltageV.toFixed(2));
    mainUtils.setHtmlText('inputCurrentA', data.mpptPower.inputCurrentA.toFixed(2));
    mainUtils.setHtmlText('outputVoltageV', data.mpptPower.outputVoltageV.toFixed(2));
    mainUtils.setHtmlText('outputCurrentA', data.mpptPower.outputCurrentA.toFixed(2));
    mainUtils.setHtmlText('outputPowerW', data.mpptPower.outputPowerW);

    mainUtils.setHtmlText('maxPvVoltage', data.maxPvVoltage.toFixed(2));
    mainUtils.setHtmlText('maxPvCurrent', data.maxPvCurrent.toFixed(2));
    mainUtils.setHtmlText('maxBatVoltage', data.maxBatVoltage.toFixed(2));
    mainUtils.setHtmlText('maxBatCurrent', data.maxBatCurrent.toFixed(2));
    mainUtils.setHtmlText('maxPvPower', data.maxPvPower);
    mainUtils.setHtmlText('temp', data.temp);

    mainUtils.setHtmlText('chargeCtrl', data.chargeCtrl);
    mainUtils.setHtmlText('dischargeCtrl', data.dischargeCtrl);
    mainUtils.setHtmlText('charging', data.charging);

    mainUtils.setHtmlText('batParamAbsVoltage', data.batParamAbsVoltage.toFixed(2));
    mainUtils.setHtmlText('batParamFloatVoltage', data.batParamFloatVoltage.toFixed(2));
    mainUtils.setHtmlText('batParamChargeCurrent', data.batParamChargeCurrent);
    mainUtils.setHtmlText('energyWh', (data.mpptPower.energyWh / 1000).toFixed(2));


    mppt.bmsData.length = 0;
    for (var item in data.bmsMap) {

        if (data.bmsMap[item].online === 1) {
            data.bmsMap[item].online = "Online";
        } else {
            data.bmsMap[item].online = "Offline";
            for (var field in data.bmsMap[item]) {
                if (field !== 'online' && field !== 'serial') {
                    data.bmsMap[item][field] = "---";
                }
            }
        }
        var bmsVal = data.bmsMap[item];
        mppt.bmsData.push(bmsVal);
    }

    $('#tblBmsCtrl').puidatatable('reload');
};
mppt.updateParam = function (dev, param) {

};

devManager.onSelectedDataReceived(mppt.updateData);

devManager.onSelectedParamInit(mppt.updateParam);

devManager.onSelectedChange(function (sDev) {
    if (sDev.connected) {
        mppt.updateData(sDev, sDev.getData());
    } else {
        setText('dataValues', 'N/A');
        mppt.bmsData.length = 0;
        $('#tblBmsCtrl').puidatatable('reload');
    }
//    console.log(arguments);
});

devManager.onSelectedStatusChange(function (sDev) {
  if (sDev.connected) {
        mppt.updateData(sDev, sDev.getData());
    } else {
        setText('dataValues', 'N/A');
        mppt.bmsData.length = 0;
        $('#tblBmsCtrl').puidatatable('reload');
    }
});

$(function () {
    $('#tblBmsCtrl').puidatatable({
        caption: 'BMS Control',
        columns: [
            {field: 'serial', headerText: 'Serial:'},
            {field: 'chargeCtrl', headerText: 'Charge ctrl'},
            {field: 'dishcargeCtrl', headerText: 'Discharge ctrl'},
            {field: 'capacity', headerText: 'Capacity (%)'},
            {field: 'current', headerText: 'Current (A)'},
            {field: 'online', headerText: 'Available'},
            {field: 'errorCnt', headerText: 'Errors'},
            {field: 'warningCnt', headerText: 'Warnings'}
        ],
        datasource: mppt.bmsData
    });
});

var setText = function (className, val) {
    if (val !== undefined) {
        if (val !== null) {
            $('.' + className).text(val);
        } else {
            $('.' + className).text('N/A');
        }
    } else {
        $('.' + className).text('---');
    }
};
