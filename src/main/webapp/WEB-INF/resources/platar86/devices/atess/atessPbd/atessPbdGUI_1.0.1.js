/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2022
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */

/* global hh, this, wsm, pm */

(function (root) {
    function AtessPbdGUI(ext) {
        this.dataFields = {};
        this.generalInfo = {};
        this.advInfo = {};
        this.params = {};
        this.paramData = {};
        _init.call(this);
    }

    function _init() {
        this.mainTabPanel = new TabPanel(dgm.contentPanel, {
            menuItem: [
                {
                    label: "Device Info",
                    id: 'info'
                },
                {
                    label: "Live Data",
                    id: 'data'
                },
                {
                    label: "Settings",
                    id: 'settings'
                },
                
            ]
        });

        this.devInfo = this.mainTabPanel.getItemContentById('info');
        this.dataContent = this.mainTabPanel.getItemContentById('data');
//        this.advdataContent = this.mainTabPanel.getItemContentById('advdata');
        this.settingsContent = this.mainTabPanel.getItemContentById('settings');
        this.otherInfoContent = this.mainTabPanel.getItemContentById('otherInfo');
        
        pm.loadParamDescriptor(paramDesc, this.settingsContent);

//        this.dataContent.classList.add('actDataContainer');
        this.dataContent.classList.add('actDataContainer');
        this.devInfo.classList.add('actDataContainer');
//        this.otherInfoContent.classList.add('actDataContainer');
        _initGui.call(this);
    }




    function _initGui() {
        this.dataFields.batPower = {};
        this.dataFields.batDischargePower = {};
        this.dataFields.pv = {};
        this.dataFields.pv1Power = {};
        this.dataFields.pv2Power = {};
        this.dataFields.pv3Power = {};
        this.dataFields.pv4Power = {};
        this.dataFields.pv5Power = {};

        let generalInfo = hh.createActDataPanelCard('General Info', null, this.devInfo);
        this.generalInfo.deviceName = hh.adf(generalInfo, "Device Model", "");
        this.generalInfo.manufacturer = hh.adf(generalInfo, "Manufacturer", "");
        this.generalInfo.serialNumber = hh.adf(generalInfo, "Serial Number", "");
        this.dataFields.batPower.ratedBatChargePowerW = hh.adf(generalInfo, "Rated Charge Power", "W", {sIPrefix: true});
        this.dataFields.batPower.ratedBatDischargePowerW = hh.adf(generalInfo, "Rated Discharge Power", "W", {sIPrefix: true});
//        this.dataFields.pvPower.ratedPowerW = hh.adf(generalInfo, "Rated Pv Power", "Wp", {sIPrefix: true});
//        this.dataFields.gridImportPower.ratedPowerW = hh.adf(generalInfo, "Rated AC Power", "W", {sIPrefix: true});

        let comsInfo = hh.createActDataPanelCard('Comms Info', null, this.devInfo);
        let coms = hh.adf(comsInfo, "Device Model", "");
        coms.value = 'MODBUS RTU';
        this.paramData.comPort = hh.adf(comsInfo, "Com Port", "");
        this.paramData.comAddress = hh.adf(comsInfo, "Address", "");

        /**Advance Live Data Starts Here**/

//        let acInfoAdv = hh.createActDataPanelCard('AC Info', null, this.advdataContent);


        let pvInfo = hh.createActDataPanelCard('PV', null, this.dataContent); //create Panel with label
//        hh.addHeaderTitleToPC(pvInfo, "PV");
        this.dataFields.pv.powerW = hh.adf(pvInfo, "PV Power", "W", {decimal: 1});
        this.dataFields.pvDailyPowerGeneration = hh.adf(pvInfo, "PV Daily Generation", "Wh", {decimal: 3, sIPrefix: ["k"]});
        this.dataFields.pvDailyPowerGenerationTime = hh.adf(pvInfo, "Daily Generation Time", "mins", {decimal: 0});
        this.dataFields.pvTotalPowerGeneration = hh.adf(pvInfo, "PV Total Generation", "Wh", {decimal: 3, sIPrefix: ["k", "M"]});
        this.dataFields.pvTotalPowerGenerationTime = hh.adf(pvInfo, "Daily Generation Time", "Hrs", {decimal: 1});


        let dcPvInfoAdv = hh.createActDataPanelCard('PV Info', null, this.dataContent); //create Panel with label
        hh.addHeaderTitleToPC(dcPvInfoAdv, "PV1 Data");
        this.dataFields.pv1Power.voltageV = hh.adf(dcPvInfoAdv, "Voltage", "V", {decimal: 1});
        this.dataFields.pv1Power.currentA = hh.adf(dcPvInfoAdv, "Current", "A", {decimal: 1});
        this.dataFields.pv1Power.powerW = hh.adf(dcPvInfoAdv, "Power", "W", {decimal: 1});
//        this.dataFields.pv1PositiveInsImpedence = hh.adf(dcPvInfoAdv, "Positive Insulation Impedence", "\u2126", {decimal: 1, sIPrefix: true});
//        this.dataFields.pv1NegativeInsImpedence = hh.adf(dcPvInfoAdv, "Negative Insulation Impedence", "\u2126", {decimal: 1, sIPrefix: true});
        hh.addHeaderTitleToPC(dcPvInfoAdv, "PV2 Data");
        this.dataFields.pv2Power.voltageV = hh.adf(dcPvInfoAdv, "Voltage", "V", {decimal: 1});
        this.dataFields.pv2Power.currentA = hh.adf(dcPvInfoAdv, "Current", "A", {decimal: 1});
        this.dataFields.pv2Power.powerW = hh.adf(dcPvInfoAdv, "Power", "W", {decimal: 1});
        
        hh.addHeaderTitleToPC(dcPvInfoAdv, "PV3 Data");
        this.dataFields.pv3Power.voltageV = hh.adf(dcPvInfoAdv, "Voltage", "V", {decimal: 1});
        this.dataFields.pv3Power.currentA = hh.adf(dcPvInfoAdv, "Current", "A", {decimal: 1});
        this.dataFields.pv3Power.powerW = hh.adf(dcPvInfoAdv, "Power", "W", {decimal: 1});
        
        hh.addHeaderTitleToPC(dcPvInfoAdv, "PV4 Data");
        this.dataFields.pv4Power.voltageV = hh.adf(dcPvInfoAdv, "Voltage", "V", {decimal: 1});
        this.dataFields.pv4Power.currentA = hh.adf(dcPvInfoAdv, "Current", "A", {decimal: 1});
        this.dataFields.pv4Power.powerW = hh.adf(dcPvInfoAdv, "Power", "W", {decimal: 1});
        
        hh.addHeaderTitleToPC(dcPvInfoAdv, "PV5 Data");
        this.dataFields.pv5Power.voltageV = hh.adf(dcPvInfoAdv, "Voltage", "V", {decimal: 1});
        this.dataFields.pv5Power.currentA = hh.adf(dcPvInfoAdv, "Current", "A", {decimal: 1});
        this.dataFields.pv5Power.powerW = hh.adf(dcPvInfoAdv, "Power", "W", {decimal: 1});



        let acAdvInfoAdv = hh.createActDataPanelCard('AC Advanced Info', null, this.advdataContent);
        //Inverter Generator
        hh.addHeaderTitleToPC(acAdvInfoAdv, "Inverter Generator");
        this.dataFields.invActivePower = hh.adf(acAdvInfoAdv, "Active Power", "W", {decimal: 1});
        this.dataFields.invReactivePower = hh.adf(acAdvInfoAdv, "Reactive Power", "VAR", {decimal: 1});
        this.dataFields.invApparentPower = hh.adf(acAdvInfoAdv, "Apparent Power", "VA", {decimal: 1});

        //Grid Connection Point
        hh.addHeaderTitleToPC(acAdvInfoAdv, "Grid Connection Point");
        let invTempAdv = hh.createActDataPanelCard('Temperature', null, this.advdataContent);
        this.dataFields.ambientTemp = hh.adf(invTempAdv, "Ambient Temperature", "\u2103", {decimal: 1});

        let AlertsAdv = hh.createActDataPanelCard('System Alarms', null, this.advdataContent);
        this.dataFields.bmsLevel1Alarm = hh.adf(AlertsAdv, "BMS Level 1 Alarm", "", {decimal: 1});
        this.dataFields.bmsLevel2Alarm = hh.adf(AlertsAdv, "BMS Level 2 Alarm", "", {decimal: 1});
        this.dataFields.bmsLevel3Protection = hh.adf(AlertsAdv, "BMS Level 3 Protection", "", {decimal: 1});
        this.dataFields.faultAlarmBitInfo1 = hh.adf(AlertsAdv, "Fault Alarm Bit Info 1", "", {decimal: 1});
        this.dataFields.faultAlarmBitInfo2 = hh.adf(AlertsAdv, "Fault Alarm Bit Info 2", "", {decimal: 1});
        this.dataFields.faultAlarmBitInfo3 = hh.adf(AlertsAdv, "Fault Alarm Bit Info 3", "", {decimal: 1});
        this.dataFields.faultAlarmBitInfo4 = hh.adf(AlertsAdv, "Fault Alarm Bit Info 4", "", {decimal: 1});
        this.dataFields.faultAlarmBitInfo5 = hh.adf(AlertsAdv, "Fault Alarm Bit Info 5", "", {decimal: 1});
        this.dataFields.faultAlarmBitInfo6 = hh.adf(AlertsAdv, "Fault Alarm Bit Info 6", "", {decimal: 1});
        
        let dcBatInfo = hh.createActDataPanelCard('Battery Info', null, this.dataContent); //create Panel with label
//        hh.addHeaderTitleToPC(dcBatInfo, "Data from Inverter");
        this.dataFields.bmsSystemStatus = hh.adf(dcBatInfo, "System Status", "", {});
        this.dataFields.bmsBatteryStatus = hh.adf(dcBatInfo, "Battery Status", "", {datamap: {0: 'Hold', 1: 'Charge/Discharge Disabled', 2: 'Charging Disabled', 3: 'Discharging Disabled', 4: 'Charging', 5: 'Discharging'}});
        this.dataFields.bmsHighVoltageRelayStatus = hh.adf(dcBatInfo, "Battery Relay Status", "", {datamap: {1: 'Closed', 0: 'Open'}});
        this.dataFields.batPercentageP = hh.adf(dcBatInfo, "Capacity", "%", {decimal: 0});
        this.dataFields.batPower.voltageV = hh.adf(dcBatInfo, "Voltage", "V", {decimal: 1});
        this.dataFields.maxUnitVoltage = hh.adf(dcBatInfo, "Highest Cell Voltage", "V", {decimal: 3});
        this.dataFields.minCellVoltage = hh.adf(dcBatInfo, "Lowest Cell Voltage", "V", {decimal: 3});
        this.dataFields.batPower.powerW = hh.adf(dcBatInfo, "Power", "W", {decimal: 1});
        this.dataFields.batPower.currentA = hh.adf(dcBatInfo, "Current", "A", {decimal: 1});
        this.dataFields.bmsMaxChargeCurrentA = hh.adf(dcBatInfo, "Charge Current Setpoint", "A", {decimal: 1});
        this.dataFields.bmsMaxDischargeCurrentA = hh.adf(dcBatInfo, "Discharge Current Setpoint", "A", {decimal: 1});
        this.dataFields.batPositiveInsImpedence = hh.adf(dcBatInfo, "Positive Inusulation Impedence", "\u2126", {decimal: 1, sIPrefix: true});
        this.dataFields.bat1NegativeInsImpedence = hh.adf(dcBatInfo, "Negative Insulation Impedence", "\u2126", {decimal: 1, sIPrefix: true});
        this.dataFields.soh = hh.adf(dcBatInfo, "State of Health", "%", {decimal: 0});

//        this.settingsAccordion = new SMDUIAccordianPanel(this.settingsContent, {
//            tabs: [
//
//                {
//                    label: 'Operational Settings' //item 0
//                },
//                {
//                    label: 'Battery Settings' //item 1
//                },
//                {
//                    label: 'PV Settings' //item 2
//                }
//                
//            ]
//        });

    }


    $(document).ready(function () {
        root.atessPbdGUI = new AtessPbdGUI();
    });
}(window));
