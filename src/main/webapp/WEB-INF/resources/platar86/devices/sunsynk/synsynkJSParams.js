/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */

(function (root) {
    let SSGTJSParam = function (sDev, param) {
        this.sDev = sDev;
        this.param = param;

        init.call(this);
    };

    let proto = SSGTJSParam.prototype;

    proto.update = function (sDev, param) {
        this.sDev = sDev;
        this.param = param;
    };

    function init() {
        this.container = document.getElementById('jsParamContainer');

        new ParamSetting(this.container, 'currentTime', {
            type: 'inputText',
            title: 'Set Time',
            ctrlInfo: 'Change the time on the inverter.',
            inputTextConf: {
                type: 'datetime-local'
            },
            onChange: function (comp, val) {
                //Here we van call functions that for example hide other
                //settings depending on the value of the changed component.
//                if (typeof (val) === 'number') {
//                    comp.setValue(new Date(val));
//                }
//                console.log(comp, val);
            }
//            unit: 'W'
        });
    }

    root.SSGTJSParam = SSGTJSParam;
}(window));

$(document).ready(function () {
    new SSGTJSParam();
});
