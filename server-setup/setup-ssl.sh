#!/bin/bash

# SSL 证书申请脚本
# 在服务器上执行

set -e

echo "=========================================="
echo "申请 SSL 证书"
echo "=========================================="

# 检查是否为 root
if [ "$EUID" -ne 0 ]; then 
    echo "请使用 sudo 运行此脚本"
    exit 1
fi

DOMAIN="zen.jason2026.top"
EMAIL="your-email@example.com"  # 请替换为你的邮箱

echo "域名: $DOMAIN"
echo "邮箱: $EMAIL"
echo ""
read -p "确认信息无误？(y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "已取消"
    exit 1
fi

# 申请证书
echo "📜 申请 SSL 证书..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect

# 测试自动续期
echo "🔄 测试自动续期..."
certbot renew --dry-run

echo ""
echo "=========================================="
echo "✅ SSL 证书配置完成！"
echo "=========================================="
echo "访问地址: https://$DOMAIN"
echo "证书有效期: 90 天"
echo "自动续期: 已配置"
echo ""
echo "证书信息："
certbot certificates
echo "=========================================="
