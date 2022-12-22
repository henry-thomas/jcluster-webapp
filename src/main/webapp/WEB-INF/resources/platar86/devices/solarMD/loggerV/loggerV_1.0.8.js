/* global logCon, PF, sendConfigReadReq, mainUtils, devManager, htmlUtils, mu, hh, moment, dm, wsm, ipUtils, lvui */

var lv = {
    interfaces: {},
    interfaceSettingSelection: null,
    progressActive: false,
    wsConnInit: false,
    dataContent: {}
};

lv.updataDataProgressBar = function (data, progressBar) {
    let pbWg = PF('devProgresDialog');
    if (lv.progressActive === true && (!progressBar || progressBar.progressState === -1)) {
        pbWg.closeIcon.show();
        lv.progressActive = false;
        PF('devProgresDialogBar').setValue(100);
        return;
    } else if (lv.progressActive === false && progressBar && progressBar.progressState >= 0) {
        PF('devProgresDialogBar').setValue(0);
        pbWg.closeIcon.hide();
        lv.progressActive = true;
        pbWg.show();
    }
    if (progressBar && pbWg.isVisible()) {
        if (progressBar.completeMessage) {
            mainUtils.setHtmlText('uixSmd_progresBarMessageComplete', progressBar.completeMessage);
        }
        mainUtils.setHtmlText('uixSmd_progresBarMessage', progressBar.message);
        PF('devProgresDialogBar').jqLabel.show();
        pbWg.titlebar[0].querySelector('.ui-dialog-title').textContent = progressBar.title;
        PF('devProgresDialogBar').jqLabel.text(progressBar.progressMessage);
        PF('devProgresDialogBar').setValue(progressBar.progressState);
    }
};

lv.updateInterfaceStatusDataCANBUS = function (iface, ifaceName, iFaceInfo) {
    let lineSttus = 'unknown';
    switch (iFaceInfo.busError) {
        case 0:
            lineSttus = 'BUS Disabled';
            break;
        case 1:
            lineSttus = 'BUS Disconnected';
            break;
        case 2:
            lineSttus = 'Driver ERROR';
            break;
        case 3:
            lineSttus = 'Hardware ERROR';
            break;
        case 4:
            lineSttus = 'Connected';
            break;
        case 5:
            lineSttus = 'Initialization';
            break;
    }

    if (iFaceInfo.slaveStatus !== undefined) {
        mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_slaveStatus", iFaceInfo.slaveStatus);
    }
    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_operMode", iFaceInfo.operMode);
    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_line", lineSttus);

    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_busSpeed", iFaceInfo.busSpeed / 1000, 1);

    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_busTxRxLoad", (iFaceInfo.busTxLoad / 1000).toFixed(1) + ' / ' + (iFaceInfo.busRxLoad / 1000).toFixed(1));
    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_busLoad", ((iFaceInfo.busTxLoad + iFaceInfo.busRxLoad) / iFaceInfo.busSpeed) * 100, 1);

//    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_busRxLoad", iFaceInfo.busRxLoad / 1000, 1);
//    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_busTxLoad", iFaceInfo.busTxLoad / 1000, 1);

    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_rxBytes", iFaceInfo.rxBytes / 1000, 2);
    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_txBytes", iFaceInfo.txBytes / 1000, 2);
    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_txFrame", iFaceInfo.txFrame, 1);
    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_rxFrame", iFaceInfo.rxFrame, 1);
    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_errRxTxCounter", iFaceInfo.errRxTxCounter);
};

lv.updateInterfaceStatusDataSERIAL = function (iface, ifaceName, iFaceInfo) {
    let lineSttus = 'unknown';

    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_operMode", iFaceInfo.operMode);
    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_busSpeed", iFaceInfo.config.bitrate);

    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_serialConf", iFaceInfo.config.configStringWithoutBitrate);


    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_busRxLoad", iFaceInfo.busRxLoad);
    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_busTxLoad", iFaceInfo.busTxLoad);

    let a = (iFaceInfo.busRxLoad + iFaceInfo.busTxLoad);
    if (a > 0 && iFaceInfo.config.bitrate) {
        a = (a / iFaceInfo.config.bitrate) * 100;

    }
    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_totalLoad", a, 1);

    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_rxBytes", iFaceInfo.rxBytes / 1000, 1);
    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_txBytes", iFaceInfo.txBytes / 1000, 1);
    mainUtils.setHtmlText("uixp-iFace-" + ifaceName + "_eFrame", iFaceInfo.eFrame);


    let tableDiv = lv.interfaceStatusSerialProtTable[ifaceName];
    if (tableDiv) {
        hh.removeAllChilds(tableDiv);
        let tableContent = {header: ['Device', 'Protocol'], item: []};

        for (var dsName in iFaceInfo.deviceServiceNameProtocolNameMap) {
            let devLabel = lv.getSupportedDeviceIndoByServiceName(dsName).label;
            tableContent.item.push([devLabel, iFaceInfo.deviceServiceNameProtocolNameMap[dsName]]);
        }
        tableDiv.appendChild(hh.createItemTableToActDataPanelCard(tableContent));
    }

};

lv.updateParam = function (param) {
    try {
        if (Number(dm.selected.param.hwVer) >= 220) {
            if (!lvui.panel.lvmHwData) {
                lvui.createLvmHwDataCard();
            }
            lvui.panel.lvmHwData.updateFields(param.lvmVersion);
        }
    } catch (e) {
        console.warn(e);
    }

    document.getElementsByClassName('param-hwVer')[0].textContent = param.hwVer;
    document.getElementsByClassName('param-swVer')[0].textContent = param.swVer;
    document.getElementsByClassName('param-hardware')[0].textContent = param.hardware;
    document.getElementsByClassName('param-availableCpu')[0].textContent = param.availableCpu;
//    document.getElementsByClassName('param-hardwareSer')[0].textContent = param.hardwareSer;
    document.getElementsByClassName('param-hardwareRev')[0].textContent = param.hardwareRev;
//    document.getElementsByClassName('param-hardwareModel')[0].textContent = param.hardwareModel;
    document.getElementsByClassName('param-maxCpuFrequency')[0].textContent = (param.minCpuFrequency / 1000).toFixed(0);
    document.getElementsByClassName('param-minCpuFrequency')[0].textContent = (param.maxCpuFrequency / 1000).toFixed(0);
    document.getElementsByClassName('param-osArch')[0].textContent = param.osArch;
    document.getElementsByClassName('param-osName')[0].textContent = param.osName;
    document.getElementsByClassName('param-osVersion')[0].textContent = param.osVersion;
    document.getElementsByClassName('param-javaVersion')[0].textContent = param.javaVersion;
    document.getElementsByClassName('param-memTotal')[0].textContent = (param.memTotal / 1000).toFixed(0);
};

lv.updateData = function (data) {
    document.getElementsByClassName('data-cpuTemp')[0].textContent = data.cpuTemp;
    document.getElementsByClassName('data-cpuactualFreq')[0].textContent = (data.cpuactualFreq / 1000).toFixed(0);
    document.getElementsByClassName('data-cpuUsage')[0].textContent = data.cpuUsage.toFixed(1);
    document.getElementsByClassName('data-localTime')[0].textContent = moment(new Date(data.localTime)).format("YYYY/MMM/DD hh:mm:ss");
    document.getElementsByClassName('data-uptime')[0].textContent = mainUtils.getTimeFromSecconds(data.uptime);
    document.getElementsByClassName('data-memAvailable')[0].textContent = (data.memAvailable / 1000).toFixed(0);
    document.getElementsByClassName('data-memFree')[0].textContent = (data.memFree / 1000).toFixed(0);
    lv.updataDataProgressBar(data, data.currentProgress);

    for (var iFaceName in data.interfaceInfoMap) {
        for (var i = 0; i < lv.interfaces.length; i++) {
            if (lv.interfaces[i].interfaceName === iFaceName) {
                let iface = lv.interfaces[i];
                let iFaceInfo = data.interfaceInfoMap[iFaceName];
                let ifaceName = iFaceInfo.interfaceName;
                switch (iface.category) {
                    case 'CANBUS':
                        {
                            lv.updateInterfaceStatusDataCANBUS(iface, ifaceName, iFaceInfo);
                        }
                        break;
                    case 'SERIAL':
                        {
                            lv.updateInterfaceStatusDataSERIAL(iface, ifaceName, iFaceInfo);
                        }
                        break;
                }
                break;
            }
        }
    }


    if (Number(dm.selected.param.swVer) >= 8.3231) {
        let actDataCont = document.getElementById('loggerActualData');
        for (var i in data.wsConn) {
            let cs = data.wsConn[i];
            if (lv.dataContent[i] === undefined) {
                let cont = hh.createActDataPanelCard((cs.type === 'remote' ? 'Cloud' : 'Local') + " Connection ", null, actDataCont);
                lv.dataContent[i] = {};
                let url = cs.url.substr(5);
                url = url.substr(0, url.indexOf('/'));
                lv.dataContent[i].url = hh.adf(cont, 'Connection Server'); //el, title, unit, confOb
                lv.dataContent[i].url.value = url;
                lv.dataContent[i].uptime = hh.adf(cont, 'Connection Uptime'); //el, title, unit, confOb
            }
            if (cs.uptime <= 0) {
                lv.dataContent[i].uptime.value = 'Not Connected';
            } else {
                lv.dataContent[i].uptime.value = mu.getTimeFromSeconds(cs.uptime);
            }
        }

        if (!lv.dataContent.webContVer) {
            let cont = hh.createActDataPanelCard("Local Web Server ", null, actDataCont);
            lv.dataContent.webContVer = hh.adf(cont, 'Version'); //el, title, unit, confOb
            lv.dataContent.checkForUpdate = hh.adf(cont, 'Web Content Update', {
                value: 'Check Now',
                valueOnClick: function () {

                    wsm.sendDevMsgExecWithJsonInst(
                            {
                                instrExt: 'checkForWebContUpdate',
                                showMessage: true
                            });
                }
            }); //el, title, unit, confOb
        }
        lv.dataContent.webContVer.value = dm.selected.param.webContVersion;
    }
};
lv.onLoggerWebContProgressData = function (dev, prog, id) {
    lv.dataContent.loggerWebUpdatePrg.value = prog.pState;
    lv.dataContent.loggerWebUpdatePrgState.html = prog.prop.text;
};

dm.onProgressDialogCreate('LoggerWebUpdatePrg', function (dev, pId, dialog) {
    dialog.setBarTitle(dev.serialNumber + "Web Content Update.");
    hh.addHeaderTitleToPC(dialog.contentDiv, "Web Content Update", null);

    lv.dataContent.loggerWebUpdatePrg = hh.adf(dialog.contentDiv, 'Progress', '%');
    lv.dataContent.loggerWebUpdatePrgState = hh.adf(dialog.contentDiv, ' ');
});
dm.onProgressData('LoggerWebUpdatePrg', lv.onLoggerWebContProgressData);

devManager.onSelectedDataReceived(function (dev, data) {
    lv.updateData(data);
});

devManager.onSelectedParamInit(function (dev, data) {
    lv.updateParam(dev.getParam());
    selectedDevRefreshCallback(dev);

    if (Number(dm.selected.param.swVer) >= 8.3231) {
        if (!lv.wsConnInit) {
            lv.wsConnInit = true;
            let cont = document.getElementById('loggerActualData');


        }
    }
});

lv.createAndPopulateInterfaceList = function () {
    if (lv.interfaces !== undefined) {
        const rootPanel = document.getElementById('interfaceMainPannel');
        while (rootPanel.firstChild) {
            rootPanel.removeChild(rootPanel.firstChild);
        }

        lv.interfaces.sort(function (a, b) {
            if (a.interfaceName < b.interfaceName)
                return -1;
            if (a.interfaceName > b.interfaceName)
                return 1;
            return 0;
        });

        for (var i = 0; i < lv.interfaces.length; i++) {
            const loggerIFace = lv.interfaces[i];
            if (Number(dm.selected.fwVer) > 7) {
                loggerIFace.interfaceType = loggerIFace.type;
            } else {
                loggerIFace.interfaceType = lv.interfaceTypeIntToTypeEnumMap(loggerIFace.interfaceType);
                loggerIFace.type = loggerIFace.interfaceType;
            }
            const divNode = document.createElement('div');
            divNode.classList.add('uixSmd_ifWrapper');
            const titleNode = document.createElement('h3');
            titleNode.textContent = lv.translateInterfaceNameFullMap[loggerIFace.interfaceName] || loggerIFace.interfaceName;
            rootPanel.appendChild(titleNode);
            rootPanel.appendChild(divNode);
            lv.createAndPopulateInterfaceContent(divNode, loggerIFace);
        }

        $('#interfaceMainPannel').puiaccordion();
    }
};

