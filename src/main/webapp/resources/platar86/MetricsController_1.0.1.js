/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/* global loggerStatUpdate, metricsController */

(function (root) {
    function MetricsController() {

    }

    let prot = MetricsController.prototype;

    prot.init = function () {
        setInterval(loggerStatUpdate, 1000);
    };

    root.metricsController = new MetricsController();


    root.updateMetrics = function (metricsMap) {
        console.log(metricsMap);
        for (let serverName in metricsMap) {
            let connMetricList = metricsMap[serverName];
            for (let i = 0; i < connMetricList.length; i++) {
                let connMetric = connMetricList[i];
                for (let field in connMetric) {
                    let fieldClass = connMetric['homeServerName'] + '_' + field + '_' + connMetric['connId'];
                    let fieldSpan = document.getElementsByClassName(fieldClass);
                    if (fieldSpan.length > 0) {
                        fieldSpan[0].textContent = connMetric[field];
                    }
                }
            }
        }
    };

})(window);

$(document).ready(function () {
    metricsController.init();
});
