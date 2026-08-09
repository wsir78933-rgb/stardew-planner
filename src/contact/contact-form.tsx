"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  validateContactRequest,
  type ContactRequest,
} from "./contact-request-validation";
import type { ContactPageCopy } from "./contact-page-copy";

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

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type SubmissionState =
  | Readonly<{ kind: "idle"; message: "" }>
  | Readonly<{ kind: "submitting" | "success" | "error"; message: string }>;

type ContactFormProperties = Readonly<{
  contactCopy: ContactPageCopy;
  turnstileSiteKey?: string;
}>;

const emptyContactRequest: Omit<ContactRequest, "turnstileToken"> = {
  name: "",
  email: "",
  message: "",
};

const turnstileScriptId = "cloudflare-turnstile-script";

function SendMessageIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path d="m21 3-7.4 18-3.7-7.3L3 10l18-7Z" />
      <path d="m9.9 13.7 4.2-4.2" />
    </svg>
  );
}

function isSubmissionError(response: Response): boolean {
  return !response.ok;
}

export function ContactForm({
  contactCopy,
  turnstileSiteKey,
}: ContactFormProperties) {
  const siteKey = turnstileSiteKey ?? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const [contactRequest, setContactRequest] = useState(emptyContactRequest);
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    kind: "idle",
    message: "",
  });
  const turnstileContainerReference = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdReference = useRef<string | undefined>(undefined);
  const submitVerifiedContactRequestReference = useRef<(token: string) => void>(
    () => undefined,
  );

  const submitVerifiedContactRequest = useCallback(
    async (turnstileToken: string) => {
      const validationResult = validateContactRequest({
        ...contactRequest,
        turnstileToken,
      });

      if (!validationResult.valid) {
        setSubmissionState({ kind: "error", message: contactCopy.invalidMessage });
        return;
      }

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(validationResult.value),
        });

        if (isSubmissionError(response)) {
          setSubmissionState({ kind: "error", message: contactCopy.unavailableMessage });
          return;
        }

        setContactRequest(emptyContactRequest);
        setSubmissionState({ kind: "success", message: contactCopy.successMessage });
      } catch {
        setSubmissionState({ kind: "error", message: contactCopy.unavailableMessage });
      } finally {
        const widgetId = turnstileWidgetIdReference.current;
        if (widgetId && window.turnstile) {
          window.turnstile.reset(widgetId);
        }
      }
    },
    [contactCopy, contactRequest],
  );

  useEffect(() => {
    submitVerifiedContactRequestReference.current = (turnstileToken) => {
      void submitVerifiedContactRequest(turnstileToken);
    };
  }, [submitVerifiedContactRequest]);

  useEffect(() => {
    const turnstileContainer = turnstileContainerReference.current;
    if (!siteKey || !turnstileContainer) {
      return;
    }

    const renderTurnstile = () => {
      if (!window.turnstile || turnstileWidgetIdReference.current) {
        return;
      }

      turnstileWidgetIdReference.current = window.turnstile.render(
        turnstileContainer,
        {
          sitekey: siteKey,
          action: "turnstile-spin-v2",
          appearance: "interaction-only",
          execution: "execute",
          callback: (turnstileToken) => {
            submitVerifiedContactRequestReference.current(turnstileToken);
          },
          "error-callback": () => {
            setSubmissionState({
              kind: "error",
              message: contactCopy.verificationFailedMessage,
            });
          },
          "expired-callback": () => {
            setSubmissionState({ kind: "idle", message: "" });
          },
        },
      );
    };

    if (window.turnstile) {
      renderTurnstile();
      return;
    }

    const existingScript = document.getElementById(
      turnstileScriptId,
    ) as HTMLScriptElement | null;
    const turnstileScript = existingScript ?? document.createElement("script");
    turnstileScript.id = turnstileScriptId;
    turnstileScript.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    turnstileScript.async = true;
    turnstileScript.defer = true;
    turnstileScript.addEventListener("load", renderTurnstile);

    if (!existingScript) {
      document.head.append(turnstileScript);
    }

    return () => {
      turnstileScript.removeEventListener("load", renderTurnstile);
    };
  }, [contactCopy, siteKey]);

  function updateContactRequest(
    fieldName: keyof typeof emptyContactRequest,
    fieldValue: string,
  ) {
    setContactRequest((currentContactRequest) => ({
      ...currentContactRequest,
      [fieldName]: fieldValue,
    }));
  }

  function submitContactRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!siteKey) {
      setSubmissionState({
        kind: "error",
        message: contactCopy.unavailableMessage,
      });
      return;
    }

    const turnstileWidgetId = turnstileWidgetIdReference.current;
    if (!turnstileWidgetId || !window.turnstile) {
      setSubmissionState({
        kind: "error",
        message: contactCopy.verificationLoadingMessage,
      });
      return;
    }

    setSubmissionState({
      kind: "submitting",
      message: contactCopy.submittingLabel,
    });
    window.turnstile.execute(turnstileWidgetId);
  }

  const isSubmitting = submissionState.kind === "submitting";

  return (
    <form
      className="contact-form"
      data-contact-form="true"
      onSubmit={submitContactRequest}
      aria-busy={isSubmitting}
    >
      <div className="contact-form-name-email">
        <div className="contact-form-field">
          <label htmlFor="contact-name">{contactCopy.nameLabel}</label>
          <input
            autoComplete="name"
            id="contact-name"
            maxLength={100}
            name="name"
            onChange={(event) => updateContactRequest("name", event.target.value)}
            placeholder={contactCopy.namePlaceholder}
            required
            type="text"
            value={contactRequest.name}
          />
        </div>
        <div className="contact-form-field">
          <label htmlFor="contact-email">{contactCopy.emailLabel}</label>
          <input
            autoComplete="email"
            id="contact-email"
            maxLength={254}
            name="email"
            onChange={(event) => updateContactRequest("email", event.target.value)}
            placeholder={contactCopy.emailPlaceholder}
            required
            type="email"
            value={contactRequest.email}
          />
        </div>
      </div>
      <div className="contact-form-field">
        <label htmlFor="contact-message">{contactCopy.messageLabel}</label>
        <textarea
          id="contact-message"
          maxLength={2_000}
          name="message"
          onChange={(event) => updateContactRequest("message", event.target.value)}
          placeholder={contactCopy.messagePlaceholder}
          required
          rows={6}
          value={contactRequest.message}
        />
      </div>
      <div
        className="contact-form-turnstile cf-turnstile"
        data-action="turnstile-spin-v2"
        data-sitekey={siteKey}
        ref={turnstileContainerReference}
      />
      <div className="contact-form-actions">
        <button
          className="contact-form-submit"
          disabled={isSubmitting || !siteKey}
          type="submit"
        >
          <SendMessageIcon />
          <span>{isSubmitting ? contactCopy.submittingLabel : contactCopy.submitLabel}</span>
        </button>
        <p aria-live="polite" className={`contact-form-status contact-form-status--${submissionState.kind}`}>
          {submissionState.message}
        </p>
      </div>
      <p className="contact-form-privacy-notice">{contactCopy.privacyNotice}</p>
    </form>
  );
}
