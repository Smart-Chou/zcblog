---
title: Markdown高级技巧
description: Markdown高级技巧
pubDate: 2020-06-26
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - MarkDown
---

## 支持的 HTML 元素

不在 Markdown 涵盖范围之内的标签，都可以直接在文档里面用 HTML 撰写。

目前支持的 HTML 元素有：`<kbd>`、 `<b>`、 `<i>`、 `<em>`、 `<sup>`、 `<sub>`、
``等 ，如：

> 使用 `<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Del</kbd>` 重启电脑

输出结果为：

![键盘](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/Snipaste_2021-10-06_12-33-31.png)

## 公式

当你需要在编辑器中插入数学公式时，可以使用两个美元符 $$ 包裹 TeX 或 LaTeX 格式的
数学公式来实现。提交后，问答和文章页会根据需要加载 Mathjax 对数学公式进行渲染。
如：

```md
$$
\mathbf{V}_1 \times \mathbf{V}_2 =  \begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
\frac{\partial X}{\partial u} &  \frac{\partial Y}{\partial u} & 0 \\
\frac{\partial X}{\partial v} &  \frac{\partial Y}{\partial v} & 0 \\
\end{vmatrix}
${$tep1}{\style{visibility:hidden}{(x+1)(x+1)}}
$$
```

输出结果为：

![公式](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/Snipaste_2021-10-06_12-47-07.png)

## typora 画流程图、时序图(顺序图)、甘特图

复制以下代码使用 typora 的源码模式粘贴到编辑器中查看效果：

以下几个实例效果图如下：

### 横向流程图源码格式

![横向流程图](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/Snipaste_2021-11-03_22-54-22.png)

````
```mermaid
graph LR
A[方形] -->B(圆角)
    B --> C{条件a}
    C -->|a=1| D[结果1]
    C -->|a=2| E[结果2]
    F[横向流程图]
```
````

### 竖向流程图源码格式

![竖向流程图](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/Snipaste_2021-11-03_22-54-50.png)

````
```mermaid
graph TD
A[方形] --> B(圆角)
    B --> C{条件a}
    C --> |a=1| D[结果1]
    C --> |a=2| E[结果2]
    F[竖向流程图]
```
````

### 标准流程图源码格式

![标准流程图](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/Snipaste_2021-11-03_22-54-58.png)

````
```flow
st=>start: 开始框
op=>operation: 处理框
cond=>condition: 判断框(是或否?)
sub1=>subroutine: 子流程
io=>inputoutput: 输入输出框
e=>end: 结束框
st->op->cond
cond(yes)->io->e
cond(no)->sub1(right)->op
```
````

### 标准流程图源码格式（横向）

![标准流程图-横向](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/Snipaste_2021-11-03_22-55-05.png)

````
```flow
st=>start: 开始框
op=>operation: 处理框
cond=>condition: 判断框(是或否?)
sub1=>subroutine: 子流程
io=>inputoutput: 输入输出框
e=>end: 结束框
st(right)->op(right)->cond
cond(yes)->io(bottom)->e
cond(no)->sub1(right)->op
```
````

### UML标准时序图样例

![UML标准时序图](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/Snipaste_2021-11-03_22-55-31.png)

````
```sequence
Title: 标题：复杂使用
对象A->对象B: 对象B你好吗?（请求）
Note right of 对象B: 对象B的描述
Note left of 对象A: 对象A的描述(提示)
对象B-->对象A: 我很好(响应)
对象B->小三: 你好吗
小三-->>对象A: 对象B找我了
对象A->对象B: 你真的好吗？
Note over 小三,对象B: 我们是朋友
participant C
Note right of C: 没人陪我玩
```
````

### UML时序图源码样例

![UML时序图](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/Snipaste_2021-11-03_22-55-14.png)

````
```sequence
对象A->对象B: 对象B你好吗?（请求）
Note right of 对象B: 对象B的描述
Note left of 对象A: 对象A的描述(提示)
对象B-->对象A: 我很好(响应)
对象A->对象B: 你真的好吗？
```
````

### UML时序图源码复杂样例

![UML时序图源码-复杂](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/Snipaste_2021-11-03_22-55-21.png)

````
```sequence
Title: 标题：复杂使用
对象A->对象B: 对象B你好吗?（请求）
Note right of 对象B: 对象B的描述
Note left of 对象A: 对象A的描述(提示)
对象B-->对象A: 我很好(响应)
对象B->小三: 你好吗
小三-->>对象A: 对象B找我了
对象A->对象B: 你真的好吗？
Note over 小三,对象B: 我们是朋友
participant C
Note right of C: 没人陪我玩
```
````

### 甘特图样例

![甘特图](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/Snipaste_2021-10-06_13-00-16.png)

````
```mermaid
%% 语法示例
        gantt
        dateFormat  YYYY-MM-DD
        title 软件开发甘特图
        section 设计
        需求                      :done,    des1, 2014-01-06,2014-01-08
        原型                      :active,  des2, 2014-01-09, 3d
        UI设计                     :         des3, after des2, 5d
    未来任务                     :         des4, after des3, 5d
        section 开发
        学习准备理解需求                      :crit, done, 2014-01-06,24h
        设计框架                             :crit, done, after des2, 2d
        开发                                 :crit, active, 3d
        未来任务                              :crit, 5d
        耍                                   :2d
        section 测试
        功能测试                              :active, a1, after des3, 3d
        压力测试                               :after a1  , 20h
        测试报告                               : 48h
```
````
