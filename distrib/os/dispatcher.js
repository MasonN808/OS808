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
            _CPU.PID = dequeuedPID;
            _CPU.calibratePCBtoCPU(_CPU.PID);
        }
    }
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=dispatcher.js.map