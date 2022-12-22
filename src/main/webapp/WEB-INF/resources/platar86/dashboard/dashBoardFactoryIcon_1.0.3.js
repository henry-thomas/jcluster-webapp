/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by platar86, 2019
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 Sout Africa
 *  Phone: 021 555 2181
 *  
 */


/* global SVG, energyServiceBcReq, powerBcReq, dm, mainUtils, devTempData, eStorageTemp, mu, wsm */
var dCompData = {};
function initIconsStorage() {
    dComp.bat.esDataAvailable = true;
    dComp.bat.balloon.opacity(1);
    dComp.bat.icon.opacity(1);
    dComp.bat.line.opacity(1);
}

function initIcons() {
    console.log("initIcons");
    if (psManager.getGenPower()) {
        dCompData.gen = psManager.getGenPower();
        dComp.gen.icon.opacity((dCompData.gen.available) ? 1 : 0.3);
        dComp.gen.line.opacity((dCompData.gen.available) ? 1 : 0.3);
        dComp.gen.balloon.opacity((dCompData.gen.available) ? 1 : 0.3);
    } else {
//    if (psManager.powerTypeList["GEN EXPORT"].typeAvailable) {
//        dIconData.genExp = psManager.powerTypeList["GEN EXPORT"];
//    }
        dComp.gen.icon.opacity(0);
        dComp.gen.line.opacity(0);
        dComp.gen.balloon.opacity(0);
    }

    if (psManager.getPVPower()) {
        dCompData.pv = psManager.getPVPower();

        dComp.pv.icon.opacity(dCompData.pv.available ? 1 : 0.3);
        dComp.pv.line.opacity(dCompData.pv.available ? 1 : 0.3);
        dComp.pv.balloon.opacity(dCompData.pv.available ? 1 : 0.3);
    } else {
        dComp.pv.icon.opacity(0);
        dComp.pv.line.opacity(0);
        dComp.pv.balloon.opacity(0);
    }

    if (psManager.getGridExportPower()) {
        dCompData.gridEx = psManager.getGridExportPower();
    }
    if (psManager.getGridImportPower()) {
        dCompData.gridIm = psManager.getGridImportPower();
    }

    if (psManager.getGridExportPower() || psManager.getGridImportPower()) {
        let available = (dCompData.gridIm && dCompData.gridIm.available) || (dCompData.gridEx && dCompData.gridEx.available) || false;
        dComp.grid.icon.opacity(available ? 1 : 0.3);
        dComp.grid.line.opacity(available ? 1 : 0.3);
        dComp.grid.balloon.opacity(available ? 1 : 0.3);
    } else {
        dComp.grid.icon.opacity(0);
        dComp.grid.line.opacity(0);
        dComp.grid.balloon.opacity(0);
    }

    if (esManager.getSumData() && esManager.getSumData().available) {
        dCompData.bat = esManager.getSumData();
    }

    if (!dComp.bat.esDataAvailable) {
        if (psManager.getStorageChargePower() || psManager.getStorageDischargePower()) {
            let available = (dCompData.bat && dCompData.bat.available) || false;
            dComp.bat.icon.opacity(available ? 1 : 0.3);
            dComp.bat.line.opacity(available ? 1 : 0.3);
            dComp.bat.balloon.opacity(available ? 1 : 0.3);
        } else {
            dComp.bat.icon.opacity(0);
            dComp.bat.line.opacity(0);
            dComp.bat.balloon.opacity(0);
        }
    }

    if (psManager.getLoadPower()) {
        dCompData.load = psManager.getLoadPower();

        dComp.load.icon.opacity(dCompData.load.available ? 1 : 0.3);
        dComp.load.line.opacity(dCompData.load.available ? 1 : 0.3);
        dComp.load.balloon.opacity(dCompData.load.available ? 1 : 0.3);
    } else {
        dComp.load.icon.opacity(0);
        dComp.load.line.opacity(0);
        dComp.load.balloon.opacity(0);
    }
}

esManager.onDataReceived(function (data) {
//    debugger;
    if (!dComp.isStorageInit) {
        dComp.isStorageInit = true;
//        initIconsStorage();
    }
    updateStorageIconsData(data);
});
psManager.onDataReceived(function (data) {
    if (!dComp.isPowerInit) {
        dComp.isPowerInit = true;
        initIcons();
    }
    updateIconsData();
});

