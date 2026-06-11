export class Renderer {
  constructor(ctx) {
    this.ctx = ctx
    this.camera = null
  }

  render(scene) {
    const ctx = this.ctx
    // RESET TRANSFORM
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    if (scene) {
      this.camera = scene.camera

      // Apply camera transform

      ctx.translate(-this.camera.x, -this.camera.y)
      ctx.scale(this.camera.zoom, this.camera.zoom)

      scene.render(ctx)

      // UI (not affected by camera)
      scene.drawUI(ctx)
    }
  }
}
