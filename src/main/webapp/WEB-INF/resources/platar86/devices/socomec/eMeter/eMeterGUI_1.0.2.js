/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, hh, bmsexDM, socEMeter, ipUtils, wsm, mu, dm, socEMeterDataMap */

//const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
//const dateFormat = "YYYY-MM-DD";
//
//var socEMeterGui = {
//    initBatComp: {},
//    datamap: {},
//    fwComp: {},
//    idxComp: [],
//    labelComp: {},
//    dcComp: {},
//    dataComp: {
//        pvPower: {},
//        mpptData: {}
//    },
//    comp: {}
//};
//
//socEMeterGui.initGUI = function () {
//    socEMeterGui.comp.mainTabPanel = new TabPanel(dgm.contentPanel, {
//        menuItem: [
////            {label: "Rated Info", id: 'ratedInfo'},
//            {label: "Actual Data", id: 'actualData'},
//            {label: "Settings", id: 'settings'}
//        ],
//        stickyMenu: true,
//        initSelect: 'actualData'
//    });
//
//    socEMeterGui.initHtmlRatedInfoPanel();
//    socEMeterGui.initHtmlActualDataPanel();
////    socEMeterGui.initHtmlSettingsPanel();
//};
//
//
//socEMeterGui.initHtmlRatedInfoPanel = function () {
//    let cont = hh.div(socEMeterGui.comp.mainTabPanel.getItemContentById('actualData'), 'actDataContainer');
//    let pCont = hh.createActDataPanelCard("RATED INFORMATION", null, cont);
//    let lc = socEMeterGui.labelComp;
//
//    lc.serialNumber = hh.adf(pCont, 'Serial Number');
//    lc.deviceName = hh.adf(pCont, 'Model');
//    lc.hwVer = hh.adf(pCont, 'Model Number');
//    lc.fwVer = hh.adf(pCont, 'Firmware Version');
//    lc.installedDate = hh.adf(pCont, 'Installation Date');
//
//    hh.addHeaderTitleToPC(pCont, 'COMS');
//    lc.comPort = hh.adf(pCont, 'Interface');
//    lc.modbusAddress = hh.adf(pCont, 'Modbus Address');
//
////    new SMDUIDockingCard(pCont);
//};
//
//
//
//socEMeterGui.initHtmlActualDataPanel = function () {
//    let cont = hh.div(socEMeterGui.comp.mainTabPanel.getItemContentById('actualData'), 'actDataContainer');
//    let dc = socEMeterGui.dataComp;
//
//
//    pCont = hh.createActDataPanelCard('GENERAL', null, cont);
//    dc.activePower_W = hh.adf(pCont, 'Total Active Power:', 'W', {sIPrefix: 'k', decimal: 2});
//    dc.apparentPower_VA = hh.adf(pCont, 'Total Apparent Power:', 'VA', {sIPrefix: 'k', decimal: 2});
//    dc.reactivePower_VAR = hh.adf(pCont, 'Total Reactive Power:', 'VAR', {sIPrefix: 'k', decimal: 2});
//
//
//    pCont = hh.createActDataPanelCard('VOLTAGE', null, cont);
//    dc.phaVoltage1_V = hh.adf(pCont, 'Phase A-N:', 'V', {decimal: 1});
//    dc.phaVoltage2_V = hh.adf(pCont, 'Phase B-N:', 'V', {decimal: 1});
//    dc.phaVoltage3_V = hh.adf(pCont, 'Phase C-N:', 'V', {decimal: 1});
//    dc.phaVoltage12_V = hh.adf(pCont, 'Phase A-B:', 'V', {decimal: 1});
//    dc.phaVoltage23_V = hh.adf(pCont, 'Phase B-C:', 'V', {decimal: 1});
//    dc.phaVoltage31_V = hh.adf(pCont, 'Phase C-A:', 'V', {decimal: 1});
//    new SMDUIDockingCard(pCont);
//
//    pCont = hh.createActDataPanelCard('CURRENT', null, cont);
//    dc.phaCurrent1_A = hh.adf(pCont, 'Phase A:', 'A', {decimal: 2});
//    dc.phaCurrent2_A = hh.adf(pCont, 'Phase B:', 'A', {decimal: 2});
//    dc.phaCurrent3_A = hh.adf(pCont, 'Phase C:', 'A', {decimal: 2});
//    dc.neutralCurrent_A = hh.adf(pCont, 'Neutral:', 'A', {decimal: 2});
//    new SMDUIDockingCard(pCont);
//
//    pCont = hh.createActDataPanelCard('POWER QUALITY', null, cont);
//
//
//
//    dc.pf = hh.adf(pCont, 'Power Factor:', 'cosF', {decimal: 3});
//
//    hh.addHeaderTitleToPC(pCont, 'PHASE 1');
//    dc.activePowerPha1_W = hh.adf(pCont, 'Active Power Phase 1:', 'W', {sIPrefix: 'k', decimal: 1});
//    dc.apparentPowerPha1_VA = hh.adf(pCont, 'Apparent Power Phase 1:', 'VA', {sIPrefix: 'k', decimal: 1});
//    dc.reactivePowerPha1_VAR = hh.adf(pCont, 'Reactive Power Phase 1:', 'VAR', {sIPrefix: 'k', decimal: 1});
//    dc.pfPha1 = hh.adf(pCont, 'Power Factor Phase 1:', 'cosF', {decimal: 3});
//
//    hh.addHeaderTitleToPC(pCont, 'PHASE 2');
//    dc.activePowerPha2_W = hh.adf(pCont, 'Active Power Phase 2:', 'W', {sIPrefix: 'k', decimal: 1});
//    dc.apparentPowerPha2_VA = hh.adf(pCont, 'Apparent Power Phase 2:', 'VA', {sIPrefix: 'k', decimal: 1});
//    dc.reactivePowerPha2_VAR = hh.adf(pCont, 'Reactive Power Phase 2:', 'VAR', {sIPrefix: 'k', decimal: 1});
//    dc.pfPha2 = hh.adf(pCont, 'Power Factor Phase 2:', 'cosF', {decimal: 3});
//
//    hh.addHeaderTitleToPC(pCont, 'PHASE 3');
//    dc.activePowerPha3_W = hh.adf(pCont, 'Active Power Phase 3:', 'W', {sIPrefix: 'k', decimal: 1});
//    dc.apparentPowerPha3_VA = hh.adf(pCont, 'Apparent Power Phase 3:', 'VA', {sIPrefix: 'k', decimal: 1});
//    dc.reactivePowerPha3_VAR = hh.adf(pCont, 'Reactive Power Phase 3:', 'VAR', {sIPrefix: 'k', decimal: 1});
//    dc.pfPha3 = hh.adf(pCont, 'Power Factor Phase 3:', 'cosF', {decimal: 3});
//
//    new SMDUIDockingCard(pCont);
//
//    pCont = hh.createActDataPanelCard('ENERGY', null, cont);
//    dc.totalActiveEnergyExport_Wh = hh.adf(pCont, 'Active Energyy Export:', 'Wh', {sIPrefix: ['k', 'M'], decimal: 1});
//    dc.totalActiveEnergyImport_Wh = hh.adf(pCont, 'Active Energyy Import:', 'Wh', {sIPrefix: ['k', 'M'], decimal: 1});
//
//    dc.totalReactiveEnergyExport_VARh = hh.adf(pCont, 'Reactive Energyy Export:', 'Wh', {sIPrefix: ['k', 'M'], decimal: 1});
//    dc.totalReactiveEnergyImport_VARh = hh.adf(pCont, 'Reactive Energyy Import:', 'Wh', {sIPrefix: ['k', 'M'], decimal: 1});
//
//};
//
//socEMeterGui.initHtmlSettingsPanel = function () {
//    let container = hh.div(socEMeterGui.comp.mainTabPanel.getItemContentById('settings'));
//    let acordPanel = socEMeterGui.comp.settingsAccordionPanel = new SMDUIAccordianPanel(container, {tabs: [
//            {label: 'Basic', id: 'basic'}
//        ], selectedTab: 'basic'});
//
//
//    let cont = acordPanel.getTabContentById('basic');
////    new ParamSetting(cont, {
////        type: 'dropDownButton',
////        title: 'Control:',
////        ctrlInfo: 'Turn inverter On or Off. ',
////        content: [
////            {name: 'ON', cb: function () {
////                    wsm.sendDevMsgExecWithJsonInst(
////                            {instrExt: 'turnOn', showMessage: true}
////                    );
////                }},
////            {name: 'OFF', cb: function () {
////                    wsm.sendDevMsgExecWithJsonInst(
////                            {instrExt: 'turnOff', showMessage: true}
////                    );
////                }}
////        ]
////    });
//
////    new ParamSetting(cont, 'powerLimit', {type: 'inputNumber', title: 'Power Limit:', unit: 'W', ctrlInfo: '.'});
////    new ParamSetting(cont, 'activePowerChangeGradient', {type: 'inputNumber', title: 'Active Power Change Gradient', unit: '%/s', ctrlInfo: '.'});
////    new ParamSetting(cont, 'reactivePowerChangeGradient', {type: 'inputNumber', title: 'Reactive Power Change Gradient', unit: '%/s', ctrlInfo: '.'});
////    new ParamSetting(cont, 'scheduleInstValidDuration', {type: 'inputNumber', title: 'Schedule Valud Duration', unit: 's', ctrlInfo: '.'});
//
//};

