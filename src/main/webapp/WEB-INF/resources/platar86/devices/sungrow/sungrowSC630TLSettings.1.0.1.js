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

/* global pm */

function createLabel(parentContainer, text) {
    let label = document.createElement('SPAN');
    label.classList.add('dscSeparatorText');
    label.style.display = 'block';
    label.innerHTML = text;
    parentContainer.appendChild(label);

}

function populateSystemSettings(parentContainer) {
    createLabel(parentContainer, 'Time Data');
    new ParamSetting(parentContainer, 'systemTime', {
        type: 'inputText',
        title: 'System Time:',
        ctrlInfo: '(YYYY/MM/DD hh:mm)',
        inputTextConf: {
            type: 'datetime-local'
        }
    });
    pm.elements['systemTime'].inputText.input.style.maxWidth = "180px";
    createLabel(parentContainer, 'Inverter communication');
    new ParamSetting(parentContainer, 'remoteLocal', {
        type: 'dropDown',
        title: 'Remote/Local:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '3',
            options: [
                {label: 'Remote', value: '1'},
                {label: 'Local', value: '2'},
                {label: 'Remote/Local', value: '3'}
            ]
        }
    });
    createLabel(parentContainer, 'Operation');
    new ParamSetting(parentContainer, 'startStopStandby', {
        type: 'dropDown', title: 'Start/Stop/(Hot Standby):', ctrlInfo: 'Description...',
        dropDownConf: {
            val: '206',
            options: [
                {label: 'Standby', value: '205'},
                {label: 'Stop', value: '206'},
                {label: 'Start', value: '207'}
            ]
        }
    });
    createLabel(parentContainer, 'Operation mode');
    new ParamSetting(parentContainer, 'onOffGridMode', {
        type: 'dropDown', title: 'On/Off-grid mode setting:', ctrlInfo: 'Description...',
        dropDownConf: {
            val: '170',
            options: [
                {label: 'On-grid mode', value: '170'},
                {label: 'Off-grid mode', value: '85'},
                {label: 'VSG mode', value: '187'}
            ]
        }
    });
    createLabel(parentContainer, 'System work mode');
    new ParamSetting(parentContainer, 'onGridChargeDischargeMode', {
        type: 'dropDown', title: 'On-grid charge/discharge mode:', ctrlInfo: 'Description...',
        dropDownConf: {
            val: '1',
            options: [
                {label: 'On-grid constant current', value: '1'},
                {label: 'On-grid constant voltage', value: '2'},
                {label: 'On-grid constant power (AC)', value: '4'},
                {label: 'On-grid constant power (DC)', value: '8'}
            ]
        }
    });
    createLabel(parentContainer, 'Power soft start enabling');
    new ParamSetting(parentContainer, 'powerSoftStartEnabling', {
        type: 'dropDown', title: 'Power soft start enabling:', ctrlInfo: 'Description...',
        dropDownConf: {
            val: '0',
            options: [
                {label: 'Disabled', value: '0'},
                {label: 'Enabled', value: '1'}
            ]
        }
    });
    createLabel(parentContainer, 'On-grid constant values');
    new ParamSetting(parentContainer, 'onGridConstCurrentValue', {
        type: 'inputText', title: 'On-grid constant current value:', ctrlInfo: '(-1217~1217)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 0,
            length: 12,
            min: -1217,
            max: 1217
        },
        unit: 'A'
    });
    new ParamSetting(parentContainer, 'onGridConstVoltageValue', {
        type: 'inputText', title: 'On-grid constant voltage value:', ctrlInfo: '(580~1000)',
        inputTextConf: {
            val: 800,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 580,
            max: 1000
        },
        unit: 'V'
    });
    new ParamSetting(parentContainer, 'onGridConstVoltageLimitCurrent', {
        type: 'inputText', title: 'On-grid constant voltage limit current:', ctrlInfo: '0~1217)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 0,
            max: 1217
        },
        unit: 'A'
    });
    new ParamSetting(parentContainer, 'onGridConstPowerAC', {
        type: 'inputText', title: 'On-grid constant power (AC):', ctrlInfo: '(-110~110)',
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
    new ParamSetting(parentContainer, 'onGridConstPowerDC', {
        type: 'inputText', title: 'On-grid constant power (DC):', ctrlInfo: '(-110~110)',
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
}

function populateBatterySettings(parentContainer) {
    new ParamSetting(parentContainer, 'batChargSOCUpperLimit', {
        type: 'inputText', title: 'Battery charge SOC upper limit:', ctrlInfo: '(1~110)',
        inputTextConf: {
            val: 100,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 1,
            max: 100
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'batDischSOCLowerLimit', {
        type: 'inputText', title: 'Battery discharge SOC lower limit:', ctrlInfo: '(1~110)',
        inputTextConf: {
            val: 10,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 1,
            max: 100
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'maxBatChargVoltage', {
        type: 'inputText', title: 'Max. battery charge voltage:', ctrlInfo: '(580~1000)',
        inputTextConf: {
            val: 1000,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 1,
            max: 100
        },
        unit: 'V'
    });
    new ParamSetting(parentContainer, 'minBatDischVoltage', {
        type: 'inputText', title: 'Min. battery discharge voltage:', ctrlInfo: '(580~1000)',
        inputTextConf: {
            val: 580,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 1,
            max: 100
        },
        unit: 'V'
    });
    new ParamSetting(parentContainer, 'maxBatChargCurrent', {
        type: 'inputText', title: 'Max. battery charge current:', ctrlInfo: '(-1217~0)',
        inputTextConf: {
            val: -1217,
            type: 'number',
            decimals: 0,
            length: 12,
            min: -1217,
            max: 0
        },
        unit: 'A'
    });
    new ParamSetting(parentContainer, 'maxBatDischCurrent', {
        type: 'inputText', title: 'Max. battery discharge current:', ctrlInfo: '(0~1217)',
        inputTextConf: {
            val: 1217,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 0,
            max: 1217
        },
        unit: 'A'
    });
    new ParamSetting(parentContainer, 'batteryEnergyManagement', {
        type: 'dropDown', title: 'Battery energy management:', ctrlInfo: 'Description...',
        dropDownConf: {
            val: '0',
            options: [
                {label: 'Local management', value: '0'},
                {label: 'Remote management', value: '1'}
            ]
        }
    });
}

function populateGridSettings(parentContainer) {
    createLabel(parentContainer, 'Offgrid settings');
    new ParamSetting(parentContainer, 'independentConverterVoltage', {
        type: 'inputText', title: 'Independent converter voltage:', ctrlInfo: '(350~440)',
        inputTextConf: {
            val: 440,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 350,
            max: 440
        },
        unit: 'V'
    });
    new ParamSetting(parentContainer, 'independentConverterFrequency', {
        type: 'inputText', title: 'Independent converter frequency:', ctrlInfo: '(45~55)',
        inputTextConf: {
            val: 55,
            type: 'number',
            decimals: 2,
            length: 12,
            min: 45,
            max: 55
        },
        unit: 'Hz'
    });
    createLabel(parentContainer, 'Power factor correction settings');
    new ParamSetting(parentContainer, 'activePowerRisingSlope', {
        type: 'inputText', title: 'Active power rising slope:', ctrlInfo: '(0.5~2000)',
        inputTextConf: {
            val: 500,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0.5,
            max: 2000
        },
        unit: '%/s'
    });
    new ParamSetting(parentContainer, 'activePowerDroopSlope', {
        type: 'inputText', title: 'Active power droop slope:', ctrlInfo: '(0.5~2000)',
        inputTextConf: {
            val: 500,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0.5,
            max: 2000
        },
        unit: '%/s'
    });
    new ParamSetting(parentContainer, 'reactivePowerRisingSlope', {
        type: 'inputText', title: 'Reactive power rising slope:', ctrlInfo: '(0.5~2000)',
        inputTextConf: {
            val: 500,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0.5,
            max: 2000
        },
        unit: '%/s'
    });
    new ParamSetting(parentContainer, 'reactivePowerDroopSlope', {
        type: 'inputText', title: 'Reactive power droop slope:', ctrlInfo: '(0.5~2000)',
        inputTextConf: {
            val: 500,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0.5,
            max: 2000
        },
        unit: '%/s'
    });
    new ParamSetting(parentContainer, 'quVoltageRisingStartPoint', {
        type: 'inputText', title: 'QU voltage rising start point:', ctrlInfo: '(100~110)',
        inputTextConf: {
            val: 102,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 100,
            max: 110
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'quVoltageRisingEndPoint', {
        type: 'inputText', title: 'QU voltage rising end point:', ctrlInfo: '(100~110)',
        inputTextConf: {
            val: 104,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 100,
            max: 110
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'quVoltageDropStartPoint', {
        type: 'inputText', title: 'QU voltage drop start point:', ctrlInfo: '(90~100)',
        inputTextConf: {
            val: 98,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 100,
            max: 110
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'quVoltageDropEndPoint', {
        type: 'inputText', title: 'QU voltage drop end point:', ctrlInfo: '(90~100)',
        inputTextConf: {
            val: 96,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 100,
            max: 110
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'quWorkingMode', {
        type: 'dropDown', title: 'QU operation mode:', ctrlInfo: 'Description...',
        dropDownConf: {
            val: '162',
            options: [
                {label: 'Power factor mode', value: '161'},
                {label: 'Reactive power ratio mode', value: '162'}
            ]
        }
    });
    new ParamSetting(parentContainer, 'maxQUReactivePower', {
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
    new ParamSetting(parentContainer, 'maxQUPF', {
        type: 'inputText',
        title: 'Max. QU PF:',
        ctrlInfo: '(0.8~1)',
        inputTextConf: {
            val: 0.9,
            type: 'number',
            decimals: 3,
            length: 12,
            min: 0.8,
            max: 1
        },
        unit: ''
    });
    new ParamSetting(parentContainer, 'quEnablingPower', {
        type: 'inputText',
        title: 'QU enabling power:',
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
    new ParamSetting(parentContainer, 'stopDelayT', {
        type: 'inputText',
        title: 'Stop delay T:',
        ctrlInfo: '(0~600)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 0,
            max: 600
        },
        unit: 's'
    });
    new ParamSetting(parentContainer, 'stopSlopeL', {
        type: 'inputText',
        title: 'Stop delay L:',
        ctrlInfo: '(1~100)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 1,
            max: 100
        },
        unit: '%/s'
    });
    new ParamSetting(parentContainer, 'frequencyRideThroughEnable', {
        type: 'dropDown',
        title: 'Frequency ride through enabling:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '0',
            options: [
                {label: 'Disable', value: '0'},
                {label: 'Enable', value: '1'}
            ]
        }
    });
    new ParamSetting(parentContainer, 'frtCompensationFactor', {
        type: 'inputText',
        title: 'FRT compensation factor:',
        ctrlInfo: '(0~100)',
        inputTextConf: {
            val: 50,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0,
            max: 100
        },
        unit: ''
    });
    new ParamSetting(parentContainer, 'heartbeatTimeoutInterval', {
        type: 'inputText',
        title: 'Heartbeat timeout interval:',
        ctrlInfo: '(0~3600)',
        inputTextConf: {
            val: 50,
            type: 'number',
            decimals: 0,
            length: 12,
            min: 0,
            max: 3600
        },
        unit: 's'
    });
    new ParamSetting(parentContainer, 'reactivePowerPercentage', {
        type: 'inputText',
        title: 'Reactive power percentage setting:',
        ctrlInfo: '(-100~100)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12,
            min: -100,
            max: 100
        },
        unit: '%'
    });
    new ParamSetting(parentContainer, 'powerFactor', {
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
        unit: '%'
    });
    new ParamSetting(parentContainer, 'actualReactivePowerRegulationValue', {
        type: 'inputText',
        title: 'Actual reactive power regulation value:',
        ctrlInfo: '(-630~630)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12,
            min: -630,
            max: 630
        },
        unit: 'kvar'
    });
    new ParamSetting(parentContainer, 'actualActivePowerRegulationValue', {
        type: 'inputText',
        title: 'Actual active power regulation value:',
        ctrlInfo: '(-693~693)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12,
            min: -693,
            max: 693
        },
        unit: 'kW'
    });
    new ParamSetting(parentContainer, 'reactivePowerRegulationSwitch', {
        type: 'dropDown',
        title: 'Reactive power regulation switch:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '85',
            options: [
                {label: 'OFF, power factor returns to 1', value: '85'},
                {label: 'Power factor setting is enabled', value: '161'},
                {label: 'Reactive power percentage setting is enabled', value: '162'},
                {label: 'Reactive power operation Q(U) setting is enabled', value: '163'}
            ]
        }
    });
    new ParamSetting(parentContainer, 'activeReactivePriority', {
        type: 'dropDown',
        title: 'Active/Reactive priority:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '170',
            options: [
                {label: 'Active power priority', value: '170'},
                {label: 'Reactive power priority', value: '85'}
            ]
        }
    });
    new ParamSetting(parentContainer, 'vsgRatedOutputVoltage', {
        type: 'inputText',
        title: 'VSG rated output voltage:',
        ctrlInfo: '(360~440)',
        inputTextConf: {
            val: 400,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 360,
            max: 440
        },
        unit: 'V'
    });
    new ParamSetting(parentContainer, 'vsgRatedOutputFrequency', {
        type: 'inputText',
        title: 'VSG rated output frequency:',
        ctrlInfo: '(49~51)',
        inputTextConf: {
            val: 50,
            type: 'number',
            decimals: 2,
            length: 12,
            min: 49,
            max: 51
        },
        unit: 'V'
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
        unit: '%'
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
        unit: '%'
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
    new ParamSetting(cont, 'gridImpPowerType', {
        type: 'dropDown',
        title: 'Grid Import Power Type',
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
    new ParamSetting(cont, 'gridExpPowerType', {
        type: 'dropDown',
        title: 'Grid Export Power Type',
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
                    label: 'Battery Settings',
                    id: '2'
                },
                {
                    label: 'Grid Settings',
                    id: '3'
                },
                {
                    label: 'EMS Settings',
                    id: 'ems'
                },
                {
                    label: 'Power Data Record Settings',
                    id: 'pDataRecords'
                }

            ],
            multiple: true,
            selectedTab: '1',
            onInitComplete: function (el) {
                populateSystemSettings(el.getTabById('1').content);
                populateBatterySettings(el.getTabById('2').content);
                populateGridSettings(el.getTabById('3').content);
                populateEmsSettings(el.getTabById('ems').content);
                populatePowerDataRecSettigns(el.getTabById('pDataRecords').content);
            }
        });
    }
};

$(document).ready(function () {
    settings.init();
});
