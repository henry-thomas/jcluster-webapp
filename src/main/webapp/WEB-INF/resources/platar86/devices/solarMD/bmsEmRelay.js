/* 
 * Copyright (C) 2018 platar86
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


/* global SVG, devManager, mu */
// "socIOObjectSecondOnLogic": 255,
//  "socIOObjectSecondOffLevel": -1,
//  "socIOObjectDelayOn": 0,
//  "socIOObjectSecond": 255,
//  "socIOObjectFirst": 1,
//  "socIOObjectFirstOffLogic": 1,
//  "socIOObjectFirstOnLevel": 3375,
//  "socIOObjectFirstOffLevel": 3450,
//  "socIOObjectFirstCompSeq": 1,
//  "socIOObjectSecondCompSeq": 255,
//  "socIOObjectDelayOff": 0,
//  "socIOReversePolarity": 1,
//  "socIOObjectFirstOnLogic": 0,
//  "socIOLogicalOperation": 0,
//  "socIOObjectSecondOffLogic": 255,
//  "socIOInUse": 1,
//  "deviceBmsPlID": null,
//  "socIOObjectSecondOnLevel": -1

var bmsRelay = {
    currentIO: 0,
    eqFirstOn: "N/A",
    eqFirstOff: "N/A",
    onIoChange: function (newIo) {
        $('.relayStateLabel').text('-');
        $('.relayPStateLabel').text('-');
        $('.bmsPlRelayAutoEqPanel').hide(100);
        bmsRelay.currentIO = newIo;
//        console.log(newIo);
        bmsRelay.refreshCompParam();
    },
    getObjectValue: function (objectEq) {
        var ob = bmsRelay.getRelayValueFromObj('socIOObjectFirst');
        if (objectEq !== 1) {
            ob = bmsRelay.getRelayValueFromObj('socIOObjectSecond');
        }
        var data = devManager.getSelected().getData();
        try {
            switch (ob) {
                case 0:
                    return Number((data.voltageV * 1000).toFixed(0));
                case 1:
                    return Number((data.cellVoltageVArr.sort()[data.cellVoltageVArr.length - 1] * 1000).toFixed(0));
                case 2:
                    return Number((data.cellVoltageVArr.sort()[0] * 1000).toFixed(0));
                case 3:
                    return data.tempGlobal;
                case 4:
                    return Number((data.capacityAh * 1000).toFixed(0));
                case 5:
                    return Number((data.currentA * 1000).toFixed(0));
            }
        } catch (e) {
            return " - ";
        }
    },
    setChanges: function (fieldName, value) {
        if (devManager.getSelected() !== undefined) {

            var arr = devManager.getSelected().getParam().ioParamArrChanges;
            var arrNormal = devManager.getSelected().getParam().ioParamArr;
            //check if the value is set to old
            if (arrNormal[bmsRelay.currentIO][fieldName] === value) {
                if (arr[bmsRelay.currentIO] === undefined) {
                    arr[bmsRelay.currentIO] = {};
                }
                delete arr[bmsRelay.currentIO][fieldName];
            } else {
                if (arr[bmsRelay.currentIO] === undefined) {
                    arr[bmsRelay.currentIO] = {};
                }
                arr[bmsRelay.currentIO][fieldName] = value;
            }
            var changeCount = Object.keys(arr[bmsRelay.currentIO]).length;
            if (changeCount > 0) {
                PF('ioApplyButton').enable();
            } else {
                PF('ioApplyButton').disable();
            }
        }
    },
    getRelayValueFromObj: function (fieldName) {
        
        var param = devManager.getSelected().getParam();
        var io = param.ioParamArr[bmsRelay.currentIO];
        var ioParamArrChanges = param.ioParamArrChanges[bmsRelay.currentIO];
//        console.log(JSON.stringify(io, null, 2));
        if (io !== undefined) {
            if (ioParamArrChanges === undefined) {
                ioParamArrChanges = {};
            }
            if (ioParamArrChanges[fieldName] !== undefined) {
                return ioParamArrChanges[fieldName];
            }
            return io[fieldName];
        }
    },
    refreshCompParam: function () {
        var socIOInUse = bmsRelay.getRelayValueFromObj('socIOInUse');
        if (socIOInUse !== undefined) {
            mu.setSelectOneMenu(socIOInUse, 'rwSocIoMode');
            bmsRelay.onSocIoModeChange();
            if (socIOInUse === 1) {
                $('.bmsPlRelayAutoEqPanel').show(500);
                $('.bmsPlRelayManualEqPanel').hide(500);
            } else if (socIOInUse === 3) {
                $('.bmsPlRelayAutoEqPanel').hide(500);
                $('.bmsPlRelayManualEqPanel').show(500);
            } else {
                $('.bmsPlRelayManualEqPanel').hide(500);
                $('.bmsPlRelayAutoEqPanel').hide(500);
            }
        }

        var socIOReversePolarity = bmsRelay.getRelayValueFromObj('socIOReversePolarity');
        if (socIOReversePolarity !== undefined) {
            mu.setSelectOneMenu(socIOReversePolarity, 'socIOReversePolarity');
        }

        var socIOObjectFirstOnLogic = bmsRelay.getRelayValueFromObj('socIOObjectFirstOnLogic');
        if (socIOObjectFirstOnLogic !== undefined) {
            mu.setSelectOneMenu(socIOObjectFirstOnLogic, 'socIOObjectFirstOnLogicWg');
        }
        var socIOObjectSecondOnLogic = bmsRelay.getRelayValueFromObj('socIOObjectSecondOnLogic');
        if (socIOObjectSecondOnLogic !== undefined) {
            mu.setSelectOneMenu(socIOObjectSecondOnLogic, 'socIOObjectSecondOnLogicWg');
        }

        var socIOObjectFirstOffLogic = bmsRelay.getRelayValueFromObj('socIOObjectFirstOffLogic');
        if (socIOObjectFirstOffLogic !== undefined) {
            mu.setSelectOneMenu(socIOObjectFirstOffLogic, 'socIOObjectFirstOffLogicWg');
        }
        var socIOObjectSecondOffLogic = bmsRelay.getRelayValueFromObj('socIOObjectSecondOffLogic');
        if (socIOObjectSecondOffLogic !== undefined) {
            mu.setSelectOneMenu(socIOObjectSecondOffLogic, 'socIOObjectSecondOffLogicWg');
        }

        var socIOObjectFirst = bmsRelay.getRelayValueFromObj('socIOObjectFirst');
        if (socIOObjectFirst !== undefined) {
            mu.setSelectOneMenu(socIOObjectFirst, 'firstCompareObj');
        }
        var socIOObjectSecond = bmsRelay.getRelayValueFromObj('socIOObjectSecond');
        if (socIOObjectSecond !== undefined) {
            mu.setSelectOneMenu(socIOObjectSecond, 'secondCompareObj');
        }

        var socIOObjectDelayO = bmsRelay.getRelayValueFromObj('socIOObjectDelayOn');
        if (socIOObjectDelayO !== undefined) {
            mu.setWidgetValue('socIOObjectDelayOnWg', socIOObjectDelayO);
            mu.setWidgetValue('socIOObjectSDelayOnWg', socIOObjectDelayO);
        }
        var socIOObjectDelayOff = bmsRelay.getRelayValueFromObj('socIOObjectDelayOff');
        if (socIOObjectDelayOff !== undefined) {
            mu.setWidgetValue('socIOObjectDelayOffWg', socIOObjectDelayOff);
            mu.setWidgetValue('socIOObjectSDelayOffWg', socIOObjectDelayOff);
        }
        //==========================
        var socIOObjectFirstOnLevel = bmsRelay.getRelayValueFromObj('socIOObjectFirstOnLevel');
        if (socIOObjectFirstOnLevel !== undefined) {
            mu.setWidgetValue('socIOObjectFirstOnLevelWg', socIOObjectFirstOnLevel);
        }
        var socIOObjectSecondOnLevel = bmsRelay.getRelayValueFromObj('socIOObjectSecondOnLevel');
        if (socIOObjectSecondOnLevel !== undefined) {
            mu.setWidgetValue('socIOObjectSecondOnLevelWg', socIOObjectSecondOnLevel);
        }

        var socIOObjectFirstOffLevel = bmsRelay.getRelayValueFromObj('socIOObjectFirstOffLevel');
        if (socIOObjectFirstOffLevel !== undefined) {
            mu.setWidgetValue('socIOObjectFirstOffLevelWg', socIOObjectFirstOffLevel);
        }
        var socIOObjectSecondOffLevel = bmsRelay.getRelayValueFromObj('socIOObjectSecondOffLevel');
        if (socIOObjectSecondOffLevel !== undefined) {
            mu.setWidgetValue('socIOObjectSecondOffLevelWg', socIOObjectSecondOffLevel);
        }
        var socIOLogicalOperation = bmsRelay.getRelayValueFromObj('socIOLogicalOperation');
        if (socIOLogicalOperation !== undefined) {
            mu.setWidgetValue('socIOLogicalOperationWg', socIOLogicalOperation);
            if (socIOLogicalOperation === 0) {
                $('.bmsPlRelayAutoEqPanelSecond').hide(0);
            } else {
                $('.bmsPlRelayAutoEqPanelSecond').show(0);
            }
        }


    },
    onSocIoModeChange: function () {
        var a = Number(mu.getWidgetValue('rwSocIoMode'));
        bmsRelay.setChanges('socIOInUse', a);
        if (a === 1) {
            $('.bmsPlRelayAutoEqPanel').show(500);
            $('.bmsPlRelayManualEqPanel').hide(500);

            var socIOLogicalOperation = bmsRelay.getRelayValueFromObj('socIOLogicalOperation');
            if (socIOLogicalOperation !== undefined) {
                if (socIOLogicalOperation === 0) {
                    $('.bmsPlRelayAutoEqPanelSecond').hide(0);
                } else {
                    $('.bmsPlRelayAutoEqPanelSecond').show(0);
                }
            }

        } else if (a === 3) {
            $('.bmsPlRelayAutoEqPanel').hide(500);
            $('.bmsPlRelayManualEqPanel').show(500);
        } else {
            $('.bmsPlRelayManualEqPanel').hide(500);
            $('.bmsPlRelayAutoEqPanel').hide(500);
        }
    },
    onSocIOReversePolarity: function () {
        var a = Number(mu.getWidgetValue('socIOReversePolarity'));
        bmsRelay.setChanges('socIOReversePolarity', a);
    },
    onFirstCompareEqChange: function () {
        var a = Number(mu.getWidgetValue('firstCompareEq'));
        bmsRelay.setChanges('socIOObjectFirstCompSeq', a);
    },
    onSecondCompareEqChange: function () {
        var a = Number(mu.getWidgetValue('secondCompareEq'));
        bmsRelay.setChanges('socIOObjectSecondCompSeq', a);
    },
    onSocIOObjectDelayOff: function (widget) {
        var a = Number(mu.getWidgetValue(widget));
        bmsRelay.setChanges('socIOObjectDelayOff', a);
        mu.setWidgetValue('socIOObjectDelayOffWg', a);
        mu.setWidgetValue('socIOObjectSDelayOffWg', a);
    },
    onSocIOObjectDelayOn: function (widget) {
        var a = Number(mu.getWidgetValue(widget));
        bmsRelay.setChanges('socIOObjectDelayOn', a);
        mu.setWidgetValue('socIOObjectDelayOnWg', a);
        mu.setWidgetValue('socIOObjectSDelayOnWg', a);
    },
    onSocIOObjectFirstOffLevel: function () {
        var a = Number(mu.getWidgetValue('socIOObjectFirstOffLevelWg'));
        bmsRelay.setChanges('socIOObjectFirstOffLevel', a);
    },
    onSocIOObjectSecondOffLevel: function () {
        var a = Number(mu.getWidgetValue('socIOObjectSecondOffLevelWg'));
        bmsRelay.setChanges('socIOObjectSecondOffLevel', a);
    },
    onSocIOObjectFirstOnLevel: function () {
        var a = Number(mu.getWidgetValue('socIOObjectFirstOnLevelWg'));
        bmsRelay.setChanges('socIOObjectFirstOnLevel', a);
    },
    onSocIOObjectSecondOnLevel: function () {
        var a = Number(mu.getWidgetValue('socIOObjectSecondOnLevelWg'));
        bmsRelay.setChanges('socIOObjectSecondOnLevel', a);
    },
    onSocIOObjectFirstOffLogic: function () {
        var a = Number(mu.getWidgetValue('socIOObjectFirstOffLogicWg'));
        bmsRelay.setChanges('socIOObjectFirstOffLogic', a);
    },
    onSocIOObjectSecondOffLogic: function () {
        var a = Number(mu.getWidgetValue('socIOObjectSecondOffLogicWg'));
        bmsRelay.setChanges('socIOObjectSecondOffLogic', a);
    },
    onSocIOObjectFirstOnLogic: function () {
        var a = Number(mu.getWidgetValue('socIOObjectFirstOnLogicWg'));
        bmsRelay.setChanges('socIOObjectFirstOnLogic', a);
    },
    onSocIOObjectSecondOnLogic: function () {
        var a = Number(mu.getWidgetValue('socIOObjectSecondOnLogicWg'));
        bmsRelay.setChanges('socIOObjectSecondOnLogic', a);
    },
    onSocIOLogicalOperation: function () {
        var a = Number(mu.getWidgetValue('socIOLogicalOperationWg'));
        bmsRelay.setChanges('socIOLogicalOperation', a);
        if (a === 0) {
            $('.bmsPlRelayAutoEqPanelSecond').hide(100);
        } else {
            $('.bmsPlRelayAutoEqPanelSecond').show(100);
        }
    },
    onFirstObjectChange: function () {
        var a = Number(mu.getWidgetValue('firstCompareObj'));
        bmsRelay.setChanges('socIOObjectFirst', a);
        if (a < 3) {
            $('.relayFObjUnit').text('mV');
        } else if (a === 3) {
            $('.relayFObjUnit').text('deg');
        } else if (a === 4) {
            $('.relayFObjUnit').text('mAh');
        } else if (a === 5) {
            $('.relayFObjUnit').text('mA');
        }
    },
    onSecondObjectChange: function () {
        var a = Number(mu.getWidgetValue('secondCompareObj'));
        bmsRelay.setChanges('socIOObjectSecond', a);
        if (a < 3) {
            $('.relaySObjUnit').text('mV');
        } else if (a === 3) {
            $('.relaySObjUnit').text('deg');
        } else if (a === 4) {
            $('.relaySObjUnit').text('mAh');
        } else if (a === 5) {
            $('.relaySObjUnit').text('mA');
        }
    },
    calcOutcome: function (eq, value) {
//        #define IO_COMP_LOGIC_ON_FIRST 0
//        #define IO_COMP_LOGIC_OFF_FIRST 1


        var onOutc = calcFunctionRelay(
                value,
                bmsRelay.getRelayValueFromObj('socIOObjectFirstOnLogic'),
                bmsRelay.getRelayValueFromObj('socIOObjectFirstOnLevel')
                );
        var offOutc = calcFunctionRelay(
                value,
                bmsRelay.getRelayValueFromObj('socIOObjectFirstOffLogic'),
                bmsRelay.getRelayValueFromObj('socIOObjectFirstOffLevel')
                );
        $('.eqEvalLabelOn').text(onOutc.toString().toUpperCase());
        $('.eqEvalLabelOff').text(offOutc.toString().toUpperCase());
        var eqFirst = ob = bmsRelay.getRelayValueFromObj('socIOObjectFirstCompSeq');
        var eqFirstVal = -1;
        if (onOutc === false && offOutc === false) {
            $('.relayOutcEqFirst').text("UNCHANGED");
        } else if (onOutc === true && offOutc === true) {
            if (eqFirst === 0) {
                $('.relayOutcEqFirst').text("ON");
                eqFirstVal = 1;
            } else {
                $('.relayOutcEqFirst').text("OFF");
                eqFirstVal = 0;
            }
        } else if (onOutc === true) {
            $('.relayOutcEqFirst').text("ON");
            eqFirstVal = 1;
        } else if (offOutc === true) {
            $('.relayOutcEqFirst').text("OFF");
            eqFirstVal = 0;
        } else {
            $('.relayOutcEqFirst').text("NA");
            var eqFirstVal = -1;
        }


    },
    onDataReveived: function () {
    //    console.log('on data');
        var relayData = devManager.getSelected().getData().ioDataArr[bmsRelay.currentIO];
        var ioState = relayData.state;
        var ioPendingState = relayData.pendingState;
        $('.relayStateLabel').text(getRelayStateString(ioState));
        $('.relayPStateLabel').text(getRelayStateString(ioPendingState));
        var value = bmsRelay.getObjectValue(1);
        $('.relayFObjValue').text(value);
        bmsRelay.calcOutcome(1, value);
    },
    onParamReveived: function (dev) {
        var param = dev.getParam();
        if (param.ioParamArr !== undefined) {
            if (param.ioParamArrChanges === undefined) {
                param.ioParamArrChanges = [];
            }
            if (param.ioParam === undefined) {
                param.ioParam = {};
            }
            if (param.ioParam.init === undefined) {
                if (dev.selected) {
                    bmsRelay.refreshCompParam();
                }
                param.ioParam.init = true;
            }

        }
    }
    ,
    sendChangesToDevice: function () {
        //devManager.sendDevInstruction(name, value);
    },
    sendBurnIoToDevice: function () {
        // rwSocIOFirstBurnEeprom
    }
};

