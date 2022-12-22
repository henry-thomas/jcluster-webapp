/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, fetch, hh, wsm, mu, value, dm */

function addField(panelContainer, title, value, valueClass, unit) {
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: title, value: value, valueClass: [valueClass], unit: (!unit ? "" : unit)}));
}
function addPowerPanelTemplate(panelName, powerName) {
    let panel = hh.createActDataPanelCard(panelName);
//    addField(panel, 'Available:', "N/A", 'ssgtD-' + powerName + '-available');
    addField(panel, 'Power:', "N/A", 'ssgtD-' + powerName + '-powerW', 'W');
    addField(panel, 'Rated Power:', "N/A", 'ssgtD-' + powerName + '-ratedPowerW', 'W');
    addField(panel, 'Current:', "N/A", 'ssgtD-' + powerName + '-currentA', 'A');
    addField(panel, 'Voltage:', "N/A", 'ssgtD-' + powerName + '-voltageV', 'V');
    addField(panel, 'Energy Today:', "N/A", 'ssgtD-' + powerName + '-dailyEnergyWh', 'kWh');
    addField(panel, 'Energy This Week:', "N/A", 'ssgtD-' + powerName + '-weeklyEnergyWh', 'kWh');
    addField(panel, 'Energy This Month:', "N/A", 'ssgtD-' + powerName + '-monthlyEnergyWh', 'kWh');
    addField(panel, 'Energy This Year:', "N/A", 'ssgtD-' + powerName + '-yearlyEnergyWh', 'kWh');
    addField(panel, 'Total Energy:', "N/A", 'ssgtD-' + powerName + '-energyWh', 'kWh');
//    addField(panel, 'Frequency:', "N/A", 'ssgtD-' + powerName + '-frequencyHz', 'Hz');
//    addField(panel, 'Last Update:', "N/A", 'ssgtD-'+powerName+'-lastUpdate');
    return panel;
}

function populatePowerPanelTemplate(data, powerName) {
//    mainUtils.setHtmlText('ssgtD-' + powerName + '-available', data[powerName].available);
    mainUtils.setHtmlText('ssgtD-' + powerName + '-powerW', data[powerName].powerW);
    mainUtils.setHtmlText('ssgtD-' + powerName + '-ratedPowerW', data[powerName].ratedPowerW);
    mainUtils.setHtmlText('ssgtD-' + powerName + '-voltageV', data[powerName].voltageV);
    mainUtils.setHtmlText('ssgtD-' + powerName + '-currentA', data[powerName].currentA);
    mainUtils.setHtmlText('ssgtD-' + powerName + '-dailyEnergyWh', (data[powerName].dailyEnergyWh / 1000).toFixed(2));
    mainUtils.setHtmlText('ssgtD-' + powerName + '-weeklyEnergyWh', (data[powerName].weeklyEnergyWh / 1000).toFixed(2));
    mainUtils.setHtmlText('ssgtD-' + powerName + '-monthlyEnergyWh', (data[powerName].monthlyEnergyWh / 1000).toFixed(2));
    mainUtils.setHtmlText('ssgtD-' + powerName + '-yearlyEnergyWh', (data[powerName].yearlyEnergyWh / 1000).toFixed(2));
    mainUtils.setHtmlText('ssgtD-' + powerName + '-energyWh', (data[powerName].energyWh / 1000).toFixed(2));
//    mainUtils.setHtmlText('ssgtD-' + powerName + '-frequencyHz', data[powerName].freqHz);
//    mainUtils.setHtmlText('ssgtD-'+powerName+'-lastUpdate', moment(data[powerName].lastUpdate).format('YYYY-MM-DD hh:mm:ss'));
}

var ssgt = {
    lastUnitLoaded: null,
    dataComp: {
        fw: {}
    }
};

function addHeader(panel, label) {
    let headerBlock = document.createElement('div');
    headerBlock.classList.add('header-block');
    let headerBlockContent = document.createElement('span');
    headerBlockContent.textContent = label;
    headerBlock.appendChild(headerBlockContent);
    panel.appendChild(headerBlock);
}
;

