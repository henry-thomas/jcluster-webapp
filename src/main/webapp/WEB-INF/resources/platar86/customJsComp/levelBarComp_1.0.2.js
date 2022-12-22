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
function LevelBarComp(first, qty, xOffset, opacity) {

    this.playing = false;
    this.futureLevel = 0;
    this.actualLevel = 0;
    this.arr = [];
    this.barCount = 25;
    this.maxValue = 1;

    xOffset = xOffset || 7;
    opacity = opacity || 0;
    this.barCount = qty;

    this.arr.unshift(first);
    var current = first;
    this.arr.push(first);
    current.style('opacity', 0);
    current.lbc = this;
    for (var i = 0; i < this.barCount; i++) {
        var clone = current.clone();
        clone.lbc = this;
        clone.dx(xOffset);
        clone.style('opacity', 0);
        this.arr.push(clone);
        current = clone;
    }
    return this;
}
;

LevelBarComp.prototype.play = function () {
    // do work
    if (this.actualLevel !== this.futureLevel) {
        this.playing = true;
        // console.log('start new animation');
        if (this.futureLevel > this.actualLevel) {
            var dot = this.arr[this.actualLevel + 1];
            dot.animate(200).style('opacity', 1).after(function () {
                this.lbc.actualLevel++;
                this.lbc.play();
            });
        } else {
            var dot = this.arr[this.actualLevel];
            dot.animate(200).style('opacity', 0).after(function () {
                this.lbc.actualLevel--;
                if (this.lbc.actualLevel <= 0) {
                    this.lbc.actualLevel = 0;
                }
                this.lbc.play();
            });
        }
    } else {
        // console.log('END new animation');
    }
    return this;
};

LevelBarComp.prototype.setMaxLevel = function (maxValue) {
    if (!isNaN(maxValue)) {
        if (maxValue !== this.maxValue) {
            this.maxValue = maxValue;
        }
    }
    return this;
};
LevelBarComp.prototype.setLevel = function (val) {
    if (isNaN(val)) {
        val = 0;
    }
    if (val > this.maxValue) {
        val = this.maxValue;
    }
    if (val < 0) {
        val = 0;
    }
    var valP = val / this.maxValue;
    this.futureLevel = (Number(valP * this.barCount)).toFixed(0);
    this.futureLevel = Number(this.futureLevel);
    if (this.futureLevel !== this.level) {
        if (!isNaN(val)) {
            if (this.futureLevel < 0) {
                this.futureLevel = 0;
            }
            if (this.futureLevel > this.barCount) {
                this.futureLevel = this.barCount;
            }
            this.play();
        } else {
            throw  console.log("level is NaN");
        }
    }
    return this;
};
