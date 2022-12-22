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
/* global bcGui, hh, wsm, bc */

bcGui.initHtmlActualDataPanel = function () {
//    bcGui.comp.mainTabPanel.addItem({label: "Actual Data", id: 'actualData', index: 0});

    let cont = bcGui.comp.cellTabPanel = hh.div(bcGui.comp.mainTabPanel.getItemContentById('calData'), 'actDataContainer');
    let dc = bcGui.dataComp;
    if (!bcGui.dataComp.calibDevSerialNumber) {
        pCont = hh.createActDataPanelCard('GENERAL', null, cont);
        bcGui.dataComp.calibDevSerialNumber = hh.adf(pCont, 'Calibration BMS Serial:');
        bcGui.dataComp.targetDevSerialNumber = hh.adf(pCont, 'Target BMS Serial:');

        hh.addHeaderTitleToPC(pCont, "TEST DATA");
    } else {
        pCont = hh.createActDataPanelCard('TEST DATA', null, cont);

    }



//    hh.addHeaderTitleToPC(pCont, "TEST DATA");
    bcGui.dataComp.currentTest = hh.adf(pCont, 'Test in proggress:');
    bcGui.dataComp.cellVCalib = hh.adf(pCont, 'Cell Voltage Calibration:');
    bcGui.dataComp.balTest = hh.adf(pCont, 'Balancing test:');
    bcGui.dataComp.balTempTest = hh.adf(pCont, 'Balancing Temp Sensor test:');
    bcGui.dataComp.extTempTest = hh.adf(pCont, 'External Temp Sensor test:');
    bcGui.dataComp.canTest = hh.adf(pCont, 'CANBUS2 test:');
    bcGui.dataComp.rs485Test = hh.adf(pCont, 'RS485 test:');
    bcGui.dataComp.inaTest = hh.adf(pCont, 'Current measurement test:');

    hh.addHeaderTitleToPC(pCont, "Balancing info: ");
    bcGui.dataComp.tagetBmsBalancingStatus = hh.adf(pCont, 'Target BMS Serial:');

    bcGui.initCellVoltageTable(cont);

//    pCont = hh.createActDataPanelCard('CELL VOLTAGES', null, cont);
//    let tableContent = {header: [
//            {label: 'Cell', id: 'idx'},
//            {label: 'Voltage', id: 'voltage'},
//            {label: 'ΔV', id: 'deltaV'}
//        ]
//        , item: []};
//    for (var i = 0; i < 16; i++) {
//        tableContent.item.push([i + 1, "N/A", "N/A", "N/A"]);
//    }
//
//    let table = bcGui.dataComp.voltageTable = hh.createItemTableToActDataPanelCard(tableContent, "bmsEx-cellIndoDetTb");
//    pCont.appendChild(table);

    new ParamSetting(cont, {
        type: 'dropDownButton',
        title: 'Test Target Unit:',
        ctrlInfo: 'no info. ',
        content: [
            {name: 'Test Balancing', cb: function () {
                    wsm.sendDevMsgExecWithJsonInst(
                            {instrExt: 'testBalancing', showMessage: true}
                    );
                }},
            {name: 'Test Balancing Temperature', cb: function () {
                    wsm.sendDevMsgExecWithJsonInst(
                            {instrExt: 'testBalancingTemp', showMessage: true}
                    );
                }},
            {name: 'Calibrate Voltage', cb: function () {
                    wsm.sendDevMsgExecWithJsonInst(
                            {instrExt: 'calibrateVoltage', showMessage: true}
                    );
                }},
            {name: 'Test CAN iFace', cb: function () {
                    wsm.sendDevMsgExecWithJsonInst(
                            {instrExt: 'canEnvTest', showMessage: true}
                    );
                }}
//            {name: 'Test Relay and Current Sensor', cb: function () {
//                    wsm.sendDevMsgExecWithJsonInst(
//                            {instrExt: 'relayCurrentTest', showMessage: true, maxIdleCurr: 0.1,
//                                maxCurrDiff: 0.1}
//                    );
//                }}
//            {name: 'Load BMS Params', cb: function () {
//                    wsm.sendDevMsgExecWithJsonInst(
//                            {instrExt: 'loadModelParamMap', showMessage: true}
//                    );
//                }},
        ]
    });

};

//dm.onProgressDialogCreate('balTest', function (dev, pId, dialog) {
////    debugger;
//    dialog.onProgressComplete = function (dialog) {
//        dialog.close();
//    };
//
//    hh.addCssToDom('width: 560px;', dialog.contentDiv);
//
//    dialog.setBarTitle("Balancing Circuit Test.");
//    hh.addHeaderTitleToPC(dialog.contentDiv, "Test State", null);
//    dialog.dataContent = {};
//    dialog.dataContent.statePer = hh.adf(dialog.contentDiv, 'Progress', '%');
//    dialog.dataContent.msg = hh.adf(dialog.contentDiv, ' ');
//
//
//
//    let  pCont = hh.createActDataPanelCard('Test Status', null, dialog.contentDiv);
//    let tableContent = {header: [
//            {label: 'Cell', id: 'idx'},
//            {label: 'Status', id: 'stat', cssItem: 'text-align: center;'}
//        ]
//        , item: []};
//    for (var i = 0; i < 16; i++) {
//        tableContent.item.push([i + 1, "waiting..."]);
//    }
//    let table = dialog.dataContent.table = hh.createItemTableToActDataPanelCard(tableContent, null, pCont);
//
//});
//
//dm.onProgressDialogCreate('balTempTest', function (dev, pId, dialog) {
////    debugger;
//
//    dialog.onProgressComplete = function (dialog) {
//        dialog.close();
//    };
//
//    hh.addCssToDom('width: 560px;', dialog.contentDiv);
//
//    dialog.setBarTitle("Balancing Circuit Test.");
//    hh.addHeaderTitleToPC(dialog.contentDiv, "Test State", null);
//    dialog.dataContent = {};
//    dialog.dataContent.statePer = hh.adf(dialog.contentDiv, 'Progress', '%');
//    dialog.dataContent.msg = hh.adf(dialog.contentDiv, ' ');
//
//
//
//    let  pCont = hh.createActDataPanelCard('Temp Balance Test', null, dialog.contentDiv);
//    let tableContent = {header: [
//            {label: 'Block', id: 'idx'},
//            {label: 'Status', id: 'stat', cssItem: 'text-align: center;'}
//        ]
//        , item: []};
//    for (var i = 0; i < 4; i++) {
//        tableContent.item.push([i + 1, "N/A"]);
//    }
//    let table = dialog.dataContent.table = hh.createItemTableToActDataPanelCard(tableContent, null, pCont);
//
//});

$(document).ready(function () {
    bcGui.initHtmlActualDataPanel();
})