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

/* global devManager, mainUtils, wsm, dm, pcMan, sui, PF, mu */

let ems = {};
ems.pcp = {};
ems.ecp = {};
ems.scp = {};
ems.selectedDevice = '';

ems.unitMapper = {grid: 'gridPcpUnit', ren: 'pvPcpUnit', storage: 'storageScpUnit'};

ems.validateEmsDialogInputs = function () {

};

ems.powerTable = {

};

ems.savePcSettings = function () {
    let pcSettings = {
        pcp: ems.getCpUnits(ems.pcp),
        ecp: ems.getCpUnits(ems.ecp),
        scp: ems.getCpUnits(ems.scp)
    };

    console.log(pcSettings);
};

ems.getCpUnits = function (source) {
    let cpUnits = {};
    if (!source) {
        return cpUnits;
    }
    let list = Object.keys(source).filter(function (e) {
        return e.includes('Unit');
    });
    for (let i in list) {
        cpUnits[list[i]] = source[list[i]];
    }
    return cpUnits;
};

ems.updatePC = function (param) {
    if (!param) {
        return;
    }
    console.log(ems.selectedDevice);
    param.pvPcpUnit = param.pvPcpUnit || {};
    param.gridPcpUnit = param.gridPcpUnit || {};

    ems.pcp.pvPcpUnit = param.pvPcpUnit;
    ems.pcp.gridPcpUnit = param.gridPcpUnit;
};

ems.populatePc = function () {
    if (!ems.selectedDevice) {
        console.warn('No pc unit selected');
        return;
    }

    if (!ems.pcp[ems.unitMapper[ems.selectedDevice]]) {
        return;
    }

    let pcpList = ems.pcp[ems.unitMapper[ems.selectedDevice]].pcpList;
    pcMan.clear();
    if (pcpList && pcpList.length) {
        for (let i = 0; i < pcpList.length; i++) {
            pcMan.createNewPeriod({data: pcpList[i], serial: null, container: ems.pcp.container});
        }
    }
};



ems.init = function () {
    wsm.devModel = 27;
    getDevList();
    ems.deviceFetchInterval = setInterval(getDevList, 1000);
};

ems.initPcp = function () {

};

ems.addSingleDevice = function (unit) {
    if (typeof (unit) === "object") {
        dm.addSingleDev(unit);
    }
};

function getDevList() {
    wsm.sendDevMsgExecWithJsonInst(
            {instrExt: 'getUnitList'},
            function (message, response) {
                if (Object.keys(response).length > 0) {

                    clearInterval(ems.deviceFetchInterval);
                    console.log("Found EM Units: ", response);
                    dm.initDevList(response);
                    
                    wsm.alternativePath = "emsUnit";
                }
            },
            function (message, response) {
                console.warn("No Energy Management Units Found " + response);
            },
            3000);
}

function testInst(instr, val) {
    let msg = {instrExt: instr};
    msg[instr] = val || null;
    wsm.sendDevMsgExecWithJsonInst(
            msg,
            function (message, response) {
                console.log("Result: ", response);
            },
            function (message, response) {
                console.warn("No Energy Management Units Found " + response);
            },
            3000);
//    console.log("send object request");
}

ems.pcp.initControls = function () {
    ems.controlDiv = document.querySelector('.controlsDiv');
    let btn = sui.buttonCustom({
        text: 'Add Period',
        type: 'small'
    });
    ems.controlDiv.appendChild(btn);
    btn.onclick = function (ev) {
        ev.preventDefault();

//        let tabName = ems.pcp.unitTabs.getSelectedItem().menuIdx;

//        pcMan.createNewPeriod({serial: null, container: ems.pcp.unitTabs.getSelectedItemContent()});
        pcMan.createNewPeriod({serial: null, container: ems.pcp.container});
    };
};



devManager.onSelectedDataReceived();
devManager.onSelectedParamInit();

devManager.onSelectedChange(function (sDev) {
//    debugger;
    ems.selectedDevice = sDev;
    if (sDev.connected) {
        ems.updatePC(sDev[sDev.paramName]);
        ems.populatePc();
    } else {
        mainUtils.setHtmlText('dataValues', 'N/A');
    }
});

devManager.onParamReceived(function (sDev, param) {
//    updatePC(sDev.param);

});

devManager.onSelectedStatusChange(function (sDev, status) {
    if (status) {
        ems.updatePC(sDev[sDev.paramName]);
        ems.populatePc();
    } else {
//        mainUtils.setHtmlText('dataValues', 'N/A');
    }
});


$(document).ready(function () {
    window.log = console.log;
    ems.init();
});

