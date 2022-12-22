

ScheduleSelector.prototype.setSource = function (scheduleObj) {


    scheduleObj = scheduleObj || {};

    scheduleObj.time = scheduleObj.time || {};
    scheduleObj.time.enabled = scheduleObj.time.enabled || false;
    scheduleObj.time.fromTime = scheduleObj.time.fromTime || '00:00';
    scheduleObj.time.toTime = scheduleObj.time.toTime || '23:59';

    scheduleObj.week = scheduleObj.week || {};
    scheduleObj.week.enabled = scheduleObj.week.enabled || false;
    scheduleObj.week.weekOptionList = scheduleObj.week.dateInt ||
            {
                'MON': 1,
                'TUE': 2,
                'WED': 3,
                'THU': 4,
                'FRI': 5,
                'SAT': 6,
                'SUN': 7
            };
    scheduleObj.week.selection = scheduleObj.week.selection || [];

    this.schedule = scheduleObj;
};
ScheduleSelector.prototype.initScheduleValue = function (initVal) {
    if (typeof (initVal) === 'string' && initVal.length > 0) {
        let arr = initVal.split('_');
        if (arr.length === 2) {
            let timeArr = arr[0].split('-');
            if (arr[0].length > 0 && timeArr.length > 0) {
                this.schedule.time.enabled = true;
                if (timeArr[0] !== undefined) {
                    this.schedule.time.fromTime = timeArr[0];
                }
                if (timeArr[1] !== undefined) {
                    this.schedule.time.toTime = timeArr[1];
                }
            } else {
                this.schedule.time.enabled = false;
            }

            let weekArr = arr[1].split('-');
            if (arr[1].length > 0 && weekArr.length > 0) {
                this.schedule.week.enabled = true;

                for (var i = 0; i < weekArr.length; i++) {
                    this.schedule.week.selection.push(Number(weekArr[i]));
                }
            } else {

                this.schedule.week.enabled = false;
            }
        }
    }

};
function ScheduleSelector(element, scheduleObj, scheduleOption) {
//    console.log(scheduleObj);
    if (element !== undefined) {
        if (element.scheduleSelector !== undefined) {
            console.log('Can not create ScheduleSelector! Object already exist');
            return;
        }
        this.setSource(scheduleOption);
        this.initScheduleValue(scheduleObj);
        this.elements = {};
        this.init(element);
        element.scheduleSelector = this;
        this.refreshWeekSelection();
        this.setTime(this.schedule.time.fromTime, this.schedule.time.toTime);
        this.refreshTime();
        this.setValue();
    } else {
        console.log('Can not create ScheduleSelector missing parrent element');
    }
}

