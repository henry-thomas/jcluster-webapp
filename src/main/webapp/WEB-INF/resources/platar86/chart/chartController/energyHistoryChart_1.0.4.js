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
//        fillOpacity: 0.9,
    },
    seriesSpecificConfig: {
        "bank1-dischargingPower": {
            fillColor: "#0dff00",
            fillOpacity: 0.6,
            lineColor: "#0dff00",
            lineOpacity: 1,
            lineWidth: 1.5,
            name: "Battery Discharge"
        },
        "grid": {
            fillColor: "#ff0000",
            fillOpacity: 0.6,
            lineColor: "#ff0000",
            lineOpacity: 1,
            lineWidth: 1.5,
            name: "Grid"

        },
        "load": {
            fillColor: "#0001ff",
            fillOpacity: 0.6,
            lineColor: "#0001ff",
            lineOpacity: 1,
            lineWidth: 1.5,
            name: "Load"

        },
        "pv": {
            fillColor: "#fff200",
            fillOpacity: 0.6,
            lineColor: "#fff200",
            lineOpacity: 1,
            lineWidth: 1.5,
            name: "PV"

        }
    },
    transferConfigCharts: [
        {
            name: 'Live Chart',
            cb: function () {
                cm.tranferChartConfig({toName: "Live Chart", fromValue: "energyHistory1", toValue: "liveChart1"});
            }},
        {
            name: 'Power Chart',
            cb: function () {
                cm.tranferChartConfig({toName: "PowerChart", fromValue: "energyHistory1", toValue: "powerHistory1"});
            }}
    ]

};
var ehc = {
    name: 'chartEhc',
    selectedDateHisRange: 5,
    selectedDate: moment().subtract(0, 'days'),
    selectedDaysArr: [],
    tempDataBuff: {},
    reqSeries: {},
    knownSeriesEnergy: {},
    knownDaysArr: {}, //used to hold and remeber fetched dates
    rangeDataArr: [], //used to hold the xSelection data
    currentDataFields: {},

    period: {daily: {
            label: "Day",
            value: "day",
            momentDateFormat: 'YYYY-MM-DD',
            amChartsDateFormat: 'MMM-dd',
            amChartsPeriodChangeDateFormat: 'yyyy-MMM-dd',
            momentDateInterval: 'days',
            maxHistory: 30,
            standardHistory: 5,
            dataSuffix: '-dailyEnergy'
        },
        weekly: {
            label: "Week",
            value: "weekly",
            momentDateFormat: 'YYYY-WW',
            amChartsDateFormat: 'yyyy-ww',
            amChartsPeriodChangeDateFormat: 'yyyy-ww',
            momentDateInterval: 'weeks',
            maxHistory: 52,
            standardHistory: 3,
            dataSuffix: '-weeklyEnergy'
        },
        monthly: {
            label: "Month",
            value: "monthly",
            momentDateFormat: 'YYYY-MM',
            amChartsDateFormat: 'yyyy-MMM',
            amChartsPeriodChangeDateFormat: 'yyyy-MMM',
            momentDateInterval: 'months',
            maxHistory: 36,
            standardHistory: 6,
            dataSuffix: '-monthlyEnergy'
        },
        yearly: {
            label: "Year",
            value: "yearly",
            momentDateFormat: 'YYYY',
            amChartsDateFormat: 'yyyy',
            amChartsPeriodChangeDateFormat: 'yyyy',
            momentDateInterval: 'years',
            maxHistory: 15,
            standardHistory: 5,
            dataSuffix: '-yearlyEnergy'
        }
    },
    averagePeriodPowerObj: {}, //to calculate best period for data alignemt

    init: function () {
        cm.createChart(
                document.getElementById(ehc.name),
                'energyHistory1',
                chartDefConf,
                function (chOb) {
                    chOb.showLoadingIndicator('Loading Data ...');
                    console.log('chart Init Complete');
                    ehc.chart = chOb;
                    ehc.dataBuff = chOb.chartDataDateBuff;
                    chOb.chart.numberFormatter.numberFormat = "#.00a";
                    ehc.createChartTimeControl();
                    ehc.onDateSelectionChange();
                    ehc.chart.onSeriesAdded(function (series) {
                        series.period = ehc.periodDropDown.getLabel();
                    });
                }
        );
    },
    getEnergyDataFromServer: function (dateToFetchArr) {
        console.log('Getting data from server...');
        chartUtilGetEnergyDataFromDb([
            {
                name: "requestedDates",
                value: JSON.stringify(dateToFetchArr)
            },
            {
                name: "period",
                value: ehc.periodDropDown.getSelected().value
            },
            {
                name: "calbackFn",
                value: "ehc.proccessData"
            }
        ]);
    },
    onDateSelectionChange: function () {
        let daysLookup = ehc.selectedDateHisRange;
        let selectedDate = moment(ehc.selectedDate);
        let dateToFetchArr = [];
        ehc.selectedDaysArr.length = 0;
        while (daysLookup > 0) {
            let targetDateStr = selectedDate.format(ehc.periodDropDown.getSelected().momentDateFormat);
            ehc.selectedDaysArr.push(targetDateStr);
            if (!ehc.knownDaysArr[targetDateStr]) {
                dateToFetchArr.push(targetDateStr);
                ehc.knownDaysArr[targetDateStr] = true;
            }
            daysLookup--;
            selectedDate.subtract(1, ehc.periodDropDown.getSelected().momentDateInterval);
        }
        ehc.selectedDaysArr.sort();
        if (dateToFetchArr.length > 0) {
            ehc.getEnergyDataFromServer(dateToFetchArr);
        } else {
            ehc.onDataReceived();
        }
    },
    onDataReceived: function () {
        ehc.chart.chartData = [];
        ehc.chart.chart.data = ehc.chart.chartData;
        ehc.chart.chart.dateFormatter.inputDateFormat = ehc.periodDropDown.getSelected().amChartsDateFormat;
        ehc.chart.chart.xAxes.values[0].dateFormats.setKey(ehc.periodDropDown.getSelected().value, ehc.periodDropDown.getSelected().amChartsDateFormat);
        ehc.chart.chart.xAxes.values[0].periodChangeDateFormats.setKey(ehc.periodDropDown.getSelected().value, ehc.periodDropDown.getSelected().amChartsPeriodChangeDateFormat);
        for (var i = 0; i < ehc.selectedDaysArr.length; i++) {
            let dayArr = ehc.dataBuff[ehc.selectedDaysArr[i]];
            if (dayArr) {
                ehc.chart.chart.addData(dayArr);
            }
        }

        ehc.chart.addRequiredSeries(ehc.reqSeries);
        ehc.chart.hideLoadingIndicator();
        ehc.chart.chart.validateData();
        if (ehc.chart.chartData.length < 1) {
            ehc.chart.showLoadingIndicator('No data for the selected period', true);
        }
    },
    onSeriesPeriodChange: function () {
        //update series dataFields
        let serArr = Object.keys(ehc.knownSeriesEnergy);

        ehc.currentDataFields = {
            valueY: ehc.periodDropDown.getSelected().dataSuffix,
            dateX: 'date'
        };

        ehc.chart.onDataFieldsChanged(ehc.currentDataFields); //only call this if there is a chance the the datafields can change


        //update calendar period

        ehc.selectedDateHidSlider.label.textContent = function () {
            let label = ehc.selectedDateHidSlider.val;
            if (label > 1) {
                return label + ' ' + ehc.periodDropDown.getSelected().label + 's';
            }
            return label + ' ' + ehc.periodDropDown.getSelected().label;

        }();




    },
    createChartTimeControl: function () {

        let el = ehc.chart.controlLeftDiv;
        let settingContainer = document.createElement('div');
        let periodControlDiv = document.createElement('div');
        periodControlDiv.classList.add('period-control');
        settingContainer.appendChild(periodControlDiv);

        settingContainer.classList.add('chCtrl-datePicker');
        el.appendChild(settingContainer);

        let periodDropDown = new SMDUIDropDown(periodControlDiv, {
            options: ehc.period,
            containerClass: 'chCtrl-datePicker-control',
            onValueChange: function (val, obj) {
                ehc.selectedPeriod = val;

                for (let i = 0; i < ehc.chart.chart.series.values.length; i++) {
                    ehc.chart.chart.series.values[i].period = obj.getLabel();
                }
                ehc.selectedDateHidSlider.setValue(ehc.periodDropDown.getSelected().standardHistory);
                ehc.selectedDateHisRange = ehc.periodDropDown.getSelected().standardHistory;

                ehc.chart.chart.dateFormatter.inputDateFormat = ehc.periodDropDown.getSelected().amChartsDateFormat;
                ehc.onSeriesPeriodChange();
                ehc.onDateSelectionChange();
                ehc.onDataReceived();
                ehc.selectedDateHidSlider.setMax(ehc.periodDropDown.getSelected().maxHistory);

            }.bind(this)});
        ehc.periodDropDown = periodDropDown;

        ehc.selectedDateHidSlider = new HidSlider(periodControlDiv, {
            labelFormatter: function (v) { //Adjust here to match the period (daily = days, monthly = months, etc)
                if (v > 1) {
                    return v + ' ' + ehc.periodDropDown.getSelected().label + 's';
                }
                return v + ' ' + ehc.periodDropDown.getSelected().label;
            },
            val: ehc.selectedDateHisRange,
            minVal: 1,
            maxVal: ehc.periodDropDown.getSelected().maxHistory,
            hideOnChange: true,
            containerClass: 'chCtrl-datePicker-control',
            inputWidth: '75px',
            step: 1,
            onValueChange: function (val) {
                ehc.selectedDateHisRange = val;
                this.conf.labelFormatter = function (v) { //Adjust here to match the period (daily = days, monthly = months, etc)
                    if (v > 1) {
                        return v + ' ' + ehc.periodDropDown.getSelected().label + 's';
                    }
                    return v + ' ' + ehc.periodDropDown.getSelected().label;
                },
                        ehc.onDateSelectionChange();
            }

        });

        let calendarDiv = document.createElement('div');
        let leftArrow = document.createElement('div');
        leftArrow.classList.add('chCtrl-datePicker-icon');
        let leftArrowIcon = document.createElement('i');
        hh.addClass(leftArrowIcon, ['fas', 'fa-arrow-circle-left']);
        leftArrow.appendChild(leftArrowIcon);
        calendarDiv.appendChild(leftArrow);
        leftArrow.onclick = function () {
            ehc.selectedDate.subtract(1, ehc.periodDropDown.getSelected().momentDateInterval);
            ehc.selectedDateLabel.textContent = ehc.selectedDate.format(ehc.selectedDateFormatter);
            ehc.onDateSelectionChange();
        };
        let rightArrow = document.createElement('div');
        rightArrow.classList.add('chCtrl-datePicker-icon');
        let rightArrowIcon = document.createElement('i');
        hh.addClass(rightArrowIcon, ['fas', 'fa-arrow-circle-right']);
        rightArrow.appendChild(rightArrowIcon);
        rightArrow.onclick = function () {
            if (moment(ehc.selectedDate).add(1, 'day').isBefore(moment())) {
                ehc.selectedDate.add(1, ehc.periodDropDown.getSelected().momentDateInterval);
                ehc.selectedDateLabel.textContent = ehc.selectedDate.format(ehc.selectedDateFormatter);
                ehc.onDateSelectionChange();
            }
        };
        ehc.selectedDateFormatter = 'DD MMM YYYY';
        let calendar = document.createElement('span');
        calendarDiv.classList.add('period-control');
        calendar.classList.add('chCtrl-datePicker-control');
        ehc.selectedDateLabel = calendar;
        ehc.selectedDateLabel.textContent = ehc.selectedDate.format(ehc.selectedDateFormatter);
        $(calendar).daterangepicker({
            singleDatePicker: true,
            startDate: ehc.selectedDate,
            minYear: moment(),
            maxDate: moment()
        }, function (start, end, label) {
            ehc.selectedDate = start;
            ehc.selectedDateLabel.textContent = ehc.selectedDate.format(ehc.selectedDateFormatter);
            ehc.onDateSelectionChange();
        });
        calendarDiv.appendChild(calendar);
        calendarDiv.appendChild(rightArrow);
        settingContainer.appendChild(calendarDiv);



    },
    proccessData: function (energyDataJson, args, err) {
        if (err !== undefined && err !== "null") {
            return;
        }
        let energyData = JSON.parse(energyDataJson);
        console.log(energyData);
        ehc.addCalculatedPowers(energyData);
        console.log(energyData);

        if (energyData !== null) {
            let energyDataArr = Object.entries(energyData);
//                console.log(energyDataArr);
            for (let i = 0; i < energyDataArr.length; i++) {
                let periodData = [];
                periodData.push(energyDataArr[i][0]);
                let periodItems = Object.entries(energyDataArr[i][1]);
                for (let j = 0; j < periodItems.length; j++) {
                    let periodItem = [];
                    periodItem.push(energyDataArr[i][0]);
                    periodItem.push(periodItems[j][0]);
                    periodItem.push(periodItems[j][1]);
                    ehc.dataExtractorSimplePower(periodItem[0], periodItem[1], periodItem[2]);
                }
            }
        }
        ehc.dataExtractorSimplePowerSorting();
        ehc.onDataReceived();
        ehc.chart.addRequiredSeries(ehc.reqSeries);
        ehc.chart.chart.validateData();
    },

    addCalculatedPowers(energyData) {
        if (!energyData || !psManager.calcPowerList) {
            return;
        }
        for (let powerName in psManager.calcPowerList) {
            let expression = JSON.parse(psManager.calcPowerList[powerName].expression);
            for (let date in energyData) {
                energyData[date][powerName] = psManager.calcExpresion(expression, energyData[date], '');
            }
        }
    },

    getSelectedPeriod: function () {
        return ehc.selectedPeriod;
    },

    dataExtractorSimplePower: function (dateStr, powerName, periodData) {
        if (ehc.reqSeries[powerName] === undefined) {

            ehc.reqSeries[powerName] = {
                name: powerName,
                yAxis: 'energyWh',
                valueAxisY: 'energyWh',
                seriesType: 'ColumnSeries',
                //tooltip text config start here 

                toolTipDefault: "Periodic",
                toolTipOptions: [
                    {
                        label: "None",
                        value: ""
                    },
                    {
                        label: "Periodic",
                        value: '[bold]{name}[/]\n{period}: [bold]{valueY}Wh[/]'
                    },
                    {
                        label: "Periodic and Total",
                        value: '[bold]{name}[/]\n{period}: [bold]{valueY}Wh[/]\nTotal: [bold]{' + powerName + "-totalEnergy}Wh"
                    }
                ],
                dataFields: {
                    valueY: powerName + ehc.periodDropDown.getSelected().dataSuffix,
                    dateX: 'date'
                }
            };
        }

        if (Array.isArray(periodData)) {

            ehc.knownSeriesEnergy[powerName] = ehc.knownSeriesEnergy[powerName] || true;
            let arr = ehc.tempDataBuff[dateStr] = ehc.tempDataBuff[dateStr] || [];
            //for (var i = 0; i < periodData.length; i++) {
            let row = periodData;
            //console.log(periodData);
            let obj = {};
            obj[powerName + '-dailyEnergy'] = Number(row[0]);
            obj[powerName + '-weeklyEnergy'] = Number(row[1]);
            obj[powerName + '-monthlyEnergy'] = Number(row[2]);
            obj[powerName + '-yearlyEnergy'] = Number(row[3]);
            obj[powerName + '-totalEnergy'] = Number(row[4]);
            obj['date'] = dateStr;
            arr.push(obj);

        }
    },
    dataExtractorSimplePowerSorting: function () {

        for (var dateStr in ehc.tempDataBuff) {
            let periodDataArr = ehc.tempDataBuff[dateStr];
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
            ;
            ehc.dataBuff[dateStr] = dataArrObj;
        }
    }
}
;
var phcUtil = {
    sortSimplePowerFromTimeStringFn: function (a, b) {
        if (a[0] < b[0]) {
            return -1;
        } else if (a[0] > b[0]) {
            return 1;
        } else {
            return 0;
        }
    },
    sortSimplePowerFromMinSinceMidFn: function (a, b) {
        if (a['secSinceMidNight'] < b['secSinceMidNight']) {
            return -1;
        } else if (a['secSinceMidNight'] > b['secSinceMidNight']) {
            return 1;
        } else {
            return 0;
        }
    }
};
$(function () {

});
ehc.init();