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
/* global bcGui, hh, wsm, bc, bcProd, dm */

bcProd.init = function () {
    bcProd.comp.progressDialog = new SMDUIDialog({
        modal: false,
        heading: ' ',
        open: false,
        draggable: true,
        onInitComplete: function (contentDiv, footerDiv, comp) {
            contentDiv.style.display = 'flex';
            contentDiv.style.flexDirection = 'row';

            bcProd.comp.progInfo = hh.div(contentDiv, 'progInfoCont');
            bcProd.comp.progStepInfo = hh.div(contentDiv, 'progStepInfoCont');

            let cancelBtn = hh.button(footerDiv, 'CANCEL');
            cancelBtn.addEventListener('click', function () {
                wsm.sendDevMsgExecWithJsonInst({instrExt: "cancel",
                    showMessage: true,
                });
            });
        }
    });

    let cont = bcGui.comp.cellTabPanel = hh.div(bcProd.comp.progInfo, 'actDataContainer');
//    let execCard = 
    let dc = bcGui.dataComp;
    pCont = hh.createActDataPanelCard('TEST STATUS', null, cont);
//
//    bcGui.dataComp.calibDevSerialNumber = hh.adf(pCont, 'Calibration BMS Serial:');
//    bcGui.dataComp.targetDevSerialNumber = hh.adf(pCont, 'Target BMS Serial:');

    hh.addHeaderTitleToPC(pCont, "TEST DATA");
    bcGui.dataComp.currentTest = hh.adf(pCont, 'Test in proggress:');
    bcGui.dataComp.paramWrite = hh.adf(pCont, 'Param Write:');
    bcGui.dataComp.cellVCalib = hh.adf(pCont, 'Cell Voltage Calibration:');
    bcGui.dataComp.canTest = hh.adf(pCont, 'COMS test:');
    bcGui.dataComp.inaTest = hh.adf(pCont, 'Current and Relay test:');
    bcGui.dataComp.balTest = hh.adf(pCont, 'Balancing test:');
    bcGui.dataComp.balTempTest = hh.adf(pCont, 'Balancing Temp Sensor test:');
    bcGui.dataComp.calibFailMessage = hh.adf(pCont, 'Message:');

//    pCont = hh.createActDataPanelCard("INFO", null, cont);
//    bcGui.calibFailMessage = hh.adf(pCont, "Status:  ");
//    bcGui.running = hh.adf(pCont, "Running:  ");
    let dPanel = bcGui.comp.mainTabPanel.getItemContentById('calData');
    cont = hh.div(dPanel, 'actDataContainer');

    if (!bcGui.dataComp.calibDevSerialNumber) {
        pCont = hh.createActDataPanelCard('GENERAL', null, cont);
        hh.adf(pCont, " ");
        bcGui.dataComp.calibDevSerialNumber = hh.adf(pCont, 'Calibration BMS Serial:');
        bcGui.dataComp.targetDevSerialNumber = hh.adf(pCont, 'Target BMS Serial:');
        new ParamSetting(pCont, {
            type: 'dropDownButton',
            title: 'Force Recalibration:',
            ctrlInfo: 'Reset BMS Prod Flags. Required to reprogram BMS.',
            content: [
                {name: 'Reset', cb: function () {
                        wsm.sendDevMsgExecWithJsonInst({instrExt: "prodEnvClearFlags",
                            showMessage: true
                        });
                    }}
            ]
        });
        bcGui.comp.genInfoCard = pCont;
    }

    dPanel = bcGui.comp.mainTabPanel.getItemContentById('actualData');
    cont = hh.div(dPanel, 'actDataContainer');

    bcProd.createMessageDialog();

    cont = hh.div(dPanel, 'actDataContainer');
    pCont = hh.createActDataPanelCard('BMS Current', null, cont);
    bcGui.dataComp.bmsCurrentA = hh.adf(pCont, 'Target/Calib BMS CurrentA:', 'A');
    bcGui.dataComp.currentDiff = hh.adf(pCont, 'Current Difference:', 'A');

    let cellVCont = bcGui.initCellVoltageTable(pCont);
    new SMDUIDockingCard(pCont);
    cellVCont.classList.remove('actDataPanelCard');

//    bcGui.dataComp.calibBmsCurrent = hh.adf(pCont, 'Calibration BMS CurrentA:');

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
};


dm.onProgressDialogCreate('balTest', function (dev, pId, dialog) {
//    debugger;
    dialog.hideDmIcon = true;


    dialog.onProgressOpen = function (dialog) {
        hh.removeAllChilds(bcProd.comp.progStepInfo);
        bcProd.comp.progStepInfo.appendChild(bcProd.dialogCont['balTest'].contentDiv);
        bcProd.comp.progressDialog.open();
    };


    bcProd.dialogCont['balTest'] = dialog;
});

dm.onProgressDialogCreate('balTempTest', function (dev, pId, dialog) {
//    debugger;

//    dialog.onProgressComplete = function (dialog) {
//        dialog.close();
//    };
    dialog.hideDmIcon = true;

    dialog.onProgressOpen = function (dialog) {
        hh.removeAllChilds(bcProd.comp.progStepInfo);
        bcProd.comp.progStepInfo.appendChild(bcProd.dialogCont['balTempTest'].contentDiv);
        bcProd.comp.progressDialog.open();
    };


    bcProd.dialogCont['balTempTest'] = dialog;
});