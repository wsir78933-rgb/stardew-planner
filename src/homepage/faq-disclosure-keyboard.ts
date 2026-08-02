export type FaqSummaryKeyboardEvent = {
  key: string;
  preventDefault: () => void;
  currentTarget: HTMLElement;
};

export function handleFaqSummaryKeyDown(
  event: FaqSummaryKeyboardEvent,
): void {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();

  const parentElement = event.currentTarget.parentElement;
  const parentTagName = parentElement?.tagName ?? "null";

  if (parentTagName !== "DETAILS") {
    throw new Error(
      `Expected FAQ summary parent tag DETAILS, received ${parentTagName}.`,
    );
  }

  const detailsElement = parentElement as HTMLDetailsElement;
  detailsElement.open = !detailsElement.open;
}
