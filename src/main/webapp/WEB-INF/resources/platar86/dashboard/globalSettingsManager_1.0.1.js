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

/* global init, wsm, hh, sui, devModelNameMap */

(function (root) {
    function GlobalSettingManager() {
        this.settingMap = {};
        this.isInit = false;
        this.gsConfMap = {};
        this.setContainer = document.querySelector('.global-set-container');
        this.gsConfigDialog = new SMDUIDialog({
            modal: true,
            heading: 'Quick Access Settings Config',
            draggable: false,
            onInitComplete: function (contentDiv, footerDiv, comp) {
            }.bind(this)
        });
        getAllGsMap.call(this);
    }

    let prot = GlobalSettingManager.prototype;

    function getAllGsMap() {
        wsm.sendDevMsgExecWithJsonInst({instrExt: "getActiveFunctionMap"}, onGetAllGsMapSuccess.bind(this));
    }

    function onGetAllGsMapSuccess(msg, result) {
        this.isInit = false;
        this.settingMap = {};
        for (let globalSetting in result) {
            let setting = result[globalSetting];
            let setName = setting.settingId;

            if (!this.settingMap[setName]) {
                addSetting.call(this, result[globalSetting]);
            }

            this.settingMap[setName] = setting;
        }
    }

    function onGlobalSettingsReceived() {
        if (this.tabPanel) {
            hh.removeAllChilds(this.setContainer);
            this.tabPanel = null;
        }

        this.setContainer.classList.add('card');

        hh.pPanelAddDescTitle(this.setContainer, "Quick Access Settings");
        let confDiv = hh.div(this.setContainer);
        confDiv.classList.add('dashboardControlsRight');

//        let confBtn = hh.buttonCustom({
//            text: `<i class = "fas fa-gear"></i>`,
//            type: 'small'
//        });
//        confDiv.appendChild(confBtn);
//        confBtn.onclick = function () {
//            this.gsConfigDialog.open();
//        }.bind(this);

        this.tabPanel = new TabPanel(this.setContainer, {
            menuItem: []
        });

//        let settingPanel = hh.div(this.setContainer);
//        settingPanel.classList.add("devParamPanelWrapper");

        this.isInit = true;
    }

    function addSetting(setting) {

        if (!this.isInit) {
            onGlobalSettingsReceived.call(this);
        }

        let devModel;
        if (setting.devModel !== null) {
            devModel = setting.devModel;
        } else {
            devModel = 0;
        }


//        if (!this.gsConfMap[setting.settingId]) {
//            addGsConfigItem.call(this, setting);
//        }
//
//        if (!setting.active) {
//            return;
//        }

        if (!this.tabPanel.contentElArr[devModelNameMap[devModel]]) {
            this.tabPanel.addItem({id: devModelNameMap[devModel]});
        }

        let panel = this.tabPanel.contentElArr[devModelNameMap[devModel]];

        let paramSetting;
        if (setting.type.toLowerCase() === "string") {
            paramSetting = new ParamSetting(panel, setting.settingId,
                    {
                        type: 'inputText',
                        title: setting.displayName || setting.settingId,
                        ctrlInfo: "",
                        unit: setting.unit || "",
                        extraData: {
                            devSerialNumber: setting.serialNumber
                        },
                        validator: function (comp, instruction) {
                            instruction.serial = setting.serialNumber;
                        }
                    });
        }
        if (setting.type.toLowerCase() === "number") {
            paramSetting = new ParamSetting(panel, setting.settingId,
                    {
                        type: 'inputNumber',
                        title: setting.displayName || setting.settingId,
                        ctrlInfo: "",
                        unit: setting.unit || "",
                        extraData: {
                            devSerialNumber: setting.serialNumber
                        },
                        validator: function (comp, instruction) {
                            instruction.serial = setting.serialNumber;
                        }
                    });
        }
        if (setting.type.toLowerCase() === "switch") {
            paramSetting = new ParamSetting(panel, setting.settingId,
                    {
                        type: 'switch',
                        title: setting.displayName || setting.settingId,
                        ctrlInfo: "",
                        unit: setting.unit || "",
                        validator: function (comp, instruction) {
                            instruction.serial = setting.serialNumber;
                        }
                    });
        }
        if (setting.type.toLowerCase() === "dropdown") {

            let values = setting.valueSet;
            let options = [];
            //TODO need to change setting.valueSet from list to map, or somehow 
            //populate the dropdown options for different kinds of values.
            for (let i = 0; i < values.length; i++) {
                if (!options[i]) {
                    options[i] = {};
                }
                options[i].label = values[i];
                options[i].value = values[i];
            }
            paramSetting = new ParamSetting(panel, setting.settingId,
                    {
                        type: 'dropDown',
                        title: setting.displayName || setting.settingId,
                        ctrlInfo: "",
                        unit: setting.unit || "",
                        validator: function (comp, instruction) {
                            instruction.serial = setting.serialNumber;
                        },
                        dropDownConf: {
                            options: options
                        }
                    });
        }
        if (paramSetting) {
            paramSetting.setValue(setting.value);
            paramSetting.onSaveSuccess(function (comp, data) {
                paramSetting.setValue(data);
            });
        }
    }

//    function addGsConfigItem(setting) {
//        let container = this.gsConfigDialog.contentDiv;
//        let paramSet = new ParamSetting(container, 'setUnitActive',
//                {
//                    type: 'switch',
//                    title: (setting.displayName || setting.settingId),
//                    ctrlInfo: "",
//                    extraData: {
//                        fnName: setting.settingId
//                    },
//                    onSaveSuccess: function (comp, val) {
//                        getAllGsMap.call(this);
//                        comp.setValue(val);
//                    }.bind(this)
//                });
//        paramSet.setValue(setting.active);
//        this.gsConfMap[setting.settingId] = paramSet;
//    }


    root.gsm = new GlobalSettingManager();
})(window);
