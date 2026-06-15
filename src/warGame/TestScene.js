import { Scene } from '../engine/Scene.js'
import { Entity } from '../engine/Entity.js'
import { Input } from '../engine/Input.js'
import forest from '../_assets/imgs/forest.jpg'
import sprite from '../_assets/imgs/sprite.png'
import Lan from '../_assets/imgs/Lan.png'

import { getWorldCoordinatesPointer } from '../engine/Utils.js'
import { distanceSq, getPointAtDistance, getAngle } from '../engine/Utils.js'

import { drawCone, drawTriangle } from '../engine/utils/Draw.js'
import { BoxCollider, CircleCollider, TriangleCollider } from '../engine/Collider.js'

class BoxEntity extends Entity {
  constructor(x, y, width, height, color) {
    super(x, y, 100)
    this.health = 100
    this.color = color
    this.width = width
    this.height = height
    this.health = 100
    this.img = new Image()
    this.img.src = Lan
    const c = new CircleCollider(this, this.radius)
    c.trigger = true
    const b = new BoxCollider(this, width, height)
    const p2 = { x: this.postion.x + 40, y: this.postion.y + 40 }
    const p3 = { x: p2.x + 250, y: p2.y + 250 }
    const t = new TriangleCollider(this, this.postion, p2, p3)
    this.colliders = [c, b, t]
    this.dragOffset = {
      x: 0,
      y: 0
    }
  }

  render(ctx) {
    super.render(ctx)
    ctx.beginPath()
    ctx.arc(this.oldPostion.x, this.oldPostion.y, this.radius, 0, 2 * Math.PI)
    ctx.strokeStyle = 'lightblue'
    ctx.stroke() // Draw the outlin

    // const p2 = { x: this.x + 40, y: this.y + 40 }
    // const p3 = { x: p2.x + 250, y: p2.y + 250 }
    // drawTriangle(ctx, this.angle, this.postion.x, this.postion.y, 0, 0, 170, 170, 170, -170)

    // Draw image centered
    if (this.img.complete) {
      ctx.save()
      // Move origin to entity center
      ctx.translate(this.postion.x, this.postion.y)

      if (0 > this.angle && this.angle > -1) {
        ctx.scale(-1, 1)
        ctx.drawImage(this.img, 0, 180 * 3, 100, 180, -50, -90 - 45, 100, 180)
        ctx.restore()
        ctx.save()
        ctx.translate(this.postion.x, this.postion.y)
      } else if (-1 > this.angle && this.angle > -2) {
        ctx.drawImage(this.img, 100, 0, 100, 180, -50, -90 - 45, 100, 180)
      } else if (-2 > this.angle && this.angle > -2.5) {
        ctx.drawImage(this.img, 0, 180 * 3, 100, 180, -50, -90 - 45, 100, 180)
      } else if (
        (3.5 > this.angle && this.angle > 2.5) ||
        (-2.5 > this.angle && this.angle > -3.5)
      ) {
        ctx.drawImage(this.img, 0, 180, 100, 180, -50, -90 - 45, 100, 180)
      } else if (2.5 > this.angle && this.angle > 2) {
        ctx.drawImage(this.img, 0, 180 * 2, 100, 180, -50, -90 - 45, 100, 180)
      } else if (2 > this.angle && this.angle > 1) {
        ctx.drawImage(this.img, 0, 0, 100, 180, -50, -90 - 45, 100, 180)
      } else if (1 > this.angle && this.angle > 0.5) {
        ctx.scale(-1, 1)
        ctx.drawImage(this.img, 0, 180 * 2, 100, 180, -50, -90 - 45, 100, 180)
        ctx.restore()
        ctx.save()
        ctx.translate(this.postion.x, this.postion.y)
      } else if (0.5 > this.angle && this.angle > -0.5) {
        ctx.scale(-1, 1)
        ctx.drawImage(this.img, 0, 180, 100, 180, -50, -90 - 45, 100, 180)
        ctx.restore()
        ctx.save()
        ctx.translate(this.postion.x, this.postion.y)
      }
      ctx.font = '30px Arial'
      ctx.fillStyle = 'white'

      ctx.fillText(this.health.toString(), 25, -50)

      ctx.restore()
    }
  }

