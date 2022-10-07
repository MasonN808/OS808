module TSOS {
    // TODO: Finish this
    export class MemoryManager {
        public maxPID: number;
        // Create a hash map for the PIDs and PCBs
        public PIDMap;
        
        constructor() {
            this.maxPID = 0;
            this.PIDMap = new Map();
        }

        public assignPID(): void {
            // Map the PID to the Memory
            this.PIDMap.set(this.maxPID, _Memory.source);
            // Increase PID for next PID
            this.maxPID += 1;
        }
    }
}