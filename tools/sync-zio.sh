#!/usr/bin/env bash
# sync-zio — refresh the vendored zio/ tree from a zio checkout.
#
# The deployment build (root Dockerfile) compiles the vendored tree: the
# build platform cannot clone a private repository — its submodule
# support clones without credentials, and zio is private. So the exact
# revision lives in this repository as a plain directory. Run this after
# landing zio changes the grove app must pick up, then commit and push:
#
#   ZIO_ROOT=/path/to/zio tools/sync-zio.sh && git commit -am "sync zio"
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
ZIO_ROOT="${ZIO_ROOT:-$(dirname "$ROOT")/zio}"

if [ ! -d "$ZIO_ROOT/langs/core" ]; then
  echo "no zio checkout at $ZIO_ROOT (set ZIO_ROOT)" >&2
  exit 1
fi

REV="$(git -C "$ZIO_ROOT" rev-parse HEAD)"
BRANCH="$(git -C "$ZIO_ROOT" branch --show-current)"

rm -rf "$ROOT/zio"
rsync -a \
  --exclude='.git' --exclude='target' --exclude='dist' \
  --exclude='._*' --exclude='.DS_Store' \
  --exclude='apps' --exclude='docs' --exclude='book' --exclude='blog' \
  --exclude='npm' --exclude='tools' --exclude='benchmarks' \
  "$ZIO_ROOT/" "$ROOT/zio/"

cat > "$ROOT/zio/VENDORED.md" <<NOTE
# Vendored Zio

This directory is a build-time copy of lszio/zio at
${REV} (branch: ${BRANCH:-detached}), trimmed to what the
grove image compiles (workspace members + libs + examples).

The dokploy build host cannot clone private repositories — its
submodule support clones without credentials — so the checkout ships
in this repository instead of a submodule. Refresh with:

    ZIO_ROOT=/path/to/zio tools/sync-zio.sh

and commit. The copy is a snapshot, not a fork: language work happens
in lszio/zio and lands here by running the sync.
NOTE

find "$ROOT/zio" -name "._*" -delete
echo "vendored zio $REV ($BRANCH) — $(du -sh "$ROOT/zio" | cut -f1)"
