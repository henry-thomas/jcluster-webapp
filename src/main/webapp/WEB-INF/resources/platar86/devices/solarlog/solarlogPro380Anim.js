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

/* global devManager, SVG, hh */

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

        slemAnim.powerCircles.ph1 = createCircleGauge('ph1PowerCircle');
        slemAnim.powerCircles.ph2 = createCircleGauge('ph2PowerCircle');
        slemAnim.powerCircles.ph3 = createCircleGauge('ph3PowerCircle');
        slemAnim.powerCircles.sum = createCircleGauge('sumPowerCircle');

        slemAnim.powerLabels.ph1 = SVG.get('ph1PowerText');
        slemAnim.powerLabels.ph2 = SVG.get('ph2PowerText');
        slemAnim.powerLabels.ph3 = SVG.get('ph3PowerText');
        slemAnim.powerLabels.sum = SVG.get('sumPowerText');

        slemAnim.animDots = {
            ph1Imp: new DotAnimComp('energyMeterMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 22,
                startY: 9,
                shape: shapeVer,
                anim: [{x: 21}, {y: 12.5}, {x: 21}],
                maxLevel: 100
            }),
            ph1Exp: new DotAnimComp('energyMeterMain',{
                        dotColor: '#Ff0000',
                        dotGradient: orangeGradient,
                        startX: 22 + 42,
                        startY: 9 + 12.5,
                        shape: shapeVer,
                        anim: [{x: -21}, {y: -12.5}, {x: -21}],
                        maxLevel: 100
                    }),
            ph2Imp: new DotAnimComp('energyMeterMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 22,
                startY: 33,
                shape: shapeVer,
                anim: [{x: 42}],
                maxLevel: 100
            }, 1),
            ph2Exp: new DotAnimComp('energyMeterMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 22 + 42,
                startY: 33,
                shape: shapeVer,
                anim: [{x: -42}],
                maxLevel: 100
            }, 1),
            ph3Imp: new DotAnimComp('energyMeterMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 22,
                startY: 56.8,
                shape: shapeVer,
                anim: [{x: 21.5}, {y: -12}, {x: 21.5}],
                maxLevel: 100
            }, 1),
            ph3Exp: new DotAnimComp('energyMeterMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 22 + 42,
                startY: 56.8 - 12,
                shape: shapeVer,
                anim: [{x: -20.6}, {y: 12}, {x: -20.6}],
                maxLevel: 100
            }, 1),
            sumImp: [
                new DotAnimComp('energyMeterMain', {
                    dotColor: '#Ff0000',
                    dotGradient: orangeGradient,
                    startX: 125,
                    startY: 21.5,
                    shape: shapeVer,
                    anim: [{x: 20}],
                    maxLevel: 100
                }
                , 1), new DotAnimComp('energyMeterMain', {
                    dotColor: '#Ff0000',
                    dotGradient: orangeGradient,
                    startX: 125,
                    startY: 33.5,
                    shape: shapeVer,
                    anim: [{x: 20}],
                    maxLevel: 100
                }
                , 1), new DotAnimComp('energyMeterMain', {
                    dotColor: '#Ff0000',
                    dotGradient: orangeGradient,
                    startX: 125,
                    startY: 45,
                    shape: shapeVer,
                    anim: [{x: 20}],
                    maxLevel: 100
                }
                , 1)],
            sumExp: [
                new DotAnimComp('energyMeterMain', {
                    dotColor: '#Ff0000',
                    dotGradient: orangeGradient,
                    startX: 145,
                    startY: 21.5,
                    shape: shapeVer,
                    anim: [{x: -20}],
                    maxLevel: 100
                }
                , 1), new DotAnimComp('energyMeterMain', {
                    dotColor: '#Ff0000',
                    dotGradient: orangeGradient,
                    startX: 145,
                    startY: 33.5,
                    shape: shapeVer,
                    anim: [{x: -20}],
                    maxLevel: 100
                }
                , 1), new DotAnimComp('energyMeterMain', {
                    dotColor: '#Ff0000',
                    dotGradient: orangeGradient,
                    startX: 145,
                    startY: 45,
                    shape: shapeVer,
                    anim: [{x: -20}],
                    maxLevel: 100
                }
                , 1)]
        };

        slemAnim.stopAnimation();
        console.log(slemAnim);
    },

    onPowerDataReceived: function (data) {
        if (devManager.getSelected().connected) {

            slemAnim.update('ph1', data.pha1ExportPower, data.pha1ImportPower);
            slemAnim.update('ph2', data.pha2ExportPower, data.pha2ImportPower);
            slemAnim.update('ph3', data.pha3ExportPower, data.pha3ImportPower);
            slemAnim.update('sum', data.sumExportPower, data.sumImportPower);
        } else {
            slemAnim.stopAnimation();
        }
    },
    update: function (powerName, powerExp, powerImp) {
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
        if (powerImp.available) {
            impRatedPowerW = powerImp.ratedPowerW / 1000;
            impPowerW = (powerImp.powerW / 1000).toFixed(2);
        }
        if (powerExp.available) {
            expRatedPowerW = powerExp.ratedPowerW / 1000;
            expPowerW = (powerExp.powerW / 1000).toFixed(2);
        }
        if (impPowerW > 0) {
            percPower = impPowerW / impRatedPowerW * 100;
            slemAnim.powerLabels[powerName].plain(impPowerW);
            if (powerName !== 'sum') {
                slemAnim.animDots[powerName + 'Imp'].setLevel(percPower);
                slemAnim.animDots[powerName + 'Exp'].setLevel(0);
                slemAnim.updateSum(percPower, powerName, 'Imp');
            }


        } else if (expPowerW >= 0) {
            percPower = expPowerW / expRatedPowerW * 100;
            slemAnim.powerLabels[powerName].plain(expPowerW);
            if (powerName !== 'sum') {
                slemAnim.animDots[powerName + 'Exp'].setLevel(percPower);
                slemAnim.animDots[powerName + 'Imp'].setLevel(0);
                slemAnim.updateSum(percPower, powerName, 'Exp');
            }
        }

        slemAnim.powerCircles[powerName].val = percPower;
    },

    updateSum: function (percPower, powerName, dir) {
        if (dir === 'Imp') {
            if (powerName === 'ph1') {
                slemAnim.animDots.sumImp[0].setLevel(percPower);
                slemAnim.animDots.sumExp[0].setLevel(0);
            }
            if (powerName === 'ph2') {
                slemAnim.animDots.sumImp[1].setLevel(percPower);
                slemAnim.animDots.sumExp[1].setLevel(0);
            }
            if (powerName === 'ph3') {
                slemAnim.animDots.sumImp[2].setLevel(percPower);
                slemAnim.animDots.sumExp[2].setLevel(0);
            }
        }
        if (dir === 'Exp') {
            if (powerName === 'ph1') {
                slemAnim.animDots.sumExp[0].setLevel(percPower);
                slemAnim.animDots.sumImp[0].setLevel(0);
            }
            if (powerName === 'ph2') {
                slemAnim.animDots.sumExp[1].setLevel(percPower);
                slemAnim.animDots.sumImp[1].setLevel(0);
            }
            if (powerName === 'ph3') {
                slemAnim.animDots.sumExp[2].setLevel(percPower);
                slemAnim.animDots.sumImp[2].setLevel(0);
            }
        }
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

function createCircleGauge(compId) {
//    var o = data[0];
    var circle = SVG.get(compId);
    circle.value = 0;
    circle.max = 100;
    var radius = circle.node.getAttribute('r');
    var dashArray = 2 * Math.PI * radius;
    var percentTotal = circle.value / circle.maxValue;
    var dashOffset = dashArray - (dashArray * percentTotal);
    var angle = 0;

    circle.node.setAttribute("fill", "transparent");
    circle.node.setAttribute("stroke-dasharray", dashArray);
    circle.node.setAttribute("stroke-dashoffset", dashOffset);
    circle.node.setAttribute("stroke-linecap", "butt");
    circle.node.setAttribute("transform", "rotate(" + (angle) + ")");
    circle.rotate(270);

    Object.defineProperty(circle, 'val', {
        set: function (val) {
            if (isNaN(val)) {
                val = 0;
            }
            if (val < 5) {
                val = 5;
            }
            percentTotal = val / circle.max;
            dashOffset = dashArray - (dashArray * percentTotal);
            circle.animate().attr({
                "stroke-dasharray": dashArray,
                "stroke-dashoffset": dashOffset
            });
            circle.value = val;
        },
        get: function () {
            return circle.value;
        }

    });
    return circle;
}

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
