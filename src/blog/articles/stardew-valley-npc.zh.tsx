import { BlogFaqList } from "../../components/blog/blog-faq-list";
import { BlogSources } from "../../components/blog/blog-sources";

export function StardewValleyNpcChineseArticle() {
  return (
    <article>
      <p>
        查找《星露谷物语》NPC 时，先不要把所有角色塞进一张“村民名单”。更好用的分法是：可结婚角色、可以送礼但不能结婚的居民，以及没有普通送礼红心循环的 NPC。当前 Stardew Valley Wiki 的居民页列出 46 名角色，其中 12 名可结婚、22 名可送礼但不可结婚、12 名不可送礼。这个数字是名单口径，不代表所有角色会在同一时间出现在鹈鹕镇。
      </p>
      <p>
        这份名单真正的用途不是背名字，而是帮助你做判断：先看社交选项卡，再看角色行程，最后决定送礼、做任务、找商店，还是为农场服务预留位置。
      </p>

      <h2>星露谷 NPC 名单：先看三类</h2>
      <div
        aria-label="星露谷 NPC 分类"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">分类</th>
              <th scope="col">人数</th>
              <th scope="col">能否送普通礼物</th>
              <th scope="col">能否恋爱或结婚</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>可结婚角色</td>
              <td>12</td>
              <td>可以</td>
              <td>可以</td>
            </tr>
            <tr>
              <td>其他可送礼居民</td>
              <td>22</td>
              <td>可以</td>
              <td>不可以</td>
            </tr>
            <tr>
              <td>不可送礼 NPC</td>
              <td>12</td>
              <td>没有普通送礼循环</td>
              <td>不可以</td>
            </tr>
            <tr>
              <td>名单合计</td>
              <td>46</td>
              <td>混合</td>
              <td>混合</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        “NPC”是非玩家角色的统称，“居民”通常指在鹈鹕镇及周边地点生活、拥有日常行程的角色。两者在玩家口中经常混用，但查攻略时要看更具体的信号：角色是否出现在社交选项卡，是否显示红心，是否接受礼物，或者是否由捐赠、商店、任务和解锁条件控制。
      </p>

      <h2>12 名可结婚角色</h2>
      <p>原版结婚候选人由 6 名男性和 6 名女性组成：</p>
      <div
        aria-label="星露谷可结婚角色"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--compact">
          <thead>
            <tr>
              <th scope="col">男性候选人</th>
              <th scope="col">女性候选人</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Alex</td><td>Abigail</td></tr>
            <tr><td>Elliott</td><td>Emily</td></tr>
            <tr><td>Harvey</td><td>Haley</td></tr>
            <tr><td>Sam</td><td>Leah</td></tr>
            <tr><td>Sebastian</td><td>Maru</td></tr>
            <tr><td>Shane</td><td>Penny</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        这些角色都能通过聊天、送礼、任务和红心事件提升好感。可结婚角色在没有送花束前，最后两颗心会显示为灰色，普通好感上限停在 8 心。送出花束后才会开放恋爱阶段；达到 10 心还不等于立刻结婚，农舍升级和美人鱼吊坠仍是后续条件。
      </p>

      <h2>22 名可送礼但不可结婚的居民</h2>
      <p>以下角色可以使用普通好感度和送礼系统，但不属于原版结婚名单：</p>
      <ul className="blog-name-grid">
        <li>Caroline</li><li>Clint</li><li>Demetrius</li><li>Dwarf</li>
        <li>Evelyn</li><li>George</li><li>Gus</li><li>Jas</li>
        <li>Jodi</li><li>Kent</li><li>Krobus</li><li>Leo</li>
        <li>Lewis</li><li>Linus</li><li>Marnie</li><li>Pam</li>
        <li>Pierre</li><li>Robin</li><li>Sandy</li><li>Vincent</li>
        <li>Willy</li><li>Wizard</li>
      </ul>
      <p>
        “可送礼”不等于“玩法完全相同”。Leo 的主要活动范围和姜岛有关，Sandy 在沙漠工作，Dwarf 还涉及地点和语言解锁。Krobus 可以成为室友，却不是结婚候选人。查礼物时要打开具体角色页面，不要把这 22 人当成一条固定路线，也不要因为有红心就判断对方可以恋爱。
      </p>

      <h2>12 名不可送礼 NPC</h2>
      <p>居民页还列出以下没有普通送礼循环的 NPC：</p>
      <ul className="blog-name-grid">
        <li>Birdie</li><li>Bouncer</li><li>Fizz</li><li>Gil</li>
        <li>Governor</li><li>Grandpa</li><li>Gunther</li><li>Henchman</li>
        <li>Marlon</li><li>Morris</li><li>Mr. Qi</li><li>Professor Snail</li>
      </ul>
      <p>
        不可送礼只说明互动入口不同，不代表角色不重要。Gunther 主要和博物馆捐赠有关，Marlon 和冒险者公会、怪物目标有关，Gil 关联奖励，Mr. Qi 关联挑战系统。遇到没有普通红心条的角色时，停止寻找通用礼物，改查任务、捐赠、购买、战斗目标或地点解锁条件。
      </p>

      <h3>一次只解决一个 NPC 问题</h3>
      <p>
        NPC 查询之所以容易混乱，是因为“他是谁”“能不能送礼”“今天在哪里”“下一步怎么解锁”和“会不会影响农场”其实是五个问题。名单负责确认身份和分类，社交选项卡负责确认关系系统，角色行程负责回答今天的地点，礼物记录负责偏好和次数，任务或服务页面负责真正的推进条件。不要期待一张名单同时回答所有问题。
      </p>
      <ol>
        <li>先在居民名单中确认名字和类别。</li>
        <li>再看社交选项卡，确认是否有普通红心条。</li>
        <li>再看具体行程，核对时间、天气和目的地。</li>
        <li>送礼前查看礼物记录、每周次数和生日例外。</li>
        <li>需要改变存档时，改查对应服务或任务条件。</li>
      </ol>
      <p>
        这样可以避免用位置页面回答礼物问题，也不会用礼物表回答建筑问题。如果某天行程出现例外，只刷新当天分支，保留已经确认的角色分类和关系规则。名单适合整理笔记，行程和任务状态才需要经常重新确认。
      </p>

      <h2>好感度红心怎样计算</h2>
      <p>
        Friendship 页面把普通居民的好感显示为 10 心，配偶或室友则使用 14 心。每颗心对应 250 点好感，社交选项卡会显示当前进度。这个换算能帮助你判断一次聊天或一份礼物的价值，而不是只看物品价格。
      </p>
      <ul>
        <li>每天和居民聊天一次，通常增加 20 点。</li>
        <li>完成居民提出的物品递送任务，可增加 150 点。</li>
        <li>一周内给满两次普通礼物，下一周日早晨额外增加 10 点。</li>
        <li>讨厌或不喜欢的礼物、长期不打招呼和部分事件选择会扣分。</li>
        <li>相关居民达到 2 心后，通常可以进入其房间；解锁后不会因好感下降而重新锁上。</li>
      </ul>
      <p>
        因此，送礼计划不必追求昂贵。把聊天安排在原本就要经过的地点，用两次稳定礼物维持节奏，生日再使用更有价值的物品，通常比每天跨地图追逐所有人更可靠。看到恋爱对象的最后两颗心是灰色时，先想到 8 心上限，不要误以为行程表失效。
      </p>

      <h2>每周送礼、生日与礼物记录</h2>
      <p>
        对同一位居民，普通规则是每天最多一份礼物、每周最多两份。游戏里的送礼周从星期日开始，社交选项卡会用勾选状态提示本周已经送过几次。生日礼物即使在两份普通礼物用完后仍然可以送出，而且生日会把好感效果乘以 8。
      </p>
      <p>
        礼物记录会保存你已经送过的物品，也会记录通过秘密纸条、对话或亲友信息了解到的偏好。通用喜爱和通用喜欢可以作为起点，但不能替代具体偏好。资料明确列出两个容易被忽略的例外：Haley 讨厌五彩碎片，Penny 讨厌兔子的脚。送出稀有物品前，先点开收礼人的记录。
      </p>
      <p>
        电话也不能代替当天聊天。它可以帮助查询商店信息，却不会给对应居民增加当天的聊天收益。安排生日路线时，先查日期，再查角色行程，最后确认物品和每周送礼次数。
      </p>

      <h2>先看社交选项卡，再看地图</h2>
      <p>
        地图只能告诉你角色可能出现在哪些区域，社交选项卡则能告诉你正在使用哪一种关系系统。看到恋爱对象的灰色心格，说明要先送花束；看到普通红心条，说明可以按居民礼物和行程来安排；没有普通红心条，则应该寻找任务、商店、捐赠或进入条件。
      </p>
      <p>
        分类完成后再看具体行程。居民会根据时间、星期、天气、节日、事件和已解锁地点移动。住址不是全天位置，单张 NPC 地图也不会知道你当前存档的天气和活动状态。先判断类别、再查今天路线，能减少“名单没错但人不在”的误会。
      </p>

      <h2>把完整名单变成可执行路线</h2>
      <p>
        46 人名单是查询工具，不是每周任务清单。可以按照当前目标挑选少量对象：一名结婚候选人、一名提供服务的居民，再加一名与你日常购物、采矿、钓鱼或回家路线重合的村民。把常用礼物放在附近，生日礼物单独保管，不要让一张清单占满整个背包。
      </p>
      <ol>
        <li>打开社交选项卡，确认对方属于哪种关系类别。</li>
        <li>查看当天行程，确定能顺路见面的时间和地点。</li>
        <li>把聊天安排到已经存在的商店、矿井、海滩、森林或农场路线。</li>
        <li>用礼物记录排除讨厌物品，并确认本周剩余礼物次数。</li>
        <li>遇到雨天、节日或农活冲突时，优先保留有截止时间的任务，删掉可延期的送礼点。</li>
      </ol>
      <p>
        能在农场最忙的时候继续执行的路线，才是好路线。如果对象是不可送礼 NPC，就把送礼步骤替换成任务、捐赠或解锁检查。查清楚下一步是什么，比把所有角色都标成“待拜访”更有效。
      </p>

      <h2>服务型 NPC 会影响农场规划</h2>
      <div
        aria-label="星露谷 NPC 服务与农场规划"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">NPC</th>
              <th scope="col">主要影响</th>
              <th scope="col">去之前先决定</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Robin</td><td>农场建筑、农舍和建筑位置</td><td>预留完整占地、门口和通路。</td></tr>
            <tr><td>Marnie</td><td>动物和畜牧用品</td><td>先建好合适的鸡舍或畜棚。</td></tr>
            <tr><td>Pierre</td><td>种子和季节性农作物</td><td>先计算真正能照料的田地面积。</td></tr>
            <tr><td>Clint</td><td>工具升级和晶球处理</td><td>安排不会影响关键农活的升级日期。</td></tr>
            <tr><td>Willy</td><td>钓鱼装备和后续船只路线</td><td>把当前装备预算和后期目标放在一起看。</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        农场占地看<a href="/zh">规划器</a>；罗宾时间看<a href="/zh/where-is-robin-stardew-valley">行程</a>；建筑看<a href="/zh/carpenter-stardew">木匠</a>。
      </p>

      <h2>查 NPC 时最常见的误区</h2>
      <ul>
        <li>把孩子、怪物、农场动物或玩家角色计入居民名单。</li>
        <li>把 12 名结婚候选人误当成全部可送礼村民。</li>
        <li>看到普通红心条，就推断对方可以恋爱。</li>
        <li>把住址当成实时位置，而没有看时间、天气和活动。</li>
        <li>只看通用礼物标签，不检查个人偏好例外。</li>
        <li>对没有红心条的角色反复送礼，而没有找任务或捐赠入口。</li>
        <li>把模组角色和原版 46 人名单混在一起统计。</li>
      </ul>
      <p>
        如果搜索结果不对，先记录实际症状：头像没有出现、房间进不去、礼物被拒绝、柜台关闭，还是事件没有触发。症状能帮助你决定该查居民行程、Friendship 规则、具体礼物，还是任务进度。准确描述问题，比继续增加一张大名单更快。
      </p>

      <h2>星露谷 NPC 常见问题</h2>
      <BlogFaqList
        items={[
          {
            question: "《星露谷物语》有多少 NPC？",
            answer: (
              <p>
                当前居民名单按三类统计为 46 人：12 名可结婚角色、22 名可送礼但不可结婚的居民，以及 12 名不可送礼 NPC。这个口径不包括所有生物、怪物和名单之外的命名角色。
              </p>
            ),
          },
          {
            question: "星露谷有多少名可结婚角色？",
            answer: (
              <p>
                原版共有 12 名，分别是 Alex、Elliott、Harvey、Sam、Sebastian、Shane、Abigail、Emily、Haley、Leah、Maru 和 Penny。送花束、农舍升级和美人鱼吊坠属于后续结婚条件。
              </p>
            ),
          },
          {
            question: "所有 NPC 都能送礼吗？",
            answer: (
              <p>
                不能。46 人口径中有 34 名居民接受普通礼物，另外 12 名不可送礼 NPC 通过任务、捐赠、商店、挑战或剧情条件推进。
              </p>
            ),
          },
          {
            question: "一周可以给村民送几次礼物？",
            answer: (
              <p>
                通常每天最多一份、每周最多两份。生日礼物不受本周两份普通礼物限制，而且生日会提高好感效果。
              </p>
            ),
          },
          {
            question: "谁负责建造农场建筑？",
            answer: (
              <p>
                Robin 通过木匠商店处理普通农场建筑、农舍工作、移动和拆除。后期的魔法农场建筑则由 Wizard 的魔法书系统处理。
              </p>
            ),
          },
        ]}
      />

      <BlogSources
        heading="来源"
        items={[
          { href: "https://wiki.stardewvalley.net/Villagers", label: "星露谷 Wiki：Villagers" },
          { href: "https://wiki.stardewvalley.net/Friendship", label: "星露谷 Wiki：Friendship" },
          { href: "https://wiki.stardewvalley.net/Robin", label: "星露谷 Wiki：Robin" },
          { href: "https://wiki.stardewvalley.net/Carpenter%27s_Shop", label: "星露谷 Wiki：Carpenter Shop" },
          { href: "https://wiki.stardewvalley.net/Marnie%27s_Ranch", label: "星露谷 Wiki：Marnie's Ranch" },
          { href: "https://wiki.stardewvalley.net/Pierre%27s_General_Store", label: "星露谷 Wiki：Pierre's General Store" },
          { href: "https://wiki.stardewvalley.net/Blacksmith", label: "星露谷 Wiki：Blacksmith" },
          { href: "https://wiki.stardewvalley.net/Fish_Shop", label: "星露谷 Wiki：Fish Shop" },
        ]}
      />
    </article>
  );
}
