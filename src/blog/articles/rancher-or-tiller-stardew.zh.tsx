import { BlogFaqList } from "../../components/blog/blog-faq-list";
import { BlogSources } from "../../components/blog/blog-sources";

export function RancherOrTillerStardewChineseArticle() {
  return (
    <article>
      <p>
        过夜后耕种 5 级弹出的两项，官方名是<a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E6%8A%80%E8%83%BD&variant=zh-cn">农耕人</a>和畜牧人。先看你往出货箱里扔的主要是农作产品还是畜产品，再选；20% 和 10% 乘的不是同一类货。选完 5 级，10 级只剩对应那一对：畜牧人锁鸡舍大师或牧羊人，农耕人锁工匠或农业学家。
      </p>
      <p>
        当天第一次升到耕种 5 级，<a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E6%8A%80%E8%83%BD&variant=zh-cn">技能</a>页会提示「你有些事情想在今天结束的时候考虑一下」。农耕人和畜牧人要等晚上睡觉才弹出，白天技能栏里选不了；新解锁的配方也要当天结束、自动存档之后才到手。专精售价按次日清晨生效：提示出现的这一天已经放进出货箱的货，加不上刚选的售价加成；要吃新加成的货，留到选完职业后的次日清晨再进箱子。
      </p>

      <h2>农耕人和畜牧人加的不是同一类货</h2>
      <p>
        <a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E6%8A%80%E8%83%BD&variant=zh-cn">技能</a>页写明：每项技能在 5 级和 10 级都可以选择其中一项职业。畜牧人把畜产品价值提升 20%；农耕人把农作产品价值提升 10%。
      </p>
      <p>
        20% 看起来更大，可两边乘的货不一样。要比，先固定箱子里是哪一类：生鲜蛋奶走畜牧人那一列；蔬菜和能加农耕人的水果走农耕人。
      </p>
      <div
        aria-label="农耕人和畜牧人加在什么货上"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">职业</th>
              <th scope="col">加成</th>
              <th scope="col">加在什么货上</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>畜牧人</td>
              <td>+20%</td>
              <td>畜产品。蛋、牛奶信息框有这一列</td>
            </tr>
            <tr>
              <td>农耕人</td>
              <td>+10%</td>
              <td>农作产品。蔬菜加；水果要非采集来源才加；咖啡豆不加</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E8%9B%8B&variant=zh-cn">蛋</a>信息框有畜牧人列、没有工匠列：基础 50 / 62 / 75 / 100 金，畜牧人 60 / 74 / 90 / 120 金。<a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E7%89%9B%E5%A5%B6&variant=zh-cn">牛奶</a>同样只有畜牧人列：基础 125 / 156 / 187 / 250 金，畜牧人 150 / 187 / 224 / 300 金。这些是维基物品页数字，不是某份存档实测。
      </p>
      <p>
        弹窗上叫农耕人、畜牧人。技能头衔里另有「牧场主」「农业学家」，按各系总等级算，跟这扇 5 级门分开；10 级职业里也有一个农业学家，别和头衔混。
      </p>

      <h2>5 级这一选会锁住 10 级哪一对</h2>
      <p>
        <a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E8%80%95%E7%A7%8D&variant=zh-cn">耕种</a>技能表把 10 级分成两列。5 级选了畜牧人，10 级只在鸡舍大师和牧羊人里再选一项；选了农耕人，10 级只在工匠和农业学家里再选一项。5 级、10 级各选一项；不能 5 级畜牧人再接 10 级工匠。
      </p>
      <figure className="blog-article-media">
        <img
          alt="左侧从畜牧人分出鸡舍大师和牧羊人，右侧从农耕人分出工匠和农业学家的两列示意图"
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/rancher-or-tiller-profession-tree-zh.webp"
          width="1672"
        />
        <figcaption>耕种 5 级选畜牧人，10 级只能在鸡舍大师和牧羊人里选；选农耕人，10 级只能在工匠和农业学家里选。这是示意图，不是游戏弹窗截图。</figcaption>
      </figure>
      <div
        aria-label="耕种 5 级与 10 级职业"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">5 级</th>
              <th scope="col">10 级选项</th>
              <th scope="col">效果</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>畜牧人</td>
              <td>鸡舍大师</td>
              <td>更快与笼里的动物交好；孵化时间减半；隐藏品质 +0.333</td>
            </tr>
            <tr>
              <td>畜牧人</td>
              <td>牧羊人</td>
              <td>更快与畜棚的动物交好；绵羊产毛变快；隐藏品质 +0.333</td>
            </tr>
            <tr>
              <td>农耕人</td>
              <td>工匠</td>
              <td>精工制品 +40%（醋、油、咖啡、树浆不加）</td>
            </tr>
            <tr>
              <td>农耕人</td>
              <td>农业学家</td>
              <td>
                作物生长 +10%；<a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0&variant=zh-cn">生长激素</a>有农业学家共 20%；<a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E9%AB%98%E7%BA%A7%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0&variant=zh-cn">高级生长激素</a> 35%；<a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E9%A1%B6%E7%BA%A7%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0&variant=zh-cn">顶级生长激素</a> 43%；顶级对多次收获只缩短第一次
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        鸡舍大师管的是笼里的动物，牧羊人管的是畜棚里的动物，不要把牧羊人当成给鸡用的。对应动物被抚摸时，友谊是 +30，不是普通的 +15（<a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E5%8A%A8%E7%89%A9&variant=zh-cn">动物</a>）；用于算产品质量的分数再加 0.333。<a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E8%80%95%E7%A7%8D&variant=zh-cn">耕种</a>页按满友情、满心情列过铱星大约从 56.665% 到 73.315%，游戏里职业说明没写这段隐藏效果。
      </p>
      <p>技能格会点到油类等，但油实际加不上。</p>
      <p>有的旧攻略还在写畜牧人 +10%、工匠 +50%。现行是畜牧人 +20%、工匠 +40%。</p>

      <h3>蛋黄酱、奶酪、布料：两列是两种售价，不是叠乘</h3>
      <p>
        <a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E8%9B%8B%E9%BB%84%E9%85%B1&variant=zh-cn">蛋黄酱</a>、<a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E5%A5%B6%E9%85%AA&variant=zh-cn">奶酪</a>、<a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E5%B8%83%E6%96%99&variant=zh-cn">布料</a>信息框同时列出三列：基础售价、畜牧人（+20%）、工匠（+40%）。
      </p>
      <div
        aria-label="蛋黄酱、奶酪、布料售价"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">物品</th>
              <th scope="col">基础</th>
              <th scope="col">畜牧人 +20%</th>
              <th scope="col">工匠 +40%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>蛋黄酱（普通）</td>
              <td>190</td>
              <td>228</td>
              <td>266</td>
            </tr>
            <tr>
              <td>奶酪（普通）</td>
              <td>230</td>
              <td>276</td>
              <td>322</td>
            </tr>
            <tr>
              <td>布料</td>
              <td>470</td>
              <td>564</td>
              <td>658</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        同样来自维基物品页信息框。5 级只能选一项，同一存档不会既有畜牧人又有工匠。228 金是畜牧人这条路上普通蛋黄酱的价，266 金是工匠这条路上的价；不能把 20% 和 40% 乘在同一瓶上。山羊奶酪也是这三列，不必另记一套。
      </p>

      <h2>按你的出货选农耕人还是畜牧人</h2>
      <p>作物和蛋奶都卖的话，看哪一类更常进箱子，以及 10 级那两扇有没有你必须拿到的。</p>

      <h3>出货主要是作物和加工品</h3>
      <p>
        箱子里主要是作物、果酒、果酱、腌菜，以及蛋黄酱、奶酪这类加工品，选农耕人。10 级再在工匠和农业学家里选。
      </p>
      <p>
        加工为主，按工匠 +40% 估。<a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E6%9E%9C%E9%85%92&variant=zh-cn">果酒</a>基础价等于水果基础价乘 3，不跟原料星级走；<a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E6%9E%9C%E9%85%B1&variant=zh-cn">果酱或腌菜</a>是作物基础价乘 2 再加 50。生鲜水果才看农耕人那 10%；酒和酱按工匠列估。
      </p>
      <p>想作物长得快，10 级再看农业学家。5 级这一步仍是农耕人。</p>
      <p>示例：箱子里主要是果酒、果酱 → 5 级农耕人，10 级工匠或农业学家。</p>

      <h3>出货主要是生鲜畜产，或你要鸡舍大师/牧羊人</h3>
      <p>
        箱子里主要是生鲜蛋、奶，信息框只有畜牧人列，选畜牧人。10 级只剩鸡舍大师或牧羊人。
      </p>
      <p>
        你要孵化更快、笼里动物更好处，或畜棚动物更好处、绵羊更快出毛，也只能先选畜牧人。
      </p>
      <p>
        <a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E5%86%9C%E5%9C%BA&variant=zh-cn">草原农场</a>开局就有鸡舍和两只鸡，刘易斯给 15 干草。这是地图设定，5 级仍看出货，不必因为开局有鸡就选畜牧人。
      </p>
      <p>示例：主要卖生鲜牛奶、鸡蛋 → 5 级畜牧人，10 级鸡舍大师或牧羊人。</p>

      <h3>这些货会改判断</h3>
      <div
        aria-label="会改判断的货与售价加成"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">货</th>
              <th scope="col">售价加成</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>松露</td>
              <td>不加畜牧人</td>
            </tr>
            <tr>
              <td>松露油</td>
              <td>走工匠（1,065 / 1,491），无畜牧人列</td>
            </tr>
            <tr>
              <td>甜豌豆、番红花</td>
              <td>不加农耕人</td>
            </tr>
            <tr>
              <td>采集来源水果</td>
              <td>不加农耕人</td>
            </tr>
            <tr>
              <td>咖啡豆</td>
              <td>不加农耕人</td>
            </tr>
            <tr>
              <td>醋、油、咖啡</td>
              <td>不加工匠</td>
            </tr>
            <tr>
              <td>树浆</td>
              <td>不加工匠</td>
            </tr>
            <tr>
              <td>蜂蜜</td>
              <td>有工匠列、无畜牧人列</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E6%9D%BE%E9%9C%B2&variant=zh-cn">松露</a>是猪找出来的，但不算畜产品，畜牧人加不上。<a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E6%9D%BE%E9%9C%B2%E6%B2%B9&variant=zh-cn">松露油</a>走工匠：基础 1,065 金，工匠 1,491 金，没有畜牧人列。养猪若主要靠松露油出货，5 级应选农耕人，10 级才接得上工匠。
      </p>
      <p>
        <a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E8%8A%B1&variant=zh-cn">花</a>里写明，甜豌豆和番红花不加农耕人。<a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E6%B0%B4%E6%9E%9C&variant=zh-cn">水果</a>要分来源：地上自己长出来的、野生种子种出来的水果、农场山洞里的水果（含山洞果树）都不加；种子种出的水果、树上采的果（果树和棕榈）、邮件送来的、绿洲买的、灌木丛里的黑莓和美洲大树莓才加。<a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E5%92%96%E5%95%A1%E8%B1%86&variant=zh-cn">咖啡豆</a>不当标准农作物，农耕人加不上。<a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E8%94%AC%E8%8F%9C&variant=zh-cn">蔬菜</a>有农耕人则 +10%，蕨菜也算蔬菜。
      </p>
      <p>
        <a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E5%B7%A5%E5%8C%A0%E7%89%A9%E5%93%81&variant=zh-cn">工匠物品</a>页把醋、<a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E6%B2%B9&variant=zh-cn">油</a>、<a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E5%92%96%E5%95%A1&variant=zh-cn">咖啡</a>排除在 +40% 之外；枫糖浆、橡树树脂、松焦油、神秘糖浆这些树浆也不加。<a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E8%9C%82%E8%9C%9C&variant=zh-cn">蜂蜜</a>有工匠列、没有畜牧人列；野生蜂蜜基础 100 金，工匠 140 金。
      </p>
      <p>示例：养猪卖松露油 → 5 级农耕人，10 级工匠或农业学家。</p>

      <h2>选错了可以改；精通不是另一条耕种职业</h2>
      <p>
        <a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E4%B8%8B%E6%B0%B4%E9%81%93&variant=zh-cn">下水道</a>的不确定雕像捐 10,000 金，可以改已经选过职业的技能。菜单里只出现已经选过职业的那些系。当晚睡觉后先出 5 级职业屏，再出对应的 10 级职业屏。当天用雕像，第二天醒来精力是满的。
      </p>
      <p>
        <a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E6%8A%80%E8%83%BD&variant=zh-cn">技能</a>页写专精效果立即生效，并举渔夫：农场箱子里的鱼次日清晨售价提高 25%。下水道页另写：改职业当天放进出货箱的物品，售价加成不适用。改点当天不要把要靠售价加成出货的货放进箱子。1.3.27 加入雕像；1.4.1 起，选定要改之后原来的加成立即消失。
      </p>
      <div
        aria-label="不确定雕像与精通规则"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">项</th>
              <th scope="col">规则</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>花费</td>
              <td>10,000 金</td>
            </tr>
            <tr>
              <td>当晚</td>
              <td>先 5 级屏，再 10 级屏</td>
            </tr>
            <tr>
              <td>当天出货箱</td>
              <td>售价加成不适用</td>
            </tr>
            <tr>
              <td>精通</td>
              <td>不给另一条耕种职业</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        五系都到 10 级以后才能进<a href="https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E7%B2%BE%E9%80%9A%E5%B1%B1%E6%B4%9E&variant=zh-cn">精通山洞</a>。耕种经验只有 50% 转成精通点。耕种精通给铱镰刀、祝福雕像配方、金色动物饼干（对猪无效）。精通山洞列出的是这些奖励，没有再给一门耕种职业。不要靠精通去补 5 级没选的那一条。
      </p>
      <p>
        打开出货箱核一遍：这一季主要扔出去的是作物和加工品，还是生鲜蛋奶。前者选农耕人，10 级剩工匠和农业学家；后者选畜牧人，10 级剩鸡舍大师和牧羊人。再扫一眼有没有松露油、蜂蜜、甜豌豆、番红花、采集来的水果、咖啡豆、醋、油、咖啡或树浆——这些会改刚才那一选。已经点错过，就准备 10,000 金去雕像；改点当天放进箱子的货没有售价加成。
      </p>

      <h2>常见问题</h2>
      <BlogFaqList
        items={[
          {
            question: "5 级弹窗该选农耕人还是畜牧人？",
            answer: (
              <p>
                先看出货箱。作物、果酒、果酱走农耕人，10 级剩工匠或农业学家。生鲜蛋奶，或你要鸡舍大师、牧羊人，走畜牧人。不要用「20% 比 10% 大」当理由，两边乘的不是同一类货。
              </p>
            ),
          },
          {
            question: "选完 5 级，10 级还能改到另一条线吗？",
            answer: (
              <p>
                不能。畜牧人只接鸡舍大师或牧羊人；农耕人只接工匠或农业学家。不能 5 级畜牧人再接 10 级工匠。
              </p>
            ),
          },
          {
            question: "蛋黄酱能同时吃畜牧人和工匠吗？",
            answer: (
              <p>
                不能。普通蛋黄酱是畜牧人列 228 金，或工匠列 266 金，同一存档只有一列。奶酪、布料同样。
              </p>
            ),
          },
          {
            question: "松露加畜牧人吗？甜豌豆加农耕人吗？",
            answer: (
              <p>
                松露不加畜牧人；松露油走工匠。甜豌豆和番红花不加农耕人。采集来的水果、咖啡豆也不加农耕人。
              </p>
            ),
          },
          {
            question: "点错了怎么改？精通能补另一条吗？",
            answer: (
              <p>
                下水道不确定雕像捐 10,000 金，当晚先出 5 级屏再出 10 级屏。改点当天进出货箱的货没有售价加成。精通山洞给铱镰刀这类奖励，不给另一条耕种职业。
              </p>
            ),
          },
          {
            question: "规划器能替我选职业吗？",
            answer: (
              <p>
                不能。农耕人和畜牧人只在晚上睡觉后的弹窗里点，白天技能栏选不了。
              </p>
            ),
          },
        ]}
      />

      <BlogSources
        heading="来源"
        checkedLabel="2026-09-13 对照下方星露谷中文维基（条目版本含 1.6.15 相关页）。规划器只是摆放草图，不能替你选职业。"
        items={[
          {
            href: "https://zh.stardewvalleywiki.com/技能",
            label: "星露谷物语官方中文维基：技能",
            note: "（农耕人 / 畜牧人、10 级分支、头衔、改职业）",
          },
          {
            href: "https://zh.stardewvalleywiki.com/耕种",
            label: "星露谷物语官方中文维基：耕种",
            note: "（两列锁定、隐藏品质）",
          },
          {
            href: "https://zh.stardewvalleywiki.com/工匠物品",
            label: "星露谷物语官方中文维基：工匠物品",
            note: "（工匠 +40%；醋、油、咖啡、树浆例外）",
          },
          {
            href: "https://zh.stardewvalleywiki.com/蔬菜",
            label: "星露谷物语官方中文维基：蔬菜",
            note: "（农耕人 +10%）",
          },
          {
            href: "https://zh.stardewvalleywiki.com/水果",
            label: "星露谷物语官方中文维基：水果",
            note: "（非采集水果加农耕人）",
          },
          {
            href: "https://zh.stardewvalleywiki.com/花",
            label: "星露谷物语官方中文维基：花",
            note: "（甜豌豆、番红花不加农耕人）",
          },
          {
            href: "https://zh.stardewvalleywiki.com/咖啡豆",
            label: "星露谷物语官方中文维基：咖啡豆",
            note: "（不加农耕人）",
          },
          {
            href: "https://zh.stardewvalleywiki.com/松露",
            label: "星露谷物语官方中文维基：松露",
            note: "（不加畜牧人）",
          },
          {
            href: "https://zh.stardewvalleywiki.com/松露油",
            label: "星露谷物语官方中文维基：松露油",
            note: "（工匠列，无畜牧人列）",
          },
          {
            href: "https://zh.stardewvalleywiki.com/蛋",
            label: "星露谷物语官方中文维基：蛋",
          },
          {
            href: "https://zh.stardewvalleywiki.com/蛋黄酱",
            label: "星露谷物语官方中文维基：蛋黄酱",
            note: "（190→畜牧人 228 / 工匠 266）",
          },
          {
            href: "https://zh.stardewvalleywiki.com/牛奶",
            label: "星露谷物语官方中文维基：牛奶",
          },
          {
            href: "https://zh.stardewvalleywiki.com/奶酪",
            label: "星露谷物语官方中文维基：奶酪",
          },
          {
            href: "https://zh.stardewvalleywiki.com/布料",
            label: "星露谷物语官方中文维基：布料",
          },
          {
            href: "https://zh.stardewvalleywiki.com/蜂蜜",
            label: "星露谷物语官方中文维基：蜂蜜",
          },
          {
            href: "https://zh.stardewvalleywiki.com/果酒",
            label: "星露谷物语官方中文维基：果酒",
          },
          {
            href: "https://zh.stardewvalleywiki.com/果酱",
            label: "星露谷物语官方中文维基：果酱",
          },
          {
            href: "https://zh.stardewvalleywiki.com/油",
            label: "星露谷物语官方中文维基：油",
            note: "（不加工匠）",
          },
          {
            href: "https://zh.stardewvalleywiki.com/咖啡",
            label: "星露谷物语官方中文维基：咖啡",
            note: "（不加工匠）",
          },
          {
            href: "https://zh.stardewvalleywiki.com/生长激素",
            label: "星露谷物语官方中文维基：生长激素",
            note: "（有农业学家共 20%）",
          },
          {
            href: "https://zh.stardewvalleywiki.com/高级生长激素",
            label: "星露谷物语官方中文维基：高级生长激素",
            note: "（有农业学家共 35%）",
          },
          {
            href: "https://zh.stardewvalleywiki.com/顶级生长激素",
            label: "星露谷物语官方中文维基：顶级生长激素",
            note: "（有农业学家共 43%）",
          },
          {
            href: "https://zh.stardewvalleywiki.com/下水道",
            label: "星露谷物语官方中文维基：下水道",
            note: "（不确定雕像 10,000 金）",
          },
          {
            href: "https://zh.stardewvalleywiki.com/精通山洞",
            label: "星露谷物语官方中文维基：精通山洞",
            note: "（耕种精通不是第二职业）",
          },
          {
            href: "https://zh.stardewvalleywiki.com/农场",
            label: "星露谷物语官方中文维基：农场",
            note: "（草原农场开局鸡舍不是必须畜牧人）",
          },
        ]}
      />
    </article>
  );
}
