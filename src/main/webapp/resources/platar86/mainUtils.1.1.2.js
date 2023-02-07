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

/* global PF, wsm, Element, PrimeFaces, parseInt */

var mainUtils = {
    param: {
        lastMessageShowTimestamp: 0,
        lastMessageShowHash: "",
        enableMessageHidding: false
    },
//    onDevStatusReceivedCall: [],
//    onDevStatusReceived: function (onDevStatusReceivedCallback) {
//        if (isFunction(onDevStatusReceivedCallback)) {
//            mainUtils.onDevStatusReceivedCall.push(onDevStatusReceivedCallback);
//        }
//    },
//    onLoggerStatusCall: [],
//    onLoggerStatus: function (onLoggerStatusCallback) {
//        if (isFunction(onLoggerStatusCallback)) {
//            mainUtils.onLoggerStatusCall.push(onLoggerStatusCallback);
//        }
//    },
//    onDevEventCall: [],
//    onDevEvent: function (onDevEventCallback) {
//        if (isFunction(onDevEventCallback)) {
//            mainUtils.onDevEventCall.push(onDevEventCallback);
//        }
//    },
    execCallback: function (fnArr) {
        var argArr = [];
        for (var i = 1; i < arguments.length; i++) {
            argArr.push(arguments[i]);
        }
        for (var j = 0; j < fnArr.length; j++) {
            try {
                fnArr[j].apply(null, argArr);
            } catch (e) {
            }
        }
    },

//    loggerStateChangeCallbackArr: [],
//    subDeviceStateUpdateCalbackArr: [],
//    eventReceivedCalbackArr: [],
//    addLoggerStateChangeCallback: function (fn) {
//        if (typeof (fn === 'function')) {
//            mainUtils.loggerStateChangeCallbackArr.push(fn);
//        }
//    },
//    addSubDeviceStatusReceivedCallback: function (fn) {
//        if (typeof (fn === 'function')) {
//            mainUtils.subDeviceStateUpdateCalbackArr.push(fn);
//        }
//    },
//    addEventReceivedCallback: function (fn) {
//        if (typeof (fn === 'function')) {
//            mainUtils.eventReceivedCalbackArr.push(fn);
//        }
//    },
//    msg: {
//        msgArr: [],
//        msgId: 0,
//        getStampId: function () {
//            mainUtils.msg.msgId++;
//            return  mainUtils.msg.msgId;
//        }
//    },
//    callbackFn: null,
//    getMessage: function () {
//        var message = {
//            subDevSerial: null,
//            subDevModelId: null,
//            instr: null,
//            instrExt: null,
//            instrIdx: null,
//            instrData: null,
//            instrDataExt: null,
//            instrDataIndx: null,
//            instrDataRwFlag: null,
//            silent: false
//        };
//        return message;
//    },
//    sendWsMessageToServer: function (message) {
//        if (wsm !== undefined
//                && wsm.connectionVar !== undefined
//                && wsm.connectionVar.wsSessionId !== undefined) {
//            message.sessionID = wsm.connectionVar.wsSessionId;
//        }
//        if (message === undefined) {
//            console.log("Error [message] missing while send message: " + JSON.stringify(message));
//            return false;
//        }
//        if (message.devSerialNumber === undefined) {
//            console.log("Error [devSerialNumber] missing while send message: " + JSON.stringify(message));
//            return false;
//        }
//        if (message.instr === undefined) {
//            console.log("Error [instr] missing while send message: " + JSON.stringify(message));
//            return false;
//        }
//        sendWsSubDevMessage([{
//                name: "wsSubDevMessage",
//                value: JSON.stringify(message)
//            }]);
//        return true;
//    },
//
//    sendWsMessage: function (message, onSuccesCallback, onErrorCallback, onTimeoutCallback, timeout) {
//        wsm.sendDevMsg(message, onSuccesCallback, onErrorCallback, onTimeoutCallback, timeout);
//        return;
//
//
//        //console.log("sendWsMessage: " + message);
//
//        var messageId = mainUtils.msg.getStampId();
//        message.requestID = messageId;
//        if (!wsm.sendDevMsgToServer(message)) {
//            return; //stop if message is not sent
//        }
//        if (timeout === undefined) {
//            timeout = 5000;
//        }
//        if (onSuccesCallback !== undefined && onSuccesCallback !== null) {
//            message.onSuccesCallback = onSuccesCallback;
//        }
//        if (onErrorCallback !== undefined && onErrorCallback !== null) {
//            message.onErrorCallback = onErrorCallback;
//        }
//        if (onTimeoutCallback !== undefined && onTimeoutCallback !== null) {
//            message.onTimeoutCallback = onTimeoutCallback;
//        }
//        var newTimer = window.setTimeout(mainUtils.generateTimerCallbackFn(message), timeout);
//        message.timerId = newTimer;
//        if (mainUtils.msg.msgArr.length > 128) {
//            mainUtils.msg.msgArr.shift();
//        }
//
//        mainUtils.msg.msgArr.push(message);
//    },
//
//    generateTimerCallbackFn: function (message) {
//        var m = message.requestID;
//        return function () {
//            var msg = m;
//            mainUtils.onTimeOutCallback(msg);
//        };
//    },
//
//    onMessageResponse: function (msgResponse) {
//        var message;
//        var idx;
//        if (msgResponse.requestID !== undefined) {
//            for (var i = 0; i < mainUtils.msg.msgArr.length; i++) {
//                var rID = mainUtils.msg.msgArr[i].requestID;
//                if (rID !== undefined && rID === msgResponse.requestID) {
//                    message = mainUtils.msg.msgArr[i];
//                    idx = i;
//                    break;
//                }
//            }
//            if (idx !== undefined) {
//                mainUtils.msg.msgArr.splice(idx, (idx + 1));
//            }
//            if (message !== undefined) {
//                //stop timeout timer first
//                if (message.timerId !== undefined) {
//                    window.clearTimeout(message.timerId);
//                }
//                message.response = msgResponse;
//                if (msgResponse.success) {
//                    if (message.onSuccesCallback !== undefined) {
//                        var data = msgResponse.data;
//                        //try to parse if data is JSON format
//                        try {
//                            data = JSON.parse(data);
//                        } catch (e) {
//                        }
//                        message.onSuccesCallback(message, data);
//                    } else {
//                        console.log("Message success: " + message);
//                    }
//                } else {
//                    if (message.onErrorCallback !== undefined) {
//                        message.onErrorCallback(message, msgResponse.faultMsg);
//                    } else {
//                        console.log("Message receive not success: " + msgResponse.faultMsg);
//                    }
//                }
//            } else {
//                console.log("Message received after Timout requestID: " + msgResponse.requestID);
//            }
//        } else {
//            console.log("Can not find message with requestID: undefined");
//        }
//    },
//
//    onTimeOutCallback: function (requestID) {
//        var message;
//        var idx;
//        for (var i = 0; i < mainUtils.msg.msgArr.length; i++) {
//            var rID = mainUtils.msg.msgArr[i].requestID;
//            if (rID !== undefined && rID === requestID) {
//                message = mainUtils.msg.msgArr[i];
//                idx = i;
//                break;
//            }
//        }
//        if (idx !== undefined) {
//            mainUtils.msg.msgArr.splice(idx, (idx + 1));
//        }
//        if (message !== undefined) {
//            if (message.onTimeoutCallback !== undefined) {
//                message.onTimeoutCallback();
//            } else {
//                console.log("Timeout for message: " + message);
//            }
//        } else {
//            console.log("Can not find message with requestID: " + requestID);
//        }
//
//    },
//
//    onLoggerMessage: function (message) {
//        if (message !== undefined && message.msgType !== undefined) {
//
//            switch (message.msgType) {
//                case 'event':
//                    {
//                        console.log('EVENT: ' + message);
//                        if (message.messageList.length > 1) {
//                            mainUtils.showInfoMessage(message.messageList.length + " new events received.");
//                        } else if (message.messageList.length === 1) {
//                            mainUtils.showInfoMessage(message.messageList[0].message, "Event received.");
//                        }
//                        mainUtils.execCallback(mainUtils.onDevEventCall, message);
//                        if (mainUtils.eventReceivedCalbackArr.length === 0) {
////                            console.log("no callback for new Event received!");
//                        } else {
//                            for (var i = 0; i < mainUtils.eventReceivedCalbackArr.length; i++) {
//                                mainUtils.eventReceivedCalbackArr[i](message.messageList);
//                            }
//                        }
//                    }
//                    break;
//                case 'subDevStatus':
//                    {
//                        mainUtils.execCallback(mainUtils.onDevStatusReceivedCall, message.messageList);
//                        if (mainUtils.subDeviceStateUpdateCalbackArr.length === 0) {
////                            console.log("no callback for Subdev status received!");
//                        } else {
//                            for (var i = 0; i < mainUtils.subDeviceStateUpdateCalbackArr.length; i++) {
//                                mainUtils.subDeviceStateUpdateCalbackArr[i](message.messageList);
//                            }
//                        }
//                    }
//                    break;
//                case 'loggerStatus':
//                    {
//                        mainUtils.execCallback(mainUtils.onLoggerStatusCall, message);
//                        mainUtils.onLoggerStateChange(message);
//                    }
//                    break;
//            }
//        } else {
//            console.log('unknown message');
//        }
//
//    },
//    onLoggerStateChange: function (message) {
//        var s = message.state;
//        if (message === undefined) {
//            return;
//        }
//        var g = PF('growlWG');
//        if (g !== undefined) {
//            var message = {};
//            if (mainUtils.loggerStateChangeCallbackArr.length === 0) {
//                console.log("no callback for logger state change!");
//            } else {
//                for (var i = 0; i < mainUtils.loggerStateChangeCallbackArr.length; i++) {
//                    mainUtils.loggerStateChangeCallbackArr[i](s);
//                }
//            }
//            message.summary = "Logger state change!";
//            if (s) {
//                message.detail = "Marked as connected";
//                message.severity = "info";
//                mainUtils.setHtmlCompValue('loggerMainStatus', "Online");
//            } else {
//                message.detail = "Marked as disconnected";
//                message.severity = "warn";
//                mainUtils.setHtmlCompValue('loggerMainStatus', "Offline");
//            }
//            g.renderMessage(message);
//        } else {
//            console.log('PF(growlWG) is undefined!!!');
//        }
//    },
    setHtmlCompValue: function (idSelector, value) {
        var a = $('[id*=' + idSelector + ']')[0];
        if (a !== undefined && value !== undefined) {
            a.innerHTML = value;
        }
    },
    setHtmlLabelValueByClass: function (idSelector, value) {
        $('.' + idSelector).text(value);
    },
    showMessage: function (sev, det, sum) {
        let key = sev + det + sum;
        if (mainUtils.param.enableMessageHidding && key === mainUtils.param.lastMessageShowHash) {
            let now = new Date().getTime();
            if (now - mainUtils.param.lastMessageShowTimestamp < 15000) {
                console.log("MESSAGE SKIP TO display", sev, det, sum);
                return;
            }
        }
        mainUtils.param.lastMessageShowHash = key;
        mainUtils.param.lastMessageShowTimestamp = new Date().getTime();

        setTimeout(mainUtils.getRenderMessageFunction(sev, det, sum), 50);
    },
    showErrorMessage: function (det, sum) {
        mainUtils.showMessage("error", det, sum);
    },
    showWarningMessage: function (det, sum) {
        mainUtils.showMessage("warn", det, sum);
    },
    showInfoMessage: function (det, sum) {
        mainUtils.showMessage("info", det, sum);
    },
    getRenderMessageFunction: function (sev, det, sum) {
        return function () {
            var message = {
                summary: sum,
                detail: det,
                severity: sev
            };
            var g = PF('growlWG');
            if (g !== undefined) {
                g.renderMessage(message);
            }
        };
    },
    printErrpr: function (widgetVar) {
        console.log('can not find widget var: ' + widgetVar);
    },
    setInputSwitch: function (state, widgetVar) {
        var wg = PF(widgetVar);
        if (wg !== undefined) {
            if (state !== mainUtils.getInputSwitch(widgetVar)) {
                wg.toggle();
            }
        } else {
            mainUtils.printErrpr(widgetVar);
        }
    },
    getInputSwitch: function (widgetVar) {
        var wg = PF(widgetVar);
        if (wg !== undefined) {
            return wg.input.prop('checked');
        } else {
            mainUtils.printErrpr(widgetVar);
        }
    },
    setSelectOneMenu: function (value, widgetVar) {
        var widget = PF(widgetVar);
        if (widget !== undefined) {
            PF(widgetVar).selectValue(value);
        } else {
            mainUtils.printErrpr(widgetVar);
        }
    },
    getSelectOneMenuOptions: function (widgetVar) {
        var widget = PF(widgetVar);
        if (widget !== undefined && widget.options !== undefined) {
            var options = [];
            for (var i = 0; i < widget.options.length; i++) {
                options.push({
                    value: widget.options[i].value,
                    text: widget.options[i].text
                });
            }
            return options;
        } else {
            mainUtils.printErrpr(widgetVar);
        }
    },
    getSelectOneMenu: function (widgetVar) {
        var widget = PF(widgetVar);
        if (widget !== undefined) {
            return  PF(widgetVar).getSelectedValue();
        } else {
            mainUtils.printErrpr(widgetVar);
        }
    },
    getWidgetValue: function (widgetVar) {
        var widget = PF(widgetVar);
        if (widget !== undefined) {
            if (widget.jq[0].classList.contains('ui-spinner')) {
                return  widget.value;
            }
            if (widget.jq[0].classList.contains('ui-selectonemenu')) {
                return  widget.getSelectedValue();
            }
            if (widget.jq[0].classList.contains('ui-inputnumber')) {
                return  widget.getValue();
            }
            if (widget.jq[0].classList.contains('ui-inputfield')) {
                return  widget.jq.val();
            }
            if (widget.jq[0].classList.contains('ui-colorpicker')) {
                return  widget.intValue;
            }
            if (widget.jq[0].classList.contains('ui-inputswitch')) {
                return  mainUtils.getInputSwitch(widgetVar);
            }
            if (widget.jq[0].classList.contains('ui-calendar')) {
                return  widget.getDate() !== null ? widget.getDate().getTime() : new Date().getTime();
            }
            console.log("Can not find value for widget: " + widget);
        }
    },
    setWidgetValue: function (widgetVar, value) {


        var widget = PF(widgetVar);
        if (widget !== undefined) {
            if (widget.jq[0].classList.contains('ui-spinner')) {
                return   widget.spin((value - widget.value) * (1 / widget.cfg.step));
            }
            if (widget.jq[0].classList.contains('ui-selectonemenu')) {
                return  widget.value = value;
            }
            if (widget.jq[0].classList.contains('ui-inputnumber')) {
                return  widget.setValue(value);
            }
            if (widget.jq[0].classList.contains('ui-inputfield')) {
                return  widget.jq.val(value);
            }
            if (widget.jq[0].classList.contains('ui-colorpicker')) {

                if (isNaN(value)) {
                    widget.intValue = parseInt(value, 16);
                    widget.value = value;
                    return  widget.livePreview.css('backgroundColor', value);
                } else {

                    widget.intValue = value;
                    widget.value = value.toString(16);
                    return  widget.livePreview.css('backgroundColor', '#' + widget.value);
                }
            }
            if (widget.jq[0].classList.contains('ui-inputswitch')) {
                return  mainUtils.setInputSwitch(value, widgetVar);
            }
            if (widget.jq[0].classList.contains('ui-calendar')) {
                return  widget.setDate(moment(value).format('MM/DD/YYYY HH:mm:ss'));
            }
        }
    },
    getSelectOneMenuSelectedIdx: function (widgetVar) {
        var widget = PF(widgetVar);
        if (widget !== undefined) {
            var label = widget.getSelectedLabel();
            for (var i = 0; i < widget.options.length; i++) {
                if (widget.options[i].text === label) {
                    return i;
                }
            }
            mainUtils.showMessage("info", "can not find index for" + widgetVar);
        } else {
            mainUtils.printErrpr(widgetVar);
        }
    },
    setInputCompValue: function (idSelector, value) {
        var a = $('[id*=' + idSelector + ']')[0];
        if (a !== undefined && value !== undefined) {
            if (mainUtils.paramRefreshRequest) {
                if (Number(a.value) !== value) {
                    $('[id*=' + idSelector + ']').css("color", "red");
                } else {
                    $('[id*=' + idSelector + ']').css("color", "black");
                }
            }
            a.value = value;
        }
    },
    getInputCompValue: function (idSelector) {
        var a = $('[id*=' + idSelector + ']')[0];
        return    a.value;
    },
    setSpinnerCompValue: function (idSelector, value) {
        var a = $('[id*=' + idSelector + '_input]')[0];
        if (a !== undefined && value !== undefined) {

            a.value = value;
        }
    },
    setSpinnerValue: function (widgetVar, value) {
        var widget = PF(widgetVar);
        if (widget !== undefined && typeof widget.spin === 'function') {

            widget.spin((value - widget.value) * (1 / widget.cfg.step));
        } else {
            mainUtils.printErrpr(widgetVar);
        }
    },
    getSpinnerValue: function (widgetVar) {
        var widget = PF(widgetVar);
        if (widget !== undefined && typeof widget.spin === 'function') {
            return  widget.value;
        } else {
            mainUtils.printErrpr(widgetVar);
        }
    },
    getTimeFromSecconds: function (tSec) {
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
    },
    setCookie: function (name, value, days, isURISpecific) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        let path = "/";
        if (isURISpecific) {
            path = window.location.pathname;
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=" + path;
    },
    getCookie: function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0)
                return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    eraseCookie: function eraseCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999;';
    },

    formatPowerW: function (value, decimals) {
        if (!decimals) {
            decimals = 2;
        }

        if (value > 1000000000 || value < -1000000000) {
            return (value / 1000000000).toFixed(decimals) + ' GW';
        }
        if (value > 1000000 || value < -1000000) {
            return (value / 1000000).toFixed(decimals) + ' MW';
        }
        if (value > 1000 || value < -1000) {
            return (value / 1000).toFixed(decimals) + ' kW';
        }
        return value.toFixed(decimals) + ' W';
    },

    formatEnergyWh: function (value, decimals) {
        if (!decimals) {
            decimals = 2;
        }

        if (value > 1000000000 || value < -1000000000) {
            return (value / 1000000000).toFixed(decimals) + ' GWh';
        }
        if (value > 1000000 || value < -1000000) {
            return (value / 1000000).toFixed(decimals) + ' MWh';
        }
        if (value > 1000 || value < -1000) {
            return (value / 1000).toFixed(decimals) + ' kWh';
        }
        return value.toFixed(decimals) + ' Wh';
    },

    sigNumFormatter: function (val, sigNum) {
        let valLength;
        let intLength;
        let decLength;
        val = Number(val);
        if (val.toString().includes(".") || val.toString().includes(",")) {
            valLength = val.toString().length - 1;
            intLength = parseInt(val).toString().length;

        } else {
            valLength = val.toString().length;
            intLength = valLength;
            decLength = 0;
        }
        if (valLength === sigNum) {
            return val;
        }
        if (intLength >= sigNum) {
            return val.toFixed(0);
        } else {
            return val.toFixed(sigNum - intLength);
        }
    },

    formatDashboardValue: function (value, label, unit, labelUnit) {
        if (label === undefined) {
            return;
        }
        if (value === undefined || value === null) {
            label.plain('---');
            if (labelUnit) {
                labelUnit.plain('-');
            } 
            return;
        }
        if (value < 1000) {
            if (labelUnit) {
                label.plain((value).toFixed(0));
                labelUnit.plain((unit || ''));
            } else {
                label.plain(((value).toFixed(0)) + unit);
            }

        } else if (value < 100000) {
            if (labelUnit) {
                label.plain((value / 1000).toFixed(2));
                labelUnit.plain('k' + (unit || ''));
            } else {
                label.plain(((value / 1000).toFixed(2)) + ' k' + unit);
            }

        } else if (value < 999999) {
            if (labelUnit) {
                label.plain((value / 1000).toFixed(1));
                labelUnit.plain('k' + unit);
            } else {
                label.plain(((value / 1000).toFixed(1)) + ' k' + unit);
            }
        } else if (value < 9999999) {
            if (labelUnit) {
                label.plain((value / 1000000).toFixed(2));
                labelUnit.plain('M' + unit);
            } else {
                label.plain(((value / 1000000).toFixed(3)) + ' M' + unit);
            }
        } else if (value < 99999999) {
            if (labelUnit) {
                label.plain((value / 1000000).toFixed(1));
                labelUnit.plain('M' + unit);
            } else {
                label.plain(((value / 1000000).toFixed(3)) + ' M' + unit);
            }
        } else if (value < 999999999) {
            if (labelUnit) {
                label.plain((label / 1000000000).toFixed(3));
                labelUnit.plain('G' + unit);
            } else {
                label.plain(((value / 1000000000).toFixed(3)) + ' G' + unit);
            }
        } else if (value < 9999999999) {
            if (labelUnit) {
                label.plain((value / 1000000000).toFixed(2));
                labelUnit.plain('G' + unit);
            } else {
                label.plain(((value / 1000000000).toFixed(2)) + ' G' + unit);
            }
        } else {
            if (labelUnit) {
                label.plain((value / 1000000000).toFixed(1));
                labelUnit.plain('G' + unit);
            } else {
                label.plain(((value / 1000000000).toFixed(1)) + ' G' + unit);
            }

        }
    },

    //mu.camelize(str) Returns camelcase string.
    //Removes spaces and characters. Leaves numbers and letters only.
    camelize: function (str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/[^A-z0-9]|\s+/g, '');
    },

    download: function (filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

// Start file download.
//    download("hello.txt", "This is the content of my file :)");
};
mainUtils.noJQ = {
    setLabelText: function (className, text) {
        if (className !== undefined && text !== undefined && text !== null) {
            var arr = document.getElementsByClassName(className);
            if (arr !== undefined) {
                arr[0].textContent = text;
            } else {
                console.err("can not find component with className: " + className);
            }
        }
    }
};
//create some missing functions at startup
(function () {
    if (Object.assign === undefined) {
        Object.assign = function (target, source) {
            target = JSON.parse(JSON.stringify(source));
            return target;
        };
        console.log('Object.assign not supported');
    }
})();
function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

