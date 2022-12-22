/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by henry, 2022
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 South Africa
 *  Phone: 021 555 2181
 *  
 */
/* global instDevUtil, hh, wsm, mu */

(function (root) {
    let InstDevUtil = function () {
        this.detailsDialogMap = {};
        init.call(this);
    };

    let prot = InstDevUtil.prototype;

    prot.openDetailsDialog = function (devDetails) {
        let serial = devDetails["Serial Number"];
        if (this.detailsDialogMap[serial]) {
            this.detailsDialogMap[serial].open();
            return;
        }
        this.detailsDialogMap[serial] = new SMDUIDialog({
            heading: "Device Details: " + serial,
            onInitComplete: function (contentDiv, footerDiv, comp) {
                contentDiv.style.display = "flex";
                contentDiv.style.flexDirection = "column";
                let contentCard = hh.createActDataPanelCard("Details");

                for (var item in devDetails) {
                    let detail = hh.adf(contentCard, item.toUpperCase());
                    if (devDetails[item] !== "null") {
                        detail.value = devDetails[item];
                    } else {
                        detail.value = "NA";
                    }
                }
                contentDiv.appendChild(contentCard);
            },
            open: true

        });
    };

    prot.openChangeDispNameDialog = function (serial) {
        this.changeDispNameDialog.open();
        this.targetSerial = serial;
    };

    function init() {
        this.changeDispNameDialog = new SMDUIDialog({
            heading: 'Change Display Name',
            draggable: true,
            onInitComplete: function (contentDiv, footerDiv, comp) {
                contentDiv.classList.add('devParamPanelWrapper');
                let inputObj = {};

                function createInput(parent, lbl, inf) {
                    let value = "";

                    let wrapper = document.createElement('div');
                    wrapper.classList.add('devParamPanel');
                    let label = document.createElement('span');
                    label.classList.add('ctrlLabel');
                    label.style.gridArea = 'label';
                    label.textContent = lbl;

                    let info = document.createElement('span');
                    info.classList.add('ctrlInfo');
                    info.style.gridArea = 'info';
                    info.textContent = inf;

                    let input = document.createElement('input');
                    input.style.gridArea = 'input';
                    input.style.width = '120px';
                    input.classList.add('ctrlValue');
                    input.classList.add('ui-inputfield');
                    input.oninput = function () {
                        wrapper.val = input.value;
                    }.bind(this);

                    wrapper.val = "";

                    wrapper.appendChild(label);
                    wrapper.appendChild(info);
                    wrapper.appendChild(input);
                    if (parent) {
                        parent.appendChild(wrapper);
                    }
                    return wrapper;
                }

                let name = createInput(contentDiv, 'Display Name: ', '');

                let okButton = hh.button(footerDiv, 'OK');
                okButton.onclick = function () {
                    inputObj.name = name.val;
                    sendInst("updateDevDisplayName", name.val, instDevUtil.targetSerial);
                    instDevUtil.changeDispNameDialog.close();
                };

                function sendInst(instr, val, serial) {
                    let msg = {
                        instrExt: instr
                    };
                    msg.devSerial = serial || "";
                    msg.displayName = val || "";
                    wsm.sendDevMsgExecWithJsonInst(
                            msg,
                            function (message, response) {
                                console.log("Result: ", response);
                                mu.showInfoMessage(response, 'Success setting: ' + message.instrExt);
                            },
                            function (message, err) {
                                mu.showErrorMessage(err, 'Error setting: ' + message.instrExt);
                            },
                            3000);
                }
            }
        });


    }


    $(document).ready(function () {
        root.instDevUtil = new InstDevUtil();
    });
}(window));

