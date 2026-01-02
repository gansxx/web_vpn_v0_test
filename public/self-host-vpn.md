# 流程
**自建VPN，整个教程分四步**：

- 第一步：[购买VPS服务器](#note1)
- 第二步：[远程连接服务器](#note2)
- 第三步：[一键部署网络测试代理](#note3)
- 第四步：[(可选)一键管理远程实例](#note4)

# 1. 购买VPS

**VPS服务器需要选择非受限地区的，推荐[vultur](https://www.vultr.com/?ref=9778763)**,vultur最大的优势在于
- 1.它是按时间计价
- 2.上手轻松，无需配置安全组，IAM等进阶内容，最适合新手

- **vultr注册地址**：[https://www.vultr.com](https://www.vultr.com/?ref=9778763) （vps最低3.5美元/月，vultr全球32个服务器位置可选，包括洛杉矶、韩国、新加坡、日本、德国、荷兰等。支持支付宝和paypal付款。）

[![Vultr Logo](/images/self-host/vultr-logo.png)](https://www.vultr.com/?ref=9778763)


注册并邮件激活账号，充值后即可购买服务器。充值方式是支付宝,paypal,或银行卡，使用paypal有银行卡（包括信用卡）即可。paypal注册地址：[https://www.paypal.com](https://www.paypal.com/) （paypal是国际知名的第三方支付服务商，注册一下账号，绑定银行卡即可购买国外商品）

---

**注意：3.5美元套餐只提供ipv6 ip，一般的电脑用不了，所以建议选择3.5美元及以上的套餐。**

vultr实际上是折算成小时来计费的，比如服务器是5美元1个月，那么每小时收费为5/30/24=0.0069美元 会自动从账号中扣费，只要保证账号有钱即可。如果你部署的服务器实测后速度不理想，你可以把它删掉（destroy），重新换个地区的服务器来部署，方便且实用。因为新的服务器就是新的ip，所以当ip被墙时这个方法很有用。当ip被墙时，为了保证新开的服务器ip和原先的ip不一样，先开新服务器，开好后再删除旧服务器即可。在账号的Account——Make a payment选项里可以看到账户余额。

**账号充值如图**：

![账号充值](/images/self-host/account-recharge.jpeg)
- 依次点击Account——Make a payment——Alipay(支付宝)

---

## 开通VPS

![最新部署](/images/self-host/deployment-latest.jpeg)

- **点击网页右上角的Deploy图标**

![Deploy图标](/images/self-host/deploy-icon.jpeg)
- **在下拉菜单中，点击Deploy New Server**

![Deploy New Server](/images/self-host/deploy-new-server.jpeg)

- **服务器类型选择Cloud Compute-Shared CPU**

![服务器类型](/images/self-host/server-type.jpeg)

- **选择服务器位置**。不同的服务器位置速度会有所不同，有的服务器的最低价格会不同，一般纽约等位置的价格最低，有3.5美元/月的，可根据自己的需求来选择。==推荐洛杉矶服务器==，延迟较低且比较稳定。

![服务器位置](/images/self-host/server-location.png)

- **选择系统**,点击图中的系统名字，会弹出具体系统版本，==推荐Debian系统==。

![系统选择](/images/self-host/os-selection.jpeg)

- **选择服务器套餐**。根据自己的需求来选择，如果服务器位置定了，套餐不影响速度，影响流量和配置，一般用的人数少，选择低配置就够了。便宜的套餐，点击Regular Cloud Compute，选择第一个套餐，提示升级选择No Thanks。

![服务器套餐](/images/self-host/server-plan.jpeg)

- **关闭自动备份Auto Backups**，这个是收费的。点击它，在右侧的I understand the risk前面选择勾，然后点击Disable Auto Backups即可关闭自动备份。

![关闭自动备份](/images/self-host/auto-backups.jpeg)

最后点击“Deploy Now”开始部署，等6~10分钟就差不多了。

==**完成购买后，找到系统的密码记下来，部署服务器时需要用到。vps系统的密码获取方法如下图：**==

![VPS密码获取](/images/self-host/vps-password.jpeg)

- 点击Products——Compute就可以看到购买的服务器列表

![Products Compute菜单](/images/self-host/products-compute.jpeg)

![服务器列表](/images/self-host/server-list.jpeg)

- 在服务器的最右边，点击三个点，再点击**Server Details**就可以看到该服务器的详细信息。

![Server Details](/images/self-host/server-details.jpeg)

- 服务器ip和系统密码可以看到并能复制。

## **删掉服务器步骤如下图**：

- 删除服务器时，先开新的服务器后再删除旧服务器，这样可以保证新服务器的ip与旧ip不同。

![删除服务器步骤1](/images/self-host/delete-server-1.png)

![删除服务器步骤2](/images/self-host/delete-server-2.png)
# 2. 部署远程服务器
- 在windows系统上安装 OpenSSH 工具（包含 ssh.exe 和 scp.exe，可通过 Windows 设置 > 应用 > 可选功能 > 添加 OpenSSH 客户端,（==已安装的可以跳过==）

- 通过下面命令直接远程连接云端命令行
```bash
ssh root@服务器ip
```

# 3. 一键部署网络测试代理

- 在终端中输入该命令，会自动一键配置好远程代理服务器，（==该脚本用于debian和ubuntu系统，选系统时一定要注意==）
```bash
bash <(wget -qO- https://raw.githubusercontent.com/gansxx/net_tools/main/sb.sh)
```
- （可选）如果有需要更多手动配置的脚本，执行该命令，然后按照说明自己配置服务器
```bash
bash <(curl -Ls https://raw.githubusercontent.com/yonggekkk/sing-box-yg/main/sb.sh)
```
- 等待脚本执行完成，然后复制粘贴最后生成的四合一链接
- ![二维码生成](/images/self-host/qr-code.jpeg)

脚本会自动完成：
- 安装 sing-box(VPN) 核心
- 生成 4 种主流协议节点（vless / vmess / hysteria2 / tuic），支持（v2rayN,hiddify）等客户端
输出二维码 + 通用订阅链接，下载客户端，导入链接即可

## 客户端下载和导入教程
- 客户端下载和导入教程请注册登录后查看文档中心
[客户端下载](/signin)

# 4. 自动VPN生命周期管理(可选)
- 如果你需要实现自动的VPN实例管理以实现节省成本,(在不使用时自动关闭以节省成本)，或希望体验ai全自动部署
- 请务必现在**[注册账号](/signin)**，我们会通过邮件邀请部分用户免费体验我们正在开发中的自动实例管理版VPN
- 同时，如果你有任何配置上的问题，也可以直接通过tesssuunmao@gmail.com联系我们