import { BlogFaqList } from "../../components/blog/blog-faq-list";
import { BlogSources } from "../../components/blog/blog-sources";
import { PublicPicture } from "../../components/public-picture";

export function StardewFruitChineseArticle() {
  return (
    <article>
      <p>
        星露谷物语的水果不只长在果树上。按原版 1.6 系列的
        <a href="https://zh.stardewvalleywiki.com/水果">水果分类</a>，共有
        <strong>27 个水果项目</strong>：草莓来自耕地作物，苹果可以来自苹果树，
        黑莓能在野外采集，而葡萄和仙人掌果子各有种植、采集两条入口。
        查找一种水果时，先认物品，再看来源、季节和取得条件，最后决定保留、出售或加工。
        这 27 项不是 27 种可种作物，也不是 27 种果树。
      </p>
      <p>
        三张清单合计列出全部 27 项，每个物品只出现一行，多种取得方式放在同一行。
        售价统一采用单个普通品质水果的基础售价，不含职业、熊的知识或其他价格修正；
        作物一次收获多个果实时，也不能把一株的总售价当成一个水果的价格。
        季节首先指星露谷室外的对应来源；姜岛、温室、果蝠山洞以及限时任务的例外会另行注明。
      </p>

      <h2>先分清水果项目、作物与果树</h2>
      <p>
        “水果”回答的是拿到手的物品属于哪一类；“作物”回答的是它是否通过播种培育；
        “果树”则是一种产出水果的树木。三个词不能互换。
        在游戏分类里，辣椒、大黄都算水果，因此可以沿水果的加工路线处理。
        名字带“莓”的宝石甜莓却不属于水果，不能因为名称或外观相似就加入水果清单，
        也不能投进烘干机当作水果烘干。
        <a href="https://zh.stardewvalleywiki.com/烘干机">烘干机的原料说明</a>
        明确列出了这个例外。
      </p>
      <p>
        同一个水果项目还可能跨越来源类型。秋季种子能长出黑莓或野梅，
        但这一类野生种子的产物仍有采集物属性；葡萄种子长出的葡萄与夏天捡到的葡萄，
        则是同一种水果的不同来源。要安排取得方式时读“来源”栏，
        要查机器能否接收时读“加工路线”栏，不必强行把每种水果塞进唯一一种种植方式。
      </p>

      <figure className="blog-article-media">
        <PublicPicture
          alt="水果来源原创示意图：草莓对应耕地作物，苹果对应果树，黑莓对应野外灌木采集。"
          decoding="async"
          height={941}
          loading="lazy"
          src="/blog/illustrations/stardew-fruit-crosswalk.webp"
          width={1672}
        />
        <figcaption>
          草莓、苹果和黑莓分别示意作物、果树与野外采集三条来源。
          这是原创关系示意图，不是游戏截图；画出的果实数量不代表单次产量，黑莓也还有其他取得方式。
        </figcaption>
      </figure>

      <h2>完整清单：主要通过作物取得的 11 项水果</h2>
      <p>
        这一组先检查种源，再检查室外季节。能买到或拿到种子，与眼下能在谷内露天种植，
        是两个独立条件。表中“果酱／果酒／果干”表示可用的处理路线，不表示要按顺序连续加工；
        每条路线都直接消耗原水果。名称链接对应
        <a href="https://zh.stardewvalleywiki.com/农作物">农作物规则</a>
        或特殊物品说明，全部基础单价可在
        <a href="https://zh.stardewvalleywiki.com/水果">水果总表</a>交叉查阅。
      </p>
      <div
        aria-label="通过作物取得的水果清单"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">水果与规则链接</th>
              <th scope="col">来源与取得条件</th>
              <th scope="col">季节或可用地点</th>
              <th scope="col">基础单价</th>
              <th scope="col">加工路线</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["上古水果 Ancient Fruit", "耕种；先取得可播种的上古种子", "谷内室外春、夏、秋", "550 金", "果酱／果酒／果干", "农作物#上古水果"],
              ["蓝莓 Blueberry", "耕种；播种蓝莓种子", "谷内室外夏季", "50 金", "果酱／果酒／果干", "农作物#蓝莓"],
              ["蔓越莓 Cranberries", "耕种；播种蔓越莓种子", "谷内室外秋季", "75 金", "果酱／果酒／果干", "农作物#蔓越莓"],
              ["辣椒 Hot Pepper", "耕种；播种辣椒种子", "谷内室外夏季", "40 金", "果酱／果酒／果干", "农作物#辣椒"],
              ["甜瓜 Melon", "耕种；播种甜瓜种子", "谷内室外夏季", "250 金", "果酱／果酒／果干", "农作物#甜瓜"],
              ["菠萝 Pineapple", "耕种；取得菠萝种子，例如向姜岛商人交换", "谷内室外夏季；姜岛农场全年", "300 金", "果酱／果酒／果干", "农作物#菠萝"],
              ["霜瓜 Powdermelon", "耕种；取得霜瓜种子，不能用金币在商店直接购买种子", "谷内室外冬季；种源另有取得条件", "60 金", "果酱／果酒／果干", "霜瓜种子"],
              ["齐瓜 Qi Fruit", "任务作物；接取“齐先生的作物”后播种齐豆", "任意季节，但受任务期限约束", "1 金", "可制酱、酒、果干；先满足任务出货要求", "齐瓜"],
              ["大黄 Rhubarb", "耕种；大黄种子可在沙漠绿洲购买", "谷内室外春季", "220 金", "果酱／果酒／果干", "农作物#大黄"],
              ["杨桃 Starfruit", "耕种；杨桃种子可在沙漠绿洲购买", "谷内室外夏季", "750 金", "果酱／果酒／果干", "农作物#杨桃"],
              ["草莓 Strawberry", "耕种；草莓种子的购买入口包括复活节", "谷内室外春季", "120 金", "果酱／果酒／果干", "农作物#草莓"],
            ].map(([fruitName, sourceCondition, availability, basePrice, processingRoute, sourcePath]) => (
              <tr key={fruitName}>
                <td><a href={`https://zh.stardewvalleywiki.com/${sourcePath}`}>{fruitName}</a></td>
                <td>{sourceCondition}</td>
                <td>{availability}</td>
                <td>{basePrice}</td>
                <td>{processingRoute}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        上古水果的入口是上古种子，而不是直接把水果放进地里。
        <a href="https://zh.stardewvalleywiki.com/农作物#上古水果">上古水果种源</a>
        包括种子生产器与由古物古代种子制作的种子等途径；古物和可播种的种子要区分。
        大黄与杨桃都能在绿洲买到种子，但一个对应春季，一个对应夏季。
        这类交叉查找能说明“为什么手里有种子，当前露天季节却不合适”，
        不能据此推断哪种作物应当占满农场。
      </p>
      <p>
        霜瓜是 1.6 加入的冬季水果作物。找不到货架上的种子时，可以改查
        <a href="https://zh.stardewvalleywiki.com/霜瓜种子">霜瓜种子的取得入口</a>，
        例如绿色斑点、浣熊妻子的商店与种子生产器。
        除浣熊商店交换和种子生产器外，该页面列出的其他取得方式有秋季 21 日至冬季 20 日的时间窗口。
        “冬季可种”因此不能读成“整个冬季都能从每种途径拿到种子”。
      </p>

      <h2>完整清单：8 种果树对应的水果</h2>
      <p>
        果树这一组包含杏子、樱桃、香蕉、芒果、橙子、桃子、苹果与石榴。
        <a href="https://zh.stardewvalleywiki.com/果树">果树规则</a>
        中的季节指成熟树在谷内室外的结果季，不能拿来限制山洞里的果蝠掉落。
        果树种在温室或姜岛时，成熟后可全年结果；这只是取得时间的例外，
        查找这八种水果不需要先套用一张温室布局图。
      </p>
      <div
        aria-label="八种果树水果与结果季节"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">水果与规则链接</th>
              <th scope="col">来源与取得条件</th>
              <th scope="col">谷内室外结果季</th>
              <th scope="col">基础单价</th>
              <th scope="col">加工路线</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["杏子 Apricot", "成熟杏子树；也可能来自果蝠山洞", "春季", "50 金", "杏子树"],
              ["樱桃 Cherry", "成熟樱桃树；也可能来自果蝠山洞", "春季", "80 金", "樱桃树"],
              ["香蕉 Banana", "成熟香蕉树；先取得香蕉树苗", "夏季；姜岛全年", "150 金", "香蕉树"],
              ["芒果 Mango", "成熟芒果树；先取得芒果树苗", "夏季；姜岛全年", "130 金", "芒果树"],
              ["橙子 Orange", "成熟橙子树；也可能来自果蝠山洞", "夏季", "100 金", "橙子树"],
              ["桃子 Peach", "成熟桃子树；也可能来自果蝠山洞", "夏季", "140 金", "桃子树"],
              ["苹果 Apple", "成熟苹果树；也可能来自果蝠山洞", "秋季", "100 金", "苹果树"],
              ["石榴 Pomegranate", "成熟石榴树；也可能来自果蝠山洞", "秋季", "140 金", "石榴树"],
            ].map(([fruitName, sourceCondition, availability, basePrice, treeAnchor]) => (
              <tr key={fruitName}>
                <td><a href={`https://zh.stardewvalleywiki.com/果树#${treeAnchor}`}>{fruitName}</a></td>
                <td>{sourceCondition}</td>
                <td>{availability}</td>
                <td>{basePrice}</td>
                <td>果酱／果酒／果干</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        普通果树苗在生长条件满足时需要 28 天成熟，成熟树在对应季节通常每天结一个果实，
        最多积累三天的果实。树苗和成熟树是不同阶段，刚种下不能立即按日产一果安排需求。
        果树不需要浇水，冬季也不会死亡；这些规则只用于理解果实何时可得，
        具体树位安排可以另查<a href="/zh/stardew-valley-trees">普通树与果树的区别</a>。
      </p>
      <p>
        山洞入口要单独判断。只有在德米特里厄斯的农场山洞研究中选择果蝠，
        才会走到这条水果来源；选择蘑菇不等于同时开启果蝠。
        <a href="https://zh.stardewvalleywiki.com/山洞">果蝠山洞</a>
        不受室外季节限制，但果实出现有随机性，不保证哪天必定拿到指定水果。
        苹果、杏子、樱桃、橙子、桃子、石榴列有这个入口，香蕉和芒果并不在该山洞的水果名单中。
        如果需要指定果实，查树苗来源与结果季，比把所有希望放在随机山洞产物上更便于安排。
      </p>

      <h2>完整清单：采集及多来源的 8 项水果</h2>
      <p>
        这一组尤其需要把“哪里获得”和“什么季节”一起读。
        野外季节不一定覆盖其他入口：果蝠山洞全年有机会留下部分水果，
        水晶果也有怪物掉落入口。夏季种子、秋季种子和冬季种子是对应季节的野生种子，
        会随机长出该季采集物，不是保证每包都产出表中同一个水果的专用种子。
      </p>
      <div
        aria-label="采集和多来源水果交叉清单"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">水果与规则链接</th>
              <th scope="col">来源与取得条件</th>
              <th scope="col">季节或可用地点</th>
              <th scope="col">基础单价</th>
              <th scope="col">加工路线</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["黑莓 Blackberry", "野外采集、秋季种子或果蝠山洞", "野外秋季；灌木收获季为秋 8—11 日", "20 金", "果酱／果酒／果干", "黑莓"],
              ["仙人掌果子 Cactus Fruit", "沙漠采集；也可播种仙人掌种子", "全年；种植限温室、室内花盆或姜岛农场", "75 金", "果酱／果酒／果干", "仙人掌果子"],
              ["椰子 Coconut", "沙漠地面采集；采集 1 级后可摇沙漠或姜岛棕榈树取得", "全年；须能到达对应区域", "100 金", "果酱／果酒／果干", "椰子"],
              ["水晶果 Crystal Fruit", "采集、冬季种子；也可由矿井灰尘精灵掉落", "野外冬季；矿井掉落另看怪物来源", "150 金", "果酱／果酒／果干", "水晶果"],
              ["葡萄 Grape", "夏季采集或夏季种子；秋季另可播种葡萄种子", "夏季采集；秋季棚架作物", "80 金", "果酱／果酒；烘干产物为葡萄干", "农作物#葡萄"],
              ["美洲大树莓 Salmonberry", "野外灌木采集；也可能来自果蝠山洞", "野外春 15—18 日；山洞不受该日期限制", "5 金", "果酱／果酒／果干", "美洲大树莓"],
              ["香味浆果 Spice Berry", "野外采集、夏季种子或果蝠山洞", "野外夏季；山洞全年有机会出现", "80 金", "果酱／果酒／果干", "香味浆果"],
              ["野梅 Wild Plum", "野外采集、秋季种子或果蝠山洞", "野外秋季；山洞全年有机会出现", "80 金", "果酱／果酒／果干", "野梅"],
            ].map(([fruitName, sourceCondition, availability, basePrice, processingRoute, sourcePath]) => (
              <tr key={fruitName}>
                <td><a href={`https://zh.stardewvalleywiki.com/${sourcePath}`}>{fruitName}</a></td>
                <td>{sourceCondition}</td>
                <td>{availability}</td>
                <td>{basePrice}</td>
                <td>{processingRoute}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        葡萄是最容易误读季节的一项。夏天能捡到葡萄，也能通过夏季种子获得；
        秋天的葡萄种子则种出棚架作物。看见清单写“夏、秋”，应先问自己要走哪条入口，
        不能把两个季节理解成葡萄种子在谷内露天都能种。
        收到水果之后，物品本身仍是葡萄，因此加工时适用同一条葡萄干例外。
      </p>
      <p>
        仙人掌果子的“全年”也带地点条件：去沙漠采集，与在自己的地块上种仙人掌是两回事。
        <a href="https://zh.stardewvalleywiki.com/农作物#仙人掌果子">仙人掌种植地点</a>
        限于温室、室内花盆或姜岛农场，不能从全年采集推导出谷内露天地块全年可种。
        椰子虽然能从棕榈树取得，却不能拿椰子种出棕榈树；
        <a href="https://zh.stardewvalleywiki.com/椰子">椰子的物品说明</a>
        同时指出它不能直接食用，但能用于果酱和果酒，因此“不可食用”也不是排除水果分类的条件。
      </p>

      <h2>基础售价与果酱、果酒、果干怎样对应</h2>
      <p>
        先把清单中的基础单价记作 P。这个值指普通品质、没有价格加成的单个水果，
        不是你手上金星水果的实际售价，也不是商店出售种子的价格。
        同名水果若通过不同途径取得，农耕人加成的适用情况还可能不同；
        <a href="https://zh.stardewvalleywiki.com/水果#农耕人职业适用范围详解">水果总表的职业说明</a>
        将自然生成、野生种子和山洞来源与其他取得方式区分。
        为避免把这些条件混进每一行，清单仅列基础价格，比较自己背包的实际售价时再核对品质与职业。
      </p>
      <div
        aria-label="水果加工原料数量与基础售价口径"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">处理路线</th>
              <th scope="col">一次投入</th>
              <th scope="col">成品基础售价</th>
              <th scope="col">需要保留的条件</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><a href="https://zh.stardewvalleywiki.com/罐头瓶">罐头瓶 → 果酱</a></td>
              <td>1 个水果</td>
              <td>2 × P + 50</td>
              <td>使用水果基础价；原料星级不传给果酱</td>
            </tr>
            <tr>
              <td><a href="https://zh.stardewvalleywiki.com/果酒">小桶 → 果酒</a></td>
              <td>1 个水果</td>
              <td>3 × P</td>
              <td>这里指未陈酿的普通品质果酒，不含工匠加成</td>
            </tr>
            <tr>
              <td><a href="https://zh.stardewvalleywiki.com/烘干机">烘干机 → 果干</a></td>
              <td>5 个同类型、同品质水果</td>
              <td>7.5 × P + 25，成品售价取整数</td>
              <td>1.6 加入；葡萄除外；次日早上完成，原料星级不保留</td>
            </tr>
            <tr>
              <td><a href="https://zh.stardewvalleywiki.com/烘干机">烘干机 → 葡萄干</a></td>
              <td>5 个同品质葡萄</td>
              <td>600 金</td>
              <td>1.6 的专用产物；无工匠加成的基础价格，次日早上完成</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        水果干的售价对应一份消耗五个水果的成品，不能拿它与一个水果、一个果酱或一瓶果酒直接作等量比较。
        例如<a href="https://zh.stardewvalleywiki.com/苹果">苹果</a>
        的普通基础价为 100 金，果酱为 250 金，普通果酒为 300 金，果干为 775 金；
        其中果干消耗五个苹果，前两条加工路线各消耗一个。
        这些是价格与投入数量的对应关系，尚未考虑等待时间、机器数量、用途和取得成本。
      </p>
      <p>
        机器对品质的处理也应分开看。罐头瓶和小桶以原料基础价格决定常规成品价格，
        不是把高星原料的实际售价直接乘进公式。小桶出来的果酒是普通品质，
        果酒表中的银星、金星和铱星通常涉及之后的木桶陈酿。
        烘干机要求五个水果同类型、同品质，只是投料条件，
        不代表投进金星水果就会保留金星成品；葡萄还会直接转入葡萄干规则。
        工匠职业加成也要另外判断，不能把带加成的成品价标成基础价。
      </p>

      <h2>拿到或缺少一种水果时，按这五步判断</h2>
      <ol>
        <li>
          <strong>核对物品名称。</strong>
          在 27 项清单中找到中文名，必要时用旁边的英文名对照。
          名字相近的种子、树苗与果实是不同物品，先确定要找的是水果本身，
          再决定是否需要种子或树苗作为取得入口。
        </li>
        <li>
          <strong>选一条当前能用的来源。</strong>
          有对应种子就核对耕种入口，有成熟果树就核对结果季，
          走采集路线则确认地点和日期。表中列出多个来源不代表每个存档都已经解锁，
          尤其不要把果蝠山洞、沙漠和姜岛当成无条件可达。
        </li>
        <li>
          <strong>分开读取季节和特殊限制。</strong>
          先确认谷内室外、温室、姜岛或山洞的位置，再读相应的时间条件。
          葡萄要区分夏季采集与秋季作物，仙人掌要确认种植地点，
          齐瓜则先检查“齐先生的作物”任务是否进行中。
        </li>
        <li>
          <strong>确定是否需要保留原物。</strong>
          如果正在交收集包或完成指定物品的任务，先看要求的是原水果还是加工品，
          再把多余的水果分配给机器。加工后物品名称和种类会变化，
          不要用能加工来推断果酒一定能替代要求中的水果。
        </li>
        <li>
          <strong>按投入数量核对处理路线。</strong>
          单个水果可用于果酱或果酒；想烘干则先凑齐五个同类型、同品质水果，
          遇到葡萄改查葡萄干。需要比较价格时统一普通基础价、原料数量和职业条件，
          清单本身不替你做整季种植或机器分配的决定。
        </li>
      </ol>
      <p>
        齐瓜必须在最后再检查一次。
        <a href="https://zh.stardewvalleywiki.com/齐瓜">齐瓜规则</a>
        允许它在任意季节生长，但种植入口只在接取对应任务后开放；
        任务完成或到期的当晚，普通齐瓜、齐豆及生长中的作物等会被清除。
        巨大齐瓜有单独例外，不能据此把普通齐瓜理解成可以跨任务永久存放的常规水果。
        表中列出加工路线只说明物品能被机器接收，不意味着加工品可代替任务要求的齐瓜出货。
      </p>

      <h2>常见问题</h2>
      <BlogFaqList
        items={[
          {
            question: "背包里已有五个水果，为什么烘干机还是不收？",
            answer: (
              <p>
                先按名称和品质分组计数，不要只看水果总数。
                三个普通品质苹果加两个金星苹果虽然合计五个，却没有一组达到投料数量；
                混放的苹果和桃子也不能合成一批。
                检查后补齐其中一组同类型、同品质的五个水果，再尝试投入。
              </p>
            ),
          },
        ]}
      />

      <BlogSources
        checkedLabel="核对日期：2026 年 9 月 26 日。适用范围为原版 1.6 系列；果干和葡萄干路线自 1.6 加入，不覆盖模组新增水果。清单价格以水果总表和物品条目为准；山洞条目用于确认来源与季节条件。"
        heading="来源"
        items={[
          {
            href: "https://zh.stardewvalleywiki.com/水果",
            label: "Stardew Valley Wiki 中文：水果",
            note: "27 项名录、基础售价、加工价格与农耕人适用范围",
          },
          {
            href: "https://zh.stardewvalleywiki.com/农作物",
            label: "农作物",
            note: "耕种来源、季节、野生种子与特殊作物取得条件",
          },
          {
            href: "https://zh.stardewvalleywiki.com/果树",
            label: "果树",
            note: "八种果树、结果季与温室和姜岛的全年结果条件",
          },
          {
            href: "https://zh.stardewvalleywiki.com/山洞",
            label: "农场山洞",
            note: "果蝠选择、随机产物与不受季节限制的水果入口",
          },
          {
            href: "https://zh.stardewvalleywiki.com/黑莓",
            label: "黑莓",
            note: "秋季地面采集、灌木收获日期与秋季种子",
          },
          {
            href: "https://zh.stardewvalleywiki.com/美洲大树莓",
            label: "美洲大树莓",
            note: "春季 15—18 日的野外灌木采集窗口",
          },
          {
            href: "https://zh.stardewvalleywiki.com/水晶果",
            label: "水晶果",
            note: "冬季采集、冬季种子与灰尘精灵掉落",
          },
          {
            href: "https://zh.stardewvalleywiki.com/香味浆果",
            label: "香味浆果",
          },
          {
            href: "https://zh.stardewvalleywiki.com/野梅",
            label: "野梅",
          },
          {
            href: "https://zh.stardewvalleywiki.com/仙人掌果子",
            label: "仙人掌果子",
            note: "沙漠采集与种植两条取得路线",
          },
          {
            href: "https://zh.stardewvalleywiki.com/椰子",
            label: "椰子",
            note: "沙漠、棕榈树来源与不可用椰子种树的边界",
          },
          {
            href: "https://zh.stardewvalleywiki.com/霜瓜种子",
            label: "霜瓜种子",
            note: "种源和取得日期限制",
          },
          {
            href: "https://zh.stardewvalleywiki.com/齐瓜",
            label: "齐瓜",
            note: "任务入口、生命周期与巨大齐瓜例外",
          },
          {
            href: "https://zh.stardewvalleywiki.com/罐头瓶",
            label: "罐头瓶",
            note: "果酱原料、基础价格公式与品质条件",
          },
          {
            href: "https://zh.stardewvalleywiki.com/果酒",
            label: "果酒",
            note: "小桶产物的基础价与陈酿品质的区别",
          },
          {
            href: "https://zh.stardewvalleywiki.com/烘干机",
            label: "烘干机",
            note: "五个同类型同品质原料、次日完成与葡萄干例外",
          },
          {
            href: "https://zh.stardewvalleywiki.com/苹果",
            label: "苹果",
            note: "100 金基础单价与三种加工品价格的例子",
          },
        ]}
      />
    </article>
  );
}
