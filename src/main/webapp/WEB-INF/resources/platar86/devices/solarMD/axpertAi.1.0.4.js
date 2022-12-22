/* global logCon, PF, mainUtils, moment, devManager, bmsRelay */


var axAi = {
    devData: {},
    warnErrDialogSerial: false,
    colorPickerInit: false,
    capacityAhParamInit: false,
    subDeviceInit: false,
    subDeviceSelectedSerial: null
};

function fetchRelayData() {
    devManager.sendDevMessage(
            {
                instrExt: 'getNotUsedOutput',
                instrData: devManager.getSelected().serialNumber
            },
            function (devMessage, notUsedArr) { //success
                devManager.sendDevMessage(
                        {
                            instrExt: 'getOutputPinConnectionList',
                            instrData: devManager.getSelected().serialNumber
                        },
                        function (devMessage, connectionArr) { //success
                            devManager.sendDevMessage(
                                    {
                                        instrExt: 'getAxpertUnitList',
                                        instrData: devManager.getSelected().serialNumber
                                    },
                                    function (devMessage, unitArr) { //success
                                        reloadRelaySettings(notUsedArr, connectionArr, unitArr);
                                    }
                            );
                        }
                );
            }
    );
}

function connectUnitToRelay(relay, serial) {
    if (relay === 'none') {
        console.log(relay, serial);
        devManager.sendDevMessage(
                {
                    instrExt: 'removeOutputPinConnection',
                    instrData: serial,
                    instrDataExt: relay
                },
                function (devMessage, successMessage) { //success
                    mainUtils.showInfoMessage("Success", successMessage);
                    fetchRelayData();
                });
    } else {
        console.log(relay, serial);
        devManager.sendDevMessage(
                {
                    instrExt: 'setOutputPinConnection',
                    instrData: serial,
                    instrDataExt: relay
                },
                function (devMessage, successMessage) { //success
                    mainUtils.showInfoMessage("Success", successMessage);
                    fetchRelayData();
                });
    }
}

function reloadRelaySettings(notUsedArr, connectionArr, unitArr) {
    const rootPanel = document.getElementById('outputRelayConnectPanel');
    while (rootPanel.firstChild) {
        rootPanel.removeChild(rootPanel.firstChild);
    }

    for (var unitSerial in unitArr) {
        const optionArr = ['none'];

        if (connectionArr[unitSerial] !== undefined) {
            optionArr.push(connectionArr[unitSerial]);
        } else {
            for (var i in notUsedArr) {
                optionArr.push(notUsedArr[i]);
            }
        }

        const dropDownList = addSingleElement(
                'outputRelayConnectPanel',
                'Unit-' + unitSerial,
                optionArr,
                connectUnitToRelay,
                unitSerial
                );
        if (connectionArr[unitSerial] !== undefined) {
            dropDownList.puidropdown('selectValue', connectionArr[unitSerial]);
        } else {
            dropDownList.puidropdown('selectValue', 'none');
        }
//          dropDownList.puidropdown('selectValue', selectMenuArr[0]);

        console.log(notUsedArr + " - " + connectionArr);
    }
}
;

function addSingleElement(panel, label, selectMenuArr, cb, callId) {
    panel = panel || 'outputRelayConnectPanel';
    label = label || 'Label asdf';
    callId = callId || 'relay1ID';
    selectMenuArr = selectMenuArr || ['Relay1', 'Relay2'];
    const rootPanel = document.getElementById('outputRelayConnectPanel');
    rootPanel.classList.add('devParamPanelWrapper');

    const divNode = document.createElement('div');
//    divNode.classList.add('devSettControl');
    divNode.classList.add('devParamPanel');
    divNode.classList.add('devParamPanelCustom');

    const selectList = document.createElement('div');
    selectList.classList.add('ctrlValue');
    selectList.id = callId + "-select";


    const button = document.createElement('button');
    button.classList.add('ui-button', 'ctrlExec');
    button.textContent = 'Save';
    button.type = 'button';

    button.onclick = function () {
        cb($('#' + selectList.id).puidropdown('getSelectedValue'), callId);
    };

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('ctrlLabel');
    labelSpan.textContent = label;

    const infoSpan = document.createElement('span');
    infoSpan.classList.add('ctrlInfo');
    infoSpan.textContent = 'Relay connected to Inverter output control pin. incerter serial: ' + callId;


    divNode.appendChild(labelSpan);
    divNode.appendChild(selectList);
    divNode.appendChild(button);
    divNode.appendChild(infoSpan);

    rootPanel.appendChild(divNode);

    selectList.onchange = function (a) {
        console.log(a.srcElement.selectedIndex);
    };


    $('#' + selectList.id).puidropdown({
        data: selectMenuArr,
        styleClass: 'ctrlValue'
    });
    return   $('#' + selectList.id);
//    $('#' + selectList.id).puidropdown('selectValue', selectMenuArr[0]);
    //
//    button.relaySelection = $('#' + selectList.id).puidropdown('getSelectedValue');
}

