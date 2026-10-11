import type { ReactNode } from "react";
import { afterEach, expect, it, vi } from "vitest";

const reactHookHarness = vi.hoisted(() => ({
  stateSlots: [] as unknown[],
  referenceSlots: [] as Array<{ current: unknown }>,
  pendingEffects: [] as Array<
    | (() => void | (() => void))
    | undefined
  >,
  stateCursor: 0,
  referenceCursor: 0,
  effectCursor: 0,
  beginRender() {
    this.stateCursor = 0;
    this.referenceCursor = 0;
    this.effectCursor = 0;
    this.pendingEffects = [];
  },
  flushEffects() {
    this.pendingEffects.forEach((pendingEffect) => pendingEffect?.());
  },
  reset() {
    this.stateSlots = [];
    this.referenceSlots = [];
    this.pendingEffects = [];
    this.stateCursor = 0;
    this.referenceCursor = 0;
    this.effectCursor = 0;
  },
}));

vi.mock("react", async (importOriginal) => {
  const reactExports = await importOriginal<typeof import("react")>();

  return {
    ...reactExports,
    useCallback: (callback: (...arguments_: never[]) => unknown) => callback,
    useEffect: (
      effect: () => void | (() => void),
      _dependencies: readonly unknown[] = [],
    ) => {
      reactHookHarness.pendingEffects[reactHookHarness.effectCursor++] = effect;
    },
    useRef: <ReferenceValue,>(initialValue: ReferenceValue) => {
      const referenceIndex = reactHookHarness.referenceCursor++;
      if (!reactHookHarness.referenceSlots[referenceIndex]) {
        reactHookHarness.referenceSlots[referenceIndex] = { current: initialValue };
      }
      return reactHookHarness.referenceSlots[referenceIndex] as {
        current: ReferenceValue;
      };
    },
    useState: <StateValue,>(initialValue: StateValue | (() => StateValue)) => {
      const stateIndex = reactHookHarness.stateCursor++;
      if (reactHookHarness.stateSlots[stateIndex] === undefined) {
        reactHookHarness.stateSlots[stateIndex] =
          typeof initialValue === "function"
            ? (initialValue as () => StateValue)()
            : initialValue;
      }

      const setState = (
        nextValue: StateValue | ((currentValue: StateValue) => StateValue),
      ) => {
        const currentValue = reactHookHarness.stateSlots[stateIndex] as StateValue;
        reactHookHarness.stateSlots[stateIndex] =
          typeof nextValue === "function"
            ? (nextValue as (currentValue: StateValue) => StateValue)(currentValue)
            : nextValue;
      };

      return [reactHookHarness.stateSlots[stateIndex] as StateValue, setState] as const;
    },
  };
});

import * as React from "react";
import { PlannerFeedbackForm } from "../../src/contact/planner-feedback-form";

type TurnstileRenderOptions = Readonly<{
  callback: (token: string) => void;
  "error-callback": () => void;
  "expired-callback": () => void;
}>;

type RenderedElement = React.ReactElement<Record<string, unknown>>;
type FeedbackFormTree = ReturnType<typeof PlannerFeedbackForm>;

function createTurnstileMock() {
  let renderOptions: TurnstileRenderOptions | undefined;
  return {
    api: {
      render: vi.fn((_container: HTMLElement, options: TurnstileRenderOptions) => {
        renderOptions = options;
        return "planner-feedback-widget";
      }),
      execute: vi.fn(),
      reset: vi.fn(),
    },
    submitToken(token: string) {
      if (!renderOptions) {
        throw new Error("Turnstile render options were not registered.");
      }
      renderOptions.callback(token);
    },
  };
}

function findElement(
  node: ReactNode,
  elementType: string,
  matches: (properties: Record<string, unknown>) => boolean = () => true,
): RenderedElement | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const foundElement = findElement(child, elementType, matches);
      if (foundElement) return foundElement;
    }
    return undefined;
  }

  if (!React.isValidElement(node)) return undefined;

  const renderedElement = node as RenderedElement;
  if (
    renderedElement.type === elementType &&
    matches(renderedElement.props)
  ) {
    return renderedElement;
  }

  return findElement(renderedElement.props.children as ReactNode, elementType, matches);
}

