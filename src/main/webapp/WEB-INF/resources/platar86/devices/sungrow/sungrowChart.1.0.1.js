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

devChart = {
    chartData: [],
    rawData: [],
    devRawData: {},
    chartDataTIdx: 0,
    selectedDevSer: "all",
    chartCreate: false
};

devManager.onDataReceived(function (dev, data) {
    let cbData = devChart.updateChartData(dev, data);
    if (dev.selected) {
        if (devChart.chartCreate === false) {
            devChart.createAndpopulataChartData(data);
            devChart.chartCreate = true;
        }
        devChart.chartData.push(cbData);
        devChart.chart.validateData();
    }
});

devManager.onSelectedChange(function () {
    if (devChart.sumValues === false) {
        devChart.chartData.length = 0;
        for (var item in devChart.rawData) {
            devChart.updateChartData(devChart.rawData[item]);
        }

        devChart.validateChartData();
    }
});





devChart.updateChartData = function (dev, data) {
//    console.log(data);
//     escVic.escCtrlData = data;
    var cbData = {
        date: new Date()
    };
    for (var item in data) {
        let obj = data[item];
        if (typeof (obj) === 'object') {
            if (item === 'pha1ExportPower') {
                for (var itemIner in obj) {
                    cbData["pha1_" + itemIner] = obj[itemIner];
                }
            } else if (item === 'pha2ExportPower') {
                for (var itemIner in obj) {
                    cbData["pha2_" + itemIner] = obj[itemIner];
                }
            } else if (item === 'pha3ExportPower') {
                for (var itemIner in obj) {
                    cbData["pha3_" + itemIner] = obj[itemIner];
                }
            } else if (item === 'sumExportPower') {
                for (var itemIner in obj) {
                    cbData["sum_" + itemIner] = obj[itemIner];
                }
            } else if (item === 'mpptData') {
//                cbData.mpptData = obj;
                for (var itemIner in obj) {
                    let mpptObj = obj[itemIner];
                    if (typeof (mpptObj) === 'object') {
                        for (var mpptItem in mpptObj) {
                            let mpptItemObj = mpptObj[mpptItem];
                            if (typeof (mpptItemObj) === 'object') {
                                for (var mpptItemIdx in mpptItemObj) {

                                    cbData["mppt_" + itemIner + "_" + mpptItem + "_" + mpptItemIdx] = mpptItemObj[mpptItemIdx];
                                }

                            } else {
                                cbData["mppt_" + itemIner + "_" + mpptItem] = mpptItemObj;
                            }
                        }
                    }
                }

            }
        } else {
            cbData[item] = obj;
        }
    }
//    console.log(cbData);

    let devArr = devChart.devRawData[dev.serialNumber];
    if (typeof (devArr !== 'object')) {
        devChart.devRawData[dev.serialNumber] = [];
        devArr = devChart.devRawData[dev.serialNumber];
    }

    formatValueDecimal(cbData);
    devArr.push(cbData);
    return cbData;
}
;


devChart.chartOnChazoomChange = function (t) {
    if (devChart.chart.zoomOutOnDataUpdate === true) {
        devChart.chart.zoomOutOnDataUpdate = false;
    } else {
        devChart.chart.zoomOutOnDataUpdate = true;
    }
};

