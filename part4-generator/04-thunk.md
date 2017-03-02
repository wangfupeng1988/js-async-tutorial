# Thunk 函数

要想让`Generator`和异步操作产生联系，就必须过`thunk`函数这一关。这一关过了之后，立即就可以着手异步操作的事情，因此大家再坚持坚持。至于`thunk`函数是什么，下文会详细演示。

本节演示的代码可参考[这里](./test.js)

## 本节内容概述

- 一个普通的异步函数
- 封装成一个`thunk`函数
- `thunk`函数的特点
- 使用`thunkify`库
- 接下来...

## 一个普通的异步函数

就用 nodejs 中读取文件的函数为例，通常都这么写

```javascript
fs.readFile('data1.json', 'utf-8', (err, data) => {
    // 获取文件内容
})
```

其实这个写法就是将三个参数都传递给`fs.readFile`这个方法，其中最后一个参数是一个`callback`函数。这种函数叫做 **多参数函数**，我们接下来做一个改造

## 封装成一个`thunk`函数

改造的代码如下所示。不过是不是感觉越改造越复杂了？不过请相信：你看到的复杂仅仅是表面的，**这一点东西变的复杂，是为了让以后更加复杂的东西变得简单**。对于个体而言，随性比较简单，遵守规则比较复杂；但是对于整体（包含很多个体）而言，大家都随性就不好控制了，而大家都遵守规则就很容易管理 ———— 就是这个道理!

```javascript
const thunk = function (fileName, codeType) {
    // 返回一个只接受 callback 参数的函数
    return function (callback) {
        fs.readFile(fileName, codeType, callback)
    }
}
const readFileThunk = thunk('data1.json', 'utf-8')
readFileThunk((err, data) => {
    // 获取文件内容
})
```

先自己看一看以上代码，应该是能看懂的，但是你可能就是看懂了却不知道这么做的意义在哪里。意义先不管，先把它看懂，意义下一节就会看到。

- 执行`const readFileThunk = thunk('data1.json', 'utf-8')`返回的其实是一个函数
- `readFileThunk`这个函数，只接受一个参数，而且这个参数是一个`callback`函数

## `thunk`函数的特点

就上上面的代码，我们经过对传统的异步操作函数进行封装，**得到一个只有一个参数的函数，而且这个参数是一个`callback`函数，那这就是一个`thunk`函数**。就像上面代码中`readFileThunk`一样。

## 使用`thunkify`库

上面代码的封装，是我们手动来做的，但是没遇到一个情况就需要手动做吗？在这个开源的时代当让不会这样，直接使用第三方的`thunkify`就好了。

首先要安装`npm i thunkify --save`，然后在代码的最上方引用`const thunkify = require('thunkify')`。最后，上面我们手动写的代码，完全可以简化成这几行，非常简单！

```javascript
const thunk = thunkify(fs.readFile)
const readFileThunk = thunk('data1.json', 'utf-8')
readFileThunk((err, data) => {
    // 获取文件内容
})
```

## 接下来...

了解了`thunk`函数，我们立刻就将`Generator`和异步操作进行结合

## 求打赏

如果你看完了，感觉还不错，欢迎给我打赏 ———— 以激励我更多输出优质内容

![](http://images2015.cnblogs.com/blog/138012/201702/138012-20170228112237798-1507196643.png)