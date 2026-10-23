"use client";

import { useId, useState } from "react";
import type {
  AnimationChoice,
  AnimationControlDefinition,
} from "../animations/animation-catalog";
import type { PlacementAnimationOptions } from "../animations/placement-animation-options";
import type { PlannerChromeLocale } from "../homepage/homepage-locale";
import { readSelectionEntityDisplayName } from "../homepage/japanese-game-display-labels";
import { usePlannerChromeLocale } from "../i18n/planner-chrome-locale";
import { readPlacementAnimationCopy } from "../i18n/placement-animation-copy";
import styles from "./placement-animation-controls.module.css";

type PlacementAnimationControlsProperties = Readonly<{
  controls: readonly AnimationControlDefinition[] | null;
  loadError?: string;
  onChange: (placementAnimationOptions: PlacementAnimationOptions | undefined) => void;
  options: PlacementAnimationOptions | undefined;
}>;

type PlacementAnimationOptionKey = keyof PlacementAnimationOptions;

type PlacementAnimationOptionValue =
  | boolean
  | number
  | readonly string[]
  | readonly Readonly<{ animalId: string }>[]
  | string
  | undefined;

export function PlacementAnimationControls({
  controls,
  loadError,
  onChange,
  options,
}: PlacementAnimationControlsProperties) {
  const locale = usePlannerChromeLocale();
  const copy = readPlacementAnimationCopy(locale);
  const [newAnimalId, setNewAnimalId] = useState("");
  const controlPanelId = useId();
  const populationErrorId = `${controlPanelId}-population-error`;

  if (loadError !== undefined) {
    return (
      <span className={`${styles.message} ${styles.error}`} role="alert">
        {copy.optionsError}
      </span>
    );
  }

  if (controls === null) {
    return <span className={styles.message} role="status">{copy.optionsLoading}</span>;
  }

  if (controls.length === 0) {
    return null;
  }

  return (
    <details className={styles.details}>
      <summary aria-controls={controlPanelId} className={styles.summary}>
        {copy.openOptions}
      </summary>
      <div aria-label={copy.openOptions} className={styles.panel} id={controlPanelId} role="group">
        {controls.map((controlDefinition) => renderAnimationControl({
          controlDefinition,
          copy,
          locale,
          newAnimalId,
          onChange,
          options,
          populationErrorId,
          setNewAnimalId,
        }))}
      </div>
    </details>
  );
}

function renderAnimationControl({
  controlDefinition,
  copy,
  locale,
  newAnimalId,
  onChange,
  options,
  populationErrorId,
  setNewAnimalId,
}: Readonly<{
  controlDefinition: AnimationControlDefinition;
  copy: ReturnType<typeof readPlacementAnimationCopy>;
  locale: PlannerChromeLocale;
  newAnimalId: string;
  onChange: PlacementAnimationControlsProperties["onChange"];
  options: PlacementAnimationOptions | undefined;
  populationErrorId: string;
  setNewAnimalId: (animalId: string) => void;
}>) {
  if (controlDefinition.kind === "select") {
    return renderSelectControl({
      controlDefinition,
      copy,
      locale,
      onChange,
      options,
    });
  }

  if (controlDefinition.kind === "checkbox") {
    return renderCheckboxControl({ controlDefinition, copy, onChange, options });
  }

  if (controlDefinition.kind === "number") {
    return (
      <PopulationField
        controlDefinition={controlDefinition}
        copy={copy}
        errorId={populationErrorId}
        key={`${controlDefinition.key}-${options?.fishId ?? "none"}`}
        onChange={onChange}
        options={options}
      />
    );
  }

  if (controlDefinition.kind === "multiSelect") {
    return renderMultiSelectControl({
      controlDefinition,
      copy,
      locale,
      onChange,
      options,
    });
  }

  if (controlDefinition.kind === "animalList") {
    return renderAnimalListControl({
      controlDefinition,
      copy,
      locale,
      newAnimalId,
      onChange,
      options,
      setNewAnimalId,
    });
  }

  const unsupportedAnimationControl: never = controlDefinition;
  throw new Error(
    `Cannot render placement animation control ${JSON.stringify(unsupportedAnimationControl)}.`,
  );
}

