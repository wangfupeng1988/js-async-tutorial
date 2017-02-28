# jQuery-1.5 之后的 ajax

`$.ajax`这个函数各位应该都比较熟悉了，要完整的讲解 js 的异步操作，就必须先从`$.ajax`这个方法说起。

想要学到全面的知识，大家就不要着急，跟随我的节奏来，并且相信我。我安排的内容，肯定都是有用的，对主题无用的东西，我不会拿来占用大家的时间。

## 本节内容概述

- 传统的`$.ajax`
- 1.5 版本之后的`$.ajax`
- 改进之后的好处
- 和后来的`Promise`的关系
- 如何实现的？

## 传统的`$.ajax`

先来一段最常见的`$.ajax`的代码，当然是使用万恶的`callback`方式

```javascript
var ajax = $.ajax({
    url: 'data.json',
    success: function () {
        console.log('success')
    },
    error: function () {
        console.log('error')
    }
})

console.log(ajax) // 返回一个 XHR 对象

```

至于这么做会产生什么样子的诟病，我想大家应该都很明白了。不明白的自己私下去查，但是你也可以继续往下看，你只需要记住这样做很不好就是了，要不然 jquery 也不会再后面进行改进

## 1.5 版本之后的`$.ajax`

但是从`v1.5`开始，以上代码就可以这样写了：可以链式的执行`done`或者`fail`方法

```javascript
var ajax = $.ajax('data.json')
ajax.done(function () {
        console.log('success 1')
    })
    .fail(function () {
        console.log('error')
    })
    .done(function () {
         console.log('success 2')
    })

console.log(ajax) // 返回一个 deferred 对象
```

大家注意看以上两段代码中都有一个`console.log(ajax)`，但是返回值是完全不一样的。

- `v1.5`之前，返回的是一个`XHR`对象，这个对象不可能有`done`或者`fail`的方法的
- `v1.5`开始，返回一个`deferred`对象，这个对象就带有`done`和`fail`的方法，并且是等着请求返回之后再去调用

## 改进之后的好处

这是一个标志性的改造，不管这个概念是谁最先提出的，它在 jquery 中首先大量使用并让全球开发者都知道原来 ajax 请求还可以这样写。这为以后的`Promise`标准制定提供了很大意义的参考，你可以以为这就是后面`Promise`的原型。

记住一句话————**虽然 JS 是异步执行的语言，但是人的思维是同步的**————因此，开发者总是在寻求如何使用逻辑上看似同步的代码来完成 JS 的异步请求。而 jquery 的这一次更新，让开发者在一定程度上得到了这样的好处。

之前无论是什么操作，我都需要一股脑写到`callback`中，现在不用了。现在成功了就写到`done`中，失败了就写到`fail`中，如果成功了有多个步骤的操作，那我就写很多个`done`，然后链式连接起来就 OK 了。

## 和后来的`Promise`的关系

以上的这段代码，我们还可以这样写。即不用`done`和`fail`函数，而是用`then`函数。`then`函数的第一个参数是成功之后执行的函数（即之前的`done`），第二个参数是失败之后执行的函数（即之前的`fail`）。而且`then`函数还可以链式连接。

```javascript
var ajax = $.ajax('data.json')
ajax.then(function () {
        console.log('success 1')
    }, function () {
        console.log('error 1')
    })
    .then(function () {
        console.log('success 2')
    }, function () {
        console.log('error 2')
    })
```

如果你对现在 ES6 的`Promise`有了解，应该能看出其中的相似之处。不了解也没关系，你只需要知道它已经和`Promise`比较接近了。后面马上会去讲`Promise`

## 如何实现的？

明眼人都知道，jquery 不可能改变异步操作需要`callback`的本质，它只不过是自己定义了一些特殊的 API，并对异步操作的`callback`进行了封装而已。

那么 jquery 是如何实现这一步的呢？请听下回分解！

## 求打赏

如果你看完了，感觉还不错，欢迎给我打赏 ———— 以激励我更多输出优质内容

![](http://images2015.cnblogs.com/blog/138012/201702/138012-20170228112237798-1507196643.png)