/* global customElements, mu, hh, sui, wsm, pm, dm */

class DeviceDg extends HTMLElement {
    constructor() {
        super();
        this.version = '22-Dec-2020 1.0.5';
        this.cfg = {};
        this.devPanelArr = {};
        this.alertDialogArr = {};
        this.nameChangeDialogArr = {};

        this.footerControl = {};
        this.init();
    }
//'sui-dgm-filter', this.cfg.filter, 9999, true)
    init() {
        window.onbeforeunload = function () {
            mu.setCookie('sui-dgm-isFilterMenuOpen', this.cfg.filterMenuOpen, 9999, true);
            mu.setCookie('sui-dgm-isHorizontal', this.cfg.isHorizontal, 9999, true);
            mu.setCookie('sui-dgm-filter', this.cfg.filter, 9999, true);
            mu.setCookie('sui-dgm-searchString', this.deviceTable.suiHeader.filterSettings.searchBar.value, 9999, true);
            mu.setCookie('sui-dgm-selectedSerial', this.selectedSerial, 9999, true);
        }.bind(this);
        dm.onSelectedChange(function () {

        });

        this.cfg.isHorizontal = mu.getCookie('sui-dgm-isHorizontal') || false;
        this.cfg.filter = mu.getCookie('sui-dgm-filter') || 'all';
        this.cfg.currentPage = mu.getCookie('sui-dgm-page') || 1;
        this.cfg.filterMenuOpen = !(Boolean(mu.getCookie('sui-dgm-isFilterMenuOpen')) || false);
        this.cfg.searchString = mu.getCookie('sui-dgm-searchString') || '';
        this.cfg.selectedSerial = mu.getCookie('sui-dgm-selectedSerial') || '';

        this.cfg.maxPageItems = Number(wsm.connectionVar.dgmDevicePerPage);
        if (isNaN(this.cfg.maxPageItems) || (this.cfg.maxPageItems === null)) {
            this.cfg.maxPageItems = 5;
        }

        //Use onScreenWidthResponse to handle when screen size is smaller than 640px
//        this.screenWidthQuery = window.matchMedia("(max-width: 640px)");
//        this.screenWidthQuery.addListener(this.onScreenWidthResponse.bind(this));
    }
    connectedCallback() {
        this.classList.add('sui-dgm');
        this.deviceTable = document.createElement('div');
        this.deviceTable.classList.add('sui-dgm-deviceTable');
        this.deviceTable.classList.add('ui-widget-content');

        let header = document.createElement('div');
        this.deviceTable.suiHeader = header;
        hh.setStyle(header, 'grid-area', 'header');

        this.deviceTable.appendChild(header);
        header.classList.add('sui-dgm-header');

        let serviceAlertIcon = document.createElement('i');
        serviceAlertIcon.classList.add('fas');
        serviceAlertIcon.classList.add('fa-exclamation-triangle');
        serviceAlertIcon.classList.add('serviceAlertIcon');
        serviceAlertIcon.classList.add('sui-dgm-setting');
        serviceAlertIcon.style.color = 'rgb(255, 83, 36)';
        serviceAlertIcon.style.display = 'none';
        serviceAlertIcon.onclick = this.onServiceAlertClick.bind(this);
        this.deviceTable.suiHeader.appendChild(serviceAlertIcon);
        let serviceAlertTooltip = sui.addTooltip(serviceAlertIcon, 'Service Alert');
        hh.setStyle(serviceAlertTooltip, 'grid-area', 'warningIcon');
        serviceAlertTooltip.style.width = "max-content";

        let table = document.createElement('div');
        this.deviceTable.suiTable = table;
        this.deviceTable.appendChild(table);
        table.classList.add('sui-dgm-table');
        hh.setStyle(table, 'grid-area', 'devicePanel');

        let footer = document.createElement('div');
        this.deviceTable.footer = footer;
        this.deviceTable.appendChild(footer);
        footer.classList.add('sui-dgm-footer');
        hh.setStyle(footer, 'grid-area', 'footer');

        hh.setStyle(this, 'display', 'grid');

        this.contentPanel = document.createElement('div');
        this.contentPanel.classList.add('sui-dgm-contentPanel');
        this.appendChild(this.deviceTable);
        this.appendChild(this.contentPanel);

        this.addOrientationSetting();

        this.addFilterSetting();
        this.initPagination();
        this.onFilterMenuToggle();

        this.setOrientation(this.cfg.isHorizontal);

        //adding the device content to dgm
        let deviceContent = document.querySelector('.sui-dgm-deviceContentPanel');
        hh.setStyle(deviceContent, 'grid-area', 'deviceContentPanel');

        this.contentPanel.appendChild(deviceContent);
        window.dgm = this;
    }

    get footer() {
        return this.deviceTable.footer;
    }

//    setSelectedSerial() {
//        for (let sn in this.devPanelArr) {
//            if (this.devPanelArr[sn].classList.contains('sui-dgm-selectedDevice')) {
//                this.selectedSerial = sn;
//
//            }
//        }
//    }

    setSelectedSerial(serialNumber) {
        if (this.devPanelArr[serialNumber]) {
            if (dm.getDevBySerialNumber(serialNumber) !== null) {
                this.selectedSerial = serialNumber;
                dm.setSelected(dm.getDevBySerialNumber(serialNumber)); //dm.setSelected will select the panel automatically
            }
        }
    }

