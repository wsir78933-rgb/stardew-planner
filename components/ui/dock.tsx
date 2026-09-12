"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface DockItem {
  id?: string;
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export interface DockProps {
  className?: string;
  items?: readonly DockItem[];
  children?: React.ReactNode;
}

export interface DockIconButtonProps {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

type DockIconButtonComponentProps = DockIconButtonProps &
  Omit<
    React.HTMLAttributes<HTMLElement>,
    keyof DockIconButtonProps | "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"
  > & {
    [dataAttributeName: `data-${string}`]: unknown;
  };

function describeReceivedValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint" ||
    typeof value === "symbol" ||
    typeof value === "function"
  ) {
    return String(value);
  }

  return JSON.stringify(value);
}

function validateDockLabel(label: unknown, context: string): void {
  if (typeof label !== "string" || label.trim() === "") {
    throw new TypeError(
      `Cannot render Dock: ${context} label must be a non-empty string; received: ${describeReceivedValue(label)}`,
    );
  }
}

function validateDockIcon(icon: unknown, context: string): void {
  const iconIsComponentFunction = typeof icon === "function";
  const iconIsComponentObject = typeof icon === "object" && icon !== null;
  if (!iconIsComponentFunction && !iconIsComponentObject) {
    throw new TypeError(
      `Cannot render Dock: ${context} icon must be a component; received: ${describeReceivedValue(icon)}`,
    );
  }
}

function validateDockHref(href: unknown, context: string): void {
  if (href === undefined) {
    return;
  }

  if (typeof href !== "string" || href.trim() === "") {
    throw new TypeError(
      `Cannot render Dock: ${context} href must be a non-empty string when provided; received: ${describeReceivedValue(href)}`,
    );
  }
}

function validateDockOnClick(onClick: unknown, context: string): void {
  if (onClick === undefined) {
    return;
  }

  if (typeof onClick !== "function") {
    throw new TypeError(
      `Cannot render Dock: ${context} onClick must be a function when provided; received: ${describeReceivedValue(onClick)}`,
    );
  }
}

function validateDockHasAction(
  href: unknown,
  onClick: unknown,
  context: string,
): void {
  const hasHref = typeof href === "string" && href.trim() !== "";
  const hasOnClick = typeof onClick === "function";
  if (!hasHref && !hasOnClick) {
    throw new TypeError(
      `Cannot render Dock: ${context} must have href or onClick; received href: ${describeReceivedValue(href)}, onClick: ${describeReceivedValue(onClick)}`,
    );
  }
}

function validateDockItem(item: unknown, itemIndex: number): void {
  const context = `item at index ${String(itemIndex)}`;
  if (typeof item !== "object" || item === null) {
    throw new TypeError(
      `Cannot render Dock: ${context} must be a non-null object; received: ${describeReceivedValue(item)}`,
    );
  }

  const dockItem = item as Record<string, unknown>;
  validateDockLabel(dockItem.label, context);
  validateDockIcon(dockItem.icon, context);
  validateDockHref(dockItem.href, context);
  validateDockOnClick(dockItem.onClick, context);
  validateDockHasAction(dockItem.href, dockItem.onClick, context);
}

function validateDockProps(items: unknown, children: unknown): void {
  if (items !== undefined && items !== null && !Array.isArray(items)) {
    throw new TypeError(
      `Cannot render Dock: items must be an array; received: ${describeReceivedValue(items)}`,
    );
  }

  const itemsLength = Array.isArray(items) ? items.length : 0;
  const hasDockItems = itemsLength > 0;
  const hasDockChildren = children !== null && children !== undefined;

  if (!hasDockItems && !hasDockChildren) {
    throw new TypeError(
      `Cannot render Dock: items is empty (length=${String(itemsLength)}, received=${describeReceivedValue(items)})`,
    );
  }

  if (!hasDockItems) {
    return;
  }

  const dockItems = items as readonly unknown[];
  for (let itemIndex = 0; itemIndex < dockItems.length; itemIndex += 1) {
    validateDockItem(dockItems[itemIndex], itemIndex);
  }
}

function validateDockIconButtonProps(
  icon: unknown,
  label: unknown,
  href: unknown,
  onClick: unknown,
): void {
  const context = "DockIconButton";
  validateDockLabel(label, context);
  validateDockIcon(icon, context);
  validateDockHref(href, context);
  validateDockOnClick(onClick, context);
  validateDockHasAction(href, onClick, context);
}

export const DockIconButton = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  DockIconButtonComponentProps
>(function DockIconButton(
  { className, href, icon: Icon, label, onClick, ...htmlAttributes },
  forwardedRef,
) {
  const prefersReducedMotion = useReducedMotion() === true;
  validateDockIconButtonProps(Icon, label, href, onClick);

  const dockIconButtonClassName = cn(
    "group relative rounded-lg p-3 hover:bg-secondary transition-colors",
    className,
  );
  const dockIconButtonHoverMotion = prefersReducedMotion
    ? undefined
    : { scale: 1.1, y: -2 };
  const dockIconButtonTapMotion = prefersReducedMotion
    ? undefined
    : { scale: 0.95 };
  const dockIconButtonContents = (
    <>
      <Icon aria-hidden="true" className="text-foreground size-5" />
      <span className="pointer-events-none absolute top-full left-1/2 z-20 mt-1 -translate-x-1/2 whitespace-nowrap rounded px-2 py-1 text-xs bg-popover text-popover-foreground opacity-0 transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </>
  );

  if (typeof href === "string" && href.trim() !== "") {
    return (
      <motion.a
        {...htmlAttributes}
        aria-label={label}
        className={dockIconButtonClassName}
        data-slot="dock-icon-button"
        href={href}
        onClick={onClick}
        ref={forwardedRef as React.Ref<HTMLAnchorElement>}
        whileHover={dockIconButtonHoverMotion}
        whileTap={dockIconButtonTapMotion}
      >
        {dockIconButtonContents}
      </motion.a>
    );
  }

  return (
    <motion.button
      {...htmlAttributes}
      aria-label={label}
      className={dockIconButtonClassName}
      data-slot="dock-icon-button"
      onClick={onClick}
      ref={forwardedRef as React.Ref<HTMLButtonElement>}
      type="button"
      whileHover={dockIconButtonHoverMotion}
      whileTap={dockIconButtonTapMotion}
    >
      {dockIconButtonContents}
    </motion.button>
  );
});
DockIconButton.displayName = "DockIconButton";

export const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  function Dock({ children, className, items }, forwardedRef) {
    validateDockProps(items, children);

    return (
      <div
        className={cn("flex items-center justify-center", className)}
        data-slot="dock"
        ref={forwardedRef}
      >
        <div className="flex items-center gap-1 rounded-2xl border border-border bg-background/90 p-2 shadow-lg backdrop-blur-lg transition-shadow duration-300 hover:shadow-xl">
          {Array.isArray(items) && items.length > 0 ? (
            <>
              {items.map((item, itemIndex) => (
                <DockIconButton
                  className={item.className}
                  href={item.href}
                  icon={item.icon}
                  key={item.id ?? `${item.label}-${String(itemIndex)}`}
                  label={item.label}
                  onClick={item.onClick}
                />
              ))}
              {children}
            </>
          ) : (
            children
          )}
        </div>
      </div>
    );
  },
);
Dock.displayName = "Dock";
