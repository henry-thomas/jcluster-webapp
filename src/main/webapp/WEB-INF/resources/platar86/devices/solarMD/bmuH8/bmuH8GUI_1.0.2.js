/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, hh, bmsexDM, bmuH8, ipUtils, wsm, mu, dm, bmuH8DataMap */


var bmuH8GUI = {
    initBatComp: {},
    dialog: {},
    fwComp: {},
    idxComp: [],
    dataComp: {
        data: {},
        cluster: {}
    },
    comp: {}
};

bmuH8GUI.initGUI = function () {
    bmuH8GUI.comp.mainTabPanel = new TabPanel(dgm.contentPanel, {
        menuItem: [
            {label: "General Info", id: 'generalInfo'},
            {label: "Actual Data", id: 'actualData'},
            {label: "Cluster Data", id: 'clusterData'}
        ],
        stickyMenu: true,
        initSelect: 'actualData',
        onInitComplete: function (tabPanel) {
            if (bmuH8GUI.comp.mainTabs === undefined) {
                bmuH8GUI.comp.mainTabs = {};
            }
            bmuH8GUI.comp.mainTabs.generalInfo = tabPanel.getItemContentById('generalInfo');
            bmuH8GUI.comp.mainTabs.actualData = tabPanel.getItemContentById('actualData');
            bmuH8GUI.comp.mainTabs.clusterData = tabPanel.getItemContentById('clusterData');
        }
    });

    bmuH8GUI.initHtmlBasicRatedInfoPanel();
    bmuH8GUI.initHtmlBasicDataPanel();
    bmuH8GUI.initHtmlClusterDataPanel();

    if (bmuH8GUI.initSettingsBasic) {
        bmuH8GUI.initSettingsBasic();
        bmuH8GUI.initSettingsNetwork();
        bmuH8GUI.initSettingsProd();
        bmuH8GUI.initSettingsDeveloper();
    }

    bmuH8GUI.initDialogs();
    if (bmuH8GUI.createModuleParamInfoTabPanel) {
        bmuH8GUI.createModuleParamInfoTabPanel(18);
    }

    if (bmuH8GUI.createModuleDataInfoTabPanel) {
        bmuH8GUI.createModuleDataInfoTabPanel(18);
    }
    if (bmuH8GUI.createPackInfoLevel1Data) {
        bmuH8GUI.createPackInfoLevel1Data(bmuH8GUI.dataComp.packInfo);
    }
};

bmuH8GUI.setModuleCount = function (cont) {
    for (var i = 0; i < 18; i++) {
        let compOb = bmuH8GUI.idxComp[i];
        for (var item in compOb) {
            if (i < cont) {
                compOb[item].style.display = 'block';
            } else {
                compOb[item].style.display = 'none';
            }
        }
    }
};

