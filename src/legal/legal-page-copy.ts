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
        "Learn how Stardew Valley Planner stores projects locally unless you choose Google sign-in and sync selected layouts.",
      sections: [
        {
          heading: "What we collect",
          paragraphs: [
            "An account is not required for local use. If you choose Google sign-in, your Google name, email address, and avatar are used to display your account; this site's cookie keeps the sign-in session.",
          ],
        },
        {
          heading: "Farm data",
          paragraphs: [
            "Projects stay in this browser unless you choose to sync them. Selected layout data is stored in this site's Cloudflare D1 database; map preview images stay on this device.",
          ],
        },
        {
          heading: "Online features",
          paragraphs: [
            "Optional cloud sync is available after Google sign-in for projects you choose. The service does not provide share links, payments, memberships, or supporter features.",
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
            "Google sign-in uses a session cookie to keep your account signed in. Local planning does not require sign-in.",
          ],
        },
        {
          heading: "Third parties",
          paragraphs: [
            "Only layout data for projects you choose to sync is sent to this site's Cloudflare Worker and D1 database. Map preview images are not included in cloud copies. Google handles authentication when you choose to sign in.",
          ],
        },
        {
          heading: "Data deletion",
          paragraphs: [
            "Delete a cloud copy from the cloud project list. Delete local data by deleting local projects or clearing this site's data in your browser; deleting one copy does not delete the other.",
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
        "Read the Stardew Valley Planner terms for local projects, optional Google sign-in and cloud sync, JSON import and export, and fan-made status.",
      sections: [
        {
          heading: "What this is",
          paragraphs: [
            "Stardew Valley Planner is a browser-based fan-made tool for planning farm layouts in Stardew Valley. Projects are saved locally unless you choose to sync them. It is not affiliated with or endorsed by ConcernedApe or Stardew Valley.",
          ],
        },
        {
          heading: "Accounts",
          paragraphs: [
            "An account is not required to plan or save locally. Google sign-in is optional and enables cloud sync for projects you choose.",
          ],
        },
        {
          heading: "Online features",
          paragraphs: [
            "Optional cloud sync is available for projects you choose. The service does not provide share links, payments, memberships, or supporter features.",
          ],
        },
        {
          heading: "Your data",
          paragraphs: [
            "JSON import and export happen only when you choose them. You can delete local and cloud copies separately; deleting one copy does not delete the other.",
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
        "了解星露谷农场规划器如何默认在本地保存项目，以及你主动选择 Google 登录和同步布局时的数据处理方式。",
      sections: [
        {
          heading: "我们收集什么",
          paragraphs: [
            "本地使用无需账户。如果你选择使用 Google 登录，Google 返回的姓名、邮箱和头像会用于显示账户；本站通过 Cookie 保持登录会话。",
          ],
        },
        {
          heading: "农场数据",
          paragraphs: [
            "项目保留在此浏览器中，除非你主动选择同步。所选项目的布局数据会存储在本站 Cloudflare D1 数据库中；地图预览图片仍保留在此设备上。",
          ],
        },
        {
          heading: "在线功能",
          paragraphs: [
            "使用 Google 登录后，可以选择同步项目。本产品不提供分享链接、支付、会员或支持者功能。",
          ],
        },
        {
          heading: "分析",
          paragraphs: ["这款浏览器本地产品不提供分析或跟踪服务。"],
        },
        {
          heading: "Cookie",
          paragraphs: ["本站使用同源会话 Cookie 保持 Google 账户的登录状态。本地规划无需登录。"],
        },
        {
          heading: "第三方",
          paragraphs: ["仅你选择同步的项目布局数据会发送到本站 Cloudflare Worker 和 D1 数据库。云端副本不包含地图预览图片。你选择登录时，Google 会处理身份验证。"],
        },
        {
          heading: "数据删除",
          paragraphs: [
            "你可以从云端项目列表删除云端副本。删除本地项目或清除此网站数据可移除本地数据；删除一份副本不会删除另一份。",
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
        "阅读星露谷农场规划器关于本地项目、可选 Google 登录和云端同步、JSON 导入导出及同人创作的服务条款。",
      sections: [
        {
          heading: "这是什么",
          paragraphs: [
            "星露谷农场规划器是一款用于规划《星露谷物语》农场布局的浏览器同人工具。项目默认保存在本地，除非你选择同步。它与 ConcernedApe 或《星露谷物语》没有关联，也未获其认可。",
          ],
        },
        {
          heading: "账户",
          paragraphs: ["规划和本地保存无需账户。Google 登录为可选功能，可用于同步你选择的项目。"],
        },
        {
          heading: "在线功能",
          paragraphs: [
            "你可以选择使用云端同步。本产品不提供分享链接、支付、会员或支持者功能。",
          ],
        },
        {
          heading: "你的数据",
          paragraphs: [
            "仅当你主动选择时，才会进行 JSON 导入和导出。你可以分别删除本地副本和云端副本；删除一份不会删除另一份。",
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
