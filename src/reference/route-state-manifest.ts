import type {
  ReferenceRoute,
  ReferenceState,
  ReferenceToolMode,
} from "./route-state";

type PlannerScenario = {
  id: string;
  action: string;
  desktopExpectedVisibleResult: string;
  mobileExpectedVisibleResult: string;
  toolMode: ReferenceToolMode;
  selectedEntity: string | null;
  modalState: string | null;
};

function createPlannerViewportStates(
  plannerScenario: PlannerScenario,
): readonly ReferenceState[] {
  return [
    {
      id: `desktop-${plannerScenario.id}`,
      action: plannerScenario.action,
      expectedVisibleResult: plannerScenario.desktopExpectedVisibleResult,
      viewport: "desktop",
      toolMode: plannerScenario.toolMode,
      selectedEntity: plannerScenario.selectedEntity,
      modalState: plannerScenario.modalState,
    },
    {
      id: `mobile-${plannerScenario.id}`,
      action: plannerScenario.action,
      expectedVisibleResult: plannerScenario.mobileExpectedVisibleResult,
      viewport: "mobile",
      toolMode: plannerScenario.toolMode,
      selectedEntity: plannerScenario.selectedEntity,
      modalState: plannerScenario.modalState,
    },
  ];
}

const plannerScenarios: readonly PlannerScenario[] = [
  {
    id: "idle",
    action: "Open the planner.",
    desktopExpectedVisibleResult:
      "The farm map, top tool bar, category catalog, and inspector are visible in the desktop workspace.",
    mobileExpectedVisibleResult:
      "The farm map, touch tools, and mobile catalog panel are visible in the mobile workspace.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: null,
  },
  {
    id: "map-picker",
    action: "Open the map picker.",
    desktopExpectedVisibleResult:
      "A desktop map picker shows official farms, Ginger Island, interiors, and supported Mod maps.",
    mobileExpectedVisibleResult:
      "A mobile map picker shows official farms, Ginger Island, interiors, and supported Mod maps.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "map-picker",
  },
  {
    id: "catalog",
    action: "Open an object category in the catalog.",
    desktopExpectedVisibleResult:
      "The desktop catalog shows the selected category's placeable item grid and search controls.",
    mobileExpectedVisibleResult:
      "The mobile catalog panel shows the selected category's placeable item grid and search controls.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "catalog",
  },
  {
    id: "local-projects",
    action:
      "Open the browser-local Projects panel and save to the current browser local project.",
    desktopExpectedVisibleResult:
      "The desktop panel displays current browser local projects, provides a control to save to the current browser local project, and offers create, open, rename, duplicate, and delete controls.",
    mobileExpectedVisibleResult:
      "The mobile panel displays current browser local projects, provides a control to save to the current browser local project, and offers create, open, rename, duplicate, and delete controls.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "projects",
  },
  {
    id: "json-import",
    action: "Choose farm-plan JSON import.",
    desktopExpectedVisibleResult:
      "The desktop file chooser is ready to import a farm-plan JSON file into the current browser.",
    mobileExpectedVisibleResult:
      "The mobile file chooser is ready to import a farm-plan JSON file into the current browser.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "json-import",
  },
  {
    id: "json-export",
    action: "Choose farm-plan JSON export.",
    desktopExpectedVisibleResult:
      "The desktop export control downloads the current plan as a farm-plan JSON file.",
    mobileExpectedVisibleResult:
      "The mobile export control downloads the current plan as a farm-plan JSON file.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "export-menu",
  },
  {
    id: "game-save-import",
    action: "Choose local game-save import.",
    desktopExpectedVisibleResult:
      "The desktop file chooser is ready to read a local Stardew Valley game-save file.",
    mobileExpectedVisibleResult:
      "The mobile file chooser is ready to read a local Stardew Valley game-save file.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "game-save-import",
  },
  {
    id: "png-export",
    action: "Export a 1x PNG image.",
    desktopExpectedVisibleResult:
      "The desktop export control creates a 1x PNG image of the current map.",
    mobileExpectedVisibleResult:
      "The mobile export control creates a 1x PNG image of the current map.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "export-menu",
  },
  {
    id: "hq-png-export",
    action: "Export an HQ PNG image.",
    desktopExpectedVisibleResult:
      "The desktop export control creates an HQ PNG image of the current map.",
    mobileExpectedVisibleResult:
      "The mobile export control creates an HQ PNG image of the current map.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "export-menu",
  },
  {
    id: "farm-summary",
    action: "Open the farm summary.",
    desktopExpectedVisibleResult:
      "The desktop farm summary shows counts and map information for the current plan.",
    mobileExpectedVisibleResult:
      "The mobile farm summary shows counts and map information for the current plan.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "farm-summary",
  },
  {
    id: "csv-export",
    action: "Export the farm summary as CSV.",
    desktopExpectedVisibleResult:
      "The desktop summary control downloads the current farm summary as a CSV file.",
    mobileExpectedVisibleResult:
      "The mobile summary control downloads the current farm summary as a CSV file.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "farm-summary",
  },
  {
    id: "placement-validation",
    action: "Attempt to place an object on a blocked tile.",
    desktopExpectedVisibleResult:
      "The desktop map keeps the blocked tile unchanged and shows a placement validation notice.",
    mobileExpectedVisibleResult:
      "The mobile map keeps the blocked tile unchanged and shows a placement validation notice.",
    toolMode: "cursor",
    selectedEntity: "wooden-fence",
    modalState: null,
  },
  {
    id: "cursor-placement",
    action: "Place the selected object with the Cursor tool.",
    desktopExpectedVisibleResult:
      "A wooden fence is placed at the selected valid desktop map tile.",
    mobileExpectedVisibleResult:
      "A wooden fence is placed at the selected valid mobile map tile.",
    toolMode: "cursor",
    selectedEntity: "wooden-fence",
    modalState: null,
  },
  {
    id: "fill",
    action: "Use the Fill tool on a matching tile region.",
    desktopExpectedVisibleResult:
      "The desktop matching tile region is filled with the selected stone flooring.",
    mobileExpectedVisibleResult:
      "The mobile matching tile region is filled with the selected stone flooring.",
    toolMode: "fill",
    selectedEntity: "stone-flooring",
    modalState: null,
  },
  {
    id: "eraser",
    action: "Use the Eraser tool on a placed object.",
    desktopExpectedVisibleResult:
      "The selected placed object is removed from the desktop map.",
    mobileExpectedVisibleResult:
      "The selected placed object is removed from the mobile map.",
    toolMode: "eraser",
    selectedEntity: null,
    modalState: null,
  },
  {
    id: "marquee-selection",
    action: "Drag a marquee around placed objects.",
    desktopExpectedVisibleResult:
      "The desktop marquee highlights the enclosed placed-object region.",
    mobileExpectedVisibleResult:
      "The mobile marquee highlights the enclosed placed-object region.",
    toolMode: "multi-select",
    selectedEntity: "placed-object-region",
    modalState: null,
  },
  {
    id: "selection-edit",
    action: "Edit the selected placed-object region.",
    desktopExpectedVisibleResult:
      "The desktop selection inspector shows editable properties for the placed-object region.",
    mobileExpectedVisibleResult:
      "The mobile selection inspector shows editable properties for the placed-object region.",
    toolMode: "multi-select",
    selectedEntity: "placed-object-region",
    modalState: "selection-inspector",
  },
  {
    id: "selection-move",
    action: "Move the selected placed-object region.",
    desktopExpectedVisibleResult:
      "The selected placed-object region moves to a valid desktop map position.",
    mobileExpectedVisibleResult:
      "The selected placed-object region moves to a valid mobile map position.",
    toolMode: "multi-select",
    selectedEntity: "placed-object-region",
    modalState: "selection-inspector",
  },
  {
    id: "selection-duplicate",
    action: "Duplicate the selected placed-object region.",
    desktopExpectedVisibleResult:
      "A duplicate of the selected placed-object region appears at a valid desktop map position.",
    mobileExpectedVisibleResult:
      "A duplicate of the selected placed-object region appears at a valid mobile map position.",
    toolMode: "multi-select",
    selectedEntity: "placed-object-region",
    modalState: "selection-inspector",
  },
  {
    id: "undo",
    action: "Choose Undo after a planner change.",
    desktopExpectedVisibleResult:
      "The most recent desktop planner change is reversed.",
    mobileExpectedVisibleResult:
      "The most recent mobile planner change is reversed.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: null,
  },
  {
    id: "redo",
    action: "Choose Redo after an undo.",
    desktopExpectedVisibleResult:
      "The reversed desktop planner change is applied again.",
    mobileExpectedVisibleResult:
      "The reversed mobile planner change is applied again.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: null,
  },
  {
    id: "map-switching",
    action: "Switch to another farm map.",
    desktopExpectedVisibleResult:
      "The desktop planner displays the selected farm map and its map-specific controls.",
    mobileExpectedVisibleResult:
      "The mobile planner displays the selected farm map and its map-specific controls.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "map-picker",
  },
  {
    id: "season-switching",
    action: "Switch the visible season.",
    desktopExpectedVisibleResult:
      "The desktop map displays the selected season's visual treatment.",
    mobileExpectedVisibleResult:
      "The mobile map displays the selected season's visual treatment.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "season-picker",
  },
  {
    id: "overlay-grid",
    action: "Enable the Grid overlay.",
    desktopExpectedVisibleResult:
      "Grid cells are visibly overlaid across the desktop map.",
    mobileExpectedVisibleResult:
      "Grid cells are visibly overlaid across the mobile map.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "overlays",
  },
  {
    id: "overlay-buildable",
    action: "Enable the Buildable overlay.",
    desktopExpectedVisibleResult:
      "Buildable tiles are visibly marked on the desktop map.",
    mobileExpectedVisibleResult:
      "Buildable tiles are visibly marked on the mobile map.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "overlays",
  },
  {
    id: "overlay-crop",
    action: "Enable the Crop overlay.",
    desktopExpectedVisibleResult:
      "Crop tiles are visibly marked on the desktop map.",
    mobileExpectedVisibleResult:
      "Crop tiles are visibly marked on the mobile map.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "overlays",
  },
  {
    id: "overlay-tree",
    action: "Enable the Tree overlay.",
    desktopExpectedVisibleResult:
      "Tree tiles are visibly marked on the desktop map.",
    mobileExpectedVisibleResult:
      "Tree tiles are visibly marked on the mobile map.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "overlays",
  },
  {
    id: "overlay-npc-path",
    action: "Enable the NPC Path overlay.",
    desktopExpectedVisibleResult:
      "NPC path tiles are visibly marked on the desktop map.",
    mobileExpectedVisibleResult:
      "NPC path tiles are visibly marked on the mobile map.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "overlays",
  },
  {
    id: "overlay-night",
    action: "Enable Night mode.",
    desktopExpectedVisibleResult:
      "The desktop map displays the night visual treatment.",
    mobileExpectedVisibleResult:
      "The mobile map displays the night visual treatment.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "overlays",
  },
  {
    id: "overlay-sprinkler",
    action: "Enable the Sprinkler overlay.",
    desktopExpectedVisibleResult:
      "Sprinkler coverage is visibly marked on the desktop map.",
    mobileExpectedVisibleResult:
      "Sprinkler coverage is visibly marked on the mobile map.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "overlays",
  },
  {
    id: "overlay-scarecrow",
    action: "Enable the Scarecrow overlay.",
    desktopExpectedVisibleResult:
      "Scarecrow coverage is visibly marked on the desktop map.",
    mobileExpectedVisibleResult:
      "Scarecrow coverage is visibly marked on the mobile map.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "overlays",
  },
  {
    id: "overlay-bee-house",
    action: "Enable the Bee House overlay.",
    desktopExpectedVisibleResult:
      "Bee House flower coverage is visibly marked on the desktop map.",
    mobileExpectedVisibleResult:
      "Bee House flower coverage is visibly marked on the mobile map.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "overlays",
  },
  {
    id: "overlay-junimo-hut",
    action: "Enable the Junimo Hut overlay.",
    desktopExpectedVisibleResult:
      "Junimo Hut coverage is visibly marked on the desktop map.",
    mobileExpectedVisibleResult:
      "Junimo Hut coverage is visibly marked on the mobile map.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "overlays",
  },
  {
    id: "overlay-resource-clump",
    action: "Enable the Resource Clumps overlay.",
    desktopExpectedVisibleResult:
      "Resource Clump positions are visibly marked on the desktop map.",
    mobileExpectedVisibleResult:
      "Resource Clump positions are visibly marked on the mobile map.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "overlays",
  },
  {
    id: "weather-unavailable",
    action: "Open the Weather control.",
    desktopExpectedVisibleResult:
      "The Weather control remains visibly unavailable in the desktop planner.",
    mobileExpectedVisibleResult:
      "The Weather control remains visibly unavailable in the mobile planner.",
    toolMode: "cursor",
    selectedEntity: null,
    modalState: "overlays",
  },
];

