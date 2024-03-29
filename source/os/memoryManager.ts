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
        public swappedMemoryPartition: number;
        
        constructor() {
            this.PIDCounter = 1;
            this.PIDMap = new Map();
            this.maxLoadedPrograms = 3;
            // Initialize an array of fixed length to simulate memory
            this.mainMemory = new Array<Memory>(this.maxLoadedPrograms);
            this.base = 0;
            this.limit = 255;
            this.swappedMemoryPartition = 0
        }

        public init(): void {
            this.initializeMainMemory();
        }

        // This is for loading process from load shell command
        // Which creates a new PCB
        public assignPIDtoDriveInitial(memory: Memory) {
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
            // Change it to stored on Drive
            pcb.location = "Hard Drive";
            pcb.segment = -1;
            pcb.limit = -1;
            // Create a list of the memory and PCB to be added to Hash table
            const memoryAndPCB = [memory, pcb];
            // Map the PID to the memory and PCB for the loaded process
            this.PIDMap.set(this.PIDCounter, memoryAndPCB);

            const unassignedFileTSB = _krnDiskDriver.queryUnusedTSB("Directory");
            const unassignedFileDataValue = _krnDiskDriver.queryTSB(unassignedFileTSB);
            // Change the pointers
            unassignedFileDataValue.used = 1;
            // Assign the pid to the file name
            var PIDStr = this.PIDCounter.toString();
            PIDStr = '0'.repeat(3-PIDStr.length) + PIDStr;

            const PIDHex = Utils.toHex(PIDStr);
            unassignedFileDataValue.data = _krnDiskDriver.formatData(PIDHex);

            // Get the unassinged data ponter
            const unassignedDataTSB = _krnDiskDriver.queryUnusedTSB("Data");
            // Assign the next pointer in file
            unassignedFileDataValue.next = unassignedDataTSB;

            // Convert the list of OpCodes to a string
            const opCodeStr = Utils.opCodetoString(memory.source);
            console.log(opCodeStr.length)
            // Now fill the data blocks with the op codes
            _krnDiskDriver.fillData(opCodeStr, unassignedDataTSB);

            // Update the display
            Control.hostDisk();

            // Increase PID for next PID
            this.PIDCounter += 1;
        }

        // This is for roll-in and roll-out routines
        public assignPIDtoDrive(memory: Memory) {
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
            const pcb = this.PIDMap.get(memory.PID)[1];
            // Change it to stored on Drive
            pcb.location = "Hard Drive";
            pcb.base = -1;
            pcb.limit = -1;
            pcb.segment = -1;

            const unassignedFileTSB = _krnDiskDriver.queryUnusedTSB("Directory");
            const unassignedFileDataValue = _krnDiskDriver.queryTSB(unassignedFileTSB);
            // Change the pointers
            unassignedFileDataValue.used = 1;
            // Assign the pid to the file name
            var PIDStr = memory.PID.toString();
            PIDStr = '0'.repeat(3-PIDStr.length) + PIDStr;

            const PIDHex = Utils.toHex(PIDStr);
            unassignedFileDataValue.data = _krnDiskDriver.formatData(PIDHex);

            // Get the unassinged data ponter
            const unassignedDataTSB = _krnDiskDriver.queryUnusedTSB("Data");
            // Assign the next pointer in file
            unassignedFileDataValue.next = unassignedDataTSB;

            // Convert the list of OpCodes to a string
            const opCodeStr = Utils.opCodetoString(memory.source);
            console.log(opCodeStr.length)
            // Now fill the data blocks with the op codes
            _krnDiskDriver.fillData(opCodeStr, unassignedDataTSB);

            // Update the display
            Control.hostDisk();
        }
        

        // This is for loading process from load shell command
        // Which creates a new PCB
        public assignPIDtoMemoryInitial(memory: Memory, memorySegment: number): void {
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

        // This is for roll-in and roll-out routines
        public assignPIDtoMemory(memory: Memory, memorySegment: number): void {
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
            const pcb = this.PIDMap.get(memory.PID)[1];
            // Change it to stored on Drive
            pcb.location = "Memory";

            // Update the base, limit, and the segment pointers in the pcb
            var additionalIndex = 0;
            pcb.limit = (this.limit) * (memorySegment + 1);
            if (memorySegment > 0) {
                additionalIndex = 1;
            }
            pcb.base = (this.limit) * (memorySegment) + additionalIndex;
            pcb.segment = memorySegment;
        }

        // See if we can load a program into memory
        public canLoadProgramInMemory(): boolean {
            var foundValidSlot = false;
            for (let index = 0; index < _MemoryManager.maxLoadedPrograms; index++) {
                if (this.mainMemory[index].empty) {
                    return true;
                }
            }
            return false;
        }

        public loadProgramInMemory(loadedProgram: Memory, residentListPush=true): void {
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
            if (loadedProgram.PID == -1) {
                // Apply the PID to memory object
                loadedProgram.PID = this.PIDCounter;
            }
            if (residentListPush) {
                // Add it to the end of resident list
                _ResidentList.push(loadedProgram.PID)
            }
            if (foundValidSlot) {
                // and apply PID to PCB
                if (residentListPush) {
                    this.assignPIDtoMemoryInitial(loadedProgram, memorySegment);
                }
                else {
                    this.assignPIDtoMemory(loadedProgram, memorySegment);
                }
            }
            // Put it in the hard drive
            else {
                if (residentListPush) {
                    // and apply PID to PCB
                    this.assignPIDtoDriveInitial(loadedProgram);
                }
                else {
                    this.assignPIDtoDrive(loadedProgram);
                }
                // Update the base and limit pointers in memory object
                loadedProgram.limit = -1;
                loadedProgram.base = -1;
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

        public clearMainMemoryPartition(partitionIndex: number): void {
            // Make sure partition index is valid
            if (partitionIndex > this.maxLoadedPrograms-1 || partitionIndex < 0) {
                console.log("incorrect partition index");
            }
            this.mainMemory[partitionIndex] = new Memory();
        }

        public removeProgramInMemory(targetProgram: Memory): void {
            for (let memoryPartitionIndex = 0; memoryPartitionIndex < _MemoryManager.maxLoadedPrograms; memoryPartitionIndex++) {
                // Check if the target Program is the same Memory object as any Memory partition in main memory
                // if (Object.is(targetProgram, this.mainMemory[memoryPartitionIndex])) {
                //     this.mainMemory[memoryPartitionIndex] = new Memory();
                //     break;
                // }
                if (targetProgram.PID == this.mainMemory[memoryPartitionIndex].PID) {
                    this.mainMemory[memoryPartitionIndex] = new Memory();
                    break;
                }
            }
            // console.log("TEST:" + targetProgram.)
        }

        // Returns the memory object at the memory parition being cleared
        public popProgramInMemory(partitionIndex: number): Memory {
            // Make sure partition index is valid
            if (partitionIndex > this.maxLoadedPrograms-1 || partitionIndex < 0) {
                console.log("incorrect partition index");
            }
            // Save the memory at the specified index
            const savedMemory = this.mainMemory[partitionIndex];
            // Clear the segment
            this.clearMainMemoryPartition(partitionIndex);
            return savedMemory;
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