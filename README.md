# 一步一步，统一项目中的编码规范（vue, vscode, vetur, prettier, eslint）
团队开发中，多人开发同一个项目，由于个人编码习惯不同，一个项目中最终的代码风格可能差别很大，所以需要通过工具进行约束来保证代码风格的统一。同时也希望通过工具尽可能的减少低级错误出现，并且能帮助修正，所以有了各种各样的 lint 和 formatter。

本篇的目标是使用 vscode 编辑器，使用 prettier 插件，结合使用 eslint 对代码进行校验和修正，并使用 eslint-config-airbnb-base 规则来实现代码风格的统一。

一般情况下，我们小公司、小 team 可能没有能力和精力来制订一套详尽规则，那么采用大厂已经制订好的规则就是很自然的选择（同时也必要争论你的好还是我的好了，人家大厂都这么干了，我们就按人家来吧！:)）

## 名词解释
* vscode
> 一个文本编辑器 https://code.visualstudio.com/
* prettier
> vscode 插件，官方的说明是：Opinionated Code Formatter
* eslint
> 代码校验和修复工具，官方说明是：The pluggable linting utility for JavaScript and JSX
* eslint-config-airbnb-base
> 一组预先定义好的 eslint 规则，官方说明是：This package provides Airbnb's base JS .eslintrc (without React plugins) as an extensible shared config.

下面一步一步，通过 vscode 的格式化的使用，到和 prettier 的结合，eslint 使用， prettier 结合 eslint 对 js 和 vue 文件校验，完成对项目代码校验和 fix，力求能以最简洁的方式把问题说清楚。

## vscode 开箱即用的 code formatter 功能
vscode 提供开箱即用的代码样式化功能（没有 css 格式化功能），下面在当前文件夹下创建测试文件：`./src/demo.html`、`./src/fun.js`、`./src/style.css`，格式化代码的快捷键是(win)：alt + shift + f

HTML 格式化前：
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>Demo page</title>
</head>
<body><h1>This is a test page</h1>
<p>Page content</p>
</body>
</html>
```
格式化后：
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Demo page</title>
</head>

<body>
    <h1>This is a test page</h1>
    <p>Page content</p>
</body>

</html>
```
JS 格式化前：
```javascript 
function getUserInfo(name) {let HelloStr = "Hello, your name is: "
return HelloStr + name
}
```
格式化后：
```javascript 
function getUserInfo(name) {
    let HelloStr = "Hello, your name is: "
    return HelloStr + name
}
```
CSS:

