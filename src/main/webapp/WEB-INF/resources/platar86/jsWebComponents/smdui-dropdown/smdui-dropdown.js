/* global customElements */

class Dropdown extends HTMLElement {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.wrapper = document.createElement('div');
        this.wrapper.style.display = "flex";
        this.wrapper.style.alignItems = "center";
        this.wrapper.style.justifyContent = "Flex-end";
        this.button = hh.button(null);
        this.dropdownItemsContainer = document.createElement('div');
        this.dropdownItemsContainer.style.top ="29px";
//        this.dropdownItemsContainer.style.left= "-34px";
       
    }

    connectedCallback() {
        this.addEventListener('click', function (ev) {
            ev.preventDefault();
            if (this.querySelector('.sui-dropdown-content-opened')) {
                this.close();
            } else {
                this.open();
            }
        }.bind(this));
        this.button.classList.add('sui-instr-dropdown');
        this.button.classList.add('sui-dropdown-button');

        this.wrapper.classList.add('sui-instr-dropdown');
        this.wrapper.classList.add('sui-dropdown-wrapper');

        this.dropdownItemsContainer.classList.add('sui-instr-dropdown');
        this.dropdownItemsContainer.classList.add('sui-dropdown-content');
        this.wrapper.appendChild(this.button);
        this.wrapper.appendChild(this.dropdownItemsContainer);
        this.appendChild(this.wrapper);


        this.button.onclick = function (event) {
            if (!event.target.matches('.sui-dropdown-wrapper')) {
                let dropdowns = document.querySelectorAll('smdui-dropdown');
                for (let i = 0; i < dropdowns.length; i++) {
                    dropdowns[i].close();
                }
            }
        };

        document.onclick = function (event) {
            if (!event.target.matches('.sui-dropdown-button')) {
                let dropdowns = document.querySelectorAll('smdui-dropdown');
                for (let i = 0; i < dropdowns.length; i++) {
                    dropdowns[i].close();
                }
            }
        };

    }

    set text(text) {
        this.setAttribute('text', text);
        return this;
    }

    get text() {
        return this.getAttribute('text');
    }

    set items(items) {
        if (Array.isArray(items)) {
            this.createDropDownContent(items);
        }
    }

    get items() {
        return this.contentItems;
    }

    set type(type) {
        this.setAttribute('type', type);
        return this;
    }

    get type() {
        return this.getAttribute('type');
    }

    open() {
        this.dropdownItemsContainer.classList.add('sui-dropdown-content-opened');
    }

    close() {
        this.dropdownItemsContainer.classList.remove('sui-dropdown-content-opened');
    }

    addElementToDropdown(elObj) {

        let newObj = document.createElement('div');
        newObj.classList.add('smdui-button');
        newObj.classList.add('sui-instr-dropdown');
        newObj.classList.add('smdui-dropdown-item');
        if (elObj.name) {
            newObj.innerHTML = elObj.name;
        }

        if (elObj.cb) {
            newObj.addEventListener('click', elObj.cb);
            newObj.addEventListener('click', this.close.bind(this));
        }
        this.contentItems.push(newObj);
        this.dropdownItemsContainer.appendChild(newObj);
    }

    //?[{name: "string", cb: fn()}, {name: "string", cb: fn()}, {name: "string", cb: fn()}]*//
    createDropDownContent(contentArr) {
        this.contentItems = [];

        for (let i = 0; i < contentArr.length; i++) {
            this.addElementToDropdown(contentArr[i]);
        }

    }

    static get observedAttributes() {
        return ['text'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'text') {
            this.button.textContent = newVal;
        }
    }
}
customElements.define('smdui-dropdown', Dropdown);