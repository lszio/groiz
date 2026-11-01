#!/usr/bin/env bash
# 分发 Quiet Tactile 设计令牌。单源:design-system/tokens.css(本仓)。
#   · site/tokens.css                    整文件拷贝(site/Dockerfile COPY,nginx 静态托管)
#   · zio/apps/loom/web/index.html       loom serve 只托管 index.html,令牌以
#     <style id="zt-tokens"> 块内联;脚本只替换 /* zt-tokens:begin */ 与
#     /* zt-tokens:end */ 标记之间的内容,缺标记则报错,不自动生成。
#   · zio/apps/site/src/styles/global.css  Astro 站点,令牌以 CSS 注释块内联,
#     同样的 begin/end 标记(构建时打进产物)。
# 用法:tools/sync-design-tokens.sh   (可用 ZIO_REPO=... 覆盖 zio 仓路径)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/design-system/tokens.css"
ZIO_REPO="${ZIO_REPO:-/Volumes/Data/Projects/zio}"
LOOM_PAGE="$ZIO_REPO/apps/loom/web/index.html"
SITE_CSS="$ZIO_REPO/apps/site/src/styles/global.css"

cp "$SRC" "$ROOT/site/src/styles/zt-tokens.css"
echo "synced tokens -> site/tokens.css"

python3 - "$SRC" "$LOOM_PAGE" <<'PY'
import pathlib, sys

src = pathlib.Path(sys.argv[1]).read_text()
page = pathlib.Path(sys.argv[2])
text = page.read_text()
begin = "/* zt-tokens:begin (generated — edit groiz/design-system/tokens.css, run tools/sync-design-tokens.sh) */"
end = "/* zt-tokens:end */"
i, j = text.find(begin), text.find(end)
if i < 0 or j < 0 or j < i:
    sys.exit("zt-tokens markers not found in " + str(page) + " — page must carry the marked <style id=\"zt-tokens\"> block")
page.write_text(text[:i] + begin + "\n" + src + text[j:])
print("synced tokens ->", sys.argv[2])
PY

python3 - "$SRC" "$SITE_CSS" <<'PY'
import pathlib, sys

src = pathlib.Path(sys.argv[1]).read_text()
css = pathlib.Path(sys.argv[2])
text = css.read_text()
begin = "/* zt-tokens:begin (generated — edit groiz/design-system/tokens.css, run tools/sync-design-tokens.sh) */"
end = "/* zt-tokens:end */"
i, j = text.find(begin), text.find(end)
if i < 0 or j < 0 or j < i:
    sys.exit("zt-tokens markers not found in " + str(css))
css.write_text(text[:i] + begin + "\n" + src + text[j:])
print("synced tokens ->", sys.argv[2])
PY
