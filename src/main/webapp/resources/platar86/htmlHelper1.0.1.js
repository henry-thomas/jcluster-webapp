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


/* global HTMLElement, mu, SMDUIDataField */
(function (root) {
    let hh = function () {
//        this.hh = {};
    };
    hh.prototype.removeAllChilds = function (className) { //
        if (typeof (className) === 'string') {

            let arr = document.querySelectorAll();
            for (var i = 0; i < arr.length; i++) {
                let container = arr[i];
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
            }
        } else {
            try {
                while (className.firstChild) {
                    className.removeChild(className.firstChild);
                }

            } catch (e) {

            }
        }
    };
    hh.prototype.createActDataPanelHeaderElement = function (headerTitle, image) {
        let div = document.createElement('div');
        div.classList.add('header-block');
        let title = document.createElement('span');
        title.textContent = headerTitle || " ";
        div.appendChild(title);
        if (image) {
            let img = document.createElement('img');
            img.src = image;
            div.appendChild(img);
        }
        return div;
    };
    hh.prototype.createItemTableToActDataPanelCard = function (tableContetn, tableClass, cont) { //{ header:[], item:[]}
//    { header:[], item:[
//      ['asdf', 'asdf' , {title: }],[]
//    ]}
        if (!Array.isArray(tableContetn.item)) {
            return;
        }
        let table = document.createElement('table');
        table.style.setProperty('width', '100%');
        table.classList.add('actDataTableContent');
        if (typeof (tableClass) === 'string') {
            table.classList.add(tableClass);
        }
        if (Array.isArray(tableContetn.header)) {

            let headerRow = document.createElement('tr');
            table.appendChild(headerRow);
            for (var i = 0; i < tableContetn.header.length; i++) {
                let th = document.createElement('th');
                if (typeof (tableContetn.header[i]) === "string") {
                    th.textContent = tableContetn.header[i];
                    if (tableClass) {
                        th.classList.add(tableClass + "-th-" + i);
                    }
                } else if (typeof (tableContetn.header[i]) === "object") {
                    th.innerHTML = tableContetn.header[i].label;
                    if (tableClass) {
                        th.classList.add(tableClass + "-" + tableContetn.header[i].columClass + "-th-" + i);
                    }
                }
                headerRow.appendChild(th);
            }
        }
        table.tContent = {};
        for (var i = 0; i < tableContetn.item.length; i++) {
            let tContent = table.tContent[i] = {};
            let row = document.createElement('tr');
            table.appendChild(row);
            let rowItemsArr = tableContetn.item[i];

            if (Array.isArray(rowItemsArr)) {
                for (var j = 0; j < rowItemsArr.length; j++) {
                    let item = rowItemsArr[j];
                    let td = document.createElement('td');
                    td.classList.add("actDataTableContent-item");
                    if (tableClass) {
                        td.classList.add(tableClass + "-tbItem");
                    }
                    if (tableContetn.header[j] && typeof (tableContetn.header[j]) === "object") {
                        if (tableClass) {
                            td.classList.add(tableClass + "-" + tableContetn.header[j].columClass + "-" + i);
                        }
                        if (tableContetn.header[j].id !== undefined) {
                            tContent[tableContetn.header[j].id] = td;
                        }
                    }
//                    debugger;
                    if (typeof (item) === 'string' || typeof (item) === 'number') {
                        td.textContent = item;
                    } else if (typeof (item) === 'object') {
                        td.textContent = item.title || " ";
                        if (item.onclick) {
                            row.classList.add('linkItem');
                            row.onclick = item.onclick;
                        }
//                        if()
                    }
                    if (tableContetn.header[j] && tableContetn.header[j].cssItem) {
                        this.addCssToDom(tableContetn.header[j].cssItem, td);
                    }
                    row.appendChild(td);
                }
                table.appendChild(row);
            }
        }
        if (mu.isDOM(cont)) {
            cont.appendChild(table);
        }
        return table;
    };

    hh.prototype.addItemToActDataPanelCard = function (labelObject) {
        if (typeof (labelObject) === 'object') {
            let div = document.createElement('div');
            div.classList.add('actDataPanel');
            let title = document.createElement('span');
            title.classList.add('tooltip');
            title.textContent = labelObject.title || " ";
            div.appendChild(title);

            let value = document.createElement('span');
            if (typeof (labelObject.link) === 'string') {
//            value.onclick = window.open(labelObject.link, labelObject.link);
//            value.style.cursor = 'pointer';
//            value.classList.add('linkItem');
//            value.target = "_blank";

                value.innerHTML = (labelObject.value || " ").link(labelObject.link);

            } else {
                value.textContent = labelObject.value || " ";
            }

            if (labelObject.type && labelObject.type === 'static') {
                value.classList.add('staticValues');
            } else {
                value.classList.add('dataValues');
            }

            div.appendChild(value);
            if (labelObject.valueOnClick) {
                value.classList.add('linkItem');
                value.onclick = labelObject.valueOnClick;
            }

            if (typeof (labelObject.valueClass) === 'object') {
                for (var item in labelObject.valueClass) {
                    if (typeof (labelObject.valueClass[item] === 'string')) {
                        value.classList.add(labelObject.valueClass[item]);
                    }
                }
            } else if (typeof (labelObject.valueClass) === 'string') {
                value.classList.add(labelObject.valueClass);
            }
            if (typeof (labelObject.valueId) === 'string') {
                value.id = labelObject.valueId;
            }

            let unit = document.createElement('span');
            unit.textContent = labelObject.unit || " ";
            if (labelObject.unitClass) {
                unit.classList.add(labelObject.unitClass);
            }
            div.appendChild(unit);
            if (typeof (labelObject.tooltip) === 'string') {
                let tooltip = document.createElement('span');
                tooltip.textContent = labelObject.tooltip || " ";
                tooltip.classList.add('tooltiptext');
                title.appendChild(tooltip);
            }


            //To be able format the value and unit externally, based on value
            Object.defineProperty(div, 'unitVal', {
                set: function (val) {
                    unit.textContent = val;
                },
                get: function () {
                    return unit.textContent;
                }
            });
            Object.defineProperty(div, 'dataVal', {
                set: function (val) {
                    value.textContent = val;
                },
                get: function () {
                    return value.textContent;
                }
            });
            Object.defineProperty(div, 'titleVal', {
                set: function (val) {
                    title.textContent = val;
                },
                get: function () {
                    return title.textContent;
                }
            });


            return div;
        }
    };
    hh.prototype.addHeaderTitleToPC = function (panel, title, image) {
        panel.appendChild(this.createActDataPanelHeaderElement(title, image));
    };
    hh.prototype.addToPC = function (panel, title, valueClass, unit, value) {
        panel.appendChild(this.addItemToActDataPanelCard({title: title, value: value || "N/A", valueClass: valueClass, unit: unit || ""}));
    };
    hh.prototype.appendChild = function (el, cont) {
        try {
            if (mu.isDOM(cont)) {
                cont.appendChild(el);
            } else if (typeof (cont) === 'string') {
                let contById = document.getElementById(cont);
                if (contById) {
                    contById.appendChild(div);
                }
            }
        } catch (e) {
        }
    };
    hh.prototype.addPropToDom = function (elDom, arg) {
        if (typeof (arg) === 'string') {
            if (arg.indexOf(':') > 0) {
                this.addCssToDom(arg, elDom);
            } else {
                this.addClass(elDom, arg);
            }
        } else if (typeof (arg) === 'object') {
            for (var item in arg) {
                elDom[item] = arg[item];
            }
        }
    };
    hh.prototype.img = function (cont, imgId) {
        let comp = document.getElementById(imgId);
        if (comp) {
            cont.appendChild(comp);

            for (var i = 1; i < arguments.length; i++) {
                this.addPropToDom(comp, arguments[i]);
            }

        }
    };
    hh.prototype.div = function (cont) {
        let div = document.createElement('div');
        this.appendChild(div, cont);
        for (var i = 1; i < arguments.length; i++) {
            this.addPropToDom(div, arguments[i]);
        }
        return div;
    };
    hh.prototype.input = function (container, type, value) {
        let input = document.createElement('input');
        input.type = type;
        input.value = value || "";

        this.appendChild(input, container);
        for (var i = 3; i < arguments.length; i++) {
            this.addPropToDom(input, arguments[i]);
        }
        return input;
    };
    hh.prototype.i = function (container, textContent) {
        let iEl = document.createElement('i');
        iEl.textContent = textContent;
        this.appendChild(iEl, container);
        for (var i = 2; i < arguments.length; i++) {
            this.addPropToDom(iEl, arguments[i]);
        }
        return iEl;
    };
    hh.prototype.span = function (container, textContent) {
        let span = document.createElement('span');
        span.textContent = textContent;
        this.appendChild(span, container);
        for (var i = 2; i < arguments.length; i++) {
            this.addPropToDom(span, arguments[i]);
        }
        return span;
    };

    hh.prototype.el = function (container, compName) {
        let comp = document.createElement(compName);
        this.appendChild(comp, container);
        for (var i = 2; i < arguments.length; i++) {
            this.addPropToDom(comp, arguments[i]);
        }
        return comp;
    };
    hh.prototype.compRaw = function (container, rawContent, compName) {
        let comp = document.createElement(compName);
        comp.innerHTML = rawContent;
        this.appendChild(comp, container);
        for (var i = 2; i < arguments.length; i++) {
            this.addPropToDom(comp, arguments[i]);
        }
        return comp;
    };


    hh.prototype.ddButton = function (container) {
        var arr = null;
        for (var i = 1; i < arguments.length; i++) {
            if (Array.isArray(arguments[i])) {
                arr = arguments[i];
                break;
            }
        }
        if (arr === null) {
            return;
        }
        let dropDownBut = sui.dropdown({
            text: '...',
            content: arr,
            type: 'small'
        });
        if (container) {
            container.appendChild(dropDownBut);
        }
        for (var i = 1; i < arguments.length; i++) {
            if (typeof (arguments[i]) === 'string') {
                this.addPropToDom(dropDownBut, arguments[i]);
            }
        }
    };
    hh.prototype.button = function (container, textContent) {
        let button = document.createElement('button');
        if (typeof (textContent) === 'string') {
            button.textContent = textContent;
        } else if (typeof (textContent) === 'object') {
            button.textContent = textContent.label || "";

            if (textContent.faIcon) {
                let faImg = this.i(button);
                this.addClass(faImg, ['fa', 'fa-' + textContent.faIcon]);
            }
        }
        button.classList.add('smdui-button');
        if (container) {
            this.appendChild(button, container);
        }
        for (var i = 2; i < arguments.length; i++) {
            this.addPropToDom(button, arguments[i]);
        }
        return button;
    };

    hh.prototype.createActDataPanelCard = function (label, classList, parrent) {
        let panel = document.createElement('div');
        panel.classList.add('actDataPanelCard');
//        panel.style.overflow = 'inherit';//this is to help tooltip get visible outside
        if (typeof (classList) === 'object') {
            for (var item in classList) {
                if (typeof (classList[item] === 'string')) {
                    panel.classList.add(classList[item]);
                }
            }
        } else if (typeof (classList) === 'string') {
            panel.classList.add(classList);
        }
//    container.appendChild(panel);

        if (typeof (label) === 'string') {
            let headerBlock = document.createElement('div');
            headerBlock.classList.add('header-block');
            let headerBlockContent = document.createElement('span');
            headerBlockContent.innerHTML = label;
            headerBlock.appendChild(headerBlockContent);
            panel.appendChild(headerBlock);
        }

        if (mu.isDOM(parrent)) {
            parrent.appendChild(panel);
        } else if (typeof (parrent) === 'string') {
            let domParrent = document.getElementById(parrent);
            if (mu.isDOM(domParrent)) {
                domParrent.appendChild(panel);
            }
        }
        panel.dataComp = {};
        panel.addField = function (id, title, unit, confOb) {
            panel.dataComp[id] = hh.prototype.adf(panel, title, unit, confOb);
        };
        panel.updateFields = function (data, recursive) {
            hh.prototype.updateAdfFromObject(panel.dataComp, data, recursive);
        };
        panel.addHeaderTitle = function (title, image) {
            hh.prototype.addHeaderTitleToPC(panel, title, image);
        };
        return panel;
    };

    hh.prototype.openFullscreen = function (elem) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
        }
    };
    hh.prototype.closeFullscreen = function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }


    };
    hh.prototype.toggleFullscreen = function (elem) {
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    };
    hh.prototype.isElement = function (obj) {
        try {
            //Using W3 DOM2 (works for FF, Opera and Chrome)
            return obj instanceof HTMLElement;
        } catch (e) {
            //Browsers not supporting W3 DOM2 don't have HTMLElement and
            //an exception is thrown and we end up here. Testing some
            //properties that all elements have (works on IE7)
            return (typeof obj === "object") &&
                    (obj.nodeType === 1) && (typeof obj.style === "object") &&
                    (typeof obj.ownerDocument === "object");
        }
    };
    hh.prototype.addClass = function (el, classObj) {
        if (this.isElement(el)) {
            if (typeof (classObj) === 'string') {
                if (classObj.indexOf(' ' > 0)) {
                    classObj.split(' ').forEach(function (clName) {
                        el.classList.add(clName);
                    });
                } else {
                    el.classList.add(classObj);
                }
            } else if (Array.isArray(classObj)) {
                for (var i = 0; i < classObj.length; i++) {
                    el.classList.add(classObj[i]);
                }
            }
        }
    };
    hh.prototype.getCoords = function (elem) { // crossbrowser version
        var box = elem.getBoundingClientRect();
        var body = document.body;
        var docEl = document.documentElement;
        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;
        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        return {top: Math.round(top), left: Math.round(left)};
    };
