/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, hh, bmsexDM, lvex, ipUtils, wsm, mu, dm */


var lexGUI = {
    initBatComp: {},
    dialog: {},
    fwComp: {},
    idxComp: [],
    dataComp: {
        cluster: {}
    },
    comp: {},
    compParam: {},
    compData: {}
};

lexGUI.initGUI = function () {
    lexGUI.comp.mainTabPanel = new TabPanel(dgm.contentPanel, {
        menuItem: [
            {label: "General Info", id: 'generalInfo'},
            {label: "Actual Data", id: 'actualData'},
            {label: "Network", id: 'network'},
            {label: "Settings", id: 'settings'},
            {label: "Digital Outputs", id: 'digitalOutputs'},
            {label: "Advanced Settings", id: 'advSettings'}
        ],
        stickyMenu: true,
        initSelect: 0,
        onInitComplete: function (tabPanel) {
            if (lexGUI.comp.mainTabs === undefined) {
                lexGUI.comp.mainTabs = {};
            }
            lexGUI.comp.mainTabs.generalInfo = tabPanel.getItemContentById('generalInfo');
            lexGUI.comp.mainTabs.actualData = tabPanel.getItemContentById('actualData');
            lexGUI.comp.mainTabs.settings = tabPanel.getItemContentById('settings');
            lexGUI.comp.mainTabs.dOutputs = tabPanel.getItemContentById('digitalOutputs');
            lexGUI.comp.mainTabs.advSettings = tabPanel.getItemContentById('advSettings');
        }
    });
    lexGUI.initHtmlBasicRatedInfoPanel();
    lexGUI.initHtmlBasicDataPanel();
    lexGUI.initSettingsPanel();
    lexGUI.initDOutputPanel();
    lexGUI.initAdvSettings();
    lexGUI.initDialogs();
};

lexGUI.initAdvSettings = function () {
    let cont = lexGUI.comp.mainTabs.advSettings;
    hh.pPanelAddDescTitle(cont, 'LEx Firmware.');
    new ParamSetting(cont, {
        instrExt: 'exec_readFirmwareContent',
        type: 'dropDownButton',
        title: 'Rewad Frimware Content:',
        content: [{
                name: 'Read',
                cb: lexGUI.onReadFirmwareLexClickDialog
            }, {
                name: 'Refresh Only',
                cb: lexGUI.onReadFirmwareLexClickDialog.bind(null, true)
            }]
    });
    lexGUI.fwComp.applyFwBmuPSettings = new ParamSetting(cont, {
        hidden: true,
        type: 'dropDownButton',
        content: [{
                name: 'Apply Update',
                cb: function () {
                    wsm.sendDevMsgExecWithJsonInst(
                            {instrExt: 'exec_applyFirmwareLVEx'},
                            function (msg, succ) {
                                mu.showInfoMessage('Firmware exec begin ..');
                                dm.selected.setConnected(false);
                            },
                            function (msg, err) {
                                mu.showInfoMessage('Firmware exec begin...');
                                dm.selected.setConnected(false);
                            });
                }
            }]
    });
};

lexGUI.initDialogs = function () {
    lexGUI.initProgressDialogs();
    lexGUI.dialog.fwReadData = new SMDUIDialog({
        modal: false,
        heading: 'Firmware Info',
        draggable: true,
        onInitComplete: function (contentDiv, footerDiv, comp) {
            new TabPanel(contentDiv, {
                menuItem: ["LV-Ex", 'Available Updates'],
                initSelect: 0,
                onInitComplete: function (tabPanel) {
                    contentDiv.style.padding = '0px';
//                    for (var i = 0; i < 1; i++) {

                    let tabContent = tabPanel.getItemContent(0);
                    let cont = document.createElement('div');
                    cont.classList.add('actDataContainer');
//                    cont.style.width = '280px';
                    tabContent.appendChild(cont);
                    let prefix = 'lexFw';
                    let pCont = hh.createActDataPanelCard("LV-Ex FIRMWARE INFO", null, cont);
                    hh.addToPC(pCont, 'Compatible Hardware', [prefix + "_compatibleHardware"]);
                    hh.addToPC(pCont, 'Create Date', [prefix + "_date"]);
                    hh.addToPC(pCont, 'Firmware Version', [prefix + "_fwVersion"]);
                    hh.addToPC(pCont, 'Bootloader State', [prefix + "_imageBlState"]);
                    hh.addToPC(pCont, 'Checksum', [prefix + "_imageChecksum"]);
                    hh.addToPC(pCont, 'Image Len', [prefix + "_imageLen"]);
                    hh.addToPC(pCont, 'Image Len Loaded', [prefix + "_imageLenLoaded"]);
                    hh.addToPC(pCont, 'Ready', [prefix + "_imageReady"]);
                    hh.addToPC(pCont, 'Notes', [prefix + "_notes"]);
//                    }

                    tabContent = tabPanel.getItemContent(1);
                    let availabCont = document.createElement('div');
                    lexGUI.dialog.fwReadDataAvailabCont = availabCont;
                    tabContent.appendChild(availabCont);
                }
            });
        }
    });
};

