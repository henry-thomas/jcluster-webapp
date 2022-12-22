/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by Nathan Brill, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */

// (heading, imageUrl, updateRelese, list, pageUrl)

// Update version 6.410
const update_v6_410 = new Card("Logger v6.410",
        "https://www.mltpower.com/products/image/cache/catalog/Captu333re-500x500.PNG",
        "Logger v6.410 release date:",
        "Sungrow SG/PL Series Inverter Support @RS485 Interfaces. \n Carlog Gavazzi Energy Meter Support EM/ET Series @RS485 Interfaces. \n Logger Device Page -> Interfaces bug fix, added real time data for interface. RS485 interfaces has Setting for changing baudrate.\n Dynamic start and stop logger device support when enable or disable. No logger reboot required.",
        "");
update_v6_410.init();

//MQTT Update

const mqttUpdate = new Card("MQTT",
"https://mimtech.ir/mag/wp-content/uploads/2019/11/mqtt.png",
"Version 8.0.1  Date:",
"MQTT features\n ",
"https://login.mypower24.co.za/myPower24-ClientWeb/login/device/solarMd/logger/loggerV.xhtml");
mqttUpdate.init();

// Solar Yield Calculator

const solarYieldCalc = new Card("Solar Yield Calculator",
"https://solarexpertsindia.com/wp-content/uploads/2019/01/solar-panel-direction-angle-in-india..jpg",
"Version 8.0.1  Date:",
"The Solar Yield Calculator is a tool to\n estimate solar production.\nIdentify the best position for your solar system",
"https://login.mypower24.co.za/myPower24-ClientWeb/login/chart/solarYieldCalc.xhtml");
solarYieldCalc.init();

// Charts Update

const chart = new Card("Chart updates",
"https://cutewallpaper.org/21/wallpaper-graph/Broken-line-graph-and-characters-sign-53303-Flower-.jpg",
"Version *8.0.1 Date: 12/7/2021", 
"Chart Manager added.\n Customize the charts according to your individual needs with this new feature. ",
"https://login.mypower24.co.za/myPower24-ClientWeb/login/chart/chartPower.xhtml"); 
chart.init();

// Live chart

const liveChart = new Card("Live Chart",
"https://media1.giphy.com/media/rM0wxzvwsv5g4/giphy.gif?cid=ecf05e475jvnnfyrcyr6ib5ld2lnl9042x4akk2lw4s04l33&rid=giphy.gif&ct=g",
"Version 8.0.1 Date: 12/7/2021", 
"A live chart of your powers is now available\nOn the dashboard page, click the chart icon button",
"https://login.mypower24.co.za/myPower24-ClientWeb/login/dashboard.xhtml"); 
liveChart.init();


