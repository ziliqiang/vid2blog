@echo off
echo ================================================
echo Vid2Blog 部署监控脚本
echo ================================================
echo.
echo [1] 推送代码到 GitHub
echo 执行命令: git push origin main
echo.
pause
echo.
echo [2] 等待 Vercel 检测变更（约 10 秒）
timeout /t 10 /nobreak
echo.
echo [3] 打开 Vercel Dashboard 查看部署状态
start https://vercel.com/vid2blog/vid2blog
echo.
echo [4] 等待部署完成（约 1-2 分钟）
echo 部署成功后会显示绿色勾号 ✓
echo.
pause
echo.
echo [5] 验证生产环境
start https://vid2blog.aitk.asia
echo.
echo ================================================
echo 部署完成！开始手动测试
echo ================================================
pause
