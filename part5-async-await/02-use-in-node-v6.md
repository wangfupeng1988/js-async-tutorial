# 如何在 nodejs `v6.x`版本中使用 async-await

本节介绍一下如何使用`babel`来让 node `v6` 版本也能运行`async-await`

## 本节内容概述

- 安装必要的插件
- 创建入口文件并执行

## 安装必要的插件

运行`npm i babel-core babel-plugin-transform-runtime babel-preset-es2015 babel-preset-stage-3 babel-runtime --save`安装一堆需要的插件。

然后在项目根目录创建`.babelrc`文件，文件内容编写为

```json
{
  "presets": ["stage-3", "es2015"],
  "plugins": ["transform-runtime"]
}
```

## 创建入口文件并执行

加入你编写`async-await`的代码文件是`test.js`，那么你需要创建另一个文件，例如`test-entry.js`作为入口文件。入口文件内容编写为

```javascript
require("babel-core/register");
require("./test.js");
```

然后直接运行`node test-entry.js`就可以了

## 求打赏

如果你看完了，感觉还不错，欢迎给我打赏 ———— 以激励我更多输出优质内容

![](http://images2015.cnblogs.com/blog/138012/201702/138012-20170228112237798-1507196643.png)