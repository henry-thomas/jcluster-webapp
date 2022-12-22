/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by platar86, henry, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 *  NOTES
 *  conf is passed when initializing the tabPanel. Tabs can be passed later
 *  with addTab(menuEl).
 *  
 *  onTabChange can be used to initialize heavy tab content. OR add callback when
 *  adding menu item
 *  series.contentPanel = this.settingsTabPanelSeries.addItem({
 *              contentId: argObj.seriesName,
 *              contentClass: 'smdui-tabPanel-contentFlexRow',
 *              onInitClickCb: function(index, conentEl, comp){
 *              console.log(index, conentEl, comp);
 *          } 
 *      });
 *  
 *  if 'sortable: true' is passed in conf, an index called 'contentIndex'
 *  ,which is defined when passing each tab object to addTab(), is used to 
 *  sort the tab order on init. Otherwise each tab is assigned an index called
 *  'sortIndex' after the tabs are sorted.
 *  
 *  'onSortEndCb: fn()' can be passed in conf, which will execute after each sort.
 *  Only applicable if 'sortable: true' is also passed. A custom event called
 *  'onSortEnd' can be listened for, which achieves the same, but event.detail
 *  contains the sorted array of tabs. The sorted array is also stored on 
 *  the tabPanel instance, so it is not necessary to use the event.
 *   
 */

//MUST CHANGE VERSION!!!

/* global HTMLElement, hh, mu */

function TabPanel(el, conf) {
    if (!hh.isElement(el)) {
        console.warn("Not valid HTML Element", el);
    }

    this.el = el;

    this.conf = conf || {};

    this.menuContent = {};
    this.contentElArr = {};
    this.contentTabArr = {};

    this.sortedArr = [];
    this.itemList = {};

    this.init();
    if (typeof (this.conf.onInitComplete) === 'function') {
        this.conf.onInitComplete(this);
    }

}

