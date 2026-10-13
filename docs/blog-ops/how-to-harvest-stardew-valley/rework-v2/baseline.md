# 基线留存与精确回滚核验报告 (Baseline Preservation Report)

- **任务类型**：技术支持叶子任务（基线留存与精确回滚准备）
- **Task ID**：`task_a0faa151c5fa`
- **Dispatch ID**：`ctx_6758050ec57a`
- **协调者终端**：`term_e23a001b-a645-4956-852b-d11d8689b9e4`
- **执行终端**：`term_16fc609c-6b61-466b-b9cd-e082146e4d6b`
- **Git HEAD**：`64a3b21b19444892654f98bc8042db4a95cbd1a8`
- **备份文件总数**：`24` 个文件
- **SHA-256 一致性校验**：**100% 匹配 (24/24 PASS)**
- **服务 3004 状态**：`LISTEN`（PID 44772，严格只读记录，未终止、未重复 curl）

---

## 1. 留存范围与执行边界声明

1. **单树限制**：仅在唯一工作树 `/Users/wusir/orca/workspaces/stardew planner/博客-2` 执行，未创建新工作树、无内置子代理/workflow 嵌套派发。
2. **只写授权目录**：仅写入 `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/baseline/` 与 `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/baseline.md`，未在 `/tmp` 或 provider brain 创建任何文件。
3. **高内聚低耦合与 FailFast**：针对固定清单 24 个文件逐一校验存在性，保留原始二进制字节写入 baseline 子目录，并实时计算原始 SHA-256 与备份 SHA-256 双向校验。若发生任何不匹配立即抛出异常退出。
4. **图片资产留存**：6 个 WebP/AVIF 自然尺寸图片文件完整按二进制字节备份，无重新解码失真风险，自然尺寸均为 1672×941。
5. **非破坏性原则**：未备份 `node_modules`、未修改 public 源码/旧稿/规则/配置，未执行 `git commit/push`，未执行依赖安装，未触发 build 或测试，未修改系统环境。

---

## 2. 留存清单与 SHA-256 校验总表

