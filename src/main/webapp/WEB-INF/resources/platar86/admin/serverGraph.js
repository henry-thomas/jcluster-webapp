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

/* global moment, PF, AmCharts, graphManager, mainUtils, axAi, devManager, dm */


var bmsEmGraph = {};
bmsEmGraph.rowData = {}; //Key is bms serialNumber
bmsEmGraph.rowDataProd = {}; //Key is bms serialNumber
bmsEmGraph.graphData = []; //Key is bms serialNumber
bmsEmGraph.oldDataActive = false; //Key is bms serialNumber


bmsEmGraph.zoomOutOnUpdate = function () {
    if (bmsEmGraph.chart.zoomOutOnDataUpdate === true) {
        bmsEmGraph.chart.zoomOutOnDataUpdate = false;
    } else {
        bmsEmGraph.chart.zoomOutOnDataUpdate = true;
    }
};

bmsEmGraph.requestOldRecordsFromDB = function () {
    if (bmsEmGraph.rowDataProd[devManager.getSelected().serialNumber] === undefined) {
        fetchBmsDataFromDb([
            {
                name: "bmsEm",
                value: JSON.stringify(devManager.getSelected())
            }
        ]);
    } else {
        bmsEmGraph.graphData.length = 0;
        for (var i = 0; i < bmsEmGraph.rowDataProd[devManager.getSelected().serialNumber].length; i++) {
            let d = bmsEmGraph.rowDataProd[devManager.getSelected().serialNumber][i];
            bmsEmGraph.addGraphRecord(null, d);
        }
        bmsEmGraph.chart.validateData();
    }
};

bmsEmGraph.switchChartData = function () {
    let dataState = mainUtils.getWidgetValue('showProdDataWg');
    if (dataState) {
        bmsEmGraph.requestOldRecordsFromDB();
    } else {
        bmsEmGraph.graphData.length = 0;
        let dev = devManager.getSelected();
        if (bmsEmGraph.rowData[dev.serialNumber] !== undefined) {
            for (var i = 0; i < bmsEmGraph.rowData[dev.serialNumber].length; i++) {
                let data = bmsEmGraph.rowData[dev.serialNumber][i];
                bmsEmGraph.addGraphRecord(dev, data);
            }
        }
        bmsEmGraph.chart.validateData();
    }
};

bmsEmGraph.loadOldRecordsFromDB = function (data) {
//    console.log(data);
    bmsEmGraph.oldDataActive = true;
    mainUtils.setWidgetValue('showProdDataWg', true);
    bmsEmGraph.graphData.length = 0;
    for (var i = 0; i < data.length; i++) {
        let d = data[i];
        if (bmsEmGraph.rowDataProd[d.serialNumber] === undefined) {
            bmsEmGraph.rowDataProd[d.serialNumber] = [];
        }
        bmsEmGraph.rowDataProd[d.serialNumber].push(d);
        bmsEmGraph.addGraphRecord(null, d);
    }
    bmsEmGraph.chart.validateData();
};


bmsEmGraph.addGraphRecord = function (dev, data) {
    let rec = {};
    rec.data = data;
    rec.date = new Date(data.lastUpdate);
    rec.minCellV = data.minCellValue;
    rec.maxCellV = data.maxCellValue;
    rec.maxCellNum = data.maxCellNumber + 1;
    rec.minCellNum = data.minCellNumber + 1;
    rec.cellVoltageDiv_mV = data.maxCellValue - data.minCellValue;
    rec.packVoltageV = data.voltageV;
    rec.currentA = data.currentA;
    rec.capacityAh = Number(data.capacityAh.toFixed(3));
    rec.capacityP = data.capacityP;
    rec.boardTemp = data.temp0;
    rec.chargeCtrl = data.chargeControl;
    rec.dischargeCtrl = data.dischargeControl;

    if (rec.capacityAh > bmsEmGraph.chart.valueAxes[3].maximum) {
        bmsEmGraph.chart.valueAxes[3].maximum = (rec.capacityAh * 1.1);
    }
    if (rec.currentA > bmsEmGraph.chart.valueAxes[4].maximum) {
        bmsEmGraph.chart.valueAxes[4].maximum = (rec.currentA * 1.1);
    }
    if (rec.currentA < bmsEmGraph.chart.valueAxes[4].minimum) {
        bmsEmGraph.chart.valueAxes[4].minimum = (rec.currentA * 1.1);
    }

    bmsEmGraph.graphData.push(rec);
};

devManager.onSelectedChange(function (dev) {
    bmsEmGraph.graphData.length = 0;
    if (bmsEmGraph.rowData[dev.serialNumber] !== undefined) {
        for (var i = 0; i < bmsEmGraph.rowData[dev.serialNumber].length; i++) {
            let data = bmsEmGraph.rowData[dev.serialNumber][i];
            bmsEmGraph.addGraphRecord(dev, data);
        }

    }
    bmsEmGraph.chart.validateData();

});

devManager.onDataReceived(function (dev, data) {
    let serialNumber = dev.serialNumber;
    if (bmsEmGraph.rowData[serialNumber] === undefined) {
        bmsEmGraph.rowData[serialNumber] = [];
    }
    bmsEmGraph.rowData[serialNumber].push(data);
    if (dev.selected && bmsEmGraph.oldDataActive === false) {
        bmsEmGraph.addGraphRecord(dev, data);
        bmsEmGraph.chart.validateData();
    }
//    console.log(data);
});

