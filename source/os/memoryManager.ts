module TSOS {
    // TODO: Finish this
    export class MemoryManager {
        public PIDCounter: number;
        // Create a hash map for the PIDs and PCBs
        public PIDMap;
        // Where all the memory partitions are stored
        public mainMemory: Array<Memory>;
        public maxLoadedPrograms: number;
        public base: number;
        public limit: number;
        public test: number;
        
        constructor() {
            this.PIDCounter = 1;
            // this.memoryAndPCB = [];
            this.PIDMap = new Map();
            this.maxLoadedPrograms = 3;
            // Initialize an array of fixed length to simulate memory
            this.mainMemory = new Array<Memory>(this.maxLoadedPrograms);
            this.base = 0;
            this.limit = 255;
        }

        public init(): void {
            this.initializeMainMemory();
        }
        
        public assignPID(memory: Memory): void {
            // Create a new PCB for our loaded program that has not executed yet (i.e., a process)
            const pcb = new TSOS.Pcb(this.PIDCounter);
            // Create a list of the memory and PCB to be added to Hash table
            const memoryAndPCB = [memory, pcb]
            // Map the PID to the memory and PCB for the loaded process
            this.PIDMap.set(this.PIDCounter, memoryAndPCB);
            // Increase PID for next PID
            this.PIDCounter += 1;
        }

        public loadProgramInMemory(loadedProgram: Memory): void {
            var foundValidSlot = false;
            // Check if we can load the source into memory and load, if possible, greedily
            for (let index = 0; index < _MemoryManager.maxLoadedPrograms; index++) {
                if (this.mainMemory[index].empty) {
                    this.mainMemory[index] = loadedProgram;
                    this.mainMemory[index].empty = false;
                    foundValidSlot = true;
                    break;
                }
            }
            if (foundValidSlot) {
                // Apply the PID to memory
                loadedProgram.PID = this.PIDCounter;
                // and apply PID to PCB
                this.assignPID(loadedProgram);
            }
            else {
                _StdOut.putText("Memory exhausted: max loaded program reached")
            }
        }
        
        // Initialize the memory on startup
        public initializeMainMemory(): void {
            for (let memoryPartitionIndex = 0; memoryPartitionIndex < this.maxLoadedPrograms; memoryPartitionIndex++) {
                // Create a new memory instance at every partition of main memory
                this.mainMemory[memoryPartitionIndex] = new Memory();
            }
        }
        
        // Clears all memory partitions in main memory
        public clearMainMemory(): void {
            for (let memoryPartitionIndex = 0; memoryPartitionIndex < this.maxLoadedPrograms; memoryPartitionIndex++) {
                if (this.PIDMap.has(this.mainMemory[memoryPartitionIndex].PID)) {
                    // Remove the memory and PCB from hash table
                    this.PIDMap.delete(this.mainMemory[memoryPartitionIndex].PID)
                }
            }
            this.initializeMainMemory();
        }

        public removeProgramInMemory(targetProgram: Memory): void {
            for (let memoryPartitionIndex = 0; memoryPartitionIndex < _MemoryManager.maxLoadedPrograms; memoryPartitionIndex++) {
                // Check if the target Program is the same Memory object as any Memory partition in main memory
                if (Object.is(targetProgram, this.mainMemory[memoryPartitionIndex])) {
                    this.mainMemory[memoryPartitionIndex] = new Memory();
                    break;
                }
            }
        }
    }
}