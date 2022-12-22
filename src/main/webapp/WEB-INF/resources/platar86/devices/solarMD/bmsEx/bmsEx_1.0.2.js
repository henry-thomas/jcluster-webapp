/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, hh, mu, wsm */


var bmsex = {
    paramLabel: {},
    devData: {},
    warnErrDialogSerial: false,
    colorPickerInit: false,
    capacityAhParamInit: false,
    dataContent: {},
    dataComp: {
        clustData: {},
        fw: {},
        ifaceStat: {}
    },
    panels: {},
    fwData: {},
    flags: {}
};

bmsex.initHtmlBasicDataPanel = function () {
    let panelContainer = hh.createActDataPanelCard("Actual Values");
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Battery State', value: "N/A", valueClass: ["bmsex-mainState"], unit: ""}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Pack Voltage', value: "N/A", valueClass: ["bmsex-voltageV"], unit: "V"}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Current', value: "N/A", valueClass: ["bmsex-currentA"], unit: "A"}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Power', value: "N/A", valueClass: ["bmsex-powerW"], unit: "kW"}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Capacity', value: "N/A", valueClass: ["bmsex-capacityPer"], unit: "%"}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: '', value: "N/A", valueClass: ["bmsex-capacityAh"], unit: "Ah"}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Energy', value: "N/A", valueClass: ["bmsex-energy"], unit: "kWh"}));

//    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Complete Charge', value: "N/A", valueClass: ["bmsex-remTime"], unit: ""}));
    bmsex.dataComp.remainingTimeSign = hh.adf(panelContainer, "Remaining Charge Time", {
        tooltip: 'This time is calculated based on average current for 1 min.',
        formatter: function (val) {
            try {
                if (Number(dm.selected.fwVer) >= 173) {
//                debugger;
                    this.setTitle(val >= 0 ? 'Remaining Charge Time' : 'Remaining Discharge Time');
                    return mainUtils.getTimeFromSecconds(Math.abs(val));
                }
            } catch (e) {
            }
            return 'NA';
        }});

    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Total Cycles', value: "N/A", valueClass: ["bmsex-totCycle"], unit: ""}));

    document.getElementById("bmsEx-actData-cellTb").appendChild(panelContainer);

    new SMDUIDockingCard(panelContainer);

    panelContainer = hh.createActDataPanelCard("Charging Limits");
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Charge Control Status', value: "N/A", valueClass: ["bmsex-chargeControlDer"], unit: ""}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Charge Control', value: "N/A", valueClass: ["bmsex-chargeControl"], unit: "%"}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Charge Current Limit', value: "N/A", valueClass: ["bmsex-chargeControlCur"], unit: "A"}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Charge Capacity Derating', value: "N/A", valueClass: ["bmsex-chargeControlCDer"], unit: ""}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Charge Voltage Derating', value: "N/A", valueClass: ["bmsex-chargeControlVDer"], unit: ""}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Charge Temp Derating', value: "N/A", valueClass: ["bmsex-chargeControlTDer"], unit: ""}));


    panelContainer.appendChild(hh.createActDataPanelHeaderElement("Discharging Limits"));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Discharge Control Status', value: "N/A", valueClass: ["bmsex-dischargeControlDer"], unit: ""}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Discharge Control', value: "N/A", valueClass: ["bmsex-dischargeControl"], unit: "%"}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Discharge Current', value: "N/A", valueClass: ["bmsex-dischargeControlCur"], unit: "A"}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Discharge Capacity Derating', value: "N/A", valueClass: ["bmsex-dischargeControlCDer"], unit: ""}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Discharge Voltage Derating', value: "N/A", valueClass: ["bmsex-dischargeControlVDer"], unit: ""}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Discharge Temp Derating', value: "N/A", valueClass: ["bmsex-dischargeControlTDer"], unit: ""}));



    document.getElementById("bmsEx-actData-cellTb").appendChild(panelContainer);

};

bmsex.initHtmlAdvancedDataPanel = function () {
    let panelContainer = hh.createActDataPanelCard("Cell Info");
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Min cell voltage value:', value: "N/A", valueClass: ["bmsex-minCellV"]}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Max cell voltage value:', value: "N/A", valueClass: ["bmsex-maxCellV"]}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Cell voltage difference:', value: "N/A", valueClass: ["bmsex-cellVoltageDiff"], unit: "mV"}));


    panelContainer.appendChild(hh.createActDataPanelHeaderElement("Protection Unit"));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Main Relay Status', value: "N/A", valueClass: ["bmsex-protRelMainState"], unit: " "}));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Main Relay Current', value: "N/A", valueClass: ["bmsex-protRelMainCurrent"], unit: "mA"}));

    panelContainer.appendChild(hh.createActDataPanelHeaderElement("Balancing Information"));
    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Balancing Status', value: "N/A", valueClass: ["bmsex-balancingStatus"], unit: " "}));
    document.getElementById("bmsEx-actData-cellTb").appendChild(panelContainer);


};

bmsex.initHtmlTempPanel = function () {
    try {
        let panelContainer = hh.createActDataPanelCard("Temperatures");
        panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Temp MCU:', value: "N/A", valueClass: ["bmsex-ptA5"], unit: "℃"}));
        panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Temp Shunt 1:', value: "N/A", valueClass: ["bmsex-ptA4"], unit: "℃"}));
        panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Temp Cell Input 1:', value: "N/A", valueClass: ["bmsex-ptA6"], unit: "℃"}));
        panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Temp Cell Input 2:', value: "N/A", valueClass: ["bmsex-ptA7"], unit: "℃"}));
        panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Temp Cell Input 3:', value: "N/A", valueClass: ["bmsex-ptA8"], unit: "℃"}));
        panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Temp Balancing Group 1~4:', value: "N/A", valueClass: ["bmsex-ptA3"], unit: "℃"}));
        panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Temp Balancing Group 5~8:', value: "N/A", valueClass: ["bmsex-ptA2"], unit: "℃"}));
        panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Temp Balancing Group 9~12:', value: "N/A", valueClass: ["bmsex-ptA1"], unit: "℃"}));
        panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Temp Balancing Group 13~16:', value: "N/A", valueClass: ["bmsex-ptA0"], unit: "℃"}));
        document.getElementById("bmsEx-actData-cellTb").appendChild(panelContainer);

        panelContainer = hh.createActDataPanelCard("BMS Coms");
        panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'SMD CAN ID:', value: "N/A", valueClass: ["bmsexP-canId"]}));

        hh.adf(panelContainer, ' ', {title: ' ', value: "Interface Stat", valueOnClick: function () {
                bmsex.refreshIfaceStatus();
            }});

        document.getElementById("bmsEx-actData-cellTb").appendChild(panelContainer);
    } catch (e) {

    }

};
bmsex.initHtmlECountersPanel = function () {
    let eDataFormat = {decimal: 1, formatter: bmsex.formatterCounter};
    try {
//        debugger;
        let wrapper = document.getElementById("bmsEx-actData-cellTb");
        let cont = bmsex.panels.countersPanel = hh.createActDataPanelCard("Counters", null, wrapper);

        bmsex.paramLabel.totalChargeCounter_mAh = hh.adf(cont, 'Total Charge', 'Ah', eDataFormat);
        bmsex.paramLabel.totalChargeOVTCounter_mAh = hh.adf(cont, 'Total Charge OVT', 'Ah', eDataFormat);
        bmsex.paramLabel.totalChargeOcCounter_mAh = hh.adf(cont, 'Total Charge OC', 'Ah', eDataFormat);
        bmsex.paramLabel.totalDischargeCounter_mAh = hh.adf(cont, 'Total Discharge ', 'Ah', eDataFormat);
        bmsex.paramLabel.totalDischargeOVTCounter_mAh = hh.adf(cont, 'Total Discharge OVT', 'Ah', eDataFormat);
        bmsex.paramLabel.totalDischargeOcCounter_mAh = hh.adf(cont, 'Total Discharge OC', 'Ah', eDataFormat);
    } catch (e) {
    }
};

