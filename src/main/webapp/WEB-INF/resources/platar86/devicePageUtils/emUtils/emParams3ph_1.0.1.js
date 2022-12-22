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
 *  
 *   INCLUDED IN paramSettingSupport.xhtml 
 */
/* global pm, mainUtils, devManager, param, sui */
(function (root) {

    function EmParams(cont) {
        if (!cont) {
            throw new Error("EmParams needs a container to attatch to!");
        }
        this.cont = cont;
        init.call(this);
    }

    function init() {
        this.accPanel = new SMDUIAccordianPanel(this.cont, {
            tabs: [
                {
                    label: 'General Settings',
                    id: '1'
                },
                {
                    label: 'Power Type Settings',
                    id: '2'
                }
            ],
            multiple: false,
            selectedTab: '1',
            onInitComplete: function (el) {
                populateParams(el.getTabById('1').content, el.getTabById('2').content);
            }
        });
    }

    let onPowerSettingChange = function (comp, val) {
        if (comp.paramName === 'recordingValues' && val.toString() === "1") {
            pm.elements['pha1IRatedPower'].hide();
            pm.elements['pha2IRatedPower'].hide();
            pm.elements['pha3IRatedPower'].hide();
            pm.elements['pha1ERatedPower'].hide();
            pm.elements['pha2ERatedPower'].hide();
            pm.elements['pha3ERatedPower'].hide();
            pm.elements['sumIRatedPower'].show();
            pm.elements['sumERatedPower'].show();
            pm.elements['pha1IPowerType'].hide();
            pm.elements['pha2IPowerType'].hide();
            pm.elements['pha3IPowerType'].hide();
            pm.elements['pha1EPowerType'].hide();
            pm.elements['pha2EPowerType'].hide();
            pm.elements['pha3EPowerType'].hide();
            pm.elements['sumImpPowerType'].show();
            pm.elements['sumExpPowerType'].show();
        }
        if (comp.paramName === 'recordingValues' && val.toString() === "2") {
            pm.elements['pha1IRatedPower'].show();
            pm.elements['pha2IRatedPower'].show();
            pm.elements['pha3IRatedPower'].show();
            pm.elements['pha1ERatedPower'].show();
            pm.elements['pha2ERatedPower'].show();
            pm.elements['pha3ERatedPower'].show();
            pm.elements['sumIRatedPower'].hide();
            pm.elements['sumERatedPower'].hide();
            pm.elements['pha1IPowerType'].show();
            pm.elements['pha2IPowerType'].show();
            pm.elements['pha3IPowerType'].show();
            pm.elements['pha1EPowerType'].show();
            pm.elements['pha2EPowerType'].show();
            pm.elements['pha3EPowerType'].show();
            pm.elements['sumImpPowerType'].hide();
            pm.elements['sumExpPowerType'].hide();
        }
        if (comp.paramName === 'recordingValues' && val.toString() === "3") {
            pm.elements['pha1IRatedPower'].show();
            pm.elements['pha2IRatedPower'].show();
            pm.elements['pha3IRatedPower'].show();
            pm.elements['pha1ERatedPower'].show();
            pm.elements['pha2ERatedPower'].show();
            pm.elements['pha3ERatedPower'].show();
            pm.elements['sumIRatedPower'].show();
            pm.elements['sumERatedPower'].show();
            pm.elements['pha1IPowerType'].show();
            pm.elements['pha2IPowerType'].show();
            pm.elements['pha3IPowerType'].show();
            pm.elements['pha1EPowerType'].show();
            pm.elements['pha2EPowerType'].show();
            pm.elements['pha3EPowerType'].show();
            pm.elements['sumImpPowerType'].show();
            pm.elements['sumExpPowerType'].show();
        }

    };

    function addHeading(container, lbl) {
        let label = document.createElement('span');
        label.classList.add('dscSeparatorText');
        label.innerText = lbl;
        container.appendChild(label);
    }

    function populateParams(genSettingsContent, powerTypeSetCont) {
        new ParamSetting(genSettingsContent, 'recordingValues', {
            type: 'dropDown',
            title: 'Recording Values:',
            ctrlInfo: 'Choose which fields to be Recorded by the logger.',
            onSaveSuccess: function (comp, val) {
                console.log('Success', comp, val);
            },
            onSaveFail: function (comp, val) {
                console.log('Fail', comp, val);
            },
            onChange: function (comp, val) {
                //Here we van call functions that for example hide other
                //settings depending on the value of the changed component.
                onPowerSettingChange(comp, val);
            },
            extraData: {
                time: function () {
                    return new Date().getTime();
                },
                data: 'nwadsf'
            },
            dropDownConf: {
                val: 0,
                options: [
                    {label: 'SUM Values only', value: '1'},
                    {label: 'Independant Phases only', value: '2'},
                    {label: 'Phases and SUM', value: '3'}
                ]
            }
        });

        new ParamSetting(genSettingsContent, 'reverseDirection', {
            type: 'switch',
            title: 'Reverse Meter:',
            ctrlInfo: 'This setting will reverse the direction of the meeter.'

        });

        createRatedPSetting(genSettingsContent, 'sumIRatedPower', 'Sum Import');
        createRatedPSetting(genSettingsContent, 'sumERatedPower', 'Sum Export');
        createRatedPSetting(genSettingsContent, 'pha1IRatedPower', 'Phase 1 Import');
        createRatedPSetting(genSettingsContent, 'pha1ERatedPower', 'Phase 1 Export');
        createRatedPSetting(genSettingsContent, 'pha2IRatedPower', 'Phase 2 Import');
        createRatedPSetting(genSettingsContent, 'pha2ERatedPower', 'Phase 2 Export');
        createRatedPSetting(genSettingsContent, 'pha3IRatedPower', 'Phase 3 Import');
        createRatedPSetting(genSettingsContent, 'pha3ERatedPower', 'Phase 3 Export');

        createPTypeSetting(powerTypeSetCont, 'sumImpPowerType', 'Sum Import');
        createPTypeSetting(powerTypeSetCont, 'sumExpPowerType', 'Sum Export');
        createPTypeSetting(powerTypeSetCont, 'pha1IPowerType', 'Phase 1 Import');
        createPTypeSetting(powerTypeSetCont, 'pha1EPowerType', 'Phase 1 Export');
        createPTypeSetting(powerTypeSetCont, 'pha2IPowerType', 'Phase 2 Import');
        createPTypeSetting(powerTypeSetCont, 'pha2EPowerType', 'Phase 2 Export');
        createPTypeSetting(powerTypeSetCont, 'pha3IPowerType', 'Phase 3 Import');
        createPTypeSetting(powerTypeSetCont, 'pha3EPowerType', 'Phase 3 Export');
    }



    function createPTypeSetting(cont, powerName, powerDesc) {
        let comp = new ParamSetting(cont, powerName, {
            type: 'dropDown',
            title: powerDesc + ' Power Type',
            ctrlInfo: 'Set the power type of ' + powerDesc,
            dropDownConf: {
                val: 0,
                options: [
                    {label: 'PV', value: 'pv'},
                    {label: 'Load', value: 'load'},
                    {label: 'Load Import', value: 'loadImport'},
                    {label: 'Storage Charge', value: 'stCharge'},
                    {label: 'Storage Discharge', value: 'stDischarge'},
                    {label: 'Grid', value: 'gridConsume'},
                    {label: 'Grid Export', value: 'gridFeed'},
                    {label: 'Generator', value: 'gen'},
                    {label: 'Other', value: 'other'}
                ]
            }
        });
        return comp;
    }
    function createRatedPSetting(cont, powerName, powerDesc) {
        let comp = new ParamSetting(cont, powerName, {
            type: 'inputText',
            title: powerDesc + ' Rated Power:',
            ctrlInfo: 'Rated power for ' + powerDesc,
            inputTextConf: {
                val: 0,
                type: 'number',
                decimals: 0
            },
            unit: 'W'
        });
        return comp;
    }



    root.EmParams = EmParams;

}(window));

//$(document).ready(function () {
//    new EmParams();
//});

