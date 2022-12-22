/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2021
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 *  
 *  USAGE
 *  sortable(document.getElementById('rootElement'), {
 *   ghostClass: 'ui-widget-header',
 *   onEndCb: function(){console.log('onEnd')}
 *  }
 });
 */



/* global mu */

(function (root) {
    let SuiSort = function (rootEl, options) {
        return new sortable(rootEl, options);
    };

    //The sortable constructor
    let sortable = function (rootEl, options) {
        let dragEl;
        this.rootEl = rootEl;
        this.options = options = options || {};

//        this.elements = [];

        //Callback Arrays go here
        this.onEndCbArr = [];
        if (isFunction(this.options.onEnd)) {
            this.onEndCbArr.push(this.options.onEnd.bind(this, rootEl));
        }
        let onEndCbArr = this.onEndCbArr;

        let ghostClass = options.ghostClass = options.ghostClass || 'ui-widget-header';


        //Setting draggable on all children of the root element
        //**This is neat, using the functionality of Array.**
        //**This only works if the items are added to rootEl before set to sortable**/
        [].slice.call(rootEl.children).forEach(function (itemEl) {
            itemEl.draggable = true;
        });


        //When the element being dragged is over another sibling element, 
        //insert it before the next sibling
        function _onDragOver(evt) {
            evt.preventDefault();

            evt.dataTransfer.dropEffect = 'move';
            let target = evt.target;
            if (target && target !== dragEl && dragEl.draggable) {
                if (target.parentNode === dragEl.parentNode) {
                    if (isBefore(dragEl, target)) {
                        rootEl.insertBefore(dragEl, target);
                    } else {
                        rootEl.insertBefore(dragEl, target.nextSibling);
                    }
                }
            }
        }

        function _onDragEnd(evt) {
            console.log(evt.target);
            evt.preventDefault();

            //dropEffect gets the type of drag and drop operation
            //dropEffect value can be 'none', 'copy', 'link' or 'move'
            dragEl.classList.remove(ghostClass);
            rootEl.removeEventListener('dragover', _onDragOver, false);
            rootEl.removeEventListener('dragend', _onDragEnd, false);
//            options.onEnd(dragEl);
            sortable.onDragEnd();
        }

        sortable.onDragEnd = function () {
            mu.execCallback(onEndCbArr);
        };

        //check if el2 is before el1
        function isBefore(el1, el2) {
            let cur;
            if (el2.parentNode === el1.parentNode) {
                for (cur = el1.previousSibling; cur; cur = cur.previousSibling) {
                    if (cur === el2)
                        return true;
                }
            }
            return false;
        }

        rootEl.addEventListener('dragstart', function (evt) {
            dragEl = evt.target;

            evt.dataTransfer.effectAllowed = 'move';
            evt.dataTransfer.setData('Text', dragEl.textContent);

            rootEl.addEventListener('dragover', _onDragOver, false);
            rootEl.addEventListener('dragend', _onDragEnd, false);

            //setTimeout, otherwise drag image also gets ghost class
            setTimeout(function () {
                dragEl.classList.add(ghostClass);
            }, 0);

        }, false);
    };


    Object.defineProperty(SuiSort.prototype, "onEnd", {
        set: function (fn) {
            if (isFunction(fn)) {
                this.onEndCbArr.push(fn);
            }
        },
        get: function () {
            return sortable.onDragEnd;
        }
    });

    //get the ordered elements in parent
    Object.defineProperty(SuiSort.prototype, "elements", {
        get: function () {
            let children = this.rootEl.children;
            let elemArr = [];
            for (let i = 0; i < children.length; i++) {
                if (typeof (children[i]) === 'object') {
                    elemArr.push(children[i]);
                }
            }
            return elemArr;
        }
    });

    SuiSort.fn = SuiSort.prototype;

    sortable.prototype = SuiSort.prototype;
    root.suiSort = SuiSort;

}(window));











//function testSort() {
//    let panel = document.querySelectorAll('.smdui-tabPanel-menu');
//
//    window.testSort = suiSort(panel[0]);
//
////    panel[0].lastChild.draggable = false;
//}