bmsEmGraph.chartDataTIdx = 0;
bmsEmGraph.sumValues = false;

bmsEmGraph.chartOnChazoomChange = function (t) {
    if (bmsEmGraph.chart.zoomOutOnDataUpdate === true) {
        bmsEmGraph.chart.zoomOutOnDataUpdate = false;
    } else {
        bmsEmGraph.chart.zoomOutOnDataUpdate = true;
    }
};



function formatValueDecimal(obj, decimal, skipArr) {
    decimal = decimal || 2;
    for (var field in obj) {
        if (typeof (obj[field]) === 'number') {
            obj[field] = Number(obj[field].toFixed(decimal));
        }
    }
}

bmsEmGraph.loadChartData = function () {

};
function sortChartData(a, b) {
    if (a.date.getTime() < b.date.getTime())
        return -1;
    if (a.date.getTime() > b.date.getTime())
        return 1;
    return 0;
}

bmsEmGraph.chart = AmCharts.makeChart("chartdiv",
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
            "graphs": [
                {
                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]]mV Diff ",
                    "bullet": "none",
                    "id": "cellVoltageDiv_mV-1",
                    "title": "Cell Diff",
                    "valueField": "cellVoltageDiv_mV",
                    "valueFieldName": "cellVoltageDiv_mV",
                    "lineColor": "#FF0000",
                    "type": "smoothedLine",
                    "hidden": true,
                    "valueAxis": "cellVoltageDiv_mV"
                },
                {
                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]]mV  @ Cell[[minCellNum]]",
                    "bullet": "none",
                    "id": "minCellV-1",
                    "title": "Min Cell",
                    "valueField": "minCellV",
                    "valueFieldName": "minCellV",
                    "lineColor": "#FFBB00",
                    "type": "smoothedLine",
                    "valueAxis": "cellVoltageV"
                },
                {
                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]]mV @ Cell[[maxCellNum]]",
                    "bullet": "none",
                    "id": "maxCellV-1",
                    "title": "Max Cell",
                    "valueField": "maxCellV",
                    "valueFieldName": "maxCellV",
                    "lineColor": "#FFBB00",
                    "type": "smoothedLine",
                    "valueAxis": "cellVoltageV"
                },
                {
                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]]A",
                    "bullet": "none",
                    "id": "currentA-1",
                    "title": "Current",
                    "valueField": "currentA",
                    "valueFieldName": "currentA",
                    "lineColor": "#00BBFF",
                    "type": "smoothedLine",
                    "valueAxis": "batCurrentA"
                },
                {
                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]]Ah ([[capacityP]]%)",
                    "bullet": "none",
                    "id": "capacityAh-1",
                    "title": "Ah",
                    "valueField": "capacityAh",
                    "valueFieldName": "capacityAh",
                    "lineColor": "#00FF33",
                    "type": "smoothedLine",
                    "valueAxis": "capacityAh"
                },
                {
                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]]V ",
                    "bullet": "none",
                    "hidden": true,
                    "id": "packVoltageV-1",
                    "title": "Pack Voltage",
                    "valueField": "packVoltageV",
                    "valueFieldName": "packVoltageV",
                    "lineColor": "#AA00AA",
                    "type": "smoothedLine",
                    "valueAxis": "batVoltageV"
                }
            ],
            "guides": [],
            "valueAxes": [
                {
                    "id": "cellVoltageDiv_mV",
                    "minimum": 0,
                    "maximum": 300,
                    "offset": 0,
//                    "unit": "mV",
                    "autoGridCount": false,
                    "gridCount": 2,
                    "axisColor": "#FF0000",
                    "color": "#FF0000",
                    "gridColor": "#FF0000",
                    "position": "right"
                },
                {
                    "id": "cellVoltageV",
                    "offset": 40,
                    "minimum": 2000,
                    "maximum": 4000,
//                    "unit": "mV",
                    "autoGridCount": false,
                    "gridCount": 4,
                    "axisColor": "#FFBB00",
                    "color": "#FFBB00",
                    "gridColor": "#FFBB00",
                    "position": "right"
                },
                {
                    "id": "batVoltageV",
                    "offset": 80,
                    "minimum": 40,
                    "maximum": 60,
//                    "unit": "mV",
                    "autoGridCount": false,
                    "gridCount": 4,
                    "axisColor": "#AA00AA",
                    "color": "#AA00AA",
                    "gridColor": "#AA00AA",
                    "position": "left"
                },
                {
                    "id": "capacityAh",
                    "offset": 0,
                    "minimum": 0,
                    "maximum": 100,
//                    "unit": "mV",
                    "autoGridCount": false,
                    "gridCount": 4,
                    "axisColor": "#00FF33",
                    "color": "#00FF33",
                    "gridColor": "#00FF33",
                    "position": "left"
                },
                {
                    "id": "batCurrentA",
                    "offset": 40,
                    "minimum": -100,
                    "maximum": 100,
//                    "unit": "mV",
                    "autoGridCount": false,
                    "gridCount": 4,
                    "axisColor": "#00BBFF",
                    "color": "#00BBFF",
                    "gridColor": "#00BBFF",
                    "position": "left"
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
            "dataProvider": bmsEmGraph.graphData,
            "export": {
                "enabled": true
            }
        }
);
$(document).ready(function () {

});