bmsex.formatterCounter = function (val) {
    return val / 1000;
};
bmsex.initInfoPanel = function () {
    let container = hh.createActDataPanelCard("BATTERY INFORMATION");
//    container.appendChild(hh.addItemToActDataPanelCard({title: 'Temp Cell Input 1:', value: "N/A", valueClass: ["bmsex-ptA6"], unit: "℃"}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'Battery Serial Number', valueClass: ["bmsexP-serialNumber"]}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'Battery Manufacturer', valueClass: ["bmsexP-batManuf"]}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'Battery Model', valueClass: ["bmsexP-batteryModel"]}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'Battery Rated Capacity', valueClass: ["bmsexP-ratedCapacityAh"]}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'Battery Rated Voltage', valueClass: ["bmsexP-ratedVoltageV"], unit: "V"}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'Battery Charging Temp', valueClass: ["bmsexP-ratedChTemp"], unit: "℃"}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'Battery Discharging Temp', valueClass: ["bmsexP-ratedDischTemp"], unit: "℃"}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'Battery Rated Charge Current', valueClass: ["bmsexP-ratedChargeCurrent"]}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'Battery Rated Discharge Current', valueClass: ["bmsexP-ratedDischargeCurrent"]}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'Battery Manufacturing Date', valueClass: ["bmsexP-batteryManufDate"]}));


    document.getElementById("bmsEx-infoContainer").appendChild(container);

    container = hh.createActDataPanelCard("CELL INFORMATION");
    container.appendChild(hh.addItemToActDataPanelCard({title: 'Cell Chemistry', valueClass: ["bmsexP-cellChemistry"]}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'Cell Manufacturer', valueClass: ["bmsexP-cellManufacturer"]}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'Cell Model', valueClass: ["bmsexP-cellModel"]}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'Cell in Series', valueClass: ["bmsexP-cellCount"]}));


    document.getElementById("bmsEx-infoContainer").appendChild(container);

    container = hh.createActDataPanelCard("BMS INFORMATION");
    container.appendChild(hh.addItemToActDataPanelCard({title: 'BMS Series', value: "EX", type: "static"}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'BMS Manufacturer', value: "Solar MD (Pty) Ltd.", type: "static", link: "javascript:window.open('https://www.solarmd.com/');"}));



    container.appendChild(hh.addItemToActDataPanelCard({title: 'BMS Manual', value: "Download", type: "static", link: "javascript:window.open('https://www.solarmd.com/');"}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'BMS Serial Number', valueClass: ["bmsexP-bmsSerialNumber"]}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'BMS Hardware Revision', valueClass: ["bmsexP-hwVer"]}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'BMS Firmware Revision', valueClass: ["bmsexP-fwVer"]}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'Bootloader Revision', valueClass: ["bmsexP-blFwVer"]}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'BMS Manufacturing Date:', valueClass: ["bmsexP-bmsManufDate"]}));
    document.getElementById("bmsEx-infoContainer").appendChild(container);

    container = hh.createActDataPanelCard("CLUSTER INFORMATION");
    container.appendChild(hh.addItemToActDataPanelCard({title: 'Cluster ID', valueClass: ["bmsexP-clusterId"]}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'Energy Storage Name', valueClass: ["bmsexP-storageName"]}));
    container.appendChild(hh.addItemToActDataPanelCard({title: 'Energy Storage Control Name', valueClass: ["bmsexP-busName"]}));
    document.getElementById("bmsEx-infoContainer").appendChild(container);
};

bmsex.initHtmlCellDataTablePanel = function () {
    console.log("init container Data");
    let cellInfoContainer = hh.createActDataPanelCard("Cell Info Detail");
    cellInfoContainer.style.maxHeight = '600px';
    let tableContent = {header: [
            'Cell',
            {label: 'Voltage', columClass: "v"},
            {label: 'ΔV', columClass: "dv"},
            {label: 'Balancing </br>', columClass: "bal"}
        ]
        , item: []};

    for (var i = 0; i < 16; i++) {
        tableContent.item.push(
                [
                    i + 1,
                    "N/A",
                    "N/A",
                    "N/A"
                ]);
    }
    cellInfoContainer.appendChild(hh.createItemTableToActDataPanelCard(tableContent, "bmsEx-cellIndoDetTb"));
    document.getElementById("bmsEx-actData-cellTb").appendChild(cellInfoContainer);
};

bmsex.initHtmlFwUpdateDataPanel = function () {
    try {


        let panelContainer = hh.createActDataPanelCard("Firmware Update Values");
//    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Uploading Progress:', value: "N/A", valueClass: ["bmsex-updateProgress"], unit: "%"}));
        panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Uploading FW version:', value: "N/A", valueClass: ["bmsexP-fwUpdImageVer"], unit: ""}));
//    panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Uploading Checksum:', value: "N/A", valueClass: ["bmsexP-fwUpdImageChecksum"], unit: ""}));
        panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Uploading Size:', value: "N/A", valueClass: ["bmsexP-fwUpdImageSize"], unit: "kb"}));
        panelContainer.appendChild(hh.addItemToActDataPanelCard({title: 'Ready for Install:', value: "N/A", valueClass: ["bmsexP-fwUpdImageLoaded"], unit: ""}));
        document.getElementById("bmsEx-fwUpdateStatus").appendChild(panelContainer);
    } catch (e) {
    }
    try {
        let paramDiv = document.getElementById("bmsEx-settingInstallerControlParamDiv");
        hh.pPanelAddDescTitle(paramDiv, "Cluster Settings");
        new ParamSetting(paramDiv, {
            type: 'dropDownButton',
            title: 'Reset Cluster Known Devices:',
            ctrlInfo: 'This function clears all know batteries discovered in the cluster.',
            content: [
                {name: 'Reset', cb: function () {
                        wsm.sendDevMsgExecWithJsonInst({
                            instrExt: 'resetClusterLnownNodes', showMessage: true
                        });
                    }}
            ]
        });

        hh.pPanelAddDescTitle(paramDiv, 'Controlled Device Settings.');
        new ParamSetting(paramDiv, 'clustParam.ctrlDev_devType', {type: 'dropDown', title: 'Controlled Device:', ctrlInfo: 'Select controlled Device.',
            dropDownConf: {options: [{label: 'None', value: 0},
                    {label: 'SMA', value: (0x80 | 1)},
                    {label: 'Victron', value: (0x80 | 2)},
                    {label: 'Sunsynk', value: (0x80 | 3)},
                    {label: 'Goodwe', value: (0x80 | 4)},
                    {label: 'SAJ', value: (0x80 | 5)},
                    {label: 'Growatt', value: (0x80 | 6)}
                ]}});

        hh.pPanelAddDescTitle(paramDiv, 'Cluster Custom Coms Advanced settings CANBUS/RS485.');
        new ParamSetting(paramDiv, 'clustParam.ctrlDev_canbusSpeed', {type: 'dropDown', title: 'CANBUS Baudrate:', ctrlInfo: '.', unit: 'kbps',
            dropDownConf: {options: [{label: '1250kbps', value: 8}, {label: '250kbps', value: 4}, {label: '500kbps', value: 2}, {label: '1000kbps', value: 1}]}
        });
        new ParamSetting(paramDiv, 'clustParam.ctrlDev_modbusSlaveAdd', {type: 'inputNumber', title: 'Modbus Slave Address:', ctrlInfo: '.'});
        new ParamSetting(paramDiv, 'clustParam.ctrlDev_modbusBaudRate', {type: 'dropDown', title: 'Modbus Baudrate:', ctrlInfo: '.', unit: 'kbps',
            dropDownConf: {options: [
                    {label: '1200', value: 1200}, {label: '2400', value: 2400}, {label: '4800', value: 4800}, {label: '9600', value: 9600}, {label: '19200', value: 19200},
                    {label: '38400', value: 38400}, {label: '57600', value: 57600}, {label: '115200', value: 115200}, {label: '128000', value: 128000}]}
        });
        new ParamSetting(paramDiv, 'clustParam.ctrlDev_modbusParity', {type: 'dropDown', title: 'Modbus Parity:', ctrlInfo: '.',
            dropDownConf: {options: [{label: 'Even', value: 0}, {label: 'Odd', value: 1}, {label: 'None', value: 2}, {label: 'Space', value: 3}, {label: 'Mark', value: 4}]}
        });
        new ParamSetting(paramDiv, 'clustParam.ctrlDev_modbusStopBits', {type: 'dropDown', title: 'Modbus Stop Bits:', ctrlInfo: '.',
            dropDownConf: {options: [{label: '1 Stop Bit', value: 0}, {label: '2 Stop Bits', value: 1}]}
        });

    } catch (e) {
    }
};

