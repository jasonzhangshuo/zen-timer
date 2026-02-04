#!/bin/bash

# Nginx 配置脚本
# 在服务器上执行

set -e

echo "=========================================="
echo "配置 Nginx"
echo "=========================================="

# 检查是否为 root
if [ "$EUID" -ne 0 ]; then 
    echo "请使用 sudo 运行此脚本"
    exit 1
fi

# 1. 备份默认配置
echo "📋 备份默认配置..."
if [ -f /etc/nginx/sites-enabled/default ]; then
    mv /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/default.bak
fi

# 2. 复制新配置
echo "📝 创建新配置..."
cat > /etc/nginx/sites-available/zen-timer << 'EOF'
server {
    listen 80;
    server_name zen.jason2026.top;
    
    root /home/ubuntu/zen-timer;
    index index.html;
    
    # 启用 gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss image/svg+xml;
    
    location / {
        try_files $uri $uri/ /index.html;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
    
    location ~* \.(mp3|MP3|jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    access_log /var/log/nginx/zen-timer-access.log;
    error_log /var/log/nginx/zen-timer-error.log;
}
EOF

# 3. 创建软链接
echo "🔗 启用配置..."
ln -sf /etc/nginx/sites-available/zen-timer /etc/nginx/sites-enabled/

# 4. 测试配置
echo "🧪 测试 Nginx 配置..."
nginx -t

# 5. 重启 Nginx
echo "🔄 重启 Nginx..."
systemctl restart nginx

echo ""
echo "=========================================="
echo "✅ Nginx 配置完成！"
echo "=========================================="
echo "配置文件: /etc/nginx/sites-available/zen-timer"
echo "项目目录: /home/ubuntu/zen-timer"
echo ""
echo "测试访问："
echo "http://zen.jason2026.top"
echo ""
echo "下一步：申请 SSL 证书"
echo "sudo certbot --nginx -d zen.jason2026.top"
echo "=========================================="