bmuH8GUI.initHtmlBasicRatedInfoPanel = function () {
    let cont = hh.div(bmuH8GUI.comp.mainTabs.generalInfo, 'actDataContainer');
//    let testSpan = hh.span(cont);
//    testSpan.style.height = '18px';
//    testSpan.textContent = 'Test span';
//    this.tooltip = new SMDUITooltipJs(testSpan, {text: 'Tooltip========='});

    let pCont = hh.createActDataPanelCard("BATTERY INFORMATION", null, cont);
//    container.appendChild(hh.addItemToActDataPanelCard({title: 'Temp Cell Input 1:', value: "N/A", valueClass: ["bmsex-ptA6"], unit: "℃"}));
    hh.addToPC(pCont, 'Battery Serial Number', ["bmuH8P-serialNumber"]);
    hh.addToPC(pCont, 'Battery Manufacturer', ["bmuH8P-batManuf"]);
    hh.addToPC(pCont, 'Battery Model', ["bmuH8P-batteryModel"]);
    hh.addToPC(pCont, 'Battery Rated Capacity', ["bmuH8P-ratedCapacityAh"]);
    hh.addToPC(pCont, 'Battery Rated Voltage', ["bmuH8P-ratedVoltageV"], "V");
    hh.addToPC(pCont, 'Battery Charging Temp', ["bmuH8P-ratedChTemp"], "℃");
    hh.addToPC(pCont, 'Battery Discharging Temp', ["bmuH8P-ratedDischTemp"], "℃");
    hh.addToPC(pCont, 'Battery Rated Charge Current', ["bmuH8P-ratedChargeCurrent"]);
    hh.addToPC(pCont, 'Battery Rated Discharge Current', ["bmuH8P-ratedDischargeCurrent"]);
    hh.addToPC(pCont, 'Battery Manufacturing Date', ["bmuH8P-batteryManufDate"]);
//    new SMDUIDockingCard(pCont);

    pCont = hh.createActDataPanelCard("CELL INFORMATION", null, cont);
    hh.addToPC(pCont, 'Cell Chemistry', ["bmuH8P-cellChemistry"]);
    hh.addToPC(pCont, 'Cell Manufacturer', ["bmuH8P-cellManufacturer"]);
    hh.addToPC(pCont, 'Cell Model', ["bmuH8P-cellModel"]);
    hh.addToPC(pCont, 'Cell in Series', ["bmuH8P-cellCount"]);
//    new SMDUIDockingCard(pCont);

    pCont = hh.createActDataPanelCard("CONTROLLER INFORMATION", null, cont);
    pCont.appendChild(hh.addItemToActDataPanelCard({title: 'BMU Series', value: "H8", type: "static"}));
    pCont.appendChild(hh.addItemToActDataPanelCard({title: 'BMU Manufacturer', value: "Solar MD (Pty) Ltd.", type: "static", link: "javascript:window.open('https://www.solarmd.com/');"}));
    pCont.appendChild(hh.addItemToActDataPanelCard({title: 'BMU Manual', value: "Download", type: "static", link: "javascript:window.open('https://www.solarmd.com/');"}));
    hh.addToPC(pCont, 'BMU Serial Number', ["bmuH8P-bmuSerialNumber"]);
    hh.addToPC(pCont, 'BMU Hardware Revision', ["bmuH8P-hwVer"]);
    hh.addToPC(pCont, 'BMU Firmware Revision', ["bmuH8P-fwVer"]);
    hh.addToPC(pCont, 'BMU Manufacturing Date:', ["bmuH8P-bmuManufDate"]);
//    hh.addToPC(pCont, 'Bootloader Revision', ["bmuH8P-blFwVer"]);

    //NETWORK
    pCont = hh.createActDataPanelCard("Network IPv4", null, cont);
    hh.addToPC(pCont, 'Address', ["bmuH8P-netIp"]);
//    hh.addToPC(pCont, 'Mask', ["bmuH8P-netMask"]);
//    hh.addToPC(pCont, 'Gateway', ["bmuH8P-netGateway"]);
    hh.addToPC(pCont, 'Hostname', ["bmuH8P-netHostName"]);
    hh.addToPC(pCont, 'MAC', ["bmuH8P-netEthMac"]);


//    new SMDUIDockingCard(pCont);

    pCont = hh.createActDataPanelCard("CLUSTER INFORMATION", null, cont);
    hh.addToPC(pCont, 'Cluster ID', ["bmuH8P-clusterId"]);
    hh.addToPC(pCont, 'Energy Storage Name', ["bmuH8P-storageName"]);
    hh.addToPC(pCont, 'Energy Storage Control Name', ["bmuH8P-busName"]);
//    new SMDUIDockingCard(pCont);

//    suiSort(cont);
};

