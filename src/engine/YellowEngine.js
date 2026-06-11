import { Input } from './Input.js'
import { Renderer } from './Renderer.js'

export class YellowEngine {
  constructor(canvas) {
    const self = this
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.renderer = new Renderer(this.ctx)
    this.scene = null
    this.lastTime = 0
    this.resize()
    window.addEventListener('resize', () => {
      self.resize()
    })
    Input.setUpEventListeners(canvas)
  }

  setScene(scene) {
    this.scene = scene
  }

  start() {
    const self = this
    requestAnimationFrame((t) => {
      self.mainLoop(t)
    })
  }

  mainLoop(time) {
    const self = this
    const delta = (time - self.lastTime) / 1000
    self.lastTime = time
    if (self.scene) {
      self.scene.update(delta)
      self.renderer.render(self.scene)
    }
    Input.update()
    requestAnimationFrame((t) => {
      self.mainLoop(t)
    })
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }
}
