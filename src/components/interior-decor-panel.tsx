"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  interiorFlooringPatterns,
  interiorWallpaperPatterns,
  isInteriorDecorSupportedMapId,
  type InteriorDecorCatalogPattern,
} from "../interior-decor/interior-decor-catalog";
import type { InteriorDecorKind } from "../interior-decor/interior-decor-state";

type InteriorDecorPanelProperties = Readonly<{
  mapId: string;
  selectedPattern: InteriorDecorCatalogPattern | null;
  onPatternSelect: (pattern: InteriorDecorCatalogPattern | null) => void;
}>;

const patternsByKind: Readonly<
  Record<InteriorDecorKind, readonly InteriorDecorCatalogPattern[]>
> = {
  wallpaper: interiorWallpaperPatterns,
  flooring: interiorFlooringPatterns,
};

const interiorDecorKindLabels: Readonly<Record<InteriorDecorKind, string>> = {
  wallpaper: "Wallpapers",
  flooring: "Flooring",
};
const interiorDecorKinds = ["wallpaper", "flooring"] as const;

export function getNextInteriorDecorKind(
  currentKind: InteriorDecorKind,
  keyboardKey: string,
): InteriorDecorKind | null {
  const currentKindIndex = interiorDecorKinds.indexOf(currentKind);

  if (currentKindIndex === -1) {
    throw new Error(
      `Interior decor kind \"${currentKind}\" is not a supported tab kind.`,
    );
  }

  if (keyboardKey === "Home") {
    return interiorDecorKinds[0];
  }

  if (keyboardKey === "End") {
    const lastInteriorDecorKind = interiorDecorKinds.at(-1);

    if (lastInteriorDecorKind === undefined) {
      throw new Error("Interior decor tabs must contain a final tab kind.");
    }

    return lastInteriorDecorKind;
  }

  if (keyboardKey === "ArrowLeft") {
    return interiorDecorKinds[
      (currentKindIndex - 1 + interiorDecorKinds.length) %
        interiorDecorKinds.length
    ];
  }

  if (keyboardKey === "ArrowRight") {
    return interiorDecorKinds[
      (currentKindIndex + 1) % interiorDecorKinds.length
    ];
  }

  return null;
}

export function InteriorDecorPanel({
  mapId,
  selectedPattern,
  onPatternSelect,
}: InteriorDecorPanelProperties) {
  const [activeKind, setActiveKind] = useState<InteriorDecorKind>(
    selectedPattern?.kind ?? "wallpaper",
  );
  const panelId = useId();
  const tabElementReferences = useRef<
    Record<InteriorDecorKind, HTMLButtonElement | null>
  >({
    wallpaper: null,
    flooring: null,
  });

  useEffect(() => {
    if (selectedPattern !== null) {
      setActiveKind(selectedPattern.kind);
    }
  }, [selectedPattern]);

  if (!isInteriorDecorSupportedMapId(mapId)) {
    return null;
  }

  function handleTabKeyDown(
    keyboardEvent: KeyboardEvent<HTMLButtonElement>,
    currentKind: InteriorDecorKind,
  ): void {
    const nextKind = getNextInteriorDecorKind(currentKind, keyboardEvent.key);

    if (nextKind === null) {
      return;
    }

    keyboardEvent.preventDefault();
    setActiveKind(nextKind);

    const nextTabElement = tabElementReferences.current[nextKind];

    if (nextTabElement === null) {
      throw new Error(`Interior decor tab \"${nextKind}\" is not rendered.`);
    }

    nextTabElement.focus();
  }

  return (
    <section aria-label="Interior decor" className="interior-decor-panel">
      <div className="interior-decor-panel__header">
        <div aria-label="Interior decor category" role="tablist">
          {interiorDecorKinds.map((interiorDecorKind) => (
            <button
              aria-controls={`${panelId}-panel-${interiorDecorKind}`}
              aria-selected={activeKind === interiorDecorKind}
              className="interior-decor-panel__tab"
              id={`${panelId}-tab-${interiorDecorKind}`}
              key={interiorDecorKind}
              onClick={() => setActiveKind(interiorDecorKind)}
              onKeyDown={(keyboardEvent) =>
                handleTabKeyDown(keyboardEvent, interiorDecorKind)
              }
              ref={(tabElement) => {
                tabElementReferences.current[interiorDecorKind] = tabElement;
              }}
              role="tab"
              tabIndex={activeKind === interiorDecorKind ? 0 : -1}
              type="button"
            >
              {interiorDecorKindLabels[interiorDecorKind]}
            </button>
          ))}
        </div>
        <button
          aria-label="Cancel interior decor"
          className="interior-decor-panel__cancel"
          disabled={selectedPattern === null}
          onClick={() => onPatternSelect(null)}
          type="button"
        >
          Cancel
        </button>
      </div>
      {interiorDecorKinds.map((interiorDecorKind) => (
        <div
          aria-label={interiorDecorKindLabels[interiorDecorKind]}
          aria-labelledby={`${panelId}-tab-${interiorDecorKind}`}
          className="interior-decor-panel__grid"
          hidden={activeKind !== interiorDecorKind}
          id={`${panelId}-panel-${interiorDecorKind}`}
          key={interiorDecorKind}
          role="tabpanel"
        >
          {patternsByKind[interiorDecorKind].map((pattern) => {
            const isSelected = selectedPattern?.id === pattern.id;

            return (
              <button
                aria-label={`Select ${pattern.name}`}
                aria-pressed={isSelected}
                className="interior-decor-panel__pattern"
                data-selected={isSelected}
                key={pattern.id}
                onClick={() => onPatternSelect(pattern)}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className="interior-decor-panel__pattern-preview"
                  style={{
                    backgroundImage: `url(${pattern.textureLocalPath})`,
                    backgroundPosition: `-${String(pattern.previewRect.x)}px -${String(pattern.previewRect.y)}px`,
                    height: `${String(pattern.previewRect.height)}px`,
                    width: `${String(pattern.previewRect.width)}px`,
                  }}
                />
                <span className="sr-only">{pattern.name}</span>
              </button>
            );
          })}
        </div>
      ))}
    </section>
  );
}
