/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, fetch, hh */


var ss = {
    smdx: {
        model: {},
        requestedModules: {}
    },
    modelLoaderVars: {}
};

ss.smdxLoadModelPoint = function (modelId, block, strDef) {
    for (var item in block.point) {
        let p = block.point[item];
        let pId = p.id;
        let pStr = {};

        for (var item in strDef) {
            if (typeof (strDef[item].id) === 'string' && strDef[item].id === pId) {
                pStr = strDef[item];
                break;
            }
        }

        let dp = {};
        dp.notes = pStr.notes || " ";
        dp.label = pStr.label || " ";
        dp.description = pStr.description || " ";

        dp.units = p.units || " ";
        dp.type = p.type || " ";
        dp.symbol = p.symbol || [];
        dp.id = p.id || "";
        ss.smdx.model[modelId + "_" + pId] = dp;
    }
}
;

ss.smdxLoadModel = function (id, model) {

//    console.log(model);
    ss.smdx[id] = model;
    if (Array.isArray(model.sunSpecModels.model.block)) {
        for (var i = 0; i < model.sunSpecModels.model.block.length; i++) {
            let block = model.sunSpecModels.model.block[i];
            ss.smdxLoadModelPoint(id, block, model.sunSpecModels.strings.point);
        }
    } else {
        ss.smdxLoadModelPoint(id, model.sunSpecModels.model.block, model.sunSpecModels.strings.point);
    }
    ss.updataModelTab();
};

ss.updateData = function (dev, data) {
    if (!data || data.dataMap === undefined) {
        return;
    }
    for (var model in data.dataMap) {
        let modelToFetch = [];
        if (ss.smdx[model] === undefined) {
            modelToFetch.push(model);
        }
        if (modelToFetch.length > 0) {
            for (var i = 0; i < modelToFetch.length; i++) {
                ss.fetchSunSpecDef(modelToFetch[i]);
            }
            return;
        }
    }

    for (var model in data.dataMap) {
        let currentModelId = Number(model);
        let currentModel = data.dataMap[model];
//        console.log(data);
        if (currentModel.fixBlock) {
            for (var item in  currentModel.fixBlock) {
                let i = currentModel.fixBlock[item];
                let modelDes = ss.smdx.model[currentModelId + "_" + item];
                let unitDec = 0;
                let labelClass = "uixp-" + currentModelId + "_" + item; //uixp-103_PPVphAB_Unit
                if (modelDes && modelDes.units && (modelDes.units.charAt(0) === "A" || modelDes.units.charAt(0) === "V" || modelDes.units.charAt(0) === "W")) {
                    unitDec = 2;
                    if (i > 999999) {
                        mainUtils.setHtmlText(labelClass + "_Unit", "M" + modelDes.units);
                        i /= 1000000;
                        unitDec = 3;
                    } else if (i > 999) {
                        i /= 1000;
                        mainUtils.setHtmlText(labelClass + "_Unit", "k" + modelDes.units);
                    } else {
                        mainUtils.setHtmlText(labelClass + "_Unit", modelDes.units);
                    }
                }
                mainUtils.setHtmlText(labelClass, i, unitDec);
            }
        }
        if (currentModel.repeatingBlock) {
            for (var j = 0; j < currentModel.repeatingBlock.length; j++) {
                let rBlock = currentModel.repeatingBlock[j];
                for (var item in  rBlock) {
                    let modelDes = ss.smdx.model[currentModelId + "_" + item];

                    let i = rBlock[item];
//                    mainUtils.setHtmlText("uixp-" + currentModelId + "_" + item + "_" + j, i, 2);


                    let unitDec = 0;
                    let labelClass = "uixp-" + currentModelId + "_" + item + "_" + j; //uixp-103_PPVphAB_Unit
                    if (modelDes && modelDes.units && (modelDes.units.charAt(0) === "A" || modelDes.units.charAt(0) === "V" || modelDes.units.charAt(0) === "W")) {
                        unitDec = 2;
                        if (i > 999999) {
                            mainUtils.setHtmlText(labelClass + "_Unit", "M" + modelDes.units);
                            i /= 1000000;
                            unitDec = 3;
                        } else if (i > 999) {
                            i /= 1000;
                            mainUtils.setHtmlText(labelClass + "_Unit", "k" + modelDes.units);
                        } else {
                            mainUtils.setHtmlText(labelClass + "_Unit", modelDes.units);
                        }
                    }
                    mainUtils.setHtmlText(labelClass, i, unitDec);
                }
            }
        }
    }

    if (data.dataMap[120] !== undefined && data.dataMap[120].fixBlock !== undefined) {
        for (var item in  data.dataMap[120].fixBlock) {
            let i = data.dataMap[120].fixBlock[item];
//            let unitDec = 0;
//            let modelDes = ss.smdx.model[120 + "_" + item];
//            let labelClass = "uixp-" + 120 + "_" + item; //uixp-103_PPVphAB_Unit
//            if (modelDes && modelDes.units && (
//                    modelDes.units.charAt(0) === "A" 
//                    || modelDes.units.charAt(0) === "V" 
//                    || modelDes.units.charAt(0) === "v" 
//                    || modelDes.units.charAt(0) === "W")) {
//                unitDec = 2;
//                if (i > 999999) {
//                    mainUtils.setHtmlText(labelClass + "_Unit", "M" + modelDes.units);
//                    i /= 1000000;
//                    unitDec = 3;
//                } else if (i > 999) {
//                    i /= 1000;
//                    mainUtils.setHtmlText(labelClass + "_Unit", "k" + modelDes.units);
//                } else {
//                    mainUtils.setHtmlText(labelClass + "_Unit", modelDes.units);
//                }
//            }
//            mainUtils.setHtmlText(labelClass, i, unitDec);
            mainUtils.setHtmlText("uixp-120_" + item, i);
        }
//        console.log(data.dataMap[120]);
    }
//" PowerSS-113925-3P54-1418 + PowerSS-113929-3P54-1418 + PowerSS-114161-3P54-1418 + PowerSS-114180-3P54-1418 + PowerSS-140221-3P54-1318 + em-1901411651-sumImp - em-1901411651-sumExp"

};

