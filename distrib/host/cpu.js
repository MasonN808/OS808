/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    class Cpu {
        constructor(PC = 0, IR = "00", Acc = 0, Xreg = 0, Yreg = 0, Zflag = 0, isExecuting = false, PID = null, Quantum = 1) {
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.PID = PID;
            this.Quantum = Quantum;
        }
        init() {
            this.PC = 0;
            this.IR = "00";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.PID = null;
            this.lastPC = 0;
            this.Quantum = 1;
        }
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // console.log("_ReadyQueue: " + _ReadyQueue);
            var contextSwitch = false;
            // For the initial run routine
            if (this.PID == null && !_ReadyQueue.isEmpty()) {
                this.PID = _ReadyQueue.dequeue();
                this.calibratePCBtoCPU(this.PID);
            }
            // For the very first running program
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];
            pcb.processState = "Running";
            // If the process is in the hard drive call roll-out and roll-in routines
            if (pcb.location == "Hard Drive") {
                console.log("In hard drive");
                const PID_TSB = _krnDiskDriver.queryPID_TSB();
                console.log("PID TSB : " + PID_TSB);
                if (PID_TSB != null) {
                    // Copy the data from the blocks
                    const opCodesStr = _krnDiskDriver.getOpCodesFromFile(PID_TSB);
                    // Turn the string of OpCodes into an array of OpCodes
                    const opCodes = TSOS.Utils.stringToOpCode(opCodesStr);
                    // Generate the opCodes from the File in the Drive
                    var memory = new TSOS.Memory(this.PID);
                    memory.source = opCodes;
                    // Check if there is an empty memory parition
                    if (_MemoryManager.canLoadProgramInMemory()) {
                        // Load the program into memory
                        _MemoryManager.loadProgramInMemory(memory, false);
                    }
                    else {
                        // Now, clear a memory segment and save the relevant information before rolling in
                        // TODO: Use the last previously used PID; currently set to the 0th partition
                        const poppedMemory = _MemoryManager.popProgramInMemory(0);
                        // Do a Deep Clean
                        _krnDiskDriver.removeFileContents(PID_TSB, false);
                        // Roll in the program from the drive
                        _MemoryManager.loadProgramInMemory(memory, false);
                        // Save the popped Memory to the Drive
                        _MemoryManager.loadProgramInMemory(poppedMemory, false);
                    }
                }
                // Set it as in Memory
                pcb.location = "Memory";
            }
            // Now update the displayed PCB
            TSOS.Control.hostProcesses(this.PID);
            // Get the Op code given the pid and pc
            var opCode = TSOS.MemoryAccessor.readMemory(this.PID, this.PC);
            opCode.currentOperator = true;
            // Update the intermediate representation in PCB and CPU
            this.updateIR();
            // Use this for to identify D0 operator is reached
            var entered_D0 = false;
            var exitProgram = false;
            // Have a massive switch statement for all possible Op codes
            switch (opCode.codeString) {
                // Load the accumulator with a constant
                case ("A9"):
                    // Get the constant one op code above current PC (i.e, do one op code lookahead)
                    var constant = TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).codeString;
                    // Change the pointer for coloring
                    TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).currentOperand = true;
                    // Update the Accumulator in CPU and PCB
                    this.updateAcc(constant);
                    // Increase the PC in CPU and PCB
                    this.changePC(2);
                    break;
                // Load the accumulator from memory
                case ("AD"):
                    // Get the storage location one op code above current PC (i.e, do one op code lookahead)
                    var storageLocation = parseInt(TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).codeString, 16);
                    // Change the pointer(s) for coloring
                    TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).currentOperand = true;
                    TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 2).currentOperand = true;
                    // Query constant from memory location
                    var constantInMemory = TSOS.MemoryAccessor.readMemory(this.PID, storageLocation).codeString;
                    // Update the Accumulator in CPU and PCB
                    this.updateAcc(constantInMemory);
                    this.changePC(3);
                    break;
                // Store the accumulator in memory
                case ("8D"):
                    // Convert int back to hex
                    var hexAcc = this.Acc.toString(16);
                    // Check if we need to append leading 0
                    if (hexAcc.length === 1) {
                        hexAcc = "0" + hexAcc;
                    }
                    // Get the storage location one op code above current PC (i.e, do one op code lookahead)
                    var storageLocation = parseInt(TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).codeString, 16);
                    // Change the pointer(s) for coloring
                    TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).currentOperand = true;
                    TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 2).currentOperand = true;
                    // Write the accumulator at the specified storage location
                    TSOS.MemoryAccessor.writeMemory(this.PID, storageLocation, hexAcc);
                    // Increase the PC in CPU and PCB
                    this.changePC(3);
                    break;
                // Add with carry...
                // Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator
                case ("6D"):
                    // Get the storage location one op code above current PC (i.e, do one op code lookahead)
                    var storageLocation = parseInt(TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).codeString, 16);
                    // Change the pointer(s) for coloring
                    TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).currentOperand = true;
                    TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 2).currentOperand = true;
                    // Query constant from memory location
                    var constantInMemory = TSOS.MemoryAccessor.readMemory(this.PID, storageLocation).codeString;
                    // Update the Accumulator by accumulating the accumulator in CPU and PCB
                    this.addToAcc(constantInMemory);
                    this.changePC(3);
                    break;
                // Load the X-register with a constant
                case ("A2"):
                    // Get the constant one op code above current PC (i.e, do one op code lookahead)
                    var constant = TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).codeString;
                    // Change the pointer(s) for coloring
                    TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).currentOperand = true;
                    this.updateX(constant);
                    // Increase the PC in CPU and PCB
                    this.changePC(2);
                    break;
                // Load the X-register from memory
                case ("AE"):
                    // Get the storage location one op code above current PC (i.e, do one op code lookahead)
                    var storageLocation = parseInt(TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).codeString, 16);
                    // Change the pointer(s) for coloring
                    TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).currentOperand = true;
                    TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 2).currentOperand = true;
                    // Query constant from memory location
                    var constantInMemory = TSOS.MemoryAccessor.readMemory(this.PID, storageLocation).codeString;
                    // Update the X-register in CPU and PCB
                    this.updateX(constantInMemory);
                    this.changePC(3);
                    break;
                // Load the Y-register with a constant
                case ("A0"):
                    // Get the constant one op code above current PC (i.e, do one op code lookahead)
                    var constant = TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).codeString;
                    // Change the pointer(s) for coloring
                    TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).currentOperand = true;
                    this.updateY(constant);
                    // Increase the PC in CPU and PCB
                    this.changePC(2);
                    break;
                // Load the Y-register from memory
                case ("AC"):
                    // Get the storage location one op code above current PC (i.e, do one op code lookahead)
                    var storageLocation = parseInt(TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).codeString, 16);
                    // Change the pointer(s) for coloring
                    TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).currentOperand = true;
                    TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 2).currentOperand = true;
                    // Query constant from memory location
                    var constantInMemory = TSOS.MemoryAccessor.readMemory(this.PID, storageLocation).codeString;
                    // Update the Y-register in CPU and PCB
                    this.updateY(constantInMemory);
                    this.changePC(3);
                    break;
                // No operation
                case ("EA"):
                    this.changePC(1);
                    break;
                // Compare a byte in memory to the X-register;  Sets the Z (zero) flag to 1 if equal
                case ("EC"):
                    // Get the storage location one op code above current PC (i.e, do one op code lookahead)
                    var storageLocation = parseInt(TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).codeString, 16);
                    // Change the pointer(s) for coloring
                    TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).currentOperand = true;
                    TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 2).currentOperand = true;
                    // Query constant from memory location
                    var constantInMemory = TSOS.MemoryAccessor.readMemory(this.PID, storageLocation).codeString;
                    // Parse to compare with X-register
                    var parsedConstantInMemory = parseInt(constantInMemory, 16);
                    if (parsedConstantInMemory == this.Xreg) {
                        this.updateZ(1);
                    }
                    else {
                        this.updateZ(0);
                    }
                    this.changePC(3);
                    break;
                // Branch n bytes if Z-flag == 0 
                case ("D0"):
                    entered_D0 = true;
                    // Get the branch number
                    var branch = TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).codeString;
                    // Change the pointer(s) for coloring
                    TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).currentOperand = true;
                    if (this.Zflag === 0) {
                        // -1 since _Memory.limit = 256 not 255
                        if (parseInt(branch, 16) > _MemoryManager.limit - this.PC) {
                            this.updatePC((parseInt(branch, 16) + this.PC) - _MemoryManager.limit + 1);
                        }
                        else {
                            this.updatePC(parseInt(branch, 16) + this.PC + 2);
                        }
                    }
                    else {
                        this.changePC(2);
                    }
                    break;
                // Increment the value of a byte
                case ("EE"):
                    // Get the storage location one op code above current PC (i.e, do one op code lookahead)
                    var storageLocation = parseInt(TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).codeString, 16);
                    // Change the pointer(s) for coloring
                    TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1).currentOperand = true;
                    TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 2).currentOperand = true;
                    // Query constant from memory location
                    var constantInMemory = TSOS.MemoryAccessor.readMemory(this.PID, storageLocation).codeString;
                    // Increment the byte and write to same memory location
                    TSOS.MemoryAccessor.writeMemory(this.PID, storageLocation, (parseInt(constantInMemory, 16) + 1).toString(16));
                    this.changePC(3);
                    break;
                // System Call
                // #$01 in X reg = print the integer stored in the Y-register
                // #$02 in X reg = print the 00-terminated string stored at the address in the Y-register
                case ("FF"):
                    // Check the X reg
                    if (this.Xreg === 1) {
                        // convert decimal to hex, then hex into ASCII
                        // Add 48 since integers start at 48 rather than 0 in ASCII
                        // See https://www.rapidtables.com/code/text/ascii-table.html
                        _StdOut.putText(TSOS.Utils.hex2a((this.Yreg + 48).toString(16)));
                    }
                    else if (this.Xreg === 2) {
                        var memoryIndex = this.Yreg;
                        var constantInMemory = TSOS.MemoryAccessor.readMemory(this.PID, memoryIndex).codeString;
                        while (constantInMemory != "00") {
                            // convert the hex into ASCII
                            _StdOut.putText(TSOS.Utils.hex2a(constantInMemory));
                            memoryIndex += 1;
                            constantInMemory = TSOS.MemoryAccessor.readMemory(this.PID, memoryIndex).codeString;
                        }
                    }
                    this.changePC(1);
                    break;
                // Check for the end of program marker
                case ("00"):
                    // NOTE: Dont need to remove from the ready queue, since it has already been done due to queue structure
                    _MemoryManager.removePIDFromEverywhere(this.PID);
                    // Reset all CPU pointers for next executing program
                    // this.PID = null;
                    // this.Quantum = 1;
                    // Check if the ready queue is empty to determine whether to completly stop CPU execution
                    if (_ReadyQueue.isEmpty()) {
                        exitProgram = true;
                        _CPU.init(); // turns .isExecuting to false
                    }
                    // Issue a context switch
                    else {
                        _Scheduler.issueContextSwitchInterrupt("type-2", this.PID);
                        contextSwitch = true;
                    }
                    break;
                // We reached an invalid operator
                default:
                    _StdOut.putText("Invalid Operator " + this.IR + " in PID " + this.PID + ", clearing CPU and memory partition");
                    _MemoryManager.removePIDFromEverywhere(this.PID);
                    // Restart the CPU
                    _CPU.init();
                    // Update displays
                    TSOS.Control.hostMemory();
                    TSOS.Control.hostCpu();
            }
            TSOS.Control.hostCpu();
            TSOS.Control.hostMemory();
            // If we have not exited quite yet
            if (this.PID !== null && !contextSwitch) {
                // Reset the operator and operand pointers for coloring text
                if (entered_D0) {
                    TSOS.MemoryAccessor.readMemory(this.PID, this.lastPC + 1).currentOperand = false;
                }
                else {
                    TSOS.MemoryAccessor.readMemory(this.PID, this.PC - 1).currentOperand = false;
                    TSOS.MemoryAccessor.readMemory(this.PID, this.PC - 2).currentOperand = false;
                }
                opCode.currentOperator = false;
                // Validate the current quantum and issue an interrupt if we hit the max quantum
                _Scheduler.validateQuantum(this.PID);
                this.incrementQuantum();
            }
            // Now update the displayed PCB
            if (!exitProgram && this.PID !== null && !contextSwitch) {
                TSOS.Control.hostProcesses(this.PID);
            }
        }
        calibratePCBtoCPU(targetPID) {
            const pcb = _MemoryManager.PIDMap.get(targetPID)[1];
            this.PID = targetPID; // TODO: This might be redundant
            this.PC = pcb.programCounter;
            this.lastPC = pcb.lastProgramCounter;
            this.IR = pcb.intermediateRepresentation;
            this.Acc = pcb.Acc;
            this.Xreg = pcb.Xreg;
            this.Yreg = pcb.Yreg;
            this.Zflag = pcb.Zflag;
            this.Quantum = pcb.currentQuantum;
        }
        changePC(change) {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];
            // Keep track of this to display on PCB without delay
            this.lastPC = this.PC;
            pcb.lastProgramCounter = this.PC;
            this.PC += change;
            pcb.programCounter += change;
        }
        updatePC(absolute) {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];
            // Keep track of this to display on PCB without delay
            this.lastPC = this.PC;
            pcb.lastProgramCounter = this.PC;
            this.PC = absolute;
            pcb.programCounter = absolute;
        }
        addToAcc(addedNum) {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];
            // If we are adding to the accumulator rather than replacing
            this.Acc += parseInt(addedNum, 16);
            pcb.Acc += parseInt(addedNum, 16);
        }
        updateAcc(newAccAsHex) {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];
            // parse string to an int to store in Accumulator
            this.Acc = parseInt(newAccAsHex, 16);
            pcb.Acc = parseInt(newAccAsHex, 16);
        }
        updateX(newXAsHex) {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];
            // parse string to an int to store in X register
            this.Xreg = parseInt(newXAsHex, 16);
            pcb.Xreg = parseInt(newXAsHex, 16);
        }
        updateY(newYAsHex) {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];
            // parse string to an int to store in Y register
            this.Yreg = parseInt(newYAsHex, 16);
            pcb.Yreg = parseInt(newYAsHex, 16);
        }
        updateZ(newZ) {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];
            // parse string to an int to store in Z flag
            this.Zflag = newZ;
            pcb.Zflag = newZ;
        }
        updateIR() {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];
            // Update the IR given the current PC
            this.IR = TSOS.MemoryAccessor.readMemory(this.PID, this.PC).codeString;
            pcb.intermediateRepresentation = TSOS.MemoryAccessor.readMemory(this.PID, this.PC).codeString;
        }
        incrementQuantum() {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];
            this.Quantum += 1;
            pcb.currentQuantum = this.Quantum;
        }
        resetQuantum() {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];
            this.Quantum = 0;
            pcb.currentQuantum = this.Quantum;
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map