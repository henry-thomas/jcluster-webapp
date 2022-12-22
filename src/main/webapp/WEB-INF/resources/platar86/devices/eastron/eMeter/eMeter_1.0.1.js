/* global logCon, PF, mainUtils, moment, dm, bmsRelay, hh, bmsexDM, socEMeterGui, socEMeterDataMap, pm */

//var socEMeter = {
//    devData: {},
//
//    dataContent: {},
//    mpptPanelSig: ''
//};
//
//socEMeter.init = function () {
//    socEMeterGui.initGUI();
//};
//socEMeter.updateData = function (dev, data) {
//    hh.updateAdfFromObject(socEMeterGui.dataComp, data, true);
//};
//
//
//
//socEMeter.updateParam = function (dev, param) {
//    try {
//        socEMeter.initMPPTData(dev, param);
//    } catch (e) {
//        console.warn(e);
//    }
//
//    let lc = socEMeterGui.labelComp;
//    lc.serialNumber.value = dev.serialNumber;
//    lc.deviceName.value = dev.deviceName;
//    lc.hwVer.value = dev.hwVer;
//    lc.fwVer.value = dev.fwVer;
//    lc.installedDate.value = dev.installedDate;
//    lc.mpptQty.value = param.numMPPT;
//    lc.inputQty.value = param.numPvStrings;
//    lc.modbusAddress.value = param.modbusAddress;
//    lc.comPort.value = param.comPort;
//};
//
//
//dm.onSelectedDataReceived(socEMeter.updateData);
//
//dm.onSelectedParamInit(socEMeter.updateParam);
//
//dm.onSelectedChange(function (dev) {
//    if (dev.param) {
//        socEMeter.updateParam(dev, dev.param);
//    }
//    if (dev.data) {
//        socEMeter.updateData(dev, dev.data);
//    }
//});
//
//dm.onSelectedStatusChange(function (dev, state) {
//
//});
//
//dm.onParamReceived(function (dev, param) {
//
//});
//
//document.addEventListener("DOMContentLoaded", function (event) {
//    console.log('%c HUAWEI SUN2000 JS ver:1.0.1 ', 'font-size: 18px; -webkit-box-shadow: 0 1px 3px 0 rgb(0 0 0 / 33%), 0 5px 1px 0 rgb(0 0 0 / 14%), 0 4px 19px -1px rgb(0 0 0 / 59%)');
//    socEMeter.init();
//});

