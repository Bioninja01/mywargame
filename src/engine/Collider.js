import { fastCosTaylor, fastSinTaylor, pointInTriangle } from './Utils'

import { drawTriangle } from './utils/Draw'

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

    // drawTriangle(
    //   ctx,
    //   this.entity.angle,
    //   this.entity.postion.x,
    //   this.entity.postion.y,
    //   p2.x,
    //   p2.y,
    //   p3.x,
    //   p3.y
    // )
  }
}