TabPanel.prototype.init = function () {
    if (!this.isInitComplete) { //to avoid reinit
        this.isInitComplete = true;

        this.container = document.createElement('div');
        this.container.classList.add('smdui-tabPanel-container');

        this.menuPanel = document.createElement('div');
        if (this.conf.sortable) {

            this.conf.sortableOptions = this.conf.sortableOptions || {};
            let sortOptions = this.conf.sortableOptions;

            this.dragDropSort = suiSort(this.menuPanel, sortOptions);
            window.ddSort = this.dragDropSort;
            if (!sortOptions.onEnd) {
                sortOptions.onEnd = {};
            }
            //evt is the onEnd event, can be used in the callback (onEndCb) in the sortableOptions.
            //onEnd is a function that is given to suiSortable object to execute after drag operation.
            //onTabDragEnd is a function that is passed as a parameter to tabPanel, and is executed after onEnd. 
            sortOptions.onEnd = function () {

                this.sortedArr = this.dragDropSort.elements;
                for (let i = 0; i < this.sortedArr.length; i++) {
                    this.sortedArr[i].sortIndex = i;
                }

                let el = this.menuPanel.firstChild;
                let i = 0;
                while (el) {
                    if (isNaN(el.sortIndex)) {
                        el.sortIndex = i;
                    }
                    i++;
                    el = el.nextSibling;
                }


                //custom event for tabPanel, when the tabs are reordered
                const onSortEnd = new CustomEvent('onSortEnd', {
                    detail: {sortedArr: this.sortedArr},
                    bubbles: true
                });

                //onEndCb can be passed in tabPanel conf object, instead of using custom event (onSortEnd).
                if (isFunction(sortOptions.onTabDragEnd)) {
                    sortOptions.onTabDragEnd();
                }

                this.menuPanel.dispatchEvent(onSortEnd);
            }.bind(this, this.menuPanel);
            //push to array which is executed on drag end
            this.dragDropSort.onEnd = sortOptions.onEnd;
//            window.ddSort = this.dragDropSort;
        }
        if (this.conf.stickyMenu) {
            this.menuPanel.addCssFromString('position: sticky; top: 48px; z-index: 1;');
        }

        this.menuPanel.classList.add('smdui-tabPanel-menu');
        this.contentPanel = document.createElement('div');
        this.contentPanel.classList.add('smdui-tabPanel-content');

        //added for having tab independent content 
        this.contentContainer = document.createElement('div');
        this.contentContainer.classList.add('smdui-tabPanel-contentContainer');

        this.contentPanelHeader = document.createElement('div');
        this.contentPanelHeader.classList.add('smdui-tabPanel-contentHeader');
        this.contentPanelFooter = document.createElement('div');
        this.contentPanelFooter.classList.add('smdui-tabPanel-contentFooter');

        this.contentContainer.appendChild(this.contentPanelHeader);
        this.contentContainer.appendChild(this.contentPanel);
        this.contentContainer.appendChild(this.contentPanelFooter);

        this.container.appendChild(this.menuPanel);
        this.container.appendChild(this.contentContainer);

        this.el.appendChild(this.container);

        //you can pass array with Names only
        if (Array.isArray(this.conf.menuItem) && typeof (this.conf.menuItem[0]) === 'string') {
            this.conf.menuItemStr = clone(this.conf.menuItem);
            this.conf.menuItem.length = 0;
            for (let i = 0; i < this.conf.menuItemStr.length; i++) {
                this.conf.menuItem.push({
                    label: this.conf.menuItemStr[i],
                    contentId: i,
                    id: i
                });
            }
        }

        let menuItem = Array.isArray(this.conf.menuItem) ? this.conf.menuItem : [];

        for (let i = 0; i < menuItem.length; i++) {
            let item = menuItem[i];
            //assigne contentID if not exist
            if (item.contentId !== undefined) {
                item.id = item.contentId;
            }
            if (item.id === undefined) {
                item.id = i;
            }
            this.addItem(item, true);
        }

        let fnItem = Array.isArray(this.conf.fnItem) ? this.conf.fnItem : [];
//        console.log(fnItem);
        for (let i = 0; i < fnItem.length; i++) {
            let item = fnItem[i];
            //assigne contentID if not exist
            if (item.id === undefined) {
                item.id = i;
            }
            this.addFnItem(item);
        }


        let el = this.menuPanel.firstChild;
        let i = 0;
        while (el) {
            if (isNaN(el.sortIndex)) {
                el.sortIndex = i;
            }
            i++;
            el = el.nextSibling;
        }
        this.revalidateSelection();

    }
};

//Object.defineProperty(TabPanel.prototype, "contentContainer", {
//    get: function () {
//        return this.contentContainer;
//    }
//});

Object.defineProperty(TabPanel.prototype, "headerPanel", {
    get: function () {
        return this.contentPanelHeader;
    }
});

Object.defineProperty(TabPanel.prototype, "footerPanel", {
    get: function () {
        return this.contentPanelFooter;
    }
});


TabPanel.prototype.getMenuPannel = function () {
    return this.menuPanel;
};

TabPanel.prototype.revalidateSelection = function () {
    //try select the first element if the tabs are sorted
    if (this.conf.sortable) {
        let itemSelected = false;
        for (let i = 0; i < Object.keys(this.contentTabArr).length; i++) {
            if (this.contentTabArr[Object.keys(this.contentTabArr)[i]].sortIndex === 0) {
                this.selectItem(this.menuContent[Object.keys(this.menuContent)[i]]);
                itemSelected = true;
            }
        }
        if (itemSelected) {
            return;
        }
    }

    if (this.conf.initSelect !== undefined && this.menuContent[this.conf.initSelect]) {
        this.selectItem(this.menuContent[this.conf.initSelect]);
    } else {
        if (Object.keys(this.menuContent).length > 0) {
            this.selectItem(this.menuContent[Object.keys(this.menuContent)[0]]);
        }
    }
};

TabPanel.prototype.setTabIndex = function (tabName, index, update) {
    try {
        this.contentTabArr[tabName].sortIndex = index;
        if (update) {
            this.refresh();
        }
    } catch (e) {
    }
};