lv.createAndPopulateInterfaceContent = function (div, interface) {
    //  <!--<div class="actDataPanelCard" id="testIdPanel"  style="margin: auto;">-->
    const headerPanel = document.createElement('div');
    headerPanel.classList.add('uixSmd_ifHeader');
    div.appendChild(headerPanel);

    const headerTitle = document.createElement('span');
    headerTitle.textContent = lv.translateInterfaceInfoMap[interface.interfaceName] || ' ';
    headerPanel.appendChild(headerTitle);
    const headerImg = document.createElement('img');
    if (interface.interfaceName.indexOf("USB-1") > 0) {
        headerImg.src = mu.getContextPath() + '/defaultImages/logger/iface_USB1.png';
    } else if (interface.interfaceName.indexOf("USB-2") > 0) {
        headerImg.src = mu.getContextPath() + '/defaultImages/logger/iface_USB2.png';
    } else {
        headerImg.src = mu.getContextPath() + '/defaultImages/logger/iface_' + interface.interfaceName + '.png';
    }
    headerImg.classList.add('uixSmd_ifHeaderImg');
    headerPanel.appendChild(headerImg);


    const contentPanel = document.createElement('div');
    contentPanel.classList.add('uixSmd_ifContent');
    div.appendChild(contentPanel);

    const contentTitle = document.createElement('span');
    contentTitle.textContent = 'Enabled devices:';
    contentPanel.appendChild(contentTitle);

    const contentUlPanel = document.createElement('div');
    contentUlPanel.classList.add('uixSmd_ifContentWrapper');
    var reloadInterfaceCb = lv.createAndPopulateInterfaceEnabledDevices.bind(this, contentUlPanel, interface);
    lv.createAndPopulateInterfaceEnabledDevices(contentUlPanel, interface);
    contentPanel.appendChild(contentUlPanel);

    const footerPanel = document.createElement('div');
    footerPanel.classList.add('uixSmd_ifFooter');
    div.appendChild(footerPanel);


    footerPanel.appendChild(mainUtils.createSeparator());

    const iFaceActualDataCont = document.createElement('div');
    iFaceActualDataCont.classList.add('actDataContainer');
    footerPanel.appendChild(iFaceActualDataCont);

    let iFaceActualData = hh.createActDataPanelCard('INTERFACE STATISTIC');
    iFaceActualDataCont.appendChild(iFaceActualData);

    lv.createInterfaceStatPane(iFaceActualData, interface);

    footerPanel.appendChild(mainUtils.createSeparator());

    const footerControlPanel = document.createElement('div');
    footerControlPanel.classList.add('uixSmd_ifFooterControl');
    footerPanel.appendChild(footerControlPanel);

    let addNewButton = hh.button(footerControlPanel, 'Add Device');
    addNewButton.onclick = function (iFace) {
        if (div.treeSlectorContent === undefined) {
            div.treeSlectorContent = lv.populateInterfaceDialogSelection(lv.supportedDevicesByIFace[iFace.interfaceType], iFace);
        }

        let dilogtreeContent = document.getElementById('interfaceDialogSlectionContent');
        while (dilogtreeContent.firstChild) {
            dilogtreeContent.removeChild(dilogtreeContent.firstChild);
        }
        dilogtreeContent.appendChild(div.treeSlectorContent[0]);



        document.getElementById('addDeviceDialogSaveWg').onclick = function (iFace, reloadCb) {
            PF('addDeviceDialogWg').hide();
            if (lv.interfaceDilogSelectionTree) {
                //check first for compatabilities
                devManager.sendDevMessage(
                        {
                            instrExt: 'addDeviceToInterface',
                            instrData: lv.translateServiceNameSimple(lv.interfaceDilogSelectionTree),
                            instrDataExt: iFace.interfaceName
                        },
                        function (devMessage, unitArr) { //success
                            lv.deviceInterfaceConn.push({
                                interfaceDevPath: iFace.devPath,
                                interfaceName: iFace.interfaceName,
                                interfaceType: iFace.interfaceType,
                                serviceName: lv.interfaceDilogSelectionTree,
                                serviceNameSimple: lv.translateServiceNameSimple(lv.interfaceDilogSelectionTree)
                            });

                            reloadCb();

                            console.log('Success Add Device support for device ' + iFace.interfaceName);
                            mainUtils.showInfoMessage('Success add Device support for device ' + iFace.interfaceName);
                        }
                );
            } else {

            }
        }.bind(document.getElementById('addDeviceDialogSaveWg'), iFace, reloadInterfaceCb);

//        PF('addDeviceDialogSaveWg').disable();
        document.getElementById('addDeviceDialogSaveWg').disabled = true;
        document.getElementById('addDeviceDialogSaveWg').classList.add('ui-state-disabled');

        //ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-state-disabled
        PF('addDeviceDialogWg').show();

    }.bind(addNewButton, interface, div, reloadInterfaceCb);

//    footerControlPanel.appendChild(addNewButton);


    if (interface.interfaceType === 'SERIAL_RS485' || interface.interfaceType === 'SERIAL_RS232') { //only for RS485 custom buttons
        let iFaceSettingButton = hh.button(footerControlPanel, 'Interface Settings');
        iFaceSettingButton.onclick = function (iFace) {
            lv.openIterfaceRs485Settings(iFace);
        }.bind(iFaceSettingButton, interface, div, reloadInterfaceCb);

        let iFaceModbusDebufButton = hh.button(footerControlPanel, 'MODBUS DEBUG TOOL');
        iFaceModbusDebufButton.onclick = function (iFace) {
            lv.modbusDebug.openDialog(iFace);
        }.bind(iFaceModbusDebufButton, interface, div, reloadInterfaceCb);

    }

    if (interface.interfaceType === 'CANBUS') {
        let iFaceDumpButton = hh.button(footerControlPanel, 'Dump');
        iFaceDumpButton.onclick = function () {
            lv.canbusDump.openDialog(interface);
        }.bind(this);

        let iFaceCanClearStat = hh.button(footerControlPanel, 'Reset Statistic');
        iFaceCanClearStat.onclick = function () {
            console.log(interface);

            dm.sendDevMessage({
                    instrExt: "canResetStatData",
                    instrDataJson: { port: interface.interfaceName }
            },
                    function (devMessage, unitArr) { //success
                        mu.showInfoMessage('Stat Reset', 'Success Interface Statistic Reset  ' + interface.interfaceName);
                    }
            );

        }.bind(this);
    }
};

lv.sentInterfaceSettingRs485 = function (instr, wgName) {
    devManager.executeInstr(instr, lv.interfaceSettingSelection, mainUtils.getWidgetValue(wgName));
};

lv.openIterfaceRs485Settings = function (interface) {
    lv.interfaceSettingSelection = interface.interfaceName;
    let iFaceSpeed = 9600;
    try {
        iFaceSpeed = devManager.getSelected().getData().interfaceInfoMap[interface.interfaceName].busSpeed;
    } catch (e) {
    }

    //ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-state-disabled
    mainUtils.setWidgetValue('iFaceRs485SpeedParamWg', iFaceSpeed);
    PF('rs485ConfigDialogWg').show();

};

lv.createInterfaceStatPane = function (panel, iFace) {
    switch (iFace.category) {
        case 'ETHERNET':
            {

            }
            break;
        case 'CANBUS':
            {
                if (iFace.remote) {
                    panel.appendChild(hh.addItemToActDataPanelCard({title: "Slave Logger Status:", value: ' ', valueClass: ["uixp-iFace-" + iFace.interfaceName + "_slaveStatus"]}));
                }
                panel.appendChild(hh.addItemToActDataPanelCard({title: "Interface Status:", value: ' ', valueClass: ["uixp-iFace-" + iFace.interfaceName + "_operMode"]}));
                panel.appendChild(hh.addItemToActDataPanelCard({title: "Line Status:", value: ' ', valueClass: ["uixp-iFace-" + iFace.interfaceName + "_line"]}));
                panel.appendChild(hh.addItemToActDataPanelCard({title: "Bitrate:", value: ' ', valueClass: ["uixp-iFace-" + iFace.interfaceName + "_busSpeed"], unit: 'kbit/s'}));

                panel.appendChild(hh.addItemToActDataPanelCard({title: "Tx / Rx Rate:", value: ' ', valueClass: ["uixp-iFace-" + iFace.interfaceName + "_busTxRxLoad"], unit: 'kbit/s'}));
                panel.appendChild(hh.addItemToActDataPanelCard({title: "Bus Load:", value: ' ', valueClass: ["uixp-iFace-" + iFace.interfaceName + "_busLoad"], unit: '%'}));

                panel.appendChild(hh.addItemToActDataPanelCard({title: "Transmit Bytess:", value: ' ', valueClass: ["uixp-iFace-" + iFace.interfaceName + "_txBytes"], unit: 'kbyte'}));
                panel.appendChild(hh.addItemToActDataPanelCard({title: "Received Bytess:", value: ' ', valueClass: ["uixp-iFace-" + iFace.interfaceName + "_rxBytes"], unit: 'kbyte'}));

                panel.appendChild(hh.addItemToActDataPanelCard({title: "Total Transmit Frames:", value: ' ', valueClass: ["uixp-iFace-" + iFace.interfaceName + "_txFrame"], unit: 'f'}));
                panel.appendChild(hh.addItemToActDataPanelCard({title: "Total Received Frames:", value: ' ', valueClass: ["uixp-iFace-" + iFace.interfaceName + "_rxFrame"], unit: 'f'}));

                panel.appendChild(hh.addItemToActDataPanelCard({title: "Rx/Tx Error Counter:", value: ' ', valueClass: ["uixp-iFace-" + iFace.interfaceName + "_errRxTxCounter"], unit: ''}));
            }
            break;
        case 'SERIAL':
            {
                panel.appendChild(hh.addItemToActDataPanelCard({title: "Interface Status:", value: ' ', valueClass: ["uixp-iFace-" + iFace.interfaceName + "_operMode"]}));
                panel.appendChild(hh.addItemToActDataPanelCard({title: "Bitrate:", value: ' ', valueClass: ["uixp-iFace-" + iFace.interfaceName + "_busSpeed"], unit: 'b/s'}));
                panel.appendChild(hh.addItemToActDataPanelCard({title: "Settings:", value: ' ', valueClass: ["uixp-iFace-" + iFace.interfaceName + "_serialConf"]}));

                panel.appendChild(hh.createActDataPanelHeaderElement(' '));

                panel.appendChild(hh.addItemToActDataPanelCard({title: "Transmit Speed:", value: ' ', valueClass: ["uixp-iFace-" + iFace.interfaceName + "_busTxLoad"], unit: 'bit/s'}));
                panel.appendChild(hh.addItemToActDataPanelCard({title: "Received Speed:", value: ' ', valueClass: ["uixp-iFace-" + iFace.interfaceName + "_busRxLoad"], unit: 'bit/s'}));
                panel.appendChild(hh.addItemToActDataPanelCard({title: "Total Utilization:", value: ' ', valueClass: ["uixp-iFace-" + iFace.interfaceName + "_totalLoad"], unit: '%'}));

                panel.appendChild(hh.createActDataPanelHeaderElement('TRAFIC COUNTERS'));

                panel.appendChild(hh.addItemToActDataPanelCard({title: "Transmit Bytess:", value: ' ', valueClass: ["uixp-iFace-" + iFace.interfaceName + "_txBytes"], unit: 'kbyte'}));
                panel.appendChild(hh.addItemToActDataPanelCard({title: "Received Bytess:", value: ' ', valueClass: ["uixp-iFace-" + iFace.interfaceName + "_rxBytes"], unit: 'kbyte'}));
                panel.appendChild(hh.addItemToActDataPanelCard({title: "Error Frames:", value: ' ', valueClass: ["uixp-iFace-" + iFace.interfaceName + "_eFrame"], unit: ''}));

                panel.appendChild(hh.createActDataPanelHeaderElement('INSTALLED PROTOCOLS'));
                let protocolTableDiv = document.createElement('div');
                panel.appendChild(protocolTableDiv);
                if (lv.interfaceStatusSerialProtTable === undefined) {
                    lv.interfaceStatusSerialProtTable = {};
                }

                lv.interfaceStatusSerialProtTable[iFace.interfaceName] = protocolTableDiv;
            }
            break;
    }
};

