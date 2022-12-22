/* global devManager, lv, mainUtils */

lv.prodAvailable = true;
lv.prodInit = false;
lv.prod = {db: {}};
lv.prod.wifiSigSt = false;
lv.prod.interfaceActObj = {};

lv.prod.confirmRaspLabel = function () {
    lv.prod.labelRasp = true;
    lv.prod.saveToDB(lv.prod.serial + '-labelRasp', true);
    PF('prodRaspSerialConfirmWg').show();
};
lv.prod.downloadRaspLabel = function () {
    document.getElementById('mainTabView:deviceMonitorFormID:bmsSerialLabelInput').value = lv.prod.serial;
    PF('downloadLabelLoggerLabelTemp').jq.click();
    PF('prodRaspSerialConfirmWg').hide();
};
lv.prod.initLedProd = function () {
    devManager.sendDevMessage(
            {
                instrExt: 'initProdLed',
                instrData: devManager.getSelected().serialNumber
            },
            function (devMessage, unitArr) { //success
//                console.log(unitArr);
                PF('prodLedConfirmWg').show();
            }
    );
};
lv.prod.confirmLedProd = function () {
    devManager.sendDevMessage(
            {
                instrExt: 'stopProdLed',
                instrData: devManager.getSelected().serialNumber
            },
            function (devMessage, unitArr) { //success
//                console.log(unitArr);
                lv.prod.ledInit = true;
                lv.prod.saveToDB(lv.prod.serial + '-ledInit', true);
                PF('prodLedConfirmWg').hide();
            }
    );
};
lv.prod.checkInterfaceActivityIf = function (ifName) {
    if (lv.prod.ifaceAct[ifName] !== undefined) {
        if (lv.prod.ifaceAct[ifName].rxBytes) {
            return true;
        }
    }
    return false;
};

lv.prod.checkInterfaceActivity = function () {
    if (!lv.prod.interfaceActObj.rs232) {
        if (!lv.prod.checkInterfaceActivityIf("rs232-1")) {
            mainUtils.setHtmlText("loggerVProdInterfaceAct", 'RS232-1 not Active');
            return;
        } else {
            lv.prod.interfaceActObj.rs232 = true;
        }
    }

    if (!lv.prod.interfaceActObj.rs232_2) {
        if (!lv.prod.checkInterfaceActivityIf("rs232-2")) {
            mainUtils.setHtmlText("loggerVProdInterfaceAct", 'RS232-2 not Active');
            return;
        } else {
            lv.prod.interfaceActObj.rs232_2 = true;
        }
    }

    if (!lv.prod.interfaceActObj.can1) {
        if (!lv.prod.checkInterfaceActivityIf("can-1")) {
            mainUtils.setHtmlText("loggerVProdInterfaceAct", 'CAN1 not Active');
            return;
        } else {
            lv.prod.interfaceActObj.can1 = true;
        }
    }

    if (!lv.prod.interfaceActObj.can2) {
        if (!lv.prod.checkInterfaceActivityIf("can-2")) {
            mainUtils.setHtmlText("loggerVProdInterfaceAct", 'CAN2 not Active');
            return;
        } else {
            lv.prod.interfaceActObj.can2 = true;
        }
    }

    mainUtils.setHtmlText("loggerVProdInterfaceAct", 'YES');
    lv.prod.interfaceAct = true;
};
lv.prod.checkInterfaceCount = function () {
    lv.prod.interfaceComCount = false;
    var iFaces = {};
    for (var i = 0; i < lv.interfaces.length; i++) {
        iFaces[lv.interfaces[i].interfaceName] = true;
    }
    document.querySelector('.loggerVProdInterfaceCount').style.color = 'red';
    document.querySelector('.loggerVProdInterfaceCount').style.fontSize = 'large';
    if (iFaces["can-1"] === undefined) {
        mainUtils.setHtmlText("loggerVProdInterfaceCount", 'can-1 missing');
        return;
    }
    if (iFaces["can-2"] === undefined) {
        mainUtils.setHtmlText("loggerVProdInterfaceCount", 'can-2 missing');
        return;
    }
    if (iFaces["rs232-1"] === undefined) {
        mainUtils.setHtmlText("loggerVProdInterfaceCount", 'rs232-1 missing');
        return;
    }
    if (iFaces["rs232-2"] === undefined) {
        mainUtils.setHtmlText("loggerVProdInterfaceCount", 'rs232-2 missing');
        return;
    }
    if (iFaces["rs485-1"] === undefined) {
        mainUtils.setHtmlText("loggerVProdInterfaceCount", 'rs485 missing');
        return;
    }


    mainUtils.setHtmlText("loggerVProdInterfaceCount", 'YES');
    document.querySelector('.loggerVProdInterfaceCount').style.color = 'black';
    document.querySelector('.loggerVProdInterfaceCount').style.fontSize = 'small';
    lv.prod.interfaceComCount = true;
};

