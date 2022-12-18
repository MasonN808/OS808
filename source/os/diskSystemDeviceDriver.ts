/* ----------------------------------
   diskSystemDeviceDriver.ts

   The Kernel Hard Drive Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DiskSystemDeviceDriver extends DeviceDriver {
        public diskMap;
        public filesInUse = new Array<File>();
        public TRACKMAX = 4;
        public SECTORMAX = 8;
        public BLOCKMAX = 8;
        public BLOCKSIZEMAX = 64;

        constructor() {
            super();
            this.driverEntry = this.krnDiskDriverEntry;
            this.diskMap =  new Map();
        }

        public krnDiskDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            this.krnDiskFormat();
        }

        public krnDiskFormat() {
            // Reformat the diskMap by clearing it and resetting structure
            // Find any programs in the hard drive
            
            // Reset the filesInUse Array
            this.filesInUse = new Array<File>();
            // Reset the Map
            this.diskMap =  new Map();
            // https://stackoverflow.com/questions/43592760/typescript-javascript-using-tuple-as-key-of-map
            for (let trackIndex = 0; trackIndex < this.TRACKMAX; trackIndex++) {
                for (let sectorIndex = 0; sectorIndex < this.SECTORMAX; sectorIndex++) {
                    for (let blockIndex = 0; blockIndex < this.BLOCKMAX; blockIndex++) {
                        const key: [ number, number, number ] = [trackIndex, sectorIndex, blockIndex];
                        const keyStr: string = key.join(':');
                        var diskValue = new DiskValue();
                        // Case for master boot record
                        if (trackIndex == 0 && sectorIndex == 0 && blockIndex == 0) {
                            diskValue.used = 1;
                        }
                        this.diskMap.set(keyStr, diskValue);
                    }
                }
            }
        }

        // Query the DiskValue object from the specified track, sector, and block
        public queryTSB(TSB: number[]): DiskValue {
            const keyStr = [TSB[0], TSB[1], TSB[2]].join(':');
            var diskValue = this.diskMap.get(keyStr);
            return diskValue;
        }

        // Query the TSB of the closest available/unused DiskValue in either the Directory of Data partitions
        public queryUnusedTSB(hardDrivePartition: string): number[] {
            for (let [key, diskValue] of this.diskMap) {
                const TSB = key.split(':');
                if (hardDrivePartition == "Directory" && TSB[0] > 1) {
                    // break out of the for loop and go to shutdown
                    break;
                }
                if (hardDrivePartition == "Data" && TSB[0] < 1) {
                    // Skip until we reach track 1
                    continue;
                }
                if (diskValue.used == 0) {
                    return [TSB[0], TSB[1], TSB[2]];
                }
            }
            // If we didn't return, then memory is full
            Control.hostLog("Hard Drive Memory is Full");
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
        }

        // Query the TSB in the Directory partition to find a PID that matches the one found in the CPU
        public queryPIDFromCPU(): number[] {
            for (let [key, diskValue] of this.diskMap) {
                const TSB = key.split(':');
                if (TSB[0] > 1) {
                    // Not in Directory
                    return null;
                }
                // At this point, the PID should be on the CPU
                var PIDStr = _CPU.PID.toString();
                PIDStr = '0'.repeat(3-PIDStr.length) + PIDStr;
                // Also check that it isn't a file name in filesInUse
                if (Utils.filePIDNametoString(diskValue.data) == PIDStr && !this.isFileNameInFiles(PIDStr)) {
                    return [TSB[0], TSB[1], TSB[2]];
                }
            }
            return null;
        }

        // Query the TSB in the Directory partition to find a PID that matches the one found in the CPU
        public queryPID(pid: number): number[] {
            for (let [key, diskValue] of this.diskMap) {
                const TSB = key.split(':');
                if (TSB[0] > 1) {
                    // Not in Directory
                    return null;
                }
                // At this point, the PID should be on the CPU
                var PIDStr = pid.toString();
                PIDStr = '0'.repeat(3-PIDStr.length) + PIDStr;
                // Also check that it isn't a file name in filesInUse
                if (Utils.filePIDNametoString(diskValue.data) == PIDStr && !this.isFileNameInFiles(PIDStr)) {
                    return [TSB[0], TSB[1], TSB[2]];
                }
            }
            return null;
        }

        // Query a list of PIDs from the Directory partition
        public queryPIDsInDirectory(): string[] {
            var aggregatedPIDs = [];
            for (let [key, diskValue] of this.diskMap) {
                const TSB = key.split(':');
                if (TSB[0] > 1) {
                    return aggregatedPIDs;
                }
                // Loop through all processes on the ready queue
                for (let PID of _ReadyQueue.q) {
                    var PIDStr = PID.toString();
                    PIDStr = '0'.repeat(3-PIDStr.length) + PIDStr;
                    // Also check that it isn't a file name in filesInUse
                    if (Utils.filePIDNametoString(diskValue.data) == PIDStr && !this.isFileNameInFiles(PIDStr)) {
                        aggregatedPIDs.push(PIDStr);
                    }
                }
                // Now check for in the CPU
                const PID = _CPU.PID;
                PIDStr = PID.toString();
                PIDStr = '0'.repeat(3-PIDStr.length) + PIDStr;
                // Also check that it isn't a file name in filesInUse
                if (Utils.filePIDNametoString(diskValue.data) == PIDStr && !this.isFileNameInFiles(PIDStr)) {
                    aggregatedPIDs.push(PID);
                }
            }
            return null; // This should never occurk but just in case
        }

        // Check if the queried file name is in the list of files in use
        public isFileNameInFiles(queriedfileName: string): boolean {
            for (const file of this.filesInUse) {
                if (file.name == queriedfileName) {
                    return true;
                }
            }
            return false;
        }

        // Return the file if the queried file name is in the list of files in use
        public fileInFiles(queriedfileName: string): File {
            for (const file of this.filesInUse) {
                if (file.name == queriedfileName) {
                    return file;
                }
            }
            return null;
        }
        
        public TSBInFileInFiles(queriedfileName: string): number[] {
            for (const file of this.filesInUse) {
                if (file.name == queriedfileName) {
                    return file.TSB;
                }
            }
            return null;
        }

        public removeFileInFilesInUse(fileName: string) {
            for (let index=0; index < this.filesInUse.length; index++) {
                if (this.filesInUse[index].name == fileName) {
                    // remove the File object from the array
                    this.filesInUse.splice(index, 1);
                }
            }
        }

        // Update the current data with the new data
        public formatData(hexStr: string): OpCode[] {
            var data = new Array<OpCode>(_krnDiskDriver.BLOCKSIZEMAX).fill(new OpCode("00"));
            for (let i=0; i < hexStr.length; i+=2) {
                data[i/2] = new OpCode(hexStr[i]+hexStr[i+1]);
            }
            return data;
        }

        // Fills the data in the hashmap no matter the length of the input hex string
        public fillData(hexStr: string, startTSB: number[]) {
            var tempQueriedDiskValue = null;
            // Loop through how many times we need a new block
            // Multiply block size by 2 since op codes take up two chars
            for (let blockIndex = 0; blockIndex < Math.ceil(hexStr.length/(this.BLOCKSIZEMAX*2)); blockIndex++) {
                // Get the queried disk value
                const truncatedHexStr = hexStr.substring(blockIndex*this.BLOCKSIZEMAX*2, (blockIndex+1)*this.BLOCKSIZEMAX*2);
                var queriedDiskValue = this.queryTSB(startTSB);
                queriedDiskValue.data = this.formatData(truncatedHexStr);
                queriedDiskValue.used = 1;
                const unusedTSB = this.queryUnusedTSB("Data");
                queriedDiskValue.next = unusedTSB;
                tempQueriedDiskValue = queriedDiskValue;
                // Reassign the startTSB pointer
                startTSB = unusedTSB;
            }
            if (tempQueriedDiskValue != null) {
                tempQueriedDiskValue.next = [0,0,0];
            }
        }

        public removeFileContents(fileTSB: number[], shallowDelete: boolean) {
            var diskValue = this.queryTSB(fileTSB);
            // Traverse down the path graph until we hit the leaf and reset pointers while doing so
            var leafFound = false;
            while (!leafFound) {
                if (Utils.arrayEquals(diskValue.next, [0,0,0])) {
                    leafFound = true;
                }
                // Shallow delete is to not reset the file name and pointers in directory parition when rewriting file
                if (shallowDelete) {
                    // Go to the next disk value
                    diskValue = this.queryTSB(diskValue.next);
                    shallowDelete = false;
                }
                else {
                    // Reset the pointers
                    diskValue.data = new Array<OpCode>(_krnDiskDriver.BLOCKSIZEMAX).fill(new OpCode("00"));
                    diskValue.used = 0;
                    var tempDiskValue = diskValue;
                    // Go to the next disk value
                    diskValue = this.queryTSB(diskValue.next);
                    // Also change the next pointer
                    tempDiskValue.next = [0,0,0];
                }
            }
        }

        public readFile(fileTSB: number[]) {
            var diskValue = this.queryTSB(fileTSB);
            // Traverse down the path graph until we hit the leaf and output the data while doing so
            var leafFound = false;
            var atFileTSB = true;
            while (!leafFound) {
                if (Utils.arrayEquals(diskValue.next, [0,0,0])) {
                    leafFound = true;
                }
                // Don't read the data from the file head in directory partition
                if (atFileTSB) {
                    // Go to the next disk value
                    diskValue = this.queryTSB(diskValue.next);
                    atFileTSB = false;
                }
                else {
                    // Convert the data/hex into a string from OpCode objects
                    var data = '';
                    for (let i=0; i < diskValue.data.length; i++) {
                        data += diskValue.data[i].codeString;
                    }
                    // Turn the hex into ASCII and output
                    _StdOut.putText(Utils.hex2a(data));
                    // Go to the next disk value
                    diskValue = this.queryTSB(diskValue.next);
                }
            }
        }

        public getOpCodesFromFile(fileTSB: number[]): string {
            var diskValue = this.queryTSB(fileTSB);
            // Traverse down the path graph until we hit the leaf and output the data while doing so
            var leafFound = false;
            var atFileTSB = true;
            var aggregatedData = '';
            while (!leafFound) {
                if (Utils.arrayEquals(diskValue.next, [0,0,0])) {
                    leafFound = true;
                }
                // Don't read the data from the file head in directory partition
                if (atFileTSB) {
                    // Go to the next disk value
                    diskValue = this.queryTSB(diskValue.next);
                    atFileTSB = false;
                }
                else {
                    // Convert the data/hex into a string from OpCode objects
                    var data = '';
                    for (let i=0; i < diskValue.data.length; i++) {
                        data += diskValue.data[i].codeString;
                    }
                    // Turn the hex into ASCII and output
                    aggregatedData += data;
                    // Go to the next disk value
                    diskValue = this.queryTSB(diskValue.next);
                }
            }
            return aggregatedData;
        }

        public getDataFromFile(fileName: string): string {
            const fileTSB = this.TSBInFileInFiles(fileName);
            var diskValue = this.queryTSB(fileTSB);
            // Traverse down the path graph until we hit the leaf and output the data while doing so
            var leafFound = false;
            var atFileTSB = true;
            var accumulatedData = '';
            while (!leafFound) {
                if (Utils.arrayEquals(diskValue.next, [0,0,0])) {
                    leafFound = true;
                }
                // Don't read the data from the file head in directory partition
                if (atFileTSB) {
                    // Go to the next disk value
                    diskValue = this.queryTSB(diskValue.next);
                    atFileTSB = false;
                }
                else {
                    // Convert the data/hex into a string from OpCode objects
                    var data = '';
                    for (let i=0; i < diskValue.data.length; i++) {
                        // Check that we aren't copying over the parts with no data
                        if (diskValue.data[i].codeString != "00") {
                            data += diskValue.data[i].codeString;
                        }
                        else {
                            break;
                        }
                    }
                    // Add the block data to the accumulated data as ASCII
                    accumulatedData += Utils.hex2a(data);
                    // Go to the next disk value
                    diskValue = this.queryTSB(diskValue.next);
                }
            }
            return accumulatedData;
        }
    }
    
    export class DiskValue {
        public used: number;
        public next: Array<number>;
        public data: Array<OpCode>;
        
        constructor (){
            this.used = 0;
            this.next = [0,0,0];
            // initialize byte list of specified size to be stored with specified key
            this.data = new Array<OpCode>(_krnDiskDriver.BLOCKSIZEMAX).fill(new OpCode("00"));
        }
    }

    // File Object for easily finding whether the file name is in use or not without hashmap search
    export class File {
        // May use this for deletion recovery
        public inUse: number;
        public name: string;
        public TSB: Array<number>;
        public creationDate: string;
        public size: number; // in Bytes
        
        constructor (name: string, TSB: number[]){
            this.inUse = 1;
            this.name = name;
            this.TSB = TSB;
            this.creationDate = new Date().toLocaleString();
            this.size = 0;
        }
    }
}
