module TSOS {

    export class MemoryAccessor {
        public source: Array<string>;
        
        public static readMemory(pid: number, pc: number): string{
            // We assume here that the given pid is valid
            const memory = _MemoryManager.PIDMap.get(pid)[0];

            // check number is valid
            if ((pc < _Memory.base) || (pc > _Memory.limit)) {
                // Do BSOD
                _StdOut.putTextCenter("Shutting down OS...");
                // Call Kernel shutdown routine.
                _Kernel.krnShutdown();
            }
            return memory[pc]
        }

        public static writeMemory(pid: number, pc: number, code: string): void {
            // Add any leading zeros and uppercase to input code
            if (code.length == 1) {
                code = "0" + code;
            }
            code = code.toUpperCase();
            
            // We assume here that the given pid is valid
            _MemoryManager.PIDMap.get(pid)[0][pc] = code;
        }
    }
}