/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by platar86, 2020
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */


/* global devManager, mainUtils, Promise, mu, wsm */

var bmsexProd = {

};
bmsexProd.manufacture = function () {
    if (devManager.selected.param.bmsSerialNumber === 999999999) {
        bmsexProdRemoteGetNextFreeSerial([
            {
                name: "callback",
                value: "bmsexProd.onNewSerialReceived"
            }
        ]);
    } else {
        mainUtils.showWarningMessage("This BMS is manufactured already!", "Warnning");
    }
};
bmsexProd.onNewSerialReceived = function (serial) {

    devManager.executeInstr('bmsManufDate', (new Date().getTime() / 1000).toFixed(0), null,
            function (serail) {

                devManager.executeInstr('bmsSerialNumber', serial, null,
                        function (serail) {
                            try {
                                devManager.selected.param.bmsSerialNumber = serial;
                                mainUtils.setHtmlText('bmsexP-bmsSerialNumber', serial);
                            } catch (e) {

                            }
                            bmsexProdRemoteSaveSerial([
                                {
                                    name: "args",
                                    value: JSON.stringify({
                                        callback: 'bmsexProd.onBmsCompletePrintSerialLabel',
                                        serialNumber: serial,
                                        hwNumber: devManager.selected.hwVer,
                                        fwNumber: devManager.selected.param.fwVer,
                                        blFwVer: devManager.selected.param.blFwVer
                                    })
                                }
                            ]);
                        },
                        function () {

                        });
            },
            function (err) {
                console.log(err);
            });
};
bmsexProd.onBmsCompletePrintSerialLabel = function (success, serial) {
    console.log(serial);
    mainUtils.setWidgetValue('downloadLabelBmsExTempInputWg', serial);
    PF('downloadLabelBmsExTemp').jq[0].click()
};
bmsexProd.init = function () {
    console.log("bmsexProd iNIT");
};
var bmsexBatProd = {

};
bmsexBatProd.onModelSelectionChange = function () {
    let selectedModel = mainUtils.getWidgetValue('bmsExBatProdModelSelectorWg');
    if (bmsexBatProd.batteryTemplate[selectedModel] !== undefined) {
        if (devManager.selected.connected) {

            document.querySelector('.bmsExBatProdModelSelectorExec').style.display = 'block';
        } else {
            mainUtils.showWarningMessage("Device is offline", "Warning");
            document.querySelector('.bmsExBatProdModelSelectorExec').style.display = 'none';
            mainUtils.setWidgetValue('bmsExBatProdModelSelectorWg', 0);
        }


    } else {
        mu.showWarningMessage("Invalid BMS MODEL", "Warning Missing Template");
        document.querySelector('.bmsExBatProdModelSelectorExec').style.display = 'none';
        mainUtils.setWidgetValue('bmsExBatProdModelSelectorWg', 0);
    }

    console.log(selectedModel);
};
bmsexBatProd.changeDeviceSettings = function (pName, value, idx) {
    return new Promise((res, rej) => {
        devManager.executeInstr(pName, value, idx,
                async  function (msg, result) { //on success
                    res(result);
                }.bind(res),
                async function (msg, err) {
                    rej('Error ' + err);
                },
                async function () { //timeout
                    rej('Timeout');
                });
    });
};


bmsexBatProd.validateAndApplySettingsToBms = function () {

    if (devManager.selected.param.fwVer < 165) {
        mu.showWarningMessage("BMS Firmware 165 Required. Current Verison: " + devManager.selected.fwVer, "Warning");
        return;
    }

    wsm.sendDevMsgExecWithJsonInst(
            {instrExt: 'isCalibrationComplete', showMessage: true},
            function (message, response) {
                if (response === false) {
                    mu.showWarningMessage("BMS Voltage Must be Calibrated First: ", "Warning");

                } else {
                    bmsexBatProd.applySettingsToBms();
                }
            });
};