    getDevicePanel(devSerialNumber) {
        return   this.devPanelArr[devSerialNumber];
    }

    hideDeviceTable() {
        this.deviceTable.style.display = 'none';
    }

    showDeviceTable() {
        this.deviceTable.style.display = 'grid';
    }

    setOrientation(horizontal) {

        if (horizontal !== undefined) {
            this.cfg.isHorizontal = ((Boolean(horizontal)) ? true : false);
        } else {
            //!undefined will become true
            this.cfg.isHorizontal = !this.cfg.isHorizontal;
        }
        if (this.cfg.isHorizontal) {
            this.classList.remove('sui-dgm-vertical');
            this.classList.add('sui-dgm-horizontal');

            this.deviceTable.classList.remove('sui-dgm-vertical');
            this.deviceTable.classList.add('sui-dgm-horizontal');

            this.deviceTable.suiTable.classList.remove('sui-dgm-vertical');
            this.deviceTable.suiTable.classList.add('sui-dgm-horizontal');

            this.deviceTable.suiHeader.classList.remove('sui-dgm-vertical');
            this.deviceTable.suiHeader.classList.add('sui-dgm-horizontal');

            this.deviceTable.suiHeader.filterSettings.classList.remove('sui-dgm-vertical');
            this.deviceTable.suiHeader.filterSettings.classList.add('sui-dgm-horizontal');

            this.deviceTable.suiHeader.pageControlDiv.classList.remove('sui-dgm-vertical');
            this.deviceTable.suiHeader.pageControlDiv.classList.add('sui-dgm-horizontal');

            this.deviceTable.suiHeader.orientSet.classList.add('fa-arrows-alt-h');
            this.deviceTable.suiHeader.orientSet.classList.remove('fa-arrows-alt-v');
        } else {
            this.classList.remove('sui-dgm-horizontal');
            this.classList.add('sui-dgm-vertical');

            this.deviceTable.classList.remove('sui-dgm-horizontal');
            this.deviceTable.classList.add('sui-dgm-vertical');

//            this.deviceTable.suiHeader.filterSettings.searchBar.style.display = 'block';

            this.deviceTable.suiTable.classList.remove('sui-dgm-horizontal');
            this.deviceTable.suiTable.classList.add('sui-dgm-vertical');

            this.deviceTable.suiHeader.classList.remove('sui-dgm-horizontal');
            this.deviceTable.suiHeader.classList.add('sui-dgm-vertical');

            this.deviceTable.suiHeader.filterSettings.classList.remove('sui-dgm-horizontal');
            this.deviceTable.suiHeader.filterSettings.classList.add('sui-dgm-vertical');

            this.deviceTable.suiHeader.pageControlDiv.classList.remove('sui-dgm-horizontal');
            this.deviceTable.suiHeader.pageControlDiv.classList.add('sui-dgm-vertical');

            this.deviceTable.suiHeader.orientSet.classList.add('fa-arrows-alt-v');
            this.deviceTable.suiHeader.orientSet.classList.remove('fa-arrows-alt-h');
        }
//        mu.setCookie('sui-dgm-isHorizontal', this.cfg.isHorizontal, 9999, true);
    }

    addOrientationSetting() {
        let orientButton = document.createElement('span');
        orientButton.style.display = 'flex';
        orientButton.style.justifyContent = 'center';
        orientButton.classList.add('fas');
        orientButton.classList.add('sui-dgm-setting');
        orientButton.classList.add('sui-dgm-orientationSetting');
        orientButton.onclick = this.setOrientation.bind(this, undefined);
        this.deviceTable.suiHeader.orientSet = orientButton;
        this.deviceTable.suiHeader.appendChild(this.deviceTable.suiHeader.orientSet);
//        sui.addTooltip(orientButton, 'Layout').attributeStyleMap.set('grid-area', 'orientation');
        sui.addTooltip(orientButton, 'Layout').style.gridArea = 'orientation';
    }

