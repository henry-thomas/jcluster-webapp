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

/* global hhContentBuilder, hh, mainUtils, wsm, dm, infyGui, infyData */
infyPowerEvCh = {};

(function (root) {
    let InfyData = function () {
        this.isInit = false;
    };

    let prot = InfyData.prototype;

    prot.updateData = function (dev, data) {
        if (!this.isInit) {
//            for (var item in data) {
//                if (!infyGui.dataFields[item]) {
//                    infyGui.dataFields[item] = hh.adf(infyGui.todoCard, item, null, {decimal: 2});
//                }
//            }
        }
        this.isInit = true;
        hh.updateAdfFromObject(infyGui.dataFields, data, true);
    };



    root.infyData = new InfyData();

})(window);


infyPowerEvCh.setVoltageAndCurrent = function (voltage, current) {
    let msg = {instrExt: 'setChargeVoltage'};
//    msg.srcAddr = srcAddr;
//    msg.dstAddr = dstAddr;

    msg.voltage = voltage;
    msg.current = current;
    msg.isPTP = false;
    msg.commandNo = 0x1C;

    wsm.sendDevMsgExecWithJsonInst(
            msg,
            function (message, response) {
                console.log("Result: ", response);
            },
            function (message, error) {
                console.warn("Response Error: " + error);
            },
            3000);
};

infyPowerEvCh.testInst = function (instr, isPTP, commanNo, data, dtype, putIdx) {
//    {srcAddr:240, dstAddr: 4, isPTP: false, valueType: }
    let msg = {instrExt: instr};
//    msg.srcAddr = srcAddr;
//    msg.dstAddr = dstAddr;

    msg.putIdx = putIdx;
    msg.isPTP = isPTP;
    msg.commandNo = commanNo;
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
    dm.onSelectedDataReceived(infyData.updateData);
    dm.onSelectedChange(function (dev) {
        infyData.updateData(dev, dev.data);
    });
});