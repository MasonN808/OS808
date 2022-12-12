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
        queryTSB(track, sector, block) {
            const keyStr = [track, sector, block].join(':');
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
        // Update the current data with the new data
        fillData(hexStr) {
            var data = new Array(_krnDiskDriver.BLOCKSIZEMAX).fill(new TSOS.OpCode("00"));
            for (let i = 0; i < hexStr.length; i += 2) {
                data[i / 2] = new TSOS.OpCode(hexStr[i] + hexStr[i + 1]);
            }
            console.log(data);
            return data;
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
        }
    }
    TSOS.File = File;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=diskSystemDeviceDriver.js.map