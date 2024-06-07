---
title: 面向对象
description: Python-06 - 面向对象
pubDate: 2021-02-05
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - Python
---



## Python - 面向对象

面向对象编程 -- `Object Oriented Programming`，简写 `OOP`

## 基本概念

### 过程和对象

- 面向过程和面向对象是两种不同编程方式
- 过程是早期的一个编程概念
- 过程类似于函数，只能执行，但**没有返回值**
- 函数不仅能执行，还可以返回结果

### 面向过程

- 把完成某一需求的所有步骤**从头到尾逐步实现**
- 根据开发需求，将某些功能独立的代码封装成一个又一个**函数**
- 最后完成的代码就是**顺序的调用**不同的函数

#### 特点

- 注重**步骤与过程**，不注重职责分工
- 如果需求复杂，代 码会变得很复杂
- 开发复杂项目，没有固定的套路，开发难度很大

### 面向对象

> 相比较函数，面向对象是更大的封装，根据职责在一个对象中封装多个方法

- 在完成一个需求前，首先确定**职责** -- 要做的事情（方法）
- 根据职责确定不同的对象，在对象内部封装不同的方法（多个）
- 最后完成的代码，就是顺序地让不同的**对象调用不同的方法**

#### 特点

- **注重对象和职责**，不同的对象承担不同的职责
- 更加适合应对复杂的需求变化，是专门应对复杂项目的开发，**有固定的套路**
- 需要在面向过程的基础上，再学习一些面向对象的语法

## 类和对象

### 概念

#### 类 (Class)

- 类是一群具有相同特征或者行为的事物的一个统称，是抽象的，不能直接使用
  - 特征被称为属性
  - 行为被称为方法
- 类就相当于制造飞机时的图纸，是一个**模板**，是负责**创建对象**的

#### 对象 (object)

- 对象是由类创建出来的一个**具体存在**，可以直接使用
- 由哪一个类创建出来的对象，就拥有在哪一个类中定义的：
  - 属性
  - 方法
- 对象就相当于用图纸制造飞机

#### 类和对象的关系

- 类是模板，对象是根据类这个模板创建出来的，应该**先有类再有对象**
- 类只有**一个**，而对象可以有**很多个**
  - 不同的对象之间属性可能会各不相同
- 类中定义了什么属性和方法，对象中就有什么属性和方法，**不可能多，也不可能少**
  - 和概念上下级不同

### 设计

在使用面向对象开发前，首先应分析需求，确定程序中需要包含哪些类

#### 设计类的三要素

- 类名：这类事物的名字，满足大驼峰命名法
- 属性：这类事物具有什么样的特征
- 方法：这类事物具有什么样的行为

#### 大驼峰命名法

- 每一个单词首字母大写
- 单词与单词间没有下划线

### 类名的确定

名词提炼法分析整个业务流程，出现的名词，通常就是找到的类

### 属性和方法的确定

- 对**对象的特征描述**，通常可以定义成属性
- 对象具有的**行为**（动词），通常可以定义成方法

> 需求中没有涉及的属性或方法在设计类时不需要考虑

## 面向对象基础语法

- 使用内置函数 `dir` 传入标识符 `/` 数据可以查看对象内的所有属性和方法
- `__方法名__` 格式的方法是 Python 提供的内置方法和属性

| 方法名 | 类型 | 作用 |
| :---: | :---: | :---: |
| _new_ | 方法 | 创建对象时，会被自动调用 |
| _init_ | 方法 | 对象初始化时，会被自动调用 |
| _del_ | 方法 | 对象被从内存中销毁前，会被自动调用 |
| _str_ | 方法 | 返回对象的描述信息，print 函数输出使用，必须返回一个字符串 |

## 定义简单的类（只包含方法）

```python
class 类名：
        def 方法1(self, 参数列表):
            pass
        def 方法2(self, 参数列表):
            pass
```

- 方法的定义格式和函数几乎一样
  - 区别在于第一个参数必须是 self

### 创建对象

- 当一个类定义完成后，要使用这个类创建对象

```python
对象变量 = 类名()
```

### 引用的概念

面向对象中引用同样适用

