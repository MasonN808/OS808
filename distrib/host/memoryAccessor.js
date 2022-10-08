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
            return memory[pc];
        }
        static writeMemory(pid, pc, code) {
            // We assume here that the given pid is valid
            _MemoryManager.PIDMap.get(pid)[0][pc] = code;
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map