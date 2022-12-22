/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by brais, 2019
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 Sout Africa
 *  Phone: 021 555 2181
 *  
 */

/* global am4core, am4themes_animated, am4charts, moment, mainUtils, addLiveData */

function ServerStatus() {
    this.cont = 0;
    this.historyDays = 1;
    this.endDay = new Date();
    this.queriedDates = [];
    this.dataBuff = {};
    this.chart = null;
};

ServerStatus.prototype = {
    IDS: {
        queryDays: 'queryDays',
        historyDays: 'serStatusHistoryDays',
        dataPickerTitle: 'dataPickerTitle',
        dataPickerValue: 'dataPickerValue',
        txNetSpeed: 'a',
        rxNetSpeed: 'b',
        totalUsers: 'c',
        totalLoggers: 'd',
        lastUpdate: 'e'
    },
    init: function (id) {
        id = id || 'chart';
//        am4core.options.minPolylineStep =  10;
//        am4core.useTheme(am4themes_animated);
        // Better approach since we have 2 charts in the same page
        am4core.options.queue = true;
        this.chart = am4core.create(id, am4charts.XYChart);
        this.chart.paddingRight = 20;
        this.chart.data = [];

        // Create X Axes
        var dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.dateFormats.setKey("hour", "HH:mm");
        dateAxis.periodChangeDateFormats.setKey("hour", "[bold]MMM dd");
        dateAxis.renderer.minGridDistance = 100;

        // Creating Left Axis
        let leftAxis = this.createValueAxisYAxes({title: 'Speed', color: '#A0CA92'});
        leftAxis.numberFormatter = new am4core.NumberFormatter();
        leftAxis.numberFormatter.numberFormat = '#.00b';

        // Creating Right Axis
        let rightAxis = this.createValueAxisYAxes({title: 'Total', color: '#3498DB', opposite: true});

        // Creating series
        this.createLineSeries({valueY: this.IDS.txNetSpeed, color: '#3498DB', name: 'Network Tx Traffic', tooltipText: "[bold]{name}:[/] {valueY.formatNumber('#.00b')}/s"});
        this.createLineSeries({valueY: this.IDS.rxNetSpeed, color: '#27AE60', name: 'Network Rx Traffic', tooltipText: "[bold]{name}:[/] {valueY.formatNumber('#.00b')}/s"});
        this.createLineSeries({valueY: this.IDS.totalUsers, color: '#AA00AA', name: 'User Connections', tooltipText: "[bold]{name}:[/] {valueY.formatNumber('#,###')}", yAxis: rightAxis});
        this.createLineSeries({valueY: this.IDS.totalLoggers, color: '#FF7979', name: 'Logger Connections', tooltipText: "[bold]{name}:[/] {valueY.formatNumber('#,###')}", yAxis: rightAxis});

        // Legend
        this.chart.legend = new am4charts.Legend();
        this.chart.cursor = new am4charts.XYCursor();

        // Scrollbar
        this.chart.scrollbarX = new am4core.Scrollbar();

        // Export menu
        this.chart.exporting.menu = new am4core.ExportMenu();
    },
    /**
     * Creating required ValueAxis on the Y axes
     * @param config
     * @returns valueAxis
     */
    createValueAxisYAxes: function (config) {
        if (!config)
            return;

        let title = config.title || '';
        let color = config.color || '#000000';
        let opposite = config.opposite || false;
        let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minGridDistance = 100;
        valueAxis.min = 0;
        valueAxis.title.text = title;
        valueAxis.title.fontWeight = 'bold';
        valueAxis.title.fill = am4core.color(color);
        valueAxis.renderer.labels.template.fill = am4core.color(color);
        valueAxis.renderer.opposite = opposite;
        return valueAxis;
    },
    /**
     * Creating required Line Series
     * @param config
     * @returns lineSeries
     */
    createLineSeries: function (config) {
        if (!config || !config.valueY)
            return;

        let valueY = config.valueY;
        let color = config.color || '#000000';
        let name = config.name || 'Name' + (++this.cont);
        let yAxis = config.yAxis;
        let tooltipText = config.tooltipText || '[bold]{name}:[/] {valueY}';
        let series = this.chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = valueY;
        series.dataFields.dateX = this.IDS.lastUpdate;
        series.stroke = am4core.color(color);
        series.strokeWidth = 2;
//        series.tensionX = 0.8;
        series.name = name;
        series.tooltipText = tooltipText;
        series.tooltip.getFillFromObject = false;
        series.tooltip.background.fill = am4core.color(color);
        if (yAxis)
            series.yAxis = yAxis;
        return series;
    },
    loadData: function (data) {
        if (!data)
            return;
        
        let serverStatus = this;

        for (let i in data) {
            this.dataBuff[i] = data[i]
                .sort(function(a, b) {
                    return a[4] < b[4] ? -1 : a[4] > b[4] ? 1 : 0;
                })
                .map(function (e) {
                    let o = {};
                    o[serverStatus.IDS.txNetSpeed] = e[0];
                    o[serverStatus.IDS.rxNetSpeed] = e[1];
                    o[serverStatus.IDS.totalUsers] = e[2];
                    o[serverStatus.IDS.totalLoggers] = e[3];
                    o[serverStatus.IDS.lastUpdate] = moment(i + ' ' + e[4], 'YYYY-MM-DD HH:mm:ss')._d;
                    return o;
                });
        }
        this.loadDataFromBuffer();
    },
    loadDataFromBuffer: function () {
        let data = [];
        for (let i = 0; i < this.queriedDates.length; i++) {
            data = data.concat(this.dataBuff[this.queriedDates[i]]);
        }
        this.chart.data = data;
        this.updateChartTitle();
    },
    addLiveData: function (data) {
        if (!data)
            return;
        
        let o = {};
        o[this.IDS.txNetSpeed] = data[0];
        o[this.IDS.rxNetSpeed] = data[1];
        o[this.IDS.totalUsers] = data[2];
        o[this.IDS.totalLoggers] = data[3];
        o[this.IDS.lastUpdate] = new Date();

        this.chart.addData(o, 0);
    },
    addDatePicker: function (id) {
        if (!id)
            return;

        let parent = document.getElementById(id);
        let container = document.createElement('div');
        parent.appendChild(container);
        container.classList.add('comparatorComponent');

        // Date Picker Label Title (Range of selected dates)
        let title = document.createElement('span');
        container.appendChild(title);
        title.id = this.IDS.dataPickerTitle;
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
        datePicker.id = this.IDS.dataPickerValue;
        datePicker.setAttribute('type', 'date');
        datePicker.setAttribute('max', moment(date).format('YYYY-MM-DD'));
        datePicker.classList.add('comparatorDataPicker');
        datePicker.valueAsDate = date;
        let serStatus = this;
        datePicker.addEventListener('change', function () {
            serStatus.endDayChange();
        });
        calendarContainer.appendChild(datePicker);
    },
    endDayChange: function () {
        let selected = window.event.currentTarget;
        if (!selected)
            return;

        let selectedDate = selected.valueAsDate;


        if (!selectedDate || moment(selectedDate).format('YYYY-MM-DD') > moment(new Date()).format('YYYY-MM-DD'))
            return;

        if (selected.id !== this.IDS.dataPickerValue)
            return;

        this.endDay = selectedDate;
        this.dayPeriodChange();
    },
    hDaysChange: function () {
        this.historyDays = mainUtils.getInputCompValue(this.IDS.historyDays);
        this.dayPeriodChange();
    },
    dayPeriodChange: function () {
        let dates = [];
        this.queriedDates = [];
        for (let i = 0; i < this.historyDays; i++) {
            let date = moment(this.endDay).subtract(i, 'days').format('YYYY-MM-DD');
            this.queriedDates.unshift(date);
            if (!this.dataBuff[date]) {
                dates.unshift(date);
            }
        }
        if (!dates.length) {
            this.loadDataFromBuffer();
            return;
        }

        loadData([{name: this.IDS.queryDays, value: JSON.stringify(dates)}]);
    },
    updateChartTitle: function () {
        let endDate = moment(this.endDay).format('YYYY-MM-DD');
        if (Number(this.historyDays) === 1) {
            document.getElementById(this.IDS.dataPickerTitle).innerText = 'Server chart (' + endDate + ')';
            return;
        }

        let beginDate = moment(this.endDay).subtract(this.historyDays, 'days').format('YYYY-MM-DD');
        document.getElementById(this.IDS.dataPickerTitle).textContent = 'Server chart (from: ' + beginDate + ' to: ' + endDate + ')';
    }
};

document.addEventListener("DOMContentLoaded", function (event) {
    var serStatusHis = new ServerStatus();
    window.serStatusHis = serStatusHis;
    serStatusHis.init('chartServerStatusHis');
    serStatusHis.addDatePicker('datePicker');
    serStatusHis.dayPeriodChange();

    var serStatusLive = new ServerStatus();
    window.serStatusLive = serStatusLive;
    serStatusLive.init('chartServerStatusLive');
    window.setInterval(addLiveData, 3000);
});
