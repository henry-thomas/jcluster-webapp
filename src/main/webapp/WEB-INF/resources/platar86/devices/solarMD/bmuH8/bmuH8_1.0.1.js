/* global logCon, PF, mainUtils, moment, dm, bmsRelay, hh, bmsexDM, bmuH8GUI, bmuH8DataMap, pm */

var bmuH8 = {
    devData: {},
    warnErrDialogSerial: false,
    colorPickerInit: false,
    capacityAhParamInit: false,
    moduleParamInfoTabPannel: null,
    moduleDataInfoTabPannel: null,
    moduleParamInfoTabSelected: 0,
    moduleDataInfoTabSelected: 0,
    dataContent: {}
};

bmuH8.init = function () {
    bmuH8GUI.initGUI();
};

bmuH8.getClusterIdxName = function (idx) {
    return "Cell:" + ((idx & 0x0f) + 1)
            + " @ Module:" + ((idx >> 5) + 1)
            + ((idx >> 4) & 0x01 ? "B" : "A");
};

bmuH8.getClusterUnitIdxName = function (unitIdx) {
    let module = dm.selected.label;
    if (unitIdx < 32) {
        try {
            if (dm.selected.param.clustParam.cludNodesSerialArr[unitIdx] !== '0') {
                let bmuSer = dm.selected.param.clustParam.cludNodesSerialArr[unitIdx];
                module = 'SMDH8' + dm.selected.param.clustParam.cludNodesSerialArr[unitIdx];
                for (var i = bmuSer.length; i < 10; i++) {
                    bmuSer = bmuSer + "0";
                }
                bmuSer = 'SMDH8' + bmuSer;
                if (dm.devList[bmuSer]) {
                    module = dm.devList[bmuSer].label;
                }

            } else {
                module = 'Unknown Node Idx: ' + unitIdx;
            }
        } catch (e) {
            module = 'Unknown Node Idx: ' + unitIdx;
        }
    }
    return  module;
};

bmuH8.getModuleName = function (val, idx) {
    return val.toFixed(3) + "mV @ Module:" + ((idx >> 5) + 1)
            + (((idx >> 4) & 0x01) === 1 ? "B" : "A")
            + " Cell:" + ((idx & 0x0F) + 1);
};

bmuH8.updateModuleData = function (dev, idx, data) {
    try {
        let cellCount = dev.param.moduleParamList[idx].cellCount;

        let packVoltage = 0;
        let minCelVal = 65000;
        let minCelNum = 0;
        let maxCelVal = 0;
        let maxCelNum = 0;

        for (var i = 0; i < cellCount; i++) {
            let val = data.cellVoltageArr[i];
            packVoltage += val;
            if (val < minCelVal) {
                minCelVal = val;
                minCelNum = i;
            }
            if (val > maxCelVal) {
                maxCelVal = val;
                maxCelNum = i;
            }
        }
        for (var i = 0; i < cellCount; i++) {
            mainUtils.setHtmlText('bmu-actDataModule-v' + idx + '-' + (i), data.cellVoltageArr[i].toFixed(3) + " V");
            mainUtils.setHtmlText('bmu-actDataModule-dv' + idx + '-' + (i), "+" + (((data.cellVoltageArr[i] - minCelVal) * 1000)).toFixed(0) + " mV");
            mainUtils.setHtmlText('bmu-actDataModule-dvp' + idx + '-' + (i), "+" + (((data.cellVoltageArr[i] - dev.data.minCellVoltage) * 1000)).toFixed(0) + " mV");
            let bal = (data.balancingReg & (1 << i)) !== 0;
            let balE = (data.balancingExtReg & (1 << i)) !== 0;

            mainUtils.setHtmlText('bmu-actDataModule-bal' + idx + '-' + (i), (bal ? 'ON' : 'OFF'));
        }

        mainUtils.setHtmlText('bmsex-minCellV' + idx, (minCelVal).toFixed(3) + 'V @ cell' + (minCelNum + 1));
        mainUtils.setHtmlText('bmsex-maxCellV' + idx, (maxCelVal).toFixed(3) + 'V @ cell' + (maxCelNum + 1));
        mainUtils.setHtmlText('bmsex-cellVoltageDiff' + idx, "Δ " + ((maxCelVal - minCelVal) * 1000).toFixed(0));
        mainUtils.setHtmlText('bmsex-balancingStatus' + idx, bmsexDM.map_cmMonBalStatusToString(data.balancingStatus));

//        debugger;
        mainUtils.setHtmlText('bmsex-minPackTemp' + idx, data.tempCell1);
//        mainUtils.setHtmlText('bmsex-maxPackTemp' + idx, data.tempCell2);
        mainUtils.setHtmlText('bmsex-packVoltage' + idx, packVoltage.toFixed(3));



    } catch (e) {

    }
};