lv.populateInterfaceDialogSelection = function (suppDevices, iFace) {
    console.log(' addNewButton.onclick');
    let tree = {animate: true,
        selectionMode: 'single',
        nodes: []
    };
    for (var manufacturer in suppDevices) {
        let typeObj = suppDevices[manufacturer];
        let ndT = {
            label: manufacturer,
            children: []
        };

        for (var devLabel in typeObj) {

            let devObj = typeObj[devLabel];
            let devT = {
                label: devLabel,
                children: []
            };
            for (var devName in devObj) {
                let dev = devObj[devName];

                devT.children.push({
                    label: devName,
                    iconType: 'picture',
                    data: dev.sName
                });
            }

            ndT.children.push(devT);
        }


        tree.nodes.push(ndT);
    }
    ;
    tree.nodeSelect = function (event, node, data) {
        if (node.node.hasClass('ui-treenode-leaf')) {
//            PF('addDeviceDialogSaveWg').enable();
            document.getElementById('addDeviceDialogSaveWg').disabled = false;
            document.getElementById('addDeviceDialogSaveWg').classList.remove('ui-state-disabled');

            lv.interfaceDilogSelectionTree = node.data;
//            console.log(event, node);
        } else {
            document.getElementById('addDeviceDialogSaveWg').disabled = true;
            document.getElementById('addDeviceDialogSaveWg').classList.add('ui-state-disabled');

        }
    };
    tree.nodeUnselect = function (event, ui) {
        PF('addDeviceDialogSaveWg').disable();
    };

    let treeEl = $(document.createElement('div')).puitree(tree);
    return treeEl;
};

lv.createAndPopulateInterfaceEnabledDevices = function (divWrapper, interface) {
    //clear div first
    while (divWrapper.firstChild) {
        divWrapper.removeChild(divWrapper.firstChild);
    }

    const devIFaceObj = lv.supportedDevicesByIFace[interface.interfaceType];
    if (!devIFaceObj) {
        // return;
    }

    let conDevArr = {};
    let devCount = 0;
    for (var i = 0; i < lv.deviceInterfaceConn.length; i++) {
        let connectedDev = lv.deviceInterfaceConn[i];
//        connectedDev.interfaceType = lv.interfaceTypeIntToTypeEnumMap(connectedDev.interfaceType);
        if (connectedDev.interfaceType === interface.interfaceType && connectedDev.interfaceName === interface.interfaceName) {
            let devDescT = lv.getSupportedDeviceIndoByServiceName(connectedDev.serviceName);
            if (!devDescT.valid) {
                console.warn("can not find dev Desc", connectedDev.serviceName);
            }
            let devDescNameT = devDescT.manufacturer + " - " + devDescT.type;
            if (conDevArr[devDescNameT] === undefined) {
                conDevArr[devDescNameT] = [];
            }
            conDevArr[devDescNameT].push({
                label: devDescT.label,
                serviceName: connectedDev.serviceName,
                index: i
            });
            devCount++;
        }
    }

    for (var supportDevManType in conDevArr) {
        let sdTitleArr = conDevArr[supportDevManType];
        //create man title
        let manTitleEl = document.createElement('span');
        manTitleEl.classList.add('uixSmd_ifContentDevMan');
        manTitleEl.textContent = supportDevManType;
        divWrapper.appendChild(manTitleEl);

        //populate devices
        for (var i = 0; i < sdTitleArr.length; i++) {
            let devName = sdTitleArr[i].label;
            let serviceName = sdTitleArr[i].serviceName;
            let deviceDesc = lv.getSupportedDeviceIndoByServiceName(serviceName);

            let devLabDiv = document.createElement('div');
            devLabDiv.classList.add('uixSmd_ifContentDev');
            divWrapper.appendChild(devLabDiv);

            let devLabSpan = document.createElement('span');
            devLabSpan.textContent = devName;
            devLabDiv.appendChild(devLabSpan);

            let devLabDelIcon = document.createElement('i');
            devLabDelIcon.classList.add('fa');
            devLabDelIcon.classList.add('fa-remove');
            devLabDiv.appendChild(devLabDelIcon);

            devLabDelIcon.onclick = function (devName, serviceName, divWrapper, interface, idx) {
//                console.log(serviceName);
                let simpleName = lv.translateServiceNameSimple(serviceName);

                devManager.sendDevMessage(
                        {
                            instrExt: 'removeDeviceFromInterface',
                            instrData: simpleName,
                            instrDataExt: interface.interfaceName
                        },
                        function (devMessage, unitArr) { //success
                            console.log('Success remove Device support for device ' + simpleName);
                            mainUtils.showInfoMessage('Success remove Device support for device ' + simpleName);
                            lv.deviceInterfaceConn.splice(idx, 1);
                            lv.createAndPopulateInterfaceEnabledDevices(divWrapper, interface);
                        }
                );
            }.bind(devLabDelIcon, devName, serviceName, divWrapper, interface, sdTitleArr[i].index);

            //add misc function button
            if (deviceDesc && deviceDesc.miscFn !== undefined) {
                let devSettingIcon = hh.button(null, {label: 'Scan ', faIcon: 'search'});
                devSettingIcon.style.color = "";
                devLabDiv.appendChild(devSettingIcon);
                devSettingIcon.onclick = deviceDesc.miscFn.bind(devSettingIcon, devName, serviceName, divWrapper, interface, sdTitleArr[i].index);
            }
            //add function button
            if (deviceDesc && deviceDesc.utilFn !== undefined) {
                let devSettingIcon = hh.button(null, {label: deviceDesc.utilFnName + " " || "Scan for Device ", faIcon: 'search'});
                devSettingIcon.style.color = "";
                devSettingIcon.textContent = deviceDesc.utilFnName || "Scan for Device";
                devLabDiv.appendChild(devSettingIcon);
                devSettingIcon.onclick = deviceDesc.utilFn.bind(devSettingIcon, devName, serviceName, divWrapper, interface, sdTitleArr[i].index);
            }
        }
    }

    if (devCount === 0) {
        let manTitleEl = document.createElement('span');
        manTitleEl.classList.add('uixSmd_ifContentDevMan');
        manTitleEl.textContent = "No Deveces enabled for this interface.";
        divWrapper.appendChild(manTitleEl);
    }


//    console.log(devIFaceObj);
};

function selectedDevRefreshCallback(dev, dataClass) {
    if (lv.initInterfaces === undefined) {
        devManager.sendDevMessage(
                {
                    instrExt: 'getInterfaceList',
                    instrData: devManager.getSelected().serialNumber
                },
                function (devMessage, unitArr) { //success
                    lv.initInterfaces = true;
                    lv.interfaces = unitArr;
                    devManager.sendDevMessage(
                            {
                                instrExt: 'getSupportedDevice',
                                instrData: devManager.getSelected().serialNumber
                            },
                            function (devMessage, unitArr) { //success
                                lv.updateSupportedDevices(unitArr);
                                devManager.sendDevMessage(
                                        {
                                            instrExt: 'getDeviceInterfaceConnList',
                                            instrData: devManager.getSelected().serialNumber
                                        },
                                        function (devMessage, unitArr) { //success
                                            lv.deviceInterfaceConn = unitArr;
                                            for (var item in lv.deviceInterfaceConn) {
                                                lv.deviceInterfaceConn[item].interfaceType = lv.interfaceTypeIntToTypeEnumMap(lv.deviceInterfaceConn[item].interfaceType);
                                            }
                                            lv.createAndPopulateInterfaceList();
                                        }
                                );
                            }
                    );
                }
        );
    }

    if (!lv.initConfTable) {
        console.log('request ConfTable');
        lv.requestObject('getAllConfigs', lv.updateConfigTable);
    }
//    if (lv.prodAvailable) {
//        if (!lv.prodInit) {
//            lv.prodInit = true;
//            lv.updateProdValue();
//        }
//    }
//    lv.updateData(dev.getData());
}

lv.updateSupportedDevices = function (unitArr) {
    lv.supportedDevices = unitArr;
    lv.supportedDevicesByIFace = {};
    for (var i = 0; i < unitArr.length; i++) {
        let dev = unitArr[i];
        if (Number(dm.selected.fwVer) > 7) {
            dev.interfaceDescriptor.interfaceType = dev.interfaceDescriptor.type;
        } else {
            dev.interfaceDescriptor.interfaceType = lv.interfaceTypeIntToTypeEnumMap(dev.interfaceDescriptor.interfaceType);
        }


        if (lv.supportedDevicesByIFace[dev.interfaceDescriptor.interfaceType] === undefined) {
            lv.supportedDevicesByIFace[dev.interfaceDescriptor.interfaceType] = {};
        }
        let iFaceOb = lv.supportedDevicesByIFace[dev.interfaceDescriptor.interfaceType];
        let devDesc = lv.getSupportedDeviceIndoByServiceName(dev.serivceName);
        if (devDesc.valid) {
            if (iFaceOb[devDesc.manufacturer] === undefined) {
                iFaceOb[devDesc.manufacturer] = {};
            }
            let devManuf = iFaceOb[devDesc.manufacturer];

            if (devManuf[devDesc.type] === undefined) {
                devManuf[devDesc.type] = {};
            }
            let dType = devManuf[devDesc.type];

            if (dType[devDesc.label] === undefined) {
                dType[devDesc.label] = {};
                dType[devDesc.label].desc = devDesc;
                dType[devDesc.label].iFace = dev.interfaceDescriptor;
                dType[devDesc.label].sName = dev.serivceName;
            }

        } else {
            console.warn("not defined device", dev.serivceName);
        }
//        console.log(unitArr);
    }
//    console.log(lv.supportedDevicesByIFace);
};

var clearTerminalText = function () {
    document.getElementById('terminalOutput').textContent = " ";
};

var appendTerminalText = function (text) {
    document.getElementById('terminalOutput').textContent = document.getElementById('terminalOutput').textContent + text;
};

var termIntpuFunction = function (request) {
    lv.executeConfigUpdate('execProc', request, "none",
            function (d) {
                var data = d.response.data;
                appendTerminalText("\n");
                appendTerminalText(data);
            },
            function () {
                appendTerminalText("\n");
                appendTerminalText('Timeout');
            },
            function (devMessage, message) {
                appendTerminalText("\n");
                appendTerminalText('Error: ' + message);
            }
    );
};

var sendSshInstruction = function () {
    mu.getWidgetValue('terminalInputText');
    termIntpuFunction();
};

$(document).ready(function () {
    $('#loggerConfig').puidatatable({
        caption: 'All configs',
        columns: [
            {field: 'confName', headerText: 'Config name', sortable: true, filter: true, filtermatchmode: 'contain'},
            {field: 'confValue', headerText: 'Config Value', sortable: true, filter: true, filtermatchmode: 'contain'}
        ],
        datasource: lv.configData,
        selectionMode: 'single',
        globalFilter: '#loggerConfigGFilter'
    });
    $('#loggerConfigCm').puicontextmenu({
        target: $('#loggerConfig')
    });
});

lv.updateConfigTable = function (confArr) {
    lv.initConfTable = true;
    for (var item in confArr) {
        lv.configData.push({
            confName: item,
            confValue: confArr[item]
        });
    }
    $('#loggerConfig').puidatatable('reload');
};

lv.editConfigOpenDialog = function () {
    var a = $('#loggerConfig').puidatatable('getSelection');
    if (a[0] !== undefined && a[0].confName !== undefined) {

        document.getElementsByClassName('confEditDialogLabel')[0].textContent = a[0].confName;
        mainUtils.setWidgetValue('confEditDialogValWg', a[0].confValue);
        PF('confEditDialog').show();
    }
};

lv.editConfigValue = function () {
    var name = $('#loggerConfig').puidatatable('getSelection')[0].confName;
    var value = mainUtils.getWidgetValue('confEditDialogValWg');
    PF('confEditDialog').hide();
    lv.executeConfigUpdate('setConfig', name, value, function (msg) {
        console.log('Successfuly change config: ' + name + ' value: ' + value);
        mainUtils.showInfoMessage('Successfuly change config: ' + name);
        for (var i = 0; i < lv.configData.length; i++) {
            if (lv.configData[i].confName === name) {
                lv.configData[i].confValue = value;
                break;
            }
        }
        $('#loggerConfig').puidatatable('reload');
    });
};

