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

/* global SVG, energyServiceBcReq, powerBcReq, dm, mainUtils, devTempData, eStorageTemp, mu */



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

function onEStorageDataUpdate(storageSum) {
    dComp.updateEStorageComponent(storageSum);
}
;
dm.onStorageReceived(function (d) {
    if (devTempData.dSwitch.state === 1) {
        dComp.updateComponent(d, 'storage');
    }
});

dm.onPowerReceived(function (d) {
    if (devTempData.dSwitch.state === 1) {
        dComp.updateComponent(d, 'power');
    }
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

var dComp = {
    // Required for switching between the Animated Dashboard and the Chart Dashboard 
    onDashboardChange: function () {
        devTempData.dSwitch.init = true;
        if (devTempData.dSwitch.state === 1) {
            dComp.pauseAnimation();
            devTempData.animateFadeEffect('.mainDashboardAnim');
        } else {
            devTempData.animateFadeEffect('.mainDashboardAnim');
            dComp.resumeAnimation();
        }
    },

    getBatChargePower: function (manager) {
        if (dm.eStorageArr.dataAvailable) {
            let p = dm.eStorageArr.sumData.powerW;
            if (p > 0) {
                return p;
            }
            return 0;
        }
        if (dm.getPowerStorageCharge().dataAvailable) {
            return  dm.getPowerStorageCharge().sumData.powerW;
        }
        if (dm.getPowerStorageDischarge().dataAvailable && dm.getPowerStorageDischarge().sumData.powerW > 0) {
            return 0;
        }

        var pv = dm.getPowerPv();
        var grid = dm.getPowerGridOut();
        var load = dm.getPowerLoad();

        if (pv.dataAvailable && grid.dataAvailable && load.dataAvailable) {
            var p = load.sumData.powerW - (grid.sumData.powerW + pv.sumData.powerW);
            if (p < 0) {
                return p * -1;
            }
        } else if (pv.dataAvailable && load.dataAvailable) {
            var p = load.sumData.powerW - (pv.sumData.powerW);
            if (p < 0) {
                return p * -1;
            }
        } else if (grid.dataAvailable && load.dataAvailable) {
            var p = load.sumData.powerW - (grid.sumData.powerW);
            if (p < 0) {
                return p * -1;
            }
        }
        return 0;
    },
    getBatDischargePower: function (manager) {
        if (dm.eStorageArr.dataAvailable) {
            let p = dm.eStorageArr.sumData.powerW;
            if (p < 0) {
                return p;
            }
            return 0;
        }
        if (dm.getPowerStorageDischarge().dataAvailable) {
            return  dm.getPowerStorageDischarge().sumData.powerW;
        }
        if (dm.getPowerStorageCharge().dataAvailable && dm.getPowerStorageCharge().sumData.powerW > 0) {
            return 0;
        }

        var pv = dm.getPowerPv();
        var grid = dm.getPowerGridOut();
        var load = dm.getPowerLoad();

        if (pv.dataAvailable && grid.dataAvailable && load.dataAvailable) {
            var p = load.sumData.powerW - (grid.sumData.powerW + pv.sumData.powerW);
            if (p > 0) {
                return p;
            }
        } else if (pv.dataAvailable && load.dataAvailable) {
            var p = load.sumData.powerW - (pv.sumData.powerW);
            if (p > 0) {
                return p;
            }
        } else if (grid.dataAvailable && load.dataAvailable) {
            var p = load.sumData.powerW - (grid.sumData.powerW);
            if (p > 0) {
                return p;
            }
        }
        return 0;
    },
    // Animating the battery level
    updateComponent: function (manager, eventType) {
        if (dm.eStorageArr.dataAvailable) {
            SVG.get('batBalloonGroup').style('opacity', 1);
            SVG.get('bat').style('opacity', 1);

            var storage = dm.eStorageArr.sumData;
            dComp.bat.available = true;
            var p = storage.powerW;

//            console.log(storage.remainingTimeSign);

            var remTime;
            if (storage.remainingTimeSign !== undefined) {
                if ((storage.powerW > 0 && storage.remainingTimeSign < 0) || (storage.powerW < 0 && storage.remainingTimeSign > 0) || storage.remainingTimeSign === 0) {
                    SVG.get('batRemaingnTimeLabel').plain('--------');
                    SVG.get('batRemaingnTimeValueLabel').plain(' ');
                } else {
                    if (storage.remainingTimeSign > 0) {
                        remTime = mu.getTimeFromSeconds(storage.remainingTimeSign);
                        SVG.get('batRemaingnTimeValueLabel').plain(remTime);
                        SVG.get('batRemaingnTimeLabel').plain('Charging time');
                    } else {
                        remTime = mu.getTimeFromSeconds(storage.remainingTimeSign * -1);
                        SVG.get('batRemaingnTimeValueLabel').plain(remTime);
                        SVG.get('batRemaingnTimeLabel').plain('Discharging time');
                    }
                }

            } else {
                remTime = eStorageTemp.calcAvrgCurrent(p, (storage.capacityAh * storage.ratedVoltageV));
                if (remTime < 0) {
                    remTime *= -1;
                }
            }



            dComp.bat.powerW = storage.powerW;
            var capkWh = (storage.capacityAh * storage.ratedVoltageV) / 1000;
            var ratedCapkWh = (storage.ratedCapacityAh * storage.ratedVoltageV) / 1000;



            if (storage.powerW < 0) {
                dComp.bat.levelBar.setMaxLevel(dm.eStorageArr.sumData.reatedDischargePowerW);
                dComp.bat.levelBar.setLevel(storage.powerW * -1);
                dComp.bat.dotAnimBatDischOrange.setMaxLevel(dm.eStorageArr.sumData.reatedDischargePowerW);
                dComp.load.dotAnimLoadOrange.setMaxLevel(dm.eStorageArr.sumData.reatedDischargePowerW);
                dComp.bat.dotAnimBatDischOrange.setLevel(storage.powerW * -1);
                dComp.load.dotAnimLoadOrange.setLevel(storage.powerW * -1);
            } else {
                dComp.bat.levelBar.setMaxLevel(dm.eStorageArr.sumData.reatedChargePowerW);
                dComp.bat.levelBar.setLevel(storage.powerW);

                dComp.bat.dotAnimBatDischOrange.setMaxLevel(dm.eStorageArr.sumData.reatedChargePowerW);
                dComp.load.dotAnimLoadOrange.setMaxLevel(dm.eStorageArr.sumData.reatedChargePowerW);
//                dComp.bat.dotAnimBatDischOrange.setLevel(storage.powerW);
//                dComp.load.dotAnimLoadOrange.setLevel(storage.powerW );
            }


            SVG.get('batCapInKwhLabel').plain(capkWh.toFixed(1) + ' (' + ratedCapkWh.toFixed(1) + ')');
            SVG.get('batCapInPercLabel').plain(storage.capacityP.toFixed(1) + '%');

            SVG.get('batPowerLabel').plain((storage.powerW / 1000).toFixed(2) + ' kW');

            dComp.setBatLevel(storage.capacityP);
console.log("storage.capacityP");

        } else {
            SVG.get('batBalloonGroup').style('opacity', 0.5);
            SVG.get('bat').style('opacity', 0.1);
        }



        var batChPower = this.getBatChargePower();
        var batDiscPower = this.getBatDischargePower();

        var pvObj = dm.getPowerPv();
        var gridObj = dm.getPowerGridOut();
        var loadObj = dm.getPowerLoad();

        if (pvObj.sumData.available) {
            SVG.get('pv').style('opacity', 1);
            SVG.get('pvBalloonGroup').style('opacity', 1);
        } else {
            SVG.get('pv').style('opacity', 0.1);
            SVG.get('pvBalloonGroup').style('opacity', 0.5);
        }
        if (gridObj.sumData.available) {
            SVG.get('grid').style('opacity', 1);
            SVG.get('gridBalloonGroup').style('opacity', 1);
        } else {
            SVG.get('grid').style('opacity', 0.1);
            SVG.get('gridBalloonGroup').style('opacity', 0.5);
        }
        if (loadObj.sumData.available) {
            SVG.get('load').style('opacity', 1);
            SVG.get('loadBalloonGroup').style('opacity', 1);
        } else {
            SVG.get('load').style('opacity', 0.1);
            SVG.get('loadBalloonGroup').style('opacity', 0.5);
        }

        var pSum = pvObj.sumData;
        var gSum = gridObj.sumData;
        var lSum = loadObj.sumData;

        var pvPower = pSum.powerW || 0;
        var gridPower = gSum.powerW || 0;
        var loadPower = lSum.powerW || 0;

        var loadPvPower = 0;
        var loadGridPower = 0;
        var loadBatPower = 0;

        var batGridPower = 0;
        var batPvPower = 0;



        if (dComp.bat.available === true) {
            var batPowerW = dComp.bat.powerW;
            if (batPowerW < 0) {
                batDiscPower = batPowerW * -1;
                loadBatPower = batDiscPower;
                loadPvPower = pvPower;

            } else {

                batChPower = batPowerW;
                if (loadPower < pvPower) {
                    loadPvPower = loadPower;
                    batPvPower = pvPower - loadPower;
                } else {
                    loadPvPower = pvPower;
                }

            }
            if (gridPower > 0) {
                loadGridPower = loadPower;
                if (batPowerW > 0) {
                    batGridPower = gridPower - loadGridPower;
                    batPvPower = pvPower;
                }
                loadPvPower = 0;
            } else {
                loadGridPower = 0;
            }

        } else {
            if (gridPower > 0) {
                loadGridPower = loadPower;
                if (batChPower > 0) {
                    batGridPower = gridPower - loadGridPower;
                    batPvPower = pvPower;
                }
                loadPvPower = 0;
            } else {
                loadGridPower = 0;
            }
        }

        //=============PV===================

        if (pSum.powerW !== undefined) {
            dComp.pv.levelBar.setMaxLevel(pSum.ratedPowerW);
            dComp.pv.levelBar.setLevel(pSum.powerW);
            dComp.pv.dotAnimPvOut.setMaxLevel(pSum.ratedPowerW);
            dComp.pv.dotAnimPvOut.setLevel(pSum.powerW);

            dComp.pv.labels.power.plain((pSum.powerW / 1000).toFixed(2));
            dComp.pv.labels.dEnergy.plain((pSum.dailyEnergyWh / 1000).toFixed(1) + ' kWh');
            dComp.pv.labels.tEnergy.plain((pSum.energyWh / 1000).toFixed(1) + ' kWh');

            dComp.bat.dotAnimBatChGreen.setMaxLevel(pSum.ratedPowerW);

        }
        //=============GRID================



//        SVG.get('pvBalloonGroup').style('opacity', 1);
        if (gSum.powerW !== undefined) {
            dComp.grid.levelBar.setMaxLevel(gSum.ratedPowerW);
            dComp.grid.levelBar.setLevel(gSum.powerW);

            dComp.grid.dotAnimGridRed.setMaxLevel(gSum.ratedPowerW);
            dComp.grid.dotAnimGridRed.setLevel(gridPower);
            dComp.grid.labels.power.plain((gSum.powerW / 1000).toFixed(2));
            dComp.grid.labels.dEnergy.plain((gSum.dailyEnergyWh / 1000).toFixed(1) + ' kWh');
            dComp.grid.labels.tEnergy.plain((gSum.energyWh / 1000).toFixed(1) + ' kWh');
            dComp.bat.dotAnimBatChRed.setMaxLevel(gSum.ratedPowerW);
            dComp.load.dotAnimLoadRed.setMaxLevel(gSum.ratedPowerW);
        }


        //=============LOAD================

        if (lSum.powerW !== undefined) {

            dComp.load.dotAnimLoadGreen.setMaxLevel(lSum.ratedPowerW);

            dComp.load.levelBar.setMaxLevel(lSum.ratedPowerW);
            dComp.load.levelBar.setLevel(lSum.powerW);
            dComp.load.labels.power.plain((lSum.powerW / 1000).toFixed(2));
            dComp.load.labels.dEnergy.plain((lSum.dailyEnergyWh / 1000).toFixed(1) + ' kWh');
            dComp.load.labels.tEnergy.plain((lSum.energyWh / 1000).toFixed(1) + ' kWh');
        }


        dComp.load.dotAnimLoadRed.setLevel(loadGridPower);
        dComp.load.dotAnimLoadGreen.setLevel(loadPvPower);

        if (batDiscPower > -60 && batDiscPower < 60) {
        } else {
        }

        dComp.bat.dotAnimBatChRed.setLevel(batGridPower);
        dComp.bat.dotAnimBatChGreen.setLevel(batPvPower);

        if (!dm.eStorageArr.dataAvailable) {
            dComp.load.dotAnimLoadOrange.setLevel(loadBatPower);
            dComp.bat.dotAnimBatDischOrange.setLevel(batDiscPower);
        }

    },
    grid: {
        icon: SVG.get('grid'),
        line: SVG.get('gridLine'),
        balloon: SVG.get('gridBalloon'),
        balloonLevelArr: [],
        label: 'grid',
        labels: {
            power: SVG.get('gridPowerValueLabel'),
            dEnergy: SVG.get('gridDailyEnergyLabel'),
            tEnergy: SVG.get('gridTotalEnergyLabel')
        },
        resetAllValues: function () {
            dComp.grid.labels.power.plain('---.--');
            dComp.grid.labels.dEnergy.plain('---.- kWh');
            dComp.grid.labels.tEnergy.plain('-----.- kWh');
            dComp.grid.levelBar.setLevel(0);
            dComp.grid.dotAnimGridRed.setLevel(0);
        },
        levelBar: new LevelBarComp(SVG.get('gridLevelRect'), 25, 7).setLevel(0),
        dotAnimGridRed: new DotAnimComp('dashBoardIconID',{
                    dotColor: '#Ff0000',
                    dotGradient: redGradient,
                    startX: 155,
                    startY: 184,
                    shape: shapeHor,
                    anim: [{x: 165}]
//                    anim: [{y: -65}, {x: 35}, {x: 70, y: 44}]
                })
    },
    load: {
        icon: SVG.get('load'),
        line: SVG.get('loadLine'),
        balloon: SVG.get('loadBalloon'),
        balloonLevelArr: [],
        label: 'load',
        labels: {
            power: SVG.get('loadPowerValueLabel'),
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
        },
        levelBar: new LevelBarComp(SVG.get('loadLevelRect'), 25, 7).setLevel(0),
        dotAnimLoadRed: new DotAnimComp('dashBoardIconID',{

                    dotColor: '#Ff0000',
                    dotGradient: redGradient,
                    startX: 405,
                    startY: 184,
                    shape: shapeHor,
                    anim: [{x: 165}]
//                    anim: [{y: -65}, {x: 35}, {x: 70, y: 44}]
                }, 1),
        dotAnimLoadGreen: new DotAnimComp('dashBoardIconID',{
                    dotColor: '#Ff0000',
                    dotGradient: greenGradient,
                    startX: 405,
                    startY: 184,
                    shape: shapeHor,
                    anim: [{x: 165}]
//                    anim: [{y: -65}, {x: 35}, {x: 70, y: 44}]
                }, 1),
        dotAnimLoadOrange: new DotAnimComp('dashBoardIconID',{
                    dotColor: '#Ff0000',
                    dotGradient: orangeGradient,
                    startX: 425,
                    startY: 184,
                    shape: shapeHor,
                    anim: [{x: 165}]
//                    anim: [{y: -65}, {x: 35}, {x: 70, y: 44}]
                }, 1)
    },
    pv: {
        levelBar: new LevelBarComp(SVG.get('pvLevelRect'), 25, 7).setLevel(0),
        dotAnimPvOut: new DotAnimComp('dashBoardIconID',{
                    dotColor: '#0fFa00',
                    dotGradient: greenGradient,
                    startX: 355,
                    startY: 80,
                    shape: shapeVer,
                    anim: [{y: 70}]
//                    anim: [{y: -65}, {x: 35}, {x: 70, y: 44}]
                }, 1),
        icon: SVG.get('pv'),
        balloon: SVG.get('pvBalloon'),
        line: SVG.get('pvLine'),
        balloonLevelArr: [],
        label: 'pv',
        labels: {
            power: SVG.get('pvPowerValueLabel'),
            dEnergy: SVG.get('pvDailyEnergyLabel'),
            tEnergy: SVG.get('pvTotalEnergyLabel')
        },
        resetAllValues: function () {
            dComp.pv.labels.power.plain('---.--');
            dComp.pv.labels.dEnergy.plain('---.- kWh');
            dComp.pv.labels.tEnergy.plain('-----.- kWh');
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
        levelBar: new LevelBarComp(SVG.get('batLevelRect'), 25, 7).setLevel(0),
        dotAnimBatChRed: new DotAnimComp('dashBoardIconID',{
                    dotColor: '#Ff0000',
                    dotGradient: redGradient,
                    startX: 355,
                    startY: 205,
                    shape: shapeVer,
                    anim: [{y: 70}]
                }, 1),
        dotAnimBatChGreen: new DotAnimComp('dashBoardIconID',{
                    dotColor: '#Ff0000',
                    dotGradient: greenGradient,
                    startX: 355,
                    startY: 205,
                    shape: shapeVer,
                    anim: [{y: 70}]
                }, 1),
        dotAnimBatDischOrange: new DotAnimComp('dashBoardIconID',{
                    dotColor: '#Ff0000',
                    dotGradient: orangeGradient,
                    startX: 355,
                    startY: 275,
                    shape: shapeVer,
                    anim: [{y: -65}]
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
    setLoggoBackgroundColor: function (color) {
        SVG.get('logoGradient').update(function (stop) {
            stop.at(0, color, 1);
            stop.at(0.9, '#ffffff', 0);
        });
    },
    init: function () {
        dComp.resetAnimation();
        document.addEventListener("visibilitychange", documentHideShowCallback, false);
    },

    pauseAnimation: function () {
        dComp.pv.dotAnimPvOut.pause();
        dComp.grid.dotAnimGridRed.pause();
        dComp.load.dotAnimLoadGreen.pause();
        dComp.load.dotAnimLoadOrange.pause();
        dComp.load.dotAnimLoadRed.pause();
        dComp.bat.dotAnimBatChGreen.pause();
        dComp.bat.dotAnimBatChRed.pause();
        dComp.bat.dotAnimBatDischOrange.pause();
    },
    resumeAnimation: function () {
        dComp.pv.dotAnimPvOut.resume();
        dComp.grid.dotAnimGridRed.resume();
        dComp.load.dotAnimLoadGreen.resume();
        dComp.load.dotAnimLoadOrange.resume();
        dComp.load.dotAnimLoadRed.resume();
        dComp.bat.dotAnimBatChGreen.resume();
        dComp.bat.dotAnimBatChRed.resume();
        dComp.bat.dotAnimBatDischOrange.resume();
    },

    resetAnimation: function () {
        SVG.get('grid').style('opacity', 0.1);
        SVG.get('gridBalloonGroup').style('opacity', 0.1);
        SVG.get('load').style('opacity', 0.1);
        SVG.get('loadBalloonGroup').style('opacity', 0.1);
        SVG.get('pv').style('opacity', 0.1);
        SVG.get('pvBalloonGroup').style('opacity', 0.1);
        SVG.get('bat').opacity(0.1);
        SVG.get('batBalloonGroup').style('opacity', 0.1);
//        SVG.get('batBalloonGroup').opacity(0.1);



        dComp.pv.labels.power.plain('---');
        dComp.pv.labels.dEnergy.plain('---.- kWh');
        dComp.pv.labels.tEnergy.plain('---.- kWh');


        dComp.load.labels.power.plain('---');
        dComp.load.labels.dEnergy.plain('---.- kWh');
        dComp.load.labels.tEnergy.plain('---.- kWh');


        dComp.grid.labels.power.plain('---');
        dComp.grid.labels.dEnergy.plain('---.- kWh');
        dComp.grid.labels.tEnergy.plain('---.- kWh');



        SVG.get('batCapInPercLabel').plain('--.-%');
        SVG.get('batCapInKwhLabel').plain('---.- kWh');
        SVG.get('batRemaingnTimeValueLabel').plain('--d --h --m');
        SVG.get('batPowerLabel').plain('---.- kW');

        dComp.pv.dotAnimPvOut.setLevel(0);
        dComp.grid.dotAnimGridRed.setLevel(0);
        dComp.load.dotAnimLoadGreen.setLevel(0);
        dComp.load.dotAnimLoadOrange.setLevel(0);
        dComp.load.dotAnimLoadRed.setLevel(0);
        dComp.bat.dotAnimBatChGreen.setLevel(0);
        dComp.bat.dotAnimBatChRed.setLevel(0);
        dComp.bat.dotAnimBatDischOrange.setLevel(0);
    }
};
$(document).ready(function () {
    dComp.init();
//    $(".mainDashboardAnim").swipe({
//        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
//            if (direction === 'left') {
//                dComp.onDashboardChange();
//            }
//        }
//    });
//    $(".mainDashboardChart").swipe({
//        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
//            if (direction === 'right') {
//                dComp.onDashboardChange();
//            }
//        }
//    });
    dComp.resetAnimation();
    wsm.onLoggerStatusChange = function (state) {
        if (state === false) {
            dComp.resetAnimation();
        }
    };
//    mainUtils.addLoggerStateChangeCallback(function (state) {
//        if (state === false) {
//            dComp.resetAnimation();
//        }
//    });
});



function documentHideShowCallback() {
    if (document.hidden) {
        dComp.resetAnimation();
    }
//    console.log('call document state changed');
}

dm.onPowerInit(function (dManager, powerTypes) {
    if (dm.initFlags.initPServiceBc === true) {
        if (dm.powerTypes['GRID OUT'] !== undefined && Object.keys(dm.powerTypes['GRID OUT']).length > 0) {
            SVG.get('gridBalloonGroup').style('opacity', 0.5);
        }
        if (dm.powerTypes['CONSUMERS'] !== undefined && Object.keys(dm.powerTypes['CONSUMERS']).length > 0) {
            SVG.get('loadBalloonGroup').style('opacity', 0.5);
        }
        if (dm.powerTypes['CONSUMERS'] !== undefined && Object.keys(dm.powerTypes['PV']).length > 0) {
            SVG.get('pvBalloonGroup').style('opacity', 0.5);
        }
    }
});