let paramDesc = {
    "bootAndAppBurnSelection": {
        "paramName": "bootAndAppBurnSelection",
        "title": "Boot and App Burn Selection",
        "paramDesc": "",
        "type": "dropDown",
        "unit": "",
        "group": "Advanced Settings",
        "register": "127",
        "options": [{
                "label": "Burn App",
                "value": "0"
            }, {
                "label": "Burn Boot",
                "value": "1"
            }]
    },
    "pvPowerDetail": {
        "paramName": "pvPowerDetail",
        "title": "Record all PV Data",
        "paramDesc": "When true, all pv data is recorded. This will create five additional powers on the power chart.",
        "type": "dropDown",
        "unit": "",
        "group": "Advanced Settings",
        "register": "0",
        "options": [{
                "label": "True",
                "value": "true"
            }, {
                "label": "False",
                "value": "false"
            }]
    },
    "peakTimePeriod1EndMinute": {
        "paramName": "peakTimePeriod1EndMinute",
        "title": "Peak Time Period 1 End Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "801",
        "options": null
    },
    "gridCurrentVCal": {
        "paramName": "gridCurrentVCal",
        "title": "Grid Current V Calibration",
        "paramDesc": "1~2000A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Calibration Settings",
        "register": "88",
        "options": null
    },
    "hardwareVersionChoice": {
        "paramName": "hardwareVersionChoice",
        "title": "Hardware Version Choice",
        "paramDesc": "",
        "type": "inputNumber",
        "unit": "",
        "group": "Advanced Settings",
        "register": "25",
        "options": null
    },
    "powerOnDetectionTime": {
        "paramName": "powerOnDetectionTime",
        "title": "Power On Detection Time",
        "paramDesc": "0~1000S",
        "type": "inputNumber",
        "unit": "S",
        "group": "Advanced Settings",
        "register": "56",
        "options": null
    },
    "maxOutputInductanceCurrent": {
        "paramName": "maxOutputInductanceCurrent",
        "title": "Output Inductance Current",
        "paramDesc": "0~500A",
        "type": "inputNumber",
        "unit": "A",
        "group": "PV Settings",
        "register": "72",
        "options": null
    },
    "powerOnPower": {
        "paramName": "powerOnPower",
        "title": "Power On Power",
        "paramDesc": "0~50kW",
        "type": "inputNumber",
        "unit": "kW",
        "group": "Inverter Settings",
        "register": "63",
        "options": null
    },
    "chargeCurrentLimit": {
        "paramName": "chargeCurrentLimit",
        "title": "Charge Current Limit",
        "paramDesc": "0~1000A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Battery Settings",
        "register": "154",
        "options": null
    },
    "parallelCirculationCali": {
        "paramName": "parallelCirculationCali",
        "title": "Parallel Circulation Cali",
        "paramDesc": "0~1000",
        "type": "inputNumber",
        "unit": "",
        "group": "Advanced Settings",
        "register": "284",
        "options": null
    },
    "droopModeEnable": {
        "paramName": "droopModeEnable",
        "title": "Droop Mode Enable",
        "paramDesc": "",
        "type": "switch",
        "unit": "",
        "group": "Advanced Settings",
        "register": "164",
        "options": null
    },
    "batDischargeSmallCurrentValue": {
        "paramName": "batDischargeSmallCurrentValue",
        "title": "Small Current Bias Value of Battery Discharging",
        "paramDesc": "0~20A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Advanced Settings",
        "register": "113",
        "options": null
    },
    "peakTimePeriod2StartMinute": {
        "paramName": "peakTimePeriod2StartMinute",
        "title": "Peak Time Period 2 Start Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "802",
        "options": null
    },
    "normalTimePeriod1StartMinute": {
        "paramName": "normalTimePeriod1StartMinute",
        "title": "Normal Time Period 1 Start Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "820",
        "options": null
    },
    "normalTimePeriod4StartMinute": {
        "paramName": "normalTimePeriod4StartMinute",
        "title": "Normal Time Period 4 Start Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "826",
        "options": null
    },
    "lowVoltageFault": {
        "paramName": "lowVoltageFault",
        "title": "Low Cell Voltage Fault",
        "paramDesc": "0~50V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Battery Settings",
        "register": "158",
        "options": null
    },
    "peakTimePeriod4StartHour": {
        "paramName": "peakTimePeriod4StartHour",
        "title": "Peak Time Period 4 Start Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "806",
        "options": null
    },
    "socLowerLimit": {
        "paramName": "socLowerLimit",
        "title": "SOC Lower Limit ",
        "paramDesc": "",
        "type": "inputNumber",
        "unit": "%",
        "group": "Battery Settings",
        "register": "66",
        "options": null
    },
    "normalTimePeriod4EndMinute": {
        "paramName": "normalTimePeriod4EndMinute",
        "title": "Normal Time Period 4 End Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "827",
        "options": null
    },
    "normalTimePeriod2StartHour": {
        "paramName": "normalTimePeriod2StartHour",
        "title": "Normal Time Period 2 Start Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "822",
        "options": null
    },
    "pvVoltageCal": {
        "paramName": "pvVoltageCal",
        "title": "PV Voltage Calibration",
        "paramDesc": "200~1000V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Calibration Settings",
        "register": "80",
        "options": null
    },
    "parallelAddress": {
        "paramName": "parallelAddress",
        "title": "Parallel Address",
        "paramDesc": "Set a Parallel address for this device",
        "type": "inputNumber",
        "unit": "",
        "group": "Operation Settings",
        "register": "119",
        "options": null
    },
    "pv3Current": {
        "paramName": "pv3Current",
        "title": "PV3 Current Calibration",
        "paramDesc": "1~2000A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Calibration Settings",
        "register": "140",
        "options": null
    },
    "normalTimePeriod2EndHour": {
        "paramName": "normalTimePeriod2EndHour",
        "title": "Normal Time Period 2 End Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "823",
        "options": null
    },
    "outVoltage": {
        "paramName": "outVoltage",
        "title": "Out Voltage Calibration",
        "paramDesc": "200~1000V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Calibration Settings",
        "register": "143",
        "options": null
    },
    "normalTimePeriod1StartHour": {
        "paramName": "normalTimePeriod1StartHour",
        "title": "Normal Time Period 1 Start Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "820",
        "options": null
    },
    "pv1Current": {
        "paramName": "pv1Current",
        "title": "PV1 Current Calibration",
        "paramDesc": "1~2000A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Calibration Settings",
        "register": "138",
        "options": null
    },
    "pv5Current": {
        "paramName": "pv5Current",
        "title": "PV5 Current Calibration",
        "paramDesc": "1~2000A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Calibration Settings",
        "register": "142",
        "options": null
    },
    "normalTimePeriod4EndHour": {
        "paramName": "normalTimePeriod4EndHour",
        "title": "Normal Time Period 4 End Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "827",
        "options": null
    },
    "systemDateDay": {
        "paramName": "systemDateDay",
        "title": "System Date Day",
        "paramDesc": "",
        "type": "inputNumber",
        "unit": "",
        "group": "Advanced Settings",
        "register": "131",
        "options": null
    },
    "peakTimePeriod5StartHour": {
        "paramName": "peakTimePeriod5StartHour",
        "title": "Peak Time Period 5 Start Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "808",
        "options": null
    },
    "valleyTimePeriod3EndMinute": {
        "paramName": "valleyTimePeriod3EndMinute",
        "title": "Valley Time Period 3 End Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "815",
        "options": null
    },
    "loadCurrentWCal": {
        "paramName": "loadCurrentWCal",
        "title": "Load Current W Calibration",
        "paramDesc": "1~2000A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Calibration Settings",
        "register": "95",
        "options": null
    },
    "batChargeSaturation": {
        "paramName": "batChargeSaturation",
        "title": "Battery Charge Saturation",
        "paramDesc": "",
        "type": "inputNumber",
        "unit": "",
        "group": "Battery Settings",
        "register": "150",
        "options": null
    },
    "pvCurrentCal": {
        "paramName": "pvCurrentCal",
        "title": "PV Current Calibration",
        "paramDesc": "1~2000A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Calibration Settings",
        "register": "83",
        "options": null
    },
    "valleyTimePeriod2EndMinute": {
        "paramName": "valleyTimePeriod2EndMinute",
        "title": "Valley Time Period 2 End Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "814",
        "options": null
    },
    "systemDateSecond": {
        "paramName": "systemDateSecond",
        "title": "System Date Second",
        "paramDesc": "",
        "type": "inputNumber",
        "unit": "",
        "group": "Advanced Settings",
        "register": "132",
        "options": null
    },
    "minDcOutputVoltage": {
        "paramName": "minDcOutputVoltage",
        "title": "Minimum DC Output Voltage",
        "paramDesc": "200~1000V",
        "type": "inputNumber",
        "unit": "V",
        "group": "PV Settings",
        "register": "69",
        "options": null
    },
    "batCurCal": {
        "paramName": "batCurCal",
        "title": "Battery Current Calibration",
        "paramDesc": "1~2000A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Calibration Settings",
        "register": "82",
        "options": null
    },
//    "comPort": {
//        "paramName": "comPort",
//        "title": "",
//        "paramDesc": "",
//        "type": "inputText",
//        "unit": "",
//        "group": "",
//        "register": "",
//        "options": null
//    },
    "startupPower": {
        "paramName": "startupPower",
        "title": "Start-up Power",
        "paramDesc": "0~50kW",
        "type": "inputNumber",
        "unit": "kW",
        "group": "Advanced Settings",
        "register": "63",
        "options": null
    },
    "valleyTimePeriod5StartMinute": {
        "paramName": "valleyTimePeriod5StartMinute",
        "title": "Valley Time Period 5 Start Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "818",
        "options": null
    },
    "normalTimePeriod5EndMinute": {
        "paramName": "normalTimePeriod5EndMinute",
        "title": "Normal Time Period 5 End Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "829",
        "options": null
    },
    "peakTimePeriod3StartHour": {
        "paramName": "peakTimePeriod3StartHour",
        "title": "Peak Time Period 3 Start Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "804",
        "options": null
    },
    "pv1Voltage": {
        "paramName": "pv1Voltage",
        "title": "PV1 Voltage Calibration",
        "paramDesc": "200~1000V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Calibration Settings",
        "register": "133",
        "options": null
    },
    "pv2Voltage": {
        "paramName": "pv2Voltage",
        "title": "PV2 Voltage Calibration",
        "paramDesc": "200~1000V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Calibration Settings",
        "register": "134",
        "options": null
    },
    "peakTimePeriod3StartMinute": {
        "paramName": "peakTimePeriod3StartMinute",
        "title": "Peak Time Period 3 Start Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "804",
        "options": null
    },
    "outputVoltageVCal": {
        "paramName": "outputVoltageVCal",
        "title": "Output Voltage V Calibration",
        "paramDesc": "160~550V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Calibration Settings",
        "register": "85",
        "options": null
    },
    "peakSetPower2": {
        "paramName": "peakSetPower2",
        "title": "Peak Set Power 2",
        "paramDesc": "1~500kW",
        "type": "inputNumber",
        "unit": "kW",
        "group": "Multistage Power Settings",
        "register": "767",
        "options": null
    },
    "startingVoltageDifferential": {
        "paramName": "startingVoltageDifferential",
        "title": "Starting Voltage Differential",
        "paramDesc": "0~200V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Advanced Settings",
        "register": "128",
        "options": null
    },
    "peakSetPower3": {
        "paramName": "peakSetPower3",
        "title": "Peak Set Power 3",
        "paramDesc": "1~500kW",
        "type": "inputNumber",
        "unit": "kW",
        "group": "Multistage Power Settings",
        "register": "768",
        "options": null
    },
    "peakSetPower4": {
        "paramName": "peakSetPower4",
        "title": "Peak Set Power 4",
        "paramDesc": "1~500kW",
        "type": "inputNumber",
        "unit": "kW",
        "group": "Multistage Power Settings",
        "register": "769",
        "options": null
    },
    "gridVoltageWUCal": {
        "paramName": "gridVoltageWUCal",
        "title": "Grid Voltage WU Calibration",
        "paramDesc": "160~550V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Calibration Settings",
        "register": "92",
        "options": null
    },
    "peakSetPower5": {
        "paramName": "peakSetPower5",
        "title": "Peak Set Power 5",
        "paramDesc": "1~500kW",
        "type": "inputNumber",
        "unit": "kW",
        "group": "Multistage Power Settings",
        "register": "770",
        "options": null
    },
    "outputPowerSetting": {
        "paramName": "outputPowerSetting",
        "title": "Output Power Limit",
        "paramDesc": "",
        "type": "inputNumber",
        "unit": "kW",
        "group": "Inverter Settings",
        "register": "59",
        "options": null
    },
    "safetyRegulationSetting": {
        "paramName": "safetyRegulationSetting",
        "title": "Safety Regulation Setting",
        "paramDesc": "",
        "type": "inputNumber",
        "unit": "",
        "group": "Advanced Settings",
        "register": "22",
        "options": null
    },
    "factoryReset": {
        "paramName": "factoryReset",
        "title": "Factorty Reset",
        "paramDesc": "Factory reset will restore all settings to default - you may lose connection with the inverter",
        "type": "dropDown",
        "unit": "",
        "group": "Operation Settings",
        "register": "6",
        "options": [{
                "label": "Cancel",
                "value": "0"
            }, {
                "label": "Enter",
                "value": "1"
            }]
    },
    "normalTimePeriod3EndMinute": {
        "paramName": "normalTimePeriod3EndMinute",
        "title": "Normal Time Period 3 End Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "825",
        "options": null
    },
    "valleyTimePeriod4StartMinute": {
        "paramName": "valleyTimePeriod4StartMinute",
        "title": "Valley Time Period 4 Start Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "816",
        "options": null
    },
    "valleyTimePeriod4StartHour": {
        "paramName": "valleyTimePeriod4StartHour",
        "title": "Valley Time Period 4 Start Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "816",
        "options": null
    },
    "modbusAddress": {
        "paramName": "modbusAddress",
        "title": "Modbus Address",
        "paramDesc": "Set a Modbus address for this device ranging from 1-32",
        "type": "inputNumber",
        "unit": "",
        "group": "Operation Settings",
        "register": "23",
        "options": null
    },
    "parallelEnable": {
        "paramName": "parallelEnable",
        "title": "Parallel Mode",
        "paramDesc": "Switch ON if there is more than one inverter connected in parallel and OFF if its a single inverter",
        "type": "switch",
        "unit": "",
        "group": "Operation Settings",
        "register": "24",
        "options": null
    },
    "cpNominalPowerSetting": {
        "paramName": "cpNominalPowerSetting",
        "title": "CP Nominal Power Setting",
        "paramDesc": "0~1000kW",
        "type": "inputNumber",
        "unit": "kW",
        "group": "Advanced Settings",
        "register": "118",
        "options": null
    },
    "maxDcOutputVoltage": {
        "paramName": "maxDcOutputVoltage",
        "title": "Maximum DC Output Voltage",
        "paramDesc": "200~1000V",
        "type": "inputNumber",
        "unit": "V",
        "group": "PV Settings",
        "register": "68",
        "options": null
    },
    "normalTimePeriod5EndHour": {
        "paramName": "normalTimePeriod5EndHour",
        "title": "Normal Time Period 5 End Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "829",
        "options": null
    },
    "batDischargeCalLCDCurrent2": {
        "paramName": "batDischargeCalLCDCurrent2",
        "title": "Battery Discharging Calibration LCD Current 2",
        "paramDesc": "0~800A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Advanced Settings",
        "register": "124",
        "options": null
    },
    "pv5Voltage": {
        "paramName": "pv5Voltage",
        "title": "PV5 Voltage Calibration",
        "paramDesc": "200~1000V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Calibration Settings",
        "register": "137",
        "options": null
    },
    "peakSetPower1": {
        "paramName": "peakSetPower1",
        "title": "Peak Set Power 1",
        "paramDesc": "1~500kW",
        "type": "inputNumber",
        "unit": "kW",
        "group": "Multistage Power Settings",
        "register": "766",
        "options": null
    },
    "batDischargeCalLCDCurrent1": {
        "paramName": "batDischargeCalLCDCurrent1",
        "title": "Battery Discharging Calibration LCD Current 1",
        "paramDesc": "0~800A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Advanced Settings",
        "register": "122",
        "options": null
    },
    "reactiveSagCoefficient": {
        "paramName": "reactiveSagCoefficient",
        "title": "Reactive Sag Coefficient",
        "paramDesc": "0~1000",
        "type": "inputNumber",
        "unit": "",
        "group": "Advanced Settings",
        "register": "279",
        "options": null
    },
    "batteryChargingCurrent": {
        "paramName": "batteryChargingCurrent",
        "title": "Battery Charge Current",
        "paramDesc": "0~800A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Battery Settings",
        "register": "64",
        "options": null
    },
    "onOff": {
        "paramName": "onOff",
        "title": "Power",
        "paramDesc": "ON / OFF",
        "type": "switch",
        "unit": "",
        "group": "Operation Settings",
        "register": "0",
        "options": null
    },
    "deliveryMonth": {
        "paramName": "deliveryMonth",
        "title": "Delivery Month",
        "paramDesc": "",
        "type": "inputNumber",
        "unit": "",
        "group": "Advanced Settings",
        "register": "120",
        "options": null
    },
    "parallelSynchronizationPhaseDiffLimitingCoefficient": {
        "paramName": "parallelSynchronizationPhaseDiffLimitingCoefficient",
        "title": "Parallel Sync Phase Diff Limiting Coefficient",
        "paramDesc": "0~1000",
        "type": "inputNumber",
        "unit": "",
        "group": "Advanced Settings",
        "register": "282",
        "options": null
    },
    "gridCurrentUCal": {
        "paramName": "gridCurrentUCal",
        "title": "Grid Current U Calibration",
        "paramDesc": "1~2000A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Calibration Settings",
        "register": "87",
        "options": null
    },
    "normalTimePeriod4StartHour": {
        "paramName": "normalTimePeriod4StartHour",
        "title": "Normal Time Period 4 Start Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "826",
        "options": null
    },
    "normalTimePeriod1EndHour": {
        "paramName": "normalTimePeriod1EndHour",
        "title": "Normal Time Period 1 End Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "821",
        "options": null
    },
    "modeSelection": {
        "paramName": "modeSelection",
        "title": "Mode Selection",
        "paramDesc": "Select system work mode",
        "type": "dropDown",
        "unit": "",
        "group": "Operation Settings",
        "register": "26",
        "options": [{
                "label": "Load Priority",
                "value": "0"
            }, {
                "label": "Battery Priority",
                "value": "1"
            }, {
                "label": "Economic Mode",
                "value": "2"
            }, {
                "label": "Peak Shaving",
                "value": "3"
            }, {
                "label": "Multi Period Charge/Discharge",
                "value": "4"
            }, {
                "label": "Manual Dispatching",
                "value": "5"
            }, {
                "label": "Battery Protection",
                "value": "6"
            }, {
                "label": "Backup Power Management",
                "value": "7"
            }, {
                "label": "Constant Power Discharge",
                "value": "8"
            }, {
                "label": "Forced Charging Mode",
                "value": "9"
            }]
    },
    "pv4Current": {
        "paramName": "pv4Current",
        "title": "PV4 Current Calibration",
        "paramDesc": "1~2000A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Calibration Settings",
        "register": "141",
        "options": null
    },
    "emsEnable": {
        "paramName": "emsEnable",
        "title": "EMS",
        "paramDesc": "When activated the inverter is fully controlled by an External Energy Management System (EMS)",
        "type": "switch",
        "unit": "",
        "group": "Operation Settings",
        "register": "32",
        "options": null
    },
    "loadCurrentUCal": {
        "paramName": "loadCurrentUCal",
        "title": "Load Current U Calibration",
        "paramDesc": "1~2000A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Calibration Settings",
        "register": "93",
        "options": null
    },
    "batChargeSmallCurrentValue": {
        "paramName": "batChargeSmallCurrentValue",
        "title": "Small Current Bias Value of Battery Charging",
        "paramDesc": "0~20A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Advanced Settings",
        "register": "111",
        "options": null
    },
    "batGroupNumber": {
        "paramName": "batGroupNumber",
        "title": "Battery Group Number",
        "paramDesc": "0~100",
        "type": "inputNumber",
        "unit": "",
        "group": "Battery Settings",
        "register": "151",
        "options": null
    },
    "batChargeCalLCDCurrent2": {
        "paramName": "batChargeCalLCDCurrent2",
        "title": "Battery Charging Calibration LCD Current 2",
        "paramDesc": "0~800A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Advanced Settings",
        "register": "116",
        "options": null
    },
    "peakTimePeriod4StartMinute": {
        "paramName": "peakTimePeriod4StartMinute",
        "title": "Peak Time Period 4 Start Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "806",
        "options": null
    },
    "systemBatteryCurrentCalibration": {
        "paramName": "systemBatteryCurrentCalibration",
        "title": "System Battery Current Calibration",
        "paramDesc": "",
        "type": "switch",
        "unit": "",
        "group": "Advanced Settings",
        "register": "149",
        "options": null
    },
    "parallelPhaseSynIntegralCoefficient": {
        "paramName": "parallelPhaseSynIntegralCoefficient",
        "title": "Parallel Phase Syn Integral Coefficient",
        "paramDesc": "0~1000",
        "type": "inputNumber",
        "unit": "",
        "group": "Advanced Settings",
        "register": "277",
        "options": null
    },
    "batChargeCalLCDCurrent1": {
        "paramName": "batChargeCalLCDCurrent1",
        "title": "Battery Charging Calibration LCD Current 1",
        "paramDesc": "0~800A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Advanced Settings",
        "register": "114",
        "options": null
    },
    "valleyTimePeriod2StartMinute": {
        "paramName": "valleyTimePeriod2StartMinute",
        "title": "Valley Time Period 2 Start Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "813",
        "options": null
    },
    "floatingChargeVoltage": {
        "paramName": "floatingChargeVoltage",
        "title": "Float Charge Cell Voltage",
        "paramDesc": "0~50V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Battery Settings",
        "register": "156",
        "options": null
    },
    "valleyTimePeriod5EndMinute": {
        "paramName": "valleyTimePeriod5EndMinute",
        "title": "Valley Time Period 5 End Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "819",
        "options": null
    },
    "valleyTimePeriod1StartHour": {
        "paramName": "valleyTimePeriod1StartHour",
        "title": "Valley Time Period 1 Start Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "811",
        "options": null
    },
    "mpptLowerLimitVoltage": {
        "paramName": "mpptLowerLimitVoltage",
        "title": "MPPT Lower Limit Voltage",
        "paramDesc": "300~1500V",
        "type": "inputNumber",
        "unit": "V",
        "group": "PV Settings",
        "register": "62",
        "options": null
    },
    "voltageDroopReactivePower": {
        "paramName": "voltageDroopReactivePower",
        "title": "Voltage Droop Reactive Power",
        "paramDesc": "Droop at Rated Reactive Power",
        "type": "inputNumber",
        "unit": "%",
        "group": "Advanced Settings",
        "register": "168",
        "options": null
    },
    "maxPvInductanceCurrent": {
        "paramName": "maxPvInductanceCurrent",
        "title": "PV Inductance Current",
        "paramDesc": "0~500A",
        "type": "inputNumber",
        "unit": "A",
        "group": "PV Settings",
        "register": "71",
        "options": null
    },
    "valleyTimePeriod1StartMinute": {
        "paramName": "valleyTimePeriod1StartMinute",
        "title": "Valley Time Period 1 Start Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "811",
        "options": null
    },
    "peakTimePeriod5StartMinute": {
        "paramName": "peakTimePeriod5StartMinute",
        "title": "Peak Time Period 5 Start Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "808",
        "options": null
    },
    "peakTimePeriod2EndMinute": {
        "paramName": "peakTimePeriod2EndMinute",
        "title": "Peak Time Period 2 End Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "803",
        "options": null
    },
    "maxOutputCurrent": {
        "paramName": "maxOutputCurrent",
        "title": "Output Current",
        "paramDesc": "0~500A",
        "type": "inputNumber",
        "unit": "A",
        "group": "PV Settings",
        "register": "73",
        "options": null
    },
    "peakTimePeriod3EndHour": {
        "paramName": "peakTimePeriod3EndHour",
        "title": "Peak Time Period 3 End Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "805",
        "options": null
    },
    "peakTimePeriod2EndHour": {
        "paramName": "peakTimePeriod2EndHour",
        "title": "Peak Time Period 2 End Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "803",
        "options": null
    },
    "peakTimePeriod4EndHour": {
        "paramName": "peakTimePeriod4EndHour",
        "title": "Peak Time Period 4 End Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "807",
        "options": null
    },
    "peakTimePeriod4EndMinute": {
        "paramName": "peakTimePeriod4EndMinute",
        "title": "Peak Time Period 4 End Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "807",
        "options": null
    },
    "valleyTimePeriod3StartHour": {
        "paramName": "valleyTimePeriod3StartHour",
        "title": "Valley Time Period 3 Start Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "814",
        "options": null
    },
    "gridVoltageVWCal": {
        "paramName": "gridVoltageVWCal",
        "title": "Grid Voltage VW Calibration",
        "paramDesc": "160~550V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Calibration Settings",
        "register": "91",
        "options": null
    },
    "batCurrentCal": {
        "paramName": "batCurrentCal",
        "title": "Battery Current Calibration",
        "paramDesc": "1~2000A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Calibration Settings",
        "register": "82",
        "options": null
    },
    "deliveryDay": {
        "paramName": "deliveryDay",
        "title": "Delivery Day",
        "paramDesc": "",
        "type": "inputNumber",
        "unit": "",
        "group": "Advanced Settings",
        "register": "120",
        "options": null
    },
    "systemDateYear": {
        "paramName": "systemDateYear",
        "title": "System Date Year",
        "paramDesc": "",
        "type": "inputNumber",
        "unit": "",
        "group": "Advanced Settings",
        "register": "130",
        "options": null
    },
    "normalTimePeriod5StartHour": {
        "paramName": "normalTimePeriod5StartHour",
        "title": "Normal Time Period 5 Start Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "828",
        "options": null
    },
    "activeSagCoefficient": {
        "paramName": "activeSagCoefficient",
        "title": "Active Sag Coefficient",
        "paramDesc": "0~1000",
        "type": "inputNumber",
        "unit": "",
        "group": "Advanced Settings",
        "register": "278",
        "options": null
    },
    "lowVoltageAlarm": {
        "paramName": "lowVoltageAlarm",
        "title": "Low Cell Voltage Alarm",
        "paramDesc": "0~50V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Battery Settings",
        "register": "157",
        "options": null
    },
    "peakTimePeriod5EndHour": {
        "paramName": "peakTimePeriod5EndHour",
        "title": "Peak Time Period 5 End Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "809",
        "options": null
    },
    "peakTimePeriod1EndHour": {
        "paramName": "peakTimePeriod1EndHour",
        "title": "Peak Time Period 1 End Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "801",
        "options": null
    },
    "bmsCommunicationEnable": {
        "paramName": "bmsCommunicationEnable",
        "title": "Battery Management System",
        "paramDesc": "Switch ON to enable communication between the battery BMS and Inverter",
        "type": "switch",
        "unit": "",
        "group": "Battery Settings",
        "register": "14",
        "options": null
    },
    "systemDateMinute": {
        "paramName": "systemDateMinute",
        "title": "System Date Minute",
        "paramDesc": "",
        "type": "inputNumber",
        "unit": "",
        "group": "Advanced Settings",
        "register": "132",
        "options": null
    },
    "valleyTimePeriod1EndHour": {
        "paramName": "valleyTimePeriod1EndHour",
        "title": "Valley Time Period 1 End Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "812",
        "options": null
    },
    "valleyTimePeriod2EndHour": {
        "paramName": "valleyTimePeriod2EndHour",
        "title": "Valley Time Period 2 End Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "814",
        "options": null
    },
    "batDischargeCalCurrentActual1": {
        "paramName": "batDischargeCalCurrentActual1",
        "title": "Battery Discharging Calibration Actual Current 1",
        "paramDesc": "0~800A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Advanced Settings",
        "register": "123",
        "options": null
    },
    "valleyTimePeriod3EndHour": {
        "paramName": "valleyTimePeriod3EndHour",
        "title": "Valley Time Period 3 End Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "815",
        "options": null
    },
    "batDischargeCalCurrentActual2": {
        "paramName": "batDischargeCalCurrentActual2",
        "title": "Battery Discharging Calibration Actual Current 2",
        "paramDesc": "0~800A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Advanced Settings",
        "register": "125",
        "options": null
    },
    "peakTimePeriod2StartHour": {
        "paramName": "peakTimePeriod2StartHour",
        "title": "Peak Time Period 2 Start Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "802",
        "options": null
    },
    "valleyTimePeriod4EndHour": {
        "paramName": "valleyTimePeriod4EndHour",
        "title": "Valley Time Period 4 End Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "817",
        "options": null
    },
    "valleyTimePeriod5EndHour": {
        "paramName": "valleyTimePeriod5EndHour",
        "title": "Valley Time Period 5 End Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "819",
        "options": null
    },
    "normalTimePeriod1EndMinute": {
        "paramName": "normalTimePeriod1EndMinute",
        "title": "Normal Time Period 1 End Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "821",
        "options": null
    },
    "valleyTimePeriod3StartMinute": {
        "paramName": "valleyTimePeriod3StartMinute",
        "title": "Valley Time Period 3 Start Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "814",
        "options": null
    },
    "peakTimePeriod1StartMinute": {
        "paramName": "peakTimePeriod1StartMinute",
        "title": "Peak Time Period 1 Start Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "800",
        "options": null
    },
    "gridCurrentWCal": {
        "paramName": "gridCurrentWCal",
        "title": "Grid Current W Calibration",
        "paramDesc": "1~2000A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Calibration Settings",
        "register": "89",
        "options": null
    },
    "batVoltageCal": {
        "paramName": "batVoltageCal",
        "title": "Battery Voltage Calibration",
        "paramDesc": "200~1000V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Calibration Settings",
        "register": "81",
        "options": null
    },
    "outputVoltageUCal": {
        "paramName": "outputVoltageUCal",
        "title": "Output Voltage U Calibration",
        "paramDesc": "160~550V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Calibration Settings",
        "register": "84",
        "options": null
    },
    "shadowVoltageChange": {
        "paramName": "shadowVoltageChange",
        "title": "Shadow Voltage Change",
        "paramDesc": "0.1~15V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Advanced Settings",
        "register": "57",
        "options": null
    },
    "valleySetPower1": {
        "paramName": "valleySetPower1",
        "title": "Valley Set Power 1",
        "paramDesc": "1~500kW",
        "type": "inputNumber",
        "unit": "kW",
        "group": "Multistage Power Settings",
        "register": "771",
        "options": null
    },
    "pvPowerSetting": {
        "paramName": "pvPowerSetting",
        "title": "PV Settings",
        "paramDesc": "0~500kW",
        "type": "inputNumber",
        "unit": "kW",
        "group": "PV Settings",
        "register": "33",
        "options": null
    },
    "normalTimePeriod3StartMinute": {
        "paramName": "normalTimePeriod3StartMinute",
        "title": "Normal Time Period 3 Start Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "824",
        "options": null
    },
    "batUnitNumber": {
        "paramName": "batUnitNumber",
        "title": "Battery Unit Number",
        "paramDesc": "Number of cells - 0~50000",
        "type": "inputNumber",
        "unit": "",
        "group": "Battery Settings",
        "register": "152",
        "options": null
    },
    "peakTimePeriod1StartHour": {
        "paramName": "peakTimePeriod1StartHour",
        "title": "Peak Time Period 1 Start Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "800",
        "options": null
    },
    "gridVoltageUVCal": {
        "paramName": "gridVoltageUVCal",
        "title": "Grid Voltage UV Calibration",
        "paramDesc": "160~550V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Calibration Settings",
        "register": "90",
        "options": null
    },
    "peakTimePeriod5EndMinute": {
        "paramName": "peakTimePeriod5EndMinute",
        "title": "Peak Time Period 5 End Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "809",
        "options": null
    },
    "batStartupVoltage": {
        "paramName": "batStartupVoltage",
        "title": "Battery Cell Startup Voltage",
        "paramDesc": "0~50V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Battery Settings",
        "register": "160",
        "options": null
    },
    "valleySetPower4": {
        "paramName": "valleySetPower4",
        "title": "Valley Set Power 4",
        "paramDesc": "1~500kW",
        "type": "inputNumber",
        "unit": "kW",
        "group": "Multistage Power Settings",
        "register": "774",
        "options": null
    },
    "valleySetPower5": {
        "paramName": "valleySetPower5",
        "title": "Valley Set Power 5",
        "paramDesc": "1~500kW",
        "type": "inputNumber",
        "unit": "kW",
        "group": "Multistage Power Settings",
        "register": "775",
        "options": null
    },
    "valleySetPower2": {
        "paramName": "valleySetPower2",
        "title": "Valley Set Power 2",
        "paramDesc": "1~500kW",
        "type": "inputNumber",
        "unit": "kW",
        "group": "Multistage Power Settings",
        "register": "772",
        "options": null
    },
    "valleySetPower3": {
        "paramName": "valleySetPower3",
        "title": "Valley Set Power 3",
        "paramDesc": "1~500kW",
        "type": "inputNumber",
        "unit": "kW",
        "group": "Multistage Power Settings",
        "register": "773",
        "options": null
    },
    "normalTimePeriod2StartMinute": {
        "paramName": "normalTimePeriod2StartMinute",
        "title": "Normal Time Period 2 Start Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "822",
        "options": null
    },
    "frequencyOffset": {
        "paramName": "frequencyOffset",
        "title": "Frequency Offset",
        "paramDesc": "Offset at 0kW",
        "type": "inputNumber",
        "unit": "Hz",
        "group": "Advanced Settings",
        "register": "165",
        "options": null
    },
    "floatChargeCurrentLimitPoint": {
        "paramName": "floatChargeCurrentLimitPoint",
        "title": "Float Charge Current Limit Point Setting",
        "paramDesc": "0~10V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Battery Settings",
        "register": "163",
        "options": null
    },
    "pv3Voltage": {
        "paramName": "pv3Voltage",
        "title": "PV3 Voltage Calibration",
        "paramDesc": "200~1000V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Calibration Settings",
        "register": "135",
        "options": null
    },
    "pv4Voltage": {
        "paramName": "pv4Voltage",
        "title": "PV4 Voltage Calibration",
        "paramDesc": "200~1000V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Calibration Settings",
        "register": "136",
        "options": null
    },
    "normalTimePeriod5StartMinute": {
        "paramName": "normalTimePeriod5StartMinute",
        "title": "Normal Time Period 5 Start Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "828",
        "options": null
    },
    "highVoltageFault": {
        "paramName": "highVoltageFault",
        "title": "High Cell Voltage Fault",
        "paramDesc": "0~50V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Battery Settings",
        "register": "159",
        "options": null
    },
    "batteryCurrentCalibrationEnable": {
        "paramName": "batteryCurrentCalibrationEnable",
        "title": "Battery Current Calibration Enable",
        "paramDesc": "",
        "type": "dropDown",
        "unit": "",
        "group": "Advanced Settings",
        "register": "37",
        "options": [{
                "label": "Disable",
                "value": "0"
            }, {
                "label": "Enable",
                "value": "1"
            }]
    },
    "valleyTimePeriod4EndMinute": {
        "paramName": "valleyTimePeriod4EndMinute",
        "title": "Valley Time Period 4 End Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "817",
        "options": null
    },
    "maxPvCurrent": {
        "paramName": "maxPvCurrent",
        "title": "PV Current Limit",
        "paramDesc": "0~500A",
        "type": "inputNumber",
        "unit": "A",
        "group": "PV Settings",
        "register": "70",
        "options": null
    },
    "dischargeCutoffVoltage": {
        "paramName": "dischargeCutoffVoltage",
        "title": "Discharge Cell Cut-off Voltage",
        "paramDesc": "0~50V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Battery Settings",
        "register": "162",
        "options": null
    },
    "mpptUpperLimitVoltage": {
        "paramName": "mpptUpperLimitVoltage",
        "title": "MPPT Upper Limit Voltage",
        "paramDesc": "300~1500V",
        "type": "inputNumber",
        "unit": "V",
        "group": "PV Settings",
        "register": "61",
        "options": null
    },
    "socUpperLimit": {
        "paramName": "socUpperLimit",
        "title": "SOC Upper Limit ",
        "paramDesc": "",
        "type": "inputNumber",
        "unit": "%",
        "group": "Battery Settings",
        "register": "67",
        "options": null
    },
    "batChargeCalCurrentActual2": {
        "paramName": "batChargeCalCurrentActual2",
        "title": "Battery Charging Calibration Actual Current 2",
        "paramDesc": "0~800A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Advanced Settings",
        "register": "117",
        "options": null
    },
    "systemDateHour": {
        "paramName": "systemDateHour",
        "title": "System Date Hour",
        "paramDesc": "",
        "type": "inputNumber",
        "unit": "",
        "group": "Advanced Settings",
        "register": "131",
        "options": null
    },
    "loadCurrentVCal": {
        "paramName": "loadCurrentVCal",
        "title": "Load Current V Calibration",
        "paramDesc": "1~2000A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Calibration Settings",
        "register": "94",
        "options": null
    },
    "frequencyDroop": {
        "paramName": "frequencyDroop",
        "title": "Frequency Droop",
        "paramDesc": "Droop at Rated Power",
        "type": "inputNumber",
        "unit": "%",
        "group": "Advanced Settings",
        "register": "166",
        "options": null
    },
    "dtc": {
        "paramName": "dtc",
        "title": "DTC",
        "paramDesc": "21016~21039",
        "type": "inputNumber",
        "unit": "",
        "group": "Advanced Settings",
        "register": "43",
        "options": null
    },
    "insulationImpedenceTestEnable": {
        "paramName": "insulationImpedenceTestEnable",
        "title": "Insulation Impedence Test",
        "paramDesc": "Activate insulation impendence test",
        "type": "switch",
        "unit": "",
        "group": "Advanced Settings",
        "register": "5",
        "options": null
    },
    "batChargeCalCurrentActual1": {
        "paramName": "batChargeCalCurrentActual1",
        "title": "Battery Charging Calibration Actual Current 1",
        "paramDesc": "0~800A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Advanced Settings",
        "register": "115",
        "options": null
    },
    "valleyTimePeriod1EndMinute": {
        "paramName": "valleyTimePeriod1EndMinute",
        "title": "Valley Time Period 1 End Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "812",
        "options": null
    },
    "valleyTimePeriod2StartHour": {
        "paramName": "valleyTimePeriod2StartHour",
        "title": "Valley Time Period 2 Start Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "813",
        "options": null
    },
    "batCapacity": {
        "paramName": "batCapacity",
        "title": "Rated Capacity",
        "paramDesc": "0~50000Ah",
        "type": "inputNumber",
        "unit": "Ah",
        "group": "Battery Settings",
        "register": "153",
        "options": null
    },
    "powerOnVoltage": {
        "paramName": "powerOnVoltage",
        "title": "Power On Voltage",
        "paramDesc": "300~850V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Inverter Settings",
        "register": "60",
        "options": null
    },
    "systemDateMonth": {
        "paramName": "systemDateMonth",
        "title": "System Date Month",
        "paramDesc": "",
        "type": "inputNumber",
        "unit": "",
        "group": "Advanced Settings",
        "register": "130",
        "options": null
    },
    "normalTimePeriod2EndMinute": {
        "paramName": "normalTimePeriod2EndMinute",
        "title": "Normal Time Period 2 End Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "823",
        "options": null
    },
    "dischargeCurrentLimit": {
        "paramName": "dischargeCurrentLimit",
        "title": "Discharge Current Limit",
        "paramDesc": "0~1000A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Battery Settings",
        "register": "155",
        "options": null
    },
    "outputVoltageWCal": {
        "paramName": "outputVoltageWCal",
        "title": "Output Voltage W Calibration",
        "paramDesc": "160~550V",
        "type": "inputNumber",
        "unit": "V",
        "group": "Calibration Settings",
        "register": "86",
        "options": null
    },
    "normalSetPower1": {
        "paramName": "normalSetPower1",
        "title": "Normal Period Power 1",
        "paramDesc": "1~500kW",
        "type": "inputNumber",
        "unit": "kW",
        "group": "Multistage Power Settings",
        "register": "776",
        "options": null
    },
    "normalTimePeriod3EndHour": {
        "paramName": "normalTimePeriod3EndHour",
        "title": "Normal Time Period 3 End Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "825",
        "options": null
    },
    "pv2Current": {
        "paramName": "pv2Current",
        "title": "PV2 Current Calibration",
        "paramDesc": "1~2000A",
        "type": "inputNumber",
        "unit": "A",
        "group": "Calibration Settings",
        "register": "139",
        "options": null
    },
    "normalSetPower4": {
        "paramName": "normalSetPower4",
        "title": "Normal Period Power 4",
        "paramDesc": "1~500kW",
        "type": "inputNumber",
        "unit": "kW",
        "group": "Multistage Power Settings",
        "register": "779",
        "options": null
    },
    "peakTimePeriod3EndMinute": {
        "paramName": "peakTimePeriod3EndMinute",
        "title": "Peak Time Period 3 End Minute",
        "paramDesc": "0~59",
        "type": "inputNumber",
        "unit": "m",
        "group": "Multistage Power Settings",
        "register": "805",
        "options": null
    },
    "valleyTimePeriod5StartHour": {
        "paramName": "valleyTimePeriod5StartHour",
        "title": "Valley Time Period 5 Start Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "818",
        "options": null
    },
    "normalSetPower5": {
        "paramName": "normalSetPower5",
        "title": "Normal Period Power 5",
        "paramDesc": "1~500kW",
        "type": "inputNumber",
        "unit": "kW",
        "group": "Multistage Power Settings",
        "register": "780",
        "options": null
    },
    "normalSetPower2": {
        "paramName": "normalSetPower2",
        "title": "Normal Period Power 2",
        "paramDesc": "1~500kW",
        "type": "inputNumber",
        "unit": "kW",
        "group": "Multistage Power Settings",
        "register": "777",
        "options": null
    },
    "voltageOffsetKvar": {
        "paramName": "voltageOffsetKvar",
        "title": "Voltage Offset Kvar",
        "paramDesc": "Offset at 0Kvar",
        "type": "inputNumber",
        "unit": "V",
        "group": "Advanced Settings",
        "register": "167",
        "options": null
    },
    "normalSetPower3": {
        "paramName": "normalSetPower3",
        "title": "Normal Period Power 3",
        "paramDesc": "1~500kW",
        "type": "inputNumber",
        "unit": "kW",
        "group": "Multistage Power Settings",
        "register": "778",
        "options": null
    },
    "batDischargeSmallCurrentBiasFlag": {
        "paramName": "batDischargeSmallCurrentBiasFlag",
        "title": "Battery Discharging Small Current Positive and Negative Bias Flag",
        "paramDesc": "",
        "type": "dropDown",
        "unit": "",
        "group": "Advanced Settings",
        "register": "112",
        "options": [{
                "label": "Positive",
                "value": "0"
            }, {
                "label": "Negative",
                "value": "1"
            }]
    },
    "outputPowerUpperLimit": {
        "paramName": "outputPowerUpperLimit",
        "title": "Output Power Upper Limit ",
        "paramDesc": "0~120%",
        "type": "inputNumber",
        "unit": "%",
        "group": "Inverter Settings",
        "register": "58",
        "options": null
    },
    "comAddress": {
        "paramName": "comAddress",
        "title": "Communication Address",
        "paramDesc": "1~32",
        "type": "inputNumber",
        "unit": "",
        "group": "Operation Settings",
        "register": "23",
        "options": null
    },
    "modelSetting": {
        "paramName": "modelSetting",
        "title": "Model Setting",
        "paramDesc": "0~8",
        "type": "inputNumber",
        "unit": "",
        "group": "Advanced Settings",
        "register": "21",
        "options": null
    },
    "normalTimePeriod3StartHour": {
        "paramName": "normalTimePeriod3StartHour",
        "title": "Normal Time Period 3 Start Hour",
        "paramDesc": "0~23",
        "type": "inputNumber",
        "unit": "h",
        "group": "Multistage Power Settings",
        "register": "824",
        "options": null
    },
    "deliveryYear": {
        "paramName": "deliveryYear",
        "title": "Delivery Year",
        "paramDesc": "",
        "type": "inputNumber",
        "unit": "",
        "group": "Advanced Settings",
        "register": "121",
        "options": null
    },
    "monitorParallelJudgementMark": {
        "paramName": "monitorParallelJudgementMark",
        "title": "Monitor Parallel Judgment Mark",
        "paramDesc": "0?single unit. The minimum parallel judgment value is 1; Same value: parallel(data accumulation)",
        "type": "inputNumber",
        "unit": "",
        "group": "Advanced Settings",
        "register": "42",
        "options": null
    },
    "batChargeSmallCurrentBiasFlag": {
        "paramName": "batChargeSmallCurrentBiasFlag",
        "title": "Battery Charging Small Current Positive and Negative Bias Flag",
        "paramDesc": "0~10",
        "type": "dropDown",
        "unit": "",
        "group": "Advanced Settings",
        "register": "110",
        "options": [{
                "label": "Positive",
                "value": "0"
            }, {
                "label": "Negative",
                "value": "1"
            }]
    },
    "maxDcVoltagePv": {
        "paramName": "maxDcVoltagePv",
        "title": "Max PV Voltage",
        "paramDesc": "200~1000V",
        "type": "inputNumber",
        "unit": "V",
        "group": "PV Settings",
        "register": "50",
        "options": null
    },
    "siglePvSwitchToOffgrid": {
        "paramName": "siglePvSwitchToOffgrid",
        "title": "Single PV Switch to Off-Grid",
        "paramDesc": "0~50V for each cell",
        "type": "inputNumber",
        "unit": "V",
        "group": "Battery Settings",
        "register": "161",
        "options": null
    },
    "parallelPhaseSynCompensationCoefficient": {
        "paramName": "parallelPhaseSynCompensationCoefficient",
        "title": "Parallel Phase Syn Compensation Coefficient",
        "paramDesc": "0~1000",
        "type": "inputNumber",
        "unit": "",
        "group": "Advanced Settings",
        "register": "276",
        "options": null
    },
    "minInsulationImpedence": {
        "paramName": "minInsulationImpedence",
        "title": "Minimum Insulation Impedance",
        "paramDesc": "",
        "type": "inputNumber",
        "unit": "K?",
        "group": "Advanced Settings",
        "register": "20",
        "options": null
    }
}