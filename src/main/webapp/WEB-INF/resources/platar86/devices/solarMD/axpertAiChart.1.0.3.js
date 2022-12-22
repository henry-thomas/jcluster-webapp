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

/* global moment, PF, AmCharts, graphManager, mainUtils, axAi, devManager, amCharts */

devManager.onSelectedChange(function (dev) {
    var serial = dev.serialNumber;

    $('#basic').puidropdown('removeAllOptions');
    $('#basic').puidropdown('addOption', {label: 'All Inverters', value: 'all'});
    if (axAiChart.clusters[serial] !== undefined && axAiChart.clusters[serial].invSerialList !== undefined) {
        for (var item in  axAiChart.clusters[serial].invSerialList) {
            $('#basic').puidropdown('addOption', {label: item, value: item});
        }
    }
    axAiChart.reloadChartData(dev);
});

axAiChart = {
    charDataClusterFormated: {},
    charDataCluster: {},
    chartData: [],
    escData: {},
    clusters: {},
    createNew: function (serial) {
        axAiChart.chartData = [];
//        axAiChart.charDataCluster[serial].rawData = [];
        axAiChart.chartDataTIdx = 0;
        axAiChart.clusters[serial] = {};
        axAiChart.clusters[serial].invSerialList = {};
        axAiChart.clusters[serial].selectedDevSer = "all";
    }
};

axAiChart.addNewInverterSerial = function (ser) {

    var serial = devManager.getSelected().serialNumber;
    if (axAiChart.clusters[serial] === undefined) {
        axAiChart.clusters[serial] = {};
        axAiChart.clusters[serial].invSerialList = {};
        axAiChart.clusters[serial].invSerialList = {};
    }


    if (axAiChart.clusters[serial].invSerialList[ser] === undefined) {
        axAiChart.clusters[serial].invSerialList[ser] = true;
        $('#basic').puidropdown('addOption', {label: ser, value: ser});
    }
};

axAiChart.onSelectedInverterUnitChange = function (inverterUnitSerial) {
    console.log(inverterUnitSerial);
    for (var i in  axAiChart.chart.graphs) {
        let gr = axAiChart.chart.graphs[i];
        if (inverterUnitSerial === 'all') {
            gr.valueField = gr.valueFieldName;
        } else {
            gr.valueField = inverterUnitSerial + '-' + gr.valueFieldName;
        }
    }
    axAiChart.validateChartData();
};

axAiChart.reloadChartData = function (dev) {
    var serial = dev.serialNumber;
    axAiChart.chartData.length = 0;

    for (var item in axAiChart.charDataClusterFormated[serial]) {
        axAiChart.chartData.push(axAiChart.charDataClusterFormated[serial][item]);
    }
    axAiChart.validateChartData();
};

axAiChart.chartOnChazoomChange = function (t) {
    if (axAiChart.chart.zoomOutOnDataUpdate === true) {
        axAiChart.chart.zoomOutOnDataUpdate = false;
    } else {
        axAiChart.chart.zoomOutOnDataUpdate = true;
    }
};

axAiChart.validateChartData = function () {
    axAiChart.chartData.sort(sortChartData);
    axAiChart.chart.validateData();
};

devManager.onDataReceived(function (dev, data) {
    data.timeStamp = new Date().getTime();
    //update chart if the data is for the selected cluster
    axAiChart.updateChartData(data, dev);
    if (dev.selected === true) {
        axAiChart.validateChartData();
    }
});

