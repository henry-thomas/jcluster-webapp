/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */

/* global hh, devManager, mainUtils */

function addField(panelContainer, title, value, valueClass, unit) {
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: title, value: value, valueClass: [valueClass], unit: (!unit ? "" : unit)}));
}

function addhtmlDataLine(panel, title, valueClass, unit) {
    panel.appendChild(hh.addItemToActDataPanelCard({title: title, value: "N/A", valueClass: [valueClass], unit: unit}));
}

function addHeader(panel, label) {
    let headerBlock = document.createElement('div');
    headerBlock.classList.add('header-block');
    let headerBlockContent = document.createElement('span');
    headerBlockContent.textContent = label;
    headerBlock.appendChild(headerBlockContent);
    panel.appendChild(headerBlock);
}

function createPhasePanel(heading, power) {
    let panel = hh.createActDataPanelCard(heading);
    addField(panel, 'Power:', "N/A", "slem-" + power + "-powerW", 'W');
    addField(panel, 'Apparent Power:', "N/A", "slem-" + power + "-apparentPowerVA", 'VA');
    addField(panel, 'Reactive Power:', "N/A", "slem-" + power + "-reactivePowerVAR", 'VAR');
    addField(panel, 'Voltage:', "N/A", "slem-" + power + "-voltageV", 'V');
    addField(panel, 'Current:', "N/A", "slem-" + power + "-currentA", 'A');
    addField(panel, 'Frequency:', "N/A", "slem-" + power + "-frequencyF", 'Hz');
    addField(panel, 'Power Factor:', "N/A", "slem-" + power + "-powerFactorCosF");
    addHeader(panel, 'Energy');
    addField(panel, 'Energy:', "N/A", "slem-" + power + "-energyWh", 'Wh');
    addField(panel, 'Apparent Energy:', "N/A", "slem-" + power + "-apparentEnergyVAh", 'VAh');
    addField(panel, 'Reactive Energy:', "N/A", "slem-" + power + "-reactiveEnergyVARh", 'VARh');

    return panel;
}

function populatePhasePanel(powerName, data) {
    if (data[powerName].available) {
        slem[powerName].style.display = 'flex';
        mainUtils.setHtmlText('slem-' + powerName + '-powerW', data[powerName].powerW.toFixed(2));
        mainUtils.setHtmlText('slem-' + powerName + '-apparentPowerVA', data[powerName].apparentPowerVA.toFixed(2));
        mainUtils.setHtmlText('slem-' + powerName + '-reactivePowerVAR', data[powerName].reactivePowerVAR.toFixed(2));
        mainUtils.setHtmlText('slem-' + powerName + '-voltageV', data[powerName].voltageV.toFixed(2));
        mainUtils.setHtmlText('slem-' + powerName + '-currentA', data[powerName].currentA.toFixed(2));
        mainUtils.setHtmlText('slem-' + powerName + '-frequencyF', data[powerName].frequencyF.toFixed(2));
        mainUtils.setHtmlText('slem-' + powerName + '-powerFactorCosF', data[powerName].powerFactorCosF.toFixed(2));
        mainUtils.setHtmlText('slem-' + powerName + '-energyWh', data[powerName].energyWh.toFixed(2));
        mainUtils.setHtmlText('slem-' + powerName + '-apparentEnergyVAh', data[powerName].apparentEnergyVAh.toFixed(2));
        mainUtils.setHtmlText('slem-' + powerName + '-reactiveEnergyVARh', data[powerName].reactiveEnergyVARh.toFixed(2));
    } else {
        slem[powerName].style.display = 'none';
    }
}


var slem = {
    lastUnitLoaded: null
};

