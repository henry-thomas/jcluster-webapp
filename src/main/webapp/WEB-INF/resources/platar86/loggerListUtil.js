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

var sendLoggerStatUpdateRequest = function () {
    console.log("sendLoggerStatUpdateRequest");
    var loggerList = {};
    var spanListArr = document.getElementsByClassName("statusField");
    for (var i = 0; i < spanListArr.length; i++) {
        loggerList[spanListArr[i].dataset.sernum] = spanListArr[i].dataset.sernum;
    }

    loggerStatUpdate([{
            name: "serNumList",
            value: JSON.stringify(loggerList)
        }]);
};
var updateLoggerStatus = function (data) {
    console.log("updateLoggerStatus");
    var spanListArr = document.getElementsByClassName("statusField");
    for (var i = 0; i < spanListArr.length; i++) {
        var serial = spanListArr[i].dataset.sernum;
        var status = data[serial];
        if (status === undefined) {
            spanListArr[i].textContent = "UNKNOWN STATUS";
        } else if (status === -1) {
            spanListArr[i].textContent = "Offline";
        } else if (status === 0) {
            spanListArr[i].textContent = "Online";
        } else if (status > 0) {
//            spanListArr[i].textContent = "Offline since " + moment.duration(status, "milliseconds").humanize({round: "hours"});
            spanListArr[i].textContent = "Offline " + moment.duration(status * -1, "milliseconds").humanize(true);;
            ;
        }
    }
};
$(document).ready(function () {
    sendLoggerStatUpdateRequest();
    setInterval(
            function () {
                sendLoggerStatUpdateRequest();
            }
    , 5000);
});