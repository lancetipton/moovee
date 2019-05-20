
export const generateClamp = (min, max) => (val => (Math.min(Math.max(val, min), max)))

export const generateMoveFn = () => (
  window.requestAnimationFrame
    ? (el, x, y) => {
      window.requestAnimationFrame(() => {
        el.style.left = x + 'px'
        el.style.top = y + 'px'
      })
    }
  : (el, x, y) => {
    el.style.left = x + 'px'
    el.style.top = y + 'px'
  }
)

export const isRelative = el => (window.getComputedStyle(el).position === 'relative')

export const uuid = a => a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,uuid)


export const addEvent = (domNode, type, method) => (
  domNode.addEventListener(type, method, false)
)
export const removeEvent = (domNode, type, method) => (
  domNode.removeEventListener(type, method, false)
)