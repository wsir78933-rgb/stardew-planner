import type { ReactNode } from "react";
import { PublicNavigation } from "./public-navigation";

type PublicPageShellProperties = Readonly<{
  children: ReactNode;
}>;

export function PublicPageShell({ children }: PublicPageShellProperties) {
  return (
    <div data-public-page-shell="true">
      <header className="public-page-shell-header">
        <a className="public-page-shell-brand" href="/">
          Stardew Valley Farm Planner
        </a>
        <PublicNavigation />
      </header>
      <main>{children}</main>
      <footer>
        <p>© Stardew Valley Farm Planner</p>
      </footer>
    </div>
  );
}
