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
OutputExpressionSelector.prototype.setSource = function (value) {
    let arr = value.split('#');
    if (arr.length === 4) {
        this.initVal.state = arr[0] === 'true';
        this.initVal.delay = Number(arr[1]);
        this.initVal.schdule = arr[2];
        this.initVal.treeSel = arr[3];
        this.initVal.treeSelFirst = arr[3].split('&')[0];
        this.initVal.treeSelSecond = arr[3].split('&')[1];
    }
    this.value = value | '';

};

function OutputExpressionSelector(element, expressionTreeOptions, value) {
    value = value || '';
    if (element !== undefined) {
//        value = 'false#3#06:34-22:43_4-3#powerService,outputPower,bank1-dischargingPower,powerW,eq,fixedValue,3&powerService,outputPower,bank1-dischargingPower,powerW,eq,secondObject,powerService,outputPower,bank1-dischargingPower,totalEnergy';
        this.initVal = {};
        this.setSource(value);
        this.el = {};
        this.expressionTreeOptions = expressionTreeOptions;
        this.init(element);
        element.scheduleSelector = this;
        this.recalcOutput();
    } else {
        console.log('Can not create OutputExpressionSelector missing parrent element');
    }
}


OutputExpressionSelector.prototype.init = function (element) {
  
    let container = document.createElement('div');
    container.classList.add('smdui_expressionWrapper');
    element.appendChild(container);
    this.el.container = container;

    let headerStatePanel = document.createElement('div');
    headerStatePanel.classList.add('smdui_expressionStatePanel');
    headerStatePanel.classList.add('smdui_expressionPanel');
    container.appendChild(headerStatePanel);
    this.el.headerPanel = headerStatePanel;

    let headerSpanExprTarget = document.createElement('span');
//    headerSpanExprTarget.classList.add('expressionState');
    headerSpanExprTarget.textContent = 'Expression Target State';
    headerStatePanel.appendChild(headerSpanExprTarget);

    let radioOnLabel = document.createElement('label');
    radioOnLabel.textContent = 'ON';
    headerStatePanel.appendChild(radioOnLabel);

    let headerInputRadioOn = document.createElement('input');
    headerInputRadioOn.type = 'radio';
    headerInputRadioOn.name = 'expressionOutcome';
    headerInputRadioOn.value = true;
    radioOnLabel.appendChild(headerInputRadioOn);
    headerInputRadioOn.onchange = this.recalcOutput.bind(this, 'stateChange', true);
    this.el.stateOnRadio = headerInputRadioOn;

    let radioOffLabel = document.createElement('label');
    radioOffLabel.textContent = 'OFF';
    headerStatePanel.appendChild(radioOffLabel);

    let headerInputRadioOff = document.createElement('input');
    headerInputRadioOff.type = 'radio';
    headerInputRadioOff.name = 'expressionOutcome';
    headerInputRadioOff.value = false;
    radioOffLabel.appendChild(headerInputRadioOff);
    headerInputRadioOff.onchange = this.recalcOutput.bind(this, 'stateChange', false);
    this.el.stateOffRadio = headerInputRadioOff;

    if (this.initVal.state) {
        headerInputRadioOff.checked = false;
        headerInputRadioOn.checked = true;
    } else {
        headerInputRadioOff.checked = true;
        headerInputRadioOn.checked = false;
    }

    //delay pannel
    let headerPanelDelay = document.createElement('div');
    container.appendChild(headerPanelDelay);
    headerPanelDelay.classList.add('smdui_expressionPanel');
    this.el.headerPanelDelay = headerPanelDelay;

    let delayTitle = document.createElement('label');
    delayTitle.textContent = 'Delayed Trigger: ';
    headerPanelDelay.appendChild(delayTitle);

    let headerDelayInput = document.createElement('input');
    headerDelayInput.type = 'number';
    headerDelayInput.name = 'expressionOutcome';
    headerDelayInput.value = this.initVal.delay || 0;
    headerDelayInput.oninput = this.recalcOutput.bind(this, 'delayChange');
    this.el.delayInput = headerDelayInput;
    delayTitle.appendChild(headerDelayInput);

    let scheduleTitle = document.createElement('span');
    scheduleTitle.textContent = 'sec';
    headerPanelDelay.appendChild(scheduleTitle);

//    let span = document.createElement('span');
//    span.textContent = 'Delayed Trigger';
//    headerPanelDelay.appendChild(span);

    //schedule 

    let schedulePanel = document.createElement('div');
    container.appendChild(schedulePanel);
    this.el.schedulePanel = schedulePanel;
    schedulePanel.classList.add('smdui_expressionPanel');
    this.schedule = new ScheduleSelector(schedulePanel, this.initVal.schdule);
    this.schedule.onchange = function (schedule, value) {
//        console.log('schedule on change');
        this.recalcOutput(schedule, value);
    }.bind(this);

    //expression1 

    let expressionFirstPanel = document.createElement('div');
    container.appendChild(expressionFirstPanel);
    expressionFirstPanel.classList.add('smdui_expressionPanel');
    this.el.expressionFirstPanel = expressionFirstPanel;

    let expressionTitle = document.createElement('span');
    expressionTitle.textContent = 'Expression 1';
    expressionFirstPanel.appendChild(expressionTitle);

    this.expressionFirst = new TreeSelectorUI(expressionFirstPanel, this.expressionTreeOptions, this.initVal.treeSelFirst);

    let addExpressionButton = document.createElement('button');
    addExpressionButton.type = 'button';
    addExpressionButton.textContent = 'Add Logical AND';
    this.el.addExpressionButton = addExpressionButton;
    container.appendChild(addExpressionButton);
    addExpressionButton.onclick = function (expres) {
        this.style.display = 'none';
        expres.el.removeExpressionButton.style.display = 'block';
        expres.el.expressionSecondPanel.style.display = 'flex';
        expres.logicalAndEnabled = true;
    }.bind(addExpressionButton, this);

    let removeExpressionButton = document.createElement('button');
    removeExpressionButton.type = 'button';
    removeExpressionButton.textContent = 'Remove Logical AND';
    removeExpressionButton.style.display = 'none';
    this.el.removeExpressionButton = removeExpressionButton;
    container.appendChild(removeExpressionButton);

    removeExpressionButton.onclick = function (expres) {
        this.style.display = 'none';
        expres.el.addExpressionButton.style.display = 'flex';
        expres.el.expressionSecondPanel.style.display = 'none';
        expres.logicalAndEnabled = false;
    }.bind(removeExpressionButton, this);

    let expressionSecondPanel = document.createElement('div');
    container.appendChild(expressionSecondPanel);
    expressionSecondPanel.classList.add('smdui_expressionPanel');
    expressionSecondPanel.style.display = 'none';

    let expressionSecondTitle = document.createElement('span');
    expressionSecondTitle.textContent = 'Expression 2';
    expressionSecondPanel.appendChild(expressionSecondTitle);
    this.el.expressionSecondPanel = expressionSecondPanel;
    this.expressionSecond = new TreeSelectorUI(expressionSecondPanel, this.expressionTreeOptions, this.initVal.treeSelSecond);

    this.expressionFirst.onchange = function (treeSelector, treeSelVal) {
        console.log('@ Output Expression');
        this.recalcOutput();
    }.bind(this);
    this.expressionSecond.onchange = function (treeSelector, treeSelVal) {
        console.log('@ Output Expression');
        this.recalcOutput();
    }.bind(this);

    if (this.initVal.treeSelSecond !== undefined) {
        addExpressionButton.onclick.apply(addExpressionButton, this);
        this.logicalAndEnabled = true;
    }
};


OutputExpressionSelector.prototype.recalcOutput = function () {
    let firstTreeSelVal = this.expressionFirst.value;
    let second = this.expressionSecond.value;
    let delay = Number(this.el.delayInput.value) || 0;
    let state = this.el.stateOnRadio.checked ? true : false;
    this.state = state;
    let schedule = this.schedule.value || "";

    let result = state + '#' + delay + '#' + schedule + '#';

    if (firstTreeSelVal !== undefined) {
        result += firstTreeSelVal;
        if (this.logicalAndEnabled === true) {
            result += '&' + second;
        }
    } else {
        result = null;
    }
    this.result = result;

    if (this.onchange !== undefined && typeof (this.onchange) === 'function') {
        this.onchange(this, result);
    }


};