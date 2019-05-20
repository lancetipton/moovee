import {
  addEvent,
  removeEvent,
  checkCall,
  toggleNoPointerEvents,
  swapElements
} from './utils'
import { Values } from './constants'

const getDomNode = (dragItems, id) => (
  dragItems[id] && dragItems[id].el
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

export function mousedown(id, buildDragEl, e){
  const { events, dragItems, settings } = this
  const dragNode = getDomNode(dragItems, id)  
  if(!dragNode || !dragItems[id] || dragItems[id].locked) return
  
  // Check if the item is set to clone
  if(dragItems[id].clone && !this.hasClone){
    // If it's set to clone, then copy it and build the clone dragItem
    this.hasClone = true
    const nodeClone = dragNode.cloneNode(true)
    nodeClone.removeAttribute('draggable')
    nodeClone.classList.remove(Values.MV_DRAG_CLS)
    nodeClone.id = undefined
    dragNode.parentNode.insertBefore(nodeClone, dragNode.nextSibling)
    buildDragEl(this, nodeClone, settings)
  }

  // Turn no pointer events on
  toggleNoPointerEvents(true)
  dragNode.setAttribute('draggable', true)
}

// mouse events
export function dragstart(id, e){
  const { dragItems, settings } = this
  const dragNode = getDomNode(dragItems, id)
  if(!dragNode) return

  checkCall(settings.onDragStart, e, this, dragNode)

  this.activeDragId = id
  dragNode.classList.add(Values.MV_DRAG_CLS)
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/html', dragNode.outerHTML)
  // e.dataTransfer.setDragImage(dragNode, 0, 0)
}

export function dragover(id, e) {
  const { dragItems, activeDragId, settings } = this
  const passiveNode = getDomNode(dragItems, id)
  const dragNode = getDomNode(dragItems, activeDragId)
  if(!passiveNode || !dragNode || dragNode === passiveNode) return false
  
  checkCall(settings.onDragOver, e, this, dragNode, passiveNode)

  if (e.preventDefault) e.preventDefault()
  e.dataTransfer.dropEffect = 'move'

  return false
}

export function dragenter(id, e) {
  const { dragItems, activeDragId, settings } = this
  const passiveDrag = dragItems[id]
  const passiveNode = passiveDrag && passiveDrag.el
  const dragNode = getDomNode(dragItems, activeDragId)
  if(!passiveNode || !dragNode || dragNode === passiveNode || passiveDrag.locked)
    return

  checkCall(settings.onDragEnter, e, this, dragNode, passiveNode)
  
  // If noSwap is falsy, that means we SHOULD swap the elements
  !settings.noSwap &&
    // If autoSwap is not false, then autoSwap the elements on dragEnter
    settings.autoSwap !== false &&
    swapElements(dragNode, passiveNode)

  passiveNode.classList.add(Values.MV_DND_OVER_CLS)

}

export function dragleave(id, e) {
  const { dragItems, activeDragId, settings } = this
  const passiveNode = getDomNode(dragItems, id)
  const dragNode = getDomNode(dragItems, activeDragId)
  if(!passiveNode || !dragNode || dragNode === passiveNode) return false
  
  checkCall(settings.onDragLeave, e, this, dragNode, passiveNode)

  passiveNode.classList.remove(Values.MV_DND_OVER_CLS)
}

export function drag(id, e){
  const { events, settings, dragItems } = this
  const dragNode = getDomNode(dragItems, id)
  if(!dragNode) return

  checkCall(settings.onDrag, e, this, dragNode)

  return false
}

export function dragend(id, e){
  const { events, settings, dragItems } = this
  const dragNode = getDomNode(dragItems, id)
  if(!dragNode) return

  checkCall(settings.onDragEnd, e, this, dragNode)
  
  dragNode.removeAttribute('draggable')
  dragNode.classList.remove(Values.MV_DRAG_CLS)

  afterDragCleanup(this)
}

export function drop(id, e){
  if (e.stopPropagation) e.stopPropagation()

  const { dragItems, activeDragId, settings } = this
  const passiveNode = getDomNode(dragItems, id)
  const dragNode = getDomNode(dragItems, activeDragId)
  if(!passiveNode || !dragNode || dragNode === passiveNode || dragItems[id].locked) return

  checkCall(settings.onDrop, e, this, dragNode, passiveNode)
  
  // If noSwap is falsy, that means we SHOULD swap the elements
  !settings.noSwap &&
    // If autoSwap if false it means we didn't swap in dragEnter so do it now
    settings.autoSwap === false &&
    swapElements(dragNode, passiveNode)

  return false
}