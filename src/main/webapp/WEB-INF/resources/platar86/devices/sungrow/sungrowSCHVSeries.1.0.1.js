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

/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, fetch, hh, wsm, mu, sgscst, SMDUIDataField */

function addField(panelContainer, title, value, valueClass, unit) {
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: title, value: value, valueClass: [valueClass], unit: (!unit ? "" : unit)}));
}

//function addPowerPanel(panelName, powerName) {
//  let panel = hh.createActDataPanelCard(panelName);

// Battery Dishcarge/Charge

//  addField(panel, 'Energy Today:', "N/A", 'ssgtD-' + powerName + '-dailyEnergyWh', 'kWh');
//  addField(panel, 'Energy This Week:', "N/A", 'ssgtD-' + powerName + '-weeklyEnergyWh', 'kWh');
//  addField(panel, 'Energy This Month:', "N/A", 'ssgtD-' + powerName + '-monthlyEnergyWh', 'kWh');
//  addField(panel, 'Energy This Year:', "N/A", 'ssgtD-' + powerName + '-yearlyEnergyWh', 'kWh');
//  addField(panel, 'Total Energy:', "N/A", 'ssgtD-' + powerName + '-energyWh', 'kWh');
// addField(panel, 'Daily running time:', "N/A", 'ssgtD-' + powerName + '-dailyRunningTimeMin', 'min');
// addField(panel, 'Total running time:', "N/A", 'ssgtD-' + powerName + '-totalRunningTimeH', 'h');
// addField(panel, 'Current limit value:', "N/A", 'ssgtD-' + powerName + '-currentLimitValueA', 'A');
// addField(panel, 'Cut-off voltage:', "N/A", 'ssgtD-' + powerName + '-cutOffVoltageV', 'V');
//  addField(panel, 'Cut-off SOC percentage:', "N/A", 'ssgtD-' + powerName + '-cutOffSOCPercentage', '%');
//  addField(panel, 'Accumulated Energy:', "N/A", 'ssgtD-' + powerName + '-accumulatedEnergyKWh', 'kWh');
//  return panel;
//}

var sgsc = {
    lastUnitLoaded: null
};

