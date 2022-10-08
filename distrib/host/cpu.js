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
            // Have a massive switch statement for all possible Op codes
            switch (opCode) {
                // Load the accumulator with a constant
                case ("A9"):
                    // Get the constant (i.e, do one op code lookahead)
                    const constant = TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1);
                    // parse it to an int to store in accumulator
                    const paresedConstant = parseInt(constant, 16);
                    // Assign the parsed constant to the CPU and PCB
                    this.Acc = paresedConstant;
                    _MemoryManager.PIDMap.get(this.PID)[1].Acc = paresedConstant;
                    break;
            }
            // Now update the displayed PCB
            TSOS.Control.hostProcesses(this.PID);
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map