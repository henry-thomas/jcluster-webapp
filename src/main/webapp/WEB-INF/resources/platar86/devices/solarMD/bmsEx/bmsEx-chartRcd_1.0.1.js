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

/* global cm, moment, am4charts, hh, devManager, dm */


var bexlcChartDefConf = {
    conf: {
        chartConf: {

        },
        chartType: 'XYChart',
        confName: 'default',
        confNameLabel: 'Default',
        gen: {
            showAdvancedSettings: true,
            showChartCursor: true
//            horizontalScroll: 'microChart'
        },
        legend: {
            showLegend: 'bottom'
        }
    },
    seriesConf: {
        enabled: true,
        hidden: false,
        seriesType: 'LineSeries'
    }
};

var bex_crcd = {
    dataBuf: {},
    name: 'bmsEx-rcdChartContainer',
    selectedDate: moment(),
    selectedDaysArr: [],
    reqSeries: {},
    dummySeriesNames: ['curA', 'voltageA'],
    knownSeriesEnergy: {},

    dataInfo: {},
    onDataReceived: function (dev, data) {
        if (!bex_crcd.enabled) {
            return;
        }
        if (bex_crcd.dataBuf[dev.serialNumber] === undefined) {
            bex_crcd.dataBuf[dev.serialNumber] = [];
        }
        let rec = {};
        rec.date = data.timeStamp;
        rec.currentA = data.current;
        let packVoltage = 0;
        for (var i = 0; i < data.cellVoltageVArr.length; i++) {
            if (i === 1) {
                let row = data.cellVoltageVRawArr[0];
                rec['cr' ] = data.cellVoltageVRawArr[0];
                row -= data.cellVoltageVRawArr[1];
                rec['crd' ] = row;
                row -= data.cellVoltageVRawArr[2];
                rec['cr1' ] = row;
                row -= data.cellVoltageVRawArr[3];
                rec['cr2' ] = row;
                rec['c' + (i)] = data.cellVoltageVArr[i];
            }
            packVoltage += data.cellVoltageVArr[i];
        }
        rec.packVoltage = packVoltage;

        //  bexlc.dataBuf[dev.serialNumber].push(data);
        bex_crcd.chart.chart.addData(rec);
//        console.log(dev);
    },

    init: function () {
        cm.createChart(
                document.getElementById(bex_crcd.name),
                'bmsEx-LiveChart',
                bexlcChartDefConf,
                function (chOb) {
//                    devManager.onDataReceived(bex_crcd.onDataReceived);
                    console.log(chOb);
                    bex_crcd.chart = chOb;
                    am4core.options.minPolylineStep = 5;
//                    bc.processData(dataObjArr);
                    //  bexlc.createChartTimeControl();
//                    debugger;
                    dm.onSelectedCustomDataReceived(bex_crcd.onDataReceived, 'BmsExDataRCD');
                    for (let i = 0; i < 16; i++) {
                        if (i === 1) {
                            bex_crcd.onVoltageSeriesDataReceived("c" + i, 'Cell' + (i + 1));
                        }
                    }

                    bex_crcd.onVoltageSeriesDataReceived("cr", 'Cell2 RAW');
                    bex_crcd.onVoltageSeriesDataReceived("crd", 'Cell2 RD1');
                    bex_crcd.onVoltageSeriesDataReceived("cr1", 'Cell2 RC1');
                    bex_crcd.onVoltageSeriesDataReceived("cr2", 'Cell2 RC2');

                    bex_crcd.onCurrentSeriesDataReceived("currentA", "Current");
                    bex_crcd.onPackVoltageSeriesDataReceived("packVoltage", "Pack V");
                    bex_crcd.chart.addRequiredSeries(bex_crcd.reqSeries);
                    bex_crcd.createChartTimeControl();
                }
        );

    },
    processData: function (dataObj) {
        wsm.sendDevMsgExecWithJsonInst({
            instrExt: 'getProdDataInfo'
        }, function (msg, data) {
            bex_crcd.dataInfo = data;
            bex_crcd.fetchProdData(bex_crcd.dataInfo.firstResult, 3000);



        });
    },

    onCurrentSeriesDataReceived: function (sName, label) {
        bex_crcd.reqSeries[label] = {
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
        bex_crcd.reqSeries[label] = {
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
        bex_crcd.reqSeries[label] = {
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

        let el = bex_crcd.chart.controlLeftDiv;
        let settingContainer = document.createElement('div');
        settingContainer.classList.add('chCtrl-datePicker');
        el.appendChild(settingContainer);

        bex_crcd.startChart = this.checked;

        let requestData = document.createElement('button');
        requestData.textContent = "Request 1 Min";
        requestData.classList.add('smdui-button');
        requestData.onclick = function () {
            bex_crcd.enabled = true;
            devManager.executeInstr('callDirectBcRequest', '500');
        };
        settingContainer.appendChild(requestData);

        let stopData = document.createElement('button');
        stopData.textContent = "Stop Data";
        stopData.classList.add('smdui-button');
        stopData.onclick = function () {
            bex_crcd.enabled = false;
            devManager.executeInstr('callDirectBcRequest', '0');
        };
        settingContainer.appendChild(stopData);

        let clearData = document.createElement('button');
        clearData.textContent = "Clear Data";
        clearData.classList.add('smdui-button');
        clearData.onclick = function () {
            bex_crcd.enabled = false;
            bex_crcd.chart.chartData.length = 0;
        };
        settingContainer.appendChild(clearData);
    }



};

$(document).ready(function () {
    bex_crcd.init();

//    bc.chart.chart.yAxes.values[0].renderer.opposite = true;
//    bc.chart.chart.yAxes.values[0].validate();
});
