@echo off
chcp 65001 >nul
echo =====================================
echo  Vid2Blog - 启动开发服务器
echo =====================================
echo.

cd /d "E:\Vid2Blog海外项目\vid2blog-app"

echo [检查] 环境变量配置...
if not exist ".env.local" (
    echo [警告] 未找到 .env.local 文件！
    echo 请先复制 .env.example 为 .env.local 并填写真实配置
    echo.
    pause
    exit /b
)

echo [启动] 开发服务器...
echo 浏览器访问: http://localhost:3000
echo 按 Ctrl+C 停止
echo.

npm run dev
pause
