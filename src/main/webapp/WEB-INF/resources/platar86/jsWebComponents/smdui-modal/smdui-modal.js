/* global customElements */

class Modal extends HTMLElement {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.backDrop = document.createElement('div');
        this.backDrop.classList.add('sui-modal-backdrop');

        this.modal = document.createElement('div');
        this.modal.classList.add('sui-modal-modal');

        this.modal.headingDiv = document.createElement('div');
        this.modal.headingDiv.classList.add('sui-modal-header');
        this.modal.headingDiv.heading = document.createElement('span');
        this.modal.headingDiv.heading.classList.add('sui-modal-heading');
        this.modal.headingDiv.appendChild(this.modal.headingDiv.heading);

        this.modal.contentDiv = document.createElement('div');
        this.modal.contentDiv.classList.add('sui-modal-content');

        this.modal.actionsDiv = document.createElement('div');
        this.modal.actionsDiv.classList.add('sui-modal-actions');
    }

    connectedCallback() {
        this.classList.add('sui-modal');
        this.backDrop.addEventListener('click', this.close.bind(this));
        this.appendChild(this.backDrop);
        this.backDrop.appendChild(this.modal);
        this.modal.appendChild(this.modal.headingDiv);
        this.modal.appendChild(this.modal.contentDiv);
        this.modal.appendChild(this.modal.actionsDiv);
    }

    set heading(heading) {
        this.setAttribute('heading', heading);
    }

    set content(content) {
        if (typeof(content) === 'object') {
            this.setContent(content);
        }
    }

    setContent(el) {
        try {
            console.log(el);
            if (this.modal.contentDiv.lastChild) {
                this.modal.contentDiv.removeChild(this.modal.contentDiv.lastChild);
            }
            this.modal.contentDiv.appendChild(el);
        } catch (e) {
            console.log(e + '- Dialog content should be an element with one parent, but can have nested elements');
        }
    }

    open() {
        this.classList.add('sui-modal-opened');
        this.modal.style.left = (innerWidth - (this.modal.clientWidth + innerWidth) / 2).toString() + "px";
        this.modal.style.top = ((this.modal.clientHeight + innerHeight) / 3).toString() + "px";
    }

    close() {
        this.classList.remove('sui-modal-opened');
    }

    static get observedAttributes() {
        return ['heading'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'heading') {
            this.modal.headingDiv.heading.innerHTML = this.getAttribute('heading');;
        }
    }
}
customElements.define('smdui-modal', Modal);