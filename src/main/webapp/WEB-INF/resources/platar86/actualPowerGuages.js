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


var angularGuagePower =
        {
            "type": "gauge",
            "autoDisplay": true,
            "arrows": [
                {
                    "id": "GaugePower",
                    "innerRadius": "21%",
                    "nailRadius": 0,
                    "radius": "70%",
                    "value": PF('actualPowerLabel')
                }
            ],
            "axes": [
                {
                    "bandGradientRatio": [],
                    "bottomText": "kW",
                    "bottomTextColor": "#C0C0C0",
                    "bottomTextFontSize": 19,
                    "bottomTextYOffset": -50,
                    "color": "#000000",
                    "endValue": 6,
                    "fontSize": 11,
                    "id": "GaugeAxis-1",
                    "minorTickInterval": 0.1,
                    "tickColor": "#9D9D9D",
                    "topText": "Solar MD",
                    "topTextColor": "#555555",
                    "topTextFontSize": 16,
                    "topTextYOffset": 95,
                    "unit": "",
                    "usePrefixes": true,
                    "valueInterval": 0.5,
                    "bands": [
                        {
                            "alpha": 0.45,
                            "balloonText": "",
                            "color": "#00CC00",
                            "endValue": 4.5,
                            "id": "GaugeBand-Green",
                            "startValue": 0
                        },
                        {
                            "color": "#ea3838",
                            "endValue": 6,
                            "id": "GaugeBand-Red",
                            "innerRadius": "95%",
                            "startValue": 4.5
                        }
                    ]
                }
            ],
            "allLabels": [],
            "balloon": {
                "animationDuration": 0.62,
                "borderAlpha": 0.25,
                "borderThickness": 0,
                "fadeOutDuration": 0.62,
                "fontSize": 7,
                "horizontalPadding": 5,
                "maxWidth": 7,
                "showBullet": true
            },
            "titles": [
                {
                    "alpha": 0.3,
                    "id": "PowerMeter",
                    "size": 15,
                    "tabIndex": 0,
                    "text": "Power Meter"
                }
            ]
        };

AmCharts.makeChart("chartdiva", angularGuagePower);