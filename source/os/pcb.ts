
module TSOS {
    export class Pcb {
        public processId;
        public programCounter: number = 0;
        public intermediateRepresentation: string = "0";
        public Acc: number = 0;
        public Xreg: number = 0;
        public Yreg: number = 0;
        public Zreg: number = 0;
        public priority: string = "0";
        public processState: string = "Ready";
        public location: string = "Memory";
        public rowIndex: number = 1;

        constructor(processId: number){
            this.processId = processId;
            this.programCounter = 0;
            this.intermediateRepresentation = "0";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zreg = 0;
            this.priority = "0";
            this.processState = "Ready";
            this.location = "Memory";
            this.rowIndex = 1;
        }
    }
}
