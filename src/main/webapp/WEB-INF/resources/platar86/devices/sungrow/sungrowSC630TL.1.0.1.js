/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by brais, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */

/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, fetch, hh, wsm, mu, sgscst */

function addField(panelContainer, title, value, valueClass, unit) {
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: title, value: value, valueClass: [valueClass], unit: (!unit ? "" : unit)}));
}

var sgsc = {
    lastUnitLoaded: null,
    comp: {
        esPowerControl: {},
        gridImp: {},
        gridExp: {},
        param: {}
    }
};

sgsc.formatWorkingState = function (val) {
    let outputString = '';
    if ((val & 1 << 0) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'Running';
    }
    if ((val & 1 << 1) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'Stop';
    }
    if ((val & 1 << 3) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'Key stop';
    }
    if ((val & 1 << 4) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'Standby';
    }
    if ((val & 1 << 5) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'Emergency stop';
    }
    if ((val & 1 << 6) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'Starting';
    }
    if ((val & 1 << 7) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'Stopping';
    }
    if ((val & 1 << 8) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'Low insulation impedance';
    }
    if ((val & 1 << 9) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'Fault stop';
    }
    if ((val & 1 << 10) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'Alarm running';
    }
    if ((val & 1 << 11) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'Derating running';
    }
    if ((val & 1 << 15) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'Communication error';
    }
    return outputString;
};

sgsc.formatWorkingMode = function (val) {
    let outputString = '';
    if ((val & 1 << 0) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'Constant current';
    }
    if ((val & 1 << 1) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'Constant voltage';
    }
    if ((val & 1 << 2) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'Constant power (AC)';
    }
    if ((val & 1 << 3) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'Constant power (DC)';
    }
    if ((val & 1 << 9) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'On-grid';
    }
    if ((val & 1 << 10) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'Off-grid';
    }
    if ((val & 1 << 11) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'VSG';
    }

    return outputString;
};

sgsc.formatInsRes = function (val) {
    if (val >= 1000) {
        return '\u22651000';
    }
    return val;
};

sgsc.formatEmsOpFlags = function (val) {
    let outputString = '';

    if ((val & 1 << 1) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'ST Charge Current Limit';
    }
    if ((val & 1 << 2) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'ST Charge Voltage Limit';
    }
    if ((val & 1 << 3) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'ST Charge Capacity Limit';
    }
    if ((val & 1 << 4) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'ST Discharge Current Limit';
    }
    if ((val & 1 << 5) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'ST Discharge Voltage Limit';
    }
    if ((val & 1 << 6) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'ST Discharge Capacity Limit';
    }
    if ((val & 1 << 7) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'DEV Charge Limit';
    }
    if ((val & 1 << 8) !== 0) {
        if (outputString) {
            outputString += ', ';
        }
        outputString += 'DEV Discharge Limit';
    }

    return outputString;
};

