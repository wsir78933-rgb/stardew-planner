import { PublicPicture } from "../../components/public-picture";
import { BlogFaqList } from "../../components/blog/blog-faq-list";
import { BlogSources } from "../../components/blog/blog-sources";

const goldStarCropChineseSources = [
  { href: "https://stardewvalleywiki.com/Farming", label: "耕种" },
  { href: "https://stardewvalleywiki.com/Crops", label: "农作物" },
  { href: "https://stardewvalleywiki.com/Foraging", label: "采集" },
  { href: "https://stardewvalleywiki.com/Fiber", label: "纤维" },
  { href: "https://stardewvalleywiki.com/Fertilizer", label: "肥料" },
  { href: "https://stardewvalleywiki.com/Deluxe_Fertilizer", label: "顶级肥料" },
  { href: "https://stardewvalleywiki.com/Basic_Fertilizer", label: "初级肥料" },
  { href: "https://stardewvalleywiki.com/Quality_Fertilizer", label: "高级肥料" },
  { href: "https://stardewvalleywiki.com/Pierre%27s_General_Store", label: "皮埃尔的杂货店" },
  { href: "https://stardewvalleywiki.com/Farmer%27s_Lunch", label: "农夫午餐" },
  { href: "https://stardewvalleywiki.com/Cooking", label: "烹饪" },
  { href: "https://stardewvalleywiki.com/Bundles", label: "收集包" },
  { href: "https://github.com/Dannode36/StardewValleyDecompiled/blob/main/Stardew%20Valley/StardewValley/Crop.cs#L552-L567", label: "作物收获代码" },
  { href: "https://learn.microsoft.com/en-us/dotnet/api/system.random.nextdouble?view=netframework-4.8.1", label: "Random.NextDouble 随机数方法文档" },
] as const;

