module TSOS {

    export class Memory {
        public base: number = 0;
        public limit: number = 255;
        public empty: boolean;
        public source: Array<OpCode>;
        public PID: number = -1;

        constructor (public inputPID = -1) {
            // Properties for our memory storage
            this.base = 0;
            this.limit = 255;
            // State that the memory is empty
            this.empty = true;
            // Initialize an array of length limit; this will be the 
            // max size of the sum of the loaded programs
            this.source = new Array<OpCode>(this.limit).fill(new OpCode("00"));
            this.PID = inputPID;
        }
    }

    // Create a new class for elements in the source code to add more pointers for colored text
    export class OpCode {
        public codeString: string;
        // Use these to color the elements visually
        public currentOperator: boolean;
        public currentOperand: boolean;

        constructor (public opCodeString: string){
            this.codeString = opCodeString;
            this.currentOperator = false;
            this.currentOperand = false;
        }
    }
}