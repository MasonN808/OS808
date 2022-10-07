var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() {
            this.base = 0;
            this.limit = 256;
        }
        static query_memory(pid, index) {
            // TODO: finish this
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map