function clone(obj) {
    var copy;
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj)
        return obj;
    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

// Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

// Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr))
                copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

//mainUtils.setHtmlText = function (className, val, fixedDec) {
//    if (val !== undefined && val !== null) {
//        if (typeof (val) === 'number' && typeof (fixedDec) === 'number') {
//            $('.' + className).text(val.toFixed(fixedDec));
//            let dataDiv = document.querySelector('.' + className);
//            if (dataDiv) {
//                dataDiv = dataDiv.parentElement;
//                //Nathan
//                if (dataDiv.unitVal === 'W' || 'kW') {
//                    if (val >= 500) {
//                        dataDiv.unitVal = 'kW';
//                        $('.' + className).text((val / 1000).toFixed(fixedDec));
//                    }
////                    dataDiv.unitVal = 'kW';
//                }
//            }
//        } else {
//            $('.' + className).text(val);
//        }
//    } else {
//        $('.' + className).text('N/A');
//    }
//};
mainUtils.setHtmlText = function (className, val, fixedDec) {
    if (val !== undefined && val !== null) {
        if (typeof (val) === 'number' && typeof (fixedDec) === 'number') {
            $('.' + className).text(val.toFixed(fixedDec));
        } else {
            $('.' + className).text(val);
        }
    } else {
        $('.' + className).text('N/A');
    }
};