ScheduleSelector.prototype.init = function (element) {
    let el = this.elements;
    el.container = document.createElement('div');
    el.container.classList.add('smdui_scheduleWrapper');
    element.appendChild(el.container);

    if (this.schedule.title !== undefined) {
        el.title = document.createElement('span');
        el.title.classList.add('smdui_scheduleTitle');
        el.container.appendChild(el.title);
        el.title.textContent = this.schedule.title;
    }

    el.timePannel = document.createElement('div');
    el.timePannel.classList.add('smdui_schedulePanel');
    el.timePannel.classList.add('smdui_scheduleTimePanel');
    el.container.appendChild(el.timePannel);


    el.timeGroupButton = document.createElement('button');
    el.timeGroupButton.type = 'button';
    el.timePannel.appendChild(el.timeGroupButton);
    el.timeGroupButton.classList.add('smdui_scheduleButtonPanel');
    el.timeGroupButton.textContent = 'Time Schedule';
    el.timeGroupButton.name = this.schedule.time.enabled ? 'enabled' : 'disabled';

    el.timePannelInput = document.createElement('div');
    el.timePannel.appendChild(el.timePannelInput);
    el.timePannelInput.style.display = this.schedule.time.enabled ? 'flex' : 'none';
    el.timePannelInput.classList.add('smdui_scheduleTimeInputPanel');



    el.timeInputFrom = document.createElement('input');
    el.timePannelInput.appendChild(el.timeInputFrom);
    el.timeInputFrom.type = 'time';
    el.timeInputFrom.step = 60;
    el.timeInputFrom.value = this.schedule.time.fromTime;
    el.timeInputFrom.classList.add('smdui_scheduleButtonPanel');

    el.timeFromTitle = document.createElement('span');
    el.timeFromTitle.classList.add('smdui_scheduleTimeText');
    el.timePannelInput.appendChild(el.timeFromTitle);
    el.timeFromTitle.textContent = this.schedule.timeFromTitle || '-';

    el.timeInputTo = document.createElement('input');
    el.timePannelInput.appendChild(el.timeInputTo);
    el.timeInputTo.type = 'time';
    el.timeInputTo.step = 60;
    el.timeInputTo.value = this.schedule.time.toTime;
    el.timeInputTo.classList.add('smdui_scheduleButtonPanel');

    el.timeInputFrom.onchange = function (scSelector) {
        scSelector.schedule.time.fromTime = this.value;
        scSelector.refreshTime();
    }.bind(el.timeInputFrom, this);
    el.timeInputTo.onchange = function (scSelector) {
        scSelector.schedule.time.toTime = this.value;
        scSelector.refreshTime();
    }.bind(el.timeInputTo, this);

    el.timeGroupButton.onclick = function (scSelector) {
        if (scSelector.schedule.time.enabled) {
            scSelector.schedule.time.enabled = false;
        } else {
            scSelector.schedule.time.enabled = true;
        }
        scSelector.refreshTime();
    }.bind(el.timeGroupButton, this);


    el.weekPannel = document.createElement('div');
    el.weekPannel.classList.add('smdui_schedulePanel');
    el.weekPannel.classList.add('smdui_scheduleWeekPanel');
    el.container.appendChild(el.weekPannel);


    el.weekGroupButton = document.createElement('button');
    el.weekGroupButton.type = 'button';
    el.weekPannel.appendChild(el.weekGroupButton);
    el.weekGroupButton.classList.add('smdui_scheduleButtonPanel');
    el.weekGroupButton.textContent = 'Week';
    el.weekGroupButton.name = this.schedule.week.enabled ? 'enabled' : 'disabled';

    el.weekPannelInput = document.createElement('div');
    el.weekPannel.appendChild(el.weekPannelInput);
    el.weekPannelInput.style.display = this.schedule.week.enabled ? 'flex' : 'none';
    el.weekPannelInput.classList.add('smdui_scheduleTimeInputPanel');

    el.weekPannelOption = [];

    el.weekGroupButton.onclick = function (scSelector) {
        if (scSelector.schedule.week.enabled) {
            this.name = 'disabled';
            scSelector.schedule.week.enabled = false;
            scSelector.elements.weekPannelInput.style.display = 'none';
//            for (var but in  scSelector.elements.weekPannelOption) {
//                scSelector.elements.weekPannelOption[but].name = 'disabled';
//            }
//            console.log('clear arr: ' + scSelector.schedule.week.selection);
//            scSelector.schedule.week.selection.length = 0;
        } else {
            this.name = 'enabled';
            scSelector.schedule.week.enabled = true;
            scSelector.elements.weekPannelInput.style.display = 'flex';
        }
        scSelector.refreshWeekSelection();
//        console.log(scSelector);
    }.bind(el.weekGroupButton, this);


    for (var title in this.schedule.week.weekOptionList) {
        let value = this.schedule.week.weekOptionList[title];
        let optBut = document.createElement('button');
        optBut.type = 'button';
        el.weekPannelOption.push(optBut);
        el.weekPannelInput.appendChild(optBut);
        optBut.name = 'disabled';
        optBut.onclick = function (scSelector, val, titleVal) {
            var selection = scSelector.schedule.week.selection;
            if (selection.includes(val)) {
                this.name = 'disabled';
                selection.splice(selection.indexOf(val), 1);
//                console.log('click disable arr: ' + selection);
            } else {
                selection.push(val);
                this.name = 'enabled';
//                console.log('click enable arr: ' + selection);
            }
            scSelector.setValue();
        }.bind(optBut, this, value, title);


        optBut.textContent = title;
        optBut.containValue = value;
    }

    this.refreshWeekSelection();
    this.refreshTime();
};

