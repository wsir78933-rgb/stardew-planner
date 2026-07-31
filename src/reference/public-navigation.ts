export type PublicNavigationPath =
  | "/"
  | "/farm-comparison"
  | "/mods";

export type PublicNavigationItem = Readonly<{
  label: string;
  path: PublicNavigationPath;
}>;

export const publicNavigation = [
  { label: "Planner", path: "/" },
  { label: "Farm Comparison", path: "/farm-comparison" },
  { label: "Mods", path: "/mods" },
] as const satisfies readonly PublicNavigationItem[];
