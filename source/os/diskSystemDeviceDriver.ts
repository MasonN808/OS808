/* ----------------------------------
   diskSystemDeviceDriver.ts

   The Kernel Hard Drive Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DiskSystemDeviceDriver extends DeviceDriver {
        public diskMap;
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
            // More?
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
                        // Case for kernel bootstrap
                        if (trackIndex == 0 && sectorIndex == 0 && blockIndex == 0) {
                            diskValue.used = 1;
                        }
                        this.diskMap.set(keyStr, diskValue)
                    }
                }
            }
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
}
