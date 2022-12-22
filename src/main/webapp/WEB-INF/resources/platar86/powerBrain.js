/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by platar86, 2019
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 Sout Africa
 *  Phone: 021 555 2181
 *  
 */
/* global logCon, PF, axp */


//logCon.setGetIdArrCallbackFn(function () {
//    return pb5k.bmsIDArr;
//});

var pfUtil = {
    printErrpr: function (widgetVar) {
        console.log('can not find widget var: ' + widgetVar);
    },
    setInputSwitch: function (state, widgetVar) {
        var wg = PF(widgetVar);
        if (wg !== undefined) {
            if (state !== pfUtil.getInputSwitch(widgetVar)) {
                wg.toggle();
            }
        } else {
            pfUtil.printErrpr(widgetVar);
        }
    },
    getInputSwitch: function (widgetVar) {
        var wg = PF(widgetVar);
        if (wg !== undefined) {
            return wg.input.prop('checked');
        } else {
            pfUtil.printErrpr(widgetVar);
        }
    },

    setSelectOneMenu: function (value, widgetVar) {
        var widget = PF(widgetVar);
        if (widget !== undefined) {
            PF(widgetVar).selectValue(value);
        } else {
            pfUtil.printErrpr(widgetVar);
        }
    },
    getSelectOneMenu: function (widgetVar) {
        var widget = PF(widgetVar);
        if (widget !== undefined) {
            return  PF(widgetVar).getSelectedValue();
        } else {
            pfUtil.printErrpr(widgetVar);
        }
    }

};

