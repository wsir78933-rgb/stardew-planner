# 文章归档后缀修复

baseline 任务把替换前的英文和中文文章副本保存为 `.tsx`。`tsconfig.json` 的 include 含 `**/*.tsx`，exclude 没有 `pixel-v2/baseline`。TypeScript 会编译这两份副本。

原始失败留在 `reviews/integration/checks.log`，没有改写。`pnpm typecheck` 退出码 2。`pnpm exec next build --webpack` 退出码 1。日志里 `error TS2307` 出现 8 次，是同 4 个错误在 typecheck 和 webpack 各打印一次。摘要是 `Found 4 errors in 2 files.`

两份副本已从 `.tsx` 移动为同目录 `.tsx.txt`。字节数和 sha256 与移动前相同，也与 baseline manifest 里的 source sha256、copy sha256 相同。曾按最初授权改过 `copiedTo` 和 checksums 路径，并把原字节放在 `archive-fix/history/`。收敛后这两份索引已恢复为修复前字节，history 副本已删除。最终 `baseline/manifest.json` sha256 是 `b00c8d80843cfdc766cb08e490f50d0edb121e88c5725673bfa6dacb4290f1af`，`baseline/checksums.sha256` sha256 是 `47bdbca2844a7be476f470d748303f31ff4be1c3eca5f0cc51d10351bf8d28d0`。当前定位是 `archive-fix/archive-location-map.json`：`oldArchivePath` 指向原来的 `.tsx` 记录，`newArchivePath` 指向 `.tsx.txt`。

`integration/apply_pixel_v2.py` 只通过这份映射读取这两份归档。产品读取和写入仍是 `src/blog/articles/house-upgrade-stardew.en.tsx` 与 `.zh.tsx`。没有执行该脚本的 `main()`，没有改 `integration/v1/AssemblyManifest.json`，没有重跑 typecheck 或 webpack build。pixel-v2 内没有活跃 `.ts` 或 `.tsx`。

历史 checksums 仍记录旧 `.tsx` 路径，所以 `shasum -a 256 -c baseline/checksums.sha256` 退出码 1：OK 33，FAILED 2。失败的两行就是已经移走的旧路径。`.tsx.txt` 的字节与这两行记录的 sha256 相同。15 个产品文件、2 个新版 handoff 和 1 个新版 AssemblyManifest 的 sha256 未改。
