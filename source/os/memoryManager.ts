module TSOS {

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
        
        public assignPID(memory: Memory, memorySegment: number): void {
            // Check that the pid counter is never over FF (255)
            if (this.PIDCounter >= 255) {
                Control.hostLog("PID has reached 255", "host");
                Control.hostLog("Emergency halt", "host");
                Control.hostLog("Attempting Kernel shutdown", "host");
                // Call the OS shutdown routine.
                _Kernel.krnShutdown();
                // Stop the interval that's simulating our clock pulse.
                clearInterval(_hardwareClockID);
            }
            // Create a new PCB for our loaded program that has not executed yet (i.e., a process)
            const pcb = new TSOS.Pcb(this.PIDCounter);
            // Create a list of the memory and PCB to be added to Hash table
            const memoryAndPCB = [memory, pcb]
            // Map the PID to the memory and PCB for the loaded process
            this.PIDMap.set(this.PIDCounter, memoryAndPCB);

            // TODO: this will be changed in iP4
            // Update the base, limit, and the segment pointers in the pcb
            var additionalIndex = 0;
            pcb.limit = (this.limit) * (memorySegment + 1);
            if (memorySegment > 0) {
                additionalIndex = 1;
            }
            pcb.base = (this.limit) * (memorySegment) + additionalIndex;
            pcb.segment = memorySegment;
            // Increase PID for next PID
            this.PIDCounter += 1;
        }

        public loadProgramInMemory(loadedProgram: Memory): void {
            var foundValidSlot = false;
            var memorySegment = -1;
            // Check if we can load the source into memory, if possible, greedily
            for (let index = 0; index < _MemoryManager.maxLoadedPrograms; index++) {
                if (this.mainMemory[index].empty) {
                    this.mainMemory[index] = loadedProgram;
                    // Update the base and limit pointers in memory object
                    loadedProgram.limit = (this.limit) * (index + 1);
                    loadedProgram.base = (this.limit) * (index) + this.base;
                    this.mainMemory[index].empty = false;
                    foundValidSlot = true;
                    memorySegment = index;
                    break;
                }
            }
            if (foundValidSlot) {
                // Apply the PID to memory object
                loadedProgram.PID = this.PIDCounter;
                // Add it to the end of resident list
                _ResidentList.push(loadedProgram.PID)
                // and apply PID to PCB
                this.assignPID(loadedProgram, memorySegment);
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
                const targetPID = this.mainMemory[memoryPartitionIndex].PID;
                if (this.PIDMap.has(targetPID)) {
                    // Remove the memory and PCB from hash table
                    this.PIDMap.delete(targetPID);
                    // Remove it from both the ready queue and the resident list if they exist
                    TSOS.Utils.removeListElement(_ReadyQueue.q, targetPID);
                    TSOS.Utils.removeListElement(_ResidentList, targetPID);
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

        public removePIDFromEverywhere(targetPID: number): void {
            // Clear the PCB
            TSOS.Control.hostRemoveProcess(targetPID);
            // Remove the memory partition from main memory
            _MemoryManager.removeProgramInMemory(_MemoryManager.PIDMap.get(targetPID)[0]);
            // Remove the PID from the hash table in the memory manager to prevent from running again
            _MemoryManager.PIDMap.delete(targetPID);
        }
    }
}