TabPanel.prototype.refresh = function (revalidateSelection) {
    for (let menuItem in this.contentTabArr) {
        if (this.contentTabArr[menuItem].sortIndex !== undefined) {
            this.itemList[menuItem].refresh = true;
            this.menuPanel.removeChild(this.contentTabArr[menuItem]);
        }
    }

    for (let tabItem in this.contentTabArr) {
        let menuEl = this.contentTabArr[tabItem];
        let menuPanel = this.menuPanel;
        if (this.conf.sortable && menuEl.sortIndex !== undefined) {
            if (menuPanel.children.length === 0) {

                menuPanel.appendChild(menuEl);
//                console.log(item.contentIndex + ' first elem ' + item.id);

            } else {
                let pos = 0;
                for (let i = 0; i < menuPanel.children.length; i++) {
                    if (Object.values(this.contentTabArr)[i].sortIndex <= menuEl.sortIndex) {
                        pos++;
                    }
                }
                if (pos === menuPanel.children.length) {
                    // Tab added to end
                    menuPanel.appendChild(menuEl);
                } else {
                    // Tab added at specific position
                    menuPanel.insertBefore(menuEl, menuPanel.children[pos]);
                }
            }
        } else {
            menuPanel.appendChild(menuEl);
        }
    }
    if (revalidateSelection) {
        this.revalidateSelection();
    }
};

TabPanel.prototype.addFnItem = function (fnItem) {
    let menuPanel = this.menuPanel;

    if (fnItem && isFunction(fnItem.fn)) {
        let menuEl = document.createElement('div');
        menuEl.classList.add('smdui-tabPanel-menuEl');
        let menuElLabel = document.createElement('span');

        menuElLabel.textContent = fnItem.label || "";

        menuEl.appendChild(menuElLabel);

        if (this.conf.sortable) {
            menuEl.draggable = true;
        }
        menuPanel.appendChild(menuEl);

        if (fnItem.css) {
            hh.addCssToDom(fnItem.css, menuEl);
        }
        if (fnItem.icon) {
            let iconEl = document.createElement('i');
            let classArr = fnItem.icon.split(" ");
            for (let i = 0; i < classArr.length; i++) {
                iconEl.classList.add(classArr[i]);
            }
            menuEl.appendChild(iconEl);
        }

        if (fnItem.iconBeforeText) {
            menuEl.appendChild(menuElLabel);
        }

        if (isNaN(menuEl.sortIndex)) {
            menuEl.sortIndex = Object.keys(this.contentTabArr).length;
        }

        menuEl.onclick = function () {
            fnItem.fn(this);
        }.bind(this);
    }
};

TabPanel.prototype.addItem = function (item, isInit) {
    let menuPanel = this.menuPanel;
    if (item && item.contentId !== undefined) {
        item.id = item.contentId;
    }
    if (typeof (item) === 'object' && item.id !== undefined) {
        item.label = item.label || item.id;
        let found = false;
        for (let i = 0; i < this.conf.menuItem.length; i++) {
            if (this.conf.menuItem[i].id === item.id) {
                found = true;
                break;
            }
        }
        if (!found) {
            this.conf.menuItem.push(item);
        }

        if (this.getItemContent(item.id) && !item.refresh) {
            console.warn('Dupblicate Content Id In Tab panel: ' + item.id, this);
            return;
        }

        let idx = item.id; //this index is used for selection
        let menuEl = document.createElement('div');
        menuEl.menuIdx = idx;
        menuEl.isInitClick = false;

        if (item.icon) {
            let iconEl = hh.i(menuEl);
            iconEl.classList.add('fas');
            iconEl.classList.add(item.icon);
            iconEl.style.paddingRight="5px";
            iconEl.style.color = item.iconColor;
        }

        menuEl.classList.add('smdui-tabPanel-menuEl');
        let menuElLabel = document.createElement('span');
        menuElLabel.classList.add('smdui-tabPanel-menuElLabel');
        menuElLabel.textContent = item.label || item.id;
        menuEl.appendChild(menuElLabel);

        //

        if (this.conf.sortable) {
            menuEl.draggable = true;
        }

//       
        menuPanel.appendChild(menuEl);
//        }

        this.contentTabArr[item.id] = menuEl;

        this.menuContent[idx] = menuEl;
        menuEl.onclick = this.selectItem.bind(this, menuEl);

        if (isFunction(item.onInitClickCb)) {
            menuEl.onInitClickCb = item.onInitClickCb;
        }

        let contentEl = document.createElement('div');
        contentEl.menuIdx = idx;
        hh.addClass(contentEl, item.contentClass);

        this.contentPanel.appendChild(contentEl);
        $(contentEl).hide();

//        if (item.id) {
        if (item.id !== undefined && item.id !== null) {
            contentEl.id = item.id;
            this.contentElArr[item.id] = contentEl;
        }

        contentEl.classList.add('smdui-tabPanel-content');
        menuEl.menuContentEl = contentEl;

        if (!this.getSelectedItem() || this.conf.sortable) {
            this.revalidateSelection();
        }
        this.itemList[item.id] = item;

        if (!isInit) {
            let el = this.menuPanel.firstChild;
            let i = 0;
            while (el) {
                if (isNaN(el.sortIndex)) {
                    el.sortIndex = i;
                }
                i++;
                el = el.nextSibling;
            }
        }

        return contentEl;
    }

};

