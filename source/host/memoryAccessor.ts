module TSOS {

    export class MemoryAccessor {
        // public source: Array<OpCode>;
        
        public static readMemory(pid: number, pc: number): OpCode{
            // We assume here that the given pid is valid
            const memory = _MemoryManager.PIDMap.get(pid)[0].source;

            // check number is valid
            if ((pc < _MemoryManager.base) || (pc > _MemoryManager.limit)) {
                // Do BSOD
                _StdOut.putTextCenter("Shutting down OS...");
                // Call Kernel shutdown routine.
                _Kernel.krnShutdown();
            }

            // Returns a OpCode object
            return memory[pc];
        }

        public static writeMemory(pid: number, pc: number, code: string): void {
            // Add any leading zeros and uppercase to input code
            if (code.length == 1) {
                code = "0" + code;
            }
            code = code.toUpperCase();
            
            // We assume here that the given pid is valid
            _MemoryManager.PIDMap.get(pid)[0].source[pc] = new OpCode(code);
        }

        public static rewriteAllMemory(memory: Memory, source: string[]): any {
            for (let index = 0; index < memory.limit; index++) {
                memory.source[index] = new OpCode(source[index]);
            }
            return memory;
        }
    }
}