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


/* global hhContentBuilder, hh, mainUtils */

var genEvChGUI = {};
var genEvChContent = {
    comp: {}
};

genEvChContent.main = {
    tabPanel: {_conf: {sticky: true, initSelect: 1},
        'Device Information': {
            div:{class: 'actDataContainer',
                dataPanel_generalInfo: {title: 'General Information',
                    "dataField_deviceName": {title: 'Device Name', unit: ""},
                    "dataField_installedDate": {title: 'Installed Date', unit: ""},
                    "dataField_manufacturer": {title: 'Manufacturer', unit: ""},
                    "dataField_ratedPowerW": {title: 'Rated Power', unit: "kW"},
//                "dataField_aegScD-converterType": {title: 'Converter Type', unit: ""},
//                "dataField_aegScD-manufacturer": {title: 'Manufacturer', unit: ""},
//                "dataField_aegScD-ratedChargePowerW": {title: 'Rated Charge Power', unit: "kW"},
//                "dataField_aegScD-ratedDischargePowerW": {title: 'Rated Discharge Power', unit: "kW"},
//                "dataField_aegScD-serialNumber": {title: 'Serial Number', unit: ""},
//                "dataField_aegScD-ipAddress": {title: 'IP Address', unit: ""},
//                "dataField_aegScD-installedDate": {title: 'Installation Date', unit: ""},
//                "dataField_aegScD-fwVersionConverterController": {title: 'Converter Controller Fw', unit: ""},
//                "dataField_aegScD-fwVersionConverterFpga": {title: 'Converter FPGA Fw', unit: ""},
//                "dataField_aegScD-fwVersionConverterMcInterface": {title: 'Converter MC Interface Fw', unit: ""}
            }
            
            }
        },
        'Actual Data': {tabTitle: 'Actual Data',
            div: {class: "actDataContainer",
                'dataPanel_AC Info': {
                    "dataField_ph1V": {title: 'dataField_ph1V', unit: "V"},
                    "dataField_ph2V": {title: 'dataField_ph2V', unit: "V"},
                    "dataField_ph3V": {title: 'dataField_ph3V', unit: "V"},
                    "dataField_acCurrentA": {title: 'dataField_acCurrentA', unit: "A"},
                    "dataField_acPowerW": {title: 'dataField_acPowerW', unit: "kW"}
                },
                'dataPanel_DC Info': {
                    "dataField_voltageV": {title: 'dataField_voltageV', unit: "V"},
                    "dataField_currentA": {title: 'dataField_currentA', unit: "A"},
                    "dataField_powerW": {title: 'dataField_powerW', unit: "kW"}
                },
                'dataPanel_System Info': {
//                    "dataField_dcVoltageV": {title: 'dataField_dcVoltageV', unit: "V"},
//                    "dataField_dcCurrentA": {title: 'dataField_dcCurrentA', unit: "A"},
                    "dataField_currentLimitA": {title: 'dataField_currentLimitA', unit: "A"},
                    "dataField_dcdcTempC": {title: 'dataField_dcdcTempC', unit: "C"},
                    "dataField_acIntegratedVoltageV": {title: 'dataField_acIntegratedVoltageV', unit: "V"},
//                    "dataField_upperVoltageLimitV": {title: 'dataField_upperVoltageLimitV', unit: "V"},
//                    "dataField_dispValModCur": {title: 'dataField_dispValModCur', unit: "A"},
                    "dataField_pfc0": {title: 'dataField_pfc0', unit: ""},
                    "dataField_pfc1": {title: 'dataField_pfc1', unit: ""},
                    "dataField_envTempC": {title: 'dataField_envTempC', unit: "C"},
                    "dataField_pfcTemp": {title: 'dataField_pfcTemp', unit: "C"}
//                    "dataField_powerLimitW": {title: 'dataField_powerLimitW', unit: "W"},
//                    "dataField_errorReg": {title: 'dataField_errorReg', unit: ""}
                }
            },

            'div_Settings': {class: "card",
                'param_defModCurrentLimit': {type: "inputNumber", title: "Default Current Limit", unit: '%', ctrlInfo: ""},
                'param_moduleVoltage': {type: "inputNumber", title: "DC Voltage", unit: 'V', ctrlInfo: ""},
                'param_modCurrentLimit': {type: "inputNumber", title: "Current Limit", unit: 'A', ctrlInfo: ""},
                'param_seriesParallel': {
                    type: "dropDown",
                    title: "Series/Parallel",
                    ctrlInfo: "",
                    dropDownConf: {
                        options: [
                            {label: 'Series', value: '1050'},
                            {label: 'Parallel', value: '520'}
                        ]
                    }
                },
                'param_defModuleVoltage': {type: "inputNumber", title: "Default DC Voltage", unit: 'V', ctrlInfo: ""},
                'param_moduleOnOff': {
                    type: "dropDown",
                    title: "On/Off",
                    ctrlInfo: "",
                    dropDownConf: {
                        options: [
                            {label: 'On', value: "0"},
                            {label: 'Off', value: "1"}
                        ]
                    }
                },
                'param_relayOnOff': {
                    type: "dropDown",
                    title: "Relay",
                    ctrlInfo: "",
                    dropDownConf: {
                        options: [
                            {label: 'On', value: '0'},
                            {label: 'Off', value: '1'}
                        ]
                    }
                }
            }


        }
    }

};




genEvChGUI.init = function () {
    hhContentBuilder.buildContent(genEvChContent.main, dgm.contentPanel);
};

$(document).ready(function () {
    genEvChGUI.init();
});