bmuH8GUI.initHtmlClusterDataPanel = function () {
    let cont = hh.div(bmuH8GUI.comp.mainTabs.clusterData, 'actDataContainer');
    let pCont = hh.createActDataPanelCard("Cluster Status", null, cont);

    bmuH8GUI.dataComp.cluster.clusterEnabled = hh.adf(pCont, 'Cluster State:', null, {datamap: {0: 'Disable', 1: 'Enabled'}});
    bmuH8GUI.dataComp.clusComBus = hh.adf(pCont, 'CANBUS2 Port State:', null, {formatter: bmuH8DataMap.clusterComBus});
    bmuH8GUI.dataComp.clusComStat = hh.adf(pCont, 'Com State:', null, {formatter: bmuH8DataMap.clusterComStat});
    bmuH8GUI.dataComp.clusMasterSerial = hh.adf(pCont, 'Master Battery Serial:', null, {formatter: bmuH8DataMap.clusMasterSerial});
    bmuH8GUI.dataComp.clusMasterSlaveRole = hh.adf(pCont, 'Role in cluster:', null, {formatter: bmuH8DataMap.clusMasterSlaveRole});
    bmuH8GUI.dataComp.clusKnownNodes = hh.adf(pCont, 'Total Batteries:', {formatter: (data) => {
            return data + 1;
        }});
    bmuH8GUI.dataComp.cluster.onlineModuleCount = hh.adf(pCont, 'Online Batteries:');
    bmuH8GUI.dataComp.cluster.activeModuleCount = hh.adf(pCont, 'DC BUS Connected Batteries:');
    bmuH8GUI.dataComp.cluster.offlineModuleCount = hh.adf(pCont, 'Offline Batteries:');

    bmuH8GUI.dataComp.cluster.nodeInteralId = hh.adf(pCont, 'Node IDX:');
    new SMDUIDockingCard(pCont);
//
//
    pCont = hh.createActDataPanelCard("Cluster Data", null, cont);
    bmuH8GUI.dataComp.cluster.actualCurrent = hh.adf(pCont, 'Total Current:', 'A', {
        formatter(value) {
            return isNaN(value) ? value : value / 10;
        }
    });
    bmuH8GUI.dataComp.cluster.power = hh.adf(pCont, 'Total Power:', 'W', {sIPrefix: 'k', decimal: 2});
    bmuH8GUI.dataComp.cluster.actualVoltage = hh.adf(pCont, 'Average Voltage:', 'V', {
        formatter(value) {
            return isNaN(value) ? value : value / 10;
        }
    });
    bmuH8GUI.dataComp.cluster.capacityPer = hh.adf(pCont, 'Average Capacity:', '%');

    bmuH8GUI.dataComp.cluster.ratedChargeCur = hh.adf(pCont, 'Rated Charge Current:', 'A');
    bmuH8GUI.dataComp.cluster.ratedDischargeCur = hh.adf(pCont, 'Rated Discharge Current:', 'A');

    hh.addHeaderTitleToPC(pCont, "Limits");
    bmuH8GUI.dataComp.cluster.chCtrlC = hh.adf(pCont, 'Charge Control Current:');
    bmuH8GUI.dataComp.cluster.dischCtrlC = hh.adf(pCont, 'Discharge Control Current:');

    bmuH8GUI.dataComp.cluster.chCtrlV = hh.adf(pCont, 'Charge Control Voltage:');
    bmuH8GUI.dataComp.cluster.dischCtrlV = hh.adf(pCont, 'Discharge Control Voltage:');
    new SMDUIDockingCard(pCont);


    pCont = hh.createActDataPanelCard("Cluster Detail Data", null, cont);
    bmuH8GUI.dataComp.cluster.minCellVoltage = hh.adf(pCont, 'Min Cell Voltage:', 'mV');
//    bmuH8GUI.dataComp.cluster.minCellIdx = hh.adf(pCont, ' ');
    bmuH8GUI.dataComp.cluster.maxCellVoltage = hh.adf(pCont, 'Max Cell Voltage:', 'mV');

    bmuH8GUI.dataComp.cluster.cellDif = hh.adf(pCont, 'Cell Difference:', 'mV');
//    bmuH8GUI.dataComp.cluster.maxCellIdx = hh.adf(pCont, 'Max Cell Location:');

    bmuH8GUI.dataComp.cluster.minCellTemp = hh.adf(pCont, 'Min Cell Temperature:', '℃');
//    bmuH8GUI.dataComp.cluster.minCellTempIdx = hh.adf(pCont, 'Min Cell Temperature Location:');
    bmuH8GUI.dataComp.cluster.maxCellTemp = hh.adf(pCont, 'Max Cell Temperature:', '℃');

    hh.addHeaderTitleToPC(pCont, "Capacity");
    bmuH8GUI.dataComp.cluster.capacity_mAh_x10 = hh.adf(pCont, 'Actual Capacity:', 'Ah', {formatter: function (val) {
            return val / 100;
        }});

    bmuH8GUI.dataComp.cluster.totalRatedCapacityAh = hh.adf(pCont, 'Total Rated Capacity:', 'Ah');
    bmuH8GUI.dataComp.cluster.onlineRatedCapacityAh = hh.adf(pCont, 'Online Rated Capacity:', 'Ah');
    bmuH8GUI.dataComp.cluster.offlineRatedCapacityAh = hh.adf(pCont, 'Offline Rated Capacity:', 'Ah');
//    bmuH8GUI.dataComp.cluster.maxCellTempIdx = hh.adf(pCont, 'Max Cell Temperature Location:');
    new SMDUIDockingCard(pCont);


    pCont = hh.createActDataPanelCard("RS485 Data", null, cont);
    bmuH8GUI.dataComp.cluster.rs485LineStatus = hh.adf(pCont, 'RS485 Line State:');
    bmuH8GUI.dataComp.cluster.modbusSuccessCounter = hh.adf(pCont, 'Modbus Success Frames Counter:', 'Frames');
    bmuH8GUI.dataComp.cluster.modbusTimeoutCounter = hh.adf(pCont, 'Modbus Timeout Frames Counter:', 'Frames');
    bmuH8GUI.dataComp.cluster.modbusErrCounter = hh.adf(pCont, 'Modbus Error Frames Counter:', 'Frames');

    hh.addHeaderTitleToPC(pCont, "CANBUS3 Data");
    bmuH8GUI.dataComp.cluster.canState = hh.adf(pCont, 'Can State:', '', {datamap: {1: 'Disable', 2: 'Listen Only', 3: 'Enabled'}});
    bmuH8GUI.dataComp.cluster.canLineState = hh.adf(pCont, 'Line State:', '', {datamap: {0: 'Disconnected', 1: 'Connected'}});
    bmuH8GUI.dataComp.cluster.canBitrate = hh.adf(pCont, 'Bit rate:', null, {datamap: {12: '100kbps', 13: '125kbps', 14: '200kbps', 15: '250kbps', 16: '500kbps', 18: '1000kbps'}});
    bmuH8GUI.dataComp.cluster.canRxFrames = hh.adf(pCont, 'Rx Frames Counter:', 'Frames');
    bmuH8GUI.dataComp.cluster.canTxFrames = hh.adf(pCont, 'Tx Frames Counter:', 'Frames');
    new SMDUIDockingCard(pCont);
};

