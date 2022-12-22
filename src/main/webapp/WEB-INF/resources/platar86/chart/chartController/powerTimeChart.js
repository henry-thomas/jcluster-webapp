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


/* global am4core, am4charts, am4themes_animated, cm */



var ptc = {};

function getChartData() {
    return [{
            "date": "2013-01-13",
            "value": 70
        }, {
            "date": "2013-01-14",
            "value": 70
        }, {
            "date": "2013-01-15",
            "value": 73
        }, {
            "date": "2013-01-16",
            "value": 71
        }, {
            "date": "2013-01-17",
            "value": 74
        }, {
            "date": "2013-01-18",
            "value": 78
        }, {
            "date": "2013-01-19",
            "value": 85
        }, {
            "date": "2013-01-20",
            "value": 82
        }, {
            "date": "2013-01-21",
            "value": 83
        }, {
            "date": "2013-01-22",
            "value": 88
        }, {
            "date": "2013-01-23",
            "value": 85
        }, {
            "date": "2013-01-24",
            "value": 85
        }, {
            "date": "2013-01-25",
            "value": 80
        }, {
            "date": "2013-01-26",
            "value": 87
        }, {
            "date": "2013-01-27",
            "value": 84
        }, {
            "date": "2013-01-28",
            "value": 83
        }, {
            "date": "2013-01-29",
            "value": 84
        }, {
            "date": "2013-01-30",
            "value": 81
        }];
}


/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
let chart = am4core.create("chartdiv", am4charts.XYChart);

// Add data
chart.data = getChartData();

// Set input format for the dates
chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

// Create axes
let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
let series = chart.series.push(new am4charts.LineSeries());
series.dataFields.valueY = "value";
series.dataFields.dateX = "date";
series.tooltipText = "{value}";
series.strokeWidth = 2;
series.minBulletDistance = 15;

// Drop-shaped tooltips
series.tooltip.background.cornerRadius = 20;
series.tooltip.background.strokeOpacity = 0;
series.tooltip.pointerOrientation = "vertical";
series.tooltip.label.minWidth = 40;
series.tooltip.label.minHeight = 40;
series.tooltip.label.textAlign = "middle";
series.tooltip.label.textValign = "middle";

// Make bullets grow on hover
let bullet = series.bullets.push(new am4charts.CircleBullet());
bullet.circle.strokeWidth = 2;
bullet.circle.radius = 4;
bullet.circle.fill = am4core.color("#fff");

let bullethover = bullet.states.create("hover");
bullethover.properties.scale = 1.3;

// Make a panning cursor
chart.cursor = new am4charts.XYCursor();
chart.cursor.behavior = "panXY";
chart.cursor.xAxis = dateAxis;
//chart.cursor.snapToSeries = valueAxis;

// Create vertical scrollbar and place it before the value axis
chart.scrollbarY = new am4core.Scrollbar();
chart.scrollbarY.parent = chart.rightAxesContainer;
chart.scrollbarY.toBack();

// Create a horizontal scrollbar with previe and place it underneath the date axis
chart.scrollbarX = new am4charts.XYChartScrollbar();
chart.scrollbarX.series.push(series);
chart.scrollbarX.parent = chart.topAxesContainer;

dateAxis.start = 0.5;
dateAxis.keepSelection = true;






chart.exporting.menu = new am4core.ExportMenu();
chart.exporting.menu.align = "right";
chart.exporting.menu.verticalAlign = "top";
chart.exporting.menu.position = "relative";
//chart.exporting.menu.container = document.querySelector(".chartControl");

chart.exporting.menu.items = [{
        "label": "...",
        "menu": [
            {
                "type": "custom",
                "label": "Fullscreen",
                "options": {
                    callback: function (ch) {
                        if (!ch.fulScreenEnable) {
                            hh.openFullscreen(document.querySelector(".card"));
                            ch.fulScreenEnable = true;
                        } else {
                            hh.closeFullscreen();
                            ch.fulScreenEnable = false;
                        }
                        console.log("Hello back at ya!");
                    }.bind(chart)
                }
            },
            {
                "type": "custom",
                "label": "Settings",
                "options": {
                    callback: function (ch) {
                        if (!ch.fulScreenEnable) {
                            hh.openFullscreen(document.querySelector(".card"));
                            ch.fulScreenEnable = true;
                        } else {
                            hh.closeFullscreen();
                            ch.fulScreenEnable = false;
                        }
                        console.log("Hello back at ya!");
                    }.bind(chart)
                }
            },
            {
                "label": 'Export',
                "menu": [
                    {
                        "type": "png",
                        "label": "PNG",
                        "options": {"quality": 1}
                    },
                    {
                        "type": "json",
                        "label": "JSON",
                        "options": {"indent": 2, "useTimestamps": true}
                    },
                    {
                        "label": "Print",
                        "type": "print"
                    }
                ]
            }
        ]
    }];



//chart.events.on("swipe",
//        function valueAxisZoomed() {
//
//            console.log(arguments);
//        }
//);


