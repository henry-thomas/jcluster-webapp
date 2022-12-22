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


/* global mainUtils, energyUsage, envB, dashMan, wsm */

function PowerType(typeName) {
    this.sumData = {};
    this.dataAvailable = false;
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

var onPowerTimeout = function (pName) {
    console.log("pTimeout");
};


function initPEConfig(config) {
    var congArr = JSON.parse(config);
    if (congArr.powerServiceDeviceList !== undefined) {
//        dashMan.initDevList(congArr.powerServiceDeviceList);
    }
    if (congArr.eStorageDeviceListList !== undefined) {
//        dashMan.initDevList(congArr.eStorageDeviceListList);
    }
    if (congArr.powerTypes !== undefined) {
//        dashMan.initPowerTypes(congArr.powerTypes);
    }
    if (congArr.electricityTariff !== undefined) {
        dashMan.electricityTariff = congArr.electricityTariff;
    } else {
        dashMan.electricityTariff = 0;
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
        delete dashMan.eStorageArr.dataArr[storageName];
        dashMan.eStorageArr.dataAvailable = false;
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
