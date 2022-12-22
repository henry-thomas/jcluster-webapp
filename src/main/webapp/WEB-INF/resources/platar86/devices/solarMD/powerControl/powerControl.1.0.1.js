/* 
 * Copyright (C) 2019 platar86
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* global devManager, mainUtils, moment, hh, PF */

var plc = {
    meter1PhaActualDataInit: {},
    meter3PhaActualDataInit: {},
    ctrlDev1PhaActualDataInit: {},
    ctrlDev3PhaActualDataInit: {},
    devPanelInitComplete: false,
    devPanelParamRefreshRequired: false,
    devicePanel: {}
};

plc.createSettingExecProxy = function () {

    devManager.onDeviceSettingExec(function (name, data, idx) {
        let selectedPlc = plc.settingsPlcSer;
        console.log(name);

        devManager.sendDevMessage(
                {
                    instrExt: name,
                    instrData: selectedPlc,
                    instrDataExt: data
                },
                function (devMessage, unitArr) { //success
                    mainUtils.showInfoMessage('Success', 'New Power Limit Crated ' + name);
                    window.setTimeout(devManager.requestParamUpdate, 2000);
                    PF('addNewPlcControlWg').hide();
                },
                function (devMessage, errMsg) { //err
                    mainUtils.showErrorMessage('Error', errMsg);
                    PF('addNewPlcControlWg').hide();
                },
                function () {
                    PF('addNewPlcControlWg').hide();
                    mainUtils.showErrorMessage('Error', 'Timeout');
                }
        );
//        devManager.getSelected().updataParamControlAll();
//        devManager.getSelected().reloadParam();
    });

};

plc.getPowerFromObj = function (phase, meter) {
    if (phase >= 1 && phase <= 3) {
        let sumPower = 0;
        try {
            sumPower = meter['pha' + phase + 'ImportPower'].powerW;
        } catch (e) {
        }
        if (sumPower === 0) {
            sumPower = meter['pha' + phase + 'ExportPower'].powerW * -1;
        }
        if (sumPower !== 0) {
            return sumPower / 1000;
        }
        return 0;
    } else {
        let sumPower = 0;
        try {
            sumPower = meter.sumImportPower.powerW;
        } catch (e) {
        }
        if (sumPower === 0) {
            sumPower = meter.sumExportPower.powerW * -1;
        }
        if (sumPower !== 0) {
            return sumPower / 1000;
        }
        return 0;
    }
};

plc.onDataUpdate = function (dev, data) {

    if (data.serial3PhaMeterMap) {
        for (var meterSerial in data.serial3PhaMeterMap) {
            let meter = data.serial3PhaMeterMap[meterSerial];
            mainUtils.setHtmlText("smdplc-md_" + meterSerial + "-sumP", plc.getPowerFromObj(0, meter), 2);
            mainUtils.setHtmlText("smdplc-md_" + meterSerial + "-pha1P", plc.getPowerFromObj(1, meter), 2);
            mainUtils.setHtmlText("smdplc-md_" + meterSerial + "-pha2P", plc.getPowerFromObj(2, meter), 2);
            mainUtils.setHtmlText("smdplc-md_" + meterSerial + "-pha3P", plc.getPowerFromObj(3, meter), 2);
        }
    }
    if (data.serial1PhaMeterMap) {
        for (var meterSerial in data.serial1PhaMeterMap) {
            let meter = data.serial1PhaMeterMap[meterSerial];
            mainUtils.setHtmlText("smdplc-md_" + meterSerial + "-sumP", plc.getPowerFromObj(0, meter), 2);
        }
    }
    if (data.powerControl3PhaDevicesMap) {
        for (var ctrlSer in data.powerControl3PhaDevicesMap) {
            let ctrDev = data.powerControl3PhaDevicesMap[ctrlSer];
            mainUtils.setHtmlText("smdplc-cd_" + ctrlSer + "-sumP", plc.getPowerFromObj(0, ctrDev) * -1, 2);
        }
    }

    if (data.unitDataMap) {
        for (var ctrlSerial in data.unitDataMap) {
            let plcDev = data.unitDataMap[ctrlSerial];
            if (plcDev.serOutputControlBean) {
                for (var ctrlDevSer in plcDev.serOutputControlBean) {
                    let dev = plcDev.serOutputControlBean[ctrlDevSer];

                    mainUtils.setHtmlText("smdplc-cd_" + ctrlDevSer + "-available", dev.deviceConnected);
                    mainUtils.setHtmlText("smdplc-cd_" + ctrlDevSer + "-limitEnabled", dev.powerLimitEnabled);
                    let power = dev.requestedSumPowerIncreaseW;
                    if (power > 0) {
                        power /= 1000;
                    }
                    mainUtils.setHtmlText("smdplc-cd_" + ctrlDevSer + "-increase", power, 2);
                    let powerTarget = dev.applyedSumPowerW;
                    if (powerTarget > 0) {
                        powerTarget /= 1000;
                    }
                    mainUtils.setHtmlText("smdplc-cd_" + ctrlDevSer + "-target", powerTarget, 2);
                }
            }
        }
    }

    if (!plc.devPanelInitComplete && !plc.devPanelParamRefreshRequired) {
        plc.createAndPopulateDeviceTabs();
    }
};

