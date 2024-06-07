---
title: 基于逆向工程和3D打印的头盔创新设计
description: 基于逆向工程和3D打印的头盔创新设计
pubDate: 2021-12-08
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - 论文
---

基于逆向工程、产品创新设计和**3D打印技术**，构建了头盔产品快速设计开发的技术路
线，优化产品生产流程，缩短产品开发周期，提高生产效率，完成头盔个性化设计，提高人
员佩戴舒适度。

<!-- more -->

物理模型的点云数据由3D扫描仪采集，导入逆向处理软件（**`Geomagic Studio`**）进行
数据处理、表面重建和表面拟合。这样就提取了修复后的头部表面的截面曲线。然后将提取
的信息通过参数交换命令发送到正向设计软件（**`SolidWorks`**）进行头盔正向设计，随
后打印出3D模型。

有效解决传统设计方法进行复杂曲面造型设计与制造，正向软件测量偏差，造型设计过程复
杂繁琐，费时费力，不能很好地满足产品设计、加工制造过程相对繁琐，生产周期长等设计
缺陷，加快企业产品开发，缩短周期，降低成本。此外，采用**3D打印技术**输出设计的3D
数字模型，有效缩短了产品开发周期。

© 2021 THE AUTHORS. 由 Elsevier BV 代表亚历山大大学工程学院出版。这是
[CC BY-NC-ND](https://creativecommons.org/licenses/by-nc-nd/4.0/) 许可下的开放获
取文章。

## 1.简介

2020 年 4 月 20 日，中国公安部交通管理局在全国范围内部署了 **“每个司机都必须戴头
盔或安全带”** 的规定，以进一步保护机动车驾驶员的健康。此后，多个地方政府部门宣
布，将对摩托车和电动自行车骑手的头盔佩戴行为进行严格检查。

因此，中国市场对头盔的需求急剧增加。此外，对于头盔制造商而言，提高生产效率、缩短
生产周期以及提高此类头盔的佩戴舒适度已成为重要的关注点。本研究提出了一种将逆向工
程与**3D打印技术**相结合的方法，以提高舒适度和生产效率，为未来头盔生产企业提供有
益的参考。

逆向工程和**3D打印技术**的飞速发展给传统制造业带来了巨大的挑战，而将两种技术有效
结合并应用到新产品开发过程中显得尤为重要。

`Baronio et al.` [^1] 结合3D打印和3D扫描技术，实现手部矫形器的定制化生产。通过逆
向工程获取前臂数据，采用**3D打印技术**输出手部矫形器模型，实现了产品的轻量化设
计，降低了生产成本，同时保证了数据的准确性。`Zhang` 和 `Yu` [^2] 通过**逆向工程
技术**，**结合模型优化设计**、**有限元分析**、**3D打印技术**，快速准确地获得产品
的3D数字模型，输出产品模型，从而提高新产品的开发效率。

与此同时， `Lei et al.` [^3] 开展产品再设计研究，结合逆向工程和快速成型技术，有
效验证产品再设计的实用性和优越性。`Zhong` [^4] 基于逆向工程与快速成型技术相结
合，研究了新时代传统家具的创新设计。

此外，`Li et al.` [^5] 在现代产品设计中使用逆向工程和快速成型技术，以提高设计质
量和制造精度。在`Tian` 和 `Li` [^6]进行的研究中，为了使股骨假体与人体快速匹配，
采用逆向工程和原型制作技术，熟练地缩短了生产周期，降低了患者的成本。

上述文献分析表明，逆向工程和快速成型技术在新产品开发中具有重要的应用前景。

在传统的工程生产中，产品设计一般采用正向工程设计，即根据产品的功能和用途提出概念
构思，借助计算机`3D软件`对其进行建模，最后通过技术手段进行加工成型。设计主要由设
计师在`CAD`软件上完成，这种设计方式周期长、效率低，不能满足市场需求。

**三维打印技术**可以缩短新产品的试制周期，而逆向工程可以在现有相关技术的基础上对
产品进行模仿和重新设计，从而缩短设计周期[^7][^8][^9]。新的设计理念既包括逆向工程
和正向建模的混合建模过程，也包括现代制造的模型设计过程，可以充分利用现代技术的优
势，不仅缩短产品设计周期，满足快节奏的需求。

现代市场的变化，也能有效继承以往成功设计案例的思路，提高产品设计的可靠性。在此基
础上，本研究提出了依托逆向工程和**3D打印技术**的快速产品开发流程创新，并以头盔设
计为例，分析了该技术的一般技术路线和具体应用效果，提出的方法。

## 2.一般技术路线

基于逆向工程和**3D打印技术**的新产品快速开发流程图如 **Fig.1** 所示。新的设计思
维既包括逆向工程和正向建模的混合建模过程，也包括现代制造的模型设计过程.分为数据
采集与处理、正向建模、模型制造三部分。

基本的设计过程是预先确定待开发产品的物理模型，通过3D扫描设备获取产品表面的点云数
据完成初始数据采集，然后使用软件（**`Geomagic Studio`**）进行拟合对采集到的数据
库进行点处理，包括点数据的删除、点数据的简化、点云数据的封装等，得到目标曲面
的`NURBS`曲面数据，然后将数据导入`3D软件`（**`Solid Studio`**）。

然后将数据导入`3D软件`（**`SolidWorks`**），形成所需产品的原始3D框架，对结构数据
进行参数化和优化，得到合适的产品模型，保存为`IGS格式`文件，最后IGS格式的产品模型
通过切片软件通过3D打印机输出。

::: center

![Fig.1](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/图片1.png)

Fig.1 Technical route for rapid product development based on reverse engineering
and 3D printing technology. :::

### 2.1.头盔逆向设计流程

作为一种先进的制造技术，逆向工程技术可以用来改进和创新现有的产品模型。也可以使用
三维扫描设备获取物体表面的信息，然后通过逆向建模软件（`Geomagic Studio`）利用计
算机的三维模型进行重建，最终可以对产品进行再加工。如 **Fig.1** 所示，基于逆向工
程的模型重建过程主要包括模型扫描、点云处理、表面重建和实体构建。

#### Step 1: 点云数据采集与处理

3D扫描仪用于扫描人体头部，准确、快速、详尽地获取实物的2D和3D几何数据。该研究专门
采用非接触式激光扫描设备（RDS BodyScan三维人体扫描系统）获取与人体头部离散点相关
的几何数据。扫描仪具有白光和激光两种不同模式，可根据模型表面材质选择合适的模式对
目标进行扫描，获取点云数据。

随后，将点云数据导入`Geomagic Studio`，通过去除无关噪声将有用点云与原始点云分
离。通过采样处理，在保证模型整体形状精度的前提下，尽量减少数据量。最后对3D模型进
行封装，通过点云数据编程得到边界理想、孔洞少、表面相对完整的人头三角面模型。

#### Step 2: 数据分段

根据物理对象的原始特征，将数据划分为不同的区域，每个区域都可以拟合一个曲面。然
后，采用表面之间的过渡和交叉的方法来重建它们，这意味着它们可以在一个完整的表面形
状内连接起来。

封装的多边形数据中通常存在一些由冗余和错误点云组成的三角形，因此我们必须对这些三
角形进行分割，删除或编辑冗余面，并完成多边形模型的表面平滑等优化过程。使用
**“Mesh Doctor”** 检测三角形曲面的自交，完成小错误的修复； **“补洞”** 修复破损的
地方；最后 **“Remove Feature”** 和 **“Loose Mesh”** 去除凸起的部分并平滑网格表面
以达到平滑的表面。

#### Step 3: 表面重建

::: center
![Fig.2](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/图片2.png)

Fig.2 Operation flow of surface processing. :::

如**Fig.2**所示，表面重建是指从获取的数据中输出相应的 `CAD` 模型的过程，是该方法
整个流程中最关键的步骤。具体而言，表面重建过程包括链条中的各个环节，如轮廓线检
测、轮廓线编辑、曲率检测、曲面拟合和曲面处理。

逆向工程使用3D扫描设备采集模型点云数据；根据收集到的数据，它还在
`Geomagic Studio` 软件中进行表面处理以创建与人体头部相关的多条横截面曲线。然后进
行偏差分析。曲面重建是对原始网格点云数据进行处理、多边形优化、曲面拟合的过程，所
有这些都会导致曲面与原始数据之间存在一定的误差。

与其他曲面构造方法相比，`NURBS` 方法基于`非均匀有理 B` 样本，因其速度、算法稳定
性和曲面质量而成为应用最广泛的曲面建模方法。将模型保存为 `IGS 格式`，然后将模型
转换为 `SolidWorks` 以使用参数交换进行参数化曲面建模。最终实现对产品设计制造的精
度评价。

### 2.2.创新设计与快速成型技术

在正向建模过程中借助软件分析其结构和结构优化存在的问题，达到超越逆向工程设计模仿
的再造意图，最终利用**3D打印技术**得到升级产品的实物模型。

实例结果证明，混合建模设计方法可以在保证产品质量的情况下，最大限度地缩短设计周
期，降低研发成本。产品的`CAD`模型建立后，利用逆向工程得到的`CAD`模型，创造出更具
创新性的设计。这结合了美学原则和市场需求等因素。本研究采用`SolidWorks`软件重新设
计模型，可直接执行曲面的构造、延伸、倒角、缝合等操作命令。

此外，`SolidWorks` 一般采用四边形曲面模型表达式，具有强大易用的曲面、3D 实体、特
征建模等功能，可用于最终输出新的`CAD` 模型。将得到的最终产品模型导入Cura切片软件
进行分层，按照一定的层厚对零件的几何`CAD`模型进行切片，从而得到每一层的轮廓数
据。然后利用3D打印设备根据各层的轮廓数据叠加材料，得到各层各截面的轮廓信息。

在控制系统下，3D打印机根据这些细节积累材料，最终完成产品模型的打印。该研究采用
了**熔融沉积建模 (FDM) 3D 打印机**；其形成模型的原理如**Fig.3**所示。最后，对产
品进行后处理，去除支撑部分，并对模型表面进行处理。

::: center
![Fig.3](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/图片3.png)

Fig.3 Forming principle diagram of FDM technology. :::

## 3.头盔设计过程的应用

中国在数字处理技术方面取得了长足的进步，出现了测量路径智能计算、测量效率/精度高
的产品。例如，**北京博威恒信公司开发了一种非接触式3D人体扫描仪**，该技术在旧版本
的技术上有了很大的改进。**西北工业大学与法国MENSI公司**在大行业、复杂场景3D信息
获取方面的研究也取得了丰硕成果。此外，由**北京天元3D科技有限公司**与**清华大
学**联合研发的**光栅投影相机3D扫描系统**已达到国际先进水平。

此外，**上海光学精密机械研究所**和**中国科学院**最近成功开发了一种能够处理全景场
景的**3D成像激光扫描仪**。在点云数据处理方面，部分高校的研究成果尤为突出，尤其是
在几何特征识别、表面重建/平滑度和商用逆向设计软件方面。例如，`Yang` [^10]应用多
视角测量方法从物体的不同角度获取数据，然后利用数据拼接技术测量大型物体。同
样，`Li et al.` [^11]采用结构光投影技术改进测量系统，提高复杂物体3D数据采集的速
度和质量。

本研究采用逆向工程采集人体头部数据，通过专业软件对点云数据进行优化，再对曲面进行
重构，形成头部截面曲线。随后，将获得的曲线放入 `SolidWorks` 进行参数化曲面建模，
以最大限度地提高头盔的贴合度和舒适度。通过检测到的轮廓线，几何和尺寸约束可用于建
立参数之间的联系，以构建头盔的数字模型并设计舒适的头饰。

### 3.1.数据收集

在设计和制造头盔时，要充分考虑头盔的舒适度和不同佩戴者的个性化需求。采用逆向工程
技术采集人体头部数据，引入 ==**RDS BodyScan 3D**== 人体扫描系统（`Table 1`），即
可完成全身数据扫描。在短短1.25 毫秒（相当于1/800 秒），确定了人体3D几何和颜色数
据的集合，获取的点云数据包含了人体各个部位的准确3D信息。

::: center
![Table 1](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/图片4.png)
:::

该系统将散斑图案投射到所述物体表面，由计算机对多组光学3D测量组件进行联动控制，在
100毫秒内完成所有相机的图像采集过程。通过摄像头采集的彩色图像、多摄像头、高精度
标定参数文件和完全自主知识产权的软件匹配重建算法，可快速建立3D人体模型，无需拼
接，高度的数据准确性。

为避免头部数据采集过程中头发的影响，本研究选取头发很少或没有头发的人进行相关数据
采集，如**Fig.4** 所示。佩戴者人数众多，参与者可以佩戴硅胶头套进行三维扫描过程。

::: center
![Fig.4](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/图片7.png)

Fig.4 3D data scanning of the human body. :::

### 3.2.头部表面的逆向重建

将获取的点云数据导入`Geomagic Studio`后，对点进行着色，使用“修复”命令去除体外的
孤立点和非连接点。迭代算法去除点云数据中的噪声点并检测点云数据的误差，
如**Fig.5**所示，然后将绝对值设为0.6 毫米，以均匀采样操作对点云数据进行采样减少
点云中的点数，总共得到15662个有效点云（**Fig.6**）。

::: center
![Fig.5](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/图片5.png)

Fig.5 Point error distribution chart.

![Fig.6](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/图片6.png)

Fig.6 Point cloud data. :::

最后，进行封装操作（如**Fig.7** 所示）。从**Fig.5**可以看出，头面数据点偏离主点
云的误差分布为0.02 毫米，点云数据边缘曲率变化较大的区域内数据点的误差分布仅接近
0.1 毫米的极限值，可见点云数据精度较高，误差满足要求。打包后的模型经过简单的多边
形编辑，包括一系列包含简化、填孔和松弛等操作。

此外，模型表面进行了初步修复，特别考虑了头部曲线的参考，而不是固定面部。头部模型
是一个复杂的非规则特征模型，在精确的表面上进行逆建模阶段。通过软件的偏差分析可以
看出，点云拟合的NUBRS曲面相对于点云数据的误差基本集中在0.06 毫米左右
（如**Fig.8**），表明曲面质量好，表面施工比较成功。检测曲率然后构造曲面片并最终
拟合 NURBS 曲面的建模方法产生了更理想的曲面片。

::: center
![Fig.7](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/图片8.png)

Fig.7 Packaged model.

![Fig.8](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/图片9.png)

Fig.8 Curvature deviation analysis. :::

为了使头盔更好地贴合头部，提高佩戴舒适度，该部分身体创建了多条横截面曲线，并对修
复后的头部表面进行了自由曲线处理。曲线提取后，根据设计意图，在曲线加工过程中，通
过重新拟合和草图编辑命令对自由曲线进行编辑和修改，以减少偏差。然后将加工后的自由
曲线通过参数交换命令发送到`SolidWorks`进行后续的正向设计。

从截面创建的曲线有两种类型，即直线/圆弧和样条曲线。由于曲线的端点对`SolidWorks`
曲面建模过程中所创建曲面的平滑度有很大影响，因此采用样条截面曲线。这是通过首先选
择自由曲线命令，单击 **“从截面创建”** 然后在曲线属性中选择样条曲线来完成的，其中
倒角为 `15`，公差为`0.01`，张力设置为**零**；具体参数设置如**Fig.9**所示。

::: center
![Fig.9](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/图片10.png)

Fig.9 Creation of spline section curve. :::

头部前部的中心线由连接两个耳点定义，与侧面相对的对应部分由连接鼻尖和颈背点定义。
基于这两条中心线，分别创建了五个样条截面曲线。随后，提取的水平和垂直横截面曲线与
参数进行交换，并选择 **“创建为草图”** 选项以将曲线对象创建为单个 `3D 草图`。
`SolidWorks` 软件完成转换操作后，以 `3D 草图`的形式创建模型。

## 4.产品的创新设计

在`SolidWorks`中进行基于表面的放样、填充和缝合以构建参数模型，并以**Fig.10**所示
的方式获得整体表面。就头盔与头部的贴合度和舒适度而言提供，由于横截面曲线通常是根
据头部特征创建的，并且曲面模型是根据曲线构建的，因此可以保证佩戴者的舒适度。重新
设计导出的曲面模型，结合美观、功能、结构等多种因素，可以进一步提高产品创新能力，
缩短产品开发周期，降低企业制造成本。

::: center
![Fig.10](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/图片11.png)

Fig.10 Parametric model of the head. :::

### 4.1.头盔设计

针对产品的功能特点，对头盔进行了重新设计。一是在曲面模型的基础上创造了更美观的外
观，并增加了可拆卸的可视化屏幕，具有照明和闪烁等功能。其次，头盔后部的摄像头和头
盔前部的屏幕可以通过调节杆上下调节，调节杆可以与头盔折叠在一起。这样的设计可以将
佩戴者身后的场景显示在屏幕上，方便驾驶员观察身后的交通情况，快速做出判断；因此，
他们避免了安全隐患，包括在骑行时被迫转头和向后看。

此外，头盔还配备了照明和闪光装置，以提高夜间行车的安全性能。对传统头盔进行二次设
计改进，改进头盔内表面为头部表面，更加贴合头部，提高佩戴舒适度；头盔增加了后置摄
像头和前置显示屏，在骑行，尤其是骑车时避免转头可以直接观察后面的情况，可以快速做
出判断；显示屏由调节杆连接，可根据需求调节屏幕高度，避免遮挡视线，调节杆与屏幕也
可取下；头盔增加照明/闪光装置，方便夜间行车和安全。改进后的头盔设计效果图
如**Fig.11**所示。

::: center
![Fig.11](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/图片12.png)

Fig.11 3D-effect display of helmet model. :::

### 4.2.快速三维成型技术

许多**3D打印技术**，如**三维光刻（SLA）**[^7]、**分层固体制造
（LOM）**[^8]、**FDM**[^9]和**选择性激光烧结（SLS）**[^12]都已得到成功开发。此
外，**德国EOS公司**发布了可用于生产金属[^13]的直接金属激光烧结（DMLS）和打印机技
术，而**以色列Object公司**则发明了PolyJet喷墨技术[^14]。在打印产品方面，来自美国
的 **Jim Kor 团队**创造了第一辆 3D 打印汽车 **Urbee** [^15]， **Organovo Medical
Corporation** 发布了第一个有机打印的血管数据[^16]和总部位于加利福尼亚的技术工程
公司，**Solid Concepts**，成功制造了世界上第一支 3D 打印的金属手枪[^17]。

三维打印技术引起了许多国家的关注，各国都加大了对这一创新的基础理论研究和应用推广
的投入。例如，美国成立了**美国制造联盟**，重点推广上述技术[^18]。同时，**德国弗
劳恩霍夫增材制造联盟**专门指导3D打印企业研究技术[^19]进步背后的基础理论。**英
国**也在中小学的教学课程中加入了**3D打印技术** [^20]。

出于本研究的目的，3D打印头盔的操作步骤如下：打开Cura切片软件，导入设计好的头盔模
型，将其放置在平台的中心并设置打印参数。由于模型体积大，精度要求高，头盔经过特殊
印刷和分层切割。

更具体地说，切割层高度设置为`0.08` 毫米，具体参数如 `Table 2` 所示。 将切片模型
输入`FDM 3D打印设备`进行物理打印，其中`PLA（聚乳酸）`用作打印材料，具有良好的柔
韧性和强度。**Fig.12** 举例说明了这种 3D 打印过程。实体打印完成后，对模型进行后
处理，包括去除支撑、拼接零件和对模型表面进行抛光/着色。打印后头盔的最终状态
如**Fig.13**所示。可以观察到打印出来的产品效果很好，真实地体现了最初的理念；因
此，它验证了设计的美学和可行性。

::: center | Table 2 | Parameter settings of 3D printing. | | | | | | | | |
:---| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | | Item | Slice
height | Packing density | Printing speed | Printing temperature | Hot bed
temperature | Platform attachment | Wire diameter | Nozzle size | | Value | 0.08
mm | 30% | 60 mm·s^-1^ | 200 °C | 60 °C | Brim | 1.75 mm | 0.4 mm |

![Fig.12](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/图片13.png)

Fig.12 Printing process of FDM 3D printer.

![Fig.13](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/图片14.png)

Fig.13 Final printed model. :::

## 5.结论

本研究将逆向工程技术、与设计相关的产品创新和快速成型技术相结合，构建了技术创新快
速发展的流程图，并将其应用于新产品开发。通过逆向工程完成快速数据采集和处理，识别
出人头形状的代表曲线。根据识别出的两组轮廓线，构建人体头部正面模型，使头盔更贴合
这部分身体的轮廓。最后，使用 3D 打印技术打印设计的头盔模型。

所提出的方法对于产品设计和开发的快速更新具有有益的参考价值。基
于`Geomagic Studio`的逆向工程软件和数据处理技术，进行点云数据处理、多边形处理和
表面处理，明确软件操作流程。随后，获得了完整的人体头部数字模型。对现有头盔的优化
设计，使模型内部曲线更加贴合佩戴者头部，佩戴更加舒适。此外，创新的功能配置为佩戴
者的行车安全提供了更好的保障。

头盔设计过程包括人头数据采集和横截面曲线创建，充分满足头盔的个性化需求，大大提高
了佩戴者的舒适度。本研究以相关技术软件为基础，在点云数据处理技术方面往往可以进一
步完善。由于3D打印过程中的材料限制，直接佩戴打印头盔时所体验到的安全性能略显不
足。尽管如此，所提出的方法可以显着缩短产品开发周期，以更快地满足市场需求并满足消
费者的个性化需求。

## 竞争利益声明

作者声明，他们不知道可能会影响本文报告的工作的已知竞争性经济利益或个人关系。

## 参考

[^1]:
    [1] G. Baronio, S. Harran, A. Signoroni, A Critical Analysis of a Hand
    Orthosis Reverse Engineering and 3D Printing Process, Appl. Bionics Biomech.
    2016 (2016) 1–7.

[^2]:
    [2] J. Zhang, Z. Yu, Overview of 3D printing technologies for reverse
    engineering product design, Aut. Control Comp. Sci. 50 (2) (2016) 91–97.

[^3]:
    [3] M. Lei, J. Lu, Z. Liu, W. Pan, Protection and development of handicrafts
    based on reverse engineering and 3D printing, Manufacturing Automation 36
    (9) (2014) 141–144.

[^4]:
    [4] G. Zhong, Application of Reverse Engineering and Rapid Prototyping
    Technology in New Chinese Furniture, Packaging Eng. 14 (10) (2019) 167–173.

[^5]:
    [5] Z. Li, W. Qi, W. Sun, B. Liu, Application of the integration of reverse
    engineering and rapid prototyping in modern product design, Machine Tool &
    Hydraulics 36 (12) (2007) 52–54, 73.

[^6]:
    [6] W. Tian, Y. Li, Application of Reverse Engineering and Rapid
    Manufacturing Technology in Artificial Prostheses, Manufacturing Automation
    36 (12) (2014) 19–23.

[^7]:
    [7] L. Wang, J. Liu, Liquid phase 3D printing for quickly manufacturing
    conductive metal objects with low melting point alloy ink, Sci. China
    Technol. Sci. 57 (9) (2014) 1721–1728.

[^8]:
    [8] B. Dong, X. Zhu, R. Yan, C. Zhang, Evaluation of Third-party Reverse
    Logistics Providers Based on Extension Superiority Method, Ingenierie des
    Systemes d’Information 24 (1) (2019) 101–105.

[^9]:
    [9] E.J. Parry, J.M. Best, C.E. Banks, Three-dimensional (3D) scanning and
    additive manufacturing (AM) allows the fabrication of customised crutch
    grips, Mater. Today Commun. 25 (2020) 101225, <https://doi.org/10.1016/j>.
    mtcomm.2020.101225.

[^10]:
    [10] X. Yang, Research on three-dimensional point cloud registration method
    based on normal vector, North University of China, 2016.

[^11]:
    [11] P. Li, M. Zheng, J. Jing, Application of image processing in online
    clothing size measurement, J. Electronic Measurement and Instrument 30 (8)
    (2016) 1214–1219.

[^12]:
    [12] R. Guo, S. Ying, L. Li, Automatic Construction of 3-D Valid Solids for
    3D `Cad`astral Objects Based on Facet Sets, Acta Geodaetica et Cartographica
    Sinica 41 (2012) 620–626.

[^13]:
    [13] A. Olwagen, J. Markgraaff, An investigation into the variation in
    porosity of a direct metal laser sintered artifact manufactured with the
    EOSINT M250 machine system using direct metal 20 powder, RAPDASA 2014 (2014)
    14–19.

[^14]:
    [14] A.T. Gaynor, N.A. Meisel, C.B. Williams, J.K. Guest, Multiple- material
    topology optimization of compliant mechanisms created via PolyJet
    three-dimensional printing, J. Manufacturing Sci. Eng. 136 (6) (2014).

[^15]:
    [15] C.J. Murray, Urbee Developer Shooting for 290 MPG, Design News 69 (2)
    (2011).

[^16]:
    [16] E.P. Neff, Printing cures: Organovo advances with 3D-printed liver
    tissue, Lab. Anim. 46 (3) (2017) 57.

[^17]:
    [17] L.E. Murr, Frontiers of 3D Printing/Additive Manufacturing: from Human
    Organs to Aircraft Fabricationy, J. Mater. Sci. Technol. 32 (10) (2016)
    987–995.

[^18]:
    [18] D.A. Roberson, D. Espalin, R.B. Wicker, 3D printer selection: A
    decision-making evaluation and ranking model, Virtual Phys. Prototyping 8
    (3) (2013) 201–212.

[^19]:
    [19] D. Brujic, M. Ristic, Monte Carlo simulation and analysis of free-form
    surface registration, Proc. Insti. Mech. Eng., Part B: J. Eng. Manuf. 211
    (8) (1997) 605–617.

[^20]:
    [20] K. Lueer, H. Biller, A. Casper, H. Windt, M. Mueller, P. Badorrek, D.
    Haefner, T. Framke, A. Koch, H. Ziehr, N. Krug, W. Koch, J.M. Hohlfeld,
    Safety, efficacy and repeatability of a novel house dust mite allergen
    challenge technique in the Fraunhofer allergen challenge chamber, Allergy 71
    (12) (2016) 1693–1700.