const plannerStates = plannerScenarios.flatMap(createPlannerViewportStates);

export const referenceRoutes: readonly ReferenceRoute[] = [
  {
    id: "planner",
    path: "/",
    viewport: ["desktop", "mobile"],
    acceptancePurpose:
      "Validate the complete browser-local farm-planning workspace on desktop and mobile.",
    states: plannerStates,
  },
  {
    id: "privacy",
    path: "/privacy",
    viewport: ["desktop", "mobile"],
    acceptancePurpose:
      "Present browser-local privacy information in the public legal-page layout.",
    states: [
      {
        id: "desktop-privacy-idle",
        action: "Open the privacy page.",
        expectedVisibleResult:
          "Browser-local privacy information is visible on desktop.",
        viewport: "desktop",
        toolMode: null,
        selectedEntity: null,
        modalState: null,
      },
      {
        id: "mobile-privacy-idle",
        action: "Open the privacy page.",
        expectedVisibleResult:
          "Browser-local privacy information is visible on mobile.",
        viewport: "mobile",
        toolMode: null,
        selectedEntity: null,
        modalState: null,
      },
    ],
  },
  {
    id: "terms",
    path: "/terms",
    viewport: ["desktop", "mobile"],
    acceptancePurpose:
      "Present browser-local terms in the public legal-page layout.",
    states: [
      {
        id: "desktop-terms-idle",
        action: "Open the terms page.",
        expectedVisibleResult: "Browser-local terms are visible on desktop.",
        viewport: "desktop",
        toolMode: null,
        selectedEntity: null,
        modalState: null,
      },
      {
        id: "mobile-terms-idle",
        action: "Open the terms page.",
        expectedVisibleResult: "Browser-local terms are visible on mobile.",
        viewport: "mobile",
        toolMode: null,
        selectedEntity: null,
        modalState: null,
      },
    ],
  },
];
