import type { ReactNode } from "react";
import { BlogFaqList, type BlogFaqItem } from "../../components/blog/blog-faq-list";
import { BlogSources, type BlogSourceItem } from "../../components/blog/blog-sources";

const TOWN_MAP_HREF = "/zh/stardew-valley-town-map";
const NPC_GUIDE_HREF = "/zh/stardew-valley-npc";
const ROBIN_GUIDE_HREF = "/zh/where-is-robin-stardew-valley";
const CARPENTER_GUIDE_HREF = "/zh/carpenter-stardew";
const PLANNER_HREF = "/zh#planner";

type LocationRow = Readonly<{
  level: string;
  place: string;
  meaning: string;
}>;

type WorldRelationshipRow = Readonly<{
  place: ReactNode;
  relationship: string;
  limit: string;
}>;

export function WhereIsStardewValleyLocatedChineseArticle() {
  return (
    <article>
      <ChineseLocationIntroduction />
      <ChineseShortAnswer />
      <ChineseLocationHierarchy />
      <ChinesePelicanTown />
      <ChineseWiderWorld />
      <ChineseRealWorldQuestion />
      <ChineseResourceChoice />
      <ChineseCanonBoundary />
      <ChineseLocationFaq />
      <ChineseLocationSources />
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

function LocationTableRegion({
  accessibleName,
  children,
}: Readonly<{ accessibleName: string; children: ReactNode }>) {
  if (accessibleName.trim() === "") {
    throw new Error(
      "位置表格需要非空的无障碍名称。收到的值：" +
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

function ChineseLocationIntroduction() {
  return (
    <>
      <p>
        星露谷物语位于哪里？如果问的是游戏设定，答案很明确：星露谷是芬吉尔共和国南部海岸的虚构地区，鹈鹕镇是其中的社区，玩家继承的农场也在这里。若问的是现实原型，就不能把氛围影响当成官方地点。
      </p>
      <p>
        宝石海、戈特洛帝国、芬群岛、祖祖城和卡利科沙漠把世界扩展到小镇之外，但没有因此把星露谷变成华盛顿、俄勒冈、俄罗斯或其他现实地点。哈维的坐标也需要放在这个边界内阅读。
      </p>
      <p>
        查设定用资料，找路线用小镇地图，安排农场用规划器；三个尺度不要混在一起。
      </p>
    </>
  );
}

function ChineseShortAnswer() {
  return (
    <>
      <h2>星露谷在游戏中位于哪里？简短答案</h2>
      <p>
        星露谷是芬吉尔共和国南部海岸的虚构沿海地区。鹈鹕镇是这里的主要社区，农场是玩家继承并经营的土地。鹈鹕镇南边是宝石海，戈特洛帝国位于宝石海对岸、星露谷以南。
      </p>
      <p>
        官方 About 页面写的是玩家继承了“一块位于星露谷的农田”，没有给出地球上的国家、州、县或纬度。因此可以确定它在虚构世界中的位置，却不能把它当成 Google 地图上的现实地址。
      </p>
    </>
  );
}

function locationHierarchyRows(): readonly LocationRow[] {
  return [
    { level: "1", place: "农场", meaning: "玩家继承、建设和规划的可玩土地。" },
    { level: "2", place: "鹈鹕镇", meaning: "大多数村民居住、工作、购物和交流的社区。" },
    { level: "3", place: "星露谷", meaning: "包含农场和鹈鹕镇的更大沿海地区。" },
    { level: "4", place: "芬吉尔共和国", meaning: "星露谷所属的虚构国家。" },
    {
      level: "5",
      place: "更广阔的世界",
      meaning: "宝石海、芬群岛、戈特洛帝国和祖祖城等地点所在的设定层。",
    },
  ];
}

function ChineseLocationHierarchy() {
  const rows = locationHierarchyRows();
  if (rows.length !== 5) {
    throw new Error("位置层级表需要 5 行，收到 " + rows.length + " 行。");
  }

  return (
    <>
      <h2>分清农场、鹈鹕镇、星露谷和芬吉尔共和国</h2>
      <p>
        “星露谷”是地区名，不是“鹈鹕镇”的另一种叫法。官方介绍从位于星露谷的农田开始，鹈鹕镇页面则把小镇写成玩家开局搬入的社区。攻略里说“进镇”，通常就是离开农场这块可玩区域。
      </p>
      <LocationTableRegion accessibleName="星露谷位置层级">
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">层级</th>
              <th scope="col">地点</th>
              <th scope="col">在游戏中的含义</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.level}>
                <td>{row.level}</td>
                <td>{row.place}</td>
                <td>{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </LocationTableRegion>
      <p>
        农场、鹈鹕镇、星露谷、芬吉尔共和国依次是土地、社区、地区和国家。
      </p>
    </>
  );
}

function ChinesePelicanTown() {
  return (
    <>
      <h2>鹈鹕镇只是星露谷里的一个社区</h2>
      <p>
        鹈鹕镇不是整个星露谷，也不是芬吉尔共和国。玩家在这里认识村民、去皮埃尔商店、使用诊所和博物馆，还从这里走向周边区域。几个出口说明的是本地路线，不是世界地图。
      </p>
      <ul>
        <li>西北入口连接巴士站和农场。</li>
        <li>西南通道通往煤矿森林；玛妮的牧场、莉亚的农舍与法师塔都在这片森林里。</li>
        <li>沙滩就在小镇正南方。</li>
        <li>深山在小镇北边，罗宾的木匠商店、矿井、探险家公会、铁路和采石场都在那个方向。</li>
      </ul>
      <p>
        需要找商店或地标时，打开<a href={TOWN_MAP_HREF}>鹈鹕镇地点与路线指南</a>。它回答“今天从哪里走到哪里”；设定资料回答“这片区域在虚构世界中属于哪里”，两者不能互相替代。
      </p>
      <p>
        鹈鹕镇页面还确认小镇属于芬吉尔共和国，戈特洛帝国在宝石海对岸。这个关系比一张带有自创比例的同人世界地图更可靠。
      </p>
    </>
  );
}

function widerWorldRows(): readonly WorldRelationshipRow[] {
  return [
    {
      place: "芬吉尔共和国",
      relationship: "星露谷所属的虚构国家。",
      limit: "现有设定信息没有确认现实对应国家，也没有完整国界图。",
    },
    {
      place: "宝石海",
      relationship: "鹈鹕镇南部海岸外的虚构海域。",
      limit: "不能直接当成某个现实海洋。",
    },
    {
      place: "戈特洛帝国",
      relationship: "位于宝石海对岸、星露谷以南。",
      limit: "游戏没有提供完整政治地图。",
    },
    {
      place: "芬群岛",
      relationship: "属于芬吉尔共和国、位于宝石海的群岛；姜岛可以到达。",
      limit: "能访问一个岛，不代表知道整个群岛的范围。",
    },
    {
      place: "祖祖城",
      relationship: "在角色、事件和电影中被提到的城市。",
      limit: "与鹈鹕镇的准确距离和方向未被确认。",
    },
    {
      place: <a href="https://stardewvalleywiki.com/The_Desert">卡利科沙漠</a>,
      relationship: "位于鹈鹕镇西北方、可通过巴士到达的区域。",
      limit: "更大的政治地理关系没有确认。",
    },
  ];
}

function ChineseWiderWorld() {
  const rows = widerWorldRows();
  if (rows.length !== 6) {
    throw new Error("更广阔世界关系表需要 6 行，收到 " + rows.length + " 行。");
  }

  return (
    <>
      <h2>更广阔的虚构世界怎样连接</h2>
      <p>
        游戏通过对话、遗失之书、物品说明和可访问地点逐步透露地理关系。设定页把这些线索集中起来，但它不是带比例尺和完整边界的现实地图。
      </p>
      <LocationTableRegion accessibleName="星露谷更广阔世界关系">
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">地点</th>
              <th scope="col">已确认关系</th>
              <th scope="col">仍然未知</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={"world-place-" + index}>
                <td>{row.place}</td>
                <td>{row.relationship}</td>
                <td>{row.limit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </LocationTableRegion>
      <p>
        卡利科沙漠是“能确定相对方位，但不能和小镇步行相连”的例子。它在鹈鹕镇西北方；社区中心金库组合包完成，或在 Joja 社区发展申请表中支付 40000g 修好巴士后，才能从巴士站乘车前往。它不是鹈鹕镇出口旁边的一块沙地。
      </p>
      <p>
        姜岛属于宝石海中的芬群岛，需要修好威利鱼店后面的船才能到达。它通过与本土小镇不同的路线进入。
      </p>
      <p>
        祖祖城也在更大的设定里，但现有资料没有足够的距离与方向来绘制可信的世界地图。把未知保留下来，比用同人地图补上自创国界更准确。
      </p>
    </>
  );
}

function ChineseRealWorldQuestion() {
  return (
    <>
      <h2>星露谷是以华盛顿、俄勒冈还是其他地方为原型</h2>
      <p>
        现有资料没有确认星露谷在地球上的位置。游戏带有太平洋西北地区的感觉，是因为真实生活经验进入了一些食物和采集细节；这属于创作影响，不等于设定声明。Eric Barone 在 Auburn 长大，制作游戏时住在西雅图地区，也在采访里谈过熟悉的食物和采集。
      </p>
      <p>
        采访能解释鲑莓、蘑菇等细节为何亲切，但不能把华盛顿或俄勒冈变成官方答案。没有资料确认它属于这些现实地点，也不是改名后的俄勒冈小镇或俄罗斯村庄。
      </p>
      <p>
        现实影响和虚构地点可以同时存在：现实经验影响了细节，故事中的星露谷仍然属于芬吉尔共和国。
      </p>

      <h3>哈维提到的坐标是什么意思</h3>
      <p>
        哈维的短波广播给出过“北纬 52 度、东经 43.5 度”的线索。星露谷 Wiki 记录了这句游戏文本，但把数字放到地球地图上，前提是先假定虚构地区使用地球坐标系。
      </p>
      <p>
        鹈鹕镇页面讨论现实投影时使用的是条件语气，并指出推算位置不在海岸线上；这和鹈鹕镇位于宝石海海岸的设定发生冲突。一个坐标彩蛋不能推翻整套虚构地理。
      </p>
      <p>所以，哈维的广播是游戏内线索，不是官方现实地址，不能据此确定国家、城镇、农场或海岸。</p>
    </>
  );
}

function ChineseResourceChoice() {
  return (
    <>
      <h2>回答地点问题时，该用哪张地图或工具</h2>
      <p>“地点”可能指世界观、今天的行程，或自己农场上的摆放位置。先按尺度选择资源：</p>
      <ol>
        <li>
          查虚构世界，用<a href="https://stardewvalleywiki.com/Setting">星露谷设定页</a>了解芬吉尔共和国、宝石海、芬群岛和祖祖城。
        </li>
        <li>
          查小镇路线，用<a href={TOWN_MAP_HREF}>鹈鹕镇地图</a>、<a href={NPC_GUIDE_HREF}>NPC 指南</a>或<a href={ROBIN_GUIDE_HREF}>罗宾位置指南</a>。
        </li>
        <li>
          查农场摆放，用<a className="blog-planner-link" href={PLANNER_HREF}>星露谷农场规划器</a>选择正在玩的农场地图，再安排建筑、田地和道路。
        </li>
      </ol>
      <p>
        规划器适合测试农场上的建筑占地、作物区、道路、季节和覆盖范围。它不会绘制芬吉尔共和国，也不会解析哈维的坐标或实时追踪 NPC。需要购买、升级、移动或拆除建筑时，再看<a href={CARPENTER_GUIDE_HREF}>罗宾木匠指南</a>。
      </p>
    </>
  );
}

function ChineseCanonBoundary() {
  return (
    <>
      <h2>游戏确认了什么，又没有确认什么</h2>
      <p>可靠的地点答案要把已知关系和证据边界放在一起：</p>
      <ul>
        <li>星露谷位于虚构的芬吉尔共和国。</li>
        <li>鹈鹕镇是星露谷里的社区，不是整个地区。</li>
        <li>宝石海在鹈鹕镇南边，戈特洛帝国在海的对岸。</li>
        <li>卡利科沙漠和姜岛都能到达，但需要各自的路线。</li>
        <li>这些资料没有确认地球上的国家、完整国界或世界地图比例。</li>
      </ul>
      <p>
        因此，这个问题有明确的虚构答案，也保留着开放的现实答案。现实地图上的对应点属于推测，不应写成游戏官方设定。
      </p>
    </>
  );
}

const chineseLocationFaqItems: readonly BlogFaqItem[] = [
  {
    question: "星露谷在游戏中位于哪里？",
    answer: (
      <p>
        星露谷是芬吉尔共和国南部海岸的虚构地区。鹈鹕镇和玩家农场都在这里，宝石海沿着鹈鹕镇南部海岸展开。
      </p>
    ),
  },
  {
    question: "鹈鹕镇和星露谷是同一个地方吗？",
    answer: (
      <p>
        不是。鹈鹕镇是更大星露谷地区中的社区。农场通过巴士站连接小镇，其他出口通往沙滩、深山和煤矿森林。
      </p>
    ),
  },
  {
    question: "星露谷属于哪个国家？",
    answer: (
      <p>
        它属于虚构的芬吉尔共和国。戈特洛帝国位于宝石海对岸、星露谷以南，游戏没有把这两个国家对应到现实国家。
      </p>
    ),
  },
  {
    question: "星露谷是以华盛顿或俄勒冈为背景吗？",
    answer: (
      <p>
        太平洋西北地区的生活经验影响了部分细节，但那次采访没有确认它属于华盛顿或俄勒冈。那是氛围参考，不是官方坐标。
      </p>
    ),
  },
  {
    question: "哈维的坐标能定位现实地点吗？",
    answer: (
      <p>
        不能。“北纬 52 度、东经 43.5 度”是游戏对话；把它放到地球坐标系后得到的是有前提的同人推测，不是官方地址。
      </p>
    ),
  },
  {
    question: "戈特洛帝国在星露谷的什么方向？",
    answer: (
      <p>
        设定把它放在宝石海对岸、星露谷以南，但现有资料没有给出完整国界或准确距离。
      </p>
    ),
  },
];

function ChineseLocationFaq() {
  return (
    <>
      <h2>常见问题</h2>
      <BlogFaqList items={chineseLocationFaqItems} />
    </>
  );
}

const chineseLocationSourceItems: readonly BlogSourceItem[] = [
  { href: "https://www.stardewvalley.net/about/", label: "《星露谷物语》— About" },
  { href: "https://stardewvalleywiki.com/Setting", label: "设定 — Stardew Valley Wiki" },
  { href: "https://stardewvalleywiki.com/Pelican_Town", label: "鹈鹕镇 — Stardew Valley Wiki" },
  { href: "https://stardewvalleywiki.com/The_Desert", label: "卡利科沙漠 — Stardew Valley Wiki" },
  {
    href: "https://www.portlandmercury.com/games/the-ultimate-stardew-valley-creator-interview-about-pacific-northwest-interests-46567629/",
    label: "Eric Barone 太平洋西北地区影响采访 — Portland Mercury",
  },
];

function ChineseLocationSources() {
  return (
    <BlogSources
      checkedLabel="来源核对日期：2026-09-05。"
      heading="来源"
      items={chineseLocationSourceItems}
    />
  );
}
