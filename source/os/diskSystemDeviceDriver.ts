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
        public queryTSB(track: number, sector: number, block: number): DiskValue {
            const keyStr = [track, sector, block].join(':');
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
                    return [TSB[0], TSB[1], TSB[2]]
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

        // Update the current data with the new data
        public fillData(hexStr: string): OpCode[] {
            var data = new Array<OpCode>(_krnDiskDriver.BLOCKSIZEMAX).fill(new OpCode("00"));
            for (let i=0; i < hexStr.length; i+=2) {
                data[i/2] = new OpCode(hexStr[i]+hexStr[i+1]);
            }
            console.log(data);
            return data;
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
        
        constructor (name: string, TSB: number[]){
            this.inUse = 1;
            this.name = name;
            this.TSB = TSB;
        }
    }
}
