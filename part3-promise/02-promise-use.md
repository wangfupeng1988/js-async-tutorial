# Promise 在 ES6 中的具体应用

上一节对 ES6 的 Promise 有了一个最简单的介绍，这一节详细说一下 Promise 那些最常见的功能

本节展示的代码参考[这里](./test.js)

## 本节课程概述

- 准备工作
- 参数传递
- 异常捕获
- 串联多个异步操作
- `Promise.all`和`Promise.race`的应用
- `Promise.resolve`的应用
- 其他

## 准备工作

因为以下所有的代码都会用到`Promise`，因此干脆在所有介绍之前，先封装一个`Promise`，**封装一次，为下面多次应用**。

```javascript
const fs = require('fs')
const path = require('path')  // 后面获取文件路径时候会用到
const readFilePromise = function (fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, data) => {
            if (err) {
                reject(err)  // 注意，这里执行 reject 是传递了参数，后面会有地方接收到这个参数
            } else {
                resolve(data.toString())  // 注意，这里执行 resolve 时传递了参数，后面会有地方接收到这个参数
            }
        })
    })
}
```

以上代码一个一段 nodejs 代码，将读取文件的函数`fs.readFile`封装为一个`Promise`。经过上一节的学习，我想大家肯定都能看明白代码的含义，要是看不明白，你就需要回炉重造了！

## 参数传递

我们要使用上面封装的`readFilePromise`读取一个 json 文件`../data/data2.json`，这个文件内容非常简单：`{"a":100, "b":200}`

先将文件内容打印出来，代码如下。大家需要注意，`readFilePromise`函数中，执行`resolve(data.toString())`传递的参数内容，会被下面代码中的`data`参数所接收到。

```javascript
const fullFileName = path.resolve(__dirname, '../data/data2.json')
const result = readFilePromise(fullFileName)
result.then(data => {
    console.log(data)
})
```

再加一个需求，在打印出文件内容之后，我还想看看`a`属性的值，代码如下。之前我们已经知道`then`可以执行链式操作，如果`then`有多步骤的操作，那么前面步骤`return`的值会被当做参数传递给后面步骤的函数，如下面代码中的`a`就接收到了`return JSON.parse(data).a`的值

```javascript
const fullFileName = path.resolve(__dirname, '../data/data2.json')
const result = readFilePromise(fullFileName)
result.then(data => {
    // 第一步操作
    console.log(data)
    return JSON.parse(data).a  // 这里将 a 属性的值 return
}).then(a => {
    // 第二步操作
    console.log(a)  // 这里可以获取上一步 return 过来的值
})
```

总结一下，这一段内容提到的“参数传递”其实有两个方面：

- 执行`resolve`传递的值，会被第一个`then`处理时接收到
- 如果`then`有链式操作，前面步骤返回的值，会被后面的步骤获取到

## 异常捕获

我们知道`then`会接收两个参数（函数），第一个参数会在执行`resolve`之后触发（还能传递参数），第二个参数会在执行`reject`之后触发（其实也可以传递参数，和`resolve`传递参数一样），但是上面的例子中，**我们没有用到`then`的第二个参数。这是为何呢 ———— 因为不建议这么用**。

对于`Promise`中的异常处理，我们建议用`catch`方法，而不是`then`的第二个参数。请看下面的代码，以及注释。

```javascript
const fullFileName = path.resolve(__dirname, '../data/data2.json')
const result = readFilePromise(fullFileName)
result.then(data => {
    console.log(data)
    return JSON.parse(data).a
}).then(a => {
    console.log(a)
}).catch(err => {
    console.log(err.stack)  // 这里的 catch 就能捕获 readFilePromise 中触发的 reject ，而且能接收 reject 传递的参数
})
```

在若干个`then`串联之后，我们一般会在最后跟一个`.catch`来捕获异常，而且执行`reject`时传递的参数也会在`catch`中获取到。这样做的好处是：

- 让程序看起来更加简洁，是一个串联的关系，没有分支（如果用`then`的两个参数，就会出现分支，影响阅读）
- 看起来更像是`try - catch`的样子，更易理解

## 串联多个异步操作

如果现在有一个需求：先读取`data2.json`的内容，当成功之后，再去读取`data1.json`。这样的需求，如果用传统的`callback`去实现，会变得很麻烦。而且，现在只是两个文件，如果是十几个文件这样做，写出来的代码就没法看了（臭名昭著的`callback-hell`）。但是用刚刚学到的`Promise`就可以轻松胜任这项工作

