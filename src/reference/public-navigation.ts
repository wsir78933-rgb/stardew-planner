export type PublicNavigationPath = "/";

export type PublicNavigationItem = Readonly<{
  label: string;
  path: PublicNavigationPath;
}>;

export const publicNavigation = [
  { label: "Planner", path: "/" },
] as const satisfies readonly PublicNavigationItem[];
