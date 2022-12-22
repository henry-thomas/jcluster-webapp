/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2020
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */

/* global envB, dm, energyUsage, mu, dashMan, hh, sui, SVG, devTempData, dComp, lc */

(function (root) {
    let DashboardManager = function () {
        return new DashboardManager.init();
    };


    DashboardManager.init = function () {
        this.version = '24-Nov-2020 1.0.1';

        this.initFlags = {
            initPServiceBc: false,
            initEServiceBc: false
        };

        this.eStorageArr = {
            dataArr: {},
            sumData: {},
            dataAvailable: false
        };

        this.powerTypes = {};
        this.getPowerDataFromPSM();

        this.onPowerInitCbArr = [];
        this.onStorageInitCbArr = [];


        this.dashboardContainer = document.querySelector('.dashboardCard');

        this.controlDiv = document.createElement('div');
        this.controlDiv.classList.add('dashboardControls');
        this.dashboardContainer.prepend(this.controlDiv);

        this.rightControlDiv = document.createElement('div');
        this.rightControlDiv.classList.add('dashboardControlsRight');
        this.rightControlDiv.style.gridArea = "rightControls";
        this.controlDiv.appendChild(this.rightControlDiv);

        this.createFullscreenToggle();
        this.createChartButton();

        this.isFullscreen = false;
        document.addEventListener('fullscreenchange', this.toggleFullscreen.bind(this));
        try {
            document.getElementById('chartLc').style.paddingTop = '2px';
            document.getElementById('chartLc').classList.remove('card');
        } catch (e) {
        }
    };

    DashboardManager.fn = DashboardManager.prototype;

    DashboardManager.fn.getPowerDataFromPSM = function () {
        this.initFlags.initPServiceBc = false;
        let powerList = {};

        psManager.onDataReceived(function () {

            //power in
            powerList.pv = psManager.getPVPower();
            powerList.gridImport = psManager.getGridImportPower();
            powerList.storageDischarge = psManager.getStorageDischargePower();
            powerList.other = psManager.getOtherPower();
            powerList.gen = psManager.getGenPower();
            
            //power out
            powerList.storageCharge = psManager.getStorageChargePower();
            powerList.gridExport = psManager.getGridExportPower();

            //load
            powerList.load = psManager.getLoadPower();


            this.updatePowers(powerList);
            if (!this.initFlags.initPServiceBc) {
                this.initFlags.initPServiceBc = true;
                mu.execCallback(this.onPowerInitCbArr);
                if (window.lc) {
//                    document.getElementById('chartLc').style.height = '100%';
//                    document.getElementById('chartLc').style.width = '100%';
                    document.querySelector('.smdui-chart-charContainer').style.height = 'webkit-fill-available';
//                    document.querySelector('.smdui-chart-charContainer').style.width = '100%';
                    document.querySelector('.smdui-chart-container').style.height = '100%';
                    document.querySelector('.smdui-chart-charContainer').style.height = '395px';

                }
            }
            if (Object.keys(this.powerTypes).length > 0 && this.initFlags.initEServiceBc) {
                this.updateComponent();
            }
        }.bind(this));

        this.initFlags.initEServiceBc = false;
        esManager.onDataReceived(function (messageList) {
            for (var item in messageList) {
                var obj = messageList[item];
                var sName = obj.storageName;
                if (sName !== undefined) {
                    this.insertEStorageData(sName, obj);
                }
            }
            if (!this.initFlags.initEServiceBc) {
                this.initFlags.initEServiceBc = true;
                mu.execCallback(this.onStorageInitCbArr);
            }
            if (Object.keys(this.powerTypes).length > 0 && this.initFlags.initPServiceBc) {
                this.updateComponent();
            }

        }.bind(this));
    };

    DashboardManager.fn.getPowerPv = function () {
        if (this.powerTypes.pv) {
            return this.powerTypes.pv;
        }
        return {sumData: {}};
    };

    DashboardManager.fn.getPowerLoad = function () {
        if (this.powerTypes.load) {
            return this.powerTypes.load;
        }
        return {sumData: {}};
    };

    DashboardManager.fn.getPowerGridIn = function () {
        if (this.powerTypes.gridExport) {

            //GRID IN is name for power going into grid, gridExport is power exported to grid (same thing)
            return this.powerTypes.gridExport;
        }
        return {sumData: {}};
    };

    DashboardManager.fn.getPowerGridOut = function () {
        if (this.powerTypes.gridImport) {
            return this.powerTypes.gridImport;
        }
        return {sumData: {}};
    };
    
    DashboardManager.fn.getPowerGridImport = function () {
        if (this.powerTypes.gridImport) {
            return this.powerTypes.gridImport;
        }
        return {sumData: {}};
    };
    
    DashboardManager.fn.getPowerGridExport = function () {
        if (this.powerTypes.gridExport) {
            return this.powerTypes.gridExport;
        }
        return {sumData: {}};
    };

    DashboardManager.fn.getPowerOther = function () {
        if (this.powerTypes.other) {
            return this.powerTypes.other;
        }
        return {sumData: {}};
    };

    DashboardManager.fn.getPowerStorageDischarge = function () {
        if (this.powerTypes.storageDischarge) {
            return this.powerTypes.storageDischarge;
        }
        return {sumData: {}};
    };

    DashboardManager.fn.getPowerStorageCharge = function () {
        if (this.powerTypes.storageCharge) {
            return this.powerTypes.storageCharge;
        }
        return {sumData: {}};
    };
    DashboardManager.fn.getPowerGen = function () {
        if (this.powerTypes.gen) {
            return this.powerTypes.gen;
        }
        return {sumData: {}};
    };

    DashboardManager.fn.onPowerInit = function (callback) {
        if (isFunction(callback)) {
            this.onPowerInitCbArr.push(callback);
        }
    };

    DashboardManager.fn.onPowerReceived = function (callback) {
        if (isFunction(callback)) {
            psManager.onDataReceived(callback);
        }
    };

    DashboardManager.fn.onStorageInit = function (callback) {
        if (isFunction(callback)) {
            this.onStorageInitCbArr.push(callback);
        }
    };

    DashboardManager.fn.onStorageReceived = function (callback) {
        if (isFunction(callback)) {
            esManager.onDataReceived(callback);
        }
    };

    DashboardManager.fn.insertPowerData = function (powerName, data) {
        this.powerTypes[powerName].dataAvailable = true;
        this.powerTypes[powerName].sumData = data;
    };

    DashboardManager.fn.insertEStorageData = function (storageName, storageData) {
        this.eStorageArr.dataArr[storageName] = storageData;
        this.eStorageArr.dataAvailable = true;
    };

    DashboardManager.fn.updatePowers = function (powerList) {
        for (let pwr in powerList) {
            this.powerTypes[pwr] = new PowerType(pwr);
            if (powerList[pwr] && powerList[pwr].available) {
                this.insertPowerData(pwr, powerList[pwr]);
            }
        }
    };

    //for internal use only
    function calcStorageSumData() {
        //calculate sum data for storage
        if (dashMan.eStorageArr.dataAvailable === true) {
            var s = dashMan.eStorageArr.sumData;
            s.capacityAh = 0;
            s.capacityP = 0;
            s.currentA = 0;
            s.powerW = 0;
            s.ratedCapacityAh = 0;
            s.ratedChargeCurrentC = 0;
            s.ratedDischargeCurrentC = 0;
            s.reatedChargePowerW = 0;
            s.reatedDischargePowerW = 0;
            s.ratedVoltageV = 0;
            s.voltageV = 0;
            s.remainingTimeSign = 0;

            var stCount = 0;
            for (var st in dashMan.eStorageArr.dataArr) {
                stCount++;
                var storage = dashMan.eStorageArr.dataArr[st];
                s.capacityAh += storage.capacityAh;
                s.capacityP += storage.capacityP;
                s.currentA += storage.currentA;
                s.powerW += storage.powerW;
                s.ratedCapacityAh += storage.ratedCapacityAh;
                s.ratedChargeCurrentC += storage.ratedChargeCurrentC;
                s.ratedDischargeCurrentC += storage.ratedDischargeCurrentC;
                s.ratedVoltageV += storage.ratedVoltageV;
                s.voltageV += storage.voltageV;
                if (storage.remainingTimeSign) {
                    s.remainingTimeSign += storage.remainingTimeSign;
                }
                s.voltageV += storage.voltageV;
                s.reatedChargePowerW += storage.voltageV * (storage.ratedChargeCurrentC * storage.ratedCapacityAh);
                s.reatedDischargePowerW += storage.voltageV * (storage.ratedDischargeCurrentC * storage.ratedCapacityAh);
            }
            if (stCount > 1) {
                s.remainingTimeSign |= s.remainingTimeSign / stCount;
                s.voltageV |= s.voltageV / stCount;
                s.ratedVoltageV |= s.ratedVoltageV / stCount;
                s.capacityP = s.capacityP / stCount;
            }
        }
    }
    DashboardManager.fn.updateComponent = function () {
//        if (envB !== undefined) {
//            this.powerTypes.pv.ss = 0;
//            envB.pvValues = this.powerTypes.pv;
//            if (envB.pvValues.dataAvailable) {
//                envB.dataChange();
//            }
//        }
        if (energyUsage !== undefined) {
            energyUsage.powers = this.powerTypes;
            energyUsage.dataChange();
        }

        calcStorageSumData();
    };

    DashboardManager.fn.createFullscreenToggle = function () {
        let container = this.rightControlDiv;
        let button = sui.buttonCustom({
            text: `<i class = "fas fa-expand"></i>`,
            type: 'small'
        });
        container.appendChild(button);
        this.fullscreenButton = button;
        button.addEventListener('click', () => {
            if (this.isFullscreen === false) {
                hh.openFullscreen(this.dashboardContainer);
            } else {
                hh.closeFullscreen();
            }
        });
    };

    DashboardManager.fn.createChartButton = function () {
        let container = this.rightControlDiv;
        let button = sui.buttonCustom({
            text: `<i class = "fas fa-chart-line"></i>`,
            type: 'small'
        });
        this.dashboardSwitchButton = button;
        container.appendChild(button);
//        sui.addTooltip(button, 'Switch Dashboard');
        button.addEventListener('click', this.switchDashboard.bind(this, button));
    };

    DashboardManager.fn.switchDashboard = function (button) {
        if (!this.isChartInit && window.lc) {
            lc.start();
            this.isChartInit = true;
            console.log('lc init');
        }
        dComp.onDashboardChange();
        let dashControls = document.querySelector('.dashboardControlsRight');
        let chartControls = document.querySelector('.smdui-chart-controlRight');
        let chartDiv = document.querySelector('.mainDashboardChart');
        let animDiv = document.querySelector('.mainDashboardAnim');
        if (devTempData.dSwitch.state === 1) {
            button.text = `<i class = "fas fa-chart-line"></i>`;
            dashControls.appendChild(this.fullscreenButton);
            dashControls.appendChild(this.dashboardSwitchButton);
            chartDiv.style.position = 'absolute';
            chartDiv.style.display = 'none';
            animDiv.style.display = 'block';
            dashControls.style.display = 'flex';

        } else {
            button.text = '<i class="fas fa-tachometer-alt"></i>';
            chartControls.appendChild(this.fullscreenButton);
            chartControls.appendChild(this.dashboardSwitchButton);
            chartDiv.style.position = '';
            chartDiv.style.display = 'block';
            animDiv.style.display = 'none';
            dashControls.style.display = 'none';

        }


    };

    DashboardManager.fn.toggleFullscreen = function (button) {

        let svg = SVG.get('dashBoardIconID');
        let dashboardWapper = document.querySelector('.dashboardWraper');
        let chartCard = document.getElementById('chartLc');
        if (document.fullscreenElement) {
            this.isFullscreen = true;
            dashboardWapper.style.maxHeight = '100%';
            dashboardWapper.style.height = '100%';
            dashboardWapper.style.boxShadow = 'none';
            svg.node.style.maxHeight = '100%';
            chartCard.style.boxShadow = 'none';
            document.querySelector('.smdui-chart-charContainer').style.height = '90vh';

            this.fullscreenButton.text = `<i class = "fas fa-compress"></i>`;
        } else {
            this.isFullscreen = false;
            dashboardWapper.style = '';
            svg.node.style = '';
            chartCard.style.boxShadow = '';
            document.querySelector('.smdui-chart-charContainer').style.height = '395px';
            this.fullscreenButton.text = `<i class = "fas fa-expand"></i>`;
        }
    };

    DashboardManager.init.prototype = DashboardManager.fn;
    root.dashMan = DashboardManager();
//    root.dm = root.dashMan;

}(window));