bmuH8.updateData = function (dev, data) {
    bmuH8GUI.setModuleCount(data.moduleCount);
    if (data.progress) {
        bmuH8.updateDataProgress(dev, data.progress);
    }

    if (Array.isArray(data.moduleDataList)) {
        for (var i = 0; i < data.moduleDataList.length; i++) {
            if (data.moduleDataList[i] !== undefined && data.moduleDataList[i] !== null) {
                bmuH8.updateModuleData(dev, i, data.moduleDataList[i]);
            } else {
                break;
            }
        }
    }

//        chargeControlDer
//    console.log(data);

    mainUtils.setHtmlText('bmuH8-voltageV', data.voltageV, 2);
    mainUtils.setHtmlText('bmuH8-capacityAh', data.capacityAh, 2);
    mainUtils.setHtmlText('bmuH8-currentA', data.currentA);
    mainUtils.setHtmlText('bmuH8-powerW', (data.currentA * data.voltageV) / 1000, 2);

    //
    mainUtils.setHtmlText('bmuH8-minCell', bmuH8.getModuleName(data.minCellVoltage, data.minCellIdx));
    mainUtils.setHtmlText('bmuH8-maxCell', bmuH8.getModuleName(data.maxCellVoltage, data.maxCellIdx));
    mainUtils.setHtmlText('bmuH8-cellVoltageDiff', ((data.maxCellVoltage - data.minCellVoltage) * 1000), 0);
    mainUtils.setHtmlText('bmuH8-moduleCount', data.moduleCount);
    mainUtils.setHtmlText('bmuH8-cellCount', data.moduleCount * 16);

    mainUtils.setHtmlText('bmuH8-protRelMainState', bmsexDM.protRelayState(data.mainRelayState));
    mainUtils.setHtmlText('bmuH8-mainState', bmsexDM.protRelayState(data.mainRelayState));

    mainUtils.setHtmlText('bmuH8-energy', (data.capacityAh * data.ratedVoltageV) / 1000, 2);
    mainUtils.setHtmlText('bmuH8P-ratedVoltageV', (data.ratedVoltageV), 0);


    mainUtils.setHtmlText('bmuH8-capacityPer', data.capacityP, 2);
    mainUtils.setHtmlText('bmuH8-balStatus', bmsexDM.map_cmMonBalStatusToString(data.balStatus));
    mainUtils.setHtmlText('bmuH8-balCellCount', data.balCellCount);

    mainUtils.setHtmlText('bmuH8-protIsolatorState', data.isolatorPos === 0 ? 'OPEN' : 'CLOSED');


    mainUtils.setHtmlText('bmuH8-internalTemp', data.internalTemp);
    mainUtils.setHtmlText('bmuH8-prechargeTemp', data.prechargeTemp);

//    bmuH8GUI.dataComp.clusterEnabled.value = dev.param.clusterEnabled;


//    for (var item in bmuH8GUI.dataComp) {
//        if (data[item] !== undefined) {
//            bmuH8GUI.dataComp[item].value = data[item];
//        }
//    }
    hh.updateAdfFromObject(bmuH8GUI.dataComp, data);
    hh.updateAdfFromObject(bmuH8GUI.dataComp.data, data);

    bmuH8GUI.dataComp.remainingTimeSign.value = data.remainingTimeSign;
};

