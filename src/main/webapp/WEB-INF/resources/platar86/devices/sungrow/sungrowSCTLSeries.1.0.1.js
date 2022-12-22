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

function addField(generalInfoPnlContainer, title, value, valueClass, unit) {
    generalInfoPnlContainer.appendChild(hh.addItemToActDataPanelCard({title: title, value: value, valueClass: [valueClass], unit: (!unit ? "" : unit)}));
}

var sgsc = {
    lastUnitLoaded: null,
    modelName: ''
};

sgsc.models = {
    SC50: 'SC50',
    SC100: 'SC100',
    SC250: 'SC250',
    SC500TL: 'SC500TL',
    SC500TL_V21: 'SC500TL-V21',
    SC500TL_V23: 'SC500TL-V23',
    SC500TL_V25: 'SC500TL-V25',
    SC1000: 'SC1000'
};

sgsc.createActualData = function (container) {

    let dcInformationPnl = hh.createActDataPanelCard('DC Information');
    addField(dcInformationPnl, 'DC voltage:', "N/A", 'sgscD-dcVoltage', 'V');
    addField(dcInformationPnl, 'DC current:', "N/A", 'sgscD-dcCurrent', 'A');
    addField(dcInformationPnl, 'DC power:', "N/A", 'sgscD-dcPower', 'W');

    let acInformationPnl = hh.createActDataPanelCard('AC Information');
    addField(acInformationPnl, 'Phase A Voltage:', "N/A", 'sgscD-abLineVoltage', 'V');
    addField(acInformationPnl, 'Phase B Voltage:', "N/A", 'sgscD-bcLineVoltage', 'V');
    addField(acInformationPnl, 'Phase C Voltage:', "N/A", 'sgscD-caLineVoltage', 'V');
    addField(acInformationPnl, 'Phase A current:', "N/A", 'sgscD-phaseAcurrent', 'A');
    addField(acInformationPnl, 'Phase B current:', "N/A", 'sgscD-phaseBcurrent', 'A');
    addField(acInformationPnl, 'Phase C current:', "N/A", 'sgscD-phaseCcurrent', 'A');
    addField(acInformationPnl, 'Apparent power:', "N/A", 'sgscD-apparentPower', 'VA');
    addField(acInformationPnl, 'Active power:', "N/A", 'sgscD-activePower', 'W');
    addField(acInformationPnl, 'Reactive power:', "N/A", 'sgscD-reactivePower', 'Var');
    addField(acInformationPnl, 'Power factor:', "N/A", 'sgscD-powerFactor', '');
    addField(acInformationPnl, 'Grid frequency:', "N/A", 'sgscD-gridFrequency', 'Hz');

    let temperatureInfoPnl = hh.createActDataPanelCard('Temperature Information');
    addField(temperatureInfoPnl, 'Internal temperature:', "N/A", 'sgscD-internalTemperature', 'C');
    addField(temperatureInfoPnl, 'Module A1 temperature:', "N/A", 'sgscD-moduleA1Temperature', 'C');
    addField(temperatureInfoPnl, 'Module B1 temperature:', "N/A", 'sgscD-moduleB1Temperature', 'C');
    addField(temperatureInfoPnl, 'Module C1 temperature:', "N/A", 'sgscD-moduleC1Temperature', 'C');
    addField(temperatureInfoPnl, 'Module A2 temperature:', "N/A", 'sgscD-moduleA2Temperature', 'C');
    addField(temperatureInfoPnl, 'Module B2 temperature:', "N/A", 'sgscD-moduleB2Temperature', 'C');
    addField(temperatureInfoPnl, 'Module C2 temperature:', "N/A", 'sgscD-moduleC2Temperature', 'C');
    if (sgsc.models.SC1000 === sgsc.modelName) {
        addField(temperatureInfoPnl, 'Module A3 temperature:', "N/A", 'sgscD-moduleA3Temperature', 'C');
        addField(temperatureInfoPnl, 'Module B3 temperature:', "N/A", 'sgscD-moduleB3Temperature', 'C');
        addField(temperatureInfoPnl, 'Module C3 temperature:', "N/A", 'sgscD-moduleC3Temperature', 'C');
    }

    let chargeInfoPnl = hh.createActDataPanelCard('Charge Information');
    addField(chargeInfoPnl, 'Daily charge capacity:', "N/A", 'sgscD-dailyChargeCapacity', 'kWh');
    addField(chargeInfoPnl, 'Monthly charge capacity:', "N/A", 'sgscD-monthlyChargeCapacity', 'kWh');
    addField(chargeInfoPnl, 'Annual charge capacity:', "N/A", 'sgscD-annualChargeCapacity', 'kWh');
    addField(chargeInfoPnl, 'Total charge capacity:', "N/A", 'sgscD-totalChargeCapacity', 'kWh');
    addField(chargeInfoPnl, 'Daily charge time:', "N/A", 'sgscD-dailyChargeTime', 'min');
    addField(chargeInfoPnl, 'Monthly charge time:', "N/A", 'sgscD-monthlyChargeTime', 'h');
    addField(chargeInfoPnl, 'Annual charge time:', "N/A", 'sgscD-annualChargeTime', 'h');
    addField(chargeInfoPnl, 'Total charge time:', "N/A", 'sgscD-totalChargeTime', 'h');
    addField(chargeInfoPnl, 'Total running time:', "N/A", 'sgscD-totalRunningTimeCharge', 'h');
    if (sgsc.modelName === sgsc.models.SC1000) {
        addField(chargeInfoPnl, 'Max. charge full voltage:', "N/A", 'sgscD-maxChargeFullVoltage', 'V');
        addField(chargeInfoPnl, 'Min. charge full voltage:', "N/A", 'sgscD-minChargeFullVoltage', 'V');
        addField(chargeInfoPnl, 'Max. charge full recover voltage:', "N/A", 'sgscD-maxChargeFullRecoverVoltage', 'V');
        addField(chargeInfoPnl, 'Min. charge full recover voltage:', "N/A", 'sgscD-minChargeFullRecoverVoltage', 'V');
    }
    addField(chargeInfoPnl, 'Charge times:', "N/A", 'sgscD-chargeTimes', '');

    let dischargeInfoPnl = hh.createActDataPanelCard('Discharge Information');
    addField(dischargeInfoPnl, 'Daily discharge capacity:', "N/A", 'sgscD-dailyDischargeCapacity', 'kWh');
    addField(dischargeInfoPnl, 'Monthly discharge capacity:', "N/A", 'sgscD-monthlyDischargeCapacity', 'kWh');
    addField(dischargeInfoPnl, 'Annual discharge capacity:', "N/A", 'sgscD-annualDischargeCapacity', 'kWh');
    addField(dischargeInfoPnl, 'Total discharge capacity:', "N/A", 'sgscD-totalDischargeCapacity', 'kWh');
    addField(dischargeInfoPnl, 'Daily discharge time:', "N/A", 'sgscD-dailyDischargeTime', 'min');
    addField(dischargeInfoPnl, 'Monthly discharge time:', "N/A", 'sgscD-monthlyDischargeTime', 'h');
    addField(dischargeInfoPnl, 'Annual discharge time:', "N/A", 'sgscD-annualDischargeTime', 'h');
    addField(dischargeInfoPnl, 'Total discharge time:', "N/A", 'sgscD-totalDischargeTime', 'h');
    addField(dischargeInfoPnl, 'Total running time:', "N/A", 'sgscD-totalRunningTimeDisch', 'h');
    if (sgsc.modelName === sgsc.models.SC1000) {
        addField(dischargeInfoPnl, 'Max. discharge empty voltage:', "N/A", 'sgscD-maxDischargeEmptyVoltage', 'V');
        addField(dischargeInfoPnl, 'Min. discharge empty voltage:', "N/A", 'sgscD-minDischargeEmptyVoltage', 'V');
        addField(dischargeInfoPnl, 'Max. discharge empty recover voltage:', "N/A", 'sgscD-maxDischargeEmptyRecoverVoltage', 'V');
        addField(dischargeInfoPnl, 'Min. discharge empty recover voltage:', "N/A", 'sgscD-minDischargeEmptyRecoverVoltage', 'V');
    }
    addField(dischargeInfoPnl, 'Discharge times:', "N/A", 'sgscD-dischargeTimes', '');

    let statePnl = hh.createActDataPanelCard('State Information');
    addField(statePnl, 'Device state:', "N/A", 'sgscD-deviceState', '');
    addField(statePnl, 'Fault state 1:', "N/A", 'sgscD-faultState1', '');
    addField(statePnl, 'Fault state 2:', "N/A", 'sgscD-faultState2', '');
    if (sgsc.modelName === sgsc.models.SC1000) {
        addField(statePnl, 'Alarm state:', "N/A", 'sgscD-alarmState', '');
    }

    let generalInfoPnl = hh.createActDataPanelCard('General Information');
    addField(generalInfoPnl, 'Device type code:', "N/A", 'sgscD-deviceTypeCode', '');
    addField(generalInfoPnl, 'Nominal output power:', "N/A", 'sgscD-nominalOutputPower', 'kW');
    addField(generalInfoPnl, 'Output type:', "N/A", 'sgscD-outputType', '');
    addField(generalInfoPnl, 'Charge/discharge state:', "N/A", 'sgscD-chargeDischargeState', '');
    addField(generalInfoPnl, 'Efficiency:', "N/A", 'sgscD-efficiency', '%');
    addField(generalInfoPnl, 'Max. current in constant current mode:', "N/A", 'sgscD-maxCurrentInConstCurrentMode', 'A');
    addField(generalInfoPnl, 'Min. current in constant current mode:', "N/A", 'sgscD-minCurrentInConstCurrentMode', 'A');
    addField(generalInfoPnl, 'Max. voltage in constant voltage mode:', "N/A", 'sgscD-maxVoltageInConstVoltageMode', 'V');
    addField(generalInfoPnl, 'Min. voltage in constant voltage mode:', "N/A", 'sgscD-minVoltageInConstVoltageMode', 'V');
    addField(generalInfoPnl, 'Max. current in constant voltage mode:', "N/A", 'sgscD-maxCurrentInConstVoltageMode', 'A');
    addField(generalInfoPnl, 'Min. current in constant voltage mode:', "N/A", 'sgscD-minCurrentInConstVoltageMode', 'A');
    addField(generalInfoPnl, 'Max. power in constant power (DC) mode:', "N/A", 'sgscD-maxPowerInConstPowerDCmode', 'kW');
    addField(generalInfoPnl, 'Min. power in constant power (DC) mode:', "N/A", 'sgscD-minPowerInConstPowerDCmode', 'kW');
    addField(generalInfoPnl, 'Max. power in constant power (AC) mode:', "N/A", 'sgscD-maxPowerInConstPowerACmode', 'kW');
    addField(generalInfoPnl, 'Min. power in constant power (AC) mode:', "N/A", 'sgscD-minPowerInConstPowerACmode', 'kW');
    addField(generalInfoPnl, 'Max. frequency in independent inverter state:', "N/A", 'sgscD-maxFreqInIndependentInverterState', 'Hz');
    addField(generalInfoPnl, 'Min. frequency in independent inverter state:', "N/A", 'sgscD-minFreqInIndependentInverterState', 'Hz');
    addField(generalInfoPnl, 'Max. voltage in independent inverter state:', "N/A", 'sgscD-maxVoltInIndependentInverterState', 'V');
    addField(generalInfoPnl, 'Min. voltage in independent inverter state:', "N/A", 'sgscD-minVoltInIndependentInverterState', 'V');
    addField(generalInfoPnl, 'Max. power factor:', "N/A", 'sgscD-maxPowerFactor', '');
    addField(generalInfoPnl, 'Min. power factor:', "N/A", 'sgscD-minPowerFactor', '');
    addField(generalInfoPnl, 'Max. reactive power percentage:', "N/A", 'sgscD-maxReactivePowerPercentage', '%');
    addField(generalInfoPnl, 'Min. reactive power percentage:', "N/A", 'sgscD-minReactivePowerPercentage', '%');
    addField(generalInfoPnl, 'Gird/off-grid mode:', "N/A", 'sgscD-gridOffGridMode', '');
    addField(generalInfoPnl, 'Active/Passive mode:', "N/A", 'sgscD-activePassiveMode', '');
    addField(generalInfoPnl, 'Off-grid master/slave flag:', "N/A", 'sgscD-offGridMasterSlaveFlag', '');
    if ([sgsc.models.SC500TL, sgsc.models.SC500TL_V21, sgsc.models.SC500TL_V23, sgsc.models.SC500TL_V25, sgsc.models.SC1000].includes(sgsc.modelName)) {
        addField(generalInfoPnl, 'Positive ground resistance:', "N/A", 'sgscD-positiveGroundResistance', 'kΩ');
        addField(generalInfoPnl, 'Negative ground resistance:', "N/A", 'sgscD-negativeGroundResistance', 'kΩ');
    }
    if ([sgsc.models.SC500TL, sgsc.models.SC500TL_V21, sgsc.models.SC500TL_V23, sgsc.models.SC500TL_V25].includes(sgsc.modelName)) {
        addField(generalInfoPnl, 'Low insulation resistance:', "N/A", 'sgscD-lowInsulationResistance', '');
    }
    if (sgsc.models.SC500TL_V25 === sgsc.modelName) {
        addField(generalInfoPnl, 'Carrier Wave Sync Master/Slave:', "N/A", 'sgscD-carrierWaveSyncMasterSlave', '');
    }

    container.appendChild(dcInformationPnl);
    container.appendChild(acInformationPnl);
    container.appendChild(temperatureInfoPnl);
    container.appendChild(chargeInfoPnl);
    container.appendChild(dischargeInfoPnl);
    container.appendChild(statePnl);
    container.appendChild(generalInfoPnl);
};