function requireElement(
  tree: ReactNode,
  elementType: string,
  matches?: (properties: Record<string, unknown>) => boolean,
): RenderedElement {
  const foundElement = findElement(tree, elementType, matches);
  if (!foundElement) {
    throw new Error(`Expected to find a ${elementType} element in the feedback form.`);
  }
  return foundElement;
}

function mountFeedbackForm(locale: "en" | "zh" = "en") {
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "public-test-key");
  const turnstileMock = createTurnstileMock();
  vi.stubGlobal("window", { turnstile: turnstileMock.api });
  class FocusableFeedbackField {
    focus = vi.fn();
  }
  const firstInvalidFeedbackField = new FocusableFeedbackField();
  vi.stubGlobal("HTMLElement", FocusableFeedbackField);
  const feedbackFormNode = {
    elements: {
      namedItem: () => firstInvalidFeedbackField,
    },
  };

  function render(): FeedbackFormTree {
    reactHookHarness.beginRender();
    const tree = PlannerFeedbackForm({ locale });
    reactHookHarness.referenceSlots[0].current = feedbackFormNode;
    reactHookHarness.referenceSlots[1].current = {};
    reactHookHarness.flushEffects();
    return tree;
  }

  reactHookHarness.reset();
  const tree = render();
  return { render, tree, turnstileMock, firstInvalidFeedbackField };
}

function changeField(
  tree: FeedbackFormTree,
  fieldName: "type" | "subject" | "description",
  value: string,
  render: () => FeedbackFormTree,
): FeedbackFormTree {
  const fieldElement = requireElement(
    tree,
    fieldName === "description" ? "textarea" : fieldName === "type" ? "select" : "input",
    (properties) => properties.name === fieldName,
  );
  const onChange = fieldElement.props.onChange as (
    event: { target: { value: string } },
  ) => void;
  onChange({ target: { value } });
  return render();
}

function submitForm(tree: FeedbackFormTree) {
  const formElement = requireElement(tree, "form");
  const onSubmit = formElement.props.onSubmit as (event: {
    preventDefault: () => void;
  }) => void;
  onSubmit({ preventDefault: vi.fn() });
}

function fillRequiredFields(
  tree: FeedbackFormTree,
  render: () => FeedbackFormTree,
  type = "bug",
): FeedbackFormTree {
  let currentTree = changeField(tree, "type", type, render);
  currentTree = changeField(currentTree, "subject", "A feedback subject", render);
  return changeField(currentTree, "description", "A feedback description", render);
}

function textContent(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textContent).join("");
  if (React.isValidElement(node)) {
    return textContent((node as RenderedElement).props.children as ReactNode);
  }
  return "";
}

async function flushPendingPromiseCallbacks() {
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
}

