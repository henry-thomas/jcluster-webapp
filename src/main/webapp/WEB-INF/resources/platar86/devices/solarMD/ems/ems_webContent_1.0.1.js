/* global logCon, PF, mainUtils, moment, devManager, bmsRelay, hh, bmsexDM, bmuH8, ipUtils, wsm, mu, dm, emsGui, emsGuiData */

var emsContent = {
    comp: {}
};
emsContent.compSettingsGrid = {};

emsContent.dialogSettingsGrid = {
    dialog: {conf: {heading: "Setting Grid Controlled Devices", draggable: true}, _dest: {object: emsContent.compSettingsGrid, name: 'dialogSettingsGrid'},
        //dialog content starts here
        accordian: {_conf: {selectedTab: 1},
            'genPanel': {accordianTitle: 'General Settings',
                paramTitle_0: 'General Settings Grid',
                div_: {class: 'devParamPanelWrapper',
                    'param_gridParam.controlMethod': {
                        type: 'dropDown', title: 'Control Method ', ctrlInfo: 'asdf.', dropDownConf: {
                            options: [{label: 'Auto', value: 0}, {label: 'Always Equal', value: 1}]
                        }
                    },
                    paramTitle_1: 'Device Settings'
                },
                dataPanel: {title: 'Something',
                    dataField: {title: 'Some Title', valueClass: null, unit: 'mm', defVal: 'Not Important'}
                }
            },
            'devPanel': {accordianTitle: 'Device Description',
                tabPanel_device: {
                    _conf: {_dest: {object: emsContent.compSettingsGrid, name: 'dialogSettingsGridDevTab'}, fnItem: [{icon: 'fa fa-plus', css: 'font-size: 22px; border-left: 1px solid #dedede; padding: 6px 15px;',
                                fn: function () {
                                    try {
                                        emsGui.comp.availableDeviceSelection.powerSelection = 'grid';
//                                        emsGui.comp.availableDeviceSelection.powerSelectionCat = 'grid';
                                        emsGui.comp.availableDeviceSelection.show();
                                    } catch (e) {
                                    }
                                }}]
                    }
                }
            }
        }
    }
};
emsContent.compSettingsGen = {};
emsContent.dialogSettingsGen = {
    dialog: {conf: {heading: "Setting Generator Controlled Devices", draggable: true}, _dest: {object: emsContent.compSettingsGen, name: 'dialogSettingsGen'},
        //dialog content starts here
        accordian: {_conf: {selectedTab: 1},
            'genPanel': {accordianTitle: 'General Settings',
                paramTitle_0: 'General Settings Generator',
                div_: {class: 'devParamPanelWrapper',
                    'param_genParam.controlMethod': {
                        type: 'dropDown', title: 'Control Method ', ctrlInfo: 'asdf.', dropDownConf: {
                            options: [{label: 'Auto', value: 0}, {label: 'Always Equal', value: 1}]
                        }
                    },
                    paramTitle_1: 'Device Settings'
                },
                dataPanel: {title: 'Something',
                    dataField: {title: 'Some Title', valueClass: null, unit: 'mm', defVal: 'Not Important'}
                }
            },
            'devPanel': {accordianTitle: 'Device Description',
                tabPanel_device: {
                    _conf: {_dest: {object: emsContent.compSettingsGen, name: 'dialogSettingsGenDevTab'}, fnItem: [{icon: 'fa fa-plus', css: 'font-size: 22px; border-left: 1px solid #dedede; padding: 6px 15px;',
                                fn: function () {
                                    try {
                                        emsGui.comp.availableDeviceSelection.powerSelection = 'gen';
                                        emsGui.comp.availableDeviceSelection.show();
                                    } catch (e) {
                                    }
                                }}]
                    }
                }
            }
        }
    }
};

emsContent.compSettingsRenewable = {};

emsContent.dialogSettingsRenewable = {
    dialog: {conf: {heading: "Setting Renewable Controlled Devices", draggable: true, open: true}, _dest: {object: emsContent.compSettingsRenewable, name: 'dialogSettingsRenewable'},
        //dialog content starts here
        accordian: {_conf: {selectedTab: 1},
            'genPanel': {accordianTitle: 'General Settings',
                paramTitle_0: 'General Settings Renewable',
                div_: {class: 'devParamPanelWrapper',
                    'param_renewableParam.controlMethod': {
                        type: 'dropDown', title: 'Control Method ', ctrlInfo: 'asdf.', dropDownConf: {
                            options: [{label: 'Auto', value: 0}, {label: 'Always Equal', value: 1}]
                        }
                    },
                    paramTitle_1: 'Device Settings'
                },
                dataPanel: {title: 'Something',
                    dataField: {title: 'Some Title', valueClass: null, unit: 'mm', defVal: 'Not Important'}
                }
            },
            'devPanel': {accordianTitle: 'Device Description',
                tabPanel_device: {
                    _conf: {_dest: {object: emsContent.compSettingsRenewable, name: 'dialogSettingsRenewableDevTab'}, fnItem: [{icon: 'fa fa-plus', css: 'font-size: 22px; border-left: 1px solid #dedede; padding: 6px 15px;',
                                fn: function () {
                                    try {
                                        emsGui.comp.availableDeviceSelection.powerSelection = 'renewable';
                                        emsGui.comp.availableDeviceSelection.show();
                                    } catch (e) {
                                    }
                                }}]
                    }
                }
            }
        }
    }
};

emsContent.compSettingsStorage = {};

emsContent.dialogSettingsStorage = {
    dialog: {conf: {heading: "Setting Storage", draggable: true, open: true, css: 'min-width: 388px;'}, _dest: {object: emsContent.compSettingsStorage, name: 'dialogSettingsStorage'},
        //dialog content starts here
        accordian: {_conf: {selectedTab: 0},
//            'genPanel': {accordianTitle: 'General Settings',
//                paramTitle_0: 'General Settings Renewable',
//                div_: {class: 'devParamPanelWrapper',
//                    'param_storageParam.controlMethod': {
//                        type: 'dropDown', title: 'Control Method ', ctrlInfo: 'asdf.', dropDownConf: {
//                            options: [{label: 'Auto', value: 0}, {label: 'Always Equal', value: 1}]
//                        }
//                    },
//                    paramTitle_1: 'Device Settings'
//                },
//                dataPanel: {title: 'Something',
//                    dataField: {title: 'Some Title', valueClass: null, unit: 'mm', defVal: 'Not Important'}
//                }
//            },
            'devPanel': {accordianTitle: 'Device Settings',
                tabPanel_device: {
                    _conf: {_dest: {object: emsContent.compSettingsStorage, name: 'dialogSettingsStorageDevTab'}, fnItem: [{icon: 'fa fa-plus', css: 'font-size: 22px; border-left: 1px solid #dedede; padding: 6px 15px;',
                                fn: function () {
                                    try {
                                        emsGui.comp.availableDeviceSelection.powerSelection = 'hybridStorage';
                                        emsGui.comp.availableDeviceSelection.show();
                                    } catch (e) {
                                    }
                                }}]
                    }
                }
            }
        }
    }
};