bmsexBatProd.applySettingsToBms = async function () {
    let selectedModel = mainUtils.getWidgetValue('bmsExBatProdModelSelectorWg');
    if (bmsexBatProd.batteryTemplate[selectedModel] !== undefined) {
        let template = bmsexBatProd.batteryTemplate[selectedModel];
        let devParam = devManager.selected.param;
        if (devParam !== undefined && devParam !== null) {
            let paramChangedCount = 0;
            let paramFailedCount = 0;
            let paramSkipedCount = 0;
            for (var pName in template) {
                let paramValue = template[pName];
                if (Array.isArray(paramValue)) {
                    let arrSett = paramValue;
                    for (var i = 0; i < arrSett.length; i++) {
                        if (devParam[pName][i] !== paramValue[i]) {

                            try {
                                let result = await bmsexBatProd.changeDeviceSettings(pName, paramValue[i], i);
                                devParam[pName] = result;
                                console.log("Setting " + pName + " From: " + devParam[pName][i] + "  To: " + paramValue[i] + " [" + i + "] Successful");
                                paramChangedCount++;
                            } catch (e) {
                                paramFailedCount++;
                                console.warn(e);
                                mainUtils.showWarningMessage("Param Update Fail. " + pName + " = " + paramValue[i], e);
                            }
                        } else {
                            paramSkipedCount++;
                        }
                    }
                } else {
                    if (devParam[pName] !== paramValue) {
                        try {
                            let result = await bmsexBatProd.changeDeviceSettings(pName, paramValue);
                            devParam[pName] = result;
                            console.log("Setting " + pName + " = " + paramValue + " Successful");
                            paramChangedCount++;
                        } catch (e) {
                            paramFailedCount++;
                            console.warn(e);
                            mainUtils.showWarningMessage("Param Update Fail. " + pName + " = " + paramValue, e);
                        }

                    } else {
                        paramSkipedCount++;
                    }
                }
            }
            if (paramFailedCount > 0) {

                mainUtils.showWarningMessage("Param Update Fail.", 'Succesfully writen settings=' + paramChangedCount + ', Failed=' + paramFailedCount + ', Skiped=' + paramSkipedCount);
            } else {

                mainUtils.showInfoMessage("Param Update Success.", 'Succesfully writen settings=' + paramChangedCount + ', Failed=' + paramFailedCount + ', Skiped=' + paramSkipedCount);
            }
            document.querySelector('.bmsExProdViewOutcomeLabel').textContent = 'Succesfully writen settings=' + paramChangedCount + ', Failed=' + paramFailedCount + ', Skiped=' + paramSkipedCount;
        }
    }
};

bmsexBatProd.init = function () {
    bmsexBatProd.onModelSelectionChange();
    console.log("bmsexProd iNIT");
    devManager.onSelectedChange(function () {
        document.querySelector('.bmsExBatProdModelSelectorExec').style.display = 'none';
        // mainUtils.setWidgetValue('bmsExBatProdModelSelectorWg', 0);
    });
};
$(document).ready(function () {
    bmsexProd.init();
    bmsexBatProd.init();


});

bmsexBatProd.markAsComplete = async  function () {
    console.log('EM');

    if (devManager.selected && devManager.selected.connected) {
        if (devManager.selected.param.fwVer < 165) {
            mu.showWarningMessage("BMS Firmware 165 Required. Current Verison: " + devManager.selected.fwVer, "Warning");

            return;
        }
        try {
            let manufDate = Number((new Date().getTime() / 1000).toFixed(0));
            let result = await bmsexBatProd.changeDeviceSettings('batteryManufacturingDate', manufDate);
            devManager.selected.param.batteryManufDate = manufDate;
            batProdMarkAsComplete([
                {
                    name: "bmsEx",
                    value: dm.selected.stringify()
                }
            ]);
        } catch (e) {
            mu.showWarningMessage(e, "warning");
        }
    } else {
        mu.showWarningMessage("Battery is offline!", "warning");
    }
};

let a = {
    ratedCapacityAh: {
        'SS202-11_48V': 144,
        'SS4074-11_48V': 144,
        'SS4037-11_48V': 144,
    }
}

