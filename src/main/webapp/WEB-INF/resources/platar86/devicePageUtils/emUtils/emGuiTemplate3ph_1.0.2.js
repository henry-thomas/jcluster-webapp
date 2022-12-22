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


/* global hh, devManager, this, eMeterGUI */

(function (root) {
    function Em3PhGuiTemplate() {
        this.dataFields = {};
        this.generalInfo = {};
        this.params = {};
        this.paramData = {};
        _init.call(this);
    }

    let prot = Em3PhGuiTemplate.prototype;

    function _init() {
        devManager.onSelectedDataReceived(updateData.bind(this));
        devManager.onSelectedChange(updateInfo.bind(this));
        devManager.onSelectedChange(onSelectedChange.bind(this));



        this.mainTabPanel = new TabPanel(dgm.contentPanel, {
            menuItem: [
                {
                    label: "Device Info",
                    id: 'info'
                },
                {
                    label: "Live Data",
                    id: 'data'
                },
                {
                    label: "Settings",
                    id: 'settings'
                },
            ]
        });

        this.devInfo = this.mainTabPanel.getItemContentById('info');
        this.dataContent = this.mainTabPanel.getItemContentById('data');
        this.settingsContent = this.mainTabPanel.getItemContentById('settings');

        this.dataContent.classList.add('actDataContainer');
        this.devInfo.classList.add('actDataContainer');
//        this.otherInfoContent.classList.add('actDataContainer');
        _initGui.call(this);
    }

    function createPowerCard(heading, powerObj) {
        let card = hh.createActDataPanelCard(heading, null, this.dataContent);
        card.powerW = hh.adf(card, "Power", "W", {decimal: 2, sIPrefix: 'k'});
        card.voltageV = hh.adf(card, "Voltage", "V", {decimal: 2});
        card.currentA = hh.adf(card, "Current", "A", {decimal: 2});
        card.apparentPowerVA = hh.adf(card, "Apparent Power", "VA", {decimal: 2, sIPrefix: true});
        card.reactivePowerVAR = hh.adf(card, "Reactive Power", "VAR", {decimal: 2, sIPrefix: true});
        card.powerFactorCosF = hh.adf(card, "Power Factor", "Cos\u03B8", {decimal: 2});
        card.frequencyF = hh.adf(card, "Frequency", "Hz", {decimal: 2});

        return card;
    }

    function _initGui() {
        this.dataFields = {};
        this.dataFields.pha1ExportPower = {};
        this.dataFields.pha1ImportPower = {};
        this.dataFields.pha2ExportPower = {};
        this.dataFields.pha2ImportPower = {};
        this.dataFields.pha3ExportPower = {};
        this.dataFields.pha3ImportPower = {};
        this.dataFields.sumExportPower = {};
        this.dataFields.sumImportPower = {};


        let generalInfo = hh.createActDataPanelCard('General Info', null, this.devInfo);
        this.generalInfo.deviceName = hh.adf(generalInfo, "Device Model", "");
        this.generalInfo.manufacturer = hh.adf(generalInfo, "Manufacturer", "");
        this.generalInfo.serialNumber = hh.adf(generalInfo, "Serial Number", "");
        this.generalInfo.installedDate = hh.adf(generalInfo, "Install Date", "");


        this.sumCard = hh.createActDataPanelCard('Sum', null, this.dataContent);
        this.sumCard.powerW = hh.adf("Power", "W", {decimal: 2, sIPrefix: 'k', ctxMenu: [{label: "record to chart", cb: addToChart.bind(this)},
                {label: " Test Somthing", cb: test}]});
        this.sumCard.apparentPowerVA = hh.adf(this.sumCard, "Apparent Power", "VA", {decimal: 2, sIPrefix: true});
        this.sumCard.reactivePowerVAR = hh.adf(this.sumCard, "Reactive Power", "VAR", {decimal: 2, sIPrefix: true});
        this.sumCard.powerFactorCosF = hh.adf(this.sumCard, "Power Factor", "Cos\u03B8", {decimal: 2});


        this.ph1Card = createPowerCard.call(this, "Phase 1", this.dataFields.pha1ImportPower);
        this.ph2Card = createPowerCard.call(this, "Phase 2", this.dataFields.pha1ExportPower);
        this.ph3Card = createPowerCard.call(this, "Phase 3", this.dataFields.pha2ImportPower);

        new EmParams(this.settingsContent);

    }

    function addToChart() {
        console.log(eMeterGUI.emTemplate.sumCard.powerW.value / 1000);
        setInterval(function () {
            console.log(eMeterGUI.emTemplate.sumCard.powerW.value / 1000);
        }, 1000);

    }

    function test() {
        console.log("you clicked the test context");
    }

    function calcPhDataValues(imp, exp, phStr) {
        if (exp.powerW > 0) {
            this[phStr + "Card"].powerW.value = -exp.powerW;
            this[phStr + "Card"].apparentPowerVA.value = exp.apparentPowerVA;
            this[phStr + "Card"].reactivePowerVAR.value = exp.reactivePowerVAR;
            this[phStr + "Card"].powerFactorCosF.value = exp.powerFactorCosF;
            if (phStr !== "sum") {
                this[phStr + "Card"].voltageV.value = exp.voltageV;
                this[phStr + "Card"].currentA.value = -exp.currentA;
                this[phStr + "Card"].frequencyF.value = exp.frequencyF;

            }
        } else {
            this[phStr + "Card"].powerW.value = imp.powerW;
            this[phStr + "Card"].apparentPowerVA.value = imp.apparentPowerVA;
            this[phStr + "Card"].reactivePowerVAR.value = imp.reactivePowerVAR;
            this[phStr + "Card"].powerFactorCosF.value = imp.powerFactorCosF;
            if (phStr !== "sum") {
                this[phStr + "Card"].voltageV.value = imp.voltageV;
                this[phStr + "Card"].currentA.value = imp.currentA;
                this[phStr + "Card"].frequencyF.value = imp.frequencyF;

            }
        }
    }

    function populatePowers(data, isThreePhase) {
        //Will hide and show cards based on power values
        let pha1EPower = data.pha1ExportPower;
        let pha2EPower = data.pha2ExportPower;
        let pha3EPower = data.pha3ExportPower;
        let sumEPower = data.sumExportPower;
        let pha1IPower = data.pha1ImportPower;
        let pha2IPower = data.pha2ImportPower;
        let pha3IPower = data.pha3ImportPower;
        let sumIPower = data.sumImportPower;

        calcPhDataValues.call(this, pha1IPower, pha1EPower, "ph1");
        calcPhDataValues.call(this, pha2IPower, pha2EPower, "ph2");
        calcPhDataValues.call(this, pha3IPower, pha3EPower, "ph3");
        calcPhDataValues.call(this, sumIPower, sumEPower, "sum");


    }

    function updateInfo(dev, data) {
        hh.updateAdfFromObject(this.generalInfo, dev, true)
    }
    function updateData(dev, data) {
        populatePowers.call(this, data, true);
    }
    function onSelectedChange(data) {
        if (data.dataName) {
            hh.updateAdfFromObject(this.dataFields, data[data.dataName], true);
        }
    }


    $(document).ready(function () {
        root.Em3PhGuiTemplate = Em3PhGuiTemplate;
    });

}(window));
