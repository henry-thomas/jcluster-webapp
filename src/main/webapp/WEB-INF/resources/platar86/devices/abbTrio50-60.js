///* global logCon, PF, mainUtils, moment, devManager, bmsRelay */
//
//
//var trio = {
//    warnErrDialogSerial: false,
//    colorPickerInit: false,
//    capacityAhParamInit: false,
//    devData: {}
//};
//
//trio.updateData = function (dev, data) {
//
//    setText('powerW', (data.acPower.powerW / 1000).toFixed(2) + 'kW');
//    setText('apparentPowerVA', (data.acPower.apparentPowerVA / 1000).toFixed(2) + 'kVA');
//    setText('currentA', (data.acPower.currentA).toFixed(2) + 'A');
//    setText('currentAPhaseA', (data.acPower.currentAPhaseA).toFixed(2) + 'A');
//    setText('currentAPhaseB', (data.acPower.currentAPhaseB).toFixed(2) + 'A');
//    setText('currentAPhaseC', (data.acPower.currentAPhaseC).toFixed(2) + 'A');
//    setText('frequencyF', (data.acPower.frequencyF).toFixed(2) + 'Hz');
//    setText('reactivePowerVAR', (data.acPower.reactivePowerVAR / 1000).toFixed(2) + 'kVAR');
//    setText('voltageVphAB', (data.acPower.voltageVphAB).toFixed(2) + 'V');
//    setText('voltageVphBC', (data.acPower.voltageVphBC).toFixed(2) + 'V');
//    setText('voltageVphCA', (data.acPower.voltageVphCA).toFixed(2) + 'V');
//    setText('voltageVphAN', (data.acPower.voltageVphAN).toFixed(2) + 'V');
//    setText('voltageVphBN', (data.acPower.voltageVphBN).toFixed(2) + 'V');
//    setText('voltageVphCN', (data.acPower.voltageVphCN).toFixed(2) + 'V');
//    dev.warningCnt = data.warningCount;
//    dev.errorCnt = data.errorCount;
//    dev.updateHtml();
//
//
//    if (dev.paramLoaded === true) {
//        if (dev.capacityAhInit === undefined) {
//            dev.capacityAhInit = true;
//            mainUtils.setWidgetValue("capacityAh", data.capacityAh);
//            trio.onParamChange('capacityAh');
//        }
//    }
//};
//trio.updateParam = function (dev, param) {
//
////    if (trio.colorPickerInit === false) {
////        trio.colorPickerInit = true;
////        mainUtils.addColorpickerCallback('ledButtonStaticValue', trio.onColorPickerChange);
////    }
////    if (param === undefined) {
////        return;
////    }
////
////    console.log(param);
////    setText('cellModelLabel', param.cellModel);
////    setText('cellManufacturerLabel', param.cellManufacturer);
////    setText('manufacturingDateLabel', moment(param.manufacturingDate).format('DD-MM-YYYY hh:mm'));
////    setText('storageName', param.storageName);
////    setText('ratedCapacity', (param.ratedCapacityAh).toFixed(1) + 'Ah / ' + (param.ratedVoltageV * param.ratedCapacityAh).toFixed(1) + 'Wh');
////    setText('ratedVoltageV', (param.ratedVoltageV).toFixed(1) + 'V');
////
////    var ratedChargeCurrent = ((param.ratedChargeCurrentC * param.ratedCapacityAh)).toFixed(2);
////    var ratedChargePower = ((param.ratedVoltageV * Number(ratedChargeCurrent)) / 1000).toFixed(2);
////    setText('ratedCharge', ratedChargePower + 'kW / '
////            + ratedChargeCurrent + 'A ('
////            + param.ratedChargeCurrentC.toFixed(2) + 'C)');
////
////    var ratedDischargeCurrent = ((param.ratedDischargeCurrentC * param.ratedCapacityAh)).toFixed(2);
////    var ratedDischargePower = ((param.ratedVoltageV * Number(ratedDischargeCurrent)) / 1000).toFixed(2);
////    setText('ratedDischarge', ratedDischargePower + 'kW / '
////            + ratedDischargeCurrent + 'A ('
////            + param.ratedDischargeCurrentC.toFixed(2) + 'C)');
////
////    //refresh all values
////    for (var item in param) {
////        if (Array.isArray(param[item])) {
////            var arr = param[item];
////            for (var i = 0; i < arr.length; i++) {
////                var cName = item + (i.toString());
////                mainUtils.setWidgetValue(cName, arr[i]);
////            }
////        } else {
////            mainUtils.setWidgetValue(item, param[item]);
////        }
////    }
////    //refresh all controls
////    for (var item in param) {
////
////        trio.updataParamControl(item, dev);
////    }
//    dev.paramLoaded = true;
//};
//
//trio.updataParamControl = function (compName, dev) {
//    if (devManager.getSelected() !== undefined) {
//        if (Array.isArray(dev.getParam()[compName])) {
//            var arr = dev.getParam()[compName];
//            for (var i = 0; i < arr.length; i++) {
//                var cName = compName + (i.toString());
//                var actualParam = Number(dev.getParam()[compName][i]);
//                var value = Number(mainUtils.getWidgetValue(cName));
//                if (value === undefined) {
//                    value = actualParam;
//                }
//                if (actualParam !== undefined) {
//                    var controlButton = document.getElementsByClassName(cName)[0];
//                    if (controlButton !== undefined) {
//                        if (actualParam !== value) {
//                            controlButton.style.display = 'block';
//                        } else {
//                            controlButton.style.display = 'none';
//                        }
//                    }
//                }
//            }
//        } else {
//            var actualParam = Number(dev.getParam()[compName]);
//            var value = Number(mainUtils.getWidgetValue(compName));
//            if (value === undefined) {
//                value = actualParam;
//            }
//            if (actualParam !== undefined) {
//                var controlButton = document.getElementsByClassName(compName)[0];
//                if (controlButton !== undefined) {
//                    if (actualParam !== value) {
//                        controlButton.style.display = 'block';
//                    } else {
//                        controlButton.style.display = 'none';
//                    }
//                }
//
//            }
//        }
//    }
//}
//;
//
//trio.onColorPickerChange = function (value, intVal, widget) {
//    trio.onParamChange(widget);
//};
//
//trio.onParamChange = function (compName, idx) {
//    if (devManager.getSelected() !== undefined) {
//        trio.updataParamControl(compName, devManager.getSelected(), idx);
//    }
//};
//
//devManager.onDataReceived(function (dev, data) {
//
//    trio.devData[dev.serialNumber] = data;
//    if (trio.warnErrDialogSerial === dev.serialNumber) {
//        trio.showWarnErDialog(dev.serialNumber);
//    }
//});
//
//devManager.onSelectedDataReceived(trio.updateData);
//
//devManager.onSelectedParamInit(trio.updateParam);
//
//devManager.onSelectedChange(function (sDev) {
//    console.log(arguments);
//    if (trio.devData[sDev.serialNumber] !== undefined) {
//        trio.updateData(sDev, trio.devData[sDev.serialNumber]);
//    }
//    trio.blockScreen(sDev.connected);
//    trio.updateParam(sDev, sDev.getParam());
//});
//devManager.onSelectedStatusChange(function (dev, state) {
//    trio.blockScreen(state);
//});
//devManager.onSelectedWarnClick(function (serial) {
//    trio.showWarnErDialog(serial);
//});
//devManager.onSelectedErrorClick(function (serial) {
//    trio.showWarnErDialog(serial);
//});
//trio.showWarnErDialog = function (serial) {
//    $('.devWarnErrDialog').find('.ui-dialog-title')[0].textContent = 'Warning and Error list for: ' + serial;
//    $('.warningUl li').remove();
//    $('.errorUl li').remove();
//    var dev = devManager.getDevBySerialNumber(serial);
//    trio.warnErrDialogSerial = dev.serialNumber;
//    if (dev.getData() === undefined || dev.getData().errorReg === undefined) {
//        $('.errorUl').append('<li>No error data available for this device.</li>');
//    } else {
//        var errorArr = trio.getErrorList(dev.getData().errorReg);
//        for (var i = 0; i < errorArr.length; i++) {
//            $('.errorUl').append('<li>' + errorArr[i] + '</li>');
//        }
//    }
//
//
//    if (dev.getData() === undefined || dev.getData().warningReg === undefined) {
//        $('.warningUl').append('<li>No warning data available for this device.</li>');
//    } else {
//        var warnArr = trio.getWarningList(dev.getData().warningReg);
//        for (var i = 0; i < warnArr.length; i++) {
//            $('.warningUl').append('<li>' + warnArr[i] + '</li>');
//        }
//    }
//
//
//    PF('dialogErrorWarning').show();
//};
//trio.blockScreen = function (state) {
//    if (state) {
//        PF('trioBlockWidget').hide();
//    } else {
//        PF('trioBlockWidget').show();
//    }
//};
//trio.executeChange = function (name) {
//    var value = mainUtils.getWidgetValue(name);
//    if (value === undefined) {
//        console.log("Can not find method for writing param: " + name);
//    } else {
//        var message = {
//            instrExt: name,
//            instrData: value.toString()
//        };
//        devManager.getSelected().getParamChanges()[name] = value;
//        devManager.sendDevMessage(message,
//                function (message, data) { //success
//                    delete devManager.getSelected().getParamChanges()[message.instrExt];
//                    devManager.getSelected().getParam()[message.instrExt] = data;
//                    trio.onParamChange(message.instrExt);
//                    mainUtils.showInfoMessage("Change submited successfully", "Success execution.");
//                    //    console.log(message);
//                },
//                function (message, error) { //Error
//                    mainUtils.showErrorMessage(error, "Message exec fail.");
//                },
//                function () { //Timeout
//                    mainUtils.showErrorMessage("Timeout", "Message exec fail.");
//                    console.log('timeout');
//                });
//    }
//};
//trio.executeChangeExt = function (name, idx) {
//    var value = mainUtils.getWidgetValue(name + idx);
//    if (value === undefined) {
//        console.log("Can not find method for writing param: " + name);
//    } else {
//        var message = {
//            instrExt: name,
//            instrData: value.toString(),
//            instrDataExt: idx.toString()
//        };
//        if (devManager.getSelected().getParamChanges()[name] === undefined) {
//            devManager.getSelected().getParamChanges()[name] = [];
//        }
//        devManager.getSelected().getParamChanges()[name][idx] = value;
//        devManager.sendDevMessage(message,
//                function (message, data) { //success
//                    delete devManager.getSelected().getParamChanges()[message.instrExt][idx];
//                    devManager.getSelected().getParam()[message.instrExt][idx] = data;
//                    trio.onParamChange(message.instrExt);
//                    mainUtils.showInfoMessage("Change submited successfully", "Success execution.");
//                    //    console.log(message);
//                },
//                function (message, error) { //Error
//                    mainUtils.showErrorMessage(error, "Message exec fail.");
//                },
//                function () { //Timeout
//                    mainUtils.showErrorMessage("Timeout", "Message exec fail.");
//                    console.log('timeout');
//                });
//    }
//};
//trio.executeInstr = function (name, value, valueExt) {
//    value = value || 0;
//    valueExt = valueExt || 0;
//    var message = {
//        instrExt: name,
//        instrData: value.toString(),
//        instrDataExt: valueExt.toString()
//    };
//    devManager.sendDevMessage(message,
//            function (message, data) { //success
//                mainUtils.showInfoMessage("Change submited successfully", "Success execution.");
//            },
//            function (message, error) { //Error
//                mainUtils.showErrorMessage(error, "Message exec fail.");
//            },
//            function () { //Timeout
//                mainUtils.showErrorMessage("Timeout", "Message exec fail.");
//                console.log('timeout');
//            });
//};
//$(document).ready(function () {
//// mainUtils.addColorpickerCallback('ledButtonStaticValue');
////    $('.bmsPlIoAutoDiv').hide(1000);
////    $('.bmsPlIoManualDiv').hide(1000);
////    $('.bmsPlIoEnabledDiv').hide(1000);
////    $('.bmsPlIoEnabledAdvEqDiv').hide(1000);
////    initBmsEmJS();
//});
//var setText = function (className, val) {
//    if (val !== undefined) {
//        if (val !== null) {
//            $('.' + className).text(val);
//        } else {
//            $('.' + className).text('N/A');
//        }
//    } else {
//        $('.' + className).text('---');
//    }
//};
//trio.getProtStateText = function (state) {
//    if (state === undefined) {
//        return "N/A";
//    }
//    switch (state) {
//        case 0:
//            return "Normal";
//        case 1:
//            return "Sleep High";
//        case 2:
//            return "Sleep Low";
//        case 3:
//            return "Awake Low";
//        case 4:
//            return "Override On";
//        case 5:
//            return "Override Off";
//        case 6:
//            return "Emergency Off";
//        case 7:
//            return "Init";
//        case 8:
//            return "Awake High";
//    }
//
//    return "Unknown: " + state;
//};
//trio.getWarningList = function (reg) {
//    if (reg === undefined || reg === 0 || isNaN(reg)) {
//        return ['No Warnings'];
//    }
//    var arr = [];
//    if ((reg & (1 << 1)) > 0) {
//        arr.push('Cell voltage too low.');
//    }
//    if ((reg & (1 << 2)) > 0) {
//        arr.push('Cell voltage too high.');
//    }
//    if ((reg & (1 << 3)) > 0) {
//        arr.push('Charge current too high.');
//    }
//    if ((reg & (1 << 4)) > 0) {
//        arr.push('Discharge current too high.');
//    }
//    if ((reg & (1 << 5)) > 0) {
//        arr.push('Override On enabled.');
//    }
//    if ((reg & (1 << 6)) > 0) {
//        arr.push('Override Off enabled.');
//    }
//    if ((reg & (1 << 29)) > 0) {
//        arr.push('Pending awake Low state.');
//    }
//    if ((reg & (1 << 30)) > 0) {
//        arr.push('Pending awake High state.');
//    }
//
//
//
//
//    return arr;
//};
//trio.getErrorList = function (errReg) {
//    if (errReg === undefined || errReg === 0 || isNaN(errReg)) {
//        return ['No Error'];
//    }
//    var arr = [];
//    if ((errReg & (1 << 31)) > 0) {
//        arr.push('Internal fault, cell reading error.');
//    }
//    if ((errReg & (1 << 30)) > 0) {
//        arr.push('Internal fault, cell reading thermal shutdown.');
//    }
//    if ((errReg & (1 << 29)) > 0) {
//        arr.push('Open cell wire detected.');
//    }
//    if ((errReg & (1 << 28)) > 0) {
//        arr.push('Internal fault, internal memory error.');
//    }
//    if ((errReg & (1 << 27)) > 0) {
//        arr.push('Internal fault, external memory error.');
//    }
//    if ((errReg & (1 << 26)) > 0) {
//        arr.push('Internal fault, cell measuring convert fault.');
//    }
//    if ((errReg & (1 << 25)) > 0) {
//        arr.push('Internal fault, cell measuring convert reference fault.');
//    }
//    if ((errReg & (1 << 24)) > 0) {
//        arr.push('Internal fault, unknown.');
//    }
//    if ((errReg & (1 << 23)) > 0) {
//        arr.push('Cell overvoltage.');
//    }
//    if ((errReg & (1 << 22)) > 0) {
//        arr.push('Cell undervoltage.');
//    }
//    if ((errReg & (1 << 21)) > 0) {
//        arr.push('Cell count inncorect.');
//    }
//    if ((errReg & (1 << 19)) > 0) {
//        arr.push('Over current charge.');
//    }
//    if ((errReg & (1 << 18)) > 0) {
//        arr.push('Over current discharge.');
//    }
//    if ((errReg & (1 << 17)) > 0) {
//        arr.push('Shutdown user request.');
//    }
//    if ((errReg & (1 << 16)) > 0) {
//        arr.push('Shutdown remote request.');
//    }
//    if ((errReg & (1 << 15)) > 0) {
//        arr.push('Shutdown protector Init.');
//    }
//    if ((errReg & (1 << 14)) > 0) {
//        arr.push('Shutdown protector under voltage.');
//    }
//    if ((errReg & (1 << 13)) > 0) {
//        arr.push('Shutdown protector override under voltage.');
//    }
//    if ((errReg & (1 << 12)) > 0) {
//        arr.push('Shutdown WDT.');
//    }
//    if ((errReg & (1 << 7)) > 0) {
//        arr.push('Tilt Z axis out of range.');
//    }
//    if ((errReg & (1 << 6)) > 0) {
//        arr.push('Tilt Y axis out of range.');
//    }
//    if ((errReg & (1 << 5)) > 0) {
//        arr.push('Tilt X axis out of range.');
//    }
//
//
//    return arr;
//};
//trio.loadConfigSet = function (name) {
//
//};