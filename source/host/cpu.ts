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
        
        // This didnt work when implementing step mode; will delete later
        // See https://www.typescriptlang.org/play?#code/PTAEFkHsBMFMCcB2oBSBDAbmgygY3gJYAOALqGtHNOaAO5oCeoJkoAFmotADayi5pu3AEZpcAawDOoAsk4BYAFAhQsXgHNOZek2FMK0WepoAFeJAC2BSX1E3qAQRMBJOmwK427NNMlFYuASCSiqSDIgkaAAezBxkvCTSDJAArszwsGhkPuGe5oip0rgwfD6xqepeBCQhYGKJoGGIeZAFKZLcDAB0SrWgADIE4qVCoNyc6ilo6nwAZpkkKRmSADSx1jLSaOkUsAC0kLOzMoh9xRZEvFHVDABcoBZo4kY0synNJASt5E24D5mIJKpeCgDKLJB9LDcFKwLYZOjwNBEfzUWSgMyWaywrqgADqcVA7Vg1BYoNg4LkfUkJEIiHUawKtDJFK26PMVhsAB5qbT1AA+HqKJTFQFkN7NUAAXlAAAoAJRSvmgABEt3oGFgt2VAG5ha1qT9cgAxd5-aU5CXyxUqtWYTU63qKEUGiwMbA0l7S8W4eW6p36siujEc2Du3lSw3NE3NX2O11hoxdXh0khsP19IPsrEJumbUxZmwMyBkVN8HlGW5xhjB7MeulJ2AptOOlQATVS-E4hJssVK9GqoGGDFokHgJNYIo18GyoCIBdgfVkpOq0ihMJxABUYIw1qWe61OnRR+ITpICHByHJfn1vZ9WoK9aKHgxcYjkQho7g78hzb9ZQrJSVABvJRQH4ANnxzYwvVNWNFDA51AwYAAlWFIG4DVoBrGwoIjNB+2yX5Pzg0DQBUAA1IJe3IAjB1gYdR2gIsmVdVDJHQzDsNDOt1FIlQNm2cs6VI+MeIbJs-TA1i0Iw4kuKg8T1FTP0AF902UMAAGESjcDwqmkeB3kQF4MCort8LQAcBGQVNzCZBBzHgVY+k4VESAAcmkAgLlHSIImYCcsk8coewc0dfEsWBaDYBBYAff0n1dDc2DsoxP2-PC-ytQDQBA+DYjs0BECi0AAFF4EcmVlQAEVYAoyAEUZU2sZU5VU9SVFxPhrIRJFOyEF5zL-W8vmQNFthpJgBBIYKWD6DguF4TsbGkaLYuokbvnqaR3lgKJ-C-YlOnixDI1wdLRs0oL3FzX9cn-a08oQiDpIpcjBBhCNlQACTUbhWBHeBuGgB18sm3LSLAiyBySlLIFoNLTW-OCwJUzsZq8GUwvgBUnrA8DAXQuLsaq2HUrpC7vlmSzeBBtZsba0iVNIsElmQV62fe6FYHalswGqz7SVLVR4HUVpMVwaRDnWaQnFcYRYBeRXSxBVmkCMFzGiMJa11gNZRwK+GjDWZI0kkNhUmBgmzzgEFDnmXlF0QWZR0eDK0GEVISxislJBSbgyFkG2+GFtXiuoXXL2gPoiUNpkDyYNbkHYixyRu4waX9pg9twWBSFGwRvEkPpIFwXAlgyaATogva0AuXhsAARymDJkMgYtKZ-M7ZVkIgUhIe5OAYADgNIghjhlawADk0CnyfED7kg5VxyG46Kkrysq5UAHlEEPRAUgsBWnPIeExFz0hiVayTQGZoV8vHnuF-70BOVAAAGFf8rAsPcsaFIy6wkkPcam3BCz-EkJIaYmoVRXUQPVRozc0DwnMMWdemhPgaiKofY+ypb43zRmoHseMf7kjZn-P2gDIH3EznrUAut7jgCyGwLokhG7TnnovBUakmZKB4ffFQyVGwbSRqNa2h8EBFC7J4AIJ40Sh1hEQfUpQuA3gIJMeEXs3BZACqAaAANqheFNqrMhSB6EfTinidwS1mrFw0nmCahBTKF1rvXOhrRc6gFNt4LB1JkEkGJEeeAzxcwI1TH0YqJBAYhOMMUC8e4+By2kArc4fBAapmontGkglwiRCiNXJ8MiJBNxbrANuaC7qWgYdgo+CAR4Q3yqdZYSjAR8HNLRVxlxQxINbu3EgncZS60Zg-CezTlGsIAbnSBX98a+xaTYLousCF8I6mABwvxgAOFoiwSAJ44lpPcMFf6uzAncCGCHdwwC+agBmCQNi8zYAyiWNwNYMoxmtPqXlFQYFbn3OUW8xR4znmvJsCKaAfyPmPT6LMppgLWnVSyNsaUoLWjgrhQs6AiLoX41+eix57ybAIsiF0YFspmpjghTYT52LZldDpTS2+cpsUqSZfYll1yHBcDGOSGQZAUmRTGLITIIIznDErAIsAsK-DKLwrRXF0rWlPKBqylQp0UVcEpW0milkyDyoeQChVCznkqslRBAlsAiVIsaAEVFmquiYsiGcCC5K0WGq1dDXV5JNUGoeZaklyq+h0vip1Q5XgeqPGGNRfZWsGr-RsCCUkvBZhkGJDMNYrk+gKzJBQOghiaDOmsAE-y8A2AMFTBYLoQA
        // for resources on async and await
        // public awaitCycle = async() => {
        //     var promise = new Promise(() => { _StepPressed == true });
        //     const response = await promise;
        //     if (response) {
        //         console.log("MADE IT")
        //         _CPU.cycle();
        //         _StepPressed = false;
        //     }
        // }

        public lastPC: number;

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
            this.lastPC = null;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');

            // Get the Op code given the pid and pc
            var opCode = TSOS.MemoryAccessor.readMemory(this.PID, this.PC);

            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];

            // Update the IR given the current PC
            pcb.intermediateRepresentation = TSOS.MemoryAccessor.readMemory(this.PID, this.PC);

            // Have a massive switch statement for all possible Op codes
            switch (opCode) {
                // Load the accumulator with a constant
                case ("A9"):
                    // Get the constant one op code above current PC (i.e, do one op code lookahead)
                    var constant = TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1);

                    // Update the Accumulator in CPU and PCB
                    this.updateAcc(constant)

                    // Increase the PC in CPU and PCB
                    this.changePC(2);
                    break;
                
                // Load the accumulator from memory
                case ("AD"):
                    // Get the storage location one op code above current PC (i.e, do one op code lookahead)
                    var storageLocation = parseInt(TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1), 16);

                    // Query constant from memory location
                    var constantInMemory = TSOS.MemoryAccessor.readMemory(this.PID, storageLocation);
                    
                    // Update the Accumulator in CPU and PCB
                    this.updateAcc(constantInMemory)

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
                    var storageLocation = parseInt(TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1), 16);
                    
                    // Write the accumulator at the specified storage location
                    TSOS.MemoryAccessor.writeMemory(this.PID, storageLocation, hexAcc)

                    // Increase the PC in CPU and PCB
                    this.changePC(3);
                    break;

                // Add with carry...
                // Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator
                case ("6D"):
                    // Get the storage location one op code above current PC (i.e, do one op code lookahead)
                    var storageLocation = parseInt(TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1), 16) - 1;
                    
                    // Query constant from memory location
                    var constantInMemory = TSOS.MemoryAccessor.readMemory(this.PID, storageLocation);

                    // Update the Accumulator by accumulating the accumulator in CPU and PCB
                    this.updateAcc(constantInMemory, true);

                    this.changePC(3);
                    break;
                
                // Load the X-register with a constant
                case ("A2"):
                    // Get the constant one op code above current PC (i.e, do one op code lookahead)
                    var constant = TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1);
                    
                    this.updateX(constant);

                    // Increase the PC in CPU and PCB
                    this.changePC(2);
                    break;
                
                // Load the X-register from memory
                case ("AE"):
                    // Get the storage location one op code above current PC (i.e, do one op code lookahead)
                    var storageLocation = parseInt(TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1), 16);
                    
                    // Query constant from memory location
                    var constantInMemory = TSOS.MemoryAccessor.readMemory(this.PID, storageLocation);
                        
                    // Update the X-register in CPU and PCB
                    this.updateX(constantInMemory);

                    this.changePC(3);
                    break;
                
                // Load the Y-register with a constant
                case ("A0"):
                    // Get the constant one op code above current PC (i.e, do one op code lookahead)
                    var constant = TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1);
                    
                    this.updateY(constant);

                    // Increase the PC in CPU and PCB
                    this.changePC(2);
                    break;
                
                // Load the Y-register from memory
                case ("AC"):
                    // Get the storage location one op code above current PC (i.e, do one op code lookahead)
                    var storageLocation = parseInt(TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1), 16);
                    
                    // Query constant from memory location
                    var constantInMemory = TSOS.MemoryAccessor.readMemory(this.PID, storageLocation);

                    // Update the Y-register in CPU and PCB
                    this.updateY(constantInMemory);

                    this.changePC(3);
                    break;
                
                // No operation
                case ("EA"):
                    this.changePC(1);
                    break;

                // Compare a byte in memory to the X-register;  Sets the Z (zero) flag if equal
                case ("EC"):
                    // Get the storage location one op code above current PC (i.e, do one op code lookahead)
                    var storageLocation = parseInt(TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1), 16);

                    // Query constant from memory location
                    var constantInMemory = TSOS.MemoryAccessor.readMemory(this.PID, storageLocation);

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
                    // Get the branch number
                    var branch = TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1);

                    if (this.Zflag === 0) {
                        // console.log(parseInt(branch, 16))
                        // console.log(this.PC)
                        // console.log(_Memory.limit)
                        // -1 since _Memory.limit = 256 not 255
                        if (parseInt(branch, 16) > _Memory.limit - this.PC) {
                            // console.log((parseInt(branch, 16) + this.PC) - _Memory.limit)
                            this.setPC((parseInt(branch, 16) + this.PC) - _Memory.limit + 2);
                        }
                        else {
                            this.setPC(parseInt(branch, 16) + this.PC)
                        }
                    }
                    else {
                        this.changePC(2);
                    }
                    break;

                // Increment the value of a byte
                case ("EE"):
                    // Get the storage location one op code above current PC (i.e, do one op code lookahead)
                    var storageLocation = parseInt(TSOS.MemoryAccessor.readMemory(this.PID, this.PC + 1), 16);

                    // Query constant from memory location
                    var constantInMemory = TSOS.MemoryAccessor.readMemory(this.PID, storageLocation);
                    
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
                        var constantInMemory = TSOS.MemoryAccessor.readMemory(this.PID, memoryIndex);
                        console.log(constantInMemory);
                        while (constantInMemory != "00") {
                            // convert the hex into ASCII
                            _StdOut.putText(TSOS.Utils.hex2a(constantInMemory));
                            memoryIndex += 1;
                            constantInMemory = TSOS.MemoryAccessor.readMemory(this.PID, memoryIndex);
                        }
                    }
                    
                    this.changePC(1);
                    break;
                
                // Check for the end of program marker 
                case ("00"):
                    // Clear the PCB
                    TSOS.Control.hostRemoveProcess(this.PID);

                    // Remove the PID from the hash table in the memory manager
                    _MemoryManager.PIDMap.delete(this.PID);

                    // Reset all CPU pointers for next executing program
                    // TODO: May need to work on this later if multiple processes exist
                    _CPU.init();
            }
            // Now update the displayed PCB

            pcb.programCounter = this.lastPC;

            TSOS.Control.hostProcesses(this.PID);
            TSOS.Control.hostMemory();
        }

        private changePC(change: number): void {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];

            // Keep track of this to display on PCB without delay
            this.lastPC = this.PC;
            
            this.PC += change;
            pcb.programCounter += change;

        }

        private setPC(absolute: number): void {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];

            // Keep track of this to display on PCB without delay
            this.lastPC = this.PC;
            
            this.PC = absolute;
            pcb.programCounter = absolute;

        }

        private updateAcc(newAccAsHex: string, accumulate = false): void {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];
            
            // If we are adding to the accumulator rather than replacing
            if (accumulate) {
                // parse string to an int to store in accumulator
                this.Acc = this.Acc + parseInt(newAccAsHex, 16);
                pcb.Acc = pcb.Acc + parseInt(newAccAsHex, 16);
            }
            else {
                this.Acc = parseInt(newAccAsHex, 16);
                pcb.Acc = parseInt(newAccAsHex, 16);
            }
        }

        private updateX(newXAsHex: string): void {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];

            // parse string to an int to store in accumulator
            this.Xreg = parseInt(newXAsHex, 16);
            pcb.Xreg = parseInt(newXAsHex, 16);
        }

        private updateY(newYAsHex: string): void {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];

            // parse string to an int to store in accumulator
            this.Yreg = parseInt(newYAsHex, 16);
            pcb.Yreg = parseInt(newYAsHex, 16);
        }

        private updateZ(newZ: number): void {
            const pcb = _MemoryManager.PIDMap.get(this.PID)[1];

            // parse string to an int to store in accumulator
            this.Zflag = newZ;
            pcb.Zflag = newZ;
        }
    }
}
