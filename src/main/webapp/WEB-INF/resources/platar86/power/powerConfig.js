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

function getDiagramObjFromElement(el) {
    if (el !== undefined
            && el.getElementsByTagName('span')[0] !== undefined
            && el.getElementsByTagName('span')[0].textContent !== undefined) {
        var diagObj = {};
        diagObj.name = el.getElementsByTagName('span')[0].textContent;
        diagObj.x = el.style.left;
        diagObj.y = el.style.top;
        return diagObj;
    }
}

var powerS = {
    actualPower: {},
    actualPowerName: ''
};


powerS.setConfig = function (config) {
    powerS.config = config;
    console.log(powerS.config);

};

powerS.setOffsetEnergy = function () {
    var newOffset = mu.getWidgetValue('energyOffsetWh');
    powerS.executeInstr("setPowerOffset", powerS.actualPowerName, newOffset,
            function (msgSuccess, data) {
                mainUtils.showInfoMessage('Succesfully set new Energy Offset' + data, 'Success');
            },
            function () {
                mainUtils.showWarningMessage('Can not read values from device! ', 'Timeout');
            },
            function (msgError, faultMsg) {
                console.log(faultMsg);
                mainUtils.showWarningMessage('Error! ', faultMsg);
            }
    );
};

powerS.setNewEnergy = function (energyName) {
    var energy;
    var instruction;
    switch (energyName) {
        case 'dailyEnergyWh':
            {
                energy = mainUtils.getWidgetValue('dailyEnergyWh');
                instruction = 'setDailyEnergy';
            }
            break;
        case 'weeklyEnergyWh':
            {
                energy = mainUtils.getWidgetValue('weeklyEnergyWh');
                instruction = 'setWeeklyEnergy';
            }
            break;
        case 'monthlyEnergyWh':
            {
                energy = mainUtils.getWidgetValue('monthlyEnergyWh');
                instruction = 'setMonthlyEnergy';
            }
            break;
        case 'yearlyEnergyWh':
            {
                energy = mainUtils.getWidgetValue('yearlyEnergyWh');
                instruction = 'setYearlyEnergy';
            }
            break;
        case 'totalEnergyWh':
            {
                energy = mainUtils.getWidgetValue('totalEnergyWh');
                instruction = 'setTotalEnergy';
            }
            break;
    }
    if (energy !== undefined) {
        powerS.executeInstr(instruction, powerS.actualPowerName, energy.toString(),
                function (msgSuccess, data) {
                    mainUtils.showInfoMessage('Succesfully set new Energy ' + data, 'Success');
                },
                function () {
                    mainUtils.showWarningMessage('Can not read values from device! ', 'Timeout');
                },
                function (msgError, faultMsg) {
                    console.log(faultMsg);
                    mainUtils.showWarningMessage('Error! ', faultMsg);
                }
        );
    } else {
        console.log("Unknown energyName");
    }

};


powerS.refreshEnergyOffsetValue = function (powerName) {
    powerS.executeInstr('getPowerOffset', powerName, '',
            function (msgSuccess, data) {
                powerS.actualPower.energyOffsetWh = data;
                mu.setWidgetValue('energyOffsetWh', data);
                PF('powerAdvancedDialogWg').show();
                powerS.actualPowerName = powerName;
            },
            function (msgError) {

                console.log(msgError);
            },
            function (timeout) {
                mainUtils.showWarningMessage('Can not read values from device! ', 'Timeout');
            }
    );
};

powerS.openDialog = function (powerName) {
    powerS.executeInstr('getPower', powerName, '',
            function (msgSuccess, data) {
                var power = data;
                mu.setWidgetValue('dailyEnergyWh', power.dailyEnergyWh);
                mu.setWidgetValue('weeklyEnergyWh', power.weeklyEnergyWh);
                mu.setWidgetValue('monthlyEnergyWh', power.monthlyEnergyWh);
                mu.setWidgetValue('yearlyEnergyWh', power.yearlyEnergyWh);
                mu.setWidgetValue('totalEnergyWh', power.energyWh);
                document.getElementsByClassName('PowerNameSpan')[0].textContent = 'Advanced power settings for: ' + power.powerName;


                powerS.actualPower = power;
                powerS.refreshEnergyOffsetValue(powerName);
                console.log(power);
            },
            function (msgError) {
                mainUtils.showWarningMessage('Can not read values from device! ', 'Timeout');
            },
            function (timeout) {

                mainUtils.showWarningMessage('Can not read values from device! ', 'Timeout');
            }
    );
};



powerS.executeInstr = function (instr, value, valueExt, fnSuccess, fnTimeout, fnError) {
    fnTimeout = fnTimeout || function () {
        console.log('Timeout');
    };
    fnError = fnError || function (devMessage) {
        console.log("Error: " + devMessage.response.faultMsg);
    };
    var callbachFn = fnSuccess;
    var message = {
        instr: 'executeInstr',
        instrExt: instr,
        instrData: value,
        instrDataExt: valueExt,
        devSerialNumber: "0",
        devModelId: powerS.config.subDevModelId
    };

    console.log("send object request");
    wsm.sendDevMsg(message, callbachFn, fnError, fnTimeout);
};

function saveTypeDiagramaComponent() {
    var objArrr = {};
    var elementArr = document.getElementsByClassName('powerTypeElement');
    for (var i = 0; i < elementArr.length; i++) {
        var diagObj = getDiagramObjFromElement(elementArr[i]);
        if (diagObj !== undefined) {
            objArrr[diagObj.name] = diagObj;
        }
    }

    elementArr = document.getElementsByClassName('powerElementType');
    for (var i = 0; i < elementArr.length; i++) {
        var diagObj = getDiagramObjFromElement(elementArr[i]);
        if (diagObj !== undefined) {
            objArrr[diagObj.name] = diagObj;
        }
    }

    saveTypeDiagram([{
            name: "powerObj",
            value: JSON.stringify(objArrr)
        }]);
}
function saveDiagramaComponent() {
    var objArrr = {};
    var elementArr = document.getElementsByClassName('powerGroupElement');
    for (var i = 0; i < elementArr.length; i++) {
        var el = elementArr[i];
        var name = el.getElementsByTagName('span')[0].textContent;
        objArrr[name] = {};
        objArrr[name].x = el.style.left;
        objArrr[name].y = el.style.top;
    }
    elementArr = document.getElementsByClassName('powerElement');
    for (var i = 0; i < elementArr.length; i++) {
        var el = elementArr[i];
        var name = el.getElementsByTagName('span')[0].textContent;
        objArrr[name] = {};
        objArrr[name].x = el.style.left;
        objArrr[name].y = el.style.top;
    }
    console.log(objArrr);

    saveDiagram([{
            name: "powerObj",
            value: JSON.stringify(objArrr)
        }]);
}

