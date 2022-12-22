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
        this.initLoggerPowerTypes();


        wsm.onMessageDevBroadcast = {fn: this.onMessage, devModelId: this.config.powerServiceModel};
    };

    this.initPowerTypes = function () {
        if (this.config.powerTypes) {
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
        }
    };

    this.initLoggerPowerTypes = function () {
        if (this.config.loggerPowerTypes) {
            for (var i in this.config.loggerPowerTypes) {
                let power;
                let powerType = this.config.loggerPowerTypes[i];
                if (!this.powerTypeList[powerType.powerType]) {
                    power = {};
                    power.available = false;
                    power.calculated = true;
                    power.lastUpdate = 0;
                    power.data = this.createEmpyPowerDataObj();
                    power.pList = [];
                } else {
                    power = this.powerTypeList[powerType.powerType];
                }
                power.pList.push(powerType.powerName);
                this.powerTypeList[powerType.powerType] = power;
                power.typeAvailable = power.pList.length > 0;
            }
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

    this.calcExpresion = function (exp, data, sufix) {
        sufix = sufix || "";
        if ((!exp || !data) && exp !== 0)
            return null;

        if (typeof (exp) === 'object') {
            let operatorFn = this.getMathFunction(exp.op);
            let p1 = this.calcExpresion(exp.p1, data, sufix);
            let p2 = this.calcExpresion(exp.p2, data, sufix);
            let powerType = this.calcExpresion(exp.powerType, data, sufix);

            if (Array.isArray(p1)) {
                let result = new Array(p1.length);
                if (Array.isArray(p2)) {
                    for (let i = 0; i < p1.length; i++) {
                        result[i] = operatorFn(p1[i], p2[i]);
                    }
                    return result;
                }
                // p2 is not an array
                for (let i = 0; i < p1.length; i++) {
                    result[i] = operatorFn(p1[i], p2);
                }
                return result;
            }
            if (Array.isArray(p2)) {
                let result = new Array(p2.length);
                for (let i = 0; i < p2.length; i++) {
                    result[i] = operatorFn(p1, p2[i]);
                }
                return result;
            }
            return p1 !== null && p2 !== null ? operatorFn(p1, p2) : null;
        }

        if (typeof (exp) === 'number') {
            return exp;
        }
        if (typeof (exp) === 'string' && data[exp + sufix] !== undefined) {
            return data[exp + sufix];
        }
        return null;
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
                try {
                    p.data = this.calcExpresionRecursive(JSON.parse(p.expression));
                    p.data.powerName = pName;
                } catch (e) {
                }
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
                    let message = errorMessage.response ? errorMessage.response.faultMsg : JSON.stringify(errorMessage);
                    console.log("PowerServiceManager BC Request onError: " + message);
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
    if (psManager.powerTypeList["gridConsume"] !== undefined && psManager.powerTypeList["gridConsume"].data !== undefined) {
        return psManager.powerTypeList["gridConsume"].data;
    }
    return null;
};
PSManager.prototype.getGridExportPower = function () {
    if (psManager.powerTypeList["gridFeed"] !== undefined && psManager.powerTypeList["gridFeed"].data !== undefined) {
        return psManager.powerTypeList["gridFeed"].data;
    }
    return null;
};
PSManager.prototype.getGenPower = function () {
    if (psManager.powerTypeList["gen"] !== undefined && psManager.powerTypeList["gen"].data !== undefined) {
        return psManager.powerTypeList["gen"].data;
    }
    return null;
};
PSManager.prototype.getLoadPower = function () {
    if (psManager.powerTypeList["load"] !== undefined && psManager.powerTypeList["load"].data !== undefined) {
        return psManager.powerTypeList["load"].data;
    }
    return null;
};
PSManager.prototype.getLoadImportPower = function () {
    if (psManager.powerTypeList["loadImport"] !== undefined && psManager.powerTypeList["loadImport"].data !== undefined) {
        return psManager.powerTypeList["loadImport"].data;
    }
    return null;
};
PSManager.prototype.getOtherPower = function () {
    if (psManager.powerTypeList["other"] !== undefined && psManager.powerTypeList["other"].data !== undefined) {
        return psManager.powerTypeList["other"].data;
    }
    return null;
};
PSManager.prototype.getPVPower = function () {
    if (psManager.powerTypeList["pv"] !== undefined && psManager.powerTypeList["pv"].data !== undefined) {
        return psManager.powerTypeList["pv"].data;
    }
    return null;
};
PSManager.prototype.getStorageChargePower = function () {
    if (psManager.powerTypeList["stCharge"] !== undefined && psManager.powerTypeList["stCharge"].data !== undefined) {
        return psManager.powerTypeList["stCharge"].data;
    }
    return null;
};
PSManager.prototype.getStorageDischargePower = function () {
    if (psManager.powerTypeList["stDischarge"] !== undefined && psManager.powerTypeList["stDischarge"].data !== undefined) {
        return psManager.powerTypeList["stDischarge"].data;
    }
    return null;
};

PSManager.prototype.getPowersForAnim = function () {

    /*Calculates where powers are going, depending on powersConf*/

    //Adding storage from esManager to powerTypeList
    let powerTypeList = clone(psManager.powerTypeList);
    let esStorage = clone(esManager.getSumData());
    if (esStorage.powerW > 0) {
        if (!powerTypeList['stCharge']) {
            powerTypeList['stCharge'] = {};
            powerTypeList['stCharge'].data = esStorage;
        }
    } else {
        if (!powerTypeList['stDischarge']) {
            powerTypeList['stDischarge'] = {};
            powerTypeList['stDischarge'].data = esStorage;
        }
    }
    
    if(powerTypeList['stDischarge'] && powerTypeList['stCharge']){
        if(powerTypeList['stCharge'].data.powerW > powerTypeList['stDischarge'].data.powerW){
            powerTypeList['stCharge'].data = esStorage;
            powerTypeList['stDischarge'].data.powerW = 0;
        }else{
            powerTypeList['stDischarge'].data = esStorage;
            powerTypeList['stCharge'].data.powerW = 0;
        }
    }

    let powersConf = {
        pv: {
            powersIn: [],
            reqPower: null
        },
        load: {
            /**powersIn are powers that can go to this group.
             **reqPower, or required power, is power that is measured and sets the max of total of other powers that come to the destination.
             *For example, if load in psManager is 0, powers that are in powersIn will go somewhere else*/
            powersIn: {'storageToLoadPower': 'stDischarge', 'genToLoadPower': 'gen', 'pvToLoadPower': 'pv', 'gridToLoadPower': 'gridConsume'},
            reqPower: 'load'
        },
        storage: {
            powersIn: {'pvToStoragePower': 'pv', 'gridToStoragePower': 'gridConsume', 'genToStoragePower': 'gen'},
            reqPower: 'stCharge'
        },
        grid: {
            powersIn: {'pvToGridPower': 'pv', 'storageToGridPower': 'stDischarge'},
            reqPower: 'gridFeed'
        },
        gen: {
            powersIn: [],
            reqPower: null
        }
    };

    let result = {};


    //objects to keep track of powers and where they are going.
    let remPower = {};
    let reqPower = {};

    for (let pConf in powersConf) {

        if (!result[pConf]) {
            result[pConf] = {};
        }

        for (var powerName in powersConf[pConf].powersIn) {

            let powerIn = powersConf[pConf].powersIn[powerName];
            if (!result[pConf] && result[pConf] !== 0) {
                result[pConf] = {};
            }
            if (powerTypeList[powerIn] && (powerTypeList[powerIn].data.available)) {

                let power = powerTypeList[powerIn].data.powerW;

                if (!remPower[powerIn] && remPower[powerIn] !== 0) {
                    if (power < 0) {
                        power = -power;
                    }
                    remPower[powerIn] = power;
                }
                let reqPowerName = powersConf[pConf].reqPower;

                if (reqPowerName && !reqPower[reqPowerName] && reqPower[reqPowerName] !== 0) {
                    if (powerTypeList[reqPowerName]) {
                        reqPower[reqPowerName] = powerTypeList[reqPowerName].data.powerW;
                        if (reqPower[reqPowerName] < 0) {
                            reqPower[reqPowerName] = -reqPower[reqPowerName];
                        }
                    } else {
                        reqPower[reqPowerName] = 0;
                    }
                }

                if (reqPower[reqPowerName]) {
                    if (reqPower[reqPowerName] < remPower[powerIn]) {
                        result[pConf][powerName] = reqPower[reqPowerName];
                        remPower[powerIn] -= reqPower[reqPowerName];
                        reqPower[reqPowerName] = 0;
                    } else if (reqPower[reqPowerName] > 0) {
                        result[pConf][powerName] = remPower[powerIn];
                        reqPower[reqPowerName] -= remPower[powerIn];
                        remPower[powerIn] = 0;
                    }
                } else {
                    result[pConf][powerName] = 0;
                }
            }
        }
    }
    
    result.remainingPowers = remPower;
    result.requiredPowers = reqPower;

    let data = {};

    /*serviceData is data from psManager and esManager
     * outputData is data calculated in this function*/
    data.serviceData = {};
    data.outputData = result;

    data.serviceData.gen = psManager.getGenPower();
    data.serviceData.gridFeed = psManager.getGridExportPower();
    data.serviceData.gridConsume = psManager.getGridImportPower();
    data.serviceData.load = psManager.getLoadPower();
    data.serviceData.pv = psManager.getPVPower();
    data.serviceData.other = psManager.getOtherPower();
    data.serviceData.storage = esStorage;

    return data;
};



window.psManager = new PSManager();

$(document).ready(function () {
//    psManager.init();
    psManagerInitRequest();
}
);

// to attach listener
//esManager.onDataReceived(function (data) {
//    console.log(data);
//});
