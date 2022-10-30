var TSOS;
(function (TSOS) {
    class Memory {
        constructor(inputPID = -1) {
            this.inputPID = inputPID;
            this.base = 0;
            this.limit = 255;
            this.PID = -1;
            // Properties for our memory storage
            this.base = 0;
            this.limit = 255;
            // State that the memory is empty
            this.empty = true;
            // Initialize an array of length limit; this will be the 
            // max size of the sum of the loaded programs
            this.source = new Array(this.limit).fill(new OpCode("00"));
            this.PID = inputPID;
        }
    }
    TSOS.Memory = Memory;
    // Create a new class for elements in the source code to add more pointers for colored text
    class OpCode {
        constructor(opCodeString) {
            this.opCodeString = opCodeString;
            this.codeString = opCodeString;
            this.currentOperator = false;
            this.currentOperand = false;
        }
    }
    TSOS.OpCode = OpCode;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map