(function (root) {
    function EMeterGui() {
        this.emTemplate = new Em3PhGuiTemplate()
        init.call(this);
    }

    function init() {

        hh.addHeaderTitleToPC(this.emTemplate.sumCard, "Energy Counters");
        this.emTemplate.sumCard.energyImport = hh.adf(this.emTemplate.sumCard, "Energy Import", "Wh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.sumCard.energyExport = hh.adf(this.emTemplate.sumCard, "Energy Export", "Wh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.sumCard.apparentEnergyImport = hh.adf(this.emTemplate.sumCard, "Apparent Energy Import", "VAh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.sumCard.apparentEnergyExport = hh.adf(this.emTemplate.sumCard, "Apparent Energy Export", "VAh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.sumCard.reactiveEnergyImport = hh.adf(this.emTemplate.sumCard, "Reactive Energy Import", "VARh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.sumCard.reactiveEnergyExport = hh.adf(this.emTemplate.sumCard, "Reactive Energy Export", "VARh", {decimal: 2, sIPrefix: ['k']});

        devManager.onSelectedDataReceived(updateData.bind(this));
    }

    function updateData(dev, data) {
        let exp = data.sumExportPower;
        let imp = data.sumImportPower;
        this.emTemplate.sumCard.energyImport.value = imp.energyWh;
        this.emTemplate.sumCard.energyExport.value = exp.energyWh;
        this.emTemplate.sumCard.reactiveEnergyImport.value = imp.reactiveEnergyVARh;
        this.emTemplate.sumCard.reactiveEnergyExport.value = exp.reactiveEnergyVARh;
        this.emTemplate.sumCard.apparentEnergyImport.value = imp.apparentEnergyVAh;
        this.emTemplate.sumCard.apparentEnergyExport.value = exp.apparentEnergyVAh;
    }

    $(document).ready(function () {
        root.eMeterGUI = new EMeterGui();
    });
}(window));




