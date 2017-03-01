const fs = require('fs')
const path = require('path')
const Q = require('q')

// 封装一个 Promise
const readFilePromise = function (fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data.toString())
            }
        })
    })
}

// ------- 最简单的 Promise 演示 -------
function fn1() {
    const wait =  function () {
        // 定义一个 promise 对象
        const promise = new Promise((resolve, reject) => {
            // 将之前的异步操作，包括到这个 new Promise 函数之内
            const task = function () {
                console.log('执行完成')
                resolve()  // callback 中去执行 resolve 或者 reject
            }
            setTimeout(task, 2000)
        })
        // 返回 promise 对象
        return promise
    }
    const w = wait()
    w.then(() => {
        console.log('ok 1')
    }, () => {
        console.log('err 1')
    }).then(() => {
        console.log('ok 2')
    }, () => {
        console.log('err 2')
    })
}
// fn1()


// --------- 参数传递 --------
function fn2() {
    const fullFileName = path.resolve(__dirname, '../data/data2.json')
    const result = readFilePromise(fullFileName)
    result.then(data => {
        console.log(data)
        return JSON.parse(data).a
    }).then(a => {
        console.log(a)
    }).catch(err => {
        console.log(err.stack)
    })
}
// fn2()


// ------- 串联读取多个文件内容 ------
function fn3() {

    const fullFileName2 = path.resolve(__dirname, '../data/data2.json')
    const result2 = readFilePromise(fullFileName2)
    const fullFileName1 = path.resolve(__dirname, '../data/data1.json')
    const result1 = readFilePromise(fullFileName1)

    result2.then(data => {
        console.log('data2.json', data)
        return result1
    }).then(data => {
        console.log('data1.json', data)
    })

}
// fn3()


// ------- Promise.all 和 Promise.race ----------
function fn4() {

    const fullFileName2 = path.resolve(__dirname, '../data/data2.json')
    const result2 = readFilePromise(fullFileName2)
    const fullFileName1 = path.resolve(__dirname, '../data/data1.json')
    const result1 = readFilePromise(fullFileName1)

    // Promise.all 接收一个包含多个 promise 对象的数组
    Promise.all([result1, result2]).then(datas => {
        // 接收到的 datas 是一个数组，依次包含了多个 promise 返回的内容
        console.log(datas[0])
        console.log(datas[1])
    })

    // Promise.race 接收一个包含多个 promise 对象的数组
    Promise.race([result1, result2]).then(data => {
        // data 即最先执行完成的 promise 的返回值
        console.log(data)
    })

}
// fn4()


// ----- Promise.resolve() 的使用 -----
function fn5() {

    // Promise.resolve('foo') 的写法等价于以下代码，
    // new Promise( resolve => resolve('foo') )

    // 如果传入的参数是一个 promise 实例，则原封不动的返回
    const p1 = new Promise((resvole, reject) => {
        resolve(100)
    })
    console.log( 1, p1 === Promise.resolve(p1) )  // true


    // 参数是一个 thenalbe 对象，Promise.resovle() 会将对象转换为 Promise 对象，并立即执行其 then 方法
    const thenable = {
        then: (resolve, reject) => {
            resolve(200)
        }
    }
    const p2 = Promise.resolve(thenable)
    p2.then(val => {
        console.log(2, val)
    })


    // 实际应用，例如将 jquery.ajax 返回的 deferred 对象转换为 promise 实例
    // 这里的 deferred 对象就是一个 thenable 对象
    // var jsPromise = Promise.resolve($.ajax('/whatever.json'));
}
// fn5()


// ------ Q.nfcall 和 Q.nfapply --------
function fn6() {

    const fullFileName1 = path.resolve(__dirname, '../data/data1.json')
    const result1 = Q.nfcall(fs.readFile, fullFileName1, 'utf-8')
    result1.then(data => {
        console.log(data)
    }).catch(err => {
        console.log(err.stack)
    })

    const fullFileName2 = path.resolve(__dirname, '../data/data2.json')
    const result2 = Q.nfapply(fs.readFile, [fullFileName2, 'utf-8'])  // 使用 Q.nfapply 返回一个 promise
    result2.then(data => {
        console.log(data)
    }).catch(err => {
        console.log(err.stack)
    })

}
fn6()


