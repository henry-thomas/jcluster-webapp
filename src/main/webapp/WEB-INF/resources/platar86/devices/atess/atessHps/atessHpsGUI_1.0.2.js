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


/* global hhContentBuilder, hh, mainUtils, pm, AtessHpsGUI, wsm */




(function (root) {
    function AtessHpsGUI(ext) {
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
//                {
//                    label: "Live Data",
//                    id: 'data'
//                },
                {
                    label: "Advanced Live Data",
                    id: 'advdata'
                },
                {
                    label: "Settings",
                    id: 'settings'
                },
                {
                    label: "TODO",
                    id: 'otherInfo'
                }
            ]
        });

        this.devInfo = this.mainTabPanel.getItemContentById('info');
//        this.dataContent = this.mainTabPanel.getItemContentById('data');
        this.advdataContent = this.mainTabPanel.getItemContentById('advdata');
        this.settingsContent = this.mainTabPanel.getItemContentById('settings');
        this.otherInfoContent = this.mainTabPanel.getItemContentById('otherInfo');

//        this.dataContent.classList.add('actDataContainer');
        this.advdataContent.classList.add('actDataContainer');
        this.devInfo.classList.add('actDataContainer');
//        this.otherInfoContent.classList.add('actDataContainer');
        _initGui.call(this);
    }




    function _initGui() {
        this.dataFields.batPower = {};
        this.dataFields.batDischargePower = {};
        this.dataFields.pvPower = {};
        this.dataFields.gridImportPower = {};

        let generalInfo = hh.createActDataPanelCard('General Info', null, this.devInfo);
        this.generalInfo.deviceName = hh.adf(generalInfo, "Device Model", "");
        this.generalInfo.manufacturer = hh.adf(generalInfo, "Manufacturer", "");
        this.generalInfo.serialNumber = hh.adf(generalInfo, "Serial Number", "");
        this.dataFields.batPower.ratedBatChargePowerW = hh.adf(generalInfo, "Rated Charge Power", "W", {sIPrefix: true});
        this.dataFields.batPower.ratedBatDischargePowerW = hh.adf(generalInfo, "Rated Discharge Power", "W", {sIPrefix: true});
        this.dataFields.pvPower.ratedPowerW = hh.adf(generalInfo, "Rated Pv Power", "Wp", {sIPrefix: true});
        this.dataFields.gridImportPower.ratedPowerW = hh.adf(generalInfo, "Rated AC Power", "W", {sIPrefix: true});

        let comsInfo = hh.createActDataPanelCard('Comms Info', null, this.devInfo);
        let coms = hh.adf(comsInfo, "Device Model", "");
        coms.value = 'MODBUS RTU';
        this.paramData.comPort = hh.adf(comsInfo, "Com Port", "");
        this.paramData.comAddress = hh.adf(comsInfo, "Address", "");


//        let operationalInfo = hh.createActDataPanelCard('Operational Info', null, this.dataContent);
//        this.dataFields.modeSelection = hh.adf(operationalInfo, "Mode Selection", "", {datamap: {0: 'Load Priority', 1: 'Battery Priority', 2: 'Economic Mode', 3: 'Peak Shaving', 4: 'Multi Period Chrg&Dschrg',
//                5: 'Manual Dispatching', 6: 'Battery Protection', 7: 'Backup Power Management', 8: 'Constant Power Discharge', 9: 'Forced Charging Mode'}});
//        this.dataFields.operationMode = hh.adf(operationalInfo, "Operation Mode", "", {datamap: {0: 'Peak', 1: 'Fair', 2: 'Valley', 3: 'DG', 4: 'Battery Priority',
//                5: 'Load Priority', 6: 'Peak Shaving', 7: 'Multi Stage Charge & Discharge', 8: 'EMS Mode', 9: 'DC Source Mode', 10: 'Manual Dispatching', 11: 'Battery Protection', 12: 'Backup Power Management'}});
//        this.dataFields.runningState = hh.adf(operationalInfo, "Running State", "", {decimal: 1});





//        let acInfo = hh.createActDataPanelCard('AC Info', null, this.dataContent);
//        //Inverter Generator
//        hh.addHeaderTitleToPC(acInfo, "Inverter Generator");
//        this.dataFields.outputVoltageUV = hh.adf(acInfo, "Voltage UV", "V", {decimal: 1});
//        this.dataFields.outputVoltageVW = hh.adf(acInfo, "Voltage VW", "V", {decimal: 1});
//        this.dataFields.outputVoltageWU = hh.adf(acInfo, "Voltage WU", "V", {decimal: 1});
//
//
//        //Grid Voltage voltage
//        hh.addHeaderTitleToPC(acInfo, "Grid Connection Point");
//        this.dataFields.gridBypassVoltageUV = hh.adf(acInfo, "Voltage UV", "V", {decimal: 1});
//        this.dataFields.gridBypassVoltageVW = hh.adf(acInfo, "Voltage VW", "V", {decimal: 1});
//        this.dataFields.gridBypassVoltageWU = hh.adf(acInfo, "Voltage WU", "V", {decimal: 1});
//        this.dataFields.bypassPhUCurrentA = hh.adf(acInfo, "Current U", "A", {decimal: 1});
//        this.dataFields.bypassPhVCurrentA = hh.adf(acInfo, "Current V", "A", {decimal: 1});
//        this.dataFields.bypassPhWCurrentA = hh.adf(acInfo, "Current W", "A", {decimal: 1});
//
//
//        //Load Current
//        hh.addHeaderTitleToPC(acInfo, "Load Connection Point");
//        this.dataFields.loadCurrentA = hh.adf(acInfo, "Current U", "A", {decimal: 1});
//        this.dataFields.loadCurrentB = hh.adf(acInfo, "Current V", "A", {decimal: 1});
//        this.dataFields.loadCurrentC = hh.adf(acInfo, "Current W", "A", {decimal: 1});



//        let dcBatInfo = hh.createActDataPanelCard('Battery Info', null, this.dataContent); //create Panel with label
//        hh.addHeaderTitleToPC(dcBatInfo, "Data from Inverter");
//        this.dataFields.bmsSystemStatus = hh.adf(dcBatInfo, "System Status", "", {});
//        this.dataFields.bmsBatteryStatus = hh.adf(dcBatInfo, "Battery Status", "", {datamap: {0: 'Hold', 1: 'Charge/Discharge Disabled', 2: 'Charging Disabled', 3: 'Discharging Disabled', 4: 'Charging', 5: 'Discharging'}});
//        this.dataFields.bmsHighVoltageRelayStatus = hh.adf(dcBatInfo, "Battery Relay Status", "", {datamap: {1: 'Closed', 0: 'Open'}});
//        this.dataFields.batPercentageP = hh.adf(dcBatInfo, "Capacity", "%", {decimal: 0});
//        this.dataFields.batPower.voltageV = hh.adf(dcBatInfo, "Voltage", "V", {decimal: 1});
//        this.dataFields.maxUnitVoltage = hh.adf(dcBatInfo, "Highest Cell Voltage", "V", {decimal: 3});
//        this.dataFields.minCellVoltage = hh.adf(dcBatInfo, "Lowest Cell Voltage", "V", {decimal: 3});
//        this.dataFields.batPower.powerW = hh.adf(dcBatInfo, "Power", "W", {decimal: 1});
//        this.dataFields.batPower.currentA = hh.adf(dcBatInfo, "Current", "A", {decimal: 1});
//        this.dataFields.bmsMaxChargeCurrent = hh.adf(dcBatInfo, "Charge Current Setpoint", "A", {decimal: 1});
//        this.dataFields.bmsMaxDischargeCurrent = hh.adf(dcBatInfo, "Discharge Current Setpoint", "A", {decimal: 1});
//        this.dataFields.batPositiveInsImpedence = hh.adf(dcBatInfo, "Positive Inusulation Impedence", "\u2126", {decimal: 1, sIPrefix: true});
//        this.dataFields.bat1NegativeInsImpedence = hh.adf(dcBatInfo, "Negative Insulation Impedence", "\u2126", {decimal: 1, sIPrefix: true});
//        this.dataFields.soh = hh.adf(dcBatInfo, "State of Health", "%", {decimal: 0});




//        let dcPvInfo = hh.createActDataPanelCard('PV Info', null, this.dataContent); //create Panel with label
//
//        this.dataFields.pvPower.voltageV = hh.adf(dcPvInfo, "Voltage", "V", {decimal: 1});
//        this.dataFields.pvPower.currentA = hh.adf(dcPvInfo, "Current", "A", {decimal: 1});
//        this.dataFields.pvPower.powerW = hh.adf(dcPvInfo, "Power", "W", {decimal: 1});
//        this.dataFields.pv1PositiveInsImpedence = hh.adf(dcPvInfo, "Positive Insulation Impedence", "\u2126", {decimal: 1, sIPrefix: true});
//        this.dataFields.pv1NegativeInsImpedence = hh.adf(dcPvInfo, "Negative Insulation Impedence", "\u2126", {decimal: 1, sIPrefix: true});



//        let acAdvInfo = hh.createActDataPanelCard('AC Advanced Info', null, this.dataContent);
//        //Inverter Generator
//        hh.addHeaderTitleToPC(acAdvInfo, "Inverter Generator");
//        this.dataFields.invActivePower = hh.adf(acAdvInfo, "Active Power", "W", {decimal: 1});
//        this.dataFields.invReactivePower = hh.adf(acAdvInfo, "Reactive Power", "VAR", {decimal: 1});
//        this.dataFields.invApparentPower = hh.adf(acAdvInfo, "Apparent Power", "VA", {decimal: 1});
//        //Transformer Input
//        hh.addHeaderTitleToPC(acAdvInfo, "Transformer Input");
//        this.dataFields.inverVoltageUV = hh.adf(acAdvInfo, "Voltage UV", "V", {decimal: 1});
//        this.dataFields.inverVoltageVW = hh.adf(acAdvInfo, "Voltage VW", "V", {decimal: 1});
//        this.dataFields.inverVoltageWU = hh.adf(acAdvInfo, "Voltage WU", "V", {decimal: 1});
//        this.dataFields.inductance1CurrentA = hh.adf(acAdvInfo, "Current U", "A", {decimal: 1});
//        this.dataFields.inductance1CurrentB = hh.adf(acAdvInfo, "Current V", "A", {decimal: 1});
//        this.dataFields.inductance1CurrentC = hh.adf(acAdvInfo, "Current W", "A", {decimal: 1});
//
//        //Grid Connection Point
//        hh.addHeaderTitleToPC(acAdvInfo, "Grid Connection Point");
//
//        this.dataFields.gridImportPower.powerW = hh.adf(acAdvInfo, "Active Power", "W", {decimal: 1});
//        this.dataFields.gridImportPower.reactivePowerVAR = hh.adf(acAdvInfo, "Reactive Power", "VAR", {decimal: 1});
//        this.dataFields.gridImportPower.apparentPowerVA = hh.adf(acAdvInfo, "Apparent Power", "VA", {decimal: 1});
//        this.dataFields.gridImportPower.frequencyF = hh.adf(acAdvInfo, "Frequency", "Hz", {decimal: 1});
//        this.dataFields.gridImportPower.powerFactorCosF = hh.adf(acAdvInfo, "Power Factor", "Cos\u03B8", {decimal: 1});
//        this.dataFields.gfdi1LeakageCurrent = hh.adf(acAdvInfo, "Earth Leakage Current 1", "A", {decimal: 1});
//        this.dataFields.gfdi2LeakageCurrent = hh.adf(acAdvInfo, "Earth Leakage Current 2", "A", {decimal: 1});


//        let invTemp = hh.createActDataPanelCard('Temperature', null, this.dataContent);
//        this.dataFields.transformerTemp = hh.adf(invTemp, "Transformer Temperature", "\u2103", {decimal: 1});
//        this.dataFields.heatsinkTemp = hh.adf(invTemp, "Heatsink Temperature", "\u2103", {decimal: 1});
//        this.dataFields.convInductanceTemp = hh.adf(invTemp, "Converter Inductor Temperature", "\u2103", {decimal: 1});
//        this.dataFields.buckInductanceTemp = hh.adf(invTemp, "Buck Converter Inductor Temperature", "\u2103", {decimal: 1});
//        this.dataFields.buckFinTemp = hh.adf(invTemp, "Buck Converter Heatsink Temperature", "\u2103", {decimal: 1});
//        this.dataFields.ambientTemp = hh.adf(invTemp, "Ambient Temperature", "\u2103", {decimal: 1});
//        this.dataFields.dcRadiatorTemp = hh.adf(invTemp, "Radiator Temperature", "\u2103", {decimal: 1});
//        this.dataFields.scrTemperature = hh.adf(invTemp, "SCR Temperature", "\u2103", {decimal: 1});
//
//
//        let Alerts = hh.createActDataPanelCard('System Alarms', null, this.dataContent);
//        this.dataFields.bmsLevel1Alarm = hh.adf(Alerts, "BMS Level 1 Alarm", "", {decimal: 1});
//        this.dataFields.bmsLevel2Alarm = hh.adf(Alerts, "BMS Level 2 Alarm", "", {decimal: 1});
//        this.dataFields.bmsLevel3Protection = hh.adf(Alerts, "BMS Level 3 Protection", "", {decimal: 1});
//        this.dataFields.faultAlarmBitInfo1 = hh.adf(Alerts, "Fault Alarm Bit Info 1", "", {decimal: 1});
//        this.dataFields.faultAlarmBitInfo2 = hh.adf(Alerts, "Fault Alarm Bit Info 2", "", {decimal: 1});
//        this.dataFields.faultAlarmBitInfo3 = hh.adf(Alerts, "Fault Alarm Bit Info 3", "", {decimal: 1});
//        this.dataFields.faultAlarmBitInfo4 = hh.adf(Alerts, "Fault Alarm Bit Info 4", "", {decimal: 1});
//        this.dataFields.faultAlarmBitInfo5 = hh.adf(Alerts, "Fault Alarm Bit Info 5", "", {decimal: 1});
//        this.dataFields.faultAlarmBitInfo6 = hh.adf(Alerts, "Fault Alarm Bit Info 6", "", {decimal: 1});
//        this.dataFields.faultAlarmBitInfo7 = hh.adf(Alerts, "Fault Alarm Bit Info 7", "", {decimal: 1});
//        this.dataFields.faultAlarmBitInfo8 = hh.adf(Alerts, "Fault Alarm Bit Info 8", "", {decimal: 1});


//        let operationalInfoAdv = hh.createActDataPanelCard('Operational Info', null, this.advdataContent);
//        this.dataFields.modeSelection = hh.adf(operationalInfoAdv, "Mode Selection", "", {datamap: {0: 'Load Priority', 1: 'Battery Priority', 2: 'Economic Mode', 3: 'Peak Shaving', 4: 'Multi Period Chrg&Dschrg',
//                5: 'Manual Dispatching', 6: 'Battery Protection', 7: 'Backup Power Management', 8: 'Constant Power Discharge', 9: 'Forced Charging Mode'}});
//        this.dataFields.operationMode = hh.adf(operationalInfoAdv, "Operation Mode", "", {datamap: {0: 'Peak', 1: 'Fair', 2: 'Valley', 3: 'DG', 4: 'Battery Priority',
//                5: 'Load Priority', 6: 'Peak Shaving', 7: 'Multi Stage Charge & Discharge', 8: 'EMS Mode', 9: 'DC Source Mode', 10: 'Manual Dispatching', 11: 'Battery Protection', 12: 'Backup Power Management'}});
//        this.dataFields.runningState = hh.adf(operationalInfoAdv, "Running State", "", {decimal: 1});


        /**Advance Live Data Starts Here**/

        let acInfoAdv = hh.createActDataPanelCard('AC Info', null, this.advdataContent);
        //Inverter Generator
        hh.addHeaderTitleToPC(acInfoAdv, "Inverter Generator");
        this.dataFields.outputVoltageUV = hh.adf(acInfoAdv, "Voltage UV", "V", {decimal: 1});
        this.dataFields.outputVoltageVW = hh.adf(acInfoAdv, "Voltage VW", "V", {decimal: 1});
        this.dataFields.outputVoltageWU = hh.adf(acInfoAdv, "Voltage WU", "V", {decimal: 1});


        //Grid Voltage voltage
        hh.addHeaderTitleToPC(acInfoAdv, "Grid Connection Point");
        this.dataFields.gridBypassVoltageUV = hh.adf(acInfoAdv, "Voltage UV", "V", {decimal: 1});
        this.dataFields.gridBypassVoltageVW = hh.adf(acInfoAdv, "Voltage VW", "V", {decimal: 1});
        this.dataFields.gridBypassVoltageWU = hh.adf(acInfoAdv, "Voltage WU", "V", {decimal: 1});
        this.dataFields.bypassPhUCurrentA = hh.adf(acInfoAdv, "Current U", "A", {decimal: 1});
        this.dataFields.bypassPhVCurrentA = hh.adf(acInfoAdv, "Current V", "A", {decimal: 1});
        this.dataFields.bypassPhWCurrentA = hh.adf(acInfoAdv, "Current W", "A", {decimal: 1});


        //Load Current
        hh.addHeaderTitleToPC(acInfoAdv, "Load Connection Point");
        this.dataFields.loadCurrentA = hh.adf(acInfoAdv, "Current U", "A", {decimal: 1});
        this.dataFields.loadCurrentB = hh.adf(acInfoAdv, "Current V", "A", {decimal: 1});
        this.dataFields.loadCurrentC = hh.adf(acInfoAdv, "Current W", "A", {decimal: 1});



        let dcBatInfoAdv = hh.createActDataPanelCard('Battery Info', null, this.advdataContent); //create Panel with label
        hh.addHeaderTitleToPC(dcBatInfoAdv, "Data from Inverter");
        this.dataFields.bmsSystemStatus = hh.adf(dcBatInfoAdv, "System Status", "", {});
        this.dataFields.bmsBatteryStatus = hh.adf(dcBatInfoAdv, "Battery Status", "", {datamap: {0: 'Hold', 1: 'Charge/Discharge Disabled', 2: 'Charging Disabled', 3: 'Discharging Disabled', 4: 'Charging', 5: 'Discharging'}});
        this.dataFields.bmsHighVoltageRelayStatus = hh.adf(dcBatInfoAdv, "Battery Relay Status", "", {datamap: {1: 'Closed', 0: 'Open'}});
        this.dataFields.batPercentageP = hh.adf(dcBatInfoAdv, "Capacity", "%", {decimal: 0});
        this.dataFields.batPower.voltageV = hh.adf(dcBatInfoAdv, "Voltage", "V", {decimal: 1});
        this.dataFields.maxUnitVoltage = hh.adf(dcBatInfoAdv, "Highest Cell Voltage", "V", {decimal: 3});
        this.dataFields.minCellVoltage = hh.adf(dcBatInfoAdv, "Lowest Cell Voltage", "V", {decimal: 3});
        this.dataFields.batPower.powerW = hh.adf(dcBatInfoAdv, "Power", "W", {decimal: 1});
        this.dataFields.batPower.currentA = hh.adf(dcBatInfoAdv, "Current", "A", {decimal: 1});
        this.dataFields.bmsMaxChargeCurrent = hh.adf(dcBatInfoAdv, "Charge Current Setpoint", "A", {decimal: 1});
        this.dataFields.bmsMaxDischargeCurrent = hh.adf(dcBatInfoAdv, "Discharge Current Setpoint", "A", {decimal: 1});
        this.dataFields.batPositiveInsImpedence = hh.adf(dcBatInfoAdv, "Positive Inusulation Impedence", "\u2126", {decimal: 1, sIPrefix: true});
        this.dataFields.bat1NegativeInsImpedence = hh.adf(dcBatInfoAdv, "Negative Insulation Impedence", "\u2126", {decimal: 1, sIPrefix: true});
        this.dataFields.soh = hh.adf(dcBatInfoAdv, "State of Health", "%", {decimal: 0});




        let dcPvInfoAdv = hh.createActDataPanelCard('PV Info', null, this.advdataContent); //create Panel with label

        this.dataFields.pvPower.voltageV = hh.adf(dcPvInfoAdv, "Voltage", "V", {decimal: 1});
        this.dataFields.pvPower.currentA = hh.adf(dcPvInfoAdv, "Current", "A", {decimal: 1});
        this.dataFields.pvPower.powerW = hh.adf(dcPvInfoAdv, "Power", "W", {decimal: 1});
        this.dataFields.pv1PositiveInsImpedence = hh.adf(dcPvInfoAdv, "Positive Insulation Impedence", "\u2126", {decimal: 1, sIPrefix: true});
        this.dataFields.pv1NegativeInsImpedence = hh.adf(dcPvInfoAdv, "Negative Insulation Impedence", "\u2126", {decimal: 1, sIPrefix: true});



        let acAdvInfoAdv = hh.createActDataPanelCard('AC Advanced Info', null, this.advdataContent);
        //Inverter Generator
        hh.addHeaderTitleToPC(acAdvInfoAdv, "Inverter Generator");
        this.dataFields.invActivePower = hh.adf(acAdvInfoAdv, "Active Power", "W", {decimal: 1});
        this.dataFields.invReactivePower = hh.adf(acAdvInfoAdv, "Reactive Power", "VAR", {decimal: 1});
        this.dataFields.invApparentPower = hh.adf(acAdvInfoAdv, "Apparent Power", "VA", {decimal: 1});
        //Transformer Input
        hh.addHeaderTitleToPC(acAdvInfoAdv, "Transformer Input");
        this.dataFields.inverVoltageUV = hh.adf(acAdvInfoAdv, "Voltage UV", "V", {decimal: 1});
        this.dataFields.inverVoltageVW = hh.adf(acAdvInfoAdv, "Voltage VW", "V", {decimal: 1});
        this.dataFields.inverVoltageWU = hh.adf(acAdvInfoAdv, "Voltage WU", "V", {decimal: 1});
        this.dataFields.inductance1CurrentA = hh.adf(acAdvInfoAdv, "Current U", "A", {decimal: 1});
        this.dataFields.inductance1CurrentB = hh.adf(acAdvInfoAdv, "Current V", "A", {decimal: 1});
        this.dataFields.inductance1CurrentC = hh.adf(acAdvInfoAdv, "Current W", "A", {decimal: 1});

        //Grid Connection Point
        hh.addHeaderTitleToPC(acAdvInfoAdv, "Grid Connection Point");

        this.dataFields.gridImportPower.powerW = hh.adf(acAdvInfoAdv, "Active Power", "W", {decimal: 1});
        this.dataFields.gridImportPower.reactivePowerVAR = hh.adf(acAdvInfoAdv, "Reactive Power", "VAR", {decimal: 1});
        this.dataFields.gridImportPower.apparentPowerVA = hh.adf(acAdvInfoAdv, "Apparent Power", "VA", {decimal: 1});
        this.dataFields.gridImportPower.frequencyF = hh.adf(acAdvInfoAdv, "Frequency", "Hz", {decimal: 1});
        this.dataFields.gridImportPower.powerFactorCosF = hh.adf(acAdvInfoAdv, "Power Factor", "Cos\u03B8", {decimal: 1});
        this.dataFields.gfdi1LeakageCurrent = hh.adf(acAdvInfoAdv, "Earth Leakage Current 1", "A", {decimal: 1});
        this.dataFields.gfdi2LeakageCurrent = hh.adf(acAdvInfoAdv, "Earth Leakage Current 2", "A", {decimal: 1});


        let invTempAdv = hh.createActDataPanelCard('Temperature', null, this.advdataContent);
        this.dataFields.transformerTemp = hh.adf(invTempAdv, "Transformer Temperature", "\u2103", {decimal: 1});
        this.dataFields.heatsinkTemp = hh.adf(invTempAdv, "Heatsink Temperature", "\u2103", {decimal: 1});
        this.dataFields.convInductanceTemp = hh.adf(invTempAdv, "Converter Inductor Temperature", "\u2103", {decimal: 1});
        this.dataFields.buckInductanceTemp = hh.adf(invTempAdv, "Buck Converter Inductor Temperature", "\u2103", {decimal: 1});
        this.dataFields.buckFinTemp = hh.adf(invTempAdv, "Buck Converter Heatsink Temperature", "\u2103", {decimal: 1});
        this.dataFields.ambientTemp = hh.adf(invTempAdv, "Ambient Temperature", "\u2103", {decimal: 1});
        this.dataFields.dcRadiatorTemp = hh.adf(invTempAdv, "Radiator Temperature", "\u2103", {decimal: 1});
        this.dataFields.scrTemperature = hh.adf(invTempAdv, "SCR Temperature", "\u2103", {decimal: 1});


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
        this.dataFields.faultAlarmBitInfo7 = hh.adf(AlertsAdv, "Fault Alarm Bit Info 7", "", {decimal: 1});
        this.dataFields.faultAlarmBitInfo8 = hh.adf(AlertsAdv, "Fault Alarm Bit Info 8", "", {decimal: 1});



































        this.settingsAccordion = new SMDUIAccordianPanel(this.settingsContent, {
            tabs: [

                {
                    label: 'Operational Settings' //item 0
                },
                {
                    label: 'Battery Settings' //item 1
                },
                {
                    label: 'PV Settings' //item 2
                },
                {
                    label: 'Grid Settings' //item 3
                },
                {
                    label: 'Inverter Settings' //item 4
                },
            ]
        });




        // let basicSettingsPanel = this.settingsAccordion.getTabContent(0);

//        new ParamSetting("The section to add to", 'Name of parameter', {type: 'inputNumber/switch/dropdown/dropDownButton', title: 'Display name', ctrlInfo: "Description"})






        let operationalSettingsPanel = this.settingsAccordion.getTabContent(0);

        hh.pPanelAddDescTitle(operationalSettingsPanel, "Operation Settings");
//        this.params.onOff = new ParamSetting(operationalSettingsPanel, 'onOff', {type: 'switch', title: 'Power', ctrlInfo: "ON / OFF"});
        this.params.onOff = new ParamSetting(operationalSettingsPanel, 'onOff', {
                title: 'Power',
                type: 'dropDownButton',
                content: [             
                    {
                        name: 'On', cb: function () {
                            wsm.sendDevMsgExecWithJsonInst(
                                    {instrExt: 'onOff', showMessage: true, onOff: 1}
                            );
                        }
                    },
                    {
                        name: 'Off', cb: function () {
                            wsm.sendDevMsgExecWithJsonInst(
                                    {instrExt: 'onOff', showMessage: true, onOff: 0}
                            );
                        }
                    }
                ]
            });


        this.params.modeSelection = new ParamSetting(operationalSettingsPanel, 'modeSelection', {type: 'dropDown', title: 'Mode Selection', ctrlInfo: "Select system work mode", dropDownConf: {
                options: [
                    {label: 'Load Priority', value: '0'},
                    {label: 'Battery Priority', value: '1'},
                    {label: 'Eco Mode', value: '2'},
                    {label: 'Peak Shaving', value: '3'},
                    {label: 'Multi Period Charge/Discharge', value: '4'},
                    {label: 'Manual Dispatching', value: '5'},
                    {label: 'Battery Protection', value: '6'},
                    {label: 'Backup Power Management', value: '7'},
                    {label: 'Constant Power Discharge', value: '8'},
                    {label: 'Forced Charging Mode', value: '9'}
                ]
            }
        });

        this.params.forceOnGridToOffGridEnable = new ParamSetting(operationalSettingsPanel, 'forceOnGridToOffGridEnable', {type: 'switch', title: 'Force Offgrid', ctrlInfo: "Force the inverter into Offgrid mode while grid is connected"});

        this.params.factoryReset = new ParamSetting(operationalSettingsPanel, 'factoryReset', {type: 'dropDown', title: 'Factorty Reset', ctrlInfo: "Factory reset will restore all settings to default - you may lose connection with the inverter", dropDownConf: {
                options: [
                    {label: 'Cancel', value: '0'},
                    {label: 'Enter', value: '1'},
                ]
            }
        });
        this.params.manualAdjustmentEnable = new ParamSetting(operationalSettingsPanel, 'manualAdjustmentEnable', {type: 'switch', title: 'Manual Adjustment', ctrlInfo: "Used to modify important parameters"});



        hh.pPanelAddDescTitle(operationalSettingsPanel, "EMS Control");
        this.params.emsEnable = new ParamSetting(operationalSettingsPanel, 'emsEnable', {type: 'switch', title: 'EMS', ctrlInfo: "When activated the inverter is fully controlled by an External Energy Management System (EMS)"});
        this.params.pvPowerSetting = new ParamSetting(operationalSettingsPanel, 'pvPowerSetting', {type: 'inputNumber', title: 'PV Power', ctrlInfo: "For use when in EMS mode : 0-500kW"});
        this.params.inverterRectifierPowerSetting = new ParamSetting(operationalSettingsPanel, 'inverterRectifierPowerSetting', {type: 'inputNumber', title: 'inverterRectifierPowerSetting', ctrlInfo: "For use when in EMS mode : 0 - 500kW"});

        this.params.signBitInverterRectifDirection = new ParamSetting(operationalSettingsPanel, 'signBitInverterRectifDirection', {type: 'dropDown', title: 'InverterRectifDirection', ctrlInfo: "For use when in EMS mode - Inveter mode: battery discharge to load, Rectifier mode: battery Charge from grid", dropDownConf: {
                options: [
                    {label: 'Inverter', value: '0'},
                    {label: 'Rectifier', value: '1'},
                ]
            }
        });
        //this.params.signBitInverterRectifDirection = new ParamSetting(operationalSettingsPanel, 'signBitInverterRectifDirection', {type: 'inputNumber', title: 'signBitInverterRectifDirection', ctrlInfo: "X"});


        hh.pPanelAddDescTitle(operationalSettingsPanel, "Communication Settings");
        this.params.parallelEnable = new ParamSetting(operationalSettingsPanel, 'parallelEnable', {type: 'switch', title: 'Parallel Mode', ctrlInfo: "Switch ON if there is more than one inverter connected in parallel and OFF if its a single inverter"});
        this.params.parallelAddress = new ParamSetting(operationalSettingsPanel, 'parallelAddress', {type: 'inputNumber', title: 'Parallel Address', ctrlInfo: "Set a Parallel address for this device"});
        this.params.parallelMachineNumber = new ParamSetting(operationalSettingsPanel, 'parallelMachineNumber', {type: 'inputNumber', title: 'Parallel Machine Number', ctrlInfo: "Set a Parrelel Machine number for this device"});
        this.params.modbusAddress = new ParamSetting(operationalSettingsPanel, 'modbusAddress', {type: 'inputNumber', title: 'Modbus Address', ctrlInfo: "Set a Modbus address for this device ranging from 1-32"});
        this.params.comAddress = new ParamSetting(operationalSettingsPanel, 'comAddress', {type: 'inputNumber', title: 'Communcation Address', ctrlInfo: "Set a Communication address for this device ranging from 1 - 32"});
        this.params.comPort = new ParamSetting(operationalSettingsPanel, 'comPort', {type: 'inputText', title: 'Com port number', ctrlInfo: "Set a Com Port connected to on the inverter"});




        let batterySettingsPanel = this.settingsAccordion.getTabContent(1);
        this.params.batteryChargingCurrent = new ParamSetting(batterySettingsPanel, 'batteryChargingCurrent', {type: 'inputNumber', title: 'Battery Charge Current', ctrlInfo: "P"});
        this.params.bmsCommunicationEnable = new ParamSetting(batterySettingsPanel, 'bmsCommunicationEnable', {type: 'switch', title: 'Battery Management System', ctrlInfo: "Switch ON to enable communication between the battery BMS and Inverter"});
        this.params.gridPvSimultaneousChargingEnable = new ParamSetting(batterySettingsPanel, 'gridPvSimultaneousChargingEnable', {type: 'switch', title: 'Grid and PV Charge', ctrlInfo: "Allow Grid and PV to charge Simultaneously"});
        this.params.highVoltageFault = new ParamSetting(batterySettingsPanel, 'highVoltageFault', {type: 'inputNumber', title: 'High Cell Voltage Fault', ctrlInfo: ""});
        this.params.lowVoltageAlarm = new ParamSetting(batterySettingsPanel, 'lowVoltageAlarm', {type: 'inputNumber', title: 'Low Cell Voltage Alarm', ctrlInfo: ""});
        this.params.lowVoltageFault = new ParamSetting(batterySettingsPanel, 'lowVoltageFault', {type: 'inputNumber', title: 'Low Cell Voltage Fault', ctrlInfo: ""});
        this.params.dischargeCutoffVoltage = new ParamSetting(batterySettingsPanel, 'dischargeCutoffVoltage', {type: 'inputNumber', title: 'Discharge Cut off Voltage', ctrlInfo: "Cell Voltage at which inverter will stop discharging the battery"});
        this.params.dischargeCutoffSOC = new ParamSetting(batterySettingsPanel, 'dischargeCutoffSOC', {type: 'inputNumber', title: 'Discharge cutoff SOC', ctrlInfo: "SOC at which inverter will stop discharging the battery"});
        this.params.floatingChargeVoltage = new ParamSetting(batterySettingsPanel, 'floatingChargeVoltage', {type: 'inputNumber', title: 'Float Charge Voltage', ctrlInfo: ""});
        this.params.socUpperLimit = new ParamSetting(batterySettingsPanel, 'socUpperLimit', {type: 'inputNumber', title: 'SOC Upper Limit', ctrlInfo: ""});
        this.params.socLowerLimit = new ParamSetting(batterySettingsPanel, 'socLowerLimit', {type: 'inputNumber', title: 'SOC Lower Limit', ctrlInfo: ""});
        this.params.batCellMaxVoltage = new ParamSetting(batterySettingsPanel, 'batCellMaxVoltage', {type: 'inputNumber', title: 'Maximum Cell Voltage', ctrlInfo: ""});
        this.params.batCellMinVoltage = new ParamSetting(batterySettingsPanel, 'batCellMinVoltage', {type: 'inputNumber', title: 'Minimum Cell Voltage', ctrlInfo: ""});
        this.params.batUpperTempLimit = new ParamSetting(batterySettingsPanel, 'batUpperTempLimit', {type: 'inputNumber', title: 'Maximum temperature', ctrlInfo: ""});
        this.params.batLowerTempLimit = new ParamSetting(batterySettingsPanel, 'batLowerTempLimit', {type: 'inputNumber', title: 'Minimum temperature', ctrlInfo: ""});
        this.params.batChargeSaturation = new ParamSetting(batterySettingsPanel, 'batChargeSaturation', {type: 'inputNumber', title: 'Charge Saturation', ctrlInfo: "0-10"});
        this.params.batGroupNumber = new ParamSetting(batterySettingsPanel, 'batGroupNumber', {type: 'inputNumber', title: 'Group Number', ctrlInfo: "0-100"});
        this.params.batUnitNumber = new ParamSetting(batterySettingsPanel, 'batUnitNumber', {type: 'inputNumber', title: 'Unit Number', ctrlInfo: "0-50000"});
        this.params.batCapacity = new ParamSetting(batterySettingsPanel, 'batCapacity', {type: 'inputNumber', title: 'Rated Capacity', ctrlInfo: "0-50000 in Ah"});
        this.params.chargeCurrentLimit = new ParamSetting(batterySettingsPanel, 'chargeCurrentLimit', {type: 'inputNumber', title: 'Charge Current Limit', ctrlInfo: "0-1000A (Works in all modes - triggers error)"});
        this.params.dischargeCurrentLimit = new ParamSetting(batterySettingsPanel, 'dischargeCurrentLimit', {type: 'inputNumber', title: 'Discharge Current Limit', ctrlInfo: "0-1000A (Works in all modes - triggers error)"});




        let pvSettingsPanel = this.settingsAccordion.getTabContent(2);
        this.params.maxDcVoltagePv = new ParamSetting(pvSettingsPanel, 'maxDcVoltagePv', {type: 'inputNumber', title: 'Max PV voltage', ctrlInfo: "X"});
        this.params.powerOnDetectionTime = new ParamSetting(pvSettingsPanel, 'powerOnDetectionTime', {type: 'inputNumber', title: 'Power On Detection Time', ctrlInfo: "X"});
        this.params.shadowVoltageChange = new ParamSetting(pvSettingsPanel, 'shadowVoltageChange', {type: 'inputNumber', title: 'Shadow Voltage Change', ctrlInfo: "X"});
        this.params.outputPowerUpperLimit = new ParamSetting(pvSettingsPanel, 'outputPowerUpperLimit', {type: 'inputNumber', title: 'Output Power Upper Limit', ctrlInfo: "X"});
        this.params.outputPowerSetting = new ParamSetting(pvSettingsPanel, 'outputPowerSetting', {type: 'inputNumber', title: 'Output Power Setting', ctrlInfo: "X"});
        this.params.powerOnVoltage = new ParamSetting(pvSettingsPanel, 'powerOnVoltage', {type: 'inputNumber', title: 'Power On Voltage', ctrlInfo: "X"});
        this.params.mpptUpperLimitVoltage = new ParamSetting(pvSettingsPanel, 'mpptUpperLimitVoltage', {type: 'inputNumber', title: 'Mppt Upper Limit Voltage', ctrlInfo: "X"});
        this.params.mpptLowerLimitVoltage = new ParamSetting(pvSettingsPanel, 'mpptLowerLimitVoltage', {type: 'inputNumber', title: 'Mppt Lower Limit Voltage', ctrlInfo: "X"});
        this.params.startupPower = new ParamSetting(pvSettingsPanel, 'startupPower', {type: 'inputNumber', title: 'Startup Power', ctrlInfo: ""});




        let gridSettingsPanel = this.settingsAccordion.getTabContent(3);

        this.params.dgEnable = new ParamSetting(gridSettingsPanel, 'dgEnable', {type: 'switch', title: 'Diesel Generator', ctrlInfo: "Enable if a Diesel Generator is connected to the Grid terminals of the inverter"});
        this.params.dgStartingTime = new ParamSetting(gridSettingsPanel, 'dgStartingTime', {type: 'inputNumber', title: 'Generator starting time', ctrlInfo: "Time for inverter to use generator power once it has started up"});
        this.params.dgMaxPower = new ParamSetting(gridSettingsPanel, 'dgMaxPower', {type: 'inputNumber', title: 'Generator Max Power', ctrlInfo: "Generated Maximum power in kW"});
        this.params.upperLimitGridPower = new ParamSetting(gridSettingsPanel, 'upperLimitGridPower', {type: 'inputNumber', title: 'Upper Limit Grid Power', ctrlInfo: " This setting applies when mode is set to Peak Shaving 0-500    1kW"});
        this.params.bypassEnable = new ParamSetting(gridSettingsPanel, 'bypassEnable', {type: 'switch', title: 'bypass Enable', ctrlInfo: ""});
        this.params.maxVoltageBypass = new ParamSetting(gridSettingsPanel, 'maxVoltageBypass', {type: 'inputNumber', title: 'Max bypass voltage', ctrlInfo: "X"});
        this.params.minVoltageBypass = new ParamSetting(gridSettingsPanel, 'minVoltageBypass', {type: 'inputNumber', title: 'Min bypass voltage', ctrlInfo: "X"});
        this.params.maxFrequencyBypass = new ParamSetting(gridSettingsPanel, 'maxFrequencyBypass', {type: 'inputNumber', title: 'Max Bypass Frequency', ctrlInfo: "X"});
        this.params.minFrequencyBypass = new ParamSetting(gridSettingsPanel, 'minFrequencyBypass', {type: 'inputNumber', title: 'Min Bypass Frequency', ctrlInfo: "X"});
        this.params.gfciEnable = new ParamSetting(gridSettingsPanel, 'gfciEnable', {type: 'switch', title: 'GFCI', ctrlInfo: "Grid fault circuit interrupter"});
        this.params.gfdiEnable = new ParamSetting(gridSettingsPanel, 'gfdiEnable', {type: 'switch', title: 'GFDI', ctrlInfo: "Grid fault Detector interrupter"});
        this.params.gfdiGroundedSelection = new ParamSetting(gridSettingsPanel, 'gfdiGroundedSelection', {type: 'switch', title: 'GFDI Grounded Selection', ctrlInfo: ""});
        this.params.gfdiGroundedSelection = new ParamSetting(gridSettingsPanel, 'gfdiGroundedSelection', {type: 'dropDown', title: 'GFDI Grounded Selection', ctrlInfo: "", dropDownConf: {
                options: [
                    {label: 'Ungrounded', value: '0'},
                    {label: 'Grounded', value: '1'},
                ]
            }
        });
        this.params.islandingProtection = new ParamSetting(gridSettingsPanel, 'islandingProtection', {type: 'switch', title: 'Anti Islanding', ctrlInfo: "Inverter disconnects from grid in the event of grid abnormality"});
        this.params.antiRefluxEnable = new ParamSetting(gridSettingsPanel, 'antiRefluxEnable', {type: 'switch', title: 'Anti Reflux', ctrlInfo: "Zero export"});
        this.params.gridManagementEnable = new ParamSetting(gridSettingsPanel, 'gridManagementEnable', {type: 'switch', title: 'Grid Management', ctrlInfo: "Grid management"});
        this.params.insulationImpedenceTestEnable = new ParamSetting(gridSettingsPanel, 'insulationImpedenceTestEnable', {type: 'switch', title: 'Insulation Impedence Test', ctrlInfo: ""});
        this.params.lvrtEnable = new ParamSetting(gridSettingsPanel, 'lvrtEnable', {type: 'switch', title: 'LVRT', ctrlInfo: "Low voltage ride through"});
        this.params.activePowerRegulationEnable = new ParamSetting(gridSettingsPanel, 'activePowerRegulationEnable', {type: 'switch', title: 'Active Power Regulation', ctrlInfo: ""});
        this.params.reactivePowerRegulationEnable = new ParamSetting(gridSettingsPanel, 'reactivePowerRegulationEnable', {type: 'switch', title: 'Reactive Power Regulation', ctrlInfo: ""});
        this.params.gridCompensatePower = new ParamSetting(gridSettingsPanel, 'gridCompensatePower', {type: 'inputNumber', title: 'Grid Compensation Power', ctrlInfo: "X"});




        let inverterSettingsPanel = this.settingsAccordion.getTabContent(4);
        this.params.outputVoltageSetting = new ParamSetting(inverterSettingsPanel, 'outputVoltageSetting', {type: 'inputNumber', title: 'Output Voltage', ctrlInfo: "Inverter AC output voltage (380V or 400V)"});
        this.params.outputFrequencySetting = new ParamSetting(inverterSettingsPanel, 'outputFrequencySetting', {type: 'inputNumber', title: 'Output Frequency', ctrlInfo: "Inverter AC output frequency (50Hz or 60Hz)"});
        this.params.maxLoadPower = new ParamSetting(inverterSettingsPanel, 'maxLoadPower', {type: 'inputNumber', title: 'Maximum Load Power', ctrlInfo: ""});
        this.params.minLoadPower = new ParamSetting(inverterSettingsPanel, 'minLoadPower', {type: 'inputNumber', title: 'Minimum Load Power', ctrlInfo: ""});










    }


    $(document).ready(function () {
        root.atessHpsGUI = new AtessHpsGUI();
    });
}(window));
