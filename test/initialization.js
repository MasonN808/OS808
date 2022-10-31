function Glados() {
    this.afterStartup = function() {
 
      // Load 12DONE program.
      var code = "A9 03 8D 41 00 A9 01 8D 40 00 AC 40 00 A2 01 FF EE 40 00 AE 40 00 EC 41 00 D0 EF A9 44 8D 42 00 A9 4F 8D 43 00 A9 4E 8D 44 00 A9 45 8D 45 00 A9 00 8D 46 00 A2 02 A0 42 FF 00";
      document.getElementById("taProgramInput").value = code;

      _KernelInputQueue.enqueue('l');
      _KernelInputQueue.enqueue('o');
      _KernelInputQueue.enqueue('a');
      _KernelInputQueue.enqueue('d');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

      _KernelInputQueue.enqueue('l');
      _KernelInputQueue.enqueue('o');
      _KernelInputQueue.enqueue('a');
      _KernelInputQueue.enqueue('d');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

      _KernelInputQueue.enqueue('l');
      _KernelInputQueue.enqueue('o');
      _KernelInputQueue.enqueue('a');
      _KernelInputQueue.enqueue('d');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

      _KernelInputQueue.enqueue('r');
      _KernelInputQueue.enqueue('u');
      _KernelInputQueue.enqueue('n');
      _KernelInputQueue.enqueue(' ');
      _KernelInputQueue.enqueue('1');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

      _KernelInputQueue.enqueue('r');
      _KernelInputQueue.enqueue('u');
      _KernelInputQueue.enqueue('n');
      _KernelInputQueue.enqueue(' ');
      _KernelInputQueue.enqueue('2');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

      _KernelInputQueue.enqueue('r');
      _KernelInputQueue.enqueue('u');
      _KernelInputQueue.enqueue('n');
      _KernelInputQueue.enqueue(' ');
      _KernelInputQueue.enqueue('3');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
    };
}