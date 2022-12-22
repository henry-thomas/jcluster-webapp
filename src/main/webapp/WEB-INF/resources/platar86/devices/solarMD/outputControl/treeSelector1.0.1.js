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

TreeSelectorUI.prototype.rewindSelection = function (selection, toNodeName) {
    for (var item in selection) {
        if (item === toNodeName) {
            delete(selection[toNodeName]);
            return selection;
        } else {
            return this.rewindSelection(selection[item], toNodeName);
        }
    }
    return null;
};

TreeSelectorUI.prototype.rewindToBranch = function (headerElement, node, selection) {
//    console.log(selection);
    this.valueSelected = false;
    this.selection = this.rewindSelection(this.currentBranch, Object.keys(selection)[0]);

    let isFirstIconRemoved = false;
    var element = headerElement;
    while (element.nextSibling) {
        if (isFirstIconRemoved === false && element.nextSibling.classList.contains('fas')) {
            isFirstIconRemoved = true;
            element = element.nextSibling;
        } else {
            element.parentNode.removeChild(element.nextSibling);
        }
    }

    this.populateBranchData(node);
};

//TreeSelectorUI.prototype.addHeaderItem = function (branchData, selectionName) {
TreeSelectorUI.prototype.addHeaderItem = function (branchData, node, nodeName) {
    this.selection[nodeName] = {};
    this.selection = this.selection[nodeName];

    let bName = document.createElement('span');
    bName.branchData = branchData;
    bName.node = node;
    bName.nodeName = nodeName;
    bName.classList.add('smdui_treeSel_headerItemSelection');
    bName.textContent = node.title || 'nodeName';
    this.el.headerPanel.appendChild(bName);

    bName.onclick = function (treeSelObj, sName, selection) {
        let sel = selection;
        if (Object.keys(selection).length > 0) {
            treeSelObj.rewindToBranch(this, sName, sel);
        }
    }.bind(bName, this, node, this.selection);

    let mIcon = document.createElement('i');
    mIcon.classList.add('fas', 'fa-arrow-right');
//    mIcon.textContent = 'arrow_forward';
    this.el.headerPanel.appendChild(mIcon);


    this.populateBranchData(node);

//    console.log(this);
};

TreeSelectorUI.prototype.clearDataPanel = function () {
    this.el.contentArr.length = 0;
    while (this.el.contentPanel.firstChild) {
        this.el.contentPanel.removeChild(this.el.contentPanel.firstChild);
    }
};

