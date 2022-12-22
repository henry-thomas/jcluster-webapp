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

var htmlUtils = {};

htmlUtils.createDataPanelRow = function (rootPanel, label, value, unit, valueClassName) {
    var mainPanel;
    if (typeof rootPanel === 'string') {
        mainPanel = document.getElementById(rootPanel);
    } else if (typeof rootPanel === 'object') {
        mainPanel = rootPanel;
    }
//    <div class="actDataPanel">
//        <span>Status:</span><span class="statSccCharging">N/A</span><span></span>
//    </div>

    if (mainPanel !== undefined) {
        const divNode = document.createElement('div');
        divNode.classList.add('actDataPanel');


        const labelElement = document.createElement('span');
        labelElement.textContent = label;
        divNode.appendChild(labelElement);

        const valueElement = document.createElement('span');
        valueElement.textContent = value;
        if (valueClassName !== undefined) {
            valueElement.classList.add(valueClassName);
        }
        divNode.appendChild(valueElement);

        const unitElement = document.createElement('span');
        unitElement.textContent = unit;
        divNode.appendChild(unitElement);

        mainPanel.appendChild(divNode);
    }
};

