/* --------
   Utils.ts

   Utility functions.
   -------- */

module TSOS {

    export class Utils {

        public static trim(str): string {
            // Use a regular expression to remove leading and trailing spaces.
            return str.replace(/^\s+ | \s+$/g, "");
            /*
            Huh? WTF? Okay... take a breath. Here we go:
            - The "|" separates this into two expressions, as in A or B.
            - "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
            - "\s+$" is the same thing, but at the end of the string.
            - "g" makes is global, so we get all the whitespace.
            - "" is nothing, which is what we replace the whitespace with.
            */
        }

        public static rot13(str: string): string {
            /*
               This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
               You can do this in three lines with a complex regular expression, but I'd have
               trouble explaining it in the future.  There's a lot to be said for obvious code.
            */
            var retVal: string = "";
            for (var i in <any>str) {    // We need to cast the string to any for use in the for...in construct.
                var ch: string = str[i];
                var code: number = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) + 13;  // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                } else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) - 13;  // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                } else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        }

        public static isInt(str): boolean {
            return !isNaN(str) && Number.isInteger(parseFloat(str));
        }

        // From https://stackoverflow.com/questions/3745666/how-to-convert-from-hex-to-ascii-in-javascript
        public static hex2a(hexx): string {
            //force conversion
            var hex = hexx.toString();
            var str = '';
            for (var i = 0; i < hex.length; i += 2) {
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            }     
            return str; 
        }
        
        public static removeListElement(list: number[], target: number) {
            const index = list.indexOf(target, 0);
            if (index > -1) {
                list.splice(index, 1);
            }
        }

        // https://stackoverflow.com/questions/21647928/javascript-unicode-string-to-hex
        // To convert from a string to hex
        public static toHex(str): string {
            var result = '';
            for (var i=0; i<str.length; i++) {
              result += str.charCodeAt(i).toString(16);
            }
            return result;
        }

        // https://masteringjs.io/tutorials/fundamentals/compare-arrays
        public static arrayEquals(a, b) {
            return Array.isArray(a) &&
              Array.isArray(b) &&
              a.length === b.length &&
              a.every((val, index) => val === b[index]);
        }

        public static smartArgsParsing(args: string[]): string[] {
            const truncatedArgs = args.slice(1, args.length);
            const data = truncatedArgs.join(' ');
            // Check that the parenthesis exist
            if (data[0] != '"' || data[data.length-1] != '"') {
                return null;
            }
            return [args[0], data];
        }

        // Truncates a string of Op codes
        // TODO: Finish

        // Turns a list of op codes into a string with no spaces
        public static opCodetoString(opCodes: Array<OpCode>): string {
            var accumulatedStr = '';
            console.log(opCodes.length)
            for (let i=0; i < opCodes.length; i++) {
                accumulatedStr += opCodes[i].codeString;
            }
            return accumulatedStr
        }

        // Turns a list of op codes into a string with no spaces
        public static filePIDNametoString(opCodes: Array<OpCode>): string {
            var accumulatedStr = '';
            for (let i=0; i < opCodes.length; i++) {
                if (opCodes[i].codeString == "00") {
                    // Hit end of PID
                    break;
                }
                accumulatedStr += Utils.hex2a(opCodes[i].codeString);
            }
            return accumulatedStr
        }

        // Turns a string of Opcodes with no spaces into a list of op codes
        public static stringToOpCode(str: string): Array<OpCode> {
            var finalArray = [];
            for (let i=0; i < str.length; i += 2) {
                finalArray.push(new OpCode(str[i] + str[i+1]));
            }
            return finalArray;
        }
    }
}
