## Promise 加入 ES6 标准

从 jquery v1.5 发布经过若干时间之后，Promise 终于出现在了 ES6 的标准中，而当下 ES6 也正在被大规模使用。

本节展示的代码参考[这里](./test.js)

## 本节内容概述

- 写一段传统的异步操作
- 用`Promise`进行封装

## 写一段传统的异步操作

还是拿之前讲 jquery `deferred`对象时的那段`setTimeout`程序

```javascript
var wait = function () {
    var task = function () {
        console.log('执行完成')
    }
    setTimeout(task, 2000)
}
wait()
```

之前我们使用 jquery 封装的，接下来将使用 ES6 的`Promise`进行封装，大家注意看有何不同。

## 用`Promise`进行封装

```javascript
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
```

注意看看程序中的注释，那都是重点部分。从整体看来，感觉这次比用 jquery 那次简单一些，逻辑上也更加清晰一些。

- 将之前的异步操作那几行程序，用`new Promise((resolve,reject) => {.....})`包装起来，最后`return`即可
- 异步操作的内部，在`callback`中执行`resolve()`（表明成功了，失败的话执行`reject`）

接着上面的程序继续往下写。`wait()`返回的肯定是一个`promise`对象，而`promise`对象有`then`属性。

```javascript
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
```

`then`还是和之前一样，接收两个参数（函数），第一个在成功时（触发`resolve`）执行，第二个在失败时(触发`reject`)时执行。而且，`then`还可以进行链式操作。

以上就是 ES6 的`Promise`的基本使用演示。看完你可能会觉得，这跟之前讲述 jquery 的不差不多吗 ———— 对了，这就是我要在之前先讲 jquery 的原因，让你感觉一篇一篇看起来如丝般顺滑！

接下来，将详细说一下 ES6 `Promise` 的一些比较常见的用法，敬请期待吧！

## 求打赏

如果你看完了，感觉还不错，欢迎给我打赏 ———— 以激励我更多输出优质内容

![](http://images2015.cnblogs.com/blog/138012/201702/138012-20170228112237798-1507196643.png)

