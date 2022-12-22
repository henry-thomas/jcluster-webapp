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
/* global moment, pcMan, SVG, hhContentBuilder, emsContent, hh, wsm, cont, pm, dm, emsGuiData */

var emsGui = {
    exec: {},
    comp: {},
    svgSettings: {},
    availableDevices: null
};

emsGui.exec.testInst = function (instr, val) {
    let msg = {instrExt: instr};
    msg[instr] = val || null;
    wsm.sendDevMsgExecWithJsonInst(
            msg,
            function (message, response) {
                console.log("Result: ", response);
            },
            function (message, response) {
                console.warn("No Energy Management Units Found " + response);
            },
            3000);
//    console.log("send object request");
};
//create dialog for selecting available power by tipe. 
//before you open it you must assigne the type you serching like: emsGui.comp.availableDeviceSelection.powerSelection = "renewable";

emsGui.createDialogAvailableInputs = function () {
    let dialog = new SMDUIDialog({modal: true, draggable: true,
        //on dialog show, fetch content and populate in table
        onshow: function (d) {
            let dCont = d.contentDiv;
            hh.removeAllChilds(dCont);
            hh.div(dCont, 'display: flex');
            wsm.sendDevMsgExecWithJsonInst({instrExt: 'getDigitalInputList'},
                    function (message, response) {
//                      debugger;
                        let successCb = emsGui.comp.availableInputSelection.successCb;
                        let selData = emsGui.comp.availableInputSelection.data;
                        let deviceSerial = selData.deviceSrialNumber || 'unknown';
                        let cont = hh.createActDataPanelCard("Available Devices " + deviceSerial);
                        d.setBarTitle('Select Available Inputs: ' + deviceSerial);
                        dCont.appendChild(cont);
                        emsGui.availableInputs = response;
                        let ctrlMethod = new SMDUIDropDown(cont, {val: selData.enableStateInput, options: [{label: 'Enable On Input', value: true}, {label: 'Disable On Input', value: false}]});
                        let onInputMissing = new SMDUIDropDown(cont, {val: selData.onInputMissing, options: [{label: 'Enable when input missing', value: true}, {label: 'Disable when input missing', value: false}]});
                        for (var item in response) {
                            let din = response[item];
                            let objSer = din.deviceSerial;
                            let desc = din.label;
                            new ParamSetting(cont, {type: 'dropDownButton', title: objSer + ' - ' + desc,
                                ctrlInfo: 'Input at device: ' + objSer + ', Connection status: <strong>' + (din.connected ? 'Connected' : 'Disconnected') + '</strong>, id: ' + din.id + ', Current State: ' + din.state,
                                content: [
                                    {name: 'Set ' + objSer,
                                        cb: function (input) {
                                            wsm.sendDevMsgExecWithJsonInst({
                                                instrExt: 'stateInputSet',
                                                inputId: input.id,
                                                type: emsGui.comp.availableInputSelection.type,
                                                genSerNum: emsGui.comp.availableInputSelection.deviceSerial || 'unknown',
                                                enableStateInput: ctrlMethod.getValue(),
                                                onInputMissing: onInputMissing.getValue(),
                                                showMessage: true
                                            }, function (dev, msg) {//on success
                                                mu.showMessage("Success", 'Input set complete.');
                                                selData.inputId = input.id;
                                                selData.enableStateInput = ctrlMethod.getValue();
                                                emsGui.comp.availableInputSelection.hide();
                                                if (typeof (successCb) === 'function') {
                                                    successCb();
                                                }
                                            });
                                        }.bind(this, din)}
                                ]
                            });
                        }
                        d.positionCenter();
                    },
                    function (msg, err) {
                        hh.pPanelAddDescTitle(cont, err);
                    });
        }
    });
    emsGui.comp.availableInputSelection = dialog;
};


emsGui.populateAvailableSelection = function (cont, typeArr, devDescMap, type) {
    for (var idx in typeArr) {
        let device = typeArr[idx];
        let serial = device.serialNumber;
        let desc = devDescMap[device.serialNumber];

        new ParamSetting(cont, {type: 'dropDownButton', title: (desc.displayName || serial) + ' [' + serial + ']',
            ctrlInfo: desc.deviceName + '. hw: ' + desc.hwVer + ', fw:' + desc.fwVer + ', Manufacturer: ' + desc.manufacturer + ', Status: ' + (desc.connected ? 'Connected' : 'Disconnected'),
            content: [
                {name: 'Add ' + serial,
                    cb: function (dev, t, serial) {
                        wsm.sendDevMsgExecWithJsonInst({instrExt: 'attachDevice', type: t, serialNumber: serial, showMessage: true});
                    }.bind(this, device, type, serial)}
            ]
        });
    }
};

