/* global devManager, lv, mainUtils */

lv.log = {
    data: [],
    loggerList: [],
    rawData: [],
    lastLogTimestamp: 0,
    updateLog: function () {
        this.data.length = 0;
        for (var i = 0; i < this.rawData.length; i++) {
            this.data.push(this.rawData[i]);
        }
        this.data.sort(sortChartDataDesc);
        $('#tblVLog').puidatatable('reload');
    },

    setLoggerLevel: function (loggerName, level) {
        devManager.sendDevMessage(
                {
                    instrExt: 'setLoggerLevel',
                    instrData: loggerName,
                    instrDataExt: level
                },
                function (devMessage, unitArr) { //success
                    mainUtils.showInfoMessage('Logger level set success', 'Level: ' + level);

                }
        );
    },
    fetchLoggerList: function () {
        devManager.sendDevMessage(
                {
                    instrExt: 'getAllLoggers',
                    instrData: ' ',
                    instrDataExt: ' '
                },
                function (devMessage, unitArr) { //success
                    console.log(unitArr);
                    lv.log.loggerList = unitArr;

                    var data = [];
                    for (var i = 0; i < unitArr.length; i++) {
                        const logName = unitArr[i];
                        if (lv.log.selectedLogger === undefined) {
                            lv.log.selectedLogger = logName;
                        }
                        let nameSplit = logName.split('.');

                        data.push({
                            label: nameSplit[nameSplit.length - 1],
                            value: logName
                        });
                    }
                    $('#loggerDropDown').puidropdown({
                        data: data,
                        styleClass: 'dscValueCustom',
                        change: function (container, value) {
                            lv.log.selectedLogger = value.value;
                        }
                    });
                    $('#loggerLevelDropDown').puidropdown({
                        data: ['Off', 'Error', 'Warning', 'Info', 'Debug', 'Trace', 'All'],
                        styleClass: 'dscValueCustom',
                        change: function (container, value) {
                            let intVal;
                            switch (value.value) {
                                case 'Off':
                                    intVal = 2147483647;
                                    break;
                                case 'Error':
                                    intVal = 40000;
                                    break;
                                case 'Warning':
                                    intVal = 30000;
                                    break;
                                case 'Info':
                                    intVal = 20000;
                                    break;
                                case 'Debug':
                                    intVal = 10000;
                                    break;
                                case 'Trace':
                                    intVal = 5000;
                                    break;
                                case 'All':
                                    intVal = -2147483648;
                                    break;
                            }
                            lv.log.setLoggerLevel(lv.log.selectedLogger, intVal);
                            console.log(lv.log.selectedLogger);
                        }
                    });
                }
        );

    },
    fetchLastLog: function () {
        if (lv.log.loggerList.length === 0) {
            lv.log.fetchLoggerList();
        }
        wsm.sendDevMsg(
                {
                    instr: "executeInstr",
                    instrExt: 'getLastLog',
                    instrData: (lv.log.lastLogTimestamp).toString(),
                    devSerialNumber: devManager.getSelected().serialNumber,
                    devModelId: 2
                },
                function (message, response) {
//                    console.log("send response request " + response);
                    for (var i = 0; i < response.length; i++) {
                        var log = JSON.parse(response[i].message);
                        log.time = moment(response[i].timeStamp).format('h:mm:ss ');
                        log.levelStr = log.level.levelStr;
                        log.timeStamp = response[i].timeStamp;

                        if (response[i].timeStamp > lv.log.lastLogTimestamp) {
                            lv.log.lastLogTimestamp = response[i].timeStamp;
                        }
                        lv.log.rawData.push(log);
                    }
                    lv.log.updateLog();
                }
        );
//        console.log("send object request");
    }
};

function sortChartDataAsc(a, b) {
    if (a.timeStamp < b.timeStamp)
        return -1;
    if (a.timeStamp > b.timeStamp)
        return 1;
    return 0;
}
function sortChartDataDesc(a, b) {
    if (a.timeStamp < b.timeStamp)
        return 1;
    if (a.timeStamp > b.timeStamp)
        return -1;
    return 0;
}

devManager.onDeviceInitComplete(function () {
    setInterval(lv.log.fetchLastLog, 2000);
});

$(function () {
    $('#tblVLog').puidatatable({
        caption: 'LoggerV2 LOG',
        columns: [
            {field: 'time', headerText: 'Time:', filter: true, sortable: true},
            {field: 'thread', headerText: 'Thread', filter: true, sortable: true},
            {field: 'level', headerText: 'Level', filter: true, sortable: true},
            {field: 'message', headerText: 'Message', filter: true}
        ],

        selectionMode: 'single',
        rowSelect: function (event, data) {
            console.log(data);
            var fieldArr = document.getElementsByClassName('logDetailValue');
            if (fieldArr.length > 0) {
                for (var i = 0; i < fieldArr.length; i++) {
                    fieldArr[i].textContent = '';
                }
            }

            for (var fieldName in data) {
                var spanField = document.querySelector('.logDesc_' + fieldName);
                if (spanField) {
                    spanField.textContent = data[fieldName];
                }
            }
        },

        resizableColumns: true,
//        columnResizeMode: 'expand',
        scrollable: true,
        scrollHeight: '400',
        emptyMessage: 'no data',
        datasource: lv.log.data
    });

});
/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, em, mu */


