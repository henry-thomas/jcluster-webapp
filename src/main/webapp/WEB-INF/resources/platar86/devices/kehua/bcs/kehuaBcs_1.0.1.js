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
/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, fetch, hh, panelContainer, paramDesc, pm, dm */


var kbcs = {
    flags: {},
    panel: {},
    comp: {
        dataCard: {}
    }

};

kbcs.initHtmlData = function (tabCont) {
    //AC info
    let cont = kbcs.comp.dataCard.total = hh.createActDataPanelCard("Total Data", null, tabCont);
    cont.addField("runState", "Runing State", {datamap: {'0': 'Standby', '1': 'Run', '2': 'Fault'}});
    cont.addField("opMode", "Operation Mode", {datamap: {'0': 'On-grid', '1': 'Off-grid'}});

    cont.addField("activePower", "Active Power", 'W', {decimal: 1, sIPrefix: 'k'});
    cont.addField("apparentPower", "Apparent Power", 'VA', {decimal: 1, sIPrefix: 'k'});
    cont.addField("reactivePower", "Reactive Power", 'VAR', {decimal: 1, sIPrefix: 'k'});
    cont.addField("availablePower", "Available Power", 'VA', {decimal: 1, sIPrefix: 'k'});

    cont.addField("emsControlPower", "EMS Control", 'W', {decimal: 1, sIPrefix: 'k'});
    cont.addField("gridFreq", "Grid Frequency", 'Hz', {decimal: 1});
    cont.addField("offgridFreq", "Off-grid Frequency", 'Hz', {decimal: 1});
    cont.addField("heatExchTemp", "Heat Exchange Temp", 'DegC', {decimal: 1});
    cont.addField("innerTemp", "Inverter Temp", 'DegC', {decimal: 1});
    cont.addField("loadCapa", "Load Capacity", '%', {decimal: 1});
    cont.addField("remoteControlStat", "Remote Control Status", {datamap: {'0': 'Off', '1': 'On'}});
    new SMDUIDockingCard(cont);


    //AC info
    cont = kbcs.comp.dataCard.ac = hh.createActDataPanelCard("AC Basic", null, tabCont);
    cont.addField("phU_outputVolt", "Voltage U", 'V', {decimal: 1});
    cont.addField("phV_outputVolt", "Voltage V", 'V', {decimal: 1});
    cont.addField("phW_outputVolt", "Voltage W", 'V', {decimal: 1});

    cont.addField("phU_A", "Current U", 'A', {decimal: 1});
    cont.addField("phV_A", "Current V", 'A', {decimal: 1});
    cont.addField("phW_A", "Current W", 'A', {decimal: 1});


    cont.addField("phU_actPower", "Active Poewer U", 'W', {decimal: 1, sIPrefix: 'k'});
    cont.addField("phV_actPower", "Active Poewer V", 'W', {decimal: 1, sIPrefix: 'k'});
    cont.addField("phW_actPower", "Active Poewer W", 'W', {decimal: 1, sIPrefix: 'k'});
    new SMDUIDockingCard(cont);


    //BAT info
    cont = kbcs.comp.dataCard.dc = hh.createActDataPanelCard("DC Inverter Info", null, tabCont);
    cont.addField("dcCurrent", "DC Current", 'A', {decimal: 1});
    cont.addField("dcPower", "DC Power", 'W', {decimal: 1});
    cont.addField("dcVolt", "DC Voltage", 'V', {decimal: 1});

    cont.addHeaderTitle("DC BMS Info");
    cont.addField("bmsStat", "BMS Status", {formatter: (val) => {
            switch (val) {
                case 0:
                    return 'Initial Status';
                case 1:
                    return 'Normal Status';
                case 2:
                    return 'No Charging';
                case 3:
                    return 'No Discharging';
                case 4:
                    return 'Alarm';
                case 5:
                    return 'Fault';
                case 6:
                    return 'Standby';
                default:
                    return 'Unknown Status ' + val;
            }
        }});
    cont.addField("bmsCurrent", "DC Current", 'A', {decimal: 1});
    cont.addField("bmsVolt", "DC Voltage", 'V', {decimal: 1});

    cont.addField("bmsSoC", "SoC", '%', {decimal: 1});
    cont.addField("bmsSoH", "SoH", '%', {decimal: 1});

    cont.addHeaderTitle("BMS Control Limits");
    cont.addField("bmsChLimCur", "Charge Limit Current", 'A', {decimal: 1});
    cont.addField("bmsChLimVolt", "Charge Limit Voltage", 'V', {decimal: 1});
    cont.addField("bmsDischLimCur", "Discharge Limit Current", 'A', {decimal: 1});
    cont.addField("bmsDischLimVolt", "Discharge Limit Voltage", 'V', {decimal: 1});
    new SMDUIDockingCard(cont);



    //AC Detail
    cont = kbcs.comp.dataCard.acDetail = hh.createActDataPanelCard("AC Detail", null, tabCont);
    cont.addField("phU_appPower", "Apparent Poewer U", 'VA', {decimal: 1, sIPrefix: 'k'});
    cont.addField("phV_appPower", "Apparent Poewer V", 'VA', {decimal: 1, sIPrefix: 'k'});
    cont.addField("phW_appPower", "Apparent Poewer W", 'VA', {decimal: 1, sIPrefix: 'k'});

    cont.addField("phU_invVolt", "Inverter Voltage U", 'V', {decimal: 1});
    cont.addField("phV_invVolt", "Inverter Voltage V", 'V', {decimal: 1});
    cont.addField("phW_invVolt", "Inverter Voltage W", 'V', {decimal: 1});

    cont.addField("phU_loadCapa", "Load Capacity U", '%', {decimal: 0});
    cont.addField("phV_loadCapa", "Load Capacity V", '%', {decimal: 0});
    cont.addField("phW_loadCapa", "Load Capacity W", '%', {decimal: 0});

    cont.addField("phU_PF", "Power Factor U", 'PF', {decimal: 2});
    cont.addField("phV_PF", "Power Factor V", 'PF', {decimal: 2});
    cont.addField("phW_PF", "Power Factor W", 'PF', {decimal: 2});
    new SMDUIDockingCard(cont);

    //Counters
    cont = kbcs.comp.dataCard.counters = hh.createActDataPanelCard("Energy Counters", null, tabCont);
    cont.addField("dailyCharge", "Daily Charge", 'Wh', {decimal: 1});
    cont.addField("dailyDischarge", "Daily Disharge", 'Wh', {decimal: 1});
    cont.addField("dailyGains", "Daily gains", '', {decimal: 1});
    cont.addField("totalCharge", "Voltage U", 'V', {decimal: 1});
    cont.addField("totalDischarge", "Voltage U", 'V', {decimal: 1});
    cont.addField("totalGains", "Voltage U", 'V', {decimal: 1});
    cont.addHeaderTitle("Battery Available Energy");
    cont.addField("chargeAvailableEnergy", "Charge", 'Wh', {decimal: 1, sIPrefix: 'k'});
    cont.addField("dischargeAvailableEnergy", "Discharge", 'Wh', {decimal: 1, sIPrefix: 'k'});
    new SMDUIDockingCard(cont);
};

