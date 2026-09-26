import { BlogSources } from "../../components/blog/blog-sources";
import { PublicPicture } from "../../components/public-picture";

function GreenhouseChoiceFigure() {
  return (
    <figure className="blog-article-media">
      <PublicPicture
        alt="水彩三格温室插画：重复结果的作物和果篮、收获后准备重种的空土、未翻耕边缘上的果树。"
        decoding="async"
        height="941"
        loading="lazy"
        src="/blog/illustrations/what-to-grow-in-greenhouse-stardew-choice-zh.webp"
        width="1672"
      />
      <figcaption>
        把手头的种源填进第一列，再按首收等待、再生或结果间隔和页面原文产出来判断。
      </figcaption>
    </figure>
  );
}

function GreenhouseSources() {
  return (
    <BlogSources
      heading="来源"
      items={[
        { href: "https://stardewvalleywiki.com/Greenhouse", label: "温室 - Stardew Valley Wiki" },
        { href: "https://zh.stardewvalleywiki.com/%E4%B8%8A%E5%8F%A4%E6%B0%B4%E6%9E%9C", label: "上古水果" },
        { href: "https://zh.stardewvalleywiki.com/%E4%B8%8A%E5%8F%A4%E7%A7%8D%E5%AD%90", label: "上古种子" },
        { href: "https://zh.stardewvalleywiki.com/%E6%9D%A8%E6%A1%83", label: "杨桃" },
        { href: "https://zh.stardewvalleywiki.com/%E6%9D%A8%E6%A1%83%E7%A7%8D%E5%AD%90", label: "杨桃种子" },
        { href: "https://zh.stardewvalleywiki.com/%E5%AE%9D%E7%9F%B3%E7%94%9C%E8%8E%93", label: "宝石甜莓" },
        { href: "https://zh.stardewvalleywiki.com/%E7%A8%80%E6%9C%89%E7%A7%8D%E5%AD%90", label: "稀有种子" },
        { href: "https://zh.stardewvalleywiki.com/%E8%8F%A0%E8%90%9D", label: "菠萝" },
        { href: "https://zh.stardewvalleywiki.com/%E8%8F%A0%E8%90%9D%E7%A7%8D%E5%AD%90", label: "菠萝种子" },
        { href: "https://zh.stardewvalleywiki.com/%E5%95%A4%E9%85%92%E8%8A%B1", label: "啤酒花" },
        { href: "https://zh.stardewvalleywiki.com/%E5%95%A4%E9%85%92%E8%8A%B1%E7%A7%8D%E5%AD%90", label: "啤酒花种子" },
        { href: "https://zh.stardewvalleywiki.com/%E8%8D%89%E8%8E%93", label: "草莓" },
        { href: "https://zh.stardewvalleywiki.com/%E8%8D%89%E8%8E%93%E7%A7%8D%E5%AD%90", label: "草莓种子" },
        { href: "https://zh.stardewvalleywiki.com/%E8%93%9D%E8%8E%93", label: "蓝莓" },
        { href: "https://zh.stardewvalleywiki.com/%E8%93%9D%E8%8E%93%E7%A7%8D%E5%AD%90", label: "蓝莓种子" },
        { href: "https://zh.stardewvalleywiki.com/%E8%94%93%E8%B6%8A%E8%8E%93", label: "蔓越莓" },
        { href: "https://zh.stardewvalleywiki.com/%E8%94%93%E8%B6%8A%E8%8E%93%E7%A7%8D%E5%AD%90", label: "蔓越莓种子" },
        { href: "https://zh.stardewvalleywiki.com/%E4%BB%99%E4%BA%BA%E6%8E%8C%E6%9E%9C%E5%AD%90", label: "仙人掌果子" },
        { href: "https://zh.stardewvalleywiki.com/%E4%BB%99%E4%BA%BA%E6%8E%8C%E7%A7%8D%E5%AD%90", label: "仙人掌种子" },
        { href: "https://zh.stardewvalleywiki.com/%E5%92%96%E5%95%A1%E8%B1%86", label: "咖啡豆" },
        { href: "https://zh.stardewvalleywiki.com/%E8%8B%B9%E6%9E%9C", label: "苹果" },
        { href: "https://zh.stardewvalleywiki.com/%E8%8B%B9%E6%9E%9C%E6%A0%91%E8%8B%97", label: "苹果树苗" },
        { href: "https://zh.stardewvalleywiki.com/%E6%9D%8F%E5%AD%90", label: "杏子" },
        { href: "https://zh.stardewvalleywiki.com/%E6%9D%8F%E5%AD%90%E6%A0%91%E8%8B%97", label: "杏子树苗" },
        { href: "https://zh.stardewvalleywiki.com/%E6%A8%B1%E6%A1%83", label: "樱桃" },
        { href: "https://zh.stardewvalleywiki.com/%E6%A8%B1%E6%A1%83%E6%A0%91%E8%8B%97", label: "樱桃树苗" },
        { href: "https://zh.stardewvalleywiki.com/%E6%A9%99%E5%AD%90", label: "橙子" },
        { href: "https://zh.stardewvalleywiki.com/%E6%A9%99%E5%AD%90%E6%A0%91%E8%8B%97", label: "橙子树苗" },
        { href: "https://zh.stardewvalleywiki.com/%E6%A1%83%E5%AD%90", label: "桃子" },
        { href: "https://zh.stardewvalleywiki.com/%E6%A1%83%E5%AD%90%E6%A0%91%E8%8B%97", label: "桃子树苗" },
        { href: "https://zh.stardewvalleywiki.com/%E7%9F%B3%E6%A6%B4", label: "石榴" },
        { href: "https://zh.stardewvalleywiki.com/%E7%9F%B3%E6%A6%B4%E6%A0%91%E8%8B%97", label: "石榴树苗" },
        { href: "https://zh.stardewvalleywiki.com/%E9%A6%99%E8%95%89", label: "香蕉" },
        { href: "https://zh.stardewvalleywiki.com/%E9%A6%99%E8%95%89%E6%A0%91%E8%8B%97", label: "香蕉树苗" },
        { href: "https://zh.stardewvalleywiki.com/%E8%8A%92%E6%9E%9C", label: "芒果" },
        { href: "https://zh.stardewvalleywiki.com/%E8%8A%92%E6%9E%9C%E5%B9%BC%E8%8B%97", label: "芒果幼苗" },
      ]}
    />
  );
}

