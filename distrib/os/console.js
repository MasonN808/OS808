/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    class Console {
        constructor(currentFont = _DefaultFontFamily, currentFontSize = _DefaultFontSize, currentXPosition = 0, currentYPosition = _DefaultFontSize, buffer = "", previous_character = "", previous_light_text = "", command_hist_index = null, command_hist_length = 0, line_wrap_x_difference = 0, chopped_context_data = null) {
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.previous_character = previous_character;
            this.previous_light_text = previous_light_text;
            this.command_hist_index = command_hist_index;
            this.command_hist_length = command_hist_length;
            this.line_wrap_x_difference = line_wrap_x_difference;
            this.chopped_context_data = chopped_context_data;
            // For command completion
            this.possible_commands = ["ver", "help", "shutdown", "cls", "man",
                "trace", "rot13", "prompt", "date", "whereami",
                "howareu", "whoismason", "status", "bsod", "load", "run",
                "clearmem", "runall", "kill", "killall", "quantum"];
        }
        init() {
            this.clearScreen();
            this.resetXY();
        }
        clearScreen() {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }
        resetXY() {
            this.currentXPosition = 0;
            // this.currentYPosition = this.currentFontSize +
            //                         _DrawingContext.fontDescent(_DefaultFontFamily, _DefaultFontSize) +
            //                         _FontHeightMargin;
            this.currentYPosition = this.currentFontSize;
        }
        handleInput() {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                if (this.previous_light_text !== "") {
                    this.removeLightText();
                }
                if (_CmdHist.length != this.command_hist_length) {
                    this.command_hist_length = _CmdHist.length;
                    this.command_hist_index = this.command_hist_length;
                }
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                }
                else if (chr === String.fromCharCode(8)) { // the backspace key
                    // (Handles chr deletion)
                    var removed_chr = this.buffer.substring(this.buffer.length - 1, this.buffer.length);
                    this.previous_character = removed_chr;
                    // Remove one char from screen
                    this.removeText();
                    // Also remove it from the buffer
                    this.buffer = this.buffer.slice(0, -1);
                }
                else if (chr === String.fromCharCode(9)) { // the tab key
                    // (Handles autocompletion)
                    const text = this.previous_light_text;
                    for (let index = 0; index < text.length; index++) {
                        const chr = text.charAt(index);
                        // Put the suggested text into the queue
                        _KernelInputQueue.enqueue(chr);
                    }
                }
                else if (chr === String.fromCharCode(38)) { // the up-arrow key 
                    // (Handles command history)
                    if (this.command_hist_index > this.command_hist_length) {
                        this.command_hist_index = this.command_hist_length;
                    }
                    else if (this.command_hist_index <= 0) {
                        this.command_hist_index = 1;
                    }
                    if (this.command_hist_index !== null && (this.command_hist_index <= this.command_hist_length) && (this.command_hist_index > 0)) {
                        this.removeLine();
                        this.buffer = "";
                        const text = _CmdHist[this.command_hist_index - 1];
                        for (let index = 0; index < text.length; index++) {
                            const chr = text.charAt(index);
                            // Put the suggested text into the queue
                            _KernelInputQueue.enqueue(chr);
                        }
                        this.command_hist_index -= 1;
                    }
                }
                else if (chr === String.fromCharCode(40)) { // the down-arrow key
                    // (Handles command history)
                    if (this.command_hist_index > this.command_hist_length) {
                        this.command_hist_index = this.command_hist_length;
                    }
                    else if (this.command_hist_index <= 0) {
                        this.command_hist_index = 1;
                    }
                    if (this.command_hist_index !== null && (this.command_hist_index <= this.command_hist_length) && (this.command_hist_index > 0)) {
                        this.removeLine();
                        this.buffer = "";
                        const text = _CmdHist[this.command_hist_index - 1];
                        for (let index = 0; index < text.length; index++) {
                            const chr = text.charAt(index);
                            // Put the suggested text into the queue
                            _KernelInputQueue.enqueue(chr);
                        }
                        this.command_hist_index += 1;
                    }
                }
                else {
                    this.previous_character = chr;
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                    // command completion here....
                    // Check for empty string
                    if (this.buffer != "") {
                        for (let index = 0; index < this.possible_commands.length; index++) {
                            if (this.buffer === this.possible_commands[index].substring(0, this.buffer.length)) {
                                // Get the suggested text
                                var light_text = this.possible_commands[index].substring(this.buffer.length, this.possible_commands[index].length);
                                // Show the suggested light gray text on console
                                this.lightPutText(light_text);
                                this.previous_light_text = light_text;
                                break;
                            }
                        }
                    }
                }
                // TODO: Add a case for Ctrl-C that would allow the user to break the current program.
            }
        }
        putText(text) {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            if (text !== "") {
                const horizontal_offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                // Line-wrap
                if (this.currentXPosition >= _Canvas.width - horizontal_offset) {
                    this.line_wrap_x_difference = this.currentXPosition;
                    const vertical_offset = _DefaultFontSize +
                        _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                        _FontHeightMargin;
                    if (this.currentYPosition + (vertical_offset) >= _Canvas.height) {
                        // Shift the CLI up
                        var context_data = _DrawingContext.getImageData(0, vertical_offset, _Canvas.width, _Canvas.height - vertical_offset + _DefaultFontSize);
                        // Get the chopped data for scrolling back up
                        this.chopped_context_data = _DrawingContext.getImageData(0, 0, _Canvas.width, vertical_offset + _DefaultFontSize);
                        this.clearScreen();
                        _DrawingContext.putImageData(context_data, 0, 0);
                        // Keep the Y position at the bottom
                        this.currentYPosition = _Canvas.height - _DefaultFontSize - vertical_offset;
                    }
                    // Draw the text at the current X and Y coordinates.
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, 0, this.currentYPosition + vertical_offset, text);
                    this.currentXPosition = horizontal_offset;
                    this.currentYPosition += vertical_offset;
                }
                else {
                    var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                    // Draw the text at the current X and Y coordinates.
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                    // Move the current X position.
                    this.currentXPosition += offset;
                }
            }
        }
        putTextCenter(text) {
            if (text !== "") {
                // clear the scrren for BSOD
                this.clearScreen();
                // make the screen blue
                _DrawingContext.beginPath();
                _DrawingContext.rect(0, 0, _Canvas.width, _Canvas.height);
                _DrawingContext.fillStyle = "#1c74a6";
                _DrawingContext.fill();
                var vertical_offset = _DefaultFontSize +
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);
                var horizontal_offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                // Draw the sadf face above the current X and Y coordinates.
                _DrawingContext.drawText(50, 50, (_Canvas.width - horizontal_offset) / 2 - 7, (_Canvas.height - vertical_offset) / 2 - 20, ":(");
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, (_Canvas.width - horizontal_offset) / 2, (_Canvas.height - vertical_offset) / 2 + 30, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
        }
        lightPutText(text) {
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.font = '${this.currentFontSize} , ${this.currentFont}';
                _DrawingContext.fillStyle = "#808080";
                _DrawingContext.fillText(text, this.currentXPosition, this.currentYPosition);
            }
        }
        removeText() {
            const horizontal_offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.previous_character);
            // Line-wrap
            if (this.currentXPosition <= horizontal_offset) {
                const vertical_offset = _DefaultFontSize +
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                    _FontHeightMargin;
                // Remove the text at the current X and Y coordinates.
                // Use this.line_wrap_x_distance to go back to the x position on the previous line
                _DrawingContext.clearRect(this.line_wrap_x_difference - horizontal_offset, this.currentYPosition - (2 * vertical_offset), _Canvas.width, this.currentYPosition - vertical_offset);
                // Move current X and Y positions
                this.currentXPosition = this.line_wrap_x_difference - horizontal_offset;
                this.currentYPosition -= vertical_offset;
                // Scroll back down if Y position was already beyond canvas
                // Check if the y position was beyond the canvas, then scroll
                if (this.currentYPosition + (2 * vertical_offset) >= _Canvas.height) {
                    // Shift the CLI down
                    var context_data = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height + vertical_offset - _DefaultFontSize);
                    this.clearScreen();
                    _DrawingContext.putImageData(context_data, 0, vertical_offset);
                    // Add the previous chopped off data
                    _DrawingContext.putImageData(this.chopped_context_data, 0, 0);
                    // Keep the Y position at the bottom
                    this.currentYPosition = _Canvas.height - _DefaultFontSize;
                }
            }
            else {
                const vertical_offset = _DefaultFontSize +
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);
                // Remove the text at the current X and Y coordinates.
                // Doing "this.currentYPosition + vertical_offset" because im lazy and to be safe
                _DrawingContext.clearRect(this.currentXPosition - horizontal_offset, this.currentYPosition - vertical_offset, this.currentXPosition, this.currentYPosition + vertical_offset);
                // Move the current X position.
                this.currentXPosition -= horizontal_offset;
            }
        }
        removeLightText() {
            var vertical_offset = _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);
            var horizontal_offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.previous_light_text);
            // Remove the text at the current X and Y coordinates.
            // Doing "this.currentYPosition + vertical_offset" because im lazy and to be safe
            _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - vertical_offset, this.currentXPosition + horizontal_offset, this.currentYPosition + vertical_offset);
        }
        removeLine() {
            var vertical_offset = _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);
            // Remove the text at the current X and Y coordinates.
            _DrawingContext.clearRect(0, this.currentYPosition - vertical_offset, this.currentXPosition, this.currentYPosition);
            // Move the current X position.
            this.currentXPosition = 0;
            _OsShell.putPrompt();
        }
        advanceLine() {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            var offset = _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            // Check if the y position is beyond canvas, then scroll
            if (this.currentYPosition + offset >= _Canvas.height) {
                // Shift the CLI up
                var context_data = _DrawingContext.getImageData(0, offset, _Canvas.width, _Canvas.height - offset + _DefaultFontSize);
                this.clearScreen();
                _DrawingContext.putImageData(context_data, 0, 0);
                // Keep the Y position at the bottom
                this.currentYPosition = _Canvas.height - _DefaultFontSize;
            }
            else {
                this.currentYPosition += offset;
            }
        }
    }
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=console.js.map