"use client";

import { Check, ChevronDown } from "lucide-react";
import { Select } from "radix-ui";
import styles from "./tools-page.module.css";

export type PlantingSelectOption = Readonly<{
  value: string;
  label: string;
}>;

type PlantingSelectProperties = Readonly<{
  inputId: string;
  label: string;
  value: string;
  options: readonly PlantingSelectOption[];
  onValueChange: (value: string) => void;
  errorMessage?: string | null;
}>;

export function PlantingSelect({
  inputId,
  label,
  value,
  options,
  onValueChange,
  errorMessage = null,
}: PlantingSelectProperties) {
  const selectedOption = options.find((option) => option.value === value);
  if (selectedOption === undefined) {
    throw new Error(
      `Planting select value must match an option. Received inputId=${JSON.stringify(inputId)}, value=${JSON.stringify(value)}.`,
    );
  }

  const labelId = `${inputId}-label`;
  const errorId = `${inputId}-error`;
  const hasError = errorMessage !== null;

  return (
    <>
      <label htmlFor={inputId} id={labelId}>
        {label}
      </label>
      <Select.Root onValueChange={onValueChange} value={value}>
        <Select.Trigger
          aria-describedby={hasError ? errorId : undefined}
          aria-invalid={hasError}
          aria-labelledby={labelId}
          className={styles.plantingSelectTrigger}
          id={inputId}
          title={selectedOption.label}
        >
          <span className={styles.plantingSelectValue}>
            <Select.Value>{selectedOption.label}</Select.Value>
          </span>
          <Select.Icon aria-hidden="true" className={styles.plantingSelectIcon}>
            <ChevronDown size={16} />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className={styles.plantingSelectContent}
            collisionPadding={8}
            position="popper"
            sideOffset={4}
          >
            <Select.Viewport className={styles.plantingSelectViewport}>
              {options.map((option) => (
                <Select.Item
                  className={styles.plantingSelectItem}
                  key={option.value}
                  textValue={option.label}
                  value={option.value}
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator aria-hidden="true" className={styles.plantingSelectItemIndicator}>
                    <Check size={16} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      {errorMessage === null ? null : (
        <p className={styles.fieldError} id={errorId} role="alert">
          {errorMessage}
        </p>
      )}
    </>
  );
}
