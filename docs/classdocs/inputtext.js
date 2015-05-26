/**
     * @class dr.inputtext {UI Components, Input}
     * @extends dr.view
     * Provides an editable input text field.
     *
     *     @example
     *     <spacedlayout axis="y" spacing="10"></spacedlayout>
     *
     *     <text text="Enter your name:"></text>
     *
     *     <inputtext id="nameinput" width="200"></inputtext>
     *
     *     <labelbutton text="submit">
     *       <handler event="onclick">
     *         welcome.setAttribute('text', 'Welcome ' + nameinput.text);
     *       </handler>
     *     </labelbutton>
     *
     *     <text id="welcome"></text>
     *
     * It's possible to listen for an onchange event to find out when the user changed the inputtext value:
     *
     *     @example
     *     <spacedlayout axis="y" spacing="10"></spacedlayout>
     *     <text text="Type some text below and press enter:"></text>
     *     <inputtext id="nameinput" width="200" onchange="alert('onchange event: ' + this.text)"></inputtext>
     *
     */
/**
   * @event onselect
   * Fired when an inputtext is selected
   * @param {dr.view} view The view that fired the event
   */
/**
   * @event onchange
   * Fired when an inputtext has changed
   * @param {dr.view} view The view that fired the event
   */
/**
   * @event onfocus
   * Fired when an inputtext is focused
   * @param {dr.view} view The view that fired the event
   */
/**
   * @event onblur
   * Fired when an inputtext is blurred or loses focus
   * @param {dr.view} view The view that fired the event
   */
/**
   * @event onkeydown
   * Fired when a key goes down
   * @param {Object} keys An object representing the keyboard state, including shiftKey, allocation, ctrlKey, metaKey, keyCode and type
   */
/**
   * @event onkeyup
   * Fired when a key goes up
   * @param {Object} keys An object representing the keyboard state, including shiftKey, allocation, ctrlKey, metaKey, keyCode and type
   */
/**
   * @attribute {Boolean} [multiline=false]
   * Set to true for a multi-line input text field
   */
/**
       * @attribute {String} [text=""]
       * The contents of this input text field
       */
/**
    * @method format
    * Format the text to be displayed. The default behavior is to
    * return the text intact. Override to change formatting.
    * @param {String} str The current value of the text component.
    * @return {String} The formated string to display in the component.
    */