bmsex.initHtmlClusterData = function () {
    try {


        let cont = document.querySelector('.actClustDataContainer');
        let panel = hh.createActDataPanelCard("Cluster State", null, cont);
        let clustData = bmsex.dataComp.clustData;

        clustData.masterRole = hh.adf(panel, 'Role in cluster:', {datamap: {'0': 'Uknown', '1': 'Slave', '2': 'Master'}});
        clustData.batCount = hh.adf(panel, 'Total Batteries in Cluster:', (v) => {
            return v + 1;
        });
        clustData.activeBat = hh.adf(panel, 'DC Connected Batteries:');
        clustData.onlineBat = hh.adf(panel, 'Online Batteries:');
        clustData.offlineBat = hh.adf(panel, 'Offline Batteries:');


        //Live Data
        panel = hh.createActDataPanelCard("Live Data", null, cont);
        clustData.capacity_per = hh.adf(panel, 'Average Capacity:', '%');
        clustData.current_A = hh.adf(panel, 'Total Current:', 'A', {
            formatter(value) {
                return isNaN(value) ? value : value / 10;
            }
        });
        clustData.voltage_mV = hh.adf(panel, 'Average Voltage:', 'V', {decimals: 2,
            formatter(value) {
                return isNaN(value) ? value : value / 100;
            }
        });

        clustData.chCtrlC = hh.adf(panel, 'Charge Control Current:');
        clustData.dischCtrlC = hh.adf(panel, 'Discharge Control Current:');

        clustData.chCtrlV = hh.adf(panel, 'Charge Control Voltage:');
        clustData.dischCtrlV = hh.adf(panel, 'Discharge Control Voltage:');


//    clustData.targetChCur_A = hh.adf(panel, 'Taget Current:', 'A');
//    clustData.targetDischCur_A = hh.adf(panel, 'Taget Current:', 'A');
//    clustData.targetChVolt_mV = hh.adf(panel, 'Taget Voltage:', 'V');
//    clustData.targetDischVolt_mV = hh.adf(panel, 'Taget Voltage:', 'V');


        //Advanced Data
        panel = hh.createActDataPanelCard("Advannced Data", null, cont);
        clustData.minCellValue = hh.adf(panel, 'Min Cell Voltage', 'mV');

        clustData.maxCellValue = hh.adf(panel, 'Max Cell Voltage', 'mV');

        hh.adf(panel, ' ', {value: 'Refresh Cluster Idx', valueOnClick: function () {
                wsm.sendDevMsgExecWithJsonInst({'instrExt': 'refreshClustUnitSerial', showMessage: true});
            }});

    } catch (e) {

    }

};

bmsex.initHtmlCapAlignSettings = function () {
    let cont = document.getElementById('capAlignSettingPanel');
    new ParamSetting(cont, 'emonParam.absCurrBotAlign_mA', {type: 'inputNumber', title: 'absCurrBotAlign_mA', ctrlInfo: '.'});
    new ParamSetting(cont, 'emonParam.absCurrTopAlign_mA', {type: 'inputNumber', title: 'absCurrTopAlign_mA', ctrlInfo: '.'});
    new ParamSetting(cont, 'emonParam.capacityAlignVoltageEnable', {type: 'inputNumber', title: 'capacityAlignVoltageEnable', ctrlInfo: '.'});
    new ParamSetting(cont, 'emonParam.maxCapPerTop', {type: 'inputNumber', title: 'maxCapPerTop', ctrlInfo: '.'});
    new ParamSetting(cont, 'emonParam.minCapPerBottom', {type: 'inputNumber', title: 'minCapPerBottom', ctrlInfo: '.'});
    new ParamSetting(cont, 'emonParam.packUsableCapacity_mA_h', {type: 'inputNumber', title: 'packUsableCapacity_mA_h', ctrlInfo: '.'});
    new ParamSetting(cont, 'emonParam.startupCapAlignEnable', {type: 'inputNumber', title: 'startupCapAlignEnable', ctrlInfo: '.'});
    new ParamSetting(cont, 'emonParam.startupCapAlignMinRestPeriod_sec', {type: 'inputNumber', title: 'startupCapAlignMinRestPeriod_sec', ctrlInfo: '.'});
    new ParamSetting(cont, 'emonParam.voltBotAlign_mV', {type: 'inputNumber', title: 'voltBotAlign_mV', ctrlInfo: '.'});
    new ParamSetting(cont, 'emonParam.voltTopAlign_mV', {type: 'inputNumber', title: 'voltTopAlign_mV', ctrlInfo: '.'});
    new ParamSetting(cont, 'emonParam.capAlignPer', {type: 'inputNumber', title: 'capAlignPer', ctrlInfo: '.'});

};


