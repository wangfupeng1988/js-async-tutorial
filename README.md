# 深入理解 JavaScript 异步

## 前言

2014年秋季写完了《[深入理解javascript原型和闭包系列](http://www.cnblogs.com/wangfupeng1988/p/4001284.html)》，已经帮助过很多人走出了 js 原型、作用域、闭包的困惑，至今仍能经常受到好评的留言。

很早之前我就总结了**JS三座大山**这个概念（虽然没有到处宣扬），前两座（原型、作用域）已经基本讲明白，而第三座（异步）也应该做一个总结。

于是，2017年初春，我花费大约一周的业余时间来对 JS 异步做一个完整的总结，和各位同学共勉共进步！

## 目录

**part1 基础部分**

- [什么是异步](./part1-basic/01-what-is-async.md)
- [异步和 event-loop](./part1-basic/02-event-loop.md)
- [事件绑定算不算异步？](./part1-basic/03-event-bind.md)

**part2 jQuery的解决方案**

- [jQuery-1.5 之后的 ajax](./part2-jquery/01-jquery-ajax.md)
- [jQuery deferred](./part2-jquery/02-jquery-deferred.md)
- [jQuery promise](./part2-jquery/03-jquery-promise.md)

**part3 Promise**

- [Promise 加入 ES6 标准](./part3-promise/01-promise-in-es6.md)
- [Promise 在 ES6 中的具体应用](./part3-promise/02-promise-use.md)
- [对标一下 Promise/A+ 规范](./part3-promise/03-promise-standard.md)
- [Promise 真的取代 callback 了吗？](./part3-promise/04-promise-callback.md)
- [用 Q.js 库](./part3-promise/05-promise-q.md)

**part4 Generator**

- [ES6 惊现 Generator](./part4-generator/01-generator-in-es6.md)
- [Iterator 遍历器](./part4-generator/02-iterator.md)
- [带着 Iterator 来看 Generator](./part4-generator/03-iterator-for-generator.md)
- [Generator 与异步结合](./part4-generator/04-generator-for-async.md)
- [使用大名鼎鼎的 co 库](./part4-generator/05-co.md)
- [koa 中使用 Generator](./part4-generator/06-generator-for-koa.md)
- [Generator 的本质是什么？是否取代了 callback](./part4-generator/07-generator-callback.md)

**part5 async-await**

- ES7 中引入 async-await
- async-await 值不值得期待
- async-await 的本质是什么？是否取代了 callback

**最后**

- 总结


## 运行程序的说明

要求本地 node 在`v6`或以上版本，然后执行以下命令下载代码并安装依赖的插件

```shell
$ cd ~
$ git clone git@github.com:wangfupeng1988/js-async-tutorial.git
$ cd js-async-tutorial
$ npm i
```

最后，本地可能需要启动一个静态服务器来运行页面，我使用`http-server`插件

```shell
$ npm install http-server -g
$ cd js-async-tutorial
$ http-server -p 8881
```

然后浏览器访问`http://localhost:8881/xxx/xxx.html`即可

## 求打赏

如果你看完了，感觉还不错，欢迎给我打赏 ———— 以激励我更多输出优质内容

![](http://images2015.cnblogs.com/blog/138012/201702/138012-20170228112237798-1507196643.png)
