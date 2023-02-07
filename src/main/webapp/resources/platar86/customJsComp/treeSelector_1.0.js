/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by Nathan, 2022
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */
/* global Element,*/

(function (root) {
    const CHBOX_SEL_NONE = 0;
    const CHBOX_SEL_PART = 1;
    const CHBOX_SEL_ALL = 2;

    let SMDUITree = function (conf, parent, depthIdx) {
        if (!depthIdx) {
            this.depthIdx = 0;
        } else {
            this.depthIdx = depthIdx;
        }
        this.conf = conf;
        this.parent = parent || null
        this.children = {};
        this.comp = {};

        this.checkboxSel = CHBOX_SEL_NONE;
        init.call(this);
        if (parent) {
            initNode.call(this);
            this.isRoot = false;
        } else {
            initRoot.call(this);
            this.isRoot = true;
        }
    };

    let prot = SMDUITree.prototype;

    function init() {

        this.childWrapper = document.createElement("div");
        this.openBox = document.createElement("div");
        this.childWrapper.appendChild(this.openBox);


        this.tickBox = document.createElement("div");
        this.tickBox.classList.add('smdui-tree-select-non-selected');
        this.childWrapper.appendChild(this.tickBox);
        this.childWrapper.classList.add("row");

        this.isSelected = this.conf.isSelected;

        this.tickBox.onclick = function () {
            if (this.checkboxSel === CHBOX_SEL_NONE || this.checkboxSel === CHBOX_SEL_PART) {
                this.selectCheckbox(CHBOX_SEL_ALL);
            } else {
                this.selectCheckbox(CHBOX_SEL_NONE);
            }
            for (let child in this.children) {
                // this.children[child].tickBox.onclick();
                onParrentCheckboxSelect.call(this.children[child], this, this.checkboxSel);
            }
            if (!this.isRoot) {
                onChildSelection.call(this.parent, this);
            }
        }.bind(this);
    }

    function onParrentCheckboxSelect(parrent, selection) {

        if (selection) {
            this.selectCheckbox(CHBOX_SEL_ALL);
        } else {
            this.selectCheckbox(CHBOX_SEL_NONE);
        }

        for (let child in this.children) {

            onParrentCheckboxSelect.call(this.children[child], this, this.checkboxSel);
        }
    }


    prot.selectCheckbox = function (s) {
        this.checkboxSel = s;
        if (s === CHBOX_SEL_NONE) {
            this.tickBox.classList.add("smdui-tree-select-non-selected")
            this.tickBox.classList.remove("smdui-tree-select-partially-selected")
            this.tickBox.classList.remove("smdui-tree-select-Fully-selected")
            this.childWrapper.classList.add("rowHilightOff");
            this.childWrapper.classList.remove("rowHilight");


        } else if (s === CHBOX_SEL_PART) {
            this.tickBox.classList.remove("smdui-tree-select-non-selected")
            this.tickBox.classList.add("smdui-tree-select-partially-selected")
            this.tickBox.classList.remove("smdui-tree-select-Fully-selected")
        } else {
            this.childWrapper.classList.add("rowHilight");
            this.childWrapper.classList.remove("rowHilightOff");
            this.tickBox.classList.remove("smdui-tree-select-non-selected")
            this.tickBox.classList.remove("smdui-tree-select-partially-selected")
            this.tickBox.classList.add("smdui-tree-select-Fully-selected")
        }
    }

    function onChildSelection(child) {
        console.trace();
        let selection = CHBOX_SEL_NONE;
        let qty = 0;
        for (let child in this.children) {
            let chSelection = this.children[child].getSelection();
           
            if (chSelection === CHBOX_SEL_PART) {
                qty = -1;
                break;
            } else if (chSelection === CHBOX_SEL_ALL) {
                qty++;
            }
        }
        if (qty === 0) {//NONE
            this.selectCheckbox(CHBOX_SEL_NONE);
        } else if (qty === Object.keys(this.children).length) {//ALL
            
            this.selectCheckbox(CHBOX_SEL_ALL);
        } else { //partial
            this.selectCheckbox(CHBOX_SEL_PART);
        }

        if (!this.isRoot) {
            onChildSelection.call(this.parent, this);
        }
        //check selection and apply classes for partial full or non selection
    }

    function initRoot() {
        let container = this.container = document.createElement('div');
        container.classList.add('smdui-trree-wrapper');
        if (this.conf.container) {
            this.conf.container.appendChild(container);
        }
    }

    function initNode() {

        let wrapper = this.comp.wrapper = document.createElement('div');
        wrapper.classList.add('smdui-trree-item');
        wrapper.appendChild(this.childWrapper);
        this.label = this.comp.label = document.createElement('div');
        this.label.style.cursor = "pointer";
        this.label.classList.add('smdui-trree-itemLabel');
        this.childWrapper.appendChild(this.label);
        this.childCont = this.comp.childCont = document.createElement('div');
        this.childCont.classList.add('smdui-trree-itemChildCont');
        wrapper.appendChild(this.childCont);

        let pCont = this.parent.getContainer().appendChild(wrapper);


        initNodeUi.call(this);

    }

    function initNodeUi() {

        

        let childCont = this.childCont;
        this.label.innerHTML = this.conf.id;

        childCont.classList.add("smdui-tree-childcontainer-collapse")

        this.label.onclick = function () {

            childCont.classList.toggle("smdui-tree-childcontainer-collapse")

            if (this.checkboxSel === CHBOX_SEL_NONE || this.checkboxSel === CHBOX_SEL_PART) {
                this.selectCheckbox(CHBOX_SEL_ALL);
            } else {
                this.selectCheckbox(CHBOX_SEL_NONE);
            }
            for (let child in this.children) {
       
                onParrentCheckboxSelect.call(this.children[child], this, this.checkboxSel);
            }
            if (!this.isRoot) {
                onChildSelection.call(this.parent, this);
            }

        }.bind(this);
    }





    prot.getSelection = function () {
        return this.checkboxSel;
    }

    prot.getContainer = function () {
        if (this.isRoot) {
            return this.container;
        } else {
            return this.comp.childCont;
        }
    }

    prot.getChildrenByID = function (id) {
        if (this.children[id]) {

            return this.children[id];
        }
        for (let nodeId in this.children) {
            let node = this.children[nodeId];

            let resuilt = node.getChildrenByID(id);
            if (resuilt)
                return resuilt;
        }
        return null;
    };

    prot.addChild = function (conf, parentId) {
        // debugger;
        if (typeof (conf) !== 'object') {
            throw new Error('Opss');
        }
        if (parentId) {
            let p = this.getChildrenByID(parentId);
            if (!p) {
                throw new Error('Invalid parrent ID');
            }
            p.addChild(conf);
        } else {
            this.children[conf.id] = new SMDUITree(conf, this, this.depthIdx + 1);
        }

    };

    root.SMDUITree = SMDUITree;
}(window));