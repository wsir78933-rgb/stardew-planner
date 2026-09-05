import type { ReactNode } from "react";
import { BlogFaqList, type BlogFaqItem } from "../../components/blog/blog-faq-list";
import { BlogSources, type BlogSourceItem } from "../../components/blog/blog-sources";

const TOWN_WIKI_HREF = "https://zh.stardewvalleywiki.com/%E9%B9%88%E9%B9%95%E9%95%87";
const NPC_GUIDE_HREF = "/zh/stardew-valley-npc";
const CARPENTER_GUIDE_HREF = "/zh/carpenter-stardew";
const ROBIN_GUIDE_HREF = "/zh/where-is-robin-stardew-valley";
const PLANNER_HREF = "/zh#planner";

type ExitRow = Readonly<{
  direction: string;
  destination: string;
  decision: string;
}>;

type LandmarkRow = Readonly<{
  landmark: string;
  use: string;
  routeHint: string;
}>;

export function StardewValleyTownMapChineseArticle() {
  return (
    <article>
      <TownMapIntroduction />
      <TownMapExitGuide />
      <TownMapLandmarks />
      <TownMapRouteMethod />
      <TownMapForagingAndFishing />
      <TownMapLimits />
      <TownMapFarmTransition />
      <TownMapPlannerGuide />
      <TownMapChecklist />
      <TownMapFaq />
      <TownMapSources />
    </article>
  );
}

function PlannerLink({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <a className="blog-planner-link" href={PLANNER_HREF}>
      {children}
    </a>
  );
}

function TownMapTableRegion({
  accessibleName,
  children,
}: Readonly<{ accessibleName: string; children: ReactNode }>) {
  if (accessibleName.trim() === "") {
    throw new Error(
      "小镇地图表格需要非空的无障碍名称。收到的值：" +
        JSON.stringify(accessibleName) +
        "。",
    );
  }

  return (
    <div
      aria-label={accessibleName}
      className="blog-table-scroll"
      role="region"
      tabIndex={0}
    >
      {children}
    </div>
  );
}

function TownMapIntroduction() {
  return (
    <>
      <p>
        找《星露谷物语》小镇地图时，先不要背每栋房子的门牌。鹈鹕镇最有用的记忆点是四个出口：西北去巴士站和农场，西南去煤矿森林，南边去沙滩，北边去深山。官方中文 Wiki 的鹈鹕镇页也按这组连接描述小镇。
      </p>
      <p>
        这份路线重点解决三件事：你现在在哪个区域、下一站该从哪边离开、回到农场后是否需要重新安排布局。NPC 当天在哪里、商店是否营业和农场建筑怎么摆，分别属于日程、服务和规划问题。
      </p>
      <p>
        记住方向比寻找一张塞满图标的截图更耐用。地点会因为版本、节日、天气和玩家进度出现不同情况；地图负责给你方向，具体服务仍要看对应页面。
      </p>
    </>
  );
}

function exitRows(): readonly ExitRow[] {
  return [
    {
      direction: "西北",
      destination: "巴士站、农场",
      decision: "办完镇上事务后回家，或去巴士站换乘。",
    },
    {
      direction: "西南",
      destination: "煤矿森林",
      decision: "继续找玛妮的牧场、莉亚的农舍和法师塔。",
    },
    {
      direction: "南",
      destination: "沙滩",
      decision: "去海边、鱼店或潮池时从这里离开。",
    },
    {
      direction: "北",
      destination: "深山",
      decision: "去木匠商店、矿井、探险家公会、铁路或采石场。",
    },
  ];
}

function TownMapExitGuide() {
  const rows = exitRows();
  if (rows.length !== 4) {
    throw new Error("鹈鹕镇出口表必须包含 4 行，收到 " + rows.length + " 行。");
  }

  return (
    <>
      <h2>鹈鹕镇小镇地图：先记住四个出口</h2>
      <TownMapTableRegion accessibleName="鹈鹕镇四个出口">
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">方向</th>
              <th scope="col">通往哪里</th>
              <th scope="col">下一步判断</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.direction}>
                <td>{row.direction}</td>
                <td>{row.destination}</td>
                <td>{row.decision}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TownMapTableRegion>
      <p>
        站在小镇中央时，先问“我下一站在哪一边”。回农场走西北；找罗宾或矿井走北；去沙滩走南；去煤矿森林走西南。不要先搜“最快路线”，先走对出口就已经省掉大部分绕路。
      </p>
    </>
  );
}

