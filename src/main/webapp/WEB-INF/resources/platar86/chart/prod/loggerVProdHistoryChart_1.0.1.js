/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by brais, 2020
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */


/* global cm, moment, am4charts, hh */
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
            horizontalScroll: 'simple'
        },
        legend: {
            showLegend: 'bottom'
        }
    },
    seriesConf: {
        enabled: true,
        seriesType: 'ColumnSeries'
    }
};
var lphc = {
    name: 'chartLphc',
    selectedDateHisRange: 5,
    selectedDate: moment().subtract(0, 'days'),
    selectedDaysArr: [],
    tempDataBuff: {},
    reqSeries: {},
    knownSeriesBatProd: {},
    knownDaysArr: {}, // Used to hold and remember fetched dates
    rangeDataArr: [], // Used to hold the xSelection data
    selectedPeriod: "daily",
    currentDataFields: {},

    period: {daily: {
            dateKey: "Day",
            amChartsDateKey: "day",
            momentDateFormat: 'YYYY-MM-DD',
            amChartsDateFormat: 'yyyy-MMM-dd',
            momentDateInterval: 'days',
            maxHistory: 30,
            standardHistory: 5,
            dataSuffix: '-dailyProduction'
        },
        weekly: {
            dateKey: "Week",
            amChartsDateKey: "week",
            momentDateFormat: 'YYYY-WW',
            amChartsDateFormat: 'yyyy-ww',
            momentDateInterval: 'weeks',
            maxHistory: 52,
            standardHistory: 3,
            dataSuffix: '-weeklyProduction'
        },
        monthly: {
            dateKey: "Month",
            amChartsDateKey: "month",
            momentDateFormat: 'YYYY-MM',
            amChartsDateFormat: 'yyyy-MMM',
            momentDateInterval: 'months',
            maxHistory: 12,
            standardHistory: 1,
            dataSuffix: '-monthlyProduction'
        },
        yearly: {
            dateKey: "Year",
            amChartsDateKey: "year",
            momentDateFormat: 'YYYY',
            amChartsDateFormat: 'yyyy',
            momentDateInterval: 'years',
            maxHistory: 5,
            standardHistory: 1,
            dataSuffix: '-yearlyProduction'
        }
    },

    init: function () {
        cm.createChart(
                document.getElementById(lphc.name),
                'loggerVProdHistory1',
                chartDefConf,
                function (chOb) {
                    chOb.showLoadingIndicator('Loading Data ...');
                    console.log('chart Init Complete');
                    lphc.chart = chOb;
                    lphc.dataBuff = chOb.chartDataDateBuff;
                    chOb.chart.numberFormatter.numberFormat = "#";
                    lphc.createChartTimeControl();
                    lphc.onDateSelectionChange();
                }
        );
    },
    getLoggerVProdDataFromServer: function (dateToFetchArr) {
        console.log('Getting data from server...');
        chartUtilGetLoggerVProdDataFromDb([
            {
                name: "requestedDates",
                value: JSON.stringify(dateToFetchArr)
            },
            {
                name: "period",
                value: lphc.selectedPeriod
            },
            {
                name: "calbackFn",
                value: "lphc.proccessData"
            }
        ]);
    },
    onDateSelectionChange: function () {
        let daysLookup = lphc.selectedDateHisRange;
        let selectedDate = moment(lphc.selectedDate);
        let dateToFetchArr = [];
        lphc.selectedDaysArr.length = 0;
        while (daysLookup > 0) {
            let targetDateStr = selectedDate.format(lphc.period[lphc.selectedPeriod].momentDateFormat);
            lphc.selectedDaysArr.push(targetDateStr);
            if (!lphc.knownDaysArr[targetDateStr]) {
                dateToFetchArr.push(targetDateStr);
                lphc.knownDaysArr[targetDateStr] = true;
            }
            daysLookup--;
            selectedDate.subtract(1, lphc.period[lphc.selectedPeriod].momentDateInterval);
        }
        lphc.selectedDaysArr.sort();
        if (dateToFetchArr.length > 0) {
            lphc.getLoggerVProdDataFromServer(dateToFetchArr);
        } else {
            lphc.onDataReceived();
        }
    },
    onDataReceived: function () {
        lphc.chart.chartData = [];
        lphc.chart.chart.data = lphc.chart.chartData;
        lphc.chart.chart.dateFormatter.inputDateFormat = lphc.period[lphc.selectedPeriod].amChartsDateFormat;
        lphc.chart.chart.xAxes.values[0].dateFormats.setKey(lphc.period[lphc.selectedPeriod].amChartsDateKey, lphc.period[lphc.selectedPeriod].amChartsDateFormat);
        lphc.chart.chart.xAxes.values[0].periodChangeDateFormats.setKey(lphc.period[lphc.selectedPeriod].amChartsDateKey, lphc.period[lphc.selectedPeriod].amChartsDateFormat);
        for (var i = 0; i < lphc.selectedDaysArr.length; i++) {
            let dayArr = lphc.dataBuff[lphc.selectedDaysArr[i]];
            if (dayArr) {
                lphc.chart.chart.addData(dayArr);
            }
        }

        lphc.chart.addRequiredSeries(lphc.reqSeries);
        lphc.chart.hideLoadingIndicator();
        lphc.chart.chart.validateData();
        if (lphc.chart.chartData.length < 1) {
            lphc.chart.showLoadingIndicator('No data for the selected period', true);
        } else {
            lphc.average = 0;
            lphc.dataPoints = 0;
            for (let date in lphc.chart.chartData) {
                for (let dataField in lphc.chart.chartData[date]) {
                    for (let seriesName in lphc.knownSeriesBatProd) {
                        if (dataField === (seriesName + lphc.period[lphc.selectedPeriod].dataSuffix)) {
                            console.log(dataField);
                            lphc.average += lphc.chart.chartData[date][seriesName + lphc.period[lphc.selectedPeriod].dataSuffix];
                            lphc.dataPoints += 1;
                        }
                    }
                }
            }
            lphc.average = lphc.average / lphc.dataPoints;
        }
//        lphc.chart.onSeriesAdded(function (series) { //callback added to chartManager
//            lphc.chart.chart.events.on('datavalidated', function () {
//                if (lphc.range) {
//                    lphc.chart.chart.yAxes.values[0].axisRanges.removeValue(lphc.range);
//                    lphc.range = lphc.chart.chart.yAxes.values[0].axisRanges.create();
//                    lphc.range.grid.strokeOpacity = 0.5;
//                    lphc.range.grid.strokeWidth = 3;
//                } else {
//                    lphc.range = lphc.chart.chart.yAxes.values[0].axisRanges.create();
//                    lphc.range.grid.strokeOpacity = 0.5;
//                    lphc.range.grid.strokeWidth = 3;
//
//                }
//                lphc.range.label.inide = true;
//                lphc.range.label.verticalCenter = "bottom";
//                lphc.range.value = lphc.average;
//                lphc.range.label.text = "Average: [bold]"+lphc.range.value.toFixed(0).toString();
//            });
//
//            if (lphc.chart.chart.series.values.length === Object.keys(lphc.knownSeriesBatProd).length) {
//                lphc.chart.chart.validateData();
//            }
//        });
    },
    onSeriesPeriodChange: function () {
        // Updating series dataFields
        lphc.currentDataFields = {
            valueY: lphc.period[lphc.selectedPeriod].dataSuffix,
            dateX: 'date'
        };

        lphc.chart.onDataFieldsChanged(lphc.currentDataFields); // Only call this if there is a chance the the datafields can change


        // Updating calendar period
        lphc.selectedDateHidSlider.label.textContent = function () {
            let label = lphc.selectedDateHidSlider.val;
            if (label > 1) {
                return label + ' ' + lphc.period[lphc.selectedPeriod].dateKey + 's';
            }
            return label + ' ' + lphc.period[lphc.selectedPeriod].dateKey;

        }();
    },
    createChartTimeControl: function () {

        let el = lphc.chart.controlLeftDiv;
        let settingContainer = document.createElement('div');
        settingContainer.classList.add('chCtrl-datePicker');
        el.appendChild(settingContainer);
        lphc.selectedDateHidSlider = new HidSlider(settingContainer, {
            labelFormatter: function (v) { //Adjust here to match the period (daily = days, monthly = months, etc)
                if (v > 1) {
                    return v + ' ' + lphc.period[lphc.selectedPeriod].dateKey + 's';
                }
                return v + ' ' + lphc.period[lphc.selectedPeriod].dateKey;
            },
            val: lphc.selectedDateHisRange,
            minVal: 1,
            maxVal: lphc.period[lphc.selectedPeriod].maxHistory,
            hideOnChange: true,
            containerClass: 'chCtrl-datePicker-control',
            inputWidth: '75px',
            onValueChange: function (val) {
                lphc.selectedDateHisRange = val;
                this.labelFormatter = function (v) { //Adjust here to match the period (daily = days, monthly = months, etc)
                    if (v > 1) {
                        return v + ' ' + lphc.period[lphc.selectedPeriod].dateKey + 's';
                    }
                    return v + lphc.period[lphc.selectedPeriod].dateKey;
                },
                        lphc.onDateSelectionChange();
            }

        });
        let leftArrow = document.createElement('div');
        leftArrow.classList.add('chCtrl-datePicker-icon');
        let leftArrowIcon = document.createElement('i');
        hh.addClass(leftArrowIcon, ['fas', 'fa-arrow-circle-left']);
        leftArrow.appendChild(leftArrowIcon);
        settingContainer.appendChild(leftArrow);
        leftArrow.onclick = function () {
            lphc.selectedDate.subtract(1, 'day');
            lphc.selectedDateLabel.textContent = lphc.selectedDate.format(lphc.selectedDateFormatter);
            lphc.onDateSelectionChange();
        };
        let rightArrow = document.createElement('div');
        rightArrow.classList.add('chCtrl-datePicker-icon');
        let rightArrowIcon = document.createElement('i');
        hh.addClass(rightArrowIcon, ['fas', 'fa-arrow-circle-right']);
        rightArrow.appendChild(rightArrowIcon);
        rightArrow.onclick = function () {
            if (moment(lphc.selectedDate).add(1, 'day').isBefore(moment())) {
                lphc.selectedDate.add(1, 'day');
                lphc.selectedDateLabel.textContent = lphc.selectedDate.format(lphc.selectedDateFormatter);
                lphc.onDateSelectionChange();
            }
        };
        lphc.selectedDateFormatter = 'DD MMM YYYY';
        let calendar = document.createElement('span');
        calendar.classList.add('chCtrl-datePicker-control');
        lphc.selectedDateLabel = calendar;
        lphc.selectedDateLabel.textContent = lphc.selectedDate.format(lphc.selectedDateFormatter);
        $(calendar).daterangepicker({
            singleDatePicker: true,
            startDate: lphc.selectedDate,
            minYear: moment(),
            maxDate: moment()
        }, function (start, end, label) {
            lphc.selectedDate = start;
            lphc.selectedDateLabel.textContent = lphc.selectedDate.format(lphc.selectedDateFormatter);
            lphc.onDateSelectionChange();
        });
        settingContainer.appendChild(calendar);
        settingContainer.appendChild(rightArrow);

        let periodControl = document.querySelector(".chCtrl-datePicker");
        let periodArr =
                [{value: 'daily', label: 'Daily'},
                    {value: 'weekly', label: 'Weekly'},
                    {value: 'monthly', label: 'Monthly'},
                    {value: 'yearly', label: 'Yearly'}];
        let periodDropDown = new SMDUIDropDown(periodControl, {
            val: lphc.selectedPeriod,
            options: periodArr,
            containerClass: 'chCtrl-datePicker-control',
            onValueChange: function (val, args) {
                lphc.selectedPeriod = val;
                lphc.selectedDateHidSlider.setValue(lphc.period[lphc.selectedPeriod].standardHistory);
                lphc.selectedDateHisRange = lphc.period[lphc.selectedPeriod].standardHistory;

                lphc.chart.chart.dateFormatter.inputDateFormat = lphc.period[lphc.selectedPeriod].amChartsDateFormat;
                lphc.onSeriesPeriodChange();
                lphc.onDateSelectionChange();
                lphc.onDataReceived();
                lphc.selectedDateHidSlider.setMax(lphc.period[lphc.selectedPeriod].maxHistory);
            }.bind(this)});
        lphc.periodDropDown = periodDropDown;


    },
    proccessData: function (loggerVProdDataJson, args, err) {
        if (err !== undefined && err !== "null") {
            return;
        }

        let loggerVProdData = JSON.parse(loggerVProdDataJson);
        console.log(loggerVProdData);
        if (loggerVProdData !== null) {
            let loggerVProdDataArr = Object.entries(loggerVProdData);
            console.log(loggerVProdDataArr);
            for (let i = 0; i < loggerVProdDataArr.length; i++) {
                let periodData = [];
                periodData.push(loggerVProdDataArr[i][0]);
                let periodItems = Object.entries(loggerVProdDataArr[i][1]);
                for (let j = 0; j < periodItems.length; j++) {
                    let periodItem = [];
                    periodItem.push(loggerVProdDataArr[i][0]);
                    periodItem.push(periodItems[j][0]);
                    periodItem.push(periodItems[j][1]);
                    lphc.dataExtractorSimpleLoggerModel(periodItem[0], periodItem[1], periodItem[2]);
                }
            }
        }
        lphc.dataExtractorSimpleLoggerModelSorting();
        lphc.onDataReceived();
        lphc.chart.addRequiredSeries(lphc.reqSeries);
        lphc.chart.hideLoadingIndicator();
        lphc.chart.chart.validateData();
    },
    dataExtractorSimpleLoggerModel: function (dateStr, loggerModel, total) {
        if (lphc.reqSeries[loggerModel] === undefined) {

            lphc.reqSeries[loggerModel] = {
                name: loggerModel,
                yAxis: 'loggerVProdTotal',
                valueAxisY: 'loggerVProdTotal',
                seriesType: 'ColumnSeries',
                // Tooltip text config start here 
                toolTipDefault: "Total",
                toolTipOptions: [
                    {
                        label: "None",
                        value: ""
                    },
                    {
                        label: "Total",
                        value: '[bold]{name}[/]\nTotal: [bold]{valueY}[/]'
                    }
                ],
                dataFields: {
                    valueY: loggerModel + lphc.period[lphc.selectedPeriod].dataSuffix,
                    dateX: 'date'
                }
            };
        }

        if (total) {
            lphc.knownSeriesBatProd[loggerModel] = lphc.knownSeriesBatProd[loggerModel] || true;
            let arr = lphc.tempDataBuff[dateStr] = lphc.tempDataBuff[dateStr] || [];

            let obj = {};
            obj['date'] = dateStr;

            switch (lphc.selectedPeriod) {
                case 'weekly':
                    obj[loggerModel + '-weeklyProduction'] = Number(total);
                    break;

                case 'monthly':
                    obj[loggerModel + '-monthlyProduction'] = Number(total);
                    break;

                case 'yearly':
                    obj[loggerModel + '-yearlyProduction'] = Number(total);
                    break;

                default:
                    obj[loggerModel + '-dailyProduction'] = Number(total);
                    break;
            }
            arr.push(obj);
        }
    },
    dataExtractorSimpleLoggerModelSorting: function () {

        for (var dateStr in lphc.tempDataBuff) {
            let periodDataArr = lphc.tempDataBuff[dateStr];
            let dataArrObj = {};

            for (var i = 0; i < periodDataArr.length; i++) {
                let curObj = periodDataArr[i];

                if (dataArrObj.date === undefined) {
                    dataArrObj.date = curObj.date;
                }
                for (var fieldName in curObj) {
                    if (fieldName !== 'date')
                        dataArrObj[fieldName] = curObj[fieldName];
                }
            }
            lphc.dataBuff[dateStr] = dataArrObj;
        }
    }
};

lphc.init();