bmuH8.updateParam = function (dev, param) {
    try {

        if (bmuH8.moduleParamInfoTabPannel === null) {


        }
        //    console.log(param.batteryManufacturer);
        for (var i = 0; i < param.moduleParamList.length; i++) {
            try {
                let mp = param.moduleParamList[i];
                mainUtils.setHtmlText("bmuH8-mp" + i + "-boardSerialNumber", mp.boardSerialNumber);
                mainUtils.setHtmlText("bmuH8-mp" + i + "-boardManufDate", mp.boardManufDate);
                mainUtils.setHtmlText("bmuH8-mp" + i + "-cellCount", mp.cellCount);
                mainUtils.setHtmlText("bmuH8-mp" + i + "-fwVer", mp.fwVer);
                mainUtils.setHtmlText("bmuH8-mp" + i + "-hwVer", mp.hwVer);
                mainUtils.setHtmlText("bmuH8-mp" + i + "-moduleSerialNumber", mp.moduleSerialNumber);
                mainUtils.setHtmlText("bmuH8-mp" + i + "-smdCanId", mp.smdCanId);
            } catch (e) {
            }
        }

        mainUtils.setHtmlText('bmuH8P-fwUpdImageVer', param.fwUpdImageVer);
        mainUtils.setHtmlText('bmuH8P-fwUpdImageChecksum', param.fwUpdImageChecksum);
        mainUtils.setHtmlText('bmuH8P-fwUpdImageSize', (param.fwUpdImageSize / 1000).toFixed(3));
        mainUtils.setHtmlText('bmuH8P-fwUpdImageLoaded', param.fwUpdImageVer !== 0 ? "TRUE" : "FALSE");


        mainUtils.setHtmlText('bmuH8P-canId', param.canId);
        mainUtils.setHtmlText('bmuH8P-serialNumber', param.serialNumber);
        mainUtils.setHtmlText('bmuH8P-busName', param.busName);
        mainUtils.setHtmlText('bmuH8P-storageName', param.storageName);

        mainUtils.setHtmlText('bmuH8P-batManuf', param.batteryManufacturer);
        mainUtils.setHtmlText('bmuH8P-batteryModel', param.batteryModel);
        mainUtils.setHtmlText('bmuH8P-clusterId', param.clusterId);
        mainUtils.setHtmlText('bmuH8P-cellManufacturer', param.cellManufacturer);
        mainUtils.setHtmlText('bmuH8P-cellModel', param.cellModel);
        mainUtils.setHtmlText('bmuH8P-cellCount', param.cellCount);
        mainUtils.setHtmlText('bmuH8P-cellChemistry', bmuH8DataMap.cellChemistryToString(param.cellChemistry));

        mainUtils.setHtmlText('bmuH8P-ratedVoltageV', param.ratedVoltageV);

        mainUtils.setHtmlText('bmuH8P-ratedCapacityAh', param.ratedCapacityAh + "Ah / " + (param.ratedCapacityAh * param.ratedVoltageV) + "Wh");

        mainUtils.setHtmlText('bmuH8P-ratedDischTemp', param.protTcDischargeTempBegin + "~" + param.protTcDischargeTempEnd);
        mainUtils.setHtmlText('bmuH8P-ratedChTemp', param.protTcChargeTempBegin + "~" + param.protTcChargeTempEnd);

        mainUtils.setHtmlText('bmuH8P-ratedChargeCurrent', param.ratedChargeCurrentC.toFixed(2) + "C / " + (param.ratedCapacityAh * param.ratedChargeCurrentC).toFixed(1) + "A");
        mainUtils.setHtmlText('bmuH8P-ratedDischargeCurrent', param.ratedDischargeCurrentC.toFixed(2) + "C / " + (param.ratedCapacityAh * param.ratedDischargeCurrentC).toFixed(1) + "A");

//    mainUtils.setHtmlText('bmuH8P-clusterId', param.protTcChargeTempBegin + "~" + param.protTcChargeTempEnd);


        mainUtils.setHtmlText('bmuH8P-blFwVer', param.blFwVer);
        mainUtils.setHtmlText('bmuH8P-fwVer', dev.fwVer);
        mainUtils.setHtmlText('bmuH8P-hwVer', dev.hwVer);

        mainUtils.setHtmlText('bmuH8P-bmuManufDate', moment(param.bmuManufDate * 1000).format('YYYY/MM/DD hh:mm'));
        mainUtils.setHtmlText('bmuH8P-batteryManufDate', moment(param.batteryManufDate * 1000).format('YYYY/MM/DD hh:mm'));
        mainUtils.setHtmlText('bmuH8P-bmuSerialNumber', param.bmuSerialNumber);

        //net
        let address = param.netActual;
        if (address === undefined) {
            address = param.netIp;
        }
        if (param.netDhcpEnabled) {
            mainUtils.setHtmlText('bmuH8P-netIp', 'Dhcp ' + address);
        } else {
            mainUtils.setHtmlText('bmuH8P-netIp', 'Static ' + address);
        }
        mainUtils.setHtmlText('bmuH8P-netHostName', param.netHostName);
        mainUtils.setHtmlText('bmuH8P-netEthMac', param.netEthMac);


        pm.elements['serialNumber'].setValue(dev.serialNumber);
        pm.elements['hwVer'].setValue(dev.hwVer);
        pm.elements['bmuManufDate'].setValue(dev.bmuManufDate);



        dev.paramLoaded = true;
    } catch (e) {

    }
};


