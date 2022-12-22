/* global am4charts, cm, sui */

///*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
// * 
// *  Unauthorized copying of this file, via any medium is strictly prohibited
// *  Proprietary and confidential
// *  
// *  Written by henry, 2022
// *  
// *  For more information http://www.solarmd.co.za/ 
// *  email: info@solarmd.co.za
// *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
// *  Phone: 021 555 2181
// *  
// */
//
var chartDefConf = {

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
    },
    hiddenConfCtrls: {
        gen: ['horizontalScroll', 'chartCursor'],
        tool: [],
        legend: ['legendDisplay'],
        series: [],
        yAxes: []
    },
    transferConfigCharts: [
        {
            name: 'Energy Chart',
            cb: function () {
                cm.tranferChartConfig({toName: "Energy Chart", fromValue: "liveChart1", toValue: "energyHistory1"});
            }},
        {
            name: 'Power Chart',
            cb: function () {
                cm.tranferChartConfig({toName: "PowerChart", fromValue: "liveChart1", toValue: "powerHistory1"});
            }}
    ]

};
var lc = {
    initFlag: false,
    hasLabelBulletsOnChart: false,
    name: 'winlineLiveChart',
    tempDataBuff: [],
    dataBuffLength: 3600, //3hours //max length of tempDataBuff array, which can potentially be used for calculations or used for data exports.
    chartBuffLength: 20, //indicates the number of datapoints on the chart
    maxChartBuffLength: 1210, //3 second intervals, so 200 datapoints is 600secs
    tempDataInRange: [],
    timeInterval: 3000,
    reqSeries: {},
    knownSeriesPower: {},
    init: function () {

        cm.createChart(
                document.getElementById(lc.name),
                'winlineLiveChart',
                chartDefConf,
                function (chOb) {
                    lc.chart = chOb;
                    lc.createChartTimeControl();
                    lc.createLegendOptions();

                    lc.chart.chart.zoomOutButton.disabled = true;

                    lc.chart.chart.cursor.behavior = "none";
                    lc.chart.onTemplateChange(lc.refreshData);
                    lc.chart.chart.events.on("datavalidated", function () {
                        lc.chart.chart.xAxes.values[0].zoom({start: 1 / 15, end: 1.1}, false, true);
//                        lc.chart.chart.xAxes.values[0].keepSelection = true;
                    });

//                    lc.chart.settingsButton.style.display = 'none';
                    lc.chart.fullscreenButton.style.display = 'none';
                    lc.chart.chart.scrollbarX = null;
                }
        );
    },

    setBullets: function () {
        let bullet = [];
        let circleBullet = [];
        for (let i = 0; i < lc.chart.chart.series.values.length; i++) {
            let series = lc.chart.chart.series.values[i];

            series.hasBullet = false;
            for (let j = 0; j < series.children.values.length; j++) {
                if (!series.disabled && (series.children.values[j].className === 'LabelBullet' || series.children.values[j].className === 'CircleBullet')) {
                    series.hasBullet = true;
                }
            }
            if (series && series.hasBullet === false && !series.disabled) {
                bullet[i] = series.createChild(am4charts.LabelBullet);//
                circleBullet[i] = series.createChild(am4charts.CircleBullet);//
                bullet[i].fillOpacity = 1;
                circleBullet[i].fillOpacity = 1;
                bullet[i].isMeasured = false;
                series.events.on("validated", function () {

                    if (lc.hasLabelBulletsOnChart) {
                        bullet[i].show();
                        circleBullet[i].hide();
                        bullet[i].label.text = series.dataItems.last.valueY;
                        bullet[i].label.numberFormatter.numberFormat = "##.## aW";
                        let val = Number(series.dataItems.last.valueY).toFixed(2);
                        if (val > 1000) {
                            val = (val / 1000).toFixed(2) + 'k';
                        }
                        bullet[i].label.text = "[bold]" + val + "W";
                        bullet[i].dx = 30;
                        series.legendSettings.labelText = "{name}";
                        if (series.dataItems.last !== undefined) {
                            bullet[i].moveTo(series.dataItems.last.point);
                        }
                        bullet[i].validatePosition();
                    } else {
                        bullet[i].hide();
                        circleBullet[i].show();
                        series.legendSettings.labelText = "{name}\n[bold]{valueY.close}";
                        circleBullet[i].fill = series.stroke;
                        if (series.dataItems.last !== undefined) {
                            circleBullet[i].moveTo(series.dataItems.last.point);
                        }
                        circleBullet[i].validatePosition();
                    }
                });
            }
        }
    },

    onNewDataReceived: function (messageList) {
        let liveDataObj = {};

        for (var item in messageList) {

            var obj = messageList;
            var pName = item;
            if (pName !== undefined) {
                if (!lc.knownSeriesPower[pName]) {
                    lc.onSeriesDataReceived(pName);
                    lc.knownSeriesPower[pName] = true;
                    lc.chart.addRequiredSeries(lc.reqSeries);
                }
                liveDataObj = messageList;
//                liveDataObj[pName + '-voltageV'] = messageList[item].voltageV;
//                liveDataObj[pName + '-currentA'] = messageList[item].currentA;
//                if (!liveDataObj.hasTime) {
//                    liveDataObj['date'] = new Date(messageList[item].lastUpdate).getTime();
//                    liveDataObj.hasTime = true;
//                }
            } else {
                liveDataObj = {};
            }
        }
        lc.addDataToChart(liveDataObj);
    },

    addDataToChart: function (liveDataObj) {
        if (lc.chart.chart.data.length > 1) {

            if (lc.initFlag === false) {
                lc.initFlag = true;
                lc.setBullets();
//                lc.chart.chart.xAxes.values[0].renderer.inside = true;
//                lc.chart.chart.xAxes.values[0].rangeChangeDuration = 500;
//                lc.chart.chart.xAxes.values[0].interpolationDuration = 500;
//                lc.chart.chart.yAxes.values[0].interpolationDuration = 500;
//                lc.chart.chart.yAxes.values[0].rangeChangeDuration = 500;

            }
        }

        if (lc.tempDataBuff.length > lc.dataBuffLength)
        {
            lc.tempDataBuff.shift();
            lc.tempDataBuff.push(liveDataObj);
        } else {
            lc.tempDataBuff.push(liveDataObj);
        }

        if (lc.tempDataBuff.length > lc.maxChartBuffLength) {
            lc.tempDataInRange.shift();
            lc.tempDataInRange.push(liveDataObj);
        } else {
            lc.tempDataInRange.push(liveDataObj);
        }


        //****Chart x-Axis Range****//
        let diffLength = lc.chart.chart.data.length - lc.chartBuffLength + 1;
        if (lc.maxChartBuffLength !== lc.chartBuffLength) {
            if (lc.chart.chart.data.length < lc.chartBuffLength) {
                lc.chart.chart.addData(liveDataObj);
            } else {
                lc.chart.chart.addData(liveDataObj, diffLength);
            }
        } else {
            lc.chart.chart.addData(liveDataObj);
        }

    },

    onSeriesDataReceived: function (powerName, seriesDesc) {
        let fdName = powerName;
        if (lc.reqSeries[powerName] !== undefined || powerName === "date") {
            return;
        }
        let name = powerName;
        let yAxis = 'value';
        let toolTipText = '{name}: [bold]{valueY}';
        try {
//            let seriasDescObj = dataRecFieldMap.modelMap[seriesDesc.model][powerName];
//            name = seriasDescObj.title;
//            yAxis = seriasDescObj.axis;
//            toolTipText = seriesDesc.serNum + '-' + seriasDescObj.ballonText;
        } catch (e) {
        }

        lc.reqSeries[fdName] = {
            name: fdName,
            title: name,
            yAxis: yAxis,
            valueAxisY: yAxis,
            seriesType: 'LineSeries',
            //tooltip text config start here 
            toolTipDefault: "Value only",
            toolTipOptions: [
                {
                    label: "Value only",
                    value: toolTipText
                }
            ],
            dataFields: {
                valueY: fdName,
                dateX: 'date'
            },
            onSeriesCreatedCb: function () {
                for (let i = 0; i < lc.chart.chart.series.values.length; i++) {
                    let series = lc.chart.chart.series.values[i];
                    series.interpolationDuration = 0;
                    series.defaultState.transitionDuration = 0;
                    series.numberFormatter.numberFormat = "##.## a";

                    series.xAxis.interpolationDuration = 1000;
                    series.xAxis.rangeChangeDuration = 250;
                    series.xAxis.renderer.axisFills.template.disabled = true;
                    series.xAxis.renderer.ticks.template.disabled = true;
                    series.xAxis.renderer.inside = true;

                    series.yAxis.rangeChangeDuration = 250;
                    series.yAxis.interpolationDuration = 1000;
                    series.yAxis.renderer.axisFills.template.disabled = true;
                    series.yAxis.renderer.ticks.template.disabled = true;
                    series.yAxis.renderer.inside = true;
                    series.tensionX = 0.8;

//                    series.events.on("validated", function () {
//                        bullet.moveTo(series.dataItems.last.point);
//                        bullet.validatePosition();
//                    });
                }
            }
        };
    },

    createChartTimeControl: function () {

        let el = lc.chart.controlLeftDiv;
        let settingContainer = document.createElement('div');
        settingContainer.style.height = 'fit-content';
        settingContainer.style.gridArea = 'timeControl';
        settingContainer.classList.add('chCtrl-datePicker');
        settingContainer.classList.add('sui-btn-default--button');
        el.appendChild(settingContainer);
        lc.selectedDateHidSlider = new HidSlider(settingContainer, {
            labelFormatter: function (v) {
                if (v === lc.maxChartBuffLength) {
                    return '3 Hours (MAX)';
                }
                if (v * 3 > 60) {
                    return Math.floor(v * 3 / 60) + ' Minutes ' /*+ v * 3 % 60 + ' Sec'*/;
                }
                return v * 3 + ' Seconds';
            },
            val: lc.chartBuffLength,
            minVal: 10,
            maxVal: lc.maxChartBuffLength,
            step: 10,
            hideOnChange: true,
            containerClass: 'chCtrl-datePicker-control',
            inputWidth: '75px',
            onValueChange: function (val) {
                lc.chart.chart.data = [];
                lc.chartBuffLength = val;
                for (let i = val; i >= 1; i--) {
                    lc.chart.chart.addData(lc.tempDataBuff[lc.tempDataBuff.length - i]);
                }
            }

        });
//        lc.selectedDateHidSlider.classList.add('sui-btn-default--button');
    },

    refreshData: function () {
//        lc.chart.chart.reinit();
//        lc.selectedDateHidSlider.onChange(lc.chartBuffLength);
//        lc.chart.chart.invalidateData();
        console.log('refreshed');
    },

    createLegendOptions: function () {
        let el = lc.chart.controlLeftDiv;


        let dropdown = sui.dropdown();
//        dropdown.wrapper.style.maxWidth = '115px';
        dropdown.style.gridArea = 'valueDisplay';
        el.style.display = 'grid';
        el.style.gridTemplate = 'auto/120px auto';
        el.style.gridTemplateAreas = "'timeControl valueDisplay'";
        el.style.alignItems = 'center';
        el.style.justifyItems = 'center';
        dropdown.text = 'Value Display';
        dropdown.items = [
            {name: 'In Legend', cb: function () {
                    lc.hasLabelBulletsOnChart = false;
                }.bind(this)},
            {name: 'On Chart', cb: function () {
                    lc.hasLabelBulletsOnChart = true;
                }.bind(this)}
        ];
        el.appendChild(dropdown);
    }

};


$(document).ready(function () {
    lc.init();
});