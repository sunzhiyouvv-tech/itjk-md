#!/usr/bin/env bash
set -Eeuo pipefail

SOURCE_DIR=/tmp/doocs-md
PROJECT_DIR="$(pwd)"
OUTPUT_DIR="$PROJECT_DIR/dist"

rm -rf "$SOURCE_DIR" "$OUTPUT_DIR"
git clone --depth 1 --branch v2.1.0 --single-branch https://github.com/doocs/md.git "$SOURCE_DIR"
cd "$SOURCE_DIR"

export npm_config_registry=https://registry.npmjs.org
npx --yes pnpm@10.17.1 install --no-frozen-lockfile
npx --yes pnpm@10.17.1 web build

mkdir -p "$OUTPUT_DIR"
cp -R apps/web/dist/. "$OUTPUT_DIR/"

# Replace only user-facing product text after the upstream build. Avoid touching
# source package names such as @doocs/*, which would break the monorepo.
find "$OUTPUT_DIR" -type f \( -name '*.html' -o -name '*.js' -o -name '*.css' \) -print0 |
  xargs -0 sed -i     -e 's/微信 Markdown 编辑器/IT极客 Markdown 编辑器/g'     -e 's/WeChat Markdown Editor/ITJK Markdown Editor/g'
