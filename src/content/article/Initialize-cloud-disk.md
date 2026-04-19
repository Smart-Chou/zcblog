---
title: 初始化云硬盘
description: 初始化云硬盘
pubDate: 2021-11-30
image:
  url: 'https://pic.marxchou.com/api/random?zK8pL2'
  alt: 'wait-this-is-not-my-commit'
tags:
  - 云硬盘
---

## 操作场景

通过控制台创建的云硬盘在手动挂载后，作为轻量应用服务器的数据盘使用，默认为联机状
态。您需登录实例，对数据盘进行格式化、分区及创建文件系统等初始化操作使其可用。本
文介绍如何通过轻量应用服务器控制台，进行初始化云硬盘操作。

## 前提条件

已 [挂载云硬盘](https://cloud.tencent.com/document/product/1207/63926) 至轻量应
用服务器。

## 注意事项

- 您可先了解
  [云硬盘使用注意事项](https://cloud.tencent.com/document/product/362/17819#.E4.BA.91.E7.A1.AC.E7.9B.98.E4.BD.BF.E7.94.A8.E4.B8.8A.E6.9C.89.E4.BB.80.E4.B9.88.E6.B3.A8.E6.84.8F.E4.BA.8B.E9.A1.B9.EF.BC.9F)
  后再对云硬盘进行相关操作，以免损坏重要数据。
- 格式化数据盘会将数据全部清空，请确保数据盘中没有数据或已备份重要数据。
- 为避免服务发生异常，格式化前请确保轻量应用服务器已停止对外服务。

## 操作步骤

### 在裸设备上构建文件系统

:::note[说明]
本文将以 CentOS 8.0 操作系统为例，不同操作系统的格式化操作可能不
同，本文仅供参考。
:::

1.登录轻量应用服务器，详情请参见[使用 WebShell 方式登录 Linux 实例](https://cloud.tencent.com/document/product/1207/44642)。

2.执行以下命令，查看磁盘名称。

   ```shell
   sudo fdisk -l
   ```

   回显信息类似如下图，表示当前轻量应用服务器有两块磁盘，`/dev/vda`为 50GB 的系统
   盘，`/dev/vdb`是新增数据盘。

   ![磁盘信息](https://cdn.zcily.life/image/aad842b12fec3ca583790bff609c9fb7.png!WebP)

3.执行以下命令，对`/dev/vdb`裸设备直接创建文件系统格式。

   ```shell
   sudo mkfs -t <文件系统格式> /dev/vdb
   ```

4.不同文件系统支持的分区大小不同，请根据实际需求合理选择文件系统。以设置文件系统
为`EXT4`为例，则执行以下命令：

   ```shell
   sudo mkfs -t ext4 /dev/vdb
   ```

:::tip[注意]

格式化需要等待一段时间，请观察系统运行状态，不要退出。

:::

1.执行以下命令，新建挂载点。以新建挂载点`/data`为例，则执行以下命令：

   ```shell
   sudo mkdir /data
   ```

2.执行以下命令，将设备挂载至新建的挂载点。以新建挂载点`/data`为例，则执行以下命
   令：

   ```shell
   sudo mount /dev/vdb /data
   ```

3.执行以下命令，查看挂载结果。

   ```shell
   sudo df -TH
   ```

返回类似如下图所示信息，表示`/dev/vdb`已挂载至`/data`。

磁盘需在每次开机时挂载至实例，若您需设置开机自动挂载磁盘，请参考

Linux 实例开机自动挂载磁盘

进行设置。

## 相关操作

### Linux 实例开机自动挂载磁盘

1.确认挂载方式并获取对应信息。

   您可以根据业务需求选择使用文件系统的 UUID（universally unique identifier）或
   设备名称自动挂载磁盘，相关说明和信息获取方式如下：

   | 挂载方式            | 优缺点                                                                                                          | 信息获取方式                                              |
   | :------------------ | :-------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------- |
   | 使用文件系统的 UUID | 可能会因文件系统的 UUID 变化而导致自动挂载设置失效。 例如，重新格式化文件系统后，文件系统的 UUID 将会发生变化。 | 执行以下命令，查看文件系统的 UUID。 `sudo blkid /dev/vdb` |
   | 使用设备名称        | 可能会因设备名称变化而导致自动挂载设置失效。                                                                    | 执行以下命令，查看设备名称。 `sudo fdisk -l`              |

2.执行以下命令，备份`/etc/fstab`文件。以备份到`/home`目录下为例：

   ```shell
   sudo cp -r /etc/fstab /home
   ```

3.执行以下命令，使用 VI 编辑器打开`/etc/fstab`文件。

   ```shell
   sudo vi /etc/fstab
   ```

4.按 **i** 进入编辑模式。

5.将光标移至文件末尾，按**Enter**，添加如下内容。

   ```plaintext
   <设备信息> <挂载点> <文件系统格式> <文件系统安装选项> <文件系统转储频率> <启动时的文件系统检查顺序>
   ```

   - 以使用磁盘分区的 UUID 自动挂载为例，结合前文示例则添加：

   ```shell
   UUID=d489ca1c-5057-4536-81cb-ceb2847f9954 /data ext4 defaults 0 0
   ```

   若您需挂载分区，则结合前文示例则添加：

   ```shell
   UUID=d489ca1c-5057-4536-81cb-ceb2847f9954 /data/newpart ext4 defaults 0 2
   ```

   - 以使用设备名称自动挂载为例，结合前文示例则添加：

   ```shell
   /dev/vdb /data ext4 defaults 0 0
   ```

6.若您需挂载分区，则结合前文示例则添加：

   ```shell
   /dev/vdb1 /data/newpart /data/newpart ext4 defaults 0 2
   ```

   1.按 **Esc**，输入 **:wq** 并按 **Enter** 保存设置并退出编辑器。

   2.执行以下命令，检查/etc/fstab文件是否写入成功。

   ```shell
   sudo mount -a
   ```

7.如果运行通过则说明文件写入成功，新建的文件系统会在操作系统启动时自动挂载。
