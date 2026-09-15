"use client";

import { useId, useState, type JSX } from "react";

import { cn } from "@/lib/utils";

export type Faq1Item = {
  question: string;
  answer: string;
};

export type Faq1Props = {
  eyebrow: string;
  title: string;
  description: string;
  items: readonly Faq1Item[];
  className?: string;
};

const FAQ_1_ROOT_CLASS_NAME =
  "flex flex-col items-center text-center text-foreground px-3";
const FAQ_1_EYEBROW_CLASS_NAME = "text-base font-medium text-muted-foreground";
const FAQ_1_TITLE_CLASS_NAME = "text-3xl md:text-4xl font-semibold mt-2";
const FAQ_1_DESCRIPTION_CLASS_NAME =
  "text-sm text-muted-foreground mt-4 max-w-sm";
const FAQ_1_LIST_CLASS_NAME =
  "max-w-xl w-full mt-6 flex flex-col gap-4 items-start text-left";
const FAQ_1_ITEM_CLASS_NAME = "flex flex-col items-start w-full";
const FAQ_1_TRIGGER_CLASS_NAME =
  "flex items-center justify-between w-full cursor-pointer border border-border bg-card p-4 rounded text-left text-foreground";
const FAQ_1_QUESTION_CLASS_NAME = "text-sm";
const FAQ_1_CHEVRON_CLASS_NAME = "transition-all duration-500 ease-in-out";
const FAQ_1_ANSWER_BASE_CLASS_NAME =
  "text-sm text-muted-foreground px-4 transition-all duration-500 ease-in-out overflow-hidden";
const FAQ_1_ANSWER_OPEN_CLASS_NAME =
  "opacity-100 max-h-[300px] translate-y-0 pt-4";
const FAQ_1_ANSWER_CLOSED_CLASS_NAME =
  "opacity-0 max-h-0 -translate-y-2 pointer-events-none";

function receivedValue(value: unknown): string {
  return JSON.stringify(value) ?? String(value);
}

function requireNonEmptyString(value: unknown, fieldPath: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Faq1: ${fieldPath} must be a non-empty string, received: ${receivedValue(value)}`,
    );
  }

  return value;
}

function requireFaq1Item(item: unknown, itemIndex: number): Faq1Item {
  if (item === null || typeof item !== "object" || Array.isArray(item)) {
    throw new Error(
      `Faq1: items[${itemIndex}] must be an object, received: ${receivedValue(item)}`,
    );
  }

  const faq1ItemRecord = item as {
    answer?: unknown;
    question?: unknown;
  };

  requireNonEmptyString(faq1ItemRecord.question, `items[${itemIndex}].question`);
  requireNonEmptyString(faq1ItemRecord.answer, `items[${itemIndex}].answer`);

  return item as Faq1Item;
}

function assertFaq1Props(props: Faq1Props): void {
  requireNonEmptyString(props.eyebrow, "eyebrow");
  requireNonEmptyString(props.title, "title");
  requireNonEmptyString(props.description, "description");

  const { items } = props;
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error(
      `Faq1: items must be a non-empty array, received: ${receivedValue(items)}`,
    );
  }

  items.forEach((item, itemIndex) => {
    requireFaq1Item(item, itemIndex);
  });
}

function faq1ChevronClassName(isOpen: boolean): string {
  return cn(FAQ_1_CHEVRON_CLASS_NAME, isOpen ? "rotate-180" : undefined);
}

function faq1AnswerClassName(isOpen: boolean): string {
  return cn(
    FAQ_1_ANSWER_BASE_CLASS_NAME,
    isOpen ? FAQ_1_ANSWER_OPEN_CLASS_NAME : FAQ_1_ANSWER_CLOSED_CLASS_NAME,
  );
}

function Faq1Chevron({ isOpen }: { isOpen: boolean }): JSX.Element {
  return (
    <svg
      aria-hidden="true"
      className={faq1ChevronClassName(isOpen)}
      fill="none"
      height="18"
      viewBox="0 0 18 18"
      width="18"
    >
      <path
        d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function Faq1ItemRow({
  isOpen,
  item,
  itemIndex,
  listId,
  onToggle,
}: {
  isOpen: boolean;
  item: Faq1Item;
  itemIndex: number;
  listId: string;
  onToggle: () => void;
}): JSX.Element {
  const answerId = `${listId}-answer-${itemIndex}`;

  return (
    <div className={FAQ_1_ITEM_CLASS_NAME}>
      <button
        aria-controls={answerId}
        aria-expanded={isOpen}
        className={FAQ_1_TRIGGER_CLASS_NAME}
        onClick={onToggle}
        type="button"
      >
        <span className={FAQ_1_QUESTION_CLASS_NAME}>{item.question}</span>
        <Faq1Chevron isOpen={isOpen} />
      </button>
      <p
        aria-hidden={!isOpen}
        className={faq1AnswerClassName(isOpen)}
        id={answerId}
      >
        {item.answer}
      </p>
    </div>
  );
}

export function Faq1(props: Faq1Props): JSX.Element {
  const listId = useId();
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);

  assertFaq1Props(props);

  const { eyebrow, title, description, items, className } = props;

  return (
    <div className={cn(FAQ_1_ROOT_CLASS_NAME, className)}>
      <p className={FAQ_1_EYEBROW_CLASS_NAME}>{eyebrow}</p>
      <h2 className={FAQ_1_TITLE_CLASS_NAME}>{title}</h2>
      <p className={FAQ_1_DESCRIPTION_CLASS_NAME}>{description}</p>
      <div className={FAQ_1_LIST_CLASS_NAME}>
        {items.map((item, itemIndex) => (
          <Faq1ItemRow
            isOpen={openItemIndex === itemIndex}
            item={item}
            itemIndex={itemIndex}
            key={item.question}
            listId={listId}
            onToggle={() => {
              setOpenItemIndex((currentOpenItemIndex) =>
                currentOpenItemIndex === itemIndex ? null : itemIndex,
              );
            }}
          />
        ))}
      </div>
    </div>
  );
}
