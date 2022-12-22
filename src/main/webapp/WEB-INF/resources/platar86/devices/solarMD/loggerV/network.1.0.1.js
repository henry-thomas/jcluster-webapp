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


/* global devManager, hh, mainUtils, PF, ipUtils, moment, mu */

var ln = {
    initValues: {},
    panel: {},
    initNetworkTabs: false
};

devManager.onSelectedDataReceived(function (dev, data) {
//    console.log(data);
    if (data.interfaceStatusMap) {
        for (var iFaceName in data.interfaceStatusMap) {
            let status = data.interfaceStatusMap[iFaceName];

            if (iFaceName === 'br0') {
                let containerDhcpLeassesArr = document.querySelectorAll('.uiln_br0_wifiAPContainer');
                for (var j = 0; j < containerDhcpLeassesArr.length; j++) {
                    let containerDhcpLeasses = containerDhcpLeassesArr[j];
                    if (containerDhcpLeasses) {
                        hh.removeAllChilds(containerDhcpLeasses);
                        containerDhcpLeasses.appendChild(hh.createActDataPanelHeaderElement("TCP/IP DHCP Leasses"));

                        let tableContent = {header: ['Time', 'MAC', 'IP', 'Name'], item: []};
                        for (var i = 0; i < status.dhcpServLeasses.length; i++) {
                            let line = status.dhcpServLeasses[i].trim();
                            let fieldArr = line.split(' ');
                            if (fieldArr.length >= 5) {
                                tableContent.item.push(
                                        [
                                            moment.unix(Number(fieldArr[0])).format('MMM-DD hh:mm'),
                                            fieldArr[1],
                                            fieldArr[2],
                                            fieldArr[3]

                                        ]);
                            }
                        }
                        containerDhcpLeasses.appendChild(hh.createItemTableToActDataPanelCard(tableContent));
                    }
                }
            }

            mainUtils.setHtmlText("uiln_" + iFaceName + "_addressType", status.addressType);
            mainUtils.setHtmlText("uiln_" + iFaceName + "_internetAvailable", status.internetAvailable);
            mainUtils.setHtmlText("uiln_" + iFaceName + "_state", status.active ? 'Connected' : 'Disconnected');
            if (status.addressType === 'dhcp') {

                if (Array.isArray(status.dhcpLeaseInfo)) {
                    let container = document.querySelector('.uiln_' + iFaceName + '_dhcpClientContainer');
                    if (container) {
                        hh.removeAllChilds(container);
                        container.appendChild(hh.createActDataPanelHeaderElement("TCP/IP DHCP INFO"));
                        for (var i = 0; i < status.dhcpLeaseInfo.length; i++) {
                            let line = status.dhcpLeaseInfo[i].trim();
                            line = line.substr(0, line.indexOf(';'));
                            if (line.indexOf('option') === 0) {
                                line = line.substr(7);
                            }
                            let key = line.substr(0, line.indexOf(' '));
                            let val = line.substr(line.indexOf(' ') + 1);
                            container.appendChild(hh.addItemToActDataPanelCard({
                                title: key,
                                value: val
                            }));
//                            console.log(line);
                        }
                    }

                }
            } else if (status.addressType === 'static') {
                mainUtils.setHtmlText("uiln_" + iFaceName + "_ipAddr", status.ipAddr);
                mainUtils.setHtmlText("uiln_" + iFaceName + "_ipDns", status.ipDns);
                mainUtils.setHtmlText("uiln_" + iFaceName + "_ipGw", status.ipGw);
                mainUtils.setHtmlText("uiln_" + iFaceName + "_ipMask", status.ipMask);
            }

        }
    }
    if (data.wiFiClientStatus) {
        for (var iFaceName in data.wiFiClientStatus) {
            let wifiStatus = data.wiFiClientStatus[iFaceName];

            if (wifiStatus.status === "DISCONNECTED -> SCANNING" && wifiStatus.disconnectReason && wifiStatus.disconnectReason.indexOf('ssid') > -1) {
                let arr = wifiStatus.disconnectReason.split(' ');
                let statusMsg = "";
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].indexOf('ssid') === 0) {
                        let ssid = arr[i].substring(arr[i].indexOf('=') + 2, arr[i].length - 1);
                        statusMsg = 'DISCONNECTED ' + ssid + ' ';
                    } else if (arr[i].indexOf('reason=') === 0) {
                        let reason = arr[i].substring(arr[i].indexOf('=') + 1);
                        statusMsg += reason;
                    }
                }
                mainUtils.setHtmlText("uiln_" + iFaceName + "_wifi-status", statusMsg);
            } else {
                mainUtils.setHtmlText("uiln_" + iFaceName + "_wifi-status", wifiStatus.status);
                mainUtils.setHtmlText("uiln_" + iFaceName + "_wifi-bitRate", wifiStatus.bitRate);
            }
            let ssid = wifiStatus.ssid;
            if (ssid && ssid.length >= 6) {
                mainUtils.setHtmlText("uiln_" + iFaceName + "_wifi-ssid", wifiStatus.ssid.substr(6));
            } else {
                mainUtils.setHtmlText("uiln_" + iFaceName + "_wifi-ssid", "");
            }
            mainUtils.setHtmlText("uiln_" + iFaceName + "_wifi-chanel", wifiStatus.chanel);
            mainUtils.setHtmlText("uiln_" + iFaceName + "_wifi-signalLevel", wifiStatus.signalLevel);
        }
    }
    if (data.availableSignals) {
        for (var iFaceName in data.availableSignals) {
            let container = document.querySelector(".uiln_" + iFaceName + "_wifiAvailNetTableContainer");
            if (container) {
                ln.createWiFiAvailableNetworkTable(container, iFaceName, data.availableSignals[iFaceName]);
            }
        }
    }
