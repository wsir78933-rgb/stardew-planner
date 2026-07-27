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
          <value><TerrainFeature xsi:type="HoeDirt"><crop><Crop><seedIndex>24</seedIndex><dead>false</dead></Crop></crop></TerrainFeature></value>
        </item>
        <item>
          <key><Vector2><X>8</X><Y>2</Y></Vector2></key>
          <value><TerrainFeature xsi:type="Flooring"><whichFloor>1</whichFloor></TerrainFeature></value>
        </item>
        <item>
          <key><Vector2><X>9</X><Y>9</Y></Vector2></key>
          <value><TerrainFeature xsi:type="Tree"><treeType>1</treeType></TerrainFeature></value>
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
  it("parses current-supported Farm content and reports unsupported terrain types", () => {
    expect(
      parseStardewGameSaveXml(validGameSaveXml, parseXmlWithXmldom),
    ).toEqual({
      buildings: [{ buildingType: "Barn", x: 10, y: 12 }],
      crops: [{ isDead: false, seedIndex: "24", x: 4, y: 6 }],
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
      unmappedEntries: [
        { kind: "tree", sourceId: "1" },
        { kind: "bush", sourceId: "Medium" },
        { kind: "furniture", sourceId: "123" },
      ],
      whichFarm: "0",
    });
  });

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
});
