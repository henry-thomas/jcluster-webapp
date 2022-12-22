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



function WebTerminal(container, onCommandEnterCb) {
    this.onCommandEnterCb = onCommandEnterCb || null;
    this.windowMain = null;
    this.output = null;
    this.windowInput = null;
    this.inputLabel = null;
    this.inputField = null;
    this.initHtmlComp(container);

    this.op = {
        commandHistory: [],
        selectedHisIdx: 0
    };

    console.log('axTerminal');


    this.windowMain.onclick = function (input) {
        input.focus();
    }.bind(this, this.inputField);

    this.inputField.onkeydown = function (event) {
        if (event.key === 'ArrowUp') {
            let hArr = this.op.commandHistory;
            if (hArr[this.op.selectedHisIdx] !== undefined) {
                this.inputField.value = hArr[this.op.selectedHisIdx];
                this.op.selectedHisIdx++;
            }

        } else if (event.key === 'ArrowDown') {
            let hArr = this.op.commandHistory;
            this.op.selectedHisIdx--;
            if (hArr[this.op.selectedHisIdx] !== undefined) {
                this.inputField.value = hArr[this.op.selectedHisIdx];
            } else {
                this.op.selectedHisIdx = 0;
                this.inputField.value = "";
            }

        } else if (event.key === 'Enter') {
            event.preventDefault();

            let com = this.inputField.value;
            if (com === "") {
                this.printOutput();
            } else if (com === 'clear') {
                this.clearOutput();
                this.clearInput();
            } else {
                this.op.lastCommand = com;
                this.op.commandHistory.unshift(com);
                this.clearInput();
                if (isFunction(this.onCommandEnterCb)) {
                    this.onCommandEnterCb(this, com);
                }
            }
        } else {

        }
    }.bind(this);

    return this;
}


WebTerminal.prototype.clearOutput = function () {
    this.output.innerHTML = '';
};

WebTerminal.prototype.clearInput = function () {
    this.inputField.value = "";
};

WebTerminal.prototype.setTitle = function (text) {
    this.inputLabel.innerHTML = text;
};

WebTerminal.prototype.printOutput = function (text, noLineBreak) {
    if (text !== undefined) {
        this.output.innerHTML += text;
    }
    if (!noLineBreak) {
        this.output.innerHTML += '<br>';
    }
    this.windowMain.scroll(0, Number.MAX_SAFE_INTEGER);
};

WebTerminal.prototype.initHtmlComp = function (element) {
    if (element !== null && element !== undefined) {
        this.windowMain = document.createElement('div');
        this.windowMain.classList.add('uismd-TerminalWrapper');
        this.windowMain.style.height = '95%';
        this.windowMain.style.overflow = 'auto';
        this.windowMain.style.padding = '10px';
        this.windowMain.style.background = 'black';
        this.windowMain.style.display = 'flex';
        this.windowMain.style['flex-direction'] = 'column';
        this.windowMain.style['border-radius'] = '3px';
        this.windowMain.style['-webkit-box-shadow'] = '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12)';
        this.windowMain.style['overflow'] = 'auto';
        element.appendChild(this.windowMain);


        this.output = document.createElement('span');
        this.output.classList.add('uismd-TerminalOutput');
        this.output.style.color = 'yellow';
        this.windowMain.appendChild(this.output);

        this.windowInput = document.createElement('div');
        this.windowInput.classList.add('uismd-TerminalInputWrapper');
        this.windowInput.style.display = 'flex';
        this.windowInput.style['flex-direction'] = 'row';
        this.windowMain.appendChild(this.windowInput);

        this.inputLabel = document.createElement('span');
        this.inputLabel.classList.add('uismd-TerminalInputLabel');
        this.inputLabel.style.color = 'yellow';
        this.inputLabel.style['white-space'] = 'nowrap';
        this.windowInput.appendChild(this.inputLabel);

        this.inputField = document.createElement('INPUT');
        this.inputField.classList.add("uic_numberInput");
        this.inputField.setAttribute('type', 'text');
        this.inputField.setAttribute('value', "");

        this.inputField.classList.add('uismd-TerminalInput');
        this.inputField.style.color = 'yellow';
        this.inputField.style['white-space'] = 'nowrap';
        this.inputField.style['background'] = 'none';
        this.inputField.style['border'] = 'none';
        this.inputField.style['outline-width'] = '0';
        this.inputField.style['padding-left'] = '5px';
        this.inputField.style['width'] = '100%';
        this.windowInput.appendChild(this.inputField);

    }
};