slem.updatePhaPowerData = function (classPrefix, pI, pE) {

    mainUtils.setHtmlText(classPrefix + 'I' + 'apparentEnergyVAh', pI.apparentEnergyVAh / 1000, 2);
    mainUtils.setHtmlText(classPrefix + 'E' + 'apparentEnergyVAh', pE.apparentEnergyVAh / 1000, 2);
    mainUtils.setHtmlText(classPrefix + 'I' + 'reactiveEnergyVARh', pI.reactiveEnergyVARh / 1000, 2);
    mainUtils.setHtmlText(classPrefix + 'E' + 'reactiveEnergyVARh', pE.reactiveEnergyVARh / 1000, 2);
    mainUtils.setHtmlText(classPrefix + 'I' + 'energyWh', pI.energyWh / 1000, 2);
    mainUtils.setHtmlText(classPrefix + 'E' + 'energyWh', pE.energyWh / 1000, 2);

    mainUtils.setHtmlText(classPrefix + 'I' + 'powerName', pI.powerName);
    mainUtils.setHtmlText(classPrefix + 'E' + 'powerName', pE.powerName);

    mainUtils.setHtmlText(classPrefix + 'frequencyF', pE.frequencyF, 2);
    mainUtils.setHtmlText(classPrefix + 'voltageV', pE.voltageV, 2);
    mainUtils.setHtmlText(classPrefix + 'powerFactorCosF', pE.powerFactorCosF, 3);

    if (pI.powerW > 0) {
        mainUtils.setHtmlText(classPrefix + 'apparentPowerVA', pI.apparentPowerVA / 1000, 3);
        mainUtils.setHtmlText(classPrefix + 'powerW', pI.powerW / 1000, 3);
        mainUtils.setHtmlText(classPrefix + 'reactivePowerVAR', (pE.reactivePowerVAR / 1000) * -1, 3);
        mainUtils.setHtmlText(classPrefix + 'currentA', pI.currentA, 2);
    } else {
        mainUtils.setHtmlText(classPrefix + 'apparentPowerVA', (pE.apparentPowerVA / 1000) * -1, 3);
        mainUtils.setHtmlText(classPrefix + 'powerW', (pE.powerW / 1000) * -1, 2);
        mainUtils.setHtmlText(classPrefix + 'reactivePowerVAR', (pI.reactivePowerVAR / 1000), 3);
        mainUtils.setHtmlText(classPrefix + 'currentA', pE.currentA * -1, 3);
    }
};

slem.initHtmlInstantSummaryDataPanel = function (label, classPrefix, container) {
    let pn = hh.createActDataPanelCard("INSTANT VALUES " + label);
//    panelContainer.appendChild(hh.createActDataPanelHeaderElement("Balancing Information"));
    addhtmlDataLine(pn, 'Current:', classPrefix + "currentA", 'A');
    addhtmlDataLine(pn, 'Voltage:', classPrefix + "voltageV", 'V');
    addhtmlDataLine(pn, 'Frequency:', classPrefix + "frequencyF", 'Hz');
    addhtmlDataLine(pn, 'Power:', classPrefix + "powerW", 'kW');
    addhtmlDataLine(pn, 'Apparent Power:', classPrefix + "apparentPowerVA", 'kVA');
    addhtmlDataLine(pn, 'Reactive Power:', classPrefix + "reactivePowerVAR", 'kVAR');
    addhtmlDataLine(pn, 'Power Factor:', classPrefix + "powerFactorCosF", 'cosF');
    addhtmlDataLine(pn, 'Power Name Import:', classPrefix + "IpowerName", '');
    addhtmlDataLine(pn, 'Power Name Export:', classPrefix + "EpowerName", '');

//    document.getElementById("cGavazi-1ph-actData").appendChild(pn);
    container.appendChild(pn);
};

slem.initHtmlInstantSummaryEnergyPanel = function (label, classPrefix, container) {
    let pn = hh.createActDataPanelCard("ENERGY EXPORT " + label);
    addhtmlDataLine(pn, 'Energy Export:', classPrefix + "EenergyWh", 'A');
    addhtmlDataLine(pn, 'Apparent Energy Export:', classPrefix + "EapparentEnergyVAh", 'kWh');
    addhtmlDataLine(pn, 'Reactive Energy Export:', classPrefix + "EreactiveEnergyVARh", 'kWh');

    pn.appendChild(hh.createActDataPanelHeaderElement("ENERGY IMPORT " + label));
    addhtmlDataLine(pn, 'Energy Import:', classPrefix + "IenergyWh", 'kWh');
    addhtmlDataLine(pn, 'Apparent Energy Import:', classPrefix + "IapparentEnergyVAh", 'kWh');
    addhtmlDataLine(pn, 'Reactive Energy Import:', classPrefix + "IreactiveEnergyVARh", 'kWh');

    container.appendChild(pn);
};