lv.prod.checkInterfaceNetCount = function (interfaces) {
    lv.prod.interfaceNetCount = false;
    document.querySelector('.loggerVProdInterfaceNetCount').style.color = 'red';
    document.querySelector('.loggerVProdInterfaceNetCount').style.fontSize = 'large';
    if (interfaces["br0"] === undefined) {
        mainUtils.setHtmlText("loggerVProdInterfaceNetCount", 'br0-1 missing');
        return;
    }
    if (interfaces["eth0"] === undefined) {
        mainUtils.setHtmlText("loggerVProdInterfaceNetCount", 'eth0-2 missing');
        return;
    }
    if (interfaces["eth1"] === undefined) {
        mainUtils.setHtmlText("loggerVProdInterfaceNetCount", 'eth1 missing');
        return;
    }
    if (interfaces["wlan0"] === undefined) {
        mainUtils.setHtmlText("loggerVProdInterfaceNetCount", 'wlan0 missing');
        return;
    }
    if (interfaces["wlan1"] === undefined) {
        mainUtils.setHtmlText("loggerVProdInterfaceNetCount", 'wlan1 missing');
        return;
    }


    mainUtils.setHtmlText("loggerVProdInterfaceNetCount", 'YES');
    document.querySelector('.loggerVProdInterfaceNetCount').style.color = 'black';
    document.querySelector('.loggerVProdInterfaceNetCount').style.fontSize = 'small';
    lv.prod.interfaceNetCount = true;
};

lv.prod.verifyStage = function () {
    if (!lv.prod.labelRasp) {
        return;
    }
    if (!lv.prod.ledInit) {
        return;
    }

    if (!lv.prod.interfaceComCount) {
        return;
    }
    if (!lv.prod.interfaceNetCount) {
        return;
    }
    if (!lv.prod.wifiSigSt) {
        return;
    }
    if (!lv.prod.interfaceAct) {
        return;
    }

    PF('prodCompleteButtinWg').enable();
};

lv.prod.checkToComplete = function () {
//                completerLogger([
//                    {
//                        name: "prodParam",
//                        value: JSON.stringify(lv.prod.complete)
//                    }
//                ]);
    devManager.sendDevMessage(
            {
                instrExt: 'factoryReset',
                instrData: devManager.getSelected().serialNumber
            },
            function (devMessage, sig) { //success
                completerLogger([
                    {
                        name: "prodParam",
                        value: JSON.stringify(lv.prod.complete)
                    }
                ]);
                mainUtils.showInfoMessage('Successfully Complete');
            }
    );
};

lv.prod.factoryReset = function () {
    mainUtils.showInfoMessage('Successfully Complete');
};

lv.prod.checkWiFiSignalStrength = function (signalMap) {
    if (lv.prod.wifiHighestSigna === undefined) {
        lv.prod.wifiHighestSigna = -100;
    }

    if (signalMap !== undefined && signalMap !== null) {

        for (var ssid in signalMap) {
            let signal = signalMap[ssid];
            if (ssid.includes('LoggerV_RefSignal')) {
                let signalStrArr = signal.prop;
                for (var i = 0; i < signalStrArr.length; i++) {
                    let signalStr = signalStrArr[i];
                    if (signalStr.indexOf('level=') !== -1) {

                        let sigNum = Number(signalStr.substring(signalStr.indexOf('level=') + 6, signalStr.length));
                        if (sigNum > lv.prod.wifiHighestSigna) {
                            lv.prod.wifiHighestSigna = sigNum;
                            break;
                        }
                    }
                }
            }
        }

        if (lv.prod.wifiHighestSigna === -100) {
            mainUtils.setHtmlText("loggerVProdWifiSig", 'No [LoggerV_RefSignal] SSID detected');
        } else {
            if (lv.prod.wifiHighestSigna > -59) {
                mainUtils.setHtmlText("loggerVProdWifiSig", 'YES ' + lv.prod.wifiHighestSigna + 'dBm');
                lv.prod.wifiSigSt = true;
            } else {
                mainUtils.setHtmlText("loggerVProdWifiSig", 'Too LOW ' + lv.prod.wifiHighestSigna + 'dBm MIN 59dBm');
                lv.prod.wifiSigSt = false;
            }
        }
    }

};
devManager.onDataReceived(function (dev, data) {
//    console.log(data);
    if (lv.prod.ifaceAct === undefined) {
        lv.prod.ifaceAct = {};
    }
    for (var ifName in data.interfaceInfoMap) {
//        var act = lv.prod.ifaceAct[ifName];
//        var newVal = data.interfaceInfoMap[ifName];

        lv.prod.ifaceAct[ifName] = data.interfaceInfoMap[ifName];
//        if (act === undefined) {
//            lv.prod.ifaceAct[ifName] = newVal;
//        } else {
//            if (act.busRxLoad < newVal.busRxLoad) {
//                act.busRxLoad = newVal.busRxLoad;
//            }
//            if (act.busTxLoad < newVal.busTxLoad) {
//                act.busTxLoad = newVal.busTxLoad;
//            }
//        }
        lv.prod.checkInterfaceActivity();
        lv.prod.checkInterfaceCount();
        lv.prod.checkInterfaceNetCount(data.interfaceStatusMap);
        if (data.availableSignals && data.availableSignals.wlan1) {
            lv.prod.checkWiFiSignalStrength(data.availableSignals.wlan1);
        }
    }

    if (!lv.prod.labelRasp) {
        let label = lv.prod.loadFromDB(lv.prod.serial + '-labelRasp') === "true";
        if (label) {
            lv.prod.labelRasp = label;
            mainUtils.setHtmlText("loggerVProdRaspLabel", 'YES');
        } else {
            mainUtils.setHtmlText("loggerVProdRaspLabel", 'NO');
        }
    } else {
        mainUtils.setHtmlText("loggerVProdRaspLabel", 'YES');
    }

    if (!lv.prod.ledInit) {
        let led = lv.prod.loadFromDB(lv.prod.serial + '-ledInit') === "true";
        if (led) {
            lv.prod.ledInit = led;
            mainUtils.setHtmlText("loggerVProdLed", 'YES');
        } else {
            mainUtils.setHtmlText("loggerVProdLed", 'NO');
        }
    } else {
        mainUtils.setHtmlText("loggerVProdLed", 'YES');
    }

    lv.prod.verifyStage();
});