devChart.validateChartData = function () {
//    devTempData.chartData.sort(sortChartData);
    devChart.chart.validateData();
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



devChart.createAndpopulataChartData = function (val) {
    devChart.chart.graphs.length = 0;
    devChart.chart.graphs.push({
        balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] cosF",
        "bullet": "none",
        "title": "Power Factor ",
        hidden: true,
        "valueField": "sum_powerFactorCosF",
        "type": "smoothedLine",
        "valueAxis": "powerFactor"
    });
    devChart.chart.graphs.push({
        balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] A",
        "bullet": "none",
        "title": "Total AC Current ",
        hidden: true,
        "valueField": "sum_currentA",
        "type": "smoothedLine",
        "valueAxis": "current"
    });
    devChart.chart.graphs.push({
        balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] W",
        "bullet": "none",
        "title": "Output Power ",
        hidden: false,
        "valueField": "sum_powerW",
        "type": "smoothedLine",
        "valueAxis": "power"
    });
    devChart.chart.graphs.push({
        balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] W",
        "bullet": "none",
        "title": "Power Limit ",
        hidden: true,
        "valueField": "powerLimitSetpoint",
        "type": "smoothedLine",
        "valueAxis": "power"
    });
    for (var i = 1; i < 4; i++) {

        devChart.chart.graphs.push({
            balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] V ",
            "bullet": "none",
            "title": "Phase" + i + " Voltage AC",
            hidden: true,
            "valueField": "pha" + i + "_voltageV",
            "type": "smoothedLine",
            "valueAxis": "acVoltage"
        });
    }
    for (var i = 1; i < 4; i++) {
        devChart.chart.graphs.push({
            balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] A ",
            "bullet": "none",
            "title": "Phase" + i + " Current AC",
            "valueField": "pha" + i + "_currentA",
            hidden: true,
//        "lineColor": "red",
            "type": "smoothedLine",
            "valueAxis": "current"
        });
    }
    for (var i = 1; i < 4; i++) {
        devChart.chart.graphs.push({
            balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] W ",
            "bullet": "none",
            "title": "Phase" + i + " Power W",
            "valueField": "pha" + i + "_powerW",
            hidden: true,
//        "lineColor": "red",
            "type": "smoothedLine",
            "valueAxis": "power"
        });
    }
    let mpptArr = val.mpptData;

    for (var i = 0; i < mpptArr.length; i++) {
        let mpptObj = mpptArr[i];
        devChart.chart.graphs.push({
            balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] V ",
            "bullet": "none",
            "title": "MPPT" + (i + 1) + " Voltage V",
            "valueField": "mppt_" + i + "_voltage",
            hidden: true,
//        "lineColor": "red",
            "type": "smoothedLine",
            "valueAxis": "dcVoltage"
        });
        devChart.chart.graphs.push({
            balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] A ",
            "bullet": "none",
            "title": "MPPT" + (i + 1) + " Current [A]",
            "valueField": "mppt_" + i + "_current",
            hidden: true,
//        "lineColor": "red",
            "type": "smoothedLine",
            "valueAxis": "current"
        });
        if (mpptObj.stringCurrentArr) {
            for (var j = 0; j < mpptArr.length; j++) {
                let mpptInput = mpptArr[i];
                devChart.chart.graphs.push({
                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] A ",
                    "bullet": "none",
                    "title": "MPPT" + (i + 1) + " Input " + (j + 1) + " Current [A]",
                    "valueField": "mppt_" + i + "_stringCurrentArr_" + j,
                    hidden: true,
//        "lineColor": "red",
                    "type": "smoothedLine",
                    "valueAxis": "current"
                });
            }

        }

//        console.log(mpptObj);
    }

};


devChart.chart = AmCharts.makeChart("chartdiv",
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

            ],
            "guides": [],
            "valueAxes": [
                {
                    "id": "acVoltage",
                    "title": "Axis title",
                    "unit": "VAC",
//                    "maximum": 105,
                    "minimum": 0
                },
                {
                    "id": "dcVoltage",
                    "offset": 0,
                    "position": "right",
                    "unit": "VDC",
                    "maximum": 57,
                    "minimum": 45
                },
                {
                    "id": "current",
                    "offset": 45,
                    "unit": "A",
                    "position": "right"
                },
                {
                    "id": "power",
                    "offset": 45,
                    "unit": "W",
                    "position": "left"
                },
                {
                    "id": "powerFactor",
                    "offset": -40,
                    "unit": "",
                    "position": "left"
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
            "dataProvider": devChart.chartData,
            "export": {
                "enabled": true
            }
        }
);


$(document).ready(function () {
    $('#basic').puidropdown({
        change: function (comp, selection) {
            devChart.onSelectedChange(selection.value);
        }
    });
    //  $('#basic').puidropdown('addOption', {label:'asdf', value: '3434'});
});
