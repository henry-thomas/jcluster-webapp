/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by brais, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */

/* global pm, sgschv, mu, wsm */

function createLabel(parentContainer, text) {
    let label = document.createElement('SPAN');
    label.classList.add('dscSeparatorText');
    label.style.display = 'block';
    label.innerHTML = text;
    parentContainer.appendChild(label);
}

function populateAdvOpSettings(parentContainer) {
//    createLabel(parentContainer, 'Fault recovery time');

    new ParamSetting(parentContainer, 'reactivePowerRegulationMode', {
        type: 'dropDown',
        title: 'Reactive power regulation mode:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '0',
            options: [
                {label: 'OFF', value: '0'},
                {label: 'Power factor', value: '1'},
                {label: 'Reactive power percentage', value: '2'},
                {label: 'Reactive power operation Q(U)', value: '3'}
            ]
        }
    });


//    createLabel(parentContainer, 'Active/Reactive priority');
    new ParamSetting(parentContainer, 'activeReactivePriority', {
        type: 'dropDown',
        title: 'Active/Reactive priority:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '170',
            options: [
                {label: 'Active power takes priority', value: '170'},
                {label: 'Reactive power takes priority', value: '85'}
            ]
        }
    });
//    createLabel(parentContainer, 'Battery control instruction');

//    createLabel(parentContainer, 'Active soft start');
    new ParamSetting(parentContainer, 'activeSoftStart', {
        type: 'dropDown',
        title: 'Active soft start:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '85',
            options: [
                {label: 'Enable', value: '85'},
                {label: 'Disable', value: '170'}
            ]
        }
    });
//    createLabel(parentContainer, 'Reactive soft start');
    new ParamSetting(parentContainer, 'reactiveSoftStart', {
        type: 'dropDown',
        title: 'Reactive soft start:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '85',
            options: [
                {label: 'Enable', value: '85'},
                {label: 'Disable', value: '170'}
            ]
        }
    });

    new ParamSetting(parentContainer, 'weakGridMode', {
        type: 'dropDown',
        title: 'Weak Grid Mode:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '170',
            options: [
                {label: 'Close', value: '85'},
                {label: 'Open', value: '170'}
            ]
        }
    });

//    createLabel(parentContainer, 'Frequency modulation control');
    new ParamSetting(parentContainer, 'frequencyModulationControl', {
        type: 'dropDown',
        title: 'Frequency modulation control:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '0',
            options: [
                {label: 'Disabled', value: '0'},
                {label: 'Enabled', value: '1'}
            ]
        }
    });



    new ParamSetting(parentContainer, 'faultRecoveryTime', {
        type: 'inputText',
        title: 'Fault Recovery Time:',
        ctrlInfo: '(1~600)', //TODO HCT Check this value
        inputTextConf: {
            val: 20,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 1,
            max: 600
        },
        unit: 'S'
    });
}

function populateBasicOpSettings(parentContainer) {
//        createLabel(parentContainer, 'Start/Stop');
//    new ParamSetting(parentContainer, 'startStop', {
//        type: 'dropDown',
//        title: 'Start/Stop:',
//        ctrlInfo: 'Description...',
//        dropDownConf: {
//            val: '206',
//            options: [
//                {label: 'Standby', value: '205'},
//                {label: 'Stop', value: '206'},
//                {label: 'Start', value: '207'}
//            ]
//        }
//    });
//    createLabel(parentContainer, 'Fault manual start');
    new ParamSetting(parentContainer, {type: 'dropDownButton', title: 'Start/Stop', ctrlInfo: 'Start inverter',
        content: [
            {name: 'Hot Standby', cb: fnCall.bind(this, 'startStop', '205')},
            {name: 'Stop', cb: fnCall.bind(this, 'startStop', '206')},
            {name: 'Start', cb: fnCall.bind(this, 'startStop', '207')}
        ]
    });
    //    createLabel(parentContainer, 'Inversion running mode');
    new ParamSetting(parentContainer, 'inversionRunningMode', {
        type: 'dropDown',
        title: 'Inversion running mode:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '0',
            options: [
                {label: 'PQ (Grid Tie)', value: '0'},
                {label: 'VF (Off Grid)', value: '1'},
                {label: 'VSG mode', value: '2'}
            ]
        }
    });

    new ParamSetting(parentContainer, 'workingMode', {
        type: 'dropDown',
        title: 'Working Mode:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '0',
            options: [
                {label: 'Grid-connected constant current mode', value: '0'},
                {label: 'Grid-connected constant voltage mode', value: '1'},
                {label: 'Grid-connected constant power mode (AC)', value: '2'}
            ]
        }
    });

    new ParamSetting(parentContainer, 'faultManualStart', {
        type: 'dropDown', title: 'Fault manual start:', ctrlInfo: 'Description...',
        dropDownConf: {
            val: '85',
            options: [
                {label: 'Enabled', value: '85'},
                {label: 'Disabled', value: '170'}
            ]
        }
    });


    //    createLabel(parentContainer, 'Remote & Local');
    new ParamSetting(parentContainer, 'localRemoteControl', {
        type: 'dropDown',
        title: 'Local/Remote control:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '3',
            options: [
                {label: 'Remote', value: '1'},
                {label: 'Local', value: '2'},
                {label: 'Remote & Local', value: '3'}
            ]
        }
    });


//    createLabel(parentContainer, 'Reactive power regulation mode');

//    createLabel(parentContainer, 'Zero power mode');
    new ParamSetting(parentContainer, 'zeroPowerMode', {
        type: 'dropDown', title: 'Zero Power Mode:', ctrlInfo: 'Description...',
        dropDownConf: {
            val: '85', options: [
                {label: 'Enabled', value: '170'}, {label: 'Disabled', value: '85'}
            ]
        }
    });

    new ParamSetting(parentContainer, 'batteryControlInstruction', {
        type: 'dropDown', title: 'Battery control instruction:', ctrlInfo: 'Description...',
        dropDownConf: {
            val: '0',
            options: [
                {label: 'Connected', value: '0'},
                {label: 'Disconnected', value: '1'},
                {label: 'Fault reset', value: '2'},
                {label: 'No operation', value: '3'}
            ]
        }
    });

}

