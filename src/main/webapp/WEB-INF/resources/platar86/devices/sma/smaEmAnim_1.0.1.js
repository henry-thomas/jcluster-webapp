/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */

/* global devManager, SVG, hh, parseInt */

devManager.onSelectedDataReceived(function (msg) {
    slemAnim.onPowerDataReceived(msg[msg.dataName]);
    clearTimeout(slemAnim.animTimeout);
//    console.log(msg[msg.dataName]);
}.bind(this));
devManager.onSelectedParamInit(function () {

});
devManager.onSelectedChange(function (sDev) {
//    ssgt.lastUnitLoaded = null;
    if (sDev.connected) {
    } else {
    }
//    console.log(arguments);
});
devManager.onSelectedStatusChange(function (sDev, status) {
//    ssgt.lastUnitLoaded = null;
    if (status) {

    } else {
        slemAnim.stopAnimation();
    }
});
let slemAnim = {
    groups: {},
    powerCircles: {},
    powerLabels: {},
    powerGroupObj: {},
    animDots: {},
    stopAnimation: function () {
//        for (let i in slemAnim.animDots) {
//            slemAnim.animDots[i].setLevel(0);
//        }
        for (let group in slemAnim.powerCircles) {
            slemAnim.groups[group].style('opacity', 0.1);
            slemAnim.powerCircles[group].val = 0;
            slemAnim.powerLabels[group].plain('--.--');
        }
        console.log('here');
    },
    init: function () {
        slemAnim.groups.ph1 = SVG.get('ph1Group');
        slemAnim.groups.ph2 = SVG.get('ph2Group');
        slemAnim.groups.ph3 = SVG.get('ph3Group');
        slemAnim.groups.sum = SVG.get('sumGroup');
        slemAnim.powerCircles.ph1 = new CircleGuage('ph1PowerCircle', 270, {formatter: true,tofixed: 1, labelId: "ph1PowerText"});
        slemAnim.powerCircles.ph2 = new CircleGuage('ph2PowerCircle', 270, {formatter: true, labelId: "ph2PowerText"});
        slemAnim.powerCircles.ph3 = new CircleGuage('ph3PowerCircle', 270, {formatter: true, labelId: "ph3PowerText"});
        slemAnim.powerCircles.sum = new CircleGuage('sumPowerCircle', 270, {formatter: true, labelId: "sumPowerText"});
        slemAnim.powerLabels.ph1 = SVG.get('ph1PowerText');
        slemAnim.powerLabels.ph2 = SVG.get('ph2PowerText');
        slemAnim.powerLabels.ph3 = SVG.get('ph3PowerText');
        slemAnim.powerLabels.sum = SVG.get('sumPowerText');
        slemAnim.animDots = {

            ph1: new DotAnimComp('energyMeterMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient, shape: shapeVer,
                startX: 22, startY: 9,
                minSpeed: 4000, maxSpeed: 2000,
                anim: [{x: 21}, {y: 12.5}, {x: 21}, {x: 60, hidden: 1}, {x: 20}],
                maxLevel: 100
            }),
            ph2: new DotAnimComp('energyMeterMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient, shape: shapeVer,
                startX: 22, startY: 33,
                minSpeed: 4000, maxSpeed: 2000,
                anim: [{x: 42}, {x: 60, hidden: 1}, {x: 20}],
                maxLevel: 100
            }, 1),
            ph3: new DotAnimComp('energyMeterMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient, shape: shapeVer,
                startX: 22, startY: 57,
                minSpeed: 4000, maxSpeed: 2000,
                anim: [{x: 21}, {y: -12.5}, {x: 20}, {x: 60, hidden: 1}, {x: 20}],
                maxLevel: 100
            }, 1)
        };
        slemAnim.stopAnimation();
        console.log(slemAnim);
    },
