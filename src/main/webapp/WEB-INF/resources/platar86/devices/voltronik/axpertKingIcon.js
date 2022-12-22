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

/* global SVG, energyServiceBcReq, powerBcReq, dm, mainUtils */

var mainSvg = SVG.get('axpertKingIconImg');
var greenGradient = mainSvg.gradient('radial', function (stop) {
    stop.at({
        offset: 0.2,
        color: '#00FF00',
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
        color: '#FF0000',
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
        color: '#FFA500',
        opacity: 0.8
    });
    stop.at({
        offset: 1,
        color: '#FFFFFF',
        opacity: 0
    });
});
var iconComp = {
    gridLoadAnim: new DotAnimComp('axpertKingIconImg', {
        dotGradient: redGradient,
        startX: 20,
        startY: 20,
        maxSpeed: 5000,
        minSpeed: 200,
        dotCount: 2,
        shape: {
            minHeight: 5,
            maxHeight: 20,
            minWidth: 5,
            maxWidth: 20,
            name: 'rect'
        },
        anim: [
            {x: 30},
            {x: 17, y: 29},
            {x: 37},
            {x: 17, y: 30},
            {x: 30},
            {x: 17, y: -30},
            {x: 32},
            {x: 17, y: -30},
            {x: 20}
        ]
    })
};
var batteryModeAnim = {
    gridLoadAnim: new DotAnimComp('axpertKingIconImg', {
        dotGradient: orangeGradient,
        startX: 121,
        startY: 79,
        maxSpeed: 5000,
        minSpeed: 200,
        dotCount: 2,
        shape: {
            minHeight: 5,
            maxHeight: 20,
            minWidth: 5,
            maxWidth: 20,
            name: 'rect'
        },
        anim: [
//            {x: 30},
//            {x: 17, y: 29},
//            {x: 37},
//            {x: 17, y: 30},
            {x: 30},
            {x: 17, y: -30},
            {x: 32},
            {x: 17, y: -30},
            {x: 20}
        ]
    })
};
var standbyGridAnim = {
    gridLoadAnim: new DotAnimComp('axpertKingIconImg', {
//                dotColor: '#0fFa00',
        dotGradient: redGradient,
        startX: 20,
        startY: 20,
        maxSpeed: 5000,
        minSpeed: 200,
        dotCount: 2,
        shape: {
            minHeight: 5,
            maxHeight: 20,
            minWidth: 5,
            maxWidth: 20,
            name: 'rect'
        },
        anim: [
            {x: 30},
            {x: 17, y: 29},
            {x: 37},
            {x: 17, y: 30}
        ]
    })
};


//$(document).ready(function () {

var bypassAnim = new DotAnimComp('axpertKingIconImg', {
    dotGradient: redGradient,
    startX: 20,
    startY: 4,
    maxSpeed: 5000,
    minSpeed: 200,
    dotCount: 2,
    shape: {
        minHeight: 5,
        maxHeight: 20,
        minWidth: 5,
        maxWidth: 20,
        name: 'rect'
    },

    anim: [
        {x: 210}
    ]

});
var anim = new DotAnimComp('axpertKingIconImg', {
    dotGradient: greenGradient,
    startX: 20,
    startY: 145,
    maxSpeed: 5000,
    minSpeed: 200,
    dotCount: 2,
    shape: {
        minHeight: 5,
        maxHeight: 20,
        minWidth: 5,
        maxWidth: 20,
        name: 'rect'
    },
    anim: [
        {x: 30},
        {x: 17, y: 29},
        {x: 37},
        {x: 17, y: -30},
        {x: 35},
        {x: 17, y: -30},
        {x: 35},
        {x: 17, y: -30},
        {x: 20}
    ]

});
var StandbyModeanim = new DotAnimComp('axpertKingIconImg', {
    dotGradient: greenGradient,
    startX: 20,
    startY: 145,
    maxSpeed: 5000,
    minSpeed: 200,
    dotCount: 2,
    shape: {
        minHeight: 5,
        maxHeight: 20,
        minWidth: 5,
        maxWidth: 20,
        name: 'rect'
    },

    anim: [
        {x: 30},
        {x: 17, y: 29},
        {x: 37},
        {x: 17, y: -30}
    ]
});

