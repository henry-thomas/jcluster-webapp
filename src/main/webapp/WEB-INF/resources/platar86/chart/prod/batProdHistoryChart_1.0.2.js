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
        seriesType: 'ColumnSeries',
        stacked: true
    }
};
var bphc = {
    name: 'chartBphc',
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
    showAdvancedStatistics: false,

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
                document.getElementById(bphc.name),
                'batProdHistory1',
                chartDefConf,
                function (chOb) {
                    chOb.showLoadingIndicator('Loading Data ...');
                    console.log('chart Init Complete');
                    bphc.chart = chOb;
                    bphc.dataBuff = chOb.chartDataDateBuff;
                    chOb.chart.numberFormatter.numberFormat = "#";
                    bphc.createChartTimeControl();
                    bphc.onDateSelectionChange();
                    bphc.createAdvStatsToggle();

                    if (bphc.chart.chart.cursor !== undefined) {
                        bphc.chart.chart.cursor.events.on("selectended", bphc.onXSelection);
                        bphc.chart.chart.events.on("hit", bphc.onClickAfterSelection);//
                    }
                }
        );
    },
    getBatProdDataFromServer: function (dateToFetchArr) {
        console.log('Getting data from server...');
        chartUtilGetBatProdDataFromDb([
            {
                name: "requestedDates",
                value: JSON.stringify(dateToFetchArr)
            },
            {
                name: "period",
                value: bphc.selectedPeriod
            },
            {
                name: "calbackFn",
                value: "bphc.proccessData"
            }
        ]);
    },
    onDateSelectionChange: function () {
        let daysLookup = bphc.selectedDateHisRange;
        let selectedDate = moment(bphc.selectedDate);
        let dateToFetchArr = [];
        bphc.selectedDaysArr.length = 0;
        while (daysLookup > 0) {
            let targetDateStr = selectedDate.format(bphc.period[bphc.selectedPeriod].momentDateFormat);
            bphc.selectedDaysArr.push(targetDateStr);
            if (!bphc.knownDaysArr[targetDateStr]) {
                dateToFetchArr.push(targetDateStr);
                bphc.knownDaysArr[targetDateStr] = true;
            }
            daysLookup--;
            selectedDate.subtract(1, bphc.period[bphc.selectedPeriod].momentDateInterval);
        }
        bphc.selectedDaysArr.sort();
        if (dateToFetchArr.length > 0) {
            bphc.getBatProdDataFromServer(dateToFetchArr);
        } else {
            bphc.onDataReceived();
        }
        bphc.calculateMovingAverage();

    },
    onDataReceived: function () {
        bphc.chart.chartData = [];
        bphc.chart.chart.data = bphc.chart.chartData;
        bphc.chart.chart.dateFormatter.inputDateFormat = bphc.period[bphc.selectedPeriod].amChartsDateFormat;
        bphc.chart.chart.xAxes.values[0].dateFormats.setKey(bphc.period[bphc.selectedPeriod].amChartsDateKey, bphc.period[bphc.selectedPeriod].amChartsDateFormat);
        bphc.chart.chart.xAxes.values[0].periodChangeDateFormats.setKey(bphc.period[bphc.selectedPeriod].amChartsDateKey, bphc.period[bphc.selectedPeriod].amChartsDateFormat);
        for (var i = 0; i < bphc.selectedDaysArr.length; i++) {
            let dayArr = bphc.dataBuff[bphc.selectedDaysArr[i]];
            if (dayArr) {
                bphc.chart.chart.addData(dayArr);
            }
        }

        bphc.chart.addRequiredSeries(bphc.reqSeries);
        bphc.chart.hideLoadingIndicator();
        bphc.chart.chart.validateData();
        if (bphc.chart.chartData.length < 1) {
            bphc.chart.showLoadingIndicator('No data for the selected period', true);
        } else {
            bphc.average = 0;
//            bphc.dataPoints = 0;
//            for (let date in bphc.chart.chartData) {
//                for (let dataField in bphc.chart.chartData[date]) {
//                    for (let seriesName in bphc.knownSeriesBatProd) {
//                        if (dataField === (seriesName + bphc.period[bphc.selectedPeriod].dataSuffix)) {
////                            console.log(dataField);
//                            bphc.average += bphc.chart.chartData[date][seriesName + bphc.period[bphc.selectedPeriod].dataSuffix];
//                            bphc.dataPoints += 1;
//                        }
//                    }
//                }
//            }

        }
        bphc.chart.onSeriesAdded(function (series) { //callback added to chartManager
            bphc.chart.chart.events.on('datavalidated', function () {
                if (bphc.showAdvancedStatistics) {

                    if (bphc.range) {
                        bphc.chart.chart.yAxes.values[0].axisRanges.removeValue(bphc.range);
                        bphc.range = bphc.chart.chart.yAxes.values[0].axisRanges.create();
                        bphc.range.grid.strokeOpacity = 0.5;
                        bphc.range.grid.strokeWidth = 3;
                    } else {
                        bphc.range = bphc.chart.chart.yAxes.values[0].axisRanges.create();
                        bphc.range.grid.strokeOpacity = 0.5;
                        bphc.range.grid.strokeWidth = 3;

                    }
                    bphc.range.label.verticalCenter = "bottom";
                    bphc.range.value = bphc.average;
                    bphc.range.label.text = "Average Total Battteries: [bold]" + bphc.range.value.toFixed(0).toString();
                    bphc.range.label.inide = true;
                } else {
                    bphc.chart.chart.yAxes.values[0].axisRanges.removeValue(bphc.range);
                }
            });


            if (bphc.chart.chart.series.values.length === Object.keys(bphc.knownSeriesBatProd).length) {
                bphc.chart.chart.validateData();
            }
        });
        if (bphc.showAdvancedStatistics) {
            bphc.calculateMovingAverage();
            bphc.totalDisp.textContent = 'Total: ' + bphc.total;
        } else {
            bphc.chart.chart.validateData();
            bphc.totalDisp.textContent = '';
        }

    },

    calculateMovingAverage: function () {
        bphc.total = 0;
        bphc.average = 0;
        if (bphc.showAdvancedStatistics) {
            for (let i = 0; i < bphc.chart.chartData.length; i++) {
                let sumData = 0;
                let noOfSeries = (Object.keys(bphc.chart.chartData[i]).length - 1);
                for (let item in bphc.chart.chartData[i]) {
                    if (item !== 'date' && item !== ('average' + bphc.period[bphc.selectedPeriod].dataSuffix)) {
                        if (!isNaN(bphc.chart.chartData[i][item])) {
                            sumData += (bphc.chart.chartData[i][item]);
                        }
                    } else if (item === 'average' + bphc.period[bphc.selectedPeriod].dataSuffix) {
                        //ignore the average series as a series for calculating average;
                        noOfSeries = noOfSeries - 1;
                    }
                }


                bphc.total += sumData;
                bphc.average = bphc.total / bphc.selectedDaysArr.length;
                bphc.chart.chartData[i]['average' + bphc.period[bphc.selectedPeriod].dataSuffix] = sumData / noOfSeries; //-1 to not count the 'date' field
                bphc.averageDataExtractor(bphc.chart.chartData[i].date, bphc.chart.chartData[i]['average' + bphc.period[bphc.selectedPeriod].dataSuffix]);
                bphc.chart.chart.validateData();
            }
        }
    },

    onSeriesPeriodChange: function () {
        // Updating series dataFields
        bphc.currentDataFields = {
            valueY: bphc.period[bphc.selectedPeriod].dataSuffix,
            dateX: 'date'
        };

        bphc.chart.onDataFieldsChanged(bphc.currentDataFields); // Only call this if there is a chance the the datafields can change


        // Updating calendar period
        bphc.selectedDateHidSlider.label.textContent = function () {
            let label = bphc.selectedDateHidSlider.val;
            if (label > 1) {
                return label + ' ' + bphc.period[bphc.selectedPeriod].dateKey + 's';
            }
            return label + ' ' + bphc.period[bphc.selectedPeriod].dateKey;

        }();
    },
    createChartTimeControl: function () {

        let el = bphc.chart.controlLeftDiv;
        let settingContainer = document.createElement('div');
        settingContainer.classList.add('chCtrl-datePicker');
        el.appendChild(settingContainer);
        bphc.selectedDateHidSlider = new HidSlider(settingContainer, {
            labelFormatter: function (v) { //Adjust here to match the period (daily = days, monthly = months, etc)
                if (v > 1) {
                    return v + ' ' + bphc.period[bphc.selectedPeriod].dateKey + 's';
                }
                return v + ' ' + bphc.period[bphc.selectedPeriod].dateKey;
            },
            val: bphc.selectedDateHisRange,
            minVal: 1,
            maxVal: bphc.period[bphc.selectedPeriod].maxHistory,
            hideOnChange: true,
            containerClass: 'chCtrl-datePicker-control',
            inputWidth: '75px',
            onValueChange: function (val) {
                bphc.selectedDateHisRange = val;
                this.labelFormatter = function (v) { //Adjust here to match the period (daily = days, monthly = months, etc)
                    if (v > 1) {
                        return v + ' ' + bphc.period[bphc.selectedPeriod].dateKey + 's';
                    }
                    return v + bphc.period[bphc.selectedPeriod].dateKey;
                },
                        bphc.onDateSelectionChange();
            }

        });
        let leftArrow = document.createElement('div');
        leftArrow.classList.add('chCtrl-datePicker-icon');
        let leftArrowIcon = document.createElement('i');
        hh.addClass(leftArrowIcon, ['fas', 'fa-arrow-circle-left']);
        leftArrow.appendChild(leftArrowIcon);
        settingContainer.appendChild(leftArrow);
        leftArrow.onclick = function () {
            bphc.selectedDate.subtract(1, 'day');
            bphc.selectedDateLabel.textContent = bphc.selectedDate.format(bphc.selectedDateFormatter);
            bphc.onDateSelectionChange();
        };
        let rightArrow = document.createElement('div');
        rightArrow.classList.add('chCtrl-datePicker-icon');
        let rightArrowIcon = document.createElement('i');
        hh.addClass(rightArrowIcon, ['fas', 'fa-arrow-circle-right']);
        rightArrow.appendChild(rightArrowIcon);
        rightArrow.onclick = function () {
            if (moment(bphc.selectedDate).add(1, 'day').isBefore(moment())) {
                bphc.selectedDate.add(1, 'day');
                bphc.selectedDateLabel.textContent = bphc.selectedDate.format(bphc.selectedDateFormatter);
                bphc.onDateSelectionChange();
            }
        };
        bphc.selectedDateFormatter = 'DD MMM YYYY';
        let calendar = document.createElement('span');
        calendar.classList.add('chCtrl-datePicker-control');
        bphc.selectedDateLabel = calendar;
        bphc.selectedDateLabel.textContent = bphc.selectedDate.format(bphc.selectedDateFormatter);
        $(calendar).daterangepicker({
            singleDatePicker: true,
            startDate: bphc.selectedDate,
            minYear: moment(),
            maxDate: moment()
        }, function (start, end, label) {
            bphc.selectedDate = start;
            bphc.selectedDateLabel.textContent = bphc.selectedDate.format(bphc.selectedDateFormatter);
            bphc.onDateSelectionChange();
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
            val: bphc.selectedPeriod,
            options: periodArr,
            containerClass: 'chCtrl-datePicker-control',
            onValueChange: function (val, args) {
                bphc.selectedPeriod = val;
                bphc.selectedDateHidSlider.setValue(bphc.period[bphc.selectedPeriod].standardHistory);
                bphc.selectedDateHisRange = bphc.period[bphc.selectedPeriod].standardHistory;

                bphc.chart.chart.dateFormatter.inputDateFormat = bphc.period[bphc.selectedPeriod].amChartsDateFormat;
                bphc.onSeriesPeriodChange();
                bphc.onDateSelectionChange();
                bphc.onDataReceived();
                bphc.selectedDateHidSlider.setMax(bphc.period[bphc.selectedPeriod].maxHistory);
            }.bind(this)});
        bphc.periodDropDown = periodDropDown;


    },
    proccessData: function (batProdDataJson, args, err) {
        if (err !== undefined && err !== "null") {
            return;
        }

        let batProdData = JSON.parse(batProdDataJson);
        console.log(batProdData);
        if (batProdData !== null) {
            let batProdDataArr = Object.entries(batProdData);
            console.log(batProdDataArr);
            for (let i = 0; i < batProdDataArr.length; i++) {
                let periodData = [];
                periodData.push(batProdDataArr[i][0]);
                let periodItems = Object.entries(batProdDataArr[i][1]);
                for (let j = 0; j < periodItems.length; j++) {
                    let periodItem = [];
                    periodItem.push(batProdDataArr[i][0]);
                    periodItem.push(periodItems[j][0]);
                    periodItem.push(periodItems[j][1]);
                    bphc.dataExtractorSimpleBatModel(periodItem[0], periodItem[1], periodItem[2]);
                }
            }
        }
        bphc.dataExtractorSimpleBatModelSorting();
        bphc.onDataReceived();
        bphc.chart.addRequiredSeries(bphc.reqSeries);
        bphc.chart.hideLoadingIndicator();
        bphc.chart.chart.validateData();
    },

    averageDataExtractor: function (dateStr, average) {
        if (bphc.reqSeries['average'] === undefined) {

            bphc.reqSeries['average'] = {
                name: 'Average',
                yAxis: 'batProdTotal',
                valueAxisY: 'batProdTotal',
                seriesType: 'ColumnSeries',
                // Tooltip text config start here 
                toolTipDefault: "Average",
                toolTipOptions: [
                    {
                        label: "None",
                        value: ""
                    },
                    {
                        label: "Average",
                        value: '[bold]{name}[/]\nAverage: [bold]{valueY}[/]'
                    }
                ],
                dataFields: {
                    valueY: 'average' + bphc.period[bphc.selectedPeriod].dataSuffix,
                    dateX: 'date'
                }
            };
        }
        bphc.knownSeriesBatProd['average'] = bphc.knownSeriesBatProd['average'] || true;
    },

    dataExtractorSimpleBatModel: function (dateStr, batModel, total) {
        if (bphc.reqSeries[batModel] === undefined) {

            bphc.reqSeries[batModel] = {
                name: batModel,
                yAxis: 'batProdTotal',
                valueAxisY: 'batProdTotal',
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
                    valueY: batModel + bphc.period[bphc.selectedPeriod].dataSuffix,
                    dateX: 'date'
                }
            };
        }

        if (total) {
            bphc.knownSeriesBatProd[batModel] = bphc.knownSeriesBatProd[batModel] || true;
            let arr = bphc.tempDataBuff[dateStr] = bphc.tempDataBuff[dateStr] || [];

            let obj = {};
            obj['date'] = dateStr;

            switch (bphc.selectedPeriod) {
                case 'weekly':
                    obj[batModel + '-weeklyProduction'] = Number(total);
                    break;

                case 'monthly':
                    obj[batModel + '-monthlyProduction'] = Number(total);
                    break;

                case 'yearly':
                    obj[batModel + '-yearlyProduction'] = Number(total);
                    break;

                default:
                    obj[batModel + '-dailyProduction'] = Number(total);
                    break;
            }
            arr.push(obj);
        }
    },
    dataExtractorSimpleBatModelSorting: function () {

        for (var dateStr in bphc.tempDataBuff) {
            let periodDataArr = bphc.tempDataBuff[dateStr];
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
            bphc.dataBuff[dateStr] = dataArrObj;
        }
    },

    createAdvStatsToggle: function () {
        let el = bphc.chart.controlLeftDiv;
        el.style.display = 'grid';
        el.style.gridTemplate = 'auto/auto auto auto';
        el.style.gridTemplateAreas = "'timeControl valueDisplay totalDisp'";
        el.style.alignItems = 'center';


        let advStatsToggle = new SettingPanel(el, {
            title: 'Adv Stats',
            toolTip: 'Show statistics when a part of the chart is selected.',
            val: false,
            type: 'switch',
            typeStyle: 'sliderRound',
            onChange: function (val, args) {
                if (!val) {
                    bphc.showAdvancedStatistics = false;
                } else {
                    bphc.showAdvancedStatistics = true;
                }

                bphc.calculateMovingAverage();
                for (let i = 0; i < bphc.chart.chart.series.values.length; i++) {
                    if (bphc.chart.chart.series.values[i].id === 'average') {
                        bphc.chart.chart.series.values[i].disabled = !bphc.showAdvancedStatistics;
                        bphc.chart.chart.series.values[i].hiddenInLegend = !bphc.showAdvancedStatistics;
                    }
                }
                bphc.onDataReceived();
            }.bind(this)
        });
        advStatsToggle.container.style.gridArea = 'valueDisplay';
        advStatsToggle.container.style.width = '150px';

        bphc.totalDisp = document.createElement('span');
        bphc.totalDisp.textContent = 'Total: ' + bphc.total;
        bphc.totalDisp.style.fontWeight = 'bold';

        el.appendChild(bphc.totalDisp);
    },

    onXSelection: function (ev) {
        if (bphc.showAdvancedStatistics) {
            if (ev.target.xRange) {

                let startDate = moment(bphc.chart.chart.xAxes.values[0].positionToDate(ev.target.xRange.start));
                let endDate = moment(bphc.chart.chart.xAxes.values[0].positionToDate(ev.target.xRange.end));

                let rangeX = ev.target.xRange;
                let selectedXValues = ev.target.chart.xAxes.getIndex(0);
//        
                let fromX = selectedXValues.getPositionLabel(selectedXValues.toAxisPosition(rangeX.start));
                let toX = selectedXValues.getPositionLabel(selectedXValues.toAxisPosition(rangeX.end));

                if (bphc.chart.chartData !== undefined) {

                    let rangeDataScope = []; //Create an array with only the data within the selected range.
                    let dateArr = Object.keys(bphc.chart.chartData);
                    for (let i = 0; i < bphc.chart.chartData.length; i++) {
                        if (bphc.chart.chartData[i].date !== undefined)
                        {
                            //check whether the timestamps fall within the selected range

                            if (Date.parse(bphc.chart.chartData[i].date) >= startDate._d.getTime() && Date.parse(bphc.chart.chartData[i].date) <= endDate._d.getTime()) {
                                rangeDataScope.push(bphc.chart.chartData[i]);
                            }
                        }
                    }


                    for (let i = 0; i < bphc.chart.chart.series.values.length; i++) {
                        //only perform calculations on series who are not hidden. If a series is hidden, empty object is placed in array.
                        if (!bphc.chart.chart.series.values[i].disabled && !bphc.chart.chart.series.values[i].hiddenInLegend) {

                            let seriesId = bphc.chart.chart.series.values[i].id;
                            let seriesName = bphc.chart.chart.series.values[i].name;
                            
//                            if (seriesId !== 'average') {

                                bphc.rangeDataArr[i] = {
                                    'seriesId': seriesId,
                                    'seriesName': seriesName,
                                    'startDate': moment(rangeDataScope[0].date, bphc.period[bphc.selectedPeriod].momentDateFormat).format("YYYY/MM/DD"),
                                    'endDate': moment(toX, "YYYY-MMM0DD").format("YYYY/MM/DD"),
                                    'start-value': function (category) {
                                        return rangeDataScope[0][seriesId + category];
                                    },
                                    'end-value': function (category) {
                                        return rangeDataScope[rangeDataScope.length - 1][seriesId + category];
                                    },
                                    'average': function (category) {
                                        let average = 0;
                                        let emptyCount = 0;
                                        for (let i = 0; i < rangeDataScope.length; i++) {
                                            if (rangeDataScope[i][seriesId + category] !== undefined) {
                                                average += rangeDataScope[i][seriesId + category];
                                            } else {
                                                average += 0;
                                                emptyCount += 1; //in chartData, last obj only has Storage data. Skip this in length count. Only happens after end of each day.
                                            }
                                        }

                                        average = average / (rangeDataScope.length - emptyCount);
                                        if (!isNaN(average) && average > 0) {
                                            return average;
                                        }
                                    },
                                    'delta': function (category) {
                                        let arrItem;
                                        let definedArr = [];
                                        for (let i = 0; i < rangeDataScope.length; i++) {
                                            arrItem = rangeDataScope[i][seriesId + category];
                                            if (arrItem !== undefined) {
                                                definedArr.push(arrItem);
                                            }
                                        }
                                        if (definedArr[definedArr.length - 1] !== undefined && definedArr[0] !== undefined) {
                                            let delta = definedArr[definedArr.length - 1] - definedArr[0];
                                            return delta;
                                        }

                                    },
                                    'max': function (category) {

                                        let arrItem;
                                        let maxArr = [];
                                        for (let i = 0; i < rangeDataScope.length; i++) {
                                            arrItem = rangeDataScope[i][seriesId + category];
                                            if (arrItem !== undefined) {
                                                maxArr.push(arrItem);
                                            }
                                        }
                                        let pointer = maxArr[0];
                                        let max = pointer;
                                        for (let i = 0; i < maxArr.length; i++) {
                                            pointer = maxArr[i];
                                            if (pointer > max) {
                                                max = pointer;
                                            }
                                        }

                                        if (!bphc.max) {
                                            bphc.max = max;
                                        }

                                        if (max > bphc.max) {
                                            bphc.max = max;
                                        }
//                        
                                        return max;

                                    },

                                    'min': function (category) {
                                        let arrItem;
                                        let minArr = [];
                                        for (let i = 0; i < rangeDataScope.length; i++) {
                                            arrItem = rangeDataScope[i][seriesId + category];
                                            if (arrItem !== undefined) {
                                                minArr.push(arrItem);
                                            }
                                        }
                                        let pointer = minArr[0];
                                        let min = pointer;
                                        for (let i = 0; i < minArr.length; i++) {
                                            pointer = minArr[i];
                                            if (pointer < min) {
                                                min = pointer;
                                            }
                                        }

                                        if (!bphc.min) {
                                            bphc.min = min;
                                        }

                                        if (min < bphc.min) {
                                            bphc.min = min;
                                        }

                                        return min;
                                    }

                                };
                            }
                        }
                    }
                    this.bphc.rangeDataArr = bphc.rangeDataArr;
                    bphc.createAdvStatsPanel();
                }
            }
//        }
    },

    createAdvStatsPanel: function () {
        let category = bphc.period[bphc.selectedPeriod].dataSuffix;
        let el = bphc.chart.bottomContainer;
        el.classList.add('actDataContainer');
        hh.removeAllChilds(el);

        for (let i = 0; i < bphc.rangeDataArr.length; i++) {
            if (bphc.rangeDataArr[i] !== undefined) {
                let name = bphc.rangeDataArr[i].seriesName;

                let dataPanel = hh.createActDataPanelCard(name, 'customPanel');
                el.appendChild(dataPanel);

                dataPanel.appendChild(hh.addItemToActDataPanelCard({
                    title: 'Selection',
                    value: bphc.rangeDataArr[i]['startDate'] + ' - ' + bphc.rangeDataArr[i]['endDate']
                }));

                if (bphc.rangeDataArr[i]["max"](category) !== undefined) {
                    dataPanel.appendChild(hh.addItemToActDataPanelCard({
                        title: 'Max',
                        value: (bphc.rangeDataArr[i]['max'](category))
                    }));
                }

                if (bphc.rangeDataArr[i]["average"](category) !== undefined) {
                    dataPanel.appendChild(hh.addItemToActDataPanelCard({
                        title: 'Average',
                        value: (bphc.rangeDataArr[i]['average'](category)).toFixed(2)
                    }));
                }

                if (bphc.rangeDataArr[i]["min"](category) !== undefined) {
                    dataPanel.appendChild(hh.addItemToActDataPanelCard({
                        title: 'Min',
                        value: (bphc.rangeDataArr[i]['min'](category)).toFixed(2)
                    }));
                }

            }
        }
        //TOTALS
        let dataPanel = hh.createActDataPanelCard('Overall Per Type', 'customPanel');
        el.appendChild(dataPanel);
        if (bphc.min !== undefined) {
            dataPanel.appendChild(hh.addItemToActDataPanelCard({
                title: 'Min',
                value: bphc.min.toFixed(2)
            }));
        }
        if (bphc.max !== undefined) {
            dataPanel.appendChild(hh.addItemToActDataPanelCard({
                title: 'Max',
                value: bphc.max.toFixed(2)
            }));
        }
        if (bphc.total !== undefined) {
            dataPanel.appendChild(hh.addItemToActDataPanelCard({
                title: 'Average',
                value: (bphc.total / bphc.selectedDaysArr.length).toFixed(2)
            }));
        }


    },

    onClickAfterSelection: function () {
        $(".customPanel").hide();
    }

};



bphc.init();