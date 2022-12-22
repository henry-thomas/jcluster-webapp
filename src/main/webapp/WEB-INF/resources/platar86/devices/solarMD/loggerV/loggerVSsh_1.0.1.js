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


/* global lv */

(function (root) {
    let loggerSsh = function () {
        let container = document.getElementById('loggerSsh');
        if (!container) {
            return;
        }
        this.terminal = new WebTerminal(container, onTerminalInput);
        this.terminal.setTitle('user $: ');
    };


    let onTerminalInput = function (terminal, request) {
        console.log(request);
        lv.executeConfigUpdate('execProc', request, "none",
                function (d) {
                    var data = d.response.data;
                    root.loggerSsh.terminal.printOutput(data);
                },
                function () {
                    root.loggerSsh.terminal.printOutput('Timeout');
                },
                function (devMessage, message) {
                    appendTerminalText('Error: ' + message);
                    root.loggerSsh.terminal.printOutput('Error: ' + message);
                }
        );
    };

    let sendSshInstruction = function () {
        mu.getWidgetValue('terminalInputText');
        termIntpuFunction();
    };

//    function onTerminalInput(terminal, command) {
//        console.log(command);
//        switch (command.split(" ")[0].toUpperCase()) {
//            case 'SELECT':
//            case 'EXPLAIN':
//            case 'SHOW':
//            case 'DESCRIBE':
//                execLoggerSqlFetch(command);
//                break;
//            case 'SET':
//            case 'UPDATE':
//            case 'INSERT':
//            case 'DELETE':
//                execLoggerSql(command);
//                break;
//            default:
//
//                break;
//        }
//    }

    $(document).ready(function () {
        root.loggerSsh = new loggerSsh();
    });
}(window));



