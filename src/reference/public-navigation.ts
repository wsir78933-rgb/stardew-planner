export type PublicNavigationPath =
  | "/"
  | "/farm-comparison"
  | "/mods"
  | "/privacy"
  | "/terms";

export type PublicNavigationItem = Readonly<{
  label: string;
  path: PublicNavigationPath;
}>;

export const publicNavigation = [
  { label: "Planner", path: "/" },
  { label: "Farm Comparison", path: "/farm-comparison" },
  { label: "Mods", path: "/mods" },
  { label: "Privacy", path: "/privacy" },
  { label: "Terms", path: "/terms" },
] as const satisfies readonly PublicNavigationItem[];
