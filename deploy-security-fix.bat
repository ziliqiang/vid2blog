@echo off
echo ====================================
echo Vid2Blog 安全修复部署脚本
echo ====================================
echo.
echo 修复内容：启用 Creem Webhook 签名验证
echo.

echo [1/3] 检查 Git 状态...
git status

echo.
echo [2/3] 提交修复...
git add src/app/api/creem-webhook/route.ts
git commit -m "Security Fix: Enable Creem webhook signature verification"

echo.
echo [3/3] 推送到 GitHub（Vercel 将自动部署）...
git push origin main

echo.
echo ====================================
echo ✅ 修复已推送！
echo ====================================
echo.
echo Vercel 将在 1-2 分钟内自动部署。
echo 部署完成后，请在 Creem 后台测试 Webhook。
echo.
pause
