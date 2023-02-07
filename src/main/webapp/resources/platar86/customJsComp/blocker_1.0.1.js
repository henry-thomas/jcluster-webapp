/* global customElements */

class SMDUIBlocker extends HTMLElement {
    constructor(container) {
        super();
        if (!container) {
            throw new Error("Attaching SMDUI BLOCK to invalid object!");
        }

        if (container.smduiBlocker !== undefined) {
            return container.smduiBlocker;
        }

        this.container = container;
        container.smduiBlocker = this;


        this.container.style.position = 'relative';
        let b = this.blockDiv = document.createElement('div');
        b.style.position = 'absolute';
        b.style.width = '100%';
        b.style.height = '100%';
        b.style.opacity = '0.3';
        b.style.top = '0px';
        b.style.left = '0px';
        b.style.background = 'black';
        b.style.zIndex = '9999';
        b.classList.add("smdui-blocker");
        this.container.appendChild(b);

    }

    toggle() {

        this.blockDiv.style.display = this.blockDiv.style.display === 'block' ? 'none' : 'block';
    }
    show() {
        this.blockDiv.style.display = 'block';
    }

    hide() {
        this.blockDiv.style.display = 'none';
    }
}

customElements.define('smdui-blocker', SMDUIBlocker);