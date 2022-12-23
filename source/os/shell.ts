/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {
        }

        public init() {
            var sc: ShellCommand;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down OS808");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // date
            sc = new ShellCommand(this.shellDate,
                                  "date",
                                  "- Outputs the current date and time");
            this.commandList[this.commandList.length] = sc;

            // whereamei
            sc = new ShellCommand(this.shellWhereami,
                                  "whereami",
                                  "- Displays the current geographical location");
            this.commandList[this.commandList.length] = sc;

            // howareu
            sc = new ShellCommand(this.shellHowareu,
                                  "howareu",
                                  "- Displays the current current status of the OS");
            this.commandList[this.commandList.length] = sc;

            // whoismason
            sc = new ShellCommand(this.shellWhoismason,
                                "whoismason",
                                "- a website url to Mason");
            this.commandList[this.commandList.length] = sc;
            
            // status
            sc = new ShellCommand(this.shellStatus,
                                "status",
                                "- a message status to display");
            this.commandList[this.commandList.length] = sc;

            // bsod
            sc = new ShellCommand(this.shellBsod,
                                "bsod",
                                "- blue screen of death");
            this.commandList[this.commandList.length] = sc;

            // load
            sc = new ShellCommand(this.shellLoad,
                            "load",
                            "- Loads and validates the input code");
            this.commandList[this.commandList.length] = sc;

            // run <pid>
            sc = new ShellCommand(this.shellRun,
                            "run",
                            "- runs the input code");
            this.commandList[this.commandList.length] = sc;

            // clearmem
            sc = new ShellCommand(this.shellClearMem,
                "clearmem",
                "- clears all memory partitions");
            this.commandList[this.commandList.length] = sc;

            // runall
            sc = new ShellCommand(this.shellRunAll,
                "runall",
                "- runs all processes in the resdient queue");
            this.commandList[this.commandList.length] = sc;

            // ps
            sc = new ShellCommand(this.shellPs,
                "ps",
                "- displays all processes and their states");
            this.commandList[this.commandList.length] = sc;

            // kill <pid>
            sc = new ShellCommand(this.shellKill,
                "kill",
                "- kills the current process and wipes its memory");
            this.commandList[this.commandList.length] = sc;

            // killall
            sc = new ShellCommand(this.shellKillAll,
                "killall",
                "- kills all processes and wipes all memory");
            this.commandList[this.commandList.length] = sc;

            // quantum <int>
            sc = new ShellCommand(this.shellQuantum,
                "quantum",
                "- sets the quantum for CPU scheduling");
            this.commandList[this.commandList.length] = sc;

            // format
            sc = new ShellCommand(this.shellFormat,
                "format",
                "- resets the hard drive");
            this.commandList[this.commandList.length] = sc;

            // create <filename>
            sc = new ShellCommand(this.shellCreate,
                "create",
                "- creates a new file with specified name");
            this.commandList[this.commandList.length] = sc;

            // read <filename>
            sc = new ShellCommand(this.shellRead,
                "read",
                "- outputs the contents of a specified file name");
            this.commandList[this.commandList.length] = sc;

            // write <filename> "data"
            sc = new ShellCommand(this.shellWrite,
                "write",
                "- writes data/text to a specified file name");
            this.commandList[this.commandList.length] = sc;

            // delete <filename>
            sc = new ShellCommand(this.shellDelete,
                "delete",
                "- deletes a file and its contents");
            this.commandList[this.commandList.length] = sc;

            // copy <existing filename> <new filename>
            sc = new ShellCommand(this.shellCopy,
                "copy",
                "- copies an existing file to an already existing file or new file");
            this.commandList[this.commandList.length] = sc;

            // rename <current filename> <new filename>
            sc = new ShellCommand(this.shellRename,
                "rename",
                "- renames an existing file");
            this.commandList[this.commandList.length] = sc;

            // ls
            sc = new ShellCommand(this.shellList,
                "ls",
                "- list the files currently stored on the disk");
            this.commandList[this.commandList.length] = sc;

            // getschedule
            sc = new ShellCommand(this.shellGetSchedule,
                "getschedule",
                "- gets the current scheduler");
            this.commandList[this.commandList.length] = sc;

            // setschedule <type>
            sc = new ShellCommand(this.shellSetSchedule,
                "setschedule",
                "- sets the current scheduler");
            this.commandList[this.commandList.length] = sc;
            
            // setpriority <PID> <priority>
            sc = new ShellCommand(this.shellSetPriority,
                "setpriority",
                "- sets the priority of a process");
            this.commandList[this.commandList.length] = sc;

            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
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
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);  // Note that args is always supplied, though it might be empty.
                _CmdHist.push(cmd);  // Add the command to our command history
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            if (fn !== this.shellBsod){
                this.putPrompt();
            }
        }

        public parseInput(buffer: string): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            // DONT lower-case for status shell message with uppercase
            // buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
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
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.

        public shellVer() {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp() {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown() {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }

        public shellCls() {         
            _StdOut.clearScreen();     
            _StdOut.resetXY();
        }

        public shellMan(args: string[]) {
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

                    case "kill":
                        _StdOut.putText("kills the specified process");
                        break;

                    case "killall":
                        _StdOut.putText("kills all the running processes");
                        break;
                    
                    case "quantum":
                        _StdOut.putText("sets the Round Robin quantum for CPU scheduling");
                        break;

                    case "format":
                        _StdOut.putText("resets the hard drive");
                        break;

                    case "create":
                        _StdOut.putText("creates a new file with specified name");
                        break;

                    case "read":
                        _StdOut.putText("outputs the contents of a specified <file name>");
                        break;

                    case "write":
                        _StdOut.putText("writes data/text to a specified <file name>");
                        break;

                    case "delete":
                        _StdOut.putText("deletes a <file name> and its contents");
                        break;

                    case "copy":
                        _StdOut.putText("copies an <existing file name> to an already <existing file name> or <new file name>");
                        break;

                    case "rename":
                        _StdOut.putText("renames a file with name <file name> to <new file name>");
                        break;

                    case "ls":
                        _StdOut.putText("list the files currently stored on the disk");
                        break;

                    case "getschedule":
                        _StdOut.putText("Gets the currently active schduling algorithm");
                        break;

                    case "setschedule":
                        _StdOut.putText("Gets the currently active schduling algorithm");
                        break;

                    case "setpriority":
                        _StdOut.putText("Sets the priority of a process");
                        break;

                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args: string[]) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
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
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args: string[]) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args: string[]) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        public shellDate() {
            const date_time = new Date().toLocaleString();
            _StdOut.putText(date_time);
        }

        public shellWhereami() {
            _StdOut.putText("Potentially in a simulation");
        }

        public shellHowareu() {
            _StdOut.putText("I am sentient; and this was not a hardcoded message");
        }

        public shellWhoismason() {
            _StdOut.putText("See https://www.masonnakamura.com/");
        }

        public shellStatus(args: string[]) {
            TSOS.Control.statusUpdate(args.join(' '));

            _StdOut.putText("Status updated...");
        }

        public shellBsod() {
            _StdOut.putTextCenter("Shutting down OS...");

            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
        }

        public shellLoad() {
            // Get the data from the input area
            var taProgramInput = <HTMLInputElement> document.getElementById("taProgramInput");
            var input_text = taProgramInput.value;

            // Remove all whitespace from text
            const removed_white_space_input_text = input_text.replace(/\s/g, '');

            if (input_text === "") {
                _StdOut.putText("Empty input: populate program input");

            } else if (removed_white_space_input_text.length % 2 !== 0){
                _StdOut.putText("Hex data in program input is incomplete");

            } else {
                // Check that the Hex is valid
                const reg_ex = /[0-9a-fA-F]{2}/g;
                var found_invalid = false;

                for (let index = 0; index < removed_white_space_input_text.length; index += 2){
                    // Reset the index for restest
                    reg_ex.lastIndex = 0;

                    const sampled_input = removed_white_space_input_text.substring(index, index + 2);

                    if (!reg_ex.test(sampled_input))  {
                        found_invalid = true;
                        _StdOut.putText("Invalid hex");
                        break;
                    }
                }
                
                if (!found_invalid) {
                    // Check that the loaded number of OP codes is within memory limit
                    // Do /2 since its counting single character length
                    // Do +1 since length has offset 1 while limit has offset 0
                    if (removed_white_space_input_text.length / 2 > _MemoryManager.limit + 1) {
                        // Display warning
                        _StdOut.putText("Program too large");
                    }
                    else {
                        // Initialize the array to overwrite the source pointer in _Memory instance
                        var loadedSource = [];
    
                        // Populate an array with the OP codes
                        for (let index = 0; index < removed_white_space_input_text.length; index += 2){
                            loadedSource.push(removed_white_space_input_text.substring(index, index + 2));
                        }

                        // Populate the rest of the array with 00s up to the memory limit
                        for (let index = removed_white_space_input_text.length; index < _MemoryManager.limit * 2; index += 2){
                            loadedSource.push("00");
                        }
                        
                        // Create a new instance of memory to load the source into
                        var toBeLoadedMemory = new Memory();

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

        public shellRun(args: string[]) {
            // Check if _ResidentList is empty
            if (_ResidentList.length !== 0) {
                if (args.length === 1) {
                    if (TSOS.Utils.isInt(args[0])) {
                        const inputPid = parseInt(args[0])
                        // See if process is in resident list
                        if (_ResidentList.indexOf(inputPid) > -1) {
                            TSOS.Control.hostProcessesInit(inputPid);
                            // Enqueue the processID to ready queue
                            _ReadyQueue.enqueue(inputPid);
                            // Remove the processID from the resident list
                            TSOS.Utils.removeListElement(_ResidentList, inputPid);
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
            else {
                _StdOut.putText("Resident queue is empty: load some program(s) to run");
            }
        }

        public shellClearMem() {
            // Check if we can clear the memory
            if (!_CPU.isExecuting) {
                _MemoryManager.clearMainMemory();
                TSOS.Control.hostMemory();
            }
            else {
                _StdOut.putText("CPU is still executing: can not clear memory paritions")
            }
        }

        public shellRunAll() {
            // Check if _ResidentList is empty
            if (_ResidentList.length !== 0) {
                 // Make a copy of the resident list
                const copyResidentList = Object.assign([], _ResidentList);
                for (const resident of copyResidentList) {
                    TSOS.Control.hostProcessesInit(resident);
                    // Enqueue the processID to ready queue
                    _ReadyQueue.enqueue(resident);
                    // Remove the resident from the resident list
                    TSOS.Utils.removeListElement(_ResidentList, resident);
                }
                // Tell the CPU that is is executing
                _CPU.isExecuting = true;
            }
            else {
                _StdOut.putText("Resident queue is empty: load some program(s) to run all");
            }
        }
        
        public shellPs() {
            _StdOut.putText("PID PC   IR  ACC  X  Y  Z");
            _StdOut.advanceLine();
            // Make a copy of the ready array
            const copyReadyArray = Object.assign([], _ReadyQueue.q);
            // Push the current CPU process pid to the copy of the ready queue before linear traversal
            copyReadyArray.push(_CPU.PID);
            // Loop through all PCBs in the ready queue
            for (const pid of copyReadyArray) {
                const pcb = _MemoryManager.PIDMap.get(pid)[1];
                _StdOut.putText(pid + " ".repeat(5 - pcb.programCounter.toString().length) + pcb.programCounter
                                    + " ".repeat(5 - pcb.intermediateRepresentation.toString().length) + pcb.intermediateRepresentation 
                                    + " ".repeat(5 - pcb.Acc.toString().length) + pcb.Acc + "  " + pcb.Xreg + "  " + pcb.Yreg + "  " + pcb.Zflag);
                _StdOut.advanceLine();
            }
        }
        
        public shellKill(args: string[]): void {
            if (args.length === 1) {
                if (TSOS.Utils.isInt(args[0])) {
                    const pid = parseInt(args[0]);
                    _OsShell.killLogic(pid);
                }
                else {
                    _StdOut.putText("Invalid arguement.  Usage: kill <pid>.");
                }
            } 
            else {
                _StdOut.putText("Usage: kill <pid>");
            }
        }

        public shellKillAll() {
            // Make a copy of the ready array
            const copyReadyArray = Object.assign([], _ReadyQueue.q);
            // Push the current CPU process pid to the copy of the ready queue before linear traversal
            copyReadyArray.push(_CPU.PID);
            for (const pid of copyReadyArray) {
                _OsShell.killLogic(pid);
            }
        }

        // Where most of the kill logic for processes is
        public killLogic(pid: number) {
            // See if the pid exists
            if (_MemoryManager.PIDMap.has(pid)) {
                // See if it the target pid is in the resident list
                if (_ResidentList.indexOf(pid) === -1 ) {
                    // See if its in the CPU; otherwise, it's in the ready queue
                    if (_CPU.PID === pid) {
                        // Check if the ready queue is empty to stop the CPU from executing
                        if (_ReadyQueue.isEmpty()) {
                            // Reinitialize the CPU and stop from executing  
                            _CPU.init();
                        }
                        else {
                            // Issue a context switch interrupt
                            // "type-2" indicates that we DO NOT store the current processes PCB
                            _Scheduler.issueContextSwitchInterrupt("type-2", _CPU.PID);
                        }
                        // Update the cpu display
                        TSOS.Control.hostCpu();
                    }
                    // Remove it from the ready queue, otherwise
                    else {
                        _ReadyQueue.remove(pid);
                    }
                    _StdOut.putText("Process with PID " + pid + " has been terminated wtih memory wiped");
                    
                    // Remove it from the hard drive if it's there
                    const tsb = _krnDiskDriver.queryPID(pid);
                    if (tsb != null) {
                        // Do a deep delete
                        _krnDiskDriver.removeFileContents(tsb, false);
                    }
                    _MemoryManager.removePIDFromEverywhere(pid);


                    TSOS.Control.hostMemory();
                }
            }
        }
        
        public shellQuantum(args: string[]) {
            // Check that input is an int convertable string
            if (args.length === 1) {
                if (TSOS.Utils.isInt(args[0])) {
                    const newQuantum = parseInt(args[0]);
                    // Make some checks on the input
                    if (newQuantum > 0) {
                        // Change the quantum in global scheduler
                        _Scheduler.changeMaxQuantum(newQuantum);
                    }
                    else {
                        _StdOut.putText("Invalid input: quantuam must be a positive integer")
                    }
                } 
                else {
                    _StdOut.putText("Invalid arguement.  Usage: quantum <int>");
                }
            } 
            else {
                _StdOut.putText("Usage: quantum <int>");
            }
        }

        public shellFormat() {
            // Check if any processes were saved onto the drive and in the ready queue
            // Loop through all the possible files
            const PIDsInHardDrive = _krnDiskDriver.queryPIDsInDirectory();
            if (PIDsInHardDrive.length > 0) {
                // If we found processes in the harddrive, we terminate and clear the PID
                for (let pid of PIDsInHardDrive) {
                    _OsShell.killLogic(parseInt(pid, 10));
                }
                _StdOut.putText("Disk SUCCESSFULLY reset: terminated process(es)");
            }
            else {
                // resets values in the hashmap
                _krnDiskDriver.krnDiskFormat();
                // Reset
                Control.hostDisk();
                _StdOut.putText("Disk SUCCESSFULLY reset");
            }
        }

        public shellCreate(args: string[], verbose = true) {
            // Check that input is a string with no spaces
            if (args.length === 1) {
                const newFileName = args[0];
                // Check if name is too long
                if (newFileName.length > _krnDiskDriver.BLOCKSIZEMAX) {
                    _StdOut.putText("ERROR: file name too long");
                }
                // Check to see if the name is already taken
                else if (_krnDiskDriver.isFileNameInFiles(newFileName)) {
                    _StdOut.putText("ERROR: file name [" + newFileName + "] already taken");
                }
                else {
                    // First find a TSB that is not used
                    const unusedFileTSB = _krnDiskDriver.queryUnusedTSB("Directory");
                    // Query the TSB the returns the associated DiskValue
                    var queriedDiskValue = _krnDiskDriver.queryTSB(unusedFileTSB);
                    // Add the file name to the list
                    _krnDiskDriver.filesInUse.push(new File(newFileName, unusedFileTSB));
                    
                    // Set to used
                    queriedDiskValue.used = 1;
                    const hexFileName = Utils.toHex(newFileName);

                    // Change the data
                    queriedDiskValue.data = _krnDiskDriver.formatData(hexFileName);

                    // Set the next TSB pointer
                    const unusedDataTSB = _krnDiskDriver.queryUnusedTSB("Data");
                    // Set the data TSB pointer with a used pointer too
                    var queriedDataDiskValue = _krnDiskDriver.queryTSB(unusedDataTSB);
                    queriedDataDiskValue.used = 1;
                    queriedDiskValue.next = [unusedDataTSB[0], unusedDataTSB[1], unusedDataTSB[2]];

                    // Update the display
                    Control.hostDisk();
                    
                    // For instances if another shell command uses this
                    if (verbose) {
                        _StdOut.putText("File Created: " + newFileName);
                    }
                }
            } 
            else {
                _StdOut.putText("ERROR: spaces not allowed in <file name>");
            }
        }

        public shellWrite(args: string[], verbose = true) {
            // Check that input is a string with no spaces
            const newArgs = Utils.smartArgsParsing(args);
            if (newArgs != null) {
                const fileName = newArgs[0];
                const data = newArgs[1];
                // Check that it is the correct file name
                if (!_krnDiskDriver.isFileNameInFiles(fileName)) {
                    _StdOut.putText("ERROR: file name [" + fileName + "] not found");
                }
                else {
                    // Find the TSB associated with the file name
                    const fileTSB = _krnDiskDriver.TSBInFileInFiles(fileName);
                    // Be sure to reset all data of the file before writing with a shallow delete
                    _krnDiskDriver.removeFileContents(fileTSB, true);
                    // Remove the parenthesis before injecting into hard drive
                    const truncatedData = data.substring(1, data.length-1);
                    // Get the DiskValue associated with this TSB to get the next TSB
                    const fileDiskValue = _krnDiskDriver.queryTSB(fileTSB);
                    // Get the next TSB from the DiskValue
                    var dataTSB = fileDiskValue.next;
                    
                    // Convert the string of data to hex
                    const hexData = Utils.toHex(truncatedData);
                    // Fillin the data
                    _krnDiskDriver.fillData(hexData, dataTSB);

                    // Update the size of the file
                    const file = _krnDiskDriver.fileInFiles(fileName);
                    console.log(args[1].length)
                    file.size = hexData.length / 2;

                    // Update the display
                    Control.hostDisk();
                    if (verbose) {
                        _StdOut.putText("File Updated: " + fileName);
                    }
                }
            } 
            else {
                _StdOut.putText("Usage: write <file name> \"data\"");
            }
        }

        public shellDelete(args: string[]) {
            // Check if only one argument inserted
            if (args.length != 1) {
                _StdOut.putText("Usage: delete <fileName>");
            }
            else {
                const fileName = args[0];
                // Check if the filename exists
                if (!_krnDiskDriver.isFileNameInFiles(fileName)) {
                    _StdOut.putText("ERROR: file name [" + fileName + "] not found");
                }
                else {
                    // Find the TSB associated with the file name
                    const fileTSB = _krnDiskDriver.TSBInFileInFiles(fileName);
                    // Full delete, no shallow delete
                    _krnDiskDriver.removeFileContents(fileTSB, false);
                    // Remove the file from filesInUse array
                    _krnDiskDriver.removeFileInFilesInUse(fileName);

                    // Update the display
                    Control.hostDisk();
                    _StdOut.putText("File Removed: " + fileName);
                }
            }
        }

        public shellRead(args: string[]) {
            // Check if only one argument inserted
            if (args.length != 1) {
                _StdOut.putText("Usage: read <file name>");
            }
            else {
                console.log(Utils.hex2a("7e33"))
                const fileName = args[0];
                // Check if the filename exists
                if (!_krnDiskDriver.isFileNameInFiles(fileName)) {
                    _StdOut.putText("ERROR: file name [" + fileName + "] not found");
                }
                else {
                    const fileTSB = _krnDiskDriver.TSBInFileInFiles(fileName);
                    _krnDiskDriver.readFile(fileTSB);
                }
            }
        }

        // FIXME: Weird table distortion when 1) create <file> 2) write file "some data" then 3) copy <file> <new file>
        public shellCopy(args: string[], verbose = true) {
            // Check if only one argument inserted
            if (args.length != 2) {
                _StdOut.putText("Usage: rename <file name> <new file name>");
            }
            else {
                const currentFileName = args[0];
                const newFileName = args[1];
                // Check if file names are equal
                if (currentFileName == newFileName) {
                    _StdOut.putText("ERROR: can not copy file into itself");
                }
                if (newFileName.length > _krnDiskDriver.BLOCKSIZEMAX) {
                    _StdOut.putText("ERROR: file name too long");
                }
                // Check if the filename exists
                if (!_krnDiskDriver.isFileNameInFiles(currentFileName)) {
                    _StdOut.putText("ERROR: file name [" + currentFileName + "] not found");
                }
                
                // Check if the new file name exists
                else if (!_krnDiskDriver.isFileNameInFiles(newFileName)) {
                    // We create a new file as a copy
                    _OsShell.shellCreate([newFileName]);
                    _StdOut.advanceLine();

                    const strData = _krnDiskDriver.getDataFromFile(currentFileName);

                    // Delete the file contents to override with a simple write command
                    _OsShell.shellWrite([newFileName, "\"" + strData + "\""], false);
                }
                // Otherwise, we overwrite the exisitng file
                else {
                    // Accumulate the string from each data block of the copied file
                    const strData = _krnDiskDriver.getDataFromFile(currentFileName);

                    // Delete the file contents to override with a simple write command
                    _OsShell.shellWrite([newFileName, "\"" + strData + "\""], false);
                }
                // Update the display
                Control.hostDisk();
                if (verbose) {
                    _StdOut.putText("File Copied: " + currentFileName + " --> " + newFileName);
                }
            }
        }

        public shellRename(args: string[]) {
            // Check if only two argument inserted
            if (args.length != 2) {
                _StdOut.putText("Usage: rename <file name> <new file name>");
            }
            else {
                const currentFileName = args[0];
                const newFileName = args[1];
                if (newFileName.length > _krnDiskDriver.BLOCKSIZEMAX) {
                    _StdOut.putText("ERROR: file name too long");
                }
                // Check if the filename exists
                if (!_krnDiskDriver.isFileNameInFiles(currentFileName)) {
                    _StdOut.putText("ERROR: file name [" + currentFileName + "] not found");
                }
                else {
                    // Check if the new file name is not already taken
                    if (_krnDiskDriver.isFileNameInFiles(newFileName)) {
                        _StdOut.putText("ERROR: file name [" + newFileName + "] already taken");
                    }
                    else {
                        // Get the TSB of the current file name
                        // const currentFileTSB = _krnDiskDriver.TSBInFileInFiles(currentFileName);
                        const currentfile = _krnDiskDriver.fileInFiles(currentFileName);
                        // Get the data value
                        var fileDataValue = _krnDiskDriver.queryTSB(currentfile.TSB);
                        
                        // Transfer the pointers of the file
                        const newFile = new File(newFileName, currentfile.TSB);
                        newFile.creationDate = currentfile.creationDate;
                        newFile.size = currentfile.size;

                        // Add the new file name to the list
                        _krnDiskDriver.filesInUse.push();
                        // Remove the past file name from the list
                        _krnDiskDriver.removeFileInFilesInUse(currentFileName);

                        // Convert the file name to hex
                        const newHexFileName = Utils.toHex(newFileName);
                        // to fill the rest with 0s
                        fileDataValue.data = _krnDiskDriver.formatData(newHexFileName);
                    }
                    // Update the display
                    Control.hostDisk();
                    _StdOut.putText("File Renamed: " + currentFileName + " --> " + newFileName);
                }
            }
        }

        public shellList(args: string[]) {
            // Check if only one argument inserted
            if (args.length == 1 && args[0] == "-a") {
                _StdOut.putText(" -------------------------------------------")
                _StdOut.advanceLine();
                for (let fileIndex=0; fileIndex < _krnDiskDriver.filesInUse.length; fileIndex++) {
                    // print all files inlcuding hidden files
                    const file = _krnDiskDriver.filesInUse[fileIndex];
                    _StdOut.putText(" Name: " + file.name);
                    _StdOut.advanceLine();
                    _StdOut.putText(" Size: " + file.size + " bytes");
                    _StdOut.advanceLine();
                    _StdOut.putText(" Created: " + file.creationDate);
                    _StdOut.advanceLine();
                    _StdOut.putText(" -------------------------------------------")
                    _StdOut.advanceLine();
                }
            }
            else if (args.length == 0) {
                _StdOut.putText(" ")
                for (let fileIndex=0; fileIndex < _krnDiskDriver.filesInUse.length; fileIndex++) {
                    // Check if its a hidden file
                    if (_krnDiskDriver.filesInUse[fileIndex].name.substring(0,1) != "."){
                        _StdOut.putText(_krnDiskDriver.filesInUse[fileIndex].name + '   ');
                    }
                }
            }
            else {
                _StdOut.putText("Usage: ls <-a>");
            }
            
        }

        public shellGetSchedule(): void {
            if (_Scheduler.schedulerType == "RR") {
                _StdOut.putText(" Round Robin Scheduling");
            }
            else if (_Scheduler.schedulerType == "FCFS") {
                _StdOut.putText(" First Come First Serve Scheduling");
            }
            else if (_Scheduler.schedulerType == "NPP") {
                _StdOut.putText(" Non-Preemptive Priority Scheduling");
            }
        }

        public shellSetSchedule(args: string[]): void {
            if (args.length == 1) {
                const schedulingType = args[0];
                if (schedulingType  == "RR") {
                    if (_Scheduler.schedulerType == "RR") {
                        _StdOut.putText(" Round Robin Scheduling");
                    }
                    else if (_Scheduler.schedulerType == "FCFS") {
                        _StdOut.putText(" First Come First Serve Scheduling");
                    }
                    else if (_Scheduler.schedulerType == "NPP") {
                        _StdOut.putText(" Non-Preemptive Priority Scheduling");
                    }
                    _StdOut.putText(" -->Round Robin Scheduling");
                    _Scheduler.schedulerType = "RR";
                }
                else if (schedulingType == "FCFS") {
                    if (_Scheduler.schedulerType == "RR") {
                        _StdOut.putText(" Round Robin Scheduling");
                    }
                    else if (_Scheduler.schedulerType == "FCFS") {
                        _StdOut.putText(" First Come First Serve Scheduling");
                    }
                    else if (_Scheduler.schedulerType == "NPP") {
                        _StdOut.putText(" Non-Preemptive Priority Scheduling");
                    }
                    _StdOut.putText(" --> First Come First Serve Scheduling");
                    _Scheduler.schedulerType = "FCFS";
                }
                else if (schedulingType == "NPP") {
                    if (_Scheduler.schedulerType == "RR") {
                        _StdOut.putText(" Round Robin Scheduling");
                    }
                    else if (_Scheduler.schedulerType == "FCFS") {
                        _StdOut.putText(" First Come First Serve Scheduling");
                    }
                    else if (_Scheduler.schedulerType == "NPP") {
                        _StdOut.putText(" Non-Preemptive Priority Scheduling");
                    }
                    _StdOut.putText(" --> Non-Preemptive Priority Scheduling");
                    _Scheduler.schedulerType = "NPP";
                }
                else {
                    _StdOut.putText("Usage: setschedule <RR or FCFS or NPP>");
                }
            }
            else {
                _StdOut.putText("Usage: setschedule <RR or FCFS or NPP>");
            }
        }

        public shellSetPriority(args: string[]) {
            if (args.length == 2) {
                const PID = parseInt(args[0], 10);
                const priority = args[1];
                // Check that the PID is valid
                if (_MemoryManager.PIDMap.get(PID) != null) {
                    // Check if it's a number
                    if (Utils.isInt(priority)) {
                        if (parseInt(priority,10) >= 0) {
                            const pcb = _MemoryManager.PIDMap.get(PID)[1];
                            pcb.priority = priority;
                            Control.hostProcesses();
                        }
                        else {
                            _StdOut.putText("Given priority is less than zero")
                        }
                    }
                    else {
                        _StdOut.putText("Given priority is not a number")
                    }
                }
                else {
                    _StdOut.putText("Given PID is invalid");
                }
            }
            else {
                _StdOut.putText("Usage: setpriority <PID> <priority>");
            }
        }
    }
}
