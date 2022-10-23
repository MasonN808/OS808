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
            this.PIDCounter = 0;
            // this.memoryAndPCB = [];
            this.PIDMap = new Map();
            this.maxLoadedPrograms = 3;
            // Initialize an array of fixed length to simulate memory
            this.mainMemory = new Array<Memory>(this.maxLoadedPrograms);
            this.base = 0;
            this.limit = 256;
            this.test = 9;
        }

        public init(): void {
            this.initializeMainMemory();
            this.test = 20;
        }
        
        public assignPID(source: OpCode[]): void {
            // Create a new PCB for our loaded program that has not executed yet (i.e., a process)
            const pcb = new TSOS.Pcb(this.PIDCounter);
            // Create a list of the memory and PCB to be added to Hash table
            const memoryAndPCB = [source, pcb]
            // Map the PID to the memory and PCB for the loaded process
            this.PIDMap.set(this.PIDCounter, memoryAndPCB);
            // Increase PID for next PID
            this.PIDCounter += 1;
        }

        public loadProgramInMemory(loadedProgram: Memory): void {
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
                _StdOut.putText("Memory exhausted: max loaded program reached")
            }
        }
        
        // Initialize the memory on startup
        public initializeMainMemory(): void {
            for (let memoryPartitionIndex = 0; memoryPartitionIndex < this.maxLoadedPrograms; memoryPartitionIndex++) {
                // Create a new memory instance at every partition of main memory
                this.mainMemory[memoryPartitionIndex] = new Memory();
            }
            console.log(this.mainMemory + " test 1 " + this.test)
        }
    }
}