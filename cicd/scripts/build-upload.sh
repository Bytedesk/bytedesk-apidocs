#!/usr/bin/env sh

# 本地路径
# 构建输出目录（Vite 默认输出 dist，这里以 dist 为主，兼容旧的 build）
DIST=dist
# 服务器地址
SERVER_HOST_WEIYU=124.220.58.234
SERVER_HOST_BYTEDESK=118.178.126.119
# 服务器路径
TARGET_DIST_WEIYU=/var/www/html/weiyuai/apidocs/
TARGET_DIST_BYTEDESK=/var/www/html/bytedesk/apidocs/

# 失败即退出
set -eu
# 尝试开启 pipefail（某些 sh 不支持，可忽略失败）
(
	set -o | grep -q "pipefail" && set -o pipefail
) 2>/dev/null || true

# 使用 Vite 构建，默认产物位于 dist
echo "[build-upload] Building docs with Vite..."
pnpm build

# 如果 dist 目录不存在或为空，则尝试使用 build 目录作为回退
if [ ! -d "$DIST" ] || [ -z "$(ls -A "$DIST" 2>/dev/null)" ]; then
	if [ -d "build" ] && [ -n "$(ls -A "build" 2>/dev/null)" ]; then
		echo "[build-upload] WARN: dist 不存在或为空，使用 build 目录作为回退。"
		DIST=build
	else
		echo "[build-upload] ERROR: 未找到可上传的构建产物（dist 或 build）。"
		exit 1
	fi
fi

# 允许通过设置 DRY_RUN=1 进行演练，不实际执行远程变更
if [ "${DRY_RUN:-0}" = "1" ]; then
	echo "[build-upload] DRY_RUN 模式：将会执行以下操作（未真正执行）："
	echo " - 清理远程目录: $SERVER_HOST_WEIYU:${TARGET_DIST_WEIYU}*"
	echo " - 清理远程目录: $SERVER_HOST_BYTEDESK:${TARGET_DIST_BYTEDESK}*"
	echo " - 上传目录: $DIST -> $SERVER_HOST_WEIYU:$TARGET_DIST_WEIYU"
	echo " - 上传目录: $DIST -> $SERVER_HOST_BYTEDESK:$TARGET_DIST_BYTEDESK"
else
	# 先通过ssh删除服务器上的 target_dist 文件夹中的内容
	echo "[build-upload] Cleaning remote directories..."
	ssh root@$SERVER_HOST_WEIYU "rm -rf ${TARGET_DIST_WEIYU}*"
	ssh root@$SERVER_HOST_BYTEDESK "rm -rf ${TARGET_DIST_BYTEDESK}*"

	# 上传到服务器
	echo "[build-upload] Uploading to $SERVER_HOST_WEIYU ..."
	scp -r ./$DIST/* root@$SERVER_HOST_WEIYU:$TARGET_DIST_WEIYU
	echo "[build-upload] Uploading to $SERVER_HOST_BYTEDESK ..."
	scp -r ./$DIST/* root@$SERVER_HOST_BYTEDESK:$TARGET_DIST_BYTEDESK
fi

echo "[build-upload] Done."