ssgt.createActualData = function (container) {
//    let generatorPanel = addPowerPanelTemplate('Generator', 'gen');
    let generatorPanel = hh.createActDataPanelCard('Generator');
    addField(generatorPanel, 'Power:', "N/A", 'ssgtD-gen-powerW', 'W');
    addField(generatorPanel, 'Rated Power:', "N/A", 'ssgtD-gen-ratedPowerW', 'W');
    addField(generatorPanel, 'Frequency:', "N/A", 'ssgtD-gen-freqHz', 'Hz');
    addField(generatorPanel, "Daily Runtime:", "N/A", "ssgtD-gen-dailyRunTimeHours");
    addField(generatorPanel, 'Energy Today:', "N/A", 'ssgtD-gen-dailyEnergyWh', 'kWh');
    addField(generatorPanel, 'Energy This Week:', "N/A", 'ssgtD-gen-weeklyEnergyWh', 'kWh');
    addField(generatorPanel, 'Energy This Month:', "N/A", 'ssgtD-gen-monthlyEnergyWh', 'kWh');
    addField(generatorPanel, 'Energy This Year:', "N/A", 'ssgtD-gen-yearlyEnergyWh', 'kWh');
    addField(generatorPanel, 'Total Energy:', "N/A", 'ssgtD-gen-energyWh', 'kWh');

    let auxLoadPanel = addPowerPanelTemplate('Aux Port', 'auxLoad');

    let loadExpPanel = addPowerPanelTemplate('Load', 'loadExp');

    let pv1Panel = addPowerPanelTemplate('PV 1', 'pv1');

    let pv2Panel = addPowerPanelTemplate('PV 2', 'pv2');

    let batPanel = hh.createActDataPanelCard("Inverter Battery Readings", 'bat');
    addField(batPanel, 'Power:', "N/A", 'ssgtD-bat-powerW', 'W');
    addField(batPanel, 'Rated Power:', "N/A", 'ssgtD-bat-ratedPowerW', 'W');
    addField(batPanel, 'Current:', "N/A", 'ssgtD-bat-currentA', 'A');
    addField(batPanel, 'Voltage:', "N/A", 'ssgtD-bat-voltageV', 'V');
    addField(batPanel, 'Total Capacity:', "N/A", 'ssgtD-bat-capacityAh', 'Ah');
    addField(batPanel, 'Battery Temp:', "N/A", 'ssgtD-bat-batTemperatureDegC', 'C');
    addField(batPanel, 'Charge Energy Today:', "N/A", 'ssgtD-batChg-dailyEnergyWh', 'kWh');
    addField(batPanel, 'Charge Energy This Week:', "N/A", 'ssgtD-batChg-weeklyEnergyWh', 'kWh');
    addField(batPanel, 'Charge Energy This Month:', "N/A", 'ssgtD-batChg-monthlyEnergyWh', 'kWh');
    addField(batPanel, 'Charge Energy This Month:', "N/A", 'ssgtD-batChg-yearlyEnergyWh', 'kWh');
    addField(batPanel, 'Total Charge Energy:', "N/A", 'ssgtD-batChg-energyWh', 'kWh');
    addHeader(batPanel, 'Discharge Energies');
    addField(batPanel, 'Discharge Energy Today:', "N/A", 'ssgtD-batDischg-dailyEnergyWh', 'kWh');
    addField(batPanel, 'Discharge Energy This Week:', "N/A", 'ssgtD-batDischg-weeklyEnergyWh', 'kWh');
    addField(batPanel, 'Discharge Energy This Month:', "N/A", 'ssgtD-batDischg-monthlyEnergyWh', 'kWh');
    addField(batPanel, 'Discharge Energy This Year:', "N/A", 'ssgtD-batDischg-yearlyEnergyWh', 'kWh');
    addField(batPanel, 'Total Discharge Energy:', "N/A", 'ssgtD-batDischg-energyWh', 'kWh');

    let gridPanel = addPowerPanelTemplate('Grid', 'grid');
    addField(gridPanel, 'Frequency', "N/A", 'ssgtD-grid-freqHz', 'Hz');

    let generalInfoPanel = hh.createActDataPanelCard("General");
    addField(generalInfoPanel, "Running State:", "N/A", "ssgtD-runningState");
    addField(generalInfoPanel, "Transformer Temp:", "N/A", "ssgtD-transformerTemperatureC", "C");
    addField(generalInfoPanel, "Daily Active Energy:", "N/A", "ssgtD-dailyActiveEnergyGenerationKWh", "kWh");
    addField(generalInfoPanel, "Daily Reactive Energy:", "N/A", "ssgtD-dailyReactiveEnergyGenerationKVarh", "VA");

    container.appendChild(generalInfoPanel);
    container.appendChild(batPanel);
    container.appendChild(gridPanel);
    container.appendChild(generatorPanel);
    container.appendChild(auxLoadPanel);
    container.appendChild(loadExpPanel);
    container.appendChild(pv1Panel);
    container.appendChild(pv2Panel);
};


