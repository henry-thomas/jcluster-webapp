/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by platar86, henry, brais 2020
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */

/* global cm, moment, am4charts, wsm, mu, dm, sui */


var chartDefConf = {
    conf: {
        chartConf: {

        },
        chartType: 'XYChart',
        confName: 'default',
        confNameLabel: 'Default',
        gen: {
            showAdvancedSettings: true,
            showChartCursor: true,
            horizontalScroll: 'microChart'
        },
        legend: {
            showLegend: 'bottom'
        },
        yAxes: {
            currentA: {
                opposite: true
            }
        }
    },
    seriesConf: {
        enabled: true,
        seriesType: 'LineSeries'
    }
};

var bexpc = {
    default_period: 300000, // Default period of time 5 minutes
    buff: {},
    data: [],
    selectedDevice: null,
    name: 'bmsEx-prodChartContainer',
    reqSeries: {},
    dataInfo: {},
    init: function () {
        cm.createChart(
                document.getElementById(bexpc.name),
                'bmsEx-ProdChart',
                chartDefConf,
                function (chOb) {
                    bexpc.chart = chOb;
                    bexpc.updateSelectedDevice();
                    bexpc.createChartTimeControl();
//                bexpc.processData();
                    dm.onSelectedChange(bexpc.onSelectedDeviceChange);
                }
        );
    },

    processData: function () {
        bexpc.dateBeginPicker.disabled = true;
        bexpc.dateEndPicker.disabled = true;
        wsm.sendDevMsgExecWithJsonInst({
            instrExt: 'getProdDataInfo'
        }, function (msg, data) {
            bexpc.dataInfo = data;

            let begin = bexpc.dataInfo.lastResult - bexpc.default_period; // 5 minutes before
            if (begin < bexpc.dataInfo.firstResult) {
                begin = bexpc.dataInfo.firstResult;
            }
            bexpc.selectedBeginDate = moment(begin);
            bexpc.selectedEndDate = moment(bexpc.dataInfo.lastResult);


            bexpc.updateChartTimeControl();
            mu.showInfoMessage('Data Info retreived successfully!', 'Fetching Data Info');
        }, function (msg, err) {
            mu.showErrorMessage('Data Info NOT retreived', 'Fetching Data Info');
        });
    },

    onFecthData: function () {
        if (!bexpc.selectedBeginDate || !bexpc.selectedEndDate) {
            mu.showWarningMessage('Please select a valid range of dates', 'Fetching data');
            return;
        }

        let begin = bexpc.selectedBeginDate.valueOf();
        if (begin < bexpc.dataInfo.firstResult) {
            begin = bexpc.dataInfo.firstResult;
            bexpc.selectedBeginDate = moment(begin);
            bexpc.dateBeginPicker.value = bexpc.selectedBeginDate.format(bexpc.selectedDateTimeFormatter);
        }
        let end = bexpc.selectedEndDate.valueOf();
        if (end > bexpc.dataInfo.lastResult) {
            end = bexpc.dataInfo.lastResult;
            bexpc.selectedEndDate = moment(end);
            bexpc.dateEndPicker.value = bexpc.selectedEndDate.format(bexpc.selectedDateTimeFormatter);
        }
        if (end < begin) {
            // Initializing dateBeginPicker to a valid value
            begin = end - bexpc.default_period; // 5 minutes before
            if (begin < bexpc.dataInfo.firstResult) {
                // Initializing the date pickers to the initial search status
                end = bexpc.dataInfo.lastResult;
                begin = end - bexpc.default_period; // 5 minutes before
            }
            bexpc.selectedBeginDate = moment(begin);
            bexpc.dateBeginPicker.value = bexpc.selectedBeginDate.format(bexpc.selectedDateTimeFormatter);
            bexpc.selectedEndDate = moment(end);
            bexpc.dateEndPicker.value = bexpc.selectedEndDate.format(bexpc.selectedDateTimeFormatter);
            mu.showErrorMessage('End Date cannot be greater than Begin date', 'Fetching data');
            return;
        }
        bexpc.dataInfo.fetchResults = 0;
        bexpc.data = [];
        bexpc.chart.showLoadingIndicator();
        bexpc.fetchProdData(begin, end, 100);
    },

    fetchProdData: function (begin, end, maxCount) {
        console.info('Fetching prod data from: [' + moment(begin).format('DD/MM/YY H:mm:ss') + '] to [' + moment(end).format('DD/MM/YY H:mm:ss') + '],  Max Count: [' + maxCount + "]");
        wsm.sendDevMsgExecWithJsonInst({
            instrExt: 'getProdData',
            maxRecords: maxCount,
            beginDate: begin,
            endDate: end
        }, function (msg, dataRec) {
            let rec = null;
            for (var i = 0; i < dataRec.length; i++) {
                rec = JSON.parse(dataRec[i].jsonData);
                if (i % 10 === 0) {
                    bexpc.data.push(rec);
                }
                rec.pVol = 0;
                for (var j = 0; j < rec.cv.length; j++) {
                    rec.pVol += rec.cv[j];
                    rec['c' + j] = rec.cv[j];
                }
                delete rec.cv;
                rec.date = new Date(dataRec[i].cd);
            }
            bexpc.dataInfo.tempResult = rec.cDate;
            if (bexpc.dataInfo.fetchResults) {
                bexpc.dataInfo.fetchResults += maxCount;
            } else {
                bexpc.dataInfo.fetchResults = maxCount;
            }
            // Only will be calculate if there is more than 1 sec. difference
            if (end - rec.cDate > 1000) {
                bexpc.fetchProdData(rec.cDate + 1, end, maxCount);
            } else {
                bexpc.chart.hideLoadingIndicator();
                bexpc.onCurrentSeriesDataReceived("c", "Current");
                for (let i = 0; i < 16; i++) {
                    bexpc.onVoltageSeriesDataReceived("c" + i, 'Cell' + (i + 1));
                }
                bexpc.chart.addRequiredSeries(bexpc.reqSeries);
                bexpc.chart.chart.data = bexpc.data;
            }
        }, function (msg, err) {
            console.log(err);
        });
    },

    updateChartTimeControl: function () {
        if (!bexpc.dataInfo || !bexpc.dataInfo.firstResult || !bexpc.dataInfo.lastResult) {
            return;
        }

        let beginDate = moment(bexpc.dataInfo.firstResult);
        let endDate = moment(bexpc.dataInfo.lastResult);
        let beginPickerDate = endDate.clone();

        // The first query will be 5 minutes before the End date
        beginPickerDate.subtract(5, 'minutes');
        if (beginPickerDate.isBefore(beginDate)) {
            beginPickerDate = beginDate;
        }

        bexpc.dateBeginLabel.textContent = beginDate.format(bexpc.availableDateFormatter);
        bexpc.dateBeginPicker.setAttribute('min', beginDate.format(bexpc.selectedDateTimeFormatter));
        bexpc.dateBeginPicker.setAttribute('max', endDate.format(bexpc.selectedDateTimeFormatter));
        bexpc.dateBeginPicker.value = beginPickerDate.format(bexpc.selectedDateTimeFormatter);
        bexpc.dateBeginPicker.disabled = false;

        bexpc.dateEndLabel.textContent = endDate.format(bexpc.availableDateFormatter);
        bexpc.dateEndPicker.setAttribute('min', beginDate.format(bexpc.selectedDateTimeFormatter));
        bexpc.dateEndPicker.setAttribute('max', endDate.format(bexpc.selectedDateTimeFormatter));
        bexpc.dateEndPicker.value = endDate.format(bexpc.selectedDateTimeFormatter);

        bexpc.dateEndPicker.disabled = false;
    },

    updateSelectedDevice: function () {
        let device = dm.getSelected();
        if (device && device.serialNumber) {
            bexpc.selectedDevice = device.serialNumber;
        }
    },

    onSelectedDeviceChange: function () {
        // console.log('Initializing chart');
        //  bexpc.updateDataDevice();
    },

    updateDataDevice: function () {
        // Saving the data of the previous selected device
        if (!bexpc.buff[bexpc.selectedDevice]) {
            bexpc.buff[bexpc.selectedDevice] = {};
        }
        bexpc.buff[bexpc.selectedDevice].data = bexpc.data;
        bexpc.buff[bexpc.selectedDevice].selectedBeginDate = bexpc.selectedBeginDate;
        bexpc.buff[bexpc.selectedDevice].selectedEndDate = bexpc.selectedEndDate;
        bexpc.buff[bexpc.selectedDevice].dataInfo = bexpc.dataInfo;

        // Getting the data from the new selected device
        bexpc.updateSelectedDevice();
        if (!bexpc.hasDataOnBuffer()) {
//            bexpc.processData();
            bexpc.initChartTimeControl();
            bexpc.chart.chart.data = [];
            return;
        }
        bexpc.data = bexpc.buff[bexpc.selectedDevice].data;
        bexpc.selectedBeginDate = bexpc.buff[bexpc.selectedDevice].selectedBeginDate;
        bexpc.selectedEndDate = bexpc.buff[bexpc.selectedDevice].selectedEndDate;
        bexpc.dataInfo = bexpc.buff[bexpc.selectedDevice].dataInfo;
        bexpc.updateChartTimeControl();

        // Updating previously selected date in the dateBeginPicker
        if (bexpc.selectedBeginDate) {
            bexpc.dateBeginPicker.value = bexpc.selectedBeginDate.format(bexpc.selectedDateTimeFormatter);
        }

        // Updating previously selected date in the dateEndPicker
        if (bexpc.selectedEndDate) {
            bexpc.dateEndPicker.value = bexpc.selectedEndDate.format(bexpc.selectedDateTimeFormatter);
        }

        // Updating previously displayed chart data
        if (bexpc.data) {
            bexpc.chart.chart.data = bexpc.data;
        }
    },

    onCurrentSeriesDataReceived: function (sName, label) {
        bexpc.reqSeries[label] = {
            name: label,
            yAxis: 'currentA',
            valueAxisY: 'currentA',
            seriesType: 'LineSeries',
            //tooltip text config start here 
            toolTipDefault: "Current: Value",
            toolTipOptions: [
                {
                    label: "None",
                    value: ""
                },
                {
                    label: "Current: Value",
                    value: "{name}: [bold]{valueY}A"
                }

            ],
            dataFields: {
                valueY: sName,
                dateX: 'date'
            }
        };
    },

    onVoltageSeriesDataReceived: function (sName, label) {
        bexpc.reqSeries[label] = {
            name: sName,
            yAxis: 'voltageV',
            valueAxisY: 'voltageV',
            seriesType: 'LineSeries',
            //tooltip text config start here 
            toolTipDefault: "None",
            toolTipOptions: [
                {
                    label: "None",
                    value: ""
                },
                {
                    label: "Cell: Voltage",
                    value: "{name}: [bold]{valueY}V"
                }

            ],
            dataFields: {
                valueY: sName,
                dateX: 'date'
            }
        };
    },

    createChartTimeControl: function () {
        // Refesh Button
        let container = bexpc.chart.controlLeftDiv;
        let refreshButton = sui.buttonCustom({
            text: `<i class = "fas fa-sync"></i>`,
            type: 'small'
        });
        container.appendChild(refreshButton);
        refreshButton.addEventListener('click', bexpc.processData);

        // Date Begin Label
        bexpc.availableDateFormatter = 'DD/MM/YY H:mm:ss';
        bexpc.dateBeginLabel = document.createElement('span');
        bexpc.dateBeginLabel.classList.add('chCtrl-label');

        bexpc.dateBeginLabel.textContent = moment().format(bexpc.availableDateFormatter);
        container.appendChild(bexpc.dateBeginLabel);

        // Date End Label
        bexpc.dateEndLabel = document.createElement('span');
        bexpc.dateEndLabel.classList.add('chCtrl-label');
        bexpc.dateEndLabel.textContent = moment().format(bexpc.availableDateFormatter);
        container.appendChild(bexpc.dateEndLabel);

        // Date Begin Picker
        bexpc.selectedDateTimeFormatter = 'YYYY-MM-DDTHH:mm';
        bexpc.dateBeginPicker = document.createElement('input');
        bexpc.dateBeginPicker.setAttribute('type', 'datetime-local');
        bexpc.dateBeginPicker.classList.add('chCtrl-label');
        bexpc.dateBeginPicker.disabled = true;
        container.appendChild(bexpc.dateBeginPicker);
        bexpc.dateBeginPicker.addEventListener('change', function (event) {
            bexpc.selectedBeginDate = moment(event.target.value, bexpc.selectedDateTimeFormatter);
        });

        // Date End Picker
        bexpc.dateEndPicker = document.createElement('input');
        bexpc.dateEndPicker.setAttribute('type', 'datetime-local');
        bexpc.dateEndPicker.classList.add('chCtrl-label');
        bexpc.dateEndPicker.disabled = true;
        container.appendChild(bexpc.dateEndPicker);
        bexpc.dateEndPicker.addEventListener('change', function (event) {
            bexpc.selectedEndDate = moment(event.target.value, bexpc.selectedDateTimeFormatter);
        });

        // Search Button
        let searchButton = sui.buttonCustom({
            text: `<i class = "fas fa-search"></i>`,
            type: 'small'
        });
        container.appendChild(searchButton);
        searchButton.addEventListener('click', bexpc.onFecthData);
    },

    initChartTimeControl: function () {
        bexpc.dateBeginLabel.textContent = moment().format(bexpc.availableDateFormatter);
        bexpc.dateEndLabel.textContent = moment().format(bexpc.availableDateFormatter);
        bexpc.selectedBeginDate = null;
        bexpc.selectedEndDate = null;
        bexpc.dateBeginPicker.disabled = true;
        bexpc.dateEndPicker.disabled = true;
//        bexpc.dateBeginPicker.value = moment().format(bexpc.selectedDateTimeFormatter);
//        bexpc.dateEndPicker.value = moment().format(bexpc.selectedDateTimeFormatter);
        bexpc.dateBeginPicker.value = null;
        bexpc.dateEndPicker.value = null;
    },

    hasDataOnBuffer: function () {
        return bexpc.buff[bexpc.selectedDevice] &&
                bexpc.buff[bexpc.selectedDevice].selectedBeginDate &&
                bexpc.buff[bexpc.selectedDevice].selectedEndDate &&
                bexpc.buff[bexpc.selectedDevice].data &&
                bexpc.buff[bexpc.selectedDevice].data.length;
    }
};

$(document).ready(function () {
    bexpc.init();
});
