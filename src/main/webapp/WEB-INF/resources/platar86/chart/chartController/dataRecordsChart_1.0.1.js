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


/* global cm, moment, am4charts, hh, dataRecController, dataRecFieldMap */
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
    transferConfigCharts: []
};
var drChart = {
    name: 'drChart',
    selectedDateHisRange: 1,
    selectedDate: moment(),
    selectedDaysArr: [],
    tempDataBuff: {},
    reqSeries: {},
    knownSeriesPower: {},
    knownDaysArr: {}, //used to hold and remeber fetched dates
    rangeDataArr: [], //used to hold the xSelection data
    knownModelDates: {},
    averagePeriodPowerObj: {}, //to calculate best period for data alignemt

    init: function (models) {
        for (let i = 0; i < models.length; i++) {
            drChart.knownModelDates[models[i]] = [];
        }

        cm.createChart(
                document.getElementById(drChart.name),
                'dataRecordsChart',
                chartDefConf,
                function (chOb) {
                    chOb.showLoadingIndicator('Loading Data ...');
                    console.log('chart Init Complete');
                    drChart.chart = chOb;
                    drChart.dataBuff = chOb.chartDataDateBuff;
//                    chOb.chart.numberFormatter.numberFormat = "#.000s";
                    drChart.createChartTimeControl();



                    if (drChart.chart.chart.cursor !== undefined) {
                        drChart.chart.chart.cursor.events.on("selectended", drChart.onXSelection);
                        drChart.chart.chart.events.on("hit", drChart.onClickAfterSelection);//
                    }
                }
        );
    },

    getDataFromServer: function (startDate, endDate, reqDates, model) {
        getDataRecordsByModelFromDb([
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
                name: "model",
                value: Number(model)
            },
            {
                name: "calbackFn",
                value: "drChart.proccessData"
            }
        ]);
    },

    onDateSelectionChange: function (selectedModels) {
        if (selectedModels) {
            drChart.selectedModels = selectedModels;
        } else {
            selectedModels = drChart.selectedModels;
        }

        let daysLookup = drChart.selectedDateHisRange;
        let selectedDate = moment(drChart.selectedDate);
        let dateToFetchArr = [];
        drChart.selectedDaysArr.length = 0;
        while (daysLookup > 0) {
            let targetDateStr = selectedDate.format('YYYY-MM-DD');
            drChart.selectedDaysArr.push(targetDateStr);
            dateToFetchArr.push(targetDateStr);
            drChart.knownDaysArr[targetDateStr] = true;
            daysLookup--;
            selectedDate.subtract(1, 'days');
        }
        drChart.selectedDaysArr.sort();

        let fetchedDates = 0;
        for (let model in selectedModels) {
            let daysToFetchForModel = [];
            for (let i = 0; i < dateToFetchArr.length; i++) {
                if (!drChart.knownModelDates[selectedModels[model]].includes(dateToFetchArr[i])) {
                    fetchedDates += 1;
                    daysToFetchForModel.push(dateToFetchArr[i]);
                    drChart.knownModelDates[selectedModels[model]].push(dateToFetchArr[i]);
                }
            }
            if (daysToFetchForModel.length > 0) {
                drChart.getDataFromServer(daysToFetchForModel[daysToFetchForModel.length - 1], daysToFetchForModel[0], daysToFetchForModel, selectedModels[model]);
            }
        }
        if (fetchedDates === 0) {
            dataRecController.updateDataCache();
        }
//        else {
//        }

    },

    onDataReceived: function () {
        let daysArr = Object.keys(drChart.dataBuff).sort();
        drChart.chart.chart.data.length = 0;
//        for (let series in drChart.chart.chart.series.values) {
//            drChart.chart.chart.series.removeIndex(series).dispose();
//        }

        for (var i = 0; i < drChart.selectedDaysArr.length; i++) {
            let dayArr = drChart.dataBuff[drChart.selectedDaysArr[i]];
            if (dayArr) {
                for (var j = 0; j < dayArr.length; j++) {
                    drChart.chart.chart.addData(dayArr[j]);
                }
            }
        }

//        drChart.chart.chart.addData(drChart.dataBuff);

        drChart.chart.chart.xAxes.values[0].dateFormats.setKey('day', '');
        drChart.chart.chart.xAxes.values[0].periodChangeDateFormats.setKey('hour', '[bold]MMM-dd');
        drChart.chart.addRequiredSeries(drChart.reqSeries);
        drChart.chart.hideLoadingIndicator();
        if (drChart.chart.chartData.length < 1) {
            drChart.chart.showLoadingIndicator('No data for the selected period', true);
        }
        drChart.chart.chart.validateData();

    },