ssgt.updateData = function (dev, data) {
    function getRunningState(state) {
        let val;
        switch (state) {
            case 0:
                val = "Standby";
                break;
            case 1:
                val = "Self Check";
                break;
            case 2:
                val = "Normal";
                break;
            case 3:
                val = "Alarm";
                break;
            case 4:
                val = "Fault";
                break;
            default:
                val = "Unknown State";
                break;
        }
        return val;
    }

    if (!data) {
        console.log('Sunsynk GT Series. No valid data received');
        return;
    }
    populatePowerPanelTemplate(data, 'gen');
    mainUtils.setHtmlText('ssgtD-gen-dailyRunTimeHours', data.gen.dailyRunTimeHours);
    mainUtils.setHtmlText('ssgtD-gen-freqHz', data.gen.freqHz);

    populatePowerPanelTemplate(data, 'auxLoad');
    populatePowerPanelTemplate(data, 'loadExp');
    populatePowerPanelTemplate(data, 'pv1');
    populatePowerPanelTemplate(data, 'pv2');
    mainUtils.setHtmlText('ssgtD-runningState', getRunningState(data.runningState));
    mainUtils.setHtmlText('ssgtD-transformerTemperatureC', data.transformerTemperatureC);
    mainUtils.setHtmlText('ssgtD-dailyActiveEnergyGenerationKWh', data.dailyActiveEnergyGenerationKWh);
    mainUtils.setHtmlText('ssgtD-dailyReactiveEnergyGenerationKVarh', data.dailyReactiveEnergyGenerationKVarh);

    let batPower = 0;
    let batCurrent = 0;
    if (data.batDischg.available || data.batDischg.available) {
        if (data.batDischg.powerW > 0) {
            batPower = '(Discharging)  ' + data.batDischg.powerW;
            batCurrent = data.batDischg.currentA;
        } else if (data.batChg.powerW > 0) {
            batPower = '(Charging)  ' + data.batChg.powerW;
            batCurrent = data.batChg.currentA;
        }
    }
    mainUtils.setHtmlText('ssgtD-bat-currentA', batCurrent);
    mainUtils.setHtmlText('ssgtD-bat-powerW', batPower);
    mainUtils.setHtmlText('ssgtD-bat-ratedPowerW', data.batChg.ratedPowerW);
    mainUtils.setHtmlText('ssgtD-bat-voltageV', data.batChg.voltageV);
    mainUtils.setHtmlText('ssgtD-bat-batTemperatureDegC', data.batTemperatureDegC);
    mainUtils.setHtmlText('ssgtD-bat-capacityAh', data.capacityAh);
    mainUtils.setHtmlText('ssgtD-batChg-dailyEnergyWh', (data.batChg.dailyEnergyWh / 1000).toFixed(2));
    mainUtils.setHtmlText('ssgtD-batChg-weeklyEnergyWh', (data.batChg.weeklyEnergyWh / 1000).toFixed(2));
    mainUtils.setHtmlText('ssgtD-batChg-monthlyEnergyWh', (data.batChg.monthlyEnergyWh / 1000).toFixed(2));
    mainUtils.setHtmlText('ssgtD-batChg-yearlyEnergyWh', (data.batChg.yearlyEnergyWh / 1000).toFixed(2));
    mainUtils.setHtmlText('ssgtD-batDischg-dailyEnergyWh', (data.batDischg.dailyEnergyWh / 1000).toFixed(2));
    mainUtils.setHtmlText('ssgtD-batDischg-weeklyEnergyWh', (data.batDischg.weeklyEnergyWh / 1000).toFixed(2));
    mainUtils.setHtmlText('ssgtD-batDischg-monthlyEnergyWh', (data.batDischg.monthlyEnergyWh / 1000).toFixed(2));
    mainUtils.setHtmlText('ssgtD-batDischg-yearlyEnergyWh', (data.batDischg.yearlyEnergyWh / 1000).toFixed(2));
    mainUtils.setHtmlText('ssgtD-batDischg-energyWh', (data.batDischg.energyWh / 1000).toFixed(2));
    mainUtils.setHtmlText('ssgtD-batChg-energyWh', (data.batChg.energyWh / 1000).toFixed(2));

    let gridPower = 0;
    let gridCurrent = 0;
    if (data.gridImp.available || data.gridExp.available) {
        if (data.gridImp.powerW > 0) {
            gridPower = '(Importing)  ' + data.gridImp.powerW;
            gridCurrent = data.gridImp.currentA;
        } else if (data.gridExp.powerW > 0) {
            gridPower = '(Exporting)  ' + data.gridExp.powerW;
            gridCurrent = data.gridExp.currentA;
        }
    }

    mainUtils.setHtmlText('ssgtD-grid-currentA', gridCurrent);
    mainUtils.setHtmlText('ssgtD-grid-powerW', gridPower);
    mainUtils.setHtmlText('ssgtD-grid-ratedPowerW', data.gridImp.ratedPowerW);
    mainUtils.setHtmlText('ssgtD-grid-voltageV', data.gridImp.voltageV);
    mainUtils.setHtmlText('ssgtD-grid-freqHz', data.gridImp.freqHz);
    mainUtils.setHtmlText('ssgtD-grid-dailyEnergyWh', (data.gridImp.dailyEnergyWh / 1000).toFixed(2));
    mainUtils.setHtmlText('ssgtD-grid-weeklyEnergyWh', (data.gridImp.weeklyEnergyWh / 1000).toFixed(2));
    mainUtils.setHtmlText('ssgtD-grid-monthlyEnergyWh', (data.gridImp.monthlyEnergyWh / 1000).toFixed(2));
    mainUtils.setHtmlText('ssgtD-grid-yearlyEnergyWh', (data.gridImp.yearlyEnergyWh / 1000).toFixed(2));
    mainUtils.setHtmlText('ssgtD-grid-energyWh', (data.gridImp.energyWh / 1000).toFixed(2));
};

