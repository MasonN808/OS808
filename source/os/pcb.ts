
module TSOS {
    export class Pcb {

        constructor(
            public processState: string = "",
            public programCounter: number = 0,
            public intermediateRepresentation: string = "",
            public Xreg: number = 0,
            public Yreg: number = 0,
            public Zreg: number = 0,
            public location: string = "",
            public priority: string = "")  {
        }
    }
}
