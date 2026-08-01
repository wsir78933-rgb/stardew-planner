export const publicLocales = ["en", "zh-CN"] as const;

export type PublicLocale = (typeof publicLocales)[number];