```javascript
const fullFileName2 = path.resolve(__dirname, '../data/data2.json')
const result2 = readFilePromise(fullFileName2)
const fullFileName1 = path.resolve(__dirname, '../data/data1.json')
const result1 = readFilePromise(fullFileName1)

result2.then(data => {
    console.log('data2.json', data)
    return result1  // 此处只需返回读取 data1.json 的 Promise 即可
}).then(data => {
    console.log('data1.json', data) // data 即可接收到 data1.json 的内容
})
```

上文“参数传递”提到过，如果`then`有链式操作，前面步骤返回的值，会被后面的步骤获取到。**但是，如果前面步骤返回值是一个`Promise`的话，情况就不一样了 ———— 如果前面返回的是`Promise`对象，后面的`then`将会被当做这个返回的`Promise`的第一个`then`来对待** ———— 如果你这句话看不懂，你需要将“参数传递”的示例代码和这里的示例代码联合起来对比着看，然后体会这句话的意思。

## `Promise.all`和`Promise.race`的应用

我还得继续提出更加奇葩的需求，以演示`Promise`的各个常用功能。如下需求：

读取两个文件`data1.json`和`data2.json`，现在我需要一起读取这两个文件，等待它们全部都被读取完，再做下一步的操作。此时需要用到`Promise.all`

```javascript
// Promise.all 接收一个包含多个 promise 对象的数组
Promise.all([result1, result2]).then(datas => {
    // 接收到的 datas 是一个数组，依次包含了多个 promise 返回的内容
    console.log(datas[0])
    console.log(datas[1])
})
```


读取两个文件`data1.json`和`data2.json`，现在我需要一起读取这两个文件，但是只要有一个已经读取了，就可以进行下一步的操作。此时需要用到`Promise.race`

```javascript
// Promise.race 接收一个包含多个 promise 对象的数组
Promise.race([result1, result2]).then(data => {
    // data 即最先执行完成的 promise 的返回值
    console.log(data)
})
```

## `Promise.resolve`的应用

从 jquery 引出，到此即将介绍完 ES6 的`Promise`，现在我们再回归到 jquery 。

大家都是到 jquery v1.5 之后`$.ajax()`返回的是一个`deferred`对象，而这个`deferred`对象和我们现在正在学习的`Promise`对象已经很接近了，但是还不一样。那么 ———— `deferred`对象能否转换成 ES6 的`Promise`对象来使用？？

答案是能！需要使用`Promise.resolve`来实现这一功能，请看以下代码：

```javascript
// 在浏览器环境下运行，而非 node 环境
cosnt jsPromise = Promise.resolve($.ajax('/whatever.json'))
jsPromise.then(data => {
    // ...
})
```

**注意：这里的`Promise.resolve`和文章最初`readFilePromise`函数内部的`resolve`函数可千万不要混了，完全是两码事儿**。JS 基础好的同学一看就明白，而这里看不明白的同学，要特别注意。

实际上，并不是`Promise.resolve`对 jquery 的`deferred`对象做了特殊处理，**而是`Promise.resolve`能够将`thenable`对象转换为`Promise`对象**。什么是`thenable`对象？———— 看个例子

```javascript
// 定义一个 thenable 对象
const thenable = {
    // 所谓 thenable 对象，就是具有 then 属性，而且属性值是如下格式函数的对象
    then: (resolve, reject) => {
        resolve(200)
    }
}

// thenable 对象可以转换为 Promise 对象
const promise = Promise.resolve(thenable)
promise.then(data => {
    // ...
})
```

上面的代码就将一个`thenalbe`对象转换为一个`Promise`对象，只不过这里没有异步操作，所有的都会同步执行，但是不会报错的。

其实，在我们的日常开发中，这种将`thenable`转换为`Promise`的需求并不多。**真正需要的是，将一些异步操作函数（如`fs.readFile`）转换为`Promise`**（就像文章一开始`readFilePromise`做的那样）。这块，我们后面会在介绍`Q.js`库时，告诉大家一个简单的方法。

## 其他

以上都是一些日常开发中非常常用的功能，其他详细的介绍，请参考阮一峰老师的 [ES6 教程 Promise 篇](http://es6.ruanyifeng.com/#docs/promise)

最后，本节我们只是介绍了`Promise`的一些应用，通俗易懂拿来就用的东西，但是没有提升到理论和标准的高度。有人可能会不屑 ———— 我会用就行了，要那么空谈的理论干嘛？———— **你只会使用却上升不到理论高度，永远都是个搬砖的，搬一块砖挣一毛钱，不搬就不挣钱！** 在我看来，所有的知识应该都需要上升到理论高度，将实际应用和标准对接，知道真正的出处，才能走的长远。

下一节我们介绍 Promise/A+ 规范

## 求打赏

如果你看完了，感觉还不错，欢迎给我打赏 ———— 以激励我更多输出优质内容

![](http://images2015.cnblogs.com/blog/138012/201702/138012-20170228112237798-1507196643.png)