# koa 中使用 Generator

[koa](https://github.com/koajs/koa) 是一个 nodejs 开发的 web 框架，所谓 web 框架就是处理 http 请求的。开源的 nodejs 开发的 web 框架最初是 [express](https://github.com/expressjs/express)。

我们此前说过，既然是处理 http 请求，是一种网络操作，肯定就会用到异步操作。express 使用的异步操作是传统的`callbck`，而 koa 用的是我们刚刚讲的`Generator`（koa `v1.x`用的是`Generator`，已经被广泛使用，而 koa `v2.x`用到了 ES7 中的`async-await`，不过因为 ES7 没有正式发布，所以 koa `v2.x`也没有正式发布，不过可以试用）

koa 是由 express 的原班开发人员开发的，比 express 更加简洁易用，**因此 koa 是目前最为推荐的 nodejs web 框架**。阿里前不久就依赖于 koa 开发了自己的 nodejs web 框架 [egg](https://github.com/eggjs/egg)

国内可以通过[koa.bootcss.com](http://koa.bootcss.com/)查阅文档，*不过这网站依赖了 Google 的服务，因此如果不科学上网，估计会访问会很慢*。

**提醒：如果你是初学`Generator`而且从来没有用过 koa ，那么这一节你如果看不懂，没有问题。看不懂就不要强求，可以忽略，继续往下看！**

本节演示的代码可参考[这里](./test.js)

## 本节内容概述

- koa 中如何应用`Generator`
- koa 的这种应用机制是如何实现的
- 接下来...

## koa 中如何应用`Generator`

koa 是一个 web 框架，处理 http 请求，但是这里我们不去管它如何处理 http 请求，而是直接关注它使用`Genertor`的部分————**中间件**。

例如，我们现在要用 3 个`Generator`输出`12345`，我们如下代码这么写。应该能看明白吧？看不明白回炉重造！

```javascript
let info = ''
function* g1() {
    info += '1'  // 拼接 1
    yield* g2()  // 拼接 234
    info += '5'  // 拼接 5
}
function* g2() {
    info += '2'  // 拼接 2
    yield* g3()  // 拼接 3
    info += '4'  // 拼接 4
}
function* g3() {
    info += '3'  // 拼接 3
}

var g = g1()
g.next()
console.log(info)  // 12345
```

但是如果用 koa 的 **中间件** 的思路来做，就需要如下这么写。

```javascript
app.use(function *(next){
    this.body = '1';
    yield next;
    this.body += '5';
    console.log(this.body);
});
app.use(function *(next){
    this.body += '2';
    yield next;
    this.body += '4';
});
app.use(function *(next){
    this.body += '3';
});
```

解释几个关键点

- `app.use()`中传入的每一个`Generator`就是一个 **中间件**，中间件按照传入的顺序排列，顺序不能乱
- 每个中间件内部，`next`表示下一个中间件。`yield next`就是先将程序暂停，先去执行下一个中间件，等`next`被执行完之后，再回过头来执行当前代码的下一行。**因此，koa 的中间件执行顺序是一种[洋葱圈模型](https://eggjs.org/zh-cn/intro/egg-and-koa.html#midlleware)，不过这里看不懂也没问题**。
- 每个中间件内部，`this`可以共享变量。即第一个中间件改变了`this`的属性，在第二个中间件中可以看到效果。

## koa 的这种应用机制是如何实现的

前方高能————上面介绍 koa 的中间价估计有些新人就开始蒙圈了，不过接下来还有更加有挑战难度的，就是以上这种方式是如何实现的。你就尽量去看，看懂了更好，看不懂也没关系————当然，你完全可以选择跳过本教程直接去看下一篇，这都 OK

加入我们自己实现一个简单的 koa ———— MyKoa ，那么仅需要几十行代码就可以搞定上面的问题。直接写代码，注意看重点部分的注释

```javascript
class MyKoa extends Object {
    constructor(props) {
        super(props);
        
        // 存储所有的中间件
        this.middlewares = []
    }

    // 注入中间件
    use (generator) {
        this.middlewares.push(generator)
    }

    // 执行中间件
    listen () {
        this._run()
    }

    _run () {
        const ctx = this
        const middlewares = ctx.middlewares
        co(function* () {
            let prev = null
            let i = middlewares.length
            //从最后一个中间件到第一个中间件的顺序开始遍历
            while (i--) {
                // ctx 作为函数执行时的 this 才能保证多个中间件中数据的共享
                //prev 将前面一个中间件传递给当前中间件，才使得中间件里面的 next 指向下一个中间件
                prev = middlewares[i].call(ctx, prev);
            }
            //执行第一个中间件
            yield prev;
        })
    }
}
```

最后我们执行代码实验一下效果

```javascript
var app = new MyKoa();
app.use(function *(next){
    this.body = '1';
    yield next;
    this.body += '5';
    console.log(this.body);  // 12345
});
app.use(function *(next){
    this.body += '2';
    yield next;
    this.body += '4';
});
app.use(function *(next){
    this.body += '3';
});
app.listen();
```

## 接下来...

`Generator`的应用基本讲完，从一开始的基础到后面应用到异步操作，再到本节的高级应用 koa ，算是比较全面了。接下来，我们要再回到最初的起点，探讨`Generator`的本质，以及它和`callback`的关系。

还是那句话，搞明白原理，才能用的更加出色！

## 求打赏

如果你看完了，感觉还不错，欢迎给我打赏 ———— 以激励我更多输出优质内容

![](http://images2015.cnblogs.com/blog/138012/201702/138012-20170228112237798-1507196643.png)