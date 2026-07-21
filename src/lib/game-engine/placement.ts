import { createPRNG, randomRange } from "./prng";

export interface PlacedNumber {
  id: number;
  value: number;
  x: number; // 0 to 1000 coordinate space
  y: number; // 0 to 1000 coordinate space
  rotation: number; // -20 to 20 degrees
  fontSize: number; // in SVG units
  zone: string;
}

export interface HandZone {
  name: string;
  // Normalized bounding polygon / rect [minX, minY, maxX, maxY]
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  weight: number; // frequency allocation
}

// 7 Hand regions mapping onto an anatomical SVG hand silhouette (1000x1000 viewBox)
export const HAND_ZONES: HandZone[] = [
  { name: "palm_center", minX: 340, minY: 480, maxX: 660, maxY: 690, weight: 0.32 },
  { name: "palm_lower", minX: 380, minY: 690, maxX: 620, maxY: 860, weight: 0.18 },
  { name: "thumb", minX: 180, minY: 480, maxX: 330, maxY: 660, weight: 0.10 },
  { name: "index", minX: 280, minY: 120, maxX: 410, maxY: 460, weight: 0.11 },
  { name: "middle", minX: 430, minY: 80, maxX: 560, maxY: 460, weight: 0.11 },
  { name: "ring", minX: 580, minY: 130, maxX: 700, maxY: 470, weight: 0.09 },
  { name: "pinky", minX: 710, minY: 220, maxX: 820, maxY: 500, weight: 0.09 },
];

/**
 * Checks if candidate (cx, cy) overlaps with any existing placed numbers
 */
function isOverlapping(
  cx: number,
  cy: number,
  placed: PlacedNumber[],
  minDist: number
): boolean {
  for (let i = 0; i < placed.length; i++) {
    const p = placed[i];
    const dx = cx - p.x;
    const dy = cy - p.y;
    const distSq = dx * dx + dy * dy;
    if (distSq < minDist * minDist) {
      return true;
    }
  }
  return false;
}

/**
 * Procedurally places `count` numbers (e.g. 1..100) onto hand zones using PRNG seed
 */
export function generateHandLayout(
  seed: string,
  count: number = 100,
  fontSizeOverride?: number
): PlacedNumber[] {
  const rng = createPRNG(seed);
  const result: PlacedNumber[] = [];

  // Generate values from 1 to count
  const numbers: number[] = Array.from({ length: count }, (_, i) => i + 1);

  // Default parameters based on count
  const isKidsMode = count <= 20;
  const defaultFontSize = fontSizeOverride || (isKidsMode ? 38 : count <= 30 ? 28 : 20);
  const minDistBase = isKidsMode ? 65 : count <= 30 ? 48 : 34;

  for (let i = 0; i < numbers.length; i++) {
    const val = numbers[i];
    let placedSuccess = false;
    let attempts = 0;
    const maxAttempts = 120;

    while (!placedSuccess && attempts < maxAttempts) {
      attempts++;
      // Pick zone according to weights or random selection
      const zoneIndex = Math.floor(rng() * HAND_ZONES.length);
      const zone = HAND_ZONES[zoneIndex];

      // Sample candidate position within zone bounds
      const cx = randomRange(rng, zone.minX + 15, zone.maxX - 15);
      const cy = randomRange(rng, zone.minY + 15, zone.maxY - 15);

      // Scale minDist slightly if attempts accumulate
      const currentMinDist = attempts > 80 ? minDistBase * 0.75 : minDistBase;

      if (!isOverlapping(cx, cy, result, currentMinDist)) {
        const rotation = Math.round(randomRange(rng, -18, 18));
        const fontSizeVariance = randomRange(rng, -2, 3);
        const finalFontSize = Math.max(16, defaultFontSize + fontSizeVariance);

        result.push({
          id: val,
          value: val,
          x: Math.round(cx),
          y: Math.round(cy),
          rotation,
          fontSize: Math.round(finalFontSize),
          zone: zone.name,
        });

        placedSuccess = true;
      }
    }

    // Fallback if tight collision space
    if (!placedSuccess) {
      const fallbackZone = HAND_ZONES[0];
      const cx = randomRange(rng, fallbackZone.minX, fallbackZone.maxX);
      const cy = randomRange(rng, fallbackZone.minY, fallbackZone.maxY);
      result.push({
        id: val,
        value: val,
        x: Math.round(cx),
        y: Math.round(cy),
        rotation: 0,
        fontSize: defaultFontSize,
        zone: "fallback",
      });
    }
  }

  return result;
}
