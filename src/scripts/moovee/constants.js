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
  DRAG_ACTIONS: Object.freeze({
    MOVE: 'move',
    SWAP: 'swap',
    CLONE: 'clone',
  }),
  SETTINGS: Object.freeze({
    global: false,
    action: 'move',
    actionOnDrag: true,
    dragImage: undefined,
    handle: undefined,
    onDragStart: undefined,
    onDrag: undefined,
    onDragOver: undefined,
    onDragEnter: undefined,
    onDragLeave: undefined,
    onDragEnd: undefined,
    onDrop: undefined,
  }),
  UPDATE_PROPS_CLS: Object.freeze({
    locked: 'mv-dnd-locked',
    clone: 'mv-dnd-clone',
  }),
  MV_DND_ROOT_CLS: 'mv-dnd-container',
  MV_DND_CLS: 'mv-dnd-item',
  MV_DRAG_CLS: 'mv-dnd-drag-item',
  MV_DND_OVER_CLS: 'mv-dnd-over-item',
  MV_STYLE_ID: 'mv-dnd-item-styles',
  DRAGGABLE: 'draggable',
})