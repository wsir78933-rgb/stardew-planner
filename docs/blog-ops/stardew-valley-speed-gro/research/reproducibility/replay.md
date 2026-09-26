# R-repro：有限代表样本复现记录

## 结论

本次复现只补 RI-01 的逐字可重跑缺口，没有改写 A-en/A-zh 研究稿，也没有扩展主题研究。2026-09-26 11:50:58–11:51:10（Asia/Shanghai；对应 UTC `2026-09-26T03:50:58.836Z`–`2026-09-26T03:51:10.444Z`）在一个 Ego-browser TaskSpace 中按脚本依次读取两条 Bing 参数化查询、官方 1.6 更新日志和中文“生长激素”页面；四个样本均为 `pass`，导航/加载/评估错误均为 `null`，外层退出码为 0。

这证明的是本次 Bing 参数化页面和来源正文的可复现读取，不是历史 A-en/A-zh 原始 SERP 的恢复，也不是 US/CN 物理地理定位或个性化 SERP 证明。脚本没有打开 Google、没有绕过验证码；`setlang`、`cc`、浏览器语言、时区和可见页面文字都只作请求/环境记录。

## 复现范围与来源

| 样本 | 实际 URL 与参数 | 读取目标 |
|---|---|---|
| 英文 Bing | <https://www.bing.com/search?q=stardew%20valley%20speed%20gro&setlang=en-US&cc=US> | 原词 `stardew valley speed gro`；读取 `li.b_algo` 前 10 条及页面语言/时区/可见地区标签 |
| 中文 Bing | <https://www.bing.com/search?q=%E6%98%9F%E9%9C%B2%E8%B0%B7%E7%89%A9%E8%AF%AD%20%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0&setlang=zh-CN&cc=CN> | 中文生长激素查询 `星露谷物语 生长激素`；同样读取前 10 条与环境字段 |
| 官方版本来源 | <https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/> | 页面正文中 Speed-Gro 与 Deluxe Speed-Gro 的 1.6 配方变更句 |
| 中文版本/主题来源 | <https://zh.stardewvalleywiki.com/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0> | 正文中的 10% 加速、松焦油/苔藓材料和 1.6 配方说明 |

脚本使用一个 Page `p1` 顺序复用四个 URL；Bing 选择器为 `li.b_algo`、`h2`、`h2 a`、`.b_caption p`。来源正文使用 `document.body.innerText` 的可见文本行，并对官方更新日志检查两句完整短语、对中文页面检查 `10%`、`松焦油`、`苔藓` 三个信号；每次读取前后均保存 `page.goto()`、`waitForLoadState("domcontentloaded", { timeout: 15000 })`、实际 URL、标题和错误字段。

## 可直接重跑的命令

脚本文件：[replay.mjs](./replay.mjs)。以下是本次实际执行的两个命令；第一个是 Node 语法检查，第二个通过 stdin 将同一脚本交给 `ego-browser nodejs`：

```sh
node --check 'docs/blog-ops/stardew-valley-speed-gro/research/reproducibility/replay.mjs'
# exit 0

ego-browser nodejs < '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/research/reproducibility/replay.mjs'
# exit 0
```

脚本在每个边界捕获并输出具体 `navigationError`、`loadError`、`evaluationError`；如果页面在导航错误后仍可读，会把状态标为 `read-after-navigation-warning`，不会把错误吞掉。成功运行还输出 `task.finish({ keep: [] })` 回执；本次回执为 `spaceId=34`、`closedManagedLabels=["p1"]`、`preservedUnmanagedCount=0`。

## 本次运行的精简 raw JSON

以下字段是上述命令实际 stdout 的精简保留，不把 Bing 的动态追踪跳转 URL 当作公开来源 URL：

