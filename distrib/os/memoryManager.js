var TSOS;
(function (TSOS) {
    // TODO: Finish this
    class MemoryManager {
        constructor() {
            this.PIDCounter = 1;
            // this.memoryAndPCB = [];
            this.PIDMap = new Map();
            this.maxLoadedPrograms = 3;
            // Initialize an array of fixed length to simulate memory
            this.mainMemory = new Array(this.maxLoadedPrograms);
            this.base = 0;
            this.limit = 255;
        }
        init() {
            this.initializeMainMemory();
        }
        assignPID(memory) {
            // Create a new PCB for our loaded program that has not executed yet (i.e., a process)
            const pcb = new TSOS.Pcb(this.PIDCounter);
            // Create a list of the memory and PCB to be added to Hash table
            const memoryAndPCB = [memory, pcb];
            // Map the PID to the memory and PCB for the loaded process
            this.PIDMap.set(this.PIDCounter, memoryAndPCB);
            // Increase PID for next PID
            this.PIDCounter += 1;
        }
        loadProgramInMemory(loadedProgram) {
            var foundValidSlot = false;
            // Check if we can load the source into memory and load, if possible, greedily
            for (let index = 0; index < _MemoryManager.maxLoadedPrograms; index++) {
                // if (this.mainMemory[index] == null || typeof this.mainMemory[index] === 'undefined' || this.mainMemory[index].empty) {
                if (this.mainMemory[index].empty) {
                    this.mainMemory[index] = loadedProgram;
                    this.mainMemory[index].empty = false;
                    foundValidSlot = true;
                    break;
                }
            }
            if (foundValidSlot) {
                this.assignPID(loadedProgram);
            }
            else {
                _StdOut.putText("Memory exhausted: max loaded program reached");
            }
        }
        // Initialize the memory on startup
        initializeMainMemory() {
            for (let memoryPartitionIndex = 0; memoryPartitionIndex < this.maxLoadedPrograms; memoryPartitionIndex++) {
                // Create a new memory instance at every partition of main memory
                this.mainMemory[memoryPartitionIndex] = new TSOS.Memory();
            }
        }
        removeProgramInMemory(targetProgram) {
            for (let memoryPartitionIndex = 0; memoryPartitionIndex < _MemoryManager.maxLoadedPrograms; memoryPartitionIndex++) {
                console.log("LSKDJFLJ");
                // TODO: remove the memory and clear
                if (Object.is(targetProgram, this.mainMemory[memoryPartitionIndex])) {
                    console.log("IN");
                    this.mainMemory[memoryPartitionIndex] = new TSOS.Memory();
                    break;
                }
            }
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map