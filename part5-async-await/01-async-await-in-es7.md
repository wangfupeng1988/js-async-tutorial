# ES7 中引入 async-await

前面介绍完了`Generator`的异步处理，可以说是跌跌撞撞，经过各种基础介绍和封装，好容易出了一个比较简洁的异步处理方案，学习成本非常高————这显然不是我们想要的！

因此，还未发布的 ES7 就干脆自己参照`Generator`封装了一套异步处理方案————`async-await`。说是参照，其实可以理解为是`Generator`的语法糖！

本节示例代码参照[这里](./test.js)

## 本节内容概述

- `Generator`和`async-await`的对比
- 使用`async-await`的不同和好处
- 接下来...

## `Generator`和`async-await`的对比

先来一段`Generator`处理异步的代码，前面已经介绍过了，看不明白的再获取接着看。

```javascript
co(function* () {
    const r1 = yield readFilePromise('some1.json')
    console.log(r1)  // 打印第 1 个文件内容
    const r2 = yield readFilePromise('some2.json')
    console.log(r2)  // 打印第 2 个文件内容
})
```

再来一段`async-await`的执行代码如下，两者做一个比较。

```javascript
const readFilePromise = Q.denodeify(fs.readFile)

// 定义 async 函数
const readFileAsync = async function () {
    const f1 = await readFilePromise('data1.json')
    const f2 = await readFilePromise('data2.json')
    console.log('data1.json', f1.toString())
    console.log('data2.json', f2.toString())

    return 'done' // 先忽略，后面会讲到
}
// 执行
const result = readFileAsync()
```

从上面两端代码比较看来，`async function`代替了`function* `，`await`代替了`yield`，其他的再没有什么区别了。哦，还有，使用`async-await`时候不用再引用`co`这种第三方库了，直接执行即可。

## 使用`async-await`的不同和好处

第一，`await`后面不能再跟`thunk`函数，而必须跟一个`Promise`对象（因此，`Promise`才是异步的终极解决方案和未来）。跟其他类型的数据也OK，但是会直接同步执行，而不是异步。

第二，执行`const result = readFileAsync()`返回的是个`Promise`对象，而且上面代码中的`return 'done'`会直接被下面的`then`函数接收到

```javascript
result.then(data => {
    console.log(data)  // done
})
```

第三，从代码的易读性来将，`async-await`更加易读简介，也更加符合代码的语意。而且还不用引用第三方库，也无需学习`Generator`那一堆东西，使用成本非常低。

**因此，如果 ES7 正式发布了之后，强烈推荐使用`async-await`。但是现在尚未正式发布，从稳定性考虑，还是`Generator`更好一些。**

## 接下来...

node `v7` 版本已经开始原生支持`async-await`了，不过 node 的目前稳定版本还是`v6`，尚不支持，怎么办？———— 当然是万能的`babel`！下一节就介绍。

## 求打赏

如果你看完了，感觉还不错，欢迎给我打赏 ———— 以激励我更多输出优质内容

![](http://images2015.cnblogs.com/blog/138012/201702/138012-20170228112237798-1507196643.png)