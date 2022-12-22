/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, fetch, hh */


var sg = {
    lastUnitLoaded: null,
    dataField: {
        mpptData: {}
    }
};

sg.createSettingsEms = function (dev, data, param) {
    let cont = document.getElementById('sgEmsSettingsDiv');

    new ParamSetting(cont, 'emsParam.emsMaxPowerPer', {type: 'inputNumber', title: 'Maximum EMS Power:', unit: '%', ctrlInfo: 'Maximum power restriction for EMS, value in % of rated Power.'});
    new ParamSetting(cont, 'emsParam.emsMinPowerPer', {type: 'inputNumber', title: 'Minimum EMS Power:', unit: '%', ctrlInfo: 'Minimum power restriction for EMS, value in % of rated Power.'});
    new ParamSetting(cont, 'emsParam.emsChnageRatioPer', {type: 'inputNumber', title: 'Change Ratio:', unit: '%', ctrlInfo: 'This parameter is used to limit the overshooting and oscilating of the inverter power.'});


    new ParamSetting(cont, 'emsParam.emsNotActiveState', {type: 'inputNumber', title: 'EMS Not Active State:', ctrlInfo: ''});
    new ParamSetting(cont, 'emsParam.emsNotActivePower', {type: 'inputNumber', title: 'EMS Not Active Power:', unit: '%', ctrlInfo: ''});

    new ParamSetting(cont, 'emsParam.emsAllowOnOff', {type: 'switch', title: 'Allow Ems Inverter State Control:', ctrlInfo: 'This parameter, when enabled, allows EMS to turn the inverter on and off.'});
//    new ParamSetting(cont, 'emsParam.emsAllowOnGridModeChange', {type: 'switch', title: 'Allow EMS On-grid charge/discharge mode change:', ctrlInfo: 'This parameter when enabled, allows EMS to change On-grid charge/discharge mode.'});
//    new ParamSetting(cont, 'emsParam.emsAllowOpModeChange', {type: 'switch', title: 'Allow Ems On/Off-grid mode setting change:', ctrlInfo: 'This parameter when enabled, allows EMS to change On/Off-grid mode setting.'});

};
sg.createAndPopulateDCPanel = function (dev, data, param) {
//    uisg-dcInputInfo
    let panel = document.querySelector('.uisg-dcInputInfo');
    if (panel) {
        hh.removeAllChilds(panel);
        for (var i = 0; i < data.mpptData.length; i++) {
            let mpptOb = data.mpptData[i];
            let cont = hh.createActDataPanelCard('MPPT ' + (i + 1));
            panel.appendChild(cont);

            if (sg.dataField[i] === undefined) {
                sg.dataField[i] = {};
            }
            sg.dataField[i].voltage = hh.adf(cont, 'Voltage', 'V', {tooltip: 'Voltage at MPPT' + (i + 1) + ' Input', decimal: 1});
            sg.dataField[i].current = hh.adf(cont, 'Current', 'A', {tooltip: 'Total Current at MPPT' + (i + 1) + ' Input', decimal: 1});
            sg.dataField[i].power = hh.adf(cont, 'Power', 'W', {sIPrefix: 'k', decimal: 2, tooltip: 'Total Current at MPPT' + (i + 1) + ' Input'});

            if (sg.dataField[i].stringCurrentArr === undefined) {
                sg.dataField[i].stringCurrentArr = {};
            }
            let inputArr = data.mpptData[i].stringCurrentArr;
            if (inputArr && inputArr.length > 0) {
                cont.appendChild(hh.createActDataPanelHeaderElement('MPPT' + (i + 1) + ' Inputs Data'));

                for (var j = 0; j < inputArr.length; j++) {
                    sg.dataField[i].stringCurrentArr[j] = hh.adf(cont, 'Input ' + (j + 1), '', {tooltip: 'MPPT' + (i + 1) + ' Input' + (j + 1) + ' Current / Power'});
                }
            }
        }
    }
};

