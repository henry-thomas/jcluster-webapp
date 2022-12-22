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


/* global wsm, bcGui, hh */
(function () {

    function initRepSettings() {
//        let cont = bcGui.comp.genInfoCard;
        let dPanel = bcGui.comp.mainTabPanel.getItemContentById('calData');
        dPanel.style.display = 'flex';
        dPanel.style.justifyContent = 'space-evenly';
        dPanel.style.flexWrap = 'wrap';
        let pCont = hh.div(dPanel, 'actDataContainer');
        let cont = hh.createActDataPanelCard('INDIVIDUAL TESTS', null, pCont);
        cont.style.justifyContent = 'flex-start';

        new ParamSetting(cont, {
            type: 'dropDownButton',
            title: 'Test Target Unit:',
            ctrlInfo: 'Execute individual tests after repairs. ',
            content: [
                {name: 'Test Balancing', cb: function () {
                        wsm.sendDevMsgExecWithJsonInst(
                                {instrExt: 'testBalancing', showMessage: true}
                        );
                    }},
                {name: 'Test Temperature', cb: function () {
                        wsm.sendDevMsgExecWithJsonInst(
                                {instrExt: 'testBalancingTemp', showMessage: true}
                        );
                    }},
                {name: 'Calibrate Voltage', cb: function () {
                        wsm.sendDevMsgExecWithJsonInst(
                                {instrExt: 'calibrateVoltage', showMessage: true}
                        );
                    }},
                {name: 'Test CAN iFace', cb: function () {
                        wsm.sendDevMsgExecWithJsonInst(
                                {instrExt: 'canEnvTest', showMessage: true}
                        );
                    }}
//            {name: 'Test Relay and Current Sensor', cb: function () {
//                    wsm.sendDevMsgExecWithJsonInst(
//                            {instrExt: 'relayCurrentTest', showMessage: true, maxIdleCurr: 0.1,
//                                maxCurrDiff: 0.1}
//                    );
//                }}
//            {name: 'Load BMS Params', cb: function () {
//                    wsm.sendDevMsgExecWithJsonInst(
//                            {instrExt: 'loadModelParamMap', showMessage: true}
//                    );
//                }},
            ]
        });

        new ParamSetting(cont, {
            type: 'dropDownButton',
            title: 'Force Clear Prod Flags:',
            ctrlInfo: 'Clears all production flags, removing error mode',
            content: [
                {name: 'Force', cb: function () {
                        wsm.sendDevMsgExecWithJsonInst(
                                {instrExt: 'forceClearAllProdErrFlags', showMessage: true}
                        );
                    }}


            ]
        });
    }

    $(document).ready(function () {
        initRepSettings();
    });
}());