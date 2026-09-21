import { BlogFaqList } from "../../components/blog/blog-faq-list";
import { BlogSources } from "../../components/blog/blog-sources";
import { PublicPicture } from "../../components/public-picture";

export function LastDayToPlantStardewChineseArticle() {
  return (
    <article>
      <p>
        官方中文维基的<a href="https://zh.stardewvalleywiki.com/农作物">农作物</a>页和<a href="https://zh.stardewvalleywiki.com/作物生长日历">作物生长日历</a>，都没有名叫「最晚播种」的栏。<a href="https://zh.stardewvalleywiki.com/季节">季节</a>各 28 天；要在当季第 28 天收到这一次成熟，把维基写的生长天数从 28 里减掉，得到的日子就是最晚播种日——这是推算，生长天数不含播种当天。默认按室外当季、播种当天浇了水、没有生长激素也没有农业学家来算：防风草 4 天对应春 24，南瓜 13 天对应秋 15；漏浇一天，生长天数多 1，最晚播种日再提前一天。
      </p>

      <p>
        打开今天的日期，对下面的表看有没有过这一天。多次收获的作物，第一茬赶上第 28 天，和收满维基写的每季最多次，要用两个不同的下种日。
      </p>

      <h2>最晚播种日怎么从生长天数推出来</h2>

      <p>
        先确认手里的种子是室外当季作物，再读维基「共：N 天」，再用 28 减这个 N。得到的日期标成推算。维基自己不输出这个字段。
      </p>

      <h3>生长天数不含播种当天</h3>

      <p>
        <a href="https://zh.stardewvalleywiki.com/农作物">农作物「生长时间」</a>写：本页生长时间不包括种下种子的那一天。季节第一天种下的 5 天作物，第 6 天可收。可以把它理解成需要经过的过夜次数。收日 = 播种日 + 生长天数。令收日 = 28，播种日 = 28 − 生长天数。
      </p>

      <p>
        同一节还写：为了按表上的速度长，必须每天浇水；缺水一天停长，植株不会因此枯死。种在缺水的地上且当天不浇，当晚不长。表上的天数假定播种当天浇了水。午夜之后再种，仍算当天。肥料和农业学家在农作物这页的天数里没有算进去。
      </p>

      <p>
        <a href="https://zh.stardewvalleywiki.com/农作物">农作物「季节结束」</a>写：每个季节第 1 天，不在当季的作物消亡，留下枯株；枯株占着已耕地，用镰刀清。仍合法的多季节作物继续长。已经完全成熟、可以收获的作物，进入新季节也会枯死。所以「赶换季前这一次」指的是在第 28 天收到，不是留到下季第 1 天再摘。<a className="blog-planner-link" href="/zh/how-to-earn-money-stardew">怎么赚钱</a>里夏 1 室外春季作物枯掉，就是这条规则在田里的样子。花椰菜、甜瓜、南瓜、霜瓜、齐瓜可以长成巨大作物；巨大作物换季不枯，清田时把它和枯株分开。
      </p>

      <p>
        缺水一天，当晚不算生长，相当于生长天数多 1。还想在第 28 天收到，最晚播种日再提前一天。已经种下去以后漏浇，收日往后移，第 28 天可能空着。浇得到格子，和赶得上换季，是两件事；洒水器怎么选看<a className="blog-planner-link" href="/zh/sprinkler-stardew">星露谷洒水器</a>。
      </p>

      <h3>作物生长日历最后一茬，和赶第 28 天不是同一张表</h3>

      <p>
        <a href="https://zh.stardewvalleywiki.com/作物生长日历">作物生长日历</a>开头写：基本表格未考虑肥料或农业学家；除可重复收获外，表格假设收获当天重新播种并浇水。它回答的是：从第 1 天种起，收了再种，这一季能排几次。英文<a href="https://stardewvalleywiki.com/Crop_Growth_Calendars">Crop Growth Calendars</a>同一套假设。
      </p>

      <p>
        在这张基本表上，防风草成熟图落在春 5、9、13、17、21、25。最后一茬在 25，是因为 25 再种 4 天会落到第 29 天，超出本季。有人对着这张表把春 25 当成防风草最晚播种日。要在春 28 收到这一次，播种日 = 28 − 4 = 24。春 24 种、当天浇水，春 28 可收。春 25 种则收日落到下季第 1 天，而完全成熟的可收获作物进新季也会枯。
      </p>

      <p>
        两套假设不要合成一栏「维基最晚日」。日历最后一茬常落在 25、26、27，那是循环再种排到排不下的位置；赶本季第 28 天这一次，用 28 减生长天数。
      </p>

      <figure className="blog-article-media">
        <PublicPicture
          alt="两套春季 28 天对照：防风草从春 1 循环再种，成熟落在 5、9、13、17、21、25；要在春 28 收到这一次，最晚春 24 种（推算，不是维基字段）。循环再种这一行假设第 1 天种、收获当天再种、无生长激素。"
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/last-plant-parsnip-calendar-gap-zh.webp"
          width="1672"
        />
        <figcaption>
          两套春季 28 天对照：防风草从春 1 循环再种，成熟落在 5、9、13、17、21、25；要在春 28 收到这一次，最晚春 24 种（推算，不是维基字段）。循环再种这一行假设第 1 天种、收获当天再种、无生长激素。
        </figcaption>
      </figure>

      <h2>春夏秋冬：赶换季前这一次，最晚哪天种</h2>

      <p>
        下面按季节查表。生长天数抄<a href="https://zh.stardewvalleywiki.com/农作物">农作物</a>各作物节「共：N 天」。第一茬最晚日按 28 减该天数推算，条件与开头相同：室外当季、播种当天浇水、无生长激素、无农业学家。收满维基写的每季最多次，须在第 1 天下种；漏浇则整条时间线后移。1.6 加入的胡萝卜、金皮西葫芦、西蓝花、霜瓜都在对应季节里。
      </p>

      <p>
        种哪几种、货架和日均，春天看<a className="blog-planner-link" href="/zh/best-spring-crop-stardew">星露谷春天种什么</a>，夏天看<a className="blog-planner-link" href="/zh/summer-crops-stardew">星露谷夏天种什么</a>，秋天看<a className="blog-planner-link" href="/zh/fall-crops-stardew">星露谷秋季作物</a>。秋季那篇有一节最晚播种，是选型文的支撑表；本表按截止日期把四季（含冬天）放在一起查。
      </p>

      <h3>春季</h3>

      <p>
        草莓收满次数须春 1。蛋节春 13 再买草莓种子，是另一条时间线，次数和春 1 不同，预算和货架看春天那篇。未碾米 6–8 天，灌溉与不灌溉给出两个第一茬日期，不要读成一个最晚日。
      </p>

      <div
        aria-label="春季赶换季前这一次的最晚播种日"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">作物</th>
              <th scope="col">生长天数</th>
              <th scope="col">第一茬最晚日（推算）</th>
              <th scope="col">收满维基最大次数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>胡萝卜</td>
              <td>3</td>
              <td>春 25</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>防风草</td>
              <td>4</td>
              <td>春 24</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>蒜</td>
              <td>4</td>
              <td>春 24</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>土豆</td>
              <td>6</td>
              <td>春 22</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>甘蓝菜</td>
              <td>6</td>
              <td>春 22</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>郁金香</td>
              <td>6</td>
              <td>春 22</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>未碾米</td>
              <td>6–8（灌溉 / 不灌溉）</td>
              <td>灌溉春 22 / 不灌溉春 20</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>蓝爵</td>
              <td>7</td>
              <td>春 21</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>春季种子</td>
              <td>7</td>
              <td>春 21</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>草莓</td>
              <td>8，之后每 4 天</td>
              <td>春 20</td>
              <td>须春 1</td>
            </tr>
            <tr>
              <td>青豆</td>
              <td>10，之后每 3 天</td>
              <td>春 18</td>
              <td>须春 1</td>
            </tr>
            <tr>
              <td>咖啡豆</td>
              <td>10，之后每 2 天；春夏继续</td>
              <td>春 18</td>
              <td>须春 1</td>
            </tr>
            <tr>
              <td>花椰菜</td>
              <td>12</td>
              <td>春 16</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>大黄</td>
              <td>13</td>
              <td>春 15</td>
              <td>单次</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        春季种子成熟 7 天，来自<a href="https://zh.stardewvalleywiki.com/春季种子">春季种子</a> infobox；该页写它和夏季、秋季、冬季种子一样，都是只能在特定季节种下的野生种子。
      </p>

      <h3>夏季</h3>

      <p>
        蓝莓要收满 4 次，须夏 1；作物生长日历上夏 1 种下的蓝莓落在 14、18、22、26。金皮西葫芦首次按 6 天，最晚夏 22。芋头 7–10 天，灌溉更快，表里只保留范围。
      </p>

      <p>
        小麦、向日葵、玉米、咖啡豆跨季仍合法。28 减生长天数只保证<strong>本季第 28 天收到这一次</strong>。换季时它们还在合法季节里，不会在下季第 1 天变成枯株。小麦另有一条维基提示：夏季 25 日或之前种下，一直留到秋季 1 日再收，可以用镰刀在秋 1 清掉，地还是耕过、肥还在。那是留田做法，目标不是夏 28 收麦。赶夏 28 收这一次，小麦最晚夏 24；夏 25 留给秋 1 那一刀。两件事不要合成一个「小麦最晚日」。
      </p>

      <div
        aria-label="夏季赶换季前这一次的最晚播种日"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">作物</th>
              <th scope="col">生长天数</th>
              <th scope="col">第一茬最晚日（推算）</th>
              <th scope="col">收满维基最大次数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>小麦</td>
              <td>4；夏秋继续</td>
              <td>夏 24（赶夏 28 收）</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>辣椒</td>
              <td>5，之后每 3 天</td>
              <td>夏 23</td>
              <td>须夏 1</td>
            </tr>
            <tr>
              <td>萝卜</td>
              <td>6</td>
              <td>夏 22</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>金皮西葫芦</td>
              <td>6，之后每 3 天</td>
              <td>夏 22</td>
              <td>须夏 1</td>
            </tr>
            <tr>
              <td>芋头</td>
              <td>7–10（灌溉更快）</td>
              <td>按范围查</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>虞美人花</td>
              <td>7</td>
              <td>夏 21</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>向日葵</td>
              <td>8；夏秋继续</td>
              <td>夏 20</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>夏季亮片</td>
              <td>8</td>
              <td>夏 20</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>红叶卷心菜</td>
              <td>9</td>
              <td>夏 19</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>咖啡豆</td>
              <td>10，之后每 2 天；春夏继续</td>
              <td>夏 18</td>
              <td>须夏 1</td>
            </tr>
            <tr>
              <td>啤酒花</td>
              <td>11，之后每天</td>
              <td>夏 17</td>
              <td>须夏 1</td>
            </tr>
            <tr>
              <td>西红柿</td>
              <td>11，之后每 4 天</td>
              <td>夏 17</td>
              <td>须夏 1</td>
            </tr>
            <tr>
              <td>甜瓜</td>
              <td>12</td>
              <td>夏 16</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>杨桃</td>
              <td>13</td>
              <td>夏 15</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>蓝莓</td>
              <td>13，之后每 4 天</td>
              <td>夏 15</td>
              <td>须夏 1</td>
            </tr>
            <tr>
              <td>玉米</td>
              <td>14，之后每 4 天；夏秋继续</td>
              <td>夏 14</td>
              <td>须夏 1</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>秋季</h3>

      <p>
        蔓越莓<a href="https://zh.stardewvalleywiki.com/农作物">农作物</a>节写每季可收获五次。秋 1 种下，作物生长日历成熟图落在秋 8、13、18、23、28。只赶第一茬：7 天，最晚秋 21。秋 21 种下，收不满五次。宝石甜莓无生长激素时 24 天，最晚秋 4。日历从秋 1 种下的那一颗落在秋 25；秋 25 是季初那一茬的收日，和赶秋 28 的最晚播种日不是同一个格子。南瓜日历从秋 1 循环再种落在 14、27；赶秋 28 这一次，最晚秋 15。
      </p>

      <div
        aria-label="秋季赶换季前这一次的最晚播种日"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">作物</th>
              <th scope="col">生长天数</th>
              <th scope="col">第一茬最晚日（推算）</th>
              <th scope="col">收满维基最大次数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>小麦</td>
              <td>4</td>
              <td>秋 24</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>小白菜</td>
              <td>4</td>
              <td>秋 24</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>茄子</td>
              <td>5，之后每 5 天</td>
              <td>秋 23</td>
              <td>须秋 1</td>
            </tr>
            <tr>
              <td>甜菜</td>
              <td>6</td>
              <td>秋 22</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>苋菜</td>
              <td>7</td>
              <td>秋 21</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>蔓越莓</td>
              <td>7，之后每 5 天</td>
              <td>秋 21</td>
              <td>须秋 1（8 / 13 / 18 / 23 / 28）</td>
            </tr>
            <tr>
              <td>洋蓟</td>
              <td>8</td>
              <td>秋 20</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>西蓝花</td>
              <td>8，之后每 4 天</td>
              <td>秋 20</td>
              <td>须秋 1</td>
            </tr>
            <tr>
              <td>向日葵</td>
              <td>8</td>
              <td>秋 20</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>山药</td>
              <td>10</td>
              <td>秋 18</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>葡萄</td>
              <td>10，之后每 3 天</td>
              <td>秋 18</td>
              <td>须秋 1</td>
            </tr>
            <tr>
              <td>玫瑰仙子</td>
              <td>12</td>
              <td>秋 16</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>南瓜</td>
              <td>13</td>
              <td>秋 15</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>玉米</td>
              <td>14，之后每 4 天</td>
              <td>秋 14</td>
              <td>须秋 1</td>
            </tr>
            <tr>
              <td>宝石甜莓</td>
              <td>24</td>
              <td>秋 4</td>
              <td>单次</td>
            </tr>
          </tbody>
        </table>
      </div>

      <figure className="blog-article-media">
        <PublicPicture
          alt="蔓越莓秋 1 种才可能在 8、13、18、23、28 收满五次；只赶第一茬则最晚秋 21（推算，不是维基字段）。秋 21 种下收不满五次。"
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/last-plant-cranberry-first-vs-full-zh.webp"
          width="1672"
        />
        <figcaption>
          蔓越莓秋 1 种才可能在 8、13、18、23、28 收满五次；只赶第一茬则最晚秋 21（推算，不是维基字段）。秋 21 种下收不满五次。
        </figcaption>
      </figure>

      <p>
        上古水果共 28 天，无激素时某季第 1 天种下，首次收获在下一季第 1 天，见下一节。
      </p>

      <h3>冬季</h3>

      <p>
        1.6 起，室外冬天至少能种霜瓜。霜瓜共 7 天，赶冬 28 这一次，最晚冬 21。作物生长日历从冬 1 循环再种，霜瓜落在 8、15、22；22 是循环表最后一茬，赶冬 28 这一次仍是 21。
      </p>

      <p>
        冬季种子按 7 天推算，最晚冬 21。7 天按<a href="https://zh.stardewvalleywiki.com/春季种子">春季种子</a> infobox 类推；该页写夏季、秋季、冬季种子同为特定季节野生种子。最晚冬 21 是推算。
      </p>

      <p>
        纤维共 7 天，一年四季都能种，不需要浇水。按同一式子，最晚当季 21。
      </p>

      <div
        aria-label="冬季赶换季前这一次的最晚播种日"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">作物</th>
              <th scope="col">生长天数</th>
              <th scope="col">第一茬最晚日（推算）</th>
              <th scope="col">收满维基最大次数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>霜瓜</td>
              <td>7</td>
              <td>冬 21</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>冬季种子</td>
              <td>7（见上局限）</td>
              <td>冬 21</td>
              <td>单次</td>
            </tr>
            <tr>
              <td>纤维</td>
              <td>7；四季、不用浇水</td>
              <td>当季 21</td>
              <td>单次</td>
            </tr>
          </tbody>
        </table>
      </div>

      <figure className="blog-article-media">
        <PublicPicture
          alt="春夏秋冬最晚播种日历（推算，不是维基字段）：花椰菜和甜瓜在 16，南瓜秋 15，宝石甜莓秋 4，霜瓜冬 21。格子表示赶当季第 28 天收到这一次。无日均、无货架。"
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/last-plant-four-season-calendar-zh.webp"
          width="1672"
        />
        <figcaption>
          春夏秋冬最晚播种日历（推算，不是维基字段）：花椰菜和甜瓜在 16，南瓜秋 15，宝石甜莓秋 4，霜瓜冬 21。格子表示赶当季第 28 天收到这一次。无日均、无货架。
        </figcaption>
      </figure>

      <h2>这些情况不要套成一个最晚日</h2>

      <p>
        有的格子不受换季截止日期约束，有的作物维基自己给出了互相打架的天数。下面这些不要代入 28 − N 出单日。
      </p>

      <p>
        温室里 10×12 耕地，一年中任何时间都可以种植、生长、收获，不受普通季节限制；可重复收获的作物换季不会直接枯死。<a href="https://zh.stardewvalleywiki.com/温室">温室</a>和本站<a className="blog-planner-link" href="/zh/glasshouse-stardew-valley">温室布局</a>都写了这条。<a href="https://zh.stardewvalleywiki.com/姜岛">姜岛</a>农场同样：当前季节不决定能种什么，一年四季都能长。室外这张表不套到这两处室内/岛上田。仙人掌果子本来就只能种在温室、室内花盆或姜岛，鹈鹕镇室外田下不去。
      </p>

      <p>
        茶叶在春、夏、秋的最后一周，从 22 日（周一）起每天收叶；种在室内时冬天也收。<a href="https://zh.stardewvalleywiki.com/农作物">农作物</a>茶叶行写「最多至并包括每个季节的21日 共：20 天」。<a href="https://zh.stardewvalleywiki.com/茶叶">茶叶</a>专页生长阶段写「最多至且包括每个季节的21日 共：21天」，成熟 infobox 写 20 天。同一站上 20 和 21 同时印着，失败的是「共：N 天」这一格，不能折成一个数再做 28 − N。茶苗种在第 1 天以后，能不能赶上当季 22–28 的采叶周，维基没有写出最晚种茶日，这里也不编一个。
      </p>

      <p>
        上古水果春夏秋能长，共 28 天，之后每 7 天。<a href="https://zh.stardewvalleywiki.com/作物生长日历">作物生长日历</a>写：不考虑肥料和农业学家时，若在某季第 1 天播种，首次收获在下一季第 1 天。生长激素和技能只缩短第一次收获。秋 1 室外种后，冬 1 是先收还是先枯，维基没写顺序，不要给这一天编结果。
      </p>

      <p>
        <a href="https://zh.stardewvalleywiki.com/生长激素">生长激素</a>加快 10%，有农业学家时共 20%。<a href="https://zh.stardewvalleywiki.com/高级生长激素">高级生长激素</a>加快 25%，叠加农业学家共 35%。<a href="https://zh.stardewvalleywiki.com/顶级生长激素">顶级生长激素</a>加快 33%，叠加农业学家共 43%。多次收获只缩短第一次，后续间隔不变。<a href="https://zh.stardewvalleywiki.com/耕种">耕种</a> 10 级农耕人分支可选农业学家：所有作物生长速度提高 10%。怎么点 5 级和 10 级，看<a className="blog-planner-link" href="/zh/rancher-or-tiller-stardew">农耕人还是畜牧人</a>。激素页只给 10% / 25% / 33%（叠加农业学家 20% / 35% / 43%）。日历页没有印出缩短后的「共：N 天」。除中文<a href="https://zh.stardewvalleywiki.com/稀有种子">稀有种子</a>「高级生长激素时最晚秋 10」外，不要给其他作物写激素后最晚日。英文 Rare Seed 没有秋 10 这句。
      </p>

      <p>
        <a href="https://zh.stardewvalleywiki.com/稀有种子">稀有种子</a>中文页写：使用高级生长激素时，玩家最晚可以在秋季第 10 天种下，并在冬季之前收获宝石甜莓。英文 <a href="https://stardewvalleywiki.com/Rare_Seed">Rare Seed</a> 没有这句，只写肥料或农业学家会减少天数。把 24 天、25% 和「秋 10」放在一起看，和中文专页相符；不要把同一乘法写成其他作物的总公式。
      </p>

      <p>
        果树苗 28 天成熟，幼苗任何季节都长，树肥对果树不起作用。那是果树规则，不是这张一年生作物表。室外果树怎么留格，看<a className="blog-planner-link" href="/zh/stardew-valley-trees">星露谷树木</a>。
      </p>

      <p>
        未碾米、芋头已经在表里写成范围。灌溉与否会改天数，没有第三个「折中日」。
      </p>

      <p>
        打开今天的日期，对表看第一茬最晚日；漏浇则把收日往后移，看还能否落在第 28 天。要收满次数，看是不是季初下的种。室外已经过了最晚日，又没有温室或姜岛这块田，这一季这种室外作物赶不及换季前这一次。
      </p>

      <h2>FAQ</h2>
      <BlogFaqList
        items={[
          {
            question: "维基有「最晚播种日」这一栏吗？防风草最晚是春 24 还是春 25？",
            answer: (
              <p>没有这一栏。赶春 28 收到这一次，防风草 4 天，最晚春 24，这是推算。春 25 是作物生长日历从第 1 天种、收获当天再种排到的最后一茬。</p>
            ),
          },
          {
            question: "蔓越莓最晚秋 21 种，还能收满五次吗？",
            answer: (
              <p>不能。秋 21 只赶上第一茬。要收满五次，须秋 1 种，收日 8、13、18、23、28。</p>
            ),
          },
          {
            question: "冬天室外还能种吗？",
            answer: (
              <p>能。霜瓜 7 天，赶冬 28 这一次最晚冬 21。冬季种子 7 天按<a href="https://zh.stardewvalleywiki.com/春季种子">春季种子</a> infobox 类推；该页写夏季、秋季、冬季种子同为特定季节野生种子；最晚冬 21 是推算。</p>
            ),
          },
          {
            question: "用了高级生长激素，宝石甜莓最晚哪天种？别的作物也能按同一个乘法算吗？",
            answer: (
              <p>中文稀有种子页写：高级生长激素时最晚秋 10 种，并在冬季之前收。英文 Rare Seed 页没有秋 10 这句。激素页只给 10% / 25% / 33%（叠加农业学家 20% / 35% / 43%）。日历页没有印出缩短后的「共：N 天」。除这一句外，不要给其他作物写激素后最晚日。</p>
            ),
          },
          {
            question: "温室里还要赶换季吗？",
            answer: (
              <p>温室里一年中任何时间可种，可重复收获的作物换季不枯。室外这张表不套进去。10×12 怎么排，看<a className="blog-planner-link" href="/zh/glasshouse-stardew-valley">温室布局</a>。</p>
            ),
          },
        ]}
      />

      <BlogSources
        heading="来源"
        checkedLabel="2026-09-21 对照下方星露谷中文维基（英文 Rare Seed、Crop Growth Calendars 仅作对照）。生长天数来自农作物各作物节。最晚播种日由 28 减生长天数推算，不是维基字段。作物生长日历是第 1 天种、收获当天再种的循环表。规划器可以摆作物、切四季，不算最晚播种日。"
        items={[
          {
            href: "https://zh.stardewvalleywiki.com/农作物",
            label: "星露谷物语官方中文维基：农作物",
          },
          {
            href: "https://zh.stardewvalleywiki.com/作物生长日历",
            label: "星露谷物语官方中文维基：作物生长日历",
          },
          {
            href: "https://stardewvalleywiki.com/Crop_Growth_Calendars",
            label: "Stardew Valley Wiki: Crop Growth Calendars",
          },
          {
            href: "https://zh.stardewvalleywiki.com/季节",
            label: "星露谷物语官方中文维基：季节",
          },
          {
            href: "https://zh.stardewvalleywiki.com/生长激素",
            label: "星露谷物语官方中文维基：生长激素",
          },
          {
            href: "https://zh.stardewvalleywiki.com/高级生长激素",
            label: "星露谷物语官方中文维基：高级生长激素",
          },
          {
            href: "https://zh.stardewvalleywiki.com/顶级生长激素",
            label: "星露谷物语官方中文维基：顶级生长激素",
          },
          {
            href: "https://zh.stardewvalleywiki.com/耕种",
            label: "星露谷物语官方中文维基：耕种",
          },
          {
            href: "https://zh.stardewvalleywiki.com/稀有种子",
            label: "星露谷物语官方中文维基：稀有种子",
          },
          {
            href: "https://stardewvalleywiki.com/Rare_Seed",
            label: "Stardew Valley Wiki: Rare Seed",
          },
          {
            href: "https://zh.stardewvalleywiki.com/春季种子",
            label: "星露谷物语官方中文维基：春季种子",
          },
          {
            href: "https://zh.stardewvalleywiki.com/茶叶",
            label: "星露谷物语官方中文维基：茶叶",
          },
          {
            href: "https://zh.stardewvalleywiki.com/温室",
            label: "星露谷物语官方中文维基：温室",
          },
          {
            href: "https://zh.stardewvalleywiki.com/姜岛",
            label: "星露谷物语官方中文维基：姜岛",
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
            href: "/zh/fall-crops-stardew",
            label: "本站：秋季作物",
          },
          {
            href: "/zh/glasshouse-stardew-valley",
            label: "本站：温室布局",
          },
        ]}
      />
    </article>
  );
}
