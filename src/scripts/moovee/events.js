import { generateMoveFn, addEvent, removeEvent } from './utils'
import { Values } from './constants'

const move = generateMoveFn()

const getDomNode = (dragItems, id) => (
  dragItems[id] && dragItems[id].el
)

export function mousedown(id, e){
  const { events, dragItems } = this
  const domNode = getDomNode(dragItems, id)
  if(!domNode) return
    
  domNode.setAttribute('draggable', true)
}

export function dragover(id, e) {
  const { dragItems, activeDragId } = this
  const passiveNode = getDomNode(dragItems, id)
  const dragNode = getDomNode(dragItems, activeDragId)
  if(!passiveNode || !dragNode || dragNode === passiveNode) return false
  
  if (e.preventDefault) e.preventDefault()
  e.dataTransfer.dropEffect = 'move'

  return false
}

export function dragenter(id, e) {
  const { dragItems, activeDragId } = this
  const passiveNode = getDomNode(dragItems, id)
  const dragNode = getDomNode(dragItems, activeDragId)
  if(!passiveNode || !dragNode || dragNode === passiveNode) return
  
  passiveNode.classList.add('over');
}

export function dragleave(id, e) {
  const { dragItems, activeDragId } = this
  const passiveNode = getDomNode(dragItems, id)
  const dragNode = getDomNode(dragItems, activeDragId)
  if(!passiveNode || !dragNode || dragNode === passiveNode) return false
  
  passiveNode.classList.remove('over');
}

// mouse events
export function dragstart(id, e){
  const { events, settings, dragItems } = this
  const domNode = getDomNode(dragItems, id)
  if(!domNode) return

  if (typeof settings.onDragStart === 'function')
    settings.onDragStart(domNode, e)
  
  this.dragItems[id].drag = events.drag.bind(this, id)
  this.dragItems[id].dragend = events.dragend.bind(this, id)
  this.activeDragId = id
  addEvent(domNode, 'drag', this.dragItems[id].drag)
  addEvent(domNode, 'dragend', this.dragItems[id].dragend)
  
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/html', domNode.outerHTML)
  // e.dataTransfer.setDragImage(domNode, 0, 0)
}

export function drag(id, offsetW, offsetH, e){

  const { events, settings, dragItems } = this
  const domNode = getDomNode(dragItems, id)
  if(!domNode) return

  if (typeof settings.onDrag === 'function')
    settings.onDrag(domNode, e)

  return false
}

export function dragend(id, e){
  const { events, settings, dragItems } = this
  const domNode = getDomNode(dragItems, id)
  if(!domNode) return

  if (typeof settings.onDragEnd === 'function')
    settings.onDragEnd(domNode, e)
  
  Values.ITEM_DRAG_EVENTS.map(name => {
    removeEvent(domNode, name, this.dragItems[id][name])
    this.dragItems[id][name] = undefined
  })

  domNode.removeAttribute('draggable')
  this.activeDragId = undefined
}


export function drop(id, e){
  if (e.stopPropagation)
    e.stopPropagation()
    
    
  const { dragItems, activeDragId, settings } = this
  const passiveNode = getDomNode(dragItems, id)
  const dragNode = getDomNode(dragItems, activeDragId)
  if(!passiveNode || !dragNode || dragNode === passiveNode) return

  if (typeof settings.onDrop === 'function')
    settings.onDrop(domNode, passiveNode, e)
  
  // Do update here
  console.log('------------------Do update here------------------');
  console.log(e.dataTransfer.getData('text/html'));
  // dragSrcEl.innerHTML = this.innerHTML
  // this.innerHTML = e.dataTransfer.getData('text/html')
  Object.entries(dragItems).map(([id, child]) => child.el.classList.remove('over'))

  return false;
}