plc.onParamUpdate = function (dev, param) {
//    console.log(param);
    if (!plc.devPanelInitComplete || plc.devPanelParamRefreshRequired) {
        plc.createAndPopulateDeviceTabs();
        plc.devPanelParamRefreshRequired = false;
    }
};

plc.createAndPopulateDeviceTabs = function () {
    let param = devManager.getSelected().getParam();

    if (param && param.unitParamMap) {
        plc.devPanelInitComplete = true;
        const rootPanel = document.getElementById('ctrlDataContent');
        hh.removeAllChilds(rootPanel);

        plc.createSettingExecProxy();
        const contenAccordition = document.createElement('div');
        rootPanel.appendChild(contenAccordition);

        for (var limitCtrlName in param.unitParamMap) {

            const dev = param.unitParamMap[limitCtrlName];
            const divNode = document.createElement('div');
            divNode.classList.add('uixSmd_plcWrapper');
            const titleNode = document.createElement('h3');
            titleNode.textContent = limitCtrlName;
            contenAccordition.appendChild(titleNode);
            contenAccordition.appendChild(divNode);
//            v.createAndPopulateInterfaceContent(divNode, loggerIFace);
            plc.populateCtrlDevPanel(divNode, limitCtrlName, dev);

            let dataPanel = hh.createActDataPanelCard('Live Data');
            divNode.appendChild(dataPanel);

            plc.poulateMeterLiveDataPanel(dataPanel, dev, plc.convertPlcName(limitCtrlName));
            plc.poulateCtrlDevLiveDataPanel(dataPanel, dev, plc.convertPlcName(limitCtrlName));

        }


        $(contenAccordition).puiaccordion();
    }
};

plc.convertPlcName = function (name) {
    let ser = name;
    while (ser.indexOf(" ") !== -1) {
        ser = ser.replace(" ", "_");
    }
    return ser;
};

plc.populateCtrlDevPanel = function (panelEl, limitCtrlName, param) {
    hh.removeAllChilds(panelEl);
    panelEl.classList.add('actDataContainer');
    console.log(panelEl);
    let ctrlDevCard = hh.createActDataPanelCard("CONTROL INFO");
    panelEl.appendChild(ctrlDevCard);

    let meter = param.meter1Pha || param.meter3Pha;
    let meterLabel = 'N/A';
    let meterValueClass = 'unknown';
    if (meter) {
        meterLabel = meter.serialNumber;
        meterValueClass = meter.serialNumber;
    }
    ctrlDevCard.appendChild(hh.addItemToActDataPanelCard({
        title: "Meter:",
        value: meterLabel,
        valueClass: ["uiplc_" + meterValueClass + "-meterSerial"],
        unit: ""
    }));

    if (meter) {
        ctrlDevCard.appendChild(hh.addItemToActDataPanelCard({
            title: "Meter Type:",
            value: param.meter1Pha ? '1 Phase Meter' : '3 Phase Meter'
        }));
    }

    if (Object.keys(param.controledDevices1PhaSerialMap).length > 0) {
        ctrlDevCard.appendChild(hh.createActDataPanelHeaderElement('1 PHASE CONTROLLED DEVICES'));
        for (var ctrlSer in param.controledDevices1PhaSerialMap) {
            ctrlDevCard.appendChild(hh.addItemToActDataPanelCard({
                title: "Device Serial:",
                value: ctrlSer
            }));
        }
    } else if (Object.keys(param.controledDevices3PhaSerialMap).length > 0) {
        ctrlDevCard.appendChild(hh.createActDataPanelHeaderElement('3 PHASE CONTROLLED DEVICES'));
        for (var ctrlSer in param.controledDevices3PhaSerialMap) {
            ctrlDevCard.appendChild(hh.addItemToActDataPanelCard({
                title: "Device Serial:",
                value: ctrlSer
            }));
        }
    } else {
        ctrlDevCard.appendChild(hh.addItemToActDataPanelCard({
            title: "Controlled Device:",
            value: "Not Available"
        }));

    }

    const button = document.createElement('button');
    button.classList.add('ui-button', 'ctrlExec');
    button.textContent = 'Settings';
    button.type = 'button';
    button.onclick = function (limitCtrlName, param) {
        for (var pName in param) {
            let p = param[pName];
            if (typeof (p) !== 'object') {
                devManager.getSelected().getParam()[pName] = p;
            }
        }

        devManager.getSelected().updataParamControlAll();
        devManager.getSelected().reloadParam();

        plc.settingsPlcSer = limitCtrlName;
        PF('settingsPlcDialogWg').show();
    }.bind(this, limitCtrlName, param);

    ctrlDevCard.appendChild(button);

};

