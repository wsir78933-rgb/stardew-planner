import { describe, expect, it } from "vitest";
import {
  clonePlacementAnimationOptions,
  restorePlacementAnimationOptions,
} from "../../src/animations/placement-animation-options";

describe("placement animation options", () => {
  it("restores typed options and independently owns their arrays", () => {
    const storedOptions = {
      spriteState: "working",
      readyProduct: "object:348",
      fireplaceLit: true,
      clockOff: false,
      millLoaded: true,
      millOutput: true,
      millProduct: "246",
      fishId: "128",
      population: 5,
      produce: "812",
      tankFish: ["128", "129"],
      animals: [{ animalId: "Cow" }, { animalId: "Goat" }],
      petId: "Cat:0",
      horse: true,
      junimos: false,
      hatId: "1",
      shirtId: "2",
      pantsId: "3",
    };

    const restoredOptions = restorePlacementAnimationOptions(
      storedOptions,
      "animationOptions",
    );
    storedOptions.tankFish.push("130");
    storedOptions.animals[0].animalId = "Sheep";

    expect(restoredOptions).toEqual({
      spriteState: "working",
      readyProduct: "object:348",
      fireplaceLit: true,
      clockOff: false,
      millLoaded: true,
      millOutput: true,
      millProduct: "246",
      fishId: "128",
      population: 5,
      produce: "812",
      tankFish: ["128", "129"],
      animals: [{ animalId: "Cow" }, { animalId: "Goat" }],
      petId: "Cat:0",
      horse: true,
      junimos: false,
      hatId: "1",
      shirtId: "2",
      pantsId: "3",
    });

    const clonedOptions = clonePlacementAnimationOptions(restoredOptions);
    expect(clonedOptions).not.toBe(restoredOptions);
    expect(clonedOptions.tankFish).not.toBe(restoredOptions.tankFish);
    expect(clonedOptions.animals).not.toBe(restoredOptions.animals);
  });

  it("rejects unknown fields and invalid bounded values with their field paths", () => {
    expect(() =>
      restorePlacementAnimationOptions(
        { fishType: "128" },
        "items[0].animationOptions",
      ),
    ).toThrow('items[0].animationOptions" does not allow property "fishType"');

    expect(() =>
      restorePlacementAnimationOptions(
        { population: -1 },
        "buildings[0].animationOptions",
      ),
    ).toThrow('buildings[0].animationOptions.population" must be a non-negative safe integer; received -1');

    expect(() =>
      restorePlacementAnimationOptions(
        { petId: "Cat" },
        "items[0].animationOptions",
      ),
    ).toThrow('items[0].animationOptions.petId" must use the form "Cat:<breed>"');

    expect(() =>
      restorePlacementAnimationOptions(
        { millLoaded: "true" },
        "buildings[0].animationOptions",
      ),
    ).toThrow('buildings[0].animationOptions.millLoaded" must be a boolean; received "true"');

    expect(() =>
      restorePlacementAnimationOptions(
        { millOutput: "true" },
        "buildings[0].animationOptions",
      ),
    ).toThrow('buildings[0].animationOptions.millOutput" must be a boolean; received "true"');

    expect(() =>
      restorePlacementAnimationOptions(
        { millProduct: "" },
        "buildings[0].animationOptions",
      ),
    ).toThrow('buildings[0].animationOptions.millProduct" must be a non-empty string of at most 64 characters; received ""');
  });

  it("includes object values and serialization failures in boundary errors", () => {
    expect(() =>
      restorePlacementAnimationOptions(
        { population: { unexpected: 1 } },
        "buildings[0].animationOptions",
      ),
    ).toThrow('buildings[0].animationOptions.population" must be a non-negative safe integer; received {"unexpected":1}');

    const circularValue: Record<string, unknown> = {};
    circularValue.self = circularValue;

    expect(() =>
      restorePlacementAnimationOptions(
        { population: circularValue },
        "buildings[0].animationOptions",
      ),
    ).toThrow(/received <non-JSON object value; JSON\.stringify failed:/);
  });
});