kbcs.initHtmlEmsParam = function (cont) {
    new ParamSetting(cont, 'emsParam.emsMaxPowerPer', {type: 'inputNumber', title: 'Maximum EMS Power:', unit: '%', ctrlInfo: 'Maximum power restriction for EMS, value in % of rated Power.'});
    new ParamSetting(cont, 'emsParam.emsMinPowerPer', {type: 'inputNumber', title: 'Minimum EMS Power:', unit: '%', ctrlInfo: 'Minimum power restriction for EMS, value in % of rated Power.'});
    new ParamSetting(cont, 'emsParam.emsChnageRatioPer', {type: 'inputNumber', title: 'Change Ratio:', unit: '%', ctrlInfo: 'This parameter is used to limit the overshooting and oscilating of the inverter power.'});

    new ParamSetting(cont, 'emsParam.emsNotActiveState', {type: 'inputNumber', title: 'EMS Not Active State:', ctrlInfo: ''});
    new ParamSetting(cont, 'emsParam.emsNotActivePower', {type: 'inputNumber', title: 'EMS Not Active Power:', unit: '%', ctrlInfo: ''});

    new ParamSetting(cont, 'busName', {type: 'inputText', title: 'DC BUS Name:', ctrlInfo: 'Used to link inverter with battery info.'});

    new ParamSetting(cont, 'emsParam.emsAllowOnOff', {type: 'switch', title: 'Allow Ems Inverter State Control:', ctrlInfo: 'This parameter, when enabled, allows EMS to turn the inverter on and off.'});
    new ParamSetting(cont, 'emsParam.emsAllowOnGridModeChange', {type: 'switch', title: 'Allow EMS On-grid charge/discharge mode change:', ctrlInfo: 'This parameter when enabled, allows EMS to change On-grid charge/discharge mode.'});
    new ParamSetting(cont, 'emsParam.emsAllowOpModeChange', {type: 'switch', title: 'Allow Ems On/Off-grid mode setting change:', ctrlInfo: 'This parameter when enabled, allows EMS to change On/Off-grid mode setting.'});
};

