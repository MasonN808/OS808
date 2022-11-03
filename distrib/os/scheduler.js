var TSOS;
(function (TSOS) {
    class Scheduler {
        constructor() {
            this.max_quantum = 6; // This is the default quantum
            this.quantum = 0;
        }
        resetQuantum() {
            this.quantum = 0;
        }
        incrementQuantum() {
            this.quantum += 1;
        }
        changeMaxQuantum(newMaxQuantum) {
            this.max_quantum = newMaxQuantum;
        }
        validateQuantum() {
            // Issue an interrupt for the interrupt service routine to call a context switch from the dispatcher if process hits max quantum level
            if (this.quantum === this.max_quantum) {
                // Check that ready queue is not empty to prevent context switching with itself (ask Alan)
                // Reset the currentquantum to 0
                this.resetQuantum();
                if (!_ReadyQueue.isEmpty()) {
                    // Enqueue this interrupt on the kernel interrupt queue so that it gets to the Interrupt handler.
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH, []));
                }
            }
        }
    }
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=scheduler.js.map