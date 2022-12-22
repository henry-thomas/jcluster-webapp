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
/* global moment, PF */

function compareChartDailyPowerData(a, b) {
    if (a.date < b.date)
        return -1;
    if (a.date > b.date)
        return 1;
    return 0;
}

function compareChartDailyPowerGraph(a, b) {
    if (a.position > b.position)
        return -1;
    if (a.position < b.position)
        return 1;
    return 0;
}

function getDateFromDateTime(d) {

    var convDate = new Date(d);
    if (convDate instanceof Date) {
// var a = new Date(convDate.getFullYear(), convDate.getMonth(), convDate.getDay());
        return moment(convDate).startOf("day")._d;
    }
    return null;
}

function getDateFromDateTime(d) {

//    var convDate = new Date(d);
//    if (convDate instanceof Date) {
//        return moment(convDate).startOf("day")._d;
//    }
    convDate = moment(d)._d;
    if (convDate instanceof Date) {
        return moment(convDate).startOf("day")._d;
    }
    return null;
}

function getMinIntervalInBuffer(buffer, dateField) {
    if (dateField === undefined) {
        dateField = "date";
    }
    var interval = -1;
    for (var i = 0; i < buffer.length; i++) {
        if (buffer[i + 1] !== undefined) {

            var nextData = new Date(buffer[i + 1][dateField]).getTime();
//            var nextData = moment(buffer[i + 1][dateField])._d.getTime();
            var thisData = new Date(buffer[i][dateField]).getTime();
//            var thisData = moment(buffer[i][dateField])._d.getTime();
            var tempInterval = nextData - thisData;
            if (interval === -1 && tempInterval > 0) {
                interval = tempInterval;
            }
            if (interval > tempInterval && tempInterval > 0) {
                interval = tempInterval;
            }
        }
    }
    return interval;
}

function addDataToBuffer(data,
        buffer,
        minInterval,
        dateField) {

    if (dateField === undefined) {
        dateField = "date";
    }

//var dateCom = data[dateField];
    var objectDate = new Date(data[dateField]);
    var lookupObject;
    for (var i = 0; i < buffer.length; i++) {
        var dataFromBuff = buffer[i];
        var curBuffDate = new Date(dataFromBuff.date);
//        if (moment(dateCom).isSame(buffer[i].date)) {
        if (objectDate.getTime() === curBuffDate.getTime()) {
            return dataFromBuff;
        }

        if (objectDate < curBuffDate) {
            if (lookupObject === undefined) {
                lookupObject = dataFromBuff;
            }
            var lookupDate = new Date(lookupObject.date);
            if (lookupDate > curBuffDate) {
                lookupObject = dataFromBuff;
            }
        }
    }

    if (lookupObject !== undefined) {
        var lcDate = new Date(lookupObject.date);
//        var calcInteval = lookupDate.getTime() - objectDate.getTime();
        var calcInteval = objectDate.getTime() - lcDate.getTime();
        if (calcInteval < minInterval) {
            return lookupObject;
        }
    }

//if there is not position for placed found
    var idx = buffer.length;
    data.date = objectDate;
    buffer.push(data);
    return buffer[idx];
}


