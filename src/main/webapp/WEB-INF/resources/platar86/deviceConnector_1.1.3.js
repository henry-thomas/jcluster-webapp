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
/* global $jsfId, mainUtils, devManager, PF, pm  */

//MUST CHANGE VERSION!!!

function SubDevice(dev, stateChangeCb, timeoutPeriod) {
    if (dev !== undefined) {
        this.lastSeenOld;
        this.progressDialogCont = {};
        this.progressCurrentId = null;
        this.progKnown = {};
        this.alert = {};
        this.stateChangeCb = stateChangeCb;
        this.selected = false;
        this.connected = false;
        this.auxData = {};
        this.paramName;
        this.paramInit = false;
        this.panel;
        this.label = dev.serialNumber;
        for (var item in dev) {
            this[item] = dev[item];
        }
        this.devTimer = new DevTimer(this.onTimeout, timeoutPeriod, this);
        this.initUI();
    }
}

SubDevice.prototype.onTimeout = function () {
    this.setConnected(false);
};

SubDevice.prototype.stringify = function () {
    let copy = {};
    for (var item in this) {
        if (typeof this[item] !== 'function' && (this[item] instanceof HTMLElement) === false) {
            copy[item] = this[item];
        }
    }
    return JSON.stringify(copy);
};

SubDevice.prototype.getData = function () {
    if (this.dataName !== undefined) {
        return this[this.dataName];
    }
};

Object.defineProperty(SubDevice.prototype, "data", {
    get: function () {
        return this[this.dataName];
    }
});

SubDevice.prototype.getParam = function () {
    if (this.paramName !== undefined) {
        return this[this.paramName];
    }
};

Object.defineProperty(SubDevice.prototype, "param", {
    get: function () {
        return this[this.paramName];
    }
});

SubDevice.prototype.getParamChanges = function () {
    if (this.getParam() !== undefined) {
        if (this.paramChanges === undefined) {
            this.paramChanges = {};
        }
        return this.paramChanges;
    }
};

SubDevice.prototype.updateData = function (data, dataType) {

    this[dataType] = data;
    this.dataName = dataType;

    this.devTimer.refreshTimer();
    this.lastSeenOld = this.lastSeen;
    this.lastSeen = new Date().getTime();
    if (data.alertMap !== undefined) {
        this.updateAlert(data.alertMap);
    }
    this.setConnected(true);
};

