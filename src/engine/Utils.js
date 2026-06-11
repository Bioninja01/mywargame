import { Input } from './Input'
import { Camera } from './Camera'

export function getWorldCoordinatesPointer() {
  const pointer = Input.GetPointerCanvas()
  // Screen -> World
  return {
    worldX: pointer.x / Camera.main.zoom + Camera.main.x,
    worldY: pointer.y / Camera.main.zoom + Camera.main.y
  }
}

export function pointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
  const d1 = (px - bx) * (ay - by) - (ax - bx) * (py - by);
  const d2 = (px - cx) * (by - cy) - (bx - cx) * (py - cy);
  const d3 = (px - ax) * (cy - ay) - (cx - ax) * (py - ay);

  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;

  return !(hasNeg && hasPos);
}

export function normalize(v) {
  const magnitude = Math.sqrt(v.x * v.x + v.y * v.y) // or Math.hypot(v.x, v.y)
  if (magnitude === 0) return { x: 0, y: 0 }
  return {
    x: v.x / magnitude,
    y: v.y / magnitude
  }
}

export function getAngle(x1, y1, x2, y2) {
  const normalVector = normalize({ x: x2 - x1, y: y2 - y1 })
  return Math.atan2(normalVector.y, normalVector.x)
}

export function distanceSq(x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  return dx * dx + dy * dy
}

export function getPointAtDistance(x1, y1, x2, y2, distance) {
  const dx = x2 - x1
  const dy = y2 - y1
  const invLen = distance / Math.sqrt(dx * dx + dy * dy)
  return {
    x: x1 + dx * invLen,
    y: y1 + dy * invLen
  }
}

// x must be in radians
export function fastCosTaylor(x) {
    // Wrap x to be between -PI and PI for accuracy
    x = x % (2 * Math.PI);
    if (x > Math.PI) x -= 2 * Math.PI;
    else if (x < -Math.PI) x += 2 * Math.PI;

    const x2 = x * x;
    
    // 1 - (x^2 / 2) + (x^4 / 24)
    return 1 - (x2 / 2) + ((x2 * x2) / 24);
}

export function fastSinTaylor(x) {
    // 1. Wrap x to be between -PI and PI to keep the approximation accurate
    x = x % (2 * Math.PI);
    if (x > Math.PI) x -= 2 * Math.PI;
    else if (x < -Math.PI) x += 2 * Math.PI;

    // 2. Pre-calculate the powers to save operations
    const x2 = x * x;
    const x3 = x * x2;
    const x5 = x3 * x2;
    
    // 3. Apply the Taylor Series formula: x - (x^3 / 6) + (x^5 / 120)
    return x - (x3 / 6) + (x5 / 120);
}