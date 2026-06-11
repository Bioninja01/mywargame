export function drawCone(x, y, radius, height, angle, ctx) {
  ctx.save()

  // Move origin to cone TIP
  ctx.translate(x, y)

  // Rotate around tip
  ctx.rotate(angle)

  // Cone body
  ctx.beginPath()

  // Tip of cone
  ctx.moveTo(0, 0)

  // Base corners
  ctx.lineTo(height, radius)
  ctx.lineTo(height, -radius)

  ctx.closePath()

  ctx.fillStyle = '#3498db'
  ctx.fill()

  ctx.stroke()

  ctx.restore()
}

export function drawTriangle(
  ctx,
  angle,
  x,y,
  x1,
  y1,
  x2,
  y2,
  x3,
  y3,
  fillStyle = '#3498db',
  strokeStyle = null,
  lineWidth = 1
) {
  ctx.save()

  ctx.translate(x, y)

  // Rotate around tip
  ctx.rotate(angle)

  // 1. Begin a new path for the shape
  ctx.beginPath()

  // 2. Move the drawing cursor to the first point
  ctx.moveTo(0, 0)

  // 3. Draw lines to the second and third points
  ctx.lineTo(x2, y2)
  ctx.lineTo(x3, y3)

  // 4. Automatically draw the final line back to the starting point
  ctx.closePath()

  // 5. Apply fill color if specified
  ctx.fillStyle = fillStyle
  ctx.fill()

  // 6. Apply the outline border
  if (strokeStyle) {
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = strokeStyle
    ctx.stroke()
  }
  ctx.restore()
}

export function pointInCone(px, py, coneX, coneY, radius, height, angle) {
  // Move point into cone local space
  const dx = px - coneX
  const dy = py - coneY

  // Inverse rotate point
  const cos = Math.cos(-angle)
  const sin = Math.sin(-angle)

  const localX = dx * cos - dy * sin
  const localY = dx * sin + dy * cos

  // Cone exists only downward from tip
  if (localY < 0 || localY > height) {
    return false
  }

  // Width of cone at this Y position
  const maxWidth = (localY / height) * radius

  // Check horizontal bounds
  return Math.abs(localX) <= maxWidth
}
