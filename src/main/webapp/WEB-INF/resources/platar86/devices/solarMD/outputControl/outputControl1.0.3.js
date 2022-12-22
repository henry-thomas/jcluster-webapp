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

/* global devManager, mainUtils, moment */

var oc = {
    expresionArr: {},
    ex: {},
    smdui_expressionSettingPanelEnabled: false,
    controlMap: {
        'notUsed': 'Not Used',
        'expression': 'Expression Controlled',
        'manual': 'Manual controlled'
    },
    devExpPanel: {}
};
oc.ex.setExpression = function (element, panel) {
    let itemContent = panel.expr.el.itemContent;
    while (itemContent.firstChild) {
        itemContent.removeChild(itemContent.firstChild);
    }

    for (var i = 0; i < panel.expr.expArrHeader.length; i++) {
        panel.expr.expArrHeader[i].classList.remove('ecp_headerContentItemSelected');
    }
    element.classList.add('ecp_headerContentItemSelected');
    itemContent.appendChild(element.dataPanel);
};
oc.ex.addExpression = function (expStr, panel) {

    let headerContent = panel.expr.el.headerContent;
    let headerItem = document.createElement('div');
    headerItem.classList.add('ecp_headerContentItem');
    headerContent.insertBefore(headerItem, panel.expr.el.headerNewItemDiv);
    panel.expr.expArrHeader.push(headerItem);
    headerItem.dataExpId = panel.expr.expArrHeader.length;
    let hiTitle = document.createElement('span');
    hiTitle.textContent = panel.expr.expArrHeader.length;
    headerItem.appendChild(hiTitle);
    headerItem.dataHiTitle = panel.expr.expArrHeader.length;
    headerItem.dataHTitleEl = hiTitle;
    let iconUp = document.createElement('i');
//    iconUp.textContent = 'arrow_upward';
    iconUp.classList.add('fas', 'fa-arrow-up');
    headerItem.appendChild(iconUp);
    iconUp.onclick = function (hContent, p) {
        let id = this.dataExpId;
        if (hContent.children[id - 2] !== undefined && p.expr.expArrHeader[id - 2] !== undefined) {
            let compBefore = hContent.children[id - 2];
            compBefore.dataExpId++;
            this.dataExpId--;
            hContent.removeChild(this);
            hContent.insertBefore(this, compBefore);
            p.expr.expArrHeader.sort(sortHeaderElementById);
            compBefore.dataExpression.onchange();
            this.dataExpression.onchange();
            oc.ex.recalculateExpressionOutput(p);
        }

    }.bind(headerItem, headerContent, panel);
    let iconDown = document.createElement('i');
//    iconDown.textContent = 'arrow_downward';
    iconDown.classList.add('fas' , 'fa-arrow-down');
    headerItem.appendChild(iconDown);
    iconDown.onclick = function (hContent, p) {
        let id = this.dataExpId;
        if (hContent.children[id + 1] !== undefined && p.expr.expArrHeader[id] !== undefined) {
            let compBefore = hContent.children[id];
            compBefore.dataExpId--;
            this.dataExpId++;
            hContent.removeChild(this);
            hContent.insertBefore(this, hContent.children[id]);
            p.expr.expArrHeader.sort(sortHeaderElementById);
            compBefore.dataExpression.onchange();
            this.dataExpression.onchange();
            oc.ex.recalculateExpressionOutput(p);
        }

    }.bind(headerItem, headerContent, panel);
    let iconDelete = document.createElement('i');
//    iconDelete.textContent = 'delete_forever';
    iconDelete.classList.add("fas","fa-times-circle");
    headerItem.appendChild(iconDelete);
    iconDelete.onclick = function () {
        headerContent.removeChild(headerItem);
        for (var i = 0; i < this.expr.expArrHeader.length; i++) {
            if (this.expr.expArrHeader[i].dataExpId === headerItem.dataExpId) {
                this.expr.expArrHeader.splice(i, 1);
                oc.ex.recalculateExpressionOutput(this);
                break;
            }
        }
    }.bind(panel, headerItem, headerContent);
    let item = document.createElement('div');
    item.classList.add('ecp_headerContentItem');
    headerItem.dataPanel = item;
    headerItem.dataExpression = new OutputExpressionSelector(item, oc.expressionThree, expStr);
    headerItem.dataExpression.onchange = function (expSelector, p) {
//        expSelector.schedule.schedule.time.enabled;
        if (expSelector.result === null) {
            this.dataHTitleEl.textContent = this.dataExpId + ' Invalid!';
        } else {
            if (expSelector.state === true) {
//            this.textContent
                this.dataHTitleEl.textContent = this.dataExpId + ' ON';
            } else {
                this.dataHTitleEl.textContent = this.dataExpId + ' OFF';
            }
        }
        oc.ex.recalculateExpressionOutput(p);
    }.bind(headerItem, headerItem.dataExpression, panel);
    headerItem.dataExpression.expressionFirst.onchange();
    oc.ex.setExpression(headerItem, panel);
    headerItem.onclick = function (p) {
        oc.ex.setExpression(this, p);
    }.bind(headerItem, panel);
};
function sortHeaderElementById(a, b) {
    return b.dataHiTitle - a.dataHiTitle;
}
;
oc.ex.recalculateExpressionOutput = function (panel) {
    let endResult = '';
    for (var i = 0; i < panel.expr.expArrHeader.length; i++) {
        let expEl = panel.expr.expArrHeader[i];
        let exp = expEl.dataExpression;
        if (exp.result !== null && exp.result !== undefined) {
            endResult += exp.result;
            if ((i + 1) < panel.expr.expArrHeader.length) {
                endResult += '|';
            }
        }
    }

    console.log(endResult);
    panel.expr.expStr = endResult;
    if (panel.expr.expStr !== panel.expr.expStrOld) {
        panel.expr.el.footerContent.style.display = 'block';
    } else {
        panel.expr.el.footerContent.style.display = 'none';
    }
};
oc.ex.reloadDevExpressionPanel = function (dev, param) {

    let wrapperPanel = document.querySelector('.smdui_expressionSettingPanelWrapper');
    while (wrapperPanel.firstChild) {
        wrapperPanel.removeChild(wrapperPanel.firstChild);
    }
    if (oc.devExpPanel[dev.serialNumber] !== undefined) {
        wrapperPanel.appendChild(oc.devExpPanel[dev.serialNumber]);
    } else {

        let panel = document.createElement('div');
        panel.classList.add('smdui_expressionSettingPanel');
        oc.devExpPanel[dev.serialNumber] = panel;
        wrapperPanel.appendChild(oc.devExpPanel[dev.serialNumber]);
        panel.expr = {
            expStr: null,
            expStrOld: null,
            el: {},
            expArr: [],
            expArrHeader: []
        };
        panel.expr.expArrHeader.length = 0;
        panel.expr.expArr.length = 0;
        panel.expr.expStrOld = param.expression;
        panel.expr.expStr = param.expression;
        //create footer content before in oc.expr.el.footerContent
        let footerContent = document.createElement('div');
        footerContent.classList.add('footerContent');
        panel.expr.el.footerContent = footerContent;
        let saveButton = document.createElement('button');
        saveButton.type = 'button';
        footerContent.appendChild(saveButton);
        saveButton.textContent = 'save';
        saveButton.onclick = function () {
            oc.ex.updateInstructionToDevice(this);
        }.bind(panel);
        //end footer content

        let headerContent = document.createElement('div');
        headerContent.classList.add('ecp_headerContent');
        panel.appendChild(headerContent);
        panel.expr.el.headerContent = headerContent;
        let itemContent = document.createElement('div');
        itemContent.classList.add('itemContent');
        panel.appendChild(itemContent);
        panel.expr.el.itemContent = itemContent;
        if (panel.expr.expStr.length > 0) {
            let expOrStrArr = panel.expr.expStr.split('|');
            for (var i = 0; i < expOrStrArr.length; i++) {
                let strExp = expOrStrArr[i];
                oc.ex.addExpression(strExp, panel);
//        new OutputExpressionSelector(item, oc.expressionThree);
            }
        }

        //create new expressionButton
        let newItemDiv = document.createElement('div');
        newItemDiv.classList.add('ecp_headerContentItem');
        headerContent.appendChild(newItemDiv);
        let newItemTitle = document.createElement('span');
        newItemDiv.appendChild(newItemTitle);
        newItemTitle.textContent = 'Add Expression';
        panel.expr.el.headerNewItemDiv = newItemDiv;
        newItemDiv.onclick = function () {
            oc.ex.addExpression('', this);
        }.bind(panel);
        panel.appendChild(footerContent);
    }

    console.log('reloadDevExpressionPanel');
};
oc.ex.updateInstructionToDevice = function (p) {
    devManager.sendDevMessage(
            {
                instrExt: 'expression',
                instrData: p.expr.expStr
            },
            function (message, expressionThree) { //success
                p.expr.expStrOld = p.expr.expStr;
                if (p.expr.expStr !== p.expr.expStrOld) {
                    p.expr.el.footerContent.style.display = 'block';
                } else {
                    p.expr.el.footerContent.style.display = 'none';
                }
            }
    );
};
oc.fetchExpressionTree = function () {
    devManager.sendDevMessage(
            {
                instrExt: 'getOutputControlMap'
            },
            function (message, expressionThree) { //success
                console.log(expressionThree);
                oc.expressionThree = expressionThree;
//                new OutputExpressionSelector(document.getElementById('asdf'), oc.expressionThree);
            }
    );
};
oc.setManualState = function (state) {
    devManager.sendDevMessage(
            {
                instrExt: 'manualControl',
                instrData: state.toString()
//                instrDataExt: valueExt.toString()
            },
            function (successMessage, response) { //on success
                devManager.getSelected().getData().state = state;
                oc.updateData(devManager.getSelected(), devManager.getSelected().getData());
//                mainUtils.showInfoMessage('Success');
            },
            function (errorMessage, response) {//on error
                mainUtils.showWarningMessage(errorMessage);
            },
            function (request) {//timeout
                mainUtils.showWarningMessage('Timout');
            }
    );
};
oc.updateControlPanel = function (controlString) {
    document.querySelectorAll('.controlPanel').forEach((item) => {
        item.style.display = 'none';
    });
    switch (controlString) {
        case 'notUsed':
            {

            }
            break;
        case 'expression':
            {

            }
            break;
        case 'manual':
            {
                document.querySelectorAll('.manualControlPannel').forEach((item) => {
                    item.style.display = 'flex';
                });
            }
            break;
    }
};
//
//
////
oc.dataListExpressionPutLi = function (text, parrent, state) {
    let li = document.createElement('li');
    li.textContent = text;
    if (state === true) {
        li.classList.add('smdui_liTrueResult');
    } else if (state === false) {
        li.classList.add('smdui_liFalseResult');
    }
    parrent.appendChild(li);
};
oc.updateDataExceptionList = function (data, element, ol) {
    let ul = document.createElement('ul');
    element.appendChild(ul);
    if (data !== undefined && data !== null) {
        if (data.result === true) {
            ul.classList.add('smdui_ulTrueResult');
        } else if (data.result === false) {
            ul.classList.add('smdui_ulFalseResult');
        }
        console.log(data);
        oc.dataListExpressionPutLi('Target: ' + (data.outputState ? "Switch ON" : "Switch OFF"), ul, data.result);
        if (data.dateTimeSchedule) {
            let schedule = "Schedule: ";
            if (data.dateTimeSchedule.timeSchedule) {
                let begin = data.dateTimeSchedule.beginTime;
                let end = data.dateTimeSchedule.endTime;
                schedule += ' Time: ' + begin.hour + ":" + begin.minute + ' - ' + end.hour + ":" + end.minute;
            } else {
                schedule += ' Time: [Disabled]';
            }
            if (data.dateTimeSchedule.weekSchedule) {
                schedule += ' - Week days: ';
                for (var i = 0; i < data.dateTimeSchedule.weekDays.length; i++) {
                    schedule += moment().day(data.dateTimeSchedule.weekDays[i]).format('ddd') + ' ';
                }
            } else {
                schedule += ' Week: [Disabled]';
            }
            oc.dataListExpressionPutLi(schedule, ul, false);
//            oc.dataListExpressionPutLi(schedule, ul, data.dateTimeSchedule.result);
        }

        let delayTxt = (data.delay === 0 ? 'Delay: No Delay' : (data.delay > data.remainingTimeFromDelay ? ('Remaining time: ' + (data.delay - data.remainingTimeFromDelay) + 'sec') : 'Delay Expire'));
        oc.dataListExpressionPutLi(delayTxt, ul);
        try {
            if (data.exp !== undefined) {
                let  ulInt = document.createElement('ul');
                let  li = document.createElement('li');
                let  liTitle = document.createElement('li');
                ul.appendChild(liTitle);
                ul.appendChild(ulInt);
                ulInt.appendChild(li);
                oc.dataListExpressionPutLi("First Expresion Result: [" + data.exp.result + "]", liTitle, data.exp.result);
                let output = oc.printDataExpression(data.exp);
                oc.dataListExpressionPutLi(output, li, data.exp.result);

                if (data.nextLogicalAnd !== undefined) {
                    let  ulInt = document.createElement('ul');
                    let  li = document.createElement('li');
                    let  liTitle = document.createElement('li');
                    ul.appendChild(liTitle);
                    ul.appendChild(ulInt);
                    ulInt.appendChild(li);
                    oc.dataListExpressionPutLi("Logical AND Expression Result: [" + data.nextLogicalAnd.result + "]", liTitle, data.exp.result);
                    let output = oc.printDataExpression(data.nextLogicalAnd);
                    oc.dataListExpressionPutLi(output, li, data.exp.result);
                }
            }
        } catch (e) {

        }
        oc.dataListExpressionPutLi('Evaluation: ' + data.result, ul, data.result);
    }


    if (data.nextLogicalOr !== undefined) {
        li = document.createElement('li');
        ol.appendChild(li);
        oc.updateDataExceptionList(data.nextLogicalOr, li, ol);
    }

};
oc.printDataExpression = function (expData) {
    if (expData.serviceName !== undefined) {
        let t = "";
        switch (expData.serviceName) {
            case "PowerService":
                {
                    switch (expData.powerObject) {
                        case "outputPower":
                            t += "Combined Power -> ";
                            break;
                        case "inputPower":
                            t += "Device Power -> ";
                            break;
                    }
                    t += expData.powerName + " -> ";

                }
                break;
            case "ESControlService":
                {
                    switch (expData.powerObject) {
                        case "outputStorage":
                            t += "Combined Storage -> ";
                            break;
                        case "inputStorage":
                            t += "Single Storage -> ";
                            break;
                    }
                    t += expData.powerName + " -> ";

                }
                break;
            case "EnergyStorageService":
                {
                    switch (expData.powerObject) {
                        case "outputStorage":
                            t += "Combined Storage -> ";
                            break;
                        case "inputStorage":
                            t += "Single Storage -> ";
                            break;
                    }
                    t += expData.powerName + " -> ";

                }
                break;
        }

        let unit = "";
        switch (expData.fieldName) {
            case "capacityAh":
                t += "Capacity ";
                unit = "Ah";
                break;
            case "capacityP":
                t += "Capacity ";
                unit = "%";
                break;
            case "ratedCapacityAh":
                t += "Rated Capacity ";
                unit = "Ah";
                break;
            case "ratedCapacityAh":
                t += "Rated Capacity ";
                unit = "Ah";
                break;
            case "chCtrl":
                t += "Charge Control ";
                unit = "%";
                break;
            case "discCtrl":
                t += "Discharge Control ";
                unit = "%";
                break;
            case "available":
                t += "Is Available ";
                break;
            case "currentA":
                t += "Current ";
                unit = "A";
                break;
            case "dailyEnergy":
                t += "Daily Energy ";
                unit = "kWh";
                break;
            case "monthlyEnergy":
                t += "Monthly Energy ";
                unit = "kWh";
                break;
            case "powerW":
                t += "Power ";
                unit = "W";
                break;
            case "totalEnergy":
                t += "Total Energy ";
                unit = "kWh";
                break;
            case "voltageV":
                t += "Voltage ";
                unit = "V";
                break;
            case "weeklyEnergy":
                t += "Weekly Energy ";
                unit = "kWh";
                break;
            case "yearlyEnergy":
                t += "Yearly Energy ";
                unit = "kWh";
                break;
        }

        if (expData.valueOb !== undefined) {
            t += "[";
            if (typeof (expData.valueOb) === "number") {
                t += expData.valueOb.toFixed(2);
            } else {
                t += expData.valueOb;
            }
            t += unit + "]";
        } else {
            t += "[N/A " + unit + "]";
        }
//        if (expData.valueOb !== undefined) {
//            t += "= " + expData.valueOb.toFixed(2) + unit;
//        } else {
//            t += "= [N/A] " + unit;
//        }
        t += " ";

        switch (expData.equation) {
            case "eq":
                t += "Equal ";
                break;
            case "neq":
                t += "Not Equal ";
                break;
            case "lt":
                t += "Less Than ";
                break;
            case "gt":
                t += "Greater Than ";
                break;
            case "gt":
                t += "Greater Than ";
                break;
        }
        if (expData.fixedValueObject !== undefined) {
            if (typeof (expData.fixedValueObject) === "number") {
                t += expData.fixedValueObject.toFixed(2);
            } else {
                t += expData.fixedValueObject;
            }
        } else if (expData.compareObject !== undefined) {
            t += oc.printDataExpression(expData.compareObject);
        }

        return t;
    }


};
oc.updateDataException = function (dataMap) {
    if (dataMap !== undefined && dataMap !== null) {

        let container = document.querySelector('.expressionActualData');
        if (container) {

            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            let title = document.createElement('span');
            container.appendChild(title);
            title.textContent = 'Expression Tree State.';
            let ol = document.createElement('ol');
            container.appendChild(ol);
            let li = document.createElement('li');
            ol.appendChild(li);
            oc.updateDataExceptionList(dataMap, li, ol);
        }
    }
};
oc.updateData = function (dev, data) {

    mainUtils.setHtmlText('actualState', data.state ? 'Closed' : 'Open');
    mainUtils.setHtmlText('remoteControlled', data.remoteControlled ? 'YES' : 'NO');
    if (dev.getParam() !== undefined && dev.getParam().control !== undefined) {
        let controlStr = 'Unknown';
        if (data.remoteControlled === true) {
            controlStr = data.remoteServiceName;
        } else {
            if (oc.controlMap[dev.getParam().control] !== undefined) {
                controlStr = oc.controlMap[dev.getParam().control];
            }
        }
        if (dev.getParam().control === 'expression') {
            oc.updateDataException(data.chainMap);
            if (oc.expressionThree === undefined) {
                oc.fetchExpressionTree();
            } else {
                if (oc.smdui_expressionSettingPanelEnabled === false) {
                    oc.smdui_expressionSettingPanelEnabled = true;
                    //                    //

                    oc.ex.reloadDevExpressionPanel(dev, dev.getParam());
                    document.querySelector('.smdui_expressionSettingPanelWrapper').style.display = 'flex';
                    document.querySelector('.expressionActualData').style.display = 'flex';
                }
            }
        } else {
            oc.smdui_expressionSettingPanelEnabled = false;
            document.querySelector('.smdui_expressionSettingPanelWrapper').style.display = 'none';
            document.querySelector('.expressionActualData').style.display = 'none';
        }

        oc.updateControlPanel(dev.getParam().control);
        mainUtils.setHtmlText('controlType', controlStr);
    }

    mainUtils.setHtmlText('lastSwitchReason', data.lastSwitchReason !== null ? data.lastSwitchReason : 'Unknown');
    mainUtils.setHtmlText('lastSwitchTime', data.lastSwitchTime > 0 ? moment(data.lastSwitchTime).format('MMM-DD hh:mm:ss') : 'Unknown');
};
oc.updateParam = function (dev, param) {
    console.log(param);
    if (param.control === 'expression') {
        if (oc.expressionThree === undefined) {
            oc.fetchExpressionTree();
        } else {
            if (oc.smdui_expressionSettingPanelEnabled === false) {
                oc.smdui_expressionSettingPanelEnabled = true;
                oc.ex.reloadDevExpressionPanel(dev, dev.getParam());
                document.querySelector('.smdui_expressionSettingPanelWrapper').style.display = 'flex';
            }
        }
    } else {
        oc.smdui_expressionSettingPanelEnabled = false;
        document.querySelector('.smdui_expressionSettingPanelWrapper').style.display = 'none';
    }
//    mainUtils.setHtmlText('actualState', data.state ? 'Closed' : 'Open');

};
devManager.onSelectedDataReceived(oc.updateData);
devManager.onSelectedParamInit(oc.updateParam);
devManager.onSelectedChange(function (sDev) {
    oc.smdui_expressionSettingPanelEnabled = false;
    if (sDev.connected) {
        oc.updateData(sDev, sDev.getData());
        oc.updateParam(sDev, sDev.getParam());
    } else {
        mainUtils.setHtmlText('dataValues');
    }
});
devManager.onSelectedStatusChange(function (dev, state) {
    if (state && dev.getData() !== undefined) {
        oc.updateData(dev, dev.getData());
        oc.updateParam(dev, dev.getParam());
    } else {
        mainUtils.setHtmlText('dataValues');
    }
});
$(document).ready(function () {


//                new TreeSelectorUI(document.getElementById('mbx1s'), map);
//                new TreeSelectorUI(document.getElementById('scheduleAnd'), map);
//
//                var sc1 = new ScheduleSelector(document.getElementById('schedule'),
//                        {
//                            titleNone: 'Schedule for Power PV',
//                            time: {
//                                enabled: true,
//                                fromTime: '15:20',
//                                toTime: '10:33'
//                            }
//                        }
//                );
});
var expEqMap = {
    lt: 'Less than',
    gt: 'Greater than',
    eq: 'Equal',
    neq: 'Not equal'
};