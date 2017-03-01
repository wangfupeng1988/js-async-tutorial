# Promise 真的取代 callback 了吗

Promise 虽然改变了 JS 工程师对于异步操作的写法，但是却改变不了 JS 单线程、异步的执行模式。

## 本节概述

- JS 异步的本质
- Promise 只是表面的写法上的改变
- Promise 中不能缺少 callback
- 接下来...

## JS 异步的本质

从最初的 ES3、4 到 ES5 再到现在的 ES6 和即将到来的 ES7，语法标准上更新很多，但是 JS 这种单线程、异步的本质是没有改变的。nodejs 中读取文件的代码一直都可以这样写

```javascript
fs.readFile('some.json', (err, data) => {
})
```

既然异步这个本质不能改变，伴随异步在一起的永远都会有`callback`，因为没有`callback`就无法实现异步。因此`callback`永远存在。

## Promise 只是表面的写法上的改变

JS 工程师不会讨厌 JS 异步的本质，但是很讨厌 JS 异步操作中`callback`的书写方式，特别是遇到万恶的`callback-hell`（嵌套`callback`）时。

计算机的抽象思维和人的具象思维是完全不一样的，人永远喜欢看起来更加符合逻辑、更加易于阅读的程序，因此现在特别强调代码可读性。而`Promise`就是一种代码可读性的变化。大家感受一下这两种不同（**这其中还包括异常处理，加上异常处理会更加复杂**）

第一种，传统的`callback`方式

```javascript
fs.readFile('some1.json', (err, data) => {
    fs.readFile('some2.json', (err, data) => {
        fs.readFile('some3.json', (err, data) => {
            fs.readFile('some4.json', (err, data) => {

            })
        })
    })
})
```

第二种，`Promise`方式

```javascript
readFilePromise('some1.json').then(data => {
    return readFilePromise('some2.json')
}).then(data => {
    return readFilePromise('some3.json')
}).then(data => {
    return readFilePromise('some4.json')
})
```

这两种方式对于代码可读性的对比，非常明显。**但是最后再次强调，`Promise`只是对于异步操作代码可读性的一种变化，它并没有改变 JS 异步执行的本质，也没有改变 JS 中存在`callback`的现象**。

## Promise 中不能缺少 callback

上文已经基本给出了上一节提问的答案，但是这里还需要再加一个补充：`Promise`不仅仅是没有取代`callback`或者弃而不用，反而`Promise`中要使用到`callback`。因为，JS 异步执行的本质，必须有`callback`存在，否则无法实现。

再次粘贴处之前章节的封装好的一个`Promise`函数（进行了一点点简化）

```javascript
const readFilePromise = function (fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, data) => {
            resolve(data.toString())
        })
    })
}
```

上面的代码中，`promise`对象的状态要从`pending`变化为`fulfilled`，就需要去执行`resolve()`函数。那么是从哪里执行的 ———— **还得从`callback`中执行`resolve`函数 ———— 这就是`Promise`也需要`callback`的最直接体现**。

## 接下来...

一块技术“火”的程度和第三方开源软件的数量、质量以及使用情况有很大的正比关系。例如为了简化 DOM 操作，jquery 风靡全世界。Promise 用的比较多，第三方库当然就必不可少，它们极大程度的简化了 Promise 的代码。

接下来我们一起看看`Q.js`这个库的使用，学会了它，将极大程度提高你写 Promise 的效率。

## 求打赏

如果你看完了，感觉还不错，欢迎给我打赏 ———— 以激励我更多输出优质内容

![](http://images2015.cnblogs.com/blog/138012/201702/138012-20170228112237798-1507196643.png)