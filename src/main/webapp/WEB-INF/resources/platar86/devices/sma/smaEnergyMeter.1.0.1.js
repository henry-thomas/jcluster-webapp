/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, fetch, hh */


var smaEm = {

};
smaEm.updateData = function (dev, data) {
//    console.log(data);
    mainUtils.setHtmlText("uixSmaEm_serial", dev.serialNumber);
    mainUtils.setHtmlText("uixSmaEm_installationDate", dev.installedDate);

    smaEm.updatePhaPowerData('uixSmaEm_sum', data.sumImportPower, data.sumExportPower);
    smaEm.updatePhaPowerData('uixSmaEm_pha1', data.pha1ImportPower, data.pha1ExportPower);
    smaEm.updatePhaPowerData('uixSmaEm_pha2', data.pha2ImportPower, data.pha2ExportPower);
    smaEm.updatePhaPowerData('uixSmaEm_pha3', data.pha3ImportPower, data.pha3ExportPower);

//    test.value = data.sumImportPower.powerW;
};

smaEm.updatePhaPowerData = function (classPrefix, pI, pE) {

    mainUtils.setHtmlText(classPrefix + 'I' + 'apparentEnergyVAh', pI.apparentEnergyVAh / 1000, 2);
    mainUtils.setHtmlText(classPrefix + 'E' + 'apparentEnergyVAh', pE.apparentEnergyVAh / 1000, 2);
    mainUtils.setHtmlText(classPrefix + 'I' + 'reactiveEnergyVARh', pI.reactiveEnergyVARh / 1000, 2);
    mainUtils.setHtmlText(classPrefix + 'E' + 'reactiveEnergyVARh', pE.reactiveEnergyVARh / 1000, 2);
    mainUtils.setHtmlText(classPrefix + 'I' + 'energyWh', pI.energyWh / 1000, 2);
    mainUtils.setHtmlText(classPrefix + 'E' + 'energyWh', pE.energyWh / 1000, 2);

    mainUtils.setHtmlText(classPrefix + 'I' + 'powerName', pI.powerName);
    mainUtils.setHtmlText(classPrefix + 'E' + 'powerName', pE.powerName);

    mainUtils.setHtmlText(classPrefix + 'voltageV', pE.voltageV, 2);
    mainUtils.setHtmlText(classPrefix + 'powerFactorCosF', pE.powerFactorCosF, 3);

    if (pI.apparentPowerVA > 0) {
        mainUtils.setHtmlText(classPrefix + 'apparentPowerVA', pI.apparentPowerVA / 1000, 3);
        mainUtils.setHtmlText(classPrefix + 'powerW', pI.powerW / 1000, 3);
        mainUtils.setHtmlText(classPrefix + 'reactivePowerVAR', (pE.reactivePowerVAR / 1000) * -1, 3);
        mainUtils.setHtmlText(classPrefix + 'currentA', pI.currentA, 2);
    } else {
        mainUtils.setHtmlText(classPrefix + 'apparentPowerVA', (pE.apparentPowerVA / 1000) * -1, 3);
        mainUtils.setHtmlText(classPrefix + 'powerW', (pE.powerW / 1000) * -1, 2);
        mainUtils.setHtmlText(classPrefix + 'reactivePowerVAR', (pI.reactivePowerVAR / 1000), 3);
        mainUtils.setHtmlText(classPrefix + 'currentA', pE.currentA * -1, 3);

    }

};

smaEm.updateParam = function (dev, param) {
//    if (param.paramMap === null) {
//        return;
//    }
//
//    if (param.paramMap[1] !== undefined && param.paramMap[1].fixBlock !== undefined) {
//        for (var item in  param.paramMap[1].fixBlock) {
//            let i = param.paramMap[1].fixBlock[item];
//            mainUtils.setHtmlText("uixp-" + item, i);
//        }
//        console.log(param.paramMap[1]);
//    }

};
//smaEm.template = new Em3PhGuiTemplate();