devManager.onParamReceived(function (dev, param) {
    console.log(param);
    lv.prod.eth0mac = param.networkIfaceMap.eth0.mac;
    lv.prod.serial = param.serialNumber;
    lv.prod.networkIfaceMap = param.networkIfaceMap;
//                lv.prod.fwVer = unitArr.fwVer;
    lv.prod.fwVer = param.swVer;
    lv.prod.hwVer = param.hwVer;
    mainUtils.setHtmlText("loggerVProdSerial", lv.prod.serial);
    mainUtils.setHtmlText("loggerVProdeth0mac", lv.prod.eth0mac);

    lv.prod.complete = {
        eth0: lv.prod.eth0mac,
        eth1: param.networkIfaceMap.eth1.mac,
        fwVer: param.swVer,
        hwVer: param.hwVer,
        serial: param.serialNumber,

        serialPlain: param.serialNumber,
        uap0: param.networkIfaceMap.wlan0.mac,
        wiFiPass: param.networkIfaceMap.wlan0.wifiApConf.wpaPassPhrase,
        wiFiSsid: param.networkIfaceMap.wlan0.wifiApConf.ssid,
        wlan0: param.networkIfaceMap.wlan1.mac
    };
    document.getElementById('mainTabView:deviceMonitorFormID:bmsSerialLabelInput').value = lv.prod.serial;

});

lv.prod.loadFromDB = function (key) {

    if (typeof (Storage) !== "undefined") {
        // Store
        lv.prod.db[key] = localStorage.getItem("lv.prod.db." + key);
        return lv.prod.db[key];
    }
    return null;
};

lv.prod.saveToDB = function (key, val) {
    if (typeof (Storage) !== "undefined") {
        // Store
        lv.prod.db[key] = val;
        localStorage.setItem("lv.prod.db." + key, val);
    }
};


$(document).ready(function () {
    //init repair settings
    //
    let cont = document.getElementById('repairPanel');

    new ParamSetting(cont, {
        type: 'dropDownButton',
        title: 'Factory Reset :',
        ctrlInfo: 'Use this only for Repaired loggers with new SD cards. \n\
            This will reboot the logger and reconnect to login.mypower24.co.za',
        content: [
            {name: 'ReInit', cb: function () {
                    wsm.sendDevMsgExecWithJsonInst({instrExt: 'factoryResetTest', showMessage: true})
                }}
        ]
    });
    new ParamSetting(cont, {
        instrExt: 'setHwVersion',
        type: 'inputNumber',
        title: 'Shield Hw version:',
        ctrlInfo: 'Use this only for Repaired loggers with new SD cards. \n\
            This will change the logger hardware version.',
        
        content: [
            {name: 'ReInit', cb: function () {
                    wsm.sendDevMsgExecWithJsonInst({instrExt: 'factoryReset', showMessage: true})
                }}
        ]
    });
});

/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, em, mu */


