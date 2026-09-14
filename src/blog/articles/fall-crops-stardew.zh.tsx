import { BlogFaqList } from "../../components/blog/blog-faq-list";
import { BlogSources } from "../../components/blog/blog-sources";
import { PublicPicture } from "../../components/public-picture";

export function FallCropsStardewChineseArticle() {
  return (
    <article>
      <p>
        秋 1 先用镰刀清掉非当季枯株；夏 28 还在地里的玉米不枯。皮埃尔秋 1
        就卖蔓越莓、南瓜、葡萄种子，秋 16{" "}
        <a href="https://zh.stardewvalleywiki.com/星露谷展览会">星露谷展览会</a>
        不是种子摊。只种浇得完的格：日均高不等于今年买得到、浇得完，也不要把一季总净利和日均合成另一个「最赚」。
      </p>
      <p>
        每个季节 28 天。日均按普通品质，不计肥料、农耕人、农业学家；蔓越莓每次按
        2 个计价，那 10% 额外浆果不进日均。喷壶浇不完、巴士没通、洋蓟还没上架、没有稀有种子，都只用来划掉今年种不成的行。
      </p>

      <h2>秋天种哪几种：先看货架、年份和浇水</h2>
      <p>
        先问三件事再掏钱：货架上有什么、巴士和货车能不能买到、今晚喷壶还能浇几格。卡住的行先从表上划掉。
      </p>
      <p>
        <a href="https://zh.stardewvalleywiki.com/农作物">农作物</a>
        写：每季第 1 天，不在当季的室外作物枯死，留下枯株，用镰刀清。
        <a href="https://zh.stardewvalleywiki.com/玉米">玉米</a>
        夏 28 还在地里则秋 1 继续长。巨大作物跨季不枯，不要当枯株砍。生长天数不含播种当天，并假定当天浇了水；缺水一天只停长。
      </p>
      <p>
        <a href="https://zh.stardewvalleywiki.com/皮埃尔的杂货店">
          皮埃尔的杂货店
        </a>
        秋季货架营业 09:00–17:00，周三关门（收集包全完成或小镇钥匙除外）。洋蓟
        30 金从第 2 年秋才卖。甜菜、西蓝花、稀有种子、上古水果不在这份货架上。茶水间秋季作物收集包要玉米、茄子、南瓜、山药各
        1 个，交包各留一株即可。
      </p>
      <p>
        秋 16 展览会 09:00–15:00 进镇，商店当天上锁，不是蛋节那种种子摊。春天怎么选看
        <a className="blog-planner-link" href="/zh/best-spring-crop-stardew">
          星露谷春天种什么
        </a>
        ，夏天看
        <a className="blog-planner-link" href="/zh/summer-crops-stardew">
          星露谷夏天种什么
        </a>
        ，温室看
        <a className="blog-planner-link" href="/zh/glasshouse-stardew-valley">
          星露谷物语温室
        </a>
        。
      </p>

      <h2>同一套日均口径下的秋季作物比较</h2>
      <p>
        日均来自
        <a href="https://zh.stardewvalleywiki.com/农作物">农作物「每日收益」</a>
        。蔓越莓示例：（5 × 150 − 240）/ 27 = 18.89。南瓜单周期：（320 − 100）/
        13 = 16.92。西蓝花公式按种子 0 金得 ≈14.58，不要用秋季表另一个分母折中。向日葵日均
        −15.00。
      </p>
      <div
        aria-label="秋季作物维基日均"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">作物</th>
              <th scope="col">种子</th>
              <th scope="col">生长</th>
              <th scope="col">日均</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a href="https://zh.stardewvalleywiki.com/宝石甜莓">宝石甜莓</a>
              </td>
              <td>货车 1,000 金</td>
              <td>24 天</td>
              <td>83.33</td>
            </tr>
            <tr>
              <td>
                <a href="https://zh.stardewvalleywiki.com/上古水果">上古水果</a>
              </td>
              <td>打造免费</td>
              <td>28 天，之后每 7 天</td>
              <td>≈57.14*</td>
            </tr>
            <tr>
              <td>
                <a href="https://zh.stardewvalleywiki.com/蔓越莓">蔓越莓</a>
              </td>
              <td>皮埃尔 240 金</td>
              <td>7 天，之后每 5 天</td>
              <td>≈18.89</td>
            </tr>
            <tr>
              <td>
                <a href="https://zh.stardewvalleywiki.com/南瓜">南瓜</a>
              </td>
              <td>皮埃尔 100 金</td>
              <td>13 天</td>
              <td>16.92</td>
            </tr>
            <tr>
              <td>
                <a href="https://zh.stardewvalleywiki.com/葡萄">葡萄</a>
              </td>
              <td>皮埃尔 60 金</td>
              <td>10 天，之后每 3 天</td>
              <td>16.8</td>
            </tr>
            <tr>
              <td>
                <a href="https://zh.stardewvalleywiki.com/洋蓟">洋蓟</a>
              </td>
              <td>皮埃尔 30 金，第 2 年+</td>
              <td>8 天</td>
              <td>16.25</td>
            </tr>
            <tr>
              <td>
                <a href="https://zh.stardewvalleywiki.com/西蓝花">西蓝花</a>
              </td>
              <td>商店不卖；公式种子 0</td>
              <td>8 天，之后每 4 天</td>
              <td>≈14.58</td>
            </tr>
            <tr>
              <td>
                <a href="https://zh.stardewvalleywiki.com/甜菜">甜菜</a>
              </td>
              <td>绿洲 20 金</td>
              <td>6 天</td>
              <td>13.33</td>
            </tr>
            <tr>
              <td>
                <a href="https://zh.stardewvalleywiki.com/苋菜">苋菜</a>
              </td>
              <td>皮埃尔 70 金</td>
              <td>7 天</td>
              <td>11.43</td>
            </tr>
            <tr>
              <td>
                <a href="https://zh.stardewvalleywiki.com/茄子">茄子</a>
              </td>
              <td>皮埃尔 20 金</td>
              <td>5 天，之后每 5 天</td>
              <td>≈11.2</td>
            </tr>
            <tr>
              <td>
                <a href="https://zh.stardewvalleywiki.com/山药">山药</a>
              </td>
              <td>皮埃尔 60 金</td>
              <td>10 天</td>
              <td>10.00</td>
            </tr>
            <tr>
              <td>
                <a href="https://zh.stardewvalleywiki.com/小白菜">小白菜</a>
              </td>
              <td>皮埃尔 50 金</td>
              <td>4 天</td>
              <td>7.50</td>
            </tr>
            <tr>
              <td>
                <a href="https://zh.stardewvalleywiki.com/玫瑰仙子">玫瑰仙子</a>
              </td>
              <td>皮埃尔 200 金</td>
              <td>12 天</td>
              <td>7.50</td>
            </tr>
            <tr>
              <td>
                <a href="https://zh.stardewvalleywiki.com/小麦">小麦</a>
              </td>
              <td>皮埃尔 10 金</td>
              <td>4 天</td>
              <td>3.75</td>
            </tr>
            <tr>
              <td>
                <a href="https://zh.stardewvalleywiki.com/玉米">玉米</a>
              </td>
              <td>皮埃尔 150 金</td>
              <td>14 天，之后每 4 天</td>
              <td>仅秋 ≈1.92；夏秋 ≈7.41</td>
            </tr>
            <tr>
              <td>
                <a href="https://zh.stardewvalleywiki.com/向日葵">向日葵</a>
              </td>
              <td>皮埃尔 200 金</td>
              <td>8 天</td>
              <td>−15.00</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        今年买不到的行整行跳过。玉米 7.41 必须带「夏秋都种」；只种秋天按 ≈1.92。向日葵皮埃尔
        200 金种子、花 80 金，日均为负。上古水果不是秋 1 室外默认田。
      </p>

      <h2>最晚播种</h2>
      <p>
        「最晚播种」不是维基字段：季节 28 天减去生长天数，要求秋 28
        能收这一次；播种当天浇水，不用生长激素。漏浇一天日期往后推。蔓越莓要 5
        次、葡萄要 6 次，须秋 1。南瓜秋 15 以后、玫瑰仙子秋 16 以后、宝石甜莓秋
        4 以后下种，冬 1 都是未完成阶段。
      </p>
      <div
        aria-label="秋季最晚播种推算"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">作物</th>
              <th scope="col">生长天数</th>
              <th scope="col">秋 28 能收的最晚播种</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>小白菜</td>
              <td>4</td>
              <td>24</td>
            </tr>
            <tr>
              <td>小麦</td>
              <td>4</td>
              <td>24</td>
            </tr>
            <tr>
              <td>甜菜</td>
              <td>6</td>
              <td>22</td>
            </tr>
            <tr>
              <td>苋菜</td>
              <td>7</td>
              <td>21</td>
            </tr>
            <tr>
              <td>洋蓟</td>
              <td>8</td>
              <td>20</td>
            </tr>
            <tr>
              <td>向日葵</td>
              <td>8</td>
              <td>20</td>
            </tr>
            <tr>
              <td>山药</td>
              <td>10</td>
              <td>18</td>
            </tr>
            <tr>
              <td>玫瑰仙子</td>
              <td>12</td>
              <td>16</td>
            </tr>
            <tr>
              <td>南瓜</td>
              <td>13</td>
              <td>15</td>
            </tr>
            <tr>
              <td>宝石甜莓</td>
              <td>24</td>
              <td>4</td>
            </tr>
          </tbody>
        </table>
      </div>
      <figure className="blog-article-media">
        <PublicPicture
          alt="蔓越莓秋 1 种才可能满 5 次，收日 8、13、18、23、28；南瓜两茬推算秋 1 种、秋 14 收，当天再种、秋 27 收；只赶一茬最晚秋 15。漏浇则后移。这是日历示意图，不是游戏截图。"
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/fall-crop-occupancy-calendar-zh.webp"
          width="1672"
        />
        <figcaption>
          蔓越莓一株占满季；南瓜收了才能腾格再种。南瓜两茬日期是推算，不是维基字段。
        </figcaption>
      </figure>

      <h2>蔓越莓、南瓜、葡萄按场景选</h2>
      <p>
        皮埃尔秋 1 同时卖这三种时，问的是多次现卖、巨大作物，还是先留架子过道。三种可以分块种，不要在同一块
        3×3 里混。
      </p>
      <h3>多次现卖：蔓越莓</h3>
      <p>
        秋 1 种，收日 8、13、18、23、28。中间腾不出来改种南瓜。人可以在植株之间走。地很小、喷壶还在初级，先数格子再买，不要按
        18.89 一次买到浇不完。
      </p>
      <h3>单次、可巨大：南瓜</h3>
      <p>
        秋 1 种下，秋 14 熟。要换现金，熟了就收；要巨大，熟了也留着浇左上角。最晚秋
        15 保证普通收成。要两茬：秋 1 种、秋 14 收，当天再种、秋 27 收。
      </p>
      <h3>鲜卖、架子过道：葡萄</h3>
      <p>
        任意生长阶段都不能从植株上走过去。要 6 次须秋 1。两行架子夹一条空路，走到每一株。不要把葡萄围在南瓜
        3×3 外面。路边采的葡萄不是这行日均 16.8。
      </p>
      <figure className="blog-article-media">
        <PublicPicture
          alt="两行葡萄架子夹一条空路才能走到每一株；空路不是浪费，是收割资格。任意生长阶段不能从植株上走过去，枯了才能穿。"
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/fall-grape-walk-zh.webp"
          width="1672"
        />
        <figcaption>
          两行葡萄架子夹一条空路；任意生长阶段不能从植株上走过去。
        </figcaption>
      </figure>
      <p>
        茄子、山药交包留一株。苋菜用镰刀收。小白菜和小麦填最晚播种靠后的空格。玫瑰仙子不当成室外现卖主力。
      </p>

      <h2>巨大南瓜按 3×3 排，洒水器不要占九格</h2>
      <p>
        秋季能长成巨大作物的是南瓜。必须 3×3 九格同种，不要排成一排，也不要在九格里塞蔓越莓、葡萄或洒水器。每天开始时，左上角已成熟并浇水、九格同种，该网格有
        1% 概率变巨大；重叠的 3×3 各自滚。斧头收，掉 15 到 21
        个普通品质。巨大作物换季不枯。温室和姜岛不能出巨大作物。
      </p>
      <p>
        洒水器占一格就不能种南瓜。机身放在 3×3 外面，覆盖圈可以探进田。怎么对覆盖看
        <a className="blog-planner-link" href="/zh/sprinkler-stardew">
          星露谷洒水器
        </a>
        。
      </p>
      <figure className="blog-article-media">
        <PublicPicture
          alt="九格同种南瓜才有巨大资格；洒水器占一格则无资格；左上角须成熟且浇水；Giant Pumpkin 外观不等于九格资格。"
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/fall-pumpkin-3x3-zh.webp"
          width="1672"
        />
        <figcaption>
          九格同种南瓜才有资格；洒水器占一格则无资格；左上角须成熟且浇水。
        </figcaption>
      </figure>
      <p>
        规划器目录搜中文「南瓜」「蔓越莓」匹配 0 条，搜英文 Pumpkin、Cranberries、Giant
        Pumpkin。排 3×3 用普通 Pumpkin 九格；Giant Pumpkin
        只对照巨大外观。规划器能摆作物、切季节、看洒水器占格；它不算金币、不浇水、不掷每天
        1%。
      </p>

      <h2>洋蓟、甜菜、西蓝花、宝石甜莓不是第一年默认货架</h2>
      <p>
        洋蓟第 2 年秋才在皮埃尔卖，30 金，日均 16.25，最晚秋 20。甜菜只在
        <a href="https://zh.stardewvalleywiki.com/绿洲">绿洲</a> 卖 20
        金，日均 13.33，最晚秋 22；要先通巴士。西蓝花商店不卖，挖到了再种。稀有种子皮埃尔和
        Joja 不卖；旅行货车特殊商品里的稀有种子只在春夏以 1,000
        金出现。宝石甜莓无肥料最晚秋 4。上古水果秋 1
        室外种下，无肥料时首次成熟落到冬 1，室内看温室页。
      </p>
      <p>
        下种前核：枯株清了没有；今年买得到、今晚浇得完的名单；蔓越莓 5 次须秋
        1、南瓜最晚秋 15、葡萄 6 次须秋 1；巨大南瓜九格是否同种、洒水器是否在外。
      </p>

      <h2>FAQ</h2>
      <BlogFaqList
        items={[
          {
            question: "第一年秋天种什么？秋 1 皮埃尔默认卖哪些种子？",
            answer: (
              <p>
                第一年皮埃尔秋季货架没有洋蓟：茄子 20 金、玉米 150 金、南瓜 100
                金、小白菜 50 金、山药 60 金、蔓越莓 240 金、向日葵 200
                金、玫瑰仙子 200 金、苋菜 70 金、葡萄 60 金、小麦 10 金。营业
                09:00–17:00，周三关门。甜菜、西蓝花、稀有种子、上古水果不在这份默认购物清单里。
              </p>
            ),
          },
          {
            question:
              "宝石甜莓日均约 83.33，秋 1 能在皮埃尔或旅行货车当默认货买到吗？",
            answer: (
              <p>
                不能。皮埃尔和 Joja
                不卖稀有种子。旅行货车特殊商品里的稀有种子只在春、夏以 1,000
                金出现。秋冬特殊商品不是这粒。普通商品 1.26% 为 600–1,000
                金、不限季节，不是货架。
              </p>
            ),
          },
          {
            question:
              "蔓越莓日均约 18.89 把每次 10% 额外浆果算进去了吗？要收满 5 次必须哪天种？",
            answer: (
              <p>
                没有。18.89 按每次 2 个计价，10% 不进。生长天数 27。秋 1
                种，收日 8、13、18、23、28。初级和高级肥料只作用每次第一个浆果。
              </p>
            ),
          },
          {
            question:
              "南瓜和蔓越莓哪个更赚？能把一季总净利和日均合成「秋季最赚钱」吗？",
            answer: (
              <p>
                不能合成。同一口径下蔓越莓 ≈18.89，南瓜
                16.92。选南瓜是因为巨大、两茬占格或交包，不是因为鲜卖日均更高。
              </p>
            ),
          },
          {
            question: "秋 16 星露谷展览会能买南瓜或蔓越莓种子吗？",
            answer: (
              <p>
                不能。那天商店上锁。星露谷展览会不是蛋节那种种子摊。节日名是星露谷展览会。
              </p>
            ),
          },
          {
            question:
              "规划器搜中文「南瓜」「蔓越莓」有条目吗？它能算秋季日均吗？",
            answer: (
              <p>
                没有。实测中文「南瓜」「蔓越莓」匹配 0 条。搜英文
                Pumpkin、Cranberries、Giant
                Pumpkin。规划器不算金币、不浇水、不掷每天 1%。
              </p>
            ),
          },
        ]}
      />

      <BlogSources
        heading="来源"
        checkedLabel="2026-09-14 对照下方星露谷中文维基。日均按农作物「每日收益」：普通品质，不计肥料、农耕人、农业学家。最晚播种由 28 减生长天数推算，不是维基字段。规划器不算金币、不浇水、不掷每天 1%。"
        items={[
          {
            href: "https://zh.stardewvalleywiki.com/农作物",
            label: "星露谷物语官方中文维基：农作物",
          },
          {
            href: "https://zh.stardewvalleywiki.com/秋季",
            label: "星露谷物语官方中文维基：秋季",
          },
          {
            href: "https://zh.stardewvalleywiki.com/皮埃尔的杂货店",
            label: "星露谷物语官方中文维基：皮埃尔的杂货店",
          },
          {
            href: "https://zh.stardewvalleywiki.com/南瓜",
            label: "星露谷物语官方中文维基：南瓜",
          },
          {
            href: "https://zh.stardewvalleywiki.com/南瓜种子",
            label: "星露谷物语官方中文维基：南瓜种子",
          },
          {
            href: "https://zh.stardewvalleywiki.com/蔓越莓",
            label: "星露谷物语官方中文维基：蔓越莓",
          },
          {
            href: "https://zh.stardewvalleywiki.com/蔓越莓种子",
            label: "星露谷物语官方中文维基：蔓越莓种子",
          },
          {
            href: "https://zh.stardewvalleywiki.com/葡萄",
            label: "星露谷物语官方中文维基：葡萄",
          },
          {
            href: "https://zh.stardewvalleywiki.com/葡萄种子",
            label: "星露谷物语官方中文维基：葡萄种子",
          },
          {
            href: "https://zh.stardewvalleywiki.com/玫瑰仙子",
            label: "星露谷物语官方中文维基：玫瑰仙子",
          },
          {
            href: "https://zh.stardewvalleywiki.com/洋蓟",
            label: "星露谷物语官方中文维基：洋蓟",
          },
          {
            href: "https://zh.stardewvalleywiki.com/甜菜",
            label: "星露谷物语官方中文维基：甜菜",
          },
          {
            href: "https://zh.stardewvalleywiki.com/绿洲",
            label: "星露谷物语官方中文维基：绿洲",
          },
          {
            href: "https://zh.stardewvalleywiki.com/沙漠",
            label: "星露谷物语官方中文维基：沙漠",
          },
          {
            href: "https://zh.stardewvalleywiki.com/西蓝花",
            label: "星露谷物语官方中文维基：西蓝花",
          },
          {
            href: "https://zh.stardewvalleywiki.com/西蓝花种子",
            label: "星露谷物语官方中文维基：西蓝花种子",
          },
          {
            href: "https://zh.stardewvalleywiki.com/稀有种子",
            label: "星露谷物语官方中文维基：稀有种子",
          },
          {
            href: "https://zh.stardewvalleywiki.com/宝石甜莓",
            label: "星露谷物语官方中文维基：宝石甜莓",
          },
          {
            href: "https://zh.stardewvalleywiki.com/上古水果",
            label: "星露谷物语官方中文维基：上古水果",
          },
          {
            href: "https://zh.stardewvalleywiki.com/上古种子",
            label: "星露谷物语官方中文维基：上古种子",
          },
          {
            href: "https://zh.stardewvalleywiki.com/玉米",
            label: "星露谷物语官方中文维基：玉米",
          },
          {
            href: "https://zh.stardewvalleywiki.com/向日葵",
            label: "星露谷物语官方中文维基：向日葵",
          },
          {
            href: "https://zh.stardewvalleywiki.com/向日葵种子",
            label: "星露谷物语官方中文维基：向日葵种子",
          },
          {
            href: "https://zh.stardewvalleywiki.com/旅行货车",
            label: "星露谷物语官方中文维基：旅行货车",
          },
          {
            href: "https://zh.stardewvalleywiki.com/星露谷展览会",
            label: "星露谷物语官方中文维基：星露谷展览会",
          },
          {
            href: "https://zh.stardewvalleywiki.com/收集包",
            label: "星露谷物语官方中文维基：收集包",
          },
          {
            href: "https://zh.stardewvalleywiki.com/秋季种子",
            label: "星露谷物语官方中文维基：秋季种子",
          },
          {
            href: "https://zh.stardewvalleywiki.com/苋菜",
            label: "星露谷物语官方中文维基：苋菜",
          },
          {
            href: "https://zh.stardewvalleywiki.com/茄子",
            label: "星露谷物语官方中文维基：茄子",
          },
          {
            href: "https://zh.stardewvalleywiki.com/山药",
            label: "星露谷物语官方中文维基：山药",
          },
          {
            href: "https://zh.stardewvalleywiki.com/小白菜",
            label: "星露谷物语官方中文维基：小白菜",
          },
          {
            href: "https://zh.stardewvalleywiki.com/小麦",
            label: "星露谷物语官方中文维基：小麦",
          },
          {
            href: "/zh/best-spring-crop-stardew",
            label: "本站：春天种什么",
          },
          {
            href: "/zh/summer-crops-stardew",
            label: "本站：夏天种什么",
          },
          {
            href: "/zh/how-to-earn-money-stardew",
            label: "本站：第一年怎么赚钱",
          },
          {
            href: "/zh/glasshouse-stardew-valley",
            label: "本站：温室布局",
          },
          {
            href: "/zh/sprinkler-stardew",
            label: "本站：洒水器",
          },
          {
            href: "/zh#planner",
            label: "本站：农场规划器",
          },
        ]}
      />
    </article>
  );
}
