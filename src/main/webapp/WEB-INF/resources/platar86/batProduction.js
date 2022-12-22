/* 
 * Copyright (C) 2018 platar86
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


var batProd = {
    boxLabelState: [],
    boxLabel: [],

    initBlabel: function () {
        let el = document.getElementById("deviceMonitorFormID:selectedLabelHidden") || document.getElementById('mainTabView:deviceMonitorFormID:selectedLabelHidden');
        el.value = JSON.stringify([1, 2, 3, 4]);

//        document.getElementById("deviceMonitorFormID:selectedLabelHidden").value = JSON.stringify([1, 2, 3, 4]);
        for (var i = 0; i < 4; i++) {
            batProd.boxLabel[i] = document.getElementsByClassName('batPackgLabelImg')[i];
            batProd.boxLabel[i].state = true;
            batProd.boxLabel[i].labelID = i;

            batProd.boxLabel[i].onclick = function () {
                console.log("onClick label" + this.labelID);
                if (this.state === true) {
                    this.setAttribute('opacity', 0.02);
                } else {
                    this.setAttribute('opacity', 1);
                }
                this.state = !this.state;
                let arr = [];
                for (var i = 0; i < batProd.boxLabel.length; i++) {
                    if (batProd.boxLabel[i].state) {
                        arr.push(i + 1);
                    }
                }
                el.value = JSON.stringify(arr);
                console.log(el.value);
                if (arr.length === 0) {
                    PF('packageLabelPrintButton').disable();
                } else {
                    PF('packageLabelPrintButton').enable();

                }
            };
        }
    }
};

$(document).ready(function () {
//    initAmChart();
    batProd.initBlabel();
    // tc.groupViewChange();

});
