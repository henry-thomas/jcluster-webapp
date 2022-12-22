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

function addColorpickerCallback(widgetVar, fieldName) {
    var wg = PF(widgetVar);
    wg.fieldName = fieldName;
    wg.overlay.data().colorpicker.onChange = function (hsb, hex, rgb) {
        wg.value = '#' + hex;
        wg.livePreview.css('backgroundColor', '#' + hex);
    };
    wg.overlay.data().colorpicker.onHide = function (hsb, hex, rgb) {
        tcCtrl.fireGraphSettingsChange(wg.fieldName, wg.value);
    };
}
;

function compareChartGraphByPostition(a, b) {
    if (a.position < b.position)
        return -1;
    if (a.position > b.position)
        return 1;
    return 0;
}

/**
 * Getting the margin of error, amount of time that will determine how close is a new point to the already stored points on the buffer
 * @param {type} buffer
 * @param {type} dateField
 * @returns {Number}
 */
function getMinIntervalInBuffer(buffer, dateField) {
    if (buffer.length < 2)
        return 0;

    if (dateField === undefined) {
        dateField = "date";
    }

    let minInterval = 700000;

    for (var i = 0; i < buffer.length - 1; i++) {
        let nextData = new Date(buffer[i + 1][dateField]).getTime();
        let thisData = new Date(buffer[i][dateField]).getTime();
        let tempInterval = nextData > thisData ? nextData - thisData : thisData - nextData;
        if (tempInterval < minInterval)
            minInterval = tempInterval;
    }

    return minInterval - 1;
}
var pfUtil = {
    printErrpr: function (widgetVar) {
        console.log('can not find widget var: ' + widgetVar);
    },
    setInputSwitch: function (state, widgetVar) {
        var wg = PF(widgetVar);
        if (wg !== undefined) {
            if (state !== pfUtil.getInputSwitch(widgetVar)) {
                wg.toggle();
            }
        } else {
            pfUtil.printErrpr(widgetVar);
        }
    },
    getInputSwitch: function (widgetVar) {
        var wg = PF(widgetVar);
        if (wg !== undefined) {
            return wg.input.prop('checked');
        } else {
            pfUtil.printErrpr(widgetVar);
        }
    },

    setSelectOneMenu: function (value, widgetVar) {
        var widget = PF(widgetVar);
        if (widget !== undefined) {
            PF(widgetVar).selectValue(value);
        } else {
            pfUtil.printErrpr(widgetVar);
        }
    },
    setHtmlCompValue: function (idSelector, value) {
        var a = $('[id*=' + idSelector + ']')[0];
        if (a !== undefined && value !== undefined) {
            a.innerHTML = value;
        }
    },
    getSelectOneMenu: function (widgetVar) {
        var widget = PF(widgetVar);
        if (widget !== undefined) {
            return  PF(widgetVar).getSelectedValue();
        } else {
            pfUtil.printErrpr(widgetVar);
        }
    }

};