SubDevice.prototype.updateParam = function (param, dataType) {
//    console.log('update param');
    this.paramName = dataType;
    this[dataType] = param;
    this.devTimer.refreshTimer();
    if (!this.paramInit && this.disableParamInsert === undefined) {
        if (this.selected) {
            for (var item in  this[dataType]) {
                if (Array.isArray(param[item])) {
                    var arr = this[dataType][item];

                    for (var i = 0; i < arr.length; i++) {
                        var cName = item + (i.toString());
                        try {
                            mainUtils.setWidgetValue(cName, arr[i]);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                } else {
                    try {
                        mainUtils.setWidgetValue(item, this.getParam()[item]);
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
        this.paramInit = true;
    }
//    this[dataType].changes = {};
};

SubDevice.prototype.reloadParam = function () {

    const params = this.getParam();
    if (params) {

        const paramChanges = this.getParamChanges();
        for (var item in  params) {
            if (Array.isArray(params[item])) {
                var arr = params[item];
                for (var i = 0; i < arr.length; i++) {
                    var cName = item + (i.toString());
                    if (paramChanges[cName]) {
                        try {
                            mainUtils.setWidgetValue(cName, paramChanges[arr[i]]);
                        } catch (e) {
                            console.log(e);
                        }
                    } else {
                        try {
                            mainUtils.setWidgetValue(cName, arr[i]);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
            } else {
                if (paramChanges[item]) {
                    try {
                        mainUtils.setWidgetValue(item, paramChanges[item]);
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    try {
                        mainUtils.setWidgetValue(item, params[item]);
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
    }
};

SubDevice.prototype.updateAlert = function (alertMap) {
    //console.log(alertMap);
//    if ((alertMap === null) || (alertMap === undefined))
//    {
//        alertMap = {
//            260: {
//                alertCode: "260",
//                alertCodeExt: null,
//                alertObject: null,
//                description: "Override On enabled",
//                generatedBy: null,
//                level: "INFO",
//                levelInt: 600,
//                recorded: false,
//                timeStamp: 1600261943451
//            },
//            261: {
//                alertCode: "261",
//                alertCodeExt: null,
//                alertObject: null,
//                description: "Test Error",
//                generatedBy: null,
//                level: "INFO",
//                levelInt: 600,
//                recorded: false,
//                timeStamp: 1600261943451
//            },
//            264: {
//                alertCode: "264",
//                alertCodeExt: null,
//                alertObject: null,
//                description: "Test INFO1",
//                generatedBy: null,
//                level: "WARNING",
//                levelInt: 600,
//                recorded: false,
//                timeStamp: 1600261943451
//            },
//            263: {
//                alertCode: "263",
//                alertCodeExt: null,
//                alertObject: null,
//                description: "Test INFO2",
//                generatedBy: null,
//                level: "UNKNOWN",
//                levelInt: 600,
//                recorded: false,
//                timeStamp: 1600261943451
//            },
//            262: {
//                alertCode: "262",
//                alertCodeExt: null,
//                alertObject: null,
//                description: "Test INFO3",
//                generatedBy: null,
//                level: "UNKNOWN",
//                levelInt: 600,
//                recorded: false,
//                timeStamp: 1600261943451
//            }
//        };
//    }

    let warningCount = 0;
    let errorCount = 0;
    let infoCount = 0;
    let otherCount = 0;
    if (alertMap !== undefined) {
        for (var alertId in alertMap) {
            if (alertMap[alertId].level === "WARNING") {
                warningCount++;
            } else if (alertMap[alertId].level === "ERROR") {
                errorCount++;
            } else if (alertMap[alertId].level === "INFO") {
                infoCount++;
            }
             else if (alertMap[alertId].level === "UNKNOWN") {
                otherCount++;
            }
            if (this.alert[alertId] === undefined) {
                //do something here for new allerts
                console.log('new alert: ' + alertMap[alertId]);
            }
            this.alert[alertId] = alertMap[alertId];
        }
        //remove old alerts
        for (var item in this.alert) {
            if (alertMap[item] === undefined) {
                delete(this.alert[item]);
            }
        }

        let devDgMan = document.querySelector('device-dg-manager');
        if (this.panel) {
            const alertCount = Object.keys(this.alert).length;
            if (alertCount > 0) {
                if (errorCount > 0) {
                    this.panel.querySelector('#warningIcon').classList.remove("fa-info-circle");
                    this.panel.querySelector('#warningIcon').classList.remove("fa-question-circle");
                    this.panel.querySelector('#warningIcon').classList.remove("fa-exclamation-triangle");
                    this.panel.querySelector('#warningIcon').classList.add("fa-exclamation-circle");                    
                    this.panel.querySelector('#warningIcon').style.color = '#ff5324';                    
                } else if (warningCount > 0) {  
                    this.panel.querySelector('#warningIcon').classList.remove("fa-info-circle");
                    this.panel.querySelector('#warningIcon').classList.remove("fa-question-circle");
                    this.panel.querySelector('#warningIcon').classList.remove("fa-exclamation-triangle");
                    this.panel.querySelector('#warningIcon').classList.add("fa-exclamation-triangle");
                    this.panel.querySelector('#warningIcon').style.color = '#ffb722';
                } else if (infoCount > 0) {
                    this.panel.querySelector('#warningIcon').classList.remove("fa-question-circle");
                    this.panel.querySelector('#warningIcon').classList.remove("fa-exclamation-circle");    
                    this.panel.querySelector('#warningIcon').classList.remove("fa-exclamation-triangle");
                    this.panel.querySelector('#warningIcon').classList.add("fa-info-circle");
                    this.panel.querySelector('#warningIcon').style.color = "#03A9F4";
                }
                 else if (otherCount > 0) {
                      this.panel.querySelector('#warningIcon').classList.remove("fa-info-circle");
                    this.panel.querySelector('#warningIcon').classList.remove("fa-exclamation-circle"); 
                    this.panel.querySelector('#warningIcon').classList.remove("fa-exclamation-triangle");
                    this.panel.querySelector('#warningIcon').classList.add("fa-question-circle");
                    this.panel.querySelector('#warningIcon').style.color = "#808080";
                }

                this.panel.querySelector('.devTopIconAlert').style.display = 'block';
                this.panel.querySelector('.warningCount').textContent = alertCount;
            } else {
                this.panel.querySelector('.devTopIconAlert').style.display = 'none';
            }
            devDgMan.updateAlerts(alertMap, this.serialNumber);
        }
    }

    return this;
};

SubDevice.prototype.setConnected = function (status) {
    let devDgMan = document.querySelector('device-dg-manager');
    if (this.connected !== status && isFunction(this.stateChangeCb)) {
        this.connected = status;
        this.stateChangeCb(this, status);
    } else {
        this.connected = status;
    }
    if (!status) {
        this.paramInit = false;
    }

    const serialNumber = this.serialNumber;
    if (this.panel) {
        if (status) {
            this.panel.querySelector('.devConnectedIcon').style.display = 'block';
            this.panel.querySelector('.devDisconnectedIcon').style.display = 'none';

        } else {
            this.panel.querySelector('.sui-dgm-progIcon').style.display = 'none';
            this.panel.querySelector('.devConnectedIcon').style.display = 'none';
            this.panel.querySelector('.devDisconnectedIcon').style.display = 'block';
        }
    }
    return this;
};

SubDevice.prototype.initUI = function () {
    const serialNumber = this.serialNumber;

//dgm (device-dg-manager element) is available globally, and declared in deviceViewTemplate.xhtml for now.
    let devDgMan = document.querySelector('device-dg-manager');
    if (devDgMan) {
        this.panel = devDgMan.addDevicePanel(serialNumber, this);
    }

    if (this.panel) {
        /*Set this device to the currently selected device.*/
        this.panel.onclick = function () {
            devManager.setSelected(this);
            this.select();
        }.bind(this);
    }
    return this;
};

SubDevice.prototype.updataParamControlAll = function (prevDev) {
    if (this.selected) {
        for (var compName in this.getParam()) {
            this.updataParamControl(compName);
        }
        try {
            //update new functionallity @ pSettingManager
//            debugger;
            pm.clearAllDeviceParam();
            pm.onParamReceived(this, this.getParam());
        } catch (e) {
        }
    }
};
SubDevice.prototype.updataParamControl = function (compName, idx) {
    if (this.selected) {
//          console.log('update param Control');
        //Check first that this parrameter is valid, If looger did not load this param from device value is undefined
        if (this.getParam()) {

            if (idx !== undefined && idx !== null) {
                var cName = compName;
                var paramName = PF(compName).paramName;

//                    var actualParam = Number(this.getParam()[compName][i]);
                var actualParam = this.getParam()[paramName][idx];
                var value = mainUtils.getWidgetValue(cName);
                this.getParamChanges()[paramName][idx] = value;

                if (value === undefined) {
                    value = actualParam;
                }
                if (actualParam !== undefined) {
                    var controlButton = document.getElementsByClassName(cName)[0];
                    if (controlButton !== undefined) {
                        if (actualParam != value) {
                            controlButton.style.display = 'block';
                        } else {
                            controlButton.style.display = 'none';
                        }
                    }
                }
            } else if (Array.isArray(this.getParam()[compName])) {
                var arr = this.getParam()[compName];
                if (this.getParamChanges()[compName] === undefined) {
                    this.getParamChanges()[compName] = [];
                }


                for (var i = 0; i < arr.length; i++) {
                    var cName = compName + (i.toString());
//                    var actualParam = Number(this.getParam()[compName][i]);
                    var actualParam = this.getParam()[compName][i];
                    var value = mainUtils.getWidgetValue(cName);
                    this.getParamChanges()[compName][i] = value;

                    if (value === undefined) {
                        value = actualParam;
                    }
                    if (actualParam !== undefined) {
                        var controlButton = document.getElementsByClassName(cName)[0];
                        if (controlButton !== undefined) {
                            if (actualParam != value) {
                                controlButton.style.display = 'block';
                            } else {
                                controlButton.style.display = 'none';
                            }
                        }
                    }
                }
            } else {
                var actualParam = this.getParam()[compName];
                var value = mainUtils.getWidgetValue(compName);
                this.getParamChanges()[compName] = value;
                if (value === undefined) {
                    value = actualParam;
                }
                if (actualParam !== undefined) {
                    var controlButton = document.getElementsByClassName(compName)[0];
                    if (controlButton !== undefined) {
                        if (actualParam != value) {
                            controlButton.style.display = 'block';
                        } else {
                            controlButton.style.display = 'none';
                        }
                    }

                }
            }
        }
    }
};

SubDevice.prototype.checkSelected = function () {
    return this.selected === true;
};

SubDevice.prototype.select = function () {
    if (!this.selected) {
        this.selected = true;
        this.reloadParam();
        const panel = dgm.devPanelArr[this.serialNumber];
        if (this.panel) {
            this.panel.classList.add('sui-dgm-selectedDevice');
        }
    }
};

SubDevice.prototype.unselect = function () {
    if (this.selected) {
        this.selected = false;
        if (this.panel) {
            this.panel.classList.remove('sui-dgm-selectedDevice');
        }
    }
};

function DevTimer(tOutCallback, timeout, subDev) {
    this.timeout = timeout || 2000;
    this.timer = null;

    this.timerCallback = tOutCallback.bind(subDev);
    this.refreshTimer();
}
;

DevTimer.prototype.refreshTimer = function () {
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(this.timerCallback, this.timeout);
};

DevTimer.prototype.stopTimer = function () {
    window.clearTimeout(this.timer);
};



