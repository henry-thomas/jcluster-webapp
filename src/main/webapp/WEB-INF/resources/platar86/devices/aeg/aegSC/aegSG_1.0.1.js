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

/* global aegScGui, dm, mainUtils, aegScWebCont */

var aegSc = {};

//aegSc.init = function () {
//let container
//}

aegSc.dataPanels = aegScWebCont.main.tabPanel["Actual Data"].div.div;
aegSc.updateData = function (subdev, data) {
    let param = subdev.param;
    //DEVICE INFORMATION
    //general info
    switch (param.converterOnOff) {
        case 0:
            mainUtils.setHtmlText('aegSc-invOnOff', 'Idle', 2);
            break;
        case 1:
            mainUtils.setHtmlText('aegSc-invOnOff', 'On', 2);
            break;
        case 2:
            mainUtils.setHtmlText('aegSc-invOnOff', 'Off', 2);
            break;
        case 3:
            mainUtils.setHtmlText('aegSc-invOnOff', 'Initial Charging', 2);
            break;
        default:
            mainUtils.setHtmlText('aegSc-invOnOff', 'NA', 2);

    }

    // This function converts the units Wh to kWh to mWh depending on the value. 
    //  function(convert){
    //   if (dm.getSelected().data ){

    //  } else{

    //  }
    // };
    //    if (data) {
    let eff;
    if (data.chargePower.powerW > 0) {
        let gridIm = data.gridImport.powerW;
        let charge = data.chargePower.powerW;
        eff = (gridIm - charge) / gridIm * 100;
        //            aegScGui.dataPanelMap['Discharge Power'].style.display = 'none';
        //            aegScGui.dataPanelMap['Grid Export Power'].style.display = 'none';
        //            aegScGui.dataPanelMap['Charge Power'].style.display = 'block';
        //            aegScGui.dataPanelMap['Grid Import Power'].style.display = 'block';
    } else if (data.dischargePower.powerW > 0) {
        let gridEx = data.gridExport.powerW;
        let discharge = data.dischargePower.powerW;
        eff = (discharge - gridEx) / discharge * 100;
        //            aegScGui.dataPanelMap['Discharge Power'].style.display = 'block';
        //            aegScGui.dataPanelMap['Grid Export Power'].style.display = 'block';
        //            aegScGui.dataPanelMap['Charge Power'].style.display = 'none';
        //            aegScGui.dataPanelMap['Grid Import Power'].style.display = 'none';
    } else {
        mainUtils.setHtmlText('aegSc-gecCalc', 'N/A', 2);
    }





    mainUtils.setHtmlText('aegSc-gecCalc', eff, 2);

    mainUtils.setHtmlText('aegSc-deviceID', data.chargePower.deviceID, 2);
    mainUtils.setHtmlText('aegSc-realTime', data.realTime, 2); //Display and input data
    mainUtils.setHtmlText('aegSc-serialNumber', data.chargePower.serialNumber, 2);
    mainUtils.setHtmlText('aegSc-offlineDevices', data.chargePower.offlineDevices, 2);
    mainUtils.setHtmlText('aegSc-onlineDevices', data.chargePower.onlineDevices, 2);
    mainUtils.setHtmlText('aegSc-lastUpdate', data.chargePower.lastUpdate, 2);
    //ACTUAL DATA
    if (data.dischargePower.powerW > 0) {
        //Discharge power
        mainUtils.setHtmlText('aegScDc-powerW', -data.dischargePower.powerW / 1000, 2);
        mainUtils.setHtmlText('aegScDc-voltageV', data.dischargePower.voltageV, 2);
        mainUtils.setHtmlText('aegScDc-currentA', -data.dischargePower.currentA, 2);
        mainUtils.setHtmlText('aegScDc-ratedPowerW', data.dischargePower.ratedPowerW / 1000, 2);
    } else if (data.chargePower.powerW >= 0) {
        //Charge power
        mainUtils.setHtmlText('aegScDc-powerW', data.chargePower.powerW / 1000, 2);
        mainUtils.setHtmlText('aegScDc-currentA', data.chargePower.currentA, 2);
        mainUtils.setHtmlText('aegScDc-voltageV', data.chargePower.voltageV, 2);
        mainUtils.setHtmlText('aegScDc-ratedPowerW', data.chargePower.ratedPowerW / 1000, 2);
    }


    mainUtils.setHtmlText('aegSc-gridVoltL1L2', data.gridImport.gridVoltL1L2, 2);
    mainUtils.setHtmlText('aegSc-gridVoltL2L3', data.gridImport.gridVoltL2L3, 2);
    mainUtils.setHtmlText('aegSc-gridVoltL3L1', data.gridImport.gridVoltL3L1, 2);

    mainUtils.setHtmlText('aegSc-gridFreq1MaxTimeDelay', data.gridFreq1MaxTimeDelay, 2);
    mainUtils.setHtmlText('aegSc-gridFreq1MinTimeDelay', data.gridFreq1MinTimeDelay, 2);
    mainUtils.setHtmlText('aegSc-gridFreq2MaxTimeDelay', data.gridFreq2MaxTimeDelay, 2);
    mainUtils.setHtmlText('aegSc-gridFreq2MinTimeDelay', data.gridFreq2MinTimeDelay, 2);
    mainUtils.setHtmlText('aegSc-gridFreqSetPoint1Max', data.gridFreqSetPoint1Max, 2);
    mainUtils.setHtmlText('aegSc-gridFreqSetPoint1Min', data.gridFreqSetPoint1Min, 2);
    mainUtils.setHtmlText('aegSc-gridFreqSetPoint2Max', data.gridFreqSetPoint2Max, 2);
    mainUtils.setHtmlText('aegSc-gridFreqSetPoint2Min', data.gridFreqSetPoint2Min, 2);
    mainUtils.setHtmlText('aegSc-gridVolt1MaxTimeDelay', data.gridVolt1MaxTimeDelay, 2);
    mainUtils.setHtmlText('aegSc-gridVolt1MinTimeDelay', data.gridVolt1MinTimeDelay, 2);
    mainUtils.setHtmlText('aegSc-gridVolt2MaxTimeDelay', data.gridVolt2MaxTimeDelay, 2);
    mainUtils.setHtmlText('aegSc-gridVolt2MinTimeDelay', data.gridVolt2MinTimeDelay, 2);
    mainUtils.setHtmlText('aegSc-gridVolt3MaxTimeDelay', data.gridVolt3MaxTimeDelay, 2);
    mainUtils.setHtmlText('aegSc-gridVolt3MinTimeDelay', data.gridVolt3MinTimeDelay, 2);
    mainUtils.setHtmlText('aegSc-gridVoltSetPoint1Max', data.gridVoltSetPoint1Max, 2);
    mainUtils.setHtmlText('aegSc-gridVoltSetPoint1Min', data.gridVoltSetPoint1Min, 2);
    mainUtils.setHtmlText('aegSc-gridVoltSetPoint2Max', data.gridVoltSetPoint2Max, 2);
    mainUtils.setHtmlText('aegSc-gridVoltSetPoint2Min', data.gridVoltSetPoint2Min, 2);
    mainUtils.setHtmlText('aegSc-gridVoltSetPoint3Max', data.gridVoltSetPoint3Max, 2);
    mainUtils.setHtmlText('aegSc-gridVoltSetPoint3Min', data.gridVoltSetPoint3Min, 2);

    mainUtils.setHtmlText('aegSc-available', data.chargePower.available, 2);
    mainUtils.setHtmlText('aegSc-energyWh', data.chargePower.energyWh, 2);
    mainUtils.setHtmlText('aegSc-dailyEnergyWh', data.chargePower.dailyEnergyWh, 2);
    mainUtils.setHtmlText('aegSc-weeklyEnergyWh', data.chargePower.weeklyEnergyWh, 2);
    mainUtils.setHtmlText('aegSc-monthlyEnergyWh', data.chargePower.monthlyEnergyWh, 2);
    mainUtils.setHtmlText('aegSc-yearlyEnergyWh', data.chargePower.yearlyEnergyWh, 2);
    mainUtils.setHtmlText('aegSc-totalEnergyProduced', data.totalEnergyProduced, 2);

    mainUtils.setHtmlText('aegScD-energyWh', data.dischargePower.energyWh, 2);
    mainUtils.setHtmlText('aegScD-dailyEnergyWh', data.dischargePower.dailyEnergyWh, 2);
    mainUtils.setHtmlText('aegScD-weeklyEnergyWh', data.dischargePower.weeklyEnergyWh, 2);
    mainUtils.setHtmlText('aegScD-monthlyEnergyWh', data.dischargePower.monthlyEnergyWh, 2);
    mainUtils.setHtmlText('aegScD-yearlyEnergyWh', data.dischargePower.yearlyEnergyWh, 2);
    mainUtils.setHtmlText('aegScD-totalEnergyConsumed', data.totalEnergyConsumed, 2);
    //        mainUtils.setHtmlText('aegScD-ratedPowerW', subdev.data.ratedPowerW / 1000);
    //        mainUtils.setHtmlText('aegSc-ratedPowerW', subdev.data.ratedPowerW / 1000);


    if (data.gridImport.powerW > 0) {
        //GRID IMPORT
        mainUtils.setHtmlText('aegSc-powerW', -data.gridImport.powerW / 1000, 2);
        mainUtils.setHtmlText('aegSc-conVoltL1L2', data.gridImport.conVoltL1L2, 2);
        mainUtils.setHtmlText('aegSc-conVoltL2L3', data.gridImport.conVoltL2L3, 2);
        mainUtils.setHtmlText('aegSc-conVoltL3L1', data.gridImport.conVoltL3L1, 2);
        mainUtils.setHtmlText('aegSc-conCurrentL1', -data.gridImport.conCurrentL1, 2);
        mainUtils.setHtmlText('aegSc-conCurrentL2', -data.gridImport.conCurrentL2, 2);
        mainUtils.setHtmlText('aegSc-conCurrentL3', -data.gridImport.conCurrentL3, 2);
        mainUtils.setHtmlText('aegSc-conReactivePower', -data.gridImport.conReactivePower / 1000, 2);
        mainUtils.setHtmlText('aegSc-conTruePower', -data.gridImport.conTruePower / 1000, 2);
        mainUtils.setHtmlText('aegSc-conApparentPower', -data.gridImport.conApparentPower / 1000, 2);
        mainUtils.setHtmlText('aegSc-cosPhi', data.gridImport.cosPhi, 2);
        mainUtils.setHtmlText('aegSc-gridFrequency', data.gridImport.gridFrequency, 2);
        mainUtils.setHtmlText('aegSc-powerStackInputTemp', data.gridImport.powerStackInputTemp, 2);
    } else if (data.gridExport.powerW >= 0) {
        //GRID EXPORT
        mainUtils.setHtmlText('aegSc-powerW', data.gridExport.powerW / 1000, 2);
        mainUtils.setHtmlText('aegSc-conVoltL1L2', data.gridExport.conVoltL1L2, 2);
        mainUtils.setHtmlText('aegSc-conVoltL2L3', data.gridExport.conVoltL2L3, 2);
        mainUtils.setHtmlText('aegSc-conVoltL3L1', data.gridExport.conVoltL3L1, 2);
        mainUtils.setHtmlText('aegSc-conCurrentL1', data.gridExport.conCurrentL1, 2);
        mainUtils.setHtmlText('aegSc-conCurrentL2', data.gridExport.conCurrentL2, 2);
        mainUtils.setHtmlText('aegSc-conCurrentL3', data.gridExport.conCurrentL3, 2);
        mainUtils.setHtmlText('aegSc-conReactivePower', data.gridExport.conReactivePower / 1000, 2);
        mainUtils.setHtmlText('aegSc-conTruePower', data.gridExport.conTruePower / 1000, 2);
        mainUtils.setHtmlText('aegSc-conApparentPower', data.gridExport.conApparentPower / 1000, 2);
        mainUtils.setHtmlText('aegSc-cosPhi', data.gridExport.cosPhi, 2);
        mainUtils.setHtmlText('aegSc-gridFrequency', data.gridExport.gridFrequency, 2);
        mainUtils.setHtmlText('aegSc-powerStackInputTemp', data.gridExport.powerStackInputTemp, 2);
    }



    //    }

};
aegSc.updateInfo = function (subdev) {
    let param = subdev[subdev.paramName] || {};
    mainUtils.setHtmlText('aegScD-manufacturer', subdev.manufacturer);
    mainUtils.setHtmlText('aegScD-converterType', param.convDeviceType);
    mainUtils.setHtmlText('aegScD-serialNumber', subdev.serialNumber);
    mainUtils.setHtmlText('aegScD-installedDate', subdev.installedDate);
    mainUtils.setHtmlText('aegScD-ratedChargePowerW', ((param.ratedChargePower - (param.ratedChargePower % 1000)) / 1000), 0);
    mainUtils.setHtmlText('aegScD-ratedDischargePowerW', ((param.ratedDischargePower - (param.ratedDischargePower % 1000)) / 1000), 0);
    mainUtils.setHtmlText('aegScD-fwVersionConverterController', param.fwVersionConverterController);
    mainUtils.setHtmlText('aegScD-fwVersionConverterFpga', param.fwVersionConverterFpga);
    mainUtils.setHtmlText('aegScD-fwVersionConverterMcInterface', param.fwVersionMcInterface);
    mainUtils.setHtmlText('aegScD-deviceName', subdev.deviceName);
    mainUtils.setHtmlText('aegScD-ipAddress', param.ipAddress);
};