//Tries to use attributeStyleMap, which is not supported on some browsers (iphone);
    hh.prototype.setStyle = function (target, cssProp, cssValue) {
        if (this.isElement(target)) {
            try {
                target.attributeStyleMap.set(cssProp, cssValue);
            } catch (e) {
                try {
                    cssProp = mu.camelize(cssProp);
                    target.style[cssProp] = cssValue;
                } catch (e) {
                    console.warn('Failed to apply style: ' + e);
                }
            }
        } else {
            console.warn('Failed to set style, target is not an HTML element');
        }
    };
//add description text to ParamPanel
    hh.prototype.pPanelAddDescTitle = function (target, title) {
        target = this.validateDomEl(target);
        if (target) {
            let tEl = document.createElement('span');
            tEl.classList.add('dscSeparatorText');
            tEl.innerHTML = title;
            target.appendChild(tEl);
        }
//does this
        //   <span  class="dscSeparatorText">Charge Voltage Control.</span>
    };
    hh.prototype.validateDomEl = function (el, getByClass) {
        if (!this.isElement(el)) {
            if (typeof (el) === 'string') {
                let idEl = document.getElementById(el);
                if (idEl) {
                    return  idEl;
                } else if (getByClass) {
                    let classEl = document.querySelector('.' + el);
                    if (classEl) {
                        return  classEl;
                    }
                    console.warn("validateDomEl by class err Not valid HTML Element", el);
                } else {
                    console.warn("validateDomEl err Not valid HTML Element", el);
                }
            }
        } else {
            return el;
        }
        return null;
    };
    hh.prototype.addCssToDom = function (css, el) {
        try {


            let frameCSS = css.replace(/([\w-.]+)\s*:([^;]+);?/g, '$1:$2,');
            frameCSS = frameCSS.replace(/,+$/, '');
            let properties = frameCSS.split(', ');
            properties.forEach(function (property) {
                let cssProp = property.split(':');
                let cssKey = cssProp[0].toCamelCase();
                let cssValue = cssProp[1].trim();
                el.style[cssKey] = cssValue;
            });
        } catch (e) {
            console.log("CSS Parsing [%s] exception. ", css);
        }
    };

    hh.prototype.updateAdfFromObject = function (compContainer, data, recursive) {
        for (let item in data) {
            if (data[item] !== undefined) {
                if (compContainer[item] instanceof SMDUIDataField) {
                    compContainer[item].value = data[item];
                } else if (recursive && compContainer[item] instanceof Object) {
                    hh.prototype.updateAdfFromObject(compContainer[item], data[item], recursive);
                }
            }
        }
    };

    hh.prototype.adf = function (el, title, unit, confOb) {
        if (typeof (unit) === 'object' && confOb === undefined) {
            confOb = unit;
            unit = null;
        }
        let conf = confOb || {};
        if (typeof (unit) === 'function') {
            conf.formatter = unit;
            conf.unit = null;
        }
        if (typeof (confOb) === 'function') {
            conf.formatter = confOb;
        }
        if (title && typeof title === 'string') {
            conf.title = title;
        }
        if (unit && typeof unit === 'string') {
            conf.unit = unit;
        }

        return new SMDUIDataField(el, conf);
    };

