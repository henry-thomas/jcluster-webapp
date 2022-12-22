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

/* global mainUtils, hh */

var psc = {
    powerPopulatedInit: false,
    powerPopulated: {}
};


psManager.onDataReceived(function (data) {
    for (var powerName in psManager.powerList) {
        let p = psManager.powerList[powerName];
        if (psc.powerPopulated[powerName] === undefined) {
            psc.createAndePopulateDevPower(p, powerName);
            psc.powerPopulated[powerName] = p;
        }
        psc.cupdateDevPower(p, powerName);
    }

});

psc.cupdateDevPower = function (p, powerName) {
    mainUtils.setHtmlText("uixp_psc-" + powerName + "-available", p.available);
    mainUtils.setHtmlText("uixp_psc-" + powerName + "-calculated", p.calculated);
    for (var field in p.data) {
        mainUtils.setHtmlText("uixp_psc-" + powerName + "-" + field, p.data[field]);
    }
};

psc.createAndePopulateDevPower = function (p, powerName) {
    let container = document.querySelector('.uixSmdPs_actualPowerContainer');
    if (psc.powerPopulatedInit === false) {
        psc.powerPopulatedInit = true;
        hh.removeAllChilds(container);
    }


    let dataPanel = hh.createActDataPanelCard('Power [' + powerName + ']');
    container.appendChild(dataPanel);


    dataPanel.appendChild(hh.addItemToActDataPanelCard({
        title: "Power Available:",
        value: ' ',
        valueClass: ["uixp_psc-" + powerName + "-available"],
        unit: " "
    }));

    dataPanel.appendChild(hh.addItemToActDataPanelCard({
        title: "Calculated:",
        value: ' ',
        valueClass: ["uixp_psc-" + powerName + "-calculated"],
        unit: " "
    }));
    dataPanel.appendChild(hh.addItemToActDataPanelCard({
        title: "Power Name:",
        value: ' ',
        valueClass: ["uixp_psc-" + powerName + "-powerName"],
        unit: " "
    }));
    dataPanel.appendChild(hh.addItemToActDataPanelCard({
        title: "Current:",
        value: ' ',
        valueClass: ["uixp_psc-" + powerName + "-currentA"],
        unit: "A"
    }));
    dataPanel.appendChild(hh.addItemToActDataPanelCard({
        title: "Voltage:",
        value: ' ',
        valueClass: ["uixp_psc-" + powerName + "-voltageV"],
        unit: "V"
    }));
    dataPanel.appendChild(hh.addItemToActDataPanelCard({
        title: "Power:",
        value: ' ',
        valueClass: ["uixp_psc-" + powerName + "-powerW"],
        unit: "W"
    }));
    dataPanel.appendChild(hh.createActDataPanelHeaderElement('Input Device Info'));
    dataPanel.appendChild(hh.addItemToActDataPanelCard({
        title: "Online Input Devices:",
        value: ' ',
        valueClass: ["uixp_psc-" + powerName + "-onlineDevices"],
        unit: ""
    }));
    dataPanel.appendChild(hh.addItemToActDataPanelCard({
        title: "Offline Input Devices:",
        value: ' ',
        valueClass: ["uixp_psc-" + powerName + "-offlineDevices"],
        unit: ""
    }));
    dataPanel.appendChild(hh.addItemToActDataPanelCard({
        title: "Logger Power Type:",
        value: ' ',
        valueClass: ["uixp_psc-" + powerName + "-powerType"],
        unit: ""
    }));
    dataPanel.appendChild(hh.createActDataPanelHeaderElement('Energy Counters'));
    dataPanel.appendChild(hh.addItemToActDataPanelCard({
        title: "Daily Energy:",
        value: ' ',
        valueClass: ["uixp_psc-" + powerName + "-dailyEnergyWh"],
        unit: "Wh"
    }));
    dataPanel.appendChild(hh.addItemToActDataPanelCard({
        title: "Weekly Energy:",
        value: ' ',
        valueClass: ["uixp_psc-" + powerName + "-weeklyEnergyWh"],
        unit: "Wh"
    }));
    dataPanel.appendChild(hh.addItemToActDataPanelCard({
        title: "Monthly Energy:",
        value: ' ',
        valueClass: ["uixp_psc-" + powerName + "-monthlyEnergyWh"],
        unit: "Wh"
    }));
    dataPanel.appendChild(hh.addItemToActDataPanelCard({
        title: "Yearly Energy:",
        value: ' ',
        valueClass: ["uixp_psc-" + powerName + "-yearlyEnergyWh"],
        unit: "Wh"
    }));
    dataPanel.appendChild(hh.addItemToActDataPanelCard({
        title: "Total Energy:",
        value: ' ',
        valueClass: ["uixp_psc-" + powerName + "-energyWh"],
        unit: "Wh"
    }));

};


