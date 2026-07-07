@echo off
chcp 65001 >nul
echo =====================================
echo  Vid2Blog - 构建生产版本
echo =====================================
echo.

cd /d "E:\Vid2Blog海外项目\vid2blog-app"

echo [构建] 正在编译生产版本...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =====================================
    echo  构建成功！
    echo =====================================
    echo.
    echo 运行生产服务器: npm run start
) else (
    echo.
    echo 构建失败，请检查错误信息
)

pause