escManager.onDataReceived(function (data) {
    if (devManager.getSelected().getParam() !== undefined) {

        for (var i = 0; i < data.length; i++) {
            let escData = data[i];

            if (escData.busName === devManager.getSelected().getParam().busName) {
//            console.log(escData);
                mainUtils.setHtmlText('batteryBusName', escData.busName);
                mainUtils.setHtmlText('batteryBusName', escData.busName);
                mainUtils.setHtmlText('offlineDevices', escData.offlineDevices);
                mainUtils.setHtmlText('onlineDevices', escData.onlineDevices);
                mainUtils.setHtmlText('avergCapacityP', escData.avergCapacityP, 2);
                mainUtils.setHtmlText('avergVoltageV', escData.avergVoltageV, 2);
                mainUtils.setHtmlText('totalPowerW', (escData.totalPowerW / 1000), 2);
                mainUtils.setHtmlText('totalCurrentA', escData.totalCurrentA, 2);
                mainUtils.setHtmlText('chargeControl', escData.chargeControl);
                mainUtils.setHtmlText('chargeControlLim', escData.currentChargeLimitSerial);
                mainUtils.setHtmlText('dischargeControl', escData.dischargeControl);
                mainUtils.setHtmlText('dischargeControlLim', escData.currentDischargeLimitSerial);
                mainUtils.setHtmlText('totalRatedCapacityAh', escData.totalRatedCapacityAh, 2);
                mainUtils.setHtmlText('totalRateChargeCurrentA', escData.totalRateChargeCurrentA, 2);
                mainUtils.setHtmlText('totalRateDischargeCurrentA', escData.totalRateDischargeCurrentA, 2);
                mainUtils.setHtmlText('avergCapacityAh', (escData.totalCapacityAh), 2);

                try { // can throw exception if data is not available. Skip only 
                    var batVDrop = escData.avergVoltageV - devManager.getSelected().getData().avrgBatteryVoltage;
                    mainUtils.setHtmlText('batVDrop', batVDrop, 2);
                } catch (e) {

                }
            }
        }
    }
});

axAi.clearSubDeviceData = function () {
//    subDeviceData
    const panelArr = document.getElementsByClassName('subDeviceData');
    for (var i = 0; i < panelArr.length; i++) {

        const childArr = panelArr[i].getElementsByClassName('actDataPanel');
        for (var j = 0; j < childArr.length; j++) {
            if (childArr[j].children[1] !== undefined) {
                childArr[j].children[1].innerText = "N/A";
            }
        }
    }
};