devManager.onSelectedDataReceived(smaEm.updateData);
devManager.onSelectedParamInit(smaEm.updateParam);
devManager.onSelectedChange(function (sDev) {
    if (sDev.connected) {
        smaEm.updateParam(sDev, sDev.getParam());
        smaEm.updateData(sDev, sDev.getData());
    } else {
        mainUtils.setHtmlText('dataValues', 'N/A');
    }
//    console.log(arguments);
});
devManager.onParamReceived(function (sDev, param) {
    for (var model in param.paramMap) {
//        console.log("request Param", param);
        if (smaEm.smdx[model] === undefined) {
            smaEm.fetchSunSpecDef(model);
        }
    }
});
devManager.onSelectedStatusChange(function (sDev) {
    if (sDev.connected) {
        smaEm.updateData(sDev, sDev.getData());
    } else {
        mainUtils.setHtmlText('dataValues', 'N/A');
    }
});

$(document).ready(function () {


});

(function (root) {
    function EMeterGui() {
        this.emTemplate = new Em3PhGuiTemplate()
        init.call(this);
    }

    function init() {

        hh.addHeaderTitleToPC(this.emTemplate.sumCard, "Energy Counters");
        this.emTemplate.sumCard.energyImport = hh.adf(this.emTemplate.sumCard, "Energy Import", "Wh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.sumCard.energyExport = hh.adf(this.emTemplate.sumCard, "Energy Export", "Wh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.sumCard.apparentEnergyImport = hh.adf(this.emTemplate.sumCard, "Apparent Energy Import", "VAh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.sumCard.apparentEnergyExport = hh.adf(this.emTemplate.sumCard, "Apparent Energy Export", "VAh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.sumCard.reactiveEnergyImport = hh.adf(this.emTemplate.sumCard, "Reactive Energy Import", "VARh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.sumCard.reactiveEnergyExport = hh.adf(this.emTemplate.sumCard, "Reactive Energy Export", "VARh", {decimal: 2, sIPrefix: ['k']});

        hh.addHeaderTitleToPC(this.emTemplate.ph1Card, "Energy Counters");
        this.emTemplate.ph1Card.energyImport = hh.adf(this.emTemplate.ph1Card, "Energy Import", "Wh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.ph1Card.energyExport = hh.adf(this.emTemplate.ph1Card, "Energy Export", "Wh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.ph1Card.apparentEnergyImport = hh.adf(this.emTemplate.ph1Card, "Apparent Energy Import", "VAh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.ph1Card.apparentEnergyExport = hh.adf(this.emTemplate.ph1Card, "Apparent Energy Export", "VAh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.ph1Card.reactiveEnergyImport = hh.adf(this.emTemplate.ph1Card, "Reactive Energy Import", "VARh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.ph1Card.reactiveEnergyExport = hh.adf(this.emTemplate.ph1Card, "Reactive Energy Export", "VARh", {decimal: 2, sIPrefix: ['k']});

        hh.addHeaderTitleToPC(this.emTemplate.ph2Card, "Energy Counters");
        this.emTemplate.ph2Card.energyImport = hh.adf(this.emTemplate.ph2Card, "Energy Import", "Wh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.ph2Card.energyExport = hh.adf(this.emTemplate.ph2Card, "Energy Export", "Wh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.ph2Card.apparentEnergyImport = hh.adf(this.emTemplate.ph2Card, "Apparent Energy Import", "VAh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.ph2Card.apparentEnergyExport = hh.adf(this.emTemplate.ph2Card, "Apparent Energy Export", "VAh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.ph2Card.reactiveEnergyImport = hh.adf(this.emTemplate.ph2Card, "Reactive Energy Import", "VARh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.ph2Card.reactiveEnergyExport = hh.adf(this.emTemplate.ph2Card, "Reactive Energy Export", "VARh", {decimal: 2, sIPrefix: ['k']});

        hh.addHeaderTitleToPC(this.emTemplate.ph3Card, "Energy Counters");
        this.emTemplate.ph3Card.energyImport = hh.adf(this.emTemplate.ph3Card, "Energy Import", "Wh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.ph3Card.energyExport = hh.adf(this.emTemplate.ph3Card, "Energy Export", "Wh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.ph3Card.apparentEnergyImport = hh.adf(this.emTemplate.ph3Card, "Apparent Energy Import", "VAh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.ph3Card.apparentEnergyExport = hh.adf(this.emTemplate.ph3Card, "Apparent Energy Export", "VAh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.ph3Card.reactiveEnergyImport = hh.adf(this.emTemplate.ph3Card, "Reactive Energy Import", "VARh", {decimal: 2, sIPrefix: ['k']});
        this.emTemplate.ph3Card.reactiveEnergyExport = hh.adf(this.emTemplate.ph3Card, "Reactive Energy Export", "VARh", {decimal: 2, sIPrefix: ['k']});

        devManager.onSelectedDataReceived(updateData.bind(this));
    }

    function updateData(dev, data) {
        let pha1EPower = data.pha1ExportPower;
        let pha2EPower = data.pha2ExportPower;
        let pha3EPower = data.pha3ExportPower;
        let sumEPower = data.sumExportPower;
        let pha1IPower = data.pha1ImportPower;
        let pha2IPower = data.pha2ImportPower;
        let pha3IPower = data.pha3ImportPower;
        let sumIPower = data.sumImportPower;

        this.emTemplate.sumCard.energyImport.value = sumIPower.energyWh;
        this.emTemplate.sumCard.energyExport.value = sumEPower.energyWh;
        this.emTemplate.sumCard.reactiveEnergyImport.value = sumIPower.reactiveEnergyVARh;
        this.emTemplate.sumCard.reactiveEnergyExport.value = sumEPower.reactiveEnergyVARh;
        this.emTemplate.sumCard.apparentEnergyImport.value = sumIPower.apparentEnergyVAh;
        this.emTemplate.sumCard.apparentEnergyExport.value = sumEPower.apparentEnergyVAh;

        this.emTemplate.ph1Card.energyImport.value = pha1EPower.energyWh;
        this.emTemplate.ph1Card.energyExport.value = pha1IPower.energyWh;
        this.emTemplate.ph1Card.reactiveEnergyImport.value = pha1EPower.reactiveEnergyVARh;
        this.emTemplate.ph1Card.reactiveEnergyExport.value = pha1IPower.reactiveEnergyVARh;
        this.emTemplate.ph1Card.apparentEnergyImport.value = pha1EPower.apparentEnergyVAh;
        this.emTemplate.ph1Card.apparentEnergyExport.value = pha1IPower.apparentEnergyVAh;

        this.emTemplate.ph2Card.energyImport.value = pha2EPower.energyWh;
        this.emTemplate.ph2Card.energyExport.value = pha2IPower.energyWh;
        this.emTemplate.ph2Card.reactiveEnergyImport.value = pha2EPower.reactiveEnergyVARh;
        this.emTemplate.ph2Card.reactiveEnergyExport.value = pha2IPower.reactiveEnergyVARh;
        this.emTemplate.ph2Card.apparentEnergyImport.value = pha2EPower.apparentEnergyVAh;
        this.emTemplate.ph2Card.apparentEnergyExport.value = pha2IPower.apparentEnergyVAh;

        this.emTemplate.ph3Card.energyImport.value = pha3EPower.energyWh;
        this.emTemplate.ph3Card.energyExport.value = pha3IPower.energyWh;
        this.emTemplate.ph3Card.reactiveEnergyImport.value = pha3EPower.reactiveEnergyVARh;
        this.emTemplate.ph3Card.reactiveEnergyExport.value = pha3IPower.reactiveEnergyVARh;
        this.emTemplate.ph3Card.apparentEnergyImport.value = pha3EPower.apparentEnergyVAh;
        this.emTemplate.ph3Card.apparentEnergyExport.value = pha3IPower.apparentEnergyVAh;

    }

    $(document).ready(function () {
        root.eMeterGUI = new EMeterGui();
    });
}(window));

