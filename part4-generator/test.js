
function fn1() {
    function* Hello() {
        yield 100
        yield (function () {return 200})()
        return 300 
    }
    var h = Hello()
    console.log(typeof h)  // object
    console.log(h.next())  // { value: 100, done: false }
    console.log(h.next())  // { value: 200, done: false }
    console.log(h.next())  // { value: 300, done: true }
    console.log(h.next())  // { value: undefined, done: true }
}
fn1()
