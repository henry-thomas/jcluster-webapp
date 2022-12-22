/* global logCon, PF, mainUtils, moment, mainUtils, axp, devManager, axpIcon, mu */
//devManager
var axp = {};
function getFaultMessage(mode) {
    switch (mode) {
        case 0:
            return 'No fault.';
        case 1:
            return 'Fan is locked when inverter is off.';
        case 2:
            return 'Over temperature';
        case 3:
            return 'Battery voltage is too high';
        case 4:
            return 'Battery voltage is too low';
        case 5:
            return 'Output short circuited or over temperature is detected by internal converter components';
        case 6:
            return 'Output voltage is too high';
        case 7:
            return 'Overload time out';
        case 8:
            return 'Bus voltage is too high';
        case 9:
            return 'Bus soft start failed';
        case 11:
            return 'Main relay failed';
        case 51:
            return 'Over current or surge';
        case 52:
            return 'Bus voltage is too low';
        case 53:
            return 'Inverter soft start failed';
        case 55:
            return 'Over DC voltage in AC output';
        case 56:
            return 'Battery connection is open';
        case 57:
            return 'Current sensor failed';
        case 58:
            return 'Output voltage is too low';
        case 60:
            return 'Power feedback protection';
        case 71:
            return 'Firmware version inconsistent';
        case 72:
            return 'Current sharing fault';
        case 80:
            return 'CAN fault';
        case 81:
            return 'Host loss';
        case 82:
            return 'Synchronization loss';
        case 83:
            return 'Battery voltage detected different';
        case 84:
            return 'AC input voltage and frequency detected different';
        case 85:
            return 'AC output current unbalance';
        case 86:
            return 'AC output mode setting is different';
    }
    return  mode;
}
;
function getOperationMode(mode) {
    switch (mode) {
        case "D":
            return 'Disabled';
        case "P":
            return 'Power ON mode';
        case "F":
            return 'Fault mode';
        case "H":
            return 'Power saving mode';
        case "L":
            return 'Line mode';
        case "B":
            return 'Battery mode';
        case "S":
            return 'Standby mode';
        case "Y":
            return 'Bypass Mode';
        case "E":
            return 'ECO Mode';
    }
    return "unknown: " + mode;
}
;

devManager.onSelectedChange(function (sDev) {

    axp.updateParam(sDev, sDev.getParam());
    if (sDev.connected) {
        axp.updateData(sDev, sDev.getData());
        axp.updateParam(sDev, sDev.getParam());
    } else {
        mainUtils.setHtmlText('dataValues');
    }
});

devManager.onSelectedStatusChange(function (dev, state) {
    if (state && dev.getData() !== undefined) {
        axp.updateData(dev, dev.getData());
        axp.updateParam(dev, dev.getParam());
    } else {
        mainUtils.setHtmlText('dataValues');

    }
});

devManager.onSelectedParamReceived(axp.updateParam);

axp.updateParam = function (dev, param) {
    if (param !== undefined) {
//        document.querySelector(".subDeviceNameDialogForm label").textContent = "Name for: " + dev.serialNumber;
//        mainUtils.setHtmlText("comPortConn", param.portName);
        for (var item in param) {

            mainUtils.setSelectOneMenu(param.batteryType, "batteryType");
//            mainUtils.setSelectOneMenu(param.chargeSourcePriority, "chargeSourcePriority");

        }
    }
};

devManager.onSelectedDataReceived(function (dev, data) {
    axp.updateData(dev, data);
});

axp.updateData = function (dev, data) {
//

    if (data.pvPower.powerW > 0) {
        data.statSccCharging = true;
    }
    mainUtils.setHtmlText("faultCode", getFaultMessage(data.faultCode));
    mainUtils.setHtmlText("deviceMode", getOperationMode(data.workMode));
    mainUtils.setHtmlText("sN", (data.serialNumber));
    mainUtils.setHtmlText("fwNumber", (dev.fwVer));
//    mainUtils.setHtmlText("serialNumber", (data.serialNumber);

    mainUtils.setHtmlText("mpptChargingPower", (data.pvPower.powerW / 1000), 2);
    mainUtils.setHtmlText("statSccCharging", data.statSccCharging);
    mainUtils.setHtmlText("mpptInputVoltage", data.pvPower.inputVoltage, 2);
    mainUtils.setHtmlText("mpptInputCurrent", data.pvPower.inputCurrent, 2);
    mainUtils.setHtmlText("mpptBatCurrent", data.pvPower.currentA, 2);
    mainUtils.setHtmlText("mpptyEnergy", (data.pvPower.energyWh / 1000), 2);


    mainUtils.setHtmlText("batteryVoltage", data.batteryVoltage + "V");
    var current = data.batteryCurrent.toFixed(2);
    if (data.batteryCurrent > 0) {
        current += 'A (Charging)';
    } else {
        current += 'A (Discharging)';
    }

    mainUtils.setHtmlText("batteryCurrent", current);

    mainUtils.setHtmlText("extSourcePower", (data.gridInPower.powerW / 1000), 2);
    mainUtils.setHtmlText("gridVoltage", data.gridInPower.voltageV);
    mainUtils.setHtmlText("gridFrequency", data.gridInPower.frequencyF);
    mainUtils.setHtmlText("extSrcTotalEnergy", ((data.gridInPower.energy) / 1000).toFixed(3));
    mainUtils.setHtmlText("statAcCharging", data.statGridLost);
    mainUtils.setHtmlText("statLineLoss", data.statAcCharging);
    mainUtils.setHtmlText("gridEnergy", (data.gridInPower.energyWh / 1000), 2);

    mainUtils.setHtmlText("outputVoltage", data.loadPower.voltageV);
    mainUtils.setHtmlText("acOutputFrequency", data.loadPower.frequencyF);
    mainUtils.setHtmlText("acOutputActivePower", (data.loadPower.powerW / 1000), 2);
    mainUtils.setHtmlText("acOutputAparentPower", (data.loadPower.apparentPowerVA / 1000), 2);
    mainUtils.setHtmlText("outputTotalEnergy", (data.loadPower.energyWh / 1000), 2);

    //if (axpIcon) {


    try {
    mainUtils.setHtmlText("batteryPower", (data.batteryVoltage * data.batteryCurrent).toFixed(1) );
        
    } catch (e) {
        
    }


//        axpert.setHtmlText("chargCtrlChLevel", data.chargCtrlChLevel);

};



$(document).ready(function () {

});

