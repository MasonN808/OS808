/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverKeyboard extends TSOS.DeviceDriver {
        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }
        krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
        krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            var isCtrl = params[2];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted + " ctrl:" + isCtrl);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                if (isShifted === true) {
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                }
                else {
                    // Check for ctr-c to break out of executing program
                    if (isCtrl === true && keyCode === 67) {
                        // Check if there is an executing program first
                        if (_CPU.isExecuting === false) {
                            _Console.advanceLine();
                            _StdOut.putText("No active process to terminate");
                            _Console.advanceLine();
                            _OsShell.putPrompt();
                        }
                        else {
                            // Kill the current process using the shell command kill <pid>
                            _Console.advanceLine();
                            _OsShell.shellKill([_CPU.PID.toString()]);
                            _Console.advanceLine();
                            _OsShell.putPrompt();
                        }
                    }
                    else {
                        chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                    }
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 32) || // space ( )
                (keyCode == 13) || // enter
                (keyCode == 8) || // backspace
                (keyCode == 9) || // tab
                (keyCode == 38) || // up-arrow key
                (keyCode == 40) || // down-arrow key
                (keyCode == 189) || // minus (-)
                (keyCode == 187) || // equals (=)
                (keyCode == 219) || // left bracket ([)
                (keyCode == 221) || // right bracket (])
                (keyCode == 186) || // semi-colon (;)
                (keyCode == 222) || // apostrophe (')
                (keyCode == 188) || // comma (,)
                (keyCode == 190) || // period (.)
                (keyCode == 191) || // forward slash (/)
                (keyCode == 220) || // back slash (\)
                (keyCode == 192)) { // backtick (`)
                if (isShifted === true) {
                    // We are converting from keycodes to UTF-16 code units to be displayed
                    switch (keyCode) {
                        case 189: // - 
                            chr = String.fromCharCode(95); // _
                            break;
                        case 187: // =
                            chr = String.fromCharCode(43); // +
                            break;
                        case 219: // [
                            chr = String.fromCharCode(123); // {
                            break;
                        case 221: // ]
                            chr = String.fromCharCode(125); // }
                            break;
                        case 186: // ;
                            chr = String.fromCharCode(58); // :
                            break;
                        case 222: // '
                            chr = String.fromCharCode(34); // "
                            break;
                        case 188: // ,
                            chr = String.fromCharCode(60); // <
                            break;
                        case 190: // .
                            chr = String.fromCharCode(62); // >
                            break;
                        case 191: // /
                            chr = String.fromCharCode(63); // ?
                            break;
                        case 220: // \
                            chr = String.fromCharCode(124); // |
                            break;
                        case 192: // `
                            chr = String.fromCharCode(126); // ~
                            break;
                        default:
                            chr = String.fromCharCode(keyCode);
                    }
                }
                else {
                    // We are converting from keycodes to UTF-16 code units to be displayed
                    switch (keyCode) {
                        case 189: // - 
                            chr = String.fromCharCode(45);
                            break;
                        case 187: // =
                            chr = String.fromCharCode(61);
                            break;
                        case 219: // [
                            chr = String.fromCharCode(91);
                            break;
                        case 221: // ]
                            chr = String.fromCharCode(93);
                            break;
                        case 186: // ;
                            chr = String.fromCharCode(59);
                            break;
                        case 222: // '
                            chr = String.fromCharCode(39);
                            break;
                        case 188: // ,
                            chr = String.fromCharCode(44);
                            break;
                        case 190: // .
                            chr = String.fromCharCode(46);
                            break;
                        case 191: // /
                            chr = String.fromCharCode(47);
                            break;
                        case 220: // \
                            chr = String.fromCharCode(92);
                            break;
                        case 192: // `
                            chr = String.fromCharCode(96);
                            break;
                        default:
                            chr = String.fromCharCode(keyCode);
                    }
                }
                _KernelInputQueue.enqueue(chr);
            }
            else if (((keyCode >= 48) && (keyCode <= 57))) { // numbers
                if (isShifted === true) { // symbols
                    switch (keyCode) {
                        case 48:
                            chr = String.fromCharCode(41); // )
                            break;
                        case 49:
                            chr = String.fromCharCode(33); // !
                            break;
                        case 50:
                            chr = String.fromCharCode(64); // @
                            break;
                        case 51:
                            chr = String.fromCharCode(35); // #
                            break;
                        case 52:
                            chr = String.fromCharCode(36); // $
                            break;
                        case 53:
                            chr = String.fromCharCode(37); // %
                            break;
                        case 54:
                            chr = String.fromCharCode(94); // ^
                            break;
                        case 55:
                            chr = String.fromCharCode(38); // &
                            break;
                        case 56:
                            chr = String.fromCharCode(42); // *
                            break;
                        case 57:
                            chr = String.fromCharCode(40); // (
                            break;
                        default:
                            chr = String.fromCharCode(keyCode);
                    }
                }
                else {
                    chr = String.fromCharCode(keyCode);
                }
                _KernelInputQueue.enqueue(chr);
            }
        }
    }
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverKeyboard.js.map