sg.updateParamInfo = function (dev, data) {
    let param = dev.getParam();
    if (param) {
        sg.lastUnitLoaded = dev.serialNumber;
        sg.createAndPopulateDCPanel(dev, data, param);
        mainUtils.setHtmlText('uixSmaEm_serial', dev.serialNumber);
        mainUtils.setHtmlText('uixSmaEm_modelName', dev.deviceName);
        mainUtils.setHtmlText('uixSmaEm_installationDate', dev.installedDate);
        mainUtils.setHtmlText('uixSmaEm_devComPort', param.comPort);
        mainUtils.setHtmlText('uixSmaEm_devModAddress', param.modbusAddress);

        mainUtils.setHtmlText('uixSmaEm_devMpptCount', data.mpptData.length);
        let countInputs = "";
        for (var i = 0; i < data.mpptData.length; i++) {
            countInputs += data.mpptData[i].stringCurrentArr.length;
            if (i + 1 < data.mpptData.length) {
                countInputs += " - ";
            }
        }
        mainUtils.setHtmlText('uixSmaEm_devMpptInputCount', countInputs);


        mainUtils.setHtmlText('uixSmaEm_devRatedPower', data.sumExportPower.ratedPowerW / 1000);
        mainUtils.setHtmlText('uixSmaEm_devRatedApparentPower', data.sumExportPower.ratedApparentPowerVA / 1000);
        mainUtils.setHtmlText('uixSmaEm_devRatedActivePower', data.sumExportPower.ratedReactivePowerVAR / 1000);
    }
};

