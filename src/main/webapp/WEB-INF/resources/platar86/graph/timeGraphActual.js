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

/* global moment, PF, AmCharts */

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
            "legendPeriodValueText": "--",
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
//            obj.valueUnit = 'kW';
            obj.balloonTextSimple = "[[title]]: [[value]] kW";
            obj.balloonText = "[[title]]: [[value]] kW <\/br>Daily energy:  [[" + graphName + "_dailyEnergy]] kWh";
            obj.balloonTextExtended = "<\/br>Daily energy:  [[" + graphName + "_dailyEnergy]] kWh";
            obj.balloonTextExtendedMore = "<\/br>Total energy:  [[" + graphName + "_energy]] kWh";
        } else if (type === 'storage') {
//            obj.valueUnit = '%';
            obj.valueAxis = 'ValueAxis-Capacity';
            obj.balloonTextSimple = "[[title]]: [[value]]% ([[" + graphName + "_capEnergy]] kWh)";
            obj.balloonText = "[[title]]: [[value]]% ([[" + graphName + "_capEnergy]] kWh)</br>Voltage:  [[" + graphName + "_voltage]]V</br>Current:  [[" + graphName + "_current]]A";
            obj.balloonTextExtended = "</br>Voltage:  [[" + graphName + "_voltage]]V</br>Current:  [[" + graphName + "_current]]A";
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
        timeChart.validateNow();
    },
    getGraphByName: function (name) {
        for (var i = 0; i < tcCtrl.graphArr.length; i++) {
            if (tcCtrl.graphArr[i].name === name) {
                return tcCtrl.graphArr[i].data;
            }
        }
    },
    graphReOrder: function () {
//        console.log(t);
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

var dChart = AmCharts.makeChart("demoChart", {
    "type": "serial",
    "categoryField": "date",
    "dataDateFormat": "YYYY-MM",
    "zoomOutOnDataUpdate": false,
    "theme": "default",
    "categoryAxis": {
        "minPeriod": "MM",
        "parseDates": true,
        "gridThickness": 0,
        "labelsEnabled": false
    },
    "chartCursor": {
        "enabled": true,
        "categoryBalloonDateFormat": "MMM YYYY",
        "categoryBalloonEnabled": false
    },
    "trendLines": [],
    "graphs": [
        {
            "id": "AmGraph-1",
            "title": "graph 1",
            "valueField": "column-1"
        }
    ],
    "guides": [],
    "valueAxes": [
        {
            "id": "ValueAxis-1",
            "gridCount": 0,
            "gridThickness": 0,
            "labelsEnabled": false,
            "title": ""
        }
    ],
    "allLabels": [],
    "balloon": {},
    "titles": [],
    "dataProvider": [
        {
            "date": "2014-01",
            "column-1": 2
        },
        {
            "date": "2014-02",
            "column-1": 12
        },
        {
            "date": "2014-03",
            "column-1": 6
        },
        {
            "date": "2014-04",
            "column-1": 1
        },
        {
            "date": "2014-05",
            "column-1": 3
        },
        {
            "date": "2014-06",
            "column-1": 9
        },
        {
            "date": "2014-07",
            "column-1": 6
        }
    ]
}
);

$(document).ready(function () {
    initTimeGraph();
 });
