import { BoxCollider, getOverlapRect } from './Collider.js'

export class PhysicsSystem {
  constructor(scene) {
    const { entities } = { ...scene }
    this.entities = entities
  }

  update() {
    // Collision checks
    for (let i = 0; i < this.entities.length; i++) {
      for (let j = i + 1; j < this.entities.length; j++) {
        const a = this.entities[i]
        const b = this.entities[j]

        for (let colliderA of a.colliders) {
          for (let colliderB of b.colliders) {
            if (!(colliderA instanceof BoxCollider) || !(colliderB instanceof BoxCollider)) continue

            const point = this.intersects(colliderA, colliderB)
            if (!point) continue

            // // Trigger?
            // if (a.collider.isTrigger || b.collider.isTrigger) {
            //   a.onTrigger(b)
            //   b.onTrigger(a)
            //   continue
            // }

            // Collision event
            colliderA.onCollision(colliderB)
            colliderB.onCollision(colliderA)
          }
        }
      }
    }
  }

  intersects(a, b) {
    const point = getOverlapRect(a, b)
    return point
    if (point) {
      a.entity.position.x += point.x
      a.entity.position.y += point.y
    }
  }
}