var mainSvg = SVG.get('dashBoardIconID');
var greenGradient = mainSvg.gradient('radial', function (stop) {
    stop.at({
        offset: 0.2,
        color: '#0fFa00',
        opacity: 0.8
    });
    stop.at({
        offset: 1,
        color: '#FFFFFF',
        opacity: 0
    });
});
var redGradient = mainSvg.gradient('radial', function (stop) {
    stop.at({
        offset: 0.2,
        color: '#Ff0000',
        opacity: 0.8
    });
    stop.at({
        offset: 1,
        color: '#FFFFFF',
        opacity: 0
    });
});
var brownGradient = mainSvg.gradient('radial', function (stop) {
    stop.at({
        offset: 0.2,
        color: '#7b3a29',
        opacity: 0.8
    });
    stop.at({
        offset: 1,
        color: '#FFFFFF',
        opacity: 0
    });
});
var orangeGradient = mainSvg.gradient('radial', function (stop) {
    stop.at({
        offset: 0.2,
        color: '#fdb712',
        opacity: 0.8
    });
    stop.at({
        offset: 1,
        color: '#FFFFFF',
        opacity: 0
    });
});

var size = 1;
var shapeHor = {
    minHeight: 15 * size,
    maxHeight: 40 * size,
    minWidth: 20 * size,
    maxWidth: 50 * size,
    name: 'rect'
};
var shapeVer = {
    minHeight: 15 * size,
    maxHeight: 40 * size,
    minWidth: 10 * size,
    maxWidth: 30 * size,
    name: 'rect'
};

function updateStorageIconsData(data) {
//    debugger;
    let batData = dCompData.bat;

    if (batData && batData.onlineSt > 0) {


        dComp.bat.balloon.opacity(1);
        dComp.bat.icon.opacity(1);
        dComp.bat.line.opacity(1);
//        debugger;
        dComp.bat.labels.capacity.plain(batData.capacityP.toFixed(batData.capacityP < 99 ? 1 : 0) + '%');
//        console.log(sum.capacityP.toFixed(sum.capacityP < 99 ? 1 : 0))
        let ratedCapWh = batData.ratedCapacityAh * batData.ratedVoltageV;
        dComp.setBatLevel(batData.capacityP.toFixed(batData.capacityP < 99 ? 1 : 0));
        if (batData.powerW < 0) {
            batData.powerW = -batData.powerW;
        }
        mu.formatDashboardValue(ratedCapWh, dComp.bat.labels.capacityKWH, 'Wh');
        mu.formatDashboardValue(batData.powerW, dComp.bat.labels.power, 'W');

    } else {
        dComp.bat.balloon.opacity(0);
        dComp.bat.icon.opacity(0);
        dComp.bat.line.opacity(0);
    }
}



