/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */


/* global am4charts, am4core, moment, am4themes_animated, hh, sui, mu */

let yearlyTariffPeriods = {
    charts: {},
    chartsData: {},
    selectedCharts: {},
    conf: {},
    isInit: false,
    settingsOpen: false,
    fillMap: {
        peak: 'red',
        standard: 'yellow',
        offPeak: 'green'
    },
    weekdays: {},
    totalCreatedCharts: 0, //counter that keeps track of all periods, incl deleted ones
    totalPeriods: 0, //counter that keeps track of periods
    totalDays: 0,

    init: function () {
        if (!this.isInit) {
            this.parent = document.getElementById('chartTariff');
            let parent = this.parent;
//            parent.style.display = 'grid';
//            parent.style.gridTemplate = 'auto 70%/auto';
//            parent.style.gridTemplateAreas = '"controls""charts"';
//            parent.style.overflowX = 'auto';

            let chartArea = document.createElement('div');
            this.chartArea = chartArea;
//            chartArea.style.display = 'flex';
//            chartArea.style.flexDirection = 'row';
//            chartArea.style.justifyContent = 'space-around';
//            chartArea.style.gridArea = 'charts';
            chartArea.setAttribute('id', 'chartarea');

            let controlArea = document.createElement('div');
            controlArea.style.gridArea = 'controls';
            controlArea.style.margin = '5px';
            parent.appendChild(controlArea);
            this.createControls(controlArea);

            parent.appendChild(chartArea);
            this.onChartDataReceived();

        }
    },

    onChartDataReceived(data) {
        let chartData = {};
        if (Object.keys(chartData).length === 0) {
            chartData.data = yearlyTariffPeriods.createEmptyPeriodTemplate(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
//            chartData.chartName = 'Dbl Click to Change';
        }
        let chart = this.addChart(chartData.data);
        if (chartData.chartName) {
            chart.title.text = chartData.chartName;
        }

        //init settings
        this.isInit = true;
        for (let weekday in this.settingsPanel.weekdays) {
            this.settingsPanel.weekdays[weekday].conf.onChange(false);
        }
    },

    addChart: function (data) {
        if (this.isTotalPeriodInRange(true)) {

            let newChartDiv = document.createElement('div');
            newChartDiv.classList.add('periodchartitem');
            newChartDiv.classList.add('card');
            this.chartArea.appendChild(newChartDiv);
            let chart = createChart(data, newChartDiv);
            chart.title.text = chart.id;

            chart.chartContainer = newChartDiv;
            this.addChartPeriodControl(newChartDiv, chart);
            if (!this.settingsOpen) {
                chart.selectedButton.style.display = 'none';
            }
            this.totalPeriods += 1;
            return chart;
        }
    },
    addChartPeriodControl(chartDiv, chart) {
        let controlWrapper = document.createElement('div');
        let dateRange = {};
        controlWrapper.classList.add('periodcontrols');

//        chart.selectedButton = new SettingPanel(controlWrapper, {
//            title: 'Selected:',
//            val: true,
//            args: {confName: 'selected'},
//            type: 'switch',
//            typeStyle: 'sliderRound',
//            onChange: function (val, args) {
//                this.selectedCharts[chart.id] = val;
//                this.checkOptionAvailable();
//            }.bind(this)
//        });
//        chart.selectedButton.container.style.gridArea = 'periodcontrol';
//        chart.selectedButton.container.style.maxWidth = '120px';

        let chartSelectDiv = document.createElement('div');
//        chartSelectDiv.style.display = 'none';
        chartSelectDiv.innerText = 'Select';
        chartSelectDiv.classList.add('ui-widget-content');
        chartSelectDiv.classList.add('tariffChartSelectButton');
        chart.selectedButton = chartSelectDiv;
        chartDiv.appendChild(chartSelectDiv);
        chartSelectDiv.selected = false;
        chartSelectDiv.onclick = function (ev, val) {
            chartSelectDiv.selected = !chartSelectDiv.selected;
            if (chartSelectDiv.selected === true) {
                chartSelectDiv.classList.add('ui-widget-header');
            } else {
                chartSelectDiv.classList.remove('ui-widget-header');
            }
            if ((val !== null) && (val !== undefined)) {
                this.selectedCharts[chart.id] = val;
            }
            this.selectedCharts[chart.id] = chartSelectDiv.selected;
            this.checkOptionAvailable();
        }.bind(this);


        let startWrapper = document.createElement('div');
        startWrapper.classList.add('ui-selectmanymenu');
        startWrapper.labelSpan = document.createElement('span');
        startWrapper.labelSpan.innerText = 'Period Start: ';
        startWrapper.appendChild(startWrapper.labelSpan);


        if (!this.initialDate) {
            this.initialDate = moment().dayOfYear(1).format('YYYY-MM-DD');
        } else {
            this.initialDate = moment(this.getFinalDate()).add(1, 'days').format('YYYY-MM-DD');
        }

        this.finalDate = moment(this.initialDate).add(this.getNumberOfDaysInYear() - this.totalDays - this.totalCreatedCharts, 'days').format('YYYY-MM-DD');

        let rangeInputStart = document.createElement('input');
        rangeInputStart.classList.add('tariff-datepicker');
        rangeInputStart.classList.add('ui-inputfield');
        rangeInputStart.type = 'date';
        rangeInputStart.value = this.initialDate;
        dateRange.start = rangeInputStart.value;
        rangeInputStart.onchange = function () {
            dateRange.start = rangeInputStart.value;
            this.conf[chart.id].dateRange = dateRange;
            if (!this.isTotalPeriodInRange(true)) {
                rangeInputStart.value = moment(this.getFinalDate()).subtract(this.getNumberOfDaysInYear() - this.totalCreatedCharts, 'days').format('YYYY-MM-DD');
            }
            dateRange.start = rangeInputStart.value;
            chart.dateRange = dateRange;
            this.conf[chart.id].dateRange = dateRange;
            this.checkOptionAvailable();
        }.bind(this);
        startWrapper.appendChild(rangeInputStart);
        chart.dateRange = dateRange;


        let endWrapper = document.createElement('div');
        endWrapper.classList.add('ui-selectmanymenu');
        endWrapper.labelSpan = document.createElement('span');
        endWrapper.labelSpan.innerText = 'Period End: ';
        endWrapper.appendChild(endWrapper.labelSpan);

        controlWrapper.appendChild(startWrapper);


        let rangeInputEnd = document.createElement('input');
        rangeInputEnd.classList.add('tariff-datepicker');
        rangeInputEnd.classList.add('ui-inputfield');
        rangeInputEnd.type = 'date';
        rangeInputEnd.value = this.finalDate;
        dateRange.end = rangeInputEnd.value;
//        this.initialDate = rangeInputEnd.value;
        rangeInputEnd.onchange = function () {
            dateRange.end = rangeInputEnd.value;
            this.conf[chart.id].dateRange = dateRange;
            if (!this.isTotalPeriodInRange(true)) {
                rangeInputEnd.value = moment(chart.dateRange.start).add(this.getNumberOfDaysInYear() - this.totalDays - this.totalCreatedCharts, 'days').format('YYYY-MM-DD');
            }
            dateRange.end = rangeInputEnd.value;
            chart.dateRange = dateRange;
            this.conf[chart.id].dateRange = dateRange;
            this.checkOptionAvailable();
        }.bind(this);
        endWrapper.appendChild(rangeInputEnd);
        chart.dateRange = dateRange;

        this.conf[chart.id].dateRange = dateRange;

        controlWrapper.appendChild(endWrapper);

        chartDiv.appendChild(controlWrapper);
        chart.dateRange = dateRange;
        this.conf[chart.id].dateRange = dateRange;
        this.isTotalPeriodInRange();
        chart.selectedButton.onclick(false);
    },

    isTotalPeriodInRange: function (showMessages) {
        this.totalDays = 0;
        for (let chartId in this.conf) {
            if (this.conf[chartId]) {
                if (this.conf[chartId].dateRange.start && this.conf[chartId].dateRange.end) {
                    let periodLength = (moment.duration(moment(this.conf[chartId].dateRange.end).diff(moment(this.conf[chartId].dateRange.start)))).asDays();
                    if (showMessages) {
                        console.log(chartId + ': ' + periodLength);
                    }
                    if (((this.totalDays + periodLength) < this.getNumberOfDaysInYear() - this.totalCreatedCharts) && periodLength > 0) {
                        this.totalDays += periodLength;
                    } else if (((this.totalDays + periodLength) === this.getNumberOfDaysInYear() - this.totalCreatedCharts) && periodLength > 0) {
                        this.totalDays += periodLength;
                        if (showMessages) {
                            console.warn(this.totalDays + ' max days reached');
                            mu.showInfoMessage('365 days are covered', 'Max Days Reached');
                        }
                        return false;
                    } else {
                        //This happens when moment js tries to find the difference
                        //between the same day. 
                        if (showMessages) {
                            console.warn(chartId + ' out of range');
                            mu.showErrorMessage('Total days should not be more than one year...', 'Out of Bounds');
                        }
                        return false;
                    }
//                    if (!((this.totalDays) < this.getNumberOfDaysInYear() - 1)) {
//                        return false;
//                    }
                } else {
                    console.warn(chartId + ' dateRange incorrect or not saved.');
                }
            } else {
                return false;
                console.warn(chartId + ' No such chart.');
            }
        }
        return true;
    },

    getInitialDate: function () {
        let date;
        let nextDate;
        for (let chartId in this.conf) {
            if (this.conf[chartId]) {
                if (this.conf[chartId].dateRange) {
                    if (this.conf[chartId].dateRange.start) {
                        nextDate = this.conf[chartId].dateRange.start;
                        if (date === undefined) {
                            date = nextDate;
                        } else if (moment(nextDate).isBefore(date)) {
                            date = nextDate;
                        }
                    }
                } else {
                    console.warn(chartId + ' dateRange incorrect or not saved.');
                }
            } else {
                console.warn(chartId + ' No Such Chart');
                return null;
            }
        }
        return date;
    },

    getFinalDate: function () {
        let date;
        let nextDate;
        for (let chartId in this.conf) {
            if (this.conf[chartId]) {
                if (this.conf[chartId].dateRange) {
                    if (this.conf[chartId].dateRange.end) {
                        nextDate = this.conf[chartId].dateRange.end;
                        if (date === undefined) {
                            date = nextDate;
                        } else if (moment(nextDate).isAfter(date)) {
                            date = nextDate;
                        }
                    }
                }
//                else {
//                    console.warn(chartId + ' dateRange incorrect or not saved.');
//                }
            } else {
                console.warn(chartId + ' No Such Chart');
                return null;
            }
        }
        return date;
    },

    createControls: function (controlDiv, daysArr) {
        if (!daysArr) {
            daysArr = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        }


//        settingsButton.onclick();
        buttonControlDiv = document.createElement('div');
        buttonControlDiv.style.display = 'flex';
        buttonControlDiv.style.flexDirection = 'row';
        controlDiv.appendChild(buttonControlDiv);

        let settingsPanel = document.createElement('div');
        settingsPanel.classList.add('tariffSettingPanel');

        settingsPanel.weekdays = {};
        settingsPanel.weekdays.monday = new SettingPanel(settingsPanel, {
            title: 'Monday',
            val: true,
            args: {confName: 'Monday'},
            type: 'switch',
            typeStyle: 'sliderRound',
            onChange: function (val, args) {
                this.weekdays['Monday'] = val;
                this.checkOptionAvailable();
            }.bind(this)
        });
        settingsPanel.weekdays.tuesday = new SettingPanel(settingsPanel, {
            title: 'Tuesday',
            val: true,
            args: {confName: 'Tuesday'},
            type: 'switch',
            typeStyle: 'sliderRound',
            onChange: function (val, args) {
                this.weekdays['Tuesday'] = val;
                this.checkOptionAvailable();
            }.bind(this)
        });
        settingsPanel.weekdays.wednesday = new SettingPanel(settingsPanel, {
            title: 'Wednesday',
            val: true,
            args: {confName: 'Wednesday'},
            type: 'switch',
            typeStyle: 'sliderRound',
            onChange: function (val, args) {
                this.weekdays['Wednesday'] = val;
                this.checkOptionAvailable();
            }.bind(this)
        });
        settingsPanel.weekdays.thursday = new SettingPanel(settingsPanel, {
            title: 'Thursday',
            val: true,
            args: {confName: 'Thursday'},
            type: 'switch',
            typeStyle: 'sliderRound',
            onChange: function (val, args) {
                this.weekdays['Thursday'] = val;
                this.checkOptionAvailable();
            }.bind(this)
        });
        settingsPanel.weekdays.friday = new SettingPanel(settingsPanel, {
            title: 'Friday',
            val: true,
            args: {confName: 'Friday'},
            type: 'switch',
            typeStyle: 'sliderRound',
            onChange: function (val, args) {
                this.weekdays['Friday'] = val;
                this.checkOptionAvailable();
            }.bind(this)
        });
        settingsPanel.weekdays.saturday = new SettingPanel(settingsPanel, {
            title: 'Saturday',
            val: true,
            args: {confName: 'Saturday'},
            type: 'switch',
            typeStyle: 'sliderRound',
            onChange: function (val, args) {
                this.weekdays['Saturday'] = val;
                this.checkOptionAvailable();
            }.bind(this)
        });
        settingsPanel.weekdays.sunday = new SettingPanel(settingsPanel, {
            title: 'Sunday',
            val: true,
            args: {confName: 'Sunday'},
            type: 'switch',
            typeStyle: 'sliderRound',
            onChange: function (val, args) {
                this.weekdays['Sunday'] = val;
                this.checkOptionAvailable();
            }.bind(this)
        });

        this.settingsPanel = settingsPanel;

        let settingsButton = document.createElement('span');
        settingsButton.innerText = 'Enable Settings';
        settingsButton.classList.add('tarrifChart-setting-button');
        buttonControlDiv.appendChild(settingsButton);
        settingsButton.onclick = function () {

            if (this.settingsPanel.style.display === 'none') {
                this.settingsPanel.style.display = 'flex';
                this.settingsOpen = true;
                for (let chartName in this.charts) {
//                    this.charts[chartName].selectedButton.container.style.display = 'flex';
                    this.charts[chartName].selectedButton.style.display = 'flex';
                }
                this.settingsPanel.newPeriodButton.style.display = 'block';
                this.settingsPanel.applyButton.style.display = 'block';
                this.settingsPanel.saveButton.style.display = 'block';
                this.settingsPanel.removeButton.style.display = 'block';
                this.parent.classList.add('settingsOpen');

//                document.querySelectorAll('.periodchartitem').forEach(function (el, idx) {
//                    el.classList.add('settingsOpen')
//                });
                this.checkOptionAvailable();
            } else {
                this.settingsPanel.style.display = 'none';
                this.settingsOpen = false;
                for (let chartName in this.charts) {
                    this.charts[chartName].selectedButton.style.display = 'none';
//                    this.charts[chartName].selectedButton.container.style.display = 'none';
                }
                this.settingsPanel.newPeriodButton.style.display = 'none';
                this.settingsPanel.applyButton.style.display = 'none';
                this.settingsPanel.saveButton.style.display = 'none';
                this.settingsPanel.removeButton.style.display = 'none';
                this.parent.classList.remove('settingsOpen');
//                document.querySelectorAll('.periodchartitem').forEach(function (el, idx) {
//                    el.classList.remove('settingsOpen')
//                });
                this.checkOptionAvailable();
            }
        }.bind(this);

        let newPeriodButton = document.createElement('span');
        newPeriodButton.innerText = 'Add Period';
        newPeriodButton.classList.add('tarrifChart-setting-button');
        newPeriodButton.onclick = function () {
            this.addChart(yearlyTariffPeriods.createEmptyPeriodTemplate(daysArr));
        }.bind(this);
        buttonControlDiv.appendChild(newPeriodButton);
        settingsPanel.newPeriodButton = newPeriodButton;

        let applyButton = document.createElement('span');
        applyButton.classList.add('tarrifChart-setting-button');
        applyButton.innerText = 'Apply';
        applyButton.onclick = this.applyDateGroups.bind(this);
        buttonControlDiv.appendChild(applyButton);
        settingsPanel.applyButton = applyButton;

        let saveButton = document.createElement('span');
        saveButton.classList.add('tarrifChart-setting-button');
        saveButton.innerText = 'Save';
        buttonControlDiv.appendChild(saveButton);
        settingsPanel.saveButton = saveButton;

        let removeButton = document.createElement('span');
        removeButton.classList.add('tarrifChart-setting-button');
        removeButton.innerText = 'Delete';
        removeButton.onclick = this.deleteChart.bind(this);
        buttonControlDiv.appendChild(removeButton);
        settingsPanel.removeButton = removeButton;

        settingsButton.onclick();
        controlDiv.appendChild(settingsPanel);
    },

    checkOptionAvailable: function () {
        if (this.isTotalPeriodInRange(false)) {
            this.settingsPanel.newPeriodButton.classList.remove('tarrifChart-setting-disabled');
        } else {
            this.settingsPanel.newPeriodButton.classList.add('tarrifChart-setting-disabled');
        }

        for (let chart in this.selectedCharts) {
            if (this.selectedCharts[chart] === true) {
                this.settingsPanel.applyButton.classList.remove('tarrifChart-setting-disabled');
                this.settingsPanel.removeButton.classList.remove('tarrifChart-setting-disabled');
                continue;
            } else {
                this.settingsPanel.applyButton.classList.add('tarrifChart-setting-disabled');
                this.settingsPanel.removeButton.classList.add('tarrifChart-setting-disabled');
            }
        }

        document.querySelectorAll('.periodchartitem').forEach(function (el, idx) {
            if (this.settingsOpen) {
                el.classList.add('settingsOpen');
            } else {
                el.classList.remove('settingsOpen');
            }
        }.bind(this));
    },

    applyDateGroups: function () {
        let weekdays = this.weekdays;
        let charts = this.charts;
        let selectedCharts = this.selectedCharts;
        let weekdaysSelected = {};
        let finalArr = [];
        let arrCounter = 0;
        let weekdaysGroup = [];
        for (let weekday in weekdays) {
            if (weekdays[weekday] === true) {
                for (let i = 0; i < Object.keys(weekdays).length; i++) {
                    if (Object.keys(weekdays)[i] === weekday) {
                        weekdaysGroup.push(Object.keys(weekdays)[i]);
                        //Checking if Sunday is selected, in which case it
                        //needs to be explicitly forced into the array.
                        if (i === 6) {
                            if (weekdaysGroup.length > 1) {
                                finalArr.push(weekdaysGroup[0] + '-' + weekdaysGroup[weekdaysGroup.length - 1]);
                            } else {
                                finalArr.push(weekdaysGroup[0]);
                            }
                        }
                    }
                }
            } else {
                //this starts as soon as a non-selected weekday is encountered
                arrCounter += 1;
                weekdaysSelected[arrCounter] = weekdaysGroup.slice(0, weekdaysGroup.length);
                //Create a combined string to represent more than one day
                if (weekdaysSelected[arrCounter].length > 1) {
                    finalArr.push(weekdaysSelected[arrCounter][0] + '-' + weekdaysSelected[arrCounter][weekdaysSelected[arrCounter].length - 1]);
                } else if (weekdaysSelected[arrCounter][0] !== undefined) {
                    finalArr.push(weekdaysSelected[arrCounter][0]);
                }
                //if the weekday is not in the array, it means that it is not
                //selected, so push force push.
                if (!weekdaysSelected[arrCounter].find(element => element === weekday)) {
                    finalArr.push(weekday);
                }
                weekdaysGroup = [];
            }
        }

        for (let chart in selectedCharts) {
            if (selectedCharts[chart] === true) {
                charts[chart].data = yearlyTariffPeriods.createEmptyPeriodTemplate(finalArr);
                this.conf[chart].dateRange = this.charts[chart].dateRange;
                this.conf[chart].data = this.charts[chart].data;
            }
        }
    },

    saveChart: function () {
        for (let chart in this.charts) {
            this.conf[chart].dateRange = this.charts[chart].dateRange;
            this.conf[chart].data = this.charts[chart].data;
            if (this.charts[chart].name) {
                this.conf[chart].chartName = this.charts[chart].name;
            }
        }
    },

    deleteChart: function () {
        for (let chart in this.charts) {
            if (this.selectedCharts[chart] === true) {
                this.charts[chart].dispose();
                this.charts[chart].chartContainer.remove();
                delete this.charts[chart];
                delete this.selectedCharts[chart];
                delete this.chartsData[chart];
                delete this.conf[chart];
                this.isTotalPeriodInRange();
                this.totalPeriods -= 1;
                if (Object.keys(this.charts).length === 0) {
                    this.initialDate = null;
                    this.finalDate = null;
                }
            }
        }
    },

    getFinalDayOfYear: function (date) {
        if (date) {
            if (moment(date).year() % 4 > 0) {
                return moment(date).dayOfYear(365).format('YYYY-MM-DD');
            } else {
                return moment(date).dayOfYear(366).format('YYYY-MM-DD');
            }
        }
        if (moment().year() % 4 > 0) {
            return moment().dayOfYear(365).format('YYYY-MM-DD');
        } else {
            return moment().dayOfYear(366).format('YYYY-MM-DD');
        }
    },

    getNumberOfDaysInYear: function () {
        if (moment().year() % 4 > 0) {
            return 365;
        } else {
            return 366;
        }
    },

    onTimeBlockClicked: function (ev) {
        if (ev.target.dataItem.dataContext.stringValue === 'Off-Peak') {
            ev.target.dataItem.dataContext.stringValue = 'Standard';
        } else if (ev.target.dataItem.dataContext.stringValue === 'Standard') {
            ev.target.dataItem.dataContext.stringValue = 'Peak';
        } else if (ev.target.dataItem.dataContext.stringValue === 'Peak') {
            ev.target.dataItem.dataContext.stringValue = 'Off-Peak';
        }

        ev.target.topParent.children.values[0].validateData();
    },

    getFillColor: function (value) {
        if (value === 'Off-Peak') {
            return yearlyTariffPeriods.fillMap.offPeak;
        } else if (value === 'Standard') {
            return yearlyTariffPeriods.fillMap.standard;
        } else if (value === 'Peak') {
            return yearlyTariffPeriods.fillMap.peak;
        }
    },

    refreshColorMap: function (ev) {
        let chart = ev.target.topParent.children.values[0];
        chart.series.values[0].columns.values.forEach(function (col, idx) {
            col.fill = yearlyTariffPeriods.getFillColor(chart.data[idx].stringValue);
        });
    },

    createEmptyPeriodTemplate: function (daysArr) {
        let arr = [];
        let obj = {};
        if (daysArr) {
            for (let i = 0; i < daysArr.length; i++) {
                obj[daysArr[i]] = {};
                for (let j = 0; j <= 23; j++) {
                    obj[daysArr[i]][j] = {};
                    obj[daysArr[i]][j].weekday = daysArr[i];
                    obj[daysArr[i]][j].hour = j + ':00';
                    obj[daysArr[i]][j].stringValue = 'Off-Peak';
                    arr.push(obj[daysArr[i]][j]);
                }
            }
        }
        return arr.slice(0, arr.length);
    },

    onChartNameDblClick: function (ev, chart, chartDiv) {
        ev.event.preventDefault();
        let dialog = sui.dialog({
            heading: 'Change Name for ' + chart.title.text
        });
        dialog.allowFullscreen = false;
        dialog.wrapper.style.width = 'fit-content';

        let dialogContent = document.createElement('div');

        let textSpan = document.createElement('span');
        textSpan.innerText = 'Enter name: ';

        let input = document.createElement('input');
        input.type = 'text';
        hh.addClass(input, ["ui-inputfield"]);

        dialogContent.appendChild(textSpan);
        dialogContent.appendChild(input);
        dialogContent.style.display = 'flex';
        dialogContent.style.justifyContent = 'center';

        let dialogContentWrapper = document.createElement('div');
        hh.addClass(dialogContent, ['ui-growl-item']);
        dialogContentWrapper.appendChild(dialogContent);

        let confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'Confirm';
        confirmBtn.addEventListener('click', () => {
            const chartName = input.value;
            if (chartName.trim() !== '') {
                yearlyTariffPeriods.charts[chart.id].title.text = chartName;
                yearlyTariffPeriods.charts[chart.id].chartName = chartName;
                yearlyTariffPeriods.conf[chart.id].chartName = chartName;
                dialog.close();
            }
        });
        hh.addClass(confirmBtn, 'ui-button');
        confirmBtn.style.marginBottom = '5px';

        let buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.justifyContent = 'center';
        buttonsContainer.appendChild(confirmBtn);
        dialogContentWrapper.appendChild(buttonsContainer);

        dialog.content = dialogContentWrapper;
        chartDiv.appendChild(dialog);

        dialog.open();
        input.focus();
    }
};





function createChart(data, chartDiv) {
    am4core.useTheme(am4themes_animated);
    let chart = am4core.create(chartDiv, am4charts.RadarChart);
    chart.innerRadius = am4core.percent(30);
    chart.fontSize = 11;

    var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    yAxis.renderer.minGridDistance = 5;
    xAxis.renderer.labels.template.location = 0.5;
    xAxis.renderer.labels.template.bent = true;
    xAxis.renderer.labels.template.radius = 5;
    xAxis.dataFields.category = "hour";
    yAxis.dataFields.category = "weekday";
    xAxis.renderer.grid.template.disabled = true;
    xAxis.renderer.minGridDistance = 10;
    yAxis.renderer.grid.template.disabled = true;
    yAxis.renderer.inversed = true;

    // this makes the y axis labels to be bent. By default y Axis labels are regular AxisLabels, so we replace them with AxisLabelCircular
    // and call fixPosition for them to be bent
    var yAxisLabel = new am4charts.AxisLabelCircular();
    yAxisLabel.bent = true;
    yAxisLabel.element.node.onmouseover = function (ev) {
        ev.target.style.display = 'none';
    };
    yAxisLabel.element.node.onmouseleave = function (ev) {
        ev.target.style.display = 'block';
    };
    yAxisLabel.events.on("validated", function (event) {
        event.target.fixPosition(-90, am4core.math.getDistance({x: event.target.pixelX, y: event.target.pixelY}) - 5);
        event.target.dx = -event.target.pixelX;
        event.target.dy = -event.target.pixelY;
    });
//    yAxisLabel.events.on('over', function (event) {
//    });
//    yAxisLabel.events.on('out', function (event) {
//    });
    yAxis.renderer.labels.template = yAxisLabel;

    var series = chart.series.push(new am4charts.RadarColumnSeries());
    series.dataFields.categoryX = "hour";
    series.dataFields.categoryY = "weekday";
    series.dataFields.value = "value";
    series.sequencedInterpolation = true;
    series.columns.template.events.on("hit", function (ev) {
        yearlyTariffPeriods.onTimeBlockClicked(ev);
    }, this);

    var columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.fill = am4core.color(yearlyTariffPeriods.fillMap.offPeak);
    columnTemplate.stroke = am4core.color("#ffffff");
    columnTemplate.tooltipText = "{weekday}, {hour}: {stringValue}";
    columnTemplate.width = am4core.percent(100);
    columnTemplate.height = am4core.percent(100);
    chart.seriesContainer.zIndex = -5;
    columnTemplate.hiddenState.properties.opacity = 0;

    let periodCount = Object.keys(yearlyTariffPeriods.charts).length;
    chart.id = 'period-' + yearlyTariffPeriods.totalCreatedCharts;
    yearlyTariffPeriods.charts[chart.id] = chart;
    yearlyTariffPeriods.chartsData['period-' + yearlyTariffPeriods.totalCreatedCharts] = data;
    chart.htmlContainer.firstChild.style.gridArea = "chartarea";
    chart.data = data;
    yearlyTariffPeriods.totalCreatedCharts += 1;
    chart.events.on('validated', function (ev) {
        yearlyTariffPeriods.refreshColorMap(ev);
    }, this);

    yearlyTariffPeriods.conf[chart.id] = {};
    yearlyTariffPeriods.conf[chart.id].data = data;

    chart.title = chart.series.values[0].createChild(am4core.Label);
    chart.title.fontSize = 15;
    chart.title.horizontalCenter = "middle";
    chart.title.verticalCenter = "middle";

    chart.title.events.on('doublehit', function (ev) {
        yearlyTariffPeriods.onChartNameDblClick(ev, chart, chartDiv);
    }, this);
    return chart;
}

$(document).ready(function () {
    yearlyTariffPeriods.init();
});