    addFilterSetting() {
        let filterMenuButton = document.createElement('i');
        filterMenuButton.classList.add('fas');
        filterMenuButton.classList.add('fa-filter');
        filterMenuButton.classList.add('sui-dgm-setting');
        filterMenuButton.classList.add('sui-dgm-filterButton');
        filterMenuButton.style.display = 'flex';
        filterMenuButton.style.justifyContent = 'center';
        this.deviceTable.suiHeader.filterMenuButton = filterMenuButton;
        this.deviceTable.suiHeader.filterMenuButton.filter = this.cfg.filter;
        this.deviceTable.suiHeader.appendChild(filterMenuButton);
//        sui.addTooltip(filterMenuButton, 'Filter').attributeStyleMap.set('grid-area', 'filterButton');
        sui.addTooltip(filterMenuButton, 'Filter').style.gridArea = 'filterButton';
        filterMenuButton.onclick = this.onFilterMenuToggle.bind(this);

        let filterSettingsDiv = document.createElement('div');
        this.deviceTable.suiHeader.filterSettings = filterSettingsDiv;
        filterSettingsDiv.classList.add('sui-dgm-filterSettings');
//        filterSettingsDiv.attributeStyleMap.set('grid-area', 'filterSettings');
        filterSettingsDiv.style.gridArea = 'filterSettings';
        this.deviceTable.suiHeader.appendChild(filterSettingsDiv);

        let filterOnlineButton = document.createElement('span');
        filterOnlineButton.classList.add('sui-dgm-filter-disabled');
        filterOnlineButton.classList.add('fas');
        filterOnlineButton.classList.add('fa-link');
        filterOnlineButton.classList.add('sui-dgm-setting');
        filterOnlineButton.classList.add('sui-dgm-filter-inactive');
        filterOnlineButton.onclick = function () {
            if (this.cfg.filter === 'online') {
                this.cfg.filter = 'all';
            } else {
                this.cfg.filter = 'online';
            }
//            mu.setCookie('sui-dgm-filter', this.cfg.filter, 9999, true);

            this.handleFilterStyle();
            this.refreshElementList();
        }.bind(this);
        this.deviceTable.suiHeader.filterSettings.filterOnlineSet = filterOnlineButton;
        this.deviceTable.suiHeader.filterSettings.appendChild(this.deviceTable.suiHeader.filterSettings.filterOnlineSet);
//        sui.addTooltip(filterOnlineButton, 'Toggle Online').attributeStyleMap.set('grid-area', 'onlineIcon');
        sui.addTooltip(filterOnlineButton, 'Toggle Online').style.gridArea = 'onlineIcon';
        filterOnlineButton.style.display = 'flex';
        filterOnlineButton.style.justifyContent = 'center';



        let filterOfflineButton = document.createElement('span');
        hh.addClass(filterOfflineButton, [
            'sui-dgm-filter-disabled',
            'fas',
            'fa-unlink',
            'sui-dgm-setting',
            'sui-dgm-filter-inactive'
        ]);
        filterOfflineButton.onclick = function () {
            if (this.cfg.filter === 'offline') {
                this.cfg.filter = 'all';
            } else {
                this.cfg.filter = 'offline';
            }

//            mu.setCookie('sui-dgm-filter', this.cfg.filter, 9999, true);

            this.handleFilterStyle();
            this.refreshElementList();
        }.bind(this);

        this.deviceTable.suiHeader.filterSettings.filterOfflineSet = filterOfflineButton;
        this.deviceTable.suiHeader.filterSettings.appendChild(this.deviceTable.suiHeader.filterSettings.filterOfflineSet);
//        sui.addTooltip(filterOfflineButton, 'Toggle Offline').attributeStyleMap.set('grid-area', 'offlineIcon');
        sui.addTooltip(filterOfflineButton, 'Toggle Offline').style.gridArea = 'offlineIcon';
        filterOfflineButton.style.display = 'flex';
        filterOfflineButton.style.justifyContent = 'center';

        let searchBar = document.createElement('input');
        hh.addClass(searchBar, ['ui-inputfield', 'sui-dgm-searchBar']);
//        searchBar.attributeStyleMap.set('grid-area', 'searchBar');
        searchBar.style.gridArea = 'searchBar';
        searchBar.setAttribute('placeholder', 'Name/SN');
        searchBar.setAttribute('type', 'search');
        this.deviceTable.suiHeader.filterSettings.searchBar = searchBar;
        searchBar.oninput = function () {
            let inputValue = this.deviceTable.suiHeader.filterSettings.searchBar.value;
            if (inputValue !== "") {
                this.cfg.filter = 'search';
                this.deviceTable.suiHeader.filterMenuButton.style.color = 'black';
            } else {
                this.cfg.filter = 'all';
                this.deviceTable.suiHeader.filterMenuButton.style.color = '#bebebe';
            }
//            mu.setCookie('sui-dgm-searchString', this.deviceTable.suiHeader.filterSettings.searchBar.value, 9999, true);
//            mu.setCookie('sui-dgm-filter', this.cfg.filter, 9999, true);
            this.refreshElementList();
        }.bind(this);
        this.deviceTable.suiHeader.filterSettings.appendChild(searchBar);
        this.deviceTable.suiHeader.filterSettings.searchBar.value = this.cfg.searchString;

        this.handleFilterStyle();
    }

    onFilterMenuToggle() {
        if (this.cfg.filterMenuOpen !== true) {
            //opening filterMenu
            this.deviceTable.suiHeader.filterSettings.style.display = 'grid';
            this.deviceTable.classList.remove('sui-dgm-hideSearch');
            this.deviceTable.suiHeader.filterMenuButton.style.color = 'black';
            this.cfg.filter = this.deviceTable.suiHeader.filterMenuButton.filter;
            this.refreshElementList();
            this.deviceTable.suiHeader.filterSettings.searchBar.focus(); //able to type when opening the menu
            this.cfg.filterMenuOpen = true;

        } else {
            //closing filterMenu
            this.deviceTable.suiHeader.filterSettings.style.display = 'none';
            this.deviceTable.classList.add('sui-dgm-hideSearch');
            this.deviceTable.suiHeader.filterMenuButton.style.color = '#bebebe';
            this.deviceTable.suiHeader.filterMenuButton.filter = this.cfg.filter;
            this.cfg.filter = 'all';
            this.refreshElementList();
            this.cfg.filterMenuOpen = false;
        }
    }

