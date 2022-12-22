/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, hh, mu, bcGui, dm, bc */

var bc = {
    devData: {},
    warnErrDialogSerial: false,
    colorPickerInit: false,
    capacityAhParamInit: false,
    selectedModel: "",
    param: {}
};

bc.updateParam = function (dev, param) {
    if (param && !bc.paramSettings) {
        bc.paramSettings = true;
        let cont = bcGui.comp.settingTabPannelBasic;
        let serialOtions = [];
        for (var sn in param.bmsParamMap) {
            serialOtions.push({label: sn, value: sn});
        }

        let p = new ParamSetting(bcGui.comp.mainTabPanel.setPanel, 'calibUnitSerial', {
            type: 'dropDown',
            title: 'Calibration Serial Number',
            ctrlInfo: '.sd',
            alwayShowExecBtn: true,
            dropDownConf: {options: serialOtions}
        });

        if (param.calibUnitSerial) {
            p.setValue(param.calibUnitSerial, this.selected.serialNumber);
        } else {
            if (serialOtions.length > 0) {
                p.setValue(serialOtions[0].value, this.selected.serialNumber);
            }
        }

        let batModelOpts = [];
        for (var model in param.bmsModelParamMap) {
            batModelOpts.push({label: model, value: model});
        }

        bc.selectedModelSetting = new ParamSetting(bcGui.comp.mainTabPanel.setPanel, 'bmsSelectedModel', {
            type: 'dropDown',
            title: 'Battery Model',
            ctrlInfo: '',
            alwayShowExecBtn: true,
            dropDownConf: {options: batModelOpts}
        });

        if (param.bmsSelectedModel) {
            bc.selectedModelSetting.setValue(param.bmsSelectedModel, this.selected.serialNumber);
        } else {
            if (serialOtions.length > 0) {
                bc.selectedModelSetting.setValue(serialOtions[0].value, this.selected.serialNumber);
            }
        }
//        console.log(param);
//        debugger;
//        bcGui.createActualCellData(param.bmsParamMap, param.calibUnitSerial);
    }

    if (bcGui.isAdvancedUser) {

        if (!bcGui.comp.params) {
            bcGui.comp.params = {};
        }
        for (let model in param.modelParamMap) {
            bcGui.comp.mainTabPanel.addItem({label: model, id: model});
//        for (let setting in param.modelParamMap[model]) {
            if (!bcGui.comp.params[model]) {
//            bc.paramsInit = true;
                bcGui.comp.params[model] = {};

                let acordPanel = bcGui.comp.settingsAccordionPanel = new SMDUIAccordianPanel(bcGui.comp.mainTabPanel.getItemContentById(model),
                        {
                            tabs: [
                                {label: 'Basic', id: 'basic'},
                                {label: 'Balancing Test', id: 'balTest'},
                                {label: 'Balancing Temperature Test', id: 'balTestTemp'}
                            ],
                            selectedTab: 'basic'});

                let cont = bcGui.comp.settingTabPannelBasic = acordPanel.getTabContentById('basic');

                bcGui.comp.params[model].testCurrSesnseMaxIdleCurr = new ParamSetting(cont,
                        'testCurrSesnseMaxIdleCurr',
                        {
                            type: 'inputNumber',
                            title: 'Current Sense Max Idle Current:',
                            ctrlInfo: 'Max current before testing starts',
                            extraData: {
                                model: model
                            }
                        });

                bcGui.comp.params[model].testCurrSesnseMaxCurrDiff = new ParamSetting(cont,
                        'testCurrSesnseMaxCurrDiff',
                        {type: 'inputNumber',
                            title: 'Current Sense Max Diff Current:',
                            ctrlInfo: 'Max current difference. Will settle below this value before completing, otherwise will timeout if this value is not achieved.',
                            extraData: {
                                model: model
                            }
                        });

                bcGui.comp.params[model].minTestCurrent_A = new ParamSetting(cont,
                        'minTestCurrent_A',
                        {type: 'inputNumber',
                            title: 'Min Test Current:',
                            ctrlInfo: '',
                            unit: 'A',
                            extraData: {
                                model: model
                            }
                        });

                bcGui.comp.params[model].enableBalTempTest = new ParamSetting(cont,
                        'enableBalTempTest',
                        {type: 'switch',
                            title: 'Enable Balancing Temperature Test:',
                            ctrlInfo: '',
                            extraData: {
                                model: model
                            }
                        });

                bcGui.comp.params[model].maxCellVDiff_V = new ParamSetting(cont,
                        'maxCellVDiff_V',
                        {type: 'inputNumber',
                            title: 'Voltage Calibration Max CellV Diff:',
                            ctrlInfo: 'Maximum allowed CellV difference for voltage calibration',
                            unit: "V",
                            extraData: {
                                model: model
                            }
                        });

                bcGui.comp.params[model].calibVoltMaxDiff = new ParamSetting(cont,
                        'calibVoltMaxDiff',
                        {type: 'inputNumber',
                            title: 'Voltage Calibration Max Diff:',
                            ctrlInfo: 'Maximum allowed difference for voltage calibration',
                            extraData: {
                                model: model
                            }
                        });


                cont = bcGui.comp.balTest = acordPanel.getTabContentById('balTest');

                bcGui.comp.params[model].testBalCellBeginWaitTime = new ParamSetting(cont,
                        'testBalCellBeginWaitTime',
                        {type: 'inputNumber',
                            title: 'Settle delay:',
                            ctrlInfo: 'Maximum Time for Voltage to Settle',
                            extraData: {
                                model: model
                            }});

                bcGui.comp.params[model].testBalMaxCellVoltageChangeDelay = new ParamSetting(cont,
                        'testBalMaxCellVoltageChangeDelay',
                        {type: 'inputNumber',
                            title: 'Voltage Change Delay:',
                            ctrlInfo: 'Maximum delay to wait for voltage change',
                            extraData: {
                                model: model
                            }
                        });

                bcGui.comp.params[model].testBalCellMinDifBefore = new ParamSetting(cont,
                        'testBalCellMinDifBefore',
                        {type: 'inputNumber',
                            title: 'Cell Before Min increase:',
                            ctrlInfo: 'Minimum Voltage change to be consider as successfull',
                            extraData: {
                                model: model
                            }
                        });

                bcGui.comp.params[model].testBalCellMinDif = new ParamSetting(cont,
                        'testBalCellMinDif',
                        {type: 'inputNumber',
                            title: 'Cell Min decrease:', ctrlInfo: 'Minimum Voltage change to be consider as successfull',
                            extraData: {
                                model: model
                            }
                        });

                bcGui.comp.params[model].testBalCellMinDifAfter = new ParamSetting(cont,
                        'testBalCellMinDifAfter',
                        {type: 'inputNumber',
                            title: 'Cell After Min increase:',
                            ctrlInfo: 'Minimum Voltage change to be consider as successfull',
                            extraData: {
                                model: model
                            }
                        });



                cont = bcGui.comp.balTest = acordPanel.getTabContentById('balTestTemp');

                bcGui.comp.params[model].testBalTempCooldownMaxDelay = new ParamSetting(cont,
                        'testBalTempCooldownMaxDelay',
                        {type: 'inputNumber',
                            title: 'Cooldown time:',
                            ctrlInfo: 'Maximum Time for temperature to drop down.',
                            extraData: {
                                model: model
                            }
                        });

                bcGui.comp.params[model].testBalTempCooldownMinTemp = new ParamSetting(cont,
                        'testBalTempCooldownMinTemp',
                        {type: 'inputNumber',
                            title: 'Cooldown temperature:',
                            ctrlInfo: '',
                            extraData: {
                                model: model
                            }
                        });

                bcGui.comp.params[model].testBalTempMinDiff = new ParamSetting(cont,
                        'testBalTempMinDiff',
                        {type: 'inputNumber',
                            title: 'Test Minimum Difference delay:',
                            ctrlInfo: '',
                            extraData: {
                                model: model
                            }
                        });

                bcGui.comp.params[model].testBalTempMaxRaiseTime = new ParamSetting(cont,
                        'testBalTempMaxRaiseTime',
                        {type: 'inputNumber',
                            title: 'Max Rise delay:',
                            ctrlInfo: '',
                            extraData: {
                                model: model
                            }
                        });
            }
//            let set = new ParamSetting(bcGui.comp.mainTabPanel.getItemContentById(model), setting, {type: 'inputNumber', title: setting});
//            set.setValue(param.modelParamMap[model][setting]);
            for (let setting in param.modelParamMap[model]) {
                try {
                    bcGui.comp.params[model][setting].setValue(param.modelParamMap[model][setting]);
                } catch (e) {
                    console.log(setting + " : " + param.modelParamMap[model][setting]);
                }

            }

        }
    }

//    }
};

