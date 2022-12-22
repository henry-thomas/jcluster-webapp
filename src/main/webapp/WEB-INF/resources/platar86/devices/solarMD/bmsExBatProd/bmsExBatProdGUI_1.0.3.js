/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2022
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */

/* global hh, wsm, moment, cardManeger, bmsExBatProdGUI, bProdAdvUserOb, advancedUser */

(function (root) {
    let BmsExBatProdGUI = function () {
        this.serialProdStepActionList = {};
        this.serialCardDialogContent = {};
        this.statusData = {};
        this.prodStatusCard = {};
        this.logMessageList = {};
        init.call(this);
    };

    let prot = BmsExBatProdGUI.prototype;

    function init() {
        this.tabPanel = new TabPanel(dgm.contentPanel, {
            menuItem: [
                {label: "Actual Data", id: 'actualData'},
//                {label: "Param", id: 'param'},
                {label: "Log", id: 'logPanel'}
            ],
            stickyMenu: true,
            initSelect: 'actualData'
        });

        this.logPanel = hh.div(this.tabPanel.getItemContentById('logPanel'), 'max-height: 68vh; overflow: auto');
    }

    prot.onParamReceived = function (dev, param) {
        if (!bmsExBatProdGUI.advancedUser) {
            return;
        }
        if (!bmsExBatProdGUI.tabPanel.getItemContentById("param")) {
            this.tabPanel.addItem({label: "Param", id: 'param'});
        }

        if (!param.connectedModelProdStepActionList) {
            param.connectedModelProdStepActionList[dev.model] = {};
        }
        
        new ParamSetting(this.tabPanel.getItemContentById('param'), 'checkForProdFlags', {
            title: 'Check For Prod Flags',
            type: 'switch'
        });

        new ParamSetting(this.tabPanel.getItemContentById('param'), 'minFwVer', {
            title: 'Min FW Version',
            type: 'inputNumber'
        });

        new ParamSetting(this.tabPanel.getItemContentById('param'), 'stationNumber', {
            title: 'Station Number',
            type: 'inputNumber'
        });

        new ParamSetting(this.tabPanel.getItemContentById('param'), 'relayStateTimeout', {
            title: 'Relay State Timeout',
            type: 'inputNumber',
            unit: 'ms'
        });
        
        new ParamSetting(this.tabPanel.getItemContentById('param'), 'bmsCallOverrideDelay', {
            title: 'BMS Call Override Delay',
            type: 'inputNumber',
            unit: 'ms'
        });

        new ParamSetting(this.tabPanel.getItemContentById('param'), 'observeEmPowerVal', {
            title: 'Monitor Phase Power',
            type: 'switch'
        });

        new ParamSetting(this.tabPanel.getItemContentById('param'), 'attachedEmeterPowerName', {
            title: 'Attached Emeter Power Name',
            type: 'inputText',
            unit: ''
        });

        new ParamSetting(this.tabPanel.getItemContentById('param'), 'emeterMaxPhasePower', {
            title: 'Phase Max Power Limit',
            type: 'inputNumber',
            unit: 'W',
            ctrlInfo: 'The max power allowed on this phase'
        });

        new ParamSetting(this.tabPanel.getItemContentById('param'), 'emeterPowerConsiderLimit', {
            title: 'Phase Power Consider Range',
            type: 'inputNumber',
            unit: 'W',
            ctrlInfo: 'How far away from max power where the step will consider waiting for the power to drop back down'
        });

        new ParamSetting(this.tabPanel.getItemContentById('param'), 'emeterLimitExceedTimeout', {
            title: 'Energy Meter Power Limit Exceed Timeout',
            type: 'inputNumber',
            unit: 's',
            ctrlInfo: 'Max time for phase power to go over limit'
        });


        let modelNumStepMap = param.modelProdStepActionList;
        for (let model in modelNumStepMap) {
            this.tabPanel.addItem({label: "Settings-" + model, id: model});

            let container = hh.div(this.tabPanel.getItemContentById(model));

            new ParamSetting(container, null, {
                title: 'Add Step',
                type: 'dropDownButton',
                content: [
                    {
                        name: 'Wait', cb: function () {
                            wsm.sendDevMsgExecWithJsonInst(
                                    {instrExt: 'addStep', showMessage: true, model: model, type: 'wait'}
                            );
                        }
                    },
                    {
                        name: 'Charge To Capacity', cb: function () {
                            wsm.sendDevMsgExecWithJsonInst(
                                    {instrExt: 'addStep', showMessage: true, model: model, type: 'chargeByCapacity'}
                            );
                        }
                    },
                    {
                        name: 'Disharge To Capacity', cb: function () {
                            wsm.sendDevMsgExecWithJsonInst(
                                    {instrExt: 'addStep', showMessage: true, model: model, type: 'dischargeByCapacity'}
                            );
                        }
                    },
                    {
                        name: 'Charge By Voltage', cb: function () {
                            wsm.sendDevMsgExecWithJsonInst(
                                    {instrExt: 'addStep', showMessage: true, model: model, type: 'chargeByVoltage'}
                            );
                        }
                    },
                    {
                        name: 'Discharge By Voltage', cb: function () {
                            wsm.sendDevMsgExecWithJsonInst(
                                    {instrExt: 'addStep', showMessage: true, model: model, type: 'dischargeByVoltage'}
                            );
                        }
                    }
                ]
            });
            new ParamSetting(container, 'paused', {
                title: 'Pause',
                type: 'switch'
            });

            let stepList = modelNumStepMap[model];

            if (!stepList || stepList.length === 0) {
                continue;
            }

            let settingsAccordionPanel = new SMDUIAccordianPanel(container, {tabs: []});

            for (let i = 0; i < stepList.length; i++) {
                let stepType = stepList[i].name;

                if (stepType === "BatProdStepSaveToDb") {
                    continue;
                }

                let cont = settingsAccordionPanel.addTab({label: 'Step ' + (i + 1) + "-" + getTypeFromClassName(stepType), id: i});

                switch (stepType) {
                    case "BatProdStepWait":
                        onWaitStepReceived.call(this, cont, stepList[i], i, model);
                        break;
                    case "BatProdStepChV":
                        onChVStepReceived.call(this, cont, stepList[i], i, model);
                        break;
                    case "BatProdStepDchV":
                        onDchVStepReceived.call(this, cont, stepList[i], i, model);
                        break;
                    case "BatProdStepChCap":
                        onChCapStepReceived.call(this, cont, stepList[i], i, model);
                        break;
                    case "BatProdStepDchCap":
                        onDchCapStepReceived.call(this, cont, stepList[i], i, model);
                        break;

                    default:

                        break;
                }


                hh.pPanelAddDescTitle(cont, "Cell Voltage Monitoring");
                let monDiff = new ParamSetting(cont, 'monitorCellVDiff', {
                    title: 'Monitor Cell V Diff',
                    type: 'switch',
                    extraData: {
                        idx: i,
                        model: model
                    }
                });
                monDiff.setValue(stepList[i].actionParam.monitorCellDiff);

                let cellDiffMax = new ParamSetting(cont, 'maxCellVoltageDiff', {
                    title: 'Max Cell Voltage Diff',
                    type: 'inputNumber',
                    unit: 'V',
                    extraData: {
                        idx: i,
                        model: model
                    }
                });
                cellDiffMax.setValue(stepList[i].actionParam.maxCellVoltageDiff);

                let monCellVAtStart = new ParamSetting(cont, 'checkCellVoltAtStart', {
                    title: 'Check Cell Voltage At Start',
                    type: 'switch',
                    extraData: {
                        idx: i,
                        model: model
                    }
                });
                monCellVAtStart.setValue(stepList[i].actionParam.checkCellVoltAtStart);

                let cellMaxVAtStart = new ParamSetting(cont, 'maxStartCellVoltageV', {
                    title: 'Max Cell Voltage At Start',
                    type: 'inputNumber',
                    unit: 'V',
                    extraData: {
                        idx: i,
                        model: model
                    }
                });
                cellMaxVAtStart.setValue(stepList[i].actionParam.maxStartCellVoltageV);

                let minStartCapacityAh = new ParamSetting(cont, 'minStartCapacityAh', {
                    title: 'Min Bat Capacity At Start',
                    type: 'inputNumber',
                    unit: 'Ah',
                    extraData: {
                        idx: i,
                        model: model
                    }
                });
                minStartCapacityAh.setValue(stepList[i].actionParam.minStartCapacityAh);

                let maxStartCapacityAh = new ParamSetting(cont, 'maxStartCapacityAh', {
                    title: 'Max Bat Capacity At Start',
                    type: 'inputNumber',
                    unit: 'Ah',
                    extraData: {
                        idx: i,
                        model: model
                    }
                });
                maxStartCapacityAh.setValue(stepList[i].actionParam.maxStartCapacityAh);

                let cellMinVAtStart = new ParamSetting(cont, 'minStartCellVoltageV', {
                    title: 'Min Cell Voltage At Start',
                    type: 'inputNumber',
                    unit: 'V',
                    extraData: {
                        idx: i,
                        model: model
                    }
                });
                cellMinVAtStart.setValue(stepList[i].actionParam.minStartCellVoltageV);

                let setMaxStartCellVoltageVDiff = new ParamSetting(cont, 'maxStartCellVoltageVDiff', {
                    title: 'Max Cell Voltage Difference At Start',
                    type: 'inputNumber',
                    unit: 'V',
                    extraData: {
                        idx: i,
                        model: model
                    }
                });
                setMaxStartCellVoltageVDiff.setValue(stepList[i].actionParam.maxStartCellVoltageVDiff);


                hh.pPanelAddDescTitle(cont, "Current Limit Monitoring");
                let monCurr = new ParamSetting(cont, 'monitorCurrent', {
                    title: 'Monitor Current',
                    type: 'switch',
                    extraData: {
                        idx: i,
                        model: model
                    }
                });
                monCurr.setValue(stepList[i].actionParam.monitorCurrent);

                let currMaxLevel = new ParamSetting(cont, 'maxMonitoringCurrent', {
                    title: 'Current Upper Monitoring Level',
                    type: 'inputNumber',
                    unit: 'A',
                    extraData: {
                        idx: i,
                        model: model
                    }
                });
                currMaxLevel.setValue(stepList[i].actionParam.maxMonitoringCurrent);

                let currMinLevel = new ParamSetting(cont, 'minMonitoringCurrent', {
                    title: 'Current Lower Monitoring Level',
                    type: 'inputNumber',
                    unit: 'A',
                    extraData: {
                        idx: i,
                        model: model
                    }
                });
                currMinLevel.setValue(stepList[i].actionParam.minMonitoringCurrent);

                let currRampTimeout = new ParamSetting(cont, 'currentRampTimeout', {
                    title: 'Current Monitoring Ramp Timeout',
                    type: 'inputNumber',
                    unit: 'ms',
                    extraData: {
                        idx: i,
                        model: model
                    }
                });
                currRampTimeout.setValue(stepList[i].actionParam.currentRampTimeout);

                let currDipTimeout = new ParamSetting(cont, 'currentDipMaxTime', {
                    title: 'Current Out of Limits Timeout',
                    type: 'inputNumber',
                    unit: 'ms',
                    extraData: {
                        idx: i,
                        model: model
                    }
                });
                currDipTimeout.setValue(stepList[i].actionParam.currentDipMaxTime);

                hh.pPanelAddDescTitle(cont, "Delete");
                new ParamSetting(cont, null, {
                    title: 'Delete Step',
                    type: 'dropDownButton',
                    content: [
                        {name: 'Delete', cb: function () {
                                wsm.sendDevMsgExecWithJsonInst(
                                        {instrExt: 'removeStep', showMessage: true, serial: model, idx: i}
                                );
                            }}]
                });
            }

        }
    };

    function onChCapStepReceived(cont, step, idx, model) {

        let targetCapacity = new ParamSetting(cont, 'targetCapacityPercCharge', {
            title: 'Target Capacity',
            type: 'inputNumber',
            unit: '%',
            extraData: {
                idx: idx,
                model: model
            }
        });

        targetCapacity.setValue(step.actionParam.targetCapacityPerc);

        let maxTotalCurrent = new ParamSetting(cont, 'maxTotalCurrentAChCap', {
            title: 'Max Total Current',
            type: 'inputNumber',
            unit: 'A',
            extraData: {
                idx: idx,
                model: model
            }
        });

        maxTotalCurrent.setValue(step.actionParam.maxTotalCurrentA);
    }

    function onDchCapStepReceived(cont, step, idx, model) {

        let targetCapacity = new ParamSetting(cont, 'targetCapacityPercDischarge', {
            title: 'Target Capacity',
            type: 'inputNumber',
            unit: '%',
            extraData: {
                idx: idx,
                model: model
            }
        });

        targetCapacity.setValue(step.actionParam.targetCapacityPerc);

        let maxTotalCurrent = new ParamSetting(cont, 'maxTotalCurrentADchCap', {
            title: 'Max Total Current',
            type: 'inputNumber',
            unit: 'A',
            extraData: {
                idx: idx,
                model: model
            }
        });

        maxTotalCurrent.setValue(step.actionParam.maxTotalCurrentA);
    }

    function onWaitStepReceived(cont, step, idx, model) {
        let waitDuration = new ParamSetting(cont, 'waitDuration', {
            title: 'Wait Duration',
            type: 'inputNumber',
            unit: 'ms',
            extraData: {
                idx: idx,
                model: model
            }
        });

        waitDuration.setValue(step.actionParam.waitDuration);

//        let minCellVoltage = new ParamSetting(cont, 'minCellVoltage', {
//            title: 'Min Cell Voltage',
//            type: 'inputNumber',
//            unit: 'V',
//            extraData: {
//                idx: idx,
//                model: model
//            }
//        });
//
//        minCellVoltage.setValue(step.actionParam.minCellVoltageV);
//
//        let maxCellVoltage = new ParamSetting(cont, 'maxCellVoltage', {
//            title: 'Max Cell Voltage',
//            type: 'inputNumber',
//            unit: 'V',
//            extraData: {
//                idx: idx,
//                model: model
//            }
//        });
//
//        maxCellVoltage.setValue(step.actionParam.maxCellVoltageV);
    }

    function onChVStepReceived(cont, step, idx, model) {

//        let minCellVoltage = new ParamSetting(cont, 'minCellVoltage', {
//            title: 'Min Cell Voltage',
//            type: 'inputNumber',
//            unit: 'V',
//            extraData: {
//                idx: idx,
//                model: model
//            }
//        });
//
//        minCellVoltage.setValue(step.actionParam.minCellVoltageV);

        let maxCellVoltage = new ParamSetting(cont, 'maxCellVoltage', {
            title: 'Max Cell Voltage',
            type: 'inputNumber',
            unit: 'V',
            extraData: {
                idx: idx,
                model: model
            }
        });

        maxCellVoltage.setValue(step.actionParam.maxCellVoltageV);

        let maxTotalCurrent = new ParamSetting(cont, 'maxTotalCurrentACh', {
            title: 'Max Total Current',
            type: 'inputNumber',
            unit: 'A',
            extraData: {
                idx: idx,
                model: model
            }
        });

        maxTotalCurrent.setValue(step.actionParam.maxTotalCurrentA);
    }

    function onDchVStepReceived(cont, step, idx, model) {

        let minCellVoltage = new ParamSetting(cont, 'minCellVoltage', {
            title: 'Min Cell Voltage',
            type: 'inputNumber',
            unit: 'V',
            extraData: {
                idx: idx,
                model: model
            }
        });

        minCellVoltage.setValue(step.actionParam.minCellVoltageV);

//        let maxCellVoltage = new ParamSetting(cont, 'maxCellVoltage', {
//            title: 'Max Cell Voltage',
//            type: 'inputNumber',
//            unit: 'V',
//            extraData: {
//                idx: idx,
//                model: model
//            }
//        });
//
//        maxCellVoltage.setValue(step.actionParam.maxCellVoltageV);

        let maxTotalCurrent = new ParamSetting(cont, 'maxTotalCurrentADch', {
            title: 'Max Total Current',
            type: 'inputNumber',
            unit: 'A',
            extraData: {
                idx: idx,
                model: model
            }
        });

        maxTotalCurrent.setValue(step.actionParam.maxTotalCurrentA);
    }


    function initDataCards(dev, data) {

    }

    prot.updateDataCards = function (dev, data) {
        let cont = this.tabPanel.getItemContentById('actualData');
        cont.classList.add('actDataContainer');



        for (let ser in data.serialBmsProdDataMap) {

            let bmsProdData = data.serialBmsProdDataMap[ser];
            cardManeger.updateCard(bmsProdData);

            if (!this.prodStatusCard[ser]) {
                let dialogContDiv = cardManeger.panelList[ser].fields.dialog.contentDiv;
//                this.serialCardDialogContent[ser] = hh.createActDataPanelCard("Status: " + ser, null, dialogContDiv);

                this.prodStatusCard[ser] = {};
                this.prodStatusCard[ser].card = hh.createActDataPanelCard("Status: " + ser, null, dialogContDiv);

//                new SMDUIDockingCard(this.prodStatusCard[ser].card);

                let card = this.prodStatusCard[ser].card;



                if (bmsExBatProdGUI.advancedUser) {
                    bmsExBatProdGUI.instrDropDown = new ParamSetting(card, null, {
                        title: 'Options',
                        type: 'dropDownButton',
                        content: [
                            {
                                name: 'Reset', cb: function () {
                                    wsm.sendDevMsgExecWithJsonInst({instrExt: "reset",
                                        showMessage: true,
                                        bmsSerial: ser
                                    });
                                }
                            },
                            {
                                name: 'Restart', cb: function () {
                                    wsm.sendDevMsgExecWithJsonInst({instrExt: "restart",
                                        showMessage: true,
                                        bmsSerial: ser
                                    });
                                }
                            },
                            {
                                name: 'Reset Prod Env', cb: function () {
                                    wsm.sendDevMsgExecWithJsonInst({instrExt: "prodEnvWriteFlagsReset",
                                        showMessage: true,
                                        bmsSerial: ser
                                    });
                                }
                            }
                        ]
                    });
                } else {
                    bmsExBatProdGUI.instrDropDown = new ParamSetting(card, null, {
                        title: 'Options',
                        type: 'dropDownButton',
                        content: [

                            {
                                name: 'Restart', cb: function () {
                                    wsm.sendDevMsgExecWithJsonInst({instrExt: "restart",
                                        showMessage: true,
                                        bmsSerial: ser
                                    });
                                }
                            }

                        ]
                    });
                }

                this.prodStatusCard[ser].allStepsComplete = hh.adf(card, 'Complete');
                this.prodStatusCard[ser].stepDesc = hh.adf(card, 'Detail');
                this.prodStatusCard[ser].currentStepIndex = hh.adf(card, 'Current Step Index');
                this.prodStatusCard[ser].batCapP = hh.adf(card, 'SOC', '%', {decimal: 2});
                this.prodStatusCard[ser].batCapAh = hh.adf(card, 'Capacity', 'Ah', {decimal: 2});
                this.prodStatusCard[ser].bmsPackVoltageV = hh.adf(card, 'BMS Pack Voltage', 'V', {decimal: 2});
                this.prodStatusCard[ser].invPackVoltageV = hh.adf(card, 'INV DC Voltage', 'V', {decimal: 2});
                this.prodStatusCard[ser].maxCellVoltageV = hh.adf(card, 'Max Cell Voltage', 'V');
                this.prodStatusCard[ser].minCellVoltageV = hh.adf(card, 'Min Cell Voltage', 'V');
                this.prodStatusCard[ser].remainingDuration = hh.adf(card, 'Remaining Duration', 'ms');
                this.prodStatusCard[ser].bmsCurrentA = hh.adf(card, 'BMS Current', 'A');
                this.prodStatusCard[ser].invCurrentA = hh.adf(card, 'Inverter Current', 'A');
                this.prodStatusCard[ser].relayState = hh.adf(card, 'Relay State', '');

            }
        }

        for (let serNum in this.prodStatusCard) {
            if (!Object.keys(data.serialBmsProdDataMap).includes(serNum)) {
                cardManeger.panelList[serNum].container.style.display = 'none';
//                this.prodStatusCard[serNum].card.style.display = 'none';
            } else if (this.prodStatusCard[serNum] && cardManeger.panelList[serNum].container.style.display === 'none') {
                cardManeger.panelList[serNum].container.style.display = 'grid';
//                this.prodStatusCard[serNum].card.style.display = 'block';
            }
        }

        for (let ser in data.serialBmsProdDataMap) {
            let bmsProdData = data.serialBmsProdDataMap[ser];
//            cardManeger.updateCard(bmsProdData);



            let stat = this.prodStatusCard[ser];
            let currentStepIdx = bmsProdData.currStep;

            stat.currentStepIndex.value = (currentStepIdx + 1) + '/' + (bmsProdData.serialProdStepActionList.length - 1);
            stat.allStepsComplete.value = bmsProdData.isComplete;

            let step = bmsProdData.serialProdStepActionList[currentStepIdx];
            if (!step) {
                continue;
            }

            if (step.name === 'BatProdStepWait') {
                updateWaitData.call(this, step, ser);
            }
            if (step.name === 'BatProdStepChV') {
                updateChVData.call(this, step, ser);
            }
            if (step.name === 'BatProdStepDchV') {
                updateDcVData.call(this, step, ser);
            }
            if (step.name === "BatProdStepChCap") {
                updateChCapData.call(this, step, ser);
            }
            if (step.name === "BatProdStepDchCap") {
                updateDchCapData.call(this, step, ser);
            }

            stat.bmsPackVoltageV.value = step.resultData.bmsPackVoltageV;
            stat.invPackVoltageV.value = step.resultData.invPackVoltageV;
            stat.batCapP.value = step.resultData.batCapP;
            stat.batCapAh.value = step.resultData.batCapAh;

            stat.maxCellVoltageV.value = step.resultData.maxCellVoltageV;
            stat.minCellVoltageV.value = step.resultData.minCellVoltageV;
            stat.bmsCurrentA.value = step.resultData.bmsCurrentA;
            stat.invCurrentA.value = step.resultData.invCurrentA;
            stat.relayState.value = step.resultData.relayState ? "Closed" : "Open";

            if (bmsProdData.isComplete) {
                stat.stepDesc.value = "None";
            }
            if (bmsProdData.error) {
                stat.stepDesc.value = "ERROR";
            }

            stat.remainingDuration.value = step.resultData.remainingDuration;
        }
    };

    function updateWaitData(stepData, ser) {
        let stat = this.prodStatusCard[ser];

        stat.remainingDuration.el.style.display = 'grid';
        stat.remainingDuration.value = stepData.resultData.remainingDuration;
        stat.maxCellVoltageV.value = stepData.resultData.maxCellVoltageV;
        stat.minCellVoltageV.value = stepData.resultData.minCellVoltageV;
        stat.stepDesc.value = "Waiting...";
    }

    function updateChVData(stepData, ser) {
        let stat = this.prodStatusCard[ser];

        stat.remainingDuration.el.style.display = 'none';
        stat.maxCellVoltageV.value = stepData.resultData.maxCellVoltageV;
        stat.minCellVoltageV.value = stepData.resultData.minCellVoltageV;
        stat.stepDesc.value = "Charging to voltage: " + stepData.actionParam.maxCellVoltageV + "V";
    }

    function updateDcVData(stepData, ser) {
        let stat = this.prodStatusCard[ser];

        stat.remainingDuration.el.style.display = 'none';
        stat.maxCellVoltageV.value = stepData.resultData.maxCellVoltageV;
        stat.minCellVoltageV.value = stepData.resultData.minCellVoltageV;
        stat.stepDesc.value = "Discharging to voltage: " + stepData.actionParam.minCellVoltageV + "V";
    }

    function updateChCapData(stepData, ser) {
        let stat = this.prodStatusCard[ser];

        stat.remainingDuration.el.style.display = 'none';
        stat.stepDesc.value = "Charging to capacity: " + stepData.actionParam.targetCapacityPerc + "%";
    }

    function updateDchCapData(stepData, ser) {
        let stat = this.prodStatusCard[ser];

        stat.remainingDuration.el.style.display = 'none';
        stat.stepDesc.value = "Discharging to capacity: " + stepData.actionParam.targetCapacityPerc + "%";
    }

    function getTypeFromClassName(className) {
        switch (className) {
            case "BatProdStepWait":
                return "wait";
            case "BatProdStepChV":
                return "chargeByVoltage";
            case "BatProdStepDchV":
                return "dischargeByVoltage";
            case "BatProdStepChCap":
                return "chargeByCapacity";
            case "BatProdStepDchCap":
                return "dischargeByCapacity";

            default:

                break;
        }
    }

    prot.onLogMessageReceived = function (messageList) {
        messageList.forEach((log) => {
            if (!this.logMessageList[log.id]) {
                this.logMessageList[log.id] = log;

                createLogItem.call(this, log);
            }
        });
    };

    function createLogItem(log) {
        let container = hh.div(null, 'border-bottom: 1px solid rgb(0 0 0 / 12%); width: 100%; overflow: auto');
        hh.addClass(container, ['prod-log-item', getColorClassFromLevel(log.level)]);

        let levelEl = hh.div(container);
        let shortDescEl = hh.div(container);
        let logDescEl = hh.div(container);
        let serial = hh.div(container);
        let timeStamp = hh.div(container);

        levelEl.style.gridArea = 'levelEl';
        shortDescEl.style.gridArea = 'shortDescEl';
        logDescEl.style.gridArea = 'logDescEl';
        serial.style.gridArea = 'serial';
        timeStamp.style.gridArea = 'timeStamp';

        shortDescEl.textContent = log.shortDesc;
        logDescEl.textContent = log.longDesc;
        serial.textContent = log.serial;
        timeStamp.textContent = moment.parseZone(log.timeStamp).format("HH:mm:ss");
        levelEl.textContent = log.level;

        this.logPanel.prepend(container);
    }

    function getColorClassFromLevel(level) {
        switch (level) {
            case 0:
            {
                return "ui";
            }
            case 100:
            {
                return "ui-messages-info";

            }
            case 200:
            {
                return "ui-messages-warn";

            }
            case 300:
            {
                return "ui-messages-error";

            }
        }
    }

    $(document).ready(function () {
        root.bmsExBatProdGUI = new BmsExBatProdGUI();
        root.cardManeger = new PanelManeger(root.bmsExBatProdGUI.tabPanel.getItemContentById('actualData'));
    });
}(window));