    handleFilterStyle() {
        let filterOnlineButton = this.deviceTable.suiHeader.filterSettings.filterOnlineSet;
        let filterOfflineButton = this.deviceTable.suiHeader.filterSettings.filterOfflineSet;
        if (this.cfg.filter === 'online') {
            filterOnlineButton.classList.add('sui-dgm-filter-online');
            filterOfflineButton.classList.remove('sui-dgm-filter-offline');
            this.deviceTable.suiHeader.filterSettings.searchBar.value = '';

        } else if (this.cfg.filter === 'offline') {
            filterOnlineButton.classList.remove('sui-dgm-filter-online');
            filterOfflineButton.classList.add('sui-dgm-filter-offline');
            this.deviceTable.suiHeader.filterSettings.searchBar.value = '';
        } else if (this.cfg.filter === 'search') {
            filterOfflineButton.classList.remove('sui-dgm-filter-offline');
            filterOnlineButton.classList.remove('sui-dgm-filter-online');
        } else if (this.cfg.filter !== 'online' && this.cfg.filter !== 'offline' && this.cfg.filter !== 'search') {
            filterOnlineButton.classList.remove('sui-dgm-filter-online');
            filterOfflineButton.classList.remove('sui-dgm-filter-offline');
            this.deviceTable.suiHeader.filterSettings.searchBar.value = '';
        }
    }

    onSearchInput(sn) {
        let inputValue = this.deviceTable.suiHeader.filterSettings.searchBar.value;
        this.handleFilterStyle();
        if ((this.devPanelArr[sn].deviceName.toUpperCase().indexOf(inputValue.toUpperCase()) > -1) || (this.devPanelArr[sn].dev.serialNumber.toUpperCase().indexOf(inputValue.toUpperCase()) > -1)) {
            return sn;
        }

    }

    initPagination() {
        //add container to hold all page controls
        let pageControlDiv = document.createElement('div');
        pageControlDiv.classList.add('sui-dgm-pageControls');
        this.deviceTable.suiHeader.pageControlDiv = pageControlDiv;
//        pageControlDiv.attributeStyleMap.set('grid-area', 'pageControls');
        pageControlDiv.style.gridArea = 'pageControls';

        let container = this.deviceTable.suiHeader;

        //Button Arrow navigation
        let prevPageButton = document.createElement('span');
        this.deviceTable.suiHeader.prevPageButton = prevPageButton;
        pageControlDiv.appendChild(prevPageButton);
        prevPageButton.addEventListener('click', this.paginatePrev.bind(this));
        hh.addClass(prevPageButton, ['fa', 'fa-arrow-left', 'sui-dgm-setting']);
//        prevPageButton.attributeStyleMap.set('grid-area', 'pageLeft');
        prevPageButton.style.gridArea = 'pageLeft';
//        sui.addTooltip(prevPageButton, 'Back').attributeStyleMap.set('grid-area', 'pageLeft');
        sui.addTooltip(prevPageButton, 'Back').style.gridArea = 'pageLeft';
        prevPageButton.style.display = 'flex';
        prevPageButton.style.justifyContent = 'center';

        let nextPageButton = document.createElement('span');
        this.deviceTable.suiHeader.nextPageButton = nextPageButton;
        pageControlDiv.appendChild(nextPageButton);
        nextPageButton.addEventListener('click', this.paginateNext.bind(this));
        hh.addClass(nextPageButton, ['fa', 'fa-arrow-right', 'sui-dgm-setting']);
//        nextPageButton.attributeStyleMap.set('grid-area', 'pageRight');
        nextPageButton.style.gridArea = 'pageRight';
//        sui.addTooltip(nextPageButton, 'Next').attributeStyleMap.set('grid-area', 'pageRight');
        sui.addTooltip(nextPageButton, 'Next').style.gridArea = 'pageRight';
        nextPageButton.style.display = 'flex';
        nextPageButton.style.justifyContent = 'center';


        let pageIndicator = document.createElement('span');
        this.deviceTable.suiHeader.pageIndicator = pageIndicator;
//        pageIndicator.attributeStyleMap.set('grid-area', 'pageIndicator');
        pageIndicator.style.gridArea = 'pageIndicator';
        pageControlDiv.appendChild(pageIndicator);
        hh.addClass(pageControlDiv, ['sui-dgm-pageIndicator', 'sui-dgm-setting']);
        container.appendChild(pageControlDiv);
    }