function updateIconsData() {
    let data = psManager.getPowersForAnim();

    let pvToGridPower = data.outputData.grid.pvToGridPower;
    let storageToGridPower = data.outputData.grid.storageToGridPower;
    let gridToLoadPower = data.outputData.load.gridToLoadPower;
    let pvToLoadPower = data.outputData.load.pvToLoadPower;
    let storageToLoadPower = data.outputData.load.storageToLoadPower;
    let gridToStoragePower = data.outputData.storage.gridToStoragePower;
    let pvToStoragePower = data.outputData.storage.pvToStoragePower;
    let genToLoadPower = data.outputData.load.genToLoadPower;
    let genToStoragePower = data.outputData.storage.genToStoragePower;


    let genPower = data.serviceData.gen;
    let gridImpPower = data.serviceData.gridConsume;
    let gridExpPower = data.serviceData.gridFeed;
    let loadPower = data.serviceData.load;
    let pvPower = data.serviceData.pv;
    let storageSum = data.serviceData.storage;
    dCompData.bat = storageSum;

    //PV
    if (pvPower) {
        dComp.pv.levelBar.setMaxLevel(pvPower.ratedPowerW).setLevel(pvPower.powerW);
        dComp.pv.dotAnimPvOut.setMaxLevel(pvPower.ratedPowerW).setLevel(pvPower.powerW);
        mu.formatDashboardValue(pvPower.powerW, dComp.pv.labels.power, 'W', dComp.pv.labels.powerUnit);
        mu.formatDashboardValue(pvPower.dailyEnergyWh, dComp.pv.labels.dEnergy, 'Wh');
        mu.formatDashboardValue(pvPower.energyWh, dComp.pv.labels.tEnergy, 'Wh');
    }

    //Grid Imp
    if (gridImpPower) {
        dComp.grid.levelBar.setMaxLevel(gridImpPower.ratedPowerW).setLevel(gridImpPower.powerW);
        dComp.grid.dotAnimGridRed.setMaxLevel(gridImpPower.ratedPowerW).setLevel(gridImpPower.powerW);
        mu.formatDashboardValue(gridImpPower.powerW, dComp.grid.labels.power, 'W', dComp.grid.labels.powerUnit);
        mu.formatDashboardValue(gridImpPower.dailyEnergyWh, dComp.grid.labels.dEnergyImp, 'Wh');
        mu.formatDashboardValue(gridImpPower.energyWh, dComp.grid.labels.tEnergyImp, 'Wh');
    }

    //Grid Exp
    if (gridExpPower) {
        mu.formatDashboardValue(gridExpPower.dailyEnergyWh, dComp.grid.labels.dEnergyExp, 'Wh');
        mu.formatDashboardValue(gridExpPower.energyWh, dComp.grid.labels.tEnergyExp, 'Wh');
        
        if ((gridImpPower && gridImpPower.powerW === 0) || !gridImpPower) {
            dComp.grid.levelBar.setMaxLevel(gridExpPower.ratedPowerW).setLevel(gridExpPower.powerW);
            dComp.grid.dotAnimGridOrange.setMaxLevel(gridExpPower.ratedPowerW).setLevel(storageToGridPower);
            dComp.grid.dotAnimGridGreen.setMaxLevel(gridExpPower.ratedPowerW).setLevel(pvToGridPower);
            mu.formatDashboardValue(gridExpPower.powerW, dComp.grid.labels.power, 'W', dComp.grid.labels.powerUnit);
        } else { //Case where somehow there is gridImp and gridExp more than 0
            let gridPower = gridImpPower.powerW - gridExpPower.powerW;
            if (gridPower < 0) {
                gridPower = -gridPower;
                dComp.grid.levelBar.setMaxLevel(gridExpPower.ratedPowerW).setLevel(gridPower);
                dComp.grid.dotAnimGridOrange.setMaxLevel(gridExpPower.ratedPowerW).setLevel(storageToGridPower);
                dComp.grid.dotAnimGridGreen.setMaxLevel(gridExpPower.ratedPowerW).setLevel(pvToGridPower);
            } else {
                dComp.grid.levelBar.setMaxLevel(gridImpPower.ratedPowerW).setLevel(gridPower);
                dComp.grid.dotAnimGridRed.setMaxLevel(gridImpPower.ratedPowerW).setLevel(gridPower);
            }
            mu.formatDashboardValue(gridPower, dComp.grid.labels.power, 'W', dComp.grid.labels.powerUnit);
        } 
    }

    //Load
    if (loadPower) {
        dComp.load.levelBar.setMaxLevel(loadPower.ratedPowerW).setLevel(loadPower.powerW);
        dComp.load.dotAnimLoadRed.setMaxLevel(loadPower.ratedPowerW).setLevel(gridToLoadPower);
        dComp.load.dotAnimLoadGreen.setMaxLevel(loadPower.ratedPowerW).setLevel(pvToLoadPower);
        dComp.load.dotAnimLoadOrange.setMaxLevel(loadPower.ratedPowerW).setLevel(storageToLoadPower);
        dComp.load.dotAnimLoadBrown.setMaxLevel(loadPower.ratedPowerW).setLevel(genToLoadPower);
        mu.formatDashboardValue(loadPower.powerW, dComp.load.labels.power, 'W', dComp.load.labels.powerUnit);
        mu.formatDashboardValue(loadPower.dailyEnergyWh, dComp.load.labels.dEnergy, 'Wh');
        mu.formatDashboardValue(loadPower.energyWh, dComp.load.labels.tEnergy, 'Wh');
    }

    if (genPower) {
        dComp.gen.dotAnimGenBrown.setMaxLevel(genPower.ratedPowerW).setLevel(genPower.powerW);
        dComp.gen.levelBar.setMaxLevel(genPower.ratedPowerW).setLevel(genPower.powerW);
        mu.formatDashboardValue(genPower.powerW, dComp.gen.labels.power, 'W', dComp.gen.labels.powerUnit);
        mu.formatDashboardValue(genPower.dailyEnergyWh, dComp.gen.labels.dEnergy, 'Wh');
        mu.formatDashboardValue(genPower.energyWh, dComp.gen.labels.tEnergy, 'Wh');
    }

    if (storageSum) {
        dComp.bat.dotAnimBatChBrown.setMaxLevel(storageSum.ratedPowerW).setLevel(genToStoragePower);
        dComp.bat.dotAnimBatChGreen.setMaxLevel(storageSum.ratedPowerW).setLevel(pvToStoragePower);
        dComp.bat.dotAnimBatChRed.setMaxLevel(storageSum.ratedPowerW).setLevel(gridToStoragePower);
    }

    if (storageSum && storageSum.powerW >= 0) {
        dComp.bat.levelBar.setMaxLevel(storageSum.ratedPowerW).setLevel(storageSum.powerW);
        dComp.bat.dotAnimBatDischOrange.setMaxLevel(storageSum.ratedPowerW).setLevel(0);
    } else {
        dComp.bat.levelBar.setMaxLevel(storageSum.ratedPowerW).setLevel(-storageSum.powerW);
        dComp.bat.dotAnimBatDischOrange.setMaxLevel(storageSum.ratedPowerW).setLevel(-storageSum.powerW);
    }


    var remTime;
    if (storageSum && storageSum.remainingTimeSign !== undefined) {
        if ((storageSum.powerW > 0 && storageSum.remainingTimeSign < 0) || (storageSum.powerW < 0 && storageSum.remainingTimeSign > 0) || storageSum.remainingTimeSign === 0) {
            SVG.get('batRemaingnTimeLabel').plain('--------');
            SVG.get('batRemaingnTimeValueLabel').plain(' ');
        } else {
            if (storageSum.remainingTimeSign > 0) {
                remTime = mu.getTimeFromSeconds(storageSum.remainingTimeSign);
                SVG.get('batRemaingnTimeValueLabel').plain(remTime);
                SVG.get('batRemaingnTimeLabel').plain('Charging time');
            } else {
                remTime = mu.getTimeFromSeconds(storageSum.remainingTimeSign * -1);
                SVG.get('batRemaingnTimeValueLabel').plain(remTime);
                SVG.get('batRemaingnTimeLabel').plain('Discharging time');
            }
        }

    } else {
        remTime = eStorageTemp.calcAvrgCurrent(p, (storageSum.capacityAh * storageSum.ratedVoltageV));
        if (remTime < 0) {
            remTime *= -1;
        }
    }

    let ecoFactor = 0;

    if ((pvPower && genPower)) {
        if (pvPower.powerW === 0) {
            if (genPower.powerW === 0) {
                ecoFactor = 10;
            }
        }
    } else if (loadPower && pvPower) {
        if (pvToLoadPower === loadPower.powerW) {
            ecoFactor = 100;
        } else {
            ecoFactor = ((pvPower.powerW / loadPower.powerW) * 100) + 10;
        }
        setEcoFactor(ecoFactor);
    }
}

