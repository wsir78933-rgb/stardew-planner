import { DOMParser } from "@xmldom/xmldom";
import { describe, expect, it } from "vitest";
import { parseStardewGameSaveXml } from "../../src/game-save/stardew-save-xml";

const validGameSaveXml = `
<SaveGame xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <whichFarm>0</whichFarm>
  <currentSeason>summer</currentSeason>
  <player><farmName>Junimo</farmName></player>
  <locations>
    <GameLocation>
      <name>Farm</name>
      <buildings>
        <Building><buildingType>Barn</buildingType><tileX>10</tileX><tileY>12</tileY></Building>
      </buildings>
      <objects>
        <item>
          <key><Vector2><X>3</X><Y>5</Y></Vector2></key>
          <value><Object><itemId>390</itemId><bigCraftable>false</bigCraftable><flipped>true</flipped><heldObject><Object><itemId>915</itemId></Object></heldObject><playerChoiceColor><Color><R>18</R><G>52</G><B>86</B></Color></playerChoiceColor></Object></value>
        </item>
      </objects>
      <terrainFeatures>
        <item>
          <key><Vector2><X>4</X><Y>6</Y></Vector2></key>
          <value><TerrainFeature xsi:type="HoeDirt"><state>1</state><crop><Crop><seedIndex>24</seedIndex><dead>false</dead></Crop></crop></TerrainFeature></value>
        </item>
        <item>
          <key><Vector2><X>8</X><Y>2</Y></Vector2></key>
          <value><TerrainFeature xsi:type="Flooring"><whichFloor>1</whichFloor></TerrainFeature></value>
        </item>
        <item>
          <key><Vector2><X>9</X><Y>9</Y></Vector2></key>
          <value><TerrainFeature xsi:type="Tree"><treeType>1</treeType><growthStage>4</growthStage><flipped>true</flipped><hasMoss>true</hasMoss><stump>false</stump></TerrainFeature></value>
        </item>
        <item>
          <key><Vector2><X>10</X><Y>10</Y></Vector2></key>
          <value><TerrainFeature xsi:type="Grass"><grassType>1</grassType></TerrainFeature></value>
        </item>
        <item>
          <key><Vector2><X>11</X><Y>12</Y></Vector2></key>
          <value><TerrainFeature xsi:type="FruitTree"><treeId>633</treeId><growthStage>3</growthStage><flipped>true</flipped><stump>true</stump></TerrainFeature></value>
        </item>
        <item>
          <key><Vector2><X>13</X><Y>14</Y></Vector2></key>
          <value><TerrainFeature xsi:type="Tree"><treeType>2</treeType><growthStage>5</growthStage></TerrainFeature></value>
        </item>
        <item>
          <key><Vector2><X>15</X><Y>16</Y></Vector2></key>
          <value><TerrainFeature xsi:type="HoeDirt" /></value>
        </item>
      </terrainFeatures>
      <resourceClumps>
        <ResourceClump><parentSheetIndex>600</parentSheetIndex><tile><Vector2><X>14</X><Y>15</Y></Vector2></tile></ResourceClump>
      </resourceClumps>
      <largeTerrainFeatures>
        <LargeTerrainFeature xsi:type="Bush"><size>Medium</size></LargeTerrainFeature>
      </largeTerrainFeatures>
      <furniture>
        <Furniture><itemId>123</itemId></Furniture>
      </furniture>
    </GameLocation>
  </locations>
</SaveGame>`;

function parseXmlWithXmldom(xmlSource: string): Document {
  return new DOMParser().parseFromString(xmlSource, "application/xml") as unknown as Document;
}

