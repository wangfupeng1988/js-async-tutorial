
const fs = require('fs')
const path = require('path')
const thunkify = require('thunkify')
const co = require('co')
const Q = require('q')

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
// fn1()


function fn2() {

    const symbolA = Symbol.a
    const obj = {
        'a': 100,
        'b': function () {console.log('this is b')},
        symbolA: function () {console.log('this is symbol')}
    }

}
// fn2()


function fn3() {

    // console.log(Array.prototype.slice)
    // console.log(Array.prototype[Symbol.iterator])

    // let item
    // for (item of [100, 200, 300]) {
    //     console.log(item)
    // }

    const arr = [100, 200, 300]
    const iterator = arr[Symbol.iterator]()
    // console.log(iterator.next())
    // console.log(iterator.next())
    // console.log(iterator.next())
    // console.log(iterator.next())

    // let i
    // for (i of iterator) {
    //     console.log(i)
    // }

    function* Hello() {
        yield 100
        yield (function () {return 200})()
        return 300 
    }
    const h = Hello()
    console.log(h[Symbol.iterator])  // [Function: [Symbol.iterator]]
    // console.log(h.next())  // { value: 100, done: false }
    // console.log(h.next())  // { value: 200, done: false }
    // console.log(h.next())  // { value: 300, done: false }
    // console.log(h.next())  // { value: undefined, done: true }

    let i
    for (i of h) {
        console.log(i)
    }
}
// fn3()


function fn4() {

    // function* G() {
    //     const a = yield 100
    //     console.log('a', a)
    //     const b = yield 200
    //     console.log('b', b)
    //     const c = yield 300
    //     console.log('c', c)
    // }
    // const g = G()
    // g.next()    // value: 100
    // g.next('aaa') // value: 200
    // g.next('bbb') // value: 300
    // g.next('ccc') // value: undefined


    // function* fibonacci() {
    //     let [prev, curr] = [0, 1]
    //     for (;;) {
    //         [prev, curr] = [curr, prev + curr]
    //         // 将中间值通过 yield 返回，并且保留函数执行的状态，因此可以非常简单的实现 fibonacci
    //         yield curr
    //     }
    // }
    // for (let n of fibonacci()) {
    //     if (n > 1000) {
    //         break
    //     }
    //     console.log(n)
    // }

    function* G1() {
        yield 'a'
        yield* G2()
        yield 'b'
    }
    function* G2() {
        yield 'x'
        yield 'y'
    }
    for (let item of G1()) {
        console.log(item)
    }

}
// fn4()


function fn5() {

    // const thunk = function (fileName, codeType) {
    //     // 返回一个只接受 callback 参数的函数
    //     return function (callback) {
    //         fs.readFile(fileName, codeType, callback)
    //     }
    // }
    // const fileName = path.resolve(__dirname, '../data/data1.json')
    // const readFileThunk = thunk(fileName, 'utf-8')
    // readFileThunk((err, data) => {
    //     console.log(data.toString())
    // })

    const thunk = thunkify(fs.readFile)
    const fileName = path.resolve(__dirname, '../data/data1.json')
    const readFileThunk = thunk(fileName, 'utf-8')
    readFileThunk((err, data) => {
        // 获取文件内容
        console.log(data)
    })

}
// fn5()


function fn6() {

    const readFileThunk = thunkify(fs.readFile)
    const fileName1 = path.resolve(__dirname, '../data/data1.json')
    const fileName2 = path.resolve(__dirname, '../data/data2.json')
    const gen = function* () {
        const r1 = yield readFileThunk(fileName1)
        console.log(111, r1.toString())
        const r2 = yield readFileThunk(fileName2)
        console.log(222, r2.toString())
    }

    const g = gen()

    g.next().value((err, data1) => {
        g.next(data1).value((err, data2) => {
            g.next(data2)
        })
    })

}
// fn6()

function fn7() {
    // 自动流程管理的函数
    function run(generator) {
        const gen = generator()
        function next(err, data) {
            const result = gen.next(data)  // 返回 { value: [Function], done: ... }
            if (result.done) {
                // result.done 表示是否结束
                return
            }
            result.value(next)  // result.value 是一个 thunk 函数

            // 思考：如果 yield 后面不是 thunk 函数而是 promise 对象，上一句的 result.value(next) 就可以变为 result.value.then(next) 
        }
        next() // 手动执行以启动第一次 next
    }

    const readFileThunk = thunkify(fs.readFile)
    const fileName1 = path.resolve(__dirname, '../data/data1.json')
    const fileName2 = path.resolve(__dirname, '../data/data2.json')
    const gen = function* () {
        const r1 = yield readFileThunk(fileName1)
        console.log(111, r1.toString())
        const r2 = yield readFileThunk(fileName2)
        console.log(222, r2.toString())
    }

    // run(gen)

    const c = co(gen)
    c.then(data => {
        console.log('结束')
    })

}
// fn7()

function fn8() {

    const fileName1 = path.resolve(__dirname, '../data/data1.json')
    const fileName2 = path.resolve(__dirname, '../data/data2.json')
    const readFilePromise = Q.denodeify(fs.readFile)

    const gen = function* () {
        const r1 = yield readFilePromise(fileName1)
        console.log(111, r1.toString())
        const r2 = yield readFilePromise(fileName2)
        console.log(222, r2.toString())
    }

    co(gen)
}
// fn8()


function fn9() {

    let info = ''
    function* g1() {
        info += '1'
        yield* g2()
        info += '5'
    }
    function* g2() {
        info += '2'
        yield* g3()
        info += '4'
    }
    function* g3() {
        info += '3'
    }

    var g = g1()
    g.next()
    console.log(info)  // 12345

}
// fn9()

function fn10() {

    class MyKoa extends Object {
        constructor(props) {
            super(props);
            
            // 存储所有的中间件
            this.middlewares = []
        }

        // 注入中间件
        use (generator) {
            this.middlewares.push(generator)
        }

        // 执行中间件
        listen () {
            this._run()
        }

        _run () {
            const ctx = this
            const middlewares = ctx.middlewares
            co(function* () {
                let prev = null
                let i = middlewares.length
                //从最后一个中间件到第一个中间件的顺序开始遍历
                while (i--) {
                    //实际koa的ctx应该指向server的上下文，这里做了简化
                    //prev 将前面一个中间件传递给当前中间件
                    prev = middlewares[i].call(ctx, prev);
                }
                //执行第一个中间件
                yield prev;
            })
        }
    }

    // 实验效果
    var app = new MyKoa();
    app.use(function *(next){
        this.body = '1';
        yield next;
        this.body += '5';
        console.log(this.body);
    });
    app.use(function *(next){
        this.body += '2';
        yield next;
        this.body += '4';
    });
    app.use(function *(next){
        this.body += '3';
    });
    app.listen();

}
fn10()