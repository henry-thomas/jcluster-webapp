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

/* global devManager, SVG */

devManager.onSelectedDataReceived(function (msg) {
    ssgtAnim.onPowerDataReceived(msg[msg.dataName]);
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
        ssgtAnim.stopAnimation();
    }
});


$(document).ready(function () {
    ssgtAnim.init();
    var level = 100;
//    ssgtAnim.animDots.pv.setMaxLevel(100);
//    ssgtAnim.animDots.pv.setLevel(level);
//    ssgtAnim.animDots.gen.setLevel(1);
//    ssgtAnim.animDots.gridExp.setLevel(level);
//    ssgtAnim.animDots.gridImp.setLevel(1);
//    ssgtAnim.animDots.load.setLevel(1);
//    ssgtAnim.animDots.loadAux.setLevel(1);
//    ssgtAnim.animDots.batChg.setLevel(1);
//    ssgtAnim.animDots.batDisch.setLevel(1);
});

let ssgtAnim = {
    groups: {
        pv: document.getElementById('ssgtIconPvPowerGroup'),
        gen: document.getElementById('ssgtIconGenPowerGroup'),
        grid: document.getElementById('ssgtIconGridPowerGroup'),
        load: document.getElementById('ssgtIconLoadPowerGroup'),
        loadAux: document.getElementById('ssgtIconAuxLoadPowerGroup'),
        bat: document.getElementById('ssgtIconBatPowerGroup')
    },

    powerCircles: {
        pv: document.getElementById('pvPowerCircle'),
        gen: document.getElementById('genPowerCircle'),
        grid: document.getElementById('gridPowerCircle'),
        load: document.getElementById('loadPowerCircle'),
        loadAux: document.getElementById('loadAuxPowerCircle'),
        bat: document.getElementById('batPowerCircle')
    },

    powerLabels: {
        pv: SVG.get('ssgtIconPvPowerText'),
        gen: SVG.get('ssgtIconGenPowerText'),
        grid: SVG.get('ssgtIconGridPowerText'),
        load: SVG.get('ssgtIconLoadPowerText'),
        loadAux: SVG.get('ssgtIconLoadAuxPowerText'),
        bat: SVG.get('ssgtIconBatPowerText')
    },

    powerGroupObj: {},

    animDots: {},

    stopAnimation: function () {
        for (let i in ssgtAnim.animDots) {
            ssgtAnim.animDots[i].setLevel(0);
        }
        for (let group in ssgtAnim.powerCircles) {
            ssgtAnim.groups[group].style('opacity', 0.1);
            ssgtAnim.powerCircles[group].val = 0;
            ssgtAnim.powerLabels[group].plain('--.--');
        }
        console.log('here');
    },

    init: function () {
        ssgtAnim.groups.pv = SVG.get('ssgtIconPvPowerGroup');
        ssgtAnim.groups.gen = SVG.get('ssgtIconGenPowerGroup');
        ssgtAnim.groups.grid = SVG.get('ssgtIconGridPowerGroup');
        ssgtAnim.groups.load = SVG.get('ssgtIconLoadPowerGroup');
        ssgtAnim.groups.loadAux = SVG.get('ssgtIconAuxLoadPowerGroup');
        ssgtAnim.groups.bat = SVG.get('ssgtIconBatPowerGroup');

        ssgtAnim.powerCircles.pv = createCircleGauge('pvPowerCircle');
        ssgtAnim.powerCircles.gen = createCircleGauge('genPowerCircle');
        ssgtAnim.powerCircles.grid = createCircleGauge('gridPowerCircle');
        ssgtAnim.powerCircles.load = createCircleGauge('loadPowerCircle');
        ssgtAnim.powerCircles.loadAux = createCircleGauge('loadAuxPowerCircle');
        ssgtAnim.powerCircles.bat = createCircleGauge('batPowerCircle');

        ssgtAnim.powerLabels.pv = SVG.get('ssgtIconPvPowerText');
        ssgtAnim.powerLabels.gen = SVG.get('ssgtIconGenPowerText');
        ssgtAnim.powerLabels.grid = SVG.get('ssgtIconGridPowerText');
        ssgtAnim.powerLabels.load = SVG.get('ssgtIconLoadPowerText');
        ssgtAnim.powerLabels.loadAux = SVG.get('ssgtIconAuxLoadPowerText');
        ssgtAnim.powerLabels.bat = SVG.get('ssgtIconBatPowerText');

        ssgtAnim.animDots = {
            pv: new DotAnimComp('ssgtMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 54,
                startY: 13,
                shape: shapeVer,
                anim: [{x: 19}, {y: 7}, {x: 19}],
                maxLevel: 100
            }),
            gen: new DotAnimComp('ssgtMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 54,
                startY: 37,
                shape: shapeVer,
                anim: [{x: 38}],
                maxLevel: 100
            }),
            gridImp: new DotAnimComp("ssgtMain", {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 54.2,
                startY: 63,
                shape: shapeVer,
                anim: [{x: 19}, {y: -7}, {x: 19}],
                maxLevel: 100
            }),
            gridExp: new DotAnimComp('ssgtMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 54.2 + 38,
                startY: 57,
                shape: shapeVer,
                anim: [{x: -19}, {y: 7}, {x: -19}],
                maxLevel: 100
            }),
            load: new DotAnimComp('ssgtMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 180 - 38,
                startY: 20,
                shape: shapeVer,
                anim: [{x: 19}, {y: -7}, {x: 19}],
                maxLevel: 100
            }, 1),
            loadAux: new DotAnimComp('ssgtMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 180 - 38,
                startY: 37,
                shape: shapeVer,
                anim: [{x: 38}],
                maxLevel: 100
            }),
            batDisch: new DotAnimComp('ssgtMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 180.2,
                startY: 62.5,
                shape: shapeVer,
                anim: [{x: -19}, {y: -6.2}, {x: -19}],
                maxLevel: 100
            }),
            batChg: new DotAnimComp('ssgtMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 180.2 - 38,
                startY: 62.5 - 6,
                shape: shapeVer,
                anim: [{x: 19}, {y: 6.2}, {x: 19}],
                maxLevel: 100
            }, 1)
        };

        ssgtAnim.stopAnimation();
        console.log(ssgtAnim);
    },

    onPowerDataReceived: function (data) {
        if (devManager.getSelected().connected) {
            ssgtAnim.updateBat(data);
            ssgtAnim.updateLoad(data);
            ssgtAnim.updateAuxLoad(data);
            ssgtAnim.updateGen(data);
            ssgtAnim.updatePv(data);
            ssgtAnim.updateGrid(data);
        } else {
            ssgtAnim.stopAnimation();
//            ssgtAnim.animDots.batDisch.setLevel(0);
//            ssgtAnim.animDots.Chg.setLevel(0);
//            ssgtAnim.powerCircles.bat.val = 0;

        }
    },
    updateBat: function (data) {

        let percBatPower = 0;
        let batDischgRated = 0;
        let batDischgPowerW = 0;
        let batChgRated = 0;
        let batChgPowerW = 0;
        if (data.batDischg.available || data.batChg.available) {
            ssgtAnim.groups.bat.style('opacity', 1);
        } else {
            ssgtAnim.groups.bat.style('opacity', 0.1);

        }
        if (data.batDischg.available) {
            batDischgRated = data.batDischg.ratedPowerW / 1000;
            batDischgPowerW = (data.batDischg.powerW / 1000).toFixed(2);
        }
        if (data.batChg.available) {
            batChgRated = data.batChg.ratedPowerW / 1000;
            batChgPowerW = (data.batChg.powerW / 1000).toFixed(2);
        }
        if (batDischgPowerW > 0) {
            percBatPower = batDischgPowerW / batDischgRated * 100;
            ssgtAnim.powerLabels.bat.plain(batDischgPowerW);
            ssgtAnim.animDots.batDisch.setLevel(percBatPower);
            ssgtAnim.animDots.batChg.setLevel(0);
        } else if (batChgPowerW >= 0) {
            percBatPower = batChgPowerW / batChgRated * 100;
            ssgtAnim.powerLabels.bat.plain(batChgPowerW);
            ssgtAnim.animDots.batChg.setLevel(percBatPower);
            ssgtAnim.animDots.batDisch.setLevel(0);
        }

        ssgtAnim.powerCircles.bat.val = percBatPower;
//        ssgtAnim.animTimeout();
    },

    updateLoad: function ( {loadExp}) {
        let loadPowerW = 0;
        let loadRatedPowerW = 0;
        let loadPercentage;
        if (loadExp.available) {
            ssgtAnim.groups.load.style('opacity', 1);
            loadPowerW = loadExp.powerW;
            loadRatedPowerW = loadExp.ratedPowerW;
            if (loadPowerW <= 0) {
                loadPercentage = 0;
            } else {
                loadPercentage = loadPowerW / loadRatedPowerW * 100;
            }
            ssgtAnim.powerCircles.load.val = loadPercentage;
            ssgtAnim.animDots.load.setLevel(loadPercentage);
            ssgtAnim.powerLabels.load.plain((loadPowerW / 1000).toFixed(2));
        } else {
            ssgtAnim.animDots.load.setLevel(0);
            ssgtAnim.powerLabels.load.plain('--.--');
            ssgtAnim.groups.load.style('opacity', 0.1);
    }
    },

    updateAuxLoad: function ( {auxLoad}){
        let auxLoadPowerW = 0;
        let auxLoadRatedPowerW = 0;
        let auxLoadPercentage;
        if (auxLoad.available) {
            ssgtAnim.groups.loadAux.style('opacity', 1);
            auxLoadPowerW = auxLoad.powerW;
            auxLoadRatedPowerW = auxLoad.ratedPowerW;
            if (auxLoadPowerW <= 0) {
                auxLoadPercentage = 0;
            } else {
                auxLoadPercentage = auxLoadPowerW / auxLoadRatedPowerW * 100;
            }
            ssgtAnim.powerCircles.loadAux.val = auxLoadPercentage;
            ssgtAnim.animDots.loadAux.setLevel(auxLoadPercentage);
            ssgtAnim.powerLabels.loadAux.plain((auxLoadPowerW / 1000).toFixed(2));
        } else {
            ssgtAnim.animDots.loadAux.setLevel(0);
            ssgtAnim.powerLabels.loadAux.plain('--.--');
            ssgtAnim.groups.loadAux.style('opacity', 0.1);
    }
    },

    updateGen: function ( {gen}){
        let genPowerW = 0;
        let genRatedPowerW = 0;
        let genPercentage;
        if (gen.powerW >0) {
            ssgtAnim.groups.gen.style('opacity', 1);
            genPowerW = gen.powerW;
            genRatedPowerW = gen.ratedPowerW;
            if (genPowerW <= 0) {
                genPercentage = 0;
            } else {
                genPercentage = genPowerW / genRatedPowerW * 100;
            }
            ssgtAnim.powerCircles.gen.val = genPercentage;
            ssgtAnim.animDots.gen.setLevel(genPercentage);
            ssgtAnim.powerLabels.gen.plain((genPowerW / 1000).toFixed(2));
        } else {
            ssgtAnim.animDots.gen.setLevel(0);
            ssgtAnim.powerLabels.gen.plain('--.--');
            ssgtAnim.groups.gen.style('opacity', 0.1);
    }
    },
    updatePv: function ( {pv1, pv2}){
        let pvPowerW = 0;
        let pvRatedPowerW = 0;
        let pvPercentage;
        if (pv1.available || pv2.available) {
            ssgtAnim.groups.pv.style('opacity', 1);
            if (pv1.available) {
                pvPowerW = pv1.powerW;
                pvRatedPowerW = pv1.ratedPowerW;
            }
            if (pv2.available) {
                pvPowerW = pv2.powerW;
                pvRatedPowerW = pv2.ratedPowerW;
            }
            if (pv1.available && pv2.available) {
                pvPowerW = pv1.powerW + pv2.powerW;
                pvRatedPowerW = pv1.ratedPowerW + pv2.ratedPowerW; //Should this be added together?
            }
            if (pvPowerW <= 0) {
                pvPercentage = 0;
            } else {
                pvPercentage = pvPowerW / pvRatedPowerW * 100;
            }
            ssgtAnim.powerCircles.pv.val = pvPercentage;
            ssgtAnim.animDots.pv.setLevel(pvPercentage);
            ssgtAnim.powerLabels.pv.plain((pvPowerW / 1000).toFixed(2));
        } else {
            ssgtAnim.animDots.pv.setLevel(0);
            ssgtAnim.powerLabels.pv.plain('--.--');
            ssgtAnim.groups.pv.style('opacity', 0.1);
    }

    },
    updateGrid: function (data) {

        let percGridPower = 0;
        let gridImpRated = 0;
        let gridImpPowerW = 0;
        let gridExpRated = 0;
        let gridExpPowerW = 0;
        if (data.gridImp.available || data.gridExp.available) {
            ssgtAnim.groups.grid.style('opacity', 1);
        } else {
            ssgtAnim.groups.grid.style('opacity', 0.1);

        }
        if (data.gridImp.available) {
            gridImpRated = data.gridImp.ratedPowerW / 1000;
            gridImpPowerW = (data.gridImp.powerW / 1000).toFixed(2);
        }
        if (data.gridExp.available) {
            gridExpRated = data.gridExp.ratedPowerW / 1000;
            gridExpPowerW = (data.gridExp.powerW / 1000).toFixed(2);
        }
        if (gridImpPowerW > 0) {
            percGridPower = gridImpPowerW / gridImpRated * 100;
            ssgtAnim.powerLabels.grid.plain(gridImpPowerW);
            ssgtAnim.animDots.gridImp.setLevel(percGridPower);
            ssgtAnim.animDots.gridExp.setLevel(0);
        } else if (gridExpPowerW >= 0) {
            percGridPower = gridExpPowerW / gridExpRated * 100;
            ssgtAnim.powerLabels.grid.plain(gridExpPowerW);
            ssgtAnim.animDots.gridExp.setLevel(percGridPower);
            ssgtAnim.animDots.gridImp.setLevel(0);
        }

        ssgtAnim.powerCircles.grid.val = percGridPower;
//        ssgtAnim.animTimeout();
    },

};

var orangeGradient = SVG.get('ssgtMain').gradient('radial', function (stop) {
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

