var TSOS;
(function (TSOS) {
    class Memory {
        constructor() {
            this.base = 0;
            this.limit = 256;
        }
        init() {
            // Properties for our memory storage
            this.base = 0;
            this.limit = 256;
            // Initialize an array of length limit; this will be the 
            // max size of the sum of the loaded programs
            this.source = new Array(this.limit).fill("00");
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map