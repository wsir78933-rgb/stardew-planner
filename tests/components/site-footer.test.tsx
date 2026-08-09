import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { SiteFooter } from "../../src/components/site-footer";
import {
  createSiteFooterContent,
  type SiteFooterCopy,
} from "../../src/site-footer/site-footer-content";

const footerCopy: SiteFooterCopy = {
  brandName: "Stardew Valley Farm Planner",
  description: "Plan your farm layout.",
  copyright: "© Stardew Valley Farm Planner",
  planner: {
    title: "Planner",
    home: "Planner home",
    farmComparison: "Farm comparison",
    moddedFarms: "Modded farms",
  },
  explore: {
    title: "Explore",
    capabilities: "Capabilities",
    faq: "FAQ",
    blog: "Blog",
  },
  legal: {
    title: "Legal",
    privacy: "Privacy policy",
    terms: "Terms of service",
    contact: "Contact us",
  },
};

function renderFooter(locale: "en" | "zh-CN"): string {
  return renderToStaticMarkup(
    <SiteFooter content={createSiteFooterContent(footerCopy, locale)} />,
  );
}

it("renders every English footer destination, identity, copyright, and linked Twitter icon", () => {
  const footerMarkup = renderFooter("en");

  expect(footerMarkup).toContain('<footer data-site-footer="true">');
  expect(footerMarkup).toContain('data-site-footer-identity="true"');
  expect(footerMarkup).toContain(footerCopy.brandName);
  expect(footerMarkup).toContain(footerCopy.description);
  expect(footerMarkup).toContain(footerCopy.copyright);
  expect(footerMarkup).toContain('data-site-footer-sections="true"');
  expect(
    footerMarkup.match(/data-site-footer-group="true"/g),
  ).toHaveLength(3);
  expect(footerMarkup).toContain('href="/"');
  expect(footerMarkup).toContain('href="/farm-comparison"');
  expect(footerMarkup).toContain('href="/mods"');
  expect(footerMarkup).toContain('href="/#capabilities"');
  expect(footerMarkup).toContain('href="/#faq"');
  expect(footerMarkup).toContain('href="/blog"');
  expect(footerMarkup).toContain('href="/privacy"');
  expect(footerMarkup).toContain('href="/terms"');
  expect(footerMarkup).toContain('href="/contact"');
  expect(footerMarkup).toContain('data-site-footer-social-icons="true"');

  const socialIconRegion = footerMarkup.match(
    /<div data-site-footer-social-icons="true">([\s\S]*?)<\/div>/,
  );
  const socialIconMarkup = socialIconRegion?.[1] ?? "";
  expect(socialIconMarkup.match(/<span aria-hidden="true">/g)).toHaveLength(3);
  expect(socialIconMarkup.match(/<a /g)).toHaveLength(1);
  expect(socialIconMarkup).toContain('href="https://x.com/wsir1139"');
  expect(socialIconMarkup).toContain('target="_blank"');
  expect(socialIconMarkup).toContain('rel="noopener noreferrer"');
  expect(socialIconMarkup).toContain(
    'aria-label="Follow @wsir1139 on X (Twitter)"',
  );
});

it("uses Chinese homepage destinations throughout the Chinese footer", () => {
  const footerMarkup = renderFooter("zh-CN");

  expect(footerMarkup).toContain('href="/zh"');
  expect(footerMarkup).toContain('href="/zh/farm-comparison"');
  expect(footerMarkup).toContain('href="/zh/mods"');
  expect(footerMarkup).toContain('href="/zh#capabilities"');
  expect(footerMarkup).toContain('href="/zh#faq"');
  expect(footerMarkup).toContain('href="/zh/blog"');
  expect(footerMarkup).toContain('href="/zh/privacy"');
  expect(footerMarkup).toContain('href="/zh/terms"');
  expect(footerMarkup).toContain('href="/zh/contact"');
  expect(footerMarkup).not.toContain('href="/"');
  expect(footerMarkup).not.toContain('href="/#capabilities"');
  expect(footerMarkup).not.toContain('href="/#faq"');
});
