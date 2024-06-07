---
title: 初识TypeScript
description: 初识TypeScript
pubDate: 2020-07-30
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - TypeScript
  - 前端
---

:::tip 介绍

这是最近复习TypeScript的一份笔记

:::

## 为什么要学习TypeScript

TypeScript（以下简称ts）是微软开源的编程语言

在目前，ts还只是JavaScript的增强，最终还是要编译为JavaScript来运行，JavaScript太
过于自由，导致我们经常犯一些简单的错误，而ts作为js的超集，是一个强类型语言，拥有
面向对象编程语言的所有特性

ts可以说是未来前端开发必备的技术点，博主最近接触到的很多新项目都在使用ts进行构
建，包括各大框架都采用ts来构建

## 准备开发环境

首先需要安装 node 开发环境，这个不必多说

然后使用`npm i typescript -g`来全局安装ts的工具，然后可以使用命令`tsc -V`来检查
安装状态

![安装](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/225245-454354.png)

我们新建一个`demo`文件夹，新建一个`first.ts`文件

```ts
function say(msg: string): void {
  console.log(msg)
}
say('hello ts')
```

这里我们可以发现，方法的定义和常规的JavaScript有些区别，在参数的定义位置增加了一
个`:string`，这个的作用就是类型限制，规定我们传入的参数必须为`string`类型，当然
还有其他，我们下面会详细说

参数括号后面紧跟`: void`，这个就是规定方法的返回值类型，此时`void`为不返回，这个
下面也会详细说

学过Java这类语言的朋友肯定会感到非常熟悉

我们可以在文件位置的命令行里面执行 `tsc first.ts`就可以编译文件了，执行完毕我们
的目录里面增加了一个`first.js`文件，也就是说，我们的ts文件最终被编译为了js文件

如果你使用的vscode，可能编译完成以后你的代码会显示函数定义重复，此时你只需要在文
件夹里面创建一个`tsconfig.json` 文件即可，当前不需要填充任何内容，也可以使用命
令`tsc --init`生成配置文件

## 基础类型定义

在前面使用`:string`来规定了参数的数据类型，我们新建一个 `typedemo.ts`来测试一下
基础类型的定义，我们可以使用`tsc --watch typedemo.ts`命令来监听文件修改并自动编
译

为了方便测试，你可以安装nodemon，然后使用nodemon来运行编译后的js文件，这样就能实
时看到结果了比如`nodemon .\typedemo.js`

```ts
//1 string 类型
let stringdemo: string = 'stringdemo'
//2 布尔类型
let booleandemo: boolean = false
//3 数值
let numberdemo: number = 502
//4 定义多个类型
let moretypedemo: number | string
moretypedemo = 1
moretypedemo = '1'
//5.1 数组定义方式1
let listdemo1: number[] = [1, 2, 7, 0, 7, 9, 9, 7, 0, 0]
//5.2 数组定义方式2
let listdemo2: Array<number> = [1, 2, 7, 0, 7, 9, 9, 7, 0, 0]
//5.3 数组定义方式3 指定个数和对应的类型
let listdemo3: [boolean, number] = [true, 1]
//6 any 类型 任意类型 基本无意义了
let anydemo: any = [1, true, 'hello']
//7.1 null 类型 null和undefined 是所有类型的子类型 比如 let str:string=null
let nulldemo: null = null
//7.2 undefined
let undefineddemo: undefined = undefined
//8 Object 非原始类型 (string、boolean、number...这类为原始类型)
let objectdemo: object = undefined
objectdemo = { name: 'ChouCong' }
//9 enum 枚举类型 补充常规的 常量定义方式 本质就是键值对
enum FONTSIZE {
  Large = 48,
  Middle = 36,
  Little = 24,
}
//9.1 可以通过名字拿到值
let titleSize = FONTSIZE.Large
console.log(titleSize)
//9.2 也可以通过值拿到名字
let fontType = FONTSIZE[48]
console.log(fontType)

/**
 * 10 never类型是任何类型的子类型
 * 但是没有类型是never的子类型
 * never一般指无限循环或者无法到终点
 * 可用来抛出错误
 */
function loop(): never {
  while (true) {
    console.log('我不会结束')
  }
}
function error(msg: string): never {
  throw new Error(msg)
}
/**
 * 11 as 类型断言，确定我们的数据类型， 当我们的数据有多个类型的时候
 * 有些操作需要确定我们的数据类型
 * 比如anyData为string|number类型，此时我们就不能直接使用anyData++
 * 我们可以使用 anyData as number,确定他就是一个数值型
 */
let anyData: string | number
// anyData++;
;(anyData as number)++
对于never的解释
```

