/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, hh, bmsexDM, bmuH8, ipUtils, wsm, mu, dm, bmuH8GUI */

window.level1 = true;

bmuH8GUI.createPackInfoLevel1Data = function (cont) {
    hh.addToPC(cont, 'Min Cell:', ["bmuH8-minCell"]);
    hh.addToPC(cont, 'Max Cell:', ["bmuH8-maxCell"]);
    hh.addToPC(cont, 'Cell voltage difference:', ["bmuH8-cellVoltageDiff"], "mV");

    bmuH8GUI.dataComp.data.uptime = hh.adf(cont, 'Uptime:', null, {formatter: mu.getTimeFromSecconds});

    bmuH8GUI.dataComp.data.minCellTemp = hh.adf(cont, 'Min Cell Temperature:', "℃");
    bmuH8GUI.dataComp.data.maxCellTemp = hh.adf(cont, 'Max Cell Temperature:', "℃");
};

bmuH8GUI.createModuleDataInfoTabPanel = function (moduleCount) {
    let items = [];
    for (var i = 0; i < moduleCount / 2; i++) {
        items.push({
            label: "Module " + (i + 1),
//            label: "Module " + ((i >> 1) + 1) + ((i & 0x01) === 0 ? "A" : "B"),
            contentId: i.toString()
        });
    }

    let container = hh.div(bmuH8GUI.comp.mainTabs.actualData, 'actDataContainer');
    bmuH8.moduleDataInfoTabPannel = new TabPanel(container, {
        initSelect: bmuH8.moduleParamInfoTabSelected,
        menuItem: items,
        onTabChange: function (tabName, content) {
            bmuH8.moduleDataInfoTabSelected = tabName;
            // console.log("bmu ParamInfo Tab selected change: ", bmuH8.moduleParamInfoTabSelected);
        },
        onInitComplete: function (tabPanel) {
            //console.log("bmu ParamInfo Tab init complete ");
            //populate each panel
            for (var i = 0; i < (moduleCount / 2); i++) {
                let fPanel = tabPanel.getItemContent(i.toString());
                fPanel.classList.add('actDataContainer');
                //create 2 panels per module for A and B
                for (var j = 0; j < 2; j++) {
                    let moduleIdx = (i * 2) + j;
                    let  label = "Module " + ((moduleIdx >> 1) + 1) + ((moduleIdx & 0x01) === 0 ? "A" : "B");
                    let pCont = hh.createActDataPanelCard(label, null, fPanel);
                    new SMDUIDockingCard(pCont);
                    hh.addToPC(pCont, 'Min cell voltage value:', ["bmsex-minCellV" + moduleIdx]);
                    hh.addToPC(pCont, 'Max cell voltage value:', ["bmsex-maxCellV" + moduleIdx]);
                    hh.addToPC(pCont, 'Cell voltage difference:', ["bmsex-cellVoltageDiff" + moduleIdx], "mV");
                    hh.addToPC(pCont, 'Pack voltage:', ["bmsex-packVoltage" + moduleIdx], "V");
                    hh.addToPC(pCont, 'Module Temperature:', ["bmsex-minPackTemp" + moduleIdx], "℃");
//                    hh.addToPC(pCont, 'Max Temperature:', ["bmsex-maxPackTemp" + moduleIdx], "℃");
                    hh.addHeaderTitleToPC(pCont, "Balancing Information");
                    hh.addToPC(pCont, 'Balancing Status', ["bmsex-balancingStatus" + moduleIdx]);
                    hh.addHeaderTitleToPC(pCont, "CellInfo");
                    //create Cell info pannel 
                    //cellInfoContainer.style.maxHeight = '600px';
                    let tableContent = {header: [
                            ' ',
                            {label: 'V', columClass: "v" + moduleIdx},
                            {label: 'ΔV Mod', columClass: "dv" + moduleIdx},
                            {label: 'ΔV Pack', columClass: "dvp" + moduleIdx},
                            {label: 'Bal', columClass: "bal" + moduleIdx}
                        ], item: []};
                    for (var k = 0; k < 16; k++) {
                        tableContent.item.push([k + 1, "N/A", "N/A", "N/A", "N/A"]);
                    }

                    pCont.appendChild(hh.createItemTableToActDataPanelCard(tableContent, "bmu-actDataModule"));
                    if (bmuH8GUI.idxComp[moduleIdx] === undefined) {
                        bmuH8GUI.idxComp[moduleIdx] = {};
                    }
                    bmuH8GUI.idxComp[moduleIdx].dataPanel = pCont;
                }
            }
        }
    });

    let fPanel = bmuH8.moduleParamInfoTabPannel.contentPanelFooter;
};

