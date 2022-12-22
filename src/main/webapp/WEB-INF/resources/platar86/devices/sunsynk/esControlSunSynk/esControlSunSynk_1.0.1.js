

/* global escCDevGui, escCDev, escCSunSynkGui */

var escCSunSynk = {};

dm.onDataReceived(function (dev, data) {

//    debugger;
    escCDevGui.dataComp.ctrlChargeEnable.value = (data.ctrlMsg35C & (1 << 7)) !== 0;
    escCDevGui.dataComp.ctrlDischargeEnable.value = (data.ctrlMsg35C & (1 << 6)) !== 0;
    escCDevGui.dataComp.ctrlChargeImmedFirst.value = (data.ctrlMsg35C & (1 << 5)) !== 0;
    escCDevGui.dataComp.ctrlChargeImmedSecond.value = (data.ctrlMsg35C & (1 << 4)) !== 0;

    escCDevGui.dataComp.warningDischargeToHigh.value = (data.ctrlMsg359 & (1 << 7)) !== 0;
    escCDevGui.dataComp.warningChargeToHigh.value = (data.ctrlMsg359 & (1 << 8)) !== 0;
});

document.addEventListener("DOMContentLoaded", function (event) {

    escCSunSynkGui.init();
    escCDev.init();

});