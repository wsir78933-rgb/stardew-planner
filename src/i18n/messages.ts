import enMessages from "../../messages/en.json";
import zhCNMessages from "../../messages/zh-CN.json";
import { assertSiteLocale, type SiteLocale } from "./locales";

type MessageTree = { [messageKey: string]: MessageValue };
type MessageValue = string | MessageTree;

const siteMessagesByLocale: Record<SiteLocale, MessageTree> = {
  en: enMessages,
  "zh-CN": zhCNMessages,
};

assertMessageTreeParity(siteMessagesByLocale.en, siteMessagesByLocale["zh-CN"]);

export function getSiteMessages(locale: SiteLocale): MessageTree {
  assertSiteLocale(locale);
  return siteMessagesByLocale[locale];
}

export function translate(locale: SiteLocale, messageKey: string): string {
  assertSiteLocale(locale);

  if (typeof messageKey !== "string" || messageKey === "") {
    throw new Error(
      `message key ${formatInvalidValue(messageKey)} must be a non-empty string`,
    );
  }

  let messageValue: MessageValue | undefined = getSiteMessages(locale);

  for (const keySegment of messageKey.split(".")) {
    if (!isMessageTree(messageValue) || !(keySegment in messageValue)) {
      throw new Error(
        `message key ${formatInvalidValue(messageKey)} does not exist for locale ${formatInvalidValue(locale)}`,
      );
    }

    messageValue = messageValue[keySegment];
  }

  if (typeof messageValue === "string") {
    return messageValue;
  }

  throw new Error(
    `message key ${formatInvalidValue(messageKey)} must resolve to a string; received ${formatInvalidValue(messageValue)}`,
  );
}

export function formatTranslation(
  locale: SiteLocale,
  messageKey: string,
  values: Readonly<Record<string, string | number>>,
): string {
  return Object.entries(values).reduce(
    (formattedMessage, [placeholderName, placeholderValue]) =>
      formattedMessage.replaceAll(
        `{${placeholderName}}`,
        String(placeholderValue),
      ),
    translate(locale, messageKey),
  );
}

export function getMessageKeyPaths(messages: unknown): string[] {
  const messageKeyPaths: string[] = [];
  collectMessageKeyPaths(messages, "", messageKeyPaths);
  return messageKeyPaths.sort();
}

function assertMessageTreeParity(
  enMessages: MessageTree,
  zhCNMessages: MessageTree,
): void {
  const enMessageKeyPaths = getMessageKeyPaths(enMessages);
  const zhCNMessageKeyPaths = getMessageKeyPaths(zhCNMessages);

  if (enMessageKeyPaths.join("\n") === zhCNMessageKeyPaths.join("\n")) {
    return;
  }

  throw new Error(
    `English and Chinese message key paths must match; received ${JSON.stringify({ en: enMessageKeyPaths, "zh-CN": zhCNMessageKeyPaths })}`,
  );
}

function collectMessageKeyPaths(
  messageNode: unknown,
  parentPath: string,
  messageKeyPaths: string[],
): void {
  if (!isMessageTree(messageNode)) {
    throw new Error(
      `message value at "${parentPath || "<root>"}" must be an object; received ${formatInvalidValue(messageNode)}`,
    );
  }

  for (const messageKey of Object.keys(messageNode).sort()) {
    const messageValue = messageNode[messageKey];
    const messageKeyPath = parentPath
      ? `${parentPath}.${messageKey}`
      : messageKey;

    if (typeof messageValue === "string") {
      messageKeyPaths.push(messageKeyPath);
      continue;
    }

    if (isMessageTree(messageValue)) {
      collectMessageKeyPaths(messageValue, messageKeyPath, messageKeyPaths);
      continue;
    }

    throw new Error(
      `message value at "${messageKeyPath}" must be a string; received ${formatInvalidValue(messageValue)}`,
    );
  }
}

function isMessageTree(value: unknown): value is MessageTree {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatInvalidValue(value: unknown): string {
  const serializedValue = JSON.stringify(value);
  return serializedValue === undefined ? String(value) : serializedValue;
}