plc.addNewPlcControl = function () {
    mainUtils.setWidgetValue('addNewPlcControlNameWg', '');
    plc.updateMeterDialogTable();
    plc.validateNewCtrlDevDialogInputs();
    PF('addNewPlcControlWg').show();
};

plc.validateNewCtrlDevDialogInputs = function () {
    let name = mainUtils.getWidgetValue('addNewPlcControlNameWg');
    if (name.trim() && name.trim().length > 0) {
        document.querySelector('.selectMeterDevWrapper').style.setProperty('display', 'flex');

        let meter = plc.selectMeterDevSelection;
        if (meter) {
            document.querySelector('.newCtrlDevSelectorWrapper').style.setProperty('display', 'flex');

            let dev = plc.newCtrlDevSelectorPUI.puidatatable('getSelection');
            console.log(dev);
            if (dev && dev.length > 0) {

                PF('addNewPlcControlButtonWg').enable();
            }
        }
    } else {
        document.querySelector('.selectMeterDevWrapper').style.setProperty('display', 'none');
        document.querySelector('.newCtrlDevSelectorWrapper').style.setProperty('display', 'none');

        PF('addNewPlcControlButtonWg').disable();
    }
};

plc.updateMeterDialogTable = function () {
    plc.selectMeterDevSelection = null;
    if (!plc.meterSelectorPUI) {
        plc.meterSelectorPUI = $('#selectMeterDev').puidatatable({
            caption: 'Meter Selection',
            selectionMode: 'single',
            emptyMessage: 'No Available Meters',
            responsive: true,
            columns: [
                {field: 'label'}
            ],
            datasource: plc.meterSelectorPUIData = [],
            rowSelect: function (event, data) {
                plc.selectMeterDevSelection = data.value;
                plc.updateNewCtrlDevDialogTable();
                plc.validateNewCtrlDevDialogInputs();
            }
        });
    }
    let data = devManager.getSelected().getData();
    plc.meterSelectorPUIData.length = 0;
    if (data.serial3PhaMeterMap) {
        for (var serNum in data.serial3PhaMeterMap) {
            plc.meterSelectorPUIData.push({
                label: '3Phase Meter: ' + serNum,
                value: serNum
            });
        }
    }
    if (data.serial1PhaMeterMap) {
        for (var serNum in data.serial1PhaMeterMap) {
            plc.meterSelectorPUIData.push({
                label: '1Phase Meter: ' + serNum,
                value: serNum
            });
        }
    }
    plc.meterSelectorPUI.puidatatable('reload');
};

plc.updateNewCtrlDevDialogTable = function () {
    plc.newCtrlDevSelection = null;
    if (!plc.newCtrlDevSelectorPUI) {
        plc.newCtrlDevSelectorPUI = $('#newCtrlDevSelector').puidatatable({
            caption: 'New Control Dev Selection',
            selectionMode: 'multiple',
            emptyMessage: 'No Control Devices Available',
            responsive: true,
            columns: [
                {field: 'label'}
            ],
            datasource: plc.newCtrlDevSelectorPUIData = [],
            rowSelect: function (event, data) {
                plc.validateNewCtrlDevDialogInputs();
            }
        });
    }
    //populate data
    let data = devManager.getSelected().getData();

    if (data && data.serial3PhaMeterMap) {
        plc.newCtrlDevSelectorPUIData.length = 0;

        for (var serNum in data.powerControl1PhaDevicesMap) {
            plc.newCtrlDevSelectorPUIData.push({
                label: '1Phase Device: ' + serNum,
                value: serNum
            });
        }
        for (var serNum in data.powerControl3PhaDevicesMap) {
            plc.newCtrlDevSelectorPUIData.push({
                label: '3Phase Device: ' + serNum,
                value: serNum
            });

        }
        plc.newCtrlDevSelectorPUI.puidatatable('reload');
    }
};

