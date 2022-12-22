/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by platar86, 2019
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 Sout Africa
 *  Phone: 021 555 2181
 *  
 */

var platar86 = {
    subDevicePoll: {
        start: function (sDevName) {
                    console.log('call start for: ' + sDevName);
            var contain = false;
            for (i = 0; i < this.arr.length; i++) {
                if (this.arr[i].name === sDevName) {
                    contain = true;
                    if(!this.arr[i].active){
                        PF(sDevName).start();
                    }
                    this.arr[i].active = true;
                    console.log('update active for: ' + sDevName);
                    break;
                }
            }
            if (!contain) {
                this.arr.push({
                    name: sDevName,
                    active: true
                });
                console.log('new active for: ' + sDevName);
            }
            console.log('start polling');
        },
        stop: function (sDevName) {
            for (i = 0; i < this.arr.length; i++) {
                if (this.arr[i].name === sDevName) {
                    this.arr[i].active = false;
                    console.log('stop unactive for: ' + sDevName);
                    break;
                }
            }
        },
        stopAll: function () {
            for (i = 0; i < this.arr.length; i++) {
                this.arr[i].active = false;
                PF(this.arr[i].name).stop();
                console.log('stop unactive for: ' + this.arr[i].name);
            }
        },
        startAll: function () {
            for (i = 0; i < this.arr.length; i++) {
                this.arr[i].active = true;
                PF(this.arr[i].name).start();
                console.log('start polling for: ' + this.arr[i].name);
            }
        },
        isActive: function (sDevName) {
            for (i = 0; i < this.arr.length; i++) {
                if (this.arr[i].name === sDevName) {
                    console.log('is active return:' + this.arr[i].active);
                    return this.arr[i].active;
                }
            }
            return false;
        },
        arr: []
    }
};