/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by brais, 2019
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 Sout Africa
 *  Phone: 021 555 2181
 *  
 */

/* global dm, AmCharts, PF, devTempData, eStorageTemp */

/*
 * Context Menu Graphic Component Management 
 *
 */

var contextMenu = null;
var choosenPowerType = null;

function showMenu(ev) {
    // Stopping the real right click context menu
    ev.preventDefault();

    choosenPowerType = ev.currentTarget.id;
    const choosenPowerTypeName = choosenPowerType.replace('card', '');
    const gaugeKeyName = document.getElementById('label' + choosenPowerTypeName).innerText;
    document.getElementById('gaugeDialogForm:textAreaGaugeName').value = gaugeKeyName;
    document.getElementById('gaugeDialogForm:hiddenGaugeKey').innerText = choosenPowerTypeName;

    contextMenu.style.top = ev.clientY - 20 + 'px';
    contextMenu.style.left = ev.clientX - 20 + 'px';
    contextMenu.classList.remove('off');
}

function hideMenu() {
    contextMenu.classList.add('off');
}

function addMenuListeners() {
    document.getElementById('setName').addEventListener('click', showDialog);
}

function showDialog() {
    hideMenu();
    PF('dialogWg').show();
}

function saveGaugeName() {
    const gaugeNameValue = document.getElementById('gaugeDialogForm:textAreaGaugeName').value;
    const gaugeNameKey = document.getElementById('gaugeDialogForm:hiddenGaugeKey').innerText;
    updateGaugeName([{name: 'gaugeNameKey', value: gaugeNameKey}, {name: 'gaugeNameValue', value: gaugeNameValue}]);
    PF('dialogWg').hide();
}

function resetGaugeName() {
    const gaugeNameKey = document.getElementById('gaugeDialogForm:hiddenGaugeKey').innerText;
    deleteGaugeName([{name: 'gaugeNameKey', value: gaugeNameKey}]);
    PF('dialogWg').hide();
}

function setGaugeNameValue(args) {
    if (args && args.gaugeNameKey && args.gaugeNameValue) {
        const titleLabel = document.getElementById('label' + args.gaugeNameKey);
        if (titleLabel) {
            titleLabel.innerText = args.gaugeNameValue;
        }
    }
}

/*
 * Gauges Manager Business Logic
 * 
 */