sgsc.createActualData = function (container) {

    // General Information    
    let generalInfoPnl = hh.createActDataPanelCard('General Information');
    sgsc.workingState = new SMDUIDataField(generalInfoPnl, {
        title: "Working State:"
    });
    sgsc.runningState = hh.adf(generalInfoPnl, "Running State:", "", {
        tooltip: 'This is a tooltip',
        datamap: {
            100: 'On-grid mode',
            101: 'On-grid constant current',
            102: 'On-grid constant voltage',
            103: 'On-grid constant power (AC)',
            104: 'On-grid constant power (DC)',
            200: 'Off-grid mode',
            300: 'VSG mode'
        }
    });
    sgsc.gridState = hh.adf(generalInfoPnl, "Grid State", "", {
        tooltip: 'Grid Statuse'
    });
    sgsc.dailyFeedInRunningTime = hh.adf(generalInfoPnl, "Daily feed-in running time:", "min", {
        formatter: function (val, df, unit) {
            return val.toFixed(2);
        }
    });
    sgsc.totalFeedInRunningTime = hh.adf(generalInfoPnl, 'Total feed-in running time:', "h", {
        formatter: function (val, df, unit) {
            df.unit = ' ' + unit;
            return val.toFixed();
        }
    });
    sgsc.arrayInsulationResistance = hh.adf(generalInfoPnl, "Array insulation resistance", "Ω", {
        sIPrefix: true,
        decimal: 3
    });
    sgsc.totalApparentPower = hh.adf(generalInfoPnl, "Total apparent power: ", "W");
    sgsc.emsControlPower = hh.adf(generalInfoPnl, "Ems Requested Power: ", "W", {sIPrefix: true, decimal: 1});

    // DC Information
    let dcInformationPnl = hh.createActDataPanelCard('DC Information');
    sgsc.dcState = hh.adf(dcInformationPnl, "Status: ", "", {
        datamap: {
            0: 'Charging',
            1: 'Discharging',
            2: 'Non-operational'
        }
    });
    sgsc.voltageV = hh.adf(dcInformationPnl, "DC Voltage: ", "V", {});
    sgsc.currentA = hh.adf(dcInformationPnl, "DC Current: ", "A", {});
    sgsc.powerkW = hh.adf(dcInformationPnl, "DC Power: ", "kW", {});

    // AC Information
    let acInformationPnl = hh.createActDataPanelCard('AC Information');

    sgsc.abLineVoltagePhaseAVoltage = hh.adf(acInformationPnl, "A-B line voltage/Phase A voltage: ", "V", {});
    sgsc.bcLineVoltagePhaseBVoltage = hh.adf(acInformationPnl, "B-C line voltage/Phase B voltage: ", "V", {});
    sgsc.caLineVoltagePhaseCVoltage = hh.adf(acInformationPnl, "C-A line voltage/Phase C voltage: ", "V", {});
    sgsc.phaseACurrent = hh.adf(acInformationPnl, "Phase A current: ", "A", {});
    sgsc.phaseBCurrent = hh.adf(acInformationPnl, "Phase B current: ", "A", {});
    sgsc.phaseCCurrent = hh.adf(acInformationPnl, "Phase C current: ", "A", {});
    sgsc.totalActivePower = hh.adf(acInformationPnl, "Total active power: ", "kW", {});
    sgsc.reactivePowerVar = hh.adf(acInformationPnl, "Reactive power: ", "kVar", {});
    sgsc.gridFrequency = hh.adf(acInformationPnl, "Grid frequency: ", "Hz", {});
    sgsc.totalPowerFactor = hh.adf(acInformationPnl, "Total power factor: ", "", {});

    // Powers Information
    let batChgPanel = createPowerPanelCharge('Battery Charge', 'batChg');

    let batDischgPanel = createPowerPanelCharge('Battery Discharge', 'batDischg');

    // Temperature Information
    let temperatureInfoPnl = hh.createActDataPanelCard('Temperature Information');

    sgsc.interiorTemperature = hh.adf(temperatureInfoPnl, "Interior temperature: ", "C", {});
    sgsc.highestCellTemperature = hh.adf(temperatureInfoPnl, "Highest cell temperature: ", "C", {});
    sgsc.lowestCellTemperature = hh.adf(temperatureInfoPnl, "Lowest cell temperature: ", "C", {});
    sgsc.averageContainerTemperature = hh.adf(temperatureInfoPnl, "Average container temperature: ", "C", {});

    // State Information
    let stateInfoPnl = hh.createActDataPanelCard('State Information');

    sgsc.alarmRunningState1 = hh.adf(stateInfoPnl, "Alarm running state 1: ", "", {});
    sgsc.alarmRunningState2 = hh.adf(stateInfoPnl, "Alarm running state 2: ", "", {});
    sgsc.faultState1 = hh.adf(stateInfoPnl, "Fault state 1: ", "", {});
    sgsc.faultState2 = hh.adf(stateInfoPnl, "Fault state 2: ", "", {});

    // Battery Information
    let batInfoPnl = hh.createActDataPanelCard('Battery Information');

    sgsc.batteryState = hh.adf(batInfoPnl, "Battery state: ", "", {});
    sgsc.batterySystemSOC = hh.adf(batInfoPnl, "Battery System SOC: ", "%", {});
    sgsc.batterySystemSOH = hh.adf(batInfoPnl, "Battery System SOH: ", "%", {});
    sgsc.batterySystemVoltage = hh.adf(batInfoPnl, "Battery System Voltage: ", "V", {});
    sgsc.batterySystemCurrent = hh.adf(batInfoPnl, "Battery System Current: ", "A", {});
    sgsc.maxCellVoltage = hh.adf(batInfoPnl, "Max. Cell Voltage: ", "V", {});
    sgsc.minCellVoltage = hh.adf(batInfoPnl, "Min. Cell Voltage: ", "V", {});

    // Battery Alarms
    let batAlarmsPnl = hh.createActDataPanelCard('Battery Alarms');

    sgsc.batteryState1 = hh.adf(batAlarmsPnl, "Battery state 1: ", "", {});
    sgsc.batteryState2 = hh.adf(batAlarmsPnl, "Battery state 2: ", "", {});
    sgsc.batteryAlarm1 = hh.adf(batAlarmsPnl, "Battery alarm 1: ", "", {});
    sgsc.batteryAlarm2 = hh.adf(batAlarmsPnl, "Battery alarm 2: ", "", {});
    sgsc.batteryAlarm3 = hh.adf(batAlarmsPnl, "Battery alarm 3: ", "", {});
    sgsc.batteryAlarm4 = hh.adf(batAlarmsPnl, "Battery alarm 4: ", "", {});
    sgsc.batteryFault1 = hh.adf(batAlarmsPnl, "Battery fault 1: ", "", {});
    sgsc.batteryFault2 = hh.adf(batAlarmsPnl, "Battery fault 2: ", "", {});
    sgsc.batteryFault3 = hh.adf(batAlarmsPnl, "Battery fault 3: ", "", {});
    sgsc.batteryFault4 = hh.adf(batAlarmsPnl, "Battery fault 4: ", "", {});

    container.appendChild(generalInfoPnl);
    container.appendChild(dcInformationPnl);
    container.appendChild(acInformationPnl);
    container.appendChild(temperatureInfoPnl);
    container.appendChild(batChgPanel);
    container.appendChild(batDischgPanel);
    container.appendChild(stateInfoPnl);
    container.appendChild(batInfoPnl);
    container.appendChild(batAlarmsPnl);



};