```json
{
  "startedAt": "2026-09-26T03:50:58.836Z",
  "finishedAt": "2026-09-26T03:51:10.444Z",
  "samples": [
    {
      "sampleName": "english-bing-us-parameter",
      "requestedUrl": "https://www.bing.com/search?q=stardew%20valley%20speed%20gro&setlang=en-US&cc=US",
      "observedUrl": "https://www.bing.com/search?q=stardew%20valley%20speed%20gro&setlang=en-US&cc=US",
      "observedTitle": "stardew valley speed gro - Search",
      "status": "pass",
      "resultCount": 10,
      "topTitles": [
        "Speed-Gro - Stardew Valley Wiki",
        "Speed-Gro - Stardew Valley Wiki",
        "Deluxe Speed-Gro - Stardew Valley Wiki",
        "Stardew Valley Speed-Gro Guide (2026): When Is Fertilizer Worth the …",
        "Is speedgro even worth it? : r/StardewValley - Reddit"
      ],
      "navigatorLanguage": "en",
      "navigatorLanguages": ["en", "zh-CN"],
      "timezone": "Asia/Shanghai",
      "visibleRegionLines": [],
      "navigationError": null,
      "loadError": null,
      "evaluationError": null
    },
    {
      "sampleName": "chinese-bing-cn-parameter",
      "requestedUrl": "https://www.bing.com/search?q=%E6%98%9F%E9%9C%B2%E8%B0%B7%E7%89%A9%E8%AF%AD%20%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0&setlang=zh-CN&cc=CN",
      "observedUrl": "https://www.bing.com/search?q=%E6%98%9F%E9%9C%B2%E8%B0%B7%E7%89%A9%E8%AF%AD%20%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0&setlang=zh-CN&cc=CN",
      "observedTitle": "星露谷物语 生长激素 - 搜索",
      "status": "pass",
      "resultCount": 10,
      "topTitles": [
        "生长激素 - 星露谷物语官方中文维基",
        "激素 | 星露谷物语中文百科 - BWIKI",
        "高级生长激素 - 星露谷物语官方中文维基",
        "生长激素 - Stardew Valley 中文维基 | 星露谷物语攻略资料 …",
        "顶级生长激素 | 星露谷物语中文百科 - BWIKI"
      ],
      "navigatorLanguage": "en",
      "navigatorLanguages": ["en", "zh-CN"],
      "timezone": "Asia/Shanghai",
      "visibleRegionLines": [],
      "navigationError": null,
      "loadError": null,
      "evaluationError": null
    },
    {
      "sampleName": "official-1-6-changelog",
      "observedTitle": "Stardew Valley - Stardew Valley 1.6 Update Full Changelog",
      "status": "pass",
      "keyLines": [
        "Speed-Gro now requires 5 Moss instead of 1 Clam .",
        "Deluxe Speed-Gro now requires 5 bone fragments instead of 1 coral."
      ],
      "phraseChecks": [
        {"phrase": "Speed-Gro now requires 5 Moss instead of 1 Clam", "found": true},
        {"phrase": "Deluxe Speed-Gro now requires 5 bone fragments instead of 1 coral", "found": true}
      ],
      "navigationError": null,
      "loadError": null,
      "evaluationError": null
    },
    {
      "sampleName": "chinese-speed-gro-page",
      "observedTitle": "生长激素 - 星露谷物语官方中文维基",
      "status": "pass",
      "keyLines": [
        "促进叶子生长。保证能让植物的生长速度加快 10%。使用时加到犁过的土地中。",
        "松焦油（1）",
        "苔藓（5）",
        "生长激素是一种肥料，可以加快作物生长速度 10%（在有农业学家技能时共加速 20%）[1]。获取途径有：第一年春季15号[2]后在皮埃尔的杂货店用 100 购买、手工打造、从碎骨机获得。完成茶水间的 春季作物收集包会得到20个生长激素。",
        "1.6：制作配方中的1个蛤变更为5个苔藓。"
      ],
      "signalChecks": [
        {"signal": "ten-percent-growth", "found": true},
        {"signal": "pine-tar", "found": true},
        {"signal": "moss", "found": true}
      ],
      "navigationError": null,
      "loadError": null,
      "evaluationError": null
    }
  ],
  "regionBoundary": "setlang and cc are request parameters only. navigator language, timezone, visible page text, and result order do not prove physical US/CN location or a personalized US/CN SERP. No CAPTCHA was bypassed.",
  "fatalError": null,
  "finishError": null,
  "finishReceipt": {
    "spaceId": 34,
    "closedSpace": true,
    "keptManagedLabels": [],
    "closedManagedLabels": ["p1"],
    "preservedUnmanagedCount": 0
  },
  "requestedExitCode": 0
}
```

## 地区与来源边界

