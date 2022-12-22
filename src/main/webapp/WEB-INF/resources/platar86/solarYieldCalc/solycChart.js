/* global am4core, moment, am4charts, hh */

(function (global) {
    console.log('ChartHandler Initialized');
    if (!global.ch) {
        let ch = {
            charts: [],
            createChart: function (el, name, defaultConfig, initCb, data, type) {
                if (!ch.charts[name]) {
                    ch.charts[name] = new SolYCChartUI(el, name, defaultConfig, initCb, data, type);
                } else {
                    ch.charts[name].updateExistingSeries(data);
                }
            }
        };
        global.ch = ch;
    }

    let SolYCChartUI = function (el, name, defaultConfig, initCb, data, type) {
        this.el = el;
        this.name = name;
        this.defaultConfig = defaultConfig;
        this.initCb = initCb;
        this.data = data;
        this.type = type;
        this.initChart();
        
        this.totalYieldWrapper = hh.div(this.el);
        this.totalYieldDiv = hh.div(this.el);
        this.totalMonthlyYieldDiv = hh.div(this.el);
        this.totalDailyYieldDiv = hh.div(this.el);
        ch.charts[name] = this.chart;
    };

    SolYCChartUI.prototype = {

        initChart: function () {
            console.log('initChart');
            
            let chartdiv = document.createElement('div'); //create chart div
            this.el.appendChild(chartdiv);
            chartdiv.classList.add('solyc-chart-chartContainer');
            chartdiv.style = "height:300px";

            let chartType = 'XYChart';
            this.defaultConfig.data = this.data;

            let chart = am4core.createFromConfig(this.defaultConfig, chartdiv, chartType);
            let title = chart.titles.create();

            switch (this.type) {
                case 'day':
                    title.text = 'Power Profile on ' + moment($('#date').val()).format("DD MMMM YYYY");
                    break;
                case 'year':
                    title.text = 'Energy Profile in ' + moment($('#date').val()).year();
                    break;
            }


            title.fontSize = 25;
            title.marginBottom = 10;
            this.title = title;
            this.chart = chart;

        },

        onChartSettings: function () {


        },

        onAddSeries: function (newData) {

            var series = this.chart.series.push(new am4charts.LineSeries());
            series.strokeWidth = 4;

            switch (this.type) {
                case 'day':
                    series.data = newData;
                    series.dataFields.valueY = "irradiation";
                    series.dataFields.dateX = "hour";
                    series.tooltipText = "{dateX.formatDate('HH:mm')}: [bold]{valueY.formatNumber('###.00')}[/] (kW)";
                    break;
                case 'year':
                    series.data = newData;
                    series.dataFields.valueY = "energy";
                    series.dataFields.dateX = "day";
                    series.tooltipText = "{dateX}: [bold]{valueY.formatNumber('###.00')}[/] (kWh)";
                    break;
            }



            console.log('Series Added');
        },

        updateExistingSeries: function (data) {
            //update data
            this.chart.data = data;

            //update titles
            switch (this.type) {
                case 'day':
                    this.title.text = 'Power Thoughout ' + moment($('#date').val()).format("DD MMMM YYYY");
                    break;
                case 'year':
                    this.title.text = 'Energy Variation Thoughout ' + moment($('#date').val()).year();
                    break;
            }
        }
       
    };
}(window));