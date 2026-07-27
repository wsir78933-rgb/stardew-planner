export type ReferenceViewport = "desktop" | "mobile";

export type ReferenceToolMode =
  | "cursor"
  | "fill"
  | "eraser"
  | "multi-select"
  | null;

export type ReferenceState = {
  id: string;
  action: string;
  expectedVisibleResult: string;
  viewport: ReferenceViewport;
  toolMode: ReferenceToolMode;
  selectedEntity: string | null;
  modalState: string | null;
};

export type ReferenceRoute = {
  id: string;
  path: string;
  viewport: readonly ReferenceViewport[];
  states: readonly ReferenceState[];
  acceptancePurpose: string;
};
