import { publicNavigation } from "../reference/public-navigation";

export function PublicNavigation() {
  return (
    <nav aria-label="Public navigation">
      {publicNavigation.map((navigationItem) => (
        <a href={navigationItem.path} key={navigationItem.path}>
          {navigationItem.label}
        </a>
      ))}
    </nav>
  );
}
