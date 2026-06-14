import { distanceSq, getPointAtDistance } from './Utils.js'
import { Entity } from './Entity.js'

export class Input {
  intersects
  static #isSetup = false
  static #canvas = null

  // --- Keyboard ---
  static #keysHeld = {}
  static #keysDown = {}
  static #keysUp = {}

  // --- Mouse (low-level) ---
  static #mouseHeld = {}
  static #mouseDown = {}
  static #mouseUp = {}

  // --- Touches (future use) ---
  static Touches = []

  // --- Pointer (high-level abstraction) ---
  static Pointer = {
    x: 0, // normalized (-1 to 1)
    y: 0,
    screenX: 0, // canvas space
    screenY: 0
  }

  static setUpEventListeners(canvas) {
    if (this.#isSetup) return

    this.#canvas = canvas

    window.addEventListener('keydown', this.#handle.onKeyDown)
    window.addEventListener('keyup', this.#handle.onKeyUp)

    canvas.addEventListener('mousedown', this.#handle.onMouseDown)
    canvas.addEventListener('mouseup', this.#handle.onMouseUp)
    canvas.addEventListener('mousemove', this.#handle.onMouseMove)

    canvas.addEventListener('touchstart', this.#handle.onTouchStart, { passive: false })
    canvas.addEventListener('touchend', this.#handle.onTouchEnd)
    canvas.addEventListener('touchmove', this.#handle.onTouchMove, { passive: false })

    this.#isSetup = true
  }
  static removeEventListeners() {
    if (!this.#isSetup) return

    window.removeEventListener('keydown', this.#handle.onKeyDown)
    window.removeEventListener('keyup', this.#handle.onKeyUp)

    this.#canvas.removeEventListener('mousedown', this.#handle.onMouseDown)
    this.#canvas.removeEventListener('mouseup', this.#handle.onMouseUp)
    this.#canvas.removeEventListener('mousemove', this.#handle.onMouseMove)

    this.#canvas.removeEventListener('touchstart', this.#handle.onTouchStart)
    this.#canvas.removeEventListener('touchend', this.#handle.onTouchEnd)
    this.#canvas.removeEventListener('touchmove', this.#handle.onTouchMove)

    this.#isSetup = false
  }

  // =========================
  // Handlers
  // =========================

  static #handle = {
    onKeyDown: (e) => {
      if (!Input.#keysHeld[e.key]) {
        Input.#keysDown[e.key] = true
      }
      Input.#keysHeld[e.key] = true
    },
    onKeyUp: (e) => {
      Input.#keysHeld[e.key] = false
      Input.#keysUp[e.key] = true
    },
    onMouseDown: (e) => {
      const key = e.button === 2 ? 'right' : 'left'

      if (!Input.#mouseHeld[key]) {
        Input.#mouseDown[key] = true
      }

      Input.#mouseHeld[key] = true
    },
    onMouseUp: (e) => {
      const key = e.button === 2 ? 'right' : 'left'

      Input.#mouseHeld[key] = false
      Input.#mouseUp[key] = true
    },
    onMouseMove: (e) => {
      Input.#updatePointer(e.clientX, e.clientY)
    },
    onTouchStart: (e) => {
      e.preventDefault()

      Input.Touches = [...e.touches]

      const t = e.touches[0]

      Input.#mouseDown['left'] = true
      Input.#mouseHeld['left'] = true

      Input.#updatePointer(t.clientX, t.clientY)
    },
    onTouchEnd: (e) => {
      Input.Touches = [...e.touches]

      const t = e.changedTouches[0]

      Input.#mouseHeld['left'] = false
      Input.#mouseUp['left'] = true

      if (t) {
        Input.#updatePointer(t.clientX, t.clientY)
      }
    },
    onTouchMove: (e) => {
      e.preventDefault()

      Input.Touches = [...e.touches]

      const t = e.touches[0]
      Input.#updatePointer(t.clientX, t.clientY)
    }
  }

  // =========================
  // Pointer Calculation
  // =========================
  static #updatePointer(clientX, clientY) {
    const rect = this.#canvas.getBoundingClientRect()

    const x = clientX - rect.left
    const y = clientY - rect.top

    this.Pointer.screenX = x
    this.Pointer.screenY = y

    // normalized (-1 to 1)
    this.Pointer.x = (x / rect.width) * 2 - 1
    this.Pointer.y = -(y / rect.height) * 2 + 1
  }

  // =========================
  // Public API - Keyboard
  // =========================
  static GetKey(key) {
    return !!this.#keysHeld[key]
  }
  static GetKeyDown(key) {
    return !!this.#keysDown[key]
  }
  static GetKeyUp(key) {
    return !!this.#keysUp[key]
  }

  // =========================
  // Public API - Mouse
  // =========================
  static GetMouse(key = 'left') {
    return !!this.#mouseHeld[key]
  }

  static GetMouseDown(key = 'left') {
    return !!this.#mouseDown[key]
  }

  static GetMouseUp(key = 'left') {
    return !!this.#mouseUp[key]
  }

  // =========================
  // Public API - Pointer (Unified)
  // =========================
  static GetPointer() {
    return this.GetMouse('left')
  }

  static GetPointerDown() {
    return this.GetMouseDown('left')
  }

  static GetPointerUp() {
    return this.GetMouseUp('left')
  }

  static GetPointerCanvas() {
    return {
      x: this.Pointer.screenX,
      y: this.Pointer.screenY
    }
  }

  // =========================
  // Frame Update (VERY IMPORTANT)
  // =========================
  static update() {
    if (!this.#isSetup) {
      throw new Error('Input not initialized. Call setUpEventListeners(canvas)')
    }

    this.#keysDown = {}
    this.#keysUp = {}
    this.#mouseDown = {}
    this.#mouseUp = {}
  }
}

export class DragController {
  static EventDrag = class {
    constructor() {
      this.worldPoint = { x: null, y: null }
      this.dragStart = { x: null, y: null }
      this.collider = null
    }
  }

  constructor(scene) {
    if (!scene) {
      throw new Error('You Need To have A Scene Inorrder To Uses A Drag Class')
    }
    const { camera, entities, gizmos } = { ...scene }
    this.camera = camera
    this.entities = entities
    this.gizmos = gizmos
    this.eventDrag = new DragController.EventDrag()

    ////// TOREMOVE
    // Entity dragging
    this.draggedEntity = null
    // Camera dragging
    this.draggingCamera = false
    this.dragStart = {
      x: 0,
      y: 0
    }
    this.dragOffset = {
      x: 0,
      y: 0
    }
    /////////

    // Camera drag origin
    this.cameraDragStart = {
      x: 0,
      y: 0
    }
    this.cameraPointerStart = {
      x: 0,
      y: 0
    }
  }

  //TODO: I left off here trying to add Colliders to the project!
  #moveWithCollision(entity, nextX, nextY) {
    const p = { x: nextX, y: nextY }
    if (entity.colliders) {
      for (const collider of entity.colliders) {
        if (!collider.trigger) {
          continue
        }
        const verts = collider.getVerticesAtPoint(p)
        for (const other of this.entities) {
          if (other === entity) continue
          for (const colliderOther of other.colliders) {
            if (colliderOther.trigger) {
              // This is where i should do the circleVsCircle,
              // circleVsPolygon, and polygonVsPolygon check.
              for (const v of verts) {
                if (colliderOther.containsPoint(v)) {
                  return null
                }
              }
            }
          }
        }
      }
    }
    return p
  }

  handleDragging() {
    const pointer = Input.GetPointerCanvas()

    // Screen -> World
    const worldX = pointer.x / this.camera.zoom + this.camera.x
    const worldY = pointer.y / this.camera.zoom + this.camera.y
    const worldPoint = { x: worldX, y: worldY }

    // =========================
    // Start Input
    // =========================
    if (!this.draggedEntity && Input.GetPointerDown()) {
      this.eventDrag.worldPoint.x = worldX
      this.eventDrag.worldPoint.y = worldY

      let clickedEntity = null
      // Reverse loop = top-most entity first
      for (let i = this.entities.length - 1; i >= 0; i--) {
        const entity = this.entities[i]
        const colliders = entity.colliders
        if (!colliders) continue
        for (let collider of colliders) {
          if (collider.containsPoint(worldPoint)) {
            if (clickedEntity && clickedEntity.layer > entity.layer) {
              console.log("test sasda",collider)
              continue
            }
            this.eventDrag.collider = collider
            clickedEntity = entity
            console.log("collider sasda",collider)
          }
        }
      }

      // =========================
      // ENTITY DRAG
      // =========================
      if (clickedEntity) {
        this.eventDrag.dragStart.x = worldX
        this.eventDrag.dragStart.y = worldY
        this.draggedEntity = clickedEntity
        this.draggedEntity.onDragStart(this.eventDrag)
      }

      // =========================
      // CAMERA DRAG
      // =========================
      else {
        this.draggingCamera = true

        this.cameraDragStart.x = this.camera.x
        this.cameraDragStart.y = this.camera.y

        this.cameraPointerStart.x = pointer.x
        this.cameraPointerStart.y = pointer.y
      }
    }

    // =========================
    // ENTITY DRAGGING
    // =========================
    if (this.draggedEntity && Input.GetPointer()) {
      this.eventDrag.worldPoint.x = worldX
      this.eventDrag.worldPoint.y = worldY
      // const event = this.#moveWithCollision(this.draggedEntity, targetX, targetY)
      this.draggedEntity.onDrag(this.eventDrag)
    }

    // =========================
    // CAMERA DRAGGING
    // =========================
    if (this.draggingCamera && Input.GetPointer()) {
      const dx = (pointer.x - this.cameraPointerStart.x) / this.camera.zoom

      const dy = (pointer.y - this.cameraPointerStart.y) / this.camera.zoom

      this.camera.x = this.cameraDragStart.x - dx
      this.camera.y = this.cameraDragStart.y - dy
    }

    // =========================
    // RELEASE
    // =========================
    if (Input.GetPointerUp()) {
      // Release entity
      if (this.draggedEntity) {
        // this.draggedEntity.saveOldPostion()
        if (this.draggedEntity.onDragEnd) {
          this.draggedEntity.onDragEnd()
        }
        this.draggedEntity = null
      }
      this.draggingCamera = false
      this.eventDrag.collider = null
    }
  }
}

export class ClickController {
  constructor(scene) {
    if (!scene) {
      throw new Error('You Need To have A Scene Inorrder To Uses A Click Class')
    }
    const { camera, entities, gizmos } = { ...scene }
    this.camera = camera
    this.entities = entities
    this.gizmos = gizmos
    this.clickEntitys = []
  }

  handleClick() {
    const pointer = Input.GetPointerCanvas()
    // Screen -> World
    const worldX = pointer.x / this.camera.zoom + this.camera.x
    const worldY = pointer.y / this.camera.zoom + this.camera.y

    // =========================
    // Start Input
    // =========================
    if (Input.GetPointerDown()) {
      let clickedEntity = []
      for (let i = this.entities.length - 1; i >= 0; i--) {
        const entity = this.entities[i]
        if (entity.containsPoint(worldX, worldY)) {
          clickedEntity.push(entity)
        }
      }

      if (clickedEntity.length > 0) {
        for (const newEntity of clickedEntity) {
          const isDuplicate = this.clickEntitys.some((entity) => entity.id === newEntity.id)
          if (!isDuplicate) {
            this.clickEntitys.push(newEntity)
          }
        }
      }
    }

    if (this.clickEntitys.length > 0 && Input.GetPointer()) {
      for (const clickEntity of this.clickEntitys) {
        if (clickEntity.onPointerDown) {
          clickEntity.onPointerDown({ worldX, worldY })
        }
      }
    }

    // =========================
    // RELEASE
    // =========================
    if (Input.GetPointerUp()) {
      // Release entity
      if (this.clickEntitys.length > 0) {
        for (const clickEntity of this.clickEntitys) {
          if (clickEntity.containsPoint(worldX, worldY)) {
            if (clickEntity.onClick) {
              clickEntity.onClick({ worldX, worldY })
            }
          }
        }
        while (this.clickEntitys.length > 0) {
          this.clickEntitys.pop()
        }
      }
    }
  }
}