bmuH8GUI.initHtmlBasicDataPanel = function () {
    let cont = hh.div(bmuH8GUI.comp.mainTabs.actualData, 'actDataContainer');
//     ddToPC(pCont, '__________', ["______"], "____");
    let pCont = hh.createActDataPanelCard("Actual Values", null, cont);
    hh.addToPC(pCont, 'Battery State', ["bmuH8-mainState"]);
    hh.addToPC(pCont, 'Pack Voltag', ["bmuH8-voltageV"], "V");
    hh.addToPC(pCont, 'Current', ["bmuH8-currentA"], "A");
    hh.addToPC(pCont, 'Power', ["bmuH8-powerW"], "kW");
    hh.addToPC(pCont, 'Capacity', ["bmuH8-capacityPer"], "%");
    hh.addToPC(pCont, '', ["bmuH8-capacityAh"], "Ah");
    hh.addToPC(pCont, 'Energy', ["bmuH8-energy"], "kWh");
//    hh.addToPC(pCont, 'Complete Charge', ["bmuH8-remTime"]);

    bmuH8GUI.dataComp.remainingTimeSign = hh.adf(pCont, "Remaining Charge Time", {
        tooltip: 'This time is calculated based on average current for 1 min.',
        formatter: function (val) {
            try {
                if (Number(dm.selected.fwVer) >= 153) {
//                debugger;
                    this.setTitle(val >= 0 ? 'Remaining Charge Time' : 'Remaining Discharge Time');
                    if (Math.abs(val) < 30) {
                        val = 0;
                    }
                    return mainUtils.getTimeFromSecconds(Math.abs(val));
                }
            } catch (e) {
            }
            return 'NA';
        }});
    new SMDUIDockingCard(pCont);

    pCont = bmuH8GUI.dataComp.packInfo = hh.createActDataPanelCard("Pack Info", null, cont);
    bmuH8GUI.dataComp.chargeControl = hh.adf(pCont, 'Charge Control:', '%');
    bmuH8GUI.dataComp.dischargeControl = hh.adf(pCont, 'Discharge Control:', '%');
    hh.addToPC(pCont, 'Module Count:', ["bmuH8-moduleCount"]);
    hh.addToPC(pCont, 'Cell Count:', ["bmuH8-cellCount"]);

    new SMDUIDockingCard(pCont);

    pCont = hh.createActDataPanelCard("", null, cont);
    hh.addHeaderTitleToPC(pCont, "Protection Unit", null, cont);
    hh.addToPC(pCont, 'Isolator State', ["bmuH8-protIsolatorState"]);
    hh.addToPC(pCont, 'Main Relay State', ["bmuH8-protRelMainState"]);
//    hh.addToPC(pCont, 'Pre Charge Temp', ["bmuH8-protPreCharTemp"]);
    hh.addHeaderTitleToPC(pCont, "Balancing Information");
    hh.addToPC(pCont, 'Balancing Status', ["bmuH8-balStatus"]);
    hh.addToPC(pCont, 'Balancing Total Cells', ["bmuH8-balCellCount"]);
    hh.addHeaderTitleToPC(pCont, "Tempearture");
    hh.addToPC(pCont, 'Pre-Charge Temperature', ["bmuH8-prechargeTemp"]);
    hh.addToPC(pCont, 'BMU Internal Temp', ["bmuH8-internalTemp"]);
    new SMDUIDockingCard(pCont);
};


