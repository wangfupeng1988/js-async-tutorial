# jQuery promise

上一节通过一些代码演示，知道了 jquery 的`deferred`对象是解决了异步中`callback`函数的问题，但是

## 本节内容概述

- 返回`promise`
- 返回`promise`的好处
- promise 的概念

## 返回`promise`

我们对上一节的的代码做一点小小的改动，只改动了一行，下面注释。

```javascript
function waitHandle() {
    var dtd = $.Deferred()
    var wait = function (dtd) {
        var task = function () {
            console.log('执行完成')
            dtd.resolve()
        }
        setTimeout(task, 2000)
        return dtd.promise()  // 注意，这里返回的是 primise 而不是直接返回 deferred 对象
    }
    return wait(dtd)
}

var w = waitHandle() // 经过上面的改动，w 接收的就是一个 promise 对象
$.when(w)
 .then(function () {
    console.log('ok 1')
 })
 .then(function () {
    console.log('ok 2')
 })
```

改动的一行在这里`return dtd.promise()`，之前是`return dtd`。`dtd`是一个`deferred`对象，而`dtd.promise`就是一个`promise`对象。

`promise`对象和`deferred`对象最重要的区别，记住了————**`promise`对象相比于`deferred`对象，缺少了`.resolve`和`.reject`这俩函数属性**。这么一来，可就完全不一样了。

上一节我们提到一个问题，就是在程序的最后一行加一句`w.reject()`会导致乱套，你现在再在最后一行加`w.reject()`试试 ———— 保证乱套不了 ———— 而是你的程序不能执行，直接报错。因为，`w`是`promise`对象，不具备`.reject`属性。

## 返回`promise`的好处

上一节提到`deferred`对象有两组属性函数，而且提到应该把这两组彻底分开。现在通过上面一行代码的改动，就分开了。

- `waitHandle`函数内部，使用`dtd.resolve()`来该表状态，做主动的修改操作
- `waitHandle`最终返回`promise`对象，只能去被动监听变化（`then`函数），而不能去主动修改操作

一个“主动”一个“被动”，完全分开了。

## promise 的概念

jquery v1.5 版本发布时间距离现在（2017年初春）已经老早之前了，那会儿大家网页标配都是 jquery 。无论里面的`deferred`和`promise`这个概念和想法最早是哪位提出来的，但是最早展示给全世界开发者的是 jquery ，这算是`Promise`这一概念最先的提出者。

其实本次课程主要是给大家分析 ES6 的`Promise` `Generator`和`async-await`，但是为何要从 jquery 开始（大家现在用 jquery 越来越少）？就是要给大家展示一下这段历史的一些起点和发展的知识。有了这些基础，你再去接受最新的概念会非常容易，因为所有的东西都是从最初顺其自然发展进化而来的，我们要去用一个发展进化的眼光学习知识，而不是死记硬背。

## 求打赏

如果你看完了，感觉还不错，欢迎给我打赏 ———— 以激励我更多输出优质内容

![](http://images2015.cnblogs.com/blog/138012/201702/138012-20170228112237798-1507196643.png)
