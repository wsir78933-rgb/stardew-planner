"use client";

import { Button } from "@/components/ui/button";
import type { HomepageLocale } from "@/src/homepage/homepage-locale";

type HomepageLocaleSwitcherProps = {
  currentLocale: HomepageLocale;
  label: string;
  onLocaleChange: (homepageLocale: HomepageLocale) => void;
};

export function HomepageLocaleSwitcher({
  currentLocale,
  label,
  onLocaleChange,
}: HomepageLocaleSwitcherProps) {
  return (
    <div aria-label={label} role="group">
      <Button
        aria-pressed={currentLocale === "en"}
        onClick={() => onLocaleChange("en")}
        type="button"
        variant="ghost"
      >
        English
      </Button>
      <Button
        aria-pressed={currentLocale === "zh-CN"}
        onClick={() => onLocaleChange("zh-CN")}
        type="button"
        variant="ghost"
      >
        中文
      </Button>
    </div>
  );
}
