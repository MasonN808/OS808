var TSOS;
(function (TSOS) {
    class Dispatcher {
        // The dispatcher transfers the process selected by the short-term scheduler from one state to another
        static contextSwitch(currentPID) {
            _ReadyQueue.enqueue(currentPID);
            console.log("enqueued " + currentPID);
            const dequeuedPID = _ReadyQueue.dequeue();
            console.log("dequeued " + currentPID);
            // Log the context switch
            _Kernel.krnTrace("Context Switch: process " + currentPID + " switched with process " + dequeuedPID);
            // Switch from running to ready state for respective pcbs
            const pcb1 = _MemoryManager.PIDMap.get(currentPID)[1];
            pcb1.processState = "Ready";
            // Update the displayed PCB
            TSOS.Control.hostProcesses(currentPID);
            const pcb2 = _MemoryManager.PIDMap.get(dequeuedPID)[1];
            pcb2.processState = "Running";
            // Update the displayed PCB
            TSOS.Control.hostProcesses(dequeuedPID);
            _CPU.PID = dequeuedPID;
            _CPU.calibratePCBtoCPU(_CPU.PID);
        }
    }
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=dispatcher.js.map