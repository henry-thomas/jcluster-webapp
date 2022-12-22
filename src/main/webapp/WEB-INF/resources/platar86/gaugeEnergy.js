/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by platar86, 2019
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 Sout Africa
 *  Phone: 021 555 2181
 *  
 */
/* global AmCharts */

var gaugeEnergy = {

    startRequestTimer: function (timeOut) {
        setInterval(function () {
            console.log('start request timer!');
            energyServiceBcReq();
        }, timeOut);
    },
    gaugeIntervalTimer: {},
    status: {},
    gaugeTimer: {},
    gaugeArr: {},
    onMessage: function (data) {
        var dd = {
            "deviceCommand": "broadcastMessage",
            "deviceSubCommand": "EnergyStorageBroadcastData",
            "deviceGroup": "energyStorage",
            "messageClass": "com.platar86.mypower.logger.subModuleEntity.EnergyStorage",
            "subDevInstrRw": false,
            "subDevRespSuccsess": false,
            "requiredACK": true,
            "ackID": "164",
            "messageList": [{
                    "date": null, "capacity": 15579,
                    "maxCapacity": 72000,
                    "connectedDevices": 3,
                    "onlineDevices": 1,
                    "offlineDevices": 2,
                    "stateOfHealth": 100,
                    "current": -92,
                    "remainingChargeTime": 0,
                    "remainingDischargeTime": 0,
                    "voltage": 52021,
                    "ratedCurrent": 0,
                    "ratedVoltage": 52,
                    "storageName": "bank1"
                }],
            "keepJsonData": true,
            "encodeMessageData": false
        };
//        console.log("data ");
        for (var i = 0; i < data.messageList.length; i++) {
            var storage = data.messageList[i];
            var storageName = storage.storageName;
            var power = ((storage.current / 1000) * (storage.voltage / 1000)).toFixed(3);
            var storageRemainingTime = 0;
            var isCharging = false;
            if (storage.remainingChargeTime > 0) {
                storageRemainingTime = storage.remainingChargeTime;
                isCharging = true;
            } else if (storage.remainingDischargeTime) {
                storageRemainingTime = storage.remainingDischargeTime;
            }

            gaugeEnergy.setGaugeValue('amGauge_' + storageName, storage.capacity, storage.maxCapacity, power, isCharging, storageRemainingTime);
        }
    },
    updateGaugeLevel: function (name) {
        var char = gaugeEnergy.gaugeArr[name];
        if (char !== undefined) {
            var value;
            if (!gaugeEnergy.status[name]) {
                value = 0;
                char.allLabels[1].text = '--%';
                char.allLabels[4].text = '-d --h:--min';
                char.allLabels[2].text = '--- kW';
            } else {

                if (char.futureLevel === undefined) {
                    char.futureLevel = 0;
                }
                if (char.curLevel === undefined) {
                    char.curLevel = 0;
                }
                if (char.curLevel > char.futureLevel && (char.curLevel - char.futureLevel) > 1) {
                    var diff = char.curLevel - char.futureLevel;
                    char.curLevel -= diff / 2;
                } else if (char.curLevel < char.futureLevel && (char.futureLevel - char.curLevel) > 1) {
                    var diff = char.futureLevel - char.curLevel;
                    char.curLevel += diff / 2;
                }

                value = char.curLevel;
                char.dataProvider[0].value1 = value;
                char.dataProvider[0].value2 = 100 - value;

                var color;
                if (value > 45) {
                    color = '#30FF10';
                    char.allLabels[1].y = 125;
                    char.allLabels[1].color = '#d2d2d2';

                } else {
                    char.allLabels[1].y = 55;
                    char.allLabels[1].color = '#7C7C7C';

                    var red = Number(((100 - value) * 2.55).toFixed(0));
                    red = red.toString(16);
                    if (red.length === 1) {
                        red = '0' + red;
                    }
                    var green = Number(((value + 30) * 2.55).toFixed(0));

                    green = green.toString(16);
                    if (green.length === 1) {
                        green = '0' + green;
                    }
                    color = '#' + (red) + (green) + '00';
                }
                char.graphs[0].fillColors = color;
                if (char.displayState !== undefined && char.displayState === "energy") {
                    gaugeEnergy.setCharLabel(char, 1, char.energyDisplay + 'kWh');
                } else {
                    gaugeEnergy.setCharLabel(char, 1, value.toFixed(0) + '%');
                }
            }
            char.validateData();
        }
    },

    createGauge: function (name, timeOut, display) {
//        console.log('call- createGauge name: ' + name + ' capacity: ');
        timeOut = timeOut || 10000;
        gaugeEnergy.gaugeTimer[name] = setTimeout(gaugeEnergy.generateTimerCallbackFn(name), timeOut);
        gaugeEnergy.status[name] = false;
        console.log('create timer: ' + gaugeEnergy.gaugeTimer[name]);
        if (gaugeEnergy.gaugeArr[name] === undefined) {
            var chart = AmCharts.makeChart(name, createGaugeStorageChart());
            chart.timeOut = timeOut;
            chart.displayState = display;
             if (display !== undefined && display === "energy") {
                    chart.allLabels[1].size = 16;
                } else {
                    chart.allLabels[1].size = 24;
                }
            gaugeEnergy.gaugeArr[name] = chart;

            if (gaugeEnergy.gaugeIntervalTimer[name] === undefined) {
                gaugeEnergy.gaugeIntervalTimer[name] = setInterval(gaugeEnergy.generateTimerUpdateFn(name), 500);
            }
        }
    },
    setGaugeValue: function (name, capacity, maxCapacity, power, isCharge, time) {
        var char = gaugeEnergy.gaugeArr[name];
        if (char !== undefined) {
            gaugeEnergy.timerReset(name);
            if (!gaugeEnergy.status[name]) {
                gaugeEnergy.status[name] = true;
            }
            if (!isNaN(capacity) && !isNaN(maxCapacity) && !isNaN(power) && !isNaN(isCharge) && !isNaN(time)) {

                if (capacity !== undefined && maxCapacity !== undefined) {
                    capacity = Number(capacity);
                    maxCapacity = Number(maxCapacity);
                    var value = (capacity / maxCapacity) * 100;
                    char.futureLevel = value;
                    char.energyDisplay = (((capacity / 1000) * 51.2) / 1000).toFixed(2);
                    power = Number(power);
                    //text for charge or discharge

                    if (isCharge) {
                        char.allLabels[2].text = 'Charging ' + Number(power / 1E3).toFixed(2) + ' kW';
                        char.allLabels[3].text = 'Remaining charge time:';
                    } else {
                        char.allLabels[2].text = 'Discharging ' + Number((power * -1) / 1E3).toFixed(2) + ' kW';
                        char.allLabels[3].text = 'Remaining discharge time:';
                    }
                    time = Number(time);
                    if (time === 0) {
                        char.allLabels[4].text = '-d --h:--min';
                    } else {
                        char.allLabels[4].text = gaugeEnergy.getTimeFromSeconds(time);
                    }
                }
            }
        }
    },
    timerReset: function (storageName) {
        var timerID = gaugeEnergy.gaugeTimer[storageName];
//        console.log('TIMER RESET ' + timerID + ' id: ' + storageName);
        window.clearTimeout(timerID);
        gaugeEnergy.gaugeTimer[storageName] = setTimeout(gaugeEnergy.generateTimerCallbackFn(storageName), gaugeEnergy.gaugeArr[storageName].timeOut);
    },
    timerStop: function (storageName) {
        var timerID = gaugeEnergy.gaugeTimer[storageName];
        console.log('TIMER STOP ' + timerID + ' id: ' + storageName);
        window.clearTimeout(timerID);
        gaugeEnergy.status[storageName] = false;
        gaugeEnergy.updateGaugeLevel(storageName);
        //do somthing
    },
    generateTimerCallbackFn: function (gaugeName) {
        var m = gaugeName;
        return function () {
            var id = m;
            gaugeEnergy.timerStop(id);
        };
    },
    generateTimerUpdateFn: function (gaugeName) {
        var m = gaugeName;
        return function () {
            var id = m;
            gaugeEnergy.updateGaugeLevel(id);
        };
    },
    getTimeFromSeconds: function (tSec) {
        if (tSec === 0) {
            return '---';
        }
        var days = parseInt(tSec / (3600 * 24));
        if (days > 0) {
            tSec = tSec - (days * 3600 * 24);
        } else {
            days = '--';
        }
        var hour = parseInt(tSec / (3600));
        if (hour > 0) {
            tSec = tSec - (hour * 3600);
        }
        if (hour < 10) {
            hour = '0' + hour;
        }
        var min = parseInt(tSec / (60));
        if (min < 10) {
            min = '0' + min;
        }
        return days + 'd  ' + hour + 'h:' + min + 'm';
    },
    setCharLabel: function (char, idx, lable) {
        char.allLabels[idx].text = lable;
    }



};
function createGaugeStorageChart() {
    var graph = {
        "type": "serial",
        "categoryField": "category",
        "columnSpacing": 20,
        "columnSpacing3D": 15,
        "columnWidth": 0.57,
        "angle": 25,
        "autoMargins": false,
        "depth3D": 70,
        "marginBottom": 67,
        "marginLeft": 70,
        "marginRight": 13,
        "marginTop": 5,
        "sequencedAnimation": false,
        "backgroundAlpha": 0.64,
        "theme": "light",
        "export": {
            "enabled": false
        },
        "categoryAxis": {
            "axisAlpha": 0,
            "gridAlpha": 0,
            "labelOffset": 40
        },
        "trendLines": [],
        "graphs": [
            {
                "animationPlayed": true,
                "columnWidth": 1,
                "fillAlphas": 0.82,
                "fillColors": "#13B30C",
                "id": "AmGraph-1",
                "lineAlpha": 0.5,
                "lineColor": "#FFFFFF",
                "lineThickness": 3,
                "minDistance": 0,
                "showBalloon": false,
                "showOnAxis": true,
                "topRadius": 1,
                "type": "column",
                "valueField": "value1"
            },
            {
                "columnWidth": 0.99,
                "fillAlphas": 0.5,
                "fillColors": "#cdcdcd",
                "id": "AmGraph-2",
                "lineAlpha": 0.5,
                "lineColor": "#cdcdcd",
                "lineThickness": 2,
                "showBalloon": false,
                "showOnAxis": true,
                "topRadius": 1,
                "type": "column",
                "valueField": "value2"
            }
        ],
        "guides": [],
        "valueAxes": [
            {
                "axisFrequency": 13,
                "axisTitleOffset": 0,
                "id": "ValueAxis-1",
                "stackType": "100%",
                "axisThickness": 0,
                "gridAlpha": 0,
                "labelFrequency": 2,
                "labelsEnabled": false,
                "tickLength": 0,
                "title": ""
            }
        ],
        "allLabels": [
            {
                "align": "center",
                "color": "#8E8E8E",
                "id": "storageName",
                "size": 15,
                "text": "Storage bank 1",
                "x": "0%"
            },
            {
                "align": "center",
                "color": "#CDCDCD",
                "id": "socLevel",
                "size": 15,
                "text": "29%",
                "x": 2,
                "y": "38%"
            },
            {
                "align": "center",
                "bold": true,
                "color": "#7C7C7C",
                "id": "actualPower",
                "size": 12,
                "text": "--- kW",
                "x": "2%",
                "y": "77%"
            },
            {
                "align": "center",
                "color": "#909090",
                "id": "timeRemainLabel",
                "text": "Remaining ---:",
                "y": "85%"
            },
            {
                "align": "center",
                "bold": true,
                "color": "#7C7C7C",
                "id": "remainTime",
                "text": "-d --h:--min",
                "y": "92%"
            }
        ],
        "balloon": {},
        "titles": [],
        "dataProvider": [
            {
                "category": "",
                "value1": "1",
                "value2": "99"
            }
        ]
    };
    return graph;
}
;
gaugeEnergy.startRequestTimer(120 * 1000);