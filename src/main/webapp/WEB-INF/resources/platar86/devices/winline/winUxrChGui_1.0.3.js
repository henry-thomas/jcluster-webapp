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


/* global hh, wsm, this */

(function (root) {
    function WinUxrGui() {
        this.dataFields = {};
        this.generalInfo = {};
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
                    label: "Actual Data",
                    id: 'devData'
                },
                {
                    label: "Module Settings",
                    id: 'settings'
                },
                {
                    label: "Cluster Settings",
                    id: 'clusterSettings'
                },
                {
                    label: "Temp Live Chart",
                    id: 'winlineLiveChart',
                    onInitClickCb: enableRecordings.bind(this, recValues)
                },
            ]
        });

        this.devInfo = this.mainTabPanel.getItemContentById('info');
        this.dataContent = this.mainTabPanel.getItemContentById('devData');
        this.settingsContent = this.mainTabPanel.getItemContentById('settings');
        this.clusterSettingsContent = this.mainTabPanel.getItemContentById('clusterSettings');

        this.dataContent.classList.add('actDataContainer');
        this.devInfo.classList.add('actDataContainer');
//        this.otherInfoContent.classList.add('actDataContainer');
        _initGui.call(this);
    }

    function _initGui() {
        this.dataFields = {};
        this.dataFields.chargePower = {};


//        this.todoCard = hh.createActDataPanelCard('To Do', null, this.devInfo);

        this.devInfoCard = hh.createActDataPanelCard('General Info', null, this.devInfo);
        this.dataFields.serialNumber = hh.adf(this.devInfoCard, "Serial Number", "");
        this.dataFields.ratedPowerW = hh.adf(this.devInfoCard, "Rated Max Power", "W", {decimal: 2, sIPrefix: true});
        this.dataFields.manufacturer = hh.adf(this.devInfoCard, "Manufacturer", "");
        this.dataFields.ratedCurrent = hh.adf(this.devInfoCard, "Rated Max Current", "A", {decimal: 2});

        this.chargePowerCard = hh.createActDataPanelCard('Charger Data', null, this.dataContent);
        this.dataFields.powerLimitW = hh.adf(this.chargePowerCard, "Power Limit", "W", {decimal: 2, sIPrefix: true});
        this.dataFields.chargePower.powerW = hh.adf(this.chargePowerCard, "DC Power", "W", {decimal: 2, sIPrefix: true});
        this.dataFields.chargePower.voltageV = hh.adf(this.chargePowerCard, "DC Voltage", "V", {decimal: 2});
        this.dataFields.chargePower.currentA = hh.adf(this.chargePowerCard, "DC Current", "A", {decimal: 2});
        this.dataFields.currentLimitA = hh.adf(this.chargePowerCard, "DC Current Limit", "A", {decimal: 2});
        this.dataFields.upperVoltageLimitV = hh.adf(this.chargePowerCard, "Upper Voltage Limit", "V", {decimal: 2});
        this.dataFields.inputPower = hh.adf(this.chargePowerCard, "Input Power", "W", {decimal: 2, sIPrefix: true});
        this.dataFields.pfc0 = hh.adf(this.chargePowerCard, "PFC 0 Voltage", "V", {decimal: 2, sIPrefix: true});
        this.dataFields.pfc1 = hh.adf(this.chargePowerCard, "PFC 1 Voltage", "V", {decimal: 2, sIPrefix: true});

        this.sysemDataCard = hh.createActDataPanelCard('System Data', null, this.dataContent);
        this.dataFields.pfcTemp = hh.adf(this.sysemDataCard, "PFC Temp", "\xB0C", {decimal: 2});
        this.dataFields.envTempC = hh.adf(this.sysemDataCard, "Env Temp", "\xB0C", {decimal: 2, sIPrefix: true});
        this.dataFields.dcdcTempC = hh.adf(this.sysemDataCard, "DC-DC Temp", "\xB0C", {decimal: 2, sIPrefix: true});
        this.dataFields.dialSwitchAddress = hh.adf(this.sysemDataCard, "Dial Switch Address", "");
        this.dataFields.ph1V = hh.adf(this.sysemDataCard, "Phase 1 Voltage", "V", {decimal: 2});
        this.dataFields.ph2V = hh.adf(this.sysemDataCard, "Phase 2 Voltage", "V", {decimal: 2});
        this.dataFields.ph3V = hh.adf(this.sysemDataCard, "Phase 3 Voltage", "V", {decimal: 2});
        this.dataFields.acVoltageV = hh.adf(this.sysemDataCard, "AC Integrated Voltage", "V", {decimal: 2});
        this.dataFields.acCurrentA = hh.adf(this.sysemDataCard, "AC Current", "A", {decimal: 2});
        this.dataFields.acPowerW = hh.adf(this.sysemDataCard, "AC Power", "W", {decimal: 2});



        this.modSettingsAcc = new SMDUIAccordianPanel(this.settingsContent, {
            tabs: [
                {
                    label: 'Operational Settings' //item 0
                },
                {
                    label: 'Advanced Settings' //item 1
                },
            ],
            selectedTab: 0
        });

        this.clustSettingsAcc = new SMDUIAccordianPanel(this.clusterSettingsContent, {
            tabs: [
                {
                    label: 'Operational Settings' //item 0
                },
                {
                    label: 'Advanced Settings' //item 1
                },
            ],
            selectedTab: 0
        });



        let opPanel = this.modSettingsAcc.getTabContent(0);
        let advPanel = this.modSettingsAcc.getTabContent(1);

        let clustOpPanel = this.clustSettingsAcc.getTabContent(0);
        let clustAdvPanel = this.clustSettingsAcc.getTabContent(1);
//        let moduleParametersPanel = this.settingsAccordion.getTabContent(1);

        hh.pPanelAddDescTitle(opPanel, "Module Charge Parameters");
        this.params.moduleOnOff = new ParamSetting(opPanel, 'moduleOnOff',
                {
                    type: 'dropDown',
                    title: 'On/Off',
                    ctrlInfo: "",
                    dropDownConf: {
                        options: [
                            {label: 'Enable', value: '0'},
                            {label: 'Disable', value: 0x00010000}
                        ]
                    }
                });



        this.params.moduleVoltage = new ParamSetting(opPanel, 'moduleVoltage',
                {
                    type: 'inputNumber',
                    title: 'Module Voltage',
                    ctrlInfo: "",
                    unit: "V"
                });


        this.params.outputCurrent = new ParamSetting(opPanel, 'outputCurrent',
                {
                    type: 'inputNumber',
                    title: 'Output Current',
                    ctrlInfo: "",
                    unit: "A"
                });
        this.params.workingAltitude = new ParamSetting(opPanel, 'workingAltitude',
                {
                    type: 'inputNumber',
                    title: 'Working Altitude',
                    ctrlInfo: "",
                    unit: "m"
                });
        this.params.dcBusName = new ParamSetting(opPanel, 'dcBusName',
                {
                    type: 'inputText',
                    title: 'DC Bus Name',
                    ctrlInfo: "",
                    unit: ""
                });
        this.params.groupId = new ParamSetting(advPanel, 'groupId',
                {
                    type: 'inputNumber',
                    title: 'Group Id',
                    ctrlInfo: "",
                    unit: ""
                });
        this.params.defModCurrentLimit = new ParamSetting(advPanel, 'defModCurrentLimit',
                {
                    type: 'inputNumber',
                    title: 'Default Module Current Limit',
                    ctrlInfo: "0.01-1.05",
                    unit: ""
                });
        this.params.modCurrentLimit = new ParamSetting(advPanel, 'modCurrentLimit',
                {
                    type: 'inputNumber',
                    title: 'Module Current Limit',
                    ctrlInfo: "",
                    unit: "A"
                });
        this.params.maxVoltageSetpoint = new ParamSetting(advPanel, 'maxVoltageSetpoint',
                {
                    type: 'inputNumber',
                    title: 'Max Voltage Setpoint',
                    ctrlInfo: "",
                    unit: "V"
                });
        this.params.moduleAddressMethod = new ParamSetting(advPanel, 'moduleAddressMethod',
                {
                    type: 'dropDown',
                    title: 'Module Address Method',
                    ctrlInfo: "",
                    dropDownConf: {
                        options: [
                            {label: 'Auto', value: '0'},
                            {label: 'Switch', value: 0x00010000}
                        ]
                    }
                });
        this.params.enableOverVoltageReset = new ParamSetting(advPanel, 'enableOverVoltageReset',
                {
                    type: 'dropDown',
                    title: 'Over Voltage Reset',
                    ctrlInfo: "",
                    dropDownConf: {
                        options: [
                            {label: 'Enable', value: 0x00010000},
                            {label: 'Disable', value: '0'}
                        ]
                    }
                });
        this.params.enableOverVoltageProtection = new ParamSetting(advPanel, 'enableOverVoltageProtection',
                {
                    type: 'dropDown',
                    title: 'Over Voltage Protection',
                    ctrlInfo: "",
                    dropDownConf: {
                        options: [
                            {label: 'Enable', value: '0'},
                            {label: 'Disable', value: 0x00010000}
                        ]
                    }
                });
        this.params.enableSCReset = new ParamSetting(advPanel, 'enableSCReset',
                {
                    type: 'dropDown',
                    title: 'SC Reset',
                    ctrlInfo: "",
                    dropDownConf: {
                        options: [
                            {label: 'Enable', value: '0'},
                            {label: 'Disable', value: '2'}
                        ]
                    }
                });
        this.params.inputMode = new ParamSetting(advPanel, 'inputMode',
                {
                    type: 'dropDown',
                    title: 'Input Mode',
                    ctrlInfo: "",
                    dropDownConf: {
                        options: [
                            {label: 'AC', value: '1'},
                            {label: 'DC', value: '2'}
                        ]
                    }
                });
        this.params.recordPower = new ParamSetting(advPanel, 'recordPower',
                {
                    type: 'dropDown',
                    title: 'Record Power Data',
                    ctrlInfo: "",
                    dropDownConf: {
                        options: [
                            {label: 'Enable', value: 'true'},
                            {label: 'Disable', value: 'false'}
                        ]
                    }
                });


        this.params.clusterModuleOnOff = new ParamSetting(clustOpPanel, 'clusterModuleOnOff',
                {
                    type: 'dropDown',
                    title: 'Cluster On/Off',
                    ctrlInfo: "Power for all modules",
                    dropDownConf: {
                        options: [
                            {label: 'Enable', value: '0'},
                            {label: 'Disable', value: 0x00010000}
                        ]
                    }
                });
        this.params.clusterOutputCurrent = new ParamSetting(clustOpPanel, 'clusterOutputCurrent',
                {
                    type: 'inputNumber',
                    title: 'Cluster Output Current',
                    ctrlInfo: "Set output current for all modules",
                    unit: "A"
                });
        this.params.clusterModuleVoltage = new ParamSetting(clustOpPanel, 'clusterModuleVoltage',
                {
                    type: 'inputNumber',
                    title: 'Cluster Module Voltage',
                    ctrlInfo: "Set voltage for all modules",
                    unit: "V"
                });


        this.params.emsControlled = new ParamSetting(clustAdvPanel, 'emsControlled',
                {
                    type: 'dropDown',
                    title: 'EMS Controlled',
                    ctrlInfo: "Enable EMS Control",
                    dropDownConf: {
                        options: [
                            {label: 'Enable', value: true},
                            {label: 'Disable', value: false}
                        ]
                    }
                });
        this.params.emsMaxPower = new ParamSetting(clustAdvPanel, 'emsMaxPower',
                {
                    type: 'inputNumber',
                    title: 'EMS Max Power',
                    ctrlInfo: "",
                    unit: "W"
                });
        this.params.emsMinPower = new ParamSetting(clustAdvPanel, 'emsMinPower',
                {
                    type: 'inputNumber',
                    title: 'EMS Min Power',
                    ctrlInfo: "",
                    unit: "W"
                });
        this.params.clusterStepCurrentA = new ParamSetting(clustAdvPanel, 'clusterStepCurrentA',
                {
                    type: 'inputNumber',
                    title: 'Cluster Step Current',
                    ctrlInfo: "",
                    unit: "A"
                });
        this.params.clusterStepDelayMs = new ParamSetting(clustAdvPanel, 'clusterStepDelayMs',
                {
                    type: 'inputNumber',
                    title: 'Cluster Step Delay',
                    ctrlInfo: "",
                    unit: "ms"
                });

    }

    function sendMessage(msg) {
        wsm.sendDevMsgExecWithJsonInst(
                msg,
                function (message, response) {
                    console.log("Result: ", response);
                },
                function (message, error) {
                    console.warn("Response Error: " + error);
                },
                3000);
    }


    $(document).ready(function () {
        root.winUxrGui = new WinUxrGui();
    });
})(window);