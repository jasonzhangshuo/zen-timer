# 🚀 禅修冥想计时器 - 完整部署指南

## 📋 项目信息

- **项目名称**: 禅修冥想计时器 - 寻径·归真
- **技术栈**: React + Vite + Tailwind CSS + Framer Motion
- **部署方案**: 腾讯云服务器 + 微信小程序 web-view
- **域名**: zen.jason2026.top
- **服务器**: 62.234.130.117 (Ubuntu 22.04)

---

## 🎯 部署架构

```
用户访问小程序
    ↓
小程序 web-view 组件
    ↓
加载 https://zen.jason2026.top
    ↓
腾讯云服务器 (Nginx)
    ↓
React 应用 (静态文件)
```

**优势：**
- ✅ 100% 保留所有动画效果
- ✅ 零代码改造
- ✅ 快速上线（2-3 小时）
- ✅ 易于维护（只需维护 Web 版）

---

## 📅 部署时间线

| 步骤 | 预计时间 | 说明 |
|-----|---------|------|
| 1. DNS 解析 | 5 分钟 | 添加 A 记录 |
| 2. 服务器环境 | 20 分钟 | 安装 Nginx、Certbot |
| 3. 部署项目 | 10 分钟 | 上传并配置 |
| 4. 配置 Nginx | 5 分钟 | 配置虚拟主机 |
| 5. 申请 SSL | 5 分钟 | Let's Encrypt 证书 |
| 6. 注册小程序 | 30 分钟 | 微信公众平台 |
| 7. 配置业务域名 | 10 分钟 | 上传校验文件 |
| 8. 开发调试 | 20 分钟 | 微信开发者工具 |
| **总计** | **约 2 小时** | 不含审核时间 |

---

## 🚀 快速开始（5 步完成）

### Step 1: 配置 DNS 解析 ⏱️ 5 分钟

1. 登录腾讯云 DNS 控制台
2. 找到域名 `jason2026.top`
3. 添加 A 记录：

```
记录类型：A
主机记录：zen
记录值：62.234.130.117
TTL：600
```

4. 验证解析：
```bash
ping zen.jason2026.top
# 应该返回 62.234.130.117
```

---

### Step 2: 配置服务器环境 ⏱️ 20 分钟

SSH 登录服务器：
```bash
ssh ubuntu@62.234.130.117
```

上传并运行环境配置脚本：
```bash
# 在本地执行（上传脚本）
cd /Users/dada/zen-timer-1
scp server-setup/setup-server.sh ubuntu@62.234.130.117:/tmp/

# 在服务器上执行
ssh ubuntu@62.234.130.117
sudo bash /tmp/setup-server.sh
```

脚本会自动安装：
- ✅ Nginx
- ✅ Certbot (SSL 证书工具)
- ✅ 配置防火墙
- ✅ 创建项目目录

---

### Step 3: 部署项目文件 ⏱️ 10 分钟

**方式 A：一键部署（推荐）**

在本地项目目录执行：
```bash
cd /Users/dada/zen-timer-1
chmod +x deploy-to-tencent.sh
./deploy-to-tencent.sh
```

脚本会自动：
1. 构建项目 (`npm run build`)
2. 打包文件
3. 上传到服务器
4. 解压到项目目录

**方式 B：手动部署**

```bash
# 1. 构建
npm run build

# 2. 打包
cd dist
tar -czf ../zen-timer-dist.tar.gz *
cd ..

# 3. 上传
scp zen-timer-dist.tar.gz ubuntu@62.234.130.117:/tmp/

# 4. 解压
ssh ubuntu@62.234.130.117
mkdir -p /home/ubuntu/zen-timer
cd /home/ubuntu/zen-timer
tar -xzf /tmp/zen-timer-dist.tar.gz
```

---

### Step 4: 配置 Nginx + SSL ⏱️ 10 分钟

#### 4.1 配置 Nginx

```bash
# 上传脚本
scp server-setup/setup-nginx.sh ubuntu@62.234.130.117:/tmp/

# 在服务器上执行
ssh ubuntu@62.234.130.117
sudo bash /tmp/setup-nginx.sh
```

测试访问：
```bash
curl http://zen.jason2026.top
# 应该返回 HTML 内容
```

#### 4.2 申请 SSL 证书

**重要：先修改邮箱！**

