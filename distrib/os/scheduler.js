var TSOS;
(function (TSOS) {
    class Scheduler {
        constructor() {
            this.quantum = 6; // This is the default quantum
        }
        changeQuantum(newQuantum) {
            this.quantum = newQuantum;
        }
        contextSwitch(currentPID) {
            _ReadyQueue.enqueue(currentPID);
            const dequeuedPID = _ReadyQueue.dequeue();
            // Log the context switch
            _Kernel.krnTrace("Context Switch: process " + currentPID + " switched with process " + dequeuedPID);
            return dequeuedPID;
        }
    }
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=scheduler.js.map