| 序号 | 类别 | 源文件相对路径 | 字节大小 | SHA-256 校验摘要 | 校验结果 |
|:---:|---|---|:---:|---|:---:|
| 1 | 文章源码 | `src/blog/articles/how-to-harvest-stardew-valley.en.tsx` | 11874 | `dacc4d0361dbd894...48218daf` | **PASS** |
| 2 | 文章源码 | `src/blog/articles/how-to-harvest-stardew-valley.zh.tsx` | 11887 | `98f2835aea750c56...827663ae` | **PASS** |
| 3 | 全局路由与清单 | `src/blog/blog-post-registry.tsx` | 47995 | `ea146ecfe3e8553e...9696fa2b` | **PASS** |
| 4 | 全局路由与清单 | `src/blog/blog-post-identities.ts` | 1245 | `886b1f6081692fb7...430cab3d` | **PASS** |
| 5 | 全局路由与清单 | `src/blog/blog-copy.ts` | 8661 | `bde4900d8c5cda4d...4eaf8869` | **PASS** |
| 6 | 全局路由与清单 | `public/llms.txt` | 16856 | `71c1d1f8185fbefa...dc4c9341` | **PASS** |
| 7 | 公开图片 (6图) | `public/blog/how-to-harvest-stardew-valley-cover.webp` | 38974 | `8558f5b08e0c3e89...220b81d8` | **PASS** |
| 8 | 公开图片 (6图) | `public/blog/how-to-harvest-stardew-valley-cover.avif` | 17525 | `ccd28749dfd70476...6dec19cd` | **PASS** |
| 9 | 公开图片 (6图) | `public/blog/illustrations/how-to-harvest-stardew-valley-en-methods.webp` | 99024 | `c5d987fdd4c2d179...4a1883a5` | **PASS** |
| 10 | 公开图片 (6图) | `public/blog/illustrations/how-to-harvest-stardew-valley-en-methods.avif` | 39279 | `92476d4c389afbf1...5ba4d861` | **PASS** |
| 11 | 公开图片 (6图) | `public/blog/illustrations/how-to-harvest-stardew-valley-zh-methods.webp` | 105016 | `450f78bb5aefcc6d...b38394f2` | **PASS** |
| 12 | 公开图片 (6图) | `public/blog/illustrations/how-to-harvest-stardew-valley-zh-methods.avif` | 40187 | `d918433c39793cf8...f5e33d6a` | **PASS** |
| 13 | 公开交接 | `docs/blog-ops/how-to-harvest-stardew-valley/handoffs/public-blog-handoff-en.json` | 29884 | `8ed90bfab4dbdd41...c51ee2c9` | **PASS** |
| 14 | 公开交接 | `docs/blog-ops/how-to-harvest-stardew-valley/handoffs/public-blog-handoff-zh.json` | 29970 | `3debdcefc4bb9e72...ef7034de` | **PASS** |
| 15 | 写作正文/素材 | `docs/blog-ops/how-to-harvest-stardew-valley/writing/en-body.md` | 10093 | `dd686bfd49f4e53d...432d9101` | **PASS** |
| 16 | 写作正文/素材 | `docs/blog-ops/how-to-harvest-stardew-valley/writing/locked/en-body.md` | 10093 | `dd686bfd49f4e53d...432d9101` | **PASS** |
| 17 | 写作正文/素材 | `docs/blog-ops/how-to-harvest-stardew-valley/writing/en-media.json` | 2245 | `1d4cd52f3d7cc7b1...c38451c3` | **PASS** |
| 18 | 写作正文/素材 | `docs/blog-ops/how-to-harvest-stardew-valley/writing/en-figure.svg` | 5643 | `a6e017cda7dd1f5d...1e662661` | **PASS** |
| 19 | SEO/引用元数据 | `docs/blog-ops/how-to-harvest-stardew-valley/seo/en-seo.json` | 2639 | `30ec27dd831c395b...66f15e08` | **PASS** |
| 20 | SEO/引用元数据 | `docs/blog-ops/how-to-harvest-stardew-valley/seo/en-public-references.json` | 10447 | `2a1739dad9e9e519...dd2f678e` | **PASS** |
| 21 | 翻译正文/素材 | `docs/blog-ops/how-to-harvest-stardew-valley/translation/zh-body.md` | 10106 | `ec8b60fc7e99ac1c...f772c024` | **PASS** |
| 22 | 翻译正文/素材 | `docs/blog-ops/how-to-harvest-stardew-valley/translation/zh-seo.json` | 2766 | `44fda49e69a3e9e6...5e97aab5` | **PASS** |
| 23 | 翻译正文/素材 | `docs/blog-ops/how-to-harvest-stardew-valley/translation/zh-media.json` | 1963 | `7aae7773171719b1...80ebc7f2` | **PASS** |
| 24 | 翻译正文/素材 | `docs/blog-ops/how-to-harvest-stardew-valley/translation/zh-figure.svg` | 5692 | `50cd8f2c06a05e25...a41c4f13` | **PASS** |

---

## 3. Git 状态与快照

- **Git HEAD**: `64a3b21b19444892654f98bc8042db4a95cbd1a8`
- **变更概况**: ` 12 files changed, 197 insertions(+), 45 deletions(-)`
- **快照文件存储路径**:
  - `baseline/snapshots/git-head.txt`
  - `baseline/snapshots/git-status.txt`
  - `baseline/snapshots/git-diffstat.txt`
  - `baseline/snapshots/git-diff.txt`

---

## 4. 本地服务 3004 状态

- **端口**：3004
- **进程 PID**：`44772`
- **进程信息**：`44772 44766 R+     1:36.92 next-server (v16.3.0)`
- **检查策略**：只读检查（Orca terminal read 状态），不停进程、不 curl 重复验收，不将进程活跃等同于 UI 验收通过。
- **快照记录路径**：`baseline/snapshots/service-3004-status.txt`

---

## 5. 精确回滚指导 (Rollback Plan)

若后续返工重写过程需要回滚到本次基线版本，可执行 `python3 docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/baseline/verify_baseline.py --rollback` 或手动将 `baseline/files/` 下对应文件覆盖回原工作树路径。
所有 24 个文件的路径结构与工作树严格一对一映射，且 `manifest.json` 记录了完整的绝对与相对校验和，可确保 100% 精确无损回滚。
