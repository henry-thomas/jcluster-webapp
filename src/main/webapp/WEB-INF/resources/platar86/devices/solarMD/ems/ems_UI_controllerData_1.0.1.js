/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */
/* global moment, pcMan, SVG, hhContentBuilder, emsContent, hh, wsm, cont, pm, dm, mu */

var emsGuiData = {
    devPanel: {},
    devPanelContainer: {},
    flag: {},
    ren: {},
    grid: {},
    storage: {}
};
var emsGuiDataMap = {};

emsGuiData.createGridDevDataPanel = function (sn, devData) {
    console.log(devData);
    let stCont = emsGuiData.cont[sn] = hh.div(emsGuiData.cont);

    let cont = hh.createActDataPanelCard('Grid Monitor Device ' + sn, null, stCont, 'actDataContainer');
    let compCont = emsGuiData.cont[sn].comp = {};
    let  dataComp = compCont.data = {};
//    let  devDataComp = compCont.devData = {};


    dataComp.deviceConnected = hh.adf(cont, 'Status', {datamap: {'false': 'Disconnected', 'true': 'Connected'}});

    compCont.target = hh.adf(cont, 'EMS SetPoint');
    compCont.spf = hh.adf(cont, 'EMS Limits', {formatter: emsGuiDataMap.emsLimitsFormatter});

    dataComp.singlePhaseDevice = hh.adf(cont, 'Device Type', {datamap: {'false': '3Phase', 'true': '1Phase'}});
    dataComp.phaseConnectionPoint = hh.adf(cont, 'Connection', {datamap: {'10': '3Phase Connection', 'true': '1Phase'}});
    dataComp.ratedPowerW = hh.adf(cont, 'ratedPowerW', "W", {sIPrefix: ['k', 'M'], decimal: 2});
    dataComp.powerW = hh.adf(cont, 'Total Power', "W", {sIPrefix: ['k', 'M'], decimal: 2});
    hh.addHeaderTitleToPC(cont, ' ');
    dataComp.powerPha1W = hh.adf(cont, 'Phase 1', "W", {sIPrefix: ['k', 'M'], decimal: 2});
    dataComp.powerPha2W = hh.adf(cont, 'Phase 2', "W", {sIPrefix: ['k', 'M'], decimal: 2});
    dataComp.powerPha3W = hh.adf(cont, 'Phase 3', "W", {sIPrefix: ['k', 'M'], decimal: 2});
};

emsGuiData.createRenDevDataPanel = function (sn, devData) {
    console.log(devData);
    let stCont = emsGuiData.cont[sn] = hh.div(emsGuiData.cont);

    let cont = hh.createActDataPanelCard('Renewable Device ' + sn, null, stCont, 'actDataContainer');
    let compCont = emsGuiData.cont[sn].comp = {};
    let  dataComp = compCont.data = {};
//    let  devDataComp = compCont.devData = {};


    dataComp.deviceConnected = hh.adf(cont, 'Status', {datamap: {'false': 'Disconnected', 'true': 'Connected'}});

    compCont.target = hh.adf(cont, 'EMS SetPoint');
    compCont.spf = hh.adf(cont, 'EMS Limits', {formatter: emsGuiDataMap.emsLimitsFormatter});

    dataComp.singlePhaseDevice = hh.adf(cont, 'Device Type', {datamap: {'false': '3Phase', 'true': '1Phase'}});
    dataComp.phaseConnectionPoint = hh.adf(cont, 'Connection', {datamap: {'10': '3Phase Connection', 'true': '1Phase'}});
    dataComp.ratedPowerW = hh.adf(cont, 'ratedPowerW', "W", {sIPrefix: 'k', decimal: 2});
    dataComp.actualSumPowerW = hh.adf(cont, 'Total Power', "W", {sIPrefix: 'k', decimal: 2});
    dataComp.applyedSumPowerW = hh.adf(cont, 'Set Power', 'W', {sIPrefix: 'k', decimal: 2});
    compCont.powerDiff = hh.adf(cont, 'Power Diff', 'W', {sIPrefix: 'k', decimal: 2});

    hh.addHeaderTitleToPC(cont, ' ');
    dataComp.powerPha1W = hh.adf(cont, 'Phase 1', "W", {sIPrefix: 'k', decimal: 2});
    dataComp.powerPha2W = hh.adf(cont, 'Phase 2', "W", {sIPrefix: 'k', decimal: 2});
    dataComp.powerPha3W = hh.adf(cont, 'Phase 3', "W", {sIPrefix: 'k', decimal: 2});
};

