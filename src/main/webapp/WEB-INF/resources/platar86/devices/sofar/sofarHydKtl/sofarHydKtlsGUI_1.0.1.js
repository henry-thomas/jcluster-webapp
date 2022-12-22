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


/* global hhContentBuilder, hh, mainUtils, pm, atessHpsGUI */




(function (root) {
    function AtessHpsGUI(ext) {
        this.dataFields = {};
        this.params = {};
        _init.call(this);
    }

    AtessHpsGUI.prototype.initDataFields = function (data) {
        this.initComplete = true;

        let generalInfo = hh.createActDataPanelCard('General Info', null, this.dataContent);
        for (var fieldName in data) {
//            debugger;
            if (typeof (data[fieldName]) === 'object') {
                if (fieldName === 'deviceID' || fieldName === 'alertMap' || fieldName === 'alertMap') {
                    continue;
                } else if (fieldName === 'mpptData') {
                    let card = hh.createActDataPanelCard(fieldName, null, this.dataContent);
                    this.dataFields[fieldName] = {};
                    let count = 1;
                    for (var subField in data[fieldName]) {
                        let mpptObj = data[fieldName][subField];
                        this.dataFields[fieldName][subField] = {};
                        let mpptIdx = count++;
                        for (var mpptField in mpptObj) {
                            this.dataFields[fieldName][subField][mpptField] = hh.adf(card, 'PV' + mpptIdx + ' ' + mpptField);

                        }
                    }
                } else {

                    let card = hh.createActDataPanelCard(fieldName, null, this.dataContent);
                    this.dataFields[fieldName] = {};
                    for (var subField in data[fieldName]) {
                        this.dataFields[fieldName][subField] = hh.adf(card, subField);
                    }
                }
            } else {
                if (!this.dataFields[fieldName]) {
                    this.dataFields[fieldName] = hh.adf(generalInfo, fieldName);
                }
            }
        }
    };

    function _init() {
        this.mainTabPanel = new TabPanel(dgm.contentPanel, {
            menuItem: [
                {label: "Data", id: 'data'},
                {label: "Device Info", id: 'info'},
                {label: "Settings", id: 'settings'}
            ],
            selected: 'data'
        });

        this.dataContent = this.mainTabPanel.getItemContentById('data');
        this.settingsContent = this.mainTabPanel.getItemContentById('settings');
        this.otherInfoContent = this.mainTabPanel.getItemContentById('otherInfo');

        this.dataContent.classList.add('actDataContainer');
//        this.otherInfoContent.classList.add('actDataContainer');
        _initGui.call(this);
    }


    function _initGui() {
        //init data basic
        let card = hh.createActDataPanelCard('Basic Data', null, this.dataContent);
        this.dataFields.sysState = hh.adf(card, 'System State', null, {datamap: {'0': 'Standby', '1': 'Detection', '2': 'Grid Connected',
                '3': 'Emergency power supply', '4': 'Recoverable fault', '5': 'Permament fault', '6': 'Upgrade', '7': 'Self-charging'}});
        this.dataFields.temperature_Inv1 = hh.adf(card, 'Inverter Temp1', '\u00B0C');
        this.dataFields.temperature_HeatSink1 = hh.adf(card, 'Heatsink Temp1', '\u00B0C');
        this.dataFields.temperature_Env1 = hh.adf(card, 'Enviroment Temp1', '\u00B0C');
        this.dataFields.activePowerLoadSys = hh.adf(card, 'PowerW');

    }

    dm.onParamReceived(function (dev, param) {
        if (!this.initParamComplete) {
            this.initParamComplete = true;
            debugger;
            let cont = root.atessHpsGUI.settingsContent;
            cont = hh.div(cont, 'card');

            for (var item in param) {
                new ParamSetting(cont, item, {type: 'inputNumber', title: item, ctrlInfo: 'Auto generated param->' + item});
            }
        }
    });

    $(document).ready(function () {
        root.atessHpsGUI = new AtessHpsGUI();
    });
}(window));
