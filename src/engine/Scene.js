import { Camera } from './Camera.js'
import { DragController, ClickController } from './Input.js'

import { PhysicsSystem } from './Physics.js'

export class Scene {
  constructor() {
    this.entities = []
    this.camera = Camera.main
    this.x = 0
    this.y = 0
    this.dragController = new DragController(this)
    this.clickController = new ClickController(this)
    this.physics = new PhysicsSystem(this)
  }

  addEntity(entity) {
    this.entities.push(entity)
    this.entities.sort(function (entity1, entity2) {
      return entity1.layer < entity2.layer
    })
  }

  update(delta) {
    for (const e of this.entities) {
      e.update(delta)
    }
    this.dragController.handleDragging()
    this.physics.update()
    // this.clickController.handleClick()
  }

  render(ctx) {
    for (const e of this.entities) {
      e.render(ctx)
    }
  }

  drawUI(ctx) {}
}