bmsexBatProd.batteryTemplate = {

    'SS202-11_48V': {
        ratedCapacityAh: 144,
        ratedVoltageV: 51.2,
        ratedDischargeCurrentC: 0.694,
        ratedChargeCurrentC: 0.694,
        cellModel: "L135F80",
        cellCount: 16,
        protUnitPwmEnabled: 1,
        protUnitPwmFrequency: 32,
        protUnitPwmDutyCycle: 60,
        protUnitRelCoilLowCurrentErrorLevel_mA: 3,
        protUnitRelCoilHighCurrentErrorLevel_mA: 120,
        protUnitRelCurrMeasuringResistor_mOhm: 3300,
        protUnitPwmVoltageCorrectTop_mV: 46000,
        protUnitPwmVoltageCorrectBottom_mV: 38000,
        cellManufacturer: "CALB",
        batteryManufacturer: "Solar MD (Pty) Ltd.",
        batteryModel: "SS202-11",
        subModelID: "20211",
        clusterId: 0,
        cellChemistry: 0,
        botShutdownMinCellVoltage: 2650,
        botShutdownMinPackVoltage: 0,
        botShutdownCriticalCellVoltage: 2400,
        botShutdownErrorDelay: 10,
        botShutdownDelay: 600,
        botSleepLowCellVoltage: 2850,
        botSleepLowPackVoltage: 0,
        botSleepPendingDelay: 2,
        botSleepDelay: 3600,
        botSleepAwakeDelay: 35,
        topSleepCellVoltage: 3700,
        topSleepPackVoltage: 65535,
        topPendingSleephDelay: 5,
        topSleepDelay: 240,
        topAwakeConditionDelay: 20,
        perTempSensorCellEnabled: 0,
        perTempSensorForCalc: 0,
        protTcChargeTempBegin: 0,
        protTcChargeTempP1: 25,
        protTcChargeTempP2: 40,
        protTcChargeTempEnd: 60,
        protTcDischargeTempBegin: -20,
        protTcDischargeTempP1: 0,
        protTcDischargeTempP2: 40,
        protTcDischargeTempEnd: 60,
        protTcFaultChargeCurrentOffset: 15,
        protTcFaultDischargeCurrentOffset: 20,
        protTcFaultPendingDelay: 5,
        protTcFaultRecoverDelay: 10,
        cellMonCellRatedDCR: 0.91,
        cellMonCellExtDCR: [
            0.35,
            0,
            0,
            0,
            0,
            0,
            0,
            0.45,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ],
        cellMonCellRatedRCGroup: 0.45,
        cellMonCellRatedRCGEwmaCoef: 1.5,
        cellMonCellRatedRC2Group: 0.80,
        cellMonCellRatedRC2GEwmaCoef: 0.15,

        maxOpenCellThresshold: 1300,

        balOperationMode: 1,
        balLowCutoffLevel: 2750,
        balMaxChargingCurrent: 5000,
        balMaxDischargingCurrent: -5000,
        balMaxSimultCell: 5,
        balPulseDelay: 750,
        balMaxTemp: 70,
        balResistor_mOhm_x100: 13.5,
        balVBaseRangeTop: 3100,
        balVBaseRangeBottom: 2750,
        balVBaseCellComarator: 0,
        balVBaseMinCellVDiff: 5,
        balCBaseCellAligment: 0,
        balCBaseCellMinDiff: 128,
        chThBeginVoltage: 3400,
        chThEndVoltage: 3500,
        dischThBeginVoltage: 3050,
        dischThEndVoltage: 2900,
        chThBeginCapacity: 144000,
        chThEndCapacity: 144000,
        dischThBeginCapacity: 0,
        dischThEndCapacity: 0
    },
    'SS4074-11_48V': {
        ratedCapacityAh: 144,
        ratedVoltageV: 51.2,
        ratedDischargeCurrentC: 0.694,
        ratedChargeCurrentC: 0.694,
        cellModel: "L135F80",
        cellCount: 16,
        protUnitPwmEnabled: 1,
        protUnitPwmFrequency: 32,
        protUnitPwmDutyCycle: 60,
        protUnitRelCoilLowCurrentErrorLevel_mA: 3,
        protUnitRelCoilHighCurrentErrorLevel_mA: 120,
        protUnitRelCurrMeasuringResistor_mOhm: 3300,
        protUnitPwmVoltageCorrectTop_mV: 46000,
        protUnitPwmVoltageCorrectBottom_mV: 38000,
        cellManufacturer: "CALB",
        batteryManufacturer: "Solar MD (Pty) Ltd.",
        batteryModel: "SS4074-11",
        subModelID: "407411",
        clusterId: 0,
        cellChemistry: 0,

        botShutdownMinCellVoltage: 2650,
        botShutdownMinPackVoltage: 0,
        botShutdownCriticalCellVoltage: 2400,
        botShutdownErrorDelay: 10,
        botShutdownDelay: 600,
        botSleepLowCellVoltage: 2850,
        botSleepLowPackVoltage: 0,
        botSleepPendingDelay: 2,
        botSleepDelay: 3600,
        botSleepAwakeDelay: 35,
        topSleepCellVoltage: 3700,
        topSleepPackVoltage: 65535,
        topPendingSleephDelay: 5,
        topSleepDelay: 240,
        topAwakeConditionDelay: 20,
        perTempSensorCellEnabled: 0,
        perTempSensorForCalc: 0,
        protTcChargeTempBegin: 0,
        protTcChargeTempP1: 25,
        protTcChargeTempP2: 40,
        protTcChargeTempEnd: 60,
        protTcDischargeTempBegin: -20,
        protTcDischargeTempP1: 0,
        protTcDischargeTempP2: 40,
        protTcDischargeTempEnd: 60,
        protTcFaultChargeCurrentOffset: 15,
        protTcFaultDischargeCurrentOffset: 20,
        protTcFaultPendingDelay: 5,
        protTcFaultRecoverDelay: 10,
        cellMonCellRatedDCR: 0.81,
        cellMonCellExtDCR: [
            0.17,
            0,
            0,
            0,
            0,
            0,
            0,
            0.45,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ],
        cellMonCellRatedRCGroup: 0.37,
        cellMonCellRatedRCGEwmaCoef: 1.5,
        cellMonCellRatedRC2Group: 0.2,
        cellMonCellRatedRC2GEwmaCoef: 0.15,

        maxOpenCellThresshold: 1300,

        balOperationMode: 1,
        balLowCutoffLevel: 2750,
        balMaxChargingCurrent: 5000,
        balMaxDischargingCurrent: -5000,
        balMaxSimultCell: 5,
        balPulseDelay: 750,
        balMaxTemp: 70,
        balResistor_mOhm_x100: 13.5,
        balVBaseRangeTop: 3100,
        balVBaseRangeBottom: 2750,
        balVBaseCellComarator: 0,
        balVBaseMinCellVDiff: 5,
        balCBaseCellAligment: 0,
        balCBaseCellMinDiff: 128,

        chThBeginVoltage: 3400,
        chThEndVoltage: 3500,
        dischThBeginVoltage: 3050,
        dischThEndVoltage: 2900,
        chThBeginCapacity: 144000,
        chThEndCapacity: 144000,
        dischThBeginCapacity: 0,
        dischThEndCapacity: 0
    },
    'SS4037-11_48V': {
        ratedCapacityAh: 72,
        ratedVoltageV: 51.2,
        ratedDischargeCurrentC: 1.3888,
        ratedChargeCurrentC: 1.3888,
        cellModel: "L135F80",
        cellCount: 16,
        protUnitPwmEnabled: 1,
        protUnitPwmFrequency: 32,
        protUnitPwmDutyCycle: 60,
        protUnitRelCoilLowCurrentErrorLevel_mA: 3,
        protUnitRelCoilHighCurrentErrorLevel_mA: 120,
        protUnitRelCurrMeasuringResistor_mOhm: 3300,
        protUnitPwmVoltageCorrectTop_mV: 46000,
        protUnitPwmVoltageCorrectBottom_mV: 38000,

        cellManufacturer: "CALB",
        batteryManufacturer: "Solar MD (Pty) Ltd.",
        batteryModel: "SS4037-11",
        subModelID: "403711",
        clusterId: 0,
        cellChemistry: 0,

        botShutdownMinCellVoltage: 2650,
        botShutdownMinPackVoltage: 0,
        botShutdownCriticalCellVoltage: 2400,
        botShutdownErrorDelay: 10,
        botShutdownDelay: 600,
        botSleepLowCellVoltage: 2850,
        botSleepLowPackVoltage: 0,
        botSleepPendingDelay: 2,
        botSleepDelay: 3600,
        botSleepAwakeDelay: 35,
        topSleepCellVoltage: 3700,
        topSleepPackVoltage: 65535,
        topPendingSleephDelay: 5,
        topSleepDelay: 240,
        topAwakeConditionDelay: 20,
        perTempSensorCellEnabled: 0,
        perTempSensorForCalc: 0,
        protTcChargeTempBegin: 0,
        protTcChargeTempP1: 25,
        protTcChargeTempP2: 40,
        protTcChargeTempEnd: 60,
        protTcDischargeTempBegin: -20,
        protTcDischargeTempP1: 0,
        protTcDischargeTempP2: 40,
        protTcDischargeTempEnd: 60,
        protTcFaultChargeCurrentOffset: 15,
        protTcFaultDischargeCurrentOffset: 20,
        protTcFaultPendingDelay: 5,
        protTcFaultRecoverDelay: 10,
        cellMonCellRatedDCR: 0.7,
        cellMonCellExtDCR: [
            0.45,
            0,
            0,
            0,
            0,
            0,
            0,
            0.45,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ],
        cellMonCellRatedRCGroup: 0.55,
        cellMonCellRatedRCGEwmaCoef: 1.6,
        cellMonCellRatedRC2Group: 0.4,
        cellMonCellRatedRC2GEwmaCoef: 0.20,

        maxOpenCellThresshold: 1300,

        balOperationMode: 1,
        balLowCutoffLevel: 2750,
        balMaxChargingCurrent: 5000,
        balMaxDischargingCurrent: -5000,
        balMaxSimultCell: 5,
        balPulseDelay: 750,
        balMaxTemp: 70,
        balResistor_mOhm_x100: 13.5,
        balVBaseRangeTop: 3100,
        balVBaseRangeBottom: 2750,
        balVBaseCellComarator: 0,
        balVBaseMinCellVDiff: 5,
        balCBaseCellAligment: 0,
        balCBaseCellMinDiff: 128,

        chThBeginVoltage: 3400,
        chThEndVoltage: 3500,
        dischThBeginVoltage: 3050,
        dischThEndVoltage: 2900,
        chThBeginCapacity: 144000,
        chThEndCapacity: 144000,
        dischThBeginCapacity: 0,
        dischThEndCapacity: 0
    },

    'SS4143-01_48V': {
        ratedCapacityAh: 280,
        ratedVoltageV: 51.2,
        ratedDischargeCurrentC: 0.7143,
        ratedChargeCurrentC: 0.7143,
        cellModel: "CB2W0_1C",
        cellCount: 16,
        protUnitPwmEnabled: 1,
        protUnitPwmFrequency: 32,
        protUnitPwmDutyCycle: 60,
        protUnitRelCoilLowCurrentErrorLevel_mA: 3,
        protUnitRelCoilHighCurrentErrorLevel_mA: 120,
        protUnitRelCurrMeasuringResistor_mOhm: 3300,
        protUnitPwmVoltageCorrectTop_mV: 46000,
        protUnitPwmVoltageCorrectBottom_mV: 38000,

        cellManufacturer: "CATL",
        batteryManufacturer: "Solar MD (Pty) Ltd",
        batteryModel: "SS4143-01",
        subModelID: "414301",
        clusterId: 0,
        cellChemistry: 0,

        botShutdownMinCellVoltage: 2650,
        botShutdownMinPackVoltage: 0,
        botShutdownCriticalCellVoltage: 2400,
        botShutdownErrorDelay: 10,
        botShutdownDelay: 600,
        botSleepLowCellVoltage: 2850,
        botSleepLowPackVoltage: 0,
        botSleepPendingDelay: 2,
        botSleepDelay: 3600,
        botSleepAwakeDelay: 35,
        topSleepCellVoltage: 3700,
        topSleepPackVoltage: 65535,
        topPendingSleephDelay: 5,
        topSleepDelay: 240,
        topAwakeConditionDelay: 20,
        perTempSensorCellEnabled: 0,
        perTempSensorForCalc: 0,
        protTcChargeTempBegin: 0,
        protTcChargeTempP1: 25,
        protTcChargeTempP2: 40,
        protTcChargeTempEnd: 60,
        protTcDischargeTempBegin: -20,
        protTcDischargeTempP1: 0,
        protTcDischargeTempP2: 40,
        protTcDischargeTempEnd: 60,
        protTcFaultChargeCurrentOffset: 15,
        protTcFaultDischargeCurrentOffset: 20,
        protTcFaultPendingDelay: 5,
        protTcFaultRecoverDelay: 10,
        cellMonCellRatedDCR: 0.6,
        cellMonCellExtDCR: [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0.25,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ],
        cellMonCellRatedRCGroup: 0.45,
        cellMonCellRatedRCGEwmaCoef: 1.5,
        cellMonCellRatedRC2Group: 0.55,
        cellMonCellRatedRC2GEwmaCoef: 0.15,

        maxOpenCellThresshold: 1300,

        balOperationMode: 1,
        balLowCutoffLevel: 2750,
        balMaxChargingCurrent: 5000,
        balMaxDischargingCurrent: -5000,
        balMaxSimultCell: 7,
        balPulseDelay: 750,
        balMaxTemp: 70,
        balResistor_mOhm_x100: 13.5,
        balVBaseRangeTop: 3900,
        balVBaseRangeBottom: 3325,
        balVBaseCellComarator: 0,
        balVBaseMinCellVDiff: 5,
        balCBaseCellAligment: 0,
        balCBaseCellMinDiff: 128,

        chThBeginVoltage: 3400,
        chThEndVoltage: 3500,
        dischThBeginVoltage: 3050,
        dischThEndVoltage: 2900,
        chThBeginCapacity: 280000,
        chThEndCapacity: 280000,
        dischThBeginCapacity: 0,
        dischThEndCapacity: 0,

        //for the new Battery since 165
        inaShuntRes: 2000,
        inaCurrentOffset: 90
    },
    'SS5102-01_48V': {
        ratedCapacityAh: 100,
        ratedVoltageV: 51.2,
        ratedDischargeCurrentC: 1,
        ratedChargeCurrentC: 1,
        cellModel: "001CB2700",
        cellCount: 16,
        protUnitPwmEnabled: 1,
        protUnitPwmFrequency: 32,
        protUnitPwmDutyCycle: 60,
        protUnitRelCoilLowCurrentErrorLevel_mA: 3,
        protUnitRelCoilHighCurrentErrorLevel_mA: 120,
        protUnitRelCurrMeasuringResistor_mOhm: 3300,
        protUnitPwmVoltageCorrectTop_mV: 46000,
        protUnitPwmVoltageCorrectBottom_mV: 38000,

        cellManufacturer: "CATL",
        batteryManufacturer: "Solar MD (Pty) Ltd",
        batteryModel: "SS5102-01",
        subModelID: "510201",
        clusterId: 0,
        cellChemistry: 0,

        botShutdownMinCellVoltage: 2650,
        botShutdownMinPackVoltage: 0,
        botShutdownCriticalCellVoltage: 2400,
        botShutdownErrorDelay: 10,
        botShutdownDelay: 600,
        botSleepLowCellVoltage: 2850,
        botSleepLowPackVoltage: 0,
        botSleepPendingDelay: 2,
        botSleepDelay: 3600,
        botSleepAwakeDelay: 35,
        topSleepCellVoltage: 3700,
        topSleepPackVoltage: 65535,
        topPendingSleephDelay: 5,
        topSleepDelay: 240,
        topAwakeConditionDelay: 20,
        perTempSensorCellEnabled: 0,
        perTempSensorForCalc: 0,
        protTcChargeTempBegin: 0,
        protTcChargeTempP1: 25,
        protTcChargeTempP2: 40,
        protTcChargeTempEnd: 60,
        protTcDischargeTempBegin: -20,
        protTcDischargeTempP1: 0,
        protTcDischargeTempP2: 40,
        protTcDischargeTempEnd: 60,
        protTcFaultChargeCurrentOffset: 15,
        protTcFaultDischargeCurrentOffset: 20,
        protTcFaultPendingDelay: 5,
        protTcFaultRecoverDelay: 10,
        cellMonCellRatedDCR: 1.1,
        cellMonCellExtDCR: [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ],
        cellMonCellRatedRCGroup: 0.45,
        cellMonCellRatedRCGEwmaCoef: 1.5,
        cellMonCellRatedRC2Group: 0.55,
        cellMonCellRatedRC2GEwmaCoef: 0.15,

        maxOpenCellThresshold: 1300,

        balOperationMode: 1,
        balLowCutoffLevel: 2750,
        balMaxChargingCurrent: 5000,
        balMaxDischargingCurrent: -5000,
        balMaxSimultCell: 7,
        balPulseDelay: 750,
        balMaxTemp: 70,
        balResistor_mOhm_x100: 13.5,
        balVBaseRangeTop: 3900,
        balVBaseRangeBottom: 3325,
        balVBaseCellComarator: 0,
        balVBaseMinCellVDiff: 5,
        balCBaseCellAligment: 0,
        balCBaseCellMinDiff: 128,

        chThBeginVoltage: 3400,
        chThEndVoltage: 3500,
        dischThBeginVoltage: 3050,
        dischThEndVoltage: 2900,
        chThBeginCapacity: 280000,
        chThEndCapacity: 280000,
        dischThBeginCapacity: 0,
        dischThEndCapacity: 0,

        //for the new Battery since 165
        inaShuntRes: 3352,
        inaCurrentOffset: 14
    },
    'SS6143-01_48V': {
        ratedCapacityAh: 280,
        ratedVoltageV: 51.2,
        ratedDischargeCurrentC: 0.7143,
        ratedChargeCurrentC: 0.7143,
        cellModel: "CB2W0_1C",
        cellCount: 16,
        protUnitPwmEnabled: 1,
        protUnitPwmFrequency: 32,
        protUnitPwmDutyCycle: 60,
        protUnitRelCoilLowCurrentErrorLevel_mA: 3,
        protUnitRelCoilHighCurrentErrorLevel_mA: 120,
        protUnitRelCurrMeasuringResistor_mOhm: 3300,
        protUnitPwmVoltageCorrectTop_mV: 46000,
        protUnitPwmVoltageCorrectBottom_mV: 38000,

        cellManufacturer: "CATL",
        batteryManufacturer: "Solar MD (Pty) Ltd",
        batteryModel: "SS6143-01",
        subModelID: "614301",
        clusterId: 0,
        cellChemistry: 0,

        botShutdownMinCellVoltage: 2650,
        botShutdownMinPackVoltage: 0,
        botShutdownCriticalCellVoltage: 2400,
        botShutdownErrorDelay: 10,
        botShutdownDelay: 600,
        botSleepLowCellVoltage: 2850,
        botSleepLowPackVoltage: 0,
        botSleepPendingDelay: 2,
        botSleepDelay: 3600,
        botSleepAwakeDelay: 35,
        topSleepCellVoltage: 3700,
        topSleepPackVoltage: 65535,
        topPendingSleephDelay: 5,
        topSleepDelay: 240,
        topAwakeConditionDelay: 20,
        perTempSensorCellEnabled: 0,
        perTempSensorForCalc: 0,
        protTcChargeTempBegin: 0,
        protTcChargeTempP1: 25,
        protTcChargeTempP2: 40,
        protTcChargeTempEnd: 60,
        protTcDischargeTempBegin: -20,
        protTcDischargeTempP1: 0,
        protTcDischargeTempP2: 40,
        protTcDischargeTempEnd: 60,
        protTcFaultChargeCurrentOffset: 15,
        protTcFaultDischargeCurrentOffset: 20,
        protTcFaultPendingDelay: 5,
        protTcFaultRecoverDelay: 10,
        cellMonCellRatedDCR: 0.6,
        cellMonCellExtDCR: [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0.25,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ],
        cellMonCellRatedRCGroup: 0.45,
        cellMonCellRatedRCGEwmaCoef: 1.5,
        cellMonCellRatedRC2Group: 0.55,
        cellMonCellRatedRC2GEwmaCoef: 0.15,

        maxOpenCellThresshold: 1300,

        balOperationMode: 1,
        balLowCutoffLevel: 2750,
        balMaxChargingCurrent: 5000,
        balMaxDischargingCurrent: -5000,
        balMaxSimultCell: 7,
        balPulseDelay: 750,
        balMaxTemp: 70,
        balResistor_mOhm_x100: 13.5,
        balVBaseRangeTop: 3900,
        balVBaseRangeBottom: 3325,
        balVBaseCellComarator: 0,
        balVBaseMinCellVDiff: 5,
        balCBaseCellAligment: 0,
        balCBaseCellMinDiff: 128,

        chThBeginVoltage: 3400,
        chThEndVoltage: 3500,
        dischThBeginVoltage: 3050,
        dischThEndVoltage: 2900,
        chThBeginCapacity: 280000,
        chThEndCapacity: 280000,
        dischThBeginCapacity: 0,
        dischThEndCapacity: 0,

        //for the new Battery since 165
        inaShuntRes: 2000,
        inaCurrentOffset: 90
    },
};


