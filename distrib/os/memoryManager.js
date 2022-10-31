var TSOS;
(function (TSOS) {
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
            // Check if we can load the source into memory, if possible, greedily
            for (let index = 0; index < _MemoryManager.maxLoadedPrograms; index++) {
                if (this.mainMemory[index].empty) {
                    this.mainMemory[index] = loadedProgram;
                    this.mainMemory[index].empty = false;
                    foundValidSlot = true;
                    break;
                }
            }
            if (foundValidSlot) {
                // Apply the PID to memory object
                loadedProgram.PID = this.PIDCounter;
                // Add it to the end of resident list
                _ResidentList.push(loadedProgram.PID);
                // and apply PID to PCB
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
        // Clears all memory partitions in main memory
        clearMainMemory() {
            for (let memoryPartitionIndex = 0; memoryPartitionIndex < this.maxLoadedPrograms; memoryPartitionIndex++) {
                if (this.PIDMap.has(this.mainMemory[memoryPartitionIndex].PID)) {
                    // Remove the memory and PCB from hash table
                    this.PIDMap.delete(this.mainMemory[memoryPartitionIndex].PID);
                }
            }
            this.initializeMainMemory();
        }
        removeProgramInMemory(targetProgram) {
            for (let memoryPartitionIndex = 0; memoryPartitionIndex < _MemoryManager.maxLoadedPrograms; memoryPartitionIndex++) {
                // Check if the target Program is the same Memory object as any Memory partition in main memory
                if (Object.is(targetProgram, this.mainMemory[memoryPartitionIndex])) {
                    this.mainMemory[memoryPartitionIndex] = new TSOS.Memory();
                    break;
                }
            }
        }
        removePIDFromEverywhere(targetPID) {
            // Clear the PCB
            TSOS.Control.hostRemoveProcess(targetPID);
            // Remove the memory partition from main memory
            _MemoryManager.removeProgramInMemory(_MemoryManager.PIDMap.get(targetPID)[0]);
            // Remove the PID from the hash table in the memory manager to prevent from running again
            _MemoryManager.PIDMap.delete(targetPID);
            // Note: the CPU.init() will remove the process from ready queue
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map