bmuH8.onSelectedBmuH8DataClusterReceived = function (dev, data) {

    hh.updateAdfFromObject(bmuH8GUI.dataComp.cluster, data);
    try {
        let dComp = bmuH8GUI.dataComp.cluster;
        dComp.minCellVoltage.tooltipTitle.text = bmuH8.getClusterIdxName(data.minCellIdx) + ' @ ' + bmuH8.getClusterUnitIdxName(data.minCellNodeIdx);
        dComp.maxCellVoltage.tooltipTitle.text = bmuH8.getClusterIdxName(data.maxCellIdx) + ' @ ' + bmuH8.getClusterUnitIdxName(data.maxCellNodeIdx);

        dComp.minCellTemp.tooltipTitle.text = bmuH8.getClusterIdxName(data.minCellTempIdx) + ' @ ' + bmuH8.getClusterUnitIdxName(data.minCellTempNodeIdx);
        dComp.maxCellTemp.tooltipTitle.text = bmuH8.getClusterIdxName(data.maxCellTempIdx) + ' @ ' + bmuH8.getClusterUnitIdxName(data.maxCellTempNodeIdx);

//                dComp.chCtrl.tooltipTitle.text = 'Limit Node: ' + bmuH8.getClusterUnitIdxName(data.chCtrlLimitNodeIdx);
//                dComp.dischCtrl.tooltipTitle.text = 'Limit Node: ' + bmuH8.getClusterUnitIdxName(data.dischCtrlLimitNodeIdx);

        dComp.chCtrlC.value = data.chCtrlCur + '% / ' + (data.targetChargeCurrent / 10).toFixed(1) + 'A';
        dComp.dischCtrlC.value = data.dischCtrlCur + '% / ' + (data.targetDischargeCurrent / 10).toFixed(1) + 'A';

        dComp.chCtrlV.value = data.chCtrlVolt + '% / ' + (data.targetChargeVoltage / 10).toFixed(1) + 'V';
        dComp.dischCtrlV.value = data.dischCtrlVolt + '% / ' + (data.targetDischargeVoltage / 10).toFixed(1) + 'V';
        dComp.cellDif.value = data.maxCellVoltage - data.minCellVoltage;
//                debugger;
        dComp.power.value = (data.actualVoltage / 10) * (data.actualCurrent / 10);

        dComp.clusterEnabled.value = dev.param.clustParam.clusterEnabled;
        dComp.nodeInteralId.value = dev.param.clustParam.nodeInteralId;

        dComp.offlineRatedCapacityAh.value = data.totalRatedCapacityAh - data.onlineRatedCapacityAh;

    } catch (e) {
        console.log(e);
    }
};
dm.onSelectedCustomDataReceived(bmuH8.onSelectedBmuH8DataClusterReceived, 'BmuH8DataCluster');

