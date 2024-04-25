/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


(function (root) {
    function JcFilterManager() {
    }

    let prot = JcFilterManager.prototype;
    prot.updateFilters = function (filtersMap) {
//            debugger;
//        this.contentP = document.querySelector('.jcFilterTab');
//        let tabPanel = new TabPanel(this.contentP, {menuItem: []});
//        let sNameFilterMap = {};
//        for (let instanceId in filtersMap) {
//            let instance = filtersMap[instanceId];
//            let tabContentP = tabPanel.addItem({label: instance.appName, id: instance.appName});
//
//            let serverName = instance.serverName;
//            if (!sNameFilterMap[serverName]) {
//                sNameFilterMap[serverName] = {};
//                let tblDiv = document.createElement('div');
//                tblDiv.id = serverName;
//               
//                hh.span(tabContentP, serverName);
//            }
//
//            let filterMap = instance.filterMap;
//            for (let filter in filterMap) {
//                let filterList = filterMap[filter];
//                sNameFilterMap[serverName][filter] = filterList;
//            }
//
////            sNameFilterMap[serverName].
//        }
    };
    addEventListener('DOMContentLoaded', (event) => {
        root.jcFilterManager = new JcFilterManager();
    });
    $(document).ready(function () {

    });
}(window));