kbcs.initHtmlParamAdvanced = function (cont) {
//    hh.pPanelAddDescTitle(cont, 'Battery Critical Low Limit Settings.');


    new ParamSetting(cont, 'reactivePowerSetting', {type: 'inputNumber', title: 'Reactive Power:', unit: 'VAR', ctrlInfo: 'Reactive power value in VAR.'});

    new ParamSetting(cont, 'reactiveRunnningMode', {type: 'dropDown', title: 'Reactive Runnning Mode:', unit: '', ctrlInfo: '.',
        dropDownConf: {options: [{label: 'Fixed reactive power', value: 0}, {label: 'Fixed power factor', value: 1}]}
    });

    new ParamSetting(cont, 'emergencyPowerValue', {type: 'inputNumber', title: 'Emergency Power:', unit: 'W', ctrlInfo: 'Positive: output active, negative: input active'});
    new ParamSetting(cont, 'autoSwitchMode', {type: 'dropDown', title: 'Auto Switch Mode:', unit: '', ctrlInfo: '.',
        dropDownConf: {options: [{label: 'Off', value: 0}, {label: 'On', value: 1}]}
    });
    new ParamSetting(cont, 'powerFactor', {
        type: 'inputText', title: 'Power Factor:', ctrlInfo: '-1.00 to +1.00',
        inputTextConf: {type: 'number', decimals: 2, min: -1, max: 1},
        unit: 'PF'});
    new ParamSetting(cont, 'manualOnOffGridMode', {type: 'dropDown', title: 'Auto Switch Mode:', unit: '', ctrlInfo: '.',
        dropDownConf: {options: [{label: 'On-grid', value: 0}, {label: 'Off-grid', value: 1}]}
    });
    new ParamSetting(cont, 'antiIslading', {type: 'dropDown', title: 'Active Island:', unit: '', ctrlInfo: '.',
        dropDownConf: {options: [{label: 'Disabled', value: 0}, {label: 'Enabled', value: 1}]}
    });
    new ParamSetting(cont, 'planCurveRun', {type: 'dropDown', title: 'Plan Curve Run:', unit: '', ctrlInfo: '.',
        dropDownConf: {options: [{label: 'On', value: 0}, {label: 'Off', value: 1}]}
    });
    new ParamSetting(cont, 'mpptMode', {type: 'dropDown', title: 'MPPT Mode:', unit: '', ctrlInfo: '.',
        dropDownConf: {options: [{label: 'Off', value: 0}, {label: 'On', value: 1}]}
    });
};