var gaugesManager = {
    // Collection of available Power gauges
    powerGauges: {},
    storageGauge: {},
    play: 1,
    init: function () {
        this.resetAnimation();
    },
    resetAnimation: function () {
        this.play = 1;
        this.updatePowerGaugeComponent();
    },
    pauseAnimation: function () {
        this.play = 0;
    },
    resumeAnimation: function () {
        this.play = 1;
    },
    // Required for switching between the Gauges Dashboard and the Chart Dashboard
    onDashboardChange: function () {
        devTempData.dSwitch.init = true;
        if (devTempData.dSwitch.state === 1) {
            gaugesManager.pauseAnimation();
            devTempData.animateFadeEffect('.mainDashboardGauges');
        } else {
            devTempData.animateFadeEffect('.mainDashboardGauges');
            gaugesManager.resetAnimation();
        }
    },
    updatePowerGaugeComponent: function (powerChart, sumData) {
        if (this.play && powerChart && sumData) {
            // Getting the Power and Rated Power for the Power Gauge
            const arrow = Number(((sumData.powerW || 0) / 1000).toFixed(2));
            const endValue = Math.ceil(Number(((sumData.ratedPowerW || 3) / 1000).toFixed(2)));

            if (powerChart.arrows && powerChart.arrows[0] && powerChart.arrows[0].setValue) {
                powerChart.arrows[0].setValue(arrow);

                if (powerChart.axes && powerChart.axes[0]) {
                    powerChart.axes[0].setBottomText(arrow + ' kW');
                    powerChart.axes[0].endValue = endValue;
                    powerChart.axes[0].valueInterval = endValue % 2 === 0 ? 2 : 1;

                    if (powerChart.axes[0]) {
                        const bands = powerChart.axes[0].bands;
                        if (bands && bands.length > 0) {
                            powerChart.axes[0].bands[bands.length - 1].endValue = endValue;
                        }
                    }
                }
            }
            powerChart.validateNow();
        }
    },
    updatePowerGaugeData: function (typeName, sumData) {
        // Getting other relevant data for the Power Gauge
        if (this.play && typeName && sumData) {
            const dailyEnergy = ((sumData.dailyEnergyWh || 0) / 1000).toFixed(2) + ' kW';
            const weeklyEnergy = ((sumData.weeklyEnergyWh || 0) / 1000).toFixed(2) + ' kW';
            const monthlyEnergy = ((sumData.monthlyEnergyWh || 0) / 1000).toFixed(2) + ' kW';
            const yearlyEnergy = ((sumData.yearlyEnergyWh || 0) / 1000).toFixed(2) + ' kW';

            if (dailyEnergy) {
                const dailyEnergyLabel = document.getElementById('daily' + typeName);
                if (dailyEnergyLabel) {
                    dailyEnergyLabel.innerText = dailyEnergy;
                }
            }
            if (weeklyEnergy) {
                const weeklyEnergyLabel = document.getElementById('weekly' + typeName);
                if (weeklyEnergyLabel) {
                    weeklyEnergyLabel.innerText = weeklyEnergy;
                }
            }
            if (monthlyEnergy) {
                const monthlyEnergyLabel = document.getElementById('monthly' + typeName);
                if (monthlyEnergyLabel) {
                    monthlyEnergyLabel.innerText = monthlyEnergy;
                }
            }
            if (yearlyEnergy) {
                const yearlyEnergyLabel = document.getElementById('yearly' + typeName);
                if (yearlyEnergyLabel) {
                    yearlyEnergyLabel.innerText = yearlyEnergy;
                }
            }
        }
        ;
    },
    updateStorageGaugeComponent: function (storage) {
        let value = Number(storage.capacityP.toFixed(1));
        // Getting the Percentage Capacity for the Storage Gauge
        if (!isNaN(value) && value >= 0 && value <= 100 && gaugesManager.storageGauge) {
            const newStorageData = [{
                    "category": " ",
                    "value1": value,
                    "value2": 100 - value
                }];

            gaugesManager.storageGauge.dataProvider = newStorageData;
            gaugesManager.storageGauge.validateData();
        }
    },
    updateStorageGaugeData: function (storage) {
        if (this.play && storage) {
            let capacitykWh = ((storage.capacityAh * storage.ratedVoltageV) / 1000).toFixed(1);
            let ratedCapacitykWh = ((storage.ratedCapacityAh * storage.ratedVoltageV) / 1000).toFixed(1);
            let powerkW = (storage.powerW / 1000).toFixed(2);
            let remTime = eStorageTemp.calcAvrgCurrent(storage.powerW, (storage.capacityAh * storage.ratedVoltageV));
            if (remTime < 0) {
                remTime *= -1;
            };

            const storageName = 'EnergyStorage';
            
            if (capacitykWh && ratedCapacitykWh) {
                const capacityLabel = document.getElementById('capacity' + storageName);
                if (capacityLabel) {
                    capacityLabel.innerText = capacitykWh + ' (' + ratedCapacitykWh + ')';
                };
            };
            
            if (powerkW) {
                const storagePowerLabel = document.getElementById('storagePower' + storageName);
                if (storagePowerLabel) {
                    storagePowerLabel.innerText = powerkW + ' kW';
                };
            };
            
            if (storage.powerW && remTime) {
                const storageTimingLabel = document.getElementById('storageTimingLabel' + storageName);
                if (storageTimingLabel) {
                    storageTimingLabel.innerText = storage.powerW > 0 ? 'Charging time:' : 'Discharging time:';
                };
                
                const storageTimingValue = document.getElementById('storageTiming' + storageName);
                if (storageTimingValue) {
                    storageTimingValue.innerText = remTime;
                };   
            };
        }
        ;
    },
    // Creating the Gauge object
    getPowerGaugeObject: function (powerType, ratedPower) {
        const endValue = Math.ceil(Number((ratedPower / 1000).toFixed(2)));

        const gaugeObj = {
            "type": "gauge",
            "theme": "light",
            "percentPrecision": 2,
            "precision": -1,
            "axes": [{
                    "id": "GaugeAxis-1",
                    "axisThickness": 1,
                    "axisAlpha": 0.2,
                    "tickAlpha": 0.2,
                    "minorTickInterval": 1,
                    "valueInterval": endValue % 2 === 0 ? 2 : 1,
                    "endAngle": 90,
                    "endValue": endValue,
                    "startAngle": -90,
                    "bottomText": "0 KW",
                    "bottomTextYOffset": -50
                }],
            "arrows": [{
                    "id": "gaugeArrow-1",
                    "borderAlpha": 0.5
                            //"color": "#04a1a9"
                }],
            "allLabels": [],
            "balloon": {},
            "titles": [],
            "export": {
                "enabled": false
            }
        };

        switch (powerType) {
            case 'STORAGE DISCHARGE':
                {
                    gaugeObj.axes[0].bands = [{
                            "id": "GaugeBand-1",
                            "color": "#84b761",
                            "endValue": endValue * 0.5,
                            "startValue": 0
                        }, {
                            "id": "GaugeBand-2",
                            "color": "#fdd400",
                            "endValue": endValue * 0.75,
                            "innerRadius": "94%",
                            "startValue": endValue * 0.5
                        }, {
                            "id": "GaugeBand-3",
                            "color": "#cc4748",
                            "endValue": endValue,
                            "innerRadius": "92%",
                            "startValue": endValue * 0.75
                        }];

                }
                break;
            default:
            {
                gaugeObj.axes[0].bands = [{
                        "id": "GaugeBand-1",
                        "color": "#84b761",
                        "endValue": endValue * 0.3,
                        "startValue": 0
                    }, {
                        "id": "GaugeBand-2",
                        "color": "#fdd400",
                        "endValue": endValue * 0.6,
                        "innerRadius": "94%",
                        "startValue": endValue * 0.3
                    }, {
                        "id": "GaugeBand-3",
                        "color": "#cc4748",
                        "endValue": endValue,
                        "innerRadius": "92%",
                        "startValue": endValue * 0.6
                    }];
            }
        }
        ;
        return gaugeObj;
    },
    getStorageGaugeObject: function () {
        var chartData = [{
                "category": " ",
                "value1": 1,
                "value2": 99
            }];

        const gaugeObj = {
            "theme": "light",
            "type": "serial",
            "depth3D": 100,
            "angle": 30,
            "autoMargins": false,
            "marginLeft": 50,
            "marginRight": 25,
            "marginTop": -10,
            "marginBottom": 50,
            "dataProvider": chartData,
            "valueAxes": [{
                    "stackType": "100%",
                    "gridAlpha": 0
                }],
            "graphs": [{
                    "type": "column",
                    "topRadius": 1,
                    "columnWidth": 1,
                    "showOnAxis": true,
                    "lineThickness": 2,
                    "lineAlpha": 0.5,
                    "lineColor": "#FFFFFF",
                    "fillColors": "00b526",
                    "fillAlphas": 0.8,
                    "valueField": "value1"
                }, {
                    "type": "column",
                    "topRadius": 1,
                    "columnWidth": 1,
                    "showOnAxis": true,
                    "lineThickness": 2,
                    "lineAlpha": 0.5,
                    "lineColor": "#cdcdcd",
                    "fillColors": "#cdcdcd",
                    "fillAlphas": 0.4,
                    "valueField": "value2"
                }],

            "categoryField": "category",
            "categoryAxis": {
                "axisAlpha": 0,
                "labelOffset": 20,
                "gridAlpha": 0
            },
            "export": {
                "enabled": false
            }
        };
        return gaugeObj;
    }
};

