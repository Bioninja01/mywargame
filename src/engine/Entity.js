import { getPointAtDistance, distanceSq } from './Utils'
import { BoxCollider } from './Collider'

export class Entity {
  static State = {
    INIT: 'INIT',
    SELETED: 'SELETED'
  }
  constructor(x, y, radius=100) {
    this.id = crypto.randomUUID()
    this.state = Entity.State.INIT
    this.radius = radius
    this.postion = {
      x,
      y
    }
    this.angle = Math.PI / 2
    this.collider = null
    this.color = ''
    this.layer = 1
    this.oldPostion = {
      x,
      y
    }
  }
  update() {}
  render(ctx) {
    if (this.collider) {
      this.collider.render(ctx)
    }
  }

  saveOldPostion() {
    this.oldPostion.x = this.postion.x
    this.oldPostion.y = this.postion.y
  }
  onDrag(event) {
    const { startX, startY, target } = { ...event }
    if (!target) return
    const radiusSq = this.radius * this.radius
    const distSq = distanceSq(startX, startY, target.x, target.y)
    // Clamp movement radius
    if (distSq > radiusSq) {
      const newPoint = getPointAtDistance(startX, startY, target.x, target.y, this.radius)
      this.postion.x = newPoint.x
      this.postion.y = newPoint.y
    } else {
      this.postion.x = target.x
      this.postion.y = target.y
    }
  }
  onClick(event) {}

  OnCollisionStay(other) {
    Debug.Log('A collider is in contact with the DoorObject Collider')
  }
}