lv.requestObject = function (reqObject, fnSuccess, fnTimeout, fnError) {
    var message = {
        instr: 'requestObject',
        instrExt: reqObject,
        devSerialNumber: devManager.getSelected().serialNumber,
        devModelId: devManager.config.subDevModelId
    };
    fnTimeout = fnTimeout || function () {
        console.log('Timeout');
    };
    fnTimeout = fnError || function (devMessage) {
        console.log("Error: " + devMessage.response.faultMsg);
    };
    //devManager
    console.log("send object request");
    wsm.sendDevMsg(message,
            function (devMessage) { //on success
                var d = JSON.parse(devMessage.response.data);
                fnSuccess(d);
            },
            function (devMessage) { //on Error
                console.log("Error: " + devMessage.response.faultMsg);
            },
            function () { //on timeout
                console.log('Timeout');
            }
    );
};

lv.loadInterfaceList = function () {

};

lv.sentRebootInstruction = function () {
    lv.executeConfigUpdate('reboot', "reboot", "none", function (msg) {
        mainUtils.showInfoMessage('Successfuly reboot logger');
        console.log('success reboot');
    });
    PF('confirmRebootDialog').hide();
};

lv.sentSoftRebootInstruction = function () {
    lv.executeConfigUpdate('softwareReboot', "softwareReboot", "none", function (msg) {
        mainUtils.showInfoMessage('Successfuly reboot logger');
        console.log('success reboot');
    });
    PF('confirmSoftRebootDialog').hide();
};

lv.removeSubDev = function (devSerial) {
    lv.executeConfigUpdate('removeDev', devSerial, " ",
            function (msg, success) {
                mainUtils.showInfoMessage('Successfuly remove devuce from logger');
                console.log('success subdev remove');
                removeSubDevFromServer([{
                        name: "subDevID",
                        value: JSON.stringify({devSer: devSerial})
                    }]);
            },
            function () {
                removeSubDevFromServer([{
                        name: "subDevID",
                        value: JSON.stringify({devSer: devSerial})
                    }]);
            },
            function (msg, success) {
                removeSubDevFromServer([{
                        name: "subDevID",
                        value: JSON.stringify({devSer: devSerial})
                    }]);
            }
    );
};

lv.executeConfigUpdate = function (instr, value, valueExt, fnSuccess, fnTimeout, fnError, timeout) {
//    timeout = timeout || 6000;
    var callbachFn = fnSuccess;
    var message = {
        instr: 'executeInstr',
        instrExt: instr,
        instrData: value,
        instrDataExt: valueExt,
        devSerialNumber: devManager.getSelected().serialNumber,
        devModelId: devManager.config.subDevModelId
    };
    console.log("send object request");
    wsm.sendDevMsg(message, callbachFn, fnError, fnTimeout, timeout);
};

lv.readRandome = function () {
//    timeout = timeout || 6000;

    wsm.sendDevMsg(
            {
                instr: "executeInstr",
                instrExt: 'getInterfaceList',
//                instrData: 0,
//                instrDataExt: 0,
                devSerialNumber: devManager.getSelected().serialNumber,
                devModelId: devManager.config.subDevModelId
            },
            function (message, response) {
                console.log("send response request " + response);
            },
            null,
            null,
            3000);
    console.log("send object request");
};

lv.configData = [];

lv.translateServiceNameFullMap = {
    'com.platar86.myPower.logger.subDevice.abb.AbbTrio50Service': 'ABB TRIO',
    'com.platar86.myPower.logger.subDevice.bmsEm.BmsEmService': 'BMS EM DEPRECATED',
    'com.platar86.myPower.logger.subDevice.bmsPL.BmsPlService': 'BMS Pl DEPRECATED',
    'com.platar86.myPower.logger.subDevice.solarMd.bmsEm.BmsEmService': 'BMS EM',
    'com.platar86.myPower.logger.subDevice.solarMd.bmsPL.BmsPlService': 'BMS Pl',
    'com.platar86.myPower.logger.subDevice.voltronik.axpertKing.AxpertKingService': 'Axpert King',
    'com.platar86.myPower.logger.subDevice.voltronik.axpertMKS.AxpertService': 'Axpert MKS',
    'com.platar86.myPower.logger.subDevice.voltronik.axpertMKSAi.AxpertAiService': 'Axpert Ai',
    'com.platar86.myPower.logger.subDevice.voltronik.mppt3000smd.Mppt3000SmdService': 'SMD MPPT 3000',
    'com.platar86.myPower.logger.subDevice.victron.esControlCanbus.VictronESControlCanBus': 'Victron CAN Translator',
    'com.platar86.myPower.logger.subDevice.mlt.oasis.OasisService': 'MLT Oasis',
    'com.platar86.myPower.logger.subDevice.sma.smaEsControlCanbus.SmaESControlCanBus': 'SMA CAN Translator',
    'com.platar86.myPower.logger.subDevice.mlt.oasisBatConnector.OasisESControlCanBus': 'MLT-Oasis Bat Connector',
    'com.platar86.myPower.logger.subDevice.solarMd.nextionDisplay.DisplayService': 'SMD TS Display',
    "com.platar86.myPower.logger.subDevice.sma.energyMeter.SmaEnergyMeterService": 'SMA Energy Meter',
    "com.platar86.myPower.logger.subDevice.sunspec.SunSpecService": 'SunSpec Modbus TCP',
    "com.platar86.myPower.logger.subDevice.sma.sunnyIslandModbus.SunnyIslandService": 'SMA SunnyIsland 12H',
    "com.platar86.myPower.logger.subDevice.sungrow.sgsc.sctl.SungrowSCTLSeriesService": 'Sungrow SC TL Series',
    "com.platar86.myPower.logger.subDevice.sungrow.sgsc.sc630tl.SungrowSC630TLService": 'Sungrow SC630TL'

};

lv.onSungrowSCClick = function () {
    let valid = true;
    let instrExt = '';
    let ip = mu.getWidgetValue('sgscDialogIP');
    let sn = mu.getWidgetValue('sgscDialogSN');
    let model = mu.getWidgetValue('sgscDialogModel');
    let installDate = mu.getWidgetValue('sgscDialogInstallDate');
    let slaveId = mu.getWidgetValue('sgscDialogSlaveID') || 1;

    if (!ip || !ip.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) {
        mu.showErrorMessage('IP address value is not valid!', 'Registering Sungrow SC');
        valid = false;
    }
    if (!sn) {
        mu.showErrorMessage('Serial number value cannot be empty!', 'Registering Sungrow SC');
        valid = false;
    }
    if (!model) {
        mu.showErrorMessage('Model value cannot be empty!', 'Registering Sungrow SC');
        valid = false;
    }

    if (!valid) {
        return;
    }

    switch (model) {
        case ('SC50TL'):
        case ('SC100TL'):
        case ('SC250TL'):
        case ('SC500TL-V21'):
        case ('SC500TL-V23'):
        case ('SC500TL-V25'):
        case ('SC1000TL'):
            instrExt = 'registerSungrowSCTLSeries';
            break;
        case ('SC630TL'):
            instrExt = 'registerSungrowSC630TL';
            break;
        case ('SC50HV'):
        case ('SC60HV'):
        case ('SC75HV'):
            instrExt = 'registerSungrowSCHVSeries';
            break;
    }

    if (instrExt.length === 0) {
        mu.showErrorMessage("Model '" + model + "' is not currently managed by the system.", "error");
        return;
    }
    wsm.sendDevMsgExecWithJsonInst(
            {
                instrExt: instrExt,
                instrData: 'Add new device',
                ip: ip,
                sn: sn,
                model: model,
                installDate: installDate,
                slaveId: slaveId
            },
            function (message, data) {
                PF('sgscDialogWg').hide();
                mu.showInfoMessage(data, "Success");
            },
            function (message, data) {
                mu.showWarningMessage(data, "error");
            },
            function () {
                mu.showWarningMessage("Timeout");
            },
            5000);
};