function renderSelectControl({
  controlDefinition,
  copy,
  locale,
  onChange,
  options,
}: Readonly<{
  controlDefinition: Extract<AnimationControlDefinition, { kind: "select" }>;
  copy: ReturnType<typeof readPlacementAnimationCopy>;
  locale: PlannerChromeLocale;
  onChange: PlacementAnimationControlsProperties["onChange"];
  options: PlacementAnimationOptions | undefined;
}>) {
  const value = readStringOption(options, controlDefinition.key);
  const label = readAnimationOptionLabel(controlDefinition.key, copy);
  const isDisabled = controlDefinition.disabledWhen?.field === "spriteState"
    && options?.spriteState === controlDefinition.disabledWhen.value;
  const isNoneOption = controlDefinition.key === "fishId"
    || controlDefinition.key === "produce"
    || controlDefinition.key === "petId"
    || controlDefinition.key === "hatId"
    || controlDefinition.key === "shirtId"
    || controlDefinition.key === "pantsId"
    || controlDefinition.key === "readyProduct"
    || controlDefinition.key === "millProduct";
  const selectedChoiceExists = value === undefined || controlDefinition.choices.some(
    (animationChoice) => animationChoice.id === value,
  );

  return (
    <label className={styles.field} key={controlDefinition.key}>
      <span className={styles.fieldLabel}>{label}</span>
      <select
        aria-label={label}
        className={styles.control}
        disabled={isDisabled}
        onChange={(changeEvent) => {
          const nextValue = changeEvent.currentTarget.value === ""
            ? undefined
            : changeEvent.currentTarget.value;
          let nextAnimationOptions = replaceAnimationOption(
            options,
            controlDefinition.key,
            nextValue,
          );
          if (controlDefinition.key === "fishId" && nextValue === undefined) {
            nextAnimationOptions = replaceAnimationOption(nextAnimationOptions, "population", undefined);
            nextAnimationOptions = replaceAnimationOption(nextAnimationOptions, "produce", undefined);
          }
          onChange(nextAnimationOptions);
        }}
        value={value ?? ""}
      >
        <option value="">{isNoneOption ? copy.noneOption : copy.defaultOption}</option>
        {!selectedChoiceExists && value !== undefined ? (
          <option value={value}>{copy.unavailableChoice(value)}</option>
        ) : null}
        {controlDefinition.choices.map((animationChoice) => (
          <option key={animationChoice.id} value={animationChoice.id}>
            {readAnimationChoiceLabel(locale, animationChoice)}
          </option>
        ))}
      </select>
    </label>
  );
}

function renderCheckboxControl({
  controlDefinition,
  copy,
  onChange,
  options,
}: Readonly<{
  controlDefinition: Extract<AnimationControlDefinition, { kind: "checkbox" }>;
  copy: ReturnType<typeof readPlacementAnimationCopy>;
  onChange: PlacementAnimationControlsProperties["onChange"];
  options: PlacementAnimationOptions | undefined;
}>) {
  const label = readAnimationOptionLabel(controlDefinition.key, copy);
  const checked = readBooleanOption(options, controlDefinition.key);

  return (
    <label className={styles.checkboxField} key={controlDefinition.key}>
      <input
        aria-label={label}
        checked={checked}
        onChange={(changeEvent) => {
          const isChecked = changeEvent.currentTarget.checked;
          let nextAnimationOptions = replaceAnimationOption(
            options,
            controlDefinition.key,
            isChecked || undefined,
          );
          if (!isChecked && controlDefinition.key === "horse") {
            nextAnimationOptions = replaceAnimationOption(nextAnimationOptions, "hatId", undefined);
          }
          if (!isChecked && controlDefinition.key === "millOutput") {
            nextAnimationOptions = replaceAnimationOption(nextAnimationOptions, "millProduct", undefined);
          }
          onChange(nextAnimationOptions);
        }}
        type="checkbox"
      />
      <span>{label}</span>
    </label>
  );
}