//    "AVAILABLE SIGNALS", "uiln_" + iFaceName + "_wifiAvailNetTable"
});

devManager.onParamReceived(function (dev, param) {
    if (ln.initNetworkTabs === false) {
        ln.initNetworkTabs = true;
        if (param.networkIfaceMap) {
            ln.createAndNetworkTabs(param.networkIfaceMap);
        }
    }
//    console.log(param);
});

ln.createAndNetworkTabs = function (ifaceMap) {
    const rootPanel = document.getElementById('networkMainPannel');
    hh.removeAllChilds(rootPanel);

    for (var iFaceName in ifaceMap) {
        if (iFaceName === "lo"
                || iFaceName.indexOf("br") === 0
                || iFaceName.indexOf("can") === 0) {
            continue;
        }
//        const adapter = ifaceMap[iFaceName];

        const titleNode = document.createElement('h3');
        titleNode.textContent = iFaceName;
        rootPanel.appendChild(titleNode);

        const divNode = document.createElement('div');
        divNode.classList.add('uixSmd_ifWrapper');
        divNode.classList.add('uiln_' + iFaceName + '_containerWrapper');
        rootPanel.appendChild(divNode);

        ln.createAdapterConteiner(iFaceName);
    }
    $('#networkMainPannel').puiaccordion();
};

