/* global logCon, PF, mainUtils, moment, devManager, bmsRelay */


var escVic = {
    devData: {},
    warnErrDialogSerial: false,
    colorPickerInit: false,
    capacityAhParamInit: false,
    subDeviceInit: false,
    subDeviceSelectedSerial: null
};



escVic.sendManualInstruction = function () {
    let period = Number(mainUtils.getWidgetValue('manDataPeriod'));
    let cc = Number(mainUtils.getWidgetValue('manDataCc'));
    let dc = Number(mainUtils.getWidgetValue('manDataDc'));
    let cv = Number(mainUtils.getWidgetValue('manDataCv'));
    let dv = Number(mainUtils.getWidgetValue('manDataDv'));

    let inst = period
            + '_'
            + cc
            + '_'
            + dc
            + '_'
            + cv
            + '_'
            + dv;
    
    devManager.sendDevMessage(
            {
                instrExt: 'execManualCtrl',
                instrData: inst
            },
            function (devMessage, unitArr) { //success
                console.log('Success Manual control send');
                mainUtils.showInfoMessage('Successfully activated manual control.');
            }
    );
    console.log('sdfs');
};

escVic.updateESCtrlData = function (dev, data) {
//    console.log(data);

    mainUtils.setHtmlText('batteryBusName', data.busName);
    mainUtils.setHtmlText('batteryBusName', data.busName);
    mainUtils.setHtmlText('offlineDevices', data.offlineDevices);
    mainUtils.setHtmlText('onlineDevices', data.onlineDevices);
    mainUtils.setHtmlText('avergCapacityP', data.avergCapacityP.toFixed(2));
    mainUtils.setHtmlText('avergVoltageV', data.avergVoltageV.toFixed(2));
    mainUtils.setHtmlText('totalPowerW', (data.totalPowerW / 1000).toFixed(2));
    mainUtils.setHtmlText('totalCurrentA', data.totalCurrentA.toFixed(2));
    mainUtils.setHtmlText('chargeControl', data.chargeControl);
    mainUtils.setHtmlText('chargeControlLim', data.currentChargeLimitSerial);
    mainUtils.setHtmlText('dischargeControl', data.dischargeControl);
    mainUtils.setHtmlText('dischargeControlLim', data.currentDischargeLimitSerial);
    mainUtils.setHtmlText('totalRatedCapacityAh', data.totalRatedCapacityAh.toFixed(2));
    mainUtils.setHtmlText('totalRateChargeCurrentA', data.totalRateChargeCurrentA.toFixed(2));
    mainUtils.setHtmlText('totalRateDischargeCurrentA', data.totalRateDischargeCurrentA.toFixed(2));
    mainUtils.setHtmlText('avergCapacityAh', (data.totalCapacityAh).toFixed(2));

    try { // can throw exception if data is not available. Skip only 
        var batVDrop = data.avergVoltageV - devManager.getSelected().getData().avrgBatteryVoltage;
        mainUtils.setHtmlText('batVDrop', batVDrop.toFixed(2));
    } catch (e) {

    }

};

escVic.clearSubDeviceData = function () {
//    subDeviceData
    const panelArr = document.getElementsByClassName('subDeviceData');
    for (var i = 0; i < panelArr.length; i++) {

        const childArr = panelArr[i].getElementsByClassName('actDataPanel');
        for (var j = 0; j < childArr.length; j++) {
            if (childArr[j].children[1] !== undefined) {
                childArr[j].children[1].innerText = "N/A";
            }
        }
    }
};

