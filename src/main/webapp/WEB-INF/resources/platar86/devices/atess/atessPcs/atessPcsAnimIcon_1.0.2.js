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
        let atessPCS250 = document.getElementById('inverterGroup');
//        atessPCS250.style.height = 'auto';
//        atessPCS250.style.width = '95%';
//        debugger;
        atessAnim.groups = {
            grid: SVG.get('gridGroup'),
            bat: SVG.get('batGroup')
        };
        atessAnim.powerCircles = {
            grid: new CircleGuage('gridPowerCircle', 90, {labelId: "batText"}),
            bat: new CircleGuage('batPowerCircle', 90, {labelId: "gridText"}),
            load: new CircleGuage('loadPowerCircle', 90, {labelId: "loadText"})
        };
        atessAnim.powerLabels = {
            grid: SVG.get('gridText'),
            bat: SVG.get('batText')
        };

        atessAnim.batFills = {};
        atessAnim.batFills['bat'] = {};
        atessAnim.batFills['bat']['fill'] = SVG.get('fill-y');
        atessAnim.batFills['bat']['corY'] = atessAnim.batFills['bat']['fill'].y();
        atessAnim.batFills['bat']['height'] = atessAnim.batFills['bat']['fill'].height();

        atessAnim.animDots = {
            grid: new DotAnimComp('inverterGroup', {
                dotColor: '#FF0000',
                dotGradient: orangeGradient,
                startX: 15,
                startY: 13.8,
                shape: {
                    minHeight: 15 * size,
                    maxHeight: 20 * size,
                    minWidth: 20 * size,
                    maxWidth: 30 * size,
                    name: 'rect'
                },
                anim: [{x: 21}],
                maxLevel: 100

            }),
            load: new DotAnimComp('inverterGroup', {
                dotColor: '#FF0000',
                dotGradient: orangeGradient,
                startX: 68,
                startY: 13.8,
                shape: {
                    minHeight: 15 * size,
                    maxHeight: 20 * size,
                    minWidth: 20 * size,
                    maxWidth: 30 * size,
                    name: 'rect'
                },
                anim: [{x: 21}],
                maxLevel: 100

            }),
            bat: new DotAnimComp('inverterGroup', {
                dotColor: '#Ff0000',
                dotGradient: orangeGradient,
                startX: 51.9,
                startY: 27.5,
                shape: {
                    minHeight: 15 * size,
                    maxHeight: 20 * size,
                    minWidth: 20 * size,
                    maxWidth: 30 * size,
                    name: 'rect'
                },
                anim: [{y: 4.5}],
                maxLevel: 100
            })
        };
//        atessAnim.stopAnimation();
        atessAnim.isInit = true;
    },

    onPowerDataReceived: function (data) {
        if (devManager.getSelected().connected) {
            if (!atessAnim.isInit) {
                atessAnim.init();
            }
            atessAnim.updateAnim(data);
            return;
        }
        if (atessAnim.isInit) {
            atessAnim.stopAnimation();
        }

    },
    updateAnim: function (data) {

        let percBatPower = 0;

        SVG.get('batPercText').plain(data.batPercentageP);
        atessAnim.groups.bat.style('opacity', 1);
        atessAnim.setBatLevel(atessAnim.batFills.bat, data.batPercentageP);
        
        if (dm.selected.data.batPowerW > 0) {
            percBatPower = dm.selected.data.batPowerW / data.gridImportPower.ratedPowerW * 100;
            atessAnim.powerCircles.bat.val = percBatPower;

            SVG.get('batText').plain(dm.selected.data.batPowerW / 1000);

            atessAnim.animDots.bat.setLevel(percBatPower);
            atessAnim.animDots.bat.reverse = true;

        } else if (dm.selected.data.batPowerW < 0) {
            percBatPower = -dm.selected.data.batPowerW / data.gridExportPower.ratedPowerW * 100;
//            atessAnim.groups.bat.style('opacity', 1);
            SVG.get('batText').plain(-dm.selected.data.batPowerW / 1000);
            atessAnim.powerCircles.bat.val = percBatPower;

            atessAnim.animDots.bat.setLevel(percBatPower);
            atessAnim.animDots.bat.reverse = false;

        } else {

            atessAnim.powerCircles.bat.val = 0;
            atessAnim.powerCircles.bat.val = 0;
        }


        let gridPower = 0;
        let gridPowerDirection = true;
        if (data.gridExportPower.powerW > 0) {
            gridPower = data.gridExportPower.powerW / data.gridExportPower.ratedPowerW * 100;
            SVG.get('gridText').plain(data.gridExportPower.powerW / 1000);
        } else {
            SVG.get('gridText').plain('--.--');
//            atessAnim.groups.grid.style('opacity', 0.2);
        }
//        data.gridImportPower.powerW = 50;
        if (data.gridImportPower.powerW >= 0) {
            gridPower = data.gridImportPower.powerW / data.gridImportPower.ratedPowerW * 100;
            gridPowerDirection = false;

            SVG.get('gridText').plain(data.gridImportPower.powerW / 1000);
        } else {
            SVG.get('gridText').plain('--.--');
//            atessAnim.groups.grid.style('opacity', 0.2);
        }
        atessAnim.powerCircles.grid.val = gridPower;
        atessAnim.animDots.grid.setLevel(gridPower);
        atessAnim.animDots.grid.reverse = gridPowerDirection;

        let loadPower = 0;
        if (data.load.powerW > 0) {
            loadPower = data.load.powerW / data.load.ratedPowerW * 100;
            SVG.get('loadText').plain(data.load.powerW / 1000);
        } else {
            SVG.get('loadText').plain('--.--');
//            atessAnim.groups.grid.style('opacity', 0.2);
        }

        atessAnim.powerCircles.load.val = loadPower;
        atessAnim.animDots.load.setLevel(loadPower);



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

var orangeGradient = SVG.get('inverterGroup').gradient('radial', function (stop) {
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

var redGradient = SVG.get('inverterGroup').gradient('radial', function (stop) {
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
var greenGradient = SVG.get('inverterGroup').gradient('radial', function (stop) {
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

var size = 0.2;
var shapeHor = {
    minHeight: 15 * size,
    maxHeight: 20 * size,
    minWidth: 20 * size,
    maxWidth: 30 * size,
    name: 'rect'
};

function onInverterClick() {
    let inverterImage = document.getElementById('inverterGroup');
    let svgContainer = document.querySelector('.svgContainer');
    let svg = document.getElementById('inverterGroup');
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

//let atessHPS30 = document.getElementById('atessHPS30');
//atessHPS30.style = "display:none";