function createPowerPanelCharge(heading, powerName) {
    let panel = hh.createActDataPanelCard(heading, powerName);
    sgsc[powerName] = {};
    sgsc[powerName].dailyEnergyWh = hh.adf(panel, "Energy Today: ", "kWh", {});
    sgsc[powerName].weeklyEnergyWh = hh.adf(panel, "Energy This Week: ", "kWh", {});
    sgsc[powerName].monthlyEnergyWh = hh.adf(panel, "Energy This Month: ", "kWh", {});
    sgsc[powerName].yearlyEnergyWh = hh.adf(panel, "Energy This Year: ", "kWh", {});
    sgsc[powerName].energyWh = hh.adf(panel, "Total Energy: ", "kWh", {});
    sgsc[powerName].dailyRunningTimeMin = hh.adf(panel, "Daily running time: ", "min", {});
    sgsc[powerName].totalRunningTimeH = hh.adf(panel, "Total running time: ", "h", {});
    sgsc[powerName].currentLimitValueA = hh.adf(panel, "Current limit value: ", "A", {});
    sgsc[powerName].cutOffVoltageV = hh.adf(panel, "Cut-off voltage: ", "V", {});
    sgsc[powerName].cutOffSOCPercentage = hh.adf(panel, "Cut-off SOC percentage: ", "%", {});
    sgsc[powerName].accumulatedEnergyKWh = hh.adf(panel, "Accumulated Energy: ", "kWh", {});
    return panel;
}

sgsc.getData = function (data) {
    for (let d in data) {
        let dat = data[d];
        if (typeof dat !== 'object') {
            if (sgsc[d] instanceof SMDUIDataField)
                sgsc[d].value = data[d];
        } else {
            sgsc.getData(dat);
        }
    }
};

