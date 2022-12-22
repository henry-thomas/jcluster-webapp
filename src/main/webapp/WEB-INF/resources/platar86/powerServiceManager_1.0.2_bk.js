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

function PSManager(bcRequestTimeout, storageTimeout) {
    this.bcRequestTimeout = bcRequestTimeout || 20000;
    this.powerTimeout = storageTimeout || 8000;
    this.timerId = null;
    this.powerAvailable = false;
    this.powerList = {};
    this.calcPowerList = {};
    this.config = {};
    this.powerTypeList = {};
    this.init = function (config) {

        console.log('PowerServiceManager Init.');
        this.requestBcInitFail = 0;
        this.requestBc();
        this.timerRequestInitId = window.setInterval(this.requestBc.bind(this), 500);
        this.config = config;
        this.timerId = window.setInterval(this.requestBc.bind(this), this.bcRequestTimeout);
        this.timerTimeoutId = window.setInterval(this.checkTimeout.bind(this), 1000);
        this.initCalculatedPower();
        this.initPowerTypes();


        wsm.onMessageDevBroadcast = {fn: this.onMessage, devModelId: this.config.powerServiceModel};
    };

    this.initPowerTypes = function () {
        for (var pName in this.config.powerTypes) {
            let power = {};
            power.available = false;
            power.calculated = true;
            power.lastUpdate = 0;
            power.data = this.createEmpyPowerDataObj();
            power.pList = this.config.powerTypes[pName];
            this.powerTypeList[pName] = power;
            power.typeAvailable = this.config.powerTypes[pName].length > 0;
        }
    };

    this.initCalculatedPower = function () {
        for (var pName in this.config.calcPower) {
            let power = {};
            power.available = false;
            power.calculated = true;
            power.data = {};
            power.lastUpdate = 0;
            power.expression = this.config.calcPower[pName];
            //do not store them in powerList name conflict problem 
            this.calcPowerList[pName] = power;
        }
    };

    this.getMathFunction = function (operator) {
        switch (operator) {
            case '+':
                return function (a, b) {
                    return a + b;
                };
                break;
            case '-':
                return function (a, b) {
                    return a - b;
                };
                break;
            case '*':
                return function (a, b) {
                    return a * b;
                };
                break;
            case '/':
                return function (a, b) {
                    return a / b;
                };
                break;
            default:
                return function (a, b) {
                    return a + b;
                };
        }
    };

    this.calcExpresionRecursive = function (exp) {

        if (exp.p1 === undefined || exp.p2 === undefined || exp.op === undefined) {
            return;
        }
        let p1Value = null;
        if (typeof (exp.p1) === 'object') {
            p1Value = this.calcExpresionRecursive(exp.p1);
        } else if (typeof (exp.p1) === 'number') {
            p1Value = this.createEmpyPowerDataObj();
            p1Value.powerW = exp.p1;
        } else if (typeof (exp.p1) === 'string') {
            if (this.powerList[exp.p1] !== undefined) {
                p1Value = this.powerList[exp.p1].data;
            }
        }

        let p2Value = null;
        if (typeof (exp.p2) === 'object') {
            p2Value = this.calcExpresionRecursive(exp.p2);
        } else if (typeof (exp.p2) === 'number') {
            p2Value = this.createEmpyPowerDataObj();
            p2Value.powerW = exp.p2;
        } else if (typeof (exp.p2) === 'string') {
            if (this.powerList[exp.p2] !== undefined) {
                p2Value = this.powerList[exp.p2].data;
            }
        }
        let operatorFn = this.getMathFunction(exp.op);

        let resultPower = this.createEmpyPowerDataObj();

        for (var fName in resultPower) {
            if (typeof (resultPower[fName]) === 'number') {
                if (fName === 'voltageV') {
                    resultPower[fName] = ((p1Value[fName] || p2Value[fName]) + (p2Value[fName] || p1Value[fName])) / 2;
                } else {
                    resultPower[fName] = operatorFn(p1Value[fName], p2Value[fName]);
                }
            } else if (typeof (resultPower[fName]) === 'boolean') {
                resultPower[fName] = p1Value[fName] || p2Value[fName];
            } else if (typeof (resultPower[fName]) === 'string') {
                resultPower[fName] = (p1Value[fName] || exp.p1) + ' ' + exp.op + ' ' + (p2Value[fName] || exp.p2);
            }
        }

        return resultPower;

    };

    this.createEmpyPowerDataObj = function () {
        let obj = {
            available: false,
            currentA: 0,
            dailyEnergyWh: 0,
            deviceID: null,
            energyWh: 0,
            lastUpdate: 0,
            monthlyEnergyWh: 0,
            offlineDevices: 0,
            onlineDevices: 0,
            powerName: "",
            powerType: null,
            powerW: 0,
            ratedPowerW: 0,
            serialNumber: null,
            voltageV: 0,
            weeklyEnergyWh: 0,
            yearlyEnergyWh: 0
        };
        return obj;
    };

    this.calcExpresionPowers = function () {
        for (var pName in this.calcPowerList) {
            let p = this.calcPowerList[pName];
            if (p.expression) {
                p.data = this.calcExpresionRecursive(JSON.parse(p.expression));
                p.data.powerName = pName;
            }
        }
    };

    this.calcPowerTypes = function () {
        for (var pType in this.powerTypeList) {
            let type = this.powerTypeList[pType];
            type.data = this.createEmpyPowerDataObj();

            for (var i in type.pList) {
                let pName = type.pList[i];
                let p = this.powerList[pName] || this.calcPowerList[pName] || null;
                if (p) {
                    type.available = type.available || p.data.available;
                    for (var dataField in type.data) {
                        if (typeof (type.data[dataField]) === 'number') {
                            if (dataField === 'voltageV') {
                                type.data[dataField] = ((type.data[dataField] || p.data[dataField]) + (p.data[dataField] || type.data[dataField])) / 2;
                            } else {
                                type.data[dataField] += p.data[dataField];
                            }
                        } else if (typeof (type.data[dataField]) === 'boolean') {
                            type.data[dataField] = type.data[dataField] || p.data[dataField];
                        } else if (typeof (type.data[dataField]) === 'string') {
                            type.data[dataField] = type.data[dataField] + ' ' + p.data[dataField];
                        }
                    }
                }
            }
        }
    };

    this.checkTimeout = function (timeout) {
        let cTime = new Date().getTime();
        for (var pName in this.powerList) {
            let power = this.powerList[pName];
            if (cTime - power.lastUpdate > this.powerTimeout) {
                if (power.available) {
                    power.available = false;
                    this.execCallback(this.onPowerTimeoutCall, pName, power.data, power.lastUpdate);
                }
            }
        }
    };

    this.requestBc = function () {
        let initTimer = this.timerRequestInitId;
        if (this.requestBcInitFail >= 10) {
            window.clearInterval(initTimer);
        } else {
            this.requestBcInitFail++;
        }

        var dSer = this.config.loggerSerial || 0;
        var dMod = this.config.powerServiceModel;
        var message = wsm.emptyMessage;
        message.devSerialNumber = dSer;
        message.instr = "broadcastRequest";
        message.devModelId = dMod;
        wsm.sendDevMsg(message,
                function (successMessage) {
                    this.requestBcInitFail = 10;
                    window.clearInterval(initTimer);
//                    console.log("onSuccess: ");
                },
                function (errorMessage) {
                    console.log("PowerServiceManager BC Request onError: " + errorMessage.response.faultMsg);
                },
                function () {
                    console.log("PowerServiceManager BC Request Timeout: ");
                }
        );
    };

    this.onPowerDataUpdateAllCall = [];
    this.onPowerDataUpdateAll = function (callback) {
        if (isFunction(callback)) {
            this.onPowerDataUpdateAllCall.push(callback);
        }
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
    this.onPowerTimeoutCall = [];
    this.onPowerTimeout = function (callback) {
        if (isFunction(callback)) {
            this.onPowerTimeoutCall.push(callback);
        }
    };
    this.onPowerReconnectCall = [];
    this.onPowerReconnect = function (callback) {
        if (isFunction(callback)) {
            this.onPowerReconnectCall.push(callback);
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
    }
    ;
}

PSManager.prototype.onMessage = function (message) {
    let cTime = new Date().getTime();
    if (message.messageList !== undefined) {
        for (var i = 0; i < message.messageList.length; i++) {
            let p = message.messageList[i];
            if (p.powerName) {

                if (psManager.powerList[p.powerName] === undefined) {
                    psManager.powerList[p.powerName] = {};
                    psManager.powerList[p.powerName].calculated = false;

                }
                psManager.powerList[p.powerName].lastUpdate = cTime;
                if (psManager.powerList[p.powerName].available === false) {
                    psManager.execCallback(psManager.onPowerReconnectCall, p.powerName, message.messageList[i]);
                }
                psManager.powerList[p.powerName].available = true;
                psManager.powerList[p.powerName].data = message.messageList[i];
//                console.log(es);
            }
        }
        psManager.calcExpresionPowers();
        psManager.calcPowerTypes();
        psManager.execCallback(psManager.onDataReceivedCall, message.messageList);

//        let allPowerArr = [];
//        for (var pName in psManager.powerList) {
//            try {
//                allPowerArr.push(psManager.powerList[pName].data);
//            } catch (e) {
//            }
//        }
//        for (var calcPName in psManager.calcPowerList) {
//            try {
//                allPowerArr.push(psManager.calcPowerList[calcPName].data);
//            } catch (e) {
//            }
//        }
        let allPowerArr = {};
        for (var pName in psManager.powerList) {
            try {
                allPowerArr[pName] = psManager.powerList[pName].data;
            } catch (e) {
            }
        }
        for (var calcPName in psManager.calcPowerList) {
            try {
                allPowerArr[calcPName] = psManager.calcPowerList[calcPName].data;
            } catch (e) {
            }
        }
        psManager.execCallback(psManager.onPowerDataUpdateAllCall, allPowerArr);

    }
};

PSManager.prototype.onOpen = function (message) {
    console.log('PowerServiceManager WS Open.');
    psManager.execCallback(psManager.onWsOpen, message.messageList);
};
PSManager.prototype.onClose = function (message) {
    console.log('PowerServiceManager WS Close.');
    psManager.execCallback(psManager.onWsClose, message.messageList);
};
PSManager.prototype.onError = function (message) {
    console.log('PowerServiceManager On Error.');
    psManager.execCallback(psManager.onWsError, message.messageList);
};


//get power types
PSManager.prototype.getGridImportPower = function () {
    if (psManager.powerTypeList["GRID OUT"] !== undefined && psManager.powerTypeList["GRID OUT"].data !== undefined) {
        return psManager.powerTypeList["GRID OUT"].data;
    }
    return null;
};
PSManager.prototype.getGridExportPower = function () {
    if (psManager.powerTypeList["GRID IN"] !== undefined && psManager.powerTypeList["GRID IN"].data !== undefined) {
        return psManager.powerTypeList["GRID IN"].data;
    }
    return null;
};
PSManager.prototype.getGenImportPower = function () {
    if (psManager.powerTypeList["GEN IMPORT"] !== undefined && psManager.powerTypeList["GEN IMPORT"].data !== undefined) {
        return psManager.powerTypeList["GEN IMPORT"].data;
    }
    return null;
};
PSManager.prototype.getGenExportPower = function () {
    if (psManager.powerTypeList["GEN EXPORT"] !== undefined && psManager.powerTypeList["GEN EXPORT"].data !== undefined) {
        return psManager.powerTypeList["GEN EXPORT"].data;
    }
    return null;
};
PSManager.prototype.getLoadPower = function () {
    if (psManager.powerTypeList["CONSUMERS"] !== undefined && psManager.powerTypeList["CONSUMERS"].data !== undefined) {
        return psManager.powerTypeList["CONSUMERS"].data;
    }
    return null;
};
PSManager.prototype.getOtherPower = function () {
    if (psManager.powerTypeList["OTHER"] !== undefined && psManager.powerTypeList["OTHER"].data !== undefined) {
        return psManager.powerTypeList["OTHER"].data;
    }
    return null;
};
PSManager.prototype.getPVPower = function () {
    if (psManager.powerTypeList["PV"] !== undefined && psManager.powerTypeList["PV"].data !== undefined) {
        return psManager.powerTypeList["PV"].data;
    }
    return null;
};
PSManager.prototype.getStorageChargePower = function () {
    if (psManager.powerTypeList["STORAGE CHARGE"] !== undefined && psManager.powerTypeList["STORAGE CHARGE"].data !== undefined) {
        return psManager.powerTypeList["STORAGE CHARGE"].data;
    }
    return null;
};
PSManager.prototype.getStorageDischargePower = function () {
    if (psManager.powerTypeList["STORAGE DISCHARGE"] !== undefined && psManager.powerTypeList["STORAGE DISCHARGE"].data !== undefined) {
        return psManager.powerTypeList["STORAGE DISCHARGE"].data;
    }
    return null;
};

window.psManager = new PSManager();

$(document).ready(function () {
//    psManager.init();
    psManagerInitRequest();
});

// to attach listener
//esManager.onDataReceived(function (data) {
//    console.log(data);
//});