TreeSelectorUI.prototype.populateBranchData = function (node) {

    this.clearDataPanel();
    if (node.notCategory) {
        console.log(node);
        if (node.dataType !== undefined) {
            switch (node.dataType) {
                case 'number':
                    {
                        let title = document.createElement('span');
                        title.classList.add('smdui_treeSel_inputInfo');
                        title.textContent = node.title;
                        this.el.contentPanel.appendChild(title);

                        let inputNumber = document.createElement('input');
                        inputNumber.classList.add('smdui_treeSel_inputNumber');
                        inputNumber.type = 'number';
                        inputNumber.value = this.fixedValue || 0;
                        inputNumber.step = node.step || 1;
                        inputNumber.min = node.min || Number.MIN_VALUE;
                        inputNumber.max = node.max || Number.MAX_VALUE;
                        this.el.contentPanel.appendChild(inputNumber);

                        inputNumber.oninput = function (treeSelObj) {
                            treeSelObj.selectionValueFirst = this.value;
                            treeSelObj.selectFixedValueChange(this.value);
                        }.bind(inputNumber, this);
                    }
                    break;
                case 'boolean':
                    {
                        let title = document.createElement('span');
                        title.classList.add('smdui_treeSel_inputInfo');
                        title.textContent = node.title;
                        this.el.contentPanel.appendChild(title);

                        let radioOnLabel = document.createElement('label');
                        radioOnLabel.textContent = 'TRUE';
                        this.el.contentPanel.appendChild(radioOnLabel);

                        let headerInputRadioOn = document.createElement('input');
                        headerInputRadioOn.type = 'radio';
                        headerInputRadioOn.name = 'expressionOutcomeBoolTree';
                        headerInputRadioOn.value = this.fixedValue || true;
                        ;
                        radioOnLabel.appendChild(headerInputRadioOn);


                        let radioOffLabel = document.createElement('label');
                        radioOffLabel.textContent = 'FALSE';
                        this.el.contentPanel.appendChild(radioOffLabel);

                        let headerInputRadioOff = document.createElement('input');
                        headerInputRadioOff.type = 'radio';
                        headerInputRadioOff.name = 'expressionOutcomeBoolTree';
                        headerInputRadioOff.value = !this.fixedValue || false;;
                        radioOffLabel.appendChild(headerInputRadioOff);


//                        let inputNumber = document.createElement('input');
//                        inputNumber.classList.add('smdui_treeSel_inputNumber');
//                        inputNumber.type = 'number';
//                        inputNumber.value = this.fixedValue || 0;
//                        inputNumber.step = node.step || 1;
//                        inputNumber.min = node.min || Number.MIN_VALUE;
//                        inputNumber.max = node.max || Number.MAX_VALUE;
//                        this.el.contentPanel.appendChild(inputNumber);

                        headerInputRadioOn.onchange = headerInputRadioOff.onchange = function (treeSelObj, onRadio, offRadio) {
                            if (onRadio.checked) {
                                treeSelObj.selectionValueFirst = true;
                                treeSelObj.selectFixedValueChange(true);
                            } else {
                                treeSelObj.selectionValueFirst = false;
                                treeSelObj.selectFixedValueChange(false);

                            }
                        }.bind(null, this, headerInputRadioOn, headerInputRadioOff);
                    }
                    break;
                case 'TreeSelectorUI':
                    {
                        let title = document.createElement('span');
                        title.classList.add('smdui_treeSel_inputInfo');
                        title.textContent = node.title;
                        this.el.contentPanel.appendChild(title);

                        let secondObjContainer = document.createElement('div');
                        secondObjContainer.style.margin = '10px';
                        var dataSrcSec = clone(this.dataSrc);

                        dataSrcSec.isSecondObj = true;
                        this.el.contentPanel.appendChild(secondObjContainer);
                        this.childExpression = new TreeSelectorUI(secondObjContainer, dataSrcSec, this.secondObjectValue || '', this);
                        this.childExpression.requiredValueType = this.selectedValueType;
                    }
                    break;
            }
            ;
        }
    } else {
        var branchData = node.childs;
        var titleText = node.title;

        if (titleText !== undefined) {
            let title = document.createElement('span');
            title.classList.add('smdui_treeSel_inputInfo');
            title.textContent = titleText;
            this.el.contentPanel.appendChild(title);
        }

        for (var nodeName in branchData) {

            let nd = branchData[nodeName];
            if (nd.isValue === true &&
                    this.requiredValueType !== undefined &&
                    nd.valueType !== this.requiredValueType) {
                continue;
            }

            let item = document.createElement('span');
            item.classList.add('smdui_treeSel_inputItem');
            item.textContent = nd.title || nodeName;
            item.data_nodeName = nodeName;
            this.el.contentPanel.appendChild(item);

            this.el.contentArr.push(item);

            item.branch = this.currentBranch;
            item.onclick = function (treeSelObj, branchData, node, nodeName) {
                if (node.valueType !== undefined) {
                    treeSelObj.selectedValueType = node.valueType;
                }
                if (treeSelObj.dataSrc.isSecondObj && node.isValue === true) {
                    if (!treeSelObj.valueSelected) {

                        let bName = document.createElement('span');
                        bName.branchData = branchData;
                        bName.node = node;
                        bName.nodeName = nodeName;
                        bName.classList.add('smdui_treeSel_headerItemSelection');
                        bName.textContent = node.title || 'nodeName';
                        treeSelObj.el.headerPanel.appendChild(bName);
                        treeSelObj.valueSelected = true;
                    }

                    treeSelObj.selectionValueSecond = nodeName;
                    treeSelObj.parrentTreeSlector.selectChildValueChange(treeSelObj.getValue());

                } else {
                    treeSelObj.addHeaderItem(branchData, nd, nodeName);
                }

            }.bind(item, this, branchData, nd, nodeName);
        }
    }


};



TreeSelectorUI.prototype.convertResultToArr = function (obj, arr) {
    for (var item in obj) {
        arr.push(item);
        if (typeof (obj[item]) === 'object') {
            this.convertResultToArr(obj[item], arr);
        }
    }
};

TreeSelectorUI.prototype.getValue = function () {
    var result = [];
    this.convertResultToArr(this.currentBranch, result);
    if (this.dataSrc.isSecondObj) {
        result.push(this.selectionValueSecond);
    }
//    console.log(result);
    return result;
};

TreeSelectorUI.prototype.selectFixedValueChange = function (fixedVal) {
    var val = this.getValue();
    val += ',' + fixedVal;
    this.selectValueChange(val);
};

TreeSelectorUI.prototype.selectChildValueChange = function (secondObjVal) {
    var val = this.getValue();
    val += ',' + secondObjVal;
    this.selectValueChange(val);
};
TreeSelectorUI.prototype.selectValueChange = function (val) {
    this.value = val || this.value;
    console.log('value selected is:' + val);
    if (this.onchange !== undefined) {
        if (typeof (this.onchange) === 'function') {
            this.onchange(this, val);
        }
    }
};

TreeSelectorUI.prototype.navigateTo = function (val) {
//    this.navigateTo(navigateTo);
    if (val !== undefined && typeof (val) === 'string') {
        let arr = val.split(',');
        for (var i = 0; i < arr.length; i++) {
            let item = arr[i];
            if (item === 'fixedValue') {
                console.log('fixedValue');
                if (arr[i + 1] !== undefined) {
                    this.fixedValue = Number(arr[i + 1]);
                    i++;
                }
            } else if (item === 'secondObject') {
                if (i + 1 < arr.length) {
                    let arrSec = arr.splice(i + 1);
                    let secObjVal = '';
                    for (var k = 0; k < arrSec.length; k++) {
                        secObjVal += arrSec[k];
                        if (k + 1 < arrSec.length) {
                            secObjVal += ',';
                        }
                    }
                    this.secondObjectValue = secObjVal;
                }
                console.log('secondObject');

            }
            for (var j = 0; j < this.el.contentArr.length; j++) {
                let selection = this.el.contentArr[j];
                if (selection.data_nodeName === item) {
                    selection.click();
                }
            }
        }
    }
};

