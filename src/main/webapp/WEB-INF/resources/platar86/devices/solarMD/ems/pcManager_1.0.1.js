/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */
/* global moment, pcMan, hh */

(function (root) {
    let PcMan = function (cont, cpData) {
        this.cont = cont || null;
        this.pcElementList = [];
        this.defaultValue = 0;
        this.comp = {};
        this.conf = {};
        this.conf.maxYearSelection = 10;


        initCpData.call(this, cpData);

        this.savedData = null;

        this.onSaveCbFuncArr = [];
        createPcContent.call(this);
    };

    function createPcContent() {
        let contentPanel = hh.div(this.cont, 'smdui-cpEditWrapper', 'card');
        this.comp.contentPanel = contentPanel;

        try {
            //===================== MESSAGE BLOCK ==================
            this.comp.messageDiv = hh.div(contentPanel, 'smdui-pcEdit-block');
            this.comp.messageSpan = hh.span(this.comp.messageDiv, 'testMessage', 'smdui-pcEdit-msg');
            //===================== PRIORITY BLOCK ==================

            this.comp.targetPriorityDiv = hh.div(contentPanel, 'smdui-pcEdit-block');
            this.comp.targetPriorityLabel = hh.span(this.comp.targetPriorityDiv, "Dev Ctrl Priority:");
            this.comp.targetPriority = hh.input(this.comp.targetPriorityDiv, "number", this.cpData.priority);

            this.comp.targetPriority.onchange = function (event) {
                if (isNaN(this.comp.targetPriority.value) || this.comp.targetPriority.value.toString().length === 0) {
                    setWarningMessage.call(this, "Invalid priority.");
                    return null;
                } else {
                    validateSelection.call(this);
                    this.period.priority = this.comp.targetPriority.value;
                }
            }.bind(this);
            //
            //===================== VALUE BLOCK ==================
            this.comp.targetValueDiv = hh.div(contentPanel, 'smdui-pcEdit-block');
            this.comp.targetValueLabel = hh.span(this.comp.targetValueDiv, "Value:");
            this.comp.targetValue = hh.input(this.comp.targetValueDiv, "number", this.cpData.value);

            this.comp.targetValue.onchange = function (event) {
                if (isNaN(this.comp.targetValue.value) || this.comp.targetValue.value.toString().length === 0) {
                    setWarningMessage.call(this, "Invalid Value.");
                    return null;
                } else {
                    validateSelection.call(this);
                    this.period.value = this.comp.targetValue.value;
                }
            }.bind(this);

            //===================== YEARS SELECTION BLOCK ==================
            createYearButtons.call(this, contentPanel, this.period.years);

            //===================== YEAR PERIOD BLOCK ==================
            creatYearlyPeriod.call(this, contentPanel, this.period.dateStart, this.period.dateEnd);

            //===================== WEEK DAYS BLOCK ==================
            createWeekDays.call(this, contentPanel, this.period.weekDays);

            //===================== TIME PERIOD BLOCK ==================
            createTimePerCtrl.call(this, contentPanel, this.period.timeStart, this.period.timeEnd);


            //===================== SAVE BUTTON ==================
            let saveButtonDiv = hh.div(contentPanel, 'smdui-pcEdit-block', 'border: none; padding: 0px; margin-top: 10px;');
            this.comp.saveButton = hh.span(saveButtonDiv, "Save", 'smdui-pcEdit-yearItem', 'ui-button');
            this.comp.saveButton.onclick = onSaveButtonPressed.bind(this);

            if (!this.emptyCp) {
                validateSelection.call(this);
            } else {
                setWarningMessage.call(this, "Please select Value and minimum 1 filter.");
            }
            return this;
        } catch (e) {
            console.log(e);
        }
    }

    function updatePriority() {
//        debugger;
        this.comp.targetPriority.value = this.cpData.priority || 0;
    }
    function updateValue() {
        this.comp.targetValue.value = this.cpData.value || 0;
    }

    function createYearButtons(contentPanel, yearsArr) {
        if (this.comp.yearButtons !== undefined) {
            //no point of recreating dom again
            return;
        }
        this.comp.yearsDiv = hh.div(contentPanel, 'smdui-pcEdit-yearSelection', 'smdui-pcEdit-block');

        let yearsDivLabelDiv = hh.div(this.comp.yearsDiv, 'smdui-pcEdit-blockPanelCtrl');
        this.comp.yearsDivLabelIcon = hh.i(yearsDivLabelDiv, null, 'fa', 'fa-angle-down');
        this.comp.yearsDivLabel = hh.span(yearsDivLabelDiv, "Every Year");
        this.comp.yearsDivLabel.onclick = function () {
            if (this.comp.yearsDivLabel.selected) {
                this.comp.yearsDivLabel.textContent = 'Specific Years';
                this.comp.yearsDivLabelIcon.classList.add('fa-angle-down');
                this.comp.yearsDivLabelIcon.classList.remove('fa-angle-up');
                this.comp.yearsDivButtons.style.display = 'none';
            } else {
                this.comp.yearsDivLabel.textContent = 'Every Year';
                this.comp.yearsDivLabelIcon.classList.remove('fa-angle-down');
                this.comp.yearsDivLabelIcon.classList.add('fa-angle-up');
                this.comp.yearsDivButtons.style.display = 'block';
            }
            this.comp.yearsDivLabel.selected = !this.comp.yearsDivLabel.selected;
        }.bind(this);

        let yearDiv = hh.div(this.comp.yearsDiv, 'smdui-pcEdit-yearSelectionBlock');
        this.comp.yearsDivButtons = yearDiv;

        this.comp.yearButtons = {};

        let currentYear = moment().year();

        let wrapper = hh.div(yearDiv, 'smdui-pcEdit-yearSelectionContainer');
        for (let i = currentYear; i < currentYear + this.conf.maxYearSelection; i++) {
            let yearSpan = this.comp.yearButtons[i] = hh.span(wrapper, i, 'smdui-pcEdit-yearItem', 'ui-button');
            yearSpan.year = i;
            yearSpan.yearSelected = false;
            yearSpan.onclick = () => {
                yearSpan.classList.toggle('smdui-pcEdit-yearItemUnselected');
                yearSpan.yearSelected = !yearSpan.yearSelected;
            };
        }
        updateYears.call(this, yearsArr);
    }

    function updateYears() {
        let yearsArr = this.period.years;
        if (yearsArr.length === 0) {
            this.comp.yearsDivLabel.textContent = 'Specific Years';
            this.comp.yearsDivLabelIcon.classList.add('fa-angle-down');
            this.comp.yearsDivLabelIcon.classList.remove('fa-angle-up');
            this.comp.yearsDivButtons.style.display = 'none';
            this.comp.yearsDivLabel.selected = false;
        } else {
            this.comp.yearsDivLabel.textContent = 'Every Year';
            this.comp.yearsDivLabelIcon.classList.remove('fa-angle-down');
            this.comp.yearsDivLabelIcon.classList.add('fa-angle-up');
            this.comp.yearsDivButtons.style.display = 'block';
            this.comp.yearsDivLabel.selected = true;
        }

        let currentYear = moment().year();
        for (let i = currentYear; i < currentYear + this.conf.maxYearSelection; i++) {
            if (yearsArr.includes(i)) {
                this.comp.yearButtons[i].yearSelected = true;
                this.comp.yearButtons[i].classList.remove('smdui-pcEdit-yearItemUnselected');
            } else {
                this.comp.yearButtons[i].yearSelected = false;
                this.comp.yearButtons[i].classList.add('smdui-pcEdit-yearItemUnselected');
            }
        }
    }

    function updateYearlyPeriodCtrl() {
        if (this.period.dateStart !== null || this.period.dateEnd !== null) {
            this.comp.yPerDivLabel.yPerSelected = true;
            this.comp.yPerDivLabel.textContent = 'Remove Specific Period Yearly';
            this.comp.yPerLabelIcon.classList.remove('fa-angle-down');
            this.comp.yPerLabelIcon.classList.add('fa-angle-up');
            this.comp.yPerDivButtons.style.display = 'block';

            let startDay = '--';
            let startMonth = '--';
            let endDay = '--';
            let endMonth = '--';
            if (this.period.dateStart !== null) {
                startDay = this.period.dateStart.day;
                startMonth = this.period.dateStart.month;
            }
            if (this.period.dateEnd !== null) {
                endDay = this.period.dateEnd.day;
                endMonth = this.period.dateEnd.month;
            }

            this.comp.yearPer.inputBeginDay.value = startDay;
            this.comp.yearPer.inputBeginMonth.value = startMonth;
            this.comp.yearPer.inputEndDay.value = endDay;
            this.comp.yearPer.inputEndMonth.value = endMonth;

            this.comp.yearPer.inputBeginDay.onblur();
            this.comp.yearPer.inputBeginMonth.onblur();
            this.comp.yearPer.inputEndDay.onblur();
            this.comp.yearPer.inputEndMonth.onblur();
        } else {
            this.comp.yPerDivLabel.yPerSelected = false;
            this.comp.yPerDivLabel.textContent = 'Specific Period Yearly';
            this.comp.yPerLabelIcon.classList.add('fa-angle-down');
            this.comp.yPerLabelIcon.classList.remove('fa-angle-up');
            this.comp.yPerDivButtons.style.display = 'none';
        }
    }

    function creatYearlyPeriod(cont) {
        if (this.comp.yearPer !== undefined) {
            //no point of recreating dom again
            return;
        }
        this.comp.yearPer = {};
        this.comp.yPerDiv = hh.div(cont, 'smdui-pcEdit-yPerBlock', 'smdui-pcEdit-block');

        let yPerDivLabelDiv = hh.div(this.comp.yPerDiv, 'smdui-pcEdit-blockPanelCtrl');
        this.comp.yPerLabelIcon = hh.i(yPerDivLabelDiv, null, 'fa', 'fa-angle-down');
        this.comp.yPerDivLabel = hh.span(yPerDivLabelDiv, '');


        this.comp.yPerDivLabel.onclick = function () {
            this.comp.yPerDivLabel.yPerSelected = !this.comp.yPerDivLabel.yPerSelected;
            if (this.comp.yPerDivLabel.yPerSelected) {
                this.comp.yPerDivLabel.textContent = 'Remove Specific Period Yearly';
                this.comp.yPerLabelIcon.classList.remove('fa-angle-down');
                this.comp.yPerLabelIcon.classList.add('fa-angle-up');
                this.comp.yPerDivButtons.style.display = 'block';
            } else {
                this.comp.yPerDivLabel.textContent = 'Specific Period Yearly';
                this.comp.yPerLabelIcon.classList.add('fa-angle-down');
                this.comp.yPerLabelIcon.classList.remove('fa-angle-up');
                this.comp.yPerDivButtons.style.display = 'none';
            }
        }.bind(this);

        this.comp.yPerDivButtons = hh.div(this.comp.yPerDiv);

        let inputBlock = hh.div(this.comp.yPerDivButtons, 'smdui-pcEdit-yPerInputBlock');
        hh.span(inputBlock, 'dd / mm', 'smdui-pcEdit-yPerInputDesc');
        hh.span(inputBlock, 'dd / mm', 'smdui-pcEdit-yPerInputDesc');
        hh.span(inputBlock, 'From: ');

        this.comp.yPerDivLabel.yPerSelected = false;


        this.comp.yearPer.inputBeginDay = hh.input(inputBlock, 'text', '-',
                {min: 1, max: 31, step: 1, onkeydown: onCustomInputNumberKeyUp, onfocus: onInputFocusSelectAll, onblur: onInputFocusOut});

        hh.span(inputBlock, '/');
        this.comp.yearPer.inputBeginMonth = hh.input(inputBlock, 'text', '-',
                {min: 1, max: 12, step: 1, onkeydown: onCustomInputNumberKeyUp, onfocus: onInputFocusSelectAll, onblur: onInputFocusOut});

        hh.span(inputBlock, ' To: ');
        this.comp.yearPer.inputEndDay = hh.input(inputBlock, 'text', '-',
                {min: 1, max: 31, step: 1, onkeydown: onCustomInputNumberKeyUp, onfocus: onInputFocusSelectAll, onblur: onInputFocusOut});

        hh.span(inputBlock, '/');
        this.comp.yearPer.inputEndMonth = hh.input(inputBlock, 'text', '-',
                {min: 1, max: 12, step: 1, onkeydown: onCustomInputNumberKeyUp, onfocus: onInputFocusSelectAll, onblur: onInputFocusOut});

        updateYearlyPeriodCtrl.call(this);
    }

    function createWeekDays(contentPanel, weekArr) {
//        debugger;
        if (this.comp.weekButtons !== undefined) {
            //no point of recreating dom again
            return;
        }
        this.comp.weekButtons = [];

        this.comp.weekDiv = hh.div(contentPanel, 'smdui-pcEdit-block');

        let weekDivLabelDiv = hh.div(this.comp.weekDiv, 'smdui-pcEdit-blockPanelCtrl');
        this.comp.weekDivLabelIcon = hh.i(weekDivLabelDiv, null, 'fa', 'fa-angle-down');
        this.comp.weekDivLabel = hh.span(weekDivLabelDiv, "Every Day");
        this.comp.weekDivLabel.onclick = function () {
            this.comp.weekDivLabel.selected = !this.comp.weekDivLabel.selected;
            if (!this.comp.weekDivLabel.selected) {
                this.comp.weekDivLabel.textContent = 'Specific Days in Week';
                this.comp.weekDivLabelIcon.classList.add('fa-angle-down');
                this.comp.weekDivLabelIcon.classList.remove('fa-angle-up');
                this.comp.weekDivButtons.style.display = 'none';
            } else {
                this.comp.weekDivLabel.textContent = 'Every Day';
                this.comp.weekDivLabelIcon.classList.remove('fa-angle-down');
                this.comp.weekDivLabelIcon.classList.add('fa-angle-up');
                this.comp.weekDivButtons.style.display = 'block';
            }
        }.bind(this);


        let weekDiv = hh.div(this.comp.weekDiv, 'smdui-pcEdit-weekSelectionBlock');
        this.comp.weekDivButtons = weekDiv;

        this.comp.weekButtons = {};

        let weekDays = moment.weekdaysMin();
        weekDays.push(weekDays.shift());

        let wrapper = hh.div(weekDiv, 'smdui-pcEdit-yearSelectionContainer');
        for (let i = 0; i < weekDays.length; i++) {
            let weekSpan = this.comp.weekButtons[i] = hh.span(wrapper, weekDays[i], 'smdui-pcEdit-yearItem', 'ui-button');
            weekSpan.weekDay = i + 1;
            weekSpan.weekSelected = false;
            weekSpan.onclick = () => {
                weekSpan.classList.toggle('smdui-pcEdit-yearItemUnselected');
                weekSpan.weekSelected = !weekSpan.weekSelected;
            };
        }
        updateWeekDays.call(this, weekArr);
    }

    function updateWeekDays() {
        let weekDays = this.period.weekDays;
        if (weekDays.length === 0 || weekDays.length === 7) {
            this.comp.weekDivLabel.selected = false;
            this.comp.weekDivLabel.textContent = 'Specific Days in Week';
            this.comp.weekDivLabelIcon.classList.add('fa-angle-down');
            this.comp.weekDivLabelIcon.classList.remove('fa-angle-up');
            this.comp.weekDivButtons.style.display = 'none';
        } else {
            this.comp.weekDivLabel.selected = true;
            this.comp.weekDivLabel.textContent = 'Every Day';
            this.comp.weekDivLabelIcon.classList.remove('fa-angle-down');
            this.comp.weekDivLabelIcon.classList.add('fa-angle-up');
            this.comp.weekDivButtons.style.display = 'block';
        }

        for (let i = 0; i < 7; i++) {
            if (weekDays.includes(i+1)) {
                this.comp.weekButtons[i].weekSelected = true;
                this.comp.weekButtons[i].classList.remove('smdui-pcEdit-yearItemUnselected');
            } else {
                this.comp.weekButtons[i].weekSelected = false;
                this.comp.weekButtons[i].classList.add('smdui-pcEdit-yearItemUnselected');
            }
        }
    }

    function updateTimePerCtrl() {
        if (this.period.timeStart !== null || this.period.timeEnd !== null) {
            this.comp.timeDivLabel.selected = true;
            this.comp.timeDivLabel.textContent = 'Every Hour';
            this.comp.timeDivLabelIcon.classList.remove('fa-angle-down');
            this.comp.timeDivLabelIcon.classList.add('fa-angle-up');
            this.comp.timeDivButtons.style.display = 'block';
        } else {
            this.comp.timeDivLabel.selected = false;
            this.comp.timeDivLabel.textContent = 'Specific Hours';
            this.comp.timeDivLabelIcon.classList.add('fa-angle-down');
            this.comp.timeDivLabelIcon.classList.remove('fa-angle-up');
            this.comp.timeDivButtons.style.display = 'none';
        }

        let startHour = '--';
        let startMinute = '--';
        let endHour = '--';
        let endMinute = '--';

        if (this.period.timeStart !== null) {
            startHour = this.period.timeStart.hour;
            startMinute = this.period.timeStart.minute;
        }
        if (this.period.timeEnd !== null) {
            endHour = this.period.timeEnd.hour;
            endMinute = this.period.timeEnd.minute;
        }

        this.comp.timePer.inputBeginHour.value = startHour;
        this.comp.timePer.inputBeginMinute.value = startMinute;
        this.comp.timePer.inputEndHour.value = endHour;
        this.comp.timePer.inputEndMinute.value = endMinute;
        this.comp.timePer.inputBeginHour.onblur();
        this.comp.timePer.inputBeginMinute.onblur();
        this.comp.timePer.inputEndHour.onblur();
        this.comp.timePer.inputEndMinute.onblur();
    }

    function createTimePerCtrl(cont, timeStart, timeEnd) {
        if (this.comp.timePer !== undefined) {
            //no point of recreating dom again
            return;
        }
        this.comp.timePer = {};
        this.comp.timeDiv = hh.div(cont, 'smdui-pcEdit-timeBlock', 'smdui-pcEdit-block');

        let timeDivLabelDiv = hh.div(this.comp.timeDiv, 'smdui-pcEdit-blockPanelCtrl');
        this.comp.timeDivLabelIcon = hh.i(timeDivLabelDiv, null, 'fa', 'fa-angle-down');
        this.comp.timeDivLabel = hh.span(timeDivLabelDiv, "-");
        this.comp.timeDivLabel.onclick = function () {
            this.comp.timeDivLabel.selected = !this.comp.timeDivLabel.selected;
            if (this.comp.timeDivLabel.selected) {
                this.comp.timeDivLabel.textContent = 'Every Hour';
                this.comp.timeDivLabelIcon.classList.remove('fa-angle-down');
                this.comp.timeDivLabelIcon.classList.add('fa-angle-up');
                this.comp.timeDivButtons.style.display = 'block';
            } else {
                this.comp.timeDivLabel.textContent = 'Specific Hours';
                this.comp.timeDivLabelIcon.classList.add('fa-angle-down');
                this.comp.timeDivLabelIcon.classList.remove('fa-angle-up');
                this.comp.timeDivButtons.style.display = 'none';
            }
        }.bind(this);

//        this.comp.timeLabelIcon = hh.i(timeDivLabelDiv, null, 'fa', 'fa-angle-down');
//        this.comp.timeDivLabel = hh.span(timeDivLabelDiv, 'Time Period');

        if (timeStart !== null || timeEnd !== null) {
            this.comp.timeDivLabel.timeSelected = true;
        } else {
            this.comp.timeDivLabel.timeSelected = false;
        }

//        debugger;
        this.comp.timeDivButtons = hh.div(this.comp.timeDiv);
        let inputBlock = hh.div(this.comp.timeDivButtons, 'smdui-pcEdit-yPerInputBlock');

//        hh.span(inputBlock, 'From: ');
        this.comp.timePer.inputBeginHour = hh.input(inputBlock, 'text', "-",
                {min: 0, max: 23, step: 1, onkeydown: onCustomInputNumberKeyUp, onfocus: onInputFocusSelectAll, onblur: onInputFocusOut});

        hh.span(inputBlock, ':');
        this.comp.timePer.inputBeginMinute = hh.input(inputBlock, 'text', "-",
                {min: 0, max: 59, step: 1, onkeydown: onCustomInputNumberKeyUp, onfocus: onInputFocusSelectAll, onblur: onInputFocusOut});

        hh.span(inputBlock, ' - ');
        this.comp.timePer.inputEndHour = hh.input(inputBlock, 'text', "-",
                {min: 0, max: 23, step: 1, onkeydown: onCustomInputNumberKeyUp, onfocus: onInputFocusSelectAll, onblur: onInputFocusOut});

        hh.span(inputBlock, ':');
        this.comp.timePer.inputEndMinute = hh.input(inputBlock, 'text', "-",
                {min: 0, max: 59, step: 1, onkeydown: onCustomInputNumberKeyUp, onfocus: onInputFocusSelectAll, onblur: onInputFocusOut});

        updateTimePerCtrl.call(this);
    }

    function initCpData(cpData) {
        if (cpData === null || cpData === undefined || !cpData.period) {
            this.emptyCp = true;
        } else {
            this.emptyCp = false;
        }

        this.cpData = cpData || {};

        this.period = this.cpData.period || {};

        this.period.years = this.period.years || [];
        this.period.dateStart = this.period.dateStart || null;
        this.period.dateEnd = this.period.dateEnd || null;
        this.period.weekDays = this.period.weekDays || [];
        this.period.timeStart = this.period.timeStart || null;
        this.period.timeEnd = this.period.timeEnd || null;
    }

    function setWarningMessage(msg) {
        if (msg) {
            this.comp.messageDiv.style.display = 'flex';
            this.comp.messageSpan.textContent = msg;
        } else {
            this.comp.messageDiv.style.display = 'none';
        }
    }

    function getTimePerEnd() {
        if (this.comp.timeDivLabel.selected) {
            if (!isNaN(this.comp.timePer.inputEndHour.value) && !isNaN(this.comp.timePer.inputEndMinute.value)) {
                let timeEnd = {};
                timeEnd.hour = Number(this.comp.timePer.inputEndHour.value);
                timeEnd.minute = Number(this.comp.timePer.inputEndMinute.value);
                return timeEnd;
            }
        }
        return null;
    }
    function getTimePerStart() {
        if (this.comp.timeDivLabel.selected) {
            if (!isNaN(this.comp.timePer.inputBeginHour.value) && !isNaN(this.comp.timePer.inputBeginMinute.value)) {
                let timeStart = {};
                timeStart.hour = Number(this.comp.timePer.inputBeginHour.value);
                timeStart.minute = Number(this.comp.timePer.inputBeginMinute.value);
                return timeStart;
            }
        }
        return null;
    }
    function getYearPerEndDate() {
        if (this.comp.yPerDivLabel.yPerSelected) {
            if (!isNaN(this.comp.yearPer.inputEndDay.value) && !isNaN(this.comp.yearPer.inputEndMonth.value)) {
                let dateEnd = {};
                dateEnd.day = Number(this.comp.yearPer.inputEndDay.value);
                dateEnd.month = Number(this.comp.yearPer.inputEndMonth.value);
                return dateEnd;
            }
        }
        return null;
    }
    function getYearPerStartDate() {
        if (this.comp.yPerDivLabel.yPerSelected) {
            if (!isNaN(this.comp.yearPer.inputBeginDay.value) && !isNaN(this.comp.yearPer.inputBeginMonth.value)) {
                let dateStart = {};
                dateStart.day = Number(this.comp.yearPer.inputBeginDay.value);
                dateStart.month = Number(this.comp.yearPer.inputBeginMonth.value);
                return dateStart;
            }
        }
        return null;
    }
    function getSellectedWeekDays() {
        let arr = [];
        if (this.comp.weekDivLabel.selected) {
            for (let i = 0; i < 7; i++) {
                if (this.comp.weekButtons[i].weekSelected) {
                    arr.push(this.comp.weekButtons[i].weekDay);
                }
            }
        }
        return arr;
    }
    function getSellectedYears() {
        let arr = [];
        if (this.comp.yearsDivLabel.selected) {
            let currentYear = moment().year();
            for (let i = currentYear; i < currentYear + this.conf.maxYearSelection; i++) {
                if (this.comp.yearButtons[i].yearSelected) {
                    arr.push(i);
                }
            }
        }
        return arr;
    }

    function validateSelection() {
        if (isNaN(this.comp.targetValue.value)) {
            setWarningMessage.call(this, "Invalid Value.");
            return null;
        }

        let ob = {};
        ob.priority = Number(this.comp.targetPriority.value);
        ob.value = Number(this.comp.targetValue.value);

        ob.periodIdx = this.cpData.periodIdx || 0;
        ob.period = {};

        ob.period.years = getSellectedYears.call(this);
        ob.period.dateStart = getYearPerStartDate.call(this);
        ob.period.dateEnd = getYearPerEndDate.call(this);
        ob.period.weekDays = getSellectedWeekDays.call(this);
        ob.period.timeStart = getTimePerStart.call(this);
        ob.period.timeEnd = getTimePerEnd.call(this);

        if (
                ob.period.years.length === 0
                && (ob.period.dateStart === null || ob.period.dateEnd === null)
                && (ob.period.timeStart === null || ob.period.timeEnd === null)
//                && (Object.keys(ob.period.dateStart).length === 0 || Object.keys(ob.period.dateEnd).length === 0)
//                && (Object.keys(ob.period.timeStart).length === 0 || Object.keys(ob.period.timeEnd).length === 0)
                && (ob.period.weekDays.length === 0 || ob.period.weekDays.length === 7)) {
//            console.log('invalid selection');
            setWarningMessage.call(this, "Invalid Period Selection. Please select at least 1 filter.");
            return null;
        }

        //For Android devices and other not supporting browser onkeydown we have to check the values if they are out of range manually 
        try {
            if (!moment(ob.period.dateStart.month + ' ' + ob.period.dateStart.day, "M D").isValid() ||
                    !moment(ob.period.dateEnd.month + ' ' + ob.period.dateEnd.day, "M D").isValid()) {
                setWarningMessage.call(this, "Invalid Year Period!");
                return null;
            }
        } catch (e) {
        }

        try {
            if (!moment(ob.period.timeStart.hour + ' ' + ob.period.timeStart.minute, "H m").isValid() ||
                    !moment(ob.period.timeEnd.hour + ' ' + ob.period.timeEnd.minute, "H m").isValid()) {
                setWarningMessage.call(this, "Invalid Time Period!");
                return null;
            }
        } catch (e) {
        }
        setWarningMessage.call(this, null);
        return ob;
    }

    function onSaveButtonPressed() {
        //validate values
        let ob = validateSelection.call(this);
        if (ob !== null) {
//            debugger;
            console.log(ob);
            this.savedData = ob;
            for (var i = 0; i < this.onSaveCbFuncArr.length; i++) {
                try {
                    this.onSaveCbFuncArr[i](this, ob);
                } catch (e) {
                    console.warn(e);
                }
            }
        }

        return;
//        ob.priority = this.cpData.priority || 0;
//        ob.value = this.comp.targetValue.value;
//        ob.period = {};
//
//        ob.period.years = getSellectedYears.call(this);
//        ob.period.dateStart = getYearPerStartDate.call(this);
//        ob.period.dateEnd = getYearPerEndDate.call(this);
//        ob.period.weekDays = getSellectedWeekDays.call(this);
//        ob.period.timeStart = getTimePerStart.call(this);
//        ob.period.timeEnd = getTimePerEnd.call(this);
//
//        if (
//                ob.period.years.length === 0
//                && (Object.keys(ob.period.dateStart).length === 0 || Object.keys(ob.period.dateEnd).length === 0)
//                && (Object.keys(ob.period.timeStart).length === 0 || Object.keys(ob.period.timeEnd).length === 0)
//                && (ob.period.weekDays.length === 0 || ob.period.weekDays.length === 7)) {
////            console.log('invalid selection');
//            setWarningMessage.call(this, "Invalid Period Selection. Please select at least 1 filter.");
//        } else {
//            setWarningMessage.call(this, null);
//
//            console.log(ob);
//            this.savedData = ob;
//            for (var i = 0; i < this.onSaveCbFuncArr.length; i++) {
//                try {
//                    this.onSaveCbFuncArr[i](this, ob);
//                } catch (e) {
//                    console.warn(e);
//                }
//            }
//        }
    }

    function onInputFocusSelectAll(ev) {
        if (ev.target.value.toString().length > 0) {
            ev.target.selectionStart = 0;
            ev.target.selectionEnd = ev.target.value.toString().length;

        }
    }

    function onInputFocusOut(ev) {
        let input = this;
        if (!isNaN(input.value)) {
            if (input.value.toString().length !== input.max.toString().length) {
                let prefix = '';
                for (var i = input.value.toString().length; i < input.max.toString().length; i++) {
                    prefix += '0';
                }
                input.value = prefix + input.value;
            }
        }
    }

    function onCustomInputNumberKeyUp(ev) {
        let keyCode = Number(ev.key);
        if (ev.key === 'Backspace' || ev.key === 'Delete') {
            ev.target.value = "--";
            return;
        }
        if (!isNaN(keyCode) && keyCode >= 0 && keyCode <= 9) {
            let input = ev.target;
//            debugger;
            if (input.selectionStart < input.selectionEnd) {
                input.value = "--";
            }
            let oldVal = Number(input.value) || 0;
            let calcVal = (oldVal * 10) + keyCode;
            if (calcVal <= input.max) {
                input.value = calcVal;
            }

            if (input.value.toString().length === input.max.toString().length || (calcVal * 10) > input.max) {
                let next = input.nextElementSibling;
                //focus next possible input child
                while (next) {
                    if (next.tagName === 'INPUT') {
                        if (input.value.toString().length !== input.max.toString().length) {
                            let prefix = '';
                            for (var i = input.value.toString().length; i < input.max.toString().length; i++) {
                                prefix += '0';
                            }
                            input.value = prefix + input.value;
                        }
                        next.focus();
                        break;
                    } else {
                        next = next.nextElementSibling;
                    }
                }
            }

        }
        if (ev.keyCode !== 9) {
            ev.preventDefault();
        }
    }

    let fn = PcMan.prototype;

    fn.setCpData = function (cpData) {
//        debugger;
        initCpData.call(this, cpData);
        updatePriority.call(this);
        updateValue.call(this);
        updateYears.call(this);
        updateYearlyPeriodCtrl.call(this);
        updateWeekDays.call(this);
        updateTimePerCtrl.call(this);

        if (!this.emptyCp) {
            validateSelection.call(this);
        }
    };

    fn.addOnSaveCb = function (fn) {
        if (typeof (fn) === 'function') {
            return  this.onSaveCbFuncArr.push(fn);
        }
        return null;
    };

    fn.setValueLabel = function (txt) {
        this.comp.targetValueLabel.textContent = txt || 'Invalid Text';
    };

    root.PcMan = PcMan;
}(window));

$(document).ready(function () {
//    if (pcMan.pcDataList.length === 0) {
//        pcMan.createNewPeriod();
//    }
});