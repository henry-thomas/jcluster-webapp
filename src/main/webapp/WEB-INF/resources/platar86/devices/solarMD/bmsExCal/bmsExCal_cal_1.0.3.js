/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, hh, mu, bcGui, dm, bc */


//var bc = {
//    devData: {},
//    warnErrDialogSerial: false,
//    colorPickerInit: false,
//    capacityAhParamInit: false,
//    param: {}
//};

dm.onProgressData('balTempTest', function (dev, prog, id) {
//    debugger;

    this.dataContent.statePer.value = prog.pState;
    this.dataContent.msg.html = prog.prop.text;
    let data = prog.prop;
    for (var i = 0; i < 4; i++) {
        this.dataContent.table.tContent[i].idx.textContent = data['state' + i] || "N/A";
        this.dataContent.table.tContent[i].stat.textContent = data['detail' + i] || "N/A";
    }
});

dm.onProgressData('balTest', function (dev, prog, id) {
//    debugger;
    this.dataContent.statePer.value = prog.pState;
    this.dataContent.msg.html = prog.prop.text;
    let data = prog.prop;
    for (var i = 0; i < 16; i++) {
        this.dataContent.table.tContent[i].idx.textContent = data['state' + i] || "N/A";
        this.dataContent.table.tContent[i].stat.textContent = data['detail' + i] || "N/A";
    }

});

bc.updateData = function (dev, data) {
//        chargeControlDer

//    console.log(data);
    let bmsData = data.bmsDataMap[data.targetDevSerialNumber];
    if (bmsData) {

        bc.updateCellVoltageTable(data, bmsData);

        if (data.serialStateBalMap[data.targetDevSerialNumber] === undefined) {
            bcGui.dataComp.balTest.value = 'Waiting';
        } else {
            let batTestPass = data.serialStateBalMap[data.targetDevSerialNumber];
            bcGui.dataComp.balTest.value = batTestPass ? 'Pass' : 'Fail';
        }

        if (data.serialStateBalTempSensorMap[data.targetDevSerialNumber] === undefined) {
            bcGui.dataComp.balTempTest.value = 'Waiting';
        } else {
            let batTestPass = data.serialStateBalTempSensorMap[data.targetDevSerialNumber];
            bcGui.dataComp.balTempTest.value = batTestPass ? 'Pass' : 'Fail';
        }

        if (data.serialStateCellVCalibMap[data.targetDevSerialNumber] === undefined) {
            bcGui.dataComp.cellVCalib.value = 'Waiting';
        } else {
            let batTestPass = data.serialStateCellVCalibMap[data.targetDevSerialNumber];
            bcGui.dataComp.cellVCalib.value = batTestPass ? 'Pass' : 'Fail';
        }
        if (data.serialStateCanTest[data.targetDevSerialNumber] === undefined) {
            bcGui.dataComp.canTest.value = 'Waiting';
        } else {
            let batTestPass = data.serialStateCanTest[data.targetDevSerialNumber];
            bcGui.dataComp.canTest.value = batTestPass ? 'Pass' : 'Fail';
        }
        if (data.serialStateCurrMeasTest[data.targetDevSerialNumber] === undefined) {
            bcGui.dataComp.inaTest.value = 'Waiting';
        } else {
            let batTestPass = data.serialStateCurrMeasTest[data.targetDevSerialNumber];
            bcGui.dataComp.inaTest.value = batTestPass ? 'Pass' : 'Fail';
        }

//        bcGui.calibFailMessage.value = data.calibFailMessage;
    }

    hh.updateAdfFromObject(bcGui.dataComp, data);
};

devManager.onSelectedDataReceived(bc.updateData);



//bc.updateParam = function (dev, param) {
//    if (param && !bc.paramSettings) {
//        bc.paramSettings = true;
//        let cont = bcGui.comp.settingTabPannelBasic;
//        let serialOtions = [];
//        for (var sn in param.bmsParamMap) {
//            serialOtions.push({label: sn, value: sn});
//        }
//
//        let p = new ParamSetting(cont, 'calibUnitSerial', {
//            type: 'dropDown',
//            title: 'Calibration Serial Number',
//            ctrlInfo: '.sd',
//            alwayShowExecBtn: true,
//            dropDownConf: {options: serialOtions}
//        });
//
//        if (param.calibUnitSerial) {
//            p.setValue(param.calibUnitSerial, this.selected.serialNumber);
//        } else {
//            if (serialOtions.length > 0) {
//                p.setValue(serialOtions[0].value, this.selected.serialNumber);
//            }
//        }
//
//        let batModelOpts = [];
//        for (var model in param.bmsModelParamMap) {
//            batModelOpts.push({label: model, value: model});
//        }
//
//        let p2 = new ParamSetting(cont, 'bmsSelectedModel', {
//            type: 'dropDown',
//            title: 'Battery Model',
//            ctrlInfo: '',
//            alwayShowExecBtn: true,
//            dropDownConf: {options: batModelOpts}
//        });
//
//        if (param.bmsSelectedModel) {
//            p2.setValue(param.bmsSelectedModel, this.selected.serialNumber);
//        } else {
//            if (serialOtions.length > 0) {
//                p2.setValue(serialOtions[0].value, this.selected.serialNumber);
//            }
//        }
////        console.log(param);
////        debugger;
////        bcGui.createActualCellData(param.bmsParamMap, param.calibUnitSerial);
//    }
//};



