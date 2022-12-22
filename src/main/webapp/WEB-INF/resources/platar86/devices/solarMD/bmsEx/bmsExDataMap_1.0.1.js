/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, hh */


var bmsexDM = {

};
bmsexDM.protRelayState = function (code) {
    switch (code) {
        case 0:
            return "RELAY OPENED";
        case 1:
            return "RELAY CLOSED";
        case 14:
            return "RELAY CLOSED - NORMAL";
        case 0x03:
            return "RELAY CLOSED - ENERGY SAVING MODE";
        case 0x07:
            return "RELAY CLOSED - ENERGY SAVING LIMITED";
        case 0x17:
            return "RELAY CLOSED - ENERGY SAVING UNAVAILABLE";
        case 0x10:
            return "RELAY OPENED - FUSE BURNED";
        case 0x20:
            return "RELAY OPENED - COIL NOT CONNECTED";
        case 0x40:
            return "RELAY OPENED - COIL SHORT/VOLTAGE TOO LOW";
        case 0x50:
            return "RELAY OPENED OVERRIDE OFF ACTIVE";
        case 0x60:
            return "RELAY OFF - MANUAL CONTROL";
        case 0x70:
            return "RELAY OFF - ERROR PENDING";
        case 0x80:
            return "RELAY OPENED ";
        default:
            return "UNKNOWN STATE - " + code;
    }
};

bmsexDM.getProtStateText = function (state) {
    if (state === undefined) {
        return "N/A";
    }
    switch (state) {
        case 0:
            return "Normal";
        case 1:
            return "Sleep High";
        case 2:
            return "Sleep Low";
        case 3:
            return "Awake Low";
        case 4:
            return "Override On";
        case 5:
            return "Override Off";
        case 6:
            return "Emergency Off";
        case 7:
            return "Init";
        case 8:
            return "Awake High";
    }

    return "Unknown: " + state;
};

bmsexDM.loadConfigSet = function (name) {

};

bmsexDM.subModelName = function (id) {
    if (id === undefined) {
        return "UNKNOWN NULL";
    }
    switch (id) {
        case 20205:
        case 407401 & 0xFFFF:
        {
            return 'SS4074-02';
        }
        case 403701:
        case 403701 & 0xFFFF:
        {
            return 'SS4037-02';
        }
    }
    return "UNKNOWN " + id;
};



bmsexDM.protState = function (protRelayCode) {
    if (protRelayCode >= 1 && protRelayCode <= 0x0F) {
        return "ON";
    }
    return "OFF";
};
bmsexDM.protRelayToString = function (code) {
    switch (code) {
        case 0:
            return "RELAY OPENED";
        case 1:
            return "RELAY CLOSED";
        case 0x03:
            return "RELAY CLOSED - ENERGY SAVING MODE";
        case 0x07:
            return "RELAY CLOSED - ENERGY SAVING LIMITED";
        case 0x17:
            return "RELAY CLOSED - ENERGY SAVING UNAVAILABLE";
        case 0x10:
            return "RELAY OPENED - FUSE BURNED";
        case 0x20:
            return "RELAY OPENED - COIL NOT CONNECTED";
        case 0x40:
            return "RELAY OPENED - COIL SHORT/VOLTAGE TOO LOW";
        case 0x50:
            return "RELAY OPENED OVERRIDE OFF ACTIVE";
        case 0x60:
            return "RELAY OFF - MANUAL CONTROL";
        case 0x70:
            return "RELAY OFF - ERROR PENDING";
        case 0x80:
            return "RELAY OPENED ";

        default:
            return "UNKNOWN STATE - " + code;
    }
};

bmsexDM.map_cmMonBalStatusToString = function (code) {
    switch (code) {
        case 0:
            return "DISABLED";
        case 1:
            return "CURRENT LIMIT";
        case 2:
            return "CUTOFF VOLTAGE LIMIT";
        case 3:
            return "TEMPERATURE LIMIT";
        case 4:
            return "ACTIVE";
        case 5:
            return "VB ACTIVE";
        case 6:
            return "VB COMPLETE";
        case 7:
            return "VB OUT_OF_RANGE";
        case 10:
            return "MB TIME ACTIVE";
        case 11:
            return "MB CAP ACTIVE";
        case 12:
            return "MB COMPLETE";
        default:
            return "UNKNOWN BALANCING STATE - " + code;
    }
};
bmsexDM.map_CellChemistryToString = function (code) {
    switch (code) {
        case 0:
            return "LFP-Lithium Iron Phosphate(LiFePO4)";
        case 1:
            return "LCO-Lithium Cobalt Oxide(LiCoO2)";
        case 2:
            return "LMO-Lithium Manganese Oxide(LiMn2O4)";
        case 3:
            return "NMC-Lithium Nickel Manganese Cobalt Oxide(LiNiMnCoO2)";
        case 4:
            return "NCA-Lithium Nickel Cobalt Aluminum Oxide(LiNiCoAlO2)";
        case 5:
            return "LTO-Lithium Titanate(Li2TiO3)";

        default:
            return "UNKNOWN CELL CHEMISTRY CODE: " + code;
    }
};
bmsexDM.map_chDchRegDeratingCauseToString = function (code) {
    switch (code) {
        case 0:
            return "No Limit";
        case 1:
            return "Voltage Limit";
        case 2:
            return "Capacity Limit";
        case 3:
            return "Temperature Limit";
        default:
            return "UNKNOWN CH DSCH DERATING CODE: " + code;
    }
};