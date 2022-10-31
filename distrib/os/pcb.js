var TSOS;
(function (TSOS) {
    class Pcb {
        constructor(processId) {
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
            this.rowIndex = 1;
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
            this.rowIndex = 1;
            this.currentQuantum = 1;
        }
    }
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map