emsGui.createDialogAvailableSelection = function () {
    let dialog = new SMDUIDialog({modal: true, draggable: true,
        //on dialog show, fetch content and populate in table
        onshow: function (d) {
            wsm.sendDevMsgExecWithJsonInst({instrExt: 'getAvailableControlDevices'},
                    function (message, response) {
                        let dCont = d.contentDiv;
                        hh.removeAllChilds(dCont);

                        let cont = hh.div(dCont, 'display: flex');


                        if (response.hybridStorage.length > 0) {
                            hh.pPanelAddDescTitle(cont, 'Emergy Storage Devices.');
                            emsGui.populateAvailableSelection(cont, response.hybridStorage, response.devDesc, 'hybridStorage');
                        }
                        if (response.renewable.length > 0) {
                            hh.pPanelAddDescTitle(cont, 'Renewable Devices.');
                            emsGui.populateAvailableSelection(cont, response.renewable, response.devDesc, 'renewable');
                        }
                        if (response.pmon.length > 0) {
                            hh.pPanelAddDescTitle(cont, 'Grid Monitor Devices.');
                            emsGui.populateAvailableSelection(cont, response.pmon, response.devDesc, 'grid');
                        }
//                       
                        d.positionCenter();
                    },
                    function (msg, err) {
                        hh.pPanelAddDescTitle(cont, err);
                    });
        }
    });
    emsGui.comp.availableDeviceSelection = dialog;
};

emsGui.createAdvancedSettingsTab = function () {
    let mainCont = emsContent.comp.mainTabPanel.getItemContentById('advSettings');
    let acordPanel = new SMDUIAccordianPanel(mainCont, {tabs: [
            {label: 'General Settings', id: 'generalSettings'},
            {label: 'Control Device Group Settings', id: 'cdGroupSettings'}
        ], selectedTab: 'generalSettings'});
//    debugger;
    let gPCont = acordPanel.getTabContentById('generalSettings');
    new ParamSetting(gPCont, {
        type: 'dropDownButton',
        title: 'Add new Device:',
        ctrlInfo: 'Display a list with available devices. ',
        content: [
            {name: 'Scan available', cb: function () {
                    emsGui.comp.availableDeviceSelection.show();
                }}
        ]
    });


    gPCont = acordPanel.getTabContentById('cdGroupSettings');
    new ParamSetting(gPCont, 'groupCdEqualizingPowerDiff', {type: 'inputNumber', title: 'Equilizing power in group', ctrlInfo: '.'});
    new ParamSetting(gPCont, 'groupCdEqualizingPowerStep', {type: 'inputNumber', title: 'Equilizing power in group Step', ctrlInfo: '.'});
};

emsGui.initContent = function () {
    emsContent.comp.mainTabPanel = new TabPanel(dgm.contentPanel, {
        menuItem: [
            {label: "Actual Data", id: 'actualData'},
            {label: "Advanced Settings", id: 'advSettings'}
        ],
        selected: 'actualData'
    });
    let confDiv = hh.div(emsContent.comp.mainTabPanel.getItemContentById('config'), 'display: flex; justify-content: space-around; padding: 10px');
    hh.img(confDiv, 'svg8', 'height: 450px; width: auto;');
    emsGui.createAdvancedSettingsTab();

    emsGui.createDialogAvailableSelection();
    emsGui.createDialogAvailableInputs();
    emsGuiData.init();
};

//emsGui.test = function () {
//    let instr = 'getRandomCPU';
//    let msg = {instrExt: instr};
//    wsm.sendDevMsgExecWithJsonInst(msg,
//            function (message, response) {
//                emsGui.editCpUnit(response);
//                console.log(response);
//            },
//            function (message, response) {
//                console.warn("No Energy Management Units Found " + response);
//            },
//            3000);
//};

$(document).ready(function () {
    emsGui.initContent();
});