axAi.updateSubDeviceData = function (devData) {
//    axAi.clearSubDeviceData();
//    console.log(devData);
    if (axAi.subDeviceSelectedSerial !== null) {


//        subDunitStatus
        let status = 'Offline';
        let connected = false;
        let standby = false;
        for (var item in devData.axpertIdToSerialMap) {
            if (devData.axpertIdToSerialMap[item] === axAi.subDeviceSelectedSerial) {
                connected = true;
                break;
            }
        }
        if (connected) {
            status = 'Online';
            for (var item in devData.axpertActiveStendby) {
                if (devData.axpertActiveStendby[item] === axAi.subDeviceSelectedSerial) {
                    standby = true;
                    break;
                }
            }
        }
        if (standby) {
            status = 'Stendby';
        }
        mainUtils.setHtmlText('subDunitStatus', status);
        mainUtils.setHtmlText('subDunitTotalChargingCurrent', devData.axpertTotalChargingCurrentMap[axAi.subDeviceSelectedSerial]);

        if (connected) {
            const data = devData.axpertUnitDataMap[axAi.subDeviceSelectedSerial];

            switch (data.outputMode) {
                case 0:
                    mainUtils.setHtmlText('subDunitOutputMode', "Single Inverter");
                    break;
                case 1:
                    mainUtils.setHtmlText('subDunitOutputMode', "Parallel Mode");
                    break;
                case 2:
                    mainUtils.setHtmlText('subDunitOutputMode', "Pahase 1");
                    break;
                case 3:
                    mainUtils.setHtmlText('subDunitOutputMode', "Pahase 2");
                    break;
                case 4:
                    mainUtils.setHtmlText('subDunitOutputMode', "Pahase 3");
                    break;
            }

            const pv = data.pvPower;
            mainUtils.setHtmlText('subDmpptChargingPower', (pv.powerW / 1000), 2);
            mainUtils.setHtmlText('subDmpptInputVoltage', pv.inputVoltage, 2);
            mainUtils.setHtmlText('subDmpptInputCurrent', pv.inputCurrent, 1);
            mainUtils.setHtmlText('subDcurrentA', pv.currentA, 1);
            mainUtils.setHtmlText('subDmpptyEnergy', (pv.energyWh / 1000), 2);

            const grid = data.gridInPower;
            mainUtils.setHtmlText('subDgridInPowerW', (grid.powerW / 1000), 2);
            mainUtils.setHtmlText('subDgridInCurrentA', (grid.currentA), 2);
            mainUtils.setHtmlText('subDgridInVoltageV', (grid.voltageV), 2);
            mainUtils.setHtmlText('subAvailable', grid.available);
            mainUtils.setHtmlText('subDgridInRatedPowerW', (grid.ratedPowerW / 1000), 2);
            mainUtils.setHtmlText('subDgridInEnergyWh', (grid.energyWh / 1000), 2);

            const load = data.loadPower;
            mainUtils.setHtmlText('subDloadPowerW', (load.powerW / 1000), 2);
            mainUtils.setHtmlText('subDloadRatedPowerW', (load.ratedPowerW / 1000), 2);
            mainUtils.setHtmlText('subDloadCurrentA', (load.currentA), 2);
            mainUtils.setHtmlText('subDloadVoltageV', (load.voltageV), 2);
            mainUtils.setHtmlText('subDloadAvailable', load.available);

            mainUtils.setHtmlText('subDloadEnergyWh', (load.energyWh / 1000), 2);
            mainUtils.setHtmlText('subDloadApparentPowerVA', (load.apparentPowerVA / 1000), 2);

            let pvStatus = 'Waiting for Sun...';
            if (data.statSccCharging) {
                if (devData.axpertTotalChargingCurrentMap !== undefined && devData.axpertTotalChargingCurrentMap[axAi.subDeviceSelectedSerial] !== undefined) {
                    mainUtils.setHtmlText('subDMaximumChargeCurrent', devData.axpertTotalChargingCurrentMap[axAi.subDeviceSelectedSerial], 0);
                    if (devData.bvcActualStage > 0) {
                        if (devData.axpertTotalChargingCurrentMap[axAi.subDeviceSelectedSerial] <= pv.currentA) {
                            pvStatus = 'Throttling Current Limit';
                        } else {
                            pvStatus = 'Maximum Power';
                        }
                    } else {
                        pvStatus = 'Throttling Bat Full Limit';
//                        pvStatus = 'Load Supply Only';
                    }
                    if (devData.axpertMaxSolarCurrentMap !== undefined && devData.axpertMaxSolarCurrentMap[axAi.subDeviceSelectedSerial] !== undefined) {
                        mainUtils.setHtmlText('subDMaximumRecordedCurrent', devData.axpertMaxSolarCurrentMap[axAi.subDeviceSelectedSerial], 0);
                    }
                } else {
                    axAi.clearSubDeviceData();
                }
            } else {

            }
            mainUtils.setHtmlText('subDstatSccCharging', pvStatus);
        }
    }
}
;

