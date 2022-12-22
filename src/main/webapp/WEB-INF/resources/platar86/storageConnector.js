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


var storageCon = {

    callbackFn: null,
    selectedCallbackFn: null,
    dataExtractFn: null,
    onDevConnConnectFn: null,
    onDevConnDropFn: null,
    obroadcastRequestFn: function () {},
    onStatusChangeCallbackFn: null,
    timeoutInterval: 5 * 1000,
    bcTimer: null,
    timer: null,
    status: false,
    devStatusArr: [],
    timerReset: function (devState) {
        var id = devState.deviceID;
        var timerId = devState.timerID;
//        console.log('TIMER RESET ' + id + ' id: ' + timerId);
        window.clearTimeout(timerId);
        var newTimer = window.setTimeout(storageCon.generateTimerCallbackFn(id), storageCon.timeoutInterval);
        devState.timerID = newTimer;
    },
    timerStop: function (devID) {
        var devState = storageCon.getDevStat(devID);
        window.clearTimeout(devState.timerID);
//        console.log('TIMER STOPED ' + devID);
    },
    timerCallback: function (devID) {
//        console.log('TIMEOUT ' + devID);
        var devState = storageCon.getDevStat(devID);
        devState.status = false;
        storageCon.onStatusChangeCallbackFn(devID, false);
        var selectedID = storageCon.selectedID;
        if (selectedID === devID) {
            storageCon.onDevConnDropFn();
        }
        storageCon.timerStop(devID);
    },
    onMessage: function (data) {
        if (storageCon.dataExtractFn !== undefined && storageCon.dataExtractFn !== null) {
            var arr = storageCon.dataExtractFn(data);
            if (arr !== undefined) {
                var selectedID = storageCon.selectedID;
                //check for offline bmss
                for (var i = 0; i < arr.length; i++) {
                    var dataFormated = arr[i];
                    if (dataFormated.deviceID === selectedID) {
                        storageCon.selectedCallbackFn(dataFormated);
                    }

                    var devState = storageCon.getDevStat(dataFormated.deviceID);
                    if (devState !== undefined) {
                        if (!devState.status) {
                            storageCon.onStatusChangeCallbackFn(devState.deviceID, true);
//                            var selectedID = Number(logCon.getSelectedIDFn());
                            if (selectedID === devState.deviceID) {
                                storageCon.onDevConnConnectFn();
                            }
                            devState.status = true;
                        }
                        if (devState.selectionChanged) {
                            devState.selectionChanged = false;
                            storageCon.onDevConnConnectFn();
                        }
                        storageCon.timerReset(devState);
                    }
                }
                storageCon.callbackFn(arr);
            }
        }
    },
    onOpen: function (data) {
        console.log("onOpen " + data);
    },
    onClose: function (data) {
//        .selectionChanged
        storageCon.onDevConnDropFn();
//        console.log("onClose " + data);
    },
    onError: function (data) {
        storageCon.onDevConnDropFn();
//        console.log("onError " + data);
    },
    onSelectedChanged: function () {

        storageCon.onDevConnDropFn();
    },
    init: function (idArr, selected, bcInterval, timeOut) {
        idArr = JSON.parse(idArr);
        storageCon.onDevConnDropFn();
        storageCon.timeoutInterval = timeOut || 4000;
        storageCon.bcTimer = setInterval(storageCon.obroadcastRequestFn, bcInterval);
        for (i = 0; i < idArr.length; i++) {

            var id = idArr[i];
            var timer = setTimeout(storageCon.generateTimerCallbackFn(id), storageCon.timeoutInterval);
            storageCon.devStatusArr.push(
                    {
                        deviceID: id,
                        status: false,
                        selectionChanged: false,
                        timerID: timer
                    });
        }
        storageCon.selectionChange(selected);

        mainUtils.callbackFn = storageCon.onLoggerStateChange;
    },
    selectionChange: function (id) {
        for (i = 0; i < storageCon.devStatusArr.length; i++) {
            if (storageCon.devStatusArr[i].deviceID === id) {
                storageCon.devStatusArr[i].selectionChanged = true;
            }
        }
        storageCon.selectedID = Number(id);
        if (storageCon.onDevConnDropFn !== undefined) {
            storageCon.onDevConnDropFn();
        }
    },
    getDevStat: function (id) {
        for (i = 0; i < storageCon.devStatusArr.length; i++) {
            if (storageCon.devStatusArr[i].deviceID === id) {
                return storageCon.devStatusArr[i];
            }
        }
    },
    onLoggerStateChange: function (state) {
//        var g = PF('growlWG');
        mainUtils.onStatusChange(state);
        if (!state) {
            storageCon.onDevConnDropFn();
            for (i = 0; i < storageCon.devStatusArr.length; i++) {
                var id = storageCon.devStatusArr[i].deviceID;
                storageCon.devStatusArr[i].status = false;
                storageCon.onStatusChangeCallbackFn(id, false);
            }
        } else {
            storageCon.obroadcastRequestFn();
        }
        console.log('state changed: ' + state);
    },
    generateTimerCallbackFn: function (deviceID) {
        var m = deviceID;
        return function () {
            var id = m;
            storageCon.timerCallback(id);
        };
    }
};