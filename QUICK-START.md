# ⚡ 快速开始 - 5 分钟速查

## 🎯 目标
将禅修冥想计时器部署到：
- **Web**: https://zen.jason2026.top
- **小程序**: 通过 web-view 加载

---

## 📋 准备工作

- [x] 域名：jason2026.top（已有）
- [x] 服务器：62.234.130.117（已有）
- [ ] 微信小程序账号（需注册）

---

## 🚀 5 步部署

### 1️⃣ DNS 解析（5 分钟）
```
腾讯云 DNS → 添加 A 记录
主机记录：zen
记录值：62.234.130.117
```

### 2️⃣ 服务器环境（20 分钟）
```bash
scp server-setup/setup-server.sh ubuntu@62.234.130.117:/tmp/
ssh ubuntu@62.234.130.117 "sudo bash /tmp/setup-server.sh"
```

### 3️⃣ 部署项目（10 分钟）
```bash
./deploy-to-tencent.sh
```

### 4️⃣ 配置 Nginx + SSL（10 分钟）
```bash
# Nginx
scp server-setup/setup-nginx.sh ubuntu@62.234.130.117:/tmp/
ssh ubuntu@62.234.130.117 "sudo bash /tmp/setup-nginx.sh"

# SSL（先修改邮箱！）
scp server-setup/setup-ssl.sh ubuntu@62.234.130.117:/tmp/
ssh ubuntu@62.234.130.117 "sudo bash /tmp/setup-ssl.sh"
```

### 5️⃣ 小程序配置（60 分钟）
1. 注册小程序 → https://mp.weixin.qq.com/
2. 配置业务域名 → zen.jason2026.top
3. 下载校验文件 → 上传到服务器
4. 导入项目 → miniprogram 目录
5. 修改 AppID → project.config.json
6. 预览测试 → 上传发布

---

## 📞 关键命令

```bash
# 部署更新
./deploy-to-tencent.sh

# 查看日志
ssh ubuntu@62.234.130.117 "sudo tail -f /var/log/nginx/zen-timer-error.log"

# 重启 Nginx
ssh ubuntu@62.234.130.117 "sudo systemctl restart nginx"

# 验证 HTTPS
curl https://zen.jason2026.top
```

---

## ⚠️ 重要提醒

1. **SSL 证书申请前**：修改 setup-ssl.sh 中的邮箱
2. **小程序发布前**：必须配置业务域名
3. **校验文件**：必须可通过 HTTPS 访问

---

## 📖 详细文档

- [完整部署指南](DEPLOYMENT-GUIDE.md)
- [服务器配置](server-setup/README.md)
- [小程序开发](miniprogram/README.md)