function TreeSelectorUI(element, dataSrc, initVal, parrentTreeSlector) {
    if (element !== undefined) {
        this.parrentTreeSlector = parrentTreeSlector;
        this.initVal = initVal;
        this.value = initVal;
        this.el = {};
        this.el.contentArr = [];
        this.selection = {};
        this.currentBranch = this.selection;
        this.dataSrc = clone(dataSrc) || {};
        this.init(element);
        element.treeSelector = this;
        this.initHeader();
        this.navigateTo(initVal);

        this.selectValueChange(this.value);

    } else {
        console.log('Can not create OutputExpressionSelector missing parrent element');
    }
}

TreeSelectorUI.prototype.initHeader = function () {
    //remove all childs from header
    while (this.el.headerPanel.firstChild) {
        this.el.headerPanel.removeChild(this.el.headerPanel.firstChild);
    }

    this.selection = {};
    this.currentBranch = this.selection;

    this.clearDataPanel();
    this.populateBranchData(this.dataSrc);
};


TreeSelectorUI.prototype.expandData = function (obj, dataSrc) {
    for (var item in obj) {
        if (item === 'childsType') {
            if (dataSrc[obj[item]] !== undefined && dataSrc[obj[item]].childs !== undefined) {
                obj.childs = dataSrc[obj[item]].childs;
            }
        } else {
            if (typeof (obj[item]) === 'object') {
                this.expandData(obj[item], dataSrc);
            }
        }
    }
};

TreeSelectorUI.prototype.init = function (element) {
    /*
     *Create somethign LIKE          
     <div class="smdui_treeSelWrapper" style="display: none">
     <div class="smdui_treeSel_header">
     <span class="smdui_treeSel_headerItemSelection">FirstSelection</span>
     <i class="material-icons">arrow_forward </i>
     <span class="smdui_treeSel_headerItemSelection">Second</span>
     <i class="material-icons">arrow_forward </i>
     <span class="smdui_treeSel_headerItemSelection">Third</span>
     <i class="material-icons">arrow_forward </i>
     <span class="smdui_treeSel_headerItemSelection">Something Long As Text </span>
     </div>
     
     <div class="smdui_treeSel_content">
     <span class="smdui_treeSel_inputInfo">Select Main Somthing</span>
     <span class="smdui_treeSel_inputItem">Power Service</span>
     <span class="smdui_treeSel_inputItem">Energy Storage</span>
     <span class="smdui_treeSel_inputItem">Fixed Expression</span>
     </div>
     <div class="smdui_treeSel_footer">
     <span>Result Expression:</span>
     <span class="smdui_treeSel_footerResult">Result Expression:</span>
     </div>
     
     </div>
     */


    if (this.dataSrc.isSecondObj !== true) {
        this.expandData(this.dataSrc, this.dataSrc);
    }


    let container = document.createElement('div');
    container.classList.add('smdui_treeSelWrapper');
    element.appendChild(container);
    this.el.container = container;

    let headerPanelTop = document.createElement('div');
    headerPanelTop.classList.add('smdui_treeSel_headerTop');
    container.appendChild(headerPanelTop);
    this.el.headerPanelTop = headerPanelTop;

    let headerPanel = document.createElement('div');
    headerPanel.classList.add('smdui_treeSel_header');
    container.appendChild(headerPanel);
    this.el.headerPanel = headerPanel;


    let contentPanel = document.createElement('div');
    contentPanel.classList.add('smdui_treeSel_content');
    container.appendChild(contentPanel);
    this.el.contentPanel = contentPanel;

    let footerPanel = document.createElement('div');
    footerPanel.classList.add('smdui_treeSel_footer');
    container.appendChild(footerPanel);
    this.el.footerPanel = footerPanel;
    footerPanel.style.display = 'none';

    let footerResultTitle = document.createElement('span');
    footerResultTitle.textContent = 'Result Expression:';
    footerPanel.appendChild(footerResultTitle);

    let footerResult = document.createElement('span');
    footerPanel.classList.add('smdui_treeSel_footerResult');
    footerPanel.appendChild(footerResult);
    this.el.footerResult = footerResult;

    //extra buttong at header to go back at main root


    let mIcon = document.createElement('i');
    mIcon.classList.add('fas', "fa-chevron-left");
//    mIcon.textContent = 'first_page';
    //mIcon.textContent = 'arrow_forward';
    headerPanelTop.appendChild(mIcon);

    mIcon.onclick = function (treeSelObj) {
        treeSelObj.initHeader();
    }.bind(mIcon, this);
};

