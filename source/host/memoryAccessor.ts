module TSOS {

    export class MemoryAccessor {
        public base: number = 0;
        public limit: number = 256;
        public source: Array<string>;
        
        public static query_memory(pid: number, index: number) {
            // TODO: finish this
        }
    }
}