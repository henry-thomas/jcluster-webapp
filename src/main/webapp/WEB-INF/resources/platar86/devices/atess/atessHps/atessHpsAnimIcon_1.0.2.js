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


/* global SVG, devManager, hh, dm, mu */

devManager.onSelectedDataReceived(function (msg) {
    atessAnim.onPowerDataReceived(msg[msg.dataName]);
});
devManager.onSelectedStatusChange(function (sDev, status) {
    if (!status) {
        atessAnim.stopAnimation();
        atessAnim.initBat();
    }
});
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
        atessAnim.groups = {
            grid: SVG.get('gridGroup'),
            bat: SVG.get('batGroup'),
            load: SVG.get('loadGroup'),
            pv: SVG.get('pvGroup')

        };
        atessAnim.powerCircles = {
            load: new CircleGuage("loadPowerCircle", 90),
            grid: new CircleGuage('gridPowerCircle', 90),
            bat: new CircleGuage('batPowerCircle', 90),
            pv: new CircleGuage("pvPowerCircle", 90)
        };
        atessAnim.powerLabels = {
            load: SVG.get('loadText'),
            pv: SVG.get("pvText"),
            grid: SVG.get('gridText'),
            bat: SVG.get('batText')
        };

        atessAnim.batFills = {};
        atessAnim.batFills['bat' ] = {};
        atessAnim.batFills['bat' ]['fill'] = SVG.get('path22-6-4-1');
        atessAnim.batFills['bat' ]['corY'] = atessAnim.batFills['bat' ]['fill'].y();
        atessAnim.batFills['bat']['height'] = atessAnim.batFills['bat' ]['fill'].height();

        atessAnim.animDots = {
            gridImp: new DotAnimComp('sgscMain', {
                dotColor: '#FF0000',
                dotGradient: orangeGradient,
                startX: 110,
                startY: 104.2,
                shape: shapeHor,
                anim: [{x: 80}],
                maxLevel: 100

            }),
            load: new DotAnimComp('sgscMain', {
                dotColor: '#FF0000',
                dotGradient: orangeGradient,
                startX: 310,
                startY: 20,
                shape: shapeHor,
                anim: [{x: 70}],
                maxLevel: 100

            }),
            pv: new DotAnimComp('sgscMain', {
                dotColor: '#FF0000',
                dotGradient: orangeGradient,
                startX: 110,
                startY: 20,
                shape: shapeHor,
                anim: [{x: 70}],
                maxLevel: 100

            }),
            batChg: new DotAnimComp('sgscMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 310,
                startY: 104.2,
                shape: shapeHor,
                anim: [{x: 70}],
                maxLevel: 100
            }),
            gridExp: new DotAnimComp('sgscMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 180,
                startY: 104.2,
                shape: shapeHor,
                anim: [{x: -70}],
                maxLevel: 100
            }),
            batDisch: new DotAnimComp('sgscMain', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 380,
                startY: 104.2,
                shape: shapeHor,
                anim: [{x: -70}],
                maxLevel: 100
            })
        };
        atessAnim.stopAnimation();
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
        let atessHPS30 = document.getElementById('atessHPS30');
        let atessHPS50 = document.getElementById('atessHPS50');

        atessHPS30.style = "display:none";


        if (dm.selected.subModelID === 22001) {
            atessHPS50.style = "display:none";
            atessHPS30.style = "display:block";
        } else {

            atessHPS30.style = "display:none";
        }




        if (data.batPower.available) {
            SVG.get('batPercText').plain(data.batPercentageP);
            atessAnim.groups.bat.style('opacity', 1);
//             atessAnim.animDots.pv.setLevel(20);
            atessAnim.setBatLevel(atessAnim.batFills.bat, data.batPercentageP);
//            atessAnim.setBatLevel(atessAnim.batFills.bat, 10);
        } else {
            atessAnim.groups.bat.style('opacity', 0.2);
            SVG.get('batText').plain("--,--");
        }
        if (data.batPower.powerW > 0) {
            percBatPower = data.batPower.powerW / data.batPower.ratedBatChargePowerW * 100;
            atessAnim.powerCircles.bat.val = percBatPower;

            SVG.get('batText').plain(data.batPower.powerW / 1000);

//            mu.formatDashboardValue(data.batPower.powerW, atessAnim.powerLabels.bat, 'W', SVG.get('batLabel'));
            atessAnim.animDots.batChg.setLevel(percBatPower);
            atessAnim.animDots.batDisch.setLevel(0);
//            atessAnim.powerLabels.bat.plain(data.batPower.powerW / data.batPower.ratedBatChargePowerW)


        } else if (data.batPower.powerW < 0) {
            percBatPower = -data.batPower.powerW / data.batPower.ratedBatDischargePowerW * 100;
//            atessAnim.groups.bat.style('opacity', 1);
            SVG.get('batText').plain(-data.batPower.powerW / 1000);
            atessAnim.powerCircles.bat.val = percBatPower;
            atessAnim.animDots.batDisch.setLevel(percBatPower);

//            mu.formatDashboardValue(data.batPower.powerW, atessAnim.powerLabels.bat, 'W', SVG.get('batLabel'));
            atessAnim.animDots.batChg.setLevel(0);

        } else {

            atessAnim.powerCircles.bat.val = 0;
            atessAnim.powerCircles.bat.val = 0;
        }
        if (data.pvPower.powerW > 0) {
            porcPbPower = data.pvPower.powerW / data.pvPower.ratedPowerW * 100;
            atessAnim.groups.pv.style('opacity', 1);
            atessAnim.powerCircles.pv.val = porcPbPower;
            SVG.get('pvText').plain(data.pvPower.powerW / 1000);
            atessAnim.animDots.pv.setLevel(20);
        } else {
            atessAnim.powerCircles.pv.val = 0;
            atessAnim.animDots.pv.setLevel(0);
            atessAnim.groups.pv.style('opacity', 0.2);
            SVG.get('pvText').plain('--.--');
        }
        if (data.loadPower.powerW > 0) {
            percLoadPower = data.loadPower.powerW / data.loadPower.ratedPowerW * 100;
//            mu.formatDashboardValue(data.loadPower.powerW, atessAnim.powerLabels.load, 'W', SVG.get('loadLabel'));
            SVG.get('loadText').plain(data.loadPower.powerW / 1000);
            atessAnim.powerCircles.load.val = percLoadPower;
            atessAnim.animDots.load.setLevel(percLoadPower);
            atessAnim.groups.load.style('opacity', 1);
        } else {
            SVG.get('loadText').plain('--.--');
            atessAnim.powerCircles.load.val = 0;
            atessAnim.animDots.load.setLevel(0);
            atessAnim.groups.load.style('opacity', 0.2);
        }
        if (data.gridExportPower.powerW > 0) {
            percGridExPower = data.gridExportPower.powerW / data.gridExportPower.ratedPowerW * 100;
            atessAnim.powerCircles.grid.val = percGridExPower;
            SVG.get('gridText').plain(data.gridExportPower.powerW / 1000);
            atessAnim.animDots.gridExp.setLevel(percGridExPower);
        } else {
            SVG.get('gridText').plain('--.--');
            atessAnim.powerCircles.grid.val = 0;
            atessAnim.animDots.gridExp.setLevel(0);
            atessAnim.groups.grid.style('opacity', 0.2);
        }
        if (data.gridImportPower.powerW > 0) {
            percGridImPower = data.gridImportPower.powerW / data.gridImportPower.ratedPowerW * 100;
            SVG.get('gridText').plain(data.gridImportPower.powerW / 1000);
            atessAnim.powerCircles.grid.val = percGridImPower;
            atessAnim.animDots.gridImp.setLevel(percGridImPower);
            atessAnim.groups.grid.style('opacity', 1);
        } else {
            SVG.get('gridText').plain('--.--');
            atessAnim.animDots.gridImp.setLevel(0);
            atessAnim.powerCircles.grid.val = 0;
            atessAnim.groups.grid.style('opacity', 0.2);
        }
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

var size = 1;
var shapeHor = {
    minHeight: 15 * size,
    maxHeight: 20 * size,
    minWidth: 20 * size,
    maxWidth: 30 * size,
    name: 'rect'
};

function onInverterClick() {
    let inverterImage = document.getElementById('sgscMain');
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

};

$(document).ready(function () {
    atessAnim.init();
    dm.onAllDataReceived(atessAnim.start);
    onInverterClick();
});

let atessHPS30 = document.getElementById('atessHPS30');
atessHPS30.style = "display:none";