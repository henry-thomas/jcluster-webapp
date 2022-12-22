/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2022
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */

/* global phc, hh, drChart, moment, dataRecFieldMap */

(function (root) {
    let DataRecController = function () {
        this.isChartInit = false;

        this.modelsData = {};
        this.deviceDropdownOptions = [];
        this.container = document.getElementById('drcContainer');

        this.selectedModelsArr = [];
        this.availableModelsArr = [];

        this.settings = {};
        this.devSettings = {};
        this.fields = [];
        this.selectedFields = {};

        this.chartData = [];

        init.call(this);
    };

    let prot = DataRecController.prototype;

    function init() {
        this.setAcc = new SMDUIAccordianPanel(this.container, {
            tabs: [
                {
                    label: 'Settings' //item 0
                }
            ]
        });

        this.setContainer = this.setAcc.getTabContent(0);
        this.setContainer.parentElement.style.overflow = 'initial';
        this.chartContainer = document.getElementById('drChart');
        this.setContainer.style.display = 'flex';
        this.setContainer.style.flexDirection = 'row';
        this.setContainer.style.justifyContent = 'space-around';

        this.devSelectDiv = hh.div(this.setContainer);
        this.devSelectDiv.style.display = 'flex';
        this.devSelectDiv.style.flexDirection = 'column';
        this.devSelectDiv.style.alignItems = 'center';
        this.fieldEnableDiv = hh.div(this.setContainer);

        this.chartContainer.classList.add('card');
        this.getDeviceModels();
    }

    function initUi() {
        hh.removeAllChilds(this.devSelectDiv);
        this.settings.modelSetting = new SettingPanel(this.devSelectDiv, {
            title: 'Device Model',
            toolTip: 'Choose different device model',
            type: 'dropDown',
            args: {},
            dropDownConf: {
                val: this.selectedModel,
                options: this.modelMap
            },

            onChange: function (val, args, settingsPanel) {
//                console.log(val);
                this.selectedModel = val;
                this.selectedDevice = this.modelSerNumsOptionsMap[val][0].value;
                this.deviceDropdownOptions = this.modelSerNumsOptionsMap[val];
                this.settings.deviceSetting.dropDown.reloadItem(this.modelSerNumsOptionsMap[val], this.modelSerNumsOptionsMap[val][0].value);
                this.settings.deviceSetting.onChangeCb();
                initUi.call(this);

            }.bind(this)
        });

        this.settings.deviceSetting = new SettingPanel(this.devSelectDiv, {
            title: 'Serial',
            toolTip: 'Change device selection',
            type: 'dropDown',
            args: {},
            dropDownConf: {
                val: this.selectedDevice,
                options: this.deviceDropdownOptions
            },

            onChange: function (val, args, settingsPanel) {
                this.selectedDevice = val;
                for (let devSets in this.devSettings) {
                    if (devSets === val) {
                        for (let setting in this.devSettings[devSets]) {
                            this.devSettings[devSets][setting].show();
                        }
                    } else {
                        for (let setting in this.devSettings[devSets]) {
                            this.devSettings[devSets][setting].hide();
                        }
                    }
                }

            }.bind(this)
        });


        this.updateButton = hh.button(this.devSelectDiv, 'Update');
        this.updateButton.onclick = function () {

            let fields = this.selectedFields;
            this.selectedModelsArr = [];
//            debugger;
            for (let field in fields) {
                if (fields[field].selected) {
                    if (!this.selectedModelsArr.includes(fields[field].model)) {
                        this.selectedModelsArr.push(fields[field].model);
                    }
                }
            }

            //drChart will attempt to fetch data, then call updateDataCache in dataRecordsManager
            drChart.onDateSelectionChange(this.selectedModelsArr);

        }.bind(this);
        this.updateButton.style.maxWidth = '150px';

    }

    prot.getDeviceModels = function () {
        let date = moment().format('YYYY-MM-DD');


        getDeviceModelsFromDb([
            {
                name: "calbackFn",
                value: "dataRecController.processModels"
            },
            {
                name: "beginDate",
                value: date
            },
            {
                name: "endDate",
                value: date
            }
        ]);
    };


    /*For initializing models that have data records available*/
    prot.processModels = function (dataStr, modelNameMap) {
        let data = JSON.parse(dataStr.replaceAll("\"{", "{").replaceAll("}\"", "}"));
        let modelsData = JSON.parse(modelNameMap);
        let modelSerNumsMap = {};

        for (let i in data) {
            let dstnctEntry = data[i];
            let model = dstnctEntry[0];
            let serNum = dstnctEntry[1];
            let fields = dstnctEntry[2].fields;
//            debugger;
//            for (let j in fields) {
//                fields[j] = fields[j];
////                fields[j] = serNum + '-' + fields[j];
//
//            }

            initDevFieldSettings.call(this, fields, serNum, model);

            if (!modelSerNumsMap[model]) {
                modelSerNumsMap[model] = [];
            }

            modelSerNumsMap[model].push(serNum);
        }
//        let modelSerNumsMap = JSON.parse(modelSerNums);

        this.modelMap = [];
        this.modelSerNumsOptionsMap = {};

        for (let model in modelSerNumsMap) {
            for (let i = 0; i < modelSerNumsMap[model].length; i++) {
                if (!this.modelSerNumsOptionsMap[model]) {
                    this.modelSerNumsOptionsMap[model] = [];
                }
                this.modelSerNumsOptionsMap[model].push({
                    label: modelSerNumsMap[model][i], value: modelSerNumsMap[model][i]
                });
            }
        }

        for (var model in modelsData) {
            this.modelMap.push({
                label: modelsData[model], value: model
            });
            this.availableModelsArr.push(model);
        }

        if (this.modelMap.length > 0) {
            this.selectedModel = this.modelMap[0].value;
            this.selectedModelsArr.push(this.selectedModel); //Need checkboxes to select the models
            this.deviceDropdownOptions = this.modelSerNumsOptionsMap[this.selectedModel];
            drChart.init(this.availableModelsArr);
            drChart.onDateSelectionChange(this.selectedModelsArr);
        }

//        for (let setting in this.settings) {
//            this.settings[setting].onChangeCb();
//        }

        initUi.call(this);
        this.settings.modelSetting.onChangeCb();

    };

    function initDevFieldSettings(fields, serNum, model) {
        for (let i = 0; i < fields.length; i++) {
            if (!this.devSettings[serNum]) {
                this.devSettings[serNum] = {};
            }
            if (!this.devSettings[serNum][fields[i]]) { //Creating enable settings for each field
//                this.fields.push(fields[i]);

                if (!this.devSettings[serNum][fields[i]]) {
                    let title = fields[i];
                    try {
                        title = dataRecFieldMap.modelMap[model][ fields[i]].title;
                    } catch (e) {
                    }

                    this.devSettings[serNum][fields[i]] = new SettingPanel(this.fieldEnableDiv, {
                        title: title,
//                    toolTip: 'Choose different device model',
                        type: 'switch',
                        args: {},
                        onChange: function (val, args, settingsPanel) {
                            if (!this.selectedFields[serNum + '-' + [fields[i]]]) {
                                this.selectedFields[serNum + '-' + fields[i]] = {};
                            }
                            if (val) {
                                this.selectedFields[serNum + '-' + fields[i]].selected = true;
                                this.selectedFields[serNum + '-' + fields[i]].model = model; //To associate field with model
                                this.selectedFields[serNum + '-' + fields[i]].serNum = serNum; //To associate field with serNum
                                this.selectedFields[serNum + '-' + fields[i]].fieldName = fields[i]; //To associate field with serNum
                            } else {
                                this.selectedFields[serNum + '-' + fields[i]].selected = false;
                                this.selectedFields[serNum + '-' + fields[i]].model = null;
                                this.selectedFields[serNum + '-' + fields[i]].serNum = null;
                                this.selectedFields[serNum + '-' + fields[i]].fieldName = null; //To associate field with serNum
                            }
                        }.bind(this)
                    });
                }
            }
        }
    }

    prot.updateDataCache = function (data) {
        onDataReceived.call(this, data);
//        initUi.call(this);
        initSelectedData.call(this);
        for (let field in this.selectedFields) {
            if (this.selectedFields[field].selected) {
                drChart.addPowerReqSeries(this.selectedFields[field].fieldName, this.selectedFields[field]);
            }
        }
        drChart.addData(this.chartData);
        return this.chartData;
    };

    /*
     * drChart checks if the data is known on the chart. If the data is known, this will just 
     * go to check the applied settings in initSelectedData
     * 
     * */
    function onDataReceived(data) {
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                if (!this.modelsData[data[i].model]) {
                    this.modelsData[data[i].model] = {};
                }
                if (!this.modelsData[data[i].model].serialNumbers) {
                    this.modelsData[data[i].model].serialNumbers = {};
                }

                if (!this.modelsData[data[i].model].serialNumbers[data[i].serialNumber]) {
                    this.modelsData[data[i].model].serialNumbers[data[i].serialNumber] = [];
                }

                let device = this.modelsData[data[i].model].serialNumbers[data[i].serialNumber];
                processData.call(this, data[i], device);
                device.sort((a, b) => {
                    return a.time - b.time;
                });
            }
        }
    }



    function processData(data, device) {
        let time = data.date;
        let period = data.period;
        let fields = data.fields;
        let fieldsSimple = clone(fields);
        let dataArr = data.data;
        let model = data.model;
        let serNum = data.serialNumber;

        for (let i = 0; i < fields.length; i++) {
            fields[i] = model + '-' + fields[i];
        }


        for (let i = 0; i < dataArr.length; i++) {
            let dataOb = {};
            time += period;
            dataOb.time = new Date(time);
//            debugger;
            for (let j = 0; j < dataArr[i].length; j++) {
                dataOb[serNum + '-' + fieldsSimple[j]] = dataArr[i][j];
            }
            device.push(dataOb);
        }
    }

    /*Takes the setting selections into account and builds the chart data from it*/
    function initSelectedData() {

        /*
         * data array is what will go to the chart.
         */
        let data = [];
        this.dataStartTime = 0;
        for (let field in this.selectedFields) {

            for (let model in this.selectedModels) {
                for (let dev in this.modelsData[model].serialNumbers) {
                    if (this.modelsData[model].serialNumbers[dev][0].time > this.dataStartTime) {
                        this.dataStartTime = this.modelsData[model].serialNumbers[dev][0].time;
                    }
                }
            }

            let model = this.selectedFields[field].model;
            let serNum = this.selectedFields[field].serNum;

            if (model) {
                let devData = this.modelsData[model].serialNumbers[serNum];

                if (data.length === 0) {
                    for (let d in devData) {
                        if (devData[d].time >= this.dataStartTime) {
                            let dataOb = {};

                            dataOb.time = devData[d].time;
//                            debugger;
                            let df = field;
                            if (!dataOb[df]) {
                                dataOb[df] = devData[d][df];
                            }

                            data.push(dataOb);
                        }
                    }

                } else {
                    for (let d in devData) {
                        if (devData[d].time >= this.dataStartTime) {
                            let dataOb = data[d];

                            if (dataOb) {
                                let df = field;
                                if (!dataOb[df]) {
//                                    if (field === "MP-1623061258731-CPUTemp") {
//                                        devData[d][field] = 5000;
//                                    }
                                    dataOb[df] = devData[d][df];
                                }
                            }
                        }
                    }
                }
            }
        }


        this.chartData = data;
    }

    $(document).ready(function () {
        root.dataRecController = new DataRecController();
    });
})(window);
