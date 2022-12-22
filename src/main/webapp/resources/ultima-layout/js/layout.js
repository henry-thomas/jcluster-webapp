/** 
 * PrimeFaces Ultima Layout
 */
PrimeFaces.widget.Ultima = PrimeFaces.widget.BaseWidget.extend({
    
    init: function(cfg) {
        this._super(cfg);
        this.wrapper = $(document.body).find('.layout-wrapper');
        this.topbar = this.wrapper.find('.topbar');
        this.menu = this.jq;
        this.menuWrapper = this.menu.closest('.layout-menu');
        this.menulinks = this.menu.find('a');
        this.expandedMenuitems = this.expandedMenuitems || [];
        this.rightPanel = this.wrapper.children('.layout-rightpanel');
        this.layoutMask = this.wrapper.children('.layout-mask');
        this.profileButton = $('#profile-options');
        this.profileMenu = $('#profile-menu');
        this.topbarItems = this.topbar.find('.topbar-items');
        this.topbarLinks = this.topbarItems.find('> li > a');
        this.menuButton = $('#menu-button');
        this.topbarMenuButton = $('#topbar-menu-button');
        this.rightPanelButton = $('#rightpanel-menu-button');
        this.menuActive = false;
        this.topbarLinkClick = false;
        this.topbarMenuClick = false;
        this.menuClick = false;
        this.menuButtonClick = false;
        this.isMobileDev = this.isMobileDevice();
        this.isRTL = this.wrapper.hasClass('layout-rtl');

        this.configButton = $('#layout-config-button');
        this.configMenu = $('#layout-config');
        this.configMenuClose = this.configMenu.find('> .layout-config-content > .layout-config-close');
        
        if(this.wrapper.hasClass('layout-menu-slim')) {
            this.profileButton = $('.profile');
        }

        this._bindEvents();
        
        this.restoreMenuState();
    },
    
    _bindEvents: function() {
        var $this = this;
        
        this.menuWrapper.off('click.menu').on('click.menu', function(e) {
            $this.menuClick = true;
        });
        
        this.menuButton.off('click.menuButton').on('click.menuButton', function(e) {
            $this.menuButton.toggleClass('menu-button-rotate');
            $this.topbarItems.removeClass('topbar-items-visible');
            $this.menuButtonClick = true;
            
            //overlay
            if($this.wrapper.hasClass('menu-layout-overlay')) {
                $this.wrapper.toggleClass('layout-menu-overlay-active');
                
                if($this.wrapper.hasClass('layout-menu-overlay-active')) {
                    $this.enableModal();
                    $this.enableSwipe();
                }
                else {
                    $this.disableModal();
                    $this.disableSwipe();
                }
            }
            //static
            else {
                if($this.isDesktop()) {
                    $this.wrapper.toggleClass('layout-menu-static-inactive')
                }
                else {
                    if($this.wrapper.hasClass('layout-menu-static-active')) {
                        $this.wrapper.removeClass('layout-menu-static-active');
                        $this.disableModal();
                        $this.disableSwipe();
                    }
                    else {
                        $this.wrapper.addClass('layout-menu-static-active');
                        $this.wrapper.removeClass('layout-menu-static-inactive');
                        $this.enableModal();
                        $this.enableSwipe();
                    }
                }
                
                setTimeout(function() {
                    $(window).trigger('resize');
                }, 200);  
            }
            
            e.preventDefault();
        });
        
        this.topbarMenuButton.off('click.topbarButton').on('click.topbarButton', function(e) {
            $this.topbarMenuClick = true;
            $this.topbarItems.find('ul').removeClass('fadeInDown fadeOutUp');
            $this.closeOverlayMenu();

            if($this.topbarItems.hasClass('topbar-items-visible')) {
                $this.topbarItems.addClass('fadeOutUp');
                
                setTimeout(function() {
                    $this.topbarItems.removeClass('fadeOutUp topbar-items-visible');
                },500);
            }
            else {
                $this.topbarItems.addClass('topbar-items-visible fadeInDown');
            }
            
            $this.rightPanel.removeClass('layout-rightpanel-active');
            $this.rightPanelButton.removeClass('rightpanel-btn-active');
            
            e.preventDefault();
        });
        
        this.rightPanelButton.off('click.rightpanel').on('click.rightpanel', function(e) {
            $this.rightPanelButtonClick = true;
            $this.rightPanel.toggleClass('layout-rightpanel-active');
            $this.closeOverlayMenu();
            
            e.preventDefault();
        });
        
        this.rightPanel.off('click.rightpanel').on('click.rightpanel', function(e) {
            $this.rightPanelClick = true;
        });
        
        this.menulinks.off('click.menu').on('click.menu', function(e) {
            var link = $(this),
            item = link.parent(),
            submenu = item.children('ul'),
            horizontal = $this.isHorizontal() && $this.isDesktop();
            
            if($this.isSlim() && item.parent().hasClass('ultima-menu')) {
                if(item.hasClass('active-menuitem')) {
                    if(submenu.length) {
                        $this.removeMenuitem(item.attr('id'));
                        item.removeClass('active-menuitem');
                        submenu.hide();
                    }
                    
                    if(item.parent().is($this.jq)) {
                        $this.menuActive = false;
                    }
                }
                else {
                    $this.deactivateItems(item.siblings(), false);
                    item.addClass('active-menuitem');
                    $this.addMenuitem(item.attr('id'));
                    submenu.show();

                    $this.updateSubPosOnSlimMenu(submenu, item);
                    
                    if(item.parent().is($this.jq)) {
                        $this.menuActive = true;
                    }
                }
            }
            else {
                if(item.hasClass('active-menuitem')) {
                    if(submenu.length) {
                        $this.removeMenuitem(item.attr('id'));
                        item.removeClass('active-menuitem');
                        
                        if(horizontal) {
                            if(item.parent().is($this.jq)) {
                                $this.menuActive = false;
                            }
                            
                            submenu.hide();
                        }
                        else {
                            submenu.slideUp();
                        }
                    }
                }
                else {
                    $this.addMenuitem(item.attr('id'));
                    
                    if(horizontal) {
                        $this.deactivateItems(item.siblings());
                        item.addClass('active-menuitem');
                        $this.menuActive = true;
                        submenu.show();
                    }
                    else {
                        $this.deactivateItems(item.siblings(), true);
                        $this.activate(item);
                    }
                }
                
                if($this.isSlim()) {
                    var activeParentItem = submenu.parents('.active-menuitem:last');
                    setTimeout(function() {
                        $this.updateSubPosOnSlimMenu(activeParentItem.children('ul'), activeParentItem);
                    }, 350);
                }
            }
                                    
            if(submenu.length) {
                e.preventDefault();
            }
        });
        
        this.menu.find('> li').off('mouseenter.menu').on('mouseenter.menu', function(e) {    
            if(($this.isHorizontal() && $this.isDesktop()) || $this.isSlim()) {
                var item = $(this);
                
                if(!item.hasClass('active-menuitem')) {
                    $this.menu.find('.active-menuitem').removeClass('active-menuitem');
                    $this.menu.find('ul:visible').hide();
                    $this.menu.find('.ink').remove();
                    
                    if($this.menuActive) {
                        item.addClass('active-menuitem');
                        item.children('ul').show();
                    }
                }
            }
        });
        
        this.profileButton.off('click.profileButton').on('click.profileButton', function(e) {
            var profile = $this.profileMenu.prev('.profile'),
            expanded = profile.hasClass('profile-expanded');
            
            if($this.isSlim()) {
                $this.deactivateItems($this.menu.children('.active-menuitem'), false);
            }
            
            $this.profileMenu.slideToggle();
            
            $this.profileMenu.prev('.profile').toggleClass('profile-expanded');
            
            if($this.cfg.stateful) {
                $this.setInlineProfileState(!expanded);
            }
            
            e.preventDefault();
        });
        
        this.topbarLinks.off('click.topbarLink').on('click.topbarLink', function(e) {
            var link = $(this),
            item = link.parent(),
            submenu = link.next();
            
            $this.topbarLinkClick = true;

            item.siblings('.active-top-menu').removeClass('active-top-menu');
            $this.closeOverlayMenu();

            if($this.isDesktop()) {
                if(submenu.length) {
                    if(item.hasClass('active-top-menu')) {
                        submenu.addClass('fadeOutUp');
                        
                        setTimeout(function() {
                            item.removeClass('active-top-menu'),
                            submenu.removeClass('fadeOutUp');
                        },500);
                    }
                    else {
                        item.addClass('active-top-menu');
                        submenu.addClass('fadeInDown');
                    }
                }
            }
            else {
                item.children('ul').removeClass('fadeInDown fadeOutUp');
                item.toggleClass('active-top-menu');
            }
            
            var href = link.attr('href');
            if(href && href !== '#') {
                window.location.href = href;
            }
            
            e.preventDefault();         
        });
        
        $this.topbarItems.children('.search-item').off('click.topbar').on('click.topbar', function(e) {
            $this.topbarLinkClick = true;
        });

        this.bindConfigEvents();
        
        $(document.body).off('click.layoutBody').on('click.layoutBody', function(e) {
            if(($this.isHorizontal() || $this.isSlim()) && !$this.menuClick && $this.isDesktop()) {
                $this.menu.find('.active-menuitem').removeClass('active-menuitem');
                $this.menu.find('ul:visible').hide();
                $this.menuActive = false;
            }
            
            if(!$this.topbarMenuClick && !$this.topbarLinkClick) {
                $this.topbarItems.find('.active-top-menu').removeClass('active-top-menu');
            }
            
            if(!$this.menuClick && $this.isSlim()) {
                $this.deactivateItems($this.menu.children('.active-menuitem'), false);
            }
            
            if(!$this.rightPanelClick && !$this.rightPanelButtonClick && $this.rightPanel.hasClass('layout-rightpanel-active') && !$this.isDatePickerPanelClicked() && !$this.isOverlayInputPanelClicked(e)) {
                $this.rightPanel.removeClass('layout-rightpanel-active');
                $this.rightPanelButton.removeClass('rightpanel-btn-active');
            }
            
            if(!$this.topbarMenuClick && !$this.topbarLinkClick) {
                $this.topbarItems.removeClass('topbar-items-visible');
            }

            if (!$this.configMenuClicked) {
                $this.configMenu.removeClass('layout-config-active');
            }
                        
            $this.menuClick = false;
            $this.menuButtonClick = false;
            $this.topbarLinkClick = false;
            $this.topbarMenuClick = false;
            $this.rightPanelClick = false;
            $this.rightPanelButtonClick = false;
            $this.configMenuClicked = false;
        });
    },

    bindConfigEvents: function() {
        var $this = this;
        var changeConfigMenuState = function(e) {
            this.toggleClass(this.configMenu, 'layout-config-active');
            
            this.configMenuClicked = true;
            e.preventDefault();
        };
        
        this.configButton.off('click.config').on('click.config', changeConfigMenuState.bind(this));
        this.configMenuClose.off('click.config').on('click.config', changeConfigMenuState.bind(this));
        
        this.configMenu.off('click.rightpanel').on('click.rightpanel', function() {
            $this.configMenuClicked = true;
        });
    },

    isDatePickerPanelClicked: function() {
        if ($.datepicker) {
            var input = $($.datepicker._lastInput);
            if (input.closest('.layout-rightpanel').length && $('#ui-datepicker-div').is(':visible')) {
                return true;
            }
        }
        return false;
    },
    
    isOverlayInputPanelClicked: function(e) {
        var el = $(e.target),
        panel = el.closest('.ui-input-overlay');
        if(panel.length) {
            var inputId = panel.attr('id').replace(/_panel/g, '');
            input = $(PrimeFaces.escapeClientId(inputId));

            if(input.length && input.closest('.layout-rightpanel').length) {
                return true;
            }
        }
        return false;
    },
    
    updateSubPosOnSlimMenu: function(submenu, item) {
        submenu.removeClass('submenu-top');
        
        var win = $(window),
        h = win.innerHeight()||$(document).height(),
        top = item.offset().top - win.scrollTop(),
        submenuHeight = submenu.height();

        if(top + submenuHeight > h && top >= submenuHeight) {
            submenu.addClass('submenu-top');
        }
    },
    
    closeOverlayMenu: function() {
        var $this = this;
        
        if($this.wrapper.hasClass('layout-menu-overlay-active')||$this.wrapper.hasClass('layout-menu-static-active')) {
            $this.menuButton.removeClass('menu-button-rotate');
            $this.wrapper.removeClass('layout-menu-overlay-active layout-menu-static-active');
            $this.disableModal();
        }
    },
    
    activate: function(item) {
        var submenu = item.children('ul');
        item.addClass('active-menuitem');

        if(submenu.length) {
            submenu.slideDown();
        }
    },
    
    deactivate: function(item) {
        var submenu = item.children('ul');
        item.removeClass('active-menuitem');
        
        if(submenu.length) {
            submenu.hide();
        }
    },
        
    deactivateItems: function(items, animate) {
        var $this = this;
        
        for(var i = 0; i < items.length; i++) {
            var item = items.eq(i),
            submenu = item.children('ul');
            
            if(submenu.length) {
                if(item.hasClass('active-menuitem')) {
                    var activeSubItems = item.find('.active-menuitem');
                    item.removeClass('active-menuitem');
                    item.find('.ink').remove();
                    
                    if(animate) {
                        submenu.slideUp('normal', function() {
                            $(this).parent().find('.active-menuitem').each(function() {
                                $this.deactivate($(this));
                            });
                        });
                    }
                    else {
                        submenu.hide();
                        item.find('.active-menuitem').each(function() {
                            $this.deactivate($(this));
                        });
                    }
                    
                    $this.removeMenuitem(item.attr('id'));
                    activeSubItems.each(function() {
                        $this.removeMenuitem($(this).attr('id'));
                    });
                }
                else {
                    $this.removeMenuitem(item.attr('id'));
                    item.find('.active-menuitem').each(function() {
                        var subItem = $(this);
                        $this.deactivate(subItem);
                        $this.removeMenuitem(subItem.attr('id'));
                    });
                }
            }
            else if(item.hasClass('active-menuitem')) {
                $this.deactivate(item);
                $this.removeMenuitem(item.attr('id'));
            }
        }
    },
            
    removeMenuitem: function (id) {
        this.expandedMenuitems = $.grep(this.expandedMenuitems, function (value) {
            return value !== id;
        });
        
        if(this.cfg.stateful) {
            this.saveMenuState();
        }
    },
    
    addMenuitem: function (id) {
        if ($.inArray(id, this.expandedMenuitems) === -1) {
            this.expandedMenuitems.push(id);
        }
        
        if(this.cfg.stateful) {
            this.saveMenuState();
        }
    },
    
    saveMenuState: function() {
        $.cookie('ultima_expandeditems', this.expandedMenuitems.join(','), {path: '/'});
    },
    
    clearMenuState: function() {
        this.expandedMenuitems = [];
        $.removeCookie('ultima_expandeditems', {path: '/'});
    },
    
    setInlineProfileState: function(expanded) {
        if(expanded)
            $.cookie('ultima_inlineprofile_expanded', "1", {path: '/'});
        else
            $.removeCookie('ultima_inlineprofile_expanded', {path: '/'});
    },
    
    restoreMenuState: function() {
        var isHorizontalMenu = this.wrapper.hasClass('menu-layout-horizontal');
        var isSlimMenu = this.wrapper.hasClass('layout-menu-slim');

        if (this.cfg.stateful && !isHorizontalMenu && !isSlimMenu) {
            var menucookie = $.cookie('ultima_expandeditems');
            if (menucookie) {
                this.clearActiveItems();
                
                this.expandedMenuitems = menucookie.split(',');
                for (var i = 0; i < this.expandedMenuitems.length; i++) {
                    var id = this.expandedMenuitems[i];
                    if (id) {
                        var menuitem = $("#" + this.expandedMenuitems[i].replace(/:/g, "\\:"));
                        menuitem.addClass('active-menuitem');
                        
                        var submenu = menuitem.children('ul');
                        if(submenu.length) {
                            submenu.show();
                        }
                    }
                }
            }
        }
            
        var inlineProfileCookie = $.cookie('ultima_inlineprofile_expanded');
        if (inlineProfileCookie) {
            this.profileMenu.show().prev('.profile').addClass('profile-expanded');
        }
    },

    clearLayoutState: function() {
        this.clearMenuState();
        this.clearActiveItems();

        this.setInlineProfileState(false);
        this.profileMenu.hide().prev('.profile').removeClass('profile-expanded');
    },
    
    enableModal: function() {
        var $this = this;
        var mask = $('<div class="layout-mask"></div>').on('click', function() {
            $this.wrapper.removeClass('layout-menu-static-active');
            $this.wrapper.removeClass('layout-menu-overlay-active');
            $this.menuButton.removeClass('menu-button-rotate');
            $this.disableModal();
        });
        this.modal = this.wrapper.append(mask).children('.layout-mask');
    },
    
    disableModal: function() {
        this.modal.remove();
    },
    
    enableSwipe: function() {
        if(this.isMobileDev) {
            var $this = this;
            this.menuWrapper.swipe({
                swipeLeft: function() {
                    $this.menuButton.click();
                }
            });
        }
    },
    
    disableSwipe: function() {
        if(this.isMobileDev) {
            this.menuWrapper.swipe('destroy');
        }
    },
    
    isHorizontal: function() {
        return this.wrapper.hasClass('menu-layout-horizontal');
    },
    
    isSlim: function() {
        return this.isDesktop() && this.wrapper.hasClass('layout-menu-slim');
    },
    
    isTablet: function() {
        var width = window.innerWidth;
        return width <= 1024 && width > 640;
    },

    isDesktop: function() {
        return window.innerWidth > 1024;
    },

    isMobile: function() {
        return window.innerWidth <= 640;
    },
    
    isMobileDevice: function() {
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(window.navigator.userAgent.toLowerCase());
    },

    toggleClass: function(el, className) {
        if (el.hasClass(className)) {
            el.removeClass(className);
        }
        else {
            el.addClass(className);
        }
    },
    
    clearActiveItems: function() {
        var activeItems = this.jq.find('li.active-menuitem'),
        subContainers = activeItems.children('ul');

        activeItems.removeClass('active-menuitem');
        if(subContainers && subContainers.length) {
            subContainers.hide();
        }
    },
    
    rightPanelOpen: function() {
        if(this.rightPanel.length) {
            this.rightPanel.addClass('layout-rightpanel-active');
            this.closeOverlayMenu();
        }
    },
    
    rightPanelClose: function() {
        if(this.rightPanel.length) {
            this.rightPanel.removeClass('layout-rightpanel-active');
            this.closeOverlayMenu();
        }
    }
    
});

