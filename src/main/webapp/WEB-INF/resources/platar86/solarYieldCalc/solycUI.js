/* global solyc, ch, calcButton */

let solycChart = {

    dailyPerformanceArray: [],
    yearlyPerformanceArray: [],
    totalYield: {},

    calcButton: function (div) { //only creates button when called
        new uiObject(div, {
            title: 'calculate',
            type: 'button',
            label: 'Initialize',
            container: div,
            onChange: function () {
//                let addSeriesBtn = document.getElementById("AddSeriesBtn");
//                addSeriesBtn.style = "background:#009688; opacity:1;";
//                let acoridanClose = document.getElementsByClassName("ui-accordion-content");
//                console.log(acoridanClose);
//                
//                acoridanClose.style = "display: none;";
//                console.log('Calc init');
                solycChart.onCalculate();
                solycChart.init();

                 ch.charts.yearChart.totalYieldWrapper.appendChild(ch.charts.yearChart.totalYieldDiv);
                 ch.charts.yearChart.totalYieldWrapper.appendChild(ch.charts.yearChart.totalMonthlyYieldDiv);
                 ch.charts.yearChart.totalYieldWrapper.appendChild(ch.charts.yearChart.totalDailyYieldDiv);
                 
                    ch.charts.yearChart.totalYieldWrapper.id = "totalYieldWrapper";
                
                ch.charts.yearChart.totalYieldDiv.textContent = "Total Year yield: " + solycChart.totalYield.toFixed(2);
                ch.charts.yearChart.totalMonthlyYieldDiv.textContent = "Total Month yield: " + (solycChart.totalYield /12).toFixed(2);
                ch.charts.yearChart.totalDailyYieldDiv.textContent = "Total Day yield: " + (solycChart.totalYield /365).toFixed(2);
                ch.charts.yearChart.totalYieldDiv.id = "totalYieldOutput";
                ch.charts.yearChart.totalMonthlyYieldDiv.id = "totalMonthlyYieldOutput";
                ch.charts.yearChart.totalDailyYieldDiv.id = "totalYearYieldOutput";
                
                ch.charts.yearChart.totalYieldDiv.classList.add('card');
                ch.charts.yearChart.totalMonthlyYieldDiv.classList.add('card');
                ch.charts.yearChart.totalDailyYieldDiv.classList.add('card');
                
                
//                console.log('breeeeak');

            }
        });
    },

    addSeriesButton: function (div) { //only creates button when called
        return new uiObject(div, {
            title: 'addSeries',
            type: 'button',
            label: 'Add Series',
            onChange: function () {
                solycChart.onCalculate();
                ch.charts.dayChart.onAddSeries(solycChart.dailyPerformanceArray);
                ch.charts.yearChart.onAddSeries(solycChart.yearlyPerformanceArray);

//                let totalYieldDiv = hh.div(ch.charts.yearChart.el);
//                totalYieldDiv.textContent = "Total yield: " + solycChart.totalYield;
                ch.charts.yearChart.totalYieldDiv.textContent = "Total yield: " + solycChart.totalYield;
            }
        });
    },

    locationBtn: function (div) { //only creates button when called
        new uiObject(div, {
            title: 'addSeries',
            type: 'createLocationBtn',
            label: 'Get Location',
            onChange: function () {
                let lat = document.getElementById("latitude");
                let long = document.getElementById("longitude");
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showPosition);
                } else {
                    console.warn("Geolocation is not supported by this browser.");
                }


                function showPosition(position) {
                    lat.value = position.coords.latitude;
                    long.value = position.coords.longitude;
                }
            }
        });
    },

    latitudeTextInput: function (div) { //only creates button when called
        new uiObject(div, {
            title: 'latInputText',
            type: 'inputText',
            label: 'Latitude:',
            default: '',
            id: 'latitude'
        });
    },

    longituteTextInput: function (div) {
        new uiObject(div, {
            title: 'longInputTExt',
            type: 'inputText',
            label: 'Longitude:',
            default: '',
            id: 'longitude'
        });
    },

    timeZone: function (div) {
        new uiObject(div, {
            title: 'tzInputText',
            type: 'inputText',
            label: 'Time Zone:',
            default: '2',
            id: 'timeZone'
        });
    },

    solarArrSize: function (div) {
        new uiObject(div, {
            title: 'instSizeInputText',
            type: 'inputText',
            label: 'Installation Size: kW ',
            default: '10',
            id: 'installationSize'
        });
    },

    panelTilt: function (div) {
        new uiObject(div, {
            type: 'range',
            label: 'Panel Tilt: ',
//            valueLabel:"0",
            default: '0',
            id: 'panelElevation'
        });
    },

    rotation: function (div) {
        new uiObject(div, {
            type: 'range',
            label: 'Panel Rotation: ',
            default: '0',
            id: 'panelAzimuth'
        });
    },

    datePicker: function (div) {
        new uiObject(div, {
            title: 'date',
            type: 'date',
            label: 'Select Date:',
            default: '2021-11-02',
            id: 'date'
        });
    },

    onLoad: function () {
        let settingsDiv = document.querySelector('#chartSyc');
        let settingsPanel = new SMDUIAccordianPanel(settingsDiv, {
            tabs: ["Settings"]
        })

        let dailyDataPanelWrapper = document.createElement('div');
        dailyDataPanelWrapper.classList.add('top-ui');
        document.querySelector('#chartSyc').appendChild(dailyDataPanelWrapper); //Choose parent div here
        dailyDataPanelWrapper.style = "display:flex";

        let dailyDataPanel = document.createElement('div');
        dailyDataPanel.classList.add('top-ui-div');
        dailyDataPanel.style = "width: 100%";
        dailyDataPanelWrapper.appendChild(dailyDataPanel); //Choose parent div here

        let imgBoxWrapper = document.createElement("div");
        imgBoxWrapper.id = "img-box-wrapper";
        let imageWrapper = document.createElement("div");
        imageWrapper.style = " display:flex; justify-content: center; height:559px";

        let globImgWrapper = document.createElement("div");
        globImgWrapper.id = "glob_img_wrapper";
//        globImgWrapper.style = "hight:50px; background:red";




        let outputDegrees = document.createElement("div");
        outputDegrees.id = "outputDeg";
//        outputDegrees.style = " right: 10%; position: absolute; "
        outputDegrees.classList.add("card");

        let paneTiltOutput = document.createElement("div");
        let panelRotationOutput = document.createElement('div');
        panelRotationOutput.id = "panel_rotation_output";
        paneTiltOutput.id = "pane_tilt_output";

//        let glob = document.createElement('IMG');


        let compass = document.createElement("IMG");
        compass.id = "compasImg";
        let house = document.createElement("IMG");
        house.id = "house_0";
        let roof0 = document.createElement("IMG");
        roof0.id = "roof_0";
        let roof10 = document.createElement("IMG");
        roof10.id = "roof_10";
        let roof12 = document.createElement("IMG");
        roof12.id = "roof_12";
        let roof15 = document.createElement("IMG");
        roof15.id = "roof_15";
        let roof20 = document.createElement("IMG");
        roof20.id = "roof_20";

//        let panelTValue = document.getElementById("panelElevation");
//        console.log(panelTValue + "************************");

//        glob.setAttribute("src", "/myPower24-ClientWeb/resources/ultima-layout/images/globe.PNG?pfdrid_c=true");
        compass.setAttribute("src", "/myPower24-ClientWeb/defaultImages/SolarYeildCalcImages/compass.png?pfdrid_c=true");
        house.setAttribute("src", "/myPower24-ClientWeb/defaultImages/SolarYeildCalcImages/house.png?pfdrid_c=true");
        roof0.setAttribute("src", "/myPower24-ClientWeb/defaultImages/SolarYeildCalcImages/roof0.png?pfdrid_c=true");
        roof10.setAttribute("src", "/myPower24-ClientWeb/defaultImages/SolarYeildCalcImages/roof10.png?pfdrid_c=true");
        roof12.setAttribute("src", "/myPower24-ClientWeb/defaultImages/SolarYeildCalcImages/roof12.png?pfdrid_c=true");
        roof15.setAttribute("src", "/myPower24-ClientWeb/defaultImages/SolarYeildCalcImages/roof15.png?pfdrid_c=true");
        roof20.setAttribute("src", "/myPower24-ClientWeb/defaultImages/SolarYeildCalcImages/roof20.png?pfdrid_c=true");


//        house.style = "position:absolute; bottom:170px";
//        roof0.style = "position:absolute; bottom:267px;";
//        roof10.style = "position:absolute; bottom:209px;  ";
//        roof12.style = "position:absolute; bottom:278px;  ";
//        roof15.style = "position:absolute; bottom:278px;  ";
//        roof20.style = "position:absolute; bottom:278px;  ";
//        let valsol = solyc().panelAzimuth;
//        console.log(valsol + "this is a test*************");
//        if (valsol === "10") {
//            roof0.style = "display: none;";
//        }

        let dailyDataPanelInputs = document.createElement('div');
        dailyDataPanelInputs.classList.add('top-ui-div-inputs');
        dailyDataPanelWrapper.appendChild(dailyDataPanelInputs); //Choose parent div here


        let settingsContent = settingsPanel.getTabContentById(0);
        settingsContent.appendChild(dailyDataPanelWrapper);


        let dailyData1 = document.createElement('div');
        dailyData1.classList.add('dailyData');
//        dailyData1.style = "display:block";
//        dailyData1.style = "diaplay:none";
        document.querySelector('.top-ui-div').appendChild(dailyData1);
        let dailyData2 = document.createElement('div');
        dailyData2.classList.add('dailyData');
        document.querySelector('.top-ui-div').appendChild(dailyData2);
        let dailyData3 = document.createElement('div');
        dailyData3.classList.add('dailyData');
        document.querySelector('.top-ui-div').appendChild(dailyData3);

        let buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('dailyData');
        document.querySelector('.top-ui-div').appendChild(buttonsDiv);
//        buttonsDiv.style="display:flex; justify-content: space-between";

//        console.log(solyc().panelAzimuth);

        //place the UI components
        solycChart.datePicker(dailyData2);
        solycChart.latitudeTextInput(dailyData1);
        solycChart.longituteTextInput(dailyData1);
        solycChart.locationBtn(dailyData1);
        solycChart.timeZone(dailyData1);
        solycChart.solarArrSize(dailyData2);
        solycChart.panelTilt(dailyData2);
        solycChart.rotation(dailyData2);
        solycChart.calcButton(buttonsDiv);
        let addSeriesBtn = solycChart.addSeriesButton(buttonsDiv);
        addSeriesBtn.el.setAttribute('id', 'AddSeriesBtn');

        dailyDataPanel.appendChild(imgBoxWrapper);

        imgBoxWrapper.appendChild(imageWrapper);
        imgBoxWrapper.appendChild(globImgWrapper);


        imageWrapper.appendChild(compass);
        imageWrapper.appendChild(house);
        imageWrapper.appendChild(roof0);
        imageWrapper.appendChild(roof10);
        imageWrapper.appendChild(roof12);
        imageWrapper.appendChild(roof15);
        imageWrapper.appendChild(roof20);
        imageWrapper.appendChild(outputDegrees);
        outputDegrees.appendChild(paneTiltOutput);
        outputDegrees.appendChild(panelRotationOutput);
    },

    init: function () {



        let yearlyDefConfig = {
            data: [],
            cursor: [{
                    enabled: true
                }],

            hiddenState: {
                properties: {
                    opacity: 0
                }
            },

            xAxes: [{
                    type: "DateAxis",
                    dataFields: {
                        category: "day"
                    },
                    renderer: {
                        grid: {
                            disabled: true
                        }
                    }
                }],

            yAxes: [{
                    type: "ValueAxis",
                    title: {
                        text: "Energy (kWh)",
                    },
                    min: 0,
                    renderer: {
                        baseGrid: {
                            disabled: true
                        },
                        grid: {
                            strokeOpacity: 5
                        }
                    }
                }],

            series: [{
                    type: "LineSeries",
                    dataFields: {
                        valueY: "energy",
                        dateX: "day"
                    },
                    tooltip: {
                        pointerOrientation: "vertical",
                    },
                    tooltipText: "{dateX}: [bold]{valueY.formatNumber('###.00')}[/] (kWh)",
                    strokeWidth: 4,
                }],

        };

        let dailyDefConfig = {
            data: [],
            cursor: [{
                    enabled: true
                }],

            hiddenState: {
                properties: {
                    opacity: 0
                }
            },

            xAxes: [{
                    type: "DateAxis",
                    dataFields: {
                        date: "hour"
                    },
                    renderer: {
                        grid: {
                            disabled: true
                        }
                    },
                    baseInterval: {
                        timeUnit: "minute",
                        count: 6
                    }
                }],

            yAxes: [{
                    type: "ValueAxis",
                    title: {
                        text: "Power (kW)",
                    },
                    min: 0,
                    renderer: {
                        baseGrid: {
                            disabled: true
                        },
                        grid: {
                            strokeOpacity: 5
                        }
                    }
                }],

            series: [{
                    type: "LineSeries",
                    dataFields: {
                        valueY: "irradiation",
                        dateX: "hour"
                    },
                    tooltipText: "{dateX.formatDate('HH:mm')}: [bold]{valueY.formatNumber('###.00')}[/] (kW)",
                    strokeWidth: 4,
                }],

        };


        let initializeCb = function () {
            console.log('Callback received...');
        };

        let dayChart = function (div) {
            //solycChart.onCalculateDaily();
            ch.createChart(
                    div,
                    'dayChart',
                    dailyDefConfig,
                    initializeCb,
                    solycChart.dailyPerformanceArray,
                    'day'
                    );
        }

        let dayChartdiv = document.createElement('div');
        dayChartdiv.classList.add('chart-div');
        document.querySelector('#ChartCard').appendChild(dayChartdiv);
         document.querySelector('#ChartCard').classList.add('card')
        dayChart(dayChartdiv);


        let yearChart = function (div) {
            // solycChart.onCalculateYearly();
            ch.createChart(
                    div,
                    'yearChart',
                    yearlyDefConfig,
                    initializeCb,
                    solycChart.yearlyPerformanceArray,
                    'year'
                    );
        }

        let yearChartdiv = document.createElement('div');
        yearChartdiv.classList.add('chart-div');
        document.querySelector('#ChartCard').appendChild(yearChartdiv);
        yearChart(yearChartdiv);



    },

    onCalculate: function () {
        var yearlyData = sol().setLatitude(document.querySelector('#latitude').value)
                .setLongitude(document.querySelector('#longitude').value)
                .setTimezone(document.querySelector('#timeZone').value)
                .setPanelAzimuth(document.querySelector('#panelAzimuth').value)
                .setPanelElevation(document.querySelector('#panelElevation').value)
                .setInstallationSize(document.querySelector('#installationSize').value);
        var dailyData = sol().setLatitude(document.querySelector('#latitude').value)
                .setLongitude(document.querySelector('#longitude').value)
                .setDate(document.querySelector('#date').value)
                .setTimezone(document.querySelector('#timeZone').value)
                .setPanelAzimuth(document.querySelector('#panelAzimuth').value)
                .setPanelElevation(document.querySelector('#panelElevation').value)
                .setInstallationSize(document.querySelector('#installationSize').value);
        //will rerun every time and action is triggered. Gets date from "dailyData"
        var year = moment(document.querySelector('#date').value).year();
        //var yearStart = moment(year).dayOfYear(1).dayOfYear();
        var startDate = moment(year + "-01-01");
        var endDate = moment(year + "-12-31");


        var length = moment.duration(endDate.diff(startDate)).asDays();
        console.log(length);
        var yearlyPerformanceArray = [];
        var nextDay = moment(startDate).format("YYYY-MM-DD");
        var totalYield = 0;
        var dailyPerformanceArray = [];
        for (var j = 0; j < length; j++) {

            yearlyData.setDate(nextDay);

            var dailyEnergy = 0;
            var iterator = 0;

            for (var i = 0; i < 240; i++) {

                iterator += 0.1;
                yearlyData.calculate(iterator); //iterator is used in Solyc to create a mesh and divide the days up into fractions of hours.
                dailyEnergy += (0.1 * yearlyData.installationSize * yearlyData.s_module);
                if (yearlyData.date === dailyData.date) {
                    dailyPerformanceArray.push({hour: moment(yearlyData.date).add(iterator, "hours").format("MM-DD HH:mm").toString(), irradiation: yearlyData.installationSize * yearlyData.s_module});
                }
                ;

            }
            ;


            yearlyPerformanceArray.push({day: nextDay.toString(), energy: dailyEnergy, s_module: yearlyData.s_module});
            totalYield += dailyEnergy;
            nextDay = moment(nextDay).add(1, 'days').format("YYYY-MM-DD");
        }
        ;
        solycChart.dailyPerformanceArray = dailyPerformanceArray;
        solycChart.yearlyPerformanceArray = yearlyPerformanceArray;
        solycChart.totalYield = totalYield; //We need to display this somewhere
    },

};

