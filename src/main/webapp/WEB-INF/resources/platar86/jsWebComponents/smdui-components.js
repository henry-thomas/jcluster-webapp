//(function (root) {
//    let Component = function () {
//        return new Component.init();
//    };
//
//    Component.init = function () {
//        this.elements = {};
//        this.paramElements = {};
//    };
//
//    Component.prototype.addElement = function (name, element) {
//        if (!this.elements[name]) {
//            this.elements[name] = {};
//        }
//        let count = 0;
//        for (let i in this.elements[name]) {
//            count++;
//        }
//        this.elements[name][count] = element;
//    };
//    
//    Component.prototype.addParamComp = function (name, element) {
//        if (!this.paramElements[name]) {
//            this.paramElements[name] = {};
//        }
//        let count = 0;
//        for (let i in this.paramElements[name]) {
//            count++;
//        }
//        this.paramElements[name][count] = element;
//    };
//
//    Component.prototype.button = function (cfg) {
//        let button = document.createElement('smdui-button');
//        if (cfg) {
//            if (cfg.text) {
//                button.text = cfg.text;
//            }
//            if (cfg.type) {
//                button.type = cfg.type;
//            }
//        }
//
//        this.addElement('button', button);
//        return button;
//    };
//
//    Component.prototype.tooltip = function (cfg) {
//        let tooltip = document.createElement('smdui-tooltip');
//        if (cfg) {
//            if (cfg.text) {
//                tooltip.text = cfg.text;
//            }
//        }
//        this.addElement('tooltip', tooltip);
//        return tooltip;
//    };
//
//    Component.prototype.dialog = function (cfg) {
//        let dialog = document.createElement('smdui-dialog');
//        if (cfg) {
//            if (cfg.heading) {
//                dialog.heading = cfg.heading;
//            }
//            if (cfg.content) {
//                dialog.content = cfg.content;
//            }
//        }
//        this.addElement('dialog', dialog);
//        return dialog;
//    };
//
//    Component.prototype.modal = function (cfg) {
//        // cfg=[{tab: string, page: element, cb: function}]
//        let modal = document.createElement('smdui-modal');
//        if (cfg) {
//            if (cfg.heading) {
//                modal.heading = cfg.heading;
//            }
//            // for (let i = 0; i < cfg.length; i++) {
//            //     tabs.addTab(cfg[i].tab, cfg[i].page, cfg[i].cb);
//            // }
//        }
//        this.addElement('modal', modal);
//        return modal;
//    };
//
//    Component.prototype.dropdown = function (cfg) {
//        let dropdown = document.createElement('smdui-dropdown');
//        if (cfg) {
//            if (cfg.text) {
//                dropdown.text = cfg.text;
//            }
//            if (cfg.content) {
//                dropdown.items = cfg.content;
//            }
//            if (cfg.type) {
//                dropdown.type = cfg.type;
//            }
//        }
//        this.addElement('dropdown', dropdown);
//        return dropdown;
//    };
//
//    Component.prototype.tabs = function (cfg) {
//        // cfg=[{tab: string, page: element, cb: function}]
//        let tabs = document.createElement('smdui-tabs');
//        if (cfg) {
//            for (let i = 0; i < cfg.length; i++) {
//                tabs.addTab(cfg[i].tab, cfg[i].page, cfg[i].cb);
//            }
//        }
//        this.addElement('tabs', tabs);
//        return tabs;
//    };
//
//    //utils
//    Component.prototype.addTooltip = function (target, text) {
//        if (typeof (target) !== 'object') {
//            console.warn('Must be an html element');
//        } else {
//            let tooltip = this.tooltip({text: text});
//            tooltip.element = target;
//            return tooltip;
//        }
//    };
//
//    Component.init.prototype = Component.prototype;
//
////    root.sui = root.smdui(); // e.g. let b = sui.button(cfg);
//    console.log('smdui-components init');
//
//}(window));