import { publicLocales, type PublicLocale } from "../i18n/public-locale";

export type LegalPageKind = "privacy" | "terms";

type LegalPageSection = Readonly<{
  heading: string;
  paragraphs: readonly string[];
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
        "Learn how Stardew Valley Planner keeps projects in your browser without accounts, cloud sync, or tracking.",
      sections: [
        {
          heading: "What we collect",
          paragraphs: ["There is no account or sign-in."],
        },
        {
          heading: "Farm data",
          paragraphs: ["Projects stay in this browser."],
        },
        {
          heading: "Online features",
          paragraphs: [
            "There is no cloud sync, share links, payments, memberships, or supporter features.",
          ],
        },
        {
          heading: "Analytics",
          paragraphs: [
            "This browser-local product does not provide analytics or tracking services.",
          ],
        },
        {
          heading: "Cookies",
          paragraphs: [
            "This browser-local product does not use sign-in cookies.",
          ],
        },
        {
          heading: "Third parties",
          paragraphs: [
            "Projects are not sent to a cloud service or shared with third parties.",
          ],
        },
        {
          heading: "Data deletion",
          paragraphs: [
            "You can delete local data by deleting projects or clearing this site's data in your browser.",
          ],
        },
        {
          heading: "Local use",
          paragraphs: ["JSON import and export happen only when you choose them."],
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      description:
        "Read the browser-local terms for Stardew Valley Planner, including local projects, optional JSON import and export, and fan-made status.",
      sections: [
        {
          heading: "What this is",
          paragraphs: [
            "Stardew Valley Planner is a browser-local fan-made tool for planning farm layouts in Stardew Valley. Projects stay in this browser. It is not affiliated with or endorsed by ConcernedApe or Stardew Valley.",
          ],
        },
        {
          heading: "Accounts",
          paragraphs: ["There is no account or sign-in."],
        },
        {
          heading: "Online features",
          paragraphs: [
            "There is no cloud sync, share links, payments, memberships, or supporter features.",
          ],
        },
        {
          heading: "Your data",
          paragraphs: [
            "JSON import and export happen only when you choose them. You can delete local data by deleting projects or clearing this site's data in your browser.",
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
          heading: "Local use",
          paragraphs: [
            "This browser-local product does not provide contact or support features.",
          ],
        },
      ],
    },
  },
  "zh-CN": {
    privacy: {
      title: "隐私政策",
      description:
        "了解星露谷农场规划器如何将项目保留在此浏览器中，不提供账户、云端同步或跟踪服务。",
      sections: [
        {
          heading: "我们收集什么",
          paragraphs: ["本产品不提供账户或登录功能。"],
        },
        {
          heading: "农场数据",
          paragraphs: ["项目保留在此浏览器中。"],
        },
        {
          heading: "在线功能",
          paragraphs: [
            "本产品不提供云端同步、分享链接、支付、会员或支持者功能。",
          ],
        },
        {
          heading: "分析",
          paragraphs: ["这款浏览器本地产品不提供分析或跟踪服务。"],
        },
        {
          heading: "Cookie",
          paragraphs: ["这款浏览器本地产品不使用登录 Cookie。"],
        },
        {
          heading: "第三方",
          paragraphs: ["项目不会发送至云端服务，也不会与第三方共享。"],
        },
        {
          heading: "数据删除",
          paragraphs: [
            "你可以删除项目，或在浏览器中清除此网站的数据，以删除本地数据。",
          ],
        },
        {
          heading: "本地使用",
          paragraphs: ["仅当你主动选择时，才会进行 JSON 导入和导出。"],
        },
      ],
    },
    terms: {
      title: "服务条款",
      description:
        "阅读星露谷农场规划器的浏览器本地服务条款，包括本地项目、由你选择的 JSON 导入和导出，以及同人创作说明。",
      sections: [
        {
          heading: "这是什么",
          paragraphs: [
            "星露谷农场规划器是一款用于规划《星露谷物语》农场布局的浏览器本地同人工具。项目保留在此浏览器中。它与 ConcernedApe 或《星露谷物语》没有关联，也未获其认可。",
          ],
        },
        {
          heading: "账户",
          paragraphs: ["本产品不提供账户或登录功能。"],
        },
        {
          heading: "在线功能",
          paragraphs: [
            "本产品不提供云端同步、分享链接、支付、会员或支持者功能。",
          ],
        },
        {
          heading: "你的数据",
          paragraphs: [
            "仅当你主动选择时，才会进行 JSON 导入和导出。你可以删除项目，或在浏览器中清除此网站的数据，以删除本地数据。",
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
          heading: "本地使用",
          paragraphs: ["这款浏览器本地产品不提供联系或支持功能。"],
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