bc.updateCellVoltageTable = function (data, bmsData) {
    if (bmsData) {


        if (bcGui.dataComp.voltageTable) {
            let tCont = bcGui.dataComp.voltageTable.tContent;


            for (var i = 0; i < data.cellDiff.length; i++) {
                let cVol = bmsData.cellVoltageVArr[i] * 1000;
                let cDif = data.cellDiff[i];

                tCont[i].deltaV.textContent = (cDif > 0 ? '+' : '') + cDif + 'mV';
                tCont[i].voltage.textContent = cVol + 'mV';
            }
            if (bcGui.dataComp.tagetBmsBalancingStatus) {
                bcGui.dataComp.tagetBmsBalancingStatus.value = bcGui.map_cmMonBalStatusToString(bmsData.balancingStatus);
            }
            try {
                hh.updateAdfFromObject(bcGui.dataComp, data);
                hh.updateAdfFromObject(bcGui.testDataComp, data);
            } catch (e) {

            }
        }
    }
}

devManager.onSelectedDataReceived(bc.updateData);

devManager.onSelectedParamInit(bc.updateParam);

devManager.onSelectedChange(function (sDev) {
    try {
        var image1 = document.querySelector('.devTbPanel-' + sDev.serialNumber + ' img');
//    mainUtils.initCanvas('bmsEmInfoIcon', image1, 280, 280);
    } catch (e) {

    }

//    bc.updateParam(sDev, sDev.getParam());
    if (sDev.connected) {
        bc.updateData(sDev, sDev.getData());
        bc.updateParam(sDev, sDev.getParam());
    } else {
        mainUtils.setHtmlText('dataValues');
    }
});

