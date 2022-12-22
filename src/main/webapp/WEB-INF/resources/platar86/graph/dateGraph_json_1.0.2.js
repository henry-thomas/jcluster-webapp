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

/* global moment, PF, AmCharts, graphManager, mainUtils */

function dcCompareChartGraphByPostition(a, b) {
    if (a.position < b.position)
        return -1;
    if (a.position > b.position)
        return 1;
    return 0;
}

function sortByDateField(a, b) {
    if (a.date < b.date)
        return -1;
    if (a.date > b.date)
        return 1;
    return 0;
}

function dcGetMinIntervalInBuffer(buffer, dateField) {
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
            var tempInterval;
            if (nextData > thisData) {
                tempInterval = nextData - thisData;
            } else {
                tempInterval = thisData - nextData;

            }
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
;


function getDateFromDateTime(d) {
    convDate = moment(d)._d;
    if (convDate instanceof Date) {
        return moment(convDate).startOf("day")._d;
    }
    return null;
}

var dc = {
    // For testing purposes
    testStart: 0,
    getChart: function () {
        return graphManager.chartArr.dateGraph;
    },
    powerData: [], // data for the chartttt
    periodObj: {
        daily: {
            balloonTextSimple: "Daily energy: [[graphName_dailyEnergyWh]] kWh",
            historyPeriod: 1,
            dataBuff: {},
            label: 'days',
            obName: 'daily',
            maxPeriod: 45,
            momentDateInterval: 'days',
            momentDateFormat: 'YYYY-MM-DD',
            dataField: '_dailyEnergyWh',
            valueFildBaloonText: 'Daily'
        },
        weekly: {
            balloonTextSimple: "Weekly energy: [[graphName_weeklyEnergyWh]] kWh",
            historyPeriod: 1,
            dataBuff: {},
            label: 'weeks',
            obName: 'weekly',
            maxPeriod: 52,
            momentDateInterval: 'week',
            momentDateFormat: 'YYYY-WW',
            dataField: '_weeklyEnergyWh',
            valueFildBaloonText: 'Weekly'
        },
        monthly: {
            balloonTextSimple: "Monthly energy: [[graphName_monthlyEnergyWh]] kWh",
            historyPeriod: 1,
            dataBuff: {},
            momentDateInterval: 'month',
            momentDateFormat: 'YYYY-MM',
            label: 'months',
            obName: 'monthly',
            maxPeriod: 12,
            dataField: '_monthlyEnergyWh',
            valueFildBaloonText: 'Monthly'
        },
        yearly: {
            balloonTextSimple: "Yearly energy: [[graphName_yearlyEnergyWh]] kWh",
            historyPeriod: 1,
            dataBuff: {},
            momentDateInterval: 'year',
            momentDateFormat: 'YYYY',
            label: 'years',
            obName: 'yearly',
            maxPeriod: 5,
            dataField: '_yearlyEnergyWh',
            valueFildBaloonText: 'Yearly'
        }
    },

    endDay: new Date(),
    historyPeriod: 1,

    getPositionInBuffer: function (dateField, obj, buff) {
        obj.date = obj[dateField];
        if (buff !== undefined) {
            for (var i = buff.length - 1; i >= 0; i--) {
                var curObj = buff[i];
                if (curObj.date.getTime() < obj.date.getTime()) {
                    buff.splice(i + 1, 0, {date: obj.date});
                    return buff[i + 1];

                } else if (curObj.date.getTime() === obj.date.getTime()) {
                    return curObj;
                }
            }
            var idx = buff.unshift({
                date: obj.date
            });
            return buff[idx - 1];
        }
    },
    updateChartGroups: function () {
        var grouping = mainUtils.getSelectOneMenu('dcGroupViewWidget');
        dc.getChart().graphSkipList = {};
        switch (grouping) {
            case "groupsOnly":
                {
                    var grArr = graphManager.graphArr.dateGraph;
                    for (var item in grArr) {
                        if (grArr[item].graphType === 'powerGroup') {
                            var pList = grArr[item].powerList;
                            if (pList !== undefined) {
                                for (var item in pList) {
                                    dc.getChart().graphSkipList[pList[item]] = true;
                                }
                            }
                        }
                    }
                    dc.updateSkipList();
                }
                break;
            case "powersOnly":
                {
                    var grArr = graphManager.graphArr.dateGraph;
                    for (var item in grArr) {
                        if (grArr[item].graphType === 'powerGroup') {
                            dc.getChart().graphSkipList[grArr[item].graphName] = true;
                        }
                    }
                }
                break;
        }
    },
    // Updating the list of powers that should be displayed among it Power Calculators (Groups)
    updateSkipList: function () {
        let grArr = graphManager.graphArr.timeGraph;
        
        if (!grArr)
            return;
        
        if (!dc.getChart().graphSkipList)
            return;
        
        let skipList = Object.keys(dc.getChart().graphSkipList);
        if (!skipList || skipList === 0)
            return;
        
        // Retrieving the group charts that should be displayed among its powers 
        let groups = Object.values(graphManager.graphArr.timeGraph).filter(function(e) {return e.displayWithGroups;});
        if (!groups || groups.length === 0)
            return;
        
        for (var group in groups) {
            if (!groups[group] || !groups[group].powerList)
                continue;
            
            // Removing the required powers from the skiping list
            let powers = groups[group].powerList;
            for (var power in powers) {
                delete dc.getChart().graphSkipList[powers[power]];
            }
        }
    },
    /**
     * Calculating the Power data of the Power types and the Group Power Types as well
     * @returns {undefined}
     */
    reloadDataFromBufer: function () {
        var obj = dc.getSelectedPeriodObj();
        graphManager.updateChartGraphsValueField('dateGraph', 'graphName' + obj.dataField);
        dc.updateChartGroups();
        dc.getChart().dataProvider = {};
        dc.getChart().validateData();
        graphManager.updateChartGraphs('dateGraph');

        // Data for chart
        dc.powerData = [];
        // =================== FOR SIMPLE POWER TYPES ======================
        // Calculating the Power Data of the Different Power Types
        // Ex. Battery Discharging, Battery Charging, grid, pv, PV_MPPT, load, etc
        // =================================================================
        for (var j = 0; j < obj.historyPeriod; j++) {
            var reqDate = moment(dc.endDay).subtract(j, obj.momentDateInterval).endOf(obj.momentDateInterval).format(obj.momentDateFormat);
            if (obj.dataBuff[reqDate] !== undefined) {

                for (var item in obj.dataBuff[reqDate]) {
                    var data = obj.dataBuff[reqDate][item];
                    var date = moment(dc.endDay).subtract(j, obj.momentDateInterval).endOf(obj.momentDateInterval)._d;
                    data.lastUpdate = date;
                    var loc = dc.getPositionInBuffer('lastUpdate', data, dc.powerData);

                    if (data[obj.dataField] === 0) {
                        loc[item] = 0;
                    } else {
                        loc[item] = (data[obj.dataField] / 1000).toFixed(2);
                    }
                    loc[item] = (data.energyWh / 1000).toFixed(2);
                    loc[item + '_energyWh'] = (data.energyWh / 1000).toFixed(2);
                    loc[item + '_monthlyEnergyWh'] = (data.monthlyEnergyWh / 1000).toFixed(2);
                    loc[item + '_yearlyEnergyWh'] = (data.yearlyEnergyWh / 1000).toFixed(2);
                    loc[item + '_weeklyEnergyWh'] = (data.weeklyEnergyWh / 1000).toFixed(2);
                    loc[item + '_dailyEnergyWh'] = (data.dailyEnergyWh / 1000).toFixed(2);
                }
            }
        }
        
        // ======================= FOR GROUPS ==============================
        // Calculating the Power Data of the Different Group Power Types
        // Ex. TOTAL_PV {pv + PV_MPPT}, Exported_Power = { TOTAL_PV - load}
        // =================================================================
        if (mainUtils.getSelectOneMenu('tcGroupViewWidget') !== 'powersOnly') {

            var grArr = graphManager.graphArr.dateGraph;
            for (var item in grArr) {
                if (grArr[item].graphType === 'powerGroup') {
                    // New Approach
                    //
                    var groupName = grArr[item].graphName;
                    for (var i = 0; i < dc.powerData.length; i++) {
                        var loc = dc.powerData[i];
                        let formula = JSON.parse(grArr[item].formula);
                        loc[groupName] = dc.calculatePower('', formula, loc).toFixed(2);
                        loc[groupName + '_energyWh'] = dc.calculatePower('_energyWh', formula, loc).toFixed(2);
                        loc[groupName + '_monthlyEnergyWh'] = dc.calculatePower('_monthlyEnergyWh', formula, loc).toFixed(2);
                        loc[groupName + '_yearlyEnergyWh'] = dc.calculatePower('_yearlyEnergyWh', formula, loc).toFixed(2);
                        loc[groupName + '_weeklyEnergyWh'] = dc.calculatePower('_weeklyEnergyWh', formula, loc).toFixed(2);
                        loc[groupName + '_dailyEnergyWh'] = dc.calculatePower('_dailyEnergyWh', formula, loc).toFixed(2);
                    }

                    // Old Approach
                    //                   
//                    var pList = grArr[item].powerList;
//                    if (pList !== undefined) {
//                        var groupName = grArr[item].graphName;
//                        for (var itemInList in pList) {
//                            var powerName = pList[itemInList];
//
//                            for (var i = 0; i < dc.powerData.length; i++) {
//                                var loc = dc.powerData[i];
//                                if (loc[powerName] !== undefined) {
//                                    if (loc[groupName] === undefined) {
//                                        loc[groupName] = Number(0).toFixed(2);
//                                        loc[groupName + '_energyWh'] = (Number(0)).toFixed(2);
//                                        loc[groupName + '_monthlyEnergyWh'] = (Number(0)).toFixed(2);
//                                        loc[groupName + '_yearlyEnergyWh'] = (Number(0)).toFixed(2);
//                                        loc[groupName + '_weeklyEnergyWh'] = (Number(0)).toFixed(2);
//                                        loc[groupName + '_dailyEnergyWh'] = (Number(0)).toFixed(2);
//                                    }
//
//                                    loc[groupName] = (Number(loc[groupName]) + Number(loc[powerName])).toFixed(2);
//                                    loc[groupName + '_energyWh'] = ((Number(loc[groupName + '_energyWh'])) + (Number(loc[powerName + '_energyWh']))).toFixed(2);
//                                    loc[groupName + '_monthlyEnergyWh'] = ((Number(loc[groupName + '_monthlyEnergyWh'])) + (Number(loc[powerName + '_monthlyEnergyWh']))).toFixed(2);
//                                    loc[groupName + '_yearlyEnergyWh'] = ((Number(loc[groupName + '_yearlyEnergyWh'])) + (Number(loc[powerName + '_yearlyEnergyWh']))).toFixed(2);
//                                    loc[groupName + '_weeklyEnergyWh'] = ((Number(loc[groupName + '_weeklyEnergyWh'])) + (Number(loc[powerName + '_weeklyEnergyWh']))).toFixed(2);
//                                    loc[groupName + '_dailyEnergyWh'] = ((Number(loc[groupName + '_dailyEnergyWh'])) + (Number(loc[powerName + '_dailyEnergyWh']))).toFixed(2);
//                                }
//
//                            }
//                        }
//                    }
                }
            }
        }

        dc.powerData.sort(sortByDateField);

        dc.getChart().dataProvider = dc.powerData;
        // Set no data label
        if (dc.powerData.length !== 0) {
            dc.setNoDataLabel(dc.powerData.length === 0);
        }
        dc.getChart().validateData();
        console.log('Total time (JSON): ' + (new Date().getTime() - dc.testStart));
    },
    // Calculating the Total Power using the formula for the selected group
    //
    calculatePower: function (sufix, f, data) {
        if (!f || !data)
            return 0;
        // Managing constant values
        if (mainUtils.isNumber(f)) {
            return Number(f);
        }
        // Managing objects
        if (!mainUtils.isObject(f)) {
            const value = data[f + sufix];
            if (isNaN(value))
                return 0;
            return Number(value);
        }
        // Managing different formulas
        switch (f.op) {
            case '+':
                return dc.calculatePower(sufix, f.p1, data) + dc.calculatePower(sufix, f.p2, data);
            case '-':
                return dc.calculatePower(sufix, f.p1, data) - dc.calculatePower(sufix, f.p2, data);
            case '*':
                return dc.calculatePower(sufix, f.p1, data) * dc.calculatePower(sufix, f.p2, data);
            case '/':
                let divisor = dc.calculatePower(sufix, f.p2, data);
                if (divisor === 0) {
                    return dc.calculatePower(sufix, f.p1, data);
                }
                return dc.calculatePower(sufix, f.p1, data) / divisor;
        }
    },
//    addData: function (d) {
//        if (d !== undefined && d.length !== undefined) {
//            for (var i = 0; i < d.length; i++) {
//                var obj = dc.periodObj[d[i].period];
//
//                for (var j = 0; j < d[i].data.length; j++) {
//                    if (d[i].data[j].lastUpdate !== undefined) {
//                        d[i].data[j].lastUpdate = moment(d[i].data[j].lastUpdate, 'ddd MMM DD HH:mm:ss ZZ YYYY')._d;
//                        d[i].data[j].dateFormated = moment(d[i].data[j].lastUpdate).format(obj.momentDateFormat);
//
//                        if (obj.dataBuff[d[i].data[j].dateFormated] === undefined) {
//                            obj.dataBuff[d[i].data[j].dateFormated] = {};
//                        }
//                        obj.dataBuff[d[i].data[j].dateFormated][d[i].name] = d[i].data[j];
//
//                    }
//                }
//            }
//        }
//        dc.reloadDataFromBufer();
//        //PF('tcChartBlockUI').hide();
//        console.log('download data from server');
//    },
    addData: function (d, period) {
        if (!d || !period) {
            dc.reloadDataFromBufer();
            return;
        }
        let obj = dc.periodObj[period];
        for (let i in d) {
            for(let j in d[i]) {
                let o = {
                    lastUpdate: moment(i, obj.momentDateFormat)._d,
                    dateFormated: i,
                    dailyEnergyWh: d[i][j][0],
                    weeklyEnergyWh: d[i][j][1],
                    monthlyEnergyWh: d[i][j][2],
                    yearlyEnergyWh: d[i][j][3],
                    energyWh: d[i][j][4]
                };
                
                if (!obj.dataBuff[o.dateFormated])
                    obj.dataBuff[o.dateFormated] = {};
                
                obj.dataBuff[o.dateFormated][j] = o;
            }   
        }
        dc.reloadDataFromBufer();
    },
    getSelectedPeriodObj: function () {
        return dc.periodObj[PF('dcPeriodRadioWidget').getJQ().find(':checked').val() || ""];
    },
    periodChange: function () {
        var obj = dc.getSelectedPeriodObj();
        obj.historyPeriod = PF('dcHystoryDaysSlider').getValue();
        if (obj.historyPeriod > obj.maxPeriod) {
            PF('dcHystoryDaysSlider').setValue(obj.maxPeriod);
        }
        PF('dcHystoryDaysSlider').jq.slider("option", "max", obj.maxPeriod);
        PF('dcHystoryDaysSlider').cfg.displayTemplate = "History " + obj.label + ": {value}";
        mainUtils.setHtmlCompValue('dcOutput', 'History ' + obj.label + ':' + obj.historyPeriod);
        graphManager.chartArr.dateGraph.utilExt.balloonTextSimple_power = obj.balloonTextSimple;

        dc.dayPeriodChange();
    },
    endDayChange: function () {
        dc.endDay = PF('dcTimeChartCalendar').getDate();
        dc.dayPeriodChange();
    },

    setNoDataLabel: function (show) {
        if (show) {
            dc.getChart().allLabels[0].text = "No data for the selected period.";
        } else {
            dc.getChart().allLabels[0].text = "";
        }
    },
    dayPeriodChange: function () {
        dc.testStart = new Date().getTime();
        var obj = dc.getSelectedPeriodObj();

        var dateToLoad = [];
        for (var j = 0; j < obj.historyPeriod; j++) {
//            var reqDate = moment(dc.endDay).subtract(j, obj.momentDateInterval).endOf(obj.momentDateInterval).format('YYYY-MM-DD');
            var reqDate = moment(dc.endDay).subtract(j, obj.momentDateInterval).endOf(obj.momentDateInterval).format(obj.momentDateFormat);
            if (obj.dataBuff[reqDate] === undefined) {
                dateToLoad.push(reqDate);
            }
        }

        if (dateToLoad.length !== 0) {
//            PF('tcChartBlockUI').show();
            dateGraphLoadNewData([{
                    name: "queryDays",
                    value: JSON.stringify(dateToLoad)
                }, {
                    name: "period",
                    value: obj.obName
                }
            ]);
        } else {
            dc.reloadDataFromBufer();
        }
        dc.updateChartTitle();
    },
    updateChartTitle: function () {
        var obj = dc.getSelectedPeriodObj();
        var beginDate = moment(obj.endDay).subtract(obj.historyPeriod, obj.momentDateInterval).format(obj.momentDateFormat);
        var endDate = moment(dc.endDay).format(obj.momentDateFormat);
//        var a = PF('dcTimeChartCalendar');
//        a.input.val('Date chart (from: ' + beginDate + ' to: ' + endDate + ')');
        document.getElementsByClassName('dcGraphTitle')[0].textContent = obj.valueFildBaloonText + ' energy chart (from: ' + beginDate + ' to: ' + endDate + ')';
    },
    groupViewChange: function () {
        dc.reloadDataFromBufer();
    },
    initDate: function () {

        PF('dcTimeChartCalendar').setDate(new Date());
        dc.dayPeriodChange();
    }
};


$(document).ready(function () {
    loadPowerEnergyChartGraphs();
    dc.historyPeriod = 7;
//    dc.periodChange();
});
graphManager.addChart(AmCharts.makeChart("dcChartDaylyPower",
        {
            utilExt: {
                getBalloonTextFn: function (graphName, chart, field) {
                    var text = chart.utilExt[field];
                    var graphIdx = text.indexOf('graphName');
                    if (graphIdx === -1) {
                        return text;
                    }
                    var res = text.replace(/graphName/g, graphName);
                    return  res;
                },

                balloonTextSimple_powerGroup: "Avrg power: [[value]] kW",
                balloonTextExtended_powerGroup: "<\/br>Daily energy:  [[graphName_dailyEnergyWh]] kWh",
                balloonTextExtendedMore_powerGroup: "<\/br>Total energy:  [[graphName_energyWh]] kWh",

                balloonTextSimple_power: "Daily energy: [[graphName_dailyEnergyWh]] kWh",
                balloonTextExtended_power: "<\/br>Total energy:  [[graphName_energyWh]] kWh",
                balloonTextExtendedMore_power: ""
            },
            "angle": 30,
            "depth3D": 47,
            "startDuration": 1,

            type: "serial",
            "color": "#555555",
            "categoryField": "date",
            "accessibleTitle": "energyChart",
            "path": "/resources/amCharts",
            "libs": {"path": "/resources/amCharts/plugins/export"},
            "pathToImages": "/resources/amCharts/images/",
            "responsive": {
                "enabled": true,
                "rules": [
                    // at 400px wide, we hide legend
                    {
                        "maxWidth": 600,
                        "overrides": {
//                            "marginTop": 0,
                            "legend": {
                                align: 'center',
                                "labelText": "",
                                "valueText": "",
                                "fontSize": 10
                            },
                            "titles": [
                                {
                                    "size": 12
                                }
                            ],
                            "valueAxes": {
                                "inside": true,
                                "dashLength": 10,
                                "fontSize": 7,
                                "tickLength": 3,
                                "titleFontSize": 8,
                                "gridAlpha": 0
                            },
                            "categoryAxis": {
                                "gridAlpha": 0
                            }
                        }
                    },
                    {
                        "maxWidth": 200,
                        "overrides": {
                            "valueAxes": {
                                "labelsEnabled": false
                            }
                        }
                    }
                ]
            },
            "dataDateFormat": "YYYY-MM-DD",
//            "startDuration": 1,

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
            graphs: [],
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
                "valueWidth": null,
                "equalWidths": false,
                "autoMargins": false,
                "horizontalGap": 2,
                "marginBottom": 85,
                "marginLeft": 10,
                "marginRight": 10,
                "verticalGap": 5,
                "spacing": 33,
                "markerBorderThickness": 2
            },
            "titles": [
                {
                    "id": "Title-1",
                    "size": 12,
                    "text": "",
                    hidden: true
                }
            ],
            "dataProvider": dc.powerData,
            "export": {
                "enabled": true
            }
        }
), 'dateGraph');