describe("Stardew game save XML", () => {
  it("reads paintable chest playerChoiceColor values and defaults a missing value", () => {
    const chestSaveXml = validGameSaveXml.replace(
      `<objects>\n        <item>\n          <key><Vector2><X>3</X><Y>5</Y></Vector2></key>\n          <value><Object><itemId>390</itemId><bigCraftable>false</bigCraftable><flipped>true</flipped><heldObject><Object><itemId>915</itemId></Object></heldObject><playerChoiceColor><Color><R>18</R><G>52</G><B>86</B></Color></playerChoiceColor></Object></value>\n        </item>\n      </objects>`,
      `<objects>\n        <item><key><Vector2><X>1</X><Y>2</Y></Vector2></key><value><Object><itemId>130</itemId><bigCraftable>true</bigCraftable><playerChoiceColor><Color><R>18</R><G>52</G><B>86</B></Color></playerChoiceColor></Object></value></item>\n        <item><key><Vector2><X>3</X><Y>4</Y></Vector2></key><value><Object><itemId>232</itemId><bigCraftable>true</bigCraftable></Object></value></item>\n      </objects>`,
    );

    expect(parseStardewGameSaveXml(chestSaveXml, parseXmlWithXmldom).objects).toEqual([
      expect.objectContaining({ itemId: "130", isBigCraftable: true, tintColor: "#123456", x: 1, y: 2 }),
      expect.objectContaining({ itemId: "232", isBigCraftable: true, tintColor: "#ffffff", x: 3, y: 4 }),
    ]);
  });

  it("parses supported Farm content and preserves mixed wild/fruit tree order", () => {
    expect(
      parseStardewGameSaveXml(validGameSaveXml, parseXmlWithXmldom),
    ).toEqual({
      buildings: [{ buildingType: "Barn", x: 10, y: 12 }],
      crops: [
        { hoeDirtState: 1, isDead: false, seedIndex: "24", x: 4, y: 6 },
        { hoeDirtState: 0, isDead: false, seedIndex: null, x: 15, y: 16 },
      ],
      farmName: "Junimo",
      floorings: [{ whichFloor: "1", x: 8, y: 2 }],
      objects: [
        {
          flipped: true,
          heldObjectId: "915",
          isBigCraftable: false,
          itemId: "390",
          tintColor: "#123456",
          x: 3,
          y: 5,
        },
      ],
      resourceClumps: [{ parentSheetIndex: 600, x: 14, y: 15 }],
      season: "summer",
      trees: [
        {
          flipped: true,
          growthStage: 4,
          hasMoss: true,
          kind: "wild-tree",
          stump: false,
          treeType: "1",
          x: 9,
          y: 9,
        },
        {
          flipped: true,
          growthStage: 3,
          kind: "fruit-tree",
          stump: true,
          treeId: "633",
          x: 11,
          y: 12,
        },
        {
          flipped: false,
          growthStage: 5,
          hasMoss: false,
          kind: "wild-tree",
          stump: false,
          treeType: "2",
          x: 13,
          y: 14,
        },
      ],
      unmappedEntries: [
        { kind: "grass", sourceId: "1" },
        { kind: "bush", sourceId: "Medium" },
        { kind: "furniture", sourceId: "123" },
      ],
      whichFarm: "0",
    });
  });

  it("preserves a present Fish Pond nettingStyle and omits a missing one", () => {
    const fishPondSaveXml = validGameSaveXml.replace(
      "<Building><buildingType>Barn</buildingType><tileX>10</tileX><tileY>12</tileY></Building>",
      "<Building><buildingType>Fish Pond</buildingType><tileX>10</tileX><tileY>12</tileY><nettingStyle>-5</nettingStyle></Building>" +
        "<Building><buildingType>Barn</buildingType><tileX>20</tileX><tileY>21</tileY></Building>",
    );

    expect(
      parseStardewGameSaveXml(fishPondSaveXml, parseXmlWithXmldom).buildings,
    ).toEqual([
      { buildingType: "Fish Pond", nettingStyle: -5, x: 10, y: 12 },
      { buildingType: "Barn", x: 20, y: 21 },
    ]);
  });

  it.each(["wet", "9007199254740992"])(
    "rejects invalid Fish Pond nettingStyle %s with its source path and value",
    (nettingStyle) => {
      const invalidFishPondSaveXml = validGameSaveXml.replace(
        "<tileY>12</tileY>",
        `<tileY>12</tileY><nettingStyle>${nettingStyle}</nettingStyle>`,
      );

      expect(() => parseStardewGameSaveXml(
        invalidFishPondSaveXml,
        parseXmlWithXmldom,
      )).toThrow(
        `Farm.buildings[0].nettingStyle\" must be a safe integer; received \"${nettingStyle}\"`,
      );
    },
  );

  it("rejects non-save XML and missing Farm location with explicit import errors", () => {
    expect(() =>
      parseStardewGameSaveXml("<root />", parseXmlWithXmldom),
    ).toThrow("Not a Stardew Valley save file.");

    expect(() =>
      parseStardewGameSaveXml(
        "<SaveGame><locations><GameLocation><name>Town</name></GameLocation></locations></SaveGame>",
        parseXmlWithXmldom,
      ),
    ).toThrow("Failed to import save file: no Farm location was found.");
  });

  it("fails fast when a saved building is missing its required type", () => {
    const saveXmlWithUntypedBuilding = validGameSaveXml.replace(
      "<buildingType>Barn</buildingType>",
      "",
    );

    expect(() =>
      parseStardewGameSaveXml(saveXmlWithUntypedBuilding, parseXmlWithXmldom),
    ).toThrow(
      'required <buildingType> element is missing at Farm.buildings[0]',
    );
  });

  it("rejects negative player-choice color channels", () => {
    const saveXmlWithNegativeColorChannel = validGameSaveXml.replace(
      "<R>18</R>",
      "<R>-1</R>",
    );

    expect(() =>
      parseStardewGameSaveXml(
        saveXmlWithNegativeColorChannel,
        parseXmlWithXmldom,
      ),
    ).toThrow('must be between 0 and 255; received -1');
  });

  it.each([
    [
      "missing wild tree type",
      "<treeType>1</treeType>",
      "",
      'Game save XML field "Farm.terrainFeatures[2].Tree.treeType" is required; received undefined.',
    ],
    [
      "negative wild growth stage",
      "<growthStage>4</growthStage>",
      "<growthStage>-1</growthStage>",
      'field "Farm.terrainFeatures[2].Tree.growthStage" must be a non-negative safe integer; received "-1"',
    ],
    [
      "invalid wild moss flag",
      "<hasMoss>true</hasMoss>",
      "<hasMoss>yes</hasMoss>",
      'field "Farm.terrainFeatures[2].Tree.hasMoss" must be "true" or "false"; received "yes"',
    ],
    [
      "invalid HoeDirt state",
      "<state>1</state>",
      "<state>wet</state>",
      'field "Farm.terrainFeatures[0].HoeDirt.state" must be a safe integer; received "wet"',
    ],
    [
      "unsafe HoeDirt state",
      "<state>1</state>",
      "<state>9007199254740992</state>",
      'field "Farm.terrainFeatures[0].HoeDirt.state" must be a safe integer; received "9007199254740992"',
    ],
    [
      "invalid wild tree X coordinate",
      "<X>9</X>",
      "<X>east</X>",
      'field "Farm.terrainFeatures[2].key.X" must be a safe integer; received "east"',
    ],
    [
      "missing fruit tree ID",
      "<treeId>633</treeId>",
      "",
      'Game save XML field "Farm.terrainFeatures[4].FruitTree.treeId" is required; received undefined.',
    ],
    [
      "invalid fruit stump flag",
      "<stump>true</stump>",
      "<stump>1</stump>",
      'field "Farm.terrainFeatures[4].FruitTree.stump" must be "true" or "false"; received "1"',
    ],
  ])("fails fast for %s with the exact XML path", (_caseName, source, replacement, errorMessage) => {
    expect(() =>
      parseStardewGameSaveXml(
        validGameSaveXml.replace(source, replacement),
        parseXmlWithXmldom,
      ),
    ).toThrow(errorMessage);
  });
});
