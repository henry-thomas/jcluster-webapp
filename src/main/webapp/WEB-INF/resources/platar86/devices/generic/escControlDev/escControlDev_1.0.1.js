

/* global escCDevGui */

var escCDev = {};

escCDev.init = function () {


    escManager.onDataReceived(function (stList) {
//    debugger;
        for (var item in stList) {
            let escData = stList[item];
            if (escData.busName === dm.selected.param.busName) {
                for (var field in escData) {
                    if (escCDevGui.dataComp.esc[field]) {
                        escCDevGui.dataComp.esc[field].value = escData[field];
                    }
                }
            }
        }
    });

    dm.onDataReceived(function (dev, data) {
        for (var item in data) {
            if (escCDevGui.dataComp[item]) {
                escCDevGui.dataComp[item].value = data[item];
            }
        }
    });
};

