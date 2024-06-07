---
title: 函数
description: Python-03 - 函数
pubDate: 2020-08-25
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - Python
---



## 函数

### 格式

```python
def 函数名():    
    封装代码    
    ......
```

## 注意

> 函数名不能以数字开头,不能与关键字重名
> 定义函数后只表示封装代码定义函数后只表示封装代码
> 如果不调用函数，函数不会执行
> 函数调用必须在定义函数之后，否则会报错

## 函数注释

- 函数定义上方保留两个空行（包含注释）

- 定义函数的下方，连续三个引号内部进行注释

- 在调用函数的位置，使用<kbd>ctrl</kbd>+<kbd>Q</kbd> 可快速查看

## 函数参数

- 在函数名的小括号内部填写参数
- 多个参数使用<kbd>, </kbd>分隔

### 示例

```python
def sum_2_num(num1, num2):    
    """两数字求和"""    
    result = num1 + num2    
    print("%d + %d = %d" % (num1, num2,result))sum_2_num(1, 2)
```

### 形参和实参

- **形参**：定义函数时，小括号内的参数，用来接收参数，在函数内部作为变量使用
- **实参**：调用函数时，小括号内的参数，用来把数据传递到函数内部

## 函数的返回值

- 返回值是函数完成工作后，最后给调用者的一个结果
- 在函数中使用 `return`关键字返回结果
- 调用函数的一方，可以使用变量接收函数的返回结果

### 示例

```python
def sum_2_num(num1, num2):    
    result = num2 + num2    
    return result
# 使用变量接收函数调用的结果
sum_result = sum_2_num(10, 20)
print("计算结果：%d" % sum_result)
```

### 注意

> 注意:`return` 表示返回，后续的代码都不会被执行

## 函数的嵌套调用

- 一个函数里又调用了另一个函数，就是嵌套调用

### 打印多条分割线

```python
def print_line(char, times):    
    """打印分割线"""    
    print(char * times)

def print_lines(char, times):    
    """打印多行分割线    
    :param char:分割线使用的分割字符
    :param times:分割线重复次数    
    """    
    row = 0    
    while row < 5:     
    print_line(char, times)        
    row += 1

print_lines("-", 50)
```

> 针对需求变化，要冷静思考，不要轻易更改已经完成的、能够正常执行的函数
