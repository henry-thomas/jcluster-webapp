/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by brais, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */

/* global SVG, devManager, hh */

devManager.onSelectedDataReceived(function (msg) {
    sgscAnim.onPowerDataReceived(msg[msg.dataName]);
});

devManager.onSelectedStatusChange(function (sDev, status) {
    if (!status) {
        sgscAnim.stopAnimation();
        sgscAnim.initBat();
    }
});

//esManager.onDataReceived(function (data) {
////    sgscAnim.onStorageDataReceived(data);
//});

let sgscAnim = {
    stopAnimation: function () {
        for (let i in sgscAnim.animDots) {
            sgscAnim.animDots[i].setLevel(0);
        }
        for (let group in sgscAnim.powerCircles) {
            sgscAnim.groups[group].style('opacity', 0.1);
            sgscAnim.powerCircles[group].val = 0;
            sgscAnim.powerLabels[group].plain('--.--');
        }
        console.log('Stopping animation');
    },

    init: function () {
        sgscAnim.displayingBatGroup = false;
        sgscAnim.groups = {
            grid: SVG.get('sgscGridGroup'),
            bat: SVG.get('sgscBatGroup')
        };
        sgscAnim.powerCircles = {
            grid: createCircleGauge('sgscGridPowerCircle'),
            bat: createCircleGauge('sgscBatPercentageCircle')
        };
        sgscAnim.powerLabels = {
            grid: SVG.get('sgscIconGridPowerText'),
            bat: SVG.get('sgscIconBatPercentageText')
        };

        sgscAnim.batFills = {};
        for (let i = 1; i <= 9; i++) {
            sgscAnim.batFills['bat' + i] = {};
            sgscAnim.batFills['bat' + i]['fill'] = SVG.get('sgscBat' + i + 'Capacity');
            sgscAnim.batFills['bat' + i]['corY'] = sgscAnim.batFills['bat' + i]['fill'].y();
            sgscAnim.batFills['bat' + i]['height'] = sgscAnim.batFills['bat' + i]['fill'].height();
        }

        sgscAnim.animDots = {
            gridImp: new DotAnimComp('sgscMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 35,
                startY: 26.5,
                shape: shapeHor,
                anim: [{x: 28}],
                maxLevel: 100

            }),
            batChg: new DotAnimComp('sgscMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 130,
                startY: 26.5,
                shape: shapeHor,
                anim: [{x: 28}],
                maxLevel: 100
            }),
            gridExp: new DotAnimComp('sgscMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 35 + 28,
                startY: 26.5,
                shape: shapeHor,
                anim: [{x: -28}],
                maxLevel: 100
            }),
            batDisch: new DotAnimComp('sgscMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 130 + 28,
                startY: 26.5,
                shape: shapeHor,
                anim: [{x: -28}],
                maxLevel: 100
            })
        };
        sgscAnim.stopAnimation();
//        sgscAnim.initBat();
    },

    onPowerDataReceived: function (data) {
        if (devManager.getSelected().connected) {
            sgscAnim.updateGrid(data);
            return;
        }
        sgscAnim.stopAnimation();
    },

    updateGrid: function (data) {
//        data.chargePower.powerW = 100000;
//        data.dischargePower.powerW = 500;
//        if (data.dischargePower.powerW > 0) {
//            data.dcPower = data.dischargePower.powerW;
//        }
        let percGridPower = 0;
        let gridImpRated = 0;
        let gridImpPowerW = 0;
        let gridExpRated = 0;
        let gridExpPowerW = 0;
        if (data.chargePower.available || data.dischargePower.available) {
            sgscAnim.groups.grid.style('opacity', 1);
            sgscAnim.groups.bat.style('opacity', 1);
            sgscAnim.displayingBatGroup = true;
        } else {
            sgscAnim.groups.grid.style('opacity', 0.1);
            sgscAnim.groups.bat.style('opacity', 0.1);
            sgscAnim.displayingBatGroup = false;
        }
        // For Sungrow 'on Charging State' means power values are negative
        // Totally oposite to the regular approach (Positive values means Battery Charging)
        if (data.chargePower.powerW > 0 && data.chargePower.available) {
            gridImpRated = data.chargePower.ratedPowerW / 1000;
            gridImpPowerW = (data.chargePower.powerW).toFixed(2) / 1000;
        }
        if (data.dischargePower.powerW >= 0 && data.dischargePower.available) {
            gridExpRated = data.dischargePower.ratedPowerW / 1000;
            gridExpPowerW = (data.dischargePower.powerW).toFixed(2) / 1000;
        }
        if (gridImpPowerW > 0) {
            percGridPower = gridImpPowerW / gridImpRated * 100;
            sgscAnim.powerLabels.grid.plain(gridImpPowerW);
            sgscAnim.animDots.gridImp.setLevel(percGridPower);
            sgscAnim.animDots.batChg.setLevel(percGridPower);
            sgscAnim.animDots.gridExp.setLevel(0);
            sgscAnim.animDots.batDisch.setLevel(0);
        } else if (gridExpPowerW >= 0) {
            percGridPower = gridExpPowerW / gridExpRated * 100;
            sgscAnim.powerLabels.grid.plain(gridExpPowerW);
            sgscAnim.animDots.gridExp.setLevel(percGridPower);
            sgscAnim.animDots.batDisch.setLevel(percGridPower);
            sgscAnim.animDots.gridImp.setLevel(0);
            sgscAnim.animDots.batChg.setLevel(0);
        }

        sgscAnim.powerCircles.grid.val = percGridPower;
    },