axAiChart.updateChartData = function (dataArr, dev) {
    var invSerial = dev.serialNumber;
    var cbData = {
        gridPower: 0,
        pvPower: 0,
        loadPower: 0,
        batVoltageV: 0,
        batCurrentA: 0,
        date: new Date()
    };
    if (dataArr.timeStamp !== undefined) {
        cbData.date = new Date(dataArr.timeStamp);
    }
    let count = 0;
//    console.log('\tadd Data sumValues: ' + axAiChart.charData[serial].sumValues);
    for (var i in dataArr.axpertUnitDataMap) {
        if (cbData.date === undefined) {
            cbData.date = new Date(dataArr.timeStamp);
        }
        let ud = dataArr.axpertUnitDataMap[i];
        let ser = ud.serialNumber;
        axAiChart.addNewInverterSerial(ser);
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
        cbData[ser + '-' + 'batCurrentA'] = ud.batteryCurrent;
        cbData[ser + '-' + 'batVoltageV'] = ud.batteryVoltage;
    }

    if (count > 0) {
        cbData.batVoltageV /= count;
    } else {
        console.log('debug here');
        return;
    }

    if (dev.getParam() !== undefined) {
        var busName = dev.getParam().busName;
        if (escManager.storageList[busName] !== undefined && escManager.storageList[busName].available) {

            let esc = escManager.storageList[busName].data;
            //console.log('debug here');
            cbData.escBatVoltageV = esc.avergVoltageV;
            cbData.chargeControl = esc.chargeControl;
            cbData.dischargeControl = esc.dischargeControl;
            cbData.totalCurrentA = esc.totalCurrentA;
            cbData.totalRateChargeCurrentA = esc.totalRateChargeCurrentA;
            cbData.totalRateDischargeCurrentA = esc.totalRateDischargeCurrentA;
            cbData.totalRatedCapacityAh = esc.totalRatedCapacityAh;
            cbData.avergCapacityP = esc.avergCapacityP;
        }
    }

    if (axAiChart.charDataClusterFormated[invSerial] === undefined) {
        axAiChart.charDataClusterFormated[invSerial] = [];
    }

    formatValueDecimal(cbData);
    axAiChart.charDataClusterFormated[invSerial].push(cbData);

    if (dev.selected) {
        axAiChart.chartData.push(cbData);
        axAiChart.validateChartData();
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

axAiChart.loadChartData = function () {

};

function sortChartData(a, b) {
    if (a.date.getTime() < b.date.getTime())
        return -1;
    if (a.date.getTime() > b.date.getTime())
        return 1;
    return 0;
}




axAiChart.chart = AmCharts.makeChart("chartdiv",
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
                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] kW ",
                    "bullet": "none",
                    "id": "loadPower-1",
                    "title": "LOAD",
                    "valueField": "loadPower",
                    "valueFieldName": "loadPower",
                    "lineColor": "blue",
                    "type": "smoothedLine",
                    "valueAxis": "powerAcW"
                },
                {
                    "bullet": "none",
                    "id": "gridPower-1",
                    "title": "GRID",
                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] kW ",
                    "valueField": "gridPower",
                    "valueFieldName": "gridPower",
                    "lineColor": "red",
                    "type": "smoothedLine",
                    "valueAxis": "powerAcW"
                },
                {
                    "bullet": "none",
                    "id": "pvPower-1",
                    "title": "PV",
                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] kW ",
                    "valueField": "pvPower",
                    "valueFieldName": "pvPower",
                    "lineColor": "green",
                    "type": "smoothedLine",
                    "valueAxis": "powerAcW"
                },
                {
                    "bullet": "none",
                    "id": "batVoltageV-1",
                    "title": "Bat Voltage",
                    balloonText: "<span style='font-weight: 600;'>[[title]]</span>: [[value]] V  <br/>"
                            + "<span style='font-weight: 600;'>ESC Voltage:</span> [[escBatVoltageV]] V <br/>",
                    "valueField": "batVoltageV",
                    "valueFieldName": "batVoltageV",
                    "lineColor": "#fd00ff",
                    "type": "smoothedLine",
                    "valueAxis": "batVoltageV"
                },
                {
                    "bullet": "none",
                    "id": "batCurrentA-1",
                    balloonText: "<span style='font-weight: 600;'>Inv Bat Current:</span> [[value]] A <br/>"
                            + "<span style='font-weight: 600;'>ESC Current:</span> [[totalCurrentA]] A <br/>"
                            + "<span style='font-weight: 600;'>Rated Charge Current:</span> [[totalRateChargeCurrentA]] A <br/>"
                            + "<span style='font-weight: 600;'>Rated Discharge Current:</span> [[totalRateDischargeCurrentA]] A <br/>",
                    "title": "Bat Current",
                    "valueField": "batCurrentA",
                    "valueFieldName": "batCurrentA",
                    "lineColor": "#00daff",
                    "type": "smoothedLine",
                    "valueAxis": "batCurrentA"
                },
                {
                    "bullet": "none",
                    balloonText: "<span style='font-weight: 600;'>ESC Charge Ctrl:</span> [[value]] % <br/>",
                    "valueField": "chargeControl",
                    "valueFieldName": "chargeControl",
                    "lineColor": "orange",
                    "type": "smoothedLine",
                    "valueAxis": "chDchCtrl"
                },
                {
                    "bullet": "none",
                    balloonText: "<span style='font-weight: 600;'>ESC Discharge Ctrl:</span> [[value]] % <br/>",
                    "valueField": "dischargeControl",
                    "valueFieldName": "dischargeControl",
                    "lineColor": "orange",
                    "type": "smoothedLine",
                    "valueAxis": "chDchCtrl"
                }
            ],
            "guides": [],
            "valueAxes": [
                {
                    "id": "powerAcW",
                    "offset": 0,
                    "minimum": 0,
//                    "maximum": 60,
                    "unit": "W",
                    "autoGridCount": false,
                    "gridCount": 4,
                    "position": "right"
                },
                {
                    "id": "chDchCtrl",
                    "offset": 50,
                    "minimum": 0,
                    "maximum": 100,
                    "unit": "%",
                    "autoGridCount": false,
                    "gridCount": 4,
                    "position": "right",
                    "axisColor": "orange",
                    "color": "orange",
                    "gridColor": "orange"
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
                "useGraphSettings": true
            },
            "titles": [
                {
                    "id": "Title-1",
                    "size": 12,
                    "text": "Live Data Chart"
                }
            ],
            "dataProvider": axAiChart.chartData,
            "export": {
                "enabled": true
            }
        }
);




$(document).ready(function () {
    $('#basic').puidropdown({
        change: function (comp, selection) {
            axAiChart.onSelectedInverterUnitChange(selection.value);
        }
    });
    //  $('#basic').puidropdown('addOption', {label:'asdf', value: '3434'});
});