lv.getSupportedDeviceIndoByServiceName = function (serviceName) {
    let desc = {
        valid: true
    };
    switch (serviceName) {

        case 'BmsExService':
        case 'com.myPower24.raspSys.device.solarMd.bmsEx.BmsExService':
        case 'com.platar86.myPower.logger.subDevice.bmsEx.BmsExService':
        case 'com.platar86.myPower.logger.subDevice.solarMd.bmsEx.BmsExService':
            {
                desc.manufacturer = 'Solar MD';
                desc.label = 'STORAGE EX-Series';
                desc.type = 'Li-Ion Storage';
            }
            break;
        case 'BmsEmService':
        case 'com.myPower24.raspSys.device.solarMd.bmsEm.BmsEmService':
        case 'com.platar86.myPower.logger.subDevice.bmsEm.BmsEmService':
        case 'com.platar86.myPower.logger.subDevice.solarMd.bmsEm.BmsEmService':
            {
                desc.manufacturer = 'Solar MD';
                desc.label = 'EM Series';
                desc.type = 'Li-Ion Storage';
            }
            break;
        case 'BmsPlService':
        case 'com.myPower24.raspSys.device.solarMd.bmsPL.BmsPlService':
        case 'com.platar86.myPower.logger.subDevice.bmsPL.BmsPlService':
        case 'com.platar86.myPower.logger.subDevice.solarMd.bmsPL.BmsPlService':
            {
                desc.manufacturer = 'Solar MD';
                desc.label = 'PL Series';
                desc.type = 'Li-Ion Storage';
            }
            break;
        case 'BmuH8Service':
        case 'com.myPower24.raspSys.device.solarMd.bmuH8.BmuH8Service':
        case 'com.platar86.myPower.logger.subDevice.solarMd.bmuH8.BmuH8Service':
            {
                desc.manufacturer = 'Solar MD';
                desc.label = 'High Voltage  H8 Series';
                desc.type = 'Li-Ion HV Storage';
                desc.utilFnName = 'Add Device Manual';
                desc.utilFn = function (devName, serviceName, divWrapper, interface, idx) {
                    lv.bmuH8.devName = devName;
                    lv.bmuH8.serviceName = serviceName;
                    lv.bmuH8.interface = interface;
                    lv.bmuH8.idx = idx;

                    lv.multicast.devName = devName;
                    lv.multicast.serviceName = serviceName;
                    lv.multicast.idx = idx;
                    lv.multicast.devModelId = 24;
                    lv.multicast.interface = interface;

                    console.log(devName);
                    PF('bmuH8ManualAddDialogWg').show();
                };
                desc.miscFn = function (devName, serviceName, divWrapper, interface, idx) {
                    lv.multicastDeviceList.getDeviceList(6000);
                };
            }
            break;
        case 'LvExService':
        case 'com.myPower24.raspSys.device.solarMd.lvex.LvExService':
            {
                desc.manufacturer = 'Solar MD';
                desc.label = 'Logger V Extender';
                desc.type = 'I/O Controller';
                desc.utilFnName = 'Add Device Manual';
                desc.utilFn = function (devName, serviceName, divWrapper, interface, idx) {
                    lv.multicast.devName = devName;
                    lv.multicast.serviceName = serviceName;
                    lv.multicast.idx = idx;
                    lv.multicast.devModelId = 24;
                    lv.multicast.interface = interface;
                    console.log(devName);
                    PF('bmuH8ManualAddDialogWg').show();
                };
                desc.miscFn = function (devName, serviceName, divWrapper, interface, idx) {
                    lv.multicastDeviceList.getDeviceList(8000);
                };
            }
            break;
        case 'AxpertKingService':
        case 'com.myPower24.raspSys.device.voltronik.axpertKing.AxpertKingService':
        case 'com.platar86.myPower.logger.subDevice.voltronik.axpertKing.AxpertKingService':
            {
                desc.manufacturer = 'Voltronic';
                desc.label = 'Axpert King';
                desc.type = 'Battery Inverter';
            }
            break;
        case 'AxpertService':
        case 'com.myPower24.raspSys.device.voltronik.axpertMKS.AxpertService':
        case 'com.platar86.myPower.logger.subDevice.voltronik.axpertMKS.AxpertService':
            {
                desc.manufacturer = 'Voltronic';
                desc.label = 'Axpert';
                desc.type = 'Battery Inverter';
            }
            break;
        case 'AxpertAiService':
        case 'com.myPower24.raspSys.device.voltronik.axpertMKSAi.AxpertAiService':
        case 'com.platar86.myPower.logger.subDevice.voltronik.axpertMKSAi.AxpertAiService':
            {
                desc.manufacturer = 'Voltronic';
                desc.label = 'Axpert AI';
                desc.type = 'Battery Inverter Enhanced';
            }
            break;
        case 'Mppt3000SmdService':
        case 'com.myPower24.raspSys.device.voltronik.mppt3000smd.Mppt3000SmdService':
        case 'com.platar86.myPower.logger.subDevice.voltronik.mppt3000smd.Mppt3000SmdService':
            {
                desc.manufacturer = 'Solar MD';
                desc.label = 'MPPT 3000';
                desc.type = 'Solar Charger';
            }
            break;
        case 'VictronESControlCanBus':
        case 'com.myPower24.raspSys.device.victron.esControlCanbus.VictronESControlCanBus':
        case 'com.platar86.myPower.logger.subDevice.victron.esControlCanbus.VictronESControlCanBus':
            {
                desc.manufacturer = 'Solar MD';
                desc.label = 'Victron GX Es Control';
                desc.type = 'Storage Software Bridge';
            }
            break;
        case 'OasisService':
        case 'com.myPower24.raspSys.device.mlt.oasis.OasisService':
        case 'com.platar86.myPower.logger.subDevice.mlt.oasis.OasisService':
            {
                desc.manufacturer = 'MLT';
                desc.label = 'Oasis';
                desc.type = 'Battery Inverter';
            }
            break;
        case 'SmaESControlCanBus':
        case 'com.myPower24.raspSys.device.sma.smaEsControlCanbus.SmaESControlCanBus':
        case 'com.platar86.myPower.logger.subDevice.sma.smaEsControlCanbus.SmaESControlCanBus':
            {
                desc.manufacturer = 'Solar MD';
                desc.label = 'SMA SunnyIsland Es Control';
                desc.type = 'Storage Software Bridge';
            }
            break;
        case 'OasisESControlCanBus':
        case 'com.myPower24.raspSys.device.mlt.oasisBatConnector.OasisESControlCanBus':
        case 'com.platar86.myPower.logger.subDevice.mlt.oasisBatConnector.OasisESControlCanBus':
            {
                desc.manufacturer = 'Solar MD';
                desc.label = 'MLT Oasis Es Control';
                desc.type = 'Storage Software Bridge';
            }
            break;
        case 'com.myPower24.raspSys.device.atess.esControlAtess.EsControlAtessService':
            {
                desc.manufacturer = 'Solar MD';
                desc.label = 'Atess ES Control';
                desc.type = 'Storage Software Bridge';
            }
            break;
        case 'com.myPower24.raspSys.device.molabo.esControlMolabo.EsControlMolaboService':
            {
                desc.manufacturer = 'Solar MD';
                desc.label = 'Molabo ES Control';
                desc.type = 'Storage Software Bridge';
            }
            break;
        case 'com.myPower24.raspSys.device.sunsynk.esControlSunSynk.EsControlSunSynkService':
            {
                desc.manufacturer = 'Solar MD';
                desc.label = 'Deye/SunSynk/Goodwe ES Control';
                desc.type = 'Storage Software Bridge';
            }
            break;
        case 'DisplayService':
        case 'com.myPower24.raspSys.device.nextion.DisplayService':
        case 'com.platar86.myPower.logger.subDevice.solarMd.nextionDisplay.DisplayService':
            {
                desc.manufacturer = 'Solar MD';
                desc.label = '7 Inch TouchScreen';
                desc.type = 'Display HMI';
            }
            break;
        case "SmaEnergyMeterService":
        case "com.myPower24.raspSys.device.sma.energyMeter.SmaEnergyMeterService":
        case "com.platar86.myPower.logger.subDevice.sma.energyMeter.SmaEnergyMeterService":
            {
                desc.manufacturer = 'SMA';
                desc.label = 'SMA Energy Meter';
                desc.type = 'Energy Meter';
            }
            break;
        case "SunSpecService":
        case "com.myPower24.raspSys.device.sunspec.SunSpecService":
        case "com.platar86.myPower.logger.subDevice.sunspec.SunSpecService":
            {
                desc.manufacturer = 'SunSpec';
                desc.label = 'SunSpec Inverter';
                desc.type = 'SunSpec Solar Inverter';
            }
            break;
        case "SunnyIslandService":
        case "com.myPower24.raspSys.device.sma.sunnyIslandModbus.SunnyIslandService":
        case "com.platar86.myPower.logger.subDevice.sma.sunnyIslandModbus.SunnyIslandService":
            {
                desc.manufacturer = 'SMA';
                desc.label = 'SunyIsland 6h/8h/12h';
                desc.type = 'Battery Inverter';
            }
            break;
        case "SSGTSeriesService":
        case "com.myPower24.raspSys.device.sunsynk.ssgt.SSGTSeriesService":
        case "com.platar86.myPower.logger.subDevice.sunsynk.ssgt.SSGTSeriesService":
            {
                desc.manufacturer = 'Deye/SUNSYNK';
                desc.label = 'Deye SUN  8K-SG /SUNSYNK';
                desc.type = 'Battery Inverter';
            }
            break;
        case "SolarLogEmService":
        case "com.myPower24.raspSys.device.solarlog.emMeter.SolarLogEmService":
        case "com.platar86.myPower.logger.subDevice.solarlog.SolarLogEmService":
            {
                desc.manufacturer = 'SolarLog';
                desc.label = 'PRO380-Mod';
                desc.type = 'Energy Meters';
                desc.utilFn = function (devName, serviceName, divWrapper, interface, idx) {
//                   public static final int SUNGROW_STRING_INVERTER = 2101;
                    let message = {
                        instr: wsm.connectionVar.executeInstr,
                        instrExt: 'scanForDevice',
                        instrData: interface.interfaceName,
                        instrDataExt: '65',
                        devSerialNumber: devManager.getSelected().serialNumber,
                        devModelId: 960
                    };

                    console.log("send settings");
                    wsm.sendDevMsg(message,
                            function (msg, data) {
                                mainUtils.showInfoMessage(data, msg.instrExt);

                                console.log(data);
                            },
                            function (msg, err) {
                                mainUtils.showErrorMessage(err, msg.instrExt);
                                console.log(err);
                            },
                            function () {

                                console.log('timeout');
                            },
                            60 * 1000);
                };
            }
            break;
        case "CarloGavazziEM100SeriesServicee":
        case "com.myPower24.raspSys.device.carloGavazzi.energyMeter.CarloGavazziEM100SeriesService":
        case "com.platar86.myPower.logger.subDevice.carloGavazzi.energyMeter.CarloGavazziEM100SeriesService":
            {
                desc.manufacturer = 'Carlo Gavazzi';
                desc.label = 'Carlo Gavazzi ET/EM Series';
                desc.type = 'Energy Meters';
                desc.utilFn = function (devName, serviceName, divWrapper, interface, idx) {
//                   public static final int SUNGROW_STRING_INVERTER = 2101;
                    let message = {
                        instr: wsm.connectionVar.executeInstr,
                        instrExt: 'scanForDevice',
                        instrData: interface.interfaceName,
                        instrDataExt: '65',
                        devSerialNumber: devManager.getSelected().serialNumber,
                        devModelId: 950
                    };

                    console.log("send settings");
                    wsm.sendDevMsg(message,
                            function (msg, data) {
                                mainUtils.showInfoMessage(data, msg.instrExt);

                                console.log(data);
                            },
                            function (msg, err) {
                                mainUtils.showErrorMessage(err, msg.instrExt);
                                console.log(err);
                            },
                            function () {

                                console.log('timeout');
                            },
                            60 * 1000);
                };
            }
            break;
        case "SungrowStrInvSGSeriesService":
        case "com.myPower24.raspSys.device.sungrow.SungrowStrInvSGSeriesService":
        case "com.platar86.myPower.logger.subDevice.sungrow.SungrowStrInvSGSeriesService":
            {
                desc.manufacturer = 'Sungrow';
                desc.label = 'Sunsgrow SG/LP Series';
                desc.type = 'GridTie String Inverter';
                desc.utilFn = function (devName, serviceName, divWrapper, interface, idx) {
//                   public static final int SUNGROW_STRING_INVERTER = 2101;
                    let message = {
                        instr: wsm.connectionVar.executeInstr,
                        instrExt: 'scanForDevice',
                        instrData: interface.interfaceName,
                        instrDataExt: '65',
                        devSerialNumber: devManager.getSelected().serialNumber,
                        devModelId: 2101
                    };

                    console.log("send settings");
                    wsm.sendDevMsg(message,
                            function (msg, data) {
                                mainUtils.showInfoMessage(data, msg.instrExt);
                                console.log(data);
                            },
                            function (msg, err) {
                                mainUtils.showErrorMessage(err, msg.instrExt);
                                console.log(err);
                            },
                            function () {

                                console.log('timeout');
                            },
                            60 * 1000);
                };
            }
            break;
        case "SungrowSCTLSeriesService":
        case "com.myPower24.raspSys.device.sungrow.sgsc.sctl.SungrowSCTLSeriesService":
        case "com.platar86.myPower.logger.subDevice.sungrow.sgsc.sctl.SungrowSCTLSeriesService":
        {
            desc.manufacturer = 'Sungrow';
            desc.label = 'Sunsgrow SC TL Series';
            desc.type = 'Power Conversion System Inverter';
            desc.utilFnName = 'Add Device';
            desc.utilFn = function () {
                PF('sgscDialogWg').show();
            };
        }

        case "AisweiStringInvService":
        case "com.myPower24.raspSys.device.aiswei.stringInverter.AisweiStringInvService":
            {
                desc.manufacturer = 'Aiswei';
                desc.label = 'SolPlanet SC TL Series';
                desc.type = 'String Inverter';
                desc.utilFnName = 'Scan Device';
                desc.utilFn = function (devName, serviceName, divWrapper, interface, idx) {
//                    public static final int SUNGROW_STRING_INVERTER = 2101;
                    let message = {
                        instr: wsm.connectionVar.executeInstr,
                        instrExt: 'scanForDevice',
                        instrData: interface.interfaceName,
                        instrDataExt: '65',
                        devSerialNumber: devManager.getSelected().serialNumber,
                        devModelId: 2601
                    };

                    console.log("send settings");
                    wsm.sendDevMsg(message,
                            function (msg, data) {
                                mainUtils.showInfoMessage(data, msg.instrExt);
                                console.log(data);
                            },
                            function (msg, err) {
                                mainUtils.showErrorMessage(err, msg.instrExt);
                                console.log(err);
                            },
                            function () {

                                console.log('timeout');
                            },
                            60 * 1000);
                };
            }

            break;
        case "SungrowSCHVSeriesService":
        case "com.myPower24.raspSys.device.sungrow.sgsc.schv.SungrowSCHVSeriesService":
            {
                desc.manufacturer = 'Sungrow';
                desc.label = 'Sunsgrow SC HV Series';
                desc.type = 'Power Conversion System Inverter';
                desc.utilFnName = 'Add Device';
                desc.utilFn = function () {
                    PF('sgscDialogWg').show();
                };
            }
            break;
        case "SungrowSC630TLService":
        case "com.myPower24.raspSys.device.sungrow.sgsc.sc630tl.SungrowSC630TLService":
        case "com.platar86.myPower.logger.subDevice.sungrow.sgsc.sc630tl.SungrowSC630TLService":
            {
                desc.manufacturer = 'Sungrow';
                desc.label = 'Sunsgrow SC630TL';
                desc.type = 'Power Conversion System Inverter';
                desc.utilFnName = 'Add Device';
                desc.utilFn = function () {
                    PF('sgscDialogWg').show();
                };
            }
            break;
        case "com.myPower24.raspSys.device.huawei.sun2000.sun2000Firmware.HuaweiSun2000Service":
        case "com.myPower24.raspSys.device.huawei.sun2000.HuaweiSun2000Service":
            {
                desc.manufacturer = 'Huawei';
                desc.label = 'Huawei SUN2000 Series';
                desc.type = 'PV Inverter';
                desc.utilFnName = 'Scan for Device';
                desc.utilFn = function (devName, serviceName, divWrapper, interface, idx) {
//                    public static final int SUNGROW_STRING_INVERTER = 2101;
                    let message = {
                        instr: wsm.connectionVar.executeInstr,
                        instrExt: 'scanForDevice',
                        instrData: interface.interfaceName,
                        instrDataExt: '65',
                        devSerialNumber: devManager.getSelected().serialNumber,
                        devModelId: 2501
                    };

                    console.log("send settings");
                    wsm.sendDevMsg(message,
                            function (msg, data) {
                                mainUtils.showInfoMessage(data, msg.instrExt);
                                console.log(data);
                            },
                            function (msg, err) {
                                mainUtils.showErrorMessage(err, msg.instrExt);
                                console.log(err);
                            },
                            function () {

                                console.log('timeout');
                            },
                            60 * 1000);
                };
            }
            break;
        case "com.myPower24.raspSys.device.socomec.emeter.SocomecEMeterService":
            {
                desc.manufacturer = 'Socomec';
                desc.label = 'Socomec Energy Meter';
                desc.type = 'Energy Meters';
                desc.utilFnName = 'Scan for Device';
                desc.utilFn = function (devName, serviceName, divWrapper, interface, idx) {
                    let message = {
                        instr: wsm.connectionVar.executeInstr,
                        instrExt: 'scanForDevice',
                        instrData: interface.interfaceName,
                        instrDataExt: '65',
                        devSerialNumber: devManager.getSelected().serialNumber,
                        devModelId: 3101
                    };
                    wsm.sendDevMsg(message,
                            function (msg, data) {
                                mainUtils.showInfoMessage(data, msg.instrExt);
                                console.log(data);
                            },
                            function (msg, err) {
                                mainUtils.showErrorMessage(err, msg.instrExt);
                                console.log(err);
                            },
                            function () {
                                console.log('timeout');
                            },
                            60 * 1000);
                };
            }
            break;
        case "com.myPower24.raspSys.device.eastron.emeter.EastronEmService":
            {
                desc.manufacturer = 'Eastron';
                desc.label = 'Eastron Energy Meter';
                desc.type = 'Energy Meters';
                desc.utilFnName = 'Scan for Device';
                desc.utilFn = function (devName, serviceName, divWrapper, interface, idx) {
                    let message = {
                        instr: wsm.connectionVar.executeInstr,
                        instrExt: 'scanForDevice',
                        instrData: interface.interfaceName,
                        instrDataExt: '65',
                        devSerialNumber: devManager.getSelected().serialNumber,
                        devModelId: 3201
                    };
                    wsm.sendDevMsg(message,
                            function (msg, data) {
                                mainUtils.showInfoMessage(data, msg.instrExt);
                                console.log(data);
                            },
                            function (msg, err) {
                                mainUtils.showErrorMessage(err, msg.instrExt);
                                console.log(err);
                            },
                            function () {
                                console.log('timeout');
                            },
                            60 * 1000);
                };
            }
            break;
        case "com.myPower24.raspSys.device.aeg.converter.sc.AegBatConverterService":
            {
                desc.manufacturer = 'AEG';
                desc.label = 'AEG SC Flex Series';
                desc.type = 'Power Conversion System Inverter';
                desc.utilFnName = 'Add Device';
                desc.utilFn = function () {
                    if (desc.addNewDialog === undefined) {
                        desc.addNewDialog = new SMDUIDialog({
                            heading: 'Add AEG SC Flex Series Device',
                            draggable: true,
                            onInitComplete: function (contentDiv, footerDiv, comp) {
                                let div = document.createElement('div');
                                contentDiv.appendChild(div);
                                new ParamSetting(div, 'scanForDevice', {
                                    detached: true, type: 'inputText', title: 'IP:', setButtonLabel: 'Scan for Device',
                                    ctrlInfo: 'Ip Address of the converter. Make sure Modbus TCP is enabled on port 502',
                                    validator: function (comp, instr) {
                                        if (!ipUtils.validateIpAddrString(comp.getValue())) {
                                            throw new Error("Invalid IP address [" + comp.getValue() + '] Please check syntaxis ###.###.###.###');
                                        }
                                    },
                                    extraData: {devModelId: 2203}
                                });
                            }
                        });
                    }
//                    debugger;
                    desc.addNewDialog.show();

                };
            }
            break;
        case "com.myPower24.raspSys.device.generic.evCharger.genericEvCharger.GenericEvChargerService":
            {
                desc.manufacturer = 'Generic EV Charger';
                desc.label = 'EV Charger';
                desc.type = 'Battery Charger';
            }
            break;
        case "com.myPower24.raspSys.device.infyPower.evChargerRegSeries.InfyEvChargerService":
            {
                desc.manufacturer = 'InfyPower EV Charger';
                desc.label = 'EV Charger';
                desc.type = 'Battery Charger';
            }
            break;
        case "com.myPower24.raspSys.device.winline.uxrSeriesCharger.WinlineUxrChService":
            {
                desc.manufacturer = 'Winline UXR EV Charger';
                desc.label = 'Winline EV Charger';
                desc.type = 'Battery Charger';
            }
            break;
        case "AtessHpsService":
        case "com.myPower24.raspSys.device.atess.atessHps.AtessHpsService":
            {
                desc.manufacturer = 'Atess';
                desc.label = 'Atess HPS Series';
                desc.type = 'Hybrid Inverter';
                desc.utilFn = function (devName, serviceName, divWrapper, interface, idx) {
                    let message = {
                        instr: wsm.connectionVar.executeInstr,
                        instrExt: 'scanForDevice',
                        instrData: interface.interfaceName,
                        instrDataExt: '65',
                        devSerialNumber: devManager.getSelected().serialNumber,
                        devModelId: 2301
                    };

                    console.log("send settings");
                    wsm.sendDevMsg(message,
                            function (msg, data) {
                                mainUtils.showInfoMessage(data, msg.instrExt);
                                console.log(data);
                            },
                            function (msg, err) {
                                mainUtils.showErrorMessage(err, msg.instrExt);
                                console.log(err);
                            },
                            function () {

                                console.log('timeout');
                            },
                            60 * 1000);
                };
            }
            break;
        case "AtessPcsService":
        case "com.myPower24.raspSys.device.atess.pcs.AtessPcsService":
            {
                desc.manufacturer = 'Atess';
                desc.label = 'Atess PCS Series';
                desc.type = 'Battery Inverter';
                desc.utilFn = function (devName, serviceName, divWrapper, interface, idx) {
                    let message = {
                        instr: wsm.connectionVar.executeInstr,
                        instrExt: 'scanForDevice',
                        instrData: interface.interfaceName,
                        instrDataExt: '65',
                        devSerialNumber: devManager.getSelected().serialNumber,
                        devModelId: 2302
                    };

                    console.log("send settings");
                    wsm.sendDevMsg(message,
                            function (msg, data) {
                                mainUtils.showInfoMessage(data, msg.instrExt);
                                console.log(data);
                            },
                            function (msg, err) {
                                mainUtils.showErrorMessage(err, msg.instrExt);
                                console.log(err);
                            },
                            function () {

                                console.log('timeout');
                            },
                            60 * 1000);
                };
            }
            break;
        case "AtessPdbService":
        case "com.myPower24.raspSys.device.atess.pbd.AtessPdbService":
            {
                desc.manufacturer = 'Atess';
                desc.label = 'Atess PBD Series';
                desc.type = 'PV Inverter';
                desc.utilFn = function (devName, serviceName, divWrapper, interface, idx) {
                    let message = {
                        instr: wsm.connectionVar.executeInstr,
                        instrExt: 'scanForDevice',
                        instrData: interface.interfaceName,
                        instrDataExt: '65',
                        devSerialNumber: devManager.getSelected().serialNumber,
                        devModelId: 2303
                    };

                    console.log("send settings");
                    wsm.sendDevMsg(message,
                            function (msg, data) {
                                mainUtils.showInfoMessage(data, msg.instrExt);
                                console.log(data);
                            },
                            function (msg, err) {
                                mainUtils.showErrorMessage(err, msg.instrExt);
                                console.log(err);
                            },
                            function () {

                                console.log('timeout');
                            },
                            60 * 1000);
                };
            }
            break;
        case "SofarHydKtlService":
        case "com.myPower24.raspSys.device.sofar.hydKtl.SofarHydKtlService":
            {
                desc.manufacturer = 'Sofar';
                desc.label = 'HYD KTL Series';
                desc.type = 'Hybrid Inverter';
                desc.utilFn = function (devName, serviceName, divWrapper, interface, idx) {
                    let message = {
                        instr: wsm.connectionVar.executeInstr,
                        instrExt: 'scanForDevice',
                        instrData: interface.interfaceName,
                        instrDataExt: '65',
                        devSerialNumber: devManager.getSelected().serialNumber,
                        devModelId: 2401
                    };

                    console.log("send settings");
                    wsm.sendDevMsg(message,
                            function (msg, data) {
                                mainUtils.showInfoMessage(data, msg.instrExt);
                                console.log(data);
                            },
                            function (msg, err) {
                                mainUtils.showErrorMessage(err, msg.instrExt);
                                console.log(err);
                            },
                            function () {

                                console.log('timeout');
                            },
                            60 * 1000);
                };
            }
            break;
        case "MolEmService":
        case "com.myPower24.raspSys.device.mol.energyMeter.MolEmService":
            {
                desc.manufacturer = 'Mol';
                desc.label = 'Mol Energy Meter';
                desc.type = 'Energy Meters';
                desc.utilFn = function (devName, serviceName, divWrapper, interface, idx) {
//                   public static final int SUNGROW_STRING_INVERTER = 2101;
                    let message = {
                        instr: wsm.connectionVar.executeInstr,
                        instrExt: 'scanForDevice',
                        instrData: interface.interfaceName,
                        instrDataExt: '65',
                        devSerialNumber: devManager.getSelected().serialNumber,
                        devModelId: 970
                    };

                    console.log("send settings");
                    wsm.sendDevMsg(message,
                            function (msg, data) {
                                mainUtils.showInfoMessage(data, msg.instrExt);

                                console.log(data);
                            },
                            function (msg, err) {
                                mainUtils.showErrorMessage(err, msg.instrExt);
                                console.log(err);
                            },
                            function () {

                                console.log('timeout');
                            },
                            60 * 1000);
                };
            }
            break;
        case "com.myPower24.raspSys.device.kehua.KehuaBcsService":
            {
                desc.manufacturer = 'Kehua';
                desc.label = 'Kehua BCS Series';
                desc.type = 'Power Conversion System Inverter';
                desc.utilFnName = 'Add Device';
                desc.utilFn = function () {
                    PF('sgscDialogWg').show();
                };
            }
            break;
        default :
        {
            desc.valid = false;
        }
    }
    return desc;
};