lexGUI.updateProgLexFw = function (dev, prog, id) {
    mainUtils.setHtmlText("lvExFw-" + dev.serialNumber + "_prog", prog.pState);
    mainUtils.setHtmlText("lvExFw-" + dev.serialNumber + "_text", prog.prop.text);
};

lexGUI.initProgressDialogs = function () {
    dm.onProgressDialogCreate('LV-Ex Update', function (dev, pId, dialog) {
        dialog.setBarTitle(dev.serialNumber + " Firmware Update Progress.");
        hh.addHeaderTitleToPC(dialog.contentDiv, "LV-EX Fw upload", null);
        hh.addToPC(dialog.contentDiv, 'Progress:', ["lvExFw-" + dev.serialNumber + "_prog"], '%');
        hh.addToPC(dialog.contentDiv, 'current Page', ["lvExFw-" + dev.serialNumber + "_text"]);
    });
};

lexGUI.initDOutputPanel = function () {
    let cont = lexGUI.comp.mainTabs.dOutputs;
    cont = hh.div(cont, "devParamPanelWrapper");
    lexGUI.comp.outputToggle = [];
    for (var i = 0; i < 8; i++) {
//        hh.pPanelAddDescTitle(cont, "Output " + (i + 1));
        lexGUI.comp.outputToggle[i] = new ParamSetting(cont, 'toggleState', {
            type: 'switch', title: "Output " + i, ctrlInfo: "Switch on or off", detached: true, extraData: {index: i},
            onSaveSuccess: function (comp, val) {
                comp.setValue(val);
            }
        });
    }
};

lexGUI.initSettingsPanel = function () {
    let setPanel = lexGUI.comp.mainTabs.settings;
    let accPanel = new SMDUIAccordianPanel(setPanel, {
        tabs: [
            {
                label: 'Digital Output Settings'
            },
            {
                label: 'Output Params'
            }]
    });
    let cont = accPanel.dOutputSetPanel = accPanel.getTabContent(0);
    cont = hh.div(cont, "devParamPanelWrapper");



    for (var i = 0; i < 8; i++) {
        hh.pPanelAddDescTitle(cont, "Output " + (i + 1));
        new ParamSetting(cont, 'outputParamArr[' + i + '].defaultState', {
            type: 'inputNumber', title: "Default State", ctrlInfo: "Enable cell temp monitoring.",
        });
        new ParamSetting(cont, 'outputParamArr[' + i + '].timeoutState', {
            type: 'inputNumber', title: "Timeout State", ctrlInfo: "Enable cell temp monitoring."
        });
    }

    cont = accPanel.outputParamPanel = accPanel.getTabContent(1);
    accPanel.dOutputSetPanel.tempSensorCellEnabled = new ParamSetting(cont, 'tempSensorCellEnabled', {
        type: 'switch',
        title: "Temp Sensor Cell Enabled",
        ctrlInfo: "Enable cell temp monitoring.",
        onSaveSuccess: function (comp, val) {
            comp.setValue(val);
        }
    });
    accPanel.dOutputSetPanel.tempSensorCellEnabled = new ParamSetting(cont, 'tempSensorForCalc', {
        type: 'switch',
        title: "Temp Sensor For Calc",
        ctrlInfo: "",
        onSaveSuccess: function (comp, val) {
            comp.setValue(val);
        }
    });
    accPanel.dOutputSetPanel.tempSensorCellEnabled = new ParamSetting(cont, 'outputTimeoutMs', {
        type: 'inputNumber',
        title: "Output Timeout",
        ctrlInfo: "",
        onSaveSuccess: function (comp, val) {
            comp.setValue(val);
        }
    });
    accPanel.dOutputSetPanel.tempSensorCellEnabled = new ParamSetting(cont, 'tempSensorCalb', {
        type: 'inputNumber',
        title: "Temp Sensor Calibration",
        ctrlInfo: "",
        onSaveSuccess: function (comp, val) {
            comp.setValue(val);
        }
    });

};
lexGUI.initHtmlBasicRatedInfoPanel = function () {
    let cont = hh.div(lexGUI.comp.mainTabs.generalInfo, 'actDataContainer');
    let pCont = hh.createActDataPanelCard("DEVICE INFORMATION", null, cont);

    lexGUI.compParam.serialNumber = hh.adf(pCont, 'Serial Number', null);
    lexGUI.compParam.deviceName = hh.adf(pCont, 'Device Name', null);
    lexGUI.compParam.hwVer = hh.adf(pCont, 'Hardware Version', null);
    lexGUI.compParam.fwVer = hh.adf(pCont, 'Firmware Version', null);
    lexGUI.compParam.installedDate = hh.adf(pCont, 'Installation Date', null);
    lexGUI.compParam.manufacturer = hh.adf(pCont, 'Manufacturer', null);
    lexGUI.compParam.manufDate = hh.adf(pCont, 'Manufacturering Date', null);

    pCont = hh.createActDataPanelCard("Network IPv4", null, cont);
    lexGUI.compParam.netIp = hh.adf(pCont, 'IP Address', null);
    lexGUI.compParam.netHostName = hh.adf(pCont, 'Hostname', null);
    lexGUI.compParam.netMacAddress = hh.adf(pCont, 'MAC', null);
};


