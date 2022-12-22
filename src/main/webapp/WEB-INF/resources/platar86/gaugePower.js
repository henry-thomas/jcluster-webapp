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

var gaugePower = {
    energyStageInterval: 10,
    energyStage: 0,
    isInit: false,
    chartArr: [],
    startRequestTimer: function (timeOut) {
        setInterval(function () {
            console.log('start request timer!');
            powerBcReq();
        }, timeOut);
    },
    gaugeIntervalTimer: {},
    status: {},
    gaugeTimer: {},

    requestResponse: function (data) {
//        console.log(data);
    },

    onDataReceive: function (data) {
        var dd = {
            "deviceCommand": "broadcastMessage",
            "deviceSubCommand": "PowerServiceBroadcastData",
            "deviceGroup": "power",
            "messageClass": "com.platar86.mypower.logger.subModuleEntity.Power",
            "subDevInstrRw": false,
            "subDevRespSuccsess": false,
            "requiredACK": false,
            "messageList": [
                {"createdDate": 1500566573257,
                    "power": 0,
                    "dailyEnergy": 33,
                    "weeklyEnergy": 416,
                    "monthlyEnergy": 546,
                    "yearlyEnergy": 546,
                    "energy": 546,
                    "powerName": "load",
                    "onlineDevices": 0,
                    "offlineDevices": 1,
                    "ratedPower": 0
                }
            ],
            "keepJsonData": true,
            "encodeMessageData": false
        };
//        console.log("dd");

        for (var i = 0; i < data.messageList.length; i++) {
            var p = data.messageList[i];
            p.powerName = 'amGauge_' + p.powerName;
            if (p.onlineDevices === 0) {
                p.power = -1;
            }
            var gauge = gaugePower.chartArr[p.powerName];
            if (gauge !== undefined && gauge.ratedPower !== p.ratedPower) {
//                gaugePower.setGaugeRatedPower(12500, gauge);
                gaugePower.setGaugeRatedPower(p.ratedPower, gauge);
                gaugePower.setPowerAndEnergy(p.powerName, p.dailyEnergy, p.weeklyEnergy, p.monthlyEnergy, p.yearlyEnergy);
            }
            gaugePower.setPower(p.powerName, p.power);
            if (gaugePower.energyStageInterval >= gaugePower.energyStage) {
                gaugePower.energyStage = 0;
                gaugePower.setPowerAndEnergy(p.powerName, p.dailyEnergy, p.weeklyEnergy, p.monthlyEnergy, p.yearlyEnergy);
            } else {
                gaugePower.energyStage++;
            }

        }
    },

    setPowerAndEnergy: function (name, daily, weekly, monthly, yearly) {
//        console.log('name: ' + name + 'daily: ' + daily + ' weekly: ' + weekly + ' monthly: ' + monthly + ' yearly: ' + yearly);

        if (gaugePower.chartArr[name.toString()] !== undefined) {
            var char = gaugePower.chartArr[name];
            if (daily !== undefined) {
                char.allLabels[0].text = 'Daily: ' + (daily ).toFixed(1) + ' kWh';
            }
            if (weekly !== undefined) {
                char.allLabels[1].text = 'Weekly: ' + (weekly ).toFixed(1) + ' kWh';
            }
            if (monthly !== undefined) {
                char.allLabels[2].text = 'Monthly: ' + (monthly ).toFixed(1) + ' kWh';
            }
            if (yearly !== undefined) {
                char.allLabels[3].text = 'Yearly: ' + (yearly ).toFixed(1) + ' kWh';
            }
            gaugePower.chartArr[name].validateNow();
        } else {
            console.log('LOG setPowerAndEnergy -> not found');
        }
    },

    setPower: function (name, power) {
        if (gaugePower.chartArr[name.toString()] !== undefined && !isNaN(power)) {
//            console.log('LOG setPower -> name: ' + name + ' power: ' + power);
            var char = gaugePower.chartArr[name];
            power = Number(power);
            if (power !== undefined) {

                if (power === -1) {
//                    console.log('LOG setPower -> hide power: ' + name + ' power: ' + power);
                    char.arrows[0].borderAlpha = 0;
                    char.arrows[0].alpha = 0;
                } else {
                    char.arrows[0].borderAlpha = 1;
                    char.arrows[0].alpha = 1;
                    char.arrows[0].setValue(power / 1000);
                    char.allLabels[4].text = (power / 1000).toFixed(2) + ' kW';
                }
                char.validateNow();
            }

        } else {
            console.log('LOG setPower -> not found');
        }
    },
    timerReset: function (storageName) {
        var timerID = gaugePower.gaugeTimer[storageName];
//        console.log('TIMER RESET ' + timerID + ' id: ' + storageName);
        clearTimeout(timerID);
        gaugePower.gaugeTimer[storageName] = setTimeout(gaugePower.generateTimerCallbackFn(storageName), gaugePower.gaugeArr[storageName].timeOut);
    },
    timerStop: function (storageName) {
        var timerID = gaugePower.gaugeTimer[storageName];
        console.log('TIMER STOP ' + timerID + ' id: ' + storageName);
        clearTimeout(timerID);
        gaugePower.status[storageName] = false;
        gaugePower.updateGaugeLevel(storageName);
        //do somthing
    },
    generateTimerCallbackFn: function (gaugeName) {
        var m = gaugeName;
        return function () {
            var id = m;
            gaugePower.timerStop(id);
        };
    },
    generateTimerUpdateFn: function (gaugeName) {
        var m = gaugeName;
        return function () {
            var id = m;
            gaugePower.updateGaugeLevel(id);
        };
    },

    setGaugeRatedPower: function (ratedPower, gauge) {
        gauge.ratedPower = ratedPower;
        var rPower = parseInt(Number(ratedPower) / 1000);
        var d = parseInt(rPower / 5);
        if (d === 0) {
            d = 1;
        }
        var rPowerMax = rPower + d;
        gauge.axes[0].endValue = rPowerMax;
        gauge.axes[0].bands[0].startValue = 0;
        gauge.axes[0].bands[0].endValue = rPower;
        gauge.axes[0].bands[1].startValue = rPower;
        gauge.axes[0].bands[1].endValue = rPowerMax;

        gauge.axes[0].valueInterval = d;
        gauge.axes[0].minorTickInterval = d / 2;

    },
    createGauge: function (name, displayName, ratedPower) {
//        console.log('call- createGauge name: ' + name + ' displayName: ' + displayName + ' ratedPower: ' + ratedPower);
        var rPower = 6;
        if (ratedPower !== undefined) {
            rPower = Number(ratedPower) / 1000;
        }
        var rPowerMax = rPower + 1;

        if (gaugePower.chartArr[name] === undefined) {
            var gauge =
                    {
                        "type": "gauge",
                        "startDuration": 1.0,
                        "startEffect": "easeOutSine",
                        "autoDisplay": true,
                        "color": "#555555",
                        "handDrawThickness": 0,
                        "pathToImages": "",
                        "theme": "default",
                        "arrows": [
                            {
                                "axis": "GaugeAxis-1",
                                "borderAlpha": 0,
                                "id": "GaugeArrow-1",
                                "innerRadius": "45%",
                                "nailBorderThickness": 0,
                                "nailRadius": 0,
                                "radius": "83%",
                                "startWidth": 6,
                                "color": "#555555",
                                "value": 0
                            }
                        ],
                        "axes": [
                            {
                                "axisColor": "#555555",
                                "bandGradientRatio": [],
                                "bottomText": "",
                                "bottomTextBold": false,
                                "bottomTextYOffset": -55,
                                "endAngle": 100,
                                "endValue": 6,
                                "id": "GaugeAxis-1",
                                "labelOffset": 5,
                                "minorTickInterval": 0.5,
                                "minorTickLength": 8,
                                "radius": "105%",
                                "startAngle": -100,
                                "topText": "",
                                "valueInterval": 1,
                                "bands": [
                                    {
                                        "alpha": 1,
                                        "balloonText": "",
                                        "color": "#00CC00",
                                        "endValue": 5,
                                        "gradientRatio": [],
                                        "id": "GaugeBand-1",
                                        "startValue": 0
                                    },
                                    {
                                        "color": "#ea3838",
                                        "endValue": 6,
                                        "id": "GaugeBand-3",
                                        "startValue": 5
                                    }
                                ]
                            }
                        ],
                        "allLabels": [
                            {
                                "align": "center",
                                "bold": true,
                                "id": "Label-1",
                                "tabIndex": 1,
                                "text": "Daily : 0kWh",
                                "y": "70%"
                            },
                            {
                                "align": "center",
                                "bold": true,
                                "id": "Label-2",
                                "text": "Weekly : 0kWh",
                                "y": "76%"
                            },
                            {
                                "align": "center",
                                "bold": true,
                                "id": "Label-3",
                                "text": "Monthly : 0kWh",
                                "y": "82%"
                            },
                            {
                                "align": "center",
                                "bold": true,
                                "id": "Label-4",
                                "text": "Yearly : 0kWh",
                                "y": "88%"
                            },
                            {
                                "align": "center",
                                "bold": true,
                                "id": "Label-6",
                                "size": 12,
                                "text": "-.-- kW",
                                "y": "58%"
                            }
                        ],
                        "balloon": {
                            "animationDuration": 0.14,
                            "borderThickness": 0,
                            "fadeOutDuration": 0.26,
                            "fontSize": 0,
                            "horizontalPadding": 0,
                            "showBullet": true
                        },
                        "titles": [
                            {
                                "id": "Title-1",
                                "size": 15,
                                "text": "---"
                            }
                        ]
                    };

            var chart = AmCharts.makeChart(name, gauge);
            if (displayName !== undefined) {
//                gauge.axes[0].topText = displayName;
                gauge.titles[0].text = 'Power ' + displayName;
            }
            gauge.axes[0].endValue = rPowerMax;
            gauge.axes[0].bands[0].startValue = 0;
            gauge.axes[0].bands[0].endValue = rPower;
            gauge.axes[0].bands[1].startValue = rPower;
            gauge.axes[0].bands[1].endValue = rPowerMax;

//            gaugePower.chartArr[name].axes[0].topText = displayName;
            gaugePower.chartArr[name] = chart;
//            console.log('create chart: ' + name + " displayName: " + displayName);
        } else {
//            console.log('Chart already exist: ' + name);
        }
    }

};
gaugePower.startRequestTimer(120 * 1000);