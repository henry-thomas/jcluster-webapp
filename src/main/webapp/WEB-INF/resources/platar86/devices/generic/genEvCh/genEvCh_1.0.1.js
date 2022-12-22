/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */


/* global hhContentBuilder, hh, mainUtils, wsm, dm */
genEvCh = {};
genEvCh.updateData = function (dev, data) {
    for (var fieldName in data) {
        mainUtils.setHtmlText(fieldName, data[fieldName], 3);
    }
    for (var fieldName in data.chargePower) {
        if (fieldName === 'ratedPowerW') {
            mainUtils.setHtmlText(fieldName, data.chargePower[fieldName] / 1000);
            continue;
        }
        if (fieldName === 'powerW') {
            mainUtils.setHtmlText(fieldName, data.chargePower[fieldName] / 1000);
            continue;
        }
        if (fieldName === 'acPowerW') {
            mainUtils.setHtmlText(fieldName, data.chargePower[fieldName] / 1000);
            continue;
        }
        mainUtils.setHtmlText(fieldName, data.chargePower[fieldName], 3);
    }
    for (var fieldName in dev) {

        if (fieldName !== 'hidden') {
            mainUtils.setHtmlText(fieldName, dev[fieldName]);
        }
    }
};


genEvCh.testInst = function (instr, isPTP, msgType, valueType, data, dtype) {
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
    dm.onSelectedDataReceived(genEvCh.updateData);
    dm.onSelectedChange(function (dev) {
        genEvCh.updateData(dev, dev.data);
    });
});