dm.onPowerReceived(function () {
    for (var typeName in dm.powerTypes) {
        const powerGauge = dm.powerTypes[typeName];

        if (powerGauge) {
            const powerGaugeData = powerGauge.sumData;
            if (powerGaugeData) {
                gaugesManager.updatePowerGaugeComponent(gaugesManager.powerGauges[typeName], powerGaugeData);
                gaugesManager.updatePowerGaugeData(typeName, powerGaugeData);
            }
        }
    }
});

dm.onStorageReceived(function () {
    if (dm.eStorageArr.dataAvailable) {
        const storage = dm.eStorageArr.sumData;
        if (storage) {
            gaugesManager.updateStorageGaugeComponent(storage);
            gaugesManager.updateStorageGaugeData(storage);
        }
    }
});

$(document).ready(function () {
    // Getting the Custom context menu
    contextMenu = document.querySelector('.context-menu');

    // Adding a listener for leaving the menu and hiding it
    contextMenu.addEventListener('mouseleave', hideMenu);

    // Adding listeners to the Context Menu Items
    addMenuListeners();

    gaugesManager.init();
});

dm.onStorageInit(function createBatteryGauge() {
    // If there is any Storage (Battery) data available
    if (dm.eStorageArr.dataAvailable) {
        let container = document.querySelector('.chartContainer');
        let storage = dm.eStorageArr.sumData;
        let capacitykWh = ((storage.capacityAh * storage.ratedVoltageV) / 1000).toFixed(1);
        let ratedCapacitykWh = ((storage.ratedCapacityAh * storage.ratedVoltageV) / 1000).toFixed(1);
        let powerkW = (storage.powerW / 1000).toFixed(2);
        let remTime = eStorageTemp.calcAvrgCurrent(storage.powerW, (storage.capacityAh * storage.ratedVoltageV));
        if (remTime < 0) {
            remTime *= -1;
        }

        const storageName = 'EnergyStorage';

        const cardContainer = document.createElement('div');
        cardContainer.id = 'card' + storageName;
        cardContainer.classList.add('card');
        cardContainer.classList.add('cardGaugeContainer');
        container.appendChild(cardContainer);

        // Gauge Title
        const titleLabel = document.createElement('label');
        titleLabel.id = 'label' + storageName;
        titleLabel.classList.add('chartTitle');
        titleLabel.innerText = storageName;
        cardContainer.appendChild(titleLabel);
//        getGaugeName([{name: 'gaugeNameKey', value: typeName}]);

        // Gauge Chart
        const chartDiv = document.createElement('div');
        chartDiv.id = 'chart' + storageName;
        chartDiv.classList.add('chartCylinder');
        cardContainer.appendChild(chartDiv);

        // Gauge Data
        const dataGaugeDiv = document.createElement('div');
        dataGaugeDiv.classList.add('dataCylinderGauge');
        cardContainer.appendChild(dataGaugeDiv);

        // Capacity Label
        const capacityLabel = document.createElement('span');
        capacityLabel.classList.add('gaugeEnergyLabel');
        capacityLabel.innerText = 'Capacity:';
        dataGaugeDiv.appendChild(capacityLabel);

        // Capacity Value
        const capacityValue = document.createElement('span');
        capacityValue.classList.add('gaugeEnergyValue');
        capacityValue.id = 'capacity' + storageName;
        capacityValue.innerText = capacitykWh + ' (' + ratedCapacitykWh + ')';
        dataGaugeDiv.appendChild(capacityValue);

        // Storage Power Label
        const storagePowerLabel = document.createElement('span');
        storagePowerLabel.classList.add('gaugeEnergyLabel');
        storagePowerLabel.innerText = 'Power:';
        dataGaugeDiv.appendChild(storagePowerLabel);

        // Storage Power Value
        const storagePowerValue = document.createElement('span');
        storagePowerValue.classList.add('gaugeEnergyValue');
        storagePowerValue.id = 'storagePower' + storageName;
        storagePowerValue.innerText = powerkW + ' kW';
        dataGaugeDiv.appendChild(storagePowerValue);

        // Storage Charging/Discharging Timing Label
        const storageTimingLabel = document.createElement('span');
        storageTimingLabel.classList.add('dataTCylinderLabel');
        storageTimingLabel.classList.add('gaugeEnergyLabel');
        storageTimingLabel.id = 'storageTimingLabel' + storageName;
        storageTimingLabel.innerText = storage.powerW > 0 ? 'Charging time:' : 'Discharging time:';
        dataGaugeDiv.appendChild(storageTimingLabel);

        // Storage Charging/Discharging Timing Value
        const storageTimingValue = document.createElement('span');
        storageTimingValue.classList.add('dataTCylinderValue');
        storageTimingValue.classList.add('gaugeEnergyValue');
        storageTimingValue.id = 'storageTiming' + storageName;
        storageTimingValue.innerText = remTime;
        dataGaugeDiv.appendChild(storageTimingValue);

        gaugesManager.storageGauge = AmCharts.makeChart('chart' + storageName, gaugesManager.getStorageGaugeObject());
    }
});

