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

/* global paramDesc, pm */

(function (root) {
    function SsgtParam() {
        console.group();
        initTbpfSettings.call(this);
        initSsgtSettings.call(this);
    }

    let prot = SsgtParam.prototype;

    prot.onParamRec = function (dev, param) {
        let setPanel = document.querySelector('.ssgtSetTab');

        for (var p in param) {
            new ParamSetting(this.setPanel, p, {
                type: 'inputNumber',
                title: p,
                ctrlInfo: ""});
        }
    };

    function initSsgtSettings() {
        this.setPanel = document.querySelector('.ssgtSetTab');

        this.setPanelAcc = new SMDUIAccordianPanel(this.setPanel, {
            tabs: [
                {
                    label: 'Inverter Settings'
                },
                {
                    label: 'Battery Setup'
                },
                {
                    label: 'Grid Setup'
                },
                {
                    label: 'Auxiliary Setup'
                }
            ],
            selectedTab: 0
        });
        let batTab = this.setPanelAcc.getTabContent(1);

        new ParamSetting(batTab, 'batType', {
            title: 'Battery Type',
            type: 'dropDown',
            ctrlInfo: "",
            dropDownConf: {
                options: [
                    {label: 'Lead acid', value: '0'},
                    {label: 'Li-ion', value: '1'}
                ]
            }});

        new ParamSetting(batTab, 'batEqualizationVoltage', {
            type: 'inputNumber',
            title: 'Bat Equalization Voltage',
            unit: 'V',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'batAbsorptionVoltage', {
            type: 'inputNumber',
            title: 'Bat Absorption Voltage',
            unit: 'V',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'batFloatVoltage', {
            type: 'inputNumber',
            title: 'Bat Float Voltage',
            unit: 'V',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'batRatedCapacity', {
            type: 'inputNumber',
            title: 'Bat Rated Capacity',
            unit: 'V',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'batEqualizationDelay', {
            type: 'inputNumber',
            title: 'Bat Equalization Delay',
            unit: 'Days',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'batEqualizationTime', {
            type: 'inputNumber',
            title: 'Bat Equalization Time',
            unit: 'Hours',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'batTempCompensation', {
            type: 'inputNumber',
            title: 'Bat Temp Compensation',
            unit: '\xB0C',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'batMaxChrgCurrent', {
            type: 'inputNumber',
            title: 'Bat Max Charge Current',
            unit: 'A',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'batMaxDischrgCurrent', {
            type: 'inputNumber',
            title: 'Bat Max Discharge Current',
            unit: 'A',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'batOperMode', {
            title: 'Battery Operation Mode',
            type: 'dropDown',
            ctrlInfo: "",
            dropDownConf: {
                options: [
                    {label: 'Voltage', value: '0'},
                    {label: 'Capacity', value: '1'},
                    {label: 'No Battery', value: '2'}
                ]
            }});

        new ParamSetting(batTab, 'batLitWwakeUp', {
            title: 'batLitWakeUp',
            type: 'dropDown',
            ctrlInfo: "",
            dropDownConf: {
                options: [
                    {label: 'Enable', value: '0'},
                    {label: 'Disable', value: '1'}
                ]
            }});

        new ParamSetting(batTab, 'batInRes', {
            type: 'inputNumber',
            title: 'Bat Internal Resistance',
            unit: '\u2126',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'batChgEffi', {
            type: 'inputNumber',
            title: 'Bat Charging Efficiency',
            unit: '%',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'batCapShutdown', {
            type: 'inputNumber',
            title: 'Bat Shutdown Capacity',
            unit: '%',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'batCapReset', {
            type: 'inputNumber',
            title: 'Bat Reset Capacity',
            unit: '%',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'batCapLow', {
            type: 'inputNumber',
            title: 'Bat Low Capacity',
            unit: '%',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'batVoltShutdown', {
            type: 'inputNumber',
            title: 'Bat Shutdown Voltage',
            unit: 'V',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'batVoltRestart', {
            type: 'inputNumber',
            title: 'Bat Restart Voltage',
            unit: 'V',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'batVoltLowBat', {
            type: 'inputNumber',
            title: 'Bat Low Voltage',
            unit: 'V',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'genBatChgEnable', {
            type: 'switch',
            title: 'Gen Bat Charge Enable',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'gridBatChgEnable', {
            type: 'switch',
            title: 'Grid Bat Charge Enable',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'genMaxOpTime', {
            type: 'inputNumber',
            title: 'Generator Max Operation Time',
            unit: 'Hours',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'genCoolTime', {
            type: 'inputNumber',
            title: 'Generator Cooling Time',
            unit: 'Hours',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'genStartBatVoltage', {
            type: 'inputNumber',
            title: 'Gen Start Bat Voltage',
            unit: 'V',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'genStartBatCap', {
            type: 'inputNumber',
            title: 'Gen Start Bat Capacity',
            unit: '%',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'genBatChrgCurrent', {
            type: 'inputNumber',
            title: 'Gen Bat Charge Current',
            unit: 'A',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'genBatChrgVoltage', {
            type: 'inputNumber',
            title: 'Gen Bat Charge Voltage',
            unit: 'V',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'gridChrgStartCap', {
            type: 'inputNumber',
            title: 'Grid Charge Start Capacity',
            unit: '%',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'gridChrgCurrent', {
            type: 'inputNumber',
            title: 'Grid Bat Charge Current',
            unit: 'A',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'gridBatChgStartVoltage', {
            type: 'inputNumber',
            title: 'Grid Bat Charge Start Voltage',
            unit: 'V',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'gridBatChgStartCap', {
            type: 'inputNumber',
            title: 'Grid Bat Charge Start Capacity',
            unit: '%',
            ctrlInfo: ""});

        new ParamSetting(batTab, 'genGridSignalOn', {
            type: 'inputNumber',
            title: 'Gen Grid Signal On',
            ctrlInfo: ""});


        /*
         * 
         * Grid Settings
         * 
         */
        let gridTab = this.setPanelAcc.getTabContent(2);

        new ParamSetting(gridTab, 'gridUpperRatedVoltageV', {
            type: 'inputNumber',
            title: 'Grid Upper Rated Voltage',
            unit: 'V',
            ctrlInfo: ""});

        new ParamSetting(gridTab, 'gridLowerRatedVoltageV', {
            type: 'inputNumber',
            title: 'Grid Lower Rated Voltage',
            unit: 'V',
            ctrlInfo: ""});

        new ParamSetting(gridTab, 'gridUpperLimitFrequencyHz', {
            type: 'inputNumber',
            title: 'Grid Upper Limit Frequency',
            unit: 'Hz',
            ctrlInfo: ""});

        new ParamSetting(gridTab, 'gridLowerLimitFrequencyHz', {
            type: 'inputNumber',
            title: 'Grid Lower Limit Frequency',
            unit: 'Hz',
            ctrlInfo: ""});

        new ParamSetting(gridTab, 'gridUpperLimitCurrentA', {
            type: 'inputNumber',
            title: 'Grid Lower Limit Current',
            unit: 'A',
            ctrlInfo: ""});

        new ParamSetting(gridTab, 'gridUpperLimitVoltageV', {
            type: 'inputNumber',
            title: 'Grid Upper Limit Voltage',
            unit: 'V',
            ctrlInfo: ""});

        new ParamSetting(gridTab, 'gridLowerLimitVoltageV', {
            type: 'inputNumber',
            title: 'Grid Lower Limit Voltage',
            unit: 'V',
            ctrlInfo: ""});


        new ParamSetting(gridTab, 'powerFactorRegulation', {
            type: 'inputNumber',
            title: 'Power Factor Regulation',
            unit: '',
            ctrlInfo: ""});

        new ParamSetting(gridTab, 'activePowerRegulationPercentP', {
            type: 'inputNumber',
            title: 'Active Power Regulation',
            unit: '%',
            ctrlInfo: ""});

        new ParamSetting(gridTab, 'reactivePowerRegulationPercentP', {
            type: 'inputNumber',
            title: 'Reactive Power Regulation',
            unit: '%',
            ctrlInfo: ""});

        new ParamSetting(gridTab, 'apparentPowerRegulationPercentP', {
            type: 'inputNumber',
            title: 'Apparent Power Regulation',
            unit: '%',
            ctrlInfo: ""});

        new ParamSetting(gridTab, 'antiIslandProt', {
            type: 'switch',
            title: 'Anti Islanding Protection',
            ctrlInfo: ""});

        new ParamSetting(gridTab, 'gridProtVoltHigh', {
            type: 'inputNumber',
            title: 'Grid Protection Voltage High',
            unit: 'V',
            ctrlInfo: ""});

        new ParamSetting(gridTab, 'gridProtVoltLow', {
            type: 'inputNumber',
            title: 'Grid Protection Voltage Low',
            unit: 'V',
            ctrlInfo: ""});

        new ParamSetting(gridTab, 'gridProtFreqHigh', {
            type: 'inputNumber',
            title: 'Grid Protection Frequency Voltage High',
            unit: 'Hz',
            ctrlInfo: ""});

        new ParamSetting(gridTab, 'gridProtFreqLow', {
            type: 'inputNumber',
            title: 'Grid Protection Frequency Voltage Low',
            unit: 'Hz',
            ctrlInfo: ""});

        new ParamSetting(gridTab, 'gridCountryStd', {
            title: 'Grid Country Standard',
            type: 'dropDown',
            ctrlInfo: "",
            dropDownConf: {
                options: [
                    {label: 'China', value: '1'},
                    {label: 'Brazil', value: '2'},
                    {label: 'India', value: '3'},
                    {label: 'EN50438', value: '4'},
                    {label: 'Other', value: '5'}
                ]
            }});

        new ParamSetting(gridTab, 'gridFrequency', {
            title: 'Grid Frequency',
            type: 'dropDown',
            ctrlInfo: "",
            dropDownConf: {
                options: [
                    {label: '50Hz', value: '0'},
                    {label: '60Hz', value: '1'}
                ]
            }});

        new ParamSetting(gridTab, 'gridType', {
            title: 'Grid Type',
            type: 'dropDown',
            ctrlInfo: "Not valid for 3phase inverter",
            dropDownConf: {
                options: [
                    {label: 'Single-phase 220V', value: '0'},
                    {label: 'Two-phase 120V/240V', value: '1'},
                    {label: 'Three-phase 208V 120 degrees', value: '2'},
                    {label: '120V Single Phase', value: '3'}
                ]
            }});


        new ParamSetting(gridTab, 'gridPeakShaving', {
            type: 'inputNumber',
            title: 'Grid Peak Shaving',
            unit: 'W',
            ctrlInfo: ""});

        new ParamSetting(gridTab, 'gridExpMaxPower', {
            type: 'inputNumber',
            title: 'Grid Export Max Power',
            unit: 'W',
            ctrlInfo: ""});

        /*
         * 
         * Auxiliary settings
         * 
         * 
         */

        let auxTab = this.setPanelAcc.getTabContent(3);
        new ParamSetting(auxTab, 'genOnGridInput', {
            type: 'switch',
            title: 'Gen On Grid Input',
            ctrlInfo: ""});

        new ParamSetting(auxTab, 'genPeakShaving', {
            type: 'inputNumber',
            title: 'Gen Peak Shaving',
            unit: 'W',
            ctrlInfo: ""});

        new ParamSetting(auxTab, 'auxPortCtrl', {
            title: 'Aux/Gen Port Function',
            type: 'dropDown',
            ctrlInfo: "",
            dropDownConf: {
                options: [
                    {label: 'Generator', value: '0'},
                    {label: 'Smart Load Output', value: '1'},
                    {label: 'Inverter Input', value: '1'}
                ]
            }});


        new ParamSetting(auxTab, 'auxLoadOffBatVoltageV', {
            type: 'inputNumber',
            title: 'Aux Load Off Bat Voltage',
            unit: 'V',
            ctrlInfo: ""});

        new ParamSetting(auxTab, 'auxPortOffBatCapacity', {
            type: 'inputNumber',
            title: 'Aux Load Off Bat Capacity',
            unit: '%',
            ctrlInfo: ""});

        new ParamSetting(auxTab, 'auxPortOnBatVoltage', {
            type: 'inputNumber',
            title: 'Aux Port On Bat Voltage',
            unit: 'V',
            ctrlInfo: ""});

        new ParamSetting(auxTab, 'auxPortOnBatCapacity', {
            type: 'inputNumber',
            title: 'Aux Port On Bat Capacity',
            unit: '%',
            ctrlInfo: ""});


        let setTab = this.setPanelAcc.getTabContent(0);

        new ParamSetting(setTab, 'loadOutputPFValue', {
            type: 'inputNumber',
            title: 'Load Output PF Value',
            unit: '',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'smartLoadOpenDelay', {
            type: 'inputNumber',
            title: 'Smart Load Open Delay',
            unit: 's',
            ctrlInfo: ""});


        new ParamSetting(setTab, 'maxTemperatureDegC', {
            type: 'inputNumber',
            title: 'Max Temperature',
            unit: '\xB0C',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'unitDebug', {
            type: 'switch',
            title: 'Debug Mode',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'useBatteryPower', {
            type: 'switch',
            title: 'Allow Battery Power Recording',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'screenLock', {
            title: 'Lock Screen',
            type: 'dropDown',
            ctrlInfo: "",
            dropDownConf: {
                options: [
                    {label: 'Lock', value: '0'},
                    {label: 'Unlock', value: '2'}
                ]
            }});

        new ParamSetting(setTab, 'inverterState', {
            type: 'inputNumber',
            title: 'Inverter State',
            unit: '',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'limiterEnabled', {
            type: 'switch',
            title: 'Limiter Enabled',
            ctrlInfo: ""});



        new ParamSetting(setTab, 'solarInputAsPsu', {
            type: 'switch',
            title: 'solarInputAsPsu',
            unit: '',
            ctrlInfo: ""});




        new ParamSetting(setTab, 'energyPriority', {
            title: 'Energy Management Mode',
            type: 'dropDown',
            ctrlInfo: "",
            dropDownConf: {
                options: [
                    {label: 'Battery Priority', value: '0'},
                    {label: 'Load Priority', value: '1'}
                ]
            }});

        new ParamSetting(setTab, 'limitControl', {
            title: 'Limit Control',
            type: 'dropDown',
            ctrlInfo: "",
            dropDownConf: {
                options: [
                    {label: 'Sell Electricity Enabled', value: '0'},
                    {label: 'Built-in Enabled', value: '1'},
                    {label: 'External Extraposition Enabled', value: '2'}
                ]
            }});



        new ParamSetting(setTab, 'extSensorDir', {
            type: 'inputNumber',
            title: 'External Sensor Direction',
            unit: '',
            ctrlInfo: ""});


        new ParamSetting(setTab, 'gfdiEnable', {
            type: 'switch',
            title: 'GFDI Enable',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'lowVoltageAccrossEnable', {
            type: 'switch',
            title: 'Low Voltage Accross Enable',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'enableMcuEeprom', {
            type: 'switch',
            title: 'Enable Mcu Eeprom',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'enableComEeprom', {
            type: 'switch',
            title: 'Enable Com Eeprom',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'powerWhFactor', {
            type: 'inputNumber',
            title: 'powerWh Factor',
            ctrlInfo: ""});


        new ParamSetting(setTab, 'forceGenAsLoad', {
            type: 'switch',
            title: 'Force Gen As Load',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'minPvPowerForGenStart', {
            type: 'inputNumber',
            title: 'Min Pv Power for Gen Start',
            unit: 'W',
            ctrlInfo: ""});


        new ParamSetting(setTab, 'gridPhase', {
            type: 'inputNumber',
            title: 'Grid Phase',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'microInvExpToGridCutoff', {
            type: 'inputNumber',
            title: 'Micro Inv Exp to Grid Cutoff',
            unit: 'W',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'controlBoardFunction', {
            type: 'inputNumber',
            title: 'Control Board Function',
            unit: '',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'connectionRestoreTime', {
            type: 'inputNumber',
            title: 'Connection Restore Time',
            unit: 's',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'solarArcFaultMode', {
            type: 'switch',
            title: 'Solar Arc Fault Mode',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'externalRalayBit', {
            type: 'inputNumber',
            title: 'External Ralay Bit',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'upsDelayTime', {
            type: 'inputNumber',
            title: 'UPS Delay Time',
            unit: 's',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'chargingVoltage', {
            type: 'inputNumber',
            title: 'Charging Voltage',
            unit: 'V',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'chargeCurrentLimit', {
            type: 'inputNumber',
            title: 'Charge Current Limit',
            unit: 'A',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'dischargeCurrentLimit', {
            type: 'inputNumber',
            title: 'Discharge Current Limit',
            unit: 'A',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'realTimeCapacity', {
            type: 'inputNumber',
            title: 'Real Time Capacity',
            unit: '%',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'realTimeVoltage', {
            type: 'inputNumber',
            title: 'Real Time Voltage',
            unit: 'V',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'realTimeCurrent', {
            type: 'inputNumber',
            title: 'Real Time Current',
            unit: 'A',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'realTimeTemp', {
            type: 'inputNumber',
            title: 'Real Time Temp',
            unit: '\xB0C',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'maxChargeCurrentLimit', {
            type: 'inputNumber',
            title: 'Max Charge Current Limit',
            unit: 'A',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'maxDischargeCurrentLimit', {
            type: 'inputNumber',
            title: 'Max Discharge Current Limit',
            unit: 'A',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'liBatTypeProtocol', {
            type: 'inputNumber',
            title: 'Li-ion Bat Type Protocol',
            unit: '',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'liBatSOH', {
            type: 'inputNumber',
            title: 'Li-ion Bat SOH',
            unit: '',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'maxPvSell', {
            type: 'inputNumber',
            title: 'Max PV Export',
            unit: 'W',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'ctRatio', {
            type: 'inputNumber',
            title: 'CT Ratio',
            unit: '',
            ctrlInfo: ""});

        new ParamSetting(setTab, 'meterCtRatio', {
            type: 'inputNumber',
            title: 'Meter CT Ratio',
            unit: '',
            ctrlInfo: ""});

        this.datRecSetPanel = document.querySelector('.ssgtDatRecSetTab');

        this.datrecSetPanelAcc = new SMDUIAccordianPanel(this.datRecSetPanel, {
            tabs: [
                {
                    label: 'Power Records Setup'
                }
            ],
            selectedTab: 0
        });

        let powerTypeTab = this.datrecSetPanelAcc.getTabContent(0);

        new ParamSetting(powerTypeTab, 'gridExpPowerType', {
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
        new ParamSetting(powerTypeTab, 'gridImpPowerType', {
            type: 'dropDown',
            title: 'Grid import Power Type',
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
        new ParamSetting(powerTypeTab, 'genPowerType', {
            type: 'dropDown',
            title: 'Gen Power Type',
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
        new ParamSetting(powerTypeTab, 'auxLoadPowerType', {
            type: 'dropDown',
            title: 'Aux Load Power Type',
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
        new ParamSetting(powerTypeTab, 'loadExpPowerType', {
            type: 'dropDown',
            title: 'Load Power Type',
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
        new ParamSetting(powerTypeTab, 'batChgPowerType', {
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
        new ParamSetting(powerTypeTab, 'batDischgPowerType', {
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
        new ParamSetting(powerTypeTab, 'pv1PowerType', {
            type: 'dropDown',
            title: 'PV1 Power Type',
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
        new ParamSetting(powerTypeTab, 'pv2PowerType', {
            type: 'dropDown',
            title: 'PV2 Power Type',
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

    function initTbpfSettings() {
        this.tbpfSetPanel = document.querySelector('.timeBasedControlSettings');

        this.tbpfSetAcc = new SMDUIAccordianPanel(this.tbpfSetPanel, {
            tabs: [
                {
                    label: 'Operational Settings'
                },
                {
                    label: 'System Control'
                }
            ],
            selectedTab: 0
        });

        let opSetTab = this.tbpfSetAcc.getTabContent(0);

        new ParamSetting(opSetTab, 'timeBasePeakFilling', {
            type: 'switch',
            title: 'Enable Time Based Usage',
            ctrlInfo: "When enabled, the time-based settings below will be in effect"});

        new ParamSetting(opSetTab, 'timeBasePeakFillingMon', {
            type: 'switch',
            title: 'Monday',
            ctrlInfo: ""});

        new ParamSetting(opSetTab, 'timeBasePeakFillingTue', {
            type: 'switch',
            title: 'Tuesday',
            ctrlInfo: ""});

        new ParamSetting(opSetTab, 'timeBasePeakFillingWed', {
            type: 'switch',
            title: 'Wednesday',
            ctrlInfo: ""});

        new ParamSetting(opSetTab, 'timeBasePeakFillingThu', {
            type: 'switch',
            title: 'Thursday',
            ctrlInfo: ""});

        new ParamSetting(opSetTab, 'timeBasePeakFillingFri', {
            type: 'switch',
            title: 'Friday',
            ctrlInfo: ""});

        new ParamSetting(opSetTab, 'timeBasePeakFillingSat', {
            type: 'switch',
            title: 'Saturday',
            ctrlInfo: ""});

        new ParamSetting(opSetTab, 'timeBasePeakFillingSun', {
            type: 'switch',
            title: 'Sunday',
            ctrlInfo: ""});

        new ParamSetting(opSetTab, 'timeBasePeakFillingOpMod', {
            type: 'switch',
            title: 'Operational Mode',
            ctrlInfo: "?"});

        let genTab = this.tbpfSetAcc.getTabContent(1);


        new ParamSetting(genTab, 'energyPriority', {
            type: 'dropDown',
            title: 'PV Power Priority',
            ctrlInfo: "Priority of PV Power usage",
            dropDownConf: {
                options: [
                    {label: 'Battery', value: '0'},
                    {label: 'Load', value: '1'}
                ]
            }
        });

        new ParamSetting(genTab, 'limitControl', {
            type: 'dropDown',
            title: 'Limit Control',
            ctrlInfo: "Export Setting",
            dropDownConf: {
                options: [
                    {label: 'Export Enabled', value: '0'},
                    {label: 'Built-in Enabled', value: '1'},
                    {label: 'External Enabled', value: '2'}
                ]
            }
        });

        new ParamSetting(genTab, 'zeroExportPower', {
            type: 'inputNumber',
            title: 'Zero Export Power',
            ctrlInfo: "Small amount of power to be imported, set baseline for 0 export"});

        new ParamSetting(genTab, 'pvSell', {
            type: 'switch',
            title: 'Solar Export',
            ctrlInfo: "Allow export of PV power to grid when battery is full"});

        new ParamSetting(genTab, 'solarInputAsPsu', {
            type: 'switch',
            title: 'Limit to Load Only',
            ctrlInfo: "Limit PV power to load only"});

        new ParamSetting(genTab, 'gridExpMaxPower', {
            type: 'inputNumber',
            title: 'Max Export Power',
            ctrlInfo: "Max power to be exported to the grid at any time"});


        let timePointTabs = [
            {
                label: 'Time Point 1'
            },
            {
                label: 'Time Point 2'
            },
            {
                label: 'Time Point 3'
            },
            {
                label: 'Time Point 4'
            },
            {
                label: 'Time Point 5'
            },
            {
                label: 'Time Point 6'
            }
        ];



        for (let i = 1; i <= timePointTabs.length; i++) {
            let panel = this.tbpfSetAcc.addTab({label: timePointTabs[i - 1].label});

            new ParamSetting(panel, 'tbpfExpTimePoint' + i + 'Time', {type: 'inputNumber', title: 'Time Point', ctrlInfo: "Point in time. 2359 is 23:59 [0-2359]"});
            new ParamSetting(panel, 'tbpfExpTimePoint' + i + 'PowerW', {type: 'inputNumber', title: 'Power Target', ctrlInfo: "Set Power [0-8000]", unit: 'W'});
            new ParamSetting(panel, 'tbpfExpTimePoint' + i + 'BatVoltageV', {type: 'inputNumber', title: 'Bat Voltage', ctrlInfo: "Set Bat Voltage [0-63]", unit: 'V'});
            new ParamSetting(panel, 'tbpfTimePoint' + i + 'BatCap', {type: 'inputNumber', title: 'Battery Capacity %', ctrlInfo: "Set Bat Capacity when battery will stop discharging[0-100]%", unit: '%'});
            new ParamSetting(panel, 'tbpfTimePoint' + i + 'ChargeEnable', {
                type: 'dropDown',
                title: 'Charging Selection',
                ctrlInfo: "Battery will charge with selected source. If NONE is selected, battery will discharge to target SOC.",
                dropDownConf: {
                    options: [
                        {label: 'None', value: '0'},
                        {label: 'Grid Enable', value: '1'},
                        {label: 'Generator Enable', value: '2'}
                    ]
                }
            });
        }


    }

    $(document).ready(function () {
        root.ssgtParam = new SsgtParam();
        pm.loadParamDesc(paramDesc);
        console.groupEnd();
    });

})(window);
