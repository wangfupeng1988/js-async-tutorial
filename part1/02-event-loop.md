# 异步和 event-loop

提到异步，就必须提 event-loop 。event-loop 中文翻译叫做“时间轮询”，它是能体现出单线程中异步操作是如何被执行的。

首先，**强烈大家观看一个歪果仁的视频《[what the hack is event loop](http://www.tudou.com/programs/view/ACDNKZJm6pQ/)》**，只有不到半个小时的时间，但是将的非常详细。*如果那个链接失效，访问[这里](http://pan.baidu.com/s/1c1E0rjM)（密码: xx9f）*

其次，再结合阮一峰老师的《[什么是event loop](http://www.ruanyifeng.com/blog/2013/10/event_loop.html)》一起看一下。将这两个看完就基本了解 event loop 了

最后，event-loop 是一块内容比较独立的技术性知识，它是什么样子就是什么样子，讲解起来可变通性非常小。因此，本节说一下我对 event-loop 的理解和体会

## 本节内容概述

- 举例说明
- 核心概念
- 思考两个问题

## 举例说明

给出一段简单的 js 代码

```javascript
console.log('line 1')
setTimeout(console.log, 1000, 'line 2')
console.log('line 3')
```

以上一共三行代码，该程序被执行的时候，会依次挨行执行，这被称作 **main-stack** 。

- 第一步，执行第一行，将结果`line 1`打印出来
- 第二步，执行第二行，注意此时会将这个操作暂时存储在一个叫做 **call-stack** 的内存地址中，因为`setTimeout`是一个异步执行操作。
- 第三步，执行第三行，将结果`line 2`打印出出来
- 第四步，等待 **main-stack** 的程序（一共三行）都全部执行完了，然后立马实时查看 **call-stack** 中是否还有未执行的异步回调，如果有（1000ms 之后）则把它拿到主线程中来执行
- 第五步，主线程又被执行完了，再实时查看 **call-stack** 中是否还有未执行的异步回调。

以上只拿了`setTimeout`举例子，但是对于网络请求、IO操作、事件绑定道理都是一样的。**如果我讲的简单例子你还是看不懂，一定要去看文章最初提到的《what the hack is event loop》视频，重要重要！！！**

## 核心概念

理解 event-loop 的核心概念是要明白以下几点：

- **main-stack** 和 **call-stack** 的区别
- 执行 **main-stack** 时将异步操作暂存到 **call-stack**
- **main-stack** 执行完成之后，实时检查 **call-stack** 的任务是否应该被拿到 **main-stack** 中来执行


## 思考三个问题

**第一题，以下代码的输出顺序是什么**

```javascript
setTimeout(console.log, 0, 'a')
console.log('b')
console.log('c')
```

答案是`b c a`，有疑问的需要再去看上面的介绍或者那个视频。

**第二题，以下代码中，最后输出的结果是否是 500**

```javascript
var i, t = Date.now()
for (i = 0; i < 100000000; i++) {
}
function fn() {
    console.log(Date.now() - t)  // 输出多少？？？
}
setTimeout(fn, 500)
```

答案是大于 500ms ，因为 for 函数需要花费一些时间，等 for 执行完之后再开始计算 500ms 之后执行 fn

**第三题，事件绑定是不是异步操作？**

这个问题大家根据 event-loop 的讲解和视频来思考，我们下一节再给出解答。


## 求打赏

如果你看完了，感觉还不错，欢迎给我打赏 ———— 以激励我更多输出优质内容

![](http://images2015.cnblogs.com/blog/138012/201702/138012-20170228112237798-1507196643.png)