sg.updateData = function (dev, data) {
    if (!data)
        return;
    if (sg.lastUnitLoaded !== dev.serialNumber) {
        sg.updateParamInfo(dev, data);
    }

    mainUtils.setHtmlText('uixSmaEm_devworkState', sg.translateWorkState(data.workState));
    let errPanel = document.querySelector('.uixSg-devFaultWarnTab');
    if (data.faultAlarmTimestamp) {
        mainUtils.setHtmlText('uixSg-faultTimestamp', moment(data.faultAlarmTimestamp).format('YYYY MM DD hh:mm:ss'));
        mainUtils.setHtmlText('uixSg-faultCode', data.faultAlarmCode);
        let tc = sg.translateFaulAlarmCode(data.faultAlarmCode);
        if (tc) {
            errPanel.style.setProperty('display', 'flex');
            mainUtils.setHtmlText('uixSg-faultDesc', tc.info);
            mainUtils.setHtmlText('uixSg-faultNote', tc.note);
        }
    } else {
        errPanel.style.setProperty('display', 'none');
        mainUtils.setHtmlText('uixSg-faultDesc', "NA");
        mainUtils.setHtmlText('uixSg-faultNote', "NA");
    }
    for (var i = 0; i < data.mpptData.length; i++) {
        let mpptOb = data.mpptData[i];
        let dataFieldObj = sg.dataField[i];
        if (!dataFieldObj) {
            continue;
        }
        sg.dataField[i].voltage.value = mpptOb.voltage;
        sg.dataField[i].current.value = mpptOb.current;
        sg.dataField[i].power.value = mpptOb.current * mpptOb.voltage;

//        let mpptPower = mpptOb.current * mpptOb.voltage;
//        if (mpptPower !== 0) {
//            mpptPower /= 1000;
//        }
//        mainUtils.setHtmlText("uixp-mppt" + i + '_voltage', mpptOb.voltage);
//        mainUtils.setHtmlText("uixp-mppt" + i + '_current', mpptOb.current);
//        mainUtils.setHtmlText("uixp-mppt" + i + '_power', mpptPower, 2);

        let inputArr = data.mpptData[i].stringCurrentArr;
        if (inputArr) {
            for (var j = 0; j < inputArr.length; j++) {
                let power = inputArr[j] * mpptOb.voltage;
                if (power !== 0) {
                    power /= 1000;
                }
                power > 0 ? power = power.toFixed(3) : power;
                sg.dataField[i].stringCurrentArr[j].value = inputArr[j] + 'A / ' + power + 'W';
//
//                let className = "uixp-mppt" + i + '_current' + j;
//                let classNamePower = "uixp-mppt" + i + '_power' + j;
//                mainUtils.setHtmlText(className, inputArr[j]);
//                mainUtils.setHtmlText(classNamePower, power);
            }
        }
    }


    let totalDcPower = data.totalDcPower;
    totalDcPower ? totalDcPower /= 1000 : totalDcPower;
    mainUtils.setHtmlText('uixSmaEm_devTotalDcPower', totalDcPower, 2);

    mainUtils.setHtmlText('uixSmaEm_devWrokTemp', data.internalTemp);
    let powerW = data.sumExportPower.powerW;
    powerW ? powerW /= 1000 : powerW;
    mainUtils.setHtmlText('uixSg_acPower', powerW, 2);
    let appPowerW = data.sumExportPower.apparentPowerVA;
    appPowerW ? appPowerW /= 1000 : appPowerW;
    mainUtils.setHtmlText('uixSg_acApparentPower', appPowerW, 2);
    let reacPowerW = data.sumExportPower.reactivePowerVAR;
    reacPowerW ? reacPowerW /= 1000 : reacPowerW;
    mainUtils.setHtmlText('uixSg_acReactivePower', reacPowerW, 3);
    mainUtils.setHtmlText('uixSg_acFrequency', data.sumExportPower.frequencyF);
    mainUtils.setHtmlText('uixSg_acPowerFactor', data.sumExportPower.powerFactorCosF);
    mainUtils.setHtmlText('uixSg_acTotalCurrent', data.sumExportPower.currentA.toFixed(2));
    mainUtils.setHtmlText('uixSg_acPowerName', data.sumExportPower.powerName);


    mainUtils.setHtmlText('uixSg_acDailyEnergy', data.dailyEnergy);
    mainUtils.setHtmlText('uixSg_acMonthlyEnergy', data.monthlyEnergy / 1000, 2);
    mainUtils.setHtmlText('uixSg_acEnergy', data.sumExportPower.energyWh / 1000, 2);
//    mainUtils.setHtmlText('uixSg_acReactiveEnergy', data.reactiveEnergyVARh / 1000, 2);
    mainUtils.setHtmlText('uixSg_acDailyRunHours', data.dailyRunningTime);
    mainUtils.setHtmlText('uixSg_acTotalRunHours', data.totalRunningTime);

    if (data.powerLimitSetpoint && data.powerLimitSetpoint >= 0) {

        mainUtils.setHtmlText('uixSg_powerLimitControl', data.powerLimitSetpoint / 1000, 1);
        mainUtils.setHtmlText('uixSg_powerLimitControlUnit', 'kW');
    } else {
        mainUtils.setHtmlText('uixSg_powerLimitControl', "Disabled");
        mainUtils.setHtmlText('uixSg_powerLimitControlUnit', ' ');
    }



    for (var i = 1; i < 4; i++) {
        let pOb = data['pha' + i + 'ExportPower'];
        mainUtils.setHtmlText('uixSg_acPha' + i + 'Voltage', pOb.voltageV);
        mainUtils.setHtmlText('uixSg_acPha' + i + 'Current', pOb.currentA);

        let tp = pOb.powerW;
        tp ? tp /= 1000 : tp;
        mainUtils.setHtmlText('uixSg_acPha' + i + 'Power', tp, 2);
        tp = pOb.apparentPowerVA;
        tp ? tp /= 1000 : tp;
        mainUtils.setHtmlText('uixSg_acPha' + i + 'ApparentPower', tp, 2);
        tp = pOb.reactivePowerVAR;
        tp ? tp /= 1000 : tp;
        mainUtils.setHtmlText('uixSg_acPha' + i + 'ReactPower', tp, 3);

        mainUtils.setHtmlText('uixSg_acPha' + i + 'PowerName', pOb.powerName);
    }

//    console.log(data);
};

