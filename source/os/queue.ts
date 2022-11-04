/* ------------
   Queue.ts

   A simple Queue, which is really just a dressed-up JavaScript Array.
   See the JavaScript Array documentation at
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
   Look at the push and shift methods, as they are the least obvious here.

   ------------ */

module TSOS {
    export class Queue {
        constructor(public q = new Array()) {
        }

        public getSize() {
            return this.q.length;
        }

        public isEmpty(){
            return (this.q.length == 0);
        }

        public enqueue(element) {
            this.q.push(element);
        }

        public dequeue() {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift();
            }
            return retVal;
        }

        public toString() {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i] + "] ";
            }
            return retVal;
        }

        public has(element: any) {
            const index = this.q.indexOf(element);
            if (index > -1){ // the element is in the array
                return true;
            }
            else {
                return false;
            }
        }
        
        public remove(element: any) {
            const index = this.q.indexOf(element);
            if (index > -1){ // only splice array when item is found
                // 2nd parameter means remove one item only
                this.q.splice(index, 1);
            }
        }
    }
}
