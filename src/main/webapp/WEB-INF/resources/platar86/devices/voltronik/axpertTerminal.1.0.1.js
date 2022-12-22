

/* global mainUtils, devManager */

var axTerminal = {
    instruction: 'executeRaw',
    onTerminalInput: function (terminal, command) {
        console.log(command);
        if (command === 'help') {
            document.querySelector('.downloadAxpertCommProtocol').click();
            axTerminal.term.printOutput("Downloading .....");
        } else {

            axTerminal.term.printOutput(
                    '    Instruction sent: [' + command + '] - '
                    + new Date().toLocaleTimeString());
//        axTerminal.term.printOutput('');

            var message = {
                instr: 'executeInstr',
                instrExt: axTerminal.instruction,
                instrData: command,
                devSerialNumber: devManager.getSelected().serialNumber,
                devModelId: devManager.config.subDevModelId
            };
            wsm.sendDevMsg(message,
                    function (devMessage, response) { //on success
                        axTerminal.term.printOutput(response);
                    },
                    function (devMessage) { //on Error
                        axTerminal.term.printOutput(devMessage.response.faultMsg);
                    },
                    function () { //on timeout
                        axTerminal.term.printOutput('Timeout for Instruction sent: [' + command + ']');
                    }
            );
        }
    }
};

axTerminal.term = new WebTerminal(document.querySelector('.uiax-terminalWrapper'), axTerminal.onTerminalInput);

axTerminal.term.setTitle('Axpert $:');
axTerminal.term.printOutput("Welecome to Solar MD Web Terminal.For protocol download enter 'help'");
axTerminal.term.printOutput('');