    addDevicePanel(serialNumber, dev) {
        let imgFolderPath = mu.getContextPath() + '/defaultImages';
        this.devPanelArr[serialNumber] = document.createElement('div');
        this.devPanelArr[serialNumber].addEventListener('click', () => {
            this.selectedSerial = serialNumber;
        });
        this.devPanelArr[serialNumber].dev = dev;
        this.devPanelArr[serialNumber].classList.add('sui-dgm-devicePanel');
        let devTopIconAlert = document.createElement('span');
        devTopIconAlert.classList.add('devTopIconAlert');
        devTopIconAlert.style.display = 'none';
        let warningCount = document.createElement('span');
        warningCount.classList.add('warningCount');
        warningCount.textContent = '0';
        devTopIconAlert.appendChild(warningCount);
        let warningIcon = document.createElement('span');
        warningIcon.innerHTML = `<i class="fas fa-exclamation-triangle fa-exclamation-triangle style="color: #ff6942" id ="warningIcon"></i>`;
        warningIcon.classList.add('sui-dgm-statIcon');
        devTopIconAlert.appendChild(warningIcon);
        this.devPanelArr[serialNumber].appendChild(devTopIconAlert);
//        devTopIconAlert.attributeStyleMap.set('grid-area', 'alertIcon');
        devTopIconAlert.style.gridArea = 'alertIcon';
        devTopIconAlert.onclick = this.onAlertIconClick.bind(this, serialNumber, dev);

        let imagesPanel = document.createElement('div');
        imagesPanel.style.display = 'flex';
        imagesPanel.style.justifyContent = 'center';
        this.devPanelArr[serialNumber].appendChild(imagesPanel);
//        imagesPanel.attributeStyleMap.set('grid-area', 'img');
        imagesPanel.style.gridArea = 'img';

        let devImg = document.createElement('img');
        let modelID = dev.modelID;
        let subModelID = dev.subModelID;
        devImg.setAttribute('src', imgFolderPath + "\\devIcon_" + modelID + "_" + subModelID + ".png");
        devImg.setAttribute('alt', '');
        imagesPanel.appendChild(devImg);

        let divConnIconWrapper = document.createElement('div');
        divConnIconWrapper.style.gridArea = 'statIcon';
        divConnIconWrapper.style.display = 'flex';
        divConnIconWrapper.style.alignContent = 'center';
        divConnIconWrapper.style.alignItems = 'center';

        this.devPanelArr[serialNumber].appendChild(divConnIconWrapper);

        let connectionIconSpan = document.createElement('span');
        connectionIconSpan.innerHTML = `
                <i class = "fa fa-link devConnectedIcon" style="color: #17e400; display: none"></i>
                <i class = "fa fa-unlink devDisconnectedIcon" style="color: #ffac42;"></i>`;
//        this.devPanelArr[serialNumber].appendChild(connectionIconSpan);
        divConnIconWrapper.appendChild(connectionIconSpan);
        connectionIconSpan.classList.add('sui-dgm-statIcon');
//        connectionIconSpan.attributeStyleMap.set('grid-area', 'statIcon');
        connectionIconSpan.style.gridArea = 'statIcon';

        let proggressIcon = document.createElement('span');
        let proggressIconFa = document.createElement('i');
        proggressIconFa.classList.add('fa');
        proggressIconFa.classList.add('fa-hourglass-end');
        proggressIconFa.classList.add('devProgressIcon');
        proggressIcon.appendChild(proggressIconFa);
        proggressIcon.classList.add('sui-dgm-progIcon');
//        proggressIcon.style.gridArea = 'statIcon';
        proggressIcon.style.display = 'none';
        proggressIcon.style.padding = '5px';
        proggressIcon.style.cursor = 'pointer';
        proggressIcon.style.fontSize = '22px';
        proggressIcon.style.color = '#767676';

//        this.devPanelArr[serialNumber].appendChild(proggressIcon);
        this.devPanelArr[serialNumber].proggressIcon = proggressIcon;
        proggressIcon.onclick = function () {
            dm.onProgressDialogIconClick(serialNumber);
        };
        divConnIconWrapper.appendChild(proggressIcon);



        let devSNSpan = document.createElement('span');
        this.devPanelArr[serialNumber].SNSpan = devSNSpan;
        dgm.setDeviceName(dev.displayName || serialNumber, serialNumber);
        devSNSpan.classList.add('serialNumberSpan');
        this.devPanelArr[serialNumber].append(devSNSpan);
//        sui.addTooltip(devSNSpan, 'Right click to edit').attributeStyleMap.set('grid-area', 'name');
        devSNSpan.style.gridArea = 'name';
        devSNSpan.style.width = '100%';
        devSNSpan.style.display = 'flex';
        devSNSpan.style.justifyContent = 'center';
//        sui.addTooltip(this.devPanelArr[serialNumber].SNSpan, 'Right click to edit');
        this.refreshElementList();

//        this.setSelectedSerial();
        return this.devPanelArr[serialNumber];
    }

    showProgressIcon = function (sn) {
        this.devPanelArr[sn].proggressIcon.style.display = 'block';
    }
    hideProgressIcon = function (sn) {
        this.devPanelArr[sn].proggressIcon.style.display = 'none';
    }

    setDeviceName = function (deviceName, sn) {
        if (deviceName !== undefined) {
            this.devPanelArr[sn].SNSpan.innerText = deviceName;
            this.devPanelArr[sn].deviceName = deviceName;
            this.devPanelArr[sn].dev.label = deviceName;
        }
        sui.addTooltip(this.devPanelArr[sn].SNSpan, "SN: " + sn);
    }

