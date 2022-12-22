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

/* global addBrokerData, hh, getPageVisitData */

;
(function (root) {
    let ServerMonitorUtil = function () {
        this.labels = {};
        this.pageVisits = {};
        init.call(this);
    };

    let proto = ServerMonitorUtil.prototype;

    proto.onBrokerDataReceived = function (brokerData) {
        for (var prop in brokerData) {
            if (!this.labels[prop]) {
                this.labels[prop] = hh.adf(this.trafficCard, prop, "");
            }
            this.labels[prop].value = brokerData[prop];
        }
    };
    
    proto.onPageVisitDataReceived = function (pageVisitData) {
        for (var prop in pageVisitData) {
            let str = prop.substr(20);
            if (!this.pageVisits[prop]) {
                this.pageVisits[prop] = hh.adf(this.pageVisitCard, str, "");
            }
            this.pageVisits[prop].value = pageVisitData[prop];
        }
    };

    function init() {
        let container = document.getElementById("brokerData");
        let trafficCard = hh.createActDataPanelCard("Average Traffic Data", null, container);

        this.labels.numMsgsIn = hh.adf(trafficCard, "Messages in per Second", "/s");
        this.labels.numMsgsOut = hh.adf(trafficCard, "Messages out per Second", "/s");

        this.labels.totalMsgBytes = hh.adf(trafficCard, "Total Message Bytes per Second", "/s");
        this.labels.msgBytesIn = hh.adf(trafficCard, "Message Bytes in Per Second", "/s");
        this.labels.msgBytesOut = hh.adf(trafficCard, "Message Bytes out Per Second", "/s");

        this.labels.numPktsIn = hh.adf(trafficCard, "Packets in per Second", "/s");
        this.labels.numPktsOut = hh.adf(trafficCard, "Packets out per Second", "/s");
        this.labels.pktBytesIn = hh.adf(trafficCard, "Packet Bytes in per Second", "/s");
        this.labels.pktBytesOut = hh.adf(trafficCard, "Packet Bytes out per Second", "/s");

        let totalsCard = hh.createActDataPanelCard("Broker Totals Data", null, container);
        this.labels.lastUpdate = hh.adf(totalsCard, "Last Update", null, {
            formatter: function (df, val, unit) {
                return new Date(val);
            }
        });
        this.labels.numDestinations = hh.adf(totalsCard, "Destinations");
        this.labels.numConnections = hh.adf(totalsCard, "Connections");

        this.labels.totalTotalMsgBytes = hh.adf(totalsCard, "Message Bytes");
        this.labels.totalMsgBytesIn = hh.adf(totalsCard, "Bytes In");
        this.labels.totalMsgBytesOut = hh.adf(totalsCard, "Bytes Out");

        this.labels.totalNumMsgs = hh.adf(totalsCard, "Messages");
        this.labels.totalNumMsgsIn = hh.adf(totalsCard, "Messages In");
        this.labels.totalNumMsgsOut = hh.adf(totalsCard, "Messages Out");

        this.labels.totalNumPktsIn = hh.adf(totalsCard, "Packets In");
        this.labels.totalNumPktsOut = hh.adf(totalsCard, "Packets Out");

        this.labels.totalPktBytesIn = hh.adf(totalsCard, "Packet Bytes In");
        this.labels.totalPktBytesOut = hh.adf(totalsCard, "Packet Bytes Out");

        container = document.getElementById("pageVisitContainer");
        this.pageVisitCard = hh.createActDataPanelCard("Page Visit Data", null, container);
        
    }


    document.addEventListener("DOMContentLoaded", function (event) {
        root.serMonUtil = new ServerMonitorUtil();
        window.setInterval(addBrokerData, 3000);
        window.setInterval(getPageVisitData, 5000);
    });
}(window));


