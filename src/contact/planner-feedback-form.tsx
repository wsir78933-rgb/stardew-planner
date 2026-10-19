"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  plannerFeedbackLimits,
  validatePlannerFeedbackFields,
  validatePlannerFeedbackRequest,
  type PlannerFeedbackFields,
  type PlannerFeedbackType,
  type PlannerFeedbackValidationField,
  type PlannerFeedbackValidationIssue,
} from "./planner-feedback-request-validation";
import styles from "./planner-feedback-form.module.css";

type PlannerFeedbackLocale = "en" | "zh" | "ru";

type PlannerFeedbackFormProperties = Readonly<{
  locale: PlannerFeedbackLocale;
}>;

type TurnstileApi = Readonly<{
  render: (
    container: HTMLElement,
    options: Readonly<{
      sitekey: string;
      action: "turnstile-spin-v2";
      appearance: "interaction-only";
      execution: "execute";
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
    }>,
  ) => string;
  execute: (widgetId: string) => void;
  reset: (widgetId: string) => void;
}>;

type PlannerFeedbackSubmissionState = Readonly<{
  kind:
    | "idle"
    | "verifying"
    | "submitting"
    | "success"
    | "error"
    | "unavailable";
  message: string;
}>;

const initialPlannerFeedbackFields: PlannerFeedbackFields = {
  type: "bug",
  subject: "",
  description: "",
};

const turnstileScriptId = "cloudflare-turnstile-script";

const plannerFeedbackCopy = {
  en: {
    typeLabel: "Type",
    typeOptions: {
      bug: "Report a bug",
      feature: "Feature request",
      other: "Other",
    },
    subjectLabel: "Subject",
    descriptionLabel: "Description",
    descriptionHint:
      "Have a screenshot or video? Paste a YouTube or image link in the description.",
    submitLabel: "Submit feedback",
    submittingLabel: "Submitting…",
    verifyingLabel: "Verifying…",
    successMessage: "Thanks — your feedback has been sent.",
    unavailableConfigurationMessage: "Feedback is temporarily unavailable.",
    unavailableMessage: "We could not send your feedback. Please try again later.",
    verificationLoadingMessage:
      "The spam check is still loading. Please try again in a moment.",
    verificationFailedMessage:
      "The spam check could not be completed. Please submit again.",
    invalidResponseMessage:
      "The feedback could not be accepted. Check the fields and try again.",
    fieldMessages: {
      form: "The submitted form is invalid.",
      expectedObject: "Expected a feedback form.",
      unexpectedField: "Unexpected field: {value}.",
      missingField: "This field is required.",
      invalidType: "Expected text; received {value}.",
      unsupportedOption: "Choose bug, feature, or other; received {value}.",
      empty: "This field cannot be blank.",
      tooLong: "This field is too long ({value}; limit {limit}).",
      lineBreak: "Enter a single-line subject; received {value}.",
      invalidToken: "The spam check token is missing or invalid.",
    },
  },
  zh: {
    typeLabel: "类型",
    typeOptions: {
      bug: "报告问题",
      feature: "功能建议",
      other: "其他",
    },
    subjectLabel: "主题",
    descriptionLabel: "描述",
    descriptionHint: "有截图或视频？请把 YouTube 或图片链接粘贴到描述中。",
    submitLabel: "提交反馈",
    submittingLabel: "正在提交…",
    verifyingLabel: "正在验证…",
    successMessage: "感谢反馈，已经发送成功。",
    unavailableConfigurationMessage: "反馈暂时无法使用。",
    unavailableMessage: "暂时无法发送反馈，请稍后重试。",
    verificationLoadingMessage: "反垃圾验证仍在加载，请稍后重试。",
    verificationFailedMessage: "反垃圾验证未完成，请重新提交。",
    invalidResponseMessage: "反馈未能提交，请检查表单内容后重试。",
    fieldMessages: {
      form: "提交的表单无效。",
      expectedObject: "请提交反馈表单。",
      unexpectedField: "不支持的字段：{value}。",
      missingField: "此项为必填。",
      invalidType: "需要文本，收到的是 {value}。",
      unsupportedOption: "请选择问题报告、功能建议或其他；当前值为 {value}。",
      empty: "此项不能为空。",
      tooLong: "内容过长（{value}，上限 {limit}）。",
      lineBreak: "主题只能填写一行；当前值包含 {value}。",
      invalidToken: "反垃圾验证令牌缺失或无效。",
    },
  },
  ru: {
    typeLabel: "Тип",
    typeOptions: {
      bug: "Сообщить об ошибке",
      feature: "Предложить функцию",
      other: "Другое",
    },
    subjectLabel: "Тема",
    descriptionLabel: "Описание",
    descriptionHint:
      "Есть скриншот или видео? Вставьте ссылку на YouTube или изображение в описание.",
    submitLabel: "Отправить отзыв",
    submittingLabel: "Отправка…",
    verifyingLabel: "Проверка…",
    successMessage: "Спасибо, отзыв отправлен.",
    unavailableConfigurationMessage: "Отзывы временно недоступны.",
    unavailableMessage: "Не удалось отправить отзыв. Повторите попытку позже.",
    verificationLoadingMessage:
      "Проверка на спам ещё загружается. Повторите попытку через мгновение.",
    verificationFailedMessage:
      "Проверку на спам не удалось завершить. Отправьте форму ещё раз.",
    invalidResponseMessage:
      "Отзыв не принят. Проверьте поля и повторите попытку.",
    fieldMessages: {
      form: "Отправленная форма недействительна.",
      expectedObject: "Ожидалась форма отзыва.",
      unexpectedField: "Неподдерживаемое поле: {value}.",
      missingField: "Это поле обязательно.",
      invalidType: "Ожидался текст; получено {value}.",
      unsupportedOption: "Выберите ошибку, предложение или другое; получено {value}.",
      empty: "Это поле не может быть пустым.",
      tooLong: "Поле слишком длинное ({value}; предел {limit}).",
      lineBreak: "Тема должна быть одной строкой; получено {value}.",
      invalidToken: "Токен проверки на спам отсутствует или недействителен.",
    },
  },
} as const;

