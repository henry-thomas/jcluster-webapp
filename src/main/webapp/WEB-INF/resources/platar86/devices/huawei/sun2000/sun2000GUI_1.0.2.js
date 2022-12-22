/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, hh, bmsexDM, sun2000, ipUtils, wsm, mu, dm, sun2000DataMap */


var sun2000GUI = {
    initBatComp: {},
    datamap: {},
    fwComp: {},
    idxComp: [],
    labelComp: {},
    dcComp: {},
    dataComp: {
        pvPower: {},
        mpptData: {}
    },
    comp: {}
};

sun2000GUI.initGUI = function () {
    sun2000GUI.comp.mainTabPanel = new TabPanel(dgm.contentPanel, {
        menuItem: [
            {label: "Rated Info", id: 'ratedInfo'},
            {label: "Actual Data", id: 'actualData'},
            {label: "Settings", id: 'settings'}
        ],
        stickyMenu: true,
        initSelect: 'settings'
    });

    sun2000GUI.initHtmlRatedInfoPanel();
    sun2000GUI.initHtmlActualDataPanel();
    sun2000GUI.initHtmlSettingsPanel();
};


sun2000GUI.initHtmlRatedInfoPanel = function () {
    let cont = hh.div(sun2000GUI.comp.mainTabPanel.getItemContentById('ratedInfo'), 'actDataContainer');
    let pCont = hh.createActDataPanelCard("RATED INFORMATION", null, cont);
    let lc = sun2000GUI.labelComp;

    lc.serialNumber = hh.adf(pCont, 'Serial Number');
    lc.deviceName = hh.adf(pCont, 'Model');
    lc.hwVer = hh.adf(pCont, 'Model Number');
    lc.fwVer = hh.adf(pCont, 'Firmware Version');
    lc.installedDate = hh.adf(pCont, 'Installation Date');
    lc.mpptQty = hh.adf(pCont, 'Number of MPPT');
    lc.inputQty = hh.adf(pCont, 'Number of String');
    hh.addHeaderTitleToPC(pCont, 'COMS');
    lc.comPort = hh.adf(pCont, 'Interface');
    lc.modbusAddress = hh.adf(pCont, 'Modbus Address');

//    new SMDUIDockingCard(pCont);
};

const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
const dateFormat = "YYYY-MM-DD";

sun2000GUI.initHtmlActualDataPanel = function () {
    let cont = hh.div(sun2000GUI.comp.mainTabPanel.getItemContentById('actualData'), 'actDataContainer');
    let dc = sun2000GUI.dataComp;
    let pCont = hh.createActDataPanelCard('ACTUAL STATE', null, cont);

    dc.deviceStatus = hh.adf(pCont, 'Inverter State:', sun2000GUI.datamap.deviceStatus);
    dc.pvPower.powerW = hh.adf(pCont, 'Actual Power:', 'W', {sIPrefix: 'k', decimal: 2});
    dc.startupTime = hh.adf(pCont, 'Startup Time Today:', function (val) {
        return moment(val * 1000).format(dateTimeFormat);
    });
    dc.shutdownTime = hh.adf(pCont, 'Last Shutdown Time:', function (val) {
        return moment(val * 1000).format(dateTimeFormat);
    });
    new SMDUIDockingCard(pCont);

    pCont = hh.createActDataPanelCard('AC STATE', null, cont);
    dc.peakActivePowerCurrentDay = hh.adf(pCont, 'Peak Active Power Today:', 'W', {sIPrefix: 'k', decimal: 2});

    hh.addHeaderTitleToPC(pCont, 'VOLTAGE');
    dc.gridVoltA = hh.adf(pCont, 'Phase A-N:', 'V', {decimal: 1});
    dc.gridVoltB = hh.adf(pCont, 'Phase B-N:', 'V', {decimal: 1});
    dc.gridVoltC = hh.adf(pCont, 'Phase C-N:', 'V', {decimal: 1});
    dc.gridVoltAB = hh.adf(pCont, 'Phase A-B:', 'V', {decimal: 1});
    dc.gridVoltBC = hh.adf(pCont, 'Phase B-C:', 'V', {decimal: 1});
    dc.gridVoltCA = hh.adf(pCont, 'Phase C-A:', 'V', {decimal: 1});

    hh.addHeaderTitleToPC(pCont, 'CURRENT');
    dc.gridCurrentA = hh.adf(pCont, 'Phase A:', 'A', {decimal: 1});
    dc.gridCurrentB = hh.adf(pCont, 'Phase B:', 'A', {decimal: 1});
    dc.gridCurrentC = hh.adf(pCont, 'Phase C:', 'A', {decimal: 1});

    sun2000GUI.dcCompPanel = hh.createActDataPanelCard('DC STATE', null, cont);



};

