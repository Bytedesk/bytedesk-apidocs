# CI/CD

```bash
# 打包上传到服务器
pnpm release
# 赋予执行权限
chmod +x cicd/scripts/build-upload.sh
chmod +x cicd/scripts/build-open.sh
# 执行
sh cicd/scripts/build-upload.sh
# 
sh cicd/scripts/build-open.sh
```

## 自动同步和提交

```bash
# 定时提交
chmod +x cicd/scripts/auto-commit
sh cicd/scripts/auto-commit
# 定时自动提交
./cicd/scripts/auto-commit
# 后台运行自动提交
# nohup ./cicd/scripts/auto-commit
nohup ./cicd/scripts/auto-commit > nohup.out 2>&1 &
# 终止自动提交
pkill -f auto-commit
# ps aux | grep auto-commit 找到进程 ID，然后用 kill 命令终止它
```

- [参考](https://juejin.cn/post/7057776355450028045)
- [参考](https://blog.csdn.net/weixin_43233914/article/details/134186796)