function readPlannerFeedbackLocale(locale: string): PlannerFeedbackLocale {
  if (locale === "en" || locale === "zh" || locale === "ru") {
    return locale;
  }

  throw new TypeError(
    `Planner feedback locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function getWindowTurnstile(): TurnstileApi | undefined {
  return (window as Window & { turnstile?: TurnstileApi }).turnstile;
}

function getPlannerFeedbackValidationMessage(
  issue: PlannerFeedbackValidationIssue,
  locale: PlannerFeedbackLocale,
): string {
  const messages = plannerFeedbackCopy[locale].fieldMessages;
  const messageTemplate = messages[issue.code];
  const value = issue.actualValue ?? "";
  const limit =
    issue.field === "subject"
      ? String(plannerFeedbackLimits.subject)
      : issue.field === "description"
        ? String(plannerFeedbackLimits.description)
        : String(plannerFeedbackLimits.turnstileToken);

  return messageTemplate
    .replace("{value}", value)
    .replace("{limit}", limit);
}

function getPlannerFeedbackIssueForField(
  issues: readonly PlannerFeedbackValidationIssue[],
  field: PlannerFeedbackValidationField,
): PlannerFeedbackValidationIssue | undefined {
  return issues.find((issue) => issue.field === field);
}

export function PlannerFeedbackForm({
  locale,
}: PlannerFeedbackFormProperties) {
  const feedbackLocale = readPlannerFeedbackLocale(locale);
  const copy = plannerFeedbackCopy[feedbackLocale];
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const [feedbackFields, setFeedbackFields] = useState<PlannerFeedbackFields>(
    initialPlannerFeedbackFields,
  );
  const [validationIssues, setValidationIssues] = useState<
    readonly PlannerFeedbackValidationIssue[]
  >([]);
  const [submissionState, setSubmissionState] =
    useState<PlannerFeedbackSubmissionState>({ kind: "idle", message: "" });
  const visibleSubmissionState = siteKey
    ? submissionState
    : {
        kind: "unavailable" as const,
        message: copy.unavailableConfigurationMessage,
      };
  const formReference = useRef<HTMLFormElement>(null);
  const turnstileContainerReference = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdReference = useRef<string | undefined>(undefined);
  const submitVerifiedFeedbackReference = useRef<(token: string) => void>(() => {
    throw new Error("Turnstile returned a token before feedback submission was ready.");
  });

  const submitPlannerFeedback = useCallback(
    async (turnstileToken: string) => {
      const requestValidation = validatePlannerFeedbackRequest({
        ...feedbackFields,
        turnstileToken,
      });
      if (!requestValidation.valid) {
        setValidationIssues(requestValidation.issues);
        setSubmissionState({ kind: "error", message: copy.invalidResponseMessage });
        return;
      }

      setValidationIssues([]);
      setSubmissionState({ kind: "submitting", message: copy.submittingLabel });

      let response: Response;
      try {
        response = await fetch("/api/feedback", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(requestValidation.value),
        });
      } catch {
        setSubmissionState({ kind: "error", message: copy.unavailableMessage });
        return;
      } finally {
        const widgetId = turnstileWidgetIdReference.current;
        const turnstile = getWindowTurnstile();
        if (widgetId && turnstile) {
          turnstile.reset(widgetId);
        }
      }

      if (response.status === 403) {
        setSubmissionState({
          kind: "error",
          message: copy.verificationFailedMessage,
        });
        return;
      }

      if (response.status === 400) {
        setSubmissionState({
          kind: "error",
          message: copy.invalidResponseMessage,
        });
        return;
      }

      if (!response.ok) {
        setSubmissionState({ kind: "error", message: copy.unavailableMessage });
        return;
      }

      setFeedbackFields(initialPlannerFeedbackFields);
      setSubmissionState({ kind: "success", message: copy.successMessage });
    },
    [copy, feedbackFields],
  );

  useEffect(() => {
    submitVerifiedFeedbackReference.current = (token) => {
      void submitPlannerFeedback(token);
    };
  }, [submitPlannerFeedback]);

  useEffect(() => {
    const firstFieldIssue = validationIssues.find(
      (issue) => issue.field !== "form" && issue.field !== "turnstileToken",
    );
    if (!firstFieldIssue) {
      return;
    }

    const fieldControl = formReference.current?.elements.namedItem(
      firstFieldIssue.field,
    );
    if (fieldControl instanceof HTMLElement) {
      fieldControl.focus();
    }
  }, [validationIssues]);

  useEffect(() => {
    const turnstileContainer = turnstileContainerReference.current;
    if (!siteKey || !turnstileContainer) {
      return;
    }

    const renderTurnstile = () => {
      const turnstile = getWindowTurnstile();
      if (!turnstile || turnstileWidgetIdReference.current) {
        return;
      }

      turnstileWidgetIdReference.current = turnstile.render(turnstileContainer, {
        sitekey: siteKey,
        action: "turnstile-spin-v2",
        appearance: "interaction-only",
        execution: "execute",
        callback: (token) => submitVerifiedFeedbackReference.current(token),
        "error-callback": () => {
          setSubmissionState({ kind: "error", message: copy.verificationFailedMessage });
        },
        "expired-callback": () => {
          setSubmissionState({ kind: "error", message: copy.verificationFailedMessage });
        },
      });
    };

    if (getWindowTurnstile()) {
      renderTurnstile();
      return;
    }

    const existingScript = document.getElementById(
      turnstileScriptId,
    ) as HTMLScriptElement | null;
    const turnstileScript = existingScript ?? document.createElement("script");
    turnstileScript.id = turnstileScriptId;
    turnstileScript.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    turnstileScript.async = true;
    turnstileScript.defer = true;
    turnstileScript.addEventListener("load", renderTurnstile);

    if (!existingScript) {
      document.head.append(turnstileScript);
    }

    return () => {
      turnstileScript.removeEventListener("load", renderTurnstile);
    };
  }, [copy.verificationFailedMessage, siteKey]);

  function updatePlannerFeedbackField(
    field: keyof PlannerFeedbackFields,
    value: string,
  ) {
    setFeedbackFields((currentFields) => ({ ...currentFields, [field]: value }));
    setValidationIssues((currentIssues) =>
      currentIssues.filter((issue) => issue.field !== field && issue.field !== "form"),
    );
    setSubmissionState({ kind: "idle", message: "" });
  }

  function submitPlannerFeedbackForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fieldsValidation = validatePlannerFeedbackFields(feedbackFields);
    if (!fieldsValidation.valid) {
      setValidationIssues(fieldsValidation.issues);
      setSubmissionState({ kind: "error", message: copy.invalidResponseMessage });
      return;
    }

    setValidationIssues([]);
    if (!siteKey) {
      return;
    }

    const widgetId = turnstileWidgetIdReference.current;
    const turnstile = getWindowTurnstile();
    if (!widgetId || !turnstile) {
      setSubmissionState({
        kind: "error",
        message: copy.verificationLoadingMessage,
      });
      return;
    }

    setSubmissionState({ kind: "verifying", message: copy.verifyingLabel });
    turnstile.execute(widgetId);
  }

  const isSubmitting =
    visibleSubmissionState.kind === "verifying" ||
    visibleSubmissionState.kind === "submitting";
  const typeIssue = getPlannerFeedbackIssueForField(validationIssues, "type");
  const subjectIssue = getPlannerFeedbackIssueForField(validationIssues, "subject");
  const descriptionIssue = getPlannerFeedbackIssueForField(
    validationIssues,
    "description",
  );
  const formIssue = getPlannerFeedbackIssueForField(validationIssues, "form");
  const fieldStatusRole =
    visibleSubmissionState.kind === "error" ? "alert" : "status";

  return (
    <form
      className={styles.form}
      data-planner-feedback-form="true"
      onSubmit={submitPlannerFeedbackForm}
      aria-busy={isSubmitting}
      noValidate
      ref={formReference}
    >
      <div className={styles.field}>
        <label className={styles.label} htmlFor="planner-feedback-type">
          {copy.typeLabel}
        </label>
        <select
          aria-describedby={
            typeIssue ? "planner-feedback-type-error" : undefined
          }
          aria-invalid={typeIssue ? "true" : "false"}
          className={styles.control}
          id="planner-feedback-type"
          name="type"
          onChange={(event) =>
            updatePlannerFeedbackField("type", event.target.value as PlannerFeedbackType)
          }
          required
          value={feedbackFields.type}
        >
          <option value="bug">{copy.typeOptions.bug}</option>
          <option value="feature">{copy.typeOptions.feature}</option>
          <option value="other">{copy.typeOptions.other}</option>
        </select>
        {typeIssue ? (
          <p className={styles.fieldError} id="planner-feedback-type-error">
            {getPlannerFeedbackValidationMessage(typeIssue, feedbackLocale)}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="planner-feedback-subject">
          {copy.subjectLabel}
        </label>
        <input
          aria-describedby={
            subjectIssue ? "planner-feedback-subject-error" : undefined
          }
          aria-invalid={subjectIssue ? "true" : "false"}
          className={styles.control}
          id="planner-feedback-subject"
          maxLength={plannerFeedbackLimits.subject}
          name="subject"
          onChange={(event) => updatePlannerFeedbackField("subject", event.target.value)}
          required
          type="text"
          value={feedbackFields.subject}
        />
        {subjectIssue ? (
          <p className={styles.fieldError} id="planner-feedback-subject-error">
            {getPlannerFeedbackValidationMessage(subjectIssue, feedbackLocale)}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="planner-feedback-description">
          {copy.descriptionLabel}
        </label>
        <textarea
          aria-describedby={
            descriptionIssue
              ? "planner-feedback-description-error planner-feedback-description-hint"
              : "planner-feedback-description-hint"
          }
          aria-invalid={descriptionIssue ? "true" : "false"}
          className={`${styles.control} ${styles.description}`}
          id="planner-feedback-description"
          maxLength={plannerFeedbackLimits.description}
          name="description"
          onChange={(event) =>
            updatePlannerFeedbackField("description", event.target.value)
          }
          required
          rows={6}
          value={feedbackFields.description}
        />
        {descriptionIssue ? (
          <p
            className={styles.fieldError}
            id="planner-feedback-description-error"
          >
            {getPlannerFeedbackValidationMessage(descriptionIssue, feedbackLocale)}
          </p>
        ) : null}
        <p className={styles.hint} id="planner-feedback-description-hint">
          {copy.descriptionHint}
        </p>
      </div>

      <div
        className={styles.turnstileContainer}
        data-action="turnstile-spin-v2"
        data-sitekey={siteKey}
        ref={turnstileContainerReference}
      />

      <div className={styles.actions}>
        <button
          className={styles.submit}
          disabled={isSubmitting || !siteKey}
          type="submit"
        >
          {submissionState.kind === "verifying"
            ? copy.verifyingLabel
            : isSubmitting
              ? copy.submittingLabel
              : copy.submitLabel}
        </button>
        <p
          aria-live={
            visibleSubmissionState.kind === "error" ? "assertive" : "polite"
          }
          className={
            visibleSubmissionState.kind === "success"
              ? styles.successMessage
              : visibleSubmissionState.kind === "error" ||
                  visibleSubmissionState.kind === "unavailable"
                ? styles.statusError
                : styles.statusMessage
          }
          role={fieldStatusRole}
        >
          {formIssue
            ? getPlannerFeedbackValidationMessage(formIssue, feedbackLocale)
            : visibleSubmissionState.message}
        </p>
      </div>
    </form>
  );
}
