module TSOS {

    export class MemoryAccessor {
        
        public static readMemory(pid: number, pc: number): OpCode{
            // We assume here that the given pid is valid
            const memory = _MemoryManager.PIDMap.get(pid)[0].source;

            // check pc is within memory bounds
            this.validateMemoryBounds(pc, pid);

            // Returns a OpCode object
            return memory[pc];
        }

        public static writeMemory(pid: number, pc: number, code: string): void {
            // Add any leading zeros and uppercase to input code
            if (code.length == 1) {
                code = "0" + code;
            }
            code = code.toUpperCase();

            // check pc is within memory bounds
            this.validateMemoryBounds(pc, pid);
            
            // We assume here that the given pid is valid
            _MemoryManager.PIDMap.get(pid)[0].source[pc] = new OpCode(code);
        }

        public static rewriteAllMemory(memory: Memory, source: string[]): any {
            for (let index = 0; index < memory.limit; index++) {
                memory.source[index] = new OpCode(source[index]);
            }
            return memory;
        }

        private static validateMemoryBounds(programCounter: number, PID: number): void {
            if ((programCounter < _MemoryManager.base) || (programCounter > _MemoryManager.limit)) {
                // Control.hostLog("Memory access violation occured in PID " + pid, "host");
                // Control.hostLog("Emergency halt", "host");
                // Control.hostLog("Attempting Kernel shutdown", "host");
                // // Call the OS shutdown routine.
                // _Kernel.krnShutdown();
                // // Stop the interval that's simulating our clock pulse.
                // clearInterval(_hardwareClockID);

                // Instead of shutting down the OS:
                _StdOut.putText("Memory access violation occured in PID " + PID);
                _StdOut.putText("....cpu restarted and memory removed");
                _MemoryManager.removePIDFromEverywhere(PID);
                // Restart the CPU
                _CPU.init();
                // Update displays
                TSOS.Control.hostMemory();
                TSOS.Control.hostCpu();
            }
        }
    }
}