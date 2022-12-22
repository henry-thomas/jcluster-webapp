/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by Nathan Brill, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */


/* global SVG, devManager, hh, dm */



devManager.onSelectedDataReceived(function (msg) {
    atessAnim.onPowerDataReceived(msg[msg.dataName]);
});

devManager.onSelectedStatusChange(function (sDev, status) {
    if (!status) {
        atessAnim.stopAnimation();
        atessAnim.initBat();
    }
});

//esManager.onDataReceived(function (data) {
////    atessAnim.onStorageDataReceived(data);
//});

let atessAnim = {
    stopAnimation: function () {
        for (let i in atessAnim.animDots) {
            atessAnim.animDots[i].setLevel(0);
        }
        for (let group in atessAnim.powerCircles) {
            atessAnim.groups[group].style('opacity', 0.2);
            atessAnim.powerCircles[group].val = 0;
            atessAnim.powerLabels[group].plain('--.--');
        }
        console.log('Stopping animation');
    },

    init: function () {
//        atessAnim.displayingBatGroup = false;
        atessAnim.groups = {
            grid: SVG.get('gridGroup'),
            bat: SVG.get('batGroup'),
            load: SVG.get('loadGroup'),
            pv: SVG.get('pvGroup')

        };


//        atessPvCircle
//        atessPvPowerText
//        
//        atessLoadCircle
//        atessLoadPowerText
//        
//        atessBatPercentageCircle
//        atessBatText
//        
//        atessGridPowerCircle
//        atessGridText

        atessAnim.powerCircles = {
//            battery: new CircleGuage ("atessBatPercentageCircle"),
            load: new CircleGuage("loadPowerCircle"),
            grid: new CircleGuage('gridPowerCircle'),
            bat: new CircleGuage('batPowerCircle'),
            pv: new CircleGuage("pvPowerCirlce")
//atessAnim.powerCircles.grid.val = 50
        };
        atessAnim.powerLabels = {
            load: SVG.get('loadText'),
            pv: SVG.get("pvText"),
            grid: SVG.get('gridText'),
            bat: SVG.get('batText')
        };


        atessAnim.batFills = {};

        atessAnim.batFills['bat' ] = {};
        atessAnim.batFills['bat' ]['fill'] = SVG.get('path2278-2');
        atessAnim.batFills['bat' ]['corY'] = atessAnim.batFills['bat' ]['fill'].y();
        atessAnim.batFills['bat']['height'] = atessAnim.batFills['bat' ]['fill'].height();





        atessAnim.animDots = {
            gridImp: new DotAnimComp('sgscMain', {
                dotColor: '#FF0000',
                dotGradient: orangeGradient,
                startX: 30,
                startY: 29.9,
                shape: shapeHor,
                anim: [{x: 10}],
                maxLevel: 100

            }),
            load: new DotAnimComp('sgscMain', {
                dotColor: '#FF0000',
                dotGradient: orangeGradient,
                startX: 57,
                startY: 9.75,
                shape: shapeHor,
                anim: [{x: 10}],
                maxLevel: 100

            }),
            pv: new DotAnimComp('sgscMain', {
                dotColor: '#FF0000',
                dotGradient: orangeGradient,
                startX: 30,
                startY: 9.6,
                shape: shapeHor,
                anim: [{x: 10}],
                maxLevel: 100

            }),
            batChg: new DotAnimComp('sgscMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 57,
                startY: 29.6,
                shape: shapeHor,
                anim: [{x: 10}],
                maxLevel: 100
            }),
            gridExp: new DotAnimComp('sgscMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 40,
                startY: 30,
                shape: shapeHor,
                anim: [{x: -10}],
                maxLevel: 100
            }),
            batDisch: new DotAnimComp('sgscMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 68,
                startY: 29.6,
                shape: shapeHor,
                anim: [{x: -10}],
                maxLevel: 100
            })
        };
        atessAnim.stopAnimation();
