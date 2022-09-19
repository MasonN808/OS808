/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        public MAX_Y_POSITION = 500;
        // For command completion
        public possible_commands = ["ver", "help", "shutdown", "cls", "man",
                                    "trace", "rot13", "prompt", "date", "whereami",
                                    "howareu", "whoismason", "status"];

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "",
                    public previous_character = "",
                    public previous_light_text = "",
                    public command_hist_index = null,
                    public command_hist_length = 0) {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        public clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        public resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {

            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();

                if (this.previous_light_text !== ""){
                    this.removeLightText();
                }

                if (_CmdHist.length != this.command_hist_length){
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

                } else if (chr === String.fromCharCode(8)) { // the backspace key
                    // (Handles chr deletion)
                    var removed_chr = this.buffer.substring(this.buffer.length - 1, this.buffer.length);

                    this.previous_character = removed_chr;

                    // Remove one char from screen
                    this.removeText();

                    // Also remove it from the buffer
                    this.buffer = this.buffer.slice(0, -1);

                } else if (chr === String.fromCharCode(9)) { // the tab key
                    // (Handles autocompletion)
                    const text = this.previous_light_text;
                    for (let index = 0; index < text.length; index++){
                        const chr = text.charAt(index);

                        // Put the suggested text into the queue
                        _KernelInputQueue.enqueue(chr);
                    }
                
                } else if (chr === String.fromCharCode(38)) { // the up-arrow key 
                    // (Handles command history)
                    if (this.command_hist_index > this.command_hist_length){
                        this.command_hist_index = this.command_hist_length
                    } else if (this.command_hist_index <= 0){
                        this.command_hist_index = 1;
                    }
                    if (this.command_hist_index !== null && (this.command_hist_index <= this.command_hist_length) && (this.command_hist_index > 0)){
                        this.removeLine();
                        this.buffer = "";
                        const text = _CmdHist[this.command_hist_index-1]
                        for (let index = 0; index < text.length; index++){
                            const chr = text.charAt(index);
    
                            // Put the suggested text into the queue
                            _KernelInputQueue.enqueue(chr);
                        }
                        this.command_hist_index -= 1;
                    }
                    
                } else if (chr === String.fromCharCode(40)) { // the down-arrow key
                    // (Handles command history)
                    if (this.command_hist_index > this.command_hist_length){
                        this.command_hist_index = this.command_hist_length
                    } else if (this.command_hist_index <= 0){
                        this.command_hist_index = 1;
                    }
                    if (this.command_hist_index !== null && (this.command_hist_index <= this.command_hist_length) && (this.command_hist_index > 0)){
                        this.removeLine();
                        this.buffer = "";
                        const text = _CmdHist[this.command_hist_index-1]
                        for (let index = 0; index < text.length; index++){
                            const chr = text.charAt(index);
    
                            // Put the suggested text into the queue
                            _KernelInputQueue.enqueue(chr);
                        }
                        this.command_hist_index += 1;
                    }

                } else {

                    this.previous_character = chr;

                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);

                    // ... and add it to our buffer.
                    this.buffer += chr;

                    //TODO: Do the command completion here....
                    for (let index = 0; index < this.possible_commands.length; index++){
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

                // TODO: Add a case for Ctrl-C that would allow the user to break the current program.
            }
        }

        public putText(text): void {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
         }

         public lightPutText(text): void {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.font = '${this.currentFontSize} , ${this.currentFont}';
                _DrawingContext.fillStyle = "#808080";
                _DrawingContext.fillText(text, this.currentXPosition, this.currentYPosition);

                // Move the current X position.
                // var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                // this.currentXPosition = this.currentXPosition + offset;
            }
         }

         public removeText(): void {

            var vertical_offset = _DefaultFontSize + 
                                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);

            var horizontal_offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.previous_character);

            // Remove the text at the current X and Y coordinates.
            _DrawingContext.clearRect(this.currentXPosition - horizontal_offset, this.currentYPosition - vertical_offset, this.currentXPosition, this.currentYPosition);

            // Move the current X position.
            this.currentXPosition = this.currentXPosition - horizontal_offset;

         }

         public removeLightText(): void {

            var vertical_offset = _DefaultFontSize + 
                                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);

            var horizontal_offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.previous_light_text);

            // Remove the text at the current X and Y coordinates.
            _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - vertical_offset, this.currentXPosition + horizontal_offset, this.currentYPosition);

            // // Move the current X position.
            // this.currentXPosition = this.currentXPosition - horizontal_offset;

         }

         public removeLine(): void {

            var vertical_offset = _DefaultFontSize + 
                                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);

            var horizontal_offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.previous_character);

            // Remove the text at the current X and Y coordinates.
            _DrawingContext.clearRect(0, this.currentYPosition - vertical_offset, this.currentXPosition, this.currentYPosition);

            // Move the current X position.
            this.currentXPosition = 0;

            _OsShell.putPrompt();
         }

        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            var offset = _DefaultFontSize + 
                        _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                        _FontHeightMargin;

            this.currentYPosition += offset;

            if (this.currentYPosition >= this.MAX_Y_POSITION){

                // Shift the CLI up
                var context_data = _DrawingContext.getImageData(0, offset, _DrawingContext.canvas.width, _DrawingContext.canvas.height-offset);
                this.clearScreen();
                _DrawingContext.putImageData(context_data, 0, 0);
                
                // Keep the Y position at the bottom
                this.currentYPosition = this.MAX_Y_POSITION - offset;
            }

        }
    }
 }
