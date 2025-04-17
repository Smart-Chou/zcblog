---
title: expressive-code 使用
description: expressive-code 官网摘抄的相关使用说明
pubDate: 2024-06-14
tags: ['expressive-code']
image:
  url: 'https://pic.mcc.im/images?rP6sA8'
  alt: 'wait-this-is-not-my-commit'
sticky: 0
comment: false
mathjax: true
mermaid: true
---

## 主要功能

### 代码编辑器框架

要使代码块看起来像类似于 VS Code 的编辑器窗口,您必须提供一个可以在打开的文件选项卡中显示的文件名。

为此,您可以将打开的代码栏中的 `title` 属性设置为文件名,或者在代码的第一行添加[文件名注释](#文件名注释)。

请参阅下面的 markdown 代码,了解这两种方法的示例:

````md title="editor-example.md" ins=/title=".*?"/ ins=/<!--.*?-->/
```js title="my-test-file.js"
console.log('标题属性示例')
```

```html
<!-- src/content/index.html -->
<div>文件名评论示例</div>
```
````

渲染结果如下所示:

```js title="my-test-file.js"
console.log('标题属性示例')
```

```html
<!-- src/content/index.html -->
<div>文件名评论示例</div>
```

### 终端框架

当遇到带有通常用于终端会话或 shell 脚本的语言标识符的代码块时(`ansi`、`bash`、`bat`, `batch`、`cmd`、`console`、`powershell`、`ps`、`ps1`、`psd1`、`psm1`、`sh`、`shell`、`shellscript`、`shellsession`、`zsh`),Expressive Code 会执行额外的检查来检测要使用的框架类型:

- 如果代码块在打开的代码围栏的 `title` 属性中包含 shell 脚本文件名或[文件名注释](#文件名注释),或者代码以 shebang (`#!`) 开头,则它被视为脚本文件而不是终端会话,并且如果提供了文件名,则使用代码编辑器框架呈现,否则作为纯代码块呈现。
- 在所有其他情况下,代码块被视为终端会话并使用终端框架呈现。

与代码编辑器框架相比,终端框架不需要标题。标题栏将始终呈现,并且您可以选择使用 `title` 属性添加标题:

````md ins=/title=".*?"/
```bash
echo "这个终端框架没有标题"
```

```powershell title="PowerShell terminal example"
Write-Output "这个有一个标题！"
```
````

呈现的结果如下所示:

```bash
echo "这个终端框架没有标题"
```

```powershell title="PowerShell terminal example"
Write-Output "这个有一个标题！"
```

### 文件名注释

如果代码块没有 `title` 属性,Expressive Code 支持自动从代码中的文件名注释中提取标题。

注释必须满足以下条件才能被识别为文件名注释:

- 它必须出现在代码块的前 4 行内。
- 其行必须以 `//`、`<!--`、`/*` 或 `#` 开头,但不能以 `#!` 开头。虽然不是必需的,但我们建议使用与代码块语言匹配的注释语法。
- 它可以选择性地具有以冒号 (`:`) 结尾的前缀。这允许您在文件名前添加一些文本:`// 文件名:index.js`
- 文件名在代码块语言的上下文中看起来是有效的。例如,JavaScript 代码块中包含 CSS 文件名的注释将被忽略。

一旦找到文件名注释,就会将其从代码块的内容中删除,并使用提取的文件名作为代码块的标题。

:::note
您可以使用以下任一选项来阻止自动提取文件名注释:

- 在打开的代码围栏中提供 `title`

- [将代码块的框架类型](#覆盖框架类型) 设置为 `none`

- 通过在配置中将 `extractFileNameFromCode` 设置为 `false` 来全局禁用它

:::

### 覆盖框架类型

如果您想覆盖某些代码块的自动框架类型检测,您可以将 `frame="..."` 属性添加到打开的代码围栏。

此属性支持的值是 `code`、`terminal`、`none` 和 `auto`。默认值为 `auto`。

:::tip
将框架类型设置为 `none` 可以减少在页面上显示许多单行终端块时(例如在教程中)的视觉混乱。
:::

````md ins=/frame=".*?"/
```sh frame="none"
echo "看,没有框架！"
```

```ps frame="code" title="PowerShell Profile.ps1"
# 如果不覆盖,这将是一个终端框架
function Watch-Tail { Get-Content -Tail 20 -Wait $args }
New-Alias tail Watch-Tail
```
````

渲染结果如下所示:

```sh frame="none"
echo "看,没有框架！"
```

```ps frame="code" title="PowerShell Profile.ps1"
#如果不覆盖,这将是一个终端框架
function Watch-Tail { Get-Content -Tail 20 -Wait $args }
New-Alias tail Watch-Tail
```

### 标记整行和行范围

可以通过将行的 **行号放在花括号内** 添加到代码块的元信息中来标记行。行号从 1 开始,就像在 VS Code 和其他流行的编辑器中一样。

您可以标记单行或行范围,也可以通过使用逗号分隔来组合多个行标记:

- 单行:`{4}`
- 三行:`{4, 8, 12}`
- 由开始和结束定义的行范围:`{4-8}`
- 组合多个选择器:`{1, 4, 7-8}`

下面是一个结合了多个行号和行范围选择器的示例:

````md
```js {1, 4, 7-8}
// Line 1 - targeted by line number
// Line 2
// Line 3
// Line 4 - targeted by line number
// Line 5
// Line 6
// Line 7 - targeted by range "7-8"
// Line 8 - targeted by range "7-8"
```
````

这将呈现如下:

```js {1, 4, 7-8}
// Line 1 - targeted by line number
// Line 2
// Line 3
// Line 4 - targeted by line number
// Line 5
// Line 6
// Line 7 - targeted by range "7-8"
// Line 8 - targeted by range "7-8"
```

#### 选择行标记类型(`mark`、`ins`、 `del`)

默认情况下,所有目标行都将使用标记类型 `mark`,该标记以中性颜色呈现,仅突出显示行而不为其添加任何语义含义。

还有两种其他标记类型可用于为您的行添加语义含义:`ins`(插入)和`del`(删除)。它们分别以绿色和红色呈现,通常用于指示代码的更改。

要指定目标行的标记类型,请将其添加到其打开的花括号前面,后跟等号。例如,`ins={4}` 将标记第 4 行作为插入,而 `del={7-12}` 将标记第 7 至 12 行作为删除。

以下是结合所有三种标记类型的示例:

````md
```js title="line-markers.js" del={2} ins={3-4} {6}
function demo() {
  console.log('该行被标记为已删除')
  // 这线和下一行被标记为插入
  console.log('这是第二个插入线')

  return '该行使用中性默认标记类型'
}
```
````

这将呈现如下:

```js title="line-markers.js" del={2} ins={3-4} {6}
function demo() {
  console.log('该行被标记为已删除')
  // 这线和下一行被标记为插入
  console.log('这是第二个插入线')

  return '该行使用中性默认标记类型'
}
```

#### 将标签添加到线路标记

您可以将文本标签添加到任何行标记中,该标记将在标记线范围的第一行中呈现为彩色框。 这使您可以在周围文本中引用代码的特定部分。

要添加文本作为标签,请将其括在单引号或双引号中,并在大括号后直接添加,后跟冒号。例如,`ins={"A":6-10}` 将第6到10行标记为插入,并添加标签 `A`。

这是一个例子:

````md
```jsx {"1":5} del={"2":7-8} ins={"3":10-12}
// labeled-line-markers.jsx
<button
  role="button"
  {...props}
  value={value}
  className={buttonClassName}
  disabled={disabled}
  active={active}
>
  {children &&
    !active &&
    (typeof children === 'string' ? <span>{children}</span> : children)}
</button>
```
````

这将呈现如下:

```jsx {"1":5} del={"2":7-8} ins={"3":10-12}
// labeled-line-markers.jsx
<button
  role="button"
  {...props}
  value={value}
  className={buttonClassName}
  disabled={disabled}
  active={active}
>
  {children &&
    !active &&
    (typeof children === 'string' ? <span>{children}</span> : children)}
</button>
```

:::tip
如果您想在侧面使用稍长的标签(2-3个字符),并且它们开始与您的代码重叠,请考虑增加核心样式设置[codepaddinginline](ttps://expressive-code.com/reference/reference/reference/style-over-overrides/＃codepaddinginline)。
:::

##### 在自己的行上添加长标签

 如果您想使用太长适合侧面的标签,则可以将它们添加到标记的线路范围上方。 为此,请在您希望标签出现的代码块内添加一个空线,并将该空线作为行范围的开始。 例子:

````md ins={6,9,13}
```jsx {"1.这里提供价值道具:":5-6} del={"2.删除残疾和活动状态:":8-10} ins={"3.将其添加到将孩子们放入按钮中:":12-15}
// labeled-line-markers.jsx
<button
  role="button"
  {...props}

  value={value}
  className={buttonClassName}

  disabled={disabled}
  active={active}
>

  {children &&
    !active &&
    (typeof children === 'string' ? <span>{children}</span> : children)}
</button>
```
````

这将呈现如下:

```jsx {"1.这里提供价值道具:":5-6} del={"2.删除残疾和活动状态:":8-10} ins={"3.将其添加到将孩子们放入按钮中:":12-15}
// labeled-line-markers.jsx
<button
  role="button"
  {...props}

  value={value}
  className={buttonClassName}

  disabled={disabled}
  active={active}
>

  {children &&
    !active &&
    (typeof children === 'string' ? <span>{children}</span> : children)}
</button>
```

#### 使用`diff`语法

您还可以使用`diff`语言(例如,github)支持的`diff`语言,而不是在开放代码围栏上添加行号。 将开头代码围栏中的语言设置为`diff`,然后在任何行的第一列中添加` + `或` - ` 标记:

````md
```diff
+ 该线将被标记为插入
- 这条线将被标记为已删除
  这是一条常规线
```
````

要使您的Markdown / MDX文档中的原始内容更可读,可以在` + `或` - `标记(不是之前)之后添加空格,并与更改的线路对齐。 将自动检测到此额外的空格,并从渲染的代码块中删除:

````md
```diff
+ 该线将被标记为插入
- 这条线将被标记为已删除
  这是一条常规线
```
````

上面的两个变体将如下呈现:

```diff
+ 该线将被标记为插入
- 这条线将被标记为已删除
  这是一条常规线
```

为了避免对实际DIFF文件的意外修改(这将使它们无法使用),该插件将根据其常见的元数据线自动检测DIFF内容。 它将检测统一模式和上下文模式diff语法,例如`***`,`+++`,`----`,`@@`, 以及默认模式位置语法 (e.g. `0a1`, `1,2c1,2`, `1,2d1`):

````md
```diff
--- a/README.md
+++ b/README.md
@@ -1,3 +1,4 @@
+ 这是一个实际的差异文件
- 所有内容将保持不变
  也不会删除空格
```
````

#### 将语法突出显示与`diff`语法

 通常,使用" diff”语言的缺点是您失去了对实际代码语言的语法突出显示。 为了解决此问题,此插件使您可以通过在开放代码围栏中添加`lang =" ...”来指定第二语言标识符。 然后,此属性的值将用于语法突出显示,而" diff”的语法可用于标记线:

````md
```diff lang="js"
  function thisIsJavaScript() {
    //整个块被突出显示为JavaScript，
    //我们仍然可以在其中添加差异标记！
-   console.log('要删除的旧代码')
+   console.log('新的闪亮代码!')
  }
```
````

这将呈现如下:

```diff lang="js"
  function thisIsJavaScript() {
    //整个块被突出显示为JavaScript，
    //我们仍然可以在其中添加差异标记！
-   console.log('要删除的旧代码')
+   console.log('新的闪亮代码!')
  }
```

### 在线路内标记单个文字

#### 明文搜索字符串

要匹配代码块的行中的一串文本,只需**用引号包装**。 您可以使用双引号或单个引号:

- `"this will be marked"`
- `'this will be marked'`

如果要匹配的文本包含引号本身，则可以使用其他引号类型来包装它，而不必转义嵌套的引号:

- `"these 'single' quotes need no escaping"`
- `'these "double" quotes need no escaping'`

如果您无法避免相同类型的嵌套引号,则可以使用后向斜线来包装它们:

- `"this contains both \"double\" and 'single' quotes"`
- `'this contains both "double" and \'single\' quotes'`

例子:

````md
```js "given text"
function demo() {
  // Mark any given text inside lines
  return 'Multiple matches of the given text are supported';
}
```
````

这将呈现如下:

```js "given text"
function demo() {
  // Mark any given text inside lines
  return 'Multiple matches of the given text are supported';
}
```

#### 常用表达

要匹配代码块的线路内的正则表达式,**将其包裹在前向斜线**:

````md
```ts /ye[sp]/
console.log('The words yes and yep will be marked.')
```
````

这将呈现如下:

```ts /ye[sp]/
console.log('The words yes and yep will be marked.')
```

##### 避免前锋斜线

如果要匹配正则表达式内部的向前斜线,您可以使用后斜切逃脱它:

````md
```sh /\/ho.*\//
echo "Test" > /home/test.txt
```
````

这将呈现如下:

```sh /\/ho.*\//
echo "Test" > /home/test.txt
```

##### 标记捕获组内容

如果您只想标记与正则表达式匹配的某些部分,则可以使用捕获组。 例如,表达式`/ye(s | p)/`将匹配`yes`和`yep`,但仅标记字符`s` s`或`p`:p`:

  ```txt /ye(s|p)/
  The word "yes" will have the letter "s" marked.
  This also works for the "p" in "yep".
  ```

为了防止对捕获组的特殊待遇,您可以通过添加`?`后将其转换为非捕获组。 例如:

````md /ye(?:s|p)/
This block uses `/ye(?:s|p)/`, which causes the full
matching words "yes" and "yep" to be marked.
````

#### 选择内联标记类型(`mark`,`ins`,`del`)

就像使用线条标记一样,您可以通过在开放报价或前向斜线的前面添加标记类型作为明文和正则表达式标记,然后将其添加到平等符号。 这是一个例子:

````md
```js "return true;" ins="inserted" del="deleted"
function demo() {
  console.log('These are inserted and deleted marker types');
  // The return statement uses the default marker type
  return true;
}
```
````

这将呈现如下:

```js "return true;" ins="inserted" del="deleted"
function demo() {
  console.log('These are inserted and deleted marker types');
  // The return statement uses the default marker type
  return true;
}
```

### 每个块配置单词包装

您可以使用代码块的**元信息**中的 `wrap boolean prop` 启用或禁用单个代码块上的单词包装。 这是通过将`wrap`或`wrap = true`附加到打开代码围栏上以启用单词包装或`wrap = false`将其禁用:

````md ins=/(?\<=&#96;.*)wrap\S*/
```js wrap
// Example with wrap
function getLongString() {
  return '这是一个很长的字符串，除非容器非常宽，否则很可能不适合可用空间。这是一个很长的字符串，除非容器非常宽，否则很可能不适合可用空间。'
}
```

```js wrap=false
// Example with wrap=false
function getLongString() {
  return '这是一个很长的字符串，除非容器非常宽，否则很可能不适合可用空间。这是一个很长的字符串，除非容器非常宽，否则很可能不适合可用空间。'
}
```
````

上述代码将像这样渲染:

```js wrap
// Example with wrap
function getLongString() {
  return '这是一个很长的字符串，除非容器非常宽，否则很可能不适合可用空间。这是一个很长的字符串，除非容器非常宽，否则很可能不适合可用空间。'
}
```

```js wrap=false
// Example with wrap=false
function getLongString() {
  return '这是一个很长的字符串，除非容器非常宽，否则很可能不适合可用空间。这是一个很长的字符串，除非容器非常宽，否则很可能不适合可用空间。'
}
```

:::note
如果您只想更改网站上的几个代码块的行为,则在上面显示的手动添加`wrap`支柱很有用。 如果要影响所有代码块,则可以在[配置](#配置wrap的缩进)中这样做。
:::

### 配置Wrap的缩进

默认情况下,长行的wrap部分将与线路的缩进级别对齐,从而使包装代码似乎从同一列开始。 这增加了包装代码的可读性,对于缩进很重要的语言,例如 Python。

您也可以禁用此行为,以便长行的wrap部分始终从第1列开始。这对于复制终端输出可能很有用。

要更改代码块的此行为,您可以在代码块的**meta信息**中使用`preserveIndent`Boolean Prop:

````md ins=/(?\<=&#96;.*)preserveIndent\S*/
```js wrap preserveIndent
// 带有 preserverIndent 的示例（默认启用）
function getLongString() {
  return '这是一个很长的字符串，除非容器非常宽，否则很可能不适合可用空间。这是一个很长的字符串，除非容器非常宽，否则很可能不适合可用空间。'
}
```

```js wrap preserveIndent=false
// preserveIndent = false 的示例
function getLongString() {
  return '这是一个很长的字符串，除非容器非常宽，否则很可能不适合可用空间。这是一个很长的字符串，除非容器非常宽，否则很可能不适合可用空间。'
}
```
````

上述代码将像这样渲染:

```js wrap preserveIndent
// 带有 preserverIndent 的示例（默认启用）
function getLongString() {
  return '这是一个很长的字符串，除非容器非常宽，否则很可能不适合可用空间。这是一个很长的字符串，除非容器非常宽，否则很可能不适合可用空间。'
}
```

```js wrap preserveIndent=false
// preserveIndent = false 的示例
function getLongString() {
  return '这是一个很长的字符串，除非容器非常宽，否则很可能不适合可用空间。这是一个很长的字符串，除非容器非常宽，否则很可能不适合可用空间。'
}
```

## 插件

### 可折叠部分

要将部分标记为可折叠,您需要在代码块中添加**元信息**。 这是通过将`collapse = {x-y}`附加到打开代码围栏上来完成的,这表明从`x`(包括)行的折叠部分`y`。

您还可以通过用逗号分隔单个代码块中的多个部分:

````md ins="collapse={1-5, 12-14}"
```js collapse={1-5, 12-14}
// All this boilerplate setup code will be collapsed
import { someBoilerplateEngine } from '@example/some-boilerplate'
import { evenMoreBoilerplate } from '@example/even-more-boilerplate'

const engine = someBoilerplateEngine(evenMoreBoilerplate())

// This part of the code will be visible by default
engine.doSomething(1, 2, 3, calcFn)

function calcFn() {
  // You can have multiple collapsed sections
  const a = 1
  const b = 2
  return a + b
}
```
````

上述代码块将被渲染:

```js collapse={1-5, 12-14}
// All this boilerplate setup code will be collapsed
import { someBoilerplateEngine } from '@example/some-boilerplate'
import { evenMoreBoilerplate } from '@example/even-more-boilerplate'

const engine = someBoilerplateEngine(evenMoreBoilerplate())

// This part of the code will be visible by default
engine.doSomething(1, 2, 3, calcFn)

function calcFn() {
  // You can have multiple collapsed sections
  const a = 1
  const b = 2
  return a + b
}
```

### 显示每个块的行号

您可以使用代码块的**元信息**中的`showlineNumbers`boolean prop 启用或禁用单个代码块上的行号。 这是通过将`showlineNumbers`或`showlineNumbers = true`添加到打开代码围栏上以启用行号或`showlineNumbers = false`使其禁用它们:

````md ins=/showLineNumbers\S*/
```js showLineNumbers
// This code block will show line numbers
console.log('Greetings from line 2!')
console.log('I am on line 3')
```

```js showLineNumbers=false
// Line numbers are disabled for this block
console.log('Hello?')
console.log('Sorry, do you know what line I am on?')
```
````

上述代码将像这样渲染:

```js showLineNumbers
// This code block will show line numbers
console.log('Greetings from line 2!')
console.log('I am on line 3')
```

```js showLineNumbers=false
// Line numbers are disabled for this block
console.log('Hello?')
console.log('Sorry, do you know what line I am on?')
```

:::note
如果您已更改[默认配置](#配置wrap的缩进),则只需使用`showlineNumbers`prop即可显示行号。 默认情况下,安装插件后,将启用所有代码块的行号。
:::

### 更改起点号码

 默认情况下,您的代码块的行号将从`1`开始。 有时,您可能需要从不同的数字开始,以表明代码块是较大文件的一部分。

 要更改代码块的起始行号,您可以在代码块的**meta信息**中使用`ottlineNumber`prop。 这是通过附加`startlineNumber =`附加到打开代码围栏的所需号码来完成的:

````md ins=/showLineNumbers\S*/ ins=/startLineNumber\S*/
```js showLineNumbers startLineNumber=5
console.log('Greetings from line 5!')
console.log('I am on line 6')
```
````

上述代码将像这样渲染:

```js showLineNumbers startLineNumber=5
console.log('Greetings from line 5!')
console.log('I am on line 6')
```

:::note
更改起始行号纯粹是视觉上的,仅影响渲染的输出。 其他插件,例如[文本标记](https://expressive-code.com/key-features/text-markers/)不知道移动的行号,因此,如果您想针对特定行以突出显示目的,则仍然需要计算RAW中的实际线路 源代码。
:::