axAi.updateData = function (dev, data) {

    mainUtils.setHtmlText('outputSourceTechInfor', data.actualOutputSourcePriority, 0);

    mainUtils.setHtmlText('inverterActualBulkVoltage', data.actualUnitsParam.batteryBulkVoltage, 1);
    mainUtils.setHtmlText('inverterActualFloatVoltage', data.actualUnitsParam.batteryFloatVoltage, 1);
    mainUtils.setHtmlText('inverterActualTotalAcCurrent', data.dccTotalSetAcCurrentA, 0);
    mainUtils.setHtmlText('inverterActualTotalCurrent', data.actualUnitsParam.maxTotalChargingCurrent, 0);

    mainUtils.setHtmlText('dccTargetCurrentA', data.dccTargetTotalSetCurrentA, 0);
    mainUtils.setHtmlText('inverterTargetTotalCurrent', data.dccTargetTotalSetCurrentA, 0);
    mainUtils.setHtmlText('inverterTargetTotalAcCurrent', data.dccTargetTotalSetAcCurrentA, 0);


    if (data.bvcActualStage === 1) {
        mainUtils.setHtmlText('batteryActualMode', 'Charging Stage');
    } else if (data.bvcActualStage === 0) {
        mainUtils.setHtmlText('batteryActualMode', 'Floating Stage');
    } else if (data.bvcActualStage === 2) {
        mainUtils.setHtmlText('batteryActualMode', 'Slow Charging Stage');
    } else {
        mainUtils.setHtmlText('batteryActualMode', 'Unknown Stage' + data.bvcActualStage);
    }

    if (devManager.getSelected().getParam() !== undefined) {
        let floatingVoltage = devManager.getSelected().getParam().bvcBulkFloatingVoltage - devManager.getSelected().getParam().bvcBulkFloatDifference;
        mainUtils.setHtmlText('batteryFloatingVoltage', floatingVoltage, 2);
    }

        mainUtils.setHtmlText('inverterBatteryVoltage', (data.avrgBatteryVoltage), 2);

    const pv = data.pvPower;
    mainUtils.setHtmlText('statSccCharging', (data.solarModeActive));
    mainUtils.setHtmlText('mpptChargingPower', pv.powerW, 2);
    mainUtils.setHtmlText('mpptInputVoltage', pv.inputVoltage);
    mainUtils.setHtmlText('mpptInputCurrent', pv.currentA);
    mainUtils.setHtmlText('mpptyEnergy', (pv.energyWh / 1000), 2);
    mainUtils.setHtmlText('mpptAvailable', pv.available);

    const grid = data.gridInPower;
    mainUtils.setHtmlText('gridInPowerW', (grid.powerW / 1000), 2);
    mainUtils.setHtmlText('gridInCurrentA', (grid.currentA), 2);
    mainUtils.setHtmlText('gridInAvailable', grid.available);
    mainUtils.setHtmlText('gridInEnergyWh', (grid.energyWh / 1000), 2);
    mainUtils.setHtmlText('gridInRatedPowerW', (grid.ratedPowerW / 1000), 2);

    const load = data.loadPower;
    mainUtils.setHtmlText('loadPowerW', (load.powerW / 1000), 2);
    mainUtils.setHtmlText('loadRatedPowerW', (load.ratedPowerW / 1000), 2);
    mainUtils.setHtmlText('loadCurrentA', (load.currentA), 2);
    mainUtils.setHtmlText('loadEnergyWh', (load.energyWh / 1000), 2);

    mainUtils.setHtmlText('upsModeActive', (data.upsModeEnable), 2);

    printDataInTable("rawDataTableDiv", liveData.data, data);
    printDataInTable("rawSetPointParamTableDiv", liveData.setPointParam, dev.getData().setPointUnitsParam);
    printDataInTable("rawParamDiv", liveData.param, dev.getParam());
    printDataInTable("rawUnitParamTableDiv", liveData.unitParam, dev.getData().actualUnitsParam);

    mainUtils.setHtmlText('standbyUnitCount', data.standbyUnitCount);
    mainUtils.setHtmlText('onlineUnitCount', Object.keys(devManager.getSelected().getData().axpertIdToSerialMap).length);

    if (axAi.subDeviceInit === false) {
        axAi.subDeviceInit = true;
        axAi.updateSubDevControls();
    }
    axAi.updateSubDeviceData(data);
};

axAi.updateParam = function (dev, param) {


//    if (param === undefined) {
//        return;
//    }
//    for (var item in param) {
//        if (Array.isArray(param[item])) {
//            var arr = param[item];
//            for (var i = 0; i < arr.length; i++) {
//                var cName = item + (i.toString());
//                mainUtils.setWidgetValue(cName, arr[i]);
//            }
//        } else {
//            mainUtils.setWidgetValue(item, param[item]);
//        }
//    }
//    //refresh all controls
//    for (var item in param) {
//        axAi.updataParamControl(item, dev);
//    }
//
//    dev.paramLoaded = true;
};

axAi.updateParamDefault = function (paramName) {

    if (paramName === undefined) {
        return;
    }
    var dev = devManager.getSelected();

    mainUtils.setWidgetValue(paramName, dev.getParam()[paramName]);
    //refresh all controls
    dev.paramLoaded = true;
    axAi.updataParamControl(paramName, dev);
};