sgsc.createActualData = function (container) {
    let sysInfP = hh.createActDataPanelCard('System Information', null, container);
    sgsc.comp.workingMode = hh.adf(sysInfP, 'Working Mode', {formatter: sgsc.formatWorkingMode});
    sgsc.comp.workingState = hh.adf(sysInfP, 'Working State', {formatter: sgsc.formatWorkingState});
    sgsc.comp.chargeDischargeState = hh.adf(sysInfP, 'Charge / Discharge State', {datamap: {'0': 'Charging', '1': 'Discharging', '2': 'Non-working mode'}});
    sgsc.comp.chargeDischargeState = hh.adf(sysInfP, 'Charge / Discharge State', {datamap: {'0': 'Charging', '1': 'Discharging', '2': 'Non-working mode'}});
    hh.addHeaderTitleToPC(sysInfP, 'EMS Info');
    sgsc.comp.esPowerControl.emsActive = hh.adf(sysInfP, 'EMS Status');
    sgsc.comp.esPowerControl.limitFlags = hh.adf(sysInfP, 'EMS Op Flags', {formatter: sgsc.formatEmsOpFlags});
    sgsc.comp.esPowerControl.applyedSumPowerW = hh.adf(sysInfP, 'EMS Power Request', 'W', {'sIPrefix': ['k', 'M', 'G'], 'decimal': 1});

    let acInfP = hh.createActDataPanelCard('AC Information', null, container);
    sgsc.comp.acCircBreaker = hh.adf(acInfP, 'AC Circuit Breaker');
    sgsc.comp.acCircContactor = hh.adf(acInfP, 'AC Contacotr');
    sgsc.comp.gridVoltageVAB = hh.adf(acInfP, 'Voltage U-V', 'V', {'decimal': 1});
    sgsc.comp.gridVoltageVBC = hh.adf(acInfP, 'Voltage V-W', 'V', {'decimal': 1});
    sgsc.comp.gridVoltageVCA = hh.adf(acInfP, 'Voltage W-U', 'V', {'decimal': 1});
    
    sgsc.comp.totalCurrentA = hh.adf(acInfP, 'Total Current', 'A', {'decimal': 1, formatter: function (val) {
            if(val === 0){
                return 0;
            }
            return (val / 1.7320508075688772).toFixed(1);
        }});
    
    sgsc.comp.phaseAcurrent = hh.adf(acInfP, 'Current U', 'A', {'decimal': 1});
    sgsc.comp.phaseBcurrent = hh.adf(acInfP, 'Current V', 'A', {'decimal': 1});
    sgsc.comp.phaseCcurrent = hh.adf(acInfP, 'Current W', 'A', {'decimal': 1});
    sgsc.comp.gridFrequency = hh.adf(acInfP, 'Frequency', 'Hz', {'decimal': 2});
    sgsc.comp.reactivePower = hh.adf(acInfP, 'Reactive Power', 'VAR', {'sIPrefix': 'k', decimal: 1});
    sgsc.comp.activePower = hh.adf(acInfP, 'Active Power', 'VA', {'sIPrefix': 'k', decimal: 1});
    sgsc.comp.powerFactor = hh.adf(acInfP, 'Power Factor', 'COS \u03D5');

    let dcInfP = hh.createActDataPanelCard('DC Information', null, container);
    sgsc.comp.dcSwitch = hh.adf(dcInfP, 'DC Motorized Breaker');
    sgsc.comp.dcFuseState1 = hh.adf(dcInfP, 'DC Fuse 1');
    sgsc.comp.dcFuseState2 = hh.adf(dcInfP, 'DC Fuse 2');
    sgsc.comp.dcVoltage = hh.adf(dcInfP, 'Voltage', 'V');
    sgsc.comp.dcCurrent = hh.adf(dcInfP, 'Current', 'A');
    sgsc.comp.dcPower = hh.adf(dcInfP, 'Power', 'kW', {decimal: 1});
    sgsc.comp.esPowerControl.storageCapacityPer = hh.adf(dcInfP, 'Capacity', '%', {'decimal': 2});
    sgsc.comp.positiveImpedanceToGround = hh.adf(dcInfP, 'RIso (Positive to GND)', 'k\u2126', {formatter: sgsc.formatInsRes});
    sgsc.comp.negativeImpedanceToGround = hh.adf(dcInfP, 'RIso (Negative to GND)', 'k\u2126', {formatter: sgsc.formatInsRes});

    let energyInfP = hh.createActDataPanelCard('Total Energy', null, container);
    sgsc.comp.dailyCh = hh.adf(energyInfP, 'Daily Charge');
    sgsc.comp.dailyDisch = hh.adf(energyInfP, 'Daily Discharge');
    sgsc.comp.totalCh = hh.adf(energyInfP, 'Total Charge');
    sgsc.comp.totalDisch = hh.adf(energyInfP, 'Total Charge');

    sgsc.comp.gridImp.weeklyEnergyWh = hh.adf(energyInfP, 'Weekly Grid Import', 'Wh', {'sIPrefix': ['k', 'M', 'G'], 'decimal': 1});
    sgsc.comp.gridImp.monthlyEnergyWh = hh.adf(energyInfP, 'Monthly Grid Import', 'Wh', {'sIPrefix': ['k', 'M', 'G'], 'decimal': 1});
    sgsc.comp.gridImp.yearlyEnergyWh = hh.adf(energyInfP, 'Yearly Grid Import', 'Wh', {'sIPrefix': ['k', 'M', 'G'], 'decimal': 1});

    sgsc.comp.gridExp.weeklyEnergyWh = hh.adf(energyInfP, 'Weekly Grid Export', 'Wh', {'sIPrefix': ['k', 'M', 'G'], 'decimal': 1});
    sgsc.comp.gridExp.monthlyEnergyWh = hh.adf(energyInfP, 'Monthly Grid Export', 'Wh', {'sIPrefix': ['k', 'M', 'G'], 'decimal': 1});
    sgsc.comp.gridExp.yearlyEnergyWh = hh.adf(energyInfP, 'Yearly Grid Export', 'Wh', {'sIPrefix': ['k', 'M', 'G'], 'decimal': 1});

    let tempInfP = hh.createActDataPanelCard('Temperature Information', null, container);
    sgsc.comp.ambientTemperature = hh.adf(tempInfP, 'Ambient', '\u2103', {'decimal': 1});
    sgsc.comp.moduleTemp1C = hh.adf(tempInfP, 'Module 1', '\u2103', {'decimal': 1});
    sgsc.comp.moduleTemp2C = hh.adf(tempInfP, 'Module 2', '\u2103', {'decimal': 1});
    sgsc.comp.moduleTemp3C = hh.adf(tempInfP, 'Module 3', '\u2103', {'decimal': 1});
    sgsc.comp.moduleTemp4C = hh.adf(tempInfP, 'Module 4', '\u2103', {'decimal': 1});
    sgsc.comp.moduleTemp5C = hh.adf(tempInfP, 'Module 5', '\u2103', {'decimal': 1});
    sgsc.comp.moduleTemp6C = hh.adf(tempInfP, 'Module 6', '\u2103', {'decimal': 1});
};

