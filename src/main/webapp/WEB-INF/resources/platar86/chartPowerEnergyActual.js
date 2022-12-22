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
/* global moment, PF, AmCharts */

var ac = {
    init: false,
    autoZoom: 0,
    obj: {},
    zoomChange: function () {
        if (pfUtil.getInputSwitch('zoomControl')) {
            ac.autoZoom = 0;
        } else {
            ac.autoZoom = 1;
        }
    },
    onNewDataReceive: function (dd) {
        //dg.addPowerData(data.messageList);
        if (!ac.init) {
            ac.init = true;
            ac.setNoDataLabel(false);
            PF('chartBlockUI').hide();
        }

        var obj = ac.obj;
        obj.date = new Date();
        for (var i = 0; i < dd.messageList.length; i++) {
            var pName = dd.messageList[i].powerName;
            obj[pName ] = ((dd.messageList[i].power || 0.01) / 1000).toFixed(2);
            obj[pName + '_energy'] = dd.messageList[i].power;
            obj[pName + '_monthlyEnergy'] = ((dd.messageList[i].monthlyEnergy || 0.01) / 1000).toFixed(2);
            obj[pName + '_yearlyEnergy'] = ((dd.messageList[i].yearlyEnergy || 0.01) / 1000).toFixed(2);
            obj[pName + '_weeklyEnergy'] = ((dd.messageList[i].weeklyEnergy || 0.01) / 1000).toFixed(2);
            obj[pName + '_dailyEnergy'] = ((dd.messageList[i].dailyEnergy || 0.01) / 1000).toFixed(2);
        }
        ac.updateNewValToChart();
    },
    onNewDataReceiveStorage: function (dd) {
        //dg.addPowerData(data.messageList);
        if (!ac.init) {
            ac.init = true;
            ac.setNoDataLabel(false);
            PF('chartBlockUI').hide();
        }

        var neWData = ac.obj;
//        var neWData = Object.assign({}, ac.obj);
        neWData.date = new Date();
        for (var i = 0; i < dd.messageList.length; i++) {
            var data = dd.messageList[i];
//      
            var voltage = 0;
            if (data.voltage > 0) {
                voltage = data.voltage / 1000;
            }
            var current = 0;
            if (data.current > 0) {
                current = data.current / 1000;
            }
            var cap = 0;
            if (data.capacity > 0) {
                cap = data.capacity / 1000;
            }
            var maxCap = 0;
            if (data.maxCapacity > 0) {
                maxCap = data.maxCapacity / 1000;
            }

            if (cap > 0 && maxCap > 0 && maxCap > cap) {
                neWData[data.storageName] = ((cap / maxCap) * 100).toFixed(2);
            } else {
                neWData[data.storageName] = 0;
            }
            if (cap > 0 && voltage > 0) {
                neWData[data.storageName + '_capEnergy'] = ((cap * voltage) / 1000).toFixed(2);
            } else {
                neWData[data.storageName + '_capEnergy'] = 0;
            }

            neWData[data.storageName + '_current'] = (current).toFixed(2);
            neWData[data.storageName + '_voltage'] = (voltage).toFixed(3);
            neWData[data.storageName + '_capacityAH'] = (cap).toFixed(2);
//
//            var pName = dd.messageList[i].powerName;
//            data[pName + '-daily'] = dd.messageList[i].dailyEnergy.toFixed(2);
//            data[pName] = (dd.messageList[i].power / 1000).toFixed(2);
//
//            data[pName ] = ((dd.messageList[i].power || 0.01) / 1000).toFixed(2);
//           data[pName  + '_energy'] = dd.messageList[i].power;
//            data[pName  + '_monthlyEnergy'] = ((dd.messageList[i].monthlyEnergy || 0.01) / 1000).toFixed(2);
//           data[pName  + '_yearlyEnergy'] = ((dd.messageList[i].yearlyEnergy || 0.01) / 1000).toFixed(2);
//           data[pName  + '_weeklyEnergy'] = ((dd.messageList[i].weeklyEnergy || 0.01) / 1000).toFixed(2);
//            data[pName  + '_dailyEnergy'] = ((dd.messageList[i].dailyEnergy || 0.01) / 1000).toFixed(2);
//            

        }
        ac.updateNewValToChart();
    },
    updateNewValToChart: function () {
        ac.powerData.push(Object.assign({}, ac.obj));
        acChart.validateData(ac.autoZoom);
    },
    buffPowerData: {},
    powerData: [],
    setNoDataLabel: function (show) {
        if (show) {
            acChart.allLabels[0].text = "No data for the selected period.";
        } else {
            acChart.allLabels[0].text = "";
        }
    }
};
var acChart = AmCharts.makeChart("chartDaylyPower", {
    type: "serial",
    "color": "#555555",
    "categoryField": "date",
    "accessibleTitle": "dailyChart",
    "dataDateFormat": [
        "YYYY-MM-DD HH:NN:SS",
        "YYYY-MM-DD HH:NN"
    ],
    "startDuration": 1,
    "path": "/resources/amCharts",
    "libs": {"path": "/resources/amCharts/plugins/export"},
    "pathToImages": "/resources/amCharts/images/",
    "categoryAxis": {
        "equalSpacing": false,
        "minPeriod": "ss",
        "parseDates": true
    },
    "chartCursor": {
        "enabled": true,
        "categoryBalloonDateFormat": "YYYY-MM-DD JJ:NN:SS"
    },
    "chartScrollbar": {
        "enabled": true,
        "graph": "pv"
    },
    "trendLines": [],
    graphs: acCtrl.graphArrPlain,
    "allLabels": [
        {
            "align": "center",
            "id": "Label-1",
            "size": 29,
            "text": "No data for selected period!",
            "x": "0%",
            "y": "50%"
        }
    ],
    "valueAxes": [
        {
            "id": "ValueAxis-1",
            "title": "Power in kW"
        },
        {
            "id": "ValueAxis-Capacity",
            "maximum": 100,
            "minimum": 0,
            "position": "right",
            "precision": 0,
            "unit": "%",
            "title": "",
            "titleBold": false,
            "titleColor": "#555555",
            "titleRotation": 0
        }
    ],
    "balloon": {},
    "legend": {
        "enabled": true,
        valueText: "[[value]] kW"
    },
    "titles": [
        {
            "id": "Title-1",
            "size": 15,
            "text": "Live data"
        }
    ],
    "dataProvider": ac.powerData,
    "export": {
        "enabled": true
    },
    "responsive": {
        "enabled": true,
        "rules": [
            // at 400px wide, we hide legend
            {
                "maxWidth": 400,
                "overrides": {
                    "marginTop": 0,
                    "legend": {
                        align: 'center',
                        "labelText": "",
                        "valueText": "",
                        "fontSize": 10
                    },
                    "titles": [
                        {
                            "size": 12
                        }
                    ],
                    "valueAxes": {
                        "inside": true,
                        "dashLength": 10,
                        "fontSize": 7,
                        "tickLength": 3,
                        "titleFontSize": 8,
                        "gridAlpha": 0
                    },
                    "categoryAxis": {
                        "gridAlpha": 0
                    }
                }
            },
            {
                "maxWidth": 200,
                "overrides": {
                    "valueAxes": {
                        "labelsEnabled": false
                    }
                }
            }
        ]
    }
});
$(document).ready(function () {
    powerBcReq();
    setInterval(powerBcReq, 30 * 1000);
});