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


/* global dm */

dm.onPowerReceived(function () {
//    console.log('envBen');
//    if (envB !== undefined) {
//        envB.pvValues = dm.powerTypes.PV;
//        envB.dataChange();
//    }
    var pvPower = dm.getPowerPv();
    if (pvPower.dataAvailable) {
        dm.powerTypes.PV.ss = 0;
        envB.pvValues = pvPower;
        envB.dataChange();
    }

});

var envB = {
    buttons: document.getElementsByClassName('envBenPeriodSelcetor'),
    values: document.getElementsByClassName('envBenVal'),
    period: 'today',
    envValues: {
        h20: 0,
        co2: 0,
        car: 0
    }
};



envB.dataChange = function () {
    try {
        var energy = 0;
        switch (envB.period) {
            case 'today':
                {
                    energy = envB.pvValues.sumData.dailyEnergyWh;
                }
                break;
            case 'monthly':
                {
                    energy = envB.pvValues.sumData.monthlyEnergyWh;
                }
                break;
            case 'yearly':
                {
                    energy = envB.pvValues.sumData.yearlyEnergyWh;
                }
                break;
            case 'total':
                {
                    energy = envB.pvValues.sumData.energyWh;
                }
                break;
        }
        envB.envValues.h20 = (energy / 1000) * 1.35;
        envB.envValues.co2 = (energy / 1000) * 0.9;
        envB.envValues.car = (energy / 1000) * 8.2;

        if (dm.electricityTariff !== undefined) {
            document.getElementsByClassName('savingsDaily')[0].textContent = 'R' + ((envB.pvValues.sumData.dailyEnergyWh / 1000) * dm.electricityTariff).toFixed(1);
            document.getElementsByClassName('savingsMonthly')[0].textContent = 'R' + ((envB.pvValues.sumData.monthlyEnergyWh / 1000) * dm.electricityTariff).toFixed(1);
            document.getElementsByClassName('savingsYearly')[0].textContent = 'R' + ((envB.pvValues.sumData.yearlyEnergyWh / 1000) * dm.electricityTariff).toFixed(1);
            document.getElementsByClassName('savingsTotal')[0].textContent = 'R' + ((envB.pvValues.sumData.energyWh / 1000) * dm.electricityTariff).toFixed(1);
        }
        ;



        if (!isNaN(envB.envValues.h20)) {
            envB.values[0].textContent = envB.envValues.h20.toFixed(1) + ' l';
        }
        if (!isNaN(envB.envValues.co2)) {
            envB.values[1].textContent = envB.envValues.co2.toFixed(1) + ' kg';
        }
        if (!isNaN(envB.envValues.car)) {
            envB.values[2].textContent = envB.envValues.car.toFixed(1) + ' km';
        }

    } catch (e) {

    }

};

envB.setValue = function () {
    for (var i = 0; i < envB.values.length; i++) {
        var v = envB.values[i];
        v.style.setProperty('font-size', '0');
    }
    setTimeout(function () {
        envB.dataChange();
        for (var i = 0; i < envB.values.length; i++) {
            var v = envB.values[i];
            v.style.setProperty('font-size', 'x-large');
        }
    }, 400);
};

envB.periodChange = function (period) {
    if (period !== envB.period) {
        envB.period = period;
        for (var i = 0; i < envB.buttons.length; i++) {
            var b = envB.buttons[i];
            if (b.dataset.periodvalue === period) {
                b.classList.add('ui-custom-period-active');
            } else {
                b.classList.remove('ui-custom-period-active');

            }
        }
        envB.setValue();
    }
};
envB.init = function () {
    for (var item in envB.buttons) {
        var b = envB.buttons[item];
        b.onclick = function () {
            envB.periodChange(this.dataset.periodvalue);
        };
    }
};


$(document).ready(function () {
//  .envBenCont .envBenPeriod .envBenPeriodSelcetor
    envB.init();
});