export function HowToGetGoldStarCropsStardewValleyChineseArticle() {
  return (
    <>
      <p>
        {"下文讨论按耕种规则判定品质的普通作物。它们在收获时按耕种等级和地块上施用的肥料判定品质。“恰好金星”只算金星，不包括更高的铱星。比较肥料时，要看收获时的耕种等级；使用顶级肥料时，等级较高可能让更多结果转成铱星，反而降低金星概率。耕种等级5时，高级肥料的金星概率为34.3%。基础耕种等级为5时，农夫午餐若在收获时生效，会把等级提升到8，此时概率可升至50.3% ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"耕种"}</a>
        {")。野生种子种出的采集物按采集技能判定品质；纤维始终是普通品质，因此这两类物品不适用下文概率 ("}
        <a href={"https://stardewvalleywiki.com/Crops"}>{"农作物"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Foraging"}>{"采集"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Fiber"}>{"纤维"}</a>
        {")。"}
      </p>
      <h2>{"收获时，哪些因素会影响作物品质？"}</h2>
      <p>
        {"作物品质可以是普通、银星、金星或铱星。铱星高于金星，但种子或肥料都无法保证收获结果恰好为金星 ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"耕种"}</a>
        {")。"}
      </p>
      <p>
        {"从高品质作物保存下来的种子，不会提高下一茬作物获得高品质的概率。下一茬会在收获时按自身条件判定品质，种子的品质不会影响结果 ("}
        <a href={"https://stardewvalleywiki.com/Crops"}>{"农作物"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"耕种"}</a>
        {")。"}
      </p>
      <p>
        {"除非另有说明，以下概率都按一件会进行品质判定的作物计算。耕种5级时，不施肥的金星概率为11%；使用初级肥料为22.67%，高级肥料为34.33%，顶级肥料为35.42% ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"耕种"}</a>
        {")。这一等级下，顶级肥料只比高级肥料略高；而且它的大多数结果仍不会恰好是金星 ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"耕种"}</a>
        {")。"}
      </p>
      <p>
        {"不施肥时，耕种等级0、5和10对应的金星概率分别为1%、11%和21% ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"耕种"}</a>
        {")。"}
      </p>
      <p>
        {"计算使用以下三个变量："}
      </p>
      <div aria-label="耕种变量及含义" className="blog-table-scroll" role="region" tabIndex={0}>
        <table aria-label="耕种变量及含义" className="blog-data-table blog-data-table--wrap">
          <colgroup>
            <col style={{ width: "6rem" }} />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">{"符号"}</th>
              <th scope="col">{"含义"}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>{"f"}</code></td>
              <td>{"收获时生效的耕种等级，包括当时仍有效的食物增益。"}</td>
            </tr>
            <tr>
              <td><code>{"t"}</code></td>
              <td>{"肥料等级：不施肥 "}
        <code>{"0"}</code>
        {"、初级肥料 "}
        <code>{"1"}</code>
        {"、高级肥料 "}
        <code>{"2"}</code>
        {"、顶级肥料 "}
        <code>{"3"}</code>
        {"。"}</td>
            </tr>
            <tr>
              <td><code>{"c"}</code></td>
              <td>{"下式算出的金星原始阈值，是中间值，并非最终的金星概率。"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <strong>{"金星原始阈值"}</strong>
        {" ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"耕种"}</a>
        {")："}
      </p>
      <pre style={{ maxWidth: "100%", overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}>
        <code>{"c = 0.2 × (f / 10)\n  + 0.2 × t × ((f + 2) / 12)\n  + 0.01\n"}</code>
      </pre>
      <p>
        <code>{"Random.NextDouble()"}</code>
        {" 会返回一个 "}
        <code>{"[0,1)"}</code>
        {" 区间内的数。原始阈值 "}
        <code>{"c ≤ 1"}</code>
        {" 时，检查通过概率为 "}
        <code>{"c"}</code>
        {"；"}
        <code>{"c > 1"}</code>
        {" 时，所有可能生成的随机值都会小于阈值，检查通过概率为100%。因此，有效通过概率是 "}
        <code>{"min(1,c)"}</code>
        {"。游戏代码不会把原始 "}
        <code>{"c"}</code>
        {" 限制在1以内 ("}
        <a href={"https://github.com/Dannode36/StardewValleyDecompiled/blob/main/Stardew%20Valley/StardewValley/Crop.cs#L552-L567"}>{"作物收获代码"}</a>
        {"; "}
        <a href={"https://learn.microsoft.com/en-us/dotnet/api/system.random.nextdouble?view=netframework-4.8.1"}>{"Random.NextDouble 随机数方法"}</a>
        {")。"}
      </p>
      <p>
        <strong>{"不施肥、初级肥料或高级肥料（"}
        <code>{"t"}</code>
        {" 分别为 "}
        <code>{"0"}</code>
        {"、"}
        <code>{"1"}</code>
        {" 和 "}
        <code>{"2"}</code>
        {"）"}</strong>
      </p>
      <p>
        {"这三种情况都用 "}
        <code>{"c"}</code>
        {" 检查金星；金星概率为："}
      </p>
      <pre style={{ maxWidth: "100%", overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}>
        <code>{"min(1,c)\n"}</code>
      </pre>
      <p>
        {"("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"耕种"}</a>
        {")"}
      </p>
      <p>
        <strong>{"顶级肥料（"}
        <code>{"t = 3"}</code>
        {"）"}</strong>
      </p>
      <p>
        {"顶级肥料先按原始阈值 "}
        <code>{"c / 2"}</code>
        {" 检查铱星；只有这一步未通过，才会按原始阈值 "}
        <code>{"c"}</code>
        {" 检查金星 ("}
        <a href={"https://github.com/Dannode36/StardewValleyDecompiled/blob/main/Stardew%20Valley/StardewValley/Crop.cs#L552-L567"}>{"作物收获代码"}</a>
        {")。"}
      </p>
      <p>
        <strong>{"金星概率："}</strong>
      </p>
      <pre style={{ maxWidth: "100%", overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}>
        <code>{"[1 − min(1,c / 2)] × min(1,c)\n"}</code>
      </pre>
      <p>
        {"当 "}
        <code>{"c ≤ 1"}</code>
        {" 时，该式可简化为 "}
        <code>{"(1 − c / 2) × c"}</code>
        {"。当 "}
        <code>{"c > 1"}</code>
        {" 时，只要进入金星判定，阈值就必定通过；所以金星概率取决于前面的铱星检查是否失败 ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"耕种"}</a>
        {"; "}
        <a href={"https://learn.microsoft.com/en-us/dotnet/api/system.random.nextdouble?view=netframework-4.8.1"}>{"Random.NextDouble 随机数方法"}</a>
        {")。"}
      </p>
      <p>
        {"使用顶级肥料时，耕种等级较高可能降低金星概率 ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"耕种"}</a>
        {"; "}
        <a href={"https://github.com/Dannode36/StardewValleyDecompiled/blob/main/Stardew%20Valley/StardewValley/Crop.cs#L552-L567"}>{"作物收获代码"}</a>
        {")："}
      </p>
      <div aria-label="耕种等级对应的金星与铱星概率" className="blog-table-scroll" role="region" tabIndex={0}>
        <table aria-label="耕种等级对应的金星与铱星概率" className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">{"耕种等级"}</th>
              <th scope="col">{"金星"}</th>
              <th scope="col">{"铱星"}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{"13"}</td>
              <td>{"49%"}</td>
              <td>{"51%"}</td>
            </tr>
            <tr>
              <td>{"14"}</td>
              <td>{"45.5%"}</td>
              <td>{"54.5%"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        {"耕种等级10时，高级肥料的金星概率为61%；顶级肥料为48.195%，另有40.5%概率获得铱星，合计有88.695%达到金星或更高品质 ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"耕种"}</a>
        {")。如果只需要金星，选高级肥料；顶级肥料先检查铱星，会拉低金星概率。若铱星也符合目标，就选顶级肥料，因为它的金星或更高品质概率更高。"}
      </p>
      <h2>{"选择仍可施用的品质肥料"}</h2>
      <p>
        {"一块耕地只能使用一种肥料；已有初级肥料或高级肥料的地块不能再用顶级肥料替换。初级肥料和高级肥料都要在种子发芽前施用。如果想晚些用顶级肥料，请选尚未施肥的地块。顶级肥料可在播种前或播种后、生长期间，甚至作物完全成熟后施用，但必须赶在收获前 ("}
        <a href={"https://stardewvalleywiki.com/Fertilizer"}>{"肥料"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Deluxe_Fertilizer"}>{"顶级肥料"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"耕种"}</a>
        {")。"}
      </p>
      <p>
        {"先看作物当前生长阶段还允许施用哪些肥料。耕种等级5时，高级和顶级肥料的金星概率相近，分别为34.33%和35.42%。等级10时，高级肥料的金星概率更高 ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"耕种"}</a>
        {")。"}
      </p>
      <p>
        {"初级肥料配方在耕种等级1解锁，2份树液可制作1份。高级肥料配方在耕种等级9解锁，4份树液和1条鱼可制作2份。顶级肥料配方可在齐先生的核桃房用20颗齐钻购买；1个铱锭和40份树液可制作5份 ("}
        <a href={"https://stardewvalleywiki.com/Basic_Fertilizer"}>{"初级肥料"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Quality_Fertilizer"}>{"高级肥料"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Deluxe_Fertilizer"}>{"顶级肥料"}</a>
        {")。"}
      </p>
      <p>
        {"第2年起，皮埃尔的杂货店会以150金出售高级肥料。按你的游戏进度，也许在耕种等级9解锁制作配方前就能买到 ("}
        <a href={"https://stardewvalleywiki.com/Quality_Fertilizer"}>{"高级肥料"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Pierre%27s_General_Store"}>{"皮埃尔的杂货店"}</a>
        {")。"}
      </p>
      <p>
        {"生长激素会改变作物的生长时间，品质肥料影响的是品质。想加快生长就用生长激素；想改变品质判定结果，就用品质肥料 ("}
        <a href={"https://stardewvalleywiki.com/Fertilizer"}>{"肥料"}</a>
        {")。"}
      </p>
      <h2>{"把农夫午餐留到收获时"}</h2>
      <p>
        {"农夫午餐使耕种等级增加3级，持续5分35秒。基础耕种等级为5时，增益持续期间会升到8级 ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"耕种"}</a>
        {")。"}
      </p>
      <p>
        {"使用高级肥料时，耕种等级从5升到8，金星概率会由34.33%升至50.33%。收获开始时吃农夫午餐，并趁增益生效时采摘。若某株作物已经完成品质判定，之后吃午餐也不会改变结果 ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"耕种"}</a>
        {")。如果收获耗时超过5分35秒，只有在增益结束前采下的作物按耕种等级8计算；之后采摘的作物按采摘时生效的耕种等级计算 ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"耕种"}</a>
        {")。"}
      </p>
      <figure className="blog-article-media">
        <PublicPicture
          alt="横向条形图比较恰好金星（不含铱星）的概率，横轴范围为0–60%。耕种5级时，不施肥为11.0%，初级肥料为22.7%，高级肥料为34.3%，顶级肥料为35.4%。图中另列一条高级肥料数据：农夫午餐在收获时生效、耕种等级达到8时，概率为50.3%。"
          height={1100}
          src="/blog/illustrations/how-to-get-gold-star-crops-stardew-valley-quality-odds-zh-CN.webp"
          style={{ aspectRatio: "1 / 1", objectFit: "contain" }}
          width={1100}
        />
        <figcaption className="whitespace-pre-line">{"图中概率按每件进行品质判定的作物计算，统计恰好金星，不含铱星。耕种5级时，高级肥料的概率为34.3%。基础耕种等级为5时，农夫午餐在收获时生效可将等级提升到8。此时，高级肥料的金星概率为50.3%。\n\n耕种5级使用顶级肥料时，金星概率为35.4%，铱星概率为23.0%。两者合计，达到金星或更高品质的概率为58.4%。"}</figcaption>
      </figure>
      <p>
        {"农夫午餐配方在耕种等级3解锁，材料是1份煎蛋卷和1个防风草。第一次升级农舍后新增的厨房可以用来烹饪；采集等级3时也可以用野炊工具制作 ("}
        <a href={"https://stardewvalleywiki.com/Farmer%27s_Lunch"}>{"农夫午餐"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Cooking"}>{"烹饪"}</a>
        {")。"}
      </p>
      <p>
        {"使用高级肥料时，10次每次只产出一件作物的收获，平均得到3.43件金星作物（耕种等级5）；午餐增益把等级升到8时，平均为5.03件。批量不同，可以用会进行品质判定的作物件数乘以单件概率，算出预期数量。比如，20件作物使用高级肥料、按50.33%的概率计算，平均为10.07件，但这不是保证数量 ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"耕种"}</a>
        {")。"}
      </p>
      <h2>{"收集包要求金星时，也把铱星算进去"}</h2>
      <p>
        {"收集包要求金星品质时，也接受更高品质的铱星作物。因此，金星或更高品质与只要金星是两个不同目标 ("}
        <a href={"https://stardewvalleywiki.com/Bundles"}>{"收集包"}</a>
        {")。"}
      </p>
      <p>
        {"耕种等级5使用顶级肥料时，金星概率为35.42%，铱星概率为23%；两者合计，达到金星或更高品质的概率为58.42% ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"耕种"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Bundles"}>{"收集包"}</a>
        {")。只需要金星本身时看35.42%；铱星也符合要求时看58.42%。这是单件作物的概率，不是需要多件物品的整份收集包完成概率。"}
      </p>
      <h2>{"只计算会获得品质判定的物品"}</h2>
      <p>
        {"品质肥料会影响可多次收获作物的每一轮收获；但一次收获若产出多件，最多只有一件会获得品质判定机会。即使获得判定机会，结果仍可能是普通品质；这不保证品质提升 ("}
        <a href={"https://stardewvalleywiki.com/Fertilizer"}>{"肥料"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Crops"}>{"农作物"}</a>
        {")。蓝莓每次收获3颗，咖啡豆每次收获4颗，因此每轮最多只有一颗浆果或咖啡豆会接受品质判定 ("}
        <a href={"https://stardewvalleywiki.com/Crops"}>{"农作物"}</a>
        {")。"}
      </p>
      <p>
        {"巨大作物另当别论：每个巨大作物会掉落15–21件普通品质物品，因此这些产物不计作金星作物 ("}
        <a href={"https://stardewvalleywiki.com/Crops"}>{"农作物"}</a>
        {")。"}
      </p>
      <section className="gold-star-crops-faq">
        <h2>{"星露谷物语金星作物常见问题"}</h2>
        <BlogFaqList
          items={[
            { question: "肥料能保证作物恰好达到金星品质吗？", answer: (
              <p>
                {"不能。对于按耕种规则判定品质的普通作物，肥料会改变收获时的品质概率，但无法保证恰好为金星 ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"耕种"}</a>
        {")。野生种子种出的采集物按采集技能判定品质；纤维始终是普通品质，所以这两类物品不适用耕种概率 ("}
        <a href={"https://stardewvalleywiki.com/Crops"}>{"农作物"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Foraging"}>{"采集"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Fiber"}>{"纤维"}</a>
        {")。"}
              </p>
            ) },
            { question: "什么时候该给金星作物施肥？", answer: (
              <p>
                {"一块已耕地只能使用一种肥料，新肥料不能替换已经施用的肥料。初级肥料或高级肥料必须在种子发芽前施用。顶级肥料可以施在尚未施肥的地块上，任何生长阶段都能用，包括作物完全成熟后；但必须在收获前施用 ("}
        <a href={"https://stardewvalleywiki.com/Fertilizer"}>{"肥料"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Deluxe_Fertilizer"}>{"顶级肥料"}</a>
        {")。"}
              </p>
            ) },
            { question: "耕种等级加成总会提高金星概率吗？", answer: (
              <p>
                {"不一定，结果取决于肥料。使用顶级肥料时，耕种等级13的金星概率为49%，等级14则降至45.5%；更多结果转成了铱星 ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"耕种"}</a>
        {"; "}
        <a href={"https://github.com/Dannode36/StardewValleyDecompiled/blob/main/Stardew%20Valley/StardewValley/Crop.cs#L552-L567"}>{"作物收获代码"}</a>
        {")。"}
              </p>
            ) },
            { question: "收集包要求金星时，会接受铱星作物吗？", answer: (
              <p>
                {"会。收集包要求金星时，更高品质的物品也符合要求，所以铱星作物达到金星最低要求。这属于金星或更高品质，不是恰好金星 ("}
        <a href={"https://stardewvalleywiki.com/Bundles"}>{"收集包"}</a>
        {")。"}
              </p>
            ) },
            { question: "可多次收获的作物，每件产物都会进行品质判定吗？", answer: (
              <p>
                {"品质肥料会影响每一轮收获，但一次收获若产出多件，最多只有一件会获得品质判定机会。即使有机会判定，结果仍可能是普通品质；这不保证品质提升。蓝莓每次收获3颗，咖啡豆每次收获4颗，因此每轮最多只有一件物品会接受品质判定 ("}
        <a href={"https://stardewvalleywiki.com/Fertilizer"}>{"肥料"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Crops"}>{"农作物"}</a>
        {")。"}
              </p>
            ) },
          ]}
        />
      </section>
      <BlogSources heading={"来源"} items={goldStarCropChineseSources} />
    </>
  );
}
