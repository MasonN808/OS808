var TSOS;
(function (TSOS) {
    class Pcb {
        // TODO: Finish this
        constructor(processState = "", programCounter = 0, intermediateRepresentation = "", Xreg = 0, Yreg = 0, Zreg = 0, location = "", priority = "") {
            this.processState = processState;
            this.programCounter = programCounter;
            this.intermediateRepresentation = intermediateRepresentation;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zreg = Zreg;
            this.location = location;
            this.priority = priority;
        }
    }
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map