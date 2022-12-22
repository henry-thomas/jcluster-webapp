/* global logCon, PF, mainUtils, moment, dm, bmsRelay, hh, bmsexDM, sun2000GUI, sun2000DataMap, pm */

var sun2000 = {
    devData: {},

    dataContent: {},
    mpptPanelSig: ''
};

sun2000.init = function () {
    sun2000GUI.initGUI();
};
sun2000.updateData = function (dev, data) {
    hh.updateAdfFromObject(sun2000GUI.dataComp, data, true);
};

sun2000.initMPPTData = function (dev, param) {
    if ((param.numPvStrings + " " + param.numMPPT) !== sun2000.mpptPanelSig) {
        sun2000.mpptPanelSig = param.numPvStrings + " " + param.numMPPT;
        let panel = sun2000GUI.dcCompPanel;
        let comp = sun2000GUI.dataComp.mpptData;
        hh.removeAllChilds(panel);
        let inputPerMppt = param.numPvStrings / param.numMPPT;
        for (var i = 0; i < param.numMPPT; i++) {
            hh.addHeaderTitleToPC(panel, 'MPPT ' + (i + 1));
            if (comp[i] === undefined) {
                comp[i] = {};
            }
            if (comp[i]['stringsArr'] === undefined) {
                comp[i]['stringsArr'] = {};
            }
            for (var j = 0; j < inputPerMppt; j++) {
                if (!comp[i]['stringsArr'][j]) {
                    comp[i]['stringsArr'][j] = {};
                }
                comp[i]['stringsArr'][j].current = hh.adf(panel, 'Input' + (j + 1) + ' Current', 'A');
                comp[i]['stringsArr'][j].voltage = hh.adf(panel, 'Input' + (j + 1) + ' Voltage', 'V');
            }
        }
    }
};

sun2000.updateParam = function (dev, param) {
    try {
        sun2000.initMPPTData(dev, param);
    } catch (e) {
        console.warn(e);
    }

    let lc = sun2000GUI.labelComp;
    lc.serialNumber.value = dev.serialNumber;
    lc.deviceName.value = dev.deviceName;
    lc.hwVer.value = dev.hwVer;
    lc.fwVer.value = dev.fwVer;
    lc.installedDate.value = dev.installedDate;
    lc.mpptQty.value = param.numMPPT;
    lc.inputQty.value = param.numPvStrings;
    lc.modbusAddress.value = param.modbusAddress;
    lc.comPort.value = param.comPort;
};


dm.onSelectedDataReceived(sun2000.updateData);

dm.onSelectedParamInit(sun2000.updateParam);

dm.onSelectedChange(function (dev) {
    if (dev.param) {
        sun2000.updateParam(dev, dev.param);
    }
    if (dev.data) {
        sun2000.updateData(dev, dev.data);
    }
});

dm.onSelectedStatusChange(function (dev, state) {

});

dm.onParamReceived(function (dev, param) {

});

document.addEventListener("DOMContentLoaded", function (event) {
    console.log('%c HUAWEI SUN2000 JS ver:1.0.1 ', 'font-size: 18px; -webkit-box-shadow: 0 1px 3px 0 rgb(0 0 0 / 33%), 0 5px 1px 0 rgb(0 0 0 / 14%), 0 4px 19px -1px rgb(0 0 0 / 59%)');
    sun2000.init();
});

