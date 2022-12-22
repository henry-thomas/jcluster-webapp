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
/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, fetch, hh, panelContainer */


var cGavazi = {
    panel: {}
};



cGavazi.updatePhaPowerData = function (classPrefix, pI, pE) {

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

    if (pI.currentA > 0) {
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

cGavazi.updateData = function (dev, data) {

    mainUtils.setHtmlText('uixSmaEm_powerDemandPeek', data.powerDemandPeek / 1000, 2);
    mainUtils.setHtmlText('uixSmaEm_powerDemand', data.powerDemand / 1000, 2);

    cGavazi.updatePhaPowerData('cGavaziTData-', data.importPowerTotal, data.exportPowerTotal);

//    cGavaziP1Data
    if (data.exportPowerPh1 !== null && data.exportPowerPh1 !== undefined) {

        cGavazi.updatePhaPowerData('cGavaziP1Data-', data.importPowerPh1, data.exportPowerPh1);
        cGavazi.updatePhaPowerData('cGavaziP2Data-', data.importPowerPh2, data.exportPowerPh2);
        cGavazi.updatePhaPowerData('cGavaziP3Data-', data.importPowerPh3, data.exportPowerPh3);
    }
};

cGavazi.resetPower = function () {
    devManager.executeInstr('resetPower', 1, 0);
};
cGavazi.resetEnergy = function () {
    devManager.executeInstr('resetEnergy', 1, 0);
};

function addhtmlDataLine(panel, title, valueClass, unit) {
    panel.appendChild(hh.addItemToActDataPanelCard({title: title, value: "N/A", valueClass: [valueClass], unit: unit}));
}

cGavazi.initHtmlParamPanel = function (summaryPanel) {
    let panelContainer = hh.createActDataPanelCard("Meter Info");
//    panelContainer.appendChild(hh.createActDataPanelHeaderElement("Balancing Information"));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Serial Number:', value: "N/A", valueClass: ["cGavData-serialNumber"]}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Model:', value: "N/A", valueClass: ["cGavData-modelName"]}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Firmware:', value: "N/A", valueClass: ["cGavData-firmware"]}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Revision:', value: "N/A", valueClass: ["cGavData-revision"]}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Installation Date:', value: "N/A", valueClass: ["cGavData-installedDate"]}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Com Port:', value: "N/A", valueClass: ["cGavData-comPort"]}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Modbus Address:', value: "N/A", valueClass: ["cGavData-modbusAddress"]}));

    summaryPanel.appendChild(panelContainer);
};

cGavazi.initHtmlInstantSummaryDataPanel = function (label, classPrefix, container) {
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
    addhtmlDataLine(pn, 'Power Demand:', classPrefix + "powerDemand", 'kW');
    addhtmlDataLine(pn, 'Power Demand Peek:', classPrefix + "powerDemandPeek", 'kW');

//    document.getElementById("cGavazi-1ph-actData").appendChild(pn);
    container.appendChild(pn);
};

cGavazi.initHtmlInstantSummaryEnergyPanel = function (label, classPrefix, container) {
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

cGavazi.updateParam = function (dev, param) {

    mainUtils.setHtmlText('cGavData-serialNumber', param.serialNumber);
    mainUtils.setHtmlText('cGavData-modelName', param.modelName);
    mainUtils.setHtmlText('cGavData-firmware', param.firmware);
    mainUtils.setHtmlText('cGavData-revision', param.revision);
    mainUtils.setHtmlText('cGavData-installedDate', dev.installedDate);
    mainUtils.setHtmlText('cGavData-comPort', param.comPort);
    mainUtils.setHtmlText('cGavData-modbusAddress', param.modbusAddress);

//    if (param.paramMap === null) {
//        return;
//    }
//
//    if (param.paramMap[1] !== undefined && param.paramMap[1].fixBlock !== undefined) {
//        for (var item in  param.paramMap[1].fixBlock) {
//            let i = param.paramMap[1].fixBlock[item];
//            mainUtils.setHtmlText("uixp-" + item, i);
//        }
//        console.log(param.paramMap[1]);
//    }

};

devManager.onSelectedDataReceived(cGavazi.updateData);
devManager.onSelectedParamInit(cGavazi.updateParam);
devManager.onSelectedChange(function (sDev) {
    if (sDev.connected) {
        cGavazi.updateParam(sDev, sDev.getParam());
        cGavazi.updateData(sDev, sDev.getData());
    } else {
        mainUtils.setHtmlText('dataValues', 'N/A');
    }
//    console.log(arguments);
});
devManager.onParamReceived(function (sDev, param) {
    for (var model in param.paramMap) {
//        console.log("request Param", param);
        if (cGavazi.smdx[model] === undefined) {
            cGavazi.fetchSunSpecDef(model);
        }
    }
});

devManager.onSelectedStatusChange(function (sDev) {
    if (sDev.connected) {
        cGavazi.updateData(sDev, sDev.getData());
    } else {
        mainUtils.setHtmlText('dataValues', 'N/A');
    }
});

document.addEventListener("DOMContentLoaded", function (event) {
    let summaryPanel = document.getElementById("cGavazi-total-actData");
    cGavazi.initHtmlParamPanel(summaryPanel);
    cGavazi.initHtmlInstantSummaryDataPanel("TOTAL", "cGavaziTData-", summaryPanel);
    cGavazi.initHtmlInstantSummaryEnergyPanel("TOTAL", 'cGavaziTData-', summaryPanel);

    let multiPhasePanel = document.getElementById("cGavazi-3ph-actData");
    cGavazi.initHtmlInstantSummaryDataPanel("Pha1", "cGavaziP1Data-", multiPhasePanel);
    cGavazi.initHtmlInstantSummaryEnergyPanel("Pha1", 'cGavaziP1Data-', multiPhasePanel);
    cGavazi.initHtmlInstantSummaryDataPanel("Pha2", "cGavaziP2Data-", multiPhasePanel);
    cGavazi.initHtmlInstantSummaryEnergyPanel("Pha2", 'cGavaziP2Data-', multiPhasePanel);
    cGavazi.initHtmlInstantSummaryDataPanel("Pha3", "cGavaziP3Data-", multiPhasePanel);
    cGavazi.initHtmlInstantSummaryEnergyPanel("Pha3", 'cGavaziP3Data-', multiPhasePanel);

//    let PhaseEnergyPanel = document.getElementById("cGavazi-3ph-actData");
});