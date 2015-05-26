/**
      * @class dr.sizetodom {UI Components}
      * @extends dr.state
      * Enables a view to size itself to the dom elements it contains. This
      * is a reversal of the standard relationship where the "model" pushes
      * changes into the DOM.
      * 
      * You can configure the markup either via the 'markup' attribute, or
      * you can put HTML inside the element and it will be used during
      * initialization. Once a component has been created you should only
      * update via the markup attribute.
      * 
      * If you set an explicit width or height sizing to dom will be suspended
      * for that axis. If later you want to restore the size to dom behavior
      * set the width or height to a value of 'auto'.
      *
      * If you make a modification to the DOM through a means other than
      * setting the markup attribute and that modification results in a change
      * in the size of the DOM you will need to call the sizeToDom method
      * to trigger an update of the width and height of the view.
      * 
      */
/**
    * Reduce number of sizeToDom calls during initialization.
    * @private
    */
/**
    * @method sizeToDom
    * Sizes this view to the current size of the DOM elements within it.
    * @returns {void}
    */
