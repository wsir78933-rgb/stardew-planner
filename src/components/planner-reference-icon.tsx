import type { ReactNode } from "react";

export const plannerReferenceIconNames = [
  "Help",
  "Keyboard",
  "Feedback",
  "Library",
  "Ambience",
  "Map",
  "View",
  "Settings",
  "Select",
  "Multi",
  "Fill",
  "Erase",
  "Zoom",
  "Undo",
  "Redo",
  "SeasonSpring",
  "SeasonSummer",
  "SeasonFall",
  "SeasonWinter",
] as const;

export type PlannerReferenceIconName = (typeof plannerReferenceIconNames)[number];

type PlannerReferenceIconProperties = Readonly<{
  name: PlannerReferenceIconName;
  size?: number;
  className?: string;
}>;

export function PlannerReferenceIcon({
  name,
  size = 18,
  className,
}: PlannerReferenceIconProperties) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      height={size}
      viewBox={name === "Keyboard" || name === "Ambience" ? "0 0 16 16" : "0 0 24 24"}
      width={size}
      fill="none"
      stroke="currentColor"
      strokeLinecap={name === "Keyboard" ? undefined : "round"}
      strokeLinejoin={name === "Keyboard" ? undefined : "round"}
      strokeWidth={name === "Keyboard" ? 1.4 : 2}
    >
      {getPlannerReferenceIconShapes(name)}
    </svg>
  );
}