function getFaultMessage(mode) {
    switch (mode) {
        case 0:  return 'No fault.';
        case 1:  return 'Fan is locked when inverter is off.';
        case 2:  return 'Over temperature';
        case 3:  return 'Battery voltage is too high';
        case 4:  return 'Battery voltage is too low';
        case 5:  return 'Output short circuited or over temperature is detected by internal converter components';
        case 6:  return 'Output voltage is too high';
        case 7:  return 'Overload time out';
        case 8:  return 'Bus voltage is too high';
        case 9:  return 'Bus soft start failed';
   
        case 11:  return 'Main relay failed';
        case 51:  return 'Over current or surge';
        case 52:  return 'Bus voltage is too low';
        case 53:  return 'Inverter soft start failed';
        case 55:  return 'Over DC voltage in AC output';
        case 56:  return 'Battery connection is open';
        case 57:  return 'Current sensor failed';
        case 58:  return 'Output voltage is too low';
        case 60:  return 'Power feedback protection';
        case 71:  return 'Firmware version inconsistent';
        case 72:  return 'Current sharing fault';
        case 80:  return 'CAN fault';
        case 81:  return 'Host loss';
        case 82:  return 'Synchronization loss';
        case 83:  return 'Battery voltage detected different';
        case 84:  return 'AC input voltage and frequency detected different';
        case 85:  return 'AC output current unbalance';
        case 86:  return 'AC output mode setting is different';
    }
    return  mode;
};
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
    }
    return "unknown: " + mode;
};
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
function getTimeFromSecconds(tSec) {
    if (tSec === 0) {
        return '---';
    }
    var days = parseInt(tSec / (3600 * 24));
    if (days > 0) {
        tSec = tSec - (days * 3600 * 24);
    } else {
        days = '--';
    }
    var hour = parseInt(tSec / (3600));
    if (hour > 0) {
        tSec = tSec - (hour * 3600);
    }
    if (hour < 10) {
        hour = '0' + hour;
    }
    var min = parseInt(tSec / (60));
    if (min < 10) {
        min = '0' + min;
    }
    return days + 'd  ' + hour + 'h:' + min + 'm';
}
var pb5k = {
    graphCallback: null,
    paramInit: true,
    selected: {},
    bmsIDArr: [],
    bmsPlValueArr: [],
    values: {},
    params: {},

    updateComponentParam: function (param) {
        pb5k.setSelectOneMenuFromWidget("outputRatingFrequency", param.outputRatingFrequency);
        pb5k.setSelectOneMenuFromWidget("inputVoltageRange", '0' + param.inputVoltageRange);
        pb5k.setSelectOneMenuFromWidget("outputSourcePriority", '0' + param.outputSourcePriority);
        pb5k.setSelectOneMenuFromWidget("outputMode",  param.outputMode);
        pb5k.setSelectOneMenuFromWidget("batteryType", '0' + param.batteryType);
        pb5k.setSelectOneMenuFromWidget("chargeSourcePriority", '0' + param.chargeSourcePriority);
        pb5k.setSelectOneMenuFromWidget("chargeSourcePriorityInd", '0' + param.chargeSourcePriority);
        pb5k.setSpinnerCompValue("batteryReChargeVoltage", param.batteryReChargeVoltage);
        PF('batteryReChargeVoltageWg').updateValue(param.batteryReChargeVoltage);
        pb5k.setSpinnerCompValue("batteryReDischargeVoltage", param.batteryReDischargeVoltage);
        PF('batteryReDischargeVoltageWg').updateValue(param.batteryReDischargeVoltage);
        pb5k.setSpinnerCompValue("batteryUnderVoltage", param.batteryUnderVoltage);
        PF('batteryUnderVoltageWg').updateValue(param.batteryUnderVoltage);
        pb5k.setSpinnerCompValue("batteryBulkVoltage", param.batteryBulkVoltage);
        PF('batteryBulkVoltageWg').updateValue(param.batteryBulkVoltage);
        pb5k.setSpinnerCompValue("batteryFloatVoltage", param.batteryFloatVoltage);
        PF('batteryFloatVoltageWg').updateValue(param.batteryFloatVoltage);
        
        pb5k.setSelectOneMenuFromWidget("batteryMaxChargingCurrent", param.batteryMaxChargingCurrent);
        pb5k.setSelectOneMenuFromWidget("batteryMaxAcChargingCurrent", param.batteryMaxAcChargingCurrent);
        pb5k.setSelectOneMenuFromWidget("pvConditionOk", param.pvConditionOk);
        pb5k.setSelectOneMenuFromWidget("pvPowerBalance", param.pvPowerBalance);
        pfUtil.setInputSwitch(param.edfAlarmPrimeSourceInterupt, "edfAlarmPrimeSourceInterupt");
        pfUtil.setInputSwitch(param.edfBackLight, "edfBackLight");
        pfUtil.setInputSwitch(param.edfFaultCodeRecord, "edfFaultCodeRecord");
        pfUtil.setInputSwitch(param.edfLcdDisplayEscape, "edfLcdDisplayEscape");
        pfUtil.setInputSwitch(param.edfOverTempRestart, "edfOverTempRestart");
        pfUtil.setInputSwitch(param.edfOverloadBypass, "edfOverloadBypass");
        pfUtil.setInputSwitch(param.edfOverloadRestart, "edfOverloadRestart");
        pfUtil.setInputSwitch(param.edfPowerSaving, "edfPowerSaving");
        pfUtil.setInputSwitch(param.edfSilentBuzzer, "edfSilentBuzzer");
        pb5k.setInputCompValue("cellNumber", param.cellNumber);
//        pb5k.setInputCompValue("rwAdcReadingsPerCell", dd.adcReadingsPerCell); rwSocCapacity

        pb5k.setHtmlCompValue("serialNumber", param.serialNumber);
        pb5k.setHtmlCompValue("fwNumber", param.firmwareVersion);
    },
    updateComponent: function (data) {

        var devParam = {};
        devParam.setWarningInverterFault = data.warnings.charAt(1) === '1';
        pfUtil.setInputSwitch(devParam.setWarningInverterFault, "warningInverterFault");
        devParam.setWarningBusOver = data.warnings.charAt(2) === '1';
        pfUtil.setInputSwitch(devParam.setWarningBusOver, "warningBusOver");
        devParam.setWarningBusUnder = data.warnings.charAt(3) === '1';
        pfUtil.setInputSwitch(devParam.setWarningBusUnder, "warningBusUnder");
        devParam.setWarningBusSoftFail = data.warnings.charAt(4) === '1';
        pfUtil.setInputSwitch(devParam.setWarningBusSoftFail, "warningBusSoftFail");
        devParam.setWarningLineFail = data.warnings.charAt(5) === '1';
        pfUtil.setInputSwitch(devParam.setWarningLineFail, "warningLineFail");
        devParam.setWarningOPVShort = data.warnings.charAt(6) === '1';
        pfUtil.setInputSwitch(devParam.setWarningOPVShort, "warningOPVShort");
        devParam.setWarningInverterVoltageToLow = data.warnings.charAt(7) === '1';
        pfUtil.setInputSwitch(devParam.setWarningInverterVoltageToLow, "warningInverterVoltageToLow");
        devParam.setWarningInverterVoltageToHigh = data.warnings.charAt(8) === '1';
        pfUtil.setInputSwitch(devParam.setWarningInverterVoltageToHigh, "warningBatteryVoltageHigh");
        devParam.setWarningOverTemperature = data.warnings.charAt(9) === '1';
        pfUtil.setInputSwitch(devParam.setWarningOverTemperature, "warningOverTemperature");
        devParam.setWarningFanLocked = data.warnings.charAt(10) === '1';
        pfUtil.setInputSwitch(devParam.setWarningFanLocked, "warningFanLocked");
        devParam.setWarningBatteryVoltageHigh = data.warnings.charAt(11) === '1';
        pfUtil.setInputSwitch(devParam.setWarningBatteryVoltageHigh, "warningInverterVoltageToHigh");
        devParam.setWarningBatteryLowAlarm = data.warnings.charAt(12) === '1';
        pfUtil.setInputSwitch(devParam.setWarningBatteryLowAlarm, "warningBatteryLowAlarm");
        devParam.setWarningBatteryUnderShutdown = data.warnings.charAt(14) === '1';
        pfUtil.setInputSwitch(devParam.setWarningBatteryUnderShutdown, "warningBatteryUnderShutdown");
        devParam.setWarningOverLoad = data.warnings.charAt(16) === '1';
        pfUtil.setInputSwitch(devParam.setWarningOverLoad, "warningOverLoad");
        devParam.setWarningEEPROMFault = data.warnings.charAt(17) === '1';
        pfUtil.setInputSwitch(devParam.setWarningEEPROMFault, "warningEEPROMFault");
        devParam.setWarningInverterOverCurrent = data.warnings.charAt(18) === '1';
        pfUtil.setInputSwitch(devParam.setWarningInverterOverCurrent, "warningInverterOverCurrent");
        devParam.setWarningInverterSoftFail = data.warnings.charAt(19) === '1';
        pfUtil.setInputSwitch(devParam.setWarningInverterSoftFail, "warningInverterSoftFail");
        devParam.setWarningSelfTestFail = data.warnings.charAt(20) === '1';
        pfUtil.setInputSwitch(devParam.setWarningSelfTestFail, "warningSelfTestFail");
        devParam.setWarningOpDcVoltageOver = data.warnings.charAt(21) === '1';
        pfUtil.setInputSwitch(devParam.setWarningOpDcVoltageOver, "warningOpDcVoltageOver");
        devParam.setWarningBatOpen = data.warnings.charAt(22) === '1';
        pfUtil.setInputSwitch(devParam.setWarningBatOpen, "warningBatOpen");
        devParam.setWarningCurrentSensorFail = data.warnings.charAt(23) === '1';
        pfUtil.setInputSwitch(devParam.setWarningCurrentSensorFail, "warningCurrentSensorFail");
        devParam.setWarningBatteryShort = data.warnings.charAt(24) === '1';
        pfUtil.setInputSwitch(devParam.setWarningBatteryShort, "warningBatteryShort");
        devParam.setWarningPowerLimit = data.warnings.charAt(25) === '1';
        pfUtil.setInputSwitch(devParam.setWarningPowerLimit, "warningPowerLimit");
        devParam.setWarningPvVoltageHigh = data.warnings.charAt(26) === '1';
        pfUtil.setInputSwitch(devParam.setWarningPvVoltageHigh, "warningPvVoltageHigh");
        devParam.setWarningMPPTOverLoadFault = data.warnings.charAt(27) === '1';
        pfUtil.setInputSwitch(devParam.setWarningMPPTOverLoadFault, "warningMPPTOverLoadFault");
        devParam.setWarningMpptOverLoadWarning = data.warnings.charAt(28) === '1';
        pfUtil.setInputSwitch(devParam.setWarningMpptOverLoadWarning, "warningMpptOverLoadWarning");
        devParam.setWarningBatteryToLowToCharge = data.warnings.charAt(29) === '1';
        pfUtil.setInputSwitch(devParam.setWarningBatteryToLowToCharge, "warningBatteryToLowToCharge");
        var warningCount = 0;
        for (var item in devParam) {
            if (devParam[item] === true) {
                warningCount++;
            }
        }
        pb5k.setHtmlCompValue("warnings", warningCount);
//
        pb5k.setHtmlCompValue("faultCode", getFaultMessage(data.faultCode));
        pb5k.setHtmlCompValue("deviceMode", getOperationMode(data.deviceMode));
        pb5k.setHtmlCompValue("mpptChargingPower", data.mpptChargingPower + "W");
        pb5k.setHtmlCompValue("statSccCharging", data.statSccCharging);
        pb5k.setHtmlCompValue("mpptInputVoltage", data.mpptInputVoltage + "V");
        pb5k.setHtmlCompValue("mpptInputCurrent", data.mpptInputCurrent + "A");
        pb5k.setHtmlCompValue("mpptTotalEnergy", (data.mpptTotalEnergy).toFixed(2) + "Wh");
        pb5k.setHtmlCompValue("batteryVoltage", data.batteryVoltage + "V");
        pb5k.setHtmlCompValue("batteryChargingCurrent", data.batteryChargingCurrent + "A");
        pb5k.setHtmlCompValue("batteryDischargeCurrent", data.batteryDischargeCurrent + "A");
        pb5k.setHtmlCompValue("extSourcePower", data.extSrcPower + "W");
        pb5k.setHtmlCompValue("gridVoltage", data.gridVoltage + "V");
        pb5k.setHtmlCompValue("gridFrequency", data.gridFrequency + "Hz");
        pb5k.setHtmlCompValue("extSrcTotalEnergy", (data.extSrcTotalEnergy).toFixed(2) + "Wh");
        pb5k.setHtmlCompValue("statAcCharging", data.statAcCharging);
        pb5k.setHtmlCompValue("statLineLoss", data.statLineLoss);
        pb5k.setHtmlCompValue("outputPower", data.outputPower + "W");
        pb5k.setHtmlCompValue("outputVoltage", data.outputVoltage + "V");
        pb5k.setHtmlCompValue("acOutputFrequency", data.acOutputFrequency + "Hz");
        pb5k.setHtmlCompValue("acOutputActivePower", data.acOutputActivePower + "W");
        pb5k.setHtmlCompValue("acOutputAparentPower", data.acOutputAparentPower + "VA");
        pb5k.setHtmlCompValue("outputTotalEnergy", (data.outputTotalEnergy).toFixed(2) + "Wh");


        if (data.deviceMode === 'L') {
            axp.setBypassPower(data.acOutputAparentPower + 50);
            axp.setGridCharhingPower((data.batteryChargingCurrent - data.mpptInputCurrent) * 51.2);
            axp.setBatDischPower(0);
        } else if (data.deviceMode === 'B') {
            axp.setBatDischPower(data.acOutputAparentPower + 50);
            axp.setBypassPower(0);
            axp.setGridCharhingPower(0);
        } else if (data.deviceMode === 'S') {
            axp.setBypassPower(0);
            axp.setBatDischPower(0);
            axp.setGridCharhingPower((data.batteryChargingCurrent - data.mpptInputCurrent) * 51.2);
        }
        axp.showGrid(!data.statLineLoss);

        if (data.statSccOk) {
            axp.setPvPower(data.mpptChargingPower);

            var batPower = data.batteryChargingCurrent * data.batteryVoltage;
            if (data.deviceMode === 'B' && data.mpptChargingPower > batPower + 60) {
                axp.setPvChargingPower(batPower);
                var pvLoad = data.mpptChargingPower - batPower;
                if (pvLoad < 1) {
                    pvLoad = 1;
                }
                axp.setPvLoadPower(pvLoad);
            } else {
                axp.setPvChargingPower(data.mpptChargingPower);
                axp.setPvLoadPower(0);
            }
        } else {
            axp.setPvChargingPower(0);
            axp.setPvLoadPower(0);
            axp.setPvPower(0);
        }

//        pb5k.setHtmlCompValue("chargCtrlChLevel", data.chargCtrlChLevel);

    },
    setHtmlCompValue: function (idSelector, value) {
        var a = $('[id*=' + idSelector + ']')[0];
        if (a !== undefined && value !== undefined) {
            a.innerHTML = value;
        }
    },
    setInputCompValue: function (idSelector, value) {
        var a = $('[id*=' + idSelector + ']')[0];
        if (a !== undefined && value !== undefined) {
            if (pb5k.paramRefreshRequest) {
                if (Number(a.value) !== value) {
                    $('[id*=' + idSelector + ']').css("color", "red");
                } else {
                    $('[id*=' + idSelector + ']').css("color", "black");
                }
            }
            a.value = value;
        }
    },
    setSpinnerCompValue: function (idSelector, value) {
        var a = $('[id*=' + idSelector + '_input]')[0];
        if (a !== undefined && value !== undefined) {
            if (pb5k.paramRefreshRequest) {
                if (Number(a.value) !== value) {
                    $('[id*=' + idSelector + '_input]').css("color", "red");
                } else {
                    $('[id*=' + idSelector + '_input]').css("color", "Black");
                }
            }
            a.value = value;
        }
    },
    setSelectOneMenuFromWidget: function (widgetVar, value) {
        var widget = PF(widgetVar);
        if (widget !== undefined) {
            PF(widgetVar).selectValue(value);
        } else {
            console.log('can not find widget: ' + widgetVar);
        }
    },
    dispatchMessage: function (messageData) {
//        created:Wed Jul 12 2017 18:58:28 GMT+0200 (South Africa Standard Time)
//        data:Object
//        dataType:"value"
//        deviceID:256
        for (var i = 0; i < messageData.length; i++) {
            var message = messageData[i];
            if (message.dataType === 'value') {
                if (pb5k.values[message.deviceID] === undefined) {
                    pb5k.values[message.deviceID] = [];
                }
                pb5k.values[message.deviceID].push(message);
            } else if (message.dataType === 'param') {
                var paramArr = pb5k.params[message.deviceID];
                if (paramArr === undefined) {
                    paramArr = [];
                }
                paramArr.push(message);
            }

        }

    },
    dispatchSelectedMessage: function (message) {
        try {
            if (!document.hidden) {
                if (message.dataType === 'value') {
                    pb5k.formatBmsPlData(message.data);
                    pb5k.selected.data = message.data;
                    pb5k.updateComponent(message.data);
                    if (typeof pb5k.graphCallback === 'function') {
                        pb5k.graphCallback(message);
                    }
                } else if (message.dataType === 'param') {
                    if (pb5k.paramInit) {
                        pb5k.formatBmsPlParam(message.data);
                        pb5k.selected.param = message.data;
                        pb5k.updateComponentParam(message.data);
                        pb5k.paramRefreshRequest = false;
                        pb5k.paramInit = false;
                    }
                }
            } else {
//            console.log('not in focus');
            }
        } catch (e) {
            console.log(e);
        }
    }
    ,
    paramUpdateRequest: function () {
        pb5k.paramRefreshRequest = true;
        pb5k.paramInit = true;
        sendBroadcastRequest();
        console.log('sendBroadcastRequest() exetion');
    },
    sendIntervalSkipInstr: function () {
        var inteval = PF('broadcastSkipInterval').getValue();
        sendInstrTimeOutInterval([{name: 'param', value: inteval}]);
    }

};
function bmsPlOnMessage(data) {
    pb5k.dispatchMessage(data);
    console.log("new data: " + data);
};
function onSubDevicePbChange(data) {
    axp.resetAnimation();
    pb5k.selected = {};
    logCon.selectionChange(data);
    pb5k.paramInit = true;
    sendBroadcastRequest();
    console.log('subdevice change: ' + data);
}