ssgt.updateParam = function (dev, param) {
    dev.paramLoaded = true;
    mainUtils.setHtmlText('ssgtP-deviceName', dev.deviceName);
    mainUtils.setHtmlText('ssgtP-installedDate', dev.installedDate);
//    mainUtils.setHtmlText('ssgtP-lastSeen', moment(dev.lastSeen).format('YYYY-MM-DD HH:mm:ss'));
//    mainUtils.setHtmlText('ssgtP-comProtocol', param.comProtocol);
    mainUtils.setHtmlText('ssgtP-serialNumber', param.serialNumber);
    mainUtils.setHtmlText('ssgtP-firmwareVer', dev.fwVer);
    if (param.lcdFirmware) {
        let version = param.lcdFirmware.substring(1);
        let type = param.lcdFirmware.charAt(0);
        mainUtils.setHtmlText('ssgtP-comsFwVer', (type === "E" ? 'Sunsynk ' : 'Deye ') + version + " (" + param.lcdFirmware + ')');
//        mainUtils.setHtmlText('ssgtP-deviceName', (type === "E" ? 'Sunsynk ' : 'Deye ') + ' 8K');
    } else {
        mainUtils.setHtmlText('ssgtP-comsFwVer', param.comsFwVer);
    }
    mainUtils.setHtmlText('ssgtP-safetyType', param.safetyType);

};

