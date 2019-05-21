import { uuid, addEvent, removeEvent, getSettings } from './utils'
import { Values } from './constants'
import * as Events from './events'
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

let GLOBAL_MV

const setupGlobal = (mooVee, settings, children) => {

  if(!GLOBAL_MV) {
    mooVee.global = true
    GLOBAL_MV = setupMooVee(mooVee, settings, children)
  }

  // If global already exists, add current group to the settings
  GLOBAL_MV.settings[mooVee.rootEl.id] = { ...GLOBAL_MV.settings, ...settings }
  // Add the children to the global MooVee object
  children && children.map(child => buildDragEl(GLOBAL_MV, child) )
}

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
  // If it's the global MooVee, clear it out
  if(mooVee === GLOBAL_MV) GLOBAL_MV = undefined
}

const updateItemState = (dragItem, attr, state, cls) => {
  dragItem[attr] = state
  if(!cls) return
  dragItem[attr]
    ? dragItem.el.classList.add(cls)
    : dragItem.el.classList.remove(cls)
}

const buildDragEl = (mooVee, domNode) => {
  const { events } = mooVee
  const settings = getSettings(mooVee)
  const id = domNode.id || uuid()
  if(!domNode.id) domNode.id = id
  
  if(mooVee.dragItems[id]) return
  
  domNode.classList.add(Values.MV_DND_CLS)
  mooVee.dragItems[id] = {
    handel: domNode.querySelector(settings.handel) || domNode,
    el: domNode,
    id: id,
    parent: mooVee.rootEl.id,
    events: {}
  }
  
  Object.keys(Values.UPDATE_PROPS_CLS).entries(([ name, cls ]) => {
    domNode.classList.contains(cls) &&
      (mooVee.dragItems[id][name] = true)
  })

  mooVee.dragItems[id].handel.style.cursor = 'pointer'
  mooVee.dragItems[id].events.mousedown = events.mousedown.bind(mooVee, id, buildDragEl)
  addEvent(
    mooVee.dragItems[id].handel, 'mousedown', mooVee.dragItems[id].events.mousedown)
  
  Values.DRAG_EVENTS.map(name => {
    mooVee.dragItems[id].events[name] = events[name].bind(mooVee, id)
    addEvent(domNode, name, mooVee.dragItems[id].events[name])
  })
}

// Add root events to the MooVee Class
const setupEvents = mooVee => {
  Object.entries(Events)
    .map(([name, method]) => mooVee.events[name] = method.bind(mooVee))
}

const setupMooVee = (mooVee, settings, children) => {
  mooVee.settings = { [mooVee.rootEl.id]: settings }
  setupEvents(mooVee)
  // Build the draggable children
  children && children.map(child => buildDragEl(mooVee, child))

  return mooVee
}

const buildMooVee = (mooVee, settings) => {
  settings = { ...Values.SETTINGS, ...settings }
  const children = Array.from(mooVee.rootEl.children)
  
  settings.global
    ? setupGlobal(mooVee, settings, children)
    : setupMooVee(mooVee, settings, children)
}

class MooVee {

  constructor(el, settings){
    if (!el) throw Error('Moovee requires a dom node as the first argument')
    this.rootEl = el
    this.rootEl.classList.add(Values.MV_DND_ROOT_CLS)
    this.rootEl.id = this.rootEl.id || uuid()
    this.dragItems = {}
    buildMooVee(this, settings)
  }
  
  events = {}
  
  reload = settings => {
    settings = settings || this.settings
    this.destroy()
    buildMooVee(this, settings)
  }

  updateItem = (id, prop, state) => {
    Values.UPDATE_PROPS_CLS[prop] &&
      mooVee.dragItems[id] &&
        updateItemState(
          mooVee.dragItems[id],
          prop,
          state,
          Values.UPDATE_PROPS_CLS[prop]
        )
  }
  
  destroy = () => cleanUp()
}


export default (el, settings) => new MooVee(el, settings)
