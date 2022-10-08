module TSOS {
    // TODO: Finish this
    export class MemoryManager {
        public maxPID: number;
        // public memoryAndPCB;
        // Create a hash map for the PIDs and PCBs
        public PIDMap;
        
        constructor() {
            this.maxPID = 0;
            // this.memoryAndPCB = [];
            this.PIDMap = new Map();
        }
        
        public assignPID(): void {
            // Create a new PCB for our loaded program that has not executed yet (i.e., a process)
            const pcb = new TSOS.Pcb();
            // Create a list of the memory and PCB to be added to Hash table
            // TODO: may need to make a deep copy of _Memory.source; not sure yet
            const memoryAndPCB = [_Memory.source, pcb]
            // Map the PID to the memory and PCB for the loaded process
            this.PIDMap.set(this.maxPID, memoryAndPCB);
            // Increase PID for next PID
            this.maxPID += 1;
        }
    }
}