plc.onNewDeviceButtonClick = function () {
    let name = mainUtils.getWidgetValue('addNewPlcControlNameWg');
    let meter = plc.selectMeterDevSelection;
    let devArr = plc.newCtrlDevSelectorPUI.puidatatable('getSelection');
    let devStr = '';
    for (var i = 0; i < devArr.length; i++) {
        if (i > 0) {
            devStr += ';';
        }
        devStr += devArr[i].value;
    }
    console.log('sdfsdf');
    devManager.sendDevMessage(
            {
                instrExt: 'createDevice',
                instrData: name,
                instrDataExt: meter,
                instrDataIndx: devStr
            },
            function (devMessage, unitArr) { //success
                plc.devPanelParamRefreshRequired = true;
                mainUtils.showInfoMessage('Success', 'New Power Limit Crated ' + name);
                window.setTimeout(devManager.requestParamUpdate, 2000);
                PF('addNewPlcControlWg').hide();
            },
            function (devMessage, errMsg) { //err
                mainUtils.showErrorMessage('Error', errMsg);
                PF('addNewPlcControlWg').hide();
            },
            function () {
                PF('addNewPlcControlWg').hide();
                mainUtils.showErrorMessage('Error', 'Timeout');
            }
    );
};

plc.onDeleteDeviceButtonClick = function () {
    let selectedPlc = plc.settingsPlcSer;

    devManager.sendDevMessage(
            {
                instrExt: 'deleteDevice',
                instrData: selectedPlc
            },
            function (devMessage, unitArr) { //success
                plc.devPanelParamRefreshRequired = true;
                mainUtils.showInfoMessage('Success', 'New Power Limit Crated ' + name);
                window.setTimeout(devManager.requestParamUpdate, 2000);
                PF('addNewPlcControlWg').hide();
            },
            function (devMessage, errMsg) { //err
                mainUtils.showErrorMessage('Error', errMsg);
                PF('addNewPlcControlWg').hide();
            },
            function () {
                PF('addNewPlcControlWg').hide();
                mainUtils.showErrorMessage('Error', 'Timeout');
            }
    );
};


devManager.onDataReceived(plc.onDataUpdate);
devManager.onParamReceived(plc.onParamUpdate);


plc.poulateCtrlDevLiveDataDetailPanel = function (panel, dev, ctrlSer) {
    panel.appendChild(hh.createActDataPanelHeaderElement('Control Info: ' + ctrlSer));
    panel.appendChild(hh.addItemToActDataPanelCard({
        title: "Device Connected:",
        value: 'NA',
        valueClass: ["smdplc-cd_" + ctrlSer + "-available"],
        unit: ""
    }));
    panel.appendChild(hh.addItemToActDataPanelCard({
        title: "Power Limit Enabled:",
        value: 'NA',
        valueClass: ["smdplc-cd_" + ctrlSer + "-limitEnabled"],
        unit: ""
    }));
    panel.appendChild(hh.addItemToActDataPanelCard({
        title: "Requested Increase:",
        value: 'NA',
        valueClass: ["smdplc-cd_" + ctrlSer + "-increase"],
        unit: "kW"
    }));
    panel.appendChild(hh.addItemToActDataPanelCard({
        title: "Target Power:",
        value: 'NA',
        valueClass: ["smdplc-cd_" + ctrlSer + "-target"],
        unit: "kW"
    }));
};

