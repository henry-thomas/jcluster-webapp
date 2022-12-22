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

/* global pm, sgsc */

function createLabel(parentContainer, text) {
    let label = document.createElement('SPAN');
    label.classList.add('dscSeparatorText');
    label.style.display = 'block';
    label.innerHTML = text;
    parentContainer.appendChild(label);
}

function onSettingsChange(comp, val) {
    if (!comp || !comp.paramName || val === undefined || val === null)
        return;

    val = val.toString();
    switch (comp.paramName) {
        case 'opMode':
        {
            switch (val) {
                case '0':
                    pm.elements['gridMode'].show();
                    pm.elements['offGridModActPasSetting'].hide();
                    pm.elements['offGridModSetting'].hide();
                    pm.elements['voltInIndependentInverterState'].hide();
                    pm.elements['freqInIndependentInverterState'].hide();
                    break;
                default:
                    pm.elements['gridMode'].hide();
                    pm.elements['offGridModActPasSetting'].show();
                    pm.elements['offGridModSetting'].show();
                    pm.elements['voltInIndependentInverterState'].show();
                    pm.elements['freqInIndependentInverterState'].show();
                    break;
            }
            break;
        }
        case 'gridMode':
        {
            switch (val) {
                case '0':
                    pm.elements['currentInConstCurrentMode'].show();
                    pm.elements['voltageInConstVoltageMode'].hide();
                    pm.elements['limitedCurrentInConstVoltageMode'].hide();
                    pm.elements['powerInConstPowerDCMode'].hide();
                    pm.elements['powerInConstPowerACMode'].hide();
                    break;
                case '1':
                    pm.elements['currentInConstCurrentMode'].hide();
                    pm.elements['voltageInConstVoltageMode'].show();
                    pm.elements['limitedCurrentInConstVoltageMode'].show();
                    pm.elements['powerInConstPowerDCMode'].hide();
                    pm.elements['powerInConstPowerACMode'].hide();
                    break;
                case '2':
                    pm.elements['currentInConstCurrentMode'].hide();
                    pm.elements['voltageInConstVoltageMode'].hide();
                    pm.elements['limitedCurrentInConstVoltageMode'].hide();
                    pm.elements['powerInConstPowerDCMode'].show();
                    pm.elements['powerInConstPowerACMode'].hide();
                    break;
                case '3':
                    pm.elements['currentInConstCurrentMode'].hide();
                    pm.elements['voltageInConstVoltageMode'].hide();
                    pm.elements['limitedCurrentInConstVoltageMode'].hide();
                    pm.elements['powerInConstPowerDCMode'].hide();
                    pm.elements['powerInConstPowerACMode'].show();
                    break;
                default:
                    pm.elements['currentInConstCurrentMode'].hide();
                    pm.elements['voltageInConstVoltageMode'].hide();
                    pm.elements['limitedCurrentInConstVoltageMode'].hide();
                    pm.elements['powerInConstPowerDCMode'].hide();
                    pm.elements['powerInConstPowerACMode'].hide();
                    break;
            }
            break;
        }
        case 'reactPowerAdjustment':
        {
            switch (val) {
                case '161':
                    pm.elements['powerFactor'].show();
                    pm.elements['reactivePower'].hide();
                    break;
                case '162':
                case '163':
                    pm.elements['powerFactor'].hide();
                    pm.elements['reactivePower'].show();
                    break;
                default:
                    pm.elements['powerFactor'].hide();
                    pm.elements['reactivePower'].hide();
                    break;
            }
            break;
        }
        case 'gridVoltDropAdjustment':
        {
            switch (val) {
                case '2':
                    pm.elements['seamlessMode'].show();
                    if (pm.elements['seamlessMode'].getValue() === '0') {
                        pm.elements['passiveSeamlessModCtrl'].show();
                    } else {
                        pm.elements['passiveSeamlessModCtrl'].hide();
                    }
                    break;

                default:
                    pm.elements['seamlessMode'].hide();
                    pm.elements['passiveSeamlessModCtrl'].hide();
                    break;
            }
            break;
        }
        case 'seamlessMode':
        {
            switch (val) {
                case '0':
                    if (pm.elements['gridVoltDropAdjustment'].getValue() === '2')
                        pm.elements['passiveSeamlessModCtrl'].show();
                    break;

                default:
                    pm.elements['passiveSeamlessModCtrl'].hide();
                    break;
            }
            break;
        }
    }
}

