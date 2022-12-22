/*  Copyright (C) Solar MD (Pty) ltd - All Rights Reserved
 * 
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  
 *  Written by brais, 2019
 *  
 *  For more information http://www.solarmd.co.za/ 
 *  email: info@solarmd.co.za
 *  7 Alternator Ave, Montague Gardens, Cape Town, 7441 Sout Africa
 *  Phone: 021 555 2181
 *  
 */

/* global google, mainUtils, navigator, SlideshowManager, moment, MarkerClusterer, Element, mu */

/**
 * Google Maps manager
 * @param {type} e : DOM element itself, or its ID or its class
 * @param {type} config : Google Maps configuration
 * @returns {GeoManager}
 */
function GeoManager(e, config) {
    this.mainContainer = null;
    // DOM element that will contain the whole Google map
    this.mapContainer = null;
    this.autoCompleteInput = null;
    this.markerOnlineIcon = null;
    this.markerOfflineIcon = null;
    this.markerPlantIcon = null;
    this.config = null;
    this.profile = null;

    //    this.markerClusterer = null;
    this.path = '';
    this.map = null;
    // Google Autocomplete object
    this.autocomplete = null;
    // Contains a collection of each marker info
    this.markers = [];
    // Contains a collection of Google Maps' markers
    this.googleMarkers = [];
    this.infowindow = null;
    this.slideshowManager = null;
    this.editedMarker = null;
    this.strictBounds = false;

    this.onInitCbs = [];
    this.onUpdateAutoCompleteCbs = [];
    this.onUpdateLocationCbs = [];
    this.onUpdateStatusCbs = [];

    this.create(e, config);
}
;

