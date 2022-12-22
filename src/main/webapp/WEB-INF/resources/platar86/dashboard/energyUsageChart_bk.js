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

/* global AmCharts */


var energyUsage = {
    buttons: document.getElementsByClassName('energyUsagePeriodSelcetor'),
    isInit: false,
    period: 'today',
    pValues: {
        pv: 0,
        load: 0,
        grid: 0,
        stDisch: 0
    }
};


energyUsage.dataChange = function () {
    if (!energyUsage.isInit
            && energyUsage.powers["PV"].dataAvailable === true
            && energyUsage.powers["CONSUMERS"].dataAvailable === true
            && energyUsage.powers["GRID OUT"].dataAvailable === true
            && energyUsage.powers["STORAGE DISCHARGE"].dataAvailable === true
            ) {
        energyUsage.setValue();
        energyUsage.isInit = true;
    }

};

energyUsage.setValue = function () {
    try {
        switch (energyUsage.period) {
            case 'today':
                {
                    energyUsage.pValues.pv = energyUsage.powers["PV"].sumData.dailyEnergyWh;
                    energyUsage.pValues.load = energyUsage.powers["CONSUMERS"].sumData.dailyEnergyWh;
                    energyUsage.pValues.grid = energyUsage.powers["GRID OUT"].sumData.dailyEnergyWh;
                    energyUsage.pValues.stDisch = energyUsage.powers["STORAGE DISCHARGE"].sumData.dailyEnergyWh;
                }
                break;
            case 'monthly':
                {
                    energyUsage.pValues.pv = energyUsage.powers["PV"].sumData.monthlyEnergyWh;
                    energyUsage.pValues.load = energyUsage.powers["CONSUMERS"].sumData.monthlyEnergyWh;
                    energyUsage.pValues.grid = energyUsage.powers["GRID OUT"].sumData.monthlyEnergyWh;
                    energyUsage.pValues.stDisch = energyUsage.powers["STORAGE DISCHARGE"].sumData.monthlyEnergyWh;
                }
                break;
            case 'yearly':
                {
                    energyUsage.pValues.pv = energyUsage.powers["PV"].sumData.yearlyEnergyWh;
                    energyUsage.pValues.load = energyUsage.powers["CONSUMERS"].sumData.yearlyEnergyWh;
                    energyUsage.pValues.grid = energyUsage.powers["GRID OUT"].sumData.yearlyEnergyWh;
                    energyUsage.pValues.stDisch = energyUsage.powers["STORAGE DISCHARGE"].sumData.yearlyEnergyWh;
                }
                break;
            case 'total':
                {
                    energyUsage.pValues.pv = energyUsage.powers["PV"].sumData.energyWh;
                    energyUsage.pValues.load = energyUsage.powers["CONSUMERS"].sumData.energyWh;
                    energyUsage.pValues.grid = energyUsage.powers["GRID OUT"].sumData.energyWh;
                    energyUsage.pValues.stDisch = energyUsage.powers["STORAGE DISCHARGE"].sumData.energyWh;
                }
                break;
        }

        energyUsage.pValues.pv /= 1000;
        energyUsage.pValues.load /= 1000;
        energyUsage.pValues.grid /= 1000;
        energyUsage.pValues.stDisch /= 1000;

        energyUsage.pValues.pv = Number(energyUsage.pValues.pv.toFixed(1));
        energyUsage.pValues.load = Number(energyUsage.pValues.load.toFixed(1));
        energyUsage.pValues.grid = Number(energyUsage.pValues.grid.toFixed(1));
        energyUsage.pValues.stDisch = Number(energyUsage.pValues.stDisch.toFixed(1));


        var loadPv = energyUsage.pValues.pv - energyUsage.pValues.stDisch;
        loadPv = Number(loadPv.toFixed(1));
        var loadGrid = energyUsage.pValues.load - energyUsage.pValues.stDisch - loadPv;
        loadGrid = Number(loadGrid.toFixed(1));

//        console.log("loadPv: " + loadPv);
//        console.log("loadGrid: " + loadGrid);
//        energyUsageLoadChart.dataProvider[0].energy = energyUsage.pValues.grid;     //grid
        energyUsageLoadChart.dataProvider[0].energy = loadGrid;     //grid
        energyUsageLoadChart.dataProvider[1].energy = loadPv;                       //pv
        energyUsageLoadChart.dataProvider[2].energy = energyUsage.pValues.stDisch;  //bat
        energyUsageLoadChart.validateData();

        var pvBat = energyUsage.pValues.pv - loadPv;
        pvBat = Number(pvBat.toFixed(1));
        energyUsagePvChart.dataProvider[0].energy = loadPv;
        energyUsagePvChart.dataProvider[1].energy = pvBat;
        energyUsagePvChart.validateData();
    } catch (e) {
    }
};

energyUsage.periodChange = function (period) {
    if (period !== energyUsage.period) {
        energyUsage.period = period;
        for (var i = 0; i < energyUsage.buttons.length; i++) {
            var b = energyUsage.buttons[i];
            if (b.dataset.periodvalue === period) {
                b.classList.add('ui-custom-period-active');
            } else {
                b.classList.remove('ui-custom-period-active');

            }
        }
        energyUsage.setValue();

    }
};
energyUsage.init = function () {
    for (var item in energyUsage.buttons) {
        var b = energyUsage.buttons[item];
        b.onclick = function () {
            energyUsage.periodChange(this.dataset.periodvalue);
        };
    }
};


