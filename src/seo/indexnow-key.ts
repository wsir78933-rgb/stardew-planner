import { publicSiteUrl } from "./public-site-url";

const indexNowKeyPattern = /^[a-f0-9]{32}$/;
const configuredIndexNowKey = "4b0eb814ec8adf87471b55dd02a47b21";

function requireIndexNowKey(key: string): string {
  if (!indexNowKeyPattern.test(key)) {
    throw new TypeError(
      `IndexNow key must match /^[a-f0-9]{32}$/. Received: ${JSON.stringify(key)}.`,
    );
  }

  return key;
}

function createIndexNowKeyLocation(key: string): string {
  return new URL(`/${key}.txt`, publicSiteUrl).href;
}

export const indexNowKey = requireIndexNowKey(configuredIndexNowKey);
export const indexNowKeyLocation = createIndexNowKeyLocation(indexNowKey);
