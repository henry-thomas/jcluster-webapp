/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by brais, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */

var sgscst = {
    getOutputType: function (value) {
        switch (value) {
            case 0:
                return '3P4L';
            case 1:
                return '3P3L';
            default:
                return 'N/A';
        }
    },
    getChargeDischargeState: function (value) {
        switch (value) {
            case 0:
                return 'Other';
            case 1:
                return 'Charging';
            case 2:
                return 'Discharging';
            default:
                return 'N/A';
        }
    },
    getGridOffGridMode: function (value) {
        switch (value) {
            case 0:
                return 'Grid mode';
            case 1:
                return 'Off-grid mode';
            default:
                return 'N/A';
        }
    },
    getActivePassiveMode: function (value) {
        switch (value) {
            case 0:
                return 'Active mode';
            case 1:
                return 'Passive mode';
            default:
                return 'N/A';
        }
    },
    getOffGridMasterSlaveFlag: function (value) {
        switch (value) {
            case 0:
                return 'Invalid';
            case 1:
                return 'Master';
            case 2:
                return 'Slave';
            default:
                return 'N/A';
        }
    },
    getLowInsulationResistance: function (value) {
        switch (value) {
            case 0:
                return 'Normal';
            case 1:
                return 'Warning';
            default:
                return 'N/A';
        }
    },
    getCarrierWaveSyncMasterSlave: function (value) {
        switch (value) {
            case 0:
                return 'Master';
            case 1:
                return 'Slave';
            default:
                return 'N/A';
        }
    },
    getDeviceState: function (value) {
        if(!value)
            return 'N/A';

        if ((value & (1 << 0)) > 0) {
            return 'Initialization';
        }
        if ((value & (1 << 1)) > 0) {
            return 'Emergency stop';
        }
        if ((value & (1 << 2)) > 0) {
            return 'Standby';
        }
        if ((value & (1 << 3)) > 0) {
            return 'Constant current charge';
        }
        if ((value & (1 << 4)) > 0) {
            return 'Constant voltage charge';
        }
        if ((value & (1 << 5)) > 0) {
            return 'Constant power charge (DC)';
        }
        if ((value & (1 << 6)) > 0) {
            return 'Constant power charge (AC)';
        }
        if ((value & (1 << 8)) > 0) {
            return 'Constant current discharge';
        }
        if ((value & (1 << 9)) > 0) {
            return 'Limit voltage discharge';
        }
        if ((value & (1 << 10)) > 0) {
            return 'Constant power discharge (DC)';
        }
        if ((value & (1 << 11)) > 0) {
            return 'Constant power discharge (AC)';
        }
        if ((value & (1 << 13)) > 0) {
            return 'Independent inverter';
        }
        if ((value & (1 << 16)) > 0) {
            return 'Fault';
        }
        if ((value & (1 << 17)) > 0) {
            return 'Stop';
        }

        return 'N/A';
    },
    
    getFaultState1: function (value) {
        if(!value)
            return 'N/A';

        if ((value & (1 << 0)) > 0) {
            return 'Vdc high';
        }
        if ((value & (1 << 1)) > 0) {
            return 'Vdc low';
        }
        if ((value & (1 << 2)) > 0) {
            return 'Idc high';
        }
        if ((value & (1 << 3)) > 0) {
            return 'Vac high';
        }
        if ((value & (1 << 4)) > 0) {
            return 'Vac low';
        }
        if ((value & (1 << 5)) > 0) {
            return 'Frequency high';
        }
        if ((value & (1 << 6)) > 0) {
            return 'Frequency low';
        }
        if ((value & (1 << 7)) > 0) {
            return 'Iac high';
        }
        if ((value & (1 << 8)) > 0) {
            return 'Iac leak-pro';
        }
        if ((value & (1 << 9)) > 0) {
            return 'Island';
        }
        if ((value & (1 << 10)) > 0) {
            return 'Phase fault';
        }
        if ((value & (1 << 12)) > 0) {
            return 'Vac unbalanced';
        }
        if ((value & (1 << 14)) > 0) {
            return 'Ambient OT';
        }
        if ((value & (1 << 15)) > 0) {
            return 'PM A OT';
        }
        if ((value & (1 << 16)) > 0) {
            return 'PM B OT';
        }
        if ((value & (1 << 17)) > 0) {
            return 'PM C OT';
        }
        if ((value & (1 << 18)) > 0) {
            return 'Trans temp high';
        }
        if ((value & (1 << 19)) > 0) {
            return 'Reactor temp high';
        }
        if ((value & (1 << 21)) > 0) {
            return 'PM fault';
        }
        if ((value & (1 << 22)) > 0) {
            return 'Fan fault';
        }
        if ((value & (1 << 24)) > 0) {
            return 'AC main contactor fault';
        }
        if ((value & (1 << 25)) > 0) {
            return 'DC main contactor fault';
        }
        if ((value & (1 << 26)) > 0) {
            return 'Phase A current sample fault';
        }
        if ((value & (1 << 27)) > 0) {
            return 'Phase B current sample fault';
        }
        if ((value & (1 << 28)) > 0) {
            return 'Phase C current sample fault';
        }

        return 'N/A';
    },
    getFaultState2: function (value) {
        if (!value)
            return 'N/A';

        if ((value & (1 << 7)) > 0) {
            return 'AC circuit fault';
        }
        if ((value & (1 << 8)) > 0) {
            return 'AC contactor off';
        }
        if ((value & (1 << 9)) > 0) {
            return 'Battery fault';
        }
        if ((value & (1 << 10)) > 0) {
            return 'DSP comm fault';
        }
        if ((value & (1 << 11)) > 0) {
            return 'BMS comm fault';
        }
        if ((value & (1 << 12)) > 0) {
            return 'PC comm fault';
        }
        if ((value & (1 << 18)) > 0) {
            return 'AC PD fault';
        }
        if ((value & (1 << 19)) > 0) {
            return 'DC input flt';
        }
        if ((value & (1 << 20)) > 0) {
            return 'Detect fuse fault';
        }
        if ((value & (1 << 21)) > 0) {
            return 'Polarity reverse';
        }

        return 'N/A';
    },
    getAlarmState: function (value) {
        if (!value)
            return 'N/A';

        if ((value & (1 << 0)) > 0) {
            return 'RISO low';
        }
        if ((value & (1 << 1)) > 0) {
            return 'Charge full';
        }
        if ((value & (1 << 2)) > 0) {
            return 'Discharge empty';
        }

        return 'N/A';
    }
};