sgsc.updateData = function (dev, data) {
    if (!data) {
        console.log('Sungrow SC HV Series. No valid data received');
        return;
    }
    sgsc.getData(data);
    /*Maybe try loop through data*/
//    for (let d in data) {
//        let dat = data[d];
//        if (typeof dat !== 'object') {
//            if (sgsc[d] instanceof SMDUIDataField)
//                sgsc[d].value = data[d];
//        } else {
//
//        }
//    }

    let powerkW;
    if (data.batChg >= 0) {
        powerkW = data.batChg.powerW;
    } else {
        powerkW = -data.batChg.powerW;
    }
    
    let currentA;
    if (data.batChg <= 0) {
        currentA = data.batChg.currentA;
    } 
    
    if (data.batDischg >= 0){
        currentA = data.batDischg.currentA;
    }

    sgsc.dcState.value = data.batteryState;
    sgsc.currentA.value = currentA;
    sgsc.powerkW.value = powerkW;

    // Powers data
    populatePowerPanelCharge(data, 'batChg');

    populatePowerPanelCharge(data, 'batDischg');

    // Inverter Info
    sgsc.ratedActivePower.value = data.ratedActivePower;
    sgsc.ratedReactivePower.value = data.ratedReactivePower;

    // AC Information

    sgsc.abLineVoltagePhaseAVoltage.value = data.abLineVoltagePhaseAVoltage;
    sgsc.bcLineVoltagePhaseBVoltage.value = data.bcLineVoltagePhaseBVoltage;
    sgsc.caLineVoltagePhaseCVoltage.value = data.caLineVoltagePhaseCVoltage;
    sgsc.phaseACurrent.value = data.phaseACurrent;
    sgsc.phaseBCurrent.value = data.phaseBCurrent;
    sgsc.phaseCCurrent.value = data.phaseCCurrent;
    sgsc.totalActivePower.value = data.totalActivePower;
    sgsc.reactivePowerVar.value = data.reactivePowerVar;
    sgsc.gridFrequency.value = data.gridFrequency;
    sgsc.totalPowerFactor.value = data.totalPowerFactor;
    sgsc.interiorTemperature.value = data.interiorTemperature;
    sgsc.highestCellTemperature.value = data.highestCellTemperature;
    sgsc.lowestCellTemperature.value = data.lowestCellTemperature;
    sgsc.averageContainerTemperature.value = data.averageContainerTemperature;

    // State Information

    sgsc.alarmRunningState1.value = data.alarmRunningState1;
    sgsc.alarmRunningState2.value = data.alarmRunningState2;
    sgsc.faultState1.value = data.faultState1;
    sgsc.faultState2.value = data.faultState2;

    // Battery Information

    sgsc.batteryState.value = data.batteryState;
    sgsc.batterySystemSOC.value = data.batterySystemSOC;
    sgsc.batterySystemSOH.value = data.batterySystemSOH;
    sgsc.batterySystemVoltage.value = data.batterySystemVoltage;
    sgsc.batterySystemCurrent.value = data.batterySystemCurrent;
    sgsc.maxCellVoltage.value = data.maxCellVoltage;
    sgsc.minCellVoltage.value = data.minCellVoltage;

    // General Information

    sgsc.workingState.value = sgscst.getWorkingState(data.workingState);
    sgsc.runningState.value = data.runningState;
    sgsc.gridState.value = sgscst.getGridState(data.gridState);
    sgsc.dailyFeedInRunningTime.value = data.dailyFeedInRunningTime;
    sgsc.totalFeedInRunningTime.value = data.totalFeedInRunningTime;
    sgsc.arrayInsulationResistance.value = data.arrayInsulationResistance;
    sgsc.totalApparentPower.value = data.totalApparentPower;

    // Battery Alarms

    sgsc.batteryState1.value = data.batteryState1;
    sgsc.batteryState2.value = data.batteryState2;
    sgsc.batteryAlarm1.value = data.batteryAlarm1;
    sgsc.batteryAlarm2.value = data.batteryAlarm2;
    sgsc.batteryAlarm3.value = data.batteryAlarm3;
    sgsc.batteryAlarm4.value = data.batteryAlarm4;
    sgsc.batteryFault1.value = data.batteryFault1;
    sgsc.batteryFault2.value = data.batteryFault2;
    sgsc.batteryFault3.value = data.batteryFault3;
    sgsc.batteryFault4.value = data.batteryFault4;

    sgscAnim.updateBat(data.batterySystemSOC);

};
function populatePowerPanelCharge(data, chargePowerName) {
    sgsc[chargePowerName].dailyEnergyWh.value = data[chargePowerName].dailyEnergyWh;
    sgsc[chargePowerName].weeklyEnergyWh.value = data[chargePowerName].weeklyEnergyWh;
    sgsc[chargePowerName].monthlyEnergyWh.value = data[chargePowerName].monthlyEnergyWh;
    sgsc[chargePowerName].yearlyEnergyWh.value = data[chargePowerName].yearlyEnergyWh;
    sgsc[chargePowerName].energyWh.value = data[chargePowerName].energyWh;
    sgsc[chargePowerName].dailyRunningTimeMin.value = data[chargePowerName].dailyRunningTimeMin;
    sgsc[chargePowerName].totalRunningTimeH.value = data[chargePowerName].totalRunningTimeH;
    sgsc[chargePowerName].currentLimitValueA.value = data[chargePowerName].currentLimitValueA;
    sgsc[chargePowerName].cutOffVoltageV.value = data[chargePowerName].cutOffVoltageV;
    sgsc[chargePowerName].cutOffSOCPercentage.value = data[chargePowerName].cutOffSOCPercentage;
    sgsc[chargePowerName].accumulatedEnergyKWh.value = data[chargePowerName].accumulatedEnergyKWh;
}
;

// Inverter Info
// General Info


sgsc.createInfo = function (container) {
    let infoPanel = hh.createActDataPanelCard("General Info");

    sgsc.deviceName = hh.adf(infoPanel, "Device Name: ", "", {});
    sgsc.installedDate = hh.adf(infoPanel, "Installed Date: ", "", {});
    sgsc.serialNumber = hh.adf(infoPanel, "Serial Number: ", "", {});
    sgsc.ipAddress = hh.adf(infoPanel, "IP Address: ", "", {});
    sgsc.fwVer = hh.adf(infoPanel, "Firmware Version: ", "", {});
    sgsc.ratedActivePower = hh.adf(infoPanel, "Rated Active Power: ", "kW", {});
    sgsc.ratedReactivePower = hh.adf(infoPanel, "Rated Reactive Power: ", "kVar", {});
    sgsc.comsFwVer = hh.adf(infoPanel, "Coms FW Version: ", "", {});
    sgsc.safetyType = hh.adf(infoPanel, "Safety Type: ", "", {});


    container.appendChild(infoPanel);
};

// General Info

sgsc.updateParam = function (dev, param) {
    dev.paramLoaded = true;

    sgsc.deviceName.value = dev.deviceName;
    sgsc.installedDate.value = dev.installedDate;
    sgsc.serialNumber.value = param.serialNumber;
    sgsc.ipAddress.value = param.ipAddress;
    sgsc.fwVer.value = param.fwVer;
    sgsc.comsFwVer.value = param.comsFwVer;
    sgsc.safetyType.value = param.safetyType;
};


sgsc.onInstrSuccess = function (message, data) {
    mu.showInfoMessage(data, "Success");
};

sgsc.onInstrError = function (message, data) {
    mu.showErrprMessage(data, "Error");
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