var tcCtrl = {

    graphArr: [],
    graphArrPlain: [],
    initGraph: function (grArr) {
        addColorpickerCallback('graphSetting_fillColors', 'fillColors');
        addColorpickerCallback('graphSetting_lineColor', 'lineColor');
        if (grArr !== undefined) {
            for (var i = 0; i < grArr.length; i++) {
                var graphName = grArr[i].name;
                var graphType = grArr[i].type;
                if (grArr[i].data === undefined) {
                    var newData = tcCtrl.generateNewGraph(graphName, graphType);
                    grArr[i].data = newData;
                } else {
                    grArr[i].data = JSON.parse(grArr[i].data);
                }

                tcCtrl.graphArr.push(grArr[i]);
                tcCtrl.graphArrPlain.push(Object.assign({}, grArr[i].data));
                console.log('init timeGraph: ' + graphName);
            }
        }
        tcCtrl.updateTimeChartSettings();
    },
    generateNewGraph: function (graphName, type) {
        var obj = {
            "showBalloon": true,
            "graphType": 0,
            "hidden": false,
            "lineThickness": 1,
            "lineColor": "#AAFFAA",
            "showBalloonExtend": true,
            "fillColors": "#AAFFAE",
            "type": "smoothedLine",
            "valueField": graphName,
            "title": graphName,
            "lineAlpha": 0,
            "id": graphName,
            "position": 0,
            "fillAlphas": 50
        };
        if (type === 'power') {
            obj.balloonTextSimple = "[[title]]: [[value]] kW";
            obj.balloonText = "[[title]]: [[value]] kW <\/br>Daily energy:  [[" + graphName + "_dailyEnergy]] kWh";
            obj.balloonTextExtended = "<\/br>Daily energy:  [[" + graphName + "_dailyEnergy]] kWh";
            obj.balloonTextExtendedMore = "<\/br>Total energy:  [[" + graphName + "_energy]] kWh";
        } else if (type === 'storage') {
            obj.valueAxis = 'ValueAxis-Capacity';
            obj.balloonTextSimple = "[[title]]: [[value]]% ([[" + graphName + "_capEnergy]] kWh)";
            obj.balloonTextExtended = "</br>Voltage:  [[" + graphName + "_voltage]]V</br>Current:  [[" + graphName + "_currentA]]A";
            obj.balloonTextExtendedMore = "</br>Capacity:  [[" + graphName + "_capacityAH]]Ah";
        }
        return obj;
    },
    updateGraphToServer: function () {
        var arr = [];
        for (var i = 0; i < tcCtrl.graphArr.length; i++) {
            arr.push(tcCtrl.graphArr[i].data);
        }
        if (arr.length > 0) {
            tcUpdateGraphRC([{
                    name: "arr",
                    value: JSON.stringify(arr)
                }]);
        }
        ;
        PF('tcGraphConfigDialog').hide();
        tcCtrl.updateTimeChartSettings();
    },
    updateTimeChartSettings: function () {
        for (var i = 0; i < tcCtrl.graphArr.length; i++) {
            for (var n = 0; n < tcCtrl.graphArrPlain.length; n++) {
                if (tcCtrl.graphArr[i].name === tcCtrl.graphArrPlain[n].id) {
                    for (var item in tcCtrl.graphArr[i].data) {
                        var value = tcCtrl.graphArr[i].data[item];
                        tcCtrl.graphArrPlain[n][item] = value;
                    }
                }
            }
            tcCtrl.fireGraphSettingsBaloonChange(tcCtrl.graphArr[i]);
        }
        tcCtrl.graphArrPlain.sort(compareChartGraphByPostition);
    },
    getGraphByName: function (name) {
        for (var i = 0; i < tcCtrl.graphArr.length; i++) {
            if (tcCtrl.graphArr[i].name === name) {
                return tcCtrl.graphArr[i].data;
            }
        }
    },
    graphReOrder: function () {
        var itemArr = PF('graphSettingsList').input[0].children;
        for (var i = 0; i < itemArr.length; i++) {
            var name = itemArr[i].innerText;
            tcCtrl.getGraphByName(name).position = i;
        }
        tcCtrl.displaySettingsContent(false);
        tcCtrl.initGraphComplete = false;
    },
    getSelectedGraph: function () {
        var items = PF('graphSettingsList').items;
        var selection;
        for (var i = 0; i < items.length; i++) {
            var a = items[i];
            for (var n = 0; n < a.classList.length; n++) {
                if (a.classList[n] === 'ui-state-highlight') {
                    selection = a.textContent;
                }
            }
            ;
        }
        return selection;
    },
    graphSelectionChange: function () {
        tcCtrl.selectedGraphIdx = tcCtrl.getSelectedGraph();
        tcCtrl.updateSelection();
        if (!tcCtrl.initGraphComplete) {
            tcCtrl.initGraphComplete = true;
            tcCtrl.displaySettingsContent(true);
        }
    },
    displaySettingsContent: function (state) {
        if (state) {
            $('.tgEmptyMessage').hide(0);
            $('.tgContent').show(0);
        } else {
            $('.tgEmptyMessage').show(0);
            $('.tgContent').hide(0);
        }
    },
    showDialog: function () {
        PF('tcGraphConfigDialog').show();
        if (tcCtrl.selectedGraphIdx !== undefined) {
            tcCtrl.displaySettingsContent(true);
        } else {
            tcCtrl.displaySettingsContent(false);
        }
    },
    fireGraphSettingsChange: function (name, val) {
        // console.log("change: " + name + " value: " + val);
        if (tcCtrl.selectedGraphIdx !== undefined) {
            var g = tcCtrl.getGraphByName(tcCtrl.selectedGraphIdx);
            g[name] = val;
            if (name === 'showBalloon' || name === 'showBalloonExtend' || name === 'showBalloonExtendMore') {
                tcCtrl.fireGraphSettingsBaloonChange(g);
            }
        }
        dChart.graphs[0][name] = val;
        dChart.validateNow();
    },
    fireGraphSettingsBaloonChange: function (gr) {
        gr.balloonText = gr.balloonTextSimple;
        if (gr.showBalloonExtend) {
            gr.balloonText += gr.balloonTextExtended;
        }
        if (gr.showBalloonExtendMore) {
            gr.balloonText += gr.balloonTextExtendedMore;
        }
        dChart.graphs[0]['balloonText'] = gr.balloonText;
    },
    updateSelection: function (name) {
        var g = tcCtrl.getGraphByName(tcCtrl.selectedGraphIdx);


        PF('graphSetting_lineColor').livePreview.css('backgroundColor', g.lineColor);
        PF('graphSetting_fillColors').livePreview.css('backgroundColor', g.fillColors);
        pfUtil.setInputSwitch(!g.hidden, "graphSetting_hidden");
        PF('graphTitleWg').jq.val(g.title);
        pfUtil.setSelectOneMenu(g.type, 'graphSetting_type');
        pfUtil.setInputSwitch(g.showBalloon, "graphSetting_showBalloon");
        pfUtil.setInputSwitch(g.showBalloonExtend, "graphSetting_showBalloonExtend");
        pfUtil.setInputSwitch(g.showBalloonExtendMore, "graphSetting_showBalloonExtendMore");
        PF('graphSetting_fillAlphas').setValue(g.fillAlphas);
        PF('graphSetting_lineAlpha').setValue(g.lineAlpha);
        PF('graphSetting_lineThickness').setValue(g.lineThickness);

        for (var item in g) {
            if (item !== 'valueField' && item !== 'id') {
                dChart.graphs[0][item] = g[item];
            }
        }
        dChart.validateNow();
    }

};

