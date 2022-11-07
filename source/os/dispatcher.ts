module TSOS {
    export class Dispatcher {

        // The dispatcher transfers the process selected by the short-term scheduler from one state to another
        public static contextSwitch(params: any[]): void {
            const type = params[0];
            const currentPID = params[1];
            if (type === "type-1") {
                _ReadyQueue.enqueue(currentPID);
                // Switch from running to ready state
                console.log(currentPID + "  --> type " +  type)
                const pcb1 = _MemoryManager.PIDMap.get(currentPID)[1];
                pcb1.processState = "Ready";
                
                // Update the displayed PCB
                TSOS.Control.hostProcesses(currentPID);
            }
            console.log(_MemoryManager.PIDMap)
            
            const dequeuedPID = _ReadyQueue.dequeue();
            // Log the context switch
            _Kernel.krnTrace("Context Switch: process " + currentPID + " switched with process " + dequeuedPID);

            const pcb2 = _MemoryManager.PIDMap.get(dequeuedPID)[1];
            pcb2.processState = "Running";
            
            _CPU.PID = dequeuedPID;
            _CPU.calibratePCBtoCPU(_CPU.PID);

            // Update the displayed PCB
            TSOS.Control.hostProcesses(dequeuedPID);
        }
    }
}