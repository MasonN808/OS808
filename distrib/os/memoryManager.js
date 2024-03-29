var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor() {
            this.PIDCounter = 1;
            this.PIDMap = new Map();
            this.maxLoadedPrograms = 3;
            // Initialize an array of fixed length to simulate memory
            this.mainMemory = new Array(this.maxLoadedPrograms);
            this.base = 0;
            this.limit = 255;
            this.swappedMemoryPartition = 0;
        }
        init() {
            this.initializeMainMemory();
        }
        // This is for loading process from load shell command
        // Which creates a new PCB
        assignPIDtoDriveInitial(memory) {
            // Check that the pid counter is never over FF (255)
            if (this.PIDCounter >= 255) {
                TSOS.Control.hostLog("PID has reached 255", "host");
                TSOS.Control.hostLog("Emergency halt", "host");
                TSOS.Control.hostLog("Attempting Kernel shutdown", "host");
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
            PIDStr = '0'.repeat(3 - PIDStr.length) + PIDStr;
            const PIDHex = TSOS.Utils.toHex(PIDStr);
            unassignedFileDataValue.data = _krnDiskDriver.formatData(PIDHex);
            // Get the unassinged data ponter
            const unassignedDataTSB = _krnDiskDriver.queryUnusedTSB("Data");
            // Assign the next pointer in file
            unassignedFileDataValue.next = unassignedDataTSB;
            // Convert the list of OpCodes to a string
            const opCodeStr = TSOS.Utils.opCodetoString(memory.source);
            console.log(opCodeStr.length);
            // Now fill the data blocks with the op codes
            _krnDiskDriver.fillData(opCodeStr, unassignedDataTSB);
            // Update the display
            TSOS.Control.hostDisk();
            // Increase PID for next PID
            this.PIDCounter += 1;
        }
        // This is for roll-in and roll-out routines
        assignPIDtoDrive(memory) {
            // Check that the pid counter is never over FF (255)
            if (this.PIDCounter >= 255) {
                TSOS.Control.hostLog("PID has reached 255", "host");
                TSOS.Control.hostLog("Emergency halt", "host");
                TSOS.Control.hostLog("Attempting Kernel shutdown", "host");
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
            PIDStr = '0'.repeat(3 - PIDStr.length) + PIDStr;
            const PIDHex = TSOS.Utils.toHex(PIDStr);
            unassignedFileDataValue.data = _krnDiskDriver.formatData(PIDHex);
            // Get the unassinged data ponter
            const unassignedDataTSB = _krnDiskDriver.queryUnusedTSB("Data");
            // Assign the next pointer in file
            unassignedFileDataValue.next = unassignedDataTSB;
            // Convert the list of OpCodes to a string
            const opCodeStr = TSOS.Utils.opCodetoString(memory.source);
            console.log(opCodeStr.length);
            // Now fill the data blocks with the op codes
            _krnDiskDriver.fillData(opCodeStr, unassignedDataTSB);
            // Update the display
            TSOS.Control.hostDisk();
        }
        // This is for loading process from load shell command
        // Which creates a new PCB
        assignPIDtoMemoryInitial(memory, memorySegment) {
            // Check that the pid counter is never over FF (255)
            if (this.PIDCounter >= 255) {
                TSOS.Control.hostLog("PID has reached 255", "host");
                TSOS.Control.hostLog("Emergency halt", "host");
                TSOS.Control.hostLog("Attempting Kernel shutdown", "host");
                // Call the OS shutdown routine.
                _Kernel.krnShutdown();
                // Stop the interval that's simulating our clock pulse.
                clearInterval(_hardwareClockID);
            }
            // Create a new PCB for our loaded program that has not executed yet (i.e., a process)
            const pcb = new TSOS.Pcb(this.PIDCounter);
            // Create a list of the memory and PCB to be added to Hash table
            const memoryAndPCB = [memory, pcb];
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
        assignPIDtoMemory(memory, memorySegment) {
            // Check that the pid counter is never over FF (255)
            if (this.PIDCounter >= 255) {
                TSOS.Control.hostLog("PID has reached 255", "host");
                TSOS.Control.hostLog("Emergency halt", "host");
                TSOS.Control.hostLog("Attempting Kernel shutdown", "host");
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
        canLoadProgramInMemory() {
            var foundValidSlot = false;
            for (let index = 0; index < _MemoryManager.maxLoadedPrograms; index++) {
                if (this.mainMemory[index].empty) {
                    return true;
                }
            }
            return false;
        }
        loadProgramInMemory(loadedProgram, residentListPush = true) {
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
                _ResidentList.push(loadedProgram.PID);
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
        initializeMainMemory() {
            for (let memoryPartitionIndex = 0; memoryPartitionIndex < this.maxLoadedPrograms; memoryPartitionIndex++) {
                // Create a new memory instance at every partition of main memory
                this.mainMemory[memoryPartitionIndex] = new TSOS.Memory();
            }
        }
        // Clears all memory partitions in main memory
        clearMainMemory() {
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
        clearMainMemoryPartition(partitionIndex) {
            // Make sure partition index is valid
            if (partitionIndex > this.maxLoadedPrograms - 1 || partitionIndex < 0) {
                console.log("incorrect partition index");
            }
            this.mainMemory[partitionIndex] = new TSOS.Memory();
        }
        removeProgramInMemory(targetProgram) {
            for (let memoryPartitionIndex = 0; memoryPartitionIndex < _MemoryManager.maxLoadedPrograms; memoryPartitionIndex++) {
                // Check if the target Program is the same Memory object as any Memory partition in main memory
                // if (Object.is(targetProgram, this.mainMemory[memoryPartitionIndex])) {
                //     this.mainMemory[memoryPartitionIndex] = new Memory();
                //     break;
                // }
                if (targetProgram.PID == this.mainMemory[memoryPartitionIndex].PID) {
                    this.mainMemory[memoryPartitionIndex] = new TSOS.Memory();
                    break;
                }
            }
            // console.log("TEST:" + targetProgram.)
        }
        // Returns the memory object at the memory parition being cleared
        popProgramInMemory(partitionIndex) {
            // Make sure partition index is valid
            if (partitionIndex > this.maxLoadedPrograms - 1 || partitionIndex < 0) {
                console.log("incorrect partition index");
            }
            // Save the memory at the specified index
            const savedMemory = this.mainMemory[partitionIndex];
            // Clear the segment
            this.clearMainMemoryPartition(partitionIndex);
            return savedMemory;
        }
        removePIDFromEverywhere(targetPID) {
            // Clear the PCB
            TSOS.Control.hostRemoveProcess(targetPID);
            // Remove the memory partition from main memory
            _MemoryManager.removeProgramInMemory(_MemoryManager.PIDMap.get(targetPID)[0]);
            // Remove the PID from the hash table in the memory manager to prevent from running again
            _MemoryManager.PIDMap.delete(targetPID);
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map