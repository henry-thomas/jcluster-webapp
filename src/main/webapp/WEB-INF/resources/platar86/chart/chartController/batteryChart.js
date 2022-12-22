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


/* global cm, moment, am4charts, hh */
let dataObjArr = [{"curA": -0.045, "cDate": 1596287020424, "c0": 2.622, "c1": 2.626, "c2": 2.647,
        "c3": 2.599, "c4": 2.604, "c5": 2.597, "c6": 2.601, "c7": 2.603, "c8": 2.598, "c9": 2.6,
        "c10": 2.598, "c11": 2.593, "c12": 2.597, "c13": 2.602, "c14": 2.6, "c15": 2.607},
    {"curA": -0.045, "cDate": 1596287020424, "c0": 2.622, "c1": 2.626, "c2": 2.647,
        "c3": 2.599, "c4": 2.604, "c5": 2.597, "c6": 2.601, "c7": 2.603, "c8": 2.598, "c9": 2.6,
        "c10": 2.598, "c11": 2.593, "c12": 2.597, "c13": 2.602, "c14": 2.6, "c15": 2.607},
    {"curA": -0.045, "cDate": 1596287020424, "c0": 2.622, "c1": 2.626, "c2": 2.647,
        "c3": 2.599, "c4": 2.604, "c5": 2.597, "c6": 2.601, "c7": 2.603, "c8": 2.598, "c9": 2.6,
        "c10": 2.598, "c11": 2.593, "c12": 2.597, "c13": 2.602, "c14": 2.6, "c15": 2.607}];

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
            horizontalScroll: 'microChart'
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