solycChart.onLoad();


let tar = document.getElementById("panelElevation");

let roofStyle0 = document.getElementById("roof_0");
let roofStyle10 = document.getElementById("roof_10");
let roofStyle12 = document.getElementById("roof_12");
let roofStyle15 = document.getElementById("roof_15");
let roofStyle20 = document.getElementById("roof_20");

//let outputTarget = document.getElementById("outputDeg");
let panelTiltOut = document.getElementById("pane_tilt_output");
let panelRotateOut = document.getElementById("panel_rotation_output");

let outputCard = document.getElementById("outputDeg");

let rotatValue = document.getElementById('panelAzimuth');
rotatValue.max = 360;
rotatValue.step = 1;
//rotatValue.style = "color:red";
let compass = document.getElementById("compasImg");




rotatValue.oninput = function () {

    let compasSighn;

    if ((rotatValue.value >= 0 && rotatValue.value <= 11) || (rotatValue.value >= 349 && rotatValue.value <= 360)) {
        compasSighn = "N";
        panelRotateOut.innerHTML = "Panel Rotation:" + " " + compasSighn + " " + rotatValue.value + '°';

    }
    if ((rotatValue.value > 11 && rotatValue.value <= 33)) {
        compasSighn = "NNE";
        panelRotateOut.innerHTML = "Panel Rotation:" + " " + compasSighn + " " + rotatValue.value + '°';
    }
    if ((rotatValue.value > 33 && rotatValue.value <= 56)) {
        compasSighn = "NE";
        panelRotateOut.innerHTML = "Panel Rotation:" + " " + compasSighn + " " + rotatValue.value + '°';
    }
    if ((rotatValue.value > 56 && rotatValue.value <= 79)) {
        compasSighn = "ENE";
        panelRotateOut.innerHTML = "Panel Rotation:" + " " + compasSighn + " " + rotatValue.value + '°';
    }
    if ((rotatValue.value > 79 && rotatValue.value <= 101)) {
        compasSighn = "E";
        panelRotateOut.innerHTML = "Panel Rotation:" + " " + compasSighn + " " + rotatValue.value + '°';
    }
    if ((rotatValue.value > 101 && rotatValue.value <= 124)) {
        compasSighn = "ESE";
        panelRotateOut.innerHTML = "Panel Rotation:" + " " + compasSighn + " " + rotatValue.value + '°';
    }
    if ((rotatValue.value > 124 && rotatValue.value <= 146)) {
        compasSighn = "SE";
        panelRotateOut.innerHTML = "Panel Rotation:" + " " + compasSighn + " " + rotatValue.value + '°';
    }
    if ((rotatValue.value > 146 && rotatValue.value <= 169)) {
        compasSighn = "SSE";
        panelRotateOut.innerHTML = "Panel Rotation:" + " " + compasSighn + " " + rotatValue.value + '°';
    }
    if ((rotatValue.value > 169 && rotatValue.value <= 191)) {
        compasSighn = "S";
        panelRotateOut.innerHTML = "Panel Rotation:" + " " + compasSighn + " " + rotatValue.value + '°';
    }
    if ((rotatValue.value > 191 && rotatValue.value <= 214)) {
        compasSighn = "SSW";
        panelRotateOut.innerHTML = "Panel Rotation:" + " " + compasSighn + " " + rotatValue.value + '°';
    }
    if ((rotatValue.value > 214 && rotatValue.value <= 236)) {
        compasSighn = "SW";
        panelRotateOut.innerHTML = "Panel Rotation:" + " " + compasSighn + " " + rotatValue.value + '°';
    }
    if ((rotatValue.value > 236 && rotatValue.value <= 259)) {
        compasSighn = "WSW";
        panelRotateOut.innerHTML = "Panel Rotation:" + " " + compasSighn + " " + rotatValue.value + '°';
    }
    if ((rotatValue.value > 259 && rotatValue.value <= 281)) {
        compasSighn = "W";
        panelRotateOut.innerHTML = "Panel Rotation:" + " " + compasSighn + " " + rotatValue.value + '°';
    }
    if ((rotatValue.value > 281 && rotatValue.value <= 303)) {
        compasSighn = "WNW";
        panelRotateOut.innerHTML = "Panel Rotation:" + " " + compasSighn + " " + rotatValue.value + '°';
    }
    if ((rotatValue.value > 303 && rotatValue.value <= 326)) {
        compasSighn = "NW";
        panelRotateOut.innerHTML = "Panel Rotation:" + " " + compasSighn + " " + rotatValue.value + '°';
    }
    if ((rotatValue.value > 326 && rotatValue.value <= 349)) {
        compasSighn = "NNW";
        panelRotateOut.innerHTML = "Panel Rotation:" + " " + compasSighn + " " + rotatValue.value + '°';
    }

//    panelRotateOut.innerHTML = "Panel Rotation:" + " " + rotatValue.value + '°';
    compass.style.transform = 'rotate(' + (-rotatValue.value) + 'deg)';
//    console.log(rotatValue + "this is a test for rotation");
};

