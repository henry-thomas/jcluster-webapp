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


/* global hhContentBuilder, hh, mainUtils, pm, AtessHpsGUI, this, molEm */


(function (root) {
    function MolEmGUI() {
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
        this.settingsContent = this.mainTabPanel.getItemContentById('settings');
        this.otherInfoContent = this.mainTabPanel.getItemContentById('otherInfo');

        this.dataContent.classList.add('actDataContainer');
        this.devInfo.classList.add('actDataContainer');
//        this.otherInfoContent.classList.add('actDataContainer');
        _initGui.call(this);
    }

    function createPowerCard(heading, powerObj) {
        let card = hh.createActDataPanelCard(heading, null, this.dataContent);
//        powerObj.powerName = hh.adf(card, "Power Name", "");
        powerObj.powerW = hh.adf(card, "Power", "W", {decimal: 2, sIPrefix: true});
        powerObj.voltageV = hh.adf(card, "Voltage", "V", {decimal: 2, sIPrefix: true});
        powerObj.currentA = hh.adf(card, "Current", "A", {decimal: 2, sIPrefix: true});
        powerObj.frequencyHz = hh.adf(card, "Frequency", "Hz", {decimal: 2, sIPrefix: true});
        powerObj.ratedPowerW = hh.adf(card, "Rated Power", "W", {decimal: 2});
        powerObj.energyWh = hh.adf(card, "Energy", "Wh", {decimal: 2, sIPrefix: true});
        powerObj.dailyEnergyWh = hh.adf(card, "Daily Energy", "Wh", {decimal: 2, sIPrefix: true});
        powerObj.weeklyEnergyWh = hh.adf(card, "Weekly Energy", "Wh", {decimal: 2, sIPrefix: true});
        powerObj.yearlyEnergyWh = hh.adf(card, "Yearly Energy", "Wh", {decimal: 2, sIPrefix: true});
        card.style.display = 'none';
        powerObj.card = card;
        return powerObj;
    }

    function _initGui() {
        this.dataFields = {};
        this.dataFields.pha1ExportPower = {};
        this.dataFields.pha1ImportPower = {};
        this.dataFields.pha2ExportPower = {};
        this.dataFields.pha2ImportPower = {};
        this.dataFields.pha3ExportPower = {};
        this.dataFields.pha3ImportPower = {};
        this.dataFields.sumExportPower = {};
        this.dataFields.sumImportPower = {};


        let generalInfo = hh.createActDataPanelCard('General Info', null, this.devInfo);
        this.generalInfo.deviceName = hh.adf(generalInfo, "Device Model", "");
        this.generalInfo.manufacturer = hh.adf(generalInfo, "Manufacturer", "");
        this.generalInfo.serialNumber = hh.adf(generalInfo, "Serial Number", "");
        this.paramData.voltageRange = hh.adf(generalInfo, "Voltage Range", "V", {datamap: {0: '100', 1: '230', 2: '400', 3: '127'}});
        this.paramData.currentRange = hh.adf(generalInfo, "Current Range", "A", {datamap: {0: '1.5', 1: '5', 2: '10'}});
        this.paramData.workMode = hh.adf(generalInfo, "Work Mode", "", {datamap: {0: 'V3P4', 1: 'V3P3'}});

        let comsInfo = hh.createActDataPanelCard('Comms Info', null, this.devInfo);
        let coms = hh.adf(comsInfo, "Device Model", "");
        coms.value = 'MODBUS RTU';
        this.paramData.comPort = hh.adf(comsInfo, "Com Port", "");
        this.paramData.modbusAddress = hh.adf(comsInfo, "Address", "");

        let sumImp = createPowerCard.call(this, "Sum (Importing)", this.dataFields.sumImportPower);
        this.dataFields.voltagePh12Imp = hh.adf(sumImp.card, 'Phase12 Voltage', "V", {decimal: 2, sIPrefix: true});
        this.dataFields.voltagePh23Imp = hh.adf(sumImp.card, 'Phase23 Voltage', "V", {decimal: 2, sIPrefix: true});
        this.dataFields.voltagePh31Imp = hh.adf(sumImp.card, 'Phase31 Voltage', "V", {decimal: 2, sIPrefix: true});
        this.dataFields.phaseAngle12Imp = hh.adf(sumImp.card, 'Phase12 Angle', "\xB0", {decimal: 2, sIPrefix: true});
        this.dataFields.phaseAngle23Imp = hh.adf(sumImp.card, 'Phase23 Angle', "\xB0", {decimal: 2, sIPrefix: true});
        this.dataFields.phaseAngle31Imp = hh.adf(sumImp.card, 'Phase31 Angle', "\xB0", {decimal: 2, sIPrefix: true});

        let sumExp = createPowerCard.call(this, "Sum (Exporting)", this.dataFields.sumExportPower);
        this.dataFields.voltagePh12Exp = hh.adf(sumExp.card, 'Phase12 Voltage', "V", {decimal: 2, sIPrefix: true});
        this.dataFields.voltagePh23Exp = hh.adf(sumExp.card, 'Phase23 Voltage', "V", {decimal: 2, sIPrefix: true});
        this.dataFields.voltagePh31Exp = hh.adf(sumExp.card, 'Phase31 Voltage', "V", {decimal: 2, sIPrefix: true});
        this.dataFields.phaseAngle12Exp = hh.adf(sumExp.card, 'Phase12 Angle', "\xB0", {decimal: 2, sIPrefix: true});
        this.dataFields.phaseAngle23Exp = hh.adf(sumExp.card, 'Phase23 Angle', "\xB0", {decimal: 2, sIPrefix: true});
        this.dataFields.phaseAngle31Exp = hh.adf(sumExp.card, 'Phase31 Angle', "\xB0", {decimal: 2, sIPrefix: true});

        createPowerCard.call(this, "Phase 1 (Importing)", this.dataFields.pha1ImportPower);
        createPowerCard.call(this, "Phase 1 (Exporting)", this.dataFields.pha1ExportPower);
        createPowerCard.call(this, "Phase 2 (Importing)", this.dataFields.pha2ImportPower);
        createPowerCard.call(this, "Phase 2 (Exporting)", this.dataFields.pha2ExportPower);
        createPowerCard.call(this, "Phase 3 (Importing)", this.dataFields.pha3ImportPower);
        createPowerCard.call(this, "Phase 3 (Exporting)", this.dataFields.pha3ExportPower);

        this.settingsAccordion = new SMDUIAccordianPanel(this.settingsContent, {
            tabs: [
                {
                    label: 'Operational Settings' //item 0
                },
                {
                    label: 'Data Parameters' //item 1
                }
            ],
            selectedTab: 0
        });



        let operationalSetPanel = this.settingsAccordion.getTabContent(0);
        let meterParametersPanel = this.settingsAccordion.getTabContent(1);
        hh.pPanelAddDescTitle(operationalSetPanel, "Password");
        this.params.userPassword = new ParamSetting(operationalSetPanel, 'userPassword',
                {
                    type: 'inputNumber',
                    title: 'Enter Password',
                    ctrlInfo: "Change Password [0000-9999]. Default is 0000."
                });



        hh.pPanelAddDescTitle(operationalSetPanel, "Meter Parameters");
        this.params.voltageRate = new ParamSetting(operationalSetPanel, 'voltageRate', {type: 'inputNumber', title: 'Voltage Rate', ctrlInfo: "Set Voltage Rate Parameter [0-1000]"});
        this.params.currentRate = new ParamSetting(operationalSetPanel, 'currentRate', {type: 'inputNumber', title: 'Current Rate', ctrlInfo: "Set Current Rate Parameter [0-1000]"});
        
        hh.pPanelAddDescTitle(operationalSetPanel, "Comms Settings");
        this.params.modbusAddress = new ParamSetting(operationalSetPanel, 'modbusAddress', {type: 'inputNumber', title: 'Slave Address', ctrlInfo: "Set RS485 Slave Address Parameter"});
        this.params.baudRate = new ParamSetting(operationalSetPanel, 'baudRate', {type: 'dropDown', title: 'Baud Rate', ctrlInfo: "Set RS485 Baud Rate Parameter", dropDownConf: {
                options: [
                    {label: '1200', value: '0'},
                    {label: '2400', value: '1'},
                    {label: '4800', value: '2'},
                    {label: '9600', value: '3'},
                ]
            }
        });

        this.params.paritySetting = new ParamSetting(operationalSetPanel, 'paritySetting', {type: 'dropDown', title: 'Communication Format', ctrlInfo: "Set Communication Format Parameter", dropDownConf: {
                options: [
                    {label: 'N.8.1', value: '0'},
                    {label: '0.8.1', value: '1'},
                    {label: 'E.8.1', value: '2'},
                ]
            }
        });

        hh.pPanelAddDescTitle(meterParametersPanel, "Data Recording");
        this.params.recordingValues = new ParamSetting(meterParametersPanel, 'recordingValues', {type: 'dropDown', title: 'Recording Values', ctrlInfo: "Select how to display the powers measured by the device", dropDownConf: {
                options: [
                    {label: 'Sum Values Only', value: '1'},
                    {label: 'Phases Only', value: '2'},
                    {label: 'Phases and SUM', value: '3'}
                ]
            },
            onChange: function (comp, val) {
                switch (Number(val)) {
                    case 1:
                        {
                            molEm.powerNames = [
                                'sumExportPower',
                                'sumImportPower'
                            ];
                        }
                        break;
                    case 2:
                        {
                            molEm.powerNames = [
                                'pha1ExportPower',
                                'pha1ImportPower',
                                'pha2ExportPower',
                                'pha2ImportPower',
                                'pha3ExportPower',
                                'pha3ImportPower'
                            ];
                        }
                        break;
                    case 3:
                        {
                            molEm.powerNames = [
                                'pha1ExportPower',
                                'pha1ImportPower',
                                'pha2ExportPower',
                                'pha2ImportPower',
                                'pha3ExportPower',
                                'pha3ImportPower',
                                'sumExportPower',
                                'sumImportPower'
                            ];
                        }
                        break;

                    default:
                        {
                            molEm.powerNames = [
                                'pha1ExportPower',
                                'pha1ImportPower',
                                'pha2ExportPower',
                                'pha2ImportPower',
                                'pha3ExportPower',
                                'pha3ImportPower',
                                'sumExportPower',
                                'sumImportPower'
                            ];
                        }
                        break;
                }
            }
        });
        hh.pPanelAddDescTitle(meterParametersPanel, "Rated Power Settings");

        this.params.sumERatedPower = new ParamSetting(meterParametersPanel, 'sumERatedPower', {type: 'inputNumber', title: 'Sum Export Rated Power', ctrlInfo: "Set the rated power for combined export"});
        this.params.sumIRatedPower = new ParamSetting(meterParametersPanel, 'sumIRatedPower', {type: 'inputNumber', title: 'Sum Import Rated Power', ctrlInfo: "Set the rated power for combined import"});
        this.params.pha1ERatedPower = new ParamSetting(meterParametersPanel, 'pha1ERatedPower', {type: 'inputNumber', title: 'Phase 1 Export Rated Power', ctrlInfo: "Set the rated power for phase 1 export"});
        this.params.pha1IRatedPower = new ParamSetting(meterParametersPanel, 'pha1IRatedPower', {type: 'inputNumber', title: 'Phase 1 Import Rated Power', ctrlInfo: "Set the rated power for phase 1 import"});
        this.params.pha2ERatedPower = new ParamSetting(meterParametersPanel, 'pha2ERatedPower', {type: 'inputNumber', title: 'Phase 2 Export Rated Power', ctrlInfo: "Set the rated power for phase 2 export"});
        this.params.pha2IRatedPower = new ParamSetting(meterParametersPanel, 'pha2IRatedPower', {type: 'inputNumber', title: 'Phase 2 Import Rated Power', ctrlInfo: "Set the rated power for phase 2 import"});
        this.params.pha3ERatedPower = new ParamSetting(meterParametersPanel, 'pha3ERatedPower', {type: 'inputNumber', title: 'Phase 3 Export Rated Power', ctrlInfo: "Set the rated power for phase 3 export"});
        this.params.pha3IRatedPower = new ParamSetting(meterParametersPanel, 'pha3IRatedPower', {type: 'inputNumber', title: 'Phase 3 Import Rated Power', ctrlInfo: "Set the rated power for phase 3 import"});

    }


    $(document).ready(function () {
        root.molEmGUI = new MolEmGUI();
    });
}(window));
