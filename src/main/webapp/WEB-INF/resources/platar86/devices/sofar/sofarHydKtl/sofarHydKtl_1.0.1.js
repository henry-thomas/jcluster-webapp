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


/* global hhContentBuilder, hh, mainUtils, pm, atessHps, dm, atessHpsGUI, mu, wsm */

(function (root) {
    function atessHps() {
        console.log(this);
        atessHps.dataFields = {};

    }

    root.atessHps = new atessHps();

    dm.onDataReceived(
            function (dev, data) {
//                debugger;
                if (!atessHpsGUI.initComplete) {
                    atessHpsGUI.initDataFields(data);
                }

                hh.updateAdfFromObject(atessHpsGUI.dataFields, data, true);
            }
    );
    $(document).ready(function () {

    });
}(window));
