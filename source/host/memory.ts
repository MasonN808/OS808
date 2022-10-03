module TSOS {

    export class Memory {
        public base: number = 0;
        public limit: number = 256;
        public source: Array<string>;

        public init(): void {
            // Properties for our memory storage
            this.base = 0;
            this.limit = 256;
            // Initialize an array of length limit; this will be the 
            // max size of the sum of the loaded programs
            this.source = new Array<string>(this.limit*3);
        }
    }
}