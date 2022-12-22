/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2022
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */


let paramDesc = {
    "batType": {
        "paramName": "Battery Type",
        "paramDesc": "Select the Battery Chemistry",
        "unit": ""
    },
    "batAbsorptionVoltage": {
        "paramName": "Battery Absorption Voltage",
        "paramDesc": "The level of charge that can be applied without overheating the battery",
        "unit": "V"
    },
    "batFloatVoltage": {
        "paramName": "Battery Float Voltage",
        "paramDesc": "The voltage at which a\r\nbattery is maintained after being\r\nfully charged",
        "unit": "V"
    },
    "batEqualizationVoltage": {
        "paramName": "Battery Equilization Voltage",
        "paramDesc": "The voltage is brought up above typical peak charging voltage well into the gassing stage and maintained for a fixed (but limited) period.",
        "unit": "V"
    },
    "batRatedCapacity": {
        "paramName": "Rated Capacity",
        "paramDesc": "",
        "unit": "Ah"
    },
    "batEqualizationDelay": {
        "paramName": "Equilization Delay",
        "paramDesc": "Days between equilization cycles.",
        "unit": "Days"
    },
    "batEqualizationTime": {
        "paramName": "Equilization Time",
        "paramDesc": "Equilization cycle duration in hours.",
        "unit": "Hours"
    },
    "batTempCompensation": {
        "paramName": "Battery Temp Compensation Coefficient",
        "paramDesc": "The error introduced by a change in temperature",
        "unit": ""
    },
    "batMaxChrgCurrent": {
        "paramName": "Max Battery Charge Current",
        "paramDesc": "",
        "unit": "A"
    },
    "batMaxDischrgCurrent": {
        "paramName": "Max Battery Discharge Current",
        "paramDesc": "",
        "unit": ""
    },
    "batOperMode": {
        "paramName": "Battery Op Mode",
        "paramDesc": "Use capacity (%) or voltage (V) settings for all settings",
        "unit": ""
    },
    "batLitWwakeUp": {
        "paramName": "Active Battery",
        "paramDesc": "Help recover a battery that is 100% discharged by\nslowly changing from the solar array, until the battery reaches a point where it can\nchange normally.",
        "unit": ""
    },
    "batInRes": {
        "paramName": "Battery Internal Resistance",
        "paramDesc": "",
        "unit": "\u2126"
    },
    "batChgEffi": {
        "paramName": "Battery Charge Efficiency",
        "paramDesc": "",
        "unit": "%"
    },
    "batCapShutdown": {
        "paramName": "Shutdown Capacity Level",
        "paramDesc": "",
        "unit": "%"
    },
    "batCapReset": {
        "paramName": "Restart Capacity Level",
        "paramDesc": "",
        "unit": "%"
    },
    "batCapLow": {
        "paramName": "Low Capacity Level",
        "paramDesc": "",
        "unit": "%"
    },
    "batVoltShutdown": {
        "paramName": "Shutdown Voltage Level",
        "paramDesc": "",
        "unit": "V"
    },
    "batVoltRestart": {
        "paramName": "Restart Voltage Level",
        "paramDesc": "",
        "unit": "V"
    },
    "batVoltLowBat": {
        "paramName": "Low Voltage Level",
        "paramDesc": "",
        "unit": "V"
    },
    "genBatChgEnable": {
        "paramName": "Gen Bat Charge Enable",
        "paramDesc": "Uses the GEN input of the system to charge battery bank from an\nattached generator.",
        "unit": ""
    },
    "gridBatChgEnable": {
        "paramName": "Grid Bat Charge Enable",
        "paramDesc": "It indicates that the grid will charge the battery.",
        "unit": ""
    },
    "genMaxOpTime": {
        "paramName": "Gen Max Operation Time",
        "paramDesc": "This indicates the longest time the generator can run in one day.",
        "unit": "h"
    },
    "genCoolTime": {
        "paramName": "Gen Shutdown Delay",
        "paramDesc": "This indicates the delay-time of the generator to shut down after it\nhas reached the running time",
        "unit": "h"
    },
    "genStartBatVoltage": {
        "paramName": "Generator Bat Charge Start Voltage",
        "paramDesc": "",
        "unit": "V"
    },
    "genStartBatCap": {
        "paramName": "Generator Start Bat Capacity",
        "paramDesc": "",
        "unit": "%"
    },
    "genBatChrgCurrent": {
        "paramName": "Gen Bat Charge Current",
        "paramDesc": "",
        "unit": "A"
    },
    "genBatChrgVoltage": {
        "paramName": "Gen Bat Charge Voltage",
        "paramDesc": "",
        "unit": "V"
    },
    "gridChrgStartCap": {
        "paramName": "Grid Start Bat Capacity",
        "paramDesc": "",
        "unit": "%"
    },
    "gridChrgCurrent": {
        "paramName": "Grid Bat Charge Current",
        "paramDesc": "",
        "unit": "A"
    },
    "gridBatChgStartVoltage": {
        "paramName": "Grid Bat Charge Start Voltage",
        "paramDesc": "",
        "unit": "V"
    },
    "gridBatChgStartCap": {
        "paramName": "Grid Bat Charge Start Cap",
        "paramDesc": "",
        "unit": "%"
    },
    "genGridSignalOn": {
        "paramName": "Grid/Gen Signal On",
        "paramDesc": "",
        "unit": ""
    },
    "gridUpperRatedVoltageV": {
        "paramName": "Grid Upper Rated Voltage",
        "paramDesc": "",
        "unit": "V"
    },
    "gridLowerRatedVoltageV": {
        "paramName": "Grid Lower Rated Voltage",
        "paramDesc": "",
        "unit": "V"
    },
    "gridUpperLimitFrequencyHz": {
        "paramName": "Grid Upper Frequency Limit",
        "paramDesc": "",
        "unit": "Hz"
    },
    "gridLowerLimitFrequencyHz": {
        "paramName": "Grid Lower Frequency Limit",
        "paramDesc": "",
        "unit": "Hz"
    },
    "gridUpperLimitCurrentA": {
        "paramName": "Grid Upper Current Limit",
        "paramDesc": "",
        "unit": "A"
    },
    "gridUpperLimitVoltageV": {
        "paramName": "Grid Upper Voltage Limit",
        "paramDesc": "",
        "unit": "V"
    },
    "gridLowerLimitVoltageV": {
        "paramName": "Grid Lower Voltage Limit",
        "paramDesc": "",
        "unit": "V"
    },
    "powerFactorRegulation": {
        "paramName": "Power Factor",
        "paramDesc": "",
        "unit": ""
    },
    "activePowerRegulationPercentP": {
        "paramName": "Active Power Regulation",
        "paramDesc": "",
        "unit": "%"
    },
    "reactivePowerRegulationPercentP": {
        "paramName": "Reactive Power Regulation",
        "paramDesc": "",
        "unit": "%"
    },
    "apparentPowerRegulationPercentP": {
        "paramName": "Apparent Power Regulation",
        "paramDesc": "",
        "unit": "%"
    },
    "antiIslandProt": {
        "paramName": "Anti Islanding Protection",
        "paramDesc": "",
        "unit": ""
    },
    "gridProtVoltHigh": {
        "paramName": "Grid Protection Voltage High",
        "paramDesc": "",
        "unit": "V"
    },
    "gridProtVoltLow": {
        "paramName": "Grid Protection Voltage Low",
        "paramDesc": "",
        "unit": "V"
    },
    "gridProtFreqHigh": {
        "paramName": "Grid Protection Frequency High",
        "paramDesc": "",
        "unit": "Hz"
    },
    "gridProtFreqLow": {
        "paramName": "Grid Protection Frequency Low",
        "paramDesc": "",
        "unit": "Hz"
    },
    "gridCountryStd": {
        "paramName": "Grid Country Standard",
        "paramDesc": "",
        "unit": ""
    },
    "gridFrequency": {
        "paramName": "Grid Frequency",
        "paramDesc": "",
        "unit": "Hz"
    },
    "gridType": {
        "paramName": "Grid Type",
        "paramDesc": "",
        "unit": ""
    },
    "gridPeakShaving": {
        "paramName": "Grid Peak Shaving Power",
        "paramDesc": "",
        "unit": "W"
    },
    "genOnGridInput": {
        "paramName": "Gen on Grid Input",
        "paramDesc": "",
        "unit": ""
    },
    "genPeakShaving": {
        "paramName": "Gen Peak Shaving Power",
        "paramDesc": "",
        "unit": "W"
    },
    "auxPortCtrl": {
        "paramName": "Aux Port Function",
        "paramDesc": "",
        "unit": ""
    },
    "auxLoadOffBatVoltageV": {
        "paramName": "Aux Port Off Bat Voltage",
        "paramDesc": "",
        "unit": "V"
    },
    "auxPortOffBatCapacity": {
        "paramName": "Aux Port Off Bat Capacity",
        "paramDesc": "",
        "unit": "%"
    },
    "auxPortOnBatVoltage": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "auxPortOnBatCapacity": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "loadOutputPFValue": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "smartLoadOpenDelay": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "maxTemperatureDegC": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "unitDebug": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "useBatteryPower": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "screenLock": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "inverterState": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "limiterEnabled": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "extSensorDir": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "gfdiEnable": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "lowVoltageAccrossEnable": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "enableMcuEeprom": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "enableComEeprom": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "powerWhFactor": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "forceGenAsLoad": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "minPvPowerForGenStart": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "gridPhase": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "microInvExpToGridCutoff": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "controlBoardFunction": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "connectionRestoreTime": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "solarArcFaultMode": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "externalRalayBit": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "upsDelayTime": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "chargingVoltage": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "chargeCurrentLimit": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "dischargeCurrentLimit": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "realTimeCapacity": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "realTimeVoltage": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "realTimeCurrent": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "realTimeTemp": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "maxChargeCurrentLimit": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "maxDischargeCurrentLimit": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "liBatTypeProtocol": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "liBatSOH": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "maxPvSell": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "ctRatio": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    },
    "meterCtRatio": {
        "paramName": "",
        "paramDesc": "",
        "unit": ""
    }
};

