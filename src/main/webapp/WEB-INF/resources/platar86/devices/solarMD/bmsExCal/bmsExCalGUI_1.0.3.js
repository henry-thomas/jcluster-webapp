/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, hh, bmsexDM, socEMeter, ipUtils, wsm, mu, dm, socEMeterDataMap, bcProd */

const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
const dateFormat = "YYYY-MM-DD";

var bcGui = {
    flags: {},
    initBatComp: {},
    datamap: {},
    fwComp: {},
    idxComp: [],
    labelComp: {},
    dataComp: {},
    comp: {}
};

bcGui.initGUI = function () {
    bcGui.comp.mainTabPanel = new TabPanel(dgm.contentPanel, {
        menuItem: [
            {label: "Calibration", id: 'calData'},
            {label: "Actual Data", id: 'actualData'},
        ],
        stickyMenu: true,
        initSelect: 'calData'
    });
    try {
        bcProd.init(); //if does not contains role for JS will fail, no wories
    } catch (e) {
    }
    bcGui.initHtmlSettingsPanel();
//    bcGui.initHtmlRatedInfoPanel();
};

bcGui.initHtmlRatedInfoPanel = function () {
    let cont = hh.div(bcGui.comp.mainTabPanel.getItemContentById('actualData'), 'actDataContainer');
//    let pCont = hh.createActDataPanelCard("RATED INFORMATION", null, cont);
//    let lc = bcGui.labelComp;
//
//    lc.serialNumber = hh.adf(pCont, 'Serial Number');
//    lc.deviceName = hh.adf(pCont, 'Model');
//    lc.hwVer = hh.adf(pCont, 'Model Number');
//    lc.fwVer = hh.adf(pCont, 'Firmware Version');
//    lc.installedDate = hh.adf(pCont, 'Installation Date');


//    new SMDUIDockingCard(pCont);
//    bcGui.initCellVoltageTable(cont);
};

bcGui.initHtmlSettingsPanel = function () {
};

bcGui.initCellVoltageTable = function (cont) {
    if (!bcGui.dataComp.voltageTable) {
        let pCont = hh.createActDataPanelCard('CELL VOLTAGES', null, cont);
        let tableContent = {header: [
                {label: 'Cell', id: 'idx'},
                {label: 'Voltage', id: 'voltage'},
                {label: 'V Diff', id: 'deltaV'}
            ]
            , item: []};

        for (var i = 0; i < 16; i++) {
            tableContent.item.push([i + 1, "N/A", "N/A"]);
        }

        let table = bcGui.dataComp.voltageTable = hh.createItemTableToActDataPanelCard(tableContent, "bmsEx-cellIndoDetTb");
        table.style.textAlign = 'justify';
        pCont.appendChild(table);
        return pCont;
    }
};


bcGui.map_cmMonBalStatusToString = function (code) {
    switch (code) {
        case 0:
            return "DISABLED";
        case 1:
            return "CURRENT LIMIT";
        case 2:
            return "CUTOFF VOLTAGE LIMIT";
        case 3:
            return "TEMPERATURE LIMIT";
        case 4:
            return "ACTIVE";
        case 5:
            return "VB ACTIVE";
        case 6:
            return "VB COMPLETE";
        case 7:
            return "VB OUT_OF_RANGE";
        case 10:
            return "MB TIME ACTIVE";
        case 11:
            return "MB CAP ACTIVE";
        case 12:
            return "MB COMPLETE";
        default:
            return "UNKNOWN BALANCING STATE - " + code;
    }
};

dm.onProgressDialogCreate('balTest', function (dev, pId, dialog) {
//    debugger;
    dialog.onProgressComplete = function (dialog) {
        dialog.close();
    };

    hh.addCssToDom('width: 560px;', dialog.contentDiv);

    dialog.setBarTitle("Balancing Circuit Test.");
    hh.addHeaderTitleToPC(dialog.contentDiv, "Test State", null);
    dialog.dataContent = {};
    dialog.dataContent.statePer = hh.adf(dialog.contentDiv, 'Progress', '%');
    dialog.dataContent.msg = hh.adf(dialog.contentDiv, ' ');



    let  pCont = hh.createActDataPanelCard('Test Status', null, dialog.contentDiv);
    let tableContent = {header: [
            {label: 'Cell', id: 'idx'},
            {label: 'Status', id: 'stat', cssItem: 'text-align: center;'}
        ]
        , item: []};
    for (var i = 0; i < 16; i++) {
        tableContent.item.push([i + 1, "waiting..."]);
    }
    let table = dialog.dataContent.table = hh.createItemTableToActDataPanelCard(tableContent, null, pCont);

});

dm.onProgressDialogCreate('balTempTest', function (dev, pId, dialog) {
//    debugger;

    dialog.onProgressComplete = function (dialog) {
        dialog.close();
    };

    hh.addCssToDom('width: 560px;', dialog.contentDiv);

    dialog.setBarTitle("Balancing Circuit Test.");
    hh.addHeaderTitleToPC(dialog.contentDiv, "Test State", null);
    dialog.dataContent = {};
    dialog.dataContent.statePer = hh.adf(dialog.contentDiv, 'Progress', '%');
    dialog.dataContent.msg = hh.adf(dialog.contentDiv, ' ');



    let  pCont = hh.createActDataPanelCard('Temp Balance Test', null, dialog.contentDiv);
    let tableContent = {header: [
            {label: 'Block', id: 'idx'},
            {label: 'Status', id: 'stat', cssItem: 'text-align: center;'}
        ]
        , item: []};
    for (var i = 0; i < 4; i++) {
        tableContent.item.push([i + 1, "N/A"]);
    }
    let table = dialog.dataContent.table = hh.createItemTableToActDataPanelCard(tableContent, null, pCont);

});

dm.onProgressData('balTempTest', function (dev, prog, id) {
//    debugger;

    this.dataContent.statePer.value = prog.pState;
    this.dataContent.msg.html = prog.prop.text;
    let data = prog.prop;
    for (var i = 0; i < 4; i++) {
        this.dataContent.table.tContent[i].idx.textContent = data['state' + i] || "N/A";
        this.dataContent.table.tContent[i].stat.textContent = data['detail' + i] || "N/A";
    }
});

dm.onProgressData('balTest', function (dev, prog, id) {
//    debugger;
    this.dataContent.statePer.value = prog.pState;
    this.dataContent.msg.html = prog.prop.text;
    let data = prog.prop;
    for (var i = 0; i < 16; i++) {
        this.dataContent.table.tContent[i].idx.textContent = data['state' + i] || "N/A";
        this.dataContent.table.tContent[i].stat.textContent = data['detail' + i] || "N/A";
    }

});
