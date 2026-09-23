import { BlogSources } from "../../components/blog/blog-sources";
import { PublicPicture } from "../../components/public-picture";

function ProfitMarginPriceBoundaryFigure() {
  return (
    <figure className="blog-article-media">
      <PublicPicture
        alt="星露谷物语 Profit Margin 价格边界示意图，展示选定出售物品、Pierre 种子和指定 Joja 商品会随四档倍率变化，以及来源列举的不受影响商店商品、建筑、工具升级和任务金币奖励。"
        decoding="async"
        height={941}
        loading="lazy"
        src="/blog/illustrations/profit-margin-stardew-price-boundary.webp"
        width={1672}
      />
      <figcaption>
        这张示意图把会缩放的价格与明确固定的类别分开，并标出 Wheat 在普通档位为 25g、25% 档位为 6g，以及 Willy 的 Crab Pots 仍为 1,500g；它是价格边界图，不是某个平台的游戏截图。
      </figcaption>
    </figure>
  );
}

function ProfitMarginAdvancedOptionsFigure() {
  return (
    <figure className="blog-article-media">
      <PublicPicture
        alt="星露谷物语平台中立的 Profit Margin 流程示意：100% 从 `New Game` 进入 `Advanced Options`；非 100% 先从标题画面的“合作”/`Host New Farm` 进入多人创建流程，在 `Profit Margin` 中选择档位并创建多人存档。"
        decoding="async"
        height={941}
        loading="lazy"
        src="/blog/illustrations/profit-margin-stardew-advanced-options.webp"
        width={1672}
      />
      <figcaption>
        这是平台中立的两条路径示意：100% 为 <code>New Game</code> → <code>Advanced Options</code>；非 100% 为“合作”/<code>Host New Farm</code> → 多人角色创建 → <code>Profit Margin</code> → 创建多人存档。依据公开 Options、Multiplayer（Profit margins）与 Getting Started 页面整理，不是某个平台的实机截图，也不承诺所有平台按钮位置完全相同。
      </figcaption>
    </figure>
  );
}

function ProfitMarginSources() {
  return (
    <BlogSources
      checkedLabel="Checked 2026-09-22 against Stardew Valley Wiki: Options and Multiplayer. This review also checked the Chinese Options and Getting Started pages listed below."
      heading="Sources"
      items={[
        {
          href: "https://zh.stardewvalleywiki.com/选项",
          label: "Stardew Valley Wiki：选项",
          note: "：中文高级游戏设置、利润率档位与新游戏入口。",
        },
        {
          href: "https://stardewvalleywiki.com/Options",
          label: "Stardew Valley Wiki：Options",
          note: "：Profit Margin 的价格倍数、种子价格、整数截断与 1g 下限。",
        },
        {
          href: "https://stardewvalleywiki.com/Multiplayer#Profit_margins",
          label: "Stardew Valley Wiki：Multiplayer — Profit margins",
          note: "：多人再平衡、受影响范围与明确不受影响类别。",
        },
        {
          href: "https://stardewvalleywiki.com/Getting_Started",
          label: "Stardew Valley Wiki：Getting Started",
          note: "：角色创建界面的高级选项路径。",
        },
      ]}
    />
  );
}

