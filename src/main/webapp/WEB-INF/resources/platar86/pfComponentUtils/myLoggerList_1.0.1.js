/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by Nathan Brill, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */

/* global moment */
(function (root) {

    let sendLoggerListStatUpdateRequest = function () {

        var loggerList = {};
        var spanListArr = document.getElementsByClassName("loggerListStatField");
        for (var i = 0; i < spanListArr.length; i++) {
            loggerList[spanListArr[i].dataset.sernum] = spanListArr[i].dataset.sernum;
        }

        loggerListStatUpdate([{
                name: "serNumList",
                value: JSON.stringify(loggerList)
            }]);
    };


    function init() {
        let temp1 = document.getElementById('myLoggerList');
        let myLoggersBtn = document.getElementById('myLoggersBtn');

        let childeren = myLoggersBtn.children;
        for (let i = 0; i < childeren.length; i++) {
            childeren[i].style.pointerEvents = 'none';
        }

        myLoggersBtn.onclick = function () {
            temp1.classList.add('layout-config-active');
        };
        let fn = function (event) {
            if (!event.target.matches('.layout-config-active') && !event.target.matches('.my-logger-list-btn')) {
                temp1.classList.remove('layout-config-active');
            }
        };
        window.addEventListener('click', fn.bind(this));

        sendLoggerListStatUpdateRequest();
        setInterval(
                function () {
                    sendLoggerListStatUpdateRequest();
                }
        , 5000);
    }

    $(document).ready(function () {
        init();
    });
})(window);

var updateLoggerListStatus = function (data) {

    var spanListArr = document.getElementsByClassName("loggerListStatField");
    for (var i = 0; i < spanListArr.length; i++) {
        var serial = spanListArr[i].dataset.sernum;
        var status = data[serial];
        if (status === undefined) {
            spanListArr[i].textContent = "UNKNOWN STATUS";
        } else if (status === -1) {
            spanListArr[i].textContent = "Offline";
            spanListArr[i].style.color = "red";
        } else if (status === 0) {
            spanListArr[i].textContent = "Online";
            spanListArr[i].style.color = "green";
        } else if (status > 0) {
//            spanListArr[i].textContent = "Offline since " + moment.duration(status, "milliseconds").humanize({round: "hours"});
            spanListArr[i].textContent = "Offline " + moment.duration(status * -1, "milliseconds").humanize(true);
        }
    }
};