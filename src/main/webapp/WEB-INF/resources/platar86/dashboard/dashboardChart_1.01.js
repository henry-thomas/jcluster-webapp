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

/* global moment, PF, AmCharts, graphManager, mainUtils, axAi, devManager, dashMan */


devTempData = {};
// Required flag for switching between the Gauges Dashboard or the Main Dashboard and the Chart Dashboard
devTempData.dSwitch = {
    state: 1,
    init: false
};
devTempData.animateFadeEffect = function (d) {
    if (this.dSwitch.state === 1) {
        this.dSwitch.state = 2;
        document.querySelector('.dashboardWraper').classList.add('dashboardWraperChart');
        document.querySelector('.dashboardWraper').classList.remove('dashboardWraperAnim');

        mainUtils.animateForwardCSS(d, 'fadeOutLeft', false); // '.mainDashboardAnim'
        mainUtils.animateForwardCSS('.mainDashboardChart', 'fadeInRight', false).style.display = 'block';
    } else {
        document.querySelector('.dashboardWraper').classList.add('dashboardWraperAnim');
        document.querySelector('.dashboardWraper').classList.remove('dashboardWraperChart');

        mainUtils.animateForwardCSS('.mainDashboardChart', 'fadeOutRight', false);//.style.display = 'none';
        mainUtils.animateForwardCSS(d, 'fadeInLeft', false); // '.mainDashboardAnim'
        this.dSwitch.state = 1;
    }
};
devTempData.chartData = [];
devTempData.powers = {};
devTempData.chartDataTIdx = 0;
devTempData.sumValues = false;
devTempData.showSumValues = function (t) {
    devTempData.sumValues = t.checked;
    devTempData.chartData.length = 0;
    for (var item in devTempData.rawData) {
        devTempData.updateChartData(devTempData.rawData[item]);
    }
    devTempData.validateChartData();
};
devTempData.chartOnChazoomChange = function (t) {
    if (devTempData.chart.zoomOutOnDataUpdate === true) {
        devTempData.chart.zoomOutOnDataUpdate = false;
    } else {
        devTempData.chart.zoomOutOnDataUpdate = true;
    }
};
devTempData.pusDataInArr = function (cbData, power, name, color) {
    if (power.dataAvailable) {
        if (devTempData.powers[power.typeName] === undefined) {
            devTempData.powers[power.typeName] = true;
            devTempData.chart.addGraph(devTempData.getChartGraphObj(power));
        }
        cbData[power.typeName + "_Power"] = Number((power.sumData.powerW / 1000).toFixed(2));
    }
};
devTempData.getChartGraphObj = function (power) {
    var graph = {
        "bullet": "none",
        "id": power.typeName,
        "valueField": power.typeName + "_Power",
        "type": "smoothedLine",
        "valueAxis": "powerAcW"
    };
    switch (power.typeName) {
        case 'CONSUMERS':
            {
                graph.title = "load";
                graph.lineColor = "blue";
            }
            break;
        case 'GRID IN':
            {
                graph.title = "Grid To";
//                graph.lineColor = "blue";
            }
            break;
        case 'GRID OUT':
            {
                graph.title = "Grid";
                graph.lineColor = "red";
            }
            break;
        case 'OTHER':
            {
                graph.title = "Other";
                graph.lineColor = "black";
            }
            break;
        case 'PV':
            {
                graph.title = "PV";
                graph.lineColor = "green";
            }
            break;
        case 'STORAGE CHARGE':
            {
                graph.title = "Bat Charge";
                graph.lineColor = "brown";
            }
            break;
        case 'STORAGE DISCHARGE':
            {
                graph.title = "Bat Discharge";
                graph.lineColor = "yellow";
            }
            break;
    }
    graph.balloonText = "<span style='font-weight: 600;'>[[title]]</span>: [[value]] kW ";
    return graph;
};
dashMan.onPowerReceived(function () {
    if (devTempData.dSwitch.init === true) {
        var cbData = {

        };
        var pvPower = dashMan.getPowerPv();
        var gridPower = dashMan.getPowerGridOut();
        var loadPower = dashMan.getPowerLoad();
        var batChPower = dashMan.getPowerStorageCharge();
        var batDischPower = dashMan.getPowerStorageDischarge();
        devTempData.pusDataInArr(cbData, pvPower, "PV", );
        devTempData.pusDataInArr(cbData, gridPower, "Grid");
        devTempData.pusDataInArr(cbData, loadPower, "Load");
        devTempData.pusDataInArr(cbData, batChPower, "Storage Charge");
        devTempData.pusDataInArr(cbData, batDischPower, "Storage Discharge");
        cbData.date = new Date();
        devTempData.chartData.push(cbData);
        if (devTempData.dSwitch.state === 2 && document.visibilityState === 'visible') {
            devTempData.chart.validateData();
        }
    }
});
devTempData.updateChartData = function (dataArr) {
    var cbData = {
        gridPower: 0,
        pvPower: 0,
        loadPower: 0,
        batVoltageV: 0,
        batCurrentA: 0
    };
    let count = 0;
//    console.log('\tadd Data sumValues: ' + devTempData.sumValues);
    for (var i in dataArr) {
        if (cbData.date === undefined) {
            cbData.date = new Date(dataArr[i].loadPower.lastUpdate);
        }
        let ud = dataArr[i];
        let ser = ud.serialNumber;
        if (devTempData.sumValues === true || devManager.getSelected().serialNumber === ser) {
//            console.log('\t\tadd Data serial: ' + ser);
            count++;
            cbData.batCurrentA += ud.batteryCurrent;
            cbData.batVoltageV += ud.batteryVoltage;
            cbData.gridPower += ud.gridInPower.powerW;
            cbData.pvPower += ud.pvPower.powerW;
            cbData.loadPower += ud.loadPower.powerW;
            cbData[ser + '-' + 'gridPower'] = ud.gridInPower.powerW;
            cbData[ser + '-' + 'pvPower'] = ud.pvPower.powerW;
            cbData[ser + '-' + 'loadPower'] = ud.loadPower.powerW;
        }
    }


    if (count > 0) {
        cbData.batVoltageV /= count;
    } else {
        console.log('debug here');
    }

    formatValueDecimal(cbData);
    devTempData.chartData.push(cbData);
};
function formatValueDecimal(obj, decimal, skipArr) {
    decimal = decimal || 2;
    for (var field in obj) {
        if (typeof (obj[field]) === 'number') {
            obj[field] = Number(obj[field].toFixed(decimal));
        }
    }
}