- 在 Python 中使用类创建对象后，变量仍然记录的是**对象在内存中的地址**
- 也就是对象变量引用了**新建的猫对象**
- 使用 print 输出对象变量，默认情况下能够输出这个变量**引用的对象**是由哪一个类创建的对象，以及在内存中的地址

### 方法中的 self 参数

- Python 中给对象设置属性非常容易，只需要在类的外部的代码中直接通过 . 设置一个属性即可

:::tip 提示

- 虽然简单，但不推荐使用
- 因为对象属性的封装应该封装在类的内部
- 如果运行时没有找到属性，程序会报错
:::

```python
tom.name = "Tom"
# 利用赋值语句，给 tom 对象设置 name 属性为Tom
```

- 在类封装的方法内部，self 表示当前调用方法的对象自己
  - 也就是说：**哪一个对象调用的方法，self 就是哪一个对象的引用**
- 调用方法时程序员不需要传递 `self` 参数
- 在方法内部：
  - 可以通过 self. 访问对象属性
  - 也可以通过 self. 调用对象的其他方法

### 初始化方法

- 当使用 `类名()` 创建对象时，会**自动**执行以下操作：
  - 为对象在内存中**分配空间** -- 创建对象
  - 为对象的属性**设置初始值** -- 初始化方法 (`init`)
- 这个初始化方法就是 `__init__` 方法，这是对象的内置方法

> __init__ 方法是专门用来定义一个类具有哪些属性的方法

```python
class Cat:
    def __init__(self):
        print("初始化方法")

# 使用 类名() 创建对象的时候，会自动调用初始化方法 __init__

tom = Cat()
```

### 在初始化方法内部定义属性

- 在 `__init__` 方法内部使用 `self.属性名 = 形参` 就可以定义属性
- 定义属性后，再使用类创建的对象都会拥有该属性
- 创建对象时，使用 `类名(属性1, 属性2...)` 调用

```python
class Cat:
    def __init__(self, new_name):
        print("初始化方法")
        # self.name = "Tom"
        self.name = new_name

    def eat(self):
        print("%s爱吃鱼" % self.name)

# 使用 类名() 创建对象的时候，会自动调用初始化方法 __init__

tom = Cat("Tom")
print(tom.name)
```

## 案例

### 小明爱跑步

#### 需求

1. 小明体重 75.0 公斤
2. 小明每次跑步会减肥 0.5 公斤
3. 小明每次吃东西体重增加 1 公斤

```python
class Person:
    def __init__(self, name, weight):
        # self.属性 = 形参
        self.name = name
        self.weight = weight

    def __str__(self):

        return "我的名字是 %s,体重是 %d.2 公斤" % (self.name, self.weight)

    def run(self):
        print("%s爱跑步，跑步锻炼身体" % self.name)
        self.weight -= 0.5

    def eat(self):
        print("%s是吃货，吃完东西再减肥" % self.name)
        self.weight += 1.0

xiaoming = Person("小明",75.0 )
xiaoming.run()
xiaoming.eat()
print(xiaoming)
```

:::note

- 在对象的方法内部，可以**直接访问对象的属性**
- 同一个类创建的**多个对象**之间，属性**互不干扰**
:::

### 摆放家具

1. 房子有户型、总面积和家具名称列表
    - 新房子没有任何家具
2. **家具**有名字和占地面积，其中：
    - 床占地 4 平米
    - 衣柜占地 2 平米
    - 餐桌占地 1.5 平米
3. 将以上三件家具**添加**到房子中
4. 打印房子时，要求输出：
    - 户型
    - 总面积
    - 剩余面积
    - 家具名称列表

