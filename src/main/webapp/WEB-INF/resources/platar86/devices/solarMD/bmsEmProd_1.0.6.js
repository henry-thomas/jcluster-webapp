/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, em, mu */

em.prodData = {};


em.initProduction = function (newSerial) {
    if (newSerial !== undefined) {
        if (mu.getWidgetValue('prodSelection') == 0) {
            mu.showErrorMessage("Please select Battery Type!");
            return;
        }
        em.prodDataSerial = newSerial;
        console.log('new serial: ' + newSerial);
        em.updateProduction();
    }
};

em.updateProduction = function () {

//    if (devManager.getSelected().serialNumber === 'SMDBEM10200000') {
    if (devManager.getSelected().serialNumber !== 'SMDBEM10200000') {
//     SMDBEM10200000
        mu.showErrorMessage("Can not manufacture battery with serial different than SMDBEM10200000!");
        return;
    }
    if (Number(devManager.getSelected().fwVer) < 0x1002) {

        mu.showErrorMessage("Firmware version Old, minimum required version: 4098 found " + Number(devManager.getSelected().fwVer));
        return;
    }

    em.prodData.unitProdActive = "1";
    em.prodData.subModelID = mu.getWidgetValue('subModelIDProd');
    em.prodDataSubModel = em.prodData.subModelID;
    em.prodData.cellManufacturer = mu.getWidgetValue('cellManufacturerProd');
    em.prodData.cellModel = mu.getWidgetValue('cellModelProd');
    em.prodData.cellCount = mu.getWidgetValue('cellCountProd');
    em.prodData.ratedChargeCurrentC = mu.getWidgetValue('ratedChargeCurrentCProd');
    em.prodData.ratedDischargeCurrentC = mu.getWidgetValue('ratedDischargeCurrentCProd');
    em.prodData.ratedCapacityAh = mu.getWidgetValue('ratedCapacityAhProd');
    em.prodData.chThBeginCapacity = mu.getWidgetValue('chThBeginCapacityProd');
    em.prodData.chThEndCapacity = mu.getWidgetValue('chThEndCapacityProd');
    em.prodData.gyroEnabled = mu.getWidgetValue('gyroEnabledProd');
    em.prodData.ratedVoltageV = mu.getWidgetValue('ratedVoltageVProd');
    em.prodData.manufacturingDate = new Date().getTime();
    em.prodData.capAligneEnabled = "0";
    em.prodData.resetMaxCellDiff = "0";

    switch (mu.getWidgetValue('prodSelection')) {
        case "SS4074-01_24V" :
            {
                em.prodData.cellVCCompensation = 3;
                em.prodData.cellCompensationArr = {};
                em.prodData.cellCompensationArr['0'] = 2;
                em.prodData.cellCompensationArr['4'] = 2;
            }
            break;
        case "SS4074-01_48V" :
            {
                em.prodData.cellVCCompensation = 5;
                em.prodData.cellCompensationArr = {};
                em.prodData.cellCompensationArr['0'] = 3;
                em.prodData.cellCompensationArr['8'] = 3;
            }
            break;
        case "SS4037-01_48V" :
            {
                em.prodData.cellVCCompensation = 8;
                em.prodData.cellCompensationArr = {};
                em.prodData.cellCompensationArr['0'] = 4;
                em.prodData.cellCompensationArr['7'] = 3;
            }
            break;
        case "SS4037-01_24V" :
            {
                mu.showErrorMessage("Not Defined Compensation Factors, Please Call Supervisor/Admin for support.");
                return;

            }
            break;
        case "SS202-05_48V" :
            {
                em.prodData.cellVCCompensation = 6;
                em.prodData.cellCompensationArr = {};
                em.prodData.cellCompensationArr['0'] = 3;
                em.prodData.cellCompensationArr['7'] = 1;
            }
            break;
        case "SS237-01_24V" :
        {
            em.prodData.cellVCCompensation = 5;
            em.prodData.cellCompensationArr = {};
            em.prodData.cellCompensationArr['0'] = 3;
            em.prodData.cellCompensationArr['3'] = 3;
        }
//            break;
        case "SS237-01_48V" :
            {
                em.prodData.cellVCCompensation = 5;
                em.prodData.cellCompensationArr = {};
                em.prodData.cellCompensationArr['0'] = 3;
                em.prodData.cellCompensationArr['8'] = 2;
            }
            break;
        case "SS202-05_24V" :
            {
//                mu.showErrorMessage("Not Defined Compensation Factors, Please Call Supervisor/Admin for support.");
//                return;
                em.prodData.cellVCCompensation = 4;
                em.prodData.cellCompensationArr = {};
                em.prodData.cellCompensationArr['0'] = 3;
                em.prodData.cellCompensationArr['3'] = 1;
            }
            break;
    }

    em.executeProdInstr();
};