bmuH8GUI.transferClusterSettingsByDev = function (devArr) {
//    debugger;
    if (devArr.length > 0) {

        for (var id in devArr) {
            let serial = devArr[id].serial;
            let paramList = devArr[id].paramToChange;
            if (Object.keys(paramList).length !== 0) {
                let chained = false;
                for (var paramName in paramList) {
                    let pName = paramName;
                    let paramValue = paramList[pName];
                    if (pName === 'nodeInteralId' ||
                            (typeof (paramValue) !== 'string' && typeof (paramValue) !== 'number')) {
                        continue;
                    }
                    chained = true;
                    wsm.sendDevMsgExecWithJsonInst({
                        instrExt: 'clustParam',
                        serial: serial,
                        parrentOb: [],
                        paramLocation: [{objType: 'object', name: 'clustParam'}, {objType: 'object', name: pName}],
                        'clustParam.clusterEnabled': paramValue,
                        'value': paramValue,
                        'instrData': paramValue
                    }, function () {
                        window.setTimeout(bmuH8GUI.transferClusterSettingsByDev.bind(this, devArr), 200);
                        dm.devList[serial].param.clustParam[pName] = paramValue;
                        mu.showInfoMessage(serial + 'set ' + pName + '=' + paramValue + ' Success');
                    }, function (msg, err) {
                        window.setTimeout(bmuH8GUI.transferClusterSettingsByDev.bind(this, devArr), 200);
                        mu.showInfoMessage(serial + 'set ' + pName + ' Error: ' + err);
                    });
                    delete paramList[pName];
                    break;
                }
                if (chained) {
                    break;
                }
            }
        }

    }
};

bmuH8GUI.transferClusterSettings = function () {
    let currentDev = dm.selected;
    let param = currentDev.param.clustParam;

    let devToSetArr = [];
    for (var ser in dm.devList) {
        if (ser !== currentDev.serialNumber) {
            let obj = {serial: ser, paramToChange: {}};
            for (var paramName in param) {
                if (dm.devList[ser].param.clustParam[paramName] !== param[paramName]) {
                    obj.paramToChange[paramName] = param[paramName];
                }
            }
            devToSetArr.push(obj);
        }
    }
    bmuH8GUI.transferClusterSettingsByDev(devToSetArr);
};

bmuH8GUI.fnCall = function (execFn, successCb, errorCb) {
    console.log(execFn);
    let succCb = successCb || function (msg, data) {
        mu.showInfoMessage('Success');
    };
    let eCb = errorCb || function (msg, errMsg) {
        mu.showErrorMessage('Error', errMsg);
    };
    wsm.sendDevMsgExecWithJsonInst(
            {
                instrExt: 'execInstr',
                execFn: execFn,
                showMessage: true
            },
            succCb, eCb, eCb, 5000
            );
};
bmuH8GUI.fnCallToAll = function (execFn, list, timeout) {
    console.log(execFn);

    if (!Array.isArray(list)) {
        list = [];
        for (var sn in dm.devList) {
            if (!dm.devList[sn].selected) {
                list.push(sn);
            }
        }
    }

    if (list.length > 0) {
        let devSn = list.shift();
        wsm.sendDevMsgExecWithJsonInst({
            instrExt: 'execInstr',
            serial: devSn,
            execFn: execFn,
            showMessage: true
        }, function () {
            window.setTimeout(bmuH8GUI.fnCallToAll.bind(this, execFn, list, timeout), 200);
//            bmuH8GUI.sendInstrToAllOther(fileName, instr, list);
            mu.showInfoMessage(devSn + 'exec Success');
        }, function (msg, err) {

            mu.showErrorMessage(devSn + 'exec Fail');
            bmuH8GUI.fnCallToAll(execFn, list, timeout);
            console.log(msg, err);
        }, null, timeout);
    }
};

