/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, hh */


var escCDevGui = {
    paramComp: {

    },
    dataComp: {
        esc: {}
    },
    dataPanel: {}
};

escCDevGui.initSettingsDeveloperComp = function () {

    let  cont = escCDevGui.paramComp.accordianPanel.getTabById('developer').content;
    cont = hh.div(cont);
    escCDevGui.paramComp.leadAcidEmulSettingsPanel = cont;

    hh.addHeaderTitleToPC(cont, 'Lead Acid Emulation Settings.');

    new ParamSetting(cont, 'bvcMaxBulkFloatingVoltage', {type: 'inputNumber', title: 'Max allowed Bulk Voltage:', unit: 'V',
        ctrlInfo: 'Maximum allow Voltage that can be calculated for Bulk voltage at Floating stage.'
    });
    new ParamSetting(cont, 'bvcMinBulkFloatingVoltage', {type: 'inputNumber', title: 'Min allowed Bulk Voltage:', unit: 'V',
        ctrlInfo: 'Minimum allow Voltage that can be calculated for Bulk voltage at Floating stage.'
    });
    new ParamSetting(cont, 'bvcBulkChargingVoltage', {type: 'inputNumber', title: 'Bulk voltage at Charging stage:', unit: 'V',
        ctrlInfo: 'Bulk voltage setpoint when battery allow Charging with 100%. Typically higher than maximum allowed pack voltage.'
    });
    new ParamSetting(cont, 'bvcAdjustMinStep', {type: 'inputNumber', title: 'Adjust Step:', unit: 'V',
        ctrlInfo: 'Value for Increase or Decrease Float Voltage.'
    });
    new ParamSetting(cont, 'bvcFastChargingStageCurrent', {type: 'inputNumber', title: 'Fast Charging Stage Max Current:', unit: '%',
        ctrlInfo: 'Percentage current from the total "Storage Rated Charging Current.'
    });
    new ParamSetting(cont, 'bvcChargingLastStageCurrent', {type: 'inputNumber', title: 'Slow Charging Stage Max Current:', unit: '%',
        ctrlInfo: 'Percentage current from the total "Storage Rated Charging Current.'
    });
    new ParamSetting(cont, 'bvcChargingFloatingStageCurrent', {type: 'inputNumber', title: 'bvcChargingFloatingStageCurrent:', unit: '%RA',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'bvcChargingLastChCtrlLevel', {type: 'inputNumber', title: 'Charging Stage End Set Point:', unit: '%',
        ctrlInfo: 'Storage control point for switching to Floating stage, Low values are used for charging at highest capacity and vice versa.'
    });
    new ParamSetting(cont, 'bvcChargingFirstChCtrlLevel', {type: 'inputNumber', title: 'Slow Charging Begin Set Point:', unit: '%',
        ctrlInfo: 'Storage control point for switching to Low Charge stage, values lower than "Charging Stage End Setpoint" disabled this function .'
    });
    new ParamSetting(cont, 'bvcAdjustFloatCapacityPDiff', {type: 'inputNumber', title: 'Capacity max Diff float Adjust:', unit: '%',
        ctrlInfo: 'Difference between (Capacity at Switching To Float Moment) and Actual Capacity.'
    });
    new ParamSetting(cont, 'bvcAdjustFloatVoltageVDiff', {type: 'inputNumber', title: 'Floating voltage maximum drop:', unit: 'V',
        ctrlInfo: 'Voltage maximum drop that is allowed without triggering algorithm reset. Voltage measured at Inverter side.'
    });
    new ParamSetting(cont, 'bvcFloatingStageMaxChargeCtrlLimit', {type: 'inputNumber', title: 'Min Charge Control Floating:', unit: '%',
        ctrlInfo: 'Storage control point for reducing floating voltage.'
    });

    cont = hh.div(cont);
    escCDevGui.paramComp.dynamicSettingsPanel = cont;

    hh.addHeaderTitleToPC(cont, 'Dynamic Control Settings.');

    new ParamSetting(cont, 'dvcChCtrlBegin', {type: 'inputNumber', title: 'dvcChCtrlBegin:', unit: '%CC',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dvcChCtrlEnd', {type: 'inputNumber', title: 'dvcChCtrlEnd:', unit: '%CC',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dvcLimitMax', {type: 'inputNumber', title: 'dvcLimitMax:', unit: 'CellV',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dvcLimitMin', {type: 'inputNumber', title: 'dvcLimitMin:', unit: 'CellV',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dvcStepUp', {type: 'inputNumber', title: 'dvcStepUp:', unit: '%C',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dvcStepUpDelay', {type: 'inputNumber', title: 'dvcStepUpDelay:', unit: 'ms',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dvcStepDown', {type: 'inputNumber', title: 'dvcStepDown:', unit: '%C',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dvcStepDownDelay', {type: 'inputNumber', title: 'dvcStepDownDelay:', unit: 'ms',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dccChCtrlBegin', {type: 'inputNumber', title: 'dccChCtrlBegin:', unit: '%CC',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dccChCtrlEnd', {type: 'inputNumber', title: 'dccChCtrlEnd:', unit: '%CC',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dccTransitionCurrentRatio', {type: 'inputNumber', title: 'dccTransitionCurrentRatio:', unit: '%',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dccStepUpCtrlStep', {type: 'inputNumber', title: 'dccStepUpCtrlStep:', unit: '%',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dccStepUpDelay', {type: 'inputNumber', title: 'dccStepUpDelay:', unit: 'ms',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dccStepDownCtrlStep', {type: 'inputNumber', title: 'dccStepDownCtrlStep:', unit: '%',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dccStepDownDelay', {type: 'inputNumber', title: 'dccStepDownDelay:', unit: 'ms',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'ddcChCtrlBegin', {type: 'inputNumber', title: 'ddcChCtrlBegin:', unit: '%CC',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'ddcChCtrlEnd', {type: 'inputNumber', title: 'ddcChCtrlEnd:', unit: '%CC',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'ddcTransitionCurrentRatio', {type: 'inputNumber', title: 'ddcTransitionCurrentRatio:', unit: '%',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'ddcStepUpCtrlStep', {type: 'inputNumber', title: 'ddcStepUpCtrlStep:', unit: '%',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'ddcStepUpDelay', {type: 'inputNumber', title: 'ddcStepUpDelay:', unit: 'ms',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'ddcStepDownCtrlStep', {type: 'inputNumber', title: 'ddcStepDownCtrlStep:', unit: '%',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'ddcStepDownDelay', {type: 'inputNumber', title: 'ddcStepDownDelay:', unit: 'ms',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dvdChCtrlBegin', {type: 'inputNumber', title: 'dvdChCtrlBegin:', unit: '%CC',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dvdChCtrlEnd', {type: 'inputNumber', title: 'dvdChCtrlEnd:', unit: '%CC',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dvdLimitMax', {type: 'inputNumber', title: 'dvdLimitMax:', unit: 'CellV',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dvdLimitMin', {type: 'inputNumber', title: 'dvdLimitMin:', unit: 'CellV',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dvdStepUp', {type: 'inputNumber', title: 'dvdStepUp:', unit: '%C',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dvdStepUpDelay', {type: 'inputNumber', title: 'dvdStepUpDelay:', unit: 'ms',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dvdStepDown', {type: 'inputNumber', title: 'dvdStepDown:', unit: '%C',
        ctrlInfo: '.'
    });
    new ParamSetting(cont, 'dvdStepDownDelay', {type: 'inputNumber', title: 'dvdStepDownDelay:', unit: 'ms',
        ctrlInfo: '.'
    });

};

escCDevGui.initSettingsBasicComp = function () {
    let cont = escCDevGui.paramComp.accordianPanel.getTabById('basic').content;
    new ParamSetting(cont, 'busName', {type: 'inputText', title: 'ES Bus Name:', unit: '',
        ctrlInfo: 'Actual DC BUS at LoggerV2 used for control calculations.'
    });
//    new ParamSetting(cont, 'displayName', {type: 'inputText', title: 'Display name at CCGX:', unit: '',
//        ctrlInfo: 'This name will be desplay as battery name at CCGX.'
//    });

    new ParamSetting(cont, 'controlMethod', {type: 'dropDown', title: 'Control Algorithm:',
        ctrlInfo: 'Select logic for control device. </br>' +
                '<strong> Lead Acid Emulation:</strong> use for inverters designed for lead acid battery. ' +
                'This device requred time after each change of parameter is initiated. So the ES Control will ' +
                'will try to simulate floating stages over lithium battery.</br>' +
                '<strong> Dynamic:</strong> use for inverter designed for Li-Ion battery who accept instance ' +
                'changes from ES Control.',
        dropDownConf: {
            options: [
                {label: 'Lead Acid Emulation', value: 'laEmulation'},
                {label: 'Dynamic', value: 'dynamic'}
            ]
        }
    });
};

escCDevGui.initSettingsComp = function (container) {
    escCDevGui.paramComp.accordianPanel = new SMDUIAccordianPanel(container, {
        tabs: [
            {label: 'Basic Settings', id: 'basic'},
            {label: 'Advanced Settings', id: 'advanced'},
            {label: 'Developer Settings', id: 'developer'}
        ], selectedTab: 'basic'}
    );

    escCDevGui.initSettingsBasicComp();
    escCDevGui.initSettingsDeveloperComp();
};

escCDevGui.initDataComp = function (container) {
    let panel = hh.div(container, 'actDataContainer');

    let card = escCDevGui.dataPanel.esInfo = hh.createActDataPanelCard("ES INFO", null, panel);
    escCDevGui.dataComp.esc.busName = hh.adf(card, 'Battery Bus Name:');
    escCDevGui.dataComp.esc.offlineDevices = hh.adf(card, 'Offline Devices:');
    escCDevGui.dataComp.esc.onlineDevices = hh.adf(card, 'Online Batteries:');
    escCDevGui.dataComp.esc.totalCapacityAh = hh.adf(card, 'Capacity:', 'Ah', {decimal: 2});
    escCDevGui.dataComp.esc.avergCapacityP = hh.adf(card, 'Capacity:', '%', {decimal: 2});
    escCDevGui.dataComp.esc.totalRatedCapacityAh = hh.adf(card, 'Rated Capacity:', 'Ah', {decimal: 2});
    escCDevGui.dataComp.esc.avergVoltageV = hh.adf(card, 'Bus Voltage:', 'V', {decimal: 2});
    escCDevGui.dataComp.esc.totalPowerW = hh.adf(card, 'Bus Power:', 'W', {decimal: 2});
    escCDevGui.dataComp.esc.totalCurrentA = hh.adf(card, 'Bus Current:', 'A', {decimal: 2});

    escCDevGui.dataPanel.esLimit = card = hh.createActDataPanelCard("ES LIMIT", null, panel);
    escCDevGui.dataComp.esc.chargeControl = hh.adf(card, 'Charge Control:');
    escCDevGui.dataComp.esc.currentChargeLimitSerial = hh.adf(card, 'Charge Control Limit:');
    escCDevGui.dataComp.esc.dischargeControl = hh.adf(card, 'Discharge Control:');
    escCDevGui.dataComp.esc.currentDischargeLimitSerial = hh.adf(card, 'Discharge Control Limit:');
    escCDevGui.dataComp.esc.totalRateChargeCurrentA = hh.adf(card, 'Rated Charge current:', 'A');
    escCDevGui.dataComp.esc.totalRateDischargeCurrentA = hh.adf(card, 'Rated Discharge current:', 'A');

    escCDevGui.dataPanel.sendToDev = card = hh.createActDataPanelCard("Data Send To Device", null, panel);
    escCDevGui.dataComp.chargeVoltage = hh.adf(card, 'Charge Voltage Level:', 'V');
    escCDevGui.dataComp.chargingCurrent = hh.adf(card, 'Max Charge current:', 'A');
    escCDevGui.dataComp.dischargeVoltage = hh.adf(card, 'Discharge Voltage Level:', 'V');
    escCDevGui.dataComp.dischargingCurrent = hh.adf(card, 'Max Discharge Current:', 'A');



};

escCDevGui.init = function () {

    escCDevGui.dataComp.mainTabPanel = new TabPanel(dgm.contentPanel, {
        menuItem: [
            {label: "Actual Data", id: 'actualData'},
            {label: "Settings", id: 'settings'}
//            {label: "Chart", id: 'chart'}
        ],
        stickyMenu: true,
        initSelect: 'actualData'
    });

    let dataContainer = escCDevGui.dataComp.mainTabPanel.getItemContentById('actualData');
    escCDevGui.initDataComp(dataContainer);

    let settings = escCDevGui.dataComp.mainTabPanel.getItemContentById('settings');
    escCDevGui.initSettingsComp(settings);
};
