# Generator 的本质是什么？是否取代了 callback

其实标题中的问题，是一个伪命题，因为`Generator`和`callback`根本没有任何关系，只是我们通过一些方式（而且是很复杂的方式）强行将他俩产生了关系，才会有现在的`Generator`处理异步。

## 本节内容概述

- `Generator`的本质
- 和`callback`的结合

## `Generator`的本质

介绍`Generator`的[第一节](./01-generator-in-es6.md)中，多次提到 **暂停** 这个词 ———— **“暂停”才是`Generator`的本质** ———— 只有`Generator`能让一段程序执行到指定的位置先暂停，然后再启动，再暂停，再启动。

而这个 **暂停** 就很容易让它和异步操作产生联系，因为我们在处理异步操作时，即需要一种“开始读取文件，然后**暂停**一下，等着文件读取完了，再干嘛干嘛...”这样的需求。因此将`Generator`和异步操作联系在一起，并且产生一些比较简明的解决方案，这是顺其自然的事儿，大家要想明白这个道理。

不过，**JS 还是 JS，单线程还是单线程，异步还是异步，`callback`还是`callback`。这一切都不会因为有一个`Generator`而有任何变化**。

## 和`callback`的结合

之前在介绍`Promise`的最后，拿`Promise`和`callback`做过一些比较，最后发现`Promise`其实是利用了`callback`才能实现的。而这里，**`Generator`也必须利用`callback`才能实现**。

拿介绍`co`时的代码举例（代码如下），如果`yield`后面用的是`thunk`函数，那么`thunk`函数需要的就是一个`callback`参数。如果`yield`后面用的是`Promise`对象，`Promise`和`callback`的联系之前已经介绍过了。

```javascript
co(function* () {
    const r1 = yield readFilePromise('some1.json')
    console.log(r1)  // 打印第 1 个文件内容
    const r2 = yield readFileThunk('some2.json')
    console.log(r2)  // 打印第 2 个文件内容
})
```

因此，`Generator`离不开`callback`，`Promise`离不开`callback`，异步也离不开`callback`。

## 求打赏

如果你看完了，感觉还不错，欢迎给我打赏 ———— 以激励我更多输出优质内容

![](http://images2015.cnblogs.com/blog/138012/201702/138012-20170228112237798-1507196643.png)