ln.createAdapterConteiner = function (iFaceName) {
    let adapter = devManager.getSelected().getParam().networkIfaceMap[iFaceName];
    let container = document.querySelector('.uiln_' + iFaceName + '_containerWrapper');

    hh.removeAllChilds(container);

    ln.panel['mainPanel_' + iFaceName] = container;
    const headerPanel = document.createElement('div');
    headerPanel.classList.add('uixln_header');
    headerPanel.classList.add('actDataContainer');
    container.appendChild(headerPanel);

    let dataCard = hh.createActDataPanelCard();
    let type = 'Ethernet';
    if (adapter.udevPropMap.DEVTYPE && adapter.udevPropMap.DEVTYPE === "wlan") {
        dataCard.appendChild(hh.createActDataPanelHeaderElement(
                iFaceName.toUpperCase() + ' INFO',
                mu.getContextPath() + '/defaultImages/icon/wifiIcon.svg'));
        headerPanel.appendChild(dataCard);
        type = "Wireless";
    } else {
        dataCard.appendChild(hh.createActDataPanelHeaderElement(
                iFaceName.toUpperCase() + ' INFO',
                mu.getContextPath() + '/defaultImages/icon/ethernetIcon.svg'));
        headerPanel.appendChild(dataCard);
    }


    dataCard.appendChild(hh.addItemToActDataPanelCard({
        title: "Type:",
        value: type,
        valueClass: ["uiln_" + iFaceName + "_type"],
        unit: ""
    }));

    dataCard.appendChild(hh.addItemToActDataPanelCard({
        title: "Function:",
        value: adapter.ifaceFunction,
        valueClass: ["uiln_" + iFaceName + "_function"],
        valueOnClick: ln.onNetworkAdapterFunctionClick.bind("uiln_" + iFaceName + "_function", adapter, iFaceName),
        unit: ""
    }));

    dataCard.appendChild(hh.addItemToActDataPanelCard({
        title: "Status:",
        value: "-",
        valueClass: ["uiln_" + iFaceName + "_state"],
        unit: ""
    }));

    if (adapter.ifaceFunction === 'internet') {
        dataCard.appendChild(hh.addItemToActDataPanelCard({
            title: "TCP/IP ADDRESS:",
            value: "-",
            valueClass: ["uiln_" + iFaceName + "_addressType"],
            valueOnClick: ln.onNetworkAdapterAddressTypeClick.bind("uiln_" + iFaceName + "_function", adapter, iFaceName),
            unit: ""
        }));
        dataCard.appendChild(hh.addItemToActDataPanelCard({
            title: "Internet Status:",
            value: "-",
            valueClass: ["uiln_" + iFaceName + "_internetAvailable"],
            unit: ""
        }));


    } else if (adapter.ifaceFunction === 'local') {

    }

    dataCard.appendChild(hh.addItemToActDataPanelCard({
        title: "MAC:",
        value: adapter.mac
    }));


    let contentPanel = document.createElement('div');
    ln.panel['contentPanel_' + iFaceName] = contentPanel;
    contentPanel.classList.add('uixln_header');
    contentPanel.classList.add('actDataContainer');
    container.appendChild(contentPanel);

    ln.createAdapterContent(iFaceName);

};