ScheduleSelector.prototype.setValue = function () {
    let outputVal = '';
    if (this.schedule.time.enabled === true) {
        outputVal += this.schedule.time.fromTime;
        outputVal += '-';
        outputVal += this.schedule.time.toTime;
    }
    outputVal += '_';
    if (this.schedule.week.enabled === true) {
        for (var i = 0; i < this.schedule.week.selection.length; i++) {
            outputVal += this.schedule.week.selection[i];
            if ((i + 1) < this.schedule.week.selection.length) {
                outputVal += '-';
            }
        }
    }
    this.value = outputVal;
    if (this.onchange !== undefined) {
        if (typeof (this.onchange) === 'function') {
            this.onchange(this, outputVal);
        }
    }
//    console.log(outputVal);
};


ScheduleSelector.prototype.setTime = function (timeFrom, timeTo) {
    timeFrom = timeFrom || '00:00';
    timeTo = timeTo || '23:59';
    this.schedule.time.fromTime = timeFrom;
    this.schedule.time.toTime = timeTo;

    this.elements.timeInputFrom.value = timeFrom;
    this.elements.timeInputTo.value = timeTo;
    this.elements.timeGroupButton.textContent = 'Time Schedule (From ' + timeFrom + ' To ' + timeTo + ')';
};

ScheduleSelector.prototype.refreshTime = function () {
    if (this.schedule.time.enabled === true) {
        this.elements.timeGroupButton.name = 'enabled';
        this.elements.timePannelInput.style.display = 'flex';
        this.setTime(this.schedule.time.fromTime, this.schedule.time.toTime);
    } else {
        this.elements.timeGroupButton.textContent = 'Time Schedule (24hr)';
        this.elements.timeGroupButton.name = 'disabled';
        this.elements.timePannelInput.style.display = 'none';
    }
    this.setValue();
};

ScheduleSelector.prototype.setWeekSelection = function (arrOpt) {
    if (Array.isArray(arrOpt)) {
        if (arrOpt.length > 0) {
            this.schedule.week.enabled = true;
        } else {
            this.schedule.week.enabled = false;
        }
        this.schedule.week.selection.length = 0;
        for (var item in arrOpt) {
            let opt = arrOpt[item];
            for (var availableOtionTitle in  this.schedule.week.weekOptionList) {
                let  availableOtionValue = this.schedule.week.weekOptionList[availableOtionTitle];
                if (opt === availableOtionTitle || opt === availableOtionValue) {
                    this.schedule.week.selection.push(availableOtionValue);
                    break;
                }

            }
        }
        this.refreshWeekSelection();
    }
    this.setValue();
};

ScheduleSelector.prototype.refreshWeekSelection = function () {
    if (this.schedule.week.enabled === true) {
        this.elements.weekGroupButton.textContent = 'Week Days';
        this.elements.weekPannelInput.style.display = 'flex';
        this.elements.weekGroupButton.name = 'enables';
    } else {
        this.elements.weekGroupButton.textContent = 'Week All';
        this.elements.weekPannelInput.style.display = 'none';
        this.elements.weekGroupButton.name = 'disabled';
    }

    if (Array.isArray(this.schedule.week.selection)) {
//        console.log(this);
        for (var butTitle in   this.elements.weekPannelOption) {
            let button = this.elements.weekPannelOption[butTitle];

            var selection = this.schedule.week.selection;

            if (selection.includes(button.containValue)) {
                button.name = 'enabled';
            } else {
                button.name = 'disabled';
            }
        }
    }
    this.setValue();
};