lv.translateInterfaceNameFullMap = {
    'can-1': 'CANBUS 1',
    'can-2': 'CANBUS 2',
    'rs232-1': 'RS232 - 1',
    'rs232-2': 'RS232 - 2',
    'rs485-1': 'RS485 - 1',
    'rs485-2': 'RS485 - 2',
    'br0': 'Ethernet local / WiFi Ap'
};

lv.translateInterfaceInfoMap = {
    'can-1': 'CANBUS 1',
    'can-2': 'CANBUS 2',
    'rs232-1': 'RS232 - 1',
    'rs232-2': 'RS232 - 2',
    'rs485-1': 'RS485 - 1',
    'rs485-2': 'RS485 - 2',
    'br0': 'Ethernet Devices Connection At LoggerV2'
};

lv.translateServiceNameFull = function (serviceName) {
    return lv.translateServiceNameFullMap[serviceName] || serviceName;
};

lv.translateServiceNameSimple = function (serviceNameSimple) {
    for (var item in lv.translateServiceNameFullMap) {
        if (lv.translateServiceNameFullMap[item] === serviceNameSimple) {
            return item;
        }
    }
    return serviceNameSimple;
};

//<editor-fold defaultstate="collapsed" desc="modbusDebug">
lv.modbusDebug = {};

