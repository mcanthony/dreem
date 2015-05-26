/**
   * @class dr.labelbutton {UI Components}
   * @extends dr.buttonbase
   * Button class consisting of text centered in a view. The onclick event
   * is generated when the button is clicked. The visual state of the
   * button changes during onmousedown/onmouseup.
   *
   *     @example
   *     <spacedlayout axis="y"></spacedlayout>
   *
   *     <labelbutton text="click me">
   *       <handler event="onclick">
   *         hello.setAttribute('text', 'Hello Universe!');
   *       </handler>
   *     </labelbutton>
   *
   *     <text id="hello"></text>
   */
/**
    * @attribute {String} [bgcolor]
    * Sets this view's background color, same as setting defaultcolor.
    */