ln.createAdapterContent = function (iFaceName) {
    let container = ln.panel['contentPanel_' + iFaceName];
    let adapter = devManager.getSelected().getParam().networkIfaceMap[iFaceName];

    let initVal = ln.initValues['content_' + iFaceName];
    let requiredContentType = adapter.ifaceFunction + '-' + adapter.addressType + '-' + adapter.ifaceType;
//    console.log(requiredContentType);
    if (initVal !== requiredContentType) {
        ln.initValues['content_' + iFaceName] = requiredContentType;
        hh.removeAllChilds(container);
        if (adapter.ifaceFunction === 'disable') {
            return;
        } else if (adapter.ifaceFunction === 'internet') {
            if (adapter.ifaceType === 'wlan') {

                let wifiClientInfoPanel = hh.createActDataPanelCard("WIFI CLIENT INFO");
                container.appendChild(wifiClientInfoPanel);
                wifiClientInfoPanel.appendChild(hh.addItemToActDataPanelCard({
                    title: "State:",
                    value: "",
                    valueClass: ["uiln_" + iFaceName + "_wifi-status"],
                    unit: ""
                }));
                
                wifiClientInfoPanel.appendChild(hh.addItemToActDataPanelCard({
                    title: "SSID:",
                    value: "",
                    valueClass: ["uiln_" + iFaceName + "_wifi-ssid"],
                    unit: ""
                }));
                
                wifiClientInfoPanel.appendChild(hh.addItemToActDataPanelCard({
                    title: "Connection Speed:",
                    value: "",
                    valueClass: ["uiln_" + iFaceName + "_wifi-bitRate"],
                    unit: ""
                }));
                wifiClientInfoPanel.appendChild(hh.createActDataPanelHeaderElement('KNOWN WIFI NETWORK'));

                let wifiSignalKnownNetworkContainer = document.createElement('div');
                wifiSignalKnownNetworkContainer.classList.add("uiln_" + iFaceName + "_wifiKnownNetTableContainer");
                wifiClientInfoPanel.appendChild(wifiSignalKnownNetworkContainer);

                ln.createWiFiKnownNetworkTable(iFaceName);


                let wifiSignal = hh.createActDataPanelCard("AVAILABLE SIGNALS");
                wifiSignal.style.setProperty('min-width', '450px');
                wifiSignal.style.setProperty('max-height', '350px');

                let wifiSignalContainer = document.createElement('div');
                wifiSignalContainer.classList.add("uiln_" + iFaceName + "_wifiAvailNetTableContainer");
                wifiSignal.appendChild(wifiSignalContainer);
                container.appendChild(wifiSignal);
            }

            if (adapter.addressType === 'dhcp') {
                let dhcpInfoPanel = hh.createActDataPanelCard("TCP/IP DHCP INFO");
                dhcpInfoPanel.classList.add('uiln_' + iFaceName + '_dhcpClientContainer');
                container.appendChild(dhcpInfoPanel);


            } else if (adapter.addressType === 'static') {

                let addrInfoPanel = hh.createActDataPanelCard("TCP/IP INFO");
                container.appendChild(addrInfoPanel);
                addrInfoPanel.appendChild(hh.addItemToActDataPanelCard({
                    title: "Type:",
                    value: adapter.addressType,
                    valueClass: ["uiln_" + iFaceName + "_addressType"],
                    valueOnClick: ln.onNetworkStaticAddressClick.bind("uiln_" + iFaceName + "_function", adapter, iFaceName),
                    unit: ""
                }));
                addrInfoPanel.appendChild(hh.addItemToActDataPanelCard({
                    title: "IP Address:",
                    value: adapter.iFaceStatus.ipAddr,
                    valueClass: ["uiln_" + iFaceName + "_ipAddr"],
                    unit: ""
                }));
                addrInfoPanel.appendChild(hh.addItemToActDataPanelCard({
                    title: "Mask:",
                    value: adapter.iFaceStatus.ipMask,
                    valueClass: ["uiln_" + iFaceName + "_ipMask"],
                    unit: ""
                }));
                addrInfoPanel.appendChild(hh.addItemToActDataPanelCard({
                    title: "Gateway:",
                    value: adapter.iFaceStatus.ipGw,
                    valueClass: ["uiln_" + iFaceName + "_ipGw"],
                    unit: ""
                }));
                addrInfoPanel.appendChild(hh.addItemToActDataPanelCard({
                    title: "DNS:",
                    value: adapter.iFaceStatus.ipDns,
                    valueClass: ["uiln_" + iFaceName + "_ipDns"],
                    unit: ""
                }));
            }
        } else if (adapter.ifaceFunction === 'local') {
            if (adapter.ifaceType === 'wlan') {

                let ssid = "";
                let ssidPass = "";
                if (adapter.wifiApConf) {
                    ssid = adapter.wifiApConf.ssid || " ";
                    ssidPass = adapter.wifiApConf.wpaPassPhrase || " ";
                }

                let wifiClientInfoPanel = hh.createActDataPanelCard("WIFI QUICK ACCESS LINK");
                container.appendChild(wifiClientInfoPanel);


                wifiClientInfoPanel.appendChild(hh.addItemToActDataPanelCard({
                    title: "SSID:",
                    value: ssid,
                    unit: ""
                }));
                wifiClientInfoPanel.appendChild(hh.addItemToActDataPanelCard({
                    title: "Password:",
                    value: ssidPass,
                    unit: ""
                }));
                //	WIFI:T:WPA;S:LoggerV-SSID;P:passs;H:false;
                let text = 'WIFI:T:WPA;S:' + ssid + ';P:' + ssidPass + ';H:false;';
                let wifiApQrEl = document.createElement('div');
                wifiApQrEl.id = 'uiln_' + iFaceName + "_QrId";
                wifiApQrEl.style.setProperty('margin', 'auto');
                wifiClientInfoPanel.appendChild(wifiApQrEl);

                var qrcode = new QRCode(wifiApQrEl.id, {
                    text: text,
                    width: 128,
                    height: 128,

                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            }


            let wifiApDhcpClientContainer = hh.createActDataPanelCard();
            wifiApDhcpClientContainer.style.setProperty('min-width', '450px');
            wifiApDhcpClientContainer.style.setProperty('max-height', '350px');
            wifiApDhcpClientContainer.classList.add("uiln_br0_wifiAPContainer");
            container.appendChild(wifiApDhcpClientContainer);
        }
    }
};

ln.onNetworkAddressFunctionChange = function () {
    let val = mainUtils.getWidgetValue('networkAddressTypeSetSelectorWg');
//    console.log(val);
    devManager.sendDevMessage(
            {
                instrExt: 'setAddressType',
                instrData: ln.selecteAdapterAddressType,
                instrDataExt: val
            },
            function (devMessage, unitArr) { //success
                devManager.getSelected().getParam().networkIfaceMap[ln.selecteAdapterAddressType].addressType = mainUtils.getWidgetValue('networkAddressTypeSetSelectorWg');
                ln.createAdapterConteiner(ln.selecteAdapterAddressType);
//                console.log(unitArr);
                document.querySelector(".uiln_" + ln.selecteAdapterAddressType + "_addressType").textContent = unitArr;
            }, function (devMessage, err) { //success
                mainUtils.showWarningMessage(errMsg, "Instruction execution error!");
            }
    );
    PF('networkAddressTypeSetDialogWg').hide();
};

ln.onNetworkAdapterFunctionChange = function () {
    let val = mainUtils.getWidgetValue('networkTypeSetSelectorWg');
//    console.log(val);
    devManager.sendDevMessage(
            {
                instrExt: 'setInterfaceType',
                instrData: ln.selecteAdapterFunnction,
                instrDataExt: val
            },
            function (devMessage, unitArr) { //success
                devManager.getSelected().getParam().networkIfaceMap[ln.selecteAdapterFunnction].ifaceFunction = mainUtils.getWidgetValue('networkTypeSetSelectorWg');
                ln.createAdapterConteiner(ln.selecteAdapterFunnction);
//                console.log(unitArr);
                document.querySelector(".uiln_" + ln.selecteAdapterFunnction + "_function").textContent = unitArr;
            },
            function (devMessage, err) { //success
                mainUtils.showWarningMessage(errMsg, "Instruction execution error!");
            }
    );
    PF('networkTypeSetDialogWg').hide();
};

ln.createWiFiKnownNetworkTable = function (iFaceName) {

    let adapter = devManager.getSelected().getParam().networkIfaceMap[iFaceName];
    let container = document.querySelector(".uiln_" + iFaceName + "_wifiKnownNetTableContainer");


    hh.removeAllChilds(container);

    let tableContent = {header: ['SSID', 'Secured'], item: []};
    if (adapter.wifiKnownNetworks) {
        for (var i = 0; i < adapter.wifiKnownNetworks.length; i++) {
            let network = adapter.wifiKnownNetworks[i];
            tableContent.item.push(
                    [
                        {
                            title: network.name,
                            onclick: ln.onKnownNetworkRemoveClick.bind(container, iFaceName, network.name)
                        }
                        , network.encrypted ? 'Secured' : 'Open'
                    ]);
        }
    }
    container.appendChild(hh.createItemTableToActDataPanelCard(tableContent, "uiln_" + iFaceName + '_knownWifiTable'));
};

ln.createWiFiAvailableNetworkTable = function (container, iFaceName, network) {
//    console.log(network);
    hh.removeAllChilds(container);

    //{ header:[], item:[[],[],[{title:'sdf', onclick: fucntion(){}}]]}
    let tableContent = {header: ['SSID', 'MAC', 'Signal'], item: []};

    let keys = Object.keys(network).sort();
    for (var k = 0; k < keys.length; k++) {
        let ssid = keys[k];
        let ssidFormated = ssid.replace("'", "").replace("'", "");
        let netOb = network[ssid];
        let arr = [
            {
                title: ssidFormated,
                onclick: ln.onKnownNetworkAddClick.bind(container, iFaceName, ssidFormated, netOb.bssid, netOb.prop)
            },
            netOb.bssid
        ];

        for (var i = 0; i < netOb.prop.length; i++) {
            let propItem = netOb.prop[i];
            if (propItem.indexOf('level=') === 0) {
                let nVal = Number(propItem.substr(6));
                if (nVal > -30) {
                    arr.push('Amazing');
                } else if (nVal > -60) {
                    arr.push('Very Good');
                } else if (nVal > -67) {
                    arr.push('Good');
                } else if (nVal > -80) {
                    arr.push('Not Good');
                } else if (nVal > -90) {
                    arr.push('Unusable');
                }
                break;
            }
        }

        tableContent.item.push(arr);
    }
    container.appendChild(hh.createItemTableToActDataPanelCard(tableContent, "uiln_" + iFaceName + '_wifiAvailNetTable'));
};

ln.onNetworkStaticAddressClick = function (adapter, iFaceName) {
    document.querySelector('.addNetworkStatiAddressDialogTitle').textContent =
            'Change Static IP ' + iFaceName;
//    console.log(adapter);
    let status = adapter.iFaceStatus;
    mainUtils.setWidgetValue('addNetworkStaticAddrDialogAddrValueWg', status.ipAddr);
    mainUtils.setWidgetValue('addNetworkStaticAddrDialogMaskValueWg', status.ipMask);
    mainUtils.setWidgetValue('addNetworkStaticAddrDialogGatewayValueWg', status.ipGw);
    mainUtils.setWidgetValue('addNetworkStaticAddrDialogDnsValueWg', status.ipDns);
//    mainUtils.setWidgetValue('networkAddressTypeSetSelectorWg', adapter.addressType);
    ln.selecteStaticAddress = iFaceName;
    PF('addNetworkStaticAddrDialogWg').show();

};
ln.onNetworkAdapterAddressTypeClick = function (adapter, iFaceName) {
    document.querySelector('.networkAddressTypeSetDialogTitle').textContent =
            'Change Adapter ' + iFaceName + ' Address Type';
    mainUtils.setWidgetValue('networkAddressTypeSetSelectorWg', adapter.addressType);
    ln.selecteAdapterAddressType = iFaceName;
    PF('networkAddressTypeSetDialogWg').show();

};
ln.onNetworkAdapterFunctionClick = function (adapter, iFaceName) {
    document.querySelector('.networkTypeSetDialogTitle').textContent =
            'Change Adapter ' + iFaceName + ' Function';
//    mainUtils.setWidgetValue('networkTypeSetSelectorWg', adapter.ifaceFunction);
    ln.selecteAdapterFunnction = iFaceName;
    PF('networkTypeSetDialogWg').show();

};

ln.onKnownNetworkAddClick = function (iFaceName, ssid, bssid, prop) {
    document.querySelector('.addKnownNetworkDialogTitle').textContent =
            'Add Network SSID "' + ssid + ' " To interface ' + iFaceName;

    ln.selecteKnownNetworkToAdd = {
        iFaceName: iFaceName,
        ssid: ssid,
        bssid: bssid,
        prop: prop};
    let passRequired = false;
    if (prop) {
        for (var item in prop) {
            if (prop[item].indexOf("rsn_ie_len") === 0 && Number(prop[item].substr(11)) > 0) {
                passRequired = true;
                break;
            } else if (prop[item].indexOf("wpa_ie_len") === 0 && Number(prop[item].substr(11)) > 0) {
                passRequired = true;
                break;
            }
        }
    }
    if (passRequired) {
        PF('addKnownNetworkDialogSaveBnWg').disable();
    } else {
        PF('addKnownNetworkDialogSaveBnWg').enable();
    }
    document.querySelector('.addKnownNetworkDialogPasswordField').style.setProperty('display', passRequired ? 'block' : 'none');
    ln.selecteKnownNetworkToAdd.passRequired = passRequired;
    PF('addKnownNetworkDialogWg').show();
};
ln.onKnownNetworkRemoveClick = function (iFaceName, networSSID) {
    document.querySelector('.removeKnownNetworkDialogTitle').textContent =
            'Removing Network SSID "' + networSSID + ' " From interface ' + iFaceName + '?';
    ln.selecteKnownNetworkToRemove = {iFaceName: iFaceName, ssid: networSSID};
    PF('removeKnownNetworkDialogWg').show();
};

ln.onKnownNetworkAdd = function () {
    let passVall = "none";
    let obj = ln.selecteKnownNetworkToAdd;
    if (ln.selecteKnownNetworkToAdd.passRequired) {
        passVall = mainUtils.getWidgetValue('addKnownNetworkDialogPasswordWg');
    }
    devManager.sendDevMessage(
            {
                instrExt: 'addKnownNetwork',
                instrIdx: obj.iFaceName,
                instrData: obj.ssid,
                instrDataExt: obj.bssid,
                instrDataIndx: passVall
            },
            function (devMessage, unitArr) { //success
//                console.log(devMessage);
                try {
                    let networksArr = devManager.getSelected().getParam().networkIfaceMap[obj.iFaceName].wifiKnownNetworks;
                    networksArr.push({
                        bssid: obj.bssid,
                        encrypted: ln.selecteKnownNetworkToAdd.passRequired,
                        key: passVall,
                        name: obj.ssid,
                        priority: 0
                    });
                    ln.createWiFiKnownNetworkTable(obj.iFaceName);
                } catch (e) {

                }

            }, function (devMessage, err) { //success
                mainUtils.showWarningMessage(errMsg, "Instruction execution error!");
            }
    );
    PF('addKnownNetworkDialogWg').hide();
};

ln.onKnownNetworkRemove = function () {
    devManager.sendDevMessage(
            {
                instrExt: 'removeKnownNetwork',
                instrIdx: ln.selecteKnownNetworkToRemove.iFaceName,
                instrData: ln.selecteKnownNetworkToRemove.ssid
            },
            function (devMessage, unitArr) { //success
//                console.log(devMessage);
                try {
                    let networksArr = devManager.getSelected().getParam().networkIfaceMap[ln.selecteKnownNetworkToRemove.iFaceName].wifiKnownNetworks;
                    let idx = -1;
                    for (var i = 0; i < networksArr.length; i++) {
                        if (networksArr[i].name === ln.selecteKnownNetworkToRemove.ssid) {
                            idx = i;
                            break;
                        }
                    }
                    if (idx > -1) {
                        networksArr.splice(idx, 1);
                    }
                    ln.createWiFiKnownNetworkTable(ln.selecteKnownNetworkToRemove.iFaceName);
                } catch (e) {

                }

            }
    );
    PF('removeKnownNetworkDialogWg').hide();
};

ln.onNetworkStaticAddressChange = function () {
    let errMsgEl = document.querySelector('.addNetworkStatiAddressDialogTitleMsg');
    let errMsgCntEl = document.querySelector('.addNetworkStatiAddressDialogTitleMsgContainer');
    let ip = mainUtils.getWidgetValue('addNetworkStaticAddrDialogAddrValueWg');
    let mask = mainUtils.getWidgetValue('addNetworkStaticAddrDialogMaskValueWg');
    let gateway = mainUtils.getWidgetValue('addNetworkStaticAddrDialogGatewayValueWg');
    let dns = mainUtils.getWidgetValue('addNetworkStaticAddrDialogDnsValueWg');

    if (ip.indexOf('/') !== -1) {
        ip = ip.split('/')[0];
    }
    if (!ipUtils.validateIpAddrString(ip)) {
        errMsgCntEl.style.setProperty('display', 'block');
        errMsgEl.innerHTML = "IP Address invalid!<br/>Example: 123.123.123.123";
        return;
    }
    if (!ipUtils.validateIpMaskString(mask)) {
        errMsgCntEl.style.setProperty('display', 'block');
        errMsgEl.innerHTML = "IP Mask invalid!<br/>Example: 255.255.255.0";
        return;
    }
    if (!ipUtils.validateIpAddrString(gateway)) {
        errMsgCntEl.style.setProperty('display', 'block');
        errMsgEl.innerHTML = "Gateway Address invalid!<br/>Example: 123.123.123.123";
        return;
    }
    if (!ipUtils.validateIpInSameSubnetMaskString(ip, mask, gateway)) {

        errMsgCntEl.style.setProperty('display', 'block');
        let range = ipUtils.getIpRangeString(ip, mask);
        errMsgEl.innerHTML = "Gateway Address is Unreachable !<br/> Valid Address Range " + range;
        return;
    }
    if (!ipUtils.validateIpAddrString(dns)) {
        errMsgCntEl.style.setProperty('display', 'block');
        errMsgEl.innerHTML = "DNS Address invalid!<br/>Example: 8.8.8.8";
        return;
    }

    errMsgCntEl.style.setProperty('display', 'none');
//    return;

    let iFaceName = ln.selecteStaticAddress;
    let passVall = ip + ";" + mask + ";" + gateway + ";" + dns;
    devManager.sendDevMessage(
            {
                instrExt: 'setFixedNetworAddr',
                instrIdx: iFaceName,
                instrData: passVall
            },
            function (devMessage, unitArr) { //success
//                console.log(devMessage);
                try {
//                    let networksArr = devManager.getSelected().getParam().networkIfaceMap[obj.iFaceName].wifiKnownNetworks;
//                    networksArr.push({
//                        bssid: obj.bssid,
//                        encrypted: ln.selecteKnownNetworkToAdd.passRequired,
//                        key: passVall,
//                        name: obj.ssid,
//                        priority: 0
//                    });
//                    ln.createWiFiKnownNetworkTable(obj.iFaceName);
                } catch (e) {

                }

            }, function (devMessage, err) { //success
                mainUtils.showWarningMessage(errMsg, "Instruction execution error!");
            }
    );
    PF('addNetworkStaticAddrDialogWg').hide();
};

ln.onStaticIpAddressKeyPress = function () {
    let maskEl = document.querySelector('.addNetworkStatiAddressDialogIpMaskContainer');
    let errMsgEl = document.querySelector('.addNetworkStatiAddressDialogTitleMsg');
    let errMsgCntEl = document.querySelector('.addNetworkStatiAddressDialogTitleMsgContainer');

    let ipMskStr = mainUtils.getWidgetValue('addNetworkStaticAddrDialogAddrValueWg');
    if (ipMskStr.indexOf('/') !== -1) {
        let arr = ipMskStr.split('/');
        if (arr.length !== 2) {
            errMsgCntEl.style.setProperty('display', 'block');
            errMsgEl.innerHTML = "IP Mask Bits invalie invalid!<br/>Example: 192.168.88.1/24";
        } else {
            let ip = arr[0];
            let maskBits = arr[1];
            if (isNaN(maskBits)) {
                errMsgCntEl.style.setProperty('display', 'block');
                errMsgEl.innerHTML = "IP Mask Bits invalie invalid!<br/>Example: 192.168.88.1/24";
            } else {
                let maskBitsNum = Number(maskBits);
                if (maskBitsNum < 1 || maskBitsNum > 31) {
                    errMsgCntEl.style.setProperty('display', 'block');
                    errMsgEl.innerHTML = "IP Mask Bits invalid Range [1 - 31]";
                } else {
                    errMsgCntEl.style.setProperty('display', 'none');
                    let mask = ipUtils.convertMaskBitCountToString(maskBitsNum);
                    mainUtils.setWidgetValue('addNetworkStaticAddrDialogMaskValueWg', mask);
                    maskEl.style.setProperty('display', 'none');
                }
            }
        }
    } else {
        maskEl.style.setProperty('display', 'block');
        errMsgCntEl.style.setProperty('display', 'none');
    }

};

