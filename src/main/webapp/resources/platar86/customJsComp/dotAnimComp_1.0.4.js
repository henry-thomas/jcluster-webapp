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

/* 
 EXAMPLE CREATING ANIMATION anim
 *var anim = new DotAnimComp('axpertKingIconImg',{
 *                dotGradient: redGradient,
 *                startX: 20,
 *                startY: 20,
 *                maxSpeed: 5000,
 *                minSpeed: 200,
 *                dotCount: 2,
 *                shape: {
 *                    minHeight: 5,
 *                    maxHeight: 20,
 *                    minWidth: 5,
 *                    maxWidth: 20,
 *                    name: 'rect'
 *                },
 *                anim: [
 *                    {x: 30}, {x: 17, y: 29}, {x: 37}, {x: 20}
 *                ]
 *            });
 */

/* global SVG */
(function (root) {
    function DotAnimComp(svgContainer, conf) {
        this.arr = [];
        this.container = SVG.get(svgContainer);
//    this.dotColor = null;
        this.dotGradient = null;
        this.maxLevel = 0;
        this.actualLevel = 0;
        this.enabled = false;
        this.paused = false;
        if (conf) {
            init.call(this, conf);
        } else {
            throw new Error("Config missing. Example of using DotAnimComp: available in js file");
        }
        return this;
    }

    function init(conf) {
        document.addEventListener("visibilitychange", onVisibilityChange.bind(this));
        this.maxLevel = conf.maxLevel || 2000;
        this.maxSpeed = conf.maxSpeed || 2500;
        if (this.maxSpeed < 200) {
            this.maxSpeed = 200;
        }

        this.minSpeed = conf.minSpeed || 1000;
        if (this.minSpeed < 500) {
            this.minSpeed = 500;
        } else if (this.minSpeed > this.maxSpeed) {
            this.minSpeed = this.maxSpeed;
        }

        this.dotCount = conf.dotCount || 2;
        if (this.dotCount < 0.1) {
            this.dotCount = 0.1;
        }
        this.dotProp = {
            startX: conf.startX,
            startY: conf.startY,
            dotColor: conf.dotColor,
            anim: conf.anim,
            dotGradient: conf.dotGradient,
            shape: conf.shape,
            powerRatio: conf.speedRatio || 7
        };
        this.shape = conf.shape || {};
        this.shape.minHeight = conf.shape.minHeight || 10;
        this.shape.maxHeight = conf.shape.maxHeight || 70;
        this.shape.minWidth = conf.shape.minWidth || 10;
        this.shape.maxWidth = conf.shape.maxWidth || 70;
        this.animLength = 0;
        recalculateDotProp.call(this);
        this.enabled = false;
        this.mustUpdateDelay = false;
        this.timerDelay = this.dotProp.delay / this.dotCount;
        let animIntervalFn = function () {

            playNextDot.call(this);
            if (this.mustUpdateDelay) {
                this.mustUpdateDelay = false;
                window.clearInterval(this.timerID);
                this.timerID = setInterval(animIntervalFn, this.timerDelay);
            }
        }.bind(this);
        this.timerID = setInterval(animIntervalFn, this.timerDelay);
    }

    function onVisibilityChange() {
        if (document.visibilityState === 'visible') {
            this.setLevel(this.actualLevel);
        } else {
            this.enabled = false;
//            console.log('visibilityOff');
        }
    }

    function calculateDotParam() {
//calculate end points for endpoints for x y and stage length
        let x = this.dotProp.startX;
        let y = this.dotProp.startY;
        if (Array.isArray(this.dotProp.anim)) {
            this.animLength = 0;
            for (var i = 0; i < this.dotProp.anim.length; i++) {
                let animStage = this.dotProp.anim[i];
//                animStage.length;

                animStage.startX = x;
                animStage.startY = y;
                if (!isNaN(animStage.x) && isNaN(animStage.y)) {
                    x += animStage.x;
                    animStage.length = animStage.x;
                } else if (!isNaN(animStage.y) && isNaN(animStage.x)) {
                    y += animStage.y;
                    animStage.length = animStage.y;
                } else if (!isNaN(animStage.y) && !isNaN(animStage.x)) {
                    y += animStage.y;
                    x += animStage.x;
                    animStage.length = Math.pow(Math.abs(animStage.x), 2);
                    animStage.length += Math.pow(Math.abs(animStage.y), 2);
                    animStage.length = Math.sqrt(animStage.length);
                } else {
                    animStage.length = 10; //safe value in case no x or y are set
                }

                animStage.endX = x;
                animStage.endY = y;
                this.animLength += animStage.length;
            }
            this.dotProp.endX = x;
            this.dotProp.endY = y;
            //calc Stage time in percents
            for (var i = 0; i < this.dotProp.anim.length; i++) {
                let animStage = this.dotProp.anim[i];
                animStage.ratio = (animStage.length / this.animLength);
            }
        } else {
            throw new Error("Animation Array missing. Example of using DotAnimComp: available in js file");
        }
    }

    function createDot() {
//    console.log('Create new Anim comp');
        if (this.dotProp.shape !== undefined) {
            switch (this.dotProp.shape.name) {
                case 'rect':
                    {
                        var dot = this.container
                                .rect(this.dotProp.shape.height, this.dotProp.shape.width)
                                .opacity(0);
                        if (this.dotProp.dotGradient !== undefined) {
                            dot.style({'fill': this.dotProp.dotGradient});
                        }
                        dot.dac = this;
                        dot.stage = 0;
                        dot.prop = this.dotProp;
                        return dot;
                    }
                    break;
            }
        }
    }

    function recalculateDotProp() {
        calculateDotParam.call(this);
        var value = this.actualLevel;
        if (value === 0) {
            value = 1;
        }
        if (this.maxLevel < value) {
            this.maxLevel = value;
        }

        var levelRatio = (value / this.maxLevel);
        this.dotProp.levelRatio = levelRatio;
        this.dotProp.sizeH = (this.shape.minHeight - ((this.shape.minHeight - this.shape.maxHeight) * levelRatio));
        this.dotProp.sizeW = (this.shape.minWidth - ((this.shape.minWidth - this.shape.maxWidth) * levelRatio));
        this.dotProp.delay = (this.maxSpeed - ((this.maxSpeed - this.minSpeed) * levelRatio));
        for (var i = 0; i < this.dotProp.anim.length; i++) {
            let stage = this.dotProp.anim[i];
            stage.delay = Math.abs(this.dotProp.delay * stage.ratio);
        }

        return this.dotProp;
    }

    function  onDotStageComplete() {
        let dot = this;
        if (!this.dac.enabled || this.dac.paused) {
            dot.active = false;
            dot.opacity(0);
            dot.stage = 0;
            return;
        }
        let reverse = dot.dac.reverse;
        if (!reverse) {
            if (dot.isInit) {
                dot.stage = 0;
                dot.active = true;
                dot.isInit = false;
            } else {
                dot.stage++;
            }
            if (dot.stage >= (dot.prop.anim.length)) {
                dot.active = false;
                dot.opacity(0);
                return;
            }
        } else {
            if (dot.isInit) {
                dot.stage = dot.prop.anim.length - 1;
                dot.active = true;
                dot.isInit = false;
            } else {
                dot.stage--;
            }
            if (dot.stage < 0) {
                dot.active = false;
                dot.opacity(0);
                dot.stage = 0;
                return;
            }
        }

        if (dot.active) {
//            let debug = 'Stage: ' + dot.stage + ', ';

            let stage = dot.prop.anim[dot.stage];
            dot.height(dot.prop.sizeH);
            dot.width(dot.prop.sizeW);
            if (!reverse) {
                dot.center(stage.startX, stage.startY);
            } else {
                dot.center(stage.endX, stage.endY);
            }

//hide if mark as hidden
            if (stage.hidden) {
//                debug += 'Hidden ';
                dot = dot.opacity(0);
            } else {
//                debug += 'Visisble ';
                dot = dot.opacity(1);
            }

            dot = dot.animate(stage.delay);
            if (stage.x) {
                let move = reverse ? (stage.x * -1) : stage.x;
//                debug += 'X: ' + move + ', ';
                dot = dot.dx(move);
            }
            if (stage.y) {
                let move = reverse ? (stage.y * -1) : stage.y;
//                debug += 'Y: ' + move + ', ';
                dot = dot.dy(move);
            }

//            console.log('Dot Move ' + debug);
            dot.after(onDotStageComplete);
        }
    }

    function  playNextDot() {
//        debugger;
        if (this.enabled && this.paused === false) {
            var dot = getDot.call(this);
            if (dot) {
                dot.isInit = true;
                onDotStageComplete.call(dot);
            }
        }
        return this;
    }

    function getDot() {
        for (var i = 0; i < this.arr.length; i++) {
            if (this.arr[i].active === false) {
                return this.arr[i];
            }
        }

        if (this.arr.length > 200) {
            return null;
        }

        var dot = createDot.call(this);
        dot.active = false;
        this.arr.push(dot);
        return dot;
    }

    DotAnimComp.prototype.setReverse = function (direction) {
        this.reverse = direction;
        return this;
    };
    DotAnimComp.prototype.setMaxLevel = function (maxLevel) {
        this.maxLevel = maxLevel;
        return this;
    };
    DotAnimComp.prototype.resume = function () {
        this.paused = false;
        this.enabled = false;
        this.setLevel(this.actualLevel);
        return this;
    };
    DotAnimComp.prototype.pause = function () {
        this.paused = true;
    };
    DotAnimComp.prototype.setLevel = function (level) {
        if (isNaN(level)) {
            level = 0;
        }
        if (level === 0) {
            this.enabled = false;
            return this;
        } else if (level < 0) {
            level = Math.abs(level);
            this.reverse = true;
        } else {
            this.reverse = false;
        }

        if (level > this.maxLevel) {
            level = this.maxLevel;
        }
        this.actualLevel = level;
        recalculateDotProp.call(this);
        if (!this.enabled && !this.paused && document.visibilityState === 'visible') {
            this.enabled = true;
        }

        if (this.timerDelay !== this.dotProp.delay / this.dotCount) {
            this.timerDelay = this.dotProp.delay / this.dotCount;
            this.mustUpdateDelay = true;
        }
        return this;
    };
    root.DotAnimComp = DotAnimComp;
}(window));