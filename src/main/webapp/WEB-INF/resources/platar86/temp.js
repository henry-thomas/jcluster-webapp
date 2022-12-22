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


var contectMenuObj = {
    content: ['PV', 'Grid', 'BAT'],
    cmArr: [],

    onPowerNameClick: function (it) {
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }
        this.parentElement.children[1].style.width = 'auto';
        createFormulaValue(this, it);
        console.log(it);
    }
};



function createNewCm(el) {

    var cmRoot = document.createElement('ul');
    for (var item in contectMenuObj.content) {
        var cmItem = contectMenuObj.content[item];
        var li = document.createElement('li');
        li.classList.add("uic_cm_element");
        li.textContent = cmItem;
        li.onclick = contectMenuObj.onPowerNameClick.bind(el, cmItem);
        cmRoot.appendChild(li);
    }

    //add option for creating new formula
    var li = document.createElement('li');
    li.textContent = "New Equation";
    li.onclick = function () {
        el.parentElement.children[1].style.width = '100%';
        el.parentElement.children[1].style.margin = 'auto 10px';
        el.parentElement.children[1].style.padding = '10px 0px';

        while (el.hasChildNodes()) {
            el.removeChild(el.firstChild);
        }
        el.classList.add('uic_formulaPanel');
        populateFormula(el);
    }.bind(el);
    cmRoot.appendChild(li);
    li.classList.add("uic_cm_element");
    //add option for creating new formula
    li = document.createElement('li');
    li.classList.add("uic_cm_element");
    li.textContent = "Static Value";
    li.onclick = function () {
        while (el.hasChildNodes()) {
            el.removeChild(el.firstChild);
        }
        el.parentElement.children[1].style.width = 'auto';
        el.classList.add('uic_formulaPanel');
        createFormulaValue(el, 1);
    }.bind(el);
    cmRoot.appendChild(li);

    el.appendChild(cmRoot);

    var a = $(cmRoot).puicontextmenu({
        autoDisplay: false,
        target: $(el)
    }).addClass('uic_cm_root');
    el.onclick = function (contextMenu, element) {
        console.log('sdfsdfsdfsdf');
        contextMenu.puicontextmenu().show();
    }.bind(el, a, el);
    console.log(a);
    return a;
}
;

function createFormulaValue(panel, value) {

    createNewCm(panel);
    if (typeof value === 'object') {
        populateFormula(panel, value);
    } else if (typeof value === 'number') {
        var element = document.createElement("INPUT");
        element.classList.add("uic_numberInput");
        element.setAttribute('type', 'number');
        element.setAttribute('value', value);
        panel.appendChild(element);

    } else if (typeof value === 'string') {
        var element = document.createElement('span');
        element.classList.add('uic_formulaVal');
        element.textContent = value;
        panel.appendChild(element);
    }
}


function populateFormula(formulaPanel, eqObj) {
    formulaPanel.classList.add('uic_formulaPanel');
    eqObj = eqObj || {};
    var formulaInnerValue = document.createElement('div');
    formulaInnerValue.classList.add('uic_InerValue');

    var formulaLefttValue = document.createElement('div');
    formulaLefttValue.classList.add('uic_Value');
    formulaLefttValue.classList.add('uic_formulaVal');

    var formulaRightValue = document.createElement('div');
    formulaRightValue.classList.add('uic_Value');
    formulaRightValue.classList.add('uic_formulaVal');


    var leftParenthesis = document.getElementById('leftParenthesis').cloneNode(true);
    leftParenthesis.classList.add('uic_parenthesis');

    var rightParenthesis = document.getElementById('rightParenthesis').cloneNode(true);
    rightParenthesis.classList.add('uic_parenthesis');

    if (eqObj.sign === undefined || (eqObj.sign !== '+' && eqObj.sign !== '-' && eqObj.sign !== '*' && eqObj.sign !== '/')) {
        eqObj.sign = '*';
    }

    var formulaEqua = document.createElement('span');
    formulaEqua.classList.add('uic_formulaEqu');
    formulaEqua.classList.add('uic_Value');
    formulaEqua.textContent = eqObj.sign;
    formulaEqua.onclick = function (parrentPanel) {
        if (this.textContent === "+") {
            this.textContent = "-";
        } else if (this.textContent === "-") {
            this.textContent = "/";
        } else if (this.textContent === "/") {
            this.textContent = "*";
        } else if (this.textContent === "*") {
            this.textContent = "+";
        }
        parrentPanel.eq = " this.textContent";
    }.bind(formulaEqua, formulaPanel);
    //add in order

    formulaPanel.appendChild(leftParenthesis);
    formulaPanel.appendChild(formulaInnerValue);
    formulaPanel.appendChild(rightParenthesis);

    formulaInnerValue.appendChild(formulaLefttValue);
    formulaInnerValue.appendChild(formulaEqua);
    formulaInnerValue.appendChild(formulaRightValue);

    if (eqObj.leftVal === undefined) {
        if (contectMenuObj.content.length > 0) {
            eqObj.leftVal = contectMenuObj.content[0];
        } else {
            eqObj.leftVal = 1;
        }
    }

    if (eqObj.rightVal === undefined) {
        if (contectMenuObj.content.length > 0) {
            eqObj.rightVal = contectMenuObj.content[0];
        } else {
            eqObj.rightVal = 1;
        }
    }

    createFormulaValue(formulaLefttValue, eqObj.leftVal);
    createFormulaValue(formulaRightValue, eqObj.rightVal);

    addHoverEffectToEqElement(formulaEqua);

    addHoverEffectToElement(formulaLefttValue);
    addHoverEffectToElement(formulaRightValue);
}

