# jQuery deferred

上一节讲到 jquery v1.5 版本开始，`$.ajax`可以使用类似当前`Promise`的`then`函数以及链式操作。那么它到底是如何实现的呢？在此之前所用到的`callback`在这其中又起到了什么作用？本节给出答案

本节使用的代码参见[这里](./test.html)

## 本节内容概述

- 写一个传统的异步操作
- 使用`$.Deferred`封装
- 应用`then`方法
- 有什么问题？

## 写一个传统的异步操作

给出一段非常简单的异步操作代码，使用`setTimeout`函数。

```javascript
var wait = function () {
    var task = function () {
        console.log('执行完成')
    }
    setTimeout(task, 2000)
}
wait()
```

以上这些代码执行的结果大家应该都比较明确了，即 2s 之后打印出`执行完成`。**但是我如果再加一个需求 ———— 要在执行完成之后进行某些特别复杂的操作，代码可能会很多，而且分好几个步骤 ———— 那该怎么办？** 大家思考一下！

如果你不看下面的内容，而且目前还没有`Promise`的这个思维，那估计你会说：直接在`task`函数中写就是了！不过相信你看完下面的内容之后，会放弃你现在的想法。

## 使用`$.Deferred`封装

好，接下来我们让刚才简单的几行代码变得更加复杂。**为何要变得更加复杂？是因为让以后更加复杂的地方变得简单**。这里我们使用了 jquery 的`$.Deferred`，至于这个是个什么鬼，大家先不用关心，**只需要知道`$.Deferred()`会返回一个`deferred`对象**，先看代码，`deferred`对象的作用我们会面会说。

```javascript
function waitHandle() {
    var dtd = $.Deferred()  // 创建一个 deferred 对象

    var wait = function (dtd) {  // 要求传入一个 deferred 对象
        var task = function () {
            console.log('执行完成')
            dtd.resolve()  // 表示异步任务已经完成
        }
        setTimeout(task, 2000)
        return dtd  // 要求返回 deferred 对象
    }

    // 注意，这里一定要有返回值
    return wait(dtd)
}
```

以上代码中，又使用一个`waitHandle`方法对`wait`方法进行再次的封装。`waitHandle`内部代码，我们分步骤来分析。跟着我的节奏慢慢来，保证你不会乱。

- 使用`var dtd = $.Deferred()`创建`deferred`对象。通过上一节我们知道，一个`deferred`对象会有`done` `fail`和`then`方法（不明白的去看上一节）
- 重新定义`wait`函数，但是：第一，要传入一个`deferred`对象（`dtd`参数）；第二，当`task`函数（即`callback`）执行完成之后，要执行`dtd.resolve()`告诉传入的`deferred`对象，革命已经成功。第三；将这个`deferred`对象返回。
- 返回`wait(dtd)`的执行结果。因为`wait`函数中返回的是一个`deferred`对象（`dtd`参数），因此`wait(dtd)`返回的就是`dtd`————如果你感觉这里很乱，没关系，慢慢捋，一行一行看，相信两三分钟就能捋顺！

最后总结一下，`waitHandle`函数最终`return wait(dtd)`即最终返回`dtd`（一个`deferred`）对象。针对一个`deferred`对象，它有`done` `fail`和`then`方法（上一节说过），它还有`resolve()`方法（其实和`resolve`相对的还有一个`reject`方法，后面会提到）


## 应用`then`方法

接着上面的代码继续写

```javascript
var w = waitHandle()
w.then(function () {
    console.log('ok 1')
}, function () {
    console.log('err 1')
}).then(function () {
    console.log('ok 2')
}, function () {
    console.log('err 2')
})
```

上面已经说过，`waitHandle`函数最终返回一个`deferred`对象，而`deferred`对象具有`done` `fail` `then`方法，现在我们正在使用的是`then`方法。至于`then`方法的作用，我们上一节已经讲过了，不明白的同学抓紧回去补课。

执行这段代码，我们打印出来以下结果。可以将结果对标以下代码时哪一行。

```
执行完成
ok 1
ok 2
```

此时，你再回头想想我刚才说提出的需求（*要在执行完成之后进行某些特别复杂的操作，代码可能会很多，而且分好几个步骤*），是不是有更好的解决方案了？

有同学肯定发现了，代码中`console.log('err 1')`和`console.log('err 2')`什么时候会执行呢 ———— 你自己把`waitHandle`函数中的`dtd.resolve()`改成`dtd.reject()`试一下就知道了。

- `dtd.resolve()` 表示革命已经成功，会触发`then`中第一个参数（函数）的执行，
- `dtd.reject()` 表示革命失败了，会触发`then`中第二个参数（函数）执行

## 有什么问题？

总结一下一个`deferred`对象具有的函数属性，并分为两组：

- `dtd.resolve` `dtd.reject`
- `dtd.then` `dtd.done` `dtd.fail`

我为何要分成两组 ———— 这两组函数，从设计到执行之后的效果是完全不一样的。第一组是主动触发用来改变状态（成功或者失败），第二组是状态变化之后才会触发的监听函数。

既然是完全不同的两组函数，就应该彻底的分开，否则很容易出现问题。例如，你在刚才执行代码的最后加上这么一行试试。

```javascript
w.reject()
```

那么如何解决这一个问题？请听下回分解！

## 求打赏

如果你看完了，感觉还不错，欢迎给我打赏 ———— 以激励我更多输出优质内容

![](http://images2015.cnblogs.com/blog/138012/201702/138012-20170228112237798-1507196643.png)