bmuH8GUI.updateProgBmsFw = function (dev, prog, id) {
    let moduleCount = dev.param.knownModuleCount;
    let currenModule = prog.prop.current - 0x36B;
    let modSerial = "";
    try {
        modSerial = dev.param.moduleParamList[currenModule].moduleSerialNumber;
    } catch (e) {
    }
    mainUtils.setHtmlText("bmuH8PFwBms-" + dev.serialNumber + "_current", currenModule + 1);
    mainUtils.setHtmlText("bmuH8PFwBms-" + dev.serialNumber + "_currentSer", modSerial);
    let per = 0;
    if (prog.prop.cPage > 0) {
        per = ((prog.prop.cPage / prog.prop.tPage) * 100);
    }

    let mProg = 'Page[' + prog.prop.cPage + '/' + prog.prop.tPage + '] ' + per.toFixed(1) + '%';
    mainUtils.setHtmlText("bmuH8PFwBms-" + dev.serialNumber + "_prog", mProg);
    mainUtils.setHtmlText("bmuH8PFwBms-" + dev.serialNumber + "_left", moduleCount - currenModule);
    let modPer = ((100 / moduleCount) * (currenModule)) + ((100 / moduleCount) * (per / 100));
    mainUtils.setHtmlText("bmuH8PFwBms-" + dev.serialNumber + "_tp", modPer, 1);
//    debugger;
};
bmuH8GUI.updateProgBmuFw = function (dev, prog, id) {
//    debugger;
    mainUtils.setHtmlText("bmuH8PFwBmu-" + dev.serialNumber + "_prog", prog.pState);
    mainUtils.setHtmlText("bmuH8PFwBmu-" + dev.serialNumber + "_text", prog.prop.text);
};
bmuH8GUI.initProgressDialogs = function () {
    dm.onProgressDialogCreate('Bmu-H8 Update', function (dev, pId, dialog) {
//        debugger;
        dialog.setBarTitle(dev.serialNumber + " Firmware Update Progress.");
        hh.addHeaderTitleToPC(dialog.contentDiv, "PBMU-H8 Fw upload", null);
        hh.addToPC(dialog.contentDiv, 'Progress:', ["bmuH8PFwBmu-" + dev.serialNumber + "_prog"], '%');
        hh.addToPC(dialog.contentDiv, 'current Page', ["bmuH8PFwBmu-" + dev.serialNumber + "_text"]);
    });
    dm.onProgressDialogCreate('BmsEx Fw Update', function (dev, pId, dialog) {
        dialog.dev = dev;
        dialog.setBarTitle(dev.serialNumber + " Firmware Uploading BmsEx HV Module .");
        hh.addHeaderTitleToPC(dialog.contentDiv, "Firmware Update Status", null);
        hh.addToPC(dialog.contentDiv, 'Module Idx:', ["bmuH8PFwBms-" + dev.serialNumber + "_current"]);
        hh.addToPC(dialog.contentDiv, 'Module Serial:', ["bmuH8PFwBms-" + dev.serialNumber + "_currentSer"]);
        hh.addToPC(dialog.contentDiv, 'Module Progress:', ["bmuH8PFwBms-" + dev.serialNumber + "_prog"]);
        hh.addToPC(dialog.contentDiv, 'Modules Left:', ["bmuH8PFwBms-" + dev.serialNumber + "_left"]);
        hh.addToPC(dialog.contentDiv, 'Total Progress:', ["bmuH8PFwBms-" + dev.serialNumber + "_tp"], '%');
    });
};
bmuH8GUI.onReadFirmwareBmuH8ClickDialog = function (refreshOnly) {
    wsm.sendDevMsgExecWithJsonInst({
        instrExt: 'exec_readFirmwareBmuH8'
    }, function (msg, success) {
        for (var item in success) {
            let ob = success[item];
            mu.setHtmlText("bmuH8P-" + item + '_' + "compatibleHardware", ob.compatibleHardware);
            mu.setHtmlText("bmuH8P-" + item + '_' + "date", moment(ob.date).format('YYYY MMM D hh:mm'));
            mu.setHtmlText("bmuH8P-" + item + '_' + "fwVersion", ob.fwVersion);
            mu.setHtmlText("bmuH8P-" + item + '_' + "imageBlState", ob.imageBlState);
            mu.setHtmlText("bmuH8P-" + item + '_' + "imageChecksum", ob.imageChecksum);
            mu.setHtmlText("bmuH8P-" + item + '_' + "imageLen", ob.imageLen);
            mu.setHtmlText("bmuH8P-" + item + '_' + "imageLenLoaded", ob.imageLenLoaded);
            mu.setHtmlText("bmuH8P-" + item + '_' + "imageReady", ob.imageReady);
            mu.setHtmlText("bmuH8P-" + item + '_' + "notes", ob.notes);
            if (refreshOnly !== true) {
                bmuH8GUI.dialog.fwReadData.open();
            }

            if (item === 'bmuFw') {
                let ps = bmuH8GUI.fwComp.applyFwBmuPSettings;
                ps.show();
                ps.setLabelText('BMUH8 Apply Update: ' + ob.fwVersion + ':');
                ps.setInfoText("Request Firmware Update for version [" + ob.fwVersion + '] created Date[' + moment(ob.date).format('YYYY MMM D hh:mm') +
                        ']. This will shutdown Bmu-H8 for the time firmware is verified to the main memory of the unit.');
            } else if (item === 'bmsFw') {
                let ps = bmuH8GUI.fwComp.applyFwBmsPSettings;
                ps.show();
                ps.setLabelText('BmsEx Apply Update All: ' + ob.fwVersion + ':');
                ps.setInfoText("Request Firmware Update for version [" + ob.fwVersion + '] created Date[' + moment(ob.date).format('YYYY MMM D hh:mm') +
                        ']. This will operation will force the the battery to enter Error state for the duration all BMS are updated.');
            }

        }


        let availableCnt = bmuH8GUI.dialog.fwReadDataAvailabCont;
        hh.removeAllChilds(availableCnt);
        if (typeof (success.available.bmuH8) === 'object') {
            hh.pPanelAddDescTitle(availableCnt, 'Available Updates for BMU-H8');
            for (var uId in success.available.bmuH8) {
                let update = success.available.bmuH8[uId];
                new ParamSetting(availableCnt, 'availabUpdatepCtrlBmuH8_' + uId, {
                    detached: true,
                    type: 'dropDownButton',
                    title: 'BMU-H8 Fw:' + uId,
                    ctrlInfo: 'Firmware Additional Info: ' + update.notes || "",
                    content: [{
                            name: 'Send FW ' + uId,
                            cb: function () {
                                wsm.sendDevMsgExecWithJsonInst({
                                    instrExt: 'exec_writeFirmwareBmuH8',
                                    fileName: update.fileName
                                });
                            }
                        }, {
                            name: 'Send To All Others FW ' + uId,
                            cb: bmuH8GUI.sendInstrToAllOther.bind(null, update.fileName, 'exec_writeFirmwareBmuH8')
                        }]
                });
            }

        } else {
            hh.pPanelAddDescTitle(availableCnt, 'NO Available Updates for BMU-H8 Found.');
        }



        if (typeof (success.available.bmsEx) === 'object') {
            hh.pPanelAddDescTitle(availableCnt, 'Available Updates for BMS-EX Module');
            for (var uId in success.available.bmsEx) {
                let update = success.available.bmsEx[uId];
                new ParamSetting(availableCnt, 'availabUpdatepCtrlBmsEx_' + uId, {
                    detached: true,
                    type: 'dropDownButton',
                    title: 'BMS-EX Fw:' + uId,
                    ctrlInfo: 'Firmware Additional Info: ' + update.notes || "",
                    content: [
                        {
                            name: 'Send FW ' + uId,
                            cb: function () {
                                wsm.sendDevMsgExecWithJsonInst({
                                    instrExt: 'exec_writeFirmwareBmsEx',
                                    fileName: update.fileName
                                });
                            }
                        }, {
                            name: 'Send To All Others FW ' + uId,
                            cb: bmuH8GUI.sendInstrToAllOther.bind(null, update.fileName, 'exec_writeFirmwareBmsEx')
                        }
                    ]
                });
            }

        } else {
            hh.pPanelAddDescTitle(availableCnt, 'NO Available Updates for BmsEx Found.');
        }



    }, function (msg, err) {
        debugger;
    });
};

