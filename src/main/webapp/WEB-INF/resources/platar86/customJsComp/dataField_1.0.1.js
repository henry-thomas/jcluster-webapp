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
 *  new SMDUIDataField(testPanel, {
 *      title: "Test Current",
 *      unit: "A"
 *  });
 *  
 *  
 */

/* global HTMLElement, hh, dfm */


/* How to use Formatter to select a prefix
 * let test = document.querySelector('card')
 * window.test = hh.adf(test, 'title: ', 'W', {
 * sIPrefix: 'k'                               ******* if you want to add more ['k','G']
 * }); */

(function (root) {
    const sIPrefixValueMap = {
        'a': {mult: 1E-18, lenToFormat: -18, unit: 'a'},
        'f': {mult: 1E-15, lenToFormat: -15, unit: 'f'},
        'p': {mult: 1E-12, lenToFormat: -12, unit: 'p'},
        'n': {mult: 1E-9, lenToFormat: -9, unit: 'n'},
        'u': {mult: 1E-6, lenToFormat: -6, unit: 'u'},
        'm': {mult: 1E-3, lenToFormat: -3, unit: 'm'},
        ' ': {mult: 1, lenToFormat: 0, unit: ' '},
        'k': {mult: 1E3, lenToFormat: 3, unit: 'k'},
        'M': {mult: 1E6, lenToFormat: 6, unit: 'M'},
        'G': {mult: 1E9, lenToFormat: 9, unit: 'G'},
        'T': {mult: 1E12, lenToFormat: 12, unit: 'T'},
        'P': {mult: 1E15, lenToFormat: 15, unit: 'P'},
        'E': {mult: 1E18, lenToFormat: 18, unit: 'E'}
    };

    function validateSiPrefix(a) {
        if (typeof (a) === 'string' && sIPrefixValueMap[a]) {
            return  [sIPrefixValueMap[a]];
        }
        if (Array.isArray(a)) {
            let arr = [];
            //remove invalid prefixes
            for (var item in a) {
                if (sIPrefixValueMap[a[item]]) {
                    arr.push(sIPrefixValueMap[a[item]]);
                }
            }

            //sort prefixes 
            arr.sort(function (a, b) {
                if (a.lenToFormat > b.lenToFormat) {
                    return 1;
                } else if (a.lenToFormat < b.lenToFormat) {
                    return -1;
                }
                return 0;
            });

            return arr;
        }

        if (typeof (a) === 'boolean' && a) {
            let arr = [];

            for (var item in sIPrefixValueMap) {
                arr.push(sIPrefixValueMap[item]);
            }

            arr.sort(function (a, b) {
                if (a.lenToFormat > b.lenToFormat) {
                    return 1;
                } else if (a.lenToFormat < b.lenToFormat) {
                    return -1;
                }
                return 0;
            });

            return arr;
        }

        return null;
    }

    let SMDUIDataField = function (parentEl, conf) {
        this.conf = conf;
        if (!(parentEl instanceof HTMLElement)) {
            console.warn("SMDUIDataField ex: Must pass valid HTMLElement");
            return;
        }
        this.parentEl = parentEl;
        this.data = {
            title: null,
            value: null,
            unit: null
        };
        init.call(this);
    };
    let  prot = SMDUIDataField.prototype;
    prot.onValueClick = function (cb) {

    };
    prot.setTitle = function (title) {
        this.title = title;
    };
    prot.setNA = function () {
        this.value = "N/A";
    };
    prot.setValue = function (value) {
        this.value = value;
    };
    prot.setUnit = function (unit) {
        this.unit = unit;
    };
    prot.getTitle = function () {
        return this.title;
    };
    prot.getValue = function () {
        return this.value;
    };
    prot.getUnit = function () {
        return this.unit;
    };
    function init() {

        if (!this.conf.title) {
            console.warn("Require atleast a title for datafield");
            return;
        }

        if (this.conf.sIPrefix) {
            this.conf.sIPrefix = validateSiPrefix(this.conf.sIPrefix);
        }

        this.el = createDataField.call(this, this.conf);

        this.data.title = this.conf.title;
        this.data.value = "N/A";
        this.data.unit = this.conf.unit;

        if (this.conf.tooltip) {
            this.tooltipTitle = new SMDUITooltipJs(this.el.titleEl, {
                text: this.conf.tooltip
            });
        }

        if (this.conf.ctxMenu) {
            this.ctxMenu = new ContextMenu(this.el.valueEl, this.conf.ctxMenu);
          
        }

        Object.defineProperty(this, 'title', {
            set: function (val) {
                this.data.title = val;
                this.el.titleEl.textContent = val;
            },
            get: function () {
                return this.data.title;
            }
        });
        Object.defineProperty(this, 'valueHtml', {
            set: function (val) {
                this.data.value = val;
                this.el.valueEl.innerHTML = val;
            },
            get: function () {
                return this.data.value;
            }
        });
        Object.defineProperty(this, 'value', {
            set: function (val) {
                if (this.conf.debugSet) {
                    debugger;
                }

                this.data.value = val;
                let value = format.call(this, val);
                if (value === undefined) {
                    value = "N/A";
                }
                this.el.valueEl.textContent = value;
            },
            get: function () {
                return this.data.value;
            }
        });
        Object.defineProperty(this, 'html', {
            set: function (val) {
                this.data.html = val;
                this.el.valueEl.innerHTML = val;
            },
            get: function () {
                return this.data.html;
            }
        });
        Object.defineProperty(this, 'tooltipValue', {
            get: function (val) {
//                debugger;
                if (this.tooltipValueComp === undefined) {
                    this.tooltipValueComp = new SMDUITooltipJs(this.el.valueEl);
                }
                return this.tooltipValueComp;
            }
        });
        Object.defineProperty(this, 'tooltipTitle', {
            get: function (val) {
                if (this.tooltipTitleComp === undefined) {
                    this.tooltipTitleComp = new SMDUITooltipJs(this.el.titleEl);
                }
                return this.tooltipTitleComp;
            }
        });

        Object.defineProperty(this, 'unit', {
            set: function (val) {
//                this.data.unit = val;
                this.el.unitEl.textContent = val;
            },
            get: function () {
                return this.data.unit;
            }
        });
        this.parentEl.appendChild(this.el);
    }

    function createDataField(conf) {
        if (typeof (conf) === 'object') {
            let div = document.createElement('div');

            div.classList.add('actDataPanel');

            div.style.cursor = "default";

            


            let title = document.createElement('span');
            title.textContent = conf.title || " ";
            div.appendChild(title);
            let value = document.createElement('span');

            if (typeof (conf.link) === 'string') {
                value.innerHTML = (conf.value || " ").link(conf.link);
            } else {
                value.textContent = conf.value || " ";
            }

            div.appendChild(value);
            if (conf.valueOnClick) {
                value.classList.add('linkItem');
                value.onclick = conf.valueOnClick;
            }

            let unit = document.createElement('span');
            unit.textContent = conf.unit || " ";
            if (conf.unitClass) {
                unit.classList.add(conf.unitClass);
            }

            div.appendChild(unit);
//            if (typeof (conf.tooltip) === 'string') {
//                let tooltip = document.createElement('span');
//                tooltip.textContent = conf.tooltip || " ";
//                tooltip.classList.add('tooltiptext');
//                title.appendChild(tooltip);
//            }

            div.titleEl = title;
            div.valueEl = value;
            div.unitEl = unit;
            return div;
        }
    }

    function getSiFormat(num) {
        if (this.conf.sIPrefix) {
            if (this.conf.sIPrefix.length === 1) {
                return this.conf.sIPrefix[0];
            } else {
//                let intNum = num.floor;
                let numLen = String(Math.floor(num)).length;
                if (this.conf.sIPrefixRoundUp && numLen % 3 === 0) {
                    //sIPrefixRoundUp = Do not format >=100 to kilo
                    numLen -= 1;
                }
                let si = null;
                //loop from highger to lower
                for (var i = this.conf.sIPrefix.length - 1; i >= 0; i--) {
                    si = this.conf.sIPrefix[i];
                    if (numLen >= si.lenToFormat) {
                        break;
                    }
                }
                return si;
            }
        }
    }

    function format() {
        let val = this.data.value;

        if (typeof (this.conf.formatter) === 'function') {
            val = this.conf.formatter.call(this, val, this.data.unit);
        }
        if (this.conf.datamap) {
            val = this.conf.datamap[val];
        }

        if (typeof val === 'number') {
            if (this.conf.sIPrefix) {
                let si = getSiFormat.call(this, val);
                this.unit = si.unit + this.data.unit;
                val = val / si.mult;
            }

            if (this.conf.decimal) {
                return val.toFixed(this.conf.decimal);
            }
        }
        return val;
    }

    root.SMDUIDataField = SMDUIDataField;
}(window));
//let fieldData = {
//    id: "ssgtD-currentA",
//    title: "Test DataField",
//    value: 1500,
//    unit: "A",
//};
