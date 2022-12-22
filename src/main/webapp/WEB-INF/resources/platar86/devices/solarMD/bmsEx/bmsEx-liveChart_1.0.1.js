/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by platar86, 2020
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */


/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2020
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 Sout Africa
 *  Phone: 021 555 2181
 *  
 */

//mainUtils.loadScriptJSFResource('chart/chartManager.js', 'platar86', function () {
//    console.log('asdfasdfasdfasfasdfasfd');
//    bc.init();
//});

/* global cm, moment, am4charts, hh, devManager */


var bexlcChartDefConf = {
    conf: {
        chartConf: {

        },
        chartType: 'XYChart',
        confName: 'default',
        confNameLabel: 'Default',
        gen: {
            showAdvancedSettings: true,
            showChartCursor: true,
            horizontalScroll: 'none'
        },
        legend: {
            showLegend: 'bottom'
        }
    },
    seriesConf: {
        enabled: true,
        seriesType: 'LineSeries'
    }
};

var bexlc = {
    dataBuf: {},
    name: 'bmsEx-liveChartContainer',
    selectedDate: moment(),
    selectedDaysArr: [],
    reqSeries: {},
    dummySeriesNames: ['curA', 'voltageA'],
    knownSeriesEnergy: {},
    isInit: false,

    dataInfo: {},
    onDataReceived: function (dev, data) {
        if (bexlc.startChart === undefined) {
            bexlc.startChart = false;
        }
        if (bexlc.startChart === false) {
            return;
        }
        if (bexlc.dataBuf[dev.serialNumber] === undefined) {
            bexlc.dataBuf[dev.serialNumber] = [];
        }
        let rec = {};
        rec.date = new Date().getTime();
        rec.currentA = data.currentA;
        let packVoltage = 0;
        for (var i = 0; i < data.cellVoltageVArr.length; i++) {

            rec['c' + (i)] = data.cellVoltageVArr[i];
            packVoltage += data.cellVoltageVArr[i];
        }
        rec.packVoltage = packVoltage;

        //  bexlc.dataBuf[dev.serialNumber].push(data);
        bexlc.chart.chart.addData(rec);
//        console.log(dev);
    },

    init: function () {
        cm.createChart(
                document.getElementById(bexlc.name),
                'bmsEx-LiveChart',
                bexlcChartDefConf,
                function (chOb) {
                    devManager.onDataReceived(bexlc.onDataReceived);
                    console.log(chOb);
                    bexlc.chart = chOb;
//                    bc.processData(dataObjArr);
                    //  bexlc.createChartTimeControl();

                    for (let i = 0; i < 16; i++) {
                        bexlc.onVoltageSeriesDataReceived("c" + i, 'Cell' + (i + 1));
                    }

//                    bexlc.onVoltageSeriesDataReceived("cr", 'Cell2 RAW');
//                    bexlc.onVoltageSeriesDataReceived("crd", 'Cell2 RD1');
//                    bexlc.onVoltageSeriesDataReceived("cr1", 'Cell2 RC1');
//                    bexlc.onVoltageSeriesDataReceived("cr2", 'Cell2 RC2');

                    bexlc.onCurrentSeriesDataReceived("currentA", "Current");
                    bexlc.onPackVoltageSeriesDataReceived("packVoltage", "Pack V");
                    bexlc.chart.addRequiredSeries(bexlc.reqSeries);
//                    bexlc.createChartTimeControl();

                    bexlc.chart.chart.events.on("datavalidated", function () {
                        bexlc.chart.chart.xAxes.values[0].zoom({start: 1 / 15, end: 1.05}, false, true);
                        bexlc.chart.chart.xAxes.values[0].keepSelection = true;
                    });

                    bexlc.chart.onSeriesAdded(function (series) {
                        bexlc.chart.chart.events.on("datavalidated", function () {
                            series.validateData();
                        });
                    });

                    document.querySelector('.smdui-chart-container').style.background = 'white';

//                    bexlc.isInit = true;

                }
        );
    },

    processData: function (dataObj) {
        wsm.sendDevMsgExecWithJsonInst({
            instrExt: 'getProdDataInfo'
        }, function (msg, data) {
            bexlc.dataInfo = data;
            bexlc.fetchProdData(bexlc.dataInfo.firstResult, 3000);



        });
    },

    onCurrentSeriesDataReceived: function (sName, label) {
        bexlc.reqSeries[label] = {
            name: label,
            yAxis: 'currentA',
            valueAxisY: 'currentA',
            seriesType: 'LineSeries',
            //tooltip text config start here 
            toolTipDefault: "Current: Value",
            toolTipOptions: [
                {
                    label: "None",
                    value: ""
                },
                {
                    label: "Current: Value",
                    value: "{name}: [bold]{valueY}A"
                }

            ],
            dataFields: {
                valueY: sName,
                dateX: 'date'
            }
        };
    },

    onPackVoltageSeriesDataReceived: function (sName, label) {
        bexlc.reqSeries[label] = {
            name: sName,
            yAxis: 'PackVoltageV',
            valueAxisY: 'PackVoltageV',
            seriesType: 'LineSeries',
            //tooltip text config start here 
            toolTipDefault: "None",
            toolTipOptions: [
                {
                    label: "None",
                    value: ""
                },
                {
                    label: "Pack: Voltage",
                    value: "{name}: [bold]{valueY}V"
                }

            ],
            dataFields: {
                valueY: sName,
                dateX: 'date'
            }
        };
    },
    onVoltageSeriesDataReceived: function (sName, label) {
        bexlc.reqSeries[label] = {
            name: sName,
            yAxis: 'voltageV',
            valueAxisY: 'voltageV',
            seriesType: 'LineSeries',
            //tooltip text config start here 
            toolTipDefault: "None",
            toolTipOptions: [
                {
                    label: "None",
                    value: ""
                },
                {
                    label: "Cell: Voltage",
                    value: "{name}: [bold]{valueY}V"
                }

            ],
            dataFields: {
                valueY: sName,
                dateX: 'date'
            }
        };
    },

    createChartTimeControl: function () {

//        let el = bexlc.chart.controlLeftDiv;
//        let settingContainer = document.createElement('div');
//        settingContainer.classList.add('chCtrl-datePicker');
//        el.appendChild(settingContainer);
//
//
//        let swLabel = document.createElement('label');
//        swLabel.textContent = "Enable Chart";
//        swLabel.classList.add('smdui-switchLabel');
//        let swInput = document.createElement('input');
//        swInput.type = 'checkbox';
//
//        let swSpan = document.createElement('span');
//        swSpan.classList.add('smdui-switchSlider');
//        swSpan.classList.add('smdui-switchSliderRound');
//
//        swLabel.appendChild(swInput);
//        swLabel.appendChild(swSpan);
//
//        swInput.onchange = function (a) {
//            bexlc.startChart = this.checked;
//        };
//
//
//
//        settingContainer.appendChild(swLabel);
    }



};

//$(document).ready(function () {
//    bexlc.init();
//    bc.chart.chart.yAxes.values[0].renderer.opposite = true;
//    bc.chart.chart.yAxes.values[0].validate();
//});

//Primefaces TabView passes index of changed tab to here
handleTabChange = function (index) {
//    debugger;
    if (event.currentTarget.textContent === "Live Chart") {
        if (!bexlc.isInit) {
            bexlc.init();
//            console.log('hi');
            bexlc.startChart = true;
            bexlc.isInit = true;
        }
    }
};