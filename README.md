## Info
 * Simple DnD

## Example Code
```js

```

## Install

  * Download the repo
    ```js
      // Clone repo
      git clone https://github.com/lancetipton/Moo-Vee.git
      // Or Add to package.json
      "dependencies": {
        "moovee": "git+https://github.com/lancetipton/Moo-Vee.git"
        ...
      },
    ```
  * Add to your code
    ```js
      // * Import into code
        import mv from 'moovee'
        // Or only the methods you need
        import { drag, drop } from 'mv'

      // * Require code
        const moovee = require('moovee')
      
      // * Add as html script
        <script src='/path/to/moovee/build/moovee.min.js'></script>
        // moovee will be available on the window 
        <script>
          const moovee = window.moovee
        </script>
    ```

## Features
  * No Dependencies
  * Small
  * Super fast
  * Uses native dom api

## API