sgsc.updateData = function (dev, data) {
    if (!data) {
        console.log('Sungrow SC 630 TL. No valid data received');
        return;
    }

    hh.updateAdfFromObject(sgsc.comp, data, true);

    try {
        sgsc.comp.param.ratedActivePower.value = data.ratedOutputPower;
        sgsc.comp.param.ratedReactivePower.value = data.ratedOutputReactivePower;

        sgsc.comp.totalCurrentA.value = data.phaseAcurrent + data.phaseBcurrent + data.phaseCcurrent;
        sgsc.comp.dcSwitch.value = ((data.pcsNodeState << 2) !== 0) ? 'Closed' : 'Opened';
        sgsc.comp.dcFuseState1.value = ((data.pcsNodeState << 6) !== 0) ? 'Closed' : 'Blown';
        sgsc.comp.dcFuseState2.value = ((data.pcsNodeState << 7) !== 0) ? 'Closed' : 'Blown';
        sgsc.comp.acCircBreaker.value = ((data.pcsNodeState << 0) !== 0) ? 'Closed' : 'Opened';
        sgsc.comp.acCircContactor.value = ((data.pcsNodeState << 1) !== 0) ? 'Closed' : 'Opened';

        let a = mu.getTimeFromSeconds(data.dailyChargeHours * 60);
        sgsc.comp.dailyCh.value = (data.dailyChargeEnergy).toFixed(2) + 'kWh ' + a.substring(4, a.length);

        a = mu.getTimeFromSeconds(data.dailyDischargeHours * 60);
        sgsc.comp.dailyDisch.value = (data.dailyDischargeEnergy).toFixed(2) + 'kWh ' + a.substring(4, a.length);

        a = mu.getTimeFromSeconds(data.totalChargeHours * 60 * 60);
        sgsc.comp.totalCh.value = (data.totalChargeEnergy / 1000).toFixed(0) + 'MWh ' + a.substring(0, a.length - 4);

        a = mu.getTimeFromSeconds(data.totalDischargeHours * 60 * 60);
        sgsc.comp.totalDisch.value = (data.totalDischargeEnergy / 1000).toFixed(0) + 'MWh ' + a.substring(0, a.length - 4);

        sgsc.comp.esPowerControl.emsActive.value = (data.esPowerControl.limitFlags & (1 << 0)) ? 'Active' : 'Disabled';
    } catch (e) {

    }

};