  onClick(event) {
    const { dragStart, worldPoint, collider } = { ...event }
    switch (collider) {
      case this.colliders[0]: {
        const angle = getAngle(this.postion.x, this.postion.y, worldPoint.x, worldPoint.y)
        this.angle = angle
        break
      }
      case this.colliders[1]: {
        const target = {
          x: worldPoint.x - this.dragOffset.x,
          y: worldPoint.y - this.dragOffset.y
        }
        const radiusSq = this.radius * this.radius
        const distSq = distanceSq(dragStart.x, dragStart.y, target.x, target.y)
        // Clamp movement radius
        if (distSq > radiusSq) {
          const newPoint = getPointAtDistance(
            dragStart.x,
            dragStart.y,
            target.x,
            target.y,
            this.radius
          )
          this.postion.x = newPoint.x
          this.postion.y = newPoint.y
        } else {
          this.postion.x = target.x
          this.postion.y = target.y
        }
        break
      }
    }
  }
  onDragEnd(event) {
    this.oldPostion = { ...this.postion }
  }

  onDragStart(event) {
    this.dragOffset = {
      x: event.worldPoint.x - this.postion.x,
      y: event.worldPoint.y - this.postion.y
    }
  }
  onDrag(event) {
    const { dragStart, worldPoint, collider } = { ...event }
    switch (collider) {
      case this.colliders[0]: {
        const angle = getAngle(this.postion.x, this.postion.y, worldPoint.x, worldPoint.y)
        this.angle = angle
        break
      }
      case this.colliders[1]: {
        const target = {
          x: worldPoint.x - this.dragOffset.x,
          y: worldPoint.y - this.dragOffset.y
        }
        const radiusSq = this.radius * this.radius
        const distSq = distanceSq(dragStart.x, dragStart.y, target.x, target.y)
        // Clamp movement radius
        if (distSq > radiusSq) {
          const newPoint = getPointAtDistance(
            dragStart.x,
            dragStart.y,
            target.x,
            target.y,
            this.radius
          )
          this.postion.x = newPoint.x
          this.postion.y = newPoint.y
        } else {
          this.postion.x = target.x
          this.postion.y = target.y
        }
        break
      }
    }
  }
  onDragEnd(event) {
    this.oldPostion = { ...this.postion }
  }
}

export class TestScene extends Scene {
  gizmos = []
  constructor() {
    super()

    this.img = new Image()
    this.img.src = forest

    this.camera.x = -200
    this.camera.y = -100

    const red = new BoxEntity(100, 100, 50, 50, 'red')
    // const gizmo = new EntityController(red)

    // // this.gizmos.push(gizmo)
    this.entities.push(red)
    this.entities.push(new BoxEntity(400, 200, 50, 50, 'blue'))
    // this.entities.push(gizmo)
    // this.entities.push(new BoxEntity(700, 500, 64, 64, 'green'))
    // Drag state
    this.draggedEntity = null
    this.dragOffset = {
      x: 0,
      y: 0
    }
  }

  render(ctx) {
    // Background
    ctx.fillStyle = '#2b2b2b'
    ctx.fillRect(-5000, -5000, 10000, 10000)
    this.#drawGrid(ctx)
    ctx.drawImage(this.img, 0, 0)

    super.render(ctx)
    for (const entity of this.entities) {
      entity.render(ctx)
    }
  }

  update(delta) {
    super.update(delta)
    this.#handleCamera(delta)
    for (const gizmo of this.gizmos) {
      gizmo.update()
    }
  }

  #handleCamera(delta) {
    const speed = 500 * delta

    if (Input.GetKey('w')) {
      this.camera.y -= speed
    }

    if (Input.GetKey('s')) {
      this.camera.y += speed
    }

    if (Input.GetKey('a')) {
      this.camera.x -= speed
    }

    if (Input.GetKey('d')) {
      this.camera.x += speed
    }
  }

  #drawGrid(ctx) {
    const gridSize = 64

    ctx.strokeStyle = '#444'
    ctx.lineWidth = 1

    for (let x = -2000; x <= 2000; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, -2000)
      ctx.lineTo(x, 2000)
      ctx.stroke()
    }

    for (let y = -2000; y <= 2000; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(-2000, y)
      ctx.lineTo(2000, y)
      ctx.stroke()
    }
  }
}
