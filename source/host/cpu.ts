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

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false,
                    public PID: number = null) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.PID = null;
        }

        public cycle(): void {
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
                    const lookAheadConstant1 = TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1);
                    // parse it to an int to store in accumulator
                    const paresedConstant = parseInt(lookAheadConstant1, 16);

                    // Assign the parsed constant to the CPU and PCB
                    this.Acc = paresedConstant;
                    pcb.Acc = paresedConstant;

                    // Increase the PC in CPU and PCB
                    this.PC += 2;
                    pcb.programCounter += 2;
                    break;

                // Store the accumulator in memory
                case ("8D"):
                

            }
            // Now update the displayed PCB
            TSOS.Control.hostProcesses(this.PID);
        }
    }
}