![CSS 文件的格式化](http://static.fuzong.wang/vscode-formatter/css-default.gif)

可以看到，CSS 文件默认情况下是不能被格式化的，这个时间轮到 prettier 登场~

## 用 prettier 对代码进行格式化
prettier 的官方解释是：
* An opinionated code formatter
* Supports many languages
* Integrates with most editors
* Has few options

它能和多种编辑器结合，对多种语言进行 format，所以 css 也不是话下。

由于 vscode 默认有格式化的功能，安装了 prettier 插件后，prettier 也有格式化的功能以会造成冲突（对于html, js），这里编辑器会提示你，可以进行配置。

![Prettier 格式化 html](http://static.fuzong.wang/vscode-formatter/prettier-html.gif)

需要注意的是，vscode 和 prettier 会有很多默认配置，可以通过 `CTRL + ,` 快捷键进入配置界面进行管理，所有修改后的结果会保存在 `settings.json` 文件里。

刚刚由于 vscode 默认的格式化程序和 prettier 冲突，经过选择后形成配置文件并写入 `settings.json`，如下：
```json
{
    "[html]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[jsonc]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
}
```
上面是指针不同类型的文件，分别指定 formatter，当然你也可以一次性指定**所有类型**文件的 formatter，修改后的配置文件 `settings.json` 如下：
```json
{
    "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```
经过如上配置， `css` 及其他类型的文件，拥有了通过 prettier 进行格式化的能力。

## 用 eslint 对 javascript 代码进行校验
经过如上配置，可以对代码进行格式化了，但是如果要想去代码风格进行校验和修复，就要用到 eslint 了，下面分两步将 eslint 功能集成了项目中：
1. 在项目内安装 eslint 及相关的包
2. 给 vscode 安装 eslint 插件

下面分别来说
### 在项目内安装 eslint 及相关的包

![安装 eslint](http://static.fuzong.wang/vscode-formatter/eslint-install.gif)

经过上面的操作，将 eslint 及相关的包安装到项目里了 `package.json`如下：
```json
{
  ...
  "dependencies": {
    "eslint-plugin-vue": "^5.2.2"
  },
  "devDependencies": {
    "eslint": "^5.16.0"
  }
  ...
}
```

项目目录下多了一个 eslint 的配置文件 `.eslintrc.js` :
```javascript
module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
    }
};
```

这个配置文件的内容，是通过 `npx eslint --init` 自动生成的，当然你也可以手动配置，所有的选项这里都有中文说明：http://eslint.cn/docs/user-guide/configuring

接下来就可以手动执行校验了：

![eslint lint](http://static.fuzong.wang/vscode-formatter/eslint-lint.gif)

在执行的时候可能会有包未安装的提示
> Failed to load plugin vue: Cannot find module 'eslint-plugin-vue'

手动安装一下就好了，从执行结果来看，funs.js 文件有一个错误提示，说明校验程序已经能正常跑进来了。

现在采用的规则是 `eslint:recommended` ，我们的目标是采用 'eslint-config-airbnb-base'，所以再安装相应的包：
```bash
npm i -D eslint-config-airbnb-base eslint-plugin-import
```
然后对 `.eslintrc.js` 进行配置：
```javascript
module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'linebreak-style': ["error", "windows"]
  },
};
```

再进行校验：
```bash
D:\works\secoo\test\code-formatter> npx eslint .\src\funs.js

D:\works\secoo\test\code-formatter\src\funs.js
  1:10  error  'getUserInfo' is defined but never used              no-unused-vars
  2:7   error  'HelloStr' is never reassigned. Use 'const' instead  prefer-const
  3:7   error  'age' is assigned a value but never used             no-unused-vars
  3:7   error  'age' is never reassigned. Use 'const' instead       prefer-const
  3:15  error  Missing semicolon                                    semi

✖ 5 problems (5 errors, 0 warnings)
  3 errors and 0 warnings potentially fixable with the `--fix` option.
```
可以看到明显比之前的错误要多，Aribnb 的规则相对较为严格，可以规避很多低级错误。

这里要重点说一下的是，我们在 `.eslintrc.js` 的 `rules` 里加了 `'linebreak-style': ["error", "windows"]`，是由于不同系统间对换行的处理不同导致的，加这个规则来处理这个问题。

### 给 vscode 安装 eslint 插件
走到这里我们已经可以校验 js 文件了，通过校验也发现了很多问题，但在 vscode里并没有错误提示，这就用到了 **`vscode`** 的另一个插件 `eslint`，安装完插件以后，在 vscode 里可以看到错误提示了：

![eslint lint](http://static.fuzong.wang/vscode-formatter/eslint-error.png)

走到这里，我们离成功已经很近啦！

## 让 pretter 根据 eslint 校验结果，对代码进行样式化
到目前为上，已经可以对 js 文件进行校验，甚至可以对 js 文件按规则进行修复了：
```bash
D:\works\secoo\test\code-formatter> npx eslint --fix .\src\funs.js

D:\works\secoo\test\code-formatter\src\funs.js
  1:10  error  'getUserInfo' is defined but never used   no-unused-vars
  3:9   error  'age' is assigned a value but never used  no-unused-vars

✖ 2 problems (2 errors, 0 warnings)
```
但是如果你用 vscode（如前述，vscode 使用 prettier） 进行修复，发现并没有应用 Airbnb 的规则，这里需要手动配置一下：
- `CTRL + ,` 打开配置界面
- 扩展 -> Prettier 里打到 Eslint Integration 并勾选
得到 vscode 的配置文件 `settings.json` 如下 
```json
{
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "prettier.eslintIntegration": true
}
```
这时再对 js 文件进行格式化，就能按照指定的规则执行了，具体操作如下：

![prettier format follow eslint](http://static.fuzong.wang/vscode-formatter/eslint-prettier-fix.gif)


## 校验并且格式化 vue 代码
这部分是最麻烦的，很多同学都在这里翻车......

首先，要想 `vscode` 认识 `vue` 文件，需要安装插件 `vetur`，基本上安装好此插件后就可以开心的撸 vue 代码了，vetur 的默认配置如下： 
```json
{
  "vetur.format.defaultFormatter.html": "prettyhtml",
  "vetur.format.defaultFormatter.css": "prettier",
  "vetur.format.defaultFormatter.postcss": "prettier",
  "vetur.format.defaultFormatter.scss": "prettier",
  "vetur.format.defaultFormatter.less": "prettier",
  "vetur.format.defaultFormatter.stylus": "stylus-supremacy",
  "vetur.format.defaultFormatter.js": "prettier",
  "vetur.format.defaultFormatter.ts": "prettier"
}
```

以上是默认配置，看着很开以的以为可以按着如下方式对代码进行格式化：
```
发出格式化命令
    |
    | next
    |
vetur 收到命令 将格式化任务转交给 prettier
    |
    | next
    |
prettier 收到命令 将格式化任务转交给 eslint
    |
    | next
    |
eslint 收到命令，将代码格式化
```

看似美好的结局被现实打破，当我们对 vue 文件进行格式化的时候，发它参考的规则是 prettier 规则，而非 eslint 规则。

如果想按着上述规则对 vue 进行格式化需要做两个事：
`settings.josn`
- 将 vetur 中 js 的 formatter 设置为 prettier-eslint
```json
{
  ...
  "vetur.format.defaultFormatter.js": "prettier-eslint"
  ...
}
```
- 安装 prettier-eslint 包
```bash
npm i -D prettier-eslint
```
对于这个问题，prettier-eslint [官网](https://github.com/prettier/prettier-eslint)上说的很清楚：
> This formats your code via prettier, and then passes the result of that to eslint --fix. This way you can get the benefits of prettier's superior formatting capabilities, but also benefit from the configuration capabilities of eslint.

但就是这么一个问题，我在网上看把无数的同学绕进去了，确实直线理解的话会有两个坑：
1. prettier 不是已经按着 eslint 来格式化 js 了吗，vetur 指给 prettier 按说没问题啊！现实是需要传递给 `prettier-eslint`
1. 很多同学跨过了第一道坎，但不曾想 `prettier-eslint` 需要手动安装一个包啊！

所以导致在最后一步走不下去了。

至此配置基本已经完成，效果如下：

![eslint-vue-fix](http://static.fuzong.wang/vscode-formatter/eslint-vue-fix.gif)


## 最后总结
最后总结一下，总共需要做那些工作
1. 安装 vscode 插件 `eslint`、 `prettier`、 `vetur`
1. 配置 eslint 规则
1. 配置 prettier ，使其按着 eslint 工作
1. 配置 vetur 

最终的配置文件如下：
settings.json
```json
{
  "extensions.autoUpdate": false,
  "eslint.validate": ["javascript", "javascriptreact", "vue"],
  "prettier.eslintIntegration": true,
  "vetur.format.defaultFormatterOptions": {
    "prettier": {
      "eslintIntegration": true
    }
  },
  "vetur.format.defaultFormatter.js": "prettier-eslint",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "vetur.format.defaultFormatter.html": "prettier"
}

```
.eslintrc.js
```javascript
module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ['airbnb-base', 'plugin:vue/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['vue'],
  rules: {
    'linebreak-style': ['error', 'windows'],
    'comma-dangle': ['error', 'never'], // 修正 eslint-plugin-vue 带来的问题
  }
};
```

参考文章：
- https://vuejs.github.io/vetur/formatting.html
- https://github.com/prettier/prettier-eslint
- http://eslint.cn/docs/user-guide/configuring
- http://eslint.cn/docs/rules/
- https://git-scm.com/docs/gitignore
- https://prettier.io/docs/en/integrating-with-linters.html
- http://stariveer.coding.me/fe-doc/
