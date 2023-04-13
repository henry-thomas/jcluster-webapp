/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/* global loggerStatUpdate, metricsController, hh, am5themes_Animated, am5flow, am5, am5themes_Kelly */

(function (root) {
    function MetricsController() {
        this.connMetrAccPanels = {};
        this.connMetrCards = {};
        this.connMetrCardFields = {};

        this.servResCards = {};
        this.servResFields = {};
    }

    let prot = MetricsController.prototype;

    prot.init = function () {
        setInterval(loggerStatUpdate, 1000);
    };

    root.metricsController = new MetricsController();


    root.updateMetrics = function (metricsMap) {
//        console.log(metricsMap); 
        let container = document.querySelector('.jcConnTab');
        if (!this.connAcc) {
            this.connAcc = new SMDUIAccordianPanel(container, {
                tabs: []
            });
        }


        let chartData = [];
        for (let serverName in metricsMap) {
            if (!metricsController.connMetrAccPanels[serverName]) {
                metricsController.connMetrAccPanels[serverName] = this.connAcc.addTab({label: serverName});
                metricsController.connMetrAccPanels[serverName].classList.add('actDataContainer');
            }

            let connMetricList = metricsMap[serverName];
            for (let i = 0; i < connMetricList.length; i++) {
                let connMetric = connMetricList[i];
                let accPanel = metricsController.connMetrAccPanels[serverName];

                if (!metricsController.connMetrCards[connMetric['connId']]) {
                    metricsController.connMetrCards[connMetric['connId']] = hh.createActDataPanelCard(connMetric['remoteServerName'], serverName, accPanel);
                    let fields = metricsController.connMetrCardFields[connMetric['connId']] = {};
                    let card = metricsController.connMetrCards[connMetric['connId']];
                    fields['appName'] = hh.adf(card, "App Name");
                    fields['homeServerName'] = hh.adf(card, "Home Server Name");
                    fields['remoteServerName'] = hh.adf(card, "Remote Server Name");
                    fields['connId'] = hh.adf(card, "Connection ID");
                    fields['instanceId'] = hh.adf(card, "JC Instance ID");
                    fields['connType'] = hh.adf(card, "Connection Type");
                    fields['ipAddress'] = hh.adf(card, "IP Address");
                    fields['lastConnAttempt'] = hh.adf(card, "Last Connection Attempt");
                    fields['reqRespMapSize'] = hh.adf(card, "Req/Resp Map Size");
                    fields['rxCount'] = hh.adf(card, "Rx Count");
                    fields['txCount'] = hh.adf(card, "Tx Count");
                    fields['timeoutCount'] = hh.adf(card, "Timeout Count");
                    fields['errCount'] = hh.adf(card, "Error Count");
                }
                let adfFields = metricsController.connMetrCardFields[connMetric['connId']];
                for (let field in connMetric) {
                    adfFields[field].value = connMetric[field];
                    let fieldClass = connMetric['homeServerName'] + '_' + field + '_' + connMetric['connId'];
                    let fieldSpan = document.getElementsByClassName(fieldClass);
                    if (fieldSpan.length > 0) {
                        fieldSpan[0].textContent = connMetric[field];
                    }
                }

                //update chart data
                let dataOb = {};
                dataOb.target = connMetric['homeServerName'];
                dataOb.source = connMetric['remoteServerName'];
                dataOb.value = 1;
//                dataOb.value = connMetric['rxCount'];
                chartData.push(dataOb);
            }

        }

        if (metricsController.series) {
            metricsController.series.data.setAll(chartData);
        }

    };

    function initGui() {
        this.isInit = initChart();
    }

    root.updateResMetrics = function (resMap) {
        let container = document.querySelector('.jcResTab');

        if (!metricsController.isInit) {
            initGui.call(metricsController);
        }

        if (container === null) {
            return;
        }

        for (let serverName in resMap) {
            if (!metricsController.servResCards[serverName]) {
                let card = hh.createActDataPanelCard(serverName, serverName, container);

                metricsController.servResCards[serverName] = card;
                metricsController.servResFields[serverName] = {};

//                for (let field in resMap[serverName]) {
//                    metricsController.servResFields[serverName][field] = hh.adf(card, field);
//                }
                metricsController.servResFields[serverName]['cpuUsage'] = hh.adf(card, 'CPU Usage');
                metricsController.servResFields[serverName]['peakCpuUsage'] = hh.adf(card, 'Peak CPU Usage');
                metricsController.servResFields[serverName]['memUsage'] = hh.adf(card, 'Memory Usage', {'unit': 'MB'});
                metricsController.servResFields[serverName]['netRxTraffic'] = hh.adf(card, 'Network Traffic (RX)', {'unit': 'kB/s'});
                metricsController.servResFields[serverName]['netTxTraffic'] = hh.adf(card, 'Network Traffic (TX)', {'unit': 'kB/s'});
                metricsController.servResFields[serverName]['peakNetRxTraffic'] = hh.adf(card, 'Peak Network Traffic (RX)', {'unit': 'kB/s'});
                metricsController.servResFields[serverName]['peakNetTxTraffic'] = hh.adf(card, 'Peak Network Traffic (TX)', {'unit': 'kB/s'});
            }
            for (let field in resMap[serverName]) {
                metricsController.servResFields[serverName][field].value = resMap[serverName][field];
            }
        }

    };

    function initChart() {
        if (document.getElementById('chartdiv') === null) {
            return false;
        }

        var root = am5.Root.new('chartdiv');


// Set themes
        root.setThemes([
            am5themes_Animated.new(root),
            am5themes_Kelly.new(root),
        ]);


// Create series
        var series = root.container.children.push(am5flow.ChordDirected.new(root, {
            sourceIdField: "source",
            targetIdField: "target",
            valueField: "value",
            linkHeadRadius: 50
        }));
        series.nodes.get("colors").set("step", 2);

        metricsController.series = series;

        series.nodes.rectangles.template.setAll({
            fillOpacity: 0.5,
            stroke: am5.color(0x000000),
            strokeWidth: 1
        });

        // Make stuff animate on load
//        series.appear(1000, 100);

        return true;
    }
    $(document).ready(function () {

    });

    addEventListener('DOMContentLoaded', (event) => {
        metricsController.init();
    });
})(window);



