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
/* global SVG */

var a = SVG.get('svg2').get(1).get(1);
var aWires = SVG.get('wires');
var comp = {};
comp.invR = a.get(13);
comp.bypass = a.get(11);
comp.invL = a.get(9);
comp.grid = a.get(7);
comp.bat = a.get(5);
comp.pv = a.get(3);
comp.load = a.get(1).get(1);
comp.wire = {
    gridToInvL: SVG.get('wire1'),
    invLtoInvR: SVG.get('wire2'),
    invLtoBat: SVG.get('wire3'),
    batToInvR: SVG.get('wire4'),
    bypas: SVG.get('wire5'),
    pvToInvL: SVG.get('wire6'),
    invRtoLoad: SVG.get('wire7')
};
//       var s = a.polygon('50,0 60,40 100,50 60,60 50,100 40,60 0,50 40,40 50,0').;

var axpIcon = {
    grid: {
        color: '#FA0F00',
        arr: [],
        timerMap: [],
        enableBypass: false,
        enableCharge: false,
        powerBypass: 0,
        powerBypassMax: 6000,
        powerCharge: 0,
        powerChargeMax: 3500
    },
    pv: {
        color: '#0fFa00',
        arr: [],
        timerMap: [],
        enablePv: false,
        enableBat: false,
        enablePvCharge: false,
        enableLoad: false,
        powerPv: 0,
        powerPvMax: 4000,
        powerLoad: 0,
        powerLoadMax: 4000,
        powerBat: 0,
        powerBatMax: 4500
    },

    bat: {
        color: '#ff9900',
        arr: [],
        timerMap: [],
        enableBatDisch: false,
        powerBatDisch: 0,
        powerBatDischMax: 5000
    },

    arrRed: [],
    arrGreen: [],
    arrOrange: [],
    counter: 0,

    createDot: function (color) {
        axpIcon.counter++;
        var dot = a.circle(10).opacity(0);
        dot.gradint = a.gradient('radial', function (stop) {
            stop.at({
                offset: 0,
                color: color,
                opacity: 1
            });
            stop.at({
                offset: 1,
                color: '#FFFFFF',
                opacity: 0
            });
        });
        dot.style({'fill': dot.gradint});
        dot.remember({
            x: dot.x(),
            y: dot.y()
        });
        return dot;
    },
    getDot: function (data, timerID) {
        if (timerID !== undefined) {
            var arrIdx = data.timerMap.indexOf(timerID);
            data.timerMap.splice(arrIdx, 1);
//            if (ob.timerMap[t])
//            console.log('Timer ID: ' + timerID);
        }

        if (!document.hidden) {
            var dot = data.dot;
            var arr = data.arr;

            if (arr.length > 500) {
                console.log('array for collor: ' + data.color + ' cleaning the container!');
                arr = [];
            }
            if (arr.length > 0) {
                for (var i = 0; i < arr.length; i++) {
                    if (!arr[i].active) {
                        arr[i].active = true;
                        dot = arr[i];
                        break;
                    }
                }
            }

            if (dot === undefined) {
                dot = axpIcon.createDot(data.color);
//                console.log('creating new dot: ' + data.color);
                dot.active = true;
                arr.push(dot);
            }
            return dot;
        } else {
            axpIcon.resetAnimation();
        }
    },
    startNextBypassDot: function (timerID) {

        var dot = axpIcon.getDot(axpIcon.grid, timerID);
        if (dot !== undefined) {
            var dim = axpIcon.getDotDimm(axpIcon.grid.powerBypassMax, axpIcon.grid.powerBypass);
            dot.opacity(1).radius(dim.size).center(190, 300)
                    .animate(dim.speed * 35).dx(35)
                    .animate(dim.speed * 85).dy(-85)
                    .animate(dim.speed * 595).dx(595)
                    .animate(dim.speed * 85).dy(85)
                    .animate(dim.speed * 110).dx(110)
                    .after(function (situation) {
                        this.active = false;
                        this.opacity(0);
                    });
            if (axpIcon.grid.enableBypass) {
                var timerID = setTimeout(function () {
                    axpIcon.startNextBypassDot(timerID);
                }, dim.delay);
                axpIcon.grid.timerMap.push(timerID);
            }
        }
    },
    startNextGridInvLDot: function (timerID) {
        var dot = axpIcon.getDot(axpIcon.grid, timerID);
        if (dot !== undefined) {
            var dim = axpIcon.getDotDimm(axpIcon.grid.powerChargeMax, axpIcon.grid.powerCharge);
            dot.opacity(1).radius(dim.size).center(190, 323)
                    .animate(dim.speed * 75).dx(75)
                    .after(function (situation) {
                        this.active = false;
                        this.opacity(0);
                    });

            if (axpIcon.grid.enableCharge) {
                var timerID = setTimeout(function () {
                    axpIcon.startNextGridInvLDot(timerID);
                }, dim.delay);
                axpIcon.grid.timerMap.push(timerID);
            }
        }
    },
    startNextInvLBatDot: function (timerID) {
        var dot = axpIcon.getDot(axpIcon.grid, timerID);
        if (dot !== undefined) {
            var dim = axpIcon.getDotDimm(axpIcon.grid.powerChargeMax, axpIcon.grid.powerCharge);
            dot.opacity(1).radius(dim.size).center(440, 325)
                    .animate(dim.speed * 50).dx(50)
                    .animate(dim.speed * 90).dy(90)
                    .after(function (situation) {
                        this.active = false;
                        this.opacity(0);
                    });

            if (axpIcon.grid.enableCharge) {
                var timerID = setTimeout(function () {
                    axpIcon.startNextInvLBatDot(timerID);
                }, dim.delay);
                axpIcon.grid.timerMap.push(timerID);
            }
        }
    },
    startNextPvInvLDot: function (timerID) {
        var dot = axpIcon.getDot(axpIcon.pv, timerID);
        if (dot !== undefined) {
            var dim = axpIcon.getDotDimm(axpIcon.pv.powerPvMax, axpIcon.pv.powerPv);
            dot.opacity(1).radius(dim.size).center(175, 518)
                    .animate(dim.speed * 177).dx(177)
                    .animate(dim.speed * 135).dy(-135)
                    .after(function (situation) {
                        this.active = false;
                        this.opacity(0);
                    });

            if (axpIcon.pv.enablePv) {

                var timerID = setTimeout(function () {
                    axpIcon.startNextPvInvLDot(timerID);
                }, dim.delay);
                axpIcon.pv.timerMap.push(timerID);
            }
        }
    },
    startNextInvLInvRDot: function (timerID) {
        var dot = axpIcon.getDot(axpIcon.pv, timerID);
        if (dot !== undefined) {
            var dim = axpIcon.getDotDimm(axpIcon.pv.powerLoadMax, axpIcon.pv.powerLoad);
            dot.opacity(1).radius(dim.size).center(434, 298)
                    .animate(dim.speed * 155).dx(155)
                    .after(function (situation) {
                        this.active = false;
                        this.opacity(0);
                    });

            if (axpIcon.pv.enableLoad) {
                var timerID = setTimeout(function () {
                    axpIcon.startNextInvLInvRDot(timerID);
                }, dim.delay);
                axpIcon.pv.timerMap.push(timerID);
            }
        }
    },
    startNextInvLBatGreenDot: function (timerID) {
        var dot = axpIcon.getDot(axpIcon.pv, timerID);
        if (dot !== undefined) {
            var dim = axpIcon.getDotDimm(axpIcon.pv.powerBatMax, axpIcon.pv.powerBat);
            dot.opacity(1).radius(dim.size).center(440, 325)
                    .animate(dim.speed * 50).dx(50)
                    .animate(dim.speed * 90).dy(90)
                    .after(function (situation) {
                        this.active = false;
                        this.opacity(0);
                    });

            if (axpIcon.pv.enablePvCharge) {
                var timerID = setTimeout(function () {
                    axpIcon.startNextInvLBatGreenDot(timerID);
                }, dim.delay);
                axpIcon.pv.timerMap.push(timerID);
            }
        }
    },
    startNextBatInvRDot: function (timerID) {
        var dot = axpIcon.getDot(axpIcon.bat, timerID);
        if (dot !== undefined) {
            var dim = axpIcon.getDotDimm(axpIcon.bat.powerBatDischMax, axpIcon.bat.powerBatDisch);
            dot.opacity(1).radius(dim.size).center(528, 415)
                    .animate(dim.speed * 90).dy(-90)
                    .animate(dim.speed * 60).dx(60)
                    .after(function (situation) {
                        this.active = false;
                        this.opacity(0);
                    });

            if (axpIcon.bat.enableBatDisch) {
                var timerID = setTimeout(function () {
                    axpIcon.startNextBatInvRDot(timerID);
                }, dim.delay);
                var length = axpIcon.bat.timerMap.push(timerID);
//                console.log('new timer array length is: ' + length);
            }
        }
    },
    startNextInvRLoadOrangeDot: function (timerID) {
        var dot = axpIcon.getDot(axpIcon.bat, timerID);
        if (dot !== undefined) {

            var dim = axpIcon.getDotDimm(axpIcon.bat.powerBatDischMax, axpIcon.bat.powerBatDisch);
            dot.opacity(1).radius(dim.size).center(768, 328)
                    .animate(dim.speed * 160).dx(160)
                    .after(function (situation) {
                        this.active = false;
                        this.opacity(0);
                    });

            if (axpIcon.bat.enableBatDisch) {
                var timerID = setTimeout(function () {
                    axpIcon.startNextInvRLoadOrangeDot(timerID);
                }, dim.delay);
                axpIcon.bat.timerMap.push(timerID);
            }
        }
    },
    startNextInvRLoadDot: function (timerID) {
        var dot = axpIcon.getDot(axpIcon.pv, timerID);
        if (dot !== undefined) {

        }
        var dim = axpIcon.getDotDimm(axpIcon.pv.powerLoadMax, axpIcon.pv.powerLoad);
        dot.opacity(1).radius(dim.size).center(768, 328)
                .animate(dim.speed * 160).dx(160)
                .after(function (situation) {
                    this.active = false;
                    this.opacity(0);
                });
        if (axpIcon.pv.enableLoad) {
            var timerID = setTimeout(function () {
                axpIcon.startNextInvRLoadDot(timerID);
            }, dim.delay);
            axpIcon.pv.timerMap.push(timerID);
        }
    },
    getDotDimm: function (max, value) {
        var powerRatio = 1;
        if (value !== 0) {
            var powerRatio = (value / max) * 100;
        }
        var dim = {
            speed: (2500 - (powerRatio * 20)) / 500,
            delay: 700 - (powerRatio * 7),
            size: 20 + (powerRatio / 2)
        };
        return dim;
    },
    setBypassPower: function (power) {
        if (power !== undefined && !isNaN(power)) {
            var oldEnable = axpIcon.grid.enableBypass;
            if (power > 0) {
                if (power > axpIcon.grid.powerBypassMax) {
                    axpIcon.grid.powerBypass = axpIcon.grid.powerBypassMax;
                } else {
                    axpIcon.grid.powerBypass = power;
                }
                if (!axpIcon.grid.enableBypass) {
                    axpIcon.grid.enableBypass = true;
                    axpIcon.startNextBypassDot();
                }
            }
            if (!oldEnable && power > 0) {
                axpIcon.grid.enableBypass = true;
//                axp.showCom(comp.grid, true, 'powerBypass');
                axpIcon.showCom(comp.load, true, 'powerBypass');
                axpIcon.showCom(comp.bypass, true, 'powerBypass');
                axpIcon.showCom(comp.wire.bypas, true, 'powerBypass');
            } else if (oldEnable && power === 0) {
                axpIcon.grid.enableBypass = false;
//                axp.showCom(comp.grid, false, 'powerBypass');
                axpIcon.showCom(comp.load, false, 'powerBypass');
                axpIcon.showCom(comp.bypass, false, 'powerBypass');
                axpIcon.showCom(comp.wire.bypas, false, 'powerBypass');
            }
        }
    },
    setGridCharhingPower: function (power) {
        if (power !== undefined && !isNaN(power)) {
            var oldEnable = axpIcon.grid.enableCharge;
            if (power > 0) {
                if (power > axpIcon.grid.powerChargeMax) {
                    axpIcon.grid.powerCharge = axpIcon.grid.powerChargeMax;
                } else {
                    axpIcon.grid.powerCharge = power;
                }
                if (!axpIcon.grid.enableCharge) {
                    axpIcon.grid.enableCharge = true;
                    axpIcon.startNextGridInvLDot();
                    axpIcon.startNextInvLBatDot();
                }
            }
            if (!oldEnable && power > 0) {
                axpIcon.grid.enableCharge = true;
//                axp.showCom(comp.grid, true, 'gridPowerCharge');
                axpIcon.showCom(comp.invL, true, 'gridPowerCharge');
                axpIcon.showCom(comp.wire.gridToInvL, true, 'gridPowerCharge');
                axpIcon.showCom(comp.wire.invLtoBat, true, 'gridPowerCharge');
            } else if (oldEnable && power === 0) {
                axpIcon.grid.enableCharge = false;
//                axp.showCom(comp.grid, false, 'gridPowerCharge');
                axpIcon.showCom(comp.invL, false, 'gridPowerCharge');
                axpIcon.showCom(comp.wire.gridToInvL, false, 'gridPowerCharge');
                axpIcon.showCom(comp.wire.invLtoBat, false, 'gridPowerCharge');
            }
        }
    },
    setPvPower: function (power) {
        if (power !== undefined && !isNaN(power)) {
            var oldEnable = axpIcon.pv.enablePv;
            if (power > 0) {
                if (power > axpIcon.pv.powerPvMax) {
                    axpIcon.pv.powerCharge = axpIcon.pv.powerChargeMax;
                } else {
                    axpIcon.pv.powerPv = power;
                }
                if (!axpIcon.pv.enablePv) {
                    axpIcon.pv.enablePv = true;
                    axpIcon.startNextPvInvLDot();
                }
            }

            if (!oldEnable && power > 0) {
                axpIcon.pv.enablePv = true;
                axpIcon.showCom(comp.pv, true, 'powerPv');
                axpIcon.showCom(comp.invL, true, 'powerPv');
                axpIcon.showCom(comp.wire.pvToInvL, true, 'powerPv');
            } else if (oldEnable && power === 0) {
                axpIcon.pv.enablePv = false;
                axpIcon.showCom(comp.invL, false, 'powerPv');
                axpIcon.showCom(comp.pv, false, 'powerPv');
                axpIcon.showCom(comp.wire.pvToInvL, false, 'powerPv');
            }
        }
    },
    setPvLoadPower: function (power) {
        if (power !== undefined && !isNaN(power)) {
            var oldEnable = axpIcon.pv.enableLoad;
            if (power > 0) {
                if (power > axpIcon.pv.powerLoadMax) {
                    axpIcon.pv.powerLoad = axpIcon.pv.powerLoadMax;
                } else {
                    axpIcon.pv.powerLoad = power;
                }
                if (!axpIcon.pv.enableLoad) {
                    axpIcon.pv.enableLoad = true;
                    axpIcon.startNextInvLInvRDot();
                    axpIcon.startNextInvRLoadDot();
                }
            }
            var instIdx = 'powerPvLoad';
            if (!oldEnable && power > 0) {
                axpIcon.pv.enableLoad = true;
                axpIcon.showCom(comp.invL, true, instIdx);
                axpIcon.showCom(comp.invR, true, instIdx);
                axpIcon.showCom(comp.load, true, instIdx);
                axpIcon.showCom(comp.wire.invLtoInvR, true, instIdx);
                axpIcon.showCom(comp.wire.invRtoLoad, true, instIdx);
            } else if (oldEnable && power === 0) {
                axpIcon.pv.enableLoad = false;
                axpIcon.showCom(comp.invL, false, instIdx);
                axpIcon.showCom(comp.invR, false, instIdx);
                axpIcon.showCom(comp.load, false, instIdx);
                axpIcon.showCom(comp.wire.invLtoInvR, false, instIdx);
                axpIcon.showCom(comp.wire.invRtoLoad, false, instIdx);
            }
        }
    },
    setPvChargingPower: function (power) {
        if (power !== undefined && !isNaN(power)) {
            var oldEnable = axpIcon.pv.enablePvCharge;
            if (power > 0) {
                if (power > axpIcon.pv.powerChargeMax) {
                    axpIcon.pv.powerBat = axpIcon.pv.powerBatMax;
                } else {
                    axpIcon.pv.powerBat = power;
                }
                if (!axpIcon.pv.enablePvCharge) {
                    axpIcon.pv.enablePvCharge = true;
                    axpIcon.startNextInvLBatGreenDot();
                }
            }
            var instIdx = 'powerPvCharge';
            if (!oldEnable && power > 0) {
                axpIcon.pv.enablePvCharge = true;
                axpIcon.showCom(comp.invL, true, instIdx);
                axpIcon.showCom(comp.wire.invLtoBat, true, instIdx);
            } else if (oldEnable && power === 0) {
                axpIcon.pv.enablePvCharge = false;
                axpIcon.showCom(comp.invL, false, instIdx);
                axpIcon.showCom(comp.wire.invLtoBat, false, instIdx);
            }
        }
    },
    setBatDischPower: function (power) {
        if (power !== undefined && !isNaN(power)) {
            var oldEnable = axpIcon.bat.enableBatDisch;
            if (power > 0) {
                if (power > axpIcon.bat.powerBatDischMax) {
                    axpIcon.bat.powerBatDisch = axpIcon.bat.powerBatDischMax;
                } else {
                    axpIcon.bat.powerBatDisch = power;
                }
                if (!axpIcon.bat.enableBatDisch) {
                    axpIcon.bat.enableBatDisch = true;
                    axpIcon.startNextBatInvRDot();
                    axpIcon.startNextInvRLoadOrangeDot();
                }
            }
            var instIdx = 'powerBatDisch';
            if (!oldEnable && power > 0) {
                axpIcon.bat.enableBatDisch = true;
                axpIcon.showCom(comp.load, true, instIdx);
                axpIcon.showCom(comp.invR, true, instIdx);
                axpIcon.showCom(comp.wire.batToInvR, true, instIdx);
                axpIcon.showCom(comp.wire.invRtoLoad, true, instIdx);
            } else if (oldEnable && power === 0) {
                axpIcon.bat.enableBatDisch = false;
                axpIcon.showCom(comp.load, false, instIdx);
                axpIcon.showCom(comp.invR, false, instIdx);
                axpIcon.showCom(comp.wire.batToInvR, false, instIdx);
                axpIcon.showCom(comp.wire.invRtoLoad, false, instIdx);
            }
        }
    },
    init: function () {
        for (var name in comp) {
            if (name !== 'wire' && name !== 'bat') {
                comp[name].opacity(0);
            }
        }
        for (var wireName in comp.wire) {
            comp.wire[wireName].opacity(0);
        }
    },
    resetAnimation: function () {

        axpIcon.pv.enableLoad = false;
        axpIcon.pv.enableBat = false;
        axpIcon.pv.enablePv = false;
        axpIcon.pv.enablePvCharge = false;
        axpIcon.grid.enableBypass = false;
        axpIcon.grid.enableCharge = false;
        axpIcon.bat.enableBatDisch = false;


        for (var i = 0; i < axpIcon.bat.arr.length; i++) {
            axpIcon.bat.arr[i].finish(true, true);
            axpIcon.bat.arr[i].active = false;
        }
        for (var i = 0; i < axpIcon.pv.arr.length; i++) {
            axpIcon.pv.arr[i].finish(true, true);
            axpIcon.pv.arr[i].active = false;
        }
        for (var i = 0; i < axpIcon.grid.arr.length; i++) {
            axpIcon.grid.arr[i].finish(true, true);
            axpIcon.grid.arr[i].active = false;
        }
        for (var i = 0; i < axpIcon.grid.timerMap.length; i++) {
            clearTimeout(axpIcon.grid.timerMap[i]);
        }
        for (var i = 0; i < axpIcon.bat.timerMap.length; i++) {
            clearTimeout(axpIcon.bat.timerMap[i]);
        }
        for (var i = 0; i < axpIcon.pv.timerMap.length; i++) {
            clearTimeout(axpIcon.pv.timerMap[i]);
        }

//        console.log("call reset !!!!");
        for (var name in comp) {
            if (name !== 'wire' && name !== 'bat') {
                comp[name].opacity(0);
            }
        }
        for (var wireName in comp.wire) {
            comp.wire[wireName].opacity(0);
        }
    },

    showGrid: function (state) {
        axpIcon.showCom(comp.grid, state, 'manualControlGrid');
    },
    showCom: function (c, state, idx) {
        var trans = state ? 1 : 0;
        if (c.enReq === undefined) {
            c.enReq = {};
        }
//        if(c.enReq[idx]===undefined){
//            c.enReq[idx] = state;
//        }else{
//        }
        c.enReq[idx] = state;

        if (c.opacity() === 0 && state) {
            c.animate(1000).opacity(1);
        } else if (c.opacity() === 1 && !state) {
            var success = true;
            for (var item in c.enReq) {
                if (c.enReq[item] !== state) {
                    success = false;
                    break;
                }
            }
            if (success) {
                c.animate(1000).opacity(0);
            }
        }
    }

};
axpIcon.init();
//gridPower.startNextInvLDot();
//gridPower.startNextInvLBatDot();
//gridPower.startNextBypassDot();


function temp() {
    var collor = PF('color').input.val();
    axpIcon.setCollor('#' + collor);
    var collorS = PF('colorS').input.val();
    axpIcon.setColorShadow('#' + collorS);
}
function showAllCable(state, speed) {
    speed = speed || 1000;
    var trans = state ? 1 : 0;
    for (var wireName in comp.wire) {
        comp.wire[wireName].animate(speed).opacity(trans);
    }
}
function showComp(compName, state, speed) {
    speed = speed || 1000;
    var trans = state ? 1 : 0;
    comp[compName].animate(speed).opacity(trans);
}
function showWire(compName, state, speed) {
    speed = speed || 1000;
    var trans = state ? 1 : 0;
    comp[compName].animate(speed).opacity(trans);
}
function showAllcomponent(state, speed) {
    speed = speed || 1000;
    var trans = state ? 1 : 0;
    for (var name in comp) {
        if (name !== 'wire' && name !== 'bat') {
            comp[name].animate(speed).opacity(trans);
        }
    }
}


