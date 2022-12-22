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
/* global graphName, PF, mainUtils, moment */

function GraphManager(document) {
    this.dialogEmptyChart = null;
    this.docRoot = document;
    this.chartArr = {};
    this.graphArr = {};
    this.dialogGraphArr = [];
    this.comparatorsChartArr = {};
    this.dialogSelectedGraph = null;
    this.dialogSelectedChartArr = null;
    this.dialogSelectedChartName = null;
    this.onInitChartCall = {};
    this.comparatorKey = 'C';

    this.addGraph = function (grArr) {
        console.log(grArr);
        if (grArr !== undefined) {
            var chartToUpdate = {};
            for (var i in grArr) {
                var graph = new AmGraph();
                graph.init(grArr[i]);



                if (grArr[i].formula !== undefined) {
                    graph.formula = grArr[i].formula;
                    graph.powerList = [];
                    if (graph.formula.includes('displayWithGroups')) {
                        graph.displayWithGroups = 1;
                    }
                    ;
                    let formula = JSON.parse(graph.formula);
                    this.calculatePowerList(formula, graph.powerList);

                    this.updateFormulaComparator(graph);
                }
                if (this.graphArr[graph.chartName] === undefined) {
                    this.graphArr[graph.chartName] = {};
                }
                chartToUpdate.chartName = graph.chartName;
                this.graphArr[graph.chartName][graph.graphName] = graph;
            }

            for (var item in chartToUpdate) {
                if (this.chartArr[chartToUpdate[item]] !== undefined) {
                    this.updateChartGraphs(chartToUpdate[item]);

                    let comparators = this.comparatorsChartArr[chartToUpdate[item]];
                    if (comparators && comparators.length === 0) {
                        // Adding the first comparator
                        this.addGraphComparator(chartToUpdate[item], 1);
                    }
                    this.initChart(chartToUpdate[item]);
                }
            }
        }
    };
    this.setComparators = function (chartComparators) {
        if (!chartComparators)
            return;

        let charts = Object.keys(chartComparators);
        for (let i in charts) {
            this.comparatorsChartArr[charts[i]] = chartComparators[charts[i]];
        }
    };
    /**
     * Adding a Graph Comparator to the provided chart 
     * @param {type} chartName
     * @param {type} id
     * @returns {undefined}
     */
    this.addGraphComparator = function (chartName, id) {
        if (!this.graphArr[chartName])
            return;

        // Setting default date comparator
        this.comparatorsChartArr[chartName].push({comparatorID: id, days: id * 7});
        let graphNames = Object.values(this.graphArr[chartName]).filter(function (ele) {
            return !ele.comparatorID;
        }).map(function (ele) {
            return ele.graphName;
        });

        for (let item in graphNames) {
            let graphComparator = this.createGraphComparator(id, this.graphArr[chartName][graphNames[item]]);
            this.graphArr[chartName][graphComparator.graphName] = graphComparator;
        }
        this.updateChartGraphs(chartName, 0);

        this.saveGraphComparator(chartName, id);
    };

    /**
     * Saving the new created Graph Comparator configuration on the database
     * @param {type} chartName
     * @param {type} id
     * @returns {undefined}
     */
    this.saveGraphComparator = function (chartName, id) {
        let chartNameC = chartName + this.comparatorKey;
        let comparatorGraphs = Object.values(this.graphArr[chartName]).filter(function (ele) {
            return ele.comparatorID === id;
        }).map(function (ele) {
            return ele.graph;
        });
        let comparatorsConfig = {chart: chartNameC, comparatorDays: JSON.stringify(this.comparatorsChartArr[chartName]), comparatorGraphs: JSON.stringify(comparatorGraphs)};
        addComparators([{
                name: "comparators",
                value: JSON.stringify(comparatorsConfig)
            }]);
    };

    /**
     * Update the values for the new selected Comparator Range Days
     * @param {type} chartName
     * @returns {undefined}
     */
    this.updateGraphComparators = function (chartName) {
        let chartNameC = chartName + this.comparatorKey;
        let comparatorsConfig = {chart: chartNameC, comparatorDays: JSON.stringify(this.comparatorsChartArr[chartName])};
        updateComparators([{
                name: "comparators",
                value: JSON.stringify(comparatorsConfig)
            }]);
    };

    /**
     * Deleting the selected Comparator in the provided chart
     * @param {type} chartName
     * @param {type} id
     * @returns {undefined}
     */
    this.removeGraphComparator = function (chartName, id) {
        if (!this.graphArr[chartName])
            return;

        id = Number(id);

        this.comparatorsChartArr[chartName] = this.comparatorsChartArr[chartName].filter(function (ele) {
            return ele.comparatorID !== id;
        });

        this.deleteGraphComparator(chartName, id);
        let graphNames = Object.values(this.graphArr[chartName]).filter(function (ele) {
            return !ele.comparatorID;
        }).map(function (ele) {
            return ele.graphName;
        });

        for (let item in graphNames) {
            let graphName = graphNames[item] + '-' + id;
            delete this.graphArr[chartName][graphName];
            this.chartArr[chartName].graphs = this.deleteGraph(this.chartArr[chartName].graphs, graphName);
        }
        this.updateChartGraphs(chartName, 0);
    };
    /**
     * Removing the new created Graph Comparator configuration on the database
     * @param {type} chartName
     * @param {type} id
     * @returns {undefined}
     */
    this.deleteGraphComparator = function (chartName, id) {
        let chartNameC = chartName + this.comparatorKey;
        let graphNames = Object.values(this.graphArr[chartName]).filter(function (ele) {
            return ele.comparatorID === id;
        }).map(function (ele) {
            return ele.graphName;
        });
        let comparatorsConfig = {chart: chartNameC, comparatorIDs: JSON.stringify(this.comparatorsChartArr[chartName]), comparatorGraphNames: graphNames};
        deleteComparators([{
                name: "comparators",
                value: JSON.stringify(comparatorsConfig)
            }]);
    };
    /**
     * Deleting the provided graph from the list of AmCharts
     * @param {type} graphs
     * @param {type} graphName
     * @returns {undefined}
     */
    this.deleteGraph = function (graphs, graphName) {
        if (!graphs || !graphName)
            return;

        let result = graphs.filter(function (ele) {
            return ele && ele.valueField !== graphName;
        });

        return result;
    };

    /**
     * Creating title for the provided Chart and Comparator
     * @param {type} chartName
     * @param {type} id ComparatorID 
     * @param {type} title
     * @returns {String}
     */
    this.createTitle = function (chartName, id, title) {
        if (!chartName || !id || !title || !this.comparatorsChartArr[chartName])
            return title;

        let date = this.getComparedDate(chartName, id);
        return title + '-' + moment(date).format('YYYY-MM-DD');
    };
    this.getComparedDate = function (chartName, id) {
        let date = new Date();
        if (!chartName || !id)
            return date;

        let days = this.comparatorsChartArr[chartName].filter(function (ele) {
            return ele.comparatorID === id;
        }).map(function (ele) {
            return ele.days;
        })[0];
        if (!days)
            return date;

        date.setDate(date.getDate() - Number(days));
        return date;
    };
    /**
     * Update The Comparator period (range of days)
     * @param {type} chartName
     * @param {type} id
     * @param {type} date
     * @returns {undefined}
     */
    this.updateDays = function (chartName, id, date) {
        if (!chartName || !id || !date)
            return;

        let currentDate = new Date();
        let timeDiff = Math.abs(currentDate.getTime() - date.getTime());
        let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        let comparator = this.comparatorsChartArr[chartName].filter(function (ele) {
            return ele.comparatorID === id;
        })[0];
        comparator.days = diffDays - 1; // TODO. BOMC Days
    };
    // Creating Graph Comparator, that will display the genarated/consumed power in the period of time that will be compared 
    // with the selected time in the first displayed calendar
    //
    this.createGraphComparator = function (id, graph) {
        if (!graph || !id)
            return;

        let newGraph = clone(graph);
        newGraph.comparatorID = id;
        newGraph.graphName = newGraph.graphName + '-' + id;
        newGraph.graph.id = newGraph.graph.id + '-' + id;

        newGraph.graph.title = this.createTitle(graph.chartName, id, newGraph.graph.title);
        newGraph.graph.valueField = newGraph.graph.valueField + '-' + id;
        if (!newGraph.graph.position && newGraph.graph.position !== 0)
            newGraph.graph.position = newGraph.position;
        newGraph.graph.position = newGraph.graph.position + (Number(id) * 100);

        this.updateFormulaComparator(newGraph);
        return newGraph;
    };
    this.initChart = function (chartName) {
        let actions = this.onInitChartCall[chartName];
        if (actions && actions.length) {
            mainUtils.execCallback(actions);
        }
        ;
    };

    /**
     * Updating the formula and power list of the provided Power Calculator Graph Comparator
     * @param {type} graph
     * @returns {undefined}
     */
    this.updateFormulaComparator = function (graph) {
        if (!graph || !graph.comparatorID || graph.graphType !== 'powerGroup')
            return;

        for (let i in graph.powerList) {
            let powerName = graph.powerList[i];
            let re = new RegExp('"' + powerName + '"', 'g');
            graph.formula = graph.formula.replace(re, '"' + powerName + '-' + graph.comparatorID + '"');
            graph.powerList[i] = powerName + '-' + graph.comparatorID;
        }
    };

    // Getting the power list from the provided formula, in order to update the Chart Groups
    //
    this.calculatePowerList = function (f, list) {
        if (!f || !list)
            return;
        if (!mainUtils.isObject(f) && isNaN(f)) {
            if (!list.includes(f)) {
                list.push(f);
            }
            return;
        }
        this.calculatePowerList(f.p1, list);
        this.calculatePowerList(f.p2, list);
    };
    this.updateChartGraphsValueField = function (chartName, graphValueField) {
        var chart = this.chartArr[chartName];
        var graphArr = this.graphArr[chartName];
        if (chart !== undefined && graphArr !== undefined) {
            for (var item in graphArr) {
                var graph = graphArr[item].graph;
                graph.valueField = graphValueField.replace(/graphName/g, graph.id);
            }
        }
    };
    this.updateChartGraphs = function (chartName, validateNow) {
        if (validateNow === undefined)
            validateNow = 1;
        var chart = this.chartArr[chartName];
        var graphArr = this.graphArr[chartName];
        if (chart !== undefined && graphArr !== undefined) {
            var chartGrArr = chart.graphs;
            chartGrArr.length = 0;
            for (var item in graphArr) {
                var graph = graphArr[item].graph;
                var graphType = graphArr[item].graphType;
                if (chart.graphSkipList[item] !== undefined) {
                    continue;
                }

                // Updating Visible In Legend Value For the Comparators
                // TODO. BOMC This option will be studied later
//                if (this.comparatorsChartArr[chartName] &&  this.comparatorsChartArr[chartName].length) {
//                    graph.visibleInLegend = !graph.hidden;
//                }
//                else {
//                    graph.visibleInLegend = true;
//                }

                if (graph.showBalloon) {
                    if (chart.utilExt === undefined) {
                        console.err("Chart doesn`t implement utilExt!");
                        continue;
                    }

                    graph.balloonText = chart.utilExt.getBalloonTextFn(graphArr[item].graphName, chart, 'balloonTextSimple_' + graphType);
                    if (graph.showBalloonExtend) {
                        graph.balloonText += chart.utilExt.getBalloonTextFn(graphArr[item].graphName, chart, 'balloonTextExtended_' + graphType);
                        if (graph.showBalloonExtendMore) {
                            graph.balloonText += chart.utilExt.getBalloonTextFn(graphArr[item].graphName, chart, 'balloonTextExtendedMore_' + graphType);
                        }
                    }
                }

                chartGrArr.push(clone(graph));
                delete(graph.ballonText);
            }
            chartGrArr.sort(graphManager.graphCompareByPosition);
            if (validateNow)
                chart.validateNow();
        }
    };
    this.getGraphByName = function (chartName, graphName) {
        if (this.graphArr[chartName] !== undefined) {
            var grArr = this.graphArr[chartName];
            for (var item in grArr) {
                if (grArr[item].name === graphName) {
                    return grArr[item];
                }
            }
        }
    };

    this.getDilogSelectedChart = function () {
        if (this.dialogSelectedChartName !== undefined) {
            return this.chartArr[this.dialogSelectedChartName];
        }
    };

    this.showGraphSettings = function (chartName) {
        if (chartName === undefined || this.graphArr[chartName] === undefined) {
            mainUtils.showWarningMessage("Can not find settings for unknown chart!");
            return;
        }
        this.dialogGraphArr.length = 0;
        var grArr = this.graphArr[chartName];
        if (grArr !== undefined) {
            this.dialogSelectedChartName = chartName;
            for (var item in grArr) {
                grArr[item].graphChanges = {};
                this.dialogGraphArr.push(grArr[item]);
            }
            this.dialogGraphArr.sort(graphManager.graphCompareByPosition);

            $('#devGraphSettingsList').puidatatable('reload');
            PF('graphConfigDialog').show();
            $('.tgEmptyMessage').show(0);
            $('.tgContent').hide(0);
        }
    };
    this.findGraphFromDialogArr = function (graphName) {
        for (var item in this.dialogGraphArr) {
            if (this.dialogGraphArr[item].graphName === graphName) {
                return this.dialogGraphArr[item];
            }
        }
    };
    this.dialogSettingSelectionChangeCallback = function (graphObj) {
        console.log(graphObj);
        this.dialogSelectedGraph = graphObj;
        var g = graphObj.graph;
        PF('dcGraphSetting_lineColor').livePreview.css('backgroundColor', g.lineColor);
        PF('dcGraphSetting_fillColors').livePreview.css('backgroundColor', g.fillColors);
        PF('dcGraphTitleWg').jq.val(g.title);
        mainUtils.setSelectOneMenu(g.type, 'dcGraphSetting_type');
        mainUtils.setInputSwitch(!g.hidden, "dcGraphSetting_hidden");
        mainUtils.setInputSwitch(g.showBalloon, "dcGraphSetting_showBalloon");
        mainUtils.setInputSwitch(g.showBalloonExtend, "dcGraphSetting_showBalloonExtend");
        mainUtils.setInputSwitch(g.showBalloonExtendMore, "dcGraphSetting_showBalloonExtendMore");
        PF('dcGraphSetting_fillAlphas').setValue(g.fillAlphas);
        PF('dcGraphSetting_lineAlpha').setValue(g.lineAlpha);
        PF('dcGraphSetting_lineThickness').setValue(g.lineThickness);
        for (var item in g) {
            if (item !== 'valueField' && item !== 'id') {
                this.dialogEmptyChart.graphs[0][item] = g[item];
            }
        }
        $('.tgEmptyMessage').hide(0);
        $('.tgContent').show(0);
        this.dialogEmptyChart.titles[0].text = g.title;
        this.dialogEmptyChart.validateNow();
    };
    this.updateGraph = function () {
        var arrToUpdate = [];
        for (var i = 0; i < this.dialogGraphArr.length; i++) {
            var graphObj = this.dialogGraphArr[i];
            //check for changes 
            var changed = false;
            if (graphObj.graphChanges !== undefined) {
                for (var item in graphObj.graphChanges) {
                    if (graphObj.graphChanges[item] !== undefined &&
                            graphObj.graphChanges[item] !== graphObj.graph[item]) {
                        changed = true;
                        console.log('Field ' + item + ' changed: ' + graphObj.graphChanges[item] + ' -> ' + graphObj.graph[item]);
                        graphObj.graph[item] = graphObj.graphChanges[item];
                    }
                }
            }
            graphObj.graphChanges = {};
            if (changed) {
                /**
                 * Graphs displayed on the Comparator View will have their own configuration
                 */
                if (this.comparatorsChartArr[graphObj.chartName]) {
                    graphObj.chartName += this.comparatorKey;
                }
                arrToUpdate.push(graphObj);
            }
        }
        if (arrToUpdate.length > 0) {
            var jsonStr = JSON.stringify(arrToUpdate);
            graphDialogUpdate([{
                    name: "arr",
                    value: jsonStr
                }]);
            this.updateChartGraphs(this.dialogSelectedChartName);
        }

        PF('graphConfigDialog').hide();

    };
    this.fireGraphSettingsChange = function (name, value) {
        console.log(value);
        if (this.dialogSelectedGraph.graphChanges === undefined) {
            this.dialogSelectedGraph.graphChanges = {};
        }
        this.dialogSelectedGraph.graphChanges[name] = value;
        this.dialogEmptyChart.graphs[0][name] = value;

        var gr = this.dialogSelectedGraph.graphChanges;
        if (name.indexOf('showBalloon') !== -1) {
            var grT = this.dialogSelectedGraph.graph;
            var chart = this.getDilogSelectedChart();
            if (gr.showBalloon && chart !== undefined) {

                if (chart.utilExt === undefined) {
                    console.err("Chart doesn`t implement utilExt!");
                }

                gr.ballonText = chart.utilExt.getBalloonTextFn(this.dialogSelectedGraph.graphName, chart, 'balloonTextSimple_' + this.dialogSelectedGraph.graphType);
                if (gr.showBalloonExtend) {
                    gr.ballonText += chart.utilExt.getBalloonTextFn(this.dialogSelectedGraph.graphName, chart, 'balloonTextExtended_' + this.dialogSelectedGraph.graphType);
                    if (gr.showBalloonExtendMore) {
                        gr.ballonText += chart.utilExt.getBalloonTextFn(this.dialogSelectedGraph.graphName, chart, 'balloonTextExtendedMore_' + this.dialogSelectedGraph.graphType);
                    }
                }
            }
            gr.ballonText = gr.ballonText || " ";
            this.dialogEmptyChart.graphs[0].balloonText = gr.ballonText;
        }
        this.dialogEmptyChart.titles[0].text = gr.title || "";
        this.dialogEmptyChart.validateNow();
    };



    this.onGraphListReorder = function (event, index) {
        var tbody = $('#devGraphSettingsList').find('tbody')[0];
        console.log('event');
        for (var i = 0; i < tbody.childElementCount; i++) {
            var name = tbody.childNodes[i].textContent;
            var graph = this.findGraphFromDialogArr(name);
            if (graph !== undefined) {
                if (graph.graphChanges === undefined) {
                    graph.graphChanges = {};
                }
                graph.graphChanges.position = i;
            }
        }
    };
    this.addChart = function (chart, chartName) {
        this.chartArr[chartName] = chart;
        chart.graphSkipList = {};
    };
}
;
var graphManager = new GraphManager(this);
GraphManager.prototype.isPowerGroupsExist = function (chartName, lookUpField, value) {
    var grArr = this.graphArr[chartName];
    if (grArr !== undefined && lookUpField !== undefined && value !== undefined) {
        for (var item in grArr) {
            if (grArr[item][lookUpField] === value) {
                return true;
            }
        }
    }
    return false;
};