ssgt.createInfo = function (container) {
    let infoPanel = hh.createActDataPanelCard("General Info");
//    addField(panel, 'Available:', "N/A", 'ssgtD-' + powerName + '-available');
    addField(infoPanel, 'Device Name:', "N/A", 'ssgtP-deviceName');
    addField(infoPanel, 'Installed Date:', "N/A", 'ssgtP-installedDate');
//    addField(infoPanel, 'Last Seen:', "N/A", 'ssgtP-lastSeen');
//    addField(infoPanel, 'COM Protocol:', "N/A", 'ssgtP-comProtocol');
    addField(infoPanel, 'Serial Number:', "N/A", 'ssgtP-serialNumber');
    addField(infoPanel, 'Firmware Version:', "N/A", 'ssgtP-firmwareVer');
    addField(infoPanel, 'LCD FW Version:', "N/A", 'ssgtP-comsFwVer');
    addField(infoPanel, 'Safety Type:', "N/A", 'ssgtP-safetyType');
    container.appendChild(infoPanel);
};

ssgt.init = function () {
    ssgt.createActualData(document.getElementById("ssgt-actData-p1"));
    ssgt.createInfo(document.getElementById("ssgt-info-p1"));

};

ssgt.onInstrSuccess = function (message, data) {
    mu.showInfoMessage(data, "Success");
};

ssgt.onInstrError = function (message, data) {
    mu.showErrprMessage(data, "Error");
};

ssgt.factoryReset = function () {
    wsm.sendDevMsgExecWithJsonInst({instrExt: "factoryReset"}, ssgt.onInstrSuccess, ssgt.onInstrError, ssgt.onInstrError);
};

function onInverterClick() {
    let inverterImage = document.getElementById('ssgtFullscreen');
    let svgContainer = document.querySelector('.svgContainer');
    let svg = document.getElementById('ssgtMain');
    document.onfullscreenchange = function () {
        if (document.fullscreenElement) {
            svgContainer.style.backgroundColor = '#f7f7f7';
            svgContainer.style.display = 'flex';
            svgContainer.style.flexDirection = 'column';
            svgContainer.style.justifyContent = 'center';
            svg.setAttribute('height', '100vh');
        } else {
            svgContainer.style.backgroundColor = '';
            svgContainer.style.display = '';
            svgContainer.style.flexDirection = '';
            svgContainer.style.justifyContent = '';
            svg.setAttribute('height', '280px');
        }

    }.bind(this);
    inverterImage.addEventListener('click', hh.toggleFullscreen.bind(this, svgContainer));

}
devManager.onSelectedDataReceived(ssgt.updateData);
devManager.onSelectedParamInit(ssgt.updateParam);

devManager.onSelectedChange(function (sDev) {
    ssgt.lastUnitLoaded = null;
    if (sDev.connected) {
        ssgt.updateParam(sDev, sDev.getParam());
        ssgt.updateData(sDev, sDev.getData());
    } else {
        mainUtils.setHtmlText('dataValues', 'N/A');
    }
//    console.log(arguments);
});
devManager.onParamReceived(function (sDev, param) {

});

devManager.onSelectedStatusChange(function (sDev, status) {
    ssgt.lastUnitLoaded = null;
    if (status) {
        ssgt.updateData(sDev, sDev.getData());
    } else {
        mainUtils.setHtmlText('dataValues', 'N/A');
    }
});



ssgt.onBmsExFwUpdateProgressData = function (dev, prog, id) {
//    bmsex.dataContent.firmwareUpdatePrg.value = prog.pState;
//    bmsex.dataContent.firmwareUpdatePrgState.html = prog.prop.text;
    this.dataComp.text.value = prog.prop.text;
    this.dataComp.byteCounter.value = (prog.prop.bytes / 1000).toFixed(1) + 'kB /' + (prog.prop.imageLen / 1000).toFixed(1) + 'kB';
    this.dataComp.progress.value = prog.pState;
};