emsGuiData.createStorageDevDataPanel = function (sn, devData) {
    console.log(devData);
    let dialog = new SMDUIDialog({modal: false, draggable: true});
    let stCont = emsGuiData.cont[sn] = hh.div(contDialog);
    let compCont = emsGuiData.cont[sn].comp = {};
    let  dataComp = compCont.data = {};
    emsGuiData.cont[sn].compDialog = dialog;

    let stContDialog = dialog.contentDiv;
    let contDialog = hh.createActDataPanelCard('Storage Device ' + sn + ' Detail Data', null, stContDialog, 'actDataContainer');



    let cont = hh.createActDataPanelCard('Storage Device ' + sn, null, stCont, 'actDataContainer');
//    let  devDataComp = compCont.devData = {};

    dataComp.deviceConnected = hh.adf(cont, 'Status', {datamap: {'false': 'Disconnected', 'true': 'Connected'}});
    dataComp.powerControlEnable = hh.adf(cont, 'Power Control', {datamap: {'false': 'Disabled', 'true': 'Enabled'}});
    compCont.target = hh.adf(cont, 'EMS SetPoint');
    compCont.spf = hh.adf(cont, 'EMS Limits', {formatter: emsGuiDataMap.emsLimitsFormatter});
//    devDataComp.spInUse = hh.adf(cont, 'Control In Use', {datamap: {'0': 'Unknown', '1': 'Power Setpoint', '2': 'Capacity Setpoint'}});
//    compCont.spIdx = hh.adf(cont, 'Set Point Idx', {formatter: emsGuiDataMap.setPointIdx});
    dataComp.limitFlags = hh.adf(cont, 'Device Limits', {formatter: emsGuiDataMap.storageFlagFormatter});
    compCont.spPerEnd = hh.adf(cont, 'Set Point End', {formatter: function (val) {
            if (val === -1) {
                return '---';
            }
            return mu.getTimeFromSecconds(val / 1000);
        }});

    hh.addHeaderTitleToPC(cont, ' ');
    dataComp.actualSumPowerW = hh.adf(cont, 'Actual Power', "W", {sIPrefix: ['k', 'M'], decimal: 2});
    dataComp.applyedSumPowerW = hh.adf(cont, 'Set Power', 'W', {sIPrefix: ['k', 'M'], decimal: 2});
//    dataComp.requestedSumPowerIncreaseW = hh.adf(cont, 'Requested Power', 'W', {sIPrefix: ['k', 'M'], decimal: 2});
    compCont.powerDiff = hh.adf(cont, 'Power Diff', 'W', {sIPrefix: ['k', 'M'], decimal: 2});
    hh.addHeaderTitleToPC(cont, ' ');

    dataComp.storageCapacityPer = hh.adf(cont, 'storageCapacityPer', '%', {decimal: 2});
    hh.adf(cont, ' ', {value: 'Addition Info', valueOnClick: function () {
            emsGuiData.cont[sn].compDialog.show();
        }});


//    let stContDialog = emsGuiData.cont[sn].compDialog = hh.div(emsGuiData.cont);

    hh.addHeaderTitleToPC(contDialog, "Inverter Info");
    dataComp.serialNumber = hh.adf(contDialog, 'Serial Number');
    dataComp.phaseConnectionPoint = hh.adf(contDialog, 'Grid Connection', {datamap: {'-1': 'Not Set', '1': 'Ph1', '2': 'Ph2', '3': ' Ph3', '10': '3Phase'}});
    dataComp.supInvModes = hh.adf(contDialog, 'Supported Inv Modes', {formatter: emsGuiDataMap.iversionSupportedMode});
    dataComp.actualInvMode = hh.adf(contDialog, 'Actual Inv Modes', {formatter: emsGuiDataMap.iversionSupportedMode});
//    dataComp.reqInvMode = hh.adf(contDialog, 'Requested Inv Modes', {formatter: emsGuiDataMap.iversionSupportedMode});


    hh.addHeaderTitleToPC(contDialog, "Storage Info");
    dataComp.dcBusName = hh.adf(contDialog, 'DC Bus Name');
    dataComp.storageCapacityWh = hh.adf(contDialog, 'storageCapacityWh', 'Wh', {sIPrefix: ['k', 'M'], decimal: 2});
    dataComp.storageAvailable = hh.adf(contDialog, 'storageAvailable', {datamap: {'true': 'Available', 'false': 'Not available'}});
    dataComp.storageCapacityAh = hh.adf(contDialog, 'storageCapacityAh', 'Ah', {decimal: 2});
    dataComp.storageMaxChargeCurrentA = hh.adf(contDialog, 'storageMaxChargeCurrentA', 'A', {decimal: 2});
    dataComp.storageMaxDischargeCurrentA = hh.adf(contDialog, 'storageMaxDischargeCurrentA', 'A', {decimal: 2});
    dataComp.storageRatedCapacityWh = hh.adf(contDialog, 'storageRatedCapacityWh', 'Wh', {sIPrefix: ['k', 'M'], decimal: 2});
    dataComp.storageRatedCapacityAh = hh.adf(contDialog, 'storageRatedCapacityAh', 'Ah', {decimal: 2});


};


