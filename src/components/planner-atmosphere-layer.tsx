"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { PlannerAmbienceOptions } from "../editor/planner-ambience-options";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import {
  advancePlannerButterflySimulation,
  createPlannerButterflySimulation,
  getPlannerMapAtmosphereRules,
  getPlannerButterflyMaximumSimulationStepsPerFrame,
  getPlannerButterflySimulationStepMilliseconds,
  getPlannerButterflySpriteFrame,
  type PlannerButterflySimulation,
  type PlannerButterflyState,
  type PlannerDebrisMapType,
} from "./planner-butterfly-simulation";
import styles from "./planner-atmosphere-layer.module.css";

type AtmosphereParticle = Readonly<{
  left: number;
  top: number;
  delay: number;
  duration: number;
  size: number;
}>;

/** Visible map rectangle in CSS pixels relative to the PlannerCanvas root. */
export type PlannerAtmosphereMapViewportBounds = Readonly<{
  left: number;
  top: number;
  width: number;
  height: number;
}>;

/** Current map camera projection in CSS pixels relative to the PlannerCanvas root. */
export type PlannerAtmosphereMapProjection = Readonly<{
  mapFile: string;
  mapWidthTiles: number;
  mapHeightTiles: number;
  mapScreenLeft: number;
  mapScreenTop: number;
  cameraZoom: number;
}>;

export type PlannerAtmosphereLayerProperties = Readonly<{
  mapProjection?: PlannerAtmosphereMapProjection | null;
  mapViewportBounds?: PlannerAtmosphereMapViewportBounds | null;
  options: PlannerAmbienceOptions;
  season: TilesheetSeason;
}>;