//this is in conflict with old style button, please refractor if you want to change it
    hh.prototype.buttonCustom = function (cfg) {
        let button = document.createElement('smdui-button');
        if (cfg) {
            if (cfg.text) {
                button.text = cfg.text;
            }
            if (cfg.type) {
                button.type = cfg.type;
            }
        }

        return button;
    };

    hh.prototype.tooltip = function (cfg) {
        let tooltip = document.createElement('smdui-tooltip');
        if (cfg) {
            if (cfg.text) {
                tooltip.text = cfg.text;
            }
        }
        return tooltip;
    };

    hh.prototype.dialog = function (cfg) {
        let dialog = document.createElement('smdui-dialog');
        if (cfg) {
            if (cfg.heading) {
                dialog.heading = cfg.heading;
            }
            if (cfg.content) {
                dialog.content = cfg.content;
            }
        }
        return dialog;
    };

    hh.prototype.modal = function (cfg) {
        // cfg=[{tab: string, page: element, cb: function}]
        let modal = document.createElement('smdui-modal');
        if (cfg) {
            if (cfg.heading) {
                modal.heading = cfg.heading;
            }
            // for (let i = 0; i < cfg.length; i++) {
            //     tabs.addTab(cfg[i].tab, cfg[i].page, cfg[i].cb);
            // }
        }
        return modal;
    };

    hh.prototype.dropdown = function (cfg) {
        let dropdown = document.createElement('smdui-dropdown');
        if (cfg) {
            if (cfg.text) {
                dropdown.text = cfg.text;
            }
            if (cfg.content) {
                dropdown.items = cfg.content;
            }
            if (cfg.type) {
                dropdown.type = cfg.type;
            }
        }
        return dropdown;
    };

    hh.prototype.tabs = function (cfg) {
        // cfg=[{tab: string, page: element, cb: function}]
        let tabs = document.createElement('smdui-tabs');
        if (cfg) {
            for (let i = 0; i < cfg.length; i++) {
                tabs.addTab(cfg[i].tab, cfg[i].page, cfg[i].cb);
            }
        }
        return tabs;
    };

    //utils
    hh.prototype.addTooltip = function (target, text) {
        if (typeof (target) !== 'object') {
            console.warn('Must be an html element');
        } else {
            let tooltip = this.tooltip({text: text});
            tooltip.element = target;
            return tooltip;
        }
    };

    hh.prototype.initEmParamTemplate = function (container) {
        return new EmParams(container);
    };

    root.hh = new hh();
    root.sui = root.hh;
}(window));


