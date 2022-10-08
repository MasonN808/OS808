/* ------------
     Control.ts

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
//
// Control Services
//
var TSOS;
(function (TSOS) {
    class Control {
        static dateInit() {
            // Get a global reference to the canvas.
            _Canvas = document.getElementById('display');
            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");
            //Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            TSOS.CanvasTextFunctions.enable(_DrawingContext); // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.
            var date_time = new Date().toLocaleString();
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("taDate").innerHTML = date_time;
            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("btnStartOS").focus();
        }
        static dateLog() {
            // Log the date according to the CPU clock global param
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            var date_time = new Date().toLocaleString();
            // Update the log console.
            var dateLog = document.getElementById("taDate");
            dateLog.innerHTML = date_time;
        }
        static statusInit() {
            // Get a global reference to the canvas.
            _Canvas = document.getElementById('display');
            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");
            //Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            TSOS.CanvasTextFunctions.enable(_DrawingContext); // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("taStatus").innerHTML = "";
            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("btnStartOS").focus();
        }
        static statusUpdate(s) {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            // Update the status message on display
            var status = document.getElementById("taStatus");
            status.innerHTML = s;
        }
        static hostInit() {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            // Get a global reference to the canvas.
            _Canvas = document.getElementById('display');
            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");
            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            TSOS.CanvasTextFunctions.enable(_DrawingContext); // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.
            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("taHostLog").value = "";
            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("btnStartOS").focus();
            // Initialize the PCB headings
            this.hostProcessesInit();
            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }
        static hostLog(msg, source = "?") {
            // Note the OS CLOCK.
            var clock = _OSclock;
            // Note the REAL clock in milliseconds since January 1, 1970.
            var now = new Date().getTime();
            // Build the log string.
            var str = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";
            // Update the log console.
            var taLog = document.getElementById("taHostLog");
            taLog.value = str + taLog.value;
            // TODO in the future: Optionally update a log database or some streaming service.
        }
        static hostMemory() {
            // Access the memory and display it
            // TODO: _Memory or TSOS.memory?
            const memoryArray = _Memory.source;
            var rowIndex = 0;
            const columnSpace = 3;
            const spaceStr = " ".repeat(columnSpace);
            var leadingZeros = "";
            var zeroArray = [];
            var str = "";
            var taMemory = document.getElementById("taMemory");
            // Clear the text box
            taMemory.value = "";
            // Loop through the memory array to display it
            while (rowIndex < Math.ceil(_Memory.limit / 8)) {
                // Check the length to decide whether to add leading zeros
                if ((rowIndex * 8).toString(16).length === 1) {
                    leadingZeros = "0";
                }
                const slicedArrayLength = memoryArray.slice(rowIndex * 8, rowIndex * 8 + 8).length;
                if (slicedArrayLength < 8) {
                    // Push remaining zeros to the leftover of the memory array for filler
                    for (let index = 0; index < 8 - slicedArrayLength; index++) {
                        zeroArray.push("00");
                    }
                }
                // Use .toString(16) to turn int into hex
                str = spaceStr + leadingZeros + (rowIndex * 8).toString(16) + spaceStr + memoryArray.slice(rowIndex * 8, rowIndex * 8 + 8).join(" ");
                if (slicedArrayLength === 0) {
                    // Get rid of singel char leading white space
                    str += zeroArray.join(" ") + "\n";
                }
                else {
                    str += " " + zeroArray.join(" ") + "\n";
                }
                // Update the Memory console; Do taMemory.value first to keep inserted data at top
                taMemory.value = taMemory.value + str;
                rowIndex += 1;
                // Reset pointers for next line
                leadingZeros = "";
                zeroArray = [];
            }
        }
        // public static hostProcessesInit(): void {
        //     // To display the heading on screen load
        //     const columnSpace = 2;
        //     const spaceStr = " ".repeat(columnSpace)
        //     const taProcesses = <HTMLInputElement> document.getElementById("taProcesses");
        //     const heading = "PID" + spaceStr + "PC" + spaceStr + " IR" + spaceStr + "ACC" + spaceStr + "X" + spaceStr +
        //     "Y" + spaceStr + "Z" + spaceStr + "Priority" + spaceStr + "State" + spaceStr + "Location";
        //     taProcesses.value = heading;
        //     taProcesses.insertAdjacentHTML("beforeend", "<hr>")
        // }
        static hostProcessesInit() {
            // To display the heading on screen load
            const columnSpace = 2;
            const spaceStr = " ".repeat(columnSpace);
            const table = document.getElementById("taProcesses");
            var row = table.insertRow(-1);
            row.insertCell(0).innerHTML = "PID";
            row.insertCell(1).innerHTML = "PC";
            row.insertCell(2).innerHTML = "IR";
            row.insertCell(3).innerHTML = "ACC";
            row.insertCell(4).innerHTML = "X";
            row.insertCell(5).innerHTML = "Y";
            row.insertCell(6).innerHTML = "Z";
            row.insertCell(7).innerHTML = "Priority";
            row.insertCell(8).innerHTML = "State";
            row.insertCell(9).innerHTML = "Location";
            // const heading = "PID" + spaceStr + "PC" + spaceStr + " IR" + spaceStr + "ACC" + spaceStr + "X" + spaceStr +
            // "Y" + spaceStr + "Z" + spaceStr + "Priority" + spaceStr + "State" + spaceStr + "Location";
            // taProcesses.value = heading;
            // taProcesses.insertAdjacentHTML("beforeend", "<hr>")
        }
        // TODO: Finish this
        static hostProcesses(inputPid) {
            // To display the pointers in the PCB on load with heading
            const columnSpace = 2;
            const spaceStr = " ".repeat(columnSpace);
            const taProcesses = document.getElementById("taProcesses");
            // reset the block
            taProcesses.value = "";
            const heading = "PID" + spaceStr + "PC" + spaceStr + " IR" + spaceStr + "ACC" + spaceStr + "X" + spaceStr +
                "Y" + spaceStr + "Z" + spaceStr + "Priority" + spaceStr + "State" + spaceStr + "Location \n";
            // Get the memory from the input PID in the hashtable
            const memory = _MemoryManager.PIDMap.get(inputPid)[0];
            // Get the PCB from the input PID in the hashtable
            var pcb = _MemoryManager.PIDMap.get(inputPid)[1];
            // Pull pointers from the PCB to display
            const str = pcb.processId + spaceStr + pcb.programCounter + spaceStr + pcb.intermediateRepresentation + spaceStr +
                pcb.accounting + spaceStr + pcb.Xreg + spaceStr + pcb.Yreg + spaceStr + pcb.Zreg + spaceStr +
                pcb.priority + spaceStr + pcb.processState + spaceStr + pcb.location;
            taProcesses.value = heading + str;
        }
        //
        // Host Events
        //
        static hostBtnStartOS_click(btn) {
            // Disable the (passed-in) start button...
            btn.disabled = true;
            // .. enable the Halt and Reset buttons ...
            document.getElementById("btnHaltOS").disabled = false;
            document.getElementById("btnReset").disabled = false;
            // .. set focus on the OS console display ...
            document.getElementById("display").focus();
            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new TSOS.Cpu(); // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init(); //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            // Also initialize the memory
            _Memory = new TSOS.Memory();
            _Memory.init();
            _MemoryAccessor = new TSOS.MemoryAccessor();
            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(TSOS.Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new TSOS.Kernel();
            _Kernel.krnBootstrap(); // _GLaDOS.afterStartup() will get called in there, if configured.
            // Initialize the memory
            Control.hostMemory();
        }
        static hostBtnHaltOS_click(btn) {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }
        static hostBtnReset_click(btn) {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload();
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }
    }
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=control.js.map