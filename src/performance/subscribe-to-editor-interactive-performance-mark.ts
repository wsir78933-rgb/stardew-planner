const editorInteractivePerformanceMarkName = "editor:interactive";

type PerformanceObserverLike = {
  disconnect(): void;
  observe(options: { buffered: boolean; type: string }): void;
};

type PerformanceObserverLikeConstructor = new (
  callback: (list: { getEntries: () => Array<{ name: string }> }) => void,
) => PerformanceObserverLike;

export type EditorInteractivePerformanceMarkDependencies = Readonly<{
  PerformanceObserverConstructor: unknown;
  performanceTimeline: Readonly<{
    getEntriesByName(
      name: string,
      entryType?: string,
    ): ReadonlyArray<{ name: string }>;
  }>;
}>;

export function subscribeToEditorInteractivePerformanceMark(
  onEditorInteractive: () => void,
  dependencies: EditorInteractivePerformanceMarkDependencies,
): () => void {
  const { PerformanceObserverConstructor, performanceTimeline } = dependencies;

  if (
    performanceTimeline.getEntriesByName(
      editorInteractivePerformanceMarkName,
      "mark",
    ).length > 0
  ) {
    onEditorInteractive();
    return () => {};
  }

  if (typeof PerformanceObserverConstructor !== "function") {
    throw new Error(
      `PerformanceObserver must be a function to wait for ${editorInteractivePerformanceMarkName}. Received typeof PerformanceObserver: ${typeof PerformanceObserverConstructor}.`,
    );
  }

  const performanceObserver = new (PerformanceObserverConstructor as PerformanceObserverLikeConstructor)(
    (performanceObserverEntryList) => {
      const hasEditorInteractiveMark = performanceObserverEntryList
        .getEntries()
        .some(
          (performanceEntry) =>
            performanceEntry.name === editorInteractivePerformanceMarkName,
        );

      if (!hasEditorInteractiveMark) {
        return;
      }

      performanceObserver.disconnect();
      onEditorInteractive();
    },
  );

  performanceObserver.observe({
    buffered: true,
    type: "mark",
  });

  return () => {
    performanceObserver.disconnect();
  };
}
