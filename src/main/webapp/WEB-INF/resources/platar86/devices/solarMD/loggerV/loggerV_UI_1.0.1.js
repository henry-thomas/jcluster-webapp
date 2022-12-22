/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by platar86, 2022
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */


/* global hh */

var lvui = {
    comp: {},
    panel: {}
};

lvui.createLvmHwDataCard = function () {
    let actDataCont = document.getElementById('loggerActualData');
    
    let panel = lvui.panel.lvmHwData = hh.createActDataPanelCard("LVM Motherboard Hardware Info", null, actDataCont);

    panel.addField('mbSerialNumber', 'Serial Number'); //compId, title, unit, confOb
    panel.addField('mbFwVer', 'Firmware Ver'); //compId, title, unit, confOb
    panel.addField('mbHwVer', 'Hardware Ver'); //compId, title, unit, confOb
    panel.addField('driverVersion', 'OS Driver Ver'); //compId, title, unit, confOb
    panel.addField('manufDate', 'Manufacturing Date'); //compId, title, unit, confOb
    
    panel.addHeaderTitle("Com Interfaces");
    panel.addField('rs485IfaceCount', 'RS232 Isolated Ports'); //compId, title, unit, confOb
    panel.addField('rs232IfaceCount', 'RS485Isolated Ports'); //compId, title, unit, confOb
    panel.addField('canbusIfaceCount', 'CANBUS Isolated Ports'); //compId, title, unit, confOb
    
    panel.addHeaderTitle("IO");
    panel.addField('relayOutputs', 'Relay Outputs'); //compId, title, unit, confOb
    panel.addField('digitalOutputs', 'Digital Outputs'); //compId, title, unit, confOb
    panel.addField('analogInputs', 'Analog Inputs'); //compId, title, unit, confOb
    panel.addField('analogOutputs', 'Analog Outputs'); //compId, title, unit, confOb
    panel.addField('digitalInputs', 'Digital Inputs'); //compId, title, unit, confOb
};