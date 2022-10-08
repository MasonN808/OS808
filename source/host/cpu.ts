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

            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];

            // Have a massive switch statement for all possible Op codes
            switch (opCode) {
                // Load the accumulator with a constant
                case ("A9"):
                    // Get the constant one op code above current PC (i.e, do one op code lookahead)
                    var constant = TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1);

                    // Update the Accumulator in CPU and PCB
                    this.updateAcc(constant)

                    // Increase the PC in CPU and PCB
                    this.increasePC(2);
                    break;
                
                // Load the accumulator from memory
                case ("AD"):
                    // Get the storage location one op code above current PC (i.e, do one op code lookahead)
                    var storageLocation = parseInt(TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1), 16);

                    // Query constant from memory location
                    var constantInMemory = TSOS.MemoryAccessor.readMemory(this.PID, storageLocation);
                    
                    // Update the Accumulator in CPU and PCB
                    this.updateAcc(constantInMemory)

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
                    var storageLocation = parseInt(TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1), 16);
                    
                    // Write the accumulator at the specified storage location
                    TSOS.MemoryAccessor.writeMemory(this.PID, storageLocation, hexAcc)

                    // Increase the PC in CPU and PCB
                    this.increasePC(3);
                    break;
                
                // Load the X-register with a constant
                case ("A2"):
                    // Get the constant one op code above current PC (i.e, do one op code lookahead)
                    var constant = TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1);
                    
                    this.updateX(constant);

                    // Increase the PC in CPU and PCB
                    this.increasePC(2);
                    break;
                
                // Load the X-register from memory
                case ("AE"):
                    // Get the storage location one op code above current PC (i.e, do one op code lookahead)
                    var storageLocation = parseInt(TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1), 16);
                    
                    // Query constant from memory location
                    var constantInMemory = TSOS.MemoryAccessor.readMemory(this.PID, storageLocation);
                        
                    // Update the Accumulator in CPU and PCB
                    this.updateX(constantInMemory);

                    this.increasePC(2);
                    break;
                
                // Load the Y-register with a constant
                case ("A0"):
                    // Get the constant one op code above current PC (i.e, do one op code lookahead)
                    var constant = TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1);
                    
                    this.updateY(constant);

                    // Increase the PC in CPU and PCB
                    this.increasePC(2);
                    break;
                
                // Load the Y-register from memory
                case ("AC"):
                    // Get the storage location one op code above current PC (i.e, do one op code lookahead)
                    var storageLocation = parseInt(TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1), 16);
                    
                    // Query constant from memory location
                    var constantInMemory = TSOS.MemoryAccessor.readMemory(this.PID, storageLocation);
                        
                    // Update the Accumulator in CPU and PCB
                    this.updateY(constantInMemory);

                    this.increasePC(2);
                    break;
                
                // No operation
                case ("EA"):
                    this.increasePC(1);
                    break;

                // Compare a byte in memory to the X-register;  Sets the Z (zero) flag if equal
                // case ("EC"):

            }
            // Now update the displayed PCB
            TSOS.Control.hostProcesses(this.PID);
        }

        private increasePC(pcIncrease: number): void {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];
            
            this.PC += pcIncrease;
            pcb.programCounter += pcIncrease;
        }

        private updateAcc(newAccAsHex: string): void {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];

            // parse string to an int to store in accumulator
            this.Acc = parseInt(newAccAsHex, 16);
            pcb.Acc = parseInt(newAccAsHex, 16);
        }

        private updateX(newXAsHex: string): void {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];

            // parse string to an int to store in accumulator
            this.Acc = parseInt(newXAsHex, 16);
            pcb.Acc = parseInt(newXAsHex, 16);
        }

        private updateY(newYAsHex: string): void {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];

            // parse string to an int to store in accumulator
            this.Acc = parseInt(newYAsHex, 16);
            pcb.Acc = parseInt(newYAsHex, 16);
        }
    }
}
