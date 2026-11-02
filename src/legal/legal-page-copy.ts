import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export type LegalPageKind = "privacy" | "terms";

export type LegalPageInlineLink = Readonly<{
  href: string;
  label: string;
}>;

export type LegalPageParagraph =
  | string
  | readonly (string | LegalPageInlineLink)[];

type LegalPageSection = Readonly<{
  heading: string;
  paragraphs: readonly LegalPageParagraph[];
}>;

export type LegalPageCopy = Readonly<{
  title: string;
  description: string;
  sections: readonly LegalPageSection[];
}>;

const legalPageCopyByLocale: Readonly<
  Record<PublicLocale, Readonly<Record<LegalPageKind, LegalPageCopy>>>
> = {
  en: {
    privacy: {
      title: "Privacy Policy",
      description:
        "Learn how Stardew Valley Planner collects analytics data and handles contact messages. The planner interface stores projects in this browser and does not offer upload or cloud sync.",
      sections: [
        {
          heading: "What we collect",
          paragraphs: [
            "Using the planner does not require an account or sign-in. The current planner interface stores projects in this browser and does not upload or sync them.",
          ],
        },
        {
          heading: "Farm data",
          paragraphs: [
            "Projects are saved in this browser. The current planner interface does not upload or synchronize project data.",
          ],
        },
        {
          heading: "Analytics",
          paragraphs: [
            "This site uses Google Analytics 4 (ID G-SEKQT6DTT1) and Microsoft Clarity (ID xwledpd5pa). Google Analytics is configured to send standard page_view events; no custom events are configured in the site code. Google Signals and ads-personalization signals are disabled for the GA4 tag and property. Microsoft Clarity collects interaction events such as clicks, scrolling, and pointer movement, plus page DOM information used to reconstruct session recordings and generate heatmaps; the page content it captures depends on Clarity's masking settings. The current site code does not gate these scripts behind a consent choice.",
          ],
        },
        {
          heading: "Advertising",
          paragraphs: [
            [
              "AdSense ads are not currently enabled on this site. If Google AdSense is approved and enabled, Google and the ad technology providers selected for this site may use cookies or similar technologies to serve and measure ads based on your prior visits to this site or other sites. Depending on settings and consent, ads may be personalized. Manage Google personalized advertising at ",
              {
                href: "https://www.google.com/settings/ads",
                label: "Google Ads Settings",
              },
              "; opt out of some third-party personalized advertising at ",
              {
                href: "https://www.aboutads.info/choices/",
                label: "About Ads Choices",
              },
              ". See Google's current ad technology provider list at ",
              {
                href: "https://support.google.com/admanager/answer/9012903?hl=en",
                label: "Google's ad technology provider list",
              },
              ".",
            ],
          ],
        },
        {
          heading: "Cookies",
          paragraphs: [
            "Google Analytics and Microsoft Clarity may set measurement cookies when their scripts run. If AdSense ads are enabled, Google and selected ad technology providers may also use advertising cookies or similar technologies as described above.",
          ],
        },
        {
          heading: "Third parties",
          paragraphs: [
            "Google Analytics (Google LLC) and Microsoft Clarity (Microsoft Corporation) receive analytics information when their scripts run. The site code does not send saved project JSON as custom analytics events. Microsoft Clarity collects page DOM, so project names or content visible on a page may be captured depending on the Clarity project's masking settings. The current masking configuration for this site has not been verified.",
          ],
        },
        {
          heading: "Data deletion",
          paragraphs: [
            "Delete local data by deleting local projects or clearing this site's data in your browser.",
          ],
        },
        {
          heading: "Local use",
          paragraphs: ["JSON import and export happen only when you choose them."],
        },
        {
          heading: "Contact messages",
          paragraphs: [
            "When you use the contact form, your name, email address, and message are sent to Cloudflare to verify the form and deliver the message to our inbox. We use this information only to respond and delete it when the issue is resolved, no later than 90 days.",
          ],
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      description:
        "Read the Stardew Valley Planner terms for local projects, JSON import and export, and fan-made status.",
      sections: [
        {
          heading: "What this is",
          paragraphs: [
            "Stardew Valley Planner is a browser-based fan-made tool for planning farm layouts in Stardew Valley. Projects are saved locally in your browser; the planner interface does not offer project upload or cloud synchronization. It is not affiliated with or endorsed by ConcernedApe or Stardew Valley.",
          ],
        },
        {
          heading: "Your data",
          paragraphs: [
            "JSON import and export happen only when you choose them. The planner interface keeps project data in this browser and does not upload or sync it.",
          ],
        },
        {
          heading: "Availability",
          paragraphs: ["The product is provided as-is with no uptime guarantees."],
        },
        {
          heading: "Game assets",
          paragraphs: [
            "Stardew Valley game assets are the property of ConcernedApe. They are used here for this fan-made planning tool.",
          ],
        },
        {
          heading: "Contact messages",
          paragraphs: [
            "If you choose to contact us, do not include sensitive information. We use your message only to respond and delete it when the issue is resolved, no later than 90 days.",
          ],
        },
      ],
    },
  },
  "zh-CN": {
    privacy: {
      title: "隐私政策",
      description:
        "了解星露谷农场规划器如何收集分析数据并处理联系消息。当前规划器界面将项目保存在此浏览器中，不提供上传或云端同步。",
      sections: [
        {
          heading: "我们收集什么",
          paragraphs: [
            "使用规划器无需账户或登录。当前规划器界面将项目保存在此浏览器中，不会上传或同步。",
          ],
        },
        {
          heading: "农场数据",
          paragraphs: [
            "项目保存在此浏览器中；当前规划器界面不会上传或同步项目数据。",
          ],
        },
        {
          heading: "分析",
          paragraphs: [
            "本站使用 Google Analytics 4（ID：G-SEKQT6DTT1）和 Microsoft Clarity（ID：xwledpd5pa）。Google Analytics 配置为发送标准 page_view 事件；网站代码未配置自定义事件。GA4 标签和属性中的 Google Signals 与广告个性化信号均已关闭。Microsoft Clarity 会收集点击、滚动和指针移动等互动事件，以及用于重建会话回放、生成热图的页面 DOM 信息；其捕获的页面内容受 Clarity 项目的屏蔽设置影响。当前网站代码没有通过同意选择拦截这些脚本。",
          ],
        },
        {
          heading: "广告",
          paragraphs: [
            [
              "本站目前尚未启用 AdSense 广告。如果 Google AdSense 获批并启用，Google 和为本站选定的广告技术提供商可能会使用 Cookie 或类似技术，根据你过去访问本站或其他网站的情况投放和衡量广告。具体广告是否个性化取决于相关设置和同意状态。你可以通过 ",
              {
                href: "https://www.google.com/settings/ads",
                label: "Google 广告设置",
              },
              " 管理 Google 个性化广告；也可通过 ",
              {
                href: "https://www.aboutads.info/choices/",
                label: "About Ads",
              },
              " 退出部分第三方个性化广告。当前 Google 广告技术提供商名单：",
              {
                href: "https://support.google.com/admanager/answer/9012903?hl=en",
                label: "查看名单",
              },
              "。",
            ],
          ],
        },
        {
          heading: "Cookie",
          paragraphs: [
            "Google Analytics 和 Microsoft Clarity 的脚本运行时可能会设置测量 Cookie。若启用 AdSense 广告，Google 和选定的广告技术提供商也可能使用广告 Cookie 或类似技术，详见上文。",
          ],
        },
        {
          heading: "第三方",
          paragraphs: [
            "Google Analytics（Google LLC）和 Microsoft Clarity（Microsoft Corporation）会在其脚本运行时接收分析信息。网站代码不会将已保存的项目 JSON 作为自定义分析事件发送。Microsoft Clarity 会采集页面 DOM，因此页面上可见的项目名称或内容可能会根据 Clarity 项目的屏蔽设置被捕获。本站当前的屏蔽配置尚未核实。",
          ],
        },
        {
          heading: "数据删除",
          paragraphs: [
            "删除本地项目或清除此网站数据可移除本地数据。",
          ],
        },
        {
          heading: "本地使用",
          paragraphs: ["仅当你主动选择时，才会进行 JSON 导入和导出。"],
        },
        {
          heading: "联系消息",
          paragraphs: [
            "当你使用联系表单时，你的姓名、邮箱和消息会发送给 Cloudflare，用于验证表单并将消息投递到我们的收件箱。我们仅用这些信息进行回复，并会在问题解决后删除，最长保留 90 天。",
          ],
        },
      ],
    },
    terms: {
      title: "服务条款",
      description:
        "阅读星露谷农场规划器关于本地项目、JSON 导入导出及同人创作的服务条款。",
      sections: [
        {
          heading: "这是什么",
          paragraphs: [
            "星露谷农场规划器是一款用于规划《星露谷物语》农场布局的浏览器同人工具。项目保存在你的浏览器本地；当前规划器界面不提供项目上传或云端同步。它与 ConcernedApe 或《星露谷物语》没有关联，也未获其认可。",
          ],
        },
        {
          heading: "你的数据",
          paragraphs: [
            "仅当你主动选择时，才会进行 JSON 导入和导出。当前规划器界面将项目数据保存在此浏览器中，不会上传或同步。",
          ],
        },
        {
          heading: "可用性",
          paragraphs: ["本产品按现状提供，不保证正常运行时间。"],
        },
        {
          heading: "游戏素材",
          paragraphs: [
            "《星露谷物语》游戏素材归 ConcernedApe 所有，并用于这款同人规划工具。",
          ],
        },
        {
          heading: "联系消息",
          paragraphs: [
            "如果你选择联系我们，请不要发送敏感信息。我们仅用你的消息进行回复，并会在问题解决后删除，最长保留 90 天。",
          ],
        },
      ],
    },
  },
};

function assertSupportedLocale(locale: string): asserts locale is PublicLocale {
  if (!publicLocales.includes(locale as PublicLocale)) {
    throw new Error(`Unsupported legal locale. Received: ${JSON.stringify(locale)}.`);
  }
}

function assertLegalPageKind(legalPageKind: string): asserts legalPageKind is LegalPageKind {
  if (legalPageKind !== "privacy" && legalPageKind !== "terms") {
    throw new Error(
      `Unsupported legal page kind. Received: ${JSON.stringify(legalPageKind)}.`,
    );
  }
}

export function getLegalPageCopy(
  locale: string,
  legalPageKind: string,
): LegalPageCopy {
  assertSupportedLocale(locale);
  assertLegalPageKind(legalPageKind);

  return legalPageCopyByLocale[locale][legalPageKind];
}