dm.onProgressDialogCreate('deyeFwUpdate', function (dev, pId, dialog) {
    dialog.setBarTitle(dev.serialNumber + " Firmware Update.");
//    hh.addHeaderTitleToPC(dialog.contentDiv, "Firmware Update", null);
    dialog.dataComp = {};
    dialog.dataComp.text = hh.adf(dialog.contentDiv, ' ');
    dialog.dataComp.progress = hh.adf(dialog.contentDiv, 'Progress', '%');
    dialog.dataComp.byteCounter = hh.adf(dialog.contentDiv, 'Sent Bytes');
});


dm.onProgressData('deyeFwUpdate', ssgt.onBmsExFwUpdateProgressData);


ssgt.initFwDialog = function () {
    try {

        ssgt.dataComp.fw.dialog = new SMDUIDialog({
            modal: false,
            heading: 'Firmware Info',
            draggable: true
        });
        hh.addCssToDom('width: auto; height: 550px; overflow: auto;', ssgt.dataComp.fw.dialog.contentDiv);
        ssgt.dataComp.fw.cont = hh.div(ssgt.dataComp.fw.dialog.contentDiv, 'devParamPanelWrapper', 'width: 450px;');

        let divCont = document.querySelector('.fwUpdateDivfwUpdateDiv');
        let button = hh.button(divCont, 'Show Fw Info');
        button.onclick = ssgt.firmwareRefresh;
    } catch (e) {

    }
//    bmsex.firmwareRefresh();
};

ssgt.createFirmwareUploadButton = function (ver) {
//    debugger;
    new ParamSetting(ssgt.dataComp.fw.cont, {detached: true, type: 'dropDownButton',
        title: ver.type + ' ' + ver.brand + " " + ver.fwVer,
//        ctrlInfo: 'Firmware version ' + ver.type + ' for Inverter Deye is available for transfer to the BMS.</br>'
//                + 'During transfer you will see progress bar. The battery will continue to operate normally durring this proccess.',
        content: [{
                name: 'Update ',
                cb: function () {
                    wsm.sendDevMsgExecWithJsonInst({
                        instrExt: 'updateFw',
                        updateFw: ver.filePath,
                        // execInstr: 1,
                        showMessage: true
                    }, function () {
                        mainUtils.showInfoMessage("Firmware Install Begin.");
                        ssgt.dataComp.fw.dialog.hide();

                    });
                }
            }]
    });
};

ssgt.firmwareInstallRefresh = function () {
//    ssgt.flags.enableOldFwVersions = 1;
//    debugger;
    hh.removeAllChilds(ssgt.dataComp.fw.cont);
//    debugger;



//    debugger;
    for (let verStr in ssgt.fwData.availableUpdates) {
        ssgt.createFirmwareUploadButton(ssgt.fwData.availableUpdates[verStr]);
    }

    new ParamSetting(ssgt.dataComp.fw.cont, {detached: true, type: 'dropDownButton',
        title: 'Check for Online Update',
        ctrlInfo: 'This function allows the LoggerV2 to check for new firmware available online.'
                + ' When this proccess starts, you will see progres dialog.',
        content: [{
                name: 'Check now ',
                cb: function () {
                    wsm.sendDevMsgExecWithJsonInst({
                        instrExt: 'checkForUpdate',
                        showMessage: true
                    });
                    ssgt.dataComp.fw.dialog.hide();
                }
            }]
    });

    ssgt.dataComp.fw.dialog.show();
};

ssgt.firmwareRefresh = function () {
    if (window.loggerFw && window.loggerFw < 8.4071) {
        mu.showErrorMessage("Logger version does not support this call, please update to: ver:8.4071 ");
        return;
    }
    devManager.executeInstr('getAvailableFw', null, null,
            function (a, param) {

                ssgt.fwData = {};
                ssgt.fwData.availableUpdates = param;
                ssgt.firmwareInstallRefresh();
            });

};

$(document).ready(function () {
    ssgt.init();
    onInverterClick();

    ssgt.initFwDialog();
});

