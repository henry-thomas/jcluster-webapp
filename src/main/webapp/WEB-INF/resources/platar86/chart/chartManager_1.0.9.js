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


/* global am4charts, am4core, this, _, hh, mainUtils, smdui, sui, mu, am4themes_kelly */

(function (root) {
    if (!root.cm) {
        console.log("Amchart4 chartManager INIT");
        var cm = {

            errorMessages: [],
            initErrorMessages: function () {
                this.errorMessages.length = 0;
            },
            addErrorMessage: function (msg) {
                if (!msg)
                    return;
                if (!this.errorMessages.includes(msg))
                    this.errorMessages.push(msg);
            },
            displayFinalMessage: function (msg) {
                this.addErrorMessage(msg);
                if (this.errorMessages.length === 0) {
                    mainUtils.showInfoMessage("Success", "Chart configurations were saved successfully!");
                    return;
                }
                for (let i; i < this.errorMessages.length; i++) {
                    mainUtils.showErrorMessage("Error", this.errorMessages[i]);
                }
            },
            chartInit: {},
            charts: {},

            saveChartSeriesConf: function (chartName, chartConf, seriesName, isUnique, callback) {
                callback = callback || "cm.addErrorMessage";
                chartUtilSaveChartConfig([
                    {
                        name: "confSave",
                        value: JSON.stringify({
                            chartName: chartName,
                            confType: isUnique ? "seriesConfigUnique" : 'seriesConfig',
                            seriesName: seriesName,
                            confValue: clone(chartConf)
                        })
                    },
                    {
                        name: "callback",
                        value: callback
                    }
                ]);
            },
            saveChartYAxisConf: function (chartName, chartConf, axisName, isUnique, callback) {
                callback = callback || "cm.addErrorMessage";
                chartUtilSaveChartConfig([
                    {
                        name: "confSave",
                        value: JSON.stringify({
                            chartName: chartName,
                            confType: isUnique ? "genConfigUnique" : 'genConfig',
                            seriesName: axisName,
                            confValue: clone(chartConf)
                        })
                    },
                    {
                        name: "callback",
                        value: callback
                    }
                ]);
            },
            saveChartConf: function (chartName, chartConf, isUnique, callback) {
                callback = callback || "cm.addErrorMessage";
                chartUtilSaveChartConfig([
                    {
                        name: "confSave",
                        value: JSON.stringify({
                            chartName: chartName,
                            confType: isUnique ? "genConfigUnique" : "genConfig",
                            seriesName: "",
                            confValue: clone(chartConf)
                        })
                    },
                    {
                        name: "callback",
                        value: callback
                    }
                ]);
            },
            transferToSelected: {},
            initTransferSettingsConfirmDialog: function () {
                cm.portSettingsConfirmDialog = new SMDUIDialog({
                    onInitComplete: function (content, footer, comp) {

                        comp.confirmBtn = hh.button(footer, "Transfer");
                        comp.confirmBtn.onclick = function () {
                            let chart = cm.charts[cm.transferToSelected.fromChart];
                            let serConfNames = Object.keys(chart.serConf);
                            for (let seriesName in chart.serConf) {
                                if (serConfNames[serConfNames.length - 1] === seriesName) {
                                    cm.saveChartSeriesConf(cm.transferToSelected.toChart,
                                            chart.serConf[seriesName],
                                            seriesName,
                                            chart.flags.uniqueSettingsActive === true,
                                            'cm.displayFinalMessage');
                                    cm.saveChartConf(cm.transferToSelected.toChart, chart.conf, chart.flags.uniqueSettingsActive === true);
                                } else {
                                    cm.saveChartSeriesConf(cm.transferToSelected.toChart,
                                            chart.serConf[seriesName],
                                            seriesName,
                                            chart.flags.uniqueSettingsActive === true)
                                }
                            }

                            console.log(cm.transferToSelected, "SUCCESS");
                            content.removeChild(content.firstChild);
                            cm.portSettingsConfirmDialog.close();

                        };
                        comp.cancelBtn = hh.button(footer, "Cancel");
                        comp.cancelBtn.onclick = function () {
                            cm.transferToSelected = "";
                            content.removeChild(content.firstChild);
                            cm.portSettingsConfirmDialog.close();
                        };
                    },

                    modal: true,
                    heading: "Transfer Settings"
                });
            },

            tranferChartConfig: function ( {toName, fromValue, toValue}) {

                cm.transferToSelected.toChart = toValue;
                cm.transferToSelected.fromChart = fromValue;
                let str = "Copy config to <strong>" + toName + "</strong>? <br> <br>" + "<strong>WARNING!</strong> Old settings will be permanently lost!";
                if (!this.portSettingsConfirmDialog.contentDiv.firstChild) {
                    let span = hh.span(this.portSettingsConfirmDialog.contentDiv);
                    span.innerHTML = str;
                } else {
                    this.portSettingsConfirmDialog.contentDiv.firstChild.innerHTML = str;
                }

                cm.portSettingsConfirmDialog.open();
            },

            onChartConf: function (objStr, err) {
                if (err) {
                    console.warn('cm.onChartConf Exception:' + err);

                } else if (typeof (objStr) === 'string') {
                    let obj = JSON.parse(objStr);
                    let name = obj.chartName || 'invalidName';
                    let chartObj = cm.chartInit[name];
                    let conf = obj.confValue || {};

                    if (chartObj) {

                        chartObj.timeEnd = new Date().getTime();
                        window.clearTimeout(chartObj.timer);
                        console.log('Chart ' + obj.chartName + ' config loaded in: ' + (chartObj.timeEnd - chartObj.timeBegin) + 'ms');

                        cm.charts[name] = new SMDUIChart(chartObj.el, name, conf, chartObj.chartDefConfig, chartObj.initCompleteCb);
                        try {
                            initAdminChartSettings(name);

                        } catch (e) {
                            console.warn('User is not admin', e);
                        }
                    } else {
                        console.warn('Unknown Callback received!');
                    }
                }

            },

            createChart: function (el, name, chartDefConfig, initCompleteCb, onErrCb) {
                cm.initTransferSettingsConfirmDialog();
                cm.chartInit[name] = {};
                cm.chartInit[name].initCompleteCb = initCompleteCb;
                cm.chartInit[name].onErrCb = onErrCb;
                cm.chartInit[name].chartDefConfig = chartDefConfig;
                cm.chartInit[name].name = name;
                cm.chartInit[name].el = el;
                cm.chartInit[name].timeBegin = new Date().getTime();
                cm.chartInit[name].timer = window.setTimeout(function (name) {
                    console.log('Timeout fetching config from internet ', name);
                }.bind(cm, name),
                        2500);

                chartUtilLoadChartConfig([
                    {
                        name: "confRequest",
                        value: JSON.stringify({
                            chartName: name,
                            confType: "genConfig",
                            seriesName: ""
                        })
                    },
                    {
                        name: "callback",
                        value: "cm.onChartConf"
                    }
                ]);


            }
        };

        root.cm = cm;
    }

    function SMDUIChart(el, name, conf, chartDefConfig, initComplCb, errCb) {
        this.screenWidthQuery = window.matchMedia("(max-width: 600px)");
        this.screenWidthQuery.addListener(this.onMobileAdapt.bind(this));


        this.name = name;
        //transferConfigCharts is used to save config to other charts. Add here when adding a new chart.
        this.transferConfigCharts = chartDefConfig.transferConfigCharts || [];
        this.flags = {
            uniqueSettingsActive: false,
            initComplete: false
        };
        this.wraper = el;

        this.chartDefConfig = chartDefConfig.conf || {};
        this.seriesDefConfig = chartDefConfig.seriesConf || {};
        this.hiddenConfCtrls = chartDefConfig.hiddenConfCtrls || {};
        this.seriesSpecificConfig = chartDefConfig.seriesSpecificConfig || {};


        this.serConfUnique = {};
        this.serConfDef = {};
        this.serConf = this.serConfDef;
        this.oldGraphConf = {};

        this.chartSeriesContent = {};
        this.chartValueAxisY = {};
        this.confCtrlYAxes = {};
        this.yAxConfUnique = {};
        this.yAxConfDef = {};
        this.yAxConf = this.yAxConfDef;

        this.conf = conf || {};
        this.confDefCopy = clone(this.conf);

        this.initComplCb = initComplCb;

//        this.confOrig = clone(this.conf); // to detect save required
        this.selectedSeries = null;
        this.confCtrlSeries = {};
        this.confCtrl = {};
        this.confTemplate = this.confTemplate || 'default';

        this.chartData = [];
        this.chartDataDateBuff = {};

        this.onSeriesAddedCbArr = [];
        this.onTemplateChangeCbArr = [];


        if (this.conf.useUniqueSetttings && this.conf.useUniqueSetttings === true) {
            this.switchChartSettings(true);
        } else {
            this.init();
        }



    }

    SMDUIChart.prototype.hideSettings = function () {
        for (let setGroup in this.hiddenConfCtrls) {
            if (setGroup !== 'series' && setGroup !== 'yAxes') {
                for (let i = 0; i < this.hiddenConfCtrls[setGroup].length; i++) {
                    let setting = this.hiddenConfCtrls[setGroup][i];
                    try {
                        this.confCtrl[setGroup][setting].hide();
                    } catch (ex) {
                        console.warn('The confCtrl you are trying to hide does not exist: ' + setting);
                    }
                }
            }
            if (setGroup === 'series') {
                for (let i = 0; i < this.hiddenConfCtrls[setGroup].length; i++) {
                    let setting = this.hiddenConfCtrls[setGroup];
                    for (let serName in this.confCtrlSeries) {
                        for (let i = 0; i < this.hiddenConfCtrls[setGroup].length; i++) {
                            let setting = this.hiddenConfCtrls[setGroup][i];
                            try {
                                this.confCtrlSeries[serName][setting].hide();
                            } catch (e) {
                                console.warn('The confCtrl you are trying to hide does not exist: ' + setting);
                            }
                        }
                    }
                }
            }
            if (setGroup === 'yAxes') {
                for (let i = 0; i < this.hiddenConfCtrls[setGroup].length; i++) {
                    let setting = this.hiddenConfCtrls[setGroup];
                    for (let yAxisName in this.confCtrlYAxes) {
                        for (let i = 0; i < this.hiddenConfCtrls[setGroup].length; i++) {
                            let setting = this.hiddenConfCtrls[setGroup][i];
                            try {
                                this.confCtrlYAxes[yAxisName][setting].hide();
                            } catch (e) {
                                console.warn('The confCtrl you are trying to hide does not exist: ' + setting);
                            }
                        }
                    }
                }
            }
        }
    };

    SMDUIChart.prototype.onSeriesAdded = function (cb) {
        if (isFunction(cb)) {
            this.onSeriesAddedCbArr.push(cb);
        }
    };

    //It may be necessary to refresh or validate the chart in some cases when changing the template
    SMDUIChart.prototype.onTemplateChange = function (cb) {
        if (isFunction(cb)) {
            this.onTemplateChangeCbArr.push(cb);
        }
    };

    SMDUIChart.prototype.onChartSeriesReceived = function (val, err) {
        //Nathan breakpoint here
        if (err) {
            return;
        }

        let argObj = {};
        let series = {};
        let yAxis = {};
        if (typeof (val) === 'string') {
            argObj = JSON.parse(val.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t"));
        } else {
            argObj = val;
        }

        series = this.chartSeriesContent[argObj.seriesName];
        if (series) {
            window.clearTimeout(series.timer);
            argObj.confValue = argObj.confValue || {};




            if ((Object.keys(argObj.confValue).length === 0) && this.conf[this.confTemplate].useLegacyFailoverSeriesSettings) {
                this.getOldChartSettings(argObj.seriesName);
                return;
            }
            if ((Object.keys(argObj.confValue).length === 0) && this.seriesSpecificConfig[argObj.seriesName]) {
                argObj.confValue[this.confTemplate] = this.seriesSpecificConfig[argObj.seriesName];
            }



            if (series.isUnique) {
                this.serConfUnique[argObj.seriesName] = argObj.confValue || {};
                this.serConf[argObj.seriesName] = this.serConfUnique[argObj.seriesName];
            } else {
                this.serConfDef[argObj.seriesName] = argObj.confValue || {};
                this.serConf[argObj.seriesName] = this.serConfDef[argObj.seriesName];
            }

            if (series.valueAxisY) {
                if (!this.chartValueAxisY[series.valueAxisY]) {
                    let valueAxis = this.createValueAxisY(series.valueAxisY, series);////
                    this.chartValueAxisY[series.valueAxisY] = valueAxis;
                    this.initValueAxisYSettings(this.chartValueAxisY[series.valueAxisY]);
                }
            }

            let seriesType = this.seriesDefConfig.seriesType;
            let amSeries = new am4charts[seriesType]();

            amSeries.id = argObj.seriesName;
            series.ser = this.chart.series.push(amSeries);


//            amSeries.events.onAll(function (name, ev) {
//                //Invoked when Sprite is becomes ready, that is it has finished all calculations and building itself. 
//                console.log("Series Event: " + name, ev.target.id);
//            }, this);

//            amSeries.events.on("ready", function (ev) {
//                //Invoked when Sprite is becomes ready, that is it has finished all calculations and building itself. 
//
//                let s = this.chartSeriesContent[ev.target.id];
////                console.log("Series Ready ", ev.target.id);
//                if (s.mustRevalidateSerSettingsOnReady) {
//                    s.mustRevalidateSerSettingsOnReady = false;
//                    this.onTemplateSeriesSettingChange();
//                }
//            }, this);


            series.contentPanel = this.settingsTabPanelSeries.addItem({
                id: argObj.seriesName,
                contentClass: 'smdui-tabPanel-contentFlexRow',
                onInitClickCb: function (index, conentEl, comp) {
//                    console.log(index, conentEl, comp);
                }
            });

            if (!series.initCompCpmplete) {
                series.initCompCpmplete = true;
                this.initSeriesSettings(series.id);
            }

            this.handleAddedSeries(series);

        }

    };

    SMDUIChart.prototype.handleAddedSeries = function (series) {

        if (series.valueAxisY && this.chartValueAxisY[series.valueAxisY]) {
            series.ser.yAxis = this.chartValueAxisY[series.valueAxisY];
        }

        for (var dataFieldName in series.dataFields) {
            series.ser.dataFields[dataFieldName] = series.dataFields[dataFieldName];
        }

        if (series.onSeriesCreatedCb) {
            series.onSeriesCreatedCb();
        }

        this.onTemplateSeriesSettingChange();
        this.onTemplateYAxisSettingChange();
        this.hideSettings();
        mu.execCallback(this.onSeriesAddedCbArr, series.ser);
        this.chart.responsive.applyRules();

//        this.onMobileAdapt();
    };

    SMDUIChart.prototype.reorderSeries = function (validateTabSelection) {

        let sortedTabs = this.settingsTabPanelSeries.sortedArr;

        for (let i = 0; i < sortedTabs.length; i++) {
            let zIndex = sortedTabs[i].sortIndex;
            this.serConf[sortedTabs[i].menuIdx][this.confTemplate].zIndex = zIndex;
        }

        let indexArr = [];
        for (let seriesName in this.chart.series.values) {
            let series = this.chart.series.values[seriesName];

            let zIndex = this.serConf[series.id][this.confTemplate].zIndex;
            indexArr.push({name: series.id, index: zIndex});
        }
        //reorder position to sequental 0-based index to avoid gap in legend
        indexArr.sort(function (a, b) {
            if (a.index > b.index) {
                return 1;
            } else if (a.index < b.index) {
                return -1;
            }
            return 0;
        });


        for (let seriesName in this.chart.series.values) {
            let series = this.chart.series.values[seriesName];
            let positionIndex = 0;
            for (let i = 0; i < indexArr.length; i++) {
                if (indexArr[i].name === series.id) {
                    positionIndex = i;
                    break;
                }
            }

            series.zIndex = positionIndex;

            this.settingsTabPanelSeries.setTabIndex(series.id, positionIndex);
        }

        this.chart.legend.mustReorder = true;
        this.chart.legend.dispatchImmediately('reorder');

        //Sort the series according to the assigned zIndex
        this.chart.series.sort(function (a, b) {
            if (a.zIndex > b.zIndex) {
                return 1;
            } else if (a.zIndex < b.zIndex) {
                return -1;
            }
            return 0;
        });

        //Updates changes to the legend (in this case, the order)
        this.chart.feedLegend();

        this.chart.validate();

        //Refresh the tab-panel. Tab selection should only be validated on 
        //init or when template is changed.
        this.settingsTabPanelSeries.refresh(validateTabSelection);
    };


    SMDUIChart.prototype.onChartSeriesTypeChanged = function (val) {
        let series = val;

        //remove the series then add it again.
        this.chart.series.removeIndex(
                this.chart.series.indexOf(series.ser)
                ).dispose();

        series.ser = '';
        series.ser = new am4charts[series.seriesType]();

        if (this.serConf[series.id][this.confTemplate].zIndex !== undefined) {
            let index = this.serConf[series.id][this.confTemplate].zIndex;
            if (index < this.chart.series.values.length) {
                this.chart.series.insertIndex(index, series.ser);
            } else {
                this.chart.series.push(series.ser);
            }
        } else if (this.settingsTabPanelSeries.contentTabArr[series.id].sortIndex !== undefined) {
            let index = this.settingsTabPanelSeries.contentTabArr[series.id].sortIndex;
            if (index < this.chart.series.values.length) {
                this.chart.series.insertIndex(index, series.ser);
            } else {
                this.chart.series.push(series.ser);
            }

        } else {
            this.chart.series.push(series.ser);
        }

        series.ser.name = series.id;
        series.ser.id = series.id;

        this.handleAddedSeries(series);

        this.settingsTabPanelSeries.selectItem(this.settingsTabPanelSeries.contentTabArr[series.id]);
    };


    SMDUIChart.prototype.containsColumnSeries = function () {
        for (let series in this.chartSeriesContent) {
            if (this.chartSeriesContent[series].seriesType === 'ColumnSeries') {
                return true;
            }
            return false;
        }
    };

    SMDUIChart.prototype.createValueAxisY = function (valueAxisName, series) {
        switch (valueAxisName) {
            case "capacityP":
                {
                    let newValueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
                    newValueAxis.numberFormatter = new am4core.NumberFormatter();
                    newValueAxis.numberFormatter.numberFormat = "##.##'%'";
                    return newValueAxis;
                }
                break;

            case "powerW":
                {
                    let newValueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
                    newValueAxis.numberFormatter = new am4core.NumberFormatter();
                    newValueAxis.numberFormatter.numberFormat = "##.##aW";
                    return newValueAxis;
                }
                break;

            case "energyWh":
                {
                    let newValueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
                    newValueAxis.numberFormatter = new am4core.NumberFormatter();
                    newValueAxis.numberFormatter.numberFormat = "##.##aWh";
                    return newValueAxis;
                }
                break;
            case "currentA":
                {
                    let newValueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
                    newValueAxis.numberFormatter = new am4core.NumberFormatter();
                    newValueAxis.numberFormatter.numberFormat = "##.##aAA";
                    return newValueAxis;
                }
                break;
            case "voltageV":
                {
                    let newValueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
                    newValueAxis.numberFormatter = new am4core.NumberFormatter();
                    newValueAxis.numberFormatter.numberFormat = "##.##aV";
                    return newValueAxis;
                }
                break;

            default:
            {
                let newValueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
                newValueAxis.numberFormatter = new am4core.NumberFormatter();
                newValueAxis.numberFormatter.numberFormat = "##.##a";
                return newValueAxis;
            }

        }
    };

    SMDUIChart.prototype.initValueAxisYSettings = function () {
        for (let axisName in this.chartValueAxisY) {
            let axis = this.chartValueAxisY[axisName];
            if (!axis.id) {
                axis.id = axisName;
                axis.contentPanel = this.settingsTabPanelYAxes.addItem({
                    id: axisName,
                    contentClass: 'smdui-tabPanel-contentFlexRow'
                });
                this.addValueAxisYSettings(axisName);
                this.onTemplateYAxisSettingChange();
            }
        }
    };

    SMDUIChart.prototype.addXAxisSettings = function (xAxis) {
        //xAxis is amcharts xAxis Object
        let setName;
        setName = 'clusterGap';
        this.confCtrl.xAxes.clusterGap = new SettingPanel(this.confCtrl.xAxes.tab, {
            title: 'Cluster Gap',
            toolTip: 'Gap displayed between clusters.',
            val: this.getSetting(setName, 'xAxes', 0.2),
            args: {confGroup: "xAxes", confName: setName},
            type: 'sliderHidden',
            sliderHiddenConf: {
                val: this.getSetting(setName, 'xAxes', 0.2),
                labelFormatter: function (val) {
                    if (val === null) {
                        val = 0;
                    }
                    return Number(val * 100).toFixed(0) + "%";
                },
                step: 0.1,
                minVal: 0,
                maxVal: 0.9,
                hideOnChange: true,
                containerClass: 'chCtrl-datePicker-control',
                inputWidth: '75px'
            },
            onChange: function (val, args) {
                xAxis.renderer.cellStartLocation = val / 2;
                xAxis.renderer.cellEndLocation = 1 - val / 2;
                this.onSettingChange(args, val);

            }.bind(this)
        });

    };

    SMDUIChart.prototype.addValueAxisYSettings = function (name) {
        let yAxisOb = this.chartValueAxisY[name];
        yAxisOb.name = name;
        yAxisOb.id = name;
        let content = yAxisOb.contentPanel;
        let ctrlObLoc = this.confCtrlYAxes[name] = this.confCtrlYAxes[name] || {};
        if (!this.chartValueAxisY[name].settings) {
            this.chartValueAxisY[name].settings = {};
        }

        let ctrlName;

        ctrlName = 'yAxisMaxVal';
        if (this.chartValueAxisY[name].settings[ctrlName] !== true) {
            this.chartValueAxisY[name].settings[ctrlName] = true;
            ctrlObLoc[ctrlName] = new SettingPanel(content, {
                title: 'Y-Axis Max Override',
                toolTip: 'Change the max value on y-axis. (To reset to auto, leave empty).',
                type: 'inputText',
                val: this.getYAxisSetting(ctrlName, name, 'Auto'),
                args: {confName: ctrlName, confGroup: 'yAxes', yAxisOb: yAxisOb},
                inputHiddenConf: {
                    val: this.getYAxisSetting(ctrlName, name, 'Auto'),
                    hideOnChange: true,
                    inputWidth: '75px'
                },
                onChange: function (val, args) {
                    if (!isNaN(val) && val !== '') {
                        args.yAxisOb.strictMinMax = true;
                        args.yAxisOb.max = Number(val);
                        args.yAxisOb.validate();
                    } else {
                        val = 'Auto';
                        args.yAxisOb.max = '';
                        args.yAxisOb.validate();
                    }
                    this.onYAxisSettingChange(args, val);
                }.bind(this)
            });
        }
        ctrlName = 'yAxisMinVal';
        if (this.chartValueAxisY[name].settings[ctrlName] !== true) {
            this.chartValueAxisY[name].settings[ctrlName] = true;
            ctrlObLoc[ctrlName] = new SettingPanel(content, {
                title: 'Y-Axis Min Override',
                toolTip: 'Change the min value on y-axis. (To reset to auto, leave empty).',
                type: 'inputText',
                val: this.getYAxisSetting(ctrlName, name, 'Auto'),
                args: {confName: ctrlName, confGroup: 'yAxes', yAxisOb: yAxisOb},
                inputHiddenConf: {
                    val: this.getYAxisSetting(ctrlName, name, 'Auto'),
                    hideOnChange: true,
                    inputWidth: '75px'
                },
                onChange: function (val, args) {
                    if (!isNaN(val) && val !== '') {
                        args.yAxisOb.strictMinMax = true;
                        args.yAxisOb.min = Number(val);
                        if (val === "0") {
                            //strange behaviour of amcharts
                            args.yAxisOb.min = 1;
                            args.yAxisOb.min = 0;
                        }
                        args.yAxisOb.validate();
                    } else {
                        val = 'Auto';
                        args.yAxisOb.min = 1;
                        args.yAxisOb.min = '';
                        args.yAxisOb.validate();
                    }
                    this.onYAxisSettingChange(args, val);
                }.bind(this)
            });
        }

        ctrlName = 'minGridDistance';
        if (this.chartValueAxisY[name].settings[ctrlName] !== true) {
            this.chartValueAxisY[name].settings[ctrlName] = true;
            ctrlObLoc[ctrlName] = new SettingPanel(content, {
                title: 'Min Grid Distance',
                toolTip: 'Minimum distance between grid lines in pixels. Between 20 and 50 recommended.',
                type: 'inputText',
                val: this.getYAxisSetting(ctrlName, name, 50),
                args: {confName: ctrlName, confGroup: 'yAxes', yAxisOb: yAxisOb},
                inputHiddenConf: {
                    val: this.getYAxisSetting(ctrlName, name, 50),
                    hideOnChange: true,
                    inputWidth: '75px'
                },
                onChange: function (val, args) {
                    if (!isNaN(val) && val !== '') {
                        args.yAxisOb.renderer.minGridDistance = Number(val);
                        args.yAxisOb.validate();
                    } else {
                        val = 50;
                        args.yAxisOb.renderer.minGridDistance = 50;
                        args.yAxisOb.validate();

                    }
                    this.onYAxisSettingChange(args, val);
                }.bind(this)
            });
        }

        ctrlName = 'opposite';
        ctrlObLoc[ctrlName] = new SettingPanel(content, {
            title: 'Opposite',
            toolTip: 'Render this axis on the opposite side of the chart.',
            val: this.getYAxisSetting(ctrlName, name),
            args: {confName: ctrlName, confGroup: 'yAxes', yAxisOb: yAxisOb},
            type: 'switch',
            typeStyle: 'sliderRound',
            onChange: function (val, args) {
                this.onYAxisSettingChange(args, val);
                if (val) {
                    args.yAxisOb.renderer.opposite = true;
                    args.yAxisOb.validate();
                } else {
                    args.yAxisOb.renderer.opposite = false;
                    args.yAxisOb.validate();
                }
            }.bind(this)
        });
    };

    /*Applies settings when template is changed*/
    SMDUIChart.prototype.onTemplateYAxisSettingChange = function () {
        let setTemplate = this.confTemplate || 'default';
        let confFromTemplate = this.conf[setTemplate] || (this.conf[setTemplate] = this.conf[setTemplate] || {});

        for (var groupName in confFromTemplate['yAxes']) {
            let group = confFromTemplate['yAxes'][groupName];

            let grouCtrl = this.confCtrlYAxes[groupName];
            if (grouCtrl) {
                for (var itemName in group) {
                    let itemValue = group[itemName];
                    let itemCtrl = grouCtrl[itemName];
                    if (itemCtrl && typeof (itemCtrl.onChangeCb) === 'function' && typeof (itemCtrl.setValue) === 'function') {
                        itemCtrl.setValue(itemValue);
                        itemCtrl.onChangeCb();
                    }
                }
            }
        }
    };

    SMDUIChart.prototype.getYAxisSetting = function (setName, name, defValue) {
        let setGroup = 'yAxes';
        let setTemplateName = this.confTemplate;
        if (this.conf[setTemplateName] === undefined) {
            if (this.chartDefConfig) {
                this.conf[setTemplateName] = clone(this.chartDefConfig);
            } else {
                this.conf[setTemplateName] = {};
            }
            this.conf[setTemplateName].confName = setTemplateName;
            this.conf[setTemplateName].confNameLabel = this.conf[setTemplateName].confNameLabel || setTemplateName;
        }
        let confFromTemplate = this.conf[setTemplateName];
        let group = confFromTemplate[setGroup] = confFromTemplate[setGroup] || {};
        let axis = group[name] = group[name] || {};
        axis[setName] = axis[setName] || defValue || null; //create null value if does not exist
        return axis[setName];
    };

    SMDUIChart.prototype.onYAxisSettingChange = function (args, value, name) {
        if (typeof (args) === 'object' && args.confName !== undefined && args.confGroup !== undefined) {
            let setTemplate = this.confTemplate;
            let confFromTemplate = this.conf[setTemplate] || (this.conf[setTemplate] = this.conf[setTemplate] || {});
            let group = confFromTemplate[args.confGroup] = confFromTemplate[args.confGroup] || {};
            let axis = group[args.yAxisOb.id] = group[args.yAxisOb.id] || {};
            if (axis && axis[args.confName] !== undefined) {
                axis[args.confName] = value;
            } else {
                console.warn('look here');
            }
            this.confChangeDetected = _.isEqual(this.conf, this.confOrig);
            return  value;
        } else {
            console.warn('SMDUIChart.prototype.onSettingChange() Call with invalid arguments');
        }
    };

    SMDUIChart.prototype.fetchSeriesSettings = function (seriesName) {
        let sObj = this.chartSeriesContent[seriesName];

        if (!sObj.confReq) {
            sObj.confReq = true;
            sObj.isUnique = this.flags.uniqueSettingsActive ? true : false;

            sObj.timer = window.setTimeout(function (sName) {
                console.warn('Timeout for Series Config', sName);
            }.bind(this, seriesName), 2000);

            chartUtilLoadChartConfig([
                {
                    name: "confRequest",
                    value: JSON.stringify({
                        chartName: this.name,
                        confType: this.flags.uniqueSettingsActive ? "seriesConfigUnique" : 'seriesConfig',
                        seriesName: seriesName
                    })
                },
                {
                    name: "callback",
                    value: "cm.charts['" + this.name + "'].onChartSeriesReceived"
                }
            ]);
        }
    };

    SMDUIChart.prototype.getOldChartSettings = function (seriesName) {
        //Specify the old chart name to fetch from.
        //add other names here for charts to get settings from. 
        let chartName = '';
        let charts = {powerHistory1: 'timeGraph', energyHistory1: 'dateGraph'};
        for (let newChart in charts) {
            if (this.name === newChart) {
                chartName = charts[newChart];
            }
        }


        chartUtilGetPrevGraphSettings([
            {
                name: "confRequest",
                value: JSON.stringify({
                    chartName: chartName, // testing with timegraph
                    seriesName: seriesName
                })
            },
            {
                name: "callback",
                value: "cm.charts['" + this.name + "'].onOldSettingsReceived"
            }]);
    };

    SMDUIChart.prototype.onOldSettingsReceived = function (val, err) {
        if (err) {
            console.log(err);
        }
        let argObj = JSON.parse(val);
        let oldChartConf = {};
        let newChartConf = {};
        let seriesName;
        let series;
        if ((val !== "null" || null)) {
            oldChartConf = argObj.confValue;
            if (Object.keys(oldChartConf).length === 0) {

            }
            newChartConf["default"] = {};
            for (let setting in oldChartConf) {
                if (oldChartConf[setting] !== null && setting === 'lineThickness') {
                    newChartConf["default"]["lineWidth"] = oldChartConf[setting];
                }
                if (oldChartConf[setting] !== null && setting === 'lineColor') {
                    newChartConf["default"]["lineColor"] = oldChartConf[setting];
                }
                if (oldChartConf[setting] !== null && setting === 'lineAlpha') {
                    newChartConf["default"]["lineOpacity"] = oldChartConf[setting];
                }
                if (oldChartConf[setting] !== null && setting === 'title') {
                    newChartConf["default"]["name"] = oldChartConf[setting];
                }
                if (oldChartConf[setting] !== null && setting === 'fillAlphas') {
                    newChartConf["default"]["fillOpacity"] = oldChartConf[setting];
                }
                if (oldChartConf[setting] !== null && setting === 'fillColors') {
                    newChartConf["default"]["fillColor"] = oldChartConf[setting];
                }
//                if(oldChartConf[setting] !== null && setting === 'hidden'){
//                    newChartConf["default"]["hidden"] = (oldChartConf[setting]);
//                }
            }

        } else {
            console.warn('Old graph settings null value');
            return;
        }
        seriesName = argObj.seriesName;
        series = this.chartSeriesContent[seriesName];

        if (series.isUnique) {
            this.serConfUnique[seriesName] = newChartConf || {};
            this.serConf[seriesName] = this.serConfUnique[seriesName];
        } else {
            this.serConfDef[seriesName] = newChartConf || {};
            this.serConf[seriesName] = this.serConfDef[seriesName];
        }



        if (series.valueAxisY) {
            if (!this.chartValueAxisY[series.valueAxisY]) {
                let valueAxis = this.createValueAxisY(series.valueAxisY, series);////
                this.chartValueAxisY[series.valueAxisY] = valueAxis;
                this.initValueAxisYSettings(this.chartValueAxisY[series.valueAxisY]);
            }
        }

        let seriesType = this.seriesDefConfig.seriesType;
        series.ser = this.chart.series.push(new am4charts[seriesType]());
        series.ser.id = seriesName;
        series.ser.name = series.ser.id;

        series.contentPanel = this.settingsTabPanelSeries.addItem({
            id: argObj.seriesName,
            contentClass: 'smdui-tabPanel-contentFlexRow'
        });

        if (!series.initCompCpmplete) {
            series.initCompCpmplete = true;
            this.initSeriesSettings(series.id);
        }

        this.handleAddedSeries(series);

        cm.saveChartSeriesConf(this.name, newChartConf, seriesName, series.isUnique);
    };

    SMDUIChart.prototype.getSeriesSetting = function (seriesName, setName, defValue) {
        let setTemplateName = this.confTemplate || 'default';
        let serConfObj = this.serConf[seriesName] = this.serConf[seriesName] || {};


        let confFromTemplate = serConfObj[setTemplateName] = serConfObj[setTemplateName] || {};

        if (confFromTemplate[setName] === null) {
            confFromTemplate[setName] = 0;
        } else {
            if (setName === 'enabled' && confFromTemplate[setName] === undefined) {
                confFromTemplate[setName] = confFromTemplate[setName] || true; //create null value if does not exist
            }
            confFromTemplate[setName] = (confFromTemplate[setName]) || defValue || null; //create null value if does not exist
        }
        return confFromTemplate[setName];
    };

    SMDUIChart.prototype.onSeriesSettingChange = function (val, args) {
        
        let serOb = args.seriesOb;
//        if (!serOb.ser.isReady()) {
//            serOb.mustRevalidateSerSettingsOnReady = true;
//            return;
//        }

        let seriesName = serOb.name;
        let ctrlName = args.ctrlName;

        let setTemplateName = this.confTemplate || 'default';


        let serConfObj = this.serConf[seriesName] = this.serConf[seriesName] || {};

        let confFromTemplate = serConfObj[setTemplateName] = serConfObj[setTemplateName] || {};

        confFromTemplate[ctrlName] = val; //create null value if does not exist

//        this.chart.feedLegend(); //updates legend when settings are changed
//        this.chart.legend.mustReorder = true;
//        this.chart.legend.dispatchImmediately('reorder');
    };

    SMDUIChart.prototype.initSeriesSettings = function (name) {
        //Nathan breakpoint here
        let seriesOb = this.chartSeriesContent[name];
        let content = seriesOb.contentPanel;
        let ctrlObLoc = this.confCtrlSeries[name] = this.confCtrlSeries[name] || {};
        if (!this.chartSeriesContent[name].settings) {
            this.chartSeriesContent[name].settings = {};
        }


        let ctrlName;


        ctrlName = 'name';
        if (this.chartSeriesContent[name].settings[ctrlName] !== true) {
            this.chartSeriesContent[name].settings[ctrlName] = true;
            ctrlObLoc[ctrlName] = new SettingPanel(content, {
                title: 'Series Name',
                toolTip: 'Associates a custom name with this series.',
                type: 'inputText',
                val: this.getSeriesSetting(name, ctrlName, name),
                args: {seriesOb: seriesOb, ctrlName: ctrlName},
                inputHiddenConf: {
                    val: name,
                    hideOnChange: true,
                    inputWidth: '75px'
                },
                onChange: function (val, args) {
                    //Nathan breakpoint here
                    this.onSeriesSettingChange(val, args);
                    args.seriesOb.ser.name = val;


                }.bind(this)
            });
        }

        ctrlName = 'hidden';
        if (this.chartSeriesContent[name].settings[ctrlName] !== true) {
            this.chartSeriesContent[name].settings[ctrlName] = true;
            ctrlObLoc[ctrlName] = new SettingPanel(content, {
                title: 'Hidden',
                toolTip: 'Hide this series.',
                val: this.getSeriesSetting(name, ctrlName, false),
                args: {seriesOb: seriesOb, ctrlName: ctrlName},
                type: 'switch',
                typeStyle: 'sliderRound',
                onChange: function (val, args) {
                    this.onSeriesSettingChange(val, args);

                    args.seriesOb.ser.disabled = val;
                    args.seriesOb.ser.hiddenInLegend = val;

                    this.updateMicroChart();
//                    this.chart.legend.mustReorder = true;
//                    this.reorderSeries();
//                    this.chart.legend.dispatch('reorder');
                }.bind(this)
            });
        }

        ctrlName = 'enabled';
        if (this.chartSeriesContent[name].settings[ctrlName] !== true) {
            this.chartSeriesContent[name].settings[ctrlName] = true;
            ctrlObLoc[ctrlName] = new SettingPanel(content, {
                title: 'Enabled on Load',
                toolTip: 'Hides this series, but it is still accessible via the chart legend.',
                val: function () {
                    this.getSeriesSetting(name, ctrlName);
                }.bind(this)(),
                args: {seriesOb: seriesOb, ctrlName: ctrlName},
                type: 'switch',
                typeStyle: 'sliderRound',
                onChange: function (val, args) {
//                    if (val === null) {
//                        val = true;
//                    }
                    this.onSeriesSettingChange(val, args);
                    if (!val) {
                        args.seriesOb.ser.hide();
                    } else {
                        args.seriesOb.ser.show();
                    }
                }.bind(this)
            });
        }

        ctrlName = 'lineWidth';
        if (this.chartSeriesContent[name].settings[ctrlName] !== true) {
            this.chartSeriesContent[name].settings[ctrlName] = true;
            ctrlObLoc[ctrlName] = new SettingPanel(content, {
                title: 'Line Width',
                toolTip: 'Sets the thickness of the series outline.',
                val: this.getSeriesSetting(name, ctrlName, 1),
                args: {seriesOb: seriesOb, ctrlName: ctrlName},
                type: 'sliderHidden',
                sliderHiddenConf: {
                    labelFormatter: function (val) {
                        if (val === null) {
                            val = 1;
                        }
                        return Number(val).toFixed(1) + "px";
                    },
                    val: this.getSeriesSetting(name, ctrlName, 1),
                    step: 0.5,
                    minVal: 0,
                    maxVal: 10,
                    hideOnChange: true,
                    containerClass: 'chCtrl-datePicker-control',
                    inputWidth: '75px'
                },
                onChange: function (val, args) {
                    this.onSeriesSettingChange(val, args);

                    if (args.seriesOb.seriesType === 'ColumnSeries')
                        args.seriesOb.ser.columns.template.strokeWidth = val;
                    {
                    }
                    ;
                    args.seriesOb.ser.strokeWidth = val;
                }.bind(this)
            });
        }

        ctrlName = 'lineOpacity';
        if (this.chartSeriesContent[name].settings[ctrlName] !== true) {
            this.chartSeriesContent[name].settings[ctrlName] = true;
            ctrlObLoc[ctrlName] = new SettingPanel(content, {
                title: 'Line Opacity',
                toolTip: 'Sets the opacity of the series outline.',
                val: this.getSeriesSetting(name, ctrlName, 1),
                args: {seriesOb: seriesOb, ctrlName: ctrlName},
                type: 'sliderHidden',
                sliderHiddenConf: {
                    val: this.getSeriesSetting(name, ctrlName, 1),
                    step: 0.05,
                    minVal: 0,
                    maxVal: 1,
                    labelFormatter: function (val) {
                        if (val === null) {
                            val = 1;
                        }
                        return Number(val * 100).toFixed(0) + "%";
                    },
                    hideOnChange: true,
                    containerClass: 'chCtrl-datePicker-control',
                    inputWidth: '75px'
                },
                onChange: function (val, args) {
                    this.onSeriesSettingChange(val, args);
                    if (args.seriesOb.seriesType === 'ColumnSeries') {
                        args.seriesOb.ser.columns.template.strokeOpacity = val;
                    }
                    args.seriesOb.ser.strokeOpacity = val;
                    args.seriesOb.ser.invalidate();
                }.bind(this)
            });
        }

        ctrlName = 'lineSmoothnessHoriz';
        if (seriesOb.seriesType === 'LineSeries' && this.chartSeriesContent[name].settings[ctrlName] !== true) {
            this.chartSeriesContent[name].settings[ctrlName] = true;
            ctrlObLoc[ctrlName] = new SettingPanel(content, {
                title: 'Line Smoothness Horizontal',
                toolTip: 'Makes the series line less jagged in the X direction.',
                val: this.getSeriesSetting(name, ctrlName, 0.1),
                args: {seriesOb: seriesOb, ctrlName: ctrlName, appSeriesType: 'LineSeries'},
                type: 'sliderHidden',
                sliderHiddenConf: {
                    val: this.getSeriesSetting(name, ctrlName, 0.1),
                    step: 0.05,
                    minVal: 0,
                    maxVal: 1,
                    labelFormatter: function (val) {
                        if (val === null) {
                            val = 1;
                        }
                        return Number(val * 100).toFixed(0) + "%";
                    },
                    hideOnChange: true,
                    containerClass: 'chCtrl-datePicker-control',
                    inputWidth: '75px'
                },
                onChange: function (val, args) {
                    this.onSeriesSettingChange(val, args);
                    args.seriesOb.ser.tensionX = 1 - val;
                }.bind(this)
            });

        }

        ctrlName = 'lineSmoothnessVer';
        if (seriesOb.seriesType === 'LineSeries' && this.chartSeriesContent[name].settings[ctrlName] !== true) {
            this.chartSeriesContent[name].settings[ctrlName] = true;
            ctrlObLoc[ctrlName] = new SettingPanel(content, {
                title: 'Line Smoothness Vertical',
                toolTip: 'Makes the series line less jagged in the Y direction.',
                val: this.getSeriesSetting(name, ctrlName, 0.1),
                args: {seriesOb: seriesOb, ctrlName: ctrlName, appSeriesType: 'LineSeries'},
                type: 'sliderHidden',
                sliderHiddenConf: {
                    val: this.getSeriesSetting(name, ctrlName, 0.1),
                    step: 0.05,
                    minVal: 0,
                    maxVal: 1,
                    labelFormatter: function (val) {
                        if (val === null) {
                            val = 0;
                        }
                        return Number(val * 100).toFixed(0) + "%";
                    },
                    hideOnChange: true,
                    containerClass: 'chCtrl-datePicker-control',
                    inputWidth: '75px'
                },
                onChange: function (val, args) {
                    this.onSeriesSettingChange(val, args);
                    args.seriesOb.ser.tensionY = 1 - val;
                }.bind(this)
            });
        }
        ctrlName = 'lineColor';
        if (this.chartSeriesContent[name].settings[ctrlName] !== true) {
            if (this.chartSeriesContent[name].settings[ctrlName] !== true) {
                this.chartSeriesContent[name].settings[ctrlName] = true;
                ctrlObLoc[ctrlName] = new SettingPanel(content, {
                    title: 'Line Color',
                    toolTip: 'Sets the series line colour.',
                    val: this.getSeriesSetting(name, ctrlName),
                    args: {seriesOb: seriesOb, ctrlName: ctrlName},
                    type: 'inputColor',
                    inputColorConf: {

                    },
                    onChange: function (val, args) {
                        this.onSeriesSettingChange(val, args);
                        if (args.seriesOb.seriesType === 'ColumnSeries') {
                            args.seriesOb.ser.columns.template.stroke = am4core.color(val);
                        } else {
                            args.seriesOb.ser.stroke = am4core.color(val);
                        }
                        args.seriesOb.ser.invalidate();
                    }.bind(this)
                });
            }

            ctrlName = 'fillColor';
            if (this.chartSeriesContent[name].settings[ctrlName] !== true) {
                this.chartSeriesContent[name].settings[ctrlName] = true;
                ctrlObLoc[ctrlName] = new SettingPanel(content, {
                    title: 'Fill Color',
                    toolTip: 'Sets the series fill colour.',
                    val: this.getSeriesSetting(name, ctrlName),
                    args: {seriesOb: seriesOb, ctrlName: ctrlName},
                    type: 'inputColor',
                    inputColorConf: {

                    },
                    onChange: function (val, args) {
                        this.onSeriesSettingChange(val, args);
                        if (args.seriesOb.seriesType === 'ColumnSeries') {
                            args.seriesOb.ser.columns.template.fill = am4core.color(val);
                        } else {
                            args.seriesOb.ser.fill = am4core.color(val);
                        }
                        args.seriesOb.ser.invalidate();
                    }.bind(this)
                });
            }
        }

        ctrlName = 'fillOpacity';
        if (this.chartSeriesContent[name].settings[ctrlName] !== true) {
            let fillOpDefault;
            if (this.chartSeriesContent[name].seriesType === 'LineSeries') {
                fillOpDefault = 0;
            } else {
                fillOpDefault = 0.6;
            }
            this.chartSeriesContent[name].settings[ctrlName] = true;
            ctrlObLoc[ctrlName] = new SettingPanel(content, {
                title: 'Fill Opacity',
                toolTip: 'Sets the opacity of the series fill.',
                val: this.getSeriesSetting(name, ctrlName, fillOpDefault),
                args: {seriesOb: seriesOb, ctrlName: ctrlName},
                type: 'sliderHidden',
                sliderHiddenConf: {
                    val: this.getSeriesSetting(name, ctrlName, fillOpDefault), // third argument here sets the default. 
                    step: 0.05,
                    minVal: 0,
                    maxVal: 1,
                    labelFormatter: function (val) {
                        if (val === null) {
                            val = fillOpDefault;
                        }
                        return Number(val * 100).toFixed(0) + "%";
                    },
                    hideOnChange: true,
                    containerClass: 'chCtrl-datePicker-control',
                    inputWidth: '75px'

                },

                onChange: function (val, args) {
                    this.onSeriesSettingChange(val, args);
                    if (args.seriesOb.seriesType === 'ColumnSeries') {
                        args.seriesOb.ser.columns.template.fillOpacity = val;
                    } else {
                        args.seriesOb.ser.fillOpacity = val;
                    }
                    args.seriesOb.ser.invalidate();
                }.bind(this)
            });
        }


        if (Array.isArray(seriesOb.toolTipOptions) && seriesOb.toolTipOptions.length > 0) {
            ctrlName = 'tooltipText';
            if (this.chartSeriesContent[name].settings[ctrlName] !== true) {
                this.chartSeriesContent[name].settings[ctrlName] = true;
                ctrlObLoc[ctrlName] = new SettingPanel(content, {
                    title: 'Info Balloon',
                    toolTip: 'Data shown while moving the mouse over chart area for this series.',
                    type: 'dropDown',
                    args: {seriesOb: seriesOb, ctrlName: ctrlName},
                    dropDownConf: {
                        val: this.getSeriesSetting(name, ctrlName, seriesOb.toolTipDefault || null),
                        options: seriesOb.toolTipOptions
                    },

                    onChange: function (val, args, settingsPanel) {
//                        console.log(val);
                        this.onSeriesSettingChange(val, args);
                        args.seriesOb.ser.tooltipText = val;
                        args.seriesOb.ser.tooltip.pointerOrientation = 'vertical';
                    }.bind(this)
                });
            }
        }

        ctrlName = 'seriesType';
        if (this.chartSeriesContent[name].settings[ctrlName] !== true) {
            this.chartSeriesContent[name].settings[ctrlName] = true;
            ctrlObLoc[ctrlName] = new SettingPanel(content, {
                title: 'Series Type',
                toolTip: 'Switch between column and line series.',
                type: 'dropDown',
                args: {seriesOb: seriesOb, ctrlName: ctrlName},
                dropDownConf: {
                    val: this.getSeriesSetting(name, ctrlName, seriesOb.seriesType),
                    options: [{label: "Columns", value: "ColumnSeries"}, {label: "Line", value: "LineSeries"}]
                },

                onChange: function (val, args, settingsPanel) {
                    this.onSeriesSettingChange(val, args);
                    switch (val) {
                        case 'ColumnSeries':
                            if (args.seriesOb.seriesType !== val) {
                                args.seriesOb.seriesType = val;
                                this.onChartSeriesTypeChanged(args.seriesOb);
                                this.onDataFieldsChanged(this.dataFields);
                                this.initSeriesSettings(args.seriesOb.id);
                                //show/hide the relevant settings which are applicable to line or column series.
                                for (let confControl in this.confCtrlSeries[args.seriesOb.id]) {
                                    if (this.confCtrlSeries[args.seriesOb.id][confControl].getArgs().appSeriesType && this.confCtrlSeries[args.seriesOb.id][confControl].getArgs().appSeriesType !== 'ColumnSeries') {
                                        this.confCtrlSeries[args.seriesOb.id][confControl].hide();
                                    } else {
                                        this.confCtrlSeries[args.seriesOb.id][confControl].show();
                                    }
                                }
                                this.hideSettings(); //hiding settings defined in hiddenConfCtrls
                            }
                            break;

                        case 'LineSeries':
                            if (args.seriesOb.seriesType !== val) {
                                args.seriesOb.seriesType = val;
                                this.onChartSeriesTypeChanged(args.seriesOb);
                                this.onDataFieldsChanged(this.dataFields);
                                this.initSeriesSettings(args.seriesOb.id);
                                for (let confControl in this.confCtrlSeries[args.seriesOb.id]) {
                                    if (this.confCtrlSeries[args.seriesOb.id][confControl].getArgs().appSeriesType && this.confCtrlSeries[args.seriesOb.id][confControl].getArgs().appSeriesType !== 'LineSeries') {
                                        this.confCtrlSeries[args.seriesOb.id][confControl].hide();
                                    } else {
                                        this.confCtrlSeries[args.seriesOb.id][confControl].show();
                                    }
                                }
                                this.hideSettings();
                            }
                            break;
                    }
                }.bind(this)
            });
        }

        ctrlName = 'stacked';
        if (this.chartSeriesContent[name].settings[ctrlName] !== true) {
            this.chartSeriesContent[name].settings[ctrlName] = true;
            ctrlObLoc[ctrlName] = new SettingPanel(content, {
                title: 'Stacked',
                toolTip: 'Useful to demonstrate how a larger data category is comprised of smaller categories.',
                val: function () {
                    this.getSeriesSetting(name, ctrlName);
                }.bind(this)(),
                args: {seriesOb: seriesOb, ctrlName: ctrlName},
                type: 'switch',
                typeStyle: 'sliderRound',
                onChange: function (val, args) {
                    this.onSeriesSettingChange(val, args);
                    if (val) {
                        args.seriesOb.ser.stacked = true;

                    } else {
                        args.seriesOb.ser.stacked = false;
                    }
                }.bind(this)
            });
        }

        ctrlName = 'columnWidth';
        if (seriesOb.seriesType === 'ColumnSeries' && this.chartSeriesContent[name].settings[ctrlName] !== true) {
            this.chartSeriesContent[name].settings[ctrlName] = true;
            ctrlObLoc[ctrlName] = new SettingPanel(content, {
                title: 'Column Width',
                toolTip: "Specify the width of this series' column",
                val: this.getSeriesSetting(name, ctrlName, 80),
                args: {seriesOb: seriesOb, ctrlName: ctrlName, appSeriesType: 'ColumnSeries'},
                type: 'sliderHidden',
                sliderHiddenConf: {
                    val: this.getSeriesSetting(name, ctrlName, 80),
                    step: 1,
                    minVal: 10,
                    maxVal: 100,
                    labelFormatter: function (val) {
                        if (val === null) {
                            val = 80;
                        }
                        return Number(val) + "%";
                    },
                    hideOnChange: true,
                    containerClass: 'chCtrl-datePicker-control',
                    inputWidth: '75px'
                },
                onChange: function (val, args) {
                    if (args.seriesOb.seriesType === 'ColumnSeries') {
                        this.onSeriesSettingChange(val, args);
                        args.seriesOb.ser.columns.template.width = am4core.percent(val);
                        args.seriesOb.ser.validateData();
                    }
                }.bind(this)
            });
        }
    };

//this function is useful when changing the time period interval on a chart. See energyHistoryChart.
    SMDUIChart.prototype.onDataFieldsChanged = function (dataFields, series) {
        if (dataFields) {
            this.dataFields = dataFields;

            let serArr = this.chart.series;
            for (let i = 0; i < serArr.length; i++) {
                this.chart.series.values[i].dataFields = {
                    valueY: serArr.values[i].id + dataFields.valueY,
                    dateX: dataFields.dateX
                };
            }
        } else {
            return;
        }

    };

    SMDUIChart.prototype.addRequiredSeries = function (reqSeries) {
        if (typeof (reqSeries) !== 'object') {
            return;
        }

        let sortedSeries = Object.keys(reqSeries).sort(function (a, b) {
            return mu.compare(a, b);
        });

        for (let i in sortedSeries) {
            let seriesName = sortedSeries[i];
            let series = clone(reqSeries[seriesName]);

            if (this.chartSeriesContent[seriesName] === undefined) {
                this.chartSeriesContent[seriesName] = series;
                series.name = seriesName;
                series.id = seriesName;

                this.fetchSeriesSettings(seriesName);
            }
        }
    };

    SMDUIChart.prototype.switchChartSettings = function (useUnique) {
        if (useUnique) {
            if (this.flags.uniqueSettingsActive === false) {
                if (this.confUniqueCopy) {
                    this.flags.uniqueSettingsActive = true;
                    this.conf.useUniqueSetttings = true;
                    this.confDefCopy = clone(this.conf);
                    if (Object.keys(this.confUniqueCopy).length === 0) {
//                        this.conf = clone(this.confUniqueCopy);
                        this.conf = clone(this.conf);
                        delete   this.conf.useUniqueSetttings;
                    } else {
                        this.conf = clone(this.confUniqueCopy);
                    }
                    if (this.flags.initComplete) {
                        this.confCtrl.tool.useLoggerUniqueSettingsSwitch.setValue(true);
                    }
                    this.updateSettingsTemplateControl(true);
                } else {
                    this.loadLoggerSpecificSettings();
                }
            }
        } else {
            if (this.flags.uniqueSettingsActive) {
                this.flags.uniqueSettingsActive = false;
                this.confUniqueCopy = clone(this.conf);
                this.conf = clone(this.confDefCopy);
                this.conf.useUniqueSetttings = false;
                if (this.flags.initComplete) {
                    this.confCtrl.tool.useLoggerUniqueSettingsSwitch.setValue(false);
                }

                this.updateSettingsTemplateControl(true);
            }
        }
    };

    SMDUIChart.prototype.onLoggerSpecificSettings = function (c) {
        let uConf = JSON.parse(c);
        console.log('load unique settings request');
        this.confUniqueCopy = clone(uConf.confValue);

        this.init();
        this.switchChartSettings(true);
    };

    SMDUIChart.prototype.loadLoggerSpecificSettings = function () {
        chartUtilLoadChartConfig([
            {
                name: "confRequest",
                value: JSON.stringify({
                    chartName: this.name,
                    confType: "genConfigUnique",
                    seriesName: ""
                })
            },
            {
                name: "callback",
                value: "cm.charts." + this.name + ".onLoggerSpecificSettings"
            }
        ]);
    };



    SMDUIChart.prototype.initChart = function () {
        this.createFullscreenToggle();
        this.createSettingsToggle();
        this.createExportDropdown();

        let chartType = this.chartDefConfig.chartType || 'XYChart';
//                am4charts.XYChart
        if (typeof (am4charts[chartType]) !== 'function') {
            console.warn('Can not create Chart of type :' + chartType);
            return;
        }
        let chartConf = this.chartDefConfig.chartConf = this.chartDefConfig.chartConf || {};
//        am4core.useTheme(am4themes_amcharts);
//        am4core.useTheme(am4themes_amchartsdark); //not useful
        am4core.useTheme(am4themes_kelly);
        let chart = am4core.createFromConfig(chartConf, this.chartDiv, chartType);
        this.legendContainer = am4core.createFromConfig({
            "width": "100%",
            "height": "100%"
        }, this.legendContainerDiv, am4core.Container);

        this.chart = chart;
        chart.data = this.chartData; //dataProvider
        chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";
        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());

        this.addXAxisSettings(dateAxis);

        chart.zoomOutButton.icon.disabled = true;
        var zoomImage = chart.zoomOutButton.createChild(am4core.Image);
        zoomImage.href = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDk2IDk2IiBoZWlnaHQ9Ijk2cHgiIGlkPSJ6b29tX291dCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgOTYgOTYiIHdpZHRoPSI5NnB4IiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48cGF0aCBkPSJNOTAuODI5LDg1LjE3MUw2OC4xMjEsNjIuNDY0QzczLjA0Nyw1Ni4zMDcsNzYsNDguNSw3Niw0MEM3NiwyMC4xMTgsNTkuODgyLDQsNDAsNEMyMC4xMTgsNCw0LDIwLjExOCw0LDQwczE2LjExOCwzNiwzNiwzNiAgYzguNSwwLDE2LjMwNi0yLjk1MywyMi40NjQtNy44NzlsMjIuNzA4LDIyLjcwOGMxLjU2MiwxLjU2Miw0LjA5NSwxLjU2Miw1LjY1NywwQzkyLjM5MSw4OS4yNjcsOTIuMzkxLDg2LjczMyw5MC44MjksODUuMTcxeiAgIE00MCw2OGMtMTUuNDY0LDAtMjgtMTIuNTM2LTI4LTI4czEyLjUzNi0yOCwyOC0yOGMxNS40NjQsMCwyOCwxMi41MzYsMjgsMjhTNTUuNDY0LDY4LDQwLDY4eiIvPjxwYXRoIGQ9Ik01Niw0MGMwLDIuMjA5LTEuNzkxLDQtNCw0SDI4Yy0yLjIwOSwwLTQtMS43OTEtNC00bDAsMGMwLTIuMjA5LDEuNzkxLTQsNC00aDI0QzU0LjIwOSwzNiw1NiwzNy43OTEsNTYsNDBMNTYsNDB6Ii8+PC9zdmc+";
        zoomImage.width = 15;
        zoomImage.height = 15;

        let self = this;
        this.chart.events.on("appeared", function (ev) {
            // Some delay required in order to get the microchart when the appeared event is triggered the first and unique time
            setTimeout(function () {
                self.updateMicroChart();
            }, 1000);
        });

        this.chart.events.on("dataitemsvalidated", function (ev) {
            self.updateMicroChart();
        });


    };

    SMDUIChart.prototype.createSettingsToggle = function () {
        let container = this.controlRightDiv;

        let button = hh.button(container, {faIcon: 'cog'});
        button.style.marginLeft = '2px';
        button.addEventListener('click', this.toggleSettings.bind(this, button));
        this.settingsButton = button;
    };

    SMDUIChart.prototype.createFullscreenToggle = function () {
        let container = this.controlRightDiv;
        let button = hh.button(container, {faIcon: 'expand'});
        button.addEventListener('click', this.toggleFullscreen.bind(this, button));
        this.fullscreenButton = button;
    };

    SMDUIChart.prototype.createExportDropdown = function () {
        let container = this.controlRightDiv;
        let dropdown = sui.dropdown();
        container.appendChild(dropdown);
        dropdown.text = 'Export';
        dropdown.items = [{name: 'JSON', cb: function () {
                    this.chart.exporting.export("json");
                }.bind(this)},
            {name: 'XLSX', cb: function () {
                    this.chart.exporting.export("xlsx");
                }.bind(this)},
            {name: 'PDF', cb: function () {
                    this.chart.exporting.export("pdf");
                }.bind(this)},
            {name: 'PNG', cb: function () {
                    this.chart.exporting.export("png");
                }.bind(this)},
            {name: 'SVG', cb: function () {
                    this.chart.exporting.export("svg");
                }.bind(this)},
            {name: 'Print', cb: function () {
                    this.chart.exporting.export("print");
                }.bind(this)}
        ];

        this.exportDropdownBtn = dropdown;
    };

    SMDUIChart.prototype.toggleFullscreen = function () {
        let onExitFullscreen = function () {
            this.fullscreenButton.text = `<i class = "fas fa-expand"></i>`;
            document.querySelector('.smdui-chart-container').style.display = '';
            document.querySelector('.smdui-chart-container').style.flexDirection = '';
            document.querySelector('.smdui-chart-charContainer').style.height = '500px';
        }.bind(this);

        if (!document.fullscreenElement) {

            hh.openFullscreen(this.wraper);
            document.querySelector('.smdui-chart-container').style.display = 'flex';
            document.querySelector('.smdui-chart-container').style.flexDirection = 'column';
//            document.querySelector('.smdui-chart-container').style.flex = 1;
            document.querySelector('.smdui-chart-container').style.width = '100%';
            this.wraper.style.height = '100%';
            this.wraper.style.display = 'flex';
            document.querySelector('.smdui-chart-charContainer').style.height = '100%';
            document.querySelector('.smdui-chart-chartContentWrapper').style.flex = 1;
            this.confCtrl.gen.chartCursor.setValue('None'); //set cursor behaviour to zoomX when fullscreen (cards take too much space for mobile in fullscreen)
            this.fullscreenButton.text = `<i class = "fas fa-compress"></i>`;
            /*To handle the case where the user presses escape, rather than clicking the button again*/
            this.wraper.addEventListener('fullscreenchange', (event) => {
                if (!document.fullscreenElement) {
                    onExitFullscreen();
                    this.confCtrl.gen.chartCursor.setValue('selectX'); //set cursor behaviour to select when out of fullscreen.
                }
            });
        } else {
            hh.closeFullscreen();
            onExitFullscreen();
            this.confCtrl.gen.chartCursor.setValue('selectX'); //set cursor behaviour to select when out of fullscreen.
        }
    };

    SMDUIChart.prototype.toggleSettings = function () {
        if (this.settingsDiv.dataset.visible) {
            this.settingsDiv.dataset.visible = '';
            $(this.settingsDiv).hide();
        } else {
            this.settingsDiv.dataset.visible = '1';
            $(this.settingsDiv).show();
        }
    };

    SMDUIChart.prototype.getSetting = function (setName, setGroup, defValue) {
        let setTemplateName = this.confTemplate;

        if (this.conf[setTemplateName] === undefined) {
            if (this.chartDefConfig) {
                this.conf[setTemplateName] = clone(this.chartDefConfig);
            } else {
                this.conf[setTemplateName] = {};
            }

            this.conf[setTemplateName].confName = setTemplateName;
            this.conf[setTemplateName].confNameLabel = this.conf[setTemplateName].confNameLabel || setTemplateName;
        }
        let confFromTemplate = this.conf[setTemplateName];
        //create group if does not exist
        let group = confFromTemplate[setGroup] = confFromTemplate[setGroup] || {};
        group[setName] = group[setName] || defValue || null; //create null value if does not exist
        return group[setName];
    };

    SMDUIChart.prototype.onTemplateSeriesSettingChange = function () {
        let setTemplateName = this.confTemplate || 'default';

        for (var seriesName in this.serConf) {

            let serCObj = this.serConf[seriesName] = this.serConf[seriesName] || {};
            let serConfObj = serCObj[setTemplateName] = serCObj[setTemplateName] || {};

            //Use specific default settings if they exist
            if (this.seriesSpecificConfig && this.seriesSpecificConfig[seriesName]) {
                for (var confItemName in this.seriesSpecificConfig[seriesName]) {
                    if (!this.serConf[seriesName][setTemplateName][confItemName] && (Object.keys(this.seriesSpecificConfig[seriesName]).length !== 0) && this.seriesSpecificConfig[seriesName][confItemName]) {
                        this.serConf[seriesName][setTemplateName][confItemName] = this.seriesSpecificConfig[seriesName][confItemName];
                    }
                }
            }

            for (var confItemName in serConfObj) {
                let itemValue = serConfObj[confItemName];
                let itemCtrl = this.confCtrlSeries[seriesName][confItemName];
                if (itemCtrl && typeof (itemCtrl.onChangeCb) === 'function' && typeof (itemCtrl.setValue) === 'function') {
                    itemCtrl.setValue(itemValue);
                    itemCtrl.onChangeCb();
                }
            }
        }
//        this.chart.feedLegend(); //updates legend when settings are changed
        this.chart.legend.mustReorder = true;
        this.reorderSeries(true);
//        this.chart.legend.dispatchImmediately('reorder');
    };

    SMDUIChart.prototype.onTemplateSettingChange = function () {
        let setTemplate = this.confTemplate;
        let confFromTemplate = this.conf[setTemplate] || (this.conf[setTemplate] = this.conf[setTemplate] || {});


        for (var groupName in confFromTemplate) {
            let group = confFromTemplate[groupName];
            let grouCtrl = this.confCtrl[groupName];
            if (grouCtrl) {
                for (var itemName in group) {
                    let itemValue = group[itemName];
                    let itemCtrl = grouCtrl[itemName];
                    if (itemCtrl && typeof (itemCtrl.onChangeCb) === 'function' && typeof (itemCtrl.setValue) === 'function') {
                        itemCtrl.setValue(itemValue);
                        itemCtrl.onChangeCb();
                    }
                }
            }
        }

//        this.onTemplateSeriesSettingChange();
        this.onTemplateYAxisSettingChange();
        if (this.confTemplate === 'default') {
            this.confCtrl.tool.deleteCurrentSettingsTemplate.hide();
        } else {
            this.confCtrl.tool.deleteCurrentSettingsTemplate.show();
        }

        let settingsCount = 0;
        for (var templateName in this.conf) {
            let template = this.conf[templateName];
            if (typeof (template) === 'object' && typeof (template.confNameLabel) === 'string') {
                settingsCount++;
            }
        }

        if (settingsCount <= (1)) {
            this.templSelector.hide();
            this.confCtrl.tool.editCurrentTemplateText.hide();
        } else {
            this.templSelector.show();
            this.confCtrl.tool.editCurrentTemplateText.show();
            this.confCtrl.tool.editCurrentTemplateText.setValue(this.conf[this.confTemplate].confNameLabel);
        }
        mu.execCallback(this.onTemplateChangeCbArr, this);
        //Validate after template is changed
        this.chart.validateData();
    };

    SMDUIChart.prototype.onSettingChange = function (args, value) {
//         args: {setName: setName, setGroup: 'gen'},
        if (typeof (args) === 'object' && args.confName !== undefined && args.confGroup !== undefined) {

            let setTemplate = this.confTemplate;
            let confFromTemplate = this.conf[setTemplate] || (this.conf[setTemplate] = this.conf[setTemplate] || {});
            let group = confFromTemplate[args.confGroup] = confFromTemplate[args.confGroup] || {};

            if (group && group[args.confName] !== undefined) {
                group[args.confName] = value;
            } else {
                console.warn('look here');
            }

            this.confChangeDetected = _.isEqual(this.conf, this.confOrig);

            return  value;

        } else {
            console.warn('SMDUIChart.prototype.onSettingChange() Call with invalid arguments');
        }

    };

    SMDUIChart.prototype.updateSettingsTemplateControl = function (forceUpdate) {
        this.confTemplate = this.confTemplate || 'default';

        let itemArr = [];
        for (var templateName in this.conf) {
            let template = this.conf[templateName];

            if (typeof (template) === 'object' && typeof (template.confNameLabel) === 'string') {
                itemArr.push({
                    value: template.confName || templateName,
                    label: template.confNameLabel || templateName
                });
            }
        }

        if (!this.templSelector) {
            this.templSelector = new SMDUIDropDown(this.controlRightDiv, {
                val: this.confTemplate,
                options: itemArr,
                containerClass: 'smdui-chart-control-templateMenu',
                onValueChange: function (val, args) {
                    this.confTemplate = val;

                    this.onTemplateSettingChange();
                    this.onTemplateSeriesSettingChange();
                }.bind(this)
            });
        }

        let loadedItem = this.templSelector.getItemArr();

        if (!_.isEqual(loadedItem, itemArr && !forceUpdate)) {
            this.templSelector.reloadItem(itemArr, this.confTemplate);
        }
        this.onTemplateSettingChange(itemArr.length);
    };

    SMDUIChart.prototype.initSettings = function () {
        this.settingsControl = this.settingsControl || {};
        this.confCtrl.gen = this.confCtrl.gen || {};
        this.confCtrl.tool = this.confCtrl.tool || {};
        this.confCtrl.legend = this.confCtrl.legend || {};
        this.confCtrl.series = this.confCtrl.series || {};
        this.confCtrl.xAxes = this.confCtrl.xAxes || {};
        this.confCtrl.yAxes = this.confCtrl.yAxes || {};

        this.settingsTabPanel = new TabPanel(this.settingsDiv, {
            initSelect: 'series',
            menuItem: [
                {
                    label: "General",
                    id: 'gen',
                    contentClass: 'smdui-tabPanel-contentFlexRow'
                },
                {
                    label: "Series",
                    id: 'series'
                },
                {
                    label: "X-Axes",
                    id: 'xAxes'
                },
                {
                    label: "Y-Axes",
                    id: 'yAxes'
                },
                {
                    label: "Legend",
                    id: 'legend',
                    contentClass: 'smdui-tabPanel-contentFlexRow'
                },
                {
                    label: "Tools",
                    id: 'tool',
                    contentClass: 'smdui-tabPanel-contentFlexRow'
                }
            ],
            onTabChange: function (tabName, content) {
//                console.log(tabName, content);
            },
            onInitComplete: function (tabPanel) {
                //add save button in tab menu on the left side
                let saveArrow = hh.button(tabPanel.getMenuPannel(), {faIcon: 'save'});
                saveArrow.classList.add('chCtrl-datePicker-icon');
                saveArrow.classList.add('smdui-tabPanel-menuElFloating');

                saveArrow.onclick = function () {
                    let serConfProps = Object.keys(this.serConf);
                    let callback = serConfProps.length > 0 ? 'cm.addErrorMessage' : 'cm.displayFinalMessage';

                    cm.initErrorMessages();
                    if (this.flags.uniqueSettingsActive === true) {
                        cm.saveChartConf(this.name, this.conf, true);
                        cm.saveChartConf(this.name, this.confDefCopy, false, callback);
                    } else {
                        cm.saveChartConf(this.name, this.conf, false, callback);
                    }

                    for (var seriesName in this.serConf) {
                        if (serConfProps[serConfProps.length - 1] === seriesName)
                            cm.saveChartSeriesConf(this.name, clone(this.serConf[seriesName]), seriesName, this.flags.uniqueSettingsActive === true, 'cm.displayFinalMessage');
                        else
                            cm.saveChartSeriesConf(this.name, clone(this.serConf[seriesName]), seriesName, this.flags.uniqueSettingsActive === true);
                    }
                }.bind(this);

                this.confCtrl.gen.tab = tabPanel.getItemContent('gen');
                this.confCtrl.series.tab = tabPanel.getItemContent('series');
                this.confCtrl.xAxes.tab = tabPanel.getItemContent('xAxes');
                this.confCtrl.yAxes.tab = tabPanel.getItemContent('yAxes');
                this.confCtrl.legend.tab = tabPanel.getItemContent('legend');
                this.confCtrl.tool.tab = tabPanel.getItemContent('tool');

                this.settingsTabPanelSeries = new TabPanel(this.confCtrl.series.tab, {
                    sortable: true,
                    sortableOptions: {
                        onTabDragEnd: this.reorderSeries.bind(this)
                    },

                    menuItem: []
                });

                this.settingsTabPanelYAxes = new TabPanel(this.confCtrl.yAxes.tab, {
                    menuItem: []
                });

                this.settingsTabPanelXAxes = new TabPanel(this.confCtrl.xAxes.tab, {
                    menuItem: []
                });

                let setName = 'showAdvancedSettings';
                this.confCtrl.gen.showAdvancedSettings = new SettingPanel(this.confCtrl.gen.tab, {
                    title: 'Show Advanced Settings',
                    toolTip: 'Display advanced settings in this chart settings control.',
                    val: this.getSetting(setName, 'gen'),
                    args: {confName: setName, confGroup: 'gen'},
                    type: 'switch',
                    typeStyle: 'sliderRound',
                    onChange: function (val, args) {
                        this.onSettingChange(args, val);
                        if (val) {
                            this.settingsTabPanel.showTab('tooltip');

                        } else {
                            this.settingsTabPanel.hideTab('tooltip');
                        }
                    }.bind(this)
                });




                setName = 'chartCursor';
                this.confCtrl.gen[setName] = new SettingPanel(this.confCtrl.gen.tab, {
                    title: 'Cursor',
                    toolTip: 'Set Cursor Behaviour',
                    type: 'dropDown',
                    args: {confName: setName, confGroup: 'gen'},
                    dropDownConf: {
                        val: this.getSetting(setName, 'gen', 'zoomX'),
                        options: [
                            {label: 'None', value: 'none'},
                            {label: 'Zoom X', value: 'zoomX'},
                            {label: 'Zoom Y', value: 'zoomY'},
                            {label: 'Zoom XY', value: 'zoomXY'},
                            {label: 'Pan X', value: 'panX'},
                            {label: 'Pan Y', value: 'panY'},
                            {label: 'Pan XY', value: 'panXY'},
                            {label: 'Select X', value: 'selectX'},
                            {label: 'Select Y', value: 'selectY'},
                            {label: 'Select XY', value: 'selectXY'},
                            {label: 'Bottom', value: 'bottom'}
                        ]
                    },
                    onChange: function (val, args) {
                        this.onSettingChange(args, val);
                        if (!this.chart.cursor) {
                            this.chart.cursor = new am4charts.XYCursor();
                        }
                        this.chart.cursor.behavior = val;
                    }.bind(this)
                });


                setName = 'horizontalScroll';
                this.confCtrl.gen.horizontalScroll = new SettingPanel(this.confCtrl.gen.tab, {
                    title: 'Horizontal Zoom',
                    toolTip: 'Type of the horizontal Zoom of the Chart',
                    type: 'dropDown',
                    args: {confName: setName, confGroup: 'gen', seriesType: "LineSeries"},
                    dropDownConf: {
                        val: this.getSetting(setName, 'gen'),
                        options: [
                            {label: 'None', value: 'none'},
                            {label: 'Simple Scroll', value: 'simple'},
                            {label: 'Scroll with Chart', value: 'microChart'}
                        ]
                    },
                    onChange: function (val, args) {
                        this.onSettingChange(args, val);
                        if (val === 'microChart') {
                            this.chart.scrollbarX = new am4charts.XYChartScrollbar();
                            this.updateMicroChart();
                        } else if (val === 'simple') {
                            this.chart.scrollbarX = new am4core.Scrollbar();
                            this.chart.scrollbarX.parent = this.chart.topAxesContainer;
                        } else {
                            this.chart.scrollbarX = null;
                        }
                    }.bind(this)
                });



                //======================================================
                //====================== LEGEND ======================== 
                //======================================================

                setName = 'showLegend';
                this.confCtrl.legend.showLegend = new SettingPanel(this.confCtrl.legend.tab, {
                    title: 'Show Legend',
                    toolTip: 'Choose legend location',
                    type: 'dropDown',
                    args: {confName: setName, confGroup: 'legend'},
                    dropDownConf: {
                        val: this.getSetting(setName, 'legend', 'bottom'),
                        options: [
                            {label: 'None', value: 'none'},
                            {label: 'Top', value: 'top'},
                            {label: 'Bottom', value: 'bottom'},
                        ]
                    },
                    onChange: function (val, args) {
                        this.onSettingChange(args, val);

                        if (!this.chart.legend) {
                            this.chart.legend = new am4charts.Legend();
                            this.chart.legend.parent = this.legendContainer;
                            this.chart.legend.labels.template.textDecoration = "none";
                            this.chart.legend.valueLabels.template.textDecoration = "none";

                            var as = this.chart.legend.labels.template.states.getKey("active");
                            as.properties.textDecoration = "line-through";
                            as.properties.fill = am4core.color("#000");

                            var as2 = this.chart.legend.valueLabels.template.states.getKey("active");
                            as2.properties.textDecoration = "line-through";
                            as2.properties.fill = am4core.color("#000");
                        }

                        switch (val) {
                            case 'none':
                                {
                                    this.chart.legend.hide();
                                    this.legendContainerDiv.style.display = 'none';
                                }
                                break;
                            case 'bottom':
                                {
                                    this.legendContainerDiv.style.display = 'block';
                                    this.chartContentDiv.style.flexDirection = 'column';
                                    this.chart.legend.position = val;
                                    this.chart.legend.show();
                                }
                                this.chart.legend.break;
                                break;
                            case 'top':
                                //required on chart init
                                {
                                    this.legendContainerDiv.style.display = 'block';
                                    this.chartContentDiv.style.flexDirection = 'column-reverse';
                                    this.chart.legend.position = val;
                                    this.chart.legend.show();
                                }
                                this.chart.legend.break;
                                break;
                            default :
                            {
                                this.legendContainerDiv.style.display = 'block';
                                this.chartContentDiv.style.flexDirection = 'column';
                                this.chart.legend.position = val;
                                this.chart.legend.show();
                            }
                        }

                        if (this.chart.legend) {
                            let resizeLegend = function (ev) {
                                document.querySelector(".smdui-chart-legendContainer").style.height = this.chart.legend.contentHeight + "px";
                            }.bind(this);

                            this.chart.events.on("datavalidated", resizeLegend);
                            this.chart.events.on("maxsizechanged", resizeLegend);

                            this.chart.legend.events.on("datavalidated", resizeLegend);
                            this.chart.legend.events.on("maxsizechanged", resizeLegend);

                        }
                    }.bind(this)
                });

                setName = 'legendDisplay';
                this.confCtrl.legend.legendDisplay = new SettingPanel(this.confCtrl.legend.tab, {
                    title: 'Display in Legend',
                    toolTip: 'Change information shown in chart legend',
                    type: 'dropDown',
                    args: {confName: setName, confGroup: 'legend'},
                    dropDownConf: {
                        val: this.getSetting(setName, 'legend'),
                        options: [
                            {label: 'Names Only', value: 'names'},
                            {label: 'Average Values', value: 'average'},
                            {label: 'Max Values', value: 'max'},
                            {label: 'Min Values', value: 'min'},
//                            {label: 'Interactive: Change From Start', value: 'change'},
                            {label: 'Interactive: Values', value: 'values'},
                            {label: 'Last Value', value: 'current'}
                        ]
                    },
                    onChange: function (val, args) {
                        // TODOhelp is here https://www.amcharts.com/docs/v4/concepts/legend/
                        this.onSettingChange(args, val);

                        if (this.chart.legend) {
                            switch (val) {
                                case 'names':
                                    {
                                        this.chart.legend.labels.template.text = "{name}";
                                        //this.chart.legend.labelText = "{name}";
                                    }
                                    break;

                                case 'max':
                                    {
                                        this.chart.legend.labels.template.text = "{name}\n[bold]Max: {valueY.high}[/bold]";
                                    }
                                    break;
                                case 'values':
                                    {
                                        this.chart.legend.labels.template.text = "{name}\n[bold]{valueY}[/bold]";
                                    }
                                    break;
                                case 'average':
                                    {
                                        this.chart.legend.labels.template.text = "{name}\n[bold]Average: {valueY.average}[/bold]";
                                    }
                                    break;
                                case 'change':
                                    {
                                        this.chart.legend.labels.template.text = "{name}\n[bold]Change: {valueY.change}[/bold]";
                                    }
                                    break;
                                case 'min':
                                    {
                                        this.chart.legend.labels.template.text = "{name}\n[bold]Min: {valueY.low}[/bold]";
                                    }
                                    break;
                                case 'current':
                                    {
                                        this.chart.legend.labels.template.text = "{name}\n[bold]{valueY.close}";
                                    }
                                    break;
                            }
                            this.chart.legend.validate();
                        }

                    }.bind(this)
                });

//Legend scrollable allows the legend to have a scrollbar when there are many series on the chart. Not sure if it works yet, will have to add more series to check.
                setName = 'legendScrollable';
                this.confCtrl.legend.legendScrollable = new SettingPanel(this.confCtrl.legend.tab, {
                    title: 'Scrollable',
                    toolTip: 'Enable or disable scrollability. Enable only if the chart contains a large amount of series.',
                    type: 'dropDown',
                    args: {confName: setName, confGroup: 'legend'},
                    dropDownConf: {
                        val: this.getSetting(setName, 'legend', 'disabled'),
                        options: [
                            {label: 'Disabled', value: 'disabled'},
                            {label: 'Enabled', value: 'enabled'}
                        ]
                    },
                    onChange: function (val, args) {
                        this.onSettingChange(args, val);


                        switch (val) {

                            case 'disabled':
                                {
                                    this.chart.legend.scrollable = false;
                                }
                                break;

                            case 'enabled':
                                {
                                    if (this.chart.legend.position === 'bottom' || this.chart.legend.position === 'top')
                                    {
                                        this.chart.legend.maxHeight = 150;
                                    }

                                    this.chart.legend.scrollable = true;
                                }
                                break;
                        }
                    }.bind(this)
                });
                //template settings here
                if (this.transferConfigCharts.length > 0) {
                    this.confCtrl.tool.transferSettings = new SettingPanel(this.confCtrl.tool.tab, {
                        title: 'Transfer Config',
                        toolTip: "Copy this chart's settings to anther chart",
                        type: 'dropDownButton',
//                    args: {confName: setName, confGroup: 'legend'},
                        dropDownConf: {
                            items: this.transferConfigCharts,
                            text: "Transfer To..."
                        },

                    });
                }

                this.confCtrl.tool.useLoggerUniqueSettingsSwitch = new SettingPanel(this.confCtrl.tool.tab, {
                    title: 'Use Logger Specific Settings',
                    toolTip: 'Enable if you have more than one logger, and want to apply different settings to this specific logger.',
                    val: this.flags.uniqueSettingsActive,
                    args: {confName: setName, confGroup: 'tool'},
                    type: 'switch',
                    typeStyle: 'sliderRound',
                    onChange: function (val, args) {
                        this.switchChartSettings(val);
                    }.bind(this)
                });

                this.confCtrl.tool.addNewSettingsTemplate = new SettingPanel(this.confCtrl.tool.tab, {
                    title: 'Create New Settings Template',
                    toolTip: 'Create new set of Settings for this graph. Allow you to change between templates in 1 click.',
                    label: 'Create',
                    type: 'button',
                    onChange: function () {
                        let existingTemplatesArr = Object.keys(this.conf);
                        let idx = 1;
                        let oldTemplateCopy = clone(this.conf[this.confTemplate]);
                        while (true) {
                            let templateName = 'Settings-' + idx;
                            if (existingTemplatesArr.indexOf(templateName) === -1) {
                                this.confTemplate = templateName;

                                break;
                            } else {
                                idx++;
                            }
                        }

                        this.conf[this.confTemplate] = oldTemplateCopy || clone(this.chartDefConfig) || {};
                        this.conf[this.confTemplate].confName = this.confTemplate;
                        this.conf[this.confTemplate].confNameLabel = this.confTemplate;
                        this.updateSettingsTemplateControl();

                    }.bind(this)
                });

                this.confCtrl.tool.deleteCurrentSettingsTemplate = new SettingPanel(this.confCtrl.tool.tab, {
                    title: 'Delete Current Template',
                    toolTip: 'Deletes this template.',
                    label: 'Delete',
                    type: 'button',
                    onChange: function () {
                        if (this.confTemplate === 'default') {
                            console.warn('Not allowed operation Deleting default Conf Template');
                            return;
                        }
                        delete this.conf[this.confTemplate];
                        this.confTemplate = 'default';


                        this.updateSettingsTemplateControl();
                    }.bind(this)
                });

                this.confCtrl.tool.editCurrentTemplateText = new SettingPanel(this.confCtrl.tool.tab, {
                    title: 'Setting Template Name',
                    toolTip: 'Change the name appearance in the setting template dropdown menu',
                    type: 'inputText',
                    inputHiddenConf: {
                        val: this.conf[this.confTemplate].confNameLabel,
                        hideOnChange: true,
                        inputWidth: '75px'
                    },
                    onChange: function (val) {
                        this.conf[this.confTemplate].confNameLabel = val;
                        this.updateSettingsTemplateControl();
                    }.bind(this)
                });

//                this.confCtrl.tool.copyTemplateToUser = new SettingPanel(this.confCtrl.tool.tab, {
//                    title: 'Copy Template to User',
//                    toolTip: 'Send these settings to another user',
//                    label: 'Copy',
//                    type: 'button',
//                    onChange: function () {
//                        copyChartConfigToUser();
//                    }.bind(this)
//                });

                this.confCtrl.tool.export = new SettingPanel(this.confCtrl.tool.tab, {
                    title: 'Export Chart Data',
                    toolTip: "Downloads the chart data in the chosen format.",
                    type: 'dropDownButton',
                    dropDownConf: {
                        items: [{name: 'JSON', cb: function () {
                                    this.chart.exporting.export("json");
                                }.bind(this)},
                            {name: 'XLSX', cb: function () {
                                    this.chart.exporting.export("xlsx");
                                }.bind(this)},
                            {name: 'PDF', cb: function () {
                                    this.chart.exporting.export("pdf");
                                }.bind(this)},
                            {name: 'PNG', cb: function () {
                                    this.chart.exporting.export("png");
                                }.bind(this)},
                            {name: 'SVG', cb: function () {
                                    this.chart.exporting.export("svg");
                                }.bind(this)},
                            {name: 'Print', cb: function () {
                                    this.chart.exporting.export("print");
                                }.bind(this)}
                        ],
                        text: "Export"
                    }

                });

                this.confCtrl.tool.fullscreenSet = new SettingPanel(this.confCtrl.tool.tab, {
                    title: 'Fullscreen',
                    toolTip: '',
                    label: '...',
                    type: 'button',
                    onChange: function () {
                        this.toggleFullscreen();
                    }.bind(this)
                });
            }.bind(this)


        });

        // Settings.hide For test only to keep settings tab open
//        this.settingsDiv.dataset.visible = '1';
//        $(this.settingsDiv).show();

    };

    SMDUIChart.prototype.init = function () {
        if (this.flags.initComplete === false) {

            this.container = document.createElement('div');
            this.wraper.appendChild(this.container);
            this.container.classList.add('smdui-chart-container');


            this.controlDiv = document.createElement('div');
            this.controlDiv.classList.add('smdui-chart-control');
            this.container.appendChild(this.controlDiv);

            this.controlLeftDiv = document.createElement('div');
            this.controlLeftDiv.classList.add('smdui-chart-controlLeft');
            this.controlDiv.appendChild(this.controlLeftDiv);

            this.controlRightDiv = document.createElement('div');
            this.controlRightDiv.classList.add('smdui-chart-controlRight');
            this.controlDiv.appendChild(this.controlRightDiv);


            this.settingsDiv = document.createElement('div');
            this.settingsDiv.style.setProperty('display', 'none');
            this.settingsDiv.classList.add('smdui-chart-settings');
            this.container.appendChild(this.settingsDiv);


            this.chartContentDiv = document.createElement('div');
            this.chartContentDiv.classList.add('smdui-chart-chartContentWrapper');
            this.chartContentDiv.style.setProperty('display', 'flex');
            this.chartContentDiv.style.setProperty('flex-direction', 'column');
            this.container.appendChild(this.chartContentDiv);

            this.chartDiv = document.createElement('div');
            this.chartDiv.classList.add('smdui-chart-charContainer');
            this.chartDiv.style.setProperty('width', '100%');
            this.chartDiv.style.setProperty('height', '500px');
            this.chartContentDiv.appendChild(this.chartDiv);

            this.legendContainerDiv = document.createElement('div');
            this.legendContainerDiv.classList.add('smdui-chart-legendContainer');
            this.chartContentDiv.appendChild(this.legendContainerDiv);

            this.bottomContainer = document.createElement('div');
            this.bottomContainer.classList.add('smdui-chart-bottomContainer');
            this.bottomContainer.style.setProperty('width', '100%');
            this.bottomContainer.style.setProperty('height', 'auto');
            this.container.appendChild(this.bottomContainer);

            //load everithing else

            this.initSettings();
            this.initChart();

            this.updateSettingsTemplateControl();
            this.onTemplateSettingChange();

            this.flags.initComplete = true;
            if (typeof (this.initComplCb) === 'function') {
                this.initComplCb(this);
            }

            this.applyResponsiveUI();
            this.onMobileAdapt();

        }
    };

    SMDUIChart.prototype.showLoadingIndicator = function (label, hideHourglass) {
        if (!this.chart.loadingIndicator) {
            this.createLoadingIndicator();
        }
        this.chart.loadingIndicator.indicatorLabel.text = label || "Loading..";
        this.hideLoadingIndicator();

        this.chart.loadingIndicator.indicatorEl.hide(0);
        this.chart.loadingIndicator.indicatorEl.show();

        if (hideHourglass) {
            this.chart.loadingIndicator.indicatorIcon.hide();
        } else {

            clearInterval(this.chart.loadingIndicator.indicatorInterval);
            this.chart.loadingIndicator.indicatorInterval = setInterval(function () {
                this.chart.loadingIndicator.indicatorIcon.animate([{
                        from: 0,
                        to: 360,
                        property: "rotation"
                    }], 2000);
            }.bind(this), 3000);
        }

    };

    SMDUIChart.prototype.hideLoadingIndicator = function () {
        if (!this.chart.loadingIndicator) {
            this.createLoadingIndicator();
        }
        this.chart.loadingIndicator.indicatorEl.hide();
        clearInterval(this.chart.loadingIndicator.indicatorInterval);
    };


    SMDUIChart.prototype.createLoadingIndicator = function () {
        if (!this.chart.loadingIndicator) {
            this.chart.loadingIndicator = {};

            this.chart.preloader.disabled = true;

            let indicator = this.chart.tooltipContainer.createChild(am4core.Container);
            indicator.background.fill = am4core.color("#fff");
            indicator.background.fillOpacity = 0.8;
            indicator.width = am4core.percent(100);
            indicator.height = am4core.percent(100);
            this.chart.loadingIndicator.indicatorEl = indicator;

            let indicatorLabel = indicator.createChild(am4core.Label);
            indicatorLabel.text = "Loading stuff...";
            indicatorLabel.align = "center";
            indicatorLabel.valign = "middle";
            indicatorLabel.fontSize = 20;
            indicatorLabel.dy = 50;
            this.chart.loadingIndicator.indicatorLabel = indicatorLabel;

            let hourglass = indicator.createChild(am4core.Image);
            hourglass.href = mu.getContextPath() + "/defaultImages/icon/hourglass.svg";
            hourglass.align = "center";
            hourglass.valign = "middle";
            hourglass.horizontalCenter = "middle";
            hourglass.verticalCenter = "middle";
            hourglass.scale = 0.7;
            this.chart.loadingIndicator.indicatorIcon = hourglass;
        }
    };

    SMDUIChart.prototype.applyResponsiveUI = function () {

        //////////////////////////////
        //////Responsive Stuff////////

        this.chart.responsive.enabled = true;
        this.chart.responsive.useDefault = false;

//https://www.amcharts.com/docs/v4/concepts/responsive/#List_of_default_rules
        this.chart.responsive.rules.push({
            relevant: function (target) {
                if (target.pixelWidth <= 1000) {
                    return true;
                }

                return false;
            },
            state: function (target, stateId) {

                if (target instanceof am4charts.Chart) {
                    var state = target.states.create(stateId);
                    state.properties.paddingTop = 0;
                    state.properties.paddingRight = 0;
                    state.properties.paddingBottom = 0;
                    state.properties.paddingLeft = 0;
                    return state;
                }

                if (target instanceof am4core.Scrollbar) {
                    var state = target.states.create(stateId);
                    state.properties.marginBottom = -10;
                    return state;
                }

                if (target instanceof am4charts.Legend) {
                    var state = target.states.create(stateId);
                    state.properties.paddingTop = 0;
                    state.properties.paddingRight = 0;
                    state.properties.paddingBottom = 0;
                    state.properties.paddingLeft = 0;
                    state.properties.marginLeft = 0;
                    return state;
                }

                if (target instanceof am4charts.AxisRendererY) {
                    var state = target.states.create(stateId);
                    state.properties.inside = true;
                    state.properties.maxLabelPosition = 0.99;
                    state.properties.minLabelPosition = 0.01;
                    state.properties.minGridDistance = 60;
                    return state;
                }

                if (target instanceof am4charts.AxisRendererX) {

                    var state = target.states.create(stateId);
                    state.properties.inside = true;
                    state.properties.maxLabelPosition = 0.99;
                    state.properties.minLabelPosition = 0.01;
                    state.properties.minGridDistance = 70;

                    var labelState = target.labels.template.states.create(stateId);
                    labelState.properties.rotation = -90;
                    labelState.properties.verticalCenter = 'middle';
                    labelState.properties.horizontalCenter = 'left';
                    return state; //labelState is inside state, therefore also gets returned. 
                }

                /* if ((target instanceof am4charts.AxisLabel) && (target.parent instanceof am4charts.AxisRendererX)) {
                 //this part only applies after resizing the screen, for some reason...
                 console.log(target);
                 var state = target.states.create(stateId);
                 state.properties.verticalCenter = 'middle';
                 state.properties.horizontalCenter = 'left';
                 state.properties.rotation = -90;
                 target.setStateOnChildren = true;
                 console.log('Here is the problem');
                 
                 return state;
                 }*/

                if ((target instanceof am4charts.AxisLabel) && (target.parent instanceof am4charts.AxisRendererY)) {
                    var state = target.states.create(stateId);
                    state.properties.dy = 0;
                    state.properties.paddingTop = 3;
                    state.properties.paddingRight = 5;
                    state.properties.paddingBottom = 3;
                    state.properties.paddingLeft = 5;

                    // Create a separate state for background
                    target.setStateOnChildren = true;
                    var bgstate = target.background.states.create(stateId);
                    //bgstate.properties.fill = am4core.color("#fff");
                    bgstate.properties.fillOpacity = 0.7;

                    return state;
                }

                // if ((target instanceof am4core.Rectangle) && (target.parent instanceof am4charts.AxisLabel) && (target.parent.parent instanceof am4charts.AxisRendererY)) { 
                //   var state = target.states.create(stateId);
                //   state.properties.fill = am4core.color("#f00");
                //   state.properties.fillOpacity = 0.5;
                //   return state;
                // }
                return null;
            }
        });
    };

    SMDUIChart.prototype.updateMicroChart = function () {
        if (!this.chart.scrollbarX || !(this.chart.scrollbarX instanceof am4charts.XYChartScrollbar)) {
            return;
        }
        this.chart.scrollbarX.series.clear();
        for (let i = 0; i < this.chart.series.values.length; i++) {
            this.chart.scrollbarX.series.push(this.chart.series.values[i]);
        }
        // A delay is required in order to set proper top and bottom margings for the percentage values
        setTimeout(() => {
            if (this.chart.scrollbarX !== null) {
                for (let i = 0; i < this.chart.scrollbarX.scrollbarChart.yAxes.values.length; i++) {
                    let value = this.chart.scrollbarX.scrollbarChart.yAxes.values[i];
                    if (value && value.min > 0 && value.max < 100) {
                        value.min = 0;
                        value.max = 100;
                    }
                }
            }
        }, 200);
    };

    SMDUIChart.prototype.transferChartSettings = function (chartName) {
        for (var seriesName in this.serConf) {
            cm.saveChartSeriesConf(chartName, clone(this.serConf[seriesName]), seriesName, this.flags.uniqueSettingsActive === true, 'cm.displayFinalMessage');
        }
    };
    SMDUIChart.prototype.onMobileAdapt = function (ev) {
        let periodControls = document.querySelectorAll('.period-control');

        if (this.screenWidthQuery.matches) {
            periodControls.forEach((p) => {
                p.style.marginRight = '2px';
            });

            this.confCtrl.tool.fullscreenSet.show();
            this.confCtrl.tool.export.show();
            this.fullscreenButton.style.display = 'none';
            this.exportDropdownBtn.style.display = 'none';
            this.templSelector.container.style.padding = '2px';
            this.wraper.style.padding = '0px';

        } else {

            this.confCtrl.tool.export.hide();
            this.confCtrl.tool.fullscreenSet.hide();
            this.fullscreenButton.style.display = 'block';
            this.exportDropdownBtn.style.display = 'block';
            this.templSelector.container.style.padding = '';

            this.wraper.style.padding = '';

            periodControls.forEach((p) => {
                p.style.marginRight = '';
            });

        }

    };
    
    SMDUIChart.prototype.removeAllSeries = function (val) {
        
    };

    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
})(this);
