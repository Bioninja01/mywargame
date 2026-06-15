import { fastCosTaylor, fastSinTaylor, pointInTriangle } from './Utils'

import { drawTriangle } from './utils/Draw'

export function getOverlapRect(a, b) {
  const dx = b.entity.postion.x - a.entity.postion.x
  const dy = b.entity.postion.y - a.entity.postion.y

  const overlapX = a.width / 2 + b.width / 2 - Math.abs(dx)

  const overlapY = a.height / 2 + b.height / 2 - Math.abs(dy)

  if (overlapX <= 0 || overlapY <= 0) {
    return null
  }

  return {
    x: dx > 0 ? -overlapX : overlapX,
    y: dy > 0 ? -overlapY : overlapY
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function circleRectOverlap(circle, rect) {
  const left = rect.x - rect.width / 2
  const right = rect.x + rect.width / 2
  const top = rect.y - rect.height / 2
  const bottom = rect.y + rect.height / 2

  // Closest point on rectangle to circle center
  const closestX = clamp(circle.x, left, right)
  const closestY = clamp(circle.y, top, bottom)

  let dx = circle.x - closestX
  let dy = circle.y - closestY

  const distSq = dx * dx + dy * dy

  // No collision
  if (distSq > circle.radius * circle.radius) {
    return {
      x: 0,
      y: 0
    }
  }

  // Circle center is outside rectangle
  if (distSq !== 0) {
    const dist = Math.sqrt(distSq)
    const overlap = circle.radius - dist

    return {
      x: (dx / dist) * overlap,
      y: (dy / dist) * overlap
    }
  }

  // Circle center is inside rectangle
  const overlapLeft = circle.x - left
  const overlapRight = right - circle.x
  const overlapTop = circle.y - top
  const overlapBottom = bottom - circle.y

  const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom)

  if (minOverlap === overlapLeft) return { x: circle.radius + overlapLeft, y: 0 }

  if (minOverlap === overlapRight) return { x: -(circle.radius + overlapRight), y: 0 }

  if (minOverlap === overlapTop) return { x: 0, y: circle.radius + overlapTop }

  return { x: 0, y: -(circle.radius + overlapBottom) }
}

function getOverlapRectCircle(rect, circle) {
  // 1. Find the closest point on the rectangle to the circle's center
  const closestX = Math.max(rect.x - rect.width / 2, Math.min(circle.x, rect.x + rect.width / 2))
  const closestY = Math.max(rect.y - rect.width / 2, Math.min(circle.y, rect.y + rect.height / 2))

  // 2. Calculate the distance from the closest point to the circle's center
  const distanceX = circle.x - closestX
  const distanceY = circle.y - closestY

  // Using Pythagoras to get the actual distance
  const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

  // 3. If the distance is less than the circle's radius, they overlap
  if (distance < circle.radius) {
    // Handle the edge case where the circle center is INSIDE the rectangle
    // We ensure we still get proper overlap pushing vectors
    if (distance === 0) {
      return { x: circle.radius, y: circle.radius }
    }

    // Calculate overlap amount for both X and Y axes
    const overlapX = (circle.radius / distance) * Math.abs(distanceX)
    const overlapY = (circle.radius / distance) * Math.abs(distanceY)

    return {
      x: overlapX - Math.abs(distanceX),
      y: overlapY - Math.abs(distanceY)
    }
  }

  // No collision
  return { x: 0, y: 0 }
}

class Collider {
  constructor(entity) {
    this.entity = entity
    this.trigger = false
  }
  getVertices() {
    return []
  }
  containsPoint() {
    return false
  }
  intersects(other) {
    const vertices = other.getVertices()
    for (const v of vertices) {
      if (this.containsPoint(v)) {
        return true
      }
    }
    return false
  }

  OnCollisionEnter(other) {
    console.log('A collider has made contact with the DoorObject Collider')
  }

  onCollision(other) {
    console.log('A collider is in contact with the DoorObject Collider')
  }

  OnCollisionExit(other) {
    console.log('A collider has ceased contact with the DoorObject Collider')
  }

  OnTriggerEnter(other) {
     console.log('A collider has entered the DoorObject trigger')
  }

  onTrigger(other) {
     console.log('A collider is inside the DoorObject trigger')
  }

  OnTriggerExit(other) {
     console.log('A collider has exited the DoorObject trigger')
  }
}

export class BoxCollider extends Collider {
  constructor(entity, width, height) {
    super(entity)
    this.width = width
    this.height = height
  }
  getVerticesAtPoint(p = this.entity.postion) {
    const { x, y } = { ...p }
    const halfWidth = this.width / 2
    const halfHeight = this.height / 2
    const p1 = { x: x - halfWidth, y: y - halfHeight }
    const p2 = { x: x - halfWidth, y: y + halfHeight }
    const p3 = { x: x + halfWidth, y: y + halfHeight }
    const p4 = { x: x + halfWidth, y: y - halfHeight }
    return [p1, p2, p3, p4]
  }
  getVertices() {
    return getVerticesAtPoint()
  }
  containsPoint(p) {
    const { x, y } = { ...this.entity.postion }
    return (
      p.x >= x - this.width / 2 &&
      p.x <= x + this.width / 2 &&
      p.y >= y - this.height / 2 &&
      p.y <= y + this.height / 2
    )
  }
  render(ctx) {
    ctx.save()
    // Move origin to entity center
    ctx.translate(this.entity.postion.x, this.entity.postion.y)
    // Rotate around center
    ctx.rotate(this.entity.angle)
    // Draw rectangle centered
    ctx.fillStyle = 'yellow'
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height)
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2
    ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height)
    ctx.restore()
  }
}
const ANGLES = [
  (0,
  Math.PI / 4,
  Math.PI / 2,
  (3 * Math.PI) / 4,
  Math.PI,
  (5 * Math.PI) / 4,
  (3 * Math.PI) / 2,
  (7 * Math.PI) / 4)
]
export class CircleCollider extends Collider {
  constructor(entity, radius) {
    super(entity)
    this.radius = radius
  }
  containsPoint(p) {
    const { x, y } = { ...this.entity.postion }
    const dx = p.x - x
    const dy = p.y - y
    const squaredDistance = dx * dx + dy * dy
    const squaredRadius = this.radius * this.radius
    return squaredDistance <= squaredRadius
  }
  getVerticesAtPoint(p = this.entity.postion) {
    const verts = []
    const { x, y } = { ...p }
    ANGLES.map((angle) => {
      verts.push({ x: x * fastCosTaylor(angle), y: y * fastSinTaylor(angle) })
    })

    return verts
  }
  getVertices() {
    return getVerticesAtPoint()
  }
  render(ctx) {
    ctx.save()
    // Move origin to entity center
    ctx.translate(this.entity.postion.x, this.entity.postion.y)

    ctx.beginPath()
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI)
    ctx.strokeStyle = 'lightblue'
    ctx.stroke() // Draw the outlin

    ctx.restore()
  }
}

export class TriangleCollider extends Collider {
  constructor(entity, p1, p2, p3) {
    super(entity)
    this.localVertices = [p1, p2, p3]
  }
  getVertices() {
    const { x, y } = { ...this.entity.postion }
    return this.localVertices.map((v) => ({
      x: v.x + x,
      y: v.y + y
    }))
  }
  containsPoint(p) {
    const [a, b, c] = this.getVertices()
    return pointInTriangle(p.x, p.y, a.x, a.y, b.x, b.y, c.x, c.y)
  }
  render(ctx) {
    const [p1, p2, p3] = [...this.localVertices]

    drawTriangle(
      ctx,
      this.entity.angle,
      this.entity.postion.x,
      this.entity.postion.y,
      0,
      0,
      170,
      170,
      170,
      -170
    )
  }
}
