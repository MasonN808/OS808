
module TSOS {
    export class Pcb {
        public processState: string = "";
        public programCounter: number = 0;
        public intermediateRepresentation: string = "";
        public Xreg: number = 0;
        public Yreg: number = 0;
        public Zreg: number = 0;
        public location: string = "";
        public priority: string = "";

        constructor(){
            this.processState = "";
            this.programCounter = 0;
            this.intermediateRepresentation = "";
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zreg = 0;
            this.location = "";
            this.priority = "";
        }
    }
}
