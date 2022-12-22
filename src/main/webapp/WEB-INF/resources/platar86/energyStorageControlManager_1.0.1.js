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


/* global mainUtils, wsm */


function ESControlManager(bcRequestTimeout, storageTimeout) {
    this.bcRequestTimeout = bcRequestTimeout || 20000;
    this.storageTimeout = storageTimeout || 8000;
    this.timerId = null;
    this.storageAvailable = false;
    this.storageList = {};

    this.init = function (config) {
        this.config = config;
        console.log('ESControlManager Init.');
        this.requestBc();
        this.timerId = window.setInterval(this.requestBc.bind(this), this.bcRequestTimeout);
        this.timerTimeoutId = window.setInterval(this.checkTimeout.bind(this), 1000);
        
                 wsm.onMessageDevBroadcast = {fn: this.onMessage, devModelId: this.config.eSControlModel};
    };

    this.checkTimeout = function (timeout) {
        let cTime = new Date().getTime();
        for (var stName in this.storageList) {
            let storage = this.storageList[stName];
            if (cTime - storage.lastUpdate > this.storageTimeout) {
                if (storage.available) {
                    storage.available = false;
                    this.execCallback(this.onStorageTimeoutCall, stName, storage.data, storage.lastUpdate);
                }
            }
        }
    };
    this.requestBc = function () {
        var dSer = this.config.loggerSerial || 0;
        var dMod = this.config.eSControlModel;
        var message = wsm.emptyMessage;
        message.devSerialNumber = dSer;
        message.instr = "broadcastRequest";
        message.devModelId = dMod;
        wsm.sendDevMsg(message,
                function (successMessage) {
                    console.log("onSuccess: " + successMessage);
                },
                function (errorMessage) {
                    console.log("onError: " + errorMessage.response.faultMsg);
                },
                function () {
                    console.log("onTimeout: ");
                }
        );
    };

    this.onDataReceivedCall = [];
    this.onDataReceived = function (callback) {
        if (isFunction(callback)) {
            this.onDataReceivedCall.push(callback);
        }
    };
    this.onWsErrorCall = [];
    this.onWsError = function (callback) {
        if (isFunction(callback)) {
            this.onDataReceivedCall.push(callback);
        }
    };
    this.onWsOpenCall = [];
    this.onWsOpen = function (callback) {
        if (isFunction(callback)) {
            this.onDataReceivedCall.push(callback);
        }
    };
    this.onWsCloseCall = [];
    this.onWsClose = function (callback) {
        if (isFunction(callback)) {
            this.onDataReceivedCall.push(callback);
        }
    };
    this.onStorageTimeoutCall = [];
    this.onStorageTimeout = function (callback) {
        if (isFunction(callback)) {
            this.onStorageTimeoutCall.push(callback);
        }
    };
    this.onStorageReconnectCall = [];
    this.onStorageReconnect = function (callback) {
        if (isFunction(callback)) {
            this.onStorageReconnectCall.push(callback);
        }
    };

    this.execCallback = function (fnArr) {
        var argArr = [];
        for (var i = 1; i < arguments.length; i++) {
            argArr.push(arguments[i]);
        }
        for (var j = 0; j < fnArr.length; j++) {
            try {
                fnArr[j].apply(null, argArr);
            } catch (e) {
                console.log(e);
            }
        }
    };
}

ESControlManager.prototype.onMessage = function (message) {
    let cTime = new Date().getTime();
    if (message.messageList !== undefined) {
        for (var i = 0; i < message.messageList.length; i++) {
            let es = message.messageList[i];
            if (es.busName !== undefined) {

                if (escManager.storageList[es.busName] === undefined) {
                    escManager.storageList[es.busName] = {};
                }
                escManager.storageList[es.busName].lastUpdate = cTime;
                if (escManager.storageList[es.busName].available === false) {
                    escManager.execCallback(escManager.onStorageReconnectCall, es.busName, message.messageList[i]);
                }
                escManager.storageList[es.busName].available = true;
                escManager.storageList[es.busName].data = message.messageList[i];
//                console.log(es);
            }
        }
        escManager.execCallback(escManager.onDataReceivedCall, message.messageList);
    }
};

ESControlManager.prototype.onOpen = function (message) {
    console.log('ESControlManager Socket has been Opened.');
    escManager.execCallback(escManager.onWsOpen, message.messageList);
};
ESControlManager.prototype.onClose = function (message) {
    console.log('ESControlManager Socket has been Closed.');
    escManager.execCallback(escManager.onWsClose, message.messageList);
};

ESControlManager.prototype.onError = function (message) {
    console.log('ESControlManager Socket Error.');
    escManager.execCallback(escManager.onWsError, message.messageList);
};
window.escManager = new ESControlManager();

$(document).ready(function () {
    escManagerInitRequest();
});