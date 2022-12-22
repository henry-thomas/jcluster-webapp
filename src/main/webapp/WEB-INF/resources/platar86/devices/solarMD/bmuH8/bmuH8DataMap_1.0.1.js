var bmuH8DataMap = {
    cellChemistryToString: function (code) {
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
    },
    clusterComStat: function (code) {
        switch (code) {
            case 0:
                return 'Disconnected';
            case 1:
                return 'Autoconfiguration';
            case 2:
                return 'Online';
            case 3:
                return 'Duplicate Serial Number';

            default:
                return 'clusterComStat Unknown[' + code + ']';
        }
    },
    clusterComBus: function (code) {
        switch (code) {
            case 0:
                return 'Disconnected';
            case 2:
                return 'Connected';
            default:
                return 'clusterComBus Unknown[' + code + ']';
        }
    },
    clusMasterSlaveRole: function (code) {
        switch (code) {
            case 0:
                return 'Unknown';
            case 1:
                return 'Master';
            case 2:
                return 'Slave';
            default:
                return 'clusMasterSlaveRole Unknown[' + code + ']';
        }
    },
    clusMasterSerial: function (code) {
        switch (code) {
            case 0:
                return 'Self';
            case - 1:
                return 'Unknown';
            default:
                return code;
        }
    }
};