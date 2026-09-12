import { homepageCopyByLocale } from "@/src/homepage/homepage-copy";
import type { HomepageLocale } from "@/src/homepage/homepage-locale";
import { createHomepageNavigationUrls } from "@/src/homepage/homepage-navigation-url";
import { HomepageContent } from "./homepage-content";
import { HomepagePlannerSlot } from "./homepage-planner-slot";

type PlannerHomepageProps = Readonly<{
  locale: HomepageLocale;
}>;

export function PlannerHomepage({ locale }: PlannerHomepageProps) {
  const copy = homepageCopyByLocale[locale];
  const navigationUrls = createHomepageNavigationUrls({
    currentLocale: locale,
    hash: "",
    search: "",
  });

  return (
    <div data-homepage-shell>
      <HomepageContent
        copy={copy}
        currentLocale={locale}
        {...navigationUrls}
        plannerWorkspace={
          <HomepagePlannerSlot
            locale={locale}
            previewImageAlt={copy.plannerPreview.imageAlt}
          />
        }
      />
    </div>
  );
}