devManager.onSelectedStatusChange(function (dev, state) {
    if (state && dev.getData() !== undefined) {
        bc.updateData(dev, dev.getData());
        bc.updateParam(dev, dev.getParam());
    } else {
        mainUtils.setHtmlText('dataValues');
    }
});

devManager.onParamReceived(function (dev, param) {
    param.subModelID = dev.subModelID;
});

bc.getProtStateText = function (state) {
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

bc.loadConfigSet = function (name) {

};

bc.subModelName = function (id) {
    if (id === undefined) {
        return "UNKNOWN NULL";
    }
    switch (id) {
        case 20205:
        case 407401 & 0xFFFF:
        {
            return 'SS4074-02';
        }
        case 403701:
        case 403701 & 0xFFFF:
        {
            return 'SS4037-02';
        }
    }
    return "UNKNOWN " + id;
};



bc.protState = function (protRelayCode) {
    if (protRelayCode >= 1 && protRelayCode <= 0x0F) {
        return "ON";
    }
    return "OFF";
};
bc.protRelayToString = function (code) {
    switch (code) {
        case 0:
            return "RELAY OPENED";
        case 1:
            return "RELAY CLOSED";
        case 0x03:
            return "RELAY CLOSED - ENERGY SAVING MODE";
        case 0x07:
            return "RELAY CLOSED - ENERGY SAVING LIMITED";
        case 0x17:
            return "RELAY CLOSED - ENERGY SAVING UNAVAILABLE";
        case 0x10:
            return "RELAY OPENED - FUSE BURNED";
        case 0x20:
            return "RELAY OPENED - COIL NOT CONNECTED";
        case 0x40:
            return "RELAY OPENED - COIL SHORT/VOLTAGE TOO LOW";
        case 0x50:
            return "RELAY OPENED OVERRIDE OFF ACTIVE";
        case 0x60:
            return "RELAY OFF - MANUAL CONTROL";
        case 0x70:
            return "RELAY OFF - ERROR PENDING";
        case 0x80:
            return "RELAY OPENED ";

        default:
            return "UNKNOWN STATE - " + code;
    }
};
bc.map_cmMonBalStatusToString = function (code) {
    switch (code) {
        case 0:
            return "DISABLED";
        case 1:
            return "CURRENT LIMIT";
        case 2:
            return "CUTOFF VOLTAGE LIMIT";
        case 3:
            return "TEMPERATURE LIMIT";
        case 4:
            return "ACTIVE";
        case 5:
            return "VB ACTIVE";
        case 6:
            return "VB COMPLETE";
        case 7:
            return "VB OUT_OF_RANGE";
        case 10:
            return "MB TIME ACTIVE";
        case 11:
            return "MB CAP ACTIVE";
        case 12:
            return "MB COMPLETE";
        default:
            return "UNKNOWN BALANCING STATE - " + code;
    }
};
bc.map_CellChemistryToString = function (code) {
    switch (code) {
        case 0:
            return "LFP-Lithium Iron Phosphate(LiFePO4)";
        case 1:
            return "LCO-Lithium Cobalt Oxide(LiCoO2)";
        case 2:
            return "LMO-Lithium Manganese Oxide(LiMn2O4)";
        case 3:
            return "NMC-Lithium Nickel Manganese Cobalt Oxide(LiNiMnCoO2)";
        case 4:
            return "NCA-Lithium Nickel Cobalt Aluminum Oxide(LiNiCoAlO2)";
        case 5:
            return "LTO-Lithium Titanate(Li2TiO3)";

        default:
            return "UNKNOWN CELL CHEMISTRY CODE: " + code;
    }
};
bc.map_chDchRegDeratingCauseToString = function (code) {
    switch (code) {
        case 0:
            return "No Limit";
        case 1:
            return "Voltage Limit";
        case 2:
            return "Capacity Limit";
        case 3:
            return "Temperature Limit";
        default:
            return "UNKNOWN CH DSCH DERATING CODE: " + code;
    }
};

$(document).ready(function () {
    bcGui.initGUI();
});