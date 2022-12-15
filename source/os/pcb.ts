
module TSOS {
    export class Pcb {
        public processId: number;
        public programCounter: number = 0;
        public lastProgramCounter = 0;
        public intermediateRepresentation: string = "0";
        public Acc: number = 0;
        public Xreg: number = 0;
        public Yreg: number = 0;
        public Zflag: number = 0;
        public priority: string = "0";
        public processState: string = "Ready";
        public location: string = "Memory";
        public base: number;
        public limit: number;
        public segment: number;
        public rowIndex: number = 1;
        public currentQuantum: number;

        constructor(processId: number){
            this.processId = processId;
            this.programCounter = 0;
            this.lastProgramCounter = 0;
            this.intermediateRepresentation = "0";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.priority = "0";
            this.processState = "Ready";
            this.location = "Memory";
            this.base = -1;
            this.limit = 0;
            this.segment = 0;
            this.rowIndex = 1;
            this.currentQuantum = 1;
        }
    }
}
