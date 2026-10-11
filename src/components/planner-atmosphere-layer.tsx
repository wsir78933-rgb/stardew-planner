"use client";

import type { CSSProperties } from "react";
import type { PlannerAmbienceOptions } from "../editor/planner-ambience-options";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import styles from "./planner-atmosphere-layer.module.css";

type AtmosphereParticle = Readonly<{
  left: number;
  top: number;
  delay: number;
  duration: number;
  size: number;
}>;

export type PlannerAtmosphereLayerProperties = Readonly<{
  options: PlannerAmbienceOptions;
  season: TilesheetSeason;
}>;

export function PlannerAtmosphereLayer({
  options,
  season,
}: PlannerAtmosphereLayerProperties) {
  const weatherParticles = createWeatherParticles(options.weather);
  const shouldRenderSummerClouds =
    options.showClouds && season === "summer" && options.weather === "clear";
  const seasonalDebris = options.showDebris
    ? createSeasonalDebris(season)
    : [];
  const butterflies = options.showDebris && (season === "spring" || season === "summer")
    ? createButterflies()
    : [];

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
      {seasonalDebris.length > 0 ? (
        <div className={styles.debrisLayer}>
          {seasonalDebris.map((particle, index) => (
            <span
              className={`${styles.debris} ${styles[`${season}Debris`]}`}
              key={`${season}-debris-${index}`}
              style={createParticleStyle(particle)}
            />
          ))}
          {butterflies.map((particle, index) => (
            <span
              className={styles.butterfly}
              key={`butterfly-${index}`}
              style={createParticleStyle(particle)}
            >
              <span />
            </span>
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

function createSeasonalDebris(season: TilesheetSeason): readonly AtmosphereParticle[] {
  const particleCount = season === "winter" ? 10 : 14;
  return createParticles(particleCount, 41, 23, 17);
}

function createButterflies(): readonly AtmosphereParticle[] {
  return createParticles(2, 19, 37, 29);
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