chart.zoomOutButton.icon.disabled = true;
var zoomImage = chart.zoomOutButton.createChild(am4core.Image);
zoomImage.href = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDk2IDk2IiBoZWlnaHQ9Ijk2cHgiIGlkPSJ6b29tX291dCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgOTYgOTYiIHdpZHRoPSI5NnB4IiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48cGF0aCBkPSJNOTAuODI5LDg1LjE3MUw2OC4xMjEsNjIuNDY0QzczLjA0Nyw1Ni4zMDcsNzYsNDguNSw3Niw0MEM3NiwyMC4xMTgsNTkuODgyLDQsNDAsNEMyMC4xMTgsNCw0LDIwLjExOCw0LDQwczE2LjExOCwzNiwzNiwzNiAgYzguNSwwLDE2LjMwNi0yLjk1MywyMi40NjQtNy44NzlsMjIuNzA4LDIyLjcwOGMxLjU2MiwxLjU2Miw0LjA5NSwxLjU2Miw1LjY1NywwQzkyLjM5MSw4OS4yNjcsOTIuMzkxLDg2LjczMyw5MC44MjksODUuMTcxeiAgIE00MCw2OGMtMTUuNDY0LDAtMjgtMTIuNTM2LTI4LTI4czEyLjUzNi0yOCwyOC0yOGMxNS40NjQsMCwyOCwxMi41MzYsMjgsMjhTNTUuNDY0LDY4LDQwLDY4eiIvPjxwYXRoIGQ9Ik01Niw0MGMwLDIuMjA5LTEuNzkxLDQtNCw0SDI4Yy0yLjIwOSwwLTQtMS43OTEtNC00bDAsMGMwLTIuMjA5LDEuNzkxLTQsNC00aDI0QzU0LjIwOSwzNiw1NiwzNy43OTEsNTYsNDBMNTYsNDB6Ii8+PC9zdmc+";
zoomImage.width = 15;
zoomImage.height = 15;


var slider = new HidSlider(document.getElementById('sliderHidden1'), {

    valSuffix: " Days",
    valSuffixSig: " Day",
    val: 1,
    minVal: 1,
    maxVal: 7,
    hideOnChange: true,
    inputWidth: '75px',
    onValueChange: function (val) {
        console.log('HidSlider value change: ' + val);
    }

});



var tabPanel = new TabPanel(document.getElementById('tabPanel'), {
    menuItem: [
        {
            label: "Data Basic",
            contentId: 'chart1DataBasicContent'
        },
        {
            label: "Chart Basic",
            contentId: 'chart1ChartBasicContent'
        }
    ],
    onTabChange: function (tabName, content) {
        console.log(tabName, content);
    },
    onInitComplete: function (tabPanel) {
        console.log(tabPanel);
        var setPanelSwitch = new SettingPanel(tabPanel.getSelectedItemContent(), {
            title: 'Some Title',
            toolTip: 'SomeTooletipppp CSS animations do  this behavior.',
            type: 'switch',
            typeStyle: 'sliderRound',
            onChange: function (val) {
                console.log('setPanel value change: ' + val);
            }
        });

        var setPanelSwitch = new SettingPanel(tabPanel.getSelectedItemContent(), {
            title: 'Panel Width',
            toolTip: 'SomeTooletipppp',
            type: 'sliderHidden',
            sliderHiddenConf: {
                valSuffix: " px",
                valSuffixSig: " px",
                val: 1,
                minVal: 1,
                maxVal: 280,
                hideOnChange: true,
                inputWidth: '75px'
            },
            onChange: function (val) {
                console.log('setPanel value change: ' + val);
            }
        });


        var setPanelText = new SettingPanel(tabPanel.getSelectedItemContent(), {
            title: 'Text Name Width',
            toolTip: 'SomeTooletipppp',
            type: 'inputText',
            inputHiddenConf: {
                val: 'Input Text',
                hideOnChange: true,
                inputWidth: '75px'
            },
            onChange: function (val) {
                console.log('setPanel Text value change: ' + val);
            }
        });

        var dropDown3 = new SettingPanel(tabPanel.getSelectedItemContent(), {
            title: 'DropDown Name Width',
            toolTip: 'SomeTooletipppp for Dropdown ',
            type: 'dropDown',
            dropDownConf: {
                val: 'option1Value',
                options: [
                    {label: 'option1', value: 'option1Value'},
                    {label: 'option2', value: 'option1Value1'},
                    {label: 'option3'},
                    {label: 'option4', value: 'option1Value2'},
                    {value: 'option1Value5'}
                ]
            },
            onChange: function (val) {
                console.log('dropDown Text value change: ' + val);
            }
        });

        var colorInput = new SettingPanel(tabPanel.getSelectedItemContent(), {
            title: 'Color Name Width',
            toolTip: 'SomeTooletipppp',
            type: 'inputColor',
            inputColorConf: {
                val: '#123456',
                hideOnChange: true,
                inputWidth: '75px'
            },
            onChange: function (val) {
                console.log('setPanel Text value change: ' + val);
            }
        });



    }


});