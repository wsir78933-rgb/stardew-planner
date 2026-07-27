export interface TmxProperties {
  readonly [propertyName: string]: string;
}

export interface TmxTileset {
  readonly firstGid: number;
  readonly name: string;
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly tileCount: number;
  readonly columns: number;
  readonly imageSource: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
  readonly properties: TmxProperties;
  readonly tileProperties: ReadonlyMap<number, TmxProperties>;
}

export interface TmxTileLayer {
  readonly id: number | null;
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly visible: boolean;
  readonly opacity: number;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly properties: TmxProperties;
  readonly rawGids: Uint32Array;
}

export interface TmxObject {
  readonly id: number | null;
  readonly name: string;
  readonly type: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly rotation: number;
  readonly visible: boolean;
  readonly properties: TmxProperties;
}

export interface TmxObjectLayer {
  readonly id: number | null;
  readonly name: string;
  readonly visible: boolean;
  readonly locked: boolean;
  readonly opacity: number;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly properties: TmxProperties;
  readonly objects: readonly TmxObject[];
}

export interface TmxMap {
  readonly width: number;
  readonly height: number;
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly properties: TmxProperties;
  readonly tilesets: readonly TmxTileset[];
  readonly tileLayers: readonly TmxTileLayer[];
  readonly objectLayers: readonly TmxObjectLayer[];
  readonly tileDataProperties: ReadonlyMap<string, TmxProperties>;
}