function createNewFormula(eqObj) {
    eqObj = eqObj || {};

    var rootPanel = document.querySelector(".calcFormula-panel");
    contectMenuObj.cm = createNewCm(rootPanel);

    rootPanel.eqObj = eqObj;

    var formulaRoot = document.createElement('div');
    rootPanel.appendChild(formulaRoot);
    formulaRoot.classList.add('uic_mainRoot');

    var saveIcon = document.createElement("span");
    saveIcon.classList.add("fa");
    saveIcon.classList.add("uic_iconSave");
    saveIcon.classList.add("uic_icon");
    saveIcon.classList.add("fa-save");
    formulaRoot.appendChild(saveIcon);

    var deleteIcon = document.createElement("span");
    deleteIcon.classList.add("uic_iconDelete");
    deleteIcon.classList.add("fa");
    deleteIcon.classList.add("uic_icon");
    deleteIcon.classList.add("fa-trash");
    formulaRoot.appendChild(deleteIcon);

    var calcNameInput = document.createElement("INPUT");
    calcNameInput.classList.add("uic_nameInput");
    calcNameInput.setAttribute('type', 'text');
    if (eqObj.name === undefined || typeof eqObj.name !== 'string') {
        eqObj.name = 'NoName';
    }
    calcNameInput.setAttribute('value', eqObj.name);
    formulaRoot.appendChild(calcNameInput);

    var formulaPanel = document.createElement('div');
    formulaRoot.appendChild(formulaPanel);
    formulaPanel.classList.add('uic_formulaPanel');
    formulaPanel.classList.add('uic_formulaPanelRoot');

    populateFormula(formulaPanel, eqObj);

    console.log(formulaPanel);
}

createNewFormula({
    name: 'somePowerName',
    sign: '*',
    leftVal: 3,
    rightVal: {
        sign: '*',
        leftVal: 'LOAD',
        rightVal: {
            sign: '*',
            leftVal: 'LOAD',
            rightVal: 'PV'
        }
    }
});

function addHoverEffectToEqElement(el) {
    el.onmouseover = function () {
        $(this).siblings().stop().addClass('uic_formulaEqHover');
        $(this).parent().siblings().stop().addClass('uic_formulaEqHover');
    };
    el.onmouseleave = function () {
        $(this).siblings().stop().removeClass('uic_formulaEqHover');
        $(this).parent().siblings().removeClass('uic_formulaEqHover');
    };
}

function addHoverEffectToElement(el) {

    el.onmouseenter = function () {
        $('.uic_formulaValueHover').removeClass('uic_formulaValueHover');
        console.log('asdf');
        $(this).addClass('uic_formulaValueHover');
    };

    el.onmouseleave = function () {
        $(this).removeClass('uic_formulaValueHover');
        if ($(this).parent().parent()[0].onmouseenter) {
            $(this).parent().parent()[0].onmouseenter();
        }
    };
}
