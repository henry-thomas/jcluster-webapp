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


/* global mqttClientGui, hh, wsm, mu, mainUtils, dm */

let mqttClient = {
    fn: {
        onSetUriClick: function (uri) {

        }
    },
    init: function () {
        wsm.devModel = 3002;
        getDevList();
        mqttClient.deviceFetchInterval = setInterval(getDevList, 1000);

        mqttClient.uriSetDialog = new SMDUIDialog({
            heading: 'Add Client',
            draggable: true,
            onInitComplete: function (contentDiv, footerDiv, comp) {
                contentDiv.classList.add('devParamPanelWrapper');
                let inputObj = {};

                function createInput(parent, lbl, inf) {
                    let value = "";

                    let wrapper = document.createElement('div');
                    wrapper.classList.add('devParamPanel');
                    let label = document.createElement('span');
                    label.classList.add('ctrlLabel');
                    label.style.gridArea = 'label';
                    label.textContent = lbl;

                    let info = document.createElement('span');
                    info.classList.add('ctrlInfo');
                    info.style.gridArea = 'info';
                    info.textContent = inf;

                    let input = document.createElement('input');
                    input.style.gridArea = 'input';
                    input.style.width = '120px';
                    input.classList.add('ctrlValue');
                    input.classList.add('ui-inputfield');
                    input.oninput = function () {
                        wrapper.val = input.value;
                    }.bind(this);

                    wrapper.val = "";

                    wrapper.appendChild(label);
                    wrapper.appendChild(info);
                    wrapper.appendChild(input);
                    if (parent) {
                        parent.appendChild(wrapper);
                    }
                    return wrapper;
                }

                let name = createInput(contentDiv, 'Serial Number', 'Unique Name for Client');
//                let serverUri = createInput(contentDiv, 'Server Uri', 'The broker/server URI Eg: tcp://localhost:1883');
//                let username = createInput(contentDiv, 'Username', 'Only if username is required');
//                let password = createInput(contentDiv, 'Password', 'Only if password is required');

                let connectButton = hh.button(footerDiv, 'Connect');
                connectButton.onclick = function () {
                    inputObj.name = name.val;
                    sendInst("createMqttClient", name.val);
                    mqttClient.uriSetDialog.close();
                    getDevList();
                };

                function sendInst(instr, val) {
                    let msg = {instrExt: instr};
                    msg[instr] = val || "";
                    wsm.sendDevMsgExecWithJsonInst(
                            msg,
                            function (message, response) {
                                console.log("Result: ", response);
                                mu.showInfoMessage(response, 'Success setting: ' + message.instrExt);
                            },
                            function (message, err) {
                                mu.showErrorMessage(err, 'Error setting: ' + message.instrExt);
                            },
                            3000);
//    console.log("send object request");
                }
            }
        });
        dgm.addFotterButton('New Client', function () {
            mqttClient.uriSetDialog.open();
        })
    }

};

function getDevList() {
    wsm.sendDevMsgExecWithJsonInst(
            {instrExt: 'getUnitList'},
            function (message, response) {
                if (Object.keys(response).length > 0) {

                    clearInterval(mqttClient.deviceFetchInterval);
                    console.log("Found MQTT Units: ", response);
                    dm.initDevList(response);
                    wsm.alternativePath = "mqttUnit";

                }
            },
            function (message, response) {
                console.warn("No MQTT Units Found: " + response);
            },
            3000);
}

mqttClient.getDevList = getDevList;

mqttClient.updateInfo = function (subdev) {
    let data = subdev.data;

    mainUtils.setHtmlText('clientConnected', data.clientConnected);
    mainUtils.setHtmlText('serverUrix', data.serverUri);
    mainUtils.setHtmlText('inputPowerMessagesCount', data.inputPowerMessagesCount);
    mainUtils.setHtmlText('inputEnergyMessagesCount', data.inputEnergyMessagesCount);
    mainUtils.setHtmlText('outputEnergyMessagesCount', data.outputEnergyMessagesCount);
    mainUtils.setHtmlText('outputPowerMessagesCount', data.outputPowerMessagesCount);
    mainUtils.setHtmlText('messagesPerBroadcast', data.messagesPerBroadcast);
};

mqttClient.onSelChanged = function (subdev) {
    let data = subdev.data;
    mainUtils.setHtmlText('clientConnected', data.clientConnected);
    mainUtils.setHtmlText('serverUrix', data.serverUri);
    mainUtils.setHtmlText('inputPowerMessagesCount', data.inputPowerMessagesCount);
    mainUtils.setHtmlText('inputEnergyMessagesCount', data.inputEnergyMessagesCount);
    mainUtils.setHtmlText('outputEnergyMessagesCount', data.outputEnergyMessagesCount);
    mainUtils.setHtmlText('outputPowerMessagesCount', data.outputPowerMessagesCount);
    mainUtils.setHtmlText('messagesPerBroadcast', data.messagesPerBroadcast);
};

$(document).ready(function () {
    mqttClient.init();
    mqttClientGui.populateClientSettings();
    dm.onSelectedDataReceived(mqttClient.updateInfo);
    dm.onSelectedChange(mqttClient.updateInfo);
});

