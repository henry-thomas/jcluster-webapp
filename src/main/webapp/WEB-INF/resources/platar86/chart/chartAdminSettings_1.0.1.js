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

/* global cm */

//This file can be used to add admin settings for charts

function initAdminChartSettings(chartName) {
    cm.charts[chartName].confCtrl.tool.copyTemplateToUser = new SettingPanel(cm.charts[chartName].confCtrl.tool.tab, {
        title: 'Copy Template to User',
        toolTip: 'Send these settings to another user',
        label: 'Copy',
        type: 'button',
        onChange: function () {
            copyChartConfigToUser();
        }.bind(this)
    });
}