bmuH8GUI.createModuleParamInfoTabPanel = function (moduleCount) {
    let items = [];
    for (var i = 0; i < moduleCount / 2; i++) {
        items.push({
            label: "Module " + (i + 1),
//            label: "Module " + ((i >> 1) + 1) + ((i & 0x01) === 0 ? "A" : "B"),
            contentId: i.toString()
        });
    }
    let container = hh.div(bmuH8GUI.comp.mainTabs.generalInfo, 'generalInfo');
    bmuH8.moduleParamInfoTabPannel = new TabPanel(container, {
        initSelect: bmuH8.moduleParamInfoTabSelected,
        menuItem: items,
        onTabChange: function (tabName, content) {
            bmuH8.moduleParamInfoTabSelected = tabName;
            // console.log("bmu ParamInfo Tab selected change: ", bmuH8.moduleParamInfoTabSelected);
        },
        onInitComplete: function (tabPanel) {
            //console.log("bmu ParamInfo Tab init complete ");
            //populate each panel
            for (var i = 0; i < (moduleCount / 2); i++) {
                let fPanel = tabPanel.getItemContent(i.toString());
                fPanel.classList.add('actDataContainer');
                //create 2 panels per module for A and B
                for (var j = 0; j < 2; j++) {
                    let moduleIdx = (i * 2) + j;
                    let  label = "Module " + ((moduleIdx >> 1) + 1) + ((moduleIdx & 0x01) === 0 ? "A" : "B");
                    let pCont = hh.createActDataPanelCard(label, null, fPanel);
                    hh.addToPC(pCont, 'Bms Serial Number:', ["bmuH8-mp" + moduleIdx + "-boardSerialNumber"]);
                    hh.addToPC(pCont, 'Bms Production Date:', ["bmuH8-mp" + moduleIdx + "-boardManufDate"]);
                    hh.addToPC(pCont, 'Cell Count:', ["bmuH8-mp" + moduleIdx + "-cellCount"]);
                    hh.addToPC(pCont, 'BMS Firmware Ver:', ["bmuH8-mp" + moduleIdx + "-fwVer"]);
                    hh.addToPC(pCont, 'BMS Hardware Ver:', ["bmuH8-mp" + moduleIdx + "-hwVer"]);
                    hh.addToPC(pCont, 'Module Serial Number:', ["bmuH8-mp" + moduleIdx + "-moduleSerialNumber"]);
                    hh.addToPC(pCont, 'SMDCAN ID:', ["bmuH8-mp" + moduleIdx + "-smdCanId"]);
                    if (bmuH8GUI.idxComp[moduleIdx] === undefined) {
                        bmuH8GUI.idxComp[moduleIdx] = {};
                    }
                    bmuH8GUI.idxComp[moduleIdx].ratedParam = pCont;
                }
            }
        }
    });
    let fPanel = bmuH8.moduleParamInfoTabPannel.contentPanelFooter;
//    let pCont = hh.createActDataPanelCard("Actual Values", null, fPanel);
//    hh.addToPC(pCont, 'Battery State', ["bmuH8-mainStasdfate"]);
};