```python
class HouseItem:

    def __init__(self, name, area):
        self.name = name
        self.area = area

    def __str__(self):
        return "%s占地 %.2f 平米" % (self.name, self.area)

class House:

    def __init__(self, house_type, area):
        self.house_type = house_type
        self.area = area

        # 剩余面积，初始值等于总面积
        self.free_area = area
        # 家具名称列表
        self.item_list = []

    def __str__(self):
        return ("户型：%s\n总面积：%.2f\n剩余面积：%.2f\n家具：%s"
                % (self.house_type, self.area,
                   self.free_area, self.item_list))

    def add_item(self, item):
        print("要添加 %s" % item)
        # 1. 判断家具的面积
        if item.area > self.free_area:
            print("%s面积太大，无法添加" % item.name)
            return

        # 2. 将家具的名称添加到列表
        self.item_list.append(item.name)

        # 3. 计算剩余面积
        self.free_area -= item.area

# 1. 创建家具
bed = HouseItem("席梦思", 4)
chest = HouseItem("衣柜", 2)
table = HouseItem("餐桌", 1.5)
print(bed, chest, table)
# 2. 创建房子变量
my_home = House("两室一厅", 60)

my_home.add_item(bed)
my_home.add_item(chest)
my_home.add_item(table)
print(my_home)
```

## 封装案例

### 封装

- 封装是面向对象编程的一大特点
- 面向对象编程的第一步 -- 将属性和方法封装到一个抽象的类中
- 外界使用类创建对象，让对象调用方法
- 对象调用方法的细节都被封装在类的内部

> 一个对象的属性可以是另外一个类创建的对象

### 需求

1. 士兵许三多有一把 AK47
2. 士兵可以开火
3. 枪能发射子弹
4. 枪能填充子弹

### 定义属性的初始值

- 如果不知道设置什么初始值，可以设置为 `None`
- `None` 关键字表示什么也没有
- 表示一个空对象，没有方法和属性，是一个特殊的常量
- 可以将 `None` 赋值给任何一个变量

```python
class Gun:
    def __init__(self, model):
        # 1. 枪的型号
        self.model = model
        # 2. 子弹的数量
        self.bullet_count = 0

    def add_bullet(self, count):
        self.bullet_count += count

    def shoot(self):
        # 1. 判断子弹数量
        if self.bullet_count <= 1:
            print("[%s]没有子弹了" % self.model)
            return
        # 2. 发射子弹 -1
        self.bullet_count -= 1
        # 3. 提示发射信息
        print("[%s] 突突突...[%d]" % (self.model, self.bullet_count))

class Soldier:
    def __init__(self, name):
        # 1. 新兵的姓名
        self.name = name
        # 2. 枪 新兵没有枪
        self.gun = None

    def fire(self):
        # 1. 判断士兵是否有枪
        if self.gun is None:
            print("[%s] 还没有枪" % self.name)
            return

        # 2. 高喊口号
        print("冲啊[%s]" % self.name)
        # 3. 装填子弹
        self.gun.add_bullet(50)
        # 4. 发射子弹
        self.gun.shoot()

# 1. 创建枪对象
ak47 = Gun("AK47")
# 2. 创建许三多
xusanduo = Soldier("许三多")

xusanduo.gun = ak47
xusanduo.fire()
print(xusanduo.gun)
```

### 身份运算符

- 身份运算符是用于比较两个对象的内存地址是否一致 -- 是否是对同一个对象的引用
- 在 Python 中，针对 `None` 比较时，建议使用 `is` 判断

| 运算符 | 描述 | 实例 |
| :---: | :---: | :---: |
| `is` | `is` 是判断两个标识符是不是引用同一个对象 | x is y, 类似 id (x) == id (y) |
| `is not` | `is not` 是判断两个标识符是不是引用不同对象 | x is not y, 类似 id (a)!id (b) |

#### `is` 与 `==` 区别

- `is` 是判断两个变量是不是引用同一个对象
- `==` 判断引用变量的值是否相等

## 私有属性和私有方法

- 对象的某些属性或方法可能只希望在对象的内部被使用，不希望在外部被访问到
- 私有属性就是对象不希望公开的属性
- 私有方法就是对象不希望公开的方法

### 定义方式

- 在定义属性或方法时，在属性名或方法名前增加两个下划线

### 伪私有属性和私有方法

Python 中并没有真正意义的私有

- 在给属性、方法命名时，实际是对名称做了一些特殊处理，使得外界无法访问
- 处理方式：在名称前加上 类名 => `_类名__名称`

> 不要使用这种方法访问私有属性和私有方法
