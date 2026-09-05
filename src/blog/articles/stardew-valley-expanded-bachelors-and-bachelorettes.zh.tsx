import type { ReactNode } from "react";
import { BlogFaqList, type BlogFaqItem } from "../../components/blog/blog-faq-list";
import { BlogSources, type BlogSourceItem } from "../../components/blog/blog-sources";

const VANILLA_NPC_GUIDE_HREF = "/zh/stardew-valley-npc";
const CARPENTER_HREF = "/zh/carpenter-stardew";
const PLANNER_HREF = "/zh#planner";

type MarriageCandidateRow = Readonly<{
  group: string;
  count: string;
  names: ReactNode;
}>;

type AccessGateRow = Readonly<{
  candidate: string;
  whereToLook: string;
  accessNote: string;
}>;

type GiftStarterRow = Readonly<{
  candidate: string;
  birthday: string;
  gifts: string;
  planningNote: string;
}>;

export function StardewValleyExpandedBachelorsAndBachelorettesChineseArticle() {
  return (
    <article>
      <ChineseSVEIntroduction />
      <ChineseSVERoster />
      <ChineseSVEAccessOverview />
      <ChineseSVEBachelorettes />
      <ChineseSVEBachelors />
      <ChineseSVEGiftStarters />
      <ChineseSVEDatingSteps />
      <ChineseSVEFarmPlanning />
      <ChineseSVEFaq />
      <ChineseSVESources />
    </article>
  );
}

function VanillaNpcGuideLink({ children }: Readonly<{ children: ReactNode }>) {
  return <a href={VANILLA_NPC_GUIDE_HREF}>{children}</a>;
}

function PlannerLink({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <a className="blog-planner-link" href={PLANNER_HREF}>
      {children}
    </a>
  );
}

function TableRegion({
  accessibleName,
  children,
}: Readonly<{ accessibleName: string; children: ReactNode }>) {
  if (accessibleName.trim() === "") {
    throw new Error(
      "SVE 表格区域需要非空的无障碍名称。收到的值：" +
        JSON.stringify(accessibleName) +
        "。",
    );
  }

  return (
    <div
      className="blog-table-scroll"
      role="region"
      aria-label={accessibleName}
      tabIndex={0}
    >
      {children}
    </div>
  );
}

function ChineseSVEIntroduction() {
  return (
    <>
      <p>
        星露谷物语扩展版（SVE）当前的可结婚新增角色是 7 人：克莱尔、兰斯、马格努斯、奥利维亚、斯嘉丽、索菲娅和维克多。SVE Wiki 的居民页把他们和“可以交友但不能结婚”的村民分开列出。看到立绘、对话和红心事件，并不代表可以直接送花束。
      </p>
      <p>
        7 人里有 4 位女性和 3 位男性。原版 12 位可结婚角色仍然保留，所以安装 SVE 后，实际可选池是 19 人。这份指南只整理 SVE 新增部分；原版对象、礼物和服务请看{" "}
        <VanillaNpcGuideLink>原版 NPC 指南</VanillaNpcGuideLink>。
      </p>
      <p>
        本次通过 ego-browser 核对的 Nexus 模组版本是 SVE 1.15.11。角色页会随着模组更新而变化，表格适合用来定位对象和路线，完整礼物、日程和红心事件仍应回到对应 Wiki 页确认。选好对象后，可以用{" "}
        <PlannerLink>星露谷农场规划器</PlannerLink>先给农舍和道路留出空间。
      </p>
    </>
  );
}

function marriageCandidateRows(): readonly MarriageCandidateRow[] {
  return [
    {
      group: "SVE 女性对象",
      count: "4",
      names: "克莱尔、奥利维亚、斯嘉丽、索菲娅",
    },
    {
      group: "SVE 男性对象",
      count: "3",
      names: "兰斯、马格努斯、维克多",
    },
    {
      group: "SVE 新增合计",
      count: "7",
      names: "克莱尔、兰斯、马格努斯、奥利维亚、斯嘉丽、索菲娅、维克多",
    },
    {
      group: "原版对象仍保留",
      count: "12",
      names: <VanillaNpcGuideLink>查看原版 NPC 指南</VanillaNpcGuideLink>,
    },
  ];
}