aegSc.onSelectedChanged = function (dev) {
    //    debugger;
    let param = dev[dev.paramName] || {};
    //    let ratedDisch = document.querySelector('.aegScD-ratedDischargePowerW');
    //    let dischPowerInfo = aegScWebCont.main.tabPanel["Actual Data"].div.accordian["Discharge Power"];
    //    let dischEnergyInfo = aegScWebCont.main.tabPanel["Actual Data"].div.accordian["Discharge Energy"];
    if (param.type === "SC") {

    } else {

    }
    aegSc.updateInfo(dev);
    aegSc.updateData(dev, dev.data);
    //    if(dev.)
};


//aegSc.dialog = function () {
//
//    aegSc.dialog = new SMDUIDialog({
//        heading: 'Add Device',
//        draggable: true,
//
//        onInitComplete: function (contentDiv, footerDiv, comp) {
//
//            let table = new SMDUITable(contentDiv, {
//                heading: "heading ex",
//                columns: ["col1", "col2"],
//                data: [{col1: "value", col2: "value"}, {col1: "value", col2: "value", col3: "value"}]
//
//            });
//            return table;
//        }
//    });
//};


$(document).ready(function () {

    dm.onSelectedDataReceived(aegSc.updateData);
    dm.onSelectedChange(aegSc.onSelectedChanged);
    dm.onSelectedStatusChange(aegSc.onSelectedChanged);
    aegScGui.populateTempParam();
   // aegSc.dialog();
//    aegSc.dialog1();
   // aegSc.dialog.open();
//    aegSc.dialog1.open();
});