export function ProfitMarginStardewChineseArticle() {
  return (
    <article>
      <h2>星露谷物语的 Profit Margin（利润率）到底改变什么？</h2>
      <p>在 Stardew Valley 里，<code>Profit Margin</code>（利润率）是新农场使用的价格倍率设置：普通/100%、75%、50%、25% 会调整来源明确列出的出售物品价格和种子价格。<a href="https://zh.stardewvalleywiki.com/选项">中文选项页</a>中的“利润率”不是现实会计里的净利润比例，也不会让每一项商店费用、建筑、工具升级和任务金币都按同一比例变化；<a href="https://stardewvalleywiki.com/Multiplayer#Profit_margins">Multiplayer 的 Profit margins 说明</a>列明了这些非全局边界。</p>
      <p>公开 Multiplayer 说明把 25%/50%/75% 选项放在新建多人存档流程中；想独自游玩非 100% 档位时，应先从标题界面的“合作”（<code>Host New Farm</code>）创建多人存档，再由房主单独游玩该存档。</p>
      <p>把它理解成“哪些价格会按档位缩放”，比理解成“整个农场经济统一打折”更准确。低档位会收紧受影响的出售收入，同时改变列出的种子和 Joja 商品价格；固定费用与奖励仍按各自边界判断。</p>
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
              <td>普通/Normal（100%）</td>
              <td>受影响价格按标准倍率计算</td>
              <td>以游戏默认经济作为参照，适合不想额外收紧出售收入的开局。</td>
            </tr>
            <tr>
              <td>75%</td>
              <td>受影响价格按四分之三计算</td>
              <td>受影响的卖价与列出的种子价格都会降低，但仍保留标准玩法的框架。</td>
            </tr>
            <tr>
              <td>50%</td>
              <td>受影响价格按一半计算</td>
              <td>需要更仔细地安排受影响收入与种子支出的关系，适合主动增加经济约束的存档。</td>
            </tr>
            <tr>
              <td>25%</td>
              <td>受影响价格按四分之一计算</td>
              <td>这是明显收紧经济的挑战取向；固定类别不会因此一起变成四分之一。</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>英文 <a href="https://stardewvalleywiki.com/Options">Options</a> 页把 Profit Margin 说明为物品售出价格和种子价格的倍数。计算后出现小数时，价格截断为整数且最低不低于 1g，所以显示价格不会保留小数。四档数值都表示价格倍率，但不代表每个商品都属于受影响范围。</p>
      <h3>75% 利润率是什么意思？</h3>
      <p>75%表示属于这套规则的价格按0.75倍计算，不是“你能保留75%的净利润”。受影响的出售物品和列出的种子会按此档位处理；建筑、升级或奖励不能用这个数字反推。</p>
      <h2>哪些价格会随利润率变化，哪些不会？</h2>
      <p>判断一个数字时，先看它属于下表哪一列，再看当前档位；<a href="https://stardewvalleywiki.com/Multiplayer#Profit_margins">Multiplayer 的 Profit margins 说明</a>给出这份影响范围清单；“大多数”和“指定商品”不能扩写成所有商店统一缩放。</p>
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
              <td>来源列举的多数出售物品，例如作物、采集物、矿物和烹饪食物；Pierre（皮埃尔）的种子；Joja（乔家）的 <code>Grass Starter</code>（用于长草的商品）、<code>Sugar</code>（糖）、<code>Wheat Flour</code>（小麦粉）和 <code>Rice</code>（大米）等指定商品。</td>
              <td>铁匠、鱼店、旅行货车商品、建筑、工具升级和任务金币奖励。</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3>会变化的范围：出售物品、种子和指定商品</h3>
      <p>这里的“出售物品”应按页面列出的范围理解，不要把每个能放进出货箱的对象都归入同一结论。<code>Wheat</code>（小麦）能直观看出取整规则：普通档位示例价格为25g，25%档位最终显示6g，而不是保留6.25g。低档位和整数截断都会影响显示值。</p>
      <p>种子要单独记住。降低档位不只改变卖出作物的收入，Pierre 的种子价格也在受影响范围内；页面点名的 Joja 商品会随档位缩放。其他购买项目仍要回到清单判断。</p>
      <h3>不会变化的范围：部分商店商品、建筑、工具升级和任务奖励</h3>
      <p>铁匠、鱼店、旅行货车里的商品、建筑、工具升级和任务金币奖励被列为不受影响的类别。Willy（威利）的 <code>Crab Pots</code>（蟹笼）是具体对照：页面示例显示它仍为1,500g。它与 Wheat 一起说明了固定费用和受影响出售物品的差异。</p>
      <h3>看到一个价格没有按预期变化时先检查什么？</h3>
      <p>若价格没有按预期变化，先对照上表。已列为不受影响的类别不缩放，并非设置失效；不在清单中的价格先标记为待核验，不用另一个商品替它下结论。</p>
      <ProfitMarginPriceBoundaryFigure />
      <h2>单人、多人和挑战存档怎么选利润率？</h2>
      <p>没有公开依据证明某个百分比对所有玩家都普遍最佳。先看玩家人数，再看期望节奏和对受影响出售收入变紧的接受度。低档位会降低列出的种子价格，但来源明确列出的固定类别和任务奖励不缩放；选择的是约束组合，不是单独的难度分数。</p>
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
              <td>人数、分工和期望节奏不同，不能把其中一个档位当成所有多人存档的统一答案。</td>
            </tr>
            <tr>
              <td>有意进行经济挑战</td>
              <td>25%</td>
              <td>受影响出售收入更紧，固定类别仍在，需要接受更紧的预算约束。</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3>单人新农场：以普通（100%）作为标准起点</h3>
      <p>如果你想先认识 Stardew Valley 的默认价格关系，普通/100%是清楚的基准。它不是“对每个人最好”的证明；想增加限制时，75%、50%或25%都可以，但理由应是期望节奏和约束，而不是未经验证的固定进度目标。</p>
      <h3>多人协作：根据人数和期望约束考虑降低档位</h3>
      <p>多人页面解释，降低 Profit Margin 可以抵消活跃玩家增加生产力带来的经济优势。<a href="https://stardewvalleywiki.com/Multiplayer#Profit_margins">Multiplayer 的相关说明</a>支持的是再平衡思路，不是“几个人必须选多少”的表格。具体档位仍取决于团队分工和期望节奏。讨论时先区分“想抵消共同生产力”与“想保持普通价格”：前者可以比较75%和50%，后者保留普通/100%更直接。不要由人数推导固定收益或完成时间。</p>
      <p>如果你还在安排前期现金顺序，可以阅读<a className="blog-planner-link" href="/zh/how-to-earn-money-stardew">第一年赚钱与预算指南</a>；那篇文章解决预算行动，本页只说明 Profit Margin 改变哪些价格前提。</p>
      <h3>挑战玩法：25% 利润率是有意收紧经济的选择</h3>
      <p>25%适合把“资金更紧”本身当成玩法目标的人。它不是默认值，也不能推出一定慢几倍、少赚固定金币或在某年完成目标；选择前应确认你愿意承受较低出售收入。</p>
      <h3>75% 利润率适合吗？</h3>
      <p>若普通档位太宽松、50%又过紧，可先考虑75%；比较时同时看受影响出售收入和种子支出，不要只盯卖价。这是档位间的取舍，不是由玩家人数决定的标准答案。</p>
      <h3>25% 利润率适合什么情况？</h3>
      <p>若考虑25%，创建前用上文的价格边界检查预算：受影响收入会收紧，已列出的固定类别不会同步下降。</p>
      <h2>新农场在哪里设置 Profit Margin？</h2>
      <p>公开资料给出的高层路径分两支：<strong>100%</strong> 可以从 <code>New Game</code> 进入角色创建界面的扳手/<code>Advanced Options</code> 并创建普通新农场；<strong>75%/50%/25%</strong> 应从标题画面的“合作”（<code>Host New Farm</code>）进入多人角色创建界面，打开扳手/<code>Advanced Options</code> → <code>Profit Margin</code>，选择档位并创建多人存档；房主随后可以单独游玩该存档。<a href="https://zh.stardewvalleywiki.com/选项">中文选项页</a>、<a href="https://stardewvalleywiki.com/Options">Options</a>、<a href="https://stardewvalleywiki.com/Multiplayer#Profit_margins">Multiplayer 的 Profit margins 说明</a>和 <a href="https://stardewvalleywiki.com/Getting_Started">Getting Started</a>共同支持这条平台中立路径。</p>
      <h3>从新游戏或合作创建进入高级游戏设置</h3>
      <ol>
        <li>要使用普通/100%，从标题画面选择 <code>New Game</code>（新建游戏），进入角色创建界面；这是普通单人新农场的起点。</li>
        <li>要使用 75%/50%/25%，从标题画面选择“合作”（<code>Host New Farm</code>），进入多人角色创建界面，再打开角色创建界面的扳手，进入 <code>Advanced Options</code>。</li>
        <li>在对应的 <code>Advanced Options</code> 中找到 <code>Profit Margin</code>：普通/100%可按 <code>New Game</code> 路径设置；非 100% 必须在多人创建流程中选择 75%/50%/25%。</li>
        <li>按所选分支创建农场；非 100% 要创建多人存档，房主随后可以单独游玩这个已创建的多人存档。</li>
      </ol>
      <p>这是一条根据公开 Wiki 整理的平台中立路径，不是逐平台截图实测。PC、主机和移动端的按钮位置、标签或版本行为不应被写成完全一致；如果界面文字不同，应以当前平台和版本说明为准。</p>
      <ProfitMarginAdvancedOptionsFigure />
      <h3>如果找不到利润率选项，如何安全处理？</h3>
      <p>先区分目标档位：普通/100%仍按 <code>New Game</code> 的高级设置路径操作；如果想单人使用非 100%，应返回标题画面的“合作”/<code>Host New Farm</code>，在多人创建流程的 <code>Profit Margin</code> 中选择档位并创建多人存档，再由房主单独游玩该存档。仍按当前平台、版本和公开设置说明检查扳手菜单；如果平台或版本细节未知，停在这条文档化路径上，不要猜测标签位置。</p>
      <h3>创建农场前的三项检查</h3>
      <ul>
        <li>你是否选对了单人或多人玩家人数和创建路径：100%走 <code>New Game</code>；75%/50%/25%先从“合作”/<code>Host New Farm</code>进入多人创建流程、创建多人存档，并理解多人生产力会影响你对约束的判断？</li>
        <li>你想要的是普通节奏、较紧的经济，还是主动挑战？这个目标是否真的对应你选择的档位？</li>
        <li>你是否分清会缩放的出售物品、Pierre 种子和指定 Joja 商品，以及不缩放的来源列举的商店商品、建筑、工具升级和任务金币奖励？</li>
      </ul>
      <p>三项都确认后，再按所选分支创建农场；非 100%应先通过“合作”/<code>Host New Farm</code>创建多人存档，房主随后可以单独游玩该存档。这不是现实商业百分比，而是一组影响部分价格、同时保留固定边界的游戏经济前提。</p>
      <ProfitMarginSources />
    </article>
  );
}