devTempData.loadChartData = function () {
//    devManager.sendDevMessage(
//            {
//                instrExt: 'getTempData',
//                instrData: devManager.getSelected().serialNumber,
//                instrDataExt: devTempData.chartDataTIdx.toString()
//            },
//            function (devMessage, unitArr) { //success
//                if (unitArr.length > 0) {
//                    for (var i = 0; i < unitArr.length; i++) {
//                        var data = JSON.parse(unitArr[i]);
//                        devTempData.rawData.push(data);
//                        devTempData.updateChartData(data);
//                    }
//                    if (unitArr.length < 10) {
//                        devTempData.validateChartData();
//                    } else {
//                        devTempData.chartDataTIdx += 10;
//                        devTempData.loadChartData();
//                    }
//                }
//            }
//    );
};
function sortChartData(a, b) {
    if (a.date.getTime() < b.date.getTime())
        return -1;
    if (a.date.getTime() > b.date.getTime())
        return 1;
    return 0;
}

devTempData.chart = AmCharts.makeChart("chartdiv",
        {
            "type": "serial",
            "categoryField": "date",
            "dataDateFormat": "YYYY-MM-DD HH:NN:SS",
            "path": "/resources/amCharts",
            "libs": [{
                    "path": "/resources/amCharts/plugins/export/libs/"
                }, {
                    "path": "/resources/amCharts/plugins/export/"
                }, {
                    "path": "/resources/amCharts"
                }],
            "pathToImages": "/resources/amCharts/images/",
            "responsive": {
                "enabled": true,
                "rules": [
                    // at 400px wide, we hide legend
                    {
                        "maxWidth": 680,

                        "overrides": {
                            "marginTop": 0,
                            "legend": {
                                align: 'left',
//                                "labelText": "",
//                                "valueText": "",
                                "fontSize": 10,
                                "autoMargins": false,
                                "marginBottom": 25,
                                "marginTop": 3,
                                "marginLeft": 3,
                                "marginRight": 3,
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
                    },
                    {
                        "maxHeight": 380,
                        "titles": [
                            {
                                "text": ""
                            }
                        ]
                    }
                ]
            },
            "categoryAxis": {
                "minPeriod": "ss",
                "parseDates": true
            },
            "chartCursor": {
                "enabled": true,
                "categoryBalloonDateFormat": "JJ:NN:SS"
            },
            "chartScrollbar": {
                "enabled": true
            },
            "trendLines": [],
            "graphs": [],
//            "graphs": [{
//                    id: "PV",
//                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] kW ",
//                    lineColor: "green",
//                    title: "PV",
//                    type: "smoothedLine",
//                    valueField: "PV_Power"
//                },
//                {
//                    id: "GRID OUT",
//                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] kW ",
//                    lineColor: "red",
//                    title: "GRID",
//                    type: "smoothedLine",
//                    valueField: "GRID OUT_Power"
//                },
//                {
//                    id: "CONSUMERS",
//                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] kW ",
//                    lineColor: "blue",
//                    title: "Load",
//                    type: "smoothedLine",
//                    valueField: "CONSUMERS_Power"
//                }
//            ],
            "guides": [],
            "valueAxes": [
                {
                    "id": "powerAcW"
//                    "title": "Axis title"
                },
                {
                    "id": "batVoltageV",
                    "offset": 0,
                    "position": "right"
                },
                {
                    "id": "batCurrentA",
                    "offset": 45,
                    "position": "right"
                }
            ],
            "allLabels": [],
            "balloon": {},
            "legend": {
                "enabled": true,
                "markerType": "circle",
                equalWidts: false,
                "autoMargins": false,
                "marginBottom": 20,
                "marginTop": 3,
                "marginLeft": 13,
                "marginRight": 13
            },
            "titles": [
                {
                    "id": "Title-1",
                    "size": 12,
                    "text": "Live Data Power and Storage"
                }
            ],
//            "dataProvider": [{"PV_Power": 0.68, "GRID OUT_Power": 1.54, "CONSUMERS_Power": 1.49, "date": "2019-03-02T09:32:27.291Z"}, {"PV_Power": 0.68, "GRID OUT_Power": 1.54, "CONSUMERS_Power": 1.49, "date": "2019-03-02T09:32:28.577Z"}, {"PV_Power": 0.68, "GRID OUT_Power": 1.52, "CONSUMERS_Power": 1.47, "date": "2019-03-02T09:32:32.092Z"}, {"PV_Power": 0.68, "GRID OUT_Power": 1.5, "CONSUMERS_Power": 1.45, "date": "2019-03-02T09:32:35.611Z"}, {"PV_Power": 0.68, "GRID OUT_Power": 1.48, "CONSUMERS_Power": 1.42, "date": "2019-03-02T09:32:39.137Z"}, {"PV_Power": 0.68, "GRID OUT_Power": 1.48, "CONSUMERS_Power": 1.43, "date": "2019-03-02T09:32:42.666Z"}, {"PV_Power": 0.68, "GRID OUT_Power": 1.57, "CONSUMERS_Power": 1.46, "date": "2019-03-02T09:32:49.133Z"}, {"PV_Power": 0.68, "GRID OUT_Power": 1.51, "CONSUMERS_Power": 1.46, "date": "2019-03-02T09:32:51.917Z"}, {"PV_Power": 0.68, "GRID OUT_Power": 1.59, "CONSUMERS_Power": 1.49, "date": "2019-03-02T09:32:55.446Z"}, {"PV_Power": 0.68, "GRID OUT_Power": 1.53, "CONSUMERS_Power": 1.48, "date": "2019-03-02T09:32:58.973Z"}, {"PV_Power": 0.68, "GRID OUT_Power": 1.51, "CONSUMERS_Power": 1.46, "date": "2019-03-02T09:33:02.480Z"}, {"PV_Power": 0.68, "GRID OUT_Power": 1.48, "CONSUMERS_Power": 1.43, "date": "2019-03-02T09:33:08.406Z"}, {"PV_Power": 0.73, "GRID OUT_Power": 1.52, "CONSUMERS_Power": 1.47, "date": "2019-03-02T09:33:11.925Z"}, {"PV_Power": 0.68, "GRID OUT_Power": 1.58, "CONSUMERS_Power": 1.47, "date": "2019-03-02T09:33:15.441Z"}, {"PV_Power": 0.73, "GRID OUT_Power": 1.53, "CONSUMERS_Power": 1.47, "date": "2019-03-02T09:33:19.726Z"}, {"PV_Power": 0.68, "GRID OUT_Power": 1.5, "CONSUMERS_Power": 1.45, "date": "2019-03-02T09:33:22.489Z"}, {"PV_Power": 0.68, "GRID OUT_Power": 1.53, "CONSUMERS_Power": 1.48, "date": "2019-03-02T09:33:29.002Z"}, {"PV_Power": 0.74, "GRID OUT_Power": 1.46, "CONSUMERS_Power": 1.4, "date": "2019-03-02T09:33:32.044Z"}, {"PV_Power": 0.74, "GRID OUT_Power": 1.58, "CONSUMERS_Power": 1.48, "date": "2019-03-02T09:33:35.566Z"}, {"PV_Power": 0.74, "GRID OUT_Power": 1.48, "CONSUMERS_Power": 1.43, "date": "2019-03-02T09:33:39.092Z"}, {"PV_Power": 0.74, "GRID OUT_Power": 1.49, "CONSUMERS_Power": 1.44, "date": "2019-03-02T09:33:42.613Z"}, {"PV_Power": 0.74, "GRID OUT_Power": 1.59, "CONSUMERS_Power": 1.48, "date": "2019-03-02T09:33:45.691Z"}, {"PV_Power": 0.74, "GRID OUT_Power": 1.52, "CONSUMERS_Power": 1.47, "date": "2019-03-02T09:33:49.208Z"}, {"PV_Power": 0.74, "GRID OUT_Power": 1.52, "CONSUMERS_Power": 1.47, "date": "2019-03-02T09:33:52.729Z"}, {"PV_Power": 0.79, "GRID OUT_Power": 1.53, "CONSUMERS_Power": 1.48, "date": "2019-03-02T09:33:56.367Z"}, {"PV_Power": 0.79, "GRID OUT_Power": 1.58, "CONSUMERS_Power": 1.47, "date": "2019-03-02T09:33:59.760Z"}, {"PV_Power": 0.79, "GRID OUT_Power": 1.48, "CONSUMERS_Power": 1.43, "date": "2019-03-02T09:34:03.280Z"}, {"PV_Power": 0.79, "GRID OUT_Power": 1.52, "CONSUMERS_Power": 1.46, "date": "2019-03-02T09:34:09.162Z"}, {"PV_Power": 0.79, "GRID OUT_Power": 1.51, "CONSUMERS_Power": 1.46, "date": "2019-03-02T09:34:12.444Z"}, {"PV_Power": 0.79, "GRID OUT_Power": 1.58, "CONSUMERS_Power": 1.48, "date": "2019-03-02T09:34:15.983Z"}, {"PV_Power": 0.79, "GRID OUT_Power": 1.6, "CONSUMERS_Power": 1.49, "date": "2019-03-02T09:34:19.234Z"}, {"PV_Power": 0.79, "GRID OUT_Power": 1.53, "CONSUMERS_Power": 1.48, "date": "2019-03-02T09:34:22.780Z"}, {"PV_Power": 0.79, "GRID OUT_Power": 1.57, "CONSUMERS_Power": 1.51, "date": "2019-03-02T09:34:28.960Z"}, {"PV_Power": 0.79, "GRID OUT_Power": 1.55, "CONSUMERS_Power": 1.5, "date": "2019-03-02T09:34:32.274Z"}, {"PV_Power": 0.79, "GRID OUT_Power": 1.57, "CONSUMERS_Power": 1.47, "date": "2019-03-02T09:34:35.792Z"}, {"PV_Power": 0.79, "GRID OUT_Power": 1.53, "CONSUMERS_Power": 1.48, "date": "2019-03-02T09:34:39.327Z"}, {"PV_Power": 0.79, "GRID OUT_Power": 1.47, "CONSUMERS_Power": 1.42, "date": "2019-03-02T09:34:42.836Z"}, {"PV_Power": 0.84, "GRID OUT_Power": 1.48, "CONSUMERS_Power": 1.43, "date": "2019-03-02T09:34:48.797Z"}, {"PV_Power": 0.84, "GRID OUT_Power": 1.49, "CONSUMERS_Power": 1.44, "date": "2019-03-02T09:34:52.310Z"}, {"PV_Power": 0.79, "GRID OUT_Power": 1.48, "CONSUMERS_Power": 1.43, "date": "2019-03-02T09:34:55.917Z"}, {"PV_Power": 0.84, "GRID OUT_Power": 1.44, "CONSUMERS_Power": 1.39, "date": "2019-03-02T09:34:59.345Z"}, {"PV_Power": 0.79, "GRID OUT_Power": 1.48, "CONSUMERS_Power": 1.37, "date": "2019-03-02T09:35:02.861Z"}, {"PV_Power": 0.79, "GRID OUT_Power": 1.47, "CONSUMERS_Power": 1.42, "date": "2019-03-02T09:35:08.898Z"}, {"PV_Power": 0.79, "GRID OUT_Power": 1.44, "CONSUMERS_Power": 1.39, "date": "2019-03-02T09:35:11.894Z"}, {"PV_Power": 0.84, "GRID OUT_Power": 1.56, "CONSUMERS_Power": 1.46, "date": "2019-03-02T09:35:15.416Z"}, {"PV_Power": 0.79, "GRID OUT_Power": 1.44, "CONSUMERS_Power": 1.39, "date": "2019-03-02T09:35:18.974Z"}, {"PV_Power": 0.85, "GRID OUT_Power": 1.39, "CONSUMERS_Power": 1.34, "date": "2019-03-02T09:35:23.812Z"}, {"PV_Power": 0.85, "GRID OUT_Power": 1.45, "CONSUMERS_Power": 1.4, "date": "2019-03-02T09:35:28.542Z"}, {"PV_Power": 0.95, "GRID OUT_Power": 1.45, "CONSUMERS_Power": 1.4, "date": "2019-03-02T09:35:32.059Z"}, {"PV_Power": 0.95, "GRID OUT_Power": 1.51, "CONSUMERS_Power": 1.4, "date": "2019-03-02T09:35:36.565Z"}, {"PV_Power": 1.06, "GRID OUT_Power": 1.5, "CONSUMERS_Power": 1.39, "date": "2019-03-02T09:35:39.091Z"}, {"PV_Power": 1.17, "GRID OUT_Power": 1.44, "CONSUMERS_Power": 1.38, "date": "2019-03-02T09:35:42.609Z"}, {"PV_Power": 1.44, "GRID OUT_Power": 1.46, "CONSUMERS_Power": 1.41, "date": "2019-03-02T09:35:48.738Z"}, {"PV_Power": 2.2, "GRID OUT_Power": 1.44, "CONSUMERS_Power": 1.39, "date": "2019-03-02T09:35:52.256Z"}, {"PV_Power": 2.75, "GRID OUT_Power": 1.39, "CONSUMERS_Power": 1.39, "date": "2019-03-02T09:35:56.753Z"}, {"PV_Power": 2.92, "GRID OUT_Power": 1.41, "CONSUMERS_Power": 1.41, "date": "2019-03-02T09:35:59.299Z"}, {"PV_Power": 2.98, "GRID OUT_Power": 1.39, "CONSUMERS_Power": 1.39, "date": "2019-03-02T09:36:02.816Z"}, {"PV_Power": 2.92, "GRID OUT_Power": 1.44, "CONSUMERS_Power": 1.44, "date": "2019-03-02T09:36:08.659Z"}, {"PV_Power": 2.98, "GRID OUT_Power": 1.42, "CONSUMERS_Power": 1.42, "date": "2019-03-02T09:36:12.035Z"}, {"PV_Power": 2.98, "GRID OUT_Power": 1.37, "CONSUMERS_Power": 1.37, "date": "2019-03-02T09:36:15.548Z"}, {"PV_Power": 3.04, "GRID OUT_Power": 1.43, "CONSUMERS_Power": 1.43, "date": "2019-03-02T09:36:19.078Z"}, {"PV_Power": 2.88, "GRID OUT_Power": 1.4, "CONSUMERS_Power": 1.4, "date": "2019-03-02T09:36:23.328Z"}, {"PV_Power": 2.71, "GRID OUT_Power": 1.39, "CONSUMERS_Power": 1.39, "date": "2019-03-02T09:36:28.479Z"}, {"PV_Power": 2.32, "GRID OUT_Power": 1.42, "CONSUMERS_Power": 1.42, "date": "2019-03-02T09:36:31.980Z"}, {"PV_Power": 2.27, "GRID OUT_Power": 1.43, "CONSUMERS_Power": 1.43, "date": "2019-03-02T09:36:35.969Z"}, {"PV_Power": 2.16, "GRID OUT_Power": 1.39, "CONSUMERS_Power": 1.39, "date": "2019-03-02T09:36:39.038Z"}, {"PV_Power": 2.21, "GRID OUT_Power": 1.38, "CONSUMERS_Power": 1.38, "date": "2019-03-02T09:36:42.542Z"}, {"PV_Power": 2.1, "GRID OUT_Power": 1.4, "CONSUMERS_Power": 1.4, "date": "2019-03-02T09:36:48.585Z"}, {"PV_Power": 1.72, "GRID OUT_Power": 1.39, "CONSUMERS_Power": 1.39, "date": "2019-03-02T09:36:52.124Z"}, {"PV_Power": 1.61, "GRID OUT_Power": 1.42, "CONSUMERS_Power": 1.42, "date": "2019-03-02T09:36:55.643Z"}],
            "dataProvider": devTempData.chartData,
            "export": {
                "enabled": true
            }
        }
);
$(document).ready(function () {

});
