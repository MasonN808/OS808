module TSOS {
    export class Scheduler {
        public quantum: number; 

        constructor () {
            this.quantum = 6; // This is the default quantum
        }

        public changeQuantum(newQuantum: number): void {
            this.quantum = newQuantum;
        }

        public contextSwitch(currentPID: number): any {
            _ReadyQueue.enqueue(currentPID);
            const dequeuedPID = _ReadyQueue.dequeue();
            // Log the context switch
            _Kernel.krnTrace("Context Switch: process " + currentPID + " switched with process " + dequeuedPID);
            return dequeuedPID;
        }
    }
}