mainUtils.setInputValue = function (className, value) {
    var element = document.getElementsByClassName(className)[0];
    if (element !== undefined) {
        element.value = value;
    } else {
        console.log('can not find element with classname: ' + className);
    }
};
var mu = mainUtils;

mainUtils.addColorpickerCallback = function (widgetVar, onHideCb, onChangeCb) {
    var wg = PF(widgetVar);
    if (isFunction(onChangeCb)) {
        wg.onChange = onChangeCb;
    }
    if (isFunction(onHideCb)) {
        wg.onHideCb = onHideCb;
    }

    wg.value = -1;



    wg.overlay.data().colorpicker.onChange = function (hsb, hex, rgb) {
        wg.intValue = parseInt(hex, 16);
        wg.value = '#' + hex;
        wg.livePreview.css('backgroundColor', '#' + hex);
        if (onChangeCb !== undefined && isFunction(onChangeCb)) {
            wg.onChangeCb(wg.value, widgetVar);
        }
    };
    wg.overlay.data().colorpicker.onHide = function (hsb, hex, rgb) {
        if (onHideCb !== undefined && isFunction(onHideCb)) {
            wg.onHideCb(wg.value, wg.intValue, widgetVar);
        }
    };
}
;
mainUtils.customSelectButton = {};

mainUtils.customSelectButton.clearAll = function (panelId) {
    const panelNode = document.getElementById(panelId);
    while (panelNode.firstChild) {
        panelNode.removeChild(panelNode.firstChild);
    }
};

