import { BlogYouTubeVideo } from "../../components/blog/blog-youtube-video";

export function WhereIsRobinChineseArticle() {
  return (
    <article>
      <p>
        {
          "罗宾住在山区的 24 Mountain Road，也就是鹈鹕镇北面。她的家同时也是木匠商店。多数日期，她会在 09:00–17:00 于柜台接待玩家；周二通常休息，周五则在 16:00 结束服务。如果罗宾正在你的农场施工，她会在那里工作，商店也会全天关闭。"
        }
      </p>
      <p>
        {
          "这是星露谷物语 1.6.15 中最可靠的起点。天气、节日、游戏进度和少数特殊日期，都可能把她带到其他地方。"
        }
      </p>

      <h2>先去 24 Mountain Road</h2>
      <p>
        {
          "从农场出发，最快的路线是走农场北侧出口，穿过偏僻小路后向东进入山区，再沿台阶下到罗宾家。从鹈鹕镇出发，则沿社区中心旁边的小路一直向北走。"
        }
      </p>
      <p>
        {
          "这栋建筑既是商店，也是罗宾一家的住处；德米特里厄斯、玛鲁和塞巴斯蒂安都住在这里。即使商店休息，房子通常仍可在 09:00–20:00 进入。很多扑空正是因为忽略了这层区别：房子开着，不代表罗宾可以出售物品或开始订单。"
        }
      </p>
      <figure className="blog-article-media">
        <img
          alt="从农场和鹈鹕镇前往山区木匠商店的两条路线示意图"
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/robin-location-routes.webp"
          width="1672"
        />
        <figcaption>农场北侧出口和社区中心旁的小路，都能通往山区的罗宾家。</figcaption>
      </figure>

      <h2>罗宾平时一周怎么走</h2>
      <h3>多数日期</h3>
      <p>
        {
          "罗宾早上会走到商店柜台，并在 09:00–17:00 接待玩家。购买物品、委托建筑、升级农舍或调整现有建筑，都应该安排在这个窗口内。"
        }
      </p>

      <h3>周二</h3>
      <p>
        {
          "周二通常是商店关闭日，但下雨也可能改变这套日程。普通天气下，罗宾会在 09:30 离家前往皮埃尔的杂货店，13:00–16:00 参加健身，之后再聊一会儿，18:00 回家。"
        }
      </p>
      <p>
        {
          "下雨会覆盖这套周二行程。罗宾会留在家里并到柜台工作，因此看天气比死记“周二一定休息”更准确。"
        }
      </p>

      <h3>周五</h3>
      <p>
        {
          "罗宾会在柜台工作到 16:00，随后和德米特里厄斯前往星之果实餐吧。周五 16:00 之后则已经超过正常服务时间。要下建筑订单，就早点去，不要把社交行程误当成营业时间。"
        }
      </p>

      <h2>特殊行程要按顺序排查</h2>
      <h3>先看自己的农场</h3>
      <p>
        {
          "正在施工，是商店空着时最直接的解释。罗宾正在建造新的农场建筑时，会在玩家农场施工，木匠商店也会关闭。节日可能打断工程、推迟完工，但普通周二不会让已经开始的施工停下来。"
        }
      </p>

      <h3>再看天气和日历</h3>
      <p>
        {
          "普通雨天会让罗宾采用居家行程，也可能让周二柜台营业。第一年的绿雨不同：她会全天待在塞巴斯蒂安房间。夏季 18 日，她早上会去哈维诊所，商店关闭；普通节日也会全天闭店。"
        }
      </p>
      <p>
        {
          "冬季 16 日改变的是下班后的安排，她会在柜台结束服务后前往夜市。社区中心修复完成后，周一下班后她也可能去那里待一会儿。"
        }
      </p>
      <figure className="blog-article-media">
        <img
          alt="罗宾在柜台、健身、餐吧和农场施工的四种行程状态"
          decoding="async"
          height="941"
          loading="lazy"
          src="/blog/illustrations/robin-schedule-states.webp"
          width="1672"
        />
        <figcaption>柜台营业、周二健身、周五晚间和农场施工是不同状态；找到罗宾，不等于商店可用。</figcaption>
      </figure>

      <h3>最后看已经解锁的远行</h3>
      <p>
        {
          "姜岛度假村开放后，罗宾有时会在周二前往姜岛，不再执行普通健身日程。沙漠节期间，她可能作为商贩前往卡利科沙漠，也可能待在冒险者公会挑战摊位附近。这些行程都依赖游戏进度，相关区域或活动尚未解锁时无需考虑。"
        }
      </p>

      <h2>找到罗宾不等于能使用商店</h2>
      <p>
        {
          "找到罗宾和找到正在营业的柜台，是两个不同的问题。周二可以在皮埃尔杂货店见到她，周五晚上可以在餐吧见到她，节日里也能碰面，但这些地方都不能委托畜棚或搬动棚屋。"
        }
      </p>
      <p>
        {
          "反过来也一样容易误会：房子能进去时，柜台不一定可用。目标是施工，就按柜台营业窗口安排，而不是只看房门。如果罗宾已经离开柜台，需要的建筑操作通常只能等下一个工作时段。"
        }
      </p>

      <h2>出发前先把建筑位置想好</h2>
      <p>
        {
          "找罗宾通常是为了进入建筑界面，而那个界面并不适合临时重想整个农场。出门前先决定门口、道路、围栏和后续升级空间放在哪里。"
        }
      </p>
      <p>
        {"用"}
        <a href="/zh">星露谷规划器</a>
        {"把目标建筑放到作物、仓储和日常路线旁边试一遍。重点经营动物时，可以直接在"}
        <a href="/zh?farmType=meadowlands">规划器中打开草原农场</a>
        {"。建筑占地和移动规则则整理在"}
        <a href="/zh/carpenter-stardew">星露谷木匠指南</a>
        {"里。"}
      </p>
      <p>目标位置确定后，再检查日期、天气和当前施工状态，然后前往 24 Mountain Road。</p>

      <h2>观看前往罗宾商店的路线</h2>
      <p>这段短视频会展示山区路线、罗宾的木匠商店和服务柜台。点击播放后才会加载视频。</p>
      <BlogYouTubeVideo
        playLabel="播放罗宾位置指南"
        posterSrc="/blog/video-posters/robin-location-guide.webp"
        title="星露谷物语罗宾位置指南"
        youtubeVideoId="bFEEer6Cp3U"
      />

      <h2>来源与版本边界</h2>
      <p>
        {"本文覆盖星露谷物语 1.6.15。罗宾的住址、每周行程、天气安排、特殊日期和闭店情况，均核对自星露谷 Wiki 的"}
        <a href="https://wiki.stardewvalley.net/Robin">Robin</a>
        {"、"}
        <a href="https://wiki.stardewvalley.net/Carpenter%27s_Shop">Carpenter&apos;s Shop</a>
        {"和"}
        <a href="https://wiki.stardewvalley.net/Shop_Schedules">Shop Schedules</a>
        {"页面。游戏更新或模组改变 NPC 行程后，应重新查看对应来源。"}
      </p>
      <aside
        aria-label="AgentHunter friend link"
        style={{
          borderTop: "1px solid rgb(28 33 27 / 18%)",
          marginTop: "2rem",
          paddingTop: "1.5rem",
        }}
      >
        <a
          href="https://www.agenthunter.io?utm_source=badge&utm_medium=embed&utm_campaign=token%20maker"
          rel="noopener noreferrer"
          style={{
            alignItems: "center",
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            display: "inline-flex",
            fontFamily: "sans-serif",
            gap: "0.5rem",
            padding: "0.5rem 0.75rem",
            textDecoration: "none",
            transition: "all 0.2s",
          }}
          target="_blank"
        >
          <img
            alt="AgentHunter Badge"
            height={40}
            loading="lazy"
            src="https://www.agenthunter.io/logo-light.svg"
            style={{ height: "2.5rem", width: "2.5rem" }}
            width={40}
          />
          <span style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#6b7280", fontSize: "0.75rem" }}>AgentHunter</span>
            <span style={{ color: "#111827", fontSize: "0.875rem", fontWeight: 600 }}>
              Featured AI Agent
            </span>
          </span>
        </a>
      </aside>
    </article>
  );
}
