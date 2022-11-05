var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        static readMemory(pid, pc) {
            // We assume here that the given pid is valid
            const memory = _MemoryManager.PIDMap.get(pid)[0].source;
            // check pc is within memory bounds
            if ((pc < _MemoryManager.base) || (pc > _MemoryManager.limit)) {
                // Do BSOD
                _StdOut.putTextCenter("Shutting down OS...");
                // Call Kernel shutdown routine.
                _Kernel.krnShutdown();
                // _StdOut("Out of bounds memory access occured");
            }
            // Returns a OpCode object
            return memory[pc];
        }
        static writeMemory(pid, pc, code) {
            // Add any leading zeros and uppercase to input code
            if (code.length == 1) {
                code = "0" + code;
            }
            code = code.toUpperCase();
            // check pc is within memory bounds
            if ((pc < _MemoryManager.base) || (pc > _MemoryManager.limit)) {
                // Do BSOD
                _StdOut.putTextCenter("Shutting down OS...");
                // Call Kernel shutdown routine.
                _Kernel.krnShutdown();
                // _StdOut("Out of bounds memory access occured");
            }
            // We assume here that the given pid is valid
            _MemoryManager.PIDMap.get(pid)[0].source[pc] = new TSOS.OpCode(code);
        }
        static rewriteAllMemory(memory, source) {
            for (let index = 0; index < memory.limit; index++) {
                memory.source[index] = new TSOS.OpCode(source[index]);
            }
            return memory;
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map