slem.updateData = function (dev, data) {
    if (!data) {
        console.log('SolarLog Energy Meter. No valid data received');
        return;
    }

//    classPrefix, pI, pE
    slem.updatePhaPowerData("slemP1Data-", data.pha1ImportPower, data.pha1ExportPower);
    slem.updatePhaPowerData("slemP2Data-", data.pha2ImportPower, data.pha2ExportPower);
    slem.updatePhaPowerData("slemP3Data-", data.pha3ImportPower, data.pha3ExportPower);
    slem.updatePhaPowerData("slemSumData-", data.sumImportPower, data.sumExportPower);

};

slem.createInfo = function (container) {
    let generalPanel = hh.createActDataPanelCard('General Info');
    addField(generalPanel, 'Serial Number:', "N/A", 'slem-gen-serialNumber');
    addField(generalPanel, 'Rated Amps:', "N/A", 'slem-gen-meterAmps');
    addField(generalPanel, 'Meter Type:', "N/A", 'slem-gen-meterType');
    addField(generalPanel, 'COM Port:', "N/A", 'slem-gen-comPort');
    addField(generalPanel, 'Installation Date:', "N/A", 'slem-gen-installedDate');

    container.appendChild(generalPanel);
};

slem.updateInfo = function (sDev) {
    if (!sDev) {
        console.log('SolarLog Energy Meter. No valid params received');
        return;
    }

    mainUtils.setHtmlText('slem-gen-serialNumber', sDev.serialNumber);
    mainUtils.setHtmlText('slem-gen-meterAmps', sDev.param.meterAmps);
    mainUtils.setHtmlText('slem-gen-meterType', sDev.param.meterType);
    mainUtils.setHtmlText('slem-gen-comPort', sDev.param.comPort);
    mainUtils.setHtmlText('slem-gen-installedDate', sDev.installedDate);

};

devManager.onSelectedDataReceived(slem.updateData);
devManager.onSelectedParamInit(slem.updateParam);

devManager.onSelectedChange(function (sDev) {
    slem.lastUnitLoaded = null;
    if (sDev.connected) {
        slem.updateData(sDev, sDev.getData());
    } else {
        mainUtils.setHtmlText('dataValues', 'N/A');
    }
});

devManager.onParamReceived(function (sDev, param) {
    slem.updateInfo(sDev);
});

devManager.onSelectedStatusChange(function (sDev, status) {
    slem.lastUnitLoaded = null;
    if (status) {
        slem.updateData(sDev, sDev.getData());
        slem.updateInfo(sDev);
    } else {
        mainUtils.setHtmlText('dataValues', 'N/A');
    }
});

slem.init = function () {
//    slem.createActualData(document.getElementById("slem-3ph-actData"));
    slem.createInfo(document.getElementById("slem-info"));

    let summaryPanel = document.getElementById("slem-total-actData");
//    slem.initHtmlParamPanel(summaryPanel);
    slem.initHtmlInstantSummaryDataPanel("TOTAL", "slemSumData-", summaryPanel);
    slem.initHtmlInstantSummaryEnergyPanel("TOTAL", 'slemSumData-', summaryPanel);

    let multiPhasePanel = document.getElementById("slem-3ph-actData");
    slem.initHtmlInstantSummaryDataPanel("Pha1", "slemP1Data-", multiPhasePanel);
    slem.initHtmlInstantSummaryEnergyPanel("Pha1", 'slemP1Data-', multiPhasePanel);
    slem.initHtmlInstantSummaryDataPanel("Pha2", "slemP2Data-", multiPhasePanel);
    slem.initHtmlInstantSummaryEnergyPanel("Pha2", 'slemP2Data-', multiPhasePanel);
    slem.initHtmlInstantSummaryDataPanel("Pha3", "slemP3Data-", multiPhasePanel);
    slem.initHtmlInstantSummaryEnergyPanel("Pha3", 'slemP3Data-', multiPhasePanel);

};

$(document).ready(function () {
    slem.init();
});