GeoManager.prototype = {

    /**
     * Required marker icon paths
     */
    markerOnIconUrl: '/defaultImages/icon/markers/markerOnline.png',
    markerOffIconUrl: '/defaultImages/icon/markers/markerOffline.png',
    markerPlantIconUrl: '/defaultImages/icon/markers/markerPlant.png',
    markerClusterUrl: '/defaultImages/icon/markerCluster/m',

    /**
     * DOM component IDs that will be updated;
     */
    infoIDs: {
        title: 'titleDevice',
        description: 'descriptionDevice',
        address: 'addressDevice',
        viewOnMap: 'viewOnMapDevice',
        getDirections: 'getDirectionsDevice',
        dynamicLinks: 'dynamicLinks'
    },

    /**
     * Profile sample:
     *      profile_name {
     *          icon: ...,
     *          markerTitle: ...,
     *          infoWindowTitle: ...,
     *          links: ...
     *      }
     * 
     * @type type
     */
    profiles: {
        logger: {
            icon: 'markerOnlineIcon',
            markerTitle: ['shortName'],
            infoWindowTitle: {text: '@shortName@ (@markerId@)', properties: ['shortName', 'markerId']},
            links: [{text: 'View Subdevices', link: "javascript:viewSubdevices([{name: 'serNum', value: '@markerId@'}])", properties: ['markerId']}]
        },
        plant: {
            icon: 'markerPlantIcon',
            markerTitle: ['name'],
            infoWindowTitle: {text: '@name@ (@sqm@  \u33A1)', properties: ['name', 'sqm']}
        }
    },

    create: function (e, config) {
        if (!e)
            return false;

        // Main SlideShow Component
        // Checking if we are passing the DOM element itself (DIV type)
        if (e instanceof Element)
            this.mainContainer = e;
        // Checking if we are passing the ID of the DOM element
        if (!this.mainContainer) {
            this.mainContainer = document.querySelector('#' + e);
        }
        // Checking if we are passing the (unique) class of the DOM element
        if (!this.mainContainer) {
            this.mainContainer = document.querySelector('.' + e);
        }

        this.initControls(config);
        this.initMap();
        this.setConfig(config);
        this.runOnInit();
    },

    setConfig: function (config) {
        if (!config) {
            return;
        }
        if (!config)
            return;
        if (config.infoWindow)
            this.addInfowindow();

        this.config = config;
        this.setDefaultProfile(config.profile);
        if (config.onInit) {
            this.onInit(config.onInit);
        }
        if (config.onUpdateLocation) {
            this.onUpdateLocation(config.onUpdateLocation);
        }
        if (config.onUpdateStatus) {
            this.onUpdateStatus(config.onUpdateStatus);
        }
    },

    onInit: function (cb) {
        this.addCbs(cb, this.onInitCbs);
    },

    onUpdateLocation: function (cb) {
        this.addCbs(cb, this.onUpdateLocationCbs);
    },

    onUpdateStatus: function (cb) {
        this.addCbs(cb, this.onUpdateStatusCbs);
    },

    addCbs: function (cb, cbs) {
        if (!Array.isArray(cb)) {
            let array = [cb];
            cb = array;
        }

        for (let i in cb) {
            if (typeof (cb[i]) === 'function' ||
                    (typeof (cb[i]) === 'object' && cb[i].fn && cb[i].params && typeof (cb[i].fn) === 'function')) {
                cbs.push(cb[i]);
            } else {
                console.warn('Function required. Found', cb[i]);
            }
        }
    },

    runOnInit: function (data) {
        this.runCbs(this.onInitCbs, data);
    },

    runOnUpdateLocation: function (data) {
        this.runCbs(this.onUpdateLocationCbs, data);
    },

    runOnUpdateStatus: function (data) {
        if (!this.googleMarkers || !this.googleMarkers.length || !this.onUpdateStatusCbs || !this.onUpdateStatusCbs.length) {
            return;
        }
//        console.log('Running runOnUpdateStatus');
        this.runCbs(this.onUpdateStatusCbs, data);

        let geoManager = this;
        setInterval(function () {
            geoManager.runCbs(geoManager.onUpdateStatusCbs, data);
        }, 5000);
    },

    runCbs: function (cbs, data) {
        if (!cbs) {
            return;
        }

        for (let i in cbs) {
            if (typeof (cbs[i]) === 'function') {
                cbs[i](data);
            } else if (typeof (cbs[i]) === 'object' && cbs[i].fn && cbs[i].params && typeof (cbs[i].fn) === 'function') {
                cbs[i].fn(cbs[i].params);
            }
        }
    },

    setDefaultProfile: function (profile) {
        if (profile && this.profiles[profile]) {
            this.profile = profile;
        } else {
            this.profile = 'logger';
        }
    },
    getProfile(info) {
        if (info && info.profile && this.profiles[info.profile]) {
            return this.profiles[info.profile];
        }
        return this.profiles[this.profile];
    },

    initControls: function (config) {
        if (!this.mainContainer || !config || !config.autocomplete)
            return;

        // Address Input
        let addressContainer = document.createElement('div');
        addressContainer.setAttribute('style', 'margin-top: 15px;');
        this.mainContainer.appendChild(addressContainer);

        let mapIcon = document.createElement('i');
        mapIcon.classList.add('fa');
        mapIcon.classList.add('fa-map-marker');
        mapIcon.setAttribute('style', 'font-size: 1.2em; color: grey; margin-right: 5px;');
        addressContainer.appendChild(mapIcon);

        let addressLabel = document.createElement('label');
        addressLabel.classList.add('ui-outputlabel');
        addressLabel.classList.add('ui-widget');
        addressLabel.htmlFor = 'addressInput';
        addressLabel.innerHTML = 'Installation Address:';
        addressContainer.appendChild(addressLabel);

        this.autoCompleteInput = document.createElement('input');
        this.autoCompleteInput.id = 'addressInput';
        this.autoCompleteInput.classList.add('ui-inputfield');
        this.autoCompleteInput.classList.add('ui-inputtext');
        this.autoCompleteInput.classList.add('ui-widget');
        this.autoCompleteInput.classList.add('ui-state-default');
        this.autoCompleteInput.classList.add('ui-corner-all');
        this.autoCompleteInput.setAttribute("style", 'width:100%;');
        if (config.autocompleteValue) {
            this.autoCompleteInput.value = config.autocompleteValue;
        }
        addressContainer.appendChild(this.autoCompleteInput);
        this.addAutoComplete();
        
        // Map Controls
        let controlsContainer = document.createElement('div');
        controlsContainer.setAttribute('style', 'display: flex; flex-wrap: wrap; margin-top: 10px;');
        this.mainContainer.appendChild(controlsContainer);

        let optionsContainer = document.createElement('div');
        optionsContainer.classList.add('ui-selectoneradio');
        optionsContainer.classList.add('ui-widget');
        optionsContainer.classList.add('ui-grid');
        optionsContainer.classList.add('ui-grid-responsive');
        optionsContainer.setAttribute('style', 'min-width: 50%;');
        controlsContainer.appendChild(optionsContainer);

        let gridContainer = document.createElement('div');
        gridContainer.classList.add('ui-g');
        optionsContainer.appendChild(gridContainer);

        this.addRadioButton(gridContainer, 'All', []);
        this.addRadioButton(gridContainer, 'Establishments', ['establishment']);
        this.addRadioButton(gridContainer, 'Addresses', ['address']);
        this.addRadioButton(gridContainer, 'Geocodes', ['geocode']);

        this.addStrictBoundsCheckBox(controlsContainer);
    },
    
    addStrictBoundsCheckBox: function (parent) {
        let strictBoundsContainer = document.createElement('div');
        strictBoundsContainer.classList.add('ui-selectbooleancheckbox');
        strictBoundsContainer.classList.add('ui-chkbox');
        strictBoundsContainer.classList.add('ui-widget');
        strictBoundsContainer.setAttribute('style', 'margin-top:3px;');
        parent.appendChild(strictBoundsContainer);
        
        let geoManager = this;
        let checkBox = document.createElement('input');
        checkBox.id = 'idStrictBounds';
        checkBox.setAttribute('style', 'margin-top: 6px; width: 1.2em; height: 1.2em;');
        checkBox.setAttribute('type', 'checkbox');
        checkBox.setAttribute('value', name);
        checkBox.addEventListener('change', function() {
            geoManager.updateStrictBounds();
        });
        strictBoundsContainer.appendChild(checkBox);

        let checkBoxLabel = document.createElement('label');
        checkBoxLabel.htmlFor = 'idStrictBounds';
        checkBoxLabel.classList.add('ui-chkbox-label');
        checkBoxLabel.setAttribute('style', 'margin-left: 10px;');
        checkBoxLabel.innerHTML = 'Strict Bounds';
        strictBoundsContainer.appendChild(checkBoxLabel);
    },

    addRadioButton: function (parent, name, types) {
        types = types || [];
        let gridDiv = document.createElement('div');
        gridDiv.classList.add('ui-g-12');
        gridDiv.classList.add('ui-md-3');
        parent.appendChild(gridDiv);

        let radioBtn = document.createElement('input');
        radioBtn.id = 'id' + name;
        radioBtn.setAttribute('style', 'width: 1.2em; height: 1.2em;');
        radioBtn.setAttribute('type', 'radio');
        radioBtn.setAttribute('name', 'geoTypeSelector');
        radioBtn.setAttribute('value', name);
        this.setupAutocompleteTypesListener(radioBtn, types);
        gridDiv.appendChild(radioBtn);

        let radioBtnLabel = document.createElement('label');
        radioBtnLabel.htmlFor = 'id' + name;
        radioBtnLabel.setAttribute('style', 'margin-top: -6px; font-weight: 400;');
        radioBtnLabel.innerHTML = name;
        gridDiv.appendChild(radioBtnLabel);
    },
    initMap: function () {
        if (!this.mainContainer || this.map)
            return;

        // Adding the container that will display the map
        this.mapContainer = document.createElement('div');
        this.mapContainer.setAttribute('style', 'height: 60vh; border-radius: 5px;');
        this.mainContainer.appendChild(this.mapContainer);

        // Solar MD coordinates (By default)
        let location = {lat: -33.863061, lng: 18.52348};
        
        this.markerOnIconUrl = mu.getContextPath() + this.markerOnIconUrl;
        this.markerOffIconUrl = mu.getContextPath() + this.markerOffIconUrl;
        this.markerPlantIconUrl =  mu.getContextPath() + this.markerPlantIconUrl,
        this.markerClusterUrl =  mu.getContextPath() + this.markerClusterUrl,

        this.markerOnlineIcon = new google.maps.MarkerImage(
                // Url: Icon url.
                this.markerOnIconUrl,
                // Size: This marker icon size is 26 pixels wide by 44 pixels high.
                new google.maps.Size(26, 44),
                // Origin: The origin for this image is (0, 0).
                new google.maps.Point(0, 0),
                // Anchor: The anchor for this image is the base of the online marker at (13, 44).
                new google.maps.Point(13, 44)
                );

        this.markerOfflineIcon = new google.maps.MarkerImage(
                // Url: Icon url.
                this.markerOffIconUrl,
                // Size: This marker icon size is 26 pixels wide by 44 pixels high.
                new google.maps.Size(26, 44),
                // Origin: The origin for this image is (0, 0).        
                new google.maps.Point(0, 0),
                // The anchor for this image is the base of the offline marker at (13, 44).
                new google.maps.Point(13, 44)
                );

        this.markerPlantIcon = new google.maps.MarkerImage(
                // Url: Icon url.
                this.markerPlantIconUrl,
                // Size: This marker icon size is 26 pixels wide by 44 pixels high.
                new google.maps.Size(36, 58),
                // Origin: The origin for this image is (0, 0).        
                new google.maps.Point(0, 0),
                // The anchor for this image is the base of the plant marker at (13, 44).
                new google.maps.Point(18, 58)
                );

        this.map = new google.maps.Map(this.mapContainer, {
            center: location,
            zoom: 15
        });
        
        this.getCurrentLocation();
        
        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        if (!this.autocomplete)
            return;
        
        this.autocomplete.bindTo('bounds', this.map);
    },
    updatePosition: function (marker) {
        if (!marker)
            return;

        let pos = marker.getPosition();
        if (!pos)
            return;

        // BOMC. GEOCODER This code should be commented, only useful for demo-coding purposes
//        let geocoder = new google.maps.Geocoder();
//        geocoder.geocode({latLng: pos}, function(results, status) {
//            if (status == google.maps.GeocoderStatus.OK) {
//                console.log(JSON.stringify(results));
//            } 
//            else {
//                console.log('No results');
//            }
//        });

        this.markers[0].lat = pos.lat();
        this.markers[0].lng = pos.lng();
        this.markers[0].placeID = null;

        this.updateLocation();
    },
    getCurrentLocation: function () {
        // Trying HTML5 geolocation.
        if (navigator.geolocation) {
            // Getting our current geolocation
            let geoManager = this;
            navigator.geolocation.getCurrentPosition(function (position) {
                geoManager.map.setCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            }, function () {
                mainUtils.showWarningMessage('It was not possible getting your current position', 'Logger Location');
            });
        } else {
            // Browser doesn't support Geolocation
            mainUtils.showWarningMessage('Browser does not support Geolocation', 'Logger Location');
        }
    },
    initMapWithData: function (data) {
        this.initMap();
        this.populateGoogleMarkets(data);
        this.runOnUpdateStatus();
    },

    /**
     *
     * @param {type} data
     * {
     *      markers: [...],         // List of markers with their data
     *      path: '...',            // Root Path of the images that will displayed on the Info Window of the logger
     *      links: [
     *		{text: '...',       // Text that will be displayed on the link that has been added dynamically    
     *		link: '...',        // Java Script function that will be called when the link is called
     *		properties: [...]}  // Name of the dynamic parameters that will be populate in the above detailed link
     *      ]
     * } 
     * @returns {undefined}
     */
    setData: function (data) {
        if (!data)
            return;
        if (data.markers) {
            // For displaying purposes we only need the markers which have coordinates in order to be displayed
            if (data.markers.length > 1)
                this.markers = data.markers.filter(function (e) {
                    return e.lat && e.lng;
                });
            else
                this.markers = data.markers;
        }

        if (data.path)
            this.path = data.path;
    },

    populateGoogleMarkets: function (data) {
        if (data) {
            this.setData(data);
        }
        if (!this.markers || !this.markers.length) {
            this.getCurrentLocation();
            return;
        }
        // There is no need to generate a Device marker without valid coordinates
        // Only valid for Device Location Editing purposes
        if (this.markers.length === 1 && !this.markers[0].lat && !this.markers[0].lng) {
            this.getCurrentLocation();
            return;
        }

        // Get the boundaries of the Map.
        // Required for setting the center and zoom of the map when is populated with several martkers
        this.latlngbounds = new google.maps.LatLngBounds();
        for (let i = 0; i < this.markers.length; i++) {
            let marker = new google.maps.Marker({
                map: this.map,
                position: {lat: this.markers[i].lat, lng: this.markers[i].lng},
                icon: this.getIcon(this.markers[i]),
                title: this.getMarkerTitle(this.markers[i])
            });
            this.latlngbounds.extend(marker.position);
            this.addListeners(marker, i);
            this.googleMarkers.push(marker);
        }

        let geoManager = this;

        // Only valid for Device Location Editing purposes
        // Allowing the user to define the new logger location, 
        // if the provided by the google autocomplete gadget is not the right one
        if (this.markers.length === 1) {
            this.googleMarkers[0].setDraggable(true);
            google.maps.event.addListener(this.googleMarkers[0], 'dragend', function () {
                geoManager.updatePosition(geoManager.googleMarkers[0]);
            });
        }

        // With this option we don't see that animation indicating the change of logger status
//            if (window.MarkerClusterer)
//                this.markerCluster = new MarkerClusterer(this.map, this.googleMarkers, { imagePath: this.markerClusterUrl });

        if (this.markers.length > 1) {
            // Center map and adjust Zoom based on the position of all markers.
            this.map.setCenter(this.latlngbounds.getCenter());
            this.map.fitBounds(this.latlngbounds);
            return;
        }

        this.map.setCenter(this.googleMarkers[0].position);
        this.map.setZoom(17);
    },

    // Updating the google maps bounds externally
    fitBounds: function () {
        if (!this.map || !this.googleMarkers || !this.googleMarkers.length)
            return;

        if (this.markers.length === 1) {
            this.map.setCenter(this.googleMarkers[0].position);
            this.map.setZoom(17);
            return;
        }

        if (!this.latlngbounds) {
            this.latlngbounds = new google.maps.LatLngBounds();
            for (let i = 0; i < this.googleMarkers.length; i++) {
                this.latlngbounds.extend(this.googleMarkers[i].podition);
            }
        }

        this.map.setCenter(this.latlngbounds.getCenter());
        this.map.fitBounds(this.latlngbounds);
    },

    getIcon: function (info) {
        if (info && info.profile) {
            return this[this.getProfile(info).icon];
        }
        return this[this.profiles[this.profile].icon];
    },

    addAutoComplete: function () {
        if (!this.autoCompleteInput)
            return;

        this.autocomplete = new google.maps.places.Autocomplete(this.autoCompleteInput);

        // Set the data fields to return when the user selects a place.
        this.autocomplete.setFields(['place_id', 'geometry', 'name']);

        let geoManager = this;
        this.autocomplete.addListener('place_changed', function () {
            let place = this.getPlace();
            if (!place.geometry) {
                mainUtils.showWarningMessage('No details available for input: [' + place.name + ']', 'Logger Location');
//                window.alert('No details available for input: [' + place.name + ']');
                return;
            }

            // Initializing our marker if it doesn't exist
            if (geoManager.googleMarkers.length === 0) {
                let marker = new google.maps.Marker({
                    map: geoManager.map,
                    anchorPoint: new google.maps.Point(0, -29),
                    icon: geoManager.getIcon(),
                    title: geoManager.getMarkerTitle(geoManager.markers[0])
                });
                geoManager.addListeners(marker, 0);
                geoManager.googleMarkers.push(marker);
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                geoManager.map.fitBounds(place.geometry.viewport);
            } else {
                geoManager.map.setCenter(place.geometry.location);
                geoManager.map.setZoom(17);  // Why 17? Because it looks good.
            }

            // Again we have available a place ID
            geoManager.googleMarkers[0].setPosition(place.geometry.location);
            geoManager.updateInfoMarker(place);
            geoManager.updateLocation();
        });
    },
    setupAutocompleteTypesListener: function (input, types) {
        if (!input || !types)
            return;

        let geoManager = this;
        input.addEventListener('click', function () {
            geoManager.autocomplete.setTypes(types);
        });
    },
    setupAutocompleteStrictListener: function (id) {
        if (!id)
            return;

        let strictListener = document.getElementById(id);
        if (!strictListener)
            return;

        let geoManager = this;
        strictListener.addEventListener('click', function () {
            geoManager.autocomplete.setOptions({strictBounds: this.checked});
        });
    },
    updateStrictBounds: function () {
        this.strictBounds = !this.strictBounds;
        console.log('StrictBounds: ' + this.strictBounds);
        this.autocomplete.setOptions({strictBounds: this.strictBounds});
    },
    addInfowindow: function () {
        let content = document.createElement('div');

        let title = document.createElement('h2');
        title.id = this.infoIDs.title;
        title.style.color = 'grey';
        content.appendChild(title);

        let description = document.createElement('p');
        description.id = this.infoIDs.description;
        description.style.lineHeight = '1.6';
        description.style.textIndent = '2em';
        content.appendChild(description);

        let slideshow = document.createElement('div');
        content.appendChild(slideshow);
        this.slideshowManager = new SlideshowManager(slideshow, {image_slide: 'image_slide_map'});

        let address = document.createElement('p');
        address.id = this.infoIDs.address;
        address.style.color = 'grey';
        address.style.fontWeight = 'bold';
        content.appendChild(address);

        let dymanicLinks = document.createElement('div');
        dymanicLinks.id = this.infoIDs.dynamicLinks;
        content.appendChild(dymanicLinks);

        let viewOnMap = document.createElement('p');
        content.appendChild(viewOnMap);
        let viewOnMapLink = document.createElement('a');
        viewOnMapLink.id = this.infoIDs.viewOnMap;
        viewOnMapLink.target = '_blank';
        viewOnMapLink.rel = 'noopener';
        viewOnMapLink.style.cursor = 'pointer';
        viewOnMapLink.style.color = '#427FED';
        viewOnMapLink.style.textDecoration = 'none';
        viewOnMapLink.innerHTML = 'View on Google Maps';
        viewOnMap.appendChild(viewOnMapLink);

        let getDirections = document.createElement('p');
        content.appendChild(getDirections);
        let getDirectionsLink = document.createElement('a');
        getDirectionsLink.id = this.infoIDs.getDirections;
        getDirectionsLink.target = '_blank';
        getDirectionsLink.rel = 'noopener';
        getDirectionsLink.style.cursor = 'pointer';
        getDirectionsLink.style.color = '#427FED';
        getDirectionsLink.style.textDecoration = 'none';
        getDirectionsLink.innerHTML = 'Get directions';
        getDirections.appendChild(getDirectionsLink);

        this.infowindow = new google.maps.InfoWindow({
            content: content
        });
        // The info window is no longer part of the DOM document
        this.slideshowManager.setContainer(this.infowindow.content);
    },
    /**
     * Adding the provided links dynamically
     * @param {type} content
     * @param {type} info
     * @returns {undefined}
     */
    populateLinks: function (content, info) {
        if (!content || !info)
            return;

        let linkContainer = content.querySelector('#' + this.infoIDs.dynamicLinks);
        if (!linkContainer) {
            return;
        }

        while (linkContainer.firstChild) {
            linkContainer.removeChild(linkContainer.lastChild);
        }

        let profile = this.getProfile(info);
        if (!profile || !profile.links) {
            return;
        }

        let links = profile.links;

        for (let i = 0; i < links.length; i++) {
            let p = document.createElement('p');
            linkContainer.appendChild(p);
            let link = document.createElement('a');
            link.style.cursor = 'pointer';
            link.style.color = '#427FED';
            link.style.textDecoration = 'none';
            link.innerHTML = links[i].text;

            let href = links[i].link;
            for (let j = 0; j < links[i].properties.length; j++) {
                if (info[links[i].properties]) {
                    href = href.replace(new RegExp('@' + links[i].properties[j] + '@', 'g'), info[links[i].properties[j]]);
                }
            }
            link.href = href;
            p.appendChild(link);
        }
    },
    addListeners: function (marker, index) {
        if (!marker || index === null || isNaN(index) || index < 0)
            return;

        let geoManager = this;
        marker.addListener('click', function () {
            geoManager.openInfoWindow(this, index);
        });
    },
    openInfoWindow: function (marker, index) {
        if (!this.infowindow || !this.infowindow.content)
            return;

        let info = this.editedMarker ? this.editedMarker : this.markers[index];
        if (!info)
            return;

        if (!this.updateInfoWindow(info))
            return;

        this.infowindow.open(this.map, marker);
    },
    updateInfoWindow: function (info) {
        if (!this.infowindow || !this.infowindow.content)
            return;

        let content = this.infowindow.content;
        let updated = false;

        // Updating Info Window content
        let title = content.querySelector('#' + this.infoIDs.title);
        if (title) {
            title.innerHTML = this.getInfoWindowTitle(info);
            updated = true;
        }

        let description = content.querySelector('#' + this.infoIDs.description);
        if (description && info.description) {
            description.innerHTML = info.description;
            updated = true;
        }

        this.updateSlideShow(info);
        this.populateLinks(content, info);

        let searchParams = '';
        let dirParams = '';

        // If there is no place ID, we don't trust the location provided by the google autocomplete component and we play with pure coordinates
        if (!info.placeID && info.lat && info.lng) {
            searchParams += '&query=' + info.lat + ',' + info.lng;
            dirParams += '&destination=' + info.lat + ',' + info.lng;
        } else {
            searchParams += '&query_place_id=' + info.placeID;
            dirParams += '&destination_place_id=' + info.placeID;
        }

        let installationAddress = info.installationAddress;
        if (!installationAddress || !installationAddress.trim().length) {
            installationAddress = info.address;
        }

        if (installationAddress) {
            let address = content.querySelector('#' + this.infoIDs.address);
            if (address) {
                address.innerHTML = installationAddress;
                updated = true;
            }

            if (info.placeID) {
                let googleAddress = installationAddress.replace(new RegExp(',', 'g'), '%2C');
                googleAddress = googleAddress.replace(new RegExp(' ', 'g'), '+');
                searchParams += '&query=' + googleAddress;
                dirParams += '&destination=' + googleAddress;
            }
        }

        if (searchParams) {
            let viewOnMap = content.querySelector('#' + this.infoIDs.viewOnMap);
            if (viewOnMap) {
                viewOnMap.href = 'https://www.google.com/maps/search/?api=1' + searchParams;
                updated = true;
            }
        }
        if (dirParams) {
            let getDirections = content.querySelector('#' + this.infoIDs.getDirections);
            if (getDirections) {
                getDirections.href = 'https://www.google.com/maps/dir/?api=1' + dirParams;
                updated = true;
            }
        }
        return updated;
    },
    updateSlideShow: function (info) {
        if (!this.slideshowManager || !info)
            return;

        if (!info.image || !info.markerId || !this.path) {
            this.slideshowManager.clearImages();
            return;
        }

        let images = info.image.split(':');
        for (let i = 0; i < images.length; i++) {
            images[i] = this.path + info.markerId.replace(new RegExp(':', 'g'), '-') + '/' + images[i];
        }
        this.slideshowManager.updateImages(images);
    },
    getMarkerTitle: function (info) {
        if (!info)
            return '';
        let profile = this.getProfile(info);
        for (let i = 0; i < profile.markerTitle.length; i++) {
            if (info[profile.markerTitle[i]])
                return info[profile.markerTitle[i]];
        }

        // Default value
        if (info.markerId)
            return info.markerId;
        return '';
    },
    getInfoWindowTitle: function (info) {
        if (!info)
            return '';
        let profile = this.getProfile(info);

        let title = profile.infoWindowTitle.text;
        let properties = profile.infoWindowTitle.properties;
        if (title && properties) {
            for (let i = 0; i < properties.length; i++) {
                title = title.replace(new RegExp('@' + properties[i] + '@', 'g'), info[properties[i]]);
            }
        }

        if (title)
            return title;

        // Default value
        if (info.markerId)
            return info.markerId;
        return '';
    },
    addImageMarker: function (image) {
        if (!image || !image.image || !image.image.length || !this.infowindow || !this.infowindow.content)
            return;

        if (this.markers && this.markers.length > 1) {
            window.alert('This map is only for editing information purposes.');
            return;
        }

        if (!this.markers[0].image)
            this.markers[0].image = '';

        if (this.markers[0].image.includes(image.image))
            return;

        if (this.markers[0].image.length === 0)
            this.markers[0].image += image.image;
        else
            this.markers[0].image += ':' + image.image;

        this.slideshowManager.addImageAndRefresh(this.path + this.markers[0].markerId.replace(new RegExp(':', 'g'), '-') + '/' + image.image);
    },
    removeImageMarker: function (index) {
        if (index === null || index === undefined || !this.infowindow || !this.infowindow.content || !this.slideshowManager)
            return;

        if (this.markers && this.markers.length > 1) {
            window.alert('This map is only for editing information purposes.');
            return;
        }

        if (!this.markers[0].image)
            return;

        let images = this.markers[0].image.split(':');
        if (index < 1 || index > images.length)
            return;

        images.splice(index - 1, 1);

        if (images.length === 0)
            this.markers[0].image = null;
        else
            this.markers[0].image = images.join(':');
        this.slideshowManager.deleteImage(index);

    },
    clearImageSlideShow: function (slideshow) {
        slideshow.innerHTML = '';

        let content = this.infowindow.content;
        let controls = content.querySelector('.controls_map');
        controls.style.display = 'none';
        controls.innerHTML = '';
    },
    updateInfoMarker: function (place) {
        if (!place)
            return;

        if (this.markers && this.markers.length > 1) {
            window.alert('This map is only for editing information purposes.');
            return;
        }

        this.updatePropertyMarker('installationAddress', this.autoCompleteInput);
        this.updatePropertyMarker('address', this.autoCompleteInput);

        if (place.place_id) {
            this.markers[0].placeID = place.place_id;
        }

        if (place.geometry && place.geometry.location && place.geometry.location.lat() && place.geometry.location.lng()) {
            this.markers[0].lat = place.geometry.location.lat();
            this.markers[0].lng = place.geometry.location.lng();
        }
    },
    /**
     * Updating the specified marker property with the value of the input identified by the provided id
     * @param {type} property
     * @param {type} id
     * @returns {undefined}
     */
    updatePropertyMarker: function (property, input) {
        if (!input || !input.value)
            return;

        if (this.markers && this.markers.length > 1) {
            window.alert('This map is only for editing information purposes.');
            return;
        }

        this.markers[0][property] = input.value;
        this.editedMarker = this.markers[0];
        this.updateInfoWindow(this.editedMarker);
    },
    /**
     * Updating the latitude and longitude coordinates for the selected marker
     * @returns {undefined}
     */
    updateLocation: function () {
        if (this.markers && this.markers.length > 1) {
            window.alert('This map is only for editing information purposes.');
            return;
        }

        let data = [
            {name: 'markerId', value: this.markers[0].markerId},
            {name: 'position', value: this.googleMarkers[0].position},
            {name: 'lat', value: this.markers[0].lat},
            {name: 'lng', value: this.markers[0].lng}];
        if (this.markers[0].placeID) {
            data.push({name: 'placeID', value: this.markers[0].placeID});
        }
        if (this.autoCompleteInput && this.autoCompleteInput.value) {
            data.push({name: 'address', value: this.autoCompleteInput.value});
        }

        this.runOnUpdateLocation(data);

        // Important for updating realtime the Logger Marker Window Info content
        this.editedMarker = this.markers[0];
        this.updateInfoWindow(this.editedMarker);
    },

    externalUpdateLocation: function (data) {
        if (!data) {
            return;
        }
        let markerId = data.find(function (e) {
            return e.name === 'markerId';
        });
        if (markerId) {
            markerId = markerId.value;
        }
        if (!markerId) {
            return;
        }
        let position = data.find(function (e) {
            return e.name === 'position';
        });
        if (position) {
            position = position.value;
        }
        if (!position) {
            return;
        }
        let index = this.markers.findIndex(function (e) {
            return e.markerId === markerId;
        });
        if (index === -1) {
            return;
        }
        this.googleMarkers[index].setPosition(position);
    },

    updateLoggersStatus: function (data) {
//        console.log('Updating Loggers status');
        if (!data || !this.markers || !this.markers.length || !this.googleMarkers || !this.googleMarkers.length)
            return;

        let geoManager = this;
        for (let i in data) {
            let index = this.markers.findIndex(function (e) {
                return e.markerId === i;
            });
            if (index === -1)
                continue;
            let status = data[i];
            if (status === 0) {
                // If its previous icon was the online one, there is not need for a graphical update
                if (this.googleMarkers[index].icon.url === this.markerOnIconUrl)
                    continue;

                this.googleMarkers[index].setIcon(this.markerOnlineIcon);
//                this.googleMarkers[index].setAnimation(google.maps.Animation.DROP);
                this.googleMarkers[index].setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function () {
                    geoManager.googleMarkers[index].setAnimation(null);
                }, 1500);
                if (this.googleMarkers[index].title.includes('(Last seen:'))
                    this.googleMarkers[index].setTitle(this.getMarkerTitle(this.markers[index]));
            } else {
                if (status > 0 && window.moment) {
                    this.googleMarkers[index].setTitle(this.getMarkerTitle(this.markers[index]) + ' (Last seen: ' + moment.duration(status * -1, "milliseconds").humanize(true) + ' )');
                } else if (this.googleMarkers[index].title.includes('(Last seen:')) {
                    this.googleMarkers[index].setTitle(this.getMarkerTitle(this.markers[index]));
                }

                // If its previous icon was the offline one, there is not need for a graphical update
                if (this.googleMarkers[index].icon.url === this.markerOffIconUrl)
                    continue;

                this.googleMarkers[index].setIcon(this.markerOfflineIcon);
                this.googleMarkers[index].setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function () {
                    geoManager.googleMarkers[index].setAnimation(null);
                }, 1500);
            }
        }
    }
};

// Exporting Symbols for Closure
// If we are not going to compile with closure then we can remove the code below.
window['GeoManager'] = GeoManager;

// TODO. BOMC Still missing factory function and immediately invoked function protection
