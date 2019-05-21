document.addEventListener('DOMContentLoaded', () => {
  let mvNode = document.getElementById('moovee')
  let mvNode2 = document.getElementById('moovee-2')
  let mvNode3 = document.getElementById('moovee-3')
  
  const dragOpts = {
    global: false,
    /*
      * Allow dragging item from any MooVee list TO any MooVee list when true
      * Defaults to only dragging within the parent
    */
    action: 'move',
      /*
        * Type of action to execute when dragging
        * Must be one of:
          * move
            * Move a dom node from current location to dragged location
          * swap
            * Swap positions between the dragged dom node, and dragged-over dom node
          * clone
            * Clones currently dragged dom node, and places into dropped postilion
      */
    actionOnDrag: true,
      // Executes action while dragging
    dragImage: undefined,
    // Image shown when dragging
    
    handel: undefined,
      /*
        * Handel to initialize dragging
        * Must be a child element of the drag-able dom node
        * i.e. Parent => Child ( drag-able ) => Child ( handel )
      */
    // --- Callback events --- //
    onDragStart: undefined,
    onDragOver: undefined,
    onDragEnter: undefined,
    onDragLeave: undefined,
    onDrag: undefined,
    onDragEnd: undefined,
    onDrop: undefined,
  }
  
  moovee.default(mvNode, { handel: '.handel', global: true, action: 'swap' })
  moovee.default(mvNode2, { global: true, action: 'swap' })
  moovee.default(mvNode3, {})
  
})