bmuH8GUI.sendInstrToAllOther = function (fileName, instr, list, timeout) {
    if (!Array.isArray(list)) {
        list = [];
        for (var sn in dm.devList) {
            if (!dm.devList[sn].selected) {
                list.push(sn);
            }
        }
    }
//    debugger;
    if (list.length > 0) {
        let devSn = list.shift();
        wsm.sendDevMsgExecWithJsonInst({
            instrExt: instr,
            serial: devSn,
            fileName: fileName
        }, function () {
            window.setTimeout(bmuH8GUI.sendInstrToAllOther.bind(null, fileName, instr, list, timeout), 200);
//            bmuH8GUI.sendInstrToAllOther(fileName, instr, list);
            mu.showInfoMessage(devSn + 'exec Success');
        }, function (msg, err) {

            mu.showErrorMessage(devSn + 'exec Fail');
            bmuH8GUI.sendInstrToAllOther(fileName, instr, list, timeout);
            console.log(msg, err);
        }, null, timeout);
    }
};

bmuH8GUI.sendInstrToAll = function (fileName, instr, list, timeout) {
    if (!Array.isArray(list)) {
        list = [];
        for (var sn in dm.devList) {
//            if (!dm.devList[sn].selected) {
            list.push(sn);
//            }
        }
    }
//    debugger;
    if (list.length > 0) {
        let devSn = list.shift();
        wsm.sendDevMsgExecWithJsonInst({
            instrExt: instr,
            serial: devSn,
            fileName: fileName
        }, function () {
            window.setTimeout(bmuH8GUI.sendInstrToAllOther.bind(null, fileName, instr, list, timeout), 200);
//            bmuH8GUI.sendInstrToAllOther(fileName, instr, list);
            mu.showInfoMessage(devSn + 'exec Success');
        }, function (msg, err) {

            mu.showErrorMessage(devSn + 'exec Fail');
            bmuH8GUI.sendInstrToAllOther(fileName, instr, list, timeout);
            console.log(msg, err);
        }, null, timeout);
    }
};