/* Initally creating the list of Gauges per Power Type Services */
dm.onPowerInit(function createPowerTypeGauges() {
    // If there are Power Types available like Storage Charge and Discharge, PV, Grid, and Loads
    if (dm.powerTypes) {
        for (var item in dm.powerTypes) {
            let power = dm.powerTypes[item];
            // Function that will be executed after PowerType.calcSumData function if it is required
            power.onPowerInit(function (typeName, sumData) {
                if (power.sumData.available) {
                    let container = document.querySelector('.chartContainer');

                    const cardContainer = document.createElement('div');
                    cardContainer.id = 'card' + typeName;
                    cardContainer.classList.add('card');
                    cardContainer.classList.add('cardGaugeContainer');
                    container.appendChild(cardContainer);

                    // Adding the right click listener to the Gauge Card Container
                    cardContainer.addEventListener('contextmenu', showMenu);

                    // Gauge Title
                    const titleLabel = document.createElement('label');
                    titleLabel.id = 'label' + typeName;
                    titleLabel.classList.add('chartTitle');
                    titleLabel.innerText = typeName;
                    cardContainer.appendChild(titleLabel);
                    getGaugeName([{name: 'gaugeNameKey', value: typeName}]);

                    // Gauge Chart
                    const chartDiv = document.createElement('div');
                    chartDiv.id = "chart" + typeName;
                    chartDiv.classList.add('chartGauge');
                    cardContainer.appendChild(chartDiv);

                    // Gauge Data
                    const dataGaugeDiv = document.createElement('div');
                    dataGaugeDiv.classList.add('dataGauge');
                    cardContainer.appendChild(dataGaugeDiv);

                    // Daily Energy Label
                    const dailyEnergyLabel = document.createElement('span');
                    dailyEnergyLabel.classList.add('gaugeEnergyLabel');
                    dailyEnergyLabel.innerText = 'Daily:';
                    dataGaugeDiv.appendChild(dailyEnergyLabel);

                    // Daily Energy Value
                    const dailyEnergyValue = document.createElement('span');
                    dailyEnergyValue.classList.add('gaugeEnergyValue');
                    dailyEnergyValue.id = 'daily' + typeName;
                    dailyEnergyValue.innerText = (sumData.dailyEnergyWh / 1000).toFixed(2) + ' kW';
                    dataGaugeDiv.appendChild(dailyEnergyValue);

                    // Weekly Energy Label
                    const weeklyEnergyLabel = document.createElement('span');
                    weeklyEnergyLabel.classList.add('gaugeEnergyLabel');
                    weeklyEnergyLabel.innerText = 'Weekly:';
                    dataGaugeDiv.appendChild(weeklyEnergyLabel);

                    // Weekly Energy Value
                    const weeklyEnergyValue = document.createElement('span');
                    weeklyEnergyValue.classList.add('gaugeEnergyValue');
                    weeklyEnergyValue.id = 'weekly' + typeName;
                    weeklyEnergyValue.innerText = (sumData.weeklyEnergyWh / 1000).toFixed(2) + ' kW';
                    dataGaugeDiv.appendChild(weeklyEnergyValue);

                    // Monthly Energy Label
                    const monthlyEnergyLabel = document.createElement('span');
                    monthlyEnergyLabel.classList.add('gaugeEnergyLabel');
                    monthlyEnergyLabel.innerText = 'Monthly:';
                    dataGaugeDiv.appendChild(monthlyEnergyLabel);

                    // Monthly Energy Value
                    const monthlyEnergyValue = document.createElement('span');
                    monthlyEnergyValue.classList.add('gaugeEnergyValue');
                    monthlyEnergyValue.id = 'monthly' + typeName;
                    monthlyEnergyValue.innerText = (sumData.monthlyEnergyWh / 1000).toFixed(2) + ' kW';
                    dataGaugeDiv.appendChild(monthlyEnergyValue);

                    // Yearly Energy Label
                    const yearlyEnergyLabel = document.createElement('span');
                    yearlyEnergyLabel.classList.add('gaugeEnergyLabel');
                    yearlyEnergyLabel.innerText = 'Yearly:';
                    dataGaugeDiv.appendChild(yearlyEnergyLabel);

                    // Yearly Energy Value
                    const yearlyEnergyValue = document.createElement('span');
                    yearlyEnergyValue.classList.add('gaugeEnergyValue');
                    yearlyEnergyValue.id = 'yearly' + typeName;
                    yearlyEnergyValue.innerText = (sumData.yearlyEnergyWh / 1000).toFixed(2) + ' kW';
                    dataGaugeDiv.appendChild(yearlyEnergyValue);

                    gaugesManager.powerGauges[typeName] = AmCharts.makeChart('chart' + typeName, gaugesManager.getPowerGaugeObject(typeName, sumData.ratedPowerW));
                }
            });
        }
    }
    ;
});