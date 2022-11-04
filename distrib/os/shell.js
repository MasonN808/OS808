/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    class Shell {
        constructor() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        init() {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down OS808");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Outputs the current date and time");
            this.commandList[this.commandList.length] = sc;
            // whereamei
            sc = new TSOS.ShellCommand(this.shellWhereami, "whereami", "- Displays the current geographical location");
            this.commandList[this.commandList.length] = sc;
            // howareu
            sc = new TSOS.ShellCommand(this.shellHowareu, "howareu", "- Displays the current current status of the OS");
            this.commandList[this.commandList.length] = sc;
            // whoismason
            sc = new TSOS.ShellCommand(this.shellWhoismason, "whoismason", "- a website url to Mason");
            this.commandList[this.commandList.length] = sc;
            // status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "- a message status to display");
            this.commandList[this.commandList.length] = sc;
            // bsod
            sc = new TSOS.ShellCommand(this.shellBsod, "bsod", "- blue screen of death");
            this.commandList[this.commandList.length] = sc;
            // load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Loads and validates the input code");
            this.commandList[this.commandList.length] = sc;
            // run <pid>
            sc = new TSOS.ShellCommand(this.shellRun, "run", "- runs the input code");
            this.commandList[this.commandList.length] = sc;
            // clearmem
            sc = new TSOS.ShellCommand(this.shellClearMem, "clearmem", "- clears all memory partitions");
            this.commandList[this.commandList.length] = sc;
            // runall
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", "- runs all processes in the resdient queue");
            this.commandList[this.commandList.length] = sc;
            // ps
            sc = new TSOS.ShellCommand(this.shellPs, "ps", "- displays all processes and their states");
            this.commandList[this.commandList.length] = sc;
            // quantum <int>
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "- sets the quantum for CPU scheduling");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            // Display the initial prompt.
            this.putPrompt();
        }
        putPrompt() {
            _StdOut.putText(this.promptStr);
        }
        handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match. 
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args); // Note that args is always supplied, though it might be empty.
                _CmdHist.push(cmd); // Add the command to our command history
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        execute(fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            if (fn !== this.shellBsod) {
                this.putPrompt();
            }
        }
        parseInput(buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            // DONT lower-case for status shell message with uppercase
            // buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }
        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }
        shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }
        shellApology() {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        }
        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.
        shellVer() {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }
        shellHelp() {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }
        shellShutdown() {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }
        shellCls() {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }
        shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "ver":
                        _StdOut.putText("Outputs current OS version");
                        break;
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shuts down the Kernel");
                        break;
                    case "cls":
                        _StdOut.putText("clears the screen");
                        break;
                    case "trace":
                        _StdOut.putText("Switches the host log on and off");
                        break;
                    case "rot13":
                        _StdOut.putText("Encrypts a string into another string");
                        break;
                    case "prompt":
                        _StdOut.putText("Changes the prompt of the console");
                        break;
                    case "date":
                        _StdOut.putText("Outputs the current date and time");
                        break;
                    case "whereami":
                        _StdOut.putText("Gives an insightful message about the user's location");
                        break;
                    case "howareu":
                        _StdOut.putText("Gives insightful information about the OS");
                        break;
                    case "whoismason":
                        _StdOut.putText("Gives website url of Mason");
                        break;
                    case "status":
                        _StdOut.putText("Pastes a status message provided by the user to the display");
                        break;
                    case "bsod":
                        _StdOut.putText("Does blue screen of death");
                        break;
                    case "load":
                        _StdOut.putText("Loads and validates the input code");
                        break;
                    case "run":
                        _StdOut.putText("runs the input code at <pid>");
                        break;
                    case "clearmem":
                        _StdOut.putText("clears all memory partitions");
                        break;
                    case "runall":
                        _StdOut.putText("runs all processes in resident queue");
                        break;
                    case "ps":
                        _StdOut.putText("displays all processes and their states");
                        break;
                    case "quantum":
                        _StdOut.putText("sets the Round Robin quantum for CPU scheduling");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }
        shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }
        shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }
        shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        shellDate() {
            const date_time = new Date().toLocaleString();
            _StdOut.putText(date_time);
        }
        shellWhereami() {
            _StdOut.putText("Potentially in a simulation");
        }
        shellHowareu() {
            _StdOut.putText("I am sentient; and this was not a hardcoded message");
        }
        shellWhoismason() {
            _StdOut.putText("See https://www.masonnakamura.com/");
        }
        shellStatus(args) {
            TSOS.Control.statusUpdate(args.join(' '));
            _StdOut.putText("Status updated...");
        }
        shellBsod() {
            _StdOut.putTextCenter("Shutting down OS...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
        }
        shellLoad() {
            // Get the data from the input area
            var taProgramInput = document.getElementById("taProgramInput");
            var input_text = taProgramInput.value;
            // Remove all whitespace from text
            const removed_white_space_input_text = input_text.replace(/\s/g, '');
            if (input_text === "") {
                _StdOut.putText("Empty input: populate program input");
            }
            else if (removed_white_space_input_text.length % 2 !== 0) {
                _StdOut.putText("Hex data in program input is incomplete");
            }
            else {
                // Check that the Hex is valid
                const reg_ex = /[0-9a-fA-F]{2}/g;
                var found_invalid = false;
                for (let index = 0; index < removed_white_space_input_text.length; index += 2) {
                    // Reset the index for restest
                    reg_ex.lastIndex = 0;
                    const sampled_input = removed_white_space_input_text.substring(index, index + 2);
                    if (!reg_ex.test(sampled_input)) {
                        found_invalid = true;
                        _StdOut.putText("Invalid hex");
                        break;
                    }
                }
                if (!found_invalid) {
                    // Check that the loaded number of OP codes is within memory limit
                    // Do /2 since its counting single character length
                    if (removed_white_space_input_text.length / 2 > _MemoryManager.limit) {
                        // Display warning
                        _StdOut.putText("Program too large");
                    }
                    else {
                        // Initialize the array to overwrite the source pointer in _Memory instance
                        var loadedSource = [];
                        // Populate an array with the OP codes
                        for (let index = 0; index < removed_white_space_input_text.length; index += 2) {
                            loadedSource.push(removed_white_space_input_text.substring(index, index + 2));
                        }
                        // Populate the rest of the array with 00s up to the memory limit
                        for (let index = removed_white_space_input_text.length; index < _MemoryManager.limit * 2; index += 2) {
                            loadedSource.push("00");
                        }
                        // Create a new instance of memory to load the source into
                        var toBeLoadedMemory = new TSOS.Memory();
                        // write the new source into memory
                        toBeLoadedMemory = TSOS.MemoryAccessor.rewriteAllMemory(toBeLoadedMemory, loadedSource);
                        // Check that the the program can fit in a memory partition and load it, if can
                        // ... and Assign a PID
                        _MemoryManager.loadProgramInMemory(toBeLoadedMemory);
                        // Display the memory
                        TSOS.Control.hostMemory();
                        // Output the PID
                        _StdOut.putText("Process ID: " + (_MemoryManager.PIDCounter - 1));
                    }
                }
            }
        }
        shellRun(args) {
            if (args.length === 1) {
                if (TSOS.Utils.isInt(args[0])) {
                    const inputPid = parseInt(args[0]);
                    // Try and find the input PID in the hashtable
                    // if (_MemoryManager.PIDMap.has(inputPid)) {
                    // See if process is in resident list
                    if (_ResidentList.indexOf(inputPid) > -1) {
                        TSOS.Control.hostProcessesInit(inputPid);
                        // Enqueue the processID to ready queue
                        _ReadyQueue.enqueue(inputPid);
                        // Remove the processID from the resident list
                        _ResidentList = TSOS.Utils.removeListElement(_ResidentList, inputPid);
                        // Tell the CPU that is is executing
                        _CPU.isExecuting = true;
                    }
                    else {
                        _StdOut.putText("Undefined Process ID: " + inputPid);
                    }
                }
                else {
                    _StdOut.putText("Invalid arguement.  Usage: run <pid>.");
                }
            }
            else {
                _StdOut.putText("Usage: run <pid>");
            }
        }
        shellClearMem() {
            _MemoryManager.clearMainMemory();
            TSOS.Control.hostMemory();
        }
        shellRunAll() {
            // Check if _ResidentList is empty
            if (_ResidentList) {
                for (let index = 0; index < _ResidentList.length; index++) {
                    var resident = _ResidentList[index];
                    TSOS.Control.hostProcessesInit(resident);
                    _ReadyQueue.enqueue(resident);
                    // Tell the CPU that is is executing
                    _CPU.isExecuting = true;
                }
                // Clear the resident list
                _ResidentList = [];
            }
            else {
                _StdOut.putText("Resident queue is empty: load some program(s)");
            }
        }
        shellPs() {
        }
        shellQuantum(args) {
            // Check that input is an int convertable string
            if (args.length === 1) {
                if (TSOS.Utils.isInt(args[0])) {
                    // Change the quantum in global scheduler
                    _Scheduler.changeMaxQuantum(parseInt(args[0]));
                }
                else {
                    _StdOut.putText("Invalid arguement.  Usage: quantum <int>.");
                }
            }
            else {
                _StdOut.putText("Usage: quantum <int>");
            }
        }
    }
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=shell.js.map