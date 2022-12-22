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

/* global wsm */

(function (root) {
    function GsUtils() {
        this.settingMap = {};
        this.gsConfMap = {};
        this.gsConfigDialog = new SMDUIDialog({
            modal: true,
            heading: 'Quick Access Settings Config',
            draggable: false,
            onInitComplete: function (contentDiv, footerDiv, comp) {
            }.bind(this)
        });
        getAllGsMap.call(this);
    }

    let prot = GsUtils.prototype;

    prot.openGsConfDialog = function () {
        this.gsConfigDialog.open();
    };

    function getAllGsMap() {
        wsm.sendDevMsgExecWithJsonInst({instrExt: "getAllGlobalSettings"}, onGetAllGsMapSuccess.bind(this));
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

    function addSetting(setting) {
        if (!this.gsConfMap[setting.settingId]) {
            addGsConfigItem.call(this, setting);
        }
    }

    function addGsConfigItem(setting) {
        let container = this.gsConfigDialog.contentDiv;
        let paramSet = new ParamSetting(container, 'setGsActive',
                {
                    type: 'switch',
                    title: (setting.displayName || setting.settingId),
                    ctrlInfo: "",
                    extraData: {
                        fnName: setting.settingId
                    },
                    onSaveSuccess: function (comp, val) {
                        getAllGsMap.call(this);
                        comp.setValue(val);
                    }.bind(this)
                });
        paramSet.setValue(setting.active);
        this.gsConfMap[setting.settingId] = paramSet;
    }


    $(document).ready(function () {
        root.gsUtils = new GsUtils();
    });
})(window);