sg.resetPower = function () {
    devManager.executeInstr('resetPower', 1, 0);
};
sg.resetEnergy = function () {
    devManager.executeInstr('resetEnergy', 1, 0);
};

sg.updateParam = function (dev, param) {

};

devManager.onSelectedDataReceived(sg.updateData);
devManager.onSelectedParamInit(sg.updateParam);
devManager.onSelectedChange(function (sDev) {
    sg.lastUnitLoaded = null;
    if (sDev.connected) {
        sg.updateParam(sDev, sDev.getParam());
        sg.updateData(sDev, sDev.getData());
    } else {
        mainUtils.setHtmlText('dataValues', 'N/A');
    }
//    console.log(arguments);
});
devManager.onParamReceived(function (sDev, param) {
    for (var model in param.paramMap) {
//        console.log("request Param", param);
        if (sg.smdx[model] === undefined) {
            sg.fetchSunSpecDef(model);
        }
    }
});
devManager.onSelectedStatusChange(function (sDev, status) {
    sg.lastUnitLoaded = null;
    if (status) {
        sg.updateData(sDev, sDev.getData());
    } else {
        mainUtils.setHtmlText('dataValues', 'N/A');
    }
});

sg.translateWorkState = function (state) {
    if (state !== undefined && !isNaN(state)) {
        switch (state) {
            case 0x0:
                return "Run";
            case 0x8000:
                return "Stop";
            case 0x1300:
                return "Key stop";
            case 0x1500:
                return "Emergency Stop";
            case 0x1400:
                return "Standby";
            case 0x1200:
                return "Initial standby";
            case 0x1600:
                return "Starting";
            case 0x9100:
                return "Alarm run";
            case 0x8100:
                return "Derating run";
            case 0x8200:
                return "Dispatch run";
            case 0x5500:
                return "Fault";
            case 0x2500:
                return "Communicate fault";
            case 0x1111:
                return "Not Commissioned";
        }
    }
    return "Unknown state: " + state;
};
sg.translateFaulAlarmCode = function (state) {
    if (state !== undefined && !isNaN(state)) {
        switch (state) {
            case 0x0002:
                return {info: 'Grid overvoltage', note: 'Fault is occurred because the grid voltage exceeds the permissible range. Inverter can operate normally when the grid recovers.Check the grid voltage; If the grid voltage exceeds the permissible range, ask utility grid company for solution.Check if the protection parameter setting of the LCD or APP meets requirements.If the fault still exists, please contact Sungrow.'};
            case 0x0003:
                return {info: 'Grid transient overvoltage', note: 'This is a short-term fault because the grid transient voltage exceeds the permissible range. Inverter can operate normally when the grid recovers. Please refer to troubleshooting of fault 002 if this fault repeats.'};
            case 0x0004:
                return {info: 'Grid undervoltage', note: 'Fault is occurred because the grid voltage is lower than the permissible range. Inverter can operate normally when the grid recovers.Check the grid voltage; If the grid voltage is lower than the permissible range, ask utility grid company for solution.Check if the protection parameter setting of the LCD or APPmeets requirements.If the grid voltage is normal, check if the AC cables are secure.If the fault still exists, please contact Sungrow.'};
            case 0x0005:
                return {info: 'Grid undervoltage', note: 'This fault occurs because the grid voltage is lower than the set undervoltage protection value II. Inverter can operate normally when the grid recovers. Please refer to troubleshooting of fault 004 if this fault repeats.'};
            case 0x0007:
                return {info: 'Transient AC overcurrent', note: 'The inverter will self-recover after several seconds.'};
            case 0x0008:
                return {info: 'Grid overfrequency', note: 'Check the grid frequency.If the grid voltage exceeds the inverter permissible range, ask utility grid company for solution.'};
            case 0x0009:
                return {info: 'Grid under-frequency', note: 'Check the grid frequency.If the grid voltage exceeds the inverter permissible range, ask utility grid company for solution.'};
            case 0x000A:
                return {info: 'Islanding', note: 'Inverter can operate normally when the grid recovers. If  this fault occurs repeatedly:Check if the grid power supply is normal;Check if AC cables are all firmly connected.Check if AC cables are connected to the correct terminals (no reverse connection).If the fault still exists, please contact Sungrow.'};
            case 0x000B:
                return {info: 'The DC current exceeds limit', note: 'Wait for inverter recovery.If the fault still occurs, contact Sungrow.'};
            case 0x000C:
                return {info: 'Excessive leakage current', note: 'Check whether the battery board is in rainy and humid weather or a bad light environment, if it is rainy and humid weather, there is no need to worryPlease check if the battery board is in poor contact 3.Exclude the reasons above, and the fault still exists, contact Sungrow'};
            case 0x000D:
                return {info: 'Grid abnormal', note: 'Wait for inverter recovery.If the grid voltage exceeds the inverter permissible range, ask utility grid company for solution.'};
            case 0x000E:
                return {info: 'Grid overvoltage in 10 minutes', note: '1- Wait for inverter recovery. 2- Check the grid voltage. 3- If the fault still exists, please contact Sungrow.'};
            case 0x000F:
                return {info: 'Grid overvoltage', note: 'Fault is occurred because the grid voltage exceeds the permissible range. Inverter can operate normally when the grid recovers.Check the grid voltage; If the grid voltage exceeds the permissible range, ask utility grid company for solution.Check if the protection parameter setting of the LCD or APPmeets requirements.If the fault still exists, please contact Sungrow.'};
            case 0x0010:
                return {info: 'output overload', note: 'Contact SUNGROW.'};
            case 0x0011:
                return {info: 'Grid voltage unbalance', note: 'Wait for inverter recovery.If the grid voltage unbalance exceeds the inverter permissible range, ask utility grid company for solution.Chand the unbalance degree from the LCD or APP.If the fault still exists, please contact Sungrow.'};
            case 0x0013:
                return {info: 'Bus voltage is instantaneously high', note: 'Wait for inverter recovery.Check the LCD or APP display to make sure if the PV voltage is normal. If the PV voltage exceeds the max. voltage, the PV cells configuration is too high. Please optimize the PV cell configuration.If the fault still exists, please contact Sungrow.'};
            case 0x0014:
                return {info: 'High bus voltage', note: 'Wait for inverter recovery.Check the LCD or APP display to make sure if the PV voltage is normal. If the PV voltage exceeds the max. voltage, the PV cells configuration is too high. Please optimize the PV cell configuration.If the fault still exists, please contact Sungrow.'};
            case 0x0015:
                return {info: 'PV1 overcurrent', note: 'Contact SUNGROW.'};
            case 0x0016:
                return {info: 'PV2 overcurrent', note: 'Contact SUNGROW.'};
            case 0x0017:
                return {info: 'PV access failure', note: 'Check the PV input settings; Restart the inverter.'};
            case 0x0018:
                return {info: 'Bus voltage unbalance', note: 'Wait for inverter recovery.If the fault still exists, please contact Sungrow.'};
            case 0x0019:
                return {info: 'Transient bus voltage unbalance', note: 'Wait for inverter recovery.If the fault still exists, please contact Sungrow.'};
            case 0x001E:
                return {info: 'Clamp capacitance overvoltage', note: 'Wait for inverter to return normal;If the fault occurs repeatedly, please contact SUNGROW'};
            case 0x001F:
                return {info: 'Clamp capacitance under voltage', note: 'Wait for inverter to return normal; If the fault occurs repeatedly, please contact SUNGROW.'};
            case 0x0020:
                return {info: 'Clamp capacitance unbalance', note: 'Wait for inverter to return normal;If the fault occurs repeatedly, please contact SUNGROW.'};
            case 0x0021:
                return {info: 'Clamp capacitance precharge fault', note: 'Wait for inverter to return normal;If the fault occurs repeatedly, please contact SUNGROW.'};
            case 0x0022:
                return {info: 'DC contactor fault', note: 'Wait for inverter to return normal;If the fault occurs repeatedly, please contact SUNGROW.'};
            case 0x0024:
                return {info: 'Module over temperature', note: 'Wait for inverter recovery.If this fault reoccurs,Check the LCD or APP to make sure if the ambient temperature is too high;Check if the device is placed in well-ventilated place;Check if the device is in direct sunlight. If so, please shield it.Check if the fans are normal. Replace the fan if otherwise.If the fault still exists, please contact Sungrow.'};
            case 0x0025:
                return {info: 'Ambient over temperature', note: 'Wait for inverter recovery.If this fault reoccurs,Check the LCD or APP to make sure if the ambient temperature is too high;Check if the device is placed in well-ventilated place;Check if the device is in direct sunlight. If so, please shield it.Check if the fans are normal. Replace the fan if otherwise.If the fault still exists, please contact Sungrow.'};
            case 0x0026:
                return {info: 'Relay fault', note: 'Contact Sungrow.'};
            case 0x0027:
                return {info: 'Low system insulation resistance', note: 'Wait for inverter recovery. If this fault occurs repeatedly and device cannot operate normally,Check if the ISO protection value is set too high from the LCD or APP.Check if the low insulation situation occurs in rainy days or damp weather. Measure if the positive and PV cell negative polarities to the ground is too low.If the fault still exists, please contact Sungrow.'};
            case 0x0028:
                return {info: 'Hardware protection', note: 'Wait for inverter recovery. If the fault occurs repeatedly, please contact Sungrow.'};
            case 0x0029:
                return {info: 'Leakage current sampling channel fault', note: 'Wait for inverter recovery. If the fault occurs repeatedly, please contact Sungrow.'};
            case 0x002A:
                return {info: 'Current imbalance fault', note: 'Wait for inverter recovery. If the fault occurs repeatedly, please contact Sungrow.'};
            case 0x002B:
                return {info: 'Low ambient temperature', note: 'Stop and disconnect the inverter. Restart the inverter when temperature increases to the allowable range. If the fault still exists, please contact Sungrow.'};
            case 0x002C:
                return {info: 'Inverter open loop self-test failure', note: 'Wait for inverter recovery. If the fault occurs repeatedly, please contact Sungrow.'};
            case 0x002D:
                return {info: 'PV1 boost circuit fault', note: 'Wait for inverter recovery. If the fault occurs repeatedly, please contact Sungrow.'};
            case 0x002E:
                return {info: 'PV2 boost circuit fault', note: 'Wait for inverter recovery. If the fault occurs repeatedly, please contact Sungrow.'};
            case 0x002F:
                return {info: 'PV input setting does not match the actual connection', note: 'Stop and disconnect the inverter. Reset the PV array input.'};
            case 0x0030:
                return {info: 'Leakage current sampling channel fault', note: 'Wait for inverter recovery. If the fault occurs repeatedly, please contact Sungrow.'};
            case 0x0031:
                return {info: 'S-phase current sampling channel fault', note: 'Wait for inverter recovery. If the fault occurs repeatedly, please contact Sungrow.'};
            case 0x0032:
                return {info: 'T-phase current sampling channel fault', note: 'Wait for inverter recovery. If the fault occurs repeatedly, please contact Sungrow.'};
            case 0x0035:
                return {info: 'Grid voltage redundancy detection fault', note: 'Check the grid voltage;If the grid voltage exceeds the permissible range, ask the local utility grid company for solution.If the grid voltage is within the permissible range, please contact Sungrow.'};
            case 0x0036:
                return {info: 'Grid frequency redundancy detection fault', note: 'Check the grid frequency;If the grid frequency exceeds the permissible range, ask the local utility grid company for solution.If the grid frequency is within the permissible range, please contact Sungrow.'};
            case 0x0037:
                return {info: 'Inverter insulation resistance redundancy detection fault', note: 'Wait for inverter recovery.If the fault still exists, please contact Sungrow.'};
            case 0x0038:
                return {info: 'Inverter leakage current redundancy detection fault', note: 'Check if there is ground fault to the PV string;If the fault occurs repeatedly, please contact Sungrow.'};
            case 0x003B:
                return {info: 'Main DSP and redundant DSP communication fault', note: 'Wait for inverter recovery.If the fault still exists, please contact Sungrow.'};
            case 0x003C:
                return {info: 'Main DSP and redundant DSP data comparison abnormal fault', note: 'Wait for inverter recovery.If the fault still exists, please contact Sungrow.'};
            case 0x0046:
                return {info: 'Fan fault', note: 'Check the inverter fans. Stop and disconnect the inverter to remove foreign objects. Replace the fan if it is broken.'};
            case 0x0047:
                return {info: 'AC SPD alarm', note: 'Check if the SPD is loose or broken. Replace the SPD if necessary.'};
            case 0x0048:
                return {info: 'DC SPD alarm', note: 'Check if the SPD is loose or broken. Replace the SPD if necessary.'};
            case 0x004A:
                return {info: 'Communication fault', note: 'Check the communication cable between the ARM and the DSP'};
            case 0x004C:
                return {info: 'PV overload', note: 'Wait for inverter recovery.4. Check if the PV cell setting are reasonable;2If the fault occurs repeatedly, please contact Sungrow.'};
            case 0x004E:
                return {info: 'PV1 abnormal alarm', note: 'Caused because the PV1 is not connected. Ignore this alarm if PV1 is not connected at beginning. If PV1 is connected,Check if the PV1 cables are loose.Check if the PV1 DC fuse is broken.If the fault occurs repeatedly, please contact Sungrow.'};
            case 0x004F:
                return {info: 'PV2 abnormal alarm', note: 'Caused because the PV2 is not connected. Ignore this alarm if PV2 is not connected at beginning. If PV2 is connected,Check if the PV2 cables are loose.Check if the PV2 DC fuse is broken.If the fault occurs repeatedly, please contact Sungrow.'};
            case 0x0050:
                return {info: 'PV3 abnormal alarm', note: 'Caused because the PV3 is not connected. Ignore this alarm if PV3 is not connected at beginning. If PV3 is connected,1. Check if the PV3 cables are loose. Check if the PV3 DC fuse is broken.If the fault occurs repeatedly, please contact Sungrow.'};
            case 0x0051:
                return {info: 'PV4 abnormal alarm', note: 'Caused because the PV4 is not connected. Ignore this alarm if PV4 is not connected at beginning. If PV4 is connected,Check if the PV4 cables are loose.Check if the PV4 DC fuse is broken.If the fault occurs repeatedly, please contact Sungrow.'};
            case 0x0057:
                return {info: 'AFD power module abnormal alarm', note: 'Contact SUNGROW.'};
            case 0x0058:
                return {info: 'Arc fault', note: 'Check the PV cell cable connection and fuse for arc.If the fault occurs repeatedly, please contact Sungrow.'};
            case 0x0059:
                return {info: 'AFD stop alarm', note: 'Restart the AFD function through the LCD or APP operation.'};
            case 0x0069:
                return {info: 'Net side protection self-test failure', note: 'Restart the device or remove the fault from the self-check menu.If the self-check fault still exists after restarting, contact Sungrow.'};
            case 0x006A:
                return {info: 'PE cable fault', note: 'Check if the grounding wire and the live wire are connected inadvertently.Check if the grounding wire and the live wire are reliably insulated from each other.Check the inverter for grounding.If the fault occurs repeatedly, please contact Sungrow.'};
            case 0x0074:
                return {info: 'Circuit abnormal', note: 'Wait for inverter recovery.If the fault still exists, please contact Sungrow.'};
            case 0x0075:
                return {info: 'AC circuit abnormal', note: 'Wait for inverter recovery.If the fault still exists, please contact Sungrow.'};
            case 0x0214:
                return {info: 'String 1 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x0215:
                return {info: 'String 2 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x0216:
                return {info: 'String 3 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x0217:
                return {info: 'String 4 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x0218:
                return {info: 'String 5 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x0219:
                return {info: 'String 6 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x021A:
                return {info: 'String 7 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x021B:
                return {info: 'String 8 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x021C:
                return {info: 'String 9 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x021D:
                return {info: 'String 10 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x021E:
                return {info: 'String 11 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x021F:
                return {info: 'String 12 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x0220:
                return {info: 'String 13 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x0221:
                return {info: 'String 14 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x0222:
                return {info: 'String 15 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x0223:
                return {info: 'String 16 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x0234:
                return {info: 'String 17 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x0235:
                return {info: 'String 18 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x0236:
                return {info: 'String 19 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x0237:
                return {info: 'String 20 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x0238:
                return {info: 'String 21 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x0239:
                return {info: 'String 22 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x023A:
                return {info: 'String 23 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x023B:
                return {info: 'String 24 reverse connection alarm', note: 'Check the completeness of the string settings.Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.'};
            case 0x0224:
                return {info: 'String 1 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x0225:
                return {info: 'String 2 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x0226:
                return {info: 'String 3 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x0227:
                return {info: 'String 4 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x0228:
                return {info: 'String 5 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x0229:
                return {info: 'String 6 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x022A:
                return {info: 'String 7 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x022B:
                return {info: 'String 8 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x022C:
                return {info: 'String 9 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x022D:
                return {info: 'String 10 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x022E:
                return {info: 'String 11 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x022F:
                return {info: 'String 12 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x0230:
                return {info: 'String 13 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x0231:
                return {info: 'String 14 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x0232:
                return {info: 'String 15 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x0233:
                return {info: 'String 16 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x0244:
                return {info: 'String   17   power   module abnormal', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow. Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x0245:
                return {info: 'String 18 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x0246:
                return {info: 'String 19 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x0247:
                return {info: 'String 20 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x0248:
                return {info: 'String 21 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x0249:
                return {info: 'String 22 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x024A:
                return {info: 'String 23 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x024B:
                return {info: 'String 24 power module abnormal alarm', note: 'Caused by short-circuit, open circuit or low current of one input. Check if the voltage or current is abnormal through the LCDor APP.Check if the strings are broken.Check if the PV cell cables are loose.Check if the DC fuse is broken.If the fault still exists, please contact Sungrow.'};
            case 0x01C0:
                return {info: 'String 1 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01C1:
                return {info: 'String 2 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01C2:
                return {info: 'String 3 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01C3:
                return {info: 'String 4 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01C4:
                return {info: 'String 5 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01C5:
                return {info: 'String 6 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01C6:
                return {info: 'String 7 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01C7:
                return {info: 'String 8 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01C8:
                return {info: 'String 9 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01C9:
                return {info: 'String 10 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01CA:
                return {info: 'String 11 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01CB:
                return {info: 'String 12 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01CC:
                return {info: 'String 13 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01CD:
                return {info: 'String 14 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01CE:
                return {info: 'String 15 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01CF:
                return {info: 'String 16 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01D0:
                return {info: 'String 17 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01D1:
                return {info: 'String 18 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01D2:
                return {info: 'String 19 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01D3:
                return {info: 'String 20 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01D4:
                return {info: 'String 21 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01D5:
                return {info: 'String 22 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01D6:
                return {info: 'String 23 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
            case 0x01D7:
                return {info: 'String 24 reverse connection fault', note: 'Check the polarity of the PV input side. Reconnect the input if the polarities are reversed.If the fault still exists, please contact Sungrow.'};
        }
    }
    return "Unknown state: " + state;
};

$(document).ready(function () {
    sg.createSettingsEms();
});