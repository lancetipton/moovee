import {
  addEvent,
  checkCall,
  getSettings,
  moveElement,
  removeEvent,
  swapElements,
  toggleNoPointerEvents,
} from './utils'
import { Values } from './constants'

const getDomNode = (dragItems, id) => (
  dragItems && id && dragItems[id]
)

const afterDragCleanup = (mooVee) => {
  Object
    .entries(mooVee.dragItems)
    .map(([id, child]) => child.el.classList.remove(Values.MV_DND_OVER_CLS))
  // Turn no pointer events off
  toggleNoPointerEvents(false)
  mooVee.hasClone = undefined
  mooVee.activeDragId = undefined
}

const executeDragAction = (mooVee, dragConf, passiveConf, settings) => {
  if(!mooVee) return
  settings = settings || getSettings(mooVee)
  switch(settings.action){
    case Values.DRAG_ACTIONS.SWAP: {
      swapElements(dragConf.el, passiveConf.el)
      break
    }
    case Values.DRAG_ACTIONS.MOVE: {
      moveElement(dragConf.el, passiveConf.el)
      break
    }
    case Values.DRAG_ACTIONS.CLONE: {
      mooVee.hasClone &&
        moveElement(dragConf.el, passiveConf.el)
      break
    }
  }

}

export function mousedown(id, buildDragEl, e){
  const { events, dragItems } = this
  const dragConf = getDomNode(dragItems, id)  
  if(!dragConf || dragConf.locked) return
  
  const settings = getSettings(this)
  const shouldClone = dragConf.clone || settings.action === Values.DRAG_ACTIONS.CLONE
  // Check if the item is set to clone
  if(shouldClone && !this.hasClone){
    // If it's set to clone, then copy it and build the clone dragItem
    this.hasClone = true
    const nodeClone = dragConf.el.cloneNode(true)
    nodeClone.removeAttribute(Values.DRAGGABLE)
    nodeClone.classList.remove(Values.MV_DRAG_CLS)
    nodeClone.id = undefined
    dragConf.el.parentNode.insertBefore(nodeClone, dragConf.el.nextSibling)
    buildDragEl(this, nodeClone)
  }

  dragConf.el.setAttribute(Values.DRAGGABLE, true)
}

// mouse events
export function dragstart(id, e){
  const { dragItems} = this
  const dragConf = getDomNode(dragItems, id)
  if(!dragConf || dragConf.locked) return

  const settings = getSettings(this)

  checkCall(settings.onDragStart, e, this, dragConf)
  // Turn no pointer events on
  toggleNoPointerEvents(true)
  
  this.activeDragId = id
  dragConf.el.classList.add(Values.MV_DRAG_CLS)
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/html', dragConf.el.outerHTML)
  settings.dragImage && e.dataTransfer.setDragImage(settings.dragImage, 0, 50)
}

export function dragover(id, e) {
  const { dragItems, activeDragId } = this
  const passiveConf = getDomNode(dragItems, id)
  const dragConf = getDomNode(dragItems, activeDragId)
  if(!passiveConf || !dragConf || dragConf.el === passiveConf.el) return false
  
  const settings = getSettings(this)
  checkCall(settings.onDragOver, e, this, dragConf, passiveConf)

  if (e.preventDefault) e.preventDefault()
  e.dataTransfer.dropEffect = 'move'

  return false
}

export function dragenter(id, e) {
  const { dragItems, activeDragId } = this
  const passiveConf = getDomNode(dragItems, id)
  const dragConf = getDomNode(dragItems, activeDragId)
  
  if(!passiveConf || !dragConf || dragConf.el === passiveConf.el || passiveConf.locked)
    return
  
  const settings = getSettings(this)
  checkCall(settings.onDragEnter, e, this, dragConf, passiveConf)

  settings.actionOnDrag &&
    executeDragAction(this, dragConf, passiveConf, settings)

  passiveConf.el.classList.add(Values.MV_DND_OVER_CLS)
}

export function dragleave(id, e) {
  const { dragItems, activeDragId } = this
  const passiveConf = getDomNode(dragItems, id)
  const dragConf = getDomNode(dragItems, activeDragId)
  if(!passiveConf || !dragConf || dragConf.el === passiveConf.el) return false
  
  const settings = getSettings(this)
  checkCall(settings.onDragLeave, e, this, dragConf, passiveConf)

  passiveConf.el.classList.remove(Values.MV_DND_OVER_CLS)
}

export function drag(id, e){
  const { events, dragItems } = this
  const dragConf = getDomNode(dragItems, id)
  if(!dragConf) return
  
  const settings = getSettings(this)
  checkCall(settings.onDrag, e, this, dragConf)

  return false
}

export function dragend(id, e){
  const { events, settings, dragItems } = this
  const dragConf = getDomNode(dragItems, id)
  if(!dragConf) return

  checkCall(settings.onDragEnd, e, this, dragConf)
  
  dragConf.el.removeAttribute(Values.DRAGGABLE)
  dragConf.el.classList.remove(Values.MV_DRAG_CLS)

  afterDragCleanup(this)
}

export function drop(id, e){
  if (e.stopPropagation) e.stopPropagation()

  const { dragItems, activeDragId } = this
  const passiveConf = getDomNode(dragItems, id)
  const dragConf = getDomNode(dragItems, activeDragId)
  if(!passiveConf || !dragConf || dragConf.el === passiveConf.el || passiveConf.locked)
    return
  
  const settings = getSettings(this)
  checkCall(settings.onDrop, e, this, dragConf, passiveConf)

  !settings.actionOnDrag &&
    executeDragAction(this, dragConf, passiveConf, settings)

  return false
}