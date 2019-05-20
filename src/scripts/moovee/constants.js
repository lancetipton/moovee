const noOp = () => {}

export const Values = Object.freeze({
  DRAG_EVENTS: Object.freeze([
    'dragstart',
    'drag',
    'dragover',
    'dragenter',
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
    onDrop: noOp,
  }),
  SETTINGS: Object.freeze({
    autoSwap: true,
    noSwap: false,
    handle: null,
  }),
  MV_DND_ROOT_CLS: 'mv-dnd-container',
  MV_DND_CLS: 'mv-dnd-item',
  MV_DRAG_CLS: 'mv-dnd-drag-item',
  MV_DND_OVER_CLS: 'mv-dnd-over-item',
  MV_STYLE_ID: 'mv-dnd-item-styles',
  MV_DND_LOCKED_CLS: 'mv-dnd-locked'
})