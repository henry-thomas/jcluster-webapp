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
 */

/* global wsm, hh, deletePowerDataServer, mainUtils */

(function (root) {
    let PsDbOps = function () {
        initConfirmDialog.call(this);
    };

    let prot = PsDbOps.prototype;

    prot.deletePowerDataFromLogger = function ( {powerName, begin, end}) {
        let jsonMsg = {
            instrExt: 'deletePowerData',
            powerName: powerName,
            begin: begin,
            end: end,
            showMessage: 1
        };

        this.dialogConfirmButton.onclick = sendMessage.bind(this, jsonMsg, onDeletePowerSuccess, onDeletePowerError);

        let str = "Are you sure you want to delete <strong>" + powerName + "</strong>? <br> <br>" + "<strong>WARNING!</strong> This is not reversible!";
        setDialogContent.call(this, str);
        this.confirmDialog.open();
    };
    prot.deletePowerDataFromServer = function ( {powerName, begin, end}) {


        //deletePowerDataServer is registered remoteCommand to remove powers from DB
        let params = [{name: 'powerName', value: powerName}];
        this.dialogConfirmButton.onclick = function () {
            deletePowerDataServer(params);
            this.confirmDialog.close();
        }.bind(this);

        let str = "Are you sure you want to delete <strong>" + powerName + "</strong>? <br> <br>" + "<strong>WARNING!</strong> This is not reversible!";
        setDialogContent.call(this, str);
        this.confirmDialog.open();
    };

    prot.getPowerData = function ( {powerName, begin, end, limit}) {
        let jsonMsg = {
            instrExt: 'getPowerData',
            powerName: powerName,
            begin: begin,
            end: end,
            limit: limit,
            showMessage: 1
        };


        this.dialogConfirmButton.onclick = sendMessage.bind(this, jsonMsg);
        let str = "Are you sure you want to delete <strong>" + powerName + "</strong>? <br> <br>" + "<strong>WARNING!</strong> This is not reversible!";
        setDialogContent.call(this, str);
        this.confirmDialog.open();
    };

    prot.setPowerName = function ( {powerName, newName, begin, end}) {

        let input = initRenameDialogContent.call(this, powerName);


        this.dialogConfirmButton.onclick = function () {
            if (input.value || (input.value !== '')) {
                let jsonMsg = {
                    instrExt: 'setPowerName',
                    srcPowerName: powerName,
                    destPowerName: input.value,
                    begin: begin,
                    end: end,
                    showMessage: 1
                };

                let params = [{name: 'powerName', value: powerName}, {name: 'newPowerName', value: input.value}];
                wsm.sendDevMsgExecWithJsonInst(jsonMsg, onNameChangeSuccess);
                renamePowerServer(params);
                this.confirmDialog.close();
            } else {
                mainUtils.showErrorMessage('Name cannot be empty', 'Error');
            }
        }.bind(this);


        this.confirmDialog.open();
    };

    function onDeletePowerSuccess(msg, data) {
        mainUtils.showInfoMessage('Deleted ' + data + 'entries on logger.', 'Success');
    }

    function onNameChangeSuccess(msg, data) {
        mainUtils.showInfoMessage('Changed ' + data + 'names on logger.', 'Success');
    }

    function onDeletePowerError(msg1, msg2) {
        mainUtils.showErrorMessage('Operation Failed: ' + msg1.message, 'Error');
    }

    function initRenameDialogContent(powerName) {
        let content = this.dialogContent;
        if (content.firstChild) {
            content.removeChild(content.firstChild);
        }

        let wrapper = hh.div(content);
        let str = "Rename power from <strong>" + powerName + "</strong> to ";

        let msgSpan = hh.span(wrapper);

        msgSpan.innerHTML = str;
        let renameInput = hh.input(wrapper, 'text', '');

        let warn = "<br/><br/><strong>WARNING!</strong> Be careful...";
        let warnSpan = hh.span(wrapper);
        warnSpan.innerHTML = warn;


        return renameInput;
    }


    function sendMessage(msg, successcb, errorcb) {
        wsm.sendDevMsgExecWithJsonInst(msg, successcb);
        this.confirmDialog.close();
    }

    function initConfirmDialog() {
        this.confirmDialog = new SMDUIDialog({
            modal: true,
            heading: 'Caution',
            onInitComplete: function (content, footer, comp) {
                this.dialogContent = content;
                this.dialogConfirmButton = hh.button(footer, 'Confirm');
                this.dialogCancelButton = hh.button(footer, 'Cancel');
                this.dialogCancelButton.onclick = comp.close();
//                comp.open();
            }.bind(this)
        });
    }

    function setDialogContent(text) {

        let content = this.dialogContent;
        if (content.firstChild) {
            content.removeChild(content.firstChild);
        }
        let span = hh.span(content);
        span.innerHTML = text;
    }


    $(document).ready(function () {
        root.psDbOps = new PsDbOps();
    });


}(window));
