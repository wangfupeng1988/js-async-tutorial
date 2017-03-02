# Generator 与异步操作

这一节正式开始讲解`Generator`如何进行异步操作，以前我们花了好几节的时间各种打基础，现在估计大家也都等急了，好戏马上开始！

本节演示的代码可参考[这里](./test.js)

## 本节内容概述

- 在`Genertor`中使用`thunk`函数
- 挨个读取两个文件的内容
- 自驱动流程
- 使用`co`库
- `co`库和`Promise`
- 接下来...

## 在`Genertor`中使用`thunk`函数

这个比较简单了，之前都讲过的，直接看代码即可。代码中表达的意思，是要依次读取两个文件的内容

```javascript
const readFileThunk = thunkify(fs.readFile)
const gen = function* () {
    const r1 = yield readFileThunk('data1.json')
    console.log(r1)
    const r2 = yield readFileThunk('data2.json')
    console.log(r2)
}
```

## 挨个读取两个文件的内容

接着以上的代码继续写，注释写的非常详细，大家自己去看，看完自己写代码亲身体验。

```javascript
const g = gen()

// 试着打印 g.next() 这里一定要明白 value 是一个 thunk函数 ，否则下面的代码你都看不懂
// console.log( g.next() )  // g.next() 返回 {{ value: thunk函数, done: false }} 

// 下一行中，g.next().value 是一个 thunk 函数，它需要一个 callback 函数作为参数传递进去
g.next().value((err, data1) => {
    // 这里的 data1 获取的就是第一个文件的内容。下一行中，g.next(data1) 可以将数据传递给上面的 r1 变量，此前已经讲过这种参数传递的形式
    // 下一行中，g.next(data1).value 又是一个 thunk 函数，它又需要一个 callback 函数作为参数传递进去
    g.next(data1).value((err, data2) => {
        // 这里的 data2 获取的是第二个文件的内容，通过 g.next(data2) 将数据传递个上面的 r2 变量
        g.next(data2)
    })
})
```

上面 6 行左右的代码，却用了 6 行左右的注释来解释，可见代码的逻辑并不简单，不过你还是要去尽力理解，否则接下来的内容无法继续。再说，我已经写的那么详细了，你只要照着仔细看肯定能看明白的。

也许上面的代码给你带来的感觉并不好，第一它逻辑复杂，第二它也不是那么易读、简洁呀，用`Generator`实现异步操作就是这个样子的？———— 当然不是，继续往下看。

## 自驱动流程

以上代码中，读取两个文件的内容都是手动一行一行写的，而我们接下来要做一个自驱动的流程，定义好`Generator`的代码之后，就让它自动执行。完整的代码如下所示：

```javascript
// 自动流程管理的函数
function run(generator) {
    const g = generator()
    function next(err, data) {
        const result = g.next(data)  // 返回 { value: thunk函数, done: ... }
        if (result.done) {
            // result.done 表示是否结束，如果结束了那就 return 作罢
            return
        }
        result.value(next)  // result.value 是一个 thunk 函数，需要一个 callback 函数作为参数，而 next 就是一个 callback 形式的函数
    }
    next() // 手动执行以启动第一次 next
}

// 定义 Generator
const readFileThunk = thunkify(fs.readFile)
const gen = function* () {
    const r1 = yield readFileThunk('data1.json')
    console.log(r1.toString())
    const r2 = yield readFileThunk('data2.json')
    console.log(r2.toString())
}

// 启动执行
run(gen)
```

其实这段代码和上面的手动编写读取两个文件内容的代码，原理上是一模一样的，只不过这里把流程驱动给封装起来了。我们简单分析一下这段代码

- 最后一行`run(gen)`之后，进入`run`函数内部执行
- 先`const g = generator()`创建`Generator`实例，然后定义一个`next`方法，并且立即执行`next()`
- 注意这个`next`函数的参数是`err, data`两个，和我们`fs.readFile`用到的`callback`函数形式完全一样
- 第一次执行`next`时，会执行`const result = g.next(data)`，而`g.next(data)`返回的是`{ value: thunk函数, done: ... }`，`value`是一个`thunk`函数，`done`表示是否结束
- 如果`done: true`，那就直接`return`了，否则继续进行
- `result.value`是一个`thunk`函数，需要接受一个`callback`函数作为参数传递进去，因此正好把`next`给传递进去，让`next`一直被执行下去

大家照着这个过程来捋一捋，不是特别麻烦，然后自己试着写完运行一下，基本就能了解了。

## 使用`co`库

刚才我们定义了一个`run`还是来做自助流程管理，是不是每次使用都得写一遍`run`函数呢？———— 肯定不是的，直接用大名鼎鼎的`co`就好了。用`Generator`的工程师，肯定需要用到`co`，两者天生一对，难舍难分。

使用之前请安装`npm i co --save`，然后在文件开头引用`const co = require('co')`。`co`到底有多好用，我们将刚才的代码用`co`重写，就变成了如下代码。非常简洁

```javascript
// 定义 Generator
const readFileThunk = thunkify(fs.readFile)
const gen = function* () {
    const r1 = yield readFileThunk('data1.json')
    console.log(r1.toString())
    const r2 = yield readFileThunk('data2.json')
    console.log(r2.toString())
}
const c = co(gen)
```

而且`const c = co(gen)`返回的是一个`Promise`对象，可以接着这么写

```javascript
c.then(data => {
    console.log('结束')
})
```

## `co`库和`Promise`

刚才提到`co()`最终返回的是`Promise`对象，后知后觉，我们已经忘记`Promise`好久了，现在要重新把它拾起来。**如果使用`co`来处理`Generator`的话，其实`yield`后面可以跟`thunk`函数，也可以跟`Promise`对象。**

`thunk`函数上文一直在演示，下面演示一下`Promise`对象的，也权当再回顾一下久别的`Promise`。其实从形式上和结果上，都跟`thunk`函数一样。

```javascript
const readFilePromise = Q.denodeify(fs.readFile)

const gen = function* () {
    const r1 = yield readFilePromise('data1.json')
    console.log(r1.toString())
    const r2 = yield readFilePromise('data2.json')
    console.log(r2.toString())
}

co(gen)
```

## 接下来...

经过了前几节的技术积累，我们用一节的时间就讲述了`Generator`如何进行异步操作。接下来要介绍一个开源社区中比较典型的使用`Generator`的框架 ———— Koa

## 求打赏

如果你看完了，感觉还不错，欢迎给我打赏 ———— 以激励我更多输出优质内容

![](http://images2015.cnblogs.com/blog/138012/201702/138012-20170228112237798-1507196643.png)