![例子](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/110022-544784.png)

## 接口

同样的我们新建一个 `interfacedemo.ts`来测试，按照上面的步骤将项目运行起来，在控
制台查看运行结果

```ts
/**
 * 1.接口可以用来对你的数据制定规则 比如我们创建用户方法需要一个 User对象
 * 我们在接口中规定 User 对象里面每个属性的参数类型
 * 最后我们将 User 对象作为一个数据类型用来限定我们方法的传入参数
 */
interface User {
  name: string
  age: number
  //1.1参数后面跟 ？ 代表这个参数不是必须的
  isAdmin?: boolean
  //1.2跟 readonly 代表对象实例化成功以后 这个参数不能修改
  readonly uid?: number
  //1.3对于其他不用明确规定的参数
  [otherName: string]: any
}
// 添加学生
function create(user: User): string {
  //1.1 user.uid = 123; 因为 readonly 所以不能修改了
  return '添加成功'
}
const user: User = {
  name: 'ChouCong',
  age: 21,
  uid: new Date().getTime(),
  //1.3 [otherName: string]: any 作用体现
  sex: 1,
}
const result: string = create(user)
// console.log(result);

// 2.使用接口来约定函数方法
interface ResultUtil {
  (msg: string): string
}
let resultImpl: ResultUtil = (msg: string): string => {
  //2.1 因为定义约束了返回值为 :string 所以不能 return false;
  return msg
}
/**
 * 3. 使用接口来约束索引
 */
// 3.1 假如我们约束的索引为 数值
interface UserListNumber {
  [index: number]: User
}
const userListNumber: UserListNumber = [
  {
    name: 'ChouCong',
    age: 12,
  },
]
console.log(userListNumber[0])
// 3.2 假如我们约束的索引为 字符串
interface UserListString {
  [index: string]: User
}
const userListString: UserListString = {
  user1: {
    name: 'ChouCong',
    age: 12,
  },
}
console.log(userListString['user1'])

// 4. 通过接口来约定类 也就是继承接口
interface Animal {
  //重量
  weight: number
  // 中文名
  chName: string
  // 动做
  say(msg: string): void
}
class Dog implements Animal {
  weight: number
  chName: string
  constructor(weight: number) {
    this.weight = weight
    this.chName = '狗'
  }
  say(msg: string): void {
    console.log(`${this.chName}:${msg}`)
  }
}
let dog = new Dog(5000)
dog.say('wang wang')
// 5. 继承接口 新建一个保护动物接口
interface protectAnimal extends Animal {
  //保护等级
  protectionClass: number
}
// 实例化一个猫科保护动物类
class Felidae implements protectAnimal {
  protectionClass: number
  weight: number
  chName: string
  say(msg: string): void {
    console.log(`${this.chName} - ${this.protectionClass}级保护动物:${msg}`)
  }
}
let panda = new Felidae()
panda.chName = '大熊猫'
panda.weight = 180000
panda.protectionClass = 1
panda.say('吃竹子')
```

## 类

