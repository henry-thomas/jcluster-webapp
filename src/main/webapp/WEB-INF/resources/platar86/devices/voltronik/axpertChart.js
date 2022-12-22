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

/* global moment, PF, AmCharts, graphManager, mainUtils, axAi, devManager */

devManager.onSelectedChange(function () {
    if (devTempData.sumValues === false) {
        devTempData.chartData.length = 0;
        for (var item in devTempData.rawData) {
            devTempData.updateChartData(devTempData.rawData[item]);
        }
        devTempData.validateChartData();
    }
});
devTempData = {};
devManager.onSelectedParamInit(function () {
    devTempData.loadChartData();
});

devTempData.chartData = [];
devTempData.rawData = [];
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

devTempData.validateChartData = function () {
    devTempData.chartData.sort(sortChartData);
    devTempData.chart.validateData();
};

devManager.onAllDataReceived(function (data) {
    if (data.length > 0) {
        devTempData.rawData.push(data);
        devTempData.updateChartData(data);
        devTempData.validateChartData();
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
    devManager.sendDevMessage(
            {
                instrExt: 'getTempData',
                instrData: devManager.getSelected().serialNumber,
                instrDataExt: devTempData.chartDataTIdx.toString()
            },
            function (devMessage, unitArr) { //success
                if (unitArr.length > 0) {
                    for (var i = 0; i < unitArr.length; i++) {
                        var data = JSON.parse(unitArr[i]);
                        devTempData.rawData.push(data);
                        devTempData.updateChartData(data);
                    }
                    if (unitArr.length < 10) {
                        devTempData.validateChartData();
                    } else {
                        devTempData.chartDataTIdx += 10;
                        devTempData.loadChartData();
                    }
                }
            }
    );
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
                    "bullet": "none",
                    "id": "loadPower-1",
                    "title": "loadPower 1",
                    "valueField": "loadPower",
                    "lineColor": "blue",
                    "type": "smoothedLine",
                    "valueAxis": "powerAcW"
                },
                {
                    "bullet": "none",
                    "id": "gridPower-1",
                    "title": "gridPower 1",
                    "valueField": "gridPower",
                    "lineColor": "red",
                    "type": "smoothedLine",
                    "valueAxis": "powerAcW"
                },
                {
                    "bullet": "none",
                    "id": "pvPower-1",
                    "title": "pvPower 1",
                    "valueField": "pvPower",
                    "lineColor": "green",
                    "type": "smoothedLine",
                    "valueAxis": "powerAcW"
                },
                {
                    "bullet": "none",
                    "id": "batVoltageV-1",
                    "title": "batVoltageV 1",
                    "valueField": "batVoltageV",
                    "lineColor": "brown",
                    "type": "smoothedLine",
                    "valueAxis": "batVoltageV"
                },
                {
                    "bullet": "none",
                    "id": "batCurrentA-1",
                    "title": "batCurrentA 1",
                    "valueField": "batCurrentA",
                    "lineColor": "brown",
                    "type": "smoothedLine",
                    "valueAxis": "batCurrentA"
                }
            ],
            "guides": [],
            "valueAxes": [
                {
                    "id": "powerAcW",
                    "title": "Axis title"
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
                "useGraphSettings": true
            },
            "titles": [
                {
                    "id": "Title-1",
                    "size": 12,
                    "text": "Live Data Chart"
                }
            ],
            "dataProvider": devTempData.chartData,
            "export": {
                "enabled": true
            }
        }
);


$(document).ready(function () {

});