//    onStorageDataReceived: function (data) {
//        if (devManager.getSelected().connected || (data && data.length)) {
//            sgscAnim.updateBat(data);
//            return;
//        }
//        sgscAnim.initBat();
//    },

//    updateBat: function (data) {
//        if (!data) {
//            if (!sgscAnim.displayingBatGroup) {
//                sgscAnim.groups.bat.style('opacity', 0.1);
//            }
//            sgscAnim.initBat();
//            return;
//        }
//        sgscAnim.groups.bat.style('opacity', 1);
//
//        let cont = 0;
//        let capacityP = 0;
//        for (let i in data) {
//            capacityP += data[i].capacityP;
//            cont++;
//        }
//        if (cont > 0)
//            capacityP /= cont;
//
//        if (capacityP > 100) {
//            capacityP = 100;
//        }
//
//        sgscAnim.powerLabels.bat.plain(capacityP.toFixed(1));
//        sgscAnim.powerCircles.bat.val = capacityP;
////        sgscAnim.setBatLevels(capacityP);
//        sgscAnim.setBatLevelsBySteps(capacityP);
//    },

//    initBat: function () {
//        sgscAnim.powerLabels.bat.plain('--.--');
//        sgscAnim.powerCircles.bat.val = 0;
//        sgscAnim.setBatLevels(0);
//    },
//
//    setBatLevelsBySteps: function (per, nBats) {
//        nBats = nBats || 9; // We are displaying 9 batteries
//        let steps = (per / 100) * nBats;
//        let step = 1;
//        while (step < steps) {
//            sgscAnim.setBatLevel(sgscAnim.batFills['bat' + step], 100);
//            step++;
//        }
//        if (step <= nBats) {
//            sgscAnim.setBatLevel(sgscAnim.batFills['bat' + step], (steps - step + 1) * 100);
//            step++;
//        }
//        while (step <= nBats) {
//            sgscAnim.setBatLevel(sgscAnim.batFills['bat' + step], 1);
//            step++;
//        }
//    },
//    setBatLevels: function (per) {
//        let cont = 0;
//        while (cont < 9) {
//            cont++;
//            sgscAnim.setBatLevel(sgscAnim.batFills['bat' + cont], per);
//        }
//    },
//
//    setBatLevel: function (bat, per) {
//        if (!bat || !bat.fill || isNaN(bat.corY) || isNaN(per)) {
//            return;
//        }
//        if (per < 1) {
//            per = 1;
//            bat.fill.opacity(0);
//        } else {
//            bat.fill.opacity(1);
//        }
//        if (per > 100) {
//            per = 100;
//        }
//
//        let h = bat.height * (per / 100);
//        bat.fill.y(bat.corY + bat.height - h);
//        bat.fill.height(h);
//    }
};

var orangeGradient = SVG.get('sgscMain').gradient('radial', function (stop) {
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
var size = 0.25;
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
    let circle = SVG.get(compId);
    circle.value = 0;
    circle.max = 100;
    let radius = circle.node.getAttribute('r');
    let dashArray = 2 * Math.PI * radius;
    let percentTotal = circle.value / circle.maxValue;
    let dashOffset = dashArray - (dashArray * percentTotal);
    let angle = 0;

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

function onInverterClick() {
    let inverterImage = document.getElementById('sgscInverter');
    let svgContainer = document.querySelector('.svgContainer');
    let svg = document.getElementById('sgscMain');
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

sgscAnim.start = function ([charger, inverter]) {
//    console.log(charger);
//    console.log(inverter);
}

$(document).ready(function () {
    sgscAnim.init();
    dm.onAllDataReceived(sgscAnim.start);
    onInverterClick();
});