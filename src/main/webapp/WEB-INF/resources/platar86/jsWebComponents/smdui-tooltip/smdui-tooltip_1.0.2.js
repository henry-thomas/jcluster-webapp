/* global customElements, hh */

function SMDUITooltipJs(el, conf) {

    function showTooltip() {
        if (this.hideTimer) {
            window.clearInterval(this.hideTimer);
        }
        this.showTimer = window.setTimeout(function () {
            this.tooltip.classList.add('smdui-tooltipItemShow');
            this.showTimer = null;
        }.bind(this), this.conf.showDelay );
    }

    function hideTooltip() {
        if (this.showTimer) {
            window.clearInterval(this.showTimer);
        }
        this.hideTimer = window.setTimeout(function () {
            this.tooltip.classList.remove('smdui-tooltipItemShow');
            this.hideTimer = null;
        }.bind(this), 100);
    }

    if (!hh.isElement(el)) {
        throw  Error('SMDUITooltip Require first argument as DOM object');
    }

    this.conf = conf || {};
    this.conf.showDelay = this.conf.showDelay || 500;
    this.cont = document.createElement('div');
    this.cont.classList.add('smdui-tooltipCont');
    el.prepend(this.cont);

//    this.subCont = hh.div(this.cont);
//    this.subCont.style.overflow = 'hidden';

    this.tooltip = hh.span(this.cont, null, 'smdui-tooltipItem');
    if (this.conf.text) {
        this.tooltip.textContent = this.conf.text;
    } else if (this.conf.html) {
        this.tooltip.innerHTML = this.conf.html;
    }

    el.addEventListener('mouseenter', showTooltip.bind(this));
    el.addEventListener('mouseleave', hideTooltip.bind(this));
    el.addEventListener('touchstart', showTooltip.bind(this));
    el.addEventListener('touchend', hideTooltip.bind(this));

    Object.defineProperty(this, 'text', {
        set: function (val) {
            this.tooltip.textContent = val;
        },
        get: function () {
            return this.tooltip.textContent;
        }
    });
    Object.defineProperty(this, 'html', {
        set: function (val) {
            this.tooltip.innerHTML = val;
        },
        get: function () {
            return this.tooltip.innerHTML;
        }
    });
}