    paramDiolog = function () {



        let ncDialog = new SMDUIDialog({
            heading: 'Change Uploaded Settings',
            draggable: true,
            onInitComplete: function (contentDiv, footerDiv, comp) {
                contentDiv.classList.add('devParamPanelWrapper');
                let inputObj = {};

                function createInput(parent, lbl, inf) {
                    let value = '';

                    let wrapper = document.createElement('div');
                    let label = document.createElement('span');
                    label.textContent = lbl;

                    let input = document.createElement('input');
//                    input.style.width = '170px';
                    input.setAttribute("type", "file");
//                    input.classList.add('ui-inputfield');
                    input.oninput = function () {
                        let [file] = input.files;
                        const reader = new FileReader();
                        reader.addEventListener("load", () => {
                            let dateTarget = document.getElementById("dateDiv");
                            let target = document.getElementById("fileInfoDiv");
                            let fileObject = JSON.parse(reader.result);
//                    target.innerHTML = dm.selected.deviceName + " " + dm.selected.data.serialNumber + " " + "Settings";
                            let today = new Date();
                            let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
//                    dateTarget.innerHTML = "File Uploaded on: " + date;
                            console.log(fileObject);
                        }, false);
                        if (file) {
                            reader.readAsText(file);
                        }
                    }

                    let downloadParamSettingsBtn = wrapper.resetBtn = hh.button(footerDiv, "Download Settings");
                    downloadParamSettingsBtn.addEventListener('click', function () {
                        dm.exportParam(dm.selected.param);
                    });

                    let changeSettingsBtn = wrapper.confirmButton = hh.button(footerDiv, 'Change Settings');
                    changeSettingsBtn.addEventListener('click', function () {

                        let [file] = input.files;
                        const reader = new FileReader();
                        reader.addEventListener("load", () => {
                            let target = document.getElementById("chosenFileDiv");
                            let fileObject = JSON.parse(reader.result);

                            console.log(fileObject);
                            let diff = Object.keys(fileObject).reduce((diff, key) => {
                                if (dm.selected.param[key] === fileObject[key])
                                    return diff;
                                return {
                                    ...diff,
                                    [key]: fileObject[key]
                                };
                            }, {});
                            console.log("This is the difference in the two objects");
                            console.log(diff);
                            let paramDiv = document.getElementById("paramDiv");
                            for (var item in diff) {
                                console.log(item, diff[item]);
                                dm.executeParamChange(item, null, diff[item]);
                            }

                        }, false);
                        if (file) {
                            reader.readAsText(file);
                        }
                    });

                    wrapper.appendChild(label);
                    wrapper.appendChild(input);
                    contentDiv.appendChild(wrapper);
                    return wrapper;
                }

                createInput(contentDiv, '');
            }

        });
        ncDialog.open();

    }
    ;
            onSNSpanRightClick(sn, snSpan, ev) {
//        dgm.paramDiolog();
        ev.preventDefault();

        if (this.nameChangeDialogArr[sn]) {
            this.nameChangeDialogArr[sn].open();
            return;
        }

        let ncDialog = new SMDUIDialog({
            heading: 'Edit Name',
            draggable: true,
            onInitComplete: function (contentDiv, footerDiv, comp) {
                contentDiv.classList.add('devParamPanelWrapper');
                let inputObj = {};

                function createInput(parent, lbl, inf) {
                    let value = '';

                    let wrapper = document.createElement('div');
                    let label = document.createElement('span');
                    label.textContent = lbl;

                    let input = document.createElement('input');
                    input.style.width = '120px';
                    input.classList.add('ui-inputfield');
                    input.oninput = function () {
                        wrapper.val = input.value;
                    }.bind(this);

                    let resetBtn = wrapper.resetBtn = hh.button(footerDiv, "Reset");
                    resetBtn.addEventListener('click', function () {
                        const subDeviceNameValue = sn;
                        if (subDeviceNameValue !== '') {
                            updateSubDeviceName([{name: 'subDeviceNameKey', value: sn}, {name: 'subDeviceNameValue', value: subDeviceNameValue}]);
                            snSpan.textContent = subDeviceNameValue;
                            dgm.devPanelArr[sn].deviceName = subDeviceNameValue;
                            dgm.devPanelArr[sn].dev.label = subDeviceNameValue;
                            sui.addTooltip(snSpan, 'Right click to edit');
                            ncDialog.close();
                        }
                    });

                    let confirmBtn = wrapper.confirmButton = hh.button(footerDiv, 'Confirm');
                    confirmBtn.addEventListener('click', function () {
                        const subDeviceNameValue = input.value;
                        if (subDeviceNameValue.trim() !== '') {
                            updateSubDeviceName([{name: 'subDeviceNameKey', value: sn}, {name: 'subDeviceNameValue', value: subDeviceNameValue}]);
                            snSpan.textContent = subDeviceNameValue;
                            sui.addTooltip(snSpan, 'Right click to edit');
                            dgm.devPanelArr[sn].deviceName = subDeviceNameValue;
                            dgm.devPanelArr[sn].dev.label = subDeviceNameValue;
                            ncDialog.close();
                        }
                    });

                    wrapper.appendChild(label);
                    wrapper.appendChild(input);
                    contentDiv.appendChild(wrapper);
                    return wrapper;
                }

                createInput(contentDiv, 'Change name for ' + sn + ': ');
            }
        });



        this.nameChangeDialogArr[sn] = ncDialog;
        ncDialog.open();

    }