export function PlannerAtmosphereLayer({
  mapProjection,
  mapViewportBounds,
  options,
  season,
}: PlannerAtmosphereLayerProperties) {
  const validatedMapViewportBounds = mapViewportBounds == null
    ? null
    : validateMapViewportBounds(mapViewportBounds);
  const validatedMapProjection = mapProjection == null
    ? null
    : validateMapProjection(mapProjection);
  const mapAtmosphereRules = validatedMapProjection === null
    ? null
    : getPlannerMapAtmosphereRules(validatedMapProjection.mapFile);
  const canShowMapAmbienceParticles = options.showDebris && options.weather === "clear";
  const canCreateButterflySimulation =
    validatedMapViewportBounds !== null &&
    validatedMapProjection !== null &&
    canShowMapAmbienceParticles;
  const initialButterflySimulation = useMemo(
    () => canCreateButterflySimulation && validatedMapProjection !== null
      ? createPlannerButterflySimulation(
          validatedMapProjection.mapWidthTiles,
          validatedMapProjection.mapHeightTiles,
          season,
          validatedMapProjection.mapFile,
        )
      : null,
    [
      season,
      canCreateButterflySimulation,
      validatedMapProjection?.mapFile,
      validatedMapProjection?.mapHeightTiles,
      validatedMapProjection?.mapWidthTiles,
    ],
  );
  const [butterflySimulation, setButterflySimulation] =
    useState(initialButterflySimulation);
  const butterflySimulationReference = useRef(initialButterflySimulation);

  useEffect(() => {
    butterflySimulationReference.current = initialButterflySimulation;
    setButterflySimulation(initialButterflySimulation);
  }, [initialButterflySimulation]);

  useEffect(() => {
    if (
      !options.animationsEnabled ||
      initialButterflySimulation === null ||
      initialButterflySimulation.butterflies.length === 0
    ) {
      return;
    }

    let animationFrameId = 0;
    let previousFrameTimestamp: number | null = null;
    let accumulatedMilliseconds = 0;
    const stepMilliseconds = getPlannerButterflySimulationStepMilliseconds();
    const maximumCatchUpMilliseconds =
      stepMilliseconds * getPlannerButterflyMaximumSimulationStepsPerFrame();

    const advanceButterflyFrame = (frameTimestamp: number) => {
      if (previousFrameTimestamp !== null) {
        const elapsedMilliseconds = Math.min(
          frameTimestamp - previousFrameTimestamp,
          maximumCatchUpMilliseconds,
        );
        accumulatedMilliseconds += elapsedMilliseconds;

        let simulationStepCount = 0;
        while (
          accumulatedMilliseconds >= stepMilliseconds &&
          simulationStepCount < getPlannerButterflyMaximumSimulationStepsPerFrame()
        ) {
          const currentSimulation = butterflySimulationReference.current;
          if (currentSimulation !== null) {
            butterflySimulationReference.current = advancePlannerButterflySimulation(
              currentSimulation,
              stepMilliseconds,
            );
          }
          accumulatedMilliseconds -= stepMilliseconds;
          simulationStepCount += 1;
        }

        if (simulationStepCount > 0) {
          setButterflySimulation(butterflySimulationReference.current);
        }
      }

      previousFrameTimestamp = frameTimestamp;
      animationFrameId = window.requestAnimationFrame(advanceButterflyFrame);
    };

    animationFrameId = window.requestAnimationFrame(advanceButterflyFrame);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [initialButterflySimulation, options.animationsEnabled]);

  const activeButterflySimulation =
    butterflySimulation !== null &&
    initialButterflySimulation !== null &&
    butterflySimulation.mapWidthTiles === initialButterflySimulation.mapWidthTiles &&
    butterflySimulation.mapHeightTiles === initialButterflySimulation.mapHeightTiles &&
    butterflySimulation.mapFile === initialButterflySimulation.mapFile &&
    butterflySimulation.season === initialButterflySimulation.season
      ? butterflySimulation
      : initialButterflySimulation;

  const weatherParticles = createWeatherParticles(options.weather);
  const shouldRenderSummerClouds =
    options.showClouds && season === "summer" && options.weather === "clear";
  const seasonalDebris = canShowMapAmbienceParticles && mapAtmosphereRules !== null
    ? createSeasonalDebris(season, mapAtmosphereRules.debris)
    : [];
  const butterflies = canCreateButterflySimulation && activeButterflySimulation !== null
    ? activeButterflySimulation.butterflies
    : [];

  if (validatedMapViewportBounds === null) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`${styles.atmosphere} ${options.animationsEnabled ? "" : styles.paused}`}
      data-season={season}
      data-weather={options.weather}
      data-animations-enabled={options.animationsEnabled}
      data-clouds-enabled={options.showClouds}
      data-debris-enabled={options.showDebris}
    >
      {options.weather === "green-rain" ? (
        <div className={`${styles.weatherTint} ${styles.greenRainTint}`} />
      ) : null}
      {options.weather === "storm" ? (
        <div className={styles.lightningFlash} />
      ) : null}
      {shouldRenderSummerClouds ? (
        <div className={styles.cloudLayer}>
          {createCloudParticles().map((particle, index) => (
            <span
              className={styles.cloud}
              key={`cloud-${index}`}
              style={createParticleStyle(particle)}
            />
          ))}
        </div>
      ) : null}
      {weatherParticles.length > 0 ? (
        <div className={styles.weatherLayer}>
          {weatherParticles.map((particle, index) => (
            <span
              className={`${styles.weatherParticle} ${styles[`${options.weather}Particle`]}`}
              key={`${options.weather}-${index}`}
              style={createParticleStyle(particle)}
            />
          ))}
        </div>
      ) : null}
      {seasonalDebris.length + butterflies.length > 0 ? (
        <div
          className={styles.mapParticleLayer}
          data-atmosphere-map-particles="true"
          style={createMapParticleLayerStyle(validatedMapViewportBounds)}
        >
          {seasonalDebris.map((particle, index) => (
            <span
              className={`${styles.debris} ${styles[`${season}Debris`]}`}
              data-atmosphere-particle="debris"
              key={`${season}-debris-${index}`}
              style={createParticleStyle(particle)}
            />
          ))}
          {butterflies.map((butterfly) => (
            <span
              className={styles.butterfly}
              data-atmosphere-particle="butterfly"
              data-frame={butterfly.frame}
              data-world-x={butterfly.x}
              data-world-y={butterfly.y}
              key={`butterfly-${butterfly.id}`}
              style={createButterflyStyle(
                butterfly,
                validatedMapViewportBounds,
                validatedMapProjection,
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function createWeatherParticles(weather: PlannerAmbienceOptions["weather"]): readonly AtmosphereParticle[] {
  const particleCount = weather === "clear" ? 0 : weather === "snow" ? 38 : 46;
  return createParticles(particleCount, 83, 11, 9);
}

function createSeasonalDebris(
  season: TilesheetSeason,
  debrisMapType: PlannerDebrisMapType,
): readonly AtmosphereParticle[] {
  if (!doesSeasonSupportDebris(season, debrisMapType)) {
    return [];
  }

  const particleCount = 14;
  return createParticles(particleCount, 41, 23, 17);
}

function doesSeasonSupportDebris(
  season: TilesheetSeason,
  debrisMapType: PlannerDebrisMapType,
): boolean {
  if (debrisMapType === "none") {
    return false;
  }
  if (debrisMapType === "island-east") {
    return true;
  }
  if (debrisMapType === "woods") {
    return season !== "winter";
  }

  return season === "spring" || season === "fall";
}

function createMapParticleLayerStyle(
  mapViewportBounds: PlannerAtmosphereMapViewportBounds,
): CSSProperties {
  return {
    left: `${mapViewportBounds.left}px`,
    top: `${mapViewportBounds.top}px`,
    width: `${mapViewportBounds.width}px`,
    height: `${mapViewportBounds.height}px`,
  };
}

function createButterflyStyle(
  butterfly: PlannerButterflyState,
  mapViewportBounds: PlannerAtmosphereMapViewportBounds,
  mapProjection: PlannerAtmosphereMapProjection | null,
): CSSProperties {
  if (mapProjection === null) {
    throw new TypeError("mapProjection is required to position a butterfly sprite; received null.");
  }

  const spriteFrame = getPlannerButterflySpriteFrame(butterfly.frame);
  const worldPixelLeft = (butterfly.x - 64) / 4;
  const worldPixelTop = (butterfly.y - 128) / 4;

  return {
    left: `${mapProjection.mapScreenLeft - mapViewportBounds.left + worldPixelLeft * mapProjection.cameraZoom}px`,
    top: `${mapProjection.mapScreenTop - mapViewportBounds.top + worldPixelTop * mapProjection.cameraZoom}px`,
    backgroundPosition: `-${spriteFrame.left}px -${spriteFrame.top}px`,
    transform: `scale(${mapProjection.cameraZoom})`,
  };
}

function validateMapViewportBounds(
  mapViewportBounds: unknown,
): PlannerAtmosphereMapViewportBounds {
  if (
    typeof mapViewportBounds !== "object" ||
    mapViewportBounds === null ||
    Array.isArray(mapViewportBounds)
  ) {
    throw new TypeError(
      `mapViewportBounds must be an object or null; received ${String(mapViewportBounds)}.`,
    );
  }

  const boundsRecord = mapViewportBounds as Record<string, unknown>;
  const left = readFiniteMapViewportBound("left", boundsRecord.left);
  const top = readFiniteMapViewportBound("top", boundsRecord.top);
  const width = readFiniteMapViewportBound("width", boundsRecord.width);
  const height = readFiniteMapViewportBound("height", boundsRecord.height);

  if (left < 0) {
    throw new RangeError(`mapViewportBounds.left must be at least 0; received ${String(left)}.`);
  }
  if (top < 0) {
    throw new RangeError(`mapViewportBounds.top must be at least 0; received ${String(top)}.`);
  }
  if (width <= 0) {
    throw new RangeError(`mapViewportBounds.width must be greater than 0; received ${String(width)}.`);
  }
  if (height <= 0) {
    throw new RangeError(`mapViewportBounds.height must be greater than 0; received ${String(height)}.`);
  }

  return { left, top, width, height };
}

function validateMapProjection(mapProjection: unknown): PlannerAtmosphereMapProjection {
  if (
    typeof mapProjection !== "object" ||
    mapProjection === null ||
    Array.isArray(mapProjection)
  ) {
    throw new TypeError(
      `mapProjection must be an object or null; received ${String(mapProjection)}.`,
    );
  }

  const projectionRecord = mapProjection as Record<string, unknown>;
  const mapWidthTiles = readFiniteMapProjectionValue(
    "mapWidthTiles",
    projectionRecord.mapWidthTiles,
  );
  const mapHeightTiles = readFiniteMapProjectionValue(
    "mapHeightTiles",
    projectionRecord.mapHeightTiles,
  );
  const mapScreenLeft = readFiniteMapProjectionValue(
    "mapScreenLeft",
    projectionRecord.mapScreenLeft,
  );
  const mapScreenTop = readFiniteMapProjectionValue(
    "mapScreenTop",
    projectionRecord.mapScreenTop,
  );
  const cameraZoom = readFiniteMapProjectionValue(
    "cameraZoom",
    projectionRecord.cameraZoom,
  );
  const mapFile = readMapFile(projectionRecord.mapFile);

  if (!Number.isInteger(mapWidthTiles) || mapWidthTiles <= 0) {
    throw new RangeError(
      `mapProjection.mapWidthTiles must be a positive integer; received ${String(mapWidthTiles)}.`,
    );
  }
  if (!Number.isInteger(mapHeightTiles) || mapHeightTiles <= 0) {
    throw new RangeError(
      `mapProjection.mapHeightTiles must be a positive integer; received ${String(mapHeightTiles)}.`,
    );
  }
  if (cameraZoom <= 0) {
    throw new RangeError(
      `mapProjection.cameraZoom must be greater than 0; received ${String(cameraZoom)}.`,
    );
  }

  return { mapFile, mapWidthTiles, mapHeightTiles, mapScreenLeft, mapScreenTop, cameraZoom };
}

function readMapFile(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(
      `mapProjection.mapFile must be a non-empty string; received ${String(value)}.`,
    );
  }

  return value;
}

function readFiniteMapProjectionValue(
  propertyName:
    | "mapWidthTiles"
    | "mapHeightTiles"
    | "mapScreenLeft"
    | "mapScreenTop"
    | "cameraZoom",
  value: unknown,
): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(
      `mapProjection.${propertyName} must be a finite number; received ${String(value)}.`,
    );
  }

  return value;
}

function readFiniteMapViewportBound(
  boundName: keyof PlannerAtmosphereMapViewportBounds,
  boundValue: unknown,
): number {
  if (typeof boundValue !== "number" || !Number.isFinite(boundValue)) {
    throw new TypeError(
      `mapViewportBounds.${boundName} must be a finite number; received ${String(boundValue)}.`,
    );
  }

  return boundValue;
}

function createCloudParticles(): readonly AtmosphereParticle[] {
  return [
    { left: 7, top: 13, delay: 0, duration: 56, size: 1 },
    { left: 52, top: 8, delay: -21, duration: 67, size: 1.2 },
    { left: 83, top: 24, delay: -39, duration: 74, size: 0.8 },
  ];
}

function createParticles(
  count: number,
  leftMultiplier: number,
  topMultiplier: number,
  delayMultiplier: number,
): readonly AtmosphereParticle[] {
  return Array.from({ length: count }, (_, index) => ({
    left: (index * leftMultiplier) % 100,
    top: (index * topMultiplier) % 96,
    delay: -((index * delayMultiplier) % 37),
    duration: 3.5 + ((index * 7) % 24) / 10,
    size: 0.7 + ((index * 5) % 8) / 10,
  }));
}

function createParticleStyle(particle: AtmosphereParticle): CSSProperties {
  return {
    left: `${particle.left}%`,
    top: `${particle.top}%`,
    animationDelay: `${particle.delay}s`,
    animationDuration: `${particle.duration}s`,
    transform: `scale(${particle.size})`,
  };
}
