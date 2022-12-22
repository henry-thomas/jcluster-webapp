/* global customElements */

class SMDUITooltip extends HTMLElement {
    constructor(el, conf) {
        super();
        this._tooltipVisible = false;
        this.init();
        if (conf) {

            if (el) {
                this.element = el;
            }
            if (conf.text) {
                this.text = conf.text;
            }
            if (conf.width) {
                this.style.width = conf.width;
            }
        }
    }

    init() {

        this.tooltipContainer = document.createElement('div');
    }

    set text(text) {
        if (text) {
            this.setAttribute('tt-text', text);
        } else if (this.hasAttribute('tt-text')) {
            this._tooltipText = this.getAttribute('tt-text') || '';
        } else {
            this._tooltipText = '';
        }
    }

    get text() {
        return this.getAttribute('tt-text');
    }

    get target() {
        return this._tooltipTarget;
    }

    set element(element) {
        this._tooltipTarget = element;
//        if (element.parentElement && element.parentElement !== this) {
//        }
        element.appendChild(this);
        element.classList.add('smdui-tooltip');
//        this.appendChild(element);
    }

    connectedCallback() {
//        this.appendChild(this._tooltipTarget);
        this._tooltipTarget.addEventListener('mouseenter', this._showTooltip.bind(this));
        this._tooltipTarget.addEventListener('mouseleave', this._hideTooltip.bind(this));
        this._tooltipTarget.addEventListener('touchstart', this._showTooltipTouch.bind(this), {passive: true});
        this._tooltipTarget.addEventListener('touchend', this._hideTooltip.bind(this));
        this.classList.add('sui-tt');
//        this.appendChild(this.tooltipContainer);
        this._render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }
        if (name === 'tt-text') {
            this._tooltipText = newValue;
        }
    }

    static get observedAttributes() {
        return ['tt-text'];
    }

    disconnectedCallback() {
        this._tooltipTarget.removeEventListener('mouseenter', this._showTooltip);
        this._tooltipTarget.removeEventListener('mouseleave', this._hideTooltip);
    }

    _render() {
        this.textContent = this._tooltipText || "";
        if (this._tooltipVisible) {
            this.classList.add('sui-tt-open');

        } else {
            if (this)
                this.classList.remove('sui-tt-open');
        }
    }

    _showTooltip() {
        this._tooltipVisible = true;
        this._render();
    }
    _showTooltipTouch(ev) {
        this._tooltipVisible = true;
        this._render();
    }
    _hideTooltip() {
        this._tooltipVisible = false;
        this._render();
    }
}
customElements.define('smdui-tooltip', SMDUITooltip);