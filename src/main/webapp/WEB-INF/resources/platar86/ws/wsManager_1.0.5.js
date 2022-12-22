/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by platar86, 2020
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */


/* global WebSocket, devManager, mainUtils */

//var socket = new WebSocket("ws://localhost/login/wc?loggerSerNum=44");

//MUST CHANGE VERSION!!!

(function (root) {

    var onSocketStateChange = [];
    var onMessageDevBroadcastById = {};
    var onMessageDevBroadcast = [];
    var onLoggerMessage = [];
    var onMessageResponse = [];
    var onLoggerStatusChange = [];
    var onSubDevStatusReceived = [];
    var onMessageDevFastDataBroadcast = [];



    var socket;
    var conConfig = {
        url: "ws://" + window.location.host + mainUtils.getContextPath() + "/login/wc?" + window.location.pathname.split('/').pop(),
        reconnect: true,
        reconnectDelay: 2000,
        debug: false,
        subDevMessageDefaultTimeout: 5000,
        allowMultipleDeviceConnections: true
    };

    var conVar = {
        showLoggerStateChange: true,
        loggerConnected: false
    };

    function proccessMessage(msgType, data) {
//        console.log(data)
        switch (msgType) {
            case "connectionInit":
                {
//                    conVar.selectedDevice = data.selectedDevice;
//                    conVar.wsSessionId = data.wsSessionId;
//                    if (data.devModel !== undefined) {
//                        conVar.devModel = data.devModel;
//                    }
//                    
                    for (var item in data) {
                        conVar[item] = data[item];
                    }
                    console.log('%c Websocket Established JS ver:1.0.4  Dev Model[' + wsm.connectionVar.devModel + ']', 'font-size: 18px; color : green');
//        console.log(socket.url);

                }
                break;
            case 0: //BORADCAST_DATA = 0;
                {
                    for (var cb in onMessageDevBroadcast) {
                        try {
                            onMessageDevBroadcast[cb](data);
                        } catch (e) {
                        }
                    }
                    if (data.devModel !== undefined && onMessageDevBroadcastById[data.devModel]) {
                        for (var cb in onMessageDevBroadcastById[data.devModel]) {
                            try {
                                onMessageDevBroadcastById[data.devModel][cb](data);
                            } catch (e) {
                                console.warn(e);
                            }
                        }
                    }
                }
                break;
            case 1: //RESPONSE_MESSAGE = 1;
                {
                    for (var cb in onMessageResponse) {
                        try {
                            onMessageResponse[cb](data);
                        } catch (e) {

                        }
                    }
                    try {
                        onSubDevMessageResponse(data);
                    } catch (e) {
                    }
                }
                break;
            case 2: //EVENT_MESSAGE = 2;
                {
                    console.log(data);
                }
                break;
            case 3: // AUTHENTICATION = 3;
                {
                    console.log(data);
                }
                break;
            case 4: // DEVICE_STATUS = 4; onSubDevStatusReceived
                {
//                    console.log(data);
                    for (var cb in onSubDevStatusReceived) {
                        try {
                            onSubDevStatusReceived[cb](data.messageList);
                        } catch (e) {

                        }
                    }
                }
                break;
            case 5: // DEVICE_DATA = 5;
                {
                    console.log(data);
                }
                break;
            case 6: //SUB_DEVICE_DATA = 6;
                {
                    console.log(data);
                }
                break;
            case 7: //DEVICE_ALERTS = 7;
                {
                    console.log(data);
                }
                break;
            case 10: //DLOGGER_CONN_STATUS = 10;
                {
//                    debugger;
                    console.log(data);
                    if (conVar.loggerConnected !== data.data && conVar.showLoggerStateChange) {
                        if (data.data) {
                            mainUtils.showInfoMessage("Logger connected!");
                        } else {
                            mainUtils.showWarningMessage("Logger disconnected!");
                        }
                    }
                    conVar.loggerConnected = data.data;
                    for (var cb in onLoggerStatusChange) {
                        try {
                            onLoggerStatusChange[cb](data.data);
                        } catch (e) {
                        }
                    }
                }
                break;
            case 21: //BORADCAST FAST DATA = 21;
                {
                    for (var cb in onMessageDevFastDataBroadcast) {
                        try {
                            if (data.dataAsJSON) {
                                try {
                                    data.dataAsJSON = JSON.parse(data.dataAsJSON);
                                } catch (e) {
                                }

                            }
                            onMessageDevFastDataBroadcast[cb](data);
                        } catch (e) {
                        }
                    }
                }
                break;
            default:
            {
                console.log('Unknown message type: ', data);
            }
        }
    }

    function notifyOnSocketChange(state) {
        wsm.status.socketConState = state;
        for (var i = 0; i < onSocketStateChange.length; i++) {
            try {
                onSocketStateChange[i](state, conVar);
            } catch (e) {
            }
        }
    }

    function onMessage(event) {
        try {
            var data = JSON.parse(event.data);
//            console.log(data);
            if (data.msgType !== undefined) {
                proccessMessage(data.msgType, data);
            } else {

            }
        } catch (e) {

        }
    }

    function  onopen(e) {
        notifyOnSocketChange(true);
//        console.log("Sending to server");
        let conParam = {
            msgType: 'conConfig',
            path: window.location.pathname
        };
        if (conVar.devModel) {
            conParam.devModel = conVar.devModel;
        }

        socket.send(JSON.stringify(conParam));
//        console.log(JSON.stringify(conParam));
    }

    function onclose(event) {
        notifyOnSocketChange(false);
        if (event.wasClean) {
            console.log('[close] Connection closed cleanly', event.reason);
        } else {
            console.log('[close] Connection died');
        }
        if (conConfig.reconnect) {
            if (isNaN(!conConfig.reconnectDelay) || conConfig.reconnectDelay < 1000) {
                conConfig.reconnectDelay = 1000; //minimum
            }

            window.setTimeout(wsm.reconnect, conConfig.reconnectDelay);
        }

    }

    function onerror(error) {
        console.log('Error', error.message);
    }

    function WsManager(root) {
        let secPrefix = 'ws://';
        if (location.protocol === 'https:') {
            secPrefix = 'wss://';
        }

        let url = secPrefix + window.location.host + mainUtils.getContextPath() + "/login/wc?path=";
        let pathParam = window.location.pathname.split('/').pop();
        if (pathParam.indexOf(".") >= 0) {
            pathParam = pathParam.split(".")[0];
        }
        url += pathParam;
        conConfig.url = url;

        this.status = {socketConState: false};

        socket = new WebSocket(conConfig.url);
        socket.onopen = onopen;
        socket.onmessage = onMessage;
        socket.onclose = onclose;
        socket.onerror = onerror;
    }

    WsManager.prototype.reconnect = function () {
        if (socket.readyState !== WebSocket.OPEN) {
            socket = new WebSocket(conConfig.url);
            socket.onopen = onopen;
            socket.onmessage = onMessage;
            socket.onclose = onclose;
            socket.onerror = onerror;
        }
    };

    WsManager.prototype.onSocketStateChange = function (cb, mustFireOnAttach) {
        if (typeof (cb) === 'function') {
            onSocketStateChange.push(cb); //return idx in array
            if (mustFireOnAttach) {
                try {
                    cb(wsm.status.socketConState);
                } catch (e) {
                    console.warn(e);
                }
            }
        } else {
            console.warn('Function required. Found', cb);
            return false;
        }
    };

    Object.defineProperty(WsManager.prototype, "connectionVar", {
        get: function () {
            return clone(conVar);
        },
        set: function (s) {
            console.log(s);
        }
    });

    Object.defineProperty(WsManager.prototype, "devModel", {
        set: function (devModel) {
            try {
                devModel = Number(devModel);
                if (!isNaN(devModel) && devModel >= 0) {

                    conVar.devModel = devModel;
                    if (socket.readyState === WebSocket.OPEN) {
                        socket.send(JSON.stringify({
                            msgType: 'conConfig',
                            devModel: devModel
                        }));
                    }
                }
            } catch (e) {
                console.warn(e);
            }
        }
    });

    Object.defineProperty(WsManager.prototype, "onMessageFastData", {
        set: function (cb) {
            if (typeof (cb) === 'function') {
                if (typeof (cb) === 'function') {
                    return  onMessageDevFastDataBroadcast.push(cb) - 1; //return idx in array
                } else {
                    console.warn('Function required. Found', cb);
                }

            }
        }
    });

    Object.defineProperty(WsManager.prototype, "onMessageDevBroadcast", {
        set: function (cb) {
            if (typeof (cb) === 'function') {
                if (typeof (cb) === 'function') {
                    return  onMessageDevBroadcast.push(cb) - 1; //return idx in array
                } else {
                    console.warn('Function required. Found', cb);
                }

            } else if (typeof (cb) === 'object') {
                let devModelId = cb.devModelId;
                let callbackFn = cb.fn;
                if (isNaN(devModelId)) {
                    console.warn('Invalid devModelId Type, Number required');
                } else if (typeof (callbackFn) !== 'function') {
                    console.warn('Invalid fn , fn: Function required');
                } else {
                    if (onMessageDevBroadcastById[devModelId] === undefined) {
                        onMessageDevBroadcastById[devModelId] = [];
                    }
                    onMessageDevBroadcastById[devModelId].push(callbackFn);
                }
            }
        }
    });

    Object.defineProperty(WsManager.prototype, "onLoggerStatusChange", {
        set: function (cb) {
            if (typeof (cb) === 'function') {
                return  onLoggerStatusChange.push(cb) - 1; //return idx in array
            } else {
                console.warn('Function required. Found', cb);
            }
        }
    });

    Object.defineProperty(WsManager.prototype, "onMessageResponse", {
        set: function (cb) {
            if (typeof (cb) === 'function') {
                return  onMessageResponse.push(cb) - 1; //return idx in array
            } else {
                console.warn('Function required. Found', cb);
            }
        }
    });

    Object.defineProperty(WsManager.prototype, "onSubDevStatusReceived", {
        set: function (cb) {
            if (typeof (cb) === 'function') {
                return  onSubDevStatusReceived.push(cb) - 1; //return idx in array
            } else {
                console.warn('Function required. Found', cb);
            }
        }
    });



    Object.defineProperty(WsManager.prototype, "emptyMessage", {
        get: function (cb) {
            return clone(emptyMessage);
        }
    });

    Object.defineProperty(WsManager.prototype, "alternativePath", {
        set: function (path) {
            wsm.sendDevMsg(
                    {
                        instr: "",
                        msgType: "conConfig",
                        path: path
                    },
                    function (message, response) {
                        console.log("Path added ", response);
                    },
                    function (message, response) {
                        console.warn("Error " + response);
                    },
                    3000);
            console.log("WSM Adding alternative path device: [" + path + "]");
        }
    });

    var wsUniqueMsgId = 0xABC;

    var emptyMessage = {
        subDevSerial: null,
        subDevModelId: null,
        instr: null,
        instrExt: null,
        instrIdx: null,
        instrData: null,
        instrDataExt: null,
        instrDataIndx: null,
        instrDataRwFlag: null,
        silent: false
    };

    var messageArr = [];

    WsManager.prototype.sendDevMsgExecWithJsonInst = function (jsonInstr, onSuccesCallback, onErrorCallback, onTimeoutCallback, timeout) {
        let serial = null;
        try {
            if (jsonInstr.serial !== undefined) {
                serial = jsonInstr.serial;
            } else {
                serial = devManager.getSelected().serialNumber;
            }
        } catch (e) {
        }

//        devManager.getSelected() ? serial = devManager.getSelected().serialNumber : serial = wsm.connectionVar.selectedDevice;
        var message = {
            instr: wsm.connectionVar.executeInstr,
            devSerialNumber: serial,
            devModelId: wsm.connectionVar.devModel,
            instrDataJson: jsonInstr
        };

        if (jsonInstr.instr !== undefined) {
            message.instr = jsonInstr.instr;
        }
        if (jsonInstr.devModelId !== undefined) {
            message.devModelId = jsonInstr.devModelId;
        }

        if (jsonInstr.showMessage !== undefined) {
            message.showMessage = true;
            delete jsonInstr.showMessage;
        }

        if (jsonInstr.instrExt === null) {
            console.warn('Missing InstrExt field');
        } else {
            if (jsonInstr.instrData === undefined) {
                jsonInstr.instrData = ' ';
            }
            //backwards compatibility with old devices
            if (jsonInstr.instrData) {
                message.instrData = jsonInstr.instrData;
            }
            message.instrExt = jsonInstr.instrExt;
            delete jsonInstr.instrExt;
            this.sendDevMsg(message, onSuccesCallback, onErrorCallback, onTimeoutCallback, timeout);
        }
    };

    WsManager.prototype.sendDevMsg = function (message, onSuccesCallback, onErrorCallback, onTimeoutCallback, timeout) {
        try {
            message.devSerialNumber = message.devSerialNumber || devManager.getSelected().serialNumber;
//            message.devSerialNumber = devManager.getSelected().serialNumber;
        } catch (e) {
        }
        try {
            if (socket.readyState !== WebSocket.OPEN)
                throw "Websocket not ready";

            if (message === undefined)
                throw "[message] missing while send message: " + JSON.stringify(message);

            if (message.devSerialNumber === undefined)
                throw "[devSerialNumber] missing while send message: " + JSON.stringify(message);

            if (message.instr === undefined)
                throw "[instr] missing while send message: " + JSON.stringify(message);

            message.msgType = message.msgType || "devInstruction";

            message.requestID = wsUniqueMsgId++;
            message.sessionID = wsm.connectionVar.wsSessionId;
            message.devModelId = message.devModelId || conVar.devModel;


            socket.send(JSON.stringify(message)); //send the message

            timeout = timeout || conConfig.subDevMessageDefaultTimeout;

            message.onSuccesCallback = onSuccesCallback || null;
            message.onErrorCallback = onErrorCallback || null;
            message.onTimeoutCallback = onTimeoutCallback || null;


            var newTimer = window.setTimeout(onTimeOutCallback.bind(message, message.requestID), timeout);
            message.timerId = newTimer;

            if (messageArr.length > 128) {
                messageArr.shift();
            }

            messageArr.push(message);
            return true;
        } catch (e) {
            if (typeof (onErrorCallback) === 'function') {

                onErrorCallback(message, e);
            } else if (conConfig.debug) {
                console.log(e);
            }
        }
        return false;
    };

    function onSubDevMessageResponse(msgResponse) {
        var message;
        var idx;
        if (msgResponse.requestID === undefined)
            throw "Can not find message with requestID: undefined";

        for (var i = 0; i < messageArr.length; i++) {
            if (messageArr[i].requestID !== undefined && messageArr[i].requestID === msgResponse.requestID) {
                idx = i;
                break;
            }
        }

        if (idx === undefined)
            throw "Can not find message with requestID: undefined";

        message = messageArr[i];
        messageArr.splice(idx, (idx + 1));

        if (message === undefined)
            throw "Message received after Timout requestID: " + msgResponse.requestID;

        //stop timeout timer first
        if (message.timerId !== undefined) {
            window.clearTimeout(message.timerId);
        }

        message.response = msgResponse;
        if (msgResponse.success) {
            var data = msgResponse.data;
            //try to parse if data is JSON format
            try {
                data = JSON.parse(data);
            } catch (e) {
            }
            if (typeof (message.onSuccesCallback) === 'function') {
                message.onSuccesCallback(message, data);
            } else if (message.showMessage) {
                mu.showInfoMessage(msgResponse.data, 'Success');
                console.log("Message success: ", message, data);
            } else if (conConfig.debug) {
                console.log("Message success: " + message);
            }
        } else {
            if (typeof (message.onErrorCallback) === 'function') {
                message.onErrorCallback(message, msgResponse.faultMsg);
            } else if (message.showMessage) {
                mu.showErrorMessage(msgResponse.faultMsg, 'Error');
            } else {
                console.warn("Message receive with success=false, fault msg: " + msgResponse.faultMsg);
            }
        }
    }

    function onTimeOutCallback(requestID) {
        var message;
        var idx = null;

        //find the message in the array
        for (var i = 0; i < messageArr.length; i++) {
            if (messageArr[i].requestID !== undefined && messageArr[i].requestID === requestID) {
                idx = i;
                break;
            }
        }

        if (idx !== null) {
            message = messageArr[i];
            //not removing the message from the array will help
            //array length is limited
            //messageArr.splice(idx, (idx + 1));

            if (typeof (message.onTimeoutCallback) === 'function') {
                message.onTimeoutCallback(message);
            } else if (message.showMessage) {
                mu.showWarningMessage('Message Index: ' + idx, 'Timeout');
            } else if (conConfig.debug) {
                console.log("Timeout for message: " + message);
            }
        } else {
            console.warn("Can not find message with requestID: " + requestID);
        }
    }

    var wsm = new WsManager(root);

    root.wsm = wsm;
//    root.socket = socket;

}(window));