//Event listener is in init. requires active cursor.
//onXSelection creates and array of objects called 'rangeDataArr', which is the data within the selected range.
    onXSelection: function (ev) {
        let cursorBehaviour = drChart.chart.chart.cursor.behavior;
        if ((cursorBehaviour !== 'selectX') && (cursorBehaviour !== 'selectXY')) {
            return;
        }
        if (ev.target.xRange) {

            let startDate = moment(drChart.chart.chart.xAxes.values[0].positionToDate(ev.target.xRange.start));
            let endDate = moment(drChart.chart.chart.xAxes.values[0].positionToDate(ev.target.xRange.end));

            let rangeX = ev.target.xRange;
            let selectedXValues = ev.target.chart.xAxes.getIndex(0);
//        
            let fromX = selectedXValues.getPositionLabel(selectedXValues.toAxisPosition(rangeX.start));
            let toX = selectedXValues.getPositionLabel(selectedXValues.toAxisPosition(rangeX.end));

            if (drChart.chart.chartData !== undefined) {

                let rangeDataScope = []; //Create an array with only the data within the selected range.
                for (let i = 0; i < drChart.chart.chartData.length - 1; i++) {
                    if (drChart.chart.chartData[i].time !== undefined)
                    {
                        //check whether the timestamps fall within the selected range
                        if (drChart.chart.chartData[i].time.getTime() >= startDate._d.getTime() && drChart.chart.chartData[i].time.getTime() <= endDate._d.getTime()) {
                            rangeDataScope.push(drChart.chart.chartData[i]);
                        }
                    }
                }


                for (let i = 0; i < drChart.chart.chart.series.values.length; i++) {
                    //only perform calculations on series who are not hidden. If a series is hidden, empty object is placed in array.
                    if (!drChart.chart.chart.series.values[i].disabled && !drChart.chart.chart.series.values[i].hiddenInLegend) {

                        let seriesId = drChart.chart.chart.series.values[i].id;
                        let seriesName = drChart.chart.chart.series.values[i].name;

                        drChart.rangeDataArr[i] = {
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
                                if (!isNaN(average)) {
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
            this.drChart.rangeDataArr = drChart.rangeDataArr;
            drChart.createSelectionDataPanels();
        }
    },

    createSelectionDataPanels: function () {
        //use the object created in 'onXSelection' here
        let el = drChart.chart.bottomContainer;
        el.classList.add('actDataContainer');
        hh.removeAllChilds(el);

        for (let i = 0; i < drChart.rangeDataArr.length; i++)
        {

            if (drChart.rangeDataArr[i] !== undefined) {
                let name = drChart.rangeDataArr[i].seriesName;


                let dataPanel = hh.createActDataPanelCard(name, 'customPanel');
                el.appendChild(dataPanel);

                dataPanel.appendChild(hh.addItemToActDataPanelCard({
                    title: 'Selection',
                    value: drChart.rangeDataArr[i]['startDate'] + '-' + drChart.rangeDataArr[i]['endDate']
                            //unit: "kWh"
                }));

                if (drChart.rangeDataArr[i]["max"]('') !== undefined) {
                    dataPanel.appendChild(hh.addItemToActDataPanelCard({
                        title: 'Max ',
                        value: (drChart.rangeDataArr[i]['max']('')).toFixed(2),
                        unit: ""
                    }));
                }

                if (drChart.rangeDataArr[i]["min"]('') !== undefined) {
                    dataPanel.appendChild(hh.addItemToActDataPanelCard({
                        title: 'Min',
                        value: ((drChart.rangeDataArr[i]['min'](''))).toFixed(2),
                        unit: ""
                    }));
                }

                if (drChart.rangeDataArr[i]["average"]('') !== undefined) {
                    dataPanel.appendChild(hh.addItemToActDataPanelCard({
                        title: 'Average',
                        value: (drChart.rangeDataArr[i]['average']('')).toFixed(2),
                        unit: ""
                    }));
                }

                if (drChart.rangeDataArr[i]["delta"]('') !== undefined) {
                    dataPanel.appendChild(hh.addItemToActDataPanelCard({
                        title: 'Delta',
                        value: (drChart.rangeDataArr[i]['delta']('')).toFixed(2),
                        unit: ""
                    }));
                }

            }
        }
    },

    onClickAfterSelection: function () {
        $(".customPanel").hide();
    },

    createChartTimeControl: function () {

        let el = drChart.chart.controlLeftDiv;
        let settingContainer = document.createElement('div');
        settingContainer.classList.add('chCtrl-datePicker');
        el.appendChild(settingContainer);

        let periodControlDiv = document.createElement('div');
        periodControlDiv.classList.add('period-control');

        drChart.selectedDateHidSlider = new HidSlider(periodControlDiv, {
            labelFormatter: function (v) {
                if (v > 1) {
                    return v + ' Days';
                }
                return v + ' Day';
            },

            val: drChart.selectedDateHisRange,
            minVal: 1,
            maxVal: 7,
            hideOnChange: true,
            containerClass: 'chCtrl-datePicker-control',
            inputWidth: '75px',
            onValueChange: function (val) {
//                console.log('HidSlider value change: ' + val);
                drChart.selectedDateHisRange = val;
                drChart.onDateSelectionChange();
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
            drChart.selectedDate.subtract(1, 'day');
            drChart.selectedDateLabel.textContent = drChart.selectedDate.format(drChart.selectedDateFormatter);
            drChart.onDateSelectionChange();
        };
        let rightArrow = document.createElement('div');
        rightArrow.classList.add('chCtrl-datePicker-icon');
        let rightArrowIcon = document.createElement('i');
        hh.addClass(rightArrowIcon, ['fas', 'fa-arrow-circle-right']);
        rightArrow.appendChild(rightArrowIcon);
        rightArrow.onclick = function () {
            if (moment(drChart.selectedDate).add(1, 'day').isBefore(moment())) {
                drChart.selectedDate.add(1, 'day');
                drChart.selectedDateLabel.textContent = drChart.selectedDate.format(drChart.selectedDateFormatter);
                drChart.onDateSelectionChange();
            }
        };
        drChart.selectedDateFormatter = 'DD MMM YYYY';
        let calendar = document.createElement('span');
        calendar.classList.add('chCtrl-datePicker-control');

        calendarDiv.classList.add('period-control');

        drChart.selectedDateLabel = calendar;
        drChart.selectedDateLabel.textContent = drChart.selectedDate.format(drChart.selectedDateFormatter);
//        calendar.id = phc.name + "DataPicker";
        $(calendar).daterangepicker({
            singleDatePicker: true,
            startDate: drChart.selectedDate,
            minYear: moment(),
            maxDate: moment()
        }, function (start, end, label) {
            drChart.selectedDate = start;
            drChart.selectedDateLabel.textContent = drChart.selectedDate.format(drChart.selectedDateFormatter);
            drChart.onDateSelectionChange();
        });
        calendarDiv.appendChild(calendar);
        calendarDiv.appendChild(rightArrow);
        settingContainer.appendChild(calendarDiv);
    },

    addData: function (data) {
        drChart.dataBuff = {};
        drChart.tempDataBuff = data;
        drChart.sortDataByDate();
        drChart.onDataReceived();
    },

    sortDataByDate: function () {
        for (let i = 0; i < drChart.tempDataBuff.length; i++) {
            let date = moment(drChart.tempDataBuff[i].time).format('YYYY-MM-DD');
            if (!drChart.dataBuff[date]) {
                drChart.dataBuff[date] = [];
            }
            drChart.dataBuff[date].push(drChart.tempDataBuff[i]);
        }
    },

    proccessData: function (data, args, err) {
        if (err !== undefined && err !== "null") {

        } else {
            let dataRecordsArr = JSON.parse(data.replaceAll("\"{", "{").replaceAll("}\"", "}"));
            dataRecController.updateDataCache(dataRecordsArr);
        }
    },

    // Adding Simple Power or Calculated Power to the Series that will be added to the Chart
    addPowerReqSeries: function (powerName, seriesDesc) {
        let fdName = seriesDesc.serNum + '-' + powerName;
        if (drChart.reqSeries[powerName] !== undefined) {
            return;
        }
        let name = powerName;
        let yAxis = 'value';
        let toolTipText = '{name}: [bold]{valueY}';
        try {
            let seriasDescObj = dataRecFieldMap.modelMap[seriesDesc.model][powerName];
            name = seriasDescObj.title;
            yAxis = seriasDescObj.axis;
            toolTipText = seriesDesc.serNum + '-' + seriasDescObj.ballonText;
        } catch (e) {
        }

        drChart.reqSeries[fdName] = {
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
//                {
//                    label: "Power + Energy Total",
//                    value: '{name}: [bold]{valueY}W[/]\nEnergy: [bold]{' + powerName + "-energyWh}Wh"
//                }
            ],
            dataFields: {
                valueY: fdName,
                dateX: 'time'
            }
        };
    }
};