编辑 `server-setup/setup-ssl.sh`，将 `your-email@example.com` 替换为你的邮箱。

```bash
# 上传脚本
scp server-setup/setup-ssl.sh ubuntu@62.234.130.117:/tmp/

# 在服务器上执行
ssh ubuntu@62.234.130.117
sudo bash /tmp/setup-ssl.sh
```

完成后访问：
```bash
curl https://zen.jason2026.top
# 应该返回 HTML 内容
```

---

### Step 5: 配置小程序 ⏱️ 60 分钟

#### 5.1 注册微信小程序

1. 访问：https://mp.weixin.qq.com/
2. 点击"立即注册"
3. 选择"小程序"
4. 填写信息（邮箱、密码）
5. 激活邮箱
6. 选择主体类型（个人/企业）
7. 完成注册，获取 AppID

#### 5.2 配置业务域名

**这是最关键的一步！**

1. 登录小程序后台
2. 进入"开发 → 开发管理 → 开发设置"
3. 找到"业务域名"，点击"添加"
4. 输入：`zen.jason2026.top`
5. 下载校验文件（例如：`WxVerifyFile.txt`）
6. 上传校验文件到服务器：

```bash
# 假设下载的文件名为 WxVerifyFile.txt
scp ~/Downloads/WxVerifyFile.txt ubuntu@62.234.130.117:/home/ubuntu/zen-timer/
```

7. 验证可访问：
```bash
curl https://zen.jason2026.top/WxVerifyFile.txt
# 应该返回校验文件内容
```

8. 回到小程序后台，点击"验证"
9. 验证成功后，业务域名配置完成 ✅

#### 5.3 创建小程序项目

1. 下载微信开发者工具：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
2. 安装并打开
3. 选择"导入项目"
4. 项目目录：选择 `/Users/dada/zen-timer-1/miniprogram`
5. AppID：填入你的小程序 AppID
6. 项目名称：禅修冥想计时器
7. 点击"导入"

#### 5.4 修改配置

编辑 `miniprogram/project.config.json`：
```json
{
  "appid": "你的小程序AppID"
}
```

#### 5.5 开发调试

1. 点击"编译"
2. 如果提示"不在业务域名列表中"：
   - 点击右上角"详情"
   - 勾选"不校验合法域名"（仅开发时）
   - 重新编译
3. 应该能看到你的应用了！

#### 5.6 真机预览

1. 点击工具栏"预览"
2. 扫描二维码
3. 在手机上测试所有功能

#### 5.7 上传发布

1. 点击工具栏"上传"
2. 填写版本号（例如：1.0.0）
3. 填写备注（例如：首次发布）
4. 登录小程序后台
5. 进入"管理 → 版本管理"
6. 找到刚上传的版本，点击"提交审核"
7. 填写审核信息：
   - 服务类目：工具 → 计时器
   - 标签：冥想、计时、禅修
   - 功能描述：禅修冥想计时器，支持音频引导和倒计时
8. 提交审核
9. 等待审核（1-7 天）
10. 审核通过后点击"发布"

---

## 📁 项目结构

```
zen-timer-1/
├── dist/                          # 构建产物（自动生成）
├── server-setup/                  # 服务器配置脚本
│   ├── setup-server.sh           # 环境配置
│   ├── setup-nginx.sh            # Nginx 配置
│   ├── setup-ssl.sh              # SSL 证书申请
│   ├── nginx-config.conf         # Nginx 配置文件
│   └── README.md                 # 服务器部署文档
├── miniprogram/                   # 小程序项目
│   ├── pages/
│   │   └── webview/              # web-view 页面
│   ├── app.js                    # 小程序入口
│   ├── app.json                  # 小程序配置
│   ├── project.config.json       # 项目配置
│   └── README.md                 # 小程序文档
├── deploy-to-tencent.sh          # 一键部署脚本
└── DEPLOYMENT-GUIDE.md           # 本文档
```

---

## 🔄 日常更新流程

修改代码后，只需运行：

```bash
cd /Users/dada/zen-timer-1
./deploy-to-tencent.sh
```

脚本会自动：
1. 构建最新代码
2. 上传到服务器
3. 替换旧文件

小程序无需重新发版，用户刷新即可看到更新！

---

## 🔧 常用命令

### 服务器管理