em.setProdSerialLabel = function (serial) {
    document.getElementById('bmsEmDataForm:mainTabView:bmsSerialLabelInput').value = serial;
    PF('downloadLabelBmsTemp').jq.click();
};

//callback for successBMS creation
em.onBmsProdCreateSuccess = function () {
//PfUtil.executeJSWithParam("em.onBmsProdCreateSuccess", new String[]{serial});
    downloadLabelBmsTemp();
};

em.markBmsAsComplete = function () {
    var dev = clone(devManager.getSelected());
    dev.serialNumber = em.prodDataSerialComplete;
    dev.subModelID = em.prodDataSubModel;
//    dev.getData().serialNumber = em.prodDataSerialComplete;
//    dev.getParam().serialNumber = em.prodDataSerialComplete;

    if (dev.htmlComp !== undefined) {
        delete(dev.htmlComp);
    }
    bmsEmMarkBmsAsComplete([
        {
            name: "bmsEmData",
            value: "JSON.stringify(devManager.getSelected().getData()"
        },
        {
            name: "bmsEmParam",
            value: "JSON.stringify(devManager.getSelected().getParam())"
        },
        {
            name: "bmsEm",
            value: JSON.stringify(dev)
        }
    ]);
};

em.markAsComplete = function () {
    console.log('EM');
    var dev = clone(devManager.getSelected());
    if (!devManager.getSelected().getData().alignedCapacity) {
        mu.showErrorMessage("Can not read Realcapacity!");
        return;
    }
    if (!devManager.getSelected().getData().maxDischargeCurrent) {
        mu.showErrorMessage("Can not read Max discharge Current!");
        return;
    }
//    /resetMaxDischarge


    // var realCapAh = devManager.getSelected().getData().alignedCapacity / 3600000;
    var maxDischargeCurrent = devManager.getSelected().getData().maxDischargeCurrent / 1000;
    var ratedDischargeCurrent = devManager.getSelected().getParam().ratedDischargeCurrentC * devManager.getSelected().getData().ratedCapacityAh * -1;

//    if (devManager.getSelected().getData().ratedCapacityAh > realCapAh) {
//        mu.showErrorMessage("Battery realCapacity is not in the limits!. Please REPORT THIS Message To QC SUPERVISOR!");
//        return;
//    }
    if (maxDischargeCurrent > ratedDischargeCurrent) {
        mu.showErrorMessage("Battery Maximum Discharge Current is " + maxDischargeCurrent + "A. Required current for this battery is:" + (ratedDischargeCurrent * 1.05) + "A");
        return;
    }
//    try {
//        let cellDiff = devManager.getSelected().getData().maxCellDiff;
//        if (cellDiff === 0 || cellDiff > 100) {
//            mu.showErrorMessage("Cell Voltage Diff Error! " + cellDiff + 'mV');
//            return;
//        }
//    } catch (e) {
//        mu.showErrorMessage("CellDiff Reading Error" + e);
//        return;
//    }

    if (dev.htmlComp !== undefined) {
        delete(dev.htmlComp);
    }

    devManager.sendDevMessage(
            {
                instrExt: 'unitProdActive',
                instrData: '0',

                instrDataExt: '0'
            },
            function (message, data) { //success after unit is completed
                batProdMarkAsComplete([
                    {
                        name: "bmsEmData",
                        value: "JSON.stringify(devManager.getSelected().getData()"
                    },
                    {
                        name: "bmsEmParam",
                        value: "JSON.stringify(devManager.getSelected().getParam())"
                    },
                    {
                        name: "bmsEm",
                        value: JSON.stringify(devManager.getSelected())
                    }
                ]);
            },
            function (message, error) { //Error
                mainUtils.showErrorMessage(error, "Error: " + error);
            },
            function () { //Timeout
                mainUtils.showErrorMessage("Can not mark BMSEM prod Complete. Reason: TIMEOUT");
            });
};


