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
    getGridState: function (value) {
        if(!value && value !== 0)
            return 'N/A';
        
        switch (value) {
            case 0:
                return 'Without grid';
            case 1:
                return 'With grid';
            default:
                return 'N/A';
        }
    },
    
    getBatteryState: function (value) {
        if(!value && value !== 0)
            return 'N/A';
        
        switch (value) {
            case 0:
                return 'Charging';
            case 1:
                return 'Discharging';
            case 2:
                return 'Non-operating mode';
            default:
                return 'N/A';
        }
    },
    
    getWorkingState: function (value) {
        if(!value && value !== 0)
            return 'N/A';
        
        switch(value) {
            case 0:
                return 'Initial standby';
            case 100:
                return 'ISO detection';
            case 200:
                return 'Start in process';
            case 300:
                return 'Running';
            case 301:
                return 'Alarm running';
            case 302:
                return 'Derating running';
            case 303:
                return 'Hot standby';
            case 400:
                return 'Key stop';
            case 402:
                return 'Fault stop';
            case 403:
                return 'Emergency stop';
            default:
                return 'N/A';
        }
    },
    
    getRunningSate: function (value) {
        if(!value)
            return 'N/A';
        
        switch(value) {
            case 100:
                return 'On-grid mode';
            case 101:
                return 'On-grid constant current';
            case 102:
                return 'On-grid constant voltage';
            case 103:
                return 'On-grid constant power (AC)';
            case 104:
                return 'On-grid constant power (DC)';
            case 200:
                return 'Off-grid mode';
            case 300:
                return 'VSG mode';
            default:
                return 'N/A';
        }
    },
    
    getAlarmRunningState1: function (value) {
        if(!value)
            return 'N/A';

        if ((value & (1 << 0)) > 0) {
            return 'Temperature abnormal alarm';
        }
        if ((value & (1 << 5)) > 0) {
            return 'BMS battery alarm';
        }
        if ((value & (1 << 6)) > 0) {
            return 'Fan abnormal';
        }

        return 'N/A';
    },

    getFaultState1: function (value) {
        if(!value)
            return 'N/A';

        if ((value & (1 << 0)) > 0) {
            return 'Bus undervoltage';
        }
        if ((value & (1 << 1)) > 0) {
            return 'High bus voltage';
        }
        if ((value & (1 << 2)) > 0) {
            return 'AC undervoltage fault';
        }
        if ((value & (1 << 3)) > 0) {
            return 'AC overvoltage fault';
        }
        if ((value & (1 << 4)) > 0) {
            return 'AC underfrequency fault';
        }
        if ((value & (1 << 5)) > 0) {
            return 'AC overfrequency fault';
        }
        if ((value & (1 << 6)) > 0) {
            return 'Relay fault';
        }
        if ((value & (1 << 7)) > 0) {
            return 'Islanding';
        }
        if ((value & (1 << 9)) > 0) {
            return 'Module fault';
        }
        if ((value & (1 << 10)) > 0) {
            return 'Excessively high module temperature';
        }
        if ((value & (1 << 13)) > 0) {
            return 'Excessive leakage current';
        }
        if ((value & (1 << 15)) > 0) {
            return 'Output overload';
        }
        if ((value & (1 << 17)) > 0) {
            return 'Fan fault';
        }
        if ((value & (1 << 20)) > 0) {
            return 'DC overcurrent';
        }
        if ((value & (1 << 21)) > 0) {
            return 'AC instantaneous overcurrent';
        }
        if ((value & (1 << 23)) > 0) {
            return 'Excessively high ambient temperature';
        }
        if ((value & (1 << 24)) > 0) {
            return 'Hardware protection';
        }
        if ((value & (1 << 26)) > 0) {
            return 'Overvoltage protection';
        }
        if ((value & (1 << 27)) > 0) {
            return 'Low voltage protection';
        }
        if ((value & (1 << 30)) > 0) {
            return 'Communication error';
        }

        return 'N/A';
    },

    getFaultState2: function (value) {
        if(!value)
            return 'N/A';

        if ((value & (1 << 0)) > 0) {
            return 'Low system insulation resistance';
        }
        if ((value & (1 << 1)) > 0) {
            return 'AC-side SPD alarm';
        }
        if ((value & (1 << 2)) > 0) {
            return 'Analog bias';
        }
        if ((value & (1 << 3)) > 0) {
            return 'Battery polarity reversed';
        }
        if ((value & (1 << 6)) > 0) {
            return 'Current unbalance fault';
        }
        if ((value & (1 << 7)) > 0) {
            return 'DC contactor fault';
        }
        if ((value & (1 << 8)) > 0) {
            return 'DC-side SPD alarm';
        }
        if ((value & (1 << 9)) > 0) {
            return 'DC soft start fault';
        }
        if ((value & (1 << 10)) > 0) {
            return 'Excessive DC component';
        }
        if ((value & (1 << 12)) > 0) {
            return 'Repeated address code';
        }
        if ((value & (1 << 13)) > 0) {
            return 'Parallel operation communication error';
        }
        if ((value & (1 << 16)) > 0) {
            return 'AC voltage unbalance';
        }
        if ((value & (1 << 17)) > 0) {
            return 'BMS communication error';
        }
        if ((value & (1 << 18)) > 0) {
            return 'BMS and battery fault';
        }
        if ((value & (1 << 20)) > 0) {
            return 'Inverter open-loop self-check fault';
        }
        if ((value & (1 << 26)) > 0) {
            return 'Bus voltage unbalance';
        }
        if ((value & (1 << 27)) > 0) {
            return 'Carrier sync fault';
        }

        return 'N/A';
    }
};
