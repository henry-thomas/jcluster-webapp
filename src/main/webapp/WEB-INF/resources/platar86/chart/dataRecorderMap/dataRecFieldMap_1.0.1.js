/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by platar86, 2022
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */
//function DataRecordDescriptor() {
//
//}
var dataRecFieldMap2 = 0;

var dataRecFieldMap = {
    modelMap: {
        '23': {
            A: {
                unit: 'A',
                axis: 'currentLVDCA',
                title: 'Current in A',
                ballonText: 'Current: {valueY}A'
            },
            pV: {
                unit: 'V',
                axis: 'lvPackVoltage',
                title: 'Voltage in V',
                ballonText: 'Voltage: {valueY}V'
            },
            cP: {
                unit: '%',
                axis: 'lvCapacityPer',
                title: 'Capacity %',
                ballonText: 'Capacity: {valueY}%'
            },
            cAh: {
                unit: 'Ah',
                axis: 'lvCapacityAh',
                title: 'Capacity in Ah',
                ballonText: 'Capacity: {valueY}Ah'
            },
            t1: {
                unit: ' ',
                axis: 'temperature',
                title: 'Cell Temp',
                ballonText: 'Cell Temp: {valueY}'
            },

            mnC: {
                unit: ' ',
                axis: 'cellNumber',
                title: 'Minimum Cell Idx',
                ballonText: 'Min Cell: {valueY}'
            },
            mxC: {
                unit: ' ',
                axis: 'cellNumber',
                title: 'Maximum Cell Idx',
                ballonText: 'Max Cell: {valueY}'
            },
            mxCV: {
                unit: 'V',
                axis: 'cellVoltage',
                title: 'Maximum cell Voltage in V',
                ballonText: 'Max Cell: {valueY}V'
            },
            mnCV: {
                unit: 'V',
                axis: 'cellVoltage',
                title: 'Minimum cell Voltage in V',
                ballonText: 'Min Cell: {valueY}V'
            }
        },
        '24': {
            mnT: {
                unit: ' ',
                axis: 'minCellTemp',
                title: 'Min Temp',
                ballonText: 'Min Temp: {valueY}'
            },
            mxT: {
                unit: ' ',
                axis: 'maxCellTemp',
                title: 'Max Temp',
                ballonText: 'Max Temp: {valueY}'
            },
            minC: {
                unit: ' ',
                axis: 'minCellNumber',
                title: 'Minimum Cell Idx',
                ballonText: 'Min Cell: {valueY}'
            },
            maxC: {
                unit: ' ',
                axis: 'maxCellNumber',
                title: 'Maximum Cell Idx',
                ballonText: 'Max Cell: {valueY}'
            },
            pcC: {
                unit: 'Ah',
                axis: 'hvCapacityAh',
                title: 'Capacity in Ah',
                ballonText: 'Capacity: {valueY}Ah'
            },
            pcV: {
                unit: 'V',
                axis: 'hvPackVoltage',
                title: 'Voltage in V',
                ballonText: 'Voltage: {valueY}V'
            },
            cA: {
                unit: 'A',
                axis: 'currentA',
                title: 'Current in A',
                ballonText: 'Current: {valueY}A'
            },
            maxCV: {
                unit: 'V',
                axis: 'cellVoltage',
                title: 'Maximum cell Voltage in V',
                ballonText: 'Max Cell: {valueY}V'
            },
            minCV: {
                unit: 'V',
                axis: 'cellVoltage',
                title: 'Minimum cell Voltage in V',
                ballonText: 'Min Cell: {valueY}V'
            },
            mRS: {
                unit: '',
                title: 'Relay State',
                axis: 'bmuH8relayStat',
                ballonText: 'Relay State'
            }
        },
        '822': {
            ph1W: {
                unit: 'W',
                title: 'Power Ph1',
                axis: 'acPowerW',
                ballonText: 'Ph1: {valueY}W '
            },
            ph2W: {
                unit: 'W',
                title: 'Power Ph2',
                axis: 'acPowerW',
                ballonText: 'Ph2: {valueY}W '
            },
            ph3W: {
                unit: 'W',
                title: 'Power Ph3',
                axis: 'acPowerW',
                ballonText: 'Ph3: {valueY}W '
            }
        }
    }
};

(function populateBmsExCells() {
    let dev = dataRecFieldMap.modelMap['23'];
    for (var i = 0; i < 16; i++) {
        dev['c' + i] = {
            unit: 'mV',
            axis: 'cellVoltage_mV',
            title: 'Cell-' + (i + 1) + ' Voltage',
            ballonText: 'Cell' + (i + 1) + ': {valueY}mV'
        };
    }
})();