afterEach(() => {
  reactHookHarness.reset();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

it("shows field errors and does not submit when required fields are empty", () => {
  const { render, tree, firstInvalidFeedbackField } = mountFeedbackForm();
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);

  submitForm(tree);
  const renderedTree = render();

  expect(fetchMock).not.toHaveBeenCalled();
  expect(
    requireElement(renderedTree, "input", (properties) => properties.name === "subject")
      .props["aria-invalid"],
  ).toBe("true");
  expect(
    requireElement(renderedTree, "textarea", (properties) => properties.name === "description")
      .props["aria-invalid"],
  ).toBe("true");
  expect(firstInvalidFeedbackField.focus).toHaveBeenCalledOnce();
  expect(
    textContent(
      requireElement(
        renderedTree,
        "p",
        (properties) => properties.id === "planner-feedback-subject-error",
      ),
    ),
  ).toContain("cannot be blank");
  expect(
    textContent(
      requireElement(
        renderedTree,
        "p",
        (properties) => properties.id === "planner-feedback-description-error",
      ),
    ),
  ).toContain("cannot be blank");
});

it("disables submission while verifying and sending, then reports a non-success response", async () => {
  const { render, turnstileMock } = mountFeedbackForm();
  let tree = render();
  tree = fillRequiredFields(tree, render, "feature");
  let resolveFeedbackResponse: ((response: Response) => void) | undefined;
  const fetchMock = vi.fn(
    (_resource: RequestInfo | URL, _requestOptions?: RequestInit) =>
      new Promise<Response>((resolve) => {
        resolveFeedbackResponse = resolve;
      }),
  );
  vi.stubGlobal("fetch", fetchMock);

  submitForm(tree);
  tree = render();
  const verificationButton = requireElement(tree, "button");
  expect(verificationButton.props.disabled).toBe(true);
  expect(textContent(verificationButton.props.children as ReactNode)).toBe("Verifying…");
  expect(turnstileMock.api.execute).toHaveBeenCalledWith("planner-feedback-widget");

  turnstileMock.submitToken("mock-turnstile-token");
  tree = render();
  const submissionButton = requireElement(tree, "button");
  expect(submissionButton.props.disabled).toBe(true);
  expect(textContent(submissionButton.props.children as ReactNode)).toBe("Submitting…");
  expect(fetchMock).toHaveBeenCalledOnce();
  const feedbackRequestOptions = fetchMock.mock.calls[0]?.[1];
  if (!feedbackRequestOptions) {
    throw new Error("The feedback request did not include request options.");
  }
  expect(JSON.parse(String(feedbackRequestOptions.body))).toMatchObject({
    type: "feature",
    subject: "A feedback subject",
  });

  if (!resolveFeedbackResponse) {
    throw new Error("The feedback request did not expose its response resolver.");
  }
  resolveFeedbackResponse(new Response(null, { status: 500 }));
  await flushPendingPromiseCallbacks();
  tree = render();

  expect(textContent(requireElement(tree, "p", (properties) => properties.role === "alert")))
    .toContain("could not send your feedback");
  expect(turnstileMock.api.reset).toHaveBeenCalledWith("planner-feedback-widget");
});

it("reports a network rejection without exposing its error and remains retryable", async () => {
  const { render, turnstileMock } = mountFeedbackForm();
  let tree = render();
  tree = fillRequiredFields(tree, render);
  const fetchMock = vi.fn().mockRejectedValue(new TypeError("private network detail"));
  vi.stubGlobal("fetch", fetchMock);

  submitForm(tree);
  render();
  turnstileMock.submitToken("mock-turnstile-token");
  await flushPendingPromiseCallbacks();
  tree = render();

  const failureMessage = textContent(
    requireElement(tree, "p", (properties) => properties.role === "alert"),
  );
  expect(failureMessage).toContain("could not send your feedback");
  expect(failureMessage).not.toContain("private network detail");
  expect(requireElement(tree, "button").props.disabled).toBe(false);
  expect(turnstileMock.api.reset).toHaveBeenCalledWith("planner-feedback-widget");
});

it("clears submitted fields and resets the challenge after success", async () => {
  const { render, turnstileMock } = mountFeedbackForm();
  let tree = render();
  tree = fillRequiredFields(tree, render, "other");
  const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);

  submitForm(tree);
  render();
  turnstileMock.submitToken("mock-turnstile-token");
  await flushPendingPromiseCallbacks();
  tree = render();

  expect(requireElement(tree, "select", (properties) => properties.name === "type").props.value)
    .toBe("bug");
  expect(requireElement(tree, "input", (properties) => properties.name === "subject").props.value)
    .toBe("");
  expect(requireElement(tree, "textarea", (properties) => properties.name === "description").props.value)
    .toBe("");
  expect(textContent(requireElement(tree, "p", (properties) => properties.role === "status")))
    .toContain("Thanks — your feedback has been sent.");
  expect(turnstileMock.api.reset).toHaveBeenCalledWith("planner-feedback-widget");
});
