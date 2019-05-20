import { uuid, addEvent, removeEvent } from './utils'
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
  child.el.classList.remove(Values.MV_DND_CLS)
  removeEvent(child.handel, 'mousedown', mooVee.dragItems[child.id].mousedown)
  Values.DRAG_EVENTS.map(name => 
    removeEvent(child.el, name, mooVee.dragItems[child.id][name])
  )
  child.handel.style.cursor = undefined
}

const cleanUp = mooVee => {
  mooVee.rootEl.classList.remove(Values.MV_DND_ROOT_CLS)
  Object.entries(mooVee.dragItems).map(([ id, child ]) => {
    cleanNode(child, mooVee)
    mooVee.dragItems[id].handel = undefined
    mooVee.dragItems[id].el = undefined
    mooVee.dragItems[id] = undefined
  })
  mooVee.dragItems = {}
  mooVee.rootEl = undefined
  const styleNode = document.getElementById(Values.MV_STYLE_ID)
  styleNode && styleNode.parentNode.removeChild(styleNode)
}

const buildDragEl = (mooVee, domNode, settings) => {
  const { events } = mooVee
  const data = {}
  const id = domNode.id || uuid()
  if(!domNode.id) domNode.id = id
  domNode.classList.add(Values.MV_DND_CLS)
  
  mooVee.dragItems[id] = {
    handel: domNode.querySelector(settings.handel) || domNode,
    el: domNode,
    id: id,
    events: {}
  }
  mooVee.dragItems[id].handel.style.cursor = 'pointer'
  mooVee.dragItems[id].data = data  // add init events to handle
  mooVee.dragItems[id].events.mousedown = events.mousedown.bind(mooVee, id, buildDragEl)
  addEvent(
    mooVee.dragItems[id].handel, 'mousedown', mooVee.dragItems[id].events.mousedown)
  
  Values.DRAG_EVENTS.map(name => {
    mooVee.dragItems[id].events[name] = events[name].bind(mooVee, id)
    addEvent(domNode, name, mooVee.dragItems[id].events[name])
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
    this.rootEl.classList.add(Values.MV_DND_ROOT_CLS)
    this.dragItems = {}
    buildMooVee(this, settings)
  }

  reload = settings => {
    settings = settings || this.settings
    this.destroy()
    buildMooVee(this, settings)
  }
  
  lock = (id, state) => {
    const dragItem = mooVee.dragItems[id]
    if(!dragItem) return
    dragItem.locked = state
    dragItem.locked
      ? dragItem.el.classList.add(Values.MV_DND_LOCKED_CLS)
      : dragItem.el.classList.remove(Values.MV_DND_LOCKED_CLS)
  }
  
  destroy = () => cleanUp()
}


export default (el, settings) => new MooVee(el, settings)