function ChineseSVERoster() {
  const rows = marriageCandidateRows();
  if (rows.length === 0) {
    throw new Error("SVE 可结婚角色表需要数据行，收到 " + rows.length + " 行。");
  }

  return (
    <>
      <h2>星露谷 SVE 可结婚角色名单</h2>
      <TableRegion accessibleName="星露谷 SVE 可结婚角色名单">
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">分组</th>
              <th scope="col">人数</th>
              <th scope="col">角色</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              if (row.group.trim() === "" || row.count.trim() === "") {
                throw new Error(
                  "SVE 可结婚角色表缺少分组或人数。分组：" +
                    JSON.stringify(row.group) +
                    "，人数：" +
                    JSON.stringify(row.count) +
                    "。",
                );
              }

              return (
                <tr key={row.group}>
                  <td>{row.group}</td>
                  <td>{row.count}</td>
                  <td>{row.names}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableRegion>
      <p>
        这里的 7 人是 SVE 新增，不是游戏全部的可结婚角色数量。原版 12 人没有被替换。一个村民有立绘、能交友，或者参与红心事件，都不能单独证明他或她可以结婚。
      </p>
    </>
  );
}

function ChineseSVEAccessOverview() {
  const rows: readonly AccessGateRow[] = [
    {
      candidate: "克莱尔",
      whereToLook: "鹈鹕镇的工作地点",
      accessNote: "工作日出现，先看 6 心事件。",
    },
    {
      candidate: "奥利维亚",
      whereToLook: "詹金斯宅",
      accessNote: "和维克多同住，按日程寻找。",
    },
    {
      candidate: "索菲娅",
      whereToLook: "蓝月亮葡萄园",
      accessNote: "住在鹈鹕镇西边的葡萄园。",
    },
    {
      candidate: "斯嘉丽",
      whereToLook: "先走索菲娅的红心路线",
      accessNote: "索菲娅 2 心见面；8 心加社区中心或 Joja 后才能送礼。",
    },
    {
      candidate: "兰斯",
      whereToLook: "锻造和 SVE 后续区域",
      accessNote: "锻造介绍过场后进入常规日程。",
    },
    {
      candidate: "马格努斯",
      whereToLook: "法师塔",
      accessNote: "SVE 角色页列为男性对象，按日程找。",
    },
    {
      candidate: "维克多",
      whereToLook: "詹金斯宅和镇上路线",
      accessNote: "和奥利维亚同住，活动点见角色页。",
    },
  ];

  if (rows.length !== 7) {
    throw new Error("SVE 出现条件表必须包含 7 位角色，收到 " + rows.length + " 位。");
  }

  return (
    <>
      <h2>先查出现条件，再判断角色是否消失</h2>
      <p>
        SVE 把可结婚角色分散到工作地点、葡萄园、法师塔和扩展区域。找不到人时，先判断是事件闸门还是日程差异，再按解锁后的路线寻找，比一直在广场等候更有效。
      </p>
      <TableRegion accessibleName="SVE 可结婚角色出现条件">
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">角色</th>
              <th scope="col">先去哪里找</th>
              <th scope="col">需要注意的条件</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.candidate}>
                <td>{row.candidate}</td>
                <td>{row.whereToLook}</td>
                <td>{row.accessNote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableRegion>
    </>
  );
}

function ChineseSVEBachelorettes() {
  return (
    <>
      <h2>4 位 SVE 女性可结婚角色</h2>
      <h3>克莱尔</h3>
      <p>
        克莱尔住在鹈鹕镇外的乡间，坐公交进城，在 Joja 超市做收银员。社区中心完成并解锁电影院后，她会改在那里工作。她只在上班日进城。
      </p>
      <p>杏子、绿茶、向日葵、什锦莓果派和香酥面糊炸鲳鱼，都是她最爱表里的起点。若她暂时失业，先确认 6 心事件。</p>

      <h3>奥利维亚</h3>
      <p>
        奥利维亚和儿子维克多住在杂货店东边的詹金斯宅。她已从 JojaCo 退休，寻找她时住宅位置比葡萄园更重要。
      </p>

      <h3>索菲娅</h3>
      <p>
        索菲娅住在鹈鹕镇西边的蓝月亮葡萄园，也在那里经营农场。她害羞，喜欢动漫、漫画和角色扮演。玫瑰仙子、格兰普顿香橙鸡和小狗鱼，都是入门选项。
      </p>
      <p>想追斯嘉丽，先看索菲娅 2 心事件认识她；索菲娅 8 心又是送礼闸门的一部分。</p>

      <h3>斯嘉丽</h3>
      <p>
        斯嘉丽不是开局就能送礼的镇民。她住在塘德林路 106 号，第一次出现于索菲娅 2 心事件。索菲娅 8 心加社区中心或 Joja 发展路线之一完成后，才可以给她送礼。
      </p>
      <p>烤浆果麦片、奶酪拼盘、格兰普顿香橙鸡、大片山羊奶、枫糖浆和樱桃，都是前期方向。她春季为安迪、夏季为苏珊做农场帮工。</p>
    </>
  );
}

function ChineseSVEBachelors() {
  return (
    <>
      <h2>3 位 SVE 男性可结婚角色</h2>
      <h3>兰斯</h3>
      <p>
        兰斯是战斗法师，也是利刃之首公会的副手。看完锻造介绍过场后，他才会进入常规行程；之后在城堡村前哨、探险家公会、姜岛和高地之间轮转。只在鹈鹕镇找他会错过路线。
      </p>
      <p>怪兽菇、奶油菠萝可丽饼、热带咖喱、宝石鱼和匕首鱼，都是最爱表里的例子。他的礼物和战斗、钓鱼、扩展区域联系较多。</p>

      <h3>马格努斯</h3>
      <p>
        马格努斯·拉斯莫迪斯就是法师。SVE 角色页把他列为男性对象，并把原版设定说明指向原版 Wiki。寻找时仍应先从法师塔开始。
      </p>
      <p>蛙腿、虚空之喜、虚空三文鱼寿司、远古纤维和虚空根，都是最爱表里的例子。雨天、后期年份和婚后日程分开，找不到他时看对应分支。</p>

      <h3>维克多</h3>
      <p>
        维克多和奥利维亚住在詹金斯宅。他刚从工程专业毕业，还在寻找方向；日常活动包括博物馆、公园、海边、街机和阅读。寻找时按住宅和镇上活动点走。
      </p>
    </>
  );
}

function giftStarterRows(): readonly GiftStarterRow[] {
  return [
    {
      candidate: "奥利维亚",
      birthday: "春 15",
      gifts: "果酒、蓝月亮葡萄酒、巧克力蛋糕、金杆草",
      planningNote: "葡萄园路线",
    },
    {
      candidate: "兰斯",
      birthday: "春 8",
      gifts: "怪兽菇、奶油菠萝可丽饼、热带咖喱",
      planningNote: "后期物品",
    },
    {
      candidate: "斯嘉丽",
      birthday: "夏 7",
      gifts: "烤浆果麦片、奶酪拼盘、格兰普顿香橙鸡",
      planningNote: "先走索菲娅",
    },
    {
      candidate: "维克多",
      birthday: "夏 23",
      gifts: "拉面、意大利面、鸭毛、电池组",
      planningNote: "农场产出",
    },
    {
      candidate: "克莱尔",
      birthday: "秋 8",
      gifts: "杏子、绿茶、向日葵、什锦莓果派",
      planningNote: "按工作地点",
    },
    {
      candidate: "马格努斯",
      birthday: "冬 17",
      gifts: "蛙腿、虚空之喜、虚空三文鱼寿司",
      planningNote: "看法师日程",
    },
    {
      candidate: "索菲娅",
      birthday: "冬 27",
      gifts: "玫瑰仙子、格兰普顿香橙鸡、小狗鱼",
      planningNote: "关系斯嘉丽",
    },
  ];
}

function ChineseSVEGiftStarters() {
  const rows = giftStarterRows();
  if (rows.length !== 7) {
    throw new Error("SVE 入门礼物表必须包含 7 位角色，收到 " + rows.length + " 位。");
  }

  return (
    <>
      <h2>入门最爱礼物与生日</h2>
      <p>
        这是一张用于安排前几次送礼的短表，不是完整喜好表。角色页还会列出通用礼物、SVE 专属物品、电影偏好和例外。生日送稀有物品前，请再打开对应角色页确认。
      </p>
      <TableRegion accessibleName="SVE 入门最爱礼物与生日">
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">角色</th>
              <th scope="col">生日</th>
              <th scope="col">入门最爱</th>
              <th scope="col">规划提示</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.candidate}>
                <td>{row.candidate}</td>
                <td>{row.birthday}</td>
                <td>{row.gifts}</td>
                <td>{row.planningNote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableRegion>
      <p>
        生日倍率和每周送礼次数仍参考原版友谊规则。SVE 增加的是角色路线、物品和事件，不需要另找一套花束或送礼系统。
      </p>
    </>
  );
}

function ChineseSVEDatingSteps() {
  return (
    <>
      <h2>通过 SVE 闸门后，约会流程看原版规则</h2>
      <p>
        原版婚姻指南记录了通用关系流程。先让 SVE 对象出现并可以送礼，再按下面顺序推进；角色自己的事件和日程仍以 SVE 角色页为准。
      </p>
      <ol>
        <li>先把好感度提高到 8 心。可结婚角色在此处会暂停，直到你表达恋爱意向。</li>
        <li>在皮埃尔杂货店购买花束并送出，社交栏状态会改变，之后好感度可以继续到 10 心。</li>
        <li>至少升级一次农舍，并修好通往海滩潮池的桥。建筑准备可以参考<a href={CARPENTER_HREF}>罗宾木匠指南</a>。</li>
        <li>达到 10 心后，在雨天用 5000g 向老水手购买美人鱼吊坠，再送给想结婚的对象。</li>
        <li>等待婚礼日完成，然后重新安排配偶区和农舍周边的通道。</li>
      </ol>
      <p>同时和多位对象约会仍可能触发原版的多人约会事件和冷淡期。想走一条稳定路线，就选定一个对象，把每周礼物留给这条路线。</p>
    </>
  );
}

function ChineseSVEFarmPlanning() {
  return (
    <>
      <h2>选定对象后，再开始规划农场</h2>
      <ol>
        <li>用名单区分真正的可结婚对象和只能交友的 SVE 村民。</li>
        <li>用出现条件表确认事件闸门或日程地点。</li>
        <li>选两三种可重复获得的礼物，不要围绕每一种稀有最爱重做农场。</li>
        <li>打开<PlannerLink>星露谷农场规划器</PlannerLink>，先安排农舍、道路、田地和生产区，再做装饰。</li>
      </ol>
      <p>
        规划器适合测试摆放和道路，不会替代 SVE Wiki 的礼物、事件和日程查询。把事实确认和布局绘制拆成两个小步骤，存档或模组更新后也更容易重新调整。
      </p>
    </>
  );
}

const chineseFaqItems: readonly BlogFaqItem[] = [
  {
    question: "星露谷 SVE 当前有几位可结婚角色？",
    answer: (
      <p>当前 SVE 居民页列出 7 位：克莱尔、兰斯、马格努斯、奥利维亚、斯嘉丽、索菲娅和维克多。他们是加在原版 12 位之外的新增对象。</p>
    ),
  },
  {
    question: "SVE 里可以和谁结婚？",
    answer: (
      <p>新增对象是克莱尔、奥利维亚、斯嘉丽、索菲娅、兰斯、马格努斯和维克多；原版 12 位仍然可选，名单和礼物可以看<a href={VANILLA_NPC_GUIDE_HREF}>原版 NPC 指南</a>。</p>
    ),
  },
  {
    question: "SVE 里的法师可以结婚吗？",
    answer: (
      <p>SVE 的马格努斯角色页把法师列为扩展版男性对象。寻找时先看马格努斯的 SVE 日程，原版设定再参考原版法师页面。</p>
    ),
  },
  {
    question: "为什么找不到斯嘉丽？",
    answer: (
      <p>先看索菲娅 2 心事件认识她，再完成索菲娅 8 心事件，并完成社区中心或 Joja 发展路线之一；这些条件完成前不能给斯嘉丽送礼。</p>
    ),
  },
  {
    question: "SVE 会删除原版可结婚角色吗？",
    answer: (
      <p>不会。SVE 的 7 位对象和原版 12 位并列存在。本页重点是 SVE 的出现条件和礼物路线，原版名单和通用婚姻流程仍然适用。</p>
    ),
  },
];

function ChineseSVEFaq() {
  return (
    <>
      <h2>星露谷 SVE 可结婚角色常见问题</h2>
      <BlogFaqList items={chineseFaqItems} />
    </>
  );
}

const chineseSourceItems: readonly BlogSourceItem[] = [
  {
    href: "https://stardewvalleyexpanded.wiki.gg/wiki/Villagers",
    label: "SVE Wiki：Villagers",
    note: " — 可结婚角色名单已于 2026-09-05 通过 ego-browser 核对。",
  },
  { href: "https://stardewvalleyexpanded.wiki.gg/wiki/Claire", label: "SVE Wiki：克莱尔" },
  { href: "https://stardewvalleyexpanded.wiki.gg/wiki/Olivia", label: "SVE Wiki：奥利维亚" },
  { href: "https://stardewvalleyexpanded.wiki.gg/wiki/Sophia", label: "SVE Wiki：索菲娅" },
  { href: "https://stardewvalleyexpanded.wiki.gg/wiki/Scarlett", label: "SVE Wiki：斯嘉丽" },
  { href: "https://stardewvalleyexpanded.wiki.gg/wiki/Lance", label: "SVE Wiki：兰斯" },
  { href: "https://stardewvalleyexpanded.wiki.gg/wiki/Magnus", label: "SVE Wiki：马格努斯" },
  { href: "https://stardewvalleyexpanded.wiki.gg/wiki/Victor", label: "SVE Wiki：维克多" },
  {
    href: "https://www.nexusmods.com/stardewvalley/mods/3753",
    label: "SVE on Nexus",
    note: " — 浏览器核对到版本 1.15.11。",
  },
  { href: "https://zh.stardewvalleywiki.com/婚姻", label: "星露谷 Wiki：婚姻" },
  { href: "https://zh.stardewvalleywiki.com/友谊", label: "星露谷 Wiki：友谊" },
  { href: "https://stardewvalleyplanner.art/zh", label: "星露谷农场规划器" },
];

function ChineseSVESources() {
  return <BlogSources heading="来源" items={chineseSourceItems} />;
}
