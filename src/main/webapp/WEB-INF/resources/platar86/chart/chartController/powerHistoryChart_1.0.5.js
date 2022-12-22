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
        useLegacyFailoverSeriesSettings: true,
        gen: {
            showAdvancedSettings: true,
            showChartCursor: true,
            horizontalScroll: 'simple'
        },
//        legend: {
//            showLegend: 'bottom'
//        },
        yAxes: {
            capacityP: {
                yAxisMinVal: '0',
                yAxisMaxVal: '100',
                opposite: true
            }
        }
    },
    seriesConf: {
        enabled: true,
        seriesType: 'LineSeries'
    },
    transferConfigCharts: [
        {
            name: 'Energy Chart',
            cb: function () {
                cm.tranferChartConfig({toName: "Energy Chart", fromValue: "powerHistory1", toValue: "energyHistory1"});
            }},
        {
            name: 'Live Chart',
            cb: function () {
                cm.tranferChartConfig({toName: "Live Chart", fromValue: "powerHistory1", toValue: "liveChart1"});
            }}
    ]
};
var phc = {
    name: 'chartPhc',
    selectedDateHisRange: 1,
    selectedDate: moment(),
//    selectedDate: moment("20201103", "YYYYMMDD").endOf('day'), // For testing purposes
    selectedDaysArr: [],
    tempDataBuff: {},
    reqSeries: {},
    knownSeriesPower: {},
    knownSeriesStorage: {},
    knownDaysArr: {}, //used to hold and remeber fetched dates
    rangeDataArr: [], //used to hold the xSelection data
    newDaysArr: [], // New days retreived from the database. Used for extracting Calculated Power Data

    averagePeriodPowerObj: {}, //to calculate best period for data alignemt

    init: function () {
        cm.createChart(
                document.getElementById(phc.name),
                'powerHistory1',
                chartDefConf,
                function (chOb) {
                    chOb.showLoadingIndicator('Loading Data ...');
                    console.log('chart Init Complete');
                    phc.chart = chOb;
                    phc.dataBuff = chOb.chartDataDateBuff;
                    chOb.chart.numberFormatter.numberFormat = "#.00a";
                    phc.createChartTimeControl();
                    phc.onDateSelectionChange();

                    if (phc.chart.chart.cursor !== undefined) {
                        phc.chart.chart.cursor.events.on("selectended", phc.onXSelection);
                        phc.chart.chart.events.on("hit", phc.onClickAfterSelection);//
                    }
                },
        );
    },

    getDataFromServer: function (startDate, endDate, reqDates) {
        chartUtilGetPowerDataFromDb([
            {
                name: "otherDataToBePassBack",
                value: "otherDataToBePassBackValue"
            },
            {
                name: "beginDate",
                value: startDate
            },
            {
                name: "endDate",
                value: endDate
            },
            {
                name: "calbackFn",
                value: "phc.proccessData"
            }
        ]);
    },

    onDateSelectionChange: function () {
        let daysLookup = phc.selectedDateHisRange;
        let selectedDate = moment(phc.selectedDate);
        let dateToFetchArr = [];
        phc.selectedDaysArr.length = 0;
        while (daysLookup > 0) {
            let targetDateStr = selectedDate.format('YYYY-MM-DD');
            phc.selectedDaysArr.push(targetDateStr);
            if (!phc.knownDaysArr[targetDateStr]) {
                dateToFetchArr.push(targetDateStr);
                phc.knownDaysArr[targetDateStr] = true;
            }
            daysLookup--;
            selectedDate.subtract(1, 'days');
        }
        phc.selectedDaysArr.sort();

        if (dateToFetchArr.length > 0) {
            console.log(dateToFetchArr);
//            phc.getDataFromServer(dateToFetchArr);

            //if there is one day that is unknown in the middle, fetch all.
            phc.getDataFromServer(dateToFetchArr[dateToFetchArr.length - 1], dateToFetchArr[0], dateToFetchArr);

        } else {
            phc.onDataReceived();
        }
    },

    onDataReceived: function () {
        let daysArr = Object.keys(phc.dataBuff).sort();
        phc.chart.chart.data.length = 0;

        for (var i = 0; i < phc.selectedDaysArr.length; i++) {
            let dayArr = phc.dataBuff[phc.selectedDaysArr[i]];
            if (dayArr) {
                for (var j = 0; j < dayArr.length; j++) {
                    phc.chart.chart.addData(dayArr[j]);
                }
            }
        }
        phc.chart.chart.xAxes.values[0].dateFormats.setKey('day', '');
        phc.chart.chart.xAxes.values[0].periodChangeDateFormats.setKey('hour', '[bold]MMM-dd');
        phc.chart.addRequiredSeries(phc.reqSeries);
        phc.chart.hideLoadingIndicator();
        if (phc.chart.chartData.length < 1) {
            phc.chart.showLoadingIndicator('No data for the selected period', true);
        }
        phc.chart.chart.validateData();

    },

//Event listener is in init. requires active cursor.
//onXSelection creates and array of objects called 'rangeDataArr', which is the data within the selected range.
    onXSelection: function (ev) {
        let cursorBehaviour = phc.chart.chart.cursor.behavior;
        if ((cursorBehaviour !== 'selectX') && (cursorBehaviour !== 'selectXY')) {
            return;
        }
        if (ev.target.xRange) {

            let startDate = moment(phc.chart.chart.xAxes.values[0].positionToDate(ev.target.xRange.start));
            let endDate = moment(phc.chart.chart.xAxes.values[0].positionToDate(ev.target.xRange.end));

            let rangeX = ev.target.xRange;
//        let rangeY = ev.target.yRange;
            let selectedXValues = ev.target.chart.xAxes.getIndex(0);
//        
            let fromX = selectedXValues.getPositionLabel(selectedXValues.toAxisPosition(rangeX.start));
            let toX = selectedXValues.getPositionLabel(selectedXValues.toAxisPosition(rangeX.end));

//        let selectedYValues = ev.target.chart.yAxes.getIndex(0);
//        let fromY = selectedYValues.getPositionLabel(selectedYValues.toAxisPosition(rangeY.start));
//        let toY = selectedYValues.getPositionLabel(selectedYValues.toAxisPosition(rangeY.end));

            if (phc.chart.chartData !== undefined) {

                let rangeDataScope = []; //Create an array with only the data within the selected range.
                for (let i = 0; i < phc.chart.chartData.length - 1; i++) {
                    if (phc.chart.chartData[i].date !== undefined)
                    {
                        //check whether the timestamps fall within the selected range
                        if (phc.chart.chartData[i].date.getTime() >= startDate._d.getTime() && phc.chart.chartData[i].date.getTime() <= endDate._d.getTime()) {
                            rangeDataScope.push(phc.chart.chartData[i]);
                        }
                    }
                }


                for (let i = 0; i < phc.chart.chart.series.values.length; i++) {
                    //only perform calculations on series who are not hidden. If a series is hidden, empty object is placed in array.
                    if (!phc.chart.chart.series.values[i].disabled && !phc.chart.chart.series.values[i].hiddenInLegend) {

                        let seriesId = phc.chart.chart.series.values[i].id;
                        let seriesName = phc.chart.chart.series.values[i].name;

                        phc.rangeDataArr[i] = {
                            'seriesId': seriesId,
                            'seriesName': seriesName,
                            'startDate': fromX,
                            'endDate': toX,
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
                                return min;
                            }

                        };
                    }
                }
            }
            this.phc.rangeDataArr = phc.rangeDataArr;
            phc.createSelectionDataPanels();
        }
    },

    createSelectionDataPanels: function () {
        //use the object created in 'onXSelection' here
        let el = phc.chart.bottomContainer;
        el.classList.add('actDataContainer');
        hh.removeAllChilds(el);

        for (let i = 0; i < phc.rangeDataArr.length; i++)
        {

            if (phc.rangeDataArr[i] !== undefined) {
                let name = phc.rangeDataArr[i].seriesName;


                let dataPanel = hh.createActDataPanelCard(name, 'customPanel');
                el.appendChild(dataPanel);

                dataPanel.appendChild(hh.addItemToActDataPanelCard({
                    title: 'Selection',
                    value: phc.rangeDataArr[i]['startDate'] + '-' + phc.rangeDataArr[i]['endDate']
                            //unit: "kWh"
                }));
//                dataPanel.appendChild(hh.addItemToActDataPanelCard({
//                    title: 'Selection To',
//                    value: phc.rangeDataArr[i]['endDate']
//                            //unit: "kWh"
//                }));
                if (phc.rangeDataArr[i]["max"]('-powerW') !== undefined) {
                    dataPanel.appendChild(hh.addItemToActDataPanelCard({
                        title: 'Max Power',
                        value: (phc.rangeDataArr[i]['max']('-powerW') / 1000).toFixed(2),
                        unit: "kW"
                    }));
                }

                if (phc.rangeDataArr[i]["min"]('-powerW') !== undefined) {
                    dataPanel.appendChild(hh.addItemToActDataPanelCard({
                        title: 'Min Power',
                        value: ((phc.rangeDataArr[i]['min']('-powerW')) / 1000).toFixed(2),
                        unit: "kW"
                    }));
                }
                ;

                if (phc.rangeDataArr[i]["average"]('-powerW') !== undefined) {
                    dataPanel.appendChild(hh.addItemToActDataPanelCard({
                        title: 'Average Power',
                        value: (phc.rangeDataArr[i]['average']('-powerW') / 1000).toFixed(2),
                        unit: "kW"
                    }));
                }

                if (phc.rangeDataArr[i]["delta"]('-energyWh') !== undefined) {
                    dataPanel.appendChild(hh.addItemToActDataPanelCard({
                        title: 'Energy',
                        value: (phc.rangeDataArr[i]['delta']('-energyWh') / 1000).toFixed(2),
                        unit: "kWh"
                    }));
                }

//                if (phc.rangeDataArr[i]["delta"]('-energyWh') !== undefined) {
//                    dataPanel.appendChild(hh.addItemToActDataPanelCard({
//                        title: 'Average Energy',
//                        value: (phc.rangeDataArr[i]['delta']('-energyWh') / 1000 / phc.rangeDataArr.length).toFixed(2),
//                        unit: "kWh"
//                    }));
//                }


                if (phc.rangeDataArr[i]["max"]('-capacityP') !== undefined) {
                    dataPanel.appendChild(hh.addItemToActDataPanelCard({
                        title: 'Max Storage',
                        value: (phc.rangeDataArr[i]['max']('-capacityP')).toFixed(2),
                        unit: "%"
                    }));
                }
                ;
                if (phc.rangeDataArr[i]["min"]('-capacityP') !== undefined) {
                    dataPanel.appendChild(hh.addItemToActDataPanelCard({
                        title: 'Min Storage',
                        value: (phc.rangeDataArr[i]['min']('-capacityP')).toFixed(2),
                        unit: "%"
                    }));
                }
                ;
                if (phc.rangeDataArr[i]["average"]('-capacityP') !== undefined) {
                    dataPanel.appendChild(hh.addItemToActDataPanelCard({
                        title: 'Average Storage',
                        value: (phc.rangeDataArr[i]['average']('-capacityP')).toFixed(2),
                        unit: "%"
                    }));
                }
                ;
                if (phc.rangeDataArr[i]["delta"]('-capacityP') !== undefined) {
                    dataPanel.appendChild(hh.addItemToActDataPanelCard({
                        title: 'Change in Storage',
                        value: (phc.rangeDataArr[i]['delta']('-capacityP')).toFixed(2),
                        unit: "%"
                    }));
                }

            }
        }
//        console.log(phc.rangeDataArr);
        //console.log('onXYSelection');
    },

    onClickAfterSelection: function () {
        $(".customPanel").hide();
    },

    createChartTimeControl: function () {

        let el = phc.chart.controlLeftDiv;
        let settingContainer = document.createElement('div');
        settingContainer.classList.add('chCtrl-datePicker');
        el.appendChild(settingContainer);

        let periodControlDiv = document.createElement('div');
        periodControlDiv.classList.add('period-control');

        phc.selectedDateHidSlider = new HidSlider(periodControlDiv, {
            labelFormatter: function (v) {
                if (v > 1) {
                    return v + ' Days';
                }
                return v + ' Day';
            },

            val: phc.selectedDateHisRange,
            minVal: 1,
            maxVal: 7,
            hideOnChange: true,
            containerClass: 'chCtrl-datePicker-control',
            inputWidth: '75px',
            onValueChange: function (val) {
//                console.log('HidSlider value change: ' + val);
                phc.selectedDateHisRange = val;
                phc.onDateSelectionChange();
            }

        });

        settingContainer.appendChild(periodControlDiv);
        let calendarDiv = document.createElement('div');

        let leftArrow = document.createElement('div');
        leftArrow.classList.add('chCtrl-datePicker-icon');
        let leftArrowIcon = document.createElement('i');
        hh.addClass(leftArrowIcon, ['fas', 'fa-arrow-circle-left']);
        leftArrow.appendChild(leftArrowIcon);
        calendarDiv.appendChild(leftArrow);
        leftArrow.onclick = function () {
            phc.selectedDate.subtract(1, 'day');
            phc.selectedDateLabel.textContent = phc.selectedDate.format(phc.selectedDateFormatter);
            phc.onDateSelectionChange();
        };
        let rightArrow = document.createElement('div');
        rightArrow.classList.add('chCtrl-datePicker-icon');
        let rightArrowIcon = document.createElement('i');
        hh.addClass(rightArrowIcon, ['fas', 'fa-arrow-circle-right']);
        rightArrow.appendChild(rightArrowIcon);
        rightArrow.onclick = function () {
            if (moment(phc.selectedDate).add(1, 'day').isBefore(moment())) {
                phc.selectedDate.add(1, 'day');
                phc.selectedDateLabel.textContent = phc.selectedDate.format(phc.selectedDateFormatter);
                phc.onDateSelectionChange();
            }
        };
        phc.selectedDateFormatter = 'DD MMM YYYY';
        let calendar = document.createElement('span');
        calendar.classList.add('chCtrl-datePicker-control');

        calendarDiv.classList.add('period-control');

        phc.selectedDateLabel = calendar;
        phc.selectedDateLabel.textContent = phc.selectedDate.format(phc.selectedDateFormatter);
//        calendar.id = phc.name + "DataPicker";
        $(calendar).daterangepicker({
            singleDatePicker: true,
            startDate: phc.selectedDate,
            minYear: moment(),
            maxDate: moment()
        }, function (start, end, label) {
            phc.selectedDate = start;
            phc.selectedDateLabel.textContent = phc.selectedDate.format(phc.selectedDateFormatter);
            phc.onDateSelectionChange();
        });
        calendarDiv.appendChild(calendar);
        calendarDiv.appendChild(rightArrow);
        settingContainer.appendChild(calendarDiv);
    },

    proccessData: function (powerDataJson, energyDataJson, args, err) {
        if (err !== undefined && err !== "null") {

        } else {
            let powerData = JSON.parse(powerDataJson);
            if (Array.isArray(powerData)) {
                for (var i = 0; i < powerData.length; i++) {
                    let dailyData = powerData[i];
                    if (Array.isArray(dailyData) && dailyData.length === 3) {
                        phc.dataExtractorSimplePower(dailyData[0], dailyData[1], dailyData[2], phc.averagePeriodPowerObj);
                    }
                }
                // phc.dataExtractorSimplePowerSorting();
            }

            let energyData = JSON.parse(energyDataJson);
            if (Array.isArray(energyData)) {
                for (var i = 0; i < energyData.length; i++) {
                    let dailyData = energyData[i];
//                    console.log('+++++++');
//                    console.log(dailyData);
                    if (Array.isArray(dailyData) && dailyData.length === 3) {
                        phc.dataExtractorSimpleStorage(dailyData[0], dailyData[1], dailyData[2], phc.averagePeriodPowerObj);
                    }
                }

            }
            phc.dataExtractorSimplePowerSorting();

            // Populating the Calculated Powers
            phc.dataExtractorCalcPowers();

            phc.onDataReceived();
//            let daysArr = Object.keys(phc.dataBuff).sort();
//            for (var i = 0; i < daysArr.length; i++) {
//                let dayArr = phc.dataBuff[daysArr[i]];
//                for (var j = 0; j < dayArr.length; j++) {
//                    phc.chart.chart.addData(dayArr[j]);
//                }
//            }
//
//            phc.chart.addRequiredSeries(phc.reqSeries);
//            phc.chart.hideLoadingIndicator();
//            phc.chart.chart.validateData();
        }
    },

    // Adding Simple Power or Calculated Power to the Series that will be added to the Chart
    addPowerReqSeries: function (powerName) {
        if (phc.reqSeries[powerName] !== undefined) {
            return;
        }
        phc.reqSeries[powerName] = {
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
                    value: "{name}: [bold]{valueY}W"
                },
                {
                    label: "Power + Energy Total",
                    value: '{name}: [bold]{valueY}W[/]\nEnergy: [bold]{' + powerName + "-energyWh}Wh"
                }
            ],
            dataFields: {
                valueY: powerName + '-powerW',
                dateX: 'date'
            }
        };
    },

    dataExtractorCalcPowers: function () {
        // If there is not calculated powers or simple Power were extrated previously
        if (!psManager.calcPowerList || Object.keys(phc.reqSeries).length === 0) {
            return;
        }

        // Adding required series for the Calculated Powers
        for (var powerName in psManager.calcPowerList) {
            phc.addPowerReqSeries(powerName);
        }

        // Populating the data of the Calculated Powers
        for (let i = 0; i < phc.newDaysArr.length; i++) {
            let newDay = phc.newDaysArr[i];
            let dataArr = phc.dataBuff[newDay];
            for (let j = 0; j < dataArr.length; j++) {
                let data = dataArr[j];
                for (var powerName in psManager.calcPowerList) {
                    let expression = JSON.parse(psManager.calcPowerList[powerName].expression);
                    let power = psManager.calcExpresion(expression, data, '-powerW');
                    if (power !== null && power !== undefined) {
                        data[powerName + '-powerW'] = power;
                    }
                    let energy = psManager.calcExpresion(expression, data, '-energyWh');
                    if (energy !== null && energy !== undefined) {
                        data[powerName + '-energyWh'] = energy;
                    }
                }
            }
        }
    },

    dataExtractorSimplePower: function (dateStr, powerName, dailyData, averagePeriodObj) {
        phc.addPowerReqSeries(powerName);

        if (Array.isArray(dailyData)) {
            dailyData.sort(function (a, b) {
                return  a[0].localeCompare(b[0]);
            });
            let preveousObj = null;

            phc.knownSeriesPower[powerName] = phc.knownSeriesPower[powerName] || true;
            let arr = phc.tempDataBuff[dateStr] = phc.tempDataBuff[dateStr] || [];
            for (var i = 0; i < dailyData.length; i++) {
                let row = dailyData[i];
                let obj = {};
                obj[powerName + '-powerW'] = Number(row[1]);
                obj[powerName + '-energyWh'] = Number(row[2]);
                obj['timeStr'] = row[0];
                let tStr = row[0].split(':');
                obj['secSinceMidNight'] = (Number(tStr[0]) * 60 * 60) + (Number(tStr[1]) * 60) + Number(tStr[2]);
                arr.push(obj);
                if (preveousObj) {
                    let periodToPrevous = obj.secSinceMidNight - preveousObj.secSinceMidNight;
                    if (averagePeriodObj[periodToPrevous] === undefined) {
                        averagePeriodObj[periodToPrevous] = 0;
                    }
                    averagePeriodObj[periodToPrevous]++;
                }
                preveousObj = obj;
            }
        }
    },

    getPowerAveragePeriod: function () {
        let periodSecCount = 0;
        let periodSec = 0;
        for (var avrgSec in phc.averagePeriodPowerObj) {
            if (phc.averagePeriodPowerObj[avrgSec] > periodSecCount) {
                periodSecCount = phc.averagePeriodPowerObj[avrgSec];
                periodSec = avrgSec;
            }
        }
        return Number(periodSec);
    },

    getPowerDataObjFromArray: function (destArrObj, daylyBeginSecond, averagePeriodSec, currentMinSM, dateStr) {
        //this function also handles the STORAGE series values
        //   daylyBeginSecond=261    averagePeriodSec=602   currentMinSM =265
        let t = Number((((currentMinSM - daylyBeginSecond) / averagePeriodSec).toFixed(0)));
        let mod = (currentMinSM - daylyBeginSecond) % averagePeriodSec;
        if (mod > (averagePeriodSec / 2)) {
            t++;
        }
        let position = daylyBeginSecond + (t * averagePeriodSec);
        if (destArrObj[position] === undefined) {
            let lastKnownObj = destArrObj[position] = {};
            let dur = moment.duration(position, 's');
            if (dur.days() > 0) {
                return {};
            }

            let sec = dur.seconds().toFixed(0);
            let min = dur.minutes().toFixed(0);
            let hr = dur.hours().toFixed(0);
            if (sec.length === 1)
                sec = '0' + sec;
            if (min.length === 1)
                min = '0' + min;
            if (hr.length === 1)
                hr = '0' + hr;

            let timeStr = hr + ':' + min + ':' + sec;
            lastKnownObj.date = moment(dateStr + ' ' + timeStr)._d;
            lastKnownObj.timeStr = timeStr;
            lastKnownObj.secSinceMidNight = position;
            //           console.log(lastKnownObj.timeStr);
        }
        return  destArrObj[position];
    },

    dataExtractorSimplePowerSorting: function () {
        let averagePeriodSec = phc.getPowerAveragePeriod();

        phc.newDaysArr = [];
        for (var dateStr in phc.tempDataBuff) {
            // Avoiding recalculating previous storaged data in the Data Buffer 
            if (phc.dataBuff[dateStr]) {
                continue;
            }

            phc.newDaysArr.push(dateStr);

            let daylyDataArr = phc.tempDataBuff[dateStr];
            let destArrObj = {};
            daylyDataArr.sort(phcUtil.sortSimplePowerFromMinSinceMidFn);
            let daylyBeginSecond = null;

            for (var i = 0; i < daylyDataArr.length; i++) {
                let curObj = daylyDataArr[i];
                let currentMinSM = curObj.secSinceMidNight;
                if (daylyBeginSecond === null) {
                    daylyBeginSecond = curObj.secSinceMidNight;
                }

                let dataArrObj = phc.getPowerDataObjFromArray(destArrObj, daylyBeginSecond, averagePeriodSec, currentMinSM, dateStr);

                if (dataArrObj.date === undefined) {
                    dataArrObj.date = moment(dateStr + ' ' + curObj.timeStr)._d;
                    dataArrObj.timeStr = curObj.timeStr;
                    dataArrObj.secSinceMidNight = curObj.secSinceMidNight;
                }
                for (var fieldName in curObj) {
                    if (fieldName !== 'timeStr' && fieldName !== 'secSinceMidNight')
                        dataArrObj[fieldName] = curObj[fieldName];
                }
            }

            let values = Object.values(destArrObj);
            values.sort(
                    function (a, b) {
                        if (a.secSinceMidNight > b.secSinceMidNight) {
                            return 1;
                        }
                        if (a.secSinceMidNight < b.secSinceMidNight) {
                            return -1;
                        }
                        return 0;
                    }
            );
            phc.dataBuff[dateStr] = values;
        }
    },

    dataExtractorSimpleStorage: function (dateStr, storageName, dailyData, averagePeriodObj) {
        if (phc.reqSeries[storageName] === undefined) {

            phc.reqSeries[storageName] = {
                name: storageName,
                yAxis: 'capacityP',
                valueAxisY: 'capacityP',
                seriesType: 'LineSeries',
                seriesNumberFormat: "##.##",
                //tooltip text config start here 
                toolTipDefault: "Percentage, Voltage",
                toolTipOptions: [
                    {
                        label: "None",
                        value: ""
                    },
                    {
                        label: "Percentage",
                        value: "{name}: [bold]{valueY.formatNumber('#.##')}%"
                    },
                    {
                        label: "Percentage, Voltage",
                        value: "Storage: [bold]{valueY.formatNumber('#.##')}%[/]\n Voltage: [bold]{" + storageName + "-voltageV}V"
                    },
                    {
                        label: "Percentage, Voltage, Current, Capacity",
                        value: "Storage: [bold]{valueY.formatNumber('#.##')}%[/]  Capacity: [bold]{" + storageName + "-capacityAh}Ah[/]\n Voltage: [bold]{" + storageName + "-voltageV}V[/]  Current: [bold]{" + storageName + "-currentA}A[/]"
                    }
                ],
                dataFields: {
                    valueY: storageName + '-capacityP',
                    dateX: 'date'
                }
            };

        }

        if (Array.isArray(dailyData)) {
            dailyData.sort(function (a, b) {
                return  a[0].localeCompare(b[0]);
            });
            let preveousObj = null;

            phc.knownSeriesStorage[storageName] = phc.knownSeriesStorage[storageName] || true;
            let arr = phc.tempDataBuff[dateStr] = phc.tempDataBuff[dateStr] || [];
            for (var i = 0; i < dailyData.length; i++) {
                let row = dailyData[i];
                let obj = {};
                obj[storageName + '-capacityP'] = Number(row[1]);
                obj[storageName + '-capacityAh'] = Number(row[2]);
                obj[storageName + '-currentA'] = Number(row[3]);
                obj[storageName + '-voltageV'] = Number(row[4]);
                obj['timeStr'] = row[0];
                let tStr = row[0].split(':');
                obj['secSinceMidNight'] = (Number(tStr[0]) * 60 * 60) + (Number(tStr[1]) * 60) + Number(tStr[2]);
                arr.push(obj);
                if (preveousObj) {
                    let periodToPrevous = obj.secSinceMidNight - preveousObj.secSinceMidNight;
                    if (averagePeriodObj[periodToPrevous] === undefined) {
                        averagePeriodObj[periodToPrevous] = 0;
                    }
                    averagePeriodObj[periodToPrevous]++;
                }
                preveousObj = obj;
            }
        }
    }

};

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

$(document).ready(function () {
    phc.init();
});