ss.updateParam = function (dev, param) {
    if (param.paramMap === null) {
        return;
    }

    if (param.paramMap[1] !== undefined && param.paramMap[1].fixBlock !== undefined) {
        for (var item in  param.paramMap[1].fixBlock) {
            let i = param.paramMap[1].fixBlock[item];


            mainUtils.setHtmlText("uixp-" + item, i);
        }
//        console.log(param.paramMap[1]);
    }

};

ss.fetchSunSpecDef = function (modelId, minfyVersion) {
    if (modelId !== undefined) {
        let model = modelId;

//        console.log(model);
        //do not try to fetch existing model
        if (ss.smdx[model]) {
//            console.log('Model Request reject Exist', ss.smdx[model]);
            return;
        }
        //do not try to fetch twice
        if (ss.smdx.requestedModules[model]) {
//            console.log('Model Request reject Pending', ss.smdx.requestedModules[model]);
            return;
        }
        ss.smdx.requestedModules[model] = true;

        var path = "/resources/platar86/devices/sunspec/smdx/smdx_";
        for (var i = modelId.toString().length; i < 5; i++) {
            path += 0;
        }
        path += modelId.toString() + (minfyVersion === undefined ? ".min" : "") + ".json";

        try {
            var retrievedObject = localStorage.getItem('SunSpecModelSchema_' + model);
            if (retrievedObject) {
//                ss.smdx[model] = JSON.parse(retrievedObject);
                ss.smdxLoadModel(model, JSON.parse(retrievedObject));
                delete  ss.smdx.requestedModules[model];
//                console.log('Model Request fetch from local storage', ss.smdx[model]);
                return;
            }
        } catch (e) {
        }


        fetch(path).then(
                function (response) {
                    if (response.status === 200) {
                        return response.json(); //parse to JSON return promise
                    } else {
                        console.log('failure to fetch status code: ' + response.status);
                    }
                },
                function () { //failure to fetch
                    console.log('failure to fetch');
                    delete  ss.smdx.requestedModules[model];
                }).then(
                function (myJson) {
//                    ss.smdx[model] = myJson;
                    ss.smdxLoadModel(model, myJson);
                    // Put the object into storage
                    localStorage.setItem('SunSpecModelSchema_' + model, JSON.stringify(myJson));
//                    console.log("receive param module: ", model);
                    delete  ss.smdx.requestedModules[model];
                },
                function () {
                    console.log('failure to parse');
                });
    }
};

