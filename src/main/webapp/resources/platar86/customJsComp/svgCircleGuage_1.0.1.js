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

/* global SVG */


(function (root) {
    let CircleGuage = function (compId, startingAngle = 270, conf = {}) {

        conf.tofixed = conf.tofixed || 1;
        this.formated = conf.formatter;
        this.labelId = conf.labelId;
        let labelText = SVG.get(this.labelId);

//        console.log(this.labelId);

        var circle = SVG.get(compId);
        circle.value = 0;
        circle.max = 100;
        var radius = circle.node.getAttribute('r');
        var dashArray = 2 * Math.PI * radius;
        var percentTotal = circle.value / circle.maxValue;
        var dashOffset = dashArray - (dashArray * percentTotal);
        var angle = 0;


        circle.node.setAttribute("fill", "transparent");
        circle.node.setAttribute("stroke-dasharray", dashArray);
        circle.node.setAttribute("stroke-dashoffset", dashOffset);
        circle.node.setAttribute("stroke-linecap", "butt");
        circle.node.setAttribute("transform", "rotate(" + (angle) + ")");
        circle.node.style.transition = "stroke-dashoffset 0.4s";
        circle.rotate(startingAngle);

        function formater(val) {
            return val.toFixed(conf.tofixed);
        }

        function unitFormatter(val, sigNum) {

            let valLength;
            let intLength;
            let decLength;
            val = Number(val);
            if (val.toString().includes(".") || val.toString().includes(",")) {
                valLength = val.toString().length - 1;
                intLength = parseInt(val).toString().length;
            } else {
                valLength = val.toString().length;
                intLength = valLength;
                decLength = 0;
            }
            if (valLength === sigNum) {
                return val;
            }
            if (intLength >= sigNum) {
                return val.toFixed(0);
            } else {
                return val.toFixed(1);
            }
        }

        Object.defineProperty(circle, 'labelVal', {
            set: function (val) {
                if (conf.formatter) {


                    labelText.plain(formater(val));
                } else {
                    labelText.plain(val);

                }


            },
            get: function () {
                return circle.value;
            }

        });

        Object.defineProperty(circle, 'val', {
            set: function (val) {
                if (isNaN(val)) {
                    val = 0;
                }
                if (val < 5) {
                    val = 5;
                }
                percentTotal = val / circle.max;
                if (val >= 100) {
                    percentTotal = 1;
                }
                dashOffset = dashArray - (dashArray * percentTotal);
                circle.attr({
                    "stroke-dasharray": dashArray,
                    "stroke-dashoffset": dashOffset
                });
                circle.value = val;
            },
            get: function () {
                return circle.value;
            }

        });
        return circle;
    };

    root.CircleGuage = CircleGuage;
}(window));