var axpertKingIcon = {
    loadCube: document.getElementById("loadCube"),
    batLoadCube: document.getElementById("batLoadInvCube"),
    batCub: document.getElementById("batCube"),
    pvBatInCube: document.getElementById("pvBatInvCube"),
    gridBatInvCube: document.getElementById("gridBatInvCube"),
    mpptCube: document.getElementById("mpptCube"),
    gridCube: document.getElementById("gridCube"),
    batLoadAcLine: document.getElementById("batLoadAcLine"),
    batPbLoadLine: document.getElementById("batPbLoadLine"),
    mpptBatLine: document.getElementById("mpptBatLine"),
    bypass: document.getElementById("bypass"),
    acBatLine: document.getElementById("acBatLine")
};
var startAnim = {
    bypassAnim: () => {
        bypassAnim.setMaxLevel(5000);
        bypassAnim.setLevel(4000);
    },
    gridAnim: () => {
        iconComp.gridLoadAnim.setMaxLevel(5000);
        iconComp.gridLoadAnim.setLevel(4000);
    },
    pvAnim: () => {
        anim.setMaxLevel(5000);
        anim.setLevel(4000);
    },
    standbyModeAnim: () => {
        StandbyModeanim.setMaxLevel(5000);
        StandbyModeanim.setLevel(4000);
    },
    standbyModeGridAnim: () => {
        standbyGridAnim.gridLoadAnim.setMaxLevel(5000);
        standbyGridAnim.gridLoadAnim.setLevel(4000);
    },
    batteryModeDischargeAnim: () => {
        batteryModeAnim.gridLoadAnim.setMaxLevel(5000);
        batteryModeAnim.gridLoadAnim.setLevel(4000);
    }

};
function setlevels(dev, data) {
    if (data.workMode === "S") {
        axpertKingIcon.bypass.style.display = "none";
        axpertKingIcon.batLoadCube.style.display = "none";
        axpertKingIcon.loadCube.style.display = "none";
        axpertKingIcon.batLoadAcLine.style.display = "none";
        axpertKingIcon.batPbLoadLine.style.display = "none";
        if (data.gridInPower.powerW > 0 && data.statSccCharging === true) {
            startAnim.standbyModeAnim();
            startAnim.standbyModeGridAnim();
        }
        if (data.gridInPower.powerW > 0 && data.statSccCharging === false) {
            axpertKingIcon.pvBatInCube.style.display = "none";
            axpertKingIcon.mpptCube.style.display = "none";
            axpertKingIcon.mpptBatLine.style.display = "none";
            startAnim.standbyModeGridAnim();
        }
        if (data.gridInPower.powerW === 0 && data.statSccCharging === true) {
            axpertKingIcon.gridBatInvCube.style.display = "none";
            axpertKingIcon.gridCube.style.display = "none";
            axpertKingIcon.acBatLine.style.display = "none";
            startAnim.standbyModeAnim();
        }
        if (data.gridInPower.powerW === 0 && data.statSccCharging === false) {
            axpertKingIcon.gridBatInvCube.style.display = "none";
            axpertKingIcon.gridCube.style.display = "none";
            axpertKingIcon.acBatLine.style.display = "none";
            axpertKingIcon.mpptCube.style.display = "none";
            axpertKingIcon.mpptBatLine.style.display = "none";
            axpertKingIcon.pvBatInCube.style.display = "none";
        }
    }
    if (data.workMode === "F") {
        axpertKingIcon.batLoadCube.style.display = "none";
        axpertKingIcon.batLoadAcLine.style.display = "none";
        axpertKingIcon.batPbLoadLine.style.display = "none";
        axpertKingIcon.gridBatInvCube.style.display = "none";
        axpertKingIcon.acBatLine.style.display = "none";
        axpertKingIcon.mpptCube.style.display = "none";
        axpertKingIcon.mpptBatLine.style.display = "none";
        axpertKingIcon.pvBatInCube.style.display = "none";
        startAnim.bypassAnim();
    }
    if (data.workMode === "Y" || data.workMode === "E") {
        startAnim.bypassAnim();
        if (data.gridInPower.powerW > 0 && data.statSccCharging === true) {
            axpertKingIcon.batLoadCube.style.display = "none";
            axpertKingIcon.batLoadAcLine.style.display = "none";
            axpertKingIcon.batPbLoadLine.style.display = "none";
            startAnim.standbyModeAnim();
            startAnim.standbyModeGridAnim();
        }
        if (data.gridInPower.powerW > 0 && data.statSccCharging === true) {
            axpertKingIcon.batLoadCube.style.display = "none";
            axpertKingIcon.batLoadAcLine.style.display = "none";
            axpertKingIcon.batPbLoadLine.style.display = "none";
            axpertKingIcon.gridBatInvCube.style.display = "none";
            axpertKingIcon.acBatLine.style.display = "none";
            startAnim.standbyModeAnim();
        }
        if (data.gridInPower.powerW === 0 && data.statSccCharging === false) {
            axpertKingIcon.batLoadCube.style.display = "none";
            axpertKingIcon.batLoadAcLine.style.display = "none";
            axpertKingIcon.batPbLoadLine.style.display = "none";
            axpertKingIcon.mpptCube.style.display = "none";
            axpertKingIcon.gridBatInvCube.style.display = "none";
            axpertKingIcon.acBatLine.style.display = "none";
            axpertKingIcon.mpptBatLine.style.display = "none";
            axpertKingIcon.pvBatInCube.style.display = "none";
        }
    }

    if (data.workMode === "B") {
        axpertKingIcon.bypass.style.display = "none";
        axpertKingIcon.gridCube.style.display = "none";
        axpertKingIcon.gridBatInvCube.style.display = "none";
        axpertKingIcon.acBatLine.style.display = "none";
        if (data.statSccCharging === true && data.batteryCurrent < 0) {
            startAnim.pvAnim();
            startAnim.batteryModeDischargeAnim();
        }
        if (data.statSccCharging === false && data.batteryCurrent < 0) {
//             startAnim.pvAnim();
            axpertKingIcon.mpptCube.style.display = "none";
            axpertKingIcon.pvBatInCube.style.display = "none";
            startAnim.batteryModeDischargeAnim();
            axpertKingIcon.batPbLoadLine.style.display = "none";
            axpertKingIcon.mpptBatLine.style.display = "none";
        }
    }

    if (data.workMode === "L") {

        if (data.statSccCharging === true) {
            startAnim.pvAnim();
        }
        if (data.gridInPower.powerW > 0 && data.statSccCharging === false) {
            startAnim.gridAnim();
            axpertKingIcon.bypass.style.display = "none";
            axpertKingIcon.mpptCube.style.display = "none";
            axpertKingIcon.pvBatInCube.style.display = "none";
            axpertKingIcon.mpptBatLine.style.display = "none";
            axpertKingIcon.batPbLoadLine.style.display = "none";
        }

    }

}
dm.onSelectedDataReceived(setlevels);
//});