em.executeProdInstr = function () {
    var param;
    var value;
    var valueExt = 0;
    for (var item in em.prodData) {
        if (em.prodData.ratedCapacityAh !== undefined) { //try to set first max capacity is required for calc currentC
            param = 'ratedCapacityAh';
            value = em.prodData[param];
            break;
        }
        param = item;
        value = em.prodData[item];
        break;
    }

    if (param === undefined) {
        if (em.prodDataSerial === undefined) {
            mu.showInfoMessage("Success update");
            PF('prodButton').disable();
            mu.setWidgetValue('prodSelection', '0');
            PF('prodButton').disable();
            em.markBmsAsComplete();
            return;
        } else {
            param = 'serialNumber';
            value = em.prodDataSerial;
            em.prodDataSerialComplete = em.prodDataSerial;
            delete em.prodDataSerial;
        }
    } else if (param === 'cellCompensationArr') {
        if (Object.keys(em.prodData.cellCompensationArr).length === 0) {
            delete em.prodData.cellCompensationArr;
            em.executeProdInstr();
            return;
        } else {
            for (var item in em.prodData.cellCompensationArr) {
                value = em.prodData.cellCompensationArr[item];
                valueExt = item;
                break;
            }
            delete em.prodData.cellCompensationArr[valueExt];
        }
    } else {
        delete em.prodData[param];
    }

    value = value || 0;
    var message = {
        instrExt: param,
        instrData: value.toString(),
        instrDataExt: valueExt.toString()
    };

    devManager.sendDevMessage(message,
            function (message, data) { //success
                mainUtils.showInfoMessage("Change " + message.instrExt + " submited successfully", "Success execution.");
                em.executeProdInstr();
            },
            function (message, error) { //Error
                mainUtils.showErrorMessage(error, "Message exec fail. [" + message.instrExt + "]");
            },
            function () { //Timeout
                mainUtils.showErrorMessage("Timeout", "Message exec fail. [" + message.instrExt + "]");
                console.log('timeout');
            });

};

