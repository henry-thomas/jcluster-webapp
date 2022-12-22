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

(function (root) {
    let SMDUITable = function (parentEl, conf) {
        if (parentEl) {
            this.parentEl = hh.validateDomEl(parentEl);
        } else {
            console.warn('Please pass a valid parent element.');
            return;
        }
        this.conf = conf || {};
        this.columns = {};
        this.rowData = [];
        init.call(this);
    };

    let prot = SMDUITable.prototype;

//Public functions
    prot.addColumns = function (columns) {
        //Loop if cols is array
        if (Array.isArray(columns)) {
            for (let i = 0; i < columns.length; i++) {
                if (this.columns[columns[i].headerText]) {
                    continue;
                }

                let headerEl = document.createElement('th');
                hh.addClass(headerEl, ["ui-state-default"]);

                let headerText = document.createElement('span');
                hh.addClass(headerText, ["ui-column-title"]);

                if (columns[i].headerText) {
                    headerText.innerHTML = columns[i].headerText;
                }

                if (columns[i].field) {
                    this.columns[columns[i].field] = columns[i];
                }

                Object.defineProperty(columns[i], 'dat', {
                    set: function (val) {
                        columns[i].td = document.createElement('td');
                        columns[i].td.innerHTML = val;
                    },
                    get: function () {
                        return columns[i].td;
                    }
                });

                headerEl.appendChild(headerText);
                this.headerContainer.appendChild(headerEl);
            }
        } else {
            if (typeof (columns) === 'object') {
                this.addColumns([columns]);
            }
        }
    };

    prot.addRow = function (data) {
        let row = document.createElement('tr');

        for (let field in this.columns) {
//            let td = document.createElement('td');
            if (!data[field]) {
                this.columns[field].dat = "";
            } else {
                this.columns[field].dat = data[field];
            }
            row.appendChild(this.columns[field].dat);
        }

        this.dataContainer.appendChild(row);
    };

//Private functions
    function init() {
        this.container = document.createElement('table');
        hh.addClass(this.container, ["ui-datatable", "ui-widget"]);
        
        this.parentEl.appendChild(this.container);

        this.headerContainer = document.createElement('thead');
        hh.addClass(this.headerContainer, ["ui-state-default"]);
        this.container.appendChild(this.headerContainer);

        this.dataContainer = document.createElement('tbody');
        hh.addClass(this.dataContainer, ["ui-datatable-data", "ui-widget-content"]);
        this.container.appendChild(this.dataContainer);

        if (this.conf.columns) {
            this.addColumns(this.conf.columns);
        }
      

        if (this.conf.datasource) {
            for (let i = 0; i < this.conf.datasource.length; i++) {
                this.addRow(this.conf.datasource[i]);
            }
        }
//        if (this.conf.columns) {
//            this.addColumns(this.conf.columns);
//        }
    }
   



    root.SMDUITable = SMDUITable;
}(window));

//let fieldData = {
//    id: "ssgtD-currentA",
//    title: "Test DataField",
//    value: 1500,
//    unit: "A",
//};
