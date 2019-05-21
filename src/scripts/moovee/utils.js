import { Values } from './constants'

/**
 * Check if the passed in method is a function, and calls it
 * @param  { function } method - function to call
 * @param  { object } params - params to pass to the method on call
 * @return { any } - whatever the passed in method returns
 */
export const checkCall = (method, ...params) => 
  isFunc(method) && method(...params) || undefined

/**
 * Check if the passed in item is a function
 * @param  { any } test 
 * @return { boolean }
 */
export const isFunc = func => typeof func === 'function'

export const uuid = a => a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,uuid)

export const addEvent = (domNode, type, method) => (
  domNode.addEventListener(type, method, false)
)
export const removeEvent = (domNode, type, method) => (
  domNode.removeEventListener(type, method, false)
)

export const swapElements = (node1, node2) => {
  const parent2 = node2.parentNode
  const nextNode2 = node2.nextSibling
  
  if (nextNode2 === node1)
    return parent2.insertBefore(node1, node2)
    
  node1.parentNode.insertBefore(node2, node1)

  nextNode2
    ? parent2.insertBefore(node1, nextNode2)
    : parent2.appendChild(node1)
}

export const moveElement = (node1, node2) => {
  console.log('------------------Need to add moveing to last el------------------');
  // TODO: Does not allow moving into last pos of list
  const parent = node2.parentNode
  parent && parent.insertBefore(node1, node2)
}


export const toggleNoPointerEvents = add => {
  let styleNode = document.getElementById(Values.MV_STYLE_ID)

  if(add){
    if(!styleNode){
      styleNode = document.createElement("style")
      styleNode.id = Values.MV_STYLE_ID
      styleNode.appendChild(document.createTextNode(""))
      document.head.appendChild(styleNode)
    }
    styleNode.sheet.insertRule(
      `.${Values.MV_DND_CLS} * { pointer-events: none !important; }`,
      0
    )
    return
  }

  styleNode && styleNode.sheet.deleteRule(0)
}

export const getSettings = mooVee => (
  mooVee && mooVee.settings && mooVee.rootEl && mooVee.settings[mooVee.rootEl.id]
)