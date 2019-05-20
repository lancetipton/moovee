const noOp = () => {}

export const Values = Object.freeze({
  ITEM_DRAG_EVENTS: Object.freeze([
    'drag',
    'dragenter',
    'dragover',
    'dragleave',
    'dragend',
  ]),
  NODE_EVENTS: Object.freeze([
    'dragstart',
    'dragenter',
    'dragover',
    'drag',
    'dragleave',
    'dragend',
    'drop',
  ]),
  USER_EVENTS: Object.freeze({
    onDragStart: noOp,
    onDrag: noOp,
    onDragOver: noOp,
    onDragEnter: noOp,
    onDragLeave: noOp,
    onDragEnd: noOp,
  }),
  SETTINGS: Object.freeze({
    constrain: false,
    relativeTo: null,
    handle: null,
    highlightInputs: false,
  }),
})