emsGuiData.initDevUi = function (dev) {
    if (!emsGuiData.cont) {
        emsGuiData.cont = hh.div(emsContent.comp.mainTabPanel.getItemContentById('actualData'), 'smdui-emsDataWrapper');
        emsGuiData.cont.devPanel = {};
    }
//    hh.span(emsGuiData.cont, "Waiting for Data...", 'margin: auto; text-align: center; padding: 50px; font-size: large;');


    emsGuiData.flag.serialNumber = dev.serialNumber;
    emsGuiData.cont.dataPanel = emsGuiData.cont;


    let data = dm.selected.data;
    if (data) {
        for (var sn in data.devMap) {
            let devData = data.devMap[sn];
            return;
            switch (devData.devType) {
                case 1://grid
                {
                    emsGuiData.createGridDevDataPanel(sn, devData);
                    break;
                }
                case 3://Ren
                {
                    emsGuiData.createRenDevDataPanel(sn, devData);
                    break;
                }
                case 4://storage
                {
                    emsGuiData.createStorageDevDataPanel(sn, devData);
                    break;
                }
                default:
                {
                    console.warn('Unknown type[' + devData.devType + '] device ');
                }
            }
        }
    }
};

function getDevicePriorityFromSerial(data, devSn) {
    try {
        for (var priority in data.highPriorityMap) {
            let devList = data.highPriorityMap[priority].devList;
            for (var idx in devList) {
                if (devList[idx] === devSn) {
                    return priority;
                }
            }
        }
    } catch (e) {
    }
    return null;
}

emsGuiData.updateUdData = function (data) {
    try {
        let udSerial = null;
        if (data.udCtrlData) {
            udSerial = data.udCtrlData.serialNumber;
            let ud = data.devMap[udSerial];
            ud.currentUd = true;
        }


    } catch (e) {

    }
};