function getPlannerReferenceIconShapes(name: PlannerReferenceIconName): ReactNode {
  switch (name) {
    case "Help":
      return (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </>
      );
    case "Keyboard":
      return (
        <>
          <rect x="1.8" y="4" width="12.4" height="8" rx="1.2" />
          <path d="M4.2 6.5H4.9M6.8 6.5H7.5M9.4 6.5H10.1M11.6 6.5H12.1M5.4 9.5H10.6" strokeLinecap="round" />
        </>
      );
    case "Feedback":
      return (
        <path d="M10 8.50224C10.1762 8.00136 10.524 7.579 10.9817 7.30998C11.4395 7.04095 11.9777 6.9426 12.501 7.03237C13.0243 7.12213 13.499 7.39421 13.8409 7.80041C14.1829 8.20661 14.37 8.72072 14.3692 9.25168C14.3692 10.7506 12.1209 11.5 12.1209 11.5M12.1499 14.5H12.1599M9.9 19.2L11.36 21.1467C11.5771 21.4362 11.6857 21.5809 11.8188 21.6327C11.9353 21.678 12.0647 21.678 12.1812 21.6327C12.3143 21.5809 12.4229 21.4362 12.64 21.1467L14.1 19.2C14.3931 18.8091 14.5397 18.6137 14.7185 18.4645C14.9569 18.2656 15.2383 18.1248 15.5405 18.0535C15.7671 18 16.0114 18 16.5 18C17.8978 18 18.5967 18 19.1481 17.7716C19.8831 17.4672 20.4672 16.8831 20.7716 16.1481C21 15.5967 21 14.8978 21 13.5V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V13.5C3 14.8978 3 15.5967 3.22836 16.1481C3.53284 16.8831 4.11687 17.4672 4.85195 17.7716C5.40326 18 6.10218 18 7.5 18C7.98858 18 8.23287 18 8.45951 18.0535C8.76169 18.1248 9.04312 18.2656 9.2815 18.4645C9.46028 18.6137 9.60685 18.8091 9.9 19.2Z" />
      );
    case "Library":
      return <path d="M3 21H21M5 3V21M9 7V21M13 4V21M17 7L20 21" />;
    case "Ambience":
      return (
        <g transform="scale(0.6667)">
          <path d="M19.368 12.4048C20.935 11.5606 22 9.9047 22 8C22 5.23858 19.7614 3 17 3C14.2386 3 12 5.23858 12 8M12 8C9.86227 8 8.0094 9.2196 7.09922 11.001C7.06622 11.0003 7.03315 11 7 11C4.23858 11 2 13.2386 2 16C2 18.7614 4.23858 21 7 21C11.2352 21 13.7434 21 17.5 21C19.9853 21 22 18.9853 22 16.5C22 14.0147 19.9853 12 17.5 12C17.4311 12 17.3625 12.0016 17.2943 12.0046C16.6429 9.69375 14.5192 8 12 8Z" />
        </g>
      );
    case "Map":
      return <path d="M9 18L2 22V6L9 2M9 18L16 22M9 18V2M16 22L22 18V2L16 6M16 22V6M16 6L9 2" />;
    case "View":
      return (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      );
    case "Settings":
      return <path d="M4 8h8m4 0h4M4 16h4m4 0h8M14 5.5v5M10 13.5v5" />;
    case "Select":
      return <path d="M3 3L21 9.5L13.5 13.5L9.5 21Z" />;
    case "Multi":
      return (
        <>
          <path d="M21 10V5A2 2 0 0 0 19 3H5A2 2 0 0 0 3 5V19A2 2 0 0 0 5 21H10" />
          <path d="M11.59 12.84A1 1 0 0 1 12.84 11.59L19.65 13.75A1 1 0 0 1 19.8 15.6L17 17L15.6 19.8A1 1 0 0 1 13.75 19.65Z" fill="currentColor" stroke="none" />
        </>
      );
    case "Fill":
      return <path d="M5 3H8A2 2 0 0 1 10 5V8A2 2 0 0 1 8 10H5A2 2 0 0 1 3 8V5A2 2 0 0 1 5 3ZM16 3H19A2 2 0 0 1 21 5V8A2 2 0 0 1 19 10H16A2 2 0 0 1 14 8V5A2 2 0 0 1 16 3ZM16 14H19A2 2 0 0 1 21 16V19A2 2 0 0 1 19 21H16A2 2 0 0 1 14 19V16A2 2 0 0 1 16 14ZM5 14H8A2 2 0 0 1 10 16V19A2 2 0 0 1 8 21H5A2 2 0 0 1 3 19V16A2 2 0 0 1 5 14Z" />;
    case "Erase":
      return <path d="M3.59 13.91L13.91 3.59A2 2 0 0 1 16.74 3.59L20.41 7.26A2 2 0 0 1 20.41 10.09L10.09 20.41A2 2 0 0 1 7.26 20.41L3.59 16.74A2 2 0 0 1 3.59 13.91ZM6.63 10.87L13.13 17.37M8.68 21H21" />;
    case "Zoom":
      return (
        <>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.5 15.5 4.5 4.5M8 10.5h5M10.5 8v5" />
        </>
      );
    case "Undo":
      return <path d="M3 9H16A5 5 0 0 1 16 19H11M7 5L3 9L7 13" />;
    case "Redo":
      return <path d="M21 9H8A5 5 0 0 0 8 19H13M17 5L21 9L17 13" />;
    case "SeasonSpring":
      return <path d="M10.5 1.5V3.1M3.6 10H2M5.4512 4.95137L4.31982 3.82M15.5498 4.95137L16.6812 3.82M19 10H17.4M6.50007 10.0001C6.50007 7.79093 8.29093 6.00007 10.5001 6.00007C12.0061 6.00007 13.3177 6.83235 14.0001 8.06206M6 22C3.79086 22 2 20.2091 2 18C2 15.7909 3.79086 14 6 14C6.46419 14 6.90991 14.0791 7.32442 14.2245C8.04061 12.3396 9.86387 11 12 11C14.1361 11 15.9594 12.3396 16.6756 14.2245C17.0901 14.0791 17.5358 14 18 14C20.2091 14 22 15.7909 22 18C22 20.2091 20.2091 22 18 22C13.3597 22 9.87921 22 6 22Z" />;
    case "SeasonSummer":
      return <path d="M12 2V4M12 20V22M4 12H2M6.31412 6.31412L4.8999 4.8999M17.6859 6.31412L19.1001 4.8999M6.31412 17.69L4.8999 19.1042M17.6859 17.69L19.1001 19.1042M22 12H20M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z" />;
    case "SeasonFall":
      return <path d="M16.7639 6.5C17.3132 5.88625 18.1115 5.5 19 5.5C20.6569 5.5 22 6.84315 22 8.5C22 10.1569 20.6569 11.5 19 11.5H13M6.7639 4C7.31322 3.38625 8.1115 3 9 3C10.6569 3 12 4.34315 12 6C12 7.65685 10.6569 9 9 9H2M10.7639 20C11.3132 20.6137 12.1115 21 13 21C14.6569 21 16 19.6569 16 18C16 16.3431 14.6569 15 13 15H2" />;
    case "SeasonWinter":
      return <path d="M18.0622 8.5L5.9378 15.5M18.0622 8.5L19.1602 4.40192M18.0622 8.5L22.1602 9.59808M5.9378 15.5L1.83972 14.4019M5.9378 15.5L4.83972 19.5981M18.0621 15.4999L5.93771 8.49986M18.0621 15.4999L22.1602 14.4018M18.0621 15.4999L19.1602 19.598M5.93771 8.49986L4.83986 4.40203M5.93771 8.49986L1.83986 9.59819M12 5L12 19M12 5L8.99998 2M12 5L15 2M12 19L8.99998 22M12 19L15 22" />;
    default:
      throw new Error(`Planner reference icon name is unsupported: ${JSON.stringify(name)}.`);
  }
}
