// run it in node.

class Prand {
    constructor(seed) {
        this.value = seed;
        this.divider = 1/4294967296;
    }
    increment() {
        let x = this.value;
        x ^= x << 13;
        x ^= x >> 17;
        x <= x << 5;
        this.value = x;
    }
    getRandomIntFull() {
        this.increment();
        return this.value;
    }
    getRandomInt(range) {
        this.increment();
        return this.value%range;
    }
    getRandomFloat() {
        this.increment();
        return this.value/4294967296;
    }
    getRandomFloatMultiply() {
        this.increment();
        return this.value*this.divider;
    }
}


let rando = new Prand(1);


let time = Date.now();
console.log("random integers Full Range");
for (let i=0; i<1000000; i++) {
    rando.getRandomIntFull();
}
console.log(Date.now()-time);

time = Date.now();
console.log("random integers Limited Range");
for (let i=0; i<1000000; i++) {
    rando.getRandomInt(10000);
}
console.log(Date.now()-time);

time = Date.now();
console.log("random integers Float");
for (let i=0; i<1000000; i++) {
    rando.getRandomFloat();
}
console.log(Date.now()-time);

time = Date.now();
console.log("random integers Float with Multiplication");
for (let i=0; i<1000000; i++) {
    rando.getRandomFloatMultiply();
}
console.log(Date.now()-time);
