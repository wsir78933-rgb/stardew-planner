import { describe, expect, it, vi } from "vitest";
import {
  createCanonicalMapIdentityReference,
  createCanonicalSessionTransition,
  getCurrentCanonicalSession,
} from "../../src/planner/planner-workspace-canonical-session";
import type { ReferenceOpenMapSession } from "../../src/reference-runtime/reference-project-editor-adapter";

function createSession(projectId: string, mapId: string, mapFile: string): ReferenceOpenMapSession {
  return {
    projectId,
    mapId,
    sourceMap: { id: mapId, mapFile },
    placementSnapshot: {
      buildings: [], crops: [], items: [], nextBuildingId: 1, nextItemId: 1,
      interiorDecor: { wallpapers: {}, floors: {} },
    },
    season: "spring",
    interiorDecor: { wallpapers: {}, floors: {} },
    buildingCanonicalToTransientIds: new Map(),
    itemCanonicalToTransientIds: new Map(),
    originalNextBuildingId: 1,
    originalNextItemId: 1,
  } as unknown as ReferenceOpenMapSession;
}

describe("planner workspace canonical session", () => {
  it("opens a new canonical identity once and ignores a refreshed same identity", () => {
    const getPlannerMapIdForMapFile = vi.fn(() => "standard-farm");
    const canonicalMapIdentityReference = createCanonicalMapIdentityReference();
    const firstSession = createSession("project::one", "map::one", "Farm.tmx");

    expect(createCanonicalSessionTransition(
      firstSession,
      { getPlannerMapIdForMapFile },
      canonicalMapIdentityReference,
    )).toMatchObject({
      type: "open-canonical-map",
      activeProjectId: "project::one",
      activeMapId: "map::one",
      plannerMapId: "standard-farm",
    });
    expect(createCanonicalSessionTransition(
      createSession("project::one", "map::one", "Farm.tmx"),
      { getPlannerMapIdForMapFile },
      canonicalMapIdentityReference,
    )).toBeNull();
    expect(getPlannerMapIdForMapFile).toHaveBeenCalledTimes(1);
  });

  it("clears a null identity so the same canonical map may open again", () => {
    const getPlannerMapIdForMapFile = vi.fn(() => "standard-farm");
    const canonicalMapIdentityReference = createCanonicalMapIdentityReference();
    const canonicalSession = createSession("project", "map", "Farm.tmx");
    createCanonicalSessionTransition(canonicalSession, { getPlannerMapIdForMapFile }, canonicalMapIdentityReference);
    expect(createCanonicalSessionTransition(
      null,
      { getPlannerMapIdForMapFile },
      canonicalMapIdentityReference,
    )).toBeNull();
    expect(createCanonicalSessionTransition(
      canonicalSession,
      { getPlannerMapIdForMapFile },
      canonicalMapIdentityReference,
    )).not.toBeNull();
  });

  it("does not retain an identity when exact map lookup fails", () => {
    const getPlannerMapIdForMapFile = vi.fn(() => { throw new Error('unknown map file'); });
    const canonicalMapIdentityReference = createCanonicalMapIdentityReference();
    const canonicalSession = createSession("project", "map", "Unknown.tmx");
    expect(() => createCanonicalSessionTransition(
      canonicalSession,
      { getPlannerMapIdForMapFile },
      canonicalMapIdentityReference,
    )).toThrow("unknown map file");
    expect(canonicalMapIdentityReference.current).toBeNull();
  });

  it("returns the active canonical session only for the exact project, map, and planner map", () => {
    const canonicalSession = createSession("project", "map", "Farm.tmx");
    const canonicalMapLookup = {
      getPlannerMapIdForMapFile: vi.fn(() => "standard"),
    };

    expect(getCurrentCanonicalSession(
      canonicalSession,
      {
        activeProjectId: "project",
        activeMapId: "map",
        selectedPlannerMapId: "standard",
      },
      canonicalMapLookup,
    )).toBe(canonicalSession);
    expect(getCurrentCanonicalSession(
      canonicalSession,
      {
        activeProjectId: "project",
        activeMapId: "map",
        selectedPlannerMapId: "standard",
      },
      canonicalMapLookup,
    )).toBe(canonicalSession);
    expect(canonicalMapLookup.getPlannerMapIdForMapFile).toHaveBeenCalledTimes(2);
  });

  it.each([
    [null, "map", "standard"],
    ["project", null, "standard"],
    ["other-project", "map", "standard"],
    ["project", "other-map", "standard"],
    ["project", "map", "forest"],
  ] as const)("returns null for a non-current canonical identity", (
    activeProjectId,
    activeMapId,
    selectedPlannerMapId,
  ) => {
    const canonicalMapLookup = {
      getPlannerMapIdForMapFile: vi.fn(() => "standard"),
    };

    expect(getCurrentCanonicalSession(
      createSession("project", "map", "Farm.tmx"),
      { activeProjectId, activeMapId, selectedPlannerMapId },
      canonicalMapLookup,
    )).toBeNull();
  });

  it("returns null without map lookup when no active canonical session exists", () => {
    const canonicalMapLookup = {
      getPlannerMapIdForMapFile: vi.fn(() => "standard"),
    };

    expect(getCurrentCanonicalSession(
      null,
      { activeProjectId: "project", activeMapId: "map", selectedPlannerMapId: "standard" },
      canonicalMapLookup,
    )).toBeNull();
    expect(canonicalMapLookup.getPlannerMapIdForMapFile).not.toHaveBeenCalled();
  });

  it("propagates an exact map lookup error and ignores a session season change", () => {
    const canonicalSession = createSession("project", "map", "Farm.tmx");
    const lookupError = new Error("unknown map file");
    const throwingLookup = {
      getPlannerMapIdForMapFile: vi.fn(() => { throw lookupError; }),
    };

    expect(() => getCurrentCanonicalSession(
      canonicalSession,
      { activeProjectId: "project", activeMapId: "map", selectedPlannerMapId: "standard" },
      throwingLookup,
    )).toThrow(lookupError);

    const winterSession = { ...canonicalSession, season: "winter" as const };
    expect(getCurrentCanonicalSession(
      winterSession,
      { activeProjectId: "project", activeMapId: "map", selectedPlannerMapId: "standard" },
      { getPlannerMapIdForMapFile: () => "standard" },
    )).toBe(winterSession);
  });
});