```ts
/*
 * typescript 类的使用
 */

//1. 类的简单使用在前面的接口一节中已经简单说明
class Animal {
  chName: string
  weight: number
  say(msg: string): void {
    console.log(`${this.chName} :${msg}`)
  }
  //1.1 构造函数 当new一个对象的时候，可以直接传递初始值 比如 new Animal("dog", 5000);
  constructor(chName: string, weight: number) {
    // 通过this能够将实例化对象时传递的值赋值给类的属性
    this.chName = chName
    this.weight = weight
  }
}
//2 新增一个保护动物类继承动物类 并且新增一个保护等级属性
class protectAnimal extends Animal {
  protectionClass: number
  //构造函数
  constructor(chName: string, weight: number, protectionClass: number) {
    //2.1 super可以调用父类的构造函数 也就是将实例化protectAnimal的数据传递给Animal类的构造函数
    super(chName, weight)
    this.protectionClass = protectionClass
  }
}

// let panda = new protectAnimal("大熊猫", 180000, 1);
// panda.say("吃竹子");

// 3. 类权限修饰
class User {
  // 3.1 private 私有的；就不能再通过 .name 拿到值了 只能类内部使用
  private name: string
  /**
   * 4 get set 存取器
   * 通过private进行修饰的属性 实例化对象不能直接拿到
   * 可以通过 get set来操作
   */
  // 4.1 通过get来让实例化对象拿到 name 值
  get getName(): string {
    return this.name
  }
  // 4.2 通过set来给 name 设置值
  set setName(name: string) {
    this.name = name
  }
  //3.2 protected 子类能够拿到
  protected sex: number
  // 3.3 static 静态属性 可以直接通过类拿到 User.avatar
  static avatar: string = 'https://avatar.v2ex.com'
  constructor(name: string, sex: number) {
    this.name = name
    this.sex = sex
  }
  say() {
    console.log(`user:${this.name}`)
  }
}
// 4. 测试 get set
// let user = new User("ChouCong", 1);
// console.log(user.getName);
// user.setName = 'lili';
// console.log(user.getName);
class stu extends User {
  constructor(name: string, sex: number) {
    super(name, sex)
  }
  say() {
    /**
     * console.log(`user:name=>${this.name},sex=>${this.sex}`);
     * 3.1 处定义的private ，此处便不能使用 name属性
     * 3.2 定义的protected，此处可以拿到 sex 属性
     */
    console.log(`user:sex=>${this.sex}`)
  }
}

/**
 *  5. 抽象类 abstract
 * 抽象类不能被实例化，里面有常规的属性和抽象方法
 * 使用抽象类可以很好地指定一些规则来让继承的子类遵循
 * 抽象方法是规定子类必须实现的方法
 * 抽象类和接口的区别：假如你的家族有任务，但是父辈完不成
 * 就会使用抽象方法来定义，让你来完成，加入你家族和你朋友的家族需要完成同样的任务
 * 就可以使用接口来定义这个共同任务，然后你们两个家族分别实现这个接口
 */
abstract class Article {
  abstract create(): void
}
class TopArticle extends Article {
  create(): void {
    console.log('实现创建方法')
  }
}

//作为模块可以欺骗 ts，用来解决同文件夹不能定义同一对象名的问题
export {}
```

## 函数

```ts
/*
 * typescript 函数相关，函数的简单使用在前面已经提过
 * 1. 新建一个计算圆面积的方法
 * 在函数里面我们同样需要约束参数的类型和返回值类型
 * @param r 半径
 */
function circleArea(r: number): number {
  return Math.PI * r * r
}

// console.log(circleArea(5));

/**
 * 2. 你可以先声明方法 再具体实现
 */
var squareArea: (x: number) => number
squareArea = function (x: number): number {
  return x * x
}
/**
 * 3. 可选参数q
 * 新建一个计算长方形或者正方形面积的方法
 * 如果没有y传值，就代表是正方形
 * @param x
 * @param y
 */
function rectangleOrSquareArea(x: number, y?: number): number {
  return y ? x * y : x * x
}
// console.log(rectangleOrSquareArea(2));

/**
 * 4. 方法重载
 * 方法重载就是多个同名的方法，但是可以不同的参数和不同的返回值
 * 这样做的好处就是我们可以通过一个具体方法去处理不同的情况
 * 比如这里我们定义一个 result方法
 * 第一方法定义 我们传递一个msg字符串
 * 第二个方法定义 我们传递一个msg和一个code
 * 方法重载，参数越少的写在越上面
 * 第三个方法我们才来实现具体的方法,在方法内部去根据具体的传值情况来分别处理
 * 也就是当调用方法时没有传递code值，就默认设置为200
 */
interface Res {
  code: number
  msg: string
}
function result(msg: string): Res
function result(msg: string, code: number): Res
function result(msg: string, code?: number): Res {
  if (!code) {
    code = 200
  }
  return {
    code: code,
    msg: msg,
  }
}
console.log(result('增加成功'))

//5. 默认值，当用户没有传递这个参数的时候给它一个默认值
function resultDefault(msg: string, code = 200): Res {
  return {
    code: code,
    msg: msg,
  }
}
// 6. 剩余参数，当方法后面不确定有多少个参数，可以使用...来规定剩余参数
function stringsplice(mainstring: string, ...stringFra: string[]): string {
  stringFra.forEach(str => (mainstring += str))
  return mainstring
}
console.log(stringsplice('str1', 'str2'))

export {}
```