AmGraph.prototype.getGrapgh = function () {
    return this.graphObj;
};

function AmGraph() {
    this.init = function (grObj) {
        this.chartName = grObj.chartName || "unknownChartName";
        this.graphType = grObj.graphType || "unknownGraphType";
        this.graphName = grObj.graphName || "unknownGraphName";
        if (grObj.comparatorID)
            this.comparatorID = grObj.comparatorID;
        if (grObj.graph !== undefined && grObj.graph !== null) {
            this.graph = JSON.parse(grObj.graph);
        } else {
            if (this.comparatorID) {
                this.graph = this.generateFromOtherGraph();
            } else {
                this.graph = this.generateEmptyGraph();
            }
        }
        if (this.graph.position === undefined) {
            this.position = 0;
        } else {
            this.position = this.graph.position;
        }
        if (grObj.valueAxis !== undefined) {
            this.graph.valueAxis = grObj.valueAxis;
        }
    };
    this.generateFromOtherGraph = function () {
        let currentGraphName = this.graphName.substring(0, this.graphName.lastIndexOf('-'));
        if (!graphManager.graphArr || !graphManager.graphArr[this.chartName] || !graphManager.graphArr[this.chartName] || !graphManager.graphArr[this.chartName][currentGraphName] || !graphManager.graphArr[this.chartName][currentGraphName].graph)
            return this.generateEmptyGraph();

        let currentGraph = clone(graphManager.graphArr[this.chartName][currentGraphName].graph);
        currentGraph.valueField = this.graphName;
        currentGraph.id = this.graphName;
        currentGraph.title = graphManager.createTitle(this.chartName, this.comparatorID, currentGraph.title);
        if (mainUtils.isNumber(currentGraph.position))
            currentGraph.position += (this.comparatorID * 100);
        return currentGraph;
    };
    this.generateEmptyGraph = function () {
        return {
            "showBalloon": true,
            "graphType": 0,
            "hidden": false,
            "lineThickness": 1.2,
            "lineColor": "#B0DE09",
            "showBalloonExtend": true,
            "showBalloonExtendMore": false,
            "fillColors": "#AAFFAE",
            "type": "smoothedLine",
            "valueField": this.graphName,
            "title": this.graphName,
            "lineAlpha": 1,
            "id": this.graphName,
            "fillAlphas": 0.3,
            "valueAxis": "ValueAxis-1"

        };
    };
    this.getBallonFromChartName = function (chartName) {
    };
}

$(document).ready(function () {

    $('#devGraphSettingsList').puidatatable({
        columns: [
            {field: 'graphName', headerText: 'Graph'}
        ],
        selectionMode: 'single',
        draggableRows: true,
        datasource: graphManager.dialogGraphArr,
        rowSelect: function (event, data) {
            graphManager.dialogSettingSelectionChangeCallback(data);
        },
        rowReorder: function (event, fromIndex) {
            graphManager.onGraphListReorder(event, fromIndex);
        }
    });
});
graphManager.dialogEmptyChart = AmCharts.makeChart("dcDemoChart", {
    "type": "serial",
    "categoryField": "date",
    "dataDateFormat": "YYYY-MM",
    "zoomOutOnDataUpdate": false,
    "theme": "default",
    "marginTop": 15,
    "autoMargins": false,
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
    "balloon": {

    },
    "titles": [
        {
            text: "title"
        }
    ],
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
GraphManager.prototype.graphCompareByPosition = function (a, b) {
    if (a !== undefined
            && a.position !== undefined
            && b !== undefined
            && b.position !== undefined) {

        if (a.position < b.position)
            return -1;
        if (a.position > b.position)
            return 1;
    }
    return 0;
}
;