kbcs.initHtmlParamBasic = function (cont) {

    new ParamSetting(cont, 'stateControl', {type: 'dropDown', title: 'Inverter Operation State:', unit: '', ctrlInfo: '.',
        dropDownConf: {options: [{label: 'Off', value: 0}, {label: 'On', value: 1}]}
    });
    new ParamSetting(cont, 'activePowerSettings', {type: 'inputNumber', title: 'Active Power:', unit: 'W', ctrlInfo: 'Positive: Grid export (Battery discharge), negative: Grid import (Battery charge)).'});


    new ParamSetting(cont, 'runningMode', {type: 'dropDown', title: 'Running Mode:', unit: '', ctrlInfo: '.',
        dropDownConf: {options: [{label: 'Constant Power', value: 0}, {label: 'Constant Current', value: 1}]}
    });

    new ParamSetting(cont, 'constantCurrent', {
        type: 'inputNumber', title: 'Constant Current:', ctrlInfo: '-400.0 to +400.0',
        inputNumberConf: {type: 'number', decimals: 1, min: -400, max: 400},
        unit: 'A'});



};

kbcs.initHtmlParam = function (tabCont) {

    let acordPanel = kbcs.comp.settingsAccordionPanel = new SMDUIAccordianPanel(tabCont, {tabs: [
            {label: 'Basic', id: 'basic'},
            {label: 'Ems', id: 'ems'},
            {label: 'Advanced', id: 'advanced'}

        ], selectedTab: 'basic'});

    kbcs.initHtmlEmsParam(acordPanel.getTabContentById('ems'));
    kbcs.initHtmlParamBasic(acordPanel.getTabContentById('basic'));
    kbcs.initHtmlParamAdvanced(acordPanel.getTabContentById('advanced'));



};

kbcs.initHtml = function () {
    kbcs.comp.mainTabPanel = new TabPanel(dgm.contentPanel, {
        menuItem: [
            {label: "Device Info", id: 'devInfo'},
            {label: "Actual Data", id: 'actualData'},
            {label: "Settings", id: 'settings'}
        ],
        stickyMenu: true,
        initSelect: 'settings'

    });

    let devInfo = kbcs.comp.mainTabPanel.getItemContentById('devInfo');
    devInfo.classList.add('actDataContainer');
    let cont = kbcs.comp.dataCard.devInfo = hh.createActDataPanelCard("Device Info", null, devInfo);
    cont.addField("deviceName", "Model:");
    cont.addField("manufacturer", "Manufacturer:");
    cont.addField("fwVer", "Firmware Version:");
    cont.addField("hwVer", "Hardware Version:");
    cont.addField("hmiVer", "HMI Version:");
    cont.addField("comPort", "COM Port:");
    cont.addField("modbusAddress", "Modbus Address:");
    cont.addField("modbusSpeed", "COM Baudrate:");


    let tabCont = kbcs.comp.mainTabPanel.getItemContentById('actualData');
    tabCont.classList.add('actDataContainer');
    kbcs.initHtmlData(tabCont);

    let settingsTab = kbcs.comp.mainTabPanel.getItemContentById('settings');
//    tabCont.classList.add('actDataContainer');
    kbcs.initHtmlParam(settingsTab);

};

dm.onParamReceived((dev, param) => {
//    let settingsPanel = kbcs.comp.mainTabPanel.getItemContentById('settings');
//    pm.loadParamDescriptor(paramDesc, settingsPanel);
    kbcs.comp.dataCard.devInfo.updateFields(param);
    kbcs.comp.dataCard.devInfo.updateFields(dev);
});

dm.onDataReceived((dev, data) => {

    for (var item in kbcs.comp.dataCard) {
        kbcs.comp.dataCard[item].updateFields(data);
    }

});

document.addEventListener("DOMContentLoaded", function (event) {
    kbcs.initHtml();
});