//        atessAnim.initBat();
    },

    onPowerDataReceived: function (data) {
        if (devManager.getSelected().connected) {
            atessAnim.updateAnim(data);
            return;
        }
        atessAnim.stopAnimation();

    },

    updateAnim: function (data) {

        let percGridPower = 0;
        let gridImpRated = 0;
        let gridImportPower = 0;
        let gridExpRated = 0;
        let gridExpPowerW = 0;
        let percBatPower = 0;
        let porcPbPower = 0;
        let percLoadPower = 0;
        let percGridImPower = 0;
        let percGridExPower = 0;

        if (data.batPower.available) {
            SVG.get('batCapText').plain(data.batPercentageP);
            atessAnim.groups.bat.style('opacity', 1);
            atessAnim.setBatLevel(atessAnim.batFills.bat, data.batPercentageP);
        } else {
            atessAnim.groups.bat.style('opacity', 0.2);
        }


        if (data.batPower.powerW > 0) {
            percBatPower = data.batPower.powerW / data.batPower.ratedPowerW * 100;
            atessAnim.powerCircles.bat.val = data.batPower.powerW / data.batPower.ratedPowerW;
            mu.formatDashboardValue(data.batPower.powerW, atessAnim.powerLabels.bat, 'W', SVG.get('batUnitLabel'));
            atessAnim.animDots.batChg.setLevel(percBatPower);

        } else if (data.batPower.powerW < 0) {
            percBatPower = -data.batPower.powerW / data.batPower.ratedPowerW * 100;
//            atessAnim.groups.bat.style('opacity', 1);

            atessAnim.powerCircles.bat.val = data.batPower.powerW / data.batPower.ratedPowerW;

            mu.formatDashboardValue(data.batPower.powerW, atessAnim.powerLabels.bat, 'W', SVG.get('batUnitLabel'));
            atessAnim.animDots.batDisch.setLevel(percBatPower);

        } else {
            atessAnim.powerCircles.bat.val = 0;
            atessAnim.powerCircles.bat.val = 0;
            atessAnim.animDots.batChg.setLevel(0);
            atessAnim.animDots.batDisch.setLevel(0);
        }

        if (data.pvPower.powerW > 0) {
            porcPbPower = data.pvPower.powerW / data.pvPower.ratedPowerW * 100;
            atessAnim.groups.pv.style('opacity', 1);
            atessAnim.powerCircles.pv.val = data.pvPower.powerW / data.pvPower.ratedPowerW;
            mu.formatDashboardValue(data.pvPower.powerW, atessAnim.powerLabels.pv, 'W', SVG.get('pvUnitLabel'));
            atessAnim.animDots.pv.setLevel(porcPbPower);
        } else {
            atessAnim.powerCircles.pv.val = 0;
            atessAnim.animDots.pv.setLevel(0);
            atessAnim.groups.pv.style('opacity', 0.2);
        }


        if (data.loadPower.powerW > 0) {
            percLoadPower = data.loadPower.powerW / data.loadPower.ratedPowerW * 100;
            mu.formatDashboardValue(data.loadPower.powerW, atessAnim.powerLabels.load, 'W', SVG.get('loadUnitLabel'));
            atessAnim.powerCircles.load.val = data.loadPower.powerW / data.loadPower.ratedPowerW;
            atessAnim.animDots.load.setLevel(percLoadPower);
            atessAnim.groups.load.style('opacity', 1);
        } else {
            atessAnim.powerCircles.load.val = 0;
            atessAnim.animDots.load.setLevel(0);
            atessAnim.groups.load.style('opacity', 0.2);

        }

        if (data.gridExportPower.poweW > 0) {
            percGridExPower = data.gridExportPower.powerW / data.gridExportPower.ratedPowerW * 100;
            mu.formatDashboardValue(data.gridExportPower.powerW, atessAnim.powerLabels.grid, 'W', SVG.get('gridUnitLabel'));
            atessAnim.animDots.gridExp.setLevel(percGridExPower);
        } else {

            atessAnim.animDots.gridExp.setLevel(0);
            atessAnim.groups.grid.style('opacity', 0.2);
        }
        if (data.gridImportPower.powerW > 0) {
            percGridImPower = data.gridImportPower.powerW / data.gridImportPower.ratedPowerW * 100;
            mu.formatDashboardValue(data.gridImportPower.powerW, atessAnim.powerLabels.grid, 'W', SVG.get('gridUnitLabel'));
            atessAnim.powerCircles.grid.val = data.gridImportPower.powerW / data.gridImportPower.ratedPowerW;
            atessAnim.animDots.gridImp.setLevel(percGridImPower);
            atessAnim.groups.grid.style('opacity', 1);

        } else {
            atessAnim.animDots.gridImp.setLevel(0);
            atessAnim.powerCircles.grid.val = 0
            atessAnim.groups.grid.style('opacity', 0.2);

        }
//     
    },
    setBatLevel: function (bat, per) {
        if (!bat || !bat.fill || isNaN(bat.corY) || isNaN(per)) {
            return;
        }
        if (per < 1) {
            per = 1;
            bat.fill.opacity(0);
        } else {
            bat.fill.opacity(1);
        }
        if (per > 100) {
            per = 100;
        }

        let h = bat.height * (per / 100);
        bat.fill.y(bat.corY + bat.height - h);
        bat.fill.height(h);
    }