function landmarkRows(): readonly LandmarkRow[] {
  return [
    {
      landmark: "皮埃尔的杂货店",
      use: "买种子和日常补给。",
      routeHint: "镇中央，适合当作起点。",
    },
    {
      landmark: "哈维的诊所",
      use: "处理诊所相关服务。",
      routeHint: "先确认当天营业和 NPC 行程。",
    },
    {
      landmark: "社区中心",
      use: "推进收集包和社区路线。",
      routeHint: "靠近镇中央西侧。",
    },
    {
      landmark: "博物馆、铁匠铺",
      use: "捐赠发现物、处理工具和矿石。",
      routeHint: "都在镇中央附近，目标不同不必重复跑全镇。",
    },
    {
      landmark: "Joja 超市",
      use: "处理 Joja 路线下的购物和进度。",
      routeHint: "与社区中心是两条不同的进度路线。",
    },
    {
      landmark: "星之果实酒吧",
      use: "找格斯、吃饭和处理酒吧相关事件。",
      routeHint: "晚上仍可能是镇内路线的一站。",
    },
    {
      landmark: "书摊",
      use: "寻找 1.6 版本新增的书摊老板。",
      routeHint: "先把它当作镇内地标，不要和固定商店混为一谈。",
    },
  ];
}

function TownMapLandmarks() {
  const rows = landmarkRows();
  if (rows.length !== 7) {
    throw new Error("鹈鹕镇地标表必须包含 7 行，收到 " + rows.length + " 行。");
  }

  return (
    <>
      <h2>先认出哪些鹈鹕镇地标</h2>
      <p>
        进入小镇后，先找反复会用到的服务点，再决定要不要走向边缘出口。皮埃尔商店、诊所、社区中心、博物馆、铁匠铺、Joja 超市和星之果实酒吧，是一张实用路线里最值得先认出的节点。
      </p>
      <TownMapTableRegion accessibleName="鹈鹕镇主要地标">
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">地标</th>
              <th scope="col">用途</th>
              <th scope="col">路线提示</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.landmark}>
                <td>{row.landmark}</td>
                <td>{row.use}</td>
                <td>{row.routeHint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TownMapTableRegion>
      <p>
        购物、升级工具、捐赠发现物和找 NPC，不一定要走同一条路线。先确定本趟唯一的主要目的，再加一个顺路地标，通常比把所有店铺都逛一遍更省时间。
      </p>
    </>
  );
}

function TownMapRouteMethod() {
  return (
    <>
      <h2>把小镇路线分成中央和边缘两层</h2>
      <p>
        第一层是中央服务区：先用杂货店、诊所、社区中心、博物馆、铁匠铺、Joja 超市和酒吧确认自己的位置。第二层是边缘出口：根据下一站选择西北、西南、南或北。
      </p>
      <ol>
        <li>先说清楚这趟是买补给、办服务、交收藏还是继续赶路。</li>
        <li>用中央地标靠近主要目的地，不要一进镇就横穿整张图。</li>
        <li>办完主事项后，再判断顺路地标是否值得加入。</li>
        <li>只有下一步真的要回农场时，才从西北出口离开。</li>
      </ol>
      <p>
        如果目的是找某个 NPC，路线还要叠加日期、天气、节日和进度条件。鹈鹕镇居民页说明不同居民有不同每日行程；需要具体人物位置时，去看<a href={NPC_GUIDE_HREF}>星露谷 NPC 指南</a>或对应角色页。
      </p>
    </>
  );
}

function TownMapForagingAndFishing() {
  return (
    <>
      <h2>小镇地图也能帮你安排采集和钓鱼</h2>
      <p>
        鹈鹕镇不是只有商店。中文 Wiki 的采集资料列出：春季常见黄水仙，夏季是甜豌豆，秋季是黑莓，冬季则会出现番红花、冬青和水晶果。季节改变时，顺路搜集的目标也会改变。
      </p>
      <p>
        河流横穿鹈鹕镇，可以按季节和天气安排河钓。秋季河的北端还能钓到传说鱼安康鱼。要找海鱼，则从南出口去沙滩；不要把河流和海边当成同一种钓鱼位置。
      </p>
      <p>
        这些内容适合放进“今天跑镇”的顺路计划：先办必须完成的服务，再经过路线上的采集点或河边，最后决定是否从西北出口回家。完整出现时间和概率仍以中文居民页的对应表格为准。
      </p>
    </>
  );
}

function TownMapLimits() {
  return (
    <>
      <h2>小镇地图不能替你判断什么</h2>
      <p>
        地点连接和当天可用服务是两类信息。小镇地图能告诉你往哪里走，却不能保证某个柜台此刻营业，也不能替你读取 NPC 的实时位置、节日改动或存档进度。
      </p>
      <ul>
        <li>要找罗宾，先看<a href={ROBIN_GUIDE_HREF}>Robin 位置指南</a>的日程和例外。</li>
        <li>要升级、建造、移动或拆除建筑，去看<a href={CARPENTER_GUIDE_HREF}>星露谷木匠指南</a>。</li>
        <li>要规划农场占地，使用规划器，不要把鹈鹕镇截图当成农场地图。</li>
      </ul>
      <p>
        天气、节日、施工和玩家进度都可能改变现场情况。遇到“地图上找得到、游戏里却没有”的情况，先检查匹配版本的日程页，再判断路线是否需要改变。
      </p>
    </>
  );
}