TabPanel.prototype.getSelectedItem = function () {
    return this.selectedItem;
};

TabPanel.prototype.showTab = function (item) {
    let tab = this.contentTabArr[item];
    if (tab) {
        $(tab).show();
        tab.isHidden = false;
    }
    return;
};

TabPanel.prototype.hideTab = function (item) {
    let tab = this.contentTabArr[item];
    if (tab) {
        $(tab).hide();
        tab.isHidden = true;
    }

    if (this.getSelectedItem() !== tab) {
        return;
    }

    // Logic to select another tab.
    for (let i = 0; i < Object.keys(this.contentTabArr).length; i++) {
        if (!this.getTabByIndex(i).isHidden) {
            this.selectItem(this.getTabByIndex(i));
            return;
        }
    }
};

TabPanel.prototype.getTabByIndex = function (sortIndex) {
    for (let tab in this.menuContent) {
        if (this.menuContent[tab].sortIndex === sortIndex) {
            return this.menuContent[tab];
        }
    }
};

TabPanel.prototype.getItemContent = function (item) {
    return  this.contentElArr[item];
};

TabPanel.prototype.getItemContentByLabel = function (label) {
    for (let i = 0; i < this.conf.menuItem.length; i++) {
        if (this.conf.menuItem[i].label === label) {
            return this.contentElArr[this.conf.menuItem[i].id];
        }
    }
    return  null;
};

TabPanel.prototype.getItemContentById = function (contentId) {
    for (let i = 0; i < this.conf.menuItem.length; i++) {
        if (this.conf.menuItem[i].id === contentId) {
            return this.contentElArr[this.conf.menuItem[i].id];
        }
    }
    return  null;
};

TabPanel.prototype.getSelectedItemContent = function () {
    if (this.selectedItem && this.selectedItem.menuContentEl) {
        return this.selectedItem.menuContentEl;
    }
};

TabPanel.prototype.selectItem = function (menuEl) {
    if (this.getSelectedItem()) {
        if (this.getSelectedItem().menuIdx === menuEl.menuIdx) {
            return;
        }
        this.getSelectedItem().classList.remove('smdui-tabPanel-menuElSelected');
//        $(this.getSelectedItemContent()).hide('fast');
        $(this.getSelectedItemContent()).hide(this.conf.animation);
    }

    if (!menuEl.isInitClick) {
        if (isFunction(menuEl.onInitClickCb)) {
            menuEl.onInitClickCb(menuEl.menuIdx, menuEl.menuContentEl, this);
        }
        menuEl.isInitClick = true;
    }

    this.selectedItem = menuEl;
    this.selectedItem.classList.add('smdui-tabPanel-menuElSelected');

    let selectedItemContent = this.getSelectedItemContent();
    if (selectedItemContent) {
        $(selectedItemContent).show(this.conf.animation);
    }

    if (typeof (this.conf.onTabChange) === 'function') {
        this.conf.onTabChange(this.selectedItem.menuIdx, selectedItemContent, this.selectedItem);
    }
};
