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
/* global moment, PF, AmCharts, graphManager, mainUtils, axAi, devManager, escVic */

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
//    devTempData.loadChartData();
});

devTempData.chartData = [];
devTempData.rawData = [];
devTempData.chartDataTIdx = 0;
devTempData.selectedDevSer = "all";
devTempData.invSerialList = {};


devTempData.addNewSerial = function (ser) {
    if (devTempData.invSerialList[ser] === undefined) {
        devTempData.invSerialList[ser] = true;
        $('#basic').puidropdown('addOption', {label: ser, value: ser});
    }
};

devTempData.onSelectedChange = function (val) {
    console.log(val);
    for (var i in  devTempData.chart.graphs) {
        let gr = devTempData.chart.graphs[i];
        if (val === 'all') {
            gr.valueField = gr.valueFieldName;
        } else {
            gr.valueField = val + '-' + gr.valueFieldName;

        }
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
//    devTempData.chartData.sort(sortChartData);
    devTempData.chart.validateData();
};

devManager.onSelectedDataReceived(function (dev, data) {
    devTempData.updateChartData(data);
    devTempData.chart.validateData();
});

devTempData.updateChartData = function (data) {
//    console.log(data);
//     escVic.escCtrlData = data;
    var cbData = {
        date: new Date(),
        ccgxChargeVoltage: data.chargeVoltage,
        ccgxDischargeVoltage: data.dischargeVoltage,
        ccgxChargeCurrent: data.chargingCurrent,
        ccgxDischargeCurrent: data.dischargingCurrent * -1
    };
    if (escVic.escCtrlData !== undefined) {
        cbData.avergCapacityP = escVic.escCtrlData.avergCapacityP;
        cbData.avergVoltageV = escVic.escCtrlData.avergVoltageV;
        cbData.escChargeControl = escVic.escCtrlData.escChargeControl;
        cbData.escDischargeControl = escVic.escCtrlData.escDischargeControl;
        cbData.totalCurrentA = escVic.escCtrlData.totalCurrentA;
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
                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] % ",
                    "bullet": "none",
                    "title": "Bus SoC",
                    "valueField": "avergCapacityP",
                    "valueFieldName": "avergCapacityP",
                    "lineColor": "blue",
                    "type": "smoothedLine",
                    "valueAxis": "percent"
                },
                {
                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] V ",
                    "bullet": "none",
                    "title": "Bus Voltage",
                    "valueField": "avergVoltageV",
                    "valueFieldName": "avergVoltageV",
                    "lineColor": "red",
                    "type": "smoothedLine",
                    "valueAxis": "batVoltageV"
                },
                {
                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] A ",
                    "bullet": "none",
                    "title": "Bus Current",
                    "valueField": "totalCurrentA",
                    "valueFieldName": "totalCurrentA",
                    "lineColor": "brown",
                    "type": "smoothedLine",
                    "valueAxis": "batCurrentA"
                },
                {
                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] V ",
                    "bullet": "none",
                    "title": "CCGX CV",
                    "valueField": "ccgxChargeVoltage",
                    "valueFieldName": "ccgxChargeVoltage",
                    "lineColor": "orange",
                    "type": "smoothedLine",
                    "valueAxis": "batVoltageV"
                },
                {
                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] V ",
                    "bullet": "none",
                    "title": "CCGX DV",
                    "valueField": "ccgxDischargeVoltage",
                    "valueFieldName": "ccgxDischargeVoltage",
                    "lineColor": "orange",
                    "type": "smoothedLine",
                    "valueAxis": "batVoltageV"
                },
                {
                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] A ",
                    "bullet": "none",
                    "title": "CCGX CC",
                    "valueField": "ccgxChargeCurrent",
                    "valueFieldName": "ccgxChargeCurrent",
                    "lineColor": "green",
                    "type": "smoothedLine",
                    "valueAxis": "batCurrentA"
                },
                {
                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] A ",
                    "bullet": "none",
                    "title": "CCGX DC",
                    "valueField": "ccgxDischargeCurrent",
                    "valueFieldName": "ccgxDischargeCurrent",
                    "lineColor": "green",
                    "type": "smoothedLine",
                    "valueAxis": "batCurrentA"
                }
            ],
            "guides": [],
            "valueAxes": [
                {
                    "id": "percent",
                    "title": "Axis title",
                    "unit": "%",
                    "maximum": 105,
                    "minimum": 0
                },
                {
                    "id": "batVoltageV",
                    "offset": 0,
                    "position": "right",
                    "unit": "V",
                    "maximum": 57,
                    "minimum": 45
                },
                {
                    "id": "batCurrentA",
                    "offset": 45,
                    "unit": "A",
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
    $('#basic').puidropdown({
        change: function (comp, selection) {
            devTempData.onSelectedChange(selection.value);
        }
    });
    //  $('#basic').puidropdown('addOption', {label:'asdf', value: '3434'});
});