devManager.onSelectedDataReceived(ss.updateData);
devManager.onSelectedParamInit(ss.updateParam);

devManager.onSelectedChange(function (sDev) {
    if (sDev.connected) {
        ss.updateParam(sDev, sDev.getParam());
        ss.updataModelTab();
        ss.updateData(sDev, sDev.getData());
    } else {
        mainUtils.setHtmlText('dataValues', 'N/A');
    }
//    console.log(arguments);
});

devManager.onParamReceived(function (sDev, param) {
    for (var model in param.paramMap) {
//        console.log("request Param", param);
        ss.updataModelTab();
        if (ss.smdx[model] === undefined) {
            ss.fetchSunSpecDef(model);
        }
    }
});


devManager.onSelectedStatusChange(function (sDev) {
    if (sDev.connected) {
        ss.updataModelTab();
        ss.updateData(sDev, sDev.getData());
    } else {
        mainUtils.setHtmlText('dataValues', 'N/A');
    }
});



ss.updataModelTab = function (dev, param) {
    ss.reloadAvailableTabs(dev);

    const infoTabPanelContainerClass = "sunSpecInverterInfoPanel";
    let mainEl = document.querySelector("." + infoTabPanelContainerClass);
    if (!mainEl) {
        return;
    }
    let model;

    try {
        model = devManager.getSelected().getData().dataMap[120].fixBlock;
    } catch (e) {
    }

    const infoTabPanelClass = "actDataPanelCard_info_120";
    let oldPanel = document.querySelector("." + infoTabPanelClass);
    if (oldPanel) {
        oldPanel.parentElement.removeChild(oldPanel);
    }

    let infoContainer = hh.createActDataPanelCard("RATED VALUES", [infoTabPanelClass]);
    mainEl.appendChild(infoContainer);


    for (var pointId in model) {
        let globId = "120_" + pointId;
        let point = ss.smdx.model[globId];

        if (typeof (point) === "object") {
//            console.log('ss.updataInfoTab', point.description);
            infoContainer.appendChild(hh.addItemToActDataPanelCard({
                title: point.label,
                value: '',
                valueClass: ["uixp-" + globId],
                tooltip: point.description,
                unit: point.units
            }));

        }
    }


};