emsGuiData.getDeviceContainer = function (pr) {
    if (!emsGuiData.devPanelContainer[pr]) {
        let div = emsGuiData.devPanelContainer[pr] = hh.div(null, 'smdui-emsDataPriorContainer');
        div.priorty = pr;

        div.dataset.priority = pr;
        let insertBeforeChild = null;
        for (var idx = 0; idx < emsGuiData.cont.dataPanel.children.length; idx++) {

            let child = emsGuiData.cont.dataPanel.children[idx];
            if (child.dataset.priority !== undefined && Number(child.dataset.priority) < Number(pr)) {
                insertBeforeChild = child;
                break;
            }
        }

        emsGuiData.cont.dataPanel.insertBefore(div, insertBeforeChild);
    }
    return  emsGuiData.devPanelContainer[pr];
};

emsGuiData.getDevicePanel = function (sn, data) {
    if (!emsGuiData.devPanel[sn]) {
        let ddp = emsGuiData.devPanel[sn] = new DeviceDataPanel(sn, data);
        ddp.displayName = emsGuiData.getDeviceName(sn);
        ddp.addOnRemoveCb(function () {
            delete emsGuiData.devPanel[this.sn];
            this.card.parentNode.removeChild(this.card);
        });
    }
    return emsGuiData.devPanel[sn];
};

emsGuiData.getDeviceName = function (sn) {
    if (emsGuiData.emsDeviceNameMap === undefined) {
        wsm.sendDevMsgExecWithJsonInst({instrExt: 'getDeviceNameMap'},
                function (msg, data) {
                    emsGuiData.emsDeviceNameMap = data;
                    for (var sn in emsGuiData.devPanel) {
                        emsGuiData.devPanel[sn].displayName = data[sn] || sn;
                    }


                });
    } else if (emsGuiData.emsDeviceNameMap[sn]) {
        return emsGuiData.emsDeviceNameMap[sn];
    }
    return sn;
};