function getDateFromDateTime(d) {
    convDate = moment(d)._d;
    if (convDate instanceof Date) {
        return moment(convDate).startOf("day")._d;
    }
    return null;
}

var tc = {
    dataBuf: {},
    powerData: [], // data for the chartttt
    buffPowerData: {},

    powerGraph: [],
    loadedDaysPowerMap: [],
    loadedDaysPowerArrKeys: [],
    powerDataBuff: [],
    dataBuffTest: {},
    endDay: new Date(),
    endDays: {}, // Dates that will be used for comparison purposes
    lastComparator: 0,
    historyDays: 1,

    /**
     * 
     * @param {type} minPeriod
     * @param {type} dateField
     * @param {type} obj (point)
     * @param {type} buff
     * @returns The position in the buffer the new object should occupy
     */
    getPositionInBuffer: function (minPeriod, dateField, obj, buff) {
        if (!buff)
            buff = [];

        // Setting the object date that will be positioned to the proper value
        obj.date = obj[dateField];

        // There is no object stored previously in the buffer
        if (!buff.length) {
            buff.push({
                date: obj.date
            });
            return buff[0];
        }

        // The object date is lower than the lowest one stored in the buffer
        if (buff[0].date.getTime() > obj.date.getTime()) {
            // The object date value is close to the lowest one stored in the buffer
            if (buff[0].date.getTime() - minPeriod < obj.date.getTime()) {
                return buff[0];
            }
            // The object date value is no close at all to the lowest one stored in the buffer
            buff.unshift({
                date: obj.date
            });
            return buff[0];
        }

        // The object date is bigger than the highest one stored in the buffer
        if (buff[buff.length - 1].date.getTime() < obj.date.getTime()) {
            // The object date value is close to the biggest one stored in the buffer
            if (buff[buff.length - 1].date.getTime() + minPeriod > obj.date.getTime()) {
                return buff[buff.length - 1];
            }
            // The object date value is no close at all to the biggest one stored in the buffer
            buff.push({
                date: obj.date
            });
            return buff[buff.length - 1];
        }

        // The object date value is in the middle of the already stored objects in the buffer
        for (var i = buff.length - 1; i >= 0; i--) {
            var curObj = buff[i];
            if (curObj.date.getTime() < obj.date.getTime()) {
                // The object is close from the right side to the current selected object from the buffer
                if (curObj.date.getTime() + minPeriod > obj.date.getTime()) {
                    // The object is also close from the left side to the oncoming selected object from the buffer
                    if (buff[i + 1] !== undefined && buff[i + 1].date.getTime() - minPeriod < obj.date.getTime()) {
                        var leftDistance = obj.date.getTime() - curObj.date.getTime();
                        var rightDistance = buff[i + 1].date.getTime() - obj.date.getTime();
                        // The object is closer to the right side thatn the left side
                        if (rightDistance < leftDistance)
                            return buff[i + 1];
                    }
                    return curObj;
                }
                // The object is close from the left side to the oncoming selected object from the buffer
                if (buff[i + 1] !== undefined && buff[i + 1].date.getTime() - minPeriod < obj.date.getTime()) {
                    return buff[i + 1];
                }

                // The object has a new position inside the buffer
                var newData = {};
                for (var item in buff[i]) {
                    newData[item] = buff[i][item];
                }
                newData.date = obj.date;
                buff.splice(i + 1, 0, newData);
                return buff[i + 1];
            }

            // The object position was defined previously in the buffer
            if (curObj.date.getTime() === obj.date.getTime()) {
                return curObj;
            }
        }

    },
    /**
     * Calculating the Power data of the Power types and the Group Power Types as well
     * @returns {undefined}
     */
    reloadDataFromBufer: function () {
        tc.updateChartGroups();
        tc.getChart().dataProvider = {};
        tc.getChart().validateData();
        graphManager.updateChartGraphs('timeGraph');

        // Data for chart
        tc.powerData = [];

        // =================== FOR SIMPLE POWER TYPES ======================
        // Calculating the Power Data of the Different Power Types
        // Ex. Battery Discharging, Battery Charging, grid, pv, PV_MPPT, load, etc
        // =================================================================
        for (var j = tc.historyDays - 1; j >= 0; j--) {
            var reqDate = moment(tc.endDay).subtract(j, 'days').format('YYYY-MM-DD');
            if (tc.dataBuf[reqDate] !== undefined) {
                for (var item in tc.dataBuf[reqDate]) {
                    var data = tc.dataBuf[reqDate][item];
                    if (data.type === 'storage') {
                        tc.insertStorageDataToBuff(data);
                    } else if (data.type === 'power') {
                        tc.insertPowerDataToBuff(data);
                    }
                }
            }
        }

        // =================== FOR SIMPLE COMPARED POWER TYPES ======================
        // Calculating the Power Data of the Different Power Types that will be compared
        // Ex. Battery Discharging, Battery Charging, grid, pv, PV_MPPT, load, etc
        // =================================================================
        for (let comparedEndDay in tc.endDays) {
            for (let j = tc.historyDays - 1; j >= 0; j--) {
                let reqDate = moment(tc.endDays[comparedEndDay]).subtract(j, 'days').format('YYYY-MM-DD');
                let currentDate = moment(tc.endDay).subtract(j, 'days').format('YYYY-MM-DD');
                let referenceDay = null;
                if (reqDate !== currentDate) {
                    referenceDay = clone(tc.endDay);
                    referenceDay.setDate(referenceDay.getDate() - j);
                }
                if (!tc.dataBuf[reqDate])
                    continue;

                for (var item in tc.dataBuf[reqDate]) {
                    let data = clone(tc.dataBuf[reqDate][item]);
                    data.name = data.name + '-' + comparedEndDay;
                    data.date = currentDate;
                    if (data.type === 'storage') {
                        tc.insertStorageDataToBuff(data, referenceDay);
                    } else if (data.type === 'power') {
                        tc.insertPowerDataToBuff(data, referenceDay);
                    }
                    delete data;
                }
                if (reqDate !== currentDate)
                    delete referenceDay;
            }
        }

        // ======================= FOR GROUPS ==============================
        // Calculating the Power Data of the Different Group Power Types
        // Ex. TOTAL_PV {pv + PV_MPPT}, Exported_Power = { TOTAL_PV - load}
        // =================================================================
        if (mainUtils.getSelectOneMenu('tcGroupViewWidget') !== 'powersOnly') {

            var grArr = graphManager.graphArr.timeGraph;
            for (var item in grArr) {
                if (grArr[item].graphType === 'powerGroup') {
                    var groupName = grArr[item].graphName;
                    for (var i = 0; i < tc.powerData.length; i++) {
                        let loc = tc.powerData[i];
                        let formula = JSON.parse(grArr[item].formula);

                        // For not adding unnecesary locations to the chart
                        if (tc.skipCalculatePower(grArr[item], loc))
                            continue;

                        loc[groupName] = tc.calculatePower('', formula, loc).toFixed(2);
                        loc[groupName + '_energyWh'] = tc.calculatePower('_energyWh', formula, loc).toFixed(2);
                        loc[groupName + '_monthlyEnergyWh'] = tc.calculatePower('_monthlyEnergyWh', formula, loc).toFixed(2);
                        loc[groupName + '_yearlyEnergyWh'] = tc.calculatePower('_yearlyEnergyWh', formula, loc).toFixed(2);
                        loc[groupName + '_weeklyEnergyWh'] = tc.calculatePower('_weeklyEnergyWh', formula, loc).toFixed(2);
                        loc[groupName + '_dailyEnergyWh'] = tc.calculatePower('_dailyEnergyWh', formula, loc).toFixed(2);
                    }
                }
            }
        }

        tc.getChart().dataProvider = tc.powerData;

        // Set no data label
        if (tc.powerData.length !== 0) {
            tc.setNoDataLabel(tc.powerData.length === 0);
        }
        tc.getChart().validateData();

    },
    /**
     * The Power Calculator won't be displayed if don't have available the required powers for calculating it 
     * @param {type} graph
     * @param {type} locPower
     * @returns {Number}
     */
    skipCalculatePower: function (graph, locPower) {
        if (!graph || !graph.powerList || !locPower)
            return 1;

        for (let i in graph.powerList) {
            if (locPower[graph.powerList[i]] === undefined)
                return 1;
        }
        return 0;
    },
    /**
     * Calculating the Total Power using the formula for the selected group
     * @param {type} sufix
     * @param {type} f
     * @param {type} data
     * @returns {Number}
     */
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
        switch (f.op) {
            case '+':
                return tc.calculatePower(sufix, f.p1, data) + tc.calculatePower(sufix, f.p2, data);
            case '-':
                return tc.calculatePower(sufix, f.p1, data) - tc.calculatePower(sufix, f.p2, data);
            case '*':
                return tc.calculatePower(sufix, f.p1, data) * tc.calculatePower(sufix, f.p2, data);
            case '/':
                let divisor = tc.calculatePower(sufix, f.p2, data);
                if (divisor === 0) {
                    return tc.calculatePower(sufix, f.p1, data);
                }
                return tc.calculatePower(sufix, f.p1, data) / divisor;
        }
    },
    getChart: function () {
        return graphManager.chartArr.timeGraph;
    },
    insertPowerDataToBuff: function (d, currentDate) {
        var minPeriod = getMinIntervalInBuffer(d.data, 'lastUpdate');
        for (var i = d.data.length - 1; i >= 0; i--) {
            let obj = currentDate && currentDate !== d.data[i].lastUpdate ? clone(d.data[i]) : d.data[i];

            if (currentDate) {
                obj.lastUpdate.setFullYear(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            }

            var loc = tc.getPositionInBuffer(minPeriod, 'lastUpdate', obj, tc.powerData);

            loc[d.name] = ((obj.powerW || 0.01) / 1000).toFixed(2);
            loc[d.name + '_energyWh'] = (obj.energyWh / 1000).toFixed(2);
            loc[d.name + '_monthlyEnergyWh'] = ((obj.monthlyEnergyWh || 0.01) / 1000).toFixed(2);
            loc[d.name + '_yearlyEnergyWh'] = ((obj.yearlyEnergyWh || 0.01) / 1000).toFixed(2);
            loc[d.name + '_weeklyEnergyWh'] = ((obj.weeklyEnergyWh || 0.01) / 1000).toFixed(2);
            loc[d.name + '_dailyEnergyWh'] = ((obj.dailyEnergyWh || 0.01) / 1000).toFixed(2);

            if (currentDate)
                delete obj;
        }

    },
    insertStorageDataToBuff: function (d, currentDate) {

        var minPeriod = getMinIntervalInBuffer(d.data, 'lastUpdate');
        for (var i = d.data.length - 1; i >= 0; i--) {
            var obj = currentDate && currentDate !== d.data[i].lastUpdate ? clone(d.data[i]) : d.data[i];
            obj.date = obj.lastUpdate;

            if (currentDate) {
                obj.lastUpdate.setFullYear(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
                obj.date = obj.lastUpdate;
            }

            var loc = tc.getPositionInBuffer(minPeriod, 'lastUpdate', obj, tc.powerData);
            
            loc[d.name] = obj.capacityP.toFixed(2);
            loc[d.name + '_capacitykWh'] = ((obj.capacityAh * obj.voltageV) / 1000).toFixed(2);
            loc[d.name + '_currentA'] = obj.currentA.toFixed(2);
            loc[d.name + '_voltageV'] = obj.voltageV.toFixed(3);
            loc[d.name + '_capacityP'] = obj.capacityP.toFixed(2);
            loc[d.name + '_capacityAh'] = obj.capacityAh.toFixed(2);

            if (currentDate)
                delete obj;
        }
    },
    addData: function (d) {
        if (d !== undefined && d.length !== undefined) {
            for (var i = 0; i < d.length; i++) {
                for (var j = 0; j < d[i].data.length; j++) {
                    if (d[i].data[j].lastUpdate !== undefined) {
                        d[i].data[j].lastUpdate = moment(d[i].data[j].lastUpdate, 'ddd MMM DD HH:mm:ss ZZ YYYY')._d;
                    } else if (d[i].data[j].date !== undefined) {
                        d[i].data[j].date = moment(d[i].data[j].date, 'ddd MMM DD HH:mm:ss ZZ YYYY')._d;
                    }
                }
                if (tc.dataBuf[d[i].date] === undefined) {
                    tc.dataBuf[d[i].date] = {};
                }
                tc.dataBuf[d[i].date][d[i].name] = d[i];
            }
        }
        tc.reloadDataFromBufer();
        console.log('download data from server');
    },

    groupViewChange: function () {
        tc.reloadDataFromBufer();
    },
    updateChartGroups: function () {
        if (graphManager.isPowerGroupsExist('timeGraph', 'graphType', 'powerGroup')) {
            $('.groupsSelectOneMenu').show();
        } else {
            $('.groupsSelectOneMenu').hide();
        }

        var grouping = mainUtils.getSelectOneMenu('tcGroupViewWidget');
        tc.getChart().graphSkipList = {};
        switch (grouping) {
            case "groupsOnly":
                {
                    var grArr = graphManager.graphArr.timeGraph;
                    for (var item in grArr) {
                        if (grArr[item].graphType === 'powerGroup') {
                            var pList = grArr[item].powerList;
                            if (pList !== undefined) {
                                for (var item in pList) {
                                    tc.getChart().graphSkipList[pList[item]] = true;
                                }
                            }
                        }
                    }
                    tc.updateSkipList();
                }
                break;
            case "powersOnly":
                {
                    var grArr = graphManager.graphArr.timeGraph;
                    for (var item in grArr) {
                        if (grArr[item].graphType === 'powerGroup') {
                            tc.getChart().graphSkipList[grArr[item].graphName] = true;
                        }
                    }
                }
                break;
        }
    },
    /**
     * Updating the list of powers that should be displayed among it Power Calculators (Groups)
     * @returns {undefined}     */
    updateSkipList: function () {
        let grArr = graphManager.graphArr.timeGraph;

        if (!grArr)
            return;

        if (!tc.getChart().graphSkipList)
            return;

        let skipList = Object.keys(tc.getChart().graphSkipList);
        if (!skipList || skipList === 0)
            return;

        // Retrieving the group charts that should be displayed among its powers 
        let groups = Object.values(graphManager.graphArr.timeGraph).filter(function (e) {
            return e.displayWithGroups;
        });
        if (!groups || groups.length === 0)
            return;

        for (var group in groups) {
            if (!groups[group] || !groups[group].powerList)
                continue;

            // Removing the required powers from the skiping list
            let powers = groups[group].powerList;
            for (var power in powers) {
                delete tc.getChart().graphSkipList[powers[power]];
            }
        }
    },
    endDayChange: function () {
        let selected = window.event.currentTarget;

        if (!selected)
            return;
        
        let selectedDate = selected.valueAsDate;
        
        if (!selectedDate || moment(selectedDate).format('YYYY-MM-DD') > moment(new Date()).format('YYYY-MM-DD'))
            return;
        
        if (selected.id === 'tcGraphCalendar') {
            tc.endDay = selectedDate;
            tc.hDaysChange();
            return;
        }

        let id = selected.id.substring(selected.id.lastIndexOf("-") + 1);
        tc.endDays[id] = selectedDate;
        // Updading Date and and Title of comparator
        let idComparator = Number(id);
        
        graphManager.updateDays('timeGraph', idComparator, selectedDate);
        
        let comparatorGraphs =  Object.values(graphManager.graphArr['timeGraph']).filter(function(ele) { return ele.comparatorID === idComparator;});
        
        for (let item in comparatorGraphs) {
            let comparatorName = comparatorGraphs[item].graph.id;
            comparatorName = comparatorName.substring(0, comparatorName.lastIndexOf('-'));
            
            let graphs =  Object.values(graphManager.graphArr['timeGraph']).filter(function(ele) { return !ele.comparatorID && ele.graph.id === comparatorName;});
            comparatorGraphs[item].graph.title = graphManager.createTitle('timeGraph', idComparator, graphs[0].graph.title);
        }
        
        graphManager.saveGraphComparator('timeGraph', idComparator);
        graphManager.updateChartGraphs('timeGraph', 0);
        tc.hDaysChange();
    },
    hDaysChange: function () {
        tc.historyDays = mainUtils.getInputCompValue('tcHistoryDays');
        tc.dayPeriodChange();
    },
    setNoDataLabel: function (show) {
        if (show) {
            tc.getChart().allLabels[0].text = "No data for the selected period.";
        } else {
            tc.getChart().allLabels[0].text = "";
        }
    },
    dayPeriodChange: function () {
        var dateToLoad = [];
        for (var j = 0; j < tc.historyDays; j++) {
            var reqDate = moment(tc.endDay).subtract(j, 'days').format('YYYY-MM-DD');
            if (tc.dataBuf[reqDate] === undefined) {
                dateToLoad.push(reqDate);
            }

            // Adding choosen dates on the Time Chart Calendar Comparator Controls
            for (var endDayComparator in tc.endDays) {
                var reqDate = moment(tc.endDays[endDayComparator]).subtract(j, 'days').format('YYYY-MM-DD');
                if (tc.dataBuf[reqDate] === undefined) {
                    dateToLoad.push(reqDate);
                }
            }
        }

        if (dateToLoad.length !== 0) {
            timeGraphLoadNewData([{
                    name: "queryDays",
                    value: JSON.stringify(dateToLoad)
                }]);
        } else {
            tc.reloadDataFromBufer();
        }
        tc.updateChartTitles();
    },
    updateChartTitles: function () {
        tc.updateChartTitle("", tc.endDay);

        for (var item in tc.endDays) {
            tc.updateChartTitle(item, tc.endDays[item]);
        }
    },
    updateChartTitle: function (id, endDay) {
        id = id ? '-' + id : id;
        let endDate = moment(endDay).format('YYYY-MM-DD');
        if (Number(tc.historyDays) === 1) {
            document.getElementById('tcGraphTitle' + id).innerText = 'Time chart (' + endDate + ')';
            return;
        }

        let beginDate = moment(endDay).subtract(tc.historyDays, 'days').format('YYYY-MM-DD');
        document.getElementById('tcGraphTitle' + id).textContent = 'Time chart (from: ' + beginDate + ' to: ' + endDate + ')';

        tc.getChart().validateNow();
    },
    initDate: function () {
        tc.historyDays = PF('tcHystoryDaysSlider').getValue();
        tc.endDay = document.getElementById('tcGraphCalendar').valueAsDate;
        tc.populateComparators();
        tc.dayPeriodChange();
    },
    populateComparators: function () {
        let container = document.querySelector('#comparatorContainer');
        if (!container)
            return;
        
        // Getting available Comparators
        let graphs = Object.values(graphManager.graphArr['timeGraph']).filter(function (ele) {return ele.comparatorID;});

        for (let item in graphs) {
            if (graphs[item].comparatorID === tc.lastComparator)
                continue;
            
            // Creating a DataPicker per each Comparator
            tc.lastComparator = graphs[item].comparatorID; 
            tc.populateDatePicker(container, tc.lastComparator, graphManager.getComparedDate(graphs[item].chartName, tc.lastComparator));
        }
    },
    /**
     * Creating a Comparator with the provided id and date
     * @param {type} parent
     * @param {type} id
     * @param {type} comparedDate
     * @returns {undefined}     */
    populateDatePicker: function (parent, id, comparedDate) {
        let comparatorID = id ? '-' + id : '';
        let container = document.createElement('div');
        parent.appendChild(container);
        container.id = 'comparatorComponent' + comparatorID;
        container.classList.add('comparatorComponent');

        // Date Picker Title (Range of selected dates)
        let title = document.createElement('span');
        container.appendChild(title);
        title.id = 'tcGraphTitle' + comparatorID;
        title.innerText = '';
        title.classList.add('comparatorLabel');

        // Date Picker
        let calendarContainer = document.createElement('div');
        container.appendChild(calendarContainer);
        container.classList.add('calendarContainer');

        let calendarButton = document.createElement('span');
        calendarContainer.appendChild(calendarButton);
        calendarButton.classList.add('comparatorIcon');
        calendarButton.classList.add('fa');
        calendarButton.classList.add('fa-calendar');

        let date = new Date();

        // Setting the current date
        date.setDate(date.getDate());

        let datePicker = document.createElement('input');
        datePicker.id = 'tcGraphCalendar' + comparatorID;
        datePicker.setAttribute('type', 'date');
        datePicker.setAttribute('max', moment(date).format('YYYY-MM-DD'));
        datePicker.classList.add('comparatorDataPicker');
        datePicker.valueAsDate = date;
        datePicker.addEventListener('change', tc.endDayChange);
        calendarContainer.appendChild(datePicker);

        if (!id)
            return;

        date = new Date();
        date.setDate(date.getDate() - (Number(id) * 7));
        
        // Setting the retrieved date from the database
        if (comparedDate)
            date = moment(comparedDate, 'YYYY-MM-DD').toDate();
        
        datePicker.valueAsDate = date;

        // Button that will be used for adding new Graph Comparators or deleting previously added ones
        let actionButton = document.createElement('span');
        calendarContainer.appendChild(actionButton);
        actionButton.classList.add('comparatorIcon');
        actionButton.classList.add('fa');
        if (id === 1) {
            actionButton.classList.add('fa-area-chart');
            actionButton.addEventListener('click', function () {
                tc.lastComparator++;
                tc.populateDatePicker(parent, tc.lastComparator);
                graphManager.addGraphComparator('timeGraph', tc.lastComparator);
                tc.dayPeriodChange();
            });
        } else {
            actionButton.classList.add('fa-trash');
            actionButton.addEventListener('click', function () {
                let selected = window.event.currentTarget.parentNode.parentNode;
                if (!selected)
                    return;
                let id = selected.id.substring(selected.id.lastIndexOf('-') + 1);
                if (!id)
                    return;
                
                if (tc.lastComparator === Number(id))
                    tc.lastComparator--;
                
                selected.parentNode.removeChild(selected);
                graphManager.removeGraphComparator('timeGraph', id);
                delete tc.endDays[id];
                tc.dayPeriodChange();
            });
        }
        tc.endDays[id] = date;
    }
};

graphManager.addChart(AmCharts.makeChart("chartDaylyPower", {
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

        balloonTextSimple_powerGroup: "[[title]]: <b>[[value]] kW</b>",
        balloonTextExtended_powerGroup: "<\/br>Daily energy:  [[graphName_dailyEnergyWh]] kWh",
        balloonTextExtendedMore_powerGroup: "<\/br>Total energy:  [[graphName_energyWh]] kWh",
        balloonTextSimple_power: "[[title]]: <b>[[value]] kW</b>",
        balloonTextExtended_power: "<\/br>Daily energy:  [[graphName_dailyEnergyWh]] kWh",
        balloonTextExtendedMore_power: "<\/br>Total energy:  [[graphName_energyWh]] kWh",

        balloonTextSimple_storage: "Storage: <b>[[value]]%</b>",
        balloonTextExtended_storage: "<\/br>Available: [[graphName_capacitykWh]] kWh",
        balloonTextExtendedMore_storage: "<\/br>Avrg Voltage:  [[graphName_voltageV]] V,<\/br> Avrg Current:  [[graphName_currentA]] A"
    },
    type: "serial",
    "color": "#555555",
    "categoryField": "date",
    "accessibleTitle": "dailyChart",
    "autoMarginOffset": 5,
    "startDuration": 0.3,

    "path": "/resources/amCharts",
    "pathToImages": "/resources/amCharts/images/",
    "libs": {"path": "/resources/amCharts/plugins/export"},
    "responsive": {
        "enabled": true,
        "rules": [
            // at 400px wide, we hide legend
            {
                "maxWidth": 400,
                "overrides": {
                    "marginTop": 0,
                    "legend": {
                        align: 'left',
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
    "dataDateFormat": [
        "YYYY-MM-DD HH:NN:SS",
        "YYYY-MM-DD HH:NN"
    ],

    "categoryAxis": {
        "equalSpacing": false,
        "minPeriod": "ss",
        "parseDates": true
    },
    "chartCursor": {
        "enabled": true,
        "categoryBalloonDateFormat": "YYYY-MM-DD JJ:NN:SS"
    },
    "chartScrollbar": {
        "enabled": true,
        "graph": "pv"
    },
    "trendLines": [],
    graphs: tcCtrl.graphArrPlain,
    "allLabels": [
        {
            "align": "center",
            "id": "Label-1",
            "size": 29,
            "text": "Loading data for selected period...",
            "x": "0%",
            "y": "50%"
        }
    ],
    "valueAxes": [
        {
            "id": "powerAxis",
            "title": "Power in kW"
        },
        {
            "id": "storageAxis",
            "maximum": 100,
            "minimum": 0,
            "position": "right",
            "precision": 0,
            "unit": "%",
            "title": "",
            "titleBold": false,
            "titleColor": "#555555",
            "titleRotation": 0
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
            "id": "topTitle",
            "size": 15,
            "text": "",
            hidden: true
        }
    ],
    "dataProvider": tc.powerData,
    "export": {
        "enabled": true
    }
}), 'timeGraph');


$(document).ready(function () {
    // Populating the Date Picker that will manage the main chosen date
    tc.populateDatePicker(document.getElementById('currentDateContainer'));
    loadPowerChartGraphs();
    let actions = [];
    actions.push(tc.initDate);
    
    graphManager.onInitChartCall['timeGraph'] = actions;
});