bmuH8GUI.initDialogs = function () {
    bmuH8GUI.initProgressDialogs();
    bmuH8GUI.dialog.fwReadData = new SMDUIDialog({
        modal: false,
        heading: 'Firmware Info',
        draggable: true,
        onInitComplete: function (contentDiv, footerDiv, comp) {
            new TabPanel(contentDiv, {
                menuItem: ["BMU-H8", "BMS-EX Module", 'Available Updates'],
                initSelect: 0,
                onInitComplete: function (tabPanel) {
                    contentDiv.style.padding = '0px';
                    for (var i = 0; i < 2; i++) {

                        let tabContent = tabPanel.getItemContent(i);
                        let cont = document.createElement('div');
                        cont.classList.add('actDataContainer');
                        cont.style.width = '280px';
                        tabContent.appendChild(cont);
                        let prefix = i === 0 ? 'bmuFw' : 'bmsFw';
                        let pCont = hh.createActDataPanelCard(i === 0 ? "BMU-H8 FIRMWARE INFO" : "BMS-EX FIRMWARE INFO", null, cont);
                        hh.addToPC(pCont, 'Compatible Hardware', ["bmuH8P-" + prefix + "_compatibleHardware"]);
                        hh.addToPC(pCont, 'Create Date', ["bmuH8P-" + prefix + "_date"]);
                        hh.addToPC(pCont, 'Firmware Version', ["bmuH8P-" + prefix + "_fwVersion"]);
                        hh.addToPC(pCont, 'Bootloader State', ["bmuH8P-" + prefix + "_imageBlState"]);
                        hh.addToPC(pCont, 'Checksum', ["bmuH8P-" + prefix + "_imageChecksum"]);
                        hh.addToPC(pCont, 'Image Len', ["bmuH8P-" + prefix + "_imageLen"]);
                        hh.addToPC(pCont, 'Image Len Loaded', ["bmuH8P-" + prefix + "_imageLenLoaded"]);
                        hh.addToPC(pCont, 'Ready', ["bmuH8P-" + prefix + "_imageReady"]);
                        hh.addToPC(pCont, 'Notes', ["bmuH8P-" + prefix + "_notes"]);
                    }

                    let tabContent = tabPanel.getItemContent(2);
                    let availabCont = document.createElement('div');
                    bmuH8GUI.dialog.fwReadDataAvailabCont = availabCont;
                    tabContent.appendChild(availabCont);
                }
            });
        }
    });
};