function bmsPlInit(data, selected, bcInterval, timeOut) {
    pb5k.bmsIDArr = data;
//    pb5k.selectedBmsID = selected;

    logCon.init(data, selected, bcInterval, timeOut);
    logCon.obroadcastRequestFn();
}


logCon.selectedCallbackFn = function (data) {
    pb5k.dispatchSelectedMessage(data);
};
logCon.callbackFn = function (data) {
    pb5k.dispatchMessage(data);
};
logCon.dataExtractFn = function (data) {
    var dataArr = [];
    for (var d = 0; d < data.messageList.length; d++) {
        var obj = data.messageList[d];
        var inst;
        switch (data.deviceSubCommand) {
            case 'refreshDevicePowerBrain5kValue':
                {
                    inst = 'value';
                }
                break;
            case "refreshDevicePowerBrain5kParam":
                {
                    inst = 'param';
                }
                break;
            case 'refreshParamAdv':
                {
                    inst = 'paramAdv';
                }
                break;
            case 'refreshDeviceBmsPlValue':
                {
                    inst = 'value';
                }
                break;
            case 'refreshIo':
                {
                    inst = 'io';
                }
                break;
        }

        dataArr.push({
            data: obj,
            created: new Date(),
            dataType: inst,
            deviceID: obj.deviceID
        });
    }
    return  dataArr;
};
logCon.onDevConnConnectFn = function () {
    if (PF('bui') !== undefined) {
        PF('bui').hide();
    }
//    $('#mainPanelDiv').show(1000);
};
logCon.onDevConnDropFn = function () {
    if (PF('bui') !== undefined) {
        PF('bui').show();
        axp.resetAnimation();
    }
//    $('#mainPanelDiv').hide(1000);
};
logCon.onStatusChangeCallbackFn = function (id, data) {
    var g = PF('growlWG');
    var message = {};
    message.summary = "Axpert: " + id;
    if (data) {
        message.detail = "Marked as connected";
        message.severity = "info";
    } else {
        message.detail = "Marked as disconnected";
        message.severity = "warn";
    }
    g.renderMessage(message);
    $('.SubDevPb' + id).text(data ? "Online" : "Offline");
};
logCon.obroadcastRequestFn = function () {
    sendBroadcastRequest();
    console.log('sendBroadcastRequest() exetion');
};