(function () {
    String.prototype.toCamelCase = function () {
        return this.replace(/^([A-Z])|[\s-](\w)/g, function (match, p1, p2, offset) {
            if (p2)
                return p2.toUpperCase();
            return p1.toLowerCase();
        });
    };
    HTMLElement.prototype.addCssFromString = function (css) {
        let frameCSS = css.replace(/([\w-.]+)\s*:([^;]+);?/g, '$1:$2,');
        frameCSS = frameCSS.replace(/,+$/, '');
        let properties = frameCSS.split(', ');
        let self = this;
        properties.forEach(function (property) {
            let cssProp = property.split(':');
            let cssKey = cssProp[0].toCamelCase();
            let cssValue = cssProp[1].trim();
            self.style[cssKey] = cssValue;
        });
    };
})();


var hhContentBuilder = {
    var : {elementCounter: 0}
};
hhContentBuilder.buildDialogContent = function (jsonDesc) {

    if (typeof (jsonDesc) === 'object') {
        for (var name in jsonDesc) {
            if (name.indexOf('dialog') === 0) {
                hhContentBuilder.smdui_createDialog(jsonDesc[name]);
            } else {
                console.warn("Ivnalid field found in Dialog buildDialogContent => hhContentBuilder: " + name);
            }
        }
    }
};
hhContentBuilder.buildContent = function (jsonDesc, cont) {

    if (typeof (jsonDesc) === 'object' && jsonDesc._con || cont) {
        let content = cont || jsonDesc._cont;
        for (var name in jsonDesc) {
            let obj = jsonDesc[name];
            hhContentBuilder.smdui_createContentFromObject(obj, name, content);
        }
    }
};
hhContentBuilder.smdui_createContentFromObject = function (desc, descName, content) {
    if (descName.indexOf('dataField_') === 0) {
        hhContentBuilder.smdui_createDataField(desc, descName, content);
    } else if (descName.indexOf('dataPanel') === 0) {
        hhContentBuilder.smdui_createDataPanel(desc, descName, content);
    } else if (descName.indexOf('div') === 0) {
        hhContentBuilder.smdui_createContentDiv(desc, descName, content);
    } else if (descName.indexOf('tabPanel') === 0) {
        hhContentBuilder.smdui_createContentTab(desc, descName, content);
    } else if (descName.indexOf('param_') === 0) {
        hhContentBuilder.smdui_createContentParam(desc, descName, content);
    } else if (descName.indexOf('paramTitle') === 0) {
        hh.pPanelAddDescTitle(content, desc);
    } else if (descName.indexOf("accordian") === 0) {
        hhContentBuilder.smdui_createContentAccordian(desc, descName, content);
    } else if (descName.indexOf('img') === 0) {
        hhContentBuilder.smdui_createImage(desc, descName, content);
    }
};
hhContentBuilder.smdui_createImage = function (desc, descName, content) {
//    debugger;
    if (desc.id) {
        let comp = document.getElementById(desc.id);
        if (comp) {
            if (desc.css) {
                hh.addCssToDom(desc.css, comp);
            }
            content.appendChild(comp);
            if (typeof (desc.onload) === 'function') {
                desc.onload(comp);
            }
        }
    }
};
hhContentBuilder.smdui_createContentParam = function (desc, descName, content) {
    let paramName = descName.substring(6);
    let param = new ParamSetting(content, paramName, desc);
    if (desc.css) {
        hh.addCssToDom(desc.css, param);
    }
};
hhContentBuilder.smdui_createDialog = function (desc) {
    try {
        let conf = desc.conf || {};
        let dialog = new SMDUIDialog(conf);
        if (typeof (desc._dest) === 'object' && desc._dest.object) {
            desc._dest.object[desc._dest.name || ('tabPanel-' + (++hhContentBuilder.var.elementCounter))] = dialog;
        }
        let dialogContent = dialog.contentDiv;
        if (desc.class) {
            hh.addClass(dialogContent, desc.class);
        }
        if (desc.css) {
            hh.addCssToDom(desc.css, dialogContent);
        }
        if (desc.id) {
            dialogContent.id = desc.id;
        }

        //if there is _dest in conf element use it to put link of the created element

        for (var itemName in desc) {
            if (itemName !== 'id' && itemName !== 'css' && itemName !== 'class' && itemName !== '_dest') {
                hhContentBuilder.smdui_createContentFromObject(desc[itemName], itemName, dialogContent);
            }
        }
        if (typeof (dialog.positionCenter) === 'function') {
            dialog.positionCenter();
        }
    } catch (e) {
        console.warn(e);
    }
};
hhContentBuilder.smdui_createDataPanel = function (desc, descName, content) {
    try {
        let title = desc.title || (descName.substring(10, descName.length));
        let dataCont = hh.createActDataPanelCard(title);
        content.appendChild(dataCont);
//    hh.addToPC = function (panel, title, valueClass, unit, value) {
//        hh.addToPC(dataCont, 'Current Template', null, null, devP.currentTemplate);
        if (desc.class) {
            hh.addClass(dataCont, desc.class);
        }
        if (desc.css) {
            hh.addCssToDom(desc.css, dataCont);
        }
        if (desc.id) {
            dataCont.id = desc.id;
        }

        //if there is _dest in conf element use it to put link of the created element
        if (typeof (desc._dest) === 'object' && desc._dest.object) {
            desc._dest.object[desc._dest.name || ('tabPanel-' + (++hhContentBuilder.var.elementCounter))] = desc;
        }

        for (var itemName in desc) {
            if (itemName !== 'id' && itemName !== 'css' && itemName !== 'class' && itemName !== '_dest' && itemName !== 'title') {
                hhContentBuilder.smdui_createContentFromObject(desc[itemName], itemName, dataCont);
            }
        }

    } catch (e) {
        console.warn(e);
    }
};
hhContentBuilder.smdui_createDataField = function (desc, descName, content) {
    try {
        let valueClass = descName.substring(10, descName.length);
        desc.valueClass = valueClass;
//         panel.appendChild(hh.addItemToActDataPanelCard({title: title, value: value || "N/A", valueClass: valueClass, unit: unit || ""}));
        let dataField = hh.addItemToActDataPanelCard(desc);
        content.appendChild(dataField);
        if (desc.class) {
            hh.addClass(dataField, desc.class);
        }
        if (desc.css) {
            hh.addCssToDom(desc.css, dataField);
        }
        if (desc.id) {
            dataField.id = desc.id;
        }
    } catch (e) {
        console.warn(e);
    }
};
hhContentBuilder.smdui_createContentDiv = function (desc, descName, content) {
    try {
        let div = hh.div(content);
        if (desc.class) {
            hh.addClass(div, desc.class);
        }
        if (desc.css) {
            hh.addCssToDom(desc.css, div);
        }
        if (desc.id) {
            div.id = desc.id;
        }

        //if there is _dest in conf element use it to put link of the created element
        if (typeof (desc._dest) === 'object' && desc._dest.object) {
            desc._dest.object[desc._dest.name || ('tabPanel-' + (++hhContentBuilder.var.elementCounter))] = desc;
        }

        for (var itemName in desc) {
            if (itemName !== 'id' && itemName !== 'css' && itemName !== 'class' && itemName !== '_dest') {
                hhContentBuilder.smdui_createContentFromObject(desc[itemName], itemName, div);
            }
        }

    } catch (e) {
        console.warn(e);
    }
};
hhContentBuilder.smdui_createContentAccordian = function (desc, descName, content) {
    try {
        let conf = desc._conf || {};
//        delete desc._conf;
        conf.tabs = [];
        let tabChildren = {};
        for (var name in desc) {
            let obj = desc[name];
            if (name === '_conf') {
                continue;
            }
            if (typeof (obj.accordianTitle) === 'string') {
                conf.tabs.push(obj.accordianTitle);
            } else {
                conf.tabs.push(name);
            }
            if (typeof (obj) === 'object') {
                tabChildren[name] = obj;
            }
        }
        desc = new SMDUIAccordianPanel(content, conf);
        if (desc.css) {
            hh.addCssToDom(desc.css, desc);
        }

        //if there is _dest in conf element use it to put link of the created element
        if (typeof (conf._dest) === 'object' && conf._dest.object) {
//            debugger;
            conf._dest.object[conf._dest.name || ('tabPanel-' + (++hhContentBuilder.var.elementCounter))] = desc;
        }


        for (var name in  tabChildren) {
            let tabObj = tabChildren[name];
            let tabContent = desc.getTabContentByName(tabObj.accordianTitle || name);
            //delete tabObj.accordianTitle;
            for (var itemName in tabObj) {
                if (itemName === '_dest' && typeof (tabObj._dest) === 'object' && tabObj._dest.object) {
                    tabObj._dest.object[tabObj._dest.name || ('tabPanel-' + (++hhContentBuilder.var.elementCounter))] = tabContent;
                }
                if (itemName !== 'id' && itemName !== 'css' && itemName !== 'class' && itemName !== '_dest' && itemName !== '_conf' && itemName !== 'accordianTitle') {
                    hhContentBuilder.smdui_createContentFromObject(tabObj[itemName], itemName, tabContent);
                }

            }
        }


    } catch (e) {
        console.warn(e);
    }
};
hhContentBuilder.smdui_createContentTab = function (desc, descName, content) {
    try {
        let conf = desc._conf || {};
        delete desc._conf;
        conf.menuItem = [];
        let tabChildren = {};
        for (var name in desc) {
            let obj = desc[name];
            if (name === '_conf') {
                continue;
            }
            if (typeof (obj.tabTitle) === 'string') {
                conf.menuItem.push(obj.tabTitle);
            } else {
                conf.menuItem.push(name);
            }
            if (typeof (obj) === 'object') {
                //to build further
                tabChildren[name] = obj;
            }
        }
        desc = new TabPanel(content, conf);
        if (desc.css) {
            hh.addCssToDom(desc.css, desc);
        }

        //if there is _dest in conf element use it to put link of the created element
        if (typeof (conf._dest) === 'object' && conf._dest.object) {
//            debugger;
            conf._dest.object[conf._dest.name || ('tabPanel-' + (++hhContentBuilder.var.elementCounter))] = desc;
        }
        for (var name in  tabChildren) {
            let tabObj = tabChildren[name];
            let tabContent = desc.getItemContentByLabel(tabObj.tabTitle || name);
            delete tabObj.tabTitle;
            for (var itemName in tabObj) {
                if (itemName === '_dest' && typeof (tabObj._dest) === 'object' && tabObj._dest.object) {
                    tabObj._dest.object[tabObj._dest.name || ('tabPanel-' + (++hhContentBuilder.var.elementCounter))] = tabContent;
                }
                hhContentBuilder.smdui_createContentFromObject(tabObj[itemName], itemName, tabContent);
            }
        }


    } catch (e) {
        console.warn(e);
    }
};
hhContentBuilder.loadXML = function (url) {
    var http = new XMLHttpRequest();
    http.open("GET", url, false);
    http.send();
    xmlBody = http.responseXML;
    var g = document.createElementNS(SVG.ns, "g");
    var svg = xmlBody.getElementsByTagName("svg")[0];
    do {
        var child = svg.firstChild;
        g.appendChild(child);
    } while (svg.firstChild);
    debugger;
    let cont = document.createElement("svg");
    cont.appendChild(g);
    return g;
};
