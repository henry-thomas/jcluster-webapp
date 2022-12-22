/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by platar86, 2022
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */



/* global hh, emsGuiData, mainUtils, emsGuiMap, moment, mu, wsm, emsGui */

function EmsDevParamDialog(conf) {
    this.compCont = {};
    this.data = {};




    EmsDevParamDialog.prototype.show = function () {
        this.dialog.setBarTitle('Config: ' + this.panelCard.displayName + ' [' + this.sn + ']');
        this.dialog.show();
    };

    function onCpSave() {
        let cpCtrl = this.data.cp;
        if (this.defaultInput) {
            cpCtrl.defaultValue = Number(this.defaultInput.getValue());
        } else {
            cpCtrl.defaultValue = 0;
        }

        if (this.data.unitDefObj.priorityEnabled && this.defaultPriorityInput) {
            cpCtrl.defaultPriority = Number(this.defaultPriorityInput.getValue());
        }
//        debugger;
        let a = this.param[this.data.ctrlName];
        let msg = {
            instrExt: "updateCpUnit",
            cpUnit: JSON.stringify({cp: cpCtrl}),
            currentTemplate: this.param.currentTemplate,
            controlName: this.data.ctrlName,
            targetDevSerial: this.sn,
            category: this.paramGroupStr
        };
        wsm.sendDevMsgExecWithJsonInst(
                msg,
                function (origCp, cTemplate, cpUnit, message, response) {
                    origCp[cTemplate] = response;
                    this.editCtrlTypeDialog.hide();
                    mu.showInfoMessage('Saved');
                    console.log("Result: ", response);
                }.bind(this, a, this.param.currentTemplate, cpCtrl),
                function (message, errMsg) {
                    debugger;
                    mu.showErrorMessage(errMsg, 'Error');
                    console.warn("No Energy Management Units Found " + errMsg);
                },
                3000);
    }

    function onPcManSaveCb(pcEditComp, pcData) {
//        debugger;
        if (this.pcManDialog.editIdx === null) {
            this.data.cp.cpList.push(pcData);
        } else {
            this.data.cp.cpList[this.pcManDialog.editIdx] = pcData;
        }
        this.pcManDialog.hide();
        onCtrlTypeEdit.call(this);
    }

    function createPcManDialog() {
        this.pcManDialog = new SMDUIDialog({modal: true, draggable: true});
        this.pcManDialog.pcMan = new PcMan(this.pcManDialog.contentDiv, null);
        this.pcManDialog.pcMan.addOnSaveCb(onPcManSaveCb.bind(this));
    }

    function createEditCtrlTypeDialog() {
        this.editCtrlTypeDialog = new SMDUIDialog({modal: false, draggable: true});
        let footerDiv = this.editCtrlTypeDialog.footerDiv;

        let addButton = hh.button(footerDiv, 'Add Period');
        addButton.onclick = function (ev) {
            debugger;
            if (this.pcManDialog === undefined) {
//                this.pcManDialog = new SMDUIDialog({modal: true, draggable: true});
//                this.pcManDialog.pcMan = new PcMan(this.pcManDialog.contentDiv, null);
//                this.pcManDialog.pcMan.addOnSaveCb(onPcManSaveCb.bind(this));
                createPcManDialog.call(this);
            }

            let cp = this.data.cp;
            this.pcManDialog.editIdx = null;

            this.pcManDialog.pcMan.setCpData({priority: cp.defaultPriority, periodIdx: cp.cpList.length});
            this.pcManDialog.show();


            let unit = this.data.unitDefObj;
            this.pcManDialog.pcMan.setValueLabel(unit.title + " in " + unit.unit);
            this.pcManDialog.setBarTitle('Create new Period ' + unit.title);
        }.bind(this);

        let saveButton = hh.button(footerDiv, 'Save Changes');
        saveButton.onclick = onCpSave.bind(this);
    }

    function populateCpList(cont, cp, unit) {
        let per = cp.period;
        let div = hh.div(cont, 'smdui-cpTableItem');
        div.cp = cp;
        //idx
        let d = hh.div(div, 'smdui-cpTableItem_idx', 'smdui-cpTableItem_block');
        hh.span(d, cp.periodIdx + 1, 'smdui-cpTableItem_idxItemv', 'align-self: center;');


        let divYear = hh.div(div, 'smdui-cpTableItem_year', 'smdui-cpTableItem_block');
        if (per.years.length === 0) {
            hh.span(divYear, 'EVERY YEAR', 'smdui-cpTableItem_blockItem');
        } else {
            hh.span(divYear, per.years[0], 'smdui-cpTableItem_blockItem');
            if (per.years.length > 1) {
                hh.span(divYear, '...', 'smdui-cpTableItem_blockItem');
            }
        }

        let divYearPer = hh.div(div, 'smdui-cpTableItem_yearPer', 'smdui-cpTableItem_block');
//    debugger;
        if (per.dateStart === null && per.dateEnd === null) {
            hh.span(divYearPer, '---', 'smdui-cpTableItem_blockItem');
        } else {
            let yp = "";
            if (per.dateStart === null) {
                yp = '01 Jan - ';
            } else {
                yp = per.dateStart.day + ' ' + moment.monthsShort()[per.dateStart.month - 1] + ' - ';
            }
            if (per.dateEnd === null) {
                yp += '31 Dec';
            } else {
                yp += per.dateEnd.day + ' ' + moment.monthsShort()[per.dateEnd.month - 1];
            }
            hh.span(divYearPer, yp, 'smdui-cpTableItem_blockItem');
        }

        let divWeek = hh.div(div, 'smdui-cpTableItem_week', 'smdui-cpTableItem_block');
        if (per.weekDays.length === 0 || per.weekDays.length === 7) {
            hh.span(divWeek, 'ALL WEEK DAYS', 'smdui-cpTableItem_blockItem');
        } else {
            let wa = [];
            wa.push(hh.span(divWeek, 'M', 'smdui-cpTableItem_weekItem'));
            wa.push(hh.span(divWeek, 'T', 'smdui-cpTableItem_weekItem'));
            wa.push(hh.span(divWeek, 'W', 'smdui-cpTableItem_weekItem'));
            wa.push(hh.span(divWeek, 'T', 'smdui-cpTableItem_weekItem'));
            wa.push(hh.span(divWeek, 'F', 'smdui-cpTableItem_weekItem'));
            wa.push(hh.span(divWeek, 'S', 'smdui-cpTableItem_weekItem'));
            wa.push(hh.span(divWeek, 'S', 'smdui-cpTableItem_weekItem'));
            for (var i = 0; i < per.weekDays.length; i++) {
                let weekDay = per.weekDays[i];
                hh.addClass(wa[weekDay - 1], 'smdui-cpTableItem_weekItemSelected');
            }
        }

        let time = hh.div(div, 'smdui-cpTableItem_time', 'smdui-cpTableItem_block');
        if (per.timeStart === null && per.timeEnd === null) {
            hh.span(time, 'EVERY HOUR', 'smdui-cpTableItem_blockItem');
        } else {
//        hh.span(time, '10:80 - 22:15', 'smdui-cpTableItem_blockItem');
            let yp = "";
            if (per.timeStart === null) {
                yp = '00:00 - ';
            } else {
                let h = per.timeStart.hour.toString().length === 2 ? per.timeStart.hour.toString() : '0' + per.timeStart.hour.toString();
                let m = per.timeStart.minute.toString().length === 2 ? per.timeStart.minute.toString() : '0' + per.timeStart.minute.toString();
                yp = h + ':' + m + ' - ';
            }
            if (per.timeEnd === null) {
                yp += '23:59';
            } else {
                let h = per.timeEnd.hour.toString().length === 2 ? per.timeEnd.hour.toString() : '0' + per.timeEnd.hour.toString();
                let m = per.timeEnd.minute.toString().length === 2 ? per.timeEnd.minute.toString() : '0' + per.timeEnd.minute.toString();
                yp += h + ':' + m;
            }
            hh.span(time, yp, 'smdui-cpTableItem_blockItem');
        }

        let value = hh.div(div, 'smdui-cpTableItem_value', 'smdui-cpTableItem_block');

        //priority
        hh.span(div, cp.priority, 'smdui-cpTableItem_prio', 'smdui-cpTableItem_block');

//    debugger;
        hh.span(value, cp.value.toFixed(0) + unit, 'smdui-cpTableItem_blockItem');
        let ctrl = hh.div(div, 'smdui-cpTableItem_control', 'smdui-cpTableItem_block');
        let editButton = hh.button(ctrl, '', 'fa', 'fa-pencil-square-o');
        //  debugger;
        editButton.onclick = function (cp, idx) {
            if (this.pcManDialog === undefined) {
                createPcManDialog.call(this);
            }
            this.pcManDialog.editIdx = idx;
            this.pcManDialog.pcMan.setCpData(cp);
            this.pcManDialog.show();

            let unit = this.data.unitDefObj;

            this.pcManDialog.pcMan.setValueLabel(unit.title + " in " + unit.unit);
            this.pcManDialog.setBarTitle('Edit Period Index: [' + idx + '] ' + unit.title);
//        debugger;
        }.bind(this, cp, cp.periodIdx);
        let removeButton = hh.button(ctrl, '', 'fa', 'fa-trash');
        removeButton.onclick = function (cp, div) {
//        debugger;
            let list = this.data.cp.cpList;
            for (var i = 0; i < list.length; i++) {
                if (list[i].periodIdx === cp.periodIdx) {
                    div.remove();
                    list.splice(i, 1);
                    break;
                }
            }
            for (var i = 0; i < list.length; i++) {
                list[i].periodIdx = i;
            }
        }.bind(this, cp, div);
    }

    function onCtrlTypeEdit() {
        let ctrlName = this.data.ctrlName;
        console.log('ctrlName: ' + ctrlName);

        let cpUnit = this.data.cp;
        if (!this.data.cp) {
            let cpCtrl = clone(this.param[ctrlName][this.param.currentTemplate]);
            cpUnit = this.data.cp = cpCtrl.cp;
        }


        let unitDefObj = this.data.unitDefObj = devParamPowerCtrlNameMap(ctrlName);
        let serNum = this.sn;

        if (this.editCtrlTypeDialog === undefined) {
            createEditCtrlTypeDialog.call(this);
        }


        this.editCtrlTypeDialog.setBarTitle(unitDefObj.title + ' Control Period [' + serNum + ']');
        let unit = devUnitDescrMap(cpUnit.unit);

        //
        //populate HTML 
        let cont = this.editCtrlTypeDialog.contentDiv;
        hh.removeAllChilds(cont);

        let listCont = hh.div(cont, 'smdui-cpTableWrapper');

        if (ctrlName !== 'capacitySetpointTemplateMap') {
            this.defaultInput = new ParamSetting(cont, {disableControl: true,
                type: 'inputNumber', title: 'Default ' + unit.title,
                ctrlInfo: 'Edit Control Period (PC)', unit: unit.unit
            });
            this.defaultInput.setValue(cpUnit.defaultValue);
        }

        if (unitDefObj.priorityEnabled && ctrlName !== 'capacitySetpointTemplateMap') {
            this.defaultPriorityInput = new ParamSetting(cont, {disableControl: true,
                type: 'inputNumber', title: 'Priority',
                ctrlInfo: 'Edit Control Period Priority. Higher number gives higher priority.'
            });
            this.defaultPriorityInput.setValue(cpUnit.defaultPriority);
        }

        for (var arrIdx in cpUnit.cpList) {
            let cp = cpUnit.cpList[arrIdx];
            populateCpList.call(this, listCont, cp, unit.unit);
        }

        let dragable = suiSort(listCont, {onEnd: function (panel) {
                for (var i = 0; i < panel.children.length; i++) {
                    panel.children[i].cp.periodIdx = i;
                }
                cpUnit.cpList.sort(function (a, b) {
                    if (a.periodIdx < b.periodIdx) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
            }});

        this.editCtrlTypeDialog.show();
    }

    function initUi(conf) {
        this.panelCard = conf.panelCard;
        let p = this.param = conf.param;
        this.sn = conf.serial;
        this.devTypeInt = conf.devType;
        this.paramGroupStr = conf.devTpyeCon;

        let d = this.dialog = new SMDUIDialog({modal: false, draggable: true});
        let cont = this.dialog.contentDiv;


        this.mainTabPanel = new TabPanel(cont, {
            menuItem: [
                {label: "Basic", id: 'basic'},
                {label: "Advanced", id: 'advanced'}
            ]
        });

        let basicCont = this.mainTabPanel.getItemContentById('basic');
        basicCont.classList.add('devParamPanelWrapper');
        let advCont = this.mainTabPanel.getItemContentById('advanced');
        advCont.classList.add('devParamPanelWrapper');

        let enabled = this.enableInput = new ParamSetting(advCont, {
            instrExt: 'enableParam',
            extraData: {
                devSerial: this.sn,
                state: () => {
                    return  this.enableInput.getValue();
                }},
            type: 'dropDown', title: 'Enable Device', ctrlInfo: '.',
            dropDownConf: {options: [
                    {label: 'Disabled', value: false},
                    {label: 'Enabled', value: true}
                ]}
        });
        enabled.setValue(conf.param.enable);

        let templateOptions = [];
        for (var template in p.templateNameMap) {
            templateOptions.push({label: p.templateNameMap[template], value: template});
        }

        let p1 = new ParamSetting(advCont, {type: 'dropDown', title: 'Template',
            ctrlInfo: '.',
            dropDownConf: {options: templateOptions}
        });
        p1.setValue(p.currentTemplate);


        //
        //add phase alignment param i available
        //
        if (conf.param.targetPowerPhaseAlignment !== undefined) {
            let phAlign = new ParamSetting(advCont, 'gridConnections.' + this.sn + '.targetPowerPhaseAlignment', {type: 'dropDown', title: 'Phase Alignement',
                ctrlInfo: '.',
                dropDownConf: {options: [
                        {label: 'Align Sum', value: 0},
                        {label: 'Align Export', value: 1},
                        {label: 'Align Import', value: 2}
                    ]}
            });

            phAlign.setValue(conf.param.targetPowerPhaseAlignment);
        }

        //
        //add inputs to mark it as available
        //
        createInputButton.call(this, advCont);


        //
        //create control buttons
        //
        hh.pPanelAddDescTitle(basicCont, 'Setpoints.');
        createConfigButton.call(this, 'powerSetpointTemplateMap', basicCont);
        if (p['capacitySetpointTemplateMap']) {
            createConfigButton.call(this, 'capacitySetpointTemplateMap', basicCont);
        }

        hh.pPanelAddDescTitle(basicCont, 'Limits.');
        createConfigButton.call(this, 'powerLimitMinTemplateMap', basicCont);
        createConfigButton.call(this, 'powerLimitMaxTemplateMap', basicCont);
        if (p['capacitySetpointTemplateMap']) {
            createConfigButton.call(this, 'capacityLimitMinTemplateMap', basicCont);
            createConfigButton.call(this, 'capacityLimitMaxTemplateMap', basicCont);
        }

        //
        //create Remove button
        //
        createRemoveButton.call(this, advCont);


//        //todo remove
//        if (!this.availableInputsDialog) {
//            createDialogAvailableInputs.call(this);
//        }
//        this.availableInputsDialog.show();

    }

    function createInputButton(cont) {

        let pDiv = hh.div(cont, 'devParamPanel');
        hh.span(pDiv, "Control on Input", 'ctrlLabel');
        hh.ddButton(pDiv, 'ctrlExec', [
            {name: 'Change', cb: () => {

                    if (!this.availableInputsDialog) {
                        createDialogAvailableInputs.call(this);
                    }
                    this.availableInputsDialog.show();
                }},
            {name: 'Disable', cb: () => {
//                    debugger;
                    wsm.sendDevMsgExecWithJsonInst({
                        instrExt: 'stateInputDisable',
                        devSerial: this.sn,
                        showMessage: true
                    }, (msg, data) => {
                        this.param.inputId = null;
                        updateInputCtrlParam.call(this);
                        mu.showInfoMessage("Success", 'Input Control Disabled');
                    });
                }}
        ]);
//        debugger;
        this.compCont.inputLabel = hh.span(pDiv, ' ', 'ctrlInfo');
        updateInputCtrlParam.call(this, this.param.inputId);
    }

    function createRemoveButton(cont) {
        let deleteDevice = hh.button(cont, 'Remove Device');
        deleteDevice.onclick = function (ev) {

            wsm.sendDevMsgExecWithJsonInst(
                    {instrExt: 'removeDevice', serialNumber: this.sn},
                    function (message, response) {
                        mu.showInfoMessage('Device ' + response.deviceSrialNumber + " removed!");
                        console.log("Result: ", response);
                        this.dialog.hide();
                        if (typeof (this.panelCard.onRemove) === 'function') {
                            this.panelCard.onRemove.call(this.panelCard);
                        }
                    }.bind(this),
                    function (message, errMsg) {
                        mu.showErrorMessage(errMsg, 'Error');
                        console.warn("No Energy Management Units Found " + errMsg);
                        this.dialog.hide();
                        if (typeof (this.panelCard.onRemove) === 'function') {
                            this.panelCard.onRemove.call(this.panelCard);
                        }
                    }.bind(this),
                    3000);
        }.bind(this);
    }

    function createConfigButton(ctrlName, cont) {
        let p = this.param;
        if (ctrlName !== 'templateNameMap' && p[ctrlName] && p[ctrlName][p.currentTemplate] !== undefined) {
            let unitDefObj = devParamPowerCtrlNameMap(ctrlName);
            let div = hh.div(cont, 'smdui-cpDial-block');
            hh.span(div, unitDefObj.title, 'smdui-cpDial-blockTitle');
//                
            let button = hh.button(div, '', 'smdui-cpDial-blockButton fa fa-pencil-square-o');
            button.onclick = function (ctrl) {
                this.data.ctrlName = ctrl;
                this.data.cp = null;
                onCtrlTypeEdit.call(this);
            }.bind(this, ctrlName);
            hh.span(div, unitDefObj.info, 'smdui-cpDial-blockInfo');
        }
    }

    function createDialogAvailableInputs() {
        let dialog = this.availableInputsDialog = new SMDUIDialog({modal: true, draggable: true,
            //on dialog show, fetch content and populate in table
            onshow: function (d) {
                let dCont = d.contentDiv;
                let cont = dCont;
                hh.removeAllChilds(dCont);
                hh.div(dCont, 'display: flex');
                wsm.sendDevMsgExecWithJsonInst({instrExt: 'getDigitalInputList', showMessage: true},
                        function (message, response) {

                            let onInputState = new SMDUIDropDown(cont, {val: this.param.enableStateInput, options: [{label: 'Enable On Input', value: true}, {label: 'Disable On Input', value: false}]});
                            let onInputMissing = new SMDUIDropDown(cont, {val: this.param.onInputMissing, options: [{label: 'Enable when input missing', value: true}, {label: 'Disable when input missing', value: false}]});
                            for (var item in response) {
                                let din = response[item];
                                let objSer = din.deviceSerial;
                                let desc = din.label;
                                new ParamSetting(cont, {type: 'dropDownButton', title: objSer + ' - ' + desc,
                                    ctrlInfo: 'Input at device: ' + objSer + ', Connection status: <strong>' + (din.connected ? 'Connected' : 'Disconnected') + '</strong>, id: ' + din.id + ', Current State: ' + din.state,
                                    content: [
                                        {name: 'Set ' + objSer,
                                            cb: function (input) {
                                                wsm.sendDevMsgExecWithJsonInst({
                                                    instrExt: 'stateInputSet',
                                                    inputId: input.id,
                                                    devSerial: this.sn,
                                                    enableStateInput: onInputState.getValue(),
                                                    onInputMissing: onInputMissing.getValue(),
                                                    showMessage: true
                                                }, function (onInputMissing, ctrlMethod, dev, msg) {//on success
                                                    mu.showInfoMessage("Success", 'Input set complete.');
                                                    this.availableInputsDialog.hide();

                                                    this.param.onInputState = ctrlMethod.getValue() === 'true';
                                                    this.param.onInputMissing = onInputMissing.getValue() === 'true';
                                                    this.param.inputId = input.id;
                                                    updateInputCtrlParam.call(this);

                                                }.bind(this, onInputMissing, onInputState));
                                            }.bind(this, din)}
                                    ]
                                });
                            }
                            d.positionCenter();
                        }.bind(this),
                        function (msg, err) {
                            hh.pPanelAddDescTitle(cont, err);
                        });
            }.bind(this)
        });
        dialog.setBarTitle('Select Input Control for ' + this.panelCard.displayName);
    }

    function updateInputCtrlParam() {
        this.compCont.inputLabel.textContent = this.param.inputId !== null ?
                'Current input set to '
                + (this.param.onInputState ? 'ENABLE ' : 'DISABLE ')
                + 'on input active. At : ' + this.param.inputId
                : 'This function is currently disabled.';
    }

    function devUnitDescrMap(unit) {
        switch (unit) {
            case 'POWER_W':
                return {
                    unit: 'W',
                    title: 'Power'
                };
            case 'PERCENT_SOC':
                return {
                    unit: '%',
                    title: 'Capacity'
                };
            default:
                return {
                    unit: 'Undefined key in dictionary [' + unit + ']',
                    title: 'Undefined Limit Bottom:'
                };
        }
    }

    function devParamPowerCtrlNameMap(ctrlName) {
        switch (ctrlName) {
            case 'powerLimitMaxTemplateMap':
                return {
                    title: 'Power Limit MAX',
                    info: 'no info'
                };
            case 'powerLimitMinTemplateMap':
                return {
                    title: 'Power Limit MIN',
                    info: 'no info'
                };
            case 'powerSetpointTemplateMap':
                return {
                    title: 'Power Setpoint',
                    info: 'no info',
                    priorityEnabled: true
                };
            case 'capacityLimitMaxTemplateMap':
                return {
                    title: 'Capacity Limit MAX',
                    info: 'no info'
                };
            case 'capacityLimitMinTemplateMap':
                return {
                    title: 'Capacity Limit MIN',
                    info: 'Capacity Min limit.'
                };
            case 'capacitySetpointTemplateMap':
                return {
                    title: 'Capacity Setpoint',
                    info: 'no info',
                    priorityEnabled: true
                };
            default:
                return {
                    info: 'Unknown key in dictionary [' + ctrlName + ']',
                    title: 'UNKNOWN-' + ctrlName
                };
        }
    }

    initUi.call(this, conf);



}