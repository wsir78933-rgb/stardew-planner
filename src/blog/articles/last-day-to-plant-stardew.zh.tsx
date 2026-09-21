import { BlogFaqList } from "../../components/blog/blog-faq-list";
import { BlogSources } from "../../components/blog/blog-sources";
import { PublicPicture } from "../../components/public-picture";

export function LastDayToPlantStardewChineseArticle() {
  return (
    <article>
      <p>
        春天想在第 28 天收到防风草，最晚在第 24 天种下，当天浇水。种下去的那一天不算在生长天数里。<a href="https://zh.stardewvalleywiki.com/季节">季节</a>各 28 天；其他室外作物也一样：打开<a href="https://zh.stardewvalleywiki.com/农作物">农作物</a>页，用 28 减去上面写的生长天数，就是这一季最晚下种的日子。
      </p>

      <p>
        打开今天的日期，对表看有没有过这一天。默认按室外当季、播种当天浇了水、没有生长激素也没有农业学家来算。会多次收获的作物，第一茬赶上第 28 天，和收满这一季能收的最多次，要用两个不同的下种日。漏浇一天，生长天数多 1，最晚播种日再提前一天。
      </p>

      <h2>最晚播种日怎么从生长天数算出来</h2>

      <p>
        先确认手里的种子是室外当季作物，再读农作物页上的「共：N 天」，再用 28 减这个 N。得到的日子，就是要在第 28 天收到这一次时，最晚可以下种的那天。
      </p>

      <h3>生长天数不含播种当天</h3>

      <p>
        <a href="https://zh.stardewvalleywiki.com/农作物">农作物「生长时间」</a>写：本页生长时间不包括种下种子的那一天。季节第一天种下的 5 天作物，第 6 天可收。可以把它理解成需要经过的过夜次数。收日 = 播种日 + 生长天数。令收日 = 28，播种日 = 28 − 生长天数。
      </p>

      <p>
        同一节还写：为了按表上的速度长，必须每天浇水；缺水一天停长，植株不会因此枯死。种在缺水的地上且当天不浇，当晚不长。表上的天数假定播种当天浇了水。午夜之后再种，仍算当天。肥料和农业学家在农作物这页的天数里没有算进去。
      </p>

      <p>
        <a href="https://zh.stardewvalleywiki.com/农作物">农作物「季节结束」</a>写：每个季节第 1 天，不在当季的作物消亡，留下枯株；枯株占着已耕地，用镰刀清。仍合法的多季节作物继续长。已经完全成熟、可以收获的作物，进入新季节也会枯死。所以赶换季前这一次，指的是在第 28 天收到，不是留到下季第 1 天再摘。<a className="blog-planner-link" href="/zh/how-to-earn-money-stardew">怎么赚钱</a>里夏 1 室外春季作物枯掉，就是这条规则在田里的样子。花椰菜、甜瓜、南瓜、霜瓜、齐瓜可以长成巨大作物；巨大作物换季不枯，清田时把它和枯株分开。
      </p>

      <p>
        缺水一天，当晚不算生长，相当于生长天数多 1。还想在第 28 天收到，最晚播种日再提前一天。已经种下去以后漏浇，收日往后移，第 28 天可能空着。浇得到格子，和赶得上换季，是两件事；洒水器怎么选看<a className="blog-planner-link" href="/zh/sprinkler-stardew">星露谷洒水器</a>。
      </p>

      <h3>作物生长日历最后一茬，和赶第 28 天不是同一张表</h3>

      <p>
        <a href="https://zh.stardewvalleywiki.com/作物生长日历">作物生长日历</a>开头写：基本表格未考虑肥料或农业学家；除可重复收获外，表格假设收获当天重新播种并浇水。它回答的是：从第 1 天种起，收了再种，这一季能排几次。英文<a href="https://stardewvalleywiki.com/Crop_Growth_Calendars">Crop Growth Calendars</a>同一套假设。
      </p>

      <p>
        在这张基本表上，防风草成熟图落在春 5、9、13、17、21、25。最后一茬在 25，是因为 25 再种 4 天会落到第 29 天，超出本季。有人对着这张表把春 25 当成防风草最晚播种日。要在春天第 28 天收到这一次，播种日 = 28 − 4 = 24。春天第 24 天种、当天浇水，春天第 28 天可收。春天第 25 天种则收日落到下季第 1 天，而完全成熟的可收获作物进新季也会枯。
      </p>

      <p>
        日历上最后一茬常常落在 25、26、27，那是从第 1 天起收了再种、排到排不下的位置。要在本季第 28 天收到这一次，用 28 减去生长天数。
      </p>

      <figure className="blog-article-media">
        <PublicPicture
          alt="这张图对照两种春季种法。上面一行从春天第 1 天起收了再种防风草，成熟落在 5、9、13、17、21、25；下面一行要在春天第 28 天收到这一次，最晚在第 24 天种下。循环再种这一行按第 1 天种、收获当天再种、没有生长激素来画。"
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/last-plant-parsnip-calendar-gap-zh.webp"
          width="1672"
        />
        <figcaption>
          这张图对照两种春季种法。上面一行从春天第 1 天起收了再种防风草，成熟落在 5、9、13、17、21、25；下面一行要在春天第 28 天收到这一次，最晚在第 24 天种下。循环再种这一行按第 1 天种、收获当天再种、没有生长激素来画。
        </figcaption>
      </figure>

      <h2>春夏秋冬：赶换季前这一次，最晚哪天种</h2>

      <p>
        春夏秋冬可以按表查。生长天数抄<a href="https://zh.stardewvalleywiki.com/农作物">农作物</a>各作物节「共：N 天」。最晚播种日用 28 减该天数，条件与开头相同：室外当季、播种当天浇水、没有生长激素、没有农业学家。收满这一季能收的最多次，须在第 1 天下种；漏浇则整条时间线后移。1.6 加入的胡萝卜、金皮西葫芦、西蓝花、霜瓜都在对应季节里。
      </p>

      <p>
        种哪几种、货架和日均，春天看<a className="blog-planner-link" href="/zh/best-spring-crop-stardew">星露谷春天种什么</a>，夏天看<a className="blog-planner-link" href="/zh/summer-crops-stardew">星露谷夏天种什么</a>，秋天看<a className="blog-planner-link" href="/zh/fall-crops-stardew">星露谷秋季作物</a>。秋季那篇有一节最晚播种，是选型文的支撑表；本表按截止日期把四季（含冬天）放在一起查。
      </p>

      <h3>春季</h3>

      <p>
        草莓收满次数须春天第 1 天种。蛋节春天第 13 天再买草莓种子，是另一条时间线，次数和春天第 1 天不同，预算和货架看春天那篇。未碾米 6–8 天，灌溉与不灌溉给出两个第一茬日期，不要读成一个最晚日。
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
              <th scope="col">最晚播种日（第 28 天能收）</th>
              <th scope="col">说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>胡萝卜</td>
              <td>3</td>
              <td>春天第 25 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>防风草</td>
              <td>4</td>
              <td>春天第 24 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>蒜</td>
              <td>4</td>
              <td>春天第 24 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>土豆</td>
              <td>6</td>
              <td>春天第 22 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>甘蓝菜</td>
              <td>6</td>
              <td>春天第 22 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>郁金香</td>
              <td>6</td>
              <td>春天第 22 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>未碾米</td>
              <td>6–8（灌溉 / 不灌溉）</td>
              <td>灌溉：春天第 22 天 / 不灌溉：春天第 20 天</td>
              <td>灌溉和不灌溉各算一天</td>
            </tr>
            <tr>
              <td>蓝爵</td>
              <td>7</td>
              <td>春天第 21 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>春季种子</td>
              <td>7</td>
              <td>春天第 21 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>草莓</td>
              <td>8，之后每 4 天</td>
              <td>春天第 20 天</td>
              <td>要收满次数，须春天第 1 天种</td>
            </tr>
            <tr>
              <td>青豆</td>
              <td>10，之后每 3 天</td>
              <td>春天第 18 天</td>
              <td>要收满次数，须春天第 1 天种</td>
            </tr>
            <tr>
              <td>咖啡豆</td>
              <td>10，之后每 2 天；春夏继续</td>
              <td>春天第 18 天</td>
              <td>要收满次数，须春天第 1 天种</td>
            </tr>
            <tr>
              <td>花椰菜</td>
              <td>12</td>
              <td>春天第 16 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>大黄</td>
              <td>13</td>
              <td>春天第 15 天</td>
              <td>只收一次</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        春季种子成熟要 7 天，见<a href="https://zh.stardewvalleywiki.com/春季种子">春季种子</a>页；该页写它和夏季、秋季、冬季种子一样，都是只能在特定季节种下的野生种子。
      </p>

      <h3>夏季</h3>

      <p>
        蓝莓要收满 4 次，须夏天第 1 天种；作物生长日历上夏 1 种下的蓝莓落在 14、18、22、26。金皮西葫芦首次按 6 天，最晚在夏天第 22 天种下。芋头 7–10 天，灌溉更快，表里只保留范围。
      </p>

      <p>
        小麦、向日葵、玉米、咖啡豆跨季仍合法。28 减生长天数只保证<strong>本季第 28 天收到这一次</strong>。换季时它们还在合法季节里，不会在下季第 1 天变成枯株。小麦另有一条维基提示：夏季 25 日或之前种下，一直留到秋季 1 日再收，可以用镰刀在秋 1 清掉，地还是耕过、肥还在。那是留田做法，目标不是夏天第 28 天收麦。赶夏天第 28 天收这一次，小麦最晚在夏天第 24 天种；夏天第 25 天种是留给秋天第 1 天那一刀。这两件事日期不同。
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
              <th scope="col">最晚播种日（第 28 天能收）</th>
              <th scope="col">说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>小麦</td>
              <td>4；夏秋继续</td>
              <td>夏天第 24 天（赶夏天第 28 天收）</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>辣椒</td>
              <td>5，之后每 3 天</td>
              <td>夏天第 23 天</td>
              <td>要收满次数，须夏天第 1 天种</td>
            </tr>
            <tr>
              <td>萝卜</td>
              <td>6</td>
              <td>夏天第 22 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>金皮西葫芦</td>
              <td>6，之后每 3 天</td>
              <td>夏天第 22 天</td>
              <td>要收满次数，须夏天第 1 天种</td>
            </tr>
            <tr>
              <td>芋头</td>
              <td>7–10（灌溉更快）</td>
              <td>按 7–10 天的范围查</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>虞美人花</td>
              <td>7</td>
              <td>夏天第 21 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>向日葵</td>
              <td>8；夏秋继续</td>
              <td>夏天第 20 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>夏季亮片</td>
              <td>8</td>
              <td>夏天第 20 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>红叶卷心菜</td>
              <td>9</td>
              <td>夏天第 19 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>咖啡豆</td>
              <td>10，之后每 2 天；春夏继续</td>
              <td>夏天第 18 天</td>
              <td>要收满次数，须夏天第 1 天种</td>
            </tr>
            <tr>
              <td>啤酒花</td>
              <td>11，之后每天</td>
              <td>夏天第 17 天</td>
              <td>要收满次数，须夏天第 1 天种</td>
            </tr>
            <tr>
              <td>西红柿</td>
              <td>11，之后每 4 天</td>
              <td>夏天第 17 天</td>
              <td>要收满次数，须夏天第 1 天种</td>
            </tr>
            <tr>
              <td>甜瓜</td>
              <td>12</td>
              <td>夏天第 16 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>杨桃</td>
              <td>13</td>
              <td>夏天第 15 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>蓝莓</td>
              <td>13，之后每 4 天</td>
              <td>夏天第 15 天</td>
              <td>要收满次数，须夏天第 1 天种</td>
            </tr>
            <tr>
              <td>玉米</td>
              <td>14，之后每 4 天；夏秋继续</td>
              <td>夏天第 14 天</td>
              <td>要收满次数，须夏天第 1 天种</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>秋季</h3>

      <p>
        蔓越莓<a href="https://zh.stardewvalleywiki.com/农作物">农作物</a>节写每季可收获五次。秋天第 1 天种下，作物生长日历成熟图落在秋天第 8、13、18、23、28 天。只赶第一茬：7 天，最晚在秋天第 21 天种下。秋天第 21 天种下，收不满五次。宝石甜莓没有生长激素时 24 天，最晚在秋天第 4 天种下。日历从秋天第 1 天种下的那一颗落在秋天第 25 天；第 25 天是季初那一茬的收日，和赶秋天第 28 天的最晚播种日不是同一个格子。南瓜日历从秋天第 1 天循环再种落在 14、27；赶秋天第 28 天这一次，最晚在秋天第 15 天种下。
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
              <th scope="col">最晚播种日（第 28 天能收）</th>
              <th scope="col">说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>小麦</td>
              <td>4</td>
              <td>秋天第 24 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>小白菜</td>
              <td>4</td>
              <td>秋天第 24 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>茄子</td>
              <td>5，之后每 5 天</td>
              <td>秋天第 23 天</td>
              <td>要收满次数，须秋天第 1 天种</td>
            </tr>
            <tr>
              <td>甜菜</td>
              <td>6</td>
              <td>秋天第 22 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>苋菜</td>
              <td>7</td>
              <td>秋天第 21 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>蔓越莓</td>
              <td>7，之后每 5 天</td>
              <td>秋天第 21 天</td>
              <td>要收满五次，须秋天第 1 天种（收日 8、13、18、23、28）</td>
            </tr>
            <tr>
              <td>洋蓟</td>
              <td>8</td>
              <td>秋天第 20 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>西蓝花</td>
              <td>8，之后每 4 天</td>
              <td>秋天第 20 天</td>
              <td>要收满次数，须秋天第 1 天种</td>
            </tr>
            <tr>
              <td>向日葵</td>
              <td>8</td>
              <td>秋天第 20 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>山药</td>
              <td>10</td>
              <td>秋天第 18 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>葡萄</td>
              <td>10，之后每 3 天</td>
              <td>秋天第 18 天</td>
              <td>要收满次数，须秋天第 1 天种</td>
            </tr>
            <tr>
              <td>玫瑰仙子</td>
              <td>12</td>
              <td>秋天第 16 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>南瓜</td>
              <td>13</td>
              <td>秋天第 15 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>玉米</td>
              <td>14，之后每 4 天</td>
              <td>秋天第 14 天</td>
              <td>要收满次数，须秋天第 1 天种</td>
            </tr>
            <tr>
              <td>宝石甜莓</td>
              <td>24</td>
              <td>秋天第 4 天</td>
              <td>只收一次</td>
            </tr>
          </tbody>
        </table>
      </div>

      <figure className="blog-article-media">
        <PublicPicture
          alt="这张图画了蔓越莓的两条时间线：秋天第 1 天种下，才能在 8、13、18、23、28 收满五次；只赶第一茬、要在秋天第 28 天收到，最晚在秋天第 21 天种下。第 21 天再种就收不满五次。"
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/last-plant-cranberry-first-vs-full-zh.webp"
          width="1672"
        />
        <figcaption>
          这张图画了蔓越莓的两条时间线：秋天第 1 天种下，才能在 8、13、18、23、28 收满五次；只赶第一茬、要在秋天第 28 天收到，最晚在秋天第 21 天种下。第 21 天再种就收不满五次。
        </figcaption>
      </figure>

      <p>
        上古水果共 28 天，没有生长激素时某季第 1 天种下，首次收获在下一季第 1 天，见下一节。
      </p>

      <h3>冬季</h3>

      <p>
        1.6 起，室外冬天至少能种霜瓜。霜瓜共 7 天，赶冬天第 28 天这一次，最晚在冬天第 21 天种下。作物生长日历从冬天第 1 天循环再种，霜瓜落在 8、15、22；22 是循环表最后一茬，赶冬天第 28 天这一次仍是第 21 天。
      </p>

      <p>
        冬季种子按 7 天算，最晚在冬天第 21 天种下。7 天按<a href="https://zh.stardewvalleywiki.com/春季种子">春季种子</a>页类推；该页写夏季、秋季、冬季种子同为特定季节野生种子。
      </p>

      <p>
        纤维共 7 天，一年四季都能种，不需要浇水。按同一式子，最晚当季第 21 天。
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
              <th scope="col">最晚播种日（第 28 天能收）</th>
              <th scope="col">说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>霜瓜</td>
              <td>7</td>
              <td>冬天第 21 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>冬季种子</td>
              <td>7（见上局限）</td>
              <td>冬天第 21 天</td>
              <td>只收一次</td>
            </tr>
            <tr>
              <td>纤维</td>
              <td>7；四季、不用浇水</td>
              <td>当季第 21 天</td>
              <td>只收一次</td>
            </tr>
          </tbody>
        </table>
      </div>

      <figure className="blog-article-media">
        <PublicPicture
          alt="这张图画了春夏秋冬四条 28 天格子。花椰菜和甜瓜标在第 16 天，南瓜标在秋天第 15 天，宝石甜莓标在秋天第 4 天，霜瓜标在冬天第 21 天。格子表示要在当季第 28 天收到这一次，最晚可以下种的日子。"
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/last-plant-four-season-calendar-zh.webp"
          width="1672"
        />
        <figcaption>
          这张图画了春夏秋冬四条 28 天格子。花椰菜和甜瓜标在第 16 天，南瓜标在秋天第 15 天，宝石甜莓标在秋天第 4 天，霜瓜标在冬天第 21 天。格子表示要在当季第 28 天收到这一次，最晚可以下种的日子。
        </figcaption>
      </figure>

      <h2>这些情况不要套成一个最晚日</h2>

      <p>
        温室、姜岛、茶叶、上古水果和生长激素，不要直接拿 28 减天数得出一个日子。下面分开说。
      </p>

      <p>
        温室里 10×12 耕地，一年中任何时间都可以种植、生长、收获，不受普通季节限制；可重复收获的作物换季不会直接枯死。<a href="https://zh.stardewvalleywiki.com/温室">温室</a>和本站<a className="blog-planner-link" href="/zh/glasshouse-stardew-valley">温室布局</a>都写了这条。<a href="https://zh.stardewvalleywiki.com/姜岛">姜岛</a>农场同样：当前季节不决定能种什么，一年四季都能长。室外这张表不套到这两处室内或岛上田。仙人掌果子本来就只能种在温室、室内花盆或姜岛，鹈鹕镇室外田下不去。
      </p>

      <p>
        茶叶在春、夏、秋的最后一周，从 22 日（周一）起每天收叶；种在室内时冬天也收。<a href="https://zh.stardewvalleywiki.com/农作物">农作物</a>茶叶行写「最多至并包括每个季节的21日 共：20 天」。<a href="https://zh.stardewvalleywiki.com/茶叶">茶叶</a>专页生长阶段写「最多至且包括每个季节的21日 共：21天」，成熟处写 20 天。同一站上 20 和 21 同时印着，不能折成一个数再拿 28 去减。茶苗若不是第 1 天种下，能不能赶上当季 22 到 28 的采叶周，维基没有写出最晚种茶日，这里也不另给一个日子。
      </p>

      <p>
        上古水果春夏秋能长，共 28 天，之后每 7 天。<a href="https://zh.stardewvalleywiki.com/作物生长日历">作物生长日历</a>写：不考虑肥料和农业学家时，若在某季第 1 天播种，首次收获在下一季第 1 天。生长激素和技能只缩短第一次收获。秋 1 室外种后，冬 1 是先收还是先枯，维基没写顺序，不要给这一天编结果。
      </p>

      <p>
        <a href="https://zh.stardewvalleywiki.com/生长激素">生长激素</a>加快 10%，有农业学家时共 20%。<a href="https://zh.stardewvalleywiki.com/高级生长激素">高级生长激素</a>加快 25%，叠加农业学家共 35%。<a href="https://zh.stardewvalleywiki.com/顶级生长激素">顶级生长激素</a>加快 33%，叠加农业学家共 43%。多次收获只缩短第一次，后续间隔不变。<a href="https://zh.stardewvalleywiki.com/耕种">耕种</a> 10 级农耕人分支可选农业学家：所有作物生长速度提高 10%。怎么点 5 级和 10 级，看<a className="blog-planner-link" href="/zh/rancher-or-tiller-stardew">农耕人还是畜牧人</a>。激素页只给 10% / 25% / 33%（叠加农业学家 20% / 35% / 43%）。日历页没有印出缩短后的「共：N 天」。除中文<a href="https://zh.stardewvalleywiki.com/稀有种子">稀有种子</a>「高级生长激素时最晚秋 10」外，别的作物没有现成的激素后最晚日，这里也不另算。英文 Rare Seed 没有秋 10 这句。
      </p>

      <p>
        <a href="https://zh.stardewvalleywiki.com/稀有种子">稀有种子</a>中文页写：使用高级生长激素时，玩家最晚可以在秋季第 10 天种下，并在冬季之前收获宝石甜莓。英文 <a href="https://stardewvalleywiki.com/Rare_Seed">Rare Seed</a> 没有这句，只写肥料或农业学家会减少天数。把 24 天、25% 和「秋 10」放在一起看，和中文专页相符；不要把同一乘法写成其他作物的总公式。
      </p>

      <p>
        果树苗 28 天成熟，幼苗任何季节都长，树肥对果树不起作用。那是果树规则，不是这张一年生作物表。室外果树怎么留格，看<a className="blog-planner-link" href="/zh/stardew-valley-trees">星露谷树木</a>。
      </p>

      <p>
        未碾米、芋头已经在表里写成范围。灌溉与否会改天数，没有第三个折中日。
      </p>

      <p>
        打开今天的日期，对表看最晚播种日；漏浇则把收日往后移，看还能否落在第 28 天。要收满次数，看是不是季初下的种。室外已经过了最晚日，又没有温室或姜岛这块田，这一季这种室外作物赶不及换季前这一次。
      </p>

      <h2>FAQ</h2>
      <BlogFaqList
        items={[
          {
            question: "春天防风草最晚哪天种？",
            answer: (
              <p>
                春天想在第 28 天收到防风草，最晚在第 24 天种下，当天浇水。作物生长日历上的春 25，是从第 1 天起收了再种、最后一茬落到 25；那样赶不上第 28 天收。第 25 天再种，收日会落到下一季第 1 天，成熟后能收的作物进新季也会枯。
              </p>
            ),
          },
          {
            question: "蔓越莓秋天第 21 天种，还能收满五次吗？",
            answer: (
              <p>不能。秋天第 21 天种下只赶上第一茬，秋天第 28 天能收一次。要收满五次，须秋天第 1 天种，收日是 8、13、18、23、28。</p>
            ),
          },
          {
            question: "冬天室外还能种吗？",
            answer: (
              <p>
                能。霜瓜生长 7 天，要在冬天第 28 天收到，最晚在冬天第 21 天种下。冬季种子也按 7 天算，最晚同样是冬天第 21 天。<a href="https://zh.stardewvalleywiki.com/春季种子">春季种子</a>页写夏季、秋季、冬季种子都是只能在特定季节种下的野生种子。
              </p>
            ),
          },
          {
            question: "用了高级生长激素，宝石甜莓最晚哪天种？别的作物也能按同一个乘法算吗？",
            answer: (
              <p>
                中文稀有种子页写：高级生长激素时最晚可以在秋季第 10 天种下，并在冬季之前收。英文 Rare Seed 页没有秋 10 这句。激素页只给 10% / 25% / 33%（叠加农业学家 20% / 35% / 43%）。日历页没有印出缩短后的「共：N 天」。除了这一句，别的作物没有现成的激素后最晚日，这里也不另算。
              </p>
            ),
          },
          {
            question: "温室里还要赶换季吗？",
            answer: (
              <p>
                温室里一年中任何时间可种，可重复收获的作物换季不枯。室外这张表不套进去。10×12 怎么排，看<a className="blog-planner-link" href="/zh/glasshouse-stardew-valley">温室布局</a>。
              </p>
            ),
          },
        ]}
      />

      <BlogSources
        heading="来源"
        checkedLabel="2026-09-21 对照下方星露谷中文维基（英文 Rare Seed、Crop Growth Calendars 仅作对照）。生长天数来自农作物各作物节。最晚播种日用 28 减去生长天数，种下去的那一天不算在内。作物生长日历是第 1 天种、收获当天再种的循环表。规划器可以摆作物、切四季，不算最晚播种日。"
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
