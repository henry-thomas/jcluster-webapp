/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2022
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */

/* global bc, devManager, mainUtils, bmsExBatProdGUI, mu, bmsexBatProd, dm */

(function (root) {
    function BmsExBatProd() {
        init.call(this);
    }


    function init() {
        devManager.onSelectedDataReceived(updateData);
        devManager.onSelectedParamInit(initParam);
        devManager.onSelectedChange(onSelectedChange);
    }

    function updateData(dev, data) {

        bmsExBatProdGUI.updateDataCards(dev, data);
        bmsExBatProdGUI.onLogMessageReceived(data.prodMessageList);
    }

    function initParam(dev, param) {
        bmsExBatProdGUI.onParamReceived(dev, param);
    }

    function onSelectedChange(dev) {
        if (dev.connected) {
            updateData(dev, dev.getData());
            initParam(dev, dev.getParam());
        } else {

            mainUtils.setHtmlText('dataValues');
        }
    }




    $(document).ready(function () {
        root.bmsExBatProd = new BmsExBatProd();

    });
}(window));