function setEcoFactor(ecoFactor) {
    if (ecoFactor >= 100) {
        dComp.load.iconEco.opacity(1);
        dComp.load.iconl1.opacity(1);
        dComp.load.iconl2.opacity(1);
        dComp.load.iconl3.opacity(1);
        dComp.load.iconS1.opacity(0);
        dComp.load.iconS2.opacity(0);
    } else if (ecoFactor > 90) {
        dComp.load.iconEco.opacity(0);
        dComp.load.iconl1.opacity(1);
        dComp.load.iconl2.opacity(1);
        dComp.load.iconl3.opacity(1);
        dComp.load.iconS1.opacity(0);
        dComp.load.iconS2.opacity(0);
    } else if (ecoFactor > 60) {
        dComp.load.iconEco.opacity(0);
        dComp.load.iconl1.opacity(0);
        dComp.load.iconl2.opacity(1);
        dComp.load.iconl3.opacity(1);
        dComp.load.iconS1.opacity(0);
        dComp.load.iconS2.opacity(0);
    } else if (ecoFactor > 30) {
        dComp.load.iconEco.opacity(0);
        dComp.load.iconl1.opacity(0);
        dComp.load.iconl2.opacity(0);
        dComp.load.iconl3.opacity(1);
        dComp.load.iconS1.opacity(0);
        dComp.load.iconS2.opacity(0);
    } else if (ecoFactor > 10) {
        dComp.load.iconEco.opacity(0);
        dComp.load.iconl1.opacity(0);
        dComp.load.iconl2.opacity(0);
        dComp.load.iconl3.opacity(1);
        dComp.load.iconS1.opacity(0);
        dComp.load.iconS2.opacity(0);
    } else if (ecoFactor > 5) {
        dComp.load.iconEco.opacity(0);
        dComp.load.iconl1.opacity(0);
        dComp.load.iconl2.opacity(0);
        dComp.load.iconl3.opacity(0);
        dComp.load.iconS1.opacity(1);
        dComp.load.iconS2.opacity(0);
    } else {
        dComp.load.iconEco.opacity(0);
        dComp.load.iconl1.opacity(0);
        dComp.load.iconl2.opacity(0);
        dComp.load.iconl3.opacity(0);
        dComp.load.iconS1.opacity(1);
        dComp.load.iconS2.opacity(1);
    }
}