sun2000GUI.initHtmlSettingsPanel = function () {
    let container = hh.div(sun2000GUI.comp.mainTabPanel.getItemContentById('settings'));
    let acordPanel = sun2000GUI.comp.settingsAccordionPanel = new SMDUIAccordianPanel(container, {tabs: [
            {label: 'Basic', id: 'basic'},
            {label: 'EMS Settings', id: 'ems'}
        ], selectedTab: 'basic'});

    populateEmsSettings(acordPanel.getTabContentById('ems'));

    let cont = acordPanel.getTabContentById('basic');
    new ParamSetting(cont, {
        type: 'dropDownButton',
        title: 'Control:',
        ctrlInfo: 'Turn inverter On or Off. ',
        content: [
            {name: 'ON', cb: function () {
                    wsm.sendDevMsgExecWithJsonInst(
                            {instrExt: 'turnOn', showMessage: true}
                    );
                }},
            {name: 'OFF', cb: function () {
                    wsm.sendDevMsgExecWithJsonInst(
                            {instrExt: 'turnOff', showMessage: true}
                    );
                }}
        ]
    });

    new ParamSetting(cont, 'powerLimit', {type: 'inputNumber', title: 'Power Limit:', unit: 'W', ctrlInfo: '.'});
    new ParamSetting(cont, 'activePowerChangeGradient', {type: 'inputNumber', title: 'Active Power Change Gradient', unit: '%/s', ctrlInfo: '.',
//        setterFormatter: function (val) {
//            return val / 1000;
//        },
//        getterFormatter: function (val) {
//            return val * 1000;
//        }
    });
    new ParamSetting(cont, 'reactivePowerChangeGradient', {type: 'inputNumber', title: 'Reactive Power Change Gradient', unit: '%/s', ctrlInfo: '.'});
    new ParamSetting(cont, 'scheduleInstValidDuration', {type: 'inputNumber', title: 'Schedule Valud Duration', unit: 's', ctrlInfo: '.'});

};

function populateEmsSettings(cont) {
    new ParamSetting(cont, 'emsParam.emsMaxPowerPer', {type: 'inputNumber', title: 'Maximum EMS Power:', unit: '%', ctrlInfo: 'Maximum power restriction for EMS, value in % of rated Power.'});
    new ParamSetting(cont, 'emsParam.emsMinPowerPer', {type: 'inputNumber', title: 'Minimum EMS Power:', unit: '%', ctrlInfo: 'Minimum power restriction for EMS, value in % of rated Power.'});
    new ParamSetting(cont, 'emsParam.emsChnageRatioPer', {type: 'inputNumber', title: 'Change Ratio:', unit: '%', ctrlInfo: 'This parameter is used to limit the overshooting and oscilating of the inverter power.'});

    new ParamSetting(cont, 'emsParam.emsNotActiveState', {type: 'inputNumber', title: 'EMS Not Active State:', ctrlInfo: ''});
    new ParamSetting(cont, 'emsParam.emsNotActivePower', {type: 'inputNumber', title: 'EMS Not Active Power:', unit: '%', ctrlInfo: ''});

//    new ParamSetting(cont, 'busName', {type: 'inputText', title: 'DC BUS Name:', ctrlInfo: 'Used to link inverter with battery info.'});

    new ParamSetting(cont, 'emsParam.emsAllowOnOff', {type: 'switch', title: 'Allow Ems Inverter State Control:', ctrlInfo: 'This parameter, when enabled, allows EMS to turn the inverter on and off.'});
    new ParamSetting(cont, 'emsParam.emsAllowOnGridModeChange', {type: 'switch', title: 'Allow EMS On-grid charge/discharge mode change:', ctrlInfo: 'This parameter when enabled, allows EMS to change On-grid charge/discharge mode.'});
    new ParamSetting(cont, 'emsParam.emsAllowOpModeChange', {type: 'switch', title: 'Allow Ems On/Off-grid mode setting change:', ctrlInfo: 'This parameter when enabled, allows EMS to change On/Off-grid mode setting.'});
}

sun2000GUI.datamap.deviceStatus = function (val) {
    if (dm.selected.param.protocolVer === 2) {
        switch (val) {
            case 0x0000:
                return 'Standby: Initializing';
            case 0x0001:
                return 'Standby: Detecting insulation resistance';
            case 0x0002:
                return 'Standby: Detecting irradiation';
            case 0x0003:
                return 'Standby: Drid detecting';
            case 0x0100:
                return 'Starting';
            case 0x0200:
                return 'On-grid';
            case 0x0201:
                return 'Grid connection: Power limited';
            case 0x0202:
                return 'Grid connection: Selfderating';
            case 0x0300:
                return 'Shutdown: Fault';
            case 0x0301:
                return 'Shutdown: Command';
            case 0x0302:
                return 'Shutdown: OVGR';
            case 0x0303:
                return 'Shutdown: Communication disconnected';
            case 0x0304:
                return 'Shutdown: Power limited';
            case 0x0305:
                return 'Shutdown: Manual startup required';
            case 0x0306:
                return 'Shutdown: DC switches disconnected';
            case 0x0307:
                return 'Shutdown: Rapid cutoff';
            case 0x0308:
                return 'Shutdown: Input underpower';
            case 0x0401:
                return 'Grid scheduling: cosφ-P curve';
            case 0x0402:
                return 'Grid scheduling: Q-U curve';
            case 0x0403:
                return 'Grid scheduling: PF-U curve';
            case 0x0404:
                return 'Grid scheduling: Dry contact';
            case 0x0405:
                return 'Grid scheduling: Q-P curve';
            case 0x0500:
                return 'Spot-check ready';
            case 0x0501:
                return 'Spot-checking';
            case 0x0600:
                return 'Inspecting';
            case 0x0700:
                return 'AFCI self check';
            case 0x0800:
                return 'I-V scanning';
            case 0x0900:
                return 'DC input detection';
            case 0xA000:
                return 'Standby: No irradiation';
            default:
                return 'Unknown DeviceStatus[' + val + ']';
        }

    }
    return 'Unknown PROTO[' + dm.selected.param.protocolVer + '] DeviceStatus[' + val + ']';
};