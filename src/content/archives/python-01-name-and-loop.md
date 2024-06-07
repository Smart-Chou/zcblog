---
title: 命名和循环
description: Python-01 - 命名和循环
pubDate: 2020-08-15
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - Python
---

### 命名规则展开目录

**项目**：以数字加名称表示

```python
01_python基础
```

**文件**：不能以数字开头，以字母、数字、下划线组合而成

```python
py_01_python基础.py
```

### 格式化输出展开目录

以 `%` 表示

```python
#字符串
%s
#有符号十进制整数
%d
#浮点数
%f
```

### 循环展开目录

#### 格式展开目录

```python
while条件:
    条件满足做的事情1    条件满足做的事情2    ...省略...
```

### break 和 continue展开目录

- **break**: 某一条件满足时，退出循环，不再执行后续代码
- **continue**: 某一条件满足时，不执行后续重复代码
- 区别:`break` 退出整个循环，`continue` 结束本次循环，开始下次循环

> 如果使用 `continue` 需要首先确认是否需要对循环计数修改
