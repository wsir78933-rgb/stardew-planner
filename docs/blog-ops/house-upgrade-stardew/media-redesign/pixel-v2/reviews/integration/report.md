# 独立复核与验证报告：house-upgrade-stardew (pixel-v2 媒体接入)

- **Worker 角色**: Antigravity 独立复核与验证 Worker（未实现文章接入）
- **工作树路径**: `/Users/wusir/orca/workspaces/stardew planner/博客-2` (唯一工作树)
- **Task ID**: `task_c2797478ef96`
- **Dispatch ID**: `ctx_1f37a2e48e86`
- **协调者终端**: `term_661abce7-55fd-4570-8bf5-970c0451dd23`
- **Worker 终端**: `term_7a51f680-891d-4511-9e21-187b7107c5ef`
- **报告生成日期**: 2026-10-17
- **授权边界**: 纯只读复核与验证。严格遵守“代码只读、不授权修复”、“不得修改 tests/source/public/历史报告或安装依赖”、“零修改业务代码 (source/public 零修复)”。

---

## 一、执行摘要与核心结论

1. **媒体与文本接入真实性**:
   - 实际回读了 3 个变动 source、12 个公共图片、2 个新版 body/handoff 以及新版 AssemblyManifest，确认哈希、字节尺寸与内容真实一致，不依赖口头自报。
   - 所有 12 个公共图片与 `assets/exports/` 对应导出文件通过 `cmp -s` 对比（退出码 0），图片实测尺寸均为 `1672×941`，宽高比与 16/9 存在约 0.000945 的整像素取整差（未做人工拉伸与虚假 16:9 声明）。
   - 画面内容与文案忠实契合：单栋农舍外景、一套带厨房/卧室/两张单人床与婴儿床的温馨室内、木匠在未封木架上举锤施工。文案已纠正前期 review-plan 过于具体的推测（如 NPC 罗宾实名、双层床、四季农舍等），全部归一为客观画面描述。
   - 所有媒体条目及 SEO 中的 `inImageText` 均为 `[]`（空数组）。

2. **双语正文与事实约束保护**:
   - 英文合格去图注词数为 **1,084 词**（要求 >= 1,000 词，底线 PASS）。
   - 中文去图注纯汉字数为 **1,645 字**（要求 >= 1,000 字，底线 PASS）。
   - 正文除两处对图内标签引用的句子（`On the room figure, the Nursery label...` -> `In the interior illustration, the nursery...` / `房间图上的「育儿室」标的...` -> `室内插画里，育儿室就是...`）以及图片 `alt`/`caption` 允许修改外，普通正文、核心事实（10,000g/450木、65,000g/100硬木、100,000g、秘密森林 9 次收获、33 桶地窖等）、SEO 字段（Title/H1/Description/Slug/OG/Canonical）、12 篇引用文献与 55 处引用 quote 保持 100% 原始未漂移。
   - 历史 baseline 5 项核心文件（旧锁稿、旧中文草稿、旧 handoff 双语、旧 AssemblyManifest）保持原字节未动。