plc.poulateCtrlDevLiveDataPanel = function (panel, dev, plcSerNum) {
    if (dev.controledDevices1PhaSerialMap && Object.keys(dev.controledDevices1PhaSerialMap).length > 0) {
        for (var ctrlSer in dev.controledDevices1PhaSerialMap) {
            panel.appendChild(hh.createActDataPanelHeaderElement('1Phase Controled Device: ' + ctrlSer));
            panel.appendChild(hh.addItemToActDataPanelCard({
                title: "Total Power:",
                value: 'NA',
                valueClass: ["smdplc-cd_" + ctrlSer + "-sumP"],
                unit: "kW"
            }));
            plc.poulateCtrlDevLiveDataDetailPanel(panel, dev, ctrlSer);

        }
    }
    if (dev.controledDevices3PhaSerialMap && Object.keys(dev.controledDevices3PhaSerialMap).length > 0) {
        for (var ctrlSer in dev.controledDevices3PhaSerialMap) {
            panel.appendChild(hh.createActDataPanelHeaderElement('3Phase Controled Device: ' + ctrlSer));
            panel.appendChild(hh.addItemToActDataPanelCard({
                title: "Total Power:",
                value: 'NA',
                valueClass: ["smdplc-cd_" + ctrlSer + "-sumP"],
                unit: "kW"
            }));

            plc.poulateCtrlDevLiveDataDetailPanel(panel, dev, ctrlSer);
        }
    }
};

plc.poulateMeterLiveDataPanel = function (panel, dev, plcSerNum) {
    console.log(dev);

    let meterData = dev.meter1Pha || dev.meter3Pha;
    if (meterData) {
        let serNum = meterData.serialNumber;
        let meterType = '1';
        if (meterData['pha3ExportPower']) {
            meterType = '3';
        }

        panel.appendChild(hh.createActDataPanelHeaderElement(meterType + 'Phase Meter Data'));
        panel.appendChild(hh.addItemToActDataPanelCard({
            title: "Total Power:",
            value: 'NA',
            valueClass: ["smdplc-md_" + serNum + "-sumP"],
            unit: "kW"
        }));
        if (meterType === '3') {
            panel.appendChild(hh.addItemToActDataPanelCard({
                title: "Phase1 Power:",
                value: 'NA',
                valueClass: ["smdplc-md_" + serNum + "-pha1P"],
                unit: "kW"
            }));

            panel.appendChild(hh.addItemToActDataPanelCard({
                title: "Phase2 Power:",
                value: 'NA',
                valueClass: ["smdplc-md_" + serNum + "-pha2P"],
                unit: "kW"
            }));

            panel.appendChild(hh.addItemToActDataPanelCard({
                title: "Phase3 Power:",
                value: 'NA',
                valueClass: ["smdplc-md_" + serNum + "-pha3P"],
                unit: "kW"
            }));

        }
    }

};

plc.createSingleCtrlDevLiveDataPanel = function (serNum, container) {
    let data = plc.ctrlDev1PhaActualDataInit[serNum];
    if (!data) {
        data = plc.ctrlDev3PhaActualDataInit[serNum];
    }
    if (data) {
        let meterType = '1';

        if (data['pha3ExportPower']) {
            meterType = '3';
        }

        let panel = hh.createActDataPanelCard(meterType + "-Phase Controlled Device " + data.serialNumber);
        panel.appendChild(hh.addItemToActDataPanelCard({
            title: "Control Limit Enabled:",
            value: "NA",
            valueClass: ["smdplc-cd_" + serNum + "-control"],
            unit: ""
        }));

        panel.appendChild(hh.createActDataPanelHeaderElement('Sum Power'));
        panel.appendChild(hh.addItemToActDataPanelCard({
            title: "Power Export:",
            value: data.sumExportPower.powerW / 1000,
            valueClass: ["smdplc-cd_" + serNum + "-sumPe"],
            unit: "kW"
        }));

        if (meterType === '3') {

            panel.appendChild(hh.createActDataPanelHeaderElement('Phase 1'));
            panel.appendChild(hh.addItemToActDataPanelCard({
                title: "Power Export:",
                value: data.pha1ExportPower.powerW / 1000,
                valueClass: ["smdplc-cd_" + serNum + "-pha1Pe"],
                unit: "kW"
            }));

            panel.appendChild(hh.createActDataPanelHeaderElement('Phase 2'));
            panel.appendChild(hh.addItemToActDataPanelCard({
                title: "Power Export:",
                value: data.pha2ExportPower.powerW / 1000,
                valueClass: ["smdplc-cd_" + serNum + "-pha2Pe"],
                unit: "kW"
            }));

            panel.appendChild(hh.createActDataPanelHeaderElement('Phase 3'));
            panel.appendChild(hh.addItemToActDataPanelCard({
                title: "Power Export:",
                value: data.pha3ExportPower.powerW / 1000,
                valueClass: ["smdplc-cd_" + serNum + "-pha3Pe"],
                unit: "kW"
            }));



        }
        container.appendChild(panel);
    }
};
