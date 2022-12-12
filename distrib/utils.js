/* --------
   Utils.ts

   Utility functions.
   -------- */
var TSOS;
(function (TSOS) {
    class Utils {
        static trim(str) {
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
        static rot13(str) {
            /*
               This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
               You can do this in three lines with a complex regular expression, but I'd have
               trouble explaining it in the future.  There's a lot to be said for obvious code.
            */
            var retVal = "";
            for (var i in str) { // We need to cast the string to any for use in the for...in construct.
                var ch = str[i];
                var code = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) + 13; // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                }
                else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) - 13; // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                }
                else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        }
        static isInt(str) {
            return !isNaN(str) && Number.isInteger(parseFloat(str));
        }
        // From https://stackoverflow.com/questions/3745666/how-to-convert-from-hex-to-ascii-in-javascript
        static hex2a(hexx) {
            //force conversion
            var hex = hexx.toString();
            var str = '';
            for (var i = 0; i < hex.length; i += 2) {
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            }
            return str;
        }
        static removeListElement(list, target) {
            const index = list.indexOf(target, 0);
            if (index > -1) {
                list.splice(index, 1);
            }
        }
        // https://stackoverflow.com/questions/21647928/javascript-unicode-string-to-hex
        // To convert from a string to hex
        static toHex(str) {
            var result = '';
            for (var i = 0; i < str.length; i++) {
                result += str.charCodeAt(i).toString(16);
            }
            return result;
        }
        // Check if the queried file name is in the list of files in use
        static fileNameInFiles(filesInUse, queriedfileName) {
            for (const file of filesInUse) {
                if (file.name == queriedfileName) {
                    return true;
                }
            }
            return false;
        }
        static TSBInFileInFiles(filesInUse, queriedfileName) {
            for (const file of filesInUse) {
                if (file.name == queriedfileName) {
                    return file.TSB;
                }
            }
            return null;
        }
        // https://masteringjs.io/tutorials/fundamentals/compare-arrays
        static arrayEquals(a, b) {
            return Array.isArray(a) &&
                Array.isArray(b) &&
                a.length === b.length &&
                a.every((val, index) => val === b[index]);
        }
        static smartArgsParsing(args) {
            // TODO: Finish this!!
            const truncatedArgs = args.slice(1, args.length);
            // console.log("args: " + args)
            // console.log("Truncated args: " + truncatedArgs)
            const data = truncatedArgs.join(' ');
            // Check that the parenthesis exist
            if (data[0] != '"' || data[data.length - 1] != '"') {
                // _StdOut.putText("ERROR: data not in parenthesis");
                // console.log(data[0])
                // console.log(data[data.length])
                // console.log(data)
                return null;
            }
            return [args[0], data];
        }
    }
    TSOS.Utils = Utils;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=utils.js.map