function populateSystemSettings(parentContainer) {
//    createLabel(parentContainer, 'System Time');
    new ParamSetting(parentContainer, 'systemTime', {
        type: 'inputText',
        title: 'System Time:',
        ctrlInfo: '(YYYY/MM/DD hh:mm)',
        inputTextConf: {
            type: 'datetime-local'
        }
    });
    pm.elements['systemTime'].inputText.input.style.maxWidth = "280px";
    pm.elements['systemTime'].inputText.input.style.marginLeft = "100px";

    createLabel(parentContainer, 'Constant Current/Voltage/Power');
    new ParamSetting(parentContainer, 'onGridConstantCurrentValue', {
        type: 'inputText',
        title: 'On-grid constant current value:',
        ctrlInfo: '(-96.8~96.8)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12,
            min: -96.8,
            max: 96.8
        },
        unit: 'A'
    });
    new ParamSetting(parentContainer, 'onGridConstantVoltageValue', {
        type: 'inputText',
        title: 'On-grid constant voltage value:',
        ctrlInfo: '(580~1500)',
        inputTextConf: {
            val: 580,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 580,
            max: 1500
        },
        unit: 'V'
    });
    new ParamSetting(parentContainer, 'onGridConstantVoltageLimitCurrent', {
        type: 'inputText',
        title: 'On-grid constant voltage limit current:',
        ctrlInfo: '(0~96.8)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0,
            max: 96.8
        },
        unit: 'A'
    });
    new ParamSetting(parentContainer, 'onGridConstantPowerValueAC', {
        type: 'inputText',
        title: 'On-grid constant power value (AC):',
        ctrlInfo: '(-110~110)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12,
            min: -110,
            max: 110
        },
        unit: '%'
    });

    createLabel(parentContainer, 'Independent Inverter Settings');
    new ParamSetting(parentContainer, 'independentInverterVoltage', {
        type: 'inputText',
        title: 'Independent inverter voltage:',
        ctrlInfo: '(340~690)',
        inputTextConf: {
            val: 400,
            type: 'number',
            decimals: 1,
            length: 12,
            min: -110,
            max: 110
        },
        unit: 'V'
    });
    new ParamSetting(parentContainer, 'independentInverterFrequency', {
        type: 'inputText',
        title: 'Independent inverter frequency:',
        ctrlInfo: '(45~65)',
        inputTextConf: {
            val: 50,
            type: 'number',
            decimals: 2,
            length: 12,
            min: 45,
            max: 65
        },
        unit: 'Hz'
    });

    createLabel(parentContainer, 'Power Factor');
    new ParamSetting(parentContainer, 'reactivePowerPercentageSetting', {
        type: 'inputText',
        title: 'Reactive power percentage setting:',
        ctrlInfo: '(-105~105)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12,
            min: -105,
            max: 105
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'powerFactorSetting', {
        type: 'inputText',
        title: 'Power factor setting:',
        ctrlInfo: '(-1~1)',
        inputTextConf: {
            val: 1,
            type: 'number',
            decimals: 3,
            length: 12,
            min: -1,
            max: 1
        },
        unit: ''
    });

    createLabel(parentContainer, 'Frequency Modulation');
    new ParamSetting(parentContainer, 'deadBandFrequency', {
        type: 'inputText',
        title: 'Dead band frequency:',
        ctrlInfo: '(0~5)',
        inputTextConf: {
            val: 0.06,
            type: 'number',
            decimals: 2,
            length: 12,
            min: 0,
            max: 5
        },
        unit: 'Hz'
    });
    new ParamSetting(parentContainer, 'frequencyRisingSlope', {
        type: 'inputText',
        title: 'Frequency rising slope:',
        ctrlInfo: '(0~1000)',
        inputTextConf: {
            val: 100,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0,
            max: 1000
        },
        unit: '%Pn/Hz'
    });
    new ParamSetting(parentContainer, 'frequencyDeratingSlope', {
        type: 'inputText',
        title: 'Frequency derating slope:',
        ctrlInfo: '(0~1000)',
        inputTextConf: {
            val: 100,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0,
            max: 1000
        },
        unit: '%Pn/Hz'
    });
    new ParamSetting(parentContainer, 'maxChargingFMPower', {
        type: 'inputText',
        title: 'Max. charging FM power:',
        ctrlInfo: '(0~110)',
        inputTextConf: {
            val: 110,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0,
            max: 110
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'maxDischargingFMPower', {
        type: 'inputText',
        title: 'Max. discharging FM power:',
        ctrlInfo: '(0~110)',
        inputTextConf: {
            val: 110,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0,
            max: 110
        },
        unit: '%'
    });

    createLabel(parentContainer, 'Network');
    new ParamSetting(parentContainer, 'networkPortHeartbeatTimeOutPeriod', {
        type: 'inputText',
        title: 'Network Port heartbeat time-out period:',
        ctrlInfo: '(0~3600)',
        inputTextConf: {
            val: 1800,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 0,
            max: 3600
        },
        unit: 's'
    });

}

function populateBatterySettings(parentContainer) {
    createLabel(parentContainer, 'Battery Overvoltage');
    new ParamSetting(parentContainer, 'batteryOvervoltageValue', {
        type: 'inputText',
        title: 'Battery Overvoltage Value:',
        ctrlInfo: '(565~1500)',
        inputTextConf: {
            val: 565,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 565,
            max: 1500
        },
        unit: 'V'
    });
    new ParamSetting(parentContainer, 'batteryOvervoltageProtectionValue', {
        type: 'inputText',
        title: 'Battery overvoltage protection value:',
        ctrlInfo: '(580~1500)',
        inputTextConf: {
            val: 1300,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 580,
            max: 1500
        },
        unit: 'V'
    });

    createLabel(parentContainer, 'Battery Undervoltage');
    new ParamSetting(parentContainer, 'batteryUndervoltageValue', {
        type: 'inputText',
        title: 'Battery Undervoltage Value:',
        ctrlInfo: '(565~1500)',
        inputTextConf: {val: 565, type: 'number', decimals: 1, length: 12, min: 565, max: 1500},
        unit: 'V'
    });

    new ParamSetting(parentContainer, 'batteryUndervoltageProtectionValue', {
        type: 'inputText',
        title: 'Battery undervoltage protection value:',
        ctrlInfo: '(580~870)',
        inputTextConf: {
            val: 580,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 580,
            max: 870
        },
        unit: 'V'
    });

    createLabel(parentContainer, 'Battery System');
    new ParamSetting(parentContainer, 'batterySystemSOC', {
        type: 'inputText',
        title: 'Battery system SOC:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'batterySystemSOH', {
        type: 'inputText',
        title: 'Battery system SOH:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'batterySystemVoltage', {
        type: 'inputText',
        title: 'Battery system voltage:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12
        },
        unit: 'V'
    });
    new ParamSetting(parentContainer, 'batterySystemCurrent', {
        type: 'inputText',
        title: 'Battery system current:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12
        },
        unit: 'A'
    });
    new ParamSetting(parentContainer, 'maxChargingCurrent', {
        type: 'inputText',
        title: 'Max. charging current:',
        ctrlInfo: '(0~968)',
        inputTextConf: {
            val: 968,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 0,
            max: 968
        },
        unit: 'A'
    });
    new ParamSetting(parentContainer, 'maxDischargingCurrent', {
        type: 'inputText',
        title: 'Max. discharging current:',
        ctrlInfo: '(0~968)',
        inputTextConf: {
            val: 968,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 0,
            max: 968
        },
        unit: 'A'
    });

    createLabel(parentContainer, 'SOC');
    new ParamSetting(parentContainer, 'socUpperLimit', {
        type: 'inputText',
        title: 'SOC upper limit:',
        ctrlInfo: '(0~100)',
        inputTextConf: {
            val: 100,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0,
            max: 100
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'socLowerLimit', {
        type: 'inputText',
        title: 'SOC lower limit:',
        ctrlInfo: '(0~100)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0,
            max: 100
        },
        unit: '%'
    });

    createLabel(parentContainer, 'Battery Cells');
    new ParamSetting(parentContainer, 'maxCellVoltage', {
        type: 'inputText',
        title: 'Max. cell voltage:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 3,
            length: 12
        },
        unit: 'V'
    });
    new ParamSetting(parentContainer, 'minCellVoltage', {
        type: 'inputText',
        title: 'Min. cell voltage:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 3,
            length: 12
        },
        unit: 'V'
    });
    new ParamSetting(parentContainer, 'highestCellTemperature', {
        type: 'inputText',
        title: 'Highest cell temperature:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 0,
            length: 12
        },
        unit: 'C'
    });
    new ParamSetting(parentContainer, 'lowestCellTemperature', {
        type: 'inputText',
        title: 'Lowest cell temperature:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 0,
            length: 12
        },
        unit: 'C'
    });

    createLabel(parentContainer, 'Average Container Temperature');
    new ParamSetting(parentContainer, 'averageContainerTemperature', {
        type: 'inputText',
        title: 'Average container temperature:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 0,
            length: 12
        },
        unit: 'C'
    });

    createLabel(parentContainer, 'Current Limit Values');
    new ParamSetting(parentContainer, 'chargingCurrentLimitValue', {
        type: 'inputText',
        title: 'Charging current limit value:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12
        },
        unit: 'A'
    });
    new ParamSetting(parentContainer, 'dischargingCurrentLimitValue', {
        type: 'inputText',
        title: 'Discharging current limit value:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12
        },
        unit: 'A'
    });

    createLabel(parentContainer, 'Cut-off Values');
    new ParamSetting(parentContainer, 'chargingCutoffVoltage', {
        type: 'inputText',
        title: 'Charging cut-off voltage:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12
        },
        unit: 'V'
    });
    new ParamSetting(parentContainer, 'dischargingCutoffVoltage', {
        type: 'inputText',
        title: 'Discharging cut-off voltage:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12
        },
        unit: 'V'
    });
    new ParamSetting(parentContainer, 'cutoffDischargingSOC', {
        type: 'inputText',
        title: 'Cutoff discharging SOC:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'cutoffChargingSOC', {
        type: 'inputText',
        title: 'Cutoff charging SOC:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12
        },
        unit: '%'
    });

    createLabel(parentContainer, 'Accumulated Energy');
    new ParamSetting(parentContainer, 'accumulatedChargingEnergy', {
        type: 'inputText',
        title: 'Accumulated charging energy:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12
        },
        unit: 'kWh'
    });
    new ParamSetting(parentContainer, 'accumulatedDischargingEnergy', {
        type: 'inputText',
        title: 'Accumulated discharging energy:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12
        },
        unit: 'kWh'
    });

    createLabel(parentContainer, 'Battery States');
    new ParamSetting(parentContainer, 'batteryState1', {
        type: 'inputText',
        title: 'Battery state 1:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 0,
            length: 12
        },
        unit: ''
    });
    new ParamSetting(parentContainer, 'batteryState2', {
        type: 'inputText',
        title: 'Battery state 2:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 0,
            length: 12
        },
        unit: ''
    });

    createLabel(parentContainer, 'Battery Alarms');
    new ParamSetting(parentContainer, 'batteryAlarm1', {
        type: 'inputText',
        title: 'Battery alarm 1:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 0,
            length: 12
        },
        unit: ''
    });
    new ParamSetting(parentContainer, 'batteryAlarm2', {
        type: 'inputText',
        title: 'Battery alarm 2:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 0,
            length: 12
        },
        unit: ''
    });
    new ParamSetting(parentContainer, 'batteryAlarm3', {
        type: 'inputText',
        title: 'Battery alarm 3:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 0,
            length: 12
        },
        unit: ''
    });
    new ParamSetting(parentContainer, 'batteryAlarm4', {
        type: 'inputText',
        title: 'Battery alarm 4:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 0,
            length: 12
        },
        unit: ''
    });

    createLabel(parentContainer, 'Battery Faults');
    new ParamSetting(parentContainer, 'batteryFault1', {
        type: 'inputText',
        title: 'Battery fault 1:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 0,
            length: 12
        },
        unit: ''
    });
    new ParamSetting(parentContainer, 'batteryFault2', {
        type: 'inputText',
        title: 'Battery fault 2:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 0,
            length: 12
        },
        unit: ''
    });
    new ParamSetting(parentContainer, 'batteryFault3', {
        type: 'inputText',
        title: 'Battery fault 3:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 0,
            length: 12
        },
        unit: ''
    });
    new ParamSetting(parentContainer, 'batteryFault4', {
        type: 'inputText',
        title: 'Battery fault 4:',
        ctrlInfo: '',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 0,
            length: 12
        },
        unit: ''
    });



}

