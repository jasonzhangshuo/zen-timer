# 腾讯云服务器部署指南

## 📋 服务器信息

- **服务器 IP**: 62.234.130.117
- **域名**: zen.jason2026.top
- **操作系统**: Ubuntu 22.04
- **项目目录**: /home/ubuntu/zen-timer

---

## 🚀 快速部署（5 步完成）

### Step 1: 配置 DNS 解析

登录腾讯云 DNS 控制台，添加 A 记录：

```
记录类型：A
主机记录：zen
记录值：62.234.130.117
TTL：600
```

验证解析：
```bash
ping zen.jason2026.top
```

---

### Step 2: 配置服务器环境

SSH 登录服务器：
```bash
ssh ubuntu@62.234.130.117
```

上传并运行环境配置脚本：
```bash
# 上传脚本（在本地执行）
scp server-setup/setup-server.sh ubuntu@62.234.130.117:/tmp/

# 在服务器上执行
ssh ubuntu@62.234.130.117
sudo bash /tmp/setup-server.sh
```

---

### Step 3: 部署项目文件

**方式 A：使用自动部署脚本（推荐）**

在本地项目目录执行：
```bash
chmod +x deploy-to-tencent.sh
./deploy-to-tencent.sh
```

**方式 B：手动部署**

```bash
# 1. 本地构建
npm run build

# 2. 上传到服务器
scp -r dist/* ubuntu@62.234.130.117:/home/ubuntu/zen-timer/
```

---

### Step 4: 配置 Nginx

上传并运行 Nginx 配置脚本：
```bash
# 上传脚本
scp server-setup/setup-nginx.sh ubuntu@62.234.130.117:/tmp/

# 在服务器上执行
ssh ubuntu@62.234.130.117
sudo bash /tmp/setup-nginx.sh
```

测试访问：
```
http://zen.jason2026.top
```

---

### Step 5: 申请 SSL 证书

**重要：修改邮箱地址**

编辑 `setup-ssl.sh`，将 `your-email@example.com` 替换为你的邮箱。

上传并运行 SSL 配置脚本：
```bash
# 上传脚本
scp server-setup/setup-ssl.sh ubuntu@62.234.130.117:/tmp/

# 在服务器上执行
ssh ubuntu@62.234.130.117
sudo bash /tmp/setup-ssl.sh
```

完成后访问：
```
https://zen.jason2026.top
```

---

## 🔧 常用命令

### 查看 Nginx 状态
```bash
sudo systemctl status nginx
```

### 重启 Nginx
```bash
sudo systemctl restart nginx
```

### 查看 Nginx 日志
```bash
# 访问日志
sudo tail -f /var/log/nginx/zen-timer-access.log

# 错误日志
sudo tail -f /var/log/nginx/zen-timer-error.log
```

### 查看 SSL 证书信息
```bash
sudo certbot certificates
```

### 手动续期 SSL 证书
```bash
sudo certbot renew
```

---

## 📱 小程序配置

### 1. 注册微信小程序

访问：https://mp.weixin.qq.com/

### 2. 配置业务域名

1. 登录小程序后台
2. 进入"开发 → 开发管理 → 开发设置 → 业务域名"
3. 添加：`zen.jason2026.top`
4. 下载校验文件
5. 上传到服务器：
```bash
scp 校验文件.txt ubuntu@62.234.130.117:/home/ubuntu/zen-timer/
```

### 3. 创建小程序项目

创建 `pages/webview/webview.wxml`：
```xml
<web-view src="https://zen.jason2026.top"></web-view>
```

创建 `pages/webview/webview.js`：
```javascript
Page({
  onShareAppMessage() {
    return {
      title: '禅修冥想计时器 - 寻径·归真',
      path: '/pages/webview/webview'
    }
  }
})
```

创建 `app.json`：
```json
{
  "pages": [
    "pages/webview/webview"
  ],
  "window": {
    "navigationBarTitleText": "寻径·归真",
    "navigationBarBackgroundColor": "#000000",
    "navigationBarTextStyle": "white"
  }
}
```

---

## 🔄 更新部署

每次更新代码后，只需运行：
```bash
./deploy-to-tencent.sh
```

---

## ⚠️ 故障排查

### 问题 1：无法访问网站

检查 Nginx 状态：
```bash
sudo systemctl status nginx
```

检查防火墙：
```bash
sudo ufw status
```

### 问题 2：SSL 证书申请失败

确保：
1. DNS 解析已生效（ping zen.jason2026.top）
2. 80 端口可访问（http://zen.jason2026.top）
3. 邮箱地址正确

### 问题 3：小程序无法加载

检查：
1. 业务域名是否配置正确
2. HTTPS 是否正常（https://zen.jason2026.top）
3. 校验文件是否上传

---

## 📞 技术支持

如有问题，检查日志：
```bash
# Nginx 错误日志
sudo tail -100 /var/log/nginx/zen-timer-error.log

# 系统日志
sudo journalctl -u nginx -n 50
```