bmuH8.updateDataProgress = function (dev, prog) {
//    console.log(prog);

};

bmuH8.clearDataComp = function () {
    for (var item in  bmuH8GUI.dataComp.cluster) {
        bmuH8GUI.dataComp.cluster[item].setNA();
    }

};

dm.onSelectedDataReceived(bmuH8.updateData);

dm.onProgressData('Bmu-H8 Update', bmuH8GUI.updateProgBmuFw);

dm.onProgressData('BmsEx Fw Update', bmuH8GUI.updateProgBmsFw);

dm.onSelectedParamInit(bmuH8.updateParam);

dm.onSelectedChange(function (dev) {
    if (dev.auxData && dev.auxData.BmuH8DataCluster) {
        bmuH8.onSelectedBmuH8DataClusterReceived(dev, dev.auxData.BmuH8DataCluster);
    } else {
        bmuH8.clearDataComp();
    }
    bmuH8GUI.setModuleCount(0);

    bmuH8.updateParam(dev, dev.getParam());
    if (dev.connected) {
        if (dev.data) {
            bmuH8.updateData(dev, dev.getData());
        }
        if (dev.param) {
            bmuH8.updateParam(dev, dev.getParam());
        }

    } else {
        mainUtils.setHtmlText('dataValues');
    }
});

dm.onSelectedStatusChange(function (dev, state) {
    bmuH8.clearDataComp();
    if (state && dev.getData() !== undefined) {
        if (dev.getData() !== undefined) {
            bmuH8.updateData(dev, dev.getData());
        }
        if (dev.getData() !== undefined) {
            bmuH8.updateParam(dev, dev.getParam());
        }
    } else {
        bmuH8GUI.setModuleCount(0);
        mainUtils.setHtmlText('dataValues');
    }
});

dm.onParamReceived(function (dev, param) {
    param.subModelID = dev.subModelID;
    bmuH8GUI.setModuleCount(0);
});

document.addEventListener("DOMContentLoaded", function (event) {
    console.log('%c BmuH8 JS ver:1.0.1 ', 'font-size: 18px; -webkit-box-shadow: 0 1px 3px 0 rgb(0 0 0 / 33%), 0 5px 1px 0 rgb(0 0 0 / 14%), 0 4px 19px -1px rgb(0 0 0 / 59%)');
    bmuH8.init();
});

bmuH8.onLoggerWebContProgressData = function (dev, prog, id) {
    bmuH8.dataContent.firmwareUpdatePrg.value = prog.pState;
    bmuH8.dataContent.firmwareUpdatePrgState.html = prog.prop.text;
};

dm.onProgressDialogCreate('firnwareUpdate', function (dev, pId, dialog) {
    dialog.setBarTitle(dev.serialNumber + "Firmware Update.");
    hh.addHeaderTitleToPC(dialog.contentDiv, "Firmware Update", null);

    bmuH8.dataContent.firmwareUpdatePrg = hh.adf(dialog.contentDiv, 'Progress', '%');
    bmuH8.dataContent.firmwareUpdatePrgState = hh.adf(dialog.contentDiv, ' ');
});

dm.onProgressData('firnwareUpdate', bmuH8.onLoggerWebContProgressData);

//$(document).ready(function () {
//});
