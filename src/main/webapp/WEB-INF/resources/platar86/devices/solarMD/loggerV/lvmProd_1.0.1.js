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

/* global hh, wsm, mainUtils, dm, Storage, PF, prot */

(function (root) {
    function LvmProd() {
        this.statMap = {};
        this.db = {};
        this.selectedSerial = "";

        this.stepMap = {
           
            iFaceCOMSFlag: false,
            iFaceNetFlag: false,
            wifiSigFlag: false,
            eth0Flag: false,
            ioState: false
        };

        this.completeObj = {};

        this.iFaceRequiredMap = {
            'can-1': false,
            'can-2': false,
            'rs232-1': false,
            'rs232-2': false,
            'rs485-1': false,
            'rs485-2': false
        };

        this.iFaceNetMap = {
            "wlan1": {},
            "wlan0": {},
            "br0": {},
            "lo": {},
            "eth1": {},
            "eth0": {}
        };

        this.contentDiv = document.querySelector('.lvmProdDiv');
        _initGui.call(this);
    }
    let prot = LvmProd.prototype;

    function _initGui() {
        this.iFaceDataCard = hh.createActDataPanelCard('Interface Status', null, this.contentDiv);

        this.statusCard = hh.createActDataPanelCard('Logger Status Data', null, this.contentDiv);

        this.serial = hh.adf(this.statusCard, "Serial Number");
        this.iFaceCOMS = hh.adf(this.statusCard, "Interface COMS");
        this.iFaceNET = hh.adf(this.statusCard, "Interface NET");
        this.ioTest = hh.adf(this.statusCard, "IO Test");
        this.wifiSignal = hh.adf(this.statusCard, "WiFi Signal");
        this.eth0Mac = hh.adf(this.statusCard, "eth0 Mac");
//        this.serialPrinted = hh.adf(this.statusCard, "Serial Printed");
//        this.ledVerified = hh.adf(this.statusCard, "LED Verified");

        wsm.onMessageFastData = _onDataRec.bind(this);
    }

    function _onDataRec(data) {
        this.selectedSerial = dm.selected.serialNumber;
        this.serial.value = this.selectedSerial;

        let ioStateMap = data.messageList[0].ioStateMap;

        let iFaceNetStateMap = data.messageList[0].iFaceNetStateMap;

        _checkWiFiSignal.call(this, iFaceNetStateMap);


        this.stepMap.ioState = ioStateMap['IO-Test'];
        this.ioTest.value = ioStateMap['IO-Test'] ? "Passed" : "Failed";

        let iFaceStateMap = data.messageList[0].iFaceStateMap;

        _checkCommIFaces.call(this, iFaceStateMap);

        let selectedData = dm.selected.data;

        _checkNet.call(this, selectedData);

        let selectedParam = dm.selected.param;

        _checkEth0Mac.call(this, selectedParam);

        _updateCompleteObj.call(this, selectedParam);

//        _checkLabelConfirmed.call(this);
//
//        _checkLedConfirmed.call(this);

        _verifyStage.call(this);

    }



    prot.initLedTest = function () {
        dm.sendDevMessage(
                {
                    instrExt: 'initProdLed',
                    instrData: dm.getSelected().serialNumber
                },
                function (devMessage, unitArr) { //success
//                console.log(unitArr);
                    PF('prodLedConfirmWg').show();
                }
        );
    };

    prot.onLedTestConfirm = function () {
        PF('prodLedConfirmWg').hide();
        dm.sendDevMessage(
                {
                    instrExt: 'stopProdLed',
                    instrData: dm.getSelected().serialNumber
                },
                function (devMessage, unitArr) { //success
//                console.log(unitArr);
//                    this.stepMap.ledConfirmed = true;
                    _saveToDB.call(this, this.selectedSerial + '-ledConfirmed', true);
                    this.completeLogger();
                }.bind(this),
                function (data, msg) {
                    mainUtils.showErrorMessage(msg);
                }
        );
    };

    prot.confirmRaspLabel = function () {
//        this.stepMap.labelConfirmed = true;
        _saveToDB.call(this, this.selectedSerial + '-labelRasp', true);
        PF('prodRaspSerialConfirmWg').show();
        console.log("HJjaosf0");
    };

    prot.downloadLabel = function () {
        document.getElementById('mainTabView:deviceMonitorFormID:bmsSerialLabelInput').value = this.selectedSerial;
        PF('downloadLabelLoggerLabelTemp').jq.click();
        PF('prodRaspSerialConfirmWg').hide();
    };

    prot.completeLogger = function () {
        dm.sendDevMessage(
                {
                    instrExt: 'factoryReset',
                    instrData: dm.getSelected().serialNumber
                },
                function (devMessage, sig) { //success
//                    completerLogger([
//                        {
//                            name: "prodParam",
//                            value: JSON.stringify(this.completeObj)
//                        }
//                    ]);
                    mainUtils.showInfoMessage('Successfully Complete');
                }.bind(this)
                );
    };

    function _updateCompleteObj(selectedParam) {
        this.completeObj = {
            eth0: selectedParam.networkIfaceMap.eth0.mac,
            eth1: selectedParam.networkIfaceMap.eth1.mac,
            fwVer: selectedParam.swVer,
            hwVer: selectedParam.hwVer,
            serial: selectedParam.serialNumber,

            serialPlain: selectedParam.serialNumber,
            uap0: selectedParam.networkIfaceMap.wlan0.mac,
            wiFiPass: selectedParam.networkIfaceMap.wlan0.wifiApConf?.wpaPassPhrase || "",
            wiFiSsid: selectedParam.networkIfaceMap.wlan0.wifiApConf?.ssid || "",
            wlan0: selectedParam.networkIfaceMap.wlan1.mac
        };
    }

    function _checkCommIFaces(iFaceStateMap) {
        for (var iFace in this.iFaceRequiredMap) {
            if (!this.statMap[iFace]) {
                this.statMap[iFace] = hh.adf(this.iFaceDataCard, iFace);
            }
        }

        let missingList = "";
        for (let item in this.iFaceRequiredMap) {
            if (!Object.keys(iFaceStateMap).includes(item) || !iFaceStateMap[item]) {
                console.warn(item + ' is missing!');
                missingList += " " + item;
            } else {
                this.iFaceRequiredMap[item] = iFaceStateMap[item];
            }
        }

        if (missingList === "") {
            this.iFaceCOMS.value = "Yes";
            this.stepMap.iFaceCOMSFlag = true;
        } else {
            this.iFaceCOMS.value = missingList + ' is not active!';
            this.stepMap.iFaceCOMSFlag = false;
        }

        for (var item in iFaceStateMap) {
            this.statMap[item].value = iFaceStateMap[item];
        }
    }

    function _checkNet(selectedData) {

        for (let iFace in this.iFaceNetMap) {
            if (!Object.keys(selectedData.interfaceStatusMap).includes(iFace)) {
                this.iFaceNET.value = iFace + " missing";
                this.stepMap.iFaceNetFlag = false;
                break;
            }
            this.stepMap.iFaceNetFlag = true;
            this.iFaceNET.value = "Yes";
        }
    }

    function _checkEth0Mac(selectedParam) {
        this.eth0Mac.value = selectedParam.networkIfaceMap.eth0.mac.toUpperCase();

        if (selectedParam.networkIfaceMap.eth0.mac) {
            this.stepMap.eth0Flag = true;
        } else {
            this.stepMap.eth0Flag = false;
        }
    }

    function _checkLedConfirmed() {
        if (!this.stepMap.ledConfirmed) {
            let led = _loadFromDB.call(this, this.selectedSerial + '-ledConfirmed') === "true";
            if (led) {
                this.stepMap.ledConfirmed = led;
                this.ledVerified.value = "Yes";
            } else {
                this.ledVerified.value = "No";
            }
        } else {
            this.ledVerified.value = "Yes";
        }
    }

    function _checkLabelConfirmed() {
        if (!this.labelConfirmed) {
            let label = _loadFromDB.call(this, this.selectedSerial + '-labelRasp') === "true";
            if (label) {
                this.stepMap.labelConfirmed = label;
                this.serialPrinted.value = "Yes";
            } else {
                this.serialPrinted.value = "No";
            }
        } else {
            this.serialPrinted.value = "Yes";
        }
    }

    function _verifyStage() {
        for (var item in this.stepMap) {
            if (!this.stepMap[item]) {
                PF('prodInitLedBtnWg').disable();
                return;
            }
        }
        PF('prodInitLedBtnWg').enable();
    }

    function _loadFromDB(key) {

        if (typeof (Storage) !== "undefined") {
            // Store
            this.db[key] = localStorage.getItem("lv.prod.db." + key);
            return this.db[key];
        }
        return null;
    }

    function _saveToDB(key, val) {
        if (typeof (Storage) !== "undefined") {
            // Store
            this.db[key] = val;
            localStorage.setItem("lv.prod.db." + key, val);
        }
    }

    function _checkWiFiSignal(netMap) {
        let failedWifiString = '';
        let failed = false;
        for (var item in netMap) {
            if (!item) {
                this.stepMap.wifiSigFlag = false;
                failedWifiString += item + ' ';
                failed = true;
            }
        }


        if (!failed) {
            this.stepMap.wifiSigFlag = true;
            this.wifiSignal.value = 'Passed';
        } else {
            this.wifiSignal.value = 'Failed: ' + failedWifiString;
        }
    }

    root.lvmProd = new LvmProd();
}(window));


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
