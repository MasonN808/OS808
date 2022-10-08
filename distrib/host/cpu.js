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
        constructor(PC = 0, Acc = 0, Xreg = 0, Yreg = 0, Zflag = 0, isExecuting = false, PID = null) {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.PID = PID;
        }
        init() {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.PID = null;
        }
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            // Get the Op code given the pid and pc
            var opCode = TSOS.MemoryAccessor.readMemory(this.PID, this.PC);
            // // Get the constant one op code above current PC (i.e, do one op code lookahead)
            // const lookAheadConstant1 = TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1);
            // // Get the constant two op codes above current PC (i.e, do two op code lookahead)
            // const lookAheadConstant2 = TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 2);
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];
            // Have a massive switch statement for all possible Op codes
            switch (opCode) {
                // Load the accumulator with a constant
                case ("A9"):
                    // Get the constant one op code above current PC (i.e, do one op code lookahead)
                    const lookAheadConstant = TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1);
                    // parse it to an int to store in accumulator
                    const paresedConstant = parseInt(lookAheadConstant, 16);
                    // Assign the parsed constant to the CPU and PCB
                    this.Acc = paresedConstant;
                    pcb.Acc = paresedConstant;
                    // Increase the PC in CPU and PCB
                    this.increasePC(2);
                    break;
                // Load the accumulator from memory
                case ("AD"):
                    // Get the storage location one op code above current PC (i.e, do one op code lookahead)
                    var lookAheadStorageLocation = parseInt(TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1), 16);
                    // Retrieve the constant from specified memory location
                    const retrievedConstant = TSOS.MemoryAccessor.readMemory(this.PID, lookAheadStorageLocation);
                    this.Acc = parseInt(retrievedConstant, 16);
                    pcb.Acc = parseInt(retrievedConstant, 16);
                    this.increasePC(2);
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
                    var lookAheadStorageLocation = parseInt(TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1), 16);
                    // Write the accumulator at the specified storage location
                    TSOS.MemoryAccessor.writeMemory(this.PID, lookAheadStorageLocation, hexAcc);
                    // Increase the PC in CPU and PCB
                    this.increasePC(3);
                    break;
            }
            // Now update the displayed PCB
            TSOS.Control.hostProcesses(this.PID);
        }
        increasePC(pcIncrease) {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];
            this.PC += pcIncrease;
            pcb.programCounter += pcIncrease;
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map