lv.modbusDebug.openDialog = function (iface) {
    console.log(iface);
    lv.modbusDebug.selectedPort = iface.interfaceName;

    if (localStorage) {
        let conf = JSON.parse(localStorage.getItem('readRs485ModbusDebugState'));
        if (conf) {
            mainUtils.setWidgetValue('iFaceRs485DebugFunctionWg', conf.modbudFunction);
            mainUtils.setWidgetValue('rs485ModbusDebugSlaveIdWg', conf.slaveId);
            mainUtils.setWidgetValue('rs485ModbusDebugRegDecWg', conf.startReg);
            mainUtils.setWidgetValue('rs485ModbusDebugDataDecWg', conf.sData);
            mainUtils.setWidgetValue('rs485ModbusDebugDataDecMultiRegWg', conf.multiData);
            mainUtils.setWidgetValue('rs485ModbusDebugRegCountWg', conf.regCount);
        }
    }

    lv.modbusDebug.onRegDecChange();
    lv.modbusDebug.onRegCountChange();
    lv.modbusDebug.onDataTypeChange();
    lv.modbusDebug.onRegHexChange();
    lv.modbusDebug.onRegHexChange();
    lv.modbusDebug.onModbusFnChange();

    PF('rs485ModbusDebugDialogWg').show();

};

lv.modbusDebug.onRegDecChange = function () {
    let dec = mainUtils.getWidgetValue('rs485ModbusDebugRegDecWg');
    if (isNaN(dec)) {
        mainUtils.setWidgetValue('rs485ModbusDebugRegDecWg', 0);
        mainUtils.setWidgetValue('rs485ModbusDebugRegHexWg', 0);
    } else {
        mainUtils.setWidgetValue('rs485ModbusDebugRegHexWg', Number(dec).toString(16));
    }
};

lv.modbusDebug.onRegCountChange = function () {
    let resultConf = lv.modbusDebug.getDataTypeConf(mainUtils.getWidgetValue('rs485ModbusDebugResultDataTypeWg'));
    let regCount = mainUtils.getWidgetValue('rs485ModbusDebugRegCountWg');
    if (resultConf.len / 2 > regCount) {
        mainUtils.setWidgetValue('rs485ModbusDebugRegCountWg', Number(resultConf.len / 2));
    }
};

lv.modbusDebug.onDataTypeChange = function () {
    let resultConf = lv.modbusDebug.getDataTypeConf(mainUtils.getWidgetValue('rs485ModbusDebugResultDataTypeWg'));
    let regCount = mainUtils.getWidgetValue('rs485ModbusDebugRegCountWg');
    if (resultConf.len / 2 > regCount) {
        mainUtils.setWidgetValue('rs485ModbusDebugRegCountWg', Number(resultConf.len / 2));
    }
};

lv.modbusDebug.onRegHexChange = function () {
    let hexString = mainUtils.getWidgetValue('rs485ModbusDebugRegHexWg');
    let dec = parseInt(hexString, 16);
    if (isNaN(dec)) {
        mainUtils.setWidgetValue('rs485ModbusDebugRegDecWg', 0);
        mainUtils.setWidgetValue('rs485ModbusDebugRegHexWg', 0);
    } else {
        mainUtils.setWidgetValue('rs485ModbusDebugRegDecWg', Number(dec));
        mainUtils.setWidgetValue('rs485ModbusDebugRegHexWg', Number(dec).toString(16));
    }
};

lv.modbusDebug.onDataDecChange = function () {
    let dec = mainUtils.getWidgetValue('rs485ModbusDebugDataDecWg');
    if (isNaN(dec)) {
        mainUtils.setWidgetValue('rs485ModbusDebugDataDecWg', 0);
        mainUtils.setWidgetValue('rs485ModbusDebugDataHexWg', 0);
    } else {
        mainUtils.setWidgetValue('rs485ModbusDebugDataHexWg', Number(dec).toString(16));
    }
};

lv.modbusDebug.onModbusFnChange = function () {
    let selectedVal = mainUtils.getWidgetValue('iFaceRs485DebugFunctionWg');

    let multiRegInputGroup = document.getElementById("rs485ModbusDebugDataDecMultiRegGroup");
    let singleRegInputGroup = document.getElementById("rs485ModbusDebugDataDecSingleRegGroup");


    if (selectedVal === "writeMultipleRegisters") {
        multiRegInputGroup.style.display = "block";
        singleRegInputGroup.style.display = "none";
    } else if (selectedVal === "writeSingleRegister") {
        multiRegInputGroup.style.display = "none";
        singleRegInputGroup.style.display = "block";
    } else {
        multiRegInputGroup.style.display = "none";
        singleRegInputGroup.style.display = "none";
    }
}
;

lv.modbusDebug.onDataHexChange = function () {
    let hexString = mainUtils.getWidgetValue('rs485ModbusDebugDataHexWg');
    let dec = parseInt(hexString, 16);
    if (isNaN(dec)) {
        mainUtils.setWidgetValue('rs485ModbusDebugDataDecWg', 0);
        mainUtils.setWidgetValue('rs485ModbusDebugDataHexWg', 0);
    } else {
        mainUtils.setWidgetValue('rs485ModbusDebugDataDecWg', Number(dec));
        mainUtils.setWidgetValue('rs485ModbusDebugDataHexWg', Number(dec).toString(16));
    }
};

lv.modbusDebug.readRs485Modbus = function () {
    let conf = {
        modbudFunction: mainUtils.getWidgetValue('iFaceRs485DebugFunctionWg'),
        slaveId: mainUtils.getWidgetValue('rs485ModbusDebugSlaveIdWg'),
        stdTimeout: 2000,
        ignoreCrc: true,
        startReg: mainUtils.getWidgetValue('rs485ModbusDebugRegDecWg'),
        regCount: mainUtils.getWidgetValue('rs485ModbusDebugRegCountWg'),
        sData: mainUtils.getWidgetValue('rs485ModbusDebugDataDecWg'),
        multiData: mainUtils.getWidgetValue('rs485ModbusDebugDataDecMultiRegWg')

    };
    if (localStorage) {
        localStorage.setItem('readRs485ModbusDebugState', JSON.stringify(conf));
    }

    devManager.sendDevMessage(
            {
                instrExt: 'rs485ModbusReadReg',
                instrIdx: lv.modbusDebug.selectedPort || 'rs485-1',
                instrData: conf.modbudFunction + ";" + conf.slaveId + ";" + conf.startReg + ";" + conf.regCount + ";" + conf.stdTimeout + ";" +
                        conf.ignoreCrc + ";" + conf.sData + ";" + conf.multiData
            },
            function (devMessage, successMsg) { //success
                lv.modbusDebug.onSuccessReadWrite(successMsg, conf);
            },
            function (err, errMsg) { //success
                console.log(errMsg);
                mu.showErrorMessage(errMsg);
            }
    );
};

lv.modbusDebug.onSuccessReadWrite = function (result, conf) {
    console.log(result);
    let containerDhcpLeasses = document.querySelector('.smdmd_resultContainer');
    if (containerDhcpLeasses) {
        hh.removeAllChilds(containerDhcpLeasses);
        containerDhcpLeasses.appendChild(hh.createActDataPanelHeaderElement("Succefull Read/Write"));


        let resultConf = lv.modbusDebug.getDataTypeConf(mainUtils.getWidgetValue('rs485ModbusDebugResultDataTypeWg'));
        let endianness = mu.getWidgetValue('iFaceRs485DebugEndiannessWg');

        let tableContent = {header: ['Reg', 'Val'], item: []};
        if (resultConf.type === 'number') {
            tableContent.header.push('Hex');
        } else if (resultConf.type === 'text') {
            tableContent.header.push('Text');
        }
        for (var i = 0; i < result.length; i += resultConf.len) {
            let data = 0;
            if (endianness === 'be') {
                let byteLeft = 0;
                while (byteLeft < resultConf.len) {
                    let shiftLeft = (byteLeft) * 8;

                    data |= (result[i + (byteLeft)] << shiftLeft);
                    byteLeft++;
                }
            } else {
                let byteLeft = resultConf.len;
                while (byteLeft > 0) {
                    let shiftLeft = (resultConf.len - byteLeft) * 8;

                    data |= (result[i + (byteLeft - 1)] << shiftLeft);
                    byteLeft--;
                }
            }
//            data = 55000;
            let mask = (1 << (resultConf.len * 8) - 1);
            let td = data;

            if (resultConf.signed) {

                if (data & (mask)) {
                    data &= ~(mask);
                    data -= (mask);
                }
            }
            let reg = Number(conf.startReg);
            if (i > 0) {
                reg += i / 2;
            }

            let row = [
                reg,
                data
            ];
            if (resultConf.type === 'number') {
                row.push(parseNumberToHex(td, resultConf.len * 2));
            } else if (resultConf.type === 'text') {
                row.push(String.fromCharCode(td));
            }

            tableContent.item.push(row);

//            let line = status.dhcpServLeasses[i].trim();
//            let fieldArr = line.split(' ');
//            if (fieldArr.length >= 5) {
//                tableContent.item.push(
//                        [
//                            moment.unix(Number(fieldArr[0])).format('MMM-DD hh:mm'),
//                            fieldArr[1],
//                            fieldArr[2],
//                            fieldArr[3]
//
//                        ]);
//            }
        }
        containerDhcpLeasses.appendChild(hh.createItemTableToActDataPanelCard(tableContent));
    }
};

lv.modbusDebug.getDataTypeConf = function (typeStr) {
    switch (typeStr) {
        case 'TXT':
            return {
                type: 'text',
                len: 1,
                signed: false
            };
        case 'INT8':
            return {
                type: 'number',
                len: 1,
                signed: true
            };
        case 'UINT8':
            return {
                type: 'number',
                len: 1,
                signed: false
            };
        case 'INT16':
            return {
                type: 'number',
                len: 2,
                signed: true
            };
        case 'UINT16':
            return {
                type: 'number',
                len: 2,
                signed: false
            };
        case 'INT32':
            return {
                type: 'number',
                len: 4,
                signed: true
            };
        case 'UINT32':
            return {
                type: 'number',
                len: 4,
                signed: false
            };

    }
    ;
    return    {
        len: 2,
        signed: true
    };
};
//</editor-fold>

