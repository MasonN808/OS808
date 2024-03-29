module TSOS {
    export class Scheduler {
        // The scheduler selects a process from a list of processes by applying some process scheduling algorithm.
        public max_quantum: number; 
        public schedulerType: string;

        constructor () {
            this.max_quantum = 6; // This is the default quantum
            this.schedulerType = "RR"; // Default is round robin
        }

        public changeMaxQuantum(newMaxQuantum: number): void {
            this.max_quantum = newMaxQuantum;
        }
        
        public validateQuantum(PID: number): void {
            // Issue an interrupt for the interrupt service routine to call a context switch from the dispatcher if process hits max quantum level
            if (_CPU.Quantum === this.max_quantum) {
                // Check that ready queue is not empty to prevent context switching with itself (ask Alan)
                // Reset the currentquantum to 0
                _CPU.resetQuantum();
                // "type-1" indicates that we store the current processes PCB
                this.issueContextSwitchInterrupt("type-1", PID);
            }
        }

        public issueContextSwitchInterrupt(type: string, PID: number): void {
            if (!_ReadyQueue.isEmpty()) {
                // Enqueue this interrupt on the kernel interrupt queue so that it gets to the Interrupt handler.
                _KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH, [type, PID]));
            }
        }
    }
}