## typescript中的this指向

```ts
/*
 * typescript 中的 this
 * 1. 举一个简单的案例来讲解一下 ts中的this
 */
// interface FooInter {
//     x: number;
//     y: number;
//     printX(): void;
//     printY(): void;
//     printZ(this: FooInter): void;
// }
class Foo {
  x = 3
  y = 3
  z = 3
  printX() {
    console.log('x is ' + this.x)
  }
  printY = () => {
    console.log('y is ' + this.y)
  }
}

/**
 * 1.1 实例化一个Foo，并调用 printx 方法
 * 然后我们新建一个对象x，将Foo类的printX 方法赋值给 print属性
 * 然后调用x对象的 print方法，其实就是调用了 Foo类的printX方法
 * 输出：
 * x is 3
 * x is 10
 * 明明x.print()是调用的Foo.printX,而Foo里面的x值为10，这里却打印的是10
 * 因为此时Foo.printX方法里面的this指向已经变成 x对象了，而x对象的x值为10
 */
var foo = new Foo()
foo.printX()
var x = { x: 10, y: 10, print: foo.printX }
x.print()
/**
 * 1.2 解决这个问题我们可以使用 => 函数来锁定this指向为创建时指向
 * 我们新建一个printY方法来测试一下
 * 此时输出为：
 * y is 3
 * y is 3
 */
foo.printY()
var y = { x: 10, y: 10, print: foo.printY }
y.print()
```

## 泛型

```ts
/*
 * typescript 中泛型的使用
 * 1. 什么是泛型，使用过Java的很好理解
 * 下面举个例子（官方示例）我们有个方法identity，最开始我们给他传递数字
 * 后来要传递字符串，这时我们可以使用 any来定义参数类型
 * 我们可以使用泛型来替代any
 */
// function identity(arg: number): number {
//     return arg;
// }
// function identity(arg: any): any {
//     return arg;
// }

// 使用泛型替代 any 示例 方法后紧跟 <T> 这个T可以自定义名字，然后参数类型需要和这个 <...>中定义的名字相同
function identity<T>(arg: T): T {
  return arg
}
// 此时我们就可以随意传递值了，当然传递的时候你可以说明你传递的泛型为字符串，也可以省略
let output = identity<string>('typescipt')

/**
 * 2. 你可能会问这个有啥用啊，再来举一个很常见的案例
 * 假如我们的数据库对象里面都有 增加和更新的方法，只是不确定传入的对象
 * 我们可以使用泛型封装一个DaoBase类，存储增加和更新功能
 */
class DaoBase<T> {
  create(createData: T): T {
    console.log(createData)
    return createData
  }
  update(updateData: T) {
    return updateData
  }
}
/**
 * 2.1 然后我们定义一个 User接口来规定用户类型
 * 再创建一个 UserDao 类继承 DaoBase基本类
 * 同时指定泛型为 User对象
 */
interface User {
  name: string
  age: number
}
class UserDao<User> extends DaoBase<User> {}
let user: User = {
  name: 'ChouCong',
  age: 20,
}
/**
 * 2.2 此时我们实例化UserDao 就可以传递User对象的值了
 */
let userdao = new UserDao()
let result = userdao.create(user)

/**
 * 3 泛型类型约束,我们可以对泛型做一些约束
 * 我们编写一个DataType接口，约束了一个number属性id
 * 我们新增一个create函数，传入泛型extends  DataType
 * 这其实就规定了这个函数传入的参数必须符合DataType的约束
 */
interface DataType {
  id: number
}
function create<T extends DataType>(arg: T): void {
  console.log(arg.id)
}
// 3.1 我们在调用函数的时候必须传入对象包含 id 属性
create({ id: 1 })

/**
 * 4 来一个官方约束案例
 * 我们新建一个getProperty函数，根据对象的键获取值
 * 我们使用泛型来制定传入的对象
 * 我们通过 K extends keyof T 来约束了传入的键必须是传入对象的键
 */

function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}
const book = { price: 12, number: 20 }
let value = getProperty(book, 'price')
// console.log(value);

export {}
```