    onAlertIconClick(serialNumber, dev) {
        // debugger;
//        if (!document.querySelector('.alert-dialog-' + serialNumber)) {

        if (this.alertDialogArr[serialNumber]) {
            this.alertDialogArr[serialNumber].open();
            return;
        }
        let alert = dev.alert;
//          
        let alertDialog = new SMDUIDialog({
            heading: 'ALERTS FOR ' + dev.displayName + ' SN[' + serialNumber + ']',
            draggable: true,
            onInitComplete: function (contentDiv, footerDiv, comp) {
                contentDiv.classList.add('devParamPanelWrapper');
                let inputObj = {};


                let alertPanel = new TabPanel(contentDiv, {
                    menuItem: [
                    ]
                });

                alertPanel.addItem({
                    id: "Errors",
                    icon: "fa-exclamation-circle",
                    iconColor: "#ff5324"
                });
                alertPanel.addItem({
                    id: "Warnings",
                    icon: 'fa-exclamation-triangle',
                    iconColor: '#ffb722'
                });
                alertPanel.addItem({
                    id: "Info",
                    icon: 'fa-info-circle',
                    iconColor: "#03A9F4"

                });
                alertPanel.addItem({
                    id: "Other",
                    icon: 'fa-question-circle',
                    iconColor: "#808080"

                });

                comp.alertPanel = alertPanel;

                window.alertPanel = alertPanel;

                alertPanel.warningsTab = alertPanel.getItemContentById('Warnings');
                alertPanel.errorsTab = alertPanel.getItemContentById('Errors');
                alertPanel.infoTab = alertPanel.getItemContentById('Info');
                alertPanel.otherTab = alertPanel.getItemContentById('Other');
            }
        });

        this.alertDialogArr[serialNumber] = alertDialog;

        if (alertDialog) {
            this.updateAlerts(alert, serialNumber);
        }
        if (!alertDialog.isOpen) {
            alertDialog.open();
        }
    }

    appendAlertInfo = function (alert, alertContentDiv) {
        let alertItem = this.createAlertTabsPage(alert);
        alertContentDiv.appendChild(alertItem);
    }

    createAlertTabsPage(alert) {
        let alertItem = document.createElement('div');
        alertItem.classList.add('alert-item');
        let alertDescription = document.createElement('span');
        alertDescription.innerHTML = '<strong>Description:</strong> ' + alert.description;
        alertDescription.classList.add('alert-detail-content');
        alertItem.appendChild(alertDescription);
        let alertLevel = document.createElement('span');
        alertLevel.innerHTML = '<strong>Level:</strong> ' + alert.level;
        alertLevel.classList.add('alert-detail-content');
        alertItem.appendChild(alertLevel);
        let alertTimestamp = document.createElement('span');
        alertTimestamp.innerHTML = '<strong>Timestamp:</strong> ' + new Date(alert.timeStamp);
        alertTimestamp.classList.add('alert-detail-content');
        alertItem.appendChild(alertTimestamp);
        return alertItem;
    }

    updateAlerts(alert, serialNumber) {
        let dialog = this.alertDialogArr[serialNumber];

        if (dialog) {
            let tabs = dialog.alertPanel;

            if (tabs.errorsTab) {
                tabs.errorsTab.innerHTML = '';
            }
            if (tabs.warningsTab) {
                tabs.warningsTab.innerHTML = '';
            }
            if (tabs.infoTab) {
                tabs.infoTab.innerHTML = '';
            }
            if (tabs.otherTab) {
                tabs.otherTab.innerHTML = '';
            }

            let errorCount = 0;
            let warningCount = 0;
            let infoCount = 0;
            let otherCount = 0;
            for (var alertCode in alert) {
                if (alert[alertCode].level === 'ERROR') {
                    errorCount++;
                    if (tabs.errorsTab) {
                        this.updateAlertTabsPage(alert[alertCode], tabs.errorsTab);
                    } else {
                        this.appendAlertInfo(alert[alertCode], tabs.getItemContentById('Errors'), dialog.alertTabsContent);
                    }
                } else if (alert[alertCode].level === 'WARNING') {
                    warningCount++;
                    if (tabs.warningsTab) {
                        this.updateAlertTabsPage(alert[alertCode], tabs.warningsTab);
                    } else {
                        this.appendAlertInfo(alert[alertCode], tabs.getItemContentById('Warnings'), dialog.alertTabsContent);
                    }
                } else if (alert[alertCode].level === 'INFO') {
                    infoCount++;
                    if (tabs.infoTab) {
                        this.updateAlertTabsPage(alert[alertCode], tabs.infoTab);
                    } else {
                        this.appendAlertInfo(alert[alertCode], tabs.getItemContentById('Info'), dialog.alertTabsContent);
                    }
                } else {
                    otherCount++;
                    if (tabs.otherTab) {
                        this.updateAlertTabsPage(alert[alertCode], tabs.otherTab);
                    } else {
                        this.appendAlertInfo(alert[alertCode], tabs.getItemContentById('Other'), dialog.alertTabsContent);
                    }
                }
            }

            if (infoCount === 0) {
                tabs.hideTab('Info');
            } else {
                tabs.showTab('Info');
            }

            if (warningCount === 0) {
                tabs.hideTab('Warnings');
            } else {
                tabs.showTab('Warnings');
            }

            if (errorCount === 0) {
                tabs.hideTab('Errors');
            } else {
                tabs.showTab('Errors');
            }
            if (otherCount === 0) {
                tabs.hideTab('Other');
            } else {
                tabs.showTab('Other');
            }
        }
    }