$(document).ready(function () {
//  .energyUsageenCont .energyUsageenPeriod .energyUsageenPeriodSelcetor
    energyUsage.init();
});

var energyUsageLoadChart = AmCharts.makeChart("energyUsage",
        {
            "type": "pie",
            "angle": 29.7,
            "balloonText": "[[title]] <br><span style='font-size:14px'><b>[[percents]] %</b> ([[value]] kWh)</span>",
            "depth3D": 6,
            "innerRadius": 0,
            "labelRadius": 12,
            "labelText": "[[title]]",
            "minRadius": 0,
            "pullOutRadius": "11%",
            "startAngle": 0,
            "alpha": 1,
            "baseColor": "",
            "colors": [
                "#ff7878", //grid
                "#ffb524", //pv
                "#83ff49" //bat
            ],
            "gradientRatio": [],
            "groupedAlpha": 0,
            "labelColorField": "#25FF00",
            "labelTickAlpha": 0,
            "labelTickColor": "#626262",
            "maxLabelWidth": 212,
            "outlineAlpha": 0.33,
            "outlineColor": "#626262",
            "pulledField": "pooled",
            "pullOutEffect": "elastic",
            "showZeroSlices": true,
            "startDuration": 2,
            "startEffect": "easeOutSine",
            "titleField": "category",
            "valueField": "energy",
            "accessible": false,
            "addClassNames": true,
            "autoDisplay": true,
            "borderColor": "#FFFFFF",
            "color": "#626262",
            "fontSize": 12,
            "handDrawScatter": 37,
            "handDrawThickness": 13,
            "percentPrecision": 1,
            "tapToActivate": false,
            "theme": "default",
            "allLabels": [],
            "responsive": {
                "enabled": true,
                "addDefaultRules": false,
                "rules": [
                    {
                        "maxWidth": 600,
                        "overrides": {
                            "labelsEnabled": false,
                            "legend": {
                                "enabled": false
                            }
                        }
                    }
                ]
            },
            "balloon": {
                "animationDuration": 0.34,
                "color": "#5E5E5E",
                "fadeOutDuration": 0.32,
                "fillAlpha": 0.72,
                "pointerWidth": 8,
                "showBullet": true
            },
            "titles": [],
            "dataProvider": [
                {
                    "category": "Grid",
                    "energy": 0,
                    "color": "red",
                    "pooled": "true",
                    "alpha": "0.8"
                },
                {
                    "category": "PV",
                    "energy": 0,
                    "color": "green",
                    "pooled": "true",
                    "alpha": "0.8"
                },
                {
                    "category": "Battery",
                    "energy": 0,
                    "color": "orange",
                    "pooled": "true",
                    "alpha": "0.8"
                }
            ]
        }
);

var energyUsagePvChart = AmCharts.makeChart("energyUsagePv",
        {
            "type": "pie",
            "angle": 29.7,
            "balloonText": "[[title]] <br><span style='font-size:14px'><b>[[percents]] %</b> ([[value]] kWh)</span>",
            "depth3D": 6,
            "innerRadius": 0,
            "labelRadius": 12,
            "labelText": "[[title]]",
            "minRadius": 0,
            "pullOutRadius": "11%",
            "startAngle": 0,
            "alpha": 1,
            "baseColor": "",
            "colors": [
                "#6e92ff", //load
                "#83ff49"   //bat
            ],
            "gradientRatio": [],
            "groupedAlpha": 0,
            "labelColorField": "#25FF00",
            "labelTickAlpha": 0,
            "labelTickColor": "#626262",
            "maxLabelWidth": 212,
            "outlineAlpha": 0.33,
            "outlineColor": "#626262",
            "pulledField": "pooled",
            "pullOutEffect": "elastic",
            "showZeroSlices": true,
            "startDuration": 2,
            "startEffect": "easeOutSine",
            "titleField": "category",
            "valueField": "energy",
            "accessible": false,
            "addClassNames": true,
            "autoDisplay": true,
            "borderColor": "#FFFFFF",
            "color": "#626262",
            "fontSize": 12,
            "handDrawScatter": 37,
            "handDrawThickness": 13,
            "percentPrecision": 1,
            "tapToActivate": false,
            "theme": "default",
            "allLabels": [],
            "responsive": {
                "enabled": true,
                "addDefaultRules": false,
                "rules": [
                    {
                        "maxWidth": 600,
                        "overrides": {
                            "labelsEnabled": false,
                            "legend": {
                                "enabled": false
                            }
                        }
                    }
                ]
            },
            "balloon": {
                "animationDuration": 0.34,
                "color": "#5E5E5E",
                "fadeOutDuration": 0.32,
                "fillAlpha": 0.72,
                "pointerWidth": 8,
                "showBullet": true
            },
            "titles": [],
            "dataProvider": [
                {
                    "category": "Load",
                    "energy": 0,
                    "pooled": "true",
                    "alpha": "0.8"
                },
                {
                    "category": "Battery",
                    "energy": 0,
                    "pooled": "true",
                    "alpha": "0.8"
                }
            ]
        }
);