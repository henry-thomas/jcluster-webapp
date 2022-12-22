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


/* global hh, wsm */

(function (root) {
    function InfyGui() {
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
                    label: "Device Data",
                    id: 'devData'
                },
                {
                    label: "Settings",
                    id: 'settings'
                }
            ]
        });

        this.devInfo = this.mainTabPanel.getItemContentById('info');
        this.dataContent = this.mainTabPanel.getItemContentById('devData');
        this.settingsContent = this.mainTabPanel.getItemContentById('settings');

        this.dataContent.classList.add('actDataContainer');
        this.devInfo.classList.add('actDataContainer');
//        this.otherInfoContent.classList.add('actDataContainer');
        _initGui.call(this);
    }

    function _initGui() {
        this.dataFields = {};
        this.dataFields.chargePower = {};


        this.devInfoCard = hh.createActDataPanelCard('General Info', null, this.devInfo);
        this.dataFields.serialNumber = hh.adf(this.devInfoCard, "Serial Number", "");
        this.dataFields.envTempC = hh.adf(this.devInfoCard, "Env Temp", "\xB0C", {decimal: 2, sIPrefix: true});
        this.dataFields.ratedMaxPowerW = hh.adf(this.devInfoCard, "Rated Max Power", "W", {decimal: 2, sIPrefix: true});
        this.dataFields.ratedMaxCurrentA = hh.adf(this.devInfoCard, "Rated Max Current", "A", {decimal: 2});
        this.dataFields.ratedMaxVoltageV = hh.adf(this.devInfoCard, "Rated Max Voltage", "V", {decimal: 2});
        this.dataFields.ratedminVoltageV = hh.adf(this.devInfoCard, "Rated Min Voltage", "V", {decimal: 2});
        this.dataFields.dcDcSwVer = hh.adf(this.devInfoCard, "DC DC Sofware Version", "", {decimal: 2});

        this.chargePowerCard = hh.createActDataPanelCard('Charging Data', null, this.dataContent);
        this.dataFields.chargePower.powerW = hh.adf(this.chargePowerCard, "Charge Power", "W", {decimal: 2, sIPrefix: true});
        this.dataFields.chargePower.voltageV = hh.adf(this.chargePowerCard, "Charge Voltage", "V", {decimal: 2});
        this.dataFields.chargePower.currentA = hh.adf(this.chargePowerCard, "Charge Current", "A", {decimal: 2});

        this.sysemDataCard = hh.createActDataPanelCard('System Data', null, this.dataContent);
        this.dataFields.phVoltageAB = hh.adf(this.sysemDataCard, "Phase 1-2 Voltage", "V", {decimal: 2});
        this.dataFields.phVoltageBC = hh.adf(this.sysemDataCard, "Phase 2-3 Voltage", "V", {decimal: 2});
        this.dataFields.phVoltageCA = hh.adf(this.sysemDataCard, "Phase 3-1 Voltage", "V", {decimal: 2});
        this.dataFields.voltageExt = hh.adf(this.sysemDataCard, "Voltage Ext", "V", {decimal: 2});
        this.dataFields.currentAvail = hh.adf(this.sysemDataCard, "Current Available", "A", {decimal: 2});



        this.settingsAccordion = new SMDUIAccordianPanel(this.settingsContent, {
            tabs: [
                {
                    label: 'System Settings' //item 0
                }
            ],
            selectedTab: 0
        });



        let systemSetPanel = this.settingsAccordion.getTabContent(0);
        let moduleParametersPanel = this.settingsAccordion.getTabContent(1);

        hh.pPanelAddDescTitle(systemSetPanel, "Charge Parameters");
        this.params.enable = new ParamSetting(systemSetPanel, 'enable',
                {
                    type: 'dropDown',
                    title: 'Enable',
                    ctrlInfo: "",
                    dropDownConf: {
                        options: [
                            {label: 'Enable', value: '0'},
                            {label: 'Disable', value: '1'}
                        ]
                    },
                    detached: true
                });
        this.params.recordPower = new ParamSetting(systemSetPanel, 'recordPower',
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
        this.params.setChargeVoltage = new ParamSetting(systemSetPanel, 'moduleVoltage',
                {
                    type: 'inputNumber',
                    title: 'Charge Voltage',
                    ctrlInfo: "",
                    unit: "V"
                });
        this.params.setChargeCurrent = new ParamSetting(systemSetPanel, 'modCurrentLimit',
                {
                    type: 'inputNumber',
                    title: 'Charge Current',
                    ctrlInfo: "",
                    unit: "A"
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
        root.infyGui = new InfyGui();
    });
})(window);