var sendRelayIoInstruction = function () {
    if (devManager.getSelected() !== undefined
            && devManager.getSelected().getParam().ioParamArrChanges !== undefined) {

        var arr = devManager.getSelected().getParam().ioParamArrChanges[bmsRelay.currentIO];

        var ioIdx = bmsRelay.currentIO;
        var changeCount = Object.keys(arr).length;
        if (changeCount === 0) {
            return;
        }
        var methodName;
        var fieldName;
        var value;
        for (var item in arr) {
            fieldName = item;
            methodName = getMethodFromFieldName(item);
            value = arr[item];
        }


        var message = {
            instr: wsm.connectionVar.executeInstr,
            instrExt: methodName.toString(),
            instrData: value.toString(),
            instrDataExt: ioIdx.toString(),
            devSerialNumber: devManager.getSelected().serialNumber,
            devModelId: devManager.config.subDevModelId
        };
        //devManager
        console.log("send settings");
        mu.sendWsMessage(message,
                function (devMessage) { //on success
                    mu.showInfoMessage("Success update.", fieldName);
                    delete devManager.getSelected().getParam().ioParamArrChanges[bmsRelay.currentIO][fieldName];
                    devManager.getSelected().getParam().ioParamArr[bmsRelay.currentIO][fieldName] = value;
                    bmsRelay.setChanges(fieldName, value);
                    sendRelayIoInstruction();
                },
                function (devMessage) { //on Error
                    mainUtils.showWarningMessage(devMessage.response.faultMsg, "Instruction execution error!");
                    console.log("Error: " + devMessage.response.faultMsg);
                },
                function () { //on timeout
                    mainUtils.showWarningMessage("Can not refresh Parameters!", 'timeout');
                    console.log('Timeout');
                }
        );
    }
};

