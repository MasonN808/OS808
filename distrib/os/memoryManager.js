var TSOS;
(function (TSOS) {
    // TODO: Finish this
    class MemoryManager {
        constructor() {
            this.PIDCounter = 0;
            // this.memoryAndPCB = [];
            this.PIDMap = new Map();
            this.maxLoadedPrograms = 3;
            // Initialize an array of fixed length to simulate memory
            this.mainMemory = new Array(this.maxLoadedPrograms);
            this.base = 0;
            this.limit = 256;
            this.test = 9;
        }
        init() {
            this.initializeMainMemory();
            this.test = 20;
        }
        assignPID(source) {
            // Create a new PCB for our loaded program that has not executed yet (i.e., a process)
            const pcb = new TSOS.Pcb(this.PIDCounter);
            // Create a list of the memory and PCB to be added to Hash table
            // TODO: may need to make a deep copy of _Memory.source; not sure yet
            const memoryAndPCB = [source, pcb];
            // Map the PID to the memory and PCB for the loaded process
            this.PIDMap.set(this.PIDCounter, memoryAndPCB);
            // Increase PID for next PID
            this.PIDCounter += 1;
        }
        loadProgramInMemory(loadedProgram) {
            var foundValidSlot = false;
            // Check if we can load the source into memory and load if possible greedily
            for (let index = 0; index < _MemoryManager.maxLoadedPrograms; index++) {
                // if (this.mainMemory[index] == null || typeof this.mainMemory[index] === 'undefined' || this.mainMemory[index].empty) {
                if (this.mainMemory[index].empty) {
                    this.mainMemory[index] = loadedProgram;
                    foundValidSlot = true;
                }
            }
            if (!foundValidSlot) {
                _StdOut.putText("Memory exhausted: max loaded program reached");
            }
        }
        // Initialize the memory on startup
        initializeMainMemory() {
            for (let memoryPartitionIndex = 0; memoryPartitionIndex < this.maxLoadedPrograms; memoryPartitionIndex++) {
                // Create a new memory instance at every partition of main memory
                this.mainMemory[memoryPartitionIndex] = new TSOS.Memory();
            }
            console.log(this.mainMemory + " test 1 " + this.test);
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map