```bash
# 查看 Nginx 状态
sudo systemctl status nginx

# 重启 Nginx
sudo systemctl restart nginx

# 查看访问日志
sudo tail -f /var/log/nginx/zen-timer-access.log

# 查看错误日志
sudo tail -f /var/log/nginx/zen-timer-error.log

# 查看 SSL 证书信息
sudo certbot certificates

# 手动续期 SSL 证书
sudo certbot renew
```

### 项目管理

```bash
# 本地开发
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview

# 部署到服务器
./deploy-to-tencent.sh
```

---

## ⚠️ 故障排查

### 问题 1：无法访问 https://zen.jason2026.top

**检查清单：**
1. DNS 解析是否生效？
```bash
ping zen.jason2026.top
```

2. Nginx 是否运行？
```bash
sudo systemctl status nginx
```

3. 防火墙是否开放？
```bash
sudo ufw status
```

4. SSL 证书是否有效？
```bash
sudo certbot certificates
```

### 问题 2：小程序 web-view 白屏

**检查清单：**
1. 业务域名是否配置成功？
2. 校验文件是否可访问？
```bash
curl https://zen.jason2026.top/WxVerifyFile.txt
```
3. HTTPS 是否正常？
4. 开发者工具是否勾选"不校验合法域名"？

### 问题 3：音频无法播放

**原因：**
小程序限制，音频需要用户手动触发。

**解决：**
已在代码中处理，用户点击播放按钮即可。

### 问题 4：部署脚本执行失败

**检查：**
1. 是否有执行权限？
```bash
chmod +x deploy-to-tencent.sh
```

2. SSH 是否可以免密登录？
```bash
ssh ubuntu@62.234.130.117
```

如果需要密码，配置 SSH 密钥：
```bash
ssh-copy-id ubuntu@62.234.130.117
```

---

## 📊 性能优化

### 已实现的优化

1. ✅ Gzip 压缩（Nginx）
2. ✅ 静态资源缓存（30 天）
3. ✅ 图片懒加载
4. ✅ 代码分割（Vite）
5. ✅ 音频预加载

### 可选优化

1. **CDN 加速**（如果用户量大）
   - 使用腾讯云 CDN
   - 加速静态资源和音频文件

2. **图片优化**
   - 使用 WebP 格式
   - 压缩背景图片

3. **音频优化**
   - 使用更高压缩率的格式
   - 考虑使用 OSS 存储

---

## 💰 成本估算

| 项目 | 费用 | 周期 |
|-----|------|------|
| 域名 | 已有 | 2027-01-19 到期 |
| 服务器 | 已有 | - |
| SSL 证书 | 免费 | Let's Encrypt |
| 小程序注册 | 免费（个人）/ 300元（企业） | 一次性 |
| 小程序认证 | 0元（个人）/ 300元/年（企业） | 年付 |
| **总计** | **0-600 元** | - |

---

## 📞 技术支持

### 文档资源

- [服务器部署文档](server-setup/README.md)
- [小程序开发文档](miniprogram/README.md)
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)

### 常见问题

遇到问题时：
1. 查看相关日志
2. 检查配置是否正确
3. 参考本文档故障排查部分

---

## ✅ 部署检查清单

部署完成后，逐项检查：

### 服务器部署
- [ ] DNS 解析生效（ping zen.jason2026.top）
- [ ] HTTP 可访问（http://zen.jason2026.top）
- [ ] HTTPS 可访问（https://zen.jason2026.top）
- [ ] 所有页面正常显示
- [ ] 音频可以播放
- [ ] 动画效果正常
- [ ] 移动端适配正常

### 小程序配置
- [ ] 小程序已注册
- [ ] 业务域名已配置
- [ ] 校验文件已上传
- [ ] 开发者工具可正常预览
- [ ] 真机预览正常
- [ ] 所有功能可用
- [ ] 已提交审核

---

## 🎉 完成！

恭喜！你已经完成了从 Web 应用到小程序的完整部署。

现在你有：
- ✅ 一个运行在 https://zen.jason2026.top 的 Web 应用
- ✅ 一个通过 web-view 加载 H5 的微信小程序
- ✅ 100% 保留了所有动画和交互效果
- ✅ 零代码改造，易于维护

享受你的禅修冥想计时器吧！🧘‍♂️