lv.canbusDump = {

    data: [],
    dumpData: [],
    CSVData: '',
    table: $('#canbusBeanTbl'),

    initTable: function () {
        $('#canbusBeanTbl').puidatatable({
            columns: [
                {field: 'id', headerText: 'Dump ID', sortable: true},
                {field: 'beginTime', headerText: 'Dump Time'},
                {field: 'msgCount', headerText: 'Total Message Captured'}
            ],
            datasource: lv.canbusDump.data,
            caption: 'Dump List',
            emptyMessage: 'no data',
            selectionMode: 'single',
            sortField: 'id',
            sortOrder: -1,
            rowSelect: function (event, data) {
                lv.canbusDump.getCanbusDumpData(data.id);
                PF('canbusDumpDataDownloadButton').disable();
            }
//            rowSelectContextMenu: function () {
//                lv.canbusDump.download();
//            }
        });

        $('#canbusBeanTblContextMenu').puicontextmenu({target: $('#canbusBeanTbl')});

        $('#canbusBeanTblData').puidatatable({
            columns: [
                {field: 'type', headerText: 'Msg Type', filter: true, filterMatchMode: 'contains'},
                {field: 'time', headerText: 'Abs Time'},
                {field: 'dTime', headerText: 'Delta Time'},
                {field: 'flags', headerText: 'EFF,RTR,ERR', filter: true, filterMatchMode: 'contains'},
                {field: 'id', headerText: 'ID', filter: true, filterMatchMode: 'contains'},
                {field: 'idHex', headerText: 'ID Hex', filter: true, filterMatchMode: 'contains'},
                {field: 'length', headerText: 'Len', filter: true, filterMatchMode: 'contains'},
                {field: 'data', headerText: 'Data', filter: true, filterMatchMode: 'contains'}
            ],
            datasource: lv.canbusDump.dumpData,
            caption: 'Dump Data',
            emptyMessage: 'No Data',
            selectionMode: 'single',
            rowSelect: function (event, data) {
//                lv.canbusDump.getCanbusDumpData(data.id);
//                console.log(event);
            }
        });
    },

    getCanbusDumpInfo: function () {

        let msgLabel = document.querySelector('.smdcd_resultsSpan');
        dm.sendDevMessage({
                instrExt: "getCanbusDumpInfo",
                instrDataJson: { port: lv.canbusDump.selectedPort }
        },
                    function (msg, response) {
                    lv.canbusDump.data.length = 0;
                    for (var item in response) {
                        let rec = {};
                        rec.id = item;
                        rec.beginTime = moment(Number(item)).format('YY-MM-DD hh:mm:ss');
                        rec.msgCount = response[item];
                        lv.canbusDump.data.push(rec);
                    }

                    $('#canbusBeanTbl').puidatatable('reload');
                    $('#canbusBeanTbl').puidatatable('sort', 'id', -1);
                    msgLabel.textContent = '';
//                     console.log('Success', arguments);
                 },
                    function (msg, response) {
                      console.log('Error', arguments);
                    msgLabel.textContent = 'Dump Error';
                 },
                    function () {
                     console.log('Timeout', arguments);
                    msgLabel.textContent = 'Dump Error: Timeout';
                 });
        PF('canbusDumpDataRefreshButton').disable();
    },

    getCanbusDumpData: function (id) {
        lv.canbusDump.maxTime = PF('canbusDumpMaxTime').getValue();
        lv.canbusDump.maxMsgCount = PF('canbusDumpMaxMsgCount').getValue();
        dm.sendDevMessage({
                instrExt: "getCanbusDumpBean",
                instrDataJson: { port: lv.canbusDump.selectedPort, dumpBeginTime: id}
        },
                    function (msg, data) {
                    lv.canbusDump.dumpData.length = 0;
                    lv.canbusDump.csvData = '';
                    for (var item in data.msgList) {

                        let msg = data.msgList[item];
                        let rec = {};
                        rec.type = (msg.l & 0x10) ? 'Tx' : 'Rx';
                        rec.time = moment(data.beginTime + msg.t).format('YY-MM-DD hh:mm:ss');
                        rec.dTime = '+' + msg.t + 'ms';
                        rec.flags = (msg.i & 0x80000000) ? 'EFF ' : 'SFF ';
                        rec.flags += (msg.i & 0x40000000) ? 'RTR ' : '--- ';
                        rec.flags += (msg.i & 0x20000000) ? 'ERR' : '---';
                        rec.id = parseNumberToHex(msg.i & 0x1FFFFFFF);
//                        rec.id = msg.i & 0x1FFFFFFF;
                        rec.length = msg.l & 0x0F;

                        rec.data = '';
                        for (var i = 0; i < msg.d.length; i++) {
                            rec.data += parseNumberToHex(msg.d[i]);
                            if (i !== msg.d.length - 1) {
                                rec.data += ' ';
                            }
                        }
                        lv.canbusDump.dumpData.push(rec);
                        lv.canbusDump.csvData += rec.type + ', ' + rec.time + ', ' + rec.dTime + ', ' + rec.flags + ', ' + rec.id + ', ' + rec.idHex + ', ' + rec.length + '\r\n';

                    }

                    $('#canbusBeanTblData').puidatatable('reload');
                     console.log('Success', arguments);
                    if (lv.canbusDump.dumpData.length > 0) {
                        PF('canbusDumpDataDownloadButton').enable();
                    }
                 },
                    function (msg, error) {
                      console.log('Error', error);
                 },
                    function (msg) {
                      console.log('Timeout', msg) ;
                });
    },

    startCanbusDump: function () {
        lv.canbusDump.maxTimeMillis = Number(PF('canbusDumpMaxTime').getValue()) * 1000;
        lv.canbusDump.maxMsgCount = PF('canbusDumpMaxMsgCount').getValue();
        let msgLabel = document.querySelector('.smdcd_resultsSpan');

        dm.sendDevMessage({
                instrExt: "startCanbusDump",
                instrDataJson: { port: lv.canbusDump.selectedPort, timeIntervalMillis: lv.canbusDump.maxTimeMillis, maxMsgCount: lv.canbusDump.maxMsgCount }
        },
                    function () {

                    msgLabel.textContent = 'Dump In Progress...';
                    setTimeout(function () {
                        PF('canbusDumpDataRefreshButton').enable();
                        msgLabel.textContent = 'Dump Success, Please Refresh';
                    }, lv.canbusDump.maxTimeMillis);

                     console.log('Success', arguments);
                 },
                    function (msg, response) {
                      console.log('Error', arguments);
                    msgLabel.textContent = 'Dump Error: ' + response;
                 },
                    function () {
                    msgLabel.textContent = 'Error: Timeout';
                      console.log('Timeout', arguments);
                 });
    },

    openDialog: function (iFace) {
        console.log(iFace);
        lv.canbusDump.selectedPort = iFace.interfaceName;

        if (!lv.canbusDump.initTableComplete) {
            lv.canbusDump.initTable();
            lv.canbusDump.initTableComplete = true;
        }

        lv.canbusDump.getCanbusDumpInfo();
        PF('canbusDumpDialog').show();
    },

    download: function () {
//        var data = JSON.stringify(lv.canbusDump.dumpData);
        var data = lv.canbusDump.csvData.toString();
        mu.download('dump.txt', data);
    }
};

lv.interfaceTypeIntToTypeEnumMap = function (typeInt) {
//        SERIAL_RS232(2, ComsInterfaceFamilyEnum.SERIAL, "RS232"),
//    SERIAL_RS422(3, ComsInterfaceFamilyEnum.SERIAL, "RS422"),
//    SERIAL_RS485(4, ComsInterfaceFamilyEnum.SERIAL, "RS485"),
//    SERIAL_USBHID(6, ComsInterfaceFamilyEnum.SERIAL, "USB-HID"),
//    SERIAL_GENERIC(7, ComsInterfaceFamilyEnum.SERIAL, "GENERIC DEPRICATED"),
//    SERIAL_RS232_TTL5V(21, ComsInterfaceFamilyEnum.SERIAL, "RS232-TTL-5V"),
//    SERIAL_RS232_TTL3V3(22, ComsInterfaceFamilyEnum.SERIAL, "RS232-TTL-3.3V"),
//    CANBUS(1, ComsInterfaceFamilyEnum.CANBUS, "CANBUS"),
//    ETHERNET(5, ComsInterfaceFamilyEnum.ETHERNET, "ETHERNET");
    switch (typeInt) {
        case 1:
            return "CANBUS";
        case 2:
            return "SERIAL_RS232";
        case 3:
            return "SERIAL_RS422";
        case 4:
            return "SERIAL_RS485";
        case 5:
            return "ETHERNET";
        case 6:
            return "SERIAL_USBHID";
        case 6:
            return "USBSERIAL_USBHIDHID";
        case 7:
            return "SERIAL_GENERIC";
        case 21:
            return "RS232-TTL-5V";
        case 22:
            return "RS232-TTL-3.3V";

        default:
            console.log("Unknown Interface Type Int: " + typeInt);
            return "UNKNOWN TYPE";
    }
};

function parseNumberToHex(a, minLen) {
    let str = a.toString(16);
    if (!isNaN(minLen)) {
        while (str.length < minLen) {
            str = '0' + str;
        }
    } else if (str.length % 2 === 1) {
        str = '0' + str;
    }
    return '0x' + str;
}

lv.bmuH8 = {};
lv.multicast = {};
lv.bmuH8.onTryToConnectBtnClick = function () {
    //bmuh8DialogInfoLabel  id
    let ip = mu.getWidgetValue('bmuh8DialogIP');
    debugger;
    let message = {
        instr: wsm.connectionVar.executeInstr,
        instrExt: 'addDeviceByIp',
        ifaceName: lv.multicast.interface.interfaceName,
        ip: ip,
        devModelId: lv.multicast.devModelId
    };

    console.log("send settings");
    wsm.sendDevMsgExecWithJsonInst(message,
            function (msg, data) {
                mainUtils.showInfoMessage(data, msg.instrExt);
                console.log(data);
            },
            function (msg, err) {
                mainUtils.showErrorMessage(err, msg.instrExt);
                console.log(err);
            },
            function () {
                mainUtils.showErrorMessage("Timeout");
                console.log('timeout');
            },
            60 * 1000);

    PF('bmuH8ManualAddDialogWg').hide();
};

lv.bmuH8.onIpAddressKeyPress = function () {
    //bmuh8DialogInfoLabel  id
    let ip = mu.getWidgetValue('bmuh8DialogIP');
    if (ipUtils.validateIpAddrString(ip)) {
        PF('bmuh8dialogBtn').enable();
        document.querySelector('.bmuh8DialogInfoLabel').textContent = 'Click try to connect.';
    } else {
        document.querySelector('.bmuh8DialogInfoLabel').textContent = 'Please enter valid IP address';
        PF('bmuh8dialogBtn').disable();
    }
//    console.log(ip);
};

lv.multicastDeviceList = {
    deviceList: [],
    selectedData: {},
    init: function () {
        lv.multicastDeviceList.mcDevListDialog = new SMDUIDialog({
            heading: 'Discovered Devices',
            onInitComplete: function (contentDiv, footerDiv, comp) {
                comp.container.style.width = 'auto';
                let table = document.createElement('div');
                table.style.maxWidth = '800px';
                table.id = "mcDiscDevTable";
                contentDiv.appendChild(table);
//                contentDiv.style.width = 'fit-content';
                $("#mcDiscDevTable").puidatatable({
                    columns: [
                        {field: 'deviceSerial', headerText: 'Serial Number', bodyStyle: 'width: 30%'},
                        {field: 'fwVer', headerText: 'Firmware'},
                        {field: 'ipAddress', headerText: 'IP Address'},
                        {field: 'uptime', headerText: 'Up Time (sec)', sortable: true},
                        {field: 'connected', headerText: 'Online'}
                    ],
                    datasource: lv.multicastDeviceList.deviceList,
//                    caption: 'Discovered Devices',
                    emptyMessage: 'No Devices Discovered',
                    selectionMode: 'single',
                    sortField: 'ut',
                    sortOrder: -1,
                    resizableColumns: true,
                    columnResizeMode: 'expand',
                    rowSelect: function (event, data) {
                        lv.multicastDeviceList.selectedData = data;
                    }
                });
                let connectBtn = hh.button(footerDiv, 'Connect');
                connectBtn.onclick = function () {
                    lv.multicastDeviceList.connect();
                };

                let refreshBtn = hh.button(footerDiv, 'Refresh');
                refreshBtn.onclick = function () {
                    lv.multicastDeviceList.getDeviceList(6000);
                };

                //Testing somehtning
//                let tbl = new SMDUITable(contentDiv, {
//                    columns: [{headerText: "col1", field: "c1"}, {headerText: "col2", field: "c2"}],
//                    datasource: lv.multicastDeviceList.deviceList
//                });
            }
        });
    },
    getDeviceList: function (deviceType) {
        if (!lv.multicastDeviceList.mcDevListDialog) {
            lv.multicastDeviceList.init();
        }
        lv.multicast.deviceType = deviceType;
        wsm.sendDevMsgExecWithJsonInst({
            instr: wsm.connectionVar.executeInstr,
            instrExt: 'getMulticastDeviceList'
        },
                function (msg, data) {
                    lv.multicastDeviceList.deviceList.length = 0;
                    for (let item in data) {
                        if (data[item].deviceType && (data[item].deviceType === deviceType || !deviceType)) {
//                            data[item]
                            lv.multicastDeviceList.deviceList.push(data[item]);
                        }
                    }
                    $("#mcDiscDevTable").puidatatable('reload');
                    lv.multicastDeviceList.mcDevListDialog.open();
                },
                function (msg, err) {
                    mainUtils.showErrorMessage(err, msg.instrExt);
                    console.log(err);
                },
                function () {
                    mainUtils.showErrorMessage("Timeout");
                    console.log('timeout');
                },
                60 * 1000);
    },

    connect: function () {
        let ip = lv.multicastDeviceList.selectedData.ipAddress;

        let message = {
            instr: wsm.connectionVar.executeInstr,
            instrExt: 'addDeviceByIp',
            // ifaceName: lv.bmuH8.interface.interfaceName,
            ip: ip,
            devModelId: lv.multicast.getDeviceModelFromType(lv.multicast.deviceType)
        };

        console.log("send settings");
        wsm.sendDevMsgExecWithJsonInst(message,
                function (msg, data) {
                    mainUtils.showInfoMessage(data, msg.instrExt);
                    console.log(data);
                },
                function (msg, err) {
                    mainUtils.showErrorMessage(err, msg.instrExt);
                    console.log(err);
                },
                function () {
                    mainUtils.showErrorMessage("Timeout");
                    console.log('timeout');
                },
                60 * 1000);
    }

};


lv.multicast.getDeviceModelFromType = function (devType) {
    switch (devType) {
        case 6000:
            return 24;
        case 8000:
            return 51;
    }
};
