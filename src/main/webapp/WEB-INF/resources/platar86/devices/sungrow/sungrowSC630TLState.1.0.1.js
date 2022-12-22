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
    getAcCircuitBreakerState: function (value) {
        return sgscst.getNodeState(value, 0);
    },
    getAcMainContactorState: function (value) {
        return sgscst.getNodeState(value, 1);
    },
    getDcSwitchState: function (value) {
        return sgscst.getNodeState(value, 2);
    },
    getDcFuseState1: function (value) {
        return sgscst.getNodeState(value, 6);
    },
    getDcFuseState2: function (value) {
        return sgscst.getNodeState(value, 7);
    },
    getNodeState: function (value, bit) {
        if(!value)
            return 'N/A';
        return (value & (1 << bit)) > 0 ? 'Connected' : 'Disconnected';
    },
    getChargeDischargeState: function (value) {
        if(!value && value !== 0)
            return 'N/A';
        
        switch (value) {
            case 0:
                return 'Charging';
            case 1:
                return 'Discharging';
            case 2:
                return 'Non-working mode';
            default:
                return 'N/A';
        }
    },
    getAlarmState1: function (value) {
        if(!value)
            return 'N/A';

        if ((value & (1 << 0)) > 0) {
            return 'Temperature abnormal alarm';
        }
        if ((value & (1 << 2)) > 0) {
            return 'GFRT running';
        }
        if ((value & (1 << 4)) > 0) {
            return 'DC fuse abnormal';
        }
        if ((value & (1 << 5)) > 0) {
            return 'BMS battery alarm';
        }
        if ((value & (1 << 6)) > 0) {
            return 'DC sensor abnormal';
        }
        if ((value & (1 << 9)) > 0) {
            return 'Insufficient charge condition';
        }
        if ((value & (1 << 10)) > 0) {
            return 'Insufficient discharge condition';
        }
        if ((value & (1 << 12)) > 0) {
            return 'DC switch abnormal';
        }
        if ((value & (1 << 13)) > 0) {
            return 'Fan abnormal';
        }

        return 'N/A';
    },

    getAlarmState2: function (value) {
        if(!value)
            return 'N/A';

        if ((value & (1 << 0)) > 0) {
            return 'Tributary board communication error';
        }
        if ((value & (1 << 1)) > 0) {
            return 'AC switch abnormal';
        }
        if ((value & (1 << 3)) > 0) {
            return 'AC main contactor abnormal';
        }

        return 'N/A';
    },

    getFaultState1: function (value) {
        if(!value)
            return 'N/A';

        if ((value & (1 << 0)) > 0) {
            return 'DC undervoltage';
        }
        if ((value & (1 << 1)) > 0) {
            return 'DC overvoltage';
        }
        if ((value & (1 << 2)) > 0) {
            return 'AC undervoltage';
        }
        if ((value & (1 << 3)) > 0) {
            return 'AC overvoltage';
        }
        if ((value & (1 << 4)) > 0) {
            return 'AC underfrequency';
        }
        if ((value & (1 << 5)) > 0) {
            return 'AC overfrequency';
        }
        if ((value & (1 << 6)) > 0) {
            return 'AC contactor fault';
        }
        if ((value & (1 << 7)) > 0) {
            return 'Islanding protection';
        }
        if ((value & (1 << 9)) > 0) {
            return 'PDP protection';
        }
        if ((value & (1 << 10)) > 0) {
            return 'Module overtemperature';
        }
        if ((value & (1 << 11)) > 0) {
            return 'Reactor overtemperature';
        }
        if ((value & (1 << 12)) > 0) {
            return 'Transformer overtemperature';
        }
        if ((value & (1 << 13)) > 0) {
            return 'Leakage current protection';
        }
        if ((value & (1 << 15)) > 0) {
            return 'Overload protection';
        }
        if ((value & (1 << 17)) > 0) {
            return 'Fan fault';
        }
        if ((value & (1 << 18)) > 0) {
            return 'DC fuse fault';
        }
        if ((value & (1 << 20)) > 0) {
            return 'DC overcurrent';
        }
        if ((value & (1 << 21)) > 0) {
            return 'AC overcurrent';
        }
        if ((value & (1 << 23)) > 0) {
            return 'Ambient temperature abnormal';
        }
        if ((value & (1 << 24)) > 0) {
            return 'Hardware fault';
        }

        return 'N/A';
    },

    getFaultState2: function (value) {
        if(!value)
            return 'N/A';

        if ((value & (1 << 0)) > 0) {
            return 'Insulation impedance';
        }
        if ((value & (1 << 1)) > 0) {
            return 'AC SPD fault';
        }
        if ((value & (1 << 2)) > 0) {
            return 'Sampling fault';
        }
        if ((value & (1 << 3)) > 0) {
            return 'Battery polarity reversed';
        }
        if ((value & (1 << 5)) > 0) {
            return 'Measuring board communication error';
        }
        if ((value & (1 << 6)) > 0) {
            return 'AC current unbalance 1';
        }
        if ((value & (1 << 7)) > 0) {
            return 'Host fault';
        }
        if ((value & (1 << 8)) > 0) {
            return 'DC SPD fault';
        }
        if ((value & (1 << 9)) > 0) {
            return 'DC soft start fault';
        }
        if ((value & (1 << 10)) > 0) {
            return 'DC injection abnormal';
        }
        if ((value & (1 << 11)) > 0) {
            return 'DC switch fault';
        }
        if ((value & (1 << 12)) > 0) {
            return 'Device code repeat fault';
        }
        if ((value & (1 << 13)) > 0) {
            return 'Parallel operation communication fault';
        }
        if ((value & (1 << 14)) > 0) {
            return 'Control cabinet temperature abnormal';
        }
        if ((value & (1 << 16)) > 0) {
            return 'AC voltage unbalance';
        }
        if ((value & (1 << 17)) > 0) {
            return 'Battery communication error';
        }
        if ((value & (1 << 18)) > 0) {
            return 'BMS battery fault';
        }
        if ((value & (1 << 19)) > 0) {
            return 'AC switch fault';
        }
        if ((value & (1 << 20)) > 0) {
            return 'AC soft start fault';
        }
        if ((value & (1 << 21)) > 0) {
            return 'DC voltage sampling fault';
        }
        if ((value & (1 << 23)) > 0) {
            return 'AC current unbalance 2';
        }
        if ((value & (1 << 24)) > 0) {
            return 'AC current unbalance 3';
        }
        if ((value & (1 << 25)) > 0) {
            return 'Drive board fault';
        }
        if ((value & (1 << 26)) > 0) {
            return 'Neutral point potential shift';
        }
        if ((value & (1 << 27)) > 0) {
            return 'Carrier synchronization fault';
        }

        return 'N/A';
    },
    getWorkingState: function (value) {
        if(!value)
            return 'N/A';

        if ((value & (1 << 0)) > 0) {
            return 'Running';
        }
        if ((value & (1 << 1)) > 0) {
            return 'Stop';
        }
        if ((value & (1 << 2)) > 0) {
            return 'Reserved';
        }
        if ((value & (1 << 3)) > 0) {
            return 'Key stop';
        }
        if ((value & (1 << 4)) > 0) {
            return 'Standby';
        }
        if ((value & (1 << 5)) > 0) {
            return 'Emergency stop';
        }
        if ((value & (1 << 6)) > 0) {
            return 'Starting';
        }
        if ((value & (1 << 7)) > 0) {
            return 'Stopping';
        }
        if ((value & (1 << 8)) > 0) {
            return 'Low insulation impedance';
        }
        if ((value & (1 << 9)) > 0) {
            return 'Fault stop';
        }
        if ((value & (1 << 10)) > 0) {
            return 'Alarm running';
        }
        if ((value & (1 << 11)) > 0) {
            return 'Derating running';
        }
        if ((value & (1 << 15)) > 0) {
            return 'Communication error';
        }
        
        return 'N/A';
    },
    
    getWorkingMode: function (value) {
        if(!value)
            return 'N/A';
        
        if ((value & (1 << 0)) > 0) {
            return 'On-grid constant current';
        }
        if ((value & (1 << 1)) > 0) {
            return 'On-grid constant voltage';
        }
        if ((value & (1 << 2)) > 0) {
            return 'On-grid constant power (AC)';
        }
        if ((value & (1 << 3)) > 0) {
            return 'On-grid constant power (DC)';
        }
        if ((value & (1 << 9)) > 0) {
            return 'On-grid mode';
        }
        if ((value & (1 << 10)) > 0) {
            return 'Off-grid mode';
        }
        if ((value & (1 << 11)) > 0) {
            return 'VSG mode';
        }
        
        return 'N/A';
    }
};