    updateAlertTabsPage(alert, alertsPage) {
        let alertTabContent = document.createElement('div');
        let alertItem = this.createAlertTabsPage(alert);
        alertTabContent.appendChild(alertItem);
        alertsPage.appendChild(alertItem);
    }

    onServiceAlertClick() {
        let heading = 'Service Alert';
        let content = document.createElement('div');
        content.text = document.createElement('span');
        content.text.innerHTML = 'Failed to connect to service.';
        content.appendChild(content.text);
        content.style.padding = '10px';
        content.style.fontSize = '14px';
        let serviceAlertDialog = sui.dialog({heading: heading, content: content});
        this.appendChild(serviceAlertDialog);
        serviceAlertDialog.open();
    }

    paginateNext() {
        this.cfg.currentPage += 1;
        this.refreshElementList();
    }

    paginatePrev() {
        this.cfg.currentPage -= 1;
        this.refreshElementList();
    }

    paginateElements(arr, selectedSerial) {
        if (Array.isArray(arr)) {
            let arrReturn = [];
            let  itemsPerPage = this.cfg.maxPageItems;
            let totalPages = Math.ceil(arr.length / itemsPerPage);
            if (isNaN(Number(totalPages)) || totalPages === 0) {
                totalPages = 1;
            }

            let currentPage = this.cfg.currentPage;

            for (let i = (currentPage * itemsPerPage) - itemsPerPage; i < ((currentPage * itemsPerPage)); i++) {
                if (arr[i] !== undefined) {
                    arrReturn.push(arr[i]);
                }
            }

            //this will go back until the number of pages is less than the seleted page
            if (currentPage > totalPages) {
                this.cfg.currentPage -= 1;
                this.refreshElementList();
            }

            this.deviceTable.suiHeader.pageIndicator.innerHTML = this.cfg.currentPage + '/' + totalPages;
            if (this.cfg.currentPage <= 1) {
                this.deviceTable.suiHeader.prevPageButton.style.display = 'none';
            } else {
                this.deviceTable.suiHeader.prevPageButton.style.display = 'block';
            }
            if (this.cfg.currentPage >= totalPages) {
                this.deviceTable.suiHeader.nextPageButton.style.display = 'none';
            } else {
                this.deviceTable.suiHeader.nextPageButton.style.display = 'block';
            }
            return arrReturn;
        } else {
            return [];
        }
    }

    sortElements(arr, sort) {
        if (Array.isArray(arr)) {
            return arr.sort();
        } else {
            return [];
        }
    }

    filterElements(arr) {
        let state = this.cfg.filter;
        if (Array.isArray(arr)) {
            let arrReturn = [];
            for (var i = 0; i < arr.length; i++) {
                let serialNumber = arr[i];
                try {
                    let dev = this.devPanelArr[serialNumber].dev;
                    if (state === 'online' && dev.connected) {
                        arrReturn.push(serialNumber);
                    } else if (state === 'offline' && !dev.connected) {
                        arrReturn.push(serialNumber);
                    } else if (state === 'search') {
                        if (this.onSearchInput(serialNumber) !== undefined) {
                            arrReturn.push(this.onSearchInput(serialNumber));
                        }
                    } else if (state !== 'online' && state !== 'offline' && state !== 'search') {
                        arrReturn.push(serialNumber);
                    }
//                    }
                } catch (e) {
                    console.warn(e);
                }
            }

            return arrReturn;
        } else {
            return [];
        }
    }

    refreshElementList() {
        hh.removeAllChilds(this.deviceTable.suiTable);
        let arrSorted = Object.keys(this.devPanelArr);

        arrSorted = this.filterElements(arrSorted);
        arrSorted = this.sortElements(arrSorted);
        arrSorted = this.paginateElements(arrSorted);

        for (var i = 0; i < arrSorted.length; i++) {
            this.deviceTable.suiTable.appendChild(this.devPanelArr[arrSorted[i]]);
            if (i === arrSorted.length - 1) {
                this.devPanelArr[arrSorted[i]].style.border = 'none';
            } else {
                this.devPanelArr[arrSorted[i]].style.border = '';
            }
        }
        this.setSelectedSerial(this.cfg.selectedSerial);
    }

    addFotterButton(label, callback) {
        if (this.footerControl[label] === undefined) {
            if (typeof (callback) !== 'function') {
                console.warn('DGM: Invalid Action - calback is not a function. expexted typeof(callback)===function found  ' + typeof (callback));
            } else {

                if (!this.footerControlButton) {
                    this.footerControlButton = sui.dropdown({
                        text: '...',
                        content: [],
                        type: 'small'
                    });
                    this.footer.appendChild(this.footerControlButton);
                }
                this.footerControlButton.addElementToDropdown({name: label, cb: callback});
            }
        } else {
            console.warn('DGM: Invalid Action - settings with label ' + label + 'already exist!');
        }
    }
}

customElements.define('device-dg-manager', DeviceDg);
