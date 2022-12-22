/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by platar86, 2019
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 Sout Africa
 *  Phone: 021 555 2181
 *  
 */

/* global $jsfId, mainUtils, PrimeFaces, PF, wsm, pm, dm, snSpan, sui, sn, hh */

//MUST CHANGE VERSION!!!
(function (root) {
    var onDeviceSettingExecCall = [];
    var onDeviceSettingChangeCall = [];
    var onAllDataReceivedCall = [];
    var onSelectedChangeCall = [];
    var onDeviceInitCompleteCall = [];
    var onSelectedStatusChangeCall = [];
    var onDataReceivedCall = [];
    var onSelectedDataReceivedCall = [];
    var onSelectedCustomDataReceivedCall = [];
    var onParamReceivedCall = [];
    var onSelectedParamReceivedCall = [];
    var onSelectedParamInitCall = [];
    var onSelectedCustomDataReceivedSpecificCall = {};

    var dmData = {bcDataClass: []};
    var status = {};
    var onProgressDialogCreateEl = {};
    var onProgressDataEl = {};

    function DeviceManager() {

        this.exportParam = function (param) {
            let jsonFile = JSON.stringify(param);
            jsonFile = [jsonFile];
            let blob1 = new Blob(jsonFile, {type: "text/plain;charset=utf-8"});
            let isIE = false || !!document.documentMode;
            if (isIE) {
                window.navigator.msSaveBlob(blob1, "Customers.txt");
            } else {
                let url = window.URL || window.webkitURL;
                link = url.createObjectURL(blob1);
                let a = document.createElement("a");
                a.download = dm.selected.deviceName + " " + dm.selected.data.serialNumber + ".txt";
                a.href = link;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        };

        // needs to check if model id



        this.compParam = function () {
            let param = document.getElementById("paramInput").value;
            let paramDiv = document.getElementById("paramDiv");
            let compareResults = JSON.stringify(param) === reader.result;
            paramDiv.innerHTML = JSON.stringify(param);
            console.log(compareResults);
        };
        this.convertFileJsonToObject = function () {
        };

        this.setBcReqDataClass = function (dataClass) {
            if (typeof (dataClass) === 'string' && dmData.bcDataClass.indexOf(dataClass) === -1) {
                dmData.bcDataClass.push(dataClass);
                this.requestBroadcast();
            }
        };
        this.onDeviceSettingExec = function (callback) {
            if (isFunction(callback)) {
                onDeviceSettingExecCall.push(callback);
            }
        };
        this.onDeviceSettingChange = function (callback) {
            if (isFunction(callback)) {
                onDeviceSettingChangeCall.push(callback);
            }
        };
        this.onAllDataReceived = function (callback) {
            if (isFunction(callback)) {
                onAllDataReceivedCall.push(callback);
            }
        };
        this.onDataReceived = function (callback) {
            if (isFunction(callback)) {
                onAllDataReceivedCall.push(callback);
            }
        };
        this.onDeviceInitComplete = function (callback) {
            if (isFunction(callback)) {
                onDeviceInitCompleteCall.push(callback);
            }
        };
        this.onSelectedChange = function (callback) {
            if (isFunction(callback)) {
                onSelectedChangeCall.push(callback);
            }
        };
        this.onSelectedStatusChange = function (callback) {
            if (isFunction(callback)) {
                onSelectedStatusChangeCall.push(callback);
            }
        };
        this.onDataReceived = function (callback) {
            if (isFunction(callback)) {
                onDataReceivedCall.push(callback);
            }
        };
        this.onSelectedDataReceived = function (callback) {
            if (isFunction(callback)) {
                onSelectedDataReceivedCall.push(callback);
            }
        };


        this.onSelectedCustomDataReceived = function (callback, dataName) {
            if (isFunction(callback)) {
                if (dataName !== undefined) {
                    if (typeof (dataName) === 'string') {
                        if (onSelectedCustomDataReceivedSpecificCall[dataName] === undefined) {
                            onSelectedCustomDataReceivedSpecificCall[dataName] = [];
                        }
                        onSelectedCustomDataReceivedSpecificCall[dataName].push(callback);
                    } else {
                        console.warn("Second argument must be of type String, (Class name). To receive All do not pass second argument");
                    }
                } else {
                    onSelectedCustomDataReceivedCall.push(callback);
                }
            }
        };

        this.onParamReceived = function (callback) {
            if (isFunction(callback)) {
                onParamReceivedCall.push(callback);
            }
        };
        this.onSelectedParamReceived = function (callback) {
            if (isFunction(callback)) {
                onSelectedParamReceivedCall.push(callback);
            }
        };
        this.onSelectedParamInit = function (callback) {
            if (isFunction(callback)) {
                onSelectedParamInitCall.push(callback);
            }
        };

        this.onProgressData = function (id, callback) {

            if (isFunction(callback) && typeof (id) === 'string') {
                if (onProgressDataEl[id] === undefined) {
                    onProgressDataEl[id] = {};
                    onProgressDataEl[id].fnArr = [];
                }
                onProgressDataEl[id].fnArr.push(callback);
            } else {
                console.warn('incorect param ', id, callback);
            }
        };

        this.onProgressDialogCreate = function (id, callback) {

            if (isFunction(callback) && typeof (id) === 'string') {
                if (onProgressDialogCreateEl[id] === undefined) {
                    onProgressDialogCreateEl[id] = {};
                    onProgressDialogCreateEl[id].fnArr = [];
                }
                onProgressDialogCreateEl[id].fnArr.push(callback);
            } else {
                console.warn('incorect param ', id, callback);
            }
        };

        this.execCallback = function (fnArr) {
            var argArr = [];
            for (var i = 1; i < arguments.length; i++) {
                argArr.push(arguments[i]);
            }
            for (var j = 0; j < fnArr.length; j++) {
                try {
                    fnArr[j].apply(this, argArr);
                } catch (e) {
                    console.log(e);
                }
            }
        };

        this.dataExpandMap = {};
        this.config = {};
        this.devList = {};
        this.selected = {};
        this.broadcastSpecificModel = {};

        this.initDevListFromWsConnVar = function () {
            try {
                for (var id in  wsm.connectionVar.subDeviceList) {
                    try {
                        let device = wsm.connectionVar.subDeviceList[id];
                        let serialNumber = device.serialNumber;
                    } catch (e) {

                    }
                }
            } catch (e) {

            }
        };

        this.initDevList = function (devList) {
            var arr;
            if (typeof (devList) === 'object') {
                arr = devList;
            } else {
                arr = JSON.parse(devList);
            }
            for (var item in arr) {
                var dev = arr[item];
                var serialNumber = arr[item].serialNumber;
                if (serialNumber !== undefined) {
                    if (this.devList[serialNumber] !== undefined) {
//                    debugger;
                        console.log('Try to insert dublicate serial number: ' + serialNumber);
                        continue;
                    }
                    var sDev = new SubDevice(dev, this.devStateChangeCb.bind(this), 15000);
                    sDev.connected = false;
                    this.devList[serialNumber] = sDev;
                    if (Object.keys(this.devList).length === 1) {
//                    sDev.select(true);
                        this.setSelected(sDev);
                    }
                }
            }
//        console.log(devList);

            this.execCallback(onDeviceInitCompleteCall, null);
            if (!this.paramPanelPolpulateComplete) {
                this.paramPanelPolpulateComplete = true;
                this.populateParamPanel('devParamPanel', 'data-paramname');
            }

            wsm.onMessageDevBroadcast = dispatchMessage;
            wsm.onMessageFastData = dispatchMessageFastData;

            wsm.onSocketStateChange(function (state) {
                if (state) {
//                    debugger;
                    this.requestBroadcast();
                    if (!status.paramReceived) {
                        this.requestParamUpdate();
                    }
                }
                console.log('on ws Scoker ============');
            }.bind(this), true);

            wsm.onLoggerStatusChange = function (state) {
                if (state) {
                    this.requestBroadcast();
                    if (!status.paramReceived) {
                        this.requestParamUpdate();
                    }
                } else {
                    this.setAllDisconnected();
                }
            }.bind(dm);
        };

        this.addSingleDev = function (dev) {
            let device;
            if (typeof (dev) === 'object') {
                device = dev;
            } else {
                device = JSON.parse(dev);
            }
            var serialNumber = device.serialNumber;
            if (serialNumber !== undefined) {
                if (this.devList[serialNumber] !== undefined) {
                    console.log('Try to insert dublicate serial number: ' + serialNumber);
                    return null;
                }
                var sDev = new SubDevice(dev, this.devStateChangeCb.bind(this), 15000);
                sDev.connected = false;
                this.devList[serialNumber] = sDev;
                sDev.initUI();
            }
        };

        this.isDeviceIsSelected = function (serial) {
            if (this.devList[serial] !== undefined) {
                if (this.devList[serial].checkSelected()) {
                    return true;
                }
            }
            return false;
        };

        this.onDevSelectionTblChange = function () {
            //call this when slection table change page.
            const panelDevList = document.querySelector(".deviceViewWrapper").querySelectorAll('.deviceTableSelectorPanel');
            for (var i = 0; i < panelDevList.length; i++) {
                let  panel = panelDevList[i];
                for (var j = 0; j < panel.classList.length; j++) {
                    let cla = panel.classList[j];
                    if (cla.indexOf('devTbPanel-') === 0) {
                        let serial = cla.substring(11);

                        let dev = this.getDevBySerialNumber(serial);
                        //add selection background if this dev is selected
                        if (dev.selected) {
                            panel.classList.add('ui-panel-content-selectedDev');
                        }
                        dev.initUI();
                        //update connected icon
                        if (dev.connected) {
                            panel.querySelector('.devConnectedIcon').style.display = 'block';
                            panel.querySelector('.devDisconnectedIcon').style.display = 'none';
                        } else {
                            panel.querySelector('.devConnectedIcon').style.display = 'none';
                            panel.querySelector('.devDisconnectedIcon').style.display = 'block';
                        }
                        //update alert icon
                        if (dev.getData() !== undefined && dev.getData().alertMap !== undefined) {
                            dev.updateAlert(dev.getData().alertMap);
                        }
                    }
                }
            }
        };

        this.setSelected = function (dev) {
            if (!dev.selected) {
                console.log('dev selection change from ', this.selected.serialNumber, ' to', dev.serialNumber);
                let newSelection = true;
                this.previousSelected = this.selected;
                this.selected = dev;
                for (var item in this.devList) {
                    if (this.devList[item].selected) {
                        newSelection = false;
                        this.devList[item].unselect();
                    }
                }
//        console.log('selected change:' + dev.serialNumber);

                dev.select();
                if (dev.connected && (dev.getParam() === undefined || !dev.paramInit)) {
                    this.requestParamUpdate();
                }

//this break some of the code, not sure why must be here
//            if (!newSelection) {
                this.execCallback(onSelectedChangeCall, dev);
//            }

                dev.reloadParam();
                dev.updataParamControlAll(this.previousSelected);

//        } else {
//            console.log('try to select same dev');
                if (this.broadcastSpecificModel[dev.modelID]) {
                    this.requestBroadcast();
                }
            }
        };

        this.getSelected = function () {
            for (var item in this.devList) {
                if (this.devList[item].checkSelected()) {
                    return this.devList[item];
                }
            }
        };

        this.getDevBySerialNumber = function (serial) {
            for (var item in this.devList) {
                if (this.devList[item].serialNumber === serial) {
                    return this.devList[item];
                }
            }
            return null;
        };

        this.onParamChange = function (paramName, idx) {
            devManager.execCallback(onDeviceSettingChangeCall, paramName, idx);
            if (this.getSelected() !== undefined) {
                if (!this.getSelected().connected) {
//                mainUtils.showWarningMessage('Device is offline.');
                } else {
                    this.getSelected().updataParamControl(paramName, idx);
                }
            }
        };

        this.setAllDisconnected = function () {
            for (var item in this.devList) {
                this.devList[item].setConnected(false);
            }
            if (this.getSelected() !== undefined) {
                if (this.getSelected().connected) {
                    this.execCallback(onSelectedStatusChangeCall, this.getSelected(), false);
                }
            }
        };

        this.devStateChangeCb = function (device, state) {
            if (device.checkSelected()) {
                this.execCallback(onSelectedStatusChangeCall, device, state || false);
            }
        };

        this.onParamMessage = function (paramList, dataClass) {
            status.paramReceived = true;
            if (paramList !== undefined && paramList.length > 0 && dataClass !== undefined) {
                for (var item in paramList) {
                    var serialNum = paramList[item].serialNumber;
                    var dev = this.getDevBySerialNumber(serialNum);
                    if (dev === undefined) {
                        continue;
                    }
                    var initParamFlag = dev.paramInit;
                    dev.updateParam(paramList[item], dataClass);
                    dev[dataClass] = paramList[item];
//                dev[dataClass].changes = {};
                    dev.paramName = dataClass;

                    //before call callbacks make sure dev is set to connected, otherwise will clear all value classes
                    dev.setConnected(true);

                    this.execCallback(onParamReceivedCall, dev, dev[dataClass]);
                    if (dev.selected === true) {
                        if (!initParamFlag) {
                            this.execCallback(onSelectedParamInitCall, dev, dev[dataClass]);
                        }
                        this.execCallback(onSelectedParamReceivedCall, dev, dev[dataClass]);
                    }
                    dev.updataParamControlAll();
                }
            }
        };

        this.requestParamUpdate = function () {
            if (this.getSelected()) {
                var message = {
                    instr: wsm.connectionVar.refreshParam,
                    devSerialNumber: this.getSelected().serialNumber,
                    devModelId: wsm.connectionVar.devModel
                };

                //devManager
//        console.log("send settings");
                wsm.sendDevMsg(message,
                        function (devMessage) { //on success
                            var params = devMessage.response.messageList;
                            var dataClass = devMessage.response.dataClass;
                            devManager.onParamMessage(params, dataClass);
                        },
                        function (errMsg, errStr) { //on Error
//                    mainUtils.showWarningMessage("Can not refresh Parameters!", devMessage.response.faultMsg);
                            console.log("Error: " + errStr);
                        },
                        function () { //on timeout
//                    mainUtils.showWarningMessage("Can not refresh Parameters!", 'timeout');
                            console.log('Timeout');
                        }
                );
            }
        };

        this.sendDevInstruction = function (instrExt, instrData) {

            var message = {
                instr: wsm.connectionVar.executeInstr,
                instrExt: instrExt.toString(),
                instrData: instrData.toString(),
                devSerialNumber: this.getSelected().serialNumber,
                devModelId: wsm.connectionVar.devModel
            };

            //devManager
//        console.log("send settings");
            wsm.sendDevMsg(message,
                    function (devMessage) { //on success

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
        };

        this.sendDevMessage = function (message, successFn, errFn, timeoutFn) {
            successFn = successFn || function (devMessage, data) { //on success
                mainUtils.showInfoMessage(data, "Instruction Successfull.");
                console.log("Instruction Successfull. ", data);
            };
            errFn = errFn || function (devMessage, errMsg) { //on Error
//            mainUtils.showWarningMessage(errMsg, "Instruction execution error!");
                console.log("Error: ", errMsg);
            };
            timeoutFn = timeoutFn || function () { //on timeout
//            mainUtils.showWarningMessage('Timeout' + "Instruction execution error!");
                console.log("Timeout: " + message.instrExt);
            };

            message.instrDataJson = message.instrDataJson || {
                name: message.instrExt || 'instrExtUnknown',
                idx: message.instrData || 'instrDataUnknown'
            };
            message.instr = wsm.connectionVar.executeInstr;
            message.devSerialNumber = this.getSelected().serialNumber;
            message.devModelId = wsm.connectionVar.devModel;

//        console.log("send settings");
            wsm.sendDevMsg(message, successFn, errFn, timeoutFn);
        };

        this.executeInstr = function (name, value, valueExt, success, error, timeout) {
            value = value || 0;
            valueExt = valueExt || 0;
            var message = {
                instrDataJson: {
                    'name': name,
                    'idx': valueExt
                },
                instrExt: name,
                instrData: value.toString(),
                instrDataExt: valueExt.toString()
            };
            message.instrDataJson[name] = value;

            success = success || function (message, data) { //success
                mainUtils.showInfoMessage("Change submited successfully", "Success execution.");
            };
            timeout = timeout || error || function () { //Timeout
                mainUtils.showErrorMessage("Timeout", "Message exec fail.");
                console.log('timeout');
            };
            error = error || function (message, error) { //Error
                mainUtils.showErrorMessage(error, "Message exec fail.");
            };


            devManager.sendDevMessage(message, success, error, timeout);

        };

        this.executeParamChange = function (name, idx, forceValue) {

            var value = null;
            let paramName = name;
            if (idx !== undefined && idx !== null) {
                let comp = PF(name);
                //shim to correct old school Indexed parameters
                if (comp && comp.paramName) {
                    paramName = comp.paramName;
                    var value = mainUtils.getWidgetValue(name);
                } else {
                    var value = mainUtils.getWidgetValue(name + idx);
                }
            } else {
                var value = mainUtils.getWidgetValue(name);
            }
            if (value === undefined) {
                console.log("Can not find method for writing param: " + name);
            } else {
                if (onDeviceSettingExecCall.length > 0) {

                    this.execCallback(onDeviceSettingExecCall, name, value.toString());
                } else {

                    var message = {
                        instrExt: paramName,
                        instrDataJson: {},
                        instrData: value.toString()
                    };
                    if (forceValue === true) {
                        value = forceValue;
                    }
                    message.instrDataJson[paramName] = value;
                    message.instrDataJson.idx = idx;

                    if (idx !== undefined && idx !== null) {
                        message.instrDataExt = idx.toString();
                    }
                    if (this.getSelected().getParamChanges()[name] === undefined) {
                        this.getSelected().getParamChanges()[name] = [];
                    }
                    if (idx !== undefined && idx !== null) {
                        this.getSelected().getParamChanges()[name][idx] = value;
                    } else {
                        this.getSelected().getParamChanges()[name] = value;
                    }


                    this.sendDevMessage(message,
                            function (message, data) { //success
                                if (idx !== undefined && idx !== null) {
                                    delete devManager.getSelected().getParamChanges()[message.instrExt][idx];
                                    devManager.getSelected().getParam()[message.instrExt][idx] = value;
                                    devManager.onParamChange(message.instrExt, idx);
                                } else {
                                    delete devManager.getSelected().getParamChanges()[message.instrExt];
                                    devManager.getSelected().getParam()[message.instrExt] = value;
                                    devManager.onParamChange(message.instrExt);
                                }

                                mainUtils.showInfoMessage("Change submited successfully", "Success execution.");
                                //    console.log(message);
                            },
                            function (message, error) { //Error
                                mainUtils.showErrorMessage(error, "Message exec fail.");
                            },
                            function () { //Timeout
                                mainUtils.showErrorMessage("Timeout", "Message exec fail.");
                                console.log('timeout');
                            });
                }
            }
        };

        this.executeJSSettingsParamChange = function (name, desc) {
            var value = null;
            let paramName = name;

            var value = pm.getParamValue(name);

            if (value === undefined) {
                console.log("Can not find method for writing param: " + name);
            } else {
                if (onDeviceSettingExecCall.length > 0) {

                    devManager.execCallback(onDeviceSettingExecCall, name, value.toString());
                } else {

                    var message = {
                        instrExt: paramName,
                        instrDataJson: {},
                        instrData: value.toString()
                    };

                    message.instrDataJson[paramName] = value;


                    if (devManager.getSelected().getParamChanges()[name] === undefined) {
                        devManager.getSelected().getParamChanges()[name] = [];
                    }
                    devManager.getSelected().getParamChanges()[name] = value;


                    devManager.sendDevMessage(message,
                            function (message, data) { //success

                                delete devManager.getSelected().getParamChanges()[message.instrExt];
                                devManager.getSelected().getParam()[message.instrExt] = value;
                                devManager.onParamChange(message.instrExt);
                                pm.elements[paramName].prevValue = value;
                                pm.update(devManager.getSelected().param);
                                mainUtils.showInfoMessage(desc + " change submitted successfully. Value: " + value);
                                //    console.log(message);
                            },
                            function (message, error) { //Error
                                mainUtils.showErrorMessage(error, "Message exec fail.");
                            },
                            function () { //Timeout
                                mainUtils.showErrorMessage("Timeout", "Message exec fail.");
                                console.log('timeout');
                            });
                }
            }
        };

        this.discardParamChange = function (name, idx) {
            if (this.getSelected().getParamChanges()[name] === undefined) {
                this.getSelected().getParamChanges()[name] = [];
            }
            if (idx !== undefined && idx !== null) {
                if (this.getSelected().getParamChanges()[name][idx]) {
                    delete     this.getSelected().getParamChanges()[name][idx];
                }
            } else {
                if (this.getSelected().getParamChanges()[name]) {
                    delete this.getSelected().getParamChanges()[name];
                }
            }
            this.getSelected().updataParamControl(name);
            mainUtils.setWidgetValue(name, this.getSelected().getParam()[name]);
        };
    }

    DeviceManager.prototype.populateParamPanel = function (panelClassName, dataFieldName) {
        /*  
         * This function is called from initDevice, populate data in html to generate somthing like this
         *   
         <div class="devParamPanel">
         <span class="ctrlLabel ">Display Escape:</span>
         <p:inputSwitch  class="ctrlValue" onLabel="ON" offLabel="OFF" widgetVar="edfLcdDisplayEscape" onchange="devManager.onParamChange('edfLcdDisplayEscape')"/> 
         <p:menuButton  class="ctrlExec edfLcdDisplayEscape"  icon="ui-icon-more-vert">
         <p:menuitem value="SET" onclick="devManager.executeParamChange('edfLcdDisplayEscape')"/>
         <p:menuitem value="DISCARD" onclick="devManager.discardParamChange('edfLcdDisplayEscape')"/>
         </p:menuButton >
         <span class="ctrlInfo">Enable/Disable LCD Display Escape.</span>
         </div> 
         *
         *from this:
         *
         <div class="devParamPanel" data-paramname="edfLcdDisplayEscape">
         <span class="ctrlLabel ">Display Escape:</span>
         <p:inputSwitch  class="ctrlValue" onLabel="ON" offLabel="OFF"/> 
         <p:menuButton  class="ctrlExec"  icon="ui-icon-more-vert">
         <p:menuitem  class="ctrlExecSet" value="Set"/>
         <p:menuitem  class="ctrlExecDiscard" value="Discard"/>
         </p:menuButton >
         <span class="ctrlInfo">Enable/Disable LCD Display Escape.</span>
         </div>
         */


        var panelArr = document.querySelectorAll('.' + panelClassName);
        for (var j = 0; j < panelArr.length; j++) {
            try { //catch error HERE to skip and populate others
                const panel = panelArr[j];
                if (panel.dataset[dataFieldName.substring(dataFieldName.lastIndexOf('-') + 1)]) {
                    let paramName = panel.dataset[dataFieldName.substring(dataFieldName.lastIndexOf('-') + 1)];
//            console.log('populating param: ' + paramName);

                    const inputWg = PrimeFaces.widgets[('widget_' + (panel.querySelector('.ctrlValue').id.replace(/:/g, '_')))];
                    let idx = panel.dataset.idx;
                    if (idx !== undefined) {
                        idx = Number(idx);
                        if (!isNaN(idx)) {
                            inputWg.paramIdx = idx;
                            inputWg.paramName = paramName;
                            paramName += idx;
                        } else {
                            idx = null;
                        }
                    } else {
                        idx = null;
                    }

                    PrimeFaces.widgets[paramName] = inputWg;
                    inputWg.jq[0].onchange = devManager.onParamChange.bind(devManager, paramName, idx);


                    panel.querySelector('.ctrlExec').classList.add(paramName);

                    const execWidget = PrimeFaces.widgets[('widget_' + (panel.querySelector('.ctrlExec').id.replace(/:/g, '_')))];
                    PrimeFaces.widgets[dataFieldName] = execWidget;
                    var execWidgetChildrenArr = execWidget.menuitems.children();
                    for (var i = 0; i < execWidgetChildrenArr.length; i++) {
                        if (execWidgetChildrenArr[i].classList.contains('ctrlExecSet')) {
                            execWidgetChildrenArr[i].parentElement.onclick = devManager.executeParamChange.bind(devManager, paramName, idx);
                        } else if (execWidgetChildrenArr[i].classList.contains('ctrlExecDiscard')) {
                            execWidgetChildrenArr[i].parentElement.onclick = devManager.discardParamChange.bind(devManager, paramName, idx);
                        }
                    }

                }
            } catch (e) {

            }
        }

    };

    DeviceManager.prototype.requestBroadcastSpecificData = function (className) {
        var message = wsm.emptyMessage;
        message.devSerialNumber = wsm.connectionVar.devModel;
        message.instr = "broadcastRequest";
        message.instrExt = "";
        message.devModelId = wsm.connectionVar.devModel;


        message.customDataClassRequest = [className];
        message.showMessage = true;

        wsm.sendDevMsgExecWithJsonInst(message);
    };

    DeviceManager.prototype.requestBroadcast = function () {
        if (dmData.bcIntervalId !== undefined) {
            clearInterval(dmData.bcIntervalId);
        }
        dmData.bcIntervalId = window.setInterval(this.requestBroadcast.bind(this), this.config.bcInterval || 20000);

        var message = wsm.emptyMessage;
        message.devSerialNumber = wsm.connectionVar.devModel;
        message.instr = "broadcastRequest";
        message.devModelId = wsm.connectionVar.devModel;

        message.instrDataJson = message.instrDataJson || {
            selectedSerial: dm.selected.serialNumber
        };
        message.instrDataJson.customDataClassRequest = dmData.bcDataClass;

        wsm.sendDevMsg(message,
                function (msg, response) {
                    try {
                        if (response.broadcastSpecificOnly) {
                            if (dm.broadcastSpecificModel[msg.devModelId] === undefined) {
                                dm.broadcastSpecificModel[msg.devModelId] = true;
                            }
                        }
//                    console.log("broadcastResponse: ", response);
                    } catch (e) {

                    }
                },
                function (errorMessage, errStr) {
                    console.log("Error: " + errStr);
                    if (errorMessage.response
                            && errorMessage.response.faultCode !== undefined
                            && errorMessage.response.faultCode !== -1) {

                        mainUtils.showErrorMessage(errStr, "Device conn error.");
                    }
                    window.setTimeout(dm.requestBroadcast.bind(dm), 5000);
                },
                function () {
                    console.log("onTimeout: ");
                }
        );
    };

    DeviceManager.prototype.expadData = function (map, data) {
        for (var alias in map) {
            let fieldName = map[alias];
            if (typeof (fieldName) === 'object' && data[alias] !== undefined) {
                devManager.expadData(fieldName, data[alias]);
                if (map[alias + "__objectName__"] !== undefined && map[alias + "__objectName__"] !== alias) {
                    data[map[alias + "__objectName__"]] = data[alias];
                }

            } else if (alias !== fieldName && Object.keys(data).indexOf(alias) !== -1) {
                data[fieldName] = data[alias];
                delete  data[alias];
            }

        }
    };

    DeviceManager.prototype.expandMessageData = function (data, className, devModel) {
        let version = data.sniuVer || 0;
        let mapName = className + '_' + version;
        if (this.dataExpandMap[mapName] !== undefined) {
            let map = devManager.dataExpandMap[mapName];
            devManager.expadData(map, data);
            return true;
        } else {
            var message = {
                instr: wsm.connectionVar.classNameMap || 'classNameMap',
                devSerialNumber: devManager.getSelected().serialNumber,
                devModelId: wsm.connectionVar.devModel,
                instrDataJson: {className: className}
            };

            wsm.sendDevMsg(message,
                    function (msg, response) {//on Success
                        devManager.dataExpandMap[mapName] = response;
                    },
                    function (msg, response) {//on Error
                        console.log(msg);
                    },
                    function (msg, response) {//on Timeout
                        console.log(msg);
                    },
                    );
        }
        return false;
    };

    var dispatchMessage = function (data) {
        var dataClass = data.dataClass;
        if (dataClass !== undefined) {
            var allDataArr = [];
            for (var item in data.messageList) {
                var ob = data.messageList[item];
                var device = devManager.getDevBySerialNumber(ob.serialNumber);
                if (device !== null) {

                    //if this field is True, data will requere pre processing 
                    if (ob.sniu && ob.sniu === true && !devManager.expandMessageData(ob, dataClass)) {
                        //this function must be executed before everithing
                        //used to modified the JSON naming before data proccessing 
                        break;
                    }
                    allDataArr.push(ob);

                    var oldStatus = device.connected;
                    device.setConnected(true);
                    if (device.getParam() === undefined || !device.paramInit) {
                        devManager.requestParamUpdate();
                    }
                    if (!oldStatus) {
                        if (device.checkSelected()) {
                            devManager.execCallback(onSelectedStatusChangeCall, device, device.connected);
                        }
                    }

                    device.updateData(ob, dataClass);
                    if (device.checkSelected()) {
                        devManager.execCallback(onSelectedDataReceivedCall, device, ob);
                        if (ob.currentProgress) {
                            devManager.updataDataProgressBar.call(this, device, ob.currentProgress);
                        }
                    }

                    try {
                        devManager.execCallback(onDataReceivedCall, device, ob);
                    } catch (e) {
                        console.warn(e);
                    }
                }
            }
            devManager.execCallback(onAllDataReceivedCall, allDataArr);
        }
    };

    DeviceManager.prototype.getProgressDialogList = function (prId) {
        let arr = [];
        for (var sn in this.devList) {
            let dev = this.devList[sn];
            if (dev.progressDialogCont[prId]) {
                arr.push(dev.progressDialogCont[prId]);
            }
        }
        return arr;
    };

    DeviceManager.prototype.updateProgressInfo = function (device, data) {
        let progMap = data.prMap;
        let prCount = 0;
        for (var prId in progMap) {
            let progress = progMap[prId];
            try {
                if (typeof (progress.id) === 'string') {
//                if (device.progressCurrentId !== prId) {
                    if (device.progKnown[prId] === undefined || device.progKnown[prId] === null) {
//               
                        if (device.progressDialogCont[prId] === undefined) {
                            device.progressDialogCont[prId] = devManager.createDeviceProgressDialog(device, prId);
                        }
                        if (device.checkSelected()) {
                            if (typeof (device.progressDialogCont[prId].onProgressOpen) === 'function') {
                                device.progressDialogCont[prId].onProgressOpen.call(null, device.progressDialogCont[prId]);
                            } else {
                                device.progressDialogCont[prId].open();
                            }
                        }

                        device.progKnown[prId] = prId;
                    } else if (device.progKnown[prId] === false && device.progressDialogCont[prId]) {
                        if (device.checkSelected()) {
                            if (typeof (device.progressDialogCont[prId].onProgressOpen) === 'function') {
                                device.progressDialogCont[prId].onProgressOpen.call(null, device.progressDialogCont[prId]);
                            } else {
                                device.progressDialogCont[prId].open();
                            }
                        }
                        device.progKnown[prId] = prId;
                    }

                    //check for disable DM icon flag
                    if (!device.progressDialogCont[prId].hideDmIcon) {
                        prCount++;
                    }

                    devManager.execCallback.call(device.progressDialogCont[prId], onProgressDataEl[prId].fnArr, device, progress, prId);
                } else {

                }
            } catch (e) {
                if (!status.missingProgDialogUpdataDisplayed) {
                    status.missingProgDialogUpdataDisplayed = true;
                    console.warn("Missing update Callback for proggressData. Please use: ", "dm.onProgressData('" + prId + "', function(dev, prog, id){}");
                }
            }
        }
        for (var knownProgId in device.progKnown) {
            if (progMap[knownProgId] === undefined) {
                //if proggress does not exist anymore
                device.progKnown[knownProgId] = false;
                try {
                    if (device.progressDialogCont[knownProgId] && typeof (device.progressDialogCont[knownProgId].onProgressComplete) === 'function') {
                        device.progressDialogCont[knownProgId].onProgressComplete(device.progressDialogCont[knownProgId]);
                    }
                } catch (e) {
                }
            }
        }

        if (prCount > 0) {
            dgm.showProgressIcon(device.serialNumber);
        } else {
            dgm.hideProgressIcon(device.serialNumber);
        }
    };

    DeviceManager.prototype.onProgressDialogIconClick = function (serialNumber) {
        let device = dm.devList[serialNumber];
        if (Object.keys(device.progKnown).length > 0) {
            for (var prId in device.progressDialogCont) {

                if (typeof (device.progKnown[prId]) === 'string') {
                    //if hidden no onopen must be called!
                    if (!device.progressDialogCont[prId].hideDmIcon) { //do not open if icon is marked as hidden

//                          device.progressDialogCont[prId].open();
                        if (typeof (device.progressDialogCont[prId].onProgressOpen) === 'function') {
                            device.progressDialogCont[prId].onProgressOpen.call(null, device.progressDialogCont[prId]);
                        } else {
                            device.progressDialogCont[prId].open();
                        }
                    }
                }
            }
        }
    };

    DeviceManager.prototype.createDeviceProgressDialog = function (dev, pId) {
        return   new SMDUIDialog({
            modal: false,
            heading: dev.serialNumber + ' ' + pId,
            open: false,
            draggable: true,
            onInitComplete: function (contentDiv, footerDiv, comp) {
                try {
//                    debugger;
                    dm.execCallback(onProgressDialogCreateEl[pId].fnArr, dev, pId, comp);
                } catch (e) {
                    if (!status.missingProgDialogCreateDisplayed) {
                        status.missingProgDialogCreateDisplayed = true;
                        console.warn("Missing update Callback for proggressData. Please use: ", "dm.onProgressDialogCreate('" + pId + "', function(dev, prog, id){}");
                    }
                }
            }
        });

    };

    var dispatchMessageFastData = function (data) {
        var dataClass = data.dataClass;
        if (dataClass !== undefined) {
            if (dataClass.indexOf('-devStatus') >= 0) {
                if (data.dataAsJSON && typeof (data.dataAsJSON) === 'object') {
                    for (var serial in data.dataAsJSON) {
                        let dev = dm.devList[serial];
                        if (dev) {
                            dev.updateAlert(data.dataAsJSON[serial]);
                            dev.devTimer.refreshTimer();
//                        console.log('refreshing timer for: ', serial);
                        }
                    }
                }
            } else {

                for (var item in data.messageList) {
                    var ob = data.messageList[item];
                    var device = devManager.getDevBySerialNumber(ob.serialNumber);
                    if (device !== undefined) {
                        //if this field is True, data will requere pre processing 
                        if (ob.sniu && ob.sniu === true && !devManager.expandMessageData(ob, dataClass)) {

                            break;
                        }
                    }
                    device.auxData[dataClass] = ob;
                    if (dataClass === 'DeviceDataProggressContainer') {
                        dm.updateProgressInfo(device, ob);
                    } else {


                        if (device.checkSelected()) {
                            devManager.execCallback(onSelectedCustomDataReceivedCall, device, ob);
                            if (onSelectedCustomDataReceivedSpecificCall[dataClass] !== undefined) {
                                devManager.execCallback(onSelectedCustomDataReceivedSpecificCall[dataClass], device, ob);
                            }
                        }
                    }

                }
            }
        }
    };

    DeviceManager.prototype.updataDataProgressBar = function (dev, progressBar) {
        let pbWg = PF('devProgresDialog');
        if (!pbWg) {
            return;
        }
        dev.progressActive = dev.progressActive || false;

        if (dev.progressActive === true && (!progressBar || progressBar.progressState === -1 || progressBar.progressState === 100)) {
            pbWg.closeIcon.show();
            dev.progressActive = false;
            PF('devProgresDialogClose').enable();
            PF('devProgresDialogBar').setValue(100);
            return;
        } else if (dev.progressActive === false && progressBar && progressBar.progressState >= 0 && progressBar.progressState < 100) {
            PF('devProgresDialogBar').setValue(0);
            pbWg.closeIcon.hide();
            PF('devProgresDialogClose').disable();

            dev.progressActive = true;
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



    var dm = root.dm = root.devManager = new DeviceManager();
    var devManager = dm;

    $(document).ready(function () {


    });



})(window);