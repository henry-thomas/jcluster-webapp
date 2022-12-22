/* 
 * Copyright (C) 2019 platar86
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* global devManager, mainUtils, moment */

var nd = {
    expresionArr: {},
    ex: {},
    smdui_expressionSettingPanelEnabled: false,
    controlMap: {
        'notUsed': 'Not Used',
        'expression': 'Expression Controlled',
        'manual': 'Manual controlled'
    },
    devExpPanel: {}
};

nd.updateData = function (dev, data) {

    mainUtils.setHtmlText('sleepActive', data.sleepActive);
    mainUtils.setHtmlText('connectionState', data.connectionState?'Display Connected':'Display Conn Lost');
    mainUtils.setHtmlText('running', data.running);

};
nd.updateParam = function (dev, param) {
    console.log(param);
    if (param.control === 'expression') {
        if (nd.expressionThree === undefined) {
            nd.fetchExpressionTree();
        } else {
            if (nd.smdui_expressionSettingPanelEnabled === false) {
                nd.smdui_expressionSettingPanelEnabled = true;
                nd.ex.reloadDevExpressionPanel(dev, dev.getParam());
                document.querySelector('.smdui_expressionSettingPanelWrapper').style.display = 'flex';
            }
        }
    } else {
        nd.smdui_expressionSettingPanelEnabled = false;
        document.querySelector('.smdui_expressionSettingPanelWrapper').style.display = 'none';
    }
//    mainUtils.setHtmlText('actualState', data.state ? 'Closed' : 'Open');

};
devManager.onSelectedDataReceived(nd.updateData);
devManager.onSelectedParamInit(nd.updateParam);
devManager.onSelectedChange(function (sDev) {
    nd.smdui_expressionSettingPanelEnabled = false;
    if (sDev.connected) {
        nd.updateData(sDev, sDev.getData());
        nd.updateParam(sDev, sDev.getParam());
    } else {
        mainUtils.setHtmlText('dataValues');
    }
});
devManager.onSelectedStatusChange(function (dev, state) {
    if (state && dev.getData() !== undefined) {
        nd.updateData(dev, dev.getData());
        nd.updateParam(dev, dev.getParam());
    } else {
        mainUtils.setHtmlText('dataValues');
    }
});
$(document).ready(function () {


//                new TreeSelectorUI(document.getElementById('mbx1s'), map);
//                new TreeSelectorUI(document.getElementById('scheduleAnd'), map);
//
//                var sc1 = new ScheduleSelector(document.getElementById('schedule'),
//                        {
//                            titleNone: 'Schedule for Power PV',
//                            time: {
//                                enabled: true,
//                                fromTime: '15:20',
//                                toTime: '10:33'
//                            }
//                        }
//                );
});

var expEqMap = {
    lt: 'Less than',
    gt: 'Greater than',
    eq: 'Equal',
    neq: 'Not equal'
};