dm.onDataReceived(function (dev, data) {
    if (!emsGuiData.cont || emsGuiData.flag.serialNumber !== dev.serialNumber) {
        emsGuiData.initDevUi(dev);
    }
//    let priortyArr = [];
    emsGuiData.updateUdData(data);
    for (var priority in data.highPriorityMap) {
        emsGuiData.getDeviceContainer(priority);
        let devList = data.highPriorityMap[priority].devList;
        for (var idx in devList) {
            let d = data.devMap[devList[idx]];
            d.priority = priority;
//            debugger;
            if (d.ud && d.currentUd) {
                if (data.udCtrlData && data.udCtrlData.serialNumber !== d.serialNumber || (d.flag & (1 << 7)) !== 0) {
                    d.currentUd = false;
                }
            }
        }
    }

    for (var priority in data.lowPriorityMap) {
        emsGuiData.getDeviceContainer(priority);
        let devList = data.lowPriorityMap[priority].devList;
        for (var idx in devList) {
            let d = data.devMap[devList[idx]];
            d.priority = priority;
        }
    }

    window.rData = data;
    for (var sn in data.devMap) {
        let devData = data.devMap[sn];
        try {

            let devCard = emsGuiData.getDevicePanel(sn, devData);
            devCard.updateData(devData);
            let pr = devData.priority;
            if (devCard.oldPrior !== pr) {
                devCard.oldPrior = pr;
                emsGuiData.devPanelContainer[pr].appendChild(devCard.card);
            }

        } catch (e) {
        }
    }
});
dm.onSelectedStatusChange(function (dev, state) {
    if (!state) {
        for (var sn in emsGuiData.devPanel) {
            emsGuiData.devPanel[sn].connected = state;
        }
    }
});
emsGuiData.init = function () {


};
emsGuiDataMap.targetFormatter = function (devData) {
//    debugger;
    let idx = devData.pspIdx + 1;
    if (devData.pspIdx === -1) {
        idx = 'Default';
    }
    return "Power Idx:" + idx + ' ' + devData.psp + 'W';
};
emsGuiDataMap.storageTargetFormatter = function (devData) {
//    debugger;
    switch (devData.devData.spInUse) {
        case 1:
        {
            let idx = devData.pspIdx + 1;
            if (devData.pspIdx === -1) {
                idx = 'Default';
            }
            return "Power Idx:" + idx + ' ' + devData.psp + 'W';
        }
        case 2:
        {
            let idx = devData.devData.cspIdx + 1;
            if (devData.devData.cspIdx === -1) {
                idx = 'Default';
            }
            return "Capacity Idx:" + idx + ' ' + devData.devData.csp + '%';
        }
        default:
            return "Unknown Type " + devData.devData.spInUse;
    }

};
emsGuiDataMap.controlType = function (type) {
    switch (type) {
        case 1:
            return "Power";
        case 2:
            return "Capacity";
        default:
            return "Unknown Type " + type;
    }

};
emsGuiDataMap.deviceType = function (devType) {
    switch (devType) {
        case 1:
            return "Grid";
        case 2:
            return "Generator";
        case 3:
            return "Renewable";
        case 4:
            return "Storage";
        case 5:
            return "Load";
        default:
            return "Unknown Type " + devType;
    }
};
emsGuiDataMap.setPointIdx = function (idx) {
    if (isNaN(idx)) {
        return 'Unknown';
    }
    if (idx <= -1) {
        return 'Default Setpoint';
    }
    return 'Setpoint Idx: ' + (idx + 1);
};
emsGuiDataMap.iversionSupportedMode = function (mode) {
    let supMode = '';
    if (isNaN(mode) || mode === 0) {
        return 'NONE';
    }
    if ((mode & (1 << 0)) !== 0) {
        supMode += 'VF ';
    }
    if ((mode & (1 << 1)) !== 0) {
        supMode += 'PQ ';
    }
    if ((mode & (1 << 2)) !== 0) {
        supMode += 'VSG ';
    }
    return supMode;
};
emsGuiDataMap.storageFlagFormatter = function (val) {
    let flags = '';
    if ((val & (1 << 1)) !== 0) {
        flags.length ? (flags += ', ') : 1;
        flags += 'Charge Current Limit';
    }
    if ((val & (1 << 2)) !== 0) {
        flags.length ? (flags += ', ') : 1;
        flags += 'Charge Voltage Limit';
    }
    if ((val & (1 << 3)) !== 0) {
        flags.length ? (flags += ', ') : 1;
        flags += 'Charge Capacity Limit';
    }
    if ((val & (1 << 4)) !== 0) {
        flags.length ? (flags += ', ') : 1;
        flags += 'Discharge Current Limit';
    }
    if ((val & (1 << 5)) !== 0) {
        flags.length ? (flags += ', ') : 1;
        flags += 'Discharge Voltage Limit';
    }
    if ((val & (1 << 6)) !== 0) {
        flags.length ? (flags += ', ') : 1;
        flags += 'Discharge Capacity Limit';
    }

    return flags ? flags : 'None';
};
emsGuiDataMap.emsLimitsFormatter = function (val) {
    let flags = '';
    if ((val & (1 << 1)) !== 0) {
        flags.length ? (flags += ', ') : 1;
        flags += 'Power Min Limit';
    }
    if ((val & (1 << 2)) !== 0) {
        flags.length ? (flags += ', ') : 1;
        flags += 'Power Max Limit';
    }
    if ((val & (1 << 3)) !== 0) {
        flags.length ? (flags += ', ') : 1;
        flags += 'Capacity Min Limit';
    }
    if ((val & (1 << 4)) !== 0) {
        flags.length ? (flags += ', ') : 1;
        flags += 'Capacity Max Limit';
    }


    return flags ? flags : 'None';
};
emsGuiDataMap.deviceTypeFormatter = function (val) {
    switch (val) {
        case 1:
            return 'Grid Monitor';
        case 3:
            return 'Renewable Inverter';
        case 4:
            return 'Energy Storage';
        default:
            return 'Unknown DevType:' + val;
    }
};


