const fs = require('fs')
const path = require('path')
const Q = require('q')

function fn1() {

    const fileName1 = path.resolve(__dirname, '../data/data1.json')
    const fileName2 = path.resolve(__dirname, '../data/data2.json')
    const readFilePromise = Q.denodeify(fs.readFile)

    // 定义 async 函数
    const readFileAsync = async function () {
        const f1 = await readFilePromise(fileName1)
        const f2 = await readFilePromise(fileName2)
        console.log('data1.json', f1.toString())
        console.log('data2.json', f2.toString())

        return 'done'
    }
    // 执行
    const result = readFileAsync()

    result.then(data => {
        console.log(data)
    })
}
fn1()