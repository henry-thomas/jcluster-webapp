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

/* global hh, Element */

(function (root) {
    let SMDUIAccordianPanel = function (parentEl, conf) {

        this.parentEl = hh.validateDomEl(parentEl, conf.parrentAsClass);
        this.conf = conf;

        this.tabs = {};
        this.uid = 0;
        init.call(this);

        if (isFunction(this.conf.onInitComplete)) {
            this.conf.onInitComplete(this);
        }
    };

    let fn = SMDUIAccordianPanel.prototype;

    function init() {
        this.container = document.createElement('div');
        hh.addClass(this.container, ['ui-accordion', 'ui-widget', 'ui-helper-reset', 'ui-hidden-container']);



        // Checking if we are passing the DOM element itself (DIV type)
        if (!(this.parentEl instanceof Element)) {
            // Checking if we are passing the ID of the DOM element
            this.parentEl = document.querySelector('#' + this.parentEl);
            if (!this.parentEl) {
                // Checking if we are passing the (unique) class of the DOM element
                this.parentEl = document.querySelector('.' + this.parentEl);
            }
        }

        if (this.parentEl) {
            this.parentEl.appendChild(this.container);
        }

        //you can pass array with Names only
        if (Array.isArray(this.conf.tabs) && typeof (this.conf.tabs[0]) === 'string') {
            this.conf.tabsStr = clone(this.conf.tabs);
            this.conf.tabs.length = 0;
            for (let i = 0; i < this.conf.tabsStr.length; i++) {
                this.conf.tabs.push({
                    label: this.conf.tabsStr[i],
                    id: i
                });
            }
        }

        if (this.conf.tabs) {
            for (let tab in this.conf.tabs) {


                this.addTab(this.conf.tabs[tab]);
            }
        }
        try {
            this.tabs[this.conf.selectedTab].isOpen = true;
        } catch (e) {
        }

//        if ((this.conf.selectedTab !== (null || undefined))) {
//            this.tabs[this.conf.selectedTab].isOpen = true;
//        }
    }



    fn.addTab = function (tab) {
        let tabContainer = document.createElement('div');

        let tabHeadingDiv = document.createElement('div');
        hh.addClass(tabHeadingDiv, ['ui-accordion-header', 'ui-helper-reset', 'ui-state-default', 'ui-corner-top', 'smdui-accordion-tab']);
        tabHeadingDiv.onclick = onTabClick.bind(this, tabContainer);

        let arrowElement = document.createElement('span');
        tabHeadingDiv.appendChild(arrowElement);
        tabHeadingDiv.arrow = arrowElement;
        hh.addClass(arrowElement, ['ui-icon', 'ui-icon-triangle-1-e']);

        let headingSpan = document.createElement('span');
        tabHeadingDiv.appendChild(headingSpan);
        tabHeadingDiv.headingSpan = headingSpan;

        tabContainer.tabHeadingDiv = tabHeadingDiv;
        tabContainer.appendChild(tabHeadingDiv);


        if (tab.label) {
            tabHeadingDiv.headingSpan.innerHTML = tab.label;
        } else {
            tabHeadingDiv.headingSpan.innerHTML = 'Heading';
        }

        let tabContentDiv = document.createElement('div');
        hh.addClass(tabContentDiv, ['ui-accordion-content', 'ui-helper-reset', 'ui-widget-content']);
        tabContainer.appendChild(tabContentDiv);
        tabContainer.tabContentDiv = tabContentDiv;
        tabContainer.tabContentDiv.style.display = 'none';
        // tabContainer.tabContentDiv.style.overflow = 'unset';
        tabContentDiv._isOpen = false;


        if (!tab.content) {
            tab.content = document.createElement('div');
        }
        tabContentDiv.appendChild(tab.content);

        hh.addClass(tab.content, this.conf.contentClass);

        if (tab.id !== undefined) {
            if (this.tabs[tab.id]) {
                tab.id = this.uid++;
            }
        } else {
            tab.id = this.uid++;
        }
        this.tabs[tab.id] = tabContainer;
        this.container.appendChild(tabContainer);

        Object.defineProperty(tabContainer, 'isOpen', {
            set: function (val) {
                if (!val) {
                    tabContainer.tabHeadingDiv.arrow.classList.remove('ui-icon-triangle-1-s');
                    hh.addClass(tabContainer.tabHeadingDiv.arrow, ['ui-icon-triangle-1-e']);
                    tabContainer.tabContentDiv.style.display = 'none';
                    tabContainer.tabContentDiv._isOpen = false;
                    tabContainer.tabHeadingDiv.classList.remove('ui-state-active');
                } else {
                    tabContainer.tabHeadingDiv.arrow.classList.remove('ui-icon-triangle-1-e');
                    hh.addClass(tabContainer.tabHeadingDiv.arrow, ['ui-icon-triangle-1-s']);
                    tabContainer.tabContentDiv.style.display = 'block';
                    tabContainer.tabContentDiv._isOpen = true;
                    tabContainer.tabHeadingDiv.classList.add('ui-state-active');
                }
            },
            get: function () {
                return tabContainer.tabContentDiv._isOpen;
            }
        });

        Object.defineProperty(tabContainer, 'content', {
            set: function (val) {
                if (typeof (val) === 'object') {
                    let isOpen = tabContainer.isOpen;
                    tabContainer.tabContentDiv.remove();

                    let tabContentDiv = document.createElement('div');
                    hh.addClass(tabContentDiv, ['ui-accordion-content', 'ui-helper-reset', 'ui-widget-content']);

                    tabContainer.tabContentDiv = tabContentDiv;
                    tabContainer.appendChild(tabContentDiv);

                    tabContainer.tabContentDiv.appendChild(val);
                    tabContainer.isOpen = isOpen;
                }
            },
            get: function () {
                return tabContainer.tabContentDiv.firstChild;
            }
        });
        
        return tab.content;
    };

    fn.hideTab = function (name) {

    };

    fn.removeTab = function (index) {
        if (typeof (index) === ('string' || 'number')) {
            try {
                this.tabs[index].remove();
                this.tabs.splice(index);
            } catch (e) {
                console.warn('No such tab in tab panel: ', e);
            }
        }
        if (typeof (index) === 'HTMLElement' && this.tabs.has) {
            index.remove();
        }
    };

    fn.getTabByTitle = function (text) {
        for (var id in this.tabs) {
            if (this.tabs[id].innerText === text) {
                return this.getTabById(id);
            }
        }
        return null;
    };

    fn.getTabContentById = function (id) {
        return this.tabs[id].content;
    };
    fn.getTabById = function (id) {
        return this.tabs[id];
    };

    fn.getTabContent = function (id) {
        try {
            return this.tabs[id].content;
        } catch (e) {
        }
        return null;
    };

    fn.getTabContentByName = function (name) {
        try {
            return this.getTabByTitle(name).content;
        } catch (e) {
        }
        return null;
    };

    root.SMDUIAccordianPanel = SMDUIAccordianPanel;

    function onTabClick(tabContainer, event) {
        let tabHeading;
        if (!this.conf.multiple) {
            for (let tab in this.tabs) {
                tabHeading = event.target;
                if ((event.target.parentNode === this.tabs[tab].tabHeadingDiv)) { //Check if a child of the tab heading is clicked
                    tabHeading = event.target.parentNode;
                    // console.log(tabHeading);
                }
                if ((tabHeading !== this.tabs[tab].tabHeadingDiv)) {
                    this.tabs[tab].isOpen = false;
                }
            }
        }

        if (tabContainer.tabContentDiv._isOpen) {
            tabContainer.isOpen = false;
        } else {
            tabContainer.isOpen = true;
        }
    }

}(window));