sgsc.createInfo = function (container) {
    let infoPanel = hh.createActDataPanelCard("General Info", null, container);
    addField(infoPanel, 'Device Name:', "N/A", 'sgscP-deviceName');
    addField(infoPanel, 'Installed Date:', "N/A", 'sgscP-installedDate');
    addField(infoPanel, 'Serial Number:', "N/A", 'sgscP-serialNumber');
    addField(infoPanel, 'IP Address:', "N/A", 'sgscP-ipAddress');
//    addField(infoPanel, 'Firmware Version:', "N/A", 'sgscP-firmwareVer');
//    addField(infoPanel, 'Coms FW Version:', "N/A", 'sgscP-comsFwVer');
//    addField(infoPanel, 'Safety Type:', "N/A", 'sgscP-safetyType');
    sgsc.comp.param.ratedActivePower = hh.adf(infoPanel, 'Rated Active Power', 'W', {'sIPrefix': 'k', decimal: 1});
    sgsc.comp.param.ratedReactivePower = hh.adf(infoPanel, 'Rated Reactive Power', 'W', {'sIPrefix': 'k', decimal: 1}
    );
};

sgsc.updateParam = function (dev, param) {
    dev.paramLoaded = true;
    mainUtils.setHtmlText('sgscP-deviceName', dev.deviceName);
    mainUtils.setHtmlText('sgscP-installedDate', dev.installedDate);
    mainUtils.setHtmlText('sgscP-serialNumber', param.serialNumber);
    mainUtils.setHtmlText('sgscP-ipAddress', param.ipAddress);
    mainUtils.setHtmlText('sgscP-firmwareVer', dev.fwVer);
    mainUtils.setHtmlText('sgscP-comsFwVer', param.comsFwVer);
    mainUtils.setHtmlText('sgscP-safetyType', param.safetyType);
};


sgsc.onInstrSuccess = function (message, data) {
    mu.showInfoMessage(data, "Success");
};

sgsc.onInstrError = function (message, data) {
    mu.showErrprMessage(data, "Error");
};

sgsc.reset = function () {
    wsm.sendDevMsgExecWithJsonInst({instrExt: "factoryReset"}, sgsc.onInstrSuccess, sgsc.onInstrError, sgsc.onInstrError);
};

devManager.onSelectedDataReceived(sgsc.updateData);
devManager.onSelectedParamInit(sgsc.updateParam);

devManager.onSelectedChange(function (sDev) {
    sgsc.lastUnitLoaded = null;
    if (sDev.connected) {
        sgsc.updateData(sDev, sDev.getData());
    } else {
        mainUtils.setHtmlText('dataValues', 'N/A');
    }
});
devManager.onParamReceived(function (sDev, param) {

});

devManager.onSelectedStatusChange(function (sDev, status) {
    sgsc.lastUnitLoaded = null;
    if (status) {
        sgsc.updateData(sDev, sDev.getData());
    } else {
        mainUtils.setHtmlText('dataValues', 'N/A');
    }
});

sgsc.init = function () {
    sgsc.createActualData(document.getElementById("sgsc-actData-p1"));
    sgsc.createInfo(document.getElementById("sgsc-info-p1"));

};

$(document).ready(function () {
    sgsc.init();
});
