import type { PublicLocale } from "../i18n/public-locale";

export type ContactPageCopy = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  invalidMessage: string;
  unavailableMessage: string;
  verificationLoadingMessage: string;
  verificationFailedMessage: string;
  privacyNotice: string;
  discordInviteLead: string;
  discordInviteLabel: string;
}>;

const contactPageCopyByLocale: Readonly<Record<PublicLocale, ContactPageCopy>> = {
  en: {
    eyebrow: "EMAIL FORM",
    title: "Contact us",
    description: "Send a message to the Stardew Valley Farm Planner team.",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    messageLabel: "Message",
    messagePlaceholder: "Tell me what you need help with.",
    submitLabel: "Send message",
    submittingLabel: "Sending…",
    successMessage: "Thanks — your message has been sent.",
    invalidMessage: "Check the form details and try again.",
    unavailableMessage: "We could not send your message. Please try again later.",
    verificationLoadingMessage: "The spam check is still loading. Please try again in a moment.",
    verificationFailedMessage: "The spam check could not be completed. Please try again.",
    privacyNotice:
      "We use your message only to respond and delete it when resolved, no later than 90 days.",
    discordInviteLead:
      "You can also join the Discord community for farm layouts, feedback, and support.",
    discordInviteLabel: "Join Discord",
  },
  "zh-CN": {
    eyebrow: "联系表单",
    title: "联系我们",
    description: "向星露谷农场规划器团队发送消息。",
    nameLabel: "姓名",
    namePlaceholder: "你的姓名",
    emailLabel: "邮箱",
    emailPlaceholder: "you@example.com",
    messageLabel: "消息",
    messagePlaceholder: "告诉我你需要什么帮助。",
    submitLabel: "发送消息",
    submittingLabel: "正在发送…",
    successMessage: "感谢你的消息，已经发送成功。",
    invalidMessage: "请检查表单内容后重试。",
    unavailableMessage: "暂时无法发送消息，请稍后重试。",
    verificationLoadingMessage: "反垃圾验证仍在加载，请稍后重试。",
    verificationFailedMessage: "反垃圾验证未完成，请重试。",
    privacyNotice: "我们仅用你的消息来回复，并会在问题解决后删除，最长保留 90 天。",
    discordInviteLead:
      "也可以加入 Discord 社区，讨论农场布局、反馈问题和获取帮助。",
    discordInviteLabel: "加入 Discord",
  },
};

export function getContactPageCopy(locale: PublicLocale): ContactPageCopy {
  return contactPageCopyByLocale[locale];
}
