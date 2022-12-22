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

/* global mainUtils, wsm */

(function (root) {
    function DevMonUtils() {

    }

    let prot = DevMonUtils.prototype;

    prot.clearLoggerSubDevices = function (selectedLoggerSerial) {
        let devSerial = selectedLoggerSerial;
        executeConfigUpdate('removeAllDev', selectedLoggerSerial,
                function (msg, success) {
                    console.log('Logger Broadcast Dev List');
                },
                function () {
                    mainUtils.showErrorMessage('Timeout for gettting deviceList from logger');

                },
                function (msg, success) {

                    mainUtils.showErrorMessage('Failed to get deviceList from logger: ' + selectedLoggerSerial, success);
                }
        );
    };

    function executeConfigUpdate(instr, selectedLoggerSerial, fnSuccess, fnTimeout, fnError, timeout) {
//    timeout = timeout || 6000;
        var callbachFn = fnSuccess;
        var message = {
            instr: 'executeInstr',
            instrExt: instr,
            devSerialNumber: selectedLoggerSerial,
            devModelId: 1
        };
        console.log("send object request");
        wsm.sendDevMsg(message, callbachFn, fnError, fnTimeout, timeout);
    }


    $(document).ready(function () {
        root.devMonUtils = new DevMonUtils();
    });
})(window);