var sendRelayIoInstructionExt = function (instr, widgetValue) {
    if (devManager.getSelected() !== undefined) {
        var value = 1;
        if (widgetValue !== 'none') {
            value = mainUtils.getWidgetValue(widgetValue);
//        } else if (widgetValue !== 'relayOverValue') {
//            value = Number(mainUtils.getWidgetValue(widgetValue)) * 1000;
        }

        var ioIdx = bmsRelay.currentIO;

        var message = {
            instr: wsm.connectionVar.executeInstr,
            instrExt: instr.toString(),
            instrData: value.toString(),
            instrDataExt: ioIdx.toString(),
            devSerialNumber: devManager.getSelected().serialNumber,
            devModelId: devManager.config.subDevModelId
        };
        //devManager
        console.log("send settings");
        mu.sendWsMessage(message,
                function (devMessage, value) { //on success
                    mu.showInfoMessage("Success update.", value);

                },
                function (devMessage) { //on Error
                    mainUtils.showWarningMessage(devMessage.response.faultMsg, "Instruction execution error!");
                    console.log("Error: " + devMessage.response.faultMsg);
                },
                function () { //on timeout
                    mainUtils.showWarningMessage("Can not refresh Parameters!", 'timeout');
                    console.log('Timeout');
                }
        );
    }
};
var getMethodFromFieldName = function (field) {
    switch (field) {
        case "socIOObjectSecondOnLogic":
            return "writeSocIOObjectSecondOnLogic";
        case "socIOObjectSecondOffLevel":
            return "writeSocIOObjectSecondOffLevel";
        case "socIOObjectDelayOn":
            return "writeSocIOObjectDelayOn";
        case "socIOObjectSecond":
            return "writeSocIOObjectSecond";
        case "socIOObjectFirst":
            return "writeSocIOObjectFirst";
        case "socIOObjectFirstOffLogic":
            return "writeSocIOObjectFirstOffLogic";
        case "socIOObjectFirstOnLevel":
            return "writeSocIOObjectFirstOnLevel";
        case "socIOObjectFirstOffLevel":
            return "writeSocIOObjectFirstOffLevel";
        case "socIOObjectFirstCompSeq":
            return "writeSocIOObjectFirstCompSeq";
        case "socIOObjectSecondCompSeq":
            return "writeSocIOObjectSecondCompSeq";
        case "socIOObjectDelayOff":
            return "writeSocIOObjectDelayOff";
        case "socIOReversePolarity":
            return "writeSocIOReversePolarity";
        case "socIOObjectFirstOnLogic":
            return "writeSocIOObjectFirstOnLogic";
        case "socIOLogicalOperation":
            return "writeSocIOLogicalOperation";
        case "socIOObjectSecondOffLogic":
            return "writeSocIOObjectSecondOffLogic";
        case "socIOInUse":
            return "writeSocIOInUse";

        case "socIOObjectSecondOnLevel":
            return "writeSocIOObjectSecondOnLevel";
    }
};

