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


/* global hhContentBuilder, hh, mainUtils, pm */

var aegScGui = {};
aegScGui.dataPanelMap = {};
var aegScWebCont = {
    comp: {}
};

aegScGui.createActualData = function (container) {

    // Grid Connection info

    let gridConnectionInfoPnl = hh.createActualData('Grid Connection info');

    aegScGui.gridVoltL1L2 = hh.adf(gridConnectionInfoPnl, "Grid Voltage L1-L2: ", "V", {});
    container.appendChild(gridConnectionInfoPnl);
};


aegScWebCont.main = {
    tabPanel: {_conf: {sticky: true, initSelect: 0},
        'Device Information': {tabTitle: 'Device Information',
            div: {
                div: {class: 'actDataContainer',
                    dataPanel_generalInfo: {title: 'General Information',
                        "dataField_aegScD-deviceName": {title: 'Device Name', unit: ""},
                        "dataField_aegScD-converterType": {title: 'Converter Type', unit: ""},
                        "dataField_aegScD-manufacturer": {title: 'Manufacturer', unit: ""},
                        "dataField_aegScD-ratedChargePowerW": {title: 'Rated Charge Power', unit: "kW"},
                        "dataField_aegScD-ratedDischargePowerW": {title: 'Rated Discharge Power', unit: "kW"},
                        "dataField_aegScD-serialNumber": {title: 'Serial Number', unit: ""},
                        "dataField_aegScD-ipAddress": {title: 'IP Address', unit: ""},
                        "dataField_aegScD-installedDate": {title: 'Installation Date', unit: ""},
                        "dataField_aegScD-fwVersionConverterController": {title: 'Converter Controller Fw', unit: ""},
                        "dataField_aegScD-fwVersionConverterFpga": {title: 'Converter FPGA Fw', unit: ""},
                        "dataField_aegScD-fwVersionConverterMcInterface": {title: 'Converter MC Interface Fw', unit: ""},
                    }
                }
            }
        },
        'Actual Data': {tabTitle: 'Actual Data',
            div: {
//                accordian: {
                div: {class: 'actDataContainer actualData',

                    'dataPanel_General Data': {
                        "dataField_aegSc-invOnOff": {title: 'State', unit: ""},
                        "dataField_aegSc-gecCalc": {title: 'AC/DC Efficiency', unit: "%"},
                    },

                    'dataPanel_DC Info': {
//                            "dataField_aegSc-bat": {title: 'Battery Current', unit: "A", type: 'static', value: 'sdfsdf', link: 'http://www.google.com'}, //use name as valueClass 
                        "dataField_aegScDc-currentA": {title: 'Battery Current', unit: "A", type: 'static', link: 'google.com'}, //use name as valueClass 
                        "dataField_aegScDc-powerW": {title: 'Battery Power', unit: "kW", tooltip: ''},
                        "dataField_aegScDc-voltageV": {title: 'Battery Voltage', unit: "V"},
//                        "dataField_aegSc-gridExportChargeCalc": {title: 'Grid Export and Charg calculation', unit: "W"}
                    },
                    'dataPanel_Grid Connection Info': {
                        "dataField_aegSc-gridFrequency": {title: 'Grid Frequency', unit: "Hz"},
                        "dataField_aegSc-gridVoltL1L2": {title: 'Grid Voltage L1-L2', unit: "V"},
                        "dataField_aegSc-gridVoltL2L3": {title: 'Grid Voltage L2-L3', unit: "V"},
                        "dataField_aegSc-gridVoltL3L1": {title: 'Grid Voltage L3-L1', unit: "V"}
                    },
                    'dataPanel_Grid Power': {
                        "dataField_aegSc-powerW": {title: 'Power', unit: "kW", },
                        "dataField_aegSc-conApparentPower": {title: 'Apparent Power', unit: "kVA"},
                        "dataField_aegSc-conReactivePower": {title: 'Reactive Power', unit: "kVAR"},
                        "dataField_aegSc-conTruePower": {title: 'True Power', unit: "kW"},
                        "dataField_aegSc-cosPhi": {title: 'Power Factor', unit: "cos(ϕ)"},
                        "dataField_aegSc-conVoltL1L2": {title: 'Con Voltage L1-L2', unit: "V"},
                        "dataField_aegSc-conVoltL2L3": {title: 'Con Voltage L2-L3', unit: "V"},
                        "dataField_aegSc-conVoltL3L1": {title: 'Con Voltage L3-L1', unit: "V"},
                        "dataField_aegSc-conCurrentL1": {title: 'Con Current L1', unit: "A"},
                        "dataField_aegSc-conCurrentL2": {title: 'Con Current L2', unit: "A"},
                        "dataField_aegSc-conCurrentL3": {title: 'Con Current L3', unit: "A"},
                        "dataField_aegSc-gridFrequency": {title: 'Grid Frequency', unit: "Hz"},
                        "dataField_aegSc-powerStackInputTemp": {title: 'Stack Input Temp', unit: "C"},
                    },
//                    'dataPanel_Grid Export Power': {
//                        "dataField_aegScExp-powerW": {title: 'Power', unit: "kW"},
//                        "dataField_aegScExp-conApparentPower": {title: 'Apparent Power', unit: "kVA"},
//                        "dataField_aegScExp-conReactivePower": {title: 'Reactive Power', unit: "kVAR"},
//                        "dataField_aegScExp-conTruePower": {title: 'True Power', unit: "kW"},
//                        "dataField_aegScExp-cosPhi": {title: 'Power Factor', unit: "cos(ϕ)"},
//                        "dataField_aegScExp-conVoltL1L2": {title: 'Con Voltage L1-L2', unit: "V"},
//                        "dataField_aegScExp-conVoltL2L3": {title: 'Con Voltage L2-L3', unit: "V"},
//                        "dataField_aegScExp-conVoltL3L1": {title: 'Con Voltage L3-L1', unit: "V"},
//                        "dataField_aegScExp-conCurrentL1": {title: 'Con Current L1', unit: "A"},
//                        "dataField_aegScExp-conCurrentL2": {title: 'Con Current L2', unit: "A"},
//                        "dataField_aegScExp-conCurrentL3": {title: 'Con Current L3', unit: "A"},
//                        "dataField_aegScExp-gridFrequency": {title: 'Grid Frequency', unit: "Hz"},
//                        "dataField_aegScExp-powerStackInputTemp": {title: 'Stack Input Temp', unit: "C"},
//                    },
//                    'dataPanel_Charge Power': {
//
//                        "dataField_aegSc-powerW": {title: 'Power W', unit: "kW"},
//                        "dataField_aegSc-currentA": {title: 'Battery Current', unit: "A"},
//                        "dataField_aegSc-voltageV": {title: 'Battery Voltage', unit: "V"},
//                        "dataField_aegSc-ratedPowerW": {title: 'Rated Power', unit: "kW"}
//                    },
//                    'dataPanel_Discharge Power': {
//                        "dataField_aegScD-powerW": {title: 'Battery Power', unit: "kW"},
//                        "dataField_aegScD-currentA": {title: 'Battery Current', unit: "A"},
//                        "dataField_aegScD-voltageV": {title: 'Battery Voltage', unit: "V"},
//                        "dataField_aegScD-ratedPowerW": {title: 'Rated Power', unit: "kW"}
//                    },
                    'dataPanel_Energy': {

                        "dataField_aegSc-energyWh": {title: 'Charge Energy', unit: "Wh"},
                        "dataField_aegScD-energyWh": {title: 'Discharge Energy', unit: "Wh"},
                        "dataField_aegSc-dailyEnergyWh": {title: 'Daily Charge Energy', unit: "Wh"},
                        "dataField_aegScD-dailyEnergyWh": {title: 'Daily Discharge Energy', unit: "Wh"},
                        "dataField_aegSc-weeklyEnergyWh": {title: 'Weekly Charge Energy', unit: "Wh"},
                        "dataField_aegScD-weeklyEnergyWh": {title: 'Weekly Discharge Energy', unit: "Wh"},
                        "dataField_aegSc-monthlyEnergyWh": {title: 'Monthly Charge Energy', unit: "Wh"},
                        "dataField_aegScD-monthlyEnergyWh": {title: 'Monthly Discharge Energy', unit: "Wh"},
                        "dataField_aegSc-yearlyEnergyWh": {title: 'Yearly Charge Energy', unit: "Wh"},
                        "dataField_aegScD-yearlyEnergyWh": {title: 'Yearly Discharge Energy', unit: "Wh"},
                        "dataField_aegSc-totalEnergyProduced": {title: 'Total Charge Energy', unit: "Wh"},
                        "dataField_aegScD-totalEnergyConsumed": {title: 'Total Discharge Energy', unit: "Wh"}
                    },
//                    'dataPanel_Discharge Energy': {
//
//                    },
                    'dataPanel_Grid Frequency Params': {
                        "dataField_aegSc-gridFreq1MaxTimeDelay": {title: 'Grid Frequency 1 Max Time Delay', unit: "sec"},
                        "dataField_aegSc-gridFreq1MinTimeDelay": {title: 'Grid Frequency 1 Min Time Delay', unit: "sec"},
                        "dataField_aegSc-gridFreqSetPoint1Max": {title: 'Grid Frequency Set Point 1 Max', unit: "Hz"},
                        "dataField_aegSc-gridFreqSetPoint1Min": {title: 'Grid Frequency Set Point 1 Min', unit: "Hz"},
                        "dataField_aegSc-gridFreq2MaxTimeDelay": {title: 'Grid Frequency 2 Max Time Delay', unit: "sec"},
                        "dataField_aegSc-gridFreq2MinTimeDelay": {title: 'Grid Frequency 2 Min Time Delay', unit: "sec"},
                        "dataField_aegSc-gridFreqSetPoint2Max": {title: 'Grid Frequency Set Point 2 Max', unit: "Hz"},
                        "dataField_aegSc-gridFreqSetPoint2Min": {title: 'Grid Frequency Set Point 2 Min', unit: "Hz"}
                    },
                    'dataPanel_Grid Voltage Params': {
                        "dataField_aegSc-gridVolt1MaxTimeDelay": {title: 'Grid Voltage 1 Max Time Delay', unit: "sec"},
                        "dataField_aegSc-gridVolt1MinTimeDelay": {title: 'Grid Voltage 1 Min Time Delay', unit: "sec"},
                        "dataField_aegSc-gridVolt2MaxTimeDelay": {title: 'Grid Voltage 2 Max Time Delay', unit: "sec"},
                        "dataField_aegSc-gridVolt2MinTimeDelay": {title: 'Grid Voltage 2 Min Time Delay', unit: "sec"},
                        "dataField_aegSc-gridVolt3MaxTimeDelay": {title: 'Grid Voltage 3 Max Time Delay', unit: "sec"},
                        "dataField_aegSc-gridVolt3MinTimeDelay": {title: 'Grid Voltage 3 Min Time Delay', unit: "sec"},
                        "dataField_aegSc-gridVoltSetPoint1Max": {title: 'Grid Voltage Set Point 1 Max', unit: "V"},
                        "dataField_aegSc-gridVoltSetPoint1Min": {title: 'Grid Voltage Set Point 1 Min', unit: "V"},
                        "dataField_aegSc-gridVoltSetPoint2Max": {title: 'Grid Voltage Set Point 2 Max', unit: "V"},
                        "dataField_aegSc-gridVoltSetPoint2Min": {title: 'Grid Voltage Set Point 2 Min', unit: "V"},
                        "dataField_aegSc-gridVoltSetPoint3Max": {title: 'Grid Voltage Set Point 3 Max', unit: "V"},
                        "dataField_aegSc-gridVoltSetPoint3Min": {title: 'Grid Voltage Set Point 3 Min', unit: "V"}
                    },

                }
//                        'param_constantDcCurrentSetPdfgoint': {type: "dropDown", title: "P(F-Gridgdfgdfg)Release",
//                            ctrlInfo: "Reset of <h1><strong>set-points:</strong>,</h1> To *0: If “ResetSetPoints�? is set to 1,<br> all set-points and release registers are set to factory settings, means: \n\
//TruePowerSetPoint = 0.0kW; ReactivePowerSetPoint = 0.0 kvar; CosPhiSetPoint = 1.000; all release registers are ",
//                            dropDownConf: {options: [{label: 'Block', value: '0'}, {label: 'Release', value: '1'}]}
//                        }
            }

        },
        Settings: {
            _dest: {object: aegScWebCont.comp, name: 'settingsPanel', class: "params"}
        }
    }

};
aegScGui.populateTempParam = function (dev, param) {
//switch
//command
//inputText
//inputNumber
//dropDown
//button
    let paramWrapper = aegScWebCont.comp.settingsPanel;
//    let accPanel = new SMDUIAccordianPanel(paramWrapper, {tabs: ['']});
    aegScGui.pContent = {};
    aegScGui.pContent['accordian_settings'] = {};
    let acc = aegScGui.pContent['accordian_settings'];
    // let onOff = dm.getSelected().param.converterOnOff.dropDownConf.value;

    // if (onOff ==1){
    //     let onOff = on
    // }
    acc['System Settings'] = {
        'param_chargeControl': {type: "dropDown",
            title: "Charge Control",
            ctrlInfo: "Controls the direction of charge, into the Battery or into P2H-Hybrid Device.",
            dropDownConf: {
                options: [
                    {label: 'Idle', value: '0'},
                    {label: 'Into Battery', value: '1'},
                    {label: 'Into P2H-Hybrid Device', value: '2'}
                ]
            }
        },
        "param_resetSetPoints": {
            type: "dropDown",
            title: "Reset Setpoints",
            ctrlInfo: "Reset the set-points and limit values to their defaults.",
            dropDownConf: {
                val: 0,
                options: [
                    {label: 'No', value: '0'},
                    {label: 'Yes', value: '1'}
                ]
            }
        },
        'param_truePowerSetPoint': {type: "inputNumber", title: "True Power Setpoint (P0)", unit: 'kW', ctrlInfo: "Describes the real-power into the Grid as well as from the Grid."},
        "param_reactivePowerSetPoint": {type: "inputNumber", title: "Reactive Power Setpoint (Q0)", unit: 'kVAR', ctrlInfo: "means: (-) = over-excited or leading; (+) under-excited or lagging."},
        "param_cosPhiSetPoint": {type: "inputNumber", title: "Power Factor Setpoint", unit: '', ctrlInfo: "means: (-) = over-excited or leading; (+) under-excited or lagging."},
//        "param_constantDcVoltageSetPoint": {type: "inputNumber", title: "Constant Dc Voltage Setpoint", unit: 'V', ctrlInfo: "The PCS charge or discharge of the batteries are controlled  by the Constant Dc Voltage SetPoint."},
//        "param_constantDcCurrentSetPoint": {type: "inputNumber", title: "Constant Dc Current Setpoint", unit: 'A', ctrlInfo: "The PCS charge or discharge of the batteries are controlled  by the Constant Dc Current SetPoint."},
//        "param_limitVdcChargeSetPoint": {type: "inputNumber", title: "Limit Vdc Charge Setpoint", unit: 'V', ctrlInfo: "To set the limit of Charge in Voltage."},
//        "param_limitVdcDischargeSetPoint": {type: "inputNumber", title: "Limit Vdc Discharge Setpoint", unit: 'V', ctrlInfo: "To set the limit of Discharge in Voltage."},
//        "param_limitIdcChargeSetPoint": {type: "inputNumber", title: "Limit Idc Charge Setpoint", unit: 'A', ctrlInfo: "To set the limit of Charge in Current."},
//        "param_limitIdcDischargeSetPoint": {type: "inputNumber", title: "Limit Idc Disharge Setpoint", unit: 'A', ctrlInfo: "To set the limit of Discharge in Current."},
        "param_converterQuickOff": {
            type: "dropDown",
            title: "Converter Quick Off",
            ctrlInfo: "If Converter Quick Off is set to Off, the converter switches OFF immediately. If this register is set to Restore OFF the converter switches back to the last operation mode.",
            dropDownConf: {
                val: 0,
                options: [
                    {label: 'Idle (Default)', value: '0'},
                    {label: 'OFF', value: '1'},
                    {label: 'Restore OFF', value: '2'}
                ]
            }
        },

        "param_operationMode": {
            type: "dropDown",
            title: "Operation Mode",
            ctrlInfo: 'If Constant  Real-power mode is selected, the PCS can charge or discharge the batteries,controlled by the TruePowerSetPoint. For battery protection the real-power value on this operation mode could be limited by charge/discharge voltage and or charge/discharge current. Limits of charge mode use the registers for voltage LimitVdcChargeSetPoint and or for current LimitIdcChargeSetPoint. Limits of discharge mode use the registers for voltage LimitVdcDischargeSetPoint and or for current LimitIdcDischargeSetPoint.' +
                    'If Constant DC-voltage mode is selected, the PCS charge or discharge the batteries controlled by the “ConstantDcVoltageSetPoint�? value. For battery protection the dc-voltage value on this operation mode could be limited by charge/discharge current. ' +
                    'If “Constant DC-current�? mode is selected, the PCS charge or discharge the batteries controlled by the “ConstantDcCurrentSetPoint�? signed value. For battery protection the dc-current value on this operation mode could be limited by charge/discharge voltage.  ',

            dropDownConf: {
                val: 0,
                options: [
                    {label: 'Idle', value: '0'},
                    {label: 'Constant Real-power', value: '1'},
                    {label: 'Constant DC-voltage', value: '2'},
                    {label: 'Constant DC-current', value: '3'}
                ]
            },
            onChange: function (comp, val) {
                //Here we van call functions that for example hide other
                //settings depending on the value of the changed component.
                aegScGui.onOperationModeChanged(comp, val);
            }
        }

    };
    acc['Battery Settings'] = {
        "param_constantDcVoltageSetPoint": {type: "inputNumber", title: "Constant Dc Voltage Setpoint", unit: 'V', ctrlInfo: "The PCS charge or discharge of the batteries are controlled  by the Constant Dc Voltage SetPoint."},
        "param_constantDcCurrentSetPoint": {type: "inputNumber", title: "Constant Dc Current Setpoint", unit: 'A', ctrlInfo: "The PCS charge or discharge of the batteries are controlled  by the Constant Dc Current SetPoint."},
        "param_limitVdcChargeSetPoint": {type: "inputNumber", title: "Limit Vdc Charge Setpoint", unit: 'V', ctrlInfo: "To set the limit of Charge in Voltage."},
        "param_limitVdcDischargeSetPoint": {type: "inputNumber", title: "Limit Vdc Discharge Setpoint", unit: 'V', ctrlInfo: "To set the limit of Discharge in Voltage."},
        "param_limitIdcChargeSetPoint": {type: "inputNumber", title: "Limit Idc Charge Setpoint", unit: 'A', ctrlInfo: "To set the limit of Charge in Current."},
        "param_limitIdcDischargeSetPoint": {type: "inputNumber", title: "Limit Idc Disharge Setpoint", unit: 'A', ctrlInfo: "To set the limit of Discharge in Current."},
        "param_f0": {type: "inputNumber", title: "F0", unit: 'Hz', ctrlInfo: "For frequency set-point in 0,01Hz."},
        "param_pMin": {type: "inputNumber", title: "PMin", unit: 'kW', ctrlInfo: "To set minimum power limit value in 0,1kW."},
        "param_pMax": {type: "inputNumber", title: "PMax", unit: 'kW', ctrlInfo: "To set maximum power limit value in 0,1kW."},
        "param_vQDroop": {type: "inputNumber", title: "PMax", unit: '%', ctrlInfo: "To set gradient value VQdroop in 0,1%."},
        "param_v0": {type: "inputNumber", title: "V0", unit: 'V', ctrlInfo: "For the voltage set-point V0 in 0,1V."},
        "param_qMin": {type: "inputNumber", title: "QMin", unit: 'kvar', ctrlInfo: "To set Qmin limit value in 0,1kvar."},
        "param_qMax": {type: "inputNumber", title: "QMax", unit: 'kvar', ctrlInfo: "To set Qmax limit value in 0,1kvar."}
    };
    acc['Grid Settings'] = {

        "param_pFGridRelease": {
            type: "dropDown",
            title: "P(F-Grid)Release",
            ctrlInfo: "",
            dropDownConf: {
                val: 0,
                options: [
                    {label: 'Block', value: '0'},
                    {label: 'Release', value: '1'}
                ]
            }
        },
        "param_qUGridRelease": {
            type: "dropDown",
            title: "Q(U-Grid)Release",
            ctrlInfo: "",
            dropDownConf: {
                val: 0,
                options: [
                    {label: 'Block', value: '0'},
                    {label: 'Release', value: '1'}
                ]
            }
        },
        "param_qPInvRelease": {
            type: "dropDown",
            title: "Q(P-Inv)Release",
            ctrlInfo: "",
            dropDownConf: {
                val: 0,
                options: [
                    {label: 'Block', value: '0'},
                    {label: 'Release', value: '1'}
                ]
            }
        },
        "param_converterOnOff": {
            type: "dropDown",
            title: "Converter On/Off",
            ctrlInfo: "If Converter On/Off is set to On the converter switches ON, means: start-up of the converter system. If this register is set to Off the converter switches OFF. If this register is set to initial charging the converter switches ON to Initial charging.",
            dropDownConf: {
                val: 0,
                options: [
                    {label: 'Idle (Default)', value: '0'},
                    {label: 'ON', value: '1'},
                    {label: 'OFF', value: '2'},
                    {label: 'Initial charging', value: '3'}
                ]
            }
        },
        "param_converterIdleOnOff": {
            type: "dropDown",
            title: "Converter Idle On/Off",
            ctrlInfo: "If Converter idle is set to On the converter switches in idle mode, means: the grid and the batteries are connected to the PCS without firing the IGBT Stack. The PCS is synchronized with the grid. If this register is set to Off the converter jumps back to the last operation mode.",
            dropDownConf: {
                val: 0,
                options: [
                    {label: 'Idle (Default)', value: '0'},
                    {label: 'ON', value: '1'},
                    {label: 'OFF', value: '2'}
                ]
            }
        },
        "param_converterSystem": {
            type: "dropDown",
            title: "Converter System",
            ctrlInfo: "If Converter System is set to ack + Restart the current fault of converter will be acknowledged and the converter starts automatically again. If Converter System is set to Save Setting the current settings of registers ConstantDcVoltageSetPoin up to LimitIdcDischargeSetPoint will be saved into nonvolatile memory.",
            dropDownConf: {
                val: 0,
                options: [
                    {label: 'Idle', value: '0'},
                    {label: 'Ack + Restart', value: '1'},
                    {label: 'Save Settings', value: '2'}
                ]
            }
        },
        "param_softstartRelease": {
            type: "dropDown",
            title: "Softstart Release",
            ctrlInfo: "If Softstart Release is set to Release, the converter starts up with output voltage zero to the rated voltage after switch ON the converter via register ConverterOn/Off.",
            dropDownConf: {
                val: 0,
                options: [
                    {label: 'Block', value: '0'},
                    {label: 'Release', value: '1'}
                ]
            }
        },
        "param_qUGridLimitRelease": {
            type: "dropDown",
            title: "Q(U-Grid-Limit)Release",
            ctrlInfo: "",
            dropDownConf: {
                val: 0,
                options: [
                    {label: 'Block', value: '0'},
                    {label: 'Release', value: '1'}
                ]
            }
        },
        "param_urefQUGrid": {type: "inputNumber", title: "Uref Q(U-Grid)", unit: '%', ctrlInfo: ""},
        "param_urefQUGridLimit": {type: "inputNumber", title: "Uref Q(U-Grid-Limit)", unit: '%', ctrlInfo: ""}
    };
    acc['General Settings'] = {
        "param_fPDroopRelease": {
            type: "dropDown",
            title: "FP Droop Release",
            ctrlInfo: "",
            dropDownConf: {
                val: 0,
                options: [
                    {label: 'Block', value: '0'},
                    {label: 'Release', value: '1'}
                ]
            }
        },
        "param_vQDroopRelease": {
            type: "dropDown",
            title: "VQ Droop Release",
            ctrlInfo: "",
            dropDownConf: {
                val: 0,
                options: [
                    {label: 'Block', value: '0'},
                    {label: 'Release', value: '1'}
                ]
            }
        },
        "param_fPDroop": {type: "inputNumber", title: "FP Droop", unit: '%', ctrlInfo: "For gradient value FPdroop in 0,1%."},
        "param_monitoringHeartbeat": {type: "inputNumber", title: "Monitoring Heartbeat", unit: '', ctrlInfo: "This command can be used to reset the supervision of the communication to monitoring/control unit."},
        "param_timerX": {type: "inputNumber", title: "Timer X (Communication Monitoring)", unit: 'S', ctrlInfo: "After timer x → communication fault || 0 = NOT ACTIVE."}

    };
    var pContent = aegScGui.pContent;

    hhContentBuilder.buildContent(pContent, paramWrapper);
};
aegScGui.onOperationModeChanged = function (component, opMode) {
    //3 = current mode
    if (opMode === '3') {
        //hide Voltage elements
        pm.elements['softstartRelease'].hide();
        pm.elements['fPDroopRelease'].hide();
        pm.elements['vQDroopRelease'].hide();
        pm.elements['fPDroop'].hide();
        pm.elements['f0'].hide();
        pm.elements['pMin'].hide();
        pm.elements['pMax'].hide();
        pm.elements['vQDroop'].hide();
        pm.elements['v0'].hide();
        pm.elements['qMin'].hide();
        pm.elements['qMax'].hide();
        //show Current elements
        pm.elements['cosPhiSetPoint'].show();
        pm.elements['pFGridRelease'].show();
        pm.elements['qUGridRelease'].show();
        pm.elements['qPInvRelease'].show();
        pm.elements['qUGridLimitRelease'].show();
        pm.elements['urefQUGrid'].show();
        pm.elements['urefQUGridLimit'].show();
    } else if (opMode === '2') { //2 = voltage mode
        // show Voltage elements
        pm.elements['softstartRelease'].show();
        pm.elements['fPDroopRelease'].show();
        pm.elements['vQDroopRelease'].show();
        pm.elements['fPDroop'].show();
        pm.elements['f0'].show();
        pm.elements['pMin'].show();
        pm.elements['pMax'].show();
        pm.elements['vQDroop'].show();
        pm.elements['v0'].show();
        pm.elements['qMin'].show();
        pm.elements['qMax'].show();
        //hide Current elements
        pm.elements['cosPhiSetPoint'].hide();
        pm.elements['pFGridRelease'].hide();
        pm.elements['qUGridRelease'].hide();
        pm.elements['qPInvRelease'].hide();
        pm.elements['qUGridLimitRelease'].hide();
        pm.elements['urefQUGrid'].hide();
        pm.elements['urefQUGridLimit'].hide();
        // If opMode does not === 2 or 3 then show all elements
    } else {
        for (let el in pm.elements) {
            pm.elements[el].show();
        }
    }

};
aegScGui.updateDataFieldByName = function (data, name, format) {
    if (data[name] && typeof (data[name] !== 'object')) {

        mainUtils.setHtmlText('aegSc-' + name, data[name], ((format !== undefined) ? format : 2));
    }
};
aegScGui.init = function () {
    hhContentBuilder.buildContent(aegScWebCont.main, dgm.contentPanel);

    //Creating a map that contains the data panel elements in order to show/hide depending on the power values.
    for (var i = 0; i < document.querySelector(".actualData").children.length; i++) {
        aegScGui.dataPanelMap[document.querySelector(".actualData").children[i].firstElementChild.innerText] = document.querySelector(".actualData").children[i];
    }
};
$(document).ready(function () {
    aegScGui.init();
});