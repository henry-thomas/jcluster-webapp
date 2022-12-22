/* global logCon, PF, mainUtils, moment, devManager, bmsRelay */


var sic = {
    translate: {},
    devData: {},
    warnErrDialogSerial: false,
    colorPickerInit: false,
    capacityAhParamInit: false,
    subDeviceInit: false,
    subDeviceSelectedSerial: null
};

sic.updateDataGroup = function (exp, imp, prefix) {
    if (exp.powerW > 0) {
        mainUtils.setHtmlText(prefix + 'Power', exp.powerW / 1000, 3);
    } else {
        mainUtils.setHtmlText(prefix + 'Power', (imp.powerW / 1000) * -1, 3);
    }
    if (exp.currentA > 0) {
        mainUtils.setHtmlText(prefix + 'Current', exp.currentA, 2);
    } else {
        mainUtils.setHtmlText(prefix + 'Current', (imp.currentA) * -1, 2);
    }
    mainUtils.setHtmlText(prefix + 'AvrgVoltage', (exp.voltageV), 2);
    if (exp.reactivePowerVAR < 0) {
        mainUtils.setHtmlText(prefix + 'ReactivePower', exp.reactivePowerVAR / 1000, 3);
    } else {
        mainUtils.setHtmlText(prefix + 'ReactivePower', (imp.reactivePowerVAR / 1000) * -1, 3);
    }
};

sic.updateData = function (dev, data) {
    sic.updateDataGroup(data.outputPowerExp, data.outputPowerImp, "output");
    sic.updateDataGroup(data.inputPowerExp, data.inputPowerImp, "input");
    sic.updateDataGroup(data.master.inputPowerExp, data.master.inputPowerImp, "master_input");
    sic.updateDataGroup(data.master.outputPowerImp, data.master.outputPowerImp, "master_output");
    sic.updateDataGroup(data.slave1.inputPowerExp, data.slave1.inputPowerImp, "slave1_input");
    sic.updateDataGroup(data.slave1.outputPowerImp, data.slave1.outputPowerImp, "slave1_output");
    sic.updateDataGroup(data.slave2.inputPowerExp, data.slave2.inputPowerImp, "slave2_input");
    sic.updateDataGroup(data.slave2.outputPowerImp, data.slave2.outputPowerImp, "slave2_output");

};



devManager.onSelectedChange(function (sDev) {
    sic.updateParam(sDev, sDev.getParam());
    if (sDev.connected && sic.devData[sDev.serialNumber] !== undefined) {
        sic.updateData(sDev, sic.devData[sDev.serialNumber]);
    }
});

//devManager.onSelectedDataReceived(axAi.updateData);
devManager.onDataReceived(function (dev, data) {
    sic.devData[dev.serialNumber] = data;
    if (dev.selected === true) {
        sic.updateData(dev, data);
    }
});

devManager.onSelectedStatusChange(function (dev, state) {
    if (sic.devData[dev.serialNumber] !== undefined) {

        sic.updateData(dev, sic.devData[dev.serialNumber]);
    }
});

sic.updateParam = function (dev, param) {
    console.log(param);
    mainUtils.setHtmlText('masterSerial', param.serialNumber);
    mainUtils.setHtmlText('slave1SerialA', param.slave1Serial);
    mainUtils.setHtmlText('slave2Seria2A', param.slave2Serial);


    mainUtils.setHtmlText('clusterInMultiClusterA', sic.translate.clusterInMultiCluster(param.clusterInMultiCluster));
    mainUtils.setHtmlText('clusterSystemA', sic.translate.clusterSystem(param.clusterSystem));
    mainUtils.setHtmlText('phaseConfA', sic.translate.phaseConf(param.phaseConf));
    mainUtils.setHtmlText('systemVoltageA', sic.translate.systemVoltage(param.systemVoltage));

    if (param.clusterInMultiCluster === 3654) {
        mainUtils.setHtmlText('extClusterAddrA', param.extClusterAddr);
    } else {
        mainUtils.setHtmlText('extClusterAddrA', ' ');
    }

    mainUtils.setHtmlText('masterFwVer', dev.fwVer);
    mainUtils.setHtmlText('masterModelId', dev.modelID);
};
devManager.onSelectedParamInit(sic.updateParam);

sic.translate.phaseConf = function (a) {
    switch (a) {
        case 3649:
            return 'Single phase (1Phs)';
        case 3650:
            return 'Three-phase (3Phs)';
        default :
            return 'Unknown';
    }
};

sic.translate.systemVoltage = function (a) {
    switch (a) {
        case 3647:
            return '230V_50Hz (230V_50Hz)';
        case 3648:
            return '220V_60Hz (220V_60Hz)';
        default :
            return 'Unknown';
    }
};
sic.translate.clusterSystem = function (a) {
    switch (a) {
        case 3652:
            return 'Single-cluster (SingleClt)';
        case 3663:
            return 'Multi-cluster (MltClt)';
        default :
            return 'Unknown';
    }
};
sic.translate.clusterInMultiCluster = function (a) {
    switch (a) {
        case 3653:
            return 'Main-cluster (MainClt)';
        case 3654:
            return 'Extension cluster (ExtnClt)';
        default :
            return 'Unknown';
    }
};