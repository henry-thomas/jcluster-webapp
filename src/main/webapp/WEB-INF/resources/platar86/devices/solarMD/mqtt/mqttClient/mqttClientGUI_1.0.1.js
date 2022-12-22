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

/* global hhContentBuilder, hh, mainUtils, pm */

var mqttClientGui = {};
var aegScWebCont = {
    comp: {}
};
aegScWebCont.main = {
    tabPanel: {_conf: {sticky: true, initSelect: 0, role: 'AdvancedUser'},
        'Client Information': {
            div: {class: 'actDataContainer',
                dataPanel_generalInfo: {title: 'Publish Information',
                    "dataField_clientConnected": {title: 'Client Connected', unit: ""},
                    "dataField_serverUrix": {title: 'Server URI', unit: ""},
                    "dataField_messagesPerBroadcast": {title: 'Total Msg Count', unit: ""},
                    "dataField_inputPowerMessagesCount": {title: 'Input Power Msg Count', unit: ""},
                    "dataField_outputPowerMessagesCount": {title: 'Output Power Msg Count', unit: ""},
                    "dataField_inputEnergyMessagesCount": {title: 'Input Energy Msg Count', unit: ""},
                    "dataField_outputEnergyMessagesCount": {title: 'Output Energy Msg Count', unit: ""},
                },
            }
        },
        'Client Settings': {
            _dest: {object: aegScWebCont.comp, name: 'settingsPanel', class: "params"}
        },
        'Message Settings': {
            _dest: {object: aegScWebCont.comp, name: 'messageSettings', class: "params"}
        },
        'Topics': {
            _dest: {object: aegScWebCont.comp, name: 'topicSettings', class: "params"}
        }
    }
};
mqttClientGui.populateClientSettings = function (dev, param) {
//switch
//command
//inputText
//inputNumber
//dropDown
//button
    let clientSetWrapper = aegScWebCont.comp.settingsPanel;
//    let accPanel = new SMDUIAccordianPanel(paramWrapper, {tabs: ['']});
    mqttClientGui.clSetContent = {
        "param_publishInterval": {type: "inputNumber", title: "Publish Interval", unit: 's', ctrlInfo: "Time between publish events"},
        "param_automaticReconnect": {
            type: "dropDown",
            title: "Auto Reconnect",
            ctrlInfo: "If set to false, the client will not attempt to automatically reconnect to the server in the event that the connection is lost.",
            dropDownConf: {
                options: [
                    {label: 'True', value: true},
                    {label: 'False', value: false}
                ]
            }
        },
        "param_cleanSession": {
            type: "dropDown",
            title: "Clean Session",
            ctrlInfo: "When cleansession is true, the state information is discarded at connect and disconnect.",
            dropDownConf: {
                options: [
                    {label: 'True', value: true},
                    {label: 'False', value: false}
                ]
            }
        },
        "param_connectionTimeout": {type: "inputNumber", title: "Connection Timeout", unit: 's', ctrlInfo: "Timeout for connection to server"},
        "param_keepAliveInterval": {type: "inputNumber", title: "Keep Alive Interval", unit: 's', ctrlInfo: "Maximum time that should pass without communication between the client and the server."},
        "param_maxInflight": {type: "inputNumber", title: "Max Inflight", unit: '', ctrlInfo: "The maximum number of messages in flight"},
        "param_mqttVersion": {type: "inputNumber", title: "MQTT Version", unit: '', ctrlInfo: "The version of MQTT to use to connect to the MQTT Broker. (0=Default, 3=V3.1, 4=V3.1.1)"},
        "param_userName": {type: "inputText", title: "Username", unit: '', ctrlInfo: "Authentication username for this connection."},
        "param_password": {type: "inputText", title: "Password", unit: '', ctrlInfo: "Authentication password for this connection."},
        "param_serverUri": {type: "inputText", title: "Server URI", unit: '', ctrlInfo: "The broker/server URI Eg: tcp://localhost:1883 || NOTE Ensure that remote connections are allowed on the broker/server"},
        "param_removeUnit": {type: "switch", title: "Remove Client", unit: '', onSaveSuccess: function (comp) {
                comp.setValue(false);
            }, ctrlInfo: "Delete the currently selected MQTT Client"},
    };

    hhContentBuilder.buildContent(mqttClientGui.clSetContent, clientSetWrapper);

    let topicContent = aegScWebCont.comp.topicSettings;

    new ParamSetting(topicContent, 'inputPowerDataEnabled', {
        type: 'switch',
        title: "Enable Input Powers",
        ctrlInfo: "Enable All Input (Raw) Power Data to be Published from Power Service at: solarmd/power/inputPower/#",
        onSaveSuccess: function (comp, val) {
            comp.setValue(val);
        }
    });
    new ParamSetting(topicContent, 'outputPowerDataEnabled', {
        type: 'switch',
        title: "Enable Output Powers",
        ctrlInfo: "Enable All Output (Processed) Power Data to be Published from Power Service at: solarmd/power/outputPower/#",
        onSaveSuccess: function (comp, val) {
            comp.setValue(val);
        }
    });
    new ParamSetting(topicContent, 'inputEnergyDataEnabled', {
        type: 'switch',
        title: "Enable Input Energies",
        ctrlInfo: "Enable All Input (Raw) Energy Data to be Published from Energy Storage Service at: solarmd/energy/inputEnergy/#",
        onSaveSuccess: function (comp, val) {
            comp.setValue(val);
        }
    });
    new ParamSetting(topicContent, 'outputEnergyDataEnabled', {
        type: 'switch',
        title: "Enable Output Energy",
        ctrlInfo: "Enable All Output (Processed) Energy Data to be Published from Energy Storage Service at: solarmd/energy/outputEnergy/#",
        onSaveSuccess: function (comp, val) {
            comp.setValue(val);
        }
    });
//    mqttClientGui.clTopicContent = {
//        "param_inputPowerDataEnabled": {type: "switch", title: "Enable Input Powers", unit: '', ctrlInfo: "Enable All Input (Raw) Power Data to be Published from Power Service at: /power/inputPower"},
//        "param_outputPowerDataEnabled": {type: "switch", title: "Enable Output Powers", unit: '', ctrlInfo: "Enable All Output (Processed) Power Data to be Published from Power Service at: /power/outputPower"},
//    };
    hhContentBuilder.buildContent(mqttClientGui.clTopicContent, topicContent);

    let messageSettings = aegScWebCont.comp.messageSettings;

    mqttClientGui.clMsgContent = {
        "param_msgQos": {type: "inputNumber", title: "Message QOS", unit: '', ctrlInfo: "Sets the quality of service for this message"},
        "param_msgRetained": {
            type: "dropDown",
            title: "Set Message Retained",
            ctrlInfo: "Whether or not the publish message should be retained by the messaging engine.",
            dropDownConf: {
                options: [
                    {label: 'True', value: true},
                    {label: 'False', value: false}
                ]
            }
        },
//        "param_userName": {type: "inputText", title: "Username", unit: '', ctrlInfo: "Authentication username for this connection."},
//        "param_password": {type: "inputText", title: "Password", unit: '', ctrlInfo: "Authentication password for this connection."},
//        "param_serverUri": {type: "inputText", title: "Server URI", unit: '', ctrlInfo: "The broker/server URI Eg: tcp://localhost:1883 || NOTE Ensure that remote connections are allowed on the broker/server"},
    };

//    new ParamSetting(messageSettings, 'msgRetained', {
//        type: 'switch',
//        title: "Set Message Retained",
//        ctrlInfo: "Whether or not the publish message should be retained by the messaging engine.",
//        onSaveSuccess: function (comp, val) {
//            comp.setValue(val);
//        }
//    });
    hhContentBuilder.buildContent(mqttClientGui.clMsgContent, messageSettings);




};



mqttClientGui.updateDataFieldByName = function (data, name, format) {
    if (data[name] && typeof (data[name] !== 'object')) {
        mainUtils.setHtmlText('aegSc-' + name, data[name], ((format !== undefined) ? format : 2));
    }
};
mqttClientGui.init = function () {
    hhContentBuilder.buildContent(aegScWebCont.main, dgm.contentPanel);
//    aegScGui.initHtmlBasicDataPanel(document.querySelector('.aegSc-actualData'));
};
$(document).ready(function () {
    mqttClientGui.init();
});