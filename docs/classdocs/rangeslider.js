/**
   * @class dr.rangeslider {UI Components}
   * @extends dr.view
   * An input component whose upper and lower bounds are changed via mouse clicks or drags.
   *
   *     @example
   *
   *     <rangeslider name="range" width="300" height="40" x="10" y="30" lowselectcolor="#00CCFF" highselectcolor="#FFCCFF" outline="2px dashed #00CCFF"
   *                  lowvalue="30"
   *                  highvalue="70">
   *     </rangeslider>
   *
   *     <text name="rangeLabel" color="white" height="40"
   *           y="${this.parent.range.y + (this.parent.range.height / 2) - (this.height / 2)}"
   *           x="${(this.parent.range.lowvalue * 3) + (((this.parent.range.highvalue * 3) - (this.parent.range.lowvalue * 3)) / 2) - (this.width / 2)}"
   *           text="${Math.round(this.parent.range.lowvalue) + ' ~ ' + Math.round(this.parent.range.highvalue)}"></text>
   *
   *
   * A range slider highlights the inclusive values by default, however this behavior can be reversed with `exclusive="true"`.
   * The following example demonstrates an exclusive-valued, inverted (range goes from high to low) horizontal slider.
   *
   *     @example
   *
   *     <rangeslider name="range" width="400" x="10" y="30" lowselectcolor="#AACCFF" highselectcolor="#FFAACC""
   *                  height="30"
   *                  lowvalue="45"
   *                  highvalue="55"
   *                  invert="true"
   *                  exclusive="true">
   *     </rangeslider>
   *
   *     <text name="highRangeLabel" color="#666" height="20"
   *           y="${this.parent.range.y + (this.parent.range.height / 2) - (this.height / 2)}"
   *           x="${(((this.parent.range.maxvalue * 4) - (this.parent.range.highvalue * 4)) / 2) - (this.width / 2)}"
   *           text="${this.parent.range.maxvalue + ' ~ ' + Math.round(this.parent.range.highvalue)}"></text>
   *
   *     <text name="lowRangeLabel" color="#666" height="20"
   *           y="${this.parent.range.y + (this.parent.range.height / 2) - (this.height / 2)}"
   *           x="${(this.parent.range.width - (this.parent.range.lowvalue * 4)) + (((this.parent.range.lowvalue * 4) - (this.parent.range.minvalue * 4)) / 2) - (this.width / 2)}"
   *           text="${Math.round(this.parent.range.lowvalue) + ' ~ ' + this.parent.range.minvalue}"></text>
   *
   */
/**
      * @attribute {Number} [minvalue=0]
      * The minimum value of the slider
      */
/**
    * @attribute {Number} [minhighvalue=0]
    * The minimum value of the right slider
    */
/**
      * @attribute {Number} [maxvalue=100]
      * The maximum value of the slider
      */
/**
      * @attribute {Number} [maxlowvalue=100]
      * The maximum value of the lower bound slider
      */
/**
      * @attribute {"x"/"y"} [axis=x]
      * The axis to track on
      */
/**
      * @attribute {Boolean} [invert=false]
      * Set to false to have the scale run lower to higher, true to run higher to lower.
      */
/**
      * @attribute {Boolean} [exclusive=false]
      * Set to true to highlight the outer (exclusive) values of the range, false to select the inner (inclusive) values.
      */
/**
      * @attribute {Number} [lowvalue=50]
      * The current value of the left slider.
      * Use changeLowValue() to range check the number and set the value.
      */
/**
      * @attribute {Number} [highvalue=50]
      * The current value of the right slider.
      * Use changeHighValue() to range check the number and set the value.
      */
/**
      * @attribute {String} [lowselectcolor="#a0a0a0"]
      * The selected color of the lower bound slider.
      */
/**
      * @attribute {String} [highselectcolor="#a0a0a0"]
      * The selected color of the upper bound slider.
      */
