import { BlogSources } from "../../components/blog/blog-sources";
import { PublicPicture } from "../../components/public-picture";

function ProfitMarginPriceBoundaryFigure() {
  return (
    <figure className="blog-article-media">
      <PublicPicture
        alt="星露谷物语 Profit Margin 价格示意图：作物等出售物品、皮埃尔种子和乔家指定商品随档位调整；铁匠、鱼店、旅行货车商品、建筑、工具升级和任务金币奖励不变。"
        decoding="async"
        height={941}
        loading="lazy"
        src="/blog/illustrations/profit-margin-stardew-price-boundary.webp"
        width={1672}
      />
      <figcaption>
        小麦在普通档位卖 25g，25% 档位卖 6g；到威利店里买蟹笼仍需 1,500g。示意图对比了会随利润率调整的价格和保持不变的费用。
      </figcaption>
    </figure>
  );
}

function ProfitMarginAdvancedOptionsFigure() {
  return (
    <figure className="blog-article-media">
      <PublicPicture
        alt="星露谷物语利润率设置流程示意：100% 通过 New Game 和 Advanced Options 创建普通农场；75%/50%/25% 从“合作”中的 Host New Farm 进入多人创建流程，选择 Profit Margin 后创建多人存档。"
        decoding="async"
        height={941}
        loading="lazy"
        src="/blog/illustrations/profit-margin-stardew-advanced-options.webp"
        width={1672}
      />
      <figcaption>
        设置流程示意：普通/100% 为 <code>New Game</code> → <code>Advanced Options</code>；75%/50%/25% 为“合作” → <code>Host New Farm</code> → 多人角色创建 → <code>Profit Margin</code> → 创建多人存档。房主也可以独自游玩这个存档。
      </figcaption>
    </figure>
  );
}

function ProfitMarginSources() {
  return (
    <BlogSources
      checkedLabel="资料查阅于2026年9月22日。"
      heading="资料来源"
      items={[
        {
          href: "https://zh.stardewvalleywiki.com/选项",
          label: "星露谷物语维基：选项（中文）",
          note: "：高级游戏设置、利润率档位与新游戏入口。",
        },
        {
          href: "https://stardewvalleywiki.com/Options",
          label: "星露谷物语维基：选项（英文）",
          note: "：利润率的价格倍数、种子价格、整数截断与 1g 下限。",
        },
        {
          href: "https://stardewvalleywiki.com/Multiplayer#Profit_margins",
          label: "星露谷物语维基：多人模式的利润率",
          note: "：多人经济平衡、受影响的价格与保持不变的费用。",
        },
        {
          href: "https://stardewvalleywiki.com/Getting_Started",
          label: "星露谷物语维基：新手入门",
          note: "：角色创建界面的高级选项入口。",
        },
      ]}
    />
  );
}

