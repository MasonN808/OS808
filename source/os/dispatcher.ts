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
            
            // If we have different scheduling schemes we act on that here
            // For Non-preempive priority scheduling
            if (_Scheduler.schedulerType == "NPP") {
                // We have to find the next prioritized process from the ready queue
                var prioritizedPID = -1;
                var priority = 1000000;
                for (let i=0; i < _ReadyQueue.q.length; i++) {
                    const tempPriority = parseInt(_MemoryManager.PIDMap.get(_ReadyQueue.q[i])[1].priority, 10);
                    // get the pcb from the PID map and compare the priority
                    if (tempPriority < priority) {
                        prioritizedPID = _ReadyQueue.q[i];
                        priority = tempPriority;
                    }
                }
                console.log(prioritizedPID)
                const poppedPID = _ReadyQueue.pop(prioritizedPID);
                // Log the context switch
                _Kernel.krnTrace("Context Switch: process " + currentPID + " switched with process " + poppedPID);
                const pcb2 = _MemoryManager.PIDMap.get(poppedPID)[1];
                pcb2.processState = "Running";
                
                _CPU.PID = poppedPID;
                _CPU.calibratePCBtoCPU(_CPU.PID);
    
                // Update the displayed PCB
                TSOS.Control.hostProcesses(poppedPID);
            }
            // For First Come First Serve
            else {
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
}