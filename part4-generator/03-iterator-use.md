# Generator 的具体应用

前面用两节的内容介绍了`Generator`可以让执行处于暂停状态，并且知道了`Generator`返回的是一个`Iterator`对象，这一节就详细介绍一下`Generator`的一些基本用法。

本节演示的代码可参考[这里](./test.js)

## 本节内容概述

- `next`和`yield`参数传递
- `for...of`的应用示例
- `yield* `语句
- `Generator`中的`this`
- 接下来...

## `next`和`yield`参数传递

我们之前已经知道，`yield`具有返回数据的功能，如下代码。`yield`后面的数据被返回，存放到返回结果中的`value`属性中。这算是一个方向的参数传递。

```javascript
function* G() {
    yield 100
}
const g = G()
console.log( g.next() ) // {value: 100, done: false}
```

还有另外一个方向的参数传递，就是`next`向`yield`传递，如下代码。

```javascript
function* G() {
    const a = yield 100
    console.log('a', a)  // a aaa
    const b = yield 200
    console.log('b', b)  // b bbb
    const c = yield 300
    console.log('c', c)  // c ccc
}
const g = G()
g.next()    // value: 100, done: false
g.next('aaa') // value: 200, done: false
g.next('bbb') // value: 300, done: false
g.next('ccc') // value: undefined, done: true
```

捋一捋上面代码的执行过程：

- 执行第一个`g.next()`时，为传递任何参数，返回的`{value: 100, done: false}`，这个应该没有疑问
- 执行第二个`g.next('aaa')`时，传递的参数是`'aaa'`，这个`'aaa'`就会被赋值到`G`内部的`a`标量中，然后执行`console.log('a', a)`打印出来，最后返回`{value: 200, done: false}`
- 执行第三个、第四个时，道理都是完全一样的，大家自己捋一捋。

**有一个要点需要注意，就`g.next('aaa')`是将`'aaa'`传递给上一个已经执行完了的`yield`语句前面的变量，而不是即将执行的`yield`前面的变量**。这句话要能看明白，看不明白就说明刚才的代码你还没看懂，继续看。

## `for...of`的应用示例

针对`for...of`在`Iterator`对象的操作之前已经介绍过了，不过这里用一个非常好的例子来展示一下。用简单几行代码实现斐波那契数列。通过之前学过的`Generator`知识，应该不难解读这份代码。

```javascript
function* fibonacci() {
    let [prev, curr] = [0, 1]
    for (;;) {
        [prev, curr] = [curr, prev + curr]
        // 将中间值通过 yield 返回，并且保留函数执行的状态，因此可以非常简单的实现 fibonacci
        yield curr
    }
}
for (let n of fibonacci()) {
    if (n > 1000) {
        break
    }
    console.log(n)
}
```

## `yield* `语句

如果有两个`Generator`，想要在第一个中包含第二个，如下需求：

```javascript
function* G1() {
    yield 'a'
    yield 'b'
}
function* G2() {
    yield 'x'
    yield 'y'
}
```

针对以上两个`Generator`，我的需求是：一次输出`a x y b`，该如何做？有同学看到这里想起了刚刚学到的`for..of`可以实现————不错，确实可以实现（大家也可以想想到底该如何实现）

但是，这要演示一个更加简洁的方式`yield* `表达式

```javascript
function* G1() {
    yield 'a'
    yield* G2()  // 使用 yield* 执行 G2()
    yield 'b'
}
function* G2() {
    yield 'x'
    yield 'y'
}
for (let item of G1()) {
    console.log(item)
}
```

之前学过的`yield`后面会接一个普通的 JS 对象，而`yield* `后面会接一个`Generator`，而且会把它其中的`yield`按照规则来一步一步执行。**如果有多个`Generator`串联使用的话（例如`Koa`源码中），用`yield* `来操作非常方便**。

## `Generator`中的`this`

对于以下这种写法，大家可能会和构造函数创建对象的写法产生混淆，这里一定要注意 —— **Generator 不是函数，更不是构造函数**

```javascript
function* G() {}
const g = G()
```

而以下这种写法，更加不会成功。只有构造函数才会这么用，构造函数返回的是`this`，而`Generator`返回的是一个`Iterator`对象。完全是两码事，千万不要搞混了。

```javascript
function* G() {
    this.a = 10
}
const g = G()
console.log(g.a) // 报错
```

## 接下来...

本节基本介绍了`Generator`的最常见的用法，但是还是没有和咱们的最终目的————异步操作————沾上关系，而且现在看来有点八竿子打不着的关系。但是话说回来，这几节内容，你也学到了不少知识啊。

别急哈，即便是下一节，它们还不会有联系，再下一节就真相大白了。下一节我们又给出一个新概念————`Thunk`函数

## 求打赏

如果你看完了，感觉还不错，欢迎给我打赏 ———— 以激励我更多输出优质内容

![](http://images2015.cnblogs.com/blog/138012/201702/138012-20170228112237798-1507196643.png)