ss.reloadAvailableTabs = function () {
    let selectedDev = devManager.getSelected();
    if (!selectedDev.getData() || !selectedDev.getData().dataMap) {
        return;
    }

    let dataMap = selectedDev.getData().dataMap;

    if (dataMap['160'] && ss.smdx[160]) {
        document.querySelector('.uixss-dcInfoTab').classList.remove('uixss-dynamicHiddenTab');
        ss.reloadModel_160(selectedDev, dataMap['160'], ss.smdx[160].sunSpecModels);
    } else {
        document.querySelector('.uixss-dcInfoTab').classList.add('uixss-dynamicHiddenTab');
    }
    //ac model actual data
    let acLiveDataAvailable = false;
    for (var i = 101; i < 113; i++) {
        if (dataMap[i] && ss.smdx[i]) {
            document.querySelector('.uixss-acInfoTab').classList.remove('uixss-dynamicHiddenTab');
            ss.reloadModel_Ac(selectedDev, dataMap[i], ss.smdx[i].sunSpecModels, i);
            acLiveDataAvailable = true;
            break;
        }
    }
    if (!acLiveDataAvailable) {
        document.querySelector('.uixss-acInfoTab').classList.add('uixss-modelACContainer');

    }

};
ss.reloadModel_Ac = function (dev, model, strModel, modelId) {
    if (ss.modelLoaderVars['lastModel_' + modelId] === undefined || ss.modelLoaderVars['lastModel_' + modelId] !== dev.serialNumber) {
        ss.modelLoaderVars['lastModel_' + modelId] = dev.serialNumber;

        let container = document.querySelector('.uixss-modelACContainer');
        hh.removeAllChilds(container);

        if (typeof (model.fixBlock) === 'object') {
            const block = model.fixBlock;

            const infoTabPanelClass = "actDataPanelCardModel_" + modelId;
            let dataPanel = hh.createActDataPanelCard("AC INFO ");
            container.appendChild(dataPanel);

//                console.log('ss.updataDataTab', model);

            let md = block;

            for (var i = 0; i < ss.smdx[modelId].sunSpecModels.model.block.point.length; i++) {
                let pointId = ss.smdx[modelId].sunSpecModels.model.block.point[i].id;
                if (md[pointId] !== undefined) {
                    let globId = modelId + "_" + pointId;
                    let point = ss.smdx.model[globId];

                    if (typeof (point) === "object") {
//            console.log('ss.updataInfoTab', point.description);
                        dataPanel.appendChild(hh.addItemToActDataPanelCard({
                            title: point.label,
                            value: '',
                            valueClass: ["uixp-" + globId],
                            unitClass: ["uixp-" + globId + "_Unit"],
                            tooltip: point.description,
                            unit: point.units
                        }));

                    }
                }
            }

//            let md = model.fixBlock;
//
//            for (var pointId in md) {
//                let globId = modelId + "_" + pointId;
//                let point = ss.smdx.model[globId];
//
//                if (typeof (point) === "object") {
////            console.log('ss.updataInfoTab', point.description);
//                    dataPanel.appendChild(hh.addItemToActDataPanelCard({
//                        title: point.label,
//                        value: '',
//                        valueClass: ["uixp-" + globId],
//                        tooltip: point.description,
//                        unit: point.units
//                    }));
//
//                }
//            }

        }
    }
};

ss.reloadModel_160 = function (dev, model, strModel) {
    if (ss.modelLoaderVars.lastModel160Load === undefined || ss.modelLoaderVars.lastModel160Load !== dev.serialNumber) {
        ss.modelLoaderVars.lastModel160Load = dev.serialNumber;

        let container = document.querySelector('.uixss-model160Container');
        hh.removeAllChilds(container);

        if (typeof (model.repeatingBlock) === 'object') {
            for (var i = 0; i < model.repeatingBlock.length; i++) {
                const block = model.repeatingBlock[i];

                const infoTabPanelClass = "actDataPanelCardModel_160";
                let dataPanel = hh.createActDataPanelCard("MPPT " + (i + 1));
                container.appendChild(dataPanel);

//                console.log('ss.updataDataTab', model);

                let md = model.repeatingBlock[i];
                for (var k = 0; k < ss.smdx[160].sunSpecModels.model.block[1].point.length; k++) {
                    let pointId = ss.smdx[160].sunSpecModels.model.block[1].point[k].id;
                    if (md[pointId] !== undefined) {

                        let globId = "160_" + pointId;
                        let point = ss.smdx.model[globId];

                        if (typeof (point) === "object") {
//            console.log('ss.updataInfoTab', point.description);
                            dataPanel.appendChild(hh.addItemToActDataPanelCard({
                                title: point.label,
                                value: '',
                                valueClass: ["uixp-" + globId + "_" + i],
                                unitClass: ["uixp-" + globId + "_" + i + "_Unit"],
                                tooltip: point.description,
                                unit: point.units
                            }));

                        }
                    }
                }

            }
        }
    }
};


$(document).ready(function () {

});