bmsex.initHtmlClusterSettings = function () {
    try {
        let cont = document.getElementById('clustSettingPanel');

        hh.pPanelAddDescTitle(cont, 'Cluster Settings.');
        new ParamSetting(cont, 'clustParam.enabled', {type: 'dropDown', title: 'Cluster Enabled:', ctrlInfo: 'Enable or Disable Cluster functionality. Remote Device if selected will be controlled even when cluster is disabled.',
            dropDownConf: {options: [{label: 'Disable', value: 0}, {label: 'Enable', value: 1}]}});

        hh.pPanelAddDescTitle(cont, 'Controlled Device Settings.');
//      

        new ParamSetting(cont, 'clustParam.clusterMinChargeCurrent', {type: 'inputNumber', title: 'clusterMinChargeCurrent', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.clusterMinDischargeCurrent', {type: 'inputNumber', title: 'clusterMinDischargeCurrent', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.ctrlDev_updateDelay', {type: 'inputNumber', title: 'ctrlDev_updateDelay', ctrlInfo: '.'});

//
        hh.pPanelAddDescTitle(cont, 'Cluster Current Control Advanced settings.');



        new ParamSetting(cont, 'clustParam.chCtrlCIncDelay', {type: 'inputNumber', title: 'chCtrlCIncDelay', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.chCtrlCIncStep', {type: 'inputNumber', title: 'chCtrlCIncStep', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.chCtrlCDecDelay', {type: 'inputNumber', title: 'chCtrlCDecDelay', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.chCtrlCDecStep', {type: 'inputNumber', title: 'chCtrlCDecStep', ctrlInfo: '.'});

        new ParamSetting(cont, 'clustParam.dischCtrlCIncDelay', {type: 'inputNumber', title: 'dischCtrlCIncDelay', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.dischCtrlCIncStep', {type: 'inputNumber', title: 'dischCtrlCIncStep', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.dischCtrlCDecDelay', {type: 'inputNumber', title: 'dischCtrlCDecDelay', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.dischCtrlCDecStep', {type: 'inputNumber', title: 'dischCtrlCDecStep', ctrlInfo: '.'});

        new ParamSetting(cont, 'clustParam.calcCCh_topPoint', {type: 'inputNumber', title: 'calcCCh_topPoint', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcCCh_topValue', {type: 'inputNumber', title: 'calcCCh_topValue', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcCCh_p1CtrlPoint', {type: 'inputNumber', title: 'calcCCh_p1CtrlPoint', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcCCh_p1CtrlValue', {type: 'inputNumber', title: 'calcCCh_p1CtrlValue', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcCCh_bottomPoint', {type: 'inputNumber', title: 'calcCCh_bottomPoint', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcCCh_bottomValue', {type: 'inputNumber', title: 'calcCCh_bottomValue', ctrlInfo: '.'});

        new ParamSetting(cont, 'clustParam.calcCDisch_topPoint', {type: 'inputNumber', title: 'calcCDisch_topPoint', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcCDisch_topValue', {type: 'inputNumber', title: 'calcCDisch_topValue', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcCDisch_p1CtrlPoint', {type: 'inputNumber', title: 'calcCDisch_p1CtrlPoint', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcCDisch_p1CtrlValue', {type: 'inputNumber', title: 'calcCDisch_p1CtrlValue', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcCDisch_bottomPoint', {type: 'inputNumber', title: 'calcCDisch_bottomPoint', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcCDisch_bottomValue', {type: 'inputNumber', title: 'calcCDisch_bottomValue', ctrlInfo: '.'});

        hh.pPanelAddDescTitle(cont, 'Cluster Voltage Control Advanced settings.');

        new ParamSetting(cont, 'clustParam.chCtrlVIncDelay', {type: 'inputNumber', title: 'chCtrlVIncDelay', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.chCtrlVIncStep', {type: 'inputNumber', title: 'chCtrlVIncStep', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.chCtrlVDecDelay', {type: 'inputNumber', title: 'chCtrlVDecDelay', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.chCtrlVDecStep', {type: 'inputNumber', title: 'chCtrlVDecStep', ctrlInfo: '.'});



        new ParamSetting(cont, 'clustParam.dischCtrlVIncDelay', {type: 'inputNumber', title: 'dischCtrlVIncDelay', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.dischCtrlVIncStep', {type: 'inputNumber', title: 'dischCtrlVIncStep', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.dischCtrlVDecDelay', {type: 'inputNumber', title: 'dischCtrlVDecDelay', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.dischCtrlVDecStep', {type: 'inputNumber', title: 'dischCtrlVDecStep', ctrlInfo: '.'});

        new ParamSetting(cont, 'clustParam.chCtrlVValueUsage', {type: 'dropDown', title: 'chCtrlVValueUsage', ctrlInfo: '.',
            dropDownConf: {options: [
                    {label: 'F F F', value: 0},
                    {label: 'F F O', value: 0b001},
                    {label: 'F O F', value: 0b010},
                    {label: 'F O O', value: 0b011},
                    {label: 'O F F', value: 0b100},
                    {label: 'O F O', value: 0b101},
                    {label: 'O O F', value: 0b110},
                    {label: 'O O O', value: 0b111}
                ]}});

        new ParamSetting(cont, 'clustParam.calcVCh_topPoint', {type: 'inputNumber', title: 'calcVCh_topPoint', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcVCh_topValue', {type: 'inputNumber', title: 'calcVCh_topValue', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcVCh_topOffset', {type: 'inputNumber', title: 'calcVCh_topOffset', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcVCh_p1CtrlPoint', {type: 'inputNumber', title: 'calcVCh_p1CtrlPoint', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcVCh_p1CtrlValue', {type: 'inputNumber', title: 'calcVCh_p1CtrlValue', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcVCh_p1CtrlOffset', {type: 'inputNumber', title: 'calcVCh_p1CtrlOffset', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcVCh_bottomPoint', {type: 'inputNumber', title: 'calcVCh_bottomPoint', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcVCh_bottomValue', {type: 'inputNumber', title: 'calcVCh_bottomValue', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcVCh_bottomOffset', {type: 'inputNumber', title: 'calcVCh_bottomOffset', ctrlInfo: '.'});

        new ParamSetting(cont, 'clustParam.dischCtrlVValueUsage', {type: 'dropDown', title: 'dischCtrlVValueUsage', ctrlInfo: '.sd',
            dropDownConf: {options: [
                    {label: 'F F F', value: 0},
                    {label: 'F F O', value: 0b001},
                    {label: 'F O F', value: 0b010},
                    {label: 'F O O', value: 0b011},
                    {label: 'O F F', value: 0b100},
                    {label: 'O F O', value: 0b101},
                    {label: 'O O F', value: 0b110},
                    {label: 'O O O', value: 0b111}
                ]}});
        new ParamSetting(cont, 'clustParam.calcVDisch_topPoint', {type: 'inputNumber', title: 'calcVDisch_topPoint', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcVDisch_topValue', {type: 'inputNumber', title: 'calcVDisch_topValue', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcVDisch_topOffset', {type: 'inputNumber', title: 'calcVDisch_topOffset', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcVDisch_p1CtrlPoint', {type: 'inputNumber', title: 'calcVDisch_p1CtrlPoint', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcVDisch_p1CtrlValue', {type: 'inputNumber', title: 'calcVDisch_p1CtrlValue', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcVDisch_p1CtrlOffset', {type: 'inputNumber', title: 'calcVDisch_p1CtrlOffset', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcVDisch_bottomPoint', {type: 'inputNumber', title: 'calcVDisch_bottomPoint', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcVDisch_bottomValue', {type: 'inputNumber', title: 'calcVDisch_bottomValue', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcVDisch_bottomOffset', {type: 'inputNumber', title: 'calcVDisch_bottomOffset', ctrlInfo: '.'});

        hh.pPanelAddDescTitle(cont, 'Cluster SoC Limit Control Advanced settings.');
        new ParamSetting(cont, 'clustParam.calcSoCMinCap', {type: 'inputNumber', title: 'calcSoCMinCap', ctrlInfo: '.'});

        new ParamSetting(cont, 'clustParam.calcSoCValDischCtrlPoint', {type: 'inputNumber', title: 'calcSoCValDischCtrlPoint', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.calcSoCValDischCtrlValueBelow', {type: 'inputNumber', title: 'calcSoCValDischCtrlValueBelow', ctrlInfo: '.'});

        hh.pPanelAddDescTitle(cont, 'Cluster Custom Coms Advanced settings.');
        new ParamSetting(cont, 'clustParam.ctrlDev_modbusSlaveAdd', {type: 'inputNumber', title: 'modbusSlaveAddress', ctrlInfo: '.'});
        new ParamSetting(cont, 'clustParam.ctrlDev_modbusBaudRate', {type: 'dropDown', title: 'Modbus Baudrate:', ctrlInfo: '.', unit: 'kbps',
            dropDownConf: {options: [
                    {label: '1200', value: 1200}, {label: '2400', value: 2400}, {label: '4800', value: 4800}, {label: '9600', value: 9600}, {label: '19200', value: 19200},
                    {label: '38400', value: 38400}, {label: '57600', value: 57600}, {label: '115200', value: 115200}, {label: '128000', value: 128000}]}
        });
        new ParamSetting(cont, 'clustParam.ctrlDev_modbusParity', {type: 'dropDown', title: 'Modbus Parity:', ctrlInfo: '.',
            dropDownConf: {options: [{label: 'Even', value: 0}, {label: 'Odd', value: 1}, {label: 'None', value: 2}, {label: 'Space', value: 3}, {label: 'Mark', value: 4}]}
        });
        new ParamSetting(cont, 'clustParam.ctrlDev_modbusStopBits', {type: 'dropDown', title: 'Modbus Stop Bits:', ctrlInfo: '.',
            dropDownConf: {options: [{label: '1 Stop Bit', value: 0}, {label: '2 Stop Bits', value: 1}]}
        });
        new ParamSetting(cont, 'clustParam.ctrlDev_canbusSpeed', {type: 'dropDown', title: 'CANBUS Baudrate:', ctrlInfo: '.', unit: 'kbps',
            dropDownConf: {options: [{label: '250kbps', value: 4}, {label: '250kbps', value: 4}, {label: '500kbps', value: 2}, {label: '1000kbps', value: 1}]}
        });
    } catch (e) {

    }
};

bmsex.init = function () {
    bmsex.initInfoPanel();
    bmsex.initHtmlBasicDataPanel();
    bmsex.initHtmlAdvancedDataPanel();

    bmsex.initHtmlCellDataTablePanel();

    bmsex.initHtmlTempPanel();
    bmsex.initHtmlECountersPanel();

    bmsex.initHtmlFwUpdateDataPanel();
    bmsex.initHtmlClusterData();
    bmsex.initHtmlCapAlignSettings();
    bmsex.initHtmlClusterSettings();
    bmsex.initFwDialog();
};

bmsex.firmwareDataStartUpload = function () {
    let firmware = mainUtils.getWidgetValue('firmwareDataStartUploadFwWg');

    devManager.executeInstr('callFwUpdUpload', firmware, null,
            function (a, param) {
                mainUtils.showInfoMessage("Success");
            });
};

bmsex.firmwareDataReload = function () {
    devManager.executeInstr('reloadUpdateInfo', null, null,
            function (a, param) {
                mainUtils.setHtmlText('bmsexP-fwUpdImageVer', param.fwUpdImageVer);
                mainUtils.setHtmlText('bmsexP-fwUpdImageChecksum', param.fwUpdImageChecksum);
                mainUtils.setHtmlText('bmsexP-fwUpdImageSize', (param.fwUpdImageSize / 1000).toFixed(3));
                mainUtils.setHtmlText('bmsexP-fwUpdImageLoaded', param.fwUpdImageVer !== 0 ? "TRUE" : "FALSE");
            });
};

bmsex.firmwareVersionRead = function () {
    devManager.executeInstr('reloadUpdate', null, null,
            function (a, updates) {
                hh.removeAllChilds(document.getElementById("bmsEx-fwUpdateAvailableUpdates"));
                let updateInfoTable = hh.createActDataPanelCard("Available Firmware");

                hh.adf(updateInfoTable, " ", {value: 'Check For Update Online', valueOnClick: function () {
                        wsm.sendDevMsgExecWithJsonInst(
                                {
                                    instrExt: 'checkForUpdate',
                                    showMessage: true
                                });
                    }});

                updateInfoTable.style.maxHeight = '600px';
                let tableContent = {header: [
                        {label: 'Firmware', columClass: "dv"},
                        {label: 'Hardware', columClass: ""}
                    ]
                    , item: []};
                for (var fwNumb in updates) {

                    tableContent.item.push(
                            [
                                fwNumb,
                                updates[fwNumb].hwVer
                            ]);
                }
                updateInfoTable.appendChild(hh.createItemTableToActDataPanelCard(tableContent));
                document.getElementById("bmsEx-fwUpdateAvailableUpdates").appendChild(updateInfoTable);

                console.log(a);
            });
};

bmsex.initBmsUpdateRestart = function () {
    devManager.sendDevMessage(
            {
                instrExt: 'executeUpdateRestart',
                instrData: '1',
                instrDataExt: '1'
            },
            function (message, data) { //success
                mainUtils.showInfoMessage()(data, "Restart  success: " + data);
            },
            function (message, error) { //Error
                mainUtils.showErrorMessage(error, "Can not mark BMSEM prod Complete. Reason: " + error);
            },
            function () { //Timeout
                mainUtils.showErrorMessage("Can not mark BMSEM prod Complete. Reason: TIMEOUT");
            });
};

bmsex.initBmsUpdate = function () {
    devManager.sendDevMessage(
            {
                instrExt: 'updateBegin',
                instrData: '4098',
                instrDataExt: '0'
            },
            function (message, data) { //success
                mainUtils.showInfoMessage(data, "Update init success: " + data);
            },
            function (message, error) { //Error
                mainUtils.showErrorMessage(error, "Can not mark BMSEM prod Complete. Reason: " + error);
            },
            function () { //Timeout
                mainUtils.showErrorMessage("Can not mark BMSEM prod Complete. Reason: TIMEOUT");
            });
};

bmsex.updateData = function (dev, data) {
//        chargeControlDer
    let chDchReg = data.chDischCtrlReg;
    if (chDchReg !== undefined) {
        let ch = chDchReg & 0xFF;
        mainUtils.setHtmlText('bmsex-chargeControlDer', bmsex.map_chDchRegDeratingCauseToString(ch & 0x03));
        mainUtils.setHtmlText('bmsex-chargeControlVDer', (ch & (1 << 4)) ? 'On' : 'Off');
        mainUtils.setHtmlText('bmsex-chargeControlCDer', (ch & (1 << 5)) ? 'On' : 'Off');
        mainUtils.setHtmlText('bmsex-chargeControlTDer', (ch & (1 << 6)) ? 'On' : 'Off');

        ch = (chDchReg >> 8) & 0xFF;
        mainUtils.setHtmlText('bmsex-dischargeControlDer', bmsex.map_chDchRegDeratingCauseToString(ch & 0x03));
        mainUtils.setHtmlText('bmsex-dischargeControlVDer', (ch & (1 << 4)) ? 'On' : 'Off');
        mainUtils.setHtmlText('bmsex-dischargeControlCDer', (ch & (1 << 5)) ? 'On' : 'Off');
        mainUtils.setHtmlText('bmsex-dischargeControlTDer', (ch & (1 << 6)) ? 'On' : 'Off');

    }


    mainUtils.setHtmlText('bmsex-chargeControl', data.chargeControl);
    mainUtils.setHtmlText('bmsex-dischargeControl', data.dischargeControl);
    try {
        mainUtils.setHtmlText('bmsex-chargeControlCur', ((data.chargeControl * (dev.param.ratedCapacityAh * dev.param.ratedChargeCurrentC)) / 100).toFixed(1));
        mainUtils.setHtmlText('bmsex-dischargeControlCur', ((data.dischargeControl * (dev.param.ratedCapacityAh * dev.param.ratedDischargeCurrentC)) / 100).toFixed(1));
    } catch (e) {

    }

//    mainUtils.setHtmlText('bmsex-updateProgress', data.updateProgress);

    let cellCount = dev.param.cellCount || data.cellVoltageVArr.length;
    //main data
    mainUtils.setHtmlText('bmsex-mainState', bmsex.protState(data.protRelMainState));
    mainUtils.setHtmlText('bmsex-voltageV', data.voltageV, 3);
    mainUtils.setHtmlText('bmsex-currentA', data.currentA, 3);
    mainUtils.setHtmlText('bmsex-powerW', (data.currentA * data.voltageV) / 1000, 3);

    mainUtils.setHtmlText('bmsex-capacityAh', data.capacityAh, 2);

    if (dev.param.ratedCapacityAh !== undefined) {
        let capPer = (data.capacityAh / dev.param.ratedCapacityAh) * 100;

        mainUtils.setHtmlText('bmsex-capacityPer', capPer, 2);

        mainUtils.setHtmlText('bmsex-energy', ((data.capacityAh * data.ratedVoltageV) / 1000).toFixed(2) + " / " + ((data.ratedCapacityAh * data.ratedVoltageV) / 1000).toFixed(1));
//        debugger;
    }


    let minCelVal = 65000;
    let minCelNum = 0;
    let maxCelVal = 0;
    let maxCelNum = 0;

    for (var i = 0; i < cellCount; i++) {
        let val = data.cellVoltageVArr[i];
        if (val < minCelVal) {
            minCelVal = val;
            minCelNum = i;
        }
        if (val > maxCelVal) {
            maxCelVal = val;
            maxCelNum = i;
        }
    }
    for (var i = 0; i < cellCount; i++) {
        mainUtils.setHtmlText('bmsEx-cellIndoDetTb-v-' + (i), data.cellVoltageVArr[i].toFixed(3) + " V");
        mainUtils.setHtmlText('bmsEx-cellIndoDetTb-dv-' + (i), "+" + (((data.cellVoltageVArr[i] - minCelVal) * 1000)).toFixed(0) + " mV");
        let bal = (data.balancingReg & (1 << i)) !== 0;
        let balE = (data.balancingExtReg & (1 << i)) !== 0;

        mainUtils.setHtmlText('bmsEx-cellIndoDetTb-bal-' + (i), (bal ? 'ON' : 'OFF'));
    }

    mainUtils.setHtmlText('bmsex-minCellV', (minCelVal).toFixed(3) + 'V @ cell' + (minCelNum + 1));
    mainUtils.setHtmlText('bmsex-maxCellV', (maxCelVal).toFixed(3) + 'V @ cell' + (maxCelNum + 1));
    mainUtils.setHtmlText('bmsex-cellVoltageDiff', "Δ " + ((maxCelVal - minCelVal) * 1000).toFixed(0));

    //update Temperature
    for (var i = 0; i < data.perTempArr.length; i++) {
        mainUtils.setHtmlText('bmsex-ptA' + i, (data.perTempArr[i]), 2);
    }


    mainUtils.setHtmlText('bmsex-protRelMainState', bmsex.protRelayToString(data.protRelMainState));
    mainUtils.setHtmlText('bmsex-protRelMainCurrent', data.protRelMainCurrent);

    mainUtils.setHtmlText('bmsex-balancingStatus', bmsex.map_cmMonBalStatusToString(data.balancingStatus));

    if (dev.paramLoaded === true) {
        if (dev.capacityAhInit === undefined) {
            dev.capacityAhInit = true;
            mainUtils.setWidgetValue("capacityAh", data.capacityAh);
            devManager.onParamChange('capacityAh');
        }
    }

    bmsex.dataComp.remainingTimeSign.value = data.remainingTimeSign;
};

bmsex.sendDevInstruction = function () {

    var message = {
        instr: wsm.connectionVar.executeInstr,
        instrExt: "",
        instrData: " ",
        devSerialNumber: devManager.getSelected().serialNumber,
        devModelId: wsm.connectionVar.devModel
    };
    message.instrExt = "getProdData";
    message.instrDataJson = {
        "endDate": new Date().getTime(),
        "beginDate": new Date().getTime() - (1000 * 60 * 60 * 24),
        "maxRecords": 48
    };

    //devManager
    console.log("send settings");
    wsm.sendDevMsg(message,
            function (devMessage) { //on success
                var charData = JSON.parse(devMessage.response.data);
                console.log("Success: ", charData);
            },
            function (devMessage) { //on Error
                mainUtils.showWarningMessage(devMessage.response.faultMsg, "Instruction execution error!");
                console.log("Error: " + devMessage.response.faultMsg);
            },
            function () { //on timeout
                mainUtils.showWarningMessage("Can not refresh Parameters!", 'timeout');
                console.log('Timeout');
            }
    );
};

bmsex.updateParam = function (dev, param) {
    mainUtils.setHtmlText('bmsexP-fwUpdImageVer', param.fwUpdImageVer);
    mainUtils.setHtmlText('bmsexP-fwUpdImageChecksum', param.fwUpdImageChecksum);
    mainUtils.setHtmlText('bmsexP-fwUpdImageSize', (param.fwUpdImageSize / 1000).toFixed(3));
    mainUtils.setHtmlText('bmsexP-fwUpdImageLoaded', param.fwUpdImageVer !== 0 ? "TRUE" : "FALSE");


    mainUtils.setHtmlText('bmsexP-canId', param.canId);
    mainUtils.setHtmlText('bmsexP-serialNumber', param.serialNumber);
    mainUtils.setHtmlText('bmsexP-busName', param.busName);
    mainUtils.setHtmlText('bmsexP-storageName', param.storageName);

    mainUtils.setHtmlText('bmsexP-batManuf', param.batteryManufacturer);
    mainUtils.setHtmlText('bmsexP-batteryModel', param.batteryModel);
    mainUtils.setHtmlText('bmsexP-clusterId', param.clusterId);
    mainUtils.setHtmlText('bmsexP-cellManufacturer', param.cellManufacturer);
    mainUtils.setHtmlText('bmsexP-cellModel', param.cellModel);
    mainUtils.setHtmlText('bmsexP-cellCount', param.cellCount);
    mainUtils.setHtmlText('bmsexP-cellChemistry', bmsex.map_CellChemistryToString(param.cellChemistry));

    mainUtils.setHtmlText('bmsexP-ratedVoltageV', param.ratedVoltageV);

    mainUtils.setHtmlText('bmsexP-ratedCapacityAh', param.ratedCapacityAh + "Ah / " + (param.ratedCapacityAh * param.ratedVoltageV) + "Wh");

    mainUtils.setHtmlText('bmsexP-ratedDischTemp', param.protTcDischargeTempBegin + "~" + param.protTcDischargeTempEnd);
    mainUtils.setHtmlText('bmsexP-ratedChTemp', param.protTcChargeTempBegin + "~" + param.protTcChargeTempEnd);

    mainUtils.setHtmlText('bmsexP-ratedChargeCurrent', param.ratedChargeCurrentC.toFixed(2) + "C / " + (param.ratedCapacityAh * param.ratedChargeCurrentC).toFixed(1) + "A");
    mainUtils.setHtmlText('bmsexP-ratedDischargeCurrent', param.ratedDischargeCurrentC.toFixed(2) + "C / " + (param.ratedCapacityAh * param.ratedDischargeCurrentC).toFixed(1) + "A");

//    mainUtils.setHtmlText('bmsexP-clusterId', param.protTcChargeTempBegin + "~" + param.protTcChargeTempEnd);


    mainUtils.setHtmlText('bmsexP-blFwVer', param.blFwVer);
    mainUtils.setHtmlText('bmsexP-fwVer', param.fwVer);
    mainUtils.setHtmlText('bmsexP-hwVer', dev.hwVer);

    mainUtils.setHtmlText('bmsexP-bmsManufDate', moment(param.bmsManufDate * 1000).format('YYYY/MM/DD hh:mm'));
    mainUtils.setHtmlText('bmsexP-batteryManufDate', moment(param.batteryManufDate * 1000).format('YYYY/MM/DD hh:mm'));
    mainUtils.setHtmlText('bmsexP-bmsSerialNumber', param.bmsSerialNumber);

    //total cycles
    //
    if (param.totalChargeCounter_mAh !== null && param.totalDischargeCounter_mAh !== null) {
        let totCycle = ((param.totalChargeCounter_mAh + param.totalDischargeCounter_mAh) / 1000) / param.ratedCapacityAh / 2;
        mainUtils.setHtmlText('bmsex-totCycle', totCycle.toFixed(2));
    }
    if (Number(dev.fwVer) >= 163) {
        bmsex.panels.countersPanel.style.display = 'block';
        try {
            hh.updateAdfFromObject(bmsex.paramLabel, param);
        } catch (e) {
        }
    } else {
        bmsex.panels.countersPanel.style.display = 'none';
    }
//bmsex-totCycle
//    console.log(param.batteryManufacturer);

    dev.paramLoaded = true;
};

bmsex.onColorPickerChange = function (value, intVal, widget) {
    devManager.onParamChange(widget);
};

bmsex.displayClustTab = function (state) {
    try {
        PF('mainTabView').navContainer[0].children[2].style.display = state ? 'block' : 'none';
    } catch (e) {
    }
};

bmsex.getClusterUnitIdxName = function (unitIdx) {
    let module = dm.selected.serialNumber;
    if (unitIdx < 32) {
        try {
            if (dm.selected.param.clustParam.rNodeList[unitIdx] !== '0') {
                module = 'SMDBEX' + dm.selected.param.clustParam.rNodeList[unitIdx];
            } else {
                module = 'Unknown Node Idx: ' + unitIdx;
            }
        } catch (e) {
            module = 'Unknown Node Idx: ' + unitIdx;
        }
    }
    return  module;
};

dm.onSelectedCustomDataReceived(
        function (dev, data) {
//            console.log(dev, data);
            hh.updateAdfFromObject(bmsex.dataComp.clustData, data);

            try {
                let dComp = bmsex.dataComp.clustData;

                dComp.minCellValue.tooltipTitle.text = 'Cell: ' + (data.minCellIdx) + ' @ ' + bmsex.getClusterUnitIdxName(data.minCellUnitIdx);
                dComp.maxCellValue.tooltipTitle.text = 'Cell: ' + (data.maxCellIdx) + ' @ ' + bmsex.getClusterUnitIdxName(data.maxCellUnitIdx);


                dComp.chCtrlC.value = data.chCtrlCur + '% / ' + (data.targetChCur_A / 10).toFixed(1) + 'A';
                dComp.dischCtrlC.value = data.dischCtrlCur + '% / ' + (data.targetDischCur_A / 10).toFixed(2) + 'A';

                dComp.chCtrlV.value = data.chCtrlVolt + '% / ' + (data.targetChVolt_mV / 100).toFixed(2) + 'V';
                dComp.dischCtrlV.value = data.dischCtrlVolt + '% / ' + (data.targetDischVolt_mV / 100).toFixed(1) + 'V';


            } catch (e) {
            }
        },
        'BmsExClustData');

devManager.onSelectedDataReceived(bmsex.updateData);

devManager.onSelectedParamInit(bmsex.updateParam);

devManager.onSelectedChange(function (sDev) {
    try {
        bmsex.displayClustTab(sDev.connected && Number(sDev.fwVer) >= 170);
    } catch (e) {

    }
    bmsex.panels.countersPanel.style.display = 'none';
    if (sDev.connected && sDev.auxData['BmsExClustData']) {
        hh.updateAdfFromObject(bmsex.dataComp.clustData, sDev.auxData['BmsExClustData']);
    } else {
        for (var item in bmsex.dataComp.clustData) {
            bmsex.dataComp.clustData[item].value = '-';
        }
    }

    if (sDev.getParam()) {
        bmsex.updateParam(sDev, sDev.getParam());
    }
    if (sDev.connected) {
        bmsex.updateData(sDev, sDev.getData());
//        bmsex.updateParam(sDev, sDev.getParam());
    } else {
        mainUtils.setHtmlText('dataValues');
    }
});

devManager.onSelectedStatusChange(function (dev, state) {
    bmsex.panels.countersPanel.style.display = 'none';
    if (state && dev.getData() !== undefined) {
        bmsex.updateData(dev, dev.getData());
        bmsex.updateParam(dev, dev.getParam());
    } else {
        mainUtils.setHtmlText('dataValues');
        bmsex.displayClustTab(false);
    }
});

devManager.onParamReceived(function (dev, param) {
    param.subModelID = dev.subModelID;
    try {
        if (Number(dev.fwVer) >= 170) {
            dm.setBcReqDataClass('BmsExClustData');
            if (dev.selected) {
                bmsex.displayClustTab(true);
            }
        }
    } catch (e) {
//        console.log(e);
    }
});


$(document).ready(function () {
    bmsex.init();
});

bmsex.getProtStateText = function (state) {
    if (state === undefined) {
        return "N/A";
    }
    switch (state) {
        case 0:
            return "Normal";
        case 1:
            return "Sleep High";
        case 2:
            return "Sleep Low";
        case 3:
            return "Awake Low";
        case 4:
            return "Override On";
        case 5:
            return "Override Off";
        case 6:
            return "Emergency Off";
        case 7:
            return "Init";
        case 8:
            return "Awake High";
    }

    return "Unknown: " + state;
};

bmsex.loadConfigSet = function (name) {

};

bmsex.subModelName = function (id) {
    if (id === undefined) {
        return "UNKNOWN NULL";
    }
    switch (id) {
        case 20205:
        case 407401 & 0xFFFF:
        {
            return 'SS4074-02';
        }
        case 403701:
        case 403701 & 0xFFFF:
        {
            return 'SS4037-02';
        }
    }
    return "UNKNOWN " + id;
};



bmsex.protState = function (protRelayCode) {
    if (protRelayCode >= 1 && protRelayCode <= 0x0F) {
        return "ON";
    }
    return "OFF";
};
bmsex.protRelayToString = function (code) {
    switch (code) {
        case 0:
            return "RELAY OPENED";
        case 1:
            return "RELAY CLOSED";
        case 0x03:
            return "RELAY CLOSED - ENERGY SAVING MODE";
        case 0x07:
            return "RELAY CLOSED - ENERGY SAVING LIMITED";
        case 0x17:
            return "RELAY CLOSED - ENERGY SAVING UNAVAILABLE";
        case 0x10:
            return "RELAY OPENED - FUSE BURNED";
        case 0x20:
            return "RELAY OPENED - COIL NOT CONNECTED";
        case 0x40:
            return "RELAY OPENED - COIL SHORT/VOLTAGE TOO LOW";
        case 0x50:
            return "RELAY OPENED OVERRIDE OFF ACTIVE";
        case 0x60:
            return "RELAY OFF - MANUAL CONTROL";
        case 0x70:
            return "RELAY OFF - ERROR PENDING";
        case 0x80:
            return "RELAY OPENED ";

        default:
            return "UNKNOWN STATE - " + code;
    }
};

bmsex.map_cmMonBalStatusToString = function (code) {
    switch (code) {
        case 0:
            return "DISABLED";
        case 1:
            return "CURRENT LIMIT";
        case 2:
            return "CUTOFF VOLTAGE LIMIT";
        case 3:
            return "TEMPERATURE LIMIT";
        case 4:
            return "ACTIVE";
        case 5:
            return "VB ACTIVE";
        case 6:
            return "VB COMPLETE";
        case 7:
            return "VB OUT_OF_RANGE";
        case 10:
            return "MB TIME ACTIVE";
        case 11:
            return "MB CAP ACTIVE";
        case 12:
            return "MB COMPLETE";
        default:
            return "UNKNOWN BALANCING STATE - " + code;
    }
};
bmsex.map_CellChemistryToString = function (code) {
    switch (code) {
        case 0:
            return "LFP-Lithium Iron Phosphate(LiFePO4)";
        case 1:
            return "LCO-Lithium Cobalt Oxide(LiCoO2)";
        case 2:
            return "LMO-Lithium Manganese Oxide(LiMn2O4)";
        case 3:
            return "NMC-Lithium Nickel Manganese Cobalt Oxide(LiNiMnCoO2)";
        case 4:
            return "NCA-Lithium Nickel Cobalt Aluminum Oxide(LiNiCoAlO2)";
        case 5:
            return "LTO-Lithium Titanate(Li2TiO3)";

        default:
            return "UNKNOWN CELL CHEMISTRY CODE: " + code;
    }
};
bmsex.map_chDchRegDeratingCauseToString = function (code) {
    switch (code) {
        case 0:
            return "No Limit";
        case 1:
            return "Voltage Limit";
        case 2:
            return "Capacity Limit";
        case 3:
            return "Temperature Limit";
        default:
            return "UNKNOWN CH DSCH DERATING CODE: " + code;
    }
};

bmsex.onBmsExUpdateProgressData = function (dev, prog, id) {
    bmsex.dataContent.firmwareUpdatePrg.value = prog.pState;
    bmsex.dataContent.firmwareUpdatePrgState.html = prog.prop.text;
};

dm.onProgressDialogCreate('firnwareUpdate', function (dev, pId, dialog) {
    dialog.setBarTitle(dev.serialNumber + "Firmware Update.");
    hh.addHeaderTitleToPC(dialog.contentDiv, "Firmware Update", null);

    bmsex.dataContent.firmwareUpdatePrg = hh.adf(dialog.contentDiv, 'Progress', '%');
    bmsex.dataContent.firmwareUpdatePrgState = hh.adf(dialog.contentDiv, ' ');
});

dm.onProgressData('firnwareUpdate', bmsex.onBmsExUpdateProgressData);


bmsex.onBmsExFwUpdateProgressData = function (dev, prog, id) {
//    bmsex.dataContent.firmwareUpdatePrg.value = prog.pState;
//    bmsex.dataContent.firmwareUpdatePrgState.html = prog.prop.text;
    this.dataComp.text.value = prog.prop.text;
    this.dataComp.byteCounter.value = (prog.prop.bytes / 1000).toFixed(1) + 'kB /' + (prog.prop.imageLen / 1000).toFixed(1) + 'kB';
    this.dataComp.progress.value = prog.prop.progress;
};

dm.onProgressDialogCreate('bmsExFwUpdate', function (dev, pId, dialog) {
    dialog.setBarTitle(dev.serialNumber + " Firmware Update.");
//    hh.addHeaderTitleToPC(dialog.contentDiv, "Firmware Update", null);
    dialog.dataComp = {};
    dialog.dataComp.text = hh.adf(dialog.contentDiv, ' ');
    dialog.dataComp.progress = hh.adf(dialog.contentDiv, 'Progress', '%');
    dialog.dataComp.byteCounter = hh.adf(dialog.contentDiv, 'Sent Bytes');
});

dm.onProgressData('bmsExFwUpdate', bmsex.onBmsExFwUpdateProgressData);

bmsex.initFwDialog = function () {
    try {
        bmsex.dataComp.fw.dialog = new SMDUIDialog({
            modal: true,
            heading: 'Firmware Info',
            draggable: true
        });
        hh.addCssToDom('width: auto; height: 550px; overflow: auto;', bmsex.dataComp.fw.dialog.contentDiv);
        bmsex.dataComp.fw.cont = hh.div(bmsex.dataComp.fw.dialog.contentDiv, 'devParamPanelWrapper', 'width: 450px;');
    } catch (e) {

    }
//    bmsex.firmwareRefresh();
};

bmsex.createFirmwareUploadButton = function (ver) {
    new ParamSetting(bmsex.dataComp.fw.cont, {detached: true, type: 'dropDownButton',
        title: 'Copy Firmware ' + ver,
        ctrlInfo: 'Firmware version ' + bmsex.fwData.fwUpdImageVer + ' for BMS-EX is available for transfer to the BMS.</br>'
                + 'During transfer you will see progress bar. The battery will continue to operate normally durring this proccess.',
        content: [{
                name: 'Copy to BMS ',
                cb: function () {
                    devManager.executeInstr('callFwUpdUpload', ver, null,
                            function (a, param) {
                                mainUtils.showInfoMessage("Firmware Install Begin.");
                                bmsex.dataComp.fw.dialog.hide();
                            });
                }
            }]
    });
};

bmsex.firmwareInstallRefresh = function () {
//    bmsex.flags.enableOldFwVersions = 1;
//    debugger;
    hh.removeAllChilds(bmsex.dataComp.fw.cont);

    if (bmsex.fwData.fwUpdImageVer !== 0 && (Number(dm.selected.fwVer) < bmsex.fwData.fwUpdImageVer || bmsex.flags.enableOldFwVersions)) {

        new ParamSetting(bmsex.dataComp.fw.cont, {detached: true, type: 'dropDownButton',
            title: 'Install Firmware ' + bmsex.fwData.fwUpdImageVer,
            ctrlInfo: 'Firmware with version ' + bmsex.fwData.fwUpdImageVer + ' is ready for installation. Warning During installation '
                    + 'battery will switch off for min of 1min.',
            content: [{
                    name: 'Install ' + bmsex.fwData.fwUpdImageVer,
                    cb: function () {
                        devManager.executeInstr('callFwUpdExecute');
                        bmsex.dataComp.fw.dialog.hide();
                    }
                }]
        });
    }

    let nextHigherVersion = bmsex.fwData.fwUpdImageVer;

//    debugger;
    for (let verStr in bmsex.fwData.availableUpdates) {
        let ver = Number(verStr);
        if (bmsex.flags.enableOldFwVersions) {
            bmsex.createFirmwareUploadButton(ver);
        } else if (bmsex.fwData.fwUpdImageVer < ver && Number(dm.selected.fwVer) < ver) {
            nextHigherVersion = ver;
        }
    }
    if (!bmsex.flags.enableOldFwVersions && nextHigherVersion !== bmsex.fwData.fwUpdImageVer) {
        bmsex.createFirmwareUploadButton(nextHigherVersion);
    }

    new ParamSetting(bmsex.dataComp.fw.cont, {detached: true, type: 'dropDownButton',
        title: 'Check for Online Update',
        ctrlInfo: 'This function allows the LoggerV2 to check for new firmware available online.'
                + ' When this proccess starts, you will see progres dialog.',
        content: [{
                name: 'Check now ',
                cb: function () {
                    wsm.sendDevMsgExecWithJsonInst({
                        instrExt: 'checkForUpdate',
                        showMessage: true
                    });
                    bmsex.dataComp.fw.dialog.hide();
                }
            }]
    });

    bmsex.dataComp.fw.dialog.show();
};

bmsex.firmwareRefresh = function () {
    devManager.executeInstr('getFwInfo', null, null,
            function (a, param) {
                bmsex.fwData = param;
                bmsex.firmwareInstallRefresh();
            });

};

bmsex.refreshIfaceStatus = function () {
    if (!bmsex.dataComp.ifaceStat.dialog) {

        bmsex.dataComp.ifaceStat.dialog = new SMDUIDialog({
            modal: false,
            heading: 'Interface Info',
            draggable: true
        });
        hh.addCssToDom('width: auto; height: 480px; overflow: auto;', bmsex.dataComp.ifaceStat.dialog.contentDiv);
        let wrapper = bmsex.dataComp.ifaceStat.dialog.contentDiv;
        let cont = bmsex.dataComp.ifaceStat.cont = hh.div(wrapper, 'actDataPanelCard', 'width: 250px;');

        hh.addHeaderTitleToPC(cont, 'CANBUS 1');
        let ob = bmsex.dataComp.ifaceStat.can1 = {};
        ob.ifaceStatus = hh.adf(cont, 'Line State', {datamap: {
                '0': 'Disconnected',
                '2': 'Connected'
            }});
        ob.canStatus = hh.adf(cont, 'COM State', {datamap: {
                '0': 'Waiting',
                '1': 'Initialization',
                '2': 'Connected SMD BUS'
            }});


        ob.linkChage = hh.adf(cont, 'Link Change');
        ob.rxFrames = hh.adf(cont, 'RX Frames', 'Frm');
        ob.txFrames = hh.adf(cont, 'TX Frames', 'Frm');
        ob.errFrames = hh.adf(cont, 'Error Frames', 'Frm');

        hh.addHeaderTitleToPC(cont, 'CANBUS 2');
        ob = bmsex.dataComp.ifaceStat.can0 = {};
        ob.ifaceStatus = hh.adf(cont, 'Line State', {datamap: {
                '0': 'Disconnected',
                '2': 'Connected'
            }});

        ob.canStatus = hh.adf(cont, 'COM Role', {datamap: {
                '0': 'Unknown',
                '1': 'Slave',
                '2': 'Master'
            }});

        ob.linkChage = hh.adf(cont, 'Link Change');
        ob.rxFrames = hh.adf(cont, 'RX Frames', 'Frm');
//        ob.rxFrames = hh.adf(cont, 'RX Frames', '?Frm', {tooltip: 'This Counter represent only filtered values. </br> Based on selected remote device counter shows only messages specified in remote device.'});
        ob.txFrames = hh.adf(cont, 'TX Frames', 'Frm');
        ob.errFrames = hh.adf(cont, 'Error Frames', 'Frm');

        hh.button(wrapper, 'Refresh').onclick = function () {
            bmsex.refreshIfaceStatus();
        };
        hh.button(wrapper, 'Reset').onclick = function () {
            wsm.sendDevMsgExecWithJsonInst({
                instrExt: 'clearAllIfaceStatus',
                showMessage: true
            }, function (msg, resp) {
                hh.updateAdfFromObject(bmsex.dataComp.ifaceStat, resp, true);
            }, function (msg, err) {
                mu.showErrorMessage(err);
            });
        };
    }
    wsm.sendDevMsgExecWithJsonInst({
        instrExt: 'readIfaceStatus'
    }, function (msg, resp) {
        hh.updateAdfFromObject(bmsex.dataComp.ifaceStat, resp, true);
        bmsex.dataComp.ifaceStat.dialog.show();
    }, function (msg, err) {
        mu.showErrorMessage(err);
    });
};
