# Iterator 遍历器

ES6 中引入了很多此前没有但是却非常重要的概念，`Iterator`就是其中一个。`Iterator`对象是一个指针对象，实现类似于单项链表的数据结构，通过`next()`将指针指向下一个节点 ———— 这里也就是先简单做一个概念性的介绍，后面将通过实例为大家演示。

本节演示的代码可参考[这里](./test.js)

## 本节内容概述

- 简介`Symbol`数据类型
- 具有`[Symbol.iterator]`属性的数据类型
- 生成`Iterator`对象
- `Generator`返回的也是`Iterator`对象
- 接下来...

## 简介`Symbol`数据类型

`Symbol`是一个特殊的数据类型，和`number` `string`等并列，详细的教程可参考[阮一峰老师 ES6 入门的 Symbol 篇](http://es6.ruanyifeng.com/#docs/symbol)。先看两句程序

```javascript
console.log(Array.prototype.slice)  // [Function: slice]
console.log(Array.prototype[Symbol.iterator])  // [Function: values]
```

数组的`slice`属性大家都比较熟悉了，就是一个函数，可以通过`Array.prototype.slice`得到。这里的`slice`是一个字符串，但是我们获取`Array.prototype[Symbol.iterator]`可以得到一个函数，只不过这里的`[Symbol.iterator]`是`Symbol`数据类型，不是字符串。但是没关系，`Symbol`数据类型也可以作为对象属性的`key`。如下：

```javascript
var obj = {}
obj.a = 100
obj[Symbol.iterator] = 200
console.log(obj)  // {a: 100, Symbol(Symbol.iterator): 200}
```

在此小节中，你只需要知道`[Symbol.iterator]`是一个特殊的数据类型`Symbol`类型，但是也可以像`number` `string`类型一样，作为对象的属性`key`来使用

## 原生具有`[Symbol.iterator]`属性的数据类型

在 ES6 中，原生具有`[Symbol.iterator]`属性数据类型有：数组、某些类似数组的对象（如`arguments`、`NodeList`）、`Set`和`Map`。其中，`Set`和`Map`也是 ES6 中新增的数据类型。

```javascript
// 数组
console.log([1, 2, 3][Symbol.iterator])  // function values() { [native code] }
// 某些类似数组的对象，NoeList
console.log(document.getElementsByTagName('div')[Symbol.iterator])  // function values() { [native code] }
```

原生具有`[Symbol.iterator]`属性数据类型有一个特点，就是可以使用`for...of`来取值，例如

```javascript
var item
for (item of [100, 200, 300]) {
    console.log(item)
}
// 打印出：100 200 300 
// 注意，这里每次获取的 item 是数组的 value，而不是 index ，这一点和 传统 for 循环以及 for...in 完全不一样
```

而具有`[Symbol.iterator]`属性的对象，都可以一键生成一个`Iterator`对象。如何生成以及生成之后什么样子，还有生成之后的作用，下文分解。

不要着急，也不要跳过本文的任何步骤，一步一步跟着我的节奏来看。

## 生成`Iterator`对象

定义一个数组，然后生成数组的`Iterator`对象

```javascript
const arr = [100, 200, 300]
const iterator = arr[Symbol.iterator]()  // 通过执行 [Symbol.iterator] 的属性值（函数）来返回一个 iterator 对象
```

好，现在生成了`iterator`，那么该如何使用它呢 ———— 有两种方式：`next`和`for...of`。

先说第一种，`next`

```javascript
console.log(iterator.next())  // { value: 100, done: false }
console.log(iterator.next())  // { value: 200, done: false }
console.log(iterator.next())  // { value: 300, done: false }
console.log(iterator.next())  // { value: undefined, done: true }
```

看到这里，再结合上一节内容，是不是似曾相识的感觉？(额，没有的话，那你就回去重新看上一节的内容吧) `iterator`对象可以通过`next()`方法逐步获取每个元素的值，以`{ value: ..., done: ... }`形式返回，`value`就是值，`done`表示是否到已经获取完成。

再说第二种，`for...of`

```javascript
let i
for (i of iterator) {
    console.log(i)
}
// 打印：100 200 300 
```

上面使用`for...of`遍历`iterator`对象，可以直接将其值获取出来。这里的“值”就对应着上面`next()`返回的结果的`value`属性

## `Generator`返回的也是`Iterator`对象

看到这里，你大体也应该明白了，上一节演示的`Generator`，就是生成一个`Iterator`对象。因此才会有`next()`，也可以通过`for...of`来遍历。拿出上一节的例子再做一次演示：

```javascript
function* Hello() {
    yield 100
    yield (function () {return 200})()
    return 300 
}
const h = Hello()
console.log(h[Symbol.iterator])  // [Function: [Symbol.iterator]]
```

执行`const h = Hello()`得到的就是一个`iterator`对象，因为`h[Symbol.iterator]`是有值的。既然是`iterator`对象，那么就可以使用`next()`和`for...of`进行操作

```javascript
console.log(h.next())  // { value: 100, done: false }
console.log(h.next())  // { value: 200, done: false }
console.log(h.next())  // { value: 300, done: false }
console.log(h.next())  // { value: undefined, done: true }

let i
for (i of h) {
    console.log(i)
}
```

## 接下来...

这一节我们花费很大力气，从`Iterator`又回归到了`Generator`，目的就是为了看看`Generator`到底是一个什么东西。了解其本质，才能更好的使用它，否则总有一种抓瞎的感觉。

接下来我们就`Generator`具体有哪些使用场景。

## 求打赏

如果你看完了，感觉还不错，欢迎给我打赏 ———— 以激励我更多输出优质内容

![](http://images2015.cnblogs.com/blog/138012/201702/138012-20170228112237798-1507196643.png)