function PopulationField({
  controlDefinition,
  copy,
  errorId,
  onChange,
  options,
}: Readonly<{
  controlDefinition: Extract<AnimationControlDefinition, { kind: "number" }>;
  copy: ReturnType<typeof readPlacementAnimationCopy>;
  errorId: string;
  onChange: PlacementAnimationControlsProperties["onChange"];
  options: PlacementAnimationOptions | undefined;
}>) {
  const [populationDraft, setPopulationDraft] = useState<string | null>(null);
  const [populationError, setPopulationError] = useState<string | null>(null);
  const label = readAnimationOptionLabel(controlDefinition.key, copy);
  const defaultPopulation = options?.fishId === undefined
    ? ""
    : controlDefinition.minimum.toString();
  const displayedPopulation = populationDraft
    ?? options?.population?.toString()
    ?? defaultPopulation;

  return (
    <label className={styles.field} key={controlDefinition.key}>
      <span className={styles.fieldLabel}>{label}</span>
      <input
        aria-describedby={populationError === null ? undefined : errorId}
        aria-label={label}
        className={styles.control}
        disabled={options?.fishId === undefined}
        max={controlDefinition.maximum}
        min={controlDefinition.minimum}
        onBlur={() => {
          setPopulationDraft(null);
          setPopulationError(null);
        }}
        onChange={(changeEvent) => {
          const populationText = changeEvent.currentTarget.value;
          setPopulationDraft(populationText);
          if (populationText === "") {
            setPopulationError(null);
            onChange(replaceAnimationOption(options, "population", undefined));
            return;
          }

          const population = Number(populationText);
          if (
            !Number.isSafeInteger(population)
            || population < controlDefinition.minimum
            || population > controlDefinition.maximum
          ) {
            setPopulationError(copy.populationRange(controlDefinition.minimum, controlDefinition.maximum));
            return;
          }

          setPopulationError(null);
          onChange(replaceAnimationOption(options, "population", population));
        }}
        step={1}
        type="number"
        value={displayedPopulation}
      />
      {populationError === null ? null : (
        <span className={`${styles.message} ${styles.error}`} id={errorId} role="alert">
          {populationError}
        </span>
      )}
    </label>
  );
}

function renderMultiSelectControl({
  controlDefinition,
  copy,
  locale,
  onChange,
  options,
}: Readonly<{
  controlDefinition: Extract<AnimationControlDefinition, { kind: "multiSelect" }>;
  copy: ReturnType<typeof readPlacementAnimationCopy>;
  locale: PlannerChromeLocale;
  onChange: PlacementAnimationControlsProperties["onChange"];
  options: PlacementAnimationOptions | undefined;
}>) {
  const value = options?.tankFish ?? [];
  const knownChoiceIds = new Set(controlDefinition.choices.map((choice) => choice.id));
  const unavailableFishIds = value.filter((fishId) => !knownChoiceIds.has(fishId));

  return (
    <label className={styles.field} key={controlDefinition.key}>
      <span className={styles.fieldLabel}>{copy.tankFish}</span>
      <select
        aria-label={copy.tankFish}
        className={`${styles.control} ${styles.multiSelect}`}
        multiple
        onChange={(changeEvent) => {
          const selectedFishIds = Array.from(
            changeEvent.currentTarget.selectedOptions,
            (selectedFishOption) => selectedFishOption.value,
          );
          onChange(replaceAnimationOption(
            options,
            "tankFish",
            selectedFishIds.length === 0 ? undefined : selectedFishIds,
          ));
        }}
        value={value}
      >
        {unavailableFishIds.map((fishId) => (
          <option key={fishId} value={fishId}>{copy.unavailableChoice(fishId)}</option>
        ))}
        {controlDefinition.choices.map((animationChoice) => (
          <option key={animationChoice.id} value={animationChoice.id}>
            {readAnimationChoiceLabel(locale, animationChoice)}
          </option>
        ))}
      </select>
    </label>
  );
}

