import styles from "./workshop-tool.module.css";

export function WorkshopResultCard({
  label,
  value,
  detail,
}: Readonly<{ label: string; value: string; detail?: string }>) {
  return (
    <article className={styles.resultCard}>
      <p className={styles.resultLabel}>{label}</p>
      <p className={styles.resultValue}>{value}</p>
      {detail === undefined ? null : <p className={styles.resultDetail}>{detail}</p>}
    </article>
  );
}
