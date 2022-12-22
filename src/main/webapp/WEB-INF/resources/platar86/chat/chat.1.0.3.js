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

var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
var chat = {
    created: false,
    showing: false,
    // This property should be set previously    
    chatLink: '',
    show: function () {
        if (chat.created) {
            Tawk_API.toggleVisibility();
            if (!Tawk_API.isChatHidden() && Tawk_API.isChatMinimized())
                Tawk_API.maximize();
            return;
        }
        chat.created = true;
        if (!chat.chatLink || chat.chatLink === 'unknown') {
            console.log('No chat link has been provided');
            return;
        }
        
        (function () {
            var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = chat.chatLink;
                s1.charset = 'UTF-8';
                s1.setAttribute('crossorigin', '*');
                s0.parentNode.insertBefore(s1, s0);
            })();
    },
    endChat: function() {
        Tawk_API.endChat();
    },
    setVisitorData: function () {
        let userName = chat.getValue('chatUserName');
        let userEmail = chat.getValue('chatUserEmail');
        let userCreatedBy = chat.getValue('chatUserCreatedBy');
        let superUserCreatedBy = chat.getValue('chatSuperUserCreatedBy');
        let loggerName = chat.getValue('chatLoggerName');
        let loggerSerNum = chat.getValue('chatLoggerSerNum');
        let attributes = {};
        attributes['name'] = userName || 'Unknown';
        if (userEmail)
            attributes['email'] = userEmail;
        attributes['user-Created-By'] = userCreatedBy || 'None';
        attributes['super-User-Created-By'] = superUserCreatedBy || 'None';
        attributes['logger-Name'] = loggerName || 'No logger selected';
        attributes['logger-Serial-Number'] = loggerSerNum || 'No logger selected';
        
        console.log('Attributes: ' + JSON.stringify(attributes));
        Tawk_API.setAttributes(attributes, function(error){
            if (error)
                console.log('Chat Error: ' +  error);
        });
    },
    getValue: function (id) {
        if (!id)
            return null;
        
        let element = document.getElementById(id);
        if (!element)
            return null;
 
        if (element.innerHTML)
            return element.innerHTML.replace(new RegExp(':', 'g'), '-');
        return element.innerHTML;
    }
};
Tawk_API.onLoad = function() {
    console.log('Loading required data for the chat...');
    populateChatData();
    Tawk_API.maximize();
};
Tawk_API.onChatStarted = function() {
    chat.setVisitorData();
};