panelTiltOut.innerHTML = "Panel Tilt:" + " " + tar.value + '°';


panelRotateOut.innerHTML = "Panel Rotation:" + " " + rotatValue.value + '°';


var x = window.matchMedia("(min-width: 400px)");



tar.oninput = function () {
    panelTiltOut.innerHTML = "Panel Tilt:" + " " + tar.value + '°';

    if (x.matches) {



        if (tar.value === "5") {
            roofStyle0.style = "display:block; position:absolute; bottom:267px;";
            roofStyle10.style = "display:none; ";
        }


        if (tar.value === "10") {
            roofStyle0.style = "display:none";
            roofStyle10.style = "display:block; position:absolute; bottom:277px;  ";
            roofStyle12.style = "display:none; ";

        }
        if (tar.value === "15") {
            roofStyle10.style = "display:none";
            roofStyle12.style = "display:block; position:absolute; bottom:277px;  ";
            roofStyle15.style = "display:none; ";

        }



        if (tar.value === "20") {
            roofStyle12.style = "display:none";
            roofStyle15.style = "display:block; position:absolute; bottom:278px;  ";
            roofStyle20.style = "display:none; ";

        }
        if (tar.value === "25") {
            roofStyle15.style = "display:none";
            roofStyle20.style = "display:block; position:absolute; bottom:278px;  ";


        }
    } else {


        if (tar.value === "5") {
            roofStyle0.style = "display:block; position:absolute; bottom:357px;";
            roofStyle10.style = "display:none; ";
        }


        if (tar.value === "10") {
            roofStyle0.style = "display:none";
            roofStyle10.style = "display:block; position:absolute; bottom:362px;  ";
            roofStyle12.style = "display:none; ";

        }
        if (tar.value === "15") {
            roofStyle10.style = "display:none";
            roofStyle12.style = "display:block; position:absolute; bottom:362px;  ";
            roofStyle15.style = "display:none; ";

        }



        if (tar.value === "20") {
            roofStyle12.style = "display:none";
            roofStyle15.style = "display:block; position:absolute; bottom:362px;  ";
            roofStyle20.style = "display:none; ";

        }
        if (tar.value === "25") {
            roofStyle15.style = "display:none";
            roofStyle20.style = "display:block; position:absolute; bottom:362px;  ";


        }
    }

};



//showPosition();
//getLocation();