import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { PlannerFeedbackForm } from "../../src/contact/planner-feedback-form";

afterEach(() => {
  vi.unstubAllEnvs();
});

it("renders the anonymous English feedback fields and Turnstile action", () => {
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "public-test-key");
  const markup = renderToStaticMarkup(<PlannerFeedbackForm locale="en" />);

  expect(markup).toContain('data-planner-feedback-form="true"');
  expect(markup).toContain('for="planner-feedback-type">Type</label>');
  expect(markup).toContain(
    '<option value="bug" selected="">Report a bug</option>',
  );
  expect(markup).toContain('<option value="feature">Feature request</option>');
  expect(markup).toContain('<option value="other">Other</option>');
  expect(markup).toContain('name="subject"');
  expect(markup).toContain('name="description"');
  expect(markup).toContain(
    "Paste a YouTube or image link in the description.",
  );
  expect(markup).toContain('data-sitekey="public-test-key"');
  expect(markup).toContain('data-action="turnstile-spin-v2"');
  expect(markup).toContain("Submit feedback");
  expect(markup).not.toMatch(/email|邮箱/i);
});

it("renders the Chinese feedback fields without an email input", () => {
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "public-test-key");
  const markup = renderToStaticMarkup(<PlannerFeedbackForm locale="zh" />);

  expect(markup).toContain('for="planner-feedback-type">类型</label>');
  expect(markup).toContain(
    '<option value="bug" selected="">报告问题</option>',
  );
  expect(markup).toContain('<option value="feature">功能建议</option>');
  expect(markup).toContain('<option value="other">其他</option>');
  expect(markup).toContain('for="planner-feedback-subject">主题</label>');
  expect(markup).toContain('for="planner-feedback-description">描述</label>');
  expect(markup).toContain("请把 YouTube 或图片链接粘贴到描述中。");
  expect(markup).toContain("提交反馈");
  expect(markup).not.toMatch(/email|邮箱/i);
});

it("keeps feedback inputs required and links the description hint accessibly", () => {
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "public-test-key");
  const markup = renderToStaticMarkup(<PlannerFeedbackForm locale="en" />);

  expect(markup.match(/ required=""/g)).toHaveLength(3);
  expect(markup).toContain(
    'aria-describedby="planner-feedback-description-hint"',
  );
  expect(markup).toContain('aria-live="polite"');
});

it("announces that feedback is temporarily unavailable when the public check is not configured", () => {
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
  const markup = renderToStaticMarkup(<PlannerFeedbackForm locale="en" />);

  expect(markup).toContain("Feedback is temporarily unavailable.");
  expect(markup).toContain('aria-live="polite"');
  expect(markup).toContain('role="status"');
  expect(markup).toMatch(/<button[^>]*disabled=""/);
});

it("shows the unavailable message in Chinese when the public check is not configured", () => {
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
  const markup = renderToStaticMarkup(<PlannerFeedbackForm locale="zh" />);

  expect(markup).toContain("反馈暂时无法使用。");
  expect(markup).toContain('aria-live="polite"');
  expect(markup).toContain('role="status"');
  expect(markup).toMatch(/<button[^>]*disabled=""/);
});

it("renders the Russian feedback fields without an email input", () => {
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "public-test-key");
  const markup = renderToStaticMarkup(<PlannerFeedbackForm locale="ru" />);

  expect(markup).toContain('for="planner-feedback-type">Тип</label>');
  expect(markup).toContain(
    '<option value="bug" selected="">Сообщить об ошибке</option>',
  );
  expect(markup).toContain('<option value="feature">Предложить функцию</option>');
  expect(markup).toContain('<option value="other">Другое</option>');
  expect(markup).toContain('for="planner-feedback-subject">Тема</label>');
  expect(markup).toContain('for="planner-feedback-description">Описание</label>');
  expect(markup).toContain(
    "Есть скриншот или видео? Вставьте ссылку на YouTube или изображение в описание.",
  );
  expect(markup).toContain("Отправить отзыв");
  expect(markup).not.toContain("Submit feedback");
  expect(markup).not.toContain("提交反馈");
  expect(markup).not.toMatch(/email|邮箱/i);
});

it("shows the unavailable message in Russian when the public check is not configured", () => {
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
  const markup = renderToStaticMarkup(<PlannerFeedbackForm locale="ru" />);

  expect(markup).toContain("Отзывы временно недоступны.");
  expect(markup).toContain('aria-live="polite"');
  expect(markup).toContain('role="status"');
  expect(markup).toMatch(/<button[^>]*disabled=""/);
  expect(markup).not.toContain("Feedback is temporarily unavailable.");
  expect(markup).not.toContain("反馈暂时无法使用。");
});

it("rejects a feedback locale outside en, zh, and ru and includes the value", () => {
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "public-test-key");

  expect(() =>
    renderToStaticMarkup(<PlannerFeedbackForm locale={"fr" as "en"} />),
  ).toThrow('Planner feedback locale must be "en", "zh", or "ru"; received "fr".');
});
