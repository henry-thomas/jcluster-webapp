/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, hh, bmsexDM, bmuH8, ipUtils, wsm, mu, dm, hhContentBuilder */


var tDevGUI = {

};

tDevGUI.createGui = function (cont, pageContent) {
    pageContent._cont = cont;
    hhContentBuilder.buildContent(pageContent);
//    hh.addClass(cont, 'card');
//    let mainTab = tDevGUI.mainTab = new TabPanel(cont, {
//        menuItem: ["Actual Data", "Settings"],
//        sticky: true
//    });
//    new SMDUIDockingCard(dgm.deviceTable);
//    tDevGUI.initSettingsNetwork(mainTab.getItemContentByLabel("Actual Data"));
//    tDevGUI.initSettingsBasic(mainTab.getItemContentByLabel("Settings"));
};



