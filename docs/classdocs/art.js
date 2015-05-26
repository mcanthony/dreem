/**
 * @class dr.art {UI Components}
 * @extends dr.view
 * Vector graphics support using svg.
 *
 * This example shows how to load an existing svg
 *
 *     @example
 *     <art width="100" height="100" src="${DREEM_ROOT + 'examples/img/siemens-clock.svg'}"></art>
 *
 * Paths within an svg can be selected using the path attribute
 *
 *     @example
 *     <art width="100" height="100" src="${DREEM_ROOT + 'examples/img/cursorshapes.svg'}" path="2"></art>
 *
 * Attributes are automatically passed through to the SVG. Here, the fill color is changed
 *
 *     @example
 *     <art width="100" height="100" src="${DREEM_ROOT + 'examples/img/cursorshapes.svg'}" path="2" fill="coral"></art>
 *
 * Setting the path attribute animates between paths. This example animates when the mouse is clicked
 *
 *     @example
 *     <art width="100" height="100" src="${DREEM_ROOT + 'examples/img/cursorshapes.svg'}" path="0" fill="coral">
 *       <handler event="onclick">
 *         this.setAttribute('path', this.path ^ 1);
 *       </handler>
 *     </art>
 *
 * The animationframe attribute controls which frame is displayed. The
 * value is a floating point number to display a frame between two
 * keyframes. For example, 1.4 will display the frame 40% between
 * paths 1 and 2. This example will animate between keyframes 0, 1, 2.
 *
 *     @example
 *     <art id="art_3" width="100" height="100" src="${DREEM_ROOT + 'examples/img/cursorshapes.svg'}" path="0" fill="coral" animationspeed="1000" animationcurve="linear">
 *       <handler event="onclick">
 *         this.setAttribute('animationframe', 0);
 *         this.animate({animationframe: 2}, 1000);
 *       </handler>
 *     </art>
 *
 * By default, the SVG's aspect ratio is preserved. Set the stretches attribute to true to change this behavior.
 *
 *     @example
 *     <art width="200" height="100" src="${DREEM_ROOT + 'examples/img/cursorshapes.svg'}" path="0" fill="coral" stretches="true">
 *       <handler event="onclick">
 *         this.setAttribute('path', this.path ^ 1);
 *         this.animate({width: (this.width == 200 ? 100 : 200)});
 *       </handler>
 *     </art>
 *
 * The art component can work with the animator component to control which
 * frame is displayed. For example, this will animate the graphic between
 * frames 0, 1, 2, 3, and display the frame inside the component.
 *
 *     @example
 *     <class name="centertext2" extends="text" color="white" height="40" x="${this.parent.width/2-this.width/2}" y="${this.parent.height/2-this.height/2}">
 *       <method name="format" args="value">
 *         value = Number(value);
 *         if (value < 0.0) return '';
 *         return value.toFixed(2);
 *       </method>
 *     </class>
 *     <art id="art_1" width="100" height="100" src="${DREEM_ROOT + 'examples/img/cursorshapes.svg'}" path="0" stroke="coral" fill="coral" stretches="true">
 *       <centertext2 text="${this.parent.animationframe}"></centertext2>
 *       <animator start="0" from="0" to="3" attribute="animationframe" duration="4000" motion = "outBounce" repeat="1">
 *       </animator>
 *     </art>
 *
 */
/**
  * @attribute {Boolean} [inline=false]
  * Set to true if the svg contents is found inline, as a comment
  */
/**
  * @attribute {Boolean} stretches [stretches=false]
  * Set to true to stretch the svg to fill the view.
  */
/**
  * @attribute {Boolean} [resize=false]
  * By default, the art component size is fixed to the specified size.
  * By setting resize=true, the art component is sized to the size 
  * embedded in the svg.
  */
/**
  * @attribute {String} src
  * The svg contents to load
  */
/**
  * @attribute {String|Number} path
  * The svg path element to display. Can either be the name of the &lt;g&gt; element containing the path or a 0-based index.
  */
/**
  * @attribute {Number} [animationspeed=400]
  * The number of milliseconds to use when animating between paths
  */
/**
  * @attribute {Number} [animationframe=0]
  * The current animation frame
  */
/**
  * @attribute {"linear"/"easeout"/"easein"/"easeinout"/"backin"/"backout"/"elastic"/"bounce"} [animationcurve="linear"]
  * The name of the curve to use when animating between paths
  */
/**
  * @event onready
  * Fired when the art is loaded and ready
  */
/**
  * @event ontween
  * Fired when the art has animated its path to the next position
  */
