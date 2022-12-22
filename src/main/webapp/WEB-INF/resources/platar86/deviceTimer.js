//function DevTimer(serialNmber, tOutCallback, timeout) {
//    this.timeout = timeout || 2000;
//    this.timer = null;
//    this.serialNumber = serialNmber;
//    this.status = false;
//    this.tOutCallback = tOutCallback || null;
//
//    this.getTimerCallback = function (serialNumber, callback) {
//        return function () {
//            if (callback !== null) {
//                callback(serialNmber);
//            } else {
//                console.log('timer callback is not defined for device: ' + serialNumber);
//            }
//        };
//    };
//}
//
//DevTimer.prototype.setStatus = function (status) {
//    this.status = status;
//};
//
//DevTimer.prototype.getStatus = function () {
//    return this.status;
//};
//
//DevTimer.prototype.refreshTimer = function () {
//    window.clearTimeout(this.timer);
//    this.timer = window.setTimeout(this.getTimerCallback(this.serialNumber, this.tOutCallback), this.timeout);
//};
//
//DevTimer.prototype.stopTimer = function () {
//    window.clearTimeout(this.timer);
//};
