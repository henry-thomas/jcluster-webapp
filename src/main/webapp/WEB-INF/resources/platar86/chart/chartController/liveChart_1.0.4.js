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


/* global cm, moment, am4charts, hh, am4core, sui */
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
    name: 'chartLc',
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
                'liveChart1',
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
                        lc.chart.chart.xAxes.values[0].keepSelection = true;
                    });

//                    lc.chart.settingsButton.style.display = 'none';
                    lc.chart.fullscreenButton.style.display = 'none';
                    lc.chart.chart.scrollbarX = null;
                }
        );
    },

    start: function () {
        lc.getPowerDataFromWS();
    },

    getPowerDataFromWS: function () {
        psManager.onPowerDataUpdateAll(function (messageList) {
            if (Object.keys(messageList).length > 0) {

                lc.onNewDataReceived(messageList);
            }
        });
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

            var obj = messageList[item];
            var pName = obj.powerName;
            if (pName !== undefined) {
                if (!lc.knownSeriesPower[pName]) {
                    lc.onSeriesDataReceived(pName);
                    lc.knownSeriesPower[pName] = true;
                    lc.chart.addRequiredSeries(lc.reqSeries);
                }
                liveDataObj[pName + '-powerW'] = messageList[item].powerW;
//                liveDataObj[pName + '-voltageV'] = messageList[item].voltageV;
//                liveDataObj[pName + '-currentA'] = messageList[item].currentA;
                if (!liveDataObj.hasTime) {
                    liveDataObj['date'] = new Date(messageList[item].lastUpdate).getTime();
                    liveDataObj.hasTime = true;
                }
            } else {
                liveDataObj = {};
            }
        }
        lc.addDataToChart(liveDataObj);
    },

    addDataToChart: function (liveDataObj) {
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
        if (lc.chart.chart.data.length > 1) {
            lc.setBullets();

            if (lc.initFlag === false) {
                lc.initFlag = true;
//                lc.chart.chart.xAxes.values[0].interpolationDuration = 500;
                lc.chart.chart.xAxes.values[0].rangeChangeDuration = 500;
//                lc.chart.chart.yAxes.values[0].interpolationDuration = 500;
                lc.chart.chart.yAxes.values[0].rangeChangeDuration = 500;
            }
        }
    },

    onSeriesDataReceived: function (powerName, data) {
        lc.reqSeries[powerName] = {
            name: powerName,
            yAxis: 'powerW',
            valueAxisY: 'powerW',
            seriesType: 'LineSeries',
            //tooltip text config start here 
            toolTipDefault: "Power only",
            toolTipOptions: [
                {
                    label: "None",
                    value: ""
                },
                {
                    label: "Power only",
                    value: "{name}: [bold]{valueY.formatNumber('#.## aW')}"
                },
                {
                    label: "Power + Voltage + Current",
                    value: "{name}: [bold]{valueY.formatNumber('#.## aW')}[/]\nVoltage: [bold]{" + powerName + "-voltageV.formatNumber('#.## aV')}[/]\nCurrent: [bold]{" + powerName + "-currentA.formatNumber('#.## a')} A"
                }

            ],
            dataFields: {
                valueY: powerName + '-powerW',
                dateX: 'date'
            },
            onSeriesCreatedCb: function () {
                for (let i = 0; i < lc.chart.chart.series.values.length; i++) {
                    let series = lc.chart.chart.series.values[i];
                    series.interpolationDuration = 500;
                    series.defaultState.transitionDuration = 500;
                    series.numberFormatter.numberFormat = "##.## aW";
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