var bc = {
    name: 'chartBc',
    selectedDate: moment(),
    selectedDaysArr: [],
    reqSeries: {},
    dummySeriesNames: ['curA', 'voltageA'],
    knownSeriesEnergy: {},
    init: function () {
        cm.createChart(
                document.getElementById(bc.name),
                'batteryChart',
                chartDefConf,
                function (chOb) {
                    bc.chart = chOb;
                    bc.processData(dataObjArr);
                    bc.createChartTimeControl();
                }
        );
    },

    processData: function (dataObj) {
        let cellVoltage16 = [];
        let  chartDataObjArr;

        for (let j = 0; j < dataObj.length; j++) {
            cellVoltage16 = [dataObj[j]["c0"], dataObj[j]["c1"], dataObj[j]["c2"], dataObj[j]["c3"], dataObj[j]["c4"],
                dataObj[j]["c5"], dataObj[j]["c6"], dataObj[j]["c7"], dataObj[j]["c8"], dataObj[j]["c9"], dataObj[j]["c10"],
                dataObj[j]["c11"], dataObj[j]["c12"], dataObj[j]["c13"], dataObj[j]["c14"], dataObj[j]["c15"]];


            chartDataObjArr = [{date: dataObj[j].cDate + j * 100000, currentA: dataObj[j].curA, c0: dataObj[j].c0, c1: dataObj[j].c1
                    , c2: dataObj[j].c2, c3: dataObj[j].c3, c4: dataObj[j].c4, c5: dataObj[j].c5, c6: dataObj[j].c6, c7: dataObj[j].c7,
                    c8: dataObj[j].c8, c9: dataObj[j].c9, c10: dataObj[j].c10, c11: dataObj[j].c11, c12: dataObj[j].c12,
                    c13: dataObj[j].c13, c14: dataObj[j].c14, c15: dataObj[j].c15}];

            bc.onCurrentSeriesDataReceived("currentA", chartDataObjArr);
            for (let i = 0; i < cellVoltage16.length; i++) {
                bc.onVoltageSeriesDataReceived("c" + i, chartDataObjArr);
            }
        }

        bc.chart.addRequiredSeries(bc.reqSeries);

    },

    onCurrentSeriesDataReceived: function (sName, data) {
        bc.reqSeries[sName] = {
            name: sName,
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
        if (Array.isArray(data)) {
            bc.chart.chart.addData(data);


        }
    },

    onVoltageSeriesDataReceived: function (sName, data) {
        bc.reqSeries[sName] = {
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
        if (Array.isArray(data)) {
//            for (let i = 0; i < data.cellVoltage16.length; i++) {
            bc.chart.chart.addData(data);
        }
    },

    createChartTimeControl: function () {

        let el = bc.chart.controlLeftDiv;
        let settingContainer = document.createElement('div');
        settingContainer.classList.add('chCtrl-datePicker');
        el.appendChild(settingContainer);

        bc.selectedDateHidSlider = new HidSlider(settingContainer, {
            labelFormatter: function (v) {
                if (v > 1) {
                    return v + ' Days';
                }
                return v + ' Day';
            },

            val: bc.selectedDateHisRange,
            minVal: 1,
            maxVal: 7,
            hideOnChange: true,
            containerClass: 'chCtrl-datePicker-control',
            inputWidth: '75px',
            onValueChange: function (val) {
//                console.log('HidSlider value change: ' + val);
                bc.selectedDateHisRange = val;
                bc.onDateSelectionChange();
            }

        });
        let leftArrow = document.createElement('div');
        leftArrow.classList.add('chCtrl-datePicker-icon');
        let leftArrowIcon = document.createElement('i');
        hh.addClass(leftArrowIcon, ['fas', 'fa-arrow-circle-left']);
        leftArrow.appendChild(leftArrowIcon);
        settingContainer.appendChild(leftArrow);
        leftArrow.onclick = function () {
            bc.selectedDate.subtract(1, 'day');
            bc.selectedDateLabel.textContent = bc.selectedDate.format(bc.selectedDateFormatter);
            bc.onDateSelectionChange();
        };
        let rightArrow = document.createElement('div');
        rightArrow.classList.add('chCtrl-datePicker-icon');
        let rightArrowIcon = document.createElement('i');
        hh.addClass(rightArrowIcon, ['fas', 'fa-arrow-circle-right']);
        rightArrow.appendChild(rightArrowIcon);
        rightArrow.onclick = function () {
            if (moment(bc.selectedDate).add(1, 'day').isBefore(moment())) {
                bc.selectedDate.add(1, 'day');
                bc.selectedDateLabel.textContent = bc.selectedDate.format(bc.selectedDateFormatter);
                bc.onDateSelectionChange();
            }
        };
        bc.selectedDateFormatter = 'DD MMM YYYY';
        let calendar = document.createElement('span');
        calendar.classList.add('chCtrl-datePicker-control');
        bc.selectedDateLabel = calendar;
        bc.selectedDateLabel.textContent = bc.selectedDate.format(bc.selectedDateFormatter);
//        calendar.id = phc.name + "DataPicker";
        $(calendar).daterangepicker({
            singleDatePicker: true,
            startDate: bc.selectedDate,
            minYear: moment(),
            maxDate: moment()
        }, function (start, end, label) {
            bc.selectedDate = start;
            bc.selectedDateLabel.textContent = bc.selectedDate.format(bc.selectedDateFormatter);
            bc.onDateSelectionChange();
        });
        settingContainer.appendChild(calendar);
        settingContainer.appendChild(rightArrow);
    },

    onDateSelectionChange: function () {
        let daysLookup = bc.selectedDateHisRange;
        let selectedDate = moment(bc.selectedDate);
        let dateToFetchArr = [];
        bc.selectedDaysArr.length = 0;
        while (daysLookup > 0) {
            let targetDateStr = selectedDate.format('YYYY-MM-DD');
            bc.selectedDaysArr.push(targetDateStr);
            if (!bc.knownDaysArr[targetDateStr]) {
                dateToFetchArr.push(targetDateStr);
                bc.knownDaysArr[targetDateStr] = true;
            }
            daysLookup--;
            selectedDate.subtract(1, 'days');
        }
        bc.selectedDaysArr.sort();

        if (dateToFetchArr.length > 0) {
//            console.log(dateToFetchArr);
//            bc.getDataFromServer(dateToFetchArr);
        } else {
//            bc.onDataReceived();
        }
    },

};


$(document).ready(function () {
    bc.init();
//    bc.chart.chart.yAxes.values[0].renderer.opposite = true;
//    bc.chart.chart.yAxes.values[0].validate();




});