function TownMapFarmTransition() {
  return (
    <>
      <h2>回农场前，先把这一趟变成一个决定</h2>
      <p>
        一趟进镇不只是移动：买种子可能改变田地大小，升级工具可能改变下一块工作区，找到新机器或动物也可能暴露农场道路太窄。回家前先说清楚“这趟要解决什么”，回到农场才不会只留下零散物品。
      </p>
      <p>
        小镇地图解决目的地，农场规划解决占地。两者衔接起来的顺序很简单：认出目标地标，办完服务，回西北出口到农场，再检查门口、生产区、作物区和出货箱之间的路线。
      </p>
    </>
  );
}

function TownMapPlannerGuide() {
  return (
    <>
      <h2>认清鹈鹕镇后，再规划自己的农场</h2>
      <p>
        农场布局是另一张地图。打开<a className="blog-planner-link" href={PLANNER_HREF}>星露谷农场规划器</a>，先选择正在玩的农场类型，再试摆建筑、作物、可放置物和装饰，检查门口与道路是否留出工作空间。
      </p>
      <ol>
        <li>先放农舍、出货箱和必须保留的固定路线。</li>
        <li>再安排田地、动物区、储存和加工设备。</li>
        <li>把装饰放到最后，避免把每天要走的通道填满。</li>
        <li>确认方案后，再回游戏里花材料建造。</li>
      </ol>
      <p>
        规划器只处理你控制的农场布局，不显示鹈鹕镇，也不实时追踪 NPC。小镇路线、NPC 日程和建筑规则仍然分别回到对应参考页。
      </p>
    </>
  );
}

function TownMapChecklist() {
  return (
    <>
      <h2>可打印的鹈鹕镇跑图清单</h2>
      <p>需要纸质参考时，可以直接使用浏览器打印这组检查项：</p>
      <ul>
        <li>我知道西北出口通往巴士站和农场。</li>
        <li>我知道北边去深山，南边去沙滩。</li>
        <li>我知道西南通往煤矿森林和其中的几个住处。</li>
        <li>我能找到杂货店、诊所、社区中心、博物馆、铁匠铺和酒吧。</li>
        <li>我已经按日期、天气和进度检查了需要寻找的 NPC。</li>
        <li>我已经决定办完事情后是继续跑镇，还是回农场试摆布局。</li>
      </ul>
    </>
  );
}

const townMapFaqItems: readonly BlogFaqItem[] = [
  {
    question: "鹈鹕镇和农场地图是一回事吗？",
    answer: (
      <p>
        不是。鹈鹕镇是居民生活、工作和社交的社区；农场是另一块可玩区域，从西北出口经巴士站连接。小镇地图解决路线，规划器解决农场摆放。
      </p>
    ),
  },
  {
    question: "从鹈鹕镇怎么回农场？",
    answer: (
      <p>
        从西北出口走向巴士站，再回到农场。鹈鹕镇中文 Wiki 明确把这一侧写成通往巴士站和农场。
      </p>
    ),
  },
  {
    question: "鹈鹕镇四个出口分别通往哪里？",
    answer: (
      <p>
        西北通往巴士站和农场，西南通往煤矿森林，南边通往沙滩，北边通往深山。
      </p>
    ),
  },
  {
    question: "小镇地图会显示 NPC 实时位置吗？",
    answer: (
      <p>
        不会。NPC 位置会随日期、天气、节日和进度变化，要看对应角色的日程页。规划器也只用于农场布局，不是 NPC 追踪器。
      </p>
    ),
  },
  {
    question: "需要下载鹈鹕镇地图吗？",
    answer: (
      <p>
        不需要下载才能使用这份路线清单；浏览器打印即可。要查游戏内的具体地标和当前版本资料，直接打开中文鹈鹕镇 Wiki 页面。
      </p>
    ),
  },
];

function TownMapFaq() {
  return (
    <>
      <h2>星露谷物语小镇地图常见问题</h2>
      <BlogFaqList items={townMapFaqItems} />
    </>
  );
}

const townMapSourceItems: readonly BlogSourceItem[] = [
  {
    href: TOWN_WIKI_HREF,
    label: "鹈鹕镇 — Stardew Valley Wiki",
    note: "，出口、主要地点、采集和钓鱼资料核对日期：2026-09-05。",
  },
  { href: "https://zh.stardewvalleywiki.com/%E5%B1%85%E6%B0%91", label: "居民 — Stardew Valley Wiki" },
  { href: "https://zh.stardewvalleywiki.com/%E5%86%9C%E5%9C%BA", label: "农场 — Stardew Valley Wiki" },
  { href: NPC_GUIDE_HREF, label: "星露谷 NPC 指南" },
  { href: CARPENTER_GUIDE_HREF, label: "星露谷木匠指南" },
  { href: ROBIN_GUIDE_HREF, label: "Robin 位置指南" },
  { href: "https://stardewvalleyplanner.art/zh", label: "星露谷农场规划器" },
];

function TownMapSources() {
  return <BlogSources heading="来源" items={townMapSourceItems} />;
}