//    formatPowerLable: function (data, parent) {
//        let target = document.getElementById(parent);
//        let textLable = document.createElement("Text");
//
//
//    },

    updatePowerRatedPower: function (data) {
        if (data.sumExportPower.ratedPowerW > 0) {
            data.pha1ExportPower.ratedPowerW = data.sumExportPower.ratedPowerW / 3;
            data.pha2ExportPower.ratedPowerW = data.sumExportPower.ratedPowerW / 3;
            data.pha3ExportPower.ratedPowerW = data.sumExportPower.ratedPowerW / 3;
        }
        if (data.sumImportPower.ratedPowerW > 0) {
            data.pha1ImportPower.ratedPowerW = data.sumImportPower.ratedPowerW / 3;
            data.pha2ImportPower.ratedPowerW = data.sumImportPower.ratedPowerW / 3;
            data.pha3ImportPower.ratedPowerW = data.sumImportPower.ratedPowerW / 3;
        }
    },
    onPowerDataReceived: function (data) {


        if (devManager.getSelected().connected) {
            slemAnim.updatePowerRatedPower(data);
            slemAnim.updatePhPower('ph1', data.pha1ExportPower, data.pha1ImportPower);
            slemAnim.updatePhPower('ph2', data.pha2ExportPower, data.pha2ImportPower);
            slemAnim.updatePhPower('ph3', data.pha3ExportPower, data.pha3ImportPower);
            slemAnim.updateSumPower('sum', data.sumExportPower, data.sumImportPower);
        } else {
            slemAnim.stopAnimation();
        }
    },
    sigNumFormatter: function (val, sigNum) {
        let valLength;
        let intLength;
        let decLength;
        val = Number(val);
        if (val.toString().includes(".") || val.toString().includes(",")) {
            valLength = val.toString().length - 1;
            intLength = parseInt(val).toString().length;
        } else {
            valLength = val.toString().length;
            intLength = valLength;
            decLength = 0;
        }
        if (valLength === sigNum) {
            return val;
        }
        if (intLength >= sigNum) {
            return val.toFixed(0);
        } else {
            return val.toFixed(1);
        }
    },
    updatePhPower: function (powerName, powerExp, powerImp) {
        //powername like "ph1"
        let percPower = 0;
        let impRatedPowerW = 0;
        let impPowerW = 0;
        let expRatedPowerW = 0;
        let expPowerW = 0;
        if (powerImp.available || powerExp.available) {
            slemAnim.groups[powerName].style('opacity', 1);
        } else {
            slemAnim.groups[powerName].style('opacity', 0.1);
        }
//        debugger;
        if (powerImp.available) {
            impRatedPowerW = powerImp.ratedPowerW / 1000;
            impPowerW = (powerImp.powerW / 1000);
        }
        if (powerExp.available) {
            expRatedPowerW = powerExp.ratedPowerW / 1000;
            expPowerW = (powerExp.powerW / 1000);
        }

        if (impPowerW > 0) {
            percPower = impPowerW / impRatedPowerW * 100;
            slemAnim.animDots[powerName].setLevel(percPower);
//            slemAnim.powerLabels[powerName].plain(slemAnim.sigNumFormatter(impPowerW, 3));
            slemAnim.powerCircles[powerName].labelVal = impPowerW;
        } else if (expPowerW >= 0) {
            slemAnim.powerCircles[powerName].labelVal = expPowerW;
            percPower = expPowerW / expRatedPowerW * 100;
            slemAnim.animDots[powerName].setLevel(-percPower);
//            slemAnim.powerLabels[powerName].plain(-slemAnim.sigNumFormatter(expPowerW, 3));
        }


        slemAnim.powerCircles[powerName].val = percPower;
    },
    updateSumPower: function (powerName, powerExp, powerImp) {
        //powername like "ph1"
        let percPower = 0;
        let impRatedPowerW = 0;
        let impPowerW = 0;
        let expRatedPowerW = 0;
        let expPowerW = 0;
        if (powerImp.available || powerExp.available) {
            slemAnim.groups[powerName].style('opacity', 1);
        } else {
            slemAnim.groups[powerName].style('opacity', 0.1);
        }
//        debugger;
        if (powerImp.available) {
            impRatedPowerW = powerImp.ratedPowerW / 1000;
            impPowerW = (powerImp.powerW / 1000);
        }
        if (powerExp.available) {
            expRatedPowerW = powerExp.ratedPowerW / 1000;
            expPowerW = (powerExp.powerW / 1000);
        }

        if (impPowerW > 0) {
            percPower = impPowerW / impRatedPowerW * 100;
//            slemAnim.powerLabels[powerName].plain(slemAnim.sigNumFormatter(impPowerW, 3));
            slemAnim.powerCircles[powerName].labelVal = impPowerW;
        } else if (expPowerW >= 0) {
            slemAnim.powerCircles[powerName].labelVal = expPowerW;
            percPower = expPowerW / expRatedPowerW * 100;
//            slemAnim.powerLabels[powerName].plain(-slemAnim.sigNumFormatter(expPowerW, 3));
        }


        slemAnim.powerCircles[powerName].val = percPower;
    }


};
var orangeGradient = SVG.get('energyMeterMain').gradient('radial', function (stop) {
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
var size = 0.45;
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
function onEnergyMeterClick() {
    let inverterImage = document.getElementById('energyMeterFullscreen');
    let svgContainer = document.querySelector('.svgContainer');
    let svg = document.getElementById('energyMeterMain');
    document.onfullscreenchange = function () {
        if (document.fullscreenElement) {
            svgContainer.style.backgroundColor = '#f7f7f7';
            svgContainer.style.display = 'flex';
            svgContainer.style.flexDirection = 'column';
            svgContainer.style.justifyContent = 'center';
            svg.setAttribute('height', '100vh');
        } else {
            svgContainer.style.backgroundColor = '';
            svgContainer.style.display = '';
            svgContainer.style.flexDirection = '';
            svgContainer.style.justifyContent = '';
            svg.setAttribute('height', '280px');
        }

    }.bind(this);
    inverterImage.addEventListener('click', hh.toggleFullscreen.bind(this, svgContainer));
}

$(document).ready(function () {
    slemAnim.init();
    onEnergyMeterClick();
//    window.dot = new DotAnimComp('energyMeterMain', {
//        dotColor: '#Ff0000',
//        dotGradient: orangeGradient,
//        startX: 60,
//        startY: 60,
//        shape: shapeVer,
//        maxSpeed: 9000,
//        anim: [{x: 21}, {y: -15, hidden: true}, {x: 30, y: 15}],
//        maxLevel: 100
//    }).setLevel(5);
//    var level = 100;
//    for (let i = 0; i < slemAnim.animDots.sumImp.length; i++) {
//
////        slemAnim.animDots.sumExp[i].setMaxLevel(1000);
////        slemAnim.animDots.sumExp[i].setLevel(1);
//    }
//    slemAnim.animDots.sumExp.setMaxLevel(1000);
//    slemAnim.animDots.sumExp.setLevel(1);
//    slemAnim.animDots.gen.setLevel(1);
//    slemAnim.animDots.gridExp.setLevel(level);
//    slemAnim.animDots.gridImp.setLevel(1);
//    slemAnim.animDots.load.setLevel(1);
//    slemAnim.animDots.loadAux.setLevel(1);
//    slemAnim.animDots.batChg.setLevel(1);
//    slemAnim.animDots.batDisch.setLevel(1);
});
