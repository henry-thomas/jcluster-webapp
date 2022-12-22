





/* global logCon, PF, mainUtils, axp */


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


var axpertEDict = {
    getChargeSourcePriority: function (id) {
        switch (id) {
            case 0:
                return 'Utility First';
            case 1:
                return 'Solar First';
            case 2:
                return 'Solar and Utility';
            case 3:
                return 'Only Solar';
            case 4:
                var res = 'Inv unique: <br/><ul>';
                for (var i = 0; i < aeUnit.unitArr.length; i++) {
                    if (aeUnit.unitArr[i].param.chargePriority === 4)
                        aeUnit.unitArr[i].param.chargePriority = 255;
                    res += '<li>' + aeUnit.unitArr[i].ctrlIdx + ' - ' + axpertEDict.getChargeSourcePriority(aeUnit.unitArr[i].param.chargePriority) + '<li/>';
                }

                res += '<ul/>';
                return res;
            case 5:
                return 'Do not change';
        }
        return  "unknown zone";
    },
    getOutputSourcePriority: function (id) {
        switch (id) {
            case 0:
                return 'Utility First';
            case 1:
                return 'Solar First';
            case 2:
                return 'SBU first';
            case 5:
                return 'Do not change';
        }
        return  "unknown zone" + id;
    },
    getMaxCurrent: function (id) {
        switch (id) {
            case 0:
                var res = 'Inv unique: <br/><ul>';
                for (var i = 0; i < aeUnit.unitArr.length; i++) {
                    if (aeUnit.unitArr[i].param.maxChargingCurrent === 0)
                        aeUnit.unitArr[i].param.maxChargingCurrent = 255;
                    res += '<li>' + aeUnit.unitArr[i].ctrlIdx + ' - ' + axpertEDict.getMaxCurrent(aeUnit.unitArr[i].param.maxChargingCurrent) + 'A';
                }

                res += '<ul/>';
                return res;
            case 1:
                return 'Auto';
            case 5:
                return 'Last known';
            case (id <= 120):
                return id + 'A';
        }
        return id + 'A';
    },

    getMaxAcCurrent: function (id, selector) {
        switch (id) {
            case 0:
                var res = 'Inv unique: <br/><ul>';
                for (var i = 0; i < aeUnit.unitArr.length; i++) {
                    if (aeUnit.unitArr[i].param.maxACChargingCurrent === 0)
                        aeUnit.unitArr[i].param.maxACChargingCurrent = 255;
                    res += '<li>' + aeUnit.unitArr[i].ctrlIdx + ' - ' + axpertEDict.getMaxAcCurrent(aeUnit.unitArr[i].param.maxACChargingCurrent) + 'A';
                }

                res += '<ul/>';
                return res;
            case 1:
                return 'Do not Change';
            case (id <= 60):
                return id + 'A';
        }
        return id + 'A';
    },

    getStorageDisplayName: function (idx) {
        switch (idx) {
            case 0:
                return 'Battery';
            case 1:
                return 'Grid';
            case 2:
                return 'Load';
            case 3:
                return 'Pv';
        }
        return  "unknown zone";
    },
    getStorageName: function (idx) {
        switch (idx) {
            case 0:
                return 'batDischEnergyCounters';
            case 1:
                return 'gridEnergyCounters';
            case 2:
                return 'loadEnergyCounters';
            case 3:
                return 'pvEnergyCounters';
        }
        return  "unknown zone";
    },
    getZoneName: function (zoneCode) {
        switch (zoneCode) {
            case 0:
                return 'Unknown zone';
            case 1:
                return 'High zone';
            case 2:
                return 'Middle Discharge zone';
            case 3:
                return 'Low Discharge zone';
            case 4:
                return 'Middle Charge zone';
            case 5:
                return 'Low Charge zone';
        }
        return  "Unknown zone";
    },
    getOperationMode: function (mode) {
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
    },
    getRelayStatus: function (mode) {
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
    },
    getTimeFromSecconds: function (tSec) {
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
};
var aeUnit = {
    selected: {},
    unitArr: [],
    dispatchMessageSelected: function (data) {
        //console.log(data);
        //PF('buiUnit').hide();
        $('.aeUnitTabViewClass').show(1000);
        $('.aeUnitLabelPlsSelect').hide(100);
        $('.aeUnitLabelLoading').hide(500);
        aeUnit.selected.data = data.data;
        aeUnit.selected.param = data.param;
        aeUnit.updataData(data.data);
        aeUnit.updataParam(data);
    },

    updataParam: function (d) {
        mainUtils.setHtmlCompValue('fwNumber', Number(d.fwNumber));
        mainUtils.setSelectOneMenu(d.param.stendByModeEnable ? 1 : 0, 'standByMode');
        mainUtils.setSelectOneMenu(d.param.stendByModeIO, 'standByIO');

        mainUtils.setSelectOneMenu(d.param.chargePriority, 'chargePriority');
        mainUtils.setSelectOneMenu(d.param.maxChargingCurrent, 'maxChargingCurrent');
        mainUtils.setSelectOneMenu(d.param.maxChargingCurrent, 'maxACChargingCurrent');
    },
    updataData: function (data) {

        mainUtils.setHtmlCompValue('deviceMode', String.fromCharCode(data.workMode));
        mainUtils.setHtmlCompValue('standbyActiva', (data.stendByModeActive));


        mainUtils.setHtmlCompValue('mpptChargingPower', data.statusSCCOk ? data.pvChargingPower + 'W' : '-- W');
        mainUtils.setHtmlCompValue('mpptInputVoltage', data.statusSCCOk ? data.pvInputVoltage + 'V' : '-- V');
        mainUtils.setHtmlCompValue('mpptInputCurrent', data.statusSCCOk ? data.pvInputCurrent + 'A' : '-- A');
        mainUtils.setHtmlCompValue('statSccCharging', data.statusSCCOk ? 'Solar generation' : 'Standby');

        mainUtils.setHtmlCompValue('batteryVoltage', data.batVoltage + ' V');
        mainUtils.setHtmlCompValue('batteryChargingDischCurrent', data.batChargDischaCurrent + ' A');
        mainUtils.setHtmlCompValue('batteryPower', data.batChargDischaPower + ' W');

        mainUtils.setHtmlCompValue('extSourcePower', data.statusLineLoss ? '-- W' : data.gridPower);
        mainUtils.setHtmlCompValue('gridVoltage', data.statusLineLoss ? '-- V' : data.gridVoltage);
        mainUtils.setHtmlCompValue('gridFrequency', data.statusLineLoss ? '-- Hz' : data.gridFrequency);
        mainUtils.setHtmlCompValue('statAcCharging', data.statusLineLoss ? '--' : data.statusAcCharging ? 'Charging' : '--');
        mainUtils.setHtmlCompValue('statLineLoss', data.statusLineLoss ? 'Line loss' : 'Line OK');

        mainUtils.setHtmlCompValue('outputVoltage', data.outputVoltage + ' V');
        mainUtils.setHtmlCompValue('acOutputFrequency', data.outputFrequency + ' Hz');
        mainUtils.setHtmlCompValue('acOutputActivePower', data.outputActivePower + ' W');
        mainUtils.setHtmlCompValue('acOutputAparentPower', data.outputApparentPower + ' VA');
    },

    calcAverageVoltage: function () {
        var avrgVoltage = 0;
        var count = 0;
        for (var item in aeUnit.unitArr) {
            if (aeUnit.unitArr[item].status) {
                count++;
                avrgVoltage += aeUnit.unitArr[item].data.batVoltage;
            }
        }
        if (count > 0 && avrgVoltage > 0) {
            mainUtils.setHtmlCompValue('totalBatVoltage', (avrgVoltage / count).toFixed(2) + ' V');
        } else {
            mainUtils.setHtmlCompValue('totalBatVoltage', '--.-- V');
        }
    },
    dispatchMessage: function (message) {
        if (message.data.deviceID !== undefined) {
            var found = false;

            for (var item in aeUnit.unitArr) {
                if (aeUnit.unitArr[item].deviceID !== undefined && aeUnit.unitArr[item].deviceID === message.data.deviceID) {
                    found = true;
                    Object.assign(aeUnit.unitArr[item], message.data);
                    aeUnit.unitArr[item].available = aeUnit.unitArr[item].param.available;
                    aeUnit.unitArr[item].status = aeUnit.unitArr[item].data.active;
                }
            }
            aeUnit.calcAverageVoltage();
            if (!found) {
                var idx = aeUnit.unitArr.push(message.data);
                aeUnit.unitArr[idx - 1].status = aeUnit.unitArr[idx - 1].data.active;
                $('#tblAxpUnit').puidatatable('reload');
            }
            if (aeUnit.selected !== undefined && aeUnit.selected.deviceID === message.data.deviceID) {
                aeUnit.dispatchMessageSelected(message.data);
            }
        }
    }
};
var axpertEZone = {
    selectedZone: {},

    onZoneSelectionChange: function (a) {
        var selected = mainUtils.getSelectOneMenu('aeSettingZoneSelect');
        axpertEZone.selectedZone.name = selected;
        $('.chDischZoneDiv').hide(200);
        $('.chDiscErrorZoneDiv').hide(200);
        try {
            axpertEZone.updateZone(axpertE.selected.param[selected]);
        } catch (e) {
            mainUtils.setHtmlCompValue('chDiscErrorZone', e.toString());
            $('.chDiscErrorZoneDiv').show(1000);
        }
        console.log(selected);
    },
    updateZone: function (zone) {
        mainUtils.setSpinnerValue('chaZoneFloatVoltageWg', zone.voltageFloat / 10);
        mainUtils.setSpinnerValue('chaZoneBulkVoltageWg', zone.voltageBulk / 10);
        mainUtils.setSpinnerValue('dischZoneCutOffVoltageWg', zone.voltageCutOff / 10);
        mainUtils.setSpinnerValue('dischZoneReChargeVoltageWg', zone.voltageReCharge / 10);
        mainUtils.setSpinnerValue('dischZoneReDischargeVoltageWg', zone.voltageReDischarge / 10);
        mainUtils.setSelectOneMenu(zone.maxCurrent, 'chaZoneMaxChargeCurrentWg');
        mainUtils.setSelectOneMenu(zone.maxAcCurrent, 'chaZoneMaxACChargeCurrentWg');
        mainUtils.setSelectOneMenu(zone.chargePriority, 'chaZoneChargePriorityWg');
        mainUtils.setSelectOneMenu(zone.outputSourcePriority, 'chaZoneOutputSourcePriorityWg');
        mainUtils.setSelectOneMenu(zone.pvPowerBalance, 'chaZonePvPowerBalanceWg');
        $('.chDischZoneDiv').show(1000);
    }
};

var axpertE = {
    graphCallback: null,
    paramInit: true,
    selected: {},
    bmsArr: [],
    aeBmsArr: [],
    aeEnergyArr: [],
    bmsPlValueArr: [],

    values: {},
    params: {},
    sendWriteInstruction: function (instruction, val, subInstr, functionFormatter) {
        subInstr = subInstr || "";
        console.log('sending instruction: ' + instruction + ' value: ' + val);
        var obj = {
            devID: instruction,
            instr: instruction,
            instrExt: subInstr,
            instrValue: val
        };


        if (window[functionFormatter] !== undefined) {
            obj = window[functionFormatter](obj);
        }
        executeUpdate([
            {
                name: "paramObj",
                value: JSON.stringify({
                    instrMethod: 'writeRaw',
                    instr: obj.instr.toString(),
                    instrExt: obj.instrExt.toString(),
                    instrValue: obj.instrValue.toString()
                })
            }
        ]);
    },
    sendInstruction: function (instruction, subInstr, val, functionFormatter) {
        subInstr = subInstr || "";
        val = val || "";

        console.log('sending instruction: ' + instruction + ' value: ' + val);
        var obj = {
            instr: instruction,
            instrExt: subInstr,
            instrValue: val
        };


        if (window[functionFormatter] !== undefined) {
            obj = window[functionFormatter](obj);
        }
        executeUpdate([
            {
                name: "paramObj",
                value: JSON.stringify({
                    instrMethod: 'instr',
                    instr: obj.instr.toString(),
                    instrExt: obj.instrExt.toString(),
                    instrValue: obj.instrValue.toString()
                })
            }
        ]);
    },

    formatBmsPlData: function (data) {
        var d = new Date(data.createdDate);
//        data.createdDate =
//                data.packVoltage /= 1000;
//        data.current /= 1000;
//        data.avrgCurrent /= 1000;
//        data.capacity /= 1000;
//        data.tempGlobal /= 10;
    },
    formatBmsPlParam: function (param) {
//        param.soxMaxCapacity /= 1000;
    },

    updateZoneActualSettings: function (zone) {
        axpertE.setHtmlCompValue("actSettChZone_maxCurrent", axpertEDict.getMaxCurrent(zone.maxCurrent));
        axpertE.setHtmlCompValue("actSettChZone_maxAcCurrent", axpertEDict.getMaxAcCurrent(zone.maxAcCurrent));
        axpertE.setHtmlCompValue("actSettChZone_floatVoltage", (zone.voltageFloat / 10).toFixed(1) + 'V');
        axpertE.setHtmlCompValue("actSettChZone_bulkVoltage", (zone.voltageBulk / 10).toFixed(1) + 'V');
        axpertE.setHtmlCompValue("actSettDischZone_cutOffVoltage", (zone.voltageCutOff / 10).toFixed(1) + 'V');
        axpertE.setHtmlCompValue("actSettDischZone_reChargeVoltage", (zone.voltageReCharge / 10).toFixed(1) + 'V');
        axpertE.setHtmlCompValue("actSettDischZone_reDischargeVoltage", (zone.voltageReDischarge / 10).toFixed(1) + 'V');

        axpertE.setHtmlCompValue("actSettChZone_chargePriority", axpertEDict.getChargeSourcePriority(zone.chargePriority));
        axpertE.setHtmlCompValue("actSettChZone_outputSourcePriority", axpertEDict.getOutputSourcePriority(zone.outputSourcePriority));
        axpertE.setHtmlCompValue("actSettChZone_pvPowerBalance", zone.pvPowerBalance === 1 ? 'Max charging + load' : 'Max charging only');

    },

    updateComponentParam: function (param) {
        switch (axpertE.selected.data.zone) {
            case 0:
                axpertE.updateZoneActualSettings(param.zoneUndef);
                break;
            case 1:
                axpertE.updateZoneActualSettings(param.zoneHigh);
                break;
            case 2:
                axpertE.updateZoneActualSettings(param.zoneMediumDisch);
                break;
            case 3:
                axpertE.updateZoneActualSettings(param.zoneLowDisch);
                break;
            case 4:
                axpertE.updateZoneActualSettings(param.zoneMediumCh);
                break;
            case 5:
                axpertE.updateZoneActualSettings(param.zoneLowCh);
                break;
        }
    },
    updateComponent: function (data) {

        var devParam = {};
//        
//        pfUtil.setInputSwitch(devParam.setWarningInverterFault, "warningInverterFault");

        for (var i = 0; i < 4; i++) {
            if (axpertE.aeEnergyArr[i] === undefined) {
                axpertE.aeEnergyArr[i] = {};
                axpertE.aeEnergyArr[i].name = axpertEDict.getStorageDisplayName(i);
            }

            var obj = data.axpertCommonData[axpertEDict.getStorageName(i)];
            for (var item in obj) {
                axpertE.aeEnergyArr[i][item] = (obj[item] / 1000).toFixed(2) + ' kW/h';
            }
        }
        $('#tblAxpEnergy').puidatatable('reload');

        for (var i = 0; i < data.bmsArr.length; i++) {
            if (axpertE.aeBmsArr[i] === undefined) {
                axpertE.aeBmsArr[i] = {};

            }

            for (var item in data.bmsArr[i]) {
                axpertE.aeBmsArr[i][item] = data.bmsArr[i][item];
            }
        }
        $('#tbllocal').puidatatable('reload');

        axpertE.setHtmlCompValue("totalBatChargingCurrent", data.axpertCommonData.totalBatChargingCurrent);
        axpertE.setHtmlCompValue("totalBatDischPower", data.axpertCommonData.totalBatDischPower);
        axpertE.setHtmlCompValue("totalGridPower", data.axpertCommonData.totalGridPower);
        axpertE.setHtmlCompValue("totalOutputActivePower", data.axpertCommonData.totalOutputActivePower);
        axpertE.setHtmlCompValue("totalOutputApparentPower", data.axpertCommonData.totalOutputApparentPower);
        axpertE.setHtmlCompValue("totalOutputPerecent", data.axpertCommonData.totalOutputPerecent);
        axpertE.setHtmlCompValue("totalPvPower", data.axpertCommonData.totalPvPower);

        axpertE.setHtmlCompValue("cdChargeCtrl", data.cdChargeCtrl);
        axpertE.setHtmlCompValue("cdDischargeCtrl", data.cdDischargeCtrl);
        axpertE.setHtmlCompValue("actualZone", axpertEDict.getZoneName(data.zone));


        axpertE.setHtmlCompValue("statSettZoneActual", axpertEDict.getZoneName(data.zone) + ' - CH CTRL:' + data.cdChargeCtrl + ' - DISCH CTRL:' + data.cdDischargeCtrl);
//        pb5k.setHtmlCompValue("deviceMode", getOperationMode(data.deviceMode));
//        pb5k.setHtmlCompValue("mpptChargingPower", data.mpptChargingPower + "W");

        for (var item in data.axpertCommonData) {
            if (item.search('warning') !== -1) {
                pfUtil.setInputSwitch(data.axpertCommonData[item], item);
            }
        }


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
            if (axpertE.paramRefreshRequest) {
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
            if (axpertE.paramRefreshRequest) {
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
            if (message.dataType === 'AEData') {
                if (axpertE.values[message.deviceID] === undefined) {
                    axpertE.values[message.deviceID] = [];
                }
                axpertE.values[message.deviceID].push(message);
            } else if (message.dataType === 'AEParam') {
                if (axpertE.params[message.deviceID] === undefined) {
                    axpertE.params[message.deviceID] = [];
                }
                axpertE.params[message.deviceID].push(message);
            } else if (message.dataType === 'param') {
                var paramArr = axpertE.params[message.deviceID];
                if (paramArr === undefined) {
                    paramArr = [];
                }
                paramArr.push(message);
            } else if (message.dataType === 'AEUnit') {
                aeUnit.dispatchMessage(message);
            } else {
                console.log('No dispatcher found for instruction: ' + message.dataType);
            }

        }

    },
    dispatchSelectedMessage: function (message) {
        try {
            if (!document.hidden) {
                if (message.dataType === 'AEData') {
                    axpertE.formatBmsPlData(message.data);
                    axpertE.selected.data = message.data;
                    axpertE.updateComponent(message.data);
                    if (typeof axpertE.graphCallback === 'function') {
                        axpertE.graphCallback(message);
                    }
                } else if (message.dataType === 'AEParam') {
                    axpertE.formatBmsPlData(message.data);
                    axpertE.selected.param = message.data;
                    axpertE.updateComponentParam(message.data);
                } else if (message.dataType === 'param') {
                    if (axpertE.paramInit) {
                        axpertE.formatBmsPlParam(message.data);
                        axpertE.selected.param = message.data;
                        axpertE.updateComponentParam(message.data);
                        axpertE.paramRefreshRequest = false;
                        axpertE.paramInit = false;
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
        axpertE.paramRefreshRequest = true;
        axpertE.paramInit = true;
        sendBroadcastRequest();
        console.log('sendBroadcastRequest() exetion');
    },
    sendIntervalSkipInstr: function () {
        var inteval = PF('broadcastSkipInterval').getValue();
        sendInstrTimeOutInterval([{name: 'param', value: inteval}]);
    }

};
function bmsPlOnMessage(data) {
    axpertE.dispatchMessage(data);
    console.log("new data: " + data);
}
;
function onSubDevicePbChange(data) {
    axp.resetAnimation();
    axpertE.selected = {};
    logCon.selectionChange(data);
    axpertE.paramInit = true;
    sendBroadcastRequest();
    console.log('subdevice change: ' + data);
}

function bmsPlInit(data, selected, bcInterval, timeOut) {
    axpertE.bmsArr = data;
//    pb5k.selectedBmsID = selected;

    logCon.init(data, selected, bcInterval, timeOut);
    logCon.obroadcastRequestFn();
}


logCon.selectedCallbackFn = function (data) {
    axpertE.dispatchSelectedMessage(data);
};
logCon.callbackFn = function (data) {
    axpertE.dispatchMessage(data);
};
logCon.dataExtractFn = function (data) {
    var dataArr = [];
    for (var d = 0; d < data.messageList.length; d++) {
        var obj = data.messageList[d];
        var inst = data.deviceData;
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



$(function () {

    $('#tbllocal').puidatatable({
        caption: 'Storage control',
        columns: [
            {field: 'bmsID', headerText: 'Storage ID:'},
            {field: 'chargeCtrl', headerText: 'Charge control:'},
            {field: 'dischargeCtrl', headerText: 'Discharge control:'},
            {field: 'statusOnline', headerText: 'Available:'},
            {field: 'maxChDischCurrent', headerText: 'Rated current:'}
        ],
        datasource: axpertE.aeBmsArr
    });

    $('#tblAxpEnergy').puidatatable({
        caption: 'Total energy',
        columns: [
            {field: 'name', headerText: 'Energy name:'},
            {field: 'dailyEnergy', headerText: 'Daily'},
            {field: 'weeklyEnergy', headerText: 'Weekly'},
            {field: 'monthlyEnergy', headerText: 'Monthly'},
            {field: 'yearlyEnergy', headerText: 'Yearly'},
            {field: 'energy', headerText: 'Total'}
        ],
        datasource: axpertE.aeEnergyArr
    });
    $('#tblAxpUnit').puidatatable({
        caption: 'Axpert units',
        columns: [
            {field: 'deviceID', headerText: 'Device ID:'},
            {field: 'serNumber', headerText: 'Serial Num'},
            {field: 'status', headerText: 'Online'}
        ],
        resizableColumns: true,
        selectionMode: 'single',
        rowSelect: function (event, data) {
            for (var item in aeUnit.unitArr) {
                if (aeUnit.unitArr[item].deviceID !== undefined && aeUnit.unitArr[item].deviceID === data.deviceID) {
                    aeUnit.selected = aeUnit.unitArr[item];
                    mainUtils.showMessage('info', 'Selected Axpert unit', aeUnit.unitArr[item].deviceID);
                    $('.aeUnitTabViewClass').hide(1000);
                    $('.aeUnitLabelPlsSelect').hide(100);
                    $('.aeUnitLabelLoading').show(500);
                }
            }
            // PF('buiUnit').show();
        },
        rowUnselect: function (event, data) {
            mainUtils.showMessage('info', 'Row Unselected', data.deviceID + ' ' + data.serNumber);
        },
        datasource: aeUnit.unitArr
    });


});

var formatVoltage = function (obj) {
    if (obj.instrValue !== undefined) {
        obj.instrValue = Number(obj.instrValue) * 10;
        obj.instrValue.toFixed(0);
        return obj;
    }
    throw Error('can not format Voltage value');
};

var formatAxpertSetting = function (obj) {
    if (obj.instrExt) {
        obj.instrExt = "E";
    } else {
        obj.instrExt = "D";
    }
    return obj;
};


var zoneChargeVoltageValidatot = function (a) {
    if (a !== undefined) {
        var zone = mainUtils.getSelectOneMenu('aeSettingZoneSelect');

        if (zone !== undefined) {
            a += '_' + zone;
            return a;
        }
    }
    throw Error('can not format Voltage value');
};