- 英文样本实际读取的是带 `setlang=en-US&cc=US` 的 Bing 页面；浏览器为 `navigator.language=en`、`navigator.languages=["en","zh-CN"]`、时区 `Asia/Shanghai`，页面未显示明确地区标签。因此只能称为“英文 Bing + US 请求参数观察”，不能称为精确 US 个性化 SERP。
- 中文样本实际读取的是带 `setlang=zh-CN&cc=CN` 的 Bing 页面；页面未显示明确地区标签，同一浏览器仍报告 `en`/`zh-CN` 与 `Asia/Shanghai`。因此不能称为中国大陆物理位置或精确 CN Google SERP。
- Bing 结果标题和数量只记录本次观察；搜索摘要不是游戏事实证明。本报告把官方 1.6 变更和中文页面正文分别作为来源正文读取结果，不把 Bing 摘要升级成来源事实。
- 没有做游戏存档、作物种植/收获实验或计算器算法验证；没有打开或绕过 Google 验证码。

## RI-01 归档可读性记录

本次尝试读取本 Run 已归档的 A-en `ctx_3652eb78c7dd` 与 A-zh `ctx_eb692d0b6b63`，仅使用 Orca `worker-read`，没有读取私有会话数据库，也没有把能力令牌写入本文件。

| 归档 | 实际读取与退出码 | 可取得内容 | 限制 |
|---|---|---|---|
| A-en | `orca orchestration worker-read --dispatch ctx_3652eb78c7dd --source transcript --limit 200 --json`；exit 0 | transcript 中可见一个 `taskSpace(27)`/`p1` 的多 URL `page.goto` + `waitForLoadState("domcontentloaded", {timeout:15000})` + `page.evaluate` 片段；另有官方变更文本命中和 Bing `setlang=en-US&cc=US` 元数据读取片段 | 返回 `contentComplete=false`；标记 `message_limit_or_scan_window`、`transcript_payload`，并说明 oversized transcript/tool input 与旧消息被裁剪；完整原始命令不可从该 bounded read 恢复 |
| A-zh | `orca orchestration worker-read --dispatch ctx_eb692d0b6b63 --source auto --limit 200 --json`；exit 0 | 归档状态为 transcript-only；可见内容不足以取得完整中文浏览器脚本 | 返回 `contentComplete=false`，同样有 `message_limit_or_scan_window`、`transcript_payload` 和旧消息省略；`orca orchestration worker-read --dispatch ctx_eb692d0b6b63 --source terminal --limit 50 --json`；exit 1，明确报 `Dispatch ... preserved transcript output only; terminal output was released.` |

因此，旧 A-en/A-zh 记录在本报告中只作为“已尝试读取但有裁剪”的来源标识，不宣称历史命令已逐字恢复；本次可重跑证据以 `replay.mjs` 和上述新运行 stdout 为准。

## 本次文件与验证

- 新增：[replay.mjs](./replay.mjs)；只负责四个代表样本的导航、选择器/正文读取、错误记录和 TaskSpace 关闭。
- 新增：[replay.md](./replay.md)；保存命令、参数、选择器、实际精简 raw JSON、来源 URL、退出码和地区边界。
- 未改 `research/en.md`、`research/zh.md`、既有 evidence、网站源码、`src`、`public`、`package.json`、`AGENTS.md`、`WORKLOG.md`，未安装依赖、未提交/推送/部署、未做外部写入。

验证命令与结果：

| 命令 | 退出码 | 结果 |
|---|---:|---|
| `node --check docs/blog-ops/stardew-valley-speed-gro/research/reproducibility/replay.mjs` | 0 | JavaScript 语法通过 |
| `ego-browser nodejs < /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/research/reproducibility/replay.mjs` | 0 | 四样本 `pass`；TaskSpace 关闭回执成功 |
| `rg -n 'catch\\s*\\{\\s*\\}' docs/blog-ops/stardew-valley-speed-gro/research/reproducibility/replay.mjs` | 1 | 未发现空 `catch`；退出 1 表示无匹配 |
| `git config --get user.email >/dev/null` | 0 | 按提交前要求读取协调者邮箱；值未输出 |

最终文件 SHA-256：

```text
1429690017e935b317eaa2785bd87f1b45a829b39f50dcfe039e594908146d6e  replay.mjs
```

`replay.md` 的最终 SHA-256 不嵌入自身，避免自引用导致哈希漂移；worker_done 回执会按本文件最终内容回读并报告该值。
