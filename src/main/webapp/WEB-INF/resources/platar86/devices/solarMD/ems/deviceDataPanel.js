/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by platar86, 2022
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */



/* global hh, emsGuiData, mainUtils, mu, dm */


function DeviceDataPanel(sn, devData) {
    var deviceTypeConnectionStrMap = {
        1: 'gridConnections',
        2: 'genConnections',
        3: 'renewableConnections',
        4: 'storageConnections',
        5: 'loadConnections'
    };

    this.card = null;
    this.compCont = {};
    this.data = {};



    Object.defineProperty(this, 'connected', {
        set: function (state) {
            if (this.data.connected !== state) {
                this.data.connected = state;
                if (state) {
                    this.htmlEl.connIcon.classList.remove('fa-unlink');
                    this.htmlEl.connIcon.classList.add('fa-link');
                    this.htmlEl.connIcon.style.color = '#00ff00';
                } else {
                    this.htmlEl.connIcon.classList.add('fa-unlink');
                    this.htmlEl.connIcon.classList.remove('fa-link');
                    this.htmlEl.connIcon.style.color = '#ffbc00';
                }
            }

        },
        get: function () {
            return  this.data.connected;
        }
    });

    Object.defineProperty(this, 'displayName', {
        set: function (siaplayName) {
//                this.data.unit = val;
            this.htmlEl.name.textContent = siaplayName;
        },
        get: function () {
            return this.htmlEl.name.textContent;
        }
    });

    DeviceDataPanel.prototype.setCompText = function (compName, text, opacity) {
        if (this.htmlEl[compName]) {
            this.htmlEl[compName].textContent = text;

            if (opacity !== undefined) {
                this.htmlEl[compName].style.opacity = opacity;
            }
        }
    };

    function updateFlags(flags) {
        if (flags & (1 << 1)) {
            this.setCompText('flag2', "NP", 1); //min setpoint power limit
        } else if (flags & (1 << 2)) {
            this.setCompText('flag2', "XP", 1); //max setpoint power limit
        } else if (flags & (1 << 14)) {
            this.setCompText('flag2', "ND", 1); //max setpoint power limit
        } else if (flags & (1 << 15)) {
            this.setCompText('flag2', "XD", 1); //max setpoint power limit
        } else {
            this.setCompText('flag2', "_", 0.3);
        }

        if (flags & (1 << 3)) {
            this.setCompText('flag3', "NC", 1); //min setpoint capacity limit
        } else if (flags & (1 << 4)) {
            this.setCompText('flag3', "XC", 1);//max setpoint capacity limit
        } else {
            this.setCompText('flag3', "_", 0.3);
        }

        if (flags & (1 << 5)) {
            this.setCompText('flag4', "E", 1); //grop equalization
        } else {
            this.setCompText('flag4', "_", 0.3);
        }
        if (flags & (1 << 6)) {
            this.setCompText('flag5', "L", 1);//low priority setpoint as target
        } else {
            this.setCompText('flag5', "_", 0.3);
        }
        //flag 6 still empty


        //dev Specific flags
        if (flags & (1 << 16)) {
            this.setCompText('flag6', "CC", 1); //DEVFLAG_STLIMIT_CHARGE_CURRENT_BIT
        } else if (flags & (1 << 17)) {
            this.setCompText('flag6', "CV", 1); //DEVFLAG_STLIMIT_CHARGE_VOLTAGE_BIT 17
        } else if (flags & (1 << 18)) {
            this.setCompText('flag6', "CP", 1); //DEVFLAG_STLIMIT_CHARGE_CAPACITY_BIT 18
        } else if (flags & (1 << 19)) {
            this.setCompText('flag6', "DC", 1); //DEVFLAG_STLIMIT_DISCHARGE_CURRENT_BIT 19
        } else if (flags & (1 << 20)) {
            this.setCompText('flag6', "DV", 1); //DEVFLAG_STLIMIT_DISCHARGE_VOLTAGE_BIT 20
        } else if (flags & (1 << 21)) {
            this.setCompText('flag6', "DP", 1); //DEVFLAG_STLIMIT_DISCHARGE_CAPACITY_BIT 21
        } else if (flags & (1 << 22)) {
            this.setCompText('flag6', "CL", 1); //DEVFLAG_DEVLIMIT_CHARGE_BIT 22
        } else if (flags & (1 << 23)) {
            this.setCompText('flag6', "DL", 1); //DEVFLAG_DEVLIMIT_DISCHARGE_BIT 23

        } else {
            this.setCompText('flag6', "_", 0.3);
        }

    }

    function updatePsp(idx, power, duration) {
        let spTxt = 'SP[';
        if (isNaN(idx)) {
            idx = -2;
        }

        if (idx === -1) {
            spTxt += 'D';
        } else {
            spTxt += (idx + 1);
        }
        spTxt += ']: ';
        spTxt += (power / 1000).toFixed(1) + 'kW ';



        if (duration > 0) {
            spTxt += mainUtils.getTimeFromSeconds(duration);
        } else {
            spTxt += '--days --hr --min';
        }

        this.setCompText('sp', spTxt);
    }

    function initUi(sn, data) {
        this.card = hh.div(null, 'cardContainer');
        let svg = document.getElementById('svgEmsDevDataCard').cloneNode(true);
        let cont = hh.div(this.card, 'smdui-emsDataDevCard');

        this.sn = sn;
        let devType = this.devType = data.devType;
        let c = this.htmlEl = {};

//        c.connIconR = hh.el(cont, 'span', 'ddc-connIcon');
//        c.connIconR.textContent = "R";
        c.connIcon = hh.el(cont, 'i', 'fa fa-unlink ddc-connIcon');
        c.connIcon.style.color = '#00ff00';
        c.prior = hh.span(cont, 'HPXxX', 'ddc-priorLabel');
        c.ud = hh.span(cont, 'UD', 'ddc-udLabel');


        c.sn = hh.span(cont, sn, 'ddc-snLabel');
        c.name = hh.span(cont, sn, 'ddc-nameLabel');

        c.sp = hh.span(cont, 'SP[-]: ---kW --days --hr --min', 'ddc-spLabel');

        c.configButton = hh.el(cont, 'i', 'fa fa-cog ddc-confBut');
        c.configButton.onclick = onConfigButtonClick.bind(this);

        //icon: 
        if (devType === 1 || devType === 2) {
            c.icon = document.getElementById('devIconMeter').cloneNode(true);
        } else if (devType === 3) {
            c.icon = document.getElementById('devIconPv').cloneNode(true);
        } else if (devType === 4) {
            c.icon = document.getElementById('devIconBat').cloneNode(true);
            c.iconPer = hh.span(cont, '---%', 'ddc-iconPercent');
        }
        c.icon.classList.add('ddc-icon');
        cont.appendChild(c.icon);

        c.targetLabel = hh.span(cont, 'EMS Target:', 'ddc-vLabel', 'grid-area: trgLabel');
        c.targetValue = hh.span(cont, '150.0', 'ddc-vValue', 'grid-area: trgValue');
        c.targetUnit = hh.span(cont, 'kW', 'ddc-vUnit', 'grid-area: trgUnit');

        c.actualLabel = hh.span(cont, 'Actual:', 'ddc-vLabel', 'grid-area: actLabel');
        c.actualValue = hh.span(cont, '150.0', 'ddc-vValue', 'grid-area: actValue');
        c.actualUnit = hh.span(cont, 'kW', 'ddc-vUnit', 'grid-area: actUnit');

        c.diffLabel = hh.span(cont, '', 'ddc-vLabel', 'grid-area: diffLabel');
        c.diffValue = hh.span(cont, '150.0', 'ddc-vValue', 'grid-area: diffValue');
        c.diffUnit = hh.span(cont, 'kW', 'ddc-vUnit', 'grid-area: diffUnit');

        let flagCont = hh.div(cont, 'ddc-flagCont', 'grid-area: flags');
        for (var i = 1; i < 7; i++) {
            let flagItem = c['flag' + i + '_cont'] = hh.div(flagCont, 'ddc-flagCont', 'grid-area: flags');
//            c['flag' + i] = hh.span(flagCont, '_', 'ddc-flag ddc-flagDisabled', 'grid-area: flags');
            c['flag' + i] = hh.span(flagItem, '_', 'ddc-flag ddc-flagDisabled', 'grid-area: flags');
            c['flag' + i].style.opacity = 0.3;
        }

//        hh.addTooltip(flagCont, '<strong>CC</strong> Charge Current Limit ');
//
//        this.tooltipTitle = new SMDUITooltipJs(c['flag1_cont'], {
//            showDelay: 1000, html:
//                    '\
//                    <strong>D</strong> - Device is disabled in EMS param. <br>\n\
//                    <strong>I</strong> - Device is disabled from Input state <br>\n\
//                    <strong>S</strong> - Device is stoped <br>\n\
//                    '
//        });
//        this.tooltipTitle = new SMDUITooltipJs(c['flag2_cont'], {
//            showDelay: 1000, html:
//                    '\
//                    <strong>NP</strong> - EMS Minimum Power Limit. <br>\n\
//                    <strong>XP</strong> - EMS Maximum Power Limit. <br>\n\
//                    <strong>ND</strong> - Device Minimum Power Limit. <br>\n\
//                    <strong>XD</strong> - Device Maximum Power Limit. <br>\n\
//                    <strong>NA</strong> - Device Absolute Minimum Power Limit. <br>\n\
//                    <strong>XA</strong> - Device Absolute Maximum Power Limit. <br>\n\
//                    '
//        });
//        this.tooltipTitle = new SMDUITooltipJs(c['flag6_cont'], {
//            showDelay: 1000, html:
//                    '\
//                    <strong>CC</strong> - Charge Current Limit <br>\n\
//                    <strong>CV</strong> - Charge Voltage Limit <br>\n\
//                    <strong>CP</strong> - Charge Capacity Limit <br>\n\
//                    <strong>DC</strong> - Discharge Current Limit <br>\n\
//                    <strong>DV</strong> - Discharge Voltage Limit <br>\n\
//                    <strong>DP</strong> - Discharge Capacity Limit <br>\n\
//                    '
//        });

        svg.classList.add('devPanelSvg');
    }

    function onConfigButtonClick() {
        let devTpyeCon = deviceTypeConnectionStrMap[this.devType];

        if (devTpyeCon === undefined) {
            mu.showErrorMessage('Can not show config! ');
            return;
        }

        if (!dm.selected.param || !dm.selected.param[devTpyeCon]) {
            mu.showErrorMessage('Parameter for devices not loaded yet! ');
            return;
        }

        if (!dm.selected.param[devTpyeCon][this.sn]) {
            mu.showErrorMessage('Parameter for devices ' + this.sn + ' not loaded yet! ');
            return;
        }

        let param = dm.selected.param[devTpyeCon][this.sn];

        if (this.confDialog === undefined) {
            this.confDialog = new EmsDevParamDialog({
                param: param,
                devType: this.devType,
                devTpyeCon: devTpyeCon,
                panelCard: this,
                serial: this.sn,
                displayName: this.displayName
            });
        }
        this.confDialog.show();
    }

    DeviceDataPanel.prototype.addOnRemoveCb = function (fn) {
        this.onRemove = fn;
    };

    DeviceDataPanel.prototype.updateData = function (devData) {
//        console.log(devData.flag, devData.data.stateFlag);
        let c = this.htmlEl;
//        debugger;
        let data = devData.data;

        if (devData.devData && devData.devData.spInUse !== 1) {
            //for capacity Setpoint
        }

        updatePsp.call(this, devData.pspIdx, devData.psp, devData.pspEndPer);


        let powerSetpoint = devData.psp;
        if (devData.data && !isNaN(devData.data.applyedSumPowerW)) {
            powerSetpoint = devData.data.applyedSumPowerW;
        }

        c.targetValue.textContent = (powerSetpoint / 1000).toFixed(1);

        c.actualValue.textContent = (data.actualSumPowerW / 1000).toFixed(1);

        let diff;
        if (powerSetpoint < 0) {
            diff = powerSetpoint - data.actualSumPowerW;
        } else {
            diff = data.actualSumPowerW - powerSetpoint;
        }
        if (diff !== 0) {
            c.diffValue.textContent = (diff > 0 ? '+' : '') + (diff / 1000).toFixed(1);
        } else {
            c.diffValue.textContent = '--.-';

        }


        updateFlags.call(this, devData.flag);

        let prLabel = '';

        if (devData.ud) {
            c.ud.classList.remove('ddc-udLabelDisabled');
            if (devData.currentUd) {
                c.ud.classList.add('ddc-udLabelActive');
            } else {
                c.ud.classList.remove('ddc-udLabelActive');
            }

        } else {
            c.ud.classList.add('ddc-udLabelDisabled');
            prLabel += devData.hpd ? 'H' : 'L';

            if (devData.currentUd) {

            }
        }

        prLabel += 'P' + devData.priority;
        this.setCompText('prior', prLabel);

//        this.setCompText('flag1', data.running ? '_' : 'S', 1);
//        this.setCompText('flag1', data.running ? 'R' : 'S', data.running ? 1 : 0.3);

        if (devData.flag & (1 << 7)) {
            this.setCompText('flag1', "D", 1);//low priority setpoint as target
            c.icon.style.opacity = 0.4;
        } else if (devData.flag & (1 << 8)) {
            this.setCompText('flag1', "I", 1);
            c.icon.style.opacity = 0.4;
        } else if (!data.running) {
            this.setCompText('flag1', "S", 1);
            c.connIcon.style.color = '#cdcdcd';
            c.icon.style.opacity = 0.4;
        } else {
            c.connIcon.style.color = '#00ff00';
            this.setCompText('flag1', "_", 0.4);
            c.icon.style.opacity = 1;
        }

        if (devData.flag & (1 << 9)) {
            c.sp.style.opacity = 0.3;
        } else {
            c.sp.style.opacity = 1;
        }

        if (data.running) {
            c.targetValue.style.opacity = 1;
        } else {
            c.targetValue.style.opacity = 0.3;
        }

        this.connected = data.deviceConnected;

        if (this.devType === 4 && devData.data && !isNaN(devData.data.storageCapacityPer)) {
            if (this.htmlEl.iconPer) {
                this.htmlEl.iconPer.textContent = devData.data.storageCapacityPer.toFixed(0) + '%';
            }
        }

    };
    initUi.call(this, sn, devData);
}
