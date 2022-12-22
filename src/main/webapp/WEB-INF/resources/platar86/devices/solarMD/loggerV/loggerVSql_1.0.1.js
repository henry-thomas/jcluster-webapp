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


/* global wsm, mu, hh */

(function (root) {
    let loggerSqlExec = function () {
        let container = document.getElementById('sqlOutput');
        if (!container) {
            return;
        }
        this.terminal = new WebTerminal(container, onTerminalInput);
    };

    let onFetchSuccess = function (devMessage, message) {
        message.forEach(row => {
            root.loggerSqlExec.terminal.printOutput(row);
        });
    };

    let onExecSuccess = function (devMessage, message) {
        root.loggerSqlExec.terminal.printOutput('Rows affected: ' + message);
    };

    let onError = function (err, errMsg) {
        root.loggerSqlExec.terminal.printOutput(errMsg);
    };

    let execLoggerSqlFetch = function (fetchInst) {
        wsm.sendDevMsgExecWithJsonInst({
            showMessage: true,
            instrExt: 'executeSqlFetch',
            executeSqlFetch: fetchInst
        },
                onFetchSuccess, onError);
    };

    let execLoggerSql = function (sqlInst) {
        wsm.sendDevMsgExecWithJsonInst({
            showMessage: true,
            instrExt: 'executeSql',
            executeSql: sqlInst
        },
                onExecSuccess, onError);
    };

    function onTerminalInput(terminal, command) {
        console.log(command);
        switch (command.split(" ")[0].toUpperCase()) {
            case 'SELECT':
            case 'EXPLAIN':
            case 'SHOW':
            case 'DESCRIBE':
                execLoggerSqlFetch(command);
                break;
            case 'SET':
            case 'UPDATE':
            case 'INSERT':
            case 'DELETE':
                execLoggerSql(command);
                break;
            default:

                break;
        }
    }

    $(document).ready(function () {
        root.loggerSqlExec = new loggerSqlExec();
        if (root.loggerSqlExec.terminal) {
            root.loggerSqlExec.terminal.setTitle('MySQL | SQL >');
        }
    });
}(window));