var calcFunctionRelay = function (realVal, exp, val) {
//    #define IO_INIT_LOGIC_LESS_THAN 0
//    #define IO_INIT_LOGIC_GREATER_THAN 1
    if (exp === 0) {
        if (realVal < val) {
            return true;
        } else {
            return false;
        }
    } else {
        if (realVal > val) {
            return true;
        } else {
            return false;
        }
    }
};
$(document).ready(function () {
//    $('.bmsPlRelayAutoEqPanel').hide();
    devManager.onSelectedDataReceived(
            function (dev) {
                bmsRelay.onDataReveived(dev);
            }
    );
    devManager.onParamReceived(
            function (dev) {
                bmsRelay.onParamReveived(dev);
                // bmsRelay.onIoChange(0);
            }
    );
    devManager.onSelectedChange(
            function (dev) {
                bmsRelay.onIoChange(bmsRelay.currentIO);
            }
    );
    var ioButtonArr = document.getElementsByClassName('relayButtonSubDiv');
    for (var i = 0; i < ioButtonArr.length; i++) {
        var comp = ioButtonArr[i];
        comp.onclick = function () {
            bmsRelay.onIoChange(Number(this.getElementsByTagName('span')[0].dataset.periodvalue));
            var divArr = document.getElementsByClassName('relayButtonSubDiv');
            for (var i = 0; i < divArr.length; i++) {
                divArr[i].classList.remove('ui-custom-period-active');
            }
            this.classList.add('ui-custom-period-active');
        };
    }

});
var getRelayStateString = function (state) {
    switch (state) {
        case 1:
            return "AUTO ON";
        case 2:
            return "AUTO OFF";
        case 3:
            return "MANUAL ON";
        case 4:
            return "MANUAL OFF";
        case 5:
            return "OVERRIDE OFF";
        case 6:
            return "OVERRIDE ON";
    }
    return "UNKNOWN: " + state;
};