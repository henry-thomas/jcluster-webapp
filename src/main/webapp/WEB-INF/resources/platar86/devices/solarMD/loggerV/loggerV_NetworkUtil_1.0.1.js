/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by Nathan Brill, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 Sout Africa
 *  Phone: 021 555 2181
 
 /* global logCon, PF, sendConfigReadReq, mainUtils, devManager, htmlUtils, mu, hh, moment, dm, wsm, ipUtils */


/* global hh, wsm */

//avrgTime: 10
//errorCounter: 0
//maxTime: 40
//minTime: 6
//successCounter: 1000
//totalTime: 10923



let loggerV2SpeedTest = {};

loggerV2SpeedTest.openCreateDialog = function () {
    if (loggerV2SpeedTest.newDialog === undefined) {
        loggerV2SpeedTest.createAddNewEmsDialog();
    }
    loggerV2SpeedTest.newDialog.show();
};

loggerV2SpeedTest.createAddNewEmsDialog = function () {
    let dialog = loggerV2SpeedTest.newDialog = new SMDUIDialog({modal: true, heading: "LoggerV2 speed test", draggable: true});
    let cont = hh.div(dialog.contentDiv, 'display: flex;');


//    console.log(speedInfo.avrgTime);
    let iteration = new ParamSetting(cont, {
        disableControl: true, type: 'inputText', title: 'Iteration:', val: 10
    });


    let dataSize = new ParamSetting(cont, {
        disableControl: true, type: 'inputText', title: 'Data Size:', val: 100
    });
    let timeOut = new ParamSetting(cont, {
        disableControl: true, type: 'inputText', title: 'Time Out:', val: 10 * 1000

    });

    let run = hh.button(cont, "run");
    let resaultCard = hh.createActDataPanelCard("Test result", null, cont);

    let dcf = {};

    dcf.successCounter = hh.adf(resaultCard, "Success counter");
    dcf.errorCounter = hh.adf(resaultCard, "Error counter");
    dcf.maxTime = hh.adf(resaultCard, "Max time", "ms");
    dcf.totalTime = hh.adf(resaultCard, "Total time", "ms");
    dcf.minTime = hh.adf(resaultCard, "Min Time", "ms");
    dcf.avrgTime = hh.adf(resaultCard, "Average time", "ms");

    run.onclick = function () {
//        debugger;
        wsm.sendDevMsgExecWithJsonInst({instrExt: 'testServerSpeed', iteration: iteration.getValue(), dataSize: dataSize.getValue(), timeout: timeOut.getValue()}, (m, msg) => {
            console.log(msg);
            for (var item in dcf) {
//                let test = hh.adf(resaultCard, item);
                dcf[item].value = msg[item];
            }
        }, (m, msg) => {
            console.log(msg);
        }, (m, msg) => {
            console.log(msg);
        });

    };





//    debugger;
};
