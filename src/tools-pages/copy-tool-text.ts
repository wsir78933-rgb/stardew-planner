export async function copyToolText(text: string): Promise<void> {
  if (text.length === 0) {
    throw new Error(`Clipboard text must not be empty. Received: ${JSON.stringify(text)}.`);
  }

  if (typeof navigator === "undefined" || navigator.clipboard?.writeText === undefined) {
    throw new Error("Clipboard write failed. Received: \"clipboard-unavailable\".");
  }

  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const received = error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`Clipboard write failed. Received: ${received}.`);
  }
}
