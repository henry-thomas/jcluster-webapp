/* global customElements */

class Button extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.init();
        this.stylesheetPath = '../../../../resources/platar86/jsWebComponents';
    }

    init() {
        this.button = document.createElement('button');
    }

    connectedCallback() {
        const linkElem = document.createElement('link'); //link for external stylesheet
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', this.stylesheetPath + '/smdui-button/smdui-button.css');
        this.shadowRoot.appendChild(linkElem);

        if (!this.hasAttribute('type')) {
            this.setAttribute('type', 'primary--button');
        }
        this.shadowRoot.appendChild(this.button);
    }

    set text(text) {
        this.setAttribute('text', text);
        this.button.innerHTML = text;

        return this;
    }

    get text() {
        return this.getAttribute('text');
    }

    set type(type) {
        this.setAttribute('type', type);
        return this;
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
                this.button.innerHTML = newVal;
            }
        }
        if (name === 'disabled') {
            if (newVal === 'true') {
                this.button.setAttribute('disabled', newVal);
            } else {
                this.button.removeAttribute('disabled');
            }
        }
        if (name === 'type') {
            this.applyType(newVal);
        }
    }

    applyType(type) {
        if (this.button.classList.length > 0) {
            for (let i = 0; i <= this.classList.length; i++) {
                this.button.classList.remove(this.button.classList[i]);
            }
        }

        switch (type) {
            case 'danger':
                this.button.classList.add('danger--button');
                break;
            case 'warning':
                this.button.classList.add('warning--button');
                break;
            case 'primary':
                this.button.classList.add('primary--button');
                break;
            case 'secondary':
                this.button.classList.add('secondary--button');
                break;
            case 'small':
                this.button.classList.add('small--button');
                break;
            default:
                return;
        }
    }

}

customElements.define('smdui-button', Button);