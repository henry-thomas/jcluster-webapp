/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by brais, 2019
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 Sout Africa
 *  Phone: 021 555 2181
 *  
 */


/* global mainUtils */

var qcManager = {
    checkQcPassed: function () {
        let buttons = Array.from(document.querySelectorAll('.checkColumn'));
        let checkedButtons = Array.from(document.querySelectorAll('.ui-icon-check-box'));
        if (buttons.length !== checkedButtons.length) {
            mainUtils.showWarningMessage('No all the Quality Control Steps have been evaluated', 'Quality Control');
            console.log('No all the Quality Control Steps have been evaluated');
        }
    }
};

window.onbeforeunload = function () {
    qcManager.checkQcPassed();
};