function renderAnimalListControl({
  controlDefinition,
  copy,
  locale,
  newAnimalId,
  onChange,
  options,
  setNewAnimalId,
}: Readonly<{
  controlDefinition: Extract<AnimationControlDefinition, { kind: "animalList" }>;
  copy: ReturnType<typeof readPlacementAnimationCopy>;
  locale: PlannerChromeLocale;
  newAnimalId: string;
  onChange: PlacementAnimationControlsProperties["onChange"];
  options: PlacementAnimationOptions | undefined;
  setNewAnimalId: (animalId: string) => void;
}>) {
  const animals = options?.animals ?? [];
  const availableAnimalId = controlDefinition.choices.some(
    (animalChoice) => animalChoice.id === newAnimalId,
  )
    ? newAnimalId
    : controlDefinition.choices[0]?.id ?? "";

  return (
    <fieldset className={styles.field} key={controlDefinition.key}>
      <legend className={styles.fieldLabel}>{copy.animal}</legend>
      <span className={styles.message}>{copy.animalCapacity(controlDefinition.maxCount)}</span>
      {animals.map((animal, animalIndex) => {
        const animalChoice = controlDefinition.choices.find(
          (availableAnimalChoice) => availableAnimalChoice.id === animal.animalId,
        );
        if (animalChoice === undefined) {
          throw new Error(
            `Placement animation animal ID ${JSON.stringify(animal.animalId)} is not valid for this building; received index ${String(animalIndex)}.`,
          );
        }
        const animalName = readAnimationChoiceLabel(locale, animalChoice);

        return (
          <div className={styles.animalRow} key={`${animal.animalId}-${String(animalIndex)}`}>
            <label className={styles.animalLabel}>
              {copy.selectedAnimal(animalName, animalIndex + 1)}
              <select
                aria-label={copy.selectedAnimal(animalName, animalIndex + 1)}
                className={styles.control}
                onChange={(changeEvent) => {
                  const nextAnimals = animals.map((currentAnimal, currentAnimalIndex) =>
                    currentAnimalIndex === animalIndex
                      ? { animalId: changeEvent.currentTarget.value }
                      : currentAnimal,
                  );
                  onChange(replaceAnimationOption(options, "animals", nextAnimals));
                }}
                value={animal.animalId}
              >
                {controlDefinition.choices.map((availableAnimalChoice) => (
                  <option key={availableAnimalChoice.id} value={availableAnimalChoice.id}>
                    {readAnimationChoiceLabel(locale, availableAnimalChoice)}
                  </option>
                ))}
              </select>
            </label>
            <button
              aria-label={`${copy.removeAnimal} ${animalName} ${String(animalIndex + 1)}`}
              className={styles.animalButton}
              onClick={() => {
                const nextAnimals = animals.filter((_, currentAnimalIndex) => currentAnimalIndex !== animalIndex);
                onChange(replaceAnimationOption(
                  options,
                  "animals",
                  nextAnimals.length === 0 ? undefined : nextAnimals,
                ));
              }}
              type="button"
            >
              <span aria-hidden="true">−</span>
            </button>
          </div>
        );
      })}
      <div className={styles.animalAdder}>
        <label className={styles.animalLabel}>
          {copy.newAnimalSpecies}
          <select
            aria-label={copy.newAnimalSpecies}
            className={styles.control}
            onChange={(changeEvent) => setNewAnimalId(changeEvent.currentTarget.value)}
            value={availableAnimalId}
          >
            {controlDefinition.choices.map((animalChoice) => (
              <option key={animalChoice.id} value={animalChoice.id}>
                {readAnimationChoiceLabel(locale, animalChoice)}
              </option>
            ))}
          </select>
        </label>
        <button
          className={styles.addAnimalButton}
          disabled={animals.length >= controlDefinition.maxCount || availableAnimalId === ""}
          onClick={() => {
            if (animals.length >= controlDefinition.maxCount) {
              throw new RangeError(
                `Placement animation cannot add an animal when current count is ${String(animals.length)} and maximum is ${String(controlDefinition.maxCount)}.`,
              );
            }
            if (availableAnimalId === "") {
              throw new Error("Placement animation cannot add an animal without an available animal ID.");
            }
            onChange(replaceAnimationOption(options, "animals", [
              ...animals,
              { animalId: availableAnimalId },
            ]));
          }}
          type="button"
        >
          {copy.addAnimal}
        </button>
      </div>
    </fieldset>
  );
}

