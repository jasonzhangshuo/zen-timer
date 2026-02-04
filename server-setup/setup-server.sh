#!/bin/bash

# 服务器环境配置脚本
# 在腾讯云服务器上执行此脚本

set -e

echo "=========================================="
echo "腾讯云服务器环境配置"
echo "=========================================="

# 检查是否为 root 或有 sudo 权限
if [ "$EUID" -ne 0 ]; then 
    echo "请使用 sudo 运行此脚本"
    exit 1
fi

# 1. 更新系统
echo "📦 步骤 1/5: 更新系统..."
apt update && apt upgrade -y

# 2. 安装 Nginx
echo "📦 步骤 2/5: 安装 Nginx..."
apt install nginx -y
systemctl enable nginx
systemctl start nginx

# 3. 安装 Certbot（SSL 证书工具）
echo "📦 步骤 3/5: 安装 Certbot..."
apt install certbot python3-certbot-nginx -y

# 4. 配置防火墙
echo "🔒 步骤 4/5: 配置防火墙..."
ufw allow 'Nginx Full'
ufw allow OpenSSH
echo "y" | ufw enable

# 5. 创建项目目录
echo "📂 步骤 5/5: 创建项目目录..."
mkdir -p /home/ubuntu/zen-timer
chown -R ubuntu:ubuntu /home/ubuntu/zen-timer

echo ""
echo "=========================================="
echo "✅ 服务器环境配置完成！"
echo "=========================================="
echo "Nginx 版本: $(nginx -v 2>&1)"
echo "Certbot 版本: $(certbot --version)"
echo ""
echo "下一步："
echo "1. 上传项目文件到 /home/ubuntu/zen-timer"
echo "2. 配置 Nginx（复制 nginx-config.conf）"
echo "3. 申请 SSL 证书"
echo "=========================================="
