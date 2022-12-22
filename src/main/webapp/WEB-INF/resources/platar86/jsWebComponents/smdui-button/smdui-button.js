/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2020
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */

/* global customElements, sui */

class Button extends HTMLElement {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.tooltipEl = sui.tooltip();
//        this.button = document.createElement('div');
    }

    connectedCallback() {
        this.classList.add('sui-btn');
//        let btnContent = document.createElement('span');

//        this.appendChild(this.button);

        if (!this.hasAttribute('type')) {
            this.setAttribute('type', 'small--button');
        }
//            this.button.classList.add('ui-button');
    }

    set tooltip(tooltip) {
        if (this.tooltipEl) {
            this.tooltipEl.text = tooltip;
            this.tooltipEl.element = this;
        }
    }

    set text(text) {
        this.setAttribute('text', text);
        this.innerHTML = text;
    }

    get text() {
        return this.getAttribute('text');
    }

    set type(type) {
        this.setAttribute('type', type);
    }

    get type() {
        return this.getAttribute('type');
    }

    static get observedAttributes() {
        return ['text', 'disabled', 'type'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'text') {
            if (this.hasAttribute('text')) {
                this.innerHTML = newVal;
            }
        }
        if (name === 'disabled') {
            if (newVal === 'true') {
                this.setAttribute('disabled', newVal);
            } else {
                this.removeAttribute('disabled');
            }
        }
        if (name === 'type') {
            this.applyType(newVal);
        }
    }

    applyType(type) {
        if (this.classList.length > 0) {
            for (let i = 0; i <= this.classList.length; i++) {
                this.classList.remove(this.classList[i]);
            }
        }

        switch (type) {
            case 'small':
                this.classList.add('sui-btn-default--button');
                this.classList.add('sui-btn');
                break;
            default:
                return;
        }
    }

}

customElements.define('smdui-button', Button);