mainUtils.customSelectButton.selectFirstWithCallback = function (panelId) {
    var element = document.getElementById(panelId).firstChild;
    if (element !== undefined && element.onclick !== undefined) {
        element.onclick();
    }
};

mainUtils.customSelectButton.add = function (panelId, buttonText, callback, cbId) {
    panelId = panelId || 'axpertAiSubUnitSelectPanle';
    buttonText = buttonText || 'Test button 889988';
    callback = callback || function (b) {
        console.log("button callback: " + b);
    };

    const panel = document.getElementById('axpertAiSubUnitSelectPanle');
    const divNode = document.createElement('div');
    const span = document.createElement('span');
    span.textContent = buttonText;
    divNode.appendChild(span);
    panel.appendChild(divNode);
    divNode.classList.add('ui-splitbutton');
    divNode.classList.add('ui-button');
    divNode.onclick = function () {
        const c = callback;
        for (var i = 0; i < panel.childElementCount; i++) {
            panel.children[i];
            panel.children[i].classList.remove('secondary');
        }
        this.classList.add('secondary');
        c(cbId);
    };
//    console.log("asdf");

};

mainUtils.arrayRemoveItem = function (arr, value) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        }
    }
};

mainUtils.appendSpanToParrent = function (parent, spanObj) {
    const span = document.createElement('span');
    if (spanObj.class) {
        span.classList.add(spanObj.class);
    }
    if (spanObj.id) {
        span.id = spanObj.id;
    }
    if (spanObj.textContent) {
        span.textContent = spanObj.textContent;
    }
    parent.appendChild(span);
};

