import { getPointAtDistance, distanceSq } from './Utils'

export class Entity {
  static State = {
    INIT: 'INIT',
    SELETED: 'SELETED'
  }
  constructor(x, y, radius = 100, width = radius / 2, height = width) {
    this.id = crypto.randomUUID()
    this.state = Entity.State.INIT
    this.childern = []
    this.colliders = []
    this.radius = radius
    this.position = {
      x,
      y
    }
    this.oldPosition = {
      x,
      y
    }
    this.angle = Math.PI / 2
    this.color = ''
    this.layer = 1
  }
  update() {}
  render(ctx) {
    for (const collider of this.colliders) {
      collider.render(ctx)
    }
  }
  saveOldposition() {
    this.oldPosition.x = this.position.x
    this.oldPosition.y = this.position.y
  }
  revertPosition() {

    console.log("this.color", this.color)

    this.position.x = this.oldPosition.x
    this.position.y = this.oldPosition.y
  }

  onDragStart(event) {}
  onDrag(event) {
    // const { startX, startY, target } = { ...event }
    // if (!target) return
    // const radiusSq = this.radius * this.radius
    // const distSq = distanceSq(startX, startY, target.x, target.y)
    // // Clamp movement radius
    // if (distSq > radiusSq) {
    //   const newPoint = getPointAtDistance(startX, startY, target.x, target.y, this.radius)
    //   this.position.x = newPoint.x
    //   this.position.y = newPoint.y
    // } else {
    //   this.position.x = target.x
    //   this.position.y = target.y
    // }
  }

  onClick(event) {}

  OnCollisionStay(other) {
    Debug.Log('A collider is in contact with the DoorObject Collider')
  }
}