3. **命令执行与环境验证**:
   - **Vitest 聚焦测试**: 运行指定 4 个测试文件（[blog-post-registry.test.ts](file:///Users/wusir/orca/workspaces/stardew%20planner/博客-2/tests/blog/blog-post-registry.test.ts)、[blog-routes.test.tsx](file:///Users/wusir/orca/workspaces/stardew%20planner/博客-2/tests/routes/blog-routes.test.tsx)、[removed-public-pages.test.ts](file:///Users/wusir/orca/workspaces/stardew%20planner/博客-2/tests/routes/removed-public-pages.test.ts)、[canonical-public-routes.test.ts](file:///Users/wusir/orca/workspaces/stardew%20planner/博客-2/tests/seo/canonical-public-routes.test.ts)），**全部通过**（4 测试文件通过，43 测试用例通过，0 失败，退出码 0）。
   - **`pnpm typecheck`**: 退出码 **2**。报错源于 `docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/baseline/src/` 下由 baseline 任务复制的 2 个 `.tsx` 历史留底文件相对引用报错（TS2307）。`src/` 业务代码 **0 错误**。
   - **`next build --webpack`**: 退出码 **1**。Webpack 编译在 7.5 秒内成功（`✓ Compiled successfully in 7.5s`），但在内部 TypeScript 类型校验步骤遇到上述 baseline 目录的 TS2307 错误而中断，未更新 `out/` 静态导出目录。
   - **`next-env.d.ts` 处理**: 构建触发已知路径变更（`.next/dev/types` -> `.next/types`），经严格 diff 比对确认无任何其他用户修改后，已安全还原为开工相同原字节（SHA-256: `0f70629890b72a0a82e91972cc032c04b658b26c265373cb711cf576bfbf8fcc`，`cmp -s` 退出码 0）。
   - **服务与端口 3010**: PID 21887 (`node ... serve out -l tcp://127.0.0.1:3010`) 正常运行且 cwd 为本工作树，HTTP 200 OK 正常响应。端口 3000–3007 未受干扰。

---

## 二、逐一回读与验证清单

### 1. 3 个变动 Source 文件回读

| 文件路径 | 状态 | SHA-256 | 变更内容与防漂移核验 |
|---|---|---|---|
| [house-upgrade-stardew.en.tsx](file:///Users/wusir/orca/workspaces/stardew%20planner/博客-2/src/blog/articles/house-upgrade-stardew.en.tsx) | 已修改 | `e215ceb1871294757241bdd44a52a7a48667b5e0bb01018d9aafe8d348844acd` | 仅第 8、16、26、34 行的 `alt`/`figcaption` 更新为新像素图场景说明，第 155 行原句 `On the room figure, the Nursery label is this crib room.` 改为 `In the interior illustration, the nursery is this crib room.`。其余事实与链接零修改。 |
| [house-upgrade-stardew.zh.tsx](file:///Users/wusir/orca/workspaces/stardew%20planner/博客-2/src/blog/articles/house-upgrade-stardew.zh.tsx) | 已修改 | `3d601b6e0c4b5eada92fde9cd4875db44c31ef0a5eae857cdaac6b4deff13850` | 仅第 92 行原句 `房间图上的「育儿室」标的就是这间有婴儿床的房间。` 改为 `室内插画里，育儿室就是这间有婴儿床的房间。`，第 96、104、128、136 行的 `alt`/`figcaption` 更新为新插画场景说明。其余正文与结构零修改。 |
| [blog-post-registry.tsx](file:///Users/wusir/orca/workspaces/stardew%20planner/博客-2/src/blog/blog-post-registry.tsx) | 已修改 | `5e7687939e0878dcd6e6c74dad4c1cad9beee76bac0078427713932274ab0aa5` | 仅英文条目（行 482）和中文条目（行 873）中的 `coverImage.alt` 替换为新像素农舍外景描述。Title/Slug/Description/Path 零变动。 |

### 2. 12 个公共图片文件核验

所有 12 个图片文件已通过 SHA-256 校验并与 `docs/.../assets/exports/*` 逐字节比对（`cmp -s` 退出码 0）：

| 公共路径 | 格式 | 尺寸 | 字节大小 | SHA-256 | `cmp` 导出 |
|---|---|---|---|---|---|
| `public/blog/house-upgrade-stardew-cover.webp` | WebP | 1672×941 | 2,550,052 | `d58aaaf3bbe7b02e04fb0a366b3e0b8c61b257abc993eea6ff02a358782f57c8` | 0 |
| `public/blog/house-upgrade-stardew-cover-zh.webp` | WebP | 1672×941 | 2,550,052 | `d58aaaf3bbe7b02e04fb0a366b3e0b8c61b257abc993eea6ff02a358782f57c8` | 0 |
| `public/blog/house-upgrade-stardew-cover.avif` | AVIF | 1672×941 | 653,604 | `8c0da21da4d59de4d3f4d1bbadc6e38cefe3880ba47d67aaacf8f5ff892662d0` | 0 |
| `public/blog/house-upgrade-stardew-cover-zh.avif` | AVIF | 1672×941 | 653,604 | `8c0da21da4d59de4d3f4d1bbadc6e38cefe3880ba47d67aaacf8f5ff892662d0` | 0 |
| `public/blog/illustrations/house-upgrade-stardew/tier-rooms.en.webp` | WebP | 1672×941 | 1,984,240 | `9f806c5cb39ac3bd298415ff3ac80fb056446dcff9fb1a839d9c4afb29946671` | 0 |
| `public/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.webp` | WebP | 1672×941 | 1,984,240 | `9f806c5cb39ac3bd298415ff3ac80fb056446dcff9fb1a839d9c4afb29946671` | 0 |
| `public/blog/illustrations/house-upgrade-stardew/tier-rooms.en.avif` | AVIF | 1672×941 | 446,411 | `e2578074f100a6e185d73d5034f6fe2d79861df3787aac3777137a5854571221` | 0 |
| `public/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.avif` | AVIF | 1672×941 | 446,411 | `e2578074f100a6e185d73d5034f6fe2d79861df3787aac3777137a5854571221` | 0 |
| `public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.webp` | WebP | 1672×941 | 2,453,712 | `526a5afa8836bba315ffa3b15b64d0483726ee3c07d3284222e47ed935c93bfb` | 0 |
| `public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.webp` | WebP | 1672×941 | 2,453,712 | `526a5afa8836bba315ffa3b15b64d0483726ee3c07d3284222e47ed935c93bfb` | 0 |
| `public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.avif` | AVIF | 1672×941 | 617,005 | `c5c957be221fa5b140cef500771c1eeb51ae2b143fa645662a5644c43d05cf27` | 0 |
| `public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.avif` | AVIF | 1672×941 | 617,005 | `c5c957be221fa5b140cef500771c1eeb51ae2b143fa645662a5644c43d05cf27` | 0 |

**元数据审查**:
- EXIF 标签数均为 0。
- XMP 文本检查未见异常文本、未见内嵌凭证或密码。依据安全边界规则，本项仅检查格式/尺寸/无意外 EXIF/XMP 文本，不声称对密钥进行过 secret 扫描 PASS。

### 3. 2 个新版 Body 与 Handoff 文件核验

- **英文交付**:
  - 正文 Markdown: `docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/integration/v1/body/en.md`
  - 交接 JSON: `docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/integration/v1/handoff/en.json` (SHA-256: `e4fa6f1fa65adfbeead8df17eb1902c2d08ff7daa76abb1279dfe1d697c36fd4`)
  - 独立计算 `bodyHash`: `151c81afa41a5411345c0f33866f08c6819da2c30afdcde610d6135e56774fa8`（与 handoff 声明完全吻合）
  - 规范化 `publicFieldsSha256`: `fa3cb7a8df969b3f91ffa3ab9fb3aaad4748e132a3e9deaf8d348287d584f597`（完全吻合）
- **中文交付**:
  - 正文 Markdown: `docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/integration/v1/body/zh-CN.md`
  - 交接 JSON: `docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/integration/v1/handoff/zh-CN.json` (SHA-256: `376c9cffa556f8451b0a999495874950c7efb94c6a42fac3674e2bfa732869e0`)
  - 独立计算 `bodyHash`: `00a612b48022fa7256f89b7fc5eb0386b34d17b6f272f079da9f62eb40998bc4`（完全吻合）
  - 顶层 `englishBodyHash`: `151c81afa41a5411345c0f33866f08c6819da2c30afdcde610d6135e56774fa8`（精确绑定英文原版 `bodyHash`）
  - 规范化 `publicFieldsSha256`: `75b3d2a26d14cad3b49df9eeb20c2e1bbffd0e776c463d3317f6c13248592d15`（完全吻合）
- **`inImageText` 约束**:
  - 英文与中文全部 3 处 figure 和 SEO `mediaText` 中的 `inImageText` 均为 `[]`。

### 4. 新版装配清单 (AssemblyManifest.json) 核验

- 路径: `docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/integration/v1/AssemblyManifest.json`
- 文件 SHA-256: `0e86b97669d651fa462efcffae65553e1a0b5a1923297a7804ee9eb46d90a992`
- 清单内记录的 `historicalManifestSha256` 为 `6ce4e84ffbcc1252f2cebd443e4ccceac5a60d29c2ceb41dd74eaabd68fc6834`，`historicalManifestUnmodified: true`，且显式声明 `userFinalReview: "not-claimed"`、`pageBrowserPassClaimed: false`、`productionDeployed: false`。
- 清单所引用的 handoff 哈希、文章模块哈希、注册表哈希、12 个公共图片哈希与实际磁盘文件 100% 一致。

### 5. `apply_pixel_v2.py` 只读审查结论

- **调度与 Fail Fast**: 主函数 `main()` 仅充当调度器（调用 `load_inputs` -> `build_bodies` -> `patch_text_files` -> `write_outputs` 等独立子函数）。每一处校验失败均调用 `fail(msg)` 携带具体字段与参数立即退出，未发现任何 `try...except: pass` 或静默吞异常行为。
- **回滚保障**: `write_outputs` 在写入前对所有拟改动路径记录了 `original_bytes`，并在 `try...except` 块中遭遇任何异常时执行 `restore(original_bytes)`，有效保障了前两次因 key 缺少 `public/` 前缀而抛出 `KeyError` 时的完整回滚。
- **边界与外部依赖观察**: 脚本第 24 行定义了 `V7_COUNTER_PATH = Path("/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py")`，通过 `importlib` 动态加载外部工作区脚本。虽然设置了 `PYTHONDONTWRITEBYTECODE=1` 并进行了 pycache 无写入校验，但存在对工作树外部文件的隐式依赖。本 Worker 仅做只读报告，不做修复。

---

## 三、正文保护与词数复核

依据项目 V7 正文计数规范与去图注合格词数算法独立核验：

| 指标 | 算法定义 | 实测值 | 合格底线 | 结论 |
|---|---|---|---|---|
| **英文正文合格词数** | 提取正文内容并去除 `<figcaption>` 及 Markdown 图注行后的有效词数 | **1,084** 词 | >= 1,000 词 | **PASS** |
| **中文正文纯汉字数** | 提取正文内容并减去图注中的汉字数后的有效汉字数 | **1,645** 字 | >= 1,000 字 | **PASS** |

两语言篇幅均安全高于 1,000 字符/词底线。

---

## 四、历史基线原字节保护校验

对 baseline 记录的旧冻结文件逐一进行比对（`cmp -s` 退出码 0，SHA-256 完全相等）：

| 历史原稿/配置路径 | Baseline 记录 SHA-256 | 当前磁盘 SHA-256 | `cmp` 状态 |
|---|---|---|---|
| `docs/blog-ops/house-upgrade-stardew/handoff/public/en.json` | `cec56b5e5420996636aada50776866bd7f4da8d1f3018b88c8a0c119b06dd7d3` | `cec56b5e5420996636aada50776866bd7f4da8d1f3018b88c8a0c119b06dd7d3` | 0 (一致) |
| `docs/blog-ops/house-upgrade-stardew/handoff/public/zh-CN.json` | `0e6456c0a554e32f5157b791b50249449ce887acf5187b27f524aecf5c9add1c` | `0e6456c0a554e32f5157b791b50249449ce887acf5187b27f524aecf5c9add1c` | 0 (一致) |
| `docs/blog-ops/house-upgrade-stardew/assembly/AssemblyManifest.json` | `6ce4e84ffbcc1252f2cebd443e4ccceac5a60d29c2ceb41dd74eaabd68fc6834` | `6ce4e84ffbcc1252f2cebd443e4ccceac5a60d29c2ceb41dd74eaabd68fc6834` | 0 (一致) |
| `docs/blog-ops/house-upgrade-stardew/lock/en/body.md` | `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f` | `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f` | 0 (一致) |
| `docs/blog-ops/house-upgrade-stardew/content/zh/draft-zh-v2.md` | `0190b09fc27df1b32919f65a1e688b484c29f3bbc049021188b5f472e9867bc6` | `0190b09fc27df1b32919f65a1e688b484c29f3bbc049021188b5f472e9867bc6` | 0 (一致) |

---

## 五、命令执行与构建分析

### 1. 执行顺序与真实原始输出

#### (1) `pnpm typecheck`
- **命令**: `pnpm typecheck`
- **退出码**: `2`
- **原始日志**:
  ```text
  > @ typecheck /Users/wusir/orca/workspaces/stardew planner/博客-2
  > tsc --noEmit

  docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/baseline/src/blog/articles/house-upgrade-stardew.en.tsx:1:29 - error TS2307: Cannot find module '../../components/blog/blog-sources' or its corresponding type declarations.
  1 import { BlogSources } from "../../components/blog/blog-sources";
  docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/baseline/src/blog/articles/house-upgrade-stardew.en.tsx:2:31 - error TS2307: Cannot find module '../../components/public-picture' or its corresponding type declarations.
  2 import { PublicPicture } from "../../components/public-picture";
  docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/baseline/src/blog/articles/house-upgrade-stardew.zh.tsx:1:29 - error TS2307: Cannot find module '../../components/blog/blog-sources' or its corresponding type declarations.
  1 import { BlogSources } from "../../components/blog/blog-sources";
  docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/baseline/src/blog/articles/house-upgrade-stardew.zh.tsx:2:31 - error TS2307: Cannot find module '../../components/public-picture' or its corresponding type declarations.
  2 import { PublicPicture } from "../../components/public-picture";

  Found 4 errors in 2 files.
  ```
- **根因证据**:
  - `tsconfig.json` 的 `include` 包含了 `**/*.tsx`，但 `exclude` 仅排除了之前的 `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/baseline/files`，未包含 `docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/baseline`。
  - 前序任务 `task_0854436a3d5f` 在建立 baseline 时将源文件复制到 `baseline/src/blog/articles/`，因其脱离了原 `src/` 相对路径树，导致相对导入找不到 `../../components/...`。
  - **实际业务文件 `src/blog/articles/house-upgrade-stardew.{en,zh}.tsx` 自身 0 错误**。

#### (2) Vitest 4-File Focused Suite
- **命令**: `pnpm exec vitest run tests/blog/blog-post-registry.test.ts tests/routes/blog-routes.test.tsx tests/routes/removed-public-pages.test.ts tests/seo/canonical-public-routes.test.ts`
- **退出码**: `0`
- **执行结果**:
  ```text
  Test Files  4 passed (4)
       Tests  43 passed (43)
    Duration  1.52s
  ```
  涵盖博客注册表条目有效性、路由映射与反向路由排序、下线页面检查及 SEO 规范路由全部通过。不扩跑全量套件，不把 4 文件通过写成全套通过。

#### (3) `next build --webpack`
- **命令**: `NEXT_TELEMETRY_DISABLED=1 pnpm exec next build --webpack`
- **退出码**: `1`
- **原始日志**:
  ```text
  ▲ Next.js 16.3.0 (webpack)
  ✓ Running next.config.ts took 54ms
  - Experiments (use with caution):
    ✓ globalNotFound

    Creating an optimized production build ...
  ✓ Compiled successfully in 7.5s
  docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/baseline/src/blog/articles/house-upgrade-stardew.en.tsx(1,29): error TS2307: Cannot find module '../../components/blog/blog-sources' or its corresponding type declarations.
  docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/baseline/src/blog/articles/house-upgrade-stardew.en.tsx(2,31): error TS2307: Cannot find module '../../components/public-picture' or its corresponding type declarations.
  docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/baseline/src/blog/articles/house-upgrade-stardew.zh.tsx(1,29): error TS2307: Cannot find module '../../components/blog/blog-sources' or its corresponding type declarations.
  docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/baseline/src/blog/articles/house-upgrade-stardew.zh.tsx(2,31): error TS2307: Cannot find module '../../components/public-picture' or its corresponding type declarations.
  Failed to type check.
  ```
- **现象分析**:
  - Webpack 打包编译完全成功（耗时 7.5 秒，无语法或组件引用阻碍）。
  - Next.js 构建自带的类型检查阶段直接受 `tsconfig.json` 配置影响，命中了 baseline 历史备份文件的 4 处 TS2307 错误，在导出 `out/` 之前退出。
  - 依照授权约束，“代码只读，不授权修复”、“不得修改 tests/source/public/历史报告”，且修改 `tsconfig.json` 超出本次媒体接入验证范围。因此保持只读，如实报告真实退出码与根因，不在未经授权下改动 `tsconfig.json`。

### 2. `next-env.d.ts` 变更比对与原字节恢复

- **构建前状态**: SHA-256: `0f70629890b72a0a82e91972cc032c04b658b26c265373cb711cf576bfbf8fcc`
- **构建后变动**: Next.js 将第 3–4 行 `.next/dev/types` 改为 `.next/types`（SHA-256: `1862ac4bbbc5192d4bf562161df66ea547ed3e67173100656ab606ae9797db2b`）。
- **diff 审查**: 严格确认仅存在该两处路径变动，无任何其他行变动或用户修改。
- **恢复结果**: 已恢复为开工初始原字节。
  - 恢复后 SHA-256: `0f70629890b72a0a82e91972cc032c04b658b26c265373cb711cf576bfbf8fcc`
  - 与开工基准比对: `cmp -s next-env.d.ts baseline/environment/next-env.d.ts.json` 退出码 `0`。

---

## 六、服务与端口 3010 状态

- **PID**: `21887`
- **命令行**: `node ./node_modules/.bin/../.pnpm/serve@14.2.6/node_modules/serve/build/main.js out -l tcp://127.0.0.1:3010 --no-port-switching --no-clipboard`
- **工作目录**: `/Users/wusir/orca/workspaces/stardew planner/博客-2` (已由 `lsof -a -p 21887 -d cwd` 确认为本工作树)
- **网络状态**: `TCP 127.0.0.1:3010 (LISTEN)`
- **HTTP 响应**:
  - `GET /house-upgrade-stardew` -> HTTP 200 OK (Content-Length: 113755)
  - `GET /zh/house-upgrade-stardew` -> HTTP 200 OK (Content-Length: 111805)
- **服务处置**: 保持只读确认，未重启、未杀死、未重建。端口 3000–3007 未受触碰。
- **静态导出同步说明**: 由于 `next build --webpack` 在静态 HTML 生成前因 baseline 类型检查退出，当前 3010 服务响应的是前序生成的静态页面。本 Worker 已完成源与哈希全量验收，实际 UI 渲染与浏览器验证交由后续独立 ego-browser Worker 流程执行。

---

## 七、工程原则显式遵守核对

1. **高内聚、低耦合**: 校验逻辑、文件读取、哈希比对与外部进程检查各司其职，无跨域越界。
2. **单一职责原则**: 仅聚焦于图文接入真实性、密码学完整性与构建命令真实状态复核，不试图越权修复非本任务职责的 tsconfig 配置。
3. **KISS 与 YAGNI**: 直接使用标准密码学哈希与系统 `cmp` 验证，不引入额外抽象层与假想功能。
4. **Fail Fast**: 在数据边界明确抛出具体文件路径与差异值；如实反映构建与类型检查的具体退出码与错误日志，绝不静默掩盖。
5. **精确命名**: 变量与产物均具备精确业务语义，无通用模糊命名。
6. **source/public 零修复**: 业务代码与公共图片保持接入后真实状态，零二次修改。
