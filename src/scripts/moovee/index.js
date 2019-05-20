import { generateClamp, isRelative, uuid, addEvent, removeEvent } from './utils'
import { Values } from './constants'
import {
  dragstart,
  drag,
  dragend,
  dragenter,
  dragleave,
  dragover,
  drop,
  mousedown
} from './events'

const cleanNode = (child, mooVee) => {
  removeEvent(child.handel, 'mousedown', mooVee.dragItems[child.id].mousedown)
  Values.NODE_EVENTS.map(name => {
    removeEvent(child.el, name, mooVee.dragItems[child.id][name])
  })
}

const cleanUp = mooVee => {
  Object.entries(mooVee.dragItems).map(([ id, child ]) => cleanNode(child, mooVee))

}

const buildDragEl = (mooVee, domNode, settings) => {
  const { events } = mooVee
  const data = {}
  const id = domNode.id || uuid()
  if(!domNode.id) domNode.id = id

  mooVee.dragItems[id] = {
    handel: domNode.querySelector(settings.handel) || domNode,
    el: domNode,
    id: id
  }

  // generate min / max ranges
  if (settings.constrain){
    const relTo = settings.relativeTo || domNode.parentNode
    
    let traverse = domNode
    let minX = 0
    let minY = 0
    while (traverse !== relTo){
      traverse = traverse.parentNode
      if (isRelative(traverse)){
        minX -= traverse.offsetLeft
        minY -= traverse.offsetTop
      }
      if (traverse === relTo){
        minX += traverse.offsetLeft
        minY += traverse.offsetTop
      }
    }

    const maxX = minX + relTo.offsetWidth - domNode.offsetWidth
    const maxY = minY + relTo.offsetHeight - domNode.offsetHeight

    data.xClamp = generateClamp(minX, maxX)
    data.yClamp = generateClamp(minY, maxY)
  }

  mooVee.dragItems[id].data = data

  // add init events to handle
  mooVee.dragItems[id].mousedown = events.mousedown.bind(mooVee, id)
  addEvent(mooVee.dragItems[id].handel, 'mousedown', mooVee.dragItems[id].mousedown)
  
  Values.NODE_EVENTS.map(name => {
    mooVee.dragItems[id][name] = events[name].bind(mooVee, id)
    addEvent(domNode, name, mooVee.dragItems[id][name])
  })
}

const buildMooVee = (mooVee, settings) => {
  // Add in user callbacks with Values.USER_EVENTS
  // Then add again with settings
  settings = { ...Values.SETTINGS, ...settings }
  mooVee.settings = settings

  // Add root events to the MooVee Class
  mooVee.events = {
    mousedown: mousedown.bind(mooVee),
    dragstart: dragstart.bind(mooVee),
    drag: drag.bind(mooVee),
    drop: drop.bind(mooVee),
    dragover: dragover.bind(mooVee),
    dragenter: dragenter.bind(mooVee),
    dragleave: dragleave.bind(mooVee),
    dragend: dragend.bind(mooVee),
  }

  // Build the draggable children
  Array
    .from(mooVee.rootEl.children)
    .map(child => buildDragEl(mooVee, child, settings))
}


class MooVee {

  constructor(el, settings){
    if (!el) throw Error('Moovee requires a dom node as the first argument')
    this.rootEl = el
    this.dragItems = {}
    buildMooVee(this, settings)
  }

  reload = settings => {
    settings = settings || this.settings
    this.destroy()
    buildMooVee(this, settings)
  }
  
  destroy = () => cleanUp()
}


export default (el, settings) => new MooVee(el, settings)