## 高级类型

```ts
/*
 * typescript中的高级类型
 * 1. 交叉类型（Intersection Types），交叉类型是将多个类型合并为一个类型，使用类型1&类型2表示
 * 来自官方的案例，我们创建一个extend函数
 * 传入两个对象，合并并返回，所以返回对象的类型就是传入的两个对象的交叉类型
 */
function extend<T, U>(first: T, second: U): T & U {
  // 存储返回的对象为交叉类型 T & U
  let result = <T & U>{}
  // 将传入的第一个对象循环存入 result
  for (let id in first) {
    ;(<any>result)[id] = (<any>first)[id]
  }
  // 循环第二个对象，去重后存入result
  for (let id in second) {
    if (!result.hasOwnProperty(id)) {
      ;(<any>result)[id] = (<any>second)[id]
    }
  }
  return result
}
// 1.1 新建一个Person对象和ConsoleLogger类
class Person {
  constructor(public name: string) {}
}
interface Loggable {
  log(): void
}
class ConsoleLogger implements Loggable {
  log() {
    // ...
  }
}
//1.2 传入extend，此时jim就有了Person对象和ConsoleLogger类全部属性
var jim = extend(new Person('Jim'), new ConsoleLogger())
var n = jim.name
jim.log()

/**
 * 2. 联合类型（Union Types）
 * 取多个类型共同的部位
 * 比如我们定义 两个接口countType、stringType
 * 都具有hash属性和两个独立的函数
 * 此时我们定义data对象为  countType | stringType 联合类型
 * 我们的data对象就只能使用 hash ，而不能使用各自独立的函数
 */

interface CountType {
  hash: string
  add_count()
}
interface StringType {
  hash: string
  str_replace()
}
let data: CountType | StringType
// data.hash
// data.add_count();

/**
 * 3. 类型保护
 * 如果使用了联合类型就不能使用特有的函数
 * 如果想要继续使用函数可以使用断言来确定对象的类型
 * 但是每次使用都需要断言判断
 */
// 3.1 断言的使用方式 注意虽然可以调用add_count，但是对象没有具体实例化，所以还是会报错
let newData: CountType | StringType
// if ((newData as CountType).add_count) {
//     (newData as CountType).add_count()
// }

/**
 * 3.2 我们可以新增一个函数，返回值就是data is CountType
 * 通过data is CountType ts就能判断这个data到底是什么类型
 * 然后在函数内部通过断言来判断 data是什么类型的对象
 */
// function isCount(data: CountType | StringType): data is CountType {
//     return (data as CountType).add_count !== undefined;
// }
// 3.2.1 使用定义的类型判断函数
// if (isCount(newData)) {
//     newData.add_count();
// }

/**
 * 3.3 来自官方的typeof类型保护示例
 * 通过 在函数isNumber和isString中使用typeof判断数据类型
 * 并返回x is number 和 x is string就能判断数据的类型
 */
function isNumber(x: any): x is number {
  return typeof x === 'number'
}

function isString(x: any): x is string {
  return typeof x === 'string'
}
// 3.3.1 具体使用
function padLeft(value: string, padding: string | number) {
  if (isNumber(padding)) {
    return Array(padding + 1).join(' ') + value
  }
  if (isString(padding)) {
    return padding + value
  }
  throw new Error(`Expected string or number, got '${padding}'.`)
}

export {}
```