axAi.updataParamControl = function (compName) {
    var dev = devManager.getSelected();

    if (dev !== undefined) {
        if (Array.isArray(dev.getParam()[compName])) {
            var arr = dev.getParam()[compName];
            for (var i = 0; i < arr.length; i++) {
                var cName = compName + (i.toString());
                var actualParam = Number(dev.getParam()[compName][i]);
                var value = Number(mainUtils.getWidgetValue(cName));
                if (value === undefined) {
                    value = actualParam;
                }
                if (actualParam !== undefined) {
                    var controlButton = document.getElementsByClassName(cName)[0];
                    if (controlButton !== undefined) {
                        if (actualParam !== value) {
                            controlButton.style.display = 'block';
                        } else {
                            controlButton.style.display = 'none';
                        }
                    }
                }
            }
        } else {
            var actualParam = Number(dev.getParam()[compName]);
            var value = Number(mainUtils.getWidgetValue(compName));
            if (value === undefined) {
                value = actualParam;
            }
            if (actualParam !== undefined) {
                var controlButton = document.getElementsByClassName(compName)[0];
                if (controlButton !== undefined) {
                    if (actualParam !== value) {
                        controlButton.style.display = 'block';
                    } else {
                        controlButton.style.display = 'none';
                    }
                }

            }
        }
    }
}
;

function printDataInTable(tableID, tableArr, data) {
    for (var item in data) {
        let found = false;
        for (var i = 0; i < tableArr.length; i++) {
            if (tableArr[i].name !== undefined && tableArr[i].name === item) {
                tableArr[i].value = data[item];
                found = true;
                break;
            }
        }

        if (!found) {
            tableArr.push({
                name: item,
                value: data[item]
            });
        }
    }
    tableArr.sort(function compare(a, b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    });
    $('#' + tableID).puidatatable('reload');
}

axAi.onSubDeviceSelectionChange = function (subDevSerial) {
    axAi.clearSubDeviceData();
    axAi.subDeviceSelectedSerial = subDevSerial;
    axAi.updateSubDeviceData(devManager.getSelected().getData());
//    console.log(subDevSerial);
};

axAi.updateSubDevControls = function () {
    //devManager.getSelected().getData().axpertUnitDataMap
    mainUtils.customSelectButton.clearAll('axpertAiSubUnitSelectPanle');
    const unitArr = devManager.getSelected().getData().axpertUnitDataMap;
    for (var item in unitArr) {
        mainUtils.customSelectButton.add('axpertAiSubUnitSelectPanle', 'Unit-' + item, axAi.onSubDeviceSelectionChange, item);
    }
    mainUtils.customSelectButton.selectFirstWithCallback('axpertAiSubUnitSelectPanle');
};


devManager.onSelectedChange(function (sDev) {
    axAi.updateParam(sDev, sDev.getParam());
    if (sDev.connected && axAi.devData[sDev.serialNumber] !== undefined) {
        axAi.updateData(sDev, axAi.devData[sDev.serialNumber]);
    }
    if (devManager.getSelected().getData() !== undefined && devManager.getSelected().getData().axpertUnitDataMap !== undefined) {
        axAi.updateSubDevControls();
    } 
//    else {
//        axAi.subDeviceInit = true;
//    }
});

//devManager.onSelectedDataReceived(axAi.updateData);
devManager.onDataReceived(function (dev, data) {
    axAi.devData[dev.serialNumber] = data;
    if (dev.selected === true) {
        axAi.updateData(dev, data);
    }
});


devManager.onSelectedStatusChange(function (dev, state) {
    if (axAi.devData[dev.serialNumber] !== undefined) {

        axAi.updateData(dev, axAi.devData[dev.serialNumber]);
    }
});

devManager.onSelectedParamInit(axAi.updateParam);
devManager.onSelectedChange(function (sDev) {
    axAi.updateParam(sDev, sDev.getParam());
    if (sDev.connected && axAi.devData[sDev.serialNumber] !== undefined) {
        axAi.updateData(sDev, axAi.devData[sDev.serialNumber]);
    }
});

var liveData = {
    escData: [],
    data: [],
    setPointParam: [],
    param: [],
    unitParam: [],
    esCtrl: []
};


axAi.getProtStateText = function (state) {
    if (state === undefined) {
        return "N/A";
    }
    switch (state) {
        case 0:
            return "Normal";
        case 1:
            return "Sleep High";
        case 2:
            return "Sleep Low";
        case 3:
            return "Awake Low";
        case 4:
            return "Override On";
        case 5:
            return "Override Off";
        case 6:
            return "Emergency Off";
        case 7:
            return "Init";
        case 8:
            return "Awake High";
    }

    return "Unknown: " + state;
};


