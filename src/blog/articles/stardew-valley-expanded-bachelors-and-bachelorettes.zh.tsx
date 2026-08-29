import { BlogFaqList, type BlogFaqItem } from "../../components/blog/blog-faq-list";
import { BlogSources, type BlogSourceItem } from "../../components/blog/blog-sources";

function MarriageCandidateGroupTable() {
  return (
    <div
      className="blog-table-scroll"
      role="region"
      aria-label="星露谷SVE 可结婚角色分组"
      tabIndex={0}
    >
      <table className="blog-data-table">
        <thead>
          <tr>
            <th scope="col">分组</th>
            <th scope="col">人数</th>
            <th scope="col">名字</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>SVE 女性</td>
            <td>4</td>
            <td>克莱尔、奥利维亚、斯嘉丽、索菲娅</td>
          </tr>
          <tr>
            <td>SVE 男性</td>
            <td>3</td>
            <td>兰斯、马格努斯、维克多</td>
          </tr>
          <tr>
            <td>星露谷SVE 可结婚角色合计</td>
            <td>7</td>
            <td>上表七人</td>
          </tr>
          <tr>
            <td>原版可结婚角色（不变）</td>
            <td>12</td>
            <td>
              见 <a href="/zh/stardew-valley-npc">原版 NPC 指南</a>
            </td>
          </tr>
          <tr>
            <td>安装 SVE 后可结婚合计</td>
            <td>19</td>
            <td>原版 12 + SVE 7</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function MarriageCandidateAccessTable() {
  return (
    <div
      className="blog-table-scroll"
      role="region"
      aria-label="星露谷SVE 可结婚角色出现条件"
      tabIndex={0}
    >
      <table className="blog-data-table">
        <thead>
          <tr>
            <th scope="col">对象</th>
            <th scope="col">开局是否在鹈鹕镇活动</th>
            <th scope="col">必须清掉的闸门</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>奥利维亚</td>
            <td>是，开局就在</td>
            <td>无，只跟普通日程</td>
          </tr>
          <tr>
            <td>维克多</td>
            <td>是，开局就在</td>
            <td>无，只跟普通日程</td>
          </tr>
          <tr>
            <td>索菲娅</td>
            <td>开局就在蓝月亮葡萄园</td>
            <td>见面无额外锁；诊所日不在园里</td>
          </tr>
          <tr>
            <td>克莱尔</td>
            <td>只在工作日</td>
            <td>在 Joja 关闭前看完 6 心，否则她不再进城</td>
          </tr>
          <tr>
            <td>斯嘉丽</td>
            <td>开局不是可送礼村民</td>
            <td>索菲娅 2 心见面；索菲娅 8 心加社区中心或 Joja 表后才能送礼</td>
          </tr>
          <tr>
            <td>马格努斯</td>
            <td>法师塔</td>
            <td>进塔条件与原版相同</td>
          </tr>
          <tr>
            <td>兰斯</td>
            <td>开局没有镇内送礼循环</td>
            <td>锻造介绍过场，然后多地图轮转</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function StarterLovedGiftTable() {
  return (
    <div
      className="blog-table-scroll"
      role="region"
      aria-label="星露谷SVE 入门最爱与生日"
      tabIndex={0}
    >
      <table className="blog-data-table">
        <thead>
          <tr>
            <th scope="col">对象</th>
            <th scope="col">生日</th>
            <th scope="col">入门最爱</th>
            <th scope="col">快记</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>奥利维亚</td>
            <td>春 15</td>
            <td>果酒、蓝月亮葡萄酒、巧克力蛋糕、金杆草</td>
            <td>早期贵；葡萄园酒是稳妥路径</td>
          </tr>
          <tr>
            <td>兰斯</td>
            <td>春 8</td>
            <td>怪兽菇、奶油菠萝可丽饼、热带咖喱</td>
            <td>后期战斗 / 岛上掉落</td>
          </tr>
          <tr>
            <td>斯嘉丽</td>
            <td>夏 7</td>
            <td>格兰普顿香橙鸡、蓝莓千层酥、烤浆果麦片</td>
            <td>索菲娅 8 心闸门前不能送礼</td>
          </tr>
          <tr>
            <td>维克多</td>
            <td>夏 23</td>
            <td>电池组、鸭毛、意大利面、蓝月亮葡萄酒</td>
            <td>开局就在镇上</td>
          </tr>
          <tr>
            <td>克莱尔</td>
            <td>秋 8</td>
            <td>杏子、香酥面糊炸鲳鱼、绿茶、什锦莓果派、向日葵</td>
            <td>工作日送礼；保住 6 心事件</td>
          </tr>
          <tr>
            <td>马格努斯</td>
            <td>冬 17</td>
            <td>虚空之喜、虚空三文鱼寿司、太阳精华、虚空精华</td>
            <td>战斗 / 虚空物品</td>
          </tr>
          <tr>
            <td>索菲娅</td>
            <td>冬 27</td>
            <td>玫瑰仙子、格兰普顿香橙鸡、小狗鱼</td>
            <td>餐吧香橙鸡好送</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const expandedMarriageFaqItems: readonly BlogFaqItem[] = [
  {
    question: "星露谷SVE 可结婚角色现在有几人？",
    answer: (
      <p>
        7 个。女性是克莱尔、奥利维亚、斯嘉丽、索菲娅，男性是兰斯、马格努斯、维克多。这是加在原版
        12 人外面的。阿莱西亚、艾萨克、卡米拉还在后续计划里，今天不计入。
      </p>
    ),
  },
  {
    question: "在 SVE 里能和谁结婚？",
    answer: (
      <p>
        上面这七个，加上你仍想选的原版十二人。安迪、马丁、苏珊、莫里斯、马龙，以及其他能交友的
        SVE NPC，当前 Villagers 页都不是结婚对象。
      </p>
    ),
  },
  {
    question: "法师在 SVE 里能结婚吗？",
    answer: (
      <p>
        能。SVE 把他写成马格努斯，三个男性对象之一。原版他只能送礼。不能结婚的法师说明在{" "}
        <a href="/zh/stardew-valley-npc">原版 NPC 指南</a>
        ，SVE 恋爱线在这一页。
      </p>
    ),
  },
  {
    question: "为什么找不到克莱尔或斯嘉丽？",
    answer: (
      <p>
        克莱尔只在工作日出现。Joja 关了又没看 6
        心，她就不再进城。斯嘉丽开局不是可送礼村民：索菲娅 2 心见面，索菲娅 8
        心加上社区中心或 Joja 完成以后才能送礼。
      </p>
    ),
  },
  {
    question: "本页会取代原版 NPC 名单吗？",
    answer: (
      <p>
        不会。原版礼物、原来的 12 人，还有罗宾、玛妮这类服务 NPC，仍在{" "}
        <a href="/zh/stardew-valley-npc">stardew-valley-npc</a>
        。这一页只补 SVE 结婚增量。
      </p>
    ),
  },
];

const expandedMarriageSourceItems: readonly BlogSourceItem[] = [
  {
    href: "https://stardewvalleyexpanded.wiki.gg/wiki/Villagers",
    label: "SVE Wiki：Villagers",
    note: " — 7 名结婚对象。核对于 2026-08-25。",
  },
  {
    href: "https://stardewvalleyexpanded.wiki.gg/wiki/Claire",
    label: "SVE Wiki：克莱尔",
  },
  {
    href: "https://stardewvalleyexpanded.wiki.gg/wiki/Olivia",
    label: "SVE Wiki：奥利维亚",
  },
  {
    href: "https://stardewvalleyexpanded.wiki.gg/wiki/Sophia",
    label: "SVE Wiki：索菲娅",
  },
  {
    href: "https://stardewvalleyexpanded.wiki.gg/wiki/Scarlett",
    label: "SVE Wiki：斯嘉丽",
  },
  {
    href: "https://stardewvalleyexpanded.wiki.gg/wiki/Lance",
    label: "SVE Wiki：兰斯",
  },
  {
    href: "https://stardewvalleyexpanded.wiki.gg/wiki/Magnus",
    label: "SVE Wiki：马格努斯",
  },
  {
    href: "https://stardewvalleyexpanded.wiki.gg/wiki/Victor",
    label: "SVE Wiki：维克多",
  },
  {
    href: "https://stardew-valley-expanded.fandom.com/zh/wiki/%E6%98%9F%E9%9C%B2%E8%B0%B7%E7%89%A9%E8%AF%AD%E6%89%A9%E5%B1%95_Wiki?variant=zh-cn",
    label: "星露谷物语扩展 Wiki 中文首页",
  },
  {
    href: "https://www.nexusmods.com/stardewvalley/mods/3753",
    label: "SVE on Nexus",
    note: " — 主文件 1.15.11。",
  },
  {
    href: "https://zh.stardewvalleywiki.com/婚姻",
    label: "星露谷 Wiki：婚姻",
  },
  {
    href: "https://zh.stardewvalleywiki.com/友谊",
    label: "星露谷 Wiki：友谊",
  },
  {
    href: "https://stardewvalleyplanner.art/zh",
    label: "星露谷农场规划器",
  },
];

export function StardewValleyExpandedBachelorsAndBachelorettesChineseArticle() {
  return (
    <article>
      <p>
        星露谷SVE 可结婚角色现在是 7 个：4 女 3 男，叠在原版 12 人上面。搞趣网 2024
        年那张喜好表还写 5 人，斯嘉丽被划去不可结婚；925G 到 2026 年 8 月仍写「可结婚新增六位」。两份都过时了。这
        7 个名字是克莱尔、奥利维亚、斯嘉丽、索菲娅、兰斯、马格努斯、维克多。
      </p>
      <p>
        完整口味和红心分支在{" "}
        <a href="https://stardewvalleyexpanded.wiki.gg/wiki/Villagers">
          Stardew Valley Expanded Wiki
        </a>
        。原版 12 人在{" "}
        <a href="/zh/stardew-valley-npc">原版礼物、婚姻与服务</a>
        。人选定了，打开{" "}
        <a href="/zh#planner">星露谷农场规划器</a> 给农舍留空。
      </p>
      <p>
        来源：SVE Wiki Villagers 和七个角色页，2026-08-25。中文译名对照{" "}
        <a href="https://stardew-valley-expanded.fandom.com/zh/wiki/%E6%98%9F%E9%9C%B2%E8%B0%B7%E7%89%A9%E8%AF%AD%E6%89%A9%E5%B1%95_Wiki?variant=zh-cn">
          星露谷物语扩展 Wiki
        </a>
        。模组版本：SVE 1.15.11。
      </p>

      <h2>星露谷SVE 可结婚角色：先看这张表</h2>
      <MarriageCandidateGroupTable />
      <p>
        这 7 人会收礼，也有红心事件。结婚条件和原版一样，花束加美人鱼吊坠。马丁、安迪、苏珊、莫里斯、马龙，再加上其他能交友的
        SVE 村民，都不在这张结婚表上。
      </p>

      <h2>谁算可结婚，谁只是新面孔</h2>
      <p>
        「可结婚角色」在这里只指当前能结婚的 SVE 对象。模组里每张新脸并不都算。Villagers
        页还列了可交友的人和不能送礼的人。能交友，不等于能结婚。
      </p>
      <p>
        原版 12 人还在：Alex、Elliott、Harvey、Sam、Sebastian、Shane、Abigail、Emily、Haley、Leah、Maru、Penny。他们的礼物和结婚条件看{" "}
        <a href="/zh/stardew-valley-npc">原版礼物、婚姻与服务</a>。
      </p>
      <p>
        SVE 多出来的是上表这 7 人。马格努斯是原版法师。角色不是新的，结婚线是新的。
      </p>
      <p>
        今天仍不能结婚的：安迪、苹果、冈瑟、马龙、马丁、摩根、莫里斯、苏珊。Villagers
        页写的是可交友。阿莱西亚、艾萨克、卡米拉是计划里的未来对象，不是当前星露谷SVE
        可结婚角色。
      </p>
      <p>镇上找不到人，先翻后面的出现条件表。名单写错的情况少，过场没触发的情况多。</p>

      <h2>4 位女性</h2>
      <h3>克莱尔</h3>
      <p>
        克莱尔不住镇上。她坐公交来上班，开局在 Joja 超市收银。社区中心修好、电影院开业以后，她改去电影院卖零食。草原路
        103 号进不去。生日秋 8。
      </p>
      <p>
        SVE Wiki 上的入门最爱：杏子、香酥面糊炸鲳鱼、绿茶、什锦莓果派、向日葵。
      </p>
      <p>
        只在工作日进城。Joja 关了，而你没看过她的 6 心事件，她就没有进城的理由。就算不打算结婚，也要在她还有班的时候把这场看掉。
      </p>
      <p>
        婚后她仍上 Joja 或电影院的班，周五和下雨休息。室外配偶区会被她改成一小块茶树苗园。
      </p>

      <h3>奥利维亚</h3>
      <p>
        奥利维亚已经退休，和儿子维克多住在皮埃尔东边的詹金斯宅。生日春 15。入门最爱是果酒、蓝月亮葡萄酒、巧克力蛋糕、金杆草。第一年农场会觉得贵。
      </p>
      <p>
        蓝月亮葡萄酒从索菲娅在蓝月亮葡萄园的订货簿买。追奥利维亚的话，就算不追索菲娅，也会路过那片园子。
      </p>
      <p>
        两个人同时约会，詹金斯宅会多一场事件。背包里没有兔脚，母子会对质，两人好感都会掉一大截。带着兔脚进去，他们会正常招呼你，好感不掉。
      </p>

      <h3>索菲娅</h3>
      <p>
        索菲娅在鹈鹕镇西边的蓝月亮葡萄园住，也在那儿干活。人怕生。和斯嘉丽、维克多、艾米丽、海莉、格斯比较近。生日冬
        27。
      </p>
      <p>
        入门最爱：玫瑰仙子、格兰普顿香橙鸡、小狗鱼。香橙鸡在星之果实餐吧能买到。她按周期去哈维诊所，那天人不在园里。
      </p>
      <p>
        第一次见斯嘉丽，是在索菲娅 2 心。索菲娅 8 心还锁着斯嘉丽能不能送礼。追索菲娅等于给第四位女性铺路。
      </p>

      <h3>斯嘉丽</h3>
      <p>
        开局你送不到她。她住塘德林路 106 号，给人打工：春季帮安迪，夏季帮苏珊。生日夏 7。
      </p>
      <p>入门最爱：格兰普顿香橙鸡、蓝莓千层酥、烤浆果麦片。</p>
      <p>
        第一次见面在索菲娅 2 心，当时她父亲正在玛妮牧场买动物产品。要等索菲娅 8
        心，并且你修好社区中心或填完 Joja 发展表，她才变成可送礼的人。那之后才会出现在列出的节日里。
      </p>
      <p>
        中文喜好表还把她写成不能结婚。wiki.gg 的 Villagers 名单里她在这 7 人里。2026-08-25
        打开的 Fandom 中文斯嘉丽页，分类仍写「不可结婚的对象」，信息框写的是可以结婚。分类栏不能当人数用。
      </p>

      <h2>3 位男性</h2>
      <h3>兰斯</h3>
      <p>
        别按普通镇民日程在鹈鹕镇堵他。兰斯是战斗法师，利刃之首的副手，生日春
        8，住利刃之首公会。锻造介绍过场播完，常规行程才开始。之后他在城堡村前哨、探险家公会、姜岛、高地之间轮转。
      </p>
      <p>
        入门最爱：怪兽菇、奶油菠萝可丽饼、热带咖喱。其余最爱里后期鱼、蘑菇和战斗掉落不少。春季第一年冲花束不合适。
      </p>

      <h3>马格努斯</h3>
      <p>
        马格努斯·拉斯莫迪斯就是法师。生日冬 17，住法师塔。原版能送礼，不能结婚。SVE
        里他是三个男性对象之一。
      </p>
      <p>
        入门最爱：虚空之喜、虚空三文鱼寿司、太阳精华、虚空精华。战斗和虚空物品比作物对路。
      </p>
      <p>
        婚后他周一到周四仍去法师塔工作，周五、周六、周日留在农场。第三年摩根到来后，每月 7
        日和 26
        日晚上可能不回农场。见过卡米拉后，周一也不再回农场过夜。别按全职住家配偶去排农场。
      </p>

      <h3>维克多</h3>
      <p>
        维克多开局就在镇上。要一个没有姜岛、也不用先刷索菲娅红心的 SVE
        男性，选他。生日夏 23。读完工程学位，镇上没有稳定工作。和奥利维亚同住詹金斯宅。
      </p>
      <p>
        入门最爱：电池组、鸭毛、意大利面、蓝月亮葡萄酒。前两样走农场系统，葡萄酒又指向索菲娅的园子。麻烦是母子同住，同时约会会多一场事件。
      </p>

      <h2>谁不在镇上，为什么</h2>
      <p>星露谷SVE 可结婚角色有人失踪，先查出现条件，再去翻 wiki 名单。</p>
      <MarriageCandidateAccessTable />
      <p>
        安迪、马丁、苏珊有立绘、对话和工作，看起来像恋爱对象。Villagers
        页写的是可交友，不是可结婚。
      </p>

      <h2>入门最爱与生日</h2>
      <p>
        下表是 wiki infobox 和最爱表里的起步项，不是完整口味。普遍最爱仍适用，除非角色页排除了。稀有物品先看角色页再花。
      </p>
      <StarterLovedGiftTable />
      <p>
        生日礼物仍乘原版倍率。每周两份，生日那天除外。SVE 没有另做一套送礼上限。
      </p>

      <h2>花束和吊坠还是原版那一套</h2>
      <p>友谊、约会、结婚用的还是原版阈值。</p>
      <ol>
        <li>交谈和送礼到 8 心。</li>
        <li>在皮埃尔店里买花束，送出去才算开始约会。后两颗心这时才解锁。</li>
        <li>
          农舍要升到能住配偶的档。
          <a href="/zh/carpenter-stardew">罗宾的建造和升级菜单</a>{" "}
          仍是原版木匠流程。
        </li>
        <li>
          10 心之后，雨天、海滩桥已修好、带上 5000g，向老水手买美人鱼吊坠。
        </li>
      </ol>
      <p>SVE 对象走同一条线。多出来的是地图、物品和事件条件，不是第二套花束。</p>
      <p>
        嫉妒、分手、同时约会多人都还在。奥利维亚和维克多是 SVE
        特有的提醒：同住一宅，同时约会会在詹金斯宅多一场。背包里带着兔脚，这场对质会变成正常招呼。
      </p>
      <p>科罗布斯仍是室友，不是 SVE 男性结婚对象。</p>

      <h2>选定对象之后，再规划农场</h2>
      <p>
        结婚以后配偶搬进农舍，还会多一间配偶房。克莱尔婚后还去上班。兰斯的行程还是公会和岛图轮转。法师塔那边，马格努斯也没搬走。院子铺死了再改就晚了。先在星露谷SVE
        可结婚角色里把人定下来，再摆农场。
      </p>
      <ol>
        <li>
          用上面的出现条件表选人。斯嘉丽不适合当第一年每天送礼的目标。锻造过场没播之前，兰斯也不是镇上常驻对象。
        </li>
        <li>
          打开{" "}
          <a className="blog-planner-link" href="/zh#planner">
            星露谷农场规划器
          </a>
          ，给农舍留空，留出到出货箱的路，已婚农场还要给配偶房留位置。
        </li>
        <li>
          玩 SVE
          农场地图的话，把编辑器切到爷爷的农场、边境农场或沉浸式农场
          2。这三张图在规划器目录里。公开 mods 介绍页已经没了，不用再找单独的模组介绍地址。
        </li>
        <li>
          原版好感怎么算，仍看 <a href="/zh/stardew-valley-npc">原版 NPC 指南</a>
          。规划器不追踪红心、礼物次数或 NPC 坐标。
        </li>
      </ol>
      <p>
        项目存在当前浏览器里。没有账号，也没有 NPC 追踪。占地和道路在规划器里排，送礼回游戏里做。
      </p>
      <p>
        其他布局写法见 <a href="/zh/blog">星露谷农场规划指南</a>。
        <a href="/zh/blog/archive">全部规划指南</a> 在归档页。
      </p>

      <h2>星露谷SVE 可结婚角色常见问题</h2>
      <BlogFaqList items={expandedMarriageFaqItems} />

      <BlogSources heading="来源" items={expandedMarriageSourceItems} />
    </article>
  );
}