sgsc.updateData = function (dev, data) {
    if (!data) {
        console.log('Sungrow SC TL Series. No valid data received');
        return;
    }
    mainUtils.setHtmlText('sgscD-deviceTypeCode', data.deviceTypeCode);
    mainUtils.setHtmlText('sgscD-nominalOutputPower', data.nominalOutputPower);
    mainUtils.setHtmlText('sgscD-outputType', sgscst.getOutputType(data.outputType));
    mainUtils.setHtmlText('sgscD-chargeDischargeState', sgscst.getChargeDischargeState(data.chargeDischargeState));
    mainUtils.setHtmlText('sgscD-efficiency', data.efficiency);
    mainUtils.setHtmlText('sgscD-dcVoltage', data.dcVoltage);
    mainUtils.setHtmlText('sgscD-dcCurrent', data.dcCurrent);
    mainUtils.setHtmlText('sgscD-dcPower', data.dcPower);
    mainUtils.setHtmlText('sgscD-abLineVoltage', data.abLineVoltage);
    mainUtils.setHtmlText('sgscD-bcLineVoltage', data.bcLineVoltage);
    mainUtils.setHtmlText('sgscD-caLineVoltage', data.caLineVoltage);
    mainUtils.setHtmlText('sgscD-phaseAcurrent', data.phaseAcurrent);
    mainUtils.setHtmlText('sgscD-phaseBcurrent', data.phaseBcurrent);
    mainUtils.setHtmlText('sgscD-phaseCcurrent', data.phaseCcurrent);
    mainUtils.setHtmlText('sgscD-apparentPower', data.apparentPower);
    mainUtils.setHtmlText('sgscD-activePower', data.activePower);
    mainUtils.setHtmlText('sgscD-reactivePower', data.reactivePower);
    mainUtils.setHtmlText('sgscD-powerFactor', data.powerFactor);
    mainUtils.setHtmlText('sgscD-gridFrequency', data.gridFrequency);

    mainUtils.setHtmlText('sgscD-internalTemperature', data.internalTemperature);
    mainUtils.setHtmlText('sgscD-moduleA1Temperature', data.moduleA1Temperature);
    mainUtils.setHtmlText('sgscD-moduleB1Temperature', data.moduleB1Temperature);
    mainUtils.setHtmlText('sgscD-moduleC1Temperature', data.moduleC1Temperature);
    mainUtils.setHtmlText('sgscD-moduleA2Temperature', data.moduleA2Temperature);
    mainUtils.setHtmlText('sgscD-moduleB2Temperature', data.moduleB2Temperature);
    mainUtils.setHtmlText('sgscD-moduleC2Temperature', data.moduleC2Temperature);

    mainUtils.setHtmlText('sgscD-totalRunningTimeCharge', data.totalRunningTime);
    mainUtils.setHtmlText('sgscD-totalRunningTimeDisch', data.totalRunningTime);
    mainUtils.setHtmlText('sgscD-dailyChargeCapacity', data.dailyChargeCapacity);
    mainUtils.setHtmlText('sgscD-dailyDischargeCapacity', data.dailyDischargeCapacity);
    mainUtils.setHtmlText('sgscD-dailyChargeTime', data.dailyChargeTime);
    mainUtils.setHtmlText('sgscD-dailyDischargeTime', data.dailyDischargeTime);
    mainUtils.setHtmlText('sgscD-monthlyChargeCapacity', data.monthlyChargeCapacity);
    mainUtils.setHtmlText('sgscD-monthlyDischargeCapacity', data.monthlyDischargeCapacity);
    mainUtils.setHtmlText('sgscD-monthlyChargeTime', data.monthlyChargeTime);
    mainUtils.setHtmlText('sgscD-monthlyDischargeTime', data.monthlyDischargeTime);
    mainUtils.setHtmlText('sgscD-annualChargeCapacity', data.annualChargeCapacity);
    mainUtils.setHtmlText('sgscD-annualDischargeCapacity', data.annualDischargeCapacity);
    mainUtils.setHtmlText('sgscD-annualChargeTime', data.annualChargeTime);
    mainUtils.setHtmlText('sgscD-annualDischargeTime', data.annualDischargeTime);
    mainUtils.setHtmlText('sgscD-totalChargeCapacity', data.totalChargeCapacity);
    mainUtils.setHtmlText('sgscD-totalDischargeCapacity', data.totalDischargeCapacity);
    mainUtils.setHtmlText('sgscD-totalChargeTime', data.totalChargeTime);
    mainUtils.setHtmlText('sgscD-totalDischargeTime', data.totalDischargeTime);
    mainUtils.setHtmlText('sgscD-maxCurrentInConstCurrentMode', data.maxCurrentInConstCurrentMode);
    mainUtils.setHtmlText('sgscD-minCurrentInConstCurrentMode', data.minCurrentInConstCurrentMode);
    mainUtils.setHtmlText('sgscD-maxVoltageInConstVoltageMode', data.maxVoltageInConstVoltageMode);
    mainUtils.setHtmlText('sgscD-minVoltageInConstVoltageMode', data.minVoltageInConstVoltageMode);
    mainUtils.setHtmlText('sgscD-maxCurrentInConstVoltageMode', data.maxCurrentInConstVoltageMode);
    mainUtils.setHtmlText('sgscD-minCurrentInConstVoltageMode', data.minCurrentInConstVoltageMode);
    mainUtils.setHtmlText('sgscD-maxPowerInConstPowerDCmode', data.maxPowerInConstPowerDCmode);
    mainUtils.setHtmlText('sgscD-minPowerInConstPowerDCmode', data.minPowerInConstPowerDCmode);
    mainUtils.setHtmlText('sgscD-maxPowerInConstPowerACmode', data.maxPowerInConstPowerACmode);
    mainUtils.setHtmlText('sgscD-minPowerInConstPowerACmode', data.minPowerInConstPowerACmode);
    mainUtils.setHtmlText('sgscD-maxFreqInIndependentInverterState', data.maxFreqInIndependentInverterState);
    mainUtils.setHtmlText('sgscD-minFreqInIndependentInverterState', data.minFreqInIndependentInverterState);
    mainUtils.setHtmlText('sgscD-maxVoltInIndependentInverterState', data.maxVoltInIndependentInverterState);
    mainUtils.setHtmlText('sgscD-minVoltInIndependentInverterState', data.minVoltInIndependentInverterState);
    mainUtils.setHtmlText('sgscD-maxPowerFactor', data.maxPowerFactor);
    mainUtils.setHtmlText('sgscD-minPowerFactor', data.minPowerFactor);
    mainUtils.setHtmlText('sgscD-maxReactivePowerPercentage', data.maxReactivePowerPercentage);
    mainUtils.setHtmlText('sgscD-minReactivePowerPercentage', data.minReactivePowerPercentage);
    
    if (sgsc.modelName === sgsc.models.SC1000) {
        mainUtils.setHtmlText('sgscD-maxChargeFullVoltage', data.maxChargeFullVoltage);
        mainUtils.setHtmlText('sgscD-minChargeFullVoltage', data.minChargeFullVoltage);
        mainUtils.setHtmlText('sgscD-maxDischargeEmptyVoltage', data.maxDischargeEmptyVoltage);
        mainUtils.setHtmlText('sgscD-minDischargeEmptyVoltage', data.minDischargeEmptyVoltage);
        mainUtils.setHtmlText('sgscD-maxChargeFullRecoverVoltage', data.maxChargeFullRecoverVoltage);
        mainUtils.setHtmlText('sgscD-minChargeFullRecoverVoltage', data.minChargeFullRecoverVoltage);
        mainUtils.setHtmlText('sgscD-maxDischargeEmptyRecoverVoltage', data.maxDischargeEmptyRecoverVoltage);
        mainUtils.setHtmlText('sgscD-minDischargeEmptyRecoverVoltage', data.minDischargeEmptyRecoverVoltage);
    }

    mainUtils.setHtmlText('sgscD-chargeTimes', data.chargeTimes);
    mainUtils.setHtmlText('sgscD-dischargeTimes', data.dischargeTimes);
    mainUtils.setHtmlText('sgscD-gridOffGridMode', sgscst.getGridOffGridMode(data.gridOffGridMode));
    mainUtils.setHtmlText('sgscD-activePassiveMode', sgscst.getActivePassiveMode(data.activePassiveMode));
    mainUtils.setHtmlText('sgscD-offGridMasterSlaveFlag', sgscst.getOffGridMasterSlaveFlag(data.offGridMasterSlaveFlag));
    
    if ([sgsc.models.SC500TL, sgsc.models.SC500TL_V21, sgsc.models.SC500TL_V23, sgsc.models.SC500TL_V25, sgsc.models.SC1000].includes(sgsc.modelName)) {
        mainUtils.setHtmlText('sgscD-positiveGroundResistance', data.positiveGroundResistance);
        mainUtils.setHtmlText('sgscD-negativeGroundResistance', data.negativeGroundResistance);
    }
    
    if ([sgsc.models.SC500TL, sgsc.models.SC500TL_V21, sgsc.models.SC500TL_V23, sgsc.models.SC500TL_V25].includes(sgsc.modelName)) {
        mainUtils.setHtmlText('sgscD-lowInsulationResistance', sgscst.getLowInsulationResistance(data.lowInsulationResistance));
    }
    
    if (sgsc.models.SC1000 === sgsc.modelName) {
        mainUtils.setHtmlText('sgscD-moduleA3Temperature', data.moduleA3Temperature);
        mainUtils.setHtmlText('sgscD-moduleB3Temperature', data.moduleB3Temperature);
        mainUtils.setHtmlText('sgscD-moduleC3Temperature', data.moduleC3Temperature);
    }
    
    if (sgsc.models.SC500TL_V25 === sgsc.modelName) {
        mainUtils.setHtmlText('sgscD-carrierWaveSyncMasterSlave', sgscst.getCarrierWaveSyncMasterSlave(data.carrierWaveSyncMasterSlave));
    }
    
    mainUtils.setHtmlText('sgscD-deviceState', sgscst.getDeviceState(data.deviceState));
    mainUtils.setHtmlText('sgscD-faultState1', sgscst.getFaultState1(data.faultState1));
    mainUtils.setHtmlText('sgscD-faultState2', sgscst.getFaultState2(data.faultState2));
    
    if (sgsc.models.SC1000 === sgsc.modelName) {
        mainUtils.setHtmlText('sgscD-alarmState', sgscst.getAlarmState(data.alarmState));
    }
};

