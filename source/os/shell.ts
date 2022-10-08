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


            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.

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
                        _StdOut.putText("Shuts down the Kernel")
                        break;

                    case "cls":
                        _StdOut.putText("clears the screen")
                        break;

                    case "trace":
                        _StdOut.putText("Switches the host log on and off")
                        break;

                    case "rot13":
                        _StdOut.putText("Encrypts a string into another string")
                        break;

                    case "prompt":
                        _StdOut.putText("Changes the prompt of the console")
                        break;

                    case "date":
                        _StdOut.putText("Outputs the current date and time")
                        break;

                    case "whereami":
                        _StdOut.putText("Gives an insightful message about the user's location")
                        break;
                    
                    case "howareu":
                        _StdOut.putText("Gives insightful information about the OS")
                        break;

                    case "whoismason":
                        _StdOut.putText("Gives website url of Mason")
                        break;

                    case "status":
                        _StdOut.putText("Pastes a status message provided by the user to the display")
                        break;
                    
                    case "bsod":
                        _StdOut.putText("Does blue screen of death")
                        break;

                    case "load":
                        _StdOut.putText("Loads and validates the input code")
                        break;

                    case "run":
                        _StdOut.putText("runs the input code at <pid>")
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
                    // Check that the loaded number of OP codes
                    // Do /2 since its counting single character length
                    if (removed_white_space_input_text.length / 2 > _Memory.limit) {
                        // Display warning
                        _StdOut.putText("Program too large");
                    }
                    else {
                        // Initialize the array to overwrite the source pointer in _Memory instance
                        var loadedSource = [];
    
                        // Populate an array with the OP codes
                        for (let index = 0; index < removed_white_space_input_text.length; index += 2){
                            loadedSource.push(removed_white_space_input_text.substring(index, index + 2))
                        }
    
                        _Memory.source = loadedSource;
    
                        // Display the memory
                        TSOS.Control.hostMemory();
                        
                        // Assign a PID
                        _MemoryManager.assignPID();
                        
                        // Output the PID
                        _StdOut.putText("Process ID: " + (_MemoryManager.maxPID - 1));
                    }
                }
            }
        }

        public shellRun(args: string[]) {
            if (args.length > 0) {
                if (TSOS.Utils.isInt(args[0])) {
                    const inputPid = parseInt(args[0])

                    // Try and find the input PID in the hashtable
                    if (_MemoryManager.PIDMap.has(inputPid)) {
                        TSOS.Control.hostProcesses()
                    } 
                    else {
                        _StdOut.putText("Undefined Process ID: " + inputPid);
                    }
                } 
                else {
                    _StdOut.putText("Invalid arguement.  Usage: run <pid>.");
                }
                const pId = args[0];
            } 
            else {
                _StdOut.putText("Usage: run <pid>");
            }

        }
    }
}