mainUtils.animateBothCSS = function (element, animationName, callback) {
    const node = document.querySelector(element);
    node.classList.add('animated', animationName);

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName);
        node.removeEventListener('animationend', handleAnimationEnd);

        if (typeof callback === 'function') {
            callback(node);
        }
    }

    node.addEventListener('animationend', handleAnimationEnd);
    return node;
};

mainUtils.animateForwardCSS = function (element, animationName, resetAtEnd, callback) {
    console.log('animateForwardCSS');
    const node = document.querySelector(element);
    if (node.animatedClass !== undefined) {
        node.classList.remove('animatedForward', node.animatedClass);
    }
    node.classList.add('animatedForward', animationName);
    if (resetAtEnd) {
        function handleAnimationEnd() {
            node.classList.remove('animatedForward', animationName);
            node.removeEventListener('animationend', handleAnimationEnd);
            if (typeof callback === 'function') {
                callback(node);
            }
        }
        node.addEventListener('animationend', handleAnimationEnd);
    } else {
        node.animatedClass = animationName;
    }
    return node;
};

mainUtils.initCanvas = function (className, image, naturalWidth, naturalHeight) {
    var canvas = document.querySelector('.' + className);
    var ctx = canvas.getContext("2d");
    // Set the logical size of the canvas to match the 
    // natural size of the image, this way we don't use
    // the scaling algorithm of drawImage (It isn't good
    // for reducing big images as it produces unsmooth results).
    $(canvas).attr("width", naturalWidth);
    $(canvas).attr("height", naturalHeight);
    // Copy the image:
    ctx.drawImage(image, 0, 0, naturalWidth, naturalHeight);
    return canvas;
};
mainUtils.getTimeFromSeconds = function (tSec) {
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
};
mainUtils.clearCanvas = function (id) {
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

mainUtils.generateUUID = function () {
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};
mainUtils.isObject = function (obj) {
    return (obj !== null && typeof obj === 'object');
};
mainUtils.isDOM = function (Obj) {
    return Obj instanceof Element;
};
mainUtils.isNumber = function (n) {
    return (!isNaN(n) && typeof n === 'number');
};
mainUtils.isString = function (s) {
    return (s !== null && typeof s === 'string');
};
// Checking if the application is running in a Mobile Browser
// Using Regex (from detectmobilebrowsers.com)
//
mainUtils.isMobileBrowser = function () {
    let check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};
//$(window).on("load", function( ){
//    var images = $("img").filter(function(){
//        var dataImage = $(this).data("image") ;
//        if( typeof dataImage != "number" ) return false ;
//        var number = parseInt(dataImage,10) ;
//        return number > 0 && dataImage === number ;
//    }) ;
//    images.on("mouseenter", function( ){
//        var naturalWidth = $(this).prop("naturalWidth") ;
//        var naturalHeight = $(this).prop("naturalHeight") ;
//
//        // Scaled thumbnail:
//        // Copy the image to canvas-scaled and get a reference to it:
//        var scaledCanvas = initCanvas("canvas-scaled",this,naturalWidth,naturalHeight);
//        // Calculate the display size of the canvas:
//        var hwfactor = naturalHeight/naturalWidth ;
//        var whfactor = naturalWidth/naturalHeight ;
//        var scaledWidth, scaledHeight ;
//        if( hwfactor >= 1 ){ // Pillarboxing
//            scaledHeight = "100px" ;
//            scaledWidth = (100*whfactor)+"px" ;
//        }
//        else{ // Letterboxing
//            scaledWidth = "100px" ;
//            scaledHeight = (100*hwfactor)+"px" ;
//        }
//        // Now we change the display size of the canvas.
//        // A better scaling algorithm will be used.
//        $(scaledCanvas).css("width",scaledWidth);
//        $(scaledCanvas).css("height",scaledHeight);
//
//        // Stretched thumbnail:
//        // Copy the image to canvas-stretched. The display size
//        // of canvas-stretched is already set in the style section.
//        initCanvas("canvas-stretched",this,naturalWidth,naturalHeight);
//    });
//    images.on("mouseleave", function( ){
//        clearCanvas("canvas-scaled");
//        clearCanvas("canvas-stretched");
//    });
//});
mainUtils.createSeparator = function () {
    const separator = document.createElement('hr');
    separator.classList.add('ui-separator');
    separator.classList.add('ui-state-default');
    separator.classList.add('ui-corner-all');
    return separator;
};


mainUtils.loadScript = function (url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.

    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
};

mainUtils.loadScriptJSFResource = function (url, lib, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '/javax.faces.resource/' + url + '.xhtml?ln=' + lib;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.

    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
};

mainUtils.compare = function (e1, e2) {
    if (!e1 && !e2)
        return 0;

    if (!e1)
        return -1;

    if (!e2)
        return 1;

    if (!isNaN(e1) && !isNaN(e2)) {
        return Number(e1) - Number(e2);
    }

    let prefix = mainUtils.commonPrefix([e1, e2]);
    if (!prefix)
        return e1.localeCompare(e2);

    return mainUtils.compare(e1.replace(prefix, ''), e2.replace(prefix, ''));
};

mainUtils.commonPrefix = function (strs) {
    if (!strs.length)
        return '';
    for (let i = 0; i < strs[0].length; i++) {
        for (let j = 1; j < strs.length; j++) {
            const str = strs[j];
            if (str[i] !== strs[0][i])
                return str.slice(0, i);
        }
    }
    return strs[0];
};

mainUtils.getContextPath = function () {
    let contextPath = document.getElementById('contextPathId').getAttribute("data-context-path");
    return contextPath !== '/' ? contextPath : '';

//    if (mainUtils.contextPath !== undefined && mainUtils.contextPath !== null) {
//        return mainUtils.contextPath;
//    }
//    
//    let input = document.getElementById('contextPathId');
//    
//    if (!input) {
//        return mainUtils.contextPath;
//    }
//    
//    mainUtils.contextPath = input.value; 
//    if (mainUtils.contextPath === '/')
//        mainUtils.contextPath = '';
//    return mainUtils.contextPath;
};

//wsm.onMessageResponse = mainUtils.onMessageResponse;


//This was added to fix PF setValue for selectOneMenu. 
//Fixes issue with mainUtils.setWidgetValue function
//
//Could not set value before menu was opened.
// Seems like menu items were not initialized.
if (PrimeFaces.widget.SelectOneMenu) {

    PrimeFaces.widget.SelectOneMenu.prototype.callHandleMethod = function (handleMethod, event) {
        var $this = this;

        if (this.cfg.dynamic && !this.isDynamicLoaded) {
            this.dynamicPanelLoad();

            var interval = setInterval(function () {
                if ($this.isDynamicLoaded) {
                    if (handleMethod) {
                        handleMethod.call($this, event);
                    }

                    clearInterval(interval);
                }
            }, 10);
        } else {
            this.renderPanelContentFromHiddenSelect(true);

            if (handleMethod) {
                handleMethod.call(this, event);
            }
        }
    };

    PrimeFaces.widget.SelectOneMenu.prototype.selectValue = function (value) {
        if (!this.items || this.items.length === 0) {
            this.callHandleMethod(null, null);
        }

        var option = this.options.filter('[value="' + $.escapeSelector(value) + '"]');

        this.selectItem(this.items.eq(option.index()), true);
    };
}
//}