function populateProtSettings(parentContainer) {


    createLabel(parentContainer, 'Derating Point');
    new ParamSetting(parentContainer, 'reactivePowerDeratingPoint', {
        type: 'inputText',
        title: 'Reactive Power Derating Point:',
        ctrlInfo: '(102~150)',
        inputTextConf: {
            val: 110,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 102,
            max: 150
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'activePowerDeratingPoint', {
        type: 'inputText',
        title: 'Active Power Derating Point:',
        ctrlInfo: '(102~150.1)',
        inputTextConf: {
            val: 113,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 102,
            max: 150.1
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'activePowerDerating', {
        type: 'inputText',
        title: 'Active power derating:',
        ctrlInfo: '(100~110)',
        inputTextConf: {
            val: 110,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 100,
            max: 110
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'apparentPowerDerating', {
        type: 'inputText',
        title: 'Apparent power derating:',
        ctrlInfo: '(100~110)',
        inputTextConf: {
            val: 110,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 100,
            max: 110
        },
        unit: '%'
    });



    createLabel(parentContainer, 'Leakage Current Protection Value');
    new ParamSetting(parentContainer, 'leakageCurrentProtectionValue', {
        type: 'inputText',
        title: 'Leakage current protection value:',
        ctrlInfo: '(30~10000)',
        inputTextConf: {
            val: 300,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 0,
            max: 100
        },
        unit: 'mA'
    });

    createLabel(parentContainer, 'Active islanding');
    new ParamSetting(parentContainer, 'activeIslanding', {
        type: 'dropDown',
        title: 'Active islanding:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '170',
            options: [
                {label: 'Enabled', value: '170'},
                {label: 'Disabled', value: '85'}
            ]
        }
    });

    createLabel(parentContainer, 'Low Voltage Ride Through (LVRT)');
    new ParamSetting(parentContainer, 'lvrtSwitch', {
        type: 'dropDown',
        title: 'LVRT switch:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '85',
            options: [
                {label: 'Enabled', value: '170'},
                {label: 'Disabled', value: '85'}
            ]
        }
    });
    new ParamSetting(parentContainer, 'lvrtVoltage1', {
        type: 'inputText',
        title: 'LVRT voltage1:',
        ctrlInfo: '(85~90)',
        inputTextConf: {
            val: 90,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 85,
            max: 90
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'lvrtVoltage2', {
        type: 'inputText',
        title: 'LVRT voltage2:',
        ctrlInfo: '(5~40)',
        inputTextConf: {
            val: 20,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 5,
            max: 40
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'lvrtTime1', {
        type: 'inputText',
        title: 'LVRT time 1:',
        ctrlInfo: '(2500~3500)',
        inputTextConf: {
            val: 3000,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 2500,
            max: 3500
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'lvrtTime2', {
        type: 'inputText',
        title: 'LVRT time 2:',
        ctrlInfo: '(500~1500)',
        inputTextConf: {
            val: 1000,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 500,
            max: 1500
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'lvrtKFactor', {
        type: 'inputText',
        title: 'LVRT K factor:',
        ctrlInfo: '(0~3)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 0,
            max: 3
        },
        unit: ''
    });

    createLabel(parentContainer, 'High Voltage Ride Through (HVRT)');
    new ParamSetting(parentContainer, 'hvrtSwitch', {
        type: 'dropDown',
        title: 'HVRT switch:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '85',
            options: [
                {label: 'Enabled', value: '170'},
                {label: 'Disabled', value: '85'}
            ]
        }
    });
    new ParamSetting(parentContainer, 'hvrtVoltage1', {
        type: 'inputText',
        title: 'HVRT voltage1:',
        ctrlInfo: '(110~120)',
        inputTextConf: {
            val: 110,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 110,
            max: 120
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'hvrtVoltage2', {
        type: 'inputText',
        title: 'HVRT voltage2:',
        ctrlInfo: '(120~140)',
        inputTextConf: {
            val: 120,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 120,
            max: 140
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'hvrtTime1', {
        type: 'inputText',
        title: 'HVRT time 1:',
        ctrlInfo: '(100~20000)',
        inputTextConf: {
            val: 10000,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 100,
            max: 20000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'hvrtTime2', {
        type: 'inputText',
        title: 'HVRT time 2:',
        ctrlInfo: '(100~5000)',
        inputTextConf: {
            val: 1500,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 100,
            max: 5000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'hvrtKFactor', {
        type: 'inputText',
        title: 'HVRT K Factor:',
        ctrlInfo: '(0~3)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0,
            max: 3
        },
        unit: ''
    });

    createLabel(parentContainer, 'Grid Unbalance Protection');
    new ParamSetting(parentContainer, 'gridUnbalanceProtectionAmplitude', {
        type: 'inputText',
        title: 'Grid unbalance protection amplitude:',
        ctrlInfo: '(3~20)',
        inputTextConf: {
            val: 5,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 3,
            max: 20
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'gridUnbalanceProtectionTime', {
        type: 'inputText',
        title: 'Grid unbalance protection time:',
        ctrlInfo: '(0.1~600)',
        inputTextConf: {
            val: 60,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0.1,
            max: 600
        },
        unit: 's'
    });

    createLabel(parentContainer, 'Insulation Resistance');
    new ParamSetting(parentContainer, 'insulationResistance', {
        type: 'dropDown',
        title: 'Insulation resistance:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '85',
            options: [
                {label: 'Enabled', value: '170'},
                {label: 'Disabled', value: '85'}
            ]
        }
    });
    new ParamSetting(parentContainer, 'insulationResistanceProtectionValue', {
        type: 'inputText',
        title: 'Insulation resistance protection value:',
        ctrlInfo: '(15~100)',
        inputTextConf: {
            val: 50,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 15,
            max: 100
        },
        unit: 'kΩ'
    });
    new ParamSetting(parentContainer, 'insulationResistanceProtectionTime', {
        type: 'inputText',
        title: 'Insulation resistance protection time:',
        ctrlInfo: '(30~600)',
        inputTextConf: {
            val: 150,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 30,
            max: 600
        },
        unit: 's'
    });

    createLabel(parentContainer, 'Insulation Monitoring');
    new ParamSetting(parentContainer, 'insulationMonitoringAlarmThreshold', {
        type: 'inputText',
        title: 'Insulation Monitoring Alarm Threshold:',
        ctrlInfo: '(0~1000)',
        inputTextConf: {
            val: 150,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 0,
            max: 1000
        },
        unit: 'kΩ'
    });
    new ParamSetting(parentContainer, 'insulationMonitoringStartingVoltage', {
        type: 'inputText',
        title: 'Insulation Monitoring Starting Voltage:',
        ctrlInfo: '(480~1500)',
        inputTextConf: {
            val: 480,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 480,
            max: 1500
        },
        unit: 'V'
    });
    new ParamSetting(parentContainer, 'insulationImpedanceDetection', {
        type: 'dropDown',
        title: 'Insulation Impedance Detection:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '85',
            options: [
                {label: 'Enabled', value: '1'},
                {label: 'Disabled', value: '0'}
            ]
        }
    });

    createLabel(parentContainer, 'Passive Islanding');
    new ParamSetting(parentContainer, 'passiveIslanding', {
        type: 'dropDown',
        title: 'Passive Islanding:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '85',
            options: [
                {label: 'Enabled', value: '170'},
                {label: 'Disabled', value: '85'}
            ]
        }
    });
    new ParamSetting(parentContainer, 'passiveIslandingProtectionPoint', {
        type: 'inputText',
        title: 'Passive Islanding Protection Point:',
        ctrlInfo: '(0.3~18)',
        inputTextConf: {
            val: 5,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0.3,
            max: 18
        },
        unit: '°'
    });

    createLabel(parentContainer, 'Grid Voltage Suppression');
    new ParamSetting(parentContainer, 'gridVoltageSuppression', {
        type: 'dropDown',
        title: 'Grid Voltage Suppression:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '85',
            options: [
                {label: 'Disabled', value: '170'},
                {label: 'Enabled', value: '85'}
            ]
        }
    });

    createLabel(parentContainer, 'Overvoltage Protection');
    new ParamSetting(parentContainer, 'overvoltageLevel1ProtectionValue', {
        type: 'inputText',
        title: 'Overvoltage level-1 protection value:',
        ctrlInfo: '(105~150)',
        inputTextConf: {
            val: 110,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 105,
            max: 150
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'overvoltageLevel2ProtectionValue', {
        type: 'inputText',
        title: 'Overvoltage level-2 protection value:',
        ctrlInfo: '(105~150)',
        inputTextConf: {
            val: 120,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 105,
            max: 150
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'overvoltageLevel3ProtectionValue', {
        type: 'inputText',
        title: 'Overvoltage level-3 protection value:',
        ctrlInfo: '(105~150)',
        inputTextConf: {
            val: 130,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 105,
            max: 150
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'overvoltageLevel4ProtectionValue', {
        type: 'inputText',
        title: 'Overvoltage level-4 protection value:',
        ctrlInfo: '(105~150)',
        inputTextConf: {
            val: 130,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 105,
            max: 150
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'overvoltageLevel5ProtectionValue', {
        type: 'inputText',
        title: 'Overvoltage level-5 protection value:',
        ctrlInfo: '(105~150)',
        inputTextConf: {
            val: 130,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 105,
            max: 150
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'overvoltageLevel1ProtectionTime', {
        type: 'inputText',
        title: 'Overvoltage level-1 protection time:',
        ctrlInfo: '(40~60000)',
        inputTextConf: {
            val: 20000,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 40,
            max: 60000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'overvoltageLevel2ProtectionTime', {
        type: 'inputText',
        title: 'Overvoltage level-2 protection time:',
        ctrlInfo: '(40~60000)',
        inputTextConf: {
            val: 1000,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 40,
            max: 60000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'overvoltageLevel3ProtectionTime', {
        type: 'inputText',
        title: 'Overvoltage level-3 protection time:',
        ctrlInfo: '(40~60000)',
        inputTextConf: {
            val: 100,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 40,
            max: 60000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'overvoltageLevel4ProtectionTime', {
        type: 'inputText',
        title: 'Overvoltage level-4 protection time:',
        ctrlInfo: '(40~60000)',
        inputTextConf: {
            val: 100,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 40,
            max: 60000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'overvoltageLevel5ProtectionTime', {
        type: 'inputText',
        title: 'Overvoltage level-5 protection time:',
        ctrlInfo: '(40~60000)',
        inputTextConf: {
            val: 100,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 40,
            max: 60000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'overvoltageProtectionRecoveryValue', {
        type: 'inputText',
        title: 'Overvoltage protection recovery value:',
        ctrlInfo: '(105~150)',
        inputTextConf: {
            val: 105,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 105,
            max: 150
        },
        unit: '%'
    });

    createLabel(parentContainer, 'Undervoltage Protection');
    new ParamSetting(parentContainer, 'undervoltageLevel1ProtectionValue', {
        type: 'inputText',
        title: 'Undervoltage level-1 protection value:',
        ctrlInfo: '(10~95)',
        inputTextConf: {
            val: 85,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 10,
            max: 95
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'undervoltageLevel2ProtectionValue', {
        type: 'inputText',
        title: 'Undervoltage level-2 protection value:',
        ctrlInfo: '(10~95)',
        inputTextConf: {
            val: 50,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 10,
            max: 95
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'undervoltageLevel3ProtectionValue', {
        type: 'inputText',
        title: 'Undervoltage level-3 protection value:',
        ctrlInfo: '(10~95)',
        inputTextConf: {
            val: 20,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 10,
            max: 95
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'undervoltageLevel4ProtectionValue', {
        type: 'inputText',
        title: 'Undervoltage level-4 protection value:',
        ctrlInfo: '(10~95)',
        inputTextConf: {
            val: 20,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 10,
            max: 95
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'undervoltageLevel5ProtectionValue', {
        type: 'inputText',
        title: 'Undervoltage level-5 protection value:',
        ctrlInfo: '(10~95)',
        inputTextConf: {
            val: 20,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 10,
            max: 95
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'undervoltageLevel1ProtectionTime', {
        type: 'inputText',
        title: 'Undervoltage level-1 protection time:',
        ctrlInfo: '(40~600000)',
        inputTextConf: {
            val: 4000,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 40,
            max: 600000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'undervoltageLevel2ProtectionTime', {
        type: 'inputText',
        title: 'Undervoltage level-2 protection time:',
        ctrlInfo: '(40~600000)',
        inputTextConf: {
            val: 1260,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 40,
            max: 600000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'undervoltageLevel3ProtectionTime', {
        type: 'inputText',
        title: 'Undervoltage level-3 protection time:',
        ctrlInfo: '(40~600000)',
        inputTextConf: {
            val: 300,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 40,
            max: 600000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'undervoltageLevel4ProtectionTime', {
        type: 'inputText',
        title: 'Undervoltage level-4 protection time:',
        ctrlInfo: '(40~600000)',
        inputTextConf: {
            val: 300,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 40,
            max: 600000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'undervoltageLevel5ProtectionTime', {
        type: 'inputText',
        title: 'Undervoltage level-5 protection time:',
        ctrlInfo: '(40~600000)',
        inputTextConf: {
            val: 300,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 40,
            max: 600000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'undervoltageProtectionRecoveryValue', {
        type: 'inputText',
        title: 'Undervoltage protection recovery value:',
        ctrlInfo: '(10~95)',
        inputTextConf: {
            val: 95,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 10,
            max: 95
        },
        unit: 'ms'
    });

    createLabel(parentContainer, 'Overfrequency Protection');
    new ParamSetting(parentContainer, 'overfrequencyLevel1ProtectionValue', {
        type: 'inputText',
        title: 'Overfrequency level-1 protection value:',
        ctrlInfo: '(50.2~66)',
        inputTextConf: {
            val: 60.6,
            type: 'number',
            decimals: 2,
            length: 12,
            min: 50.2,
            max: 66
        },
        unit: 'Hz'
    });
    new ParamSetting(parentContainer, 'overfrequencyLevel2ProtectionValue', {
        type: 'inputText',
        title: 'Overfrequency level-2 protection value:',
        ctrlInfo: '(50.2~66)',
        inputTextConf: {
            val: 61.6,
            type: 'number',
            decimals: 2,
            length: 12,
            min: 50.2,
            max: 66
        },
        unit: 'Hz'
    });
    new ParamSetting(parentContainer, 'overfrequencyLevel3ProtectionValue', {
        type: 'inputText',
        title: 'Overfrequency level-3 protection value:',
        ctrlInfo: '(50.2~66)',
        inputTextConf: {
            val: 61.7,
            type: 'number',
            decimals: 2,
            length: 12,
            min: 50.2,
            max: 66
        },
        unit: 'Hz'
    });
    new ParamSetting(parentContainer, 'overfrequencyLevel4ProtectionValue', {
        type: 'inputText',
        title: 'Overfrequency level-4 protection value:',
        ctrlInfo: '(50.2~66)',
        inputTextConf: {
            val: 61.7,
            type: 'number',
            decimals: 2,
            length: 12,
            min: 50.2,
            max: 66
        },
        unit: 'Hz'
    });
    new ParamSetting(parentContainer, 'overfrequencyLevel5ProtectionValue', {
        type: 'inputText',
        title: 'Overfrequency level-5 protection value:',
        ctrlInfo: '(50.2~66)',
        inputTextConf: {
            val: 61.7,
            type: 'number',
            decimals: 2,
            length: 12,
            min: 50.2,
            max: 66
        },
        unit: 'Hz'
    });
    new ParamSetting(parentContainer, 'overfrequencyLevel1ProtectionTime', {
        type: 'inputText',
        title: 'Overfrequency level-1 protection time:',
        ctrlInfo: '(20~1000000)',
        inputTextConf: {
            val: 90050,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 20,
            max: 1000000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'overfrequencyLevel2ProtectionTime', {
        type: 'inputText',
        title: 'Overfrequency level-2 protection time:',
        ctrlInfo: '(20~1000000)',
        inputTextConf: {
            val: 15050,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 20,
            max: 1000000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'overfrequencyLevel3ProtectionTime', {
        type: 'inputText',
        title: 'Overfrequency level-3 protection time:',
        ctrlInfo: '(20~1000000)',
        inputTextConf: {
            val: 50,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 20,
            max: 1000000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'overfrequencyLevel4ProtectionTime', {
        type: 'inputText',
        title: 'Overfrequency level-4 protection time:',
        ctrlInfo: '(20~1000000)',
        inputTextConf: {
            val: 50,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 20,
            max: 1000000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'overfrequencyLevel5ProtectionTime', {
        type: 'inputText',
        title: 'Overfrequency level-5 protection time:',
        ctrlInfo: '(20~1000000)',
        inputTextConf: {
            val: 50,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 20,
            max: 1000000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'overfrequencyProtectionRecoveryValue', {
        type: 'inputText',
        title: 'Overfrequency protection recovery value:',
        ctrlInfo: '(50.2~66)',
        inputTextConf: {
            val: 60.2,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 50.2,
            max: 166
        },
        unit: 'Hz'
    });

    createLabel(parentContainer, 'Underfrequency Protection');
    new ParamSetting(parentContainer, 'underfrequencyLevel1ProtectionValue', {
        type: 'inputText',
        title: 'Underfrequency level-1 protection value:',
        ctrlInfo: '(45~59.8)',
        inputTextConf: {
            val: 59.4,
            type: 'number',
            decimals: 2,
            length: 12,
            min: 45,
            max: 59.8
        },
        unit: 'Hz'
    });
    new ParamSetting(parentContainer, 'underfrequencyLevel2ProtectionValue', {
        type: 'inputText',
        title: 'Underfrequency level-2 protection value:',
        ctrlInfo: '(45~59.8)',
        inputTextConf: {
            val: 58.4,
            type: 'number',
            decimals: 2,
            length: 12,
            min: 45,
            max: 59.8
        },
        unit: 'Hz'
    });
    new ParamSetting(parentContainer, 'underfrequencyLevel3ProtectionValue', {
        type: 'inputText',
        title: 'Underfrequency level-3 protection value:',
        ctrlInfo: '(45~59.8)',
        inputTextConf: {
            val: 57.3,
            type: 'number',
            decimals: 2,
            length: 12,
            min: 45,
            max: 59.8
        },
        unit: 'Hz'
    });
    new ParamSetting(parentContainer, 'underfrequencyLevel4ProtectionValue', {
        type: 'inputText',
        title: 'Underfrequency level-4 protection value:',
        ctrlInfo: '(45~59.8)',
        inputTextConf: {
            val: 57,
            type: 'number',
            decimals: 2,
            length: 12,
            min: 45,
            max: 59.8
        },
        unit: 'Hz'
    });
    new ParamSetting(parentContainer, 'underfrequencyLevel5ProtectionValue', {
        type: 'inputText',
        title: 'Underfrequency level-5 protection value:',
        ctrlInfo: '(45~59.8)',
        inputTextConf: {
            val: 59.4,
            type: 'number',
            decimals: 2,
            length: 12,
            min: 45,
            max: 59.8
        },
        unit: 'Hz'
    });
    new ParamSetting(parentContainer, 'underfrequencyLevel1ProtectionTime', {
        type: 'inputText',
        title: 'Underfrequency level-1 protection time:',
        ctrlInfo: '(20~1000000)',
        inputTextConf: {
            val: 90050,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 20,
            max: 1000000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'underfrequencyLevel2ProtectionTime', {
        type: 'inputText',
        title: 'Underfrequency level-2 protection time:',
        ctrlInfo: '(20~1000000)',
        inputTextConf: {
            val: 15050,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 20,
            max: 1000000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'underfrequencyLevel3ProtectionTime', {
        type: 'inputText',
        title: 'Underfrequency level-3 protection time:',
        ctrlInfo: '(20~1000000)',
        inputTextConf: {
            val: 3800,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 20,
            max: 1000000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'underfrequencyLevel4ProtectionTime', {
        type: 'inputText',
        title: 'Underfrequency level-4 protection time:',
        ctrlInfo: '(20~1000000)',
        inputTextConf: {
            val: 420,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 20,
            max: 1000000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'underfrequencyLevel5ProtectionTime', {
        type: 'inputText',
        title: 'Underfrequency level-5 protection time:',
        ctrlInfo: '(20~1000000)',
        inputTextConf: {
            val: 50,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 20,
            max: 1000000
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'underfrequencyProtectionRecoveryValue', {
        type: 'inputText',
        title: 'Underfrequency protection recovery value:',
        ctrlInfo: '(50.2~66)',
        inputTextConf: {
            val: 60.2,
            type: 'number',
            decimals: 2,
            length: 12,
            min: 50.2,
            max: 66
        },
        unit: 'Hz'
    });

    createLabel(parentContainer, 'Fault Ride-Through');
    new ParamSetting(parentContainer, 'tenMinOvervoltageProtection', {
        type: 'inputText',
        title: '10-min Overvoltage Protection:',
        ctrlInfo: '(100~150)',
        inputTextConf: {
            val: 110.5,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 100,
            max: 150
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'faultRecoveryTimeMillis', {
        type: 'inputText',
        title: 'Fault recovery time:',
        ctrlInfo: '(45000~59800)',
        inputTextConf: {
            val: 59800,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 45000,
            max: 59800
        },
        unit: 'ms'
    });
    new ParamSetting(parentContainer, 'qpPowerRisingStartPoint', {
        type: 'inputText',
        title: 'QP power rising start point:',
        ctrlInfo: '(0~50)',
        inputTextConf: {
            val: 20,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0,
            max: 50
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'qpPowerRisingEndPoint', {
        type: 'inputText',
        title: 'QP power rising end point:',
        ctrlInfo: '(50~100)',
        inputTextConf: {
            val: 100,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 50,
            max: 100
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'qpPowerDeclineStartPoint', {
        type: 'inputText',
        title: 'QP power decline start point:',
        ctrlInfo: '(-100~50)',
        inputTextConf: {
            val: -20,
            type: 'number',
            decimals: 1,
            length: 12,
            min: -100,
            max: 50
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'qpPowerDeclineEndPoint', {
        type: 'inputText',
        title: 'QP power decline end point:',
        ctrlInfo: '(-100~50)',
        inputTextConf: {
            val: -100,
            type: 'number',
            decimals: 1,
            length: 12,
            min: -100,
            max: 50
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'maxQuPF2', {
        type: 'inputText',
        title: 'Max. QU PF:',
        ctrlInfo: '(0.9~1)',
        inputTextConf: {
            val: 0.9,
            type: 'number',
            decimals: 3,
            length: 12,
            min: 0.9,
            max: 1
        },
        unit: ''
    });
}

function populateInvModeSettings(parentContainer) {
    createLabel(parentContainer, 'QU');
    new ParamSetting(parentContainer, 'quVoltageRisingStartPoint', {
        type: 'inputText',
        title: 'QU voltage rising start point:',
        ctrlInfo: '(90~110)',
        inputTextConf: {
            val: 102,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 90,
            max: 110
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'quVoltageRisingEndPoint', {
        type: 'inputText',
        title: 'QU voltage rising end point:',
        ctrlInfo: '(90~120)',
        inputTextConf: {
            val: 104,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 90,
            max: 120
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'quVoltageDeclineStartPoint', {
        type: 'inputText',
        title: 'QU voltage decline start point:',
        ctrlInfo: '(90~110)',
        inputTextConf: {
            val: 98,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 90,
            max: 110
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'quVoltageDeclineEndPoint', {
        type: 'inputText',
        title: 'QU voltage decline end point:',
        ctrlInfo: '(80~110)',
        inputTextConf: {
            val: 96,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 80,
            max: 110
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'quWorkingMode', {
        type: 'dropDown',
        title: 'QU working mode:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '0',
            options: [
                {label: 'Reactive power ratio mode', value: '0'},
                {label: 'Power factor mode', value: '1'}
            ]
        }
    });
    new ParamSetting(parentContainer, 'maxQuReactivePower', {
        type: 'inputText',
        title: 'Max. QU reactive power:',
        ctrlInfo: '(0~100)',
        inputTextConf: {
            val: 75,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0,
            max: 100
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'maxQuPF', {
        type: 'inputText',
        title: 'Max. QU PF:',
        ctrlInfo: '(0.8~1)',
        inputTextConf: {
            val: 0.9,
            type: 'number',
            decimals: 3,
            length: 12,
            min: 0,
            max: 1
        },
        unit: ''
    });
    new ParamSetting(parentContainer, 'quEnablePower', {
        type: 'inputText',
        title: 'QU enable power:',
        ctrlInfo: '(0~100)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0,
            max: 100
        },
        unit: '%'
    });

    createLabel(parentContainer, 'PU');
    new ParamSetting(parentContainer, 'puCharacteristicEnabling', {
        type: 'inputText',
        title: 'PU characteristic enabling:',
        ctrlInfo: '(0~1)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 0,
            max: 1
        },
        unit: ''
    });
    new ParamSetting(parentContainer, 'puVoltageRisingStartPoint', {
        type: 'inputText',
        title: 'PU voltage rising start point:',
        ctrlInfo: '(100~110)',
        inputTextConf: {
            val: 106,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 100,
            max: 110
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'puVoltageRisingEndPoint', {
        type: 'inputText',
        title: 'PU voltage rising end point:',
        ctrlInfo: '(100~120)',
        inputTextConf: {
            val: 110,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 100,
            max: 120
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'puVoltageDeclineStartPoint', {
        type: 'inputText',
        title: 'PU voltage decline start point:',
        ctrlInfo: '(90~100)',
        inputTextConf: {
            val: 94,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 90,
            max: 100
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'puVoltageDeclineEndPoint', {
        type: 'inputText',
        title: 'PU voltage decline end point:',
        ctrlInfo: '(80~100)',
        inputTextConf: {
            val: 90,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 80,
            max: 100
        },
        unit: '%'
    });

    createLabel(parentContainer, 'Virtual Synchronous Generator (VSG)');
    new ParamSetting(parentContainer, 'vsgNominalOutputVoltage', {
        type: 'inputText',
        title: 'VSG nominal output voltage:',
        ctrlInfo: '(340~690)',
        inputTextConf: {
            val: 400,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 340,
            max: 690
        },
        unit: 'V'
    });
    new ParamSetting(parentContainer, 'vsgNominalOutputFrequency', {
        type: 'inputText',
        title: 'VSG nominal output frequency:',
        ctrlInfo: '(45~65)',
        inputTextConf: {
            val: 50,
            type: 'number',
            decimals: 2,
            length: 12,
            min: 45,
            max: 65
        },
        unit: 'Hz'
    });
    new ParamSetting(parentContainer, 'vsgFrequencyDroopSlope', {
        type: 'inputText',
        title: 'VSG frequency droop slope:',
        ctrlInfo: '(1~2)',
        inputTextConf: {
            val: 1,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 1,
            max: 2
        },
        unit: ''
    });
    new ParamSetting(parentContainer, 'vsgVoltageDroopSlope', {
        type: 'inputText',
        title: 'VSG voltage droop slope:',
        ctrlInfo: '(1~2)',
        inputTextConf: {
            val: 1,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 1,
            max: 2
        },
        unit: ''
    });
    new ParamSetting(parentContainer, 'vsgActivePowerSetpoint', {
        type: 'inputText',
        title: 'VSG active power setpoint:',
        ctrlInfo: '(-100~100)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12,
            min: -100,
            max: 100
        },
        unit: ''
    });
    new ParamSetting(parentContainer, 'vsgReactivePowerSetpoint', {
        type: 'inputText',
        title: 'VSG reactive power setpoint:',
        ctrlInfo: '(-100~100)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12,
            min: -100,
            max: 100
        },
        unit: ''
    });
    new ParamSetting(parentContainer, 'activePowerRisingSpeed', {
        type: 'inputText',
        title: 'Active power rising speed:',
        ctrlInfo: '(0.1~2000)',
        inputTextConf: {
            val: 500,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0.1,
            max: 2000
        },
        unit: '%/s'
    });
    new ParamSetting(parentContainer, 'activePowerDeclineSpeed', {
        type: 'inputText',
        title: 'Active power decline speed:',
        ctrlInfo: '(0.1~2000)',
        inputTextConf: {
            val: 500,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0.1,
            max: 2000
        },
        unit: '%/s'
    });
    new ParamSetting(parentContainer, 'reactivePowerRisingSpeed', {
        type: 'inputText',
        title: 'Reactive power rising speed:',
        ctrlInfo: '(0.5~2000)',
        inputTextConf: {
            val: 200,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0.5,
            max: 2000
        },
        unit: '%/s'
    });
    new ParamSetting(parentContainer, 'reactivePowerDeclineSpeed', {
        type: 'inputText',
        title: 'Reactive power decline speed:',
        ctrlInfo: '(0.5~2000)',
        inputTextConf: {
            val: 200,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0.5,
            max: 2000
        },
        unit: '%/s'
    });
}

function populateEmsSettings(cont) {
    new ParamSetting(cont, 'emsParam.emsMaxPowerPer', {type: 'inputNumber', title: 'Maximum EMS Power:', unit: '%', ctrlInfo: 'Maximum power restriction for EMS, value in % of rated Power.'});
    new ParamSetting(cont, 'emsParam.emsMinPowerPer', {type: 'inputNumber', title: 'Minimum EMS Power:', unit: '%', ctrlInfo: 'Minimum power restriction for EMS, value in % of rated Power.'});
    new ParamSetting(cont, 'emsParam.emsChnageRatioPer', {type: 'inputNumber', title: 'Change Ratio:', unit: '%', ctrlInfo: 'This parameter is used to limit the overshooting and oscilating of the inverter power.'});

    new ParamSetting(cont, 'emsParam.emsNotActiveState', {type: 'inputNumber', title: 'EMS Not Active State:', ctrlInfo: ''});
    new ParamSetting(cont, 'emsParam.emsNotActivePower', {type: 'inputNumber', title: 'EMS Not Active Power:', unit: '%', ctrlInfo: ''});

    new ParamSetting(cont, 'busName', {type: 'inputText', title: 'DC BUS Name:', ctrlInfo: 'Used to link inverter with battery info.'});

    new ParamSetting(cont, 'emsParam.emsAllowOnOff', {type: 'switch', title: 'Allow Ems Inverter State Control:', ctrlInfo: 'This parameter, when enabled, allows EMS to turn the inverter on and off.'});
    new ParamSetting(cont, 'emsParam.emsAllowOnGridModeChange', {type: 'switch', title: 'Allow EMS On-grid charge/discharge mode change:', ctrlInfo: 'This parameter when enabled, allows EMS to change On-grid charge/discharge mode.'});
    new ParamSetting(cont, 'emsParam.emsAllowOpModeChange', {type: 'switch', title: 'Allow Ems On/Off-grid mode setting change:', ctrlInfo: 'This parameter when enabled, allows EMS to change On/Off-grid mode setting.'});
}

function populatePowerDataRecSettigns(cont) {
    new ParamSetting(cont, 'batChargePowerType', {
        type: 'dropDown',
        title: 'Bat Charge Power Type',
        ctrlInfo: '',
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
    new ParamSetting(cont, 'batDischPowerType', {
        type: 'dropDown',
        title: 'Bat Disch Power Type',
        ctrlInfo: '',
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
}


let settings = {
    init: function () {
        settings.accPanel = new SMDUIAccordianPanel('settingsSungrow', {
            tabs: [
                {
                    label: 'System Settings',
                    id: '1'
                },
                {
                    label: 'Battery settings',
                    id: '2'
                },
                {
                    label: 'Protection Settings',
                    id: '3'
                },
                {
                    label: 'Inversion Mode Settings',
                    id: '4'
                },
                {
                    label: 'EMS Settings',
                    id: '5'
                },
                {
                    label: 'Power Data Record Settings',
                    id: '6'
                }
            ],
            multiple: false,
            selectedTab: '1',
            onInitComplete: function (el) {
//                debugger;
                populateSystemSettings(el.getTabById('1').content);
                populateBatterySettings(el.getTabById('2').content);
                populateProtSettings(el.getTabById('3').content);
                populateInvModeSettings(el.getTabById('4').content);
                populateEmsSettings(el.getTabById('5').content);
                populatePowerDataRecSettigns(el.getTabById('6').content);
            }
        });

        settings.opSettings = new SMDUIAccordianPanel('sgsc-opSettings-p1', {
            tabs: [
                {
                    label: 'Basic Control',
                    id: '1'
                },
                {
                    label: 'Advanced Control',
                    id: '2'
                }
            ],
            selectedTab: '1',
            onInitComplete: function (el) {
                populateBasicOpSettings(el.getTabById('1').content);
                populateAdvOpSettings(el.getTabById('2').content);
            }
        });
    }
};

let fnCall = function (instrExt, execFn, successCb, errorCb) {
    console.log(execFn);
    let succCb = function (msg, data) {
        mu.showInfoMessage('Success');
    };
    let eCb = function (msg, errMsg) {
        mu.showErrorMessage('Error', errMsg);
    };
    wsm.sendDevMsgExecWithJsonInst(
            {
                instrExt: instrExt,
                execFn: execFn
            },
            succCb, eCb
            );
};

$(document).ready(function () {
    settings.init();
});
