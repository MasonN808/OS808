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
            // More?
        }
        krnDiskFormat() {
            // Reformat the diskMap by clearing it and resetting structure
            // https://stackoverflow.com/questions/43592760/typescript-javascript-using-tuple-as-key-of-map
            for (let trackIndex = 0; trackIndex < this.TRACKMAX; trackIndex++) {
                for (let sectorIndex = 0; sectorIndex < this.SECTORMAX; sectorIndex++) {
                    for (let blockIndex = 0; blockIndex < this.BLOCKMAX; blockIndex++) {
                        // TODO: Add case for kernel bootstrap
                        const key = [trackIndex, sectorIndex, blockIndex];
                        const keyStr = key.join(':');
                        var diskValue = new DiskValue();
                        this.diskMap.set(keyStr, diskValue);
                    }
                }
            }
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
})(TSOS || (TSOS = {}));
//# sourceMappingURL=diskSystemDeviceDriver.js.map