sgsc.createInfo = function (container) {
    let infoPanel = hh.createActDataPanelCard("General Info");
    addField(infoPanel, 'Device Name:', "N/A", 'sgscP-deviceName');
    addField(infoPanel, 'Installed Date:', "N/A", 'sgscP-installedDate');
    addField(infoPanel, 'Serial Number:', "N/A", 'sgscP-serialNumber');
    addField(infoPanel, 'IP Address:', "N/A", 'sgscP-ipAddress');
    addField(infoPanel, 'Model Name:', "N/A", 'sgscP-modelName');
    addField(infoPanel, 'Firmware Version:', "N/A", 'sgscP-firmwareVer');
    addField(infoPanel, 'Coms FW Version:', "N/A", 'sgscP-comsFwVer');
    addField(infoPanel, 'Safety Type:', "N/A", 'sgscP-safetyType');
    container.appendChild(infoPanel);
};

sgsc.updateParam = function (dev, param) {
    dev.paramLoaded = true;
    sgsc.modelName = param.modelName || '';
    mainUtils.setHtmlText('sgscP-deviceName', dev.deviceName);
    mainUtils.setHtmlText('sgscP-installedDate', dev.installedDate);
    mainUtils.setHtmlText('sgscP-serialNumber', param.serialNumber);
    mainUtils.setHtmlText('sgscP-ipAddress', param.ipAddress);
    mainUtils.setHtmlText('sgscP-modelName', param.modelName);
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