//    onStorageDataReceived: function (data) {
//        if (devManager.getSelected().connected || (data && data.length)) {
//            atessAnim.updateBat(data);
//            return;
//        }
//        atessAnim.initBat();
//    },

//    updateBat: function (data) {
//        if (!data) {
//            if (!atessAnim.displayingBatGroup) {
//                atessAnim.groups.bat.style('opacity', 0.1);
//            }
//            atessAnim.initBat();
//            return;
//        }
//        atessAnim.groups.bat.style('opacity', 1);
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
//        atessAnim.powerLabels.bat.plain(capacityP.toFixed(1));
//        atessAnim.powerCircles.bat.val = capacityP;
////        atessAnim.setBatLevels(capacityP);
//        atessAnim.setBatLevelsBySteps(capacityP);
//    },

//    initBat: function () {
//        atessAnim.powerLabels.bat.plain('--.--');
//        atessAnim.powerCircles.bat.val = 0;
//        atessAnim.setBatLevels(0);
//    },
//
//    setBatLevelsBySteps: function (per, nBats) {
//        nBats = nBats || 9; // We are displaying 9 batteries
//        let steps = (per / 100) * nBats;
//        let step = 1;
//        while (step < steps) {
//            atessAnim.setBatLevel(atessAnim.batFills['bat' + step], 100);
//            step++;
//        }
//        if (step <= nBats) {
//            atessAnim.setBatLevel(atessAnim.batFills['bat' + step], (steps - step + 1) * 100);
//            step++;
//        }
//        while (step <= nBats) {
//            atessAnim.setBatLevel(atessAnim.batFills['bat' + step], 1);
//            step++;
//        }
//    },
//    setBatLevels: function (per) {
//        let cont = 0;
//        while (cont < 9) {
//            cont++;
//            atessAnim.setBatLevel(atessAnim.batFills['bat' + cont], per);
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
        offset: 0.8,
        color: '#FFFFFF',
        opacity: 0
    });

});


var redGradient = SVG.get('sgscMain').gradient('radial', function (stop) {
    stop.at({
        offset: 0.2,
        color: 'red',
        opacity: 0.8
    });
    stop.at({
        offset: 0.8,
        color: '#FFFFFF',
        opacity: 0
    });

});
var greenGradient = SVG.get('sgscMain').gradient('radial', function (stop) {
    stop.at({
        offset: 0.2,
        color: '#00FF00',
        opacity: 0.8
    });
    stop.at({
        offset: 0.8,
        color: '#FFFFFF',
        opacity: 0
    });

});



var size = 0.15;
var shapeHor = {
    minHeight: 15 * size,
    maxHeight: 20 * size,
    minWidth: 20 * size,
    maxWidth: 30 * size,
    name: 'rect'
};
//var shapeVer = {
//    minHeight: 15 * size,
//    maxHeight: 20 * size,
//    minWidth: 10 * size,
//    maxWidth: 20 * size,
//    name: 'rect'
//};



function onInverterClick() {
    let inverterImage = document.getElementById('rect362-8');
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

atessAnim.start = function ([charger, inverter]) {
//    console.log(charger);
//    console.log(inverter);
}

$(document).ready(function () {
    atessAnim.init();
    dm.onAllDataReceived(atessAnim.start);
    onInverterClick();
});