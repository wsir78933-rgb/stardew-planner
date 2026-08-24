import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export type SiteNavigationItem = Readonly<{
  href: string;
  label: string;
}>;

type SiteNavigationMenuProperties = Readonly<{
  items: readonly SiteNavigationItem[];
}> & Omit<ComponentProps<typeof NavigationMenu>, "children">;

export function SiteNavigationMenu({
  className,
  items,
  ...navigationMenuProperties
}: SiteNavigationMenuProperties) {
  return (
    <NavigationMenu
      className={cn("site-navigation-menu", className)}
      {...navigationMenuProperties}
    >
      <NavigationMenuList className="site-navigation-menu__list">
        {items.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink asChild className="site-navigation-menu__link">
              <a href={item.href}>{item.label}</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
