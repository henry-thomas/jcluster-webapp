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


/* global mainUtils, energyUsage, envB */

function PowerType(typeName) {
    this.powerTypeArr = {};
    this.dataArr = {};
    this.sumData = {};
    this.dataAvailable = false;
    this.dataAvailableCallComplete = false;
    this.typeName = typeName;

    /* List of functions that will be called later through its own execCallback function */
    this.onPowerInitCall = [];
    this.onPowerInit = function (callback) {
        if (isFunction(callback)) {
            this.onPowerInitCall.push(callback);
        }
    };

}

PowerType.prototype.isTypeOfPower = function (powerName) {
    for (var pName in this.powerTypeArr) {
        if (powerName === this.powerTypeArr[pName]) {
            return true;
        }
    }
    return false;
};

PowerType.prototype.initPowerList = function (powerList) {
    for (var item in powerList) {
        this.powerTypeArr[item] = powerList[item];
    }
};

/*
 * Required for calling the list of functions that should be called later 
 */
PowerType.prototype.execCallback = function (fnArr) {
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

PowerType.prototype.insertDataObj = function (powerData) {
    if (this.isTypeOfPower(powerData.powerName)) {
        this.dataArr[powerData.powerName] = powerData;
        this.dataAvailable = true;
    }
};

PowerType.prototype.calcSumData = function () {


    let callInitFlag = false;
    this.sumData = {};
    var d = this.sumData;
    d.currentA = 0;
    d.dailyEnergyWh = 0;
    d.energyWh = 0;
    d.monthlyEnergyWh = 0;
    d.powerW = 0;
    d.ratedPowerW = 0;
    d.voltageV = 0;
    d.weeklyEnergyWh = 0;
    d.yearlyEnergyWh = 0;
    d.available = false;
    if (this.dataAvailable) {
        for (var item in this.dataArr) {
            var pData = this.dataArr[item];
            if (d.available === false && pData.available) {
                d.available = true;
                if (this.dataAvailableCallComplete === false) {
                    callInitFlag = true;
                }
            }
            d.currentA += pData.currentA;
            d.dailyEnergyWh += pData.dailyEnergyWh;
            d.energyWh += pData.energyWh;
            d.monthlyEnergyWh += pData.monthlyEnergyWh;
            d.powerW += pData.powerW;
            d.ratedPowerW += pData.ratedPowerW;
            d.voltageV += pData.voltageV;
            if (d.voltageV !== undefined && d.voltageV > 0) {
                d.voltageV /= 2;
            }
            d.weeklyEnergyWh += pData.weeklyEnergyWh;
            d.yearlyEnergyWh += pData.yearlyEnergyWh;
        }

        if (callInitFlag) {
            this.dataAvailableCallComplete = true;
           

            // Calling the previosly provided functions with the following defined parameters
            this.execCallback(this.onPowerInitCall, this.typeName, this.sumData);
        }
    }
};

function DashboardManager() {
    this.storageInitCompleted = false;

    this.onPowerReceivedCall = [];
    this.onPowerReceived = function (callback) {
        if (isFunction(callback)) {
            this.onPowerReceivedCall.push(callback);
        }
    };
    this.onPowerInitCall = [];
    this.onPowerInit = function (callback) {
        if (isFunction(callback)) {
            this.onPowerInitCall.push(callback);
        }
    };
    this.onStorageInitCall = [];
    this.onStorageInit = function (callback) {
        if (isFunction(callback)) {
            this.onStorageInitCall.push(callback);
        }
    };
    this.onStorageReceivedCall = [];
    this.onStorageReceived = function (callback) {
        if (isFunction(callback)) {
            this.onStorageReceivedCall.push(callback);
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
    this.initFlags = {
        initPServiceBc: false,
        initESServiceBc: false
    };
    this.powerServiceDevList = {};
    this.eStorageServiceDevList = {};

    this.eStorageArr = {
        dataArr: {},
        sumData: {},
        dataAvailable: false
    };
    this.powerTypes = {};

    this.initPowerTypes = function (typeList) {
        for (var item in typeList) {
            var t = new PowerType(item);
            t.initPowerList(typeList[item]);
            this.powerTypes[item] = t;
        }
        this.execCallback(this.onPowerInitCall, this, typeList);
    };

    this.initDevList = function (arr) {
        for (var item in arr) {
            var dev = arr[item];
            var serialNumber = arr[item].serialNumber;
            if (serialNumber !== undefined) {
                if (this.eStorageServiceDevList[serialNumber] !== undefined) {
                    console.log('Try to insert dublicate serial number: ' + serialNumber);
                    return;
                }
                var object = new SubDevice(dev, window.devTimeoutCallback, 15000);
                if (object.modelID === 12) {
                    this.powerServiceDevList[serialNumber] = object;
                    if (this.initFlags.initPServiceBc === false) {
                        this.initFlags.initPServiceBc = true;
//                        window.setInterval(window.requestPowerServiceBroadcast, 20000);
//                        window.requestPowerServiceBroadcast();
                    }
                } else if (object.modelID === 11) {
                    this.eStorageServiceDevList[serialNumber] = object;
                    if (this.initFlags.initESServiceBc === false) {
                        // to attach listener
                        esManager.onDataReceived(this.onDataEStorageMessage);
                    }
                } else {
                    console.log('Not supported device: ' + object);
                }
            }
        }
    };

    this.insertPowerData = function (powerName, powerData) {
        for (var pType in this.powerTypes) {
            var type = this.powerTypes[pType];
            if (type.isTypeOfPower(powerName)) {
                type.insertDataObj(powerData);
            }
        }
    };
    this.insertEStorageData = function (storageName, storageData) {
        this.eStorageArr.dataArr[storageName] = storageData;
        this.eStorageArr.dataAvailable = true;
    };
    
    this.updateComponent = function () {
//        console.log('this.updateComponent = function () ');

        for (var pType in this.powerTypes) {
            var type = this.powerTypes[pType];
            type.calcSumData();
        }



        if (envB !== undefined) {
            dm.powerTypes.PV.ss = 0;
            envB.pvValues = dm.powerTypes.PV;
            envB.dataChange();
        }
        if (energyUsage !== undefined) {
            energyUsage.powers = dm.powerTypes;
            energyUsage.dataChange();
        }


        if (this.eStorageArr.dataAvailable === true) {
            var s = this.eStorageArr.sumData;
            s.capacityAh = 0;
            s.capacityP = 0;
            s.currentA = 0;
            s.powerW = 0;
            s.ratedCapacityAh = 0;
            s.ratedChargeCurrentC = 0;
            s.ratedDischargeCurrentC = 0;
            s.reatedChargePowerW = 0;
            s.reatedDischargePowerW = 0;
            s.ratedVoltageV = 0;
            s.voltageV = 0;
            s.remainingTimeSign = 0;

            var stCount = 0;
//            console.log('data arr' + this.eStorageArr.dataArr);
            for (var st in this.eStorageArr.dataArr) {
                stCount++;
                var storage = this.eStorageArr.dataArr[st];
                s.capacityAh += storage.capacityAh;
                s.capacityP += storage.capacityP;
                s.currentA += storage.currentA;
                s.powerW += storage.powerW;
                s.ratedCapacityAh += storage.ratedCapacityAh;
                s.ratedChargeCurrentC += storage.ratedChargeCurrentC;
                s.ratedDischargeCurrentC += storage.ratedDischargeCurrentC;
                s.ratedVoltageV += storage.ratedVoltageV;
                s.voltageV += storage.voltageV;
                if (storage.remainingTimeSign) {
                    s.remainingTimeSign += storage.remainingTimeSign;
                }
                s.voltageV += storage.voltageV;
                s.reatedChargePowerW += storage.voltageV * (storage.ratedChargeCurrentC * storage.ratedCapacityAh);
                s.reatedDischargePowerW += storage.voltageV * (storage.ratedDischargeCurrentC * storage.ratedCapacityAh);
            }
            if (stCount > 1) {
                s.remainingTimeSign |= s.remainingTimeSign / stCount;
                s.voltageV |= s.voltageV / stCount;
                s.ratedVoltageV |= s.ratedVoltageV / stCount;
//            console.log('Div: ' + s.capacityP + ' / ' + stCount);
                s.capacityP = s.capacityP / stCount;
//            console.log('Result: ' + s.capacityP);
            }


        }

    };
    
    this.getPowerDataByType = function (typeName) {
        if (this.powerTypes[typeName] !== undefined) {
            return this.powerTypes[typeName];
        }
        return  new PowerType(typeName);
    };
    this.getPowerLoad = function () {
        return  this.getPowerDataByType('CONSUMERS');
    };
    this.getPowerGridIn = function () {
        return  this.getPowerDataByType('GRID IN');
    };
    this.getPowerGridOut = function () {
        return  this.getPowerDataByType('GRID OUT');
    };
    this.getPowerOther = function () {
        return  this.getPowerDataByType('OTHER');
    };
    this.getPowerPv = function () {
        return  this.getPowerDataByType('PV');
    };
    this.getPowerStorageCharge = function () {
        return  this.getPowerDataByType('STORAGE CHARGE');
    };
    this.getPowerStorageDischarge = function () {
        return  this.getPowerDataByType('STORAGE DISCHARGE');
    };
}

var dm = new DashboardManager();
console.log('InitDM');



var onPowerTimeout = function (pName) {
    console.log("pTimeout");
};


function initPEConfig(config) {
    var congArr = JSON.parse(config);
    if (congArr.powerServiceDeviceList !== undefined) {
        dm.initDevList(congArr.powerServiceDeviceList);
    }
    if (congArr.eStorageDeviceListList !== undefined) {
        dm.initDevList(congArr.eStorageDeviceListList);
    }
    if (congArr.powerTypes !== undefined) {
        dm.initPowerTypes(congArr.powerTypes);
    }
    if (congArr.electricityTariff !== undefined) {
        dm.electricityTariff = congArr.electricityTariff;
    } else {
        dm.electricityTariff = 0;
    }
}

function dashboardLoggerStateChangeCb(state) {
    console.log('new state');
}

$(document).ready(function () {
    //  
    initConfigJs();
    wsm.onLoggerStatusChange = function (state) {
        dashboardLoggerStateChangeCb(state);
    };
//    mainUtils.addLoggerStateChangeCallback(function (state) {
//        dashboardLoggerStateChangeCb(state);
//    });

    esManager.onStorageTimeout(function (storageName, data, lastSeen) {
        delete dm.eStorageArr.dataArr[storageName];
        dm.eStorageArr.dataAvailable = false;
    });
    // Receiving Data from the Energy Storage Service Manager

    esManager.onDataReceived(function (messageList) {
        for (var item in messageList) {
            var obj = messageList[item];
            var sName = obj.storageName;
            if (sName !== undefined) {
                dm.insertEStorageData(sName, obj);
            }
        }

        // Initializing/Updating Power Type Components Data
        dm.updateComponent();

        // Initializing Storage Components Data
        if (dm.storageInitCompleted === false) {
            dm.storageInitCompleted = true;
            dm.execCallback(dm.onStorageInitCall, dm);
        }

        dm.execCallback(dm.onStorageReceivedCall, dm);
    });

//    psManager.onStorageTimeout(function (storageName, data, lastSeen) {
//        delete   dm.eStorageArr.dataArr[storageName];
//        dm.eStorageArr.dataAvailable = false;
////        console.log(storageName + ' OFFLINE');
//    });
    // Receiving Data from the Power Type Service Manager
    psManager.onDataReceived(function (messageList) {
//        console.log('psManager.onDataReceived(');
        if (messageList.length > 0) {
            for (var item in messageList) {
                var obj = messageList[item];
                var pName = obj.powerName;
                if (pName !== undefined) {
                    dm.insertPowerData(pName, obj);
                }
            }

        } else {
            if (window.onEmptyEStorageReceivedCb !== undefined) {
                window.onEmptyEStorageReceivedCb();
            }
        }

        // Initializing/Updating Power Type Components Data
        dm.updateComponent();
        dm.execCallback(dm.onPowerReceivedCall, dm);
    });
});

function updateConfigMap(map) {
    console.log(map);
}

var dashboardIconStateChange = function (wgName) {
    var el = PF(wgName);
//    console.log(wgName);
};

// to attach listener

var eStorageTemp = {
    avrgCurrent: [],
    calcAvrgCurrent: function (powerW, ratedPowerWh) {
        var arr = this.avrgCurrent;
        if (arr.length > 50) {
            arr.pop();
        }
        arr.unshift(powerW);
        var total = 0;
        for (var i = 0; i < arr.length; i++) {
            total += arr[i];
        }
        var avrgPowerW = total / arr.length;
        var remainingTimeSeconds = (ratedPowerWh / avrgPowerW) * 3600;
        if (remainingTimeSeconds < 0) {
            remainingTimeSeconds *= -1;
        }
        return this.getTimeFromSeconds(remainingTimeSeconds);
    },

    getTimeFromSeconds: function (tSec) {
        if (tSec === 0) {
            return '---';
        }
        var days = parseInt(tSec / (3600 * 24));
        if (days > 0) {
            tSec = tSec - (days * 3600 * 24);
        } else {
            days = '--';
        }
        var hour = parseInt(tSec / (3600));
        if (hour > 0) {
            tSec = tSec - (hour * 3600);
        }
        if (hour < 10) {
            hour = '0' + hour;
        }
        var min = parseInt(tSec / (60));
        if (min < 10) {
            min = '0' + min;
        }
        return days + 'd  ' + hour + 'h:' + min + 'm';
    }
};
