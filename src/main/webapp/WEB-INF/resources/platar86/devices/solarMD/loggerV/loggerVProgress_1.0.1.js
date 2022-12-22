/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by natha, 2022
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */


/* global dm, hh */

addEventListener("load", () => {
    dm.onProgressData('aisweiScanDeviceDialog', function (dev, prog, id) {
//        debugger;
        this.setBarTitle(prog.pState + "% Aiswei scanner.");
        this.dataCard.updateFields(prog.prop);
    });
    dm.onProgressDialogCreate('aisweiScanDeviceDialog', function (dev, pId, dialog) {
        dialog.setBarTitle("Aiswei scanner.");
        let cont = dialog.dataCard = hh.createActDataPanelCard(null, null, dialog.contentDiv);
        cont.addField("currentAddress", "Current Modbus Address:");
        cont.addField("result", "Found Devices:");
    });
});