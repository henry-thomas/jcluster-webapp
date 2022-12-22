/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2022
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */

/* global hhContentBuilder, hh, mainUtils, wsm, dm, winUxrGui, winUxrData, lc */
winlineUxr = {};

(function (root) {
    let WinUxrData = function () {
        this.isInit = false;
    };

    let prot = WinUxrData.prototype;

    prot.updateData = function (dev, data) {
//        if (!this.isInit) {
//            for (var item in data) {
//                if (!winUxrGui.dataFields[item]) {
//                    winUxrGui.dataFields[item] = hh.adf(winUxrGui.todoCard, item, null, {decimal: 2});
//                }
//            }
//        }
        this.isInit = true;
        hh.updateAdfFromObject(winUxrGui.dataFields, data, true);
        hh.updateAdfFromObject(winUxrGui.dataFields, data.chargePower, true);
        hh.updateAdfFromObject(winUxrGui.dataFields, dev, true);

        if (allowRecordings) {
            recordData(recValues);
        }
    };



    root.winUxrData = new WinUxrData();

})(window);

winlineUxr.testInst = function (instr, isPTP, msgType, valueType, data, dtype) {
//    {srcAddr:240, dstAddr: 4, isPTP: false, valueType: }
    let msg = {instrExt: instr};
//    msg.srcAddr = srcAddr;
//    msg.dstAddr = dstAddr;

    msg.msgType = msgType;
    msg.isPTP = isPTP;
    msg.valueType = valueType;
    if (dtype) {
        msg.dtype = dtype;
    }
    msg.data = data;

    wsm.sendDevMsgExecWithJsonInst(
            msg,
            function (message, response) {
                console.log("Result: ", response);
            },
            function (message, error) {
                console.warn("Response Error: " + error);
            },
            3000);
//    console.log("send object request");
};


$(document).ready(function () {
    dm.onSelectedDataReceived(winUxrData.updateData);
    dm.onSelectedChange(function (dev) {
        winUxrData.updateData(dev, dev.data);
    });
});

let data = {};
let recValues = ["pfcTemp", "envTempC", "dcdcTempC", "currentA"];
let allowRecordings = false;

function recordData(values) {
    let devList = dm.devList;
    let time = new Date().getTime();
    let devDatRec = {};



    for (let dev in devList) {
        let devData = devList[dev].data;

        for (let i = 0; i < values.length; i++) {
            for (let dat in devData) {
                if (devData[dat] !== null && typeof (devData[dat]) === 'object') {
                    for (let key in devData[dat]) {
                        if (key === values[i]) {
                            devDatRec[dev + "_" + key] = devData[dat][key];
                        }
                    }
                } else {
                    if (dat === values[i]) {
                        devDatRec[dev + "_" + dat] = devData[dat];
                    }
                }
            }
        }

    }
    
//    if (!data[time]) {
//        data[time] = [];
//    }
    devDatRec.date = time;
//    data[time].push(devDatRec);

    lc.onNewDataReceived(devDatRec);
}

function enableRecordings(recordValues) {
    if (recordValues) {
        recValues = recordValues;
    }
    allowRecordings = true;
    console.warn("Data recording is enabled for: " + recValues);
}

function downloadRecordings() {
    mu.download("WinlineTempData", JSON.stringify(data));
}
;