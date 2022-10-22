var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        static readMemory(pid, pc) {
            // We assume here that the given pid is valid
            const memory = _MemoryManager.PIDMap.get(pid)[0];
            // check number is valid
            if ((pc < _Memory.base) || (pc > _Memory.limit)) {
                // Do BSOD
                _StdOut.putTextCenter("Shutting down OS...");
                // Call Kernel shutdown routine.
                _Kernel.krnShutdown();
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
            // We assume here that the given pid is valid
            _MemoryManager.PIDMap.get(pid)[0][pc] = new TSOS.OpCode(code);
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map