var dComp = {
//    isPowerInit: false,
    // Required for switching between the Animated Dashboard and the Chart Dashboard 
    onDashboardChange: function () {
        devTempData.dSwitch.init = true;
        if (devTempData.dSwitch.state === 1) {
//            dComp.pauseAnimation();
            devTempData.animateFadeEffect('.mainDashboardAnim');
        } else {
            devTempData.animateFadeEffect('.mainDashboardAnim');
//            dComp.resumeAnimation();
        }
    },
    grid: {
        icon: SVG.get('grid'),
        line: SVG.get('gridLine'),
        balloon: SVG.get('gridBalloonGroup'),
        balloonLevelArr: [],
        label: 'grid',
        labels: {
            power: SVG.get('gridPowerValueLabel'),
            powerUnit: SVG.get('gridPowerUnitLabel'),
            dEnergyExp: SVG.get('gridDailyEnergyELabel'),
            tEnergyExp: SVG.get('gridTotalEnergyLabel'),
            dEnergyImp: SVG.get('gridDailyEnergyILabel'),
            tEnergyImp: SVG.get('gridTotalEnergyILabel')
        },
        resetAllValues: function () {
            dComp.grid.labels.power.plain('---.--');
            dComp.grid.labels.dEnergy.plain('---.- kWh');
            dComp.grid.labels.tEnergy.plain('-----.- kWh');
            dComp.grid.levelBar.setLevel(0);
            dComp.grid.dotAnimGridRed.setLevel(0);
        },
        levelBar: new LevelBarComp(SVG.get('gridLevelRect'), 35, 7).setLevel(0),
        dotAnimGridRed: new DotAnimComp('dashBoardIconID', {
            dotColor: '#Ff0000',
            dotGradient: redGradient,
            startX: 140,
            startY: 242,
            shape: shapeHor,
            anim: [{x: 160}]
//                    anim: [{y: -65}, {x: 35}, {x: 70, y: 44}]
        }, 1),
        dotAnimGridGreen: new DotAnimComp('dashBoardIconID', {
            dotColor: '#Ff0000',
            dotGradient: greenGradient,
            startX: 300,
            startY: 242,
            shape: shapeHor,
            anim: [{x: -160}]
//                    anim: [{y: -65}, {x: 35}, {x: 70, y: 44}]
        }, 1),
        dotAnimGridOrange: new DotAnimComp('dashBoardIconID', {
            dotColor: '#Ff0000',
            dotGradient: orangeGradient,
            startX: 300,
            startY: 242,
            shape: shapeHor,
            anim: [{x: -160}]
//                    anim: [{y: -65}, {x: 35}, {x: 70, y: 44}]
        }, 1)

    },
    gen: {
        icon: SVG.get('genIcon'),
        line: SVG.get('genLine'),
        balloon: SVG.get('genBalloon'),
        balloonLevelArr: [],
        label: 'gen',
        labels: {
            power: SVG.get('genPowerValueLabel'),
            powerUnit: SVG.get('genPowerUnitLabel'),
            dEnergy: SVG.get('genDailyEnergyLabel'),
            tEnergy: SVG.get('genTotalEnergyLabel')
        },
        resetAllValues: function () {
            dComp.gen.labels.power.plain('---.--');
            dComp.gen.labels.dEnergy.plain('---.-');
            dComp.gen.labels.tEnergy.plain('-----.-');
            dComp.gen.levelBar.setLevel(0);
            dComp.gen.dotAnimGenRed.setLevel(0);
        },
        levelBar: new LevelBarComp(SVG.get('genLevelRect'), 26, 7).setLevel(0),
        dotAnimGenBrown: new DotAnimComp('dashBoardIconID', {
            dotColor: '#7b3a29',
            dotGradient: brownGradient,
            startX: 130,
            startY: 308,
            shape: shapeHor,
            anim: [{x: 103}, {y: -67}, {x: 70}]
        }, 1)
    },
    load: {
        icon: SVG.get('factoryIcon'),
        iconEco: SVG.get('factoryIconECO'),
        iconl1: SVG.get('factoryIconl1'),
        iconl2: SVG.get('factoryIconl2'),
        iconl3: SVG.get('factoryIconl3'),
        iconS1: SVG.get('factoryIconS1'),
        iconS2: SVG.get('factoryIconS2'),
        line: SVG.get('loadLine'),
        balloon: SVG.get('factoryBalloon'),
        balloonLevelArr: [],
        label: 'load',
        labels: {
            power: SVG.get('loadPowerValueLabel'),
            powerUnit: SVG.get('loadsPowerUnitLabel'),
            dEnergy: SVG.get('loadDailyEnergyLabel'),
            tEnergy: SVG.get('loadTotalEnergyLabel')
        },
        resetAllValues: function () {
            dComp.load.labels.power.plain('---.--');
            dComp.load.labels.dEnergy.plain('---.- kWh');
            dComp.load.labels.tEnergy.plain('-----.- kWh');
            dComp.load.levelBar.setLevel(0);
            dComp.load.dotAnimLoadRed.setLevel(0);
            dComp.load.dotAnimLoadOrange.setLevel(0);
            dComp.load.dotAnimLoadGreen.setLevel(0);
            dComp.load.iconEco.opacity(0);
            dComp.load.iconl1.opacity(0);
            dComp.load.iconl2.opacity(0);
            dComp.load.iconl3.opacity(0);
            dComp.load.iconS1.opacity(0);
            dComp.load.iconS2.opacity(0);
        },
        levelBar: new LevelBarComp(SVG.get('loadLevelRect'), 26, 7).setLevel(0),
        dotAnimLoadRed: new DotAnimComp('dashBoardIconID', {
            dotColor: '#Ff0000',
            dotGradient: redGradient,
            startX: 405,
            startY: 242,
            shape: shapeHor,
            anim: [{x: 165}]
//                    anim: [{y: -65}, {x: 35}, {x: 70, y: 44}]
        }, 1),
        dotAnimLoadBrown: new DotAnimComp('dashBoardIconID', {
            dotColor: '#Ff0000',
            dotGradient: brownGradient,
            startX: 405,
            startY: 242,
            shape: shapeHor,
            anim: [{x: 165}]
//                    anim: [{y: -65}, {x: 35}, {x: 70, y: 44}]
        }, 1),
        dotAnimLoadGreen: new DotAnimComp('dashBoardIconID', {
            dotColor: '#Ff0000',
            dotGradient: greenGradient,
            startX: 405,
            startY: 242,
            shape: shapeHor,
            anim: [{x: 165}]
//                    anim: [{y: -65}, {x: 35}, {x: 70, y: 44}]
        }, 1),
        dotAnimLoadOrange: new DotAnimComp('dashBoardIconID', {
            dotColor: '#Ff0000',
            dotGradient: orangeGradient,
            startX: 405,
            startY: 242,
            shape: shapeHor,
            anim: [{x: 165}]
//                    anim: [{y: -65}, {x: 35}, {x: 70, y: 44}]
        }, 1)
    },
    pv: {
        levelBar: new LevelBarComp(SVG.get('pvLevelRect'), 26, 7).setLevel(0),
        dotAnimPvOut: new DotAnimComp('dashBoardIconID', {
            dotColor: '#0fFa00',
            dotGradient: greenGradient,
            startX: 351,
            startY: 97,
            shape: shapeVer,
            anim: [{y: 110}]
//                    anim: [{y: -65}, {x: 35}, {x: 70, y: 44}]
        }, 1),
        icon: SVG.get('pv'),
        balloon: SVG.get('pvBalloonGroup'),
        line: SVG.get('pvLine'),
        balloonLevelArr: [],
        label: 'pv',
        labels: {
            power: SVG.get('pvPowerValueLabel'),
            powerUnit: SVG.get('pvPowerUnitLabel'),
            dEnergy: SVG.get('pvDailyEnergyLabel'),
            tEnergy: SVG.get('pvTotalEnergyLabel')
        },
        resetAllValues: function () {
            dComp.pv.labels.power.plain('---.--');
            dComp.pv.labels.dEnergy.plain('---.-');
            dComp.pv.labels.tEnergy.plain('-----.-');
            dComp.pv.levelBar.setLevel(0);
            dComp.pv.dotAnimPvOut.setLevel(0);
        }
    },
    bat: {
        icon: SVG.get('bat'),
        line: SVG.get('batLine'),
        batFill: SVG.get('batFill'),
        balloon: SVG.get('batBalloon'),
        balloonLevelArr: [],
        labels: {
            capacity: SVG.get('batCapInPercLabel'),
            capacityKWH: SVG.get('batCapInKwhLabel'),
            remTime: SVG.get('batRemaingnTimeValueLabel'),
            power: SVG.get('batPowerLabel')
        },
        label: 'bat',
        resetAllValues: function () {

        },
        levelBar: new LevelBarComp(SVG.get('batLevelRect'), 26, 7).setLevel(0),
        dotAnimBatChRed: new DotAnimComp('dashBoardIconID', {
            dotColor: '#Ff0000',
            dotGradient: redGradient,
            startX: 352,
            startY: 255,
            shape: shapeVer,
            anim: [{y: 130}]
        }, 1),
        dotAnimBatChGreen: new DotAnimComp('dashBoardIconID', {
            dotColor: '#Ff0000',
            dotGradient: greenGradient,
            startX: 352,
            startY: 255,
            shape: shapeVer,
            anim: [{y: 130}]
        }, 1),
        dotAnimBatChBrown: new DotAnimComp('dashBoardIconID', {
            dotColor: '#Ff0000',
            dotGradient: brownGradient,
            startX: 352,
            startY: 255,
            shape: shapeVer,
            anim: [{y: 130}]
        }, 1),
        dotAnimBatDischOrange: new DotAnimComp('dashBoardIconID', {
            dotColor: '#Ff0000',
            dotGradient: orangeGradient,
            startX: 352,
            startY: 385,
            shape: shapeVer,
            anim: [{y: -130}]
        }, 1)
    },
    logoBg: SVG.get('logoGrowl'),
    logo: SVG.get('logo'),

    initBatLevel: function () {
//        SVG.get('bat').opacity(1);
        SVG.get('batFill').dy(-25);
        SVG.get('batFill').height(64);
    },
    setBatLevel: function (per) {
        if (!isNaN(per)) {
            if (per < 1) {
                per = 1;
                SVG.get('batFill').opacity(0);
            } else {
                SVG.get('batFill').opacity(1);
            }
            if (per > 100) {
                per = 100;
            }
            if (!dComp.batLevelInit) {
                dComp.initBatLevel();
                dComp.batLevelInit = true;
            }

            var corY = 1042 - (64 * (per / 100));
            var h = 64 * (per / 100);
//        978 = 100% 1028 = 0%  50
            SVG.get('batFill').y(corY);
            SVG.get('batFill').height(h);
        }
    },
};

$(document).ready(function () {
//    dComp.resetAnimation();
    wsm.onLoggerStatusChange = function (state) {
        if (state === false) {
//            dComp.resetAnimation();
        }
    };
});

function documentHideShowCallback() {
    if (document.hidden) {
//        dComp.resetAnimation();
    }
//    console.log('call document state changed');
}

