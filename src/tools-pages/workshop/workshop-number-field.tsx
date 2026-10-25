import styles from "./workshop-tool.module.css";

export type WorkshopNumberFieldProperties = Readonly<{
  id: string;
  label: string;
  value: string;
  minimum: 0 | 1;
  onValueChange: (value: string) => void;
  help?: string;
  error?: string | null;
}>;

export function WorkshopNumberField({
  id,
  label,
  value,
  minimum,
  onValueChange,
  help,
  error = null,
}: WorkshopNumberFieldProperties) {
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  const describedBy = [help === undefined ? null : helpId, error === null ? null : errorId]
    .filter((descriptionId): descriptionId is string => descriptionId !== null)
    .join(" ") || undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input
        aria-describedby={describedBy}
        aria-invalid={error !== null}
        id={id}
        inputMode="numeric"
        min={minimum}
        onChange={(event) => onValueChange(event.currentTarget.value)}
        pattern="[0-9]*"
        type="text"
        value={value}
      />
      {help === undefined ? null : <p className={styles.help} id={helpId}>{help}</p>}
      {error === null ? null : <p className={styles.fieldError} id={errorId} role="alert">{error}</p>}
    </div>
  );
}