export function WhatToGrowInGreenhouseStardewChineseArticle() {
  return (
    <article>
      <p>
        温室能用后，种什么要看你的进度和手上的种源。先看手头拿得到的种子或树苗；<a href="https://stardewvalleywiki.com/Greenhouse">温室作物不受普通季节限制</a>，所以全年都能种，但下雨仍要浇水。下面按首收、再生和种源拆开候选，最后用选择表把决定落到当前存档。
      </p>

      <h2>先按目标分流：快收一次，还是长期反复收获</h2>

      <h3>需要较快看到第一批收获</h3>

      <p>
        如果你想尽快验证一块温室是否适合当前计划，先看首收天数，再决定是否要把这块地交给会持续再生的作物。杨桃的种子来源是绿洲和旅行货车，页面记录为<a href="https://zh.stardewvalleywiki.com/%E6%9D%A8%E6%A1%83">首收需 13 天</a>；它适合已经拿到种子、希望先等一轮再重新安排的玩家。页面没有给出再生天数，所以不要把杨桃当成自动持续收获的作物。
      </p>

      <p>
        草莓的首收更早，页面记录为<a href="https://zh.stardewvalleywiki.com/%E8%8D%89%E8%8E%93">8 天成熟、之后每 4 天收获 1 颗</a>，种源来自复活节以及沙漠节相关商店。它的判断重点不是单看首收，而是你是否已经有种子、并且愿意保留一块位置等待下一轮。若当前只有杨桃种子，杨桃就是一次收获候选；若手里有草莓种子，草莓更适合作为较早进入重复收获的选择。
      </p>

      <h3>准备长期维护一块温室</h3>

      <p>
        长期维护时，先把“第一次要等多久”和“之后多久收一次”拆开看。上古水果的记录是<a href="https://zh.stardewvalleywiki.com/%E4%B8%8A%E5%8F%A4%E6%B0%B4%E6%9E%9C">28 天首次成熟，之后每 7 天再生</a>，种子不在杂货店、Joja 超市或旅行货车出售；可以通过博物馆捐赠古代种子古物向冈瑟索取一包，也可以按打造配方制作，或用种子生产器获得。它适合愿意等待首收、并准备长期保留位置的玩家。
      </p>

      <p>
        菠萝记录为<a href="https://zh.stardewvalleywiki.com/%E8%8F%A0%E8%90%9D">14 天首次成熟，成熟后每隔 7 天收获 1 颗</a>，种子来源是姜岛商人。它的首收等待比上古水果短，但取得种源本身要求你已经能使用姜岛商人的交换渠道。啤酒花记录为<a href="https://zh.stardewvalleywiki.com/%E5%95%A4%E9%85%92%E8%8A%B1">11 天成熟、每 1 天再生</a>，种子可以从皮埃尔的杂货店、Joja 超市、旅行货车或夜市魔法商船取得；它适合愿意频繁回来收取的玩家，而不是只想种下后很久再处理的人。
      </p>

      <h3>只想保留一次收获后换种的弹性</h3>

      <p>
        宝石甜莓的页面记录为<a href="https://zh.stardewvalleywiki.com/%E5%AE%9D%E7%9F%B3%E7%94%9C%E8%8E%93">24 天成熟，未记录再生</a>，它依赖旅行货车出售的稀有种子。这里的选择逻辑是“种源难得但可以等一次”，而不是把一次收获的基础售价直接当作长期收益答案；页面也明确说明宝石甜莓不受 Tiller 影响，因此不要套用普通作物的 Tiller 售价。
      </p>

      <p>
        杨桃和宝石甜莓都更适合放进“首收后重新决定”的分支。你可以在收获后换成下一批一次收获作物，也可以把位置交给上古水果、菠萝或其他可重复收获作物；关键是先确认下一批种源已经在手里，而不是因为一个售价数字就预先承诺整块温室只种一种。
      </p>

      <h2>再按当前拿得到的种源筛掉不适合的候选</h2>

      <p>
        温室能全年使用，不代表每一种种子或树苗都能随时拿到。先按来源筛选，再比较首收与再生；如果来源不在当前存档可达范围内，就把它留在以后，而不是把它当成今天的实际方案。
      </p>

      <h3>商店、绿洲、旅行货车和夜市能直接取得的种源</h3>

      <div
        aria-label="商店、绿洲、旅行货车和夜市能直接取得的种源"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">你能查到的入口</th>
              <th scope="col">可优先核对的候选</th>
              <th scope="col">选择时先看什么</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>皮埃尔的杂货店</td><td>啤酒花、蓝莓、蔓越莓</td><td>你想要持续收获，还是要一次收获后换种</td></tr>
            <tr><td>Joja 超市</td><td>啤酒花、蔓越莓</td><td>你想要持续收获，还是要一次收获后换种</td></tr>
            <tr><td>绿洲</td><td>杨桃、仙人掌果子</td><td>是否愿意前往对应地点取得种子；仙人掌还要核对室内种植条件</td></tr>
            <tr><td>旅行货车</td><td>杨桃、稀有种子、啤酒花、蓝莓、蔓越莓以及多种作物或树苗</td><td>来源是偶尔出现还是当前已经拿到，不要把“页面列出”当成“存档已有”</td></tr>
            <tr><td>夜市魔法商船</td><td>啤酒花、蓝莓、蔓越莓</td><td>先核对对应作物的夜市日期，再决定是否等待</td></tr>
          </tbody>
        </table>
      </div>

      <p>
        杨桃种子页面列出绿洲与旅行货车来源；仙人掌果子记录的种源是绿洲的桑迪，且种子页把条件限定为室内、其他建筑物内的花盆或姜岛。只要你是在温室里种，仙人掌满足这个位置条件，但仍要先确认你拿到的是仙人掌种子，而不是把采集到的仙人掌果子误当成种源。<a href="https://zh.stardewvalleywiki.com/%E4%BB%99%E4%BA%BA%E6%8E%8C%E7%A7%8D%E5%AD%90">仙人掌种子条件</a>
      </p>

      <h3>博物馆奖励、种子生产器、节日或姜岛来源的候选</h3>

      <p>
        上古种子的来源记录与普通商店不同：博物馆捐赠古代种子古物后可以向冈瑟索取一包，打造配方和种子生产器也在记录的来源范围内。咖啡豆则来自灰尘精灵掉落或旅行货车；页面记录为<a href="https://zh.stardewvalleywiki.com/%E5%92%96%E5%95%A1%E8%B1%86">10 天成熟、每 2 天再生，每棵每 2 天得到 4 个咖啡豆</a>。如果你还没有这些来源，就先把它们标成以后可选，不要为了填满温室而改写取得条件。
      </p>

      <p>
        菠萝种子来自姜岛商人；香蕉树苗来自姜岛商人或沙漠节雷欧商铺；芒果树苗来自姜岛商人。它们都需要先有对应交换或活动渠道，温室的全年条件只能解决种下之后的季节限制，不能替代种源本身。
      </p>

      <p>
        还有一个容易混淆的边界：巨大作物无法在温室里形成，因此不要把甜瓜或南瓜在室外形成巨大作物的方案搬进温室。<a href="https://stardewvalleywiki.com/Greenhouse">温室规则中的巨大作物说明</a>
      </p>

      <h2>可重复收获作物怎么选：看再生间隔和每次产出</h2>

      <p>下面把这几列放在一起对照。不要只看其中一列就替整块温室下结论。</p>

      <div
        aria-label="可重复收获作物的再生间隔和每次产出"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">作物</th>
              <th scope="col">首次成熟与再生间隔</th>
              <th scope="col">页面原文产出</th>
              <th scope="col">取得线索</th>
              <th scope="col">适合的判断</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>上古水果</td><td><a href="https://zh.stardewvalleywiki.com/%E4%B8%8A%E5%8F%A4%E6%B0%B4%E6%9E%9C">28 天；每 7 天</a></td><td>—</td><td>博物馆奖励、打造配方或种子生产器</td><td>能等首收，并愿意长期保留位置</td></tr>
            <tr><td>菠萝</td><td><a href="https://zh.stardewvalleywiki.com/%E8%8F%A0%E8%90%9D">14 天；每 7 天</a></td><td><a href="https://zh.stardewvalleywiki.com/%E8%8F%A0%E8%90%9D">成熟后每隔 7 天收获 1 颗菠萝</a></td><td>姜岛商人</td><td>已有姜岛交换渠道，又想保留重复收获</td></tr>
            <tr><td>啤酒花</td><td><a href="https://zh.stardewvalleywiki.com/%E5%95%A4%E9%85%92%E8%8A%B1">11 天；每 1 天</a></td><td>—</td><td>杂货店、Joja 超市、旅行货车、夜市魔法商船</td><td>能接受频繁收取</td></tr>
            <tr><td>草莓</td><td><a href="https://zh.stardewvalleywiki.com/%E8%8D%89%E8%8E%93">8 天；每 4 天</a></td><td><a href="https://zh.stardewvalleywiki.com/%E8%8D%89%E8%8E%93">每株每 4 天 1 颗草莓</a></td><td>复活节、沙漠节相关商店</td><td>需要较早进入重复收获，并且已有种子</td></tr>
            <tr><td>蓝莓</td><td><a href="https://zh.stardewvalleywiki.com/%E8%93%9D%E8%8E%93">13 天；每 4 天</a></td><td><a href="https://zh.stardewvalleywiki.com/%E8%93%9D%E8%8E%93">每次 3 个蓝莓，2% 机会获得更多</a></td><td>杂货店、旅行货车、夜市魔法商船</td><td>更在意单次产出表达，而不是只看售价</td></tr>
            <tr><td>蔓越莓</td><td><a href="https://zh.stardewvalleywiki.com/%E8%94%93%E8%B6%8A%E8%8E%93">7 天；每 5 天</a></td><td><a href="https://zh.stardewvalleywiki.com/%E8%94%93%E8%B6%8A%E8%8E%93">每株每 5 天 2 个；10% 机会多收获 1 个或以上，平均增加 0.11 个</a></td><td>杂货店、Joja 超市、旅行货车、夜市魔法商船</td><td>想缩短首收等待，又能接受较长再生间隔</td></tr>
            <tr><td>仙人掌果子</td><td><a href="https://zh.stardewvalleywiki.com/%E4%BB%99%E4%BA%BA%E6%8E%8C%E6%9E%9C%E5%AD%90">12 天；每 3 天</a></td><td>—</td><td>绿洲的桑迪；种子受室内条件限制</td><td>已确认种子来源和种植位置</td></tr>
            <tr><td>咖啡豆</td><td><a href="https://zh.stardewvalleywiki.com/%E5%92%96%E5%95%A1%E8%B1%86">10 天；每 2 天</a></td><td><a href="https://zh.stardewvalleywiki.com/%E5%92%96%E5%95%A1%E8%B1%86">每棵每 2 天 4 个咖啡豆；中文页只写有很小的随机概率获得更多，未给百分比</a></td><td>灰尘精灵掉落、旅行货车</td><td>接受来源不稳定，并能按较短间隔收获</td></tr>
          </tbody>
        </table>
      </div>

      <p>
        表里的“—”表示这条作物记录没有给出可以直接填入的每次产出，不应由读者自行把别的作物数量套过来。蓝莓、蔓越莓和咖啡豆的页面原文对数量或概率的写法不同，所以只保留各自记录的表达；页面没有给出精确概率时，也不要补一个看起来整齐的百分比。
      </p>

      <p>
        选择时先问自己：你更在意第一次收获来得早，还是更在意成熟后多久回来一次？如果答案是“都重要”，再看每次产出的页面原文；如果答案是“我不想频繁回来”，就先排除需要高频收取的分支。这样比较的是实际维护节奏，不是把不同作物的基础售价、品质和加工结果混成一个排行榜。
      </p>

      <h2>果树要不要种、种哪种</h2>

      <h3>按当前能取得的树苗或交换来源筛选</h3>

      <p>
        苹果、杏子、樱桃、橙子、桃子和石榴的树苗记录都列出皮埃尔的杂货店与旅行货车；香蕉树苗的记录列出姜岛商人与沙漠节雷欧商铺；芒果树苗的记录列出姜岛商人。先按你实际能取得的树苗做选择，别因为果树能在温室里结果，就把尚未拿到的树苗当成现成方案。
      </p>

      <div
        aria-label="按来源选择果树树苗"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">树苗来源</th>
              <th scope="col">可选树种</th>
              <th scope="col">适合的决定</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>皮埃尔的杂货店或旅行货车</td><td><a href="https://zh.stardewvalleywiki.com/%E8%8B%B9%E6%9E%9C%E6%A0%91%E8%8B%97">苹果</a>、<a href="https://zh.stardewvalleywiki.com/%E6%9D%8F%E5%AD%90%E6%A0%91%E8%8B%97">杏子</a>、<a href="https://zh.stardewvalleywiki.com/%E6%A8%B1%E6%A1%83%E6%A0%91%E8%8B%97">樱桃</a>、<a href="https://zh.stardewvalleywiki.com/%E6%A9%99%E5%AD%90%E6%A0%91%E8%8B%97">橙子</a>、<a href="https://zh.stardewvalleywiki.com/%E6%A1%83%E5%AD%90%E6%A0%91%E8%8B%97">桃子</a>、<a href="https://zh.stardewvalleywiki.com/%E7%9F%B3%E6%A6%B4%E6%A0%91%E8%8B%97">石榴</a></td><td>已能购买或等旅行货车，想把种植位置换成长期结果来源</td></tr>
            <tr><td>姜岛商人或沙漠节雷欧商铺</td><td><a href="https://zh.stardewvalleywiki.com/%E9%A6%99%E8%95%89%E6%A0%91%E8%8B%97">香蕉</a></td><td>已有对应交换物或活动渠道，并且确实想种香蕉</td></tr>
            <tr><td>姜岛商人</td><td><a href="https://zh.stardewvalleywiki.com/%E8%8A%92%E6%9E%9C%E5%B9%BC%E8%8B%97">芒果</a></td><td>已有姜岛交换渠道，并且想种芒果</td></tr>
          </tbody>
        </table>
      </div>

      <h3>按成熟与结果间隔比较候选</h3>

      <p>
        候选树苗记录的首次成熟时间都是<a href="https://zh.stardewvalleywiki.com/%E8%8B%B9%E6%9E%9C%E6%A0%91%E8%8B%97">28 天，成熟后的结果间隔记录为 1 天</a>。执行时把树苗种在温室或姜岛：苹果、杏子、樱桃、橙子、桃子、石榴、香蕉和芒果在这个条件下都能全年结果，所以温室里成熟后不用等待室外的结果季，按 1 天间隔每天回来收取。对应的树种记录还写了室外的结果条件：苹果、杏子、樱桃、橙子、桃子和石榴在结果季<a href="https://zh.stardewvalleywiki.com/%E8%8B%B9%E6%9E%9C%E6%A0%91%E8%8B%97">每天结出 1 颗果实</a>；香蕉记录为<a href="https://zh.stardewvalleywiki.com/%E9%A6%99%E8%95%89%E6%A0%91%E8%8B%97">每天结出 1 个香蕉</a>；芒果记录为<a href="https://zh.stardewvalleywiki.com/%E8%8A%92%E6%9E%9C%E5%B9%BC%E8%8B%97">夏季每天结出 1 个芒果</a>。这些季节说明不改变温室或姜岛的全年条件。选择时只需要回答“我想不想种果树、当前能拿到哪种树苗”，不要把果树选择变成位置摆放问题。
      </p>

      <p>
        果树和重复收获作物的区别在于，前者首先受树苗取得条件影响，然后等它成熟，再按这种树怎么结果来收；后者则要在首收以后持续看再生间隔。若你还在比较两者，先把想长期保留的树苗来源确认下来，再决定是否牺牲这块位置的作物弹性。
      </p>

      <h2>用一张选择表做最后决定</h2>

      <p>
        把手头的种源填进第一列，再按首收等待、再生或结果间隔和页面原文产出来判断。表中的“我的选择理由”不是预设答案，而是让你把自己的存档条件写清楚：有种源、能等多久、愿意多频繁回来、是否需要果树。
      </p>

      <GreenhouseChoiceFigure />

      <div
        aria-label="温室种植选择表"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table">
          <thead>
            <tr>
              <th scope="col">当前种源</th>
              <th scope="col">首次成熟天数</th>
              <th scope="col">再生/结果间隔</th>
              <th scope="col">页面原文产出</th>
              <th scope="col">是否一次收获</th>
              <th scope="col">我的选择理由</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>杨桃种子</td><td><a href="https://zh.stardewvalleywiki.com/%E6%9D%A8%E6%A1%83">13 天</a></td><td>—</td><td>—</td><td>是</td><td>我有绿洲或旅行货车来源，想先收获一次再换种</td></tr>
            <tr><td>宝石甜莓的稀有种子</td><td><a href="https://zh.stardewvalleywiki.com/%E5%AE%9D%E7%9F%B3%E7%94%9C%E8%8E%93">24 天</a></td><td>—</td><td>—</td><td>是</td><td>我愿意等待一次收获，并保留下一轮调整空间</td></tr>
            <tr><td>上古种子</td><td><a href="https://zh.stardewvalleywiki.com/%E4%B8%8A%E5%8F%A4%E6%B0%B4%E6%9E%9C">28 天</a></td><td><a href="https://zh.stardewvalleywiki.com/%E4%B8%8A%E5%8F%A4%E6%B0%B4%E6%9E%9C">7 天</a></td><td>—</td><td>否</td><td>我能等首收，也愿意长期保留位置</td></tr>
            <tr><td>菠萝种子</td><td><a href="https://zh.stardewvalleywiki.com/%E8%8F%A0%E8%90%9D">14 天</a></td><td><a href="https://zh.stardewvalleywiki.com/%E8%8F%A0%E8%90%9D">7 天</a></td><td><a href="https://zh.stardewvalleywiki.com/%E8%8F%A0%E8%90%9D">每隔 7 天 1 颗菠萝</a></td><td>否</td><td>我已有姜岛商人来源，想保留重复收获</td></tr>
            <tr><td>草莓种子</td><td><a href="https://zh.stardewvalleywiki.com/%E8%8D%89%E8%8E%93">8 天</a></td><td><a href="https://zh.stardewvalleywiki.com/%E8%8D%89%E8%8E%93">4 天</a></td><td><a href="https://zh.stardewvalleywiki.com/%E8%8D%89%E8%8E%93">每株每 4 天 1 颗草莓</a></td><td>否</td><td>我想较早开始收取，并能接受持续回来</td></tr>
            <tr><td>果树树苗</td><td><a href="https://zh.stardewvalleywiki.com/%E8%8B%B9%E6%9E%9C%E6%A0%91%E8%8B%97">28 天</a></td><td><a href="https://zh.stardewvalleywiki.com/%E8%8B%B9%E6%9E%9C%E6%A0%91%E8%8B%97">1 天</a></td><td>按树种记录的结果条件</td><td>否</td><td>我已经拿到想种的树苗，并愿意长期保留果树</td></tr>
          </tbody>
        </table>
      </div>

      <p>
        最后检查四件事：现在到底有什么种源？我能等多久？我想多久收一次？我是否真的要果树？四个答案一致时，选择就不再是脱离进度的“最好作物”，而是当前温室能执行、也方便下一次调整的方案。
      </p>

      <GreenhouseSources />
    </article>
  );
}