escVic.updateData = function (dev, data) {

    if (dev !== undefined
            && dev.getParam() !== undefined
            && dev.getParam().controlMethod !== undefined) {
        let dcPanelsArr = document.querySelectorAll('.dynamicControlSettings');
        let laEmulPanelsArr = document.querySelectorAll('.laEmulationSettings');
        let dcPanelEn = false;
        let laEmulPaneEn = false;
        if (dev.getParam().controlMethod === 'dynamic') {
            dcPanelEn = true;
        } else if (dev.getParam().controlMethod === 'laEmulation') {
            laEmulPaneEn = true;
        }
        for (var i = 0; i < dcPanelsArr.length; i++) {
            dcPanelsArr[i].style.display = dcPanelEn ? 'flex' : 'none';
        }
        for (var i = 0; i < laEmulPanelsArr.length; i++) {
            laEmulPanelsArr[i].style.display = laEmulPaneEn ? 'flex' : 'none';
        }
    }


    if (data.bvcActualStage !== undefined) {
        switch (data.bvcActualStage) {
            case 0:
                {
                    mainUtils.setHtmlText('bvcActualStage', 'Floating Stage');
                }
                break;
            case 1:
                {
                    mainUtils.setHtmlText('bvcActualStage', 'Fast Charging Stage');
                }
                break;
            case 2:
                {
                    mainUtils.setHtmlText('bvcActualStage', 'Slow Charging Stage');
                }
                break;
            default :
            {
                mainUtils.setHtmlText('bvcActualStage', 'unknown stage: ' + data.bvcActualStage);
            }
        }
    }
    mainUtils.setHtmlText('bvcFloatCapPSwitchPoint', data.bvcFloatCapPSwitchPoint, 2);
    mainUtils.setHtmlText('bvcLastSwithcTimestamp', moment(data.bvcLastSwithcTimestamp).format('hh:mm:ss'));

    mainUtils.setHtmlText('chargeVoltage', data.chargeVoltage.toFixed(2));
    mainUtils.setHtmlText('chargingCurrent', data.chargingCurrent.toFixed(2));
    mainUtils.setHtmlText('dischargeVoltage', data.dischargeVoltage.toFixed(2));
    mainUtils.setHtmlText('dischargingCurrent', data.dischargingCurrent.toFixed(2));
    mainUtils.setHtmlText('deviceVisible', data.deviceVisible);

};




escVic.onSubDeviceSelectionChange = function (subDevSerial) {
    escVic.clearSubDeviceData();
    escVic.subDeviceSelectedSerial = subDevSerial;
//    console.log(subDevSerial);
};



devManager.onSelectedDataReceived(escVic.updateData);

devManager.onSelectedChange(function (sDev) {

});

devManager.onSelectedStatusChange(function (dev, state) {

});

devManager.onSelectedParamInit(escVic.updateParam);

devManager.onSelectedChange(function (sDev) {
//    escVic.updateParam(sDev, sDev.getParam());
//    if (sDev.connected && escVic.devData[sDev.serialNumber] !== undefined) {
//        escVic.updateData(sDev, escVic.devData[sDev.serialNumber]);
//    }
});

var liveData = {
    escData: [],
    data: [],
    setPointParam: [],
    param: [],
    unitParam: [],
    esCtrl: []
};

var setText = function (className, val) {
    if (val !== undefined) {
        if (val !== null) {
            $('.' + className).text(val);
        } else {
            $('.' + className).text('N/A');
        }
    } else {
        $('.' + className).text('---');
    }
};

escManager.onDataReceived(function onESCData(dArr) {
    var dataUpdated = false;

    if (devManager.getSelected().getParam() !== undefined && devManager.getSelected().getParam().busName !== undefined) {

        var busName = devManager.getSelected().getParam().busName;
        for (var i = 0; i < dArr.length; i++) {
            const ob = dArr[i];
            if (ob.busName !== undefined && ob.busName === busName) {
                escVic.updateESCtrlData(devManager.getSelected(), ob);
                dataUpdated = true;
                escVic.escCtrlData = ob;
//                printDataInTable("rawEscDataTableDiv", liveData.escData, ob);
            }
        }
    }
    if (!dataUpdated) {
        setText('dataValues');
    }
//    console.log(d);

});

$(document).ready(function () {


});