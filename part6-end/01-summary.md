# 总结

一周左右的业余时间总结完，写完，也是累得我够呛。不算什么体力活，但是天天的坐在书桌旁写这些东西也是很考验一个人的定力，没点耐性是肯定不行的 ———— 这算是获奖感言吗 😂

## 本节内容概述

- 基础知识不可忽略
- 异步操作代码的变化
- 写在最后

## 础知识不可忽略

这里的基础知识分为两部分，都不能忽略，都需要深入研究和思考

- 什么是异步，异步的实现原理，event-loop，以及和事件绑定的关系。这些在最初介绍时，都讲过，不要看完了就忘记了；
- 无论异步操作的写法如何变化，JS 还是单线程、异步执行的语言，`callback`一直都存在而且发挥作用，这个在此前的章节一直强调；

## 异步操作代码的变化

最后我们来感受一下，从一开始`callback`方式到后来的`async-await`方式，前前后后编写异步代码的变化。从变化中就可以体会到，确实越来越简洁，越来越易读。

**`callback`方式**

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

**`Promise`方式**

```javascript
readFilePromise('some1.json').then(data => {
    return readFilePromise('some2.json')
}).then(data => {
    return readFilePromise('some3.json')
}).then(data => {
    return readFilePromise('some4.json')
})
```

**`Generator`方式**

```javascript
co(function* () {
    const r1 = yield readFilePromise('some1.json')
    const r2 = yield readFilePromise('some2.json')
    const r3 = yield readFilePromise('some3.json')
    const r4 = yield readFilePromise('some4.json')
})
```

**`async-await`方式**

```javascript
const readFileAsync = async function () {
    const f1 = await readFilePromise('data1.json')
    const f2 = await readFilePromise('data2.json')
    const f3 = await readFilePromise('data3.json')
    const f4 = await readFilePromise('data4.json')
}
```

## 写在最后

写到这里，也没啥可写的了，这里希望大家多多按照自己的思路来思考问题吧。最后，欢迎扫码转账给我打赏，哈哈！

## 求打赏

如果你看完了，感觉还不错，欢迎给我打赏 ———— 以激励我更多输出优质内容

![](http://images2015.cnblogs.com/blog/138012/201702/138012-20170228112237798-1507196643.png)