export function ProfitMarginStardewChineseArticle() {
  return (
    <article>
      <h2>星露谷物语的 Profit Margin（利润率）到底改变什么？</h2>
      <p>在《星露谷物语》中，<code>Profit Margin</code>（利润率）是新农场的价格倍率设置：普通/100%、75%、50%、25% 会改变大多数物品的售价、皮埃尔的种子价格和乔家的部分商品价格。<a href="https://zh.stardewvalleywiki.com/选项">利润率设置</a>不是现实会计里的净利润比例，也不会让所有商店费用一起打折；在<a href="https://stardewvalleywiki.com/Multiplayer#Profit_margins">多人模式</a>中，建筑、工具升级和任务金币奖励等同样不会随着这个比例变化。</p>
      <p>想用 75%/50%/25% 开局，需要先从标题界面的“合作”进入 <code>Host New Farm</code>（创建由自己主持的新农场），创建多人存档。即使打算独自游玩，也可以先这样建好农场，再由房主单独进入。</p>
      <p>低利润率不等于整个农场的经济一起打折：卖作物收到的钱变少，部分种子和商品也更便宜，但盖建筑、升级工具等固定开支不会降低。选档位时，要同时看收入和这些开支。</p>
      <h2>100%、75%、50%、25% 分别代表什么？</h2>
      <div
        aria-label="Profit Margin 档位与价格倍率"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">档位</th>
              <th scope="col">倍率如何读</th>
              <th scope="col">选择时意味着什么</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>普通（100%）</td>
              <td>受影响价格按标准倍率计算</td>
              <td>以游戏默认经济作为参照，适合不想额外收紧出售收入的开局。</td>
            </tr>
            <tr>
              <td>75%</td>
              <td>受影响价格按四分之三计算</td>
              <td>作物等物品的售价和皮埃尔的种子价格都会降低，但仍保留标准玩法的框架。</td>
            </tr>
            <tr>
              <td>50%</td>
              <td>受影响价格按一半计算</td>
              <td>需要更仔细地安排出售收入与种子支出，适合想增加经济约束的存档。</td>
            </tr>
            <tr>
              <td>25%</td>
              <td>受影响价格按四分之一计算</td>
              <td>适合想挑战紧张预算的玩家；建筑、工具升级等固定费用不会一起变成四分之一。</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>按<a href="https://stardewvalleywiki.com/Options">利润率设置</a>计算价格后，若出现小数，会直接舍去小数部分，且价格最低为 1g。因此，游戏中的价格不会保留小数。四档数值都表示价格倍率，但并非每件商品都会随档位变化。</p>
      <h3>75% 利润率是什么意思？</h3>
      <p>75% 表示受影响的价格按 0.75 倍计算，不是“你能保留 75% 的净利润”。作物等物品的售价和皮埃尔的种子价格会按此档位调整；建筑、升级或奖励不能用这个数字反推。</p>
      <h2>哪些价格会随利润率变化，哪些不会？</h2>
      <p>先看价格属于哪一类，再套用档位。<a href="https://stardewvalleywiki.com/Multiplayer#Profit_margins">多人模式中的价格调整</a>涵盖大多数出售物品和部分商店商品，并非所有商店统一打折。</p>
      <div
        aria-label="受 Profit Margin 影响与不受影响的范围"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">受 Profit Margin 影响的范围</th>
              <th scope="col">不受 Profit Margin 影响的范围</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>多数出售物品，例如作物、采集物、矿物和烹饪食物；皮埃尔的种子；乔家的草籽、糖、小麦粉和大米等指定商品。</td>
              <td>铁匠、鱼店、旅行货车商品、建筑、工具升级和任务金币奖励。</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3>会变化的范围：出售物品、种子和指定商品</h3>
      <p>小麦能直观看出取整规则：普通档位卖 25g，25% 档位最终显示 6g，而不是保留 6.25g。计算这类物品的收入时，既要乘以档位倍率，也要舍去小数部分。</p>
      <p>买种子时也要留意档位。降低利润率不只改变卖出作物的收入，皮埃尔的种子和上表中的乔家商品也会更便宜。买别的商品前，仍要分清它是变价商品还是固定费用。</p>
      <h3>不会变化的范围：部分商店商品、建筑、工具升级和任务奖励</h3>
      <p>铁匠、鱼店、旅行货车里的商品、建筑、工具升级和任务金币奖励不受利润率影响。例如，到威利店里买蟹笼仍需 1,500g。低档位下，卖小麦的收入降低了，买蟹笼的开支却没有跟着减少。</p>
      <h3>看到一个价格没有按预期变化时先检查什么？</h3>
      <p>先对照上表：铁匠、鱼店等商店的固定价格不会缩放，并不代表设置失效。上表没有列出的商品，可以在游戏里确认实际价格，再安排预算，不要直接套用另一个商品的价格变化。</p>
      <ProfitMarginPriceBoundaryFigure />
      <h2>单人、多人和挑战存档怎么选利润率？</h2>
      <p>没有一个档位适合所有玩家。先看玩家人数，再看你想要的节奏，以及能否接受较低的出售收入。低档位下皮埃尔的种子会更便宜，但建筑、工具升级等固定费用和任务奖励不变，因此预算不能只看卖价。</p>
      <div
        aria-label="新农场 Profit Margin 选择"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">场景或目标</th>
              <th scope="col">可以先考虑的档位</th>
              <th scope="col">需要接受的取舍</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>单人新农场，想先熟悉标准经济</td>
              <td>普通/100%</td>
              <td>以默认价格作为预算参照，之后再决定是否主动增加限制。</td>
            </tr>
            <tr>
              <td>多人协作，想抵消更高的共同生产力</td>
              <td>75% 或 50%</td>
              <td>按团队人数、分工和期望节奏选择，没有所有多人存档都适用的统一档位。</td>
            </tr>
            <tr>
              <td>有意进行经济挑战</td>
              <td>25%</td>
              <td>出售收入更紧，建筑、工具升级等固定费用仍在，需要接受更紧的预算约束。</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3>单人新农场：以普通（100%）作为标准起点</h3>
      <p>如果你想先熟悉游戏的默认价格关系，可以从普通/100% 开始。想增加限制时，也可以考虑 75%、50% 或 25%；选哪个档位，取决于你喜欢的节奏和能接受的预算压力。</p>
      <h3>多人协作：根据人数和期望约束考虑降低档位</h3>
      <p>多人协作能提高共同生产力，降低利润率可以<a href="https://stardewvalleywiki.com/Multiplayer#Profit_margins">抵消这部分经济优势</a>。具体档位仍取决于团队分工和期望节奏：想收紧共同收入，可以比较 75% 和 50%；想保持普通价格，保留普通/100% 更直接。玩家人数并不对应固定的利润率，也不能单靠人数算出收益或完成目标的时间。</p>
      <p>如果你还在安排前期现金顺序，可以阅读<a className="blog-planner-link" href="/zh/how-to-earn-money-stardew">第一年赚钱与预算指南</a>；选好利润率后，再按自己的收入和固定开支安排种子、工具与建筑预算。</p>
      <h3>挑战玩法：25% 利润率是有意收紧经济的选择</h3>
      <p>25% 适合把“资金更紧”本身当成玩法目标的人。它不是默认值，也不能仅凭这个比例算出要多花多久、少赚多少金币或在哪一年完成目标；选择前应确认你愿意承受较低的出售收入。</p>
      <h3>75% 利润率适合吗？</h3>
      <p>若普通档位太宽松、50% 又过紧，可先考虑 75%；比较时同时看出售收入和种子支出，不要只盯卖价。这是档位间的取舍，不是由玩家人数决定的标准答案。</p>
      <h3>25% 利润率适合什么情况？</h3>
      <p>若考虑 25%，创建前先检查预算：作物等物品的出售收入会收紧，建筑、工具升级等固定费用不会同步下降。</p>
      <h2>新农场在哪里设置 Profit Margin？</h2>
      <p>新建农场时，先按目标档位选择入口：<strong>100%</strong> 可以从 <code>New Game</code>（新建游戏）进入角色创建界面，点击扳手打开 <code>Advanced Options</code>（高级游戏设置），再创建普通新农场；<strong>75%/50%/25%</strong> 则从标题画面的“合作”进入 <code>Host New Farm</code>，在多人角色创建界面打开高级游戏设置，找到 <code>Profit Margin</code>，选择档位并创建多人存档；房主随后可以单独游玩该存档。设置入口可对照<a href="https://zh.stardewvalleywiki.com/选项">中文选项说明</a>、<a href="https://stardewvalleywiki.com/Options">选项说明（英文）</a>、<a href="https://stardewvalleywiki.com/Multiplayer#Profit_margins">多人利润率说明</a>和<a href="https://stardewvalleywiki.com/Getting_Started">新手入门说明</a>。</p>
      <h3>从新游戏或合作创建进入高级游戏设置</h3>
      <ol>
        <li>要使用普通/100%，从标题画面选择 <code>New Game</code>，进入角色创建界面。</li>
        <li>要使用 75%/50%/25%，从标题画面的“合作”进入 <code>Host New Farm</code>，打开多人角色创建界面的扳手，进入 <code>Advanced Options</code>。</li>
        <li>在高级游戏设置中找到 <code>Profit Margin</code>：普通/100% 可以按新建游戏路径设置；75%/50%/25% 则要在多人创建流程中选择。</li>
        <li>按所选档位创建农场；非 100% 要创建多人存档，房主随后可以单独游玩这个已创建的多人存档。</li>
      </ol>
      <p>按钮位置和名称请以你正在玩的平台和版本为准。找不到对应入口时，先检查角色创建界面的扳手菜单，再对照当前平台的设置说明。</p>
      <ProfitMarginAdvancedOptionsFigure />
      <h3>如果找不到利润率选项，该怎么办？</h3>
      <p>先确认是否进入了正确的创建流程：普通/100% 按 <code>New Game</code> 的高级设置路径操作；想独自游玩 75%/50%/25%，则返回标题画面的“合作”，通过 <code>Host New Farm</code> 创建多人存档，并在创建时选择利润率，之后再由房主单独游玩。如果仍找不到扳手或利润率选项，对照当前平台和版本的设置说明寻找入口。</p>
      <h3>创建农场前的三项检查</h3>
      <ul>
        <li>创建入口选对了吗？100% 走 <code>New Game</code>；75%/50%/25% 先从“合作”进入 <code>Host New Farm</code>，创建多人存档，即使之后只打算独自游玩也是如此。</li>
        <li>你想要普通节奏、较紧的经济，还是主动挑战？如果有其他玩家一起生产，这个档位是否符合大家的分工和期望？</li>
        <li>预算是否区分了会变价的出售物品、皮埃尔种子和乔家指定商品，以及价格不变的商店商品、建筑、工具升级和任务金币奖励？</li>
      </ul>
      <p>确认这三点后，再按所选档位创建农场。选择非 100% 时，先通过“合作”中的 <code>Host New Farm</code> 创建多人存档；房主随后可以单独游玩该存档。</p>
      <ProfitMarginSources />
    </article>
  );
}