function populateSystemParameters(parentContainer) {
    createLabel(parentContainer, 'Time');
    new ParamSetting(parentContainer, 'systemTime', {
        type: 'inputText',
        title: 'System Time:',
        ctrlInfo: '(YYYY/MM/DD hh:mm)',
        inputTextConf: {
            type: 'datetime-local'
        }
    });
    pm.elements['systemTime'].inputText.input.style.maxWidth = "180px";

    createLabel(parentContainer, 'Instructions');
    new ParamSetting(parentContainer, 'factoryReset', {
        type: 'command',
        title: 'Reset:',
        onSaveSuccess: function (comp, val) {
            sgsc.reset();
        }
    });
}

function populateOperatingParameters(parentContainer) {
    createLabel(parentContainer, 'Working Mode');
    new ParamSetting(parentContainer, 'opMode', {
        type: 'dropDown',
        title: 'Working Mode:',
        ctrlInfo: 'Description...',
        onSaveSuccess: function (comp, val) {
            console.log('Success', comp, val);
        },
        onSaveFail: function (comp, val) {
            console.log('Fail', comp, val);
        },
        onChange: function (comp, val) {
            onSettingsChange(comp, val);
        },
        // Required for sending Extra data to the logger in the instruction
//        extraData: {
//            time: ...,
//            data: 'nwadsf'
//        },
        dropDownConf: {
            val: '0',
            options: [
                {label: 'Grid Mode', value: '0'},
                {label: 'Off-grid Mode', value: '1'}
            ]
        }
    });
    createLabel(parentContainer, 'Mode Select');
    new ParamSetting(parentContainer, 'gridMode', {
        type: 'dropDown',
        title: 'Grid Mode Settings:',
        ctrlInfo: 'Standby (SC1000TL:Reserved)',
        onChange: function (comp, val) {
            onSettingsChange(comp, val);
        },
        dropDownConf: {
            val: '0',
            options: [
                {label: 'CC mode', value: '0'},
                {label: 'CV mode', value: '1'},
                {label: 'CP mode (DC)', value: '2'},
                {label: 'CP mode (AC)', value: '3'},
                {label: 'Standby', value: '4'},
                {label: 'Stop', value: '5'}
            ]
        }
    });

    new ParamSetting(parentContainer, 'currentInConstCurrentMode', {
        type: 'inputText',
        title: 'Current in constant current mode:',
        ctrlInfo: '(-550~550)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12,
            min: -550,
            max: 550
        },
        unit: 'A'
    });

    new ParamSetting(parentContainer, 'voltageInConstVoltageMode', {
        type: 'inputText',
        title: 'Voltage in constant voltage mode:',
        ctrlInfo: '(500~830)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 500,
            max: 830
        },
        unit: 'V'
    });

    new ParamSetting(parentContainer, 'limitedCurrentInConstVoltageMode', {
        type: 'inputText',
        title: 'Limited current in constant voltage mode:',
        ctrlInfo: '(0~550)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 0,
            max: 550
        },
        unit: 'A'
    });

    new ParamSetting(parentContainer, 'powerInConstPowerDCMode', {
        type: 'inputText',
        title: 'Power in constant power (DC) mode:',
        ctrlInfo: '(-275~275)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12,
            min: -275,
            max: 275
        },
        unit: 'kW'
    });

    new ParamSetting(parentContainer, 'powerInConstPowerACMode', {
        type: 'inputText',
        title: 'Power in constant power (AC) mode:',
        ctrlInfo: '(-275~275)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12,
            min: -275,
            max: 275
        },
        unit: 'kW'
    });

    new ParamSetting(parentContainer, 'offGridModActPasSetting', {
        type: 'dropDown',
        title: 'Off-grid Mode active/passive:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '0',
            options: [
                {label: 'Active', value: '0'},
                {label: 'Pasive', value: '1'}
            ]
        }
    });

    new ParamSetting(parentContainer, 'offGridModSetting', {
        type: 'dropDown',
        title: 'Off-grid Mode Settings:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '0',
            options: [
                {label: 'Stop', value: '0'},
                {label: 'Start', value: '1'}
            ]
        }
    });

    new ParamSetting(parentContainer, 'voltInIndependentInverterState', {
        type: 'inputText',
        title: 'Voltage in independent inverter state:',
        ctrlInfo: '(370~410)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 370,
            max: 410
        },
        unit: 'V'
    });

    new ParamSetting(parentContainer, 'freqInIndependentInverterState', {
        type: 'inputText',
        title: 'Frequency in independent inverter state:',
        ctrlInfo: '(49.5~50.5)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12,
            min: 49.5,
            max: 50.5
        },
        unit: 'Hz'
    });

    createLabel(parentContainer, 'Reactive power adjustment');
    new ParamSetting(parentContainer, 'reactPowerAdjustment', {
        type: 'dropDown',
        title: 'Reactive power adjustment:',
        ctrlInfo: 'Description...',
        onChange: function (comp, val) {
            onSettingsChange(comp, val);
        },
        dropDownConf: {
            val: '85',
            options: [
                {label: 'Off', value: '85'}, // 0x55
                {label: 'Power factor', value: '161'}, // 0xA1
                {label: 'Reactive power ratio', value: '162'}, // 0xA2
                {label: 'Reactive power', value: '163'}         // 0xA3
            ]
        }
    });

    new ParamSetting(parentContainer, 'powerFactor', {
        type: 'inputText',
        title: 'Power factor:',
        ctrlInfo: '(-1~-0.9,0.9~1)',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 3,
            length: 12,
            min: -1,
            max: 1
        },
        unit: 'Hz'
    });

    new ParamSetting(parentContainer, 'reactivePower', {
        type: 'inputText',
        title: 'Reactive power:',
        ctrlInfo: 'Description...',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12
        },
        unit: 'kVar'
    });

    createLabel(parentContainer, 'Battery Adjustment');
    new ParamSetting(parentContainer, 'batChargCurrentLimit', {
        type: 'inputText',
        title: 'Battery charge current limit:',
        ctrlInfo: 'Description...',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12
        },
        unit: 'A'
    });
    new ParamSetting(parentContainer, 'batDischCurrentLimit', {
        type: 'inputText',
        title: 'Battery discharge current limit:',
        ctrlInfo: 'Description...',
        inputTextConf: {
            val: 0,
            type: 'number',
            decimals: 1,
            length: 12
        },
        unit: 'A'
    });

    createLabel(parentContainer, 'Voltage Grid Drop Regulation');
    new ParamSetting(parentContainer, 'gridVoltDropAdjustment', {
        type: 'dropDown',
        title: 'Grid voltage drop adjustment:',
        ctrlInfo: 'Island (default)',
        onChange: function (comp, val) {
            onSettingsChange(comp, val);
        },
        dropDownConf: {
            val: '0',
            options: [
                {label: 'Island', value: '0'},
                {label: 'LVRT', value: '1'},
                {label: 'Seamless switch mode', value: '2'}
            ]
        }
    });
    new ParamSetting(parentContainer, 'seamlessMode', {
        type: 'dropDown',
        title: 'Seamless mode:',
        ctrlInfo: 'Description...',
        onChange: function (comp, val) {
            onSettingsChange(comp, val);
        },
        dropDownConf: {
            val: '0',
            options: [
                {label: 'Pasive', value: '0'},
                {label: 'Active', value: '1'}
            ]
        }
    });
    new ParamSetting(parentContainer, 'passiveSeamlessModCtrl', {
        type: 'dropDown',
        title: 'Passive seamless mode control:',
        ctrlInfo: 'Description...',
        dropDownConf: {
            val: '0',
            options: [
                {label: 'Grid mode to Island mode', value: '0'},
                {label: 'Island mode to Grid mode', value: '1'}
            ]
        }
    });
    createLabel(parentContainer, 'Master And Slave');
    new ParamSetting(parentContainer, 'masterSlave', {
        type: 'dropDown',
        title: 'Master And Slave:',
        ctrlInfo: 'SC1000TL: Reserved',
        dropDownConf: {
            val: '0',
            options: [
                {label: 'Master', value: '0'},
                {label: 'Slave', value: '1'}
            ]
        }
    });
    createLabel(parentContainer, 'Parallel mode');
    new ParamSetting(parentContainer, 'parallelMode', {
        type: 'dropDown',
        title: 'Parallel mode:',
        ctrlInfo: 'SC1000TL: Reserved',
        dropDownConf: {
            val: '0',
            options: [
                {label: 'DC parallel off', value: '0'},
                {label: 'DC parallel on', value: '1'}
            ]
        }
    });
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
                    label: 'System Parameters',
                    id: '1'
                },
                {
                    label: 'Operating Parameters',
                    id: '2'
                },
                {
                    label: 'Power Data Record Settings',
                    id: 'pDataRecords'
                }
            ],
            multiple: true,
            selectedTab: '1',
            onInitComplete: function (el) {
                populateSystemParameters(el.getTabById('1').content);
                populateOperatingParameters(el.getTabById('2').content);
                populatePowerDataRecSettigns(el.getTabById('pDataRecords').content);
            }
        });
    }
};

$(document).ready(function () {
    settings.init();
});
