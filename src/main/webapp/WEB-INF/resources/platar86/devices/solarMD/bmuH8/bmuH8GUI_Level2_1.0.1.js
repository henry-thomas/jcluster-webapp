/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, hh, bmsexDM, bmuH8, ipUtils, wsm, mu, dm, bmuH8GUI */

bmuH8GUI.initSettingsDeveloper = function () {
    let cont = bmuH8GUI.comp.mainTabPanel.addItem({label: 'Developer', id: 'developer'});
    hh.pPanelAddDescTitle(cont, 'BMU Firmware.');
    new ParamSetting(cont, {
        instrExt: 'exec_readFirmwareContent',
        type: 'dropDownButton',
        title: 'Rewad Frimware Content:',
        content: [{
                name: 'Read',
                cb: bmuH8GUI.onReadFirmwareBmuH8ClickDialog
            }, {
                name: 'Refresh Only',
                cb: bmuH8GUI.onReadFirmwareBmuH8ClickDialog.bind(null, true)
            }, {
                name: 'Check for Update',
                cb: function () {
                    wsm.sendDevMsgExecWithJsonInst(
                            {instrExt: 'checkForUpdate', showMessage: true}
                    );
                }
            }]
    });
    bmuH8GUI.fwComp.applyFwBmuPSettings = new ParamSetting(cont, {
        hidden: true,
        type: 'dropDownButton',
        content: [{
                name: 'Apply Update',
                cb: function () {
                    wsm.sendDevMsgExecWithJsonInst(
                            {instrExt: 'exec_applyFirmwareBmuH8'},
                            function (msg, succ) {
                                mu.showInfoMessage('Firmware exec begin ..');
                                dm.selected.setConnected(false);
                            },
                            function (msg, err) {
                                mu.showInfoMessage('Firmware exec begin...');
                                dm.selected.setConnected(false);
                            });
                }
            }, {
                name: 'Apply Update To All Others',
                cb: bmuH8GUI.sendInstrToAllOther.bind(null, " ", 'exec_applyFirmwareBmuH8', null, 250)
            }]
    });
    bmuH8GUI.fwComp.applyFwBmsPSettings = new ParamSetting(cont, {
        hidden: true,
        type: 'dropDownButton',
        content: [{
                name: 'Apply BMS Update ALL',
                cb: function () {
                    wsm.sendDevMsgExecWithJsonInst({instrExt: 'exec_applyFirmwareBmsEx', displayMessage: true});
                }
            }]
    });
    hh.pPanelAddDescTitle(cont, 'System Control.');
    new ParamSetting(cont, {
        instrExt: 'exec_hvModuleReinit',
        type: 'dropDownButton',
        title: 'Request Module Reinit:',
        content: [
            {name: 'ReInit', cb: bmuH8GUI.fnCall.bind(this, 'exec_hvModuleReinit')}
        ]
    });
    new ParamSetting(cont, {
        type: 'dropDownButton',
        title: 'BMU Hard Reset:',
        ctrlInfo: 'Do not use this!',
        content: [
            {name: 'Reset', cb: bmuH8GUI.fnCall.bind(this, 'exec_hvModuleDevHardReset')},
            {
                name: 'Reset All BMUs',
                cb: bmuH8GUI.fnCallToAll.bind(this, 'exec_hvModuleDevHardReset', null, 250)
            }
        ]
    });
    new ParamSetting(cont, {
        type: 'dropDownButton',
        title: 'BMU GlobalParamReset:',
        ctrlInfo: 'Do not use this! Specialy you, Kaloyan.',
        content: [
            {name: 'Reset', cb: bmuH8GUI.fnCall.bind(this, 'exec_globParamConfigReset')},
            {
                name: 'Reset All BMUs',
                cb: bmuH8GUI.fnCallToAll.bind(this, 'exec_globParamConfigReset', null, 250)
            }
        ]
    });
    new ParamSetting(cont, {
        type: 'dropDownButton',
        title: 'BMU Factory Reset:',
        ctrlInfo: 'Clear all parameters and all counters. ',
        content: [
            {name: 'Reset', cb: bmuH8GUI.fnCall.bind(this, 'exec_factoryReset')}
        ]
    });
    new ParamSetting(cont, {
        type: 'dropDownButton',
        title: 'Network Config Reset:',
        ctrlInfo: 'Clear all parameters and all counters. ',
        content: [
            {name: 'Reset', cb: bmuH8GUI.fnCall.bind(this, 'exec_netConfigReset')},
            {
                name: 'Reset All BMUs',
                cb: bmuH8GUI.fnCallToAll.bind(this, 'exec_netConfigReset', null, 250)
            }
        ]
    });
    new ParamSetting(cont, {
        type: 'dropDownButton',
        title: 'Cluster Known Batteries Reset:',
        ctrlInfo: 'Do not use this! Developers only.',
        content: [
            {name: 'Reset', cb: bmuH8GUI.fnCall.bind(this, 'exec_resetClusterNodeMemory')},
            {
                name: 'Reset All BMUs',
                cb: bmuH8GUI.fnCallToAll.bind(this, 'exec_resetClusterNodeMemory', null, 250)
            }
        ]
    });
    new ParamSetting(cont, {
        type: 'dropDownButton',
        title: 'Cluster Memory Erease:',
        ctrlInfo: 'Do not use this! Developers only.',
        content: [
            {name: 'Reset', cb: bmuH8GUI.fnCall.bind(this, 'exec_clusterParamConfigReset')},
            {
                name: 'Reset All BMUs',
                cb: bmuH8GUI.fnCallToAll.bind(this, 'exec_clusterParamConfigReset', null, 250)
            }
        ]
    });
    new ParamSetting(cont, {
        type: 'dropDownButton',
        title: 'BMU Cluster RESET:',
        ctrlInfo: 'Do not use this! Developers only.',
        content: [
            {name: 'Reset', cb: bmuH8GUI.fnCall.bind(this, 'exec_clusterParamConfigReset')}
        ]
    });
    new ParamSetting(cont, {
        type: 'dropDownButton',
        title: 'User Control On/OFF:',
        ctrlInfo: 'This function is used to keep battery off requested by user.',
        content: [
            {name: 'ON', cb: function () {
                    wsm.sendDevMsgExecWithJsonInst({
                        instrExt: 'execInstr',
                        execFn: 'exec_userRemoteOnOff',
                        execInstr: 0,
                        showMessage: true
                    }, function () {
                        mu.showInfoMessage('Success', ' User OFF lock Removed');
                    });
                }},
            {name: 'OFF', cb: function () {
                    wsm.sendDevMsgExecWithJsonInst({
                        instrExt: 'execInstr',
                        execFn: 'exec_userRemoteOnOff',
                        execInstr: 1,
                        showMessage: true
                    }, function () {
                        mu.showInfoMessage('Success', ' User OFF lock Set');
                    });
                }}
        ]
    });
};
bmuH8GUI.initSettingsNetwork = function () {
    let cont = bmuH8GUI.comp.mainTabPanel.addItem({label: 'Network', id: 'network'});
    hh.pPanelAddDescTitle(cont, 'BMU-H8 Ethernet port configuration');
    new ParamSetting(cont, 'netDhcpEnabled', {
        type: 'switch', title: 'DHCP Enabled:',
        ctrlInfo: 'Enable or Disable DHCP Client for BMU. If enabled and no dhcp server is found, fallback settings are going to be applied.'
    });
    new ParamSetting(cont, 'netIp', {
        type: 'inputText', title: 'IP Address:',
        ctrlInfo: 'Ip Address of Ethernet port. Used for TCP, ICMP and other communitcionts.',
        validator: function (comp, instr) {
            if (!ipUtils.validateIpAddrString(comp.getValue())) {
                throw new Error("Invalid IP address [" + comp.getValue() + '] Please check syntaxis ###.###.###.###');
            }
        }
    });
    new ParamSetting(cont, 'netMask', {
        type: 'inputText', title: 'Mask:',
        ctrlInfo: 'Ip Mask of Ethernet port.',
        validator: function (comp, instr) {
            if (!ipUtils.validateIpMaskString(comp.getValue())) {
                throw new Error("Invalid NETMASK  [" + comp.getValue() + '] Please check syntaxis ###.###.###.###');
            }
        }
    });
    new ParamSetting(cont, 'netGateway', {
        type: 'inputText', title: 'Gateway:',
        ctrlInfo: 'Ip Gateway Address of Ethernet port.',
        validator: function (comp, instr) {
            if (!ipUtils.validateIpAddrString(comp.getValue())) {
                throw new Error("Invalid Gateway address [" + comp.getValue() + '] Please check syntaxis ###.###.###.###');
            }
        }
    });
    new ParamSetting(cont, 'netEthMac', {
        type: 'inputText', title: 'MAC:',
        ctrlInfo: 'MAC address of Ethernet port.'
    });
    new ParamSetting(cont, 'netHostName', {
        type: 'inputText', title: 'Hostname:',
        ctrlInfo: 'Netwrok Host Name.'
    });
};
bmuH8GUI.initInstallerSettings = function () {
    let cont = bmuH8GUI.comp.settingsAccordionPanel.getTabContentById('basic');
    //dm.selected.param.busName
    new ParamSetting(cont, 'busName', {type: 'inputText', title: 'Battery DC BUS', ctrlInfo: '.'});
};
bmuH8GUI.initClusterSettingsBasic = function () {
    let pClustCont = bmuH8GUI.comp.settingsAccordionPanel.getTabContentByName('Cluster');
    new ParamSetting(pClustCont, {
        type: 'dropDownButton',
        title: 'BMU Transfer Settings to all Nodes:',
        ctrlInfo: '...',
        content: [
            {name: 'Transfer', cb: bmuH8GUI.transferClusterSettings}
        ]
    });
    new ParamSetting(pClustCont, 'clustParam.clusterEnabled', {type: 'dropDown', title: 'Cluster Enabled:', ctrlInfo: 'Enable or Disable Cluster functionality and Inverter Remote Control.',
        dropDownConf: {options: [{label: 'Disable', value: 0}, {label: 'Enable', value: 1}]}
    });
    new ParamSetting(pClustCont, 'clustParam.minChargeCurrent', {type: 'inputNumber', title: 'minChargeCurrent', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.minDischargeCurrent', {type: 'inputNumber', title: 'minDischargeCurrent', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.stageUpdatePeriod', {type: 'inputNumber', title: 'stageUpdatePeriod', ctrlInfo: '.'});
    hh.pPanelAddDescTitle(pClustCont, 'Charge Ctrl Current Translation.');
    new ParamSetting(pClustCont, 'clustParam.curCalcChCtrlIncreaseDelay', {type: 'inputNumber', title: 'curCalcChCtrlIncreaseDelay', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.curCalcChCtrlIncreaseStep', {type: 'inputNumber', title: 'curCalcChCtrlIncreaseStep', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.curCalcChCtrlDecreaseDelay', {type: 'inputNumber', title: 'curCalcChCtrlDecreaseDelay', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.curCalcChCtrlDecreaseStep', {type: 'inputNumber', title: 'curCalcChCtrlDecreaseStep', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.curCalcChCtrlValueUsage', {type: 'inputNumber', title: 'curCalcChCtrlValueUsage', ctrlInfo: '.'});
    hh.pPanelAddDescTitle(pClustCont, 'Discharge Ctrl Current Translation.');
    new ParamSetting(pClustCont, 'clustParam.curCalcDischCtrlIncreaseDelay', {type: 'inputNumber', title: 'curCalcDischCtrlIncreaseDelay', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.curCalcDischCtrlIncreaseStep', {type: 'inputNumber', title: 'curCalcDischCtrlIncreaseStep', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.curCalcDischCtrlDecreaseDelay', {type: 'inputNumber', title: 'curCalcDischCtrlDecreaseDelay', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.curCalcDischCtrlDecreaseStep', {type: 'inputNumber', title: 'curCalcDischCtrlDecreaseStep', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.curCalcDischCtrlValueUsage', {type: 'inputNumber', title: 'curCalcDischCtrlValueUsage', ctrlInfo: '.'});
    hh.pPanelAddDescTitle(pClustCont, 'Set points Current Charge Ctrl.');
    new ParamSetting(pClustCont, 'clustParam.curCalcCurChTopPoint', {type: 'inputNumber', title: 'curCalcCurChTopPoint', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.curCalcCurChTopValue', {type: 'inputNumber', title: 'curCalcCurChTopValue', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.curCalcCurChP1CtrlPoint', {type: 'inputNumber', title: 'curCalcCurChP1CtrlPoint', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.curCalcCurChP1CtrlValue', {type: 'inputNumber', title: 'curCalcCurChP1CtrlValue', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.curCalcCurChBottomPoint', {type: 'inputNumber', title: 'curCalcCurChBottomPoint', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.curCalcCurChBottomValue', {type: 'inputNumber', title: 'curCalcCurChBottomValue', ctrlInfo: '.'});
    hh.pPanelAddDescTitle(pClustCont, 'Set points Current Discharge Ctrl.');
    new ParamSetting(pClustCont, 'clustParam.curCalcCurDischTopPoint', {type: 'inputNumber', title: 'curCalcCurDischTopPoint', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.curCalcCurDischTopValue', {type: 'inputNumber', title: 'curCalcCurDischTopValue', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.curCalcCurDischP1CtrlPoint', {type: 'inputNumber', title: 'curCalcCurDischP1CtrlPoint', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.curCalcCurDischP1CtrlValue', {type: 'inputNumber', title: 'curCalcCurDischP1CtrlValue', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.curCalcCurDischBottomPoint', {type: 'inputNumber', title: 'curCalcCurDischBottomPoint', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.curCalcCurDischBottomValue', {type: 'inputNumber', title: 'curCalcCurDischBottomValue', ctrlInfo: '.'});
//Voltage

    hh.pPanelAddDescTitle(pClustCont, 'Charge Ctrl Voltage Translation.');
    new ParamSetting(pClustCont, 'clustParam.voltCalcChCtrlIncreaseDelay', {type: 'inputNumber', title: 'voltCalcChCtrlIncreaseDelay', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcChCtrlIncreaseStep', {type: 'inputNumber', title: 'voltCalcChCtrlIncreaseStep', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcChCtrlDecreaseDelay', {type: 'inputNumber', title: 'voltCalcChCtrlDecreaseDelay', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcChCtrlDecreaseStep', {type: 'inputNumber', title: 'voltCalcChCtrlDecreaseStep', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcChCtrlValueUsage', {type: 'dropDown', title: 'voltCalcChCtrlValueUsage', ctrlInfo: '.sd',
        dropDownConf: {options: [
                {label: 'F F F', value: 0},
                {label: 'F F O', value: 0b001},
                {label: 'F O F', value: 0b010},
                {label: 'F O O', value: 0b011},
                {label: 'O F F', value: 0b100},
                {label: 'O F O', value: 0b101},
                {label: 'O O F', value: 0b110},
                {label: 'O O O', value: 0b111}
            ]}});
    hh.pPanelAddDescTitle(pClustCont, 'Discharge Ctrl Voltage Translation.');
    new ParamSetting(pClustCont, 'clustParam.voltCalcDischCtrlIncreaseDelay', {type: 'inputNumber', title: 'voltCalcDischCtrlIncreaseDelay', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcDischCtrlIncreaseStep', {type: 'inputNumber', title: 'voltCalcDischCtrlIncreaseStep', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcDischCtrlDecreaseDelay', {type: 'inputNumber', title: 'voltCalcDischCtrlDecreaseDelay', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcDischCtrlDecreaseStep', {type: 'inputNumber', title: 'voltCalcDischCtrlDecreaseStep', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcDischCtrlValueUsage', {type: 'dropDown', title: 'voltCalcDischCtrlValueUsage', ctrlInfo: '.sd',
        dropDownConf: {options: [
                {label: 'F F F', value: 0},
                {label: 'F F O', value: 0b001},
                {label: 'F O F', value: 0b010},
                {label: 'F O O', value: 0b011},
                {label: 'O F F', value: 0b100},
                {label: 'O F O', value: 0b101},
                {label: 'O O F', value: 0b110},
                {label: 'O O O', value: 0b111}
            ]}});
    hh.pPanelAddDescTitle(pClustCont, 'Set points Voltage Charge Ctrl.');
    new ParamSetting(pClustCont, 'clustParam.voltCalcCurChTopPoint', {type: 'inputNumber', title: 'voltCalcCurChTopPoint', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcCurChTopValue', {type: 'inputNumber', title: 'voltCalcCurChTopValue', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcCurChTopOffset', {type: 'inputNumber', title: 'voltCalcCurChTopOffset', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcCurChP1CtrlPoint', {type: 'inputNumber', title: 'voltCalcCurChP1CtrlPoint', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcCurChP1CtrlValue', {type: 'inputNumber', title: 'voltCalcCurChP1CtrlValue', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcCurChP1CtrlOffset', {type: 'inputNumber', title: 'voltCalcCurChP1CtrlOffset', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcCurChBottomPoint', {type: 'inputNumber', title: 'voltCalcCurChBottomPoint', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcCurChBottomValue', {type: 'inputNumber', title: 'voltCalcCurChBottomValue', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcCurChBottomOffset', {type: 'inputNumber', title: 'voltCalcCurChBottomOffset', ctrlInfo: '.'});
    hh.pPanelAddDescTitle(pClustCont, 'Set points Voltage Discharge Ctrl.');
    new ParamSetting(pClustCont, 'clustParam.voltCalcCurDischTopPoint', {type: 'inputNumber', title: 'voltCalcCurDischTopPoint', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcCurDischTopValue', {type: 'inputNumber', title: 'voltCalcCurDischTopValue', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcCurDischTopOffset', {type: 'inputNumber', title: 'voltCalcCurDischTopOffset', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcCurDischP1CtrlPoint', {type: 'inputNumber', title: 'voltCalcCurDischP1CtrlPoint', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcCurDischP1CtrlValue', {type: 'inputNumber', title: 'voltCalcCurDischP1CtrlValue', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcCurDischP1CtrlOffset', {type: 'inputNumber', title: 'voltCalcCurDischP1CtrlOffset', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcCurDischBottomPoint', {type: 'inputNumber', title: 'voltCalcCurDischBottomPoint', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcCurDischBottomValue', {type: 'inputNumber', title: 'voltCalcCurDischBottomValue', ctrlInfo: '.'});
    new ParamSetting(pClustCont, 'clustParam.voltCalcCurDischBottomOffset', {type: 'inputNumber', title: 'voltCalcCurDischBottomOffset', ctrlInfo: '.'});
};
bmuH8GUI.initClusterRemoteDeviceSettings = function () {
    let tabCont = [];
    for (var i = 0; i < 3; i++) {
        tabCont.push({label: "Remote Device " + (i + 1), id: i});
    }
    let pClustRemote = bmuH8GUI.comp.settingsAccordionPanel.getTabContentById('clusterRemote');
    let tabPanel = new TabPanel(pClustRemote, {menuItem: tabCont});
    for (var i = 0; i < 3; i++) {
        let remoteTabDeviCont = tabPanel.getItemContentById(i);
        new ParamSetting(remoteTabDeviCont, 'clustParam.clusRemoteDevComConf[' + i + '].devType', {type: 'dropDown', title: 'Remote Device Type:', ctrlInfo: '.',
            dropDownConf: {options: [{label: 'Disable', value: 0},
                    {label: 'Sungrow SC50', value: 1},
                    {label: 'Sungrow SC630TL', value: 2},
                    {label: 'Atess HPS', value: 0x80 | 2},
                    {label: 'Kehua', value: 0x80 | 3}
                ]}
        });
        new ParamSetting(remoteTabDeviCont, 'clustParam.clusRemoteDevComConf[' + i + '].modbusSlaveAddress', {type: 'inputNumber', title: 'modbusSlaveAddress', ctrlInfo: '.'});
        new ParamSetting(remoteTabDeviCont, 'clustParam.clusRemoteDevComConf[' + i + '].modbusBaudrate', {type: 'dropDown', title: 'Modbus Baudrate:', ctrlInfo: '.',
            dropDownConf: {options: [
                    {label: '1200', value: 1200},
                    {label: '2400', value: 2400},
                    {label: '4800', value: 4800},
                    {label: '9600', value: 9600},
                    {label: '19200', value: 19200},
                    {label: '38400', value: 38400},
                    {label: '57600', value: 57600},
                    {label: '115200', value: 115200},
                    {label: '128000', value: 128000}
                ]}
        });
        new ParamSetting(remoteTabDeviCont, 'clustParam.clusRemoteDevComConf[' + i + '].modbusParity', {type: 'dropDown', title: 'Modbus Parity:', ctrlInfo: '.',
            dropDownConf: {options: [
                    {label: 'Even', value: 0},
                    {label: 'Odd', value: 1},
                    {label: 'None', value: 2},
                    {label: 'Space', value: 3},
                    {label: 'Mark', value: 4}
                ]}
        });
        new ParamSetting(remoteTabDeviCont, 'clustParam.clusRemoteDevComConf[' + i + '].modbusStopBits', {type: 'dropDown', title: 'Modbus Stop Bits:', ctrlInfo: '.',
            dropDownConf: {options: [
                    {label: '1 Stop Bit', value: 0},
                    {label: '2 Stop Bits', value: 1}
                ]}
        });
        new ParamSetting(remoteTabDeviCont, 'clustParam.clusRemoteDevComConf[' + i + '].canbusSpeed', {type: 'dropDown', title: 'CANBUS Baudrate:', ctrlInfo: '.',
            dropDownConf: {options: [
                    {label: '125kbps', value: 125000},
                    {label: '250kbps', value: 250000},
                    {label: '500kbps', value: 500000}
                ]}
        });
    }
};
bmuH8GUI.initSettingsBasic = function () {
    let container = bmuH8GUI.comp.mainTabPanel.addItem({label: 'Settings', id: 'settings'});
    let acordPanel = bmuH8GUI.comp.settingsAccordionPanel = new SMDUIAccordianPanel(container, {tabs: [
            {label: 'Basic', id: 'basic'},
            {label: 'Protector', id: 'protector'},
            {label: 'Balancing', id: 'balancing'},
            {label: 'Current Measurmnet', id: 'currentMeas'},
            {label: 'Protection Unit', id: 'protUnit'},
            {label: 'Cluster', id: 'cluster'},
            {label: 'Cluster Remote Device', id: 'clusterRemote'},
            {label: 'Rated Values', id: 'ratedValues'},
            {label: 'Charge Discharge Control', id: 'chDischCtrl'}
        ], selectedTab: 6});
    let gPCont = acordPanel.getTabContentByName('Protector');
    bmuH8GUI.initClusterSettingsBasic();
    bmuH8GUI.initClusterRemoteDeviceSettings();
    bmuH8GUI.initInstallerSettings();
    //            new ParamSetting(gPCont, 'protInitDelay', {type: 'inputNumber', title: 'Protector Init Delay:', unit: 's'});
    hh.pPanelAddDescTitle(gPCont, 'Battery Critical Low Limit Settings.');
    new ParamSetting(gPCont, 'botShutdownMinCellVoltage', {type: 'inputNumber', title: 'Minimum Cell Voltage:', unit: 'mV', ctrlInfo: 'Minimum cell voltage in which the BMS will enter Deep Power Saving mode.'});
    new ParamSetting(gPCont, 'botShutdownMinPackVoltage', {type: 'inputNumber', title: 'Minimum Pack Voltage:', unit: 'mV', ctrlInfo: 'Minimum pack voltage in which the BMS will enter Deep Power Saving mode.'});
    new ParamSetting(gPCont, 'botShutdownCriticalCellVoltage', {type: 'inputNumber', title: 'Shutdown Cell Voltage:', unit: 'mV', ctrlInfo: 'Minimum cell voltage before the BMS shuts down.'});
    new ParamSetting(gPCont, 'botShutdownErrorDelay', {type: 'inputNumber', title: 'Shutdown Delay:', unit: 's', ctrlInfo: 'Time delay for going into Power Saving mode once min voltage reached.'});
    new ParamSetting(gPCont, 'botShutdownDelay', {type: 'inputNumber', title: 'Complete Shutdown Delay:', unit: 's', ctrlInfo: 'Time delay for shutting down once min voltage reached.'});
    hh.pPanelAddDescTitle(gPCont, 'Battery Low Voltage Protection Settings.');
    new ParamSetting(gPCont, 'botSleepLowCellVoltage', {type: 'inputNumber', title: 'Minimum Sleep Cell Voltage:', unit: 'mV', ctrlInfo: 'Minimum cell voltage for Sleep low mode to be activated.'});
    new ParamSetting(gPCont, 'botSleepLowPackVoltage', {type: 'inputNumber', title: 'Minimum Sleep Pack Voltage:', unit: 'mV', ctrlInfo: 'Minimum pack voltage for Sleep low mode to be activated.'});
    new ParamSetting(gPCont, 'botSleepPendingDelay', {type: 'inputNumber', title: 'Pending Sleep low delay:', unit: 's', ctrlInfo: 'Time delay at or below minimum voltage for sleep mode to be activated.'});
    new ParamSetting(gPCont, 'botSleepDelay', {type: 'inputNumber', title: 'Sleep duration:', unit: 's', ctrlInfo: 'Length of time the battery will be asleep for.'});
    new ParamSetting(gPCont, 'botSleepAwakeDelay', {type: 'inputNumber', title: 'Wake up duration:', unit: 's', ctrlInfo: 'Length of time the battery will be awake for in between sleeps.'});
    hh.pPanelAddDescTitle(gPCont, 'Overvoltage Protection Settings.');
    new ParamSetting(gPCont, 'topSleepCellVoltage', {type: 'inputNumber', title: 'Sleep High Cell Voltage:', unit: 'mV', ctrlInfo: 'Cell voltage at which sleep high mode is activated.'});
    new ParamSetting(gPCont, 'topSleepPackVoltage', {type: 'inputNumber', title: 'Sleep High Pack Voltage:', unit: 'mV', ctrlInfo: 'Pack voltage at which sleep high mode is activated.'});
    new ParamSetting(gPCont, 'topPendingSleephDelay', {type: 'inputNumber', title: 'Sleep High Delay:', unit: 's', ctrlInfo: 'Time delay at or above the voltage set point for sleep high to be activated.'});
    new ParamSetting(gPCont, 'topSleepDelay', {type: 'inputNumber', title: 'Sleep high Sleep duration:', unit: 's', ctrlInfo: 'Time delay at or above the voltage set point for sleep high to be activated.'});
    new ParamSetting(gPCont, 'topAwakeConditionDelay', {type: 'inputNumber', title: 'Sleep high Wake up sensing duration:', unit: 's', ctrlInfo: 'Duration of time the voltage should to remain below the over voltage threshold before error is cleared.'});
    hh.pPanelAddDescTitle(gPCont, 'Temperature Control Settings.');
    new ParamSetting(gPCont, 'protTcEnable', {type: 'dropDown', title: 'Temperature Control:', unit: '', ctrlInfo: '.',
        dropDownConf: {options: [{label: 'Disable', value: 0}, {label: 'Enable', value: 1}]}
    });
    new ParamSetting(gPCont, 'protTcChargeTempBegin', {type: 'inputNumber', title: 'Bottom Charge Set Point:', unit: '℃', ctrlInfo: 'Maximum temperature for charging.'});
    new ParamSetting(gPCont, 'protTcChargeTempP1', {type: 'inputNumber', title: 'Middle Bottom Charge set point:', unit: '℃', ctrlInfo: 'Lower Temperature Limit for charging at the rated current.'});
    new ParamSetting(gPCont, 'protTcChargeTempP2', {type: 'inputNumber', title: 'Middle top charge set point:', unit: '℃', ctrlInfo: 'Upper Temperature limit for charging at the rated current.'});
    new ParamSetting(gPCont, 'protTcChargeTempEnd', {type: 'inputNumber', title: 'Top charge set point:', unit: '℃', ctrlInfo: 'Maximum temperature for charging.'});
    new ParamSetting(gPCont, 'protTcDischargeTempBegin', {type: 'inputNumber', title: 'Bottom Discharge set point:', unit: '℃', ctrlInfo: 'Minimum temperature for discharging.'});
    new ParamSetting(gPCont, 'protTcDischargeTempP1', {type: 'inputNumber', title: 'Middle bottom discharge set point:', unit: '℃', ctrlInfo: 'Lower Temperature Limit for discharging at the rated current.'});
    new ParamSetting(gPCont, 'protTcDischargeTempP2', {type: 'inputNumber', title: 'Middle Top discharge set point:', unit: '℃', ctrlInfo: 'Upper Temperature limit for discharging at the rated current.'});
    new ParamSetting(gPCont, 'protTcDischargeTempEnd', {type: 'inputNumber', title: 'Top discharge set point:', unit: '℃', ctrlInfo: 'Maximum temperature for discharging.'});
    hh.pPanelAddDescTitle(gPCont, 'Current / Temperature Fault Trigger Settings.');
    new ParamSetting(gPCont, 'protTcFaultChargeCurrentOffset', {type: 'inputNumber', title: 'Error Charge Current Offset:', unit: '%', ctrlInfo: 'Percentage of Current(A) offset from Max and Min values applied to the protection relay for discharging. Value of -100 will disable this future.'});
    new ParamSetting(gPCont, 'protTcFaultDischargeCurrentOffset', {type: 'inputNumber', title: 'Error Discharge Current Offset:', unit: '%', ctrlInfo: 'Percentage of Current(A) offset from Max and Min values applied to the protection relay for charging. Value of -100 will disable this future.'});
    new ParamSetting(gPCont, 'protTcFaultPendingDelay', {type: 'inputNumber', title: 'Error trigger delay:', unit: 's', ctrlInfo: 'Time delay before an error is triggered.'});
    new ParamSetting(gPCont, 'protTcFaultRecoverDelay', {type: 'inputNumber', title: 'Error recovery delay:', unit: 's', ctrlInfo: 'Time delay after temperature has recovered for error to be cleared.'});
    hh.pPanelAddDescTitle(gPCont, 'Override Limits.');
    new ParamSetting(gPCont, 'protOverrMinCellVoltage', {type: 'inputNumber', title: 'Override Minimum Voltage:', unit: 'mV', ctrlInfo: '.'});
    new ParamSetting(gPCont, 'protOverrMaxCellVoltage', {type: 'inputNumber', title: 'Override Maximum Voltage:', unit: 'mV', ctrlInfo: '.'});
    new ParamSetting(gPCont, 'protOverrCondDelay', {type: 'inputNumber', title: 'Override Cond Delay:', unit: 's', ctrlInfo: '.'});
    hh.pPanelAddDescTitle(gPCont, 'Warning Levels.');
    new ParamSetting(gPCont, 'protWarnMinCellVoltage', {type: 'inputNumber', title: 'Cell Min Warning Level:', unit: 'mV', ctrlInfo: '.'});
    new ParamSetting(gPCont, 'protWarnMaxCellVoltage', {type: 'inputNumber', title: 'Cell Max Warning Level:', unit: 'mV', ctrlInfo: '.'});
    let bPCont = acordPanel.getTabContentByName('Balancing');
    hh.pPanelAddDescTitle(bPCont, 'Balancing Settings.');
    new ParamSetting(bPCont, 'balOperationMode', {type: 'dropDown', title: 'Cell balancing mode:', ctrlInfo: 'Select a mode for the type of balancing to be used.',
        dropDownConf: {
            options: [{label: 'Disabled', value: 0}, {label: 'Voltage Based', value: 1}, {label: 'Capacity Based', value: 2}, {label: 'Manual', value: 3}]
        }
    });
    new ParamSetting(bPCont, 'balMaxChargingCurrent', {type: 'inputNumber', title: 'Maximum Charging Current:', unit: 'mA', ctrlInfo: 'Maximum Charging Current for balancing to take place.'});
    new ParamSetting(bPCont, 'balMaxDischargingCurrent', {type: 'inputNumber', title: 'Maximum Discharging Current:', unit: 'mA', ctrlInfo: 'Maximum Discharging Current for balancing to take place.'});
    new ParamSetting(bPCont, 'balMaxSimultCellPerPack', {type: 'inputNumber', title: 'Max Concurrent:', unit: 'Cells', ctrlInfo: 'Maximum amount of cells to be balanced at the same time'});
    new ParamSetting(bPCont, 'balLowCutoffCellVoltage', {type: 'inputNumber', title: 'Cutoff Voltage:', unit: 'mV', ctrlInfo: 'Minimum Cell Voltage limit for balancing.'});
    hh.pPanelAddDescTitle(bPCont, 'Balancing Voltage Based.');
    new ParamSetting(bPCont, 'balVBaseCellComarator', {type: 'dropDown', title: 'Voltage difference measurement:', ctrlInfo: 'method for calculating the cell voltage difference.',
        dropDownConf: {
            options: [{label: 'Use Min Cell', value: 0}, {label: 'Use Max Cell', value: 1}]
        }
    });
    new ParamSetting(bPCont, 'balVBaseRangeTop', {type: 'inputNumber', title: 'Upper cell voltage limit:', mV: ' mV', ctrlInfo: 'Upper cell voltage limit for balancing to take place.'});
    new ParamSetting(bPCont, 'balVBaseRangeBottom', {type: 'inputNumber', title: 'Lower cell voltage limit:', unit: 'mV ', ctrlInfo: 'Upper cell voltage limit for balancing to take place.'});
    new ParamSetting(bPCont, 'balVBaseMinCellVDiff', {type: 'inputNumber', title: 'Minimum cell voltage difference:', unit: 'mV ', ctrlInfo: 'Minimum cell voltage difference for balancing to take place '});
    new ParamSetting(bPCont, 'balVBaseModuleDuration', {type: 'inputNumber', title: 'balVBaseModuleDuration:', unit: 's ', ctrlInfo: ' '});
    let cPCont = acordPanel.getTabContentByName('Current Measurmnet');
    hh.pPanelAddDescTitle(cPCont, 'Current Sensor Settings.');
    new ParamSetting(cPCont, 'ina[0].shuntRes_uOhm_x10', {type: 'inputNumber', title: 'Shunt 1 Resistance:', unit: 'Ohm ', ctrlInfo: 'Resistance of shunt 1 measured in millivolts times 10 '});
    new ParamSetting(cPCont, 'ina[0].currentOffset_mA', {type: 'inputNumber', title: 'Shunt 1 Offset:', unit: 'mA ', ctrlInfo: 'Current offset to be applied '});
    new ParamSetting(cPCont, 'ina[0].shuntReversePolarity', {type: 'inputNumber', title: 'Shunt 1 Reverse Polarity:', unit: ' ', ctrlInfo: ' '});
    new ParamSetting(cPCont, 'ina[1].shuntRes_uOhm_x10', {type: 'inputNumber', title: 'Shunt 2 Resistance:', unit: 'Ohm ', ctrlInfo: 'Resistance of shunt 2 measured in millivolts times 10 '});
    new ParamSetting(cPCont, 'ina[1].currentOffset_mA', {type: 'inputNumber', title: 'Shunt 2 Offset:', unit: 'mA ', ctrlInfo: 'Current offset to be applied to measured'});
    new ParamSetting(cPCont, 'ina[1].shuntReversePolarity', {type: 'inputNumber', title: 'Shunt 2 Reverse Polarity:', unit: ' ', ctrlInfo: ' '});
    let pUCont = acordPanel.getTabContentByName('Protection Unit');
//    new ParamSetting(pUCont, 'mainContactorWeldCheckEnable', {type: 'switch', title: 'Main Contactor Weld check:', ctrlInfo: 'Some info here please MASS.'});
    new ParamSetting(pUCont, 'mainContactorWeldCheckEnable', {type: 'dropDown', title: 'Relay contacts sensor:', ctrlInfo: 'This feature allows the BMU to detect if the contacts of the main relay weld together',
        dropDownConf: {options: [{label: 'Disable', value: 0}, {label: 'Enable', value: 1}]}
    });
    new ParamSetting(pUCont, 'isolatorMonEnable', {type: 'dropDown', title: 'Isolator Monitor:', ctrlInfo: 'This function checks the status of the Isolator, when enabled it will open the main contactor if the isolator is in the off position.',
        dropDownConf: {options: [{label: 'Disable', value: 0}, {label: 'Enable', value: 1}]}
    });
    new ParamSetting(pUCont, 'measureBypassCurrentEnabled', {type: 'dropDown', title: 'Precharge relay Current Monitor:', ctrlInfo: 'Before closing main relay, the BMU will closed the precharge relay and measure the current. The current value will determine if the voltage is within range to avoid overcurrent and blowing fuses.',
        dropDownConf: {options: [{label: 'Disable', value: 0}, {label: 'Enable', value: 1}]}
    });
    new ParamSetting(pUCont, {type: 'dropDownButton', title: 'Reset Protection Unit:', ctrlInfo: 'DO NOT PRESS',
        content: [{name: 'Reset', cb: bmuH8GUI.fnCall.bind(this, 'exec_protUnitReset')}]
    });
    let ratedCont = acordPanel.getTabContentByName('Rated Values');
    new ParamSetting(ratedCont, 'ratedCapacityAh', {type: 'inputNumber', title: 'Rated Capacity:', unit: 'Ah', ctrlInfo: 'Battery Rated Capacity.'});
    new ParamSetting(ratedCont, 'ratedChargeCurrentC', {type: 'inputNumber', title: 'Rated Capacity:', unit: 'C', ctrlInfo: 'Battery Rated Charge Current.'});
    new ParamSetting(ratedCont, 'ratedDischargeCurrentC', {type: 'inputNumber', title: 'Rated Capacity:', unit: 'C', ctrlInfo: 'Battery Rated Discharge Current.'});
    new ParamSetting(ratedCont, 'ratedVoltageV', {type: 'inputNumber', title: 'Rated Voltage:', unit: 'mV', ctrlInfo: 'Battery pack rated voltage in mV.'});
    new ParamSetting(ratedCont, {instrExt: 'capacityAh', type: 'inputNumber', title: 'Actual Capacity:', unit: 'Ah', ctrlInfo: '.'});
    let chDschCont = acordPanel.getTabContentByName('Charge Discharge Control');
    hh.pPanelAddDescTitle(chDschCont, 'Voltage Control.');
    new ParamSetting(chDschCont, 'chThBeginVoltage', {type: 'inputNumber', title: 'Charge Begin Setpoint:', unit: 'mV', ctrlInfo: 'none.'});
    new ParamSetting(chDschCont, 'chThEndVoltage', {type: 'inputNumber', title: 'Charge End Setpoint:', unit: 'mV', ctrlInfo: 'none.'});
    new ParamSetting(chDschCont, 'dischThBeginVoltage', {type: 'inputNumber', title: 'Dischage Begin Setpoint:', unit: 'mV', ctrlInfo: 'none.'});
    new ParamSetting(chDschCont, 'dischThEndVoltage', {type: 'inputNumber', title: 'Discharge End Setpoint:', unit: 'mv', ctrlInfo: 'none.'});
    hh.pPanelAddDescTitle(chDschCont, 'Capacity Control.');
    new ParamSetting(chDschCont, 'chThBeginCapacity', {type: 'inputNumber', title: 'Charge Begin Setpoint:', unit: 'mAh', ctrlInfo: 'none.'});
    new ParamSetting(chDschCont, 'chThEndCapacity', {type: 'inputNumber', title: 'Charge End Setpoint:', unit: 'mAh', ctrlInfo: 'none.'});
    new ParamSetting(chDschCont, 'dischThBeginCapacity', {type: 'inputNumber', title: 'Dischage Begin Setpoint:', unit: 'mAh', ctrlInfo: 'none.'});
    new ParamSetting(chDschCont, 'dischThEndCapacity', {type: 'inputNumber', title: 'Discharge End Setpoint:', unit: 'mAh', ctrlInfo: 'none.'});
    hh.pPanelAddDescTitle(chDschCont, 'Temperature Control.');
    new ParamSetting(chDschCont, 'moduleCellTempSenssorInUse', {type: 'dropDown', title: 'Temperature Sensor In Use:', unit: '', ctrlInfo: '.',
        dropDownConf: {options: [
                {label: 'Sensor 1', value: 1},
                {label: 'Sensor2', value: 2},
                {label: 'Sensor3', value: 4},
                {label: 'Sensor 1 And 2', value: 3},
                {label: 'Sensor 1 And 3', value: 5},
                {label: 'Sensor 2 And 3', value: 6},
                {label: 'Sensor 1, 2 And 3', value: 7}
            ]}
    });
};
bmuH8GUI.initSettingsProd = function () {
    let cont = bmuH8GUI.comp.mainTabPanel.addItem({label: 'Production', id: 'production'});
    new SMDUIAccordianPanel(cont, {
        tabs: ['GENERAL PARAM', 'BMU INITIALIZATION', 'CALIBRATION'],
        selectedTab: 2,
        onInitComplete: function (el) {
            let gPCont = el.getTabContent(0);
            hh.pPanelAddDescTitle(gPCont, 'Battery Rated Param');
            new ParamSetting(gPCont, 'serialNumber', {type: 'inputText', title: 'Battery Serial Number:'});
            new ParamSetting(gPCont, 'bmuSerialNumber', {type: 'inputText', title: 'BMU Serial Number:'});
            new ParamSetting(gPCont, 'hwVer', {type: 'inputText', title: 'Hardware Version:'});
            new ParamSetting(gPCont, 'bmuManufDate', {type: 'inputNumber', title: 'BMU Manufacturing Date:'});
            new ParamSetting(gPCont, 'batteryManufDate', {type: 'inputNumber', title: 'Battery Manufacturing Date:'});
            new ParamSetting(gPCont, 'cellManufacturer', {type: 'inputText', title: 'Cell Manufacturer:'});
            new ParamSetting(gPCont, 'cellModel', {type: 'inputText', title: 'Cell Model:'});
            new ParamSetting(gPCont, 'cellChemistry', {type: 'inputText', title: 'Cell Chemistry:'});
            new ParamSetting(gPCont, 'clusterId', {type: 'inputNumber', title: 'Cluster ID:'});
            new ParamSetting(gPCont, 'clusterPosition', {type: 'inputNumber', title: 'Cluster Position:'});
            new ParamSetting(gPCont, 'opMode', {type: 'inputNumber', title: 'Operation Mode:'});
            bmuH8GUI.initSettingsProdKnownModules(el.getTabContentByName('BMU INITIALIZATION'));
            bmuH8GUI.initSettingsProdCalibration(el.getTabContentByName('CALIBRATION'));
        }
    });
};
bmuH8GUI.initSettingsProdCalibration = function (cont) {
    let dropDownOptions = [];
    for (var j = 0; j < 18; j++) {
        dropDownOptions.push({
            label: 'Module ' + ((j >> 1) + 1) + (j % 2 !== 1 ? 'A' : 'B'),
            value: j
        });
    }
    dropDownOptions.push({
        label: 'Please Select Module',
        value: -1
    });
    bmuH8GUI.initBatComp.calibSelection = new ParamSetting(cont, {
        disableControl: true,
        type: 'dropDown',
        title: 'Select Module For Calibration:',
        val: -1,
        dropDownConf: {
            options: dropDownOptions
        }
    });
    new ParamSetting(cont, {
        type: 'dropDown',
        instrExt: 'cellTempInUse',
        title: 'Cell Temperature sensor in use:',
        ctrlInfo: ' Module temeprature sensor in use.',
        dropDownConf: {options: [
                {label: 'None', value: 0},
                {label: '1', value: 0b001},
                {label: '2', value: 0b010},
                {label: '1, 2', value: 0b011},
                {label: '3', value: 0b100},
                {label: '3, 1', value: 0b101},
                {label: '3, 2', value: 0b110},
                {label: '3, 2, 1', value: 0b111}
            ]},
        extraData: {
            moduleIdx: function () {
                return bmuH8GUI.initBatComp.calibSelection.getValue();
            }
        },
        validator: function (comp, msg) {
            if (bmuH8GUI.initBatComp.calibSelection.getValue() === '-1') {
                throw new Error('Please Select Module!');
            }
        },
        onSaveSuccess: function () {
            bmuH8GUI.initBatComp.calibSelection.setValue(-1);
        }
    });

    new ParamSetting(cont, {
        type: 'inputText',
        instrExt: 'moduleSerialNumber',
        title: 'Module Serial Number:',
        ctrlInfo: ' Module serial Number will be set to both BMSs',
        extraData: {
            moduleIdx: function () {
                return bmuH8GUI.initBatComp.calibSelection.getValue() & 0xFE;
            }
        },
        validator: function (comp, msg) {
            if (bmuH8GUI.initBatComp.calibSelection.getValue() === '-1') {
                throw new Error('Please Select Module!');
            }
        },
        onSaveSuccess: function () {
            bmuH8GUI.initBatComp.calibSelection.setValue(-1);
        }
    });
    new ParamSetting(cont, {
        type: 'inputNumber',
        instrExt: 'calibrateModuleVoltage',
        title: 'Enter Cell2 Voltage Reading:',
        ctrlInfo: ' please enter cell2 Voltage Reading in mV',
        extraData: {
            cellIdx: function () {
                return bmuH8GUI.initBatComp.calibSelection.getValue();
            }
        },
        validator: function (comp, msg) {
            if (bmuH8GUI.initBatComp.calibSelection.getValue() === '-1') {
                throw new Error('Please Select Module!');
            }
            if (Math.abs(dm.selected.data.currentA) > 1) {
                throw new Error('Battery Current greater than 1A. Please disconnect when you doing calibration');
            }
        },
        onSaveSuccess: function () {
            bmuH8GUI.initBatComp.calibSelection.setValue(-1);
        }
    });
    hh.pPanelAddDescTitle(cont, 'Cell Terminal Compensation');
    new ParamSetting(cont, {
        // instrExt: 'exec_hvModuleDevHardReset',
        type: 'dropDownButton',
        title: 'Read Write All:',
        ctrlInfo: 'Read or write all terminal compensation',
        content: [
            {name: 'Read Module 1A', cb: function () {
                    wsm.sendDevMsgExecWithJsonInst(
                            {instrExt: 'bmsEx_readCellTermComp'},
                            function (msg, succ) {
//                                debugger;
                                if (Array.isArray(succ) && succ.length === 16) {
                                    bmuH8GUI.initBatComp['cellTerminalResActual_' + dm.selected.serialNumber] = succ;
                                    for (var i = 0; i < 16; i++) {
                                        bmuH8GUI.initBatComp['cellTerminalRes_cell' + (i + 1)].setValue(succ[i]);
                                    }
                                    mu.showInfoMessage("Read Complete Module 1A");
                                } else {
                                    mu.showWarningMessage('Read Return incorect. Try again');
                                }
                            },
                            function (msg, err) {
                                mu.showErrorMessage('', err);
                            });
                }
            },
            {name: 'Write All Modules', cb: function () {
                    let actArr = bmuH8GUI.initBatComp['cellTerminalResActual_' + dm.selected.serialNumber];
                    if (!Array.isArray(actArr) || actArr.length !== 16) {
                        mu.showWarningMessage('You must read all cell fisrt for ' + dm.selected.serialNumber);
                        return;
                    }
//                    debugger;
                    let dataToWrite = {};
                    for (var i = 0; i < 16; i++) {
                        let compValue = Number(bmuH8GUI.initBatComp['cellTerminalRes_cell' + (i + 1)].getValue());
                        if (compValue !== actArr[i]) {
                            dataToWrite[i] = compValue;
                        }
                    }
                    if (Object.keys(dataToWrite).length === 0) {
                        mu.showWarningMessage('No Changes Detected for ' + dm.selected.serialNumber);
                        return;
                    } else if (Object.keys(dataToWrite).length > 1) {
                        mu.showWarningMessage('Only 1 value allow per transaction. Changed [' + Object.keys(dataToWrite).length + '] Values at:' + dm.selected.serialNumber);
                        return;
                    }

                    wsm.sendDevMsgExecWithJsonInst(
                            {instrExt: 'bmsEx_writeCellTermCompAll', cellRes: dataToWrite},
                            function (msg, succ) {
                                delete  bmuH8GUI.initBatComp['cellTerminalResActual_' + dm.selected.serialNumber];
                                mu.showInfoMessage("Successfuly write Values");
                            },
                            function (msg, err) {
                                mu.showErrorMessage('', err);
                            });
                }
            }
        ]
    });
    for (var i = 1; i <= 16; i++) {
        bmuH8GUI.initBatComp['cellTerminalRes_cell' + i] = new ParamSetting(cont, {
            type: 'inputNumber',
            disableControl: true,
            title: 'Cell-' + i + ' Compensation'
        });
    }
};
bmuH8GUI.initSettingsProdKnownModules = function (cont) {

    let dropDownOptions = [];
    for (var j = 0; j < 18; j++) {
        dropDownOptions.push({
            label: 'Module ' + ((j >> 1) + 1) + (j % 2 !== 1 ? 'A' : 'B'),
            value: j
        });
    }

    for (var i = 0; i < 18; i++) {
        bmuH8GUI.initBatComp['init_modulePos' + i] = new ParamSetting(cont, 'moduleIdxMap[' + i + ']', {
            disableControl: true,
            type: 'dropDown',
            title: 'Module IDX ' + i + ' Position:',
            val: i,
            dropDownConf: {
//                useStrictCompare: true,
                options: dropDownOptions
            }
        });
    }

    window.as = new ParamSetting(cont, 'knownModuleCount', {
        type: 'inputText',
        decimals: 0, min: 0, max: 18,
        title: 'Battery Modules Count:',
        extraData: {
            modulePositionMap: function () {
                let modules = [];
                for (var i = 0; i < 18; i++) {
                    modules[i] = Number(bmuH8GUI.initBatComp['init_modulePos' + i].getValue());
                }
                return modules;
            }
        },
        validator: function (comp, msg) {
            let pos = [];
            let count = 0;
            for (var item in msg.modulePositionMap) {
                let idx = Number(msg.modulePositionMap[item]);
                if (pos.indexOf(idx) !== -1) {
                    throw new Error('Dublicate Module Index: ' + count);
                }
                count++;
                pos.push(idx);
            }
        }
    });
};