var dg = {
    powerData: [],
    powerGraph: [],
    loadedDaysPowerMap: [],
    loadedDaysPowerArrKeys: [],
    powerDataBuff: [],
    dataBuffTest: [],
    endDay: new Date(),
    historyDays: 1,
    
    refreshDataFromBuffer: function () {
        //  console.log('------------new data aaaaa' );
       // dailyChartPower.validateData();
      //  var d = getDateFromDateTime(dg.endDay);
        dg.powerData = [];
        //dg.loadedDaysPowerMap[getDateFromDateTime(new Date())].length

        for (var j = 0; j < dg.historyDays; j++) {
            var reqDate = moment(dg.endDay).subtract(j, 'days')._d;
            reqDate = getDateFromDateTime(reqDate);
            if (dg.dataBuffTest[reqDate] !== undefined) {
                for (var k = 0; k < dg.dataBuffTest[reqDate].length; k++) {
                    // console.log('------------new data aaaaa');
                    dg.powerData.push(dg.dataBuffTest[reqDate][k]);
                }
            }
        }

        dailyChartPower.dataProvider = dg.powerData;
        //set no data label
        dg.setNoDataLabel(dg.powerData.length === 0);
        dg.powerData.sort(compareChartDailyPowerData);
        dailyChartPower.validateData();
    },
    addPowerData: function (data) {
        PF('chartBlockUI').hide();
        var minTimeInterval = getMinIntervalInBuffer(data);
        for (var i = 0; i < data.length; i++) {
            if (data[i].date !== undefined) {
                data[i].date = moment(data[i].date)._d;
            }
            var d = getDateFromDateTime(data[i].date);
            if (dg.dataBuffTest[d] === undefined) {
                dg.dataBuffTest[d] = [];
            }

            var testBuff = dg.dataBuffTest[d];
            var dataInBuff = addDataToBuffer(data[i], testBuff, minTimeInterval, "date");
            var pName = data[i].powerName;
            dataInBuff[pName + '-daily'] = data[i].dailyEnergy.toFixed(2);
            dataInBuff[pName] = data[i].power.toFixed(2);
            dataInBuff[pName + '-daily'] = data[i].dailyEnergy.toFixed(2);
            //testBuff.sort(compareChartDailyPowerData);
        }
        dg.refreshDataFromBuffer();
    },
    addGraphPower: function (gr) {
        //   console.log('update Graphs');
        for (var i = 0; i < gr.length; i++) {
            gr[i].lineColor = '#' + gr[i].lineColor;
            gr[i].fillColors = '#' + gr[i].fillColors;

            gr[i].lineAlpha = (gr[i].lineAlpha / 100).toFixed(1);
            gr[i].fillAlphas = (gr[i].fillAlphas / 100).toFixed(1);
            if (gr[i].showBalloonExtend) {
                gr[i].balloonText += gr[i].balloonTextExtended;
            }
            dg.powerGraph.push(gr[i]);
        }
        dg.orderGraphPower();
    },
    refreshGraphPower: function (gr) {
        dg.powerGraph.length = 0;
        //   console.log('refresh Graphs');
        for (var i = 0; i < gr.length; i++) {
            gr[i].lineColor = '#' + gr[i].lineColor;
            gr[i].fillColors = '#' + gr[i].fillColors;

            gr[i].lineAlpha = (gr[i].lineAlpha / 100).toFixed(1);
            gr[i].fillAlphas = (gr[i].fillAlphas / 100).toFixed(1);

            if (gr[i].showBalloonExtend) {
                gr[i].balloonText += gr[i].balloonTextExtended;
            }

            dg.powerGraph.push(gr[i]);
        }
        dg.powerGraph.sort(compareChartDailyPowerGraph);
//        console.log('reorder Graphs');
        dailyChartPower.validateData();
    },
    orderGraphPower: function () {
        dg.powerGraph.sort(compareChartDailyPowerGraph);
        //  console.log('reorder Graphs');
        dailyChartPower.validateData();
    },
    endDayChange: function () {
        dg.endDay = PF('dailyChartCalendar').getDate();
        dg.dayPeriodChange();
    },
    hDaysChange: function (event, ui) {
        dg.historyDays = ui.value;
        dg.dayPeriodChange();
    },
    setNoDataLabel: function (show) {
        if (show) {
            dailyChartPower.allLabels[0].text = "No data for the selected period.";
        } else {
            dailyChartPower.allLabels[0].text = "";
        }
    },
    dayPeriodChange: function () {
        //moment(dat).subtract(120, 'days')
        //clear all data in the chart
       var dateToLoad = [];
        for (var j = 0; j < dg.historyDays; j++) {

            var reqDate = getDateFromDateTime(moment(dg.endDay).subtract(j, 'days')._d);
            if (dg.dataBuffTest[reqDate] === undefined) {
                dateToLoad.push(reqDate);
            }

        }
        if (dateToLoad.length !== 0) {
            PF('chartBlockUI').show();
            getNewData([{
                    name: "queryDays",
                    value: JSON.stringify(dateToLoad)
                }]);
            //     console.log("hDayChange to: " + dg.historyDays);
        }
        dg.refreshDataFromBuffer();
    }

};
var eg = {
    powerData: [],
    powerGraph: [],

    endDay: new Date(),

    sliderMinValue: 1,
    sliderMaxValue: 20,

    periodObj: {
        daily: {
            historyDays: 1,
            dataBuff: [],
            momentDateInterval: 'days',
            valueFildSufix: '-daily',
            valueFildBaloonText: 'Daily'
        },
        weekly: {
            historyDays: 1,
            dataBuff: [],
            momentDateInterval: 'week',
            valueFildSufix: '-wEnergy',
            valueFildBaloonText: 'Weekly'
        },
        monthly: {
            historyDays: 1,
            dataBuff: [],
            momentDateInterval: 'month',
            valueFildSufix: '-mEnergy',
            valueFildBaloonText: 'Monthly'
        },
        yearly: {
            historyDays: 1,
            dataBuff: [],
            momentDateInterval: 'year',
            valueFildSufix: '-yEnergy',
            valueFildBaloonText: 'Yearly'
        }
    },

    getDataObjectFromMomentDateInterval: function (momentInterval) {
        switch (momentInterval) {
            case "days":
            {
                return eg.periodObj.daily;
            }
            case "week":
            {
                return eg.periodObj.weekly;
            }
            case "month":
            {
                return eg.periodObj.monthly;
            }
            case "year":
            {
                return eg.periodObj.yearly;
            }
        }
    },

    refreshDataFromBuffer: function () {
        //  console.log('------------new data aaaaa' );

        var buff = eg.getSelectedPerObj().dataBuff;
        eg.powerData = [];
        //eg.loadedDaysPowerMap[getDateFromDateTime(new Date())].length

        for (var j = 0; j < eg.getSelectedHystoryDays(); j++) {

            var reqDate = moment(eg.endDay).endOf(eg.getSelectedPerObj().momentDateInterval)._d;
            reqDate = moment(reqDate).subtract(j, eg.getSelectedPerObj().momentDateInterval)._d;
            reqDate = moment(reqDate).endOf(eg.getSelectedPerObj().momentDateInterval)._d;

            if (buff[reqDate] !== undefined) {
                eg.powerData.push(buff[reqDate]);
            }

        }


        eg.powerData.sort(compareChartDailyPowerData);
        chartEnergy.dataProvider = eg.powerData;
        //set no data label
        eg.setNoDataLabel(eg.powerData.length === 0);
        chartEnergy.validateData();
        PF('chartEnergyBlockUI').hide();
    },

    addEnergyData: function (data, period) {
//        console.log("new Data call addPowerDataDaily: " + data.length + ' period: ' + period);
        var buff = eg.getDataObjectFromMomentDateInterval(period).dataBuff;
//        var buff = eg.getSelectedPerObj().dataBuff;

        for (var i = 0; i < data.length; i++) {

//            var d = getDateFromDateTime(data[i].date);
            var d = moment(data[i].date).endOf(period)._d;
            if (buff[d] === undefined) {
                buff[d] = data[i];
            }
            buff[d].date = d;

            var powerName = data[i].powerName;

            if (buff !== undefined) {
//                console.log("add Object daylyEnergy date: " + d);
                buff[d][powerName] = data[i].dailyEnergy.toFixed(2);
                buff[d][powerName + '-daily'] = data[i].dailyEnergy.toFixed(2);
                if (data[i].weeklyEnergy)
                    buff[d][powerName + '-wEnergy'] = data[i].weeklyEnergy.toFixed(2);
                if (data[i].monthlyEnergy)
                    buff[d][powerName + '-mEnergy'] = data[i].monthlyEnergy.toFixed(2);
                if (data[i].yearlyEnergy)
                    buff[d][powerName + '-yEnergy'] = data[i].yearlyEnergy.toFixed(2);
            }
        }
        eg.refreshDataFromBuffer();
    },

    addGraphPower: function (gr) {
        //   console.log('update Graphs');
        for (var i = 0; i < gr.length; i++) {
            gr[i].lineColor = '#' + gr[i].lineColor;
            gr[i].fillColors = '#' + gr[i].fillColors;

            gr[i].lineAlpha = (gr[i].lineAlpha / 100).toFixed(1);
            gr[i].fillAlphas = (gr[i].fillAlphas / 100).toFixed(1);
            eg.powerGraph.push(gr[i]);
        }
        eg.graphs.refreshGraphsValueFields(eg.getSelectedPerObj().valueFildSufix, eg.getSelectedPerObj().valueFildBaloonText);
        eg.orderGraphPower();
    },

    refreshGraphPower: function (gr) {
        eg.powerGraph.length = 0;
        //   console.log('refresh Graphs');
        for (var i = 0; i < gr.length; i++) {
            gr[i].lineColor = '#' + gr[i].lineColor;
            gr[i].fillColors = '#' + gr[i].fillColors;

            gr[i].lineAlpha = (gr[i].lineAlpha / 100).toFixed(2);
            gr[i].fillAlphas = (gr[i].fillAlphas / 100).toFixed(1);

            eg.powerGraph.push(gr[i]);
        }
        eg.powerGraph.sort(compareChartDailyPowerGraph);
        //    console.log('reorder Graphs');
        chartEnergy.validateData();
    },
    orderGraphPower: function () {
        eg.powerGraph.sort(compareChartDailyPowerGraph);
        //   console.log('reorder Graphs');
        chartEnergy.validateData();
    },
    endDayChange: function () {
        eg.endDay = PF('energyChartCalendar').getDate();
        eg.hDaysChange();
    },
    periodChange: function () {
        //validate input
        var days = eg.getSelectedHystoryDays();
        switch (eg.getSelectedPeriod()) {
            case "daily":
                if (days > 45) {
                    eg.slider.setHistorySlider(45);
                }
                eg.slider.setHistorySliderMax(45);
                break;
            case "weekly":
                if (days > 52) {
                    eg.slider.setHistorySlider(52);
                }
                eg.slider.setHistorySliderMax(52);
                break;
            case "monthly":
                if (days > 12) {
                    eg.slider.setHistorySlider(12);
                }
                eg.slider.setHistorySliderMax(12);
                break;
            case "yearly":
                if (days > 5) {
                    eg.slider.setHistorySlider(5);
                }
                eg.slider.setHistorySliderMax(5);
                break;
            default:
                //      console.log(" refresh date with invalid selector: " + period);
                break;
        }
        eg.slider.onHistorySlideChange();
        eg.hDaysChange();
    },

    hDaysChange: function (event, ui) {
        PF('chartEnergyBlockUI').show();
        eg.slider.onHistorySlideChange();
        var days = eg.getSelectedHystoryDays();

        var dateToLoad = [];
        for (var j = 0; j < days; j++) {
            var reqDate = moment(eg.endDay).endOf(eg.getSelectedPerObj().momentDateInterval)._d;
            reqDate = moment(reqDate).subtract(j, eg.getSelectedPerObj().momentDateInterval)._d;
            reqDate = moment(reqDate).endOf(eg.getSelectedPerObj().momentDateInterval)._d;

            if (eg.getSelectedPerObj().dataBuff[reqDate] === undefined) {
//                console.log('add to require date: ' + reqDate);
                dateToLoad.push(reqDate);
            }
        }
        if (dateToLoad.length !== 0) {
            getNewDataEnergy([{
                    name: "queryDays",
                    value: JSON.stringify(dateToLoad)
                }, {
                    name: "period",
                    value: eg.getSelectedPerObj().momentDateInterval
                }
            ]);
        } else {
            PF('chartEnergyBlockUI').hide();
        }

        eg.graphs.refreshGraphsValueFields(eg.getSelectedPerObj().valueFildSufix, eg.getSelectedPerObj().valueFildBaloonText);
        eg.refreshDataFromBuffer();
    },

    getSelectedPeriod: function () {
        return PF('energyPeriodRadioWidget').getJQ().find(':checked').val() || "";
    },

    setNoDataLabel: function (show) {
        if (show) {
            chartEnergy.allLabels[0].text = "No data for the selected period.";
        } else {
            chartEnergy.allLabels[0].text = "";
        }
    },
    getSelectedPerObj: function () {
        return eg.periodObj[eg.getSelectedPeriod()];
    },
    getSelectedHystoryDays: function () {
        return PF('hystoryDaysSliderEnergy').getValue();
    },
    slider: {
        onHistorySlideChange: function () {
            var per;
            switch (eg.getSelectedPeriod()) {
                case "daily":
                    per = 'days';
                    break;
                case "weekly":
                    per = 'weeks';
                    break;
                case "monthly":
                    per = 'months';
                    break;
                case "yearly":
                    per = 'years';
                    break;
                default:
                    //   console.log("onHistorySlideChange unknown selection: " + eg.getSelectedPeriod());
                    break;
            }
            eg.slider.setHistorySliderLabel(
                    'History ' +
                    per +
                    ': ' +
                    eg.getSelectedHystoryDays().toString());
        },
        setHistorySlider: function (value) {
            PF('hystoryDaysSliderEnergy').setValue(value);
        },
        setHistorySliderLabel: function (value) {
            $('#tabViewID\\:monthlyChartForm\\:outputEnergyDays').text(value);
        },
        setHistorySliderMin: function (value) {
            PF('hystoryDaysSliderEnergy').jq.slider("option", "min", value);
        },
        setHistorySliderMax: function (value) {
            PF('hystoryDaysSliderEnergy').jq.slider("option", "max", value);
        }
    },
    graphs: {
        refreshGraphsValueFields: function (fieldName, valueFildBaloonText) {
//           chartEnergy.graphs["0"].valueField;
//           chartEnergy.graphs[0].id;
            // console.log('call valufield refresh');
            for (var i = 0; i < chartEnergy.graphs.length; i++) {
                var graph = chartEnergy.graphs[i];
                graph.valueField = graph.id + fieldName;
                //"[[title]]: [[value]] kW</br>Daily energy:  [[grid-daily]] kWh"
                graph.balloonText = '[[title]]</br>'
                        + valueFildBaloonText
                        + ' energy: '
                        + '[[value]] kWh';
                // console.log('set valufield refresh: ' + graph.valueField);
                chartEnergy.titles[0].text = valueFildBaloonText + ' energy graph'
            }
            for (var graph in chartEnergy.graphs) {
            }
        }
    }
};

