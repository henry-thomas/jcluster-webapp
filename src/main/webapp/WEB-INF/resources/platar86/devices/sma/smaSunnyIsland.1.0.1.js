/* global logCon, PF, mainUtils, moment, devManager, bmsRelay */


var si = {
    devData: {},
    warnErrDialogSerial: false,
    colorPickerInit: false,
    capacityAhParamInit: false,
    subDeviceInit: false,
    subDeviceSelectedSerial: null
};

si.updateData = function (dev, data) {

    if (data.outputPowerExp.powerW > 0) {
        mainUtils.setHtmlText('outputPower', data.outputPowerExp.powerW / 1000, 3);
    } else if (data.outputPowerImp.powerW > 0) {
        mainUtils.setHtmlText('outputPower', (data.outputPowerImp.powerW / 1000) * -1, 3);
    }


};

si.updateParam = function (dev, param) {


//    if (param === undefined) {
//        return;
//    }
//    for (var item in param) {
//        if (Array.isArray(param[item])) {
//            var arr = param[item];
//            for (var i = 0; i < arr.length; i++) {
//                var cName = item + (i.toString());
//                mainUtils.setWidgetValue(cName, arr[i]);
//            }
//        } else {
//            mainUtils.setWidgetValue(item, param[item]);
//        }
//    }
//    //refresh all controls
//    for (var item in param) {
//        axAi.updataParamControl(item, dev);
//    }
//
//    dev.paramLoaded = true;
};

si.updateParamDefault = function (paramName) {

    if (paramName === undefined) {
        return;
    }
    var dev = devManager.getSelected();

    mainUtils.setWidgetValue(paramName, dev.getParam()[paramName]);
    //refresh all controls
    dev.paramLoaded = true;
    si.updataParamControl(paramName, dev);
};

si.updataParamControl = function (compName) {
    var dev = devManager.getSelected();

    if (dev !== undefined) {
        if (Array.isArray(dev.getParam()[compName])) {
            var arr = dev.getParam()[compName];
            for (var i = 0; i < arr.length; i++) {
                var cName = compName + (i.toString());
                var actualParam = Number(dev.getParam()[compName][i]);
                var value = Number(mainUtils.getWidgetValue(cName));
                if (value === undefined) {
                    value = actualParam;
                }
                if (actualParam !== undefined) {
                    var controlButton = document.getElementsByClassName(cName)[0];
                    if (controlButton !== undefined) {
                        if (actualParam !== value) {
                            controlButton.style.display = 'block';
                        } else {
                            controlButton.style.display = 'none';
                        }
                    }
                }
            }
        } else {
            var actualParam = Number(dev.getParam()[compName]);
            var value = Number(mainUtils.getWidgetValue(compName));
            if (value === undefined) {
                value = actualParam;
            }
            if (actualParam !== undefined) {
                var controlButton = document.getElementsByClassName(compName)[0];
                if (controlButton !== undefined) {
                    if (actualParam !== value) {
                        controlButton.style.display = 'block';
                    } else {
                        controlButton.style.display = 'none';
                    }
                }

            }
        }
    }
}
;

si.onSubDeviceSelectionChange = function (subDevSerial) {
    si.clearSubDeviceData();
    si.subDeviceSelectedSerial = subDevSerial;
    si.updateSubDeviceData(devManager.getSelected().getData());
//    console.log(subDevSerial);
};

si.updateSubDevControls = function () {
    //devManager.getSelected().getData().axpertUnitDataMap
    mainUtils.customSelectButton.clearAll('axpertAiSubUnitSelectPanle');
    const unitArr = devManager.getSelected().getData().axpertUnitDataMap;
    for (var item in unitArr) {
        mainUtils.customSelectButton.add('axpertAiSubUnitSelectPanle', 'Unit-' + item, si.onSubDeviceSelectionChange, item);
    }
    mainUtils.customSelectButton.selectFirstWithCallback('axpertAiSubUnitSelectPanle');
};


devManager.onSelectedChange(function (sDev) {
    si.updateParam(sDev, sDev.getParam());
    if (sDev.connected && si.devData[sDev.serialNumber] !== undefined) {
        si.updateData(sDev, si.devData[sDev.serialNumber]);
    }
    if (devManager.getSelected().getData() !== undefined && devManager.getSelected().getData().axpertUnitDataMap !== undefined) {
        si.updateSubDevControls();
    } else {
        si.subDeviceInit = true;
    }
});

//devManager.onSelectedDataReceived(axAi.updateData);
devManager.onDataReceived(function (dev, data) {
    si.devData[dev.serialNumber] = data;
    if (dev.selected === true) {
        si.updateData(dev, data);
    }
});


devManager.onSelectedStatusChange(function (dev, state) {
    if (si.devData[dev.serialNumber] !== undefined) {

        si.updateData(dev, si.devData[dev.serialNumber]);
    }
});




devManager.onDeviceInitComplete(function () {
});


$(document).ready(function () {

}
);