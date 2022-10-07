var TSOS;
(function (TSOS) {
    // TODO: Finish this
    class MemoryManager {
        constructor() {
            this.maxPID = 0;
            this.PIDMap = new Map();
        }
        assignPID() {
            // Map the PID to the Memory
            this.PIDMap.set(this.maxPID, _Memory.source);
            // Increase PID for next PID
            this.maxPID += 1;
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map