var requestESCBroadcast = function () {
    var message = wsm.emptyMessage;
    message.devSerialNumber = devManager.config.eSControlModel;
    message.instr = "broadcastRequest";
    message.devModelId = devManager.config.eSControlModel;
    wsm.sendDevMsg(message,
            function (successMessage) {
                //   console.log("onSuccess: " + successMessage);
            },
            function (errorMessage) {
                console.log("onError: " + errorMessage.response.faultMsg);
            },
            function () {
                console.log("onTimeout: ");
            }
    );
};

var reloadOutputControl = function () {

    devManager.sendDevMessage(
            {
                instrExt: 'getNotUsedOutput',
                instrData: devManager.getSelected().serialNumber
            },
            function (devMessage, availableOutputArr) { //success
                console.log(availableOutputArr);
            }
    );
};


var attachedIoToUnit = function () {
    //92931703101498
    //"LoggerV2 Relay-0"

    devManager.sendDevMessage(
            {
                instrExt: 'setOutputPinConnection',
                instrData: '92931703101498',
                instrDataExt: "LoggerV2 Relay-0"
            },
            function (devMessage, availableOutputArr) { //success
                console.log(availableOutputArr);
            }
    );
};

var reloadAxpertUnitList = function () {
    devManager.sendDevMessage(
            {
                instrExt: 'getAxpertUnitList',
                instrData: devManager.getSelected().serialNumber
            },
            function (devMessage, availableOutputArr) { //success
                console.log(availableOutputArr);
            }
    );
};

axAi.onParamChange = function (compName, idx) {
    if (devManager.getSelected() !== undefined) {
        axAi.updataParamControl(compName, devManager.getSelected(), idx);
    }
};

axAi.updataParamControl = function (compName) {
    var dev = devManager.getSelected();
    if (dev !== undefined) {
        if (Array.isArray(dev.getParam()[compName])) {
            var arr = dev.getParam()[compName];
            for (var i = 0; i < arr.length; i++) {
                var cName = compName + (i.toString());
                var actualParam = Number(dev.getParam()[compName][i]);
                var value = Number(mainUtils.getWidgetValue(cName));
                if (value === undefined) {
                    value = actualParam;
                }
                if (actualParam !== undefined) {
                    var controlButton = document.getElementsByClassName(cName)[0];
                    if (controlButton !== undefined) {
                        if (actualParam !== value) {
                            controlButton.style.display = 'block';
                        } else {
                            controlButton.style.display = 'none';
                        }
                    }
                }
            }
        } else {
            var actualParam = Number(dev.getParam()[compName]);
            var value = Number(mainUtils.getWidgetValue(compName));
            if (value === undefined) {
                value = actualParam;
            }
            if (actualParam !== undefined) {
                var controlButton = document.getElementsByClassName(compName)[0];
                if (controlButton !== undefined) {
                    if (actualParam !== value) {
                        controlButton.style.display = 'block';
                    } else {
                        controlButton.style.display = 'none';
                    }
                }

            }
        }
    }
};

devManager.onDeviceInitComplete(function () {
    reloadRelaySettings();
});


$(document).ready(function () {
    $('#rawDataTableDiv').puidatatable({
        caption: 'Cluster DATA',
        columns: [
            {field: 'name', headerText: 'Name:'},
            {field: 'value', headerText: 'Value:'}
        ],
        datasource: liveData.data
    });
    $('#rawSetPointParamTableDiv').puidatatable({
        caption: 'Cluster DATA',
        columns: [
            {field: 'name', headerText: 'Name:'},
            {field: 'value', headerText: 'Value:'}
        ],
        datasource: liveData.setPointParam
    });
    $('#rawParamDiv').puidatatable({
        caption: 'Cluster DATA',
        columns: [
            {field: 'name', headerText: 'Name:'},
            {field: 'value', headerText: 'Value:'}
        ],
        datasource: liveData.param
    });
    $('#rawEscDataTableDiv').puidatatable({
        caption: 'ES Control DATA',
        columns: [
            {field: 'name', headerText: 'Name:'},
            {field: 'value', headerText: 'Value:'}
        ],
        datasource: liveData.escData
    });
    $('#rawUnitParamTableDiv').puidatatable({
        caption: 'ES Control DATA',
        columns: [
            {field: 'name', headerText: 'Name:'},
            {field: 'value', headerText: 'Value:'}
        ],
        datasource: liveData.unitParam
    });
}
);