# 部署说明

**后续更新以本服务器为主**，国内访问走此地址。

| 环境     | 地址 |
|----------|------|
| **正式（国内）** | http://115.191.26.38 |
| 海外备用 | https://zen-timer-rho.vercel.app |

---

## 一、在服务器上（SSH 登录后执行，仅首次或换机时需要）

```bash
# 1. 安装 Nginx（若已安装可跳过）
apt update && apt install -y nginx

# 2. 创建网站目录
mkdir -p /var/www/zen-timer

# 3. 设置权限（给 Nginx 读）
chown -R www-data:www-data /var/www/zen-timer
chmod -R 755 /var/www/zen-timer
```

然后创建 Nginx 配置：

```bash
cat > /etc/nginx/sites-available/zen-timer << 'EOF'
server {
    listen 80;
    server_name 115.191.26.38;
    root /var/www/zen-timer;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
    location ~* \.(js|css|mp3|png|jpg|jpeg|ico|woff2)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# 启用站点并重载 Nginx
ln -sf /etc/nginx/sites-available/zen-timer /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

**若 80 端口被占用**：先 `ls /etc/nginx/sites-enabled/` 看是否有默认站，有则 `rm /etc/nginx/sites-enabled/default` 再执行上面的 `ln` 和 `nginx -t && systemctl reload nginx`。

---

## 二、在本机构建并上传（每次发版都做）

```bash
# 1. 构建
npm ci
npm run build

# 2. 上传 dist 到服务器（把 root 改成你的 SSH 用户名，若用密钥把下面改成用 -i 你的密钥）
rsync -avz --delete dist/ root@115.191.26.38:/var/www/zen-timer/
```

提示输入 SSH 密码时，输入你该服务器的 root 密码即可。

---

## 三、访问

浏览器打开：**http://115.191.26.38**

若打不开，请检查：
- 火山引擎控制台该实例的**安全组**是否放行 **80** 端口（入方向）。

---

## 日常更新（推荐流程）

代码合并到 `main` 或 `develop` 后，在本机项目目录执行：

```bash
npm run build
rsync -avz --delete dist/ root@115.191.26.38:/var/www/zen-timer/
```

即可把最新版本发布到 http://115.191.26.38 。  
如需先安装依赖再构建：`npm ci && npm run build`，再执行上面的 `rsync`。
