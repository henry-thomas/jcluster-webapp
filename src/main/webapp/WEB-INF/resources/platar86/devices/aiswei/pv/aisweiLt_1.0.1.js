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
/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, fetch, hh, panelContainer, paramDesc, pm, dm */


var aw = {
    flags: {},
    panel: {},
    comp: {},

};

aw.initHtml = function (data) {
    let tabCont = aw.comp.mainTabPanel.getItemContentById('actualData');
    tabCont.classList.add('actDataContainer');
    let cont = aw.comp.dataCard = hh.createActDataPanelCard(null, null, tabCont);

    for (var item in data) {
        cont.addField(item, item);
    }
};

dm.onParamReceived(() => {
    let settingsPanel = aw.comp.mainTabPanel.getItemContentById('settings');
    pm.loadParamDescriptor(paramDesc, settingsPanel);
});

dm.onDataReceived((dev, data) => {
    
    if (!aw.flags.initData) {
        aw.flags.initData = true;
        aw.initHtml(data);
    }
    aw.comp.dataCard.updateFields(data);
});

document.addEventListener("DOMContentLoaded", function (event) {
    aw.comp.mainTabPanel = new TabPanel(dgm.contentPanel, {
        menuItem: [
            {label: "Device Info", id: 'devInfo'},
            {label: "Actual Data", id: 'actualData'},
            {label: "Settings", id: 'settings'}
        ],
        stickyMenu: true,
        initSelect: 'actualData'

    });



});