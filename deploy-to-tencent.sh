#!/bin/bash

# 腾讯云服务器部署脚本
# 服务器：62.234.130.117
# 域名：zen.jason2026.top

set -e

echo "=========================================="
echo "开始部署到腾讯云服务器"
echo "=========================================="

# 配置变量
SERVER_IP="62.234.130.117"
SERVER_USER="ubuntu"
REMOTE_DIR="/home/ubuntu/zen-timer"
DOMAIN="zen.jason2026.top"

# 1. 本地构建
echo "📦 步骤 1/4: 构建项目..."
npm run build

# 2. 创建临时部署包
echo "📦 步骤 2/4: 打包文件..."
cd dist
tar -czf ../zen-timer-dist.tar.gz *
cd ..

# 3. 上传到服务器
echo "🚀 步骤 3/4: 上传到服务器..."
scp zen-timer-dist.tar.gz ${SERVER_USER}@${SERVER_IP}:/tmp/

# 4. 在服务器上解压
echo "📂 步骤 4/4: 解压并部署..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    # 创建项目目录
    sudo mkdir -p /home/ubuntu/zen-timer
    sudo chown -R ubuntu:ubuntu /home/ubuntu/zen-timer
    
    # 解压文件
    cd /home/ubuntu/zen-timer
    tar -xzf /tmp/zen-timer-dist.tar.gz
    
    # 清理临时文件
    rm /tmp/zen-timer-dist.tar.gz
    
    echo "✅ 文件部署完成！"
    ls -lh /home/ubuntu/zen-timer/
ENDSSH

# 清理本地临时文件
rm zen-timer-dist.tar.gz

echo ""
echo "=========================================="
echo "✅ 部署完成！"
echo "=========================================="
echo "项目目录: ${REMOTE_DIR}"
echo "域名: https://${DOMAIN}"
echo ""
echo "下一步："
echo "1. 配置 DNS 解析（zen.jason2026.top -> 62.234.130.117）"
echo "2. 配置 Nginx（运行 setup-nginx.sh）"
echo "3. 申请 SSL 证书（运行 setup-ssl.sh）"
echo "=========================================="
