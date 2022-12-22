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


function ESManager(bcRequestTimeout, storageTimeout) {
    this.bcRequestTimeout = bcRequestTimeout || 20000;
    this.storageTimeout = storageTimeout || 8000;
    this.timerId = null;
    this.storageAvailable = false;
    this.storageList = {};
    this.config = {};
    this.init = function (config) {
        console.log('EnergyStorageManager Init.');
        this.config = config;
        this.requestBcInitFail = 0;
        this.requestBc();
        this.timerRequestInitId = window.setInterval(this.requestBc.bind(this), 500);


        this.timerId = window.setInterval(this.requestBc.bind(this), this.bcRequestTimeout);
        this.timerTimeoutId = window.setInterval(this.checkTimeout.bind(this), 1000);

        wsm.onMessageDevBroadcast = {fn: this.onMessage, devModelId: this.config.eSModel};
    };

    this.getSumData = function () {
        let sum = {
            available: false,
            capacityAh: 0,
            capacityP: 0,
            currentA: 0,
            lastUpdate: 0,
            powerW: 0,
            ratedCapacityAh: 0,
            ratedChargeCurrentC: 0,
            ratedDischargeCurrentC: 0,
            ratedVoltageV: 0,
            ratedPowerW: 0,
            remainingTimeSign: 0,
            storageName: [],
            voltageV: 0,
            onlineSt: 0,
            offlineSt: 0
        };

        for (var stName in this.storageList) {
            if (this.storageList[stName].data) {
                let st = this.storageList[stName].data;

                if (!sum.available && st.available) {
                    sum.available = true;
                }
                sum.storageName.push(st.storageName);
                if (st.available) {
                    sum.onlineSt++;
                    sum.capacityAh += st.capacityAh;
                    sum.capacityP += st.capacityP;
                    sum.currentA += st.currentA;
                    sum.powerW += st.powerW;
                    sum.ratedCapacityAh += st.ratedCapacityAh;
                    sum.ratedVoltageV += st.ratedVoltageV;
                    sum.voltageV += st.voltageV;
                    sum.ratedPowerW += st.ratedVoltageV * st.ratedCapacityAh * st.ratedChargeCurrentC;
                } else {

                    sum.offlineSt++;
                }
            }
        }
        if (sum.onlineSt > 0) {
            if (sum.onlineSt > 1) {
                sum.voltageV /= sum.onlineSt;
                sum.capacityP /= sum.capacityP;
                sum.ratedVoltageV /= sum.ratedVoltageV;
            }

            sum.powerW = sum.currentA * sum.voltageV;
        }
        return sum;
    };

    this.getFakeSumData = function(powerW){
        return {
            "available": true,
            "capacityAh": 60.99981361111111,
            "capacityP": 80.99974112654321,
            "currentA": 0.687,
            "lastUpdate": 0,
            "powerW": powerW || 2000,
            "ratedCapacityAh": 72,
            "ratedChargeCurrentC": 0,
            "ratedDischargeCurrentC": 0,
            "ratedVoltageV": 51.2,
            "ratedPowerW": 5119.6416,
            "remainingTimeSign": 60012,
            "storageName": ["bank1"],
            "voltageV": 53.117,
            "onlineSt": 1,
            "offlineSt": 0
        };
    }

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
        let initTimer = this.timerRequestInitId;
        this.requestBcInitFail++;
        if (this.requestBcInitFail >= 10) {
            window.clearInterval(initTimer);
        }

        var dSer = this.config.loggerSerial || 0;
        var dMod = this.config.eSModel;
        var message = wsm.emptyMessage;
        message.devSerialNumber = dSer;
        message.instr = "broadcastRequest";
        message.devModelId = dMod;
        wsm.sendDevMsg(message,
                function (successMessage) {
                    window.clearInterval(initTimer);
                    this.requestBcInitFail = 10;
//                    console.log("onSuccess: " + successMessage);
                },
                function (errorMessage) {
                    let message = errorMessage.response ? errorMessage.response.faultMsg : JSON.stringify(errorMessage);
                    console.log("EnergyStorageManager BC Request Error: " + message);
                },
                function () {
                    console.log("EnergyStorageManager BC Request Timeout: ");
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
            this.onWsErrorCall.push(callback);
        }
    };
    this.onWsOpenCall = [];
    this.onWsOpen = function (callback) {
        if (isFunction(callback)) {
            this.onWsOpenCall.push(callback);
        }
    };
    this.onWsCloseCall = [];
    this.onWsClose = function (callback) {
        if (isFunction(callback)) {
            this.onWsCloseCall.push(callback);
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

ESManager.prototype.onMessage = function (message) {
    let cTime = new Date().getTime();
    if (message.messageList !== undefined) {
        for (var i = 0; i < message.messageList.length; i++) {
            let es = message.messageList[i];
            if (es.storageName) {

                if (esManager.storageList[es.storageName] === undefined) {
                    esManager.storageList[es.storageName] = {};
                }
                esManager.storageList[es.storageName].lastUpdate = cTime;
                if (esManager.storageList[es.storageName].available === false) {
                    esManager.execCallback(esManager.onStorageReconnectCall, es.storageName, message.messageList[i]);
                }
                esManager.storageList[es.storageName].available = es.available;
                
                esManager.storageList[es.storageName].dcConnected = es.dcConnected || false;
                esManager.storageList[es.storageName].data = message.messageList[i];
//                console.log(es);
            }
        }
        esManager.execCallback(esManager.onDataReceivedCall, message.messageList);
    }
};

ESManager.prototype.onOpen = function (message) {
    console.log('EnergyStorageManager WS Open.');
    esManager.execCallback(esManager.onWsOpen, message.messageList);
};
ESManager.prototype.onClose = function (message) {
    console.log('EnergyStorageManager WS Close.');
    esManager.execCallback(esManager.onWsClose, message.messageList);
};
ESManager.prototype.onError = function (message) {
    console.log('EnergyStorageManager WS Error.');
    esManager.execCallback(esManager.onWsError, message.messageList);
};
window.esManager = new ESManager();

$(document).ready(function () {
    esManagerInitRequest();
});

