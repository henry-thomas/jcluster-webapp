var loggerVEmsComp = {};

loggerVEmsComp.openCreatDialog = function () {
//    debugger;
    if (loggerVEmsComp.newDialog === undefined) {
        loggerVEmsComp.createAddNewEmsDialog();
    }
    loggerVEmsComp.newDialog.show();
};

loggerVEmsComp.createAddNewEmsDialog = function () {
    let dialog = loggerVEmsComp.newDialog = new SMDUIDialog({modal: true, draggable: true});
   let cont = hh.div(dialog.contentDiv, 'display: flex;');
    new ParamSetting(cont, {
        detached: true, instrExt:'addNewEmsDevice', type: 'inputText', title: 'Ems Name:', setButtonLabel: 'Create',
        ctrlInfo: 'info',
        extraData: {devModelId: 27}
    });
    debugger;
};