var dailyChartPower = AmCharts.makeChart("chartDaylyPower",
        {
            type: "serial",
            "color": "#555555",
            "categoryField": "date",
            "accessibleTitle": "dailyChart",
            "pathToImages": "/resources/amCharts/images/",
            "dataDateFormat": "YYYY-MM-DD HH:NN",
            "startDuration": 1,
            "libs": [{
                    "path": "/resources/amCharts/plugins/export/libs/"
                }, {
                    "path": "/resources/amCharts/plugins/export/"
                }],
            "categoryAxis": {
                "equalSpacing": false,
                "minPeriod": "mm",
                "parseDates": true
            },
            "chartCursor": {
                "enabled": true,
                "categoryBalloonDateFormat": "YYYY-MM-DD JJ:NN"
            },
            "chartScrollbar": {
                "enabled": true,
                "graph": "pv"
            },
            "trendLines": [],
            graphs: dg.powerGraph,
            "allLabels": [
                {
                    "align": "center",
                    "id": "Label-1",
                    "size": 29,
                    "text": "No data for selected period!",
                    "x": "0%",
                    "y": "50%"
                }
            ],
            "valueAxes": [
                {
                    "id": "ValueAxis-1",
                    "title": "Power in kW"
                }
            ],

            "balloon": {},
            "legend": {
                "enabled": true,
                valueText: "[[value]] kW"
            },
            "titles": [
                {
                    "id": "Title-1",
                    "size": 15,
                    "text": "Power graph"
                }
            ],
            "dataProvider": dg.powerData,
            "export": {
                "enabled": true
            }
        }
);