lexGUI.initHtmlBasicDataPanel = function () {
    let cont = hh.div(lexGUI.comp.mainTabs.actualData, 'actDataContainer');
//     ddToPC(pCont, '__________', ["______"], "____");
    let pCont = hh.createActDataPanelCard("Input State", null, cont);
    for (var i = 0; i < 6; i++) {
        lexGUI.compData['input' + i] = hh.adf(pCont, 'Input ' + (i + 1));
    }
    new SMDUIDockingCard(pCont);

    cont = hh.div(lexGUI.comp.mainTabs.actualData, 'actDataContainer');
    pCont = hh.createActDataPanelCard("Output State", null, cont);
    for (var i = 0; i < 8; i++) {
        lexGUI.compData['output' + i] = hh.adf(pCont, 'Output ' + (i + 1));
    }
    new SMDUIDockingCard(pCont);
};

lexGUI.onReadFirmwareLexClickDialog = function (refreshOnly) {
    wsm.sendDevMsgExecWithJsonInst({
        instrExt: 'exec_readFirmwareLVEx'
    }, function (msg, success) {
        for (var item in success) {
            let ob = success[item];
            mu.setHtmlText(item + '_' + "compatibleHardware", ob.compatibleHardware);
            mu.setHtmlText(item + '_' + "date", moment(ob.date).format('YYYY MMM D hh:mm'));
            mu.setHtmlText(item + '_' + "fwVersion", ob.fwVersion);
            mu.setHtmlText(item + '_' + "imageBlState", ob.imageBlState);
            mu.setHtmlText(item + '_' + "imageChecksum", ob.imageChecksum);
            mu.setHtmlText(item + '_' + "imageLen", ob.imageLen);
            mu.setHtmlText(item + '_' + "imageLenLoaded", ob.imageLenLoaded);
            mu.setHtmlText(item + '_' + "imageReady", ob.imageReady);
            mu.setHtmlText(item + '_' + "notes", ob.notes);
            if (refreshOnly !== true) {
                lexGUI.dialog.fwReadData.open();
            }

            if (item === 'lexFw') {
                let ps = lexGUI.fwComp.applyFwBmuPSettings;
                ps.show();
                ps.setLabelText('LV-Ex Apply Update: ' + ob.fwVersion + ':');
                ps.setInfoText("Request Firmware Update for version [" + ob.fwVersion + '] created Date[' + moment(ob.date).format('YYYY MMM D hh:mm') +
                        ']. This will shutdown LV-Ex for the time firmware is verified to the main memory of the unit.');
            }

        }


        let availableCnt = lexGUI.dialog.fwReadDataAvailabCont;
        hh.removeAllChilds(availableCnt);
        if (typeof (success.available.lvex) === 'object') {
            hh.pPanelAddDescTitle(availableCnt, 'Available Updates for LV-Ex');
            for (var uId in success.available.lvex) {
                let update = success.available.lvex[uId];
                new ParamSetting(availableCnt, 'availabUpdatepCtrlBmuH8_' + uId, {
                    detached: true,
                    type: 'dropDownButton',
                    title: 'LV-Ex Fw:' + uId,
                    ctrlInfo: 'Firmware Additional Info: ' + update.notes || "",
                    content: [{
                            name: 'Send FW ' + uId,
                            cb: function () {
                                wsm.sendDevMsgExecWithJsonInst({
                                    instrExt: 'exec_writeFirmwareLVEx',
                                    fileName: update.fileName
                                });
                            }
                        }]
                });
            }

        } else {
            hh.pPanelAddDescTitle(availableCnt, 'NO Available Updates for LV-Ex Found.');
        }

    }, function (msg, err) {
        debugger;
    });
};