PrimeFaces.UltimaConfigurator = {

    changeLayout: function(layoutTheme) {
        var linkElement = $('link[href*="layout-"]');
        var href = linkElement.attr('href');
        var startIndexOf = href.indexOf('layout-') + 7;
        var endIndexOf = href.indexOf('.css');
        var currentColor = href.substring(startIndexOf, endIndexOf);

        this.replaceLink(linkElement, href.replace('layout-' + currentColor, layoutTheme));
    },

    changeComponentsTheme: function(theme, isCompactMode) {
        var themeFile = theme;
        if (isCompactMode === 'true') {
            themeFile += '-compact';
        }
        var library = 'primefaces-ultima';
        var linkElement = $('link[href*="theme.css"]');
        var href = linkElement.attr('href');
        var index = href.indexOf(library) + 1;
        var currentTheme = href.substring(index + library.length);
        this.replaceLink(linkElement, href.replace(currentTheme, themeFile));
        
        this.changeLayout('layout-' + theme);
    },

    beforeResourceChange: function() {
        PrimeFaces.ajax.RESOURCE = null;    //prevent resource append
    },
    
    replaceLink: function(linkElement, href) {
        PrimeFaces.ajax.RESOURCE = 'javax.faces.Resource';
        
        var isIE = this.isIE();

        if (isIE) {
            linkElement.attr('href', href);
        }
        else {
            var cloneLinkElement = linkElement.clone(false);

            cloneLinkElement.attr('href', href);
            linkElement.after(cloneLinkElement);
            
            cloneLinkElement.off('load').on('load', function() {
                linkElement.remove();
            });
        }
    },

    changeMenuLayout: function(menuLayout) {
        console.log(menuLayout);

        if (menuLayout === 'static') {
            $('.layout-wrapper').removeClass('menu-layout-overlay menu-layout-horizontal layout-menu-slim').addClass('menu-layout-static');
        }
        else if (menuLayout === 'overlay') {
            $('.layout-wrapper').removeClass('menu-layout-horizontal menu-layout-static layout-menu-slim').addClass('menu-layout-overlay');
        }
        else if (menuLayout === 'horizontal') {
            $('.layout-wrapper').removeClass('menu-layout-overlay layout-menu-slim ').addClass('menu-layout-horizontal menu-layout-static');
        }
        else if (menuLayout === 'slim') {
            $('.layout-wrapper').removeClass('menu-layout-overlay  menu-layout-horizontal').addClass('layout-menu-slim menu-layout-static');
        }
        else {
            $('.layout-wrapper').removeClass('menu-layout-overlay menu-layout-horizontal layout-menu-slim').addClass('menu-layout-static');
        }
        this.clearLayoutState();
    },

    changeMenuColor: function(isDarkMenu) {
        if (isDarkMenu === 'true')
            $('#layout-menu-container').removeClass('layout-menu-light').addClass('layout-menu-dark');
        else $('#layout-menu-container').removeClass('layout-menu-dark').addClass('layout-menu-light');
    },

    setCompact: function(isCompact) {
        if(isCompact){
            $('.main-body').addClass('layout-compact');
        }
        else {
            $('.main-body').removeClass('layout-compact');
        }
    },

    clearLayoutState: function() {
        var menu = PF('me');

        if (menu) {
            menu.clearLayoutState();
        }
    },

    isIE: function() {
        return /(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent);
    },

    updateInputStyle: function(value) {
        if (value === 'filled')
            $(document.body).addClass('ui-input-filled');
        else
            $(document.body).removeClass('ui-input-filled');
    }
};

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD (Register as an anonymous module)
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (arguments.length > 1 && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {},
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling $.cookie().
			cookies = document.cookie ? document.cookie.split('; ') : [],
			i = 0,
			l = cookies.length;

		for (; i < l; i++) {
			var parts = cookies[i].split('='),
				name = decode(parts.shift()),
				cookie = parts.join('=');

			if (key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));

if (PrimeFaces.widget.SelectOneMenu) {
    PrimeFaces.widget.SelectOneMenu = PrimeFaces.widget.SelectOneMenu.extend({
        init: function (cfg) {
            this._super(cfg);

            var $this = this;
            if (this.jq.parent().hasClass('ui-float-label')) {
                this.m_panel = $(this.jqId + '_panel');
                this.m_focusInput = $(this.jqId + '_focus');

                this.m_panel.addClass('ui-input-overlay-panel');
                this.jq.addClass('ui-inputwrapper');

                if (this.input.val() != '') {
                    this.jq.addClass('ui-inputwrapper-filled');
                }

                this.input.off('change').on('change', function () {
                    $this.inputValueControl($(this));
                });

                this.m_focusInput.on('focus.ui-selectonemenu', function () {
                    $this.jq.addClass('ui-inputwrapper-focus');
                })
                    .on('blur.ui-selectonemenu', function () {
                        $this.jq.removeClass('ui-inputwrapper-focus');
                    });

                if (this.cfg.editable) {
                    this.label.on('input', function (e) {
                        $this.inputValueControl($(this));
                    }).on('focus', function () {
                        $this.jq.addClass('ui-inputwrapper-focus');
                    }).on('blur', function () {
                        $this.jq.removeClass('ui-inputwrapper-focus');
                        $this.inputValueControl($(this));
                    });
                }
            }
        },

        inputValueControl: function (input) {
            if (input.val() != '')
                this.jq.addClass('ui-inputwrapper-filled');
            else
                this.jq.removeClass('ui-inputwrapper-filled');
        }
    });
}

if (PrimeFaces.widget.Chips) {
    PrimeFaces.widget.Chips = PrimeFaces.widget.Chips.extend({
        init: function (cfg) {
            this._super(cfg);

            var $this = this;
            if (this.jq.parent().hasClass('ui-float-label')) {
                this.jq.addClass('ui-inputwrapper');

                if ($this.jq.find('.ui-chips-token').length !== 0) {
                    this.jq.addClass('ui-inputwrapper-filled');
                }

                this.input.on('focus.ui-chips', function () {
                    $this.jq.addClass('ui-inputwrapper-focus');
                }).on('input.ui-chips', function () {
                    $this.inputValueControl();
                }).on('blur.ui-chips', function () {
                    $this.jq.removeClass('ui-inputwrapper-focus');
                    $this.inputValueControl();
                });

            }
        },

        inputValueControl: function () {
            if (this.jq.find('.ui-chips-token').length !== 0 || this.input.val() != '')
                this.jq.addClass('ui-inputwrapper-filled');
            else
                this.jq.removeClass('ui-inputwrapper-filled');
        }
    });
}