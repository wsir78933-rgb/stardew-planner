import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LegalContent } from "../../src/components/legal-content";

describe("LegalContent", () => {
  it("renders the local-only Chinese privacy policy rather than English fallback copy", () => {
    const markup = renderToStaticMarkup(
      <LegalContent locale="zh-CN" page="privacy" />,
    );

    expect(markup).toContain("隐私政策");
    expect(markup).toContain("浏览器本地");
    expect(markup).toContain("不提供账户、云同步或付款服务");
    expect(markup).not.toContain("Privacy Policy");
  });

  it("renders the English terms boundary for the same explicit legal page", () => {
    const markup = renderToStaticMarkup(<LegalContent locale="en" page="terms" />);

    expect(markup).toContain("Terms of Use");
    expect(markup).toContain("local browser storage");
    expect(markup).toContain("does not provide accounts, cloud synchronization, or payments");
  });
});
