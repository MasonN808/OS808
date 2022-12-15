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
module TSOS {

    export class Control {

        public static dateInit(): void {
            // Get a global reference to the canvas.
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            //Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            this.dateLog();

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();
        }

        public static dateLog(): void {
            // Log the date according to the CPU clock global param
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            
            var date_time = new Date().toLocaleString();

            // Update the log console.
            var dateLog = <HTMLInputElement> document.getElementById("taDate");
            dateLog.innerHTML = date_time;
        }

        public static statusInit(): void {
            // Get a global reference to the canvas.
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            //Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.
            
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taStatus")).innerHTML="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();
        }

        public static statusUpdate(s: string): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Update the status message on display
            var status = <HTMLInputElement> document.getElementById("taStatus");
            status.innerHTML = s;
        }

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }

        public static hostMemoryInit(): void {
            // Display memory of 00s
            const table = <HTMLTableElement> document.getElementById("taMemory");
            // Loop through all programs
            for (let loadedProgramIndex = 0; loadedProgramIndex < _MemoryManager.maxLoadedPrograms; loadedProgramIndex++) {
                var rowIndex = 0 + (32 * loadedProgramIndex);
                var leadingZeros = "";
                var zeroArray = [];
                // Loop through the memory array to display it
                while (rowIndex < Math.ceil(_MemoryManager.limit/8)*(loadedProgramIndex + 1)) {
                    // Check the length to decide whether to add leading zeros
                    if ((rowIndex*8).toString(16).length === 1) {
                        leadingZeros = "0";
                    }

                    var row = table.insertRow(-1);

                    // Use .toString(16) to turn int into hex
                    // Insert the row label
                    row.insertCell(0).innerHTML = leadingZeros + (rowIndex*8).toString(16);
                    for (let columnIndex=1; columnIndex < 9; columnIndex++){
                        row.insertCell(columnIndex).innerHTML = "00";
                    }

                    rowIndex += 1;
                    // Reset pointers for next line
                    leadingZeros = "";
                    zeroArray = [];
                }
            }
        }

        public static hostMemory(): void {
            // Access the memory and display it
            const table = <HTMLTableElement> document.getElementById("taMemory");
            // Loop through all programs in sequence
            for (let loadedProgramIndex = 0; loadedProgramIndex < _MemoryManager.maxLoadedPrograms; loadedProgramIndex++) {
                // Get the source memory from the parition in main memory
                // OLD
                // const memoryArray = _MemoryManager.mainMemory[loadedProgramIndex].source;
                // NEW
                const pid = _MemoryManager.mainMemory[loadedProgramIndex].PID;
                if (pid == -1 || pid == null) {
                    var memoryArray = _MemoryManager.mainMemory[loadedProgramIndex].source;
                }
                else {
                    var memoryArray = _MemoryManager.PIDMap.get(pid)[0].source; // get the memory
                }
                
                // adjust rowIndex WRT loaded program index
                var rowIndex = 0 + (32 *loadedProgramIndex);
    
                // Loop through the memory array to display it
                while (rowIndex < Math.ceil(_MemoryManager.limit/8)*(loadedProgramIndex + 1)){
                    const slicedArrayLength = memoryArray.slice((rowIndex-(32*loadedProgramIndex))*8, (rowIndex-(32*loadedProgramIndex))*8 + 8).length;
                    // Add one for the row label element
                    for (let columnIndex=1; columnIndex < slicedArrayLength + 1; columnIndex++){
                        var cell = table.rows[rowIndex].cells[columnIndex];
                        
                        var elementIndex = (rowIndex-(32 *loadedProgramIndex))*8 + columnIndex - 1;
                        cell.innerText = memoryArray[elementIndex].codeString;
                        
                        // Color the table element text
                        if (memoryArray[elementIndex].currentOperator){
                            cell.style.color = "#e10544"; // Terraria Red
                        }
                        else if (memoryArray[elementIndex].currentOperand){
                            cell.style.color = "#f29091"; // Terraria Light Red
                        }
                        else {
                            cell.style.color = "black";
                        }
                    }
    
                    rowIndex += 1;
                }
            }
        }

        public static hostProcessesInit(inputPid: number): void {
            // To display the pointers in the PCB on load with heading
            const table = <HTMLTableElement> document.getElementById("taProcesses");

            // Get the PCB from the input PID in the hashtable
            var pcb = _MemoryManager.PIDMap.get(inputPid)[1];

            // insert the row at the very bottom relative to all other rows
            var row = table.insertRow(-1);
            row.insertCell(0).innerHTML = pcb.processId;
            row.insertCell(1).innerHTML = pcb.programCounter;
            row.insertCell(2).innerHTML = pcb.intermediateRepresentation;
            row.insertCell(3).innerHTML = pcb.Acc;
            row.insertCell(4).innerHTML = pcb.Xreg;
            row.insertCell(5).innerHTML = pcb.Yreg;
            row.insertCell(6).innerHTML = pcb.Zflag;
            row.insertCell(7).innerHTML = pcb.priority;
            row.insertCell(8).innerHTML = pcb.processState;
            row.insertCell(9).innerHTML = pcb.location;
            row.insertCell(10).innerHTML = pcb.base;
            row.insertCell(11).innerHTML = pcb.limit;
            row.insertCell(12).innerHTML = pcb.segment;
            row.insertCell(13).innerHTML = pcb.currentQuantum;
        }

        public static hostProcesses(inputPid: number): void {
            const table = <HTMLTableElement> document.getElementById("taProcesses");

            // Get the PCB from the input PID in the hashtable
            // const pcb = _MemoryManager.PIDMap.get(inputPid)[1];
            
            // give the appropriate rowIndex
            var addedRowIndex = 1;
            // loop through hash map to get key-value pairs
            for (const entry of _MemoryManager.PIDMap.entries()) {
                // entry[1] is the value
                // entry[1][1] is the pcb
                const pcb = entry[1][1];
                // Check if the key of the entry is in the ready queue or the CPU
                // entry[0] is the key
                if (_ReadyQueue.q.indexOf(entry[0]) > -1 || _CPU.PID == entry[0]) {
                    // Adjust the rowIndex pointers
                    pcb.rowIndex = addedRowIndex;
                    addedRowIndex += 1;
                    // const pcb = _MemoryManager.PIDMap.get(pcb)[1];
                    // Update the base, limit, and segment
        
                    table.rows[pcb.rowIndex].cells[0].innerHTML = pcb.processId;
                    table.rows[pcb.rowIndex].cells[1].innerHTML = pcb.programCounter;
                    table.rows[pcb.rowIndex].cells[2].innerHTML = pcb.intermediateRepresentation;
                    table.rows[pcb.rowIndex].cells[3].innerHTML = pcb.Acc;
                    table.rows[pcb.rowIndex].cells[4].innerHTML = pcb.Xreg;
                    table.rows[pcb.rowIndex].cells[5].innerHTML = pcb.Yreg;
                    table.rows[pcb.rowIndex].cells[6].innerHTML = pcb.Zflag;
                    table.rows[pcb.rowIndex].cells[7].innerHTML = pcb.priority;
                    table.rows[pcb.rowIndex].cells[8].innerHTML = pcb.processState;
                    table.rows[pcb.rowIndex].cells[9].innerHTML = pcb.location;
                    table.rows[pcb.rowIndex].cells[10].innerHTML = pcb.base;
                    table.rows[pcb.rowIndex].cells[11].innerHTML = pcb.limit;
                    table.rows[pcb.rowIndex].cells[12].innerHTML = pcb.segment;
                    table.rows[pcb.rowIndex].cells[13].innerHTML = pcb.currentQuantum;
                }
            }

        }

        public static hostDisk(): void {
            // To display the Hard disk heading
            const table = <HTMLTableElement> document.getElementById("taHardDrive");
            
            // Remove all the rows except for the headers to repopulate
            while (table.rows.length > 1) {
                table.deleteRow(-1);
            }

            // Get the PCB from the input PID in the hashtable
            const diskMap = _krnDiskDriver.diskMap;
            
            // Loop through each key and value pair in the map
            for (const [key, value] of diskMap) {
                var row = table.insertRow(-1);
                row.insertCell(0).innerHTML = key;
                row.insertCell(1).innerHTML = value.used.toString(); // Turn number into string
                row.insertCell(2).innerHTML = value.next.join(''); // Turn list of numbers into string
                // Populate a new array of the strings from OpCode objects for display
                var opCodes = [];
                for (let index=0; index < value.data.length; index++) {
                    // Append the opcode string
                    opCodes.push(value.data[index].opCodeString);
                }
                row.insertCell(3).innerHTML = opCodes.join(' '); // Transform into string first
            }
        }

        public static hostCpuInit(): void {
            // To display the pointers in the CPU on load with heading
            const table = <HTMLTableElement> document.getElementById("taCpu");

            // insert the row at the ver bottom relative to all other rows
            var row = table.insertRow(1);
            row.insertCell(0).innerHTML = _CPU.PC.toString();
            row.insertCell(1).innerHTML = _CPU.IR;
            row.insertCell(2).innerHTML = _CPU.Acc.toString(16);
            row.insertCell(3).innerHTML = _CPU.Xreg.toString(16);
            row.insertCell(4).innerHTML = _CPU.Yreg.toString(16);
            row.insertCell(5).innerHTML = _CPU.Zflag.toString(16);
        }

        public static hostCpu(): void {
            // To display the pointers in the CPU on load with heading
            const table = <HTMLTableElement> document.getElementById("taCpu");

            table.rows[1].cells[0].innerHTML = _CPU.lastPC.toString();
            table.rows[1].cells[1].innerHTML = _CPU.IR;
            table.rows[1].cells[1].style.color = "red";
            table.rows[1].cells[2].innerHTML = _CPU.Acc.toString(16);
            table.rows[1].cells[3].innerHTML = _CPU.Xreg.toString(16);
            table.rows[1].cells[4].innerHTML = _CPU.Yreg.toString(16);
            table.rows[1].cells[5].innerHTML = _CPU.Zflag.toString(16);
        }

        public static hostRemoveProcess(inputPid: number): void {
            const table = <HTMLTableElement> document.getElementById("taProcesses");

            // Get the PCB from the input PID in the hashtable
            var pcb = _MemoryManager.PIDMap.get(inputPid)[1];

            // give the appropriate rowIndex
            var addedRowIndex = 1;
            // loop through hash map to get key-value pairs
            for (const entry of _MemoryManager.PIDMap.entries()) {
                // entry[1] is the value
                // entry[1][1] is the pcb
                const traversedPCB = entry[1][1];
                // Check if the key of the entry is in the ready queue or the CPU
                if (_ReadyQueue.q.indexOf(entry[0]) > -1 || _CPU.PID == entry[0]) {
                    // Adjust the rowIndex pointers
                    traversedPCB.rowIndex = addedRowIndex;
                    addedRowIndex += 1;
                }
            }

            table.deleteRow(pcb.rowIndex);
        }


        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt and Reset buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnToggleStepMode")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // Initialize the scheduler
            _Scheduler = new Scheduler();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            
            // Also initialize the memory
            // _Memory	= new Memory();
            
            // _Memory.init();
            _MemoryAccessor	= new MemoryAccessor();    

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.
        }

        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload();
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }

        public static hostBtnToggleStep_click(btn): void {
            // To change the button color on click
            var style = document.getElementById('btnToggleStepMode').style;
            // On initialization, the buttion background color is "", ... strangely
            if (style.backgroundColor == "green" || style.backgroundColor == "") {
                style.backgroundColor = "red";

                // Enable the step buttion
                (<HTMLButtonElement>document.getElementById("btnStep")).disabled = false;
            } else {
                style.backgroundColor = "green";

                // Disable the step buttion
                (<HTMLButtonElement>document.getElementById("btnStep")).disabled = true;
            }

            _ToggleStepMode = !_ToggleStepMode;
        }

        public static hostBtnStep_click(btn): void {
            _StepPressed = true;
        }
            
    }
}
