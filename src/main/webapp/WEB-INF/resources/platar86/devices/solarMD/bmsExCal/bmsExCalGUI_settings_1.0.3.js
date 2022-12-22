/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, hh, bmsexDM, socEMeter, ipUtils, wsm, mu, dm, socEMeterDataMap, bcProd, bcGui */

bcGui.isAdvancedUser = true;

bcGui.initHtmlSettingsPanel = function () {
    bcGui.comp.mainTabPanel.addItem({label: "General Settings", id: 'settings'});

    let container = hh.div(bcGui.comp.mainTabPanel.getItemContentById('settings'));
    bcGui.comp.mainTabPanel.setPanel = container;
//    new ParamSetting(container, {
//        type: 'dropDownButton',
//        title: 'Reset Flags:',
//        ctrlInfo: 'Restore the PROD_ENV flags back to original values. This is required to run the calibration process again.',
//        content: [
//            {name: 'Reset', cb: function () {
//                    wsm.sendDevMsgExecWithJsonInst({instrExt: "prodEnvClearFlags",
//                        showMessage: true
//                    });
//                }}
//        ]
//    });

    new ParamSetting(container, {
        type: 'dropDownButton',
        title: 'Test BMS Current:',
        ctrlInfo: 'Activate override on both relays.',
        content: [
            {name: 'Reset', cb: function () {
                    wsm.sendDevMsgExecWithJsonInst({instrExt: "activateOverrideTest",
                        showMessage: true
                    });
                }}
        ],
        extraData: {delay: 10}
    });

    new ParamSetting(container, 'minFwVer', {
        title: 'Min FW Version',
        type: 'inputNumber'
    });

    new ParamSetting(container, 'setCalInaShuntResistance', {
        title: 'ina shunt resistance',
        type: 'inputNumber',
        detached: true
    });

    new ParamSetting(container, 'allowParamWite', {
        title: 'Allow Param Write',
        type: 'switch',
    });

    new ParamSetting(container, 'allowVoltageCal', {
        title: 'Allow Voltage Calibration',
        type: 'switch',
    });

    new ParamSetting(container, 'allowBalancingTempTest', {
        title: 'Allow Temperature Test',
        type: 'switch',
    });

    new ParamSetting(container, 'allowBalancingTest', {
        title: 'Allow Balancing Test',
        type: 'switch',
    });

    new ParamSetting(container, 'allowRelayCurrTest', {
        title: 'Allow Relay and Current Test',
        type: 'switch',
    });

    new ParamSetting(container, 'allowCanTest', {
        title: 'Allow CAN Bus Test',
        type: 'switch',
    });

//    let acordPanel = bcGui.comp.settingsAccordionPanel = new SMDUIAccordianPanel(container, {tabs: [
//            {label: 'Basic', id: 'basic'},
//            {label: 'Balancing Test', id: 'balTest'},
//            {label: 'Balancing Temperature Test', id: 'balTestTemp'}
//        ], selectedTab: 'basic'});
//
//    let cont = bcGui.comp.settingTabPannelBasic = acordPanel.getTabContentById('basic');
//    new ParamSetting(cont, 'testCurrSesnseMaxIdleCurr', {type: 'inputNumber', title: 'Current Sense Max Idle Current:', ctrlInfo: 'Max current before testing starts'});
//    new ParamSetting(cont, 'testCurrSesnseMaxCurrDiff', {type: 'inputNumber', title: 'Current Sense Max Diff Current:', ctrlInfo: 'Max current difference. Will settle below this value before completing, otherwise will timeout if this value is not achieved.'});
//    new ParamSetting(cont, 'minTestCurrent_mA', {type: 'inputNumber', title: 'Min Test Current:', ctrlInfo: '', unit: 'mA'});
//    new ParamSetting(cont, 'enableBalTempTest', {type: 'switch', title: 'Enable Balancing Temperature Test:', ctrlInfo: ''});
//
//    new ParamSetting(cont, 'maxCellVDiff_V', {type: 'inputNumber', title: 'Voltage Calibration Max CellV Diff:', ctrlInfo: 'Maximum allowed CellV difference for voltage calibration', unit: "V"});
//    new ParamSetting(cont, 'calibVoltMaxDiff', {type: 'inputNumber', title: 'Voltage Calibration Max Diff:', ctrlInfo: 'Maximum allowed difference for voltage calibration'});
//    cont = bcGui.comp.balTest = acordPanel.getTabContentById('balTest');
//
//    new ParamSetting(cont, 'testBalCellBeginWaitTime', {type: 'inputNumber', title: 'Settle delay:', ctrlInfo: 'Maximum Time for Voltage to Settle'});
//    new ParamSetting(cont, 'testBalMaxCellVoltageChangeDelay', {type: 'inputNumber', title: 'Voltage Change Delay:', ctrlInfo: 'Maximum delay to wait for voltage change'});
//    new ParamSetting(cont, 'testBalCellMinDifBefore', {type: 'inputNumber', title: 'Cell Before Min increase:', ctrlInfo: 'Minimum Voltage change to be consider as successfull'});
//    new ParamSetting(cont, 'testBalCellMinDif', {type: 'inputNumber', title: 'Cell Min decrease:', ctrlInfo: 'Minimum Voltage change to be consider as successfull'});
//    new ParamSetting(cont, 'testBalCellMinDifAfter', {type: 'inputNumber', title: 'Cell After Min increase:', ctrlInfo: 'Minimum Voltage change to be consider as successfull'});
//
//    cont = bcGui.comp.balTest = acordPanel.getTabContentById('balTestTemp');
//    new ParamSetting(cont, 'testBalTempCooldownMaxDelay', {type: 'inputNumber', title: 'Cooldown time:', ctrlInfo: 'Maximum Time for temperature to drop down.'});
//    new ParamSetting(cont, 'testBalTempCooldownMinTemp', {type: 'inputNumber', title: 'Cooldown temperature:', ctrlInfo: ''});
//    new ParamSetting(cont, 'testBalTempMinDiff', {type: 'inputNumber', title: 'Test Minimum Difference delay:', ctrlInfo: ''});
//    new ParamSetting(cont, 'testBalTempMaxRaiseTime', {type: 'inputNumber', title: 'Max Rise delay:', ctrlInfo: ''});


};