function readAnimationOptionLabel(
  optionKey: PlacementAnimationOptionKey,
  copy: ReturnType<typeof readPlacementAnimationCopy>,
): string {
  if (optionKey === "spriteState") return copy.machineState;
  if (optionKey === "readyProduct") return copy.machineOutput;
  if (optionKey === "produce") return copy.pondProduce;
  if (optionKey === "fireplaceLit") return copy.fireplaceLit;
  if (optionKey === "clockOff") return copy.clockOff;
  if (optionKey === "fishId") return copy.fishSpecies;
  if (optionKey === "population") return copy.fishPopulation;
  if (optionKey === "tankFish") return copy.tankFish;
  if (optionKey === "animals") return copy.animal;
  if (optionKey === "petId") return copy.pet;
  if (optionKey === "horse") return copy.horse;
  if (optionKey === "junimos") return copy.junimos;
  if (optionKey === "millLoaded") return copy.millLoaded;
  if (optionKey === "millOutput") return copy.millOutput;
  if (optionKey === "millProduct") return copy.millProduct;
  if (optionKey === "hatId") return copy.hat;
  if (optionKey === "shirtId") return copy.shirt;
  if (optionKey === "pantsId") return copy.pants;

  const unsupportedPlacementAnimationOptionKey: never = optionKey;
  throw new Error(
    `Cannot read animation option label for ${JSON.stringify(unsupportedPlacementAnimationOptionKey)}.`,
  );
}

function readAnimationChoiceLabel(
  locale: PlannerChromeLocale,
  animationChoice: AnimationChoice,
): string {
  try {
    return readSelectionEntityDisplayName(
      locale,
      animationChoice.label,
      animationChoice.label,
    );
  } catch (caughtError) {
    if (
      locale === "ja"
      && caughtError instanceof Error
      && caughtError.message.startsWith("Japanese catalog display name is missing for ")
    ) {
      return animationChoice.label;
    }
    throw caughtError;
  }
}

function readStringOption(
  options: PlacementAnimationOptions | undefined,
  optionKey: Extract<PlacementAnimationOptionKey, "fishId" | "hatId" | "millProduct" | "pantsId" | "petId" | "produce" | "readyProduct" | "shirtId" | "spriteState">,
): string | undefined {
  if (options === undefined) return undefined;
  return options[optionKey];
}

function readBooleanOption(
  options: PlacementAnimationOptions | undefined,
  optionKey: Extract<PlacementAnimationOptionKey, "clockOff" | "fireplaceLit" | "horse" | "junimos" | "millLoaded" | "millOutput">,
): boolean {
  if (options === undefined) return false;
  return options[optionKey] ?? false;
}

function replaceAnimationOption(
  options: PlacementAnimationOptions | undefined,
  optionKey: PlacementAnimationOptionKey,
  optionValue: PlacementAnimationOptionValue,
): PlacementAnimationOptions | undefined {
  const nextAnimationOptions: Record<string, unknown> = { ...(options ?? {}) };
  if (optionValue === undefined) {
    delete nextAnimationOptions[optionKey];
  } else {
    nextAnimationOptions[optionKey] = optionValue;
  }
  const hasConfiguredAnimationOption = Object.values(nextAnimationOptions).some(
    (configuredValue) => configuredValue !== undefined,
  );
  return hasConfiguredAnimationOption
    ? nextAnimationOptions as PlacementAnimationOptions
    : undefined;
}
