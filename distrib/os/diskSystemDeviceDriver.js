/* ----------------------------------
   diskSystemDeviceDriver.ts

   The Kernel Hard Drive Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DiskSystemDeviceDriver extends TSOS.DeviceDriver {
        constructor() {
            super();
            this.filesInUse = new Array();
            this.TRACKMAX = 4;
            this.SECTORMAX = 8;
            this.BLOCKMAX = 8;
            this.BLOCKSIZEMAX = 64;
            this.driverEntry = this.krnDiskDriverEntry;
            this.diskMap = new Map();
        }
        krnDiskDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            this.krnDiskFormat();
        }
        krnDiskFormat() {
            // Reformat the diskMap by clearing it and resetting structure
            // Find any programs in the hard drive
            // Reset the filesInUse Array
            this.filesInUse = new Array();
            // Reset the Map
            this.diskMap = new Map();
            // https://stackoverflow.com/questions/43592760/typescript-javascript-using-tuple-as-key-of-map
            for (let trackIndex = 0; trackIndex < this.TRACKMAX; trackIndex++) {
                for (let sectorIndex = 0; sectorIndex < this.SECTORMAX; sectorIndex++) {
                    for (let blockIndex = 0; blockIndex < this.BLOCKMAX; blockIndex++) {
                        const key = [trackIndex, sectorIndex, blockIndex];
                        const keyStr = key.join(':');
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
        queryTSB(TSB) {
            const keyStr = [TSB[0], TSB[1], TSB[2]].join(':');
            var diskValue = this.diskMap.get(keyStr);
            return diskValue;
        }
        // Query the TSB of the closest available/unused DiskValue in either the Directory of Data partitions
        queryUnusedTSB(hardDrivePartition) {
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
            TSOS.Control.hostLog("Hard Drive Memory is Full");
            TSOS.Control.hostLog("Emergency halt", "host");
            TSOS.Control.hostLog("Attempting Kernel shutdown", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
        }
        // Query the TSB in the Directory partition to find a PID that matches the one found in the CPU
        queryPID_TSB() {
            for (let [key, diskValue] of this.diskMap) {
                const TSB = key.split(':');
                if (TSB[0] > 1) {
                    // Not in Directory
                    return null;
                }
                // At this point, the PID should be on the CPU
                var PIDStr = _CPU.PID.toString();
                PIDStr = '0'.repeat(3 - PIDStr.length) + PIDStr;
                // Also check that it isn't a file name in filesInUse
                if (TSOS.Utils.filePIDNametoString(diskValue.data) == PIDStr && !this.isFileNameInFiles(PIDStr)) {
                    // console.log("A: " + Utils.filePIDNametoString(diskValue.data));
                    // console.log("B: " + PIDStr);
                    return [TSB[0], TSB[1], TSB[2]];
                }
            }
            return null;
        }
        // Query a list of PIDs from the Directory partition
        queryPIDsInDirectory() {
            var aggregatedPIDs = [];
            for (let [key, diskValue] of this.diskMap) {
                const TSB = key.split(':');
                if (TSB[0] > 1) {
                    return aggregatedPIDs;
                }
                // Loop through all processes on the ready queue
                for (let PID of _ReadyQueue.q) {
                    var PIDStr = PID.toString();
                    PIDStr = '0'.repeat(3 - PIDStr.length) + PIDStr;
                    // Also check that it isn't a file name in filesInUse
                    if (TSOS.Utils.filePIDNametoString(diskValue.data) == PIDStr && !this.isFileNameInFiles(PIDStr)) {
                        aggregatedPIDs.push(PIDStr);
                    }
                }
                // Now check for in the CPU
                PIDStr = _CPU.PID.toString();
                PIDStr = '0'.repeat(3 - PIDStr.length) + PIDStr;
                // Also check that it isn't a file name in filesInUse
                if (TSOS.Utils.filePIDNametoString(diskValue.data) == PIDStr && !this.isFileNameInFiles(PIDStr)) {
                    aggregatedPIDs.push(PIDStr);
                }
            }
            return null; // This should never occurk but just in case
        }
        // Check if the queried file name is in the list of files in use
        isFileNameInFiles(queriedfileName) {
            for (const file of this.filesInUse) {
                if (file.name == queriedfileName) {
                    return true;
                }
            }
            return false;
        }
        // Return the file if the queried file name is in the list of files in use
        fileInFiles(queriedfileName) {
            for (const file of this.filesInUse) {
                if (file.name == queriedfileName) {
                    return file;
                }
            }
            return null;
        }
        TSBInFileInFiles(queriedfileName) {
            for (const file of this.filesInUse) {
                if (file.name == queriedfileName) {
                    return file.TSB;
                }
            }
            return null;
        }
        removeFileInFilesInUse(fileName) {
            for (let index = 0; index < this.filesInUse.length; index++) {
                if (this.filesInUse[index].name == fileName) {
                    // remove the File object from the array
                    this.filesInUse.splice(index, 1);
                }
            }
        }
        // Update the current data with the new data
        formatData(hexStr) {
            var data = new Array(_krnDiskDriver.BLOCKSIZEMAX).fill(new TSOS.OpCode("00"));
            for (let i = 0; i < hexStr.length; i += 2) {
                data[i / 2] = new TSOS.OpCode(hexStr[i] + hexStr[i + 1]);
            }
            return data;
        }
        // Fills the data in the hashmap no matter the length of the input hex string
        fillData(hexStr, startTSB) {
            var tempQueriedDiskValue = null;
            // Loop through how many times we need a new block
            // Multiply block size by 2 since op codes take up two chars
            for (let blockIndex = 0; blockIndex < Math.ceil(hexStr.length / (this.BLOCKSIZEMAX * 2)); blockIndex++) {
                // Get the queried disk value
                const truncatedHexStr = hexStr.substring(blockIndex * this.BLOCKSIZEMAX * 2, (blockIndex + 1) * this.BLOCKSIZEMAX * 2);
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
                tempQueriedDiskValue.next = [0, 0, 0];
            }
        }
        removeFileContents(fileTSB, shallowDelete) {
            var diskValue = this.queryTSB(fileTSB);
            // Traverse down the path graph until we hit the leaf and reset pointers while doing so
            var leafFound = false;
            while (!leafFound) {
                if (TSOS.Utils.arrayEquals(diskValue.next, [0, 0, 0])) {
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
                    diskValue.data = new Array(_krnDiskDriver.BLOCKSIZEMAX).fill(new TSOS.OpCode("00"));
                    diskValue.used = 0;
                    var tempDiskValue = diskValue;
                    // Go to the next disk value
                    diskValue = this.queryTSB(diskValue.next);
                    // Also change the next pointer
                    tempDiskValue.next = [0, 0, 0];
                }
            }
        }
        readFile(fileTSB) {
            var diskValue = this.queryTSB(fileTSB);
            // Traverse down the path graph until we hit the leaf and output the data while doing so
            var leafFound = false;
            var atFileTSB = true;
            while (!leafFound) {
                if (TSOS.Utils.arrayEquals(diskValue.next, [0, 0, 0])) {
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
                    for (let i = 0; i < diskValue.data.length; i++) {
                        data += diskValue.data[i].codeString;
                    }
                    // Turn the hex into ASCII and output
                    _StdOut.putText(TSOS.Utils.hex2a(data));
                    // Go to the next disk value
                    diskValue = this.queryTSB(diskValue.next);
                }
            }
        }
        getOpCodesFromFile(fileTSB) {
            var diskValue = this.queryTSB(fileTSB);
            // Traverse down the path graph until we hit the leaf and output the data while doing so
            var leafFound = false;
            var atFileTSB = true;
            var aggregatedData = '';
            while (!leafFound) {
                if (TSOS.Utils.arrayEquals(diskValue.next, [0, 0, 0])) {
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
                    for (let i = 0; i < diskValue.data.length; i++) {
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
        getDataFromFile(fileName) {
            const fileTSB = this.TSBInFileInFiles(fileName);
            var diskValue = this.queryTSB(fileTSB);
            // Traverse down the path graph until we hit the leaf and output the data while doing so
            var leafFound = false;
            var atFileTSB = true;
            var accumulatedData = '';
            while (!leafFound) {
                if (TSOS.Utils.arrayEquals(diskValue.next, [0, 0, 0])) {
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
                    for (let i = 0; i < diskValue.data.length; i++) {
                        // Check that we aren't copying over the parts with no data
                        if (diskValue.data[i].codeString != "00") {
                            data += diskValue.data[i].codeString;
                        }
                        else {
                            break;
                        }
                    }
                    // Add the block data to the accumulated data as ASCII
                    accumulatedData += TSOS.Utils.hex2a(data);
                    // Go to the next disk value
                    diskValue = this.queryTSB(diskValue.next);
                }
            }
            return accumulatedData;
        }
    }
    TSOS.DiskSystemDeviceDriver = DiskSystemDeviceDriver;
    class DiskValue {
        constructor() {
            this.used = 0;
            this.next = [0, 0, 0];
            // initialize byte list of specified size to be stored with specified key
            this.data = new Array(_krnDiskDriver.BLOCKSIZEMAX).fill(new TSOS.OpCode("00"));
        }
    }
    TSOS.DiskValue = DiskValue;
    // File Object for easily finding whether the file name is in use or not without hashmap search
    class File {
        constructor(name, TSB) {
            this.inUse = 1;
            this.name = name;
            this.TSB = TSB;
            this.creationDate = new Date().toLocaleString();
            this.size = 0;
        }
    }
    TSOS.File = File;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=diskSystemDeviceDriver.js.map