# 使用 Q.js 库

如果实际项目中使用`Promise`，还是强烈建议使用比较靠谱的第三方插件，会极大增加你的开发效率。除了将要介绍的`Q.js`，还有`bluebird`也推荐使用，去 github 自行搜索吧。

另外，使用第三方库不仅仅是提高效率，**它还让你在浏览器端（不支持`Promise`的环境中）使用`promise`**。

本节展示的代码参考[这里](./test.js)

## 本节内容概述

- 下载和安装
- 使用`Q.nfcall`和`Q.nfapply`
- 使用`Q.defer`
- 使用`Q.denodeify`
- 使用`Q.all`和`Q.any`
- 使用`Q.delay`
- 其他

## 下载和安装

可以直接去它的 [github 地址](https://github.com/kriskowal/q) （近 1.3W 的 star 数量说明其用户群很大）查看文档。

如果项目使用 CommonJS 规范直接 `npm i q --save`，如果是网页外链可寻找可用的 cdn 地址，或者干脆下载到本地。

以下我将要演示的代码，都是使用 CommonJS 规范的，因此我要演示代码之前加上引用，以后的代码演示就不重复加了。

```javascript
const Q = require('q')
```

## 使用`Q.nfcall`和`Q.nfapply`

要使用这两个函数，你得首先了解 JS 的`call`和`apply`，如果不了解，先去看看。熟悉了这两个函数之后，再回来看。

`Q.nfcall`就是使用`call`的语法来返回一个`promise`对象，例如

```javascript
const fullFileName = path.resolve(__dirname, '../data/data1.json')
const result = Q.nfcall(fs.readFile, fullFileName, 'utf-8')  // 使用 Q.nfcall 返回一个 promise
result.then(data => {
    console.log(data)
}).catch(err => {
    console.log(err.stack)
})
```

`Q.nfapply`就是使用`apply`的语法返回一个`promise`对象，例如

```javascript
const fullFileName = path.resolve(__dirname, '../data/data1.json')
const result = Q.nfapply(fs.readFile, [fullFileName, 'utf-8'])  // 使用 Q.nfapply 返回一个 promise
result.then(data => {
    console.log(data)
}).catch(err => {
    console.log(err.stack)
})
```

怎么样，体验了一把，是不是比直接自己写`Promise`简单多了？

## 使用`Q.defer`

`Q.defer`算是一个比较偏底层一点的 API ，用于自己定义一个`promise`生成器，如果你需要在浏览器端编写，而且浏览器不支持`Promise`，这个就有用处了。

```javascript
function readFile(fileName) {
    const defer = Q.defer()
    fs.readFile(fileName, (err, data) => {
        if (err) {
            defer.reject(err)
        } else {
            defer.resolve(data.toString())
        }
    })
    return defer.promise
}
readFile('data1.json')
    .then(data => {
        console.log(data)
    })
    .catch(err => {
        console.log(err.stack)
    })
```


## 使用`Q.denodeify`

我们在很早之前的一节中自己封装了一个`fs.readFile`的`promise`生成器，这里再次回顾一下

```javascript
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
```

虽然看着不麻烦，但是还是需要很多行代码来实现，如果使用`Q.denodeify`，一行代码就搞定了！

```javascript
const readFilePromise = Q.denodeify(fs.readFile)
```

`Q.denodeif`就是一键将`fs.readFile`这种有回调函数作为参数的异步操作封装成一个`promise`生成器，非常方便！

## 使用`Q.all`和`Q.any`

这两个其实就是对应了之前讲过的`Promise.all`和`Promise.race`，而且应用起来一模一样，不多赘述。

```javascript
const r1 = Q.nfcall(fs.readFile, 'data1.json', 'utf-8')
const r2 = Q.nfcall(fs.readFile, 'data2.json', 'utf-8')
Q.all([r1, r2]).then(arr => {
    console.log(arr)
}).catch(err => {
    console.log(err)
})
```

## 使用`Q.delay`

`Q.delay`，顾名思义，就是延迟的意思。例如，读取一个文件成功之后，再过五秒钟之后，再去做xxxx。这个如果是自己写的话，也挺费劲的，但是`Q.delay`就直接给我们分装好了。

```javascript
const result = Q.nfcall(fs.readFile, 'data1.json', 'utf-8')
result.delay(5000).then(data => {
    // 得到结果
    console.log(data.toString())
}).catch(err => {
    // 捕获错误
    console.log(err.stack)
})
```

## 其他

以上就是`Q.js`一些最常用的操作，其他的一些非常用技巧，大家可以去搜索或者去官网查看文档。

至此，ES6 `Promise`的所有内容就已经讲完了。但是异步操作的优化到这里没有结束，更加精彩的内容还在后面 ———— `Generator`

## 求打赏

如果你看完了，感觉还不错，欢迎给我打赏 ———— 以激励我更多输出优质内容

![](http://images2015.cnblogs.com/blog/138012/201702/138012-20170228112237798-1507196643.png)