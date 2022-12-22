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


/* global mainUtils */

var powerCalcManager = {
    selected: null,
    contextMenu: null,
    container: null,
    // Collection of Power Params and Power Calculators
    powerParams: null,
    init: function (params) {
        if (!params)
            return;

        powerCalcManager.powerParams = params;

        powerCalcManager.createContextMenu();
        powerCalcManager.container = document.querySelector('#powerCalculatorBoard');
        for (var item in powerCalcManager.powerParams.powerCalcList) {
            let config = powerCalcManager.powerParams.powerCalcList[item];
            if (!config || !config.confKey || !config.confValue)
                continue;
            let calculator = {title: config.confKey, formula: config.confValue};
            powerCalcManager.createFormula(calculator);
        }
    },
    // Creating an empty silly formula (0 + 0)
    createSimpleFormula: function () {
        // Creating a new Power Calculator
        let calculator = {title: 'New formula', formula: '{"p1": 1, "op": "*", "p2": 1, "powerType": "other"}'};
        powerCalcManager.createFormula(calculator);
    },
    // Creating a formula with the provided settings
    createFormula: function (calculator) {
        if (!calculator && !calculator.title && !calculator.formula || !powerCalcManager.container)
            return;

        let formulaRoot = document.createElement('div');
        powerCalcManager.container.appendChild(formulaRoot);
        formulaRoot.classList.add('uic_mainRoot');

        let headerPanel = document.createElement('div');
        formulaRoot.appendChild(headerPanel);
        headerPanel.classList.add('uic_headerPanel');


        let calcNameInput = document.createElement('INPUT');
        headerPanel.appendChild(calcNameInput);
        calcNameInput.classList.add('uic_nameInput');
        calcNameInput.setAttribute('type', 'text');
        if (calculator.title === undefined || typeof calculator.title !== 'string') {
            calculator.title = 'NoName';
        }
        calcNameInput.setAttribute('value', calculator.title);
        calcNameInput.addEventListener('blur', powerCalcManager.checkRepeated);
        
        let formula = JSON.parse(calculator.formula);
        let powerTypeDD = new SettingPanel(headerPanel, {
            title: 'Power Type',
            toolTip: 'Power Type will determine how this calculated power will be represented on the dashboard and certain charts.',
            type: 'dropDown',
//            args: {seriesOb: seriesOb, ctrlName: ctrlName},
            dropDownConf: {
                val: formula.powerType || "other",
                options: [
                    {label: "PV", value: "pv"},
                    {label: "Load", value: "load"},
                    {label: "Grid", value: "gridConsume"},
                    {label: "Grid Export", value: "gridFeed"},
                    {label: "Generator", value: "gen"},
                    {label: "Other", value: "other"}
                ]
            },

            onChange: function (val, args, settingsPanel) {
                formula.powerType = val;
            }.bind(this)
        });
        powerTypeDD.onChangeCb();

        let iconsPanel = document.createElement('div');
        headerPanel.appendChild(iconsPanel);
        iconsPanel.classList.add('uic_iconPanel');

        let displayIcon = document.createElement('span');
        iconsPanel.appendChild(displayIcon);
        displayIcon.classList.add('uic_iconDisplay');
        displayIcon.classList.add('fa');
        displayIcon.classList.add('uic_icon');
        displayIcon.addEventListener('click', powerCalcManager.displayWithGroup);
        if (calculator.formula && calculator.formula.includes('displayWithGroups')) {
            displayIcon.classList.add('fa-check-square-o');
        } else {
            displayIcon.classList.add('fa-square-o');
        }

        let displayLabel = document.createElement('span');
        iconsPanel.appendChild(displayLabel);
        displayLabel.classList.add('uic_labelDisplay');
        displayLabel.innerHTML = 'Display with Groups';

        let deleteIcon = document.createElement('span');
        iconsPanel.appendChild(deleteIcon);
        deleteIcon.classList.add('uic_iconDelete');
        deleteIcon.classList.add('fa');
        deleteIcon.classList.add('uic_icon');
        deleteIcon.classList.add('fa-trash');
        deleteIcon.addEventListener('click', powerCalcManager.deleteFormula);

        let formulaPanel = document.createElement('div');
        formulaRoot.appendChild(formulaPanel);
        formulaPanel.classList.add('uic_formulaPanel');
        formulaPanel.classList.add('uic_formulaPanelRoot');
        
        formulaRoot.powerTypeDD = powerTypeDD;

        powerCalcManager.populateFormula(formulaPanel, JSON.parse(calculator.formula));
    },
    createFormulaValue: function (panel, value) {
        powerCalcManager.addContextMenuEvent(panel);
        if (mainUtils.isObject(value)) {
            panel.classList.add('uic_formulaPanel');
            powerCalcManager.populateFormula(panel, value);
        } else if (mainUtils.isNumber(value)) {
            var element = document.createElement("INPUT");
            element.classList.add("uic_numberInput");
            element.setAttribute('type', 'number');
            element.setAttribute('value', value);
            // Required for avoiding calling the events managed and triggered by the parent node
            element.addEventListener('click', function () {
                window.event.stopPropagation();
            });
            panel.appendChild(element);
        } else if (mainUtils.isString(value))
        {
            var element = document.createElement('span');
            element.classList.add('uic_formulaVal');
            element.textContent = value;
            panel.appendChild(element);
        }
    },
    populateFormula: function (formulaPanel, formula) {
        formulaPanel.classList.add('uic_formulaPanel');

        var formulaInnerValue = document.createElement('div');
        formulaInnerValue.classList.add('uic_InerValue');

        var formulaLefttValue = document.createElement('div');
        formulaLefttValue.classList.add('uic_Value');
        formulaLefttValue.classList.add('uic_formulaVal');

        var formulaRightValue = document.createElement('div');
        formulaRightValue.classList.add('uic_Value');
        formulaRightValue.classList.add('uic_formulaVal');

        var leftParenthesis = document.getElementById('leftParenthesis').cloneNode(true);
        leftParenthesis.classList.remove('hidden');
        leftParenthesis.classList.add('uic_parenthesis');

        var rightParenthesis = document.getElementById('rightParenthesis').cloneNode(true);
        rightParenthesis.classList.remove('hidden');
        rightParenthesis.classList.add('uic_parenthesis');

        if (formula.op === undefined || !['+', '-', '*', '/'].includes(formula.op)) {
            formula.op = '*';
        }

        var formulaOp = document.createElement('span');
        formulaOp.classList.add('uic_formulaEqu');
        formulaOp.classList.add('uic_Value');
        formulaOp.textContent = formula.op;
        formulaOp.onclick = function () {
            window.event.stopPropagation();
            switch (formulaOp.textContent) {
                case '+':
                    formulaOp.textContent = '-';
                    break;
                case "-":
                    formulaOp.textContent = '*';
                    break;
                case '*':
                    formulaOp.textContent = '/';
                    break;
                case "/":
                    formulaOp.textContent = '+';
                    break;
            }
        };

        formulaPanel.appendChild(leftParenthesis);
        formulaPanel.appendChild(formulaInnerValue);
        formulaPanel.appendChild(rightParenthesis);

        formulaInnerValue.appendChild(formulaLefttValue);
        formulaInnerValue.appendChild(formulaOp);
        formulaInnerValue.appendChild(formulaRightValue);

        if (formula.p1 === undefined) {
            if (powerCalcManager.contextMenuObj.content.length > 0) {
                formula.p1 = powerCalcManager.contextMenuObj.content[0];
            } else {
                formula.p1 = 1;
            }
        }

        if (formula.p2 === undefined) {
            if (powerCalcManager.contextMenuObj.content.length > 0) {
                formula.p2 = powerCalcManager.contextMenuObj.content[0];
            } else {
                formula.p2 = 1;
            }
        }

        powerCalcManager.createFormulaValue(formulaLefttValue, formula.p1);
        powerCalcManager.createFormulaValue(formulaRightValue, formula.p2);

        powerCalcManager.addHoverEffectToEqElement(formulaOp);

        powerCalcManager.addHoverEffectToElement(formulaLefttValue);
        powerCalcManager.addHoverEffectToElement(formulaRightValue);
    },
    deleteFormula: function () {
        let button = window.event.currentTarget;
        if (!button)
            return;
        let formula = button.closest('.uic_mainRoot');
        if (!formula)
            return;
        powerCalcManager.container.removeChild(formula);
    },
    addFormula: function () {
        let panel = powerCalcManager.selected;
        while (panel.firstChild)
            panel.removeChild(panel.firstChild);
        panel.classList.add('uic_formulaPanel');
        let newFormula = {p1: 1, op: '*', p2: 1};
        powerCalcManager.populateFormula(panel, newFormula);
        powerCalcManager.hideContextMenu();
    },
    addContextMenuEvent: function (el) {
        el.addEventListener('contextmenu', powerCalcManager.showContextMenu);
        el.addEventListener('click', powerCalcManager.showContextMenu);
    },
    addHoverEffectToEqElement: function (el) {
        el.onmouseover = function () {
            $(this).siblings().stop().addClass('uic_formulaEqHover');
            $(this).parent().siblings().stop().addClass('uic_formulaEqHover');
        };
        el.onmouseleave = function () {
            $(this).siblings().stop().removeClass('uic_formulaEqHover');
            $(this).parent().siblings().removeClass('uic_formulaEqHover');
        };
    },
    addHoverEffectToElement: function (el) {
        el.onmouseover = function () {
            $('.uic_formulaValueHover').removeClass('uic_formulaValueHover');
            $(this).addClass('uic_formulaValueHover');
        };
        el.onmouseleave = function () {
            $(this).removeClass('uic_formulaValueHover');
            if ($(this).parent().parent()[0].onmouseenter) {
                $(this).parent().parent()[0].onmouseenter();
            }
        };
    },
    displayWithGroup: function () {
        let button = window.event.currentTarget;
        if (!button)
            return;
        if (button.classList.contains('fa-square-o')) {
            button.classList.remove('fa-square-o');
            button.classList.add('fa-check-square-o');
        } else {
            button.classList.remove('fa-check-square-o');
            button.classList.add('fa-square-o');
        }
    },
    checkRepeated: function () {
        let title = window.event.currentTarget;
        if (!title || !title.value || !title.value.trim()) {
            title.classList.add('uic_wrongNameInput');
            mainUtils.showErrorMessage('Please provide a non-empty title', 'Not valid title');
            return;
        }

        if (title.classList.contains('uic_wrongNameInput'))
            title.classList.remove('uic_wrongNameInput');

        title.value = title.value.trim();

//            return;
//        
//        let value = title.value.trim();
//        if (powerCalcManager.powerCalculators.includes(value)) {

//        else {
//            powerCalcManager.powerCalculators.push(title.value.trim());
//        }
    },
    createContextMenu: function () {
        powerCalcManager.contextMenu = document.querySelector('#param-context-menu');
        powerCalcManager.contextMenu.addEventListener('mouseleave', powerCalcManager.hideContextMenu);
        const ul = powerCalcManager.contextMenu.querySelector('.context-menu-items');

        let li = null;
        for (var item in powerCalcManager.powerParams.powerList) {
            const param = powerCalcManager.powerParams.powerList[item];

            li = document.createElement('li');
            li.classList.add('context-menu-item');
            li.innerHTML = param;
            li.addEventListener('click', powerCalcManager.setPower);
            ul.appendChild(li);
        }

        // For setting a number value
        li = document.createElement('li');
        li.classList.add('context-menu-item');
        li.innerHTML = 'Set number';
        li.addEventListener('click', powerCalcManager.setNumber);
        ul.appendChild(li);

        // For creating a brand new formula
        li = document.createElement('li');
        li.classList.add('context-menu-item');
        li.innerHTML = 'Create formula';
        li.addEventListener('click', powerCalcManager.addFormula);
        ul.appendChild(li);

        if (!mainUtils.isMobileBrowser())
            return;

        // For closing the ContextMenu in Mobile Browsers
        li = document.createElement('li');
        li.classList.add('context-menu-item');
        li.classList.add('close');
        li.classList.add('fa');
        li.classList.add('fa-close');
        li.innerHTML = ' Close';
        li.addEventListener('click', powerCalcManager.hideContextMenu);
        ul.appendChild(li);
    },
    // Building dynamically the context menu in order to set the clicked parameter
    showContextMenu: function () {
        window.event.preventDefault();
        // Required for avoiding calling the events managed and triggered by the parent nodes
        window.event.stopPropagation();
        powerCalcManager.selected = window.event.currentTarget;
        powerCalcManager.contextMenu.style.top = window.event.clientY - 60 + 'px';
        powerCalcManager.contextMenu.style.left = window.event.clientX - 20 + 'px';
        powerCalcManager.contextMenu.classList.remove('off');
    },
    hideContextMenu: function () {
        window.event.preventDefault();
        window.event.stopPropagation();
        if (!powerCalcManager.contextMenu.classList.contains('off')) {
            powerCalcManager.contextMenu.classList.add('off');
        }
    },
    setPower: function () {
        powerCalcManager.setValue(window.event.currentTarget.innerHTML);
    },
    setNumber: function () {
        powerCalcManager.setValue(1);
    },
    setValue: function (value) {
        window.event.preventDefault();
        // Required for avoiding calling the events managed and triggered by the parent nodes
        window.event.stopPropagation();
        let panel = powerCalcManager.selected;
        panel.classList.remove('uic_formulaPanel');
        while (panel.firstChild)
            panel.removeChild(panel.firstChild);
        powerCalcManager.createFormulaValue(panel, value);
        powerCalcManager.hideContextMenu();
    },
    updatePowerCalculators: function () {
        let powerCalculators = [];
        let list = powerCalcManager.container.querySelectorAll('.uic_mainRoot');
        if (!list || list.length === 0)
            return;

        let save = 1;
        let powerTitles = [];

        for (var i = 0; i < list.length; i++) {
            let formula = list[i];
            let powerCalculator = {};
            let title = formula.querySelector('.uic_nameInput');
            powerCalculator.title = title.value;
            if (!title.value || powerCalcManager.powerParams.powerList.includes(title.value) || powerTitles.includes(title.value))
            {
                if (!title.classList.contains('uic_wrongNameInput'))
                    title.classList.add('uic_wrongNameInput');
                save = 0;
                break;
            }

            powerTitles.push(title.value);
            powerCalculator.formula = powerCalcManager.getPowerCalculator(formula.querySelector(':scope > .uic_formulaPanel'));
            powerCalculator.formula.powerType = list[i].powerTypeDD.getValue();
            if (formula.querySelector('.fa-check-square-o')) {
                powerCalculator.formula.displayWithGroups = 1;
            }
            powerCalculators.push(powerCalculator);
        }

        if (!save) {
            mainUtils.showErrorMessage('Please provide non-repeated and non-empty titles', 'Not valid titles');
            return;
        }


        console.log(JSON.stringify(powerCalculators));
        savePowerCalculators([{name: 'calculators', value: JSON.stringify(powerCalculators)}]);
    },
    getPowerCalculator: function (f) {
        if (!f)
            return '0';

        if (f.classList.contains('uic_formulaPanel')) {
            let formula = {};

            let innerValue = f.querySelector(':scope > .uic_InerValue');
            let params = innerValue.querySelectorAll(':scope > div.uic_Value');
            formula.p1 = powerCalcManager.getPowerCalculator(params[0]);
            formula.op = innerValue.querySelector(':scope > .uic_formulaEqu').innerText;
            formula.p2 = powerCalcManager.getPowerCalculator(params[1]);

//            let powerType = 
            return formula;
        }
        if (f.classList.contains('uic_formulaVal')) {
            let power = f.querySelector(':scope > .uic_formulaVal');
            if (power) {
                return power.innerText ? power.innerText : '';
            }
            let number = f.querySelector(':scope > .uic_numberInput').value;
            return isNaN(number) ? 0 : Number(number);
        }
    },
    clearPowerCalculators: function () {
        let list = powerCalcManager.container.querySelectorAll('.uic_mainRoot');
        if (!list || list.length === 0)
            return;

        for (var i = 0; i < list.length; i++) {
            powerCalcManager.container.removeChild(list[i]);
        }
        clearAllPowerCalculators();
    }
};