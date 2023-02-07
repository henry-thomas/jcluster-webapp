/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by Nathan, 2022
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */


/* global hh */

//We usually wrap the component in an IIFE (immediately invoked function expression),
//to hide variables and keep them private to the logic of this component.
//We expose what we need through the window object being passed as a parameter to the IIFE.
(function (root) {

    function ContextMenu(parent, conf) {
        //We should pass the HTML element itself (parent), rather than requiring
        //the developer to attach an id to the element. This makes it 
        //easier to use dynamically.
        this.conf = conf;
        if (hh.isElement(parent)) {
            this.parentEl = parent;
        } else {
            throw new Error("Context Menu requires a valid element to attach to!");
        }

        init.call(this, conf);
    }

    //Use the prototype to attach functionality that the developer will use
    //after creating the component.
    let prot = ContextMenu.prototype;

    function init(items) {

        this.isOpen = false;
        this.parentEl.oncontextmenu = function (ev) {



            ev.preventDefault();

            if (this.isOpen) {
                console.log("contextMenu already Open!!");
                return;
            } else {

                this.open();
            }


        }.bind(this);



        this.container = document.createElement("div");
        this.container.style.position = 'absolute';
        this.container.style.backgroundColor = 'red';
        this.container.style.flexDirection = 'column';
        this.container.style.left = "435px";
        this.container.style.justifyContent = 'center';
        this.container.style.zIndex = '999999';
        this.container.style.alignItems = 'center';
        this.container.style.display = 'none';
        this.container.style.backgroundColor = 'white';
        this.container.style.borderRadius = '3px';
        this.container.style.boxShadow = ' 0 2px 6px rgba(0,0,0,.2)';
        this.container.style.marginTop = '18px';

        let parent = this.parentEl.parentNode;
        parent.appendChild(this.container);

        let ul = document.createElement("ul");
        ul.style.padding = "0";
        ul.style.margin = "5px";
        this.container.appendChild(ul);

        for (let i = 0; i < items.length; i++) {
            let row = document.createElement("div");
            row.style.display = "flex";
            row.style.alignContent = "center";
            row.style.alignItems = "center";

            let item = document.createElement("li");
            item.style.listStyle = "none";
            item.style.cursor = "default";
            item.style.padding = "5px";
            item.innerHTML = items[i].label;
            item.onclick = items[i].cb;
            let icon = document.createElement("i");
            icon.classList.add("fa-solid", items[i].icon);

            ul.appendChild(row);
            row.appendChild(icon);
            row.appendChild(item);
        }

        root.addEventListener("click", function () {
            try {
                this.close();
            } catch (error) {

            }

        }.bind(this));
    }

    prot.close = function () {
        this.container.style.display = 'none';
        this.isOpen = false;

    };
//
    prot.open = function () {
        this.container.style.display = 'flex';
        this.isOpen = true;
    };

    root.ContextMenu = ContextMenu;
})(window);


// How to use

//contextMenu(
//        [
//            {label: "item1", cb: print1, icon: "fa-battery-empty"},
//            {label: "item2", cb: print2},
//            {label: "item3", cb: print3},
//            {label: "Newitem3", cb: print3},
//            {label: "Olditem3", cb: print3}],
//        "parent");
//
//
//
//function print1() {
//    console.log("this is the method item1")
//}
//function print2() {
//    console.log("this is the method item2")
//}
//function print3() {
//    console.log("this is the method item3")
//}



function contextMenu(items, targetID) {

    let target = targetID;

    target.oncontextmenu = function (e) {

        e.preventDefault();

        var childDivs = targetID.getElementsByTagName('div');


        let contextMenuOpen = document.getElementById("contextMenu");

//         this.container.classList.add('contextMenu');
        if (contextMenuOpen) {
            console.log("contextMenu already Open");
            return;
        } else {
            var offsets = element_offsets(div);
            let left = offsets.left + 260;
            let top = offsets.top;

//                        alert(e.clientX - offsets.left);
//                        alert(e.clientY - offsets.top);
            function element_offsets(e) {
                var left = 0, top = 0;
                do {
                    left += e.offsetLeft;
                    top += e.offsetTop;
                } while (e = e.offsetParent);
                return {left: left, top: top};
            }
            createContextMenu(items, left, top);
        }


    };

    function createContextMenu(items, left, top) {

        var body = document.getElementsByTagName("BODY")[0];



        let contextMenu = document.createElement("div");
        contextMenu.style.position = 'absolute';
        contextMenu.style.left = left + "px";
        contextMenu.style.top = top + "px";

        contextMenu.style.flexDirection = 'column';
        contextMenu.style.justifyContent = 'center';
        contextMenu.style.zIndex = '999999';
        contextMenu.style.alignItems = 'center';
        contextMenu.style.display = 'flex';
        contextMenu.style.backgroundColor = 'white';
        contextMenu.style.borderRadius = '3px';
        contextMenu.style.boxShadow = ' 0 2px 6px rgba(0,0,0,.2)';
        contextMenu.style.marginTop = '18px';

        contextMenu.id = "contextMenu";



//                    contextMenu.classList.add('contextMenu');

        target.appendChild(contextMenu);

        let ul = document.createElement("ul");
        ul.style.padding = "0";

        contextMenu.appendChild(ul);





        for (let i = 0; i < items.length; i++) {
            let row = document.createElement("div");
            row.style.display = "flex";
            row.style.alignContent = "center";
            row.style.alignItems = "center";



            let item = document.createElement("li");
            item.style.listStyle = "none";
            item.style.cursor = "default";
            item.style.padding = "5px";

            item.innerHTML = items[i].label;
            item.onclick = items[i].cb;
            let icon = document.createElement("i");
            icon.classList.add("fa-solid", items[i].icon);

            ul.appendChild(row);
            row.appendChild(icon);
            row.appendChild(item);



        }
        body.addEventListener("click", function () {
            try {
                contextMenu.parentNode.removeChild(contextMenu);
            } catch (error) {

            }

        });



    }

}

//
//
//            contextMenu(
//                    [
//                        {label: "Add to chart", cb: print1},
//                        {label: "item2", cb: print2},
//                        {label: "item3", cb: print3},
//                        {label: "Newitem3", cb: print3},
//                        {label: "Olditem3", cb: print3}],
//                    div);
//
//            function print1() {
//                let parent = document.getElementById("contextMenu").parentNode;
//                let childList = parent.childNodes;
//
//                console.log(childList[0].innerHTML + ":  " + childList[1].innerHTML + " " + childList[2].innerHTML);
//
//
//            }
//            function print2() {
//                console.log("this is the method item2");
//            }
//            function print3() {
//                console.log("this is the method item3");
//            }