var chartEnergy = AmCharts.makeChart("chartEnergyName",
        {
            type: "serial",
            "color": "#555555",
            "categoryField": "date",
            "accessibleTitle": "energyChart",
            "pathToImages": "/resources/amCharts/images/",
            "dataDateFormat": "YYYY-MM-DD",
            "startDuration": 1,
            "libs": [{
                    "path": "/resources/amCharts/plugins/export/libs/"
                }, {
                    "path": "/resources/amCharts/plugins/export/"
                }],
            "categoryAxis": {
                "equalSpacing": true,
                "gridPosition": "start",
                "minPeriod": "DD",
                "parseDates": true
            },
            "chartCursor": {
                "enabled": true,
                "categoryBalloonDateFormat": "MM-DD-YYYY"//"JJ:NN"
            },
            "chartScrollbar": {
                "enabled": true,
                "graph": "pv"
            },
            "trendLines": [],
            graphs: eg.powerGraph,
            "guides": [],
            "valueAxes": [
                {
                    "id": "ValueAxis-1",
                    "title": "Energy in kWh"
                }
            ],
            "allLabels": [
                {
                    "align": "center",
                    "id": "Label-1",
                    "size": 29,
                    "text": "No data for selected period!",
                    "x": "0%",
                    "y": "50%"
                }
            ],
            "balloon": {},
            "legend": {
                "enabled": true,
                valueText: "[[value]] kW"
            },
            "titles": [
                {
                    "id": "Title-1",
                    "size": 15,
                    "text": "Daily energy graph"
                }
            ],
            "dataProvider": eg.powerData,
            "export": {
                "enabled": true
            }
        }

);