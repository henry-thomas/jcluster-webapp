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
//    kba.onPowerDataReceived(msg[msg.dataName]);
});
devManager.onSelectedStatusChange(function (sDev, status) {
//    if (!status) {
//        kba.stopAnimation();
//        kba.initBat();
//    }
});
let kba = {
    stopAnimation: function () {
        for (let i in kba.animDots) {
            kba.animDots[i].setLevel(0);
        }
        for (let group in kba.powerCircles) {
            kba.groups[group].style('opacity', 0.2);
            kba.powerCircles[group].val = 0;
            kba.powerLabels[group].plain('--.--');
        }
        console.log('Stopping animation');
    },
    init: function () {
        kba.groups = {
            grid: SVG.get('gridG'),
            bat: SVG.get('batG')
        };
        kba.powerCircles = {
            grid: new CircleGuage('circle78', 90),
            bat: new CircleGuage('circle104', 90)
        };
        kba.powerLabels = {
            grid: SVG.get('tspan84'),
            bat: SVG.get('tspan100')
        };

        kba.batFills = {};
        kba.batFills['bat' ] = {};
        kba.batFills['bat' ]['fill'] = SVG.get('path22-6-4-1');
        kba.batFills['bat' ]['corY'] = kba.batFills['bat' ]['fill'].y();
        kba.batFills['bat']['height'] = kba.batFills['bat' ]['fill'].height();

        kba.animDots = {
            gridImp: new DotAnimComp('kehuaBcsAnim', {
                dotColor: '#FF0000',
                dotGradient: orangeGradient,
                startX: 110,
                startY: 104.2,
                shape: shapeHor,
                anim: [{x: 80}],
                maxLevel: 100

            }),
          
            batDisch: new DotAnimComp('kehuaBcsAnim', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 380,
                startY: 104.2,
                shape: shapeHor,
                anim: [{x: -70}],
                maxLevel: 100
            })
        };
        kba.stopAnimation();
    },

    onPowerDataReceived: function (data) {
        if (devManager.getSelected().connected) {
            kba.updateAnim(data);
            return;
        }
        kba.stopAnimation();

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
        let kehuaBcs250 = document.getElementById('kehuaBcs250');
        let atessHPS50 = document.getElementById('atessHPS50');

        kehuaBcs250.style = "display:none";


        if (dm.selected.subModelID === 22001) {
            atessHPS50.style = "display:none";
            kehuaBcs250.style = "display:block";
        } else {

            kehuaBcs250.style = "display:none";
        }




        if (data.batPower.available) {
            SVG.get('batPercText').plain(data.batPercentageP);
            kba.groups.bat.style('opacity', 1);
//             atessAnim.animDots.pv.setLevel(20);
            kba.setBatLevel(kba.batFills.bat, data.batPercentageP);
//            atessAnim.setBatLevel(atessAnim.batFills.bat, 10);
        } else {
            kba.groups.bat.style('opacity', 0.2);
            SVG.get('batText').plain("--,--");
        }
        if (data.batPower.powerW > 0) {
            percBatPower = data.batPower.powerW / data.batPower.ratedBatChargePowerW * 100;
            kba.powerCircles.bat.val = percBatPower;

            SVG.get('batText').plain(data.batPower.powerW / 1000);

//            mu.formatDashboardValue(data.batPower.powerW, atessAnim.powerLabels.bat, 'W', SVG.get('batLabel'));
            kba.animDots.batChg.setLevel(percBatPower);
            kba.animDots.batDisch.setLevel(0);
//            atessAnim.powerLabels.bat.plain(data.batPower.powerW / data.batPower.ratedBatChargePowerW)


        } else if (data.batPower.powerW < 0) {
            percBatPower = -data.batPower.powerW / data.batPower.ratedBatDischargePowerW * 100;
//            atessAnim.groups.bat.style('opacity', 1);
            SVG.get('batText').plain(-data.batPower.powerW / 1000);
            kba.powerCircles.bat.val = percBatPower;
            kba.animDots.batDisch.setLevel(percBatPower);

//            mu.formatDashboardValue(data.batPower.powerW, atessAnim.powerLabels.bat, 'W', SVG.get('batLabel'));
            kba.animDots.batChg.setLevel(0);

        } else {

            kba.powerCircles.bat.val = 0;
            kba.powerCircles.bat.val = 0;
        }
        if (data.pvPower.powerW > 0) {
            porcPbPower = data.pvPower.powerW / data.pvPower.ratedPowerW * 100;
            kba.groups.pv.style('opacity', 1);
            kba.powerCircles.pv.val = porcPbPower;
            SVG.get('pvText').plain(data.pvPower.powerW / 1000);
            kba.animDots.pv.setLevel(20);
        } else {
            kba.powerCircles.pv.val = 0;
            kba.animDots.pv.setLevel(0);
            kba.groups.pv.style('opacity', 0.2);
            SVG.get('pvText').plain('--.--');
        }
        if (data.loadPower.powerW > 0) {
            percLoadPower = data.loadPower.powerW / data.loadPower.ratedPowerW * 100;
//            mu.formatDashboardValue(data.loadPower.powerW, atessAnim.powerLabels.load, 'W', SVG.get('loadLabel'));
            SVG.get('loadText').plain(data.loadPower.powerW / 1000);
            kba.powerCircles.load.val = percLoadPower;
            kba.animDots.load.setLevel(percLoadPower);
            kba.groups.load.style('opacity', 1);
        } else {
            SVG.get('loadText').plain('--.--');
            kba.powerCircles.load.val = 0;
            kba.animDots.load.setLevel(0);
            kba.groups.load.style('opacity', 0.2);
        }
        if (data.gridExportPower.powerW > 0) {
            percGridExPower = data.gridExportPower.powerW / data.gridExportPower.ratedPowerW * 100;
            kba.powerCircles.grid.val = percGridExPower;
            SVG.get('gridText').plain(data.gridExportPower.powerW / 1000);
            kba.animDots.gridExp.setLevel(percGridExPower);
        } else {
            SVG.get('gridText').plain('--.--');
            kba.powerCircles.grid.val = 0;
            kba.animDots.gridExp.setLevel(0);
            kba.groups.grid.style('opacity', 0.2);
        }
        if (data.gridImportPower.powerW > 0) {
            percGridImPower = data.gridImportPower.powerW / data.gridImportPower.ratedPowerW * 100;
            SVG.get('gridText').plain(data.gridImportPower.powerW / 1000);
            kba.powerCircles.grid.val = percGridImPower;
            kba.animDots.gridImp.setLevel(percGridImPower);
            kba.groups.grid.style('opacity', 1);
        } else {
            SVG.get('gridText').plain('--.--');
            kba.animDots.gridImp.setLevel(0);
            kba.powerCircles.grid.val = 0;
            kba.groups.grid.style('opacity', 0.2);
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

var orangeGradient = SVG.get('kehuaBcsAnim').gradient('radial', function (stop) {
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

var redGradient = SVG.get('kehuaBcsAnim').gradient('radial', function (stop) {
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
var greenGradient = SVG.get('kehuaBcsAnim').gradient('radial', function (stop) {
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
    let inverterImage = document.getElementById('kehuaBcsAnim');
    let svgContainer = document.querySelector('.svgContainer');
    let svg = document.getElementById('kehuaBcsAnim');
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

kba.start = function ([charger, inverter]) {

};

$(document).ready(function () {
    kba.init();
//    dm.onAllDataReceived(kba.start);
//    onInverterClick();
});

//let kehuaBcs250 = document.getElementById('kehuaBcsAnim');
//kehuaBcs250.style = "display:none";