em.prodSelectionChange = function () {
    console.log('prod selection change');
    var sel = mu.getWidgetValue('prodSelection');
    switch (sel) {
        case "SS4074-01_48V" :
            {
                mu.setWidgetValue('serialNumberProd', 'SMDBEM10200000');
                mu.setWidgetValue('cellManufacturerProd', 'CALB');
                mu.setWidgetValue('cellModelProd', 'CAM72');
                mu.setWidgetValue('subModelIDProd', 407401);
                mu.setWidgetValue('cellCountProd', 16);
                mu.setWidgetValue('ratedChargeCurrentCProd', 0.6944);
                mu.setWidgetValue('ratedDischargeCurrentCProd', 0.6944);
                mu.setWidgetValue('ratedCapacityAhProd', 144);
                mu.setWidgetValue('sleepHighDelayProd', 180);
                mu.setWidgetValue('ratedVoltageVProd', 51.2);
                mu.setWidgetValue('sleepLowDelayProd', 1200);
                mu.setWidgetValue('chThBeginCapacityProd', 144000);
                mu.setWidgetValue('chThEndCapacityProd', 144000);
                mu.setWidgetValue('gyroEnabledProd', 1);
                PF('prodButton').enable();
            }
            break;

        case "SS4074-01_24V" :
            {
                mu.setWidgetValue('serialNumberProd', 'SMDBEM10200000');
                mu.setWidgetValue('cellManufacturerProd', 'CALB');
                mu.setWidgetValue('cellModelProd', 'CAM72');
                mu.setWidgetValue('subModelIDProd', 407401);
                mu.setWidgetValue('cellCountProd', 8);
                mu.setWidgetValue('ratedChargeCurrentCProd', 0.34722222);
                mu.setWidgetValue('ratedDischargeCurrentCProd', 0.34722222);
                mu.setWidgetValue('ratedCapacityAhProd', 288);
                mu.setWidgetValue('sleepHighDelayProd', 180);
                mu.setWidgetValue('ratedVoltageVProd', 25.6);
                mu.setWidgetValue('sleepLowDelayProd', 1200);
                mu.setWidgetValue('chThBeginCapacityProd', 288000);
                mu.setWidgetValue('chThEndCapacityProd', 288000);
                mu.setWidgetValue('gyroEnabledProd', 1);
                PF('prodButton').enable();
            }
            break;

        case "SS4037-01_48V" :
            {
                mu.setWidgetValue('serialNumberProd', 'SMDBEM10200000');
                mu.setWidgetValue('cellManufacturerProd', 'CALB');
                mu.setWidgetValue('cellModelProd', 'CAM72');
                mu.setWidgetValue('subModelIDProd', 403701);
                mu.setWidgetValue('cellCountProd', 16);
                mu.setWidgetValue('ratedChargeCurrentCProd', 1.388);
                mu.setWidgetValue('ratedDischargeCurrentCProd', 1.388);
                mu.setWidgetValue('ratedCapacityAhProd', 72);
                mu.setWidgetValue('ratedVoltageVProd', 51.2);
                mu.setWidgetValue('chThBeginCapacityProd', 72000);
                mu.setWidgetValue('chThEndCapacityProd', 72000);
                mu.setWidgetValue('gyroEnabledProd', 1);
                PF('prodButton').enable();
            }
            break;
        case "SS4037-01_24V" :
            {
                mu.setWidgetValue('serialNumberProd', 'SMDBEM10200000');
                mu.setWidgetValue('cellManufacturerProd', 'CALB');
                mu.setWidgetValue('cellModelProd', 'CAM72');
                mu.setWidgetValue('subModelIDProd', 403701);
                mu.setWidgetValue('cellCountProd', 8);
                mu.setWidgetValue('ratedChargeCurrentCProd', 0.694);
                mu.setWidgetValue('ratedDischargeCurrentCProd', 0.694);
                mu.setWidgetValue('ratedCapacityAhProd', 144);
                mu.setWidgetValue('ratedVoltageVProd', 25.6);

                mu.setWidgetValue('chThBeginCapacityProd', 144000);
                mu.setWidgetValue('chThEndCapacityProd', 144000);
                mu.setWidgetValue('gyroEnabledProd', 1);
                PF('prodButton').enable();
            }
            break;
        case "SS202-05_48V" :
            {
                mu.setWidgetValue('serialNumberProd', 'SMDBEM10200000');
                mu.setWidgetValue('cellManufacturerProd', 'CALB');
                mu.setWidgetValue('cellModelProd', 'CAM72');
                mu.setWidgetValue('subModelIDProd', 20205);
                mu.setWidgetValue('cellCountProd', 16);
                mu.setWidgetValue('ratedChargeCurrentCProd', 0.694);
                mu.setWidgetValue('ratedDischargeCurrentCProd', 0.694);
                mu.setWidgetValue('ratedVoltageVProd', 51.2);
                mu.setWidgetValue('ratedCapacityAhProd', 144);
                mu.setWidgetValue('chThBeginCapacityProd', 144000);
                mu.setWidgetValue('chThEndCapacityProd', 144000);
                mu.setWidgetValue('gyroEnabledProd', 1);
                PF('prodButton').enable();
            }
            break;
        case "SS202-05_24V" :
            {
                mu.setWidgetValue('serialNumberProd', 'SMDBEM10200000');
                mu.setWidgetValue('cellManufacturerProd', 'CALB');
                mu.setWidgetValue('cellModelProd', 'CAM72');
                mu.setWidgetValue('subModelIDProd', 20205);
                mu.setWidgetValue('cellCountProd', 8);
                mu.setWidgetValue('ratedChargeCurrentCProd', 0.3742222);
                mu.setWidgetValue('ratedDischargeCurrentCProd', 0.3742222);
                mu.setWidgetValue('ratedVoltageVProd', 25.6);
                mu.setWidgetValue('ratedCapacityAhProd', 288);
                mu.setWidgetValue('chThBeginCapacityProd', 288000);
                mu.setWidgetValue('chThEndCapacityProd', 288000);
                mu.setWidgetValue('gyroEnabledProd', 1);
                PF('prodButton').enable();
            }
            break;
        case "SS237-01_24V" :
            {
                mu.setWidgetValue('serialNumberProd', 'SMDBEM10200000');
                mu.setWidgetValue('cellManufacturerProd', 'CALB');
                mu.setWidgetValue('cellModelProd', 'CAM72');
                mu.setWidgetValue('subModelIDProd', 23701);
                mu.setWidgetValue('cellCountProd', 8);
                mu.setWidgetValue('ratedChargeCurrentCProd', 0.694);
                mu.setWidgetValue('ratedDischargeCurrentCProd', 0.694);
                mu.setWidgetValue('ratedVoltageVProd', 25.6);
                mu.setWidgetValue('ratedCapacityAhProd', 144);
                mu.setWidgetValue('chThBeginCapacityProd', 144000);
                mu.setWidgetValue('chThEndCapacityProd', 144000);
                PF('prodButton').enable();
            }
            break;
        case "SS237-01_48V" :
            {
                mu.setWidgetValue('serialNumberProd', 'SMDBEM10200000');
                mu.setWidgetValue('cellManufacturerProd', 'CALB');
                mu.setWidgetValue('cellModelProd', 'CAM72');
                mu.setWidgetValue('subModelIDProd', 23701);
                mu.setWidgetValue('cellCountProd', 16);
                mu.setWidgetValue('ratedChargeCurrentCProd', 1.388);
                mu.setWidgetValue('ratedDischargeCurrentCProd', 1.388);
                mu.setWidgetValue('ratedCapacityAhProd', 72);
                mu.setWidgetValue('ratedVoltageVProd', 51.2);
                mu.setWidgetValue('chThBeginCapacityProd', 72000);
                mu.setWidgetValue('chThEndCapacityProd', 72000);
                mu.setWidgetValue('gyroEnabledProd', 1);
                PF('prodButton').enable();
            }
            break;

        default:
//            mu.showErrorMessage("Not supported selection");
            PF('prodButton').disable();
            break;
    }
};

