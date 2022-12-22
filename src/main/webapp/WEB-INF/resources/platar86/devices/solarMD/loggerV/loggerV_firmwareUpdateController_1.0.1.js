/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by natha, 2022
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */

/* global Element, hh, SVG */

(function (root) {

    function SMDUILoggervFirmwareController(el, conf) {
        this.conf = conf || {};
        this.currentFirmwareVersion = conf.lvmVersion["mbFwVer"] || null;
        this.file;
        this.firmwareList = conf.availableUpdates || null;
        this.firmwareUiList;
        this.fields = {};
        this.card = hh.validateDomEl(el);
        if (this.card === null) {
            console.warn('Invalid element');
            return;
        }
        init.call(this, el);
    }



    function init(element) {
        let f = this.fields;
        let cont = this.container = hh.div(element, "updateFirmwareWrapper");
        let testDiv = hh.div("firmwarListWrapper");
        testDiv.style.display = "flex";
        testDiv.style.flexDirection = "column";

        dm.onProgressDialogCreate('LoggerLvmFwUpdatePrg', function (dev, prog, id) {
            let row = document.createElement("div");
            row.style.display = "flex";
            let spinner = document.createElement("div");
            let lable = document.createElement("span");
            lable.style.paddingLeft = "10px";
            lable.innerHTML = "Downloading...";
            row.appendChild(spinner);
            row.appendChild(lable);
            spinner.id = "loading";
            spinner.style.display = "inline-block";
            spinner.style.width = "20px";
            spinner.style.height = "20px";
            spinner.style.border = "3px solid rgb(42 42 42 / 30%)";
            spinner.style.borderRadius = "50%";
            spinner.style.borderTopColor = "#808080";
            spinner.style.animation = "spin 1s ease-in-out infinite";
//            closeLoader(spinner, false);

//            spinner.style.webkitAnimation = "spin 1s ease-in-out infinite";

            id.contentDiv.appendChild(
                    row);
//            debugger;
        });

//        function closeLoader(bool, spinner) {
//
//            if (bool === true) {
//                spinner.style.display = "none";
//            }
//        }

        dm.onProgressData('LoggerLvmFwUpdatePrg', function (dev, prog, id) {

            console.log(prog.pState);

            if (prog.prop.text === "Error ConnectException") {
//                closeLoader(true);
            }

        });

        addFirmwareList.call(this, this.firmwareList, testDiv);

        let self = this;
        f.dialog = new SMDUIDialog({
            heading: "Current version: " + this.currentFirmwareVersion,
            onInitComplete: function (contentDiv, footerDiv, comp) {
                contentDiv.style.display = 'flex';
                contentDiv.style.flexDirection = 'row';
                contentDiv.appendChild(testDiv);
                let updatBtn = hh.button(footerDiv, "Update");
                updatBtn.addEventListener("click", installLoggerFirmware.bind(self));

                let checkForLvmBtn = hh.button(footerDiv, "Check Online");
                checkForLvmBtn.addEventListener("click", checkForUddate.bind(self));
            }
        });
        f.dialog.open();
    }



    function updateSelectedVal(file, firmwareVersion, selected, element) {
        this.file = file;
        let nodes = element.childNodes;
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].style.background = "white";
        }
        selected.style.background = "lightblue";
    }

    function installLoggerFirmware() {
        wsm.sendDevMsgExecWithJsonInst({
            instrExt: 'updateLvmFw',
            showMessage: true,
            filePath: this.file

        });
    }

    function checkForUddate() {
//        wsm.sendDevMsgExecWithJsonInst({
//            instrExt: 'checkForLvmFwUpdate',
//            showMessage: true,
//        });

        let firmwareData = {};
        wsm.sendDevMsgExecWithJsonInst(
                {
                    instrExt: 'checkForLvmFwUpdate',
                    showMessage: true
                },
                function (message, data) {
                    openDialog(data);
                });
    }

    function addFirmwareList(testList, element) {
        for (const [index, [, value]] of Object.entries(Object.entries(testList))) {


            versionRow = hh.div(element);
            versionRow.style.margin = "3px";
            versionRow.style.width = "200px";
            versionRow.style.padding = "5px";
            versionRow.style.borderRadius = "3px";
            versionRow.style.cursor = "pointer";


            let versionLbl = hh.span(versionRow);
            let fwVersion = value["fwVer"];
            let filePath = value["file"];
            versionRow.addEventListener("click", updateSelectedVal.bind(this, filePath, fwVersion, versionRow, element));
            versionLbl.innerHTML = "Firmware Version: " + fwVersion;
            element.appendChild(versionRow);
        }

    }


    root.SMDUILoggervFirmwareController = SMDUILoggervFirmwareController;



})(window);
function openDialog(data) {
    window.lvmUpdateController = new SMDUILoggervFirmwareController("frimwareControllerWrapper", data);

}


function clickFuntion() {
//    window.lvmUpdateController = new SMDUILoggervFirmwareController("frimwareControllerWrapper", fimwareUpdateObject);
    let firmwareData = {};
    wsm.sendDevMsgExecWithJsonInst(
            {
                instrExt: 'getFwInfo',
                showMessage: true
            },
            function (message, data) {
                openDialog(data);
            });
//

}

//{currentFirmwareVersion:'CurrentVersion'}


//let fimwareUpdateObject = {
//    "lvmVersion": {
//        "mbSerialNumber": "791229438",
//        "mbFwVer": 105,
//        "mbHwVer": 221,
//        "manufDate": -1,
//        "canbusIfaceCount": 2,
//        "rs232IfaceCount": 2,
//        "rs485IfaceCount": 2,
//        "digitalInputs": 4,
//        "analogInputs": 4,
//        "digitalOutputs": 2,
//        "relayOutputs": 2,
//        "analogOutputs": 0,
//        "blEnviroment": 0,
//        "driverVersion": 1014
//    },
//    "availableUpdates": {
//        //These are hardcoded, because they ended up in /home/root/update/lvm folder during initial production.
//        //Updates from server will end up in /home/root/update/lvmFw folder, which is 
//        //where the logger looks for downloaded updates.
//        
//        //We can actually remove them since ver106 is installed during production!
//        
//        "105": {
//            "hwVer": 221,
//            "fwVer": 105,
//            "file": "/home/root/update/lvm/LV2-MB_fw105_hw221.bin"
//        },
//        "106": {
//            "hwVer": 221,
//            "fwVer": 106,
//            "file": "/home/root/update/lvm/LV2-MB_fw106_hw221.bin"
//        }
//
//    }
//};