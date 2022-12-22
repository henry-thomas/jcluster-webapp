/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by platar86, 2019
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 Sout Africa
 *  Phone: 021 555 2181
 *  
 */
/* global AmCharts, bmsPl */
var bmsPlGraph = {
    data: [],
    onDataRefresh: function (d) {
        console.log('update');
//        bmsPlGraph.data.push(d);
//        moment(d.created).format
//        var ob = {
//            data: d,
//            "created": "2017-07-17 12:54:00"
//        };
//       
        d.data.created = d.created;
        bmsPlGraph.data.push(d.data);
        bmsPlCh.validateData();
    },
    generateGraphs: function () {
        var arr = [];
        arr.push({
            "id": "packVoltageGraph",
            "title": "Pack Voltage",
            "type": "smoothedLine",
            "balloonText": "Pack voltage" + ": [[value]] V",
            "valueAxis": "packVoltageAxis",
            "valueField": "packVoltage"
        });
        arr.push({
            "id": "capacityGraphID",
            "balloonText": "Capacity" + ": [[value]] mAh",
            "title": "Capacitye",
            "type": "smoothedLine",
            "valueAxis": "capCurAxis",
            "valueField": "capacity"
        });
        arr.push({
            "id": "currentGraphID",
            "balloonText": "Current" + ": [[value]] mA",
            "title": "Current",
            "type": "smoothedLine",
            "valueAxis": "capCurAxis",
            "valueField": "current"
        });
        for (var i = 1; i <= 16; i++) {
            arr.push({
                "id": "Cell" + i,
                "balloonText": "Cell" + i + ": [[value]] mV",
                "hidden": true,
                "minBulletSize": 2,
                "title": "cell" + i,
                "type": "smoothedLine",
                "valueAxis": "cellVoltageAxis",
                "valueField": "cell" + i
            });
        }
        return arr;
    }
};

var bmsPlCh = AmCharts.makeChart("bmsPlCh", {
    "type": "serial",
    "categoryField": "created",
//    "dataDateFormat": "YYY-MM-DDTHH:MM:SSZ",
    "startDuration": 1,
    "path": "/resources/amCharts",
    "libs": {"path": "/resources/amCharts/plugins/export"},
    "pathToImages": "/resources/amCharts/images/",
     "responsive": {
        "enabled": true,
        "rules": [
            // at 400px wide, we hide legend
            {
                "maxWidth": 400,
                "overrides": {
                    "legend": {
                        "enabled": false
                    },
                    "titles": [
                        {
                            "id": "Title-1",
                            "size": 12,
                            "text": "Live data"
                        }
                    ],
                }
            },
            // at 300px or less, we move value axis labels inside plot area
            // the legend is still hidden because the above rule is still applicable
            {
                "maxWidth": 300,
                "overrides": {
                    "valueAxes": {
                        "inside": true
                    }
                }
            },
            // at 200 px we hide value axis labels altogether
            {
                "maxWidth": 200,
                "overrides": {
                    "valueAxes": {
                        "labelsEnabled": false
                    }
                }
            }

        ]
    },
    "categoryAxis": {
        "minPeriod": "ss",
        "parseDates": true
    },
    "valueScrollbar": {
        "enabled": true
    },
    "chartCursor": {
        "enabled": true,
        "categoryBalloonDateFormat": "JJ:NN:SS"
    },
    "chartScrollbar": {
        "enabled": true
    },
    "trendLines": [],
    "graphs": bmsPlGraph.generateGraphs(),
    "guides": [],
    "valueAxes": [
        {
            "precision": 2,
            "position": "right",
            "id": "cellVoltageAxis"

        },
        {
            "offset": 0,
            "precision": 0,
            "id": "capCurAxis",
            "minimum": -80,
            maximum: 80,
            "labelFrequency": 4
        },
        {
            "offset": 40,
            "precision": 2,
            "id": "packVoltageAxis"

        }
    ],
    "allLabels": [],
    "balloon": {},
    "legend": {
        "enabled": true,
        "useGraphSettings": true
    },
    "titles": [
        {
            "id": "Title-1",
            "size": 15,
            "text": "Chart Title"
        }
    ],
    "dataProvider": bmsPlGraph.data
//    "responsive": {
//        "enabled": true,
//        "rules": [
//            // at 400px wide, we hide legend
//            {
//                "maxWidth": 400,
//                "overrides": {
//                    "legend": {
//                        "enabled": false
//                    }
//                }
//            },
//
//            // at 300px or less, we move value axis labels inside plot area
//            // the legend is still hidden because the above rule is still applicable
//            {
//                "maxWidth": 300,
//                "overrides": {
//                    "valueAxes": {
//                        "inside": true
//                    }
//                }
//            },
//
//            // at 200 px we hide value axis labels altogether
//            {
//                "maxWidth": 200,
//                "overrides": {
//                    "valueAxes": {
//                        "labelsEnabled": false
//                    }
//                }
//            }
//
//        ]
//    }
}
);

bmsPl.graphCallback = bmsPlGraph.onDataRefresh;