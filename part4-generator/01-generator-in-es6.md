# ES6 惊现 Generator

在 ES6 出现之前，基本都是各式各样类似`Promise`的解决方案来处理异步操作的代码逻辑，但是 ES6 的`Generator`却给异步操作又提供了新的思路，马上就有人给出了如何用`Generator`来更加优雅的处理异步操作。

## 本节内容概述

- `Generator`简介
- `Generator`最终如何处理异步操作
- 接下来...

## `Generator`简介

先来一段最基础的`Generator`代码

```javascript
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
```

在 nodejs 环境执行这段代码，打印出来的数据都在代码注释中了，也可以自己去试试。将这段代码简单分析一下吧

- 定义`Generator`时，需要使用`function*`，其他的和定义函数一样。内部使用`yield`，至于`yield`的用处以后再说
- 执行`var h = Hello()`生成一个`Generator`对象，经验验证`typeof h`发现不是普通的函数
- 执行`Hello()`之后，`Hello`内部的代码不会立即执行，而是出于一个**暂停**状态
- 执行第一个`h.next()`时，会激活刚才的暂停状态，开始执行`Hello`内部的语句，但是，直到遇到`yield`语句。一旦遇到`yield`语句时，它就会将`yield`后面的表达式执行，并返回执行的结果，然后又立即进入**暂停**状态。
- 因此第一个`console.log(h.next())`打印出来的是`{ value: 100, done: false }`，`value`是第一个`yield`返回的值，`done: false`表示目前处于暂停状态，尚未执行结束，还可以再继续往下执行。
- 执行第二个`h.next()`和第一个一样，不在赘述。此时会执行完第二个`yield`后面的表达式并返回结果，然后再次进入**暂停**状态
- 执行第三个`h.next()`时，程序会打破暂停状态，继续往下执行，但是遇到的不是`yield`而是`return`。这就预示着，即将执行结束了。因此最后返回的是`{ value: 300, done: true }`，`done: true`表示执行结束，无法再继续往下执行了。
- 再去执行第四次`h.next()`时，就只能得到`{ value: undefined, done: true }`，因为已经结束，没有返回值了。

一口气分析下来，发现并不是那么简单，虽然这只是一个最最简单的`Generator`入门代码 ———— 可见`Generator`的学习成本多高 ———— 但是一旦学会，那将受用无穷！别着急，跟着我的节奏慢慢来，一行一行代码看，你会很快深入了解`Genarator`

但是，你要详细看一下上面的所有步骤，争取把我写的每一步都搞明白。如果搞不明白细节，至少要明白以下几个要点：

- `Generator`不是函数，不是函数，不是函数
- `Hello()`不会立即出发执行，而是一上来就暂停
- 每次`h.next()`都会打破暂停状态去执行，直到遇到下一个`yield`或者`return`
- 遇到`yield`时，会执行`yeild`后面的表达式，并返回执行之后的值，然后再次进入暂停状态，此时`done: false`。
- 遇到`return`时，会返回值，执行结束，即`done: true`
- 每次`h.next()`的返回值永远都是`{value: ... , done: ...}`的形式


## `Generator`最终如何处理异步操作

上面只是一个最基本最简单的介绍，但是我们看不到任何与异步操作相关的事情，那我们接下来就先展示一下最终我们将使用`Generator`如何做异步操作。

之前讲解`Promise`时候，依次读取多个文件，我们是这么操作的（看不明白的需要回炉重造哈），主要是使用`then`做链式操作。

```javascript
readFilePromise('some1.json').then(data => {
    console.log(data)  // 打印第 1 个文件内容
    return readFilePromise('some2.json')
}).then(data => {
    console.log(data)  // 打印第 2 个文件内容
    return readFilePromise('some3.json')
}).then(data => {
    console.log(data)  // 打印第 3 个文件内容
    return readFilePromise('some4.json')
}).then(data=> {
    console.log(data)  // 打印第 4 个文件内容
})
```

而如果学会`Generator`那么读取多个文件就是如下这样写。先不要管如何实现的，光看一看代码，你就能比较出哪个更加简洁、更加易读、更加所谓的优雅！

```javascript
co(function* () {
    const r1 = yield readFilePromise('some1.json')
    console.log(r1)  // 打印第 1 个文件内容
    const r2 = yield readFilePromise('some2.json')
    console.log(r2)  // 打印第 2 个文件内容
    const r3 = yield readFilePromise('some3.json')
    console.log(r3)  // 打印第 3 个文件内容
    const r4 = yield readFilePromise('some4.json')
    console.log(r4)  // 打印第 4 个文件内容
})
```

不过，要学到这一步，还需要很长的路要走。不过不要惊慌，也不要请如来佛祖，跟着我的节奏来，认真看，一天包教包会是没问题的！

## 接下来...

接下来我们不会立刻讲解如何使用`Generator`做异步操作，而是看一看`Generator`是一个什么东西！说来话长，这要从 ES6 的另一个概念`Iterator`说起。

## 求打赏

如果你看完了，感觉还不错，欢迎给我打赏 ———— 以激励我更多输出优质内容

![](http://images2015.cnblogs.com/blog/138012/201702/138012-20170228112237798-1507196643.png)